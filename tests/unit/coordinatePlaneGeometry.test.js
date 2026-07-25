import { describe, expect, it } from 'vitest'
import {
  axisAnchorValue,
  axisTickValues,
  clipSegmentToBounds,
  createPlaneScale,
  gridLineValues,
  orderedPointsPath,
  resolveAxisPlacement,
  snapToStep,
} from '../../src/components/learning/coordinatePlane/coordinatePlaneGeometry.js'

describe('per-axis placement', () => {
  it('crosses at zero when zero falls inside the range', () => {
    expect(resolveAxisPlacement({ min: -5, max: 5 })).toBe('crossing')
    expect(axisAnchorValue({ min: -5, max: 5 })).toBe(0)
  })

  it('sits at the low edge when the range starts at zero', () => {
    expect(resolveAxisPlacement({ min: 0, max: 20 })).toBe('edge')
    expect(axisAnchorValue({ min: 0, max: 20 })).toBe(0)
  })

  it('sits at the low edge when the range starts above zero', () => {
    expect(resolveAxisPlacement({ min: 5, max: 20 })).toBe('edge')
    expect(axisAnchorValue({ min: 5, max: 20 })).toBe(5)
  })

  it('sits at the high edge when the range is entirely negative', () => {
    expect(resolveAxisPlacement({ min: -20, max: -5 })).toBe('edge')
    expect(axisAnchorValue({ min: -20, max: -5 })).toBe(-5)
  })

  // The mixed case the spec exists to permit.
  it('resolves each axis independently for positive x against signed y', () => {
    const xAxis = { min: 0, max: 20 }
    const yAxis = { min: -50, max: 100 }

    expect(resolveAxisPlacement(xAxis)).toBe('edge')
    expect(resolveAxisPlacement(yAxis)).toBe('crossing')
  })
})

describe('plane scale', () => {
  const canvas = { width: 360, height: 300 }
  const padding = { top: 20, right: 20, bottom: 40, left: 40 }

  it('maps model values to pixels with independent x and y scales', () => {
    const scale = createPlaneScale({
      xAxis: { min: 0, max: 20, step: 2 },
      yAxis: { min: 0, max: 100, step: 10 },
      canvas,
      padding,
    })

    expect(scale.toX(0)).toBe(40)
    expect(scale.toX(20)).toBe(340)
    expect(scale.toX(10)).toBe(190)

    // y is inverted: the maximum sits at the top of the plot.
    expect(scale.toY(0)).toBe(260)
    expect(scale.toY(100)).toBe(20)
    expect(scale.toY(50)).toBe(140)
  })

  it('round-trips pointer pixels back to model values', () => {
    const scale = createPlaneScale({
      xAxis: { min: -5, max: 5, step: 1 },
      yAxis: { min: -5, max: 5, step: 1 },
      canvas,
      padding,
    })

    expect(scale.toModelX(scale.toX(3))).toBeCloseTo(3)
    expect(scale.toModelY(scale.toY(-2))).toBeCloseTo(-2)
  })

  it('exposes the plot rectangle', () => {
    const scale = createPlaneScale({
      xAxis: { min: 0, max: 10, step: 1 },
      yAxis: { min: 0, max: 10, step: 1 },
      canvas,
      padding,
    })

    expect(scale.plot).toEqual({ x: 40, y: 20, width: 300, height: 240 })
  })
})

describe('axis ticks', () => {
  it('produces inclusive tick values on the step', () => {
    expect(axisTickValues({ min: -3, max: 3, step: 1 }))
      .toEqual([-3, -2, -1, 0, 1, 2, 3])
  })

  it('honours a non-unit step', () => {
    expect(axisTickValues({ min: 0, max: 20, step: 5 }))
      .toEqual([0, 5, 10, 15, 20])
  })

  it('avoids floating point drift on fractional steps', () => {
    expect(axisTickValues({ min: 0, max: 1, step: 0.2 }))
      .toEqual([0, 0.2, 0.4, 0.6000000000000001, 0.8, 1].map(v => Math.round(v * 1e6) / 1e6))
  })
})

describe('ordered point paths', () => {
  it('builds a path through points in order', () => {
    const identity = value => value
    expect(orderedPointsPath(
      [{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 30, y: 5 }],
      identity,
      identity,
    )).toBe('M 0 0 L 10 20 L 30 5')
  })

  it('returns an empty string for fewer than two points', () => {
    const identity = value => value
    expect(orderedPointsPath([{ x: 1, y: 1 }], identity, identity)).toBe('')
    expect(orderedPointsPath([], identity, identity)).toBe('')
  })
})

describe('snapping', () => {
  it('snaps to the nearest step', () => {
    expect(snapToStep(2.4, 1)).toBe(2)
    expect(snapToStep(2.6, 1)).toBe(3)
    expect(snapToStep(2.4, 0.5)).toBe(2.5)
  })
})

describe('grid line values', () => {
  it('matches the tick values when there are no subdivisions', () => {
    expect(gridLineValues({ min: -2, max: 2, step: 1 }, 1)).toEqual([-2, -1, 0, 1, 2])
  })

  it('subdivides between labelled ticks', () => {
    expect(gridLineValues({ min: 0, max: 4, step: 2 }, 2))
      .toEqual([0, 1, 2, 3, 4])
  })
})

// Issue 4: y = 2x + 1 across x = −5…5 reaches y = ±11 on a y-axis of ±5.
// Without model-space clipping the line is drawn far outside the plot.
describe('segment clipping', () => {
  const xAxis = { min: -5, max: 5 }
  const yAxis = { min: -5, max: 5 }

  it('leaves a fully contained segment untouched', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -2, y: -1 }, to: { x: 2, y: 3 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -2, y: -1 })
    expect(clipped.to).toEqual({ x: 2, y: 3 })
  })

  it('clips a steep line at both y bounds', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -5, y: -9 }, to: { x: 5, y: 11 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -3, y: -5 })
    expect(clipped.to).toEqual({ x: 2, y: 5 })
  })

  it('clips a horizontal line at the x bounds only', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -20, y: 2 }, to: { x: 20, y: 2 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -5, y: 2 })
    expect(clipped.to).toEqual({ x: 5, y: 2 })
  })

  it('returns null for a segment entirely outside the plot', () => {
    expect(clipSegmentToBounds(
      { from: { x: -5, y: 20 }, to: { x: 5, y: 30 } },
      xAxis,
      yAxis,
    )).toBeNull()
  })

  it('handles an asymmetric plot', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: 0, y: 0 }, to: { x: 20, y: 200 } },
      { min: 0, max: 20 },
      { min: 0, max: 100 },
    )

    expect(clipped.to).toEqual({ x: 10, y: 100 })
  })
})
