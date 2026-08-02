import { describe, it, expect } from 'vitest'
import {
  REQUIRED_QUESTION_FIELDS,
  OPTIONAL_QUESTION_FIELDS,
  validateQuestion,
} from '../../../src/data/questionBanks/questionSchema.js'
import { FORMAT, EXAM_TYPE } from '../../../src/data/questionBanks/questionTypes.js'

const validMC = Object.freeze({
  id: 'test-mc-001',
  subject: 'Biology',
  module: 'Organisation',
  topic: 'The digestive system',
  type: EXAM_TYPE.MC,
  format: FORMAT.MC,
  difficulty: 2,
  marks: 1,
  q: 'Which enzyme breaks down starch?',
  ms: 'Amylase.',
  tags: ['biology:organisation', 'skill:recall'],
  source: 'handwritten',
  options: ['Amylase', 'Lipase', 'Protease'],
  correct: 0,
})

const validWritten = Object.freeze({
  id: 'test-written-001',
  subject: 'History',
  module: 'Medicine in Britain',
  topic: 'Medieval beliefs',
  type: EXAM_TYPE.EXPLAIN_WHY,
  format: FORMAT.WRITTEN,
  difficulty: 4,
  marks: 12,
  q: 'Explain why ideas about the cause of disease changed.',
  ms: 'Level 4 (10–12 marks): …',
  tags: ['history:medicine', 'history:medicine:galen'],
  source: 'Edexcel June 2023 Paper 1 (1HI0/11)',
})

const withField = (base, patch) => ({ ...base, ...patch })
const without = (base, field) => {
  const copy = { ...base }
  delete copy[field]
  return copy
}

describe('questionSchema — field lists', () => {
  it('exposes the twelve required fields', () => {
    expect(REQUIRED_QUESTION_FIELDS).toEqual([
      'id', 'subject', 'module', 'topic', 'type', 'format',
      'difficulty', 'marks', 'q', 'ms', 'tags', 'source',
    ])
  })

  it('required and optional field lists are frozen and disjoint', () => {
    expect(Object.isFrozen(REQUIRED_QUESTION_FIELDS)).toBe(true)
    expect(Object.isFrozen(OPTIONAL_QUESTION_FIELDS)).toBe(true)
    const overlap = OPTIONAL_QUESTION_FIELDS.filter(f => REQUIRED_QUESTION_FIELDS.includes(f))
    expect(overlap).toEqual([])
  })
})

describe('validateQuestion — valid questions', () => {
  it('accepts a valid multiple-choice question', () => {
    expect(validateQuestion(validMC)).toEqual([])
  })

  it('accepts a valid written question with no options or index', () => {
    expect(validateQuestion(validWritten)).toEqual([])
  })

  it('accepts correctIndex as an alternate spelling of correct', () => {
    const q = withField(without(validMC, 'correct'), { correctIndex: 2 })
    expect(validateQuestion(q)).toEqual([])
  })

  it('allows unknown extra fields', () => {
    expect(validateQuestion(withField(validMC, { somethingNew: 'ok' }))).toEqual([])
  })
})

describe('validateQuestion — required fields', () => {
  it.each(REQUIRED_QUESTION_FIELDS)('reports a missing "%s"', field => {
    const errors = validateQuestion(without(validMC, field))
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.some(e => e.startsWith(field))).toBe(true)
  })

  it('rejects a whitespace-only string field', () => {
    expect(validateQuestion(withField(validMC, { source: '   ' })))
      .toContain('source must be a non-empty string')
  })

  it('rejects a non-object', () => {
    expect(validateQuestion(null)).toEqual(['question must be an object'])
    expect(validateQuestion('nope')).toEqual(['question must be an object'])
    expect(validateQuestion([validMC])).toEqual(['question must be an object'])
  })
})

describe('validateQuestion — difficulty', () => {
  it.each([0, 6, -1, 2.5, '3', null])('rejects difficulty %p', value => {
    const errors = validateQuestion(withField(validMC, { difficulty: value }))
    expect(errors.some(e => e.startsWith('difficulty'))).toBe(true)
  })

  it.each([1, 2, 3, 4, 5])('accepts difficulty %i', value => {
    expect(validateQuestion(withField(validMC, { difficulty: value }))).toEqual([])
  })
})

describe('validateQuestion — marks', () => {
  it.each([0, -4, Infinity, NaN, '4'])('rejects marks %p', value => {
    const errors = validateQuestion(withField(validMC, { marks: value }))
    expect(errors.some(e => e.startsWith('marks'))).toBe(true)
  })
})

