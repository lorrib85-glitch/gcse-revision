import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  SUBJECT_BACKDROPS,
  SUBJECT_BACKDROP_POSITIONS,
} from '../../constants/subjectBackdrops.js'
import { MOTION } from '../../constants/motion.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import BackButton from '../core/BackButton.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell is required because this is a full-viewport cinematic opener with
// fixed atmosphere layers. The inner content owns its own safe-area-aware vertical
// scroll so long titles, outcomes and the in-flow CTA remain reachable.
import CinematicShell from './CinematicShell.jsx'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'

const motionMs = value => Number.parseInt(value, 10)
const REVEAL_START_MS = motionMs(MOTION.duration.slow) + motionMs(MOTION.duration.instant)
const REVEAL_STAGGER_MS = motionMs(MOTION.duration.standard) * 2
const CTA_SETTLE_MS = motionMs(MOTION.duration.standard)

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
  const shared = {
    flexShrink: 0,
    marginTop: SPACING.micro / 2,
  }

  if (icon === 'drop') return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill={accent} style={shared}>
      <path d="M12 2C9 7 4 12 4 16a8 8 0 0016 0C20 12 15 7 12 2z"/>
    </svg>
  )

  if (icon === 'star') return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill={accent} style={shared}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )

  if (icon === 'prayer') return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth="2.2"
      strokeLinecap="round"
      style={shared}
    >
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="6" y1="8" x2="18" y2="8"/>
    </svg>
  )

  if (icon === 'question') return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={shared}
    >
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill={accent} stroke="none"/>
    </svg>
  )

  return (
    <span
      aria-hidden="true"
      style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: accent,
        flexShrink: 0,
        marginTop: SPACING.micro,
      }}
    />
  )
}

export default function ChapterOutcomeScreen({
  subject = 'History',
  chapterTitle = '',
  outcomes = [],
  onBack,
  onContinue,
}) {
  const img = SUBJECT_BACKDROPS[subject] || SUBJECT_BACKDROPS.History
  const backgroundPosition = SUBJECT_BACKDROP_POSITIONS[subject]
    || SUBJECT_BACKDROP_POSITIONS.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent } = theme
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  const [visibleCount, setVisibleCount] = useState(() => reduceMotion ? outcomes.length : 0)
  const [showCTA, setShowCTA] = useState(reduceMotion)

  // Let each outcome land as a readable sentence rather than a rapid checklist.
  // Three standard outcomes and the CTA complete in roughly two seconds.
  useEffect(() => {
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
    const finalRevealAt = REVEAL_START_MS
      + Math.max(0, outcomes.length - 1) * REVEAL_STAGGER_MS
    const ctaTimer = setTimeout(
      () => setShowCTA(true),
      finalRevealAt + CTA_SETTLE_MS,
    )

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(ctaTimer)
    }
  }, [outcomes, reduceMotion])

  return (
    <>
      <style>{`
        @keyframes cos-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-row {
          from { opacity: 0; transform: translateY(${SPACING.micro}px); }
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
        <div
          data-chapter-outcome-backdrop
          data-background-position={backgroundPosition}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition,
            opacity: 0.5,
            filter: 'saturate(0.96) brightness(0.84)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* A local scrim protects the text while allowing the subject image to
            become visible quickly beyond the reading column. */}
        <div
          data-chapter-outcome-scrim
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            width: 'min(90vw, 420px)',
            background: 'linear-gradient(90deg, rgba(8,9,13,0.97) 0%, rgba(8,9,13,0.90) 52%, rgba(8,9,13,0.46) 76%, rgba(8,9,13,0) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

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

        <div
          className="cos-scroll"
          data-chapter-outcome-scroll
          data-reduced-motion={reduceMotion ? 'true' : 'false'}
          style={{
            position: 'relative',
            zIndex: 5,
            height: '100dvh',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            paddingTop: `calc(${SPACING.section + SPACING.standard}px + env(safe-area-inset-top, 0px))`,
            paddingRight: SPACING.standard,
            paddingBottom: `calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
            paddingLeft: SPACING.standard,
          }}
        >
          <div data-chapter-outcome-content style={{ width: '100%', maxWidth: 320 }}>
            <h1
              className="cos-enter"
              style={{
                ...TYPE.displayHero,
                ...HEADING_LAYOUT.screenTitle,
                color: '#FFFFFF',
                marginTop: 0,
                marginBottom: SPACING.standard,
                animation: reduceMotion
                  ? 'none'
                  : `cos-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
              }}
            >
              {chapterTitle}
            </h1>

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

            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.compact,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}>
              {outcomes.map((item, i) => {
                const text = typeof item === 'string' ? item : item.text
                const icon = typeof item === 'string' ? null : item.icon
                return i < visibleCount ? (
                  <li
                    className="cos-row"
                    data-chapter-outcome-row
                    key={`${text}-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: SPACING.compact,
                      animation: reduceMotion
                        ? 'none'
                        : `cos-row ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                    }}
                  >
                    <span
                      data-chapter-outcome-marker
                      style={{
                        display: 'inline-flex',
                        flexShrink: 0,
                      }}
                    >
                      <ItemIcon icon={icon} accent={accent} />
                    </span>
                    <span style={{
                      ...TYPE.bodyStrong,
                      color: 'rgba(255,255,255,0.86)',
                    }}>
                      {text}
                    </span>
                  </li>
                ) : null
              })}
            </ul>

            <div
              data-chapter-outcome-cta-slot
              style={{ marginTop: SPACING.standard }}
            >
              <CinematicContinueCTA
                layout="inline"
                align="start"
                onClick={onContinue}
                accent={accent}
                label="Start chapter"
                animation={showCTA && !reduceMotion ? undefined : 'none'}
                style={{
                  visibility: showCTA ? 'visible' : 'hidden',
                  pointerEvents: showCTA ? 'auto' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </CinematicShell>
    </>
  )
}
