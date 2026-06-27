import { describe, it, expect } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'

const registryIds = new Set(Object.keys(MODULE_CONTENT_LOADERS))
const stubs = MODULES.filter(m => m.screenCount === 0)
const built = MODULES.filter(m => m.screenCount > 0)

describe('Module metadata integrity — stubs (screenCount === 0)', () => {
  it('every stub has screenTags: []', () => {
    for (const meta of stubs) {
      expect(
        meta.screenTags,
        `[${meta.id}] stub must have screenTags: []`
      ).toEqual([])
    }
  })

  it('every stub has a registry entry in MODULE_CONTENT_LOADERS', () => {
    for (const meta of stubs) {
      expect(
        registryIds.has(meta.id),
        `[${meta.id}] stub missing from MODULE_CONTENT_LOADERS in moduleContentRegistry.js`
      ).toBe(true)
    }
  })
})

describe('Module metadata integrity — built modules (screenCount > 0)', () => {
  it('every built module has a registry entry', () => {
    for (const meta of built) {
      expect(
        registryIds.has(meta.id),
        `[${meta.id}] missing from MODULE_CONTENT_LOADERS in moduleContentRegistry.js`
      ).toBe(true)
    }
  })

  it('metadata.screenTags.length matches metadata.screenCount', () => {
    for (const meta of built) {
      expect(
        meta.screenTags.length,
        `[${meta.id}] screenTags.length=${meta.screenTags.length} ≠ screenCount=${meta.screenCount}`
      ).toBe(meta.screenCount)
    }
  })

  it('metadata.screenCount matches loaded content screens.length', async () => {
    for (const meta of built) {
      const loader = MODULE_CONTENT_LOADERS[meta.id]
      if (!loader) continue // missing registry entry already caught above
      const content = await loader()
      expect(
        meta.screenCount,
        `[${meta.id}] metadata.screenCount=${meta.screenCount} ≠ content.screens.length=${content.screens.length}`
      ).toBe(content.screens.length)
    }
  })

  it('metadata.screenTags match actual screen tags from loaded content', async () => {
    for (const meta of built) {
      const loader = MODULE_CONTENT_LOADERS[meta.id]
      if (!loader) continue // missing registry entry already caught above
      const content = await loader()
      const actualTags = content.screens.map(s => s.tag ?? null)
      expect(
        meta.screenTags,
        `[${meta.id}] screenTags in src/modules.js do not match content screen tags`
      ).toEqual(actualTags)
    }
  })
})

describe('Module metadata integrity — registry completeness', () => {
  it('every registry entry has a matching module in src/modules.js', () => {
    const moduleIds = new Set(MODULES.map(m => m.id))
    for (const id of registryIds) {
      expect(
        moduleIds.has(id),
        `[${id}] in MODULE_CONTENT_LOADERS has no metadata entry in src/modules.js`
      ).toBe(true)
    }
  })
})
