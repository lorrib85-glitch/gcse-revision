// ─── Deferred figure rendering ──────────────────────────────────────────────
//
// The rendering half of the deferred-figure pair. It wraps each loader from
// `deferredFigureLoaders.js` in `React.lazy()` and gives each figure route its
// own local Suspense boundary, so one figure still downloading never suspends
// the screen around it.
//
// **The fallback should almost never be seen.** The runtime preloads the types
// a chapter contains as soon as its definition resolves, which is many screens
// and usually many seconds before the learner reaches one. The fallback is for
// the exceptional case — a very slow connection, or a chunk that fails outright
// — and it is designed for that case rather than for a demo: a calm reserved
// frame that holds the figure's place, with no spinner, no percentage and
// nothing that reads as an error.
//
// It reserves height on purpose. A zero-height fallback would let the screen
// reflow when the figure arrives, which is the layout jump that makes deferred
// content feel unreliable. The frame occupies the block's slot from first paint,
// so the arriving figure replaces a space rather than creating one.
//
// The block is never omitted and never collapses: a screen whose figure has not
// arrived reads as incomplete, which is honest, rather than as finished-without-
// the-diagram, which is not. The screen's continuation behaviour is untouched —
// these blocks declare `continuation: 'player'` and that is still true.
//
// Nothing here animates, so there is no reduced-motion path to respect: the
// calm state is the only state.
//
// This file is a private internal of ScreenRenderer — it is routing machinery,
// not a component an author selects. `src/component-catalogue/records/screen-renderer.js`
// owns it as such, which is why it has no record of its own.

import { Component, Suspense, lazy } from 'react'

import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import {
  loadAngleExplore,
  loadAreaPerimeterExplore,
  loadCircuitDiagram,
  loadCircuitSymbolReference,
  loadCoordinatePlaneExplore,
  loadNumberLineExplore,
} from './deferredFigureLoaders.js'

// Same thunks the preloader calls, so a preloaded module is already resolved by
// the time lazy() asks for it — one download, not two.
export const LazyAngleExplore = lazy(loadAngleExplore)
export const LazyAreaPerimeterExplore = lazy(loadAreaPerimeterExplore)
export const LazyCoordinatePlaneExplore = lazy(loadCoordinatePlaneExplore)
export const LazyNumberLineExplore = lazy(loadNumberLineExplore)
export const LazyCircuitDiagram = lazy(loadCircuitDiagram)
export const LazyCircuitSymbolReference = lazy(loadCircuitSymbolReference)

/** Authoring type → the lazy component that renders it. */
export const DEFERRED_FIGURE_COMPONENTS = Object.freeze({
  angleFigure: LazyAngleExplore,
  areaPerimeterFigure: LazyAreaPerimeterExplore,
  coordinatePlaneFigure: LazyCoordinatePlaneExplore,
  numberLineFigure: LazyNumberLineExplore,
  circuitDiagram: LazyCircuitDiagram,
  circuitSymbolReference: LazyCircuitSymbolReference,
})

// 4:3 matches the working area the figure engines draw into closely enough that
// the arriving diagram settles into roughly the space already held. Expressed
// as an aspect ratio rather than a pixel height so it reserves proportionally
// at every width, exactly as MediaPlaceholder reserves a media slot.
const FIGURE_ASPECT = '4 / 3'

/**
 * The reserved slot. Neutral tokens only — no subject accent, because this is
 * a system state rather than teaching content, and no accent means nothing to
 * mismatch when the real figure paints over it.
 */
export function FigurePlaceholder({ label = 'Diagram loading' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: FIGURE_ASPECT,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.standard,
        margin: '14px 0',
        borderRadius: RADII.medium,
        border: `1px solid ${GENERAL.line.soft}`,
        background: GENERAL.backgroundSunken,
        overflow: 'hidden',
      }}
    >
      <span style={{ ...TYPE.caption, color: GENERAL.slate, textAlign: 'center' }}>{label}</span>
    </div>
  )
}

/**
 * A figure that fails to arrive must not take the chapter down with it.
 *
 * `React.lazy` rejects into the nearest error boundary, and without one that is
 * the whole chapter tree. This boundary is deliberately the smallest possible
 * scope — one block — so a missing diagram costs the learner that diagram and
 * nothing else. It keeps the same reserved frame rather than swapping in an
 * error treatment: from the learner's side "not here yet" is the true and
 * useful reading, and a red panel mid-lesson is neither.
 */
class FigureBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('Deferred figure failed to load', error)
  }

  render() {
    if (this.state.failed) return <FigurePlaceholder label="Diagram unavailable" />
    return this.props.children
  }
}

/**
 * Wrap one deferred figure route. Every figure block in `ScreenRenderer` goes
 * through this, so the boundary and the reserved frame can never be forgotten
 * on a per-route basis.
 */
export function DeferredFigure({ children }) {
  return (
    <FigureBoundary>
      <Suspense fallback={<FigurePlaceholder />}>{children}</Suspense>
    </FigureBoundary>
  )
}
