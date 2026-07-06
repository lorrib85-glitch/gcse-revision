import { SUBJECTS } from '../../constants/subjects.js'

// ─── Humoral compass ─────────────────────────────────────────────────────────
// Galen's Theory of Opposites is spatial: the body's qualities sit on two
// axes — HOT↔COLD (vertical) and WET↔DRY (horizontal) — and each humour lives
// where two qualities meet. Treatment moves the patient to the OPPOSITE
// quadrant. This diagram makes that logic visible instead of listing it as
// prose. Bespoke inline SVG in the CircuitDiagram tradition (one GCSE concept,
// subject-themed, reduced-motion aware).
//
// Props:
//   subject   — palette key (default 'History')
//   highlight — which humour's treatment arrow to draw: 'blood' | 'yellowBile'
//               | 'phlegm' | 'blackBile' (default 'blood')

// Each humour is a luminous orb (light → base → deep) placed in its quadrant.
const HUMOURS = {
  blood:      { name: 'Blood',       qualities: 'hot + wet',  light: '#E8604A', base: '#C0392B', deep: '#6E1F14', cx: 116, cy: 116 },
  yellowBile: { name: 'Yellow bile', qualities: 'hot + dry',  light: '#F0C24A', base: '#D9A521', deep: '#7E5D0F', cx: 244, cy: 116 },
  phlegm:     { name: 'Phlegm',      qualities: 'cold + wet', light: '#AECDE6', base: '#7FA8C9', deep: '#41627A', cx: 116, cy: 244 },
  blackBile:  { name: 'Black bile',  qualities: 'cold + dry', light: '#8C97A5', base: '#5B6470', deep: '#292E35', cx: 244, cy: 244 },
}

