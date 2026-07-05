import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { getProgress } from '../../progress.js'
import { hexToRgb } from '../../constants/subjects.js'

function safeGetProgress() {
  try { return getProgress() } catch { return { streak: 0, lastSessionDate: null, topicProgress: {}, history: [] } }
}

// ─── Shared streak chip ───────────────────────────────────────────────────────
// Reads live from localStorage so it's always accurate wherever it's rendered.

export function StreakChip({ style = {}, backdrop = true, layout = 'stacked' }) {
  const prog   = safeGetProgress()
  const streak = prog.streak || 0

  // Single-row variant for the Home utility row — small coral flame, quiet
  // count and muted caption, so the streak never competes with the hero CTA
  // (coral stays reserved for the primary action). Same data, different
  // arrangement; the stacked default stays untouched for
  // Subjects/Pulse/QuickFire/ExamMode.
  if (layout === 'inline') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, ...style }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={GENERAL.coral} style={{ flexShrink: 0 }}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        <span style={{ ...TYPE.bodySmall, fontWeight: 600, color: GENERAL.softWhite }}>
          {streak > 0 ? streak : 0}
        </span>
        <span style={{ ...TYPE.caption, color: GENERAL.slate }}>day streak</span>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Standard corner darkening so the chip stays legible over busy backgrounds (hero images, atmosphere) */}
      {backdrop && (
        <div aria-hidden="true" style={{
          position: 'absolute', top: -32, right: -40, bottom: -40, left: -64,
          background: `radial-gradient(ellipse at top right, rgba(${hexToRgb(GENERAL.neutral[0])},0.95) 0%, rgba(${hexToRgb(GENERAL.neutral[0])},0.6) 50%, transparent 100%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={GENERAL.coral} style={{ flexShrink: 0 }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span style={{ ...TYPE.metadata, fontSize: 14, fontWeight: 700, color: GENERAL.coral, letterSpacing: '0.01em' }}>
            {streak > 0 ? streak : 0}
          </span>
        </div>
        <span style={{ ...TYPE.metadata, fontSize: 9, color: GENERAL.slate, textTransform: 'uppercase' }}>
          day streak
        </span>
      </div>
    </div>
  )
}
