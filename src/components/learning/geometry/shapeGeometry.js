// ─── Shared shape geometry ───────────────────────────────────────────────────
//
// Neutral, subject-agnostic geometry shared by SVG diagram families
// (angle/ and areaPerimeter/). Everything here is pure and model-space:
// values are mathematical dimensions, never rendered pixels. Angle-specific
// work (arcs, sectors, classification, snapping) stays in angle/; area and
// perimeter reasoning stays in areaPerimeter/.
//
// Coordinate conventions match the SVG canvas: y grows downwards, and
// polar angles are measured in degrees anticlockwise from the positive
// x-axis (so an increasing angle sweeps visually anticlockwise).

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function toRadians(deg) {
  return (deg * Math.PI) / 180
}

export function polarPoint(cx, cy, angleDeg, radius) {
  const rad = toRadians(angleDeg)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad),
  }
}

export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

// Round to a fixed number of decimal places, absorbing binary floating-point
// noise (0.30000000000000004 → 0.3) before a value reaches the learner.
export function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

// ─── Path builders ───────────────────────────────────────────────────────────

export function polygonPath(points) {
  return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} Z`
}

export function regularPolygonPoints(sides, cx, cy, radius) {
  return Array.from({ length: sides }, (_, index) => (
    polarPoint(cx, cy, 90 + (360 * index) / sides, radius)
  ))
}

// Short tick crossing a side at right angles — the GCSE equal-length marking.
export function sideTickPath(from, to, position = 0.52, halfLength = 7) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const cx = from.x + dx * position
  const cy = from.y + dy * position
  const px = (-dy / length) * halfLength
  const py = (dx / length) * halfLength
  return `M ${cx - px} ${cy - py} L ${cx + px} ${cy + py}`
}

// Chevron along a side pointing in the from→to direction — the GCSE
// parallel-side marking.
export function parallelMarkPath(from, to, position = 0.5, size = 6) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const px = -uy
  const py = ux
  const tipX = from.x + dx * position + ux * (size / 2)
  const tipY = from.y + dy * position + uy * (size / 2)
  const backX = tipX - ux * size
  const backY = tipY - uy * size
  return [
    `M ${backX + px * size} ${backY + py * size}`,
    `L ${tipX} ${tipY}`,
    `L ${backX - px * size} ${backY - py * size}`,
  ].join(' ')
}

// ─── Projections and marker positioning ──────────────────────────────────────

// Foot of the perpendicular dropped from `point` onto the infinite line
// through `lineStart` and `lineEnd`.
export function perpendicularFoot(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const lengthSq = dx * dx + dy * dy || 1
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSq
  return { x: lineStart.x + t * dx, y: lineStart.y + t * dy }
}

// A point at `position` (0–1) along the segment from→to, pushed `offset`
// pixels along the segment's left-hand normal. Positive offsets sit on the
// left of the direction of travel; negate to sit on the right. Used to place
// dimension labels and markers beside — never on top of — their side.
export function normalOffsetPoint(from, to, position = 0.5, offset = 14) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  return {
    x: from.x + dx * position + (-dy / length) * offset,
    y: from.y + dy * position + (dx / length) * offset,
  }
}

// ─── Mensuration (model space — mathematical units, not pixels) ──────────────

export function polygonPerimeter(points) {
  return roundTo(points.reduce((total, point, index) => (
    total + distance(point, points[(index + 1) % points.length])
  ), 0))
}

// Shoelace formula; absolute value so winding order never matters.
export function polygonArea(points) {
  const twice = points.reduce((total, point, index) => {
    const next = points[(index + 1) % points.length]
    return total + point.x * next.y - next.x * point.y
  }, 0)
  return roundTo(Math.abs(twice) / 2)
}

export function rectanglePerimeter(width, height) {
  return roundTo(2 * (width + height))
}

export function rectangleArea(width, height) {
  return roundTo(width * height)
}

export function triangleAreaFromBaseHeight(base, perpendicularHeight) {
  return roundTo((base * perpendicularHeight) / 2)
}

export function parallelogramArea(base, perpendicularHeight) {
  return roundTo(base * perpendicularHeight)
}

export function trapeziumArea(a, b, perpendicularHeight) {
  return roundTo(((a + b) / 2) * perpendicularHeight)
}

// A missing side of a rectilinear shape equals the opposite total minus the
// known parallel parts — e.g. deduceMissingLength(7, [4]) → 3.
export function deduceMissingLength(total, knownParts) {
  return roundTo(knownParts.reduce((rest, part) => rest - part, total))
}

// ─── Learner-facing formatting ───────────────────────────────────────────────

// Plain number with floating-point noise removed and no trailing zeros.
export function formatValue(value) {
  return String(roundTo(value))
}

export function formatLength(value, unit = 'cm') {
  return `${formatValue(value)} ${unit}`
}

export function formatArea(value, unit = 'cm') {
  return `${formatValue(value)} ${unit}²`
}