describe('validateQuestion — format and type', () => {
  it('rejects an unregistered format', () => {
    expect(validateQuestion(withField(validMC, { format: 'quiz' })))
      .toContain('format "quiz" is not a registered FORMAT value')
  })

  it('rejects an unregistered type', () => {
    expect(validateQuestion(withField(validMC, { type: 'vibes' })))
      .toContain('type "vibes" is not a registered EXAM_TYPE value')
  })

  it('skips format-specific rules when the format itself is unregistered', () => {
    // No misleading follow-on option errors when the format is nonsense.
    const errors = validateQuestion(withField(validMC, { format: 'quiz', options: undefined }))
    expect(errors).toEqual(['format "quiz" is not a registered FORMAT value'])
  })

  it('fails mc_multi and truefalse until a canonical answer representation is agreed', () => {
    expect(validateQuestion(withField(validMC, { format: FORMAT.MC_MULTI })).join(' '))
      .toMatch(/no canonical answer representation/)
    expect(validateQuestion(withField(validWritten, { format: FORMAT.TRUE_FALSE })).join(' '))
      .toMatch(/no canonical answer representation/)
  })
})

describe('validateQuestion — tags', () => {
  it('rejects an empty tags array', () => {
    expect(validateQuestion(withField(validMC, { tags: [] })))
      .toContain('tags must be a non-empty array')
  })

  it('rejects a non-array tags value', () => {
    expect(validateQuestion(withField(validMC, { tags: 'history:medicine' })))
      .toContain('tags must be a non-empty array')
  })

  it('rejects empty or non-string tag entries', () => {
    expect(validateQuestion(withField(validMC, { tags: ['ok', '  '] })))
      .toContain('tags must contain only non-empty strings')
    expect(validateQuestion(withField(validMC, { tags: ['ok', 42] })))
      .toContain('tags must contain only non-empty strings')
  })
})

describe('validateQuestion — multiple-choice answers', () => {
  it('rejects an out-of-bounds correct index', () => {
    expect(validateQuestion(withField(validMC, { correct: 3 })))
      .toContain('correct index 3 is outside options (length 3)')
  })

  it('rejects a negative correct index', () => {
    expect(validateQuestion(withField(validMC, { correct: -1 })))
      .toContain('correct index -1 is outside options (length 3)')
  })

  it('rejects a non-integer correct index', () => {
    expect(validateQuestion(withField(validMC, { correct: '0' })))
      .toContain('correct must be an integer option index (got "0")')
  })

  it('rejects a missing correct index', () => {
    expect(validateQuestion(without(validMC, 'correct')))
      .toContain('correct must be an integer option index (got undefined)')
  })

  it('rejects fewer than two options', () => {
    expect(validateQuestion(withField(validMC, { options: ['Only one'] })))
      .toContain('options must be an array with at least two entries')
  })

  it('rejects empty or non-string options', () => {
    expect(validateQuestion(withField(validMC, { options: ['A', '  '] })))
      .toContain('options must contain only non-empty strings')
  })
})

describe('validateQuestion — purity', () => {
  it('does not mutate the question it is given', () => {
    const q = { ...validMC, tags: [...validMC.tags], options: [...validMC.options] }
    const snapshot = JSON.stringify(q)
    validateQuestion(q)
    validateQuestion(withField(q, { difficulty: 99 }))
    expect(JSON.stringify(q)).toBe(snapshot)
  })

  it('accepts a deeply frozen question without throwing', () => {
    expect(() => validateQuestion(Object.freeze(validWritten))).not.toThrow()
  })

  it('returns errors in a deterministic order across repeated calls', () => {
    const broken = withField(validMC, {
      id: '', difficulty: 9, marks: 0, tags: [], format: FORMAT.MC, correct: 42,
    })
    const first = validateQuestion(broken)
    expect(validateQuestion(broken)).toEqual(first)
    expect(validateQuestion({ ...broken })).toEqual(first)
  })

  it('orders errors to follow REQUIRED_QUESTION_FIELDS, format rules last', () => {
    const broken = withField(validMC, { id: '', difficulty: 9, marks: 0, correct: 42 })
    expect(validateQuestion(broken)).toEqual([
      'id must be a non-empty string',
      'difficulty must be an integer 1–5 (got 9)',
      'marks must be a positive finite number (got 0)',
      'correct index 42 is outside options (length 3)',
    ])
  })
})
