import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { loadCatalogue } from '../../src/component-catalogue/loadCatalogue.js'
import { AUTHORING_COMPATIBILITY } from '../../src/component-catalogue/migrations/authoringCompatibility.js'
import { catalogueEntries, projectRegistries } from '../../scripts/generate-authoring-registry.mjs'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'
import { BLOCK_REGISTRY, SCREEN_REGISTRY } from '../../src/data/screenRegistry.js'
import {
  BLOCK_RENDERER_TYPES,
  FULL_SCREEN_RENDERER_TYPES,
} from '../../src/components/layout/ScreenRenderer.jsx'

// The bidirectional contract between the projected authoring registry and the
// concrete renderer. It replaces the old "the component field is truthy" check,
// which passed happily for choiceReveal → ChoiceRevealScreen, a component that
// never existed.
//
// Three routing tables carry the implementation, not one:
//   1. FULL_SCREEN_RENDERER_TYPES — the full-screen switch
//   2. the `infographic` branch inside ScreenContentRenderer
//   3. BLOCK_RENDERERS
// A contract covering only the first and third leaves `infographic` unguarded.

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')
const RENDERER = 'src/components/layout/ScreenRenderer.jsx'

const records = await loadCatalogue()
const entries = catalogueEntries(records)
const { screens, blocks } = projectRegistries(records)
const rendererSource = read(RENDERER)

const recordsByName = new Map(records.map(record => [record.name, record]))
const rendererRecord = recordsByName.get('ScreenRenderer')

// Screen types whose route lives inside ScreenContentRenderer rather than the
// full-screen switch. Documented here rather than inferred, so adding one is a
// deliberate act.
const CONTENT_LAYER_ROUTES = Object.freeze({
  infographic: "screen.type === 'infographic'",
})

// A derived type is never authored as `screen.type`. resolveScreenDefinition
// synthesises it from the screen's blocks, so its route is a block lookup
// rather than a type comparison — the third routing shape.
const DERIVED_ROUTES = Object.freeze({
  misconceptionCheck: "(cur?.blocks || []).find(b => b.type === 'misconceptionCheck')",
})

async function loadAllChapters() {
  return Promise.all(
    Object.entries(CHAPTER_CONTENT_LOADERS).map(async ([id, load]) => [id, await load()]),
  )
}

describe('every projected type resolves to a real implementation', () => {
  it('routes every active or derived screen type', () => {
    const unrouted = Object.entries(screens)
      .filter(([, definition]) => definition.status === 'active' || definition.status === 'derived')
      .filter(([type, definition]) => {
        if (FULL_SCREEN_RENDERER_TYPES.includes(type)) return false
        if (CONTENT_LAYER_ROUTES[type]) return false
        if (DERIVED_ROUTES[type]) return false
        // The default content layout is the fallback every non-full screen
        // takes; it needs no branch of its own.
        return !(definition.layout === 'content' && type === 'standard')
      })
      .map(([type]) => type)
    expect(unrouted).toEqual([])
  })

  it('routes every active block type', () => {
    const unrouted = Object.entries(blocks)
      .filter(([, definition]) => definition.status === 'active')
      .filter(([type]) => !BLOCK_RENDERER_TYPES.includes(type))
      .map(([type]) => type)
    expect(unrouted).toEqual([])
  })

  // A documented exception is only honest if the code really implements it.
  // Without these, either map could excuse a type that has no route at all.
  it('proves each documented content-layer route really is in the renderer', () => {
    for (const [type, marker] of Object.entries(CONTENT_LAYER_ROUTES)) {
      expect(screens[type], type).toBeDefined()
      expect(rendererSource, type).toContain(marker)
    }
  })

  it('proves each documented derived route really is in the renderer', () => {
    for (const [type, marker] of Object.entries(DERIVED_ROUTES)) {
      expect(screens[type]?.status, type).toBe('derived')
      expect(rendererSource, type).toContain(marker)
      // A derived screen type is synthesised from a block of the same name.
      expect(blocks[type], type).toBeDefined()
    }
  })
})

