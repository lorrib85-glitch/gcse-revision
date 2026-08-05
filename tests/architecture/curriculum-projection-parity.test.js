// ─── Stage 3 exact parity gate ──────────────────────────────────────────────
//
// The generated projections must reproduce the hand-authored runtime EXACTLY.
// Not "compatibly", not "modulo known differences" — exactly. Stage 3's entire
// promise is that nothing a learner can observe changes, and Stage 4 is only
// safe to take because this file is green.
//
// Comparison is SEMANTIC, on data rather than on source text: a formatting
// change must not read as a behaviour change, and a behaviour change must not
// hide behind formatting. Key ORDER is deliberately not compared — the
// hand-authored file uses five different key orders across its 60 rows — but
// the key SET and every value are.
//
// Nothing here silently allows a difference. There is no allowlist.

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, posix } from 'path'
import { fileURLToPath } from 'url'

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
  HANDWRITTEN_RUNTIME_FILES,
} from '../../scripts/generate-curriculum-projections.mjs'

// The hand-authored runtime — the thing being reproduced.
import { MODULES, getModuleById, getModuleForChapter } from '../../src/data/modules.js'
import {
  CHAPTERS,
  CHAPTER_AVAILABILITY,
  getChapterAvailability,
  isChapterAvailable,
} from '../../src/chapters.js'
import { CHAPTER_CONTENT_LOADERS, loadChapterContent } from '../../src/content/chapterContentRegistry.js'

// The generated projections.
import * as generatedModules from '../../src/data/generated/curriculum/modules.js'
import * as generatedChapters from '../../src/data/generated/curriculum/chapters.js'
import * as generatedLoaders from '../../src/data/generated/curriculum/chapterContentLoaders.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

const catalogue = await loadCatalogue()
const compatibility = loadCompatibility()
const projections = await buildProjections(catalogue, compatibility)

const keysOf = record => Object.keys(record).sort()

// ─── MODULES ────────────────────────────────────────────────────────────────

describe('MODULES parity', () => {
  it('projects the same seven ids, in the same order', () => {
    expect(generatedModules.MODULES.map(module => module.id)).toEqual(MODULES.map(module => module.id))
    expect(generatedModules.MODULES).toHaveLength(7)
  })

  it('projects the same title and subject for every module', () => {
    for (const [index, expected] of MODULES.entries()) {
      const actual = generatedModules.MODULES[index]
      expect(actual.title, `${expected.id}.title`).toBe(expected.title)
      expect(actual.subject, `${expected.id}.subject`).toBe(expected.subject)
    }
  })

  it('projects the same chapter ids, in the same order, for every module', () => {
    for (const [index, expected] of MODULES.entries()) {
      const actual = generatedModules.MODULES[index]
      expect(actual.chapterIds, `${expected.id}.chapterIds`).toEqual(expected.chapterIds)
    }
  })

  it('projects the same field set — no extra field, no missing field', () => {
    for (const [index, expected] of MODULES.entries()) {
      expect(keysOf(generatedModules.MODULES[index]), `${expected.id} fields`).toEqual(keysOf(expected))
    }
  })

  it('is deeply equal as a whole, so nothing above can pass by omission', () => {
    expect(generatedModules.MODULES).toEqual(MODULES)
  })

  it('reproduces getModuleById for every id, and for an unknown one', () => {
    for (const module of MODULES) {
      expect(generatedModules.getModuleById(module.id)).toEqual(getModuleById(module.id))
    }
    expect(generatedModules.getModuleById('nothing-like-this')).toBeNull()
    expect(getModuleById('nothing-like-this')).toBeNull()
  })

  it('reproduces getModuleForChapter for every runtime chapter, including the hidden one', () => {
    for (const chapter of CHAPTERS) {
      expect(generatedModules.getModuleForChapter(chapter.id), chapter.id)
        .toEqual(getModuleForChapter(chapter.id))
    }
    // The hidden Renaissance row belongs to no module in either version.
    expect(generatedModules.getModuleForChapter('history-medicine-renaissance-medicine')).toBeNull()
    expect(generatedModules.getModuleForChapter('nothing-like-this')).toBeNull()
  })

  it('exports the same public symbols as the hand-authored file', () => {
    expect(Object.keys(generatedModules).sort()).toEqual(['MODULES', 'getModuleById', 'getModuleForChapter'])
  })
})

// ─── CHAPTERS ───────────────────────────────────────────────────────────────

