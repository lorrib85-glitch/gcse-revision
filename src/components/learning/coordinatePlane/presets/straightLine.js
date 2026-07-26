// ─── Preset: straightLine ────────────────────────────────────────────────────
//
// Core teaching is gradient and y-intercept. The x-intercept is available but
// never a required stage — it is a consequence of the equation, not one of its
// two defining numbers.
//
// Parallel and perpendicular are separate learning tasks, so comparisonRule
// splits them rather than a single overloaded "compare" mode. Under 'parallel'
// the second gradient is forced equal and both lines get a rise/run triangle;
// under 'perpendicular' it is forced to the negative reciprocal. Intercepts
// stay independent in both, so nobody infers that parallel lines must have
// mirrored intercepts.

import {
  formatCoordinate,
  lineY,
  perpendicularGradientOf,
  xInterceptOf,
} from '../coordinatePlaneMath.js'
import { clipSegmentToBounds } from '../coordinatePlaneGeometry.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

function equationText({ m, c }) {
  // A horizontal line is written y = 2, never y = 0x + 2. This is the exact
  // case the perpendicular refusal teaches, so the heading a learner reads
  // while being told "a line perpendicular to a horizontal line is vertical"
  // must itself be written the way GCSE writes it.
  if (m === 0) return `y = ${signed(c)}`

  const gradient = m === 1 ? 'x' : m === -1 ? `${MINUS}x` : `${signed(m)}x`
  if (c === 0) return `y = ${gradient}`
  return c > 0 ? `y = ${gradient} + ${c}` : `y = ${gradient} ${MINUS} ${Math.abs(c)}`
}

/**
 * Where a whole unit-interval rise/run triangle fits inside the plot.
 *
 * The triangle is never clipped. A partial triangle misrepresents the ratio it
 * exists to demonstrate — a learner reading a rise cut off by the plot edge
 * reads the wrong gradient. So instead of drawing it at a fixed x and letting
 * the clip path eat it, the triangle moves to a unit interval where BOTH ends
 * sit inside both axis ranges.
 *
 * The valid position closest to the y-axis wins, so the triangle stays near
 * the intercept where the reasoning starts. Ties go rightwards, which reads
 * more naturally as "along one, up m".
 *
 * Returns null when no whole unit interval fits, in which case no triangle is
 * drawn at all rather than a misleading fragment.
 */
function riseRunAnchorX(line, axes) {
  const inRange = y => y >= axes.y.min && y <= axes.y.max
  let best = null

  for (let x = Math.ceil(axes.x.min); x + 1 <= axes.x.max; x += 1) {
    if (!inRange(lineY(line, x)) || !inRange(lineY(line, x + 1))) continue
    if (best === null
      || Math.abs(x) < Math.abs(best)
      || (Math.abs(x) === Math.abs(best) && x > best)) {
      best = x
    }
  }
  return best
}

function riseRunShape(id, line, axes) {
  const atX = riseRunAnchorX(line, axes)
  if (atX === null) return null

  const fromY = lineY(line, atX)
  const toY = lineY(line, atX + 1)
  return {
    id,
    path: `M ${atX} ${fromY} L ${atX + 1} ${fromY} L ${atX + 1} ${toY}`,
    strokeRole: 'ruleLine',
    dashed: true,
    modelPath: true,
  }
}

// Built from the x-axis endpoints, then clipped against BOTH ranges: y = 2x + 1
// across x = −5…5 reaches y = ±11 on a y-axis of ±5, and an unclipped path
// would be drawn far outside the plot.
function lineShape(id, line, axes, role) {
  const clipped = clipSegmentToBounds(
    {
      from: { x: axes.x.min, y: lineY(line, axes.x.min) },
      to: { x: axes.x.max, y: lineY(line, axes.x.max) },
    },
    axes.x,
    axes.y,
  )
  if (!clipped) return null

  return {
    id,
    path: `M ${clipped.from.x} ${clipped.from.y} L ${clipped.to.x} ${clipped.to.y}`,
    strokeRole: role,
    modelPath: true,
  }
}

/**
 * The second line, or null when the requested comparison is impossible.
 *
 * A horizontal line's perpendicular is vertical, and a vertical line has no
 * gradient — it cannot be written as y = mx + c at all. Returning a gradient of
 * 0 there (the earlier design) drew a second horizontal line and taught the
 * exact opposite of the fact being demonstrated, so this returns
 * `{ rule: 'perpendicular', impossible: true }` and the status explains why.
 */
function resolveSecondLine(values, comparisonRule, capabilities) {
  const primary = { m: values.m, c: values.c }

  if (comparisonRule === 'perpendicular' && capabilities.perpendicularGradients) {
    const gradient = perpendicularGradientOf(primary.m)
    if (gradient === null) {
      return { rule: 'perpendicular', impossible: true }
    }
    return { m: gradient, c: values.c2, rule: 'perpendicular', impossible: false }
  }
  if (comparisonRule === 'free') {
    return { m: values.m2, c: values.c2, rule: 'free', impossible: false }
  }
  // Default, and the perpendicular fallback when the tier does not allow it.
  return { m: primary.m, c: values.c2, rule: 'parallel', impossible: false }
}

