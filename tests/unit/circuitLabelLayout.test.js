import { describe, expect, it } from 'vitest'
import {
  PARALLEL_BRANCHES_CIRCUIT,
  SIMPLE_SERIES_CIRCUIT,
  TWO_SWITCH_SERIES_CIRCUIT,
} from '../../src/components/learning/circuit/circuitPresets.js'

function byId(items, id) {
  return items.find(item => item.id === id)
}

describe('CircuitDiagram label layout', () => {
  it('aligns simple-series component names with their symbols instead of the side margins', () => {
    const battery = byId(SIMPLE_SERIES_CIRCUIT.components, 'battery-main')
    const lamp = byId(SIMPLE_SERIES_CIRCUIT.components, 'lamp-main')
    const batteryLabel = byId(SIMPLE_SERIES_CIRCUIT.labels, 'label-battery')
    const lampLabel = byId(SIMPLE_SERIES_CIRCUIT.labels, 'label-lamp')
    const switchLabel = byId(SIMPLE_SERIES_CIRCUIT.labels, 'label-switch')
    const actionLabel = byId(SIMPLE_SERIES_CIRCUIT.labels, 'label-switch-action')

    expect(batteryLabel.x).toBe(battery.x)
    expect(lampLabel.x).toBe(lamp.cx)
    expect(batteryLabel.y).toBeGreaterThan(134)
    expect(lampLabel.y).toBeGreaterThan(lamp.cy + lamp.radius)
    expect(actionLabel.y - switchLabel.y).toBeGreaterThanOrEqual(24)
  })

  it('aligns the two-switch battery and bulb labels as a matched edge pair', () => {
    const battery = byId(TWO_SWITCH_SERIES_CIRCUIT.components, 'battery-main')
    const lamp = byId(TWO_SWITCH_SERIES_CIRCUIT.components, 'lamp-main')
    const batteryLabel = byId(TWO_SWITCH_SERIES_CIRCUIT.labels, 'label-battery')
    const lampLabel = byId(TWO_SWITCH_SERIES_CIRCUIT.labels, 'label-lamp')

    expect(batteryLabel.x).toBe(battery.x)
    expect(lampLabel.x).toBe(lamp.cx)
    expect(batteryLabel.y).toBe(lampLabel.y)
  })

  it('keeps two-switch names and actions on separate, evenly spaced lines', () => {
    for (const suffix of ['a', 'b']) {
      const name = byId(TWO_SWITCH_SERIES_CIRCUIT.labels, `label-switch-${suffix}`)
      const action = byId(TWO_SWITCH_SERIES_CIRCUIT.labels, `label-switch-${suffix}-action`)

      expect(action.x).toBe(name.x)
      expect(action.y - name.y).toBeGreaterThanOrEqual(24)
    }
  })

  it('places parallel branch names above the symbols and actions below them', () => {
    const switchA = byId(PARALLEL_BRANCHES_CIRCUIT.components, 'switch-a')
    const switchB = byId(PARALLEL_BRANCHES_CIRCUIT.components, 'switch-b')
    const switchAName = byId(PARALLEL_BRANCHES_CIRCUIT.labels, 'label-switch-a')
    const switchAAction = byId(PARALLEL_BRANCHES_CIRCUIT.labels, 'label-switch-a-action')
    const switchBName = byId(PARALLEL_BRANCHES_CIRCUIT.labels, 'label-switch-b')
    const switchBAction = byId(PARALLEL_BRANCHES_CIRCUIT.labels, 'label-switch-b-action')

    expect(switchAName.y).toBeLessThan(switchA.y)
    expect(switchAAction.y).toBeGreaterThan(switchA.y)
    expect(switchBName.y).toBeLessThan(switchB.y)
    expect(switchBAction.y).toBeGreaterThan(switchB.y)
    expect(switchBName.y - switchAAction.y).toBeGreaterThanOrEqual(20)
  })
})
