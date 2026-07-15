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

  it('contains its cinematic background inside the reveal stage', () => {
    expect(component).toContain('data-opposite-reveal-stage="true"')
    expect(component).toContain('data-opposite-reveal-backdrop="true"')
    expect(component).toContain("position: 'absolute'")
    expect(component).toContain("isolation: 'isolate'")
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
    expect(theme).toContain('backdropOverlay')
  })

  it('keeps both concept directions data-driven', () => {
    expect(component).toContain('accent={visuals.leftAccent}')
    expect(component).toContain('accent={visuals.rightAccent}')
    expect(component).toContain('data-opposite-side={side}')
    expect(component).not.toMatch(/concept\.label\s*===/)
  })
})
