import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { BUTTONS } from '../../constants/buttons.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

function resolveSubject(subject) {
  const requested = typeof subject === 'string'
    ? subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase()
    : 'Biology'
  const key = SUBJECTS[requested] ? requested : 'Biology'
  return { key, theme: SUBJECTS[key] }
}

function normalisePieces(pieces = []) {
  return pieces.map((piece, index) => {
    if (typeof piece === 'string') {
      return { id: `piece-${index}`, label: piece, order: index }
    }

    return {
      id: piece.id ?? `piece-${index}`,
      label: piece.label ?? piece.text ?? String(piece),
      order: index,
    }
  })
}

function answerLabel(answer) {
  if (typeof answer === 'string') return answer
  return answer?.label ?? answer?.text ?? ''
}

// ─── BuilderBlock — equation/concept builder ──────────────────────────────────
// Tap-to-fill builder: learner places word pieces into ordered slots to
// construct an equation, then checks the answer. Distractor pieces are allowed.
// Correct work is preserved after a wrong attempt so the learner only repairs
// the parts they misunderstood.
export default function BuilderBlock({ block, subject, onComplete }) {
  const { key: subjectKey, theme } = resolveSubject(subject ?? block.subject)
  const pieces = useMemo(() => normalisePieces(block.pieces), [block.pieces])
  const slotCount = block.slots?.length ?? block.answer?.length ?? 0
  const blockKey = `${block.label ?? ''}:${(block.answer ?? []).map(answerLabel).join('|')}`

  const [slots, setSlots] = useState(() => Array(slotCount).fill(null))
  const [available, setAvailable] = useState(() => pieces)
  const [mode, setMode] = useState('building')
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    setSlots(Array(slotCount).fill(null))
    setAvailable(pieces)
    setMode('building')
    setAnnouncement('')
  }, [blockKey, pieces, slotCount])

  const slotCorrectness = slots.map(
    (piece, index) => piece?.label === answerLabel(block.answer?.[index]),
  )
  const allFilled = slots.every(Boolean)
  const correctCount = slotCorrectness.filter(Boolean).length
  const isCompleted = mode === 'completed'
  const isReviewing = mode === 'checkedIncorrect'
  const isCorrecting = mode === 'correcting'
  const hasChecked = isReviewing || isCorrecting || isCompleted
  const canEdit = mode === 'building' || isCorrecting
  const focusClass = `builder-block-control-${subjectKey.toLowerCase()}`
  const transition = BUTTONS.compact.transition

  function place(piece) {
    if (!canEdit) return
    const emptyIndex = slots.findIndex(slot => slot === null)
    if (emptyIndex < 0) return

    const nextSlots = [...slots]
    nextSlots[emptyIndex] = piece
    setSlots(nextSlots)
    setAvailable(current => current.filter(item => item.id !== piece.id))
    setAnnouncement(`${piece.label} placed in space ${emptyIndex + 1}.`)
  }

  function remove(slotIndex) {
    const isPreservedCorrectAnswer = isCorrecting && slotCorrectness[slotIndex]
    if (!canEdit || isPreservedCorrectAnswer) return
    const piece = slots[slotIndex]
    if (!piece) return

    const nextSlots = [...slots]
    nextSlots[slotIndex] = null
    setSlots(nextSlots)
    setAvailable(current => [...current, piece].sort((a, b) => a.order - b.order))
    setAnnouncement(`${piece.label} returned to the word bank.`)
  }

  function checkAnswer() {
    if (!allFilled || !canEdit) return

    if (slotCorrectness.every(Boolean)) {
      setMode('completed')
      setAnnouncement('Correct. The equation is complete.')
      onComplete?.()
      return
    }

    setMode('checkedIncorrect')
    setAnnouncement(`${correctCount} of ${slotCount} spaces are correct. Correct answers will be kept.`)
  }

  function correctMistakes() {
    const returnedPieces = slots.filter((piece, index) => piece && !slotCorrectness[index])
    setSlots(current => current.map((piece, index) => (slotCorrectness[index] ? piece : null)))
    setAvailable(current => [...current, ...returnedPieces].sort((a, b) => a.order - b.order))
    setMode('correcting')
    setAnnouncement('Correct answers have been kept. Fill the empty spaces again.')
  }

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <style>{`
        .${focusClass}:focus-visible {
          outline: ${COMPONENT_SIZE.focusRing}px solid ${theme.accent};
          outline-offset: ${COMPONENT_SIZE.focusOffset}px;
        }
        @media (prefers-reduced-motion: reduce) {
          .${focusClass} {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        style={{
          background: GENERAL.backgroundPanel,
          border: `1px solid ${GENERAL.line.soft}`,
          borderRadius: RADII.large,
          padding: SPACING.compact,
        }}
      >
        <div
          style={{
            ...TYPE.displayCard,
            color: GENERAL.softWhite,
            marginBottom: SPACING.compact,
          }}
        >
          {block.label || 'Build the equation'}
        </div>

        <div
          aria-label="Equation spaces"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.micro,
            marginBottom: SPACING.compact,
          }}
        >
          {slots.map((piece, index) => {
            const isCorrect = hasChecked && slotCorrectness[index]
            const isIncorrect = isReviewing && piece && !slotCorrectness[index]
            const isLocked = isCompleted || isReviewing || (isCorrecting && slotCorrectness[index])
            const borderColor = isCorrect
              ? GENERAL.feedbackCorrect
              : isIncorrect
                ? GENERAL.feedbackIncorrect
                : piece
                  ? theme.accent
                  : GENERAL.line.strong
            const background = isCorrect
              ? GENERAL.surfaceTint
              : isIncorrect
                ? GENERAL.backgroundSunken
                : piece
                  ? theme.glowStrong
                  : GENERAL.backgroundSunken

            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                <button
                  type="button"
                  className={focusClass}
                  onClick={() => remove(index)}
                  disabled={!piece || isLocked}
                  aria-label={`Space ${index + 1}: ${piece?.label ?? 'empty'}${isLocked ? ', locked' : ', tap to remove'}`}
                  aria-invalid={isIncorrect || undefined}
                  style={{
                    minWidth: 'clamp(80px, 24vw, 132px)',
                    height: BUTTONS.compact.height,
                    padding: `0 ${SPACING.micro}px`,
                    background,
                    border: `${COMPONENT_SIZE.hairline}px ${piece ? 'solid' : 'dashed'} ${borderColor}`,
                    borderRadius: RADII.small,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: piece && !isLocked ? 'pointer' : 'default',
                    ...TYPE.titleMedium,
                    color: piece ? GENERAL.feedbackText : GENERAL.neutral[300],
                    transition: `background-color ${transition}, border-color ${transition}, color ${transition}`,
                  }}
                >
                  {piece?.label ?? '?'}
                </button>

                {index < slots.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      ...TYPE.titleMedium,
                      color: theme.accent,
                    }}
                  >
                    {block.operators?.[index] || '+'}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {canEdit && (
          <div
            aria-label="Word bank"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: SPACING.micro,
              marginBottom: SPACING.compact,
            }}
          >
            {available.map(piece => (
              <button
                key={piece.id}
                type="button"
                className={focusClass}
                onClick={() => place(piece)}
                style={{
                  minHeight: BUTTONS.compact.height,
                  padding: `0 ${BUTTONS.compact.paddingX}px`,
                  background: theme.glowStrong,
                  border: `${COMPONENT_SIZE.hairline}px solid ${theme.accent}`,
                  borderRadius: RADII.small,
                  ...TYPE.button,
                  color: theme.accentSecondary,
                  cursor: 'pointer',
                  transition: `background-color ${transition}, border-color ${transition}, transform ${transition}`,
                }}
              >
                {piece.label}
              </button>
            ))}
          </div>
        )}

        <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {announcement}
        </div>

        {canEdit && (
          <button
            type="button"
            className={focusClass}
            onClick={checkAnswer}
            disabled={!allFilled}
            style={{
              width: '100%',
              height: BUTTONS.continue.height,
              padding: `0 ${BUTTONS.continue.paddingX}px`,
              background: allFilled ? theme.accent : GENERAL.backgroundSurface,
              border: `${COMPONENT_SIZE.hairline}px solid ${allFilled ? theme.accent : GENERAL.line.medium}`,
              borderRadius: BUTTONS.continue.borderRadius,
              fontFamily: BUTTONS.continue.fontFamily,
              fontSize: BUTTONS.continue.fontSize,
              fontWeight: BUTTONS.continue.fontWeight,
              color: allFilled ? GENERAL.textOnAccent : GENERAL.neutral[300],
              cursor: allFilled ? 'pointer' : 'default',
              opacity: allFilled ? 1 : 0.72,
              transition: `background-color ${BUTTONS.continue.transition}, border-color ${BUTTONS.continue.transition}, color ${BUTTONS.continue.transition}`,
            }}
          >
            {allFilled ? 'Check answer' : 'Complete all spaces'}
          </button>
        )}

        {isReviewing && (
          <div
            role="status"
            style={{
              background: GENERAL.backgroundSunken,
              border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.feedbackIncorrect}`,
              borderRadius: RADII.medium,
              padding: SPACING.compact,
            }}
          >
            <div style={{ ...TYPE.titleMedium, color: GENERAL.feedbackIncorrect, marginBottom: SPACING.micro }}>
              {correctCount} of {slotCount} are in the right place
            </div>
            <p style={{ ...TYPE.bodySmall, color: GENERAL.feedbackText, margin: `0 0 ${SPACING.compact}px` }}>
              {block.hint}
            </p>
            <button
              type="button"
              className={focusClass}
              onClick={correctMistakes}
              style={{
                minHeight: BUTTONS.compact.height,
                padding: `0 ${BUTTONS.compact.paddingX}px`,
                background: GENERAL.surfaceTint,
                border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.feedbackIncorrect}`,
                borderRadius: BUTTONS.compact.borderRadius,
                ...TYPE.button,
                color: GENERAL.feedbackIncorrect,
                cursor: 'pointer',
                transition: `background-color ${transition}, border-color ${transition}`,
              }}
            >
              Correct mistakes
            </button>
          </div>
        )}

        {isCompleted && (
          <div
            role="status"
            style={{
              background: GENERAL.backgroundSunken,
              border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.feedbackCorrect}`,
              borderRadius: RADII.medium,
              padding: SPACING.compact,
              textAlign: 'center',
            }}
          >
            <div style={{ ...TYPE.titleMedium, color: GENERAL.feedbackCorrect, marginBottom: SPACING.micro }}>
              Correct
            </div>
            <p style={{ ...TYPE.body, color: GENERAL.feedbackText, margin: 0 }}>
              {block.successText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
