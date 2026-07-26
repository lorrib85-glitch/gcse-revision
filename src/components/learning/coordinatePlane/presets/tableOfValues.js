// ─── Preset: tableOfValues ───────────────────────────────────────────────────
//
// Stepping through substitutions teaches arithmetic; it does not by itself
// teach that the collection of points creates the line. So the line's
// appearance follows a fixed sequence: nothing from one point, a provisional
// dashed line from two, and a solid line from three, where the third
// coordinate confirms the rule rather than merely being joinable.
//
// Completed pairs persist as a trail. Without it this preset is ordinary point
// plotting with extra arithmetic.

import { formatCoordinate, lineY } from '../coordinatePlaneMath.js'

const MINUS = '−'
const FIRST_X = -2
const ROW_COUNT = 6

function signed(value) {
  return String(value).replace('-', MINUS)
}

// The substituted value is ALWAYS bracketed, not only when it is negative.
// Bracketing only the negatives concatenates the two numbers for every other
// row — m = 2 at x = 1 renders "y = 21 + 1 = 3", which is not a smaller
// cosmetic problem than a missing minus sign, it is a different sum.
function bracketed(value) {
  return `(${signed(value)})`
}

function substitutionText({ m, c }, x) {
  const total = m * x + c
  const cTerm = c < 0 ? `${MINUS} ${Math.abs(c)}` : `+ ${c}`
  return `x = ${signed(x)} → y = ${signed(m)}${bracketed(x)} ${cTerm} = ${signed(total)}`
}

function explanationFor(count) {
  if (count <= 1) return 'One point is not enough — a single point does not fix a line.'
  if (count === 2) return 'Two points define a straight line, so the line appears — but only provisionally.'
  return 'The third coordinate confirms the rule: all the points follow y = mx + c, so the line is certain.'
}

const tableOfValuesPreset = {
  id: 'tableOfValues',
  accessibilityLabel: 'Coordinate plane building a straight line from a table of values',
  keyFact: 'Substituting values of x produces coordinates that all lie on one line.',
  instruction: 'Step through the x values and watch the points build the line.',
  interactive: true,
  supportsShowAllGuides: false,

  canvas: { width: 360, height: 330 },
  padding: { top: 24, right: 28, bottom: 52, left: 40 },
  xAxis: { min: -3, max: 3, step: 1 },
  yAxis: { min: -6, max: 8, step: 2 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: null,
  capabilities: {},

  // m and c are configuration, not learner controls: this preset teaches how a
  // table of values builds a line, not what changing the gradient does. They
  // are deliberately absent from `controls`, so no stepper is ever rendered
  // for them.
  initialValues: { m: 2, c: 1, step: 0 },
  controls: [
    {
      id: 'step',
      label: 'Table row',
      min: 0,
      max: ROW_COUNT - 1,
      step: 1,
      valueText: values => `row ${values.step + 1} of ${ROW_COUNT}`,
      valueFromPointer: (_point, values) => values.step,
    },
  ],
  // The only control, and there is no handle for it — without this stepper the
  // preset cannot be operated at all.
  steppers: [{ controlId: 'step', label: 'Table row' }],

  derive(values) {
    const line = { m: values.m, c: values.c }
    const count = values.step + 1

    const plotted = Array.from({ length: count }, (_, index) => {
      const x = FIRST_X + index
      return { x, y: lineY(line, x) }
    })

    const points = plotted.map((point, index) => ({
      id: `plotted-${index}`,
      ...point,
      text: formatCoordinate(point),
      shortText: formatCoordinate(point),
      role: index === count - 1 ? 'object' : 'textMuted',
      tier: index === count - 1 ? 'active' : 'related',
      focusable: false,
    }))

    const shapes = []
    if (count >= 2) {
      const first = plotted[0]
      const last = plotted[count - 1]
      shapes.push({
        id: 'line',
        path: `M ${first.x} ${first.y} L ${last.x} ${last.y}`,
        strokeRole: 'object',
        // Dashed at exactly two points; solid from the third onward.
        dashed: count === 2,
        modelPath: true,
      })
    }

    const current = plotted[count - 1]

    return {
      shapes,
      points,
      guides: [],
      handles: [],
      // The accumulating trail of every pair worked out so far.
      trail: plotted.map((point, index) => ({
        id: `trail-${index}`,
        text: formatCoordinate(point),
      })),
      status: {
        heading: formatCoordinate(current),
        calculation: [substitutionText(line, current.x)],
        explanation: explanationFor(count),
      },
    }
  },

  describe(values) {
    const line = { m: values.m, c: values.c }
    const count = values.step + 1
    const pairs = Array.from({ length: count }, (_, index) => {
      const x = FIRST_X + index
      return formatCoordinate({ x, y: lineY(line, x) })
    }).join(', ')

    return `A table of values for y = ${signed(line.m)}x + ${signed(line.c)} with ${count} point${count === 1 ? '' : 's'} plotted: ${pairs}.`
  },
}

export default tableOfValuesPreset
