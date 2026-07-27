import { describe, expect, it } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  interactionRange,
  mergeCapabilities,
  resolveEffectiveValues,
  resolveOptionValues,
  resolvePresetFocus,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

// This file's capability sets. Deliberately NOT identical to the visible-bounds
// file's: reachability wants nonOriginCentre enabled so the centre steppers can
// be reached at all, while visible-bounds wants the pinned-to-origin figure in
// its sweep. Keep them separate and keep this comment honest — an earlier
// version claimed they were shared when they were not.
const CAPABILITY_SETS = [
  {},
  { diagonalMirrorLines: true, nonOriginCentre: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true, nonOriginCentre: true },
  { perpendicularGradients: true, showXIntercept: true },
]

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

// Handles across the same effective-state sweep everything else uses.
//
// Deriving from raw initial values with first-choice options would miss a
// handle that only appears under a non-default capability or option. No preset
// emits handles that way today, so this is currently equivalent — but the
// helper should not be the one place in the file that tests a state the
// component cannot be in.
function handleControlIds(preset) {
  const ids = new Set()
  const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]

  for (const caps of CAPABILITY_SETS) {
    const capabilities = mergeCapabilities(preset, caps)
    for (const numericValues of controlValueSets(preset)) {
      for (const optionValues of reachableOptionStates(preset, numericValues, capabilities)) {
        const effectiveValues = resolveEffectiveValues(
          preset,
          { ...numericValues, ...optionValues },
          capabilities,
        )
        const choices = resolveOptionValues(preset, effectiveValues, capabilities)

        for (const focus of focusModes) {
          const scene = preset.derive(effectiveValues, {
            focus: resolvePresetFocus(preset, focus),
            activeId: preset.defaultActiveId,
            showGuides: 'active',
            capabilities,
            choices,
            axes: { x: preset.xAxis, y: preset.yAxis },
            grid: preset.grid,
          })

          for (const handle of scene.handles ?? []) {
            for (const id of handle.controlIds ?? [handle.controlId]) ids.add(id)
          }
        }
      }
    }
  }
  return ids
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'control reachability: %s',
  (presetId, preset) => {
    // Reachability must be proved against RESOLVED steppers, not the static
    // declaration. The static list would pass even if resolveSteppers() hid a
    // control in every state a learner can actually reach — which is precisely
    // the "control that does nothing" failure inverted.
    it('offers a way to change every declared control in some reachable state', () => {
      const viaHandle = handleControlIds(preset)
      const viaStepper = new Set()

      for (const caps of CAPABILITY_SETS) {
        const capabilities = mergeCapabilities(preset, caps)
        for (const numericValues of controlValueSets(preset)) {
          for (const optionValues of reachableOptionStates(preset, numericValues, capabilities)) {
            const effectiveValues = resolveEffectiveValues(
              preset,
              { ...numericValues, ...optionValues },
              capabilities,
            )
            const steppers = preset.resolveSteppers?.(effectiveValues, capabilities)
              ?? preset.steppers
              ?? []
            for (const stepper of steppers) viaStepper.add(stepper.controlId)
          }
        }
      }

      for (const control of preset.controls ?? []) {
        expect(
          viaHandle.has(control.id) || viaStepper.has(control.id),
          `${presetId} declares control "${control.id}" but no reachable state offers a handle or a stepper for it`,
        ).toBe(true)
      }
    })

    it('never resolves a stepper for a control that does not exist', () => {
      const controlIds = new Set((preset.controls ?? []).map(control => control.id))

      for (const caps of CAPABILITY_SETS) {
        const capabilities = mergeCapabilities(preset, caps)
        for (const numericValues of controlValueSets(preset)) {
          for (const optionValues of reachableOptionStates(preset, numericValues, capabilities)) {
            const effectiveValues = resolveEffectiveValues(
              preset,
              { ...numericValues, ...optionValues },
              capabilities,
            )
            const steppers = preset.resolveSteppers?.(effectiveValues, capabilities)
              ?? preset.steppers
              ?? []
            for (const stepper of steppers) {
              expect(
                controlIds.has(stepper.controlId),
                `${presetId} resolved a stepper for unknown control "${stepper.controlId}"`,
              ).toBe(true)
            }
          }
        }
      }

      // The static declaration must also be honest — Task 13 reads it.
      for (const stepper of preset.steppers ?? []) {
        expect(
          controlIds.has(stepper.controlId),
          `${presetId} declares a stepper for unknown control "${stepper.controlId}"`,
        ).toBe(true)
      }
    })

    it('gives every control the fields the renderer needs', () => {
      for (const control of preset.controls ?? []) {
        expect(typeof control.label, `${presetId}.${control.id}.label`).toBe('string')
        expect(typeof control.step, `${presetId}.${control.id}.step`).toBe('number')
        expect(control.step, `${presetId}.${control.id}.step`).toBeGreaterThan(0)
        expect(typeof control.min, `${presetId}.${control.id}.min`).toBe('number')
        expect(typeof control.max, `${presetId}.${control.id}.max`).toBe('number')
        expect(control.max).toBeGreaterThan(control.min)
        expect(typeof control.valueText, `${presetId}.${control.id}.valueText`).toBe('function')
      }
    })

    it('keeps every interaction range inside its model range', () => {
      for (const control of preset.controls ?? []) {
        const reach = interactionRange(control)

        expect(reach.min, `${presetId}.${control.id} interactionMin`).toBeGreaterThanOrEqual(control.min)
        expect(reach.max, `${presetId}.${control.id} interactionMax`).toBeLessThanOrEqual(control.max)
        expect(reach.max).toBeGreaterThan(reach.min)
      }
    })

    // The corruption this contract exists to prevent: a supplied static figure
    // silently redrawn at whatever value a thumb could have reached.
    it('never clamps a supplied value down to the interaction range', () => {
      for (const control of preset.controls ?? []) {
        const reach = interactionRange(control)
        if (reach.max >= control.max) continue

        const beyondReach = control.max
        const clamped = clampPresetValues(preset, {
          ...preset.initialValues,
          [control.id]: beyondReach,
        })

        expect(
          clamped[control.id],
          `${presetId}.${control.id}: a supplied value of ${beyondReach} was clamped to ${clamped[control.id]}, so static content would render a figure it did not ask for`,
        ).toBe(beyondReach)
      }
    })
  },
)
