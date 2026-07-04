// ─── Learner Mastery Engine — state model ───────────────────────────────────
//
// The learning graph (src/data/learningGraph/) describes the curriculum.
// This engine describes ONE LEARNER's understanding of that curriculum:
// per registered concept, a small evidence record — never a bare percentage.
//
// Stored shape (versioned; persisted only via masteryStore.js):
//
//   {
//     version: 1,
//     concepts: {
//       'history:medicine:galen': {
//         attempts, correct, incorrect,   // lifetime counters
//         streak,                         // current consecutive-correct run
//         firstSeen, lastSeen, lastCorrect, // ms epoch timestamps (null until set)
//         recent: [{ correct, at }],      // last EVIDENCE_WINDOW results, oldest → newest
//       },
//     },
//   }
//
// Mastery, confidence and strength are DERIVED from evidence at read time
// (masteryScore.js) and never stored — so scoring can evolve (memory decay,
// response-time weighting, confidence buttons) without a data migration.
// `recent` entries carry timestamps and tolerate extra future fields
// (e.g. responseTimeMs, selfConfidence) for exactly that reason.
//
// This directory must stay a pure leaf: no React, no app imports, no storage
// access outside masteryStore.js. Enforced by
// tests/architecture/mastery-engine.test.js.

export const MASTERY_STATE_VERSION = 1

// How many recent results each concept keeps as its recency evidence window.
export const EVIDENCE_WINDOW = 10

// Derived strength bands, from mastery score (see masteryScore.js).
export const STRENGTH_BANDS = {
  UNSEEN: 'unseen',
  WEAK: 'weak',
  DEVELOPING: 'developing',
  SECURE: 'secure',
  STRONG: 'strong',
}

export function createEmptyMasteryState() {
  return {
    version: MASTERY_STATE_VERSION,
    concepts: {},
  }
}

export function createEmptyConceptEvidence() {
  return {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    firstSeen: null,
    lastSeen: null,
    lastCorrect: null,
    recent: [],
  }
}

// Shape check used by masteryStore.js when reading persisted state — a
// malformed or future-versioned payload is discarded rather than trusted.
export function isMasteryState(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.version === MASTERY_STATE_VERSION &&
    value.concepts !== null &&
    typeof value.concepts === 'object' &&
    !Array.isArray(value.concepts)
  )
}
