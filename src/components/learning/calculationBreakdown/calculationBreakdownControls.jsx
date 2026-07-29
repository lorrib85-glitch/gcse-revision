// ─── CalculationBreakdown — shared scene controls ────────────────────────────
//
// The one interaction shape the algebra presentations share: predict, commit,
// observe, explain. The learner selects, presses the governed check action,
// and only then sees whether the move was valid — so every reveal is preceded
// by a decision rather than a tap-until-green scan.
//
// Feedback is low stakes by construction: a wrong choice explains the
// misunderstanding, keeps the selection visible, and re-opens immediately.

import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import CheckAnswerCTA from '../../core/CheckAnswerCTA.jsx'
import { ChoiceButton, Check, Cross, bodyStyle, choiceListStyle } from './calculationBreakdownParts.jsx'

export const OPERATION_CHOICE_INITIAL_STATE = Object.freeze({ picked: null, checked: false })

/**
 * @param options each `{ id, label, correct, feedback }`. Exactly one option
 *   should be correct; feedback on the wrong options must name the
 *   misunderstanding, not just say "no".
 */
export function OperationChoice({
  question,
  support,
  options = [],
  state = OPERATION_CHOICE_INITIAL_STATE,
  setState,
  onResolved,
  onAnnounce,
  resolved = false,
  accent,
  checkLabel = 'Check my answer',
}) {
  const { picked, checked } = state
  const pickedOption = picked === null ? null : options.find(option => option.id === picked)
  const pickedIsCorrect = Boolean(pickedOption?.correct)
  const showVerdict = checked && pickedOption

  function pick(id) {
    if (resolved) return
    setState({ picked: id, checked: false })
  }

  function check() {
    if (resolved || picked === null) return
    const option = options.find(item => item.id === picked)
    setState({ picked, checked: true })
    onAnnounce?.(option?.correct
      ? `Correct. ${option.feedback}`
      : `Not yet. ${option?.feedback ?? ''}`)
    if (option?.correct) onResolved?.()
  }

  return (
    <div>
      <p style={{ ...TYPE.body, color: GENERAL.cinematic.textPrimary, margin: 0 }}>{question}</p>
      {support && <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>{support}</p>}

      <div style={{ ...choiceListStyle, marginTop: SPACING.compact }} role="group" aria-label={question}>
        {options.map((option, index) => {
          const isChecked = checked && picked === option.id
          return (
            <ChoiceButton
              key={option.id}
              label={option.label}
              index={index}
              isSelected={picked === option.id && !checked}
              isCorrect={(resolved || isChecked) && option.correct && picked === option.id}
              isWrong={isChecked && !option.correct}
              statusLabel={
                (resolved || isChecked) && option.correct && picked === option.id
                  ? 'Correct'
                  : isChecked && !option.correct
                    ? 'Not yet'
                    : undefined
              }
              accent={accent}
              disabled={resolved}
              onClick={() => pick(option.id)}
            />
          )
        })}
      </div>

      {!resolved && (
        <CheckAnswerCTA
          onClick={check}
          accent={accent}
          label={checkLabel}
          disabled={picked === null}
          style={{ marginTop: SPACING.compact }}
        />
      )}

      {showVerdict && (
        <div style={verdictStyle(pickedIsCorrect, accent)}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.micro,
            ...TYPE.label,
            color: pickedIsCorrect ? accent : GENERAL.feedbackIncorrect,
          }}>
            {pickedIsCorrect
              ? <Check accent={accent} />
              : <Cross accent={GENERAL.feedbackIncorrect} />}
            {pickedIsCorrect ? 'Why this works' : 'Not yet — here is why'}
          </div>
          <p style={{ ...bodyStyle, color: GENERAL.feedbackText, marginTop: SPACING.micro }}>
            {pickedOption.feedback}
          </p>
          {!pickedIsCorrect && (
            <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>
              Choose again — nothing you have already worked out is lost.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * A secondary, optional reveal — the misconception aside in the balance model.
 * Never the primary action on a scene, and never required to progress.
 */
export function SecondaryRevealButton({ label, onClick, expanded, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      style={{
        ...TYPE.bodySmall,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: COMPONENT_SIZE.touchTarget,
        padding: `${SPACING.micro}px ${SPACING.compact}px`,
        color: accent,
        background: 'transparent',
        border: `1px solid ${GENERAL.line.strong}`,
        borderRadius: RADII.medium,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function verdictStyle(isCorrect, accent) {
  return {
    marginTop: SPACING.compact,
    padding: `${SPACING.compact}px 0 0 ${SPACING.compact}px`,
    borderTop: `1px solid ${GENERAL.line.soft}`,
    borderLeft: `2px solid ${isCorrect ? accent : GENERAL.feedbackIncorrect}`,
  }
}
