import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { loadCatalogue } from '../../src/component-catalogue/loadCatalogue.js'
import { validateRecord } from '../../src/component-catalogue/schema.js'
import { FUNCTION_TAGS as AUTHORED_TAGS, INTERACTION_CLASSES } from '../../src/component-catalogue/pedagogyVocabulary.js'
import { AUTHORING_COMPATIBILITY } from '../../src/component-catalogue/migrations/authoringCompatibility.js'
import { NON_AUTHORING_PEDAGOGY } from '../../src/component-catalogue/migrations/nonAuthoringPedagogy.js'
import { catalogueEntries } from '../../scripts/generate-authoring-registry.mjs'
import { projectPedagogy } from '../../scripts/generate-pedagogy-registry.mjs'
import {
  FUNCTION_TAGS, SCREEN_TYPE_FUNCTIONS,
  getTypeInfo, isPassive, isAssessed,
  getScreenTypeInfo, getBlockTypeInfo,
} from '../../src/data/componentFunctions.js'
import {
  SCREEN_TYPE_PEDAGOGY as SHIPPED_SCREENS,
  BLOCK_TYPE_PEDAGOGY as SHIPPED_BLOCKS,
} from '../../src/data/generated/componentPedagogyRegistry.js'

// Phase 3 authority contract. Every expectation is derived from the catalogue,
// the compatibility registry and the non-authoring registry — there is no
// hardcoded list of types anywhere in this file, so a type added next year is
// covered the day it is added.

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

// Loaded defensively for the same reason the projection is: an invalid record
// makes loadCatalogue throw, and a collection-time throw reports as an unnamed
// file failure. Catching it turns a malformed pedagogy fact into a readable
// named assertion here as well as in the catalogue-integrity suite.
let records = []
let loadError = null
try {
  records = await loadCatalogue()
} catch (error) {
  loadError = error
}
const entries = catalogueEntries(records)

// Recomputed from the authored surfaces. Projection is defensive because a
// missing or malformed fact makes it throw, and a throw at collection time
// reports as "1 test file failed" with no named test — which is exactly the
// regression these guards exist to name.
let projected = { screens: {}, blocks: {}, flat: {} }
let projectionError = null
try {
  projected = projectPedagogy(records)
} catch (error) {
  projectionError = error
}
const { screens, blocks, flat } = projected

// The projection as actually shipped, read through the public API rather than
// recomputed — a hand-edit to the generated file must fail here too, not only
// in `pedagogy:check`.
const shipped = { flat: SCREEN_TYPE_FUNCTIONS, screens: SHIPPED_SCREENS, blocks: SHIPPED_BLOCKS }

const label = ({ entry, record }) => `${record.id}:${entry.level}:${entry.type}`

describe('every authoring entry carries exactly one pedagogical classification', () => {
  const byStatus = status => entries.filter(({ entry }) => entry.status === status)

  it('loads every record with a schema-valid pedagogy block', () => {
    expect(loadError?.message ?? null).toBeNull()
  })

  const expectExactlyOne = population => {
    const wrong = []
    for (const item of population) {
      const { entry } = item
      if (entry.pedagogyExemption) {
        if (entry.pedagogy !== null) wrong.push(`${label(item)}: exempt but carries pedagogy`)
        continue
      }
      if (!entry.pedagogy) { wrong.push(`${label(item)}: no pedagogy`); continue }
      if (!Array.isArray(entry.pedagogy.functions) || entry.pedagogy.functions.length === 0) {
        wrong.push(`${label(item)}: empty functions`)
      }
      if (!INTERACTION_CLASSES.includes(entry.pedagogy.interaction)) {
        wrong.push(`${label(item)}: invalid interaction`)
      }
    }
    return wrong
  }

  it('covers every active screen authoring entry', () => {
    const population = byStatus('active').filter(({ entry }) => entry.level === 'screen')
    expect(population.length).toBeGreaterThan(0)
    expect(expectExactlyOne(population)).toEqual([])
  })

  it('covers every active block authoring entry', () => {
    const population = byStatus('active').filter(({ entry }) => entry.level === 'block')
    expect(population.length).toBeGreaterThan(0)
    expect(expectExactlyOne(population)).toEqual([])
  })

  it('covers every derived authoring entry', () => {
    const population = byStatus('derived')
    expect(population.length).toBeGreaterThan(0)
    expect(expectExactlyOne(population)).toEqual([])
  })

  it('covers every compatibility entry in authoringCompatibility.js', () => {
    const wrong = AUTHORING_COMPATIBILITY
      .filter(entry => !entry.pedagogy
        || !Array.isArray(entry.pedagogy.functions)
        || entry.pedagogy.functions.length === 0
        || !INTERACTION_CLASSES.includes(entry.pedagogy.interaction))
      .map(entry => entry.type)
    expect(wrong).toEqual([])
  })
})

