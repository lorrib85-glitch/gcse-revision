// ─── FractionRatioExplore maths ──────────────────────────────────────────────
//
// Pure number work for the part-whole family: fractions, ratio, proportion and
// percentages. Nothing here knows about pixels, colours or React.
//
// Every function returns the *working* as well as the answer — the multiplier
// that took a fraction to a common denominator, the divisor that simplified a
// ratio, the unsimplified product an area model actually shows. The diagram is
// only honest if it can draw the intermediate step the learner is looking at,
// so the maths layer never throws that step away.

import { roundTo } from '../geometry/shapeGeometry.js'

export function gcd(a, b) {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) {
    const next = x % y
    x = y
    y = next
  }
  return x
}

export function lcm(a, b) {
  const divisor = gcd(a, b)
  return divisor === 0 ? 0 : Math.abs(a * b) / divisor
}

// The divisor is reported so a preset can say "divide both by 4", not just show
// the answer. A zero numerator simplifies to 0/1 rather than dividing by zero.
export function simplifyFraction(numerator, denominator) {
  if (numerator === 0) {
    return { numerator: 0, denominator: 1, divisor: denominator || 1 }
  }
  const divisor = gcd(numerator, denominator) || 1
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
    divisor,
  }
}

export function isSimplestForm(numerator, denominator) {
  return gcd(numerator, denominator) === 1
}

export function scaleFraction(numerator, denominator, multiplier) {
  return {
    numerator: numerator * multiplier,
    denominator: denominator * multiplier,
  }
}

// Both fractions re-expressed over their lowest common denominator, each
// carrying the multiplier that got it there — that multiplier is what the
// "×4 / ×3" annotation in the diagram renders.
export function toCommonDenominator(numeratorA, denominatorA, numeratorB, denominatorB) {
  const denominator = lcm(denominatorA, denominatorB)
  const multiplierA = denominator / denominatorA
  const multiplierB = denominator / denominatorB

  return {
    denominator,
    a: { numerator: numeratorA * multiplierA, denominator, multiplier: multiplierA },
    b: { numerator: numeratorB * multiplierB, denominator, multiplier: multiplierB },
  }
}

function withSimplified(numerator, denominator, extra = {}) {
  const simplified = simplifyFraction(numerator, denominator)
  return {
    raw: { numerator, denominator },
    simplified: { numerator: simplified.numerator, denominator: simplified.denominator },
    divisor: simplified.divisor,
    wasSimplified: simplified.divisor > 1,
    ...extra,
  }
}

export function addFractions(numeratorA, denominatorA, numeratorB, denominatorB) {
  const common = toCommonDenominator(numeratorA, denominatorA, numeratorB, denominatorB)
  return withSimplified(
    common.a.numerator + common.b.numerator,
    common.denominator,
    { common },
  )
}

export function subtractFractions(numeratorA, denominatorA, numeratorB, denominatorB) {
  const common = toCommonDenominator(numeratorA, denominatorA, numeratorB, denominatorB)
  return withSimplified(
    common.a.numerator - common.b.numerator,
    common.denominator,
    { common },
  )
}

// The raw product is kept unsimplified on purpose: the area model draws
// numeratorA × numeratorB overlapping cells out of denominatorA × denominatorB,
// and that grid must match the numbers on screen before any simplifying.
export function multiplyFractions(numeratorA, denominatorA, numeratorB, denominatorB) {
  return withSimplified(numeratorA * numeratorB, denominatorA * denominatorB)
}

// Division as "how many b-sized pieces fit into a" — fitCount is that count,
// which is the same value as the quotient but named for what the strip shows.
export function divideFractions(numeratorA, denominatorA, numeratorB, denominatorB) {
  const product = multiplyFractions(numeratorA, denominatorA, denominatorB, numeratorB)
  const flipped = simplifyFraction(denominatorB, numeratorB)
  return {
    ...product,
    reciprocal: { numerator: flipped.numerator, denominator: flipped.denominator },
    fitCount: product.simplified,
  }
}

export function toMixedNumber(numerator, denominator) {
  const whole = Math.floor(numerator / denominator)
  return {
    whole,
    numerator: numerator - whole * denominator,
    denominator,
  }
}

// The GCSE method, in the GCSE order: divide by the denominator to find one
// part, then multiply by the numerator. partSize is that one part, so a diagram
// can label it directly.
export function fractionOfAmount(numerator, denominator, amount) {
  const partSize = amount / denominator
  return {
    partSize: roundTo(partSize, 4),
    result: roundTo(partSize * numerator, 4),
    isExact: Number.isInteger(partSize),
  }
}

export function simplifyRatio(parts) {
  const divisor = parts.reduce((running, part) => gcd(running, part), 0) || 1
  return {
    parts: parts.map(part => part / divisor),
    divisor,
  }
}

export function shareAmount(total, parts) {
  const totalParts = parts.reduce((sum, part) => sum + part, 0)
  const unit = total / totalParts
  return {
    totalParts,
    unit: roundTo(unit, 4),
    shares: parts.map(part => roundTo(unit * part, 4)),
    isExact: Number.isInteger(unit),
  }
}

export function unitRate(quantity, total) {
  return quantity === 0 ? 0 : roundTo(total / quantity, 6)
}

/**
 * Compare two products and name the better value.
 *
 * `perQuantity` measures price per unit of stuff — lower wins. `perPrice`
 * measures stuff per unit of money — higher wins. Both must reach the same
 * verdict, which is exactly the point being taught: it does not matter which
 * way round you divide, as long as you compare like with like.
 */
export function bestValueComparison(productA, productB, { basis = 'perQuantity' } = {}) {
  const products = [productA, productB]
  const rates = products.map(product => (
    basis === 'perQuantity'
      ? unitRate(product.quantity, product.price)
      : unitRate(product.price, product.quantity)
  ))

  const lowerIsBetter = basis === 'perQuantity'
  const [first, second] = rates

  let betterIndex = null
  if (first !== second) {
    const firstWins = lowerIsBetter ? first < second : first > second
    betterIndex = firstWins ? 0 : 1
  }

  return { basis, rates, betterIndex, lowerIsBetter, products }
}

export function toDecimal(numerator, denominator) {
  return roundTo(numerator / denominator, 6)
}

export function toPercent(numerator, denominator) {
  return roundTo((numerator / denominator) * 100, 4)
}

export function formatFraction(numerator, denominator) {
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`
}

// Trailing zeros removed, so a status line reads "0.45" and "1.5", never
// "0.450000" — and "£1.20" keeps its pence when a currency prefix is given.
export function formatNumber(value, { decimals } = {}) {
  if (decimals != null) return value.toFixed(decimals)
  return String(roundTo(value, 4))
}

export function formatMoney(value) {
  return `£${value.toFixed(2)}`
}
