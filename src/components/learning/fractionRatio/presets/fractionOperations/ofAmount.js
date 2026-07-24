// ─── fractionOperations · fraction of an amount ──────────────────────────────
//
// The one place the whole is a set rather than a length, because "3/4 of 20
// apples" is a counting question and turning it into a bar hides the thing
// being counted. Where the amount divides exactly, one row is one part — so
// "divide by the denominator" is a visible act of dealing out rows, not an
// instruction.

import { counterPositions } from '../../fractionRatioGeometry.js'
import { formatFraction, fractionOfAmount } from '../../fractionRatioMath.js'
import { WHOLE, bracket, label } from '../stage.js'

export const OF_AMOUNT_STEPS = [
  { id: 'split', label: 'Share into parts' },
  { id: 'take', label: 'Take the parts' },
  { id: 'answer', label: 'The method' },
]

const TOP_Y = 60
const MAX_PER_ROW = 10
// Vertical room for the counters, leaving the bracket and its label clear of
// the canvas floor.
const MAX_GRID_HEIGHT = 176
// Beyond this many parts, one row per part makes rows too thin to count — the
// grouping would cost more than it explains.
const MAX_PART_ROWS = 8

/**
 * One row per part when the amount shares out evenly and the rows stay
 * countable at a glance; otherwise a plain wrapped grid, since a misleading
 * grouping is worse than no grouping.
 *
 * Spacing is then squeezed to whichever of width or height binds first, so a
 * large amount stays inside the stage instead of running off it.
 */
function layout(amount, denominator) {
  const partSize = amount / denominator
  const rowsAreParts = Number.isInteger(partSize)
    && partSize > 0
    && partSize <= MAX_PER_ROW
    && denominator <= MAX_PART_ROWS

  const perRow = rowsAreParts ? partSize : Math.min(amount, MAX_PER_ROW)
  const rows = Math.ceil(amount / Math.max(perRow, 1))
  const spacing = Math.min(
    34,
    WHOLE.width / Math.max(perRow, 1),
    MAX_GRID_HEIGHT / Math.max(rows, 1),
  )

  return {
    rowsAreParts,
    partSize,
    perRow,
    rows,
    spacing,
    radius: spacing * 0.34,
  }
}

export function deriveOfAmount(values, { step }) {
  const { numeratorA, denominatorA, amount } = values
  const result = fractionOfAmount(numeratorA, denominatorA, amount)
  const { rowsAreParts, perRow, rows, spacing, radius } = layout(amount, denominatorA)

  const positions = counterPositions({
    x: WHOLE.x + (WHOLE.width - perRow * spacing) / 2,
    y: TOP_Y,
    count: amount,
    perRow,
    spacing,
    radius,
  })

  const takeCount = Math.round(result.result)
  const filledCount = step === 'split' ? 0 : takeCount

  const counters = positions.map(position => ({
    id: `counter-${position.index}`,
    cx: position.cx,
    cy: position.cy,
    r: position.r,
    fillTone: position.index < filledCount ? 'shaded' : 'ghost',
    edgeTone: position.index < filledCount ? 'shaded' : 'wholeMuted',
  }))

  const rowBrackets = rowsAreParts && step !== 'answer'
    ? Array.from({ length: denominatorA }, (_, row) => {
        const first = positions[row * perRow]
        const last = positions[Math.min((row + 1) * perRow - 1, positions.length - 1)]
        if (!first || !last) return null
        return {
          id: `row-${row}`,
          vertical: true,
          x: first.cx - radius - 10,
          y1: first.cy - radius,
          y2: last.cy + radius,
          text: row === 0 ? formatFraction(1, denominatorA) : '',
          tone: row < filledCount / perRow ? 'shaded' : 'wholeMuted',
        }
      }).filter(Boolean)
    : []

  const contentBottom = TOP_Y + rows * spacing

  return {
    counters,
    brackets: [
      ...rowBrackets,
      // Only on the taking step: at the answer step the status line already
      // carries this sentence, and repeating it verbatim reads as two findings.
      ...(step === 'take' && filledCount > 0
        ? [bracket({
            id: 'taken',
            x1: WHOLE.x + 20,
            x2: WHOLE.x + WHOLE.width - 20,
            y: contentBottom + 12,
            text: `${numeratorA} of the ${denominatorA} parts = ${result.result}`,
            tone: 'shaded',
            below: true,
          })]
        : []),
    ],
    labels: [
      label({
        id: 'title',
        x: 180,
        y: 32,
        text: `${formatFraction(numeratorA, denominatorA)} of ${amount}`,
        tone: 'textPrimary',
        size: 'value',
      }),
    ],
    status: ofAmountStatus(step, values, result, rowsAreParts),
  }
}

function ofAmountStatus(step, values, result, rowsAreParts) {
  const { numeratorA, denominatorA, amount } = values

  if (step === 'split') {
    return {
      heading: `Share ${amount} into ${denominatorA} equal parts`,
      calculation: [`${amount} ÷ ${denominatorA} = ${result.partSize}`],
      explanation: result.isExact
        ? `${rowsAreParts ? 'Each row' : 'Each part'} is one ${formatFraction(1, denominatorA)} of the amount.`
        : `${amount} does not share out into ${denominatorA} whole parts, so the answer will not be a whole number.`,
    }
  }

  if (step === 'take') {
    return {
      heading: `Take ${numeratorA} of those parts`,
      calculation: [`${result.partSize} × ${numeratorA} = ${result.result}`],
      explanation: 'The numerator tells you how many of the equal parts to keep.',
    }
  }

  return {
    heading: `${formatFraction(numeratorA, denominatorA)} of ${amount} = ${result.result}`,
    calculation: [
      `(${amount} ÷ ${denominatorA}) × ${numeratorA} = ${result.result}`,
    ],
    explanation: 'Divide by the bottom, multiply by the top. Every fraction-of-an-amount question is these two steps.',
  }
}
