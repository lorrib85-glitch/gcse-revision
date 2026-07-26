import { describe, expect, it, vi } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampInteractiveValue,
  clampInteractiveValues,
  clampPresetValues,
  interactionRange,
  mergeAxis,
  mergeCapabilities,
  resolveCoordinatePlanePreset,
  resolveOptionValues,
  resolvePresetFocus,
  resolveShowGuides,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

function sceneFor(presetId, values, context = {}) {
  const preset = resolveCoordinatePlanePreset(presetId)
  return preset.derive(
    clampPresetValues(preset, values ?? preset.initialValues),
    {
      focus: resolvePresetFocus(preset, context.focus),
      activeId: context.activeId ?? preset.defaultActiveId,
      showGuides: context.showGuides ?? 'active',
      axes: { x: preset.xAxis, y: preset.yAxis },
      grid: preset.grid,
      ...context,
      // After the spread: a caller passing `capabilities` explicitly as
      // undefined (a helper with an optional third argument) would otherwise
      // clobber the merged preset defaults with undefined, and the preset would
      // read a capability off nothing. The renderer always merges, so the
      // helper must too.
      capabilities: mergeCapabilities(preset, context.capabilities),
    },
  )
}

describe('preset registry', () => {
  it('resolves a registered preset by name', () => {
    expect(resolveCoordinatePlanePreset('plotPoint').id).toBe('plotPoint')
  })

  it('passes a compatible preset object straight through', () => {
    const custom = { id: 'custom', derive: () => ({}) }
    expect(resolveCoordinatePlanePreset(custom)).toBe(custom)
  })

  it('falls back to plotPoint for an unknown name', () => {
    expect(resolveCoordinatePlanePreset('nope').id).toBe('plotPoint')
  })

  it('registers plotPoint', () => {
    expect(Object.keys(COORDINATE_PLANE_PRESETS)).toContain('plotPoint')
  })
})

describe('focus resolution', () => {
  it('uses the requested focus when the preset supports it', () => {
    expect(resolvePresetFocus(COORDINATE_PLANE_PRESETS.plotPoint, 'quadrants'))
      .toBe('quadrants')
  })

  it('falls back to the default focus when unsupported', () => {
    expect(resolvePresetFocus(COORDINATE_PLANE_PRESETS.plotPoint, 'nonsense'))
      .toBe('plot')
  })
})

describe('value clamping', () => {
  it('clamps each control to its own range and step', () => {
    const preset = COORDINATE_PLANE_PRESETS.plotPoint
    expect(clampPresetValues(preset, { x: 99, y: -99 })).toEqual({ x: 6, y: -6 })
    expect(clampPresetValues(preset, { x: 2.4, y: 1.6 })).toEqual({ x: 2, y: 2 })
  })
})

describe('axis merging', () => {
  it('lets a caller override label and unit without restating the range', () => {
    const merged = mergeAxis(
      { min: 0, max: 20, step: 2 },
      { label: 'Time', unit: 's' },
    )

    expect(merged).toEqual({ min: 0, max: 20, step: 2, label: 'Time', unit: 's' })
  })

  it('lets a caller override the range', () => {
    expect(mergeAxis({ min: -6, max: 6, step: 1 }, { min: 0, max: 10 }))
      .toEqual({ min: 0, max: 10, step: 1 })
  })

  it('returns the preset axis untouched when there is no override', () => {
    const axis = { min: -6, max: 6, step: 1 }
    expect(mergeAxis(axis, undefined)).toEqual(axis)
  })
})

describe('capability merging', () => {
  it('overlays caller capabilities on the preset defaults', () => {
    const preset = { capabilities: { nonOriginCentre: true, negativeScaleFactor: false } }

    expect(mergeCapabilities(preset, { negativeScaleFactor: true })).toEqual({
      nonOriginCentre: true,
      negativeScaleFactor: true,
    })
  })

  it('returns the preset defaults when nothing is supplied', () => {
    expect(mergeCapabilities({ capabilities: { a: 1 } })).toEqual({ a: 1 })
  })

  it('tolerates a preset with no declared capabilities', () => {
    expect(mergeCapabilities({}, { a: 1 })).toEqual({ a: 1 })
  })
})