describe('the container-derived exemption is narrow and governed', () => {
  const exempt = entries.filter(({ entry }) => entry.pedagogyExemption)

  it('exists, and only as a structured container-derived object', () => {
    expect(exempt.length).toBeGreaterThan(0)
    for (const item of exempt) {
      const { pedagogyExemption } = item.entry
      expect(pedagogyExemption.kind, label(item)).toBe('container-derived')
      expect(pedagogyExemption.reason?.trim().length ?? 0, label(item)).toBeGreaterThan(30)
      // Never a bare boolean or truthy flag.
      expect(typeof pedagogyExemption, label(item)).toBe('object')
    }
  })

  it('only covers an entry that genuinely delegates to contained entries', () => {
    for (const item of exempt) {
      const { entry } = item
      expect(entry.level, label(item)).toBe('screen')
      expect(
        entry.required.some(r => r.path === 'blocks' && r.kind === 'array'),
        `${label(item)} must structurally require a blocks array to delegate`,
      ).toBe(true)
    }
  })

  it('omits exempt entries from every generated map, so the helpers stay null and false', () => {
    for (const item of exempt) {
      const { type } = item.entry
      expect(screens[type], type).toBeUndefined()
      expect(flat[type], type).toBeUndefined()
      expect(getTypeInfo(type), type).toBeNull()
      expect(isPassive(type), type).toBe(false)
      expect(isAssessed(type), type).toBe(false)
      expect(getScreenTypeInfo(type), type).toBeNull()
    }
  })
})

describe('the projection contains exactly what the authored surfaces own', () => {
  it('projects without error from the authored surfaces', () => {
    expect(projectionError?.message ?? null).toBeNull()
  })

  it('has no key without an owning authoring, compatibility or non-authoring entry', () => {
    const owned = { screen: new Set(), block: new Set() }
    for (const { entry } of entries) {
      if (!entry.pedagogyExemption) owned[entry.level].add(entry.type)
    }
    for (const entry of AUTHORING_COMPATIBILITY) owned[entry.level].add(entry.type)

    const flatOwned = new Set([
      ...owned.screen, ...owned.block,
      ...NON_AUTHORING_PEDAGOGY.map(entry => entry.type),
    ])

    // Both the recomputed projection and the one actually shipped: a hand-edit
    // to the generated file is a defect even when the catalogue is clean.
    for (const [name, maps] of [['recomputed', { screens, blocks, flat }], ['shipped', shipped]]) {
      expect(Object.keys(maps.screens).filter(t => !owned.screen.has(t)), name).toEqual([])
      expect(Object.keys(maps.blocks).filter(t => !owned.block.has(t)), name).toEqual([])
      expect(Object.keys(maps.flat).filter(t => !flatOwned.has(t)), name).toEqual([])
    }
  })

  it('ships exactly the projection the authored surfaces produce', () => {
    expect(shipped.screens).toEqual(screens)
    expect(shipped.blocks).toEqual(blocks)
    expect(shipped.flat).toEqual(flat)
  })

  it('keeps screen and block namespaces separate', () => {
    expect(screens).not.toBe(blocks)
    const collisions = Object.keys(screens).filter(type => blocks[type])
    expect(collisions.length).toBeGreaterThan(0) // the four known pairs
    for (const type of collisions) {
      // Independent facts that happen to agree — the generator fails the build
      // if they ever diverge, because the flat view could not represent it.
      expect(getScreenTypeInfo(type), type).toEqual(screens[type])
      expect(getBlockTypeInfo(type), type).toEqual(blocks[type])
    }
  })

  it('draws every function from the authored vocabulary, in canonical order', () => {
    expect([...FUNCTION_TAGS]).toEqual([...AUTHORED_TAGS])
    const unknown = []
    for (const [name, map] of [['screen', screens], ['block', blocks], ['flat', flat]]) {
      for (const [type, value] of Object.entries(map)) {
        for (const fn of value.functions) {
          if (!AUTHORED_TAGS.includes(fn)) unknown.push(`${name}:${type} → ${fn}`)
        }
      }
    }
    expect(unknown).toEqual([])
  })

  it('uses only valid interaction classes', () => {
    const invalid = []
    for (const [name, map] of [['screen', screens], ['block', blocks], ['flat', flat]]) {
      for (const [type, value] of Object.entries(map)) {
        if (!INTERACTION_CLASSES.includes(value.interaction)) invalid.push(`${name}:${type}`)
      }
    }
    expect(invalid).toEqual([])
  })
})

