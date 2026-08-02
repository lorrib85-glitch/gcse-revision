import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { relative, resolve, dirname, posix } from 'path'

import { loadCatalogue, listRecordFiles, internalOwnership, RECORDS_DIR } from '../../src/component-catalogue/loadCatalogue.js'
import { validateRecord, sourceIdentity, FORBIDDEN_STATUS_TOKENS } from '../../src/component-catalogue/schema.js'
import { renderCatalogue, OUTPUT_PATH } from '../../scripts/generate-component-catalogue.mjs'

// src/component-catalogue/records/ is the single home for every catalogue-level
// component fact. docs/components/COMPONENT_REGISTRY.md is generated from it.
// This guard replaces the old markdown-parsing completeness test and the
// locked-component mirror test: there is nothing left to mirror, because there
// is only one source.
//
// Deliberately NOT asserted here (they would be brittle without protecting
// anything): the total component count, the number of critical records, file or
// folder sizes, learner reachability, or whether a component has a screen type.

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

const COMPONENT_ROOT = 'src/components'
const CATALOGUE_ROOT = 'src/component-catalogue'

// Everything under src/ is production source and must not reach the build-time
// catalogue. The catalogue itself is the only exclusion.
//
// src/dev/** is deliberately NOT excluded. The Component Lab is lazy-imported
// by src/App.jsx behind a query flag, so it ships as a real chunk of the
// production build — learners simply never download it. "Rarely fetched" is not
// "not bundled", and a future Lab integration importing the catalogue would put
// governance prose into the shipped app. When the Lab genuinely moves outside
// the production application, that can be proved and this list revisited.
//
// Listing exclusions rather than inclusions means a new top-level runtime
// folder is covered the day it appears, instead of the day someone remembers
// to add it here.
const NON_PRODUCTION_PREFIXES = [`${CATALOGUE_ROOT}/`]

/**
 * Recursively list source files under `dir`, always skipping stories and tests.
 * `componentsOnly` narrows to the files that count as standalone components:
 * `.jsx`, excluding barrel `index.jsx` files.
 */
function listFiles(dir, { componentsOnly = false } = {}) {
  const out = []
  for (const name of readdirSync(resolve(root, dir))) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) {
      out.push(...listFiles(rel, { componentsOnly }))
      continue
    }
    if (name.endsWith('.stories.jsx')) continue
    if (/\.(test|spec)\.jsx?$/.test(name)) continue
    if (componentsOnly) {
      if (!name.endsWith('.jsx') || name === 'index.jsx') continue
    } else if (!/\.jsx?$/.test(name)) continue
    out.push(rel)
  }
  return out
}

/**
 * Pure coverage check, so a mutation can be run against a modified catalogue
 * without touching disk: which component files have no public record and are
 * not owned as a private internal by one?
 */
export function undocumentedComponents(componentFiles, records) {
  const documented = new Set(records.map(record => record.source))
  const ownedDirectories = new Set()
  const ownedFiles = new Set()
  for (const entry of internalOwnership(records)) {
    if (entry.kind === 'directory') ownedDirectories.add(entry.path)
    else ownedFiles.add(entry.path)
  }
  return componentFiles.filter(file =>
    !documented.has(file)
    && !ownedFiles.has(file)
    && !ownedDirectories.has(dirname(file)),
  )
}

// Load defensively: a duplicate id or an invalid record makes loadCatalogue
// throw, and a throw at collection time reports as "1 test file failed" with no
// named test. Catching it turns the same regression into a readable failure
// that names the record and the problem.
let records = []
let loadError = null
try {
  records = await loadCatalogue()
} catch (error) {
  loadError = error
}

const componentFiles = listFiles(COMPONENT_ROOT, { componentsOnly: true })
const owned = internalOwnership(records)

