// ─── Shared state-space enumeration for CoordinatePlaneExplore contracts ─────
//
// Test-only. Three architecture contracts need to walk the same space —
// reachability, visible bounds and the annotation contract — and a third copy
// of the breadth-first option walker would drift from the other two.
//
// Not matched by any vitest project glob (`tests/architecture/**/*.test.js`,
// `tests/unit/**/*.test.js`), so it is never collected as a suite itself.

import {
  clampPresetValues,
  resolveEffectiveValues,
  resolveOptionValues,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

/**
 * Capability profiles worth sweeping.
 *
 * The combined profile is load bearing. Enlargement's reach is
 * `(1 − s)c + s·p`, so the centre and the scale factor interact: proving a
 * movable centre is safe at factor 2, and proving factor −2 is safe about the
 * origin, says nothing about factor −2 about (1, −1). An earlier version of the
 * visible-bounds sweep enabled fractional and negative factors only with the
 * centre pinned, and never tested the combination at all.
 */
export const CAPABILITY_PROFILES = Object.freeze([
  {},
  { diagonalMirrorLines: true, nonOriginCentre: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true, nonOriginCentre: true },
  { perpendicularGradients: true, showXIntercept: true },
])

// Above this many total combinations, sweep control corners instead of every
// value. Chosen so the presets whose STAGES carry meaning are enumerated in
// full while the wide ones stay affordable:
//
//   tableOfValues  6 states  — every table row, and each row annotates a
//                              different point, so corners would visit only
//                              the first and last
//   reflect        5 states  — every mirror position
//   enlarge        9 states  — unchanged, corners already covered it
//   rotate        25 states  — stays on corners; its tiers do not vary with
//                              the centre, and 25 would inflate its ~19k
//                              derived scenes for nothing
const FULL_ENUMERATION_LIMIT = 16

function controlValues(control) {
  const count = Math.round((control.max - control.min) / control.step) + 1
  return Array.from({ length: count }, (_, index) => control.min + index * control.step)
}

function fullProductSize(preset) {
  return (preset.controls ?? []).reduce(
    (total, control) => total * controlValues(control).length,
    1,
  )
}

/**
 * The value sets to sweep for a preset.
 *
 * Small presets are enumerated exhaustively; wide ones fall back to the
 * Cartesian product of each control's boundaries and its initial value.
 *
 * One control at a time, plus all-min and all-max, is not enough for the wide
 * ones either: a rotation about (−2, 2) appears in neither, and mixed
 * coordinates are where transformations reach furthest.
 *
 * Uses the MODEL range, not the interaction range — static content may supply
 * anything the model accepts, so that is what must stay visible.
 */
export function controlValueSets(preset) {
  const base = clampPresetValues(preset, preset.initialValues)
  const exhaustive = fullProductSize(preset) <= FULL_ENUMERATION_LIMIT
  let sets = [base]

  for (const control of preset.controls ?? []) {
    const candidates = exhaustive
      ? controlValues(control)
      : [control.min, control.max, base[control.id]]

    sets = sets.flatMap(values => candidates.map(candidate => ({
      ...values,
      [control.id]: candidate,
    })))
  }
  return sets.map(values => clampPresetValues(preset, values))
}

/**
 * Every reachable combination of option choices, walked breadth-first.
 *
 * A single `resolveOptions(capabilities)` call cannot describe this: groups
 * resolve from the values too, so rotation offers `direction` at 90° and 270°
 * and withdraws it at 180°. The set of groups changes as you move through the
 * set of choices, so the preset is re-asked at every state.
 */
export function reachableOptionStates(preset, baseValues, capabilities) {
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

/**
 * Every effective state a preset can be in, resolved exactly as the renderer
 * resolves it.
 *
 * Yields `{ capabilities, effectiveValues, choices, label }`. Deriving from raw
 * values with separately generated choices would test combinations the
 * component can never be in, and would miss any capability that pins a value —
 * the pinned figure being the only one a learner ever sees.
 */
export function* effectiveStates(preset, { capabilityProfiles = CAPABILITY_PROFILES } = {}) {
  for (const profile of capabilityProfiles) {
    const capabilities = { ...(preset.capabilities ?? {}), ...profile }

    for (const numericValues of controlValueSets(preset)) {
      for (const optionValues of reachableOptionStates(preset, numericValues, capabilities)) {
        const effectiveValues = resolveEffectiveValues(
          preset,
          { ...numericValues, ...optionValues },
          capabilities,
        )
        const choices = resolveOptionValues(preset, effectiveValues, capabilities)

        yield {
          capabilities,
          effectiveValues,
          choices,
          label: `${preset.id} values=${JSON.stringify(effectiveValues)} choices=${JSON.stringify(choices)}`,
        }
      }
    }
  }
}

const MALFORMED = /\b(NaN|Infinity|undefined|null)\b/

/**
 * Coordinate pairs from a model-space path, refusing malformed input.
 *
 * A bare numeric scrape silently drops anything unparseable, so
 * `M NaN NaN L 2 3` would contribute only the valid pair and sail through a
 * bounds check. Points and guides carry real numbers and fail naturally on
 * NaN; string-authored paths need this said explicitly.
 *
 * Throws with the offending path rather than returning a partial list.
 */
export function parseModelPathCoordinates(path, label = 'path') {
  if (typeof path !== 'string' || path.length === 0) {
    throw new Error(`${label}: model path is not a non-empty string (got ${String(path)})`)
  }
  if (MALFORMED.test(path)) {
    throw new Error(`${label}: model path contains a malformed value — "${path}"`)
  }

  const numbers = (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  if (numbers.length === 0 || numbers.length % 2 !== 0) {
    throw new Error(`${label}: model path yielded ${numbers.length} coordinates — "${path}"`)
  }
  if (!numbers.every(Number.isFinite)) {
    throw new Error(`${label}: model path has a non-finite coordinate — "${path}"`)
  }

  const points = []
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push({ x: numbers[index], y: numbers[index + 1] })
  }
  return points
}
