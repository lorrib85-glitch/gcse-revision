import { describe, expect, it } from 'vitest'
import { createNiceScale } from '../../src/components/learning/GraphView.jsx'

describe('GraphView nice axis scales', () => {
  it('rounds a 0–65 range outward to clean ten-unit intervals', () => {
    const scale = createNiceScale(0, 65)

    expect(scale.min).toBe(0)
    expect(scale.max).toBe(70)
    expect(scale.step).toBe(10)
    expect(scale.ticks.map(tick => tick.value)).toEqual([0, 10, 20, 30, 40, 50, 60, 70])
  })

  it('uses clean two-unit intervals for a 0–10 range', () => {
    const scale = createNiceScale(0, 10)

    expect(scale.min).toBe(0)
    expect(scale.max).toBe(10)
    expect(scale.step).toBe(2)
    expect(scale.ticks.map(tick => tick.label)).toEqual(['0', '2', '4', '6', '8', '10'])
  })

  it('uses clean twenty-unit intervals for a percentage scale', () => {
    const scale = createNiceScale(0, 100)

    expect(scale.step).toBe(20)
    expect(scale.ticks.map(tick => tick.value)).toEqual([0, 20, 40, 60, 80, 100])
  })

  it('supports decimal ranges without floating-point label noise', () => {
    const scale = createNiceScale(0, 0.9)

    expect(scale.min).toBe(0)
    expect(scale.max).toBe(1)
    expect(scale.step).toBe(0.2)
    expect(scale.ticks.map(tick => tick.label)).toEqual(['0', '0.2', '0.4', '0.6', '0.8', '1'])
  })
})