describe('CHAPTERS parity', () => {
  it('projects all 60 rows, with the same ids in the same order', () => {
    expect(generatedChapters.CHAPTERS).toHaveLength(60)
    expect(generatedChapters.CHAPTERS.map(chapter => chapter.id)).toEqual(CHAPTERS.map(chapter => chapter.id))
  })

  it('projects the same field set for every row — including which rows omit series and tags', () => {
    for (const [index, expected] of CHAPTERS.entries()) {
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
    for (const [index, expected] of CHAPTERS.entries()) {
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
    expect(index).toBe(CHAPTERS.findIndex(chapter => chapter.id === 'history-medicine-renaissance-medicine'))
    expect(index).toBe(2)
    const row = generatedChapters.CHAPTERS[index]
    expect(row.availability).toBe('hidden')
    expect(row).toEqual(CHAPTERS[index])
    // It is projected from compatibility data — nothing canonical claims it.
    expect(catalogue.chapters.map(chapter => chapter.id)).not.toContain(row.id)
  })

  it('projects the same availability for every row, through the same function', () => {
    for (const [index, expected] of CHAPTERS.entries()) {
      const actual = generatedChapters.CHAPTERS[index]
      expect(generatedChapters.getChapterAvailability(actual), `${expected.id} availability`)
        .toBe(getChapterAvailability(expected))
      expect(generatedChapters.isChapterAvailable(actual), `${expected.id} openable`)
        .toBe(isChapterAvailable(expected))
    }
    expect(generatedChapters.CHAPTER_AVAILABILITY).toEqual(CHAPTER_AVAILABILITY)
    expect(generatedChapters.getChapterAvailability(null)).toBe(CHAPTER_AVAILABILITY.HIDDEN)
    // 30 available today; the count is asserted so a silent shift fails here.
    expect(generatedChapters.CHAPTERS.filter(generatedChapters.isChapterAvailable))
      .toHaveLength(CHAPTERS.filter(isChapterAvailable).length)
  })

  it('derives screenCount from the content file and matches all 60 rows', () => {
    for (const [index, expected] of CHAPTERS.entries()) {
      expect(generatedChapters.CHAPTERS[index].screenCount, `${expected.id}.screenCount`)
        .toBe(expected.screenCount)
    }
  })

  it('derives screenTags from the content file and matches all 60 rows, nulls included', () => {
    for (const [index, expected] of CHAPTERS.entries()) {
      const actual = generatedChapters.CHAPTERS[index].screenTags
      expect(actual, `${expected.id}.screenTags`).toEqual(expected.screenTags)
      expect(actual.length, `${expected.id} screenTags length`).toBe(expected.screenCount)
    }
  })

  it('projects the same presentation and tag values — colour, icon, imagery, tags', () => {
    for (const [index, expected] of CHAPTERS.entries()) {
      const actual = generatedChapters.CHAPTERS[index]
      for (const key of ['color', 'colorLight', 'icon', 'headerImage', 'number', 'series', 'tags']) {
        expect(actual[key], `${expected.id}.${key}`).toEqual(expected[key])
      }
    }
  })

  it('is deeply equal as a whole', () => {
    expect(generatedChapters.CHAPTERS).toEqual(CHAPTERS)
  })

  it('exports the same public symbols as the hand-authored file', () => {
    expect(Object.keys(generatedChapters).sort()).toEqual([
      'CHAPTERS', 'CHAPTER_AVAILABILITY', 'getChapterAvailability', 'isChapterAvailable',
    ])
  })

  it('keeps the six new English chapters out of the projection, and in the catalogue', () => {
    const projected = new Set(generatedChapters.CHAPTERS.map(chapter => chapter.id))
    for (const id of compatibility.excludedChapterIds) {
      expect(projected.has(id), `${id} entered the Stage 3 projection`).toBe(false)
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
  const runtimeKeys = Object.keys(CHAPTER_CONTENT_LOADERS)

  it('projects exactly 60 keys, in the same order', () => {
    expect(generatedKeys).toHaveLength(60)
    expect(generatedKeys).toEqual(runtimeKeys)
  })

  it('projects the same dynamic import target for every key', () => {
    // Read from source: an import specifier is not observable at runtime.
    //
    // Compared as RESOLVED targets, not as literal strings. The two files sit
    // in different directories, so the same content file is spelled
    // `./history/…` from `src/content/` and `../../../content/history/…` from
    // `src/data/generated/curriculum/`. Demanding identical text would demand a
    // specifier that resolves to nothing from the generated file's location.
    const targets = (relativeFile, source) => {
      const base = dirname(resolve(root, relativeFile))
      const found = new Map()
      const pattern = /["']?([\w-]+)["']?\s*:\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)/g
      for (const [, id, path] of source.matchAll(pattern)) found.set(id, resolve(base, path))
      return found
    }
    const expected = targets('src/content/chapterContentRegistry.js', read('src/content/chapterContentRegistry.js'))
    const actual = targets(LOADERS_PATH, read(LOADERS_PATH))
    expect(actual.size).toBe(60)
    expect(expected.size).toBe(60)
    for (const [id, target] of expected) {
      expect(actual.get(id), `loader ${id} import target`).toBe(target)
      expect(existsSync(target), `loader ${id} target does not exist`).toBe(true)
    }
  })

  it('spells every target relative to the generated file, so Stage 4 can re-export it', () => {
    const source = read(LOADERS_PATH)
    const specifiers = [...source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map(match => match[1])
    expect(specifiers).toHaveLength(60)
    for (const specifier of specifiers) {
      expect(specifier, `"${specifier}" is not rebased`).toMatch(/^\.\.\/\.\.\/\.\.\/content\//)
    }
  })

  it('resolves every loader to the same content module as the runtime does', async () => {
    for (const id of runtimeKeys) {
      const [fromRuntime, fromProjection] = await Promise.all([
        loadChapterContent(id),
        generatedLoaders.loadChapterContent(id),
      ])
      // Same module instance: the two loaders name the same file, so the module
      // registry hands back one object. Identity is the strongest available
      // proof that the import targets agree.
      expect(fromProjection, `loader ${id}`).toBe(fromRuntime)
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

  it('returns null for an unknown id, like the runtime does', async () => {
    expect(await generatedLoaders.loadChapterContent('nothing-like-this')).toBeNull()
    expect(await loadChapterContent('nothing-like-this')).toBeNull()
  })

  it('exports the same public symbols as the hand-authored file', () => {
    expect(Object.keys(generatedLoaders).sort()).toEqual(['CHAPTER_CONTENT_LOADERS', 'loadChapterContent'])
  })
})

// ─── The gate fails when it should ──────────────────────────────────────────
//
// A parity test that only ever compares two identical things proves the two
// things are identical, not that the comparison would notice if they were not.
// Each case below mutates the projection input by one fact and asserts the
// output changes — so a real regression could not slip past.

describe('the parity gate detects a difference', () => {
  const rebuild = overrides => buildProjections(catalogue, { ...compatibility, ...overrides })

  it('notices an extra runtime module', async () => {
    const built = await rebuild({
      legacyModules: [...compatibility.legacyModules,
        { id: 'extra_module', title: 'Extra', canonicalModuleIds: ['english-lit-aqa-inspector-calls'] }],
    })
    expect(built.modules).toHaveLength(8)
    expect(built.modules).not.toEqual(MODULES)
  })

  it('notices a missing runtime module', async () => {
    const built = await rebuild({ legacyModules: compatibility.legacyModules.slice(1) })
    expect(built.modules).toHaveLength(6)
    expect(built.modules.map(module => module.id)).not.toEqual(MODULES.map(module => module.id))
  })

  it('notices a changed module title', async () => {
    const built = await rebuild({
      legacyModules: compatibility.legacyModules.map(legacy =>
        legacy.id === 'maths_core' ? { ...legacy, title: 'Maths' } : legacy),
    })
    expect(built.modules).not.toEqual(MODULES)
    expect(built.modules.find(module => module.id === 'maths_core').title).toBe('Maths')
  })

  it('notices a missing runtime chapter', async () => {
    const built = await rebuild({ chapterOrder: compatibility.chapterOrder.slice(0, 59) })
    expect(built.chapters).toHaveLength(59)
    expect(built.chapters.map(chapter => chapter.id)).not.toEqual(CHAPTERS.map(chapter => chapter.id))
  })

  it('notices changed chapter ordering', async () => {
    const reordered = [...compatibility.chapterOrder]
    ;[reordered[0], reordered[1]] = [reordered[1], reordered[0]]
    const built = await rebuild({ chapterOrder: reordered })
    expect(built.chapters.map(chapter => chapter.id)).not.toEqual(CHAPTERS.map(chapter => chapter.id))
    // Same set, different order — the kind of difference a set comparison misses.
    expect([...built.chapters.map(chapter => chapter.id)].sort())
      .toEqual([...CHAPTERS.map(chapter => chapter.id)].sort())
  })

  it('notices a changed legacy-only chapter field', async () => {
    const built = await rebuild({
      chapterFields: {
        ...compatibility.chapterFields,
        soc1: { ...compatibility.chapterFields.soc1, color: '#000000' },
      },
    })
    expect(built.chapters).not.toEqual(CHAPTERS)
    expect(built.chapters.find(chapter => chapter.id === 'soc1').color).toBe('#000000')
  })

  it('notices a chapter that stopped being excluded', async () => {
    const built = await rebuild({ excludedChapterIds: [] })
    const macbeth = built.modules.find(module => module.id === 'eng_macbeth')
    expect(macbeth.chapterIds).toHaveLength(4)
    expect(macbeth.chapterIds).not.toEqual(getModuleById('eng_macbeth').chapterIds)
  })

  it('notices a changed loader target', async () => {
    const poisoned = {
      ...compatibility,
      hiddenChapter: { ...compatibility.hiddenChapter, contentPath: 'src/content/sociology/families/episodes/soc1.js' },
    }
    const built = await buildProjections(catalogue, poisoned)
    const hidden = built.loaders.find(loader => loader.id === compatibility.hiddenChapter.row.id)
    expect(hidden.importPath).toBe('../../../content/sociology/families/episodes/soc1.js')
    expect(read(LOADERS_PATH)).not.toContain(`"${compatibility.hiddenChapter.row.id}": () => import("${hidden.importPath}")`)
  })

  it('notices changed loader ordering', async () => {
    const anchors = [...compatibility.loaderSectionAnchors].reverse()
    const built = await rebuild({ loaderSectionAnchors: anchors })
    expect(built.loaders.map(loader => loader.id)).not.toEqual(Object.keys(CHAPTER_CONTENT_LOADERS))
    expect([...built.loaders.map(loader => loader.id)].sort())
      .toEqual([...Object.keys(CHAPTER_CONTENT_LOADERS)].sort())
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

  it('never reads .planning/** or the hand-authored runtime', () => {
    expect(assertInputPurity()).toEqual([])
    // …and the guard fires on the two things it exists to catch.
    expect(assertInputPurity("import { CHAPTERS } from '../src/chapters.js'").join(' '))
      .toMatch(/hand-authored runtime is never a generator input/)
    expect(assertInputPurity("readFileSync('.planning/phase-5-curriculum-architecture/DESIGN.md')").join(' '))
      .toMatch(/\.planning\/\*\* is never a generator input/)
    // A generated re-export is not the hand-authored file.
    expect(assertInputPurity("import x from '../src/data/generated/curriculum/chapters.js'")).toEqual([])
  })

  it('names the three files it must never read, and they are still hand-authored', () => {
    expect(HANDWRITTEN_RUNTIME_FILES).toEqual([
      'src/data/modules.js', 'src/chapters.js', 'src/content/chapterContentRegistry.js',
    ])
    for (const file of HANDWRITTEN_RUNTIME_FILES) {
      expect(read(file), `${file} became generated`).not.toContain('GENERATED FILE')
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

describe('Stage 3 changes no runtime source', () => {
  function listFiles(dir) {
    const out = []
    const absolute = resolve(root, dir)
    if (!existsSync(absolute)) return out
    for (const name of readdirSync(absolute)) {
      const rel = posix.join(dir, name)
      if (statSync(resolve(root, rel)).isDirectory()) { out.push(...listFiles(rel)); continue }
      if (name.endsWith('.stories.jsx') || /\.(test|spec)\.jsx?$/.test(name)) continue
      if (!/\.jsx?$/.test(name)) continue
      out.push(rel)
    }
    return out
  }

  it('nothing re-exports or imports the generated projections', () => {
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*generated\/curriculum\//
    const importers = listFiles('src').filter(file => !file.startsWith('src/data/generated/curriculum/'))
      .filter(file => reaches.test(read(file)))
    expect(importers, 'Stage 3 must not wire the projections in — that is Stage 4').toEqual([])
  })

  it('the generated projections import no catalogue and no compatibility data', () => {
    for (const path of [MODULES_PATH, CHAPTERS_PATH, LOADERS_PATH]) {
      const source = read(path)
      expect(source, `${path} imports the catalogue`).not.toMatch(/(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue/)
      // The loaders file imports content; the other two import nothing at all.
      if (path !== LOADERS_PATH) expect(source, `${path} imports something`).not.toMatch(/\bimport\b/)
    }
  })

  it('catalogue imports never enter production source', () => {
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\//
    const importers = listFiles('src')
      .filter(file => !file.startsWith('src/curriculum-catalogue/'))
      .filter(file => reaches.test(read(file)))
    expect(importers).toEqual([])
  })
})

// ─── The screenTags review artefact ─────────────────────────────────────────

describe('the screenTags report is a review artefact, not a correction', () => {
  it('is byte-identical to a fresh render', async () => {
    const documents = await generateReport()
    expect(documents[REPORT_PATH]).toBe(read(REPORT_PATH))
  })

  it('changes no projected value — every screenTags array still equals the runtime', () => {
    renderScreenTagReport(projections.chapters)
    for (const [index, expected] of CHAPTERS.entries()) {
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
