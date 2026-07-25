// ─── Preset: plotPoint ───────────────────────────────────────────────────────
//
// One GCSE idea: a coordinate is a position, read across first and then up or
// down. Three focus modes share one scene builder because they are the same
// figure asked about differently — plotting it, reading it, or naming which
// quadrant it lives in.

import { snapToStep } from '../coordinatePlaneGeometry.js'
import {
  formatCoordinate,
  quadrantOf,
  quadrantRoman,
  quadrantSigns,
} from '../coordinatePlaneMath.js'

// Quadrant label positions in model space, one per quadrant, kept clear of the
// axes so they never sit under a plotted point's guide lines.
const QUADRANT_ANCHORS = [
  { quadrant: 1, x: 3.6, y: 4.4 },
  { quadrant: 2, x: -3.6, y: 4.4 },
  { quadrant: 3, x: -3.6, y: -4.4 },
  { quadrant: 4, x: 3.6, y: -4.4 },
]

function horizontalPhrase(x) {
  if (x === 0) return 'Stay on the y-axis (x is 0).'
  const direction = x > 0 ? 'right' : 'left'
  const sign = x > 0 ? 'positive' : 'negative'
  return `Move ${Math.abs(x)} units to the ${direction} (${sign} x).`
}

function verticalPhrase(y) {
  if (y === 0) return 'Stay on the x-axis (y is 0).'
  const direction = y > 0 ? 'up' : 'down'
  const sign = y > 0 ? 'positive' : 'negative'
  return `Move ${Math.abs(y)} units ${direction} (${sign} y).`
}

function positionSentence(x, y) {
  const quadrant = quadrantOf(x, y)
  if (quadrant) {
    const signs = quadrantSigns(quadrant).replace('(', '').replace(')', '')
    const [xSign, ySign] = signs.split(', ')
    const word = sign => (sign === '+' ? 'positive' : 'negative')
    return `Quadrant ${quadrantRoman(quadrant)}: x ${word(xSign)}, y ${word(ySign)}.`
  }
  if (x === 0 && y === 0) return 'The origin — where both axes meet.'
  if (x === 0) return 'On the y-axis, so x is 0 and there is no quadrant.'
  return 'On the x-axis, so y is 0 and there is no quadrant.'
}

const plotPointPreset = {
  id: 'plotPoint',
  accessibilityLabel: 'Coordinate plane with a movable point',
  keyFact: 'A coordinate gives a position: across first, then up or down.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -6, max: 6, step: 1 },
  yAxis: { min: -6, max: 6, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: ['plot', 'read', 'quadrants'],
  defaultFocus: 'plot',
  defaultActiveId: 'p',
  capabilities: {},

  initialValues: { x: 3, y: -2 },
  controls: [
    {
      id: 'x',
      label: 'x coordinate',
      min: -6,
      max: 6,
      step: 1,
      valueText: values => `x equals ${values.x}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
    {
      id: 'y',
      label: 'y coordinate',
      min: -6,
      max: 6,
      step: 1,
      valueText: values => `y equals ${values.y}`,
      valueFromPointer: point => snapToStep(point.modelY, 1),
    },
  ],

  derive(values, { focus, activeId, showGuides }) {
    const { x, y } = values
    const isActive = showGuides !== 'none'
      && (showGuides === 'all' || activeId === 'p')

    const points = [{
      id: 'p',
      x,
      y,
      text: formatCoordinate({ x, y }),
      shortText: 'P',
      role: 'object',
      tier: isActive ? 'active' : 'related',
      focusable: true,
    }]

    if (focus === 'quadrants') {
      for (const anchor of QUADRANT_ANCHORS) {
        points.push({
          id: `quadrant-${anchor.quadrant}`,
          x: anchor.x,
          y: anchor.y,
          text: `${quadrantRoman(anchor.quadrant)}  ${quadrantSigns(anchor.quadrant)}`,
          shortText: quadrantRoman(anchor.quadrant),
          role: 'textMuted',
          tier: 'context',
          focusable: false,
        })
      }
    }

    // Guide lines belong to the active point alone (spec section 2).
    const guides = isActive
      ? [
          { id: 'guide-x', from: { x, y: 0 }, to: { x, y }, role: 'guideLine' },
          { id: 'guide-y', from: { x: 0, y }, to: { x, y }, role: 'guideLine' },
        ].filter(guide => guide.from.x !== guide.to.x || guide.from.y !== guide.to.y)
      : []

    return {
      shapes: [],
      points,
      guides,
      handles: [{ controlId: 'x', x, y }],
      status: {
        heading: formatCoordinate({ x, y }),
        calculation: [horizontalPhrase(x), verticalPhrase(y)],
        explanation: positionSentence(x, y),
      },
    }
  },

  describe(values, { focus } = {}) {
    const { x, y } = values
    const base = `A coordinate plane with the point ${formatCoordinate({ x, y })} plotted.`
    const place = positionSentence(x, y)
    return focus === 'quadrants'
      ? `${base} The four quadrants are labelled. ${place}`
      : `${base} ${place}`
  },
}

export default plotPointPreset
