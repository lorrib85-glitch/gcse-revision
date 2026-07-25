// ─── NumberLineExplore presets ───────────────────────────────────────────────
//
// Each preset describes one number-line idea: the axis it needs, what is fixed,
// what the learner moves, and the live mathematical statement derived from it.
// Questions, marking and weakness tracking stay with the page that composes the
// component.
//
// Every preset identifies the active point in its task caption. Interactive use
// then adds the component's drag instruction below the line, while static diagrams
// keep accurate, non-interactive wording. Canvas heights remain content-tight.
//
// Roles are semantic names resolved through numberLineVisualRoles.js; presets
// never name a colour directly.

import {
  PRECISIONS,
  boundsFor,
  clamp,
  createAxis,
  formatFixed,
  formatFraction,
  formatNumber,
  orderingStatement,
  rankWithin,
  roundTo,
  roundToPrecision,
  roundingInterval,
  signedTerm,
  MINUS,
} from './numberLineGeometry.js'

// ─── 1. orderNumbers ─────────────────────────────────────────────────────────

const ORDER_REFERENCES = [
  { id: 'ref-a', value: -1.5, text: `${MINUS}1.5` },
  { id: 'ref-b', value: 0, text: '0' },
  { id: 'ref-c', value: 0.5, text: formatFraction(1, 2) },
  { id: 'ref-d', value: 0.75, text: '0.75' },
]

const orderNumbers = {
  id: 'orderNumbers',
  accessibilityLabel: 'Ordering numbers on a number line',
  keyFact: 'Numbers increase as you move right along the line. Fractions and decimals for the same value sit at the same point.',
  canvas: { width: 360, height: 162 },
  interactive: true,
  controls: () => [
    {
      id: 'value',
      label: 'Value to place on the line',
      min: -5,
      max: 5,
      step: 0.25,
      snapTargets: [-1.5, -1, 0, 0.5, 0.75, 1, 2, 3],
      valueText: values => `${formatNumber(values.value)}, position ${
        rankWithin(values.value, ORDER_REFERENCES.map(item => item.value))
      } of 5 from smallest`,
    },
  ],
  initialValues: () => ({ value: 2 }),
  derive(values) {
    const axis = createAxis({ min: -5, max: 5, majorStep: 1, minorStep: 0.5, y: 118 })
    const moved = { id: 'moved', value: values.value, text: formatNumber(values.value) }
    const all = [...ORDER_REFERENCES, moved]
    const matched = ORDER_REFERENCES.find(item => Math.abs(item.value - values.value) < 1e-6)
    const others = ORDER_REFERENCES.map(item => item.value)
    const rank = rankWithin(values.value, others)

    let explanation
    if (matched) {
      explanation = `${moved.text} lands on the same point as ${matched.text} — one value written two ways.`
    } else if (rank === 1) {
      explanation = `${moved.text} sits furthest left, so it is the smallest of the five.`
    } else if (rank === all.length) {
      explanation = `${moved.text} sits furthest right, so it is the largest of the five.`
    } else {
      const sorted = [...others].sort((a, b) => a - b)
      const before = ORDER_REFERENCES.find(item => item.value === sorted[rank - 2])
      const after = ORDER_REFERENCES.find(item => item.value === sorted[rank - 1])
      explanation = `${moved.text} sits between ${before.text} and ${after.text}.`
    }

    return {
      axis,
      caption: 'Order the values — blue is the movable point',
      markers: [
        ...ORDER_REFERENCES.map(item => ({
          id: item.id,
          value: item.value,
          role: 'reference',
          style: 'filled',
        })),
        {
          id: 'moved',
          value: values.value,
          role: 'interaction',
          style: 'filled',
          controlId: 'value',
        },
      ],
      chips: [
        ...ORDER_REFERENCES.map(item => ({
          id: `chip-${item.id}`,
          value: item.value,
          text: item.text,
          role: 'reference',
        })),
        { id: 'chip-moved', value: values.value, text: moved.text, role: 'interaction' },
      ],
      status: {
        heading: orderingStatement(all),
        headingRole: 'textPrimary',
        explanation,
      },
    }
  },
}

// ─── 2. negativeMovement ─────────────────────────────────────────────────────

