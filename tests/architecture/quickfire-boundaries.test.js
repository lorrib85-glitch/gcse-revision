/**
 * Architecture guard tests for the quickfire feature refactor (Phases 1.5–1.7).
 *
 * These tests enforce the module boundaries established during the refactor
 * and prevent regression toward a monolithic QuickFire.jsx.
 *
 * TODO (Phase 1.8 — ExamMode extraction): after ExamMode state machine,
 * startExamRound, ExamRoundDebrief and countdown/timer/scoring flows are
 * extracted, tighten the QuickFire.jsx line limit from 1800 → 500.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { gradeWithAI, cleanQuestionText, GRADE_COLOURS } from '../../src/features/quickfire/utils.js'

const root = resolve(process.cwd())
const read  = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))

const qfSrc = read('src/features/quickfire/QuickFire.jsx')

/**
 * Returns true if the source file contains a top-level function declaration
 * or top-level const assignment with the given name.
 * Matches at the start of a line (column 0), optionally preceded by "export".
 * Does NOT match imports, JSX usages, or nested function definitions.
 */
function definesTopLevel(src, name) {
  const fnDecl   = new RegExp(`(?:^|\\n)(?:export\\s+)?function ${name}[\\s(]`)
  const constDecl = new RegExp(`(?:^|\\n)(?:export\\s+)?const ${name}\\s*=`)
  return fnDecl.test(src) || constDecl.test(src)
}

// ─── Rule 1: File size ────────────────────────────────────────────────────────
// QuickFire.jsx is being progressively reduced. The 1800-line limit is a
// temporary ceiling for Phase 1.7 (post-Maths extraction). It should drop to
// 500 once ExamMode is extracted in Phase 1.8.

describe('QuickFire.jsx — file-size boundary', () => {
  it('is below 1800 lines (TODO: reduce to 500 after Phase 1.8 ExamMode extraction)', () => {
    const lineCount = qfSrc.split('\n').length
    expect(
      lineCount,
      `QuickFire.jsx has ${lineCount} lines — must stay below 1800. ` +
      'After ExamMode is extracted (Phase 1.8) lower this limit to 500.',
    ).toBeLessThan(1800)
  })
})

// ─── Rule 2: No banned inline definitions ─────────────────────────────────────
// Each of these components has been extracted to a dedicated file and imported.
// Redefining any of them inside QuickFire.jsx re-grows the monolith.

describe('QuickFire.jsx — banned inline definitions', () => {
  const BANNED_COMPONENTS = [
    ['MathsQuestion',        'modes/MathsQuestion.jsx'],
    ['MathsBrowser',         'modes/MathsBrowser.jsx'],
    ['MathsTopicView',       'modes/MathsTopicView.jsx'],
    ['FormulaSheet',         'components/FormulaSheet.jsx'],
    ['TopicPracticeMode',    'modes/TopicPracticeMode.jsx'],
    ['QuickFireQuestionScreen', 'components/QuickFireQuestionScreen.jsx'],
    ['QuickFireMode',        'modes/QuickFireMode.jsx'],
  ]

  for (const [name, extractedPath] of BANNED_COMPONENTS) {
    it(`does not define ${name} inline (it lives in ${extractedPath})`, () => {
      expect(
        definesTopLevel(qfSrc, name),
        `QuickFire.jsx defines ${name} inline — import it from src/features/quickfire/${extractedPath} instead`,
      ).toBe(false)
    })
  }

  it('does not define PAST_PAPER_QS (question banks live in src/data/questionBanks/)', () => {
    const hasDef = /(?:^|\n)(?:export\s+)?const PAST_PAPER_QS\s*=/.test(qfSrc)
    expect(
      hasDef,
      'QuickFire.jsx defines PAST_PAPER_QS — move question banks to src/data/questionBanks/ and access via QUESTION_BANKS_BY_MODULE',
    ).toBe(false)
  })
})

// ─── Rule 3: Extracted mode files ────────────────────────────────────────────
// Every mode file extracted during Phase 1.5–1.7 must continue to exist.

describe('Quickfire — extracted mode files', () => {
  const MODES = [
    'src/features/quickfire/modes/QuickFireMode.jsx',
    'src/features/quickfire/modes/TopicPracticeMode.jsx',
    'src/features/quickfire/modes/MathsBrowser.jsx',
    'src/features/quickfire/modes/MathsTopicView.jsx',
    'src/features/quickfire/modes/MathsQuestion.jsx',
  ]

  for (const path of MODES) {
    it(`${path} exists`, () => {
      expect(exists(path), `${path} is missing — has it been deleted or moved?`).toBe(true)
    })
  }
})

