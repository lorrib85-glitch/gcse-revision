// ─── Presets: translate, reflect, rotate, enlarge ────────────────────────────
//
// One object, one image, one rule made visible. All four share the polygon, the
// A → A′ vertex labelling and the coordinate-pair status, and they stay four
// presets because the part that teaches — the rule geometry — is genuinely
// different in each. A single "transformation" preset with a type switch would
// have to pretend a rotation and a translation are annotated the same way, and
// they are not: a straight A → A′ chord under a rotation implies straight-line
// movement and explains nothing about turning about a centre.
//
// Option ids (mirror, angle, direction, scale factor) are ordinary entries in
// `values`, not private renderer state. That is what lets a static exam figure
// specify a reflection in y = x or a 180° anticlockwise rotation, and what makes
// one option tap emit one complete onChange through the same atomic setter as
// every numeric control.

import { clipSegmentToBounds } from '../coordinatePlaneGeometry.js'
import {
  enlargePoint,
  formatCoordinate,
  reflectPoint,
  rotatePoint,
  translatePoint,
} from '../coordinatePlaneMath.js'
// Imported from optionState.js, NOT from the registry. Sharing the rule is the
// point — the fallback for an option a capability has removed must be identical
// in the scene and in the buttons, or the two disagree about what is selected —
// but importing it from index.js made a registry ↔ preset cycle that threw a
// temporal-dead-zone error the moment anyone imported this module directly
// rather than through the registry. tests/unit/transformationsDirectImport.test.js
// guards against reintroducing it.
import { resolveOptionValues } from './optionState.js'

const MINUS = '−'
const PRIME = '′'

// Labels every 2 with gridlines every 1. A ±10 plane is denser on a phone and
// throws away the legibility that labelling every 2 buys back, so the control
// ranges are sized to this grid rather than the grid being widened to them.
const TRANSFORM_AXIS = { min: -8, max: 8, step: 2 }
const TRANSFORM_GRID = { xSubdivisions: 2, ySubdivisions: 2 }

// The plot is square — 360 − 40 − 28 = 292 wide, 356 − 24 − 40 = 292 high — so
// the two axes share one scale. A 90° rotation has to LOOK like a quarter turn;
// on a stretched plane it looks like a shear and teaches the wrong thing.
const TRANSFORM_CANVAS = { width: 360, height: 356 }
const TRANSFORM_PADDING = { top: 24, right: 28, bottom: 40, left: 40 }

const OBJECT_VERTICES = [
  { id: 'a', label: 'A', x: -1, y: 3 },
  { id: 'b', label: 'B', x: -3, y: 0 },
  { id: 'c', label: 'C', x: 0, y: -2 },
]

// Enlargement multiplies distance from the centre, so it needs a smaller object
// to stay on the same grid: scale factor 3 about (1, 1) already reaches ±8.
const ENLARGE_OBJECT_VERTICES = [
  { id: 'a', label: 'A', x: -1, y: 2 },
  { id: 'b', label: 'B', x: -2, y: 0 },
  { id: 'c', label: 'C', x: 0, y: -1 },
]

function signed(value) {
  return String(value).replace('-', MINUS)
}

// "−3 + −4" is not how anyone writes it, and a learner copying it into an exam
// loses the mark for the working, so a negative addend becomes a subtraction.
function sumText(from, change) {
  const operator = change < 0 ? `${MINUS} ${Math.abs(change)}` : `+ ${change}`
  return `${signed(from)} ${operator} = ${signed(from + change)}`
}

function polygonPath(vertices) {
  const steps = vertices
    .map((vertex, index) => `${index === 0 ? 'M' : 'L'} ${vertex.x} ${vertex.y}`)
    .join(' ')
  return `${steps} Z`
}

function segmentPath({ from, to }) {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
}

/**
 * The object vertex an active id refers to.
 *
 * Image points carry ids like `image-b` while the vertex arrays are keyed
 * `a`, `b`, `c`, so looking up the raw id fails for every image vertex — the
 * status silently falls back to A and no active guide is drawn. Normalise
 * first: `b` and `image-b` are two views of one pair.
 */
function pairIdOf(activeId) {
  return activeId?.replace(/^image-/, '') ?? null
}

/**
 * The option ids in force, whether they arrive as resolved `choices` from the
 * renderer or straight out of `values` (a preset derived directly, as tests and
 * the architecture contracts do). Availability is re-checked either way, so a
 * capability that has removed an option can never leave the scene pointing at
 * something the learner cannot see.
 */
