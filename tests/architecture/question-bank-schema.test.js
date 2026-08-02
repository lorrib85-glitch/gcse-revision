// ─── Question bank metadata contract ─────────────────────────────────────────
//
// Owns the structural contract for every question exposed through
// `ALL_QUESTIONS`, plus the data-only boundary around the bank files.
//
// Ownership split with tests/architecture/learning-graph.test.js:
//   this file          → question-id uniqueness, required fields, difficulty,
//                        marks, format, type, MC answer validity, provenance
//   learning-graph.js  → tag vocabulary validity, concept registration,
//                        topic-graph integrity
// Do not duplicate an assertion across both.
//
// See docs/system/QUESTION_BANK_CONTRACT.md.

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'

import { ALL_QUESTIONS } from '../../src/data/questionBanks/questionRegistry.js'
import { FORMAT, EXAM_TYPE } from '../../src/data/questionBanks/questionTypes.js'
import {
  REQUIRED_QUESTION_FIELDS,
  validateQuestion,
} from '../../src/data/questionBanks/questionSchema.js'
import {
  J23_Q1, J23_Q2A, J23_Q2B, J23_Q3, J23_Q4, J23_Q5, J23_Q6,
} from '../../src/data/medicineExamPapers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '../..')
const BANK_DIR = join(REPO_ROOT, 'src/data/questionBanks')

const bankFiles = globSync('**/*.js', { cwd: BANK_DIR, absolute: true })

const REGISTERED_FORMATS = Object.values(FORMAT)
const REGISTERED_TYPES = Object.values(EXAM_TYPE)

// ─── The registry itself ─────────────────────────────────────────────────────

describe('Question registry', () => {
  it('exports a non-empty ALL_QUESTIONS', () => {
    expect(Array.isArray(ALL_QUESTIONS)).toBe(true)
    expect(ALL_QUESTIONS.length).toBeGreaterThan(0)
  })

  it('every question id is unique', () => {
    const seen = new Set()
    const dupes = []
    for (const q of ALL_QUESTIONS) {
      if (seen.has(q.id)) dupes.push(q.id)
      seen.add(q.id)
    }
    expect(dupes, `duplicate question ids: ${dupes.join(', ')}`).toEqual([])
  })
})

// ─── The canonical contract, question by question ────────────────────────────

describe('Question metadata contract', () => {
  it('every question in ALL_QUESTIONS passes validateQuestion()', () => {
    const failures = ALL_QUESTIONS
      .map(q => ({ id: q.id, errors: validateQuestion(q) }))
      .filter(entry => entry.errors.length > 0)
      .map(entry => `${entry.id}: ${entry.errors.join('; ')}`)
    expect(failures, `schema failures:\n  ${failures.join('\n  ')}`).toEqual([])
  })

  it('every question has all required fields defined', () => {
    for (const q of ALL_QUESTIONS) {
      for (const field of REQUIRED_QUESTION_FIELDS) {
        expect(q[field], `${q.id} missing required field "${field}"`).toBeDefined()
      }
    }
  })

  it('every difficulty is an integer 1–5', () => {
    for (const q of ALL_QUESTIONS) {
      expect(Number.isInteger(q.difficulty), `${q.id} difficulty not an integer`).toBe(true)
      expect(q.difficulty, `${q.id} difficulty out of range`).toBeGreaterThanOrEqual(1)
      expect(q.difficulty, `${q.id} difficulty out of range`).toBeLessThanOrEqual(5)
    }
  })

  it('every marks value is a positive finite number', () => {
    for (const q of ALL_QUESTIONS) {
      expect(Number.isFinite(q.marks), `${q.id} marks not finite`).toBe(true)
      expect(q.marks, `${q.id} marks not positive`).toBeGreaterThan(0)
    }
  })

  it('every format is a registered FORMAT value', () => {
    for (const q of ALL_QUESTIONS) {
      expect(REGISTERED_FORMATS, `${q.id} format "${q.format}" unregistered`).toContain(q.format)
    }
  })

  it('every type is a registered EXAM_TYPE value', () => {
    for (const q of ALL_QUESTIONS) {
      expect(REGISTERED_TYPES, `${q.id} type "${q.type}" unregistered`).toContain(q.type)
    }
  })

  it('every provenance field (source, subject, module, topic) is a non-empty string', () => {
    for (const q of ALL_QUESTIONS) {
      for (const field of ['source', 'subject', 'module', 'topic']) {
        expect(typeof q[field], `${q.id} ${field} not a string`).toBe('string')
        expect(q[field].trim().length, `${q.id} ${field} empty`).toBeGreaterThan(0)
      }
    }
  })
})