describe('showGuides resolution', () => {
  it('passes through a supported value', () => {
    const preset = { supportsShowAllGuides: true }
    expect(resolveShowGuides(preset, 'all')).toBe('all')
    expect(resolveShowGuides(preset, 'none')).toBe('none')
  })

  it('defaults to active', () => {
    expect(resolveShowGuides({ supportsShowAllGuides: true })).toBe('active')
  })

  it('clamps all to active for presets that cannot survive it, and warns in dev', () => {
    const warn = vi.fn()
    const preset = { id: 'reflect', supportsShowAllGuides: false }

    expect(resolveShowGuides(preset, 'all', { isDevelopment: true, warn })).toBe('active')
    expect(warn).toHaveBeenCalledOnce()
  })

  it('does not warn outside development', () => {
    const warn = vi.fn()
    resolveShowGuides({ id: 'reflect', supportsShowAllGuides: false }, 'all', { warn })
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('plotPoint preset', () => {
  it('reports the coordinate and its quadrant', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })

    expect(scene.status.heading).toBe('(3, −2)')
    expect(scene.status.explanation).toContain('Quadrant IV')
  })

  it('reads across first, then up or down', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })

    expect(scene.status.calculation[0]).toContain('3 units to the right')
    expect(scene.status.calculation[1]).toContain('2 units down')
  })

  it('gives the active point full guide lines', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })
    const point = scene.points.find(item => item.id === 'p')

    expect(point.tier).toBe('active')
    expect(scene.guides.length).toBeGreaterThan(0)
  })

  it('emits no guides when showGuides is none', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 }, { showGuides: 'none' })

    expect(scene.guides).toEqual([])
    expect(scene.points.find(item => item.id === 'p').tier).toBe('related')
  })

  it('names the axes rather than a quadrant when the point sits on one', () => {
    const scene = sceneFor('plotPoint', { x: 0, y: 4 })

    expect(scene.status.explanation).toContain('axis')
    expect(scene.status.explanation).not.toContain('Quadrant')
  })

  it('adds quadrant context labels only in the quadrants focus', () => {
    const plain = sceneFor('plotPoint', { x: 3, y: 2 }, { focus: 'plot' })
    const quadrants = sceneFor('plotPoint', { x: 3, y: 2 }, { focus: 'quadrants' })

    const quadrantLabels = scene => scene.points.filter(item => item.id.startsWith('quadrant-'))

    expect(quadrantLabels(plain)).toHaveLength(0)
    expect(quadrantLabels(quadrants)).toHaveLength(4)
    for (const label of quadrantLabels(quadrants)) {
      expect(label.tier).toBe('context')
    }
  })

  it('describes the actual figure state for static mode', () => {
    const preset = resolveCoordinatePlanePreset('plotPoint')
    const description = preset.describe({ x: 3, y: -2 }, { focus: 'plot' })

    expect(description).toContain('(3, −2)')
    expect(description).toContain('Quadrant IV')
  })
})

// ─── The model range and the interaction range are different things ──────────
//
// `min`/`max` is the MODEL range: everything the preset accepts as meaningful,
// which is what supplied `value` / `defaultValue` / `initialValues` pass
// through. `interactionMin`/`interactionMax` is the INTERACTION range: how far
// a learner may drive the control by dragging, stepping or Home/End.
//
// Conflating them silently corrupts static figures — a preset narrowed to ±2
// for comfortable thumb reach would drag a supplied exam figure at 6 down to
// 2, and the result still looks like a valid diagram. These tests pin the
// distinction at registry level, independent of any renderer or story.
describe('two-range clamping contract', () => {
  // `narrowed` declares a wide model range with a much narrower interaction
  // range. `wide` declares no interaction range at all, so the two clamps must
  // be indistinguishable for it.
  const fixture = {
    id: 'twoRangeFixture',
    controls: [
      {
        id: 'narrowed',
        label: 'narrowed control',
        min: -8,
        max: 8,
        interactionMin: -2,
        interactionMax: 2,
        step: 1,
      },
      {
        id: 'wide',
        label: 'un-narrowed control',
        min: -8,
        max: 8,
        step: 0.5,
      },
    ],
  }

  const narrowedControl = fixture.controls[0]
  const wideControl = fixture.controls[1]

  it('leaves a model-range value alone even when it is outside the interaction range', () => {
    // 6 is inside min/max (−8..8) but outside interactionMin/Max (−2..2).
    // A static exam figure supplied at 6 must render at 6.
    expect(clampPresetValues(fixture, { narrowed: 6 })).toEqual({ narrowed: 6 })
    expect(clampPresetValues(fixture, { narrowed: -6 })).toEqual({ narrowed: -6 })
  })

  it('clamps that same value to the interaction range for learner-driven changes', () => {
    expect(clampInteractiveValues(fixture, { narrowed: 6 })).toEqual({ narrowed: 2 })
    expect(clampInteractiveValues(fixture, { narrowed: -6 })).toEqual({ narrowed: -2 })
  })

  it('still enforces the model bound — it is a real bound, not a formality', () => {
    expect(clampPresetValues(fixture, { narrowed: 99 })).toEqual({ narrowed: 8 })
    expect(clampPresetValues(fixture, { narrowed: -99 })).toEqual({ narrowed: -8 })
  })

  it('clamps an out-of-model value all the way to the interaction bound', () => {
    expect(clampInteractiveValues(fixture, { narrowed: 99 })).toEqual({ narrowed: 2 })
    expect(clampInteractiveValues(fixture, { narrowed: -99 })).toEqual({ narrowed: -2 })
  })

  it('behaves identically under both clamps when a control does not narrow its interaction range', () => {
    for (const value of [99, -99, 8, -8, 3, 0, -3]) {
      expect(clampInteractiveValues(fixture, { wide: value }))
        .toEqual(clampPresetValues(fixture, { wide: value }))
    }

    expect(clampPresetValues(fixture, { wide: 99 })).toEqual({ wide: 8 })
    expect(clampInteractiveValues(fixture, { wide: 99 })).toEqual({ wide: 8 })
  })

  it('reports the narrowed interaction range, and falls back to min/max when not narrowed', () => {
    expect(interactionRange(narrowedControl)).toEqual({ min: -2, max: 2 })
    expect(interactionRange(wideControl)).toEqual({ min: -8, max: 8 })
  })

  it('applies the same interaction rule in single-control form', () => {
    expect(clampInteractiveValue(narrowedControl, 6)).toBe(2)
    expect(clampInteractiveValue(narrowedControl, 99)).toBe(2)
    expect(clampInteractiveValue(narrowedControl, -99)).toBe(-2)
    expect(clampInteractiveValue(narrowedControl, 1)).toBe(1)
    expect(clampInteractiveValue(wideControl, 99)).toBe(8)
  })

  it('leaves absent control values absent rather than inventing them', () => {
    for (const clamp of [clampPresetValues, clampInteractiveValues]) {
      const fromEmpty = clamp(fixture, {})
      expect(Object.hasOwn(fromEmpty, 'narrowed')).toBe(false)
      expect(Object.hasOwn(fromEmpty, 'wide')).toBe(false)

      // An explicitly undefined or null value is data the caller supplied; it
      // must not be silently replaced by a bound.
      expect(clamp(fixture, { narrowed: undefined }).narrowed).toBeUndefined()
      expect(clamp(fixture, { narrowed: null }).narrowed).toBeNull()

      // Only the named control is touched; unrelated keys survive untouched.
      expect(clamp(fixture, { wide: 2, unrelated: 'keep' }).unrelated).toBe('keep')
    }
  })

  it('snaps to the control step under both clamps', () => {
    // Model clamp snaps, then applies the model bound.
    expect(clampPresetValues(fixture, { narrowed: 6.4 })).toEqual({ narrowed: 6 })
    expect(clampPresetValues(fixture, { wide: 1.3 })).toEqual({ wide: 1.5 })

    // Interaction clamp snaps by the same step, then applies the interaction bound.
    expect(clampInteractiveValues(fixture, { narrowed: 1.6 })).toEqual({ narrowed: 2 })
    expect(clampInteractiveValues(fixture, { narrowed: -1.6 })).toEqual({ narrowed: -2 })
    expect(clampInteractiveValues(fixture, { wide: 1.3 })).toEqual({ wide: 1.5 })
    expect(clampInteractiveValue(wideControl, -1.3)).toBe(-1.5)
  })
})

