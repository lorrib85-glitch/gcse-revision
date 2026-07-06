import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'

// ─── KeyPoint ────────────────────────────────────────────────────────────────
// Lands the single takeaway of a screen — the one rule the learner must leave
// holding. An accent-tinted box that reveals gradually and last, so the point
// arrives as a moment. It SUMMARISES A RULE; it does not demonstrate a case
// (that is WorkedExample) and it is not a generic callout for any text.
//
// Governed by docs/system/PATTERN_GOVERNANCE.md and
// docs/system/component-contracts/key-point.md.
//
// Rules baked in: no eyebrow, sentence case, at most one per screen, appears
// last, gradual reveal. Emphasise a word by wrapping it in an accent-coloured
// span inside `children`.
//
// Props:
//   children — the takeaway (sentence case; one crisp rule statement)
//   icon     — optional small leading glyph (node); omit for a clean rule box
//   subject  — palette key for the accent (default 'History')

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes kp-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .kp-reveal { animation: kp-rise ${MOTION.duration.slow} ${MOTION.easing.gentle} 220ms both; }
    @media (prefers-reduced-motion: reduce) { .kp-reveal { animation: none; } }
  `
  document.head.appendChild(el)
}

export default function KeyPoint({ children, icon, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const rgb = theme.accentRgb

  return (
    <div className="kp-reveal" style={{
      display: 'flex',
      gap: SPACING.compact,
      alignItems: 'flex-start',
      padding: SPACING.standard,
      borderRadius: RADII.medium,
      background: `rgba(${rgb}, 0.08)`,
      border: `1px solid rgba(${rgb}, 0.28)`,
    }}>
      {icon != null && (
        <div style={{ fontSize: 20, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>{icon}</div>
      )}
      <div style={{ ...TYPE.body, fontWeight: 500, color: 'rgba(245,245,245,0.92)', margin: 0 }}>
        {children}
      </div>
    </div>
  )
}
