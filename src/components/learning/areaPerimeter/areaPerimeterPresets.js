// ─── AreaPerimeterExplore presets ────────────────────────────────────────────
//
// Each preset is one GCSE mensuration idea expressed as a scene: a shape with
// learner-controlled dimensions, the decomposition visuals that make its area
// reasoning visible, and a status line (result → calculation chain → one
// conceptual explanation). AreaPerimeterExplore renders the scene and owns the
// interaction; prediction questions, marking, hints and scoring belong to the
// page that composes it.
//
// All mathematics happens in model space (whole centimetres) and is mapped to
// SVG pixels through each preset's own unit scale — values are never derived
// from rendered pixel dimensions. Tones are semantic role names resolved by
// AreaPerimeterExplore through areaPerimeterVisualRoles.js — presets never
// name a colour directly.
//
// Preset contract:
//   id, accessibilityLabel, keyFact, canvas, interactive, initialValues,
//   focusModes, defaultFocus,
//   controls: [{ id, label, min, max, step, orientation, valueText,
//                valueFromPointer }],
//   methods?: [{ id, label }] + methodsFocus (discrete decomposition choice),
//   reveal?: { showLabel, hideLabel } (triggered transformation, not a loop),
//   derive(values, { focus, method, revealed }) → scene
//
// Scene contract:
//   shapes:  [{ id, path, fillRole?, strokeRole?, strokeWidth?, dashed? }]
//   labels:  [{ id, x, y, text, role?, size? ('dimension' | 'value') }]
//   handles: [{ controlId, x, y }]
//   status:  { heading, calculation: string[], explanation }
//
// The architecture deliberately leaves room for circle/circumference/sector
// presets later: a new preset only needs its own derive() and controls — the
// renderer and role system need no changes.

import {
  clamp,
  deduceMissingLength,
  distance,
  formatArea,
  formatLength,
  formatValue,
  midpoint,
  normalOffsetPoint,
  parallelMarkPath,
  perpendicularFoot,
  polygonArea,
  polygonPath,
  polygonPerimeter,
  rectangleArea,
  rectanglePerimeter,
  roundTo,
  sideTickPath,
  trapeziumArea,
  triangleAreaFromBaseHeight,
} from '../geometry/shapeGeometry.js'

// ─── Small scene builders ────────────────────────────────────────────────────

function rectPath(x, y, width, height) {
  return polygonPath([
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ])
}

