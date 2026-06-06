import { useState } from 'react'
import LearningProgressHeader from './LearningProgressHeader.jsx'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'

// ── LearningHeader — single-row module header ─────────────────────────────────
// Single row: [back] [stage rail] [n/total] [exit]
// Stage rail shows 6 fixed stages; tap rail for stage tooltip.
// Tap n/total counter to open jump sheet (onJumpOpen callback).
// Props: module, currentStage (string), onBack, onExit, visible, onJumpOpen, screenPos
export default function LearningHeader({
  module,
  currentStage = 'Discover',
  onBack,
  onExit,
  visible = true,
  onJumpOpen = null,
  screenPos = null,
}) {
  const [backPressed, setBackPressed] = useState(false)
  const [exitPressed, setExitPressed] = useState(false)

  const subject = module?.subject || 'History'
  const accent = SUBJECT_ACCENTS[subject] || SUBJECT_ACCENTS.History
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
      zIndex: 1001,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      transition: visible
        ? 'opacity 700ms ease-out, transform 700ms ease-out'
        : 'none',
      pointerEvents: visible ? 'auto' : 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
    }}>

      {/* Back button */}
      <button
        aria-label="Go back"
        onPointerDown={() => setBackPressed(true)}
        onPointerUp={() => { setBackPressed(false); onBack?.() }}
        onPointerLeave={() => setBackPressed(false)}
        style={{
          width: 44, height: 44,
          background: 'none', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          opacity: backPressed ? 0.9 : 0.6,
          transform: backPressed ? 'scale(0.94)' : 'scale(1)',
          transition: 'opacity 140ms ease, transform 140ms ease',
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.75)" strokeWidth="1.75"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Stage rail */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <LearningProgressHeader
          currentStage={currentStage}
          accent={accent}
          accentRgb={accentRgb}
        />
      </div>

      {/* Screen position / jump trigger */}
      {onJumpOpen && screenPos && (
        <button
          aria-label="Open chapter contents"
          onClick={onJumpOpen}
          style={{
            height: 44, padding: '0 6px',
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            fontFamily: "'Sora', sans-serif",
            fontSize: 11, fontWeight: 600,
            color: `rgba(${accentRgb},0.52)`,
            letterSpacing: '0.04em',
          }}
        >
          {screenPos.current}/{screenPos.total}
        </button>
      )}

      {/* Exit button */}
      <button
        aria-label="Exit chapter"
        onPointerDown={() => setExitPressed(true)}
        onPointerUp={() => { setExitPressed(false); onExit?.() }}
        onPointerLeave={() => setExitPressed(false)}
        style={{
          width: 44, height: 44,
          background: 'none', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          opacity: exitPressed ? 0.6 : 0.22,
          transform: exitPressed ? 'scale(0.90)' : 'scale(1)',
          transition: 'opacity 140ms ease, transform 140ms ease',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.75)" strokeWidth="1.75"
          strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
