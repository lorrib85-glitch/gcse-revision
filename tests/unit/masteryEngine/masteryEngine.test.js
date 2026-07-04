import { describe, it, expect } from 'vitest'

import {
  MASTERY_STATE_VERSION,
  EVIDENCE_WINDOW,
  STRENGTH_BANDS,
  createEmptyMasteryState,
  createEmptyConceptEvidence,
  isMasteryState,
} from '../../../src/data/masteryEngine/masteryModel.js'
import {
  recordAttempt,
  recordCorrect,
  recordIncorrect,
  mergeEvidence,
} from '../../../src/data/masteryEngine/evidence.js'
import {
  calculateMastery,
  calculateConfidence,
  calculateStrength,
  getConceptMastery,
  getAllConceptMastery,
} from '../../../src/data/masteryEngine/masteryScore.js'
import {
  identifyWeakConcepts,
  identifyStrongConcepts,
  identifyNeglectedConcepts,
} from '../../../src/data/masteryEngine/insights.js'
import { ALL_CONCEPTS } from '../../../src/data/learningGraph/conceptRegistry.js'

// Real registered concept ids — the engine rejects anything else.
const GALEN = 'history:medicine:galen'
const HUMOURS = 'history:medicine:four-humours'
const BLACK_DEATH = 'history:medicine:black-death'

const T0 = 1_700_000_000_000
const DAY = 24 * 60 * 60 * 1000

// Build a state by replaying a sequence of results for one concept.
function replay(conceptId, results, { state = createEmptyMasteryState(), startAt = T0 } = {}) {
  return results.reduce(
    (acc, correct, i) => recordAttempt(acc, { conceptId, correct, at: startAt + i * 1000 }),
    state,
  )
}

describe('mastery engine — fixture concepts are registered', () => {
  it('uses real registry ids so the suite fails if they are ever removed', () => {
    const ids = new Set(ALL_CONCEPTS.map(c => c.id))
    for (const id of [GALEN, HUMOURS, BLACK_DEATH]) {
      expect(ids.has(id), `${id} missing from registry`).toBe(true)
    }
  })
})

describe('mastery engine — state model', () => {
  it('creates a versioned empty state with no concepts', () => {
    const state = createEmptyMasteryState()
    expect(state).toEqual({ version: MASTERY_STATE_VERSION, concepts: {} })
    expect(isMasteryState(state)).toBe(true)
  })

  it('rejects malformed or future-versioned payloads', () => {
    expect(isMasteryState(null)).toBe(false)
    expect(isMasteryState(undefined)).toBe(false)
    expect(isMasteryState({})).toBe(false)
    expect(isMasteryState({ version: MASTERY_STATE_VERSION, concepts: [] })).toBe(false)
    expect(isMasteryState({ version: MASTERY_STATE_VERSION + 1, concepts: {} })).toBe(false)
  })
})

