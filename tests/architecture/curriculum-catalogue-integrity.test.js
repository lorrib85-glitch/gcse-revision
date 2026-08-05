import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, posix } from 'path'
import { fileURLToPath } from 'url'

import {
  loadCatalogue,
  checkIntegrity,
  LAYOUT,
  RECORDS_DIR,
  listAllRecordFiles,
} from '../../src/curriculum-catalogue/index.js'
import {
  SUBJECT_IDS,
  REJECTED_FIELDS,
  referenceIsLive,
  validateBoard,
  validateSubject,
  validateSpecification,
  validateStudyPathway,
  validateModule,
  validateChapter,
  checkSerialisable,
  weightingScopes,
  resolveWeighting,
} from '../../src/curriculum-catalogue/schema.js'
import { loadCompatibility } from '../../src/curriculum-catalogue/compatibility/index.js'
import {
  renderCatalogue,
  renderCurriculumMap,
  OUTPUT_PATH,
  MAP_OUTPUT_PATH,
  PLACEHOLDER_MIGRATION,
} from '../../scripts/generate-curriculum-catalogue.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

/**
 * The pre-cutover loader targets, chapter id → project-relative content path.
 *
 * Read from the frozen contract, not from `src/content/chapterContentRegistry.js`.
 * Since Stage 4 that file re-exports the generated projection, which is itself
 * built from these records — parsing it would compare the catalogue with
 * itself. `tests/fixtures/curriculum-runtime-v1.json` is the independent
 * capture of what the registry held before the cutover.
 */
const FROZEN_RUNTIME = JSON.parse(read('tests/fixtures/curriculum-runtime-v1.json'))
const frozenLoaderPaths = () =>
  Object.fromEntries(FROZEN_RUNTIME.loaders.map(loader => [loader.id, loader.contentPath]))

const CURRICULUM_ROOT = 'src/curriculum-catalogue'
const COMPONENT_ROOT = 'src/component-catalogue'

// Everything under src/ is production source and must not reach a build-time
// catalogue. The two catalogues are the only exclusions, and they exclude each
// other rather than being globally waived — that is what lets the sweep also
// prove the two governance domains stay apart.
//
// Listing exclusions rather than inclusions means a new top-level runtime
// folder is covered the day it appears, not the day someone remembers to add it.
const NON_PRODUCTION_PREFIXES = [`${CURRICULUM_ROOT}/`, `${COMPONENT_ROOT}/`]

function listFiles(dir) {
  const out = []
  const absolute = resolve(root, dir)
  if (!existsSync(absolute)) return out
  for (const name of readdirSync(absolute)) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) {
      out.push(...listFiles(rel))
      continue
    }
    if (name.endsWith('.stories.jsx')) continue
    if (/\.(test|spec)\.jsx?$/.test(name)) continue
    if (!/\.jsx?$/.test(name)) continue
    out.push(rel)
  }
  return out
}

/** Source with line and block comments removed, so a guard fires on code. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const catalogueFiles = listFiles(CURRICULUM_ROOT)

// ─── The catalogue loads and is internally consistent ───────────────────────

describe('curriculum catalogue loads', () => {
  it('loads and passes its own integrity checks', async () => {
    const catalogue = await loadCatalogue()
    expect(checkIntegrity(catalogue)).toEqual([])
  })

  it('exposes every declared collection, even while empty', async () => {
    const catalogue = await loadCatalogue()
    for (const entry of LAYOUT) {
      expect(Array.isArray(catalogue[entry.collection]), `${entry.collection} missing`).toBe(true)
    }
  })

  it('declares where each record type lives, and derives which records exist', () => {
    // The layout is the only declared thing. If this ever grew a list of record
    // ids it would be the "one fact, two homes" pattern the catalogue exists to
    // remove — so the assertion is that the record set comes off disk.
    const declared = LAYOUT.map(entry => entry.path)
    expect(declared).toEqual([
      'boards.js', 'subjects.js', 'specifications', 'pathways', 'modules', 'chapters',
    ])
    const loaderSource = read(`${CURRICULUM_ROOT}/loadCatalogue.js`)
    expect(loaderSource).toMatch(/readdirSync/)
    for (const file of listAllRecordFiles()) {
      expect(existsSync(resolve(RECORDS_DIR, file.replace(/^records\//, '')))).toBe(true)
    }
  })
})

// ─── Purity: records are plain, isolated, serialisable data ─────────────────

describe('curriculum catalogue purity', () => {
  it('finds the catalogue source files', () => {
    expect(catalogueFiles.length).toBeGreaterThanOrEqual(3)
    expect(catalogueFiles).toContain(`${CURRICULUM_ROOT}/schema.js`)
    expect(catalogueFiles).toContain(`${CURRICULUM_ROOT}/index.js`)
  })

  it('never imports React or JSX', () => {
    for (const file of catalogueFiles) {
      const source = read(file)
      expect(source, `${file} imports react`).not.toMatch(/from\s*['"]react/)
      expect(source, `${file} imports jsx`).not.toMatch(/from\s*['"][^'"]*\.jsx['"]/)
    }
  })

  it('never touches a browser API or storage', () => {
    // Scanned with comments stripped. A comment ships no code, and prose about
    // a "subtly wrong document." is not a `document.` access — matching raw
    // text would make the guard fire on its own explanation.
    for (const file of catalogueFiles) {
      const code = stripComments(read(file))
      for (const forbidden of ['localStorage', 'sessionStorage', 'document.', 'window.', 'navigator.', 'indexedDB']) {
        expect(code, `${file} touches ${forbidden}`).not.toContain(forbidden)
      }
    }
  })

  it('the browser-API guard actually fires', () => {
    // Proves the strip does not defang the check.
    expect(stripComments('// window.alert\nconst x = 1')).not.toContain('window.')
    expect(stripComments('const y = window.alert')).toContain('window.')
    expect(stripComments('/* localStorage */ const z = localStorage')).toContain('localStorage')
  })

  it('never imports app or runtime code', () => {
    // Anchored to an actual import/export statement. A bare `from '…'` match
    // also fires on authored prose — `"…what every living thing is built
    // from", icon: "…"` reads as a specifier to a naive regex — and a guard
    // that trips over chapter copy is a guard nobody trusts.
    const IMPORT_SPECIFIER = /^\s*(?:import|export)\b[^;\n]*?\bfrom\s*['"]([^'"]+)['"]/gm
    // Record files are the strict case: nothing outside this directory at all.
    for (const file of listAllRecordFiles()) {
      const source = read(`${CURRICULUM_ROOT}/${file}`)
      const specifiers = [...source.matchAll(IMPORT_SPECIFIER)].map(match => match[1])
      for (const specifier of specifiers) {
        expect(specifier.startsWith('./') || specifier.startsWith('../'), `${file} imports "${specifier}"`).toBe(true)
        expect(specifier, `${file} escapes the catalogue via "${specifier}"`).not.toMatch(/\.\.\/\.\.\//)
      }
    }
    // The loader and schema may use node built-ins, but never app layers.
    for (const file of catalogueFiles) {
      const source = read(file)
      for (const layer of ['/app/', '/features/', '/components/', '/data/', '/lib/', '/constants/', '/content/']) {
        expect(source, `${file} imports ${layer}`).not.toMatch(
          new RegExp(`from\\s*['"][^'"]*${layer.replace(/\//g, '\\/')}`),
        )
      }
    }
  })

  it('every loaded record is plain serialisable data', async () => {
    const catalogue = await loadCatalogue()
    for (const [collection, records] of Object.entries(catalogue)) {
      for (const record of records) {
        const problems = []
        checkSerialisable(problems, `${collection}.${record.id}`, record)
        expect(problems).toEqual([])
        // Survives a JSON round-trip byte-identically, which is what "plain
        // serialisable" has to mean for a record that will be generated into a
        // projection.
        expect(JSON.parse(JSON.stringify(record))).toEqual(record)
      }
    }
  })
})

// ─── The two governance domains stay apart ─────────────────────────────────

