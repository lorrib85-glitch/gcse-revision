import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SUBJECT_BACKDROPS } from '../../constants/subjectBackdrops.js'
import { MOTION } from '../../constants/motion.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import BackButton from '../core/BackButton.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell is required because this is a full-viewport cinematic opener with
// fixed atmosphere layers and a fixed governed CTA. The inner content owns its own
// safe-area-aware vertical scroll so long titles and larger text remain reachable.
import CinematicShell from './CinematicShell.jsx'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'

const motionMs = value => Number.parseInt(value, 10)
const REVEAL_START_MS = motionMs(MOTION.duration.fast)
const REVEAL_STAGGER_MS = motionMs(MOTION.duration.standard)
const CTA_SETTLE_MS = motionMs(MOTION.duration.fast)
const ICON_SETTLE_MS = motionMs(MOTION.duration.slow)

function BackBtn({ onClick }) {
  return (
    <BackButton
      onClick={onClick}
      style={{
        position: 'fixed',
        top: `calc(${SPACING.standard}px + env(safe-area-inset-top, 0px))`,
        left: SPACING.compact,
        zIndex: 10,
      }}
    />
  )
}

function ItemIcon({ icon, accent }) {
  if (icon === 'drop') return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={accent}
      style={{ flexShrink: 0, marginTop: SPACING.micro / 2 }}
    >
      <path d="M12 2C9 7 4 12 4 16a8 8 0 0016 0C20 12 15 7 12 2z"/>
    </svg>
  )
  if (icon === 'star') return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={accent}
      style={{ flexShrink: 0, marginTop: SPACING.micro / 2 }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
  if (icon === 'prayer') return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth="2.2"
      strokeLinecap="round"
      style={{ flexShrink: 0, marginTop: SPACING.micro / 2 }}
    >
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="6" y1="8" x2="18" y2="8"/>
    </svg>
  )
  if (icon === 'question') return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: SPACING.micro / 2 }}
    >
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill={accent} stroke="none"/>
    </svg>
  )
  return (
    <div style={{
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: accent,
      flexShrink: 0,
      marginTop: SPACING.micro,
    }} />
  )
}

export default function ChapterOutcomeScreen({
  subject      = 'History',
  chapterNum   = 1,
  chapterTitle = '',
  introText,         // kept for compat — not rendered
  outcomes     = [],
  onBack,
  onContinue,
}) {
  const img = SUBJECT_BACKDROPS[subject] || SUBJECT_BACKDROPS.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  const [visibleCount, setVisibleCount] = useState(() => reduceMotion ? outcomes.length : 0)
  const [showCTA, setShowCTA] = useState(reduceMotion)
  const [glowIdx, setGlowIdx] = useState(-1)

  // Keep the opener brisk: all three recommended outcomes and the CTA arrive in
  // about 1.2 seconds. Reduced-motion users receive the complete screen at once.
  useEffect(() => {
    setGlowIdx(-1)

    if (reduceMotion) {
      setVisibleCount(outcomes.length)
      setShowCTA(true)
      return undefined
    }

    setVisibleCount(0)
    setShowCTA(false)

    const timers = outcomes.map((_, i) =>
      setTimeout(
        () => setVisibleCount(v => Math.max(v, i + 1)),
        REVEAL_START_MS + i * REVEAL_STAGGER_MS,
      )
    )
    const ctaTimer = setTimeout(
      () => setShowCTA(true),
      REVEAL_START_MS + outcomes.length * REVEAL_STAGGER_MS + CTA_SETTLE_MS,
    )

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(ctaTimer)
    }
  }, [outcomes.length, reduceMotion])

  // Pulse only the newly arrived marker, then settle. This attention cue is
  // suppressed entirely when reduced motion is requested.
  useEffect(() => {
    if (reduceMotion || visibleCount === 0) return undefined
    const idx = visibleCount - 1
    setGlowIdx(idx)
    const timer = setTimeout(() => setGlowIdx(-1), ICON_SETTLE_MS)
    return () => clearTimeout(timer)
  }, [visibleCount, reduceMotion])

  return (
    <>
      <style>{`
        @keyframes cos-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-row {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cos-scroll {
          scrollbar-width: none;
        }
        .cos-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .cos-enter,
          .cos-row {
            animation: none !important;
          }
        }
      `}</style>

      <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 1000 }}>

        {/* Background image */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          opacity: 0.27,
          filter: 'grayscale(10%) brightness(0.65)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Left-side dark gradient */}
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: SPACING.cinematic * 3,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        <BackBtn onClick={onBack} />

        {/* Flexible content column. The permanent bottom padding reserves the
            fixed CTA area before it appears, so the layout never jumps or overlaps. */}
        <div
          className="cos-scroll"
          style={{
            position: 'relative',
            zIndex: 5,
            height: '100dvh',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            paddingTop: `calc(${SPACING.section}px + env(safe-area-inset-top, 0px))`,
            paddingRight: SPACING.standard,
            paddingBottom: `calc(${SPACING.cinematic + SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
            paddingLeft: SPACING.standard,
          }}
        >
          <div style={{ width: '100%', maxWidth: 320 }}>

            {/* Chapter title */}
            <div
              className="cos-enter"
              style={{
                ...TYPE.displayHero,
                ...HEADING_LAYOUT.screenTitle,
                color: '#FFFFFF',
                marginBottom: SPACING.standard,
                animation: reduceMotion
                  ? 'none'
                  : `cos-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
              }}
            >
              {chapterTitle}
            </div>

            {/* Discovery label */}
            <div
              className="cos-enter"
              style={{
                ...TYPE.label,
                color: GENERAL.slate,
                marginBottom: SPACING.standard,
                animation: reduceMotion
                  ? 'none'
                  : `cos-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${MOTION.duration.instant} both`,
              }}
            >
              In this chapter, you’ll learn to
            </div>

            {/* Discovery items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.compact,
            }}>
              {outcomes.map((item, i) => {
                const text = typeof item === 'string' ? item : item.text
                const icon = typeof item === 'string' ? null : item.icon
                return i < visibleCount ? (
                  <div
                    className="cos-row"
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: SPACING.compact,
                      animation: reduceMotion
                        ? 'none'
                        : `cos-row ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
                    }}
                  >
                    <div style={{
                      flexShrink: 0,
                      filter: glowIdx === i
                        ? `drop-shadow(0 0 5px rgba(${rgb},0.95)) drop-shadow(0 0 14px rgba(${rgb},0.50))`
                        : 'none',
                      transform: glowIdx === i ? 'scale(1.20)' : 'scale(1)',
                      transition: reduceMotion
                        ? 'none'
                        : `filter ${MOTION.duration.slow} ${MOTION.easing.gentle}, transform ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
                    }}>
                      <ItemIcon icon={icon} accent={accent} />
                    </div>
                    <div style={{
                      ...TYPE.bodyStrong,
                      color: 'rgba(255,255,255,0.86)',
                    }}>
                      {text}
                    </div>
                  </div>
                ) : null
              })}
            </div>

          </div>
        </div>

        {showCTA && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            label="Start chapter"
            animation={reduceMotion ? 'none' : undefined}
          />
        )}

      </CinematicShell>
    </>
  )
}
