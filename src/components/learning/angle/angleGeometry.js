// ─── AngleExplore geometry ───────────────────────────────────────────────────
//
// Pure geometry for the AngleExplore family. Angles are measured in degrees,
// anticlockwise from the positive x-axis, in a y-down SVG coordinate space —
// so an increasing angle sweeps visually anticlockwise (east → north → west),
// matching how GCSE angle diagrams are read.

export function toRadians(deg) {
  return (deg * Math.PI) / 180
}

export function normaliseAngle(deg) {
  return ((deg % 360) + 360) % 360
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function polarPoint(cx, cy, angleDeg, radius) {
  const rad = toRadians(angleDeg)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad),
  }
}

// Angle of the pointer position around (cx, cy), anticlockwise from east.
export function pointerAngle(cx, cy, x, y) {
  return normaliseAngle((Math.atan2(cy - y, x - cx) * 180) / Math.PI)
}

// Round to whole degrees, magnetising to nearby key values (right angles,
// straight lines and full turns) so learners can land exactly on the values
// that matter.
export function snapAngle(deg, targets = [90, 180, 270], tolerance = 3) {
  const rounded = Math.round(deg)
  for (const target of targets) {
    if (Math.abs(rounded - target) <= tolerance) return target
  }
  return rounded
}

export function classifyAngle(deg) {
  const raw = Number(deg)
  const a = normaliseAngle(raw)
  const isFullTurn = raw !== 0 && Math.abs(raw % 360) < 0.0001

  if (isFullTurn) {
    return { id: 'full-turn', label: 'Full turn', summary: 'Exactly 360° — one complete turn.' }
  }
  if (a === 0) return { id: 'zero', label: 'Zero angle', summary: 'No turn at all.' }
  if (a < 90) return { id: 'acute', label: 'Acute angle', summary: 'Less than 90°.' }
  if (a === 90) return { id: 'right', label: 'Right angle', summary: 'Exactly 90°.' }
  if (a < 180) return { id: 'obtuse', label: 'Obtuse angle', summary: 'Between 90° and 180°.' }
  if (a === 180) return { id: 'straight', label: 'Straight line', summary: 'Exactly 180°.' }
  return { id: 'reflex', label: 'Reflex angle', summary: 'Between 180° and 360°.' }
}

function isFullTurn(startDeg, endDeg) {
  const rawSweep = endDeg - startDeg
  return rawSweep !== 0 && Math.abs(rawSweep % 360) < 0.0001
}

function fullCirclePath(cx, cy, startDeg, radius) {
  const start = polarPoint(cx, cy, startDeg, radius)
  const opposite = polarPoint(cx, cy, startDeg + 180, radius)
  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 1 0 ${opposite.x} ${opposite.y}`,
    `A ${radius} ${radius} 0 1 0 ${start.x} ${start.y}`,
  ].join(' ')
}

// Open arc from startDeg to endDeg, sweeping anticlockwise on screen.
// SVG's sweep-flag 0 is the anticlockwise direction in a y-down space.
export function arcPath(cx, cy, startDeg, endDeg, radius) {
  if (isFullTurn(startDeg, endDeg)) return fullCirclePath(cx, cy, startDeg, radius)

  const sweep = normaliseAngle(endDeg - startDeg)
  const start = polarPoint(cx, cy, startDeg, radius)
  const end = polarPoint(cx, cy, endDeg, radius)
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

// Closed wedge from the vertex, for the soft sector fill behind the arc.
export function sectorPath(cx, cy, startDeg, endDeg, radius) {
  if (isFullTurn(startDeg, endDeg)) return `${fullCirclePath(cx, cy, startDeg, radius)} Z`

  const sweep = normaliseAngle(endDeg - startDeg)
  const start = polarPoint(cx, cy, startDeg, radius)
  const end = polarPoint(cx, cy, endDeg, radius)
  const largeArc = sweep > 180 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

// GCSE convention: a 90° angle is marked with a small square, not an arc.
export function rightAngleMarkerPath(cx, cy, startDeg, size) {
  const a = polarPoint(cx, cy, startDeg, size)
  const b = polarPoint(cx, cy, startDeg + 45, size * Math.SQRT2)
  const c = polarPoint(cx, cy, startDeg + 90, size)
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`
}

export function sectorMidpoint(cx, cy, startDeg, endDeg, radius) {
  const sweep = normaliseAngle(endDeg - startDeg)
  return polarPoint(cx, cy, startDeg + sweep / 2, radius)
}

export function vectorAngle(from, to) {
  return normaliseAngle((Math.atan2(from.y - to.y, to.x - from.x) * 180) / Math.PI)
}

// Interior angle at vertex p between the rays p→q and p→r, in degrees.
export function interiorAngle(p, q, r) {
  const a1 = vectorAngle(p, q)
  const a2 = vectorAngle(p, r)
  let diff = Math.abs(a1 - a2)
  if (diff > 180) diff = 360 - diff
  return diff
}

// The three interior angles of triangle abc, rounded to whole degrees but
// guaranteed to total exactly 180 — rounding drift is absorbed by the largest
// angle, where one degree is least visible.
export function triangleAngles(a, b, c) {
  const rounded = [
    Math.round(interiorAngle(a, b, c)),
    Math.round(interiorAngle(b, a, c)),
    Math.round(interiorAngle(c, a, b)),
  ]
  const drift = 180 - (rounded[0] + rounded[1] + rounded[2])
  rounded[rounded.indexOf(Math.max(...rounded))] += drift
  return rounded
}
