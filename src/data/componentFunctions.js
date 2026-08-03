// ─── Component function taxonomy — thin compatibility API ────────────────
// The pedagogical classification of every authorable screen and block type is
// a catalogue fact: each authoring entry carries a `pedagogy` block, and
// `generated/componentPedagogyRegistry.js` is projected from those blocks plus
// the compatibility and non-authoring registries. This file re-exports the
// projection and owns only the helper functions — it authors no taxonomy data.
//
// interaction: 'passive'  — learner only reads or taps Continue
//              'reveal'   — learner taps/pans to progress, gives no answer
//              'assessed' — learner answers or decides; can be right/wrong
//
// SCREEN_TYPE_FUNCTIONS is the flat compatibility view: one fact per type
// name, valid only while screen and block facts agree (the generator fails on
// the first divergence). New consumers should prefer the level-aware helpers.

import {
  FUNCTION_TAGS,
  SCREEN_TYPE_FUNCTIONS,
  SCREEN_TYPE_PEDAGOGY,
  BLOCK_TYPE_PEDAGOGY,
} from './generated/componentPedagogyRegistry.js'

export { FUNCTION_TAGS, SCREEN_TYPE_FUNCTIONS }

export function getTypeInfo(type) {
  return SCREEN_TYPE_FUNCTIONS[type] ?? null
}

export function isPassive(type) {
  return getTypeInfo(type)?.interaction === 'passive'
}

export function isAssessed(type) {
  return getTypeInfo(type)?.interaction === 'assessed'
}

// Level-aware helpers — the forward path once a type name needs different
// facts per level. No current consumer; adopted per consumer phase.
export function getScreenTypeInfo(type) {
  return SCREEN_TYPE_PEDAGOGY[type] ?? null
}

export function getBlockTypeInfo(type) {
  return BLOCK_TYPE_PEDAGOGY[type] ?? null
}
