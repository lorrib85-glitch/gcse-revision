// ─── QuickFire → Mastery Engine recorder (Phase 3A) ─────────────────────────
//
// The first authorised consumer of the mastery engine. Write-only: QuickFire
// answers become per-concept evidence; nothing here reads mastery back, and
// question selection is untouched.
//
// Flow per answered question:
//   1. Resolve effective tags (topic layer → question layer). QuickFire has
//      no module object in hand; medicine's topic layer is the only one with
//      tags today and module-level medicine tags are facets only, so nothing
//      concept-shaped is lost.
//   2. Keep only tags in a registry-claimed concept namespace (course nodes
//      included — biology/maths/english banks carry only course-node concepts
//      so far). Facet tags (period:, skill:, format:, …) are ignored.
//   3. Record each as evidence via the engine's public API. An unregistered
//      id in a concept namespace is deliberately passed through so the
//      engine's validation throws — never silently dropped. Architecture
//      tests keep shipped content registered, so a throw here means a real
//      data bug.
//   4. Untagged questions (chemistry placeholders, 90s-quiz conversions)
//      resolve to zero concept ids and are safely ignored.
//   5. Every event carries source: 'quickfire'; the primary concept's event
//      is stamped with the question's learningStage when present. Secondary
//      concepts stay concept-level — the stage describes the demand on the
//      primary only (docs/system/EVIDENCE_MODEL.md §6).

import {
  resolveEffectiveTags,
  MEDICINE_TOPICS,
  CONCEPT_SUBJECT_NAMESPACES,
  tagNamespace,
} from '../../../data/learningGraph/index.js'
import {
  recordAttempt,
  loadMasteryState,
  saveMasteryState,
} from '../../../data/masteryEngine/index.js'

export function conceptIdsForQuestion(question) {
  const effective = resolveEffectiveTags(
    MEDICINE_TOPICS[question?.topicId]?.tags,
    question?.tags,
  )
  return effective.filter(tag => CONCEPT_SUBJECT_NAMESPACES.includes(tagNamespace(tag)))
}

const EVIDENCE_SOURCE = 'quickfire'

// Pure core: fold one answered question into a mastery state.
export function recordQuestionAttempt(state, question, correct, at = Date.now()) {
  const stage = question?.learningStage
  return conceptIdsForQuestion(question).reduce(
    (acc, conceptId) =>
      recordAttempt(acc, {
        conceptId,
        correct,
        at,
        source: EVIDENCE_SOURCE,
        // An invalid stage passes through so the engine throws (data bug),
        // same fail-loud policy as unregistered concept ids above.
        ...(stage != null && conceptId === question.primaryConcept && { stage }),
      }),
    state,
  )
}

// Persisting wrapper used by the QuickFire modes: load → record → save.
// No-ops for questions that resolve to no concept ids, so untagged content
// never touches storage.
export function recordQuestionResult(question, correct) {
  if (conceptIdsForQuestion(question).length === 0) return
  saveMasteryState(recordQuestionAttempt(loadMasteryState(), question, correct))
}
