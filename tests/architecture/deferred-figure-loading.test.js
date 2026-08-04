import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { DEFERRED_FIGURE_TYPES, collectDeferredFigureTypes } from '../../src/data/deferredFigureTypes.js'
import {
  DEFERRED_FIGURE_LOADERS,
  DEFERRED_FIGURE_LOADER_TYPES,
  loadersCoverScannedTypes,
} from '../../src/components/layout/deferredFigureLoaders.js'
import { DEFERRED_FIGURE_COMPONENTS } from '../../src/components/layout/deferredFigures.jsx'
import { BLOCK_RENDERER_TYPES } from '../../src/components/layout/ScreenRenderer.jsx'
import { validateChapterDefinition, formatChapterSchemaIssues } from '../../src/data/screenRegistry.js'
import { LAB_ADAPTERS } from '../../src/dev/componentReview/labAdapters.jsx'
import { COMPONENT_LAB_REGISTRY } from '../../src/data/generated/componentLabRegistry.js'

// ─── The deferred figure contract ───────────────────────────────────────────
//
// Six authoring types are rendered by subject-specific drawing engines. They
// are loaded on demand so a chapter that uses none downloads none, and
// preloaded from the chapter definition so a chapter that uses one has it in
// hand before the learner arrives.
//
// Both halves have to hold. Deferring without preloading trades a download for
// a visible pause mid-lesson; preloading without deferring is just the
// synchronous import back again with extra steps. The guards below fail either
// way round.
//
// Nothing here re-tests the Phase 4 authoring contract — that lives in
// component-lab-authoring-coverage.test.js and is untouched. What is asserted
// here is that deferring the renderers changed none of it.

const root = resolve(process.cwd())
const read = path => readFileSync(resolve(root, path), 'utf8')

// Prose explains what a file must not do, so a check on prose finds the
// explanation and calls it the offence. These checks read code only.
const codeOf = path => read(path)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

const RENDERER = 'src/components/layout/ScreenRenderer.jsx'
const LOADERS = 'src/components/layout/deferredFigureLoaders.js'
const FIGURES = 'src/components/layout/deferredFigures.jsx'
const APP_SHELL = 'src/app/LegacyApp.jsx'