const negativeMovement = {
  id: 'negativeMovement',
  accessibilityLabel: 'Adding and subtracting with negative numbers on a number line',
  keyFact: 'Moving right adds. Moving left subtracts. Adding a negative number moves left.',
  canvas: { width: 360, height: 136 },
  interactive: true,
  controls: () => [
    {
      id: 'start',
      label: 'Starting number',
      min: -10,
      max: 10,
      step: 1,
      snapTargets: [0],
      valueText: values => `Start at ${formatNumber(values.start)}`,
    },
    {
      id: 'move',
      label: 'Size of the move',
      min: -20,
      max: 20,
      step: 1,
      snapTargets: [0],
      valueFromAxis: (axisValue, values) => axisValue - values.start,
      valueText: values =>
        `Move ${signedTerm(values.move)}, landing on ${formatNumber(values.start + values.move)}`,
    },
  ],
  initialValues: () => ({ start: 3, move: -5 }),
  clampValues(values) {
    return {
      ...values,
      move: clamp(values.move, -10 - values.start, 10 - values.start),
    }
  },
  derive(values) {
    const axis = createAxis({ min: -10, max: 10, majorStep: 2, minorStep: 1, y: 92 })
    const landing = roundTo(values.start + values.move, 6)
    const steps = Math.abs(values.move)

    let explanation
    if (values.move === 0) {
      explanation = `No move — you stay at ${formatNumber(values.start)}.`
    } else if (values.move < 0) {
      explanation = `Adding a negative moves left: ${formatNumber(values.start)} ${MINUS} ${steps} = ${formatNumber(landing)}.`
    } else {
      explanation = `Start at ${formatNumber(values.start)}, move ${steps} ${steps === 1 ? 'step' : 'steps'} right.`
    }

    return {
      axis,
      caption: 'Follow the move — both highlighted points can move',
      jumps: values.move === 0
        ? []
        : [
            {
              id: 'move',
              from: values.start,
              to: landing,
              text: signedTerm(values.move),
              role: 'jump',
            },
          ],
      markers: [
        {
          id: 'start',
          value: values.start,
          role: 'reference',
          style: 'filled',
          controlId: 'start',
        },
        {
          id: 'landing',
          value: landing,
          role: 'interaction',
          style: 'filled',
          controlId: 'move',
        },
      ],
      chips: [
        { id: 'chip-start', value: values.start, text: formatNumber(values.start), role: 'reference' },
        { id: 'chip-landing', value: landing, text: formatNumber(landing), role: 'interaction' },
      ],
      status: {
        heading: `${formatNumber(values.start)} + ${signedTerm(values.move)} = ${formatNumber(landing)}`,
        headingRole: 'interaction',
        explanation,
      },
    }
  },
}

// ─── 3. roundingIntervals ────────────────────────────────────────────────────

const ROUNDING_SCALES = {
  ten: {
    axis: { min: 20, max: 60, majorStep: 10, minorStep: 2 },
    min: 20,
    max: 59,
    step: 1,
    initial: 43,
  },
  one: {
    axis: { min: 4, max: 8, majorStep: 1, minorStep: 0.2 },
    min: 4,
    max: 7.9,
    step: 0.1,
    initial: 6.4,
  },
  tenth: {
    axis: { min: 2.1, max: 2.5, majorStep: 0.1, minorStep: 0.02 },
    min: 2.1,
    max: 2.49,
    step: 0.01,
    initial: 2.34,
  },
}

const roundingIntervals = {
  id: 'roundingIntervals',
  accessibilityLabel: 'Rounding to the nearest interval on a number line',
  keyFact: 'A value rounds to whichever multiple it is nearer to. Exactly halfway rounds up.',
  canvas: { width: 360, height: 126 },
  interactive: true,
  options: [
    {
      id: 'precision',
      label: 'Round to',
      choices: [
        { id: 'ten', label: PRECISIONS.ten.short },
        { id: 'one', label: PRECISIONS.one.short },
        { id: 'tenth', label: PRECISIONS.tenth.short },
      ],
    },
  ],
  initialOptions: { precision: 'tenth' },
  controls: ({ options }) => {
    const scale = ROUNDING_SCALES[options.precision]
    return [
      {
        id: 'value',
        label: 'Value to round',
        min: scale.min,
        max: scale.max,
        step: scale.step,
        valueText: values => formatNumber(values.value),
      },
    ]
  },
  initialValues: ({ options }) => ({ value: ROUNDING_SCALES[options.precision].initial }),
  derive(values, { options }) {
    const precision = PRECISIONS[options.precision]
    const scale = ROUNDING_SCALES[options.precision]
    const axis = createAxis({ ...scale.axis, y: 64 })
    const { lower, upper, midpoint } = roundingInterval(values.value, precision.size)
    const rounded = roundToPrecision(values.value, precision.size)
    const roundsUp = rounded >= upper - 1e-6
    const atMidpoint = Math.abs(values.value - midpoint) < 1e-6

    let explanation
    if (atMidpoint) {
      explanation = `${formatNumber(values.value)} is exactly halfway. The rule is to round up, so it becomes ${formatNumber(rounded)}.`
    } else if (roundsUp) {
      explanation = `${formatNumber(values.value)} is past the halfway point ${formatNumber(midpoint)}, so it rounds up.`
    } else {
      explanation = `${formatNumber(values.value)} is below the halfway point ${formatNumber(midpoint)}, so it rounds down.`
    }

    return {
      axis,
      caption: `Round to ${precision.phrase} — blue is the value`,
      bands: [{ id: 'interval', from: lower, to: upper, role: 'bandAlt' }],
      markers: [
        { id: 'lower', value: lower, role: 'reference', style: 'filled' },
        { id: 'upper', value: upper, role: 'reference', style: 'filled' },
        { id: 'midpoint', value: midpoint, role: 'structure', style: 'open' },
        {
          id: 'value',
          value: values.value,
          role: 'interaction',
          style: 'filled',
          controlId: 'value',
        },
      ],
      chips: [
        { id: 'chip-value', value: values.value, text: formatNumber(values.value), role: 'interaction' },
      ],
      notes: [{ id: 'note-mid', value: midpoint, text: 'halfway', role: 'textMuted' }],
      status: {
        heading: `${formatNumber(values.value)} rounds to ${formatNumber(rounded)}`,
        headingRole: 'interaction',
        explanation,
      },
    }
  },
}