describe('midpoint preset', () => {
  it('averages each coordinate and reports the midpoint', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })

    expect(scene.status.heading).toBe('(1, 3)')
  })

  it('pairs the x-values and the y-values separately in the calculation', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })

    expect(scene.status.calculation[0]).toBe('x: (−3 + 5) ÷ 2 = 1')
    expect(scene.status.calculation[1]).toBe('y: (1 + 5) ÷ 2 = 3')
  })

  // A zero-length dashed path renders as a stray dot on the axis rather than
  // as meaning, so each bracket is filtered independently.
  it('omits only bracket-y when the two y-values are equal', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 4, bx: 5, by: 4 })
    const brackets = scene.shapes.filter(shape => shape.id.startsWith('bracket-'))

    expect(brackets.map(shape => shape.id)).toEqual(['bracket-x'])
    // The average of the two equal values is still stated.
    expect(scene.status.calculation[1]).toBe('y: (4 + 4) ÷ 2 = 4')
    expect(scene.status.heading).toBe('(1, 4)')
  })

  it('omits only bracket-x when the two x-values are equal', () => {
    const scene = sceneFor('midpoint', { ax: 2, ay: -3, bx: 2, by: 5 })
    const brackets = scene.shapes.filter(shape => shape.id.startsWith('bracket-'))

    expect(brackets.map(shape => shape.id)).toEqual(['bracket-y'])
    expect(scene.status.calculation[0]).toBe('x: (2 + 2) ÷ 2 = 2')
    expect(scene.status.heading).toBe('(2, 1)')
  })

  it('omits both brackets when the endpoints coincide, keeping the averages', () => {
    const scene = sceneFor('midpoint', { ax: 2, ay: 4, bx: 2, by: 4 })

    expect(scene.shapes.filter(shape => shape.id.startsWith('bracket-'))).toHaveLength(0)
    expect(scene.status.calculation).toEqual([
      'x: (2 + 2) ÷ 2 = 2',
      'y: (4 + 4) ÷ 2 = 4',
    ])
  })

  it('draws one bracket per pairing, not one per point', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })
    const brackets = scene.shapes.filter(shape => shape.id.startsWith('bracket-'))

    expect(brackets.map(shape => shape.id).sort()).toEqual(['bracket-x', 'bracket-y'])
  })

  it('marks both endpoints and the midpoint, with only one active', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 }, { activeId: 'a' })
    const active = scene.points.filter(point => point.tier === 'active')

    expect(scene.points.map(point => point.id).sort()).toEqual(['a', 'b', 'm'])
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('a')
  })

  it('handles a half-value midpoint', () => {
    const scene = sceneFor('midpoint', { ax: 0, ay: 0, bx: 3, by: 5 })

    expect(scene.status.heading).toBe('(1.5, 2.5)')
  })
})

