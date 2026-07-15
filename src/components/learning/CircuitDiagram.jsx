import { useId, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
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
import {
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitCanvas,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from './circuit/circuitPresets.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The sequence is intentional: the learner moves the switch first, then a calm
// conducting path appears, then the bulb responds. A single travelling highlight
// marks the change without implying that visible particles race around the wire.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const physics = SUBJECTS.Physics
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
      filter: drop-shadow(0 0 1.5px ${physics.glow});
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
 */
function CircuitDiagram({
  preset = 'simpleSeries',
  closed,
  defaultClosed,
  onToggle,
  disabled = false,
  label,
}) {
  ensureStyles()

  const physics = SUBJECTS.Physics
  const circuit = resolveCircuitPreset(preset)
  const canvas = resolveCircuitCanvas(circuit)
  const titleId = useId()
  const descriptionId = useId()
  const components = circuit.components ?? []
  const switchComponents = components.filter(component => component.type === 'switch')
  const primarySwitchId = circuit.primarySwitchId ?? switchComponents[0]?.id

  const [uncontrolledSwitchStates, setUncontrolledSwitchStates] = useState(() => {
    const initialStates = Object.fromEntries(
      switchComponents.map(component => [component.id, component.defaultClosed === true]),
    )

    if (primarySwitchId && typeof defaultClosed === 'boolean') {
      initialStates[primarySwitchId] = defaultClosed
    }

    return initialStates
  })

  const isPrimaryControlled = primarySwitchId && typeof closed === 'boolean'
  const switchStates = {
    ...uncontrolledSwitchStates,
    ...(isPrimaryControlled ? { [primarySwitchId]: closed } : {}),
  }

  const wire = physics.accentTertiary
  const textPrimary = physics.palette.lightAsh
  const textSecondary = physics.palette.warmGrey
  const bulbLight = physics.accentSecondary
  const presentationState = getCircuitPresentationState(circuit, switchStates)

  const tones = {
    primary: textPrimary,
    secondary: textSecondary,
    accent: physics.accent,
    light: bulbLight,
    wire,
    surface: physics.backgroundSecondary,
  }

  const resolveTone = tone => tones[tone] ?? tone ?? textSecondary

  const toggleSwitch = (switchId) => {
    if (disabled) return

    const nextClosed = !switchStates[switchId]
    const controlledPrimary = switchId === primarySwitchId && isPrimaryControlled

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
    const activeStroke = component.activeTone ? resolveTone(component.activeTone) : physics.accent
    const componentFill = component.fillTone
      ? resolveTone(component.fillTone)
      : physics.backgroundSecondary

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
          litFill="rgba(242,193,78,0.18)"
          haloFill="rgba(242,193,78,0.32)"
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
          disabled={disabled || component.disabled}
          accent={component.activeTone ? activeStroke : physics.accent}
          wireStroke={componentStroke}
          inactiveStroke={textSecondary}
          openAngle={component.openAngle}
          hitPaddingX={component.hitPaddingX}
          hitPaddingY={component.hitPaddingY}
          onToggle={() => toggleSwitch(component.id)}
        />
      )
    }

    return null
  }

  const switchInstruction = switchComponents.length === 0
    ? ''
    : switchComponents.length === 1
      ? 'Use the switch control to change the circuit.'
      : 'Use the switch controls to explore the circuit.'
  const accessibleDescription = [presentationState.explanation, switchInstruction]
    .filter(Boolean)
    .join(' ')

  return (
    <div
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
            stroke={path.tone ? resolveTone(path.tone) : physics.accent}
            strokeWidth={path.strokeWidth}
          />
        ))}

        {components.map(renderComponent)}

        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          {(circuit.labels ?? []).map(labelConfig => (
            <CircuitLabel
              key={labelConfig.id}
              x={labelConfig.x}
              y={labelConfig.y}
              textAnchor={labelConfig.textAnchor}
              fill={resolveTone(labelConfig.tone)}
              fontSize={labelConfig.fontSize}
              fontWeight={labelConfig.fontWeight}
            >
              {resolveCircuitLabelText(labelConfig, presentationState.id)}
            </CircuitLabel>
          ))}
        </g>
      </svg>

      <div
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
