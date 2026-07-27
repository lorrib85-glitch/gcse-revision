import { describe, expect, it } from 'vitest'
import { COORDINATE_PLANE_PRESETS, resolvePresetFocus, resolveShowGuides }
  from '../../src/components/learning/coordinatePlane/presets/index.js'
import { effectiveStates } from '../support/coordinatePlaneStateSpace.js'

const TIERS = ['active', 'related', 'context']
const SHOW_GUIDES = ['active', 'all', 'none']

const COMPARISON_RULES = [undefined, 'parallel', 'perpendicular', 'free']

/**
 * Every state a learner can actually reach.
 *
 * Uses the SHARED state space, not just `initialValues`. The annotation
 * contract has to see numeric corners and dynamic option states too: different
 * `tableOfValues` stages annotate different points, transformation annotations
 * depend on the selected option, and any future preset whose tiers vary at a
 * control boundary would otherwise go unchecked.
 */
function reachableStates(preset) {
  const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]
  const states = []

  for (const state of effectiveStates(preset)) {
    for (const focus of focusModes) {
      for (const comparisonRule of COMPARISON_RULES) {
        for (const requested of SHOW_GUIDES) {
          const showGuides = resolveShowGuides(preset, requested)
          const context = {
            focus: resolvePresetFocus(preset, focus),
            comparisonRule,
            activeId: preset.defaultActiveId,
            showGuides,
            capabilities: state.capabilities,
            choices: state.choices,
            axes: { x: preset.xAxis, y: preset.yAxis },
            grid: preset.grid,
          }

          const scene = preset.derive(state.effectiveValues, context)
          states.push({ context, scene, requested })

          // And each focusable point selected in turn.
          for (const point of scene.points.filter(item => item.focusable)) {
            const moved = { ...context, activeId: point.id }
            states.push({
              context: moved,
              scene: preset.derive(state.effectiveValues, moved),
              requested,
            })
          }
        }
      }
    }
  }
  return states
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'annotation contract: %s',
  (presetId, preset) => {
    const states = reachableStates(preset)

    it('reaches at least one state', () => {
      expect(states.length).toBeGreaterThan(0)
    })

    it('declares a tier on every annotated element', () => {
      for (const { scene } of states) {
        for (const point of scene.points) {
          expect(
            point.tier,
            `${presetId} point "${point.id}" carries annotation without a tier`,
          ).toBeDefined()
        }
      }
    })

    it('uses only the three permitted tiers', () => {
      for (const { scene } of states) {
        for (const point of scene.points) {
          expect(TIERS, `${presetId} point "${point.id}"`).toContain(point.tier)
        }
      }
    })

    it('keeps exactly one element active under the default policy', () => {
      const defaults = states.filter(state => state.context.showGuides === 'active')

      for (const { scene, context } of defaults) {
        const active = scene.points.filter(point => point.tier === 'active')

        // Key off ANNOTATABLE points, not focusable ones.
        //
        // Focusability is a keyboard affordance, not a claim about teaching
        // content. Three presets — straightLine, tableOfValues and intersection
        // — annotate a point that is deliberately not focusable, so keying off
        // focusability would allow zero active elements for exactly the presets
        // this contract most needs to guard: a mutation stripping every active
        // tier from tableOfValues would sail through.
        //
        // Genuine no-point states stay legal: parallel and coincident
        // intersections have no solution point at all, so nothing to annotate.
        const hasAnnotatablePoint = scene.points.some(point => point.tier !== 'context')

        expect(
          active,
          `${presetId} has ${active.length} active elements with activeId="${context.activeId}"`,
        ).toHaveLength(hasAnnotatablePoint ? 1 : 0)
      }
    })

    it('marks nothing active when guides are switched off', () => {
      for (const { scene } of states.filter(state => state.context.showGuides === 'none')) {
        const active = scene.points.filter(point => point.tier === 'active')

        expect(
          active.map(point => point.id),
          `${presetId} still marks points active under showGuides="none"`,
        ).toEqual([])
      }
    })

    it('emits guides only when something is active', () => {
      for (const { scene } of states) {
        if ((scene.guides ?? []).length === 0) continue
        const active = scene.points.filter(point => point.tier === 'active')

        expect(
          active.length,
          `${presetId} emits guides with no active element`,
        ).toBeGreaterThan(0)
      }
    })

    it('emits no guides at all when guides are switched off', () => {
      for (const { scene } of states.filter(s => s.context.showGuides === 'none')) {
        expect(scene.guides ?? []).toEqual([])
      }
    })

    it('only exceeds one active element under an explicit broader policy', () => {
      for (const { scene, context } of states) {
        const active = scene.points.filter(point => point.tier === 'active')
        if (active.length <= 1) continue

        expect(
          context.showGuides,
          `${presetId} has ${active.length} active elements outside showGuides="all"`,
        ).toBe('all')
        expect(
          preset.supportsShowAllGuides,
          `${presetId} reached showGuides="all" without declaring support`,
        ).toBe(true)
      }
    })

    it('never resolves to the broader policy when it declares no support', () => {
      if (preset.supportsShowAllGuides !== false) return

      for (const { scene } of states.filter(state => state.requested === 'all')) {
        const active = scene.points.filter(point => point.tier === 'active')
        expect(active.length).toBeLessThanOrEqual(1)
      }
    })
  },
)
