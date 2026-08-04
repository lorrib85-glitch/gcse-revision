import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { loadCatalogue } from '../../src/component-catalogue/loadCatalogue.js'
import { catalogueEntries } from '../../scripts/generate-authoring-registry.mjs'
import { projectLabRegistry } from '../../scripts/generate-lab-registry.mjs'
import { validateChapterDefinition, formatChapterSchemaIssues } from '../../src/data/screenRegistry.js'
import {
  BLOCK_RENDERER_TYPES,
  FULL_SCREEN_RENDERER_TYPES,
} from '../../src/components/layout/ScreenRenderer.jsx'
import {
  COMPONENT_LAB_REGISTRY,
  ACTIVE_LAB_KEYS,
  DERIVED_LAB_ROUTES,
  LAB_REGISTRY_ROWS,
} from '../../src/data/generated/componentLabRegistry.js'
import { LAB_ADAPTERS } from '../../src/dev/componentReview/labAdapters.jsx'
import { SYSTEM_REFERENCE_ITEM_IDS } from '../../src/dev/systemReference/SystemReference.jsx'

// ─── The Component Lab coverage contract ────────────────────────────────────
//
// The Lab is the chapter-building component library, so its population is
// enforced in both directions:
//
//   1. every ACTIVE authoring entry is one selectable Lab choice;
//   2. every selectable Lab choice resolves to an ACTIVE authoring entry.
//
// Legacy entries are excluded. A DERIVED route — the runtime presenting an
// existing choice at another level — is accounted for as a presentation of the
// entry it derives from, and must never become an independently selectable
// option. That third rule is what stops the contract being satisfied by
// quietly publishing routes no author writes.
//
// There is no allowlist anywhere in this file. Every expectation is derived
// from the catalogue and the adapter map, so a type added next year is covered
// the day it is added.
//
// Each guard is paired with a mutation that must fail it. The mutations run
// against in-memory copies, so nothing on disk changes and nothing needs
// reverting.

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

let records = []
let loadError = null
try {
  records = await loadCatalogue()
} catch (error) {
  loadError = error
}

const entries = catalogueEntries(records)
const adapterKeys = Object.keys(LAB_ADAPTERS)
const activeKeys = new Set(ACTIVE_LAB_KEYS)

/** The projection, recomputed from a possibly-mutated catalogue. */
const recompute = (mutatedRecords = records, usage = {}) => projectLabRegistry(mutatedRecords, usage)

/**
 * The coverage check as a pure function of (projection, adapter keys), so a
 * mutation can be run against modified inputs without touching disk.
 */
export function coverageViolations(projection, keys) {
  const rows = Object.values(projection)
  const active = rows.filter(row => row.status === 'active').map(row => row.key)
  const bound = new Set(keys)

  return {
    activeWithNoAdapter: active.filter(key => !bound.has(key)),
    adapterWithNoActiveEntry: keys.filter(key => projection[key]?.status !== 'active'),
    adapterBoundToDerived: keys.filter(key => projection[key]?.status === 'derived'),
    adapterBoundToUnknownKey: keys.filter(key => !projection[key]),
  }
}

describe('the catalogue and the projection load cleanly', () => {
  it('loads with no structural error', () => {
    expect(loadError?.message ?? null).toBeNull()
  })

  it('projects one row per non-legacy authoring entry', () => {
    const nonLegacy = entries.filter(({ entry }) => entry.status !== 'legacy')
    expect(LAB_REGISTRY_ROWS.length).toBe(nonLegacy.length)
    expect(LAB_REGISTRY_ROWS.length).toBe(ACTIVE_LAB_KEYS.length + DERIVED_LAB_ROUTES.length)
  })

  it('emits no row for a legacy entry', () => {
    const legacy = entries.filter(({ entry }) => entry.status === 'legacy')
    for (const { entry } of legacy) {
      expect(COMPONENT_LAB_REGISTRY[`${entry.level}:${entry.type}`], entry.type).toBeUndefined()
    }
  })

  it('emits no row for a record with no authoring block', () => {
    // This is how infrastructure is excluded — structurally, not by a list.
    const owners = new Set(LAB_REGISTRY_ROWS.map(row => row.owningRecordId))
    const unauthorable = records.filter(record => record.authoring === null).map(record => record.id)
    expect(unauthorable.filter(id => owners.has(id))).toEqual([])
    expect(unauthorable.length).toBeGreaterThan(0)
  })
})

