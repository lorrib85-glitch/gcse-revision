// ─── Exact parity gate, against a frozen contract ───────────────────────────
//
// The generated projections must reproduce the pre-cutover runtime EXACTLY.
// Not "compatibly", not "modulo known differences" — exactly.
//
// ── Why a fixture and not the runtime files ────────────────────────────────
//
// Stage 3 compared the generated projections with the hand-authored
// `src/data/modules.js`, `src/chapters.js` and
// `src/content/chapterContentRegistry.js`. Stage 4 made those three files
// re-export the generated projections — so importing them here would now
// compare the generated files with themselves. The gate would be green by
// construction and would prove nothing.
//
// So the comparison moved off the runtime and onto
// `tests/fixtures/curriculum-runtime-v1.json`: a frozen, semantic capture of
// what those three files meant BEFORE the cutover, taken while they were still
// hand-authored. It is the independent side of the comparison, and it stays
// independent after Stage 4 because nothing regenerates it from the runtime.
//
// Comparison is SEMANTIC, on data rather than on source text: a formatting
// change must not read as a behaviour change, and a behaviour change must not
// hide behind formatting. Key ORDER is deliberately not compared — the
// pre-cutover file used five different key orders across its 60 rows — but the
// key SET, the key ABSENCES and every value are.
//
// Nothing here silently allows a difference. There is no allowlist.

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { createHash } from 'crypto'
import { resolve, dirname, posix } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import { loadCompatibility } from '../../src/curriculum-catalogue/compatibility/index.js'
import {
  buildProjections,
  renderModules,
  renderChapters,
  renderLoaders,
  renderScreenTagReport,
  assertInputPurity,
  generate,
  generateReport,
  MODULES_PATH,
  CHAPTERS_PATH,
  LOADERS_PATH,
  REPORT_PATH,
  FROZEN_RUNTIME_FIXTURE,
  RUNTIME_BOUNDARY_FILES,
} from '../../scripts/generate-curriculum-projections.mjs'

// The generated projections — the thing under test.
import * as generatedModules from '../../src/data/generated/curriculum/modules.js'
import * as generatedChapters from '../../src/data/generated/curriculum/chapters.js'
import * as generatedLoaders from '../../src/data/generated/curriculum/chapterContentLoaders.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

/**
 * The frozen contract's checksum, pinned here rather than inside the fixture.
 *
 * A contract that could validate itself is not a contract. Pinning the digest
 * in a different file means editing the fixture fails until this line is
 * edited too — so a contract change is always two deliberate edits and is
 * always visible in the diff, and can never be a quiet way to make a failing
 * parity assertion pass.
 */
const FIXTURE_SHA256 = '4a9114d841ef84326001528dfb7438b00a3fce2f207736a84ad283044ff2c1c2'

/** The commit whose runtime the fixture froze. */
const FIXTURE_PROVENANCE_COMMIT = '7621d5569e4b97527097d144684a0f56b4fec62c'

const fixtureBytes = readFileSync(resolve(root, FROZEN_RUNTIME_FIXTURE))
const fixture = JSON.parse(fixtureBytes)

const catalogue = await loadCatalogue()
const compatibility = loadCompatibility()
const projections = await buildProjections(catalogue, compatibility)

const keysOf = record => Object.keys(record).sort()

// ─── The frozen contract is intact, independent and test-only ───────────────

