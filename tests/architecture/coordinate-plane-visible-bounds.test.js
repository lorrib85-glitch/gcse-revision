import { describe, expect, it } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  mergeCapabilities,
  resolveEffectiveValues,
  resolveOptionValues,
  resolvePresetFocus,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

const CAPABILITY_SETS = [
  {},
  { diagonalMirrorLines: true, nonOriginCentre: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true },
  { perpendicularGradients: true, showXIntercept: true },
]

// The Cartesian product of every control boundary and the initial value.
//
// One-control-at-a-time plus all-min and all-max is not enough. A rotation
// about (−2, 2) is not covered by either all-min or all-max, and mixed centre
// coordinates are exactly where transformations reach furthest. Combining the
// boundaries properly is the only way to see those states.
//
// Deliberately uses the MODEL range (control.min / control.max), not the
// interaction range: static and controlled content may supply anything the
// model accepts, so that is the range which must stay visible. Narrowing this
// to the interaction range would leave supplied exam figures unchecked.
function controlValueSets(preset) {
  const base = clampPresetValues(preset, preset.initialValues)
  let sets = [base]

  for (const control of preset.controls ?? []) {
    const corners = [control.min, control.max, base[control.id]]
    sets = sets.flatMap(values => corners.map(corner => ({
      ...values,
      [control.id]: corner,
    })))
  }
  return sets.map(values => clampPresetValues(preset, values))
}

// Every reachable combination of option choices, found by walking outward from
// the base state.
//
// A single `resolveOptions(capabilities)` call cannot describe this any more.
// Groups now resolve from the values too: rotation offers `direction` at 90°
// and 270° and withdraws it at 180°, so the set of groups changes as you move
// through the set of choices. Enumerating once against the initial values would
// miss every state behind a group that only appears later — and would invent
// states behind a group that has since disappeared.
//
// So: breadth-first from the base values, re-asking the preset which groups
// exist at each state, until nothing new turns up.
function reachableOptionStates(preset, baseValues, capabilities) {
  const seen = new Map()
  const queue = [baseValues]

  while (queue.length > 0) {
    const values = queue.shift()
    const choices = resolveOptionValues(preset, values, capabilities)
    const key = JSON.stringify(choices)
    if (seen.has(key)) continue
    seen.set(key, choices)

    const groups = preset.resolveOptions?.(capabilities, values) ?? preset.options ?? []
    for (const group of groups) {
      for (const choice of group.choices) {
        queue.push({ ...values, ...choices, [group.id]: choice.id })
      }
    }
  }
  return [...seen.values()]
}

function pathCoordinates(path) {
  const numbers = path.match(/-?[\d.]+/g)?.map(Number) ?? []
  const points = []
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push({ x: numbers[index], y: numbers[index + 1] })
  }
  return points
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'visible bounds: %s',
  (presetId, preset) => {
    it('keeps the whole figure inside the axes at every reachable value', () => {
      const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]

      for (const focus of focusModes) {
        for (const caps of CAPABILITY_SETS) {
          const capabilities = mergeCapabilities(preset, caps)

          for (const numericValues of controlValueSets(preset)) {
            for (const optionValues of reachableOptionStates(preset, numericValues, capabilities)) {
            const axes = { x: preset.xAxis, y: preset.yAxis }

            // Derive from EFFECTIVE state, exactly as the renderer does.
            // Passing raw values with separately generated choices tests a
            // combination the component can never actually be in — and would
            // miss a capability that pins a value, since the pinned figure is
            // the only one a learner ever sees.
            const supplied = { ...numericValues, ...optionValues }
            const effectiveValues = resolveEffectiveValues(preset, supplied, capabilities)
            const choices = resolveOptionValues(preset, effectiveValues, capabilities)

            const scene = preset.derive(effectiveValues, {
              focus: resolvePresetFocus(preset, focus),
              activeId: preset.defaultActiveId,
              showGuides: 'active',
              capabilities,
              choices,
              axes,
              grid: preset.grid,
            })

            const label = `${presetId} focus=${focus} values=${JSON.stringify(effectiveValues)} choices=${JSON.stringify(choices)}`

            for (const point of scene.points) {
              expect(point.x, `${label} point ${point.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
              expect(point.x, `${label} point ${point.id}.x`).toBeLessThanOrEqual(axes.x.max)
              expect(point.y, `${label} point ${point.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
              expect(point.y, `${label} point ${point.id}.y`).toBeLessThanOrEqual(axes.y.max)
            }

            // Model-space paths must already be clipped; the SVG clip path is
            // a safety net, not the mechanism.
            for (const shape of scene.shapes.filter(item => item.modelPath)) {
              for (const point of pathCoordinates(shape.path)) {
                expect(point.x, `${label} shape ${shape.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
                expect(point.x, `${label} shape ${shape.id}.x`).toBeLessThanOrEqual(axes.x.max)
                expect(point.y, `${label} shape ${shape.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
                expect(point.y, `${label} shape ${shape.id}.y`).toBeLessThanOrEqual(axes.y.max)
              }
            }

            for (const guide of scene.guides ?? []) {
              for (const point of [guide.from, guide.to]) {
                expect(point.x, `${label} guide ${guide.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
                expect(point.x, `${label} guide ${guide.id}.x`).toBeLessThanOrEqual(axes.x.max)
                expect(point.y, `${label} guide ${guide.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
                expect(point.y, `${label} guide ${guide.id}.y`).toBeLessThanOrEqual(axes.y.max)
              }
            }
            }
          }
        }
      }
    })
  },
)
