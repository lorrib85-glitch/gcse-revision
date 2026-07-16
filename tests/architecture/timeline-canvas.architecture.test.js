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

  it('anchors the explanation to the visible viewport instead of shrinking the journey', () => {
    expect(component).toContain('data-timeline-detail-sheet="anchored"')
    expect(component).toContain("position: 'absolute'")
    expect(component).toContain('height: detailLayout.sheetHeight')
    expect(component).toContain('getTimelineDetailLayout')
    expect(component).not.toContain('flexShrink: 0,\n          margin: `${SPACING.compact}px ${SPACING.standard}px 0`')
  })

  it('centres selected cards and tracks the card physically centred in the viewport', () => {
    expect(component).toContain('getTimelineScrollLeft')
    expect(component).toContain('getNearestTimelineIndex')
    expect(component).toContain('current={currentIndex}')
    expect(component).toContain("scrollSnapType: 'x mandatory'")
    expect(component).toContain("scrollSnapAlign: 'center'")
    expect(component).toContain("scrollSnapStop: 'always'")
    expect(component).not.toContain('currentProgressIndex')
  })

  it('keeps the selected close control in the card top-right corner', () => {
    expect(component).toContain("data-control-position={isOpen ? 'card-top-right' : 'card-bottom-right'}")
    expect(component).toContain('center.x + cardWidth / 2 - 22')
    expect(component).toContain('center.y - cardHeight / 2 + 22')
    expect(component).toContain('Close explanation for ${step.label}')
    expect(component).not.toContain('justifyContent: \'space-between\'')
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
