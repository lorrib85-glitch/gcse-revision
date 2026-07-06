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
// last, gradual reveal.
//
// Two ways to supply the takeaway:
//   • JSX: pass `children`; emphasise a word with an accent-coloured span.
//   • Data (from content JSON): pass `text` (string) and optional `emphasis`
//     (a substring of `text` to accent-colour).
//
// Props:
//   children — the takeaway as JSX (sentence case; one crisp rule statement)
//   text     — the takeaway as a plain string (used when children is absent)
//   emphasis — optional substring of `text` to render in the accent colour
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

// Render a plain-string takeaway, accent-colouring the `emphasis` substring.
function renderText(text, emphasis, accent) {
  if (!emphasis || !text.includes(emphasis)) return text
  const [before, ...rest] = text.split(emphasis)
  return (
    <>{before}<span style={{ color: accent }}>{emphasis}</span>{rest.join(emphasis)}</>
  )
}

export default function KeyPoint({ children, text, emphasis, icon, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const rgb = theme.accentRgb
  const accent = theme.accent
  const content = children != null ? children : renderText(text || '', emphasis, accent)

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
        {content}
      </div>
    </div>
  )
}
