import { useState } from 'react'

// ── ExitButton v1 — LOCKED COMPONENT ──────────────────────────────────────
// The only exit-navigation button allowed anywhere in the app.
// 44×44, near-invisible "X" icon, opacity/scale press feedback.
// `style` may only carry layout overrides (position, margin, zIndex) —
// never new size, icon or opacity behaviour.
export default function ExitButton({ onClick, ariaLabel = 'Exit chapter', style }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      aria-label={ariaLabel}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onClick?.() }}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 44, height: 44,
        background: 'none', border: 'none', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        opacity: pressed ? 0.6 : 0.22,
        transform: pressed ? 'scale(0.90)' : 'scale(1)',
        transition: 'opacity 140ms ease, transform 140ms ease',
        ...style,
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.75)" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}