describe('the frozen runtime contract', () => {
  it('is byte-for-byte what it was frozen as', () => {
    expect(createHash('sha256').update(fixtureBytes).digest('hex')).toBe(FIXTURE_SHA256)
  })

  it('records the exact runtime it was captured from', () => {
    expect(fixture.contract.provenance.commit).toBe(FIXTURE_PROVENANCE_COMMIT)
    expect(fixture.contract.provenance.capturedFrom).toEqual(RUNTIME_BOUNDARY_FILES)
    expect(fixture.contract.provenance.capturedWhen).toMatch(/still hand-authored/)
  })

  it('says plainly that it is not authority, and when it is deleted', () => {
    expect(fixture.contract.authority).toMatch(/NOT authority/)
    expect(fixture.contract.authority).toMatch(/test-only/)
    expect(fixture.contract.retirement).toMatch(/Stage 6/)
    expect(fixture.contract.retirement).toMatch(/compatibility\//)
    expect(fixture.contract.editing).toMatch(/never a way to make a failing parity test pass/)
  })

  it('is never read by production source or by the generator', () => {
    // Anchored to a real read, not to any mention: the generator names the
    // fixture in order to forbid it, and the generated banner names it to say
    // what checks it. Naming is not reading.
    const reads = /(?:from\s*|import\s*\(?\s*|readFileSync\s*\(\s*)['"][^'"]*(?:curriculum-runtime-v1\.json|tests\/fixtures\/)/
    const offenders = [...listFiles('src'), ...listFiles('scripts')]
      .filter(file => reads.test(read(file)))
    expect(offenders, 'the frozen contract is test-only').toEqual([])
    expect(assertInputPurity(`readFileSync('${FROZEN_RUNTIME_FIXTURE}')`).join(' '))
      .toMatch(/frozen runtime fixture is never a generator input/)
  })

  it('holds the whole pre-cutover interface, not a sample of it', () => {
    expect(fixture.modules).toHaveLength(7)
    expect(fixture.chapters).toHaveLength(60)
    expect(fixture.loaders).toHaveLength(60)
    expect(Object.keys(fixture.exports).sort()).toEqual([...RUNTIME_BOUNDARY_FILES].sort())
    // Field ABSENCE is part of the contract, so the absences are counted here
    // as well as compared row by row below.
    expect(fixture.chapters.filter(chapter => 'series' in chapter)).toHaveLength(39)
    expect(fixture.chapters.filter(chapter => 'tags' in chapter)).toHaveLength(16)
    expect(fixture.chapters.filter(chapter => 'availability' in chapter).map(chapter => chapter.id))
      .toEqual(['history-medicine-renaissance-medicine'])
    expect(fixture.helpers.availableChapterCount).toBe(30)
  })
})

// ─── MODULES ────────────────────────────────────────────────────────────────

describe('MODULES parity', () => {
  it('projects the same seven ids, in the same order', () => {
    expect(generatedModules.MODULES.map(module => module.id)).toEqual(fixture.modules.map(module => module.id))
    expect(generatedModules.MODULES).toHaveLength(7)
  })

  it('projects the same title and subject for every module', () => {
    for (const [index, expected] of fixture.modules.entries()) {
      const actual = generatedModules.MODULES[index]
      expect(actual.title, `${expected.id}.title`).toBe(expected.title)
      expect(actual.subject, `${expected.id}.subject`).toBe(expected.subject)
    }
  })

  it('projects the same chapter ids, in the same order, for every module', () => {
    for (const [index, expected] of fixture.modules.entries()) {
      const actual = generatedModules.MODULES[index]
      expect(actual.chapterIds, `${expected.id}.chapterIds`).toEqual(expected.chapterIds)
    }
  })

  it('projects the same field set — no extra field, no missing field', () => {
    for (const [index, expected] of fixture.modules.entries()) {
      expect(keysOf(generatedModules.MODULES[index]), `${expected.id} fields`).toEqual(keysOf(expected))
    }
  })

  it('is deeply equal as a whole, so nothing above can pass by omission', () => {
    expect(generatedModules.MODULES).toEqual(fixture.modules)
  })

  it('reproduces getModuleById for every id, and for an unknown one', () => {
    for (const [moduleId, expectedId] of Object.entries(fixture.helpers.getModuleById)) {
      const actual = generatedModules.getModuleById(moduleId)
      expect(actual?.id ?? null, `getModuleById("${moduleId}")`).toBe(expectedId)
      if (expectedId === null) continue
      // Not just the id: the whole row the pre-cutover function would have returned.
      expect(actual).toEqual(fixture.modules.find(module => module.id === expectedId))
    }
    expect(generatedModules.getModuleById('nothing-like-this')).toBeNull()
  })

  it('reproduces getModuleForChapter for every runtime chapter, including the hidden one', () => {
    for (const [chapterId, expectedId] of Object.entries(fixture.helpers.getModuleForChapter)) {
      expect(generatedModules.getModuleForChapter(chapterId)?.id ?? null, chapterId).toBe(expectedId)
    }
    // The hidden Renaissance row belongs to no module, then or now.
    expect(fixture.helpers.getModuleForChapter['history-medicine-renaissance-medicine']).toBeNull()
    expect(generatedModules.getModuleForChapter('history-medicine-renaissance-medicine')).toBeNull()
    expect(generatedModules.getModuleForChapter('nothing-like-this')).toBeNull()
  })

  it('exports the same public symbols as the pre-cutover file', () => {
    expect(Object.keys(generatedModules).sort()).toEqual(fixture.exports['src/data/modules.js'])
  })
})

// ─── CHAPTERS ───────────────────────────────────────────────────────────────

describe('CHAPTERS parity', () => {
  it('projects all 60 rows, with the same ids in the same order', () => {
    expect(generatedChapters.CHAPTERS).toHaveLength(60)
    expect(generatedChapters.CHAPTERS.map(chapter => chapter.id)).toEqual(fixture.chapters.map(chapter => chapter.id))
  })

  it('projects the same field set for every row — including which rows omit series and tags', () => {
    for (const [index, expected] of fixture.chapters.entries()) {
      expect(keysOf(generatedChapters.CHAPTERS[index]), `${expected.id} fields`).toEqual(keysOf(expected))
    }
    // The absences are load-bearing: `getChapterAvailability` reads
    // `chapter.availability` only when the key is present.
    const withAvailability = generatedChapters.CHAPTERS.filter(chapter => 'availability' in chapter)
    expect(withAvailability.map(chapter => chapter.id)).toEqual(['history-medicine-renaissance-medicine'])
    expect(generatedChapters.CHAPTERS.filter(chapter => 'series' in chapter)).toHaveLength(39)
    expect(generatedChapters.CHAPTERS.filter(chapter => 'tags' in chapter)).toHaveLength(16)
  })

  it('projects every enumerable field value identically, field by field', () => {
    const differences = []
    for (const [index, expected] of fixture.chapters.entries()) {
      const actual = generatedChapters.CHAPTERS[index]
      for (const key of new Set([...Object.keys(expected), ...Object.keys(actual)])) {
        if (JSON.stringify(actual[key]) !== JSON.stringify(expected[key])) {
          differences.push(`${expected.id}.${key}: ${JSON.stringify(actual[key])} !== ${JSON.stringify(expected[key])}`)
        }
      }
    }
    expect(differences).toEqual([])
  })

  it('projects the hidden Renaissance row, at its exact position and marked hidden', () => {
    const index = generatedChapters.CHAPTERS.findIndex(chapter => chapter.id === 'history-medicine-renaissance-medicine')
    expect(index).toBe(fixture.chapters.findIndex(chapter => chapter.id === 'history-medicine-renaissance-medicine'))
    expect(index).toBe(2)
    const row = generatedChapters.CHAPTERS[index]
    expect(row.availability).toBe('hidden')
    expect(row).toEqual(fixture.chapters[index])
    // It is projected from compatibility data — nothing canonical claims it.
    expect(catalogue.chapters.map(chapter => chapter.id)).not.toContain(row.id)
  })

  it('projects the same availability for every row, through the same function', () => {
    for (const [index, expected] of fixture.chapters.entries()) {
      const actual = generatedChapters.CHAPTERS[index]
      expect(generatedChapters.getChapterAvailability(actual), `${expected.id} availability`)
        .toBe(fixture.helpers.getChapterAvailability[expected.id])
      expect(generatedChapters.isChapterAvailable(actual), `${expected.id} openable`)
        .toBe(fixture.helpers.isChapterAvailable[expected.id])
    }
    expect(generatedChapters.CHAPTER_AVAILABILITY).toEqual(fixture.chapterAvailability)
    expect(generatedChapters.getChapterAvailability(null)).toBe(fixture.helpers.getChapterAvailabilityOfNull)
    expect(generatedChapters.getChapterAvailability(null)).toBe(generatedChapters.CHAPTER_AVAILABILITY.HIDDEN)
    // 30 available; the count is asserted so a silent shift fails here.
    expect(generatedChapters.CHAPTERS.filter(generatedChapters.isChapterAvailable))
      .toHaveLength(fixture.helpers.availableChapterCount)
    expect(generatedChapters.CHAPTERS
      .filter(chapter => generatedChapters.getChapterAvailability(chapter) === 'hidden')
      .map(chapter => chapter.id)).toEqual(fixture.helpers.hiddenChapterIds)
  })

  it('derives screenCount from the content file and matches all 60 rows', () => {
    for (const [index, expected] of fixture.chapters.entries()) {
      expect(generatedChapters.CHAPTERS[index].screenCount, `${expected.id}.screenCount`)
        .toBe(expected.screenCount)
    }
  })

  it('derives screenTags from the content file and matches all 60 rows, nulls included', () => {
    for (const [index, expected] of fixture.chapters.entries()) {
      const actual = generatedChapters.CHAPTERS[index].screenTags
      expect(actual, `${expected.id}.screenTags`).toEqual(expected.screenTags)
      expect(actual.length, `${expected.id} screenTags length`).toBe(expected.screenCount)
    }
  })

  it('projects the same presentation and tag values — colour, icon, imagery, tags', () => {
    for (const [index, expected] of fixture.chapters.entries()) {
      const actual = generatedChapters.CHAPTERS[index]
      for (const key of ['color', 'colorLight', 'icon', 'headerImage', 'number', 'series', 'tags']) {
        expect(actual[key], `${expected.id}.${key}`).toEqual(expected[key])
      }
    }
  })

  it('is deeply equal as a whole', () => {
    expect(generatedChapters.CHAPTERS).toEqual(fixture.chapters)
  })

  it('exports the same public symbols as the pre-cutover file', () => {
    expect(Object.keys(generatedChapters).sort()).toEqual(fixture.exports['src/chapters.js'])
  })

  it('keeps the six new English chapters out of the projection, and in the catalogue', () => {
    const projected = new Set(generatedChapters.CHAPTERS.map(chapter => chapter.id))
    for (const id of compatibility.excludedChapterIds) {
      expect(projected.has(id), `${id} entered the projection`).toBe(false)
      expect(catalogue.chapters.some(chapter => chapter.id === id), `${id} left the catalogue`).toBe(true)
    }
    expect(compatibility.excludedChapterIds).toHaveLength(6)
    // 65 canonical − 6 excluded + 1 hidden compatibility row = 60.
    expect(catalogue.chapters.length - compatibility.excludedChapterIds.length + 1).toBe(60)
  })
})

// ─── CHAPTER_CONTENT_LOADERS ────────────────────────────────────────────────

describe('CHAPTER_CONTENT_LOADERS parity', () => {
  const generatedKeys = Object.keys(generatedLoaders.CHAPTER_CONTENT_LOADERS)
  const frozenKeys = fixture.loaders.map(loader => loader.id)

  it('projects exactly 60 keys, in the same order', () => {
    expect(generatedKeys).toHaveLength(60)
    expect(generatedKeys).toEqual(frozenKeys)
  })

  it('projects the same dynamic import target for every key', () => {
    // Read from source: an import specifier is not observable at runtime.
    //
    // Compared as NORMALISED project-relative targets, not as literal strings.
    // The frozen registry sat in `src/content/` and wrote `./history/…`; the
    // generated file sits in `src/data/generated/curriculum/`, so the same
    // target is spelled `../../../content/history/…`. Demanding identical text
    // would demand a specifier that resolves to nothing from the generated
    // file's location.
    const base = dirname(resolve(root, LOADERS_PATH))
    const actual = new Map()
    const pattern = /["']?([\w-]+)["']?\s*:\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)/g
    for (const [, id, specifier] of read(LOADERS_PATH).matchAll(pattern)) {
      actual.set(id, posix.relative(root, resolve(base, specifier)))
    }
    expect(actual.size).toBe(60)
    for (const { id, contentPath } of fixture.loaders) {
      expect(actual.get(id), `loader ${id} import target`).toBe(contentPath)
      expect(existsSync(resolve(root, contentPath)), `loader ${id} target does not exist`).toBe(true)
    }
  })

  it('spells every target relative to the generated file, so the re-export resolves', () => {
    const source = read(LOADERS_PATH)
    const specifiers = [...source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map(match => match[1])
    expect(specifiers).toHaveLength(60)
    for (const specifier of specifiers) {
      expect(specifier, `"${specifier}" is not rebased`).toMatch(/^\.\.\/\.\.\/\.\.\/content\//)
    }
  })

  it('resolves every loader to the content module the frozen contract names', async () => {
    for (const { id, contentPath } of fixture.loaders) {
      const [fromProjection, direct] = await Promise.all([
        generatedLoaders.loadChapterContent(id),
        import(pathToFileURL(resolve(root, contentPath)).href),
      ])
      // Same module instance: the loader and the frozen path name the same
      // file, so the module registry hands back one object. Identity is the
      // strongest available proof that the import targets agree.
      expect(fromProjection, `loader ${id}`).toBe(direct.default)
      expect(fromProjection, `loader ${id} resolved nothing`).toBeTruthy()
    }
  })

  it('binds 59 loaders from canonical chapter records and one from compatibility', () => {
    const canonicalBound = catalogue.chapters.filter(chapter => chapter.contentPath !== null)
    expect(canonicalBound).toHaveLength(59)
    const canonicalIds = new Set(canonicalBound.map(chapter => chapter.id))
    const fromCanonical = generatedKeys.filter(id => canonicalIds.has(id))
    const fromCompatibility = generatedKeys.filter(id => !canonicalIds.has(id))
    expect(fromCanonical).toHaveLength(59)
    expect(fromCompatibility).toEqual([compatibility.hiddenChapter.row.id])
  })

  it('generates no loader for the six new English chapters', () => {
    for (const id of compatibility.excludedChapterIds) {
      expect(generatedKeys, `${id} gained a loader`).not.toContain(id)
      const record = catalogue.chapters.find(chapter => chapter.id === id)
      expect(record.contentPath, `${id} has content`).toBeNull()
    }
  })

  it('returns null for an unknown id, like the pre-cutover registry did', async () => {
    expect(await generatedLoaders.loadChapterContent('nothing-like-this')).toBeNull()
  })

  it('exports the same public symbols as the pre-cutover file', () => {
    expect(Object.keys(generatedLoaders).sort())
      .toEqual(fixture.exports['src/content/chapterContentRegistry.js'])
  })
})

// ─── The gate fails when it should ──────────────────────────────────────────
//
// A parity test that only ever compares two identical things proves the two
// things are identical, not that the comparison would notice if they were not.
// Each case below mutates the projection input by one fact and asserts the
// output stops matching the frozen contract — so a real regression could not
// slip past.

describe('the parity gate detects a difference', () => {
  const rebuild = overrides => buildProjections(catalogue, { ...compatibility, ...overrides })

  it('notices an extra runtime module', async () => {
    const built = await rebuild({
      legacyModules: [...compatibility.legacyModules,
        { id: 'extra_module', title: 'Extra', canonicalModuleIds: ['english-lit-aqa-inspector-calls'] }],
    })
    expect(built.modules).toHaveLength(8)
    expect(built.modules).not.toEqual(fixture.modules)
  })

  it('notices a missing runtime module', async () => {
    const built = await rebuild({ legacyModules: compatibility.legacyModules.slice(1) })
    expect(built.modules).toHaveLength(6)
    expect(built.modules.map(module => module.id)).not.toEqual(fixture.modules.map(module => module.id))
  })

  it('notices a changed module title', async () => {
    const built = await rebuild({
      legacyModules: compatibility.legacyModules.map(legacy =>
        legacy.id === 'maths_core' ? { ...legacy, title: 'Maths' } : legacy),
    })
    expect(built.modules).not.toEqual(fixture.modules)
    expect(built.modules.find(module => module.id === 'maths_core').title).toBe('Maths')
  })

  it('notices a missing runtime chapter', async () => {
    const built = await rebuild({ chapterOrder: compatibility.chapterOrder.slice(0, 59) })
    expect(built.chapters).toHaveLength(59)
    expect(built.chapters.map(chapter => chapter.id)).not.toEqual(fixture.chapters.map(chapter => chapter.id))
  })

  it('notices changed chapter ordering', async () => {
    const reordered = [...compatibility.chapterOrder]
    ;[reordered[0], reordered[1]] = [reordered[1], reordered[0]]
    const built = await rebuild({ chapterOrder: reordered })
    expect(built.chapters.map(chapter => chapter.id)).not.toEqual(fixture.chapters.map(chapter => chapter.id))
    // Same set, different order — the kind of difference a set comparison misses.
    expect([...built.chapters.map(chapter => chapter.id)].sort())
      .toEqual([...fixture.chapters.map(chapter => chapter.id)].sort())
  })

  it('notices a changed legacy-only chapter field', async () => {
    const built = await rebuild({
      chapterFields: {
        ...compatibility.chapterFields,
        soc1: { ...compatibility.chapterFields.soc1, color: '#000000' },
      },
    })
    expect(built.chapters).not.toEqual(fixture.chapters)
    expect(built.chapters.find(chapter => chapter.id === 'soc1').color).toBe('#000000')
  })

  it('notices a chapter field that stopped being absent', async () => {
    // Absence is contract. `series` is absent on 21 rows, and a row that gained
    // it would render an extra label the pre-cutover runtime never printed.
    const gained = fixture.chapters.find(chapter => !('series' in chapter))
    const built = await rebuild({
      chapterFields: {
        ...compatibility.chapterFields,
        [gained.id]: { ...compatibility.chapterFields[gained.id], series: 'invented' },
      },
    })
    const row = built.chapters.find(chapter => chapter.id === gained.id)
    expect('series' in row).toBe(true)
    expect(Object.keys(row).sort()).not.toEqual(Object.keys(gained).sort())
    expect(built.chapters).not.toEqual(fixture.chapters)
  })

  it('notices a chapter that stopped being excluded', async () => {
    const built = await rebuild({ excludedChapterIds: [] })
    const macbeth = built.modules.find(module => module.id === 'eng_macbeth')
    expect(macbeth.chapterIds).toHaveLength(4)
    expect(macbeth.chapterIds)
      .not.toEqual(fixture.modules.find(module => module.id === 'eng_macbeth').chapterIds)
  })

  it('notices a changed loader target', async () => {
    const poisoned = {
      ...compatibility,
      hiddenChapter: { ...compatibility.hiddenChapter, contentPath: 'src/content/sociology/families/episodes/soc1.js' },
    }
    const built = await buildProjections(catalogue, poisoned)
    const hidden = built.loaders.find(loader => loader.id === compatibility.hiddenChapter.row.id)
    expect(hidden.importPath).toBe('../../../content/sociology/families/episodes/soc1.js')
    // …and it no longer matches the target the frozen contract names.
    const frozen = fixture.loaders.find(loader => loader.id === compatibility.hiddenChapter.row.id)
    expect(posix.relative(root, resolve(dirname(resolve(root, LOADERS_PATH)), hidden.importPath)))
      .not.toBe(frozen.contentPath)
    expect(read(LOADERS_PATH)).not.toContain(`"${compatibility.hiddenChapter.row.id}": () => import("${hidden.importPath}")`)
  })

  it('notices changed loader ordering', async () => {
    const anchors = [...compatibility.loaderSectionAnchors].reverse()
    const built = await rebuild({ loaderSectionAnchors: anchors })
    expect(built.loaders.map(loader => loader.id)).not.toEqual(fixture.loaders.map(loader => loader.id))
    expect([...built.loaders.map(loader => loader.id)].sort())
      .toEqual([...fixture.loaders.map(loader => loader.id)].sort())
  })

  it('throws rather than projecting a chapter with no content path', async () => {
    await expect(rebuild({
      chapterOrder: [...compatibility.chapterOrder, 'english-macbeth-witches-fate'],
      chapterFields: {
        ...compatibility.chapterFields,
        'english-macbeth-witches-fate': { number: 2, color: '#B84A3A', colorLight: 'rgba(184,74,58,.14)' },
      },
      excludedChapterIds: compatibility.excludedChapterIds.filter(id => id !== 'english-macbeth-witches-fate'),
    })).rejects.toThrow(/cannot have a loader/)
  })

  it('throws when a legacy aggregation names a module the catalogue does not have', async () => {
    await expect(rebuild({
      legacyModules: compatibility.legacyModules.map(legacy =>
        legacy.id === 'maths_core' ? { ...legacy, canonicalModuleIds: ['maths-aqa-imaginary'] } : legacy),
    })).rejects.toThrow(/unknown module/)
  })
})

// ─── Generator governance ───────────────────────────────────────────────────

describe('the projections generator is governed', () => {
  it('writes exactly the three declared files', async () => {
    expect(Object.keys(await generate())).toEqual([MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH])
  })

  it('is byte-identical to a fresh render, for all three files', async () => {
    const documents = await generate()
    for (const [path, generated] of Object.entries(documents)) {
      expect(generated, `${path} has drifted`).toBe(read(path))
    }
  })

  it('is deterministic — the same inputs always render the same bytes', async () => {
    expect(renderModules(projections.modules)).toBe(renderModules(projections.modules))
    expect(renderChapters(projections.chapters)).toBe(renderChapters(projections.chapters))
    expect(renderLoaders(projections.loaders)).toBe(renderLoaders(projections.loaders))
    const rebuilt = await buildProjections(catalogue, compatibility)
    expect(renderChapters(rebuilt.chapters)).toBe(renderChapters(projections.chapters))
  })

  it('carries the generated-file banner on all three files', () => {
    for (const path of [MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH]) {
      expect(read(path), `${path} has no banner`).toContain('GENERATED FILE — DO NOT EDIT')
    }
  })

  it('never reads .planning/**, the frozen fixture, or a runtime boundary file', () => {
    expect(assertInputPurity()).toEqual([])
    // …and the guard fires on the three things it exists to catch.
    expect(assertInputPurity("import { CHAPTERS } from '../src/chapters.js'").join(' '))
      .toMatch(/runtime boundary file is never a generator input/)
    expect(assertInputPurity("readFileSync('.planning/phase-5-curriculum-architecture/DESIGN.md')").join(' '))
      .toMatch(/\.planning\/\*\* is never a generator input/)
    expect(assertInputPurity(`import fixture from '../${FROZEN_RUNTIME_FIXTURE}'`).join(' '))
      .toMatch(/frozen runtime fixture is never a generator input/)
    // A generated re-export is not the hand-authored file.
    expect(assertInputPurity("import x from '../src/data/generated/curriculum/chapters.js'")).toEqual([])
  })

  it('names the three boundary files, and none of them is a generated file', () => {
    expect(RUNTIME_BOUNDARY_FILES).toEqual([
      'src/data/modules.js', 'src/chapters.js', 'src/content/chapterContentRegistry.js',
    ])
    for (const file of RUNTIME_BOUNDARY_FILES) {
      // They re-export generated output; they are not themselves generated, so
      // the banner must not appear and `--check` must never rewrite them.
      expect(read(file), `${file} became generated`).not.toContain('GENERATED FILE')
    }
  })

  it('says in the banner what it is checked against, and no longer claims a hand-authored runtime', () => {
    for (const path of [MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH]) {
      const banner = read(path).split('\n').filter(line => line.startsWith('//')).join('\n')
      expect(banner, `${path} does not name the frozen contract`).toContain(FROZEN_RUNTIME_FIXTURE)
      expect(banner, `${path} still claims a hand-authored runtime`)
        .not.toMatch(/matching the hand-authored runtime/)
      // …and it says which files re-export it, so the boundary is discoverable
      // from the generated file itself.
      for (const file of RUNTIME_BOUNDARY_FILES) {
        expect(banner, `${path} does not name ${file}`).toContain(file)
      }
    }
  })

  it('declares both commands, and wires the check into pnpm verify', () => {
    const { scripts } = JSON.parse(read('package.json'))
    expect(scripts['curriculum:projections:generate']).toBe('node scripts/generate-curriculum-projections.mjs')
    expect(scripts['curriculum:projections:check']).toBe('node scripts/generate-curriculum-projections.mjs --check')
    expect(scripts.verify).toContain('pnpm curriculum:projections:check')
    // Immediately after curriculum:check — it is a generator check and belongs
    // with the other generator checks, ahead of anything consuming their output.
    expect(scripts.verify).toContain('pnpm curriculum:check && pnpm curriculum:projections:check')
  })
})

// ─── The generated files stay out of the runtime ────────────────────────────

function listFiles(dir) {
  const out = []
  const absolute = resolve(root, dir)
  if (!existsSync(absolute)) return out
  for (const name of readdirSync(absolute)) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) { out.push(...listFiles(rel)); continue }
    if (name.endsWith('.stories.jsx') || /\.(test|spec)\.jsx?$/.test(name)) continue
    if (!/\.m?jsx?$/.test(name)) continue
    out.push(rel)
  }
  return out
}

// ─── The Stage 4 authority boundary ─────────────────────────────────────────
//
// The cutover is three files wide and has to stay three files wide. Everything
// below is about the SHAPE of that boundary, not about the data crossing it:
// who may import the generated projections, what the three files are allowed to
// contain, and whether reverting them restores exactly the authority the
// repository had before.

describe('the Stage 4 authority boundary', () => {
  const REACHES_RUNTIME_GENERATED = /(?:from\s*|import\s*\(?\s*)['"][^'"]*generated\/curriculum\/(?:modules|chapters|chapterContentLoaders)\.js/

  it('is exactly three files wide — only the boundary files import the runtime projections', () => {
    const importers = listFiles('src')
      .filter(file => !file.startsWith('src/data/generated/curriculum/'))
      .filter(file => REACHES_RUNTIME_GENERATED.test(read(file)))
    expect(importers.sort(), 'a fourth file reached a Stage 4 runtime projection')
      .toEqual([...RUNTIME_BOUNDARY_FILES].sort())
  })

  it('makes each boundary file a thin re-export and nothing else', () => {
    const expected = {
      'src/data/modules.js': {
        specifier: './generated/curriculum/modules.js',
        symbols: ['MODULES', 'getModuleById', 'getModuleForChapter'],
      },
      'src/chapters.js': {
        specifier: './data/generated/curriculum/chapters.js',
        symbols: ['CHAPTERS', 'CHAPTER_AVAILABILITY', 'getChapterAvailability', 'isChapterAvailable'],
      },
      'src/content/chapterContentRegistry.js': {
        specifier: '../data/generated/curriculum/chapterContentLoaders.js',
        symbols: ['CHAPTER_CONTENT_LOADERS', 'loadChapterContent'],
      },
    }
    for (const [file, { specifier, symbols }] of Object.entries(expected)) {
      const source = read(file)
      const code = source.split('\n').filter(line => !line.trimStart().startsWith('//')).join('\n').trim()
      // One statement: `export { … } from '…'`. Nothing else survives.
      const match = code.match(/^export\s*\{([^}]*)\}\s*from\s*'([^']+)'$/)
      expect(match, `${file} is not a single re-export statement:\n${code}`).toBeTruthy()
      expect(match[2], `${file} re-exports the wrong file`).toBe(specifier)
      expect(match[1].split(',').map(name => name.trim()).filter(Boolean).sort(), `${file} symbols`)
        .toEqual([...symbols].sort())
      // …and the specifier resolves from this file's own directory.
      expect(existsSync(resolve(root, dirname(file), specifier)), `${file} specifier does not resolve`).toBe(true)
    }
  })

  it('leaves no authored Module, Chapter or loader entry in the boundary files', () => {
    for (const file of RUNTIME_BOUNDARY_FILES) {
      const code = read(file).split('\n').filter(line => !line.trimStart().startsWith('//')).join('\n')
      expect(code, `${file} still declares data`).not.toMatch(/\bconst\s+(MODULES|CHAPTERS|CHAPTER_CONTENT_LOADERS|CHAPTER_AVAILABILITY)\b/)
      expect(code, `${file} still declares a helper body`).not.toMatch(/\bfunction\s+\w+/)
      expect(code, `${file} still holds an authored loader`).not.toMatch(/=>\s*import\(/)
      expect(code, `${file} still holds an authored row`).not.toMatch(/\bscreenTags\s*:/)
    }
  })

  it('hands live consumers to the canonical learner boundary without direct generated imports', () => {
    const consumers = [
      'src/progress.js',
      'src/todaysPlan.js',
      'src/app/LegacyApp.jsx',
      'src/app/chapterNavigation.js',
      'src/features/progress/Progress.jsx',
      'src/features/subjects/subjectNavigationAdapter.js',
      'src/features/planner/dailyPlanner.js',
      'src/components/layout/ChapterPlayer.jsx',
      'src/components/layout/ChapterCompleteScreen.jsx',
    ]
    for (const consumer of consumers) {
      const source = read(consumer)
      expect(source, `${consumer} did not migrate to the canonical learner boundary`)
        .toMatch(/from\s*['"][^'"]*learnerCurriculum\.js['"]/)
      expect(REACHES_RUNTIME_GENERATED.test(source), `${consumer} imports generated output directly`).toBe(false)
    }
  })

  it('is revertible — the three files are the whole of the change', () => {
    // Reverting them restores the previous authority boundary because nothing
    // else references the generated directory, and because the generated files
    // remain self-contained: they import content, never the catalogue.
    const importers = listFiles('src')
      .filter(file => !file.startsWith('src/data/generated/curriculum/'))
      .filter(file => !RUNTIME_BOUNDARY_FILES.includes(file))
      .filter(file => REACHES_RUNTIME_GENERATED.test(read(file)))
    expect(importers, 'reverting the three files would not undo the cutover').toEqual([])
    for (const path of [MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH]) {
      expect(read(path), `${path} imports a boundary file back`)
        .not.toMatch(/(?:from\s*|import\s*\(?\s*)['"][^'"]*(?:data\/modules|\.\.\/chapters|chapterContentRegistry)\.js['"]/)
    }
  })

  it('the generated projections import no catalogue and no compatibility data', () => {
    for (const path of [MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH]) {
      const source = read(path)
      // Code only — the banner is prose about what this file is, and prose
      // saying "import path" is not an import.
      const code = source.split('\n').filter(line => !line.trimStart().startsWith('//')).join('\n')
      expect(code, `${path} imports the catalogue`).not.toMatch(/(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue/)
      // The loaders file imports content; the other two import nothing at all.
      if (path !== LOADERS_PATH) expect(code, `${path} imports something`).not.toMatch(/\bimport\b/)
    }
  })

  it('catalogue imports never enter production source', () => {
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\//
    const importers = listFiles('src')
      .filter(file => !file.startsWith('src/curriculum-catalogue/'))
      .filter(file => reaches.test(read(file)))
    expect(importers).toEqual([])
  })

  it('compatibility data reaches production only through the generated output', async () => {
    // Two legacy-only facts that no canonical record states: the hidden
    // Renaissance row and a per-row palette override. Both are live in the
    // running app, and the only path they can have taken is the generated
    // projection — production imports neither `compatibility/` nor the
    // catalogue, proved above.
    const runtimeChapters = await import('../../src/chapters.js')
    const hidden = runtimeChapters.CHAPTERS.find(chapter => chapter.id === compatibility.hiddenChapter.row.id)
    expect(hidden, 'the compatibility-only hidden row did not reach the runtime').toBeTruthy()
    expect(hidden.availability).toBe('hidden')
    expect(runtimeChapters.CHAPTERS.find(chapter => chapter.id === 'soc1').color)
      .toBe(compatibility.chapterFields.soc1.color)
  })

  it('the generated loader specifiers resolve from the generated file, not from the boundary file', async () => {
    // The two live in different directories. A specifier copied verbatim from
    // the pre-cutover registry would resolve to nothing from here, and the
    // re-export would break on the first chapter open.
    const base = dirname(resolve(root, LOADERS_PATH))
    const specifiers = [...read(LOADERS_PATH).matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map(match => match[1])
    expect(specifiers).toHaveLength(60)
    for (const specifier of specifiers) {
      expect(existsSync(resolve(base, specifier)), `"${specifier}" does not resolve from the generated file`).toBe(true)
      expect(existsSync(resolve(root, 'src/content', specifier)), `"${specifier}" resolves from the old registry location`)
        .toBe(false)
    }
    // And the re-export really loads a chapter.
    const registry = await import('../../src/content/chapterContentRegistry.js')
    expect(await registry.loadChapterContent('soc1')).toBeTruthy()
  })
})

// ─── The screenTags review artefact ─────────────────────────────────────────

describe('the screenTags report is a review artefact, not a correction', () => {
  it('is byte-identical to a fresh render', async () => {
    const documents = await generateReport()
    expect(documents[REPORT_PATH]).toBe(read(REPORT_PATH))
  })

  it('changes no projected value — every screenTags array still equals the frozen contract', () => {
    renderScreenTagReport(projections.chapters)
    for (const [index, expected] of fixture.chapters.entries()) {
      expect(generatedChapters.CHAPTERS[index].screenTags, `${expected.id}`).toEqual(expected.screenTags)
    }
  })

  it('says plainly that it changes nothing and why', () => {
    const report = read(REPORT_PATH)
    expect(report).toContain('GENERATED FILE — do not edit')
    expect(report).toContain('**This report changes nothing.**')
    expect(report).toMatch(/Topic\/recovery migration/)
  })

  it('reports the four review categories', () => {
    const report = read(REPORT_PATH)
    expect(report).toContain('## 1. Chapters with content but no recovery route')
    expect(report).toContain('## 2. Tags claimed by more than one chapter')
    expect(report).toContain('## 3. Tags repeated within one chapter')
    expect(report).toContain('## 4. Vocabulary split')
  })

  it('finds something — an empty report would mean the analysis is not running', () => {
    const report = renderScreenTagReport(projections.chapters)
    expect(report).not.toBe(renderScreenTagReport([]))
    expect((report.match(/^_None\._$/gm) ?? []).length).toBeLessThan(4)
  })
})
