import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { recordActivity, getChapterState, saveChapterState } from '../../progress.js'
import { MODULES } from '../../data/modules.js'
import { isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation, computeInitialChapterState, clampScreenIndex, getChapterGate, buildChapterProgressState, buildCompletedChapterState } from '../../app/chapterNavigation.js'
import { resolveScreenDefinition, screenHasComponentOwnedContinuation, validateChapterDefinition } from '../../data/screenRegistry.js'
import LearningHeader from '../core/LearningHeader.jsx'
import ChapterGateLayer from './chapterPlayer/ChapterGateLayer.jsx'
import ChapterBottomNavigation from './chapterPlayer/ChapterBottomNavigation.jsx'
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
  // examinerAttempts is a constant, not state. Its only producer was the
  // module-level Face the Examiner overlay (chapter.examiner), which no shipped
  // chapter ever defined and which was removed in the Phase 8 overlay audit. The
  // authored `faceExaminer` *screen* type — routed by ScreenRenderer, and the
  // one several chapters actually use — has never written attempts. The field is
  // therefore historical-only, but it is still read back from saved state and
  // written straight through so existing saves round-trip byte-identically and
  // chapterProgress.js's merge rules keep working.
  const examinerAttempts = initial.examinerAttempts
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

  // Continuing from the final content screen always completes the chapter. The
  // former module-level examinerExplains → examiner → complete ladder (and the
  // resolveFinishAction helper that encoded it) is gone: no chapter has ever
  // defined a top-level chapter.examinerExplains or chapter.examiner, and both
  // types are authored as ordinary screens routed by ScreenRenderer instead.
  function handleFinish() {
    completeChapter()
    scrollToTop()
  }

  function completeChapter() {
    recordActivity()
    setCompleted(true)
    // Persist full completion with a sticky `completed` flag so SubjectBrowser always reads this
    // chapter as 'completed' — even while reviewing it afterwards moves `screen` back down. Keep
    // the intro flags true so re-opening reviews the content straight away rather than replaying
    // the hook/recall/outcomes screens.
    saveChapterState(chapter.id, buildCompletedChapterState({ total, examinerAttempts }))
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

  // ── Universal opener gates — render before the player shell ────────────────
  // Which gate (if any) to show is decided here by getChapterGate
  // (chapterNavigation.js); ChapterGateLayer only maps that decision onto the
  // hook / outcomes / recall screens. Every state change stays in this file.
  const chapterGate = getChapterGate(chapter, { hookDone, wylDone, recallDone, navTo })

  if (chapterGate.type) {
    return (
      <ChapterGateLayer
        gateType={chapterGate.type}
        chapter={chapter}
        chapterNum={chapterNum}
        headerProps={H}
        onExit={onBack}
        onHookContinue={() => { setHookDone(true); setNavTo(null); scrollToTop() }}
        onOutcomeBack={() => setHookDone(false)}
        onOutcomeContinue={() => { setWylDone(true); scrollToTop() }}
        onRecallBack={() => {
          if (navTo === 'recall') setNavTo(null)
          else if (chapter.hook?.statement) setNavTo('hook')
          else onBack()
        }}
        onRecallContinue={() => { setRecallDone(true); setNavTo(null); scrollToTop() }}
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

      <ChapterBottomNavigation
        visible={showNextBtn}
        label={nextBtnLabel}
        isFinish={isFinishBtn}
        subjectAccent={SUBJECTS[chapter.subject]?.accent || subjectColor}
        onContinue={handleNext}
      />
    </>
  )
}
