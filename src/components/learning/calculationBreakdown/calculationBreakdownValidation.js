// ─── CalculationBreakdown — presentation validation ──────────────────────────
//
// The visual models never infer their maths from a display string. They are
// handed explicit numbers, and this file decides whether those numbers can
// honestly be drawn.
//
// A model that fails validation is refused, not repaired: the component logs
// the reason in development and falls back to the standard presentation, so a
// content mistake shows the ordinary walkthrough rather than three "equal"
// groups that are not equal.

import {
  OPERATION_TYPES,
  dividesExactly,
  isOperation,
  solveByUndoing,
  replayForwardCheck,
  toOperation,
} from './calculationBreakdownMath.js'

export const CALCULATION_VARIANTS = Object.freeze([
  'standard',
  'algebraWhy',
  'inverseMachine',
  'groupSplit',
  'balance',
])

// Introductory constraints for the first implementation. Group models must fit
// a 320px screen and divide exactly; anything outside this range is a content
// decision for a future fraction-group model, not something to approximate.
export const GROUP_MODEL_LIMITS = Object.freeze({
  minGroupCount: 2,
  maxGroupCount: 5,
  minTotal: 2,
  maxTotal: 30,
})

export const MACHINE_LIMITS = Object.freeze({
  minOperations: 1,
  maxOperations: 3,
})

export const BALANCE_LIMITS = Object.freeze({
  minStates: 1,
  maxStates: 3,
})

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0
}

// ── Variant validators ───────────────────────────────────────────────────────

function validateAlgebraWhy(model = {}) {
  const errors = []
  const { variable, coefficient, total, solution } = model

  if (!isNonEmptyString(variable)) errors.push('`variable` must be a non-empty string, e.g. "x".')
  if (!isPositiveInteger(coefficient)) errors.push('`coefficient` must be a positive whole number.')
  if (!isPositiveInteger(total)) errors.push('`total` must be a positive whole number.')

  if (isPositiveInteger(coefficient) && isPositiveInteger(total)) {
    if (coefficient < GROUP_MODEL_LIMITS.minGroupCount || coefficient > GROUP_MODEL_LIMITS.maxGroupCount) {
      errors.push(`\`coefficient\` must be between ${GROUP_MODEL_LIMITS.minGroupCount} and ${GROUP_MODEL_LIMITS.maxGroupCount} — more groups than that cannot be read at 320px.`)
    }
    if (total > GROUP_MODEL_LIMITS.maxTotal) {
      errors.push(`\`total\` must be at most ${GROUP_MODEL_LIMITS.maxTotal} — more counters than that cannot be counted on a phone.`)
    }
    if (!dividesExactly(total, coefficient)) {
      errors.push(`\`total\` (${total}) must divide exactly by \`coefficient\` (${coefficient}) — equal groups cannot be shown otherwise.`)
    } else if (solution !== undefined && solution !== total / coefficient) {
      errors.push(`\`solution\` (${solution}) does not match ${total} ÷ ${coefficient} = ${total / coefficient}.`)
    }
  }

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    model: {
      variable: variable.trim(),
      coefficient,
      total,
      solution: total / coefficient,
    },
  }
}

function validateInverseMachine(model = {}) {
  const errors = []
  const { variable, operations, result } = model

  if (!isNonEmptyString(variable)) errors.push('`variable` must be a non-empty string, e.g. "x".')
  if (!Array.isArray(operations) || operations.length === 0) {
    errors.push('`operations` must be a non-empty array of { type, value }.')
  } else if (operations.length > MACHINE_LIMITS.maxOperations) {
    errors.push(`\`operations\` must contain at most ${MACHINE_LIMITS.maxOperations} steps — a longer chain stops being one idea per screen.`)
  }
  if (!Number.isFinite(result)) errors.push('`result` must be a number.')

  const resolved = Array.isArray(operations) ? operations.map(toOperation) : []
  resolved.forEach((operation, index) => {
    if (!isOperation(operation)) {
      errors.push(`\`operations[${index}]\` must be one of ${OPERATION_TYPES.join(', ')} with a finite value (and never divide by 0).`)
      return
    }
    if (operation.type === 'multiply' && operation.value === 0) {
      errors.push(`\`operations[${index}]\` multiplies by 0, which cannot be undone.`)
    }
    // No-op steps have nothing to teach and leave the undo question with no
    // meaningful distractors.
    if ((operation.type === 'add' || operation.type === 'subtract') && operation.value === 0) {
      errors.push(`\`operations[${index}]\` adds or subtracts 0, which does nothing to the variable.`)
    }
    if ((operation.type === 'multiply' || operation.type === 'divide') && operation.value === 1) {
      errors.push(`\`operations[${index}]\` multiplies or divides by 1, which does nothing to the variable.`)
    }
  })

  if (errors.length > 0) return { valid: false, errors }

  const { solution, stages } = solveByUndoing(result, resolved)
  if (!Number.isInteger(solution)) {
    errors.push(`Undoing the machine gives ${solution}, which is not a whole number — this model does not present fractional solutions.`)
  }
  const check = replayForwardCheck(solution, resolved, result)
  if (!check.matches) {
    errors.push(`Replaying the machine from ${solution} gives ${check.result}, not the stated result ${result}.`)
  }

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    model: {
      variable: variable.trim(),
      operations: resolved,
      result,
      solution,
      undoStages: stages,
    },
  }
}