function selectionFor(preset, values, context = {}) {
  return resolveOptionValues(
    preset,
    { ...values, ...(context.choices ?? {}) },
    context.capabilities ?? {},
  )
}

function centreOf(values) {
  return { x: values.cx, y: values.cy }
}

function centrePoint(centre) {
  return {
    id: 'centre',
    x: centre.x,
    y: centre.y,
    text: `Centre ${formatCoordinate(centre)}`,
    shortText: 'Centre',
    role: 'ruleLine',
    tier: 'related',
    focusable: false,
  }
}

// A guide from a point to itself renders as a stray dot on the plane rather
// than as meaning — it happens whenever the centre sits on a vertex, or the
// translation vector is zero.
function realGuides(guides) {
  return guides.filter(guide => guide.from.x !== guide.to.x || guide.from.y !== guide.to.y)
}

/**
 * The shared half of all four presets: the polygon pair, the vertex labels, the
 * pair-based status and the annotation policy. Everything a transformation
 * actually teaches — its rule geometry, its controls, which of them are worth
 * showing, and how its active pair is annotated — is supplied per preset.
 */
function createTransformationPreset(config) {
  const preset = {
    id: config.id,
    accessibilityLabel: config.accessibilityLabel,
    keyFact: config.keyFact,
    instruction: config.instruction,
    interactive: true,

    // Eight labelled points with eight sets of guide lines is exactly the
    // unreadable figure the annotation contract exists to prevent.
    supportsShowAllGuides: false,

    canvas: TRANSFORM_CANVAS,
    padding: TRANSFORM_PADDING,
    xAxis: { ...TRANSFORM_AXIS },
    yAxis: { ...TRANSFORM_AXIS },
    grid: { ...TRANSFORM_GRID },

    focusModes: [],
    defaultFocus: null,
    defaultActiveId: 'a',
    capabilities: config.capabilities,

    initialValues: config.initialValues,
    controls: config.controls,

    // The static list is every control's stepper — the reachability contract
    // reads it, and every declared control must be operable by something.
    steppers: config.steppers,

    // What the renderer actually renders. A visible control that changes a
    // number the current state ignores is worse than no control: it teaches
    // that input has no reliable effect.
    resolveSteppers(values, capabilities = {}) {
      return config.resolveSteppers
        ? config.resolveSteppers(values, capabilities, config.steppers)
        : config.steppers
    },

    resolveOptions(capabilities = {}, values) {
      return config.resolveOptions(capabilities, values ?? config.initialValues)
    },

    // Capabilities must CONSTRAIN, not merely hide. Without this a supplied
    // centre of (2, 2) still drives the whole figure while the learner is
    // given no control that reaches it — the capability suppresses the
    // evidence instead of pinning the lesson to the origin.
    resolveValues(values, capabilities = {}) {
      return config.resolveValues
        ? config.resolveValues(values, capabilities)
        : values
    },

    derive(values, context = {}) {
      const { activeId, showGuides = 'active' } = context
      const axes = context.axes ?? { x: preset.xAxis, y: preset.yAxis }
      const capabilities = context.capabilities ?? {}
      const choices = selectionFor(preset, values, context)

      const object = config.vertices.map(vertex => ({ ...vertex }))
      const image = object.map(vertex => ({
        ...vertex,
        ...config.transform(vertex, values, choices),
      }))

      const pairId = pairIdOf(activeId)
      const index = Math.max(0, object.findIndex(vertex => vertex.id === pairId))
      const pair = {
        id: object[index].id,
        label: object[index].label,
        object: object[index],
        image: image[index],
      }

      const annotate = showGuides !== 'none'
      const tierFor = id => (annotate && activeId === id ? 'active' : 'related')

      const points = []
      for (let position = 0; position < object.length; position += 1) {
        points.push({
          id: object[position].id,
          x: object[position].x,
          y: object[position].y,
          text: `${object[position].label} ${formatCoordinate(object[position])}`,
          shortText: object[position].label,
          role: 'object',
          tier: tierFor(object[position].id),
          focusable: true,
        })
        points.push({
          id: `image-${image[position].id}`,
          x: image[position].x,
          y: image[position].y,
          text: `${image[position].label}${PRIME} ${formatCoordinate(image[position])}`,
          shortText: `${image[position].label}${PRIME}`,
          role: 'image',
          tier: tierFor(`image-${image[position].id}`),
          focusable: true,
        })
      }
      points.push(...(config.extraPoints?.(values, choices) ?? []))

      const ruleGeometry = { object: pair.object, image: pair.image, pairId: pair.id }
      const shapes = [
        ...(config.ruleShapes?.(values, choices, axes) ?? []),
        ...(annotate ? config.activeShapes?.(values, choices, ruleGeometry) ?? [] : []),
        {
          id: 'object',
          path: polygonPath(object),
          strokeRole: 'object',
          fillRole: 'objectFill',
          modelPath: true,
        },
        {
          id: 'image',
          path: polygonPath(image),
          strokeRole: 'image',
          fillRole: 'imageFill',
          modelPath: true,
        },
      ]

      const guides = annotate
        ? realGuides(config.activeGuides(values, choices, capabilities, ruleGeometry))
        : []

      return {
        shapes,
        points,
        guides,
        handles: [],
        status: {
          heading: config.heading(values, choices),
          calculation: [
            `${pair.label} ${formatCoordinate(pair.object)} → ${pair.label}${PRIME} ${formatCoordinate(pair.image)}`,
            config.workingLine(values, choices, pair),
          ],
          explanation: config.explanation(values, choices),
        },
      }
    },

    describe(values, context = {}) {
      return config.describe(values, selectionFor(preset, values, context))
    },
  }

  return preset
}

