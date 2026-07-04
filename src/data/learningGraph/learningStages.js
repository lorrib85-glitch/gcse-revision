// ─── Canonical Learning Graph — learning stages ─────────────────────────────
//
// The single canonical list of learning stages, ordered as a ladder from
// lowest to highest cognitive demand. An objective is the pair
// (conceptId, stage) — see docs/system/LEARNING_OBJECTIVE_LAYER.md §2.
//
// Every layer that speaks about stages (workbook sync, evidence recording,
// objective reads, future tutor decisions) must import this list — never
// redefine it. Promoted here from the Set previously local to
// tests/architecture/quickfire-workbook-sync.test.js.

export const LEARNING_STAGES = ['recognise', 'recall', 'understand', 'apply', 'analyse', 'evaluate']

export function isLearningStage(value) {
  return LEARNING_STAGES.includes(value)
}
