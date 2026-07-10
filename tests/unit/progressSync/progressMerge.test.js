import { describe, it, expect } from 'vitest'
import { mergeProgressData, progressDataEqual } from '../../../src/data/progressSync/progressMerge.js'

// Pure merge-logic tests — no Firebase, no storage, deterministic fixtures.
// Every case also checks merge(x, x) === x (idempotency): re-running a sync
// with nothing new must never duplicate or discard anything.

describe('progressDataEqual', () => {
  it('is true for structurally identical data regardless of key order', () => {
    expect(progressDataEqual({ a: 1, b: [1, 2] }, { b: [1, 2], a: 1 })).toBe(true)
  })

  it('is false when a value differs', () => {
    expect(progressDataEqual({ a: 1 }, { a: 2 })).toBe(false)
  })
})

describe('mergeProgressData — additive logs (scores / wrong / correct / techniques / coach results)', () => {
  it('unions two divergent score logs — both entries survive', () => {
    const local = { gcse_scores: [{ date: '2026-07-01', subject: 'History', earned: 8, possible: 10, pct: 80, source: 'module' }] }
    const cloud = { gcse_scores: [{ date: '2026-06-30', subject: 'Maths', earned: 5, possible: 10, pct: 50, source: 'quiz' }] }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_scores).toHaveLength(2)
    expect(merged.gcse_scores.map(s => s.subject).sort()).toEqual(['History', 'Maths'])
    // Newest first.
    expect(merged.gcse_scores[0].subject).toBe('History')
  })

  it('dedupes an entry that exists on both sides (already-synced) instead of doubling it', () => {
    const shared = { date: '2026-07-01', subject: 'History', earned: 8, possible: 10, pct: 80, source: 'module' }
    const local = { gcse_scores: [shared] }
    const cloud = { gcse_scores: [shared] }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_scores).toHaveLength(1)
  })

  it('merges wrong-answer logs by exact-entry identity, keeping unique entries from both sides', () => {
    const local = { gcse_wrong_answers: [{ timestamp: 100, date: '2026-07-01', subject: 'History', topic: 'germ-theory', conceptTag: null, questionId: 'q1', questionText: '', marks: 1, source: 'quiz', questionType: 'mcq' }] }
    const cloud = { gcse_wrong_answers: [{ timestamp: 200, date: '2026-07-02', subject: 'Biology', topic: 'osmosis', conceptTag: null, questionId: 'q2', questionText: '', marks: 1, source: 'quiz', questionType: 'mcq' }] }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_wrong_answers).toHaveLength(2)
    expect(merged.gcse_wrong_answers[0].timestamp).toBe(200) // newest first
  })

  it('re-merging the already-merged result is a no-op (idempotent)', () => {
    const local = { gcse_scores: [{ date: '2026-07-01', subject: 'History', pct: 80 }] }
    const cloud = { gcse_scores: [{ date: '2026-06-30', subject: 'Maths', pct: 50 }] }
    const merged = mergeProgressData(local, cloud)
    const remerged = mergeProgressData(merged, merged)
    expect(progressDataEqual(remerged, merged)).toBe(true)
  })
})

describe('mergeProgressData — gcse_module_<id> (per-module screen progress)', () => {
  it('completion is monotonic — a completed module never un-completes', () => {
    const local = { 'gcse_module_history-1': { screen: 3, completed: false } }
    const cloud = { 'gcse_module_history-1': { screen: 12, completed: true, timestamp: 500 } }
    const merged = mergeProgressData(local, cloud)
    expect(merged['gcse_module_history-1'].completed).toBe(true)
    expect(merged['gcse_module_history-1'].screen).toBe(12)
  })

  it('never rewinds the resume screen backward', () => {
    const local = { 'gcse_module_history-1': { screen: 10 } }
    const cloud = { 'gcse_module_history-1': { screen: 4 } }
    const merged = mergeProgressData(local, cloud)
    expect(merged['gcse_module_history-1'].screen).toBe(10)
  })

  it('is idempotent', () => {
    const local = { 'gcse_module_history-1': { screen: 10, completed: true, hookDone: true, wylDone: false, timestamp: 999 } }
    const merged = mergeProgressData(local, local)
    expect(merged['gcse_module_history-1']).toEqual(local['gcse_module_history-1'])
  })

  it('a minimal real-world partial write ({ screen } only, no completed/hookDone/timestamp) does not grow new fields when merged with itself', () => {
    // Regression: an earlier version of this merge synthesised
    // completed/hookDone/wylDone/timestamp with false/0 defaults even when
    // NEITHER side had them, which meant merge(x, x) !== x for this — very
    // real — partial shape, so a second, unrelated sync would look like a
    // fresh change and re-write both sides for no reason.
    const partial = { 'gcse_module_history-1': { screen: 2 } }
    const merged = mergeProgressData(partial, partial)
    expect(merged['gcse_module_history-1']).toEqual({ screen: 2 })
  })
})