describe('mastery engine — evidence accumulation', () => {
  it('records a correct attempt with full evidence, not just a percentage', () => {
    const state = recordAttempt(createEmptyMasteryState(), { conceptId: GALEN, correct: true, at: T0 })
    expect(state.concepts[GALEN]).toEqual({
      attempts: 1,
      correct: 1,
      incorrect: 0,
      streak: 1,
      firstSeen: T0,
      lastSeen: T0,
      lastCorrect: T0,
      recent: [{ correct: true, at: T0 }],
    })
  })

  it('accumulates counters and timestamps across attempts', () => {
    const state = replay(GALEN, [true, false, true, true])
    const evidence = state.concepts[GALEN]
    expect(evidence.attempts).toBe(4)
    expect(evidence.correct).toBe(3)
    expect(evidence.incorrect).toBe(1)
    expect(evidence.firstSeen).toBe(T0)
    expect(evidence.lastSeen).toBe(T0 + 3000)
    expect(evidence.lastCorrect).toBe(T0 + 3000)
  })

  it('an incorrect attempt resets the streak and leaves lastCorrect untouched', () => {
    const state = replay(GALEN, [true, true, false])
    const evidence = state.concepts[GALEN]
    expect(evidence.streak).toBe(0)
    expect(evidence.lastCorrect).toBe(T0 + 1000)
    expect(evidence.lastSeen).toBe(T0 + 2000)
  })

  it('bounds the recent window at EVIDENCE_WINDOW, keeping the newest results', () => {
    const state = replay(GALEN, Array(EVIDENCE_WINDOW + 5).fill(true))
    const { recent, attempts } = state.concepts[GALEN]
    expect(attempts).toBe(EVIDENCE_WINDOW + 5)
    expect(recent).toHaveLength(EVIDENCE_WINDOW)
    expect(recent[recent.length - 1].at).toBe(T0 + (EVIDENCE_WINDOW + 4) * 1000)
  })

  it('recordCorrect / recordIncorrect are sugar over recordAttempt', () => {
    let state = recordCorrect(createEmptyMasteryState(), GALEN, { at: T0 })
    state = recordIncorrect(state, GALEN, { at: T0 + 1000 })
    expect(state.concepts[GALEN].correct).toBe(1)
    expect(state.concepts[GALEN].incorrect).toBe(1)
    expect(state.concepts[GALEN].streak).toBe(0)
  })

  it('tracks concepts independently and keys each concept exactly once', () => {
    let state = replay(GALEN, [true, true])
    state = replay(HUMOURS, [false], { state })
    expect(Object.keys(state.concepts).sort()).toEqual([HUMOURS, GALEN].sort())
    expect(state.concepts[GALEN].streak).toBe(2)
    expect(state.concepts[HUMOURS].streak).toBe(0)
  })
})

describe('mastery engine — purity and rejection', () => {
  it('recordAttempt never mutates its input state', () => {
    const before = replay(GALEN, [true])
    const frozen = JSON.parse(JSON.stringify(before))
    recordAttempt(before, { conceptId: GALEN, correct: false, at: T0 + 9000 })
    recordAttempt(before, { conceptId: HUMOURS, correct: true, at: T0 + 9000 })
    expect(before).toEqual(frozen)
  })

  it('is deterministic when a timestamp is supplied', () => {
    const a = replay(GALEN, [true, false, true])
    const b = replay(GALEN, [true, false, true])
    expect(a).toEqual(b)
  })

  it('rejects unregistered concept ids on write and read', () => {
    const state = createEmptyMasteryState()
    expect(() => recordAttempt(state, { conceptId: 'history:medicine:not-a-thing', correct: true })).toThrow(/not a registered concept/)
    expect(() => recordCorrect(state, 'galen')).toThrow(/not a registered concept/)
    expect(() => getConceptMastery(state, 'biology:made-up:cell')).toThrow(/not a registered concept/)
  })

  it('rejects attempts without a boolean result or with a bad timestamp', () => {
    const state = createEmptyMasteryState()
    expect(() => recordAttempt(state, { conceptId: GALEN })).toThrow(/correct/)
    expect(() => recordAttempt(state, { conceptId: GALEN, correct: 'yes' })).toThrow(/correct/)
    expect(() => recordAttempt(state, { conceptId: GALEN, correct: true, at: NaN })).toThrow(/timestamp/)
  })
})

describe('mastery engine — mastery calculation', () => {
  it('is 0 for unseen concepts and never binary after one answer', () => {
    expect(calculateMastery(createEmptyConceptEvidence())).toBe(0)
    const oneRight = replay(GALEN, [true]).concepts[GALEN]
    const oneWrong = replay(GALEN, [false]).concepts[GALEN]
    expect(calculateMastery(oneRight)).toBeGreaterThan(0.5)
    expect(calculateMastery(oneRight)).toBeLessThan(1)
    expect(calculateMastery(oneWrong)).toBeGreaterThan(0)
    expect(calculateMastery(oneWrong)).toBeLessThan(0.5)
  })

  it('rises with repeated success and falls with repeated failure', () => {
    let mastery = []
    let state = createEmptyMasteryState()
    for (let i = 0; i < 6; i++) {
      state = recordCorrect(state, GALEN, { at: T0 + i * 1000 })
      mastery.push(calculateMastery(state.concepts[GALEN]))
    }
    for (let i = 1; i < mastery.length; i++) expect(mastery[i]).toBeGreaterThan(mastery[i - 1])

    mastery = []
    state = createEmptyMasteryState()
    for (let i = 0; i < 6; i++) {
      state = recordIncorrect(state, GALEN, { at: T0 + i * 1000 })
      mastery.push(calculateMastery(state.concepts[GALEN]))
    }
    for (let i = 1; i < mastery.length; i++) expect(mastery[i]).toBeLessThan(mastery[i - 1])
  })

  it('weights recent evidence above old evidence (same totals, different order)', () => {
    const failedRecently = replay(GALEN, [true, true, true, false, false, false]).concepts[GALEN]
    const recoveredRecently = replay(GALEN, [false, false, false, true, true, true]).concepts[GALEN]
    expect(calculateMastery(recoveredRecently)).toBeGreaterThan(calculateMastery(failedRecently))
  })
})

