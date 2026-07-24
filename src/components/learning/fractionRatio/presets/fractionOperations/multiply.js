// ─── fractionOperations · multiply ───────────────────────────────────────────
//
// The area model. One whole cut in two directions at once: columns for the
// first fraction, rows for the second. The overlap is the answer, and the grid
// makes "multiply the tops, multiply the bottoms" something the learner can
// count rather than a rule to memorise.

import { formatFraction, multiplyFractions } from '../../fractionRatioMath.js'
import { gridCells, hatchLines } from '../../fractionRatioGeometry.js'
import { bracket, label } from '../stage.js'

export const MULTIPLY_STEPS = [
  { id: 'columns', label: 'First fraction' },
  { id: 'rows', label: 'Second fraction' },
  { id: 'overlap', label: 'Count the overlap' },
]

// Dropped low enough that the column bracket's label clears the title above it.
const GRID = { x: 84, y: 80, width: 210, height: 150 }

export function deriveMultiply(values, { step }) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values
  const result = multiplyFractions(numeratorA, denominatorA, numeratorB, denominatorB)

  const cells = gridCells({ ...GRID, columns: denominatorA, rows: denominatorB })
  const showRows = step !== 'columns'
  const showOverlap = step === 'overlap'

  const inColumns = cell => cell.column < numeratorA
  const inRows = cell => cell.row < numeratorB

  const sceneCells = cells.map((cell) => {
    const overlapping = showOverlap && inColumns(cell) && inRows(cell)
    let fillTone = 'none'

    if (overlapping) fillTone = 'overlap'
    else if (showRows && inRows(cell) && inColumns(cell)) fillTone = 'shadedSoft'
    else if (showRows && inRows(cell)) fillTone = 'shadedAltSoft'
    else if (inColumns(cell)) fillTone = 'shadedSoft'

    return {
      id: `cell-${cell.index}`,
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: cell.height,
      fillTone,
      edgeTone: 'divider',
      hatch: overlapping ? hatchLines(cell) : null,
    }
  })

  const columnWidth = GRID.width / denominatorA
  const rowHeight = GRID.height / denominatorB

  return {
    cells: sceneCells,

    brackets: [
      bracket({
        id: 'columns-span',
        x1: GRID.x,
        x2: GRID.x + columnWidth * numeratorA,
        y: GRID.y - 10,
        text: formatFraction(numeratorA, denominatorA),
        tone: 'shaded',
      }),
      ...(showRows
        ? [{
            id: 'rows-span',
            vertical: true,
            y1: GRID.y,
            y2: GRID.y + rowHeight * numeratorB,
            x: GRID.x - 12,
            text: formatFraction(numeratorB, denominatorB),
            tone: 'shadedAlt',
          }]
        : []),
    ],

    labels: [
      label({
        id: 'title',
        x: 180,
        y: 32,
        text: `${formatFraction(numeratorA, denominatorA)} × ${formatFraction(numeratorB, denominatorB)}`,
        tone: 'textPrimary',
        size: 'value',
      }),
      ...(showOverlap
        ? [label({
            id: 'overlap-count',
            x: 180,
            y: GRID.y + GRID.height + 28,
            text: `${result.raw.numerator} overlapping parts out of ${result.raw.denominator}`,
            tone: 'link',
            size: 'caption',
          })]
        : []),
    ],

    // No result glyph: the status heading already states the answer, and a
    // second copy under the grid competed with the count line for the same
    // strip of canvas.
    fractions: [],

    status: multiplyStatus(step, values, result),
  }
}

function multiplyStatus(step, values, result) {
  const { numeratorA, denominatorA, numeratorB, denominatorB } = values

  if (step === 'columns') {
    return {
      heading: `Split the whole into ${denominatorA} columns`,
      calculation: [`Shade ${numeratorA} of them — that is ${formatFraction(numeratorA, denominatorA)}`],
      explanation: 'The square is one whole. Cutting it downwards shows the first fraction.',
    }
  }

  if (step === 'rows') {
    return {
      heading: `Now cut it into ${denominatorB} rows`,
      calculation: [`Shade ${numeratorB} of them — that is ${formatFraction(numeratorB, denominatorB)}`],
      explanation: 'The same whole is now cut both ways. Multiplying means asking for a fraction of a fraction.',
    }
  }

  return {
    heading: `${formatFraction(result.simplified.numerator, result.simplified.denominator)}`,
    calculation: [
      `${numeratorA} × ${numeratorB} = ${result.raw.numerator}`,
      `${denominatorA} × ${denominatorB} = ${result.raw.denominator}`,
      result.wasSimplified
        ? `${formatFraction(result.raw.numerator, result.raw.denominator)} = ${formatFraction(result.simplified.numerator, result.simplified.denominator)}`
        : null,
    ].filter(Boolean),
    explanation: 'The hatched squares are in both fractions at once. Counting them is the same as multiplying across.',
  }
}