// ─── Format-specific answer validity ─────────────────────────────────────────

describe('Multiple-choice answer validity', () => {
  const mcQuestions = ALL_QUESTIONS.filter(q => q.format === FORMAT.MC)

  it('the bank contains multiple-choice questions to check', () => {
    expect(mcQuestions.length).toBeGreaterThan(0)
  })

  it('every MC question has at least two non-empty option strings', () => {
    for (const q of mcQuestions) {
      expect(Array.isArray(q.options), `${q.id} options not an array`).toBe(true)
      expect(q.options.length, `${q.id} needs 2+ options`).toBeGreaterThanOrEqual(2)
      for (const option of q.options) {
        expect(typeof option, `${q.id} non-string option`).toBe('string')
        expect(option.trim().length, `${q.id} empty option`).toBeGreaterThan(0)
      }
    }
  })

  it('every MC correct index is an integer inside its options array', () => {
    for (const q of mcQuestions) {
      const index = q.correct !== undefined ? q.correct : q.correctIndex
      expect(Number.isInteger(index), `${q.id} correct index not an integer`).toBe(true)
      expect(index, `${q.id} correct index negative`).toBeGreaterThanOrEqual(0)
      expect(index, `${q.id} correct index out of bounds`).toBeLessThan(q.options.length)
    }
  })

  it('written questions carry no options or answer index', () => {
    for (const q of ALL_QUESTIONS.filter(q => q.format === FORMAT.WRITTEN)) {
      expect(q.options, `${q.id} is written but has options`).toBeUndefined()
    }
  })
})

// ─── Bank files stay a pure data layer ───────────────────────────────────────

