#!/usr/bin/env node
// Phase 5A — deterministic current-state curriculum baseline.
//
// Measurement only. This script imports the live curriculum sources, loads
// every registered chapter content module, and writes a machine-readable
// snapshot of what the repository actually contains right now.
//
// It never writes to src/, never mutates any source file, and has no clock,
// no environment reads and no absolute paths in its output — so the same tree
// always produces the same bytes.
//
//   node .planning/phase-5-curriculum-architecture/scripts/generate-curriculum-baseline.mjs
//   node .planning/phase-5-curriculum-architecture/scripts/generate-curriculum-baseline.mjs --check
//
// --check regenerates in memory and compares byte-for-byte without writing.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../..')
const OUT = join(HERE, '../baselines/current-curriculum-baseline.json')

const src = p => join(REPO, 'src', p)

const { CHAPTERS, CHAPTER_AVAILABILITY, getChapterAvailability } = await import(src('chapters.js'))
const { MODULES } = await import(src('data/modules.js'))
const { CHAPTER_CONTENT_LOADERS } = await import(src('content/chapterContentRegistry.js'))
const { SUBJECTS } = await import(src('constants/subjects.js'))
const { ALL_CONCEPTS, CONCEPT_SUBJECT_NAMESPACES } = await import(src('data/learningGraph/conceptRegistry.js'))
const { FACET_NAMESPACES } = await import(src('data/learningGraph/tagSchema.js'))
const { TAG_CHAPTER_MAP } = await import(src('data/tagChapterMap.js'))
const { getSubjectChapterList } = await import(src('features/subjects/subjectCatalogue.js'))
const authoring = await import(src('data/generated/componentAuthoringRegistry.js'))

// ─── Helpers ────────────────────────────────────────────────────────────────

const sortedBy = (rows, key) => [...rows].sort((a, b) => String(a[key]).localeCompare(String(b[key])))
const countBy = (items, keyFn) => {
  const out = {}
  for (const item of items) {
    const key = keyFn(item)
    out[key] = (out[key] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
}

// The subject-browser's own subject list is a literal inside Subjects.jsx.
// Reading it structurally is not possible without importing React, so it is
// parsed from source — the parse is asserted, not assumed.
function readSubjectBrowserNames() {
  const file = readFileSync(src('features/subjects/Subjects.jsx'), 'utf8')
  const match = file.match(/const SUBJECT_NAMES = \[([^\]]+)\]/)
  if (!match) throw new Error('SUBJECT_NAMES literal not found in Subjects.jsx')
  return match[1].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean)
}

// Same constraint for the two hardcoded series pickers.
function readSeriesPicker(name) {
  const file = readFileSync(src('features/subjects/Subjects.jsx'), 'utf8')
  const block = file.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) throw new Error(`${name} literal not found in Subjects.jsx`)
  return [...block[1].matchAll(/id: '([^']+)',\s*\n\s*title: '([^']+)'[\s\S]*?comingSoon: (true|false)/g)]
    .map(m => ({ id: m[1], title: m[2], comingSoon: m[3] === 'true' }))
}

