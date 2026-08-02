import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { resolve, relative, dirname, posix } from 'path'

// Every standalone component under src/components/** must be documented in
// docs/components/COMPONENT_REGISTRY.md. Catalogue completeness is deliberately
// NOT based on learner reachability — a component that is Component Lab only,
// still under review, superseded-but-retained, or pure runtime infrastructure
// is still catalogued. "Not routed yet" is a status, not a defect.
//
// The only components exempt are private implementation details of one
// registered component family. Those are listed explicitly below with a reason.
// The exclusion list is not a dumping ground: each entry names the registered
// component that owns it, and that owner must itself be documented.

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const REGISTRY = 'docs/components/COMPONENT_REGISTRY.md'
const COMPONENT_ROOT = 'src/components'

// Family subdirectories: every .jsx inside is a private part of one registered
// component family. `owner` must appear in the registry.
const FAMILY_INTERNALS = {
  'src/components/learning/calculationBreakdown': {
    owner: 'src/components/learning/CalculationBreakdown.jsx',
    reason: 'Visual models, controls, figures and parts used only to render CalculationBreakdown. Not separately selectable.',
  },
  'src/components/learning/faceTheExaminer': {
    owner: 'src/components/learning/FaceTheExaminer.jsx',
    reason: 'Phase components of the FaceTheExaminer flow (intro, main, marking, verdict, done). FaceTheExaminer.jsx is the compatibility export authors use.',
  },
  'src/components/learning/circuit': {
    owner: 'src/components/learning/CircuitDiagram.jsx',
    reason: 'Shared SVG circuit primitives for the Physics circuit family. Rendered only through CircuitDiagram and CircuitSymbolReference.',
  },
  'src/components/layout/chapterPlayer': {
    owner: 'src/components/layout/ChapterPlayer.jsx',
    reason: "ChapterPlayer's own runtime JSX, split out of the player: the universal opener gate layer and the fixed bottom-navigation shell. Authors never place either — the runtime decides — so they are deliberately absent from screenRegistry.js, componentFunctions.js and the Component Lab. Guarded by tests/architecture/chapter-player-private-family.test.js.",
  },
}

// Individual files that are private to one registered component.
const FILE_INTERNALS = {
  'src/components/learning/ColSortBlockCore.jsx': {
    owner: 'src/components/learning/ColSortBlock.jsx',
    reason: 'The implementation of ColSortBlock, split out for file size only. ColSortBlock is the documented entry point and its sole importer.',
  },
  'src/components/learning/TimelineChainIcons.jsx': {
    owner: 'src/components/learning/TimelineChain.jsx',
    reason: 'The icon set for TimelineChain markers. Imported only by TimelineChain; carries no learning behaviour of its own.',
  },
  'src/components/learning/MedievalDiagnosisScene.jsx': {
    owner: 'src/components/learning/CentreImageReveal.jsx',
    reason: 'The Medicine-specific SVG hero for the CentreImageReveal select phase. Mirrors its parent belief-selection state; explicitly not a standalone learning beat or authoring choice.',
  },
}

function listJsxFiles(dir) {
  const out = []
  for (const name of readdirSync(resolve(root, dir))) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) {
      out.push(...listJsxFiles(rel))
      continue
    }
    if (!name.endsWith('.jsx')) continue
    if (name.endsWith('.stories.jsx')) continue
    if (/\.(test|spec)\.jsx$/.test(name)) continue
    if (name === 'index.jsx') continue
    out.push(rel)
  }
  return out
}

