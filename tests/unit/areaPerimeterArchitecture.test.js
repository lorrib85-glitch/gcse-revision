import { describe, expect, it, vi } from 'vitest'
import {
  configureAreaPerimeterPresentation,
  resolveAreaPerimeterPresentation,
} from '../../src/components/learning/areaPerimeter/areaPerimeterPresentation.js'
import { resolveAreaPerimeterVisualRole } from '../../src/components/learning/areaPerimeter/areaPerimeterRoleResolver.js'

describe('AreaPerimeterExplore presentation configuration', () => {
  it('attaches the rectangle baseline presentation once and keeps it stable', () => {
    const rectangle = {
      id: 'rectangle',
      canvas: { width: 360, height: 250 },
    }

    const first = configureAreaPerimeterPresentation(rectangle)
    const second = configureAreaPerimeterPresentation(rectangle)
    const presentation = resolveAreaPerimeterPresentation(first, { height: 4 })

    expect(first).toBe(second)
    expect(first).not.toBe(rectangle)
    expect(presentation.canvas).toEqual({ width: 360, height: 210 })
    expect(presentation.translateY).toBe(52)
  })

  it('leaves presets without presentation metadata untouched', () => {
    const triangle = {
      id: 'triangleArea',
      canvas: { width: 380, height: 260 },
    }

    const configured = configureAreaPerimeterPresentation(triangle)
    expect(configured).toBe(triangle)
    expect(resolveAreaPerimeterPresentation(configured, {})).toEqual({
      canvas: triangle.canvas,
      translateY: 0,
    })
  })
})

describe('AreaPerimeterExplore visual roles', () => {
  it('resolves only known semantic roles', () => {
    expect(resolveAreaPerimeterVisualRole({ boundary: '#fff' }, 'boundary'))
      .toBe('#fff')
  })

  it('fails safely and warns in development for an unknown role', () => {
    const warn = vi.fn()
    const result = resolveAreaPerimeterVisualRole(
      { boundary: '#fff' },
      '#ff00ff',
      { isDevelopment: true, warn },
    )

    expect(result).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      'AreaPerimeterExplore received an unknown visual role: #ff00ff',
    )
  })
})
