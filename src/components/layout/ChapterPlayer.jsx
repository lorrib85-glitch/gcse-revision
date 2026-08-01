import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { BUTTONS } from '../../constants/buttons.js'
import { recordActivity, getChapterState, saveChapterState } from '../../progress.js'
import { MODULES } from '../../data/modules.js'
import { isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation, computeInitialChapterState, clampScreenIndex, resolveFinishAction, getChapterGate, buildChapterProgressState, buildCompletedChapterState } from '../../app/chapterNavigation.js'
import { findScreenIndexByType, resolveScreenDefinition, screenHasComponentOwnedContinuation, validateChapterDefinition } from '../../data/screenRegistry.js'
import ChapterHookScreen from './ChapterHookScreen.jsx'
import QuickRecallScreen from '../learning/QuickRecallScreen.jsx'
import LearningHeader from '../core/LearningHeader.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import FaceTheExaminer from '../learning/FaceTheExaminer.jsx'
import WeakSpotRecovery from '../learning/WeakSpotRecovery.jsx'
import RecoveryQuizPlayer from '../learning/RecoveryQuizPlayer.jsx'
import ChapterOutcomeScreen from './ChapterOutcomeScreen.jsx'
import ExaminerExplainsScreen from '../learning/ExaminerExplainsScreen.jsx'
import ContentShell from './ContentShell.jsx'
import ScreenRenderer, { ChapterSchemaError } from './ScreenRenderer.jsx'
import { TYPE } from '../../constants/typography.js'

// ── Stage navigation helpers ──────────────────────────────────────────────────
// isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation
// live in ../../app/chapterNavigation.js (imported above).

// iOS Safari ignores window.scrollTo on fixed-position shells.
// scrollToTop() tries window first, then falls back to the document element.
function scrollToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // Also scroll the chapter content container for iOS Safari
    const el = document.getElementById('chapter-scroll-container')
    if (el) el.scrollTop = 0
  } catch {}
}

// Chapter resume state persists via getChapterState / saveChapterState from
// ../../progress.js (imported above) under the canonical gcse_chapter_<id> key.

// ─── Main ChapterPlayer ────────────────────────────────────────────────────────

export default function ChapterPlayer(props) {
  const validation = validateChapterDefinition(props.chapter)
  if (!validation.valid) {
    return <ChapterSchemaError chapter={props.chapter} errors={validation.errors} onBack={props.onBack} />
  }
  return <ValidatedChapterPlayer {...props} />
}

