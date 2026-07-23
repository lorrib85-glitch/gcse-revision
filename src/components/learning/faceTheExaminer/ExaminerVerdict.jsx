import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import { markComparisonText } from './utils.js'

export default function ExaminerVerdict({ examiner, guessedMark, accent, visible = true }) {
  if (!visible) return null

  return (
    <section
      role="status"
      aria-live="polite"
      style={{
        padding: '2px 0 22px',
        marginBottom: 22,
        borderBottom: `1px solid ${GENERAL.line.faint}`,
        animation: 'fte-panel-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
        {examiner.verdictLabel || 'Examiner verdict'}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <div style={{ ...TYPE.displayHero, color: accent }}>
          {examiner.mark}/{examiner.marks}
        </div>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
          examiner mark
        </div>
      </div>

      {guessedMark !== null && (
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, marginBottom: 12 }}>
          You gave {guessedMark}/{examiner.marks}. {markComparisonText(guessedMark, examiner.mark)}
        </div>
      )}

      {examiner.summary && (
        <p style={{ ...TYPE.body, color: GENERAL.cinematic.textSecondary, margin: 0 }}>
          {examiner.summary}
        </p>
      )}
    </section>
  )
}