// ─── Direction 1 — every active entry is selectable ──────────────────────────

describe('every active authoring entry is one Lab selection', () => {
  it('leaves no active entry without an adapter', () => {
    const { activeWithNoAdapter } = coverageViolations(COMPONENT_LAB_REGISTRY, adapterKeys)
    expect(
      activeWithNoAdapter,
      'These authoring types can be written into a chapter but cannot be seen in the Lab. '
      + 'Add an adapter in src/dev/componentReview/labAdapters.jsx keyed by the authoring key.',
    ).toEqual([])
  })

  it('MUTATION — removing a Lab adapter fails this assertion', () => {
    const mutated = adapterKeys.filter(key => key !== 'block:read')
    expect(coverageViolations(COMPONENT_LAB_REGISTRY, mutated).activeWithNoAdapter).toEqual(['block:read'])
  })

  it('MUTATION — adding an active authoring entry with no adapter fails this assertion', () => {
    const donor = records.find(record => record.id === 'memory-hook')
    const invented = {
      ...donor,
      authoring: {
        entries: [
          ...donor.authoring.entries,
          { ...donor.authoring.entries[0], type: 'inventedType', authoringName: 'Invented type' },
        ],
      },
    }
    const projection = recompute(records.map(record => (record.id === donor.id ? invented : record)))
    expect(coverageViolations(projection, adapterKeys).activeWithNoAdapter).toEqual(['block:inventedType'])
  })
})

// ─── Direction 2 — every selection resolves to an active entry ───────────────

describe('every Lab selection resolves to an active authoring entry', () => {
  it('binds no adapter to a missing, legacy or derived entry', () => {
    const violations = coverageViolations(COMPONENT_LAB_REGISTRY, adapterKeys)
    expect(violations.adapterWithNoActiveEntry).toEqual([])
    expect(violations.adapterBoundToDerived).toEqual([])
    expect(violations.adapterBoundToUnknownKey).toEqual([])
  })

  it('MUTATION — binding an adapter to a legacy entry fails this assertion', () => {
    // `block:appliedscenario` is a real legacy compatibility type, so it has no
    // projection row at all: a legacy binding is caught as an unknown key.
    const mutated = [...adapterKeys, 'block:appliedscenario']
    const violations = coverageViolations(COMPONENT_LAB_REGISTRY, mutated)
    expect(violations.adapterWithNoActiveEntry).toEqual(['block:appliedscenario'])
    expect(violations.adapterBoundToUnknownKey).toEqual(['block:appliedscenario'])
  })

  it('MUTATION — binding an adapter to a derived-only entry fails this assertion', () => {
    const derived = DERIVED_LAB_ROUTES[0]
    expect(derived, 'the contract needs at least one derived route to be meaningful').toBeDefined()
    const mutated = [...adapterKeys, derived.key]
    const violations = coverageViolations(COMPONENT_LAB_REGISTRY, mutated)
    expect(violations.adapterBoundToDerived).toEqual([derived.key])
    expect(violations.adapterWithNoActiveEntry).toEqual([derived.key])
  })

  it('MUTATION — binding an adapter to an unknown key fails this assertion', () => {
    const mutated = [...adapterKeys, 'block:notARealType']
    expect(coverageViolations(COMPONENT_LAB_REGISTRY, mutated).adapterBoundToUnknownKey)
      .toEqual(['block:notARealType'])
  })

  it('MUTATION — adding a Lab selection with no authoring entry fails this assertion', () => {
    // The same shape as a real adapter, so this is exactly what a well-meant
    // "just show the component" addition would look like.
    const mutated = { ...LAB_ADAPTERS, 'screen:buttonsAndProgress': { renderMode: 'inline', render: () => null } }
    const violations = coverageViolations(COMPONENT_LAB_REGISTRY, Object.keys(mutated))
    expect(violations.adapterWithNoActiveEntry).toEqual(['screen:buttonsAndProgress'])
  })
})

// ─── Derived routes are accounted for, never selectable ──────────────────────

