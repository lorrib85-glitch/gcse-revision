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

// How many offending points a failure message names before it summarises the
// rest. A contract this wide fails in bulk — one wrong tier in a shared helper
// is tens of thousands of points — and printing all of them buries the signal.
const MAX_VIOLATION_EXAMPLES = 20

/**
 * The state a point was annotated in, as a one-line identity.
 *
 * A bare point id is not enough to reproduce a tier defect: the same point is
 * annotated differently depending on what is selected, which guide policy is in
 * force and which options are chosen. This is what turns a failure into a
 * reproduction.
 */
function stateIdentity({ context, requested, selectedId }) {
  return [
    `activeId=${context.activeId}`,
    `showGuides=${context.showGuides} (requested ${requested})`,
    `comparisonRule=${String(context.comparisonRule)}`,
    `choices=${JSON.stringify(context.choices)}`,
    selectedId ? `selected=${selectedId}` : null,
  ].filter(Boolean).join(' ')
}

/**
 * Every point failing `isValid`, counted in full and described in part.
 *
 * The two tier contracts walk 370,800 annotated points between them. Asserting
 * per point made one matcher call each, which cost seconds per preset and left
 * the suite timing out under load — the matcher call was the expense, not the
 * scenes, which are derived once at collection. Detect with a plain predicate
 * and assert once instead.
 *
 * Detection is still exhaustive: `count` keeps rising after the example cap, so
 * the reported total is the real one and nothing stops being checked.
 */
function collectViolations(states, isValid, describePoint) {
  let count = 0
  const examples = []

  for (const state of states) {
    for (const point of state.scene.points) {
      if (isValid(point)) continue

      count += 1
      if (examples.length < MAX_VIOLATION_EXAMPLES) {
        examples.push(`${describePoint(point)} — ${stateIdentity(state)}`)
      }
    }
  }
  return { count, examples }
}

function violationReport(summary, { count, examples }) {
  if (count === 0) return summary

  const omitted = count - examples.length
  return [
    `${summary}: ${count} offending point(s)`,
    ...examples.map(example => `  ${example}`),
    ...(omitted > 0 ? [`  …and ${omitted} more`] : []),
  ].join('\n')
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'annotation contract: %s',
  (presetId, preset) => {
    const states = reachableStates(preset)

    it('reaches at least one state', () => {
      expect(states.length).toBeGreaterThan(0)
    })

    // Kept as two contracts, not one. A point with no tier at all and a point
    // with a tier outside the permitted three are different defects: the first
    // is a missing annotation, the second an unrecognised one, and collapsing
    // them would report the wrong thing for whichever fired.
    it('declares a tier on every annotated element', () => {
      const violations = collectViolations(
        states,
        point => point.tier !== undefined,
        point => `${presetId} point "${point.id}" carries annotation without a tier`,
      )

      expect(
        violations.count,
        violationReport(`${presetId} has points annotated without a tier`, violations),
      ).toBe(0)
    })

    it('uses only the three permitted tiers', () => {
      const violations = collectViolations(
        states,
        point => TIERS.includes(point.tier),
        point => `${presetId} point "${point.id}" has tier ${JSON.stringify(point.tier)}`,
      )

      expect(
        violations.count,
        violationReport(
          `${presetId} uses tiers outside ${JSON.stringify(TIERS)}`,
          violations,
        ),
      ).toBe(0)
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
