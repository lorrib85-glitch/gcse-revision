// ─── Deferred figure loaders ────────────────────────────────────────────────
//
// One stable loader per figure component. "Stable" is the load-bearing word:
// each thunk is defined once and reused, so the module registry treats a
// preload and a later `React.lazy()` render as the same import. The module is
// downloaded once and parsed once, however it is reached first.
//
// **No React and no JSX here**, so the app shell can trigger a preload the
// moment a chapter definition resolves without pulling the rendering layer in
// with it. The `lazy()` wrappers and the Suspense frame live next door in
// `deferredFigures.jsx`, and both halves read the same loader map.
//
// Six separate loaders, not one bundle. Deliberately: a chapter with one angle
// diagram should download an angle diagram, not four Maths engines and two
// circuit components. Do not "helpfully" merge these into a single figures
// chunk — that would restore the cost this file exists to remove.

import { DEFERRED_FIGURE_TYPES } from '../../data/deferredFigureTypes.js'

export const loadAngleExplore = () => import('../learning/AngleExplore.jsx')
export const loadAreaPerimeterExplore = () => import('../learning/AreaPerimeterExplore.jsx')
export const loadCoordinatePlaneExplore = () => import('../learning/CoordinatePlaneExplore.jsx')
export const loadNumberLineExplore = () => import('../learning/NumberLineExplore.jsx')
export const loadCircuitDiagram = () => import('../learning/CircuitDiagram.jsx')
export const loadCircuitSymbolReference = () => import('../learning/CircuitSymbolReference.jsx')

/** Authoring type → the loader for the component that renders it. */
export const DEFERRED_FIGURE_LOADERS = Object.freeze({
  angleFigure: loadAngleExplore,
  areaPerimeterFigure: loadAreaPerimeterExplore,
  coordinatePlaneFigure: loadCoordinatePlaneExplore,
  numberLineFigure: loadNumberLineExplore,
  circuitDiagram: loadCircuitDiagram,
  circuitSymbolReference: loadCircuitSymbolReference,
})

/**
 * Start downloading the renderers for the given types.
 *
 * Fire-and-forget by design. This is a background hint issued once a chapter's
 * content is known, not a second loading gate: nothing awaits it, nothing
 * blocks on it, and a rejection is swallowed here so a flaky network cannot
 * turn a preload into an unhandled rejection. If a module genuinely fails to
 * arrive, the render path shows its stable fallback — which is the right place
 * for that to surface, because that is where the learner is.
 *
 * `loaders` is injectable so the preload can be exercised without downloading
 * anything; production always uses the real map.
 */
export function preloadDeferredFigures(types, loaders = DEFERRED_FIGURE_LOADERS) {
  if (!Array.isArray(types)) return []
  const started = []
  for (const type of types) {
    const load = loaders[type]
    if (!load) continue
    started.push(type)
    try {
      Promise.resolve(load()).catch(() => {})
    } catch {
      // A loader that throws synchronously is still not the chapter's problem.
    }
  }
  return started
}

/**
 * The two halves of the pair have to agree, and disagreeing quietly is the one
 * failure mode that would be invisible: a type in the scanner with no loader
 * silently stops preloading, and a loader with no scanner entry silently never
 * fires. Asserted by tests/architecture/deferred-figure-loading.test.js.
 */
export const DEFERRED_FIGURE_LOADER_TYPES = Object.freeze(Object.keys(DEFERRED_FIGURE_LOADERS))

export const loadersCoverScannedTypes = () =>
  DEFERRED_FIGURE_TYPES.length === DEFERRED_FIGURE_LOADER_TYPES.length
  && DEFERRED_FIGURE_TYPES.every(type => type in DEFERRED_FIGURE_LOADERS)
