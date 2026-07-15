import { useId } from 'react'
import { GENERAL } from '../../../constants/generalTheme.js'

/**
 * Prediction UI for CircuitDiagram's predict-then-test mode.
 *
 * Native radio inputs preserve familiar keyboard and screen-reader behaviour.
 * The prediction locks before the scientific control becomes available, so the
 * learner has to commit to an idea before seeing the outcome.
 */
export default function CircuitPredictionPanel({
  prediction,
  selectedOptionId,
  onSelect,
  result,
  visualRoles,
}) {
  const groupName = useId()
  const promptId = useId()
  const feedbackId = useId()
  const isLocked = selectedOptionId !== null
  const feedbackTone = result?.correct
    ? GENERAL.feedbackCorrect
    : GENERAL.feedbackIncorrect

  return (
    <section
      aria-labelledby={promptId}
      data-circuit-prediction-phase={result ? 'result' : isLocked ? 'test' : 'predict'}
      style={{
        margin: '10px 16px 0',
        padding: '16px',
        border: `1px solid ${GENERAL.line.medium}`,
        borderRadius: 14,
        background: GENERAL.surfaceTint,
      }}
    >
      <fieldset
        disabled={isLocked}
        style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}
      >
        <legend
          id={promptId}
          style={{
            width: '100%',
            padding: 0,
            color: visualRoles.textPrimary,
            fontFamily: 'Sora, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.45,
          }}
        >
          {prediction.prompt}
        </legend>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginTop: 12,
          }}
        >
          {prediction.options.map(option => {
            const selected = selectedOptionId === option.id

            return (
              <label
                key={option.id}
                className="circuit-diagram__prediction-option"
                data-selected={selected || undefined}
                style={{
                  '--circuit-prediction-focus': visualRoles.interaction,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 52,
                  padding: '11px 13px',
                  border: `1px solid ${selected ? visualRoles.interaction : GENERAL.line.strong}`,
                  borderRadius: 12,
                  background: selected ? visualRoles.interactionSoft : 'transparent',
                  color: visualRoles.textPrimary,
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 13,
                  fontWeight: selected ? 700 : 600,
                  lineHeight: 1.4,
                  cursor: isLocked ? 'default' : 'pointer',
                }}
              >
                <input
                  className="circuit-diagram__prediction-input"
                  type="radio"
                  name={groupName}
                  value={option.id}
                  checked={selected}
                  onChange={() => onSelect(option.id)}
                />
                <span aria-hidden="true" style={{
                  width: 18,
                  height: 18,
                  flex: '0 0 18px',
                  marginRight: 10,
                  border: `2px solid ${selected ? visualRoles.interaction : visualRoles.textSecondary}`,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                  {selected && (
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: visualRoles.interaction,
                    }} />
                  )}
                </span>
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div
        id={feedbackId}
        aria-live="polite"
        aria-atomic="true"
        style={{ minHeight: isLocked ? 42 : 0 }}
      >
        {isLocked && !result && (
          <p style={{
            margin: '12px 0 0',
            color: visualRoles.interaction,
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.5,
          }}>
            {prediction.testInstruction}
          </p>
        )}

        {result && (
          <div
            role="status"
            style={{
              marginTop: 12,
              padding: '11px 12px',
              borderLeft: `3px solid ${feedbackTone}`,
              background: GENERAL.surfaceTint,
            }}
          >
            <p style={{
              margin: 0,
              color: visualRoles.textPrimary,
              fontFamily: 'Sora, sans-serif',
              fontSize: 13,
              lineHeight: 1.55,
            }}>
              <strong style={{ color: feedbackTone }}>
                {result.correct ? 'Prediction matched. ' : 'The result was different. '}
              </strong>
              {result.feedback}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
