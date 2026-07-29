import { describe, expect, it } from 'vitest'
import {
  CALCULATION_VARIANTS,
  resolveCalculationPresentation,
} from '../../src/components/learning/calculationBreakdown/calculationBreakdownValidation.js'

const algebraBlock = { problem: '3x = 18', steps: [], solution: {} }

describe('backwards compatibility', () => {
  it('treats a block with no presentation as the standard walkthrough', () => {
    const result = resolveCalculationPresentation(algebraBlock)
    expect(result).toEqual({ variant: 'standard', model: null, errors: [], fellBack: false })
  })

  it('treats an explicit standard variant the same way', () => {
    const result = resolveCalculationPresentation({ ...algebraBlock, presentation: { variant: 'standard' } })
    expect(result.variant).toBe('standard')
    expect(result.fellBack).toBe(false)
  })

  it('falls back — with a reason — for an unknown variant', () => {
    const result = resolveCalculationPresentation({ presentation: { variant: 'hologram' } })
    expect(result.variant).toBe('standard')
    expect(result.fellBack).toBe(true)
    expect(result.errors[0]).toMatch(/Unknown presentation variant/)
  })

  it('lists exactly the supported variants', () => {
    expect(CALCULATION_VARIANTS).toEqual(['standard', 'algebraWhy', 'inverseMachine', 'groupSplit', 'balance'])
  })
})

describe('algebraWhy validation', () => {
  const valid = { variable: 'x', coefficient: 3, total: 18, solution: 6 }

  it('accepts an exact model and derives the solution itself', () => {
    const result = resolveCalculationPresentation({ presentation: { variant: 'algebraWhy', model: valid } })
    expect(result.variant).toBe('algebraWhy')
    expect(result.model).toEqual({ variable: 'x', coefficient: 3, total: 18, solution: 6 })
  })

  it('refuses a total that does not divide exactly', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'algebraWhy', model: { ...valid, total: 19 } },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/divide exactly/)
  })

  it('refuses a stated solution that contradicts the numbers', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'algebraWhy', model: { ...valid, solution: 7 } },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/does not match/)
  })

  it('refuses a total too large to count on a phone', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'algebraWhy', model: { variable: 'x', coefficient: 3, total: 300 } },
    })
    expect(result.variant).toBe('standard')
  })
})

describe('inverseMachine validation', () => {
  const valid = {
    variable: 'x',
    operations: [{ type: 'multiply', value: 3 }, { type: 'add', value: 4 }],
    result: 19,
  }

  it('derives the solution and the undo path from the forward operations', () => {
    const result = resolveCalculationPresentation({ presentation: { variant: 'inverseMachine', model: valid } })
    expect(result.variant).toBe('inverseMachine')
    expect(result.model.solution).toBe(5)
    expect(result.model.undoStages.map(stage => stage.operation)).toEqual([
      { type: 'subtract', value: 4 },
      { type: 'divide', value: 3 },
    ])
  })

  it('refuses a chain that does not solve to a whole number', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'inverseMachine', model: { ...valid, result: 20 } },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/not a whole number/)
  })

  it('refuses division by zero anywhere in the chain', () => {
    const result = resolveCalculationPresentation({
      presentation: {
        variant: 'inverseMachine',
        model: { variable: 'x', operations: [{ type: 'divide', value: 0 }], result: 4 },
      },
    })
    expect(result.variant).toBe('standard')
  })

  it('refuses a step that does nothing', () => {
    const result = resolveCalculationPresentation({
      presentation: {
        variant: 'inverseMachine',
        model: { variable: 'x', operations: [{ type: 'multiply', value: 1 }], result: 4 },
      },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/does nothing/)
  })
})

describe('groupSplit validation', () => {
  it('accepts an exact, phone-sized model', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'groupSplit', model: { variable: 'x', groupCount: 3, total: 18, solution: 6 } },
    })
    expect(result.variant).toBe('groupSplit')
    expect(result.model.solution).toBe(6)
  })

  it('refuses groups that would not be equal', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'groupSplit', model: { variable: 'x', groupCount: 3, total: 19 } },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/only shows exact equal groups/)
  })

  it('refuses group counts outside the supported introductory range', () => {
    for (const groupCount of [1, 6, 12]) {
      const result = resolveCalculationPresentation({
        presentation: { variant: 'groupSplit', model: { variable: 'x', groupCount, total: 12 } },
      })
      expect(result.variant).toBe('standard')
    }
  })
})

describe('balance validation', () => {
  const state = { left: '3x', right: '18', operation: '÷ 3', resultLeft: 'x', resultRight: '6' }

  it('accepts a validated operation token and keeps the sides as display strings', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'balance', model: { states: [state] } },
    })
    expect(result.variant).toBe('balance')
    expect(result.model.states[0]).toMatchObject({
      left: '3x',
      right: '18',
      operation: { type: 'divide', value: 3 },
      resultLeft: 'x',
      resultRight: '6',
    })
  })

  it('accepts the structured operation form too', () => {
    const result = resolveCalculationPresentation({
      presentation: {
        variant: 'balance',
        model: { states: [{ ...state, operation: { type: 'divide', value: 3 } }] },
      },
    })
    expect(result.model.states[0].operation).toEqual({ type: 'divide', value: 3 })
  })

  it('refuses free-form operation text rather than guessing at it', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'balance', model: { states: [{ ...state, operation: 'move the 3 across' }] } },
    })
    expect(result.variant).toBe('standard')
    expect(result.errors.join(' ')).toMatch(/never parsed/)
  })

  it('requires both result sides so a transition cannot be half-authored', () => {
    const result = resolveCalculationPresentation({
      presentation: { variant: 'balance', model: { states: [{ ...state, resultRight: '' }] } },
    })
    expect(result.variant).toBe('standard')
  })
})
