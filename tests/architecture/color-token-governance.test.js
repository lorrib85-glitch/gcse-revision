import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Values migrated to named tokens (see DEVELOPMENT_WORKFLOW.md file-hygiene
// pass). Each must never reappear as a raw hex literal in src/components/**
// or src/features/** — always reference the token instead. This list only
// grows when a new value is deliberately migrated; it is not a grandfather
// list for unmigrated debt (see .planning/codebase/CONCERNS.md for what's
// still raw and why it wasn't touched in this pass).
const MIGRATED_VALUES = [
  { hex: '#0F0B07', token: 'SUBJECTS.History.background' },
  { hex: '#2A9D8F', token: 'GENERAL.teal' },
  { hex: '#E76F51', token: 'GENERAL.coral' },
  { hex: '#0D0D0D', token: 'GENERAL.neutral[900]' },
]

const srcFiles = globSync('src/{components,features}/**/*.{jsx,js}', {
  cwd: root,
  ignore: ['**/node_modules/**'],
})

describe('Colour token governance — migrated hex values do not regrow', () => {
  for (const { hex, token } of MIGRATED_VALUES) {
    it(`${hex} does not reappear as a raw literal (use ${token})`, () => {
      const offenders = srcFiles.filter((rel) => read(rel).includes(hex))
      expect(
        offenders,
        `${hex} found as a raw literal — replace with ${token}: ${offenders.join(', ')}`,
      ).toEqual([])
    })
  }
})