// ─── translate ───────────────────────────────────────────────────────────────
//
// Model ranges reach the grid edge (A at y = 3 plus dy = 5 is exactly 8); the
// interaction range is the comfortable ±4 a learner steps through. The two are
// deliberately different: a supplied exam figure translated by 8 must render as
// given, not be pulled back to whatever a thumb could reach.

function vectorControl(id, label, { min, max }) {
  return {
    id,
    label,
    min,
    max,
    interactionMin: -4,
    interactionMax: 4,
    step: 1,
    valueText: values => `${label} ${values[id]}`,
    valueFromPointer: (_point, values) => values[id],
  }
}

export const translatePreset = createTransformationPreset({
  id: 'translate',
  accessibilityLabel: 'Coordinate plane showing a triangle and its translation',
  keyFact: 'A translation slides every point the same distance in the same direction.',
  instruction: 'Use the steppers to change the translation vector.',
  vertices: OBJECT_VERTICES,
  capabilities: {},

  initialValues: { dx: 3, dy: 2 },
  controls: [
    vectorControl('dx', 'Across', { min: -5, max: 8 }),
    vectorControl('dy', 'Up', { min: -6, max: 5 }),
  ],
  steppers: [
    { controlId: 'dx', label: 'Across (x)', group: 'vector' },
    { controlId: 'dy', label: 'Up (y)', group: 'vector' },
  ],
  resolveOptions: () => [],

  transform: (point, values) => translatePoint(point, { dx: values.dx, dy: values.dy }),

  // The vector drawn where it acts: from the vertex to its image.
  activeGuides: (values, choices, capabilities, { object, image }) => [
    {
      id: 'guide-vector',
      from: { x: object.x, y: object.y },
      to: { x: image.x, y: image.y },
      role: 'ruleLine',
    },
  ],

  heading: values => `Translation by (${signed(values.dx)}, ${signed(values.dy)})`,
  workingLine: (values, choices, pair) =>
    `x: ${sumText(pair.object.x, values.dx)}    y: ${sumText(pair.object.y, values.dy)}`,
  explanation: () =>
    'Every point moves the same distance in the same direction, so the image is the same size and the same way round.',
  describe: values =>
    `A triangle ABC and its image A${PRIME}B${PRIME}C${PRIME} after a translation by (${signed(values.dx)}, ${signed(values.dy)}).`,
})

// ─── reflect ─────────────────────────────────────────────────────────────────

const MIRROR_CHOICES = [
  { id: 'vertical', label: 'x = a' },
  { id: 'horizontal', label: 'y = b' },
]
const DIAGONAL_MIRROR_CHOICES = [
  { id: 'yEqualsX', label: 'y = x' },
  { id: 'yEqualsNegativeX', label: `y = ${MINUS}x` },
]

function mirrorLineName(mirror, value) {
  if (mirror === 'vertical') return `x = ${signed(value)}`
  if (mirror === 'horizontal') return `y = ${signed(value)}`
  return mirror === 'yEqualsX' ? 'y = x' : `y = ${MINUS}x`
}

