import { useEffect, useState } from 'react'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { getProgressStatusText } from '../../auth/progressStatus.js'
import { buildTodaysPlan, getNextPlannerItem, getTaskSubject } from '../../todaysPlan.js'
import { StreakChip } from './StreakChip.jsx'
import { hexToRgb } from '../../constants/subjects.js'
import { getProgress } from '../../progress.js'
import StreakCelebrationOverlay from '../streaks/StreakCelebrationOverlay.jsx'
import ExitButton from '../../components/core/ExitButton.jsx'
import {
  shouldShowStreakCelebration,
  markStreakCelebrationShown,
  getCompletedWeekDays,
  getTodayIndex,
} from '../streaks/streakCelebrationStorage.js'

function safeGetStreak() {
  try { return getProgress().streak || 0 } catch { return 0 }
}

// ─── HomeAtmosphere — LOCKED COMPONENT ────────────────────────────────────────
// Three drifting SVG wave bands + teal constellation network, rendered in the
// 34vh hero section of the Home tab. Must NOT be removed, renamed, or have its
// wave/gradient/animation structure altered. Small colour tweaks to teal values
// are OK; removing the SVG layers or the component call in Home is not.
function HomeAtmosphere() {
  const nodes = [
    [180, 48], [222, 26], [266, 16], [300, 36], [332, 22],
    [356, 50], [362, 82], [334, 106], [300, 78], [266, 90],
    [228, 68], [194, 90], [370, 62], [346, 130], [308, 116],
  ]
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,12],[5,6],[6,7],
    [7,8],[8,9],[9,10],[10,11],[11,0],[2,8],[3,8],[1,10],
    [6,12],[7,13],[13,14],[8,14],
  ]
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes ha-breathe { 0%,100%{opacity:0.08} 50%{opacity:0.13} }
        @keyframes ha-wave-drift-a { from { transform: translateX(0) } to { transform: translateX(-390px) } }
        @keyframes ha-wave-drift-b { from { transform: translateX(-390px) } to { transform: translateX(0) } }
      `}</style>

      {/* Large slow-drifting wave bands */}
      <svg
        width="100%" height="100%"
        viewBox="0 0 390 300"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="ha-wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${GENERAL.tealRgb},0.62)`} />
            <stop offset="100%" stopColor={`rgba(${hexToRgb(GENERAL.darkTeal)},0.18)`} />
          </linearGradient>
        </defs>
        <g style={{ animation: 'ha-wave-drift-a 30s linear infinite' }}>
          <path d="M0,200 Q48.75,228 97.5,200 T195,200 T292.5,200 T390,200 T487.5,200 T585,200 T682.5,200 T780,200 L780,0 L0,0 Z" fill="url(#ha-wave-grad)" opacity="0.5" />
        </g>
        <g style={{ animation: 'ha-wave-drift-b 42s linear infinite' }}>
          <path d="M0,140 Q48.75,168 97.5,140 T195,140 T292.5,140 T390,140 T487.5,140 T585,140 T682.5,140 T780,140 L780,0 L0,0 Z" fill="url(#ha-wave-grad)" opacity="0.7" />
        </g>
        <g style={{ animation: 'ha-wave-drift-a 54s linear infinite' }}>
          <path d="M0,90 Q48.75,120 97.5,90 T195,90 T292.5,90 T390,90 T487.5,90 T585,90 T682.5,90 T780,90 L780,0 L0,0 Z" fill="url(#ha-wave-grad)" opacity="1" />
        </g>
      </svg>
      <svg
        width="100%" height="75%"
        viewBox="0 0 390 300"
        preserveAspectRatio="xMaxYMin meet"
        style={{ animation: 'ha-breathe 18s ease-in-out infinite' }}
      >
        {edges.map(([a, b], i) => (
          <line key={i}
            x1={nodes[a][0]} y1={nodes[a][1]}
            x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={`rgba(${GENERAL.tealRgb},0.35)`}
            strokeWidth="0.65"
          />
        ))}
        {nodes.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.8" fill={`rgba(${GENERAL.tealRgb},0.5)`} />
        ))}
      </svg>
      {/* Left-to-right vignette — keeps text area dark */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, ${GENERAL.neutral[0]} 0%, rgba(${hexToRgb(GENERAL.neutral[0])},0.55) 40%, rgba(${hexToRgb(GENERAL.neutral[0])},0.12) 75%, transparent 100%)`,
      }} />
    </div>
  )
}

function NavArrow({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function AccountIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    </svg>
  )
}

// Small centred dialog — account status + sign in/out. Follows the same
// scrim + centred-card dialog convention as StreakCelebrationOverlay, kept
// calm and text-only rather than a celebration moment.
function AccountOverlay({ onDismiss }) {
  const { user, linkGoogleAccount, signOut, loading, authError, syncStatus } = useAuth()
  const userName = user?.name || 'you'
  const statusText = getProgressStatusText(user, syncStatus)
  const isGoogleUser = user?.provider === 'google'

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Account"
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(3,10,11,0.86)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        padding: SPACING.standard,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 340,
          background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: RADII.large, padding: SPACING.standard,
          display: 'flex', flexDirection: 'column', gap: SPACING.micro,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.micro }}>
          <span style={{ ...TYPE.eyebrow, color: GENERAL.slate }}>Account</span>
          <ExitButton ariaLabel="Close account details" onClick={onDismiss} style={{ opacity: 0.5, width: 32, height: 32 }} />
        </div>
        <div style={{ ...TYPE.body, fontWeight: 600, color: GENERAL.softWhite }}>{userName}</div>
        {isGoogleUser && user?.email && (
          <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{user.email}</div>
        )}
        <div style={{ ...TYPE.bodySmall, color: 'rgba(241,250,238,0.4)', marginTop: SPACING.micro }}>{statusText}</div>
        {authError && !isGoogleUser && (
          <div style={{ ...TYPE.eyebrow, fontSize: 11, color: '#E0836B' }}>{authError}</div>
        )}
        <button
          onClick={isGoogleUser ? signOut : linkGoogleAccount}
          disabled={loading}
          style={{
            marginTop: SPACING.compact, alignSelf: 'flex-start',
            background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer',
            ...TYPE.eyebrow, fontSize: 12, color: isGoogleUser ? 'rgba(241,250,238,0.5)' : GENERAL.teal,
            textDecoration: 'underline', textUnderlineOffset: 3, padding: 4,
          }}
        >
          {loading ? 'Signing in…' : isGoogleUser ? 'Sign out' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}

function ClockIcon({ size = 13, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth="1.75" />
      <path d="M11 6.5V11l3 2" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BookIcon({ size = 24, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 6C10.2 4.4 7.2 4 4.5 4.4v14.2c2.7-.4 5.7 0 7.5 1.6 1.8-1.6 4.8-2 7.5-1.6V4.4C16.8 4 13.8 4.4 12 6z" />
      <path d="M12 6v14.2" />
    </svg>
  )
}

// Cinematic fallback imagery for hero items that carry no image of their own
// (practice cards). Existing /public/headers assets only — no new assets.
const SUBJECT_HERO_FALLBACKS = {
  History: '/headers/history-main.png',
  Maths: '/headers/maths-main.png',
  English: '/headers/english-main.png',
  Sociology: '/headers/sociology-main.png',
  Biology: '/headers/bio-main.png',
}

function heroImageFor(task, subject) {
  if (task?.image) return task.image
  if (task?.type === 'practice' || task?.type === 'paper') return '/headers/home-exam-paper.png'
  return SUBJECT_HERO_FALLBACKS[subject] ?? null
}

// Smallest local progress ring — no shared generic ring exists yet
// (CircularTimer is a countdown timer, not reusable here without altering it).
function TasksRing({ done, total }) {
  const size = 64
  const stroke = 5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = total ? Math.max(0, Math.min(1, done / total)) : 0
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={GENERAL.teal} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...TYPE.titleMedium, color: GENERAL.softWhite }}>{done}/{total}</span>
      </div>
    </div>
  )
}

// Dynamic hero banner — always renders the next incomplete plan item, or the
// completed-day state once every task is done. Never hardcoded to one lesson.
function HeroBanner({ item, subject, onStart, onReviewProgress }) {
  const allDone = !item
  const image = allDone ? null : heroImageFor(item, subject)
  const title = allDone ? 'Today’s plan complete' : item.title
  const ctaLabel = allDone ? 'Review progress' : item.type === 'continue' ? 'Continue' : 'Start now'
  const bgRgb = hexToRgb(GENERAL.neutral[900])
  const metaColor = `rgba(${hexToRgb(GENERAL.softWhite)},0.85)`

  return (
    <div style={{
      position: 'relative', minHeight: 260, borderRadius: RADII.panel, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)', background: GENERAL.neutral[800],
    }}>
      {image && (
        <>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'right center',
          }} />
          {/* Left-to-right scrim keeps text readable over the image */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, rgba(${bgRgb},0.92) 0%, rgba(${bgRgb},0.6) 42%, rgba(${bgRgb},0.18) 72%, transparent 100%)`,
          }} />
        </>
      )}
      <div style={{
        position: 'relative', zIndex: 1, minHeight: 260, padding: SPACING.standard,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxSizing: 'border-box',
      }}>
        {!allDone && subject && (
          <span style={{
            ...TYPE.button, color: GENERAL.teal,
            display: 'inline-flex', alignItems: 'center', height: 36, padding: `0 ${SPACING.compact}px`,
            border: `1px solid rgba(${GENERAL.tealRgb},0.55)`, borderRadius: RADII.pill,
            background: `rgba(${GENERAL.tealRgb},0.08)`,
          }}>
            {subject}
          </span>
        )}
        <div style={{ ...TYPE.displayHero, color: GENERAL.softWhite, marginTop: 'auto', paddingTop: SPACING.compact }}>
          {title}
        </div>
        {!allDone && (
          <div style={{ marginTop: SPACING.micro, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClockIcon size={15} color={metaColor} />
            <span style={{ ...TYPE.bodyStrong, color: metaColor }}>~{item.durationMinutes} min</span>
          </div>
        )}
        <button
          onClick={allDone ? onReviewProgress : onStart}
          style={{
            marginTop: SPACING.compact, minWidth: 170,
            height: BUTTONS.continue.height, borderRadius: BUTTONS.continue.borderRadius,
            padding: `0 ${BUTTONS.continue.paddingX}px`,
            fontFamily: BUTTONS.continue.fontFamily, fontSize: BUTTONS.continue.fontSize, fontWeight: BUTTONS.continue.fontWeight,
            background: GENERAL.coral, color: GENERAL.softWhite, border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.micro,
            transition: BUTTONS.continue.transition,
          }}
        >
          {ctaLabel}
          <NavArrow color={GENERAL.softWhite} />
        </button>
      </div>
    </div>
  )
}

