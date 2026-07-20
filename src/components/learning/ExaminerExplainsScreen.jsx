import { useState, useEffect, useRef } from 'react'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'
import BackButton from '../core/BackButton.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell used here because multiple inner layers use position:fixed (background image,
// gradients, overlays) that must reach all four viewport edges; ContentShell's 16px padding
// and safe-area inner div would confine them to the content column.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { ScreenTitle } from '../core/ScreenText.jsx'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { SUBJECT_BACKDROPS } from '../../constants/subjectBackdrops.js'

// Word-by-word reveal cadence for the opening line. No MOTION token covers a
// per-word stagger; these are the single source of truth for both the CSS
// animation delays and the tap-hint timing derived from them.
const WORD_REVEAL_BASE_MS = 260
const WORD_REVEAL_STAGGER_MS = 65
const HINT_SETTLE_MS = 420

// Tips content must clear the fixed LearningHeader capsule above it
// (same clearance convention as TimelineChain).
const HEADER_CLEARANCE = SPACING.cinematic + SPACING.micro
// And clear the fixed CinematicContinueCTA / tap hint below it.
const CTA_CLEARANCE = SPACING.cinematic + SPACING.separation

function tokenize(text) {
  const parts = text.split(/(\s+)/)
  let wi = 0
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
    return { key: i, space: false, text: part, wordIdx: wi++ }
  })
}

