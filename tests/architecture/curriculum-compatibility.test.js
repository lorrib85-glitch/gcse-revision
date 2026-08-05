// ─── The runtime compatibility projection is scaffolding, not curriculum ────
//
// `src/curriculum-catalogue/compatibility/` exists to reproduce the pre-cutover
// runtime interface exactly, and to stop existing when that interface does.
// Every test here defends one of the six rules in
// `docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md` §1.
//
// The distinction being defended: a fact under `records/` is curriculum and
// outlives the migration; a fact under `compatibility/` is temporary projection
// INPUT. If that line blurs, the migration has quietly acquired a second
// authority and Stage 5 has nothing to delete.

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, posix } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { loadCatalogue, LAYOUT } from '../../src/curriculum-catalogue/index.js'
import { RECORD_TYPES, CURRICULUM_ENTITY_TYPES } from '../../src/curriculum-catalogue/schema.js'
import {
  loadCompatibility,
  validateCompatibility,
  checkCompatibility,
  DELETION_STAGES,
  CANONICAL_CHAPTER_FIELDS,
  COMPATIBILITY_VERSION,
} from '../../src/curriculum-catalogue/compatibility/index.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

const COMPATIBILITY_ROOT = 'src/curriculum-catalogue/compatibility'

function listFiles(dir) {
  const out = []
  const absolute = resolve(root, dir)
  if (!existsSync(absolute)) return out
  for (const name of readdirSync(absolute)) {
    const rel = posix.join(dir, name)
    if (statSync(resolve(root, rel)).isDirectory()) { out.push(...listFiles(rel)); continue }
    if (name.endsWith('.stories.jsx')) continue
    if (/\.(test|spec)\.jsx?$/.test(name)) continue
    if (!/\.jsx?$/.test(name)) continue
    out.push(rel)
  }
  return out
}

const compatibility = loadCompatibility()

// ─── Rule 1 — it is not a curriculum entity ─────────────────────────────────

describe('compatibility data is not a curriculum entity', () => {
  it('there are exactly six entity types, and none of them is a compatibility type', () => {
    expect(CURRICULUM_ENTITY_TYPES).toEqual([
      'board', 'subject', 'specification', 'studyPathway', 'module', 'chapter',
    ])
    expect(Object.keys(RECORD_TYPES)).toEqual(CURRICULUM_ENTITY_TYPES)
    for (const type of CURRICULUM_ENTITY_TYPES) {
      expect(type.toLowerCase(), `${type} names the compatibility layer`).not.toContain('legacy')
      expect(type.toLowerCase()).not.toContain('binding')
      expect(type.toLowerCase()).not.toContain('compat')
    }
  })

  it('the loader layout declares six collections and never reaches the compatibility directory', () => {
    expect(LAYOUT).toHaveLength(6)
    expect(LAYOUT.map(entry => entry.type)).toEqual(CURRICULUM_ENTITY_TYPES)
    for (const entry of LAYOUT) {
      expect(entry.path, 'a record type points outside records/').not.toContain('compatibility')
      expect(entry.path).not.toContain('..')
    }
  })

  it('the catalogue exposes six collections — the seventh is gone', async () => {
    const catalogue = await loadCatalogue()
    expect(Object.keys(catalogue)).toEqual([
      'boards', 'subjects', 'specifications', 'pathways', 'modules', 'chapters',
    ])
    expect(catalogue).not.toHaveProperty('legacyContentBindings')
  })

  it('no compatibility file lives under records/, and no record file mentions a binding', () => {
    expect(existsSync(resolve(root, 'src/curriculum-catalogue/records/legacyContentBindings.js'))).toBe(false)
    const recordFiles = listFiles('src/curriculum-catalogue/records')
    expect(recordFiles.length).toBeGreaterThan(50)
    for (const file of recordFiles) {
      expect(read(file), `${file} still carries a compatibility binding`).not.toMatch(/legacyContentBinding/)
    }
  })

  it('counting the catalogue never counts compatibility data', async () => {
    const catalogue = await loadCatalogue()
    const counted = Object.values(catalogue).reduce((total, records) => total + records.length, 0)
    // 2 boards + 8 subjects + 9 specifications + 14 pathways + 36 modules + 65 chapters.
    expect(counted).toBe(134)
    expect(catalogue.chapters.some(chapter => chapter.id === compatibility.hiddenChapter.row.id)).toBe(false)
  })
})