describe('derived routes are presentations, not choices', () => {
  it('names an active source that is itself a Lab selection', () => {
    for (const route of DERIVED_LAB_ROUTES) {
      expect(route.derivedFrom, `${route.key} must name the entry it derives from`).toBeTruthy()
      const source = COMPONENT_LAB_REGISTRY[route.derivedFrom]
      expect(source?.status, `${route.key} must derive from an active entry`).toBe('active')
      expect(activeKeys.has(route.derivedFrom)).toBe(true)
      expect(LAB_ADAPTERS[route.derivedFrom], `${route.derivedFrom} must be selectable`).toBeDefined()
    }
  })

  it('is shown by its source adapter as a presentation', () => {
    for (const route of DERIVED_LAB_ROUTES) {
      const presentations = LAB_ADAPTERS[route.derivedFrom].presentations ?? []
      expect(
        presentations.map(presentation => presentation.key),
        `${route.derivedFrom} must present its derived route ${route.key}`,
      ).toContain(route.key)
    }
  })

  it('rejects a derived entry that names no source', () => {
    const donor = records.find(record => record.id === 'misconception-check')
    const mutated = {
      ...donor,
      authoring: {
        entries: donor.authoring.entries.map(entry =>
          (entry.status === 'derived' ? { ...entry, derivedFrom: 'block:doesNotExist' } : entry)),
      },
    }
    expect(() => recompute(records.map(r => (r.id === donor.id ? mutated : r))))
      .toThrow(/names unknown source/)
  })
})

// ─── Authoring completeness, per selection ───────────────────────────────────

describe('every Lab selection is authoring-complete', () => {
  for (const key of ACTIVE_LAB_KEYS) {
    const row = COMPONENT_LAB_REGISTRY[key]
    const adapter = LAB_ADAPTERS[key]

    it(`${key} satisfies all ten requirements`, () => {
      // 1 registered type · 2 owning record · 4+5 authoring schema
      expect(row.level, key).toMatch(/^(screen|block)$/)
      expect(records.some(record => record.id === row.owningRecordId), 'owning record resolves').toBe(true)
      expect(Array.isArray(row.required) && Array.isArray(row.requiredAny)).toBe(true)

      // 3 valid renderer route
      const routed = row.level === 'block'
        ? BLOCK_RENDERER_TYPES.includes(row.type)
        : FULL_SCREEN_RENDERER_TYPES.includes(row.type) || row.layout === 'content'
      expect(routed, `${key} has no ScreenRenderer route`).toBe(true)

      // 6 pedagogy · 7 interaction class
      if (row.pedagogy) {
        expect(row.pedagogy.functions.length, `${key} pedagogy`).toBeGreaterThan(0)
        expect(['passive', 'reveal', 'assessed']).toContain(row.pedagogy.interaction)
      } else {
        expect(row.pedagogyExemption, `${key} needs pedagogy or an exemption`).toBe('container-derived')
      }

      // 8 continuation behaviour
      expect(['player', 'component']).toContain(row.continuation)

      // 9 realistic preview
      expect(typeof adapter.render, `${key} needs a render adapter`).toBe('function')
      expect(['inline', 'fullbleed']).toContain(adapter.renderMode)

      // 10 valid minimal chapter content shape — the strongest of the ten, and
      // the one that separates a component library from a gallery.
      const result = validateChapterDefinition({ id: 'lab', screens: [adapter.minimalScreen] })
      expect(result.valid, `${key} minimal shape: ${formatChapterSchemaIssues(result.errors)}`).toBe(true)
      expect(result.warnings, `${key} minimal shape raises a warning`).toEqual([])
    })
  }

  it('MUTATION — a minimal shape missing a required field fails validation', () => {
    const row = COMPONENT_LAB_REGISTRY['block:read']
    expect(row.required.map(requirement => requirement.path)).toContain('text')
    const stripped = { type: 'standard', blocks: [{ type: 'read' }] }
    expect(validateChapterDefinition({ id: 'lab', screens: [stripped] }).valid).toBe(false)
  })
})

// ─── The private handlers stay private ───────────────────────────────────────

