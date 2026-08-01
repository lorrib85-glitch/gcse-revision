import BackButton from './BackButton.jsx'
import ExitButton from './ExitButton.jsx'

// ── LearningToolbar — SUPERSEDED ─────────────────────────────────────────────
// Superseded by LearningHeader, which composes BackButton + ExitButton directly.
// No production consumer remains (only the Component Lab reference page).
// Retained temporarily; do not use for new work. Not a locked component — see
// docs/components/LOCKED_COMPONENTS.md for the canonical locked list.
//
// Navigation layer (back + exit) extracted from LearningHeader.
// Owns navigation/escape only — no titles, progress, or metadata.
// Back and exit delegate to the constitutional BackButton/ExitButton components.
export default function LearningToolbar({ onBack, onExit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <BackButton onClick={onBack} />
      <ExitButton onClick={onExit} />
    </div>
  )
}