describe('straightLine preset', () => {
  it('states the equation as the heading', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    expect(scene.status.heading).toBe('y = 2x + 1')
  })

  it('writes a negative intercept as subtraction', () => {
    const scene = sceneFor('straightLine', { m: 3, c: -4 })
    expect(scene.status.heading).toBe('y = 3x − 4')
  })

  it('omits the intercept term when c is zero', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 0 })
    expect(scene.status.heading).toBe('y = 2x')
  })

  // GCSE writes a horizontal line as y = 2, never y = 0x + 2 — and this is the
  // exact case the perpendicular refusal builds its lesson on.
  it('writes a horizontal line without an x term', () => {
    expect(sceneFor('straightLine', { m: 0, c: 2 }).status.heading).toBe('y = 2')
    expect(sceneFor('straightLine', { m: 0, c: -3 }).status.heading).toBe('y = −3')
    expect(sceneFor('straightLine', { m: 0, c: 0 }).status.heading).toBe('y = 0')
  })

  it('explains the gradient as rise over run', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    expect(scene.status.calculation.join(' ')).toContain('rise ÷ run = 2 ÷ 1 = 2')
  })

  it('marks the y-intercept as a point', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    const intercept = scene.points.find(point => point.id === 'y-intercept')

    expect(intercept).toBeDefined()
    expect(intercept.x).toBe(0)
    expect(intercept.y).toBe(1)
  })

  it('hides the x-intercept unless it is explicitly asked for', () => {
    const withoutFlag = sceneFor('straightLine', { m: 2, c: 4 })
    const withFlag = sceneFor('straightLine', { m: 2, c: 4 }, {
      capabilities: { showXIntercept: true },
    })

    expect(withoutFlag.points.find(p => p.id === 'x-intercept')).toBeUndefined()
    expect(withFlag.points.find(p => p.id === 'x-intercept').x).toBe(-2)
  })

  it('draws a rise/run triangle for the gradient focus', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 }, { focus: 'gradient' })
    expect(scene.shapes.find(shape => shape.id === 'rise-run')).toBeDefined()
  })
})

describe('straightLine comparison', () => {
  const compare = (values, comparisonRule, capabilities) =>
    sceneFor('straightLine', values, { focus: 'compare', comparisonRule, capabilities })

  it('draws a second line in the compare focus', () => {
    const scene = compare({ m: 2, c: 1, m2: 2, c2: -3 }, 'parallel')
    expect(scene.shapes.find(shape => shape.id === 'line-2')).toBeDefined()
  })

  it('forces equal gradients and equal rise/run triangles for parallel', () => {
    const scene = compare({ m: 2, c: 1, m2: 5, c2: -3 }, 'parallel')

    expect(scene.status.explanation).toContain('same gradient')
    expect(scene.shapes.filter(shape => shape.id.startsWith('rise-run'))).toHaveLength(2)
  })

  it('keeps parallel intercepts independent rather than mirrored', () => {
    const scene = compare({ m: 2, c: 1, m2: 2, c2: -3 }, 'parallel')
    const intercepts = scene.points
      .filter(point => point.id.startsWith('y-intercept'))
      .map(point => point.y)

    expect(intercepts).toEqual([1, -3])
  })

  it('sets the second gradient to the negative reciprocal for perpendicular', () => {
    const scene = compare(
      { m: 2, c: 1, m2: 9, c2: 0 },
      'perpendicular',
      { perpendicularGradients: true },
    )

    expect(scene.status.calculation.join(' ')).toContain('−1 ÷ 2')
    expect(scene.status.explanation).toContain('negative reciprocal')
  })

  it('falls back to parallel when perpendicular is not available at this tier', () => {
    const scene = compare({ m: 2, c: 1, m2: 9, c2: 0 }, 'perpendicular', {
      perpendicularGradients: false,
    })

    expect(scene.status.explanation).toContain('same gradient')
  })

  it('leaves both lines free in the free comparison rule', () => {
    const scene = compare({ m: 2, c: 1, m2: 5, c2: -3 }, 'free')
    expect(scene.status.heading).toContain('y = 5x')
  })

  // A horizontal line's perpendicular is vertical, which y = mx + c cannot
  // express. Drawing a second horizontal line here would teach the opposite.
  it('refuses to fake a perpendicular for a horizontal line', () => {
    const scene = compare({ m: 0, c: 2, m2: 9, c2: 0 }, 'perpendicular', {
      perpendicularGradients: true,
    })

    expect(scene.shapes.find(shape => shape.id === 'line-2')).toBeUndefined()
    expect(scene.status.explanation).toContain('vertical')
    expect(scene.status.explanation).toContain('cannot be written as y = mx + c')
  })
})

