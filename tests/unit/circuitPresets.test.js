import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CIRCUIT_CANVAS,
  MEASUREMENT_CIRCUIT,
  PARALLEL_BRANCHES_CIRCUIT,
  SIMPLE_SERIES_CIRCUIT,
  TWO_SWITCH_SERIES_CIRCUIT,
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from '../../src/components/learning/circuit/circuitPresets.js'

const REGISTERED_PRESETS = [
  SIMPLE_SERIES_CIRCUIT,
  TWO_SWITCH_SERIES_CIRCUIT,
  PARALLEL_BRANCHES_CIRCUIT,
  MEASUREMENT_CIRCUIT,
]

describe('CircuitDiagram presets', () => {
  it('resolves every registered circuit preset', () => {
    expect(resolveCircuitPreset('simpleSeries')).toBe(SIMPLE_SERIES_CIRCUIT)
    expect(resolveCircuitPreset('twoSwitchSeries')).toBe(TWO_SWITCH_SERIES_CIRCUIT)
    expect(resolveCircuitPreset('parallelBranches')).toBe(PARALLEL_BRANCHES_CIRCUIT)
    expect(resolveCircuitPreset('measurementCircuit')).toBe(MEASUREMENT_CIRCUIT)
  })

  it('rejects unknown preset names instead of silently rendering the wrong circuit', () => {
    expect(() => resolveCircuitPreset('missing-preset')).toThrow('Unknown circuit preset')
  })

  it('resolves stable responsive canvases from preset coordinates', () => {
    expect(resolveCircuitCanvas(SIMPLE_SERIES_CIRCUIT)).toEqual({
      ...DEFAULT_CIRCUIT_CANVAS,
      viewBox: '0 0 360 210',
    })

    expect(resolveCircuitCanvas(TWO_SWITCH_SERIES_CIRCUIT)).toMatchObject({
      width: 360,
      height: 230,
      safeInset: 16,
      viewBox: '0 0 360 230',
    })

    expect(resolveCircuitCanvas(PARALLEL_BRANCHES_CIRCUIT)).toMatchObject({
      width: 360,
      height: 250,
      safeInset: 16,
      viewBox: '0 0 360 250',
    })

    expect(resolveCircuitCanvas(MEASUREMENT_CIRCUIT)).toMatchObject({
      width: 360,
      height: 220,
      safeInset: 16,
      viewBox: '0 0 360 220',
    })
  })

  it('keeps legacy custom viewBox presets working during migration', () => {
    expect(resolveCircuitCanvas({ viewBox: '10 20 400 240' })).toMatchObject({
      minX: 10,
      minY: 20,
      width: 400,
      height: 240,
      viewBox: '10 20 400 240',
    })
  })

  it('keeps learner-facing labels inside each canvas safe area', () => {
    for (const preset of REGISTERED_PRESETS) {
      const canvas = resolveCircuitCanvas(preset)
      const minX = canvas.minX + canvas.safeInset
      const maxX = canvas.minX + canvas.width - canvas.safeInset
      const minY = canvas.minY + canvas.safeInset
      const maxY = canvas.minY + canvas.height - canvas.safeInset

      for (const label of preset.labels) {
        expect(label.x).toBeGreaterThanOrEqual(minX)
        expect(label.x).toBeLessThanOrEqual(maxX)
        expect(label.y).toBeGreaterThanOrEqual(minY)
        expect(label.y).toBeLessThanOrEqual(maxY)
      }
    }
  })

  it('selects the open and closed teaching copy for the simple circuit', () => {
    const openState = getCircuitPresentationState(SIMPLE_SERIES_CIRCUIT, {
      'switch-main': false,
    })
    const closedState = getCircuitPresentationState(SIMPLE_SERIES_CIRCUIT, {
      'switch-main': true,
    })

    expect(openState.id).toBe('open')
    expect(openState.explanation).toContain('gap')
    expect(closedState.id).toBe('closed')
    expect(closedState.explanation).toContain('current flows')
  })

  it('uses the same declarative condition for the simple active path and lamp', () => {
    const currentPath = SIMPLE_SERIES_CIRCUIT.currentPaths[0]
    const lamp = SIMPLE_SERIES_CIRCUIT.components.find(component => component.type === 'lamp')

    expect(matchesCircuitCondition(currentPath.activeWhen, { 'switch-main': false })).toBe(false)
    expect(matchesCircuitCondition(lamp.activeWhen, { 'switch-main': false })).toBe(false)
    expect(matchesCircuitCondition(currentPath.activeWhen, { 'switch-main': true })).toBe(true)
    expect(matchesCircuitCondition(lamp.activeWhen, { 'switch-main': true })).toBe(true)
  })

  it('uses a restrained steady path plus one transition pulse', () => {
    const currentPath = SIMPLE_SERIES_CIRCUIT.currentPaths[0]

    expect(currentPath.tone).toBe('conducting')
    expect(currentPath.activeOpacity).toBeLessThanOrEqual(0.5)
    expect(currentPath.pulse).toBe(true)
  })

  it('assigns interaction and scientific outcomes to distinct semantic tones', () => {
    const lamp = SIMPLE_SERIES_CIRCUIT.components.find(component => component.type === 'lamp')
    const circuitSwitch = SIMPLE_SERIES_CIRCUIT.components.find(
      component => component.type === 'switch',
    )
    const closedState = SIMPLE_SERIES_CIRCUIT.presentationStates.find(state => state.id === 'closed')
    const actionLabel = SIMPLE_SERIES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-action',
    )

    expect(circuitSwitch.activeTone).toBe('interaction')
    expect(actionLabel.tone).toBe('interaction')
    expect(lamp.activeTone).toBe('emittedLight')
    expect(closedState.headingTone).toBe('emittedLight')
    expect(lamp.activeTone).not.toBe(circuitSwitch.activeTone)
  })

  it('supports multi-switch series and branch-style rules without a simulator', () => {
    const bothClosed = { allClosed: ['switch-a', 'switch-b'] }
    const eitherClosed = { anyClosed: ['switch-a', 'switch-b'] }

    expect(matchesCircuitCondition(bothClosed, {
      'switch-a': true,
      'switch-b': false,
    })).toBe(false)
    expect(matchesCircuitCondition(bothClosed, {
      'switch-a': true,
      'switch-b': true,
    })).toBe(true)
    expect(matchesCircuitCondition(eitherClosed, {
      'switch-a': false,
      'switch-b': true,
    })).toBe(true)
  })

  it('resolves state-specific instructional labels for the simple circuit', () => {
    const actionLabel = SIMPLE_SERIES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-action',
    )

    expect(resolveCircuitLabelText(actionLabel, 'open')).toBe('Tap to close')
    expect(resolveCircuitLabelText(actionLabel, 'closed')).toBe('Tap to open')
  })

  it('starts the two-switch series circuit with A closed and B open', () => {
    const switches = TWO_SWITCH_SERIES_CIRCUIT.components.filter(
      component => component.type === 'switch',
    )

    expect(switches).toHaveLength(2)
    expect(switches.map(({ id, defaultClosed }) => ({ id, defaultClosed }))).toEqual([
      { id: 'switch-a', defaultClosed: true },
      { id: 'switch-b', defaultClosed: false },
    ])
    expect(switches.map(component => component.accessibilityLabel)).toEqual([
      'Switch A',
      'Switch B',
    ])
  })

  it('keeps the two-switch series bulb off until every gap is closed', () => {
    const currentPath = TWO_SWITCH_SERIES_CIRCUIT.currentPaths[0]
    const lamp = TWO_SWITCH_SERIES_CIRCUIT.components.find(
      component => component.type === 'lamp',
    )
    const combinations = [
      { states: { 'switch-a': false, 'switch-b': false }, stateId: 'bothOpen', active: false },
      { states: { 'switch-a': true, 'switch-b': false }, stateId: 'switchBOpen', active: false },
      { states: { 'switch-a': false, 'switch-b': true }, stateId: 'switchAOpen', active: false },
      { states: { 'switch-a': true, 'switch-b': true }, stateId: 'bothClosed', active: true },
    ]

    for (const combination of combinations) {
      expect(getCircuitPresentationState(
        TWO_SWITCH_SERIES_CIRCUIT,
        combination.states,
      ).id).toBe(combination.stateId)
      expect(matchesCircuitCondition(
        currentPath.activeWhen,
        combination.states,
      )).toBe(combination.active)
      expect(matchesCircuitCondition(
        lamp.activeWhen,
        combination.states,
      )).toBe(combination.active)
    }
  })

  it('gives each two-switch action label the correct instruction in all four states', () => {
    const switchALabel = TWO_SWITCH_SERIES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-a-action',
    )
    const switchBLabel = TWO_SWITCH_SERIES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-b-action',
    )

    expect(resolveCircuitLabelText(switchALabel, 'bothOpen')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchBLabel, 'bothOpen')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchALabel, 'switchBOpen')).toBe('Tap to open')
    expect(resolveCircuitLabelText(switchBLabel, 'switchBOpen')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchALabel, 'switchAOpen')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchBLabel, 'switchAOpen')).toBe('Tap to open')
    expect(resolveCircuitLabelText(switchALabel, 'bothClosed')).toBe('Tap to open')
    expect(resolveCircuitLabelText(switchBLabel, 'bothClosed')).toBe('Tap to open')
  })

  it('starts the parallel circuit with one complete branch and one open branch', () => {
    const switches = PARALLEL_BRANCHES_CIRCUIT.components.filter(
      component => component.type === 'switch',
    )

    expect(switches.map(({ id, defaultClosed }) => ({ id, defaultClosed }))).toEqual([
      { id: 'switch-a', defaultClosed: true },
      { id: 'switch-b', defaultClosed: false },
    ])
    expect(getCircuitPresentationState(PARALLEL_BRANCHES_CIRCUIT, {
      'switch-a': true,
      'switch-b': false,
    }).id).toBe('onlyAClosed')
  })

  it('activates parallel lamps and branch paths independently', () => {
    const lampA = PARALLEL_BRANCHES_CIRCUIT.components.find(component => component.id === 'lamp-a')
    const lampB = PARALLEL_BRANCHES_CIRCUIT.components.find(component => component.id === 'lamp-b')
    const sharedPath = PARALLEL_BRANCHES_CIRCUIT.currentPaths.find(
      path => path.id === 'current-shared-rails',
    )
    const branchA = PARALLEL_BRANCHES_CIRCUIT.currentPaths.find(
      path => path.id === 'current-branch-a',
    )
    const branchB = PARALLEL_BRANCHES_CIRCUIT.currentPaths.find(
      path => path.id === 'current-branch-b',
    )
    const combinations = [
      {
        states: { 'switch-a': false, 'switch-b': false },
        stateId: 'bothOpen',
        a: false,
        b: false,
        shared: false,
      },
      {
        states: { 'switch-a': true, 'switch-b': false },
        stateId: 'onlyAClosed',
        a: true,
        b: false,
        shared: true,
      },
      {
        states: { 'switch-a': false, 'switch-b': true },
        stateId: 'onlyBClosed',
        a: false,
        b: true,
        shared: true,
      },
      {
        states: { 'switch-a': true, 'switch-b': true },
        stateId: 'bothClosed',
        a: true,
        b: true,
        shared: true,
      },
    ]

    for (const combination of combinations) {
      expect(getCircuitPresentationState(
        PARALLEL_BRANCHES_CIRCUIT,
        combination.states,
      ).id).toBe(combination.stateId)
      expect(matchesCircuitCondition(lampA.activeWhen, combination.states)).toBe(combination.a)
      expect(matchesCircuitCondition(lampB.activeWhen, combination.states)).toBe(combination.b)
      expect(matchesCircuitCondition(branchA.activeWhen, combination.states)).toBe(combination.a)
      expect(matchesCircuitCondition(branchB.activeWhen, combination.states)).toBe(combination.b)
      expect(matchesCircuitCondition(sharedPath.activeWhen, combination.states)).toBe(combination.shared)
    }
  })

  it('gives each parallel-branch switch the correct instruction', () => {
    const switchALabel = PARALLEL_BRANCHES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-a-action',
    )
    const switchBLabel = PARALLEL_BRANCHES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-b-action',
    )

    expect(resolveCircuitLabelText(switchALabel, 'onlyAClosed')).toBe('Tap to open')
    expect(resolveCircuitLabelText(switchBLabel, 'onlyAClosed')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchALabel, 'onlyBClosed')).toBe('Tap to close')
    expect(resolveCircuitLabelText(switchBLabel, 'onlyBClosed')).toBe('Tap to open')
  })

  it('models the measurement circuit as a read-only placement diagram', () => {
    const componentTypes = MEASUREMENT_CIRCUIT.components.map(component => component.type)
    const pathIds = MEASUREMENT_CIRCUIT.paths.map(path => path.id)

    expect(MEASUREMENT_CIRCUIT.interactive).toBe(false)
    expect(MEASUREMENT_CIRCUIT.currentPaths).toEqual([])
    expect(componentTypes).toContain('ammeter')
    expect(componentTypes).toContain('voltmeter')
    expect(componentTypes).toContain('resistor')
    expect(componentTypes).not.toContain('switch')
    expect(pathIds).toContain('wire-voltmeter-left')
    expect(pathIds).toContain('wire-voltmeter-right')
    expect(getCircuitPresentationState(MEASUREMENT_CIRCUIT, {}).heading).toContain(
      'Ammeter in series',
    )
  })

  it('keeps prediction and question content outside every circuit preset', () => {
    for (const preset of REGISTERED_PRESETS) {
      expect(preset).not.toHaveProperty('prediction')
      expect(JSON.stringify(preset)).not.toMatch(/correctOptionId|testInstruction|feedback/i)
    }
  })
})