// ─── 4. inequalityRange ──────────────────────────────────────────────────────

const inequalityRange = {
  id: 'inequalityRange',
  accessibilityLabel: 'Representing an inequality on a number line',
  keyFact: 'A filled circle includes the endpoint (≤ or ≥). An open circle excludes it (< or >).',
  canvas: { width: 360, height: 108 },
  interactive: true,
  options: [
    {
      id: 'direction',
      label: 'Choose the direction',
      choices: [
        { id: 'above', label: 'Greater than' },
        { id: 'below', label: 'Less than' },
      ],
    },
    {
      id: 'endpointType',
      label: 'Choose the endpoint',
      choices: [
        { id: 'closed', label: 'Include endpoint' },
        { id: 'open', label: 'Exclude endpoint' },
      ],
    },
  ],
  initialOptions: { direction: 'above', endpointType: 'closed' },
  controls: () => [
    {
      id: 'endpoint',
      label: 'Endpoint of the inequality',
      min: -5,
      max: 5,
      step: 0.5,
      snapTargets: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      valueText: values => formatNumber(values.endpoint),
    },
  ],
  initialValues: () => ({ endpoint: -1 }),
  derive(values, { options }) {
    const axis = createAxis({ min: -5, max: 5, majorStep: 1, minorStep: 0.5, y: 66 })
    const above = options.direction === 'above'
    const closed = options.endpointType === 'closed'
    const point = formatNumber(values.endpoint)
    const symbol = above ? (closed ? '≥' : '>') : closed ? '≤' : '<'
    const notation = above
      ? `${closed ? '[' : '('}${point}, ∞)`
      : `(${MINUS}∞, ${point}${closed ? ']' : ')'}`

    return {
      axis,
      caption: 'Represent the inequality — blue is the endpoint',
      bands: [
        {
          id: 'range',
          from: above ? values.endpoint : axis.min,
          to: above ? axis.max : values.endpoint,
          role: 'band',
          arrowTo: above ? 1 : -1,
        },
      ],
      markers: [
        {
          id: 'endpoint',
          value: values.endpoint,
          role: 'interaction',
          style: closed ? 'filled' : 'open',
          controlId: 'endpoint',
        },
      ],
      chips: [
        { id: 'chip-endpoint', value: values.endpoint, text: point, role: 'interaction' },
      ],
      status: {
        heading: `x ${symbol} ${point}`,
        headingRole: 'interaction',
        explanation: closed
          ? `Interval notation ${notation}. The filled circle shows ${point} is included.`
          : `Interval notation ${notation}. The open circle shows ${point} is not included.`,
      },
    }
  },
}

// ─── 5. boundsInterval ───────────────────────────────────────────────────────

const BOUNDS_SCALES = {
  ten: {
    axis: { min: 55, max: 85, majorStep: 5, minorStep: 2.5 },
    min: 60,
    max: 80,
    initial: 70,
  },
  one: {
    axis: { min: 5.5, max: 8.5, majorStep: 0.5, minorStep: 0.25 },
    min: 6,
    max: 8,
    initial: 7,
  },
  tenth: {
    axis: { min: 2.15, max: 2.45, majorStep: 0.05, minorStep: 0.025 },
    min: 2.2,
    max: 2.4,
    initial: 2.3,
  },
}

