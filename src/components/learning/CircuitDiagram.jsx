import { useEffect, useId, useState } from 'react'
import {
  CircuitAmmeter,
  CircuitBattery,
  CircuitCell,
  CircuitDiode,
  CircuitFuse,
  CircuitJunction,
  CircuitLabel,
  CircuitLamp,
  CircuitLdr,
  CircuitLed,
  CircuitPath,
  CircuitResistor,
  CircuitSwitch,
  CircuitThermistor,
  CircuitVariableResistor,
  CircuitVoltmeter,
} from './circuit/CircuitPrimitives.jsx'
import {
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from './circuit/circuitPresets.js'
import { PHYSICS_CIRCUIT_VISUAL_ROLES } from './circuit/circuitVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The sequence is intentional: the learner moves the switch first, then a calm
// conducting path appears, then the lamp responds. A single travelling highlight
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

    @keyframes circuit-diagram-switch-hint {
      0%, 100% {
        opacity: 0.88;
        filter: drop-shadow(0 0 0 transparent);
      }
      50% {
        opacity: 1;
        filter: drop-shadow(0 0 3px ${PHYSICS_CIRCUIT_VISUAL_ROLES.focusGlow});
      }
    }

    .circuit-diagram__switch-control {
      cursor: pointer;
      outline: none;
    }

    .circuit-diagram__switch-control[data-disabled="true"] {
      cursor: default;
    }

    .circuit-diagram__switch-hint .circuit-diagram__switch-control {
      animation: circuit-diagram-switch-hint 2400ms ease-in-out infinite;
    }

    .circuit-diagram__switch-control:focus-visible {
      animation: none;
      filter: drop-shadow(0 0 3px ${PHYSICS_CIRCUIT_VISUAL_ROLES.focusGlow});
    }

    .circuit-diagram__switch-arm {
      transform-box: view-box;
      transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .circuit-diagram__switch-focus {
      opacity: 0;
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

    .circuit-diagram[data-circuit-preset="simpleSeries"]
      [data-circuit-label-id="label-battery"] {
      transform: translateY(-30px);
    }

    .circuit-diagram--reduced-motion .circuit-diagram__switch-hint .circuit-diagram__switch-control,
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
      .circuit-diagram__switch-hint .circuit-diagram__switch-control,
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
    }
  `
  document.head.appendChild(el)
}

function createInitialSwitchStates(circuit, primarySwitchId, defaultClosed) {
  const switchComponents = (circuit.components ?? []).filter(
    component => component.type === 'switch',
  )
  const initialStates = Object.fromEntries(
    switchComponents.map(component => [component.id, component.defaultClosed === true]),
  )

  if (primarySwitchId && typeof defaultClosed === 'boolean') {
    initialStates[primarySwitchId] = defaultClosed
  }

  return initialStates
}

/**
 * Configuration-driven GCSE circuit diagram.
 *
 * The component owns diagram state and physical switch interaction only. Questions,
 * predictions, exam tasks and feedback belong to the page that composes the diagram.
 *
 * `preset` may be a registered preset name or a compatible preset object.
 * `interactive={false}` turns any preset into a read-only teaching or exam diagram.
 * `closed` and `defaultClosed` remain simple-series convenience props.
 */
function CircuitDiagram({
  preset = 'simpleSeries',
  closed,
  defaultClosed,
  onToggle,
  disabled = false,
  interactive,
  reducedMotion = false,
  label,
  showStatus = true,
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
  const circuitAllowsInteraction = interactive ?? circuit.interactive ?? true
  const canInteract = circuitAllowsInteraction && !disabled

  const [uncontrolledSwitchStates, setUncontrolledSwitchStates] = useState(() => (
    createInitialSwitchStates(circuit, primarySwitchId, defaultClosed)
  ))
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    setUncontrolledSwitchStates(
      createInitialSwitchStates(circuit, primarySwitchId, defaultClosed),
    )
    setHasInteracted(false)
  }, [circuit, defaultClosed, primarySwitchId])

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

  const toggleSwitch = (switchId) => {
    if (!canInteract) return

    const nextClosed = !switchStates[switchId]
    const controlledPrimary = switchId === primarySwitchId && isPrimaryControlled

    setHasInteracted(true)

    if (!controlledPrimary) {
      setUncontrolledSwitchStates(previous => ({
        ...previous,
        [switchId]: nextClosed,
      }))
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
    let element = null

    if (component.type === 'cell') {
      element = (
        <CircuitCell
          x={component.x}
          y={component.y}
          orientation={component.orientation}
          plateFill={componentStroke}
          polarityFill={textSecondary}
          showPolarity={component.showPolarity}
          longLength={component.longLength}
          shortLength={component.shortLength}
          plateGap={component.plateGap}
        />
      )
    }

    if (component.type === 'battery') {
      element = (
        <CircuitBattery
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
      element = (
        <CircuitLamp
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
      element = (
        <CircuitResistor
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

    if (component.type === 'fuse') {
      element = (
        <CircuitFuse
          cx={component.cx}
          cy={component.cy}
          width={component.width}
          height={component.height}
          stroke={componentStroke}
          activeStroke={activeStroke}
          fill={component.fillTone ? componentFill : 'none'}
          active={active}
        />
      )
    }

    if (component.type === 'variableResistor') {
      element = (
        <CircuitVariableResistor
          cx={component.cx}
          cy={component.cy}
          width={component.width}
          height={component.height}
          stroke={componentStroke}
          activeStroke={activeStroke}
          fill={component.fillTone ? componentFill : 'none'}
          active={active}
        />
      )
    }

    if (component.type === 'thermistor') {
      element = (
        <CircuitThermistor
          cx={component.cx}
          cy={component.cy}
          width={component.width}
          height={component.height}
          stroke={componentStroke}
          activeStroke={activeStroke}
          fill={component.fillTone ? componentFill : 'none'}
          active={active}
        />
      )
    }

    if (component.type === 'diode' || component.type === 'led' || component.type === 'ldr') {
      const Symbol = component.type === 'diode'
        ? CircuitDiode
        : component.type === 'led'
          ? CircuitLed
          : CircuitLdr
      element = (
        <Symbol
          cx={component.cx}
          cy={component.cy}
          radius={component.radius}
          stroke={componentStroke}
          activeStroke={activeStroke}
          fill={component.fillTone ? componentFill : 'none'}
          active={active}
        />
      )
    }

    if (component.type === 'ammeter' || component.type === 'voltmeter') {
      const Meter = component.type === 'ammeter' ? CircuitAmmeter : CircuitVoltmeter
      element = (
        <Meter
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
      element = (
        <CircuitJunction
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
      const interactiveSwitchTone = canInteract && !component.disabled
        ? activeStroke
        : componentStroke

      element = (
        <CircuitSwitch
          left={component.left}
          right={component.right}
          y={component.y}
          closed={switchStates[component.id] === true}
          disabled={!canInteract || component.disabled}
          accent={interactiveSwitchTone}
          wireStroke={interactiveSwitchTone}
          inactiveStroke={interactiveSwitchTone}
          terminalFill={surface}
          label={component.accessibilityLabel ?? 'Circuit switch'}
          describedBy={showStatus ? statusId : descriptionId}
          openAngle={component.openAngle}
          hitPaddingX={component.hitPaddingX}
          hitPaddingY={component.hitPaddingY}
          minHitWidth={component.minHitWidth}
          minHitHeight={component.minHitHeight}
          onToggle={() => toggleSwitch(component.id)}
        />
      )
    }

    if (!element) return null

    const showInteractionHint = component.type === 'switch'
      && canInteract
      && !component.disabled
      && !hasInteracted

    return (
      <g
        key={component.id}
        className={showInteractionHint ? 'circuit-diagram__switch-hint' : undefined}
        data-circuit-id={component.id}
        data-circuit-interaction-hint={showInteractionHint || undefined}
      >
        {element}
      </g>
    )
  }

  const switchInstruction = switchComponents.length === 0
    ? ''
    : canInteract
      ? switchComponents.length === 1
        ? 'Use the switch control to change the circuit.'
        : 'Use the switch controls to explore the circuit.'
      : 'This circuit is shown as a read-only diagram.'
  const accessibleDescription = [presentationState.explanation, switchInstruction]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`circuit-diagram${reducedMotion ? ' circuit-diagram--reduced-motion' : ''}`}
      data-circuit-preset={circuit.id}
      data-circuit-interactive={canInteract ? 'true' : 'false'}
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
          <g key={path.id} data-circuit-id={path.id}>
            <CircuitPath
              d={path.d}
              stroke={path.tone ? resolveTone(path.tone) : wire}
              strokeWidth={path.strokeWidth}
            />
          </g>
        ))}

        {(circuit.currentPaths ?? []).map(path => (
          <g key={path.id} data-circuit-id={path.id}>
            <CircuitPath
              current
              active={matchesCircuitCondition(path.activeWhen, switchStates)}
              pulse={path.pulse !== false}
              activeOpacity={path.activeOpacity}
              d={path.d}
              stroke={path.tone ? resolveTone(path.tone) : conducting}
              strokeWidth={path.strokeWidth}
            />
          </g>
        ))}

        {components.map(renderComponent)}

        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          {(circuit.labels ?? []).map(labelConfig => {
            const switchClosed = labelConfig.forSwitchId
              ? switchStates[labelConfig.forSwitchId] === true
              : false
            const labelText = !canInteract && labelConfig.forSwitchId
              ? switchClosed
                ? labelConfig.readOnlyClosedText ?? 'Closed'
                : labelConfig.readOnlyOpenText ?? 'Open'
              : resolveCircuitLabelText(labelConfig, presentationState.id)

            return (
              <g key={labelConfig.id} data-circuit-label-id={labelConfig.id}>
                <CircuitLabel
                  x={labelConfig.x}
                  y={labelConfig.y}
                  textAnchor={labelConfig.textAnchor}
                  fill={resolveTone(labelConfig.tone)}
                  fontSize={labelConfig.fontSize}
                  fontWeight={labelConfig.fontWeight}
                >
                  {labelText}
                </CircuitLabel>
              </g>
            )
          })}
        </g>
      </svg>

      {showStatus && (
        <div
          id={statusId}
          aria-live={canInteract ? 'polite' : undefined}
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
      )}
    </div>
  )
}

export default CircuitDiagram
