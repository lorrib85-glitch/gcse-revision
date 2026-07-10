// ─── Quick Fire ranking memory — per-answer persistence ────────────────────
//
// gcse_quickfire_memory_v1 ({ subjects: {[key]: bucket}, topics: {[key]: bucket} })
// is the running accuracy memory selectQuickFireQueue() reads to prioritise
// weak subjects/topics. It is updated immediately after each committed
// answer (bumpQuickFireMemoryForAnswer), never batched to round end — a
// learner who closes the tab mid-round keeps every answer they made in this
// memory. QuickFireMode's finishRound only *reads* it for the summary
// screen; it never writes to it, so a round finishing normally can't
// double-count what per-answer writes already persisted, and re-rendering
// the summary (refresh, back-nav) is side-effect-free.
//
// Each bump also appends a stable-id event to gcse_qf_answer_log and
// captures a one-time seed (seedAnswered/seedCorrect) the first time a
// bucket is touched — the bucket's value at that moment, i.e. the last
// value two devices synced from before diverging. That's what lets
// progressMerge.js reconstruct the true total across two devices that
// independently answered different questions before syncing again
// (seed + deduplicated events), instead of losing whichever side's activity
// a naive max-merge would drop. Buckets with no matching events on either
// side (pre-log legacy data) fall back to the old max-merge there, so
// historical aggregate-only records stay readable.

import { getJson, setJson } from '../../../lib/storage.js'
import { qfQuestionId } from './questionId.js'

export const QUICK_FIRE_MEMORY_KEY = 'gcse_quickfire_memory_v1'
export const QF_ANSWER_LOG_KEY = 'gcse_qf_answer_log'
export const QF_ANSWER_LOG_CAP = 4000

export function readQuickFireMemory() {
  return getJson(QUICK_FIRE_MEMORY_KEY, { subjects: {}, topics: {} })
}

export function qfAnswerEventId(question) {
  return `${qfQuestionId(question)}:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`
}

function bumpSeededBucket(buckets, key, isCorrect, extra = {}) {
  const next = { ...buckets }
  const current = next[key] || { answered: 0, correct: 0, ...extra }
  const hasSeed = current.seedAnswered !== undefined
  next[key] = {
    ...current,
    ...extra,
    seedAnswered: hasSeed ? current.seedAnswered : (current.answered || 0),
    seedCorrect: hasSeed ? current.seedCorrect : (current.correct || 0),
    answered: (current.answered || 0) + 1,
    correct: (current.correct || 0) + (isCorrect ? 1 : 0),
  }
  return next
}

// Persists one committed answer immediately: bumps the subject/topic
// running-total buckets by exactly 1, and appends a matching event to the
// answer log. Call this from the onAnswer handler, not from round-end.
export function bumpQuickFireMemoryForAnswer(question, isCorrect) {
  const memory = readQuickFireMemory()
  const subject = question.subject || 'Quick Fire'
  const topic = question.topic || subject
  const topicKey = subject + '::' + topic
  const next = {
    subjects: bumpSeededBucket(memory.subjects || {}, subject, isCorrect, { subject }),
    topics: bumpSeededBucket(memory.topics || {}, topicKey, isCorrect, {
      key: topicKey, subject, topic, moduleId: question.moduleId || null,
    }),
    updatedAt: new Date().toISOString(),
  }
  setJson(QUICK_FIRE_MEMORY_KEY, next)

  const log = getJson(QF_ANSWER_LOG_KEY, [])
  log.unshift({ id: qfAnswerEventId(question), subject, topicKey, correct: isCorrect, at: Date.now() })
  setJson(QF_ANSWER_LOG_KEY, log.slice(0, QF_ANSWER_LOG_CAP))

  return next
}

export function bucketAccuracy(bucket) {
  return bucket?.answered ? Math.round((bucket.correct / bucket.answered) * 100) : 0
}
