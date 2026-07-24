// ─── NumberLineExplore geometry ──────────────────────────────────────────────
//
// Pure model-space maths for the NumberLineExplore family. Everything here
// works in numbers the learner would recognise — the values on the line — and
// projects to pixels only through `axisX`. Nothing measures a rendered pixel
// back into a value except `axisValueFromX`, the single inverse projection each
// draggable control routes through.
//
// Neutral base helpers (clamp, roundTo) live in geometry/shapeGeometry.js,
// shared with the angle and areaPerimeter families; they are re-exported here
// so number-line callers keep a single import surface.

import { clamp, roundTo } from '../geometry/shapeGeometry.js'

export { clamp, roundTo }

// Typographic minus (U+2212), not a hyphen. GCSE papers set negatives with a
// full-width minus and it reads far more clearly at tick-label size.
export const MINUS = '−'

const EPSILON = 1e-6

// The fractions AQA Foundation actually asks learners to place on a line.
// Anything outside this set falls back to a/b, which stays readable inline.
const FRACTION_GLYPHS = new Map([
  ['1/2', '½'],
  ['1/3', '⅓'],
  ['2/3', '⅔'],
  ['1/4', '¼'],
  ['3/4', '¾'],
  ['1/5', '⅕'],
  ['2/5', '⅖'],
  ['3/5', '⅗'],
  ['4/5', '⅘'],
  ['1/8', '⅛'],
  ['3/8', '⅜'],
  ['5/8', '⅝'],
  ['7/8', '⅞'],
])

// ─── Number formatting ───────────────────────────────────────────────────────

// Display form of a value: binary noise absorbed, trailing zeros dropped, and
// negatives set with a typographic minus.
export function formatNumber(value, decimals = 3) {
  const rounded = roundTo(value, decimals)
  return rounded < 0 ? `${MINUS}${Math.abs(rounded)}` : String(rounded)
}

// Fixed decimal places — for bounds and rounding, where 2.30 must not collapse
// to 2.3 while the neighbouring value shows 2.35.
export function formatFixed(value, decimals) {
  const rounded = roundTo(value, decimals + 2)
  const text = Math.abs(rounded).toFixed(decimals)
  return rounded < 0 ? `${MINUS}${text}` : text
}

export function formatFraction(numerator, denominator) {
  const glyph = FRACTION_GLYPHS.get(`${Math.abs(numerator)}/${denominator}`)
  const body = glyph ?? `${Math.abs(numerator)}/${denominator}`
  return numerator < 0 ? `${MINUS}${body}` : body
}

// Signed term as it appears inside a calculation: 3 + (−5), 3 + 4.
export function signedTerm(value) {
  return value < 0 ? `(${MINUS}${formatNumber(Math.abs(value))})` : formatNumber(value)
}

// ─── Axis ────────────────────────────────────────────────────────────────────

// One number line: the range it covers and the horizontal band it occupies on
// the canvas. Presets describe the mathematics (min, max, steps); the layout
// defaults suit the 360-wide canvas the whole family uses.
export function createAxis({
  min,
  max,
  majorStep,
  minorStep = majorStep,
  y = 104,
  left = 36,
  right = 324,
}) {
  return Object.freeze({ min, max, majorStep, minorStep, y, left, right })
}

export function axisX(axis, value) {
  const ratio = (clamp(value, axis.min, axis.max) - axis.min) / (axis.max - axis.min)
  return axis.left + ratio * (axis.right - axis.left)
}

export function axisValueFromX(axis, x) {
  const ratio = clamp((x - axis.left) / (axis.right - axis.left), 0, 1)
  return axis.min + ratio * (axis.max - axis.min)
}

// Ticks anchored at zero rather than at `min`, so the major ticks always land
// on the round numbers a learner expects to read.
export function axisTicks(axis) {
  const count = Math.round((axis.max - axis.min) / axis.minorStep)
  return Array.from({ length: count + 1 }, (_, index) => {
    const value = roundTo(axis.min + index * axis.minorStep, 6)
    const majors = value / axis.majorStep
    const major = Math.abs(majors - Math.round(majors)) < EPSILON
    return {
      value,
      major,
      x: axisX(axis, value),
      label: major ? formatNumber(value) : null,
    }
  })
}

// ─── Snapping ────────────────────────────────────────────────────────────────

