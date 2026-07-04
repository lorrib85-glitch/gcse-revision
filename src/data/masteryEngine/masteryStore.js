// ─── Learner Mastery Engine — persistence boundary ──────────────────────────
//
// The ONLY impure file in the mastery engine. Everything else in this
// directory is pure logic; this file is the single seam where a learner's
// mastery state is loaded/saved, via the canonical storage abstraction
// (src/lib/storage.js — never the browser storage API directly). Swapping to
// a remote store later means changing only src/lib/storage.js, not the engine.
//
// Malformed or future-versioned payloads are discarded in favour of an empty
// state rather than trusted — evidence is regenerable, corruption is not.

import { getJson, setJson } from '../../lib/storage.js'
import { createEmptyMasteryState, isMasteryState } from './masteryModel.js'

export const MASTERY_STORAGE_KEY = 'gcse_mastery_v1'

export function loadMasteryState() {
  const raw = getJson(MASTERY_STORAGE_KEY, null)
  return isMasteryState(raw) ? raw : createEmptyMasteryState()
}

export function saveMasteryState(state) {
  if (!isMasteryState(state)) {
    throw new TypeError('masteryEngine: refusing to persist a malformed mastery state')
  }
  setJson(MASTERY_STORAGE_KEY, state)
}
