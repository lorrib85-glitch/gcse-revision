import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell used here because this screen renders full-bleed absolute-positioned
// image layers that must reach all four edges; ContentShell's horizontal padding and
// opaque background would clip the atmospheric imagery and break the layout.
import CinematicShell from '../layout/CinematicShell.jsx'

function findActiveImage(beats, beatIdx) {
  for (let index = beatIdx; index >= 0; index -= 1) {
    if (beats[index]?.image) return { beat: beats[index], index }
  }
  return { beat: {}, index: -1 }
}

export default function VisualNarrativeScreen({
  subject = 'History',
  beats = [],
  onRevealStart,
  onContinue,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const timersRef = useRef(new Set())
  const revealStartedRef = useRef(false)

  const [beatIdx, setBeatIdx] = useState(0)
  const [factCount, setFactCount] = useState(0)
  const [showConclusion, setShowConclusion] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [locked, setLocked] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)

  const beat = beats[beatIdx] || {}
  const isFacts = Array.isArray(beat.facts)
  const totalFacts = isFacts ? beat.facts.length : 0
  const isLastBeat = beatIdx === beats.length - 1
  const hasConclusion = Boolean(beat.conclusion)
  const { beat: imageBeat, index: imageBeatIndex } = findActiveImage(beats, beatIdx)
  const imageMode = imageBeat.imageMode || (imageBeatIndex <= 0 ? 'full' : 'upper')
  const imageBottom = imageMode === 'full' ? 0 : (imageBeat.imageBottom ?? '42%')
  const imageAlt = imageBeat.imageAlt || imageBeat.alt
  const highlight = showConclusion ? beat.highlight : null

  function schedule(callback, delay) {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
  }

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
  }, [])

  // Reset hint after each action.
  useEffect(() => {
    setHintVisible(false)
    const timer = setTimeout(
      () => setHintVisible(true),
      GENERAL.cinematic.motion.hintDelayMs,
    )
    return () => clearTimeout(timer)
  }, [beatIdx, factCount])

  function beginReveal() {
    if (revealStartedRef.current) return
    revealStartedRef.current = true
    onRevealStart?.()
  }

  function lockAndUnlock() {
    setLocked(true)
    schedule(
      () => setLocked(false),
      GENERAL.cinematic.motion.lockDelayMs,
    )
  }

  function advanceBeat() {
    setFactCount(0)
    setShowConclusion(false)
    setShowCTA(false)
    setBeatIdx(index => Math.min(index + 1, beats.length - 1))
  }

  function completeBeat() {
    if (isLastBeat) {
      onContinue?.()
      return
    }
    lockAndUnlock()
    advanceBeat()
  }

  function revealCompletion() {
    schedule(() => {
      if (hasConclusion) setShowConclusion(true)
      schedule(
        () => setShowCTA(true),
        hasConclusion ? GENERAL.cinematic.motion.ctaDelayMs : 0,
      )
    }, GENERAL.cinematic.motion.conclusionDelayMs)
  }

  function handleTap() {
    if (locked || beats.length === 0) return
    beginReveal()

    if (isFacts) {
      if (factCount < totalFacts) {
        lockAndUnlock()
        const next = factCount + 1
        setFactCount(next)
        if (next === totalFacts) revealCompletion()
        return
      }

      if (totalFacts === 0 && !showConclusion && !showCTA) {
        if (hasConclusion) setShowConclusion(true)
        setShowCTA(true)
        return
      }

      if (showCTA) completeBeat()
      return
    }

    completeBeat()
  }

  if (beats.length === 0) return null

  const showHint = hintVisible && !showConclusion && !showCTA
  const showCinematicContinue = showHint && !isFacts
  const factInteractionActive = isFacts && !showConclusion && !showCTA
  const factInteractionLabel = totalFacts > 0
    ? `Reveal fact ${Math.min(factCount + 1, totalFacts)} of ${totalFacts}`
    : 'Reveal conclusion'
  const liveMessage = showConclusion
    ? (beat.conclusion || '')
    : (factCount > 0 ? beat.facts[factCount - 1] : '')

  const sourceNote = beat.source && (
    <div style={{
      ...TYPE.caption,
      marginTop: SPACING.compact,
      color: GENERAL.cinematic.sourceText,
      animation: `vnFadeIn ${GENERAL.cinematic.motion.standard} ease ${GENERAL.cinematic.motion.fast} both`,
      maxWidth: 280,
    }}>
      <span style={{
        ...TYPE.metadata,
        display: 'inline-block',
        marginRight: SPACING.micro,
      }}>
        Source
      </span>
      {beat.source}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes vnFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vnFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes vnHighlightPulse {
          0%, 100% { opacity: 0.62; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.92; transform: translate(-50%, -50%) scale(1.28); }
        }
        .vn-fact-hit-area:focus-visible {
          outline: 2px solid ${accent};
          outline-offset: -4px;
        }
        .vn-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .vn-motion,
          .vn-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .vn-highlight {
            animation: none !important;
            opacity: 0.82 !important;
          }
        }
      `}</style>

      <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 100 }}>
        <div
          className="vn-motion"
          onClick={handleTap}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* The active image is the most recent beat image, so later text-only
              beats can reuse it without assuming a portrait/timeline story. */}
          {imageBeat.image && (
            <div
              key={`${imageBeat.image}:${imageBeatIndex}`}
              role={imageAlt ? 'img' : undefined}
              aria-label={imageAlt || undefined}
              aria-hidden={imageAlt ? undefined : true}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: imageBottom,
                backgroundImage: `url(${imageBeat.image})`,
                backgroundSize: imageBeat.imageSize || 'cover',
                backgroundPosition: imageBeat.imagePosition
                  || (imageMode === 'full' ? 'center top' : 'center 25%'),
                opacity: beat.imageOpacity ?? imageBeat.imageOpacity ?? 1,
                transition: `opacity ${GENERAL.cinematic.motion.slow} ease`,
                animation: `vnFadeIn ${GENERAL.cinematic.motion.slow} ease both`,
                filter: imageBeat.imageFilter
                  || (imageMode === 'full'
                    ? GENERAL.cinematic.imageFilterFull
                    : GENERAL.cinematic.imageFilterUpper),
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Optional subject-accent highlight supplied by content data. */}
          {highlight && (
            <div
              className="vn-highlight"
              style={{
                position: 'absolute',
                top: highlight.top,
                left: highlight.left,
                width: highlight.size || SPACING.separation + SPACING.micro,
                height: highlight.size || SPACING.separation + SPACING.micro,
                borderRadius: RADII.pill,
                background: `radial-gradient(circle, rgba(${highlight.rgb || rgb},${highlight.opacity ?? 0.55}) 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 2,
                animation: `vnHighlightPulse ${GENERAL.cinematic.motion.pulse} ease-in-out infinite`,
              }}
            />
          )}

          {/* Dark gradient protects text without turning the image into a panel. */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: GENERAL.cinematic.overlay,
            pointerEvents: 'none',
          }} />

          {/* Narrative beats: cinematic headline + short body at the bottom. */}
          {!isFacts && (
            <div
              key={beatIdx}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: `0 ${SPACING.standard}px calc(${SPACING.cinematic + SPACING.separation + SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
                animation: `vnFadeUp ${GENERAL.cinematic.motion.standard} cubic-bezier(0.16,1,0.3,1) both`,
                pointerEvents: 'none',
              }}
            >
              {beat.showLabel === true && beat.label && (
                <div style={{
                  ...TYPE.label,
                  color: GENERAL.cinematic.textMuted,
                  marginBottom: SPACING.micro,
                }}>
                  {beat.label}
                </div>
              )}

              <h1 style={{
                ...TYPE.displayCinematic,
                color: GENERAL.cinematic.textPrimary,
                margin: 0,
                marginBottom: SPACING.compact,
                maxWidth: 352,
              }}>
                {beat.headline}
              </h1>

              {beat.body && (
                <p style={{
                  ...TYPE.bodyStrong,
                  color: GENERAL.cinematic.textSecondary,
                  maxWidth: '31ch',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}>
                  {beat.body}
                </p>
              )}
            </div>
          )}

          {/* Sequential facts, then an optional conclusion. Fact-only beats keep
              their evidence visible while Continue appears. */}
          {isFacts && (
            <div style={{
              position: 'absolute',
              top: '52%',
              left: SPACING.standard,
              right: SPACING.standard,
              paddingBottom: `calc(${SPACING.cinematic + SPACING.micro}px + env(safe-area-inset-bottom, 0px))`,
              pointerEvents: 'none',
            }}>
              {!showConclusion ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING.micro,
                }}>
                  {factCount === 0 && !showCTA && (
                    <div style={{
                      ...TYPE.label,
                      color: GENERAL.cinematic.textSubtle,
                      marginBottom: SPACING.compact,
                    }}>
                      Tap to reveal
                    </div>
                  )}
                  {beat.facts.slice(0, factCount).map((fact, index) => (
                    <p
                      key={`${index}:${fact}`}
                      style={{
                        ...TYPE.bodyStrong,
                        color: GENERAL.cinematic.textFact,
                        animation: `vnFadeUp ${GENERAL.cinematic.motion.fast} cubic-bezier(0.16,1,0.3,1) both`,
                        margin: 0,
                      }}
                    >
                      {fact}
                    </p>
                  ))}
                  {showCTA && (
                    <div style={{ marginTop: SPACING.standard, pointerEvents: 'auto' }}>
                      <ContinueCTA
                        onClick={event => {
                          event.stopPropagation()
                          completeBeat()
                        }}
                        accent={accent}
                        style={{ animation: `vnFadeIn ${GENERAL.cinematic.motion.fast} ease both` }}
                      />
                      {sourceNote}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h2 style={{
                    ...TYPE.displaySection,
                    color: accent,
                    whiteSpace: 'pre-line',
                    animation: `vnFadeIn ${GENERAL.cinematic.motion.slow} ease both`,
                    margin: 0,
                  }}>
                    {beat.conclusion}
                  </h2>

                  {showCTA && (
                    <div style={{ marginTop: SPACING.standard, pointerEvents: 'auto' }}>
                      <ContinueCTA
                        onClick={event => {
                          event.stopPropagation()
                          completeBeat()
                        }}
                        accent={accent}
                        style={{ animation: `vnFadeIn ${GENERAL.cinematic.motion.fast} ease both` }}
                      />
                      {sourceNote}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {factInteractionActive && (
            <button
              type="button"
              className="vn-fact-hit-area"
              aria-label={factInteractionLabel}
              onClick={event => {
                event.stopPropagation()
                handleTap()
              }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
          )}

          <div
            className="vn-visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            {liveMessage}
          </div>

          {showCinematicContinue && (
            <CinematicContinueCTA
              onClick={handleTap}
              accent={accent}
              animation={`crm-fade ${GENERAL.cinematic.motion.slow} ease both, crm-pulse ${GENERAL.cinematic.motion.pulse} ease-in-out ${GENERAL.cinematic.motion.attentionDelay} infinite`}
            />
          )}
        </div>
      </CinematicShell>
    </>
  )
}
