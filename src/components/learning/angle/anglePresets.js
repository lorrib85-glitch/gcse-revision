// ─── AngleExplore presets ────────────────────────────────────────────────────
//
// Each preset is one GCSE angle fact expressed as a scene: fixed rays, one
// learner-controlled value (a draggable ray, polygon side count, triangle type,
// or the apex of a triangle) and the sectors, labels and status line derived
// from that value. AngleExplore renders the scene and owns the interaction;
// questions, predictions and marking belong to the page that composes it.
//
// Tones are semantic role names resolved by AngleExplore through
// angleVisualRoles.js — presets never name a colour directly. Equal angles
// share a sector tone so equality reads as colour before words.

import {
  classifyAngle,
  clamp,
  interiorAngle,
  pointerAngle,
  polarPoint,
  sectorMidpoint,
  triangleAngles,
  vectorAngle,
} from './angleGeometry.js'
import {
  polygonPath,
  regularPolygonPoints,
  sideTickPath,
} from '../geometry/shapeGeometry.js'

const angleTypes = {
  id: 'angleTypes',
  accessibilityLabel: 'Interactive angle explorer',
  keyFact: 'Angles are named by their size: acute, right, obtuse, straight, reflex and full turn.',
  canvas: { width: 360, height: 220 },
  interactive: true,
  initialValue: 65,
  min: 10,
  max: 360,
  step: 5,
  snapTargets: [90, 180, 270, 360],
  handleLabel: 'Angle size',
  valueText: v => `${v} degrees — ${classifyAngle(v).label}`,
  valueFromPointer: (pt) => {
    const angle = pointerAngle(170, 110, pt.x, pt.y)
    return angle === 0 ? 360 : angle
  },
  derive(v) {
    const vx = 170
    const vy = 110
    const arm = 92
    const cls = classifyAngle(v)
    const isFullTurn = v === 360
    const labelAt = isFullTurn
      ? { x: vx, y: vy - 60 }
      : sectorMidpoint(vx, vy, 0, v, v < 40 ? 66 : 58)
    const endPoint = polarPoint(vx, vy, v, arm)

    return {
      rays: [
        { id: 'arm-base', ...rayFrom(vx, vy, 0, arm), tone: 'structure', arrow: true },
        { id: 'arm-drag', ...rayFrom(vx, vy, v, arm), tone: 'interaction', arrow: true },
      ],
      sectors: [
        {
          id: 'sector-main', cx: vx, cy: vy, start: 0, end: v, radius: 44, tone: 'A',
          label: { text: `${v}°`, x: labelAt.x, y: labelAt.y },
        },
      ],
      points: isFullTurn
        ? [
            { id: 'point-a', text: 'A', x: endPoint.x + 12, y: endPoint.y - 13 },
            { id: 'point-b', text: 'B', x: vx - 14, y: vy + 17 },
            { id: 'point-c', text: 'C', x: endPoint.x + 12, y: endPoint.y + 13 },
          ]
        : [
            pointLabel('point-a', 'A', vx, vy, v, arm + 14),
            { id: 'point-b', text: 'B', x: vx - 14, y: vy + 17 },
            pointLabel('point-c', 'C', vx, vy, 0, arm + 14),
          ],
      handle: endPoint,
      status: {
        heading: `${cls.label} — ${v}°`,
        headingTone: 'interaction',
        explanation: cls.summary,
      },
    }
  },
}

