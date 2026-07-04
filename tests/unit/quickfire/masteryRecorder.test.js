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
import { QUICK_QUIZ_QUESTIONS } from '../../../src/data/quickQuizData.js'
import { quickFireFromBank } from '../../../src/features/quickfire/logic/convertBankQuestion.js'

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

describe('masteryRecorder — stage and source forwarding (EV1/O1)', () => {
  // A real workbook-synced row, through the real QuickFire conversion — the
  // exact shape QuickFireMode hands to recordQuestionResult.
  const syncedRow = QUICK_QUIZ_QUESTIONS.find(q => q.primaryConcept)
  const syncedQuestion = quickFireFromBank(syncedRow)

  it('uses a genuinely synced row (canonical metadata survives conversion)', () => {
    expect(syncedRow).toBeDefined()
    expect(syncedQuestion.primaryConcept).toBe(syncedRow.primaryConcept)
    expect(syncedQuestion.learningStage).toBe(syncedRow.learningStage)
  })

  it('stamps the primary concept event with the question learningStage and source quickfire', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), syncedQuestion, true, T0)
    const [event] = state.concepts[syncedRow.primaryConcept].recent
    expect(event).toEqual({
      correct: true,
      at: T0,
      stage: syncedRow.learningStage,
      source: 'quickfire',
    })
  })

  it('secondary concepts get source but no stage claim — the stage describes the primary only', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), syncedQuestion, true, T0)
    const concepts = conceptIdsForQuestion(syncedQuestion)
    const stamped = concepts.filter(id => state.concepts[id].recent[0].stage !== undefined)
    expect(stamped).toEqual([syncedRow.primaryConcept])
    for (const conceptId of concepts) {
      expect(state.concepts[conceptId].recent[0].source).toBe('quickfire')
    }
  })

  it('questions without stage metadata record source but never a stage', () => {
    const state = recordQuestionAttempt(createEmptyMasteryState(), medQf001, false, T0)
    for (const conceptId of conceptIdsForQuestion(medQf001)) {
      const [event] = state.concepts[conceptId].recent
      expect(event).toEqual({ correct: false, at: T0, source: 'quickfire' })
      expect('stage' in event).toBe(false)
    }
  })

  it('legacy pre-EV1 persisted evidence loads unchanged and new stamped evidence stacks on top', () => {
    const legacy = {
      version: 1,
      concepts: {
        'history:medicine:miasma': {
          attempts: 1, correct: 1, incorrect: 0, streak: 1,
          firstSeen: T0, lastSeen: T0, lastCorrect: T0,
          recent: [{ correct: true, at: T0 }],
        },
      },
    }
    fakeStore.set(MASTERY_STORAGE_KEY, JSON.stringify(legacy))
    recordQuestionResult(medQf001, false)
    const state = loadMasteryState()
    const evidence = state.concepts['history:medicine:miasma']
    expect(evidence.attempts).toBe(2)
    expect(evidence.recent[0]).toEqual({ correct: true, at: T0 }) // untouched, no migration
    expect(evidence.recent[1].source).toBe('quickfire')
    expect('stage' in evidence.recent[1]).toBe(false)
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
