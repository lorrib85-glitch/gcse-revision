import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CIRCUIT_CANVAS,
  SIMPLE_SERIES_CIRCUIT,
  getCircuitPredictionResult,
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from '../../src/components/learning/circuit/circuitPresets.js'

describe('CircuitDiagram presets', () => {
  it('resolves the named simple-series preset', () => {
    expect(resolveCircuitPreset('simpleSeries')).toBe(SIMPLE_SERIES_CIRCUIT)
  })

  it('rejects unknown preset names instead of silently rendering the wrong circuit', () => {
    expect(() => resolveCircuitPreset('missing-preset')).toThrow('Unknown circuit preset')
  })

  it('resolves a stable responsive canvas from preset coordinates', () => {
    const canvas = resolveCircuitCanvas(SIMPLE_SERIES_CIRCUIT)

    expect(canvas).toEqual({
      ...DEFAULT_CIRCUIT_CANVAS,
      viewBox: '0 0 360 210',
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

  it('keeps learner-facing labels inside the canvas safe area', () => {
    const canvas = resolveCircuitCanvas(SIMPLE_SERIES_CIRCUIT)
    const minX = canvas.minX + canvas.safeInset
    const maxX = canvas.minX + canvas.width - canvas.safeInset
    const minY = canvas.minY + canvas.safeInset
    const maxY = canvas.minY + canvas.height - canvas.safeInset

    for (const label of SIMPLE_SERIES_CIRCUIT.labels) {
      expect(label.x).toBeGreaterThanOrEqual(minX)
      expect(label.x).toBeLessThanOrEqual(maxX)
      expect(label.y).toBeGreaterThanOrEqual(minY)
      expect(label.y).toBeLessThanOrEqual(maxY)
    }
  })

  it('selects the open and closed teaching copy from switch state', () => {
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

  it('uses the same declarative condition for the active path and lamp', () => {
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

  it('resolves state-specific instructional labels', () => {
    const actionLabel = SIMPLE_SERIES_CIRCUIT.labels.find(
      label => label.id === 'label-switch-action',
    )

    expect(resolveCircuitLabelText(actionLabel, 'open')).toBe('Tap to close')
    expect(resolveCircuitLabelText(actionLabel, 'closed')).toBe('Tap to open')
    expect(actionLabel.lockedText).toBe('Predict first')
  })

  it('defines an accessible prediction before the circuit test', () => {
    const prediction = SIMPLE_SERIES_CIRCUIT.prediction
    const circuitSwitch = SIMPLE_SERIES_CIRCUIT.components.find(
      component => component.type === 'switch',
    )

    expect(prediction.prompt).toContain('predict')
    expect(prediction.options).toHaveLength(2)
    expect(prediction.correctOptionId).toBe('lamp-lights')
    expect(prediction.testWhen).toEqual({ allClosed: ['switch-main'] })
    expect(circuitSwitch.accessibilityLabel).toBe('Main circuit switch')
  })

  it('does not reveal a prediction result before the configured test condition', () => {
    expect(getCircuitPredictionResult(
      SIMPLE_SERIES_CIRCUIT,
      'lamp-lights',
      { 'switch-main': false },
    )).toBeNull()
  })

  it('marks the prediction only after the learner closes the switch', () => {
    expect(getCircuitPredictionResult(
      SIMPLE_SERIES_CIRCUIT,
      'lamp-lights',
      { 'switch-main': true },
    )).toMatchObject({
      optionId: 'lamp-lights',
      correct: true,
    })

    expect(getCircuitPredictionResult(
      SIMPLE_SERIES_CIRCUIT,
      'lamp-stays-off',
      { 'switch-main': true },
    )).toMatchObject({
      optionId: 'lamp-stays-off',
      correct: false,
    })
  })
})