const straightLine = {
  id: 'straightLine',
  accessibilityLabel: 'Angles on a straight line',
  keyFact: 'Angles on a straight line add up to 180°.',
  canvas: { width: 360, height: 220 },
  interactive: true,
  initialValue: 110,
  min: 15,
  max: 165,
  step: 5,
  snapTargets: [90],
  handleLabel: 'Angle on the straight line',
  valueText: v => `${v} degrees and ${180 - v} degrees`,
  valueFromPointer: pt => pointerAngle(180, 150, pt.x, pt.y),
  derive(v) {
    const vx = 180
    const vy = 150
    const rest = 180 - v
    const rightLabel = sectorMidpoint(vx, vy, 0, v, 64)
    const leftLabel = sectorMidpoint(vx, vy, v, 180, 64)
    return {
      rays: [
        { id: 'line-right', ...rayFrom(vx, vy, 0, 150), tone: 'structure', arrow: true },
        { id: 'line-left', ...rayFrom(vx, vy, 180, 150), tone: 'structure', arrow: true },
        { id: 'arm-drag', ...rayFrom(vx, vy, v, 112), tone: 'interaction', arrow: true },
      ],
      sectors: [
        {
          id: 'sector-right', cx: vx, cy: vy, start: 0, end: v, radius: 40, tone: 'A',
          label: { text: `${v}°`, x: rightLabel.x, y: rightLabel.y },
        },
        {
          id: 'sector-left', cx: vx, cy: vy, start: v, end: 180, radius: 40, tone: 'B',
          label: { text: `${rest}°`, x: leftLabel.x, y: leftLabel.y },
        },
      ],
      points: [
        { id: 'point-a', text: 'A', x: 34, y: vy + 22 },
        { id: 'point-b', text: 'B', x: vx, y: vy + 22 },
        { id: 'point-c', text: 'C', x: 326, y: vy + 22 },
      ],
      handle: polarPoint(vx, vy, v, 112),
      status: {
        heading: `${v}° + ${rest}° = 180°`,
        explanation: 'Angles on a straight line add up to 180°.',
      },
    }
  },
}

const aroundPoint = {
  id: 'aroundPoint',
  accessibilityLabel: 'Angles around a point',
  keyFact: 'Angles around a point add up to 360°.',
  canvas: { width: 360, height: 260 },
  interactive: true,
  initialValue: 130,
  min: 25,
  max: 215,
  step: 5,
  snapTargets: [90, 180],
  handleLabel: 'First angle around the point',
  valueText: v => `${v} degrees, ${240 - v} degrees and 120 degrees`,
  valueFromPointer: pt => pointerAngle(180, 130, pt.x, pt.y),
  derive(v) {
    const vx = 180
    const vy = 130
    const second = 240 - v
    const aLabel = sectorMidpoint(vx, vy, 0, v, 62)
    const bLabel = sectorMidpoint(vx, vy, v, 240, 70)
    const cLabel = sectorMidpoint(vx, vy, 240, 360, 64)
    return {
      rays: [
        { id: 'arm-east', ...rayFrom(vx, vy, 0, 110), tone: 'structure', arrow: true },
        { id: 'arm-fixed', ...rayFrom(vx, vy, 240, 110), tone: 'structure', arrow: true },
        { id: 'arm-drag', ...rayFrom(vx, vy, v, 110), tone: 'interaction', arrow: true },
      ],
      sectors: [
        {
          id: 'sector-a', cx: vx, cy: vy, start: 0, end: v, radius: 38, tone: 'A',
          label: { text: `${v}°`, x: aLabel.x, y: aLabel.y },
        },
        {
          id: 'sector-b', cx: vx, cy: vy, start: v, end: 240, radius: 46, tone: 'B',
          label: { text: `${second}°`, x: bLabel.x, y: bLabel.y },
        },
        {
          id: 'sector-c', cx: vx, cy: vy, start: 240, end: 360, radius: 42, tone: 'C',
          label: { text: '120°', x: cLabel.x, y: cLabel.y },
        },
      ],
      points: [],
      handle: polarPoint(vx, vy, v, 110),
      status: {
        heading: `${v}° + ${second}° + 120° = 360°`,
        explanation: 'Angles around a point add up to 360°.',
      },
    }
  },
}

