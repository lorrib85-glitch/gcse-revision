// ─── ratioShare ──────────────────────────────────────────────────────────────
//
// Ratio drawn on the same bar as a fraction, which is the whole point of the
// engine: 3 : 2 and 3/5 are the same picture read two ways. A ratio has no
// unshaded remainder — every part belongs to somebody — so the shares use their
// own colour roles rather than the shaded/unshaded pair a fraction uses.

import { boundaryX, partsFromX, roundTo } from '../fractionRatioGeometry.js'
import { formatFraction, formatNumber, shareAmount, simplifyRatio } from '../fractionRatioMath.js'
import { bar, barMidY, bracket, fractionGlyph, label, segment } from './stage.js'

const BAR_Y = 92
const BAR_HEIGHT = 54

// Two decimals, not four. A share of 6.6667 is arithmetically right and
// pedagogically wrong — real ratio questions divide exactly, and when a
// learner's chosen numbers do not, the status line says so rather than
// hiding it behind a long decimal.
function formatShare(value) {
  return formatNumber(roundTo(value, 2))
}

const ratioShare = {
  id: 'ratioShare',
  accessibilityLabel: 'Ratio as shares of an amount',
  keyFact: 'A ratio splits an amount into equal shares. Add the parts to find how many shares there are, divide to find one share, then multiply.',
  canvas: { width: 360, height: 288 },
  interactive: true,

  controls: [
    {
      id: 'shareA',
      label: 'First share',
      min: 1,
      max: 8,
      step: 1,
      stepper: true,
      valueText: values => `${values.shareA} to ${values.shareB}`,
      valueFromPointer: (point, values) => {
        const total = values.shareA + values.shareB
        const parts = partsFromX(bar({ id: 'x', y: BAR_Y, parts: total }), point.x)
        return Math.max(Math.min(parts, total - 1), 1)
      },
    },
    {
      id: 'shareB',
      label: 'Second share',
      min: 1,
      max: 8,
      step: 1,
      stepper: true,
      valueText: values => `${values.shareA} to ${values.shareB}`,
    },
    {
      id: 'total',
      label: 'Amount to share',
      min: 2,
      max: 240,
      step: 1,
      stepper: true,
      valueText: values => `sharing ${values.total}`,
    },
  ],

  initialValues: { shareA: 3, shareB: 2, total: 40 },

  derive(values) {
    const { shareA, shareB, total } = values
    const parts = [shareA, shareB]
    const totalParts = shareA + shareB
    const share = shareAmount(total, parts)
    const simplified = simplifyRatio(parts)
    const canSimplify = simplified.divisor > 1

    const shareBar = bar({
      id: 'shares',
      y: BAR_Y,
      height: BAR_HEIGHT,
      parts: totalParts,
      segments: [
        segment(0, shareA, 'shareASoft', 'shareA'),
        segment(shareA, totalParts, 'shareBSoft', 'shareB'),
      ],
    })

    const splitX = boundaryX(shareBar, shareA)

    return {
      bars: [shareBar],

      brackets: [
        bracket({
          id: 'share-a',
          x1: shareBar.x,
          x2: splitX,
          y: BAR_Y - 10,
          text: formatShare(share.shares[0]),
          tone: 'shareA',
        }),
        bracket({
          id: 'share-b',
          x1: splitX,
          x2: shareBar.x + shareBar.width,
          y: BAR_Y - 10,
          text: formatShare(share.shares[1]),
          tone: 'shareB',
        }),
        bracket({
          id: 'one-share',
          x1: shareBar.x,
          x2: boundaryX(shareBar, 1),
          y: BAR_Y + BAR_HEIGHT + 8,
          text: `1 share = ${formatShare(share.unit)}`,
          tone: 'textMuted',
          below: true,
        }),
      ],

      fractions: [
        fractionGlyph({
          id: 'as-fraction-a',
          x: 108,
          y: 244,
          numerator: shareA,
          denominator: totalParts,
          tone: 'shareA',
          size: 'medium',
        }),
        fractionGlyph({
          id: 'as-fraction-b',
          x: 252,
          y: 244,
          numerator: shareB,
          denominator: totalParts,
          tone: 'shareB',
          size: 'medium',
        }),
      ],

      labels: [
        label({ id: 'title', x: 180, y: 34, text: `${shareA} : ${shareB} of ${total}`, tone: 'textPrimary', size: 'value' }),
        label({ id: 'total-parts', x: 180, y: 52, text: `${totalParts} equal shares`, tone: 'textMuted', size: 'caption' }),
        label({ id: 'fraction-caption', x: 180, y: 208, text: 'The same split, written as fractions', tone: 'textMuted', size: 'caption' }),
      ],

      handles: [{ controlId: 'shareA', x: splitX, y: barMidY(shareBar) }],

      status: {
        heading: `${formatShare(share.shares[0])} and ${formatShare(share.shares[1])}`,
        calculation: [
          `${shareA} + ${shareB} = ${totalParts} shares`,
          `${total} ÷ ${totalParts} = ${formatShare(share.unit)} per share`,
          `${formatShare(share.unit)} × ${shareA} = ${formatShare(share.shares[0])}, ${formatShare(share.unit)} × ${shareB} = ${formatShare(share.shares[1])}`,
        ],
        explanation: !share.isExact
          ? `${total} does not split into ${totalParts} whole shares, so these amounts are rounded. Exam questions choose a total that divides exactly.`
          : canSimplify
            ? `${shareA} : ${shareB} simplifies to ${simplified.parts[0]} : ${simplified.parts[1]} — divide both by ${simplified.divisor}. The split is identical.`
            : `${shareA} : ${shareB} is already in its simplest form. As a fraction the first share is ${formatFraction(shareA, totalParts)} of the whole.`,
      },
    }
  },
}

export default ratioShare
