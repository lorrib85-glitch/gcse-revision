import { describe, expect, it } from 'vitest'
import { getTimelineCanvasGeometry } from '../../src/components/learning/timelineCanvasGeometry.js'

function expectCardsInsideCanvas(geometry) {
  const halfCard = geometry.cardHeight / 2
  for (const centre of geometry.centers) {
    expect(centre.y - halfCard).toBeGreaterThanOrEqual(16)
    expect(centre.y + halfCard).toBeLessThanOrEqual(geometry.canvasHeight - 16)
  }
}

describe('TimelineCanvas responsive geometry', () => {
  it('centres the first and final journey cards in a 390px mobile viewport', () => {
    const geometry = getTimelineCanvasGeometry({ width: 390, height: 480, stepCount: 4 })

    expect(geometry.centers[0].x).toBe(195)
    expect(geometry.centers.at(-1).x).toBe(geometry.canvasWidth - 195)
    expect(geometry.cardWidth).toBeGreaterThanOrEqual(196)
    expect(geometry.cardWidth).toBeLessThanOrEqual(244)
    expectCardsInsideCanvas(geometry)
  })

  it('keeps both staggered rows fully visible on a short 320px phone', () => {
    const geometry = getTimelineCanvasGeometry({ width: 320, height: 260, stepCount: 4 })

    expect(geometry.cardWidth).toBe(198)
    expect(geometry.stagger).toBeLessThanOrEqual((geometry.canvasHeight - geometry.cardHeight) / 2 - 16)
    expectCardsInsideCanvas(geometry)
  })

  it('scales the spatial rhythm without turning the journey into fixed desktop geometry', () => {
    const narrow = getTimelineCanvasGeometry({ width: 320, height: 360, stepCount: 4 })
    const standard = getTimelineCanvasGeometry({ width: 390, height: 480, stepCount: 4 })

    expect(narrow.cardWidth).toBeLessThan(standard.cardWidth)
    expect(narrow.stepGap).toBeLessThan(standard.stepGap)
    expect(narrow.canvasWidth).toBeLessThan(standard.canvasWidth)
  })
})
