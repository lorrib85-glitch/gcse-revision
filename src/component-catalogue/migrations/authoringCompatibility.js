// ─── Authoring compatibility registry ──────────────────────────────────────
//
// BUILD-TIME GOVERNANCE DATA. Like the rest of `src/component-catalogue/**`,
// the learner runtime never imports this file; the generator reads it and the
// projection carries only the fields the runtime needs.
//
// A compatibility entry is a type that authored content still references but
// that no component implements. It exists so the migration stays explicit and
// CI can stop it growing — not as a tombstone. These entries were never routed
// by ChapterPlayer even before the registry existed: content carrying them
// renders the LegacyUnroutedBlock notice.
//
// This is deliberately NOT the place for a type nothing references. A retired
// type with no live content is deleted outright, and
// `tests/architecture/authoring-registry-integrity.test.js` fails an entry here
// the moment its last authored reference disappears — the removal condition is
// a forcing function, not a wish.
//
// Do not add an entry to keep a *component* record tidy. Every entry here is a
// debt with a named way out.

export const AUTHORING_COMPATIBILITY = Object.freeze([
  Object.freeze({
    type: 'appliedscenario',
    level: 'block',
    authoringName: 'Applied scenario (legacy)',
    layout: 'content',
    continuation: 'player',
    headerMode: 'standard',
    status: 'legacy',
    replacement: 'scenario',
    currentHandler: 'LegacyUnroutedBlock',
    reason: 'Extracted chapter content carries this name, but the pre-registry ChapterPlayer never routed it. Its data shape is already a scenarios array, so the content is migratable as-is.',
    removalCondition: 'Delete this entry once no chapter content references type "appliedscenario"; the authored screens move to "scenario" unchanged.',
    required: [{ path: 'scenarios', kind: 'array' }],
    requiredAny: [],
  }),
  Object.freeze({
    type: 'examscored',
    level: 'block',
    authoringName: 'Exam scored response (legacy)',
    layout: 'content',
    continuation: 'player',
    headerMode: 'standard',
    status: 'legacy',
    replacement: 'boss',
    currentHandler: 'LegacyUnroutedBlock',
    reason: 'A scored exam-response block from the pre-registry content, never routed. ExamQuestionFrame now owns exam-question presentation, including the mark scheme.',
    removalCondition: 'Delete this entry once no chapter content references type "examscored"; the authored questions move to "boss" with markScheme preserved.',
    required: [
      { path: 'question', kind: 'string' },
      { path: 'markScheme', kind: 'array' },
    ],
    requiredAny: [],
  }),
  Object.freeze({
    type: 'tieredquiz',
    level: 'block',
    authoringName: 'Tiered quiz block (legacy)',
    layout: 'content',
    continuation: 'player',
    headerMode: 'standard',
    status: 'legacy',
    replacement: 'quickRecall',
    currentHandler: 'LegacyUnroutedBlock',
    reason: 'A nested tiered-quiz block, never routed. Distinct from the active tieredquiz *screen* type, which is a different level and does render through TieredQuizScreen.',
    removalCondition: 'Delete this entry once no chapter content references a block of type "tieredquiz"; the authored tiers move to "quickRecall" questions.',
    required: [{ path: 'tiers', kind: 'array' }],
    requiredAny: [],
  }),
  Object.freeze({
    type: 'timelinedrag',
    level: 'block',
    authoringName: 'Timeline drag (legacy)',
    layout: 'content',
    continuation: 'player',
    headerMode: 'standard',
    status: 'legacy',
    replacement: 'orderedRouteTask',
    currentHandler: 'LegacyUnroutedBlock',
    reason: 'A drag-to-order timeline block, never routed. OrderedRouteTask is the governed sequencing interaction and covers the same learning job.',
    removalCondition: 'Delete this entry once no chapter content references type "timelinedrag"; the authored items move to an "orderedRouteTask" screen.',
    required: [
      { path: 'people', kind: 'array' },
      { path: 'items', kind: 'array' },
    ],
    requiredAny: [],
  }),
])
