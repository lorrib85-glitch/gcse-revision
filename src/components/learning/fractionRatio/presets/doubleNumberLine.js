// ─── doubleNumberLine ────────────────────────────────────────────────────────
//
// Two quantities that scale together, drawn as two lines locked to the same
// rungs. Sliding the marker moves both at once, which is the engine's fourth
// rule made literal: you cannot change one side without the other. The unit
// rate is always on screen, because that single rung is what every direct
// proportion question is really asking for.

import { positionFromX, tickPositions, valueFromPosition } from '../fractionRatioGeometry.js'
import { formatMoney, formatNumber, unitRate } from '../fractionRatioMath.js'
import { WHOLE, label, line } from './stage.js'

const TOP_Y = 96
const BOTTOM_Y = 182
const STEPS = 6

// The scenario the line describes. Kept as data beside the preset so a screen
// can restate the same mechanic for petrol, currency or recipe quantities
// without new code.
const QUANTITY = { label: 'Items', perStep: 1 }
const VALUE = { label: 'Cost', perStep: 1.5 }

const doubleNumberLine = {
  id: 'doubleNumberLine',
  accessibilityLabel: 'Double number line for direct proportion',
  keyFact: 'In direct proportion both quantities scale by the same multiplier. Finding the value of one unit lets you find the value of any amount.',
  canvas: { width: 360, height: 272 },
  interactive: true,

  controls: [
    {
      id: 'position',
      label: 'Amount on the line',
      min: 0,
      max: STEPS,
      step: 1,
      stepper: true,
      valueText: values => (
        `${formatNumber(values.position * QUANTITY.perStep)} items costing ${formatMoney(values.position * VALUE.perStep)}`
      ),
      valueFromPointer: point => valueFromPosition(WHOLE.x, WHOLE.width, point.x, STEPS, 1),
    },
  ],

  initialValues: { position: 3 },

  derive(values) {
    const { position } = values
    const quantity = position * QUANTITY.perStep
    const amount = position * VALUE.perStep
    const rate = unitRate(1, VALUE.perStep)

    const ticks = tickPositions(WHOLE.x, WHOLE.width, STEPS)
    const markerX = positionFromX(WHOLE.x, WHOLE.width, position, STEPS)

    return {
      lines: [
        line({ id: 'top-axis', x1: WHOLE.x, y1: TOP_Y, x2: WHOLE.x + WHOLE.width, y2: TOP_Y, tone: 'whole', arrow: true }),
        line({ id: 'bottom-axis', x1: WHOLE.x, y1: BOTTOM_Y, x2: WHOLE.x + WHOLE.width, y2: BOTTOM_Y, tone: 'whole', arrow: true }),
        ...ticks.flatMap((x, index) => [
          line({ id: `tick-top-${index}`, x1: x, y1: TOP_Y - 6, x2: x, y2: TOP_Y + 6, tone: 'wholeMuted' }),
          line({ id: `tick-bottom-${index}`, x1: x, y1: BOTTOM_Y - 6, x2: x, y2: BOTTOM_Y + 6, tone: 'wholeMuted' }),
        ]),
      ],

      // The rungs are the mechanism: each joins a quantity to its value, and
      // the active rung is the answer to the question on screen.
      rungs: ticks.map((x, index) => ({
        id: `rung-${index}`,
        x,
        y1: TOP_Y,
        y2: BOTTOM_Y,
        tone: index === position ? 'link' : 'ghost',
        active: index === position,
      })),

      markers: [
        { id: 'marker-top', cx: markerX, cy: TOP_Y, r: 6, tone: 'shaded' },
        { id: 'marker-bottom', cx: markerX, cy: BOTTOM_Y, r: 6, tone: 'shadedAlt' },
      ],

      labels: [
        label({ id: 'top-caption', x: WHOLE.x, y: TOP_Y - 36, text: QUANTITY.label, tone: 'textMuted', size: 'eyebrow', anchor: 'start' }),
        label({ id: 'bottom-caption', x: WHOLE.x, y: BOTTOM_Y + 42, text: VALUE.label, tone: 'textMuted', size: 'eyebrow', anchor: 'start' }),
        ...ticks.map((x, index) => label({
          id: `top-value-${index}`,
          x,
          y: TOP_Y - 18,
          text: formatNumber(index * QUANTITY.perStep),
          tone: index === position ? 'shaded' : 'textMuted',
          size: index === position ? 'value' : 'caption',
        })),
        ...ticks.map((x, index) => label({
          id: `bottom-value-${index}`,
          x,
          y: BOTTOM_Y + 24,
          text: formatMoney(index * VALUE.perStep),
          tone: index === position ? 'shadedAlt' : 'textMuted',
          size: index === position ? 'value' : 'caption',
        })),
        label({ id: 'title', x: 180, y: 34, text: 'Both lines move together', tone: 'textPrimary', size: 'value' }),
      ],

      handles: [{ controlId: 'position', x: markerX, y: (TOP_Y + BOTTOM_Y) / 2 }],

      status: {
        heading: position === 0
          ? 'Nothing costs nothing'
          : `${formatNumber(quantity)} → ${formatMoney(amount)}`,
        calculation: [
          `1 → ${formatMoney(rate)}`,
          position === 0 ? null : `${formatMoney(rate)} × ${formatNumber(quantity)} = ${formatMoney(amount)}`,
        ].filter(Boolean),
        explanation: 'Find what one is worth, then multiply. Every rung is the same jump on both lines.',
      },
    }
  },
}

export default doubleNumberLine
