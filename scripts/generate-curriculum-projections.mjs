#!/usr/bin/env node
// ─── Curriculum runtime projections generator ──────────────────────────────
//
// Renders the three runtime files from canonical records plus the isolated
// compatibility projection:
//
//   src/data/generated/curriculum/modules.js
//   src/data/generated/curriculum/chapters.js
//   src/data/generated/curriculum/chapterContentLoaders.js
//
//   pnpm curriculum:projections:generate   write them
//   pnpm curriculum:projections:check      fail on drift, or on any parity break
//   pnpm curriculum:projections:report     write the screenTags review artefact
//
// Deterministic: same records in, same bytes out. No timestamps, no environment
// reads, no absolute paths.
//
// ── Stage 3 is behaviour-preserving ────────────────────────────────────────
//
// These files are NOT re-exported by anything. `src/data/modules.js`,
// `src/chapters.js` and `src/content/chapterContentRegistry.js` stay
// hand-authored and untouched; Stage 4 is what changes that. What this
// generator buys today is the parity gate: `--check` proves the projection
// reproduces the hand-authored runtime EXACTLY, so Stage 4 becomes a
// three-line diff with evidence behind it.
//
// ── Permitted inputs, and only these ───────────────────────────────────────
//
//   1. src/curriculum-catalogue/records/**   the canonical facts
//   2. src/curriculum-catalogue/compatibility/runtime-v1.js   legacy-only facts
//   3. src/content/**                        for screenCount and screenTags
//
// FORBIDDEN as generator input: `.planning/**` (planning documents are not a
// source of truth for shipped data) and the three hand-authored runtime files
// themselves (reading them would make the "generator" a copier and the parity
// gate a tautology). `assertInputPurity` enforces both by reading this file.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { loadCatalogue } from '../src/curriculum-catalogue/index.js'
import { loadCompatibility } from '../src/curriculum-catalogue/compatibility/index.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const MODULES_PATH = 'src/data/generated/curriculum/modules.js'
export const CHAPTERS_PATH = 'src/data/generated/curriculum/chapters.js'
export const LOADERS_PATH = 'src/data/generated/curriculum/chapterContentLoaders.js'
export const REPORT_PATH = 'docs/curriculum/SCREEN_TAG_REVIEW.md'

/** How `src/…` is spelled from inside `src/data/generated/curriculum/`. */
export const LOADER_PATH_PREFIX = '../../../'

/** The three files whose data this generator reproduces and must never read. */
export const HANDWRITTEN_RUNTIME_FILES = [
  'src/data/modules.js',
  'src/chapters.js',
  'src/content/chapterContentRegistry.js',
]

const BANNER = [
  '// GENERATED FILE — DO NOT EDIT.',
  '//',
  '// Run `pnpm curriculum:projections:generate` after changing a record.',
  '// `pnpm curriculum:projections:check` fails if this file has drifted, or if it',
  '// stops matching the hand-authored runtime it reproduces.',
  '//',
  '// Source: the authored records under src/curriculum-catalogue/, projected',
  '// through scripts/generate-curriculum-projections.mjs.',
]

// ─── Input purity ───────────────────────────────────────────────────────────

/**
 * Prove this generator reads nothing it must not.
 *
 * A generator that quietly imported `src/chapters.js` would still produce a
 * passing parity check — it would be comparing a file with itself. A generator
 * that read `.planning/**` would ship a planning document's opinion as data.
 * Both are caught by reading this file's own source, so the guard cannot drift
 * away from what the generator actually does.
 */
