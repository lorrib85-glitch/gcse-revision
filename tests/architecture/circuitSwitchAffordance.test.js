import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const renderer = read('../../src/components/learning/CircuitDiagram.jsx')
const primitives = read('../../src/components/learning/circuit/CircuitPrimitives.jsx')

describe('CircuitDiagram switch affordance', () => {
  it('keeps the generous switch hit target without using it as a visible idle box', () => {
    expect(primitives).toContain('data-circuit-hit-target')
    expect(primitives).toContain('fill="transparent"')
    expect(renderer).not.toContain(
      '.circuit-diagram__switch-control:hover .circuit-diagram__switch-focus',
    )
    expect(renderer).toContain('.circuit-diagram__switch-focus {\n      opacity: 0;')
  })

  it('uses a restrained symbol pulse until the learner first operates a switch', () => {
    expect(renderer).toContain('@keyframes circuit-diagram-switch-hint')
    expect(renderer).toContain("const [hasInteracted, setHasInteracted] = useState(false)")
    expect(renderer).toContain('setHasInteracted(true)')
    expect(renderer).toContain("className={showInteractionHint ? 'circuit-diagram__switch-hint' : undefined}")
    expect(renderer).toContain('data-circuit-interaction-hint={showInteractionHint || undefined}')
  })

  it('suppresses the switch hint for reduced-motion users', () => {
    expect(renderer).toContain(
      '.circuit-diagram--reduced-motion .circuit-diagram__switch-hint .circuit-diagram__switch-control',
    )
    expect(renderer).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.circuit-diagram__switch-hint \.circuit-diagram__switch-control/,
    )
  })

  it('keeps a non-box focus treatment and a forced-colour fallback', () => {
    expect(renderer).toContain('.circuit-diagram__switch-control:focus-visible {')
    expect(renderer).toContain('filter: drop-shadow')
    expect(renderer).toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.circuit-diagram__switch-focus/,
    )
  })

  it('pulls the simple-series battery label back toward its symbol', () => {
    expect(renderer).toContain('[data-circuit-label-id="label-battery"]')
    expect(renderer).toContain('transform: translateY(-30px);')
  })
})
