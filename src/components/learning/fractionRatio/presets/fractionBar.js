// ─── fractionBar ─────────────────────────────────────────────────────────────
//
// What a fraction *is*: one whole, cut into equal parts, some of them counted.
// The same quantity appears three ways at once — as a length, as a circle and
// as notation — so the symbol is never introduced as an unexplained label.

import {
  boundaryX,
  partsFromX,
  slicePath,
  linkPath,
} from '../fractionRatioGeometry.js'
import {
  formatFraction,
  isSimplestForm,
  simplifyFraction,
  toDecimal,
  toPercent,
} from '../fractionRatioMath.js'
import { BAR_HEIGHT, WHOLE, bar, barMidY, fractionGlyph, label, segment } from './stage.js'

const BAR_Y = 56
const CIRCLE = { cx: 258, cy: 196, radius: 52 }
const GLYPH = { x: 104, y: 196 }

// Named fractions a GCSE learner should recognise on sight. Anything outside
// this list is described structurally instead of being given a forced name.
const NAMED = {
  '1/2': 'one half',
  '1/3': 'one third',
  '2/3': 'two thirds',
  '1/4': 'one quarter',
  '3/4': 'three quarters',
  '1/5': 'one fifth',
  '2/5': 'two fifths',
  '3/5': 'three fifths',
  '4/5': 'four fifths',
  '1/10': 'one tenth',
  '1/1': 'one whole',
}

function describe(numerator, denominator) {
  if (numerator === 0) return 'none of the whole'
  const simplified = simplifyFraction(numerator, denominator)
  // Keyed on the raw pair, not formatFraction, which drops a denominator of 1
  // and would leave a full bar without its name.
  const key = `${simplified.numerator}/${simplified.denominator}`
  return NAMED[key] ?? `${numerator} out of ${denominator} equal parts`
}

const fractionBar = {
  id: 'fractionBar',
  accessibilityLabel: 'Interactive fraction bar and circle',
  keyFact: 'A fraction cuts one whole into equal parts. The denominator is how many parts; the numerator is how many you count.',
  canvas: { width: 360, height: 268 },
  interactive: true,

  controls: [
    {
      id: 'numerator',
      label: 'Parts shaded',
      min: 0,
      max: 12,
      step: 1,
      stepper: true,
      valueText: values => `${values.numerator} of ${values.denominator} parts shaded`,
      valueFromPointer: (point, values) => (
        partsFromX(bar({ id: 'x', y: BAR_Y, parts: values.denominator }), point.x)
      ),
    },
    {
      id: 'denominator',
      label: 'Equal parts',
      min: 2,
      max: 12,
      step: 1,
      stepper: true,
      valueText: values => `the whole is cut into ${values.denominator} equal parts`,
    },
  ],

  initialValues: { numerator: 3, denominator: 4 },

  // A fraction bar can never show more shaded parts than it has parts, so the
  // numerator follows the denominator down rather than being left stranded.
  normalise: values => ({
    ...values,
    numerator: Math.min(values.numerator, values.denominator),
  }),

  derive(values) {
    const { numerator, denominator } = values
    const wholeBar = bar({
      id: 'whole',
      y: BAR_Y,
      parts: denominator,
      segments: [segment(0, numerator, 'shadedSoft', 'shaded')],
    })

    const edgeX = boundaryX(wholeBar, numerator)
    const simplified = simplifyFraction(numerator, denominator)
    const canSimplify = numerator > 0 && !isSimplestForm(numerator, denominator)

    return {
      bars: [wholeBar],

      sectors: Array.from({ length: denominator }, (_, index) => ({
        id: `slice-${index}`,
        path: slicePath(
          CIRCLE.cx,
          CIRCLE.cy,
          CIRCLE.radius,
          index / denominator,
          (index + 1) / denominator,
        ),
        fillTone: index < numerator ? 'shadedSoft' : 'none',
        edgeTone: index < numerator ? 'shaded' : 'divider',
      })),

      connectors: [
        {
          id: 'bar-to-glyph',
          path: linkPath(WHOLE.x + 46, BAR_Y + BAR_HEIGHT, GLYPH.x, GLYPH.y - 46),
          tone: 'link',
          dashed: true,
        },
        {
          id: 'bar-to-circle',
          path: linkPath(WHOLE.x + 254, BAR_Y + BAR_HEIGHT, CIRCLE.cx, CIRCLE.cy - CIRCLE.radius),
          tone: 'link',
          dashed: true,
        },
      ],

      fractions: [
        fractionGlyph({
          id: 'value',
          x: GLYPH.x,
          y: GLYPH.y,
          numerator,
          denominator,
          tone: 'shaded',
          size: 'large',
        }),
      ],

      labels: [
        label({ id: 'bar-caption', x: 180, y: 34, text: 'One whole', tone: 'textMuted', size: 'eyebrow' }),
        label({ id: 'glyph-caption', x: GLYPH.x, y: 262, text: 'As notation', tone: 'textMuted', size: 'caption' }),
        label({ id: 'circle-caption', x: CIRCLE.cx, y: 262, text: 'As a circle', tone: 'textMuted', size: 'caption' }),
      ],

      handles: [{ controlId: 'numerator', x: edgeX, y: barMidY(wholeBar) }],

      status: {
        heading: `${formatFraction(numerator, denominator)} — ${describe(numerator, denominator)}`,
        calculation: [
          `${numerator} shaded out of ${denominator} equal parts`,
          `= ${toDecimal(numerator, denominator)} = ${toPercent(numerator, denominator)}%`,
        ],
        explanation: canSimplify
          ? `The same amount is also ${formatFraction(simplified.numerator, simplified.denominator)} — divide both parts by ${simplified.divisor}.`
          : 'The bottom number cuts the whole up. The top number counts how many of those parts you take.',
      },
    }
  },
}

export default fractionBar