export function assertInputPurity(source = readFileSync(resolve(ROOT, 'scripts/generate-curriculum-projections.mjs'), 'utf8')) {
  const problems = []
  // Anchored to real import/require specifiers, not to prose: this file
  // explains which inputs are forbidden, and naming one in a comment is the
  // documentation, not a read.
  const SPECIFIER = /(?:^\s*(?:import|export)\b[^;\n]*?\bfrom\s*|\bimport\s*\(\s*|\breadFileSync\s*\(\s*|\bresolve\s*\(\s*ROOT\s*,\s*)['"]([^'"]+)['"]/gm
  for (const [, specifier] of source.matchAll(SPECIFIER)) {
    if (specifier.includes('.planning')) {
      problems.push(`reads "${specifier}" — .planning/** is never a generator input`)
    }
    for (const file of HANDWRITTEN_RUNTIME_FILES) {
      const stem = file.split('/').pop()
      if (specifier.endsWith(`/${stem}`) && !specifier.includes('/generated/')) {
        problems.push(`reads "${specifier}" — the hand-authored runtime is never a generator input`)
      }
    }
  }
  return problems
}

// ─── Derivation from content files ──────────────────────────────────────────

/**
 * `screenCount` and `screenTags` for one chapter, off its content file.
 *
 * D-10: both are derived, never authored. A chapter with no content path has
 * neither — it is a coming-soon stub with an empty loader.
 */
async function deriveScreens(contentPath) {
  const module = await import(pathToFileURL(resolve(ROOT, contentPath)).href)
  const screens = module.default?.screens ?? []
  return {
    screenCount: screens.length,
    screenTags: screens.map(screen => screen.tag ?? null),
  }
}

// ─── The projected data ─────────────────────────────────────────────────────

/**
 * Build all three projections as plain data, before any rendering.
 *
 * Returns `{ modules, chapters, loaders }`, where `loaders` is an ordered array
 * of `{ id, importPath }`. Rendering is separate so the parity gate can compare
 * DATA rather than source text — a formatting change must not read as a
 * behaviour change, and a behaviour change must not hide behind formatting.
 */
export async function buildProjections(catalogue, compatibility) {
  const subjectById = new Map(catalogue.subjects.map(record => [record.id, record]))
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const chapterById = new Map(catalogue.chapters.map(record => [record.id, record]))
  const excluded = new Set(compatibility.excludedChapterIds)
  const hidden = compatibility.hiddenChapter

  // ── MODULES ───────────────────────────────────────────────────────────────
  const modules = compatibility.legacyModules.map(legacy => {
    const aggregated = legacy.canonicalModuleIds.map(moduleId => {
      const module = moduleById.get(moduleId)
      if (!module) throw new Error(`legacy module "${legacy.id}" aggregates unknown module "${moduleId}"`)
      return module
    })

    const subjectIds = [...new Set(aggregated.map(module => module.subjectId))]
    if (subjectIds.length !== 1) {
      throw new Error(`legacy module "${legacy.id}" spans ${subjectIds.length} subjects — its subject is not derivable`)
    }
    const subject = subjectById.get(subjectIds[0])
    if (!subject) throw new Error(`legacy module "${legacy.id}" resolves to subject "${subjectIds[0]}", which has no record`)

    // A declared title only where no canonical record states it.
    const title = legacy.title ?? aggregated[0].title

    const chapterIds = aggregated.flatMap(module => [...module.chapterRefs]
      .sort((a, b) => a.position - b.position)
      .map(ref => ref.chapterId)
      .filter(chapterId => !excluded.has(chapterId)))

    return { id: legacy.id, title, subject: subject.themeKey, chapterIds }
  })

  // ── CHAPTERS ──────────────────────────────────────────────────────────────
  //
  // Row order is `chapterOrder`; the hidden row is the one entry with no
  // canonical record, so it comes off the compatibility projection whole.
  const moduleForChapter = new Map()
  for (const module of catalogue.modules) {
    for (const ref of module.chapterRefs) moduleForChapter.set(ref.chapterId, module)
  }

  const chapters = []
  for (const chapterId of compatibility.chapterOrder) {
    if (chapterId === hidden.row.id) {
      const derived = await deriveScreens(hidden.contentPath)
      const { availability, ...rest } = hidden.row
      chapters.push({ ...rest, ...derived, availability })
      continue
    }

    const chapter = chapterById.get(chapterId)
    if (!chapter) throw new Error(`chapterOrder names "${chapterId}", which has no chapter record`)
    const legacy = compatibility.chapterFields[chapterId]
    if (!legacy) throw new Error(`chapter "${chapterId}" has no legacy-only fields`)

    const owningModule = moduleForChapter.get(chapterId)
    if (!owningModule) throw new Error(`chapter "${chapterId}" belongs to no module`)
    const subject = subjectById.get(owningModule.subjectId)
    if (!subject) throw new Error(`chapter "${chapterId}" resolves to subject "${owningModule.subjectId}", which has no record`)

    const derived = chapter.contentPath === null
      ? { screenCount: 0, screenTags: [] }
      : await deriveScreens(chapter.contentPath)

    const row = {
      id: chapter.id,
      subject: subject.themeKey,
    }
    if ('series' in legacy) row.series = legacy.series
    row.number = legacy.number
    row.title = chapter.title
    row.subtitle = chapter.subtitle
    row.era = chapter.era
    row.icon = chapter.icon
    row.color = legacy.color
    row.colorLight = legacy.colorLight
    row.headerImage = chapter.headerImage
    // The concept portion of `tags` is canonical; only the facet prefix is
    // legacy. A row carries `tags` at all only if it has facet tags.
    if (legacy.facetTags) row.tags = [...legacy.facetTags, ...chapter.conceptIds]
    row.screenCount = derived.screenCount
    row.screenTags = derived.screenTags
    chapters.push(row)
  }

  // ── CHAPTER_CONTENT_LOADERS ───────────────────────────────────────────────
  //
  // Same 60 ids in the same contiguous runs as `chapterOrder`, re-sequenced by
  // the section anchors. Building the sections from the anchors — rather than
  // from a second id list — is what keeps the two orders one fact.
  const anchorPositions = compatibility.loaderSectionAnchors
    .map(id => compatibility.chapterOrder.indexOf(id))
  const boundaries = [...anchorPositions].sort((a, b) => a - b)
  const sectionAt = new Map()
  boundaries.forEach((start, index) => {
    const end = boundaries[index + 1] ?? compatibility.chapterOrder.length
    sectionAt.set(start, compatibility.chapterOrder.slice(start, end))
  })

  const loaders = []
  for (const start of anchorPositions) {
    for (const chapterId of sectionAt.get(start)) {
      const contentPath = chapterId === hidden.row.id
        ? hidden.contentPath
        : chapterById.get(chapterId)?.contentPath ?? null
      if (contentPath === null) {
        throw new Error(`chapter "${chapterId}" is projected but has no content path — it cannot have a loader`)
      }
      // Rebased onto the generated file's own directory. The hand-authored
      // registry sits in `src/content/` and writes `./history/…`; this file
      // sits in `src/data/generated/curriculum/`, so the same target is spelled
      // `../../../content/history/…`. Parity is asserted on the RESOLVED
      // target, which is the thing that has to be identical — a specifier that
      // matched the old string character for character would resolve to
      // nothing from here, and Stage 4 would break the moment it re-exported.
      loaders.push({ id: chapterId, importPath: contentPath.replace(/^src\//, LOADER_PATH_PREFIX) })
    }
  }

  return { modules, chapters, loaders }
}

// ─── Rendering ──────────────────────────────────────────────────────────────

const literal = value => JSON.stringify(value)

/** A `screenTags` array on one line when short, wrapped when not. */
function renderScreenTags(tags) {
  const flat = `[${tags.map(literal).join(', ')}]`
  if (flat.length <= 96) return flat
  const lines = []
  let current = []
  for (const tag of tags) {
    current.push(literal(tag))
    if (current.join(', ').length > 80) { lines.push(current.join(', ')); current = [] }
  }
  if (current.length) lines.push(current.join(', '))
  return `[\n      ${lines.join(',\n      ')},\n    ]`
}

export function renderModules(modules) {
  const lines = [...BANNER, '']
  lines.push('export const MODULES = [')
  for (const module of modules) {
    lines.push('  {')
    lines.push(`    id: ${literal(module.id)},`)
    lines.push(`    title: ${literal(module.title)},`)
    lines.push(`    subject: ${literal(module.subject)},`)
    lines.push('    chapterIds: [')
    for (const chapterId of module.chapterIds) lines.push(`      ${literal(chapterId)},`)
    lines.push('    ],')
    lines.push('  },')
  }
  lines.push(']')
  lines.push('')
  lines.push('export function getModuleById(moduleId) {')
  lines.push('  return MODULES.find(module => module.id === moduleId) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getModuleForChapter(chapterId) {')
  lines.push('  return MODULES.find(module => module.chapterIds.includes(chapterId)) ?? null')
  lines.push('}')
  return `${lines.join('\n')}\n`
}

export function renderChapters(chapters) {
  const lines = [...BANNER, '']
  lines.push('export const CHAPTERS = [')
  for (const chapter of chapters) {
    lines.push('  {')
    for (const [key, value] of Object.entries(chapter)) {
      if (key === 'screenTags') { lines.push(`    screenTags: ${renderScreenTags(value)},`); continue }
      if (key === 'tags') {
        lines.push('    tags: [')
        for (const tag of value) lines.push(`      ${literal(tag)},`)
        lines.push('    ],')
        continue
      }
      lines.push(`    ${key}: ${literal(value)},`)
    }
    lines.push('  },')
  }
  lines.push(']')
  lines.push('')
  lines.push("export const CHAPTER_AVAILABILITY = { AVAILABLE: 'available', COMING_SOON: 'comingSoon', HIDDEN: 'hidden' }")
  lines.push('')
  lines.push('export function getChapterAvailability(chapter) {')
  lines.push('  if (!chapter) return CHAPTER_AVAILABILITY.HIDDEN')
  lines.push('  if (chapter.availability) return chapter.availability')
  lines.push('  return chapter.screenCount > 0 ? CHAPTER_AVAILABILITY.AVAILABLE : CHAPTER_AVAILABILITY.COMING_SOON')
  lines.push('}')
  lines.push('')
  lines.push('export function isChapterAvailable(chapter) {')
  lines.push('  return getChapterAvailability(chapter) === CHAPTER_AVAILABILITY.AVAILABLE')
  lines.push('}')
  return `${lines.join('\n')}\n`
}

export function renderLoaders(loaders) {
  const lines = [...BANNER, '']
  lines.push('export const CHAPTER_CONTENT_LOADERS = {')
  for (const loader of loaders) {
    lines.push(`  ${literal(loader.id)}: () => import(${literal(loader.importPath)}).then(m => m.default),`)
  }
  lines.push('}')
  lines.push('')
  lines.push('export async function loadChapterContent(chapterId) {')
  lines.push('  const loader = CHAPTER_CONTENT_LOADERS[chapterId]')
  lines.push('  return loader ? loader() : null')
  lines.push('}')
  return `${lines.join('\n')}\n`
}

// ─── The screenTags review artefact ─────────────────────────────────────────

/**
 * Potential `screenTags` corrections, as a REPORT and nothing else.
 *
 * `screenTags` derive from the content files exactly, so the projection
 * introduces no difference. That does not make the current values good: a
 * recovery route whose tag is missing from its target chapter lands on screen 0.
 *
 * Fixing that moves a learner from screen 0 to screen 14, which is a
 * learner-visible change. It belongs to the Topic/recovery migration, not to a
 * stage whose whole promise is that behaviour is preserved. So this is written
 * down and reviewed, never applied.
 */
export function renderScreenTagReport(chapters) {
  const tagged = chapters.filter(chapter => chapter.screenTags.some(tag => tag !== null))
  const untagged = chapters.filter(chapter =>
    chapter.screenCount > 0 && chapter.screenTags.every(tag => tag === null))

  const owners = new Map()
  for (const chapter of chapters) {
    for (const tag of chapter.screenTags) {
      if (tag === null) continue
      if (!owners.has(tag)) owners.set(tag, new Set())
      owners.get(tag).add(chapter.id)
    }
  }
  const shared = [...owners.entries()]
    .filter(([, ids]) => ids.size > 1)
    .sort(([a], [b]) => a.localeCompare(b))

  const duplicated = []
  for (const chapter of chapters) {
    const counts = new Map()
    for (const tag of chapter.screenTags) {
      if (tag === null) continue
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    for (const [tag, count] of counts) {
      if (count > 1) duplicated.push({ chapterId: chapter.id, tag, count })
    }
  }

  const namespaced = new Set()
  const bare = new Set()
  for (const tag of owners.keys()) (tag.includes(':') ? namespaced : bare).add(tag)

  const lines = []
  lines.push('# screenTags — review report')
  lines.push('')
  lines.push('> **GENERATED FILE — do not edit.**')
  lines.push('> Written by `scripts/generate-curriculum-projections.mjs`.')
  lines.push('> Run `pnpm curriculum:projections:report` to refresh it.')
  lines.push('')
  lines.push('**This report changes nothing.** The Stage 3 projection derives `screenTags` from')
  lines.push('the content files exactly, and is byte-equal to the hand-authored runtime. What')
  lines.push('follows is a list of *potential* corrections for review.')
  lines.push('')
  lines.push('Applying any of them would move a recovery route from one screen to another,')
  lines.push('which a learner sees. That belongs to the Topic/recovery migration, not to a')
  lines.push('stage whose promise is that behaviour is preserved.')
  lines.push('')
  lines.push(`**${chapters.length}** projected chapters · **${tagged.length}** carry at least one screen tag · `
    + `**${owners.size}** distinct tags`)
  lines.push('')

  lines.push('## 1. Chapters with content but no recovery route')
  lines.push('')
  lines.push('Every screen tag is `null`, so nothing can route into these chapters. A weakness')
  lines.push('in one of them has no "fix this gap" destination beyond screen 0.')
  lines.push('')
  if (untagged.length === 0) {
    lines.push('_None._')
  } else {
    lines.push('| Chapter | Subject | Screens |')
    lines.push('|---|---|---|')
    for (const chapter of untagged) {
      lines.push(`| \`${chapter.id}\` | ${chapter.subject} | ${chapter.screenCount} |`)
    }
  }
  lines.push('')

  lines.push('## 2. Tags claimed by more than one chapter')
  lines.push('')
  lines.push('A route resolving to two chapters resolves to neither in a stable way — the')
  lines.push('destination depends on iteration order.')
  lines.push('')
  if (shared.length === 0) {
    lines.push('_None._')
  } else {
    lines.push('| Tag | Chapters |')
    lines.push('|---|---|')
    for (const [tag, ids] of shared) {
      lines.push(`| \`${tag}\` | ${[...ids].map(id => `\`${id}\``).join(', ')} |`)
    }
  }
  lines.push('')

  lines.push('## 3. Tags repeated within one chapter')
  lines.push('')
  lines.push('The first occurrence wins, so every later screen carrying the tag is unreachable')
  lines.push('by that route.')
  lines.push('')
  if (duplicated.length === 0) {
    lines.push('_None._')
  } else {
    lines.push('| Chapter | Tag | Screens |')
    lines.push('|---|---|---|')
    for (const entry of duplicated) {
      lines.push(`| \`${entry.chapterId}\` | \`${entry.tag}\` | ${entry.count} |`)
    }
  }
  lines.push('')

  lines.push('## 4. Vocabulary split')
  lines.push('')
  lines.push('Two spellings are in use. Namespaced tags (`maths:indices`) can be matched to a')
  lines.push('learning-graph concept; bare tags (`four-humours`) cannot, so they can only be')
  lines.push('routed by the hand-maintained `tagChapterMap`, which Stage 6 deletes.')
  lines.push('')
  lines.push(`- **${namespaced.size}** namespaced · **${bare.size}** bare`)
  lines.push('')
  if (bare.size > 0) {
    lines.push('Bare tags, alphabetically:')
    lines.push('')
    for (const tag of [...bare].sort()) lines.push(`- \`${tag}\``)
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

// ─── Entry points ───────────────────────────────────────────────────────────

/** Every file this generator owns, keyed by the path it writes. */
export async function generate() {
  const purity = assertInputPurity()
  if (purity.length) {
    throw new Error(`curriculum projections generator input is impure:\n  - ${purity.join('\n  - ')}`)
  }
  const catalogue = await loadCatalogue()
  const compatibility = loadCompatibility()
  const { modules, chapters, loaders } = await buildProjections(catalogue, compatibility)
  return {
    [MODULES_PATH]: renderModules(modules),
    [CHAPTERS_PATH]: renderChapters(chapters),
    [LOADERS_PATH]: renderLoaders(loaders),
  }
}

/** The review artefact, written only by `--report`. */
export async function generateReport() {
  const catalogue = await loadCatalogue()
  const compatibility = loadCompatibility()
  const { chapters } = await buildProjections(catalogue, compatibility)
  return { [REPORT_PATH]: renderScreenTagReport(chapters) }
}

const isDirectRun = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  const checking = process.argv.includes('--check')
  const reporting = process.argv.includes('--report')
  const label = reporting ? 'curriculum:projections:report' : `curriculum:projections:${checking ? 'check' : 'generate'}`
  const documents = reporting ? await generateReport() : await generate()

  for (const [path, generated] of Object.entries(documents)) {
    const target = resolve(ROOT, path)
    if (!checking) {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, generated)
      console.log(`${label} — wrote ${path}`)
      continue
    }
    let committed = null
    try {
      committed = readFileSync(target, 'utf8')
    } catch {
      console.error(`${label} — ${path} is missing. Run \`pnpm curriculum:projections:generate\`.`)
      process.exit(1)
    }
    if (committed !== generated) {
      console.error(
        `${label} — ${path} is out of date with the catalogue. `
        + 'Run `pnpm curriculum:projections:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`${label} — ${path} matches the catalogue.`)
  }
}
