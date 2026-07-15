import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CIRCUIT_CANVAS,
  SIMPLE_SERIES_CIRCUIT,
  TWO_SWITCH_SERIES_CIRCUIT,
  getCircuitPredictionResult,
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from '../../src/components/learning/circuit/circuitPresets.js'

describe('CircuitDiagram presets', () => {
  it('resolves both registered series-circuit presets', () => {
    expect(resolveCircuitPreset('simpleSeries')).toBe(SIMPLE_SERIES_CIRCUIT)
    expect(resolveCircuitPreset('twoSwitchSeries')).toBe(TWO_SWITCH_SERIES_CIRCUIT)
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
    for (const preset of [SIMPLE_SERIES_CIRCUIT, TWO_SWITCH_SERIES_CIRCUIT]) {
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

  it('starts the two-switch proof circuit with A closed and B open', () => {
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

  it('keeps the two-switch bulb off until every series gap is closed', () => {
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

  it('places prediction on the more meaningful two-switch circuit', () => {
    const prediction = TWO_SWITCH_SERIES_CIRCUIT.prediction

    expect(SIMPLE_SERIES_CIRCUIT.prediction).toBeUndefined()
    expect(prediction.prompt).toContain('Switch A is already closed')
    expect(prediction.prompt).toContain('Switch B')
    expect(prediction.options).toHaveLength(2)
    expect(prediction.correctOptionId).toBe('lamp-lights')
    expect(prediction.testWhen).toEqual({ allClosed: ['switch-a', 'switch-b'] })
  })

  it('does not reveal the two-switch prediction result while any gap remains', () => {
    expect(getCircuitPredictionResult(
      TWO_SWITCH_SERIES_CIRCUIT,
      'lamp-lights',
      { 'switch-a': true, 'switch-b': false },
    )).toBeNull()

    expect(getCircuitPredictionResult(
      TWO_SWITCH_SERIES_CIRCUIT,
      'lamp-lights',
      { 'switch-a': false, 'switch-b': true },
    )).toBeNull()
  })

  it('marks the prediction only after both switches complete the circuit', () => {
    const completedCircuit = { 'switch-a': true, 'switch-b': true }

    expect(getCircuitPredictionResult(
      TWO_SWITCH_SERIES_CIRCUIT,
      'lamp-lights',
      completedCircuit,
    )).toMatchObject({
      optionId: 'lamp-lights',
      correct: true,
    })

    expect(getCircuitPredictionResult(
      TWO_SWITCH_SERIES_CIRCUIT,
      'lamp-stays-off',
      completedCircuit,
    )).toMatchObject({
      optionId: 'lamp-stays-off',
      correct: false,
    })
  })
})
