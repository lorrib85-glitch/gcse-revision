import { useEffect, useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import { WEEKDAY_LABELS } from './streakCelebrationStorage.js'

// Orchestration offsets (ms) for the one-shot reveal sequence. Not a
// reusable motion token — this is choreography specific to this single
// screen. Actual per-element durations/easings come from MOTION.
const START_MS = {
  flame: 80,
  glow: 420,
  heading: 760,
  tracker: 1250,
  trackerStep: 105,
  button: 2200,
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function WeekTracker({ completedWeekDays, reduced }) {
  const circleBase = {
    width: 32, height: 32, borderRadius: RADII.pill,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderStyle: 'solid', boxSizing: 'border-box',
  }

  const inactiveCircle = {
    ...circleBase,
    borderColor: 'rgba(255,255,255,0.14)',
    background: 'rgba(13,15,16,0.72)',
  }

  return (
    <div style={{
      width: '100%',
      padding: `${SPACING.compact - 2}px ${SPACING.compact}px ${SPACING.compact + 2}px`,
      borderRadius: RADII.panel,
      border: '1px solid rgba(255,255,255,0.09)',
      background: 'rgba(255,255,255,0.025)',
      boxShadow: '0 18px 50px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.compact - 4 }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} style={{ ...TYPE.metadata, fontSize: 11, color: GENERAL.slate, width: 32, textAlign: 'center' }}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: 16, right: 16, top: '50%',
          height: 2, background: 'rgba(255,255,255,0.045)', transform: 'translateY(-50%)',
        }} />
        {completedWeekDays.map((done, i) => {
          const delay = START_MS.tracker + i * START_MS.trackerStep
          const style = done
            ? (reduced
                ? { ...circleBase, borderColor: GENERAL.teal, background: GENERAL.teal }
                : { ...circleBase, animationDelay: `${delay}ms` })
            : inactiveCircle
          const className = done && !reduced ? 'streak-cel-dot' : undefined
          return (
            <div key={i} style={{ position: 'relative', zIndex: 1, ...style }} className={className}>
              {done && (
                <svg
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke={GENERAL.neutral[0]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  className={reduced ? undefined : 'streak-cel-check'}
                  style={reduced ? undefined : { opacity: 0, animationDelay: `${delay + 140}ms` }}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── StreakCelebrationOverlay ────────────────────────────────────────────────
// Full-screen, app-wide (non-subject) celebration shown once per day while
// the learner has an active streak. Presentation only — see
// streakCelebrationStorage.js for the show/hide and weekly-completion logic,
// which the caller (Home) is responsible for evaluating and passing down.
export default function StreakCelebrationOverlay({ streakCount, completedWeekDays, todayIndex, onDismiss }) {
  const active = Number(streakCount) > 0
  const safeStreakCount = active ? Number(streakCount) : 0
  const safeCompletedWeekDays = Array.isArray(completedWeekDays)
    ? completedWeekDays
    : WEEKDAY_LABELS.map(() => false)
  const reduced = prefersReducedMotion()
  const [displayCount, setDisplayCount] = useState(reduced ? safeStreakCount : 1)

  useEffect(() => {
    if (!active) return undefined

    if (reduced) {
      setDisplayCount(safeStreakCount)
      return undefined
    }

    const startCount = 1
    const totalDuration = 1150
    const tickMs = 48
    let elapsed = 0
    let intervalId

    const startId = window.setTimeout(() => {
      setDisplayCount(startCount)
      intervalId = window.setInterval(() => {
        elapsed += tickMs
        const progress = Math.min(1, elapsed / totalDuration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayCount(Math.round(startCount + (safeStreakCount - startCount) * eased))
        if (progress >= 1) window.clearInterval(intervalId)
      }, tickMs)
    }, START_MS.heading)

    return () => {
      window.clearTimeout(startId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [active, reduced, safeStreakCount])

  if (!active) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${safeStreakCount} day streak`}
      style={{
        position: 'fixed', inset: 0, zIndex: 4000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(3,10,11,0.97)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: SPACING.standard,
        paddingBottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom))`,
        overflow: 'hidden',
      }}
      className={reduced ? 'streak-cel-reduced-fade' : 'streak-cel-scrim'}
    >
      <style>{`
        @keyframes streak-cel-scrim-in { from { opacity: 0 } to { opacity: 1 } }
        .streak-cel-scrim { animation: streak-cel-scrim-in 520ms ${MOTION.easing.gentle} both; }
        .streak-cel-reduced-fade { animation: streak-cel-scrim-in ${MOTION.duration.fast} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-flame-in {
          0%   { opacity: 0; transform: scale(0.58) rotate(-14deg); }
          56%  { opacity: 1; transform: scale(1.07) rotate(360deg); }
          82%  { transform: scale(0.98) rotate(360deg); }
          100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }
        .streak-cel-flame { animation: streak-cel-flame-in 980ms ${MOTION.easing.standard} both; }

        @keyframes streak-cel-glow-in {
          0%   { opacity: 0; transform: scale(0.8); }
          45%  { opacity: 0.88; transform: scale(1.02); }
          100% { opacity: 0.72; transform: scale(1); }
        }
        .streak-cel-glow { animation: streak-cel-glow-in 900ms ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-flow-in {
          0%   { opacity: 0; transform: scale(0.72) rotate(-16deg); }
          42%  { opacity: 0.75; }
          100% { opacity: 0.55; transform: scale(1) rotate(0deg); }
        }
        @keyframes streak-cel-flow-drift {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .streak-cel-flow {
          animation:
            streak-cel-flow-in 1200ms ${MOTION.easing.gentle} both,
            streak-cel-flow-drift 11000ms linear 1200ms infinite;
        }
        .streak-cel-flow-alt {
          animation:
            streak-cel-flow-in 1400ms ${MOTION.easing.gentle} both,
            streak-cel-flow-drift 14500ms linear 1400ms infinite reverse;
        }

        @keyframes streak-cel-heading-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-heading { animation: streak-cel-heading-in 620ms ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-dot-in {
          0%   { border-color: rgba(255,255,255,0.14); background-color: rgba(13,15,16,0.72); transform: scale(1); }
          55%  { transform: scale(1.14); }
          100% { border-color: ${GENERAL.teal}; background-color: ${GENERAL.teal}; transform: scale(1); }
        }
        .streak-cel-dot {
          animation-name: streak-cel-dot-in;
          animation-duration: 420ms;
          animation-timing-function: ${MOTION.easing.standard};
          animation-fill-mode: both;
        }

        @keyframes streak-cel-check-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .streak-cel-check { animation: streak-cel-check-in 240ms ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-button-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-button { animation: streak-cel-button-in 560ms ${MOTION.easing.gentle} both; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 352,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: SPACING.standard,
        transform: 'translateY(-28px)',
      }}>

        <div style={{ position: 'relative', width: 174, height: 174, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            aria-hidden="true"
            className={reduced ? undefined : 'streak-cel-flow'}
            style={{
              position: 'absolute', inset: -18, borderRadius: '50%',
              background: `conic-gradient(from 35deg, transparent 0deg, rgba(${GENERAL.tealRgb},0.26) 42deg, transparent 92deg, rgba(${GENERAL.coralRgb},0.16) 145deg, transparent 214deg, rgba(${GENERAL.tealRgb},0.18) 276deg, transparent 360deg)`,
              filter: 'blur(16px)',
              opacity: reduced ? 0.42 : undefined,
            }}
          />
          <div
            aria-hidden="true"
            className={reduced ? undefined : 'streak-cel-flow-alt'}
            style={{
              position: 'absolute', inset: 6, borderRadius: '50%',
              background: `conic-gradient(from 205deg, transparent 0deg, rgba(${GENERAL.coralRgb},0.16) 58deg, transparent 122deg, rgba(${GENERAL.tealRgb},0.2) 218deg, transparent 300deg)`,
              filter: 'blur(12px)',
              opacity: reduced ? 0.3 : undefined,
            }}
          />
          <div
            aria-hidden="true"
            className={reduced ? undefined : 'streak-cel-glow'}
            style={{
              position: 'absolute', inset: -38, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${GENERAL.tealRgb},0.20) 0%, rgba(${GENERAL.tealRgb},0.09) 34%, rgba(${GENERAL.coralRgb},0.06) 50%, transparent 68%)`,
              opacity: reduced ? 0.66 : undefined,
              animationDelay: reduced ? undefined : `${START_MS.glow}ms`,
            }}
          />
          <img
            src="/streak-flame-512.webp"
            alt=""
            width={148}
            height={148}
            className={reduced ? undefined : 'streak-cel-flame'}
            style={{
              position: 'relative', zIndex: 1, objectFit: 'contain',
              opacity: reduced ? 1 : undefined,
              filter: `drop-shadow(0 0 24px rgba(${GENERAL.coralRgb},0.22)) drop-shadow(0 0 42px rgba(${GENERAL.tealRgb},0.14))`,
              animationDelay: reduced ? undefined : `${START_MS.flame}ms`,
            }}
          />
        </div>

        <div
          className={reduced ? undefined : 'streak-cel-heading'}
          style={{
            textAlign: 'center',
            marginTop: -SPACING.micro,
            marginBottom: SPACING.compact,
            opacity: reduced ? 1 : undefined,
            animationDelay: reduced ? undefined : `${START_MS.heading}ms`,
          }}
        >
          <div style={{ ...TYPE.displayHero, fontSize: 'clamp(34px, 10vw, 50px)', color: GENERAL.softWhite }}>
            {displayCount} day <span style={{ color: GENERAL.teal }}>streak</span>
          </div>
          <div style={{ ...TYPE.bodyLarge, color: GENERAL.slate, marginTop: SPACING.compact }}>
            That’s momentum.
          </div>
        </div>

        <WeekTracker completedWeekDays={safeCompletedWeekDays} todayIndex={todayIndex} reduced={reduced} />

        <div
          className={reduced ? undefined : 'streak-cel-button'}
          style={{
            width: '100%',
            marginTop: SPACING.compact,
            opacity: reduced ? 1 : undefined,
            animationDelay: reduced ? undefined : `${START_MS.button}ms`,
          }}
        >
          <ContinueCTA
            accent={GENERAL.teal}
            label="Continue"
            onClick={onDismiss}
            style={{
              boxShadow: `0 18px 42px rgba(${GENERAL.tealRgb},0.24), inset 0 1px 0 rgba(241,250,238,0.16)`,
            }}
          />
        </div>

      </div>
    </div>
  )
}
