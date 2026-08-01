import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { resolve, posix } from 'path'
import { parseRegistryEntries } from './component-registry-completeness.test.js'

// docs/components/LOCKED_COMPONENTS.md is the single canonical definition of
// which components need explicit authorisation before their internals change.
// Three things mirror it, and all three are checked in BOTH directions here —
// a one-way check lets a lock quietly appear or disappear on the other side:
//
//   canonical doc  ⇄  source `LOCKED COMPONENT` marker
//   canonical doc  ⇄  COMPONENT_REGISTRY.md "— **LOCKED**" heading
//
// ConceptReveal is the one documented exception: it is governed by its own
// contract doc and architecture test instead of appearing in the canonical
// list. That mechanism is asserted below so it cannot silently disappear.

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const CANONICAL = 'docs/components/LOCKED_COMPONENTS.md'
const REGISTRY = 'docs/components/COMPONENT_REGISTRY.md'
const COMPONENT_SCOPE = 'src/components/'
const SOURCE_MARKER = 'LOCKED COMPONENT'

// Source files carrying a marker but governed by a different, documented
// mechanism. Each needs a reason and must still exist.
const ALTERNATIVE_GOVERNANCE = {
  'src/components/learning/ConceptReveal.jsx': {
    mechanism: 'docs/system/CONCEPT_REVEAL_CONTRACT.md + tests/architecture/concept-reveal-contract.test.js',
    reason: 'Governed by its own contract doc and dedicated architecture test rather than the general locked list.',
  },
}

// Only the "## Locked Component List" section defines lock status — parsing
// stops at the next top-level heading, so any later section (history, protocol)
// can never re-lock a component by mentioning it.
export function parseCanonicalLocked(markdown) {
  // Anchored to the start of a line so a prose mention of the section name
  // earlier in the document cannot be mistaken for the section itself.
  const start = markdown.search(/^## Locked Component List$/m)
  if (start === -1) return []
  const rest = markdown.slice(start + 1)
  const end = rest.search(/^## /m)
  const section = end === -1 ? rest : rest.slice(0, end)
  return parseRegistryEntries(section).map(entry => ({ name: entry.heading, file: entry.file }))
}

function listSourceFiles(dir) {
  const out = []
  for (const name of readdirSync(resolve(root, dir))) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) {
      out.push(...listSourceFiles(rel))
      continue
    }
    if (!/\.jsx?$/.test(name)) continue
    if (name.endsWith('.stories.jsx')) continue
    if (/\.(test|spec)\.jsx?$/.test(name)) continue
    out.push(rel)
  }
  return out
}

const canonical = parseCanonicalLocked(read(CANONICAL))
const canonicalFiles = new Set(canonical.map(entry => entry.file))
const markedSources = listSourceFiles('src').filter(file => read(file).includes(SOURCE_MARKER))
const registryLocked = parseRegistryEntries(read(REGISTRY)).filter(entry => entry.locked)

