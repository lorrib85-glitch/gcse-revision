import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'
import {
  BLOCK_REGISTRY,
  SCREEN_REGISTRY,
  validateChapterDefinition,
} from '../../src/data/screenRegistry.js'
import {
  BLOCK_RENDERER_TYPES,
  FULL_SCREEN_RENDERER_TYPES,
} from '../../src/components/layout/ScreenRenderer.jsx'

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

async function loadAllChapters() {
  return Promise.all(Object.entries(CHAPTER_CONTENT_LOADERS).map(async ([id, load]) => [id, await load()]))
}

describe('governed screen registry', () => {
  it('every registry entry links authoring, component and contract metadata', () => {
    for (const [type, definition] of [...Object.entries(SCREEN_REGISTRY), ...Object.entries(BLOCK_REGISTRY)]) {
      expect(definition.authoringName, type).toBeTruthy()
      expect(definition.component, type).toBeTruthy()
      expect(definition.contract, type).toContain('COMPONENT_REGISTRY.md')
    }
  })

  it('every active block contract has a ScreenRenderer implementation', () => {
    const activeTypes = Object.entries(BLOCK_REGISTRY)
      .filter(([, definition]) => definition.status === 'active')
      .map(([type]) => type)
      .sort()
    expect([...BLOCK_RENDERER_TYPES].sort()).toEqual(activeTypes)
  })

  it('every authored full-screen route has a ScreenRenderer implementation', () => {
    const fullTypes = Object.entries(SCREEN_REGISTRY)
      .filter(([, definition]) => definition.layout === 'full' && definition.status !== 'derived')
      .map(([type]) => type)
      .sort()
    expect([...FULL_SCREEN_RENDERER_TYPES].sort()).toEqual(fullTypes)
  })

  it('all registered chapter content passes schema validation', async () => {
    const chapters = await loadAllChapters()
    const failures = []
    const legacyCounts = {}
    for (const [id, chapter] of chapters) {
      const result = validateChapterDefinition(chapter)
      for (const error of result.errors) failures.push(id + ': ' + error.message)
      for (const warning of result.warnings) {
        if (warning.code !== 'LEGACY_BLOCK_TYPE' && warning.code !== 'LEGACY_SCREEN_TYPE') continue
        const match = warning.message.match(/legacy (?:block|screen) type "([^"]+)"/)
        const type = match?.[1] || '<unknown>'
        legacyCounts[type] = (legacyCounts[type] || 0) + 1
      }
    }
    expect(failures).toEqual([])
    const allowedLegacyMaximums = { appliedscenario: 2, examscored: 1, tieredquiz: 9, timelinedrag: 1, visualNarrative: 0 }
    for (const [type, count] of Object.entries(legacyCounts)) {
      expect(Object.hasOwn(allowedLegacyMaximums, type), 'Unexpected legacy type ' + type).toBe(true)
      expect(count, 'Legacy type ' + type + ' grew').toBeLessThanOrEqual(allowedLegacyMaximums[type])
    }
  })

  it('ChapterPlayer contains lifecycle only, not component routing', () => {
    const player = read('src/components/layout/ChapterPlayer.jsx')
    expect(player).toContain("import ScreenRenderer, { ChapterSchemaError } from './ScreenRenderer.jsx'")
    expect(player).toContain('resolveScreenDefinition(cur)')
    expect(player).not.toMatch(/cur\?\.type\s*===/)
    expect(player).not.toMatch(/block\.type\s*===/)
    expect(player).not.toContain('function ScreenContentRenderer')
    expect(player).not.toContain('function ReadBlock')
  })

  it('keeps production failures recoverable and accepted data variants renderable', () => {
    const renderer = read('src/components/layout/ScreenRenderer.jsx')
    expect(renderer).not.toContain('function UnsupportedScreen({ screen, chapter, definition }) {\n  const type = getScreenType(screen)\n  if (!import.meta.env.DEV) return null')
    expect(renderer).toContain("const scenarios = Array.isArray(block.scenarios) ? block.scenarios : [block]")
    expect(renderer).toContain('Array.isArray(block.points)')
  })
})
