// ─── Deferred figure component map ──────────────────────────────────────────
//
// Authoring type → the lazy component that renders it.
//
// It lives in its own module for one reason: `deferredFigures.jsx` exports
// React components, and a file that exports a component *and* a constant loses
// fast refresh for everything in it. Splitting the constant out keeps the
// rendering module refreshable during development without an eslint-disable.
//
// The map is the source-side statement that these six authoring types have
// these six renderers, which is what
// `tests/architecture/deferred-figure-loading.test.js` checks in both
// directions against the scanner's type list and the loader map. Nothing in the
// runtime reads it: `ScreenRenderer` imports each lazy component by name, one
// per route, because their props differ.
//
// This module is a private internal of ScreenRenderer, like the two files it
// sits beside — routing machinery, not a component an author selects.

import {
  LazyAngleExplore,
  LazyAreaPerimeterExplore,
  LazyCircuitDiagram,
  LazyCircuitSymbolReference,
  LazyCoordinatePlaneExplore,
  LazyNumberLineExplore,
} from './deferredFigures.jsx'

export const DEFERRED_FIGURE_COMPONENTS = Object.freeze({
  angleFigure: LazyAngleExplore,
  areaPerimeterFigure: LazyAreaPerimeterExplore,
  coordinatePlaneFigure: LazyCoordinatePlaneExplore,
  numberLineFigure: LazyNumberLineExplore,
  circuitDiagram: LazyCircuitDiagram,
  circuitSymbolReference: LazyCircuitSymbolReference,
})
