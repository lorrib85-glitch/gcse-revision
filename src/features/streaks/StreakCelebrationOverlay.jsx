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
  flame: 60,
  glow: 360,
  heading: 500,
  tracker: 820,
  trackerStep: 65,
  button: 1350,
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function WeekTracker({ completedWeekDays, todayIndex, reduced }) {
  const lastCompletedIndex = completedWeekDays.reduce((last, done, i) => done ? i : last, -1)
  const completedLineWidth = lastCompletedIndex <= 0 ? 0 : (lastCompletedIndex / (WEEKDAY_LABELS.length - 1)) * 100

  const circleBase = {
    width: 34, height: 34, borderRadius: RADII.pill,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderStyle: 'solid', boxSizing: 'border-box',
  }

  return (
    <div style={{
      width: '100%',
      padding: `${SPACING.compact}px ${SPACING.compact}px ${SPACING.standard}px`,
      borderRadius: RADII.panel,
      border: '1px solid rgba(255,255,255,0.09)',
      background: 'rgba(255,255,255,0.025)',
      boxShadow: '0 18px 50px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.compact }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} style={{ ...TYPE.metadata, fontSize: 11, color: GENERAL.slate, width: 34, textAlign: 'center' }}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: 17, right: 17, top: '50%',
          height: 2, background: 'rgba(255,255,255,0.08)', transform: 'translateY(-50%)',
        }} />
        <div aria-hidden="true" className={reduced ? undefined : 'streak-cel-line'} style={{
          position: 'absolute', left: 17, top: '50%',
          width: `calc((100% - 34px) * ${completedLineWidth / 100})`,
          height: 2,
          background: `rgba(${GENERAL.tealRgb},0.78)`,
          boxShadow: `0 0 16px rgba(${GENERAL.tealRgb},0.18)`,
          transform: reduced ? 'translateY(-50%) scaleX(1)' : 'translateY(-50%) scaleX(0)',
          transformOrigin: 'left center',
          animationDelay: reduced ? undefined : `${START_MS.tracker - 130}ms`,
        }} />
        {completedWeekDays.map((done, i) => {
          const isToday = i === todayIndex
          const delay = START_MS.tracker + i * START_MS.trackerStep
          const style = done
            ? (reduced
                ? { ...circleBase, borderColor: GENERAL.teal, background: GENERAL.teal }
                : { ...circleBase, animationDelay: `${delay}ms` })
            : {
                ...circleBase,
                borderColor: isToday ? `rgba(${GENERAL.tealRgb},0.7)` : 'rgba(255,255,255,0.14)',
                background: 'rgba(13,15,16,0.72)',
                boxShadow: isToday ? `0 0 0 1px rgba(${GENERAL.tealRgb},0.12)` : undefined,
              }
          const className = done && !reduced
            ? (isToday ? 'streak-cel-dot streak-cel-dot-today' : 'streak-cel-dot streak-cel-dot-normal')
            : undefined
          return (
            <div key={i} style={{ position: 'relative', zIndex: 1, ...style }} className={className}>
              {done && (
                <svg
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke={GENERAL.neutral[0]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  className={reduced ? undefined : 'streak-cel-check'}
                  style={reduced ? undefined : { opacity: 0, animationDelay: `${delay + 80}ms` }}
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
    const totalDuration = 640
    const tickMs = 32
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
        .streak-cel-scrim { animation: streak-cel-scrim-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }
        .streak-cel-reduced-fade { animation: streak-cel-scrim-in ${MOTION.duration.fast} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-flame-in {
          0%   { opacity: 0; transform: scale(0.58) rotate(-14deg); }
          58%  { opacity: 1; transform: scale(1.08) rotate(360deg); }
          82%  { transform: scale(0.97) rotate(360deg); }
          100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }
        .streak-cel-flame { animation: streak-cel-flame-in 700ms ${MOTION.easing.standard} both; }

        @keyframes streak-cel-glow-in {
          0%   { opacity: 0; transform: scale(0.8); }
          45%  { opacity: 1; transform: scale(1.03); }
          100% { opacity: 0.9; transform: scale(1); }
        }
        .streak-cel-glow { animation: streak-cel-glow-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-heading-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-heading { animation: streak-cel-heading-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-line-in {
          from { transform: translateY(-50%) scaleX(0); opacity: 0; }
          to   { transform: translateY(-50%) scaleX(1); opacity: 1; }
        }
        .streak-cel-line { animation: streak-cel-line-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-dot-in {
          0%   { border-color: rgba(255,255,255,0.14); background-color: rgba(13,15,16,0.72); transform: scale(1); }
          55%  { transform: scale(1.18); }
          100% { border-color: ${GENERAL.teal}; background-color: ${GENERAL.teal}; transform: scale(1); }
        }
        @keyframes streak-cel-dot-today-in {
          0%   { border-color: rgba(255,255,255,0.14); background-color: rgba(13,15,16,0.72); transform: scale(1); }
          50%  { border-color: ${GENERAL.coral}; background-color: ${GENERAL.coral}; transform: scale(1.22); }
          100% { border-color: ${GENERAL.teal}; background-color: ${GENERAL.teal}; transform: scale(1); }
        }
        .streak-cel-dot { animation-duration: ${MOTION.duration.fast}; animation-timing-function: ${MOTION.easing.standard}; animation-fill-mode: both; }
        .streak-cel-dot-normal { animation-name: streak-cel-dot-in; }
        .streak-cel-dot-today { animation-name: streak-cel-dot-today-in; }

        @keyframes streak-cel-check-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .streak-cel-check { animation: streak-cel-check-in ${MOTION.duration.instant} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-button-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-button { animation: streak-cel-button-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: SPACING.standard,
        transform: 'translateY(-28px)',
      }}>

        <div style={{ position: 'relative', width: 178, height: 178, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            aria-hidden="true"
            className={reduced ? undefined : 'streak-cel-glow'}
            style={{
              position: 'absolute', inset: -52, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${GENERAL.tealRgb},0.28) 0%, rgba(${GENERAL.tealRgb},0.13) 36%, rgba(${GENERAL.coralRgb},0.08) 52%, transparent 72%)`,
              opacity: reduced ? 0.9 : undefined,
              animationDelay: reduced ? undefined : `${START_MS.glow}ms`,
            }}
          />
          <img
            src="/streak-flame-512.webp"
            alt=""
            width={154}
            height={154}
            className={reduced ? undefined : 'streak-cel-flame'}
            style={{
              position: 'relative', zIndex: 1, objectFit: 'contain',
              opacity: reduced ? 1 : undefined,
              filter: `drop-shadow(0 0 28px rgba(${GENERAL.coralRgb},0.24)) drop-shadow(0 0 52px rgba(${GENERAL.tealRgb},0.18))`,
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
          <div style={{ ...TYPE.displayHero, fontSize: 'clamp(36px, 11vw, 58px)', color: GENERAL.softWhite }}>
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
