// ─── Canonical Learning Graph — public API ──────────────────────────────────
//
// Import from this file (or the individual modules) anywhere tags or concepts
// are read. Pure data + pure functions only — safe in node, tests, workers.
// See docs/system/LEARNING_GRAPH.md.

export {
  FACET_NAMESPACES,
  TAG_PATTERN,
  isValidTag,
  tagNamespace,
  isFacetTag,
} from './tagSchema.js'

export { resolveEffectiveTags } from './resolveTags.js'

export {
  ALL_CONCEPTS,
  CONCEPTS,
  CONCEPT_SUBJECT_NAMESPACES,
  getConcept,
  isConceptId,
  isConceptTag,
  getConceptsByCourse,
} from './conceptRegistry.js'

export {
  HISTORY_MEDICINE_CONCEPTS,
  MEDICINE_TOPICS,
  MEDICINE_SCREEN_TAG_CONCEPTS,
} from './concepts/historyMedicine.js'

export { COURSE_NODES } from './concepts/courseNodes.js'
