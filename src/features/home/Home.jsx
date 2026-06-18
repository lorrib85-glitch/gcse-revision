import { useEffect, useRef, useState } from 'react'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { buildTodaysPlan } from '../../todaysPlan.js'
import { StreakChip } from './StreakChip.jsx'

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,0,0'
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

function TaskCard({ task, position, onClick }) {
  const { magnitude, signed } = position
  const scale = magnitude === 0 ? 1.06 : magnitude === 1 ? 0.86 : 0.74
  const opacity = magnitude === 0 ? 1 : magnitude === 1 ? 0.45 : 0.18
  const distance = magnitude === 1 ? 219 : magnitude === 2 ? 245 : 0
  const translateX = signed === 0 ? 0 : signed > 0 ? distance : -distance
  const rotation = magnitude === 1 ? 14 : magnitude === 2 ? 24 : 0
  const rotateY = signed === 0 ? 0 : signed > 0 ? -rotation : rotation
  const depth = magnitude === 0 ? 0 : magnitude === 1 ? -35 : -79
  const accentColor = magnitude === 0 ? GENERAL.coral : GENERAL.teal

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 224, height: 315,
        transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${depth}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity, zIndex: 10 - magnitude,
        transition: `transform ${MOTION.duration.cinematic} ${MOTION.easing.standard}, opacity ${MOTION.duration.cinematic} ${MOTION.easing.standard}`,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        textAlign: 'left', background: GENERAL.neutral[1],
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: RADII.large,
        padding: SPACING.standard, cursor: 'pointer',
      }}
    >
      {task.image && (
        <>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${task.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: `linear-gradient(to bottom, transparent 35%, ${GENERAL.neutral[1]} 100%)`,
          }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }}>
        <div style={{ ...TYPE.body, fontWeight: 600, color: accentColor }}>
          {task.title}
        </div>
        <div style={{
          marginTop: SPACING.micro,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            ...TYPE.metadata, fontSize: 12, fontWeight: 400, letterSpacing: '0.06em', color: GENERAL.slate,
          }}>
            <svg width="13" height="13" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8.5" stroke={GENERAL.slate} strokeWidth="1.75" />
              <path d="M11 6.5V11l3 2" stroke={GENERAL.slate} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {`~${task.durationMinutes} min`}
          </div>
          {magnitude === 0 && (
            <NavArrow color={accentColor} />
          )}
        </div>
      </div>
    </button>
  )
}

// Centred 3D-style task carousel — swipe, click-to-focus, and arrow-key
// navigation. The focused (centre) card is the only one that triggers
// onSelect; tapping a side card brings it to focus instead.
function TaskCarousel({ tasks, onSelect }) {
  const [active, setActive] = useState(0)
  const count = tasks.length
  const touchStartX = useRef(0)

  const go = (i) => setActive(((i % count) + count) % count)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') go(active - 1)
      else if (e.key === 'ArrowRight') go(active + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, count])

  return (
    <div>
      <div
        onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].screenX
          if (Math.abs(diff) > 50) go(active + (diff > 0 ? 1 : -1))
        }}
        style={{ position: 'relative', height: 347, overflow: 'hidden', perspective: 1200 }}
      >
        {tasks.map((task, i) => {
          const raw = (i - active + count) % count
          const signed = raw <= count / 2 ? raw : raw - count
          return (
            <TaskCard
              key={task.type + i}
              task={task}
              position={{ magnitude: Math.abs(signed), signed }}
              onClick={() => (i === active ? onSelect(task) : go(i))}
            />
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: SPACING.micro, marginTop: SPACING.compact }}>
        {tasks.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to task ${i + 1}`}
            style={{
              width: 6, height: 6, padding: 0, border: 'none', borderRadius: RADII.pill, cursor: 'pointer',
              background: i === active ? GENERAL.teal : `rgba(${GENERAL.tealRgb},0.2)`,
              transition: `background ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home({ onSelectTask }) {
  const { user } = useAuth()
  const userName = user?.name || 'you'

  const todaysPlan = buildTodaysPlan()

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 120, overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
        <HomeAtmosphere />

        {/* Top row — streak */}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: SPACING.compact, zIndex: 2 }}>
          <StreakChip backdrop={false} />
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
          <div style={{ ...TYPE.body, color: 'rgba(241,250,238,0.7)' }}>
            Hi, {userName}<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ ...TYPE.cinematic, fontSize: 46, color: GENERAL.softWhite, marginTop: SPACING.micro }}>
            What's today's plan?
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 420, margin: '0 auto', width: '100%', marginTop: SPACING.compact + 4 }}>
        <TaskCarousel tasks={todaysPlan} onSelect={onSelectTask} />
      </div>

    </div>
  )
}