function mirrorSegment(mirror, value, axes) {
  if (mirror === 'vertical') {
    return { from: { x: value, y: axes.y.min }, to: { x: value, y: axes.y.max } }
  }
  if (mirror === 'horizontal') {
    return { from: { x: axes.x.min, y: value }, to: { x: axes.x.max, y: value } }
  }
  if (mirror === 'yEqualsX') {
    return { from: { x: axes.x.min, y: axes.x.min }, to: { x: axes.x.max, y: axes.x.max } }
  }
  return { from: { x: axes.x.min, y: -axes.x.min }, to: { x: axes.x.max, y: -axes.x.max } }
}

function reflectionWorking(mirror, value, pair) {
  const from = pair.object
  const image = pair.image
  const line = mirrorLineName(mirror, value)

  if (mirror === 'yEqualsX') {
    return `Swap the coordinates: ${formatCoordinate(from)} → ${formatCoordinate(image)}.`
  }
  if (mirror === 'yEqualsNegativeX') {
    return `Swap the coordinates and change both signs: ${formatCoordinate(from)} → ${formatCoordinate(image)}.`
  }

  const gap = mirror === 'vertical' ? from.x - value : from.y - value
  if (gap === 0) return `${pair.label} sits on ${line}, so it does not move.`

  const near = mirror === 'vertical'
    ? (gap > 0 ? 'right of' : 'left of')
    : (gap > 0 ? 'above' : 'below')
  const far = mirror === 'vertical'
    ? (gap > 0 ? 'left of' : 'right of')
    : (gap > 0 ? 'below' : 'above')

  return `${pair.label} is ${Math.abs(gap)} ${near} ${line}, so ${pair.label}${PRIME} is ${Math.abs(gap)} ${far} it.`
}

export const reflectPreset = createTransformationPreset({
  id: 'reflect',
  accessibilityLabel: 'Coordinate plane showing a triangle reflected in a mirror line',
  keyFact: 'A reflection lands the same distance the other side of the mirror line.',
  instruction: 'Choose a mirror line and watch every vertex flip.',
  vertices: OBJECT_VERTICES,
  capabilities: { diagonalMirrorLines: true },

  initialValues: { mirrorValue: 2, mirror: 'vertical' },
  controls: [
    {
      id: 'mirrorValue',
      label: 'Mirror position',
      min: -2,
      max: 2,
      step: 1,
      valueText: values => `mirror at ${values.mirrorValue}`,
      valueFromPointer: (_point, values) => values.mirrorValue,
    },
  ],
  steppers: [{ controlId: 'mirrorValue', label: 'Mirror position' }],

  // y = x and y = −x have no position to set, so the stepper goes rather than
  // sitting there changing a number the diagram ignores.
  resolveSteppers: (values, capabilities, steppers) => {
    const mirror = resolveOptionValues(reflectPreset, values, capabilities).mirror
    return mirror === 'vertical' || mirror === 'horizontal' ? steppers : []
  },

  resolveOptions: capabilities => [{
    id: 'mirror',
    label: 'Mirror line',
    choices: capabilities.diagonalMirrorLines
      ? [...MIRROR_CHOICES, ...DIAGONAL_MIRROR_CHOICES]
      : [...MIRROR_CHOICES],
  }],

  transform: (point, values, choices) =>
    reflectPoint(point, { type: choices.mirror, value: values.mirrorValue }),

  ruleShapes: (values, choices, axes) => {
    const clipped = clipSegmentToBounds(
      mirrorSegment(choices.mirror, values.mirrorValue, axes),
      axes.x,
      axes.y,
    )
    if (!clipped) return []
    return [{
      id: 'mirror-line',
      path: segmentPath(clipped),
      strokeRole: 'ruleLine',
      dashed: true,
      modelPath: true,
    }]
  },

  // Vertex → image, which crosses the mirror at right angles.
  activeGuides: (values, choices, capabilities, { object, image }) => [
    {
      id: 'guide-mirror',
      from: { x: object.x, y: object.y },
      to: { x: image.x, y: image.y },
      role: 'ruleLine',
    },
  ],

  heading: (values, choices) =>
    `Reflection in ${mirrorLineName(choices.mirror, values.mirrorValue)}`,
  workingLine: (values, choices, pair) =>
    reflectionWorking(choices.mirror, values.mirrorValue, pair),
  explanation: () =>
    'A reflection lands the same distance the other side of the mirror line, measured at right angles to it.',
  describe: (values, choices) =>
    `A triangle ABC and its image A${PRIME}B${PRIME}C${PRIME} after a reflection in ${mirrorLineName(choices.mirror, values.mirrorValue)}.`,
})

