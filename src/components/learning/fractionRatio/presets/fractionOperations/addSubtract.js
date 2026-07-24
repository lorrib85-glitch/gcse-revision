// ─── fractionOperations · add and subtract ───────────────────────────────────
//
// Four steps, because for adding unlike fractions the steps *are* the maths.
// Seeing the mismatch first — two bars whose parts are visibly different sizes
// — is what makes a common denominator feel necessary rather than arbitrary.

import { addFractions, formatFraction, subtractFractions, toMixedNumber } from '../../fractionRatioMath.js'
import { boundaryX } from '../../fractionRatioGeometry.js'
import { bar, bracket, fractionGlyph, label, segment } from '../stage.js'

export const ADD_SUBTRACT_STEPS = [
  { id: 'mismatch', label: 'See the problem' },
  { id: 'common', label: 'Match the parts' },
  { id: 'combine', label: 'Combine' },
  { id: 'check', label: 'Check' },
]

const TOP_Y = 66
const BOTTOM_Y = 150
const RESULT_Y = 108
const BAR_HEIGHT = 42

const PART_NAMES = {
  2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths',
  7: 'sevenths', 8: 'eighths', 9: 'ninths', 10: 'tenths', 12: 'twelfths',
  14: 'fourteenths', 15: 'fifteenths', 16: 'sixteenths', 18: 'eighteenths',
  20: 'twentieths', 21: 'twenty-firsts', 24: 'twenty-fourths',
}

function partsName(denominator) {
  return PART_NAMES[denominator] ?? `${denominator}ths`
}

function operandBar({ id, y, numerator, denominator, fillTone, edgeTone }) {
  return bar({
    id,
    y,
    height: BAR_HEIGHT,
    parts: denominator,
    segments: [segment(0, numerator, fillTone, edgeTone)],
  })
}

function operandGlyphs(a, b) {
  return [
    fractionGlyph({ id: 'operand-a', x: 16, y: TOP_Y + BAR_HEIGHT / 2, ...a, tone: 'shaded', size: 'small' }),
    fractionGlyph({ id: 'operand-b', x: 16, y: BOTTOM_Y + BAR_HEIGHT / 2, ...b, tone: 'shadedAlt', size: 'small' }),
  ]
}

export function deriveAddSubtract(values, { step, isSubtract }) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values
  const result = isSubtract
    ? subtractFractions(numeratorA, denominatorA, numeratorB, denominatorB)
    : addFractions(numeratorA, denominatorA, numeratorB, denominatorB)

  const { common } = result
  const sign = isSubtract ? '−' : '+'
  const verb = isSubtract ? 'Subtract' : 'Add'

  if (step === 'mismatch') return mismatchScene(values, sign, verb)
  if (step === 'common') return commonScene(values, common, sign)
  return resultScene(step, result, common, sign, verb)
}

function mismatchScene(values, sign, verb) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values

  return {
    bars: [
      operandBar({ id: 'a', y: TOP_Y, numerator: numeratorA, denominator: denominatorA, fillTone: 'shadedSoft', edgeTone: 'shaded' }),
      operandBar({ id: 'b', y: BOTTOM_Y, numerator: numeratorB, denominator: denominatorB, fillTone: 'shadedAltSoft', edgeTone: 'shadedAlt' }),
    ],
    fractions: operandGlyphs(
      { numerator: numeratorA, denominator: denominatorA },
      { numerator: numeratorB, denominator: denominatorB },
    ),
    labels: [
      label({ id: 'title', x: 180, y: 32, text: `${formatFraction(numeratorA, denominatorA)} ${sign} ${formatFraction(numeratorB, denominatorB)}`, tone: 'textPrimary', size: 'value' }),
      label({ id: 'a-part', x: 180, y: TOP_Y + BAR_HEIGHT + 16, text: `each part = ${formatFraction(1, denominatorA)}`, tone: 'textMuted', size: 'caption' }),
      label({ id: 'b-part', x: 180, y: BOTTOM_Y + BAR_HEIGHT + 16, text: `each part = ${formatFraction(1, denominatorB)}`, tone: 'textMuted', size: 'caption' }),
    ],
    status: {
      heading: denominatorA === denominatorB ? 'The parts already match' : 'The parts are different sizes',
      calculation: [
        denominatorA === denominatorB
          ? `Both bars are cut into ${partsName(denominatorA)}`
          : `${formatFraction(1, denominatorA)} is not the same size as ${formatFraction(1, denominatorB)}`,
      ],
      explanation: denominatorA === denominatorB
        ? `Same size parts, so you can ${verb.toLowerCase()} them straight away.`
        : `You cannot ${verb.toLowerCase()} these yet. Only parts of the same size can be counted together.`,
    },
  }
}

