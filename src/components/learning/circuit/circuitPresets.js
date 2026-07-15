// Configuration layer for CircuitDiagram.
//
// This is intentionally a small state model, not an electrical simulator.
// Presets describe what is drawn and which visual state is active for a known
// switch arrangement. That is enough for GCSE teaching interactions without
// introducing resistance, voltage or current-distribution calculations.

export const SIMPLE_SERIES_CIRCUIT_ID = 'simpleSeries'
export const TWO_SWITCH_SERIES_CIRCUIT_ID = 'twoSwitchSeries'

export const DEFAULT_CIRCUIT_CANVAS = Object.freeze({
  minX: 0,
  minY: 0,
  width: 360,
  height: 210,
  safeInset: 16,
})

export const SIMPLE_SERIES_CIRCUIT = Object.freeze({
  id: SIMPLE_SERIES_CIRCUIT_ID,
  canvas: DEFAULT_CIRCUIT_CANVAS,
  maxWidth: 460,
  accessibilityLabel: 'Interactive series circuit',
  primarySwitchId: 'switch-main',

  paths: [
    { id: 'wire-top', d: 'M72,38 H288' },
    { id: 'wire-right-upper', d: 'M288,38 V68' },
    { id: 'wire-right-lower', d: 'M288,104 V134' },
    { id: 'wire-bottom-right', d: 'M288,134 H215' },
    { id: 'wire-bottom-left', d: 'M145,134 H72' },
    { id: 'wire-left-lower', d: 'M72,134 V108' },
    { id: 'wire-left-upper', d: 'M72,66 V38' },
  ],

  currentPaths: [
    {
      id: 'current-main-loop',
      d: 'M72,38 H288 V134 H72 Z',
      activeWhen: { allClosed: ['switch-main'] },
      tone: 'conducting',
      activeOpacity: 0.36,
      pulse: true,
    },
  ],

  components: [
    {
      id: 'battery-main',
      type: 'battery',
      x: 72,
      y: 67,
      strokeTone: 'textPrimary',
    },
    {
      id: 'lamp-main',
      type: 'lamp',
      cx: 288,
      cy: 86,
      radius: 18,
      strokeTone: 'structure',
      activeTone: 'emittedLight',
      fillTone: 'surface',
      activeWhen: { allClosed: ['switch-main'] },
    },
    {
      id: 'switch-main',
      type: 'switch',
      left: 145,
      right: 215,
      y: 134,
      defaultClosed: false,
      openAngle: -24,
      strokeTone: 'structure',
      activeTone: 'interaction',
      accessibilityLabel: 'Main circuit switch',
    },
  ],

  labels: [
    {
      id: 'label-battery',
      x: 36,
      y: 88,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-lamp',
      x: 326,
      y: 90,
      text: 'Bulb',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-switch',
      x: 180,
      y: 170,
      text: 'Switch',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-switch-action',
      x: 180,
      y: 190,
      textAnchor: 'middle',
      tone: 'interaction',
      fontWeight: 600,
      forSwitchId: 'switch-main',
      textByState: {
        open: 'Tap to close',
        closed: 'Tap to open',
      },
    },
  ],

  presentationStates: [
    {
      id: 'closed',
      when: { allClosed: ['switch-main'] },
      heading: 'The switch is closed.',
      explanation: 'The circuit is complete, so current flows and the bulb lights.',
      headingTone: 'emittedLight',
    },
    {
      id: 'open',
      default: true,
      heading: 'The switch is open.',
      explanation: 'There is a gap, so current cannot flow.',
      headingTone: 'textPrimary',
    },
  ],
})

/**
 * Proof-of-flexibility preset: one series loop, two independently operated
 * switches and one bulb. The bulb and conducting path use the same all-closed
 * rule, proving that a second circuit can be authored entirely in data.
 */