describe('straightLine stays inside the plot', () => {
  it('clips a steep line at the y bounds rather than drawing past them', () => {
    // y = 2x + 1 across x = −5…5 reaches y = ±11 on a y-axis of ±5.
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    const line = scene.shapes.find(shape => shape.id === 'line-1')
    const coordinates = line.path.match(/-?[\d.]+/g).map(Number)

    for (let index = 1; index < coordinates.length; index += 2) {
      expect(Math.abs(coordinates[index])).toBeLessThanOrEqual(5)
    }
  })

  // The triangle is relocated rather than clipped: a partial rise/run triangle
  // misrepresents the ratio it exists to demonstrate.
  it('keeps the whole rise/run triangle inside both axis ranges at every extreme', () => {
    const preset = resolveCoordinatePlanePreset('straightLine')
    const axes = { x: preset.xAxis, y: preset.yAxis }

    for (const m of [-5, -3, -1, 0, 1, 3, 5]) {
      for (const c of [-5, -3, 0, 3, 5]) {
        const scene = sceneFor('straightLine', { m, c }, { focus: 'gradient' })
        const triangle = scene.shapes.find(shape => shape.id === 'rise-run')

        expect(triangle, `m=${m} c=${c} has no rise/run triangle`).toBeDefined()

        const numbers = triangle.path.match(/-?[\d.]+/g).map(Number)
        for (let index = 0; index < numbers.length; index += 2) {
          const [x, y] = [numbers[index], numbers[index + 1]]
          expect(x, `m=${m} c=${c} triangle x`).toBeGreaterThanOrEqual(axes.x.min)
          expect(x, `m=${m} c=${c} triangle x`).toBeLessThanOrEqual(axes.x.max)
          expect(y, `m=${m} c=${c} triangle y`).toBeGreaterThanOrEqual(axes.y.min)
          expect(y, `m=${m} c=${c} triangle y`).toBeLessThanOrEqual(axes.y.max)
        }
      }
    }
  })

  it('anchors the triangle as close to the y-axis as it can fit', () => {
    // y = 5x + 5 leaves the plot above x = -1, so the triangle cannot sit at 0.
    const steep = sceneFor('straightLine', { m: 5, c: 5 }, { focus: 'gradient' })
    expect(steep.shapes.find(shape => shape.id === 'rise-run').path)
      .toBe('M -1 0 L 0 0 L 0 5')

    // A gentle line fits at the y-axis itself.
    const gentle = sceneFor('straightLine', { m: 1, c: 0 }, { focus: 'gradient' })
    expect(gentle.shapes.find(shape => shape.id === 'rise-run').path)
      .toBe('M 0 0 L 1 0 L 1 1')
  })

  it('anchors each compared line independently', () => {
    const scene = sceneFor('straightLine', { m: 5, c: 5, m2: 5, c2: -5 }, {
      focus: 'compare',
      comparisonRule: 'parallel',
    })
    const first = scene.shapes.find(shape => shape.id === 'rise-run')
    const second = scene.shapes.find(shape => shape.id === 'rise-run-2')

    expect(first).toBeDefined()
    expect(second).toBeDefined()
    // Same gradient, so equal triangles — at whichever position each line fits.
    expect(first.path).not.toBe(second.path)
  })

  it('drops a line that misses the plot entirely', () => {
    const preset = resolveCoordinatePlanePreset('straightLine')
    const scene = preset.derive({ m: 0, c: 40 }, {
      focus: 'gradient',
      showGuides: 'active',
      capabilities: preset.capabilities,
      axes: { x: preset.xAxis, y: preset.yAxis },
    })

    expect(scene.shapes.find(shape => shape.id === 'line-1')).toBeUndefined()
  })
})