// Round a dragged value onto the preset's step, then magnetise to any named
// landmark (zero, an interval end, a midpoint) so learners can land exactly on
// the values that carry the teaching point.
export function snapValue(value, step, targets = [], tolerance = step / 2) {
  const stepped = roundTo(Math.round(value / step) * step, 6)
  for (const target of targets) {
    if (Math.abs(stepped - target) <= tolerance) return roundTo(target, 6)
  }
  return stepped
}

// ─── Paths ───────────────────────────────────────────────────────────────────

// Arrowhead pointing left or right along the line — used for both the axis
// ends and the "runs to infinity" end of an inequality band.
export function axisArrowPath(x, y, direction = 1, size = 9) {
  const tip = x + direction * size
  return `M ${tip} ${y} L ${x} ${y - size * 0.55} L ${x} ${y + size * 0.55} Z`
}

// Curved jump from one value to another, arcing above the line. The lift grows
// with distance but is capped, so a long jump stays inside the canvas and a
// short one still reads as a hop rather than a flat smear.
export function jumpPath(fromX, toX, y) {
  const span = Math.abs(toX - fromX)
  const height = clamp(span * 0.45, 20, 54)
  const midX = (fromX + toX) / 2
  return {
    d: `M ${fromX} ${y} Q ${midX} ${y - height * 2} ${toX} ${y}`,
    apex: { x: midX, y: y - height },
    height,
  }
}

// Arrowhead at the landing end of a jump, angled into the arc's final
// direction so it reads as movement rather than a stuck marker.
export function jumpArrowPath(fromX, toX, y, height, size = 8) {
  const direction = toX >= fromX ? 1 : -1
  // Tangent of the quadratic at t = 1 runs from the control point to the end.
  const dx = direction * Math.abs(toX - fromX) / 2
  const dy = height * 2
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const px = -uy
  const py = ux
  const baseX = toX - ux * size
  const baseY = y - uy * size
  return [
    `M ${toX} ${y}`,
    `L ${baseX + px * size * 0.5} ${baseY + py * size * 0.5}`,
    `L ${baseX - px * size * 0.5} ${baseY - py * size * 0.5}`,
    'Z',
  ].join(' ')
}

// ─── Rounding and bounds ─────────────────────────────────────────────────────

// A rounding precision expressed once, so the interval, the label and the
// bounds all agree. `size` is the gap between neighbouring multiples.
export const PRECISIONS = Object.freeze({
  ten: { size: 10, decimals: 0, short: 'Nearest 10', phrase: 'the nearest 10' },
  one: { size: 1, decimals: 0, short: 'Whole number', phrase: 'the nearest whole number' },
  tenth: { size: 0.1, decimals: 1, short: '1 d.p.', phrase: '1 decimal place' },
})

export function roundToPrecision(value, size) {
  return roundTo(Math.round(value / size) * size, 6)
}

// The two multiples the value sits between, and the midpoint that decides
// which way it rounds — the whole visual argument of the rounding preset.
export function roundingInterval(value, size) {
  const lower = roundTo(Math.floor(roundTo(value / size, 6)) * size, 6)
  const upper = roundTo(lower + size, 6)
  return { lower, upper, midpoint: roundTo(lower + size / 2, 6) }
}

// Error interval for a value already rounded to the given precision:
// everything that would round to it. Lower bound included, upper excluded.
export function boundsFor(value, size) {
  return {
    lower: roundTo(value - size / 2, 6),
    upper: roundTo(value + size / 2, 6),
  }
}

// ─── Ordering ────────────────────────────────────────────────────────────────

// The full ordering statement for a set of labelled values, smallest first.
// Equal values are joined with = so a fraction landing exactly on its decimal
// twin reads as the same point rather than an arbitrary order.
export function orderingStatement(entries) {
  const sorted = [...entries].sort((a, b) => a.value - b.value)
  return sorted.reduce((statement, entry, index) => {
    if (index === 0) return entry.text
    const previous = sorted[index - 1]
    const joiner = Math.abs(entry.value - previous.value) < EPSILON ? ' = ' : ' < '
    return `${statement}${joiner}${entry.text}`
  }, '')
}

// Where a value sits within a set, counting from smallest — used to describe
// the dragged value's place without restating the whole ordering.
export function rankWithin(value, others) {
  return others.filter(other => other < value - EPSILON).length + 1
}
