import { useState, useEffect, useRef, useCallback } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { MOTION } from '../../constants/motion.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
// CinematicShell used here because the full-bleed background image and vignette overlays
// (position:absolute, inset:0) must fill the entire viewport; InteractionShell's 16px
// horizontal padding would constrain them to the content column width.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const CARD_BORDER_WRONG = 'rgba(168,76,53,0.75)'
const TEXT_PRIMARY = 'rgba(245,238,225,0.92)'
const TEXT_DIM     = 'rgba(245,238,225,0.72)'

const CSS = `
  @keyframes mt-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mt-shake {
    0%,100% { transform: translateX(0); }
    15% { transform: translateX(-5px); }
    45% { transform: translateX(5px); }
    65% { transform: translateX(-3px); }
    85% { transform: translateX(2px); }
  }
`

// ── Main export ───────────────────────────────────────────────────────────────

export default function MatchingTask({ screen, subject, onComplete }) {
  const allPairs    = screen.pairs || []
  const subjectKey  = subject || screen.subject || 'History'
  const bgImage     = screen.backgroundImage || ''

  const theme    = SUBJECTS[subjectKey] || SUBJECTS.History
  const accent   = theme.accent
  const accentRgb = theme.accentRgb

  const CARD_BG          = `rgba(${accentRgb},0.08)`
  const CARD_BG_LOCKED   = `rgba(${accentRgb},0.15)`
  const CARD_BORDER      = `rgba(${accentRgb},0.22)`
  const CARD_BORDER_LOCKED   = `rgba(${accentRgb},0.50)`
  const CARD_BORDER_SELECTED = `rgba(${accentRgb},0.65)`

  // Split pairs into rounds: max 6 per round, balanced halves
  const ROUND_MAX  = 6
  const numRounds  = allPairs.length > ROUND_MAX ? Math.ceil(allPairs.length / ROUND_MAX) : 1
  const chunkSize  = numRounds > 1 ? Math.ceil(allPairs.length / numRounds) : allPairs.length
  const rounds     = []
  for (let i = 0; i < allPairs.length; i += chunkSize) rounds.push(allPairs.slice(i, i + chunkSize))

  const [roundIdx,        setRoundIdx]        = useState(0)
  const [shuffledAnswers, setShuffledAnswers]  = useState([])
  const [selectedTermId,  setSelectedTermId]   = useState(null)
  const [lockedPairIds,   setLockedPairIds]    = useState([])
  const [wrongTermId,     setWrongTermId]      = useState(null)
  const [feedback,        setFeedback]         = useState('')
  const [lines,           setLines]            = useState([])

  const panelRef  = useRef(null)
  const termRefs  = useRef({})
  const answerRefs = useRef({})

  const currentRound = rounds[roundIdx] || []
  const isLastRound  = roundIdx === rounds.length - 1
  const roundComplete = currentRound.length > 0 && currentRound.every(p => lockedPairIds.includes(p.id))

  // Reset on round change
  useEffect(() => {
    setShuffledAnswers(shuffle(currentRound.map(p => ({ id: p.id, text: p.answer }))))
    setLockedPairIds([])
    setSelectedTermId(null)
    setLines([])
    setFeedback('')
    setWrongTermId(null)
    termRefs.current = {}
    answerRefs.current = {}
  }, [roundIdx])

  // Compute SVG lines from locked pair card positions
  const computeLines = useCallback((locked) => {
    const panel = panelRef.current
    if (!panel) return
    const panelRect = panel.getBoundingClientRect()
    const newLines = []
    for (const id of locked) {
      const tEl = termRefs.current[id]
      const aEl = answerRefs.current[id]
      if (!tEl || !aEl) continue
      const tRect = tEl.getBoundingClientRect()
      const aRect = aEl.getBoundingClientRect()
      newLines.push({
        id,
        x1: tRect.right  - panelRect.left,
        y1: tRect.top    + tRect.height / 2 - panelRect.top,
        x2: aRect.left   - panelRect.left,
        y2: aRect.top    + aRect.height / 2 - panelRect.top,
      })
    }
    setLines(newLines)
  }, [])

  useEffect(() => {
    const handler = () => computeLines(lockedPairIds)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [lockedPairIds, computeLines])

  // Interactions
  function handleTermSelect(id) {
    if (lockedPairIds.includes(id) || wrongTermId) return
    setSelectedTermId(prev => prev === id ? null : id)
    setFeedback('')
  }

  function handleAnswerSelect(answerId) {
    if (!selectedTermId || lockedPairIds.includes(answerId) || wrongTermId) return
    const pair = currentRound.find(p => p.id === selectedTermId)
    if (!pair) return

    if (pair.id === answerId) {
      // Correct match
      const newLocked = [...lockedPairIds, pair.id]
      setLockedPairIds(newLocked)
      setSelectedTermId(null)
      setFeedback('')
      // Recompute lines after paint
      requestAnimationFrame(() => requestAnimationFrame(() => computeLines(newLocked)))
      // Advance on completion
      if (newLocked.length === currentRound.length && isLastRound) {
        setTimeout(() => onComplete?.(), 700)
      }
    } else {
      // Wrong match
      setWrongTermId(selectedTermId)
      setFeedback('Not quite — think about the connection.')
      logWrongAnswer({
        subject: subjectKey,
        topic: pair.term,
        questionId: `matching-${pair.id}`,
        questionText: pair.term,
        source: 'module',
        questionType: 'connection',
        marks: 1,
      })
      setTimeout(() => {
        setWrongTermId(null)
        setSelectedTermId(null)
      }, 420)
    }
  }

  const n              = currentRound.length
  const cardMinHeight  = n >= 5 ? 56 : 64
  const rowGap         = n >= 5 ? 10 : 14
  const answerFontSize = n >= 5 ? 11.5 : 12.5

  return (
    <CinematicShell style={{
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      fontFamily: TYPE.bodyText.fontFamily,
    }}>
      <style>{CSS}</style>

      {/* Background */}
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(12,14,18,0.68)',
        zIndex: 0,
      }} />
      {/* Vignette: darker top/bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 28%, transparent 68%, rgba(0,0,0,0.48) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Scrollable content */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: `calc(66px + env(safe-area-inset-top, 0px)) 16px calc(20px + env(safe-area-inset-bottom, 0px))`,
        maxWidth: 430, width: '100%', margin: '0 auto',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <div style={{
          ...TYPE.sectionHeading,
          color: TEXT_PRIMARY,
          marginBottom: 8,
          maxWidth: '90%',
          animation: 'mt-fade-in 380ms ease both',
        }}>
          {screen.title || 'Knowledge check'}
        </div>

        {/* Instruction */}
        <div style={{
          ...TYPE.bodySmallText,
          color: TEXT_DIM,
          maxWidth: 340,
          marginBottom: 18,
          animation: 'mt-fade-in 380ms ease 50ms both',
        }}>
          {screen.instruction || 'Match each term to its description.'}
        </div>

        {/* Round progress */}
        {rounds.length > 1 && (
          <div style={{ marginBottom: 12, animation: 'mt-fade-in 380ms ease 70ms both' }}>
            <SequenceProgress
              total={rounds.length}
              current={roundIdx}
              completed={roundIdx}
              accent={accent}
              accentRgb={accentRgb}
              ariaLabel="Round progress"
            />
          </div>
        )}

        {/* ── Task panel ── */}
        <div
          ref={panelRef}
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: 24,
            padding: '16px 12px 18px',
            background: 'rgba(12,14,22,0.72)',
            border: `1px solid rgba(${accentRgb},0.18)`,
            boxShadow: '0 18px 48px rgba(0,0,0,0.38)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            animation: 'mt-fade-in 380ms ease 90ms both',
          }}
        >
          {/* SVG line layer — above cards so lines are always visible */}
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {lines.map(l => (
              <line
                key={l.id}
                x1={l.x1} y1={l.y1}
                x2={l.x2} y2={l.y2}
                stroke={`rgba(${accentRgb},0.72)`}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Column labels */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14,
            marginBottom: 8,
          }}>
            {['Term', 'Meaning'].map(label => (
              <div key={label} style={{
                ...TYPE.metadataText,
                textTransform: 'uppercase',
                color: `rgba(${accentRgb},0.50)`,
              }}>{label}</div>
            ))}
          </div>

          {/* Card grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14,
            position: 'relative',
          }}>
            {/* Terms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {currentRound.map(pair => {
                const isSelected = selectedTermId === pair.id
                const isLocked   = lockedPairIds.includes(pair.id)
                const isWrong    = wrongTermId === pair.id
                return (
                  <button
                    key={pair.id}
                    ref={el => { termRefs.current[pair.id] = el }}
                    onClick={() => !isLocked && handleTermSelect(pair.id)}
                    style={{
                      minHeight: cardMinHeight,
                      padding: '11px 10px',
                      borderRadius: 14,
                      background: isLocked ? CARD_BG_LOCKED : CARD_BG,
                      border: `1px solid ${
                        isLocked   ? CARD_BORDER_LOCKED   :
                        isWrong    ? CARD_BORDER_WRONG    :
                        isSelected ? CARD_BORDER_SELECTED :
                        CARD_BORDER
                      }`,
                      boxShadow: isSelected && !isLocked
                        ? `0 0 0 1px rgba(${accentRgb},0.18), 0 0 18px rgba(${accentRgb},0.18)`
                        : 'none',
                      transform: isSelected && !isLocked ? 'translateY(-1px)' : 'none',
                      cursor: isLocked ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontFamily: TYPE.bodyText.fontFamily,
                      fontWeight: 600,
                      fontSize: 13.5,
                      lineHeight: 1.3,
                      color: TEXT_PRIMARY,
                      transition: `border-color ${MOTION.duration.fast} ease, box-shadow ${MOTION.duration.fast} ease, transform 120ms ease`,
                      animation: isWrong ? 'mt-shake 380ms ease' : 'none',
                      position: 'relative',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {pair.term}
                    {isLocked && (
                      <span style={{
                        position: 'absolute', top: 6, right: 8,
                        fontSize: 10, color: accent, lineHeight: 1,
                      }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Answers (shuffled) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {shuffledAnswers.map(ans => {
                const isLocked = lockedPairIds.includes(ans.id)
                return (
                  <button
                    key={ans.id}
                    ref={el => { answerRefs.current[ans.id] = el }}
                    onClick={() => !isLocked && handleAnswerSelect(ans.id)}
                    style={{
                      minHeight: cardMinHeight,
                      padding: '11px 10px',
                      borderRadius: 14,
                      background: isLocked ? CARD_BG_LOCKED : CARD_BG,
                      border: `1px solid ${isLocked ? CARD_BORDER_LOCKED : CARD_BORDER}`,
                      cursor: isLocked ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontFamily: TYPE.bodyText.fontFamily,
                      fontWeight: 400,
                      fontSize: answerFontSize,
                      lineHeight: 1.25,
                      color: TEXT_PRIMARY,
                      transition: `border-color ${MOTION.duration.fast} ease`,
                      position: 'relative',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {ans.text}
                    {isLocked && (
                      <span style={{
                        position: 'absolute', top: 6, right: 8,
                        fontSize: 10, color: accent, lineHeight: 1,
                      }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Feedback area */}
        <div style={{
          marginTop: 14,
          minHeight: 44,
          fontSize: 13,
          color: 'rgba(245,225,190,0.82)',
          display: 'flex', alignItems: 'center',
        }}>
          {feedback}
        </div>

        {/* Continue to next round */}
        {roundComplete && !isLastRound && (
          <ContinueCTA
            onClick={() => setRoundIdx(r => r + 1)}
            accent={accent}
            style={{ marginTop: 14, animation: 'mt-fade-in 360ms ease both' }}
          />
        )}
      </div>
    </CinematicShell>
  )
}
