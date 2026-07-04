/**
 * QuickFire bank → runtime conversion: canonical metadata survival + mastery.
 *
 * Proves that the synced History Medicine workbook metadata survives
 * quickFireFromBank() and that the existing mastery recorder can therefore
 * record concept evidence from a converted question — while legacy /
 * non-canonical and excluded rows carry no tags, record nothing, and never
 * throw.
 */

import { describe, it, expect } from 'vitest'

import { quickFireFromBank, CANONICAL_METADATA_FIELDS } from '../../../src/features/quickfire/logic/convertBankQuestion.js'
import { conceptIdsForQuestion, recordQuestionAttempt } from '../../../src/features/quickfire/logic/masteryRecorder.js'
import { createEmptyMasteryState } from '../../../src/data/masteryEngine/index.js'
import { QUICK_QUIZ_QUESTIONS } from '../../../src/data/quickQuizData.js'
import { isConceptId } from '../../../src/data/learningGraph/conceptRegistry.js'

const T0 = 1_700_000_000_000
const EXCLUDED_IDS = ['qq_h27', 'qq_h50', 'qq_h53', 'qq_h54']

const byId = id => QUICK_QUIZ_QUESTIONS.find(q => q.id === id)
const historyRows = QUICK_QUIZ_QUESTIONS.filter(q => typeof q.id === 'string' && q.id.startsWith('qq_h'))
const syncedRows = historyRows.filter(q => q.primaryConcept)
const nonHistoryRows = QUICK_QUIZ_QUESTIONS.filter(q => !(typeof q.id === 'string' && q.id.startsWith('qq_h')))

describe('quickFireFromBank — canonical metadata survives conversion', () => {
  it('has synced rows to exercise', () => {
    expect(syncedRows.length).toBeGreaterThan(0)
  })

  it('forwards a tags array of registered concept ids for every synced History row', () => {
    for (const row of syncedRows) {
      const conv = quickFireFromBank(row)
      expect(Array.isArray(conv.tags), `${row.id}: tags dropped`).toBe(true)
      expect(conv.tags.length).toBeGreaterThan(0)
      for (const tag of conv.tags) {
        expect(isConceptId(tag), `${row.id}: unregistered tag "${tag}"`).toBe(true)
      }
    }
  })

  it('preserves primaryConcept through conversion', () => {
    for (const row of syncedRows) {
      const conv = quickFireFromBank(row)
      expect(conv.primaryConcept, `${row.id}`).toBe(row.primaryConcept)
    }
  })

  it('preserves secondaryConcepts through conversion', () => {
    for (const row of syncedRows) {
      const conv = quickFireFromBank(row)
      expect(conv.secondaryConcepts, `${row.id}`).toEqual(row.secondaryConcepts)
    }
  })

  it('preserves learningStage through conversion', () => {
    for (const row of syncedRows) {
      const conv = quickFireFromBank(row)
      expect(conv.learningStage, `${row.id}`).toBe(row.learningStage)
    }
  })

  it('forwards every canonical metadata field that is present, unchanged', () => {
    const sample = quickFireFromBank(byId('qq_h1'))
    for (const field of CANONICAL_METADATA_FIELDS) {
      if (byId('qq_h1')[field] !== undefined) {
        expect(sample[field], `qq_h1: ${field}`).toEqual(byId('qq_h1')[field])
      }
    }
    // display fields still produced (conversion base unchanged)
    for (const key of ['q', 'type', 'options', 'correct', 'subject', 'topic', 'ms', 'hint']) {
      expect(sample).toHaveProperty(key)
    }
  })
})

describe('masteryRecorder — records evidence for converted synced questions', () => {
  it('resolves registered concept ids from a converted synced History question', () => {
    const concepts = conceptIdsForQuestion(quickFireFromBank(byId('qq_h1')))
    expect(concepts.length).toBeGreaterThan(0)
    expect(concepts).toContain('history:medicine:god-punishment')
    for (const id of concepts) expect(isConceptId(id)).toBe(true)
  })

  it('records concept evidence for a converted synced question', () => {
    const conv = quickFireFromBank(byId('qq_h1'))
    const state = recordQuestionAttempt(createEmptyMasteryState(), conv, true, T0)
    const recorded = Object.keys(state.concepts)
    expect(recorded).toContain('history:medicine:god-punishment')
    expect(recorded.length).toBe(conceptIdsForQuestion(conv).length)
    expect(state.concepts['history:medicine:god-punishment'].attempts).toBe(1)
    expect(state.concepts['history:medicine:god-punishment'].correct).toBe(1)
  })

  it('records evidence for a converted true/false synced question (qq_h3)', () => {
    const conv = quickFireFromBank(byId('qq_h3'))
    const state = recordQuestionAttempt(createEmptyMasteryState(), conv, false, T0)
    expect(Object.keys(state.concepts)).toContain('history:medicine:miasma')
  })
})

describe('excluded rows never enter the canonical mastery path', () => {
  for (const id of EXCLUDED_IDS) {
    it(`${id}: converts without tags and records no evidence`, () => {
      const row = byId(id)
      expect(row, `${id} missing from bank`).toBeDefined()
      const conv = quickFireFromBank(row)
      expect(conv.tags, `${id}: excluded row forwarded tags`).toBeUndefined()
      expect(conv.primaryConcept).toBeUndefined()
      expect(conceptIdsForQuestion(conv)).toEqual([])
      const state = recordQuestionAttempt(createEmptyMasteryState(), conv, true, T0)
      expect(Object.keys(state.concepts)).toEqual([])
    })
  }
})

// The mastery-bearing fields — the ones that would put a row on the canonical
// mastery path. `misconception` is deliberately excluded: it is a pre-existing
// legacy bank field on many non-History rows, and is forwarded verbatim.
const MASTERY_BEARING_FIELDS = [
  'tags', 'primaryConcept', 'secondaryConcepts', 'learningStage',
  'difficultyLevel', 'followUpConcept', 'acceptedAnswers',
]

describe('legacy / non-History rows remain unchanged and record no evidence', () => {
  it('conversion forwards canonical fields verbatim and invents nothing for non-History rows', () => {
    for (const row of nonHistoryRows) {
      const conv = quickFireFromBank(row)
      for (const field of CANONICAL_METADATA_FIELDS) {
        // present → forwarded unchanged; absent → still absent (nothing invented)
        expect(conv[field], `${row.id}: ${field} not forwarded verbatim`).toEqual(row[field])
      }
    }
  })

  it('non-History converted questions carry none of the mastery-bearing fields', () => {
    for (const row of nonHistoryRows) {
      const conv = quickFireFromBank(row)
      for (const field of MASTERY_BEARING_FIELDS) {
        expect(conv[field], `${row.id}: unexpected ${field}`).toBeUndefined()
      }
    }
  })

  it('non-History converted questions resolve to zero concepts, record nothing, and never throw', () => {
    for (const row of nonHistoryRows) {
      const conv = quickFireFromBank(row)
      expect(conceptIdsForQuestion(conv)).toEqual([])
      let state
      expect(() => { state = recordQuestionAttempt(createEmptyMasteryState(), conv, true, T0) }).not.toThrow()
      expect(Object.keys(state.concepts)).toEqual([])
    }
  })
})