function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete }) {
  const saved   = getChapterState(chapter.id)
  const _chapterGroup = MODULES.find(g => g.chapterIds.includes(chapter.id))
  const chapterNum    = _chapterGroup ? _chapterGroup.chapterIds.indexOf(chapter.id) + 1 : chapter.number

  // hookDone / wylDone / recallDone track whether the universal openers have been seen.
  // We persist these inside the chapter state so resuming skips them correctly.
  // Initial values are derived by computeInitialChapterState (chapterNavigation.js).
  const initial = computeInitialChapterState(chapter, saved)
  const [hookDone,   setHookDone]   = useState(initial.hookDone)
  const [wylDone,    setWylDone]    = useState(initial.wylDone)
  const [recallDone, setRecallDone] = useState(initial.recallDone)
  // introDone is a constant, not state. computeInitialChapterState hardcodes it
  // true and nothing ever lowered it, so the intro gate could never fire and the
  // IntroScreen behind it was unreachable. It stays in the persisted shape so
  // saved chapter state is byte-identical to what previous versions wrote.
  const introDone = initial.introDone
  // navTo — in-memory only, drives navigation back to hook/wyl/recall without changing "done" flags
  // null | 'hook' | 'wyl' | 'recall'
  const [navTo, setNavTo] = useState(null)
  const [screen, setScreen] = useState(initial.screen)
  const [showWeakSpotRecovery, setShowWeakSpotRecovery] = useState(false)
  const [detectedWeakSpot, _setDetectedWeakSpot] = useState(null)
  const [recoveryQuizId, setRecoveryQuizId] = useState(null)
  const [showExaminer,         setShowExaminer]         = useState(false)
  const [showExaminerExplains, setShowExaminerExplains] = useState(false)
  const [examinerAttempts, setExaminerAttempts] = useState(initial.examinerAttempts)
  // Sticks once a chapter has been finished — re-entering to review never un-completes it
  const [completed, setCompleted] = useState(initial.completed)
  const total   = chapter.screens.length
  const isLast  = screen === total - 1
  const [animKey, setAnimKey] = useState(0)
  const [cinematicHeaderVisible, setCinematicHeaderVisible] = useState(false)
  const [ihmExploreScreen, setIhmExploreScreen] = useState(null)
  const [selectedHealer, setSelectedHealer] = useState(null)

  useEffect(() => {
    saveChapterState(chapter.id, buildChapterProgressState({ screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed }))
  }, [screen, chapter.id, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed])

  // Reset cinematic header visibility whenever we navigate to a different screen
  useEffect(() => { setCinematicHeaderVisible(false) }, [screen])

  function go(delta) {
    const next = clampScreenIndex(screen + delta, total)
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
  }

  function goTo(idx) {
    const next = clampScreenIndex(idx, total)
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
  }

  function handleFinish() {
    const action = resolveFinishAction(chapter, { showExaminerExplains })
    if (action.type === 'showExaminerExplains') {
      setShowExaminerExplains(true)
      scrollToTop()
      return
    }
    if (action.type === 'showExaminer') {
      setShowExaminer(true)
    } else {
      detectWeakSpot()
    }
    scrollToTop()
  }

  function detectWeakSpot() {
    // V1: Simple heuristic-based weak spot detection
    // For now, no actual weak spot — just proceed to completion
    // This is where we'd integrate actual score analysis in future versions
    completeChapter()
  }

  // `attempts` defaults to the current render's examinerAttempts. A caller that has
  // just appended an attempt must pass the updated array in — reading it from this
  // closure would persist the pre-attempt copy and rely on the autosave effect to
  // repair it on the next render.
  function completeChapter(attempts = examinerAttempts) {
    recordActivity()
    setCompleted(true)
    // Persist full completion with a sticky `completed` flag so SubjectBrowser always reads this
    // chapter as 'completed' — even while reviewing it afterwards moves `screen` back down. Keep
    // the intro flags true so re-opening reviews the content straight away rather than replaying
    // the hook/recall/outcomes screens.
    saveChapterState(chapter.id, buildCompletedChapterState({ total, examinerAttempts: attempts }))
    setTimeout(() => {
      if (onChapterComplete) onChapterComplete(chapter)
      else onBack()
    }, 400)
  }

  // Determine what the "Next" button does at each stage.
  // No hook branch here: getChapterGate returns { type: 'hook' } for any chapter
  // with an unseen hook, and that path returns ChapterHookScreen before the shell
  // renders — so the shell is only ever reached with the hook already done.
  function handleNext() {
    isLast ? handleFinish() : go(1)
  }

  // Label + disabled state for the Continue/Finish button
  function nextLabel() {
    if (screenHasComponentOwnedContinuation(chapter.screens[screen])) return null // governed component owns continuation
    return isLast ? 'Finish ✓' : 'Continue'
  }

  const showNextBtn  = nextLabel() !== null
  const nextBtnLabel = nextLabel()
  const isFinishBtn  = wylDone && recallDone && navTo === null && isLast

  const cur = chapter.screens[screen]
  const subjectColor = chapter.color || (SUBJECTS[chapter?.subject] || SUBJECTS.History).accent

  if (total === 0) {
    return (
      <div style={{ minHeight: '100dvh', background: '#08090D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ ...TYPE.body, color: 'rgba(255,255,255,0.45)', fontSize: 15, textAlign: 'center', margin: 0 }}>
          {chapter.title} — coming soon.
        </p>
        <button
          onClick={onBack}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', ...TYPE.button, fontSize: 14, padding: '10px 24px', cursor: 'pointer' }}
        >
          Go back
        </button>
      </div>
    )
  }

  // ── Stage-based learning header ───────────────────────────────────────────
  const stageNavigation = getStageNavigation(chapter, total)
  const currentStage = (() => {
    if (navTo === 'recall' || (!recallDone && chapter.recall)) return stageNavigation[0]?.title || 'Intro'
    return getCurrentStageFromNavigation(stageNavigation, screen)
  })()

  const headerVisible =
    !showWeakSpotRecovery &&
    !recoveryQuizId &&
    !showExaminer &&
    hookDone && wylDone &&
    (isFullScreenVideoScreen(cur) ? cinematicHeaderVisible : true)

  function headerOnBack() {
    if (screen > 0) { go(-1); return }
    if (navTo === 'recall' || (!recallDone && chapter.recall)) {
      if (chapter.hook?.statement) { setNavTo('hook'); return }
      onBack(); return
    }
    if (chapter.recall) { setNavTo('recall'); scrollToTop(); return }
    if (chapter.hook?.statement) { setNavTo('hook'); scrollToTop(); return }
    onBack()
  }

  const H = {
    chapter,
    currentStage,
    stageNavigation,
    currentScreen:  screen,
    onStageJump:    goTo,
    onBack:         headerOnBack,
    onExit:         onBack,
  }
  // ──────────────────────────────────────────────────────────────────────────

  // ── Confidence overlay — neutral, no colour judgement ──────────────────
  // Which universal-opener gate (if any) to render is decided by
  // getChapterGate (chapterNavigation.js); the JSX and side effects below stay here.
  const chapterGate = getChapterGate(chapter, { hookDone, wylDone, recallDone, navTo })

  // ── Full-screen hook screen — renders before the player shell ──────────────
  if (chapterGate.type === 'hook') {
    return (
      <ChapterHookScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        statement={chapter.hook.statement}
        isTrue={chapter.hook.isTrue}
        accentWords={chapter.hook.accentWords || []}
        explanation={chapter.hook.explanation || chapter.hook.correctFeedback || ''}
        revealBeats={chapter.hook.revealBeats}
        backgroundImage={chapter.hook.backgroundImage || ''}
        onBack={onBack}
        onContinue={() => { setHookDone(true); setNavTo(null); scrollToTop() }}
      />
    )
  }

  // ── Chapter outcomes screen — appears after hook, before recall ──────────────
  if (chapterGate.type === 'outcomes') {
    return (
      <ChapterOutcomeScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        outcomes={chapter.outcomes.bullets || chapter.outcomes}
        onBack={() => setHookDone(false)}
        onContinue={() => { setWylDone(true); scrollToTop() }}
      />
    )
  }

  // ── Full-screen recall screen — appears after outcomes, before content ────────
  if (chapterGate.type === 'recall') {
    return (
      <QuickRecallScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        questions={chapter.recall.questions}
        onBack={() => {
          if (navTo === 'recall') setNavTo(null)
          else if (chapter.hook?.statement) setNavTo('hook')
          else onBack()
        }}
        onContinue={() => { setRecallDone(true); setNavTo(null); scrollToTop() }}
        renderHeader={() => (
          <LearningHeader {...H} currentStage="Discover" visible={true} />
        )}
      />
    )
  }

  if (showExaminerExplains) {
    return (
      <ExaminerExplainsScreen
        subject={chapter.subject}
        examinerExplains={chapter.examinerExplains}
        onBack={() => { setShowExaminerExplains(false); go(-1) }}
        onContinue={() => {
          setShowExaminerExplains(false)
          // Navigate to the faceExaminer screen if one exists in this chapter
          const faceExamIdx = findScreenIndexByType(chapter.screens, 'faceExaminer')
          if (faceExamIdx >= 0) {
            setScreen(faceExamIdx)
            setAnimKey(k => k + 1)
            scrollToTop()
            return
          }
          if (chapter.examiner) {
            setShowExaminer(true)
          } else {
            detectWeakSpot()
          }
          scrollToTop()
        }}
      />
    )
  }

  if (showExaminer) {
    return (
      <FaceTheExaminer
        chapter={chapter}
        examiner={chapter.examiner}
        onExit={onBack}
        onContinue={({ originalMark: _originalMark, finalMark, guessedMark }) => {
          const attempt = {
            chapterId: chapter.id,
            questionId: `${chapter.id}-q1`,
            guessedMark,
            examinerMark: chapter.examiner.mark,
            finalMark,
            timestamp: Date.now(),
          }
          const updated = [...examinerAttempts, attempt]
          setExaminerAttempts(updated)
          setShowExaminer(false)
          // completeChapter() writes the completion snapshot straight away, so the new
          // attempt has to travel with it. The interim progress save this path used to
          // make was overwritten by that same completion write on the very next line.
          completeChapter(updated)
          scrollToTop()
        }}
      />
    )
  }

  // Recovery quiz player
  if (recoveryQuizId) {
    return (
      <RecoveryQuizPlayer
        recoveryQuizId={recoveryQuizId}
        onComplete={() => {
          setRecoveryQuizId(null)
          completeChapter()
        }}
        onBack={() => setRecoveryQuizId(null)}
      />
    )
  }

  // Weak spot recovery screen
  if (showWeakSpotRecovery && detectedWeakSpot) {
    return (
      <WeakSpotRecovery
        block={detectedWeakSpot}
        subject={chapter.subject}
        progress={{ current: screen + 1, total: total }}
        onBack={() => setShowWeakSpotRecovery(false)}
        onFixWeakSpot={(quizId) => {
          setShowWeakSpotRecovery(false)
          setRecoveryQuizId(quizId)
        }}
        onSkip={() => {
          setShowWeakSpotRecovery(false)
          completeChapter()
        }}
      />
    )
  }

  const routeDefinition = resolveScreenDefinition(cur)
  if (!routeDefinition || routeDefinition.layout === 'full') {
    return (
      <ScreenRenderer
        screen={cur}
        chapter={chapter}
        chapterNum={chapterNum}
        isLast={isLast}
        handleFinish={handleFinish}
        go={go}
        screenIndex={screen}
        setScreen={setScreen}
        setAnimKey={setAnimKey}
        scrollToTop={scrollToTop}
        headerProps={H}
        subjectColor={subjectColor}
        headerOnBack={headerOnBack}
        ihmExploreScreen={ihmExploreScreen}
        setIhmExploreScreen={setIhmExploreScreen}
        selectedHealer={selectedHealer}
        setSelectedHealer={setSelectedHealer}
        cinematicHeaderVisible={cinematicHeaderVisible}
        setCinematicHeaderVisible={setCinematicHeaderVisible}
        onScreenComplete={isLast ? handleFinish : () => go(1)}
      />
    )
  }

  return (
    <>
      <LearningHeader {...H} visible={headerVisible} />
      <ContentShell subject={chapter.subject}>
        <div key={animKey} className="anim-pop">
          <ScreenRenderer screen={cur} chapter={chapter} subject={chapter.subject} onScreenComplete={isLast ? handleFinish : () => go(1)} />
        </div>
      </ContentShell>

      {/* ── Bottom navigation — Next only ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(8,9,13,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          {showNextBtn ? (
            <ContinueCTA
              onClick={handleNext}
              label={nextBtnLabel}
              accent={isFinishBtn
                ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
                : (SUBJECTS[chapter.subject]?.accent || subjectColor)}
              textColor={isFinishBtn ? '#fff' : '#0D0F14'}
              style={isFinishBtn ? { boxShadow: '0 4px 16px rgba(56,210,122,.35)' } : undefined}
            />
          ) : (
            <div style={{ height: BUTTONS.continue.height }} />
          )}
        </div>
      </div>
    </>
  )
}
