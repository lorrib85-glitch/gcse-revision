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

          // And each focusable point selected in turn. The selected id is
          // recorded so the contract can check that THAT point is the active
          // one, not merely that some point is.
          for (const point of scene.points.filter(item => item.focusable)) {
            const moved = { ...context, activeId: point.id }
            states.push({
              context: moved,
              scene: preset.derive(state.effectiveValues, moved),
              requested,
              selectedId: point.id,
            })
          }
        }
      }
    }
  }
  return states
}

/**
 * Why this contract needs longer than the generic 5s per-test budget.
 *
 * These assertions are exhaustive by design: every effective state, focus mode,
 * comparison rule, guide policy and focusable-point selection. That is 69,888
 * reachable states carrying 370,800 annotated points, so a per-point assertion
 * makes one matcher call per point — 132,300 for rotate, 95,256 for enlarge.
 *
 * The cost is the matcher call itself, not the data. Every scene is derived once
 * when the suite is collected, and deriving all nine presets takes ~0.8s in
 * total; caching it would take nothing off these assertions. Walking the very
 * same points with `toBeDefined` costs ~1.0s for enlarge and with `toContain`
 * ~3.6s — same loop, same points, 3.6x the time.
 *
 * That left the slowest assertion, `uses only the three permitted tiers`, at
 * 44–83% of the 5s budget on an idle machine, so ordinary CPU contention tipped
 * it over and the whole verify run became untrustworthy. Under contention it
 * overran to 14s, which is also what proves the work is synchronous rather than
 * a leaked handle — the runner cannot interrupt a blocking loop.
 *
 * So the budget is raised for this file alone rather than the coverage reduced:
 * ~3.6x headroom over the 4.1s worst case measured across a full architecture
 * run. It is deliberately not a global `testTimeout` — every other architecture
 * test should still fail fast at 5s.
 */
const EXHAUSTIVE_ANNOTATION_TIMEOUT_MS = 15_000

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'annotation contract: %s',
  { timeout: EXHAUSTIVE_ANNOTATION_TIMEOUT_MS },
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

        // Key off whether the scene HAS points, not off their tiers.
        //
        // Two earlier forms of this assertion could not fail. Keying off
        // `focusable` allowed zero active elements for straightLine,
        // tableOfValues and intersection, none of whose points are focusable.
        // Keying off "some point is not context" was circular: it derived the
        // expectation from the very tiers under test, so demoting every point
        // to context produced zero active AND zero expected, and passed.
        //
        // Under the normal policy every scene containing any point must have
        // exactly one active. The legitimate zero-active states — parallel and
        // coincident intersections — contain no points at all.
        expect(
          active,
          `${presetId} has ${active.length} active elements with activeId="${context.activeId}"`,
        ).toHaveLength(scene.points.length > 0 ? 1 : 0)
      }
    })

    // Deriving with an activeId proves nothing unless the contract checks that
    // THAT point became active. Without this, a preset that always activated A
    // would pass while the learner selected B — status and guides following one
    // vertex while the highlight stayed on another.
    it('makes the selected focusable point the sole active annotation', () => {
      const selections = states.filter(
        item => item.selectedId && item.context.showGuides === 'active',
      )

      for (const state of selections) {
        const activeIds = state.scene.points
          .filter(point => point.tier === 'active')
          .map(point => point.id)

        expect(
          activeIds,
          `${presetId} selected "${state.selectedId}" but activated ${JSON.stringify(activeIds)}`,
        ).toEqual([state.selectedId])
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