const verticallyOpposite = {
  id: 'verticallyOpposite',
  accessibilityLabel: 'Vertically opposite angles',
  keyFact: 'When two straight lines cross, vertically opposite angles are equal.',
  canvas: { width: 360, height: 240 },
  interactive: true,
  initialValue: 55,
  min: 20,
  max: 160,
  step: 5,
  snapTargets: [90],
  handleLabel: 'Angle between the crossing lines',
  valueText: v => `${v} degrees, opposite ${v} degrees`,
  valueFromPointer: (pt) => {
    const a = pointerAngle(180, 120, pt.x, pt.y)
    return a > 180 ? a - 180 : a
  },
  derive(v) {
    const vx = 180
    const vy = 120
    const rest = 180 - v
    const labels = [
      { start: 0, end: v, text: `${v}°` },
      { start: v, end: 180, text: `${rest}°` },
      { start: 180, end: 180 + v, text: `${v}°` },
      { start: 180 + v, end: 360, text: `${rest}°` },
    ].map(({ start, end, text }) => ({ ...sectorMidpoint(vx, vy, start, end, 58), text }))
    return {
      rays: [
        { id: 'line-east', ...rayFrom(vx, vy, 0, 150), tone: 'structure', arrow: true },
        { id: 'line-west', ...rayFrom(vx, vy, 180, 150), tone: 'structure', arrow: true },
        { id: 'arm-drag', ...rayFrom(vx, vy, v, 150), tone: 'interaction', arrow: true },
        { id: 'arm-drag-opposite', ...rayFrom(vx, vy, 180 + v, 150), tone: 'interaction', arrow: true },
      ],
      sectors: [
        {
          id: 'sector-1', cx: vx, cy: vy, start: 0, end: v, radius: 34, tone: 'A',
          label: { text: labels[0].text, x: labels[0].x, y: labels[0].y },
        },
        {
          id: 'sector-2', cx: vx, cy: vy, start: v, end: 180, radius: 34, tone: 'B',
          label: { text: labels[1].text, x: labels[1].x, y: labels[1].y },
        },
        {
          id: 'sector-3', cx: vx, cy: vy, start: 180, end: 180 + v, radius: 34, tone: 'A',
          label: { text: labels[2].text, x: labels[2].x, y: labels[2].y },
        },
        {
          id: 'sector-4', cx: vx, cy: vy, start: 180 + v, end: 360, radius: 34, tone: 'B',
          label: { text: labels[3].text, x: labels[3].x, y: labels[3].y },
        },
      ],
      points: [],
      handle: polarPoint(vx, vy, v, 150),
      status: {
        heading: 'Vertically opposite angles are equal',
        explanation: `The two ${v}° angles sit opposite each other — so do the two ${rest}° angles.`,
      },
    }
  },
}

function createParallelLinesPreset(id, relationship) {
  const definitions = {
    corresponding: {
      accessibilityLabel: 'Corresponding angles on parallel lines',
      keyFact: 'Corresponding angles are equal when a transversal crosses parallel lines.',
      heading: 'Corresponding angles are equal',
      explanation: v => `The matching corner angles are both ${v}°.`,
      sectors: ({ top, bottom, value }) => [
        sectorAt('sector-top', top, 0, value, value, 'A'),
        sectorAt('sector-bottom', bottom, 0, value, value, 'A'),
      ],
    },
    alternate: {
      accessibilityLabel: 'Alternate angles on parallel lines',
      keyFact: 'Alternate angles are equal when a transversal crosses parallel lines.',
      heading: 'Alternate angles are equal',
      explanation: v => `The interior angles on opposite sides of the transversal are both ${v}°.`,
      sectors: ({ top, bottom, value }) => [
        sectorAt('sector-top', top, 180, 180 + value, value, 'A'),
        sectorAt('sector-bottom', bottom, 0, value, value, 'A'),
      ],
    },
    coInterior: {
      accessibilityLabel: 'Co-interior angles on parallel lines',
      keyFact: 'Co-interior angles add up to 180° when a transversal crosses parallel lines.',
      heading: v => `${v}° + ${180 - v}° = 180°`,
      explanation: () => 'Co-interior angles on the same side of the transversal are supplementary.',
      sectors: ({ top, bottom, value }) => [
        sectorAt('sector-top', top, 180 + value, 360, 180 - value, 'B'),
        sectorAt('sector-bottom', bottom, 0, value, value, 'A'),
      ],
    },
  }

  const definition = definitions[relationship]

  return {
    id,
    accessibilityLabel: definition.accessibilityLabel,
    keyFact: definition.keyFact,
    canvas: { width: 360, height: 250 },
    interactive: true,
    initialValue: 55,
    min: 25,
    max: 155,
    step: 5,
    snapTargets: [90],
    handleLabel: 'Angle of the transversal',
    valueText: v => `${definition.accessibilityLabel}: ${v} degrees`,
    valueFromPointer: (pt) => {
      const angle = pointerAngle(180, 125, pt.x, pt.y)
      return angle > 180 ? angle - 180 : angle
    },
    derive(v) {
      const center = { x: 180, y: 125 }
      const sin = Math.sin((v * Math.PI) / 180)
      const cot = Math.cos((v * Math.PI) / 180) / (Math.abs(sin) < 0.001 ? 0.001 : sin)
      const top = { x: 180 + 50 * cot, y: 75 }
      const bottom = { x: 180 - 50 * cot, y: 175 }
      const lineStart = polarPoint(center.x, center.y, v + 180, 185)
      const lineEnd = polarPoint(center.x, center.y, v, 185)
      const sectors = definition.sectors({ top, bottom, value: v })

      return {
        shapes: [
          { id: 'parallel-top', path: 'M 30 75 L 330 75', strokeTone: 'structure' },
          { id: 'parallel-bottom', path: 'M 30 175 L 330 175', strokeTone: 'structure' },
          { id: 'parallel-mark-top', path: parallelArrowPath(54, 75), strokeTone: 'sectorB' },
          { id: 'parallel-mark-bottom', path: parallelArrowPath(54, 175), strokeTone: 'sectorB' },
          {
            id: 'transversal',
            path: `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`,
            strokeTone: 'interaction',
          },
        ],
        rays: [],
        sectors,
        points: [],
        handle: lineEnd,
        status: {
          heading: typeof definition.heading === 'function' ? definition.heading(v) : definition.heading,
          explanation: definition.explanation(v),
        },
      }
    },
  }
}

