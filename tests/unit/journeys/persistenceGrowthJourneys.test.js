import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  setActiveScope, GUEST_SCOPE, getJson, setJson,
} from '../../../src/lib/storage.js'
import {
  bumpQuickFireMemoryForAnswer, readQuickFireMemory,
  QUICK_FIRE_MEMORY_KEY, QF_ANSWER_LOG_KEY, QF_BASELINE_KEY, QF_DEVICE_KEY,
} from '../../../src/features/quickfire/logic/quickFireMemory.js'
import { mergeProgressData } from '../../../src/data/progressSync/progressMerge.js'
import { collectLocalProgressSnapshot } from '../../../src/data/progressSync/progressSync.js'
import { compactSnapshotForBudget, serializedSize, HARD_BYTES } from '../../../src/data/progressSync/snapshotBudget.js'

// End-to-end persistence-growth journeys against the REAL storage.js,
// quickFireMemory.js, progressMerge.js and snapshotBudget.js modules.

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
}

beforeEach(() => { installLocalStorage(); setActiveScope(GUEST_SCOPE) })
afterEach(() => setActiveScope(GUEST_SCOPE))

const MATHS = { subject: 'Maths', topic: 'Algebra' }
const TOPIC_KEY = 'Maths::Algebra'

describe('Journey — long-lived QuickFire account exceeds the raw-event budget', () => {
  it('compaction preserves historical totals, new answers keep accumulating, and merge stays correct', () => {
    // Pre-seed a device already sitting at the raw-log cap (4000 of its OWN
    // events), as a real long-lived account would.
    const dev = 'devX'
    setJson(QF_DEVICE_KEY, { id: dev, seq: 4000 })
    const log = []
    let correct = 0
    for (let i = 1; i <= 4000; i++) {
      const c = i % 2 === 0
      if (c) correct++
      log.push({ id: `${dev}-${i}`, dev, seq: i, subject: 'Maths', topicKey: TOPIC_KEY, correct: c, at: 1000 + i })
    }
    setJson(QF_ANSWER_LOG_KEY, log)
    const bucket = (extra) => ({ answered: 4000, correct, seedAnswered: 0, seedCorrect: 0, ...extra })
    setJson(QUICK_FIRE_MEMORY_KEY, {
      subjects: { Maths: bucket({ subject: 'Maths' }) },
      topics: { [TOPIC_KEY]: bucket({ key: TOPIC_KEY, subject: 'Maths', topic: 'Algebra' }) },
    })

    // One more committed answer crosses the cap → compaction runs.
    bumpQuickFireMemoryForAnswer(MATHS, true)

    const compactedLog = getJson(QF_ANSWER_LOG_KEY, [])
    expect(compactedLog.length).toBeLessThan(4000)       // trimmed
    const baseline = getJson(QF_BASELINE_KEY, null)
    expect(baseline).toBeTruthy()                        // aged events folded, not dropped

    // Reconstructed total is intact: 4001 answered.
    const collect = () => ({
      gcse_quickfire_memory_v1: getJson(QUICK_FIRE_MEMORY_KEY, null),
      gcse_qf_answer_log: getJson(QF_ANSWER_LOG_KEY, []),
      gcse_qf_baseline_v1: getJson(QF_BASELINE_KEY, null),
    })
    const reconstructed = mergeProgressData(collect(), {})
    expect(reconstructed.gcse_quickfire_memory_v1.subjects.Maths.answered).toBe(4001)

    // New answers continue accumulating after compaction.
    bumpQuickFireMemoryForAnswer(MATHS, false)
    expect(readQuickFireMemory().subjects.Maths.answered).toBe(4002)

    // Merge stays correct and idempotent (no corruption, no double-count).
    const snap = collect()
    const merged = mergeProgressData(snap, snap)
    expect(merged.gcse_quickfire_memory_v1.subjects.Maths.answered).toBe(4002)
    const again = mergeProgressData(merged, merged)
    expect(again.gcse_quickfire_memory_v1.subjects.Maths.answered).toBe(4002)
  })
})

describe('Journey — snapshot near the safety threshold', () => {
  it('governed history is compacted so core progress is unchanged and the snapshot becomes safe to sync', () => {
    // Core learner state that must never be touched.
    setJson('gcse_progress', { streak: 15, bestStreak: 22, lastActivityDate: '2026-07-10' })
    setJson('gcse_module_history-1', { screen: 9, completed: true })
    setJson('gcse_mastery_v1', { version: 1, concepts: { 'history:medicine:galen': { attempts: 8, correct: 6, lastSeen: 8 } } })

    // A large QuickFire answer log pushes the snapshot over the safety budget.
    const dev = 'devY'
    setJson(QF_DEVICE_KEY, { id: dev, seq: 9000 })
    const log = Array.from({ length: 9000 }, (_, i) => ({
      id: `${dev}-${i + 1}`, dev, seq: i + 1, subject: 'Maths', topicKey: TOPIC_KEY, correct: i % 2 === 0, at: 1000 + i,
    }))
    setJson(QF_ANSWER_LOG_KEY, log)
    setJson(QUICK_FIRE_MEMORY_KEY, {
      subjects: { Maths: { subject: 'Maths', answered: 9000, correct: 4500, seedAnswered: 0, seedCorrect: 0 } },
      topics: {},
    })

    const snapshot = collectLocalProgressSnapshot(GUEST_SCOPE)
    expect(serializedSize(snapshot)).toBeGreaterThan(HARD_BYTES)   // genuinely over budget

    const { snapshot: compacted, withinBudget, compacted: didCompact } = compactSnapshotForBudget(snapshot)
    expect(didCompact).toBe(true)
    expect(withinBudget).toBe(true)                                // now safe to sync

    // Core progress is byte-for-byte unchanged.
    expect(compacted.data.gcse_progress).toEqual(snapshot.data.gcse_progress)
    expect(compacted.data.gcse_module_history1 ?? compacted.data['gcse_module_history-1'])
      .toEqual(snapshot.data['gcse_module_history-1'])
    expect(compacted.data.gcse_mastery_v1).toEqual(snapshot.data.gcse_mastery_v1)

    // The QuickFire total survived the compaction (folded into the baseline).
    const reconstructed = mergeProgressData(compacted.data, {})
    expect(reconstructed.gcse_quickfire_memory_v1.subjects.Maths.answered).toBe(9000)
  })
})