const boundsInterval = {
  id: 'boundsInterval',
  accessibilityLabel: 'Upper and lower bounds of a rounded value',
  keyFact: 'A rounded value stands for a range: the lower bound is included, the upper bound is not.',
  canvas: { width: 360, height: 146 },
  interactive: true,
  options: [
    {
      id: 'precision',
      label: 'Rounded to',
      choices: [
        { id: 'ten', label: PRECISIONS.ten.short },
        { id: 'one', label: PRECISIONS.one.short },
        { id: 'tenth', label: PRECISIONS.tenth.short },
      ],
    },
  ],
  initialOptions: { precision: 'tenth' },
  controls: ({ options }) => {
    const scale = BOUNDS_SCALES[options.precision]
    return [
      {
        id: 'value',
        label: 'Rounded value',
        min: scale.min,
        max: scale.max,
        step: PRECISIONS[options.precision].size,
        valueText: values => formatNumber(values.value),
      },
    ]
  },
  initialValues: ({ options }) => ({ value: BOUNDS_SCALES[options.precision].initial }),
  derive(values, { options }) {
    const precision = PRECISIONS[options.precision]
    const scale = BOUNDS_SCALES[options.precision]
    const axis = createAxis({ ...scale.axis, y: 64 })
    const { lower, upper } = boundsFor(values.value, precision.size)
    const digits = precision.decimals + 1
    const lowerText = formatFixed(lower, digits)
    const upperText = formatFixed(upper, digits)

    return {
      axis,
      caption: `Find the bounds of ${formatNumber(values.value)} — blue is the rounded value`,
      bands: [{ id: 'error-interval', from: lower, to: upper, role: 'band', openTo: true }],
      markers: [
        { id: 'lower', value: lower, role: 'included', style: 'filled' },
        { id: 'upper', value: upper, role: 'excluded', style: 'open' },
        {
          id: 'value',
          value: values.value,
          role: 'interaction',
          style: 'filled',
          controlId: 'value',
        },
      ],
      chips: [
        { id: 'chip-value', value: values.value, text: formatNumber(values.value), role: 'interaction' },
      ],
      // The values already sit on labelled major ticks. Keeping these labels short
      // lets both sit directly beneath their own endpoints on the same tier.
      notes: [
        { id: 'note-lower', value: lower, text: 'included', role: 'includedLabel' },
        { id: 'note-upper', value: upper, text: 'excluded', role: 'excluded' },
      ],
      status: {
        heading: `${lowerText} ≤ x < ${upperText}`,
        headingRole: 'interaction',
        explanation: `Anything from ${lowerText} up to — but not including — ${upperText} rounds to ${formatNumber(values.value)}.`,
      },
    }
  },
}

// ─── 6. multiplyPattern ──────────────────────────────────────────────────────

const MULTIPLY_COUNTS = {
  2: { majorStep: 2, minorStep: 1 },
  3: { majorStep: 3, minorStep: 1 },
  5: { majorStep: 5, minorStep: 1 },
}

const multiplyPattern = {
  id: 'multiplyPattern',
  accessibilityLabel: 'Multiplication with negative numbers as repeated jumps',
  keyFact: 'The first factor tells you how many equal jumps to make. A negative second factor makes every jump move left.',
  canvas: { width: 360, height: 122 },
  interactive: true,
  options: [
    {
      id: 'base',
      label: 'Number of jumps',
      choices: [
        { id: '2', label: '2 jumps' },
        { id: '3', label: '3 jumps' },
        { id: '5', label: '5 jumps' },
      ],
    },
  ],
  initialOptions: { base: '3' },
  controls: ({ options }) => [
    {
      id: 'multiplier',
      label: 'Size and direction of each jump',
      min: -4,
      max: 4,
      step: 1,
      snapTargets: [0],
      valueFromAxis: axisValue => Math.round(axisValue / Number(options.base)),
      valueText: values => formatNumber(values.multiplier),
    },
  ],
  initialValues: () => ({ multiplier: -3 }),
  derive(values, { options }) {
    const jumpCount = Number(options.base)
    const scale = MULTIPLY_COUNTS[options.base]
    const reach = jumpCount * 4
    const axis = createAxis({ min: -reach, max: reach, ...scale, y: 82 })
    const jumpSize = values.multiplier
    const product = jumpCount * jumpSize
    const stepSize = Math.abs(jumpSize)
    const direction = jumpSize < 0 ? -1 : 1

    const jumps = jumpSize === 0
      ? []
      : Array.from({ length: jumpCount }, (_, index) => ({
          id: `jump-${index}`,
          from: direction * stepSize * index,
          to: direction * stepSize * (index + 1),
          text: formatNumber(jumpSize),
          role: 'jump',
        }))

    const explanation = jumpSize === 0
      ? `${jumpCount} jumps of 0 still land on zero.`
      : `${jumpCount} ${jumpCount === 1 ? 'jump' : 'jumps'} of ${stepSize}, ${
          direction < 0 ? 'left' : 'right'
        } of zero.`

    return {
      axis,
      caption: `Use ${jumpCount} equal jumps — blue is the product`,
      jumps,
      markers: [
        { id: 'origin', value: 0, role: 'reference', style: 'filled' },
        {
          id: 'product',
          value: product,
          role: 'interaction',
          style: 'filled',
          controlId: 'multiplier',
        },
      ],
      chips: [
        { id: 'chip-product', value: product, text: formatNumber(product), role: 'interaction' },
      ],
      status: {
        heading: `${jumpCount} × ${signedTerm(jumpSize)} = ${formatNumber(product)}`,
        headingRole: 'interaction',
        explanation,
      },
    }
  },
}