export const TWO_SWITCH_SERIES_CIRCUIT = Object.freeze({
  id: TWO_SWITCH_SERIES_CIRCUIT_ID,
  canvas: Object.freeze({
    minX: 0,
    minY: 0,
    width: 360,
    height: 230,
    safeInset: 16,
  }),
  maxWidth: 460,
  accessibilityLabel: 'Interactive series circuit with two switches',
  primarySwitchId: 'switch-a',

  prediction: {
    prompt: 'Switch A is already closed. What do you predict will happen when you close Switch B?',
    options: [
      { id: 'lamp-lights', label: 'The bulb will light' },
      { id: 'lamp-stays-off', label: 'The bulb will stay off' },
    ],
    correctOptionId: 'lamp-lights',
    testWhen: { allClosed: ['switch-a', 'switch-b'] },
    testInstruction: 'Keep Switch A closed, then close Switch B to test it.',
    correctFeedback: 'Closing Switch B removed the final gap, so the circuit became complete and the bulb lit.',
    incorrectFeedback: 'Closing Switch B removed the final gap, so the circuit became complete and the bulb lit.',
  },

  paths: [
    { id: 'wire-top', d: 'M72,38 H288' },
    { id: 'wire-right-upper', d: 'M288,38 V76' },
    { id: 'wire-right-lower', d: 'M288,112 V150' },
    { id: 'wire-bottom-right', d: 'M288,150 H255' },
    { id: 'wire-between-switches', d: 'M205,150 H155' },
    { id: 'wire-bottom-left', d: 'M105,150 H72' },
    { id: 'wire-left-lower', d: 'M72,150 V108' },
    { id: 'wire-left-upper', d: 'M72,66 V38' },
  ],

  currentPaths: [
    {
      id: 'current-main-loop',
      d: 'M72,38 H288 V150 H72 Z',
      activeWhen: { allClosed: ['switch-a', 'switch-b'] },
      tone: 'conducting',
      activeOpacity: 0.36,
      pulse: true,
    },
  ],

  components: [
    {
      id: 'battery-main',
      type: 'battery',
      x: 72,
      y: 67,
      strokeTone: 'textPrimary',
    },
    {
      id: 'lamp-main',
      type: 'lamp',
      cx: 288,
      cy: 94,
      radius: 18,
      strokeTone: 'structure',
      activeTone: 'emittedLight',
      fillTone: 'surface',
      activeWhen: { allClosed: ['switch-a', 'switch-b'] },
    },
    {
      id: 'switch-a',
      type: 'switch',
      left: 105,
      right: 155,
      y: 150,
      defaultClosed: true,
      openAngle: -24,
      strokeTone: 'structure',
      activeTone: 'interaction',
      accessibilityLabel: 'Switch A',
    },
    {
      id: 'switch-b',
      type: 'switch',
      left: 205,
      right: 255,
      y: 150,
      defaultClosed: false,
      openAngle: -24,
      strokeTone: 'structure',
      activeTone: 'interaction',
      accessibilityLabel: 'Switch B',
    },
  ],

  labels: [
    {
      id: 'label-battery',
      x: 36,
      y: 88,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-lamp',
      x: 326,
      y: 98,
      text: 'Bulb',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-switch-a',
      x: 130,
      y: 184,
      text: 'Switch A',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-switch-a-action',
      x: 130,
      y: 204,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 10,
      fontWeight: 600,
      forSwitchId: 'switch-a',
      lockedText: 'Predict first',
      textByState: {
        bothClosed: 'Tap to open',
        switchAOpen: 'Tap to close',
        switchBOpen: 'Tap to open',
        bothOpen: 'Tap to close',
      },
    },
    {
      id: 'label-switch-b',
      x: 230,
      y: 184,
      text: 'Switch B',
      textAnchor: 'middle',
      tone: 'textSecondary',
    },
    {
      id: 'label-switch-b-action',
      x: 230,
      y: 204,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 10,
      fontWeight: 600,
      forSwitchId: 'switch-b',
      lockedText: 'Predict first',
      textByState: {
        bothClosed: 'Tap to open',
        switchAOpen: 'Tap to open',
        switchBOpen: 'Tap to close',
        bothOpen: 'Tap to close',
      },
    },
  ],

  presentationStates: [
    {
      id: 'bothClosed',
      when: { allClosed: ['switch-a', 'switch-b'] },
      heading: 'Both switches are closed.',
      explanation: 'Every gap is closed, so the circuit is complete and the bulb lights.',
      headingTone: 'emittedLight',
    },
    {
      id: 'switchAOpen',
      when: { allOpen: ['switch-a'], allClosed: ['switch-b'] },
      heading: 'Switch A is open.',
      explanation: 'One gap is enough to break the circuit, so no current flows and the bulb stays off.',
      headingTone: 'textPrimary',
    },
    {
      id: 'switchBOpen',
      when: { allClosed: ['switch-a'], allOpen: ['switch-b'] },
      heading: 'Switch B is open.',
      explanation: 'One gap is enough to break the circuit, so no current flows and the bulb stays off.',
      headingTone: 'textPrimary',
    },
    {
      id: 'bothOpen',
      default: true,
      heading: 'Both switches are open.',
      explanation: 'There are two gaps, so the circuit is incomplete and the bulb stays off.',
      headingTone: 'textPrimary',
    },
  ],
})

export const CIRCUIT_PRESETS = Object.freeze({
  [SIMPLE_SERIES_CIRCUIT_ID]: SIMPLE_SERIES_CIRCUIT,
  [TWO_SWITCH_SERIES_CIRCUIT_ID]: TWO_SWITCH_SERIES_CIRCUIT,
})

