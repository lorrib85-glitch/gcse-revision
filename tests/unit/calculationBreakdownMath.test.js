import { describe, expect, it } from 'vitest'
import {
  applyOperation,
  countersByGroup,
  dealCounterToGroup,
  describeInverseRelationship,
  dividesExactly,
  formatNumber,
  formatOperation,
  formatTerm,
  inverseOperation,
  isOperation,
  operationSymbol,
  parseOperationToken,
  replayForwardCheck,
  reverseOperations,
  runOperations,
  solveByUndoing,
  splitIntoEqualGroups,
  toOperation,
} from '../../src/components/learning/calculationBreakdown/calculationBreakdownMath.js'

describe('inverseOperation', () => {
  it('pairs addition with subtraction and multiplication with division', () => {
    expect(inverseOperation({ type: 'add', value: 4 })).toEqual({ type: 'subtract', value: 4 })
    expect(inverseOperation({ type: 'subtract', value: 4 })).toEqual({ type: 'add', value: 4 })
    expect(inverseOperation({ type: 'multiply', value: 3 })).toEqual({ type: 'divide', value: 3 })
    expect(inverseOperation({ type: 'divide', value: 3 })).toEqual({ type: 'multiply', value: 3 })
  })

  it('is its own inverse when applied twice', () => {
    for (const operation of [
      { type: 'add', value: 7 },
      { type: 'subtract', value: 7 },
      { type: 'multiply', value: 5 },
      { type: 'divide', value: 5 },
    ]) {
      expect(inverseOperation(inverseOperation(operation))).toEqual(operation)
    }
  })

  it('refuses division by zero', () => {
    expect(isOperation({ type: 'divide', value: 0 })).toBe(false)
    expect(() => inverseOperation({ type: 'divide', value: 0 })).toThrow()
    expect(() => applyOperation(10, { type: 'divide', value: 0 })).toThrow()
  })

  it('refuses to invert multiplication by zero, which destroys the input', () => {
    expect(() => inverseOperation({ type: 'multiply', value: 0 })).toThrow(/no inverse/)
  })

  it('rejects unknown operation types', () => {
    expect(isOperation({ type: 'power', value: 2 })).toBe(false)
    expect(() => inverseOperation({ type: 'power', value: 2 })).toThrow()
  })
})

describe('applyOperation', () => {
  it('applies each operation exactly', () => {
    expect(applyOperation(15, { type: 'add', value: 4 })).toBe(19)
    expect(applyOperation(19, { type: 'subtract', value: 4 })).toBe(15)
    expect(applyOperation(5, { type: 'multiply', value: 3 })).toBe(15)
    expect(applyOperation(15, { type: 'divide', value: 3 })).toBe(5)
  })

  it('does not round an inexact division', () => {
    expect(applyOperation(10, { type: 'divide', value: 4 })).toBe(2.5)
  })
})

describe('reverseOperations', () => {
  it('inverts every operation and reverses the order', () => {
    const forward = [
      { type: 'multiply', value: 3 },
      { type: 'add', value: 4 },
    ]
    expect(reverseOperations(forward)).toEqual([
      { type: 'subtract', value: 4 },
      { type: 'divide', value: 3 },
    ])
  })

  it('leaves the original array untouched', () => {
    const forward = [{ type: 'multiply', value: 3 }, { type: 'add', value: 4 }]
    reverseOperations(forward)
    expect(forward).toEqual([{ type: 'multiply', value: 3 }, { type: 'add', value: 4 }])
  })
})

describe('solveByUndoing and replayForwardCheck', () => {
  const operations = [
    { type: 'multiply', value: 3 },
    { type: 'add', value: 4 },
  ]

  it('solves 3x + 4 = 19 by undoing in reverse order', () => {
    const { solution, stages } = solveByUndoing(19, operations)
    expect(solution).toBe(5)
    expect(stages.map(stage => stage.operation)).toEqual([
      { type: 'subtract', value: 4 },
      { type: 'divide', value: 3 },
    ])
    expect(stages.map(stage => [stage.from, stage.to])).toEqual([[19, 15], [15, 5]])
  })

  it('names the forward operation each undo cancels', () => {
    const { stages } = solveByUndoing(19, operations)
    expect(stages[0].undoes).toEqual({ type: 'add', value: 4 })
    expect(stages[1].undoes).toEqual({ type: 'multiply', value: 3 })
  })

  it('replays the forward machine back to the stated result', () => {
    const check = replayForwardCheck(5, operations, 19)
    expect(check.result).toBe(19)
    expect(check.matches).toBe(true)
    expect(check.stages.map(stage => stage.to)).toEqual([15, 19])
  })

  it('reports a mismatch rather than adjusting the answer', () => {
    expect(replayForwardCheck(6, operations, 19)).toMatchObject({ result: 22, matches: false })
  })

  it('round-trips: running forwards then undoing returns the start value', () => {
    const forward = runOperations(7, operations)
    expect(solveByUndoing(forward.result, operations).solution).toBe(7)
  })
})