function StatCard({ children, centred = false }) {
  return (
    <div style={{
      background: GENERAL.neutral[800], border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: RADII.large, padding: SPACING.compact, minHeight: 108,
      display: 'flex', flexDirection: 'column', gap: SPACING.micro,
      justifyContent: 'space-between', alignItems: centred ? 'center' : 'flex-start',
      textAlign: centred ? 'center' : 'left',
    }}>
      {children}
    </div>
  )
}

function StatusPill({ state, label }) {
  const styles = {
    done: { background: `rgba(${GENERAL.tealRgb},0.12)`, border: '1px solid transparent', color: GENERAL.teal },
    next: { background: `rgba(${GENERAL.tealRgb},0.06)`, border: `1px solid rgba(${GENERAL.tealRgb},0.55)`, color: GENERAL.teal },
    todo: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: GENERAL.slate },
  }
  return (
    <span style={{
      ...TYPE.label, ...styles[state],
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      height: 34, minWidth: 76, padding: `0 ${SPACING.compact}px`,
      borderRadius: RADII.pill, flexShrink: 0, boxSizing: 'border-box',
    }}>
      {label}
    </span>
  )
}

// One planner row: timeline marker column, text column, status pill.
// Rows stay tappable so any task can still be launched out of order,
// preserving the old carousel's behaviour.
function PlannerRow({ task, index, state, prevDone, isLast, onSelect }) {
  const subtitle = task.title !== task.kicker ? task.title : null
  const pillLabel = state === 'done' ? 'Done' : state === 'next' ? (task.type === 'continue' ? 'Continue' : 'Next') : 'To do'
  const circleStyles = {
    done: { background: GENERAL.teal, border: 'none' },
    next: { background: 'transparent', border: `1.5px solid ${GENERAL.teal}` },
    todo: { background: 'transparent', border: `1.5px solid rgba(${hexToRgb(GENERAL.slate)},0.45)` },
  }
  const lineColor = (done) => (done ? `rgba(${GENERAL.tealRgb},0.8)` : 'rgba(255,255,255,0.08)')

  return (
    <button
      onClick={() => onSelect(task)}
      style={{
        display: 'grid', gridTemplateColumns: '40px 1fr', gap: SPACING.micro,
        width: '100%', textAlign: 'left', background: 'none', border: 'none',
        padding: 0, margin: 0, cursor: 'pointer',
      }}
    >
      {/* Timeline marker column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {index > 0 && <div style={{ width: 2, height: SPACING.compact, background: lineColor(prevDone) }} />}
        <div style={{
          width: 36, height: 36, borderRadius: RADII.pill, flexShrink: 0, boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...circleStyles[state],
        }}>
          {state === 'done' ? (
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <path d="M5.5 11.5l3.6 3.6L16.5 7.5" stroke={GENERAL.neutral[900]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span style={{ ...TYPE.titleMedium, color: state === 'next' ? GENERAL.teal : GENERAL.slate }}>
              {index + 1}
            </span>
          )}
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, background: lineColor(!!task.doneToday) }} />}
      </div>

      {/* Text + status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SPACING.micro,
        paddingTop: index > 0 ? SPACING.compact : 0,
        paddingBottom: isLast ? 0 : SPACING.compact,
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
        minWidth: 0,
      }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
          <div style={{ ...TYPE.titleLarge, color: GENERAL.softWhite }}>{task.kicker}</div>
          {subtitle && (
            <div style={{ ...TYPE.bodySmall, color: state === 'next' ? GENERAL.teal : GENERAL.slate }}>
              {subtitle}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClockIcon color={GENERAL.slate} />
            <span style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{task.durationMinutes} min</span>
          </div>
        </div>
        <StatusPill state={state} label={pillLabel} />
      </div>
    </button>
  )
}

export default function Home({ onSelectTask, onReviewProgress }) {
  const { user } = useAuth()
  const firstName = user?.name?.trim().split(/\s+/)[0]

  const todaysPlan = buildTodaysPlan()
  const streak = safeGetStreak()

  // Hero and planner rows share one source of truth: the plan itself.
  const heroItem = getNextPlannerItem(todaysPlan)
  const heroSubject = getTaskSubject(heroItem)
  const focusSubject = heroSubject ?? todaysPlan.map(getTaskSubject).find(Boolean) ?? 'Mixed'
  const plannedMinutes = todaysPlan.reduce((sum, t) => sum + (t.durationMinutes || 0), 0)
  const completedCount = todaysPlan.filter(t => t.doneToday).length

  const [accountOpen, setAccountOpen] = useState(false)

  // Home renders first; the celebration (if any) mounts on top a moment
  // later rather than blocking the initial paint.
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  useEffect(() => {
    if (shouldShowStreakCelebration(streak)) setShowStreakCelebration(true)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[900], paddingBottom: 120, overflowX: 'hidden', position: 'relative' }}>

      {/* LOCKED atmosphere — call site preserved; sits as the ambient band
          behind the utility row and hero banner */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, overflow: 'hidden' }}>
        <HomeAtmosphere />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 420, margin: '0 auto', width: '100%', boxSizing: 'border-box',
        padding: `calc(env(safe-area-inset-top, 0px) + ${SPACING.micro}px) ${SPACING.compact}px 0`,
      }}>

        {/* ── Top utility row ── */}
        <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.micro }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, minWidth: 0 }}>
            <button
              onClick={() => setAccountOpen(true)}
              aria-label="Account details"
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.14)', borderRadius: RADII.pill,
                cursor: 'pointer', width: 40, height: 40, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <AccountIcon color="rgba(241,250,238,0.55)" />
            </button>
            <span style={{ ...TYPE.bodyStrong, color: 'rgba(241,250,238,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {firstName ? `Hi, ${firstName}.` : 'Hi.'}
            </span>
            <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: RADII.pill, background: GENERAL.teal, flexShrink: 0 }} />
          </div>
          <StreakChip backdrop={false} layout="inline" />
        </div>

        {/* ── Dynamic hero banner ── */}
        <div style={{ marginTop: SPACING.compact }}>
          <HeroBanner
            item={heroItem}
            subject={heroSubject}
            onStart={() => onSelectTask(heroItem)}
            onReviewProgress={onReviewProgress}
          />
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING.micro, marginTop: SPACING.compact }}>
          <StatCard>
            <ClockIcon size={24} color={GENERAL.teal} />
            <div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>Planned</div>
              <div style={{ ...TYPE.displaySection, color: GENERAL.softWhite, marginTop: SPACING.micro }}>{plannedMinutes} min</div>
            </div>
          </StatCard>
          <StatCard>
            <BookIcon color={GENERAL.teal} />
            <div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>Subject</div>
              <div style={{ ...TYPE.displaySection, color: GENERAL.softWhite, marginTop: SPACING.micro }}>{focusSubject}</div>
            </div>
          </StatCard>
          <StatCard centred>
            <TasksRing done={completedCount} total={todaysPlan.length} />
            <div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>Tasks</div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.softWhite, marginTop: 2 }}>
                {completedCount} of {todaysPlan.length} done
              </div>
            </div>
          </StatCard>
        </div>

        {/* ── Today's plan ── */}
        <div style={{
          marginTop: SPACING.compact, background: GENERAL.neutral[800],
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: RADII.panel, padding: SPACING.standard,
        }}>
          <div style={{ ...TYPE.displaySection, color: GENERAL.softWhite }}>Today’s plan</div>
          <div style={{ marginTop: SPACING.compact }}>
            {todaysPlan.map((task, i) => (
              <PlannerRow
                key={task.type + i}
                task={task}
                index={i}
                state={task.doneToday ? 'done' : task === heroItem ? 'next' : 'todo'}
                prevDone={i > 0 ? !!todaysPlan[i - 1].doneToday : false}
                isLast={i === todaysPlan.length - 1}
                onSelect={onSelectTask}
              />
            ))}
          </div>
        </div>
      </div>

      {showStreakCelebration && (
        <StreakCelebrationOverlay
          streakCount={streak}
          completedWeekDays={getCompletedWeekDays(streak)}
          todayIndex={getTodayIndex()}
          onDismiss={() => {
            markStreakCelebrationShown()
            setShowStreakCelebration(false)
          }}
        />
      )}

      {accountOpen && (
        <AccountOverlay onDismiss={() => setAccountOpen(false)} />
      )}

    </div>
  )
}