function hasIds(ids) {
  return Array.isArray(ids) && ids.length > 0
}

function isFinitePositive(value) {
  return Number.isFinite(value) && value > 0
}

/**
 * Resolve every preset onto one predictable SVG coordinate system.
 *
 * New presets should use `canvas`. A legacy `viewBox` string is still accepted
 * so existing custom stories and work-in-progress diagrams do not break.
 */
export function resolveCircuitCanvas(preset = {}) {
  const canvas = preset.canvas
  if (canvas && isFinitePositive(canvas.width) && isFinitePositive(canvas.height)) {
    const minX = Number.isFinite(canvas.minX) ? canvas.minX : 0
    const minY = Number.isFinite(canvas.minY) ? canvas.minY : 0
    const safeInset = Number.isFinite(canvas.safeInset)
      ? Math.max(0, canvas.safeInset)
      : DEFAULT_CIRCUIT_CANVAS.safeInset

    return {
      minX,
      minY,
      width: canvas.width,
      height: canvas.height,
      safeInset,
      viewBox: `${minX} ${minY} ${canvas.width} ${canvas.height}`,
    }
  }

  const legacyViewBox = String(preset.viewBox ?? '')
    .trim()
    .split(/\s+/)
    .map(Number)

  if (legacyViewBox.length === 4
    && legacyViewBox.every(Number.isFinite)
    && isFinitePositive(legacyViewBox[2])
    && isFinitePositive(legacyViewBox[3])) {
    const [minX, minY, width, height] = legacyViewBox
    return {
      minX,
      minY,
      width,
      height,
      safeInset: DEFAULT_CIRCUIT_CANVAS.safeInset,
      viewBox: `${minX} ${minY} ${width} ${height}`,
    }
  }

  return {
    ...DEFAULT_CIRCUIT_CANVAS,
    viewBox: `${DEFAULT_CIRCUIT_CANVAS.minX} ${DEFAULT_CIRCUIT_CANVAS.minY} ${DEFAULT_CIRCUIT_CANVAS.width} ${DEFAULT_CIRCUIT_CANVAS.height}`,
  }
}

/**
 * Match a declarative condition against switch state.
 * Multiple clauses are ANDed, allowing future presets to describe series and
 * parallel outcomes without adding a full circuit-solving engine.
 */
export function matchesCircuitCondition(condition, switchStates = {}) {
  if (!condition) return false
  if (condition.always) return true

  if (hasIds(condition.allClosed)
    && !condition.allClosed.every(id => switchStates[id] === true)) {
    return false
  }

  if (hasIds(condition.anyClosed)
    && !condition.anyClosed.some(id => switchStates[id] === true)) {
    return false
  }

  if (hasIds(condition.allOpen)
    && !condition.allOpen.every(id => switchStates[id] !== true)) {
    return false
  }

  if (hasIds(condition.anyOpen)
    && !condition.anyOpen.some(id => switchStates[id] !== true)) {
    return false
  }

  return true
}

export function resolveCircuitPreset(preset = SIMPLE_SERIES_CIRCUIT_ID) {
  if (typeof preset === 'object' && preset !== null) return preset

  const resolved = CIRCUIT_PRESETS[preset]
  if (!resolved) {
    throw new Error(`Unknown circuit preset: ${String(preset)}`)
  }

  return resolved
}

export function getCircuitPresentationState(preset, switchStates = {}) {
  const states = preset.presentationStates ?? []
  const matched = states.find(state => (
    !state.default && matchesCircuitCondition(state.when, switchStates)
  ))

  return matched ?? states.find(state => state.default) ?? {
    id: 'default',
    heading: '',
    explanation: '',
    headingTone: 'textPrimary',
  }
}

export function resolveCircuitLabelText(label, presentationStateId) {
  return label.textByState?.[presentationStateId] ?? label.text ?? ''
}

/**
 * Resolve the outcome only after the learner has committed to a prediction and
 * the configured test condition has actually been reached.
 */
export function getCircuitPredictionResult(preset, selectedOptionId, switchStates = {}) {
  const prediction = preset.prediction
  if (!prediction || !selectedOptionId) return null
  if (!matchesCircuitCondition(prediction.testWhen, switchStates)) return null

  const selectedOption = prediction.options?.find(option => option.id === selectedOptionId)
  if (!selectedOption) return null

  const correct = selectedOptionId === prediction.correctOptionId
  return {
    optionId: selectedOptionId,
    optionLabel: selectedOption.label,
    correct,
    feedback: correct
      ? prediction.correctFeedback
      : prediction.incorrectFeedback,
  }
}