// ─── Rule 4: Extracted component files ───────────────────────────────────────
// Every component file extracted during Phase 1.5–1.7 must continue to exist.

describe('Quickfire — extracted component files', () => {
  const COMPONENTS = [
    'src/features/quickfire/components/CircularTimer.jsx',
    'src/features/quickfire/components/QuickFireQuestionScreen.jsx',
    'src/features/quickfire/components/FormulaSheet.jsx',
  ]

  for (const path of COMPONENTS) {
    it(`${path} exists`, () => {
      expect(exists(path), `${path} is missing — has it been deleted or moved?`).toBe(true)
    })
  }
})

// ─── Rule 5: Supporting context and utils files ───────────────────────────────

describe('Quickfire — supporting files', () => {
  it('testDataContext.jsx exists (extracted from QuickFire.jsx)', () => {
    expect(
      exists('src/features/quickfire/testDataContext.jsx'),
      'testDataContext.jsx is missing — TestDataContext/useTestData/TestDataProvider should live here',
    ).toBe(true)
  })

  it('utils.js exists', () => {
    expect(exists('src/features/quickfire/utils.js')).toBe(true)
  })
})

// ─── Rule 6: Shared utils exports ────────────────────────────────────────────
// gradeWithAI, cleanQuestionText and GRADE_COLOURS are shared between multiple
// mode files. They must be exported from utils.js — not duplicated per-file.

describe('Quickfire — utils.js exports', () => {
  it('exports gradeWithAI as a function', () => {
    expect(
      typeof gradeWithAI,
      'gradeWithAI should be a function exported from utils.js',
    ).toBe('function')
  })

  it('exports cleanQuestionText as a function', () => {
    expect(
      typeof cleanQuestionText,
      'cleanQuestionText should be a function exported from utils.js',
    ).toBe('function')
  })

  it('exports GRADE_COLOURS as an object with all four grade keys', () => {
    expect(typeof GRADE_COLOURS).toBe('object')
    for (const key of ['Excellent', 'Good', 'Developing', 'Needs Work']) {
      expect(
        Object.prototype.hasOwnProperty.call(GRADE_COLOURS, key),
        `GRADE_COLOURS is missing key "${key}"`,
      ).toBe(true)
    }
  })

  it('each GRADE_COLOURS entry has bg, border, text, badge properties', () => {
    for (const [grade, style] of Object.entries(GRADE_COLOURS)) {
      for (const prop of ['bg', 'border', 'text', 'badge']) {
        expect(
          typeof style[prop],
          `GRADE_COLOURS["${grade}"].${prop} should be a string`,
        ).toBe('string')
      }
    }
  })
})

// ─── Rule 7: Question bank structure ─────────────────────────────────────────
// New question banks go in src/data/questionBanks/, accessed via
// QUESTION_BANKS_BY_MODULE. Broad catch-all files at src/data/ root are banned.

describe('Question bank structure', () => {
  it('questionRegistry.js exists at src/data/questionBanks/questionRegistry.js', () => {
    expect(exists('src/data/questionBanks/questionRegistry.js')).toBe(true)
  })

  it('history/medicine.js exists at src/data/questionBanks/history/medicine.js', () => {
    expect(exists('src/data/questionBanks/history/medicine.js')).toBe(true)
  })

  it('no broad catch-all question bank files exist at src/data/ root level', () => {
    const forbidden = [
      'src/data/biologyQuestions.js',
      'src/data/physicsQuestions.js',
      'src/data/dramaQuestions.js',
      'src/data/musicQuestions.js',
    ]
    const present = forbidden.filter(exists)
    expect(
      present,
      `Speculative question bank files found at src/data/ root: ${present.join(', ')}. ` +
      'New banks go in src/data/questionBanks/<subject>/ and must contain real questions.',
    ).toHaveLength(0)
  })

  it('PAST_PAPER_QS is not defined in QuickFire.jsx, LegacyApp.jsx, or App.jsx', () => {
    const filesToCheck = [
      'src/features/quickfire/QuickFire.jsx',
      'src/app/LegacyApp.jsx',
      'src/App.jsx',
    ]
    const violators = filesToCheck.filter(rel =>
      /(?:^|\n)(?:export\s+)?const PAST_PAPER_QS\s*=/.test(read(rel))
    )
    expect(
      violators,
      `PAST_PAPER_QS is defined in: ${violators.join(', ')}. Move to src/data/questionBanks/.`,
    ).toHaveLength(0)
  })
})