const parallelLines = createParallelLinesPreset('parallelLines', 'corresponding')
const parallelAlternate = createParallelLinesPreset('parallelAlternate', 'alternate')
const parallelCoInterior = createParallelLinesPreset('parallelCoInterior', 'coInterior')

const TRIANGLE_BASE_LEFT = { x: 75, y: 195 }
const TRIANGLE_BASE_RIGHT = { x: 285, y: 195 }
const TRIANGLE_APEX_Y = 62
const TRIANGLE_CENTRE_X = (TRIANGLE_BASE_LEFT.x + TRIANGLE_BASE_RIGHT.x) / 2

const triangle = {
  id: 'triangle',
  accessibilityLabel: 'Angles in a triangle',
  keyFact: 'The interior angles of a triangle add up to 180°.',
  canvas: { width: 360, height: 240 },
  interactive: true,
  initialValue: 145,
  min: 100,
  max: 260,
  step: 5,
  snapTargets: [TRIANGLE_CENTRE_X],
  handleLabel: 'Position of the top vertex',
  valueText: (v) => {
    const [a, b, c] = triangleApexAngles(v)
    return `Angle A ${a} degrees, angle B ${b} degrees, angle C ${c} degrees`
  },
  valueFromPointer: pt => pt.x,
  derive(v) {
    const apex = { x: v, y: TRIANGLE_APEX_Y }
    const left = TRIANGLE_BASE_LEFT
    const right = TRIANGLE_BASE_RIGHT
    const [a, b, c] = triangleApexAngles(v)
    const isIsosceles = v === TRIANGLE_CENTRE_X
    const equalSideMarks = isIsosceles
      ? [
          {
            id: 'triangle-equal-left',
            path: sideTickPath(apex, left),
            strokeTone: 'sectorB',
          },
          {
            id: 'triangle-equal-right',
            path: sideTickPath(apex, right),
            strokeTone: 'sectorB',
          },
        ]
      : []

    return {
      shapes: [
        {
          id: 'triangle-outline',
          path: `M ${apex.x} ${apex.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`,
          fillTone: 'interactionSoft',
          strokeTone: 'structure',
        },
        ...equalSideMarks,
      ],
      rays: [],
      sectors: [
        vertexSector('sector-a', apex, left, right, a, 'A'),
        vertexSector('sector-b', left, apex, right, b, 'B'),
        vertexSector('sector-c', right, apex, left, c, isIsosceles ? 'B' : 'C'),
      ],
      points: [
        { id: 'point-a', text: 'A', x: apex.x, y: apex.y - 14 },
        { id: 'point-b', text: 'B', x: left.x - 16, y: left.y + 6 },
        { id: 'point-c', text: 'C', x: right.x + 16, y: right.y + 6 },
      ],
      handle: apex,
      status: {
        heading: `${a}° + ${b}° + ${c}° = 180°`,
        explanation: isIsosceles
          ? 'Angles in a triangle add up to 180°. Matching side marks show the equal sides.'
          : 'Angles in a triangle add up to 180°.',
      },
    }
  },
}