describe('every record is structurally valid', () => {
  it('loads with no structural error', () => {
    expect(loadError?.message ?? null).toBeNull()
  })

  it('loaded a plausible catalogue', () => {
    // Enough to prove the loader did not silently return nothing; not a count
    // assertion the catalogue has to be kept in step with.
    expect(records.length).toBeGreaterThan(50)
    expect(listRecordFiles().length).toBe(records.length)
  })

  records.forEach(record => {
    it(`${record.id} passes schema validation`, () => {
      expect(validateRecord(record)).toEqual([])
    })
  })

  it('loads deterministically, in ascending order', () => {
    const orders = records.map(record => record.order)
    expect([...orders].sort((a, b) => a - b)).toEqual(orders)
  })

  it('has unique ids, names, source identities and orders', () => {
    for (const key of [r => r.id, r => r.name, sourceIdentity, r => r.order]) {
      const values = records.map(key)
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('names a source file that exists', () => {
    const missing = records
      .filter(record => !existsSync(resolve(root, record.source)))
      .map(record => `${record.id} → ${record.source}`)
    expect(missing).toEqual([])
  })

  it('uses repo-relative posix source paths', () => {
    for (const record of records) {
      expect(record.source).not.toContain('\\')
      expect(relative(root, resolve(root, record.source)).split('\\').join('/')).toBe(record.source)
    }
  })

  it('names contract docs and stories that exist', () => {
    const missing = []
    for (const record of records) {
      for (const path of [record.documentation.contractDoc, record.documentation.story]) {
        if (path && !existsSync(resolve(root, path))) missing.push(`${record.id} → ${path}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('exports exactly one record per file, named after its id', () => {
    const filenames = listRecordFiles()
    for (const record of records) {
      expect(filenames).toContain(`${record.id}.js`)
    }
    for (const file of filenames) {
      const source = readFileSync(resolve(RECORDS_DIR, file), 'utf8')
      expect(source, file).toContain('export default')
      expect(source.match(/^export /gm) ?? [], file).toHaveLength(1)
    }
  })
})

describe('the catalogue is complete', () => {
  it('has a record for every eligible standalone component', () => {
    expect(undocumentedComponents(componentFiles, records)).toEqual([])
  })

  it('excludes stories, tests and index files', () => {
    for (const file of componentFiles) {
      expect(file.endsWith('.stories.jsx')).toBe(false)
      expect(/\.(test|spec)\.jsx$/.test(file)).toBe(false)
      expect(file.endsWith('/index.jsx')).toBe(false)
    }
  })

  it('makes every out-of-root component justify itself in its own record', () => {
    // No allowlist here on purpose: the record declares why it is governed, so
    // adding a governed feature-level component is one edit, not two. Where it
    // lives is not repeated — `source` already says that.
    const outOfRoot = records.filter(record => !record.source.startsWith(`${COMPONENT_ROOT}/`))
    expect(outOfRoot.length).toBeGreaterThan(0)
    for (const record of outOfRoot) {
      expect(record.outOfRootReason?.trim().length ?? 0, record.id).toBeGreaterThan(40)
    }
  })

  it('leaves outOfRootReason null for everything in the normal home', () => {
    const noisy = records
      .filter(record => record.source.startsWith(`${COMPONENT_ROOT}/`) && record.outOfRootReason !== null)
      .map(record => record.id)
    expect(noisy).toEqual([])
  })

  it('rejects an out-of-root record that gives no reason', () => {
    const record = records.find(r => r.outOfRootReason !== null)
    expect(record).toBeDefined()
    expect(validateRecord({ ...record, outOfRootReason: null }))
      .toContain('outOfRootReason must say why a component outside src/components/ is governed (40+ chars)')
  })

  it('rejects an in-tree record that claims an out-of-root reason', () => {
    const record = records.find(r => r.source.startsWith(`${COMPONENT_ROOT}/`))
    expect(validateRecord({ ...record, outOfRootReason: 'A reason long enough to pass the length check but not legitimate here.' }))
      .toContain('outOfRootReason must be null for a component under src/components/')
  })

  it('fails when a public record is deleted', () => {
    const victim = records.find(record => record.id === 'teach-screen-shell')
    expect(victim).toBeDefined()
    const mutated = records.filter(record => record !== victim)
    expect(undocumentedComponents(componentFiles, mutated)).toEqual([victim.source])
  })

  it('fails when a standalone component is added with no record', () => {
    const invented = 'src/components/learning/NotCataloguedYet.jsx'
    expect(undocumentedComponents([...componentFiles, invented], records)).toEqual([invented])
  })
})

describe('private internals are owned, not excluded by a side list', () => {
  owned.forEach(entry => {
    it(`${entry.path} exists and its owner ${entry.owner.id} is a public record`, () => {
      expect(existsSync(resolve(root, entry.path))).toBe(true)
      if (entry.kind === 'directory') {
        expect(statSync(resolve(root, entry.path)).isDirectory()).toBe(true)
      } else {
        expect(statSync(resolve(root, entry.path)).isFile()).toBe(true)
      }
      expect(records).toContain(entry.owner)
      expect(entry.reason.trim().length).toBeGreaterThan(40)
    })
  })

  it('gives every internal path exactly one owner', () => {
    const byPath = new Map()
    const conflicts = []
    for (const entry of owned) {
      if (byPath.has(entry.path)) {
        conflicts.push(`${entry.path}: ${byPath.get(entry.path)} and ${entry.owner.id}`)
      }
      byPath.set(entry.path, entry.owner.id)
    }
    expect(conflicts).toEqual([])
  })

  it('never hides a public record behind a directory ownership rule', () => {
    const ownedDirectories = owned.filter(entry => entry.kind === 'directory').map(entry => entry.path)
    const hidden = records
      .filter(record => ownedDirectories.includes(dirname(record.source)))
      .map(record => record.id)
    expect(hidden).toEqual([])
  })

  it('does not let a directory rule cover an unrelated invented component', () => {
    const invented = 'src/components/learning/SomethingStandalone.jsx'
    expect(undocumentedComponents([invented], records)).toEqual([invented])
  })
})

describe('contracts are honest', () => {
  it('uses no locked status, under any spelling', () => {
    const offenders = []
    for (const file of listRecordFiles()) {
      const source = readFileSync(resolve(RECORDS_DIR, file), 'utf8')
      for (const token of FORBIDDEN_STATUS_TOKENS) {
        const pattern = new RegExp(`(criticality|lifecycle|status)\\s*:\\s*['"]?${token}`, 'i')
        if (pattern.test(source)) offenders.push(`${file}: ${token}`)
      }
      if (/\blocked\s*:\s*(true|false)\b/.test(source)) offenders.push(`${file}: locked boolean`)
    }
    expect(offenders).toEqual([])
  })

  records
    .filter(record => record.contract.criticality === 'critical')
    .forEach(record => {
      it(`${record.id} states why change is costly and what needs sign-off`, () => {
        const { contract } = record
        expect(contract.rationale?.trim().length ?? 0).toBeGreaterThan(40)
        expect(contract.invariants.length).toBeGreaterThan(0)
        expect(contract.requiresProductDecision.length).toBeGreaterThan(0)
        for (const invariant of contract.invariants) {
          expect(invariant.evidence.length, invariant.id).toBeGreaterThan(0)
        }
      })
    })

  it('points every test-kind evidence reference at a file that exists', () => {
    const missing = []
    const walk = (record, evidence, label) => {
      for (const item of evidence) {
        if (item.kind === 'review') continue
        if (!existsSync(resolve(root, item.reference))) missing.push(`${record.id} ${label}: ${item.reference}`)
      }
    }
    for (const record of records) {
      for (const invariant of record.contract.invariants) walk(record, invariant.evidence, invariant.id)
      if (record.contract.exclusivity) walk(record, record.contract.exclusivity.evidence, 'exclusivity')
    }
    expect(missing).toEqual([])
  })

  it('rejects a critical contract with no invariants', () => {
    const record = records.find(r => r.contract.criticality === 'critical')
    const mutated = { ...record, contract: { ...record.contract, invariants: [] } }
    expect(validateRecord(mutated)).toContain('contract.criticality "critical" requires at least one invariant')
  })

  it('rejects an invariant whose evidence is missing', () => {
    const record = records.find(r => r.contract.criticality === 'critical')
    const [first, ...rest] = record.contract.invariants
    const mutated = {
      ...record,
      contract: { ...record.contract, invariants: [{ ...first, evidence: [] }, ...rest] },
    }
    expect(validateRecord(mutated)).toContain('contract.invariants[0].evidence needs at least one evidence entry')
  })

  it('rejects an exclusivity object missing its prohibited alternatives', () => {
    const record = records.find(r => r.contract.exclusivity)
    expect(record).toBeDefined()
    const mutated = {
      ...record,
      contract: {
        ...record.contract,
        exclusivity: { ...record.contract.exclusivity, prohibitedAlternatives: [] },
      },
    }
    expect(validateRecord(mutated))
      .toContain('contract.exclusivity.prohibitedAlternatives must name at least one prohibited alternative')
  })

  it('rejects a standard contract that smuggles in an invariant', () => {
    const record = records.find(r => r.contract.criticality === 'standard')
    const critical = records.find(r => r.contract.criticality === 'critical')
    const mutated = {
      ...record,
      contract: { ...record.contract, invariants: critical.contract.invariants },
    }
    expect(validateRecord(mutated))
      .toContain('contract.invariants must be empty when criticality is "standard"')
  })

  it('requires a Decision block on author-selectable components', () => {
    const record = records.find(r => r.kind === 'reusable')
    expect(validateRecord({ ...record, decision: null }))
      .toContain('decision is required for kind "reusable" (use status "pending" if unsettled)')
  })

  it('requires a reason when a Decision block is pending', () => {
    const record = records.find(r => r.decision?.status === 'pending')
    expect(record).toBeDefined()
    expect(validateRecord({ ...record, decision: { ...record.decision, note: null } }))
      .toContain('decision.note must explain why status is "pending" (20+ chars)')
  })
})

describe('the generated registry matches the catalogue', () => {
  const generated = renderCatalogue(records)

  it('is byte-for-byte identical to the committed document', () => {
    expect(read(OUTPUT_PATH)).toBe(generated)
  })

  it('detects a hand-edit to the generated document', () => {
    const tampered = read(OUTPUT_PATH).replace('### BackButton', '### BackButton (edited by hand)')
    expect(tampered).not.toBe(generated)
  })

  it('announces itself as generated', () => {
    expect(generated).toContain('GENERATED FILE — DO NOT EDIT')
  })

  it('carries no timestamp or environment-dependent content', () => {
    // Dates that appear inside migrated prose are content, not generation
    // metadata — so the check is on the generator: it must have no clock, no
    // environment reads and no absolute paths to leak in the first place.
    expect(generated).not.toMatch(/Last updated/i)
    expect(generated).not.toContain(root)

    const generator = read('scripts/generate-component-catalogue.mjs')
    for (const source of ['new Date', 'Date.now', 'toISOString', 'process.env', 'Math.random']) {
      expect(generator, source).not.toContain(source)
    }
  })

  it('renders the same bytes every time', () => {
    expect(renderCatalogue(records)).toBe(generated)
  })
})

describe('authority boundaries hold', () => {
  const productionFiles = listFiles('src')
    .filter(file => !NON_PRODUCTION_PREFIXES.some(prefix => file.startsWith(prefix)))

  it('scans the whole of src/, not a fixed folder list', () => {
    // A new top-level runtime folder must be covered the day it is created.
    // These prove the sweep is real and correctly bounded.
    expect(productionFiles).toContain('src/App.jsx')
    expect(productionFiles).toContain('src/main.jsx')
    expect(productionFiles.some(file => file.startsWith(`${CATALOGUE_ROOT}/`))).toBe(false)

    // The Component Lab ships as a real chunk of the production build, so it is
    // scanned like any other production source.
    expect(productionFiles.some(file => file.startsWith('src/dev/'))).toBe(true)
    expect(read('src/App.jsx')).toContain("import('./dev/componentReview/ComponentReviewLab.jsx')")

    // Every top-level folder under src/ that holds source is swept, derived
    // from the filesystem rather than from a list someone has to remember to
    // extend. src/hooks and src/constants were both outside the original
    // folder list; a derived sweep cannot develop that gap again.
    const swept = new Set(productionFiles.map(file => file.split('/')[1]))
    const unswept = readdirSync(resolve(root, 'src'))
      .filter(name => statSync(resolve(root, 'src', name)).isDirectory())
      .filter(name => !NON_PRODUCTION_PREFIXES.includes(`src/${name}/`))
      .filter(name => listFiles(`src/${name}`).length > 0)
      .filter(name => !swept.has(name))
    expect(unswept).toEqual([])
  })

  it('is never imported by production source', () => {

    // Matches any specifier reaching the catalogue, however it is spelled:
    // `src/component-catalogue/...`, a relative `../../component-catalogue/...`,
    // a bare side-effect import, and dynamic `import()`.
    const reachesCatalogue = /(?:from\s*|import\s*\(?\s*)['"][^'"]*component-catalogue\//
    const importers = productionFiles.filter(file => {
      const source = read(file)
      return reachesCatalogue.test(source) || source.includes(`${CATALOGUE_ROOT}/`)
    })
    expect(importers).toEqual([])
  })

  it('no longer ships a separate locked-component document', () => {
    expect(existsSync(resolve(root, 'docs/components/LOCKED_COMPONENTS.md'))).toBe(false)
  })

  it('leaves no independent LOCKED declaration in component source', () => {
    const governed = [...listFiles(COMPONENT_ROOT), ...new Set(records.map(r => r.source))]
      .filter(file => existsSync(resolve(root, file)))
    const declaring = [...new Set(governed)].filter(file => /LOCKED\s+COMPONENT/.test(read(file)))
    expect(declaring).toEqual([])
  })

  it('names the catalogue, not a second component list, in the live docs', () => {
    for (const doc of ['CLAUDE.md', 'docs/README.md', 'docs/system/00_SYSTEM_INDEX.md', 'docs/system/COMPONENT_AUTHORING_RULES.md']) {
      expect(read(doc), doc).not.toContain('LOCKED_COMPONENTS.md')
    }
    expect(read('CLAUDE.md')).toContain('src/component-catalogue/records/')
    expect(read('docs/system/00_SYSTEM_INDEX.md')).toContain('src/component-catalogue/records/')
  })

  it('runs catalogue:check ahead of the other verify gates', () => {
    const verify = JSON.parse(read('package.json')).scripts.verify
    expect(verify).toContain('pnpm catalogue:check')
    expect(verify.indexOf('pnpm catalogue:check')).toBeLessThan(verify.indexOf('pnpm test:architecture'))
  })
})

