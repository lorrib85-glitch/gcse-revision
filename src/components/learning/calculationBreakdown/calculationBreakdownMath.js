// ─── CalculationBreakdown — algebra maths ────────────────────────────────────
//
// Pure number and operation work for the algebra presentations. Nothing here
// knows about pixels, colours, React or copy tone.
//
// Two rules shape this file:
//
// 1. No equation-string parsing. Every function takes explicit structured data
//    ({ type, value }, coefficient, total). The single string entry point,
//    parseOperationToken, accepts a closed grammar of five characters and a
//    number — it is a validated token reader, not an expression parser, and it
//    returns null rather than guessing.
// 2. No silent rounding. Division that does not come out exactly is reported
//    as inexact so the caller can refuse to draw a misleading model.

export const OPERATION_TYPES = Object.freeze(['add', 'subtract', 'multiply', 'divide'])

const INVERSE_TYPES = Object.freeze({
  add: 'subtract',
  subtract: 'add',
  multiply: 'divide',
  divide: 'multiply',
})

const SYMBOLS = Object.freeze({
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
})

// The plain-language phrase comes first everywhere in this file; the formal
// term is added alongside it rather than replacing it.
const PLAIN_VERBS = Object.freeze({
  add: 'add',
  subtract: 'subtract',
  multiply: 'multiply by',
  divide: 'divide by',
})

const TOKEN_TYPES = Object.freeze({
  '+': 'add',
  '−': 'subtract',
  '-': 'subtract',
  '×': 'multiply',
  '*': 'multiply',
  '÷': 'divide',
  '/': 'divide',
})

export function isOperation(operation) {
  return Boolean(
    operation
    && typeof operation === 'object'
    && OPERATION_TYPES.includes(operation.type)
    && Number.isFinite(operation.value)
    && !(operation.type === 'divide' && operation.value === 0),
  )
}

function requireOperation(operation) {
  if (!isOperation(operation)) {
    throw new Error(`Unsupported operation: ${JSON.stringify(operation)}`)
  }
  return operation
}

/**
 * The operation that undoes this one. Addition and subtraction undo each
 * other; multiplication and division undo each other. The value is unchanged —
 * only the action reverses.
 */
export function inverseOperation(operation) {
  const { type, value } = requireOperation(operation)
  if (type === 'multiply' && value === 0) {
    // Multiplying by zero destroys the input, so nothing can undo it.
    throw new Error('Multiplying by 0 has no inverse operation')
  }
  return { type: INVERSE_TYPES[type], value }
}

export function applyOperation(input, operation) {
  const { type, value } = requireOperation(operation)
  if (!Number.isFinite(input)) throw new Error(`Cannot apply an operation to ${input}`)

  switch (type) {
    case 'add': return input + value
    case 'subtract': return input - value
    case 'multiply': return input * value
    case 'divide': return input / value
    default: throw new Error(`Unsupported operation type: ${type}`)
  }
}

/**
 * The undo path: every operation inverted AND the order reversed. The last
 * action performed is the first one undone, which is the whole idea the
 * inverseMachine presentation teaches.
 */
export function reverseOperations(operations) {
  return [...operations].reverse().map(inverseOperation)
}

/** Runs the forward machine, keeping every intermediate value for the diagram. */
export function runOperations(start, operations) {
  const stages = []
  let value = start
  for (const operation of operations) {
    const from = value
    value = applyOperation(value, operation)
    stages.push({ operation, from, to: value })
  }
  return { start, stages, result: value }
}

/**
 * Works backwards from the result to the value of the variable, recording each
 * undo so the component can reveal them one at a time.
 */
export function solveByUndoing(result, operations) {
  const undoOperations = reverseOperations(operations)
  const stages = []
  let value = result
  for (let index = 0; index < undoOperations.length; index += 1) {
    const operation = undoOperations[index]
    const from = value
    value = applyOperation(value, operation)
    stages.push({
      operation,
      // The forward operation this undo cancels — the component names it.
      undoes: operations[operations.length - 1 - index],
      from,
      to: value,
    })
  }
  return { result, stages, solution: value }
}

/**
 * Substitution check: put the solution back through the original machine and
 * confirm it lands on the stated result.
 */
export function replayForwardCheck(solution, operations, expectedResult) {
  const run = runOperations(solution, operations)
  return { ...run, expectedResult, matches: run.result === expectedResult }
}

export function dividesExactly(total, groupCount) {
  return Number.isInteger(total)
    && Number.isInteger(groupCount)
    && groupCount > 0
    && total % groupCount === 0
}

