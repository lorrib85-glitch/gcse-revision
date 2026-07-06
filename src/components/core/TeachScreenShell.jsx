import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'

// ─── TeachScreenShell ────────────────────────────────────────────────────────
// Composes a teaching screen with the approved vertical rhythm so spacing
// stops being a per-session judgement call. Slots render in a fixed order —
// eyebrow → heading → intro → body → keyPoint — with token-driven gaps and a
// calm entrance; the keyPoint slot reveals gradually, slightly after the rest.
//
// Governed by docs/system/PATTERN_GOVERNANCE.md and
// docs/system/component-contracts/teach-screen-shell.md.
//
// Props:
//   heading  — required; the screen's single teaching heading (sentence case)
//   eyebrow  — optional; a label ONLY if it adds information the heading lacks
//              (see the eyebrow rule). Rendered sentence case, never uppercase.
//   intro    — optional; one short framing line under the heading
//   children — the teaching body (at most one visual — a MediaPlaceholder)
//   keyPoint — optional node rendered last with a gradual reveal (a KeyPoint)
//   subject  — palette key for the accent (default 'History')

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tss-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .tss-in { animation: tss-rise ${MOTION.duration.slow} ${MOTION.easing.standard} both; }
    @media (prefers-reduced-motion: reduce) {
      .tss-in { animation: none; }
    }
  `
  document.head.appendChild(el)
}

export default function TeachScreenShell({ heading, eyebrow, intro, children, keyPoint, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent

  return (
    <div style={{
      maxWidth: 420,
      margin: '0 auto',
      padding: `${SPACING.cinematic}px ${SPACING.standard}px ${SPACING.cinematic}px`,
      boxSizing: 'border-box',
    }}>

      {eyebrow && (
        <div className="tss-in" style={{
          ...TYPE.label,
          color: accent,
          marginBottom: SPACING.micro,
          // no text-transform: eyebrows are sentence case, never uppercase
        }}>
          {eyebrow}
        </div>
      )}

      <h1 className="tss-in" style={{
        ...TYPE.displayScreen,
        color: 'rgba(245,245,245,0.96)',
        margin: 0,
        animationDelay: eyebrow ? '60ms' : '0ms',
      }}>
        {heading}
      </h1>

      {intro && (
        <p className="tss-in" style={{
          ...TYPE.body,
          color: 'rgba(245,245,245,0.60)',
          margin: `${SPACING.compact}px 0 0`,
          animationDelay: '120ms',
        }}>
          {intro}
        </p>
      )}

      {children != null && (
        <div className="tss-in" style={{
          marginTop: SPACING.separation,
          animationDelay: '180ms',
        }}>
          {children}
        </div>
      )}

      {/* keyPoint owns its own gradual reveal (see KeyPoint); the shell only positions it last */}
      {keyPoint != null && (
        <div style={{ marginTop: SPACING.separation }}>
          {keyPoint}
        </div>
      )}

    </div>
  )
}
