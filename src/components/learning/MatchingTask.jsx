import { useState, useEffect, useRef, useCallback } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicShell from '../layout/CinematicShell.jsx'
import { MOTION } from '../../constants/motion.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'

const ROUND_MAX = 6
const CONTENT_MAX_WIDTH = 430
const ANCHOR_SIZE = SPACING.micro + 2

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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
  @keyframes mt-thread-draw {
    from { stroke-dashoffset: 1; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes mt-anchor-settle {
    0% { transform: translateY(-50%) scale(0.7); }
    65% { transform: translateY(-50%) scale(1.18); }
    100% { transform: translateY(-50%) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .mt-motion {
      animation: none !important;
      transition: none !important;
    }
  }
`

// CinematicShell is used because the full-bleed background and protective
// overlays must fill the viewport rather than the padded interaction column.
export default function MatchingTask({ screen, subject, onComplete }) {
  const allPairs = screen.pairs || []
  const subjectKey = subject || screen.subject || 'History'
  const bgImage = screen.backgroundImage || ''
  const leftLabel = screen.leftLabel || 'Belief'
  const rightLabel = screen.rightLabel || 'Response'

  const theme = SUBJECTS[subjectKey] || SUBJECTS.History
  const accent = theme.accent
  const accentRgb = theme.accentRgb

  const cardRest = GENERAL.surfaceTint
  const cardLocked = `rgba(${accentRgb},0.09)`
  const cardSelected = `rgba(${accentRgb},0.12)`
  const borderRest = GENERAL.line.soft
  const borderLocked = `rgba(${accentRgb},0.34)`
  const borderSelected = `rgba(${accentRgb},0.62)`
  const wrongBorder = `rgba(${GENERAL.feedbackIncorrectRgb},0.72)`

  // Split pairs into rounds: max 6 per round, balanced halves.
  const numRounds = allPairs.length > ROUND_MAX ? Math.ceil(allPairs.length / ROUND_MAX) : 1
  const chunkSize = numRounds > 1 ? Math.ceil(allPairs.length / numRounds) : allPairs.length
  const rounds = []
  for (let i = 0; i < allPairs.length; i += chunkSize) rounds.push(allPairs.slice(i, i + chunkSize))

  const [roundIdx, setRoundIdx] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [selectedTermId, setSelectedTermId] = useState(null)
  const [lockedPairIds, setLockedPairIds] = useState([])
  const [wrongTermId, setWrongTermId] = useState(null)
  const [wrongAnswerId, setWrongAnswerId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [lines, setLines] = useState([])

  const panelRef = useRef(null)
  const termRefs = useRef({})
  const answerRefs = useRef({})

  const currentRound = rounds[roundIdx] || []
  const isLastRound = roundIdx === rounds.length - 1
  const roundComplete = currentRound.length > 0 && currentRound.every(pair => lockedPairIds.includes(pair.id))

  // Reset only when the actual round changes. currentRound is intentionally not
  // a dependency because it is a fresh slice on every render.
  useEffect(() => {
    setShuffledAnswers(shuffle(currentRound.map(pair => ({ id: pair.id, text: pair.answer }))))
    setLockedPairIds([])
    setSelectedTermId(null)
    setLines([])
    setFeedback('')
    setWrongTermId(null)
    setWrongAnswerId(null)
    termRefs.current = {}
    answerRefs.current = {}
  }, [roundIdx])

  // Measure the real rendered card positions so connectors remain responsive to
  // text wrapping, viewport changes and different pair counts.
  const computeLines = useCallback((locked) => {
    const panel = panelRef.current
    if (!panel) return

    const panelRect = panel.getBoundingClientRect()
    const newLines = []

    for (const id of locked) {
      const termEl = termRefs.current[id]
      const answerEl = answerRefs.current[id]
      if (!termEl || !answerEl) continue

      const termRect = termEl.getBoundingClientRect()
      const answerRect = answerEl.getBoundingClientRect()
      newLines.push({
        id,
        x1: termRect.right - panelRect.left,
        y1: termRect.top + termRect.height / 2 - panelRect.top,
        x2: answerRect.left - panelRect.left,
        y2: answerRect.top + answerRect.height / 2 - panelRect.top,
      })
    }

    setLines(newLines)
  }, [])

  useEffect(() => {
    const handler = () => computeLines(lockedPairIds)
    window.addEventListener('resize', handler)

    const panel = panelRef.current
    const observer = panel && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handler)
      : null
    if (panel && observer) observer.observe(panel)

    return () => {
      window.removeEventListener('resize', handler)
      observer?.disconnect()
    }
  }, [lockedPairIds, computeLines])

  function handleTermSelect(id) {
    if (lockedPairIds.includes(id) || wrongTermId) return
    setSelectedTermId(previous => previous === id ? null : id)
    setFeedback('')
  }

  function handleAnswerSelect(answerId) {
    if (!selectedTermId || lockedPairIds.includes(answerId) || wrongTermId) return
    const pair = currentRound.find(item => item.id === selectedTermId)
    if (!pair) return

    if (pair.id === answerId) {
      const newLocked = [...lockedPairIds, pair.id]
      setLockedPairIds(newLocked)
      setSelectedTermId(null)
      setFeedback('')

      requestAnimationFrame(() => requestAnimationFrame(() => computeLines(newLocked)))

      if (newLocked.length === currentRound.length && isLastRound) {
        setTimeout(() => onComplete?.(), GENERAL.cinematic.motion.ctaDelayMs)
      }
    } else {
      setWrongTermId(selectedTermId)
      setWrongAnswerId(answerId)
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
        setWrongAnswerId(null)
        setSelectedTermId(null)
      }, 420)
    }
  }

  const isCompactRound = currentRound.length >= 5
  const cardMinHeight = SPACING.micro * (isCompactRound ? 7 : 8)
  const rowGap = isCompactRound ? SPACING.micro : SPACING.compact
  const termType = isCompactRound ? TYPE.bodySmall : TYPE.bodyStrong
  const answerType = isCompactRound ? TYPE.caption : TYPE.bodySmall

  const anchorStyle = (side, isActive, isLocked, isWrong) => ({
    position: 'absolute',
    top: '50%',
    [side]: -(ANCHOR_SIZE / 2),
    width: ANCHOR_SIZE,
    height: ANCHOR_SIZE,
    borderRadius: RADII.pill,
    transform: 'translateY(-50%)',
    background: isWrong
      ? GENERAL.feedbackIncorrect
      : isLocked || isActive
        ? accent
        : GENERAL.backgroundSurface,
    border: `${COMPONENT_SIZE.hairline}px solid ${
      isWrong
        ? GENERAL.feedbackIncorrect
        : isLocked || isActive
          ? accent
          : GENERAL.ring.rest
    }`,
    boxShadow: isActive && !isLocked
      ? `0 0 14px rgba(${accentRgb},0.38)`
      : 'none',
    zIndex: 3,
    animation: isLocked ? 'mt-anchor-settle 360ms ease both' : 'none',
    transition: `background ${MOTION.duration.fast} ease, border-color ${MOTION.duration.fast} ease, box-shadow ${MOTION.duration.fast} ease`,
  })

  return (
    <CinematicShell style={{
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      background: GENERAL.backgroundApp,
    }}>
      <style>{CSS}</style>

      {bgImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: GENERAL.backgroundApp,
        opacity: bgImage ? 0.64 : 1,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: GENERAL.cinematic.overlay,
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: `calc(${SPACING.cinematic}px + env(safe-area-inset-top, 0px)) ${SPACING.compact}px calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
        maxWidth: CONTENT_MAX_WIDTH,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <div
          className="mt-motion"
          style={{
            ...TYPE.displayScreen,
            ...HEADING_LAYOUT.screenTitle,
            color: GENERAL.cinematic.textPrimary,
            marginBottom: SPACING.micro,
            animation: 'mt-fade-in 380ms ease both',
          }}
        >
          {screen.title || 'Knowledge check'}
        </div>

        <div
          className="mt-motion"
          style={{
            ...TYPE.bodySmall,
            color: GENERAL.cinematic.textSecondary,
            maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
            marginBottom: SPACING.standard,
            animation: 'mt-fade-in 380ms ease 50ms both',
          }}
        >
          {screen.instruction || 'Choose a term, then choose its matching description.'}
        </div>

        {rounds.length > 1 && (
          <div
            className="mt-motion"
            style={{ marginBottom: SPACING.compact, animation: 'mt-fade-in 380ms ease 70ms both' }}
          >
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

        <div
          ref={panelRef}
          className="mt-motion"
          style={{
            position: 'relative',
            width: '100%',
            animation: 'mt-fade-in 380ms ease 90ms both',
          }}
        >
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {lines.map(line => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                pathLength="1"
                stroke={`rgba(${accentRgb},0.74)`}
                strokeWidth={COMPONENT_SIZE.focusRing}
                strokeLinecap="round"
                strokeDasharray="1"
                className="mt-motion"
                style={{ animation: 'mt-thread-draw 440ms ease both' }}
              />
            ))}
          </svg>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: SPACING.standard,
            marginBottom: SPACING.compact,
          }}>
            {[leftLabel, rightLabel].map(label => (
              <div key={label} style={{
                ...TYPE.label,
                color: GENERAL.cinematic.textMuted,
              }}>
                {label}
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: SPACING.standard,
            position: 'relative',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {currentRound.map(pair => {
                const isSelected = selectedTermId === pair.id
                const isLocked = lockedPairIds.includes(pair.id)
                const isWrong = wrongTermId === pair.id
                const isDeemphasised = selectedTermId && !isSelected && !isLocked

                return (
                  <button
                    key={pair.id}
                    ref={element => { termRefs.current[pair.id] = element }}
                    type="button"
                    disabled={isLocked}
                    aria-pressed={isSelected}
                    onClick={() => handleTermSelect(pair.id)}
                    className="mt-motion"
                    style={{
                      minHeight: Math.max(cardMinHeight, COMPONENT_SIZE.touchTarget),
                      padding: `${SPACING.micro + 4}px ${SPACING.micro + 2}px`,
                      borderRadius: RADII.medium,
                      background: isSelected ? cardSelected : isLocked ? cardLocked : cardRest,
                      border: `${COMPONENT_SIZE.hairline}px solid ${
                        isWrong ? wrongBorder : isSelected ? borderSelected : isLocked ? borderLocked : borderRest
                      }`,
                      boxShadow: isSelected && !isLocked
                        ? `0 0 0 ${COMPONENT_SIZE.hairline}px rgba(${accentRgb},0.12), 0 0 18px rgba(${accentRgb},0.14)`
                        : 'none',
                      transform: isSelected && !isLocked ? 'translateY(-1px)' : 'none',
                      opacity: isDeemphasised ? 0.68 : isLocked ? 0.78 : 1,
                      cursor: isLocked ? 'default' : 'pointer',
                      textAlign: 'left',
                      color: GENERAL.cinematic.textPrimary,
                      transition: `border-color ${MOTION.duration.fast} ease, background ${MOTION.duration.fast} ease, box-shadow ${MOTION.duration.fast} ease, transform ${MOTION.duration.fast} ease, opacity ${MOTION.duration.fast} ease`,
                      animation: isWrong ? 'mt-shake 380ms ease' : 'none',
                      position: 'relative',
                      zIndex: 2,
                      WebkitTapHighlightColor: 'transparent',
                      ...termType,
                    }}
                  >
                    {pair.term}
                    <span
                      aria-hidden="true"
                      style={anchorStyle('right', isSelected, isLocked, isWrong)}
                    />
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
              {shuffledAnswers.map(answer => {
                const isLocked = lockedPairIds.includes(answer.id)
                const isWrong = wrongAnswerId === answer.id
                const isAvailable = Boolean(selectedTermId) && !isLocked

                return (
                  <button
                    key={answer.id}
                    ref={element => { answerRefs.current[answer.id] = element }}
                    type="button"
                    disabled={isLocked}
                    onClick={() => handleAnswerSelect(answer.id)}
                    className="mt-motion"
                    style={{
                      minHeight: Math.max(cardMinHeight, COMPONENT_SIZE.touchTarget),
                      padding: `${SPACING.micro + 4}px ${SPACING.micro + 2}px`,
                      borderRadius: RADII.medium,
                      background: isLocked ? cardLocked : cardRest,
                      border: `${COMPONENT_SIZE.hairline}px solid ${isWrong ? wrongBorder : isLocked ? borderLocked : borderRest}`,
                      boxShadow: isAvailable && !isWrong
                        ? `inset ${COMPONENT_SIZE.accentRail}px 0 0 rgba(${accentRgb},0.34)`
                        : 'none',
                      cursor: isLocked ? 'default' : selectedTermId ? 'pointer' : 'default',
                      textAlign: 'left',
                      color: GENERAL.cinematic.textPrimary,
                      opacity: isLocked ? 0.78 : selectedTermId ? 1 : 0.84,
                      transition: `border-color ${MOTION.duration.fast} ease, background ${MOTION.duration.fast} ease, box-shadow ${MOTION.duration.fast} ease, opacity ${MOTION.duration.fast} ease`,
                      animation: isWrong ? 'mt-shake 380ms ease' : 'none',
                      position: 'relative',
                      zIndex: 2,
                      WebkitTapHighlightColor: 'transparent',
                      ...answerType,
                    }}
                  >
                    {answer.text}
                    <span
                      aria-hidden="true"
                      style={anchorStyle('left', isAvailable, isLocked, isWrong)}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          style={{
            ...TYPE.bodySmall,
            marginTop: SPACING.compact,
            minHeight: SPACING.standard,
            color: GENERAL.feedbackIncorrect,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {feedback}
        </div>

        {roundComplete && !isLastRound && (
          <ContinueCTA
            onClick={() => setRoundIdx(round => round + 1)}
            accent={accent}
            style={{ marginTop: SPACING.compact, animation: 'mt-fade-in 360ms ease both' }}
          />
        )}
      </div>
    </CinematicShell>
  )
}
