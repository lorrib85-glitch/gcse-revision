import { useState } from 'react'
import BackButton from '../../core/BackButton.jsx'
import ScreenTextBlock from '../../layout/ScreenTextBlock.jsx'
import { TYPE, SCREEN_TEXT_LAYOUT } from '../../../constants/typography.js'
import { SPACING } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { TAB_LABELS, IMAGES, markComparisonText } from './utils.js'
import AnswerPanel from './AnswerPanel.jsx'
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
    revealPanelVisible,
    setRevealPanelVisible,
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

  const backerImage = IMAGES[module.subject] || IMAGES.History
  const title = screenTitle || 'Mark the answer'
  const showTabs = phase === 'reading' || phase === 'judging'
  const showAnswer = activeTab === 'answer' || !showTabs
  const showMarking = activeTab === 'marking' && showTabs
  const bottomPanelHeight = revealPanelVisible && isReveal ? 220 : 0
  const introBlocksMainInteraction = questionIntroVisible && phase === 'reading'
  const questionParts = splitQuestionAndMarks(examiner.question, examiner.marks)

  function startQuestionIntroDock() {
    setQuestionIntroDocking(true)
    setTimeout(() => setQuestionIntroVisible(false), 560)
  }

  const ctaBtnStyle = enabled => ({
    ...TYPE.button,
    display: 'block',
    width: '100%',
    minHeight: 54,
    borderRadius: 16,
    border: `1.5px solid ${enabled ? accent : 'rgba(255,255,255,0.12)'}`,
    background: enabled ? `linear-gradient(180deg, ${accent}22 0%, rgba(8,9,13,0.66) 100%)` : 'rgba(255,255,255,0.04)',
    color: enabled ? accent : 'rgba(255,255,255,0.3)',
    boxShadow: enabled ? `0 0 22px ${accent}14` : 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
  })

  return (
    <>
      <style>{`
        @keyframes fte-panel-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fte-chip { display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 999px; margin: 4px; font-family: ${TYPE.body.fontFamily}; font-size: ${TYPE.bodySmall.fontSize}; font-weight: 600; cursor: pointer; border: 1px solid rgba(245,238,225,0.10); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.56); transition: all 0.15s ease; user-select: none; }
        .fte-chip.selected { background: ${accent}18; border-color: ${accent}66; color: ${accent}; }
        .fte-improve-btn { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 10px; margin-left: 5px; font-family: ${TYPE.body.fontFamily}; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer; vertical-align: middle; background: rgba(232,169,58,0.12); border: 1px solid rgba(232,169,58,0.35); color: rgba(232,169,58,0.85); transition: all 0.15s ease; }
        .fte-improve-btn.edited { background: rgba(143,214,163,0.12); border-color: rgba(143,214,163,0.35); color: rgba(143,214,163,0.85); }
        .fte-textarea { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 12px; color: rgba(245,238,225,0.9); font-family: ${TYPE.body.fontFamily}; font-size: ${TYPE.bodySmall.fontSize}; line-height: 1.6; resize: vertical; outline: none; margin-top: 8px; }
        .fte-textarea:focus { border-color: ${accent}88; }
        .fte-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .fte-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 900, isolation: 'isolate', background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {backerImage && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `url(${backerImage})`, backgroundSize: 'cover', backgroundPosition: 'center right', opacity: 0.42, filter: 'grayscale(4%) brightness(0.7)' }} />}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(8,9,13,0.92) 0%, rgba(8,9,13,0.62) 34%, rgba(8,9,13,0.88) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 20, background: 'rgba(8,9,13,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(245,238,225,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52, flexShrink: 0 }}>
          <BackButton onClick={onExit} />
          <div style={{ ...TYPE.metadata, color: 'rgba(255,255,255,0.52)' }}>Face the examiner<span style={{ color: accent, marginLeft: 6 }}>· {module.subject || 'History'}</span></div>
          <div style={{ ...TYPE.metadata, color: accent }}>{examiner.marks} marks</div>
        </div>

        <ScreenTextBlock
          title={title}
          accent={accent}
          inset
          style={{ background: 'transparent', borderBottom: 'none', flexShrink: 0, position: 'relative', zIndex: 1, paddingBottom: 8, opacity: introBlocksMainInteraction ? 0 : 1, transition: 'opacity 220ms ease 420ms' }}
          titleStyle={{ ...TYPE.displaySection, color: 'rgba(245,238,225,0.96)', marginBottom: 10 }}
          bodyStyle={{ ...TYPE.examQuestion, color: 'rgba(245,238,225,0.76)' }}
        >
          <span>{questionParts.question}</span>
          {questionParts.marks && <span style={{ ...TYPE.displaySection, display: 'block', color: accent, marginTop: SCREEN_TEXT_LAYOUT.blockGap }}>{questionParts.marks}</span>}
        </ScreenTextBlock>

        {showTabs && <div style={{ padding: `0 ${SCREEN_TEXT_LAYOUT.mobileInset}px ${SPACING.compact}px`, flexShrink: 0, position: 'relative', zIndex: 1, opacity: introBlocksMainInteraction ? 0 : 1, transform: introBlocksMainInteraction ? 'translateY(10px)' : 'translateY(0)', transition: 'opacity 240ms ease 500ms, transform 240ms ease 500ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.compact, overflowX: 'auto', paddingBottom: SPACING.micro }}>
            {['answer', 'marking'].map(tab => {
              const active = activeTab === tab
              const label = tab === 'answer' ? 'Student answer' : TAB_LABELS[tab]
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...TYPE.label,
                    minHeight: 52,
                    borderRadius: RADII.medium,
                    border: active ? `1px solid ${accent}55` : '1px solid transparent',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: active ? accent : 'rgba(245,238,225,0.58)',
                    boxShadow: active ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 30px ${accent}0F` : 'none',
                    padding: `0 ${SPACING.standard}px`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>}

        <div className="fte-scroll" style={{ flex: 1, overflowY: 'auto', padding: `${SCREEN_TEXT_LAYOUT.blockGap}px ${SCREEN_TEXT_LAYOUT.mobileInset}px`, paddingBottom: bottomPanelHeight > 0 ? bottomPanelHeight + 16 : 80, WebkitOverflowScrolling: 'touch', position: 'relative', zIndex: 1, opacity: introBlocksMainInteraction ? 0 : 1, transform: introBlocksMainInteraction ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 260ms ease 560ms, transform 260ms ease 560ms' }}>
          {showAnswer && <AnswerPanel accent={accent} examiner={examiner} segments={segments} isReveal={isReveal} isImproving={isImproving} expandedEdit={expandedEdit} setExpandedEdit={setExpandedEdit} studentEdits={studentEdits} setStudentEdits={setStudentEdits} expandedTextareaRef={expandedTextareaRef} />}
          {showMarking && <MarkingPanel accent={accent} examiner={examiner} guessedMark={guessedMark} setGuessedMark={setGuessedMark} selectedCriteria={selectedCriteria} setSelectedCriteria={setSelectedCriteria} />}
          {remarkError && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(192,80,85,0.12)', border: '1px solid rgba(192,80,85,0.3)', ...TYPE.bodySmall, color: '#E8746A' }}>{remarkError}</div>}
        </div>

        {!isReveal && <div style={{ flexShrink: 0, padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))', background: 'linear-gradient(180deg, rgba(8,9,13,0) 0%, rgba(8,9,13,0.92) 28%, rgba(8,9,13,1) 100%)', position: 'relative', zIndex: 2, opacity: introBlocksMainInteraction ? 0 : 1, transform: introBlocksMainInteraction ? 'translateY(18px)' : 'translateY(0)', transition: 'opacity 240ms ease 620ms, transform 240ms ease 620ms' }}>
          {phase === 'reading' && activeTab === 'answer' && <button style={ctaBtnStyle(true)} onClick={() => { setActiveTab('marking'); setPhase('judging') }}>Show examiner thinking →</button>}
          {(phase === 'judging' || (phase === 'reading' && activeTab === 'marking')) && <button style={ctaBtnStyle(guessedMark !== null)} disabled={guessedMark === null} onClick={() => { setActiveTab('answer'); setPhase('reveal') }}>Reveal examiner report →</button>}
          {isImproving && <div><button style={ctaBtnStyle(hasAnyEdit && !remarkLoading)} disabled={!hasAnyEdit || remarkLoading} onClick={handleRemark}>{remarkLoading ? 'Re-marking…' : 'Re-mark my answer →'}</button><button onClick={() => setPhase('done')} style={{ ...TYPE.bodySmall, display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.32)', padding: '10px 0 0', textAlign: 'center' }}>Continue without improving →</button></div>}
          {isRemarking && <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.bodySmall, color: 'rgba(255,255,255,0.4)' }}>Reviewing your changes…</div>}
        </div>}

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
              <div style={{
                ...TYPE.eyebrow,
                color: accent,
                textTransform: 'none',
                marginBottom: SCREEN_TEXT_LAYOUT.blockGap,
              }}>
                Read the question first
              </div>
              <div style={{
                ...TYPE.displayScreen,
                color: 'rgba(245,238,225,0.95)',
                maxWidth: 620,
              }}>
                {questionParts.question}
              </div>
              {questionParts.marks && (
                <div style={{
                  ...TYPE.displaySection,
                  color: accent,
                  marginTop: SCREEN_TEXT_LAYOUT.blockGap,
                }}>
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
              <button style={ctaBtnStyle(true)} onClick={startQuestionIntroDock}>Show the model answer →</button>
            </div>
          </div>
        )}

        {isReveal && revealPanelVisible && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: `linear-gradient(180deg, ${bg}00 0%, ${bg} 18%)`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '28px 16px calc(20px + env(safe-area-inset-bottom, 0px))', animation: 'fte-panel-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both', zIndex: 10 }}>
          <div style={{ ...TYPE.displayHero, color: accent, marginBottom: 4 }}>{examiner.mark}/{examiner.marks}<span style={{ ...TYPE.metadata, color: 'rgba(255,255,255,0.36)', marginLeft: 10 }}>examiner's mark</span></div>
          <p style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.56)', margin: '0 0 6px' }}>{examiner.summary}</p>
          {guessedMark !== null && <p style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>You said {guessedMark}/{examiner.marks} · {markComparisonText(guessedMark, examiner.mark)}</p>}
          {canImprove ? <button style={ctaBtnStyle(true)} onClick={() => { setRevealPanelVisible(false); setPhase('improving') }}>Push it up a grade →</button> : <button style={ctaBtnStyle(true)} onClick={() => { setRevealPanelVisible(false); setPhase('done') }}>Continue →</button>}
        </div>}
      </div>
    </>
  )
}
