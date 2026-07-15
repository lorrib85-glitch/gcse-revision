import { useEffect, useId, useRef, useState } from 'react'
import {
  CircuitAmmeter,
  CircuitBattery,
  CircuitCell,
  CircuitJunction,
  CircuitLabel,
  CircuitLamp,
  CircuitPath,
  CircuitResistor,
  CircuitSwitch,
  CircuitVoltmeter,
} from './circuit/CircuitPrimitives.jsx'
import CircuitPredictionPanel from './circuit/CircuitPredictionPanel.jsx'
import {
  getCircuitPredictionResult,
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from './circuit/circuitPresets.js'
import { PHYSICS_CIRCUIT_VISUAL_ROLES } from './circuit/circuitVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The sequence is intentional: the learner moves the switch first, then a calm
// conducting path appears, then the bulb responds. A single travelling highlight
// marks the change without implying that visible particles race around the wire.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes circuit-diagram-pulse {
      0% {
        opacity: 0;
        stroke-dashoffset: 0;
      }
      16% {
        opacity: 0.72;
      }
      74% {
        opacity: 0.52;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: -1;
      }
    }

    .circuit-diagram__switch-control {
      cursor: pointer;
      outline: none;
    }

    .circuit-diagram__switch-control[data-disabled="true"] {
      cursor: default;
    }

    .circuit-diagram__switch-arm {
      transform-box: view-box;
      transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .circuit-diagram__switch-focus {
      opacity: 0;
      transition: opacity 140ms ease;
    }

    .circuit-diagram__switch-control:hover .circuit-diagram__switch-focus,
    .circuit-diagram__switch-control:focus-visible .circuit-diagram__switch-focus {
      opacity: 1;
    }

    .circuit-diagram__conduction {
      opacity: 0;
      pointer-events: none;
      transition: opacity 160ms ease;
    }

    .circuit-diagram__conduction--active {
      opacity: var(--circuit-active-opacity, 0.36);
      transition-delay: 120ms;
    }

    .circuit-diagram__current-pulse {
      opacity: 0;
      pointer-events: none;
      stroke-dasharray: 0.1 0.9;
      stroke-dashoffset: 0;
    }

    .circuit-diagram__current-pulse--active {
      animation: circuit-diagram-pulse 820ms cubic-bezier(0.22, 0.68, 0.28, 1) 120ms 1 both;
      filter: drop-shadow(0 0 1.5px ${PHYSICS_CIRCUIT_VISUAL_ROLES.focusGlow});
    }

    .circuit-diagram__bulb-face,
    .circuit-diagram__bulb-filament {
      transition: fill 160ms ease, stroke 160ms ease;
    }

    .circuit-diagram__bulb-face--lit,
    .circuit-diagram__bulb-filament--lit {
      transition-delay: 260ms;
    }

    .circuit-diagram__bulb-halo {
      opacity: 0;
      transform: scale(0.72);
      transform-box: fill-box;
      transform-origin: center;
      transition: opacity 160ms ease, transform 180ms ease;
    }

    .circuit-diagram__bulb-halo--lit {
      opacity: 1;
      transform: scale(1);
      transition-delay: 260ms;
    }

    .circuit-diagram__prediction-input {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .circuit-diagram__prediction-option:focus-within {
      outline: 2px solid var(--circuit-prediction-focus);
      outline-offset: 3px;
    }

    .circuit-diagram--reduced-motion .circuit-diagram__switch-arm,
    .circuit-diagram--reduced-motion .circuit-diagram__switch-focus,
    .circuit-diagram--reduced-motion .circuit-diagram__conduction,
    .circuit-diagram--reduced-motion .circuit-diagram__bulb-face,
    .circuit-diagram--reduced-motion .circuit-diagram__bulb-filament,
    .circuit-diagram--reduced-motion .circuit-diagram__bulb-halo {
      animation: none;
      transition: none;
    }

    .circuit-diagram--reduced-motion .circuit-diagram__current-pulse {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .circuit-diagram__switch-arm,
      .circuit-diagram__switch-focus,
      .circuit-diagram__conduction,
      .circuit-diagram__bulb-face,
      .circuit-diagram__bulb-filament,
      .circuit-diagram__bulb-halo {
        animation: none;
        transition: none;
      }

      .circuit-diagram__current-pulse {
        display: none;
      }
    }

    @media (forced-colors: active) {
      .circuit-diagram__switch-control:focus-visible .circuit-diagram__switch-focus {
        opacity: 1;
        stroke: Highlight;
      }

      .circuit-diagram__prediction-option:focus-within {
        outline-color: Highlight;
      }
    }
  `
  document.head.appendChild(el)
}

/**
 * Configuration-driven interactive circuit diagram.
 *
 * `preset` may be a registered preset name or a compatible preset object.
 * `closed` and `defaultClosed` remain as the simple-series convenience API;
 * internally, state is stored by switch id so future presets can use more than
 * one independent switch without changing the renderer.
 *
 * Modes:
 * - explore: operate the circuit directly and observe the outcome.
 * - predictThenTest: commit to a prediction before the switch unlocks.
 */
function CircuitDiagram({
  preset = 'simpleSeries',
  mode = 'explore',
  closed,
  defaultClosed,
  onToggle,
  onPrediction,
  onComplete,
  disabled = false,
  reducedMotion = false,
  label,
}) {
  ensureStyles()

  const visualRoles = PHYSICS_CIRCUIT_VISUAL_ROLES
  const circuit = resolveCircuitPreset(preset)
  const canvas = resolveCircuitCanvas(circuit)
  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const components = circuit.components ?? []
  const switchComponents = components.filter(component => component.type === 'switch')
  const primarySwitchId = circuit.primarySwitchId ?? switchComponents[0]?.id
  const prediction = mode === 'predictThenTest' ? circuit.prediction : null
  const predictionCompletionNotified = useRef(false)

  const [uncontrolledSwitchStates, setUncontrolledSwitchStates] = useState(() => {
    const initialStates = Object.fromEntries(
      switchComponents.map(component => [component.id, component.defaultClosed === true]),
    )

    if (primarySwitchId && typeof defaultClosed === 'boolean') {
      initialStates[primarySwitchId] = defaultClosed
    }

    return initialStates
  })
  const [selectedPredictionId, setSelectedPredictionId] = useState(null)
  const [hasTestInteraction, setHasTestInteraction] = useState(false)

  useEffect(() => {
    setSelectedPredictionId(null)
    setHasTestInteraction(false)
    predictionCompletionNotified.current = false
  }, [circuit.id, mode])

  const isPrimaryControlled = primarySwitchId && typeof closed === 'boolean'
  const switchStates = {
    ...uncontrolledSwitchStates,
    ...(isPrimaryControlled ? { [primarySwitchId]: closed } : {}),
  }

  const {
    structure: wire,
    textPrimary,
    textSecondary,
    emittedLight: bulbLight,
    interaction,
    conducting,
    surface,
  } = visualRoles
  const presentationState = getCircuitPresentationState(circuit, switchStates)
  const predictionResult = hasTestInteraction
    ? getCircuitPredictionResult(circuit, selectedPredictionId, switchStates)
    : null
  const predictionRequired = Boolean(prediction && !selectedPredictionId)

  useEffect(() => {
    if (!predictionResult || predictionCompletionNotified.current) return

    predictionCompletionNotified.current = true
    onComplete?.({
      mode: 'predictThenTest',
      predictionId: predictionResult.optionId,
      correct: predictionResult.correct,
      switchStates: { ...switchStates },
    })
  }, [onComplete, predictionResult, switchStates])

  // Semantic names are the governed API. The short legacy aliases remain so
  // work-in-progress custom presets do not break while they migrate.
  const tones = {
    interaction,
    conducting,
    emittedLight: bulbLight,
    structure: wire,
    surface,
    textPrimary,
    textSecondary,
    primary: textPrimary,
    secondary: textSecondary,
    accent: interaction,
    light: bulbLight,
    wire,
  }

  const resolveTone = tone => tones[tone] ?? tone ?? textSecondary

  const selectPrediction = (optionId) => {
    if (!prediction || selectedPredictionId) return
    if (!prediction.options?.some(option => option.id === optionId)) return

    setSelectedPredictionId(optionId)
    setHasTestInteraction(false)
    predictionCompletionNotified.current = false
    onPrediction?.(optionId)
  }

  const toggleSwitch = (switchId) => {
    if (disabled || predictionRequired) return

    const nextClosed = !switchStates[switchId]
    const controlledPrimary = switchId === primarySwitchId && isPrimaryControlled

    if (!controlledPrimary) {
      setUncontrolledSwitchStates(previous => ({
        ...previous,
        [switchId]: nextClosed,
      }))
    }

    if (prediction && selectedPredictionId) {
      setHasTestInteraction(true)
    }

    onToggle?.(nextClosed, switchId)
  }

  const renderComponent = (component) => {
    const active = matchesCircuitCondition(component.activeWhen, switchStates)
    const componentStroke = component.strokeTone ? resolveTone(component.strokeTone) : wire
    const activeStroke = component.activeTone ? resolveTone(component.activeTone) : interaction
    const componentFill = component.fillTone
      ? resolveTone(component.fillTone)
      : surface

    if (component.type === 'cell') {
      return (
        <CircuitCell
          key={component.id}
          x={component.x}
          y={component.y}
          orientation={component.orientation}
          plateFill={componentStroke}
          polarityFill={textSecondary}
          showPolarity={component.showPolarity}
          longLength={component.longLength}
          shortLength={component.shortLength}
        />
      )
    }

    if (component.type === 'battery') {
      return (
        <CircuitBattery
          key={component.id}
          x={component.x}
          y={component.y}
          orientation={component.orientation}
          cells={component.cells}
          cellSpacing={component.cellSpacing}
          plateFill={component.strokeTone ? componentStroke : textPrimary}
          polarityFill={textSecondary}
        />
      )
    }

    if (component.type === 'lamp') {
      return (
        <CircuitLamp
          key={component.id}
          cx={component.cx}
          cy={component.cy}
          radius={component.radius}
          lit={active}
          wireStroke={componentStroke}
          lightStroke={component.activeTone ? activeStroke : bulbLight}
          offFill={componentFill}
          litFill={visualRoles.lampFill}
          haloFill={visualRoles.lampHalo}
        />
      )
    }

    if (component.type === 'resistor') {
      return (
        <CircuitResistor
          key={component.id}
          cx={component.cx}
          cy={component.cy}
          orientation={component.orientation}
          width={component.width}
          height={component.height}
          stroke={componentStroke}
          activeStroke={activeStroke}
          fill={component.fillTone ? componentFill : 'none'}
          active={active}
        />
      )
    }

    if (component.type === 'ammeter' || component.type === 'voltmeter') {
      const Meter = component.type === 'ammeter' ? CircuitAmmeter : CircuitVoltmeter
      return (
        <Meter
          key={component.id}
          cx={component.cx}
          cy={component.cy}
          radius={component.radius}
          stroke={componentStroke}
          activeStroke={activeStroke}
          textFill={textPrimary}
          activeTextFill={activeStroke}
          fill={componentFill}
          active={active}
        />
      )
    }

    if (component.type === 'junction') {
      return (
        <CircuitJunction
          key={component.id}
          cx={component.cx}
          cy={component.cy}
          radius={component.radius}
          fill={componentStroke}
          activeFill={activeStroke}
          active={active}
        />
      )
    }

    if (component.type === 'switch') {
      return (
        <CircuitSwitch
          key={component.id}
          left={component.left}
          right={component.right}
          y={component.y}
          closed={switchStates[component.id] === true}
          disabled={disabled || component.disabled || predictionRequired}
          accent={component.activeTone ? activeStroke : interaction}
          wireStroke={componentStroke}
          inactiveStroke={textSecondary}
          label={component.accessibilityLabel ?? 'Circuit switch'}
          describedBy={statusId}
          openAngle={component.openAngle}
          hitPaddingX={component.hitPaddingX}
          hitPaddingY={component.hitPaddingY}
          minHitWidth={component.minHitWidth}
          minHitHeight={component.minHitHeight}
          onToggle={() => toggleSwitch(component.id)}
        />
      )
    }

    return null
  }

  const switchInstruction = switchComponents.length === 0
    ? ''
    : predictionRequired
      ? 'Make a prediction before using the switch.'
      : prediction && !predictionResult
        ? prediction.testInstruction
        : predictionResult
          ? 'The circuit has been tested. You can keep using the switch to explore.'
          : switchComponents.length === 1
            ? 'Use the switch control to change the circuit.'
            : 'Use the switch controls to explore the circuit.'
  const accessibleDescription = [presentationState.explanation, switchInstruction]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`circuit-diagram${reducedMotion ? ' circuit-diagram--reduced-motion' : ''}`}
      data-circuit-mode={prediction ? 'predictThenTest' : 'explore'}
      data-reduced-motion={reducedMotion || undefined}
      style={{
        width: '100%',
        maxWidth: circuit.maxWidth ?? 460,
        minWidth: 0,
        margin: '0 auto',
      }}
    >
      <svg
        viewBox={canvas.viewBox}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-circuit-canvas={`${canvas.width}x${canvas.height}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${canvas.width} / ${canvas.height}`,
          overflow: 'visible',
        }}
      >
        <title id={titleId}>{label ?? circuit.accessibilityLabel}</title>
        <desc id={descriptionId}>{accessibleDescription}</desc>

        {(circuit.paths ?? []).map(path => (
          <CircuitPath
            key={path.id}
            d={path.d}
            stroke={path.tone ? resolveTone(path.tone) : wire}
            strokeWidth={path.strokeWidth}
          />
        ))}

        {(circuit.currentPaths ?? []).map(path => (
          <CircuitPath
            key={path.id}
            current
            active={matchesCircuitCondition(path.activeWhen, switchStates)}
            pulse={path.pulse !== false}
            activeOpacity={path.activeOpacity}
            d={path.d}
            stroke={path.tone ? resolveTone(path.tone) : conducting}
            strokeWidth={path.strokeWidth}
          />
        ))}

        {components.map(renderComponent)}

        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          {(circuit.labels ?? []).map(labelConfig => {
            const lockedByPrediction = predictionRequired && labelConfig.forSwitchId
            const labelText = lockedByPrediction
              ? labelConfig.lockedText ?? 'Predict first'
              : resolveCircuitLabelText(labelConfig, presentationState.id)

            return (
              <CircuitLabel
                key={labelConfig.id}
                x={labelConfig.x}
                y={labelConfig.y}
                textAnchor={labelConfig.textAnchor}
                fill={resolveTone(labelConfig.tone)}
                fontSize={labelConfig.fontSize}
                fontWeight={labelConfig.fontWeight}
              >
                {labelText}
              </CircuitLabel>
            )
          })}
        </g>
      </svg>

      {prediction && (
        <CircuitPredictionPanel
          prediction={prediction}
          selectedOptionId={selectedPredictionId}
          onSelect={selectPrediction}
          result={predictionResult}
          visualRoles={visualRoles}
        />
      )}

      <div
        id={statusId}
        aria-live="polite"
        aria-atomic="true"
        style={{
          minHeight: 66,
          padding: '8px 18px 0',
          textAlign: 'center',
          fontFamily: 'Sora, sans-serif',
        }}
      >
        <div
          style={{
            color: resolveTone(presentationState.headingTone),
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {presentationState.heading}
        </div>
        <div
          style={{
            color: textSecondary,
            fontSize: 13,
            lineHeight: 1.55,
            marginTop: 4,
          }}
        >
          {presentationState.explanation}
        </div>
      </div>
    </div>
  )
}

export default CircuitDiagram
