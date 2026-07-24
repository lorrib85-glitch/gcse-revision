// ─── fractionOperations ──────────────────────────────────────────────────────
//
// Five operations on the same whole, each with its own short step sequence.
// This is the only preset in the family that steps, because for operations the
// intermediate states are the teaching — a learner who is shown only the answer
// has been shown the least useful part.
//
// Method and step are owned by FractionRatioExplore and passed into derive;
// this file routes them to the right scene builder and nothing else.

import { ADD_SUBTRACT_STEPS, deriveAddSubtract } from './addSubtract.js'
import { MULTIPLY_STEPS, deriveMultiply } from './multiply.js'
import { DIVIDE_STEPS, deriveDivide } from './divide.js'
import { OF_AMOUNT_STEPS, deriveOfAmount } from './ofAmount.js'

const METHOD_STEPS = {
  add: ADD_SUBTRACT_STEPS,
  subtract: ADD_SUBTRACT_STEPS,
  multiply: MULTIPLY_STEPS,
  divide: DIVIDE_STEPS,
  ofAmount: OF_AMOUNT_STEPS,
}

const fractionOperations = {
  id: 'fractionOperations',
  accessibilityLabel: 'Fraction operations explorer',
  keyFact: 'Fractions can only be added or subtracted when their parts are the same size. Multiplying and dividing do not need a common denominator.',
  canvas: { width: 360, height: 296 },
  interactive: true,

  methods: [
    { id: 'add', label: 'Add' },
    { id: 'subtract', label: 'Subtract' },
    { id: 'multiply', label: 'Multiply' },
    { id: 'divide', label: 'Divide' },
    { id: 'ofAmount', label: 'Of an amount' },
  ],

  stepsFor: method => METHOD_STEPS[method] ?? [],

  controls: [
    {
      id: 'numeratorA',
      label: 'First numerator',
      min: 1,
      max: 11,
      step: 1,
      stepper: ['add', 'subtract', 'multiply', 'divide', 'ofAmount'],
      valueText: values => `first fraction ${values.numeratorA} over ${values.denominatorA}`,
    },
    { id: 'denominatorA', label: 'First denominator', min: 2, max: 12, step: 1 },
    {
      id: 'numeratorB',
      label: 'Second numerator',
      min: 1,
      max: 11,
      step: 1,
      stepper: ['add', 'subtract', 'multiply', 'divide'],
      valueText: values => `second fraction ${values.numeratorB} over ${values.denominatorB}`,
    },
    { id: 'denominatorB', label: 'Second denominator', min: 2, max: 12, step: 1 },
    {
      id: 'amount',
      label: 'Amount',
      min: 2,
      max: 60,
      step: 1,
      stepper: ['ofAmount'],
      valueText: values => `an amount of ${values.amount}`,
    },
  ],

  initialValues: {
    numeratorA: 2,
    denominatorA: 3,
    numeratorB: 1,
    denominatorB: 4,
    amount: 20,
  },

  // Proper fractions only: an improper operand is mathematically fine but
  // cannot be drawn inside one whole, and here the diagram is the argument.
  //
  // Subtraction additionally holds the second fraction at or below the first.
  // A negative result is valid maths but not a drawable part of a whole, and a
  // bar that cannot show the answer would undercut the very thing being taught.
  normalise: (values, { method } = {}) => {
    const numeratorA = Math.min(values.numeratorA, values.denominatorA)
    let numeratorB = Math.min(values.numeratorB, values.denominatorB)

    if (method === 'subtract') {
      const maxB = Math.floor((numeratorA / values.denominatorA) * values.denominatorB)
      numeratorB = Math.max(Math.min(numeratorB, maxB), 0)
    }

    return { ...values, numeratorA, numeratorB }
  },

  derive(values, { method = 'add', step } = {}) {
    const steps = METHOD_STEPS[method] ?? ADD_SUBTRACT_STEPS
    const activeStep = steps.some(entry => entry.id === step) ? step : steps[0].id

    if (method === 'multiply') return deriveMultiply(values, { step: activeStep })
    if (method === 'divide') return deriveDivide(values, { step: activeStep })
    if (method === 'ofAmount') return deriveOfAmount(values, { step: activeStep })

    return deriveAddSubtract(values, { step: activeStep, isSubtract: method === 'subtract' })
  },
}

export default fractionOperations
