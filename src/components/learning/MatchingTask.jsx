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

const DEFAULT_COPY = {
  title: 'Knowledge check',
  instruction: 'Choose a term, then choose its matching description.',
  leftLabel: 'Term',
  rightLabel: 'Match',
  incorrect: 'Not quite — think about the connection.',
  takeaway: 'All connections matched.',
}

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

const CSS = `
  @keyframes mt-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes mt-shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-5px); }
    45% { transform: translateX(5px); }
    65% { transform: translateX(-3px); }
    85% { transform: translateX(2px); }
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
export default function MatchingTask({ screen = {}, subject, onComplete }) {
  const allPairs = screen.pairs || []
  const subjectKey = subject || screen.subject || 'History'
  const backgroundImage = screen.backgroundImage || ''
  const leftLabel = screen.leftLabel || DEFAULT_COPY.leftLabel
  const rightLabel = screen.rightLabel || DEFAULT_COPY.rightLabel
  const completionTakeaway = screen.completionTakeaway ?? DEFAULT_COPY.takeaway

  const theme = SUBJECTS[subjectKey] || SUBJECTS.History
  const accent = theme.accent
  const accentRgb = theme.accentRgb
  const subjectBackground = theme.background || GENERAL.backgroundApp

  const cardRest = GENERAL.surfaceTint
  const cardRecent = `rgba(${accentRgb},0.11)`
  const cardSelected = `rgba(${accentRgb},0.12)`
  const borderRest = GENERAL.line.faint
  const borderRecent = `rgba(${accentRgb},0.42)`
  const borderSelected = `rgba(${accentRgb},0.62)`
  const wrongBorder = `rgba(${GENERAL.feedbackIncorrectRgb},0.72)`

  const numberOfRounds = allPairs.length > ROUND_MAX
    ? Math.ceil(allPairs.length / ROUND_MAX)
    : 1
  const chunkSize = numberOfRounds > 1
    ? Math.ceil(allPairs.length / numberOfRounds)
    : allPairs.length
  const rounds = []

  for (let index = 0; index < allPairs.length; index += chunkSize) {
    rounds.push(allPairs.slice(index, index + chunkSize))
  }

  const [roundIndex, setRoundIndex] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [selectedTermId, setSelectedTermId] = useState(null)
  const [lockedPairIds, setLockedPairIds] = useState([])
  const [recentMatchedId, setRecentMatchedId] = useState(null)
  const [wrongTermId, setWrongTermId] = useState(null)
  const [wrongAnswerId, setWrongAnswerId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [paths, setPaths] = useState([])

  const panelRef = useRef(null)
  const completionRef = useRef(null)
  const termRefs = useRef({})
  const answerRefs = useRef({})
  const recentTimerRef = useRef(null)
  const wrongTimerRef = useRef(null)

  const currentRound = rounds[roundIndex] || []
  const isLastRound = roundIndex === rounds.length - 1
  const roundComplete = currentRound.length > 0
    && currentRound.every(pair => lockedPairIds.includes(pair.id))

  useEffect(() => {
    setShuffledAnswers(shuffle(
      currentRound.map(pair => ({ id: pair.id, text: pair.answer })),
    ))
    setLockedPairIds([])
    setSelectedTermId(null)
    setPaths([])
    setFeedback('')
    setRecentMatchedId(null)
    setWrongTermId(null)
    setWrongAnswerId(null)
    termRefs.current = {}
    answerRefs.current = {}

    return () => {
      if (recentTimerRef.current) window.clearTimeout(recentTimerRef.current)
      if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    }
  }, [roundIndex])

  const computePaths = useCallback((lockedIds) => {
    const panel = panelRef.current
    if (!panel) return

    const panelRect = panel.getBoundingClientRect()
    const nextPaths = []

    for (const id of lockedIds) {
      const termElement = termRefs.current[id]
      const answerElement = answerRefs.current[id]
      if (!termElement || !answerElement) continue

      const termRect = termElement.getBoundingClientRect()
      const answerRect = answerElement.getBoundingClientRect()
      const startX = termRect.right - panelRect.left
      const startY = termRect.top + termRect.height / 2 - panelRect.top
      const endX = answerRect.left - panelRect.left
      const endY = answerRect.top + answerRect.height / 2 - panelRect.top
      const curve = Math.max((endX - startX) * 0.46, SPACING.micro)

      nextPaths.push({
        id,
        d: `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`,
      })
    }

    setPaths(nextPaths)
  }, [])

  useEffect(() => {
    const handleResize = () => computePaths(lockedPairIds)
    window.addEventListener('resize', handleResize)

    const panel = panelRef.current
    const observer = panel && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handleResize)
      : null

    if (panel && observer) observer.observe(panel)

    return () => {
      window.removeEventListener('resize', handleResize)
      observer?.disconnect()
    }
  }, [lockedPairIds, computePaths])

  useEffect(() => {
    if (!roundComplete || !completionRef.current) return undefined

    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      completionRef.current?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'nearest',
      })
      completionRef.current?.querySelector('button')?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [roundComplete, roundIndex])

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
      const nextLockedIds = [...lockedPairIds, pair.id]
      setLockedPairIds(nextLockedIds)
      setSelectedTermId(null)
      setFeedback('')
      setRecentMatchedId(pair.id)

      if (recentTimerRef.current) window.clearTimeout(recentTimerRef.current)
      recentTimerRef.current = window.setTimeout(
        () => setRecentMatchedId(null),
        GENERAL.cinematic.motion.attentionDelayMs,
      )

      requestAnimationFrame(() => {
        requestAnimationFrame(() => computePaths(nextLockedIds))
      })
      return
    }

    setWrongTermId(selectedTermId)
    setWrongAnswerId(answerId)
    setFeedback(screen.incorrectFeedback || DEFAULT_COPY.incorrect)

    logWrongAnswer({
      subject: subjectKey,
      topic: pair.term,
      questionId: `matching-${pair.id}`,
      questionText: pair.term,
      source: 'module',
      questionType: 'connection',
      marks: 1,
    })

    if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current)
    wrongTimerRef.current = window.setTimeout(() => {
      setWrongTermId(null)
      setWrongAnswerId(null)
      setSelectedTermId(null)
    }, Number.parseInt(MOTION.duration.slow, 10))
  }

  const isCompactRound = currentRound.length >= 5
  const cardMinHeight = SPACING.micro * (isCompactRound ? 7 : 8)
  const rowGap = isCompactRound ? SPACING.micro : SPACING.compact
  const termTypography = isCompactRound ? TYPE.bodySmall : TYPE.bodyStrong
  const answerTypography = isCompactRound ? TYPE.caption : TYPE.bodySmall

  const anchorStyle = (side, isActive, isLocked, isRecent, isWrong) => ({
    position: 'absolute',
    top: '50%',
    [side]: -(ANCHOR_SIZE / 2),
    width: ANCHOR_SIZE,
    height: ANCHOR_SIZE,
    borderRadius: RADII.pill,
    transform: 'translateY(-50%)',
    background: isWrong
      ? GENERAL.feedbackIncorrect
      : isRecent || isActive
        ? accent
        : isLocked
          ? `rgba(${accentRgb},0.58)`
          : GENERAL.backgroundSurface,
    border: `${COMPONENT_SIZE.hairline}px solid ${
      isWrong
        ? GENERAL.feedbackIncorrect
        : isRecent || isActive
          ? accent
          : isLocked
            ? `rgba(${accentRgb},0.42)`
            : GENERAL.ring.rest
    }`,
    boxShadow: isActive && !isLocked
      ? `0 0 14px rgba(${accentRgb},0.38)`
      : 'none',
    zIndex: 3,
    animation: isLocked
      ? `mt-anchor-settle ${MOTION.duration.slow} ${MOTION.easing.standard} both`
      : 'none',
    transition: [
      `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
      `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
      `box-shadow ${MOTION.duration.fast} ${MOTION.easing.standard}`,
    ].join(', '),
  })

  return (
    <CinematicShell style={{
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      background: subjectBackground,
    }}>
      <style>{CSS}</style>

      {backgroundImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
      )}

      <div style={{
        position: 'absolute',
        inset: 0,
        background: subjectBackground,
        opacity: backgroundImage ? 0.64 : 1,
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
            animation: `mt-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}
        >
          {screen.title || DEFAULT_COPY.title}
        </div>

        <div
          className="mt-motion"
          style={{
            ...TYPE.bodySmall,
            color: GENERAL.cinematic.textSecondary,
            maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
            marginBottom: SPACING.standard,
            animation: `mt-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} 50ms both`,
          }}
        >
          {screen.instruction || DEFAULT_COPY.instruction}
        </div>

        {rounds.length > 1 && (
          <div
            className="mt-motion"
            style={{
              marginBottom: SPACING.compact,
              animation: `mt-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} 70ms both`,
            }}
          >
            <SequenceProgress
              total={rounds.length}
              current={roundIndex}
              completed={roundIndex}
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
            animation: `mt-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} 90ms both`,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: `-${SPACING.standard}px -${SPACING.compact}px`,
              background: 'radial-gradient(ellipse at center, rgba(8,9,13,0.38), rgba(8,9,13,0.08) 72%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

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
            {paths.map(path => {
              const isRecent = path.id === recentMatchedId
              return (
                <path
                  key={path.id}
                  d={path.d}
                  fill="none"
                  stroke={`rgba(${accentRgb},${isRecent ? 0.82 : 0.38})`}
                  strokeWidth={isRecent ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  shapeRendering="geometricPrecision"
                  className="mt-motion"
                  style={{
                    transition: [
                      `stroke ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                      `stroke-width ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                    ].join(', '),
                  }}
                />
              )
            })}
          </svg>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: SPACING.standard,
            marginBottom: SPACING.compact,
            position: 'relative',
            zIndex: 2,
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
            zIndex: 2,
          }}>
            <div
              role="group"
              aria-label={leftLabel}
              style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}
            >
              {currentRound.map(pair => {
                const isSelected = selectedTermId === pair.id
                const isLocked = lockedPairIds.includes(pair.id)
                const isRecent = recentMatchedId === pair.id
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
                      background: isSelected ? cardSelected : isRecent ? cardRecent : cardRest,
                      border: `${COMPONENT_SIZE.hairline}px solid ${
                        isWrong
                          ? wrongBorder
                          : isSelected
                            ? borderSelected
                            : isRecent
                              ? borderRecent
                              : borderRest
                      }`,
                      boxShadow: isSelected && !isLocked
                        ? `0 0 0 ${COMPONENT_SIZE.hairline}px rgba(${accentRgb},0.12), 0 0 18px rgba(${accentRgb},0.14)`
                        : 'none',
                      transform: isSelected && !isLocked
                        ? `scale(${MOTION.scale.subtle})`
                        : 'none',
                      opacity: isDeemphasised ? 0.68 : isLocked && !isRecent ? 0.72 : 1,
                      cursor: isLocked ? 'default' : 'pointer',
                      textAlign: 'left',
                      color: GENERAL.cinematic.textPrimary,
                      transition: [
                        `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `box-shadow ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `opacity ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                      ].join(', '),
                      animation: isWrong
                        ? `mt-shake ${MOTION.duration.slow} ${MOTION.easing.standard}`
                        : 'none',
                      position: 'relative',
                      zIndex: 2,
                      WebkitTapHighlightColor: 'transparent',
                      ...termTypography,
                    }}
                  >
                    {pair.term}
                    <span
                      aria-hidden="true"
                      style={anchorStyle('right', isSelected, isLocked, isRecent, isWrong)}
                    />
                  </button>
                )
              })}
            </div>

            <div
              role="group"
              aria-label={rightLabel}
              style={{ display: 'flex', flexDirection: 'column', gap: rowGap }}
            >
              {shuffledAnswers.map(answer => {
                const isLocked = lockedPairIds.includes(answer.id)
                const isRecent = recentMatchedId === answer.id
                const isWrong = wrongAnswerId === answer.id
                const isAvailable = Boolean(selectedTermId) && !isLocked

                return (
                  <button
                    key={answer.id}
                    ref={element => { answerRefs.current[answer.id] = element }}
                    type="button"
                    disabled={isLocked || !selectedTermId}
                    onClick={() => handleAnswerSelect(answer.id)}
                    className="mt-motion"
                    style={{
                      minHeight: Math.max(cardMinHeight, COMPONENT_SIZE.touchTarget),
                      padding: `${SPACING.micro + 4}px ${SPACING.micro + 2}px`,
                      borderRadius: RADII.medium,
                      background: isRecent ? cardRecent : cardRest,
                      border: `${COMPONENT_SIZE.hairline}px solid ${
                        isWrong ? wrongBorder : isRecent ? borderRecent : borderRest
                      }`,
                      boxShadow: isAvailable && !isWrong
                        ? `inset ${COMPONENT_SIZE.accentRail}px 0 0 rgba(${accentRgb},0.34)`
                        : 'none',
                      cursor: isLocked ? 'default' : selectedTermId ? 'pointer' : 'default',
                      textAlign: 'left',
                      color: GENERAL.cinematic.textPrimary,
                      opacity: isLocked && !isRecent ? 0.72 : selectedTermId ? 1 : 0.84,
                      transition: [
                        `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `box-shadow ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        `opacity ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                      ].join(', '),
                      animation: isWrong
                        ? `mt-shake ${MOTION.duration.slow} ${MOTION.easing.standard}`
                        : 'none',
                      position: 'relative',
                      zIndex: 2,
                      WebkitTapHighlightColor: 'transparent',
                      ...answerTypography,
                    }}
                  >
                    {answer.text}
                    <span
                      aria-hidden="true"
                      style={anchorStyle('left', isAvailable, isLocked, isRecent, isWrong)}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className="mt-motion"
            style={{
              ...TYPE.bodySmall,
              marginTop: SPACING.compact,
              color: GENERAL.feedbackIncorrect,
              animation: `mt-fade-in ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
            }}
          >
            {feedback}
          </div>
        )}

        {roundComplete && (
          <div
            ref={completionRef}
            className="mt-motion"
            tabIndex={-1}
            style={{
              marginTop: SPACING.compact,
              scrollMarginBottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
              animation: `mt-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}
          >
            {isLastRound && completionTakeaway && (
              <div style={{
                ...TYPE.bodyStrong,
                color: GENERAL.cinematic.textFact,
                marginBottom: SPACING.compact,
                maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
              }}>
                {completionTakeaway}
              </div>
            )}

            <ContinueCTA
              onClick={isLastRound ? onComplete : () => setRoundIndex(index => index + 1)}
              accent={accent}
            />
          </div>
        )}
      </div>
    </CinematicShell>
  )
}
