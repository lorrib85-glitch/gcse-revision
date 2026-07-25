// ─── CoordinatePlaneExplore geometry ─────────────────────────────────────────
//
// Model space is always in axis units. Pixels are derived from model values
// through the plane scale and never measured back the other way, so a figure
// means the same thing at 320px and at 420px.
//
// Axis placement is resolved PER AXIS. A single combined "origin placement"
// concept models the problem incorrectly: positive-only x values alongside
// signed y values is an ordinary graph, and there x = 0 sits at the left edge
// while y = 0 crosses through the plot.

import { roundTo } from '../geometry/shapeGeometry.js'

// Guards floating point drift when stepping a fractional axis.
const TICK_PRECISION = 6

/**
 * Where this axis sits relative to its own range.
 * - 'crossing': zero falls strictly inside the range
 * - 'edge': the range starts at zero, starts above it, or is entirely negative
 */
export function resolveAxisPlacement({ min, max }) {
  return min < 0 && max > 0 ? 'crossing' : 'edge'
}

/**
 * The model value on this axis at which the perpendicular axis is drawn.
 * Zero when the axis crosses; otherwise the end of the range nearest zero.
 */
export function axisAnchorValue({ min, max }) {
  if (min < 0 && max > 0) return 0
  if (min >= 0) return min
  return max
}

export function createPlaneScale({ xAxis, yAxis, canvas, padding }) {
  const plot = {
    x: padding.left,
    y: padding.top,
    width: canvas.width - padding.left - padding.right,
    height: canvas.height - padding.top - padding.bottom,
  }

  const xSpan = xAxis.max - xAxis.min
  const ySpan = yAxis.max - yAxis.min

  // Independent scales — a 20 s axis against a 100 m axis maps correctly.
  const toX = value => plot.x + ((value - xAxis.min) / xSpan) * plot.width
  const toY = value => plot.y + plot.height - ((value - yAxis.min) / ySpan) * plot.height

  const toModelX = px => xAxis.min + ((px - plot.x) / plot.width) * xSpan
  const toModelY = px => yAxis.min + ((plot.y + plot.height - px) / plot.height) * ySpan

  return { toX, toY, toModelX, toModelY, plot }
}

export function axisTickValues({ min, max, step }) {
  const values = []
  const count = Math.round((max - min) / step)

  for (let index = 0; index <= count; index += 1) {
    values.push(roundTo(min + index * step, TICK_PRECISION))
  }
  return values
}

/**
 * A path through an ordered list of already-projected points.
 *
 * Deliberately general rather than assuming two endpoints: a curve or an
 * additional series can reuse this without restructuring the renderer, which
 * is why the spec defers the `series` contract slot rather than inventing one.
 */
export function orderedPointsPath(points, toX, toY) {
  if (!points || points.length < 2) return ''

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.x)} ${toY(point.y)}`)
    .join(' ')
}

export function snapToStep(value, step) {
  if (!step) return value
  return roundTo(Math.round(value / step) * step, TICK_PRECISION)
}

/**
 * Gridlines, which may be finer than the labelled ticks. A transformation
 * preset wants unit gridlines so coordinates sit on intersections, but labels
 * only every 2 so a wide axis stays legible at 390px.
 */
export function gridLineValues(axis, subdivisions = 1) {
  const divisions = Math.max(1, subdivisions)
  return axisTickValues({ ...axis, step: axis.step / divisions })
}

/**
 * Liang–Barsky clip of a segment against the axis rectangle, in model space.
 *
 * A line built from the x-axis endpoints routinely leaves the y-range: y = 2x + 1
 * across x = −5…5 reaches y = ±11 against a y-axis of ±5. Clipping here — rather
 * than relying on the SVG clip path — keeps the model and the picture agreeing,
 * so anything measured from the scene is what the learner actually sees.
 *
 * Returns null when the segment misses the rectangle entirely.
 */
export function clipSegmentToBounds({ from, to }, xAxis, yAxis) {
  const dx = to.x - from.x
  const dy = to.y - from.y

  let tMin = 0
  let tMax = 1

  const edges = [
    { p: -dx, q: from.x - xAxis.min },
    { p: dx, q: xAxis.max - from.x },
    { p: -dy, q: from.y - yAxis.min },
    { p: dy, q: yAxis.max - from.y },
  ]

  for (const { p, q } of edges) {
    if (p === 0) {
      // Parallel to this edge — outside it means the whole segment is out.
      if (q < 0) return null
      continue
    }
    const t = q / p
    if (p < 0) {
      if (t > tMax) return null
      if (t > tMin) tMin = t
    } else {
      if (t < tMin) return null
      if (t < tMax) tMax = t
    }
  }

  const at = t => ({
    x: roundTo(from.x + t * dx, TICK_PRECISION),
    y: roundTo(from.y + t * dy, TICK_PRECISION),
  })

  return { from: at(tMin), to: at(tMax) }
}
