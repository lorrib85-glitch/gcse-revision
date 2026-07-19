import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { BUTTONS } from '../../constants/buttons.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { ScreenTitle, ScreenBody } from '../core/ScreenText.jsx'

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
// Select a destination, place a piece, repair only the incorrect parts, then
// resolve the interaction into a clean final equation and governed progression.
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
  const contextImage = block.contextImage ?? block.backgroundImage ?? null
  const blockKey = `${block.label ?? ''}:${(block.answer ?? []).map(answerLabel).join('|')}`

  const [slots, setSlots] = useState(() => Array(slotCount).fill(null))
  const [available, setAvailable] = useState(() => pieces)
  const [mode, setMode] = useState('building')
  const [selectedSlot, setSelectedSlot] = useState(slotCount > 0 ? 0 : null)
  const [announcement, setAnnouncement] = useState('')
  const [continued, setContinued] = useState(false)

  useEffect(() => {
    setSlots(Array(slotCount).fill(null))
    setAvailable(pieces)
    setMode('building')
    setSelectedSlot(slotCount > 0 ? 0 : null)
    setAnnouncement('')
    setContinued(false)
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
  const namespace = `builder-block-${subjectKey.toLowerCase()}`
  const focusClass = `${namespace}-control`
  const pieceClass = `${namespace}-piece`
  const errorClass = `${namespace}-error`
  const resolveClass = `${namespace}-resolve`
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

    const selectedIsUsable = selectedSlot !== null && !isSlotLocked(selectedSlot)
    const targetIndex = selectedIsUsable
      ? selectedSlot
      : slots.findIndex((slot, index) => !slot && !isSlotLocked(index))

    if (targetIndex === null || targetIndex < 0) return

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
      setAnnouncement('Correct. The completed equation is now shown.')
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

  function continueFromCompletion() {
    if (continued || !onComplete) return
    setContinued(true)
    onComplete()
  }

  function slotGroupName(index) {
    if (!hasReactionGroups) return 'Equation'
    return index <= arrowIndex ? groupLabels[0] : groupLabels[1]
  }

  function renderSlot(slotIndex) {
    const piece = slots[slotIndex]
    const showCorrect = (isReviewing || isCorrecting) && slotCorrectness[slotIndex]
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
            ? GENERAL.line.medium
            : GENERAL.line.strong
    const background = showCorrect
      ? GENERAL.surfaceTint
      : GENERAL.backgroundSunken
    const borderStyle = selected || piece ? 'solid' : 'dashed'
    const slotTextColor = piece ? GENERAL.feedbackText : GENERAL.slate

    return (
      <button
        key={slotIndex}
        type="button"
        className={`${focusClass}${showIncorrect ? ` ${errorClass}` : ''}`}
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
          border: `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${borderStyle} ${borderColor}`,
          borderRadius: RADII.small,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: locked ? 'default' : 'pointer',
          boxShadow: selected ? `0 0 0 ${COMPONENT_SIZE.focusOffset}px ${theme.glowStrong}` : 'none',
          ...TYPE.titleMedium,
          color: slotTextColor,
          transition: `background-color ${transition}, border-color ${transition}, box-shadow ${transition}, color ${transition}, transform ${transition}`,
        }}
      >
        <span key={piece?.id ?? 'empty'} className={piece ? pieceClass : undefined}>
          {piece?.label ?? '?'}
        </span>
      </button>
    )
  }

  function renderGroup(indexes, label) {
    return (
      <section aria-label={label}>
        <div style={{ ...TYPE.label, color: GENERAL.slate, marginBottom: SPACING.micro }}>
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
                <span aria-hidden="true" style={{ ...TYPE.titleMedium, color: GENERAL.slate, textAlign: 'center' }}>
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

  function renderResolvedGroup(indexes, label) {
    return (
      <section aria-label={label} style={{ minWidth: 0 }}>
        <div style={{ ...TYPE.label, color: GENERAL.slate, marginBottom: SPACING.micro }}>
          {label}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SPACING.micro }}>
          {indexes.map((slotIndex, position) => (
            <div key={slotIndex} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
              <span style={{ ...TYPE.titleMedium, color: GENERAL.feedbackText }}>
                {answerLabel(block.answer?.[slotIndex])}
              </span>
              {position < indexes.length - 1 && (
                <span aria-hidden="true" style={{ ...TYPE.titleMedium, color: GENERAL.slate }}>
                  {operators[slotIndex] || '+'}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderResolvedEquation() {
    const spokenEquation = (block.answer ?? [])
      .map((answer, index) => `${answerLabel(answer)}${index < slotCount - 1 ? ` ${operators[index] || '+'} ` : ''}`)
      .join('')

    return (
      <div
        className={resolveClass}
        role="status"
        aria-label={`Completed equation: ${spokenEquation}`}
        style={{
          background: GENERAL.backgroundSunken,
          border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
          borderRadius: RADII.medium,
          padding: SPACING.standard,
        }}
      >
        {hasReactionGroups ? (
          <div style={{ display: 'grid', gap: SPACING.compact }}>
            {renderResolvedGroup(reactantIndexes, groupLabels[0])}
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
              <div style={{ height: COMPONENT_SIZE.hairline, flex: 1, background: GENERAL.line.faint }} />
              <span aria-hidden="true" style={{ ...TYPE.titleLarge, color: theme.accent }}>→</span>
              <div style={{ height: COMPONENT_SIZE.hairline, flex: 1, background: GENERAL.line.faint }} />
            </div>
            {renderResolvedGroup(productIndexes, groupLabels[1])}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: SPACING.micro }}>
            {(block.answer ?? []).map((answer, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                <span style={{ ...TYPE.titleMedium, color: GENERAL.feedbackText }}>{answerLabel(answer)}</span>
                {index < slotCount - 1 && (
                  <span aria-hidden="true" style={{ ...TYPE.titleMedium, color: theme.accent }}>
                    {operators[index] || '+'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const placementHelp = allFilled
    ? 'Everything is placed. Check your answer when ready.'
    : selectedSlot === null
      ? 'Choose a space, then choose a word.'
      : `Space ${selectedSlot + 1} is selected. Choose a word from the bank.`

  const atmosphereBackground = contextImage
    ? `linear-gradient(180deg, ${theme.overlay} 0%, ${GENERAL.backgroundSurface} 100%), url(${contextImage}) center / cover`
    : `radial-gradient(circle at 18% -8%, ${theme.glow} 0%, transparent 58%), linear-gradient(180deg, ${theme.backgroundSecondary} 0%, transparent 100%)`

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
        .${pieceClass} {
          animation: ${namespace}-piece-in 180ms cubic-bezier(.16,1,.3,1) both;
        }
        .${errorClass} {
          animation: ${namespace}-error 220ms ease both;
        }
        .${resolveClass} {
          animation: ${namespace}-resolve 360ms cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes ${namespace}-piece-in {
          from { opacity: 0; transform: translateY(4px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ${namespace}-error {
          0%, 100% { transform: translateX(0); }
          35% { transform: translateX(-3px); }
          70% { transform: translateX(3px); }
        }
        @keyframes ${namespace}-resolve {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .${focusClass}, .${pieceClass}, .${errorClass}, .${resolveClass} {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div style={{ marginBottom: SPACING.standard }}>
        <ScreenTitle>{block.label || 'Build the equation'}</ScreenTitle>
        <ScreenBody style={{ color: GENERAL.slate, margin: 0 }}>
          {isCompleted ? 'You built the full relationship.' : instruction}
        </ScreenBody>
      </div>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          background: GENERAL.backgroundSurface,
          border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
          borderRadius: RADII.large,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            height: SPACING.cinematic * 2,
            zIndex: 0,
            pointerEvents: 'none',
            background: atmosphereBackground,
            opacity: contextImage ? 0.34 : 1,
            filter: contextImage ? 'saturate(.8) contrast(.95)' : 'none',
            maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: SPACING.compact }}>
          {isCompleted ? (
            <>
              {renderResolvedEquation()}
              <div style={{ marginTop: SPACING.standard, borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${GENERAL.feedbackCorrect}`, paddingLeft: SPACING.compact }}>
                <div style={{ ...TYPE.titleMedium, color: GENERAL.feedbackCorrect, marginBottom: SPACING.micro }}>
                  Equation complete
                </div>
                <p style={{ ...TYPE.body, color: GENERAL.feedbackText, margin: 0 }}>
                  {block.successText}
                </p>
              </div>
              {onComplete && (
                <ContinueCTA
                  onClick={continueFromCompletion}
                  accent={theme.accent}
                  disabled={continued}
                  label={block.continueLabel ?? 'Continue'}
                  style={{ marginTop: SPACING.standard, animation: `${namespace}-resolve 360ms cubic-bezier(.16,1,.3,1) both` }}
                />
              )}
            </>
          ) : (
            <>
              <div
                style={{
                  marginBottom: SPACING.standard,
                  padding: SPACING.compact,
                  background: GENERAL.backgroundSunken,
                  border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
                  borderRadius: RADII.medium,
                }}
              >
                {hasReactionGroups ? (
                  <div style={{ display: 'grid', gap: SPACING.compact }}>
                    {renderGroup(reactantIndexes, groupLabels[0])}
                    <div
                      aria-label="becomes"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.micro }}
                    >
                      <span aria-hidden="true" style={{ ...TYPE.titleLarge, color: theme.accentSecondary }}>→</span>
                      <span style={{ ...TYPE.label, color: GENERAL.neutral[200] }}>becomes</span>
                    </div>
                    {renderGroup(productIndexes, groupLabels[1])}
                  </div>
                ) : renderLinearEquation()}
              </div>

              {canEdit && (
                <div
                  aria-label="Word bank"
                  style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.micro }}
                >
                  {available.map(piece => (
                    <button
                      key={piece.id}
                      type="button"
                      className={focusClass}
                      onClick={() => place(piece)}
                      style={{
                        minHeight: COMPONENT_SIZE.touchTarget,
                        padding: `0 ${SPACING.compact}px`,
                        background: GENERAL.surfaceTint,
                        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
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
                  marginTop: SPACING.standard,
                  paddingTop: SPACING.compact,
                  borderTop: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
                }}
              >
                {canEdit && (
                  <>
                    <p style={{ ...TYPE.caption, color: GENERAL.slate, margin: `0 0 ${SPACING.micro}px`, textAlign: 'center' }}>
                      {placementHelp}
                    </p>
                    <button
                      type="button"
                      className={focusClass}
                      onClick={checkAnswer}
                      disabled={!allFilled}
                      style={{
                        width: '100%',
                        height: BUTTONS.secondary.height,
                        padding: `0 ${BUTTONS.secondary.paddingX}px`,
                        background: allFilled ? theme.accent : GENERAL.surfaceTint,
                        border: `${COMPONENT_SIZE.hairline}px solid ${allFilled ? theme.accent : GENERAL.line.soft}`,
                        borderRadius: BUTTONS.secondary.borderRadius,
                        fontFamily: BUTTONS.secondary.fontFamily,
                        fontSize: BUTTONS.secondary.fontSize,
                        fontWeight: BUTTONS.secondary.fontWeight,
                        color: allFilled ? GENERAL.textOnAccent : GENERAL.neutral[200],
                        cursor: allFilled ? 'pointer' : 'default',
                        transition: `background-color ${BUTTONS.secondary.transition}, border-color ${BUTTONS.secondary.transition}, color ${BUTTONS.secondary.transition}`,
                      }}
                    >
                      {allFilled ? 'Check answer' : 'Complete all spaces'}
                    </button>
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
