// ─── equivalentFractions ─────────────────────────────────────────────────────
//
// Why 1/2 and 4/8 are the same number. Both bars are the same whole and the
// shaded run ends at the same place; only the number of cuts changes. The
// dashed alignment line is the proof — it is drawn through both bars so the
// learner sees the equality rather than being told it.

import { boundaryX, clamp } from '../fractionRatioGeometry.js'
import {
  formatFraction,
  isSimplestForm,
  scaleFraction,
  simplifyFraction,
} from '../fractionRatioMath.js'
import { WHOLE, bar, barMidY, fractionGlyph, label, line, segment } from './stage.js'

const GLYPH_X = 44
const BAR_X = 84
const BAR_WIDTH = WHOLE.x + WHOLE.width - BAR_X
const BASE_Y = 58
const SCALED_Y = 168
const BAR_HEIGHT = 44

const MAX_MULTIPLIER = 6

function scaledBar({ id, y, numerator, denominator, fillTone, edgeTone }) {
  return bar({
    id,
    y,
    x: BAR_X,
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    parts: denominator,
    segments: [segment(0, numerator, fillTone, edgeTone)],
  })
}

const equivalentFractions = {
  id: 'equivalentFractions',
  accessibilityLabel: 'Equivalent fractions explorer',
  keyFact: 'Multiplying the numerator and the denominator by the same number gives an equivalent fraction — the same amount of the same whole.',
  canvas: { width: 360, height: 270 },
  interactive: true,

  controls: [
    {
      id: 'multiplier',
      label: 'Cut each part into',
      min: 1,
      max: MAX_MULTIPLIER,
      step: 1,
      stepper: true,
      valueText: values => (
        `multiplied by ${values.multiplier} — ${formatFraction(
          values.numerator * values.multiplier,
          values.denominator * values.multiplier,
        )}`
      ),
      valueFromPointer: (point, values) => {
        const ratio = clamp((point.x - BAR_X) / BAR_WIDTH, 0, 1)
        return clamp(
          Math.round(ratio * MAX_MULTIPLIER) || 1,
          1,
          Math.floor(MAX_MULTIPLIER * 12 / values.denominator) || 1,
        )
      },
    },
    { id: 'numerator', label: 'Numerator', min: 1, max: 11, step: 1 },
    { id: 'denominator', label: 'Denominator', min: 2, max: 12, step: 1 },
  ],

  initialValues: { numerator: 1, denominator: 2, multiplier: 3 },

  // The scaled bar must stay drawable: past twelve or so divisions the parts
  // are too thin to count on a phone, which defeats the whole demonstration.
  normalise: (values) => {
    const numerator = Math.min(values.numerator, values.denominator)
    const maxMultiplier = Math.max(Math.floor(24 / values.denominator), 1)
    return {
      ...values,
      numerator,
      multiplier: Math.min(values.multiplier, maxMultiplier),
    }
  },

  derive(values) {
    const { numerator, denominator, multiplier } = values
    const scaled = scaleFraction(numerator, denominator, multiplier)

    const baseBar = scaledBar({
      id: 'base',
      y: BASE_Y,
      numerator,
      denominator,
      fillTone: 'shadedSoft',
      edgeTone: 'shaded',
    })
    // Deliberately the same tone as the base bar. The claim being made is
    // "this is the same amount", and two colours would quietly contradict it —
    // the ×multiplier note and the alignment line carry the difference instead.
    const equivalentBar = scaledBar({
      id: 'equivalent',
      y: SCALED_Y,
      numerator: scaled.numerator,
      denominator: scaled.denominator,
      fillTone: 'shadedSoft',
      edgeTone: 'shaded',
    })

    const edgeX = boundaryX(baseBar, numerator)
    const simplified = simplifyFraction(numerator, denominator)
    const isSimplest = isSimplestForm(numerator, denominator)

    return {
      bars: [baseBar, equivalentBar],

      lines: [
        // The proof line: same whole, same shaded length, different cuts.
        line({
          id: 'alignment',
          x1: edgeX,
          y1: BASE_Y - 12,
          x2: edgeX,
          y2: SCALED_Y + BAR_HEIGHT + 12,
          tone: 'link',
          dashed: true,
        }),
      ],

      fractions: [
        fractionGlyph({
          id: 'base-value',
          x: GLYPH_X,
          y: barMidY(baseBar),
          numerator,
          denominator,
          tone: 'shaded',
        }),
        fractionGlyph({
          id: 'equivalent-value',
          x: GLYPH_X,
          y: barMidY(equivalentBar),
          numerator: scaled.numerator,
          denominator: scaled.denominator,
          tone: 'shaded',
        }),
      ],

      labels: [
        label({ id: 'base-caption', x: BAR_X, y: BASE_Y - 20, text: 'Starting fraction', tone: 'textMuted', size: 'caption', anchor: 'start' }),
        label({ id: 'equivalent-caption', x: BAR_X, y: SCALED_Y - 20, text: 'Equivalent fraction', tone: 'textMuted', size: 'caption', anchor: 'start' }),
        label({
          id: 'multiplier-note',
          x: GLYPH_X,
          y: (barMidY(baseBar) + barMidY(equivalentBar)) / 2,
          text: multiplier === 1 ? '×1' : `×${multiplier}`,
          tone: 'link',
          size: 'value',
        }),
        label({
          id: 'alignment-note',
          x: edgeX,
          y: SCALED_Y + BAR_HEIGHT + 26,
          text: 'same amount',
          tone: 'link',
          size: 'caption',
        }),
      ],

      handles: [{ controlId: 'multiplier', x: edgeX, y: barMidY(equivalentBar) }],

      status: {
        heading: `${formatFraction(numerator, denominator)} = ${formatFraction(scaled.numerator, scaled.denominator)}`,
        calculation: [
          `${numerator} × ${multiplier} = ${scaled.numerator}`,
          `${denominator} × ${multiplier} = ${scaled.denominator}`,
        ],
        explanation: isSimplest
          ? `${formatFraction(numerator, denominator)} is already in its simplest form. Multiplying both parts by ${multiplier} makes more pieces, not more fraction.`
          : `Going the other way, ${formatFraction(numerator, denominator)} simplifies to ${formatFraction(simplified.numerator, simplified.denominator)} by dividing both parts by ${simplified.divisor}.`,
      },
    }
  },
}

export default equivalentFractions
