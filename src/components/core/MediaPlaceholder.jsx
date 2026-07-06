import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'

// ─── MediaPlaceholder ────────────────────────────────────────────────────────
// Standard reserved slot for an image or diagram the author has NOT yet
// supplied. Content builds insert this wherever a screen needs a visual,
// with a `caption` briefing exactly what the asset should depict, so the
// visual can be dropped in later without touching layout. Keeps the space,
// the aspect ratio, and the intent — never a bespoke generated image.
//
// Props:
//   kind    — 'image' | 'diagram' (default 'image') — tunes the label + glyph
//   aspect  — 'W:H' ratio string reserving the slot's shape (default '16:9')
//   caption — one line describing what the finished asset should show
//   subject — palette key for the accent (default 'History')

function Glyph({ kind, accent }) {
  const stroke = { fill: 'none', stroke: accent, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.7 }
  if (kind === 'diagram') {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="8" cy="8" r="3.5" {...stroke} />
        <circle cx="26" cy="8" r="3.5" {...stroke} />
        <circle cx="8" cy="26" r="3.5" {...stroke} />
        <circle cx="26" cy="26" r="3.5" {...stroke} />
        <line x1="8" y1="26" x2="26" y2="8" {...stroke} />
      </svg>
    )
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <rect x="4" y="6" width="26" height="22" rx="3" {...stroke} />
      <circle cx="12" cy="14" r="2.5" {...stroke} />
      <path d="M6 26 L14 18 L20 24 L24 20 L28 24" {...stroke} />
    </svg>
  )
}

export default function MediaPlaceholder({ kind = 'image', aspect = '16:9', caption, subject = 'History' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
  const [w, h] = String(aspect).split(':')
  const label = kind === 'diagram' ? 'Diagram coming soon' : 'Image coming soon'

  return (
    <div
      role="img"
      aria-label={`${label}${caption ? `: ${caption}` : ''}`}
      style={{
        width: '100%',
        aspectRatio: `${w || 16} / ${h || 9}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.compact,
        textAlign: 'center',
        padding: SPACING.standard,
        boxSizing: 'border-box',
        borderRadius: RADII.medium,
        border: `1px dashed rgba(${rgb}, 0.35)`,
        background: `radial-gradient(120% 120% at 50% 0%, rgba(${rgb},0.05), rgba(255,255,255,0.015))`,
      }}
    >
      <Glyph kind={kind} accent={accent} />
      <div style={{ ...TYPE.label, fontWeight: 600, color: `rgba(${rgb}, 0.9)` }}>
        {label}
      </div>
      {caption && (
        <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.5)', maxWidth: 280 }}>
          {caption}
        </div>
      )}
    </div>
  )
}