export default function ExaminerExplainsScreen({
  subject          = 'History',
  examinerExplains = {},
  label            = 'How examiners think',
  showBack         = true,
  onBack,
  onContinue,
}) {
  const img   = SUBJECT_BACKDROPS[subject] || SUBJECT_BACKDROPS.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const screenBackground = theme.background || GENERAL.backgroundApp
  const panelBackground = theme.backgroundSecondary || GENERAL.backgroundSurface
  const bgRgb = hexToRgb(screenBackground)

  const opening = examinerExplains.opening || "Before you face the examiner, here's what they actually look for."
  const tips    = examinerExplains.tips    || []
  const closing = examinerExplains.closing || "You've got this."

  const [phase,          setPhase]          = useState('opening')
  const [revealedCount,  setRevealedCount]  = useState(0)
  const [showClosing,    setShowClosing]    = useState(false)
  const [showContinue,   setShowContinue]   = useState(false)
  const [hintVisible,    setHintVisible]    = useState(false)

  const scrollRef = useRef(null)

  const tokens    = tokenize(opening)
  const wordCount = tokens.filter(t => !t.space).length
  const hintDelay = WORD_REVEAL_BASE_MS + (wordCount - 1) * WORD_REVEAL_STAGGER_MS + HINT_SETTLE_MS

  useEffect(() => {
    if (phase !== 'opening') return
    const t = setTimeout(() => setHintVisible(true), hintDelay)
    return () => clearTimeout(t)
  }, [phase, hintDelay])

  useEffect(() => {
    if (!showClosing) return
    const t = setTimeout(() => setShowContinue(true), parseInt(MOTION.duration.cinematic))
    return () => clearTimeout(t)
  }, [showClosing])

  // Keep the newest step / closing line in view as it reveals.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || (revealedCount === 0 && !showClosing)) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [revealedCount, showClosing])

  function handleTap() {
    if (phase === 'opening') {
      setPhase('tips')
      return
    }
    if (revealedCount < tips.length) {
      setRevealedCount(c => c + 1)
      return
    }
    if (!showClosing) {
      setShowClosing(true)
    }
  }

  const isTips = phase === 'tips'
  const visibleTips = tips.slice(0, revealedCount)

  return (
    <>
      <style>{`
        @keyframes expl-word {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expl-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expl-hint {
          0%, 100% { opacity: 0; transform: translateY(0); }
          35%, 65%  { opacity: 0.5; transform: translateY(-3px); }
        }
      `}</style>

      <CinematicShell style={{ background: screenBackground, zIndex: 1000 }}>
      <div
        onClick={!showContinue ? handleTap : undefined}
        style={{
          position: 'absolute', inset: 0,
          cursor: showContinue ? 'default' : 'pointer',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.22,
          filter: 'grayscale(12%) brightness(0.60)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Left gradient */}
        <div style={{
          position: 'fixed', inset: 0,
          background: `linear-gradient(90deg, rgba(${bgRgb},0.96) 0%, rgba(${bgRgb},0.80) 40%, rgba(${bgRgb},0.44) 70%, rgba(${bgRgb},0.18) 100%)`,
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Overall dark overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: `rgba(${bgRgb},0.24)`,
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 5, height: '100%' }}>
          {showBack && (
            <BackButton
              onClick={(e) => { e.stopPropagation(); onBack() }}
              style={{
                position: 'absolute',
                top: `calc(${SPACING.compact}px + env(safe-area-inset-top, 0px))`,
                left: SPACING.compact,
                zIndex: 10,
              }}
            />
          )}

          {/* ── OPENING ─────────────────────────────────── */}
          {phase === 'opening' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              padding: `0 ${SPACING.standard}px`,
            }}>
              <ScreenTitle style={{ color: GENERAL.feedbackText, margin: 0 }}>
                {tokens.map(tok =>
                  tok.space ? tok.text : (
                    <span
                      key={tok.key}
                      style={{
                        display: 'inline-block',
                        animation: `expl-word ${MOTION.duration.standard} ${MOTION.easing.gentle} ${WORD_REVEAL_BASE_MS + tok.wordIdx * WORD_REVEAL_STAGGER_MS}ms both`,
                      }}
                    >
                      {tok.text}
                    </span>
                  )
                )}
              </ScreenTitle>
            </div>
          )}

          {/* ── TIPS ────────────────────────────────────── */}
          {isTips && (
            <div
              ref={scrollRef}
              style={{
                position: 'absolute', inset: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: `calc(${HEADER_CLEARANCE}px + env(safe-area-inset-top, 0px)) ${SPACING.standard}px calc(${CTA_CLEARANCE}px + env(safe-area-inset-bottom, 0px))`,
              }}
            >
              <div style={{ paddingTop: SPACING.compact }}>
                <div
                  style={{
                    ...TYPE.displayCard,
                    color: accent,
                    marginBottom: SPACING.standard,
                    animation: `expl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                  }}
                >
                  {label}
                </div>

                {(visibleTips.length > 0 || showClosing) && (
                  <div
                    className="cinematic-card"
                    style={{
                      backgroundColor: panelBackground,
                      borderColor: `rgba(${rgb},0.20)`,
                      boxShadow: '0 10px 32px rgba(0,0,0,0.34)',
                      animation: `expl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {visibleTips.map((tip, i) => {
                        const hasNextVisibleStep = i < visibleTips.length - 1
                        return (
                          <div
                            key={i}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '18px minmax(0, 1fr)',
                              gap: SPACING.compact,
                              position: 'relative',
                              paddingBottom: hasNextVisibleStep ? SPACING.standard : 0,
                              animation: `expl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
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
                                  boxShadow: `0 0 0 4px rgba(${rgb},0.10)`,
                                  flexShrink: 0,
                                }}
                              />
                              {hasNextVisibleStep && (
                                <span
                                  aria-hidden="true"
                                  style={{
                                    position: 'absolute',
                                    top: 22,
                                    bottom: 0,
                                    width: 1,
                                    background: `rgba(${rgb},0.24)`,
                                  }}
                                />
                              )}
                            </div>

                            <div>
                              <div style={{
                                ...TYPE.titleMedium,
                                color: accent,
                                marginBottom: SPACING.micro,
                              }}>
                                {tip.heading}
                              </div>
                              <div style={{
                                ...TYPE.body,
                                color: GENERAL.softWhite,
                              }}>
                                {tip.body}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {/* Closing takeaway */}
                      {showClosing && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '3px minmax(0, 1fr)',
                          gap: SPACING.compact,
                          marginTop: visibleTips.length > 0 ? SPACING.standard : 0,
                          paddingTop: visibleTips.length > 0 ? SPACING.standard : 0,
                          borderTop: visibleTips.length > 0 ? `1px solid rgba(${rgb},0.18)` : 'none',
                          animation: `expl-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                        }}>
                          <span aria-hidden="true" style={{ background: accent, borderRadius: 999 }} />
                          <div style={{
                            ...TYPE.bodyStrong,
                            color: GENERAL.softWhite,
                          }}>
                            {closing}
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

        {/* Top fade — above content so scrolled copy fades out behind the capsule header */}
        {isTips && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            height: `calc(${HEADER_CLEARANCE + SPACING.compact}px + env(safe-area-inset-top, 0px))`,
            background: `linear-gradient(180deg, rgba(${bgRgb},0.99) 0%, rgba(${bgRgb},0.92) 60%, transparent 100%)`,
            pointerEvents: 'none', zIndex: 6,
          }} />
        )}

        {/* Bottom fade — above content so copy fades out beneath the CTA */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: SPACING.section + SPACING.cinematic,
          background: `linear-gradient(0deg, rgba(${bgRgb},0.98) 0%, rgba(${bgRgb},0.90) 45%, transparent 100%)`,
          pointerEvents: 'none', zIndex: 6,
        }} />

        {/* Tap hint — opening phase, or while tips remain */}
        {((phase === 'opening' && hintVisible) || (isTips && revealedCount < tips.length)) && (
          <div style={{
            position: 'fixed',
            bottom: `calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
            left: 0, right: 0, textAlign: 'center',
            pointerEvents: 'none', zIndex: 7,
            animation: 'expl-hint 3.2s ease 600ms infinite',
          }}>
            <span style={{
              ...TYPE.label,
              color: 'rgba(255,255,255,0.28)',
            }}>
              Tap to continue
            </span>
          </div>
        )}

        {/* Continue CTA */}
        {showContinue && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            animation={`expl-cont ${MOTION.duration.cinematic} ${MOTION.easing.standard} ${MOTION.duration.instant} both`}
            style={{ zIndex: 10 }}
          />
        )}
      </div>
      </CinematicShell>
    </>
  )
}
