// ─── Learner Mastery Engine — evidence recording ────────────────────────────
//
// Pure, immutable update functions. Every recorder returns a NEW state; the
// input state is never mutated. Concept ids are validated against the
// canonical learning graph registry — recording against an unregistered
// concept throws, because silently accepting drift is how personalisation
// data rots (see docs/system/LEARNING_GRAPH.md).

import { isConceptId } from '../learningGraph/conceptRegistry.js'
import { EVIDENCE_WINDOW, createEmptyConceptEvidence } from './masteryModel.js'

function assertConceptId(conceptId) {
  if (!isConceptId(conceptId)) {
    throw new TypeError(
      `masteryEngine: "${conceptId}" is not a registered concept id — register it in src/data/learningGraph/ first`,
    )
  }
}

// Core recorder. `at` defaults to now; pass it explicitly for deterministic
// results (tests, replaying imported evidence). Extra fields on the options
// object beyond { conceptId, correct, at } are deliberately ignored today but
// reserved for future evidence dimensions (responseTimeMs, selfConfidence).
export function recordAttempt(state, { conceptId, correct, at = Date.now() } = {}) {
  assertConceptId(conceptId)
  if (typeof correct !== 'boolean') {
    throw new TypeError(`masteryEngine: recordAttempt for "${conceptId}" needs correct: true/false`)
  }
  if (typeof at !== 'number' || !Number.isFinite(at)) {
    throw new TypeError(`masteryEngine: recordAttempt for "${conceptId}" needs a numeric timestamp`)
  }

  const prev = state.concepts[conceptId] ?? createEmptyConceptEvidence()

  const next = {
    ...prev,
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
    incorrect: prev.incorrect + (correct ? 0 : 1),
    streak: correct ? prev.streak + 1 : 0,
    firstSeen: prev.firstSeen ?? at,
    lastSeen: Math.max(prev.lastSeen ?? at, at),
    lastCorrect: correct ? Math.max(prev.lastCorrect ?? at, at) : prev.lastCorrect,
    recent: [...prev.recent, { correct, at }].slice(-EVIDENCE_WINDOW),
  }

  return {
    ...state,
    concepts: { ...state.concepts, [conceptId]: next },
  }
}

export function recordCorrect(state, conceptId, options = {}) {
  return recordAttempt(state, { ...options, conceptId, correct: true })
}

export function recordIncorrect(state, conceptId, options = {}) {
  return recordAttempt(state, { ...options, conceptId, correct: false })
}

// Union-merge two evidence states (future device sync / account merge).
// Counters sum, firstSeen takes the earliest, lastSeen/lastCorrect the
// latest, and the recent window is rebuilt time-ordered from both sides.
// The merged streak is recomputed from the merged recent window, so it is
// conservative: a real streak longer than EVIDENCE_WINDOW caps at the window.
export function mergeEvidence(a, b) {
  const merged = { version: a.version, concepts: { ...a.concepts } }

  for (const [conceptId, evidenceB] of Object.entries(b.concepts)) {
    const evidenceA = merged.concepts[conceptId]
    if (!evidenceA) {
      merged.concepts[conceptId] = evidenceB
      continue
    }

    const recent = [...evidenceA.recent, ...evidenceB.recent]
      .sort((x, y) => x.at - y.at)
      .slice(-EVIDENCE_WINDOW)

    let streak = 0
    for (let i = recent.length - 1; i >= 0 && recent[i].correct; i--) streak++

    merged.concepts[conceptId] = {
      ...evidenceA,
      attempts: evidenceA.attempts + evidenceB.attempts,
      correct: evidenceA.correct + evidenceB.correct,
      incorrect: evidenceA.incorrect + evidenceB.incorrect,
      streak,
      firstSeen: minTime(evidenceA.firstSeen, evidenceB.firstSeen),
      lastSeen: maxTime(evidenceA.lastSeen, evidenceB.lastSeen),
      lastCorrect: maxTime(evidenceA.lastCorrect, evidenceB.lastCorrect),
      recent,
    }
  }

  return merged
}

function minTime(x, y) {
  if (x === null) return y
  if (y === null) return x
  return Math.min(x, y)
}

function maxTime(x, y) {
  if (x === null) return y
  if (y === null) return x
  return Math.max(x, y)
}
