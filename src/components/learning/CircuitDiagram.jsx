import { useId, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  CircuitBattery,
  CircuitLabel,
  CircuitLamp,
  CircuitPath,
  CircuitSwitch,
} from './circuit/CircuitPrimitives.jsx'
import {
  getCircuitPresentationState,
  matchesCircuitCondition,
  resolveCircuitLabelText,
  resolveCircuitPreset,
} from './circuit/circuitPresets.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The sequence is intentional: the learner moves the switch first, then the
// conducting path appears, then the bulb responds. Reduced-motion users still
// get the same clear state change without the animation.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const physics = SUBJECTS.Physics
  const el = document.createElement('style')
  el.textContent = `
    @keyframes circuit-diagram-flow {
      to { stroke-dashoffset: -34; }
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

    .circuit-diagram__current {
      opacity: 0;
      stroke-dasharray: 9 8;
      pointer-events: none;
      transition: opacity 120ms ease;
    }

    .circuit-diagram__current--active {
      opacity: 1;
      animation: circuit-diagram-flow 1.15s linear infinite;
      filter: drop-shadow(0 0 2px ${physics.glow});
      transition-delay: 120ms;
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
      .circuit-diagram__current,
      .circuit-diagram__bulb-face,
      .circuit-diagram__bulb-filament,
      .circuit-diagram__bulb-halo {
        animation: none;
        transition: none;
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
  const titleId = useId()
  const descriptionId = useId()
  const switchComponents = circuit.components.filter(component => component.type === 'switch')
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
    if (component.type === 'battery') {
      return (
        <CircuitBattery
          key={component.id}
          x={component.x}
          y={component.y}
          plateFill={textPrimary}
          polarityFill={textSecondary}
        />
      )
    }

    if (component.type === 'lamp') {
      const lit = matchesCircuitCondition(component.activeWhen, switchStates)
      return (
        <CircuitLamp
          key={component.id}
          cx={component.cx}
          cy={component.cy}
          radius={component.radius}
          lit={lit}
          wireStroke={wire}
          lightStroke={bulbLight}
          offFill={physics.backgroundSecondary}
          litFill="rgba(242,193,78,0.16)"
          haloFill="rgba(242,193,78,0.34)"
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
          accent={physics.accent}
          wireStroke={wire}
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

  const switchInstruction = switchComponents.length === 1
    ? 'Use the switch control to change the circuit.'
    : 'Use the switch controls to explore the circuit.'

  return (
    <div style={{ width: '100%', maxWidth: circuit.maxWidth ?? 460, margin: '0 auto' }}>
      <svg
        viewBox={circuit.viewBox}
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <title id={titleId}>{label ?? circuit.accessibilityLabel}</title>
        <desc id={descriptionId}>
          {presentationState.explanation} {switchInstruction}
        </desc>

        {circuit.paths.map(path => (
          <CircuitPath
            key={path.id}
            d={path.d}
            stroke={wire}
            strokeWidth={path.strokeWidth}
          />
        ))}

        {circuit.currentPaths.map(path => (
          <CircuitPath
            key={path.id}
            current
            active={matchesCircuitCondition(path.activeWhen, switchStates)}
            d={path.d}
            stroke={physics.accent}
            strokeWidth={path.strokeWidth}
          />
        ))}

        {circuit.components.map(renderComponent)}

        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          {circuit.labels.map(labelConfig => (
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
