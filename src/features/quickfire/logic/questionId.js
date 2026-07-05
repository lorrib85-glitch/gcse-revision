// ─── Quick Fire per-question identity ────────────────────────────────────────
//
// Key used for the per-question history store (gcse_qf_q_history). Prefers
// the question bank's stable id so editing question text never resets a
// question's history. Legacy questions without an id keep the original
// text-derived key, so their stored history is preserved.

export function qfQuestionId(q) {
  if (q.id) return q.id
  if (q.questionId) return q.questionId
  return (q.subject || '') + '::' + (q.q || '').slice(0, 40)
}
