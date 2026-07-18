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

function isReactionArrow(operator) {
  const value = String(operator ?? '').trim()
  return ['→', '⟶', '⇒', '->', '=>'].includes(value)
}

function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index)
}

// ─── BuilderBlock — equation/concept builder ──────────────────────────────────
// Learners select a destination slot, place a word piece and then check the
// complete structure. Reaction equations are grouped into reactants/products so
// the visual model teaches the chemistry as well as testing recall.
export default function BuilderBlock({ block, subject = 'Biology', onComplete }) {
  const { key: subjectKey, theme } = resolveSubject(subject)
  const pieces = useMemo(() => normalisePieces(block.pieces), [block.pieces])
  const slotCount = block.slots?.length ?? block.answer?.length ?? 0
  const operators = block.operators ?? []
  const arrowIndex = operators.findIndex(isReactionArrow)
  const hasReactionGroups = arrowIndex >= 0 && arrowIndex < slotCount - 1
  const reactantIndexes = hasReactionGroups ? range(0, arrowIndex + 1) : []
  const productIndexes = hasReactionGroups ? range(arrowIndex + 1, slotCount) : []
  const groupLabels = block.groupLabels ?? ['Reactants', 'Products']
  const instruction = block.instruction ?? (
    hasReactionGroups
      ? `Place each substance under ${groupLabels[0]} or ${groupLabels[1]}.`
      : 'Tap a space, then choose the word or phrase that belongs there.'
  )
  const blockKey = `${block.label ?? ''}:${(block.answer ?? []).map(answerLabel).join('|')}`

  const [slots, setSlots] = useState(() => Array(slotCount).fill(null))
  const [available, setAvailable] = useState(() => pieces)
  const [mode, setMode] = useState('building')
  const [selectedSlot, setSelectedSlot] = useState(slotCount > 0 ? 0 : null)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    setSlots(Array(slotCount).fill(null))
    setAvailable(pieces)
    setMode('building')
    setSelectedSlot(slotCount > 0 ? 0 : null)
    setAnnouncement('')
  }, [blockKey, pieces, slotCount])

  const slotCorrectness = slots.map(
    (piece, index) => piece?.label === answerLabel(block.answer?.[index]),
  )
  const allFilled = slotCount > 0 && slots.every(Boolean)
  const correctCount = slotCorrectness.filter(Boolean).length
  const isCompleted = mode === 'completed'
  const isReviewing = mode === 'checkedIncorrect'
  const isCorrecting = mode === 'correcting'
  const canEdit = mode === 'building' || isCorrecting
  const focusClass = `builder-block-control-${subjectKey.toLowerCase()}`
  const transition = BUTTONS.compact.transition

  function isSlotLocked(index) {
    return isCompleted || isReviewing || (isCorrecting && slotCorrectness[index])
  }

  function findNextEditableSlot(fromIndex, nextSlots = slots) {
    for (let offset = 1; offset <= slotCount; offset += 1) {
      const index = (fromIndex + offset) % slotCount
      if (!isSlotLocked(index) && !nextSlots[index]) return index
    }
    return null
  }

  function place(piece) {
    if (!canEdit) return

    const selectedIsUsable = selectedSlot !== null
      && !isSlotLocked(selectedSlot)
    const targetIndex = selectedIsUsable
      ? selectedSlot
      : slots.findIndex((slot, index) => !slot && !isSlotLocked(index))

    if (targetIndex < 0 || targetIndex === null) return

    const displacedPiece = slots[targetIndex]
    const nextSlots = [...slots]
    nextSlots[targetIndex] = piece
    setSlots(nextSlots)
    setAvailable(current => {
      const withoutPlaced = current.filter(item => item.id !== piece.id)
      return displacedPiece
        ? [...withoutPlaced, displacedPiece].sort((a, b) => a.order - b.order)
        : withoutPlaced
    })

    const nextIndex = findNextEditableSlot(targetIndex, nextSlots)
    setSelectedSlot(nextIndex ?? targetIndex)
    setAnnouncement(`${piece.label} placed in space ${targetIndex + 1}.`)
  }

  function handleSlotPress(slotIndex) {
    if (!canEdit || isSlotLocked(slotIndex)) return

    const piece = slots[slotIndex]
    setSelectedSlot(slotIndex)

    if (!piece) {
      setAnnouncement(`Space ${slotIndex + 1} selected.`)
      return
    }

    const nextSlots = [...slots]
    nextSlots[slotIndex] = null
    setSlots(nextSlots)
    setAvailable(current => [...current, piece].sort((a, b) => a.order - b.order))
    setAnnouncement(`${piece.label} returned to the word bank. Space ${slotIndex + 1} is selected.`)
  }

  function checkAnswer() {
    if (!allFilled || !canEdit) return

    if (slotCorrectness.every(Boolean)) {
      setMode('completed')
      setSelectedSlot(null)
      setAnnouncement('Correct. The equation is complete.')
      onComplete?.()
      return
    }

    setMode('checkedIncorrect')
    setSelectedSlot(null)
    setAnnouncement(`${correctCount} of ${slotCount} spaces are correct. Correct answers will be kept.`)
  }

  function correctMistakes() {
    const returnedPieces = slots.filter((piece, index) => piece && !slotCorrectness[index])
    const nextSlots = slots.map((piece, index) => (slotCorrectness[index] ? piece : null))
    const firstEmpty = nextSlots.findIndex(slot => !slot)

    setSlots(nextSlots)
    setAvailable(current => [...current, ...returnedPieces].sort((a, b) => a.order - b.order))
    setMode('correcting')
    setSelectedSlot(firstEmpty >= 0 ? firstEmpty : null)
    setAnnouncement('Correct answers have been kept. Fill the empty spaces again.')
  }

  function slotGroupName(index) {
    if (!hasReactionGroups) return 'Equation'
    return index <= arrowIndex ? groupLabels[0] : groupLabels[1]
  }

  function renderSlot(slotIndex) {
    const piece = slots[slotIndex]
    const showCorrect = (isReviewing || isCorrecting || isCompleted) && slotCorrectness[slotIndex]
    const showIncorrect = isReviewing && piece && !slotCorrectness[slotIndex]
    const selected = canEdit && selectedSlot === slotIndex && !isSlotLocked(slotIndex)
    const locked = isSlotLocked(slotIndex)

    const borderColor = showCorrect
      ? GENERAL.feedbackCorrect
      : showIncorrect
        ? GENERAL.feedbackIncorrect
        : selected
          ? theme.accent
          : piece
            ? GENERAL.line.strong
            : GENERAL.line.medium
    const background = showCorrect
      ? GENERAL.surfaceTint
      : showIncorrect
        ? GENERAL.backgroundSunken
        : selected
          ? theme.glowStrong
          : GENERAL.backgroundSunken

    return (
      <button
        key={slotIndex}
        type="button"
        className={focusClass}
        onClick={() => handleSlotPress(slotIndex)}
        disabled={locked}
        aria-pressed={selected}
        aria-invalid={showIncorrect || undefined}
        aria-label={`${slotGroupName(slotIndex)} space ${slotIndex + 1}: ${piece?.label ?? 'empty'}${selected ? ', selected' : ''}${locked ? ', locked' : ''}`}
        style={{
          width: '100%',
          minWidth: 0,
          minHeight: BUTTONS.compact.height,
          padding: `${SPACING.micro}px`,
          background,
          border: `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${piece ? 'solid' : 'dashed'} ${borderColor}`,
          borderRadius: RADII.small,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: locked ? 'default' : 'pointer',
          ...TYPE.titleMedium,
          color: piece ? GENERAL.feedbackText : GENERAL.neutral[300],
          transition: `background-color ${transition}, border-color ${transition}, color ${transition}`,
        }}
      >
        {piece?.label ?? '?'}
      </button>
    )
  }

  function renderGroup(indexes, label) {
    return (
      <section aria-label={label}>
        <div
          style={{
            ...TYPE.label,
            color: GENERAL.slate,
            marginBottom: SPACING.micro,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: indexes.map(() => 'minmax(0, 1fr)').join(' auto '),
            alignItems: 'center',
            gap: SPACING.micro,
          }}
        >
          {indexes.map((slotIndex, position) => (
            <div key={slotIndex} style={{ display: 'contents' }}>
              {renderSlot(slotIndex)}
              {position < indexes.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    ...TYPE.titleMedium,
                    color: GENERAL.slate,
                    textAlign: 'center',
                  }}
                >
                  {operators[slotIndex] || '+'}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderLinearEquation() {
    return (
      <div
        aria-label="Equation spaces"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.micro,
        }}
      >
        {slots.map((_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, flex: '1 1 92px' }}>
            {renderSlot(index)}
            {index < slots.length - 1 && (
              <span aria-hidden="true" style={{ ...TYPE.titleMedium, color: GENERAL.slate }}>
                {operators[index] || '+'}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  const placementHelp = allFilled
    ? 'Everything is placed. Check your answer when ready.'
    : selectedSlot === null
      ? 'Choose a space, then choose a word.'
      : `Space ${selectedSlot + 1} is selected. Choose a word from the bank.`

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <style>{`
        .${focusClass}:focus-visible {
          outline: ${COMPONENT_SIZE.focusRing}px solid ${theme.accent};
          outline-offset: ${COMPONENT_SIZE.focusOffset}px;
        }
        .${focusClass}:not(:disabled):active {
          transform: scale(${BUTTONS.compact.pressScale});
        }
        @media (prefers-reduced-motion: reduce) {
          .${focusClass} {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        style={{
          background: GENERAL.backgroundSurface,
          border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
          borderRadius: RADII.large,
          padding: SPACING.compact,
        }}
      >
        <header style={{ marginBottom: SPACING.standard }}>
          <div
            style={{
              ...TYPE.displayCard,
              color: GENERAL.softWhite,
              marginBottom: SPACING.micro,
            }}
          >
            {block.label || 'Build the equation'}
          </div>
          <p style={{ ...TYPE.bodySmall, color: GENERAL.slate, margin: 0 }}>
            {instruction}
          </p>
        </header>

        <div style={{ marginBottom: SPACING.standard }}>
          {hasReactionGroups ? (
            <div style={{ display: 'grid', gap: SPACING.compact }}>
              {renderGroup(reactantIndexes, groupLabels[0])}
              <div
                aria-label="becomes"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SPACING.micro,
                  color: theme.accent,
                }}
              >
                <span aria-hidden="true" style={{ ...TYPE.titleLarge }}>→</span>
                <span style={{ ...TYPE.caption, color: GENERAL.slate }}>becomes</span>
              </div>
              {renderGroup(productIndexes, groupLabels[1])}
            </div>
          ) : renderLinearEquation()}
        </div>

        {canEdit && (
          <div
            aria-label="Word bank"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: SPACING.micro,
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
                  background: GENERAL.backgroundSunken,
                  border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.medium}`,
                  borderRadius: RADII.small,
                  ...TYPE.button,
                  color: GENERAL.feedbackText,
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

        <div
          style={{
            minHeight: 144,
            marginTop: SPACING.standard,
            paddingTop: SPACING.compact,
            borderTop: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
          }}
        >
          {canEdit && (
            <>
              <button
                type="button"
                className={focusClass}
                onClick={checkAnswer}
                disabled={!allFilled}
                style={{
                  width: '100%',
                  height: BUTTONS.continue.height,
                  padding: `0 ${BUTTONS.continue.paddingX}px`,
                  background: allFilled ? theme.accent : GENERAL.backgroundSunken,
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
              <p style={{ ...TYPE.caption, color: GENERAL.slate, margin: `${SPACING.micro}px 0 0`, textAlign: 'center' }}>
                {placementHelp}
              </p>
            </>
          )}

          {isReviewing && (
            <div role="status" style={{ borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${GENERAL.feedbackIncorrect}`, paddingLeft: SPACING.compact }}>
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
                  background: GENERAL.backgroundSunken,
                  border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.feedbackIncorrect}`,
                  borderRadius: BUTTONS.compact.borderRadius,
                  ...TYPE.button,
                  color: GENERAL.feedbackIncorrect,
                  cursor: 'pointer',
                  transition: `background-color ${transition}, border-color ${transition}, transform ${transition}`,
                }}
              >
                Correct mistakes
              </button>
            </div>
          )}

          {isCompleted && (
            <div role="status" style={{ borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${GENERAL.feedbackCorrect}`, paddingLeft: SPACING.compact }}>
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
    </div>
  )
}
