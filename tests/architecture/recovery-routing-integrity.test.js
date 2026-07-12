import { describe, it, expect } from 'vitest'
import { TAG_MODULE_MAP, findTaggedScreen } from '../../src/data/tagModuleMap.js'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'

// Guards the weakness → recovery routing chain:
//   weakness tag → TAG_MODULE_MAP → module → findTaggedScreen → screen index
// A break anywhere here means a learner who has identified a gap is either
// routed to a module that doesn't exist (crash / dead card) or lands on the
// wrong teaching screen. These are learner-trust failures, so they must fail
// the build, not surface in production.

const moduleById = new Map(MODULES.map(m => [m.id, m]))
const entries = Object.entries(TAG_MODULE_MAP)
// Legacy mappings that still open at screen 0 because no explicit tagged
// screen exists yet. Shrink only by individual tag; never add module-wide
// exemptions and never use this for new mappings.
const LEGACY_SCREEN_ZERO_RECOVERY_TAGS = new Set([
  'black-death',
  'communication',
  'diagnosis',
  'genetics',
  'lifestyle-factors',
  'medieval-causes',
  'medieval-prevention',
  'nhs',
  'nightingale',
  'royal-society',
  'scientific-method',
  'surgery',
  'war-and-medicine',
])

describe('Recovery routing — TAG_MODULE_MAP integrity', () => {
  it('every mapping value is either a real module id or an explicit null', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue // explicit "not recoverable via one module"
      expect(
        moduleById.has(target),
        `tag "${tag}" maps to "${target}", which is not a module in src/modules.js`
      ).toBe(true)
    }
  })

  it('null targets are intentional, not accidental — documents non-recoverable tags', () => {
    const nonRecoverable = entries.filter(([, target]) => target === null).map(([tag]) => tag)
    // factors-in-change spans every era — deliberately has no single module.
    // If this list changes, it must be a conscious decision, not a typo.
    expect(nonRecoverable).toEqual(['factors-in-change'])
  })

  it('new non-null mappings resolve to explicit tagged screens instead of implicit screen 0', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      const mod = moduleById.get(target)
      if (LEGACY_SCREEN_ZERO_RECOVERY_TAGS.has(tag)) continue
      expect(
        mod.screenTags || [],
        `tag "${tag}" routes to "${target}" but is not an explicit screenTag; add a tagged screen or a shrink-only legacy exception`
      ).toContain(tag)
      const idx = findTaggedScreen(mod, tag)
      expect(idx, `tag "${tag}" not found in ${target}.screenTags`).toBeTypeOf('number')
      expect(idx, `tag "${tag}" → index ${idx} out of range for ${target} (screenCount ${mod.screenCount})`)
        .toBeLessThan(mod.screenCount)
      expect(idx).toBeGreaterThanOrEqual(0)
    }
  })

  it('every mapped module has real content (screenCount > 0) so recovery never opens an empty module', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      const mod = moduleById.get(target)
      expect(
        mod.screenCount,
        `tag "${tag}" routes to "${target}", which has no built content (screenCount 0)`
      ).toBeGreaterThan(0)
    }
  })

  it('recovery screen indexes are exact, not proportional estimates — the tagged screen actually carries the tag in loaded content', async () => {
    // A proportional/estimated mapping would put the tag on a screen whose
    // real content is about something else. Verify against the loaded module
    // that the resolved screen's own tag matches.
    for (const [tag, target] of entries) {
      if (target === null) continue
      if (LEGACY_SCREEN_ZERO_RECOVERY_TAGS.has(tag)) continue
      const mod = moduleById.get(target)
      const idx = findTaggedScreen(mod, tag)
      const loader = MODULE_CONTENT_LOADERS[target]
      expect(loader, `${target} has no content loader`).toBeTypeOf('function')
      const content = await loader()
      const actualTag = content.screens[idx]?.tag ?? null
      expect(
        actualTag,
        `recovery for "${tag}" lands on ${target} screen ${idx}, whose real tag is "${actualTag}" — mapping is stale/proportional`
      ).toBe(tag)
    }
  })
})
