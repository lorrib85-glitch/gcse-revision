import { describe, expect, it } from 'vitest'
import {
  addFractions,
  bestValueComparison,
  divideFractions,
  formatFraction,
  fractionOfAmount,
  gcd,
  lcm,
  multiplyFractions,
  scaleFraction,
  shareAmount,
  simplifyFraction,
  simplifyRatio,
  subtractFractions,
  toCommonDenominator,
  toDecimal,
  toMixedNumber,
  toPercent,
  unitRate,
} from '../../src/components/learning/fractionRatio/fractionRatioMath.js'

describe('gcd and lcm', () => {
  it('finds the greatest common divisor', () => {
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(7, 13)).toBe(1)
    expect(gcd(9, 9)).toBe(9)
  })

  it('treats a zero operand as the other value', () => {
    expect(gcd(0, 5)).toBe(5)
    expect(gcd(5, 0)).toBe(5)
  })

  it('ignores sign', () => {
    expect(gcd(-12, 18)).toBe(6)
  })

  it('finds the lowest common multiple', () => {
    expect(lcm(3, 4)).toBe(12)
    expect(lcm(6, 4)).toBe(12)
    expect(lcm(5, 5)).toBe(5)
  })
})

describe('simplifyFraction', () => {
  it('reduces to simplest form', () => {
    expect(simplifyFraction(4, 8)).toEqual({ numerator: 1, denominator: 2, divisor: 4 })
    expect(simplifyFraction(9, 12)).toEqual({ numerator: 3, denominator: 4, divisor: 3 })
  })

  it('leaves a fraction already in simplest form untouched, with divisor 1', () => {
    expect(simplifyFraction(3, 4)).toEqual({ numerator: 3, denominator: 4, divisor: 1 })
  })

  it('simplifies a whole number to denominator 1', () => {
    expect(simplifyFraction(6, 3)).toEqual({ numerator: 2, denominator: 1, divisor: 3 })
  })

  it('handles a zero numerator', () => {
    expect(simplifyFraction(0, 5)).toEqual({ numerator: 0, denominator: 1, divisor: 5 })
  })
})

describe('scaleFraction', () => {
  it('multiplies both parts by the same number', () => {
    expect(scaleFraction(1, 2, 4)).toEqual({ numerator: 4, denominator: 8 })
  })
})

describe('toCommonDenominator', () => {
  it('converts both fractions to the lowest common denominator', () => {
    expect(toCommonDenominator(2, 3, 1, 4)).toEqual({
      denominator: 12,
      a: { numerator: 8, denominator: 12, multiplier: 4 },
      b: { numerator: 3, denominator: 12, multiplier: 3 },
    })
  })

  it('leaves matching denominators alone with multiplier 1', () => {
    const result = toCommonDenominator(1, 5, 2, 5)
    expect(result.denominator).toBe(5)
    expect(result.a.multiplier).toBe(1)
    expect(result.b.multiplier).toBe(1)
  })

  it('uses the larger denominator when one is a multiple of the other', () => {
    expect(toCommonDenominator(1, 2, 1, 6).denominator).toBe(6)
  })
})

describe('fraction arithmetic', () => {
  it('adds unlike fractions and reports the common-denominator working', () => {
    const result = addFractions(2, 3, 1, 4)
    expect(result.common.denominator).toBe(12)
    expect(result.raw).toEqual({ numerator: 11, denominator: 12 })
    expect(result.simplified).toEqual({ numerator: 11, denominator: 12 })
    expect(result.wasSimplified).toBe(false)
  })

  it('simplifies an addition result when it is not in simplest form', () => {
    const result = addFractions(1, 4, 1, 4)
    expect(result.raw).toEqual({ numerator: 2, denominator: 4 })
    expect(result.simplified).toEqual({ numerator: 1, denominator: 2 })
    expect(result.wasSimplified).toBe(true)
  })

  it('subtracts unlike fractions', () => {
    const result = subtractFractions(3, 4, 2, 3)
    expect(result.common.denominator).toBe(12)
    expect(result.raw).toEqual({ numerator: 1, denominator: 12 })
  })

  it('multiplies across, keeping the unsimplified product for the area model', () => {
    const result = multiplyFractions(2, 3, 3, 4)
    expect(result.raw).toEqual({ numerator: 6, denominator: 12 })
    expect(result.simplified).toEqual({ numerator: 1, denominator: 2 })
    expect(result.wasSimplified).toBe(true)
  })

  it('divides by multiplying by the reciprocal', () => {
    const result = divideFractions(3, 5, 1, 2)
    expect(result.reciprocal).toEqual({ numerator: 2, denominator: 1 })
    expect(result.raw).toEqual({ numerator: 6, denominator: 5 })
    expect(result.simplified).toEqual({ numerator: 6, denominator: 5 })
  })

  it('counts how many divisor-sized pieces fit into the dividend', () => {
    // 3/5 ÷ 1/2 — six halves fit, in fifths-of-a-half pieces.
    expect(divideFractions(3, 5, 1, 2).fitCount).toEqual({ numerator: 6, denominator: 5 })
  })
})

