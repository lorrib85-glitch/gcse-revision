import { SUBJECTS } from '../../constants/subjects.js'

// ─── Animation / glow styles (CSS classes, injected once) ────────────────────
// Static colours are set inline from the `closed` prop; only the moving-current
// animation and the restrained glows live here as classes, and the moving
// animation is disabled under prefers-reduced-motion.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes circuit-flow {
      to { stroke-dashoffset: -32; }
    }
    .circuit-current {
      stroke-dasharray: 9 7;
      animation: circuit-flow 0.9s linear infinite;
      filter: drop-shadow(0 0 3px ${SUBJECTS.Physics.glow});
    }
    .circuit-bulb-halo {
      filter: blur(6px);
    }
    @media (prefers-reduced-motion: reduce) {
      .circuit-current { animation: none; }
    }
  `
  document.head.appendChild(el)
}

// ─── Geometry (viewBox 0 0 360 220) ─────────────────────────────────────────
const LOOP = { left: 70, right: 290, top: 50, bottom: 150 }
const BULB = { cx: 290, cy: 100, r: 18 }
const SWITCH = { left: 150, right: 210, y: 150, openTipX: 206, openTipY: 124 }

const WIRE = '#4A5A6A'

function CircuitDiagram({ closed = false }) {
  ensureStyles()

  const physics = SUBJECTS.Physics
  const amber = '#FFB454'
  const bulbStroke = closed ? amber : '#3A4756'
  const bulbFill = closed ? 'rgba(255,180,84,0.16)' : '#10171F'
  const filament = closed ? amber : '#46535F'

  // Wire segments — gaps left where the battery, bulb and switch sit.
  const wires = [
    `M${LOOP.left},${LOOP.top} H${LOOP.right}`,            // top
    `M${LOOP.right},${LOOP.top} V82`,                       // right, above bulb
    `M${LOOP.right},118 V${LOOP.bottom}`,                  // right, below bulb
    `M${LOOP.right},${LOOP.bottom} H${SWITCH.right}`,      // bottom, right of switch
    `M${SWITCH.left},${LOOP.bottom} H${LOOP.left}`,        // bottom, left of switch
    `M${LOOP.left},${LOOP.bottom} V112`,                   // left, below battery
    `M${LOOP.left},82 V${LOOP.top}`,                       // left, above battery
  ]

  // Closed-loop perimeter used for the animated current overlay.
  const currentPath =
    `M${LOOP.left},${LOOP.top} H${LOOP.right} V${LOOP.bottom} H${LOOP.left} Z`

  const status = closed
    ? 'Circuit complete — current flows'
    : 'Circuit broken — no current'

  return (
    <svg
      viewBox="0 0 360 220"
      width="100%"
      role="img"
      aria-label={status}
      style={{ display: 'block', maxWidth: 420, margin: '0 auto' }}
    >
      {/* Base wires */}
      {wires.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={WIRE}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      {/* Animated current — only when the circuit is closed */}
      {closed && (
        <path
          className="circuit-current"
          d={currentPath}
          fill="none"
          stroke={physics.accentSecondary}
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}

      {/* Battery (left) — two cells drawn as plates */}
      <g>
        <rect x={54} y={82} width={32} height={3} rx={1.5} fill="#C7D2DD" />
        <rect x={60} y={90} width={20} height={7} rx={2} fill="#C7D2DD" />
        <rect x={54} y={104} width={32} height={3} rx={1.5} fill="#C7D2DD" />
        <rect x={60} y={112} width={20} height={7} rx={2} fill="#C7D2DD" />
        <text x={50} y={78} textAnchor="end" fill="#8A98A6" fontSize={12}>+</text>
      </g>

      {/* Bulb (right) */}
      <g>
        {closed && (
          <circle
            className="circuit-bulb-halo"
            cx={BULB.cx}
            cy={BULB.cy}
            r={BULB.r + 8}
            fill="rgba(255,180,84,0.45)"
          />
        )}
        <circle
          cx={BULB.cx}
          cy={BULB.cy}
          r={BULB.r}
          fill={bulbFill}
          stroke={bulbStroke}
          strokeWidth={3}
        />
        <line
          x1={BULB.cx - 12} y1={BULB.cy - 12}
          x2={BULB.cx + 12} y2={BULB.cy + 12}
          stroke={filament} strokeWidth={2.5} strokeLinecap="round"
        />
        <line
          x1={BULB.cx - 12} y1={BULB.cy + 12}
          x2={BULB.cx + 12} y2={BULB.cy - 12}
          stroke={filament} strokeWidth={2.5} strokeLinecap="round"
        />
      </g>

      {/* Switch (bottom) */}
      <g>
        <circle cx={SWITCH.left} cy={SWITCH.y} r={3.5} fill={WIRE} />
        <circle cx={SWITCH.right} cy={SWITCH.y} r={3.5} fill={WIRE} />
        <line
          x1={SWITCH.left}
          y1={SWITCH.y}
          x2={closed ? SWITCH.right : SWITCH.openTipX}
          y2={closed ? SWITCH.y : SWITCH.openTipY}
          stroke={closed ? physics.accent : '#8A98A6'}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>

      {/* Minimal labels */}
      <text x={20} y={104} fill="#8A98A6" fontSize={11}>Battery</text>
      <text x={300} y={104} fill="#8A98A6" fontSize={11}>Bulb</text>
      <text x={180} y={172} textAnchor="middle" fill="#8A98A6" fontSize={11}>Switch</text>

      {/* Status caption */}
      <text
        x={180}
        y={202}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={closed ? physics.accentSecondary : '#8A98A6'}
      >
        {status}
      </text>
    </svg>
  )
}

export default CircuitDiagram
