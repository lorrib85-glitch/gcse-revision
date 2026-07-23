import { GENERAL } from '../../../constants/generalTheme.js'
import { RADII } from '../../../constants/radii.js'
import { TYPE } from '../../../constants/typography.js'
import ScoreNumberLine from '../../core/ScoreNumberLine.jsx'

export default function MarkingPanel({ accent, examiner, guessedMark, setGuessedMark, selectedCriteria, setSelectedCriteria }) {
  const criteriaOptions = examiner.criteriaOptions || []
  const criteriaUnlocked = guessedMark !== null

  return (
    <div style={{
      overflow: 'hidden',
      borderRadius: RADII.large,
      borderTop: `1px solid ${GENERAL.line.soft}`,
      borderBottom: `1px solid ${GENERAL.line.faint}`,
      background: 'rgba(8,9,13,0.24)',
    }}>
      <section style={{ padding: '18px 16px 16px' }}>
        <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>What mark would you give?</div>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>Drag or tap the mark line. You can also use the arrow keys.</div>
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
        <>
          <div style={{ height: 1, margin: '0 16px', background: GENERAL.line.faint }} />

          <section
            aria-disabled={!criteriaUnlocked}
            style={{
              padding: '16px 16px 18px',
              opacity: criteriaUnlocked ? 1 : 0.42,
              pointerEvents: criteriaUnlocked ? 'auto' : 'none',
              transition: 'opacity 220ms ease',
            }}
          >
            <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>What did you notice?</div>
            <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 12 }}>
              {criteriaUnlocked ? 'Choose at least one thing an examiner would reward or question.' : 'Choose a mark to unlock this step.'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {criteriaOptions.map(option => {
                const selected = selectedCriteria.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    className={`fte-chip${selected ? ' selected' : ''}`}
                    aria-pressed={selected}
                    disabled={!criteriaUnlocked}
                    onClick={() => setSelectedCriteria(previous => (selected ? previous.filter(item => item !== option) : [...previous, option]))}
                  >
                    {selected ? '✓ ' : ''}{option}
                  </button>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
