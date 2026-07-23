import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'

function ScoreComparisonRow({ label, value, accent, emphasised = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ ...TYPE.body, color: emphasised ? GENERAL.cinematic.textPrimary : GENERAL.cinematic.textSecondary }}>
        {label}
      </div>
      <div style={{ ...TYPE.displayCard, color: emphasised ? accent : GENERAL.cinematic.textPrimary, flexShrink: 0 }}>
        {value}
      </div>
    </div>
  )
}

export default function ExaminerVerdict({ examiner, guessedMark, accent, visible = true }) {
  if (!visible) return null

  return (
    <section
      role="status"
      aria-live="polite"
      style={{
        display: 'grid',
        gap: 10,
        padding: '2px 0 22px',
        marginBottom: 10,
        borderBottom: `1px solid ${GENERAL.line.faint}`,
        animation: 'fte-panel-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      {guessedMark !== null && (
        <ScoreComparisonRow
          label={examiner.learnerScoreLabel || 'You scored it'}
          value={`${guessedMark}/${examiner.marks}`}
          accent={accent}
        />
      )}
      <ScoreComparisonRow
        label={examiner.examinerScoreLabel || 'The examiner scored it'}
        value={`${examiner.mark}/${examiner.marks}`}
        accent={accent}
        emphasised
      />
    </section>
  )
}