describe('handler-backed types are previewed without exporting a handler', () => {
  const HANDLER_SOURCE = 'src/components/layout/ScreenRenderer.jsx'
  const handlerRows = LAB_REGISTRY_ROWS.filter(row => row.handler)

  it('covers every handler-backed authoring type', () => {
    expect(handlerRows.length).toBeGreaterThan(9)
    for (const row of handlerRows) {
      expect(LAB_ADAPTERS[row.key], `${row.key} must be selectable`).toBeDefined()
    }
  })

  it('keeps every named handler unexported', () => {
    const source = read(HANDLER_SOURCE)
    const exported = handlerRows
      .map(row => row.handler)
      .filter(handler => new RegExp(`export\\s+(?:default\\s+)?function\\s+${handler}\\b`).test(source)
        || new RegExp(`export\\s*\\{[^}]*\\b${handler}\\b`).test(source))
    // ScreenContentRenderer is a deliberate exception: it is the standard
    // screen's handler AND the named export ChapterPlayer composes, which the
    // catalogue already records in nonAuthorableHandlers.
    expect(exported).toEqual(['ScreenContentRenderer'])
  })

  it('MUTATION — importing a private handler into the Lab fails this assertion', () => {
    const LAB_SOURCES = [
      'src/dev/componentReview/labAdapters.jsx',
      'src/dev/componentReview/labScreenRendererAdapters.jsx',
      'src/dev/componentReview/ComponentReviewLab.jsx',
    ]
    const privateHandlers = handlerRows
      .map(row => row.handler)
      .filter(handler => handler !== 'ScreenContentRenderer')

    // Scoped to import specifiers on purpose. The adapters legitimately *name*
    // the handlers in prose — explaining which types are handler-backed is the
    // whole reason that file exists. Importing one is what would make a private
    // handler public, and that is the only thing being forbidden.
    //
    // The clause is extracted first and searched second, so every import form
    // is covered: bare named, default-plus-named, aliased and namespace.
    const importClauses = source =>
      [...source.matchAll(/^import\s+([^'"]+?)\s+from\s*['"]/gm)].map(match => match[1])

    const importsAHandler = source => {
      const clauses = importClauses(source)
      return privateHandlers.filter(handler =>
        clauses.some(clause => new RegExp(`\\b${handler}\\b`).test(clause)))
    }

    const offenders = LAB_SOURCES.flatMap(path =>
      importsAHandler(read(path)).map(handler => `${path}: ${handler}`))
    expect(offenders, 'the Lab must reach handler-backed types through ScreenRenderer, never by importing one').toEqual([])

    // The mutation, in each form it could plausibly be written.
    const base = read(LAB_SOURCES[1])
    for (const smuggled of [
      "import { ReadBlock } from '../../components/layout/ScreenRenderer.jsx'",
      "import ScreenRenderer, { ReadBlock } from '../../components/layout/ScreenRenderer.jsx'",
      "import { ReadBlock as Read } from '../../components/layout/ScreenRenderer.jsx'",
    ]) {
      expect(importsAHandler(`${base}\n${smuggled}`), smuggled).toEqual(['ReadBlock'])
    }
  })

  it('MUTATION — removing a ScreenRenderer fixture route fails this assertion', () => {
    // Every handler-backed adapter previews by mounting the real router on its
    // own minimal screen. An adapter that dropped that route would still render
    // something, so the guard is on the fixture being a routable screen.
    for (const row of handlerRows) {
      const { minimalScreen } = LAB_ADAPTERS[row.key]
      expect(minimalScreen?.type, `${row.key} fixture must be a routable screen`).toBeTruthy()
      expect(validateChapterDefinition({ id: 'lab', screens: [minimalScreen] }).valid).toBe(true)
    }
    const brokenFixture = { type: 'notARegisteredScreen', blocks: [] }
    expect(validateChapterDefinition({ id: 'lab', screens: [brokenFixture] }).valid).toBe(false)
  })
})

// ─── Generated usage is current ──────────────────────────────────────────────

describe('content usage is generated and drift-checked', () => {
  it('carries a measured usage figure on every row', () => {
    for (const row of LAB_REGISTRY_ROWS) {
      expect(typeof row.contentUsage.occurrences, row.key).toBe('number')
      expect(typeof row.contentUsage.files, row.key).toBe('number')
    }
    // Not all zero: the scan is really reading content.
    expect(LAB_REGISTRY_ROWS.some(row => row.contentUsage.occurrences > 100)).toBe(true)
  })

  it('MUTATION — diverging a generated usage count fails the drift check', () => {
    const usage = Object.fromEntries(
      LAB_REGISTRY_ROWS.map(row => [row.key, row.contentUsage]),
    )
    const honest = recompute(records, usage)
    expect(honest['block:read'].contentUsage).toEqual(COMPONENT_LAB_REGISTRY['block:read'].contentUsage)

    const diverged = recompute(records, { ...usage, 'block:read': { occurrences: 1, files: 1 } })
    expect(diverged['block:read'].contentUsage).not.toEqual(COMPONENT_LAB_REGISTRY['block:read'].contentUsage)
  })

  it('matches a recomputed projection, so drift fails here too', async () => {
    // `pnpm lab:check` is the primary drift gate and runs first in verify. This
    // repeats it inside the architecture suite so the guard is sufficient on
    // its own: adding an authoring entry without regenerating fails here, not
    // only in a script someone could reorder out of the way.
    const { scanContentTypeUsage, usageByAuthoringKey } = await import('../../scripts/scan-content-type-usage.mjs')
    const usage = usageByAuthoringKey(await scanContentTypeUsage())
    const recomputed = recompute(records, usage)
    expect(
      Object.keys(recomputed),
      'the committed Lab projection has drifted — run `pnpm lab:generate` and commit the result',
    ).toEqual(Object.keys(COMPONENT_LAB_REGISTRY))
    expect(JSON.parse(JSON.stringify(recomputed))).toEqual(JSON.parse(JSON.stringify(COMPONENT_LAB_REGISTRY)))
  })

  it('runs lab:check inside pnpm verify', () => {
    const verify = JSON.parse(read('package.json')).scripts.verify
    expect(verify).toContain('pnpm lab:check')
    expect(verify.indexOf('pnpm lab:check')).toBeLessThan(verify.indexOf('pnpm test:architecture'))
  })
})

// ─── Nothing non-authorable is selectable ────────────────────────────────────

describe('the Lab holds no runtime, infrastructure or design-system item', () => {
  const CATEGORY_C = [
    'buttons-and-progress',
    'chapter-hook-screen',
    'chapter-outcome-screen',
    'chapter-complete-screen',
    'weak-spot-recovery',
  ]

  it('keeps every category C item out of the Lab', () => {
    const owners = new Set(ACTIVE_LAB_KEYS.map(key => COMPONENT_LAB_REGISTRY[key].owningRecordId))
    expect(CATEGORY_C.filter(id => owners.has(id))).toEqual([])
  })

  it('keeps every category C item previewable on System reference', () => {
    // Removed from one surface means rehomed on the other, not deleted.
    expect([...SYSTEM_REFERENCE_ITEM_IDS].sort()).toEqual([...CATEGORY_C].sort())
  })

  it('keeps the four rehomed runtime components catalogued', () => {
    for (const id of CATEGORY_C.filter(candidate => candidate !== 'buttons-and-progress')) {
      expect(records.some(record => record.id === id), `${id} record`).toBe(true)
    }
  })

  it('never lists ScreenRenderer or ChapterPlayer as a selection', () => {
    // ScreenRenderer owns ten authoring types and is the preview mechanism for
    // them, but it is not itself a choice: no selection names it as a component.
    const componentNames = ACTIVE_LAB_KEYS.map(key => COMPONENT_LAB_REGISTRY[key].componentName)
    expect(componentNames.filter(name => name === 'ChapterPlayer')).toEqual([])
    expect(new Set(componentNames).has('ScreenRenderer')).toBe(true)
    // …and every one of those rows is a handler-backed type, not the router.
    for (const key of ACTIVE_LAB_KEYS) {
      const row = COMPONENT_LAB_REGISTRY[key]
      if (row.componentName === 'ScreenRenderer') expect(row.handler, key).toBeTruthy()
    }
  })
})

// ─── The adapter layer restates nothing the catalogue owns ───────────────────

describe('the three layers stay separated', () => {
  const ADAPTER_SOURCES = [
    'src/dev/componentReview/labAdapters.jsx',
    'src/dev/componentReview/labScreenRendererAdapters.jsx',
  ]

  it('hand-writes no catalogue-owned field', () => {
    // These are the field names the old manifest carried by hand, and the two
    // stale claims the census found were both in them.
    const offenders = []
    for (const path of ADAPTER_SOURCES) {
      const source = read(path)
      for (const field of ['authoringName:', 'usage:', 'alternative:', 'lifecycle:', 'pedagogy:', 'contentUsage:', 'status:']) {
        if (source.includes(field)) offenders.push(`${path}: ${field}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('keeps JSX, React and functions out of the generated projection', () => {
    const projection = read('src/data/generated/componentLabRegistry.js')
    expect(projection).toContain('GENERATED FILE — DO NOT EDIT')
    expect(projection).not.toMatch(/(?:from\s*|import\s*\(?\s*)['"]/)

    // Structural, not a regex over the text: Decision prose legitimately
    // contains arrows and angle brackets ("cause → mechanism", "y = mx + c"),
    // so the question is whether any *value* is unserialisable, not whether any
    // *character sequence* looks like code.
    const unserialisable = []
    const walk = (value, path) => {
      if (typeof value === 'function' || typeof value === 'symbol') { unserialisable.push(path); return }
      if (value === null || typeof value !== 'object') return
      for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`)
    }
    for (const row of LAB_REGISTRY_ROWS) walk(row, row.key)
    expect(unserialisable).toEqual([])
    expect(JSON.parse(JSON.stringify(LAB_REGISTRY_ROWS))).toEqual([...LAB_REGISTRY_ROWS])
  })

  it('carries no timestamp or environment-dependent content', () => {
    const generator = read('scripts/generate-lab-registry.mjs')
    for (const source of ['new Date', 'Date.now', 'toISOString', 'process.env', 'Math.random']) {
      expect(generator, source).not.toContain(source)
    }
    const scanner = read('scripts/scan-content-type-usage.mjs')
    for (const source of ['new Date', 'Date.now', 'toISOString', 'Math.random']) {
      expect(scanner, source).not.toContain(source)
    }
  })

  it('never imports the catalogue into the Lab or System reference', () => {
    for (const path of [
      ...ADAPTER_SOURCES,
      'src/dev/componentReview/ComponentReviewLab.jsx',
      'src/dev/labShell.jsx',
      'src/dev/labShellTokens.js',
      'src/dev/systemReference/SystemReference.jsx',
    ]) {
      expect(read(path), path).not.toMatch(/(?:from\s*|import\s*\(?\s*)['"][^'"]*component-catalogue\//)
    }
  })

  it('binds the Lab to public component identities only', () => {
    const source = read('src/dev/componentReview/labAdapters.jsx')
    // The Phase 4 census found the Lab importing the private family container
    // rather than the public export it exists to provide.
    expect(source).toContain("from '../../components/learning/FaceTheExaminer.jsx'")
    expect(source).not.toContain('faceTheExaminer/FaceTheExaminerContainer.jsx')
    // The parked alias no longer owns the examinerExplains entry, so the Lab
    // must name the canonical component the projection names.
    expect(COMPONENT_LAB_REGISTRY['screen:examinerExplains'].componentName).toBe('WhatExaminersLookFor')
    expect(source).toContain("from '../../components/learning/WhatExaminersLookFor.jsx'")
  })
})

// ─── The Lab's access model is unchanged ─────────────────────────────────────

describe('owner-surface access is unchanged, and the sibling is separate', () => {
  const app = () => read('src/App.jsx')

  it('keeps the Lab on its existing query flag and lazy import', () => {
    expect(app()).toContain("import('./dev/componentReview/ComponentReviewLab.jsx')")
    expect(app()).toContain("ownerFlag('componentReview')")
    expect(read('src/features/subjects/Subjects.jsx')).toContain("'?componentReview=true'")
  })

  it('keeps the Lab replacing the learner app rather than nesting inside it', () => {
    expect(app()).toContain('<ComponentReviewLab />')
    expect(app()).toContain('<LegacyApp />')
  })

  it('keeps the Lab exit dropping the flag', () => {
    expect(read('src/dev/labShellTokens.js')).toContain('window.location.assign(window.location.pathname)')
  })

  it('keeps both owner surfaces isolated to the throwaway storage scope', () => {
    for (const path of [
      'src/dev/componentReview/ComponentReviewLab.jsx',
      'src/dev/systemReference/SystemReference.jsx',
    ]) {
      expect(read(path), path).toContain("setActiveScope('devreview')".replace("'devreview'", 'DEV_REVIEW_SCOPE'))
      expect(read(path), path).toContain("const DEV_REVIEW_SCOPE = 'devreview'")
    }
  })

  it('gives System reference its own flag and its own lazy chunk', () => {
    expect(app()).toContain("import('./dev/systemReference/SystemReference.jsx')")
    expect(app()).toContain("ownerFlag('systemReference')")
    expect(existsSync(resolve(root, 'src/dev/systemReference/SystemReference.jsx'))).toBe(true)
  })

  it('leaves System reference out of learner navigation entirely', () => {
    expect(read('src/features/subjects/Subjects.jsx')).not.toContain('systemReference')
  })
})
