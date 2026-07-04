// ─── Learner Mastery Engine — derived scores ────────────────────────────────
//
// Mastery and confidence are computed from evidence at read time, never
// stored. That keeps the scoring model swappable: memory decay, response-time
// weighting and confidence buttons can change these formulas later without
// touching persisted learner data.
//
// mastery (0–1)    — best estimate of whether the learner knows the concept.
//                    Laplace-smoothed lifetime accuracy blended with the
//                    recent evidence window, weighted toward recent — recent
//                    failures matter more than old ones. This recency split
//                    is also the seam where time-based decay will plug in.
// confidence (0–1) — how confidently the learner retrieves the concept right
//                    now: recent success density scaled by evidence volume.
//                    Repeated success raises it; repeated failure or thin
//                    evidence keeps it low.
// strength         — coarse band over mastery for UI/planner consumption.

import { isConceptId } from '../learningGraph/conceptRegistry.js'
import { createEmptyConceptEvidence, STRENGTH_BANDS } from './masteryModel.js'

// Blend weights: recent evidence dominates lifetime totals.
const LIFETIME_WEIGHT = 0.4
const RECENT_WEIGHT = 0.6

// Scoring reads only the newest slice of the stored evidence window, so a
// recent run of failures moves the score even while older successes are
// still stored. Deliberately smaller than EVIDENCE_WINDOW: the stored window
// keeps history for future decay models; the score reacts faster.
const RECENT_SCORE_WINDOW = 5

// Evidence-volume half-point: confidence reaches 50% of its ceiling after
// this many attempts. Keeps one lucky answer from reading as certainty.
const CONFIDENCE_VOLUME_K = 3

// Laplace smoothing — pulls small samples toward 0.5 so a single answer
// never reads as 0% or 100% knowledge.
function smoothedAccuracy(correct, total) {
  return (correct + 1) / (total + 2)
}

function recentScoreSlice(evidence) {
  return evidence.recent.slice(-RECENT_SCORE_WINDOW)
}

export function calculateMastery(evidence) {
  if (!evidence || evidence.attempts === 0) return 0
  const lifetime = smoothedAccuracy(evidence.correct, evidence.attempts)
  const scored = recentScoreSlice(evidence)
  const recent = smoothedAccuracy(scored.filter(r => r.correct).length, scored.length)
  return LIFETIME_WEIGHT * lifetime + RECENT_WEIGHT * recent
}

export function calculateConfidence(evidence) {
  if (!evidence || evidence.attempts === 0) return 0
  const scored = recentScoreSlice(evidence)
  const recentDensity = smoothedAccuracy(scored.filter(r => r.correct).length, scored.length)
  const volume = evidence.attempts / (evidence.attempts + CONFIDENCE_VOLUME_K)
  return recentDensity * volume
}

export function calculateStrength(evidence) {
  if (!evidence || evidence.attempts === 0) return STRENGTH_BANDS.UNSEEN
  const mastery = calculateMastery(evidence)
  if (mastery < 0.45) return STRENGTH_BANDS.WEAK
  if (mastery < 0.7) return STRENGTH_BANDS.DEVELOPING
  if (mastery < 0.85) return STRENGTH_BANDS.SECURE
  return STRENGTH_BANDS.STRONG
}

// The main read API: one concept's full mastery picture — evidence plus
// derived scores. Registered-but-unpractised concepts return an 'unseen'
// snapshot; unregistered ids throw (same anti-drift rule as recording).
export function getConceptMastery(state, conceptId) {
  if (!isConceptId(conceptId)) {
    throw new TypeError(`masteryEngine: "${conceptId}" is not a registered concept id`)
  }
  const evidence = state.concepts[conceptId] ?? createEmptyConceptEvidence()
  return {
    conceptId,
    mastery: calculateMastery(evidence),
    confidence: calculateConfidence(evidence),
    strength: calculateStrength(evidence),
    attempts: evidence.attempts,
    correct: evidence.correct,
    incorrect: evidence.incorrect,
    streak: evidence.streak,
    firstSeen: evidence.firstSeen,
    lastSeen: evidence.lastSeen,
    lastCorrect: evidence.lastCorrect,
  }
}

// Snapshots for every concept the learner has evidence on, alphabetical by
// concept id for deterministic output.
export function getAllConceptMastery(state) {
  return Object.keys(state.concepts)
    .sort()
    .map(conceptId => getConceptMastery(state, conceptId))
}
