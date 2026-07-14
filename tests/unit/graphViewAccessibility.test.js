import { describe, expect, it } from 'vitest'
import { buildGraphDescription } from '../../src/components/learning/GraphView.jsx'

describe('GraphView accessible descriptions', () => {
  it('describes scatter structure without inventing a trend', () => {
    const description = buildGraphDescription({
      graphType: 'scatter',
      caption: 'Each point is one student.',
      xLabel: 'Hours revised',
      yLabel: 'Test score (%)',
      points: [{ x: 1, y: 42 }, { x: 2, y: 48 }],
      lineOfBestFit: { from: { x: 1, y: 44 }, to: { x: 2, y: 48 } },
    })

    expect(description).toContain('Each point is one student.')
    expect(description).toContain('Scatter graph with 2 plotted points and a line of best fit.')
    expect(description).toContain('X-axis: Hours revised.')
    expect(description).toContain('Y-axis: Test score (%).')
    expect(description).not.toMatch(/positive|negative|correlation/i)
  })

  it('describes bar categories and points learners to the exact values', () => {
    const description = buildGraphDescription({
      graphType: 'bar',
      xLabel: 'Group',
      yLabel: 'Frequency',
      data: [
        { label: 'A', value: 4 },
        { label: 'B', value: 7 },
        { label: 'C', value: 3 },
      ],
    })

    expect(description).toBe(
      'Bar chart with 3 categories. X-axis: Group. Y-axis: Frequency. Exact values are available in the data table.'
    )
  })

  it('describes pie segments and their accessible percentage table', () => {
    const description = buildGraphDescription({
      graphType: 'pie',
      caption: 'How students travelled to school',
      data: [
        { label: 'Walk', value: 12 },
        { label: 'Bus', value: 8 },
      ],
    })

    expect(description).toBe(
      'How students travelled to school. Pie chart with 2 segments. Exact values and percentages are available in the data table.'
    )
  })
})
