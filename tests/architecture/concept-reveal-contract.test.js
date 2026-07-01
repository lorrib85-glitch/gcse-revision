import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))

describe('ConceptReveal contract', () => {
  const componentPath = 'src/components/learning/ConceptReveal.jsx'
  const contractPath = 'docs/system/CONCEPT_REVEAL_CONTRACT.md'

  it('has a documented locked concept reveal contract', () => {
    expect(exists(contractPath)).toBe(true)
    const contract = read(contractPath)
    expect(contract).toContain('Eyebrow hidden by default')
    expect(contract).toContain('Final cinematic continue only')
    expect(contract).toContain('No local progress dots')
  })

  it('uses the locked cinematic continue CTA', () => {
    const src = read(componentPath)
    expect(src).toMatch(/import\s+CinematicContinueCTA\s+from\s+['"]\.\.\/core\/CinematicContinueCTA\.jsx['"]/) 
    expect(src).toContain('<CinematicContinueCTA')
  })

  it('shows the cinematic continue CTA only on the final step', () => {
    const src = read(componentPath)
    expect(src).toContain('{isLast && (')
    expect(src).toContain('<CinematicContinueCTA')
    expect(src).not.toContain('ctaVisible')
  })

  it('keeps background taps from leaving ConceptReveal for the next feature', () => {
    const src = read(componentPath)
    expect(src).toContain('function advanceStep()')
    expect(src).toContain('if (isLast) return')
    expect(src).toContain('function finishReveal()')
    expect(src).toContain('onContinue?.()')
  })

  it('keeps eyebrows hidden unless explicitly requested', () => {
    const src = read(componentPath)
    expect(src).toContain('step.showEyebrow === true && step.eyebrow')
    // Matches only the legacy *unguarded* conditional (brace directly before
    // step.eyebrow). A plain 'step.eyebrow && (' substring check would also
    // match the tail of the correct, gated expression above and could never pass.
    expect(src).not.toContain('{step.eyebrow && (')
  })

  it('does not render custom local progress dots', () => {
    const src = read(componentPath)
    expect(src).not.toContain('Step dots')
    expect(src).not.toContain('steps.map((_, i)')
    expect(src).not.toContain('ProgressDots')
  })

  it('does not use text-only tap hints for progression', () => {
    const src = read(componentPath)
    expect(src).not.toContain('tap to continue')
    expect(src).not.toContain('tap to finish')
    expect(src).not.toContain('crHintPulse')
  })
})
