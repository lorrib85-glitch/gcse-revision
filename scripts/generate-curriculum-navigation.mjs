#!/usr/bin/env node
// ─── Canonical subject-browser navigation generator ────────────────────────
//
// Stage 5C: renders the load-bearing browser projection from canonical
// curriculum records plus the isolated browser-entry configuration.
//
//   src/data/generated/curriculum/navigation.js
//   docs/curriculum/NAVIGATION_MAP.md
//
// Production reaches the generated runtime file only through the subject
// browser adapter. This generator never reads the browser UI, runtime compatibility
// projection, a test fixture or a planning document.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadCatalogue } from '../src/curriculum-catalogue/index.js'
import { loadNavigation } from '../src/curriculum-catalogue/navigation/index.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const NAVIGATION_PATH = 'src/data/generated/curriculum/navigation.js'
export const NAVIGATION_DOC_PATH = 'docs/curriculum/NAVIGATION_MAP.md'

const BANNER = [
  '// GENERATED FILE — DO NOT EDIT.',
  '//',
  '// Run `pnpm curriculum:navigation:generate` after changing curriculum records',
  '// or src/curriculum-catalogue/navigation/browserEntries.js.',
  '// `pnpm curriculum:navigation:check` fails when this projection drifts.',
  '//',
  '// Stage 5C: consumed through src/features/subjects/subjectNavigationAdapter.js.',
  '// Production components must not import this generated file directly.',
  '//',
  '// Source: canonical curriculum records plus the browser-entry configuration.',
]

const FORBIDDEN_INPUTS = [
  '.planning/',
  'src/curriculum-catalogue/compatibility/',
  'src/features/subjects/Subjects.jsx',
  'src/features/subjects/subjectNavigationAdapter.js',
  'tests/fixtures/',
  'src/data/modules.js',
  'src/chapters.js',
  'src/content/chapterContentRegistry.js',
]

/** Prove the generator cannot turn the old browser or compatibility output into authority. */
export function assertInputPurity(source = readFileSync(resolve(ROOT, 'scripts/generate-curriculum-navigation.mjs'), 'utf8')) {
  const problems = []
  const SPECIFIER = /(?:^\s*(?:import|export)\b[^;\n]*?\bfrom\s*|\bimport\s*\(\s*|\breadFileSync\s*\(\s*|\bresolve\s*\(\s*ROOT\s*,\s*)['"]([^'"]+)['"]/gm
  for (const [, specifier] of source.matchAll(SPECIFIER)) {
    for (const forbidden of FORBIDDEN_INPUTS) {
      if (specifier.includes(forbidden) || specifier.endsWith(forbidden)) {
        problems.push(`reads "${specifier}" — navigation must not use ${forbidden} as generator input`)
      }
    }
  }
  return problems
}

const ids = records => records.map(record => record.id)
const sameSequence = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index])

/**
 * Resolve the module sequence configured by one Browser Entry.
 *
 * Multiple tier pathways may be configured only when their subject-filtered
 * module identities are identical. The generator deduplicates identical
 * sequences and refuses both the union and the intersection of diverging ones.
 */
export function resolvePathwayModules(entry, catalogue) {
  const pathwayById = new Map(catalogue.pathways.map(record => [record.id, record]))
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))

  const sequences = entry.pathwayIds.map(pathwayId => {
    const pathway = pathwayById.get(pathwayId)
    if (!pathway) throw new Error(`navigation entry "${entry.id}" references unknown pathway "${pathwayId}"`)
    if (pathway.status === 'retired') throw new Error(`navigation entry "${entry.id}" references retired pathway "${pathwayId}"`)

    return [...pathway.moduleRefs]
      .sort((a, b) => a.position - b.position)
      .map(ref => {
        const module = moduleById.get(ref.moduleId)
        if (!module) throw new Error(`pathway "${pathwayId}" references unknown module "${ref.moduleId}"`)
        return module
      })
      .filter(module => module.status !== 'retired' && entry.subjectIds.includes(module.subjectId))
  })

  const reference = sequences[0] ?? []
  for (let index = 1; index < sequences.length; index += 1) {
    if (!sameSequence(ids(reference), ids(sequences[index]))) {
      throw new Error(
        `navigation entry "${entry.id}" configures diverging pathways `
        + `"${entry.pathwayIds[0]}" and "${entry.pathwayIds[index]}"; `
        + 'select one pathway instead of guessing a union or intersection',
      )
    }
  }

  if (!entry.moduleIds) return reference

  const configuredSet = new Set(entry.moduleIds)
  const resolvedSet = new Set(ids(reference))
  if (configuredSet.size !== entry.moduleIds.length
    || configuredSet.size !== resolvedSet.size
    || [...configuredSet].some(moduleId => !resolvedSet.has(moduleId))) {
    throw new Error(
      `navigation entry "${entry.id}".moduleIds must reorder exactly the modules reached by its configured pathways`,
    )
  }
  return entry.moduleIds.map(moduleId => moduleById.get(moduleId))
}

