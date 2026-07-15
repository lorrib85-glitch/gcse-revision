// Configuration layer for CircuitDiagram.
//
// This is intentionally a small state model, not an electrical simulator.
// Presets describe what is drawn and which visual state is active for a known
// switch arrangement. Page-level teaching flows can place questions, predictions
// or exam tasks around the diagram without putting those concerns in the renderer.

export const SIMPLE_SERIES_CIRCUIT_ID = 'simpleSeries'
export const TWO_SWITCH_SERIES_CIRCUIT_ID = 'twoSwitchSeries'
export const PARALLEL_BRANCHES_CIRCUIT_ID = 'parallelBranches'
export const MEASUREMENT_CIRCUIT_ID = 'measurementCircuit'

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
      x: 72,
      y: 152,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10.5,
      fontWeight: 500,
    },
    {
      id: 'label-lamp',
      x: 288,
      y: 122,
      text: 'Bulb',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10.5,
      fontWeight: 500,
    },
    {
      id: 'label-switch',
      x: 180,
      y: 166,
      text: 'Switch',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10.5,
      fontWeight: 500,
    },
    {
      id: 'label-switch-action',
      x: 180,
      y: 192,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 10.5,
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
 * One series loop with two independently operated switches. The bulb and
 * conducting path share the same all-closed rule, so one remaining gap keeps the
 * entire circuit off.
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
      x: 72,
      y: 130,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-lamp',
      x: 288,
      y: 130,
      text: 'Bulb',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-a',
      x: 130,
      y: 184,
      text: 'Switch A',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-a-action',
      x: 130,
      y: 208,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 9.5,
      fontWeight: 600,
      forSwitchId: 'switch-a',
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
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-b-action',
      x: 230,
      y: 208,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 9.5,
      fontWeight: 600,
      forSwitchId: 'switch-b',
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

/**
 * Two independently switched parallel branches. Each branch can remain complete
 * while the other is open, so lamps and current paths respond independently.
 */
export const PARALLEL_BRANCHES_CIRCUIT = Object.freeze({
  id: PARALLEL_BRANCHES_CIRCUIT_ID,
  canvas: Object.freeze({
    minX: 0,
    minY: 0,
    width: 360,
    height: 250,
    safeInset: 16,
  }),
  maxWidth: 460,
  accessibilityLabel: 'Interactive parallel circuit with two independently switched lamps',
  primarySwitchId: 'switch-a',

  paths: [
    { id: 'wire-left-rail-upper', d: 'M50,50 V145' },
    { id: 'wire-left-rail-lower', d: 'M50,179 V210' },
    { id: 'wire-right-rail', d: 'M310,50 V210' },
    { id: 'wire-return', d: 'M310,210 H50' },
    { id: 'wire-branch-a-left', d: 'M50,50 H100' },
    { id: 'wire-branch-a-middle', d: 'M150,50 H227' },
    { id: 'wire-branch-a-right', d: 'M263,50 H310' },
    { id: 'wire-branch-b-left', d: 'M50,120 H100' },
    { id: 'wire-branch-b-middle', d: 'M150,120 H227' },
    { id: 'wire-branch-b-right', d: 'M263,120 H310' },
  ],

  // Current is shown only on wire segments that belong to a complete loop.
  // An open branch does not carry current even on the short wire before its switch.
  currentPaths: [
    {
      id: 'current-shared-rails',
      d: 'M50,145 V120 M310,120 V210 H50 V179',
      activeWhen: { anyClosed: ['switch-a', 'switch-b'] },
      tone: 'conducting',
      activeOpacity: 0.38,
      pulse: false,
    },
    {
      id: 'current-upper-rails',
      d: 'M50,120 V50 M310,50 V120',
      activeWhen: { allClosed: ['switch-a'] },
      tone: 'conducting',
      activeOpacity: 0.38,
      pulse: false,
    },
    {
      id: 'current-branch-a',
      d: 'M50,50 H310',
      activeWhen: { allClosed: ['switch-a'] },
      tone: 'conducting',
      activeOpacity: 0.38,
      pulse: true,
    },
    {
      id: 'current-branch-b',
      d: 'M50,120 H310',
      activeWhen: { allClosed: ['switch-b'] },
      tone: 'conducting',
      activeOpacity: 0.38,
      pulse: true,
    },
  ],

  components: [
    {
      id: 'battery-main',
      type: 'battery',
      x: 50,
      y: 145,
      strokeTone: 'textPrimary',
    },
    {
      id: 'switch-a',
      type: 'switch',
      left: 100,
      right: 150,
      y: 50,
      defaultClosed: true,
      openAngle: -24,
      strokeTone: 'structure',
      activeTone: 'interaction',
      accessibilityLabel: 'Switch A for Lamp A',
    },
    {
      id: 'lamp-a',
      type: 'lamp',
      cx: 245,
      cy: 50,
      radius: 18,
      strokeTone: 'structure',
      activeTone: 'emittedLight',
      fillTone: 'surface',
      activeWhen: { allClosed: ['switch-a'] },
    },
    {
      id: 'switch-b',
      type: 'switch',
      left: 100,
      right: 150,
      y: 120,
      defaultClosed: false,
      openAngle: -24,
      strokeTone: 'structure',
      activeTone: 'interaction',
      accessibilityLabel: 'Switch B for Lamp B',
    },
    {
      id: 'lamp-b',
      type: 'lamp',
      cx: 245,
      cy: 120,
      radius: 18,
      strokeTone: 'structure',
      activeTone: 'emittedLight',
      fillTone: 'surface',
      activeWhen: { allClosed: ['switch-b'] },
    },
    {
      id: 'junction-a-left',
      type: 'junction',
      cx: 50,
      cy: 50,
      radius: 3.5,
      strokeTone: 'structure',
      activeTone: 'conducting',
      activeWhen: { allClosed: ['switch-a'] },
    },
    {
      id: 'junction-a-right',
      type: 'junction',
      cx: 310,
      cy: 50,
      radius: 3.5,
      strokeTone: 'structure',
      activeTone: 'conducting',
      activeWhen: { allClosed: ['switch-a'] },
    },
    {
      id: 'junction-b-left',
      type: 'junction',
      cx: 50,
      cy: 120,
      radius: 3.5,
      strokeTone: 'structure',
      activeTone: 'conducting',
      activeWhen: { allClosed: ['switch-b'] },
    },
    {
      id: 'junction-b-right',
      type: 'junction',
      cx: 310,
      cy: 120,
      radius: 3.5,
      strokeTone: 'structure',
      activeTone: 'conducting',
      activeWhen: { allClosed: ['switch-b'] },
    },
  ],

  labels: [
    {
      id: 'label-battery',
      x: 50,
      y: 198,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 9.5,
      fontWeight: 500,
    },
    {
      id: 'label-switch-a',
      x: 125,
      y: 24,
      text: 'Switch A',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-a-action',
      x: 125,
      y: 82,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 9.5,
      fontWeight: 600,
      forSwitchId: 'switch-a',
      textByState: {
        bothClosed: 'Tap to open',
        onlyAClosed: 'Tap to open',
        onlyBClosed: 'Tap to close',
        bothOpen: 'Tap to close',
      },
    },
    {
      id: 'label-lamp-a',
      x: 245,
      y: 24,
      text: 'Lamp A',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-b',
      x: 125,
      y: 104,
      text: 'Switch B',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-switch-b-action',
      x: 125,
      y: 158,
      textAnchor: 'middle',
      tone: 'interaction',
      fontSize: 9.5,
      fontWeight: 600,
      forSwitchId: 'switch-b',
      textByState: {
        bothClosed: 'Tap to open',
        onlyAClosed: 'Tap to close',
        onlyBClosed: 'Tap to open',
        bothOpen: 'Tap to close',
      },
    },
    {
      id: 'label-lamp-b',
      x: 245,
      y: 104,
      text: 'Lamp B',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
  ],

  presentationStates: [
    {
      id: 'bothClosed',
      when: { allClosed: ['switch-a', 'switch-b'] },
      heading: 'Both lamps are on.',
      explanation: 'Both branches are complete, so current flows around both complete loops.',
      headingTone: 'emittedLight',
    },
    {
      id: 'onlyAClosed',
      when: { allClosed: ['switch-a'], allOpen: ['switch-b'] },
      heading: 'Lamp A is on. Lamp B is off.',
      explanation: 'Current flows around the complete loop through Branch A. No current flows anywhere in open Branch B.',
      headingTone: 'emittedLight',
    },
    {
      id: 'onlyBClosed',
      when: { allOpen: ['switch-a'], allClosed: ['switch-b'] },
      heading: 'Lamp A is off. Lamp B is on.',
      explanation: 'Current flows around the complete loop through Branch B. No current flows anywhere in open Branch A.',
      headingTone: 'emittedLight',
    },
    {
      id: 'bothOpen',
      default: true,
      heading: 'Both lamps are off.',
      explanation: 'Neither branch forms a complete loop, so no current flows in either branch.',
      headingTone: 'textPrimary',
    },
  ],
})

/**
 * Read-only placement diagram. The ammeter is in the main series loop and the
 * voltmeter is connected across the resistor, matching GCSE exam conventions.
 */
export const MEASUREMENT_CIRCUIT = Object.freeze({
  id: MEASUREMENT_CIRCUIT_ID,
  canvas: Object.freeze({
    minX: 0,
    minY: 0,
    width: 360,
    height: 220,
    safeInset: 16,
  }),
  maxWidth: 460,
  accessibilityLabel: 'Circuit showing correct ammeter and voltmeter placement',
  interactive: false,

  paths: [
    { id: 'wire-left-upper', d: 'M60,40 V75' },
    { id: 'wire-left-lower', d: 'M60,109 V180' },
    { id: 'wire-top-left', d: 'M60,40 H127' },
    { id: 'wire-top-middle', d: 'M163,40 H224' },
    { id: 'wire-top-right', d: 'M266,40 H300' },
    { id: 'wire-right-and-return', d: 'M300,40 V180 H60' },
    { id: 'wire-voltmeter-left', d: 'M216,40 V105 H227' },
    { id: 'wire-voltmeter-right', d: 'M263,105 H274 V40' },
  ],

  currentPaths: [],

  components: [
    {
      id: 'battery-main',
      type: 'battery',
      x: 60,
      y: 75,
      strokeTone: 'textPrimary',
    },
    {
      id: 'ammeter-main',
      type: 'ammeter',
      cx: 145,
      cy: 40,
      radius: 18,
      strokeTone: 'structure',
      fillTone: 'surface',
    },
    {
      id: 'resistor-main',
      type: 'resistor',
      cx: 245,
      cy: 40,
      width: 42,
      height: 16,
      strokeTone: 'structure',
    },
    {
      id: 'voltmeter-main',
      type: 'voltmeter',
      cx: 245,
      cy: 105,
      radius: 18,
      strokeTone: 'structure',
      fillTone: 'surface',
    },
    {
      id: 'junction-left',
      type: 'junction',
      cx: 216,
      cy: 40,
      radius: 3.5,
      strokeTone: 'structure',
    },
    {
      id: 'junction-right',
      type: 'junction',
      cx: 274,
      cy: 40,
      radius: 3.5,
      strokeTone: 'structure',
    },
  ],

  labels: [
    {
      id: 'label-battery',
      x: 60,
      y: 132,
      text: 'Battery',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-ammeter',
      x: 145,
      y: 76,
      text: 'Ammeter',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-resistor',
      x: 245,
      y: 76,
      text: 'Resistor',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
    {
      id: 'label-voltmeter',
      x: 245,
      y: 142,
      text: 'Voltmeter',
      textAnchor: 'middle',
      tone: 'textSecondary',
      fontSize: 10,
      fontWeight: 500,
    },
  ],

  presentationStates: [
    {
      id: 'placement',
      default: true,
      heading: 'Ammeter in series. Voltmeter in parallel.',
      explanation: 'The ammeter sits in the main loop. The voltmeter is connected across the resistor.',
      headingTone: 'textPrimary',
    },
  ],
})

export const CIRCUIT_PRESETS = Object.freeze({
  [SIMPLE_SERIES_CIRCUIT_ID]: SIMPLE_SERIES_CIRCUIT,
  [TWO_SWITCH_SERIES_CIRCUIT_ID]: TWO_SWITCH_SERIES_CIRCUIT,
  [PARALLEL_BRANCHES_CIRCUIT_ID]: PARALLEL_BRANCHES_CIRCUIT,
  [MEASUREMENT_CIRCUIT_ID]: MEASUREMENT_CIRCUIT,
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
 * Match a declarative condition against switch state. Multiple clauses are
 * ANDed, allowing series and parallel outcomes without a full circuit solver.
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
