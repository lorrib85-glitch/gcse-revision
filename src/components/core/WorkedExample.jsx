import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'

// ─── WorkedExample ───────────────────────────────────────────────────────────
// Walks ONE concrete, named case through the concept just taught, so the
// abstract rule becomes applicable: the case → applying the rule → the result.
// It DEMONSTRATES an application; it does not summarise the rule (that is
// KeyPoint) and it must never appear before the concept is taught.
//
// Governed by docs/system/PATTERN_GOVERNANCE.md and
// docs/system/component-contracts/worked-example.md.
//
// Props:
//   scenario — the specific case (node, sentence case)
//   chips    — optional short "givens" (e.g. the symptoms / the numbers)
//   working  — the reasoning that applies the rule to the case (node)
//   result   — the outcome/conclusion for THIS case (node; accent-emphasised)
//   subject  — palette key for the accent (default 'History')

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes we-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .we-in { animation: we-rise ${MOTION.duration.slow} ${MOTION.easing.gentle} both; }
    @media (prefers-reduced-motion: reduce) { .we-in { animation: none; } }
  `
  document.head.appendChild(el)
}

export default function WorkedExample({ scenario, chips = [], working, result, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const rgb = theme.accentRgb

  return (
    <div style={{
      padding: SPACING.standard,
      borderRadius: RADII.medium,
      background: '#151720',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>

      {chips.length > 0 && (
        <div className="we-in" style={{ display: 'flex', gap: SPACING.micro, flexWrap: 'wrap', marginBottom: SPACING.compact }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              ...TYPE.metadata,
              color: 'rgba(245,245,245,0.75)',
              padding: '4px 10px',
              borderRadius: RADII.pill,
              border: `1px solid rgba(${rgb}, 0.28)`,
              background: `rgba(${rgb}, 0.06)`,
            }}>
              {c}
            </span>
          ))}
        </div>
      )}

      {/* The case */}
      <div className="we-in" style={{ ...TYPE.body, fontWeight: 500, color: 'rgba(245,245,245,0.92)', margin: 0, animationDelay: '60ms' }}>
        {scenario}
      </div>

      {/* Applying the rule */}
      {working != null && (
        <div className="we-in" style={{
          ...TYPE.bodySmall,
          fontWeight: 400,
          color: 'rgba(245,245,245,0.6)',
          borderLeft: `2px solid rgba(${rgb}, 0.3)`,
          paddingLeft: SPACING.compact,
          margin: `${SPACING.compact}px 0`,
          animationDelay: '120ms',
        }}>
          {working}
        </div>
      )}

      {/* The result for this case */}
      {result != null && (
        <div className="we-in" style={{
          ...TYPE.body,
          color: 'rgba(245,245,245,0.92)',
          padding: `${SPACING.compact}px`,
          borderRadius: RADII.small,
          background: `rgba(${rgb}, 0.08)`,
          border: `1px solid rgba(${rgb}, 0.22)`,
          animationDelay: '180ms',
        }}>
          {result}
        </div>
      )}

    </div>
  )
}
