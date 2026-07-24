// ─── FractionRatioExplore preset registry ────────────────────────────────────
//
// Each preset is one part-whole idea expressed as a scene: a set of controls,
// the values they hold, and a pure derive() turning those values into shapes,
// labels and a status line. FractionRatioExplore renders the scene and owns the
// interaction; questions, marking and weakness tracking belong to the page that
// composes it.
//
// Tones are semantic role names resolved through fractionRatioVisualRoles.js —
// presets never name a colour directly.

import { clamp } from '../fractionRatioGeometry.js'

import fractionBar from './fractionBar.js'
import equivalentFractions from './equivalentFractions.js'
import fractionOperations from './fractionOperations/index.js'
import ratioShare from './ratioShare.js'
import doubleNumberLine from './doubleNumberLine.js'
import percentageGrid from './percentageGrid.js'
import proportionScale from './proportionScale.js'
import bestValue from './bestValue.js'

export const FRACTION_RATIO_PRESETS = {
  fractionBar,
  equivalentFractions,
  fractionOperations,
  ratioShare,
  doubleNumberLine,
  percentageGrid,
  proportionScale,
  bestValue,
}

export function resolveFractionRatioPreset(preset) {
  if (typeof preset === 'string') {
    const found = FRACTION_RATIO_PRESETS[preset]
    if (!found) throw new Error(`Unknown FractionRatioExplore preset: ${preset}`)
    return found
  }
  return preset
}

/**
 * Clamp every control to its own range, then let the preset settle any
 * relationship between them.
 *
 * `normalise` receives the active method because some constraints only exist
 * for one operation — a second fraction larger than the first is fine when
 * adding and undrawable when subtracting. Clamping without that context would
 * either over-restrict every method or leave one able to produce a scene it
 * cannot render.
 */
export function clampPresetValues(presetConfig, values, { method } = {}) {
  const clamped = Object.fromEntries(presetConfig.controls.map((control) => {
    const raw = values?.[control.id] ?? presetConfig.initialValues[control.id]
    return [control.id, clamp(Math.round(raw / control.step) * control.step, control.min, control.max)]
  }))

  return presetConfig.normalise
    ? presetConfig.normalise(clamped, { method })
    : clamped
}

export function resolvePresetMethod(presetConfig, method) {
  const methods = presetConfig.methods
  if (!methods?.length) return null
  return methods.some(entry => entry.id === method) ? method : methods[0].id
}

export function presetSteps(presetConfig, method) {
  return presetConfig.stepsFor?.(method) ?? []
}

export function resolvePresetStep(presetConfig, method, step) {
  const steps = presetSteps(presetConfig, method)
  if (!steps.length) return null
  return steps.some(entry => entry.id === step) ? step : steps[0].id
}

// Whether a control's stepper row should show for the active method. A control
// may declare `stepper: true` for always, or a list of the methods it belongs
// to — the amount only matters when taking a fraction of an amount.
export function controlHasStepper(control, method) {
  if (control.stepper === true) return true
  if (Array.isArray(control.stepper)) return control.stepper.includes(method)
  return false
}
