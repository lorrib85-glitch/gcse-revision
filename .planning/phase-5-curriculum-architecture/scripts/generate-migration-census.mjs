#!/usr/bin/env node
// Phase 5A — migration census generator.
//
// Enumerates every curriculum-bearing entity that exists in the repository
// today, joins it against the authored classification in
// `../census/entity-classifications.js`, and writes both a machine-readable
// census and a human census document.
//
// The join is the point. An entity that exists but carries no classification
// is a hard error, and a classification for an entity that no longer exists is
// a hard error too — so "nothing is left to inference during implementation"
// is a checked property rather than a promise.
//
//   node .planning/phase-5-curriculum-architecture/scripts/generate-migration-census.mjs
//   node .planning/phase-5-curriculum-architecture/scripts/generate-migration-census.mjs --check
//
// Measurement only: it reads src/**, writes nothing outside .planning/.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../..')
const OUT_JSON = join(HERE, '../census/migration-census.json')
const OUT_MD = join(HERE, '../census/MIGRATION_CENSUS.md')

const src = p => join(REPO, 'src', p)

const { CHAPTERS, getChapterAvailability } = await import(src('chapters.js'))
const { MODULES } = await import(src('data/modules.js'))
const { CHAPTER_CONTENT_LOADERS } = await import(src('content/chapterContentRegistry.js'))
const { SUBJECTS } = await import(src('constants/subjects.js'))
const { ALL_CONCEPTS } = await import(src('data/learningGraph/conceptRegistry.js'))
const { FACET_NAMESPACES } = await import(src('data/learningGraph/tagSchema.js'))
const { ALL_QUESTIONS } = await import(src('data/questionBanks/questionRegistry.js'))
const { ALL_MEDICINE_PAPERS } = await import(src('data/medicineExamPapers.js'))
const { getSubjectChapterList } = await import(src('features/subjects/subjectCatalogue.js'))
const { CLASSIFICATIONS, CLASSIFICATION_VALUES } = await import(join(HERE, '../census/entity-classifications.js'))

// ─── Source-literal readers (React files cannot be imported here) ───────────

const SUBJECTS_JSX = readFileSync(src('features/subjects/Subjects.jsx'), 'utf8')

function readLiteralList(name) {
  const match = SUBJECTS_JSX.match(new RegExp(`const ${name} = \\[([^\\]]+)\\]`))
  if (!match) throw new Error(`${name} literal not found in Subjects.jsx`)
  return match[1].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean)
}

function readSeriesPicker(name) {
  const block = SUBJECTS_JSX.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) throw new Error(`${name} literal not found in Subjects.jsx`)
  const rows = [...block[1].matchAll(/id: '([^']+)',\s*\n\s*title: '([^']+)'[\s\S]*?comingSoon: (true|false)/g)]
  if (rows.length === 0) throw new Error(`${name} parsed to zero entries`)
  return rows.map(m => ({ id: m[1], title: m[2], comingSoon: m[3] === 'true' }))
}

// ─── Enumerate live entities ────────────────────────────────────────────────

const entities = []
const add = (kind, id, facts) => entities.push({ key: `${kind}:${id}`, kind, id, facts })

// 1. Subject theme keys
for (const name of Object.keys(SUBJECTS).sort()) {
  add('theme-key', name, {
    hasBrowserAccentPair: Boolean(SUBJECTS[name].subjectBrowserAccent && SUBJECTS[name].subjectBrowserAccentDark),
    chaptersUsingIt: CHAPTERS.filter(c => c.subject === name).length,
    modulesUsingIt: MODULES.filter(m => m.subject === name).length,
    inLearnerBrowser: readLiteralList('SUBJECT_NAMES').includes(name),
  })
}

// 2. Modules
for (const mod of MODULES) {
  const chapters = mod.chapterIds.map(id => CHAPTERS.find(c => c.id === id)).filter(Boolean)
  add('module', mod.id, {
    title: mod.title,
    subject: mod.subject,
    chapterCount: mod.chapterIds.length,
    availableChapterCount: chapters.filter(c => getChapterAvailability(c) === 'available').length,
    distinctSeriesValues: [...new Set(chapters.map(c => c.series ?? null))].sort(),
  })
}

// 3. Chapters (identity) and 4. loaders (content source) — enumerated separately
//    because the census must be able to classify them differently.
const loaderIds = Object.keys(CHAPTER_CONTENT_LOADERS)
const contentById = new Map()
for (const id of loaderIds) contentById.set(id, await CHAPTER_CONTENT_LOADERS[id]())

const moduleOfChapter = new Map()
for (const mod of MODULES) for (const id of mod.chapterIds) moduleOfChapter.set(id, mod.id)