function commonScene(values, common, sign) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values

  return {
    bars: [
      operandBar({ id: 'a', y: TOP_Y, numerator: common.a.numerator, denominator: common.denominator, fillTone: 'shadedSoft', edgeTone: 'shaded' }),
      operandBar({ id: 'b', y: BOTTOM_Y, numerator: common.b.numerator, denominator: common.denominator, fillTone: 'shadedAltSoft', edgeTone: 'shadedAlt' }),
    ],
    fractions: operandGlyphs(
      { numerator: common.a.numerator, denominator: common.denominator },
      { numerator: common.b.numerator, denominator: common.denominator },
    ),
    labels: [
      label({ id: 'title', x: 180, y: 32, text: `Both in ${partsName(common.denominator)}`, tone: 'textPrimary', size: 'value' }),
      label({ id: 'a-scale', x: 180, y: TOP_Y + BAR_HEIGHT + 16, text: `${formatFraction(numeratorA, denominatorA)} × ${common.a.multiplier} top and bottom`, tone: 'link', size: 'caption' }),
      label({ id: 'b-scale', x: 180, y: BOTTOM_Y + BAR_HEIGHT + 16, text: `${formatFraction(numeratorB, denominatorB)} × ${common.b.multiplier} top and bottom`, tone: 'link', size: 'caption' }),
    ],
    status: {
      heading: `Now both are ${partsName(common.denominator)}`,
      calculation: [
        `${formatFraction(numeratorA, denominatorA)} = ${formatFraction(common.a.numerator, common.denominator)}`,
        `${formatFraction(numeratorB, denominatorB)} = ${formatFraction(common.b.numerator, common.denominator)}`,
      ],
      explanation: `${sign === '+' ? 'Same' : 'Same'} whole, same size parts. Neither fraction changed value — only the number of pieces did.`,
    },
  }
}

/**
 * Combine and check share a layout, because the learner should see the same
 * bar they just built rather than a fresh diagram appearing at the answer.
 *
 * A sum can pass one whole. Rather than overflow a single bar, a second whole
 * is drawn below the first and the shading continues into it — which is what
 * "more than one whole" means, and sets up mixed numbers honestly.
 */
function resultScene(step, result, common, sign, verb) {
  const total = result.raw.numerator
  const isImproper = total > common.denominator
  const firstShaded = Math.min(Math.max(total, 0), common.denominator)
  const overflowShaded = Math.max(total - common.denominator, 0)

  const primaryBar = operandBar({
    id: 'result',
    y: isImproper ? TOP_Y : RESULT_Y,
    numerator: firstShaded,
    denominator: common.denominator,
    fillTone: 'shadedSoft',
    edgeTone: 'shaded',
  })

  const overflowBar = isImproper
    ? operandBar({
        id: 'result-overflow',
        y: BOTTOM_Y,
        numerator: overflowShaded,
        denominator: common.denominator,
        fillTone: 'shadedSoft',
        edgeTone: 'shaded',
      })
    : null

  const countedBar = overflowBar ?? primaryBar
  const countedParts = overflowBar ? overflowShaded : firstShaded

  const wholeLabels = overflowBar
    ? [
        label({ id: 'whole-one', x: 180, y: TOP_Y - 10, text: 'one whole — full', tone: 'textMuted', size: 'caption' }),
        label({ id: 'whole-two', x: 180, y: BOTTOM_Y - 10, text: 'into the next whole', tone: 'textMuted', size: 'caption' }),
      ]
    : []

  if (step === 'combine') {
    return {
      bars: overflowBar ? [primaryBar, overflowBar] : [primaryBar],
      brackets: [
        bracket({
          id: 'counted',
          x1: countedBar.x,
          x2: boundaryX(countedBar, countedParts),
          y: countedBar.y + BAR_HEIGHT + 8,
          text: `${total} parts`,
          tone: 'shaded',
          below: true,
        }),
      ],
      labels: [
        label({ id: 'title', x: 180, y: 32, text: `${formatFraction(common.a.numerator, common.denominator)} ${sign} ${formatFraction(common.b.numerator, common.denominator)}`, tone: 'textPrimary', size: 'value' }),
        ...wholeLabels,
      ],
      status: {
        heading: `${verb} the numerators`,
        calculation: [
          `${common.a.numerator} ${sign} ${common.b.numerator} = ${total}`,
          formatFraction(total, common.denominator),
        ],
        explanation: 'The denominator stays the same. You are counting parts, not changing how big a part is.',
      },
    }
  }

  const simplified = result.simplified
  const mixed = toMixedNumber(simplified.numerator, simplified.denominator)

  return {
    bars: overflowBar ? [primaryBar, overflowBar] : [primaryBar],
    fractions: [
      fractionGlyph({
        id: 'result-value',
        x: 180,
        y: isImproper ? 244 : 214,
        numerator: simplified.numerator,
        denominator: simplified.denominator,
        tone: 'shaded',
        size: 'large',
      }),
    ],
    labels: [
      label({ id: 'title', x: 180, y: 32, text: 'Your result', tone: 'textPrimary', size: 'value' }),
      ...wholeLabels,
    ],
    status: {
      heading: formatFraction(simplified.numerator, simplified.denominator),
      calculation: [
        result.wasSimplified
          ? `${formatFraction(result.raw.numerator, result.raw.denominator)} simplifies — divide both by ${result.divisor}`
          : `${formatFraction(result.raw.numerator, result.raw.denominator)} is already in its simplest form`,
        isImproper && mixed.numerator > 0
          ? `= ${mixed.whole} and ${formatFraction(mixed.numerator, mixed.denominator)}`
          : null,
      ].filter(Boolean),
      explanation: isImproper
        ? 'The answer is more than one whole, so it can also be written as a mixed number.'
        : 'Less than one whole, which matches the shaded bar — so the answer is reasonable.',
    },
  }
}