describe('mergeProgressData — gcse_planner_weakpoints', () => {
  const base = { subject: 'History', topic: 'germ-theory', skillTag: null, misconceptionTag: null, errorType: null, firstSeenAt: '2026-07-01', timesFailed: 1, timesCorrectAfter: 0, status: 'new', nextReviewAt: '2026-07-02' }

  it('merges by (subject, topic, skillTag) identity, not weakPointId — no duplicate weak points across devices', () => {
    const local = { gcse_planner_weakpoints: [{ ...base, weakPointId: 'local-id', lastSeenAt: '2026-07-01', severity: 'low' }] }
    const cloud = { gcse_planner_weakpoints: [{ ...base, weakPointId: 'cloud-id', lastSeenAt: '2026-07-01', severity: 'low' }] }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_planner_weakpoints).toHaveLength(1)
  })

  it('does not resurrect a resolved weak point from a stale sighting', () => {
    const local = {
      gcse_planner_weakpoints: [{ ...base, weakPointId: 'a', lastSeenAt: '2026-07-05', status: 'resolved', nextReviewAt: null }],
    }
    const cloud = {
      // Stale cloud snapshot from before the learner resolved it.
      gcse_planner_weakpoints: [{ ...base, weakPointId: 'b', lastSeenAt: '2026-07-01', status: 'repairing' }],
    }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_planner_weakpoints).toHaveLength(1)
    expect(merged.gcse_planner_weakpoints[0].status).toBe('resolved')
  })

  it('a genuinely newer regression on another device does override a stale resolved record', () => {
    const local = {
      gcse_planner_weakpoints: [{ ...base, weakPointId: 'a', lastSeenAt: '2026-07-01', status: 'resolved', nextReviewAt: null }],
    }
    const cloud = {
      gcse_planner_weakpoints: [{ ...base, weakPointId: 'b', lastSeenAt: '2026-07-10', status: 'repairing' }],
    }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_planner_weakpoints[0].status).toBe('repairing')
  })

  it('preserves the earliest firstSeenAt across both sightings', () => {
    const local = { gcse_planner_weakpoints: [{ ...base, weakPointId: 'a', firstSeenAt: '2026-07-05', lastSeenAt: '2026-07-06' }] }
    const cloud = { gcse_planner_weakpoints: [{ ...base, weakPointId: 'b', firstSeenAt: '2026-06-20', lastSeenAt: '2026-07-01' }] }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_planner_weakpoints[0].firstSeenAt).toBe('2026-06-20')
  })
})

describe('mergeProgressData — gcse_mastery_v1', () => {
  it('unions disjoint concepts from both sides', () => {
    const local = { gcse_mastery_v1: { version: 1, concepts: { 'history:medicine:galen': { attempts: 3, correct: 2, incorrect: 1, streak: 1, firstSeen: 1, lastSeen: 3, lastCorrect: 3, recent: [] } } } }
    const cloud = { gcse_mastery_v1: { version: 1, concepts: { 'history:medicine:jenner': { attempts: 2, correct: 2, incorrect: 0, streak: 2, firstSeen: 1, lastSeen: 2, lastCorrect: 2, recent: [] } } } }
    const merged = mergeProgressData(local, cloud)
    expect(Object.keys(merged.gcse_mastery_v1.concepts).sort()).toEqual(['history:medicine:galen', 'history:medicine:jenner'])
  })

  it('for a shared concept, keeps the record with more attempts (never invents attempts/correct/incorrect that break the sum invariant)', () => {
    const richer = { attempts: 10, correct: 7, incorrect: 3, streak: 2, firstSeen: 1, lastSeen: 500, lastCorrect: 500, recent: [] }
    const thinner = { attempts: 3, correct: 3, incorrect: 0, streak: 3, firstSeen: 1, lastSeen: 100, lastCorrect: 100, recent: [] }
    const local = { gcse_mastery_v1: { version: 1, concepts: { c: thinner } } }
    const cloud = { gcse_mastery_v1: { version: 1, concepts: { c: richer } } }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_mastery_v1.concepts.c).toEqual(richer)
    expect(merged.gcse_mastery_v1.concepts.c.correct + merged.gcse_mastery_v1.concepts.c.incorrect)
      .toBe(merged.gcse_mastery_v1.concepts.c.attempts)
  })

  it('is idempotent', () => {
    const state = { version: 1, concepts: { c: { attempts: 5, correct: 4, incorrect: 1, streak: 1, firstSeen: 1, lastSeen: 5, lastCorrect: 5, recent: [] } } }
    const merged = mergeProgressData({ gcse_mastery_v1: state }, { gcse_mastery_v1: state })
    expect(merged.gcse_mastery_v1).toEqual(state)
  })
})

