import { describe, expect, it } from 'vitest'
import {
  deduceMissingLength,
  distance,
  formatArea,
  formatLength,
  formatValue,
  midpoint,
  normalOffsetPoint,
  parallelogramArea,
  perpendicularFoot,
  polygonArea,
  polygonPath,
  polygonPerimeter,
  rectangleArea,
  rectanglePerimeter,
  regularPolygonPoints,
  roundTo,
  trapeziumArea,
  triangleAreaFromBaseHeight,
} from '../../src/components/learning/geometry/shapeGeometry.js'

describe('shared shape geometry — distance and midpoint', () => {
  it('measures the distance between two points', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('finds the midpoint of a segment', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 6, y: 4 })).toEqual({ x: 3, y: 2 })
  })
})

describe('shared shape geometry — paths', () => {
  it('closes a polygon path', () => {
    const path = polygonPath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }])
    expect(path).toBe('M 0 0 L 10 0 L 10 5 Z')
  })

  it('generates a regular polygon with equal side lengths', () => {
    const points = regularPolygonPoints(6, 100, 100, 50)
    const sides = points.map((point, index) => (
      roundTo(distance(point, points[(index + 1) % points.length]), 4)
    ))

    expect(points).toHaveLength(6)
    expect(new Set(sides).size).toBe(1)
  })
})

describe('shared shape geometry — projections', () => {
  it('drops a perpendicular onto a horizontal line', () => {
    const foot = perpendicularFoot({ x: 40, y: 10 }, { x: 0, y: 100 }, { x: 200, y: 100 })
    expect(foot).toEqual({ x: 40, y: 100 })
  })

  it('projects onto the extension of a segment when the point lies beyond it', () => {
    const foot = perpendicularFoot({ x: 260, y: 10 }, { x: 0, y: 100 }, { x: 200, y: 100 })
    expect(foot.x).toBe(260)
  })

  it('offsets a dimension marker along the normal, clear of its side', () => {
    const marker = normalOffsetPoint({ x: 0, y: 100 }, { x: 100, y: 100 }, 0.5, 20)
    expect(marker).toEqual({ x: 50, y: 120 })
  })
})

describe('shared shape geometry — mensuration', () => {
  it('measures a rectangle in linear and square units', () => {
    expect(rectanglePerimeter(6, 4)).toBe(20)
    expect(rectangleArea(6, 4)).toBe(24)
  })

  it('halves base times perpendicular height for a triangle', () => {
    expect(triangleAreaFromBaseHeight(8, 4)).toBe(16)
    expect(triangleAreaFromBaseHeight(7, 3)).toBe(10.5)
  })

  it('multiplies base by perpendicular height for a parallelogram', () => {
    expect(parallelogramArea(7, 4)).toBe(28)
  })

  it('averages the parallel sides for a trapezium', () => {
    expect(trapeziumArea(3, 7, 4)).toBe(20)
    expect(trapeziumArea(5, 5, 3)).toBe(15)
  })

  it('measures any polygon by its boundary and by the shoelace formula', () => {
    const lShape = [
      { x: 0, y: 0 }, { x: 7, y: 0 }, { x: 7, y: 4 },
      { x: 4, y: 4 }, { x: 4, y: 6 }, { x: 0, y: 6 },
    ]

    expect(polygonPerimeter(lShape)).toBe(26)
    expect(polygonArea(lShape)).toBe(36)
  })

  it('gives the same shoelace area whichever way the polygon is wound', () => {
    const square = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }]
    expect(polygonArea(square)).toBe(polygonArea([...square].reverse()))
  })

  it('deduces a missing rectilinear length from the opposite total', () => {
    expect(deduceMissingLength(7, [4])).toBe(3)
    expect(deduceMissingLength(6, [4])).toBe(2)
    expect(deduceMissingLength(12, [3, 4])).toBe(5)
  })
})

describe('shared shape geometry — learner-facing formatting', () => {
  it('keeps floating-point noise out of learner-facing values', () => {
    expect(roundTo(0.1 + 0.2)).toBe(0.3)
    expect(formatValue(0.1 + 0.2)).toBe('0.3')
    expect(formatValue(20)).toBe('20')
  })

  it('distinguishes linear units from square units', () => {
    expect(formatLength(26)).toBe('26 cm')
    expect(formatArea(36)).toBe('36 cm²')
    expect(formatLength(26)).not.toContain('²')
  })
})
