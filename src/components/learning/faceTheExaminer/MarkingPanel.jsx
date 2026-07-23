import { useEffect, useRef } from 'react'
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
  const panelRef = useRef(null)
  const criteriaOptions = normaliseCriteriaOptions(examiner.criteriaOptions)
  const criteriaUnlocked = guessedMark !== null

  useEffect(() => {
    const scrollContainer = panelRef.current?.closest('.fte-scroll')
    if (!scrollContainer) return
    if (typeof scrollContainer.scrollTo === 'function') scrollContainer.scrollTo({ top: 0, behavior: 'auto' })
    else scrollContainer.scrollTop = 0
  }, [])

  return (
    <div ref={panelRef}>
      <section style={{ padding: '4px 0 20px' }}>
        <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>
          {examiner.markPromptTitle || 'What mark would you give?'}
        </div>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
          {examiner.markPromptInstruction || 'Drag or tap the mark line.'}
        </div>
        <ScoreNumberLine
          value={guessedMark}
          min={0}
          max={examiner.marks}
          accent={accent}
          label={`Predicted mark out of ${examiner.marks}`}
          onChange={setGuessedMark}
        />
        {criteriaUnlocked && (
          <div
            key={guessedMark}
            role="status"
            aria-live="polite"
            style={{
              ...TYPE.bodySmall,
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 12,
              color: GENERAL.cinematic.textMuted,
              marginTop: 2,
              animation: 'fte-panel-up 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <span>{examiner.selectedMarkLabel || 'Your mark'}</span>
            <strong style={{ ...TYPE.displayCard, color: accent }}>{guessedMark}/{examiner.marks}</strong>
          </div>
        )}
      </section>

      {criteriaOptions.length > 0 && !criteriaUnlocked && (
        <section style={{ padding: '20px 0 4px', borderTop: `1px solid ${GENERAL.line.faint}` }}>
          <div style={{ width: 42, height: 2, background: `${accent}66`, marginBottom: 18 }} />
          <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textSecondary, marginBottom: 4 }}>
            {examiner.observationPreviewTitle || 'Next: spot what earned or lost marks'}
          </div>
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
            {examiner.observationLockedInstruction || 'Choose a mark to unlock this step.'}
          </div>
        </section>
      )}

      {criteriaOptions.length > 0 && criteriaUnlocked && (
        <section
          style={{
            padding: '20px 0 4px',
            borderTop: `1px solid ${GENERAL.line.faint}`,
            animation: 'fte-panel-up 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          <div style={{ width: 42, height: 2, background: `${accent}88`, marginBottom: 18 }} />
          <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: 4 }}>
            {examiner.observationPromptTitle || 'What did you notice?'}
          </div>
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 12 }}>
            {examiner.observationPromptInstruction || 'Choose at least one thing an examiner would reward or question.'}
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