function validateGroupSplit(model = {}) {
  const errors = []
  const { variable, groupCount, total, solution } = model

  if (!isNonEmptyString(variable)) errors.push('`variable` must be a non-empty string, e.g. "x".')
  if (!isPositiveInteger(groupCount)) {
    errors.push('`groupCount` must be a positive whole number.')
  } else if (
    groupCount < GROUP_MODEL_LIMITS.minGroupCount
    || groupCount > GROUP_MODEL_LIMITS.maxGroupCount
  ) {
    errors.push(`\`groupCount\` must be between ${GROUP_MODEL_LIMITS.minGroupCount} and ${GROUP_MODEL_LIMITS.maxGroupCount}.`)
  }

  if (!isPositiveInteger(total)) {
    errors.push('`total` must be a positive whole number.')
  } else if (total < GROUP_MODEL_LIMITS.minTotal || total > GROUP_MODEL_LIMITS.maxTotal) {
    errors.push(`\`total\` must be between ${GROUP_MODEL_LIMITS.minTotal} and ${GROUP_MODEL_LIMITS.maxTotal} counters to stay countable at 320px.`)
  }

  if (isPositiveInteger(groupCount) && isPositiveInteger(total)) {
    if (!dividesExactly(total, groupCount)) {
      errors.push(`\`total\` (${total}) must divide exactly by \`groupCount\` (${groupCount}) — this model only shows exact equal groups.`)
    } else if (solution !== undefined && solution !== total / groupCount) {
      errors.push(`\`solution\` (${solution}) does not match ${total} ÷ ${groupCount} = ${total / groupCount}.`)
    }
  }

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    model: {
      variable: variable.trim(),
      groupCount,
      total,
      solution: total / groupCount,
    },
  }
}

function validateBalance(model = {}) {
  const errors = []
  const { states } = model

  if (!Array.isArray(states) || states.length === 0) {
    errors.push('`states` must be a non-empty array of balance transitions.')
  } else if (states.length > BALANCE_LIMITS.maxStates) {
    errors.push(`\`states\` must contain at most ${BALANCE_LIMITS.maxStates} transitions.`)
  }

  const resolved = []
  if (Array.isArray(states)) {
    states.forEach((state, index) => {
      const { left, right, operation, resultLeft, resultRight } = state || {}
      const parsed = toOperation(operation)

      if (!isNonEmptyString(left)) errors.push(`\`states[${index}].left\` must be a non-empty string.`)
      if (!isNonEmptyString(right)) errors.push(`\`states[${index}].right\` must be a non-empty string.`)
      if (!isNonEmptyString(resultLeft)) errors.push(`\`states[${index}].resultLeft\` must be a non-empty string.`)
      if (!isNonEmptyString(resultRight)) errors.push(`\`states[${index}].resultRight\` must be a non-empty string.`)
      if (!parsed) {
        errors.push(`\`states[${index}].operation\` must be { type, value } or a token such as "÷ 3" — free-form text is never parsed.`)
      }

      if (parsed && isNonEmptyString(left) && isNonEmptyString(right)) {
        resolved.push({
          left: left.trim(),
          right: right.trim(),
          operation: parsed,
          resultLeft: String(resultLeft ?? '').trim(),
          resultRight: String(resultRight ?? '').trim(),
          // Optional authored copy for the "change only one side" reveal.
          misconception: isNonEmptyString(state.misconception) ? state.misconception : null,
        })
      }
    })
  }

  if (errors.length > 0) return { valid: false, errors }

  return { valid: true, errors: [], model: { states: resolved } }
}

const VALIDATORS = Object.freeze({
  algebraWhy: validateAlgebraWhy,
  inverseMachine: validateInverseMachine,
  groupSplit: validateGroupSplit,
  balance: validateBalance,
})

/**
 * Resolves `block.presentation` into something renderable.
 *
 * Always returns a usable result: an invalid or unknown variant resolves to
 * `{ variant: 'standard' }` with the reasons attached, so the caller can log
 * them and still render the ordinary walkthrough.
 */
export function resolveCalculationPresentation(block) {
  const presentation = block?.presentation
  if (!presentation) return { variant: 'standard', model: null, errors: [], fellBack: false }

  const variant = presentation.variant ?? 'standard'
  if (variant === 'standard') return { variant: 'standard', model: null, errors: [], fellBack: false }

  if (!CALCULATION_VARIANTS.includes(variant)) {
    return {
      variant: 'standard',
      model: null,
      errors: [`Unknown presentation variant "${variant}". Expected one of: ${CALCULATION_VARIANTS.join(', ')}.`],
      fellBack: true,
    }
  }

  const result = VALIDATORS[variant](presentation.model)
  if (!result.valid) {
    return { variant: 'standard', model: null, errors: result.errors, fellBack: true, attempted: variant }
  }

  return {
    variant,
    model: result.model,
    reasoning: presentation.reasoning ?? null,
    errors: [],
    fellBack: false,
  }
}
