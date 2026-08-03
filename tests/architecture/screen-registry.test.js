import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'
import {
  BLOCK_REGISTRY,
  SCREEN_REGISTRY,
  isCinematicHeaderScreen,
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
    const allowedLegacyMaximums = { appliedscenario: 2, examscored: 1, tieredquiz: 9, timelinedrag: 1 }
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

  // The migration to `type: 'timelineChain', variant: 'reveal'` is complete and
  // recorded in GOLD_SCREEN_REGISTER.md. The compatibility path is retired: the
  // type is unregistered, unroutable, and the mapper no longer exists. These
  // assertions stop it returning by accident.
  it('leaves no trace of the retired visualNarrative compatibility path', async () => {
    expect(SCREEN_REGISTRY.visualNarrative).toBeUndefined()
    expect(FULL_SCREEN_RENDERER_TYPES).not.toContain('visualNarrative')

    const renderer = read('src/components/layout/ScreenRenderer.jsx')
    expect(renderer).not.toContain('visualNarrative')
    expect(existsSync(resolve(root, 'src/data/visualNarrativeCompat.js'))).toBe(false)

    // TimelineChain and its reveal variant are untouched by the retirement.
    expect(SCREEN_REGISTRY.timelineChain?.component).toBe('TimelineChain')
    expect(FULL_SCREEN_RENDERER_TYPES).toContain('timelineChain')
  })

  // `cinematicReveal` and `video` were broken placeholder entries, introduced to
  // preserve the old hardcoded isFullScreenVideoScreen predicate when it became
  // registry-derived. They were never aliases or implementations of
  // CinematicRevealMoment: they routed to ScreenContentRenderer and paired
  // headerMode 'cinematic' with layout 'content', which hides the learning
  // header with nothing able to restore it.
  it('leaves no trace of the retired cinematicReveal and video types', () => {
    for (const type of ['cinematicReveal', 'video']) {
      expect(SCREEN_REGISTRY[type], type).toBeUndefined()
      expect(FULL_SCREEN_RENDERER_TYPES, type).not.toContain(type)
    }
    expect(read('src/components/layout/ScreenRenderer.jsx')).not.toContain('cinematicReveal')
    expect(read('src/app/chapterNavigation.js')).not.toContain('cinematicReveal')
  })

  it('keeps cinematic as the sole full-screen cinematic authoring route', () => {
    const cinematic = SCREEN_REGISTRY.cinematic
    expect(cinematic.component).toBe('CinematicRevealMoment')
    expect(cinematic.status).toBe('active')
    expect(cinematic.layout).toBe('full')
    expect(cinematic.continuation).toBe('component')
    expect(cinematic.headerMode).toBe('cinematic')
    expect(FULL_SCREEN_RENDERER_TYPES).toContain('cinematic')

    // Both media routes stay authorable: video with an image fallback, or an
    // image alone. CinematicRevealMoment falls back on reduced motion or a
    // video error, so neither may become individually required.
    expect(cinematic.required).toEqual([])
    expect(cinematic.requiredAny).toEqual([[
      { path: 'videoSrc', kind: 'string' },
      { path: 'fallbackImage', kind: 'string' },
    ]])
    const component = read('src/components/learning/CinematicRevealMoment.jsx')
    expect(component).toContain('videoSrc')
    expect(component).toContain('fallbackImage')

    // `cinematic` is the only type left claiming the cinematic header, and the
    // navigation predicate still derives that from the registry.
    const cinematicHeaderTypes = Object.entries(SCREEN_REGISTRY)
      .filter(([, definition]) => definition.headerMode === 'cinematic')
      .map(([type]) => type)
    expect(cinematicHeaderTypes).toEqual(['cinematic'])
    expect(isCinematicHeaderScreen({ type: 'cinematic' })).toBe(true)
    expect(read('src/components/layout/ScreenRenderer.jsx'))
      .toContain('onTextRevealStart={() => setCinematicHeaderVisible(true)}')
  })

  it('has no authored content left using any retired screen type', async () => {
    const chapters = await loadAllChapters()
    const retired = ['visualNarrative', 'cinematicReveal', 'video']
    const offenders = []
    for (const [id, chapter] of chapters) {
      ;(chapter.screens || []).forEach((screen, index) => {
        if (retired.includes(screen?.type)) offenders.push(`${id}[${index}] ${screen.type}`)
      })
    }
    expect(offenders).toEqual([])
  })

  it('keeps production failures recoverable and accepted data variants renderable', () => {
    const renderer = read('src/components/layout/ScreenRenderer.jsx')
    expect(renderer).not.toContain('function UnsupportedScreen({ screen, chapter, definition }) {\n  const type = getScreenType(screen)\n  if (!import.meta.env.DEV) return null')
    expect(renderer).toContain("const scenarios = Array.isArray(block.scenarios) ? block.scenarios : [block]")
    expect(renderer).toContain('Array.isArray(block.points)')
  })
})
