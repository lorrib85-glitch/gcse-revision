import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { CHAPTERS } from '../../src/chapters.js'
import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import {
  browserEntries,
  loadNavigation,
  validateNavigationConfiguration,
} from '../../src/curriculum-catalogue/navigation/index.js'
import {
  NAVIGATION_ENTRIES,
  getNavigationEntryById,
  getNavigationEntryForDisplayName,
} from '../../src/data/generated/curriculum/navigation.js'
import { getSubjectChapterList, getSubjectNavigationEntry } from '../../src/features/subjects/subjectCatalogue.js'
import {
  assertInputPurity,
  buildNavigation,
  flattenNavigationCards,
  renderNavigation,
  resolvePathwayModules,
} from '../../scripts/generate-curriculum-navigation.mjs'

const ROOT = resolve(process.cwd())
const FIXTURE_PATH = resolve(ROOT, 'tests/fixtures/subject-browser-v1.json')
const FIXTURE_SHA256 = '655459d0c6a89640d567c00e6ad85127e56294c6f3eebadca4b3eceeffcabc86'
const fixtureText = readFileSync(FIXTURE_PATH, 'utf8')
const fixture = JSON.parse(fixtureText)
const expectedById = new Map(fixture.entries.map(entry => [entry.id, entry]))

const flattenFixtureCards = expected => expected.sections
  ? expected.sections.flatMap(section => section.cards.map(([id, number, openable]) => ({ id, number, openable })))
  : expected.cards.map(([id, number, openable]) => ({ id, number, openable }))

function filesUnder(dir, extensions) {
  const root = resolve(ROOT, dir)
  if (!existsSync(root)) return []
  const files = []
  for (const name of readdirSync(root)) {
    const full = resolve(root, name)
    if (statSync(full).isDirectory()) {
      files.push(...filesUnder(relative(ROOT, full), extensions))
    } else {
      const path = relative(ROOT, full).replaceAll('\\', '/')
      if (extensions.some(extension => path.endsWith(extension))) files.push(path)
    }
  }
  return files
}