// ─── 7. estimateRange ────────────────────────────────────────────────────────

const ESTIMATE_EXACT = 609
const ESTIMATE_TOLERANCE = 0.1

const estimateRange = {
  id: 'estimateRange',
  accessibilityLabel: 'Judging whether an estimate is sensible on a number line',
  keyFact: 'An estimate is sensible when it lands near the exact answer. Rounding each number to one significant figure gets you there.',
  canvas: { width: 360, height: 126 },
  interactive: true,
  controls: () => [
    {
      id: 'estimate',
      label: 'Your estimate',
      min: 450,
      max: 750,
      step: 10,
      snapTargets: [500, 600, 700],
      valueText: values => formatNumber(values.estimate),
    },
  ],
  initialValues: () => ({ estimate: 600 }),
  derive(values) {
    const axis = createAxis({ min: 450, max: 750, majorStep: 50, minorStep: 10, y: 64 })
    const lower = roundTo(ESTIMATE_EXACT * (1 - ESTIMATE_TOLERANCE), 6)
    const upper = roundTo(ESTIMATE_EXACT * (1 + ESTIMATE_TOLERANCE), 6)
    const inside = values.estimate >= lower && values.estimate <= upper
    const gap = Math.round((Math.abs(values.estimate - ESTIMATE_EXACT) / ESTIMATE_EXACT) * 100)

    return {
      axis,
      caption: 'Estimate 29 × 21 — blue is your estimate',
      bands: [{ id: 'sensible', from: lower, to: upper, role: 'bandAlt' }],
      markers: [
        { id: 'exact', value: ESTIMATE_EXACT, role: 'reference', style: 'line' },
        {
          id: 'estimate',
          value: values.estimate,
          role: 'interaction',
          style: 'filled',
          controlId: 'estimate',
        },
      ],
      chips: [
        { id: 'chip-estimate', value: values.estimate, text: formatNumber(values.estimate), role: 'interaction' },
      ],
      notes: [
        { id: 'note-exact', value: ESTIMATE_EXACT, text: `exact ${ESTIMATE_EXACT}`, role: 'referenceLabel' },
      ],
      status: {
        heading: '30 × 20 = 600',
        headingRole: 'textPrimary',
        explanation: inside
          ? `Your estimate ${formatNumber(values.estimate)} is within ${gap}% of ${ESTIMATE_EXACT} — inside the sensible range.`
          : `Your estimate ${formatNumber(values.estimate)} is ${gap}% from ${ESTIMATE_EXACT} — outside the sensible range.`,
      },
    }
  },
}

export const NUMBER_LINE_PRESETS = {
  orderNumbers,
  negativeMovement,
  roundingIntervals,
  inequalityRange,
  boundsInterval,
  multiplyPattern,
  estimateRange,
}

export function resolveNumberLinePreset(preset) {
  if (typeof preset === 'string') {
    const found = NUMBER_LINE_PRESETS[preset]
    if (!found) throw new Error(`Unknown NumberLineExplore preset: ${preset}`)
    return found
  }
  return preset
}

export function resolvePresetOptions(presetConfig, overrides) {
  const defaults = presetConfig.initialOptions ?? {}
  return { ...defaults, ...(overrides ?? {}) }
}

export function clampPresetValues(presetConfig, values, context) {
  const controls = presetConfig.controls(context)
  const clamped = Object.fromEntries(
    controls.map(control => [
      control.id,
      roundTo(clamp(values?.[control.id] ?? 0, control.min, control.max), 6),
    ]),
  )
  return presetConfig.clampValues
    ? presetConfig.clampValues(clamped, context, controls)
    : clamped
}
