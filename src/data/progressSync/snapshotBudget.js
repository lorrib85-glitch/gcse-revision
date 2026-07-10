// ─── Snapshot size budget — keep the cloud progress document safely small ────
//
// Firestore rejects any document over 1,048,576 bytes (1 MiB). We must never
// discover that at write time: this pure, governed utility measures a
// snapshot's serialised size before a cloud write and, when it is too large,
// compacts ONLY history structures that have explicit, tested retention rules —
// never core learner progress.
//
// Thresholds (bytes), with generous headroom below the 1 MiB hard Firestore
// limit for metadata, future fields and merge-time expansion:
//   - WARN_BYTES  700 KiB — approaching the budget; safe to compact proactively.
//   - HARD_BYTES  900 KiB — compact down to at least here before any write;
//                           ~127 KiB headroom remains under Firestore's 1 MiB.
//
// What is compacted (in priority order, most-expendable history first), and
// what is NOT:
//   1. gcse_qf_answer_log — folded into gcse_qf_baseline_v1 (LOSSLESS: totals
//      are preserved in the baseline; see progressMerge.js). Retain the newest
//      QF_BUDGET_RETAIN raw events for continued dedup evidence.
//   2. gcse_qf_q_history — per-question ranking detail; keep the newest
//      QF_HISTORY_RETAIN by lastAt. Aggregate accuracy lives in the QuickFire
//      memory buckets, which are untouched.
//   3. gcse_scores — the historical score log (already capped at 200); keep the
//      newest SCORES_BUDGET_RETAIN. The streak lives in gcse_progress, not here.
//
// NEVER compacted: gcse_progress (streak), gcse_module_* (completion),
// gcse_mastery_v1, gcse_planner_* (active planner), gcse_quickfire_memory_v1
// (aggregate buckets), gcse_qf_baseline_v1, gcse_qf_best, riseUser — and any
// unknown/future key passes through untouched. Deterministic and idempotent:
// retention caps are fixed, so re-running removes nothing further.

import { foldAnswerLogForBudget } from './progressMerge.js'

export const WARN_BYTES = 700 * 1024
export const HARD_BYTES = 900 * 1024
export const FIRESTORE_DOC_LIMIT_BYTES = 1024 * 1024

export const QF_BUDGET_RETAIN = 1500
export const QF_HISTORY_RETAIN = 1200
export const SCORES_BUDGET_RETAIN = 120

export function serializedSize(value) {
  const str = JSON.stringify(value ?? null)
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str).length
  if (typeof Buffer !== 'undefined') return Buffer.byteLength(str, 'utf8')
  return str.length
}

// Plain size classification, no mutation — used by the sync layer to decide
// whether a write is safe.
export function snapshotBudgetStatus(snapshot) {
  const bytes = serializedSize(snapshot)
  if (bytes > HARD_BYTES) return 'over'
  if (bytes > WARN_BYTES) return 'warn'
  return 'ok'
}

// ─── Governed compaction steps (each pure, each returns new data or same) ─────

function stepFoldAnswerLog(data) {
  const log = data.gcse_qf_answer_log
  if (!Array.isArray(log) || log.length <= QF_BUDGET_RETAIN) return data
  const { log: nextLog, baseline } = foldAnswerLogForBudget(log, data.gcse_qf_baseline_v1, QF_BUDGET_RETAIN)
  const next = { ...data, gcse_qf_answer_log: nextLog }
  if (baseline) next.gcse_qf_baseline_v1 = baseline
  return next
}

function stepTrimQuestionHistory(data) {
  const hist = data.gcse_qf_q_history
  if (!hist || typeof hist !== 'object' || Array.isArray(hist)) return data
  const entries = Object.entries(hist)
  if (entries.length <= QF_HISTORY_RETAIN) return data
  entries.sort((a, b) => (Number(b[1]?.lastAt) || 0) - (Number(a[1]?.lastAt) || 0))
  return { ...data, gcse_qf_q_history: Object.fromEntries(entries.slice(0, QF_HISTORY_RETAIN)) }
}

function stepTrimScores(data) {
  const scores = data.gcse_scores
  if (!Array.isArray(scores) || scores.length <= SCORES_BUDGET_RETAIN) return data
  // gcse_scores is stored newest-first (progress.js recordScore unshifts).
  return { ...data, gcse_scores: scores.slice(0, SCORES_BUDGET_RETAIN) }
}

const COMPACTION_STEPS = [stepFoldAnswerLog, stepTrimQuestionHistory, stepTrimScores]

// Measure a snapshot and, if it exceeds the hard budget, compact governed
// history until it fits (or no governed history remains to trim). Returns the
// (possibly new) snapshot plus a report. Never touches core progress, never
// removes an unknown key.
export function compactSnapshotForBudget(snapshot, { hardBytes = HARD_BYTES, warnBytes = WARN_BYTES } = {}) {
  const sizeBefore = serializedSize(snapshot)
  const report = (out, sizeAfter, compacted) => ({
    snapshot: out,
    sizeBefore,
    sizeAfter,
    compacted,
    withinBudget: sizeAfter <= hardBytes,
    overBudget: sizeAfter > hardBytes,
    warning: sizeAfter > warnBytes,
  })

  if (sizeBefore <= hardBytes) return report(snapshot, sizeBefore, false)

  let data = { ...(snapshot.data || {}) }
  let changed = false
  for (const step of COMPACTION_STEPS) {
    if (serializedSize({ ...snapshot, data }) <= hardBytes) break
    const next = step(data)
    if (next !== data) { data = next; changed = true }
  }

  const out = changed ? { ...snapshot, data } : snapshot
  return report(out, serializedSize(out), changed)
}