function readMapKeys(file, name) {
  const source = readFileSync(src(file), 'utf8')
  const block = source.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\}`))
  if (!block) throw new Error(`${name} literal not found in ${file}`)
  return [...block[1].matchAll(/^\s*'?([A-Za-z0-9_-]+)'?:/gm)].map(m => m[1])
}

// ─── Load every chapter's real content ──────────────────────────────────────

const loaderIds = Object.keys(CHAPTER_CONTENT_LOADERS)
const contentById = new Map()
for (const id of loaderIds) {
  contentById.set(id, await CHAPTER_CONTENT_LOADERS[id]())
}

// ─── Chapters ───────────────────────────────────────────────────────────────

const moduleOfChapter = new Map()
for (const mod of MODULES) {
  for (const id of mod.chapterIds) moduleOfChapter.set(id, mod.id)
}

const chapterRows = CHAPTERS.map(chapter => {
  const content = contentById.get(chapter.id) ?? null
  const actualScreens = Array.isArray(content?.screens) ? content.screens.length : null
  const declared = chapter.screenCount ?? null
  return {
    id: chapter.id,
    subject: chapter.subject ?? null,
    series: chapter.series ?? null,
    number: chapter.number ?? null,
    title: chapter.title ?? null,
    availability: getChapterAvailability(chapter),
    availabilityExplicit: Boolean(chapter.availability),
    parentModuleId: moduleOfChapter.get(chapter.id) ?? null,
    hasLoader: Object.prototype.hasOwnProperty.call(CHAPTER_CONTENT_LOADERS, chapter.id),
    declaredScreenCount: declared,
    actualScreenCount: actualScreens,
    screenCountMatchesContent: declared === actualScreens,
    screenTagsLength: Array.isArray(chapter.screenTags) ? chapter.screenTags.length : null,
    screenTagsAlignWithScreenCount:
      Array.isArray(chapter.screenTags) ? chapter.screenTags.length === declared : null,
    nonNullScreenTags: Array.isArray(chapter.screenTags)
      ? chapter.screenTags.filter(Boolean).length
      : null,
    hasHeaderImage: Boolean(chapter.headerImage),
    tagCount: Array.isArray(chapter.tags) ? chapter.tags.length : 0,
    tags: Array.isArray(chapter.tags) ? [...chapter.tags] : [],
    contentSubject: content?.subject ?? null,
    contentHasHook: Boolean(content?.hook),
    contentHasOutcomes: Boolean(content?.outcomes),
    contentHasRecall: Boolean(content?.recall),
    contentHasStageNavigation: Array.isArray(content?.stageNavigation)
      ? content.stageNavigation.length
      : 0,
  }
}).sort((a, b) => a.id.localeCompare(b.id))

// ─── Tag vocabulary actually in use on chapters ─────────────────────────────

const allChapterTags = CHAPTERS.flatMap(c => c.tags ?? [])
const tagNamespaces = countBy(allChapterTags, t => t.split(':')[0])
const facetTagValues = {}
for (const tag of allChapterTags) {
  const [ns, ...rest] = tag.split(':')
  if (!FACET_NAMESPACES.includes(ns)) continue
  if (rest.length !== 1) continue
  facetTagValues[ns] = facetTagValues[ns] ?? new Set()
  facetTagValues[ns].add(rest[0])
}
const facetVocabulary = Object.fromEntries(
  Object.entries(facetTagValues)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ns, values]) => [ns, [...values].sort()]),
)

// ─── Concepts ───────────────────────────────────────────────────────────────

const conceptRows = ALL_CONCEPTS.map(c => ({
  id: c.id,
  segments: c.id.split(':').length,
  namespace: c.id.split(':')[0],
})).sort((a, b) => a.id.localeCompare(b.id))

// ─── Subject-browser surface ────────────────────────────────────────────────

const browserSubjects = readSubjectBrowserNames()
const browserRows = browserSubjects.map(name => {
  const list = getSubjectChapterList(name)
  return {
    subject: name,
    hasThemeEntry: Object.prototype.hasOwnProperty.call(SUBJECTS, name),
    totalCards: list.length,
    realChapterCards: list.filter(c => !c.comingSoon).length,
    syntheticCards: list.filter(c => c.comingSoon).map(c => c.id).sort(),
  }
})

const themedSubjects = Object.keys(SUBJECTS).sort()
const runtimeContentSubjects = [...new Set(CHAPTERS.map(c => c.subject))].sort()
const moduleSubjects = [...new Set(MODULES.map(m => m.subject))].sort()

// ─── Authoring entries (Component Platform v1 — read only) ──────────────────

const authoringList = [
  ...Object.entries(authoring.SCREEN_REGISTRY).map(([type, e]) => ({ ...e, type })),
  ...Object.entries(authoring.BLOCK_REGISTRY).map(([type, e]) => ({ ...e, type })),
]
const activeAuthoringEntries = authoringList.filter(e => e?.status === 'active')
const authoringByLevel = countBy(authoringList, e => `${e.level}:${e.status}`)

// ─── Generated registries checked by `pnpm verify` ──────────────────────────

const pkg = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8'))
const verifySteps = pkg.scripts.verify.split('&&').map(s => s.trim())
const generatedArtefacts = [
  'docs/components/COMPONENT_REGISTRY.md',
  'src/data/generated/componentAuthoringRegistry.js',
  'src/data/generated/componentPedagogyRegistry.js',
  'src/data/generated/componentLabRegistry.js',
].filter(p => existsSync(join(REPO, p)))

// ─── Assemble ───────────────────────────────────────────────────────────────

const baseline = {
  $schema: 'phase-5a-curriculum-baseline/1',
  about:
    'Deterministic snapshot of the curriculum surface as it exists in the repository. '
    + 'Measurement only — regenerate with '
    + relative(REPO, fileURLToPath(import.meta.url)).split('\\').join('/'),

  headline: {
    totalChapters: CHAPTERS.length,
    availableChapters: CHAPTERS.filter(c => getChapterAvailability(c) === CHAPTER_AVAILABILITY.AVAILABLE).length,
    comingSoonChapters: CHAPTERS.filter(c => getChapterAvailability(c) === CHAPTER_AVAILABILITY.COMING_SOON).length,
    hiddenChapters: CHAPTERS.filter(c => getChapterAvailability(c) === CHAPTER_AVAILABILITY.HIDDEN).length,
    nonHiddenChapters: CHAPTERS.filter(c => getChapterAvailability(c) !== CHAPTER_AVAILABILITY.HIDDEN).length,
    totalModules: MODULES.length,
    totalChapterContentLoaders: loaderIds.length,
    subjectsWithThemeEntry: themedSubjects.length,
    subjectsInRuntimeChapterMetadata: runtimeContentSubjects.length,
    subjectsInModuleCatalogue: moduleSubjects.length,
    subjectsInLearnerBrowser: browserSubjects.length,
    learningGraphConcepts: ALL_CONCEPTS.length,
    learningGraphCourseNodes: conceptRows.filter(c => c.segments === 2).length,
    learningGraphKnowledgeAtoms: conceptRows.filter(c => c.segments >= 3).length,
    learningGraphSubjectNamespaces: [...CONCEPT_SUBJECT_NAMESPACES].sort(),
    activeAuthoringEntries: activeAuthoringEntries.length,
    totalAuthoringEntries: authoringList.length,
    authoringEntriesByLevelAndStatus: authoringByLevel,
    syntheticBrowserCards: browserRows.reduce((n, r) => n + r.syntheticCards.length, 0),
    chaptersWhoseScreenCountMatchesContent: chapterRows.filter(r => r.screenCountMatchesContent).length,
    chaptersWhoseScreenTagsAlignWithScreenCount: chapterRows.filter(r => r.screenTagsAlignWithScreenCount === true).length,
    chaptersWithNoScreenTagsArray: chapterRows.filter(r => r.screenTagsLength === null).length,
    tagChapterMapEntries: Object.keys(TAG_CHAPTER_MAP).length,
  },

  verification: {
    verifySteps,
    generatedArtefactsCheckedByVerify: generatedArtefacts,
  },

  subjects: {
    themeKeys: themedSubjects,
    inRuntimeChapterMetadata: runtimeContentSubjects,
    inModuleCatalogue: moduleSubjects,
    inLearnerBrowser: browserSubjects,
    themedButNotBrowsable: themedSubjects.filter(s => !browserSubjects.includes(s)),
    browsableButUnthemed: browserSubjects.filter(s => !themedSubjects.includes(s)),
    browsableWithNoModule: browserSubjects.filter(s => !moduleSubjects.includes(s)),
  },

  modules: MODULES.map(m => ({
    id: m.id,
    title: m.title,
    subject: m.subject,
    chapterCount: m.chapterIds.length,
    availableChapterCount: m.chapterIds
      .map(id => CHAPTERS.find(c => c.id === id))
      .filter(c => c && getChapterAvailability(c) === CHAPTER_AVAILABILITY.AVAILABLE).length,
    chapterIds: [...m.chapterIds],
  })),

  chapters: chapterRows,

  chapterSeriesValues: countBy(CHAPTERS.filter(c => c.series), c => c.series),
  chaptersWithoutSeries: CHAPTERS.filter(c => !c.series).map(c => c.id).sort(),

  chapterNumberCollisions: Object.entries(
    CHAPTERS.reduce((acc, c) => {
      const key = `${c.subject}/${c.series ?? '(no series)'}/${c.number}`
      ;(acc[key] = acc[key] ?? []).push(c.id)
      return acc
    }, {}),
  )
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, chapterIds: ids.sort() }))
    .sort((a, b) => a.key.localeCompare(b.key)),

  chapterTagVocabulary: {
    totalTagOccurrences: allChapterTags.length,
    distinctTags: [...new Set(allChapterTags)].length,
    byNamespace: tagNamespaces,
    facetValuesInUse: facetVocabulary,
    chaptersWithNoTags: CHAPTERS.filter(c => !c.tags?.length).map(c => c.id).sort(),
  },

  learningGraph: {
    conceptCount: ALL_CONCEPTS.length,
    courseNodes: conceptRows.filter(c => c.segments === 2).map(c => c.id),
    knowledgeAtomCountByNamespace: countBy(conceptRows.filter(c => c.segments >= 3), c => c.namespace),
    claimedSubjectNamespaces: [...CONCEPT_SUBJECT_NAMESPACES].sort(),
    facetNamespaces: [...FACET_NAMESPACES].sort(),
  },

  learnerBrowser: {
    subjects: browserRows,
    historySeriesPicker: readSeriesPicker('HISTORY_SERIES'),
    englishSeriesPicker: readSeriesPicker('ENGLISH_SERIES'),
    chapterHeaderImageOverrideIds: readMapKeys('features/subjects/Subjects.jsx', 'CHAPTER_HEADER_IMAGES').sort(),
    subjectDisplayTitleKeys: readMapKeys('features/subjects/Subjects.jsx', 'SUBJECT_DISPLAY_TITLES').sort(),
    subjectDescriptionKeys: readMapKeys('features/subjects/Subjects.jsx', 'SUBJECT_DESCRIPTIONS').sort(),
    subjectHeaderImageKeys: readMapKeys('features/subjects/Subjects.jsx', 'SUBJECT_HEADER_IMGS').sort(),
  },

  loaders: {
    count: loaderIds.length,
    idsWithoutChapterMetadata: loaderIds.filter(id => !CHAPTERS.some(c => c.id === id)).sort(),
    chaptersWithoutLoader: CHAPTERS.filter(c => !loaderIds.includes(c.id)).map(c => c.id).sort(),
    loadersResolvingToZeroScreens: sortedBy(
      loaderIds
        .filter(id => (contentById.get(id)?.screens?.length ?? 0) === 0)
        .map(id => ({ id })),
      'id',
    ).map(r => r.id),
  },

  tagChapterMap: {
    entryCount: Object.keys(TAG_CHAPTER_MAP).length,
    namespacedKeys: Object.keys(TAG_CHAPTER_MAP).filter(k => k.includes(':')).sort(),
    bareKeys: Object.keys(TAG_CHAPTER_MAP).filter(k => !k.includes(':')).sort(),
    nullTargets: Object.entries(TAG_CHAPTER_MAP).filter(([, v]) => v === null).map(([k]) => k).sort(),
    targetsMissingFromChapters: [...new Set(
      Object.values(TAG_CHAPTER_MAP).filter(Boolean).filter(id => !CHAPTERS.some(c => c.id === id)),
    )].sort(),
  },
}

// ─── Emit ───────────────────────────────────────────────────────────────────

const rendered = `${JSON.stringify(baseline, null, 2)}\n`

if (process.argv.includes('--check')) {
  const existing = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  if (existing === rendered) {
    console.log('curriculum-baseline:check — baseline matches the repository.')
    process.exit(0)
  }
  console.error('curriculum-baseline:check — baseline is STALE. Regenerate it.')
  process.exit(1)
}

writeFileSync(OUT, rendered)
console.log(`curriculum-baseline — wrote ${relative(REPO, OUT).split('\\').join('/')}`)
console.log(
  `  ${baseline.headline.totalChapters} chapters `
  + `(${baseline.headline.availableChapters} available, `
  + `${baseline.headline.comingSoonChapters} coming soon, `
  + `${baseline.headline.hiddenChapters} hidden) · `
  + `${baseline.headline.totalModules} modules · `
  + `${baseline.headline.learningGraphConcepts} concepts`,
)