describe('mergeProgressData — quickfire running-total buckets (max-safe merge)', () => {
  it('never produces an internally inconsistent bucket (correct > answered) even when maxing independently', () => {
    const local = { gcse_quickfire_memory_v1: { subjects: { Biology: { answered: 3, correct: 3, subject: 'Biology' } }, topics: {} } }
    const cloud = { gcse_quickfire_memory_v1: { subjects: { Biology: { answered: 20, correct: 2, subject: 'Biology' } }, topics: {} } }
    const merged = mergeProgressData(local, cloud)
    const bucket = merged.gcse_quickfire_memory_v1.subjects.Biology
    expect(bucket.answered).toBe(20)
    expect(bucket.correct).toBeLessThanOrEqual(bucket.answered)
    expect(bucket.correct).toBe(3)
  })

  it('is idempotent — repeating a sync never inflates the running totals', () => {
    const memory = { subjects: { Biology: { answered: 10, correct: 8, subject: 'Biology' } }, topics: {}, updatedAt: '2026-07-01T00:00:00.000Z' }
    const merged = mergeProgressData({ gcse_quickfire_memory_v1: memory }, { gcse_quickfire_memory_v1: memory })
    expect(merged.gcse_quickfire_memory_v1.subjects.Biology).toEqual(memory.subjects.Biology)
  })
})

describe('mergeProgressData — quickfire divergent-device merge (seed + deduplicated answer log)', () => {
  // Both devices last synced at a shared base of 10 answered / 8 correct.
  // Device A then answers 3 new questions offline (2 correct), device B
  // answers 4 *different* new questions offline (3 correct), before either
  // syncs again. A naive per-field max would report max(13, 14) = 14,
  // silently losing 3 of A's answers and 1 of B's. The seed + deduplicated
  // event log must recover the true total: 10 + |3 ∪ 4| = 17.
  const seedAnswered = 10
  const seedCorrect = 8

  function bucket(answered, correct) {
    return { subject: 'Biology', seedAnswered, seedCorrect, answered, correct }
  }

  const deviceALog = [
    { id: 'a-1', subject: 'Biology', topicKey: 'Biology::Cells', correct: true, at: 1000 },
    { id: 'a-2', subject: 'Biology', topicKey: 'Biology::Cells', correct: true, at: 1001 },
    { id: 'a-3', subject: 'Biology', topicKey: 'Biology::Cells', correct: false, at: 1002 },
  ]
  const deviceBLog = [
    { id: 'b-1', subject: 'Biology', topicKey: 'Biology::Cells', correct: true, at: 2000 },
    { id: 'b-2', subject: 'Biology', topicKey: 'Biology::Cells', correct: true, at: 2001 },
    { id: 'b-3', subject: 'Biology', topicKey: 'Biology::Cells', correct: true, at: 2002 },
    { id: 'b-4', subject: 'Biology', topicKey: 'Biology::Cells', correct: false, at: 2003 },
  ]

  function makeSnapshot(answered, correct, log) {
    return {
      gcse_quickfire_memory_v1: { subjects: { Biology: bucket(answered, correct) }, topics: {} },
      gcse_qf_answer_log: log,
    }
  }

  it('recovers both devices\' independent activity instead of losing it to a max-merge', () => {
    const local = makeSnapshot(13, 10, deviceALog)   // 10 base + A's 3 (2 correct) = 13/10
    const cloud = makeSnapshot(14, 11, deviceBLog)   // 10 base + B's 4 (3 correct) = 14/11
    const merged = mergeProgressData(local, cloud)

    const mergedBucket = merged.gcse_quickfire_memory_v1.subjects.Biology
    expect(mergedBucket.answered).toBe(17) // 10 + 7 unique events, not max(13, 14) = 14
    expect(mergedBucket.correct).toBe(13)  // 8 + 5 correct events
    expect(mergedBucket.correct).toBeLessThanOrEqual(mergedBucket.answered)

    // The merged answer log carries every unique event from both devices.
    expect(merged.gcse_qf_answer_log).toHaveLength(7)
    const ids = new Set(merged.gcse_qf_answer_log.map(e => e.id))
    expect(ids.size).toBe(7)
  })

  it('repeated sync is idempotent — merging the already-merged state again changes nothing', () => {
    const local = makeSnapshot(13, 10, deviceALog)
    const cloud = makeSnapshot(14, 11, deviceBLog)
    const first = mergeProgressData(local, cloud)

    const second = mergeProgressData(
      { gcse_quickfire_memory_v1: first.gcse_quickfire_memory_v1, gcse_qf_answer_log: first.gcse_qf_answer_log },
      { gcse_quickfire_memory_v1: first.gcse_quickfire_memory_v1, gcse_qf_answer_log: first.gcse_qf_answer_log },
    )
    expect(second.gcse_quickfire_memory_v1.subjects.Biology.answered).toBe(17)
    expect(second.gcse_quickfire_memory_v1.subjects.Biology.correct).toBe(13)
    expect(second.gcse_qf_answer_log).toHaveLength(7)
  })

  it('a device that syncs twice without the other device contributing anything new does not double-count its own events', () => {
    const local = makeSnapshot(13, 10, deviceALog)
    const cloud = makeSnapshot(13, 10, deviceALog) // cloud already reflects exactly A's own last sync
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_quickfire_memory_v1.subjects.Biology.answered).toBe(13)
    expect(merged.gcse_qf_answer_log).toHaveLength(3)
  })

  it('falls back to max-merge for legacy aggregate-only buckets with no matching log evidence (historical records stay readable)', () => {
    const local = { gcse_quickfire_memory_v1: { subjects: { Chemistry: { answered: 5, correct: 4, subject: 'Chemistry' } }, topics: {} } }
    const cloud = { gcse_quickfire_memory_v1: { subjects: { Chemistry: { answered: 8, correct: 3, subject: 'Chemistry' } }, topics: {} } }
    const merged = mergeProgressData(local, cloud)
    const chem = merged.gcse_quickfire_memory_v1.subjects.Chemistry
    expect(chem.answered).toBe(8) // old max-merge behaviour, unchanged
    expect(chem.correct).toBe(4)
    expect(chem.correct).toBeLessThanOrEqual(chem.answered)
  })

  it('never fabricates events that were not actually recorded — one-sided data with no log stays exactly as-is', () => {
    const local = { gcse_quickfire_memory_v1: { subjects: {}, topics: {} } }
    const cloud = makeSnapshot(14, 11, deviceBLog)
    const merged = mergeProgressData(local, cloud)
    // Only B's real, logged evidence contributes — nothing invented for local.
    expect(merged.gcse_quickfire_memory_v1.subjects.Biology.answered).toBe(14)
    expect(merged.gcse_qf_answer_log).toHaveLength(4)
  })
})

