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
} from '../../src/curriculum-catalogue/schema.js'
import { renderCatalogue, OUTPUT_PATH } from '../../scripts/generate-curriculum-catalogue.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

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
    // Record files are the strict case: nothing outside this directory at all.
    for (const file of listAllRecordFiles()) {
      const source = read(`${CURRICULUM_ROOT}/${file}`)
      const specifiers = [...source.matchAll(/from\s*['"]([^'"]+)['"]/g)].map(match => match[1])
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

  it('the generated document is documentation, not runtime code', () => {
    // Stage 0 emits build-time documentation only. No runtime projection of
    // MODULES, CHAPTERS or content loaders exists yet, and nothing under
    // src/data/generated/ mentions the curriculum catalogue.
    expect(existsSync(resolve(root, 'src/data/generated/curriculum'))).toBe(false)
    for (const file of listFiles('src/data/generated')) {
      expect(read(file), `${file} mentions the curriculum catalogue`).not.toMatch(/curriculum-catalogue/)
    }
  })

  it('leaves the runtime catalogue files hand-authored', () => {
    // The three files Stage 3 will eventually generate must still be authored
    // by hand at Stage 0 and Stage 1 (D-11).
    for (const file of ['src/data/modules.js', 'src/chapters.js', 'src/content/chapterContentRegistry.js']) {
      const source = read(file)
      expect(source, `${file} became generated too early`).not.toMatch(/GENERATED FILE/)
      expect(source, `${file} reaches the curriculum catalogue`).not.toMatch(/curriculum-catalogue/)
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
    { id: 'ao1', title: 'Demonstrate knowledge and understanding', weighting: 100 },
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
      { id: 'ao1', title: 'Knowledge', weighting: 40 },
      { id: 'ao2', title: 'Application', weighting: 40 },
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