function chapterCard(chapter, module, entry, defaultNumber) {
  const numberOverride = entry.displayNumberOverrides[chapter.id]
  return {
    id: chapter.id,
    kind: 'chapter',
    chapterId: chapter.id,
    moduleId: module.id,
    subjectId: module.subjectId,
    title: chapter.title,
    subtitle: chapter.subtitle,
    number: numberOverride?.value ?? defaultNumber,
    status: chapter.status === 'available' ? 'available' : 'planned',
    openable: chapter.status === 'available',
    headerImage: chapter.headerImage,
    canonical: {
      subjectId: module.subjectId,
      pathwayIds: [...entry.pathwayIds],
      moduleId: module.id,
      chapterId: chapter.id,
    },
    _defaultNumber: defaultNumber,
    _canonicalTitle: chapter.title,
  }
}

function moduleCard(module, entry, defaultNumber) {
  const labelOverride = entry.cardLabelOverrides[module.id]
  const numberOverride = entry.displayNumberOverrides[module.id]
  return {
    id: module.id,
    kind: 'module',
    moduleId: module.id,
    subjectId: module.subjectId,
    title: labelOverride?.value ?? module.title,
    subtitle: module.presentation.shortDescription,
    number: numberOverride?.value ?? defaultNumber,
    status: 'planned',
    openable: false,
    heroImage: module.presentation.heroImage,
    canonical: {
      subjectId: module.subjectId,
      pathwayIds: [...entry.pathwayIds],
      moduleId: module.id,
    },
    _defaultNumber: defaultNumber,
    _canonicalTitle: module.title,
  }
}

function buildCards(modules, entry, chapterById) {
  if (entry.cardMode === 'none') return []

  const cards = []
  if (entry.cardMode === 'module') {
    modules.forEach((module, index) => cards.push(moduleCard(module, entry, index + 1)))
    return cards
  }

  for (const module of modules) {
    for (const ref of [...module.chapterRefs].sort((a, b) => a.position - b.position)) {
      const chapter = chapterById.get(ref.chapterId)
      if (!chapter) throw new Error(`module "${module.id}" references unknown chapter "${ref.chapterId}"`)
      if (chapter.status === 'retired') continue
      cards.push(chapterCard(chapter, module, entry, cards.length + 1))
    }
  }
  return cards
}

function assertOverrides(entry, cards) {
  const cardById = new Map(cards.map(card => [card.id, card]))
  for (const [cardId, override] of Object.entries(entry.displayNumberOverrides)) {
    const card = cardById.get(cardId)
    if (!card) throw new Error(`navigation entry "${entry.id}" has a number override for absent card "${cardId}"`)
    if (override.value === card._defaultNumber) {
      throw new Error(`navigation entry "${entry.id}" number override for "${cardId}" duplicates the default and must be deleted`)
    }
  }
  for (const [cardId, override] of Object.entries(entry.cardLabelOverrides)) {
    const card = cardById.get(cardId)
    if (!card) throw new Error(`navigation entry "${entry.id}" has a label override for absent card "${cardId}"`)
    if (override.value === card._canonicalTitle) {
      throw new Error(`navigation entry "${entry.id}" label override for "${cardId}" duplicates the canonical title and must be deleted`)
    }
  }
}

const publicCard = card => {
  const { _defaultNumber, _canonicalTitle, ...projected } = card
  return projected
}

/** Build the ordered navigation projection as plain serialisable data. */
export function buildNavigation(catalogue, configuration) {
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const chapterById = new Map(catalogue.chapters.map(record => [record.id, record]))

  return [...configuration]
    .sort((a, b) => a.position - b.position)
    .map(entry => {
      const resolvedModules = resolvePathwayModules(entry, catalogue)
      let cards = []
      let sections = null

      if (entry.sections) {
        const allowed = new Set(ids(resolvedModules))
        const claimed = entry.sections.flatMap(section => section.moduleIds)
        if (claimed.length !== allowed.size || claimed.some(moduleId => !allowed.has(moduleId))) {
          throw new Error(
            `navigation entry "${entry.id}" sections must claim every configured module exactly once`,
          )
        }
        sections = entry.sections.map(section => {
          const modules = section.moduleIds.map(moduleId => {
            const module = moduleById.get(moduleId)
            if (!module) throw new Error(`navigation section "${entry.id}/${section.id}" references unknown module "${moduleId}"`)
            return module
          })
          const sectionCards = buildCards(modules, entry, chapterById)
          cards.push(...sectionCards)
          return {
            id: section.id,
            title: section.title,
            shortLabel: section.shortLabel,
            heroImage: section.heroImage,
            comingSoon: section.comingSoon,
            moduleIds: [...section.moduleIds],
            cards: sectionCards.map(publicCard),
          }
        })
      } else {
        cards = buildCards(resolvedModules, entry, chapterById)
      }

      assertOverrides(entry, cards)

      return {
        id: entry.id,
        position: entry.position,
        label: entry.label,
        title: entry.title,
        description: entry.description,
        heroImage: entry.heroImage,
        themeKey: entry.themeKey,
        subjectIds: [...entry.subjectIds],
        pathwayIds: [...entry.pathwayIds],
        cardMode: entry.cardMode,
        comingSoon: entry.comingSoon ? { ...entry.comingSoon } : null,
        sections,
        cards: sections ? [] : cards.map(publicCard),
      }
    })
}

