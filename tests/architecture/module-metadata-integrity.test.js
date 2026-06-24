import { describe, it, expect } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { HISTORY_MODULES } from '../../src/modules/history.js'
import { BIOLOGY_MODULES } from '../../src/modules/biology.js'
import { MATHS_MODULES } from '../../src/modules/maths.js'
import { SOCIOLOGY_MODULES } from '../../src/modules/sociology.js'
import { CHEMISTRY_MODULES } from '../../src/modules/chemistry.js'
import { ENGLISH_MODULES } from '../../src/modules/english.js'

const subjectLookup = {
  History:   new Map(HISTORY_MODULES.map((m)   => [m.id, m])),
  Biology:   new Map(BIOLOGY_MODULES.map((m)   => [m.id, m])),
  Maths:     new Map(MATHS_MODULES.map((m)     => [m.id, m])),
  Sociology: new Map(SOCIOLOGY_MODULES.map((m) => [m.id, m])),
  Chemistry: new Map(CHEMISTRY_MODULES.map((m) => [m.id, m])),
  English:   new Map(ENGLISH_MODULES.map((m)   => [m.id, m])),
}

const placeholders = MODULES.filter((m) => m.screenCount === 0)
const available = MODULES.filter((m) => m.screenCount > 0)

describe('Module metadata integrity — placeholders (screenCount === 0)', () => {
  it('every placeholder has screenTags: []', () => {
    for (const meta of placeholders) {
      expect(
        meta.screenTags,
        `[${meta.id}] placeholder module must have screenTags: []`
      ).toEqual([])
    }
  })
})

describe('Module metadata integrity — available modules (screenCount > 0)', () => {
  it('every available module has a matching full module in its subject file', () => {
    for (const meta of available) {
      const lookup = subjectLookup[meta.subject]
      expect(
        lookup,
        `[${meta.id}] subject="${meta.subject}" has no subject module file registered`
      ).toBeDefined()
      const full = lookup.get(meta.id)
      expect(
        full,
        `[${meta.id}] subject="${meta.subject}" — id not found in src/modules/${meta.subject.toLowerCase()}.js`
      ).toBeDefined()
    }
  })

  it('metadata.screenCount matches full module screens.length', () => {
    for (const meta of available) {
      const full = subjectLookup[meta.subject]?.get(meta.id)
      if (!full) continue // missing full module already caught above
      expect(
        meta.screenCount,
        `[${meta.id}] metadata.screenCount=${meta.screenCount} ≠ full module screens.length=${full.screens.length}`
      ).toBe(full.screens.length)
    }
  })

  it('metadata.screenTags.length matches metadata.screenCount', () => {
    for (const meta of available) {
      expect(
        meta.screenTags.length,
        `[${meta.id}] screenTags.length=${meta.screenTags.length} ≠ screenCount=${meta.screenCount}`
      ).toBe(meta.screenCount)
    }
  })

  it('metadata.screenTags match actual screen tags from the full module', () => {
    for (const meta of available) {
      const full = subjectLookup[meta.subject]?.get(meta.id)
      if (!full) continue // missing full module already caught above
      const actualTags = full.screens.map((s) => s.tag ?? null)
      expect(
        meta.screenTags,
        `[${meta.id}] screenTags in src/modules.js do not match actual screen tags in src/modules/${meta.subject.toLowerCase()}.js`
      ).toEqual(actualTags)
    }
  })
})