// ─── rotate ──────────────────────────────────────────────────────────────────

function centreControl(id, label, { min, max }) {
  return {
    id,
    label,
    min,
    max,
    step: 1,
    valueText: values => `${label} ${values[id]}`,
    valueFromPointer: (_point, values) => values[id],
  }
}

const CENTRE_STEPPERS = [
  { controlId: 'cx', label: 'Centre x', group: 'centre' },
  { controlId: 'cy', label: 'Centre y', group: 'centre' },
]

// A centre that cannot leave the origin has nothing to step.
/**
 * Pins the centre to the origin when the tier does not allow it to move.
 *
 * Hiding the centre steppers is not enough. Without this the diagram happily
 * rotates about a supplied (2, 2) while offering the learner no control that
 * reaches it — the capability suppresses the evidence instead of constraining
 * the lesson. Pinning here makes the points, centre marker, guides, rays,
 * heading, working, description and the next onChange payload all agree.
 */
function pinCentreToOrigin(values, capabilities) {
  return capabilities.nonOriginCentre ? values : { ...values, cx: 0, cy: 0 }
}

function resolveCentreSteppers(values, capabilities, steppers) {
  return capabilities.nonOriginCentre ? steppers : []
}

function turnName(angle, direction) {
  // A half turn lands in the same place either way round, and mark schemes do
  // not ask for a direction with it.
  return angle === '180' ? '180°' : `${angle}° ${direction}`
}

export const rotatePreset = createTransformationPreset({
  id: 'rotate',
  accessibilityLabel: 'Coordinate plane showing a triangle rotated about a centre',
  keyFact: 'A rotation turns every point about a centre; distances from the centre never change.',
  instruction: 'Choose an angle and watch every vertex turn about the centre.',
  vertices: OBJECT_VERTICES,
  capabilities: { nonOriginCentre: false },

  initialValues: { cx: 0, cy: 0, angle: '90', direction: 'clockwise' },
  controls: [
    centreControl('cx', 'Centre x', { min: -2, max: 2 }),
    centreControl('cy', 'Centre y', { min: -2, max: 2 }),
  ],
  steppers: CENTRE_STEPPERS,
  resolveSteppers: resolveCentreSteppers,
  resolveValues: pinCentreToOrigin,

  // A half-turn reaches the same image either way, so at 180° the direction
  // group is not merely redundant: pressing it would change stored state while
  // changing no geometry, no heading and no mathematical meaning. That is the
  // same no-op control the mirror-position and centre steppers already avoid.
  // Returning to 90° or 270° restores it.
  resolveOptions: (_capabilities, values) => {
    const angle = {
      id: 'angle',
      label: 'Angle',
      choices: [
        { id: '90', label: '90°' },
        { id: '180', label: '180°' },
        { id: '270', label: '270°' },
      ],
    }
    const direction = {
      id: 'direction',
      label: 'Direction',
      choices: [
        { id: 'clockwise', label: 'Clockwise' },
        { id: 'anticlockwise', label: 'Anticlockwise' },
      ],
    }
    return values?.angle === '180' ? [angle] : [angle, direction]
  },

  transform: (point, values, choices) =>
    rotatePoint(point, centreOf(values), Number(choices.angle), choices.direction),

  extraPoints: values => [centrePoint(centreOf(values))],

  // Two radii about the centre, never an A → A′ chord: the chord implies the
  // point travelled in a straight line, which is the opposite of what a
  // rotation does. Equal radii are the fact worth seeing.
  activeGuides: (values, choices, capabilities, { object, image }) => {
    const centre = centreOf(values)
    return [
      {
        id: 'guide-centre-object',
        from: centre,
        to: { x: object.x, y: object.y },
        role: 'ruleLine',
      },
      {
        id: 'guide-centre-image',
        from: centre,
        to: { x: image.x, y: image.y },
        role: 'ruleLine',
      },
    ]
  },

  heading: (values, choices) =>
    `Rotation ${turnName(choices.angle, choices.direction)} about ${formatCoordinate(centreOf(values))}`,
  workingLine: (values, choices, pair) =>
    `${pair.label} and ${pair.label}${PRIME} are the same distance from ${formatCoordinate(centreOf(values))}.`,
  explanation: () =>
    'A rotation turns every point about the centre. Distances from the centre never change, so the image is the same size.',
  describe: (values, choices) =>
    `A triangle ABC and its image A${PRIME}B${PRIME}C${PRIME} after a rotation of ${turnName(choices.angle, choices.direction)} about the centre ${formatCoordinate(centreOf(values))}.`,
})