export function flattenNavigationCards(entry) {
  return entry.sections
    ? entry.sections.flatMap(section => section.cards)
    : entry.cards
}

export function renderNavigation(entries) {
  const lines = [...BANNER, '']
  lines.push(`export const NAVIGATION_ENTRIES = ${JSON.stringify(entries, null, 2)}`)
  lines.push('')
  lines.push('export function getNavigationEntryById(id) {')
  lines.push('  return NAVIGATION_ENTRIES.find(entry => entry.id === id) ?? null')
  lines.push('}')
  lines.push('')
  lines.push('export function getNavigationEntryForDisplayName(name) {')
  lines.push('  return NAVIGATION_ENTRIES.find(entry => entry.label === name) ?? null')
  lines.push('}')
  return `${lines.join('\n')}\n`
}

export function renderNavigationMap(entries) {
  const cards = entries.flatMap(flattenNavigationCards)
  const openable = cards.filter(card => card.openable)
  const subjectStates = entries.filter(entry => entry.comingSoon !== null)
  const lines = [
    '# Subject-browser navigation map',
    '',
    '> **GENERATED FILE — do not edit.**',
    '> Source: canonical curriculum records plus `src/curriculum-catalogue/navigation/browserEntries.js`.',
    '> Run `pnpm curriculum:navigation:generate` after changing either source.',
    '',
    `**${entries.length}** browser entries · **${cards.length}** canonical cards + **${subjectStates.length}** subject-level state · **${cards.length + subjectStates.length}** visible items · **${openable.length}** openable chapters`,
    '',
    'This is application navigation configuration, not a seventh curriculum entity.',
    'Stage 5C keeps it load-bearing through `src/features/subjects/subjectNavigationAdapter.js`.',
    '',
    '## Entries',
    '',
    '| # | Entry | Subjects represented | Configured pathways | Mode | Cards | Openable |',
    '|---:|---|---|---|---|---:|---:|',
  ]

  for (const entry of entries) {
    const entryCards = flattenNavigationCards(entry)
    lines.push(
      `| ${entry.position + 1} | \`${entry.id}\` — ${entry.title} | `
      + `${entry.subjectIds.map(id => `\`${id}\``).join(', ')} | `
      + `${entry.pathwayIds.map(id => `\`${id}\``).join(', ')} | `
      + `${entry.cardMode} | ${entryCards.length} | ${entryCards.filter(card => card.openable).length} |`,
    )
  }

  for (const entry of entries) {
    lines.push('', `## ${entry.label}`, '')
    lines.push(`${entry.description}`, '')
    if (entry.comingSoon) {
      lines.push(`Subject-level state: **${entry.comingSoon.title}** — ${entry.comingSoon.subtitle}.`, '')
      continue
    }
    const groups = entry.sections ?? [{ id: null, title: null, cards: entry.cards }]
    for (const group of groups) {
      if (group.title) lines.push(`### ${group.title}`, '')
      if (group.cards.length === 0) {
        lines.push('_No cards. The configured module is planned with no chapters._', '')
        continue
      }
      lines.push('| # | Card | Kind | Canonical module | Status |')
      lines.push('|---:|---|---|---|---|')
      for (const card of group.cards) {
        lines.push(`| ${card.number} | \`${card.id}\` — ${card.title} | ${card.kind} | \`${card.moduleId}\` | ${card.openable ? 'openable' : 'coming soon'} |`)
      }
      lines.push('')
    }
  }

  return `${lines.join('\n')}\n`
}

/** Every file owned by the navigation generator. */
export async function generate() {
  const purity = assertInputPurity()
  if (purity.length) {
    throw new Error(`curriculum navigation generator input is impure:\n  - ${purity.join('\n  - ')}`)
  }
  const catalogue = await loadCatalogue()
  const configuration = loadNavigation(catalogue)
  const entries = buildNavigation(catalogue, configuration)
  return {
    [NAVIGATION_PATH]: renderNavigation(entries),
    [NAVIGATION_DOC_PATH]: renderNavigationMap(entries),
  }
}

const isDirectRun = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  const checking = process.argv.includes('--check')
  const label = `curriculum:navigation:${checking ? 'check' : 'generate'}`
  const documents = await generate()

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
      console.error(`${label} — ${path} is missing. Run \`pnpm curriculum:navigation:generate\`.`)
      process.exit(1)
    }
    if (committed !== generated) {
      console.error(
        `${label} — ${path} is out of date. `
        + 'Run `pnpm curriculum:navigation:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`${label} — ${path} matches the catalogue and navigation configuration.`)
  }
}
