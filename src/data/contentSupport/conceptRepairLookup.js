// ─── Concept repair lookup (pure, read-only) ───────────────────────────────
//
// Answers one question for future weak-spot / repair flows:
//   "Given a concept the learner is getting wrong, which teaching screens
//    support it?"
//
// It reads the reviewed content-support maps (currently Medicine Episode 1) and
// returns screen/part metadata — it never renders UI, never routes, and never
// decides what to practise next. Selection stays out of this layer.
//
// Rules:
//   - concept ids are validated against the learning graph registry;
//     an unregistered id throws (fail loud, don't guess).
//   - a registered concept with no support yet returns empty results.
//   - exact screen matches are preferred over broad stage (part) matches.
//   - output is deterministic (stable ordering).
//   - pure leaf: no React, no components, no runtime lesson files.

import {
  HISTORY_MEDICINE_EPISODE_01_SUPPORT as EP01,
  HISTORY_MEDICINE_EPISODE_01_CONCEPT_SUPPORT as EP01_INDEX,
} from './historyMedicineEpisode01.js'
import { isConceptId } from '../learningGraph/conceptRegistry.js'

// Registered support maps. New episodes append their { support, index } here;
// the lookup then covers them with no other change.
const SUPPORT_MAPS = [
  { support: EP01, index: EP01_INDEX },
]

// Build, once, a concept → { screens, parts } aggregate across all support
// maps. Screens/parts are resolved to their full metadata and sorted
// deterministically. Screen identity is (moduleId, screenIndex) so the layer
// is unambiguous once more than one episode is registered.
function buildRegistry(maps) {
  const byConcept = new Map()
  for (const { support, index } of maps) {
    const screenByIndex = new Map(support.screens.map(s => [s.screenIndex, s]))
    const partById = new Map(support.stageRanges.map(p => [p.id, p]))
    for (const [conceptId, entry] of Object.entries(index)) {
      const rec = byConcept.get(conceptId) ?? { screens: [], parts: [] }
      for (const idx of entry.screens) {
        const s = screenByIndex.get(idx)
        if (s) {
          rec.screens.push({
            moduleId: support.id,
            screenIndex: s.screenIndex,
            label: s.label,
            purpose: s.purpose,
            conceptTags: [...s.conceptTags],
          })
        }
      }
      for (const pid of entry.parts) {
        const p = partById.get(pid)
        if (p) {
          rec.parts.push({
            moduleId: support.id,
            id: p.id,
            title: p.title,
            screenRange: [...p.screenRange],
          })
        }
      }
      byConcept.set(conceptId, rec)
    }
  }
  for (const rec of byConcept.values()) {
    rec.screens.sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.screenIndex - b.screenIndex)
    rec.parts.sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.id.localeCompare(b.id))
  }
  return byConcept
}

const REGISTRY = buildRegistry(SUPPORT_MAPS)

function assertRegisteredConcept(conceptId) {
  if (typeof conceptId !== 'string' || !isConceptId(conceptId)) {
    throw new Error(
      `concept-repair-lookup: unregistered concept id ${JSON.stringify(conceptId)} — ` +
      'register it in the learning graph before looking up support.',
    )
  }
}

const cloneScreen = s => ({ ...s, conceptTags: [...s.conceptTags] })
const clonePart = p => ({ ...p, screenRange: [...p.screenRange] })

/**
 * Screens and parts that support one concept.
 * @returns {{ concept: string, screens: object[], parts: object[] }}
 *   screens — exact per-screen matches (preferred), ascending; empty if none.
 *   parts   — broader stage/part matches; empty if none.
 * Throws for an unregistered concept id.
 */
export function getSupportForConcept(conceptId) {
  assertRegisteredConcept(conceptId)
  const rec = REGISTRY.get(conceptId)
  return {
    concept: conceptId,
    screens: rec ? rec.screens.map(cloneScreen) : [],
    parts: rec ? rec.parts.map(clonePart) : [],
  }
}

/**
 * The single best revisit screen for a concept: the exact screen match with the
 * lowest (moduleId, screenIndex). Returns null if the concept has no
 * screen-level support (parts alone are not returned here — exact over broad).
 * Throws for an unregistered concept id.
 */
export function getBestSupportScreen(conceptId) {
  const { screens } = getSupportForConcept(conceptId)
  return screens.length ? screens[0] : null
}

/**
 * Support for several concepts at once (e.g. a learner's weak set).
 * @returns {{ concepts: string[], perConcept: object[], screens: object[] }}
 *   perConcept — getSupportForConcept result per input id, in input order.
 *   screens    — the union of supporting screens, each annotated with the
 *                matchedConcepts it covers, ranked by how many of the input
 *                concepts it supports (desc), then (moduleId, screenIndex).
 * Throws if any concept id is unregistered.
 */
export function getSupportForConcepts(conceptIds) {
  if (!Array.isArray(conceptIds)) {
    throw new TypeError('getSupportForConcepts expects an array of concept ids')
  }
  const perConcept = conceptIds.map(getSupportForConcept)
  const merged = new Map()
  for (const { concept, screens } of perConcept) {
    for (const s of screens) {
      const key = `${s.moduleId}::${s.screenIndex}`
      const hit = merged.get(key) ?? { screen: s, matchedConcepts: new Set() }
      hit.matchedConcepts.add(concept)
      merged.set(key, hit)
    }
  }
  const screens = [...merged.values()]
    .map(({ screen, matchedConcepts }) => ({ ...cloneScreen(screen), matchedConcepts: [...matchedConcepts].sort() }))
    .sort((a, b) =>
      b.matchedConcepts.length - a.matchedConcepts.length ||
      a.moduleId.localeCompare(b.moduleId) ||
      a.screenIndex - b.screenIndex)
  return { concepts: [...conceptIds], perConcept, screens }
}