describe('toMixedNumber', () => {
  it('splits an improper fraction into whole and part', () => {
    expect(toMixedNumber(6, 5)).toEqual({ whole: 1, numerator: 1, denominator: 5 })
    expect(toMixedNumber(11, 4)).toEqual({ whole: 2, numerator: 3, denominator: 4 })
  })

  it('reports a proper fraction with a zero whole part', () => {
    expect(toMixedNumber(3, 4)).toEqual({ whole: 0, numerator: 3, denominator: 4 })
  })

  it('reports an exact whole number with no fractional part', () => {
    expect(toMixedNumber(8, 4)).toEqual({ whole: 2, numerator: 0, denominator: 4 })
  })
})

describe('fractionOfAmount', () => {
  it('divides by the denominator then multiplies by the numerator', () => {
    expect(fractionOfAmount(3, 4, 20)).toEqual({
      partSize: 5,
      result: 15,
      isExact: true,
    })
  })

  it('flags an amount that does not divide exactly', () => {
    const result = fractionOfAmount(2, 3, 10)
    expect(result.isExact).toBe(false)
    expect(result.result).toBeCloseTo(6.67, 2)
  })
})

describe('ratio', () => {
  it('simplifies a ratio by its greatest common divisor', () => {
    expect(simplifyRatio([6, 4])).toEqual({ parts: [3, 2], divisor: 2 })
    expect(simplifyRatio([10, 15, 25])).toEqual({ parts: [2, 3, 5], divisor: 5 })
  })

  it('leaves a ratio already in simplest form untouched', () => {
    expect(simplifyRatio([3, 2])).toEqual({ parts: [3, 2], divisor: 1 })
  })

  it('shares an amount in a given ratio', () => {
    expect(shareAmount(40, [3, 2])).toEqual({
      totalParts: 5,
      unit: 8,
      shares: [24, 16],
      isExact: true,
    })
  })

  it('flags a total that does not divide into whole shares', () => {
    expect(shareAmount(10, [3, 2, 2]).isExact).toBe(false)
  })
})

describe('proportion and value', () => {
  it('finds a unit rate', () => {
    expect(unitRate(4, 5)).toBe(1.25)
  })

  it('compares two products per unit and names the better value', () => {
    const result = bestValueComparison(
      { label: 'Pack A', quantity: 500, price: 6 },
      { label: 'Pack B', quantity: 750, price: 8.4 },
      { basis: 'perQuantity' },
    )
    // A: 6 / 500 = 0.012 per g. B: 8.40 / 750 = 0.0112 per g.
    expect(result.betterIndex).toBe(1)
    expect(result.rates[0]).toBeCloseTo(0.012, 5)
    expect(result.rates[1]).toBeCloseTo(0.0112, 5)
  })

  it('reaches the same verdict measured the other way round', () => {
    const result = bestValueComparison(
      { label: 'Pack A', quantity: 500, price: 6 },
      { label: 'Pack B', quantity: 750, price: 8.4 },
      { basis: 'perPrice' },
    )
    // Quantity per £ — here more is better, so the verdict must still be B.
    expect(result.betterIndex).toBe(1)
  })

  it('reports a tie when both products cost the same per unit', () => {
    const result = bestValueComparison(
      { label: 'A', quantity: 100, price: 2 },
      { label: 'B', quantity: 200, price: 4 },
      { basis: 'perQuantity' },
    )
    expect(result.betterIndex).toBe(null)
  })
})

describe('fraction–decimal–percentage conversion', () => {
  it('converts a fraction to a decimal without floating-point noise', () => {
    expect(toDecimal(1, 4)).toBe(0.25)
    expect(toDecimal(45, 100)).toBe(0.45)
    expect(toDecimal(1, 3)).toBeCloseTo(0.333, 3)
  })

  it('converts a fraction to a percentage', () => {
    expect(toPercent(1, 4)).toBe(25)
    expect(toPercent(45, 100)).toBe(45)
  })
})

describe('formatFraction', () => {
  it('renders a fraction as a slash form', () => {
    expect(formatFraction(3, 4)).toBe('3/4')
  })

  it('drops a denominator of 1', () => {
    expect(formatFraction(2, 1)).toBe('2')
  })
})
