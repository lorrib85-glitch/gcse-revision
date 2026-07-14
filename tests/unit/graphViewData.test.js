import { describe, expect, it } from 'vitest'
import {
  buildGraphDescription,
  piePatternForIndex,
  prepareGraphData,
  wrapCategoryLabel,
} from '../../src/components/learning/GraphView.jsx'

describe('GraphView data preparation', () => {
  it('sorts line points by x without mutating the author-supplied array', () => {
    const points = [
      { x: 3, y: 30 },
      { x: 1, y: 10 },
      { x: 2, y: 20 },
    ]

    const prepared = prepareGraphData({ graphType: 'line', points })

    expect(prepared.points.map(point => point.x)).toEqual([1, 2, 3])
    expect(points.map(point => point.x)).toEqual([3, 1, 2])
    expect(prepared.hasData).toBe(true)
  })

  it('removes malformed points before graph scale calculations', () => {
    const prepared = prepareGraphData({
      graphType: 'scatter',
      points: [
        { x: 1, y: 5 },
        { x: '2', y: '8' },
        { x: '', y: 4 },
        { x: 3, y: Number.NaN },
        null,
      ],
    })

    expect(prepared.points).toEqual([
      { x: 1, y: 5 },
      { x: 2, y: 8 },
    ])
  })

  it('keeps valid zero values for bar charts and removes unusable categories', () => {
    const prepared = prepareGraphData({
      graphType: 'bar',
      data: [
        { label: 'Control', value: 0 },
        { label: 'Treatment', value: '12' },
        { label: '', value: 5 },
        { label: 'Broken', value: 'not a number' },
      ],
    })

    expect(prepared.data).toEqual([
      { label: 'Control', value: 0 },
      { label: 'Treatment', value: 12 },
    ])
  })

  it('removes zero and negative pie slices because they cannot form visible segments', () => {
    const prepared = prepareGraphData({
      graphType: 'pie',
      data: [
        { label: 'A', value: 40 },
        { label: 'B', value: 0 },
        { label: 'C', value: -10 },
        { label: 'D', value: 60 },
      ],
    })

    expect(prepared.data.map(item => item.label)).toEqual(['A', 'D'])
  })

  it('reports a calm accessible empty state when no usable data remains', () => {
    const description = buildGraphDescription({ graphType: 'bar', data: [] })

    expect(description).toBe('Bar chart has no data available.')
  })
})

describe('GraphView category labels', () => {
  it('wraps longer labels over no more than two lines', () => {
    const lines = wrapCategoryLabel('Average temperature recorded', 13, 2)

    expect(lines).toHaveLength(2)
    expect(lines[0].length).toBeLessThanOrEqual(13)
    expect(lines[1].endsWith('…')).toBe(true)
  })

  it('leaves short labels on one line', () => {
    expect(wrapCategoryLabel('Control')).toEqual(['Control'])
  })
})

describe('GraphView pie patterns', () => {
  it('uses distinct patterns before repeating the sequence', () => {
    const firstCycle = [0, 1, 2, 3, 4].map(piePatternForIndex)

    expect(new Set(firstCycle).size).toBe(5)
    expect(piePatternForIndex(5)).toBe(piePatternForIndex(0))
  })
})
