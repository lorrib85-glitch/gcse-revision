import { useEffect, useRef, useState } from 'react'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'
import BackButton from '../core/BackButton.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
// CinematicShell is used because the background and protective overlays must
// reach every viewport edge rather than being confined to a content column.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { ScreenTitle } from '../core/ScreenText.jsx'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { SUBJECT_BACKDROPS } from '../../constants/subjectBackdrops.js'

const WORD_REVEAL_BASE_MS = 180
const WORD_REVEAL_STAGGER_MS = 48
const HINT_SETTLE_MS = 320
const HEADER_CLEARANCE = SPACING.cinematic + SPACING.micro
const CTA_CLEARANCE = SPACING.section + SPACING.standard

function tokenize(text) {
  const parts = text.split(/(\s+)/)
  let wordIndex = 0

  return parts.map((part, index) => {
    if (/^\s+$/.test(part)) return { key: index, space: true, text: part }
    return { key: index, space: false, text: part, wordIndex: wordIndex++ }
  })
}

function normalisePriorities(data) {
  const priorities = data.priorities || data.tips || []

  return priorities.slice(0, 3).map((priority, index) => ({
    id: priority.id || `priority-${index + 1}`,
    title: priority.title || priority.heading || '',
    explanation: priority.explanation || priority.body || '',
  }))
}

/**
 * Pre-question examiner briefing.
 *
 * This component teaches a short success-criteria checklist before independent
 * exam practice. It does not mark an answer, award marks, compare scores or
 * annotate a completed response; those jobs belong to FaceTheExaminer.
 *
 * `examinerExplains` and its opening/tips/closing shape remain supported while
 * existing content migrates to `whatExaminersLookFor`.
 */
