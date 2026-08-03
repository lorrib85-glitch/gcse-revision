// ─── Non-authoring pedagogy registry ────────────────────────────────────────
//
// BUILD-TIME GOVERNANCE DATA. Pedagogical classifications for types that are
// deliberately NOT authoring entries: no screen or block of this type may
// appear in chapter content, but a live consumer still reads the
// classification through the flat compatibility API.
//
// This is a shrinking set under the same discipline as the authoring
// compatibility registry: every entry exists because a named consumer needs
// it, carries the reason, and carries the condition under which it is
// deleted. Adding an entry requires an explicit decision — never add one to
// park a classification that has nowhere better to live, and never add one
// for a type with no live consumer.

export const NON_AUTHORING_PEDAGOGY = Object.freeze([
  Object.freeze({
    type: 'calculationBreakdown',
    pedagogy: Object.freeze({
      functions: Object.freeze(['sequence-process', 'apply']),
      interaction: 'assessed',
    }),
    reason: 'The production-bundled Component Lab derives its interaction badge for the CalculationBreakdown entry from getTypeInfo("calculationBreakdown") (reviewManifestCore.jsx); the component is catalogued and storied but has no authoring entry, so nothing else carries this fact.',
    removalCondition: 'Delete this entry when Phase 4 replaces the Lab manifest’s getTypeInfo dependency, or when CalculationBreakdown receives a genuine authoring entry — whichever happens first.',
  }),
])
