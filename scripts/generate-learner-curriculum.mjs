#!/usr/bin/env node
// ─── Canonical learner-curriculum runtime generator ────────────────────────
//
// Renders the production query model used by progress, planning, ChapterPlayer
// and chapter loading. Inputs are canonical curriculum records, the explicit
// Learning Sequence configuration and Chapter content files for derived screen
// metadata. It never reads the old compatibility projection or browser output.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { loadCatalogue } from '../src/curriculum-catalogue/index.js'
import { loadLearningSequences } from '../src/curriculum-catalogue/runtime/index.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const RUNTIME_PATH = 'src/data/generated/curriculum/learnerCurriculum.js'
export const RUNTIME_DOC_PATH = 'docs/curriculum/LEARNER_CURRICULUM_MAP.md'
export const LOADER_PATH_PREFIX = '../../../'

const BANNER = [
  '// GENERATED FILE — DO NOT EDIT.',
  '//',
  '// Run `pnpm curriculum:runtime:generate` after changing canonical curriculum',
  '// records, Learning Sequences or Chapter content.',
  '// `pnpm curriculum:runtime:check` fails when this projection drifts.',
  '//',
  '// Production imports this model through src/data/learnerCurriculum.js.',
  '//',
  '// Source: canonical curriculum records + build-time Learning Sequences +',
  '// derived screen metadata. No runtime-v1 compatibility data is an input.',
]

const FORBIDDEN_INPUTS = [
  '.planning/',
  'src/curriculum-catalogue/compatibility/',
  'tests/fixtures/',
  'src/data/generated/curriculum/navigation.js',
  'src/data/generated/curriculum/modules.js',
  'src/data/generated/curriculum/chapters.js',
  'src/data/generated/curriculum/chapterContentLoaders.js',
  'src/data/modules.js',
  'src/chapters.js',
  'src/content/chapterContentRegistry.js',
]

