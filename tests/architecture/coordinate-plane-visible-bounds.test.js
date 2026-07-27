import { describe, expect, it } from 'vitest'
import { COORDINATE_PLANE_PRESETS, resolvePresetFocus }
  from '../../src/components/learning/coordinatePlane/presets/index.js'
import {
  effectiveStates,
  parseModelPathCoordinates,
} from '../support/coordinatePlaneStateSpace.js'

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'visible bounds: %s',
  (presetId, preset) => {
    it('keeps the whole figure inside the axes in every reachable state', () => {
      const axes = { x: preset.xAxis, y: preset.yAxis }
      const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]
      const violations = []
      let states = 0

      const inside = (point, what, label) => {
        if (point.x < axes.x.min || point.x > axes.x.max
          || point.y < axes.y.min || point.y > axes.y.max) {
          violations.push(`${label} ${what} at (${point.x}, ${point.y})`)
        }
      }

      for (const state of effectiveStates(preset)) {
        for (const focus of focusModes) {
          states += 1
          const scene = preset.derive(state.effectiveValues, {
            focus: resolvePresetFocus(preset, focus),
            activeId: preset.defaultActiveId,
            showGuides: 'active',
            capabilities: state.capabilities,
            choices: state.choices,
            axes,
            grid: preset.grid,
          })
          const label = `${state.label} focus=${focus}`

          for (const point of scene.points) {
            expect(
              Number.isFinite(point.x) && Number.isFinite(point.y),
              `${label} point ${point.id} is not finite`,
            ).toBe(true)
            inside(point, `point ${point.id}`, label)
          }

          // Model paths are strings, so a malformed one would otherwise have
          // its bad pair silently dropped by a bare numeric scrape and pass as
          // "inside". parseModelPathCoordinates throws instead.
          for (const shape of (scene.shapes ?? []).filter(item => item.modelPath)) {
            const points = parseModelPathCoordinates(shape.path, `${label} shape ${shape.id}`)
            for (const point of points) inside(point, `shape ${shape.id}`, label)
          }

          for (const guide of scene.guides ?? []) {
            for (const end of [guide.from, guide.to]) {
              expect(
                Number.isFinite(end.x) && Number.isFinite(end.y),
                `${label} guide ${guide.id} has a non-finite end`,
              ).toBe(true)
              inside(end, `guide ${guide.id}`, label)
            }
          }
        }
      }

      expect(states, `${presetId} swept no states`).toBeGreaterThan(0)
      expect(violations).toEqual([])
    })
  },
)
