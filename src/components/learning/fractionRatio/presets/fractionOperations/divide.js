// ─── fractionOperations · divide ─────────────────────────────────────────────
//
// Division read as "how many of these fit into that". The dividend is drawn as
// a shaded length and the divisor is laid along it as repeated pieces, so the
// answer is counted off the diagram before the reciprocal rule appears. The
// rule then arrives as a shortcut for something already seen, which is the only
// order in which "turn it upside down and multiply" ever makes sense.

import { divideFractions, formatFraction, toMixedNumber } from '../../fractionRatioMath.js'
import { WHOLE, bar, bracket, fractionGlyph, label, segment } from '../stage.js'

export const DIVIDE_STEPS = [
  { id: 'question', label: 'The question' },
  { id: 'fit', label: 'How many fit' },
  { id: 'answer', label: 'The rule' },
]

const BAR_Y = 74
const STRIP_Y = 146
const BAR_HEIGHT = 44

export function deriveDivide(values, { step }) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values
  const result = divideFractions(numeratorA, denominatorA, numeratorB, denominatorB)

  const dividend = numeratorA / denominatorA
  const divisor = numeratorB / denominatorB
  const shadedWidth = WHOLE.width * dividend
  const pieceWidth = WHOLE.width * divisor
  const exactCount = divisor === 0 ? 0 : dividend / divisor

  const dividendBar = bar({
    id: 'dividend',
    y: BAR_Y,
    height: BAR_HEIGHT,
    parts: denominatorA,
    segments: [segment(0, numeratorA, 'shadedSoft', 'shaded')],
  })

  const showPieces = step !== 'question'
  const pieceCount = Math.ceil(exactCount - 1e-9)

  // Pieces are clipped to the shaded length so the final one shows the leftover
  // honestly — a partial piece is exactly why the answer is a fraction.
  const pieces = showPieces
    ? Array.from({ length: pieceCount }, (_, index) => {
        const x = WHOLE.x + index * pieceWidth
        const width = Math.min(pieceWidth, WHOLE.x + shadedWidth - x)
        const whole = width >= pieceWidth - 1e-6
        return {
          id: `piece-${index}`,
          x,
          y: STRIP_Y,
          width,
          height: BAR_HEIGHT,
          fillTone: whole ? 'shadedAltSoft' : 'ghost',
          edgeTone: 'shadedAlt',
          dashed: !whole,
        }
      })
    : []

  const mixed = toMixedNumber(result.simplified.numerator, result.simplified.denominator)

  return {
    bars: [dividendBar],
    cells: pieces,

    // Only while counting: once the reciprocal rule is on screen the glyph and
    // the status line both state the answer, and a third copy is noise.
    brackets: step === 'fit'
      ? [bracket({
          id: 'fit-span',
          x1: WHOLE.x,
          x2: WHOLE.x + shadedWidth,
          y: STRIP_Y + BAR_HEIGHT + 8,
          text: formatFraction(result.fitCount.numerator, result.fitCount.denominator),
          tone: 'shadedAlt',
          below: true,
        })]
      : [],

    fractions: [
      fractionGlyph({ id: 'dividend-value', x: 16, y: BAR_Y + BAR_HEIGHT / 2, numerator: numeratorA, denominator: denominatorA, tone: 'shaded', size: 'small' }),
      ...(showPieces
        ? [fractionGlyph({ id: 'divisor-value', x: 16, y: STRIP_Y + BAR_HEIGHT / 2, numerator: numeratorB, denominator: denominatorB, tone: 'shadedAlt', size: 'small' })]
        : []),
      ...(step === 'answer'
        ? [fractionGlyph({ id: 'result-value', x: 180, y: 244, numerator: result.simplified.numerator, denominator: result.simplified.denominator, tone: 'shaded', size: 'large' })]
        : []),
    ],

    labels: [
      label({
        id: 'title',
        x: 180,
        y: 32,
        text: `${formatFraction(numeratorA, denominatorA)} ÷ ${formatFraction(numeratorB, denominatorB)}`,
        tone: 'textPrimary',
        size: 'value',
      }),
      label({
        id: 'question',
        x: 180,
        y: 50,
        text: `How many ${formatFraction(numeratorB, denominatorB)}s fit into ${formatFraction(numeratorA, denominatorA)}?`,
        tone: 'textMuted',
        size: 'caption',
      }),
    ],

    status: divideStatus(step, values, result, mixed),
  }
}

function divideStatus(step, values, result, mixed) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values

  if (step === 'question') {
    return {
      heading: `How many ${formatFraction(numeratorB, denominatorB)}s in ${formatFraction(numeratorA, denominatorA)}?`,
      calculation: [`Dividing asks how many of one amount fit inside another`],
      explanation: 'The shaded bar is what you have. Next, lay the divisor along it and count.',
    }
  }

  if (step === 'fit') {
    return {
      heading: `${formatFraction(result.fitCount.numerator, result.fitCount.denominator)} pieces fit into ${formatFraction(numeratorA, denominatorA)}`,
      calculation: [
        `Each piece is ${formatFraction(numeratorB, denominatorB)} of the whole`,
        mixed.numerator === 0
          ? `That is exactly ${mixed.whole}`
          : `That is ${mixed.whole} whole pieces and ${formatFraction(mixed.numerator, mixed.denominator)} of another`,
      ],
      explanation: 'The dashed piece is a part-piece — that leftover is why the answer is not a whole number.',
    }
  }

  return {
    heading: `${formatFraction(numeratorA, denominatorA)} ÷ ${formatFraction(numeratorB, denominatorB)} = ${formatFraction(result.simplified.numerator, result.simplified.denominator)}`,
    calculation: [
      `Flip the second fraction: ${formatFraction(numeratorB, denominatorB)} becomes ${formatFraction(result.reciprocal.numerator, result.reciprocal.denominator)}`,
      `${formatFraction(numeratorA, denominatorA)} × ${formatFraction(result.reciprocal.numerator, result.reciprocal.denominator)} = ${formatFraction(result.raw.numerator, result.raw.denominator)}`,
      result.wasSimplified ? `= ${formatFraction(result.simplified.numerator, result.simplified.denominator)}` : null,
    ].filter(Boolean),
    explanation: 'Multiplying by the reciprocal gives the count you just made on the diagram — the rule is a shortcut for the picture.',
  }
}