describe('Question bank files are data-only', () => {
  it('finds the question bank source files', () => {
    expect(bankFiles.length).toBeGreaterThanOrEqual(7)
  })

  it('no React, JSX, component, feature, app or storage imports', () => {
    for (const file of bankFiles) {
      const src = readFileSync(file, 'utf8')
      expect(src, `${file} imports react`).not.toMatch(/from ['"]react/)
      expect(src, `${file} imports a component`).not.toMatch(/from ['"].*components\//)
      expect(src, `${file} imports features`).not.toMatch(/from ['"].*features\//)
      expect(src, `${file} imports the app layer`).not.toMatch(/from ['"].*\/app\//)
      expect(src, `${file} imports jsx`).not.toMatch(/from ['"].*\.jsx['"]/)
      expect(src, `${file} imports storage`).not.toMatch(/from ['"].*lib\/storage/)
      expect(src, `${file} touches localStorage`).not.toMatch(/localStorage/)
    }
  })

  it('questionSchema.js imports nothing but questionTypes.js', () => {
    const src = readFileSync(join(BANK_DIR, 'questionSchema.js'), 'utf8')
    const imports = [...src.matchAll(/from ['"]([^'"]+)['"]/g)].map(m => m[1])
    expect(imports).toEqual(['./questionTypes.js'])
  })

  it('no broad catch-all replacement bank is introduced', () => {
    for (const name of ['science/biology/biologyQuestions.js', 'biologyQuestions.js', 'allQuestions.js']) {
      expect(existsSync(join(BANK_DIR, name)), `catch-all bank ${name} exists`).toBe(false)
    }
  })

  it('no speculative Chemistry, Physics, Drama or Music bank is introduced', () => {
    for (const subject of ['chemistry', 'physics', 'drama', 'music']) {
      const matches = globSync(`**/${subject}/**/*.js`, { cwd: BANK_DIR })
      expect(matches, `speculative ${subject} bank: ${matches.join(', ')}`).toEqual([])
    }
  })
})

// ─── June 2023 Medicine paper — the standardised exception ───────────────────

describe('June 2023 Medicine paper questions meet the canonical contract', () => {
  const J23_QUESTIONS = [J23_Q1, J23_Q2A, J23_Q2B, J23_Q3, J23_Q4, J23_Q5, J23_Q6]

  const EXPECTED = {
    j23p1_q1:  { type: EXAM_TYPE.DESCRIBE_TWO,     difficulty: 2 },
    j23p1_q2a: { type: EXAM_TYPE.SOURCE_UTILITY,   difficulty: 4 },
    j23p1_q2b: { type: EXAM_TYPE.SOURCE_FOLLOW_UP, difficulty: 3 },
    j23p1_q3:  { type: EXAM_TYPE.EXPLAIN_SIMILAR,  difficulty: 3 },
    j23p1_q4:  { type: EXAM_TYPE.EXPLAIN_WHY,      difficulty: 4 },
    j23p1_q5:  { type: EXAM_TYPE.HOW_FAR,          difficulty: 5 },
    j23p1_q6:  { type: EXAM_TYPE.HOW_FAR,          difficulty: 5 },
  }

  it('all seven questions are exported', () => {
    expect(J23_QUESTIONS.map(q => q.id)).toEqual(Object.keys(EXPECTED))
  })

  it('all seven validate against the schema', () => {
    for (const q of J23_QUESTIONS) {
      expect(validateQuestion(q), `${q.id}: ${validateQuestion(q).join('; ')}`).toEqual([])
    }
  })

  it('all seven carry the shared paper metadata', () => {
    for (const q of J23_QUESTIONS) {
      expect(q.subject, `${q.id} subject`).toBe('History')
      expect(q.course, `${q.id} course`).toBe('Edexcel GCSE History')
      expect(q.examBoard, `${q.id} examBoard`).toBe('Edexcel')
      expect(q.module, `${q.id} module`).toBe('Medicine in Britain')
      expect(q.format, `${q.id} format`).toBe(FORMAT.WRITTEN)
      expect(q.source, `${q.id} source`).toBe('Edexcel June 2023 Paper 1 (1HI0/11)')
    }
  })

  it('each question carries its approved assessment type and difficulty', () => {
    for (const q of J23_QUESTIONS) {
      expect(q.type, `${q.id} type`).toBe(EXPECTED[q.id].type)
      expect(q.difficulty, `${q.id} difficulty`).toBe(EXPECTED[q.id].difficulty)
    }
  })

  it('all seven are reachable through ALL_QUESTIONS', () => {
    const ids = new Set(ALL_QUESTIONS.map(q => q.id))
    for (const id of Object.keys(EXPECTED)) {
      expect(ids.has(id), `${id} missing from ALL_QUESTIONS`).toBe(true)
    }
  })

  it('the timed-paper path forwards both type and format', () => {
    const src = readFileSync(join(REPO_ROOT, 'src/features/quickfire/modes/ExamMode.jsx'), 'utf8')
    const paperFields = src.match(/function startMedicinePaper2023\(\)[\s\S]*?\n {2}\}/)?.[0] ?? ''
    expect(paperFields, 'startMedicinePaper2023 drops type').toMatch(/type:\s*q\.type/)
    expect(paperFields, 'startMedicinePaper2023 drops format').toMatch(/format:\s*q\.format/)
  })
})