export default function WhatExaminersLookFor({
  subject,
  whatExaminersLookFor,
  examinerExplains,
  title = 'What examiners look for',
  label,
  showBack = true,
  onBack,
  onContinue,
}) {
  const data = whatExaminersLookFor || examinerExplains || {}
  const priorities = normalisePriorities(data)

  const introduction = data.introduction || "Here’s what the examiner is looking for."
  const context = data.context || data.opening || ''
  const takeaway = data.takeaway || data.closing || 'Use these priorities before you start writing.'
  const resolvedTitle = title || label || 'What examiners look for'

  const theme = SUBJECTS[subject] || {
    accent: GENERAL.teal,
    accentRgb: GENERAL.tealRgb,
    background: GENERAL.backgroundApp,
    backgroundSecondary: GENERAL.backgroundSurface,
  }
  const accent = theme.accent || GENERAL.teal
  const accentRgb = theme.accentRgb || hexToRgb(accent)
  const screenBackground = theme.background || GENERAL.backgroundApp
  const panelBackground = theme.backgroundSecondary || GENERAL.backgroundSurface
  const backgroundRgb = hexToRgb(screenBackground)
  const backgroundImage = SUBJECT_BACKDROPS[subject]

  const [phase, setPhase] = useState('introduction')
  const [revealedCount, setRevealedCount] = useState(0)
  const [showTakeaway, setShowTakeaway] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const scrollRef = useRef(null)

  const tokens = tokenize(introduction)
  const wordCount = tokens.filter(token => !token.space).length
  const hintDelay = WORD_REVEAL_BASE_MS
    + Math.max(0, wordCount - 1) * WORD_REVEAL_STAGGER_MS
    + HINT_SETTLE_MS

  useEffect(() => {
    if (phase !== 'introduction') return undefined
    const timer = setTimeout(() => setHintVisible(true), hintDelay)
    return () => clearTimeout(timer)
  }, [phase, hintDelay])

  useEffect(() => {
    if (!showTakeaway) return undefined
    const timer = setTimeout(
      () => setShowContinue(true),
      Number.parseInt(MOTION.duration.cinematic, 10),
    )
    return () => clearTimeout(timer)
  }, [showTakeaway])

  useEffect(() => {
    const element = scrollRef.current
    if (!element || (revealedCount === 0 && !showTakeaway)) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    element.scrollTo({
      top: element.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [revealedCount, showTakeaway])

  function handleAdvance() {
    if (phase === 'introduction') {
      setPhase('priorities')
      if (priorities.length > 0) setRevealedCount(1)
      else setShowTakeaway(true)
      return
    }

    if (revealedCount < priorities.length) {
      setRevealedCount(count => count + 1)
      return
    }

    if (!showTakeaway) setShowTakeaway(true)
  }

  const isPriorities = phase === 'priorities'
  const visiblePriorities = priorities.slice(0, revealedCount)
  const hasMoreToReveal = isPriorities && (
    revealedCount < priorities.length || !showTakeaway
  )
  const hintText = phase === 'introduction'
    ? 'Tap to see the priorities'
    : 'Tap to reveal the next priority'

  return (
    <>
      <style>{`
        @keyframes wefl-word {
          from { opacity: 0; transform: translateY(9px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wefl-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wefl-hint {
          0%, 100% { opacity: 0.72; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wefl-motion { animation: none !important; }
        }
      `}</style>

      <CinematicShell style={{ background: screenBackground, zIndex: 1000 }}>
        <div
          onClick={!showContinue ? handleAdvance : undefined}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: showContinue ? 'default' : 'pointer',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {backgroundImage && (
            <div
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                opacity: 0.22,
                filter: 'grayscale(12%) brightness(0.60)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}

          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: `linear-gradient(90deg, rgba(${backgroundRgb},0.96) 0%, rgba(${backgroundRgb},0.80) 40%, rgba(${backgroundRgb},0.44) 70%, rgba(${backgroundRgb},0.18) 100%)`,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: `rgba(${backgroundRgb},0.24)`,
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          <div style={{ position: 'relative', zIndex: 5, height: '100%' }}>
            {showBack && (
              <BackButton
                onClick={(event) => {
                  event.stopPropagation()
                  onBack?.()
                }}
                style={{
                  position: 'absolute',
                  top: `calc(${SPACING.compact}px + env(safe-area-inset-top, 0px))`,
                  left: SPACING.compact,
                  zIndex: 10,
                }}
              />
            )}

            {phase === 'introduction' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${SPACING.standard}px`,
                }}
              >
                <ScreenTitle style={{ color: GENERAL.feedbackText, margin: 0 }}>
                  {tokens.map(token => token.space ? token.text : (
                    <span
                      key={token.key}
                      className="wefl-motion"
                      style={{
                        display: 'inline-block',
                        animation: `wefl-word ${MOTION.duration.standard} ${MOTION.easing.gentle} ${WORD_REVEAL_BASE_MS + token.wordIndex * WORD_REVEAL_STAGGER_MS}ms both`,
                      }}
                    >
                      {token.text}
                    </span>
                  ))}
                </ScreenTitle>
              </div>
            )}

            {isPriorities && (
              <div
                ref={scrollRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: `calc(${HEADER_CLEARANCE}px + env(safe-area-inset-top, 0px)) ${SPACING.standard}px calc(${CTA_CLEARANCE}px + env(safe-area-inset-bottom, 0px))`,
                }}
              >
                <div style={{ paddingTop: SPACING.compact }}>
                  <div
                    className="wefl-motion"
                    style={{
                      ...TYPE.displayCard,
                      color: accent,
                      marginBottom: context ? SPACING.micro : SPACING.standard,
                      animation: `wefl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                    }}
                  >
                    {resolvedTitle}
                  </div>

                  {context && (
                    <div
                      className="wefl-motion"
                      style={{
                        ...TYPE.bodySmall,
                        color: GENERAL.cinematic.textSecondary,
                        marginBottom: SPACING.standard,
                        animation: `wefl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                      }}
                    >
                      {context}
                    </div>
                  )}

                  {(visiblePriorities.length > 0 || showTakeaway) && (
                    <div
                      className="cinematic-card wefl-motion"
                      style={{
                        backgroundColor: panelBackground,
                        borderColor: `rgba(${accentRgb},0.20)`,
                        boxShadow: GENERAL.shadow.raised,
                        animation: `wefl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {visiblePriorities.map((priority, index) => {
                          const hasNextVisiblePriority = index < visiblePriorities.length - 1

                          return (
                            <div
                              key={priority.id}
                              className="wefl-motion"
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '18px minmax(0, 1fr)',
                                gap: SPACING.compact,
                                position: 'relative',
                                paddingBottom: hasNextVisiblePriority ? SPACING.standard : 0,
                                animation: `wefl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                              }}
                            >
                              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                <span
                                  aria-hidden="true"
                                  style={{
                                    width: 10,
                                    height: 10,
                                    marginTop: SPACING.micro,
                                    borderRadius: '50%',
                                    background: accent,
                                    boxShadow: `0 0 0 4px rgba(${accentRgb},0.10)`,
                                    flexShrink: 0,
                                  }}
                                />
                                {hasNextVisiblePriority && (
                                  <span
                                    aria-hidden="true"
                                    style={{
                                      position: 'absolute',
                                      top: 22,
                                      bottom: 0,
                                      width: 1,
                                      background: `rgba(${accentRgb},0.24)`,
                                    }}
                                  />
                                )}
                              </div>

                              <div>
                                <div
                                  style={{
                                    ...TYPE.titleMedium,
                                    color: accent,
                                    marginBottom: SPACING.micro,
                                  }}
                                >
                                  {priority.title}
                                </div>
                                <div style={{ ...TYPE.body, color: GENERAL.softWhite }}>
                                  {priority.explanation}
                                </div>
                              </div>
                            </div>
                          )
                        })}

                        {showTakeaway && (
                          <div
                            className="wefl-motion"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '3px minmax(0, 1fr)',
                              gap: SPACING.compact,
                              marginTop: visiblePriorities.length > 0 ? SPACING.standard : 0,
                              paddingTop: visiblePriorities.length > 0 ? SPACING.standard : 0,
                              borderTop: visiblePriorities.length > 0
                                ? `1px solid rgba(${accentRgb},0.18)`
                                : 'none',
                              animation: `wefl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                            }}
                          >
                            <span aria-hidden="true" style={{ background: accent, borderRadius: 999 }} />
                            <div style={{ ...TYPE.bodyStrong, color: GENERAL.softWhite }}>
                              {takeaway}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isPriorities && (
            <div
              aria-hidden="true"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: `calc(${HEADER_CLEARANCE + SPACING.compact}px + env(safe-area-inset-top, 0px))`,
                background: `linear-gradient(180deg, rgba(${backgroundRgb},0.99) 0%, rgba(${backgroundRgb},0.92) 60%, transparent 100%)`,
                pointerEvents: 'none',
                zIndex: 6,
              }}
            />
          )}

          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: SPACING.section + SPACING.cinematic,
              background: `linear-gradient(0deg, rgba(${backgroundRgb},0.98) 0%, rgba(${backgroundRgb},0.90) 45%, transparent 100%)`,
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />

          {((phase === 'introduction' && hintVisible) || hasMoreToReveal) && (
            <div
              className="wefl-motion"
              style={{
                position: 'fixed',
                bottom: `calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
                left: 0,
                right: 0,
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: 7,
                animation: `wefl-hint 2.8s ${MOTION.easing.gentle} 400ms infinite`,
              }}
            >
              <span style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted }}>
                {hintText}
              </span>
            </div>
          )}

          {showContinue && (
            <div
              onClick={event => event.stopPropagation()}
              style={{
                position: 'fixed',
                left: SPACING.standard,
                right: SPACING.standard,
                bottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
                zIndex: 10,
              }}
            >
              <ContinueCTA onClick={onContinue} accent={accent} />
            </div>
          )}
        </div>
      </CinematicShell>
    </>
  )
}
