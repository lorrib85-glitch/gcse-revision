import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SWITCH_HIT_TARGET,
  resolveCircuitSwitchHitBox,
} from '../../src/components/learning/circuit/circuitGeometry.js'

describe('CircuitDiagram switch geometry', () => {
  it('enforces the governed minimum touch target', () => {
    const hitBox = resolveCircuitSwitchHitBox({
      left: 100,
      right: 120,
      y: 80,
      hitPaddingX: 0,
      hitPaddingY: 0,
    })

    expect(hitBox.width).toBe(DEFAULT_SWITCH_HIT_TARGET.width)
    expect(hitBox.height).toBe(DEFAULT_SWITCH_HIT_TARGET.height)
  })

  it('keeps the touch target centred on the visible switch', () => {
    const hitBox = resolveCircuitSwitchHitBox({
      left: 105,
      right: 155,
      y: 150,
    })

    expect(hitBox.x + (hitBox.width / 2)).toBe(130)
    expect(hitBox.y + (hitBox.height / 2)).toBe(150)
  })

  it('allows larger configured targets without shrinking them back to the default', () => {
    const hitBox = resolveCircuitSwitchHitBox({
      left: 100,
      right: 160,
      y: 100,
      hitPaddingX: 30,
      hitPaddingY: 30,
    })

    expect(hitBox.width).toBe(120)
    expect(hitBox.height).toBe(66)
  })
})
