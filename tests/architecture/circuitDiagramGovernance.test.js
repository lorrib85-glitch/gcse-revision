import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const renderer = read('../../src/components/learning/CircuitDiagram.jsx')
const primitives = read('../../src/components/learning/circuit/CircuitPrimitives.jsx')
const presets = read('../../src/components/learning/circuit/circuitPresets.js')
const visualRoles = read('../../src/components/learning/circuit/circuitVisualRoles.js')

describe('CircuitDiagram architecture governance', () => {
  it('keeps raw GCSE circuit symbols inside the governed primitive library', () => {
    expect(renderer).toContain("from './circuit/CircuitPrimitives.jsx'")

    for (const tag of ['path', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'polyline']) {
      expect(renderer).not.toMatch(new RegExp(`<${tag}\\b`))
    }

    expect(primitives).toContain('export function CircuitSwitch')
    expect(primitives).toContain('export function CircuitLamp')
    expect(primitives).toContain('export function CircuitAmmeter')
    expect(primitives).toContain('export function CircuitVoltmeter')
  })

  it('keeps circuit-specific layouts and science outcomes in presets, not renderer branches', () => {
    expect(presets).toContain("export const SIMPLE_SERIES_CIRCUIT_ID = 'simpleSeries'")
    expect(presets).toContain("export const TWO_SWITCH_SERIES_CIRCUIT_ID = 'twoSwitchSeries'")
    expect(renderer).not.toContain('twoSwitchSeries')
    expect(renderer).not.toMatch(/circuit\.id\s*===/)
    expect(renderer).not.toMatch(/preset\s*===/)
  })

  it('keeps presets data-only and free from local JSX implementations', () => {
    expect(presets).not.toMatch(/from ['"]react['"]/)
    expect(presets).not.toMatch(/<[A-Z][A-Za-z]+/)
    expect(presets).toContain("activeWhen: { allClosed: ['switch-a', 'switch-b'] }")
  })

  it('uses semantic circuit colour roles rather than local success colours', () => {
    expect(renderer).toContain('PHYSICS_CIRCUIT_VISUAL_ROLES')
    expect(visualRoles).toContain('interaction: subjectTheme.accent')
    expect(visualRoles).toContain('conducting: subjectTheme.accent')
    expect(visualRoles).toContain('emittedLight: subjectTheme.accentSecondary')
    expect(renderer).not.toMatch(/#[0-9a-fA-F]{3,8}/)
  })

  it('keeps the tested minimum touch target wired into the real switch primitive', () => {
    expect(primitives).toContain("from './circuitGeometry.js'")
    expect(primitives).toContain('resolveCircuitSwitchHitBox({')
    expect(primitives).toContain('data-circuit-hit-target="true"')
  })

  it('protects reduced motion through both explicit and device-preference paths', () => {
    expect(renderer).toContain('.circuit-diagram--reduced-motion')
    expect(renderer).toContain('@media (prefers-reduced-motion: reduce)')
    expect(renderer).toContain('.circuit-diagram__current-pulse')
    expect(renderer).toContain('display: none;')
  })
})
