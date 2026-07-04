// ─── Learner Mastery Engine — public API ────────────────────────────────────
//
// The single source of truth for what ONE LEARNER knows, per concept in the
// canonical learning graph. All future adaptive features (QuickFire, weak
// spot recovery, daily planner, Pulse, AI tutor, exam practice, parent
// dashboard, analytics) read and write learner knowledge through this API —
// never through their own bespoke scores. See docs/system/MASTERY_ENGINE.md.
//
// Pure logic layer: no React, no UI, no component imports. Persistence lives
// only in masteryStore.js, behind src/lib/storage.js.

export {
  MASTERY_STATE_VERSION,
  EVIDENCE_WINDOW,
  STRENGTH_BANDS,
  createEmptyMasteryState,
  createEmptyConceptEvidence,
  isMasteryState,
} from './masteryModel.js'

export {
  recordAttempt,
  recordCorrect,
  recordIncorrect,
  mergeEvidence,
} from './evidence.js'

export {
  calculateMastery,
  calculateConfidence,
  calculateStrength,
  getConceptMastery,
  getAllConceptMastery,
} from './masteryScore.js'

export {
  identifyWeakConcepts,
  identifyStrongConcepts,
  identifyNeglectedConcepts,
  getObjectiveEvidence,
} from './insights.js'

export {
  MASTERY_STORAGE_KEY,
  loadMasteryState,
  saveMasteryState,
} from './masteryStore.js'
