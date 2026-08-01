/**
 * Architecture guard tests for the quickfire feature (Phases 1.5–1.8, hardened
 * in Phase 6 / backlog A1).
 *
 * These tests enforce the module boundaries established during the refactor and
 * prevent regression toward a monolithic QuickFire.jsx.
 *
 * Phase 6 removed the obsolete subject-selection landing from QuickFire.jsx.
 * That landing was unreachable in the running app (TestTab is only ever mounted
 * as mode="quickfire" or mode="exam") and was only revealed by a bug: the
 * quickfire round exited to local state instead of the parent's onExit. The
 * guards below pin the repaired contract so neither the bug nor the landing can
 * return.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'
import { gradeWithAI, cleanQuestionText, GRADE_COLOURS } from '../../src/features/quickfire/utils.js'

const root = resolve(process.cwd())
const read  = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))
const globSrcFiles = () =>
  globSync('src/**/*.{jsx,js}', { cwd: root, ignore: ['**/node_modules/**'] })

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
// Phase 6 reduced QuickFire.jsx to a 38-line mode boundary by deleting the
// unreachable subject-selection landing and its browser fragments. The ceiling
// is set at 80 — enough headroom for the two mode branches to gain a prop or a
// comment, far too little for a landing screen or a browser component.

describe('QuickFire.jsx — file-size boundary', () => {
  it('is below 80 lines (it is a mode boundary, not a screen)', () => {
    const lineCount = qfSrc.split('\n').length
    expect(
      lineCount,
      `QuickFire.jsx has ${lineCount} lines — must stay below 80. ` +
      'It renders QuickFireMode or ExamMode and nothing else; screens belong in modes/.',
    ).toBeLessThan(80)
  })
})

// ─── Rule 2: No banned inline definitions ─────────────────────────────────────
// Two groups. The first still live elsewhere and must be imported, never
// re-inlined. The second were deleted in Phase 6 and must not come back at all.

describe('QuickFire.jsx — banned inline definitions', () => {
  const EXTRACTED_COMPONENTS = [
    ['FormulaSheet',            'components/FormulaSheet.jsx'],
    ['TopicPracticeMode',       'modes/TopicPracticeMode.jsx'],
    ['QuickFireQuestionScreen', 'components/QuickFireQuestionScreen.jsx'],
    ['QuickFireMode',           'modes/QuickFireMode.jsx'],
    ['ExamMode',                'modes/ExamMode.jsx'],
  ]

  for (const [name, extractedPath] of EXTRACTED_COMPONENTS) {
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
      'QuickFire.jsx defines PAST_PAPER_QS — move question banks to src/data/questionBanks/ and access via QUESTION_BANKS_BY_TOPIC',
    ).toBe(false)
  })

  it('does not define startExamRound inline (exam round logic lives in modes/ExamMode.jsx)', () => {
    expect(
      definesTopLevel(qfSrc, 'startExamRound'),
      'QuickFire.jsx defines startExamRound — it was extracted to modes/ExamMode.jsx in Phase 1.8',
    ).toBe(false)
  })
})

// ─── Rule 3: The obsolete subject-selection landing stays deleted ─────────────
// TestTab has exactly two live callers: LegacyApp (mode="quickfire") and
// ExamPractice (mode="exam"). Neither opens a subject/topic grid. The landing
// could not render even if reached — its browsers read useTestData(), and
// TestDataProvider deliberately wraps only the Exams tab.

describe('QuickFire.jsx — no subject-selection landing', () => {
  const DELETED_LANDING_MEMBERS = [
    'EXAM_SUBJECTS',
    'EnglishBrowser',
    'EnglishTopicView',
    'SociologyBrowser',
    'SociologyTopicView',
    'ChemistryBrowser',
    'ChemistryTopicView',
    'ChemImage',
  ]

  for (const name of DELETED_LANDING_MEMBERS) {
    it(`does not define ${name} (deleted with the obsolete landing in Phase 6)`, () => {
      expect(
        definesTopLevel(qfSrc, name),
        `QuickFire.jsx defines ${name} — it belonged to the obsolete subject-selection landing, ` +
        'which no supported caller opens. Do not restore it.',
      ).toBe(false)
    })
  }

  it('renders no subject grid or topic-picker copy', () => {
    const LANDING_COPY = ['Or select a topic', 'Real Exam Papers', 'Practice Test', 'Random Quick Fire']
    const found = LANDING_COPY.filter((copy) => qfSrc.includes(copy))
    expect(
      found,
      `QuickFire.jsx contains subject-landing copy: ${found.join(', ')}. ` +
      'QuickFire.jsx is a mode boundary — it renders no screen of its own.',
    ).toEqual([])
  })

  it('holds no local landing/session state (no useState at all)', () => {
    expect(
      /\buseState\b/.test(qfSrc),
      'QuickFire.jsx uses useState — the mode boundary is stateless. Local post-round state ' +
      '(qfSessionActive, mathsOpen, selected, …) is what revealed the obsolete landing on exit.',
    ).toBe(false)
  })

  it('does not read useTestData (exam data belongs to Exam Mode)', () => {
    expect(
      qfSrc.includes('useTestData'),
      'QuickFire.jsx reads useTestData — exam question-bank data loads for Exam Mode, not for the mode boundary.',
    ).toBe(false)
  })
})

// ─── Rule 4: The quickfire exit contract ─────────────────────────────────────
// The Phase 6 bug: QuickFireMode was handed a local setter instead of the
// parent's onExit, so finishing a round fell through to the landing rather than
// returning to Pulse / Home / the chapter-completion origin.

describe('QuickFire.jsx — exit contract', () => {
  it('delegates the quickfire round exit to the parent onExit', () => {
    const line = qfSrc
      .split('\n')
      .find((l) => l.includes('<QuickFireMode'))
    expect(line, 'QuickFire.jsx no longer renders QuickFireMode').toBeTruthy()
    expect(
      line,
      'QuickFireMode must receive the parent onExit directly. A local callback ' +
      '(e.g. onExit={() => setQfSessionActive(false)}) strands the learner on an ' +
      'internal landing instead of returning them to their origin tab.',
    ).toMatch(/onExit=\{onExit\}/)
  })

  it('forwards onExit to ExamMode too', () => {
    expect(
      /onExit=\{onExit\}/.test(qfSrc.slice(qfSrc.indexOf('<ExamMode'))),
      'ExamMode must keep receiving the parent onExit',
    ).toBe(true)
  })

  it('supports exactly the quickfire and exam modes', () => {
    expect(qfSrc).toContain("mode === 'quickfire'")
    expect(qfSrc).toContain("mode === 'exam'")
    expect(
      /mode\s*=\s*['"]test['"]/.test(qfSrc),
      'QuickFire.jsx still carries the unsupported default mode="test" — no caller uses it.',
    ).toBe(false)
  })
})

// ─── Rule 5: TestDataProvider wraps Exam Mode only ───────────────────────────
// The durable rule: exam question-bank data loads for Exam Mode, not for
// QuickFire. Wrapping the QuickFire/Pulse path in TestDataProvider would pull
// five lazy-loaded data modules into the Pulse path.

describe('TestDataProvider — Exam Mode only', () => {
  const examPracticeSrc = read('src/features/exams/ExamPractice.jsx')
  const legacyAppSrc    = read('src/app/LegacyApp.jsx')

  it('ExamPractice mounts TestDataProvider around its TestTab', () => {
    expect(examPracticeSrc).toContain('TestDataProvider')
    expect(examPracticeSrc).toContain('mode="exam"')
  })

  it('ExamPractice imports TestDataProvider from testDataContext.jsx', () => {
    expect(
      examPracticeSrc,
      'TestDataProvider should be imported from its own module, not re-exported through QuickFire.jsx',
    ).toMatch(/import\s*\{\s*TestDataProvider\s*\}\s*from\s*'\.\.\/quickfire\/testDataContext\.jsx'/)
  })

  it('QuickFire.jsx does not import, re-export or mount TestDataProvider', () => {
    // Matches code, not the prose comment that explains the rule.
    const wiring = [
      /export\s*\{[^}]*TestDataProvider/,
      /import\s*\{[^}]*TestDataProvider/,
      /<TestDataProvider/,
    ].filter((re) => re.test(qfSrc))
    expect(
      wiring,
      'QuickFire.jsx wires up TestDataProvider — the provider belongs to ExamPractice, ' +
      'and the mode boundary must not offer a route that wraps QuickFire in exam data.',
    ).toEqual([])
  })

  it('LegacyApp does not wrap the quickfire tab in TestDataProvider', () => {
    expect(
      legacyAppSrc.includes('TestDataProvider'),
      'LegacyApp references TestDataProvider — the QuickFire/Pulse path must never load exam question banks.',
    ).toBe(false)
  })

  it('LegacyApp mounts TestTab only as mode="quickfire"', () => {
    const testTabUses = legacyAppSrc.split('\n').filter((l) => l.includes('<TestTab'))
    expect(testTabUses).toHaveLength(1)
    expect(testTabUses[0]).toContain('mode="quickfire"')
    expect(
      testTabUses[0],
      'The quickfire TestTab must pass an onExit so the round returns to its origin tab',
    ).toContain('onExit=')
  })
})

// ─── Rule 6: Extracted mode files ────────────────────────────────────────────
// Every mode file still reachable from the live boundary must continue to exist.
// The Maths browser trio (MathsBrowser / MathsTopicView / MathsQuestion) was
// deleted in Phase 6 along with the landing that was its only consumer, and is
// asserted absent in Rule 7 instead.

describe('Quickfire — extracted mode files', () => {
  const MODES = [
    'src/features/quickfire/modes/QuickFireMode.jsx',
    'src/features/quickfire/modes/TopicPracticeMode.jsx',
    'src/features/quickfire/modes/ExamMode.jsx',
  ]

  for (const path of MODES) {
    it(`${path} exists`, () => {
      expect(exists(path), `${path} is missing — has it been deleted or moved?`).toBe(true)
    })
  }
})

// ─── Rule 7: Deleted browser files stay deleted ──────────────────────────────
// These three had exactly one consumer chain, rooted in the obsolete landing:
// landing → MathsBrowser → MathsTopicView → MathsQuestion (and the landing's
// English/Sociology/Chemistry topic views, also deleted). Restoring a file here
// means restoring a route no caller opens.

describe('Quickfire — deleted browser files stay deleted', () => {
  const DELETED = [
    'src/features/quickfire/modes/MathsBrowser.jsx',
    'src/features/quickfire/modes/MathsTopicView.jsx',
    'src/features/quickfire/modes/MathsQuestion.jsx',
  ]

  for (const path of DELETED) {
    it(`${path} does not exist`, () => {
      expect(
        exists(path),
        `${path} is back. It was deleted in Phase 6 with the obsolete subject-selection ` +
        'landing — its only consumer. Reintroducing it needs a supported caller first.',
      ).toBe(false)
    })
  }

  it('no source file imports a deleted browser module', () => {
    const importers = globSrcFiles().filter((rel) =>
      /from\s*'[^']*\/(MathsBrowser|MathsTopicView|MathsQuestion)\.jsx'/.test(read(rel)),
    )
    expect(
      importers,
      `Deleted browser modules are imported by: ${importers.join(', ')}`,
    ).toEqual([])
  })
})

// ─── Rule 8: Extracted component files ───────────────────────────────────────
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

// ─── Rule 9: Supporting context and utils files ───────────────────────────────

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

// ─── Rule 10: Shared utils exports ───────────────────────────────────────────
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

// ─── Rule 11: Question bank structure ────────────────────────────────────────
// New question banks go in src/data/questionBanks/, accessed via
// QUESTION_BANKS_BY_TOPIC. Broad catch-all files at src/data/ root are banned.

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
