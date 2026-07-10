import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')
const exists = (rel) => existsSync(resolve(root, rel))

// Extract a top-level `function name() { ... }` body via brace matching, so
// assertions can validate governed behaviour inside a specific function
// without depending on incidental whitespace or exact statement wording.
function extractFn(src, name) {
  const header = `function ${name}(`
  const start = src.indexOf(header)
  if (start === -1) return ''
  const open = src.indexOf('{', start)
  let depth = 0
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return src.slice(open, i + 1)
    }
  }
  return ''
}

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
    // Governed rule: CTA visibility is derived from being on the final step,
    // never rendered unconditionally or via an always-on visibility flag.
    expect(src).toMatch(/const\s+showCta\s*=\s*isLast\b/)
    expect(src).not.toContain('ctaVisible')
    // Exactly one CTA element, and it renders inside its final-step gate.
    const ctaCount = (src.match(/<CinematicContinueCTA/g) || []).length
    expect(ctaCount).toBe(1)
    const gatePos = src.search(/\{\s*showCta\s*&&/)
    const ctaPos = src.indexOf('<CinematicContinueCTA')
    expect(gatePos).toBeGreaterThan(-1)
    expect(ctaPos).toBeGreaterThan(gatePos)
  })

  it('keeps background taps from leaving ConceptReveal for the next feature', () => {
    const src = read(componentPath)
    const advance = extractFn(src, 'advanceStep')
    const finish = extractFn(src, 'finishReveal')
    expect(advance).not.toBe('')
    expect(finish).not.toBe('')
    // A tap mid-reveal advances a step rather than leaving the feature...
    expect(advance).toMatch(/setStepIdx\(/)
    // ...and the final step is explicitly guarded, not blindly continued.
    expect(advance).toContain('if (isLast)')
    // Only finishReveal hands control to the next feature (via onContinue);
    // the tap/advance path must never call onContinue directly.
    expect(advance).not.toContain('onContinue')
    expect(finish).toContain('onContinue?.()')
  })

  it('keeps eyebrows hidden unless explicitly requested', () => {
    const src = read(componentPath)
    // No ungated / default eyebrow rendering — the forbidden decoration pattern.
    expect(src).not.toMatch(/\{\s*step\.eyebrow\s*&&/)
    // If an eyebrow is rendered at all, it must be behind the explicit opt-in.
    if (/step\.eyebrow/.test(src)) {
      expect(src).toContain('showEyebrow === true')
    }
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