describe('mastery engine — confidence calculation', () => {
  it('is 0 for unseen concepts and grows with repeated success', () => {
    expect(calculateConfidence(createEmptyConceptEvidence())).toBe(0)
    const few = replay(GALEN, [true, true]).concepts[GALEN]
    const many = replay(GALEN, Array(8).fill(true)).concepts[GALEN]
    expect(calculateConfidence(few)).toBeGreaterThan(0)
    expect(calculateConfidence(many)).toBeGreaterThan(calculateConfidence(few))
  })

  it('falls with repeated failure', () => {
    const succeeding = replay(GALEN, [true, true, true, true]).concepts[GALEN]
    const failing = replay(GALEN, [true, true, false, false]).concepts[GALEN]
    const collapsed = replay(GALEN, [false, false, false, false]).concepts[GALEN]
    expect(calculateConfidence(failing)).toBeLessThan(calculateConfidence(succeeding))
    expect(calculateConfidence(collapsed)).toBeLessThan(calculateConfidence(failing))
    expect(calculateConfidence(collapsed)).toBeLessThan(0.2)
  })
})

describe('mastery engine — strength bands and snapshots', () => {
  it('maps evidence to the expected bands', () => {
    expect(calculateStrength(createEmptyConceptEvidence())).toBe(STRENGTH_BANDS.UNSEEN)
    expect(calculateStrength(replay(GALEN, Array(8).fill(false)).concepts[GALEN])).toBe(STRENGTH_BANDS.WEAK)
    expect(calculateStrength(replay(GALEN, [true, false, true, false]).concepts[GALEN])).toBe(STRENGTH_BANDS.DEVELOPING)
    expect(calculateStrength(replay(GALEN, Array(10).fill(true)).concepts[GALEN])).toBe(STRENGTH_BANDS.STRONG)
  })

  it('getConceptMastery returns an unseen snapshot for registered, unpractised concepts', () => {
    const snapshot = getConceptMastery(createEmptyMasteryState(), BLACK_DEATH)
    expect(snapshot).toEqual({
      conceptId: BLACK_DEATH,
      mastery: 0,
      confidence: 0,
      strength: STRENGTH_BANDS.UNSEEN,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      firstSeen: null,
      lastSeen: null,
      lastCorrect: null,
    })
  })

  it('getAllConceptMastery lists tracked concepts deterministically', () => {
    let state = replay(HUMOURS, [true])
    state = replay(GALEN, [false], { state })
    const all = getAllConceptMastery(state)
    expect(all.map(s => s.conceptId)).toEqual([HUMOURS, GALEN].sort())
  })
})