// ─── Rule 2 — production source must never import it ────────────────────────

describe('compatibility data never reaches production source', () => {
  it('is not imported anywhere under src/, outside its own directory', () => {
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\/compatibility/
    const importers = listFiles('src')
      .filter(file => !file.startsWith(`${COMPATIBILITY_ROOT}/`))
      .filter(file => reaches.test(read(file)))
    expect(importers).toEqual([])
  })

  it('the guard would fire — it matches the specifiers a real import uses', () => {
    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*curriculum-catalogue\/compatibility/
    expect(reaches.test("import x from '../curriculum-catalogue/compatibility/index.js'")).toBe(true)
    expect(reaches.test("await import('./curriculum-catalogue/compatibility/runtime-v1.js')")).toBe(true)
    expect(reaches.test("// we used to read curriculum-catalogue/compatibility here")).toBe(false)
  })

  it('imports nothing but its sibling schema', () => {
    const IMPORT_SPECIFIER = /^\s*(?:import|export)\b[^;\n]*?\bfrom\s*['"]([^'"]+)['"]/gm
    for (const file of listFiles(COMPATIBILITY_ROOT)) {
      for (const [, specifier] of read(file).matchAll(IMPORT_SPECIFIER)) {
        expect(specifier.startsWith('./') || specifier.startsWith('../'), `${file} imports "${specifier}"`).toBe(true)
        expect(specifier, `${file} escapes the catalogue via "${specifier}"`).not.toMatch(/\.\.\/\.\.\//)
      }
    }
  })

  it('never touches React, a browser API or storage', () => {
    for (const file of listFiles(COMPATIBILITY_ROOT)) {
      const source = read(file)
      expect(source, `${file} imports react`).not.toMatch(/from\s*['"]react/)
      for (const forbidden of ['localStorage', 'sessionStorage', 'window.', 'document.', 'indexedDB']) {
        expect(source, `${file} touches ${forbidden}`).not.toContain(forbidden)
      }
    }
  })
})

// ─── Rule 3 — it is plain, validated, serialisable data ─────────────────────

describe('compatibility data is validated like a record', () => {
  it('loads and validates', () => {
    expect(validateCompatibility(compatibility)).toEqual([])
    expect(COMPATIBILITY_VERSION).toBe('runtime-v1')
  })

  it('survives a JSON round trip byte-identically', () => {
    expect(JSON.parse(JSON.stringify(compatibility))).toEqual(compatibility)
  })

  it('cross-checks clean against the canonical catalogue', async () => {
    const catalogue = await loadCatalogue()
    expect(checkCompatibility(catalogue, compatibility)).toEqual([])
  })

  it('rejects a non-serialisable value', () => {
    expect(validateCompatibility({ ...compatibility, chapterOrder: [() => {}] }).join(' '))
      .toMatch(/function|serialis/i)
  })
})

// ─── Rule 4 — it must never duplicate a derivable fact ──────────────────────

describe('compatibility data never duplicates a derivable fact', () => {
  it('states no field a canonical chapter record owns', () => {
    for (const [chapterId, fields] of Object.entries(compatibility.chapterFields)) {
      for (const key of Object.keys(fields)) {
        expect(CANONICAL_CHAPTER_FIELDS, `${chapterId}.${key} is canonical`).not.toContain(key)
      }
    }
  })

  it('rejects a chapterFields entry that restates a canonical field', () => {
    const poisoned = {
      ...compatibility,
      chapterFields: { ...compatibility.chapterFields, soc1: { ...compatibility.chapterFields.soc1, title: 'Anything' } },
    }
    expect(validateCompatibility(poisoned).join(' ')).toMatch(/restates canonical field "title"/)
  })

  it('states no legacy module title its single canonical module already states', async () => {
    const catalogue = await loadCatalogue()
    const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
    for (const legacy of compatibility.legacyModules) {
      if (legacy.title === null || legacy.canonicalModuleIds.length !== 1) continue
      expect(moduleById.get(legacy.canonicalModuleIds[0]).title, `${legacy.id} restates a canonical title`)
        .not.toBe(legacy.title)
    }
    // The two that ARE derivable are declared as null, not as a copy.
    expect(compatibility.legacyModules.filter(legacy => legacy.title === null).map(legacy => legacy.id))
      .toEqual(['eng_macbeth', 'hist_usa'])
  })

  it('rejects a legacy module that copies its derivable title', async () => {
    const catalogue = await loadCatalogue()
    const poisoned = {
      ...compatibility,
      legacyModules: compatibility.legacyModules.map(legacy => legacy.id === 'eng_macbeth'
        ? { ...legacy, title: 'Macbeth' }
        : legacy),
    }
    expect(checkCompatibility(catalogue, poisoned).join(' ')).toMatch(/already states/)
  })

  it('states no concept id — the concept portion of tags is canonical', () => {
    for (const [chapterId, fields] of Object.entries(compatibility.chapterFields)) {
      for (const tag of fields.facetTags ?? []) {
        expect(tag, `${chapterId} restates concept "${tag}"`).not.toMatch(/^[a-z-]+:[a-z-]+:/)
      }
    }
  })

  it('rejects a facet tag that is really a concept id', () => {
    const poisoned = {
      ...compatibility,
      chapterFields: {
        ...compatibility.chapterFields,
        soc1: { ...compatibility.chapterFields.soc1, facetTags: ['history:medicine:galen'] },
      },
    }
    expect(validateCompatibility(poisoned).join(' ')).toMatch(/contains concept id/)
  })

  it('never states screenCount or screenTags — both derive from the content file', () => {
    const source = read(`${COMPATIBILITY_ROOT}/runtime-v1.js`)
    // Prose may explain why they are absent; no data line may set one.
    expect(source).not.toMatch(/^\s*screenCount:/m)
    expect(source).not.toMatch(/^\s*screenTags:/m)
    expect(compatibility.hiddenChapter.row).not.toHaveProperty('screenCount')
    expect(compatibility.hiddenChapter.row).not.toHaveProperty('screenTags')
  })

  it('rejects a hidden row that states a derived field', () => {
    const poisoned = {
      ...compatibility,
      hiddenChapter: {
        ...compatibility.hiddenChapter,
        row: { ...compatibility.hiddenChapter.row, screenCount: 16 },
      },
    }
    expect(validateCompatibility(poisoned).join(' ')).toMatch(/must not state "screenCount"/)
  })

  it('does not restate the loader key order it can recover from seven anchors', () => {
    expect(compatibility.loaderSectionAnchors).toHaveLength(7)
    expect(compatibility.chapterOrder).toHaveLength(60)
    // The anchors are section starts within chapterOrder, so the second list is
    // a re-sequencing of the first rather than a second copy of it.
    for (const anchor of compatibility.loaderSectionAnchors) {
      expect(compatibility.chapterOrder).toContain(anchor)
    }
    expect(compatibility.loaderSectionAnchors).toContain(compatibility.chapterOrder[0])
  })
})

// ─── Rule 5 — every field names the stage that deletes it ───────────────────

describe('every compatibility field has a death date', () => {
  it('every top-level field appears in DELETION_STAGES', () => {
    for (const key of Object.keys(compatibility)) {
      expect(DELETION_STAGES, `"${key}" has no deletion stage`).toHaveProperty(key)
    }
  })

  it('every legacy-only chapter sub-field appears in DELETION_STAGES', () => {
    const used = new Set()
    for (const fields of Object.values(compatibility.chapterFields)) {
      for (const key of Object.keys(fields)) used.add(key)
    }
    expect([...used].sort()).toEqual(['color', 'colorLight', 'facetTags', 'number', 'series'])
    for (const key of used) {
      expect(DELETION_STAGES, `chapterFields.${key} has no deletion stage`).toHaveProperty(`chapterFields.${key}`)
    }
  })

  it('every declared stage is a real later stage — 5 or 6, never 3 or 4', () => {
    // Stage 4 makes the runtime files re-export the projections, so the
    // projection must still produce the identical interface. Nothing here can
    // die before Stage 5.
    for (const [field, stage] of Object.entries(DELETION_STAGES)) {
      expect([5, 6], `${field} dies at stage ${stage}`).toContain(stage)
    }
  })

  it('DELETION_STAGES carries no entry for a field that no longer exists', () => {
    const live = new Set(Object.keys(compatibility))
    for (const fields of Object.values(compatibility.chapterFields)) {
      for (const key of Object.keys(fields)) live.add(`chapterFields.${key}`)
    }
    expect(Object.keys(DELETION_STAGES).filter(field => !live.has(field))).toEqual([])
  })

  it('rejects a new field that names no stage', () => {
    expect(validateCompatibility({ ...compatibility, somethingNew: [] }).join(' '))
      .toMatch(/does not name the stage that deletes it/)
  })

  it('the documented retirement table matches DELETION_STAGES', () => {
    const doc = read('docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md')
    for (const field of ['legacyModules', 'chapterOrder', 'loaderSectionAnchors', 'excludedChapterIds']) {
      expect(doc, `${field} is missing from the Stage 5 row`).toMatch(new RegExp(`\`${field}\``))
    }
    expect(doc).toMatch(/Stage 6.*facetTags/s)
    expect(doc).toMatch(/Stage 4.*unchanged and still required/s)
  })
})

// ─── Rule 6 — it is projection input, and accounts for every chapter ────────

describe('compatibility data is projection input, not curriculum identity', () => {
  it('the hidden row has no chapter record and never gains one', async () => {
    const catalogue = await loadCatalogue()
    const hiddenId = compatibility.hiddenChapter.row.id
    expect(catalogue.chapters.map(chapter => chapter.id)).not.toContain(hiddenId)
    expect(catalogue.modules.flatMap(module => module.chapterRefs.map(ref => ref.chapterId)))
      .not.toContain(hiddenId)
  })

  it('rejects a hidden row that has acquired a chapter record', async () => {
    const catalogue = await loadCatalogue()
    const poisoned = {
      ...compatibility,
      hiddenChapter: {
        ...compatibility.hiddenChapter,
        row: { ...compatibility.hiddenChapter.row, id: 'soc1' },
      },
    }
    expect(checkCompatibility(catalogue, poisoned).join(' ')).toMatch(/also has a chapter record/)
  })

  it('accounts for every non-retired canonical chapter — projected or explicitly excluded', async () => {
    const catalogue = await loadCatalogue()
    const projected = new Set(compatibility.chapterOrder)
    const excluded = new Set(compatibility.excludedChapterIds)
    const unaccounted = catalogue.chapters
      .filter(chapter => chapter.status !== 'retired')
      .filter(chapter => !projected.has(chapter.id) && !excluded.has(chapter.id))
      .map(chapter => chapter.id)
    expect(unaccounted).toEqual([])
    // 65 canonical chapters = 59 projected + 6 excluded.
    expect(catalogue.chapters).toHaveLength(65)
    expect(compatibility.chapterOrder).toHaveLength(60)
    expect(compatibility.excludedChapterIds).toHaveLength(6)
  })

  it('fails rather than silently dropping a chapter that is neither projected nor excluded', async () => {
    const catalogue = await loadCatalogue()
    const poisoned = { ...compatibility, excludedChapterIds: compatibility.excludedChapterIds.slice(1) }
    expect(checkCompatibility(catalogue, poisoned).join(' '))
      .toMatch(/neither projected nor explicitly excluded/)
  })

  it('excludes exactly the six planned English chapters, all of them English and planned', async () => {
    const catalogue = await loadCatalogue()
    const chapterById = new Map(catalogue.chapters.map(chapter => [chapter.id, chapter]))
    const moduleForChapter = new Map()
    for (const module of catalogue.modules) {
      for (const ref of module.chapterRefs) moduleForChapter.set(ref.chapterId, module)
    }
    expect(compatibility.excludedChapterIds).toEqual([
      'english-inspector-calls-social-message',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-consequences-resolution',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
      'english-macbeth-appearance-reality',
    ])
    for (const id of compatibility.excludedChapterIds) {
      const chapter = chapterById.get(id)
      expect(chapter, `${id} has no chapter record`).toBeTruthy()
      // Excluding an available chapter would remove a learner-facing journey.
      expect(chapter.status, `${id} is not planned`).toBe('planned')
      expect(chapter.contentPath, `${id} has content and cannot be excluded`).toBeNull()
      expect(moduleForChapter.get(id).subjectId).toBe('english-literature')
    }
  })

  it('no legacy module aggregation claims a canonical module twice', () => {
    const claimed = compatibility.legacyModules.flatMap(legacy => legacy.canonicalModuleIds)
    expect(new Set(claimed).size).toBe(claimed.length)
    expect(compatibility.legacyModules.map(legacy => legacy.id)).toEqual([
      'hist_medicine', 'soc_family', 'maths_core', 'bio_core',
      'eng_macbeth', 'hist_spain_new_world', 'hist_usa',
    ])
  })

  it('rejects an aggregation whose subject is not derivable', async () => {
    const catalogue = await loadCatalogue()
    const poisoned = {
      ...compatibility,
      legacyModules: compatibility.legacyModules.map(legacy => legacy.id === 'maths_core'
        ? { ...legacy, canonicalModuleIds: ['maths-aqa-number', 'sociology-aqa-families'] }
        : legacy),
    }
    expect(checkCompatibility(catalogue, poisoned).join(' ')).toMatch(/is not derivable/)
  })

  it('rejects an aggregation naming a module that does not exist', async () => {
    const catalogue = await loadCatalogue()
    const poisoned = {
      ...compatibility,
      legacyModules: compatibility.legacyModules.map(legacy => legacy.id === 'maths_core'
        ? { ...legacy, canonicalModuleIds: ['maths-aqa-imaginary'] }
        : legacy),
    }
    expect(checkCompatibility(catalogue, poisoned).join(' ')).toMatch(/unknown canonical module/)
  })

  it('the runtime files it projects into are still hand-authored at Stage 3', () => {
    for (const file of ['src/data/modules.js', 'src/chapters.js', 'src/content/chapterContentRegistry.js']) {
      const source = read(file)
      expect(source, `${file} became generated`).not.toMatch(/GENERATED FILE/)
      expect(source, `${file} reaches the catalogue`).not.toMatch(/curriculum-catalogue/)
    }
  })

  it('the compatibility source is loadable in isolation, with no catalogue present', async () => {
    // Projection INPUT: it must not need the catalogue to be readable, or it is
    // structurally part of the catalogue rather than an input to a generator.
    const module = await import(pathToFileURL(resolve(root, `${COMPATIBILITY_ROOT}/runtime-v1.js`)).href)
    expect(Object.keys(module)).toEqual(['default'])
    expect(read(`${COMPATIBILITY_ROOT}/runtime-v1.js`)).not.toMatch(/^\s*import\b/m)
  })
})
