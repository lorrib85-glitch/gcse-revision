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
    expect(theme).toContain('dividerErase')
    expect(theme).toContain('dividerLine')
  })

  it('keeps the reveal stage visually transparent instead of painting clipped boxes', () => {
    expect(component).toContain('data-active-side={activeSide}')
    expect(component).toContain('data-complete={view.complete || undefined}')
    expect(component).toContain('.oqr-stage[data-active-side="left"]')
    expect(component).toContain('.oqr-stage[data-active-side="right"]')
    expect(component).toContain('--oqr-destination-glow')
    expect(component).not.toContain('backdrop-filter')
    expect(component).not.toContain('oqr-atmosphere')
    expect(theme).toContain("stageSurface: 'transparent'")
    expect(theme).toContain("stageOverlay: 'transparent'")
  })

  it('removes decorative concept icons and begins the divider below the label row', () => {
    expect(component).not.toContain('ConceptIcon')
    expect(component).not.toContain('concept.icon')
    expect(component).not.toContain('<svg aria-hidden="true"')
    expect(component).toContain('data-opposite-embedded-divider-mask="true"')
    expect(component).toContain('data-opposite-divider="true"')
    expect(component).toContain('top: var(--oqr-divider-start)')
    expect(component).toContain("'--oqr-divider-start': `${SPACING.standard + 42}px`")
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

  it('keeps both concept directions data-driven', () => {
    expect(component).toContain('accent={visuals.leftAccent}')
    expect(component).toContain('accent={visuals.rightAccent}')
    expect(component).toContain('data-opposite-side={side}')
    expect(component).not.toMatch(/concept\.label\s*===/)
  })
})
