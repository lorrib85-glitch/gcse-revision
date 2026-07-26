// ─── Preset: midpoint ────────────────────────────────────────────────────────
//
// The midpoint formula is worth deriving, not reciting. The two x-values are
// bracketed together against the x-axis and the two y-values against the
// y-axis, so the learner watches two independent averages meet at a point. The
// formula is then read off the picture.

import { snapToStep } from '../coordinatePlaneGeometry.js'
import { formatCoordinate, midpointOf } from '../coordinatePlaneMath.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

function averageLine(axis, first, second, result) {
  return `${axis}: (${signed(first)} + ${signed(second)}) ÷ 2 = ${signed(result)}`
}

function endpointControl(id, label) {
  return {
    id,
    label,
    min: -6,
    max: 6,
    step: 1,
    valueText: values => `${label} equals ${values[id]}`,
    valueFromPointer: point => snapToStep(
      id.endsWith('x') ? point.modelX : point.modelY,
      1,
    ),
  }
}

const midpointPreset = {
  id: 'midpoint',
  accessibilityLabel: 'Coordinate plane showing the midpoint of a line segment',
  keyFact: 'The midpoint averages the x-values and the y-values separately.',
  instruction: 'Drag either endpoint to move the line.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -6, max: 6, step: 1 },
  yAxis: { min: -6, max: 6, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: 'a',
  capabilities: {},

  initialValues: { ax: -3, ay: 1, bx: 5, by: 5 },
  controls: [
    endpointControl('ax', 'Point A x'),
    endpointControl('ay', 'Point A y'),
    endpointControl('bx', 'Point B x'),
    endpointControl('by', 'Point B y'),
  ],

  derive(values, { activeId, showGuides }) {
    const a = { x: values.ax, y: values.ay }
    const b = { x: values.bx, y: values.by }
    const m = midpointOf(a, b)

    const tierFor = id => {
      if (showGuides === 'none') return 'related'
      if (showGuides === 'all') return 'active'
      return activeId === id ? 'active' : 'related'
    }

    const shapes = [
      {
        id: 'segment',
        path: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
        strokeRole: 'object',
        modelPath: true,
      },
    ]

    // One bracket per pairing — x-values together, y-values together.
    //
    // Each is filtered independently. When the paired values are equal the
    // bracket would collapse to a zero-length dashed path, which renders as a
    // stray dot on the axis rather than as meaning. The calculation line still
    // shows the average of the two equal values, so nothing is lost by
    // omitting it.
    if (a.x !== b.x) {
      shapes.push({
        id: 'bracket-x',
        path: `M ${a.x} 0 L ${b.x} 0`,
        strokeRole: 'ruleLine',
        dashed: true,
        modelPath: true,
      })
    }

    if (a.y !== b.y) {
      shapes.push({
        id: 'bracket-y',
        path: `M 0 ${a.y} L 0 ${b.y}`,
        strokeRole: 'ruleLine',
        dashed: true,
        modelPath: true,
      })
    }

    const points = [
      {
        id: 'a',
        ...a,
        text: `A ${formatCoordinate(a)}`,
        shortText: 'A',
        role: 'object',
        tier: tierFor('a'),
        focusable: true,
      },
      {
        id: 'b',
        ...b,
        text: `B ${formatCoordinate(b)}`,
        shortText: 'B',
        role: 'object',
        tier: tierFor('b'),
        focusable: true,
      },
      {
        id: 'm',
        ...m,
        text: `M ${formatCoordinate(m)}`,
        shortText: 'M',
        role: 'image',
        tier: tierFor('m'),
        focusable: true,
      },
    ]

    const activePoint = points.find(point => point.tier === 'active')
    const guides = activePoint && showGuides !== 'none'
      ? [
          {
            id: 'guide-x',
            from: { x: activePoint.x, y: 0 },
            to: { x: activePoint.x, y: activePoint.y },
            role: 'guideLine',
          },
          {
            id: 'guide-y',
            from: { x: 0, y: activePoint.y },
            to: { x: activePoint.x, y: activePoint.y },
            role: 'guideLine',
          },
        ]
      : []

    return {
      shapes,
      points,
      guides,
      handles: [
        { controlId: 'ax', controlIds: ['ax', 'ay'], pointId: 'a', x: a.x, y: a.y },
        { controlId: 'bx', controlIds: ['bx', 'by'], pointId: 'b', x: b.x, y: b.y },
      ],
      status: {
        heading: formatCoordinate(m),
        calculation: [
          averageLine('x', a.x, b.x, m.x),
          averageLine('y', a.y, b.y, m.y),
        ],
        explanation: 'Average the x-values, then average the y-values. Each pair is worked out on its own.',
      },
    }
  },

  describe(values) {
    const a = { x: values.ax, y: values.ay }
    const b = { x: values.bx, y: values.by }
    const m = midpointOf(a, b)
    return `A line segment from A ${formatCoordinate(a)} to B ${formatCoordinate(b)}, with midpoint M ${formatCoordinate(m)}.`
  },
}

export default midpointPreset
