// ─── Deferred figure types ──────────────────────────────────────────────────
//
// Six authoring types whose renderers are subject-specific drawing engines —
// four Maths, two Physics. They are genuine chapter authoring choices, but a
// History chapter should not download a coordinate-plane engine to render a
// paragraph, so `ScreenRenderer` loads them on demand instead of importing
// them synchronously.
//
// On-demand loading alone would be a worse experience, not a better one: a
// spinner appearing when the learner reaches a diagram interrupts the teaching
// rhythm. So the runtime preloads the types a chapter actually contains as soon
// as its definition resolves, well before the learner reaches them. That is
// what this file exists for — it answers "which of the six does this chapter
// need?" from the chapter data itself.
//
// **This module is pure.** No React, no storage, no imports at all. It is the
// scanner half of the pair; the loader half lives in
// `src/components/layout/deferredFigureLoaders.js`, and a guard asserts the two
// cover exactly the same set of types.

/**
 * The block types whose renderers are loaded on demand.
 *
 * Deliberately a literal list rather than something derived from the authoring
 * registry: which types are *expensive enough to defer* is an implementation
 * judgement about their renderers, not a fact about their authoring contracts.
 * Deriving it would silently start deferring the next big component the moment
 * someone registered it.
 */
export const DEFERRED_FIGURE_TYPES = Object.freeze([
  'angleFigure',
  'areaPerimeterFigure',
  'coordinatePlaneFigure',
  'numberLineFigure',
  'circuitDiagram',
  'circuitSymbolReference',
])

const DEFERRED = new Set(DEFERRED_FIGURE_TYPES)

export const isDeferredFigureType = type => DEFERRED.has(type)

/**
 * The distinct deferred types a resolved chapter definition actually contains,
 * in the order they are first authored.
 *
 * Structural, like the content-usage scan: it walks `screens[].blocks[]` and
 * reads `block.type`. It therefore cannot be fooled by a matching string
 * anywhere else — a question option, a caption, a screen-level type of the same
 * name — because it only ever looks where an authored block can be.
 *
 * Never mutates the chapter, and never throws on malformed data: a chapter that
 * fails validation is the validator's problem, and a preload hint is the wrong
 * place to discover it.
 */
export function collectDeferredFigureTypes(chapter) {
  const found = new Set()
  const screens = chapter?.screens
  if (!Array.isArray(screens)) return []

  for (const screen of screens) {
    const blocks = screen?.blocks
    if (!Array.isArray(blocks)) continue
    for (const block of blocks) {
      const type = block?.type
      if (typeof type === 'string' && DEFERRED.has(type)) found.add(type)
    }
  }

  // A Set preserves insertion order, so this is first-authored order — which is
  // also the order the learner meets them, so the most imminent module is
  // requested first.
  return [...found]
}
