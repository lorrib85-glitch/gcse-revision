import { useId, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

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

// ─── Geometry (viewBox 0 0 360 194) ─────────────────────────────────────────
const LOOP = { left: 72, right: 288, top: 38, bottom: 134 }
const BULB = { cx: 288, cy: 86, r: 18 }
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

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    toggleSwitch()
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

        {/* Base wires */}
        {wires.map((d, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke={wire}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}

        {/* Conducting path appears only after the switch has physically closed. */}
        <path
          className={`circuit-diagram__current${isClosed ? ' circuit-diagram__current--active' : ''}`}
          d={currentPath}
          fill="none"
          stroke={physics.accent}
          strokeWidth={3}
          strokeLinecap="round"
          aria-hidden="true"
        />

        {/* Battery */}
        <g aria-hidden="true">
          <rect x={56} y={67} width={32} height={3} rx={1.5} fill={textPrimary} />
          <rect x={62} y={76} width={20} height={7} rx={2} fill={textPrimary} />
          <rect x={56} y={91} width={32} height={3} rx={1.5} fill={textPrimary} />
          <rect x={62} y={100} width={20} height={7} rx={2} fill={textPrimary} />
          <text x={51} y={65} textAnchor="end" fill={textSecondary} fontSize={12}>+</text>
        </g>

        {/* Bulb */}
        <g aria-hidden="true">
          <circle
            className={`circuit-diagram__bulb-halo${isClosed ? ' circuit-diagram__bulb-halo--lit' : ''}`}
            cx={BULB.cx}
            cy={BULB.cy}
            r={BULB.r + 9}
            fill="rgba(242,193,78,0.34)"
          />
          <circle
            className={`circuit-diagram__bulb-face${isClosed ? ' circuit-diagram__bulb-face--lit' : ''}`}
            cx={BULB.cx}
            cy={BULB.cy}
            r={BULB.r}
            fill={isClosed ? 'rgba(242,193,78,0.16)' : physics.backgroundSecondary}
            stroke={isClosed ? bulbLight : wire}
            strokeWidth={3}
          />
          <line
            className={`circuit-diagram__bulb-filament${isClosed ? ' circuit-diagram__bulb-filament--lit' : ''}`}
            x1={BULB.cx - 12}
            y1={BULB.cy - 12}
            x2={BULB.cx + 12}
            y2={BULB.cy + 12}
            stroke={isClosed ? bulbLight : wire}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <line
            className={`circuit-diagram__bulb-filament${isClosed ? ' circuit-diagram__bulb-filament--lit' : ''}`}
            x1={BULB.cx - 12}
            y1={BULB.cy + 12}
            x2={BULB.cx + 12}
            y2={BULB.cy - 12}
            stroke={isClosed ? bulbLight : wire}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>

        {/* The scientific object is the control: no separate UI button. */}
        <g
          className="circuit-diagram__switch-control"
          role="switch"
          aria-checked={isClosed}
          aria-label={isClosed ? 'Open the circuit switch' : 'Close the circuit switch'}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={toggleSwitch}
          onKeyDown={handleKeyDown}
        >
          <rect
            x={126}
            y={108}
            width={108}
            height={58}
            rx={14}
            fill="transparent"
          />
          <rect
            className="circuit-diagram__switch-focus"
            x={130}
            y={112}
            width={100}
            height={48}
            rx={12}
            fill="none"
            stroke={physics.accent}
            strokeWidth={1.5}
          />
          <circle
            cx={SWITCH.left}
            cy={SWITCH.y}
            r={4}
            fill={isClosed ? physics.accent : wire}
          />
          <circle
            cx={SWITCH.right}
            cy={SWITCH.y}
            r={4}
            fill={isClosed ? physics.accent : wire}
          />
          <g
            className="circuit-diagram__switch-arm"
            style={{
              transform: `rotate(${isClosed ? 0 : -24}deg)`,
              transformOrigin: `${SWITCH.left}px ${SWITCH.y}px`,
            }}
          >
            <line
              x1={SWITCH.left}
              y1={SWITCH.y}
              x2={SWITCH.right}
              y2={SWITCH.y}
              stroke={isClosed ? physics.accent : textSecondary}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Minimal diagram labels */}
        <g aria-hidden="true" fontFamily="Sora, sans-serif">
          <text x={22} y={90} fill={textSecondary} fontSize={11}>Battery</text>
          <text x={313} y={90} fill={textSecondary} fontSize={11}>Bulb</text>
          <text x={180} y={164} textAnchor="middle" fill={textSecondary} fontSize={11}>Switch</text>
          <text
            x={180}
            y={184}
            textAnchor="middle"
            fill={physics.accent}
            fontSize={11}
            fontWeight={600}
          >
            {isClosed ? 'Tap to open' : 'Tap to close'}
          </text>
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