describe('every renderer route corresponds to a projected type', () => {
  // This is the direction that would have caught choiceReveal: an orphan branch
  // routing a type the registry no longer projects.
  it('has no full-screen route without a projected screen type', () => {
    const orphans = FULL_SCREEN_RENDERER_TYPES.filter(type => !screens[type])
    expect(orphans).toEqual([])
  })

  it('has no block renderer without a projected block type', () => {
    const orphans = BLOCK_RENDERER_TYPES.filter(type => !blocks[type])
    expect(orphans).toEqual([])
  })

  it('has no `cur?.type === ...` branch for an unprojected type', () => {
    const branched = [...rendererSource.matchAll(/cur\?\.type === '([A-Za-z]+)'/g)].map(m => m[1])
    expect(branched.filter(type => !screens[type])).toEqual([])
  })

  it('keeps derived types out of the full-screen switch', () => {
    // A derived type is synthesised by resolveScreenDefinition, never authored
    // as screen.type, so it must not appear in the authored-route list.
    const derived = Object.entries(screens)
      .filter(([, definition]) => definition.status === 'derived')
      .map(([type]) => type)
    expect(derived).not.toEqual([])
    for (const type of derived) {
      expect(FULL_SCREEN_RENDERER_TYPES, type).not.toContain(type)
    }
  })
})

