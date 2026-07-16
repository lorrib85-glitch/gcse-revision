import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const component = read('../../src/components/learning/TimelineCanvas.jsx')
const fixtures = read('../../src/dev/componentReview/fixtures.js')
const story = read('../../src/components/learning/TimelineCanvas.stories.jsx')

describe('TimelineCanvas architecture', () => {
  it('is governed as a spatial journey rather than a generic causal chain', () => {
    expect(component).toContain('data-timeline-canvas-intent="spatial-journey"')
    expect(component).toContain('getTimelineCanvasGeometry')
    expect(component).toContain('data-timeline-canvas-region="true"')
    expect(component).not.toContain('const CANVAS_H =')
    expect(component).not.toContain('const CARD_W =')
    expect(component).not.toContain('const STEP_GAP =')
  })

  it('reviews the production-quality Black Death route with real imagery', () => {
    for (const source of [fixtures, story]) {
      expect(source).toContain("title: 'How the plague travelled'")
      expect(source).toContain("id: 'central-asia'")
      expect(source).toContain("id: 'ship'")
      expect(source).toContain("id: 'spread-inland'")
      expect(source).toContain("id: 'england'")
      expect(source).toContain('/figures/history/medicine/black-death/trade-routes-map.png')
      expect(source).toContain('/figures/history/medicine/black-death/plague-dock.png')
      expect(source).toContain('/figures/history/medicine/black-death/medieval-town.png')
      expect(source).not.toContain("label: 'Fleas lived on the rats'")
    }
  })

  it('keeps unrelated Review Lab fixture families intact', () => {
    expect(fixtures).toContain('export const spotTheError')
    expect(fixtures).toContain('export const matchingTask')
    expect(fixtures).toContain('export const factorWeb')
    expect(fixtures).toContain('export const keyFigureReveal')
  })
})
