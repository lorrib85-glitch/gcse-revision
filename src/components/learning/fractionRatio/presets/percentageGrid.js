// ─── percentageGrid ──────────────────────────────────────────────────────────
//
// One hundred squares, because "per cent" means "per hundred" and a grid of a
// hundred makes that definition countable rather than assertable. The same
// quantity is shown simultaneously as a percentage, a fraction and a decimal,
// which is the whole of fraction–decimal–percentage conversion in one picture.

import { clamp, gridCells } from '../fractionRatioGeometry.js'
import { formatFraction, simplifyFraction, toDecimal } from '../fractionRatioMath.js'
import { fractionGlyph, label } from './stage.js'

const GRID = { x: 80, y: 52, width: 200, height: 200, columns: 10, rows: 10 }
const CELL = GRID.width / GRID.columns

const percentageGrid = {
  id: 'percentageGrid',
  accessibilityLabel: 'Percentage grid of one hundred squares',
  keyFact: 'Per cent means per hundred. A percentage, a fraction out of 100 and a decimal are three ways of writing the same amount.',
  canvas: { width: 360, height: 330 },
  interactive: true,

  controls: [
    {
      id: 'percent',
      label: 'Per cent',
      min: 0,
      max: 100,
      step: 1,
      stepper: true,
      valueText: values => `${values.percent} per cent`,
      // Row-major: the pointer's row decides the tens, its column the units,
      // so dragging fills the grid the way it reads.
      valueFromPointer: (point) => {
        const column = clamp(Math.ceil((point.x - GRID.x) / CELL), 0, GRID.columns)
        const row = clamp(Math.floor((point.y - GRID.y) / CELL), 0, GRID.rows - 1)
        return clamp(row * GRID.columns + column, 0, 100)
      },
    },
  ],

  initialValues: { percent: 45 },

  derive(values) {
    const { percent } = values
    const cells = gridCells(GRID)
    const simplified = simplifyFraction(percent, 100)

    const filledIndex = Math.max(percent - 1, 0)
    const frontCell = cells[Math.min(filledIndex, cells.length - 1)]

    return {
      cells: cells.map(cell => ({
        id: `cell-${cell.index}`,
        x: cell.x,
        y: cell.y,
        width: cell.width,
        height: cell.height,
        fillTone: cell.index < percent ? 'shadedSoft' : 'none',
        edgeTone: cell.index < percent ? 'shaded' : 'divider',
      })),

      labels: [
        label({ id: 'title', x: 180, y: 32, text: '100 equal squares', tone: 'textMuted', size: 'eyebrow' }),
        label({ id: 'fdp-caption', x: 180, y: 274, text: 'Three ways to write the same amount', tone: 'textMuted', size: 'caption' }),
        label({ id: 'percent-value', x: 62, y: 306, text: `${percent}%`, tone: 'shaded', size: 'value' }),
        label({ id: 'decimal-value', x: 298, y: 306, text: String(toDecimal(percent, 100)), tone: 'shadedAlt', size: 'value' }),
      ],

      fractions: [
        fractionGlyph({
          id: 'as-fraction',
          x: 180,
          y: 306,
          numerator: percent,
          denominator: 100,
          tone: 'link',
          size: 'small',
        }),
      ],

      handles: percent > 0
        ? [{ controlId: 'percent', x: frontCell.x + frontCell.width, y: frontCell.y + frontCell.height / 2 }]
        : [{ controlId: 'percent', x: GRID.x, y: GRID.y + CELL / 2 }],

      status: {
        heading: `${percent}% = ${formatFraction(percent, 100)} = ${toDecimal(percent, 100)}`,
        calculation: [
          `${percent} squares shaded out of 100`,
          percent > 0 && simplified.divisor > 1
            ? `${formatFraction(percent, 100)} simplifies to ${formatFraction(simplified.numerator, simplified.denominator)}`
            : null,
        ].filter(Boolean),
        explanation: 'Per cent means per hundred. To turn a percentage into a decimal, divide by 100 — the grid shows why.',
      },
    }
  },
}

export default percentageGrid
