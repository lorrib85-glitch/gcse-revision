import { useState, useEffect, useRef, useCallback } from 'react'
import { MOTION } from '../../constants/motion.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const BRONZE     = '#D69B45'
const BRONZE_RGB = '214,155,69'
const CARD_BG    = 'rgba(74,45,22,0.82)'
const CARD_BG_LOCKED = 'rgba(88,61,29,0.90)'
const CARD_BORDER = 'rgba(219,166,91,0.22)'
const CARD_BORDER_LOCKED = 'rgba(218,170,94,0.55)'
const CARD_BORDER_SELECTED = 'rgba(230,175,88,0.68)'
const CARD_BORDER_WRONG = 'rgba(168,76,53,0.75)'
const TEXT_PRIMARY = 'rgba(255,244,222,0.92)'
const TEXT_DIM     = 'rgba(245,230,200,0.78)'

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
  const [showComplete,    setShowComplete]      = useState(false)
  const [ctaPressed,      setCtaPressed]       = useState(false)

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
        setTimeout(() => setShowComplete(true), 700)
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

  if (showComplete) return <CompleteScreen screen={screen} bgImage={bgImage} onComplete={onComplete} />

  const n              = currentRound.length
  const cardMinHeight  = n >= 5 ? 56 : 64
  const rowGap         = n >= 5 ? 10 : 14
  const answerFontSize = n >= 5 ? 11.5 : 12.5

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Sora', sans-serif",
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
        background: 'rgba(15,9,4,0.68)',
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

        {/* Header — 8px top margin from safe area */}
        <div style={{
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1.05,
          color: TEXT_PRIMARY,
          marginBottom: 8,
          maxWidth: '90%',
          animation: 'mt-fade-in 380ms ease both',
        }}>
          {screen.title || 'Knowledge check'}
        </div>

        {/* Instruction */}
        <div style={{
          fontSize: 13,
          lineHeight: 1.35,
          color: TEXT_DIM,
          maxWidth: 340,
          marginBottom: 18,
          animation: 'mt-fade-in 380ms ease 50ms both',
        }}>
          {screen.instruction || 'Match each term to its description.'}
        </div>

        {/* Round indicator */}
        {rounds.length > 1 && (
          <div style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: `rgba(${BRONZE_RGB},0.60)`,
            marginBottom: 12,
            animation: 'mt-fade-in 380ms ease 70ms both',
          }}>
            Round {roundIdx + 1} of {rounds.length}
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
            background: 'rgba(36,22,11,0.72)',
            border: '1px solid rgba(196,142,73,0.22)',
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
                stroke="rgba(218,170,94,0.72)"
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
                fontSize: 11, textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(230,198,150,0.55)',
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
                        ? '0 0 0 1px rgba(230,175,88,0.18), 0 0 18px rgba(230,175,88,0.18)'
                        : 'none',
                      transform: isSelected && !isLocked ? 'translateY(-1px)' : 'none',
                      cursor: isLocked ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontFamily: "'Sora', sans-serif",
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
                        fontSize: 10, color: BRONZE, lineHeight: 1,
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
                      fontFamily: "'Sora', sans-serif",
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
                        fontSize: 10, color: BRONZE, lineHeight: 1,
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
          <button
            onClick={() => setRoundIdx(r => r + 1)}
            onPointerDown={() => setCtaPressed(true)}
            onPointerUp={() => setCtaPressed(false)}
            onPointerLeave={() => setCtaPressed(false)}
            style={{
              width: '100%', height: 48,
              borderRadius: 16, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, rgba(${BRONZE_RGB},0.85), ${BRONZE})`,
              color: '#0A0804',
              fontFamily: "'Sora', sans-serif",
              fontSize: 14, fontWeight: 700,
              boxShadow: `0 4px 20px rgba(${BRONZE_RGB},0.28)`,
              transform: ctaPressed ? 'scale(0.985)' : 'scale(1)',
              transition: 'transform 120ms ease',
              marginTop: 14,
              animation: 'mt-fade-in 360ms ease both',
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

// ── Complete screen ───────────────────────────────────────────────────────────

function CompleteScreen({ screen, bgImage, onComplete }) {
  const completion = screen.completion || {}
  const [pressed, setPressed] = useState(false)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Sora', sans-serif",
    }}>
      <style>{CSS}</style>

      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,2,0.84)', zIndex: 0 }} />

      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '20px 24px',
        maxWidth: 430, margin: '0 auto', width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 11, textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: `rgba(${BRONZE_RGB},0.65)`,
          marginBottom: 16,
          animation: 'mt-fade-in 400ms ease both',
        }}>
          Complete
        </div>

        <div style={{
          fontWeight: 700, fontSize: 32,
          lineHeight: 1.05, letterSpacing: '-0.02em',
          color: 'rgba(255,244,222,0.97)',
          marginBottom: 20,
          animation: 'mt-fade-in 400ms ease 60ms both',
        }}>
          {completion.title || 'Knowledge secured'}
        </div>

        <div style={{
          fontSize: 15, lineHeight: 1.65,
          color: 'rgba(245,230,200,0.72)',
          marginBottom: 40,
          maxWidth: 340,
          whiteSpace: 'pre-line',
          animation: 'mt-fade-in 400ms ease 120ms both',
        }}>
          {completion.body || 'You have matched all the key concepts.'}
        </div>

        <button
          onClick={onComplete}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 48,
            borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, rgba(${BRONZE_RGB},0.85), ${BRONZE})`,
            color: '#0A0804',
            fontFamily: "'Sora', sans-serif",
            fontSize: 14, fontWeight: 700,
            boxShadow: `0 4px 20px rgba(${BRONZE_RGB},0.28)`,
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 120ms ease',
            animation: 'mt-fade-in 400ms ease 200ms both',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
