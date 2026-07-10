import { createPortal } from 'react-dom'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'

// ─── SaveFailureNotice ───────────────────────────────────────────────────────
// The single governed learner-facing surface shown when a critical save fails
// (module progress, screen completion, quiz/exam scores, streaks, planner
// completion). Calm, subject-neutral, mobile-first. It never claims progress
// was saved; it offers a retry and a safe "keep learning" dismissal. Wiring
// (which saves are critical, dedupe, retry) lives in the storage boundary +
// saveFailureController — this component only presents state.
//
// Not a toast: shown only on failure, one at a time, and dismissed explicitly.

export default function SaveFailureNotice({ open, retrying = false, onRetry, onDismiss }) {
  if (!open) return null

  const primaryLabel = retrying ? 'Trying…' : 'Try again'

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="save-failure-title"
      aria-describedby="save-failure-body"
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: GENERAL.scrim,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: SPACING.compact,
        paddingBottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 420,
          background: GENERAL.backgroundSurface,
          border: `1px solid ${GENERAL.line.soft}`,
          borderRadius: RADII.panel,
          padding: SPACING.standard,
          display: 'flex', flexDirection: 'column', gap: SPACING.compact,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
          <h2
            id="save-failure-title"
            style={{ ...TYPE.titleMedium, color: GENERAL.softWhite, margin: 0 }}
          >
            We couldn’t save your progress
          </h2>
          <p
            id="save-failure-body"
            style={{ ...TYPE.body, color: GENERAL.slate, margin: 0 }}
          >
            Your work is still open, but it hasn’t been saved yet. Try again before you leave this page.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            style={{
              height: BUTTONS.primary.height,
              borderRadius: BUTTONS.primary.borderRadius,
              border: 'none',
              background: GENERAL.teal,
              color: GENERAL.textOnAccent,
              ...TYPE.button,
              cursor: retrying ? 'default' : 'pointer',
              opacity: retrying ? 0.7 : 1,
              transition: BUTTONS.primary.transition,
            }}
          >
            {primaryLabel}
          </button>

          <button
            type="button"
            onClick={onDismiss}
            disabled={retrying}
            style={{
              height: BUTTONS.secondary.height,
              borderRadius: BUTTONS.secondary.borderRadius,
              border: `1px solid ${GENERAL.line.medium}`,
              background: 'transparent',
              color: GENERAL.slate,
              ...TYPE.button,
              cursor: retrying ? 'default' : 'pointer',
              transition: BUTTONS.secondary.transition,
            }}
          >
            Keep learning
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
