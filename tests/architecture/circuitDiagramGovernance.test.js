import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

const renderer = read('../../src/components/learning/CircuitDiagram.jsx')
const symbolReference = read('../../src/components/learning/CircuitSymbolReference.jsx')
const primitives = read('../../src/components/learning/circuit/CircuitPrimitives.jsx')
const presets = read('../../src/components/learning/circuit/circuitPresets.js')
const visualRoles = read('../../src/components/learning/circuit/circuitVisualRoles.js')
const legacyPredictionPanel = new URL(
  '../../src/components/learning/circuit/CircuitPredictionPanel.jsx',
  import.meta.url,
)

describe('CircuitDiagram architecture governance', () => {
  it('keeps raw GCSE circuit symbols inside the governed primitive library', () => {
    expect(renderer).toContain("from './circuit/CircuitPrimitives.jsx'")

    for (const tag of ['path', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'polyline']) {
      expect(renderer).not.toMatch(new RegExp(`<${tag}\\b`))
    }

    for (const primitive of [
      'CircuitSwitch',
      'CircuitLamp',
      'CircuitAmmeter',
      'CircuitVoltmeter',
      'CircuitFuse',
      'CircuitDiode',
      'CircuitLed',
      'CircuitThermistor',
      'CircuitLdr',
      'CircuitVariableResistor',
    ]) {
      expect(primitives).toContain(`export function ${primitive}`)
    }
  })

  it('keeps circuit-specific layouts and science outcomes in presets, not renderer branches', () => {
    expect(presets).toContain("export const SIMPLE_SERIES_CIRCUIT_ID = 'simpleSeries'")
    expect(presets).toContain("export const TWO_SWITCH_SERIES_CIRCUIT_ID = 'twoSwitchSeries'")
    expect(presets).toContain("export const PARALLEL_BRANCHES_CIRCUIT_ID = 'parallelBranches'")
    expect(presets).toContain("export const MEASUREMENT_CIRCUIT_ID = 'measurementCircuit'")
    expect(renderer).toContain("preset = 'simpleSeries'")

    for (const presetId of [
      'twoSwitchSeries',
      'parallelBranches',
      'measurementCircuit',
    ]) {
      expect(renderer).not.toContain(presetId)
    }

    expect(renderer).not.toMatch(/circuit\.id\s*===/)
    expect(renderer).not.toMatch(/preset\s*===/)
  })

  it('keeps presets data-only and free from local JSX implementations', () => {
    expect(presets).not.toMatch(/from ['"]react['"]/)
    expect(presets).not.toMatch(/<[A-Z][A-Za-z]+/)
    expect(presets).toContain("activeWhen: { allClosed: ['switch-a', 'switch-b'] }")
    expect(presets).toContain("activeWhen: { allClosed: ['switch-a'] }")
    expect(presets).toContain("activeWhen: { allClosed: ['switch-b'] }")
    expect(presets).toContain("activeWhen: { anyClosed: ['switch-a', 'switch-b'] }")
  })

  it('keeps prediction, answer and feedback orchestration outside CircuitDiagram', () => {
    expect(renderer).not.toContain('CircuitPredictionPanel')
    expect(renderer).not.toContain('predictThenTest')
    expect(renderer).not.toContain('onPrediction')
    expect(renderer).not.toContain('correctOptionId')
    expect(presets).not.toMatch(/\bprediction\s*:/)
    expect(presets).not.toContain('correctOptionId')
    expect(presets).not.toContain('testInstruction')
    expect(existsSync(legacyPredictionPanel)).toBe(false)
  })

  it('builds the symbol reference from the same primitives rather than local SVG geometry', () => {
    expect(symbolReference).toContain("from './circuit/CircuitPrimitives.jsx'")

    for (const tag of ['path', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'polyline']) {
      expect(symbolReference).not.toMatch(new RegExp(`<${tag}\\b`))
    }

    expect(symbolReference).toContain('CircuitSwitch')
    expect(symbolReference).toContain('CircuitBattery')
    expect(symbolReference).toContain('CircuitLamp')
    expect(symbolReference).toContain('CircuitThermistor')
    expect(symbolReference).toContain('CircuitLdr')
    expect(symbolReference).toContain('CircuitLed')
  })

  it('uses semantic circuit colour roles rather than local success colours', () => {
    expect(renderer).toContain('PHYSICS_CIRCUIT_VISUAL_ROLES')
    expect(symbolReference).toContain('PHYSICS_CIRCUIT_VISUAL_ROLES')
    expect(visualRoles).toContain('interaction: subjectTheme.accent')
    expect(visualRoles).toContain('conducting: subjectTheme.accent')
    expect(visualRoles).toContain('emittedLight: subjectTheme.accentSecondary')
    expect(renderer).not.toMatch(/#[0-9a-fA-F]{3,8}/)
    expect(symbolReference).not.toMatch(/#[0-9a-fA-F]{3,8}/)
  })

  it('keeps read-only behaviour as a renderer capability rather than another diagram fork', () => {
    expect(renderer).toContain('interactive,')
    expect(renderer).toContain("data-circuit-interactive={canInteract ? 'true' : 'false'}")
    expect(renderer).toContain("'This circuit is shown as a read-only diagram.'")
    expect(presets).toContain('interactive: false')
  })

  it('keeps the tested minimum touch target wired into the real switch primitive', () => {
    expect(primitives).toContain("from './circuitGeometry.js'")
    expect(primitives).toContain('resolveCircuitSwitchHitBox({')
    expect(primitives).toContain("data-circuit-hit-target={semantic ? 'true' : undefined}")
  })

  it('protects reduced motion through both explicit and device-preference paths', () => {
    expect(renderer).toContain('.circuit-diagram--reduced-motion')
    expect(renderer).toContain('@media (prefers-reduced-motion: reduce)')
    expect(renderer).toContain('.circuit-diagram__current-pulse')
    expect(renderer).toContain('display: none;')
  })
})
