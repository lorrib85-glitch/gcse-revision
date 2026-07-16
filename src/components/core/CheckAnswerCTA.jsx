import { useState } from 'react'
import { BUTTONS } from '../../constants/buttons.js'
import { MOTION } from '../../constants/motion.js'
import { GENERAL } from '../../constants/generalTheme.js'

// ── CheckAnswerCTA v1 — governed shared answer-submit action ──────────────────
// The single non-progression "check / submit" action for assessed learning
// screens (e.g. SpotTheError). Deliberately distinct from ContinueCTA, the
// primary *progression* CTA: this uses the `secondary` button token (56px,
// RADII.medium) so a "check my answer" step never visually competes with the
// final "Continue" that advances the flow.
//
// Owns: ~56px height, solid subject-accent fill when enabled, the canonical
// dark-on-accent foreground token, the governed disabled treatment, and
// focus-visible + pressed states. `style` carries layout overrides only
// (width/flex/margin) — never new height, radius, font or colour logic.
export default function CheckAnswerCTA({
  onClick,
  label = 'Check my thinking',
  accent,
  disabled = false,
  disabledBackground = GENERAL.line.medium,
  disabledColor = GENERAL.slate,
  textColor = GENERAL.textOnAccent,
  style,
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      type="button"
      className="check-answer-cta"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: '100%',
        height: BUTTONS.secondary.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BUTTONS.secondary.borderRadius,
        border: 'none',
        background: disabled ? disabledBackground : accent,
        color: disabled ? disabledColor : textColor,
        fontFamily: BUTTONS.secondary.fontFamily,
        fontSize: BUTTONS.secondary.fontSize,
        fontWeight: BUTTONS.secondary.fontWeight,
        letterSpacing: BUTTONS.secondary.letterSpacing,
        cursor: disabled ? 'default' : 'pointer',
        transform: pressed && !disabled ? `scale(${BUTTONS.secondary.pressScale})` : 'scale(1)',
        transition: `transform ${BUTTONS.secondary.transition}, background ${MOTION.duration.fast} ${MOTION.easing.gentle}, color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
        ...style,
      }}
    >
      <style>{`
        .check-answer-cta:focus-visible {
          outline: 2px solid ${accent};
          outline-offset: 3px;
        }
      `}</style>
      {label}
    </button>
  )
}
