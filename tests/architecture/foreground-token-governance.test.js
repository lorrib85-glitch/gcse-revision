import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Dark text/icon colour on an accent-filled surface must use
// GENERAL.textOnAccent instead of the raw B9 hex. `stroke="#08090D"` (SVG),
// `border: '...#08090D'`, and `textColor="#08090D"` (a component prop, not
// a style property) are separate, deliberately out-of-scope roles and are
// not matched here — only the `color:` style property is a foreground-text
// regression of this token.
const HARDCODED_FOREGROUND = /(?<![-\w])color\s*:\s*['"]#08090[Dd]['"]/

const srcFiles = globSync('src/{components,features,app}/**/*.jsx', {
  cwd: root,
  ignore: [
    '**/node_modules/**',
    'src/features/quickfire/**',
    'src/components/layout/ModulePlayer.jsx',
  ],
})

describe('Foreground token governance — raw #08090D text colour does not regrow', () => {
  it("color: '#08090D' does not reappear (use GENERAL.textOnAccent)", () => {
    const offenders = srcFiles.filter((rel) => HARDCODED_FOREGROUND.test(read(rel)))
    expect(
      offenders,
      `Hardcoded color: '#08090D' found — replace with GENERAL.textOnAccent: ${offenders.join(', ')}`,
    ).toEqual([])
  })
})