export function assertInputPurity(source = readFileSync(resolve(ROOT, 'scripts/generate-learner-curriculum.mjs'), 'utf8')) {
  const problems = []
  const SPECIFIER = /(?:^\s*(?:import|export)\b[^;\n]*?\bfrom\s*|\bimport\s*\(\s*|\breadFileSync\s*\(\s*|\bresolve\s*\(\s*ROOT\s*,\s*)['"]([^'"]+)['"]/gm
  for (const [, specifier] of source.matchAll(SPECIFIER)) {
    for (const forbidden of FORBIDDEN_INPUTS) {
      if (specifier.includes(forbidden) || specifier.endsWith(forbidden)) {
        problems.push(`reads "${specifier}" — learner runtime must not use ${forbidden} as input`)
      }
    }
  }
  return problems
}

async function deriveScreens(contentPath) {
  if (contentPath === null) return { screenCount: 0, screenTags: [] }
  const module = await import(pathToFileURL(resolve(ROOT, contentPath)).href)
  const screens = module.default?.screens ?? []
  return {
    screenCount: screens.length,
    screenTags: screens.map(screen => screen.tag ?? null),
  }
}

const byPosition = (left, right) => left.position - right.position

export async function buildLearnerCurriculum(catalogue, configuredSequences) {
  const subjectById = new Map(catalogue.subjects.map(record => [record.id, record]))
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const chapterById = new Map(catalogue.chapters.map(record => [record.id, record]))

  const ownerByChapter = new Map()
  for (const module of catalogue.modules) {
    for (const ref of module.chapterRefs) ownerByChapter.set(ref.chapterId, { module, ref })
  }

  const sequenceByModule = new Map()
  const sequencePositionByChapter = new Map()
  const sequences = [...configuredSequences].sort(byPosition).map(sequence => {
    const modules = sequence.moduleIds.map(moduleId => {
      const module = moduleById.get(moduleId)
      if (!module) throw new Error(`Learning Sequence "${sequence.id}" references unknown Module "${moduleId}"`)
      sequenceByModule.set(moduleId, sequence.id)
      return module
    })
    const chapterIds = modules.flatMap(module => [...module.chapterRefs]
      .sort(byPosition)
      .map(ref => ref.chapterId)
      .filter(chapterId => chapterById.get(chapterId)?.status !== 'retired'))
    chapterIds.forEach((chapterId, index) => {
      sequencePositionByChapter.set(chapterId, { sequenceId: sequence.id, position: index })
    })
    const subject = subjectById.get(sequence.subjectId)
    if (!subject) throw new Error(`Learning Sequence "${sequence.id}" references unknown Subject "${sequence.subjectId}"`)
    return {
      id: sequence.id,
      position: sequence.position,
      title: sequence.title,
      subjectId: sequence.subjectId,
      subject: subject.themeKey,
      moduleIds: [...sequence.moduleIds],
      chapterIds,
    }
  })

  const modules = catalogue.modules
    .filter(module => module.status !== 'retired')
    .map(module => {
      const subject = subjectById.get(module.subjectId)
      if (!subject) throw new Error(`Module "${module.id}" references unknown Subject "${module.subjectId}"`)
      return {
        id: module.id,
        title: module.title,
        shortTitle: module.shortTitle,
        subjectId: module.subjectId,
        subject: subject.themeKey,
        status: module.status,
        chapterRefs: [...module.chapterRefs]
          .sort(byPosition)
          .map(ref => ({ chapterId: ref.chapterId, position: ref.position })),
        presentation: { ...module.presentation },
        sequenceId: sequenceByModule.get(module.id) ?? null,
      }
    })

  const chapters = []
  const loaders = []
  for (const chapter of catalogue.chapters.filter(record => record.status !== 'retired')) {
    const owner = ownerByChapter.get(chapter.id)
    if (!owner) throw new Error(`Chapter "${chapter.id}" has no canonical Module owner`)
    const subject = subjectById.get(owner.module.subjectId)
    if (!subject) throw new Error(`Chapter "${chapter.id}" resolves to unknown Subject "${owner.module.subjectId}"`)
    const screens = await deriveScreens(chapter.contentPath)
    const sequencePosition = sequencePositionByChapter.get(chapter.id)
    if (chapter.status === 'available' && !sequencePosition) {
      throw new Error(`available Chapter "${chapter.id}" belongs to no Learning Sequence`)
    }

    chapters.push({
      id: chapter.id,
      subjectId: owner.module.subjectId,
      subject: subject.themeKey,
      moduleId: owner.module.id,
      modulePosition: owner.ref.position,
      sequenceId: sequencePosition?.sequenceId ?? null,
      sequencePosition: sequencePosition?.position ?? null,
      title: chapter.title,
      subtitle: chapter.subtitle,
      era: chapter.era,
      icon: chapter.icon,
      headerImage: chapter.headerImage,
      status: chapter.status,
      screenCount: screens.screenCount,
      screenTags: screens.screenTags,
      estimatedMinutes: chapter.estimatedMinutes,
      conceptIds: [...chapter.conceptIds],
      requirementIds: [...chapter.requirementIds],
    })

    if (chapter.contentPath !== null) {
      loaders.push({
        id: chapter.id,
        importPath: chapter.contentPath.replace(/^src\//, LOADER_PATH_PREFIX),
      })
    }
  }

  return { sequences, modules, chapters, loaders }
}

export function renderLearnerCurriculum({ sequences, modules, chapters, loaders }) {
  const lines = [...BANNER, '']
  lines.push(`export const LEARNING_SEQUENCES = ${JSON.stringify(sequences, null, 2)}`)
  lines.push('')
  lines.push(`export const CURRICULUM_MODULES = ${JSON.stringify(modules, null, 2)}`)
  lines.push('')
  lines.push(`export const CURRICULUM_CHAPTERS = ${JSON.stringify(chapters, null, 2)}`)
  lines.push('')
  lines.push('export const CHAPTER_CONTENT_LOADERS = {')
  for (const loader of loaders) {
    lines.push(`  ${JSON.stringify(loader.id)}: () => import(${JSON.stringify(loader.importPath)}).then(module => module.default),`)
  }
  lines.push('}')
  lines.push('')
  lines.push('export function getCurriculumModuleById(moduleId) {')
  lines.push('  return CURRICULUM_MODULES.find(module => module.id === moduleId) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getCurriculumChapterById(chapterId) {')
  lines.push('  return CURRICULUM_CHAPTERS.find(chapter => chapter.id === chapterId) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getLearningSequenceById(sequenceId) {')
  lines.push('  return LEARNING_SEQUENCES.find(sequence => sequence.id === sequenceId) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getLearningSequenceForChapter(chapterId) {')
  lines.push('  return LEARNING_SEQUENCES.find(sequence => sequence.chapterIds.includes(chapterId)) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getPrimaryLearningSequenceForSubject(subject) {')
  lines.push('  return LEARNING_SEQUENCES.find(sequence => sequence.subject === subject || sequence.subjectId === subject) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function isChapterAvailable(chapter) {')
  lines.push("  return chapter?.status === 'available' && Number(chapter.screenCount) > 0")
  lines.push('}')
  lines.push('')
  lines.push('export function getOrderedAvailableChapters() {')
  lines.push('  return LEARNING_SEQUENCES')
  lines.push('    .flatMap(sequence => sequence.chapterIds)')
  lines.push('    .map(getCurriculumChapterById)')
  lines.push('    .filter(isChapterAvailable)')
  lines.push('}')
  return `${lines.join('\n')}\n`
}

export function renderLearnerCurriculumMap({ sequences, modules, chapters, loaders }) {
  const available = chapters.filter(chapter => chapter.status === 'available' && chapter.screenCount > 0)
  const planned = chapters.filter(chapter => chapter.status === 'planned')
  const lines = [
    '# Canonical learner-curriculum runtime',
    '',
    '> **GENERATED FILE — do not edit.**',
    '> Source: canonical curriculum records, Learning Sequences and derived Chapter screen metadata.',
    '> Run `pnpm curriculum:runtime:generate` after changing any source.',
    '',
    `**${sequences.length}** Learning Sequences · **${modules.length}** canonical Modules · **${chapters.length}** canonical Chapters · **${available.length}** available · **${planned.length}** planned · **${loaders.length}** loaders`,
    '',
    'Learning Sequences are application sequencing configuration, not a seventh curriculum entity.',
    'They own continuation and numbering scope; canonical Modules still own Chapter membership.',
    '',
    '## Sequences',
    '',
    '| # | Sequence | Subject | Canonical Modules | Chapters | Available |',
    '|---:|---|---|---:|---:|---:|',
  ]
  for (const sequence of sequences) {
    const sequenceChapters = sequence.chapterIds.map(id => chapters.find(chapter => chapter.id === id)).filter(Boolean)
    lines.push(`| ${sequence.position + 1} | \`${sequence.id}\` — ${sequence.title} | ${sequence.subject} | ${sequence.moduleIds.length} | ${sequenceChapters.length} | ${sequenceChapters.filter(chapter => chapter.status === 'available' && chapter.screenCount > 0).length} |`)
  }
  lines.push('', '## Runtime boundaries', '')
  lines.push('- Production imports this generated model only through `src/data/learnerCurriculum.js`.')
  lines.push('- Browser presentation remains in the separate generated navigation projection.')
  lines.push('- The retired `runtime-v1` compatibility projection is not an input.')
  return `${lines.join('\n')}\n`
}

export async function generate() {
  const purity = assertInputPurity()
  if (purity.length) throw new Error(`learner curriculum generator input is impure:\n  - ${purity.join('\n  - ')}`)
  const catalogue = await loadCatalogue()
  const sequences = loadLearningSequences(catalogue)
  const runtime = await buildLearnerCurriculum(catalogue, sequences)
  return {
    [RUNTIME_PATH]: renderLearnerCurriculum(runtime),
    [RUNTIME_DOC_PATH]: renderLearnerCurriculumMap(runtime),
  }
}

const isDirectRun = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  const checking = process.argv.includes('--check')
  const documents = await generate()
  let drift = false
  for (const [path, generated] of Object.entries(documents)) {
    const target = resolve(ROOT, path)
    if (!checking) {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, generated)
      console.log(`generated ${path}`)
      continue
    }
    let current = null
    try { current = readFileSync(target, 'utf8') } catch {}
    if (current !== generated) {
      console.error(`learner curriculum projection drifted: ${path}`)
      drift = true
    }
  }
  if (drift) process.exit(1)
  if (checking) console.log('learner curriculum projection is current')
}