const straightLinePreset = {
  id: 'straightLine',
  accessibilityLabel: 'Coordinate plane showing the graph of a straight line',
  keyFact: 'y = mx + c: m is the gradient and c is the y-intercept.',
  instruction: 'Use the steppers to change the gradient and the y-intercept.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -5, max: 5, step: 1 },
  yAxis: { min: -5, max: 5, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: ['gradient', 'intercept', 'compare'],
  defaultFocus: 'gradient',
  defaultActiveId: 'y-intercept',
  capabilities: { showXIntercept: false, perpendicularGradients: false },

  // m and c are stepped, not dragged: GCSE needs exact values, and dragging a
  // line to precisely gradient 2 on a phone is miserable.
  initialValues: { m: 2, c: 1, m2: 1, c2: -3 },
  controls: [
    {
      id: 'm',
      label: 'Gradient',
      min: -5,
      max: 5,
      step: 1,
      valueText: values => `gradient ${values.m}`,
      valueFromPointer: (_point, values) => values.m,
    },
    {
      id: 'c',
      label: 'Y-intercept',
      min: -5,
      max: 5,
      step: 1,
      valueText: values => `y-intercept ${values.c}`,
      valueFromPointer: (_point, values) => values.c,
    },
  ],
  // Both live numbers get a real stepper. The earlier design offered buttons
  // that only *selected* which value to change, with nothing to change it
  // with — the preset was inoperable.
  steppers: [
    { controlId: 'm', label: 'Gradient (m)', group: 'equation' },
    { controlId: 'c', label: 'Y-intercept (c)', group: 'equation' },
  ],

  derive(values, { focus, comparisonRule, capabilities, axes }) {
    const line = { m: values.m, c: values.c }
    const comparing = focus === 'compare'
    const second = comparing
      ? resolveSecondLine(values, comparisonRule, capabilities)
      : null

    const shapes = [lineShape('line-1', line, axes, 'object')].filter(Boolean)
    const points = [{
      id: 'y-intercept',
      x: 0,
      y: line.c,
      text: `y-intercept ${formatCoordinate({ x: 0, y: line.c })}`,
      shortText: `(0, ${signed(line.c)})`,
      role: 'object',
      tier: 'active',
      focusable: false,
    }]

    if (focus === 'gradient' || comparing) {
      const riseRun = riseRunShape('rise-run', line, axes)
      if (riseRun) shapes.push(riseRun)
    }

    if (comparing && !second.impossible) {
      const secondShape = lineShape('line-2', second, axes, 'image')
      if (secondShape) shapes.push(secondShape)
      // Under 'parallel' both lines get a triangle, so equal steepness is
      // something you see rather than something you are told.
      if (second.rule === 'parallel') {
        const secondRiseRun = riseRunShape('rise-run-2', second, axes)
        if (secondRiseRun) shapes.push(secondRiseRun)
      }
      points.push({
        id: 'y-intercept-2',
        x: 0,
        y: second.c,
        text: `y-intercept ${formatCoordinate({ x: 0, y: second.c })}`,
        shortText: `(0, ${signed(second.c)})`,
        role: 'image',
        tier: 'related',
        focusable: false,
      })
    }

    if (capabilities.showXIntercept) {
      const xIntercept = xInterceptOf(line)
      if (xIntercept !== null) {
        points.push({
          id: 'x-intercept',
          x: xIntercept,
          y: 0,
          text: `x-intercept ${formatCoordinate({ x: xIntercept, y: 0 })}`,
          shortText: `(${signed(xIntercept)}, 0)`,
          role: 'object',
          tier: 'related',
          focusable: false,
        })
      }
    }

    const calculation = [
      `gradient: rise ÷ run = ${signed(line.m)} ÷ 1 = ${signed(line.m)}`,
      `y-intercept: the line crosses the y-axis at ${signed(line.c)}.`,
    ]
    let explanation = 'The gradient sets the steepness; the y-intercept sets where the line starts.'
    let heading = equationText(line)

    if (comparing && second.impossible) {
      heading = equationText(line)
      explanation = 'A line perpendicular to a horizontal line is vertical, and a vertical line has no gradient — it cannot be written as y = mx + c. Change the gradient to see a perpendicular pair.'
    } else if (comparing) {
      heading = `${equationText(line)}   and   ${equationText(second)}`
      if (second.rule === 'parallel') {
        explanation = 'Both lines have the same gradient, so they are parallel. Their intercepts are set separately and need not match.'
      } else if (second.rule === 'perpendicular') {
        calculation.push(`perpendicular gradient: ${MINUS}1 ÷ ${signed(line.m)} = ${signed(second.m)}`)
        explanation = 'Perpendicular gradients are negative reciprocals: multiply them and you get −1.'
      } else {
        explanation = 'Two independent lines — compare their gradients and their intercepts.'
      }
    }

    return {
      shapes,
      points,
      guides: [],
      handles: [],
      status: { heading, calculation, explanation },
    }
  },

  describe(values, { focus, comparisonRule, capabilities } = {}) {
    const line = { m: values.m, c: values.c }
    if (focus !== 'compare') {
      return `The graph of ${equationText(line)}, crossing the y-axis at ${signed(line.c)} with gradient ${signed(line.m)}.`
    }
    const second = resolveSecondLine(values, comparisonRule, capabilities ?? {})
    // An impossible comparison has no second equation to name. Formatting it
    // anyway reads "y = undefinedx − NaN" to a screen reader, so say the true
    // thing instead — the same refusal the status area gives.
    if (second.impossible) {
      return `The graph of ${equationText(line)} alone: a line perpendicular to a horizontal line is vertical, and a vertical line cannot be written as y = mx + c.`
    }
    return `The graphs of ${equationText(line)} and ${equationText(second)}, shown together for comparison.`
  },
}

export default straightLinePreset
