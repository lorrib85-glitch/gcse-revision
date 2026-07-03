// ─── Canonical Learning Graph — tag grammar ─────────────────────────────────
//
// Every tag in the app is a lowercase, kebab-case, colon-separated string.
// There are exactly two families:
//
//   Facet tags    — `namespace:value` where namespace is one of
//                   FACET_NAMESPACES (e.g. `period:medieval`, `skill:recall`).
//                   They describe HOW/WHERE an object sits, not WHAT it teaches.
//
//   Concept tags  — `subject:course[:concept]` IDs registered in
//                   conceptRegistry.js (e.g. `history:medicine:galen`).
//                   They describe WHAT knowledge the object teaches or tests.
//
// This file owns only the grammar and facet vocabulary. Whether a tag is a
// registered concept is answered by conceptRegistry.js — never by spelling.
// See docs/system/LEARNING_GRAPH.md for naming rules.

export const FACET_NAMESPACES = [
  'subject',    // subject:history
  'course',     // course:medicine
  'period',     // period:medieval
  'theme',      // theme:public-health
  'topic',      // topic:osmosis — free question-bank topic label (pre-graph);
                // prefer a registered concept tag once the subject has one
  'skill',      // skill:recall
  'format',     // format:mc | format:written | format:truefalse
  'exam-type',  // exam-type:explain-why — canonical; matches EXAM_TYPE constants
  'paper',      // paper:medicine — exam-paper grouping
  'examboard',  // examboard:edexcel
  'tier',       // tier:gcse | tier:foundation | tier:higher
]

// lowercase kebab segments joined by colons: 2–4 segments total
const SEGMENT = '[a-z0-9]+(?:-[a-z0-9]+)*'
export const TAG_PATTERN = new RegExp(`^${SEGMENT}(?::${SEGMENT}){1,3}$`)

export function isValidTag(tag) {
  return typeof tag === 'string' && TAG_PATTERN.test(tag)
}

export function tagNamespace(tag) {
  return typeof tag === 'string' ? tag.split(':')[0] : null
}

// Facet tags are exactly two segments in a facet namespace.
export function isFacetTag(tag) {
  return (
    isValidTag(tag) &&
    tag.split(':').length === 2 &&
    FACET_NAMESPACES.includes(tagNamespace(tag))
  )
}
