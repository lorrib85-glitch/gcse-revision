import { describe, it, expect } from 'vitest'
import {
  compactAnswerLog, mergeProgressData, emptyQfBaseline,
} from '../../../src/data/progressSync/progressMerge.js'

// ─── Fixtures ────────────────────────────────────────────────────────────────
// A "device" is a stream of answer events (dev id + monotonic seq) plus the
// running-total memory bucket it maintains. seed = the bucket's value at the
// last common sync (0 here — both devices start fresh).

const SUBJECT = 'Maths'
const TOPIC = 'Algebra'
const TOPIC_KEY = `${SUBJECT}::${TOPIC}`

function device(dev, results, { startSeq = 1, startAt = 1000, seed = 0, base = 0 } = {}) {
  const answered = base + results.length
  const correct = seed /* seedCorrect */ + results.filter(Boolean).length
  const bucket = (extra) => ({ answered, correct, seedAnswered: seed, seedCorrect: seed, ...extra })
  const log = results.map((c, i) => ({
    id: `${dev}-${startSeq + i}`, dev, seq: startSeq + i,
    subject: SUBJECT, topicKey: TOPIC_KEY, correct: c, at: startAt + i,
  }))
  const memory = {
    subjects: { [SUBJECT]: bucket({ subject: SUBJECT }) },
    topics: { [TOPIC_KEY]: bucket({ key: TOPIC_KEY, subject: SUBJECT, topic: TOPIC }) },
    updatedAt: new Date(startAt).toISOString(),
  }
  return { log, memory }
}

function snapshot({ memory, log, baseline }) {
  const data = {}
  if (memory) data.gcse_quickfire_memory_v1 = memory
  if (log) data.gcse_qf_answer_log = log
  if (baseline) data.gcse_qf_baseline_v1 = baseline
  return data
}

function subjectTotals(mergedData) {
  const b = mergedData.gcse_quickfire_memory_v1?.subjects?.[SUBJECT]
  return { answered: b?.answered, correct: b?.correct }
}

describe('QuickFire compaction — near-cap folding preserves totals', () => {
  it('folds aged events into the baseline, keeps recent evidence, and totals are unchanged + idempotent', () => {
    // 12 answers, 8 correct, on device A.
    const results = [true, true, false, true, true, false, true, false, true, true, false, true]
    const { log, memory } = device('A', results)

    // Compact at a low cap to simulate approaching the retention threshold.
    const { log: compactedLog, baseline, compacted } = compactAnswerLog(log, null, 'A', { cap: 8, retain: 5 })
    expect(compacted).toBe(true)
    expect(compactedLog.length).toBe(5)                 // newest 5 kept as raw evidence
    expect(baseline.folded.A).toBe(7)                   // oldest 7 folded (seq 1..7)

    // Reconstructing the total (merge with an empty cloud) is unchanged.
    const merged = mergeProgressData(snapshot({ memory, log: compactedLog, baseline }), {})
    expect(subjectTotals(merged)).toEqual({ answered: 12, correct: 8 })

    // Running compaction again on the already-compacted log is a no-op.
    const twice = compactAnswerLog(compactedLog, baseline, 'A', { cap: 8, retain: 5 })
    expect(twice.compacted).toBe(false)
    expect(twice.log).toHaveLength(5)

    // Re-merging changes nothing further.
    const again = mergeProgressData(merged, merged)
    expect(subjectTotals(again)).toEqual({ answered: 12, correct: 8 })
  })
})

describe('QuickFire compaction — divergent devices after a shared baseline', () => {
  it('preserves both devices\' unique activity on top of a shared compacted baseline, idempotently', () => {
    // Both devices share a baseline of 5 historical answers (3 correct) from an
    // earlier device A stream that has aged out.
    const shared = emptyQfBaseline()
    shared.folded.A = 5
    shared.subjects[SUBJECT] = { A: { answered: 5, correct: 3 } }
    shared.topics[TOPIC_KEY] = { A: { answered: 5, correct: 3 } }

    // Device A adds 3 NEW unique answers (2 correct) as A/seq 6..8.
    const a = device('A', [true, true, false], { startSeq: 6, startAt: 2000, base: 5, seed: 0 })
    // Device B adds 2 DIFFERENT unique answers (1 correct) as B/seq 1..2.
    const b = device('B', [true, false], { startSeq: 1, startAt: 2500, base: 5, seed: 0 })

    const merged = mergeProgressData(
      snapshot({ memory: a.memory, log: a.log, baseline: shared }),
      snapshot({ memory: b.memory, log: b.log, baseline: shared }),
    )

    // 5 historical + 3 (A) + 2 (B) = 10 answered; 3 + 2 + 1 = 6 correct.
    expect(subjectTotals(merged)).toEqual({ answered: 10, correct: 6 })

    // Repeated merge adds nothing further.
    const again = mergeProgressData(merged, merged)
    expect(subjectTotals(again)).toEqual({ answered: 10, correct: 6 })
    // correct never exceeds answered.
    expect(again.gcse_quickfire_memory_v1.subjects[SUBJECT].correct)
      .toBeLessThanOrEqual(again.gcse_quickfire_memory_v1.subjects[SUBJECT].answered)
  })
})

describe('QuickFire compaction — mixed legacy aggregate and new compacted data', () => {
  it('never regresses below a legacy aggregate-only total when merging with a compacted device', () => {
    // Device X: pre-log aggregate-only bucket (no seed, no events, no baseline).
    const legacy = {
      gcse_quickfire_memory_v1: {
        subjects: { [SUBJECT]: { subject: SUBJECT, answered: 20, correct: 12 } },
        topics: { [TOPIC_KEY]: { key: TOPIC_KEY, subject: SUBJECT, topic: TOPIC, answered: 20, correct: 12 } },
      },
    }

    // Device Y: baseline (3 folded, 2 correct) + 2 raw unfolded events.
    const yBaseline = emptyQfBaseline()
    yBaseline.folded.Y = 3
    yBaseline.subjects[SUBJECT] = { Y: { answered: 3, correct: 2 } }
    yBaseline.topics[TOPIC_KEY] = { Y: { answered: 3, correct: 2 } }
    const y = device('Y', [true, false], { startSeq: 4, startAt: 3000, base: 5, seed: 0 })

    const merged = mergeProgressData(legacy, snapshot({ memory: y.memory, log: y.log, baseline: yBaseline }))
    const totals = subjectTotals(merged)

    // The safest valid total never drops below the legacy 20 (its answers
    // can't be event-deduped against Y's, so they are not discarded).
    expect(totals.answered).toBeGreaterThanOrEqual(20)
    expect(totals.correct).toBeLessThanOrEqual(totals.answered)   // invariant holds
    // Idempotent.
    const again = mergeProgressData(merged, merged)
    expect(subjectTotals(again).answered).toBe(totals.answered)
  })
})