const TRIANGLE_TYPES = [
  {
    id: 'scalene',
    label: 'Scalene triangle',
    points: [{ x: 145, y: 48 }, { x: 70, y: 180 }, { x: 295, y: 180 }],
    explanation: 'All three sides and all three angles are different.',
  },
  {
    id: 'isosceles',
    label: 'Isosceles triangle',
    points: [{ x: 180, y: 45 }, { x: 80, y: 180 }, { x: 280, y: 180 }],
    equalSides: [[0, 1], [0, 2]],
    equalAngles: [1, 2],
    explanation: 'Two equal sides give two equal base angles.',
  },
  {
    id: 'equilateral',
    label: 'Equilateral triangle',
    points: [{ x: 180, y: 34 }, { x: 90, y: 190 }, { x: 270, y: 190 }],
    equalSides: [[0, 1], [1, 2], [2, 0]],
    equalAngles: [0, 1, 2],
    explanation: 'All three sides are equal, so every angle is 60°.',
  },
  {
    id: 'right',
    label: 'Right-angled triangle',
    points: [{ x: 90, y: 50 }, { x: 90, y: 185 }, { x: 290, y: 185 }],
    explanation: 'One interior angle is exactly 90°.',
  },
  {
    id: 'acute',
    label: 'Acute-angled triangle',
    points: [{ x: 180, y: 45 }, { x: 75, y: 185 }, { x: 292, y: 172 }],
    explanation: 'All three interior angles are less than 90°.',
  },
  {
    id: 'obtuse',
    label: 'Obtuse-angled triangle',
    points: [{ x: 140, y: 110 }, { x: 70, y: 180 }, { x: 295, y: 180 }],
    explanation: 'One interior angle is greater than 90°.',
  },
]

const triangleTypes = {
  id: 'triangleTypes',
  accessibilityLabel: 'Triangle types and properties',
  keyFact: 'Triangles can be classified by their side lengths and by their angles.',
  canvas: { width: 360, height: 250 },
  interactive: true,
  initialValue: 0,
  min: 0,
  max: TRIANGLE_TYPES.length - 1,
  step: 1,
  snapTargets: [],
  handleLabel: 'Triangle type',
  valueText: v => TRIANGLE_TYPES[Math.round(v)]?.label ?? TRIANGLE_TYPES[0].label,
  valueFromPointer: pt => sliderValueFromPointer(pt.x, 54, 306, TRIANGLE_TYPES.length),
  derive(v) {
    const index = clamp(Math.round(v), 0, TRIANGLE_TYPES.length - 1)
    const type = TRIANGLE_TYPES[index]
    const [a, b, c] = type.points
    const angles = triangleAngles(a, b, c)
    const equalAngleSet = new Set(type.equalAngles ?? [])
    const tones = angles.map((_, angleIndex) => {
      if (equalAngleSet.size > 0 && equalAngleSet.has(angleIndex)) return 'B'
      return ['A', 'B', 'C'][angleIndex]
    })
    const equalSideMarks = (type.equalSides ?? []).map(([fromIndex, toIndex], markIndex) => ({
      id: `triangle-type-equal-${markIndex}`,
      path: sideTickPath(type.points[fromIndex], type.points[toIndex]),
      strokeTone: 'sectorB',
    }))

    return {
      shapes: [
        {
          id: 'triangle-type-outline',
          path: `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} Z`,
          fillTone: 'interactionSoft',
          strokeTone: 'structure',
        },
        ...equalSideMarks,
        ...sliderTrackShapes(TRIANGLE_TYPES.length),
      ],
      rays: [],
      sectors: [
        vertexSector('sector-a', a, b, c, angles[0], tones[0]),
        vertexSector('sector-b', b, a, c, angles[1], tones[1]),
        vertexSector('sector-c', c, a, b, angles[2], tones[2]),
      ],
      points: [
        { id: 'point-a', text: 'A', x: a.x, y: a.y - 14 },
        { id: 'point-b', text: 'B', x: b.x - 15, y: b.y + 6 },
        { id: 'point-c', text: 'C', x: c.x + 15, y: c.y + 6 },
      ],
      handle: { x: sliderX(index, TRIANGLE_TYPES.length), y: 225 },
      status: {
        heading: type.label,
        explanation: type.explanation,
      },
    }
  },
}

