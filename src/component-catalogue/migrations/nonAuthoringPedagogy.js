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
//
// **The set is now empty, and that is the discipline finishing rather than a
// gap.** Its one entry classified `calculationBreakdown` while the component
// was catalogued and storied but had no authoring entry. Phase 4 gave
// CalculationBreakdown a genuine `screen:calculationBreakdown` entry carrying
// that exact classification, and this entry was deleted only afterwards, once
// the projection read the fact from the record instead.
//
// The generator enforces that order in one direction only: `projectPedagogy`
// throws the moment a non-authoring type collides with an authoring entry, so
// the shim cannot outlive its replacement — and because the classification
// moved before the deletion, no observable value changed. Keep the file: it is
// where the next genuinely non-authorable classification has to argue its
// case, and the rules above are the argument it must survive.

export const NON_AUTHORING_PEDAGOGY = Object.freeze([])
