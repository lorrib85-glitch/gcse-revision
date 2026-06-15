import BackButton from './BackButton.jsx'
import ExitButton from './ExitButton.jsx'

// ── ModuleToolbar v2 — LOCKED COMPONENT ──────────────────────────────────────
// Navigation layer (back + exit) extracted from LearningHeader.
// Owns navigation/escape only — no titles, progress, or metadata.
// Back and exit delegate to the constitutional BackButton/ExitButton components.
export default function ModuleToolbar({ onBack, onExit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <BackButton onClick={onBack} />
      <ExitButton onClick={onExit} />
    </div>
  )
}
