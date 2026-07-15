// Pure geometry helpers for the CircuitDiagram family.
//
// Keeping touch-target calculations out of JSX makes the mobile interaction
// contract directly testable without duplicating the maths in tests.

export const DEFAULT_SWITCH_HIT_TARGET = Object.freeze({
  width: 64,
  height: 52,
})

export function resolveCircuitSwitchHitBox({
  left,
  right,
  y,
  hitPaddingX = 19,
  hitPaddingY = 26,
  minHitWidth = DEFAULT_SWITCH_HIT_TARGET.width,
  minHitHeight = DEFAULT_SWITCH_HIT_TARGET.height,
}) {
  const width = right - left
  const rawHitWidth = width + (hitPaddingX * 2)
  const rawHitHeight = (hitPaddingY * 2) + 6
  const hitWidth = Math.max(rawHitWidth, minHitWidth)
  const hitHeight = Math.max(rawHitHeight, minHitHeight)
  const centreX = left + (width / 2)

  return {
    x: centreX - (hitWidth / 2),
    y: y - (hitHeight / 2),
    width: hitWidth,
    height: hitHeight,
  }
}
