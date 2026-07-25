import { describe, expect, it } from 'vitest'
import {
  enlargePoint,
  formatCoordinate,
  intersectionOf,
  lineY,
  midpointOf,
  perpendicularGradientOf,
  quadrantOf,
  quadrantRoman,
  quadrantSigns,
  reflectPoint,
  rotatePoint,
  translatePoint,
  xInterceptOf,
} from '../../src/components/learning/coordinatePlane/coordinatePlaneMath.js'

describe('quadrants', () => {
  it('identifies all four quadrants', () => {
    expect(quadrantOf(3, 2)).toBe(1)
    expect(quadrantOf(-3, 2)).toBe(2)
    expect(quadrantOf(-3, -2)).toBe(3)
    expect(quadrantOf(3, -2)).toBe(4)
  })

  it('returns null on an axis, where no quadrant applies', () => {
    expect(quadrantOf(0, 4)).toBeNull()
    expect(quadrantOf(4, 0)).toBeNull()
    expect(quadrantOf(0, 0)).toBeNull()
  })

  it('names quadrants and their sign pairs', () => {
    expect(quadrantRoman(4)).toBe('IV')
    expect(quadrantSigns(4)).toBe('(+, −)')
    expect(quadrantSigns(2)).toBe('(−, +)')
    expect(quadrantRoman(null)).toBeNull()
  })
})

describe('midpoint', () => {
  it('averages each coordinate independently', () => {
    expect(midpointOf({ x: -3, y: 1 }, { x: 5, y: 7 })).toEqual({ x: 1, y: 4 })
  })

  it('handles a half-value midpoint', () => {
    expect(midpointOf({ x: 0, y: 0 }, { x: 3, y: 5 })).toEqual({ x: 1.5, y: 2.5 })
  })
})

describe('straight lines', () => {
  it('evaluates y for a given x', () => {
    expect(lineY({ m: 2, c: 1 }, 2)).toBe(5)
    expect(lineY({ m: -1, c: 7 }, 2)).toBe(5)
  })

  it('finds the x-intercept', () => {
    expect(xInterceptOf({ m: 2, c: 4 })).toBe(-2)
  })

  it('returns null for a horizontal line, which has no single x-intercept', () => {
    expect(xInterceptOf({ m: 0, c: 4 })).toBeNull()
  })

  it('finds the intersection of two lines', () => {
    expect(intersectionOf({ m: 1, c: 3 }, { m: -1, c: 7 }))
      .toEqual({ kind: 'one', point: { x: 2, y: 5 } })
  })

  it('reports parallel lines as having no solution', () => {
    expect(intersectionOf({ m: 2, c: 1 }, { m: 2, c: 5 })).toEqual({ kind: 'none' })
  })

  // Equal gradient alone is not enough to conclude "no solution".
  it('reports coincident lines as having infinitely many solutions', () => {
    expect(intersectionOf({ m: 2, c: 1 }, { m: 2, c: 1 })).toEqual({ kind: 'infinite' })
  })
})

describe('perpendicular gradients', () => {
  it('returns the negative reciprocal', () => {
    expect(perpendicularGradientOf(2)).toBe(-0.5)
    expect(perpendicularGradientOf(-0.25)).toBe(4)
  })

  // A line perpendicular to a horizontal line is vertical, and a vertical line
  // has no gradient — it cannot be written as y = mx + c at all.
  it('returns null for a horizontal line', () => {
    expect(perpendicularGradientOf(0)).toBeNull()
  })
})

describe('translation', () => {
  it('applies positive, negative and zero components', () => {
    expect(translatePoint({ x: 1, y: 1 }, { dx: 3, dy: 2 })).toEqual({ x: 4, y: 3 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: -3, dy: -2 })).toEqual({ x: -2, y: -1 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: 0, dy: 4 })).toEqual({ x: 1, y: 5 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: 0, dy: 0 })).toEqual({ x: 1, y: 1 })
  })
})

describe('reflection', () => {
  it('reflects in a vertical mirror line x = a', () => {
    expect(reflectPoint({ x: -1, y: 4 }, { type: 'vertical', value: 2 }))
      .toEqual({ x: 5, y: 4 })
  })

  it('reflects in a horizontal mirror line y = b', () => {
    expect(reflectPoint({ x: 3, y: 1 }, { type: 'horizontal', value: -1 }))
      .toEqual({ x: 3, y: -3 })
  })

  it('reflects in y = x by swapping coordinates', () => {
    expect(reflectPoint({ x: 2, y: 5 }, { type: 'yEqualsX' })).toEqual({ x: 5, y: 2 })
  })

  it('reflects in y = −x by swapping and negating', () => {
    expect(reflectPoint({ x: 2, y: 5 }, { type: 'yEqualsNegativeX' })).toEqual({ x: -5, y: -2 })
  })

  it('leaves a point on the mirror line unmoved', () => {
    expect(reflectPoint({ x: 2, y: 9 }, { type: 'vertical', value: 2 }))
      .toEqual({ x: 2, y: 9 })
  })
})

describe('rotation', () => {
  it('rotates 90 degrees clockwise about the origin', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 90, 'clockwise'))
      .toEqual({ x: 3, y: -1 })
  })

  it('rotates 90 degrees anticlockwise about the origin', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 90, 'anticlockwise'))
      .toEqual({ x: -3, y: 1 })
  })

  it('rotates 180 degrees identically in either direction', () => {
    const clockwise = rotatePoint({ x: 2, y: 5 }, { x: 0, y: 0 }, 180, 'clockwise')
    const anticlockwise = rotatePoint({ x: 2, y: 5 }, { x: 0, y: 0 }, 180, 'anticlockwise')

    expect(clockwise).toEqual({ x: -2, y: -5 })
    expect(anticlockwise).toEqual(clockwise)
  })

  it('rotates 270 degrees', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 270, 'clockwise'))
      .toEqual({ x: -3, y: 1 })
  })

  it('rotates about a centre away from the origin', () => {
    expect(rotatePoint({ x: 4, y: 3 }, { x: 2, y: 1 }, 90, 'clockwise'))
      .toEqual({ x: 4, y: -1 })
  })
})

describe('enlargement', () => {
  it('enlarges by a positive integer scale factor', () => {
    expect(enlargePoint({ x: 3, y: 2 }, { x: 1, y: 1 }, 2)).toEqual({ x: 5, y: 3 })
  })

  it('enlarges by a fractional scale factor', () => {
    expect(enlargePoint({ x: 5, y: 3 }, { x: 1, y: 1 }, 0.5)).toEqual({ x: 3, y: 2 })
  })

  it('enlarges by a negative scale factor, landing the other side of the centre', () => {
    expect(enlargePoint({ x: 3, y: 2 }, { x: 1, y: 1 }, -1)).toEqual({ x: -1, y: 0 })
  })
})

describe('coordinate formatting', () => {
  it('uses a true minus sign rather than a hyphen', () => {
    expect(formatCoordinate({ x: 3, y: -2 })).toBe('(3, −2)')
    expect(formatCoordinate({ x: -1, y: 4 })).toBe('(−1, 4)')
  })

  it('formats a half value without trailing zeroes', () => {
    expect(formatCoordinate({ x: 1.5, y: 2 })).toBe('(1.5, 2)')
  })
})