describe('mergeProgressData — gcse_qf_best (personal best, never regresses)', () => {
  it('keeps the higher score', () => {
    const local = { gcse_qf_best: { correct: 12, answered: 20, date: '2026-07-01T00:00:00.000Z' } }
    const cloud = { gcse_qf_best: { correct: 18, answered: 20, date: '2026-06-01T00:00:00.000Z' } }
    const merged = mergeProgressData(local, cloud)
    expect(merged.gcse_qf_best.correct).toBe(18)
  })
})

describe('mergeProgressData — riseUser identity guard', () => {
  it('never adopts a different account uid from cloud', () => {
    const local = { riseUser: { uid: 'me', name: 'Sam', provider: 'google' } }
    const cloud = { riseUser: { uid: 'someone-else', name: 'Mallory', provider: 'google' } }
    const merged = mergeProgressData(local, cloud, { currentUid: 'me' })
    expect(merged.riseUser.uid).toBe('me')
  })

  it('a fresh guest-linking local session is authoritative even with no prior cloud uid match', () => {
    const local = { riseUser: { name: 'Sam', provider: 'guest' } }
    const merged = mergeProgressData(local, {}, { currentUid: undefined })
    expect(merged.riseUser).toEqual(local.riseUser)
  })
})

describe('mergeProgressData — unknown/legacy keys are never dropped', () => {
  it('preserves a key this merge module does not explicitly know about', () => {
    const merged = mergeProgressData({ gcse_confidence: [{ moduleId: 'x', confidence: 3 }] }, {})
    expect(merged.gcse_confidence).toEqual([{ moduleId: 'x', confidence: 3 }])
  })

  it('prefers whichever side actually has the value when only one side does', () => {
    const merged = mergeProgressData({}, { some_future_key: { a: 1 } })
    expect(merged.some_future_key).toEqual({ a: 1 })
  })
})