describe('component names match the implementation actually used', () => {
  it('resolves every projected component to a record, a private handler or a compatibility handler', () => {
    const compatibilityHandlers = new Set(AUTHORING_COMPATIBILITY.map(entry => entry.currentHandler))
    const privateHandlers = new Set(
      entries.filter(({ entry }) => entry.handler).map(({ entry }) => entry.handler),
    )
    const unresolved = []
    for (const [level, map] of [['screen', screens], ['block', blocks]]) {
      for (const [type, definition] of Object.entries(map)) {
        const known = recordsByName.has(definition.component)
          || privateHandlers.has(definition.component)
          || compatibilityHandlers.has(definition.component)
        if (!known) unresolved.push(`${level}:${type} → ${definition.component}`)
      }
    }
    expect(unresolved).toEqual([])
  })

  it('points every private handler at a function that exists in its own source', () => {
    const missing = []
    for (const { entry, record } of entries) {
      if (!entry.handler) continue
      const source = read(record.source)
      const declared = new RegExp(`function ${entry.handler}\\b|const ${entry.handler}\\s*=`)
      if (!declared.test(source)) missing.push(`${record.id}: ${entry.handler} not found in ${record.source}`)
    }
    expect(missing).toEqual([])
  })

  it('points every component-owned entry at a record whose source exists', () => {
    const missing = []
    for (const { entry, record } of entries) {
      if (entry.handler) continue
      if (!existsSync(resolve(root, record.source))) missing.push(`${record.id} → ${record.source}`)
    }
    expect(missing).toEqual([])
  })

  it('never lets a private handler shadow a public component record', () => {
    // A handler is private by definition. If a standalone component of the same
    // name is ever catalogued, the entry must move to that record rather than
    // two implementations answering to one name.
    const shadowed = entries
      .filter(({ entry }) => entry.handler && recordsByName.has(entry.handler))
      .map(({ entry, record }) => `${record.id}: ${entry.handler}`)
    expect(shadowed).toEqual([])
  })

  it('declares every non-authorable handler in the renderer record', () => {
    const declared = new Set(
      (rendererRecord.authoring.nonAuthorableHandlers ?? []).map(handler => handler.name),
    )
    const authorable = new Set(
      entries.filter(({ record }) => record === rendererRecord).map(({ entry }) => entry.handler),
    )
    // Every function the renderer defines is either authorable through exactly
    // one entry, or explicitly declared as not authorable. Nothing is silent.
    const defined = [...rendererSource.matchAll(/^function ([A-Z][A-Za-z0-9]*)\(/gm)].map(m => m[1])
    const unaccounted = defined.filter(name => !authorable.has(name) && !declared.has(name))
    expect(unaccounted).toEqual([])
  })
})

describe('aliases sharing an implementation are supported', () => {
  it('allows a type name that differs from its component name', () => {
    expect(screens.naturalSupernaturalSwipe.component).toBe('SwipeSort')
    expect(screens.interactiveImage.component).toBe('InteractiveHotspotImage')
  })

  it('allows one component to own both a screen and a block type', () => {
    for (const type of ['oppositeQualitiesReveal', 'misconceptionCheck']) {
      expect(screens[type], type).toBeDefined()
      expect(blocks[type], type).toBeDefined()
      expect(screens[type].component, type).toBe(blocks[type].component)
    }
  })

  it('keeps screen and block namespaces separate for a colliding type name', () => {
    // tieredquiz is an active screen type and a legacy compatibility block. A
    // single merged map would silently drop one of them.
    expect(screens.tieredquiz.status).toBe('active')
    expect(screens.tieredquiz.component).toBe('TieredQuizScreen')
    expect(blocks.tieredquiz.status).toBe('legacy')
    expect(blocks.tieredquiz.component).toBe('LegacyUnroutedBlock')
  })

  it('distinguishes two records sharing one source file by export name', () => {
    const chain = recordsByName.get('TimelineChain')
    const chainBlock = recordsByName.get('TimelineChainBlock')
    expect(chain.source).toBe(chainBlock.source)
    expect(chain.exportName).toBeNull()
    expect(chainBlock.exportName).toBe('TimelineChainBlock')
    expect(screens.timelineChain.component).toBe('TimelineChain')
    expect(blocks.timelineChain.component).toBe('TimelineChainBlock')
  })
})

describe('compatibility entries are the only legacy-unrouted entries', () => {
  it('marks every legacy projected type as compatibility-owned', () => {
    const compatibility = new Set(AUTHORING_COMPATIBILITY.map(entry => `${entry.level}:${entry.type}`))
    const legacy = []
    for (const [level, map] of [['screen', screens], ['block', blocks]]) {
      for (const [type, definition] of Object.entries(map)) {
        if (definition.status === 'legacy') legacy.push(`${level}:${type}`)
      }
    }
    expect([...legacy].sort()).toEqual([...compatibility].sort())
  })

  it('lets no catalogue record author a legacy entry', () => {
    // Legacy lives in the compatibility registry alone, so a component record
    // can never quietly acquire a permanent tombstone.
    const offenders = entries
      .filter(({ entry }) => entry.status === 'legacy')
      .map(({ entry, record }) => `${record.id}: ${entry.type}`)
    expect(offenders).toEqual([])
  })

  it('gives every compatibility entry a handler that is not a real component', () => {
    for (const entry of AUTHORING_COMPATIBILITY) {
      expect(recordsByName.has(entry.currentHandler), entry.type).toBe(false)
      expect(new RegExp(`function ${entry.currentHandler}\\b`).test(rendererSource), entry.type).toBe(true)
    }
  })

  it('states a reason and a removal condition for every entry', () => {
    for (const entry of AUTHORING_COMPATIBILITY) {
      expect(entry.reason.trim().length, entry.type).toBeGreaterThan(40)
      expect(entry.removalCondition.trim().length, entry.type).toBeGreaterThan(40)
      expect(entry.replacement, entry.type).toBeTruthy()
    }
  })

  // The forcing function. A compatibility entry earns its place by being
  // referenced; the moment the last authored use goes, the entry must go too,
  // or this registry silently becomes the tombstone list it must never be.
  it('fails when a compatibility entry no longer has live authored content', async () => {
    const chapters = await loadAllChapters()
    const live = new Set()
    for (const [, chapter] of chapters) {
      for (const screen of chapter.screens || []) {
        for (const block of screen.blocks || []) {
          if (block?.type) live.add(`block:${block.type}`)
        }
        if (screen?.type) live.add(`screen:${screen.type}`)
      }
    }
    const stale = AUTHORING_COMPATIBILITY
      .filter(entry => !live.has(`${entry.level}:${entry.type}`))
      .map(entry => `${entry.level}:${entry.type} — ${entry.removalCondition}`)
    expect(stale).toEqual([])
  })
})

describe('the projection is the runtime authority', () => {
  it('is what screenRegistry.js re-exports', () => {
    expect(SCREEN_REGISTRY).toEqual(screens)
    expect(BLOCK_REGISTRY).toEqual(blocks)
  })

  it('no longer authors entries in screenRegistry.js', () => {
    const source = read('src/data/screenRegistry.js')
    expect(source).toContain("from './generated/componentAuthoringRegistry.js'")
    expect(source).not.toMatch(/^const screen = /m)
    expect(source).not.toMatch(/^const block = /m)
    expect(source).not.toMatch(/^export const SCREEN_REGISTRY = Object\.freeze\(\{/m)
    expect(source).not.toMatch(/^export const BLOCK_REGISTRY = Object\.freeze\(\{/m)
  })

  it('carries no field the runtime does not read', () => {
    const runtimeFields = [
      'authoringName', 'component', 'level', 'layout', 'status', 'replacement',
      'required', 'requiredAny', 'continuation', 'headerMode',
    ].sort()
    for (const map of [screens, blocks]) {
      for (const [type, definition] of Object.entries(map)) {
        expect(Object.keys(definition).sort(), type).toEqual(runtimeFields)
      }
    }
  })

  it('zero authored uses never silently retires an active type', () => {
    // Several active types have no authored use yet. They stay authorable:
    // availability is a catalogue decision, not a usage statistic.
    const unusedButActive = ['cinematicCarousel']
    for (const type of unusedButActive) {
      expect(screens[type]?.status, type).toBe('active')
      expect(FULL_SCREEN_RENDERER_TYPES, type).toContain(type)
    }
  })
})
