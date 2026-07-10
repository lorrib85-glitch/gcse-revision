// ─── QuickFire bank → runtime question conversion ──────────────────────────
//
// Turns a QUICK_QUIZ_QUESTIONS bank row into the runtime shape the QuickFire
// screen renders. Extracted from QuickFireMode.jsx so the conversion is pure
// and unit-testable without React.
//
// Canonical workbook metadata (History Medicine synced rows) is forwarded
// verbatim so the mastery recorder can resolve concept tags from a converted
// question. The renderer ignores these fields, so forwarding them does not
// change the UI. Rows without the metadata (legacy / non-canonical) convert
// exactly as before and forward nothing — they resolve to zero concept ids, so
// the recorder records no evidence and never throws.

import { TAG_MODULE_MAP } from '../../../data/tagModuleMap.js'

export const CANONICAL_METADATA_FIELDS = [
  'tags', 'primaryConcept', 'secondaryConcepts', 'learningStage',
  'difficultyLevel', 'misconception', 'followUpConcept', 'acceptedAnswers',
]

export function quickFireFromBank(q) {
  const isTrueFalse = q.type === 'truefalse'
  const converted = {
    id: q.id,
    q: q.question,
    type: isTrueFalse ? 'truefalse' : 'mc',
    options: isTrueFalse ? ['True', 'False'] : q.options,
    correct: isTrueFalse ? (q.correct ? 0 : 1) : q.correctIndex,
    subject: q.subject,
    topic: q.topic,
    // `tag` is the canonical recovery-routing identity (TAG_MODULE_MAP key),
    // distinct from the human-readable `topic`. Forwarded so a QuickFire answer
    // can log its concept tag and feed weakness→recovery routing, not just the
    // mastery engine. Absent for untagged/non-canonical rows (fail-safe).
    tag: q.tag,
    moduleId: TAG_MODULE_MAP[q.tag] || null,
    ms: q.explanation,
    hint: q.reasoning,
  }
  for (const field of CANONICAL_METADATA_FIELDS) {
    if (q[field] !== undefined) converted[field] = q[field]
  }
  return converted
}