const quadrilateral = {
  id: 'quadrilateral',
  accessibilityLabel: 'Angles in a quadrilateral',
  keyFact: 'The interior angles of a quadrilateral add up to 360°.',
  canvas: { width: 360, height: 250 },
  interactive: true,
  initialValue: 120,
  min: 85,
  max: 165,
  step: 5,
  snapTargets: [],
  handleLabel: 'Position of the top-left vertex',
  valueText: v => `Top-left vertex position ${v}`,
  valueFromPointer: pt => pt.x,
  derive(v) {
    const points = [
      { x: v, y: 52 },
      { x: 275, y: 75 },
      { x: 300, y: 185 },
      { x: 65, y: 195 },
    ]
    const angles = polygonInteriorAngles(points, 360)

    return {
      shapes: [
        {
          id: 'quadrilateral-outline',
          path: polygonPath(points),
          fillTone: 'interactionSoft',
          strokeTone: 'structure',
        },
      ],
      rays: [],
      sectors: points.map((point, index) => vertexSector(
        `sector-${index}`,
        point,
        points[(index - 1 + points.length) % points.length],
        points[(index + 1) % points.length],
        angles[index],
        ['A', 'B', 'C', 'A'][index],
      )),
      points: points.map((point, index) => ({
        id: `point-${index}`,
        text: String.fromCharCode(65 + index),
        x: point.x + (index === 0 || index === 3 ? -14 : 14),
        y: point.y + (index < 2 ? -12 : 14),
      })),
      handle: points[0],
      status: {
        heading: `${angles.join('° + ')}° = 360°`,
        explanation: 'The interior angles of any quadrilateral add up to 360°.',
      },
    }
  },
}

const polygonSum = {
  id: 'polygonSum',
  accessibilityLabel: 'Interior angle sum of a polygon',
  keyFact: 'A polygon with n sides can be split into n minus 2 triangles from one vertex.',
  canvas: { width: 360, height: 250 },
  interactive: true,
  initialValue: 5,
  min: 3,
  max: 8,
  step: 1,
  snapTargets: [],
  handleLabel: 'Number of polygon sides',
  valueText: v => `${Math.round(v)} sides; interior angle sum ${(Math.round(v) - 2) * 180} degrees`,
  valueFromPointer: pt => 3 + sliderValueFromPointer(pt.x, 54, 306, 6),
  derive(v) {
    const sides = clamp(Math.round(v), 3, 8)
    const points = regularPolygonPoints(sides, 180, 105, 72)
    const diagonals = []
    for (let i = 2; i <= sides - 2; i += 1) {
      diagonals.push({
        id: `polygon-diagonal-${i}`,
        path: `M ${points[0].x} ${points[0].y} L ${points[i].x} ${points[i].y}`,
        strokeTone: 'sectorB',
      })
    }
    const triangles = sides - 2
    const sum = triangles * 180

    return {
      shapes: [
        {
          id: 'polygon-outline',
          path: polygonPath(points),
          fillTone: 'interactionSoft',
          strokeTone: 'structure',
        },
        ...diagonals,
        ...sliderTrackShapes(6),
      ],
      rays: [],
      sectors: [],
      points: [],
      handle: { x: sliderX(sides - 3, 6), y: 225 },
      status: {
        heading: `(${sides} − 2) × 180° = ${sum}°`,
        explanation: `${sides} sides make ${triangles} triangles from one vertex.`,
      },
    }
  },
}

const regularPolygon = {
  id: 'regularPolygon',
  accessibilityLabel: 'Angles in a regular polygon',
  keyFact: 'In a regular polygon, all sides and all interior angles are equal.',
  canvas: { width: 360, height: 250 },
  interactive: true,
  initialValue: 5,
  min: 3,
  max: 10,
  step: 1,
  snapTargets: [],
  handleLabel: 'Number of regular polygon sides',
  valueText: (v) => {
    const sides = Math.round(v)
    return `${sides} sides; exterior angle ${formatAngle(360 / sides)} degrees`
  },
  valueFromPointer: pt => 3 + sliderValueFromPointer(pt.x, 54, 306, 8),
  derive(v) {
    const sides = clamp(Math.round(v), 3, 10)
    const points = regularPolygonPoints(sides, 180, 105, 70)
    const exterior = 360 / sides
    const interior = 180 - exterior
    const sideMarks = points.map((point, index) => ({
      id: `regular-side-${index}`,
      path: sideTickPath(point, points[(index + 1) % sides], 0.5, 5),
      strokeTone: 'sectorB',
    }))

    return {
      shapes: [
        {
          id: 'regular-polygon-outline',
          path: polygonPath(points),
          fillTone: 'interactionSoft',
          strokeTone: 'structure',
        },
        ...sideMarks,
        ...sliderTrackShapes(8),
      ],
      rays: [],
      sectors: [
        vertexSector(
          'regular-interior',
          points[0],
          points[sides - 1],
          points[1],
          formatAngle(interior),
          'A',
          20,
          43,
        ),
      ],
      points: [],
      handle: { x: sliderX(sides - 3, 8), y: 225 },
      status: {
        heading: `Exterior angle = 360° ÷ ${sides} = ${formatAngle(exterior)}°`,
        explanation: `Interior angle = 180° − ${formatAngle(exterior)}° = ${formatAngle(interior)}°.`,
      },
    }
  },
}

