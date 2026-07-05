/**
 * Quick Fire queue selection: daily determinism, dedupe, weakness scoring,
 * recent-repeat dampening.
 *
 * The selector is pure — memory, per-question history, confidence ratings,
 * date key and clock are all passed in — so every behaviour is provable
 * without localStorage or React.
 */

import { describe, it, expect } from 'vitest'

import {
  selectQuickFireQueue,
  scoreQuestion,
  localDateKey,
  RECENT_CORRECT_WINDOW_MS,
} from '../../../src/features/quickfire/logic/quickFireSelector.js'
import { qfQuestionId } from '../../../src/features/quickfire/logic/questionId.js'

const NOW = 1_780_000_000_000

function mkQuestion(id, overrides = {}) {
  return {
    id,
    q: `Question ${id}?`,
    type: 'mc',
    options: ['a', 'b', 'c', 'd'],
    correct: 0,
    subject: 'Biology',
    topic: 'Cells',
    moduleId: null,
    ...overrides,
  }
}

const NEUTRAL_POOL = Array.from({ length: 20 }, (_, i) => mkQuestion(`q${i}`))

describe('daily deterministic seed', () => {
  it('same date + same history gives the same selected order', () => {
    const args = { questions: NEUTRAL_POOL, dateKey: '2026-07-05', now: NOW }
    const a = selectQuickFireQueue(args).map(qfQuestionId)
    const b = selectQuickFireQueue(args).map(qfQuestionId)
    expect(a).toEqual(b)
  })

  it('a different date can give a different order', () => {
    const a = selectQuickFireQueue({ questions: NEUTRAL_POOL, dateKey: '2026-07-05', now: NOW }).map(qfQuestionId)
    const b = selectQuickFireQueue({ questions: NEUTRAL_POOL, dateKey: '2026-07-06', now: NOW }).map(qfQuestionId)
    expect(a).not.toEqual(b)
  })

  it('localDateKey formats a local date as YYYY-MM-DD', () => {
    expect(localDateKey(new Date(2026, 6, 5))).toBe('2026-07-05')
  })
})

describe('repetition guard', () => {
  it('never emits duplicate question ids in the initial queue', () => {
    const withDupes = [...NEUTRAL_POOL, mkQuestion('q3'), mkQuestion('q7'), mkQuestion('q3')]
    const ids = selectQuickFireQueue({ questions: withDupes, dateKey: '2026-07-05', now: NOW }).map(qfQuestionId)
    expect(ids.length).toBe(new Set(ids).size)
    expect(ids.length).toBe(NEUTRAL_POOL.length)
  })

  it('dedupes legacy-keyed questions (no id) by their text-derived key', () => {
    const chem = { q: 'What is the pH of a neutral solution?', subject: 'Chemistry', topic: 'Acids', options: ['7', '1'], correct: 0, moduleId: null }
    const queue = selectQuickFireQueue({ questions: [chem, { ...chem }], dateKey: '2026-07-05', now: NOW })
    expect(queue.length).toBe(1)
    expect(queue[0].q).toBe(chem.q)
  })
})

describe('weakness scoring is preserved', () => {
  const base = { memory: { subjects: {}, topics: {} }, questionHistory: {}, confidenceRatings: [], now: NOW }

  it('boosts subjects with low lifetime accuracy', () => {
    const memory = { subjects: { Biology: { answered: 10, correct: 3 } }, topics: {} }
    expect(scoreQuestion(mkQuestion('a'), { ...base, memory })).toBeCloseTo((70 - 30) / 10)
  })

  it('boosts topics with low lifetime accuracy', () => {
    const memory = { subjects: {}, topics: { 'Biology::Cells': { answered: 8, correct: 2 } } }
    expect(scoreQuestion(mkQuestion('a'), { ...base, memory })).toBeCloseTo((75 - 25) / 8)
  })

  it('boosts modules self-rated as confused or clicking', () => {
    const q = mkQuestion('a', { moduleId: 'sci_bio_w1' })
    expect(scoreQuestion(q, { ...base, confidenceRatings: [{ moduleId: 'sci_bio_w1', confidence: 'confused' }] })).toBe(4)
    expect(scoreQuestion(q, { ...base, confidenceRatings: [{ moduleId: 'sci_bio_w1', confidence: 'clicking' }] })).toBe(2)
  })

  it('previously wrong questions still get boosted and rank first', () => {
    const questionHistory = { q5: { attempts: 1, correct: 0, lastResult: 'incorrect', lastAt: NOW - 1000 } }
    expect(scoreQuestion(mkQuestion('q5'), { ...base, questionHistory })).toBeCloseTo(3.5)
    const queue = selectQuickFireQueue({ questions: NEUTRAL_POOL, questionHistory, dateKey: '2026-07-05', now: NOW })
    expect(qfQuestionId(queue[0])).toBe('q5')
  })
})

describe('recent-repeat dampening', () => {
  const base = { memory: { subjects: {}, topics: {} }, questionHistory: {}, confidenceRatings: [], now: NOW }

  it('a recently correct answer takes a stronger penalty than a stale one', () => {
    const recent = scoreQuestion(mkQuestion('a'), {
      ...base,
      questionHistory: { a: { lastResult: 'correct', lastAt: NOW - 60_000 } },
    })
    const stale = scoreQuestion(mkQuestion('a'), {
      ...base,
      questionHistory: { a: { lastResult: 'correct', lastAt: NOW - RECENT_CORRECT_WINDOW_MS - 1 } },
    })
    expect(stale).toBeCloseTo(-1.0)
    expect(recent).toBeLessThan(stale)
  })

  it('history entries without lastAt (pre-timestamp data) keep the standard penalty', () => {
    const score = scoreQuestion(mkQuestion('a'), {
      ...base,
      questionHistory: { a: { lastResult: 'correct' } },
    })
    expect(score).toBeCloseTo(-1.0)
  })

  it('recently correct questions sink to the back of the queue', () => {
    const questionHistory = { q2: { lastResult: 'correct', lastAt: NOW - 60_000 } }
    const queue = selectQuickFireQueue({ questions: NEUTRAL_POOL, questionHistory, dateKey: '2026-07-05', now: NOW })
    expect(qfQuestionId(queue[queue.length - 1])).toBe('q2')
  })

  it('a recently wrong question is not dampened — it may reappear', () => {
    const score = scoreQuestion(mkQuestion('a'), {
      ...base,
      questionHistory: { a: { lastResult: 'incorrect', lastAt: NOW - 60_000 } },
    })
    expect(score).toBeCloseTo(3.5)
  })
})