describe('tableOfValues preset', () => {
  const at = step => sceneFor('tableOfValues', { m: 2, c: 1, step }, {})

  // Check EVERY row, not just the first. The original version of this test
  // checked only x = −2, which was the one value the bracketing bug did not
  // corrupt — rows 2 to 5 read "y = 20 + 1 = 1", "y = 21 + 1 = 3" and so on.
  it('shows a correct substitution for every row', () => {
    expect(at(0).status.calculation[0]).toBe('x = −2 → y = 2(−2) + 1 = −3')
    expect(at(1).status.calculation[0]).toBe('x = −1 → y = 2(−1) + 1 = −1')
    expect(at(2).status.calculation[0]).toBe('x = 0 → y = 2(0) + 1 = 1')
    expect(at(3).status.calculation[0]).toBe('x = 1 → y = 2(1) + 1 = 3')
    expect(at(4).status.calculation[0]).toBe('x = 2 → y = 2(2) + 1 = 5')
    expect(at(5).status.calculation[0]).toBe('x = 3 → y = 2(3) + 1 = 7')
  })

  it('writes negative coefficients and intercepts correctly', () => {
    const preset = resolveCoordinatePlanePreset('tableOfValues')
    const line = preset.derive({ m: -3, c: -4, step: 0 }, { showGuides: 'active' })

    expect(line.status.calculation[0]).toBe('x = −2 → y = −3(−2) − 4 = 2')
  })

  it('plots no line from a single point', () => {
    const scene = at(0)

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(1)
    expect(scene.shapes.find(shape => shape.id === 'line')).toBeUndefined()
  })

  it('draws a provisional dashed line once two points exist', () => {
    const scene = at(1)
    const line = scene.shapes.find(shape => shape.id === 'line')

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(2)
    expect(line).toBeDefined()
    expect(line.dashed).toBe(true)
  })

  it('makes the line solid once a third point confirms the rule', () => {
    const scene = at(2)
    const line = scene.shapes.find(shape => shape.id === 'line')

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(3)
    expect(line.dashed).toBe(false)
  })

  it('keeps the line solid for every later step', () => {
    expect(at(4).shapes.find(shape => shape.id === 'line').dashed).toBe(false)
  })

  it('names each transition so the change reads as confirmation', () => {
    expect(at(0).status.explanation).toContain('One point')
    expect(at(1).status.explanation).toContain('Two points')
    expect(at(2).status.explanation).toContain('confirms')
  })

  it('accumulates completed pairs as a trail', () => {
    const scene = at(3)
    expect(scene.trail.map(item => item.text)).toEqual([
      '(−2, −3)',
      '(−1, −1)',
      '(0, 1)',
      '(1, 3)',
    ])
  })

  it('marks only the newest point active and the rest related', () => {
    const scene = at(2)
    const plotted = scene.points.filter(point => point.id.startsWith('plotted-'))

    expect(plotted.filter(point => point.tier === 'active')).toHaveLength(1)
    expect(plotted.at(-1).tier).toBe('active')
  })
})

describe('intersection preset', () => {
  it('reports the meeting point as the heading', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })
    expect(scene.status.heading).toBe('(2, 5)')
  })

  it('substitutes the solution into both equations', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })

    expect(scene.status.calculation[0]).toBe('y = x + 3  →  5 = 2 + 3 ✓')
    expect(scene.status.calculation[1]).toBe('y = −x + 7  →  5 = −2 + 7 ✓')
  })

  it('names the coordinate as the pair satisfying both equations', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })

    expect(scene.status.explanation)
      .toBe('x = 2 and y = 5 is the only pair that satisfies both equations.')
  })

  // Enumerate EVERY reachable pair, not the four corners. The interior is not
  // safe just because the corners are: the solution moves diagonally as the
  // two intercepts change, so corner-only checking misses whole regions.
  it('keeps every reachable one-solution point inside both axes', () => {
    const preset = resolveCoordinatePlanePreset('intersection')
    const c1Control = preset.controls.find(control => control.id === 'c1')
    const c2Control = preset.controls.find(control => control.id === 'c2')
    const axes = { x: preset.xAxis, y: preset.yAxis }
    let checked = 0

    for (let c1 = c1Control.min; c1 <= c1Control.max; c1 += c1Control.step) {
      for (let c2 = c2Control.min; c2 <= c2Control.max; c2 += c2Control.step) {
        const scene = preset.derive(
          { m1: 1, c1, m2: -1, c2 },
          { showGuides: 'active', capabilities: {}, axes, grid: preset.grid },
        )
        const solution = scene.points.find(point => point.id === 'solution')
        if (!solution) continue

        checked += 1
        expect(solution.x, `c1=${c1} c2=${c2} solution x`).toBeGreaterThanOrEqual(axes.x.min)
        expect(solution.x, `c1=${c1} c2=${c2} solution x`).toBeLessThanOrEqual(axes.x.max)
        expect(solution.y, `c1=${c1} c2=${c2} solution y`).toBeGreaterThanOrEqual(axes.y.min)
        expect(solution.y, `c1=${c1} c2=${c2} solution y`).toBeLessThanOrEqual(axes.y.max)
      }
    }

    expect(checked).toBe(88)
  })

  it('marks the solution point as active', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })
    const solution = scene.points.find(point => point.id === 'solution')

    expect(solution.tier).toBe('active')
    expect(solution.role).toBe('solution')
  })

  it('reports parallel lines as having no solution', () => {
    const scene = sceneFor('intersection', { m1: 2, c1: 1, m2: 2, c2: 5 })

    expect(scene.status.heading).toBe('No solution')
    expect(scene.status.explanation).toContain('never meet')
    expect(scene.points.find(point => point.id === 'solution')).toBeUndefined()
  })

  // Equal gradients alone are not "no solution" — same gradient AND same
  // intercept is one line, and every point on it satisfies both equations.
  it('reports coincident lines as having infinitely many solutions', () => {
    const scene = sceneFor('intersection', { m1: 2, c1: 1, m2: 2, c2: 1 })

    expect(scene.status.heading).toBe('Infinitely many solutions')
    expect(scene.status.explanation).toContain('same line')
    expect(scene.points.find(point => point.id === 'solution')).toBeUndefined()
  })
})