function triangleApexAngles(apexX) {
  return triangleAngles(
    { x: apexX, y: TRIANGLE_APEX_Y },
    TRIANGLE_BASE_LEFT,
    TRIANGLE_BASE_RIGHT,
  )
}

function vertexSector(id, p, q, r, valueDeg, tone, radius = 24, labelRadius = 44) {
  const a1 = vectorAngle(p, q)
  const a2 = vectorAngle(p, r)
  const sweepFrom1 = ((a2 - a1) % 360 + 360) % 360
  const start = sweepFrom1 <= 180 ? a1 : a2
  const sweep = sweepFrom1 <= 180 ? sweepFrom1 : 360 - sweepFrom1
  const label = polarPoint(p.x, p.y, start + sweep / 2, labelRadius)
  return {
    id, cx: p.x, cy: p.y, start, end: start + sweep, radius, tone,
    label: { text: `${valueDeg}°`, x: label.x, y: label.y },
  }
}

function sectorAt(id, point, start, end, value, tone) {
  const label = sectorMidpoint(point.x, point.y, start, end, 42)
  return {
    id,
    cx: point.x,
    cy: point.y,
    start,
    end,
    radius: 27,
    tone,
    label: { text: `${value}°`, x: label.x, y: label.y },
  }
}

function parallelArrowPath(x, y) {
  return `M ${x - 7} ${y - 6} L ${x} ${y} L ${x - 7} ${y + 6}`
}

function rayFrom(cx, cy, angleDeg, length) {
  const end = polarPoint(cx, cy, angleDeg, length)
  return { x1: cx, y1: cy, x2: end.x, y2: end.y }
}

function pointLabel(id, text, cx, cy, angleDeg, radius) {
  const at = polarPoint(cx, cy, angleDeg, radius)
  return { id, text, x: at.x, y: at.y }
}

function polygonInteriorAngles(points, total) {
  const rounded = points.map((point, index) => Math.round(interiorAngle(
    point,
    points[(index - 1 + points.length) % points.length],
    points[(index + 1) % points.length],
  )))
  const drift = total - rounded.reduce((sum, value) => sum + value, 0)
  rounded[rounded.indexOf(Math.max(...rounded))] += drift
  return rounded
}

function sliderX(index, count) {
  if (count <= 1) return 180
  return 54 + (252 * index) / (count - 1)
}

function sliderValueFromPointer(x, minX, maxX, count) {
  const ratio = clamp((x - minX) / (maxX - minX), 0, 1)
  return Math.round(ratio * (count - 1))
}

function sliderTrackShapes(count) {
  return [
    { id: 'selector-track', path: 'M 54 225 L 306 225', strokeTone: 'structureMuted' },
    ...Array.from({ length: count }, (_, index) => {
      const x = sliderX(index, count)
      return {
        id: `selector-tick-${index}`,
        path: `M ${x} 219 L ${x} 231`,
        strokeTone: 'structureMuted',
      }
    }),
  ]
}

function formatAngle(value) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export const ANGLE_PRESETS = {
  angleTypes,
  straightLine,
  aroundPoint,
  verticallyOpposite,
  parallelLines,
  parallelAlternate,
  parallelCoInterior,
  triangle,
  triangleTypes,
  quadrilateral,
  polygonSum,
  regularPolygon,
}

export function resolveAnglePreset(preset) {
  if (typeof preset === 'string') {
    const found = ANGLE_PRESETS[preset]
    if (!found) throw new Error(`Unknown AngleExplore preset: ${preset}`)
    return found
  }
  return preset
}

export function clampPresetValue(presetConfig, value) {
  return clamp(value, presetConfig.min, presetConfig.max)
}
