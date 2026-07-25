import { describe, expect, it, vi } from 'vitest'
import { SUBJECTS } from '../../src/constants/subjects.js'
import { GENERAL } from '../../src/constants/generalTheme.js'
import { createCoordinatePlaneVisualRoles } from '../../src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js'
import { resolveCoordinatePlaneVisualRole } from '../../src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js'

describe('CoordinatePlaneExplore visual roles', () => {
  it('drives object and image tones from the subject theme', () => {
    const maths = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const physics = createCoordinatePlaneVisualRoles(SUBJECTS.Physics)

    expect(maths.object).toBe(SUBJECTS.Maths.accent)
    expect(maths.image).toBe(SUBJECTS.Maths.accentSecondary)
    expect(physics.object).toBe(SUBJECTS.Physics.accent)
    expect(physics.object).not.toBe(maths.object)
  })

  it('takes structural drawing tones from GENERAL, not the subject', () => {
    const maths = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const physics = createCoordinatePlaneVisualRoles(SUBJECTS.Physics)

    expect(maths.axis).toBe(GENERAL.diagram.edgePrimary)
    expect(maths.guideLine).toBe(GENERAL.diagram.construction)
    expect(maths.ruleLine).toBe(GENERAL.diagram.construction)
    expect(physics.axis).toBe(maths.axis)
  })

  it('defaults to the Maths theme and freezes the result', () => {
    const roles = createCoordinatePlaneVisualRoles()

    expect(roles.object).toBe(SUBJECTS.Maths.accent)
    expect(Object.isFrozen(roles)).toBe(true)
  })

  it('contains no raw hex literals beyond those sourced from tokens', () => {
    const roles = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const tokenValues = new Set([
      ...Object.values(SUBJECTS.Maths),
      ...Object.values(GENERAL.diagram),
      ...Object.values(GENERAL.cinematic),
    ])

    for (const value of Object.values(roles)) {
      const isToken = tokenValues.has(value)
      const isDerivedAlpha = typeof value === 'string' && value.startsWith('rgba(')
      expect(isToken || isDerivedAlpha).toBe(true)
    }
  })
})

describe('CoordinatePlaneExplore role resolver', () => {
  it('resolves a known role', () => {
    expect(resolveCoordinatePlaneVisualRole({ object: '#fff' }, 'object')).toBe('#fff')
  })

  it('returns undefined for a missing role without warning in production', () => {
    const warn = vi.fn()
    expect(resolveCoordinatePlaneVisualRole({}, 'object', { warn })).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('fails safely and warns in development for an unknown role', () => {
    const warn = vi.fn()
    const result = resolveCoordinatePlaneVisualRole(
      { object: '#fff' },
      '#ff00ff',
      { isDevelopment: true, warn },
    )

    expect(result).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      'CoordinatePlaneExplore received an unknown visual role: #ff00ff',
    )
  })

  it('returns undefined for a null role', () => {
    expect(resolveCoordinatePlaneVisualRole({ object: '#fff' }, null)).toBeUndefined()
  })
})
