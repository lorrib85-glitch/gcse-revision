// ─── AngleExplore presets ────────────────────────────────────────────────────
//
// Each preset is one GCSE angle fact expressed as a scene: fixed rays, one
// learner-controlled value (a draggable ray, or the apex of a triangle) and
// the sectors, labels and status line derived from that value. AngleExplore
// renders the scene and owns the drag/keyboard interaction; questions,
// predictions and marking belong to the page that composes the diagram.
//
// Tones are semantic role names resolved by AngleExplore through
// angleVisualRoles.js — presets never name a colour directly. Equal angles
// share a sector tone so equality reads as colour before words.

import {
  classifyAngle,
  clamp,
  pointerAngle,
  polarPoint,
  sectorMidpoint,
  triangleAngles,
  vectorAngle,
} from './angleGeometry.js'

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

function triangleApexAngles(apexX) {
  return triangleAngles(
    { x: apexX, y: TRIANGLE_APEX_Y },
    TRIANGLE_BASE_LEFT,
    TRIANGLE_BASE_RIGHT,
  )
}

// Interior sector at vertex p, spanning from the ray p→q to the ray p→r the
// short way round, labelled just beyond the arc along the angle bisector.
function vertexSector(id, p, q, r, valueDeg, tone) {
  const a1 = vectorAngle(p, q)
  const a2 = vectorAngle(p, r)
  const sweepFrom1 = ((a2 - a1) % 360 + 360) % 360
  const start = sweepFrom1 <= 180 ? a1 : a2
  const sweep = sweepFrom1 <= 180 ? sweepFrom1 : 360 - sweepFrom1
  const label = polarPoint(p.x, p.y, start + sweep / 2, 44)
  return {
    id, cx: p.x, cy: p.y, start, end: start + sweep, radius: 24, tone,
    label: { text: `${valueDeg}°`, x: label.x, y: label.y },
  }
}

function sideTickPath(from, to, position = 0.52, halfLength = 7) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const cx = from.x + dx * position
  const cy = from.y + dy * position
  const px = (-dy / length) * halfLength
  const py = (dx / length) * halfLength
  return `M ${cx - px} ${cy - py} L ${cx + px} ${cy + py}`
}

function rayFrom(cx, cy, angleDeg, length) {
  const end = polarPoint(cx, cy, angleDeg, length)
  return { x1: cx, y1: cy, x2: end.x, y2: end.y }
}

function pointLabel(id, text, cx, cy, angleDeg, radius) {
  const at = polarPoint(cx, cy, angleDeg, radius)
  return { id, text, x: at.x, y: at.y }
}

export const ANGLE_PRESETS = {
  angleTypes,
  straightLine,
  aroundPoint,
  verticallyOpposite,
  triangle,
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
