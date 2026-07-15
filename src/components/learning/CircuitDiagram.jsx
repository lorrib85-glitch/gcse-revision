import { useId, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  CircuitBattery,
  CircuitLabel,
  CircuitLamp,
  CircuitPath,
  CircuitSwitch,
} from './circuit/CircuitPrimitives.jsx'

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

// ─── Simple-series preset geometry (viewBox 0 0 360 194) ────────────────────
// CircuitDiagram owns this preset for now. The symbols themselves are reusable
// primitives; a later configuration layer can provide different geometries.
const LOOP = { left: 72, right: 288, top: 38, bottom: 134 }
const BULB = { cx: 288, cy: 86, radius: 18 }
const BATTERY = { x: 72, y: 67 }
const SWITCH = { left: 145, right: 215, y: 134 }

/**
 * A single responsive series circuit whose physical switch is the control.
 *
 * Use `defaultClosed` for the normal self-contained interaction. `closed` and
 * `onToggle` provide a controlled API for future lesson flows that need to own
 * circuit state.
 */
function CircuitDiagram({
  closed,
  defaultClosed = false,
  onToggle,
  disabled = false,
  label = 'Interactive series circuit',
}) {
  ensureStyles()

  const physics = SUBJECTS.Physics
  const titleId = useId()
  const descriptionId = useId()
  const [uncontrolledClosed, setUncontrolledClosed] = useState(defaultClosed)

  const isControlled = typeof closed === 'boolean'
  const isClosed = isControlled ? closed : uncontrolledClosed

  const wire = physics.accentTertiary
  const textPrimary = physics.palette.lightAsh
  const textSecondary = physics.palette.warmGrey
  const bulbLight = physics.accentSecondary

  const wires = [
    `M${LOOP.left},${LOOP.top} H${LOOP.right}`,
    `M${LOOP.right},${LOOP.top} V68`,
    `M${LOOP.right},104 V${LOOP.bottom}`,
    `M${LOOP.right},${LOOP.bottom} H${SWITCH.right}`,
    `M${SWITCH.left},${LOOP.bottom} H${LOOP.left}`,
    `M${LOOP.left},${LOOP.bottom} V108`,
    `M${LOOP.left},66 V${LOOP.top}`,
  ]

  const currentPath =
    `M${LOOP.left},${LOOP.top} H${LOOP.right} V${LOOP.bottom} H${LOOP.left} Z`

  const stateHeading = isClosed
    ? 'The switch is closed.'
    : 'The switch is open.'

  const stateExplanation = isClosed
    ? 'The circuit is complete, so current flows and the bulb lights.'
    : 'There is a gap, so current cannot flow.'

  const toggleSwitch = () => {
    if (disabled) return

    const nextClosed = !isClosed
    if (!isControlled) setUncontrolledClosed(nextClosed)
    onToggle?.(nextClosed)
  }

  return (
    <div style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <svg
        viewBox="0 0 360 194"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <title id={titleId}>{label}</title>
        <desc id={descriptionId}>
          {stateExplanation} Use the switch control to change the circuit.
        </desc>

        {/* Base wire segments leave gaps for the scientific symbols. */}
        {wires.map((d) => (
          <CircuitPath key={d} d={d} stroke={wire} />
        ))}

        {/* Conducting path appears only after the switch has physically closed. */}
        <CircuitPath
          current
          active={isClosed}
          d={currentPath}
          stroke={physics.accent}
        />

        <CircuitBattery
          x={BATTERY.x}
          y={BATTERY.y}
          plateFill={textPrimary}
          polarityFill={textSecondary}
        />

        <CircuitLamp
          cx={BULB.cx}
          cy={BULB.cy}
          radius={BULB.radius}
          lit={isClosed}
          wireStroke={wire}
          lightStroke={bulbLight}
          offFill={physics.backgroundSecondary}
          litFill="rgba(242,193,78,0.16)"
          haloFill="rgba(242,193,78,0.34)"
        />

        {/* The scientific object is the control: no separate UI button. */}
        <CircuitSwitch
          left={SWITCH.left}
          right={SWITCH.right}
          y={SWITCH.y}
          closed={isClosed}
          disabled={disabled}
          accent={physics.accent}
          wireStroke={wire}
          inactiveStroke={textSecondary}
          onToggle={toggleSwitch}
        />

        {/* Minimal diagram labels */}
        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          <CircuitLabel x={22} y={90} fill={textSecondary}>Battery</CircuitLabel>
          <CircuitLabel x={313} y={90} fill={textSecondary}>Bulb</CircuitLabel>
          <CircuitLabel x={180} y={164} textAnchor="middle" fill={textSecondary}>
            Switch
          </CircuitLabel>
          <CircuitLabel
            x={180}
            y={184}
            textAnchor="middle"
            fill={physics.accent}
            fontWeight={600}
          >
            {isClosed ? 'Tap to open' : 'Tap to close'}
          </CircuitLabel>
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
            color: isClosed ? bulbLight : textPrimary,
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {stateHeading}
        </div>
        <div
          style={{
            color: textSecondary,
            fontSize: 13,
            lineHeight: 1.55,
            marginTop: 4,
          }}
        >
          {stateExplanation}
        </div>
      </div>
    </div>
  )
}

export default CircuitDiagram