// ─── enlarge ─────────────────────────────────────────────────────────────────

const SCALE_LABELS = {
  '-2': `${MINUS}2`,
  '-1': `${MINUS}1`,
  0.25: '¼',
  0.5: '½',
  2: '2',
  3: '3',
}

function scaleLabel(scaleFactor) {
  return SCALE_LABELS[scaleFactor] ?? signed(scaleFactor)
}

/**
 * The ray direction depends on the scale factor, because a ray that always runs
 * centre → image stops showing the relationship as soon as the factor shrinks
 * or reverses.
 */
function enlargementRay(centre, object, image, factor) {
  if (factor < 0) return { from: { x: object.x, y: object.y }, to: { x: image.x, y: image.y } }
  if (factor > 1) return { from: centre, to: { x: image.x, y: image.y } }
  return { from: centre, to: { x: object.x, y: object.y } }
}

function enlargementExplanation(factor) {
  if (factor < 0) {
    return 'A negative scale factor puts the image on the other side of the centre and turns it upside down.'
  }
  if (factor < 1) {
    return 'A scale factor between 0 and 1 makes the image smaller — it is still called an enlargement.'
  }
  return 'Every distance from the centre is multiplied by the scale factor, so the image is a different size but the same shape.'
}

export const enlargePreset = createTransformationPreset({
  id: 'enlarge',
  accessibilityLabel: 'Coordinate plane showing a triangle enlarged from a centre',
  keyFact: 'An enlargement multiplies every distance from the centre by the scale factor.',
  instruction: 'Choose a scale factor and follow the centre–object–image relationship.',
  vertices: ENLARGE_OBJECT_VERTICES,
  capabilities: {
    fractionalScaleFactor: false,
    negativeScaleFactor: false,
    nonOriginCentre: false,
  },

  initialValues: { cx: 0, cy: 0, scaleFactor: '2' },
  controls: [
    centreControl('cx', 'Centre x', { min: -1, max: 1 }),
    centreControl('cy', 'Centre y', { min: -1, max: 1 }),
  ],
  steppers: CENTRE_STEPPERS,
  resolveSteppers: resolveCentreSteppers,
  resolveValues: pinCentreToOrigin,

  // Ordered smallest-effect-outward from the base pair, so enabling a
  // capability adds options in front rather than reshuffling them. The stored
  // default stays '2' whatever is enabled, because the default lives in
  // `initialValues` and not in "whatever is first in the list".
  resolveOptions: capabilities => [{
    id: 'scaleFactor',
    label: 'Scale factor',
    choices: [
      ...(capabilities.negativeScaleFactor ? ['-2', '-1'] : []),
      ...(capabilities.fractionalScaleFactor ? ['0.25', '0.5'] : []),
      '2',
      '3',
    ].map(id => ({ id, label: scaleLabel(id) })),
  }],

  transform: (point, values, choices) =>
    enlargePoint(point, centreOf(values), Number(choices.scaleFactor)),

  extraPoints: values => [centrePoint(centreOf(values))],

  activeShapes: (values, choices, { object, image, pairId }) => [{
    id: `ray-${pairId}`,
    path: segmentPath(enlargementRay(
      centreOf(values),
      object,
      image,
      Number(choices.scaleFactor),
    )),
    strokeRole: 'ruleLine',
    dashed: true,
    modelPath: true,
  }],

  activeGuides: () => [],

  heading: (values, choices) =>
    `Enlargement scale factor ${scaleLabel(choices.scaleFactor)}, centre ${formatCoordinate(centreOf(values))}`,
  workingLine: (values, choices, pair) => {
    const factor = Number(choices.scaleFactor)
    const tail = factor < 0 ? ', on the other side of the centre' : ''
    return `Centre to ${pair.label}${PRIME} is ${scaleLabel(choices.scaleFactor).replace(MINUS, '')} × centre to ${pair.label}${tail}.`
  },
  explanation: (values, choices) => enlargementExplanation(Number(choices.scaleFactor)),
  describe: (values, choices) =>
    `A triangle ABC and its image A${PRIME}B${PRIME}C${PRIME} after an enlargement by scale factor ${scaleLabel(choices.scaleFactor)} about the centre ${formatCoordinate(centreOf(values))}.`,
})
