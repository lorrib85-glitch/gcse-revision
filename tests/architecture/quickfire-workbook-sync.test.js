/**
 * Guard tests for the History Medicine workbook → QuickFire sync.
 *
 * The audited curation workbook (gcse-question-curation-workbook-history-
 * medicine-v3-AUDITED.xlsx) is the canonical source for the History Medicine
 * QuickFire rows in src/data/quickQuizData.js. A row is "synced" (canonical)
 * when it carries the workbook metadata added by the sync — detected here by
 * the presence of `primaryConcept`.
 *
 * These tests enforce that:
 *   - only eligible rows were synced (the four excluded rows never enter the
 *     canonical pool),
 *   - every synced row's concept vocabulary is registered and internally
 *     consistent (primary/secondary ⊆ tags),
 *   - learningStage and difficultyLevel are valid,
 *   - answer indices are in range,
 *   - non-History questions were left completely untouched by the sync.
 */

import { describe, it, expect } from 'vitest'
import { QUICK_QUIZ_QUESTIONS } from '../../src/data/quickQuizData.js'
import { isConceptId } from '../../src/data/learningGraph/conceptRegistry.js'
import { LEARNING_STAGES } from '../../src/data/learningGraph/learningStages.js'

// Rows the audit judged unsafe to sync (retire candidates + unresolved
// concept mismatch). Must never be synced or gain canonical metadata.
const EXCLUDED_IDS = ['qq_h27', 'qq_h50', 'qq_h53', 'qq_h54']
const VALID_STAGES = new Set(LEARNING_STAGES)

const historyRows = QUICK_QUIZ_QUESTIONS.filter(q => typeof q.id === 'string' && q.id.startsWith('qq_h'))
const nonHistoryRows = QUICK_QUIZ_QUESTIONS.filter(q => !(typeof q.id === 'string' && q.id.startsWith('qq_h')))
// The canonical (synced) QuickFire pool: rows carrying workbook metadata.
const syncedRows = historyRows.filter(q => q.primaryConcept)

describe('QuickFire workbook sync — pool membership', () => {
  it('syncs every eligible History Medicine row (all qq_h* except the 4 excluded)', () => {
    const expected = historyRows.filter(q => !EXCLUDED_IDS.includes(q.id)).length
    expect(syncedRows.length).toBe(expected)
    expect(syncedRows.length).toBeGreaterThan(0)
  })

  it('no excluded / retire-candidate row enters the active canonical QuickFire pool', () => {
    const syncedIds = new Set(syncedRows.map(q => q.id))
    for (const id of EXCLUDED_IDS) {
      expect(syncedIds.has(id), `${id} was synced but must be excluded`).toBe(false)
    }
  })

  it('excluded rows still exist in the bank but carry no canonical metadata (untouched)', () => {
    for (const id of EXCLUDED_IDS) {
      const row = QUICK_QUIZ_QUESTIONS.find(q => q.id === id)
      expect(row, `${id} was deleted — excluded rows must be preserved, not removed`).toBeDefined()
      for (const field of ['primaryConcept', 'secondaryConcepts', 'learningStage', 'difficultyLevel', 'tags']) {
        expect(row[field], `${id} gained ${field} — excluded rows must not be synced`).toBeUndefined()
      }
    }
  })
})

describe('QuickFire workbook sync — concept vocabulary integrity', () => {
  it('every synced row has a primaryConcept', () => {
    for (const q of syncedRows) {
      expect(typeof q.primaryConcept, `${q.id} missing primaryConcept`).toBe('string')
    }
  })

  it('every synced row carries a non-empty tags array of registered concept ids', () => {
    for (const q of syncedRows) {
      expect(Array.isArray(q.tags) && q.tags.length > 0, `${q.id} has no tags`).toBe(true)
      for (const tag of q.tags) {
        expect(isConceptId(tag), `${q.id}: unregistered concept tag "${tag}"`).toBe(true)
      }
    }
  })

  it('primaryConcept is registered and included in the tags array', () => {
    for (const q of syncedRows) {
      expect(isConceptId(q.primaryConcept), `${q.id}: primaryConcept "${q.primaryConcept}" not registered`).toBe(true)
      expect(q.tags.includes(q.primaryConcept), `${q.id}: primaryConcept not in tags`).toBe(true)
    }
  })

  it('every secondaryConcept is registered and included in the tags array', () => {
    for (const q of syncedRows) {
      expect(Array.isArray(q.secondaryConcepts), `${q.id} secondaryConcepts not an array`).toBe(true)
      for (const s of q.secondaryConcepts) {
        expect(isConceptId(s), `${q.id}: secondaryConcept "${s}" not registered`).toBe(true)
        expect(q.tags.includes(s), `${q.id}: secondaryConcept "${s}" not in tags`).toBe(true)
      }
    }
  })

  it('followUpConcept, when present, is a registered concept id', () => {
    for (const q of syncedRows) {
      if (q.followUpConcept != null) {
        expect(isConceptId(q.followUpConcept), `${q.id}: followUpConcept "${q.followUpConcept}" not registered`).toBe(true)
      }
    }
  })
})

describe('QuickFire workbook sync — stage, difficulty and answer integrity', () => {
  it('every synced row has a valid learningStage', () => {
    for (const q of syncedRows) {
      expect(VALID_STAGES.has(q.learningStage), `${q.id}: invalid learningStage "${q.learningStage}"`).toBe(true)
    }
  })

  it('every synced row has a numeric difficultyLevel between 1 and 5', () => {
    for (const q of syncedRows) {
      expect(typeof q.difficultyLevel, `${q.id}: difficultyLevel not numeric`).toBe('number')
      expect(q.difficultyLevel >= 1 && q.difficultyLevel <= 5, `${q.id}: difficultyLevel ${q.difficultyLevel} out of range`).toBe(true)
    }
  })

  it('answer pointer is valid for every synced row (correctIndex in range, or boolean correct for true/false)', () => {
    for (const q of syncedRows) {
      if (q.type === 'truefalse') {
        expect(typeof q.correct, `${q.id}: true/false row must have boolean correct`).toBe('boolean')
      } else {
        expect(Array.isArray(q.options), `${q.id}: choice row must have options`).toBe(true)
        expect(q.correctIndex >= 0 && q.correctIndex < q.options.length, `${q.id}: correctIndex out of range`).toBe(true)
      }
    }
  })
})

describe('QuickFire workbook sync — isolation from other content', () => {
  it('does not change any non-History question (no canonical metadata leaks onto them)', () => {
    for (const q of nonHistoryRows) {
      for (const field of ['primaryConcept', 'secondaryConcepts', 'learningStage', 'difficultyLevel', 'followUpConcept']) {
        expect(q[field], `${q.id}: non-History question gained "${field}" — sync must not touch other subjects`).toBeUndefined()
      }
    }
  })

  it('leaves the History row count and total bank size intact', () => {
    expect(historyRows.length).toBe(70)
    expect(QUICK_QUIZ_QUESTIONS.length).toBe(119)
  })
})