// diagonal opposites — treatment crosses the centre to the far corner
const OPPOSITE = { blood: 'blackBile', blackBile: 'blood', yellowBile: 'phlegm', phlegm: 'yellowBile' }

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes hc-draw { to { stroke-dashoffset: 0; } }
    @keyframes hc-breathe { 0%,100% { opacity: 0.4; } 50% { opacity: 0.75; } }
    .hc-arrow { stroke-dasharray: 220; stroke-dashoffset: 220; animation: hc-draw 1000ms cubic-bezier(0.22,1,0.36,1) 500ms forwards; }
    .hc-arrow-glow { stroke-dasharray: 220; stroke-dashoffset: 220; animation: hc-draw 1000ms cubic-bezier(0.22,1,0.36,1) 500ms forwards; }
    .hc-breathe { animation: hc-breathe 4s ease-in-out 1400ms infinite; }
    @media (prefers-reduced-motion: reduce) {
      .hc-arrow, .hc-arrow-glow { animation: none; stroke-dashoffset: 0; }
      .hc-breathe { animation: none; opacity: 0.6; }
    }
  `
  document.head.appendChild(el)
}

export default function HumoralCompass({ subject = 'History', highlight = 'blood' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const from = HUMOURS[highlight] || HUMOURS.blood
  const to = HUMOURS[OPPOSITE[highlight] || 'blackBile']

  // Orbs sit 14px above their labels; run the arrow orb-edge to orb-edge so it
  // crosses the empty centre instead of clipping the humour names.
  const fx = from.cx, fy = from.cy - 14
  const tx = to.cx, ty = to.cy - 14
  const ux = tx - fx, uy = ty - fy
  const len = Math.hypot(ux, uy)
  const trim = 20
  const ax1 = fx + (ux / len) * trim, ay1 = fy + (uy / len) * trim
  const ax2 = tx - (ux / len) * trim, ay2 = ty - (uy / len) * trim

  const axis = 'rgba(240,230,200,0.12)'
  const axisLabel = 'rgba(240,230,200,0.5)'
  const ORB_R = 17

  return (
    <svg viewBox="0 0 360 360" width="100%" role="img"
      aria-label="Humoral compass: the four humours placed on hot–cold and wet–dry axes, with an arrow showing that a cure moves the patient to the opposite quadrant."
      style={{ display: 'block', maxWidth: 340, margin: '0 auto' }}>

      <defs>
        <clipPath id="hc-field"><rect x="40" y="40" width="280" height="280" rx="20" /></clipPath>
        <filter id="hc-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {Object.entries(HUMOURS).map(([key, h]) => (
          <radialGradient key={key} id={`hc-orb-${key}`} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor={h.light} />
            <stop offset="52%" stopColor={h.base} />
            <stop offset="100%" stopColor={h.deep} />
          </radialGradient>
        ))}
        <marker id="hc-head" markerWidth="8" markerHeight="8" refX="5.5" refY="3"
          orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
        </marker>
      </defs>

      {/* Field — quadrant tints glow each temperament's colour into its corner */}
      <g clipPath="url(#hc-field)">
        <rect x="40" y="40" width="280" height="280" fill="#0B0805" />
        {Object.values(HUMOURS).map((h, i) => (
          <circle key={i} cx={h.cx} cy={h.cy} r="96" fill={h.base} opacity="0.08" filter="url(#hc-soft)" />
        ))}
      </g>

      {/* Frame + axes */}
      <rect x="40" y="40" width="280" height="280" rx="20"
        fill="none" stroke="rgba(240,230,200,0.16)" strokeWidth="1" />
      <line x1="180" y1="44" x2="180" y2="316" stroke={axis} strokeWidth="1" />
      <line x1="44" y1="180" x2="316" y2="180" stroke={axis} strokeWidth="1" />

      {/* Compass-rose centre — earns the "compass" name where the axes meet */}
      <g opacity="0.6">
        <path d="M180,168 L184,180 L180,192 L176,180 Z" fill={accent} opacity="0.55" />
        <path d="M168,180 L180,176 L192,180 L180,184 Z" fill={accent} opacity="0.55" />
        <circle cx="180" cy="180" r="2" fill={accent} />
      </g>

      {/* Axis labels — the qualities themselves */}
      <text x="180" y="26" textAnchor="middle" fill={axisLabel}
        style={{ font: "700 13px Sora, sans-serif", letterSpacing: '0.24em' }}>HOT</text>
      <text x="180" y="346" textAnchor="middle" fill={axisLabel}
        style={{ font: "700 13px Sora, sans-serif", letterSpacing: '0.24em' }}>COLD</text>
      <text x="18" y="184" textAnchor="middle" fill={axisLabel}
        style={{ font: "700 13px Sora, sans-serif", letterSpacing: '0.16em' }} transform="rotate(-90 18 180)">WET</text>
      <text x="342" y="184" textAnchor="middle" fill={axisLabel}
        style={{ font: "700 13px Sora, sans-serif", letterSpacing: '0.16em' }} transform="rotate(90 342 180)">DRY</text>

      {/* Opposite arrow — the single bold move: soft under-glow + engraved line */}
      <line className="hc-arrow-glow" x1={ax1} y1={ay1} x2={ax2} y2={ay2}
        stroke={accent} strokeWidth="6" strokeLinecap="round" opacity="0.22" filter="url(#hc-soft)" />
      <line className="hc-arrow" x1={ax1} y1={ay1} x2={ax2} y2={ay2}
        stroke={accent} strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#hc-head)" />

      {/* Humour orbs */}
      {Object.entries(HUMOURS).map(([key, h]) => {
        const isFrom = key === highlight
        const isTo = key === (OPPOSITE[highlight] || 'blackBile')
        const cy = h.cy - 14
        return (
          <g key={key} opacity={isFrom || isTo ? 1 : 0.62}>
            {/* halo */}
            <circle cx={h.cx} cy={cy} r={ORB_R + 9} fill={h.base}
              opacity={isFrom ? 0.5 : 0.28} filter="url(#hc-soft)"
              className={isFrom ? 'hc-breathe' : undefined} />
            {/* orb */}
            <circle cx={h.cx} cy={cy} r={ORB_R} fill={`url(#hc-orb-${key})`}
              stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            {/* specular highlight */}
            <ellipse cx={h.cx - 5} cy={cy - 6} rx="5" ry="3.4" fill="rgba(255,255,255,0.4)" />
            {/* labels */}
            <text x={h.cx} y={h.cy + 20} textAnchor="middle" fill="#F0E6C8"
              style={{ font: "600 15px Sora, sans-serif" }}>{h.name}</text>
            <text x={h.cx} y={h.cy + 38} textAnchor="middle" fill="rgba(240,230,200,0.5)"
              style={{ font: "400 12px Sora, sans-serif" }}>{h.qualities}</text>
          </g>
        )
      })}

    </svg>
  )
}
