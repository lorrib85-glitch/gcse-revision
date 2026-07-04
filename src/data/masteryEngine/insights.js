// ─── Learner Mastery Engine — insight queries ───────────────────────────────
//
// Read-only, deterministic queries over a mastery state. These are the
// recommendation surface future consumers (planner, QuickFire, weak-spot
// repair, Pulse, AI tutor, analytics) should build on — none of them selects
// questions; they only rank what the learner knows.
//
// Ordering is fully deterministic: score, then evidence volume, then concept
// id — so the same state always yields the same recommendation list.

import { getAllConceptMastery } from './masteryScore.js'

const DAY_MS = 24 * 60 * 60 * 1000

// Weakest first. Ties break toward more attempts (stronger evidence of a
// real weakness), then concept id.
export function identifyWeakConcepts(state, { limit = 5, minAttempts = 1 } = {}) {
  return getAllConceptMastery(state)
    .filter(snapshot => snapshot.attempts >= minAttempts)
    .sort(
      (a, b) =>
        a.mastery - b.mastery ||
        b.attempts - a.attempts ||
        a.conceptId.localeCompare(b.conceptId),
    )
    .slice(0, limit)
}

// Strongest first. Requires more evidence than weakness detection — calling
// a concept "strong" off one lucky answer would poison spaced retrieval.
export function identifyStrongConcepts(state, { limit = 5, minAttempts = 3 } = {}) {
  return getAllConceptMastery(state)
    .filter(snapshot => snapshot.attempts >= minAttempts)
    .sort(
      (a, b) =>
        b.mastery - a.mastery ||
        b.attempts - a.attempts ||
        a.conceptId.localeCompare(b.conceptId),
    )
    .slice(0, limit)
}

// Concepts the learner HAS practised but not recently — longest-unseen first.
// Never-practised concepts are not "neglected" (they're unseen curriculum);
// coverage gaps are a learning-graph query, not a mastery query.
export function identifyNeglectedConcepts(
  state,
  { now = Date.now(), staleDays = 7, limit = 5 } = {},
) {
  const cutoff = now - staleDays * DAY_MS
  return getAllConceptMastery(state)
    .filter(snapshot => snapshot.attempts > 0 && snapshot.lastSeen < cutoff)
    .sort((a, b) => a.lastSeen - b.lastSeen || a.conceptId.localeCompare(b.conceptId))
    .slice(0, limit)
}