describe('non-authoring classifications are a governed shrinking set', () => {
  // The set is empty as of Phase 4 — `calculationBreakdown` was its only entry
  // and now carries its classification on a genuine authoring entry. Empty is
  // the intended end state, so the count is deliberately not asserted; what is
  // asserted is that any entry which reappears still pays the full price.
  it('names a live consumer and a way out for every entry', () => {
    for (const entry of NON_AUTHORING_PEDAGOGY) {
      expect(entry.reason?.trim().length ?? 0, entry.type).toBeGreaterThan(40)
      expect(entry.removalCondition?.trim().length ?? 0, entry.type).toBeGreaterThan(40)
      expect(entry.pedagogy.functions.length, entry.type).toBeGreaterThan(0)
    }
  })

  it('keeps the shim out once its classification has an authoring entry', () => {
    // The forcing function that made the Phase 4 handover safe, kept live: the
    // generator refuses to hold the same classification twice, so a
    // re-introduced shim fails generation instead of silently shadowing the
    // record it was meant to hand over to.
    const authoredType = entries.find(({ entry }) => entry.type === 'calculationBreakdown')
    expect(authoredType, 'calculationBreakdown must own its own authoring entry').toBeDefined()
    expect(() => projectPedagogy(records, [{
      type: 'calculationBreakdown',
      pedagogy: { functions: ['sequence-process', 'apply'], interaction: 'assessed' },
    }])).toThrow(/collides with an authoring entry/)
  })

  it('holds no type that already has an authoring entry', () => {
    const authored = new Set(entries.map(({ entry }) => entry.type))
    const overlap = NON_AUTHORING_PEDAGOGY.filter(entry => authored.has(entry.type)).map(e => e.type)
    expect(overlap).toEqual([])
  })
})

describe('renderer-owned types stay owned by their renderer record', () => {
  it('keeps every private-handler pedagogy fact on the record that owns the handler', () => {
    const misplaced = entries
      .filter(({ entry }) => entry.handler)
      .filter(({ entry, record }) => !read(record.source).includes(`function ${entry.handler}`))
      .map(item => label(item))
    expect(misplaced).toEqual([])
  })

  it('invents no component record for a private handler', () => {
    const names = new Set(records.map(record => record.name))
    const faked = entries
      .filter(({ entry }) => entry.handler && names.has(entry.handler))
      .map(item => label(item))
    expect(faked).toEqual([])
  })
})

