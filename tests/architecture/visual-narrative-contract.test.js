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
  })

  it('uses the locked cinematic continue CTA for opening narrative beats', () => {
    const src = read(componentPath)
    expect(src).toMatch(/import\s+CinematicContinueCTA\s+from\s+['"]\.\.\/core\/CinematicContinueCTA\.jsx['"]/) 
    expect(src).toContain('<CinematicContinueCTA')
  })

  it('does not contain a custom circular next button implementation', () => {
    const src = read(componentPath)
    expect(src).not.toContain('vn-floating-next')
    expect(src).not.toContain('borderRadius: \'50%\'')
    expect(src).not.toContain('placeItems: \'center\'')
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
})
