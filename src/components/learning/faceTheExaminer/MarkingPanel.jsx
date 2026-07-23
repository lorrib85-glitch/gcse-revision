import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import ScoreNumberLine from '../../core/ScoreNumberLine.jsx'

function normaliseCriteriaOptions(options = []) {
  return options.map((option, index) => {
    if (typeof option === 'string') return { id: option, label: option }
    return {
      id: option?.id || option?.label || `criterion-${index}`,
      label: option?.label || option?.id || `Observation ${index + 1}`,
    }
  })
}

export default function MarkingPanel({ accent, examiner, guessedMark, setGuessedMark, selectedCriteria, setSelectedCriteria }) {
  const criteriaOptions = normaliseCriteriaOptions(examiner.criteriaOptions)
  const criteriaUnlocked = guessedMark !== null

  return (
    <div>
      <section style={{ padding: '4px 0 20px' }}>
        <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>
          {examiner.markPromptTitle || 'What mark would you give?'}
        </div>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
          {examiner.markPromptInstruction || 'Drag or tap the mark line. You can also use the arrow keys.'}
        </div>
        <ScoreNumberLine
          value={guessedMark}
          min={0}
          max={examiner.marks}
          accent={accent}
          label={`Predicted mark out of ${examiner.marks}`}
          onChange={setGuessedMark}
        />
      </section>

      {criteriaOptions.length > 0 && (
        <section
          aria-disabled={!criteriaUnlocked}
          style={{
            padding: '20px 0 4px',
            borderTop: `1px solid ${GENERAL.line.faint}`,
            opacity: criteriaUnlocked ? 1 : 0.38,
            pointerEvents: criteriaUnlocked ? 'auto' : 'none',
            transition: 'opacity 220ms ease',
          }}
        >
          <div style={{ width: 42, height: 2, background: `${accent}88`, marginBottom: 18 }} />
          <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>
            {examiner.observationPromptTitle || 'What did you notice?'}
          </div>
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 12 }}>
            {criteriaUnlocked
              ? (examiner.observationPromptInstruction || 'Choose at least one thing an examiner would reward or question.')
              : (examiner.observationLockedInstruction || 'Choose a mark to unlock this step.')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {criteriaOptions.map(option => {
              const selected = selectedCriteria.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`fte-chip${selected ? ' selected' : ''}`}
                  aria-pressed={selected}
                  disabled={!criteriaUnlocked}
                  onClick={() => setSelectedCriteria(previous => (
                    selected
                      ? previous.filter(item => item !== option.id)
                      : [...previous, option.id]
                  ))}
                >
                  {selected && <span aria-hidden="true">✓&nbsp;</span>}
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
