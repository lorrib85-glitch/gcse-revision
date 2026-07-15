import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const component = read('../../src/components/learning/OppositeQualitiesReveal.jsx')
const theme = read('../../src/components/learning/oppositeQualitiesRevealTheme.js')

const assessmentTerms = [
  'correctAnswer',
  'isCorrect',
  'score',
  'onAnswer',
  'feedbackCorrect',
  'feedbackIncorrect',
]

describe('OppositeQualitiesReveal architecture', () => {
  it('stays a passive guided contrast reveal rather than becoming an assessment', () => {
    expect(component).toContain('data-opposite-reveal-intent="guided-contrast"')

    for (const term of assessmentTerms) {
      expect(component).not.toContain(term)
    }
  })

  it('supports a full-screen module backdrop with a safe local fallback', () => {
    expect(component).toContain("block.backgroundMode !== 'screen'")
    expect(component).toContain("closest('.cs-shell')")
    expect(component).toContain('createPortal(')
    expect(component).toContain('data-opposite-reveal-screen-backdrop')
    expect(component).toContain('data-opposite-reveal-backdrop')
    expect(component).toContain("data-opposite-background-mode={usesScreenBackdrop ? 'screen' : 'stage'}")
    expect(component).not.toContain("position: 'fixed'")
    expect(component).not.toContain('zIndex: -1')
  })

  it('keeps raw cinematic colour decisions in the semantic theme layer', () => {
    expect(component).toContain('resolveOppositeRevealVisuals')
    expect(component).not.toMatch(/#[0-9a-fA-F]{3,8}/)
    expect(component).not.toContain('rgba(')
    expect(theme).toContain('OPPOSITE_REVEAL_PAIRS')
    expect(theme).toContain('warmCool')
    expect(theme).toContain('wetDry')
    expect(theme).toContain('leftAccent')
    expect(theme).toContain('rightAccent')
    expect(theme).toContain('fullScreenOverlay')
    expect(theme).toContain('stageOverlay')
  })

  it('keeps the reveal stage visually transparent instead of painting clipped boxes', () => {
    expect(component).toContain('data-active-side={activeSide}')
    expect(component).toContain('data-complete={view.complete || undefined}')
    expect(component).toContain('.oqr-stage[data-active-side="left"]')
    expect(component).toContain('.oqr-stage[data-active-side="right"]')
    expect(component).toContain('--oqr-destination-glow')
    expect(component).not.toContain('border-left:')
    expect(component).not.toContain('border-right:')
    expect(component).not.toContain('backdrop-filter')
    expect(theme).toContain("stageSurface: 'transparent'")
    expect(theme).toContain("stageOverlay: 'transparent'")
    expect(theme).toContain("leftZoneIdle: 'transparent'")
    expect(theme).toContain("leftZoneActive: 'transparent'")
    expect(theme).toContain("rightZoneIdle: 'transparent'")
    expect(theme).toContain("rightZoneActive: 'transparent'")
    expect(theme).toContain("centreZone: 'transparent'")
  })

  it('starts only when visible, pauses when hidden and lets the learner accelerate', () => {
    expect(component).toContain('IntersectionObserver')
    expect(component).toContain("document.addEventListener('visibilitychange'")
    expect(component).toContain('data-opposite-accelerate-control="true"')
    expect(component).toContain('onClick={advanceCurrent}')
    expect(component).toContain("minHeight: view.complete ? 'auto' : '52svh'")
    expect(component).toContain('!view.complete &&')
  })

  it('visually hands the travelling word into the newly settled item', () => {
    expect(component).toContain('data-opposite-active-word')
    expect(component).toContain('TYPE.displayScreen')
    expect(component).toContain('oqr-item-settle-left')
    expect(component).toContain('oqr-item-settle-right')
    expect(component).toContain('oqr-settled-item--latest')
    expect(component).toContain('oqr-item-land')
  })

  it('uses governed line symbols for known opposite concepts', () => {
    expect(component).toContain("'☀': 'heat'")
    expect(component).toContain("'❄': 'cold'")
    expect(component).toContain("'💧': 'wet'")
    expect(component).toContain("'✦': 'dry'")
    expect(component).toContain('<svg aria-hidden="true"')
    expect(component).toContain('stroke="currentColor"')
  })

  it('keeps both concept directions data-driven', () => {
    expect(component).toContain('accent={visuals.leftAccent}')
    expect(component).toContain('accent={visuals.rightAccent}')
    expect(component).toContain('data-opposite-side={side}')
    expect(component).not.toMatch(/concept\.label\s*===/)
  })
})
