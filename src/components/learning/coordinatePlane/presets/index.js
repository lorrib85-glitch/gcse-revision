// ─── CoordinatePlaneExplore preset registry ──────────────────────────────────
//
// Resolution order for axes and capabilities is: preset defaults, then caller
// props shallow-merged on top. A preset always supplies a complete axis spec,
// so props are never required — a Physics caller can override label and unit
// without restating min, max and step.

import midpointPreset from './midpoint.js'
import plotPointPreset from './plotPoint.js'
import straightLinePreset from './straightLine.js'
import tableOfValuesPreset from './tableOfValues.js'

export const COORDINATE_PLANE_PRESETS = {
  plotPoint: plotPointPreset,
  midpoint: midpointPreset,
  straightLine: straightLinePreset,
  tableOfValues: tableOfValuesPreset,
}

const FALLBACK_PRESET = 'plotPoint'

export function resolveCoordinatePlanePreset(preset) {
  if (preset && typeof preset === 'object') return preset
  return COORDINATE_PLANE_PRESETS[preset] ?? COORDINATE_PLANE_PRESETS[FALLBACK_PRESET]
}

export function resolvePresetFocus(preset, focus) {
  const modes = preset.focusModes ?? []
  if (focus && modes.includes(focus)) return focus
  return preset.defaultFocus ?? modes[0] ?? null
}

function clampControl(control, value, { min, max }) {
  const stepped = control.step
    ? Math.round(value / control.step) * control.step
    : value
  return Math.min(Math.max(stepped, min), max)
}

/**
 * Clamps to the MODEL range only.
 *
 * This is what `value`, `defaultValue` and `initialValues` pass through, so it
 * must never apply interaction bounds — a static exam figure has to render the
 * centre it was given, not the nearest one a thumb could reach.
 */
export function clampPresetValues(preset, values) {
  const controls = preset.controls ?? []
  const clamped = { ...values }

  for (const control of controls) {
    if (clamped[control.id] == null) continue
    clamped[control.id] = clampControl(control, clamped[control.id], {
      min: control.min,
      max: control.max,
    })
  }
  return clamped
}

export function interactionRange(control) {
  return {
    min: control.interactionMin ?? control.min,
    max: control.interactionMax ?? control.max,
  }
}

/**
 * Clamps a learner-driven change to the INTERACTION range.
 *
 * Deliberately the same shape as clampPresetValues so the two sit side by side
 * and the choice between them is a visible decision rather than an accident.
 * Use this for drag, steppers and keyboard stepping. Never for `value`,
 * `defaultValue` or `initialValues` — those are model-range data.
 */
export function clampInteractiveValues(preset, values) {
  const controls = preset.controls ?? []
  const clamped = { ...values }

  for (const control of controls) {
    if (clamped[control.id] == null) continue
    clamped[control.id] = clampControl(control, clamped[control.id], interactionRange(control))
  }
  return clamped
}

/** Single-control form of the same rule, for one-at-a-time updates. */
export function clampInteractiveValue(control, value) {
  return clampControl(control, value, interactionRange(control))
}

export function mergeAxis(presetAxis, override) {
  if (!override) return { ...presetAxis }
  return { ...presetAxis, ...override }
}

export function mergeCapabilities(preset, overrides) {
  return { ...(preset.capabilities ?? {}), ...(overrides ?? {}) }
}

export function resolveShowGuides(
  preset,
  showGuides = 'active',
  { isDevelopment = false, warn = console.warn } = {},
) {
  if (showGuides === 'all' && preset.supportsShowAllGuides === false) {
    if (isDevelopment) {
      warn(
        `CoordinatePlaneExplore preset "${preset.id}" does not support showGuides="all"; using "active".`,
      )
    }
    return 'active'
  }
  if (!['active', 'all', 'none'].includes(showGuides)) return 'active'
  return showGuides
}
