import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

// Every component docs/components/LOCKED_COMPONENTS.md declares locked must
// still exist and still self-declare its locked status in code — otherwise
// the registry and the source have silently drifted apart, and nothing else
// would catch a locked component quietly losing its "do not redesign" marker
// (or being deleted/renamed without the doc being updated to match).
describe('LOCKED_COMPONENTS.md registry stays in sync with source', () => {
  const registry = read('docs/components/LOCKED_COMPONENTS.md')
  const filePattern = /\*\*File:\*\* `([^`]+)`/g
  const files = [...registry.matchAll(filePattern)].map(m => m[1])

  it('found at least one registered locked component (registry format unchanged)', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  files.forEach(file => {
    it(`${file} exists and still self-declares LOCKED COMPONENT`, () => {
      expect(existsSync(resolve(root, file))).toBe(true)
      const src = read(file)
      expect(src).toMatch(/LOCKED COMPONENT/)
    })
  })
})

// ConceptReveal is governed outside the LOCKED_COMPONENTS.md registry (its own
// contract doc + dedicated architecture test) — assert that governance
// mechanism itself hasn't quietly disappeared.
describe('ConceptReveal contract governance stays wired up', () => {
  it('component, contract doc, and contract test all still exist', () => {
    expect(existsSync(resolve(root, 'src/components/learning/ConceptReveal.jsx'))).toBe(true)
    expect(existsSync(resolve(root, 'docs/system/CONCEPT_REVEAL_CONTRACT.md'))).toBe(true)
    expect(existsSync(resolve(root, 'tests/architecture/concept-reveal-contract.test.js'))).toBe(true)
  })
})