describe('curriculum and component catalogues never reference each other', () => {
  const reachesComponentCatalogue = /(?:from\s*|import\s*\(?\s*)['"][^'"]*component-catalogue\//
  const reachesCurriculumCatalogue = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\//

  it('the curriculum catalogue does not import the component catalogue', () => {
    const importers = catalogueFiles.filter(file => reachesComponentCatalogue.test(read(file)))
    expect(importers).toEqual([])
  })

  it('the component catalogue does not import the curriculum catalogue', () => {
    const importers = listFiles(COMPONENT_ROOT).filter(file => reachesCurriculumCatalogue.test(read(file)))
    expect(importers).toEqual([])
  })

  it('no record names a component, a screen type or an authoring type', async () => {
    const catalogue = await loadCatalogue()
    const forbidden = ['component', 'componentId', 'componentName', 'screenType', 'blockType', 'authoringType']
    const walk = (value, path) => {
      if (Array.isArray(value)) { value.forEach((item, i) => walk(item, `${path}[${i}]`)); return }
      if (typeof value !== 'object' || value === null) return
      for (const key of Object.keys(value)) {
        expect(forbidden, `${path}.${key} names the component domain`).not.toContain(key)
        walk(value[key], `${path}.${key}`)
      }
    }
    for (const [collection, records] of Object.entries(catalogue)) {
      for (const record of records) walk(record, `${collection}.${record.id}`)
    }
  })
})

// ─── Runtime isolation, derived from the filesystem ────────────────────────

describe('curriculum catalogue is never reachable from production source', () => {
  const productionFiles = listFiles('src')
    .filter(file => !NON_PRODUCTION_PREFIXES.some(prefix => file.startsWith(prefix)))

  it('scans the whole of src/, not a fixed folder list', () => {
    expect(productionFiles).toContain('src/App.jsx')
    expect(productionFiles).toContain('src/main.jsx')
    expect(productionFiles.some(file => file.startsWith(`${CURRICULUM_ROOT}/`))).toBe(false)

    // Every top-level folder under src/ that holds source is swept, derived
    // from the filesystem rather than from a list someone has to remember to
    // extend. A new runtime folder is covered the day it is created.
    const swept = new Set(productionFiles.map(file => file.split('/')[1]))
    const unswept = readdirSync(resolve(root, 'src'))
      .filter(name => statSync(resolve(root, 'src', name)).isDirectory())
      .filter(name => !NON_PRODUCTION_PREFIXES.includes(`src/${name}/`))
      .filter(name => listFiles(`src/${name}`).length > 0)
      .filter(name => !swept.has(name))
    expect(unswept).toEqual([])
  })

  it('is never imported by production source', () => {
    // Matches any specifier reaching the catalogue however it is spelled:
    // static import, re-export, bare side-effect import, dynamic import().
    // Scoped to specifiers rather than any mention of the name, because a
    // runtime file may legitimately explain in a comment where its data came
    // from. A comment ships no code; an import ships the whole governance tree.
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\//
    const importers = listFiles('src')
      .filter(file => !file.startsWith(`${CURRICULUM_ROOT}/`))
      .filter(file => reaches.test(read(file)))
    expect(importers).toEqual([])
  })

  it('the generated document is documentation, and the projections carry no catalogue', () => {
    // Stage 3 added src/data/generated/curriculum/. Its three files are runtime
    // SHAPED but reach nothing: the catalogue is governance data carrying
    // provenance notes and specification prose, and none of it may enter a
    // learner's bundle. The guard is therefore on the import, not on the word —
    // a generated banner naming its source ships no code.
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue/
    for (const file of listFiles('src/data/generated')) {
      expect(read(file), `${file} imports the curriculum catalogue`).not.toMatch(reaches)
    }
    for (const file of listFiles('src/data/generated/curriculum')) {
      expect(read(file), `${file} has no generated banner`).toMatch(/GENERATED FILE/)
    }
  })

  it('keeps the three runtime files as re-exports that never reach the catalogue', () => {
    // Stage 4 (D-11): these three re-export the generated projections and keep
    // their export names. They are not themselves generated, and the catalogue
    // still reaches production only through the generated output.
    const reachesCatalogue = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue/
    for (const file of ['src/data/modules.js', 'src/chapters.js', 'src/content/chapterContentRegistry.js']) {
      const source = read(file)
      expect(source, `${file} became a generated file`).not.toMatch(/GENERATED FILE/)
      expect(source, `${file} imports the curriculum catalogue`).not.toMatch(reachesCatalogue)
      expect(source, `${file} is not a re-export`).toMatch(/^export\s*\{[^}]*\}\s*from\s*'[^']*generated\/curriculum\//m)
    }
  })
})

// ─── The generated document is a projection, not an authority ──────────────

describe('generated specification catalogue', () => {
  it('is byte-identical to a fresh render', async () => {
    const catalogue = await loadCatalogue()
    expect(renderCatalogue(catalogue)).toBe(read(OUTPUT_PATH))
  })

  it('is deterministic — the same records always render the same bytes', async () => {
    const catalogue = await loadCatalogue()
    expect(renderCatalogue(catalogue)).toBe(renderCatalogue(catalogue))
  })

  it('carries the do-not-edit banner', () => {
    expect(read(OUTPUT_PATH)).toContain('GENERATED FILE — do not edit')
  })

  const renderOnly = spec => renderCatalogue({
    boards: [], subjects: [], specifications: [spec],
    pathways: [], modules: [], chapters: [],
  })

  it('shows a weighting column per tier when the objectives differ by tier', () => {
    // A document that printed one number for a tiered qualification would be
    // wrong for one of the two tiers, silently.
    const rendered = renderOnly(tieredSpecification())
    expect(rendered).toContain('| AO | Description | Foundation | Higher |')
    expect(rendered).toContain('| 50% | 40% |')
    expect(rendered).toContain('| 25% | 30% |')
  })

  it('shows a single weighting column when a tiered specification does not differ', () => {
    const rendered = renderOnly(withWeightings(tieredSpecification,
      { overall: 40 }, { overall: 40 }, { overall: 20 }))
    expect(rendered).toContain('| AO | Description | Weighting |')
    expect(rendered).not.toContain('Foundation | Higher')
  })

  it('keeps 0% objectives in the table rather than dropping them', () => {
    const rendered = renderOnly(zeroWeightedSpecification())
    expect(rendered).toContain('| AO | Description | Weighting |')
    for (const id of ['ao7', 'ao8', 'ao9']) {
      expect(rendered).toMatch(new RegExp(`\\| \`${id}\` \\|[^\\n]*\\| 0% \\|`))
    }
  })
})

// ─── Schema invariants, proved by mutation ─────────────────────────────────
//
// Each case builds a record that is valid except for one deliberate fault, and
// asserts the validator names it. A test that only feeds valid records proves
// the validator accepts things, not that it rejects anything.
//
// ⚠ THE FIXTURES BELOW ARE STRUCTURAL, NOT VERIFIED CURRICULUM DATA. They exist
// to exercise the validator and are never loaded as records. Their codes,
// timings and provenance are plausible shapes, not facts checked against a
// board document — do not copy one into `records/` and treat it as authored.
// A real record is verified against the awarding body's own published material
// before it is written.

const validBoard = () => ({
  id: 'aqa',
  name: 'AQA Education',
  shortName: 'AQA',
  provenance: {
    sourceName: 'AQA qualification page',
    sourceUrl: 'https://www.aqa.org.uk/',
    verifiedOn: '2026-08-04',
  },
})

const validSpecification = () => ({
  id: 'aqa-gcse-sociology-8192',
  boardId: 'aqa',
  qualification: 'gcse',
  code: '8192',
  title: 'AQA GCSE Sociology',
  subjectIds: ['sociology'],
  tiers: [],
  papers: [
    {
      id: 'aqa-gcse-sociology-8192-paper-1',
      code: '8192/1',
      title: 'The sociology of families and education',
      position: 0,
      subjectId: 'sociology',
      assessmentType: 'written-exam',
      durationMinutes: 105,
      totalMarks: 100,
    },
  ],
  assessmentObjectives: [
    { id: 'ao1', title: 'Demonstrate knowledge and understanding', weightings: { overall: 100 } },
  ],
  selectionGroups: [],
  requirements: [],
  requirementCoverage: 'none',
  status: 'current',
  firstTeaching: '2017',
  firstAssessment: '2019',
  withdrawnFrom: null,
  provenance: {
    sourceName: 'AQA GCSE Sociology specification',
    sourceUrl: 'https://www.aqa.org.uk/subjects/sociology/gcse/sociology-8192',
    verifiedOn: '2026-08-04',
  },
})

const mutate = (base, changes) => ({ ...base(), ...changes })

describe('schema rejects invalid records', () => {
  it('accepts the unmutated fixtures, so every failure below is the mutation', () => {
    expect(validateBoard(validBoard())).toEqual([])
    expect(validateSpecification(validSpecification())).toEqual([])
  })

  it('rejects an id that is an implementation path', () => {
    expect(validateBoard(mutate(validBoard, { id: 'records/aqa.js' })).join(' '))
      .toMatch(/must not be an implementation path/)
  })

  it('rejects an empty subjectIds — a specification must cover something', () => {
    expect(validateSpecification(mutate(validSpecification, { subjectIds: [] })).join(' '))
      .toMatch(/must name at least one subject/)
  })

  it('rejects a duplicated subject id', () => {
    const errors = validateSpecification(mutate(validSpecification, { subjectIds: ['sociology', 'sociology'] }))
    expect(errors.join(' ')).toMatch(/more than once/)
  })

  it('rejects a subject id outside the canonical vocabulary', () => {
    expect(validateSpecification(mutate(validSpecification, { subjectIds: ['geography'] })).join(' '))
      .toMatch(/not a canonical subject id/)
  })

  it('rejects an invalid tier', () => {
    expect(validateSpecification(mutate(validSpecification, { tiers: ['intermediate'] })).join(' '))
      .toMatch(/not one of foundation \| higher/)
  })

  it('rejects a paper whose subjectId is outside the specification coverage', () => {
    const spec = validSpecification()
    spec.papers[0].subjectId = 'physics'
    expect(validateSpecification(spec).join(' ')).toMatch(/is not covered by its specification/)
  })

  it('rejects an invalid assessment type', () => {
    const spec = validSpecification()
    spec.papers[0].assessmentType = 'coursework'
    expect(validateSpecification(spec).join(' ')).toMatch(/assessmentType must be one of/)
  })

  it('rejects two papers sharing a position', () => {
    const spec = validSpecification()
    spec.papers.push({ ...spec.papers[0], id: `${spec.papers[0].id}-b` })
    expect(validateSpecification(spec).join(' ')).toMatch(/position 0 is used more than once/)
  })

  it('rejects two papers sharing an id', () => {
    const spec = validSpecification()
    spec.papers.push({ ...spec.papers[0], position: 1 })
    expect(validateSpecification(spec).join(' ')).toMatch(/id ".*" is used more than once/)
  })

  it('rejects a paper id not scoped to its specification', () => {
    const spec = validSpecification()
    spec.papers[0].id = 'some-other-paper'
    expect(validateSpecification(spec).join(' ')).toMatch(/must be scoped to its specification/)
  })

  it('rejects assessment-objective weightings that do not total 100', () => {
    const spec = validSpecification()
    spec.assessmentObjectives = [
      { id: 'ao1', title: 'Knowledge', weightings: { overall: 40 } },
      { id: 'ao2', title: 'Application', weightings: { overall: 40 } },
    ]
    expect(validateSpecification(spec).join(' ')).toMatch(/must total 100%/)
  })

  it('rejects a current specification carrying a withdrawal date', () => {
    expect(validateSpecification(mutate(validSpecification, { withdrawnFrom: '2027' })).join(' '))
      .toMatch(/is "current" but withdrawnFrom is set/)
  })

  it('rejects a withdrawn specification with no withdrawal date', () => {
    expect(validateSpecification(mutate(validSpecification, { status: 'withdrawn' })).join(' '))
      .toMatch(/is "withdrawn" but withdrawnFrom is null/)
  })

  it('rejects requirementCoverage that misdescribes the authored set', () => {
    expect(validateSpecification(mutate(validSpecification, { requirementCoverage: 'complete' })).join(' '))
      .toMatch(/but no requirements are authored/)
  })

  it('rejects missing or malformed provenance', () => {
    expect(validateSpecification(mutate(validSpecification, { provenance: { sourceName: 'A revision blog' } })).join(' '))
      .toMatch(/sourceUrl must be an https URL/)
    const spec = validSpecification()
    spec.provenance = { ...spec.provenance, verifiedOn: 'last Tuesday' }
    expect(validateSpecification(spec).join(' ')).toMatch(/verifiedOn must be an ISO date/)
  })

  it('rejects a non-serialisable value anywhere in a record', () => {
    expect(validateBoard(mutate(validBoard, { name: () => 'AQA' })).join(' '))
      .toMatch(/must not be a function/)
  })

  it('rejects an unknown field', () => {
    expect(validateBoard(mutate(validBoard, { website: 'https://example.org' })).join(' '))
      .toMatch(/board\.website is not a known field/)
  })
})

// ─── Assessment objective weightings ───────────────────────────────────────
//
// A single `weighting: number` could not tell the truth about two real
// specifications: AQA Mathematics weights its AOs differently by tier, and AQA
// English Language has three assessment objectives that are valid, examined,
// and worth 0% of the qualification. `weightings` states the scope explicitly.
//
// ⚠ Structural fixtures again — the shapes that forced the rule, not verified
// curriculum data. The verified records live under `records/`.

const overallAo = (id, overall) => ({ id, title: `Objective ${id}`, weightings: { overall } })

const tieredSpecification = () => ({
  ...validSpecification(),
  id: 'aqa-gcse-mathematics-8300',
  code: '8300',
  title: 'AQA GCSE Mathematics',
  subjectIds: ['mathematics'],
  tiers: ['foundation', 'higher'],
  papers: [{
    id: 'aqa-gcse-mathematics-8300-paper-1',
    title: 'Paper 1: non-calculator',
    position: 0,
    subjectId: 'mathematics',
    assessmentType: 'written-exam',
    durationMinutes: 90,
    totalMarks: 80,
  }],
  assessmentObjectives: [
    { id: 'ao1', title: 'Standard techniques', weightings: { foundation: 50, higher: 40 } },
    { id: 'ao2', title: 'Reasoning and communication', weightings: { foundation: 25, higher: 30 } },
    { id: 'ao3', title: 'Problem solving', weightings: { foundation: 25, higher: 30 } },
  ],
})

const zeroWeightedSpecification = () => ({
  ...validSpecification(),
  id: 'aqa-gcse-english-language-8700',
  code: '8700',
  title: 'AQA GCSE English Language',
  subjectIds: ['english-language'],
  tiers: [],
  papers: [{
    id: 'aqa-gcse-english-language-8700-paper-1',
    title: 'Paper 1: explorations in creative reading and writing',
    position: 0,
    subjectId: 'english-language',
    assessmentType: 'written-exam',
    durationMinutes: 105,
    totalMarks: 80,
  }],
  assessmentObjectives: [
    overallAo('ao1', 10), overallAo('ao2', 17.5), overallAo('ao3', 10),
    overallAo('ao4', 12.5), overallAo('ao5', 30), overallAo('ao6', 20),
    overallAo('ao7', 0), overallAo('ao8', 0), overallAo('ao9', 0),
  ],
})

const withWeightings = (base, ...sets) => {
  const spec = base()
  spec.assessmentObjectives = sets.map((weightings, i) => ({
    id: `ao${i + 1}`, title: `Objective ${i + 1}`, weightings,
  }))
  return spec
}

describe('assessment objective weightings', () => {
  it('accepts an untiered specification stating one overall weighting per objective', () => {
    expect(validateSpecification(validSpecification())).toEqual([])
  })

  it('accepts a tiered specification whose objectives differ by tier', () => {
    // AQA Mathematics 8300: 50/25/25 Foundation, 40/30/30 Higher. A single
    // number could only have recorded one of these two truths.
    const spec = tieredSpecification()
    expect(validateSpecification(spec)).toEqual([])
    expect(spec.assessmentObjectives.map(ao => resolveWeighting(ao.weightings, 'foundation')))
      .toEqual([50, 25, 25])
    expect(spec.assessmentObjectives.map(ao => resolveWeighting(ao.weightings, 'higher')))
      .toEqual([40, 30, 30])
  })

  it('accepts overall on a tiered specification when the tiers do not differ', () => {
    // The Sciences: tiered qualification, identical AO percentages. Repeating
    // the same number once per tier would be a second copy of one fact.
    const spec = withWeightings(tieredSpecification,
      { overall: 40 }, { overall: 40 }, { overall: 20 })
    expect(validateSpecification(spec)).toEqual([])
    expect(resolveWeighting(spec.assessmentObjectives[0].weightings, 'higher')).toBe(40)
  })

  it('accepts an assessment objective weighted 0%', () => {
    // AQA English Language AO7–AO9 are examined through the Spoken Language
    // endorsement and carry no weighting toward the grade. They are real
    // objectives; dropping them would misdescribe the qualification.
    const spec = zeroWeightedSpecification()
    expect(validateSpecification(spec)).toEqual([])
    expect(spec.assessmentObjectives).toHaveLength(9)
    for (const id of ['ao7', 'ao8', 'ao9']) {
      const ao = spec.assessmentObjectives.find(candidate => candidate.id === id)
      expect(resolveWeighting(ao.weightings, 'overall')).toBe(0)
    }
  })

  it('rejects a tiered set that omits a tier the specification declares', () => {
    const spec = withWeightings(tieredSpecification,
      { foundation: 50, higher: 40 }, { foundation: 25, higher: 30 }, { foundation: 25 })
    expect(validateSpecification(spec).join(' ')).toMatch(/does not state a weighting for "higher"/)
  })

  it('rejects a scope the specification does not offer', () => {
    const spec = withWeightings(tieredSpecification,
      { foundation: 50, higher: 40, intermediate: 45 },
      { foundation: 25, higher: 30 }, { foundation: 25, higher: 30 })
    expect(validateSpecification(spec).join(' ')).toMatch(/"intermediate" is not a scope this specification offers/)
  })

  it('rejects a tier scope on an untiered specification', () => {
    const spec = withWeightings(validSpecification, { foundation: 100 })
    expect(validateSpecification(spec).join(' ')).toMatch(/"foundation" is not a scope this specification offers/)
  })

  it('rejects mixing overall with per-tier scopes', () => {
    const spec = withWeightings(tieredSpecification,
      { overall: 40, higher: 45 }, { overall: 40 }, { overall: 20 })
    expect(validateSpecification(spec).join(' ')).toMatch(/must not mix "overall" with per-tier scopes/)
  })

  it('rejects an empty or missing weightings object', () => {
    expect(validateSpecification(withWeightings(validSpecification, {})).join(' '))
      .toMatch(/must state at least one scope/)
    const spec = validSpecification()
    spec.assessmentObjectives = [{ id: 'ao1', title: 'Knowledge' }]
    expect(validateSpecification(spec).join(' ')).toMatch(/must be an object of scope → percentage/)
  })

  it('rejects a weighting below 0 or above 100', () => {
    expect(validateSpecification(withWeightings(validSpecification, { overall: -1 })).join(' '))
      .toMatch(/must be a percentage from 0 to 100/)
    expect(validateSpecification(withWeightings(validSpecification, { overall: 101 })).join(' '))
      .toMatch(/must be a percentage from 0 to 100/)
  })

  it('rejects a weighting that is not a finite number', () => {
    for (const bad of ['40', Number.NaN, Number.POSITIVE_INFINITY, null]) {
      expect(validateSpecification(withWeightings(validSpecification, { overall: bad })).join(' '))
        .toMatch(/must be a percentage from 0 to 100/)
    }
  })

  it('rejects a total that is not 100 at any one scope', () => {
    // Foundation totals 100, Higher totals 95. A per-qualification total would
    // have averaged the fault away.
    const spec = withWeightings(tieredSpecification,
      { foundation: 50, higher: 40 }, { foundation: 25, higher: 30 }, { foundation: 25, higher: 25 })
    const errors = validateSpecification(spec).join(' ')
    expect(errors).toMatch(/must total 100% for higher \(got 95\)/)
    expect(errors).not.toMatch(/for foundation/)
  })

  it('rejects the superseded single-number weighting by name', () => {
    const spec = validSpecification()
    spec.assessmentObjectives = [{ id: 'ao1', title: 'Knowledge', weighting: 100 }]
    expect(validateSpecification(spec).join(' '))
      .toMatch(/assessmentObjective\.weighting is a rejected field/)
  })

  it('resolves the scopes a specification must state', () => {
    expect(weightingScopes([])).toEqual(['overall'])
    expect(weightingScopes(['foundation', 'higher'])).toEqual(['foundation', 'higher'])
    // A scope nothing declares resolves to nothing, rather than to a default
    // that would quietly invent a percentage.
    expect(resolveWeighting({ foundation: 50 }, 'higher')).toBe(null)
    expect(resolveWeighting(undefined, 'overall')).toBe(null)
  })
})

describe('schema rejects the fields Phase 5A rejected', () => {
  const baseModule = () => ({
    id: 'sociology-aqa-families',
    title: 'Families',
    shortTitle: 'Families',
    subjectId: 'sociology',
    specRefs: [{ specificationId: 'aqa-gcse-sociology-8192', paperIds: ['aqa-gcse-sociology-8192-paper-1'], requirementIds: [] }],
    chapterRefs: [{ chapterId: 'soc4', position: 0 }],
    status: 'active',
    presentation: { heroImage: null, shortDescription: 'Family diversity and roles.' },
  })

  const baseSubject = () => ({
    id: 'sociology',
    title: 'Sociology',
    shortTitle: 'Sociology',
    themeKey: 'Sociology',
    status: 'active',
    legacyProgressNames: ['Sociology'],
    unattributedProgressNames: [],
  })

  it('accepts the unmutated fixtures', () => {
    expect(validateModule(baseModule())).toEqual([])
    expect(validateSubject(baseSubject())).toEqual([])
  })

  it('rejects module.tier — tier belongs to the pathway', () => {
    expect(validateModule({ ...baseModule(), tier: 'higher' }).join(' '))
      .toMatch(/module\.tier is a rejected field/)
  })

  it('rejects subject.browsable — visibility is derived, never authored', () => {
    expect(validateSubject({ ...baseSubject(), browsable: true }).join(' '))
      .toMatch(/subject\.browsable is a rejected field/)
  })

  it('rejects subject.specificationIds — coverage is not ownership', () => {
    expect(validateSubject({ ...baseSubject(), specificationIds: ['aqa-gcse-sociology-8192'] }).join(' '))
      .toMatch(/subject\.specificationIds is a rejected field/)
  })

  it('rejects the deferred relationship fields', () => {
    const module = baseModule()
    module.chapterRefs = [{ chapterId: 'soc4', position: 0, required: true }]
    expect(validateModule(module).join(' ')).toMatch(/chapterRef\.required is a rejected field/)

    const withOverride = baseModule()
    withOverride.chapterRefs = [{ chapterId: 'soc4', position: 0, availabilityOverride: 'planned' }]
    expect(validateModule(withOverride).join(' ')).toMatch(/chapterRef\.availabilityOverride is a rejected field/)
  })

  it('rejects derived chapter fields', () => {
    const chapter = {
      id: 'soc4',
      title: 'Family and households',
      subtitle: null,
      era: null,
      icon: null,
      headerImage: null,
      status: 'available',
      contentPath: 'src/content/sociology/families/episodes/soc4.js',
      conceptIds: [],
      requirementIds: [],
      estimatedMinutes: null,
    }
    expect(validateChapter(chapter)).toEqual([])
    for (const [field, expected] of [
      ['screenCount', /chapter\.screenCount is a rejected field/],
      ['screenTags', /chapter\.screenTags is a rejected field/],
      ['number', /chapter\.number is a rejected field/],
      ['series', /chapter\.series is a rejected field/],
      ['subject', /chapter\.subject is a rejected field/],
    ]) {
      expect(validateChapter({ ...chapter, [field]: 1 }).join(' ')).toMatch(expected)
    }
  })

  it('names every rejected field with a reason, not just "unknown"', () => {
    for (const reason of Object.values(REJECTED_FIELDS)) {
      expect(reason.length).toBeGreaterThan(20)
    }
  })

  it('preserves chapter ids that break kebab case rather than normalising them', () => {
    // Each of these is a live gcse_chapter_<id> progress key (D-8).
    for (const id of ['soc1', 'math1', 'bio_building_blocks', 'sci_bio_w1', 'spain-new-world-1']) {
      const errors = validateChapter({
        id,
        title: 'A chapter',
        subtitle: null,
        era: null,
        icon: null,
        headerImage: null,
        status: 'planned',
        contentPath: null,
        conceptIds: [],
        requirementIds: [],
        estimatedMinutes: null,
      })
      expect(errors, `${id} was rejected`).toEqual([])
    }
  })
})

describe('relationship and status invariants', () => {
  it('a study pathway references exactly one specification', () => {
    const source = read(`${CURRICULUM_ROOT}/schema.js`)
    expect(source).toMatch(/studyPathway\.specificationId/)
    const pathway = {
      id: 'aqa-sociology-8192',
      specificationId: 'aqa-gcse-sociology-8192',
      title: 'AQA GCSE Sociology',
      shortTitle: 'Sociology',
      tier: null,
      selections: {},
      moduleRefs: [],
      status: 'planned',
      scope: 'catalogue',
    }
    expect(validateStudyPathway(pathway)).toEqual([])
    expect(validateStudyPathway({ ...pathway, specificationIds: ['a', 'b'] }).join(' '))
      .toMatch(/studyPathway\.specificationIds is not a known field/)
  })

  it('a module has exactly one primary subject', () => {
    const module = {
      id: 'sociology-aqa-families',
      title: 'Families',
      shortTitle: 'Families',
      subjectId: 'sociology',
      specRefs: [{ specificationId: 'aqa-gcse-sociology-8192', paperIds: ['p'], requirementIds: [] }],
      chapterRefs: [],
      status: 'planned',
      presentation: { heroImage: null, shortDescription: 'Families.' },
    }
    expect(validateModule(module)).toEqual([])
    expect(validateModule({ ...module, subjectIds: ['sociology', 'history'] }).join(' '))
      .toMatch(/module\.subjectIds is not a known field/)
  })

  it('positions must be non-negative, unique and ascending', () => {
    const module = {
      id: 'sociology-aqa-families',
      title: 'Families',
      shortTitle: 'Families',
      subjectId: 'sociology',
      specRefs: [{ specificationId: 'aqa-gcse-sociology-8192', paperIds: ['p'], requirementIds: [] }],
      chapterRefs: [{ chapterId: 'soc4', position: 0 }, { chapterId: 'soc6', position: 1 }],
      status: 'planned',
      presentation: { heroImage: null, shortDescription: 'Families.' },
    }
    expect(validateModule(module)).toEqual([])
    expect(validateModule({ ...module, chapterRefs: [{ chapterId: 'soc4', position: -1 }] }).join(' '))
      .toMatch(/must be a non-negative integer/)
    expect(validateModule({
      ...module,
      chapterRefs: [{ chapterId: 'soc4', position: 1 }, { chapterId: 'soc6', position: 1 }],
    }).join(' ')).toMatch(/is used more than once/)
    expect(validateModule({
      ...module,
      chapterRefs: [{ chapterId: 'soc4', position: 5 }, { chapterId: 'soc6', position: 2 }],
    }).join(' ')).toMatch(/must come after/)
  })

  it('a retired record is never reachable from a live one', () => {
    expect(referenceIsLive('active', 'active')).toBe(true)
    expect(referenceIsLive('planned', 'planned')).toBe(true)
    expect(referenceIsLive('active', 'retired')).toBe(false)
    expect(referenceIsLive('planned', 'retired')).toBe(false)
    expect(referenceIsLive('retired', 'retired')).toBe(true)
  })

  it('cross-record integrity reports unresolved and retired references', () => {
    const problems = checkIntegrity({
      boards: [],
      subjects: [],
      specifications: [],
      pathways: [{
        id: 'ghost-pathway',
        specificationId: 'missing-specification',
        title: 'Ghost',
        shortTitle: 'Ghost',
        tier: null,
        selections: {},
        moduleRefs: [{ moduleId: 'retired-module', position: 0, required: true }],
        status: 'active',
        scope: 'catalogue',
      }],
      modules: [{
        id: 'retired-module',
        title: 'Retired',
        shortTitle: 'Retired',
        subjectId: 'sociology',
        specRefs: [],
        chapterRefs: [],
        status: 'retired',
        presentation: { heroImage: null, shortDescription: 'Gone.' },
      }],
      chapters: [],
    })
    expect(problems).toContain('pathway "ghost-pathway" references unknown specification "missing-specification"')
    expect(problems).toContain('pathway "ghost-pathway" (active) references retired module "retired-module"')
  })

  it('one id never means two things across the referenced levels', () => {
    const problems = checkIntegrity({
      boards: [{ id: 'collision', name: 'X', shortName: 'X', provenance: {} }],
      subjects: [],
      specifications: [],
      pathways: [],
      modules: [{
        id: 'collision',
        title: 'X',
        shortTitle: 'X',
        subjectId: 'sociology',
        specRefs: [],
        chapterRefs: [],
        status: 'planned',
        presentation: { heroImage: null, shortDescription: 'X.' },
      }],
      chapters: [],
    })
    expect(problems.join(' ')).toMatch(/id "collision" is used by both boards and modules/)
  })

  it('a chapter belongs to exactly one module', () => {
    const chapterRefs = position => [{ chapterId: 'soc4', position }]
    const module = (id) => ({
      id,
      title: id,
      shortTitle: id,
      subjectId: 'sociology',
      specRefs: [],
      chapterRefs: chapterRefs(0),
      status: 'active',
      presentation: { heroImage: null, shortDescription: 'X.' },
    })
    const problems = checkIntegrity({
      boards: [], subjects: [], specifications: [], pathways: [],
      modules: [module('module-a'), module('module-b')],
      chapters: [{
        id: 'soc4', title: 'Families', status: 'available',
        contentPath: 'src/content/sociology/families/episodes/soc4.js',
        headerImage: null, conceptIds: [], requirementIds: [], estimatedMinutes: null,
      }],
    })
    expect(problems).toContain('chapter "soc4" belongs to both "module-a" and "module-b"')
  })

  it('the Stage 1 records are the nine verified specifications and two boards', async () => {
    // A deliberate census, not a growth counter. Stage 2 adds subjects,
    // pathways, modules and chapters — not specifications — so this number
    // changing is a decision someone must make on purpose.
    const { boards, specifications } = await loadCatalogue()
    expect(boards.map(board => board.id).sort()).toEqual(['aqa', 'pearson-edexcel'])
    expect(specifications.map(spec => spec.id).sort()).toEqual([
      'aqa-gcse-biology-8461',
      'aqa-gcse-chemistry-8462',
      'aqa-gcse-combined-science-trilogy-8464',
      'aqa-gcse-english-language-8700',
      'aqa-gcse-english-literature-8702',
      'aqa-gcse-mathematics-8300',
      'aqa-gcse-physics-8463',
      'aqa-gcse-sociology-8192',
      'pearson-edexcel-gcse-history-1hi0',
    ])
  })

  it('the canonical subject vocabulary is the ten disciplines, and creates no records', async () => {
    expect(SUBJECT_IDS).toEqual([
      'mathematics', 'biology', 'chemistry', 'physics', 'history',
      'english-language', 'english-literature', 'sociology', 'drama', 'music',
    ])
    // OD-7: listing an id is not creating a record.
    const catalogue = await loadCatalogue()
    for (const subjectId of ['drama', 'music']) {
      expect(catalogue.subjects.some(subject => subject.id === subjectId)).toBe(false)
      expect(catalogue.specifications.some(spec => spec.subjectIds.includes(subjectId))).toBe(false)
    }
  })
})

// ─── Stage 1: the authored records say what the awarding bodies say ─────────
//
// The tests above prove the SCHEMA rejects malformed records. These prove the
// AUTHORED records are the ones intended — that the qualifications are modelled
// the way the awarding bodies actually publish them, and that the record set
// does not quietly claim more than it has.

describe('Stage 1 authored specifications', () => {
  const spec = (catalogue, id) => catalogue.specifications.find(candidate => candidate.id === id)

  it('models Combined Science as one specification covering exactly three subjects', async () => {
    // The shape that would have forced a special case in a tree model: one
    // qualification, three disciplines, six papers, two per discipline.
    const trilogy = spec(await loadCatalogue(), 'aqa-gcse-combined-science-trilogy-8464')
    expect(trilogy.subjectIds).toEqual(['biology', 'chemistry', 'physics'])
    expect(trilogy.papers).toHaveLength(6)
    for (const subjectId of trilogy.subjectIds) {
      expect(trilogy.papers.filter(paper => paper.subjectId === subjectId)).toHaveLength(2)
    }
    // No subject claims it. Coverage is not ownership.
    expect(trilogy.papers.every(paper => trilogy.subjectIds.includes(paper.subjectId))).toBe(true)
  })

  it('tiers each specification the way its awarding body does', async () => {
    const catalogue = await loadCatalogue()
    const tiered = catalogue.specifications
      .filter(candidate => candidate.tiers.length > 0)
      .map(candidate => candidate.id)
      .sort()
    expect(tiered).toEqual([
      'aqa-gcse-biology-8461',
      'aqa-gcse-chemistry-8462',
      'aqa-gcse-combined-science-trilogy-8464',
      'aqa-gcse-mathematics-8300',
      'aqa-gcse-physics-8463',
    ])
    for (const candidate of catalogue.specifications) {
      if (candidate.tiers.length) expect(candidate.tiers).toEqual(['foundation', 'higher'])
    }
    // One record per qualification. A tiered specification is never split into
    // a Foundation copy and a Higher copy.
    const codes = catalogue.specifications.map(candidate => candidate.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('resolves every assessment objective set to 100% at every scope it declares', async () => {
    const catalogue = await loadCatalogue()
    for (const candidate of catalogue.specifications) {
      for (const scope of weightingScopes(candidate.tiers)) {
        const total = candidate.assessmentObjectives
          .reduce((sum, ao) => sum + resolveWeighting(ao.weightings, scope), 0)
        expect(total, `${candidate.id} @ ${scope}`).toBeCloseTo(100, 9)
      }
    }
  })

  it('records Mathematics as 50/25/25 Foundation and 40/30/30 Higher', async () => {
    const maths = spec(await loadCatalogue(), 'aqa-gcse-mathematics-8300')
    expect(maths.assessmentObjectives.map(ao => resolveWeighting(ao.weightings, 'foundation')))
      .toEqual([50, 25, 25])
    expect(maths.assessmentObjectives.map(ao => resolveWeighting(ao.weightings, 'higher')))
      .toEqual([40, 30, 30])
  })

  it('keeps English Language AO1–AO9, with AO7–AO9 at 0%', async () => {
    const english = spec(await loadCatalogue(), 'aqa-gcse-english-language-8700')
    expect(english.assessmentObjectives.map(ao => ao.id))
      .toEqual(['ao1', 'ao2', 'ao3', 'ao4', 'ao5', 'ao6', 'ao7', 'ao8', 'ao9'])
    for (const id of ['ao7', 'ao8', 'ao9']) {
      const ao = english.assessmentObjectives.find(candidate => candidate.id === id)
      expect(resolveWeighting(ao.weightings, 'overall'), id).toBe(0)
      // A 0% objective must say why it is 0%, or it reads as an authoring slip.
      expect(ao.note).toMatch(/endorsement/i)
    }
  })

  it('gives every written exam a duration and a mark total', async () => {
    const catalogue = await loadCatalogue()
    for (const candidate of catalogue.specifications) {
      for (const paper of candidate.papers) {
        if (paper.assessmentType !== 'written-exam') continue
        expect(paper.durationMinutes, `${paper.id} duration`).toBeGreaterThan(0)
        expect(paper.totalMarks, `${paper.id} marks`).toBeGreaterThan(0)
      }
    }
  })

  it('does not let Spoken Language pretend to be a written exam', async () => {
    const english = spec(await loadCatalogue(), 'aqa-gcse-english-language-8700')
    const spoken = english.papers.find(paper => paper.id.endsWith('-spoken-language'))
    expect(spoken.assessmentType).toBe('nea-endorsement')
    // It has no fixed duration and no marks, so it states neither. Writing 0 or
    // a plausible number would be inventing an assessment that does not exist.
    expect('durationMinutes' in spoken).toBe(false)
    expect('totalMarks' in spoken).toBe(false)
    expect(spoken.note).toMatch(/separately reported/i)
  })

  it('points every selection group at a real paper of its own specification', async () => {
    const catalogue = await loadCatalogue()
    const withChoices = catalogue.specifications.filter(candidate => candidate.selectionGroups.length)
    expect(withChoices.map(candidate => candidate.id).sort()).toEqual([
      'aqa-gcse-english-literature-8702',
      'pearson-edexcel-gcse-history-1hi0',
    ])
    for (const candidate of withChoices) {
      const paperIds = candidate.papers.map(paper => paper.id)
      for (const group of candidate.selectionGroups) {
        expect(paperIds, `${candidate.id}/${group.id}`).toContain(group.paperId)
        // Required, and nothing has chosen yet: a specification states what must
        // be chosen, a study pathway records what was.
        expect(group.required).toBe(true)
      }
    }
    expect(spec(catalogue, 'aqa-gcse-english-literature-8702').selectionGroups.map(group => group.id))
      .toEqual(['shakespeare-text', 'nineteenth-century-novel', 'modern-text', 'poetry-anthology-cluster'])
    expect(spec(catalogue, 'pearson-edexcel-gcse-history-1hi0').selectionGroups.map(group => group.id))
      .toEqual([
        'thematic-study-and-historic-environment',
        'period-study',
        'british-depth-study',
        'modern-depth-study',
      ])
  })

  it('carries official provenance and the same verification date on every record', async () => {
    const catalogue = await loadCatalogue()
    const records = [...catalogue.boards, ...catalogue.specifications]
    expect(records).toHaveLength(11)
    for (const record of records) {
      expect(record.provenance.verifiedOn, record.id).toBe('2026-08-05')
      expect(record.provenance.sourceUrl, record.id).toMatch(/^https:\/\/(www\.aqa\.org\.uk|qualifications\.pearson\.com)\//)
      expect(record.provenance.sourceName.length, record.id).toBeGreaterThan(10)
      // The check was real; the environment reaching the domain was not. Saying
      // so is the difference between provenance and decoration.
      expect(record.provenance.note, record.id)
        .toBe('Official awarding-body source independently verified and supplied in-session; '
          + 'the implementation environment could not access the awarding-body domain.')
    }
  })

  it('claims no requirement coverage, because none is authored', async () => {
    const catalogue = await loadCatalogue()
    for (const candidate of catalogue.specifications) {
      expect(candidate.requirementCoverage, candidate.id).toBe('none')
      expect(candidate.requirements, candidate.id).toEqual([])
      expect(candidate.status, candidate.id).toBe('current')
      expect(candidate.withdrawnFrom, candidate.id).toBe(null)
    }
  })

  it('keeps its own record set untouched now that Stage 2 has landed', async () => {
    // Stage 2 added subjects, pathways, modules and chapters. It added no
    // board and no specification, and changed neither count.
    const catalogue = await loadCatalogue()
    expect(catalogue.boards).toHaveLength(2)
    expect(catalogue.specifications).toHaveLength(9)
  })

  it('derives the record set from disk rather than from a registry', () => {
    // Every authored record is a file the loader found; nothing lists them.
    const files = listAllRecordFiles()
    expect(files).toContain('records/boards.js')
    expect(files.filter(file => file.startsWith('records/specifications/'))).toHaveLength(9)
    for (const file of files) {
      expect(existsSync(resolve(RECORDS_DIR, file.replace(/^records\//, '')))).toBe(true)
    }
    // The one non-record file under records/ is shared provenance, and it is
    // deliberately outside every location LAYOUT declares.
    expect(files).not.toContain('records/provenance.js')
  })
})

// ─── Persisted progress names ──────────────────────────────────────────────
//
// A subject id is progress identity, not display text: it is written into
// `gcse_scores` and the weakness tracker. `'English'` was persisted before
// Language and Literature were separate subjects, and no rule can recover
// which one an old row meant — so the schema has to be able to say "known
// legacy, resolves to nobody" without saying it twice and contradicting
// itself (OD-1).

describe('subject progress-name resolution', () => {
  const subject = (id, legacy, unattributed = []) => ({
    id,
    title: id,
    shortTitle: id,
    themeKey: 'English',
    status: 'active',
    legacyProgressNames: legacy,
    unattributedProgressNames: unattributed,
  })
  const catalogueOf = (...subjects) => checkIntegrity({
    boards: [], subjects, specifications: [], pathways: [], modules: [], chapters: [],
  })

  it('accepts an exclusive alias and an unattributed name', () => {
    expect(validateSubject(subject('sociology', ['Sociology']))).toEqual([])
    expect(validateSubject(subject('english-language', [], ['English']))).toEqual([])
  })

  it('lets two subjects share an unattributed name — that is what unattributed means', () => {
    expect(catalogueOf(
      subject('english-language', [], ['English']),
      subject('english-literature', [], ['English']),
    )).toEqual([])
  })

  it('rejects one subject claiming a name as both alias and unattributed', () => {
    expect(validateSubject(subject('english-literature', ['English'], ['English'])).join(' '))
      .toMatch(/also claims as a legacy alias/)
  })

  it('rejects an alias claimed by two subjects', () => {
    // The failure this exists to prevent: reading an old row would mean
    // picking a subject at random, and fabricated progress is worse than
    // absent progress.
    expect(catalogueOf(
      subject('english-language', ['English']),
      subject('english-literature', ['English']),
    ).join(' ')).toMatch(/claimed by both .* an alias that resolves to two subjects resolves to neither/)
  })

  it('rejects a name that is unattributed on one subject and an alias on another', () => {
    expect(catalogueOf(
      subject('english-language', ['English']),
      subject('english-literature', [], ['English']),
    ).join(' ')).toMatch(/cannot both resolve to a subject and to none/)
  })

  it('rejects a malformed list rather than treating it as empty', () => {
    expect(validateSubject({ ...subject('sociology', ['Sociology']), unattributedProgressNames: 'English' }).join(' '))
      .toMatch(/unattributedProgressNames must be an array/)
    expect(validateSubject({ ...subject('sociology', 'Sociology') }).join(' '))
      .toMatch(/legacyProgressNames must be an array/)
  })
})

// ─── Stage 2: the authored curriculum reproduces today's reality ────────────
//
// Stage 1 proved the specifications say what the awarding bodies say. These
// prove the subjects, pathways, modules and chapters say what the app already
// does — and say the few things it could not previously express, in the exact
// places the settled decisions put them.

describe('Stage 2 authored curriculum', () => {
  const byId = (records, id) => records.find(record => record.id === id)

  it('authors eight subjects and no Drama or Music record', async () => {
    const { subjects } = await loadCatalogue()
    expect(subjects.map(subject => subject.id)).toEqual([
      'mathematics', 'biology', 'chemistry', 'physics', 'history',
      'english-language', 'english-literature', 'sociology',
    ])
    // OD-7: `drama` and `music` stay canonical vocabulary with no record until
    // their first module is ready. Listing an id creates nothing.
    for (const absent of ['drama', 'music']) {
      expect(subjects.some(subject => subject.id === absent), absent).toBe(false)
    }
  })

  it('references a theme key rather than duplicating palette data', async () => {
    const { subjects } = await loadCatalogue()
    const themes = await import('../../src/constants/subjects.js')
    for (const subject of subjects) {
      expect(Object.keys(themes.SUBJECTS), subject.id).toContain(subject.themeKey)
      // A record may reference the theme; it may never restate what is in it.
      const source = read(`${CURRICULUM_ROOT}/records/subjects.js`)
      expect(source, 'a palette value leaked into a subject record').not.toMatch(/#[0-9a-fA-F]{6}/)
    }
    // Two subjects, one palette — the proof that theme key and academic
    // identity are different facts.
    expect(byId(subjects, 'english-language').themeKey).toBe('English')
    expect(byId(subjects, 'english-literature').themeKey).toBe('English')
  })

  it('resolves persisted progress names to one subject, or deliberately to none', async () => {
    const { subjects } = await loadCatalogue()
    const owner = new Map()
    for (const subject of subjects) {
      for (const name of subject.legacyProgressNames) {
        expect(owner.has(name), `${name} claimed twice`).toBe(false)
        owner.set(name, subject.id)
      }
    }
    // The write vocabulary that actually reaches storage.
    expect([...owner.keys()].sort())
      .toEqual(['Biology', 'Chemistry', 'History', 'Maths', 'Physics', 'Sociology'])

    // OD-1: `'English'` predates the Language/Literature split. Both subjects
    // list it as unattributed, so it resolves to neither and cannot be picked
    // arbitrarily — the structural version of "do not guess".
    for (const id of ['english-language', 'english-literature']) {
      expect(byId(subjects, id).unattributedProgressNames, id).toEqual(['English'])
      expect(byId(subjects, id).legacyProgressNames, id).toEqual([])
    }
    expect(owner.has('English')).toBe(false)
    // `'Quick Fire'` is persisted and is not a subject at all (A-19). It
    // belongs to no record, in either list.
    const everyName = subjects.flatMap(s => [...s.legacyProgressNames, ...s.unattributedProgressNames])
    expect(everyName).not.toContain('Quick Fire')
  })

  it('authors fourteen catalogue study pathways', async () => {
    const { pathways } = await loadCatalogue()
    expect(pathways.map(pathway => pathway.id).sort()).toEqual([
      'aqa-biology-8461-foundation', 'aqa-biology-8461-higher',
      'aqa-chemistry-8462-foundation', 'aqa-chemistry-8462-higher',
      'aqa-combined-science-8464-foundation', 'aqa-combined-science-8464-higher',
      'aqa-english-language-8700', 'aqa-english-literature-8702-macbeth-inspector',
      'aqa-maths-8300-foundation', 'aqa-maths-8300-higher',
      'aqa-physics-8463-foundation', 'aqa-physics-8463-higher',
      'aqa-sociology-8192',
      'pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa',
    ])
    for (const pathway of pathways) expect(pathway.scope, pathway.id).toBe('catalogue')
  })

  it('puts tier on the pathway and nowhere else', async () => {
    const { pathways, modules, chapters } = await loadCatalogue()
    const tiered = pathways.filter(pathway => pathway.tier !== null)
    expect(tiered).toHaveLength(10)
    for (const record of [...modules, ...chapters]) {
      expect('tier' in record, `${record.id} carries a tier`).toBe(false)
    }
  })

  it('records what was chosen, and records unchosen as unchosen', async () => {
    const { pathways } = await loadCatalogue()
    expect(byId(pathways, 'aqa-english-literature-8702-macbeth-inspector').selections).toEqual({
      'shakespeare-text': 'macbeth',
      'nineteenth-century-novel': null,
      'modern-text': 'an-inspector-calls',
      'poetry-anthology-cluster': null,
    })
    expect(byId(pathways, 'pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa').selections).toEqual({
      'thematic-study-and-historic-environment': 'medicine-and-western-front',
      'period-study': 'spain-new-world',
      'british-depth-study': 'early-elizabethan-england',
      'modern-depth-study': 'usa-conflict',
    })
    // English Language sets no texts: every source is unseen and supplied in
    // the exam. Empty selections is the control case proving the machinery is
    // optional rather than a field every pathway pads with placeholders.
    for (const id of ['aqa-english-language-8700', 'aqa-sociology-8192',
      'aqa-maths-8300-foundation', 'aqa-maths-8300-higher',
      'aqa-combined-science-8464-higher', 'aqa-biology-8461-higher']) {
      expect(byId(pathways, id).selections, id).toEqual({})
    }
  })

  it('gives Medicine and the Western Front one selection group and two modules', async () => {
    const { pathways } = await loadCatalogue()
    const history = byId(pathways, 'pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa')
    const thematic = history.moduleRefs
      .filter(ref => ref.selectionGroup === 'thematic-study-and-historic-environment')
      .map(ref => ref.moduleId)
    expect(thematic).toEqual(['history-edexcel-medicine-britain', 'history-edexcel-western-front'])
  })

  it('reuses one module record across Combined and Triple Science', async () => {
    const { modules, pathways } = await loadCatalogue()
    const biology = ['biology-aqa-cell-biology', 'biology-aqa-organisation',
      'biology-aqa-infection-and-response', 'biology-aqa-homeostasis',
      'biology-aqa-inheritance-variation-evolution', 'biology-aqa-ecology']
    for (const id of biology) {
      const module = byId(modules, id)
      expect(module.specRefs.map(ref => ref.specificationId).sort(), id)
        .toEqual(['aqa-gcse-biology-8461', 'aqa-gcse-combined-science-trilogy-8464'])
    }
    // Same ids on both pathways — referenced, never copied. A "combined-"
    // prefixed twin would be the duplication the model exists to prevent.
    const reached = pathway => byId(pathways, pathway).moduleRefs.map(ref => ref.moduleId)
    for (const id of biology) {
      expect(reached('aqa-combined-science-8464-higher'), id).toContain(id)
      expect(reached('aqa-biology-8461-higher'), id).toContain(id)
    }
    expect(modules.filter(module => module.subjectId === 'biology')).toHaveLength(6)
    // Combined spans three disciplines; every module it reaches keeps one.
    const combined = reached('aqa-combined-science-8464-foundation')
      .map(id => byId(modules, id).subjectId)
    expect([...new Set(combined)].sort()).toEqual(['biology', 'chemistry', 'physics'])
  })

  it('splits Sociology and History the way the settled decisions say', async () => {
    const { modules } = await loadCatalogue()
    const chapterIds = id => byId(modules, id).chapterRefs.map(ref => ref.chapterId)
    // OD-4, settled before Stage 0.
    expect(chapterIds('sociology-aqa-key-concepts')).toEqual(['soc1', 'soc2', 'soc3'])
    expect(chapterIds('sociology-aqa-families')).toEqual(['soc4', 'soc6'])
    // The Western Front leaves Medicine; OD-5 keeps Nightingale a distinct
    // planned chapter rather than absorbing it.
    expect(chapterIds('history-edexcel-western-front')).toEqual(['history-medicine-western-front'])
    const medicine = chapterIds('history-edexcel-medicine-britain')
    expect(medicine).toHaveLength(14)
    expect(medicine).not.toContain('history-medicine-western-front')
    expect(medicine).toContain('history-medicine-nightingale')
    // maths_core renames in scope, not in membership.
    expect(chapterIds('maths-aqa-number')).toHaveLength(8)
    // bio_core splits across the six per-topic directories that already existed.
    expect(chapterIds('biology-aqa-cell-biology'))
      .toEqual(['bio_building_blocks', 'sci_bio_w1', 'bio_building_life'])
  })

  it('authors exactly 65 chapters — 30 available, 35 planned', async () => {
    const { chapters } = await loadCatalogue()
    expect(chapters).toHaveLength(65)
    expect(chapters.filter(chapter => chapter.status === 'available')).toHaveLength(30)
    expect(chapters.filter(chapter => chapter.status === 'planned')).toHaveLength(35)
  })

  it('preserves all 59 non-hidden chapter ids and adds six semantic ones', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/chapters.js')
    const nonHidden = runtime.CHAPTERS
      .filter(chapter => runtime.getChapterAvailability(chapter) !== 'hidden')
      .map(chapter => chapter.id)
    expect(nonHidden).toHaveLength(59)

    const authored = new Set(chapters.map(chapter => chapter.id))
    for (const id of nonHidden) expect(authored.has(id), `${id} lost`).toBe(true)

    const added = chapters.map(c => c.id).filter(id => !nonHidden.includes(id))
    expect(added.sort()).toEqual([
      'english-inspector-calls-consequences-resolution',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-social-message',
      'english-macbeth-appearance-reality',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
    ])
    for (const id of added) {
      expect(byId(chapters, id).status, id).toBe('planned')
    }
    // A browse-surface id is not a curriculum id. None survives.
    for (const chapter of chapters) {
      expect(chapter.id.startsWith('cs_'), `${chapter.id} is a placeholder id`).toBe(false)
    }
  })

  it('excludes the hidden Renaissance bundle while keeping its progress reachable', async () => {
    const { chapters } = await loadCatalogue()
    // The bundle is compatibility data, not a seventh entity type — see
    // tests/architecture/curriculum-compatibility.test.js.
    const { hiddenChapter } = loadCompatibility()
    const binding = { id: hiddenChapter.row.id, contentPath: hiddenChapter.contentPath }
    expect(binding.id).toBe('history-medicine-renaissance-medicine')
    expect(chapters.some(chapter => chapter.id === binding.id)).toBe(false)
    // Excluded from the catalogue as a chapter, still whole in the runtime and
    // still the destination `mod2` progress folds onto. Preserved is not the
    // same as given a chapter record.
    const runtime = await import('../../src/chapters.js')
    const hidden = runtime.CHAPTERS.find(chapter => chapter.id === binding.id)
    expect(runtime.getChapterAvailability(hidden)).toBe('hidden')
    const progress = await import('../../src/data/chapterProgress.js')
    expect(progress.LEGACY_CHAPTER_ID_MAP.mod2).toBe(binding.id)
    expect(progress.canonicalChapterId('mod2')).toBe(binding.id)
  })

  it('binds every available chapter to the content file it already loads', async () => {
    const { chapters } = await loadCatalogue()
    const loaderPath = frozenLoaderPaths()
    for (const chapter of chapters) {
      // Status does not decide the binding: a chapter is bound to the file the
      // runtime already loads for it, and to null only when no file exists.
      expect(chapter.contentPath, chapter.id).toBe(loaderPath[chapter.id] ?? null)
      if (chapter.contentPath === null) continue
      expect(existsSync(resolve(root, chapter.contentPath)), `${chapter.contentPath} missing`).toBe(true)
    }
  })

  it('authors only derived-free chapter fields, and only registered concepts', async () => {
    const { chapters } = await loadCatalogue()
    const graph = await import('../../src/data/learningGraph/index.js')
    for (const chapter of chapters) {
      for (const derived of ['screenCount', 'screenTags', 'number', 'series', 'subject']) {
        expect(derived in chapter, `${chapter.id} authors ${derived}`).toBe(false)
      }
      for (const conceptId of chapter.conceptIds) {
        expect(graph.isConceptId(conceptId), `${chapter.id}: ${conceptId}`).toBe(true)
      }
      // Requirements are not authored yet, so nothing may claim one.
      expect(chapter.requirementIds, chapter.id).toEqual([])
      expect(chapter.estimatedMinutes === null || chapter.estimatedMinutes > 0).toBe(true)
    }
    expect(chapters.some(chapter => chapter.conceptIds.length > 0)).toBe(true)
  })

  it('gives every chapter exactly one module, with unique ascending positions', async () => {
    const { chapters, modules } = await loadCatalogue()
    const owners = new Map()
    for (const module of modules) {
      const positions = module.chapterRefs.map(ref => ref.position)
      expect(positions, `${module.id} positions`).toEqual(positions.map((_, i) => i))
      for (const ref of module.chapterRefs) {
        expect(owners.has(ref.chapterId), `${ref.chapterId} owned twice`).toBe(false)
        owners.set(ref.chapterId, module.id)
      }
    }
    for (const chapter of chapters) {
      expect(owners.has(chapter.id), `${chapter.id} belongs to no module`).toBe(true)
    }
    expect(owners.size).toBe(65)
    // Pathway module positions are equally deterministic.
    const { pathways } = await loadCatalogue()
    for (const pathway of pathways) {
      const positions = pathway.moduleRefs.map(ref => ref.position)
      expect(positions, `${pathway.id} positions`).toEqual(positions.map((_, i) => i))
    }
  })

  it('invents no specification requirement to hang a module on', async () => {
    const { modules, specifications } = await loadCatalogue()
    for (const spec of specifications) expect(spec.requirements, spec.id).toEqual([])
    for (const module of modules) {
      for (const ref of module.specRefs) {
        expect(ref.requirementIds, `${module.id} → ${ref.specificationId}`).toEqual([])
        expect(ref.paperIds.length, `${module.id} names no paper`).toBeGreaterThan(0)
      }
    }
  })

  it('leaves the runtime catalogue exactly as it was', async () => {
    // Stage 2 authors records and changes no behaviour. If any of these three
    // moved, something consumed the catalogue early.
    const chapters = await import('../../src/chapters.js')
    const modules = await import('../../src/data/modules.js')
    const registry = await import('../../src/content/chapterContentRegistry.js')
    expect(chapters.CHAPTERS).toHaveLength(60)
    expect(modules.MODULES.map(module => module.id)).toEqual([
      'hist_medicine', 'soc_family', 'maths_core', 'bio_core',
      'eng_macbeth', 'hist_spain_new_world', 'hist_usa',
    ])
    expect(Object.keys(registry.CHAPTER_CONTENT_LOADERS)).toHaveLength(60)
  })
})

// ─── The curriculum map ────────────────────────────────────────────────────

describe('generated curriculum map', () => {
  it('is byte-identical to a fresh render, and deterministic', async () => {
    const catalogue = await loadCatalogue()
    expect(renderCurriculumMap(catalogue)).toBe(read(MAP_OUTPUT_PATH))
    expect(renderCurriculumMap(catalogue)).toBe(renderCurriculumMap(catalogue))
    expect(read(MAP_OUTPUT_PATH)).toContain('GENERATED FILE — do not edit')
  })

  it('shows subjects, pathways, selections, reuse and chapter binding', async () => {
    const rendered = renderCurriculumMap(await loadCatalogue())
    expect(rendered).toContain('| `english-literature` | English literature | `English` |')
    expect(rendered).toContain('| `aqa-maths-8300-higher` | GCSE Mathematics | higher | 7 |')
    expect(rendered).toContain("| `Literature` | `poetry-anthology-cluster` | — |")
    expect(rendered).toMatch(/`biology-aqa-cell-biology` \| Biology \(F\).*Combined \(H\)/)
    expect(rendered).toContain('GCSE Combined Science: Trilogy · GCSE Biology')
    expect(rendered).toContain('`src/content/sociology/families/episodes/soc4.js`')
    expect(rendered).toContain('_Planned. No chapters are invented to fill it._')
  })

  it('documents the placeholder migration against the records it describes', async () => {
    const { chapters } = await loadCatalogue()
    const subjectCatalogue = read('src/features/subjects/subjectCatalogue.js')
    expect(PLACEHOLDER_MIGRATION).toHaveLength(6)
    for (const [from, to] of PLACEHOLDER_MIGRATION) {
      // The `from` was a real browse-surface placeholder…
      expect(subjectCatalogue, `${from} was never a placeholder`).toContain(`id: '${from}'`)
      // …and the `to` is a planned record that actually exists.
      const chapter = chapters.find(candidate => candidate.id === to)
      expect(chapter, `${to} has no record`).toBeTruthy()
      expect(chapter.status).toBe('planned')
      // These six are the only planned chapters with no content path, because
      // they are the only ones with no file — a placeholder card never had one.
      expect(chapter.contentPath).toBe(null)
    }
    const rendered = renderCurriculumMap(await loadCatalogue())
    expect(rendered).toContain('| `cs_macbeth_2` | `english-macbeth-guilt-consequence` |')
    expect(rendered).toContain('history-medicine-renaissance-medicine')
  })

  it('is documentation — the runtime projections belong to the other generator', () => {
    // Two generators, two outputs. This one writes documentation under docs/;
    // scripts/generate-curriculum-projections.mjs writes the runtime
    // projections under src/data/generated/curriculum/. Neither writes the
    // other's files.
    expect(OUTPUT_PATH.startsWith('docs/')).toBe(true)
    expect(MAP_OUTPUT_PATH.startsWith('docs/')).toBe(true)
    const source = read('scripts/generate-curriculum-catalogue.mjs')
    expect(source, 'the documentation generator writes a runtime projection')
      .not.toMatch(/src\/data\/generated/)
  })
})

// ─── Content bindings ──────────────────────────────────────────────────────
//
// `status` and `contentPath` answer different questions and must stay
// independent: status is whether a learner may open a chapter, contentPath is
// whether a source exists for it. 29 planned chapters have a real file that
// currently returns zero screens. Collapsing the two would have deleted a true
// fact to satisfy a rule that was never a rule, and would have left the loader
// registry unreproducible from the catalogue.

describe('chapter content bindings', () => {
  const loaderPaths = frozenLoaderPaths

  it('preserves the existing content binding of all 59 non-hidden chapters', async () => {
    const { chapters } = await loadCatalogue()
    const paths = loaderPaths()
    const runtime = await import('../../src/chapters.js')
    const nonHidden = runtime.CHAPTERS
      .filter(chapter => runtime.getChapterAvailability(chapter) !== 'hidden')
      .map(chapter => chapter.id)
    expect(nonHidden).toHaveLength(59)
    for (const id of nonHidden) {
      const chapter = chapters.find(candidate => candidate.id === id)
      expect(chapter.contentPath, `${id} lost its binding`).toBe(paths[id])
    }
    expect(chapters.filter(chapter => chapter.contentPath !== null)).toHaveLength(59)
  })

  it('reproduces every one of the 60 runtime loader entries', async () => {
    const { chapters } = await loadCatalogue()
    const paths = loaderPaths()
    const reproduced = new Map()
    for (const chapter of chapters) {
      if (chapter.contentPath !== null) reproduced.set(chapter.id, chapter.contentPath)
    }
    // The hidden legacy loader has no chapter record. It is reproduced from the
    // compatibility projection — the reason that projection exists at all.
    const { hiddenChapter } = loadCompatibility()
    reproduced.set(hiddenChapter.row.id, hiddenChapter.contentPath)

    expect(reproduced.size).toBe(Object.keys(paths).length)
    expect(reproduced.size).toBe(60)
    for (const [id, path] of Object.entries(paths)) {
      expect(reproduced.get(id), `loader ${id} not reproducible`).toBe(path)
    }
  })

  it('generates no loader for the six new English chapters', async () => {
    const { chapters } = await loadCatalogue()
    const unbound = chapters.filter(chapter => chapter.contentPath === null)
    expect(unbound.map(chapter => chapter.id).sort()).toEqual([
      'english-inspector-calls-consequences-resolution',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-social-message',
      'english-macbeth-appearance-reality',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
    ])
    // No file, therefore no loader entry — not a loader entry pointing nowhere.
    const paths = loaderPaths()
    for (const chapter of unbound) expect(paths[chapter.id], chapter.id).toBeUndefined()
  })

  it('keeps status and content binding independent in both directions', async () => {
    const { chapters } = await loadCatalogue()
    const planned = chapters.filter(chapter => chapter.status === 'planned')
    // Both combinations exist, which is what "independent" has to mean.
    expect(planned.filter(chapter => chapter.contentPath !== null)).toHaveLength(29)
    expect(planned.filter(chapter => chapter.contentPath === null)).toHaveLength(6)
    // The schema permits a bound planned chapter…
    const bound = { ...planned.find(chapter => chapter.contentPath !== null) }
    expect(validateChapter(bound)).toEqual([])
    // …and still refuses an available chapter with nothing to open.
    expect(validateChapter({ ...bound, status: 'available', contentPath: null }).join(' '))
      .toMatch(/is "available" but contentPath is null/)
  })

  it('never promotes a chapter because a file exists', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/chapters.js')
    // The runtime's own answer is derived from screenCount; the catalogue's is
    // authored. A bound planned chapter must still be closed in both.
    for (const chapter of chapters) {
      if (chapter.status !== 'planned' || chapter.contentPath === null) continue
      const live = runtime.CHAPTERS.find(candidate => candidate.id === chapter.id)
      expect(runtime.isChapterAvailable(live), `${chapter.id} is openable`).toBe(false)
      expect(live.screenCount, `${chapter.id} has screens`).toBe(0)
    }
  })

  it('binds each content path to exactly one owner', async () => {
    const { chapters } = await loadCatalogue()
    const all = [
      ...chapters.filter(chapter => chapter.contentPath !== null).map(chapter => chapter.contentPath),
      loadCompatibility().hiddenChapter.contentPath,
    ]
    expect(new Set(all).size).toBe(all.length)
    // And the guard fires: two records claiming one file is a registry that
    // cannot be generated.
    const problems = checkIntegrity({
      boards: [], subjects: [], specifications: [], pathways: [], modules: [],
      chapters: [
        { id: 'a', status: 'planned', contentPath: 'src/content/x.js', requirementIds: [], conceptIds: [] },
        { id: 'b', status: 'planned', contentPath: 'src/content/x.js', requirementIds: [], conceptIds: [] },
      ],
    })
    expect(problems.join(' ')).toMatch(/is bound by both "a" and "b"/)
  })

  // The two tests that used to live here — "rejects a legacy binding that
  // competes with a chapter record" and "validates the binding record itself" —
  // moved to tests/architecture/curriculum-compatibility.test.js with the fact
  // they guard. A binding was never a seventh curriculum entity; it is
  // compatibility data, and its validation belongs with the rest of it.
})

// ─── Science paper mappings ────────────────────────────────────────────────
//
// ⚠ Provenance: the structure below was supplied and verified by the product
// owner in-session. This environment cannot reach the awarding-body domains, so
// no AQA URL was opened from here — see the commit message and the Stage 1
// provenance note. What these tests prove is that the records match the
// supplied structure exactly, not that the structure was fetched.

describe('Science paper mappings', () => {
  const TRILOGY = 'aqa-gcse-combined-science-trilogy-8464'
  const papersFor = (module, specificationId) =>
    module.specRefs.find(ref => ref.specificationId === specificationId)?.paperIds ?? null

  it('maps every Biology module to the paper that assesses it', async () => {
    const { modules } = await loadCatalogue()
    const expected = {
      'biology-aqa-cell-biology': 1,
      'biology-aqa-organisation': 1,
      'biology-aqa-infection-and-response': 1,
      'biology-aqa-homeostasis': 2,
      'biology-aqa-inheritance-variation-evolution': 2,
      'biology-aqa-ecology': 2,
    }
    for (const [id, paper] of Object.entries(expected)) {
      const module = modules.find(candidate => candidate.id === id)
      expect(papersFor(module, 'aqa-gcse-biology-8461'), id).toEqual([`aqa-gcse-biology-8461-paper-${paper}`])
      expect(papersFor(module, TRILOGY), id).toEqual([`${TRILOGY}-biology-paper-${paper}`])
    }
  })

  it('maps Chemistry atomic structure to Paper 1 of both specifications', async () => {
    const { modules } = await loadCatalogue()
    const module = modules.find(candidate => candidate.id === 'chemistry-aqa-atomic-structure')
    expect(papersFor(module, 'aqa-gcse-chemistry-8462')).toEqual(['aqa-gcse-chemistry-8462-paper-1'])
    expect(papersFor(module, TRILOGY)).toEqual([`${TRILOGY}-chemistry-paper-1`])
  })

  it('maps every Physics module, and splits Waves and electricity across both papers', async () => {
    const { modules } = await loadCatalogue()
    const expected = {
      'physics-aqa-energy': [1],
      'physics-aqa-matter-particles': [1],
      'physics-aqa-forces-motion': [2],
      // Electricity is Paper 1 and waves are Paper 2, so one module genuinely
      // spans both. `paperIds` being a list is what lets it say so.
      'physics-aqa-waves-electricity': [1, 2],
    }
    for (const [id, papers] of Object.entries(expected)) {
      const module = modules.find(candidate => candidate.id === id)
      expect(papersFor(module, 'aqa-gcse-physics-8463'), id)
        .toEqual(papers.map(n => `aqa-gcse-physics-8463-paper-${n}`))
      expect(papersFor(module, TRILOGY), id).toEqual(papers.map(n => `${TRILOGY}-physics-paper-${n}`))
    }
  })

  it('assesses Space in separate Physics only', async () => {
    const { modules, pathways } = await loadCatalogue()
    const space = modules.find(candidate => candidate.id === 'physics-aqa-space')
    expect(space.specRefs.map(ref => ref.specificationId)).toEqual(['aqa-gcse-physics-8463'])
    expect(papersFor(space, TRILOGY)).toBe(null)
    expect(papersFor(space, 'aqa-gcse-physics-8463')).toEqual(['aqa-gcse-physics-8463-paper-2'])

    const reaches = id => pathways.find(pathway => pathway.id === id).moduleRefs.map(ref => ref.moduleId)
    for (const tier of ['foundation', 'higher']) {
      expect(reaches(`aqa-combined-science-8464-${tier}`), tier).not.toContain('physics-aqa-space')
      expect(reaches(`aqa-physics-8463-${tier}`), tier).toContain('physics-aqa-space')
    }
  })

  it('leaves Combined Science positions contiguous after Space is removed', async () => {
    const { pathways } = await loadCatalogue()
    for (const tier of ['foundation', 'higher']) {
      const pathway = pathways.find(candidate => candidate.id === `aqa-combined-science-8464-${tier}`)
      expect(pathway.moduleRefs).toHaveLength(11)
      expect(pathway.moduleRefs.map(ref => ref.position)).toEqual([...Array(11).keys()])
    }
  })

  it('names only papers its specification actually has', async () => {
    const { modules, specifications } = await loadCatalogue()
    const papersById = new Map(specifications.map(spec => [spec.id, spec.papers.map(paper => paper.id)]))
    for (const module of modules) {
      for (const ref of module.specRefs) {
        for (const paperId of ref.paperIds) {
          expect(papersById.get(ref.specificationId), `${module.id} → ${paperId}`).toContain(paperId)
        }
      }
    }
  })
})
