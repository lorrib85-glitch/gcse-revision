import { describe, it, expect, beforeEach } from 'vitest'
import {
  readQuickFireMemory, bumpQuickFireMemoryForAnswer, bucketAccuracy,
  QUICK_FIRE_MEMORY_KEY, QF_ANSWER_LOG_KEY,
} from '../../../src/features/quickfire/logic/quickFireMemory.js'
import { getJson } from '../../../src/lib/storage.js'

// node env has no localStorage; a real Map-backed fake exercises the actual
// storage.js path (matches the pattern used by masteryRecorder.test.js).
const fakeStore = new Map()
globalThis.localStorage = {
  get length() { return fakeStore.size },
  key: (i) => Array.from(fakeStore.keys())[i] ?? null,
  getItem: key => (fakeStore.has(key) ? fakeStore.get(key) : null),
  setItem: (key, value) => fakeStore.set(key, String(value)),
  removeItem: key => fakeStore.delete(key),
}

beforeEach(() => fakeStore.clear())

const bioQ = { id: 'q1', subject: 'Biology', topic: 'Cells', moduleId: 'sci_bio_w1' }
const historyQ = { id: 'q2', subject: 'History', topic: 'Medieval Medicine', moduleId: 'history-medicine-medieval-beliefs-causes' }

describe('bumpQuickFireMemoryForAnswer — per-answer persistence', () => {
  it('persists ranking memory immediately, not just at round end', () => {
    bumpQuickFireMemoryForAnswer(bioQ, true)
    const memory = readQuickFireMemory()
    expect(memory.subjects.Biology).toMatchObject({ answered: 1, correct: 1 })
    expect(memory.topics['Biology::Cells']).toMatchObject({ answered: 1, correct: 1 })
  })

  it('answer → storage write → close before round end → reopen → ranking memory still includes the answer', () => {
    // "Close before round end": nothing else runs, no finishRound call —
    // the memory read on a fresh "reopen" (a plain re-read) already has it.
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(bioQ, false)

    const reopened = readQuickFireMemory()
    expect(reopened.subjects.Biology.answered).toBe(2)
    expect(reopened.subjects.Biology.correct).toBe(1)
    expect(bucketAccuracy(reopened.subjects.Biology)).toBe(50)
  })

  it('accumulates across subjects and topics independently', () => {
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(historyQ, false)
    const memory = readQuickFireMemory()
    expect(memory.subjects.Biology.answered).toBe(1)
    expect(memory.subjects.History.answered).toBe(1)
    expect(memory.subjects.History.correct).toBe(0)
  })

  it('captures a one-time seed on the first bump for a bucket, and never re-captures it', () => {
    bumpQuickFireMemoryForAnswer(bioQ, true) // bucket starts empty → seed = 0
    let bucket = readQuickFireMemory().subjects.Biology
    expect(bucket.seedAnswered).toBe(0)
    expect(bucket.seedCorrect).toBe(0)

    bumpQuickFireMemoryForAnswer(bioQ, true)
    bucket = readQuickFireMemory().subjects.Biology
    expect(bucket.answered).toBe(2)
    expect(bucket.seedAnswered).toBe(0) // unchanged — captured once, not re-derived
  })

  it('appends a stable-id event to gcse_qf_answer_log alongside every bump', () => {
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(historyQ, false)
    const log = getJson(QF_ANSWER_LOG_KEY, [])
    expect(log).toHaveLength(2)
    expect(new Set(log.map(e => e.id)).size).toBe(2) // ids are unique
    expect(log.some(e => e.subject === 'Biology' && e.correct === true)).toBe(true)
    expect(log.some(e => e.subject === 'History' && e.correct === false)).toBe(true)
  })

  it('stamps each answer-log event with a device id and a monotonic per-device seq (merge-safe compaction)', () => {
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(bioQ, false)
    bumpQuickFireMemoryForAnswer(historyQ, true)
    const log = getJson(QF_ANSWER_LOG_KEY, [])
    // One stable device id for this browser/scope.
    const devs = new Set(log.map(e => e.dev))
    expect(devs.size).toBe(1)
    expect([...devs][0]).toMatch(/^d-/)
    // seqs are 1..3, unique and monotonic (newest-first in the log).
    expect(log.map(e => e.seq).sort((a, b) => a - b)).toEqual([1, 2, 3])
  })

  it('a repeat answer to the same question (QuickFire\'s retry-prev-wrong queue mechanic) is a real second attempt, not a duplicate to suppress', () => {
    bumpQuickFireMemoryForAnswer(bioQ, false)
    bumpQuickFireMemoryForAnswer(bioQ, true) // answered again later in the same round
    const bucket = readQuickFireMemory().subjects.Biology
    expect(bucket.answered).toBe(2)
    expect(bucket.correct).toBe(1)
  })

  it('completing a round does not record any answer twice — finishRound only reads memory, never re-writes it', () => {
    // Simulates a full round: three answers committed via the per-answer
    // path, then whatever finishRound does (a plain read, per QuickFireMode.jsx)
    // — no additional write happens for the round as a whole.
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(bioQ, true)
    bumpQuickFireMemoryForAnswer(bioQ, false)

    const beforeRoundEnd = JSON.stringify(getJson(QUICK_FIRE_MEMORY_KEY, null))
    const afterRoundEndRead = readQuickFireMemory() // stands in for finishRound's read-only access
    void afterRoundEndRead
    const afterRoundEnd = JSON.stringify(getJson(QUICK_FIRE_MEMORY_KEY, null))

    expect(afterRoundEnd).toBe(beforeRoundEnd) // untouched by "finishing" the round
    expect(readQuickFireMemory().subjects.Biology.answered).toBe(3) // still exactly 3, not 6
  })
})

describe('bucketAccuracy', () => {
  it('is 0 for an unanswered bucket and rounds otherwise', () => {
    expect(bucketAccuracy(null)).toBe(0)
    expect(bucketAccuracy({ answered: 0, correct: 0 })).toBe(0)
    expect(bucketAccuracy({ answered: 3, correct: 1 })).toBe(33)
  })
})
