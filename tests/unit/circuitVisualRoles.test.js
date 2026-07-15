import { describe, expect, it } from 'vitest'
import { SUBJECTS } from '../../src/constants/subjects.js'
import {
  PHYSICS_CIRCUIT_VISUAL_ROLES,
  createCircuitVisualRoles,
} from '../../src/components/learning/circuit/circuitVisualRoles.js'

describe('CircuitDiagram visual roles', () => {
  it('keeps interaction, conduction and emitted light as separate semantic roles', () => {
    const roles = PHYSICS_CIRCUIT_VISUAL_ROLES

    expect(roles.interaction).toBe(SUBJECTS.Physics.accent)
    expect(roles.conducting).toBe(SUBJECTS.Physics.accent)
    expect(roles.emittedLight).toBe(SUBJECTS.Physics.accentSecondary)
    expect(roles.structure).toBe(SUBJECTS.Physics.accentTertiary)
    expect(roles.emittedLight).not.toBe(roles.interaction)
  })

  it('uses subject tokens for lamp light rather than a local success colour', () => {
    const roles = PHYSICS_CIRCUIT_VISUAL_ROLES

    expect(roles.lampFill).toBe(SUBJECTS.Physics.glowStrong)
    expect(roles.lampHalo).toBe('rgba(242,193,78,0.32)')
    expect(roles.lampHalo).not.toMatch(/34,197,94|22,163,74|16,185,129/)
  })

  it('can derive the same semantic roles from a compatible subject theme', () => {
    const theme = {
      accent: '#111111',
      accentSecondary: '#222222',
      accentTertiary: '#333333',
      backgroundSecondary: '#444444',
      glow: 'rgba(17,17,17,0.2)',
      glowStrong: 'rgba(34,34,34,0.2)',
      palette: {
        lightAsh: '#eeeeee',
        warmGrey: '#aaaaaa',
      },
    }

    expect(createCircuitVisualRoles(theme)).toMatchObject({
      interaction: '#111111',
      conducting: '#111111',
      emittedLight: '#222222',
      structure: '#333333',
      surface: '#444444',
      textPrimary: '#eeeeee',
      textSecondary: '#aaaaaa',
    })
  })
})
