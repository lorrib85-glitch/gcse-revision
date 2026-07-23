import { useState } from 'react'
import BackButton from '../../core/BackButton.jsx'
import ContinueCTA from '../../core/ContinueCTA.jsx'
import SegmentedControl from '../../core/SegmentedControl.jsx'
import ScreenTextBlock from '../../layout/ScreenTextBlock.jsx'
import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE, SCREEN_TEXT_LAYOUT } from '../../../constants/typography.js'
import { TAB_LABELS, IMAGES } from './utils.js'
import AnswerPanel from './AnswerPanel.jsx'
import ExaminerVerdict from './ExaminerVerdict.jsx'
import MarkingPanel from './MarkingPanel.jsx'

function splitQuestionAndMarks(question, fallbackMarks) {
  const rawQuestion = String(question || '').trim()
  const markMatch = rawQuestion.match(/\s*[[(]\s*(\d+\s*marks?)\s*[\])]\s*$/i)
  const questionWithoutMarks = rawQuestion
    .replace(/\s*[[(]\s*\d+\s*marks?\s*[\])]\s*$/i, '')
    .replace(/^["“”']+|["“”']+$/g, '')
    .trim()

  return {
    question: questionWithoutMarks || rawQuestion,
    marks: markMatch?.[1] || (fallbackMarks ? `${fallbackMarks} marks` : ''),
  }
}

export default function FaceTheExaminerMain(props) {
  const {
    module,
    examiner,
    screenTitle,
    bg,
    accent,
    activeTab,
    setActiveTab,
    phase,
    setPhase,
    guessedMark,
    setGuessedMark,
    selectedCriteria,
    setSelectedCriteria,
    isReveal,
    isImproving,
    isRemarking,
    segments,
    expandedEdit,
    setExpandedEdit,
    studentEdits,
    setStudentEdits,
    expandedTextareaRef,
    hasAnyEdit,
    remarkLoading,
    remarkError,
    handleRemark,
    onExit,
    canImprove,
  } = props

  const [questionIntroVisible, setQuestionIntroVisible] = useState(phase === 'reading')
  const [questionIntroDocking, setQuestionIntroDocking] = useState(false)

  const backerImage = examiner.backgroundImage || IMAGES[module.subject] || null
  const backgroundPosition = examiner.backgroundPosition || 'center right'
  const backgroundOpacity = examiner.backgroundOpacity ?? 0.42
  const backgroundFilter = examiner.backgroundFilter || 'grayscale(4%) brightness(0.7)'
  const subjectLabel = examiner.subjectLabel || module.subject || examiner.subject || 'Exam practice'
  const title = screenTitle || 'Mark the answer'
  const showTabs = phase === 'reading' || phase === 'judging'
  const showAnswer = activeTab === 'answer' || !showTabs
  const showMarking = activeTab === 'marking' && showTabs
  const introBlocksMainInteraction = questionIntroVisible && phase === 'reading'
  const questionParts = splitQuestionAndMarks(examiner.question, examiner.marks)
  const hasCriteriaChoices = (examiner.criteriaOptions || []).length > 0
  const readyToReveal = guessedMark !== null && (!hasCriteriaChoices || selectedCriteria.length > 0)

  function startQuestionIntroDock() {
    setQuestionIntroDocking(true)
    setTimeout(() => setQuestionIntroVisible(false), 560)
  }

  return (
    <>
      <style>{`
        @keyframes fte-panel-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fte-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 9px 14px;
          border-radius: 999px;
          font-family: ${TYPE.body.fontFamily};
          font-size: ${TYPE.bodySmall.fontSize};
          font-weight: 600;
          cursor: pointer;
          border: 1px solid ${GENERAL.line.medium};
          background: ${GENERAL.surfaceTint};
          color: ${GENERAL.cinematic.textMuted};
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
          user-select: none;
        }
        .fte-chip:hover { border-color: ${GENERAL.line.strong}; color: ${GENERAL.cinematic.textSecondary}; }
        .fte-chip:focus-visible { outline: 2px solid ${accent}88; outline-offset: 2px; }
        .fte-chip.selected { background: ${accent}18; border-color: ${accent}88; color: ${accent}; }
        .fte-chip:disabled { cursor: default; }
        .fte-improve-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 7px 11px;
          border-radius: 10px;
          margin: 8px 0 0;
          font-family: ${TYPE.body.fontFamily};
          font-size: ${TYPE.bodySmall.fontSize};
          font-weight: 700;
          cursor: pointer;
          vertical-align: middle;
          background: ${accent}18;
          border: 1px solid ${accent}55;
          color: ${accent};
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }
        .fte-improve-btn.edited { background: ${GENERAL.feedbackCorrect}18; border-color: ${GENERAL.feedbackCorrect}66; color: ${GENERAL.feedbackCorrect}; }
        .fte-improve-btn:focus-visible { outline: 2px solid ${accent}88; outline-offset: 2px; }
        .fte-textarea {
          width: 100%;
          box-sizing: border-box;
          background: ${GENERAL.surfaceTint};
          border: 1px solid ${GENERAL.line.strong};
          border-radius: 10px;
          padding: 12px 14px;
          color: ${GENERAL.cinematic.textFact};
          font-family: ${TYPE.body.fontFamily};
          font-size: ${TYPE.bodySmall.fontSize};
          line-height: 1.6;
          resize: vertical;
          outline: none;
          margin: 0;
        }
        .fte-textarea:focus { border-color: ${accent}88; box-shadow: 0 0 0 2px ${accent}18; }
        .fte-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .fte-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
        @media (prefers-reduced-motion: reduce) {
          .fte-shell, .fte-shell * {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="fte-shell" style={{ position: 'fixed', inset: 0, zIndex: 900, isolation: 'isolate', background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {backerImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `url(${backerImage})`,
            backgroundSize: 'cover',
            backgroundPosition,
            opacity: backgroundOpacity,
            filter: backgroundFilter,
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(8,9,13,0.92) 0%, rgba(8,9,13,0.62) 34%, rgba(8,9,13,0.9) 100%)' }} />

        <div style={{
          position: 'relative',
          zIndex: 20,
          background: 'rgba(8,9,13,0.78)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${GENERAL.line.faint}`,
          display: 'grid',
          gridTemplateColumns: '44px minmax(0, 1fr) 44px',
          alignItems: 'center',
          padding: '0 12px',
          minHeight: 52,
          flexShrink: 0,
        }}>
          <BackButton onClick={onExit} />
          <div style={{ ...TYPE.metadata, color: GENERAL.cinematic.textMuted, textAlign: 'center', minWidth: 0 }}>
            Face the examiner
            <span style={{ color: accent, marginLeft: 6 }}>· {subjectLabel}</span>
          </div>
          <div aria-hidden="true" />
        </div>

        <ScreenTextBlock
          title={title}
          accent={accent}
          inset
          style={{ background: 'transparent', borderBottom: 'none', flexShrink: 0, position: 'relative', zIndex: 1, paddingBottom: 8, opacity: introBlocksMainInteraction ? 0 : 1, transition: 'opacity 220ms ease 420ms' }}
          titleStyle={{ ...TYPE.displaySection, color: GENERAL.cinematic.textPrimary, marginBottom: 10 }}
          bodyStyle={{ ...TYPE.examQuestion, color: GENERAL.cinematic.textSecondary }}
        >
          <span>{questionParts.question}</span>
          {questionParts.marks && (
            <span style={{ ...TYPE.displaySection, display: 'block', color: accent, marginTop: SCREEN_TEXT_LAYOUT.blockGap }}>
              {questionParts.marks}
            </span>
          )}
        </ScreenTextBlock>

        {showTabs && (
          <div style={{
            padding: `0 ${SCREEN_TEXT_LAYOUT.mobileInset}px 12px`,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
            opacity: introBlocksMainInteraction ? 0 : 1,
            transform: introBlocksMainInteraction ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 240ms ease 500ms, transform 240ms ease 500ms',
          }}>
            <SegmentedControl
              ariaLabel="Answer review view"
              value={activeTab}
              accent={accent}
              onChange={setActiveTab}
              options={[
                { value: 'answer', label: examiner.answerTabLabel || TAB_LABELS.answer },
                { value: 'marking', label: examiner.examinerTabLabel || TAB_LABELS.marking, disabled: phase === 'reading' },
              ]}
            />
          </div>
        )}

        <div
          className="fte-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: `${SCREEN_TEXT_LAYOUT.blockGap}px ${SCREEN_TEXT_LAYOUT.mobileInset}px`,
            paddingBottom: 108,
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            zIndex: 1,
            opacity: introBlocksMainInteraction ? 0 : 1,
            transform: introBlocksMainInteraction ? 'translateY(12px)' : 'translateY(0)',
            transition: 'opacity 260ms ease 560ms, transform 260ms ease 560ms',
          }}
        >
          {isReveal && <ExaminerVerdict examiner={examiner} guessedMark={guessedMark} accent={accent} />}
          {showAnswer && <AnswerPanel accent={accent} examiner={examiner} segments={segments} isReveal={isReveal} isImproving={isImproving} expandedEdit={expandedEdit} setExpandedEdit={setExpandedEdit} studentEdits={studentEdits} setStudentEdits={setStudentEdits} expandedTextareaRef={expandedTextareaRef} />}
          {showMarking && <MarkingPanel accent={accent} examiner={examiner} guessedMark={guessedMark} setGuessedMark={setGuessedMark} selectedCriteria={selectedCriteria} setSelectedCriteria={setSelectedCriteria} />}
          {remarkError && (
            <div role="alert" style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: `${GENERAL.feedbackIncorrect}18`, border: `1px solid ${GENERAL.feedbackIncorrect}55`, ...TYPE.bodySmall, color: GENERAL.feedbackIncorrect }}>
              {remarkError}
            </div>
          )}
        </div>

        <div style={{
          flexShrink: 0,
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
          background: `linear-gradient(180deg, rgba(8,9,13,0) 0%, ${GENERAL.backgroundApp} 32%, ${GENERAL.backgroundApp} 100%)`,
          position: 'relative',
          zIndex: 2,
          opacity: introBlocksMainInteraction ? 0 : 1,
          transform: introBlocksMainInteraction ? 'translateY(18px)' : 'translateY(0)',
          transition: 'opacity 240ms ease 620ms, transform 240ms ease 620ms',
        }}>
          {phase === 'reading' && activeTab === 'answer' && (
            <ContinueCTA
              accent={accent}
              label={examiner.reviewCtaLabel || 'Review as examiner'}
              onClick={() => {
                setActiveTab('marking')
                setPhase('judging')
              }}
            />
          )}

          {phase === 'judging' && (
            <>
              {!readyToReveal && (
                <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, textAlign: 'center', marginBottom: 8 }}>
                  {guessedMark === null
                    ? (examiner.chooseMarkInstruction || 'Choose a mark to continue.')
                    : (examiner.chooseObservationInstruction || 'Choose at least one observation to continue.')}
                </div>
              )}
              <ContinueCTA
                accent={accent}
                label={examiner.revealCtaLabel || 'Reveal examiner report'}
                disabled={!readyToReveal}
                onClick={() => {
                  setActiveTab('answer')
                  setPhase('reveal')
                }}
              />
            </>
          )}

          {isReveal && (
            <ContinueCTA
              accent={accent}
              label={canImprove ? (examiner.improveCtaLabel || 'Fix the weakest sentence') : 'Continue'}
              onClick={() => setPhase(canImprove ? 'improving' : 'done')}
            />
          )}

          {isImproving && (
            <div>
              {!hasAnyEdit && (
                <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, textAlign: 'center', marginBottom: 8 }}>
                  {examiner.repairRequiredInstruction || 'Rewrite the highlighted sentence to continue.'}
                </div>
              )}
              <ContinueCTA
                accent={accent}
                label={remarkLoading ? 'Re-marking…' : 'Re-mark my answer'}
                disabled={!hasAnyEdit || remarkLoading}
                onClick={handleRemark}
              />
              <button
                type="button"
                onClick={() => setPhase('done')}
                style={{ ...TYPE.bodySmall, display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: GENERAL.cinematic.textSubtle, padding: '12px 0 0', textAlign: 'center' }}
              >
                Continue without improving
              </button>
            </div>
          )}

          {isRemarking && (
            <div role="status" aria-live="polite" style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
              Reviewing your changes…
            </div>
          )}
        </div>

        {questionIntroVisible && phase === 'reading' && (
          <div style={{
            position: 'absolute',
            inset: '52px 0 0',
            zIndex: 30,
            background: questionIntroDocking ? 'rgba(8,9,13,0)' : 'rgba(8,9,13,0.92)',
            backdropFilter: questionIntroDocking ? 'blur(0px)' : 'blur(2px)',
            WebkitBackdropFilter: questionIntroDocking ? 'blur(0px)' : 'blur(2px)',
            pointerEvents: questionIntroDocking ? 'none' : 'auto',
            transition: 'background 520ms ease, backdrop-filter 520ms ease',
          }}>
            <div style={{
              position: 'absolute',
              left: SCREEN_TEXT_LAYOUT.mobileInset,
              right: SCREEN_TEXT_LAYOUT.mobileInset,
              top: questionIntroDocking ? SCREEN_TEXT_LAYOUT.blockGap : '24%',
              transformOrigin: 'top left',
              transform: questionIntroDocking ? 'scale(0.56)' : 'scale(1)',
              opacity: questionIntroDocking ? 0.18 : 1,
              transition: 'top 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease 140ms',
            }}>
              <div style={{ ...TYPE.label, color: accent, marginBottom: SCREEN_TEXT_LAYOUT.blockGap }}>
                {examiner.questionIntroLabel || 'Read the question first'}
              </div>
              <div style={{ ...TYPE.displayScreen, color: GENERAL.cinematic.textPrimary, maxWidth: 620 }}>
                {questionParts.question}
              </div>
              {questionParts.marks && (
                <div style={{ ...TYPE.displaySection, color: accent, marginTop: SCREEN_TEXT_LAYOUT.blockGap }}>
                  {questionParts.marks}
                </div>
              )}
            </div>
            <div style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
              opacity: questionIntroDocking ? 0 : 1,
              transform: questionIntroDocking ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}>
              <ContinueCTA
                accent={accent}
                label={examiner.answerIntroCtaLabel || 'Show the student answer'}
                onClick={startQuestionIntroDock}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