describe('mastery engine — weak / strong / neglected ordering', () => {
  function threeConceptState() {
    let state = replay(GALEN, [false, false, false, false])            // weak
    state = replay(HUMOURS, [true, false, true, false], { state })     // middling
    state = replay(BLACK_DEATH, Array(8).fill(true), { state })        // strong
    return state
  }

  it('identifyWeakConcepts orders weakest first', () => {
    const weak = identifyWeakConcepts(threeConceptState())
    expect(weak.map(s => s.conceptId)).toEqual([GALEN, HUMOURS, BLACK_DEATH])
    expect(weak[0].mastery).toBeLessThan(weak[1].mastery)
  })

  it('identifyWeakConcepts respects limit and minAttempts', () => {
    let state = threeConceptState()
    state = replay('history:medicine:hippocrates', [false], { state })
    expect(identifyWeakConcepts(state, { limit: 1 })).toHaveLength(1)
    const filtered = identifyWeakConcepts(state, { minAttempts: 2 })
    expect(filtered.map(s => s.conceptId)).not.toContain('history:medicine:hippocrates')
  })

  it('breaks mastery ties toward the concept with more evidence, then id', () => {
    let state = replay(GALEN, [false, false])
    state = replay(HUMOURS, [false, false], { state })
    state = replay(BLACK_DEATH, [false, false, false, false], { state })
    const weak = identifyWeakConcepts(state)
    expect(weak[0].conceptId).toBe(BLACK_DEATH) // most attempts at equal (lower) mastery
    expect(weak.slice(1).map(s => s.conceptId)).toEqual([HUMOURS, GALEN].sort())
  })

  it('identifyStrongConcepts orders strongest first and demands real evidence', () => {
    let state = threeConceptState()
    state = replay('history:medicine:hippocrates', [true], { state }) // 1 lucky answer
    const strong = identifyStrongConcepts(state)
    expect(strong[0].conceptId).toBe(BLACK_DEATH)
    expect(strong.map(s => s.conceptId)).not.toContain('history:medicine:hippocrates')
  })

  it('identifyNeglectedConcepts returns stale concepts, longest-unseen first', () => {
    const now = T0 + 30 * DAY
    let state = replay(GALEN, [true])                                   // seen day 0
    state = replay(HUMOURS, [true], { state, startAt: T0 + 20 * DAY })  // seen day 20
    state = replay(BLACK_DEATH, [true], { state, startAt: now - 1000 }) // seen just now
    const neglected = identifyNeglectedConcepts(state, { now, staleDays: 7 })
    expect(neglected.map(s => s.conceptId)).toEqual([GALEN, HUMOURS])
  })
})

describe('mastery engine — mergeEvidence', () => {
  it('keeps disjoint concepts from both sides', () => {
    const a = replay(GALEN, [true])
    const b = replay(HUMOURS, [false])
    const merged = mergeEvidence(a, b)
    expect(Object.keys(merged.concepts).sort()).toEqual([HUMOURS, GALEN].sort())
  })

  it('sums counters and reconciles timestamps for shared concepts', () => {
    const a = replay(GALEN, [true, false])                       // T0, T0+1s
    const b = replay(GALEN, [true], { startAt: T0 + 5 * DAY })
    const merged = mergeEvidence(a, b).concepts[GALEN]
    expect(merged.attempts).toBe(3)
    expect(merged.correct).toBe(2)
    expect(merged.incorrect).toBe(1)
    expect(merged.firstSeen).toBe(T0)
    expect(merged.lastSeen).toBe(T0 + 5 * DAY)
    expect(merged.lastCorrect).toBe(T0 + 5 * DAY)
  })

  it('rebuilds the recent window time-ordered and bounded, and recomputes streak', () => {
    const a = replay(GALEN, [false, true])                          // ends correct
    const b = replay(GALEN, [true, true], { startAt: T0 + DAY })    // newer, both correct
    const merged = mergeEvidence(a, b).concepts[GALEN]
    expect(merged.recent.map(r => r.at)).toEqual([...merged.recent.map(r => r.at)].sort((x, y) => x - y))
    expect(merged.recent.length).toBeLessThanOrEqual(EVIDENCE_WINDOW)
    expect(merged.streak).toBe(3) // true @T0+1s, true, true from the merged tail
  })

  it('does not mutate either input', () => {
    const a = replay(GALEN, [true])
    const b = replay(GALEN, [false])
    const frozenA = JSON.parse(JSON.stringify(a))
    const frozenB = JSON.parse(JSON.stringify(b))
    mergeEvidence(a, b)
    expect(a).toEqual(frozenA)
    expect(b).toEqual(frozenB)
  })
})