describe('equal group splitting', () => {
  it('splits an exact total into equal whole groups', () => {
    expect(splitIntoEqualGroups(18, 3)).toMatchObject({
      exact: true,
      perGroup: 6,
      groups: [6, 6, 6],
    })
  })

  it('refuses an inexact total rather than rounding', () => {
    expect(dividesExactly(19, 3)).toBe(false)
    expect(splitIntoEqualGroups(19, 3)).toMatchObject({ exact: false, perGroup: null, groups: [] })
  })

  it('deals counters round-robin so groups never differ by more than one', () => {
    for (let dealt = 0; dealt <= 18; dealt += 1) {
      const groups = countersByGroup(dealt, 3)
      expect(groups.reduce((total, count) => total + count, 0)).toBe(dealt)
      expect(Math.max(...groups) - Math.min(...groups)).toBeLessThanOrEqual(1)
    }
  })

  it('ends with every group holding exactly the same amount', () => {
    expect(countersByGroup(18, 3)).toEqual([6, 6, 6])
    expect(dealCounterToGroup(0, 3)).toBe(0)
    expect(dealCounterToGroup(3, 3)).toBe(0)
    expect(dealCounterToGroup(4, 3)).toBe(1)
  })
})

describe('operation tokens', () => {
  it('reads the closed token grammar', () => {
    expect(parseOperationToken('÷ 3')).toEqual({ type: 'divide', value: 3 })
    expect(parseOperationToken('+4')).toEqual({ type: 'add', value: 4 })
    expect(parseOperationToken('− 12')).toEqual({ type: 'subtract', value: 12 })
    expect(parseOperationToken('× 2.5')).toEqual({ type: 'multiply', value: 2.5 })
  })

  it('refuses anything that is not one operator and one number', () => {
    for (const token of ['3x - 4', 'divide by 3', '÷', '÷ x', '3 ÷ 3', '', null, undefined, {}]) {
      expect(parseOperationToken(token)).toBeNull()
    }
  })

  it('refuses a token that divides by zero', () => {
    expect(parseOperationToken('÷ 0')).toBeNull()
  })

  it('accepts either the structured form or a token', () => {
    expect(toOperation({ type: 'divide', value: 3 })).toEqual({ type: 'divide', value: 3 })
    expect(toOperation('÷ 3')).toEqual({ type: 'divide', value: 3 })
    expect(toOperation('move the 3 across')).toBeNull()
  })
})

describe('learner-facing wording', () => {
  it('gives both-sides instructions in operation language', () => {
    expect(formatOperation({ type: 'divide', value: 3 }).bothSides).toBe('Divide both sides by 3')
    expect(formatOperation({ type: 'subtract', value: 4 }).bothSides).toBe('Subtract 4 from both sides')
    expect(formatOperation({ type: 'add', value: 4 }).bothSides).toBe('Add 4 to both sides')
    expect(formatOperation({ type: 'multiply', value: 2 }).bothSides).toBe('Multiply both sides by 2')
  })

  it('never describes a step as moving a term across', () => {
    for (const operation of [
      { type: 'add', value: 4 },
      { type: 'subtract', value: 4 },
      { type: 'multiply', value: 3 },
      { type: 'divide', value: 3 },
    ]) {
      const wording = formatOperation(operation)
      const copy = `${wording.plain} ${wording.instruction} ${wording.bothSides} ${wording.oneSide}`
      expect(copy).not.toMatch(/across|other side|change the sign|swap/i)
    }
  })

  it('states the plain relationship before the formal term', () => {
    expect(describeInverseRelationship({ type: 'multiply', value: 3 }))
      .toBe('Division undoes multiplication. These are inverse operations.')
    expect(describeInverseRelationship({ type: 'add', value: 4 }))
      .toBe('Subtraction undoes addition. These are inverse operations.')
  })

  it('formats terms and symbols without parsing anything', () => {
    expect(formatTerm(3, 'x')).toBe('3x')
    expect(formatTerm(1, 'x')).toBe('x')
    expect(formatTerm(-1, 'x')).toBe('−x')
    expect(operationSymbol({ type: 'divide', value: 3 })).toBe('÷ 3')
    expect(formatNumber(-2)).toBe('−2')
    expect(formatNumber(6)).toBe('6')
  })
})
