import { describe, it, expect } from 'vitest'
import {
  MODULES,
  isModuleAvailable,
  getModuleAvailability,
  MODULE_AVAILABILITY,
} from '../../src/modules.js'
import { MODULE_GROUPS } from '../../src/progress.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'
import { TAG_MODULE_MAP } from '../../src/data/tagModuleMap.js'

const moduleById = new Map(MODULES.map(m => [m.id, m]))

// Governs the "incomplete module safety" rules: a learner must never be
// planned into, recommended into, or land inside an unbuilt module.

describe('Module availability — derivation', () => {
  it('derives availability from screenCount when not explicitly set', () => {
    expect(getModuleAvailability({ screenCount: 5 })).toBe(MODULE_AVAILABILITY.AVAILABLE)
    expect(getModuleAvailability({ screenCount: 0 })).toBe(MODULE_AVAILABILITY.COMING_SOON)
    expect(getModuleAvailability(null)).toBe(MODULE_AVAILABILITY.HIDDEN)
  })

  it('an explicit availability field overrides the screenCount derivation', () => {
    expect(getModuleAvailability({ screenCount: 5, availability: 'hidden' })).toBe('hidden')
    expect(getModuleAvailability({ screenCount: 0, availability: 'available' })).toBe('available')
  })

  it('every available module has real, loadable content', async () => {
    for (const mod of MODULES.filter(isModuleAvailable)) {
      expect(mod.screenCount, `${mod.id} available but screenCount 0`).toBeGreaterThan(0)
      const loader = MODULE_CONTENT_LOADERS[mod.id]
      expect(loader, `${mod.id} available but has no content loader`).toBeTypeOf('function')
      const content = await loader()
      expect(content.screens.length, `${mod.id} available but loads no screens`).toBeGreaterThan(0)
    }
  })

  it('every explicitly non-available metadata value is a known governance state', () => {
    for (const mod of MODULES) {
      if (!mod.availability) continue
      expect(Object.values(MODULE_AVAILABILITY)).toContain(mod.availability)
    }
  })
})

describe('Module availability — planner & discovery safety', () => {
  it('every module a MODULE_GROUP can select is either available or an intentional stub, never a dangling id', () => {
    for (const group of MODULE_GROUPS) {
      for (const id of group.chapterIds) {
        // A chapter id may legitimately be a coming-soon stub, but it must at
        // least resolve to a real metadata entry so selection logic can gate it.
        expect(moduleById.has(id), `MODULE_GROUP "${group.id}" references unknown module "${id}"`).toBe(true)
      }
    }
  })

  it('weak-spot recovery never targets a non-available module', () => {
    for (const [tag, target] of Object.entries(TAG_MODULE_MAP)) {
      if (target === null) continue
      const mod = moduleById.get(target)
      expect(
        isModuleAvailable(mod),
        `tag "${tag}" recovery-routes to "${target}", which is not available`
      ).toBe(true)
    }
  })
})