function linePath(x1, y1, x2, y2) {
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

function segmentPath(from, to) {
  return linePath(from.x, from.y, to.x, to.y)
}

// Interior unit-square grid lines for an axis-aligned rectangle.
function gridShapes(idPrefix, x0, y0, unit, columns, rows) {
  const shapes = []
  for (let column = 1; column < columns; column += 1) {
    shapes.push({
      id: `${idPrefix}-grid-v-${column}`,
      path: linePath(x0 + column * unit, y0, x0 + column * unit, y0 + rows * unit),
      strokeRole: 'gridLine',
      strokeWidth: 1,
    })
  }
  for (let row = 1; row < rows; row += 1) {
    shapes.push({
      id: `${idPrefix}-grid-h-${row}`,
      path: linePath(x0, y0 + row * unit, x0 + columns * unit, y0 + row * unit),
      strokeRole: 'gridLine',
      strokeWidth: 1,
    })
  }
  return shapes
}

function equalSideTicks(idPrefix, corners) {
  return corners.map((corner, index) => ({
    id: `${idPrefix}-equal-${index}`,
    path: sideTickPath(corner, corners[(index + 1) % corners.length]),
    strokeRole: 'boundary',
  }))
}

// Small square marking the right angle where a perpendicular height meets its
// base. `side` is +1 to draw the square to the right of the foot, -1 left.
function rightAngleFootPath(footX, footY, side = 1, size = 9) {
  return [
    `M ${footX + side * size} ${footY}`,
    `L ${footX + side * size} ${footY - size}`,
    `L ${footX} ${footY - size}`,
  ].join(' ')
}

// ─── Preset 1: rectangle ─────────────────────────────────────────────────────

// The unit and the minimum dimensions are set by the spacing budget along each
// edge: at the smallest rectangle the two handles must still be a full touch
// target apart, and each dimension label must clear the handle on its own edge.
const RECT = { unit: 20, x0: 48, y0: 30, handleOffset: 10, labelOffset: 36 }

const rectangle = {
  id: 'rectangle',
  accessibilityLabel: 'Interactive rectangle — perimeter and area',
  keyFact: 'Perimeter is the distance around the outside boundary; area is the space inside, measured in square units.',
  canvas: { width: 360, height: 250 },
  interactive: true,
  focusModes: ['perimeter', 'area', 'compare'],
  defaultFocus: 'compare',
  initialValues: { width: 6, height: 4 },
  controls: [
    {
      id: 'width',
      label: 'Width of the rectangle',
      min: 3,
      max: 12,
      step: 1,
      valueText: values => `Width ${values.width} centimetres — perimeter ${formatValue(rectanglePerimeter(values.width, values.height))} centimetres, area ${formatValue(rectangleArea(values.width, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round((pt.x - RECT.x0) / RECT.unit),
    },
    {
      id: 'height',
      label: 'Height of the rectangle',
      min: 3,
      max: 7,
      step: 1,
      valueText: values => `Height ${values.height} centimetres — perimeter ${formatValue(rectanglePerimeter(values.width, values.height))} centimetres, area ${formatValue(rectangleArea(values.width, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round((pt.y - RECT.y0) / RECT.unit),
    },
  ],
  derive(values, { focus }) {
    const { unit, x0, y0 } = RECT
    const { width, height } = values
    const perimeter = rectanglePerimeter(width, height)
    const area = rectangleArea(width, height)
    const isSquare = width === height
    const w = width * unit
    const h = height * unit
    const corners = [
      { x: x0, y: y0 },
      { x: x0 + w, y: y0 },
      { x: x0 + w, y: y0 + h },
      { x: x0, y: y0 + h },
    ]
    const perimeterFocus = focus === 'perimeter'
    const showGrid = !perimeterFocus && area <= 60

    const shapes = [
      {
        id: 'rectangle-outline',
        path: polygonPath(corners),
        fillRole: perimeterFocus ? undefined : 'areaFill',
        strokeRole: focus === 'area' ? 'boundaryMuted' : 'boundary',
      },
      ...(showGrid ? gridShapes('rectangle', x0, y0, unit, width, height) : []),
      ...(isSquare ? equalSideTicks('rectangle', corners) : []),
    ]

    // Perimeter focus labels every side in trace order; area focus shows only
    // the two dimensions the multiplication needs, so the interior stays the
    // subject. Labels clear the handles that sit just outside each edge.
    const labels = perimeterFocus
      ? [
          { id: 'dim-top', x: x0 + w / 2, y: y0 - 14, text: formatLength(width) },
          { id: 'dim-right', x: x0 + w + RECT.labelOffset, y: y0 + h / 2, text: formatLength(height) },
          { id: 'dim-bottom', x: x0 + w / 2, y: y0 + h + 34, text: formatLength(width) },
          { id: 'dim-left', x: x0 - 22, y: y0 + h / 2, text: formatLength(height) },
        ]
      : [
          { id: 'dim-bottom', x: x0 + w / 2, y: y0 + h + 34, text: formatLength(width) },
          { id: 'dim-left', x: x0 - 22, y: y0 + h / 2, text: formatLength(height) },
        ]

    const status = (() => {
      if (perimeterFocus) {
        return {
          heading: `Perimeter = ${formatLength(perimeter)}`,
          calculation: [
            `${width} + ${height} + ${width} + ${height} = ${formatLength(perimeter)}`,
            `2 × (${width} + ${height}) = ${formatLength(perimeter)}`,
          ],
          explanation: isSquare
            ? 'All four sides are equal — trace every outside edge once.'
            : 'Trace every outside edge once, adding the lengths in order.',
        }
      }
      if (focus === 'area') {
        return {
          heading: `Area = ${formatArea(area)}`,
          calculation: [
            `${height} rows × ${width} columns = ${formatArea(area)}`,
            isSquare
              ? `Area = side × side = ${width}² = ${formatArea(area)}`
              : `Length × width: ${width} × ${height} = ${formatArea(area)}`,
          ],
          explanation: 'Area measures the space inside the shape, counted in square centimetres.',
        }
      }
      return {
        heading: `Perimeter ${formatLength(perimeter)} — area ${formatArea(area)}`,
        calculation: [
          `Perimeter: 2 × (${width} + ${height}) = ${formatLength(perimeter)}`,
          `Area: ${width} × ${height} = ${formatArea(area)}`,
        ],
        explanation: `One more column would add ${formatArea(height)} of space but only 2 cm of boundary — the two measures change differently.`,
      }
    })()

    return {
      shapes,
      labels,
      handles: [
        { controlId: 'width', x: x0 + w + RECT.handleOffset, y: y0 + h / 2 },
        { controlId: 'height', x: x0 + w / 2, y: y0 + h + RECT.handleOffset },
      ],
      status,
    }
  },
}

// ─── Preset 2: fixed-perimeter rectangle ─────────────────────────────────────

const FIXED = { unit: 16, x0: 64, y0: 24, perimeter: 24 }
const FIXED_MILESTONES = [
  [1, 11],
  [2, 10],
  [4, 8],
  [6, 6],
]

const fixedPerimeterRectangle = {
  id: 'fixedPerimeterRectangle',
  accessibilityLabel: 'Rectangles with a fixed perimeter of 24 centimetres',
  keyFact: 'Rectangles can share the same perimeter but enclose different areas; the square encloses the most.',
  canvas: { width: 360, height: 270 },
  interactive: true,
  focusModes: ['compare'],
  defaultFocus: 'compare',
  initialValues: { width: 4 },
  controls: [
    {
      id: 'width',
      label: 'Width of the rectangle (perimeter stays 24 cm)',
      min: 1,
      max: 11,
      step: 1,
      valueText: (values) => {
        const height = FIXED.perimeter / 2 - values.width
        return `Width ${values.width} centimetres, height ${height} centimetres — perimeter still 24 centimetres, area ${formatValue(rectangleArea(values.width, height))} square centimetres`
      },
      valueFromPointer: pt => Math.round((pt.x - FIXED.x0) / FIXED.unit),
    },
  ],
  derive(values) {
    const { unit, x0, y0 } = FIXED
    const width = values.width
    const height = FIXED.perimeter / 2 - width
    const area = rectangleArea(width, height)
    const isSquare = width === height
    const w = width * unit
    const h = height * unit
    const corners = [
      { x: x0, y: y0 },
      { x: x0 + w, y: y0 },
      { x: x0 + w, y: y0 + h },
      { x: x0, y: y0 + h },
    ]

    const milestoneLabels = FIXED_MILESTONES.map(([a, b], index) => {
      const current = (width === a && height === b) || (width === b && height === a)
      return {
        id: `milestone-${a}x${b}`,
        x: 80 + index * 72,
        y: 248,
        text: `${a} × ${b} = ${a * b}`,
        role: current ? 'interaction' : 'textMuted',
      }
    })

    return {
      shapes: [
        {
          id: 'fixed-rectangle-outline',
          path: polygonPath(corners),
          fillRole: 'areaFill',
          strokeRole: 'boundary',
        },
        ...gridShapes('fixed-rectangle', x0, y0, unit, width, height),
        ...(isSquare ? equalSideTicks('fixed-rectangle', corners) : []),
      ],
      labels: [
        { id: 'dim-bottom', x: x0 + w / 2, y: y0 + h + 16, text: formatLength(width) },
        { id: 'dim-left', x: x0 - 24, y: y0 + h / 2, text: formatLength(height) },
        ...milestoneLabels,
      ],
      handles: [{ controlId: 'width', x: x0 + w, y: y0 + h / 2 }],
      status: {
        heading: `Area = ${formatArea(area)}`,
        calculation: [
          `Perimeter: ${width} + ${height} + ${width} + ${height} = 24 cm`,
          `Area: ${width} × ${height} = ${formatArea(area)}`,
        ],
        explanation: isSquare
          ? 'With this fixed perimeter, the square encloses the greatest area.'
          : 'Same 24 cm boundary — a different amount of space inside.',
      },
    }
  },
}

// ─── Preset 3: triangle area ─────────────────────────────────────────────────

// The apex slides past the right-hand end of the base so the perpendicular
// foot can fall outside the base — the case where "the sloping side is the
// height" fails most visibly. The height rail sits far enough left that its
// handle never shares hit-target space with the apex handle.
const TRI = { unit: 24, x0: 86, baseY: 200, base: 8, dimX: 44 }

const triangleArea = {
  id: 'triangleArea',
  accessibilityLabel: 'Triangle area — base and perpendicular height',
  keyFact: 'A triangle’s area depends on its base and perpendicular height, not on the slope of its sides.',
  canvas: { width: 380, height: 260 },
  interactive: true,
  focusModes: ['area'],
  defaultFocus: 'area',
  initialValues: { apex: 5, height: 4 },
  controls: [
    {
      id: 'apex',
      label: 'Slide the apex along the top',
      min: 1,
      max: 11,
      step: 1,
      valueText: values => `Apex ${values.apex} centimetres along from the left end of the base — area still ${formatValue(triangleAreaFromBaseHeight(TRI.base, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round((pt.x - TRI.x0) / TRI.unit),
    },
    {
      id: 'height',
      label: 'Perpendicular height of the triangle',
      min: 2,
      max: 6,
      step: 1,
      valueText: values => `Perpendicular height ${values.height} centimetres — area ${formatValue(triangleAreaFromBaseHeight(TRI.base, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round((TRI.baseY - pt.y) / TRI.unit),
    },
  ],
  reveal: {
    showLabel: 'Show why the formula works',
    hideLabel: 'Back to one triangle',
  },
  derive(values, { revealed }) {
    const { unit, x0, baseY, base, dimX } = TRI
    const { apex, height } = values
    const area = triangleAreaFromBaseHeight(base, height)
    const apexPoint = { x: x0 + apex * unit, y: baseY - height * unit }
    const baseLeft = { x: x0, y: baseY }
    const baseRight = { x: x0 + base * unit, y: baseY }
    const foot = perpendicularFoot(apexPoint, baseLeft, baseRight)
    const footOutside = apex < 0 || apex > base

    const shapes = [
      {
        id: 'triangle-outline',
        path: polygonPath([apexPoint, baseLeft, baseRight]),
        fillRole: 'areaFill',
        strokeRole: 'boundaryMuted',
      },
      {
        id: 'triangle-height',
        path: linePath(apexPoint.x, apexPoint.y, foot.x, foot.y),
        strokeRole: 'constructionLine',
        dashed: true,
      },
      {
        id: 'triangle-right-angle',
        path: rightAngleFootPath(foot.x, foot.y, apex >= base / 2 ? -1 : 1),
        strokeRole: 'constructionLine',
      },
      {
        id: 'triangle-height-dimension',
        path: [
          linePath(dimX, baseY, dimX, apexPoint.y),
          linePath(dimX - 5, baseY, dimX + 5, baseY),
          linePath(dimX - 5, apexPoint.y, dimX + 5, apexPoint.y),
        ].join(' '),
        strokeRole: 'dimensionLine',
        strokeWidth: 1.5,
      },
    ]

    if (footOutside) {
      const nearEnd = apex < 0 ? baseLeft : baseRight
      // The base itself never grows — this dashed extension only shows where
      // the perpendicular lands when the apex leans past the base.
      shapes.push({
        id: 'triangle-base-extension',
        path: linePath(nearEnd.x, baseY, foot.x, baseY),
        strokeRole: 'constructionLine',
        dashed: true,
      })
    }

    if (revealed) {
      // A second, identical triangle rotated 180° pairs with the first to
      // form a parallelogram of area base × height. Rotate about the side
      // that keeps the pair on-canvas.
      const pivotRight = apex <= base / 2
      const pivot = pivotRight ? baseRight : baseLeft
      const fourth = {
        x: apexPoint.x + (pivot.x - (pivotRight ? baseLeft.x : baseRight.x)),
        y: apexPoint.y,
      }
      shapes.push({
        id: 'triangle-duplicate',
        path: polygonPath([apexPoint, pivot, fourth]),
        fillRole: 'areaFillSecondary',
        strokeRole: 'boundaryMuted',
      })
    }

    const slopeMid = midpoint(apexPoint, baseRight)

    return {
      shapes,
      labels: [
        { id: 'dim-base', x: x0 + (base * unit) / 2, y: baseY + 18, text: formatLength(base) },
        { id: 'dim-height', x: dimX - 26, y: baseY - (height * unit) / 2, text: formatLength(height) },
        {
          // Offset perpendicular to the slope itself, so the tag stays beside
          // the sloping side and clear of the apex handle at every lean.
          id: 'slope-note',
          ...normalOffsetPoint(apexPoint, baseRight, 0.5, -42),
          text: 'sloping side',
          role: 'textMuted',
        },
      ],
      handles: [
        { controlId: 'apex', x: apexPoint.x, y: apexPoint.y },
        { controlId: 'height', x: dimX, y: apexPoint.y },
      ],
      status: revealed
        ? {
            heading: `Area = ½ × ${base} × ${height} = ${formatArea(area)}`,
            calculation: [
              `Two copies make a parallelogram: ${base} × ${height} = ${formatArea(base * height)}`,
              `One triangle is half: ½ × ${base} × ${height} = ${formatArea(area)}`,
            ],
            explanation: 'Area = ½ × base × perpendicular height.',
          }
        : {
            heading: `Area = ${formatArea(area)}`,
            calculation: [`Base ${formatLength(base)}, perpendicular height ${formatLength(height)}`],
            explanation: 'Slide the apex — the sloping sides change, but the base and perpendicular height do not, so the area stays the same. A sloping side is not the height.',
          },
    }
  },
}

// ─── Preset 4: parallelogram area ────────────────────────────────────────────

// Laid out so the equivalent rectangle, the cut piece and the overhang all fit
// side by side at full slant without any label crossing an edge.
const PARA = { unit: 22, x0: 60, baseY: 176, base: 7, height: 4 }

const parallelogramArea = {
  id: 'parallelogramArea',
  accessibilityLabel: 'Parallelogram area — slant does not change the space inside',
  keyFact: 'A parallelogram has the same area as a rectangle with the same base and perpendicular height.',
  canvas: { width: 360, height: 230 },
  interactive: true,
  focusModes: ['area'],
  defaultFocus: 'area',
  initialValues: { slant: 2 },
  controls: [
    {
      id: 'slant',
      label: 'Slide the top edge sideways',
      min: 0,
      max: 5,
      step: 1,
      valueText: values => `Slant ${values.slant} — area still ${formatValue(PARA.base * PARA.height)} square centimetres`,
      valueFromPointer: pt => Math.round((pt.x - PARA.x0) / PARA.unit - PARA.base / 2),
    },
  ],
  reveal: {
    showLabel: 'Cut and slide the overhang',
    hideLabel: 'Back to the parallelogram',
  },
  derive(values, { revealed }) {
    const { unit, x0, baseY, base, height } = PARA
    const slant = values.slant
    const area = base * height
    const topY = baseY - height * unit
    const bottomLeft = { x: x0, y: baseY }
    const bottomRight = { x: x0 + base * unit, y: baseY }
    const topLeft = { x: x0 + slant * unit, y: topY }
    const topRight = { x: x0 + (slant + base) * unit, y: topY }

    const cut = revealed && slant > 0

    // Before the reveal the parallelogram is the filled shape. After it, the
    // fill moves to the rectangle the pieces make, so what the learner sees
    // solid is the equivalent rectangle — the overhang is left as an empty
    // dashed outline showing where the moved piece came from.
    const shapes = [
      cut
        ? {
            id: 'parallelogram-rectangle-fill',
            path: rectPath(x0, topY, base * unit, height * unit),
            fillRole: 'areaFill',
          }
        : {
            id: 'parallelogram-outline',
            path: polygonPath([bottomLeft, bottomRight, topRight, topLeft]),
            fillRole: 'areaFill',
            strokeRole: 'boundaryMuted',
          },
    ]

    if (cut) {
      shapes.push(
        {
          id: 'parallelogram-moved-piece',
          path: polygonPath([bottomLeft, { x: x0, y: topY }, topLeft]),
          fillRole: 'areaFillSecondary',
          strokeRole: 'boundaryMuted',
        },
        {
          id: 'parallelogram-overhang-ghost',
          path: polygonPath([bottomRight, { x: bottomRight.x, y: topY }, topRight]),
          strokeRole: 'constructionLine',
          dashed: true,
        },
        {
          id: 'parallelogram-cut-line',
          path: linePath(bottomRight.x, baseY, bottomRight.x, topY),
          strokeRole: 'constructionLine',
          dashed: true,
        },
        {
          id: 'parallelogram-rectangle',
          path: rectPath(x0, topY, base * unit, height * unit),
          strokeRole: 'boundary',
        },
      )
    }

    shapes.push(
      {
        id: 'parallelogram-height',
        path: linePath(topLeft.x, topY, topLeft.x, baseY),
        strokeRole: 'constructionLine',
        dashed: true,
      },
      {
        id: 'parallelogram-right-angle',
        path: rightAngleFootPath(topLeft.x, baseY, 1),
        strokeRole: 'constructionLine',
      },
    )

    const status = (() => {
      if (!revealed) {
        return {
          heading: `Area = ${formatArea(area)}`,
          calculation: [`Base ${formatLength(base)}, perpendicular height ${formatLength(height)}`],
          explanation: 'Slide the top edge — the slant changes, the space inside does not. The sloping side is not the height.',
        }
      }
      if (slant === 0) {
        return {
          heading: `Area = ${base} × ${height} = ${formatArea(area)}`,
          calculation: [`With no slant this is already a ${base} × ${height} rectangle`],
          explanation: 'Area = base × perpendicular height.',
        }
      }
      return {
        heading: `Area = ${base} × ${height} = ${formatArea(area)}`,
        calculation: [
          `Cut the overhanging triangle and slide it across`,
          `The pieces make a ${base} × ${height} rectangle = ${formatArea(area)}`,
        ],
        explanation: 'Area = base × perpendicular height — the slant never changed the space inside.',
      }
    })()

    return {
      shapes,
      labels: [
        { id: 'dim-base', x: x0 + (base * unit) / 2, y: baseY + 20, text: formatLength(base) },
        // Beside the dashed perpendicular, never beside a sloping edge — the
        // height label must not be readable as the length of the slant.
        { id: 'dim-height', x: topLeft.x + 20, y: (baseY + topY) / 2, text: formatLength(height) },
      ],
      handles: [
        { controlId: 'slant', x: x0 + (slant + base / 2) * unit, y: topY },
      ],
      status,
    }
  },
}

// ─── Preset 5: trapezium area ────────────────────────────────────────────────

const TRAP = { unit: 16, cx: 170, baseY: 190, dimX: 46 }

const trapeziumAreaPreset = {
  id: 'trapeziumArea',
  accessibilityLabel: 'Trapezium area — two copies make a parallelogram',
  keyFact: 'Two identical trapezia joined together make a parallelogram with base a + b and the same height.',
  canvas: { width: 380, height: 250 },
  interactive: true,
  focusModes: ['area'],
  defaultFocus: 'area',
  initialValues: { top: 3, bottom: 7, height: 4 },
  controls: [
    {
      id: 'top',
      label: 'Length of the top parallel side',
      min: 2,
      max: 6,
      step: 1,
      valueText: values => `Top parallel side ${values.top} centimetres — area ${formatValue(trapeziumArea(values.top, values.bottom, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round(((TRAP.cx - pt.x) * 2) / TRAP.unit),
    },
    {
      id: 'bottom',
      label: 'Length of the bottom parallel side',
      min: 4,
      max: 9,
      step: 1,
      valueText: values => `Bottom parallel side ${values.bottom} centimetres — area ${formatValue(trapeziumArea(values.top, values.bottom, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round(((pt.x - TRAP.cx) * 2) / TRAP.unit),
    },
    {
      id: 'height',
      label: 'Perpendicular height of the trapezium',
      min: 2,
      max: 6,
      step: 1,
      valueText: values => `Perpendicular height ${values.height} centimetres — area ${formatValue(trapeziumArea(values.top, values.bottom, values.height))} square centimetres`,
      valueFromPointer: pt => Math.round((TRAP.baseY - pt.y) / TRAP.unit),
    },
  ],
  reveal: {
    showLabel: 'Join a rotated copy',
    hideLabel: 'Back to one trapezium',
  },
  derive(values, { revealed }) {
    const { unit, cx, baseY, dimX } = TRAP
    const { top, bottom, height } = values
    const area = trapeziumArea(top, bottom, height)
    const topY = baseY - height * unit
    const half = unit / 2
    const topLeft = { x: cx - top * half, y: topY }
    const topRight = { x: cx + top * half, y: topY }
    const bottomRight = { x: cx + bottom * half, y: baseY }
    const bottomLeft = { x: cx - bottom * half, y: baseY }
    const outline = [topLeft, topRight, bottomRight, bottomLeft]

    const shapes = [
      {
        id: 'trapezium-outline',
        path: polygonPath(outline),
        fillRole: 'areaFill',
        strokeRole: 'boundaryMuted',
      },
      {
        id: 'trapezium-parallel-top',
        path: parallelMarkPath(topLeft, topRight),
        strokeRole: 'dimensionLine',
      },
      {
        id: 'trapezium-parallel-bottom',
        path: parallelMarkPath(bottomLeft, bottomRight),
        strokeRole: 'dimensionLine',
      },
      {
        id: 'trapezium-height-dimension',
        path: [
          linePath(dimX, baseY, dimX, topY),
          linePath(dimX - 5, baseY, dimX + 5, baseY),
          linePath(dimX - 5, topY, dimX + 5, topY),
        ].join(' '),
        strokeRole: 'dimensionLine',
        strokeWidth: 1.5,
      },
    ]

    if (revealed) {
      // Rotate the trapezium 180° about the midpoint of its right leg; the
      // copy joins on to make a parallelogram with base a + b.
      const pivot = midpoint(topRight, bottomRight)
      const rotated = outline.map(point => ({
        x: 2 * pivot.x - point.x,
        y: 2 * pivot.y - point.y,
      }))
      shapes.push({
        id: 'trapezium-duplicate',
        path: polygonPath(rotated),
        fillRole: 'areaFillSecondary',
        strokeRole: 'boundaryMuted',
      })
    }

    return {
      shapes,
      labels: [
        { id: 'dim-top', x: cx, y: topY - 24, text: formatLength(top) },
        { id: 'dim-bottom', x: cx, y: baseY + 26, text: formatLength(bottom) },
        { id: 'dim-height', x: dimX - 26, y: (baseY + topY) / 2, text: formatLength(height) },
      ],
      handles: [
        { controlId: 'top', x: topLeft.x, y: topLeft.y },
        { controlId: 'bottom', x: bottomRight.x, y: bottomRight.y },
        { controlId: 'height', x: dimX, y: topY },
      ],
      status: revealed
        ? {
            heading: `Area = ½ × (${top} + ${bottom}) × ${height} = ${formatArea(area)}`,
            calculation: [
              `Two copies make a parallelogram: base ${top} + ${bottom} = ${formatLength(top + bottom)}, height ${formatLength(height)}`,
              `Parallelogram area ${formatArea((top + bottom) * height)} — the trapezium is half`,
            ],
            explanation: 'Area = ½ × (a + b) × h.',
          }
        : {
            heading: `Area = ${formatArea(area)}`,
            calculation: [
              `Parallel sides ${formatLength(top)} and ${formatLength(bottom)}, perpendicular height ${formatLength(height)}`,
            ],
            explanation: 'The two parallel sides and the perpendicular height between them decide the area.',
          },
    }
  },
}

// ─── Preset 6: composite rectilinear shape ───────────────────────────────────

// L-shape in model centimetres, y down, traced clockwise from the top-left.
// Every length, area and total below is derived from these six points — the
// preset states the shape, never the answer.
const COMP = { unit: 26, x0: 88, y0: 30 }
const COMP_POINTS = [
  { x: 0, y: 0 },
  { x: 7, y: 0 },
  { x: 7, y: 4 },
  { x: 4, y: 4 },
  { x: 4, y: 6 },
  { x: 0, y: 6 },
]

// Labels sit at each side's midpoint by default. The two sides meeting at the
// inner corner are nudged along their own length so their labels do not crowd
// each other inside the notch.
const COMP_LABEL_POSITIONS = { 2: 0.3, 3: 0.72 }

// The two sides an exam question leaves off the diagram. Each is recovered
// from the opposite outer length minus the parallel parts that are given.
const COMP_DEDUCED = [
  { side: 2, total: 0, parts: [4] },
  { side: 3, total: 5, parts: [1] },
]

// Each method is a set of model rectangles over the same shape. `add` sums the
// pieces; `subtract` completes the bounding rectangle and removes the corner.
const COMP_METHODS = {
  'split-vertical': {
    label: 'Vertical split',
    operation: 'add',
    pieces: [{ x: 0, y: 0, w: 4, h: 6 }, { x: 4, y: 0, w: 3, h: 4 }],
    cut: [{ x: 4, y: 0 }, { x: 4, y: 4 }],
    explanation: 'Split the shape into rectangles, then add the areas.',
  },
  'split-horizontal': {
    label: 'Horizontal split',
    operation: 'add',
    pieces: [{ x: 0, y: 0, w: 7, h: 4 }, { x: 0, y: 4, w: 4, h: 2 }],
    cut: [{ x: 0, y: 4 }, { x: 4, y: 4 }],
    explanation: 'A different split — the same total area.',
  },
  subtract: {
    label: 'Subtract the corner',
    operation: 'subtract',
    pieces: [{ x: 0, y: 0, w: 7, h: 6 }, { x: 4, y: 4, w: 3, h: 2 }],
    explanation: 'Complete the big rectangle, then subtract the missing corner. Every correct method gives the same area.',
  },
}

function compPx(point) {
  return { x: COMP.x0 + point.x * COMP.unit, y: COMP.y0 + point.y * COMP.unit }
}

// Side i runs from vertex i to vertex i + 1, in trace order.
function compSideLengths() {
  return COMP_POINTS.map((point, index) => (
    distance(point, COMP_POINTS[(index + 1) % COMP_POINTS.length])
  ))
}

const compositeShape = {
  id: 'compositeShape',
  accessibilityLabel: 'Composite L-shape — area by decomposition, perimeter by tracing the boundary',
  keyFact: 'Split a composite shape into rectangles to find its area; trace only the outside boundary for its perimeter.',
  canvas: { width: 360, height: 260 },
  interactive: true,
  focusModes: ['area', 'perimeter'],
  defaultFocus: 'area',
  initialValues: {},
  controls: [],
  methods: Object.entries(COMP_METHODS).map(([id, config]) => ({ id, label: config.label })),
  methodsFocus: 'area',
  derive(values, { focus, method }) {
    const { unit } = COMP
    const px = COMP_POINTS.map(compPx)
    const outlinePath = polygonPath(px)
    const sides = compSideLengths()
    const deducedIndices = new Set(COMP_DEDUCED.map(entry => entry.side))

    if (focus === 'perimeter') {
      // One uniform rule places every dimension label just outside the side it
      // measures — including the two that sit inside the notch.
      const labels = sides.map((length, index) => {
        const from = px[index]
        const to = px[(index + 1) % px.length]
        return {
          id: `dim-side-${index}`,
          ...normalOffsetPoint(from, to, COMP_LABEL_POSITIONS[index] ?? 0.5, -20),
          text: formatLength(length),
          role: deducedIndices.has(index) ? 'deducedLabel' : undefined,
        }
      })
      const deductions = COMP_DEDUCED.map(entry => (
        `${formatValue(deduceMissingLength(sides[entry.total], entry.parts.map(part => sides[part])))} = ${formatValue(sides[entry.total])} − ${entry.parts.map(part => formatValue(sides[part])).join(' − ')}`
      ))

      return {
        shapes: [
          { id: 'composite-outline', path: outlinePath, strokeRole: 'boundary' },
          {
            // The area split stays on screen, muted, so it can be named as the
            // thing that is deliberately not counted.
            id: 'composite-old-split',
            path: segmentPath(
              compPx(COMP_METHODS['split-vertical'].cut[0]),
              compPx(COMP_METHODS['split-vertical'].cut[1]),
            ),
            strokeRole: 'constructionLine',
            dashed: true,
          },
        ],
        labels,
        handles: [],
        status: {
          heading: `Perimeter = ${formatLength(polygonPerimeter(COMP_POINTS))}`,
          calculation: [
            `${sides.map(formatValue).join(' + ')} = ${formatLength(polygonPerimeter(COMP_POINTS))}`,
            `Missing lengths: ${deductions.join(' and ')}`,
          ],
          explanation: 'This line helped us calculate the area, but it is inside the shape, so it is not part of the perimeter.',
        },
      }
    }

    const config = COMP_METHODS[method] ?? COMP_METHODS['split-vertical']
    const areas = config.pieces.map(piece => rectangleArea(piece.w, piece.h))
    const total = polygonArea(COMP_POINTS)

    const shapes = config.operation === 'add'
      ? [
          ...config.pieces.map((piece, index) => ({
            id: `composite-piece-${index}`,
            path: rectPath(
              compPx(piece).x, compPx(piece).y, piece.w * unit, piece.h * unit,
            ),
            fillRole: index === 0 ? 'areaFill' : 'areaFillSecondary',
          })),
          { id: 'composite-outline', path: outlinePath, strokeRole: 'boundaryMuted' },
          {
            id: 'composite-split-line',
            path: segmentPath(compPx(config.cut[0]), compPx(config.cut[1])),
            strokeRole: 'constructionLine',
            dashed: true,
          },
        ]
      : [
          { id: 'composite-shape-fill', path: outlinePath, fillRole: 'areaFill' },
          { id: 'composite-outline', path: outlinePath, strokeRole: 'boundaryMuted' },
          {
            id: 'composite-missing-rectangle',
            path: rectPath(
              compPx(config.pieces[1]).x, compPx(config.pieces[1]).y,
              config.pieces[1].w * unit, config.pieces[1].h * unit,
            ),
            strokeRole: 'constructionLine',
            dashed: true,
          },
        ]

    const labels = config.pieces.map((piece, index) => {
      const subtracted = config.operation === 'subtract' && index === 1
      return {
        id: `piece-${index}`,
        ...compPx({ x: piece.x + piece.w / 2, y: piece.y + piece.h / 2 }),
        text: subtracted ? `− ${formatArea(areas[index])}` : formatArea(areas[index]),
        role: subtracted ? 'deducedLabel' : undefined,
        size: 'value',
      }
    })

    const [first, second] = config.pieces
    const calculation = config.operation === 'add'
      ? [
          `${first.w} × ${first.h} = ${formatArea(areas[0])} and ${second.w} × ${second.h} = ${formatArea(areas[1])}`,
          `${formatArea(areas[0])} + ${formatArea(areas[1])} = ${formatArea(total)}`,
        ]
      : [
          `Whole rectangle ${first.w} × ${first.h} = ${formatArea(areas[0])}, missing corner ${second.w} × ${second.h} = ${formatArea(areas[1])}`,
          `${formatArea(areas[0])} − ${formatArea(areas[1])} = ${formatArea(total)}`,
        ]

    return {
      shapes,
      labels,
      handles: [],
      status: {
        heading: `Area = ${formatArea(total)}`,
        calculation,
        explanation: config.explanation,
      },
    }
  },
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const AREA_PERIMETER_PRESETS = {
  rectangle,
  fixedPerimeterRectangle,
  triangleArea,
  parallelogramArea,
  trapeziumArea: trapeziumAreaPreset,
  compositeShape,
}

export function resolveAreaPerimeterPreset(preset) {
  if (typeof preset === 'string') {
    const found = AREA_PERIMETER_PRESETS[preset]
    if (!found) throw new Error(`Unknown AreaPerimeterExplore preset: ${preset}`)
    return found
  }
  return preset
}

export function clampPresetValues(presetConfig, values = {}) {
  const next = { ...presetConfig.initialValues }
  for (const control of presetConfig.controls) {
    const raw = values[control.id] ?? next[control.id]
    const stepped = Math.round(raw / control.step) * control.step
    next[control.id] = roundTo(clamp(stepped, control.min, control.max))
  }
  return next
}

export function resolvePresetFocus(presetConfig, focus) {
  if (focus && presetConfig.focusModes.includes(focus)) return focus
  return presetConfig.defaultFocus
}
