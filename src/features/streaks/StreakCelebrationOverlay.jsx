import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { hexToRgb } from '../../constants/subjects.js'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import { WEEKDAY_LABELS } from './streakCelebrationStorage.js'

// Orchestration offsets (ms) for the one-shot reveal sequence. Not a
// reusable motion token — this is choreography specific to this single
// screen. Actual per-element durations/easings come from MOTION.
const START_MS = {
  flame: 60,
  glow: 440,
  heading: 500,
  tracker: 760,
  trackerStep: 55,
  button: 1250,
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function WeekTracker({ completedWeekDays, todayIndex, reduced }) {
  const circleBase = {
    width: 30, height: 30, borderRadius: RADII.pill,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderStyle: 'solid', boxSizing: 'border-box',
  }

  return (
    <div style={{
      width: '100%',
      padding: SPACING.compact,
      borderRadius: RADII.panel,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.micro }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} style={{ ...TYPE.metadata, fontSize: 11, color: GENERAL.slate, width: 30, textAlign: 'center' }}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: 15, right: 15, top: '50%',
          height: 1, background: 'rgba(255,255,255,0.08)', transform: 'translateY(-50%)',
        }} />
        {completedWeekDays.map((done, i) => {
          const isToday = i === todayIndex
          const delay = START_MS.tracker + i * START_MS.trackerStep
          const style = done
            ? (reduced
                ? { ...circleBase, borderColor: GENERAL.teal, background: GENERAL.teal }
                : { ...circleBase, animationDelay: `${delay}ms` })
            : { ...circleBase, borderColor: 'rgba(255,255,255,0.14)', background: 'transparent' }
          const className = done && !reduced
            ? (isToday ? 'streak-cel-dot streak-cel-dot-today' : 'streak-cel-dot streak-cel-dot-normal')
            : undefined
          return (
            <div key={i} style={{ position: 'relative', zIndex: 1, ...style }} className={className}>
              {done && (
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
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
  if (!streakCount || streakCount <= 0) return null

  const reduced = prefersReducedMotion()
  const scrimBg = `rgba(${hexToRgb(GENERAL.neutral[0])},0.97)`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${streakCount} day streak`}
      style={{
        position: 'fixed', inset: 0, zIndex: 4000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: scrimBg,
        padding: SPACING.standard,
      }}
      className={reduced ? 'streak-cel-reduced-fade' : 'streak-cel-scrim'}
    >
      <style>{`
        @keyframes streak-cel-scrim-in { from { opacity: 0 } to { opacity: 1 } }
        .streak-cel-scrim { animation: streak-cel-scrim-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }
        .streak-cel-reduced-fade { animation: streak-cel-scrim-in ${MOTION.duration.fast} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-flame-in {
          0%   { opacity: 0; transform: scale(0.6) rotate(0deg); }
          60%  { opacity: 1; transform: scale(1.08) rotate(360deg); }
          80%  { transform: scale(0.96) rotate(360deg); }
          100% { opacity: 1; transform: scale(1) rotate(360deg); }
        }
        .streak-cel-flame { animation: streak-cel-flame-in ${MOTION.duration.slow} ${MOTION.easing.standard} both; }

        @keyframes streak-cel-glow-in {
          0%   { opacity: 0; }
          45%  { opacity: 1; }
          70%  { opacity: 0.55; }
          100% { opacity: 0.85; }
        }
        .streak-cel-glow { animation: streak-cel-glow-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-heading-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-heading { animation: streak-cel-heading-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-dot-in {
          0%   { border-color: rgba(255,255,255,0.14); background-color: transparent; transform: scale(1); }
          55%  { transform: scale(1.18); }
          100% { border-color: ${GENERAL.teal}; background-color: ${GENERAL.teal}; transform: scale(1); }
        }
        @keyframes streak-cel-dot-today-in {
          0%   { border-color: rgba(255,255,255,0.14); background-color: transparent; transform: scale(1); }
          50%  { border-color: ${GENERAL.coral}; background-color: ${GENERAL.coral}; transform: scale(1.22); }
          100% { border-color: ${GENERAL.teal}; background-color: ${GENERAL.teal}; transform: scale(1); }
        }
        .streak-cel-dot { animation-duration: ${MOTION.duration.fast}; animation-timing-function: ${MOTION.easing.standard}; animation-fill-mode: both; }
        .streak-cel-dot-normal { animation-name: streak-cel-dot-in; }
        .streak-cel-dot-today { animation-name: streak-cel-dot-today-in; }

        @keyframes streak-cel-check-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .streak-cel-check { animation: streak-cel-check-in ${MOTION.duration.instant} ${MOTION.easing.gentle} both; }

        @keyframes streak-cel-button-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-cel-button { animation: streak-cel-button-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.standard }}>

        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            aria-hidden="true"
            className={reduced ? undefined : 'streak-cel-glow'}
            style={{
              position: 'absolute', inset: -40, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${GENERAL.coralRgb},0.35) 0%, rgba(${GENERAL.coralRgb},0.08) 45%, transparent 70%)`,
              opacity: reduced ? 0.85 : undefined,
              animationDelay: reduced ? undefined : `${START_MS.glow}ms`,
            }}
          />
          <img
            src="/streak-flame-512.webp"
            alt=""
            width={116}
            height={116}
            className={reduced ? undefined : 'streak-cel-flame'}
            style={{
              position: 'relative', zIndex: 1, objectFit: 'contain',
              opacity: reduced ? 1 : undefined,
              animationDelay: reduced ? undefined : `${START_MS.flame}ms`,
            }}
          />
        </div>

        <div
          className={reduced ? undefined : 'streak-cel-heading'}
          style={{
            textAlign: 'center',
            opacity: reduced ? 1 : undefined,
            animationDelay: reduced ? undefined : `${START_MS.heading}ms`,
          }}
        >
          <div style={{ ...TYPE.displayHero, fontSize: 'clamp(28px, 8vw, 40px)', color: GENERAL.softWhite }}>
            {streakCount} day <span style={{ color: GENERAL.teal }}>streak</span>
          </div>
          <div style={{ ...TYPE.bodyLarge, color: GENERAL.slate, marginTop: SPACING.micro }}>
            Keep showing up.
          </div>
        </div>

        <WeekTracker completedWeekDays={completedWeekDays} todayIndex={todayIndex} reduced={reduced} />

        <div
          className={reduced ? undefined : 'streak-cel-button'}
          style={{
            width: '100%',
            opacity: reduced ? 1 : undefined,
            animationDelay: reduced ? undefined : `${START_MS.button}ms`,
          }}
        >
          <ContinueCTA accent={GENERAL.teal} label="Continue" onClick={onDismiss} />
        </div>

      </div>
    </div>
  )
}