describe('Stage 5B canonical subject-browser navigation', () => {
  it('pins the frozen pre-cutover browser contract visibly', () => {
    expect(createHash('sha256').update(fixtureText).digest('hex')).toBe(FIXTURE_SHA256)
    expect(fixture.contract.provenanceCommit).toBe('2ef84c64ee0ba9f73354d3941072eef2960a83d2')
    expect(fixture.contract.purpose).toContain('test-only')
  })

  it('validates Browser Entries outside the six curriculum entity types', async () => {
    const catalogue = await loadCatalogue()
    expect(validateNavigationConfiguration(browserEntries, catalogue)).toEqual([])
    expect(loadNavigation(catalogue)).toBe(browserEntries)
    expect(Object.keys(catalogue).sort()).toEqual([
      'boards', 'chapters', 'modules', 'pathways', 'specifications', 'subjects',
    ])
  })

  it('generates exactly the committed deterministic projection', async () => {
    const catalogue = await loadCatalogue()
    const configuration = loadNavigation(catalogue)
    const built = buildNavigation(catalogue, configuration)
    expect(built).toEqual(NAVIGATION_ENTRIES)
    expect(renderNavigation(built)).toBe(renderNavigation(buildNavigation(catalogue, configuration)))
  })

  it('preserves destinations, presentation, sections, order, numbers and openability', () => {
    expect(NAVIGATION_ENTRIES.map(entry => entry.id)).toEqual(fixture.entries.map(entry => entry.id))

    for (const entry of NAVIGATION_ENTRIES) {
      const expected = expectedById.get(entry.id)
      expect(expected, entry.id).toBeTruthy()
      expect({
        label: entry.label,
        title: entry.title,
        description: entry.description,
        heroImage: entry.heroImage,
        subjectIds: entry.subjectIds,
        pathwayIds: entry.pathwayIds,
      }).toEqual({
        label: expected.label,
        title: expected.title,
        description: expected.description,
        heroImage: expected.heroImage,
        subjectIds: expected.subjectIds,
        pathwayIds: expected.pathwayIds,
      })

      const cards = flattenNavigationCards(entry)
      expect(cards.map(card => ({ id: card.id, number: card.number, openable: card.openable })))
        .toEqual(flattenFixtureCards(expected))

      if (expected.sections) {
        expect(entry.sections.map(section => ({
          id: section.id,
          title: section.title,
          shortLabel: section.shortLabel,
          heroImage: section.heroImage,
          comingSoon: section.comingSoon,
        }))).toEqual(expected.sections.map(section => ({
          id: section.id,
          title: section.title,
          shortLabel: section.shortLabel,
          heroImage: section.heroImage,
          comingSoon: section.comingSoon,
        })))
      } else {
        expect(entry.sections).toBeNull()
      }
      if (expected.comingSoon) expect(entry.comingSoon).toEqual(expected.comingSoon)
    }
  })

  it('adapts the generated projection into the browser contract', () => {
  for (const entry of NAVIGATION_ENTRIES) {
    const browserEntry = getSubjectNavigationEntry(entry.label)
    expect(browserEntry).toEqual(expect.objectContaining({
      id: entry.id,
      label: entry.label,
      title: entry.title,
      description: entry.description,
      heroImage: entry.heroImage,
    }))

    const adapted = getSubjectChapterList(entry.label)
    if (entry.comingSoon) {
      expect(adapted).toEqual([
        expect.objectContaining({
          navigationKind: 'state',
          title: entry.comingSoon.title,
          subtitle: entry.comingSoon.subtitle,
          openable: false,
        }),
      ])
      continue
    }

    const seriesByCard = new Map((entry.sections ?? []).flatMap(section =>
      section.cards.map(card => [card.id, section.id])))
    const projected = flattenNavigationCards(entry).map(card => ({
      id: card.id,
      title: card.title,
      subtitle: card.subtitle,
      number: card.number,
      series: seriesByCard.get(card.id) ?? null,
      navigationKind: card.kind,
      openable: card.openable,
      comingSoon: !card.openable,
    }))
    expect(adapted.map(card => ({
      id: card.id,
      title: card.title,
      subtitle: card.subtitle,
      number: card.number,
      series: card.series,
      navigationKind: card.navigationKind,
      openable: card.openable,
      comingSoon: card.comingSoon,
    }))).toEqual(projected)
  }
})

  it('preserves progress denominator inputs without putting progress in navigation', () => {
    for (const entry of NAVIGATION_ENTRIES) {
      const expected = expectedById.get(entry.id)
      expect(CHAPTERS.filter(chapter => chapter.subject === entry.label)).toHaveLength(expected.progressDenominator)
      expect(entry).not.toHaveProperty('progress')
      expect(entry).not.toHaveProperty('progressDenominator')
    }
  })

  it('contains 70 canonical cards plus one subject-level state — 71 visible items', () => {
    const cards = NAVIGATION_ENTRIES.flatMap(flattenNavigationCards)
    const states = NAVIGATION_ENTRIES.filter(entry => entry.comingSoon !== null)
    expect(cards).toHaveLength(70)
    expect(states).toHaveLength(1)
    expect(cards.length + states.length).toBe(71)
    expect(cards.filter(card => card.openable)).toHaveLength(30)
    expect(cards.some(card => card.id.startsWith('cs_'))).toBe(false)
  })

  it('resolves every card to a canonical Chapter or Module', async () => {
    const catalogue = await loadCatalogue()
    const chapterIds = new Set(catalogue.chapters.map(chapter => chapter.id))
    const moduleIds = new Set(catalogue.modules.map(module => module.id))
    for (const card of NAVIGATION_ENTRIES.flatMap(flattenNavigationCards)) {
      if (card.kind === 'chapter') expect(chapterIds.has(card.chapterId), card.id).toBe(true)
      if (card.kind === 'module') expect(moduleIds.has(card.moduleId), card.id).toBe(true)
    }
  })

  it('deduplicates identical tier pathways and refuses a diverging pair', async () => {
    const catalogue = await loadCatalogue()
    const biology = browserEntries.find(entry => entry.id === 'biology')
    expect(resolvePathwayModules(biology, catalogue).map(module => module.id)).toHaveLength(6)

    const mutated = structuredClone(catalogue)
    const higher = mutated.pathways.find(pathway => pathway.id === 'aqa-biology-8461-higher')
    const firstPosition = higher.moduleRefs[0].position
    higher.moduleRefs[0].position = higher.moduleRefs[1].position
    higher.moduleRefs[1].position = firstPosition
    expect(() => resolvePathwayModules(biology, mutated)).toThrow(/diverging pathways/)
  })

  it('filters a shared Combined Science pathway by canonical module subject', async () => {
    const catalogue = await loadCatalogue()
    const probe = {
      id: 'combined-biology-probe',
      subjectIds: ['biology'],
      pathwayIds: ['aqa-combined-science-8464-foundation'],
    }
    const modules = resolvePathwayModules(probe, catalogue)
    expect(modules).toHaveLength(6)
    expect(new Set(modules.map(module => module.subjectId))).toEqual(new Set(['biology']))
  })

  it('keeps one English destination without merging English Language identity', () => {
    const english = getNavigationEntryById('english')
    expect(english.subjectIds).toEqual(['english-literature'])
    expect(english.pathwayIds).toEqual(['aqa-english-literature-8702-macbeth-inspector'])
    expect(english.subjectIds).not.toContain('english-language')
    expect(getNavigationEntryForDisplayName('English')).toBe(english)
  })

  it('makes temporary overrides fail once they duplicate the derived fact', async () => {
    const catalogue = await loadCatalogue()
    const mutated = structuredClone(browserEntries)
    mutated.find(entry => entry.id === 'sociology').displayNumberOverrides.soc6.value = 5
    expect(() => buildNavigation(catalogue, mutated)).toThrow(/duplicates the default/)
  })

  it('keeps generator inputs pure and reaches production through one adapter', () => {
  expect(assertInputPurity()).toEqual([])
  const productionFiles = filesUnder('src', ['.js', '.jsx'])
  const generatedImport = /(?:from\s*|import\s*\(\s*)['"][^'"]*generated\/curriculum\/navigation\.js['"]/
  const generatedImporters = productionFiles
    .filter(path => generatedImport.test(readFileSync(resolve(ROOT, path), 'utf8')))
    .sort()
  expect(generatedImporters).toEqual(['src/features/subjects/subjectCatalogue.js'])

  const subjectsSource = readFileSync(resolve(ROOT, 'src/features/subjects/Subjects.jsx'), 'utf8')
  expect(subjectsSource).toContain("from './subjectCatalogue.js'")
  expect(subjectsSource).not.toContain('generated/curriculum/navigation.js')
})
})