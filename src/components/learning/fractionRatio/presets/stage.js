// ─── Shared stage for the part-whole presets ─────────────────────────────────
//
// One canvas width and one default whole, so a bar drawn by any preset lands in
// exactly the same place on screen as a bar drawn by any other. That is what
// makes the engine's first rule — same whole — visible across a chapter rather
// than only within a single diagram.
//
// Presets build scene elements through these helpers instead of writing raw
// coordinates, so "the whole never changes size when the maths changes" is a
// property of the geometry rather than a convention each preset must remember.

export const WHOLE = Object.freeze({ x: 30, width: 300 })

export const BAR_HEIGHT = 48

/**
 * A whole divided into `parts` equal pieces, with coloured runs on top.
 *
 * `segments` are half-open part ranges — `{ from: 0, to: 3 }` colours the first
 * three parts. Ranges, not per-part flags, because a fraction is a continuous
 * run of the whole and a ratio is a sequence of adjacent runs; neither is a
 * scatter of individually shaded pieces.
 */
export function bar({
  id,
  y,
  parts,
  segments = [],
  x = WHOLE.x,
  width = WHOLE.width,
  height = BAR_HEIGHT,
}) {
  return { id, x, y, width, height, parts, segments }
}

export function segment(from, to, fillTone, edgeTone) {
  return { from, to, fillTone, edgeTone }
}

/**
 * A stacked fraction glyph with a real rule line — never "3/4" as flat text.
 * The numerator-over-denominator arrangement is how the notation is read and
 * how it appears in every exam paper, so the diagram uses it too.
 */
export function fractionGlyph({
  id,
  x,
  y,
  numerator,
  denominator,
  tone = 'textPrimary',
  size = 'medium',
}) {
  return { id, x, y, numerator, denominator, tone, size }
}

export function label({
  id,
  x,
  y,
  text,
  tone = 'textSecondary',
  size = 'label',
  anchor = 'middle',
}) {
  return { id, x, y, text, tone, size, anchor }
}

export function bracket({ id, x1, x2, y, text, tone = 'textMuted', below = false }) {
  return { id, x1, x2, y, text, tone, below }
}

export function line({ id, x1, y1, x2, y2, tone = 'whole', dashed = false, arrow = false }) {
  return { id, x1, y1, x2, y2, tone, dashed, arrow }
}

// Vertical centre of a bar — where a drag handle sits so it never covers the
// division lines the learner is counting.
export function barMidY(barElement) {
  return barElement.y + barElement.height / 2
}