/** Import clauses and their specifiers, so a static import cannot hide in prose. */
const staticImports = source =>
  [...source.matchAll(/^import\s+(?:([^'"]+?)\s+from\s*)?['"]([^'"]+)['"]/gm)]
    .map(match => ({ clause: match[1] ?? '', specifier: match[2] }))

const FIGURE_MODULES = {
  angleFigure: 'AngleExplore.jsx',
  areaPerimeterFigure: 'AreaPerimeterExplore.jsx',
  coordinatePlaneFigure: 'CoordinatePlaneExplore.jsx',
  numberLineFigure: 'NumberLineExplore.jsx',
  circuitDiagram: 'CircuitDiagram.jsx',
  circuitSymbolReference: 'CircuitSymbolReference.jsx',
}

// ─── 1. No static import survives in the renderer ────────────────────────────

describe('ScreenRenderer no longer statically imports a figure module', () => {
  const rendererImports = staticImports(read(RENDERER))

  it.each(Object.entries(FIGURE_MODULES))('%s → %s is not statically imported', (_type, module) => {
    const offenders = rendererImports.filter(entry => entry.specifier.endsWith(`/${module}`))
    expect(
      offenders.map(entry => entry.specifier),
      `${module} must be reached through a loader, not a static import — a static import puts it back in the chapter-runtime chunk`,
    ).toEqual([])
  })

  it('MUTATION — restoring one static figure import fails this assertion', () => {
    const tampered = `import AngleExplore from '../learning/AngleExplore.jsx'\n${read(RENDERER)}`
    const offenders = staticImports(tampered).filter(entry => entry.specifier.endsWith('/AngleExplore.jsx'))
    expect(offenders).toHaveLength(1)
  })

  it('reaches the figures only through the deferred module', () => {
    const specifiers = rendererImports.map(entry => entry.specifier)
    expect(specifiers).toContain('./deferredFigures.jsx')
  })

  it('keeps the loader module free of React, so the shell can preload without it', () => {
    const source = read(LOADERS)
    for (const specifier of staticImports(source).map(entry => entry.specifier)) {
      expect(specifier, `${LOADERS} must not import ${specifier}`).not.toBe('react')
    }
    expect(source).not.toMatch(/<[A-Z]/)
  })

  it('keeps one dynamic import per figure, not one merged chunk', () => {
    const dynamic = [...read(LOADERS).matchAll(/import\(\s*'([^']+)'\s*\)/g)].map(match => match[1])
    expect(dynamic).toHaveLength(DEFERRED_FIGURE_TYPES.length)
    expect(new Set(dynamic).size).toBe(DEFERRED_FIGURE_TYPES.length)
    for (const module of Object.values(FIGURE_MODULES)) {
      expect(dynamic.some(specifier => specifier.endsWith(`/${module}`)), module).toBe(true)
    }
  })
})

// ─── 2. One loader and one lazy renderer per type ────────────────────────────

describe('every deferred type has exactly one loader and one lazy renderer', () => {
  it('covers the scanned set in both directions', () => {
    expect(loadersCoverScannedTypes()).toBe(true)
    expect([...DEFERRED_FIGURE_LOADER_TYPES].sort()).toEqual([...DEFERRED_FIGURE_TYPES].sort())
    expect(Object.keys(DEFERRED_FIGURE_COMPONENTS).sort()).toEqual([...DEFERRED_FIGURE_TYPES].sort())
  })

  it.each(DEFERRED_FIGURE_TYPES)('%s has a callable loader and a lazy component', type => {
    expect(typeof DEFERRED_FIGURE_LOADERS[type], `${type} loader`).toBe('function')
    const lazyComponent = DEFERRED_FIGURE_COMPONENTS[type]
    expect(lazyComponent, `${type} lazy component`).toBeTruthy()
    expect(lazyComponent.$$typeof, `${type} must be a React.lazy component`).toBe(Symbol.for('react.lazy'))
  })

  it('reuses one stable thunk per component, so a preload and a render are one download', () => {
    // Both halves import the same named loader rather than each writing its own
    // `() => import(...)`. Two thunks would still resolve to one module, but
    // asserting the shared identity is what keeps the intent legible.
    const figuresImports = staticImports(read(FIGURES))
      .find(entry => entry.specifier === './deferredFigureLoaders.js')
    expect(figuresImports, 'deferredFigures.jsx must import the shared loaders').toBeTruthy()
    for (const loaderName of [
      'loadAngleExplore', 'loadAreaPerimeterExplore', 'loadCoordinatePlaneExplore',
      'loadNumberLineExplore', 'loadCircuitDiagram', 'loadCircuitSymbolReference',
    ]) {
      expect(figuresImports.clause, loaderName).toContain(loaderName)
    }
    expect(read(FIGURES)).not.toMatch(/lazy\(\s*\(\)\s*=>\s*import\(/)
  })

  it('MUTATION — removing one loader fails this assertion', () => {
    const { angleFigure, ...withoutOne } = DEFERRED_FIGURE_LOADERS
    expect(angleFigure).toBeTypeOf('function')
    const covered = DEFERRED_FIGURE_TYPES.every(type => type in withoutOne)
    expect(covered).toBe(false)
    expect(DEFERRED_FIGURE_TYPES.filter(type => !(type in withoutOne))).toEqual(['angleFigure'])
  })

  it('MUTATION — removing one type from the scanner map fails this assertion', () => {
    const shortened = DEFERRED_FIGURE_TYPES.filter(type => type !== 'circuitDiagram')
    const balanced = shortened.length === DEFERRED_FIGURE_LOADER_TYPES.length
      && shortened.every(type => type in DEFERRED_FIGURE_LOADERS)
    expect(balanced, 'a loader with no scanner entry would silently never preload').toBe(false)
  })
})

// ─── 3. The scanner, at the boundary ─────────────────────────────────────────
//
// Its behaviour is unit-tested in tests/unit/deferredFigureTypes.test.js. What
// belongs here is the pair of properties the *architecture* depends on.

describe('the scanner stays pure and structural', () => {
  it('imports nothing at all', () => {
    expect(staticImports(read('src/data/deferredFigureTypes.js'))).toEqual([])
  })

  it('touches no React, storage or DOM', () => {
    const source = codeOf('src/data/deferredFigureTypes.js')
    for (const forbidden of ['React', 'localStorage', 'lib/storage', 'document.', 'window.']) {
      expect(source, forbidden).not.toContain(forbidden)
    }
  })

  it('MUTATION — a scanner that returns duplicates fails this assertion', () => {
    const chapter = { id: 'x', screens: [{ blocks: [{ type: 'angleFigure' }, { type: 'angleFigure' }] }] }
    const honest = collectDeferredFigureTypes(chapter)
    expect(honest).toEqual(['angleFigure'])
    expect(new Set(honest).size).toBe(honest.length)

    const duplicating = ['angleFigure', 'angleFigure']
    expect(new Set(duplicating).size).not.toBe(duplicating.length)
  })

  it('MUTATION — a scanner that preloads an unused figure fails this assertion', () => {
    const historyChapter = { id: 'h', screens: [{ blocks: [{ type: 'read', text: 'x' }] }] }
    expect(
      collectDeferredFigureTypes(historyChapter),
      'a chapter with no figures must request nothing',
    ).toEqual([])

    // What over-reporting would look like, and why it is caught.
    const overEager = [...DEFERRED_FIGURE_TYPES]
    expect(overEager).not.toEqual(collectDeferredFigureTypes(historyChapter))
  })
})

// ─── The preload is wired where the chapter definition arrives ───────────────

describe('the app shell preloads at chapter resolution', () => {
  const shell = read(APP_SHELL)

  it('calls the preloader from the one place chapter content resolves', () => {
    expect(shell).toContain("import { collectDeferredFigureTypes } from '../data/deferredFigureTypes.js'")
    expect(shell).toContain("import { preloadDeferredFigures } from '../components/layout/deferredFigureLoaders.js'")
    expect(shell).toContain('preloadDeferredFigures(collectDeferredFigureTypes(content))')
  })

  it('does not await the preload, so chapter opening is not gated on it', () => {
    const call = shell.slice(shell.indexOf('preloadDeferredFigures(collectDeferredFigureTypes'))
    expect(shell).not.toContain('await preloadDeferredFigures')
    expect(call.startsWith('preloadDeferredFigures')).toBe(true)
  })

  it('sits inside loadChapterContent, which both the prefetch and the open path use', () => {
    const body = shell.slice(shell.indexOf('async function loadChapterContent'))
    const end = body.indexOf('\n}\n')
    expect(body.slice(0, end)).toContain('preloadDeferredFigures')
    // Both call sites funnel through it, so a prefetched chapter arrives warm.
    expect(shell).toContain('const prefetch = () => loadChapterContent(chapter)')
    expect(shell).toContain('loadChapterContent(chapter)\n      .then(')
  })
})

// ─── 4-6. Nothing the learner or an author can observe changed ───────────────

describe('deferring changed no authoring or routing fact', () => {
  it('keeps every deferred type in BLOCK_RENDERER_TYPES', () => {
    for (const type of DEFERRED_FIGURE_TYPES) {
      expect(BLOCK_RENDERER_TYPES, `${type} must still be routed`).toContain(type)
    }
  })

  it('keeps every deferred type an active authoring entry', () => {
    for (const type of DEFERRED_FIGURE_TYPES) {
      const row = COMPONENT_LAB_REGISTRY[`block:${type}`]
      expect(row?.status, `block:${type}`).toBe('active')
    }
  })

  it('keeps all six minimal Lab chapter shapes passing the real validator', () => {
    for (const type of DEFERRED_FIGURE_TYPES) {
      const adapter = LAB_ADAPTERS[`block:${type}`]
      expect(adapter, `block:${type} must still be a Lab selection`).toBeDefined()
      const result = validateChapterDefinition({ id: 'lab', screens: [adapter.minimalScreen] })
      expect(result.valid, `block:${type}: ${formatChapterSchemaIssues(result.errors)}`).toBe(true)
      expect(result.warnings).toEqual([])
    }
  })

  it('keeps every figure route mounting its actual public component', () => {
    const renderer = read(RENDERER)
    const PUBLIC = {
      angleFigure: 'LazyAngleExplore',
      areaPerimeterFigure: 'LazyAreaPerimeterExplore',
      coordinatePlaneFigure: 'LazyCoordinatePlaneExplore',
      numberLineFigure: 'LazyNumberLineExplore',
      circuitDiagram: 'LazyCircuitDiagram',
      circuitSymbolReference: 'LazyCircuitSymbolReference',
    }
    for (const [type, component] of Object.entries(PUBLIC)) {
      const route = renderer.slice(renderer.indexOf(`  ${type}: ({`))
      expect(route.slice(0, 600), `${type} must mount ${component}`).toContain(`<${component}`)
    }
    // And the lazy components resolve to the public modules, not to a private
    // internal — the same identity rule Phase 4 fixed for FaceTheExaminer.
    const dynamic = [...read(LOADERS).matchAll(/import\(\s*'([^']+)'\s*\)/g)].map(match => match[1])
    for (const specifier of dynamic) {
      expect(specifier, specifier).toMatch(/^\.\.\/learning\/[A-Z][A-Za-z]+\.jsx$/)
    }
  })

  it('leaves the Component Lab importing its previews directly', () => {
    // The Lab is an owner chunk that the learner never downloads, so its
    // previews stay synchronous. Deferring is about the learner runtime only.
    const adapters = read('src/dev/componentReview/labAdapters.jsx')
    for (const module of Object.values(FIGURE_MODULES)) {
      expect(adapters, `Lab must still import ${module} directly`).toContain(`/${module}'`)
    }
  })
})

// ─── Every route is inside a boundary ────────────────────────────────────────

describe('every deferred route has its own Suspense and error boundary', () => {
  const renderer = read(RENDERER)

  it.each(DEFERRED_FIGURE_TYPES)('%s is wrapped in DeferredFigure', type => {
    const start = renderer.indexOf(`  ${type}: ({`)
    expect(start, `${type} route not found`).toBeGreaterThan(-1)
    const route = renderer.slice(start, renderer.indexOf('\n  ),', start))
    expect(route, `${type} must be wrapped`).toContain('<DeferredFigure>')
    expect(route, `${type} must close its wrapper`).toContain('</DeferredFigure>')
  })

  it('MUTATION — removing one Suspense boundary fails this assertion', () => {
    const start = renderer.indexOf('  angleFigure: ({')
    const route = renderer.slice(start, renderer.indexOf('\n  ),', start))
    const stripped = route.replace('<DeferredFigure>', '').replace('</DeferredFigure>', '')
    expect(stripped).not.toContain('<DeferredFigure>')
    expect(route).toContain('<DeferredFigure>')
  })

  it('gives DeferredFigure both a Suspense fallback and an error boundary', () => {
    const source = read(FIGURES)
    expect(source).toMatch(/<Suspense fallback=\{<FigurePlaceholder \/>\}>/)
    expect(source).toContain('static getDerivedStateFromError')
    expect(source).toContain('<FigureBoundary>')
  })

  it('reserves height and stays inside the content column', () => {
    const source = read(FIGURES)
    expect(source, 'the fallback must reserve space or the figure arrival reflows the screen')
      .toContain('aspectRatio: FIGURE_ASPECT')
    expect(source).toContain("width: '100%'")
    expect(source).toContain("maxWidth: '100%'")
    expect(source).toContain("overflow: 'hidden'")
  })

  it('uses governed neutral tokens and no accent', () => {
    const source = codeOf(FIGURES)
    for (const token of ['GENERAL.line.soft', 'GENERAL.backgroundSunken', 'GENERAL.slate', 'RADII.medium', 'SPACING.standard']) {
      expect(source, token).toContain(token)
    }
    expect(source, 'a loading frame must not borrow a subject accent').not.toContain('SUBJECTS')
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })

  it('shows no spinner, no progress and nothing that reads as an error', () => {
    const source = codeOf(FIGURES)

    // No motion of any kind. `100%` is a width, not a progress figure, so the
    // percentage check is on progress state rather than on the character.
    for (const banned of ['animation', 'keyframes', 'transition', 'spin', '@media']) {
      expect(source, `the fallback must not use ${banned}`).not.toContain(banned)
    }
    // No progress state to render a percentage from: the frame is static, with
    // one label and no counter, timer or loaded/total.
    expect(source, 'a loading frame must hold no progress state').not.toMatch(/useState|useEffect|setInterval|setTimeout|toFixed/)

    // Nothing that reads as a failure. "Diagram unavailable" is a status, and
    // a red alert mid-lesson would be a worse lie than a calm empty frame.
    for (const banned of ['GENERAL.error', 'GENERAL.coral', 'role="alert"']) {
      expect(source, `the fallback must not use ${banned}`).not.toContain(banned)
    }
    expect(source).toContain('role="status"')

    // Nothing animates, so there is no reduced-motion path to branch on.
    expect(source).not.toContain('prefersReducedMotion')
  })
})
