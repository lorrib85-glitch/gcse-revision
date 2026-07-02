import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Root/full-screen background must use GENERAL.backgroundApp (or another
// approved GENERAL token) instead of the raw B9 hex. Foreground text,
// borders, SVG strokes and rgba(8,9,13,...) overlays are a separate,
// deliberately out-of-scope concern (see the B9 migration notes in
// .planning/backlog/brand-typography-backlog.md) and are not matched here.
const HARDCODED_BACKGROUND = /background\s*:\s*['"]#08090[Dd]['"]/

const srcFiles = globSync('src/{components,features}/**/*.{jsx,js}', {
  cwd: root,
  ignore: [
    '**/node_modules/**',
    'src/features/quickfire/**',
    'src/components/layout/ModulePlayer.jsx',
  ],
})

describe('Background token governance — root #08090D background does not regrow', () => {
  it("background: '#08090D' does not reappear (use GENERAL.backgroundApp)", () => {
    const offenders = srcFiles.filter((rel) => HARDCODED_BACKGROUND.test(read(rel)))
    expect(
      offenders,
      `Hardcoded background: '#08090D' found — replace with GENERAL.backgroundApp: ${offenders.join(', ')}`,
    ).toEqual([])
  })
})
