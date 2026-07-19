import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'

// ── CinematicContinueCTA v1 — LOCKED COMPONENT ────────────────────────────
// The only Cinematic Reveal CTA implementation allowed anywhere in the app —
// see docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".
// `layout="fixed"` anchors progression to a full-screen cinematic moment.
// `layout="inline"` keeps the same governed treatment in normal content flow.
// `style` remains for layout-only overrides — never new typography or colour logic.
export default function CinematicContinueCTA({
  onClick,
  accent,
  label = 'Continue',
  animation = `crm-fade ${GENERAL.cinematic.motion.slow} ease both, crm-pulse ${GENERAL.cinematic.motion.pulse} ease-in-out ${GENERAL.cinematic.motion.attentionDelay} infinite`,
  layout = 'fixed',
  align = 'center',
  style,
}) {
  const isInline = layout === 'inline'

  return (
    <>
      <style>{`
        @keyframes crm-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes crm-pulse {
          0%, 100% { opacity: 0.72; }
          50%      { opacity: 1; }
        }
        @keyframes expl-cont {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cinematic-continue-cta {
            animation: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }
      `}</style>
      <button
        className="cinematic-continue-cta"
        data-cinematic-cta-layout={layout}
        aria-label={label}
        onClick={e => { e.stopPropagation(); onClick?.() }}
        style={{
          ...(isInline
            ? {
                position: 'static',
                width: '100%',
              }
            : {
                position: 'fixed',
                left: SPACING.standard + SPACING.micro,
                right: SPACING.standard + SPACING.micro,
                bottom: `calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
              }),
          zIndex: 1300,
          pointerEvents: 'auto',
          minHeight: 44,
          background: 'none',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'start' ? 'flex-start' : 'center',
          cursor: 'pointer',
          animation,
          ...style,
        }}
      >
        <span style={{
          ...TYPE.cinematicAction,
          color: accent,
          textShadow: GENERAL.cinematic.actionShadow,
        }}>{label}</span>
      </button>
    </>
  )
}
