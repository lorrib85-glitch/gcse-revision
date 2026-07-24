// ─── FractionRatioExplore geometry ───────────────────────────────────────────
//
// Pure layout for the part-whole family. Everything is model space: a "whole"
// is a rectangle of fixed x and width, and dividing it into parts never changes
// that rectangle. That invariant is the engine's first visual rule — same whole
// — so it lives here as a property of the geometry rather than as a convention
// each preset has to remember.
//
// Coordinates follow the SVG canvas: y grows downwards.

import { clamp, roundTo } from '../geometry/shapeGeometry.js'

export { clamp, roundTo }

// ─── Bars: a whole divided into equal parts ──────────────────────────────────

// The x positions of every division line inside a bar, excluding its two ends.
export function dividerPositions(x, width, parts) {
  const step = width / parts
  return Array.from({ length: Math.max(parts - 1, 0) }, (_, index) => (
    roundTo(x + step * (index + 1), 3)
  ))
}

// x of the boundary after `parts` parts — where a drag handle sits, and where
// a connector leaves the bar.
export function boundaryX(bar, parts) {
  return roundTo(bar.x + (bar.width / bar.parts) * clamp(parts, 0, bar.parts), 3)
}

// How many whole parts a pointer x corresponds to. Used by drag controls, so
// the learner is always dragging to a whole number of parts and can never land
// between two divisions.
export function partsFromX(bar, x) {
  const ratio = clamp((x - bar.x) / bar.width, 0, 1)
  return Math.round(ratio * bar.parts)
}

// ─── Grids: a whole divided in two directions ────────────────────────────────

// Row-major cells of a columns × rows grid filling the given rectangle.
// `index` is the reading-order position, so a preset can fill "the first n".
export function gridCells({ x, y, width, height, columns, rows }) {
  const cellWidth = width / columns
  const cellHeight = height / rows

  return Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    return {
      index,
      column,
      row,
      x: roundTo(x + column * cellWidth, 3),
      y: roundTo(y + row * cellHeight, 3),
      width: roundTo(cellWidth, 3),
      height: roundTo(cellHeight, 3),
    }
  })
}

// ─── Circles: a whole divided into sectors ───────────────────────────────────

// A pie slice measured in turns (0–1) clockwise from twelve o'clock, which is
// how a fraction of a circle is read, rather than the anticlockwise-from-east
// convention the angle family uses.
export function slicePath(cx, cy, radius, startTurn, endTurn) {
  const sweep = endTurn - startTurn
  if (sweep <= 0) return ''
  if (sweep >= 1) {
    return [
      `M ${cx} ${roundTo(cy - radius, 3)}`,
      `A ${radius} ${radius} 0 1 1 ${cx} ${roundTo(cy + radius, 3)}`,
      `A ${radius} ${radius} 0 1 1 ${cx} ${roundTo(cy - radius, 3)}`,
      'Z',
    ].join(' ')
  }

  const start = turnPoint(cx, cy, radius, startTurn)
  const end = turnPoint(cx, cy, radius, endTurn)
  const largeArc = sweep > 0.5 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

export function turnPoint(cx, cy, radius, turn) {
  const radians = turn * 2 * Math.PI - Math.PI / 2
  return {
    x: roundTo(cx + radius * Math.cos(radians), 3),
    y: roundTo(cy + radius * Math.sin(radians), 3),
  }
}

// ─── Number lines ────────────────────────────────────────────────────────────

// Evenly spaced tick x positions across a line, inclusive of both ends.
export function tickPositions(x, width, steps) {
  return Array.from({ length: steps + 1 }, (_, index) => (
    roundTo(x + (width / steps) * index, 3)
  ))
}

export function positionFromX(x, width, value, max) {
  return roundTo(x + width * clamp(value / max, 0, 1), 3)
}

export function valueFromPosition(x, width, pointerX, max, step = 1) {
  const ratio = clamp((pointerX - x) / width, 0, 1)
  return Math.round((ratio * max) / step) * step
}

// ─── Connectors: linking two representations ─────────────────────────────────

// A vertical S-curve from one representation to another, used to say "this is
// the same quantity, shown differently". Deliberately a curve, not a straight
// line, so it reads as a relationship rather than another edge of a shape.
export function linkPath(fromX, fromY, toX, toY) {
  const midY = (fromY + toY) / 2
  return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
}

// A square bracket spanning x1→x2, tails pointing towards the thing it labels.
export function bracketPath(x1, x2, y, depth = 6, below = false) {
  const direction = below ? 1 : -1
  const tail = y + depth * direction
  return `M ${x1} ${tail} L ${x1} ${y} L ${x2} ${y} L ${x2} ${tail}`
}

// ─── Diagonal hatch, for the overlap in an area model ────────────────────────

// Parallel 45° strokes clipped to a rectangle. The multiply area model needs
// the overlap to read as "in both sets" rather than merely "a third colour",
// and hatching survives being printed, screenshotted or seen by someone who
// cannot separate the two fills by hue alone.
export function hatchLines({ x, y, width, height }, spacing = 9) {
  const lines = []
  for (let offset = 0; offset <= width + height; offset += spacing) {
    const x1 = x + offset
    const y1 = y
    const x2 = x + offset - height
    const y2 = y + height

    const clipped = clipDiagonal({ x1, y1, x2, y2 }, { x, y, width, height })
    if (clipped) lines.push(clipped)
  }
  return lines
}

// Clip a 45° segment (slope -1) to a rectangle by trimming its parameter range.
function clipDiagonal({ x1, y1, x2, y2 }, rect) {
  const left = rect.x
  const right = rect.x + rect.width
  const dx = x2 - x1

  let tMin = 0
  let tMax = 1

  if (dx !== 0) {
    const tA = (left - x1) / dx
    const tB = (right - x1) / dx
    tMin = Math.max(tMin, Math.min(tA, tB))
    tMax = Math.min(tMax, Math.max(tA, tB))
  } else if (x1 < left || x1 > right) {
    return null
  }

  if (tMin >= tMax) return null

  return {
    x1: roundTo(x1 + dx * tMin, 3),
    y1: roundTo(y1 + (y2 - y1) * tMin, 3),
    x2: roundTo(x1 + dx * tMax, 3),
    y2: roundTo(y1 + (y2 - y1) * tMax, 3),
  }
}

// ─── Discrete sets ───────────────────────────────────────────────────────────

// Counter positions wrapped into rows — the "20 apples" model for a fraction
// of an amount, where the quantity must stay countable rather than becoming a
// length.
export function counterPositions({ x, y, count, perRow, spacing, radius }) {
  return Array.from({ length: count }, (_, index) => {
    const column = index % perRow
    const row = Math.floor(index / perRow)
    return {
      index,
      cx: roundTo(x + radius + column * spacing, 3),
      cy: roundTo(y + radius + row * spacing, 3),
      r: radius,
    }
  })
}
