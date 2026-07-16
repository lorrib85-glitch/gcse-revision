import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const component = read('../../src/components/learning/TimelineCanvas.jsx')
const theme = read('../../src/components/learning/timelineCanvasTheme.js')
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

  it('keeps reveal and close on one stable top-left card anchor', () => {
    expect(component).toContain('data-control-position="card-top-left"')
    expect(component).toContain('left: 0')
    expect(component).toContain('top: 0')
    expect(component).toContain('data-control-symbol={isOpen ? \'close\' : \'reveal\'}')
    expect(component).toContain('Close explanation for ${step.label}')
    expect(component).not.toContain('card-top-right')
    expect(component).not.toContain('card-bottom-right')
  })

  it('grows opaque cards as the glowing route reaches them', () => {
    expect(component).toContain('getTimelineCardFocus')
    expect(component).toContain('window.requestAnimationFrame(update)')
    expect(component).toContain("group.style.setProperty('--tcv-focus-scale'")
    expect(component).toContain("group.style.setProperty('--tcv-focus-brightness'")
    expect(component).toContain('group.dataset.routeArrival')
    expect(component).toContain('data-route-arrival=')
    expect(component).not.toContain('--tcv-focus-opacity')
    expect(component).not.toContain('group.style.opacity')
    expect(component).toContain("isolation: 'isolate'")
    expect(theme).toContain('cardSurface: GENERAL.backgroundSurface')
    expect(theme).toContain('metadataSurface: GENERAL.backgroundSurface')
  })

  it('renders a faint base route and a separate stronger glowing active route', () => {
    expect(component).toContain('data-connector-layer="base"')
    expect(component).toContain('data-connector-layer="active"')
    expect(component).toContain('className="tcv-connector-active"')
    expect(component).toContain('visual.connectorActive')
    expect(component).toContain('visual.connectorGlow')
    expect(component).toContain('zIndex: 0')
    expect(theme).toContain('connectorInactive')
    expect(theme).toContain('connectorActive')
    expect(theme).toContain('connectorActiveWidth')
    expect(theme).toContain('connectorGlow')
  })

  it('uses governed motion, semantic visual roles and shared shell spacing', () => {
    expect(component).toContain("from 'motion/react'")
    expect(component).toContain('useReducedMotion()')
    expect(component).toContain('getTimelineCanvasTheme')
    expect(component).toContain('const HEADER_CLEARANCE = SPACING.cinematic + SPACING.micro')
    expect(component).not.toContain("paddingTop: 'calc(80px")
    expect(component).not.toContain('@keyframes tcv-bounce')
    expect(component).not.toContain('infinite ease-in-out;\n    }\n    .tcv-swipe-hint')
    expect(theme).toContain('cardBorderFocused')
    expect(theme).toContain('detailSurface')
    expect(theme).toContain('mediaFallback')
  })

  it('provides a governed image fallback and reduced-motion path', () => {
    expect(component).toContain('data-timeline-image-fallback="true"')
    expect(component).toContain('reducedMotion: prefersReducedMotion')
    expect(component).toContain("scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth'")
    expect(component).toContain("path.style.strokeDasharray = prefersReducedMotion ? 'none'")
    expect(story).toContain('export const MissingImageFallback')
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
