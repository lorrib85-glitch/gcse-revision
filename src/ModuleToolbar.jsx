import { useState } from 'react'

// ── ModuleToolbar v1 — LOCKED COMPONENT ──────────────────────────────────────
// Navigation layer (back + exit) extracted from LearningHeader.
// Owns navigation/escape only — no titles, progress, or metadata.
// Behaviour and inline styling preserved exactly from the original integrated
// header. Architectural separation only — do not redesign visually.
export default function ModuleToolbar({ onBack, onExit }) {
  const [backPressed, setBackPressed] = useState(false)
  const [exitPressed, setExitPressed] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <button
        aria-label="Go back"
        onPointerDown={() => setBackPressed(true)}
        onPointerUp={() => { setBackPressed(false); onBack?.() }}
        onPointerLeave={() => setBackPressed(false)}
        style={{
          width: 44, height: 40,
          background: 'none', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: backPressed ? 0.9 : 0.6,
          transform: backPressed ? 'scale(0.94)' : 'scale(1)',
          transition: 'opacity 140ms ease, transform 140ms ease',
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,1)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <button
        aria-label="Exit chapter"
        onPointerDown={() => setExitPressed(true)}
        onPointerUp={() => { setExitPressed(false); onExit?.() }}
        onPointerLeave={() => setExitPressed(false)}
        style={{
          width: 44, height: 40,
          background: 'none', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: exitPressed ? 0.6 : 0.22,
          transform: exitPressed ? 'scale(0.90)' : 'scale(1)',
          transition: 'opacity 140ms ease, transform 140ms ease',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,1)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
