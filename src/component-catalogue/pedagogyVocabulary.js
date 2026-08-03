// ─── Pedagogical function vocabulary ────────────────────────────────────────
//
// BUILD-TIME GOVERNANCE DATA. The canonical, ordered list of pedagogical
// function tags an authoring entry's `pedagogy.functions` may use. The order
// is contractual: the generated runtime projection exports it verbatim, and
// the content-quality regression floor asserts the nine tags in this order.
//
// Changing this vocabulary (adding, renaming, merging, reordering) is a
// governance decision, not an implementation detail — the tags are named in
// docs/system/CONTENT_BUILD_TEMPLATE.md, PATTERN_GOVERNANCE.md and the
// content-create / content-review skills.

export const FUNCTION_TAGS = Object.freeze([
  'hook-tension',
  'introduce-figure',
  'teach-mechanism',
  'teach-comparison',
  'apply',
  'classify',
  'sequence-process',
  'retrieve',
  'exam-technique',
])

export const INTERACTION_CLASSES = Object.freeze(['passive', 'reveal', 'assessed'])
