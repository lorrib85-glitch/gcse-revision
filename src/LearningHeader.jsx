import ModuleToolbar from './ModuleToolbar.jsx'
import LearningProgressHeader from './LearningProgressHeader.jsx'

const PALETTES = {
  history:   { accent: '#C89B6D' },
  biology:   { accent: '#8FD6A3' },
  chemistry: { accent: '#8B5CF6' },
  physics:   { accent: '#5DA9E9' },
  maths:     { accent: '#2BBE9A' },
  english:   { accent: '#9E3D52' },
  sociology: { accent: '#C9B07C' },
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

// ── LearningHeader — RISE Module Header System orchestrator ───────────────────
// Owns the floating capsule shell + subject palette, and composes the two
// separated locked components:
//   • ModuleToolbar v1        — back + exit (navigation only)
//   • LearningProgressHeader v2 — progress rail + jump sheet (progression only)
// Public props/wiring are unchanged so every ModulePlayer call site keeps
// working as-is. This is architectural separation, not a visual redesign.
export default function LearningHeader({
  module,
  beats = [],
  currentBeatIndex = 0,
  onBack,
  onExit,
  onJump,
  visible = true,
}) {
  const subject = (module?.subject || '').toLowerCase()
  const { accent } = PALETTES[subject] || PALETTES.history
  const accentRgb = hexToRgb(accent)

  return (
    <div style={{
      position: 'fixed',
      top: 'calc(10px + env(safe-area-inset-top, 0px))',
      left: 16, right: 16,
      background: 'rgba(7,10,18,0.70)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 22,
      padding: '4px 4px 8px',
      zIndex: 1001,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      transition: visible
        ? 'opacity 700ms ease-out, transform 700ms ease-out'
        : 'none',
      pointerEvents: visible ? 'auto' : 'none',
    }}>

      {/* Row 1 — navigation */}
      <ModuleToolbar onBack={onBack} onExit={onExit} />

      {/* Row 2 — progression */}
      <LearningProgressHeader
        beats={beats}
        currentBeatIndex={currentBeatIndex}
        accent={accent}
        accentRgb={accentRgb}
        onJump={onJump}
      />
    </div>
  )
}
