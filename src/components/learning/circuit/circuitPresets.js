// Configuration layer for CircuitDiagram.
//
// This is intentionally a small state model, not an electrical simulator.
// Presets describe what is drawn and which visual state is active for a known
// switch arrangement. That is enough for GCSE teaching interactions without
// introducing resistance, voltage or current-distribution calculations.

export const SIMPLE_SERIES_CIRCUIT_ID = 'simpleSeries'

export const SIMPLE_SERIES_CIRCUIT = Object.freeze({
  id: SIMPLE_SERIES_CIRCUIT_ID,
  viewBox: '0 0 360 194',
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
    },
  ],

  components: [
    {
      id: 'battery-main',
      type: 'battery',
      x: 72,
      y: 67,
    },
    {
      id: 'lamp-main',
      type: 'lamp',
      cx: 288,
      cy: 86,
      radius: 18,
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
    },
  ],

  labels: [
    { id: 'label-battery', x: 22, y: 90, text: 'Battery', tone: 'secondary' },
    { id: 'label-lamp', x: 313, y: 90, text: 'Bulb', tone: 'secondary' },
    {
      id: 'label-switch',
      x: 180,
      y: 164,
      text: 'Switch',
      textAnchor: 'middle',
      tone: 'secondary',
    },
    {
      id: 'label-switch-action',
      x: 180,
      y: 184,
      textAnchor: 'middle',
      tone: 'accent',
      fontWeight: 600,
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
      headingTone: 'light',
    },
    {
      id: 'open',
      default: true,
      heading: 'The switch is open.',
      explanation: 'There is a gap, so current cannot flow.',
      headingTone: 'primary',
    },
  ],
})

export const CIRCUIT_PRESETS = Object.freeze({
  [SIMPLE_SERIES_CIRCUIT_ID]: SIMPLE_SERIES_CIRCUIT,
})

function hasIds(ids) {
  return Array.isArray(ids) && ids.length > 0
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
    headingTone: 'primary',
  }
}

export function resolveCircuitLabelText(label, presentationStateId) {
  return label.textByState?.[presentationStateId] ?? label.text ?? ''
}