/**
 * Splits a total into equal whole groups. Returns `exact: false` rather than
 * rounding — a model that shows unequal groups while claiming they are equal
 * teaches the wrong thing, so callers refuse to draw it.
 */
export function splitIntoEqualGroups(total, groupCount) {
  if (!dividesExactly(total, groupCount)) {
    return { exact: false, perGroup: null, groups: [], total, groupCount }
  }
  const perGroup = total / groupCount
  return {
    exact: true,
    perGroup,
    groups: Array.from({ length: groupCount }, () => perGroup),
    total,
    groupCount,
  }
}

/**
 * Round-robin dealing: counter index → group index. Dealing one at a time is
 * what makes "shared equally" visible, and this keeps every group within one
 * counter of every other at all times.
 */
export function dealCounterToGroup(counterIndex, groupCount) {
  return counterIndex % groupCount
}

export function countersByGroup(dealtCount, groupCount) {
  const groups = Array.from({ length: groupCount }, () => 0)
  for (let index = 0; index < dealtCount; index += 1) {
    groups[dealCounterToGroup(index, groupCount)] += 1
  }
  return groups
}

/**
 * A closed token grammar for authored operation labels: one of five operator
 * characters followed by a number. Anything else returns null and fails
 * validation — this never attempts to read an expression.
 */
export function parseOperationToken(token) {
  if (typeof token !== 'string') return null
  const match = token.trim().match(/^([+\-−×*÷/])\s*(\d+(?:\.\d+)?)$/)
  if (!match) return null
  const type = TOKEN_TYPES[match[1]]
  const value = Number(match[2])
  if (!type || !Number.isFinite(value)) return null
  const operation = { type, value }
  return isOperation(operation) ? operation : null
}

/** Accepts either the structured form or a validated token string. */
export function toOperation(input) {
  if (isOperation(input)) return { type: input.type, value: input.value }
  return parseOperationToken(input)
}

export function operationSymbol(operation) {
  const { type, value } = requireOperation(operation)
  return `${SYMBOLS[type]} ${formatNumber(value)}`
}

/**
 * Learner-facing wording for an operation, in the order the teaching voice
 * needs it: plain instruction first, both-sides instruction second.
 */
export function formatOperation(operation) {
  const { type, value } = requireOperation(operation)
  const number = formatNumber(value)
  const plain = type === 'subtract'
    ? `subtract ${number}`
    : type === 'add'
      ? `add ${number}`
      : `${PLAIN_VERBS[type]} ${number}`

  const bothSides = {
    add: `Add ${number} to both sides`,
    subtract: `Subtract ${number} from both sides`,
    multiply: `Multiply both sides by ${number}`,
    divide: `Divide both sides by ${number}`,
  }
  const oneSide = {
    add: `Add ${number} to one side only`,
    subtract: `Subtract ${number} from one side only`,
    multiply: `Multiply one side only by ${number}`,
    divide: `Divide one side only by ${number}`,
  }

  // Past tense, for describing what has already been done to a variable:
  // "x was multiplied by 3, then had 4 added".
  const past = {
    add: `had ${number} added`,
    subtract: `had ${number} subtracted`,
    multiply: `multiplied by ${number}`,
    divide: `divided by ${number}`,
  }

  return {
    symbol: operationSymbol(operation),
    plain,
    past: past[type],
    instruction: capitalise(plain),
    bothSides: bothSides[type],
    oneSide: oneSide[type],
  }
}

/**
 * "Division undoes multiplication. These are inverse operations." — simple
 * language first, then the correct term, every time.
 */
export function describeInverseRelationship(operation) {
  const nouns = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division',
  }
  const undone = {
    add: 'subtraction',
    subtract: 'addition',
    multiply: 'division',
    divide: 'multiplication',
  }
  const { type } = requireOperation(operation)
  const inverse = INVERSE_TYPES[type]
  return `${nouns[inverse]} undoes ${undone[inverse]}. These are inverse operations.`
}

/** `3x`, `x`, `−2x` — coefficient and variable, never a parsed string. */
export function formatTerm(coefficient, variable) {
  if (coefficient === 1) return variable
  if (coefficient === -1) return `−${variable}`
  return `${formatNumber(coefficient)}${variable}`
}

export function formatEquation(left, right) {
  return `${left} = ${right}`
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return String(value)
  const rounded = Number(value.toFixed(4))
  return rounded < 0 ? `−${Math.abs(rounded)}` : String(rounded)
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
