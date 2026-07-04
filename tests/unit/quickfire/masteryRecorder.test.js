import { describe, it, expect, beforeEach } from 'vitest'

import {
  conceptIdsForQuestion,
  recordQuestionAttempt,
  recordQuestionResult,
} from '../../../src/features/quickfire/logic/masteryRecorder.js'
import {
  createEmptyMasteryState,
  loadMasteryState,
  MASTERY_STORAGE_KEY,
} from '../../../src/data/masteryEngine/index.js'
import { ALL_MODULE_QUICKFIRE_QUESTIONS } from '../../../src/data/questionBanks/questionRegistry.js'

const T0 = 1_700_000_000_000

// Real QuickFire bank question: tags mix facets with two concept ids
// ('history:medicine' course node + 'history:medicine:miasma' atom).
const medQf001 = ALL_MODULE_QUICKFIRE_QUESTIONS.find(q => q.id === 'med-qf-001')

// Shapes QuickFire really serves that must be ignored: the chemistry
// placeholder and 90s-quiz conversions carry no tags at all.
const untaggedQuestion = { q: 'What is the pH of a neutral solution?', subject: 'Chemistry', topic: 'Acids and Alkalis', moduleId: null }
const facetOnlyQuestion = { id: 'x1', tags: ['period:medieval', 'format:mc', 'skill:recall'] }
const unknownConceptQuestion = { id: 'x2', tags: ['history:medicine:not-a-real-concept'] }

// node env has no localStorage; install a Map-backed fake so the
// load → record → save path through src/lib/storage.js is really exercised.
const fakeStore = new Map()
globalThis.localStorage = {
  getItem: key => (fakeStore.has(key) ? fakeStore.get(key) : null),
  setItem: (key, value) => fakeStore.set(key, String(value)),
  removeItem: key => fakeStore.delete(key),
}

beforeEach(() => fakeStore.clear())

describe('masteryRecorder — concept id resolution', () => {
  it('uses a real bank question that still carries the expected tags', () => {
    expect(medQf001).toBeDefined()
    expect(medQf001.tags).toContain('history:medicine:miasma')
    expect(medQf001.tags).toContain('period:medieval')
  })

  it('keeps only registered-namespace concept ids and drops every facet tag', () => {
    expect(conceptIdsForQuestion(medQf001)).toEqual(['history:medicine', 'history:medicine:miasma'])
  })

  it('resolves to nothing for facet-only and untagged questions', () => {
    expect(conceptIdsForQuestion(facetOnlyQuestion)).toEqual([])
    expect(conceptIdsForQuestion(untaggedQuestion)).toEqual([])
    expect(conceptIdsForQuestion(undefined)).toEqual([])
  })
})

describe('masteryRecorder — evidence recording', () => {
  it('a correct answer creates correct evidence on every concept id', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), medQf001, true, T0)
    for (const conceptId of ['history:medicine', 'history:medicine:miasma']) {
      expect(state.concepts[conceptId].attempts).toBe(1)
      expect(state.concepts[conceptId].correct).toBe(1)
      expect(state.concepts[conceptId].incorrect).toBe(0)
      expect(state.concepts[conceptId].lastCorrect).toBe(T0)
    }
  })

  it('an incorrect answer creates incorrect evidence', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), medQf001, false, T0)
    const evidence = state.concepts['history:medicine:miasma']
    expect(evidence.attempts).toBe(1)
    expect(evidence.incorrect).toBe(1)
    expect(evidence.lastCorrect).toBeNull()
  })

  it('multiple attempts accumulate on the same concepts', () => {
    let state = createEmptyMasteryState()
    state = recordQuestionAttempt(state, medQf001, true, T0)
    state = recordQuestionAttempt(state, medQf001, false, T0 + 1000)
    state = recordQuestionAttempt(state, medQf001, true, T0 + 2000)
    const evidence = state.concepts['history:medicine:miasma']
    expect(evidence.attempts).toBe(3)
    expect(evidence.correct).toBe(2)
    expect(evidence.incorrect).toBe(1)
    expect(evidence.streak).toBe(1)
  })

  it('records no facet tags as concepts', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), medQf001, true, T0)
    for (const key of Object.keys(state.concepts)) {
      expect(key, `facet "${key}" recorded as concept`).toMatch(/^history:/)
    }
    expect(state.concepts['period:medieval']).toBeUndefined()
    expect(state.concepts['format:mc']).toBeUndefined()
  })

  it('untagged and facet-only questions leave the state untouched', () => {
    const state = createEmptyMasteryState()
    expect(recordQuestionAttempt(state, untaggedQuestion, true, T0)).toBe(state)
    expect(recordQuestionAttempt(state, facetOnlyQuestion, false, T0)).toBe(state)
  })

  it('an unknown id in a concept namespace throws — never silently dropped', () => {
    expect(() => recordQuestionAttempt(createEmptyMasteryState(), unknownConceptQuestion, true, T0))
      .toThrow(/not a registered concept/)
  })
})

describe('masteryRecorder — persistence', () => {
  it('recordQuestionResult persists evidence readable via loadMasteryState', () => {
    recordQuestionResult(medQf001, true)
    recordQuestionResult(medQf001, false)
    const state = loadMasteryState()
    const evidence = state.concepts['history:medicine:miasma']
    expect(evidence.attempts).toBe(2)
    expect(evidence.correct).toBe(1)
    expect(evidence.incorrect).toBe(1)
  })

  it('untagged questions never touch storage', () => {
    recordQuestionResult(untaggedQuestion, true)
    expect(fakeStore.has(MASTERY_STORAGE_KEY)).toBe(false)
  })
})
