// ─── CoordinatePlaneExplore mathematics ──────────────────────────────────────
//
// Pure functions only. Every transformation returns a new point; nothing here
// knows about SVG, roles or React.

import { roundTo } from '../geometry/shapeGeometry.js'

// Rotations of 90/180/270 produce exact integers from integer inputs, but the
// trigonometric route introduces tiny drift. Round to kill it.
const PRECISION = 6

const MINUS = '−'

function tidy(value) {
  const rounded = roundTo(value, PRECISION)
  // Avoid returning -0, which formats as "−0".
  return rounded === 0 ? 0 : rounded
}

function tidyPoint({ x, y }) {
  return { x: tidy(x), y: tidy(y) }
}

export function quadrantOf(x, y) {
  if (x === 0 || y === 0) return null
  if (x > 0 && y > 0) return 1
  if (x < 0 && y > 0) return 2
  if (x < 0 && y < 0) return 3
  return 4
}

const QUADRANT_ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
const QUADRANT_SIGNS = {
  1: `(+, +)`,
  2: `(${MINUS}, +)`,
  3: `(${MINUS}, ${MINUS})`,
  4: `(+, ${MINUS})`,
}

export function quadrantRoman(quadrant) {
  return QUADRANT_ROMAN[quadrant] ?? null
}

export function quadrantSigns(quadrant) {
  return QUADRANT_SIGNS[quadrant] ?? null
}

export function midpointOf(a, b) {
  return tidyPoint({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
}

export function lineY({ m, c }, x) {
  return tidy(m * x + c)
}

export function xInterceptOf({ m, c }) {
  if (m === 0) return null
  return tidy(-c / m)
}

/**
 * Three outcomes, not two. Equal gradients alone do not mean "no solution":
 * two lines with the same gradient AND the same intercept are the same line,
 * and every point on it satisfies both equations.
 */
export function intersectionOf(lineA, lineB) {
  if (lineA.m === lineB.m) {
    return lineA.c === lineB.c ? { kind: 'infinite' } : { kind: 'none' }
  }

  const x = (lineB.c - lineA.c) / (lineA.m - lineB.m)
  return { kind: 'one', point: tidyPoint({ x, y: lineA.m * x + lineA.c }) }
}

/**
 * The negative reciprocal, or null when there isn't one.
 *
 * A line perpendicular to a horizontal line is vertical. Vertical lines have no
 * gradient and cannot be expressed as y = mx + c, so callers must handle null
 * rather than being handed a fabricated value — returning 0 here would draw a
 * second horizontal line and teach the opposite of the intended fact.
 */
export function perpendicularGradientOf(m) {
  if (m === 0) return null
  return tidy(-1 / m)
}

export function translatePoint(point, { dx, dy }) {
  return tidyPoint({ x: point.x + dx, y: point.y + dy })
}

export function reflectPoint(point, mirror) {
  switch (mirror.type) {
    case 'vertical':
      return tidyPoint({ x: 2 * mirror.value - point.x, y: point.y })
    case 'horizontal':
      return tidyPoint({ x: point.x, y: 2 * mirror.value - point.y })
    case 'yEqualsX':
      return tidyPoint({ x: point.y, y: point.x })
    case 'yEqualsNegativeX':
      return tidyPoint({ x: -point.y, y: -point.x })
    default:
      return tidyPoint(point)
  }
}

export function rotatePoint(point, centre, degrees, direction = 'clockwise') {
  // Screen convention: an anticlockwise rotation is positive in model space.
  const signed = direction === 'clockwise' ? -degrees : degrees
  const radians = (signed * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const dx = point.x - centre.x
  const dy = point.y - centre.y

  return tidyPoint({
    x: centre.x + dx * cos - dy * sin,
    y: centre.y + dx * sin + dy * cos,
  })
}

export function enlargePoint(point, centre, scaleFactor) {
  return tidyPoint({
    x: centre.x + (point.x - centre.x) * scaleFactor,
    y: centre.y + (point.y - centre.y) * scaleFactor,
  })
}

function formatNumber(value) {
  return String(tidy(value)).replace('-', MINUS)
}

export function formatCoordinate({ x, y }) {
  return `(${formatNumber(x)}, ${formatNumber(y)})`
}

/**
 * A straight-line equation written the way GCSE writes it.
 *
 * The single source of truth for this string. Every place that names a line —
 * status headings, accessible descriptions, comparison text — must use it, so
 * a learner never meets two different spellings of the same equation, and so a
 * fix lands everywhere at once. Local copies previously drifted into
 * "y = 0x + 2" and "y = −3x + −4".
 *
 *   m = 0            → y = 2          (a horizontal line has no x term)
 *   m = 1  / m = −1  → y = x − 4      (the coefficient 1 is never written)
 *   c = 0            → y = 2x         (no trailing zero term)
 *   c < 0            → y = 2x − 3     (subtraction, never "+ −3")
 */
export function formatLinearEquation({ m, c }) {
  if (m === 0) return `y = ${formatNumber(c)}`

  const gradient = m === 1 ? 'x' : m === -1 ? `${MINUS}x` : `${formatNumber(m)}x`
  if (c === 0) return `y = ${gradient}`
  return c > 0
    ? `y = ${gradient} + ${c}`
    : `y = ${gradient} ${MINUS} ${Math.abs(c)}`
}
