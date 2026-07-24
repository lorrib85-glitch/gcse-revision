// ─── proportionScale ─────────────────────────────────────────────────────────
//
// Scaling both sides together, shown as two rows of identical unit blocks. The
// ratio between the rows is the invariant here — not the size of a whole — so
// what the learner watches is that the shape of the pair never changes however
// far it is scaled. A recipe is the carrier because getting it wrong is
// something anyone can taste.

import { clamp } from '../fractionRatioGeometry.js'
import { formatNumber, simplifyRatio } from '../fractionRatioMath.js'
import { WHOLE, label } from './stage.js'

const TOP_Y = 96
const BOTTOM_Y = 172
const BLOCK_HEIGHT = 34
const MAX_FACTOR = 6

// The recipe being scaled. Both quantities are counted in whole units so the
// blocks on screen, the numbers in the status line and the ratio note all speak
// about the same thing — mixing a count with a weight would make the ratio note
// compare two different scales.
const INGREDIENTS = [
  { id: 'eggs', label: 'Eggs', base: 2, unit: ' eggs', tone: 'shareA' },
  { id: 'flour', label: 'Cups of flour', base: 3, unit: ' cups', tone: 'shareB' },
]

const MAX_BLOCKS = Math.max(...INGREDIENTS.map(item => item.base)) * MAX_FACTOR
const BLOCK_WIDTH = WHOLE.width / MAX_BLOCKS
const BLOCK_GAP = 3

const proportionScale = {
  id: 'proportionScale',
  accessibilityLabel: 'Direct proportion scaling explorer',
  keyFact: 'In direct proportion every quantity is multiplied by the same scale factor, so the ratio between them never changes.',
  canvas: { width: 360, height: 268 },
  interactive: true,

  controls: [
    {
      id: 'factor',
      label: 'Scale factor',
      min: 1,
      max: MAX_FACTOR,
      step: 1,
      stepper: true,
      valueText: values => `scaled by ${values.factor}`,
      valueFromPointer: (point) => {
        const ratio = clamp((point.x - WHOLE.x) / WHOLE.width, 0, 1)
        return clamp(Math.round(ratio * MAX_FACTOR) || 1, 1, MAX_FACTOR)
      },
    },
  ],

  initialValues: { factor: 3 },

  derive(values) {
    const factor = values.factor
    const rows = INGREDIENTS.map((ingredient, rowIndex) => ({
      ingredient,
      y: rowIndex === 0 ? TOP_Y : BOTTOM_Y,
      count: ingredient.base * factor,
    }))

    const simplified = simplifyRatio(rows.map(row => row.count))

    return {
      // Unit blocks rather than a continuous bar: scaling by 3 should look
      // like three copies of the original, not a longer smear.
      cells: rows.flatMap(row => (
        Array.from({ length: row.count }, (_, index) => ({
          id: `${row.ingredient.id}-${index}`,
          x: WHOLE.x + index * BLOCK_WIDTH,
          y: row.y,
          width: BLOCK_WIDTH - BLOCK_GAP,
          height: BLOCK_HEIGHT,
          fillTone: `${row.ingredient.tone}Soft`,
          edgeTone: row.ingredient.tone,
          // The original recipe stays distinguishable inside the scaled one,
          // so "×3" reads as three copies of something already understood.
          dashed: index >= row.ingredient.base,
        }))
      )),

      // No per-row "original" bracket: it landed on the row label, and the
      // solid-versus-dashed blocks already mark the original recipe inside the
      // scaled one. One caption says it once instead of twice per row.
      labels: [
        label({ id: 'title', x: 180, y: 34, text: factor === 1 ? 'The original recipe' : `Recipe × ${factor}`, tone: 'textPrimary', size: 'value' }),
        ...(factor > 1
          ? [label({ id: 'original-key', x: 180, y: 54, text: 'Solid blocks are the original recipe', tone: 'textMuted', size: 'caption' })]
          : []),
        ...rows.map(row => label({
          id: `${row.ingredient.id}-label`,
          x: WHOLE.x,
          y: row.y - 22,
          text: `${row.ingredient.label}: ${formatNumber(row.count)}`,
          tone: row.ingredient.tone,
          size: 'label',
          anchor: 'start',
        })),
        label({
          id: 'ratio-note',
          x: 180,
          y: 238,
          text: `${rows[0].count} : ${rows[1].count}  =  ${simplified.parts[0]} : ${simplified.parts[1]}`,
          tone: 'link',
          size: 'value',
        }),
      ],

      handles: [{
        controlId: 'factor',
        x: clamp(WHOLE.x + (WHOLE.width * factor) / MAX_FACTOR, WHOLE.x, WHOLE.x + WHOLE.width),
        y: (TOP_Y + BOTTOM_Y + BLOCK_HEIGHT) / 2,
      }],

      status: {
        heading: rows.map(row => `${formatNumber(row.count)}${row.ingredient.unit}`).join(' and '),
        calculation: rows.map(row => (
          `${row.ingredient.label}: ${row.ingredient.base} × ${factor} = ${formatNumber(row.count)}`
        )),
        explanation: `Both quantities were multiplied by ${factor}, so the ratio is still ${simplified.parts[0]} : ${simplified.parts[1]} and the recipe still works.`,
      },
    }
  },
}

export default proportionScale
