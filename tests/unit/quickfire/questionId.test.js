/**
 * Quick Fire per-question identity: stable bank ids beat text-derived keys.
 *
 * Proves the gcse_qf_q_history key prefers a question's stable bank id, so
 * editing question text can no longer reset history for id-carrying
 * questions — while legacy questions without an id keep the original
 * subject + first-40-chars key and therefore keep their stored history.
 */

import { describe, it, expect } from 'vitest'

import { qfQuestionId } from '../../../src/features/quickfire/logic/questionId.js'
import { quickFireFromBank } from '../../../src/features/quickfire/logic/convertBankQuestion.js'
import { QUICK_QUIZ_QUESTIONS } from '../../../src/data/quickQuizData.js'
import { ALL_MODULE_QUICKFIRE_QUESTIONS } from '../../../src/data/questionBanks/questionRegistry.js'

describe('qfQuestionId — key precedence', () => {
  it('uses q.id when present', () => {
    expect(qfQuestionId({ id: 'qq_h1', subject: 'History', q: 'What did medieval doctors believe?' })).toBe('qq_h1')
  })

  it('uses q.questionId when q.id is absent', () => {
    expect(qfQuestionId({ questionId: 'ext-42', subject: 'Maths', q: 'What is 7 × 8?' })).toBe('ext-42')
  })

  it('falls back to the legacy subject + first-40-chars key when no id exists', () => {
    const q = { subject: 'Chemistry', q: 'What is the pH of a neutral solution?' }
    expect(qfQuestionId(q)).toBe('Chemistry::What is the pH of a neutral solution?')
    const long = { subject: 'Biology', q: 'x'.repeat(60) }
    expect(qfQuestionId(long)).toBe('Biology::' + 'x'.repeat(40))
  })

  it('editing question text does not change the key when q.id exists', () => {
    const before = qfQuestionId({ id: 'med-qf-001', subject: 'History', q: 'Original wording of the question' })
    const after = qfQuestionId({ id: 'med-qf-001', subject: 'History', q: 'Completely rewritten wording' })
    expect(after).toBe(before)
  })
})

describe('qfQuestionId — live question pool coverage', () => {
  it('every converted 90s-quiz bank question keys by its stable id', () => {
    for (const row of QUICK_QUIZ_QUESTIONS) {
      const conv = quickFireFromBank(row)
      expect(qfQuestionId(conv), row.id).toBe(row.id)
    }
  })

  it('every module-bank quickfire question keys by its stable id', () => {
    for (const q of ALL_MODULE_QUICKFIRE_QUESTIONS) {
      expect(typeof q.id, `${q.subject}: "${(q.q || '').slice(0, 40)}" has no id`).toBe('string')
      expect(qfQuestionId(q)).toBe(q.id)
    }
  })
})