for (const chapter of [...CHAPTERS].sort((a, b) => a.id.localeCompare(b.id))) {
  add('chapter', chapter.id, {
    subject: chapter.subject ?? null,
    series: chapter.series ?? null,
    number: chapter.number ?? null,
    availability: getChapterAvailability(chapter),
    parentModuleId: moduleOfChapter.get(chapter.id) ?? null,
    declaredScreenCount: chapter.screenCount ?? null,
    actualScreenCount: contentById.get(chapter.id)?.screens?.length ?? null,
  })
}

const loaderSources = Object.fromEntries(
  [...readFileSync(src('content/chapterContentRegistry.js'), 'utf8')
    .matchAll(/'([^']+)': \(\) => import\('\.\/([^']+)'\)/g)]
    .map(m => [m[1], `src/content/${m[2]}`]),
)

for (const id of [...loaderIds].sort()) {
  add('chapter-loader', id, {
    contentPath: loaderSources[id] ?? null,
    screens: contentById.get(id)?.screens?.length ?? 0,
    hasChapterMetadata: CHAPTERS.some(c => c.id === id),
  })
}

// 5. Chapter `series` values
const seriesValues = [...new Set(CHAPTERS.map(c => c.series).filter(Boolean))].sort()
for (const value of seriesValues) {
  add('chapter-series', value, {
    chapters: CHAPTERS.filter(c => c.series === value).length,
    subjects: [...new Set(CHAPTERS.filter(c => c.series === value).map(c => c.subject))].sort(),
  })
}

// 6. Synthetic browser placeholders
const browserSubjects = readLiteralList('SUBJECT_NAMES')
for (const subject of browserSubjects) {
  for (const card of getSubjectChapterList(subject).filter(c => c.comingSoon)) {
    add('browser-placeholder', card.id, {
      subject,
      title: card.title ?? null,
      series: card.series ?? null,
      hasChapterMetadata: CHAPTERS.some(c => c.id === card.id),
      hasLoader: loaderIds.includes(card.id),
    })
  }
}

// 7. Subject-browser series tabs
for (const [pickerName, subject] of [['HISTORY_SERIES', 'History'], ['ENGLISH_SERIES', 'English']]) {
  for (const tab of readSeriesPicker(pickerName)) {
    add('browser-series-tab', `${subject.toLowerCase()}/${tab.id}`, {
      subject,
      title: tab.title,
      markedComingSoon: tab.comingSoon,
      backingChapters: CHAPTERS.filter(c => c.subject === subject && c.series === tab.id).length,
    })
  }
}

// 8. Learning-graph course nodes (two-segment concept ids)
for (const concept of ALL_CONCEPTS.filter(c => c.id.split(':').length === 2).sort((a, b) => a.id.localeCompare(b.id))) {
  add('course-node', concept.id, {
    label: concept.label,
    atomsUnderIt: ALL_CONCEPTS.filter(c => c.id.startsWith(`${concept.id}:`)).length,
  })
}

// 9. Concept collections (one file per collection)
const CONCEPTS_DIR = src('data/learningGraph/concepts')
for (const file of readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.js')).sort()) {
  const prefixes = [...new Set(
    ALL_CONCEPTS
      .filter(c => readFileSync(join(CONCEPTS_DIR, file), 'utf8').includes(`'${c.id}'`))
      .map(c => c.id.split(':').slice(0, 2).join(':')),
  )].sort()
  add('concept-collection', file, { coursePrefixes: prefixes })
}

// 10–13. Facet tags that carry curriculum meaning: course / examboard / paper / tier
const taggedSources = [
  ...CHAPTERS.map(c => ({ from: 'chapter', tags: c.tags ?? [] })),
  ...ALL_QUESTIONS.map(q => ({ from: 'question', tags: q.tags ?? [] })),
  ...ALL_MEDICINE_PAPERS.map(p => ({ from: 'exam-paper', tags: p.tags ?? [] })),
]
const CURRICULUM_FACETS = ['course', 'examboard', 'paper', 'tier']
const facetUse = new Map()
for (const { from, tags } of taggedSources) {
  for (const tag of tags) {
    const [ns] = tag.split(':')
    if (!CURRICULUM_FACETS.includes(ns)) continue
    if (!facetUse.has(tag)) facetUse.set(tag, new Set())
    facetUse.get(tag).add(from)
  }
}
for (const tag of [...facetUse.keys()].sort()) {
  add('curriculum-facet-tag', tag, { usedBy: [...facetUse.get(tag)].sort() })
}

// ─── Join against the authored classification ───────────────────────────────

const problems = []
const classifiedKeys = new Set(Object.keys(CLASSIFICATIONS))

const rows = entities.map(entity => {
  const decision = CLASSIFICATIONS[entity.key]
  if (!decision) {
    problems.push(`UNCLASSIFIED: "${entity.key}" exists in the repository but has no census entry`)
    return { ...entity, classification: null, target: null, note: null }
  }
  classifiedKeys.delete(entity.key)
  if (!CLASSIFICATION_VALUES.includes(decision.classification)) {
    problems.push(`INVALID CLASSIFICATION: "${entity.key}" → "${decision.classification}"`)
  }
  if (!decision.note || decision.note.trim().length === 0) {
    problems.push(`MISSING NOTE: "${entity.key}" has no note`)
  }
  return {
    ...entity,
    classification: decision.classification,
    target: decision.target ?? null,
    note: decision.note,
  }
})

