import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Values migrated to named tokens (see DEVELOPMENT_WORKFLOW.md file-hygiene
// pass). Each must never reappear as a raw hex literal in src/components/**
// or src/features/** — always reference the token instead. Selected migrations
// also guard learner-facing data when the raw value previously lived there.
// This list only grows when a new value is deliberately migrated; it is not a
// grandfather list for unmigrated debt (see .planning/codebase/CONCERNS.md for
// what's still raw and why it wasn't touched in this pass).
const MIGRATED_VALUES = [
  { hex: '#0F0B07', token: 'SUBJECTS.History.background' },
  { hex: '#2A9D8F', token: 'GENERAL.teal' },
  { hex: '#E76F51', token: 'GENERAL.coral' },
  { hex: '#0D0D0D', token: 'GENERAL.neutral[900]' },
  { hex: '#E0836B', token: 'GENERAL.coral' },
  // GuidedChoiceCarousel off-token gold → resolved subject accent.
  { hex: '#D9A441', token: 'SUBJECTS[subject].accent' },
  // SwipeSort bespoke near-black backdrop → resolved subject background.
  { hex: '#05060A', token: 'SUBJECTS[subject].background' },
  // ModulePlayer full-screen shells → GENERAL.backgroundApp; ConceptReveal
  // subject-atmospheric gradient → resolved subject background token.
  { hex: '#080C1A', token: 'GENERAL.backgroundApp / SUBJECTS[subject].background' },
  // Bronze survives ONLY as its canonical SUBJECTS.History.subjectBrowserAccent
  // definition (in src/constants, outside this guard) and the intentional
  // Subjects-browser CSS selector. Components, features and learner-facing data
  // must reference the canonical token or resolve SUBJECTS[subject].accent.
  {
    hex: '#C89B6D',
    token: 'SUBJECTS.History.subjectBrowserAccent / SUBJECTS[subject].accent',
    includeData: true,
  },
]

const componentFiles = globSync('src/{components,features}/**/*.{jsx,js}', {
  cwd: root,
  ignore: ['**/node_modules/**'],
})

const learnerDataFiles = globSync('src/data/**/*.{jsx,js}', {
  cwd: root,
  ignore: ['**/node_modules/**'],
})

describe('Colour token governance — migrated hex values do not regrow', () => {
  for (const { hex, token, includeData = false } of MIGRATED_VALUES) {
    it(`${hex} does not reappear as a raw literal (use ${token})`, () => {
      const guardedFiles = includeData
        ? [...componentFiles, ...learnerDataFiles]
        : componentFiles
      const offenders = guardedFiles.filter((rel) => read(rel).includes(hex))
      expect(
        offenders,
        `${hex} found as a raw literal — replace with ${token}: ${offenders.join(', ')}`,
      ).toEqual([])
    })
  }
})
