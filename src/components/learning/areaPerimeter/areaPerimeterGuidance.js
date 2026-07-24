// Presentation guidance that sits above the preset mathematics. Keeping this
// separate means every preset can describe its own interaction without teaching
// copy leaking into the generic SVG renderer.

const RECTANGLE_UNIT = 20
const RECTANGLE_X = 48
const RECTANGLE_Y = 30

const PRESET_INSTRUCTIONS = Object.freeze({
  rectangle: 'Drag either handle to change the rectangle.',
  fixedPerimeterRectangle: 'Drag the handle to change the rectangle while its perimeter stays fixed.',
  triangleArea: 'Drag the apex or perpendicular-height handle.',
  parallelogramArea: 'Drag the top edge sideways, or reveal how the shape becomes a rectangle.',
  trapeziumArea: 'Drag the handles, or join a rotated copy.',
})

export function resolveAreaPerimeterInstruction({
  presetId,
  focus,
  interactive,
  handleCount = 0,
  hasMethods = false,
  hasReveal = false,
}) {
  if (!interactive) return 'Study the labelled diagram.'

  if (presetId === 'compositeShape') {
    return focus === 'area'
      ? 'Choose a method to split the shape into rectangles.'
      : 'Study the outside boundary and work out the missing lengths.'
  }

  if (PRESET_INSTRUCTIONS[presetId]) return PRESET_INSTRUCTIONS[presetId]
  if (handleCount > 1) return 'Drag either handle to explore the shape.'
  if (handleCount === 1) return 'Drag the handle to explore the shape.'
  if (hasMethods) return 'Choose a method to explore the shape.'
  if (hasReveal) return 'Reveal the transformation to see why the formula works.'
  return 'Study the labelled diagram.'
}

// Before the first area interaction, isolate one real grid cell. The highlighted
// 1 cm by 1 cm square makes the superscript in cm² concrete before the learner
// starts using rows, columns and formulas.
export function createAreaPerimeterGuidance({ presetId, focus, hasInteracted }) {
  if (presetId !== 'rectangle' || focus === 'perimeter' || hasInteracted) {
    return { shapes: [], labels: [], description: '' }
  }

  const x = RECTANGLE_X
  const y = RECTANGLE_Y
  const unit = RECTANGLE_UNIT
  const centreX = x + unit / 2

  return {
    shapes: [
      {
        id: 'rectangle-unit-square',
        path: `M ${x} ${y} H ${x + unit} V ${y + unit} H ${x} Z`,
        fillRole: 'areaFillSecondary',
        strokeRole: 'interaction',
        strokeWidth: 1.5,
      },
      {
        id: 'rectangle-unit-square-leader',
        path: `M ${centreX} ${y} L ${centreX} ${y - 8}`,
        strokeRole: 'interaction',
        strokeWidth: 1,
      },
    ],
    labels: [
      {
        id: 'rectangle-unit-square-label',
        x: centreX,
        y: y - 16,
        text: '1 cm²',
        role: 'interaction',
        size: 'unit',
      },
    ],
    description: 'One highlighted grid square represents 1 square centimetre.',
  }
}
