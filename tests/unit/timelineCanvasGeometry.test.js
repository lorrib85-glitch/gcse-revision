import { describe, expect, it } from 'vitest'
import {
  getNearestTimelineIndex,
  getTimelineCanvasGeometry,
  getTimelineCardFocus,
  getTimelineDetailLayout,
  getTimelineScrollLeft,
} from '../../src/components/learning/timelineCanvasGeometry.js'

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
    expect(getTimelineScrollLeft({
      centerX: geometry.centers[0].x,
      viewportWidth: geometry.viewportWidth,
      canvasWidth: geometry.canvasWidth,
    })).toBe(0)
    expect(getTimelineScrollLeft({
      centerX: geometry.centers.at(-1).x,
      viewportWidth: geometry.viewportWidth,
      canvasWidth: geometry.canvasWidth,
    })).toBe(geometry.canvasWidth - geometry.viewportWidth)
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

  it('derives current progress from the card nearest the viewport centre', () => {
    const geometry = getTimelineCanvasGeometry({ width: 390, height: 480, stepCount: 4 })
    const betweenSecondAndThird = (geometry.centers[1].x + geometry.centers[2].x) / 2

    expect(getNearestTimelineIndex({ centers: geometry.centers, focusX: geometry.centers[0].x })).toBe(0)
    expect(getNearestTimelineIndex({ centers: geometry.centers, focusX: geometry.centers[2].x - 20 })).toBe(2)
    expect(getNearestTimelineIndex({ centers: geometry.centers, focusX: betweenSecondAndThird - 1 })).toBe(1)
    expect(getNearestTimelineIndex({ centers: geometry.centers, focusX: betweenSecondAndThird + 1 })).toBe(2)
  })

  it('grows each opaque waypoint as the active route reaches it', () => {
    const joined = getTimelineCardFocus({ centerX: 300, focusX: 300, stepGap: 300 })
    const approaching = getTimelineCardFocus({ centerX: 300, focusX: 450, stepGap: 300 })
    const waiting = getTimelineCardFocus({ centerX: 300, focusX: 600, stepGap: 300 })

    expect(joined).toEqual({ focus: 1, routeArrival: 1, scale: 1, brightness: 1 })
    expect(approaching.scale).toBeGreaterThan(waiting.scale)
    expect(approaching.scale).toBeLessThan(joined.scale)
    expect(approaching.routeArrival).toBeGreaterThan(0)
    expect(approaching.routeArrival).toBeLessThan(1)
    expect(waiting.scale).toBeCloseTo(0.66, 2)
    expect(waiting.brightness).toBeCloseTo(0.58, 2)
    expect(waiting).not.toHaveProperty('opacity')
  })

  it('removes zoom and dimming for reduced-motion learners', () => {
    expect(getTimelineCardFocus({
      centerX: 300,
      focusX: 900,
      stepGap: 300,
      reducedMotion: true,
    })).toEqual({ focus: 1, routeArrival: 1, scale: 1, brightness: 1 })
  })

  it('shifts the selected card fully above the anchored detail sheet', () => {
    const geometry = getTimelineCanvasGeometry({ width: 390, height: 480, stepCount: 4 })
    const layout = getTimelineDetailLayout({ geometry, openIndex: 1 })
    const selectedCentre = layout.centers[1]
    const selectedBottom = selectedCentre.y + geometry.cardHeight / 2
    const sheetTop = geometry.canvasHeight - layout.sheetHeight

    expect(layout.sheetHeight).toBeGreaterThanOrEqual(136)
    expect(layout.sheetHeight).toBeLessThanOrEqual(220)
    expect(layout.verticalOffset).toBeLessThan(0)
    expect(selectedBottom).toBeLessThanOrEqual(sheetTop - 12)
    expect(layout.centers[0].y - geometry.centers[0].y).toBe(layout.verticalOffset)
    expect(layout.centers[3].y - geometry.centers[3].y).toBe(layout.verticalOffset)
  })
})
