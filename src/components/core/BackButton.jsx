import { RADII } from '../../constants/radii.js'

// ── BackButton v1 — LOCKED COMPONENT ──────────────────────────────────────
// The only back-navigation button allowed anywhere in the app.
// 40×40 pill, near-invisible fill/border, left chevron only, no label.
// Visual identity (size, fill, border, radius, icon, opacity) is fixed.
// `style` may only carry layout overrides (position, margin, zIndex) —
// never new fill, border, radius, size or icon.
export default function BackButton({ onClick, ariaLabel = 'Go back', style }) {
  return (
    <button
      className="rise-back-button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.03)',
        borderRadius: RADII.pill,
        padding: 0,
        cursor: 'pointer',
        ...style,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.75)" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
  )
}
