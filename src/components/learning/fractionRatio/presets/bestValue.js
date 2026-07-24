// ─── bestValue ───────────────────────────────────────────────────────────────
//
// Two packs that cannot be compared until they are put on a common unit. The
// bars are drawn to scale by quantity, so the bigger pack visibly *is* bigger
// and the question "but is it better value?" has to be answered by dividing
// rather than by looking.
//
// The basis toggle is the teaching point rather than a display option: price
// per gram and grams per pound are different numbers, one wants a low answer
// and one a high answer, and they must agree. A learner who has seen them agree
// stops guessing which way round to divide.

import { bestValueComparison, formatMoney, formatNumber } from '../fractionRatioMath.js'
import { WHOLE, label } from './stage.js'

// Each pack gets a block of its own — name and rate on one line, pack detail
// beneath, then the bar. Spanning brackets under each bar put the label of one
// pack on top of the name of the next.
const TOP_Y = 100
const BOTTOM_Y = 200
const BAR_HEIGHT = 42

const PRODUCTS = [
  { id: 'a', label: 'Pack A', quantity: 500, price: 6, unit: 'g', tone: 'shareA' },
  { id: 'b', label: 'Pack B', quantity: 750, price: 8.4, unit: 'g', tone: 'shareB' },
]

const MAX_QUANTITY = Math.max(...PRODUCTS.map(product => product.quantity))
const PER_UNIT = 100

const bestValue = {
  id: 'bestValue',
  accessibilityLabel: 'Best value comparison',
  keyFact: 'To compare value, put both products on the same unit — either price per amount or amount per pound. Both methods must give the same verdict.',
  canvas: { width: 360, height: 288 },
  interactive: true,

  methods: [
    { id: 'perQuantity', label: `Price per ${PER_UNIT} g` },
    { id: 'perPrice', label: 'Grams per £1' },
  ],

  controls: [],
  initialValues: {},

  derive(values, { method = 'perQuantity' } = {}) {
    const comparison = bestValueComparison(PRODUCTS[0], PRODUCTS[1], { basis: method })
    const perQuantity = method === 'perQuantity'

    const rows = PRODUCTS.map((product, index) => {
      const rate = comparison.rates[index]
      const displayRate = perQuantity ? rate * PER_UNIT : rate
      return {
        product,
        index,
        y: index === 0 ? TOP_Y : BOTTOM_Y,
        width: WHOLE.width * (product.quantity / MAX_QUANTITY),
        rate,
        rateText: perQuantity
          ? `${formatMoney(displayRate)} per ${PER_UNIT} g`
          : `${formatNumber(Math.round(displayRate))} g per £1`,
        isBetter: comparison.betterIndex === index,
      }
    })

    const winner = comparison.betterIndex == null ? null : rows[comparison.betterIndex]

    return {
      cells: rows.map(row => ({
        id: `pack-${row.product.id}`,
        x: WHOLE.x,
        y: row.y,
        width: row.width,
        height: BAR_HEIGHT,
        fillTone: row.isBetter ? `${row.product.tone}Soft` : 'ghost',
        edgeTone: row.product.tone,
      })),

      labels: [
        label({ id: 'title', x: 180, y: 34, text: 'Which is better value?', tone: 'textPrimary', size: 'value' }),
        ...rows.map(row => label({
          id: `${row.product.id}-name`,
          x: WHOLE.x,
          y: row.y - 36,
          text: row.product.label,
          tone: row.product.tone,
          size: 'label',
          anchor: 'start',
        })),
        ...rows.map(row => label({
          id: `${row.product.id}-rate`,
          x: WHOLE.x + WHOLE.width,
          y: row.y - 36,
          text: row.rateText,
          tone: row.isBetter ? 'link' : 'textMuted',
          size: row.isBetter ? 'value' : 'caption',
          anchor: 'end',
        })),
        ...rows.map(row => label({
          id: `${row.product.id}-detail`,
          x: WHOLE.x,
          y: row.y - 16,
          text: `${row.product.quantity} ${row.product.unit} for ${formatMoney(row.product.price)}`,
          tone: 'textMuted',
          size: 'caption',
          anchor: 'start',
        })),
        label({
          id: 'basis-note',
          x: 180,
          y: 268,
          text: perQuantity ? 'Lower is better — you pay less for the same amount' : 'Higher is better — you get more for the same money',
          tone: 'textMuted',
          size: 'caption',
        }),
      ],

      status: {
        heading: winner ? `${winner.product.label} is better value` : 'Exactly the same value',
        calculation: rows.map(row => (
          perQuantity
            ? `${row.product.label}: ${formatMoney(row.product.price)} ÷ ${row.product.quantity / PER_UNIT} = ${row.rateText}`
            : `${row.product.label}: ${row.product.quantity} ÷ ${formatMoney(row.product.price)} = ${row.rateText}`
        )),
        explanation: winner
          ? 'Both methods pick the same pack — it does not matter which way round you divide, as long as you compare like with like.'
          : 'Both packs work out at the same rate, so neither is better value.',
      },
    }
  },
}

export default bestValue