describe('componentFunctions.js authors no taxonomy data', () => {
  const source = read('src/data/componentFunctions.js')
  // Comments are stripped first: the file documents what the three interaction
  // classes mean, and that prose is worth keeping. A comment authors nothing —
  // the guard is about declared data, so it must read code, not text.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

  it('imports the generated projection and declares no classification of its own', () => {
    expect(source).toContain("from './generated/componentPedagogyRegistry.js'")
    expect(code).not.toMatch(/interaction:\s*'(passive|reveal|assessed)'/)
    expect(code).not.toMatch(/functions:\s*\[/)
    expect(code).not.toMatch(/^export const FUNCTION_TAGS = \[/m)
    expect(code).not.toMatch(/^export const SCREEN_TYPE_FUNCTIONS = \{/m)
  })

  it('preserves the full public API', () => {
    for (const helper of [getTypeInfo, isPassive, isAssessed, getScreenTypeInfo, getBlockTypeInfo]) {
      expect(typeof helper).toBe('function')
    }
    expect(Object.isFrozen(SCREEN_TYPE_FUNCTIONS)).toBe(true)
    expect(getTypeInfo('nonexistent-type')).toBeNull()
    expect(isPassive('nonexistent-type')).toBe(false)
    expect(isAssessed('nonexistent-type')).toBe(false)
  })
})

describe('the generated projection is runtime-safe', () => {
  const projection = read('src/data/generated/componentPedagogyRegistry.js')

  it('imports nothing and carries no governance prose', () => {
    expect(projection).not.toMatch(/(?:from\s*|import\s*\(?\s*)['"]/)
    expect(projection).toContain('GENERATED FILE — DO NOT EDIT')
    for (const prose of ['removalCondition', 'reason:', 'criticality', 'useWhen', 'pedagogyExemption']) {
      expect(projection, prose).not.toContain(prose)
    }
  })
})

describe('the schema rejects a missing or invalid classification', () => {
  const withEntries = records.find(record => record.authoring)
  const mutateFirstEntry = change => {
    const [first, ...rest] = withEntries.authoring.entries
    return {
      ...withEntries,
      authoring: { ...withEntries.authoring, entries: [{ ...first, ...change }, ...rest] },
    }
  }

  it('rejects an authoring entry with no pedagogy', () => {
    const [first, ...rest] = withEntries.authoring.entries
    const { pedagogy, ...withoutPedagogy } = first // eslint-disable-line no-unused-vars
    const mutated = {
      ...withEntries,
      authoring: { ...withEntries.authoring, entries: [withoutPedagogy, ...rest] },
    }
    expect(validateRecord(mutated).join('\n')).toContain('is missing required key "pedagogy"')
  })

  it('rejects a function outside the canonical vocabulary', () => {
    expect(validateRecord(mutateFirstEntry({ pedagogy: { functions: ['made-up-tag'], interaction: 'passive' } })).join('\n'))
      .toContain('is not in the canonical vocabulary')
  })

  it('rejects a duplicate function', () => {
    expect(validateRecord(mutateFirstEntry({ pedagogy: { functions: ['apply', 'apply'], interaction: 'passive' } })).join('\n'))
      .toContain('duplicates "apply"')
  })

  it('rejects an empty function list', () => {
    expect(validateRecord(mutateFirstEntry({ pedagogy: { functions: [], interaction: 'passive' } })).join('\n'))
      .toContain('must name at least one function tag')
  })

  it('rejects an invalid interaction class', () => {
    expect(validateRecord(mutateFirstEntry({ pedagogy: { functions: ['apply'], interaction: 'active' } })).join('\n'))
      .toContain('pedagogy.interaction must be one of')
  })

  it('rejects a null pedagogy with no exemption', () => {
    expect(validateRecord(mutateFirstEntry({ pedagogy: null })).join('\n'))
      .toContain('may be null only with a container-derived pedagogyExemption')
  })

  it('rejects an exemption kind other than container-derived', () => {
    expect(validateRecord(mutateFirstEntry({
      pedagogy: null,
      pedagogyExemption: { kind: 'because-i-said-so', reason: 'A reason long enough to pass the length check.' },
    })).join('\n')).toContain('must be "container-derived"')
  })

  it('rejects a container-derived exemption on an entry that delegates to nothing', () => {
    // The exemption may not spread: an entry with no blocks requirement has no
    // contained entries to derive its classification from.
    const nonContainer = entries.find(({ entry }) =>
      !entry.pedagogyExemption && !entry.required.some(r => r.path === 'blocks'))
    const record = nonContainer.record
    const mutated = {
      ...record,
      authoring: {
        ...record.authoring,
        entries: record.authoring.entries.map(entry => entry === nonContainer.entry
          ? { ...entry, pedagogy: null, pedagogyExemption: { kind: 'container-derived', reason: 'A reason long enough to pass the length requirement here.' } }
          : entry),
      },
    }
    expect(validateRecord(mutated).join('\n')).toContain('does not delegate to contained entries')
  })
})

describe('the human registry renders every canonical pedagogy fact exactly once', () => {
  const registryDoc = read('docs/components/COMPONENT_REGISTRY.md')
  const occurrences = needle => registryDoc.split(needle).length - 1

  it('renders one Pedagogy line per authoring entry', () => {
    const wrong = []
    for (const item of entries) {
      const { entry } = item
      const line = entry.pedagogyExemption
        ? '  - Pedagogy: derived from contained blocks'
        : `  - Pedagogy: ${entry.pedagogy.functions.join(', ')} · ${entry.pedagogy.interaction}`
      if (occurrences(line) < 1) wrong.push(`${label(item)}: not rendered`)
    }
    expect(wrong).toEqual([])
    // Total Pedagogy lines equals total authoring entries — none extra, none missing.
    expect(occurrences('\n  - Pedagogy: ')).toBe(entries.length)
  })

  it('renders every compatibility pedagogy in the appendix exactly once', () => {
    for (const entry of AUTHORING_COMPATIBILITY) {
      const cell = `| ${entry.pedagogy.functions.join(', ')} · ${entry.pedagogy.interaction} | ${entry.removalCondition} |`
      expect(occurrences(cell), entry.type).toBe(1)
    }
  })

  it('renders every non-authoring classification exactly once', () => {
    expect(occurrences('### Non-authoring classifications')).toBe(1)
    for (const entry of NON_AUTHORING_PEDAGOGY) {
      const row = `| \`${entry.type}\` | ${entry.pedagogy.functions.join(', ')} · ${entry.pedagogy.interaction} | ${entry.reason} | ${entry.removalCondition} |`
      expect(occurrences(row), entry.type).toBe(1)
    }
  })

  it('no longer claims the taxonomy lives outside the catalogue', () => {
    expect(registryDoc).not.toContain('Pedagogical function tags stay in')
    expect(registryDoc).toContain('**Pedagogy authority.**')
    expect(registryDoc).toContain('src/component-catalogue/pedagogyVocabulary.js')
  })
})
