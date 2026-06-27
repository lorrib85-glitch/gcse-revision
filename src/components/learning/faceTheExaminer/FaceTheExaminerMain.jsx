import BackButton from '../../core/BackButton.jsx'
import ScreenTextBlock from '../../layout/ScreenTextBlock.jsx'
import { TYPE, SCREEN_TEXT_LAYOUT } from '../../../constants/typography.js'
import { TAB_LABELS, IMAGES, markComparisonText } from './utils.js'
import AnswerPanel from './AnswerPanel.jsx'
import MarkingPanel from './MarkingPanel.jsx'

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

  const backerImage = IMAGES[module.subject] || IMAGES.History
  const title = screenTitle || 'Mark the answer'
  const showTabs = phase === 'reading' || phase === 'judging'
  const showAnswer = activeTab === 'answer' || !showTabs
  const showMarking = activeTab === 'marking' && showTabs
  const bottomPanelHeight = revealPanelVisible && isReveal ? 220 : 0

  const ctaBtnStyle = enabled => ({
    ...TYPE.buttonText,
    display: 'block',
    width: '100%',
    minHeight: 54,
    borderRadius: 14,
    border: `1.5px solid ${enabled ? accent : 'rgba(255,255,255,0.12)'}`,
    background: enabled ? `linear-gradient(180deg, ${accent}26 0%, ${accent}12 100%)` : 'rgba(255,255,255,0.04)',
    color: enabled ? accent : 'rgba(255,255,255,0.3)',
    boxShadow: enabled ? `0 0 24px ${accent}18` : 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
  })

  return (
    <>
      <style>{`
        @keyframes fte-panel-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fte-chip { display: inline-flex; align-items: center; padding: 9px 13px; border-radius: 18px; margin: 4px; font-family: ${TYPE.bodyText.fontFamily}; font-size: ${TYPE.bodySmallText.fontSize}; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.58); transition: all 0.15s ease; user-select: none; }
        .fte-chip.selected { background: ${accent}18; border-color: ${accent}66; color: ${accent}; }
        .fte-improve-btn { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 10px; margin-left: 5px; font-family: ${TYPE.bodyText.fontFamily}; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer; vertical-align: middle; background: rgba(232,169,58,0.12); border: 1px solid rgba(232,169,58,0.35); color: rgba(232,169,58,0.85); transition: all 0.15s ease; }
        .fte-improve-btn.edited { background: rgba(143,214,163,0.12); border-color: rgba(143,214,163,0.35); color: rgba(143,214,163,0.85); }
        .fte-textarea { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 12px; color: rgba(245,238,225,0.9); font-family: ${TYPE.bodyText.fontFamily}; font-size: ${TYPE.bodySmallText.fontSize}; line-height: 1.6; resize: vertical; outline: none; margin-top: 8px; }
        .fte-textarea:focus { border-color: ${accent}88; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {backerImage && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `url(${backerImage})`, backgroundSize: 'cover', backgroundPosition: 'center right', opacity: 0.5, filter: 'grayscale(4%) brightness(0.82)' }} />}

        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: bg, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52, flexShrink: 0 }}>
          <BackButton onClick={onExit} />
          <div style={{ ...TYPE.metadataText, color: 'rgba(255,255,255,0.58)' }}>Face the examiner<span style={{ color: accent, marginLeft: 6 }}>· {module.subject || 'History'}</span></div>
          <div style={{ ...TYPE.metadataText, color: accent }}>{examiner.marks} marks</div>
        </div>

        <ScreenTextBlock
          title={title}
          accent={accent}
          inset
          style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
          titleStyle={{ ...TYPE.sectionHeading, color: 'rgba(245,238,225,0.94)', marginBottom: 10 }}
          bodyStyle={{ ...TYPE.examQuestionText, color: 'rgba(245,238,225,0.78)' }}
        >
          {examiner.question}
        </ScreenTextBlock>

        {showTabs && <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 4, borderRadius: 16, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['answer', 'marking'].map(tab => {
              const active = activeTab === tab
              return <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...TYPE.buttonText, minHeight: 38, borderRadius: 12, border: active ? `1px solid ${accent}66` : '1px solid transparent', background: active ? `${accent}18` : 'transparent', color: active ? accent : 'rgba(255,255,255,0.52)', boxShadow: active ? `0 0 18px ${accent}14` : 'none', cursor: 'pointer', transition: 'all 0.16s ease' }}>{TAB_LABELS[tab]}</button>
            })}
          </div>
        </div>}

        <div style={{ flex: 1, overflowY: 'auto', padding: `${SCREEN_TEXT_LAYOUT.blockGap}px ${SCREEN_TEXT_LAYOUT.mobileInset}px`, paddingBottom: bottomPanelHeight > 0 ? bottomPanelHeight + 16 : 80, WebkitOverflowScrolling: 'touch' }}>
          {showAnswer && <AnswerPanel accent={accent} examiner={examiner} segments={segments} isReveal={isReveal} isImproving={isImproving} expandedEdit={expandedEdit} setExpandedEdit={setExpandedEdit} studentEdits={studentEdits} setStudentEdits={setStudentEdits} expandedTextareaRef={expandedTextareaRef} />}
          {showMarking && <MarkingPanel accent={accent} examiner={examiner} guessedMark={guessedMark} setGuessedMark={setGuessedMark} selectedCriteria={selectedCriteria} setSelectedCriteria={setSelectedCriteria} />}
          {remarkError && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(192,80,85,0.12)', border: '1px solid rgba(192,80,85,0.3)', ...TYPE.bodySmallText, color: '#E8746A' }}>{remarkError}</div>}
        </div>

        {!isReveal && <div style={{ flexShrink: 0, padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))', background: bg, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {phase === 'reading' && activeTab === 'answer' && <button style={ctaBtnStyle(true)} onClick={() => { setActiveTab('marking'); setPhase('judging') }}>I've read the answer →</button>}
          {(phase === 'judging' || (phase === 'reading' && activeTab === 'marking')) && <button style={ctaBtnStyle(guessedMark !== null)} disabled={guessedMark === null} onClick={() => { setActiveTab('answer'); setPhase('reveal') }}>Submit examiner report</button>}
          {isImproving && <div><button style={ctaBtnStyle(hasAnyEdit && !remarkLoading)} disabled={!hasAnyEdit || remarkLoading} onClick={handleRemark}>{remarkLoading ? 'Re-marking…' : 'Re-mark my answer →'}</button><button onClick={() => setPhase('done')} style={{ ...TYPE.bodySmallText, display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.32)', padding: '10px 0 0', textAlign: 'center' }}>Continue without improving →</button></div>}
          {isRemarking && <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.4)' }}>Reviewing your changes…</div>}
        </div>}

        {isReveal && revealPanelVisible && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: `linear-gradient(180deg, ${bg}00 0%, ${bg} 18%)`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '28px 16px calc(20px + env(safe-area-inset-bottom, 0px))', animation: 'fte-panel-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both', zIndex: 10 }}>
          <div style={{ ...TYPE.impactTitle, color: accent, marginBottom: 4 }}>{examiner.mark}/{examiner.marks}<span style={{ ...TYPE.metadataText, color: 'rgba(255,255,255,0.36)', marginLeft: 10 }}>examiner's mark</span></div>
          <p style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.56)', margin: '0 0 6px' }}>{examiner.summary}</p>
          {guessedMark !== null && <p style={{ ...TYPE.bodySmallText, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>You said {guessedMark}/{examiner.marks} · {markComparisonText(guessedMark, examiner.mark)}</p>}
          {canImprove ? <button style={ctaBtnStyle(true)} onClick={() => { setRevealPanelVisible(false); setPhase('improving') }}>Push it up a grade →</button> : <button style={ctaBtnStyle(true)} onClick={() => { setRevealPanelVisible(false); setPhase('done') }}>Continue →</button>}
        </div>}
      </div>
    </>
  )
}
