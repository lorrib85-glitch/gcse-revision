import { TYPE } from '../../constants/typography.js'
// ── CinematicContinueCTA v1 — LOCKED COMPONENT ────────────────────────────
// The only Cinematic Reveal CTA implementation allowed anywhere in the app —
// see docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".
// Plain centred progression text, fixed to the bottom of a full-screen cinematic
// moment. `style` carries layout overrides only (position, animation, zIndex) —
// never new typography, spacing or colour logic.
export default function CinematicContinueCTA({
  onClick,
  accent,
  label = 'Continue',
  animation = 'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite',
  style,
}) {
  return (
    <>
      <style>{`
        @keyframes crm-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes crm-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes expl-cont {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <button
        onClick={e => { e.stopPropagation(); onClick?.() }}
        style={{
          position: 'fixed',
          left: 32, right: 32,
          bottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
          zIndex: 1300,
          pointerEvents: 'auto',
          minHeight: 44,
          background: 'none', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          animation,
          ...style,
        }}>
        <span style={{
          ...TYPE.eyebrow,
          fontSize: 13,
          letterSpacing: '0.30em', textTransform: 'uppercase',
          color: accent,
          textShadow: '0 1px 16px rgba(0,0,0,0.6)',
        }}>{label}&nbsp;&nbsp;→</span>
      </button>
    </>
  )
}