describe('the canonical locked list parses and is non-trivial', () => {
  it('found locked entries in the Locked Component List section', () => {
    expect(canonical.length).toBeGreaterThan(0)
  })

  it('stops parsing at the next top-level section', () => {
    expect(canonicalFiles.has('src/components/core/BackButton.jsx')).toBe(true)
    expect(canonical.some(entry => /^## /.test(entry.name))).toBe(false)
  })
})

describe('canonical doc → source marker', () => {
  canonical.forEach(({ name, file }) => {
    it(`${name} exists and self-declares "${SOURCE_MARKER}"`, () => {
      expect(existsSync(resolve(root, file))).toBe(true)
      expect(read(file)).toContain(SOURCE_MARKER)
    })
  })
})

describe('source marker → canonical doc', () => {
  markedSources.forEach(file => {
    it(`${file} is documented as locked (or has documented alternative governance)`, () => {
      const alternative = ALTERNATIVE_GOVERNANCE[file]
      if (alternative) {
        expect(alternative.reason.trim().length).toBeGreaterThan(20)
        for (const path of alternative.mechanism.split(' + ')) {
          expect(existsSync(resolve(root, path))).toBe(true)
        }
        return
      }
      expect([...canonicalFiles]).toContain(file)
    })
  })

  it('every alternative-governance exception still has a marked source file', () => {
    for (const file of Object.keys(ALTERNATIVE_GOVERNANCE)) {
      expect(existsSync(resolve(root, file))).toBe(true)
    }
  })
})

describe('component registry ⇄ canonical doc', () => {
  registryLocked.forEach(({ heading, file }) => {
    it(`registry entry "${heading}" is in the canonical locked list`, () => {
      expect([...canonicalFiles]).toContain(file)
    })
  })

  canonical
    .filter(entry => entry.file.startsWith(COMPONENT_SCOPE))
    .forEach(({ name, file }) => {
      it(`canonical entry ${name} is marked LOCKED in the component registry`, () => {
        expect(registryLocked.map(entry => entry.file)).toContain(file)
      })
    })

  it('locked components outside src/components need no registry entry', () => {
    // The Component Registry's scope is src/components/**. A feature-level
    // locked component (e.g. HomeAtmosphere in src/features/home/Home.jsx) is
    // canonical + source-marked only, and must not be forced into the registry.
    const outside = canonical.filter(entry => !entry.file.startsWith(COMPONENT_SCOPE))
    for (const entry of outside) {
      expect(existsSync(resolve(root, entry.file))).toBe(true)
      expect(read(entry.file)).toContain(SOURCE_MARKER)
    }
    expect(outside.length).toBeGreaterThan(0)
  })
})

describe('ConceptReveal contract governance stays wired up', () => {
  it('component, contract doc, and contract test all still exist', () => {
    expect(existsSync(resolve(root, 'src/components/learning/ConceptReveal.jsx'))).toBe(true)
    expect(existsSync(resolve(root, 'docs/system/CONCEPT_REVEAL_CONTRACT.md'))).toBe(true)
    expect(existsSync(resolve(root, 'tests/architecture/concept-reveal-contract.test.js'))).toBe(true)
  })

  it('is not also listed in the canonical locked list', () => {
    expect(canonicalFiles.has('src/components/learning/ConceptReveal.jsx')).toBe(false)
  })
})

// Mutation evidence: removing either side of the relationship must be caught.
describe('the lock guard fails when one side is removed', () => {
  const victim = 'src/components/core/SequenceProgress.jsx'

  it('the fixture component is genuinely locked on all three sides', () => {
    expect(canonicalFiles.has(victim)).toBe(true)
    expect(read(victim)).toContain(SOURCE_MARKER)
    expect(registryLocked.map(entry => entry.file)).toContain(victim)
  })

  it('detects a canonical entry removed while the source marker remains', () => {
    const mutated = canonical.filter(entry => entry.file !== victim)
    const mutatedFiles = new Set(mutated.map(entry => entry.file))
    // source marker → canonical doc now has an orphan
    const orphans = markedSources.filter(
      file => !mutatedFiles.has(file) && !ALTERNATIVE_GOVERNANCE[file],
    )
    expect(orphans).toContain(victim)
    // registry → canonical doc now has an orphan too
    expect(registryLocked.map(e => e.file).filter(file => !mutatedFiles.has(file))).toContain(victim)
  })

  it('detects a source marker removed while the canonical entry remains', () => {
    const mutatedMarked = markedSources.filter(file => file !== victim)
    const unmarked = canonical.filter(entry => !mutatedMarked.includes(entry.file))
    expect(unmarked.map(entry => entry.file)).toContain(victim)
  })

  it('detects a registry LOCKED heading removed while the canonical entry remains', () => {
    const mutatedRegistry = registryLocked.filter(entry => entry.file !== victim)
    const missing = canonical
      .filter(entry => entry.file.startsWith(COMPONENT_SCOPE))
      .filter(entry => !mutatedRegistry.map(e => e.file).includes(entry.file))
    expect(missing.map(entry => entry.file)).toContain(victim)
  })

  it('detects a registry LOCKED heading added with no canonical entry', () => {
    const invented = { heading: 'Invented — **LOCKED**', file: 'src/components/core/CheckAnswerCTA.jsx', locked: true }
    expect(canonicalFiles.has(invented.file)).toBe(false)
    const mutatedRegistry = [...registryLocked, invented]
    const orphans = mutatedRegistry.filter(entry => !canonicalFiles.has(entry.file))
    expect(orphans.map(entry => entry.file)).toEqual([invented.file])
  })
})
