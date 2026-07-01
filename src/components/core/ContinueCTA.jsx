import { useState } from 'react'
import { BUTTONS } from '../../constants/buttons.js'
import { TYPE } from '../../constants/typography.js'

// ── ContinueCTA v1 — LOCKED COMPONENT ─────────────────────────────────────
// The only Primary Progression CTA implementation allowed anywhere in the
// app — see docs/system/BUTTON_RADII_SYSTEM.md "Progression CTA System".
// 56px tall, RADII.large, solid accent fill, #0D0F14 text, "Continue" label.
// `style` carries layout overrides only (width/flex, margin, position,
// animation, transition) — never new height, radius, font or colour logic.
export default function ContinueCTA({
  onClick,
  label = 'Continue',
  accent,
  disabled = false,
  disabledBackground = 'rgba(255,255,255,0.08)',
  disabledColor = 'rgba(255,255,255,0.3)',
  textColor = '#0D0F14',
  onMouseEnter,
  onMouseLeave,
  style,
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: '100%',
        height: BUTTONS.continue.height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: BUTTONS.continue.borderRadius,
        border: 'none',
        background: disabled ? disabledBackground : accent,
        color: disabled ? disabledColor : textColor,
        fontFamily: "'Sora', sans-serif",
        fontSize: BUTTONS.continue.fontSize,
        fontWeight: BUTTONS.continue.fontWeight,
        cursor: disabled ? 'default' : 'pointer',
        transform: pressed ? `scale(${BUTTONS.continue.pressScale})` : 'scale(1)',
        transition: `transform ${BUTTONS.continue.transition}`,
        ...style,
      }}
    >
      {label}
    </button>
  )
}