describe('transformation option state', () => {
  it('reads option selections from values, so static figures can set them', () => {
    const scene = sceneFor('reflect', { mirrorValue: 2, mirror: 'yEqualsX' })
    const imageA = scene.points.find(point => point.id === 'image-a')

    // A(−1, 3) reflected in y = x is (3, −1).
    expect(imageA).toMatchObject({ x: 3, y: -1 })
    expect(scene.status.heading).toContain('y = x')
  })

  it('selects a non-default rotation entirely from values', () => {
    const scene = sceneFor('rotate', { cx: 0, cy: 0, angle: '180', direction: 'anticlockwise' })
    expect(scene.points.find(point => point.id === 'image-a')).toMatchObject({ x: 1, y: -3 })
    expect(scene.status.heading).toContain('180°')
  })

  it('keeps the default enlargement at 2 when negatives are enabled', () => {
    const preset = resolveCoordinatePlanePreset('enlarge')
    const capabilities = mergeCapabilities(preset, { negativeScaleFactor: true })

    expect(resolveOptionValues(preset, preset.initialValues, capabilities).scaleFactor)
      .toBe('2')
  })

  it('falls back to a valid option when a capability removes the stored one', () => {
    const preset = resolveCoordinatePlanePreset('reflect')
    const values = { mirrorValue: 0, mirror: 'yEqualsX' }
    const capabilities = mergeCapabilities(preset, { diagonalMirrorLines: false })

    expect(resolveOptionValues(preset, values, capabilities).mirror).toBe('vertical')
  })
})

describe('transformation stepper relevance', () => {
  it('hides the mirror position for diagonal mirror lines', () => {
    const preset = resolveCoordinatePlanePreset('reflect')
    const ids = (mirror) => preset
      .resolveSteppers({ mirrorValue: 0, mirror }, mergeCapabilities(preset, {}))
      .map(item => item.controlId)

    expect(ids('vertical')).toEqual(['mirrorValue'])
    expect(ids('horizontal')).toEqual(['mirrorValue'])
    expect(ids('yEqualsX')).toEqual([])
    expect(ids('yEqualsNegativeX')).toEqual([])
  })

  it('hides centre steppers when the centre cannot leave the origin', () => {
    for (const id of ['rotate', 'enlarge']) {
      const preset = resolveCoordinatePlanePreset(id)
      const off = preset.resolveSteppers(preset.initialValues,
        mergeCapabilities(preset, { nonOriginCentre: false }))
      const on = preset.resolveSteppers(preset.initialValues,
        mergeCapabilities(preset, { nonOriginCentre: true }))

      expect(off, `${id} with a fixed centre`).toEqual([])
      expect(on.map(item => item.controlId)).toEqual(['cx', 'cy'])
    }
  })
})

describe('transformation vertex pairing', () => {
  it('resolves an image vertex to its own pair, not to A', () => {
    const object = sceneFor('translate', { dx: 3, dy: 2, }, { activeId: 'b' })
    const image = sceneFor('translate', { dx: 3, dy: 2 }, { activeId: 'image-b' })

    expect(object.status.calculation[0]).toContain('B')
    expect(image.status.calculation[0]).toContain('B')
    expect(image.status.calculation[0]).toBe(object.status.calculation[0])
  })

  it('emits an active guide when an image vertex is selected', () => {
    const scene = sceneFor('translate', { dx: 3, dy: 2 }, { activeId: 'image-c' })

    expect(scene.guides.length).toBeGreaterThan(0)
    expect(scene.points.filter(point => point.tier === 'active')).toHaveLength(1)
    expect(scene.points.find(point => point.tier === 'active').id).toBe('image-c')
  })
})