for (const stale of [...classifiedKeys].sort()) {
  problems.push(`STALE: census classifies "${stale}", which no longer exists in the repository`)
}

if (problems.length > 0) {
  console.error('migration-census — the census does not match the repository:\n')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

// ─── Render ─────────────────────────────────────────────────────────────────

const byKind = {}
for (const row of rows) (byKind[row.kind] = byKind[row.kind] ?? []).push(row)

const byClassification = {}
for (const row of rows) byClassification[row.classification] = (byClassification[row.classification] ?? 0) + 1

const census = {
  $schema: 'phase-5a-migration-census/1',
  about:
    'Every curriculum-bearing entity in the repository, with its proposed classification in the '
    + 'canonical curriculum ontology. Generated — regenerate with '
    + relative(REPO, fileURLToPath(import.meta.url)).split('\\').join('/'),
  classificationValues: CLASSIFICATION_VALUES,
  totals: {
    entities: rows.length,
    byKind: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length]).sort(([a], [b]) => a.localeCompare(b))),
    byClassification: Object.fromEntries(Object.entries(byClassification).sort(([a], [b]) => a.localeCompare(b))),
  },
  entities: rows,
}

const renderedJson = `${JSON.stringify(census, null, 2)}\n`

const KIND_TITLES = {
  'theme-key': 'Subject theme keys',
  'module': 'Modules',
  'chapter': 'Chapters',
  'chapter-loader': 'Chapter content loaders',
  'chapter-series': 'Chapter `series` values',
  'browser-placeholder': 'Synthetic browser placeholders',
  'browser-series-tab': 'Subject-browser series tabs',
  'course-node': 'Learning-graph course nodes',
  'concept-collection': 'Concept collections',
  'curriculum-facet-tag': 'Curriculum-bearing facet tags',
}

const lines = []
lines.push('# Phase 5A — migration census')
lines.push('')
lines.push('> **GENERATED FILE — do not edit.**')
lines.push('> Source: `census/entity-classifications.js` joined against the live repository by')
lines.push('> `scripts/generate-migration-census.mjs`. Regenerate after any classification change.')
lines.push('')
lines.push(`Every curriculum-bearing entity that exists in the repository today — **${rows.length}** of them —`)
lines.push('with the classification it is proposed to carry in the canonical curriculum ontology.')
lines.push('The generator fails if an entity is unclassified, if a classification names an entity that no')
lines.push('longer exists, or if a classification carries no note. Nothing here is left to inference.')
lines.push('')
lines.push('## Totals by classification')
lines.push('')
lines.push('| Classification | Entities |')
lines.push('|---|---:|')
for (const [name, count] of Object.entries(census.totals.byClassification)) {
  lines.push(`| \`${name}\` | ${count} |`)
}
lines.push('')
lines.push('## Totals by entity kind')
lines.push('')
lines.push('| Kind | Entities |')
lines.push('|---|---:|')
for (const [kind, count] of Object.entries(census.totals.byKind)) {
  lines.push(`| ${KIND_TITLES[kind] ?? kind} | ${count} |`)
}
lines.push('')

for (const kind of Object.keys(KIND_TITLES)) {
  const group = byKind[kind]
  if (!group) continue
  lines.push(`## ${KIND_TITLES[kind]} (${group.length})`)
  lines.push('')
  lines.push('| Entity | Classification | Target | Note |')
  lines.push('|---|---|---|---|')
  for (const row of group) {
    const target = row.target ? `\`${row.target}\`` : '—'
    lines.push(`| \`${row.id}\` | \`${row.classification}\` | ${target} | ${row.note.replace(/\|/g, '\\|')} |`)
  }
  lines.push('')
}

const renderedMd = `${lines.join('\n')}\n`

if (process.argv.includes('--check')) {
  const staleJson = !existsSync(OUT_JSON) || readFileSync(OUT_JSON, 'utf8') !== renderedJson
  const staleMd = !existsSync(OUT_MD) || readFileSync(OUT_MD, 'utf8') !== renderedMd
  if (staleJson || staleMd) {
    console.error('migration-census:check — census output is STALE. Regenerate it.')
    process.exit(1)
  }
  console.log('migration-census:check — census matches the repository.')
  process.exit(0)
}

writeFileSync(OUT_JSON, renderedJson)
writeFileSync(OUT_MD, renderedMd)
console.log(`migration-census — ${rows.length} entities classified, no gaps.`)
for (const [name, count] of Object.entries(census.totals.byClassification)) {
  console.log(`  ${String(count).padStart(3)}  ${name}`)
}