// One registry entry: a "### Heading" and the "**File:** `path`" it declares.
export function parseRegistryEntries(markdown) {
  const entries = []
  const sections = markdown.split(/^### /m).slice(1)
  for (const section of sections) {
    const heading = section.split('\n', 1)[0].trim()
    const fileMatch = section.match(/\*\*File:\*\* `([^`]+)`/)
    if (!fileMatch) continue
    entries.push({
      heading,
      file: fileMatch[1],
      locked: /—\s*\*\*LOCKED/.test(heading),
    })
  }
  return entries
}

function excludedPaths(componentFiles) {
  const excluded = new Map()
  for (const file of componentFiles) {
    const dir = dirname(file)
    if (FAMILY_INTERNALS[dir]) excluded.set(file, FAMILY_INTERNALS[dir])
    else if (FILE_INTERNALS[file]) excluded.set(file, FILE_INTERNALS[file])
  }
  return excluded
}

// Pure coverage check, so the mutation test can re-run it against a modified
// registry without touching disk.
export function undocumentedComponents(componentFiles, entries) {
  const documented = new Set(entries.map(entry => entry.file))
  const excluded = excludedPaths(componentFiles)
  return componentFiles.filter(file => !documented.has(file) && !excluded.has(file))
}

const componentFiles = listJsxFiles(COMPONENT_ROOT)
const registryMarkdown = read(REGISTRY)
const entries = parseRegistryEntries(registryMarkdown)

describe('COMPONENT_REGISTRY.md catalogues every standalone component', () => {
  it('parsed a plausible registry (format unchanged)', () => {
    expect(componentFiles.length).toBeGreaterThan(50)
    expect(entries.length).toBeGreaterThan(50)
  })

  it('has no undocumented eligible component', () => {
    expect(undocumentedComponents(componentFiles, entries)).toEqual([])
  })

  it('documents no path that does not exist', () => {
    const missing = entries
      .filter(entry => entry.file.startsWith('src/'))
      .filter(entry => !existsSync(resolve(root, entry.file)))
      .map(entry => `${entry.heading} → ${entry.file}`)
    expect(missing).toEqual([])
  })

  it('never gives one path conflicting lock statuses across entries', () => {
    const byPath = new Map()
    for (const entry of entries) {
      if (!byPath.has(entry.file)) byPath.set(entry.file, [])
      byPath.get(entry.file).push(entry)
    }
    const conflicts = []
    for (const [file, group] of byPath) {
      const statuses = new Set(group.map(entry => entry.locked))
      if (statuses.size > 1) {
        conflicts.push(`${file}: ${group.map(e => `${e.heading} (locked=${e.locked})`).join(' vs ')}`)
      }
    }
    expect(conflicts).toEqual([])
  })
})

describe('the exclusion list stays small and justified', () => {
  const allExclusions = [
    ...Object.entries(FAMILY_INTERNALS).map(([path, meta]) => ({ path, ...meta, kind: 'directory' })),
    ...Object.entries(FILE_INTERNALS).map(([path, meta]) => ({ path, ...meta, kind: 'file' })),
  ]

  it('is small enough to read in one sitting', () => {
    // A growing list means standalone components are being hidden. Raise this
    // only alongside a real new component family.
    expect(allExclusions.length).toBeLessThanOrEqual(8)
  })

  allExclusions.forEach(({ path, kind, owner, reason }) => {
    it(`${path} still exists, names an owner, and gives a reason`, () => {
      expect(existsSync(resolve(root, path))).toBe(true)
      if (kind === 'directory') {
        expect(statSync(resolve(root, path)).isDirectory()).toBe(true)
      }
      expect(existsSync(resolve(root, owner))).toBe(true)
      expect(reason.trim().length).toBeGreaterThan(40)
    })

    it(`${path}'s owner ${owner} is itself documented in the registry`, () => {
      expect(entries.map(entry => entry.file)).toContain(owner)
    })
  })

  it('excludes only paths that are actually under src/components', () => {
    const strays = allExclusions
      .map(({ path }) => path)
      .filter(path => !path.startsWith(`${COMPONENT_ROOT}/`))
    expect(strays).toEqual([])
  })
})

// Mutation evidence: the guard must actually fail when the registry regresses.
describe('the completeness guard fails when an entry is removed', () => {
  it('detects a deleted registry entry', () => {
    const victim = 'src/components/core/TeachScreenShell.jsx'
    expect(entries.map(entry => entry.file)).toContain(victim)

    const mutated = entries.filter(entry => entry.file !== victim)
    expect(undocumentedComponents(componentFiles, mutated)).toEqual([victim])
  })

  it('detects a component added with no registry entry', () => {
    const invented = 'src/components/learning/NotDocumentedYet.jsx'
    const mutatedFiles = [...componentFiles, invented]
    expect(undocumentedComponents(mutatedFiles, entries)).toEqual([invented])
  })

  it('does not let a family-internal exclusion cover an arbitrary new component', () => {
    const invented = 'src/components/learning/SomethingStandalone.jsx'
    expect(excludedPaths([invented]).has(invented)).toBe(false)
  })
})

// Keep the file list itself honest: `relative` is only used to prove paths are
// repo-relative POSIX paths, which is what every doc and test here assumes.
describe('component paths are repo-relative posix paths', () => {
  it('lists files under src/components with forward slashes', () => {
    for (const file of componentFiles) {
      expect(file.startsWith('src/components/')).toBe(true)
      expect(file).not.toContain('\\')
      expect(relative(root, resolve(root, file)).split('\\').join('/')).toBe(file)
    }
  })
})
