// ─── Preset: intersection ────────────────────────────────────────────────────
//
// A highlighted crossing point is a picture. Substituting the coordinate back
// into both equations is what makes it a solution, so the status always shows
// both checks rather than only the coordinate.

import {
  formatCoordinate,
  formatLinearEquation,
  intersectionOf,
  lineY,
} from '../coordinatePlaneMath.js'
import { clipSegmentToBounds } from '../coordinatePlaneGeometry.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

// The substituted x is written the way it would be written by hand: a
// coefficient of 1 or −1 is never printed, so "y = −x + 7" checks as
// "5 = −2 + 7" rather than "5 = −1(2) + 7". Any other gradient brackets its
// value, because "2−1 + 3" is a different sum from "2(−1) + 3".
function substitutionCheck(line, solution) {
  const productText = line.m === 1
    ? signed(solution.x)
    : line.m === -1
      ? signed(-solution.x)
      : `${signed(line.m)}(${signed(solution.x)})`
  const cTerm = line.c === 0
    ? ''
    : line.c > 0
      ? ` + ${line.c}`
      : ` ${MINUS} ${Math.abs(line.c)}`

  return `${formatLinearEquation(line)}  →  ${signed(solution.y)} = ${productText}${cTerm} ✓`
}

// Built from the x-axis endpoints, then clipped against BOTH ranges, so what
// the scene reports is what the learner sees. Returns null when the line misses
// the plot entirely rather than emitting a path drawn off the plane.
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

const intersectionPreset = {
  id: 'intersection',
  accessibilityLabel: 'Coordinate plane showing where two straight lines meet',
  keyFact: 'Two lines meet at the coordinate that satisfies both equations.',
  instruction: 'Change either equation and watch the meeting point move.',
  interactive: true,
  supportsShowAllGuides: false,

  canvas: { width: 360, height: 330 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -4, max: 7, step: 1 },
  yAxis: { min: -2, max: 9, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: 'solution',
  capabilities: {},

  // The solution of y = x + c1 and y = −x + c2 is
  // ((c2 − c1)/2, (c1 + c2)/2), so the intercept ranges decide whether it is
  // visible. The originally planned ranges (c1 −4…8, c2 −4…9) put it outside
  // the axes for 20 of their 182 pairs — c1 = 8, c2 = −4 lands at (−6, 2).
  // These ranges keep all 88 pairs inside x −4…7 and y −2…9, and still reach
  // half-integer solutions such as (−3.5, 2.5), which is worth showing.
  //
  // m1 and m2 are configuration, not learner controls: this preset teaches what
  // a solution IS, not what changing a gradient does. They are deliberately
  // absent from `controls`, so no stepper is ever rendered for them.
  initialValues: { m1: 1, c1: 3, m2: -1, c2: 7 },
  controls: [
    {
      id: 'c1',
      label: 'First line y-intercept',
      min: -1,
      max: 6,
      step: 1,
      valueText: values => `first line intercept ${values.c1}`,
      valueFromPointer: (_point, values) => values.c1,
    },
    {
      id: 'c2',
      label: 'Second line y-intercept',
      min: -1,
      max: 9,
      step: 1,
      valueText: values => `second line intercept ${values.c2}`,
      valueFromPointer: (_point, values) => values.c2,
    },
  ],
  steppers: [
    { controlId: 'c1', label: 'First line (c)', group: 'intercepts' },
    { controlId: 'c2', label: 'Second line (c)', group: 'intercepts' },
  ],

  derive(values, { axes, showGuides }) {
    const lineA = { m: values.m1, c: values.c1 }
    const lineB = { m: values.m2, c: values.c2 }
    const result = intersectionOf(lineA, lineB)

    const shapes = [
      lineShape('line-a', lineA, axes, 'object'),
      lineShape('line-b', lineB, axes, 'image'),
    ].filter(Boolean)

    // Three outcomes, not two. Coincident lines are the case a two-way check
    // gets silently wrong: it calls one line "parallel with no solution".
    if (result.kind !== 'one') {
      const infinite = result.kind === 'infinite'
      return {
        shapes,
        points: [],
        guides: [],
        handles: [],
        status: {
          heading: infinite ? 'Infinitely many solutions' : 'No solution',
          calculation: [formatLinearEquation(lineA), formatLinearEquation(lineB)],
          explanation: infinite
            ? 'Same gradient and same intercept, so these are the same line — every point on it satisfies both equations.'
            : 'Equal gradients with different intercepts mean the lines are parallel, so they never meet and no pair satisfies both.',
        },
      }
    }

    const solution = result.point

    return {
      shapes,
      points: [{
        id: 'solution',
        ...solution,
        text: formatCoordinate(solution),
        shortText: formatCoordinate(solution),
        role: 'solution',
        // The solution point and its two guides are the whole annotation here,
        // so showGuides="none" drops both together. Leaving the guides while
        // demoting the point would draw lines to nothing in particular.
        tier: showGuides === 'none' ? 'related' : 'active',
        focusable: false,
      }],
      guides: showGuides === 'none' ? [] : [
        { id: 'guide-x', from: { x: solution.x, y: 0 }, to: solution, role: 'guideLine' },
        { id: 'guide-y', from: { x: 0, y: solution.y }, to: solution, role: 'guideLine' },
      ],
      handles: [],
      status: {
        heading: formatCoordinate(solution),
        calculation: [
          substitutionCheck(lineA, solution),
          substitutionCheck(lineB, solution),
        ],
        explanation: `x = ${signed(solution.x)} and y = ${signed(solution.y)} is the only pair that satisfies both equations.`,
      },
    }
  },

  describe(values) {
    const lineA = { m: values.m1, c: values.c1 }
    const lineB = { m: values.m2, c: values.c2 }
    const result = intersectionOf(lineA, lineB)

    if (result.kind === 'infinite') {
      return `The graph of ${formatLinearEquation(lineA)}, drawn twice — both equations describe the same line.`
    }
    if (result.kind === 'none') {
      return `The graphs of ${formatLinearEquation(lineA)} and ${formatLinearEquation(lineB)}, which are parallel and never meet.`
    }
    return `The graphs of ${formatLinearEquation(lineA)} and ${formatLinearEquation(lineB)}, meeting at ${formatCoordinate(result.point)}.`
  },
}

export default intersectionPreset