describe('transformation rule geometry', () => {
  it('draws rotation guides from the centre, not vertex to image', () => {
    const scene = sceneFor('rotate',
      { cx: 1, cy: 1, angle: '90', direction: 'clockwise' },
      { activeId: 'a', capabilities: { nonOriginCentre: true } })

    // Two radii about the centre, not one chord.
    expect(scene.guides).toHaveLength(2)
    for (const guide of scene.guides) {
      expect(guide.from).toEqual({ x: 1, y: 1 })
    }
  })

  it('points the enlargement ray at whichever end is further from the centre', () => {
    const grow = sceneFor('enlarge', { cx: 0, cy: 0, scaleFactor: '3' },
      { capabilities: { fractionalScaleFactor: true, negativeScaleFactor: true } })
    const shrink = sceneFor('enlarge', { cx: 0, cy: 0, scaleFactor: '0.25' },
      { capabilities: { fractionalScaleFactor: true, negativeScaleFactor: true } })
    const flip = sceneFor('enlarge', { cx: 0, cy: 0, scaleFactor: '-2' },
      { capabilities: { fractionalScaleFactor: true, negativeScaleFactor: true } })

    const rayFor = scene => scene.shapes.find(shape => shape.id === 'ray-a')

    // Growing: centre out to the image.
    expect(rayFor(grow).path).toBe('M 0 0 L -3 6')
    // Shrinking: centre out to the original, which is now the far end.
    expect(rayFor(shrink).path).toBe('M 0 0 L -1 2')
    // Negative: original through the centre to the image.
    expect(rayFor(flip).path).toBe('M -1 2 L 2 -4')
  })

  it('offers a quarter scale factor when fractional factors are enabled', () => {
    const preset = resolveCoordinatePlanePreset('enlarge')
    const ids = capabilities => preset
      .resolveOptions(mergeCapabilities(preset, capabilities))
      .find(group => group.id === 'scaleFactor')
      .choices.map(choice => choice.id)

    expect(ids({})).toEqual(['2', '3'])
    expect(ids({ fractionalScaleFactor: true })).toEqual(['0.25', '0.5', '2', '3'])
    expect(ids({ fractionalScaleFactor: true, negativeScaleFactor: true }))
      .toEqual(['-2', '-1', '0.25', '0.5', '2', '3'])
  })

  it('names the centre in rotation and enlargement descriptions', () => {
    const rotate = resolveCoordinatePlanePreset('rotate')
      .describe({ cx: 1, cy: -1, angle: '90', direction: 'clockwise' },
        { capabilities: { nonOriginCentre: true }, choices: { angle: '90', direction: 'clockwise' } })
    const enlarge = resolveCoordinatePlanePreset('enlarge')
      .describe({ cx: 1, cy: 1, scaleFactor: '2' },
        { capabilities: { nonOriginCentre: true }, choices: { scaleFactor: '2' } })

    expect(rotate).toContain('(1, −1)')
    expect(enlarge).toContain('(1, 1)')
  })
})

describe('transformation coverage', () => {
  it('translates with positive, negative and zero components', () => {
    expect(sceneFor('translate', { dx: 3, dy: 2 })
      .points.find(p => p.id === 'image-a')).toMatchObject({ x: 2, y: 5 })
    expect(sceneFor('translate', { dx: -3, dy: -2 })
      .points.find(p => p.id === 'image-a')).toMatchObject({ x: -4, y: 1 })
    expect(sceneFor('translate', { dx: 0, dy: 0 })
      .points.find(p => p.id === 'image-a')).toMatchObject({ x: -1, y: 3 })
  })

  it('reflects in all four mirror lines', () => {
    const at = mirror => sceneFor('reflect', { mirrorValue: 2, mirror })
      .points.find(p => p.id === 'image-a')

    expect(at('vertical')).toMatchObject({ x: 5, y: 3 })
    expect(at('horizontal')).toMatchObject({ x: -1, y: 1 })
    expect(at('yEqualsX')).toMatchObject({ x: 3, y: -1 })
    expect(at('yEqualsNegativeX')).toMatchObject({ x: -3, y: 1 })
  })

  it('rotates through every angle in both directions', () => {
    const at = (angle, direction) => sceneFor('rotate',
      { cx: 0, cy: 0, angle, direction }).points.find(p => p.id === 'image-a')

    expect(at('90', 'clockwise')).toMatchObject({ x: 3, y: 1 })
    expect(at('90', 'anticlockwise')).toMatchObject({ x: -3, y: -1 })
    expect(at('180', 'clockwise')).toMatchObject({ x: 1, y: -3 })
    expect(at('180', 'anticlockwise')).toMatchObject({ x: 1, y: -3 })
    expect(at('270', 'clockwise')).toMatchObject({ x: -3, y: -1 })
    expect(at('270', 'anticlockwise')).toMatchObject({ x: 3, y: 1 })
  })

  it('enlarges by every offered scale factor', () => {
    const caps = { fractionalScaleFactor: true, negativeScaleFactor: true }
    const at = scaleFactor => sceneFor('enlarge',
      { cx: 0, cy: 0, scaleFactor }, { capabilities: caps })
      .points.find(p => p.id === 'image-a')

    expect(at('0.25')).toMatchObject({ x: -0.25, y: 0.5 })
    expect(at('0.5')).toMatchObject({ x: -0.5, y: 1 })
    expect(at('2')).toMatchObject({ x: -2, y: 4 })
    expect(at('3')).toMatchObject({ x: -3, y: 6 })
    expect(at('-1')).toMatchObject({ x: 1, y: -2 })
    expect(at('-2')).toMatchObject({ x: 2, y: -4 })
  })

  it('refuses the broader annotation policy across the family', () => {
    for (const id of ['translate', 'reflect', 'rotate', 'enlarge']) {
      expect(resolveCoordinatePlanePreset(id).supportsShowAllGuides).toBe(false)
    }
  })
})
