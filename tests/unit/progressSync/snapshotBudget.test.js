import { describe, it, expect } from 'vitest'
import {
  serializedSize, snapshotBudgetStatus, compactSnapshotForBudget,
  HARD_BYTES, WARN_BYTES, QF_BUDGET_RETAIN, FIRESTORE_DOC_LIMIT_BYTES,
} from '../../../src/data/progressSync/snapshotBudget.js'
import { mergeProgressData } from '../../../src/data/progressSync/progressMerge.js'

const SUBJECT = 'Maths'
const TOPIC_KEY = 'Maths::Algebra'

// Build a QuickFire answer log of `n` events for one device, plus a memory
// bucket whose running total matches (seed 0).
function quickFireSnapshot(n) {
  const log = []
  let correct = 0
  for (let i = 1; i <= n; i++) {
    const isCorrect = i % 2 === 0
    if (isCorrect) correct++
    log.push({ id: `A-${i}`, dev: 'A', seq: i, subject: SUBJECT, topicKey: TOPIC_KEY, correct: isCorrect, at: 1000 + i })
  }
  const bucket = (extra) => ({ answered: n, correct, seedAnswered: 0, seedCorrect: 0, ...extra })
  return {
    version: 1,
    updatedAt: Date.now(),
    data: {
      gcse_progress: { streak: 12, bestStreak: 20, lastActivityDate: '2026-07-10' },
      gcse_module_bio1: { screen: 8, completed: true },
      gcse_mastery_v1: { version: 1, concepts: { 'history:medicine:galen': { attempts: 5, correct: 4, lastSeen: 5 } } },
      gcse_qf_answer_log: log,
      gcse_quickfire_memory_v1: {
        subjects: { [SUBJECT]: bucket({ subject: SUBJECT }) },
        topics: { [TOPIC_KEY]: bucket({ key: TOPIC_KEY, subject: SUBJECT, topic: 'Algebra' }) },
      },
      some_future_key: { keepMe: true },
    },
  }
}

describe('snapshotBudget — measurement', () => {
  it('serializedSize counts UTF-8 bytes and status classifies against the thresholds', () => {
    expect(serializedSize({ a: 'hello' })).toBe(JSON.stringify({ a: 'hello' }).length)
    expect(snapshotBudgetStatus({ tiny: true })).toBe('ok')
    expect(HARD_BYTES).toBeLessThan(FIRESTORE_DOC_LIMIT_BYTES) // real headroom under Firestore's 1 MiB
    expect(WARN_BYTES).toBeLessThan(HARD_BYTES)
  })

  it('leaves a small snapshot untouched (no compaction)', () => {
    const snap = quickFireSnapshot(10)
    const result = compactSnapshotForBudget(snap)
    expect(result.compacted).toBe(false)
    expect(result.snapshot).toBe(snap)
    expect(result.withinBudget).toBe(true)
  })
})

describe('snapshotBudget — compaction of an oversized snapshot', () => {
  // ~10k QuickFire events pushes the snapshot over the real hard budget.
  const snap = quickFireSnapshot(10000)

  it('the raw snapshot genuinely exceeds the hard budget', () => {
    expect(serializedSize(snap)).toBeGreaterThan(HARD_BYTES)
  })

  it('compacts under the hard budget while preserving core progress and unknown keys', () => {
    const result = compactSnapshotForBudget(snap)
    expect(result.compacted).toBe(true)
    expect(result.sizeAfter).toBeLessThanOrEqual(HARD_BYTES)
    expect(result.sizeAfter).toBeLessThan(result.sizeBefore)

    const d = result.snapshot.data
    // Core learner state is byte-for-byte unchanged.
    expect(d.gcse_progress).toEqual(snap.data.gcse_progress)
    expect(d.gcse_module_bio1).toEqual(snap.data.gcse_module_bio1)
    expect(d.gcse_mastery_v1).toEqual(snap.data.gcse_mastery_v1)
    // Unknown/future key preserved.
    expect(d.some_future_key).toEqual({ keepMe: true })
    // The raw log was folded down to the retention window.
    expect(d.gcse_qf_answer_log.length).toBe(QF_BUDGET_RETAIN)
    expect(d.gcse_qf_baseline_v1).toBeTruthy()
  })

  it('the compaction is lossless — reconstructed QuickFire totals are unchanged', () => {
    const before = snap.data.gcse_quickfire_memory_v1.subjects[SUBJECT]
    const result = compactSnapshotForBudget(snap)
    // Reconstruct by merging the compacted snapshot with an empty cloud.
    const merged = mergeProgressData(result.snapshot.data, {})
    const after = merged.gcse_quickfire_memory_v1.subjects[SUBJECT]
    expect(after.answered).toBe(before.answered) // 10000
    expect(after.correct).toBe(before.correct)
  })

  it('is idempotent — compacting the result again removes nothing further', () => {
    const once = compactSnapshotForBudget(snap).snapshot
    const twice = compactSnapshotForBudget(once)
    expect(twice.snapshot.data.gcse_qf_answer_log.length)
      .toBe(once.data.gcse_qf_answer_log.length)
  })
})

describe('snapshotBudget — governed trimming with a tight budget', () => {
  it('trims historical score log and question history only when needed, keeping newest', () => {
    const scores = Array.from({ length: 400 }, (_, i) => ({ date: `2026-01-${i}`, pct: i, seq: i }))
    const qHist = {}
    for (let i = 0; i < 3000; i++) qHist[`q${i}`] = { attempts: 1, correct: 1, lastAt: i }
    const snap = {
      version: 1, updatedAt: Date.now(),
      data: { gcse_progress: { streak: 3 }, gcse_scores: scores, gcse_qf_q_history: qHist },
    }
    // Force compaction with a tiny hard budget.
    const result = compactSnapshotForBudget(snap, { hardBytes: 200, warnBytes: 100 })
    expect(result.compacted).toBe(true)
    // Newest scores kept (unshift order = newest first).
    expect(result.snapshot.data.gcse_scores[0]).toEqual(scores[0])
    expect(result.snapshot.data.gcse_scores.length).toBeLessThan(400)
    // Core untouched.
    expect(result.snapshot.data.gcse_progress).toEqual({ streak: 3 })
  })
})
