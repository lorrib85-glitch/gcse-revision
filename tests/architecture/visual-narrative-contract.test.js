import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))

describe('VisualNarrativeScreen contract', () => {
  const componentPath = 'src/components/learning/VisualNarrativeScreen.jsx'
  const contractPath = 'docs/system/VISUAL_NARRATIVE_CONTRACT.md'

  it('has a documented locked visual narrative contract', () => {
    expect(exists(contractPath)).toBe(true)
    const contract = read(contractPath)
    expect(contract).toContain('No eyebrow by default')
    expect(contract).toContain('Cinematic continue only')
    expect(contract).toContain('Full-bleed cinematic image')
    expect(contract).toContain('Accessible interaction')
    expect(contract).toContain('Data-driven highlights only')
  })

  it('uses the locked cinematic continue CTA for opening narrative beats', () => {
    const src = read(componentPath)
    expect(src).toMatch(/import\s+CinematicContinueCTA\s+from\s+['"]\.\.\/core\/CinematicContinueCTA\.jsx['"]/)
    expect(src).toContain('<CinematicContinueCTA')
  })

  it('uses governed cinematic typography and spacing tokens', () => {
    const src = read(componentPath)
    expect(src).toContain('...TYPE.displayCinematic')
    expect(src).toContain("import { SPACING } from '../../constants/spacing.js'")
    expect(src).not.toContain('TYPE.eyebrow')
    expect(src).not.toContain("fontFamily: \"'Sora', sans-serif\"")
  })

  it('does not contain a custom circular next button implementation', () => {
    const src = read(componentPath)
    expect(src).not.toContain('vn-floating-next')
    expect(src).not.toContain("borderRadius: '50%'")
    expect(src).not.toContain("placeItems: 'center'")
  })

  it('keeps beat labels hidden unless explicitly requested', () => {
    const src = read(componentPath)
    expect(src).toContain('beat.showLabel === true && beat.label')
    expect(src).not.toContain('{beat.label && (')
  })

  it('keeps VisualNarrativeScreen free of local progress indicators', () => {
    const src = read(componentPath)
    expect(src).not.toContain('SequenceProgress')
    expect(src).not.toContain('ProgressDots')
    expect(src).not.toMatch(/\d+\s*\/\s*\d+/)
  })

  it('supports keyboard fact reveals and announces dynamic content', () => {
    const src = read(componentPath)
    expect(src).toContain("event.key !== 'Enter'")
    expect(src).toContain("event.key !== ' '")
    expect(src).toContain('aria-live="polite"')
    expect(src).toContain('aria-label={factInteractionActive ? factInteractionLabel : undefined}')
  })

  it('respects reduced motion and keeps highlights data-driven', () => {
    const src = read(componentPath)
    expect(src).toContain('@media (prefers-reduced-motion: reduce)')
    expect(src).toContain('const highlight = showConclusion ? beat.highlight : null')
    expect(src).not.toContain('vnEnglandPulse')
    expect(src).not.toContain('Medieval England glow')
  })

  it('allows a final non-facts beat to complete', () => {
    const src = read(componentPath)
    expect(src).toContain('function completeBeat()')
    expect(src).toContain('if (isLastBeat)')
    expect(src).toContain('onContinue?.()')
    expect(src).toMatch(/if \(isFacts\)[\s\S]*completeBeat\(\)\n\s*}/)
  })

  it('guards against empty beat arrays', () => {
    const src = read(componentPath)
    expect(src).toContain('if (beats.length === 0) return null')
  })
})
