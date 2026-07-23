import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { BUTTONS } from '../../constants/buttons.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { ScreenBody, ScreenTitle } from '../core/ScreenText.jsx'

function resolveSubject(subject) {
  const requested = typeof subject === 'string'
    ? subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase()
    : 'Biology'
  const key = SUBJECTS[requested] ? requested : 'Biology'
  return { key, theme: SUBJECTS[key] }
}

function normalisePieces(pieces = []) {
  return pieces.map((piece, index) => {
    if (typeof piece === 'string' || typeof piece === 'number') {
      return { id: `piece-${index}`, label: String(piece), order: index }
    }

    return {
      id: piece.id ?? `piece-${index}`,
      label: piece.label ?? piece.text ?? String(piece),
      order: index,
    }
  })
}

function answerLabel(answer) {
  if (typeof answer === 'string' || typeof answer === 'number') return String(answer)
  return answer?.label ?? answer?.text ?? ''
}

function isReactionArrow(operator) {
  return ['→', '⟶', '⇒', '->', '=>'].includes(String(operator ?? '').trim())
}

function templateSlotIndex(token) {
  const match = String(token).match(/^\{\{(\d+)\}\}$/)
  return match ? Number(match[1]) : null
}

function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index)
}

function isNumericLabel(value) {
  const label = answerLabel(value).trim()
  return label !== '' && Number.isFinite(Number(label))
}

export default function BuilderBlock({ block, subject = 'Biology', onComplete }) {
  const { key: subjectKey, theme } = resolveSubject(subject)
  const pieces = useMemo(() => normalisePieces(block.pieces), [block.pieces])
  const slotCount = block.slots?.length ?? block.answer?.length ?? 0
  const operators = block.operators ?? []
  const arrowIndex = operators.findIndex(isReactionArrow)
  const hasReactionGroups = arrowIndex >= 0 && arrowIndex < slotCount - 1
  const requestedLayout = block.layout ?? block.variant
  const layout = requestedLayout ?? (hasReactionGroups ? 'reaction' : 'equation')
  const usesReactionLayout = layout === 'reaction'
  const isQuoteLayout = layout === 'quote' || layout === 'sentence'
  const isExpressionLayout = layout === 'equation' || layout === 'calculation'
  const usesTemplate = Boolean(block.template) && (isQuoteLayout || isExpressionLayout)
  const usesTabularNumerals = block.numeric ?? (
    pieces.length > 0
    && pieces.every(piece => isNumericLabel(piece.label))
    && (block.answer ?? []).every(isNumericLabel)
  )
  const reactantIndexes = hasReactionGroups ? range(0, arrowIndex + 1) : []
  const productIndexes = hasReactionGroups ? range(arrowIndex + 1, slotCount) : []
  const groupLabels = block.groupLabels ?? ['Reactants', 'Products']
  const instruction = block.instruction ?? (
    isQuoteLayout
      ? 'Choose the missing words or phrases to restore the quotation.'
      : isExpressionLayout && usesTemplate
        ? 'Choose the missing value or term for each gap.'
        : usesReactionLayout
          ? `Place each item under ${groupLabels[0]} or ${groupLabels[1]}.`
          : 'Tap a gap, then choose the option that belongs there.'
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
  const bankPieceClass = `${namespace}-bank-piece`
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
    setAnnouncement(`${piece.label} placed in the selected gap.`)
  }

  function handleSlotPress(slotIndex) {
    if (!canEdit || isSlotLocked(slotIndex)) return

    const piece = slots[slotIndex]
    setSelectedSlot(slotIndex)

    if (!piece) {
      setAnnouncement('Gap selected.')
      return
    }

    const nextSlots = [...slots]
    nextSlots[slotIndex] = null
    setSlots(nextSlots)
    setAvailable(current => [...current, piece].sort((a, b) => a.order - b.order))
    setAnnouncement(`${piece.label} returned to the choices.`)
  }

  function checkAnswer() {
    if (!allFilled || !canEdit) return

    if (slotCorrectness.every(Boolean)) {
      setMode('completed')
      setSelectedSlot(null)
      setAnnouncement(`Correct. The completed ${isQuoteLayout ? 'quotation' : usesReactionLayout ? 'relationship' : 'expression'} is now shown.`)
      return
    }

    setMode('checkedIncorrect')
    setSelectedSlot(null)
    setAnnouncement(`${correctCount} of ${slotCount} gaps are correct. Correct answers will be kept.`)
  }

  function correctMistakes() {
    const returnedPieces = slots.filter((piece, index) => piece && !slotCorrectness[index])
    const nextSlots = slots.map((piece, index) => (slotCorrectness[index] ? piece : null))
    const firstEmpty = nextSlots.findIndex(slot => !slot)

    setSlots(nextSlots)
    setAvailable(current => [...current, ...returnedPieces].sort((a, b) => a.order - b.order))
    setMode('correcting')
    setSelectedSlot(firstEmpty >= 0 ? firstEmpty : null)
    setAnnouncement('Correct answers have been kept. Try the highlighted gaps again.')
  }

  function continueFromCompletion() {
    if (continued || !onComplete) return
    setContinued(true)
    onComplete()
  }

  function slotGroupName(index) {
    if (isQuoteLayout) return block.slotGroupLabel ?? 'Quotation'
    if (usesReactionLayout && hasReactionGroups) {
      return index <= arrowIndex ? groupLabels[0] : groupLabels[1]
    }
    return block.slotGroupLabel ?? 'Expression'
  }

  function getSlotAppearance(slotIndex) {
    const piece = slots[slotIndex]
    const showCorrect = (isReviewing || isCorrecting) && slotCorrectness[slotIndex]
    const showIncorrect = isReviewing && piece && !slotCorrectness[slotIndex]
    const selected = canEdit && selectedSlot === slotIndex && !isSlotLocked(slotIndex)
    const locked = isSlotLocked(slotIndex)
    const accent = showCorrect
      ? GENERAL.feedbackCorrect
      : showIncorrect
        ? GENERAL.feedbackIncorrect
        : theme.accent

    return { piece, showCorrect, showIncorrect, selected, locked, accent }
  }

  function renderSlot(slotIndex, { inline = false, quote = false, symbolic = false } = {}) {
    const { piece, showCorrect, showIncorrect, selected, locked, accent } = getSlotAppearance(slotIndex)
    const emptyMark = symbolic ? '?' : '…'
    const quoteSlot = inline && quote

    return (
      <button
        key={slotIndex}
        type="button"
        className={`${focusClass}${showIncorrect ? ` ${errorClass}` : ''}`}
        onClick={() => handleSlotPress(slotIndex)}
        disabled={locked}
        aria-pressed={selected}
        aria-invalid={showIncorrect || undefined}
        aria-label={`${slotGroupName(slotIndex)} gap ${slotIndex + 1}: ${piece?.label ?? 'empty'}${selected ? ', selected' : ''}${locked ? ', locked' : ''}`}
        style={{
          width: inline ? 'auto' : '100%',
          minWidth: inline
            ? (symbolic ? BUTTONS.compact.height * 1.5 : BUTTONS.compact.height * 2)
            : 0,
          minHeight: inline ? COMPONENT_SIZE.touchTarget : BUTTONS.compact.height,
          padding: inline
            ? `${SPACING.micro / 2}px ${quoteSlot ? SPACING.micro : SPACING.compact}px`
            : `0 ${SPACING.micro}px`,
          background: quoteSlot
            ? 'transparent'
            : selected
              ? theme.glowStrong
              : GENERAL.surfaceTint,
          border: quoteSlot
            ? 'none'
            : `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px solid ${selected || showCorrect || showIncorrect ? accent : GENERAL.line.strong}`,
          borderBottom: quoteSlot
            ? `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${piece ? 'solid' : 'dashed'} ${selected || showCorrect || showIncorrect ? accent : GENERAL.line.strong}`
            : undefined,
          borderRadius: quoteSlot ? 0 : RADII.pill,
          display: inline ? 'inline-flex' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: inline ? 'middle' : undefined,
          margin: inline ? `${COMPONENT_SIZE.focusOffset}px ${SPACING.micro / 2}px` : undefined,
          cursor: locked ? 'default' : 'pointer',
          boxShadow: selected
            ? quoteSlot
              ? `0 ${COMPONENT_SIZE.focusOffset}px ${SPACING.standard}px ${theme.glow}`
              : `0 0 0 ${COMPONENT_SIZE.focusOffset}px ${theme.glowStrong}, 0 0 ${SPACING.standard}px ${theme.glow}`
            : 'none',
          ...TYPE.titleMedium,
          fontFamily: quote ? "'IBM Plex Serif', serif" : TYPE.titleMedium.fontFamily,
          fontSize: quote ? '1.02em' : symbolic ? '1em' : TYPE.titleMedium.fontSize,
          fontVariantNumeric: usesTabularNumerals ? 'tabular-nums' : undefined,
          color: piece ? GENERAL.feedbackText : selected ? theme.accentSecondary : GENERAL.slate,
          transition: `background-color ${transition}, border-color ${transition}, box-shadow ${transition}, color ${transition}, transform ${transition}`,
        }}
      >
        <span key={piece?.id ?? 'empty'} className={piece ? pieceClass : undefined}>
          {piece?.label ?? emptyMark}
        </span>
      </button>
    )
  }

  function renderTemplateContent(resolved = false) {
    return String(block.template ?? '')
      .split(/(\{\{\d+\}\})/g)
      .filter(Boolean)
      .map((token, index) => {
        const slotIndex = templateSlotIndex(token)
        if (slotIndex === null) return <span key={`text-${index}`}>{token}</span>

        if (resolved) {
          return (
            <span
              key={`answer-${slotIndex}`}
              style={{
                color: isQuoteLayout ? theme.accentSecondary : GENERAL.feedbackText,
                fontWeight: 600,
              }}
            >
              {answerLabel(block.answer?.[slotIndex])}
            </span>
          )
        }

        return (
          <span key={`slot-${slotIndex}`} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            {renderSlot(slotIndex, {
              inline: true,
              quote: isQuoteLayout,
              symbolic: isExpressionLayout,
            })}
          </span>
        )
      })
  }

  function renderTemplateWorkspace(resolved = false) {
    const TemplateElement = isQuoteLayout ? 'blockquote' : 'div'
    const quoteText = theme.palette?.parchment ?? GENERAL.feedbackText

    return (
      <TemplateElement
        aria-label={!isQuoteLayout ? (block.workspaceLabel ?? 'Expression builder') : undefined}
        style={{
          margin: 0,
          padding: isQuoteLayout
            ? `${SPACING.compact}px 0 ${SPACING.separation}px ${SPACING.compact}px`
            : `${SPACING.separation}px 0`,
          background: 'transparent',
          borderLeft: isQuoteLayout
            ? `${COMPONENT_SIZE.accentRail}px solid ${theme.accent}`
            : undefined,
          borderRadius: 0,
          fontFamily: isQuoteLayout ? "'IBM Plex Serif', serif" : "'Sora', sans-serif",
          fontSize: isQuoteLayout ? 'clamp(19px, 5.3vw, 24px)' : 'clamp(22px, 7vw, 30px)',
          lineHeight: isQuoteLayout ? 1.72 : 1.35,
          fontWeight: isQuoteLayout ? 400 : 600,
          fontVariantNumeric: usesTabularNumerals ? 'tabular-nums' : undefined,
          textAlign: isQuoteLayout ? 'left' : 'center',
          whiteSpace: 'pre-wrap',
          color: isQuoteLayout ? quoteText : GENERAL.feedbackText,
          textShadow: contextImage ? GENERAL.cinematic.actionShadow : undefined,
        }}
      >
        {renderTemplateContent(resolved)}
      </TemplateElement>
    )
  }

  function renderGroup(indexes, label, resolved = false) {
    return (
      <section
        aria-label={label}
        style={{
          minWidth: 0,
          padding: `${SPACING.compact}px 0`,
        }}
      >
        <div style={{ ...TYPE.label, color: theme.accentSecondary, marginBottom: SPACING.compact }}>
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
              {resolved ? (
                <span style={{ ...TYPE.titleMedium, color: GENERAL.feedbackText, textAlign: 'center' }}>
                  {answerLabel(block.answer?.[slotIndex])}
                </span>
              ) : renderSlot(slotIndex, { symbolic: true })}
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

  function renderLinearExpression(resolved = false) {
    const values = resolved ? (block.answer ?? []) : slots

    return (
      <div
        aria-label={resolved ? 'Completed expression' : 'Expression gaps'}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.micro,
          padding: `${SPACING.separation}px 0`,
        }}
      >
        {values.map((value, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.micro,
              flex: resolved ? '0 1 auto' : '1 1 92px',
            }}
          >
            {resolved ? (
              <span style={{ ...TYPE.titleMedium, color: GENERAL.feedbackText }}>
                {answerLabel(value)}
              </span>
            ) : renderSlot(index, { symbolic: true })}
            {index < values.length - 1 && (
              <span aria-hidden="true" style={{ ...TYPE.titleMedium, color: theme.accentSecondary }}>
                {operators[index] || '+'}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderWorkspace(resolved = false) {
    if (usesTemplate) return renderTemplateWorkspace(resolved)

    if (usesReactionLayout) {
      return (
        <div style={{ display: 'grid', gap: SPACING.micro, padding: `${SPACING.compact}px 0` }}>
          {renderGroup(reactantIndexes, groupLabels[0], resolved)}
          <div
            aria-label={block.relationshipLabel ?? 'becomes'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.compact }}
          >
            <div style={{ height: COMPONENT_SIZE.hairline, flex: 1, background: GENERAL.line.faint }} />
            <span aria-hidden="true" style={{ ...TYPE.titleLarge, color: theme.accentSecondary }}>→</span>
            <div style={{ height: COMPONENT_SIZE.hairline, flex: 1, background: GENERAL.line.faint }} />
          </div>
          {renderGroup(productIndexes, groupLabels[1], resolved)}
        </div>
      )
    }

    return renderLinearExpression(resolved)
  }

  const placementHelp = allFilled
    ? 'Everything is placed. Check your answer when ready.'
    : selectedSlot === null
      ? 'Choose a gap, then choose an option.'
      : 'Choose an option for the highlighted gap.'
  const completedInstruction = block.completedInstruction ?? (
    isQuoteLayout
      ? 'You restored the quotation.'
      : usesReactionLayout
        ? 'You built the full relationship.'
        : 'You completed the expression.'
  )
  const successHeading = block.successHeading ?? (
    isQuoteLayout
      ? 'Quotation restored'
      : usesReactionLayout
        ? 'Relationship complete'
        : 'Expression complete'
  )
  const bankLabel = block.bankLabel ?? (
    isQuoteLayout ? 'Word choices' : usesTabularNumerals ? 'Value choices' : 'Choices'
  )
  const incompleteLabel = block.incompleteLabel ?? 'Complete all gaps'

  const stageAtmosphere = contextImage
    ? `linear-gradient(180deg, ${GENERAL.backgroundApp} 0%, transparent 18%, transparent 72%, ${GENERAL.backgroundApp} 100%), linear-gradient(180deg, ${theme.overlay} 0%, ${GENERAL.backgroundApp} 100%), url(${contextImage}) center / cover`
    : `linear-gradient(180deg, ${GENERAL.backgroundApp} 0%, transparent 18%, transparent 74%, ${GENERAL.backgroundApp} 100%), radial-gradient(circle at 18% 24%, ${theme.glow} 0%, transparent 50%), linear-gradient(155deg, ${theme.backgroundSecondary} 0%, ${GENERAL.backgroundApp} 68%)`

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
        .${bankPieceClass}:hover:not(:disabled) {
          color: ${theme.accentSecondary};
          border-color: ${theme.accent};
          background: ${theme.glowStrong};
        }
        .${errorClass} {
          animation: ${namespace}-error 220ms ease both;
        }
        .${resolveClass} {
          animation: ${namespace}-resolve ${GENERAL.cinematic.motion.standard} cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes ${namespace}-piece-in {
          from { opacity: 0; transform: translateY(${SPACING.micro / 2}px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ${namespace}-error {
          0%, 100% { transform: translateX(0); }
          35% { transform: translateX(-${COMPONENT_SIZE.accentRail}px); }
          70% { transform: translateX(${COMPONENT_SIZE.accentRail}px); }
        }
        @keyframes ${namespace}-resolve {
          from { opacity: 0; transform: translateY(${SPACING.micro}px); }
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
        <ScreenTitle>{block.label || 'Complete the builder'}</ScreenTitle>
        <ScreenBody style={{ color: GENERAL.slate, margin: 0 }}>
          {isCompleted ? completedInstruction : instruction}
        </ScreenBody>
      </div>

      <section
        style={{
          position: 'relative',
          overflow: 'visible',
          isolation: 'isolate',
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: `-${SPACING.standard}px`,
            zIndex: 0,
            pointerEvents: 'none',
            background: stageAtmosphere,
            opacity: contextImage ? (block.backgroundOpacity ?? 0.78) : 1,
            filter: contextImage ? 'saturate(.72) contrast(1.04) brightness(.7)' : 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: `${SPACING.separation}px 0 ${SPACING.standard}px`,
          }}
        >
          <div className={isCompleted ? resolveClass : undefined}>
            {renderWorkspace(isCompleted)}
          </div>

          {!isCompleted && canEdit && (
            <div style={{ marginTop: SPACING.compact }}>
              <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: SPACING.compact }}>
                {bankLabel}
              </div>
              <div
                aria-label={bankLabel}
                style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.micro }}
              >
                {available.map(piece => (
                  <button
                    key={piece.id}
                    type="button"
                    className={`${focusClass} ${bankPieceClass}`}
                    onClick={() => place(piece)}
                    style={{
                      minHeight: COMPONENT_SIZE.touchTarget,
                      padding: `0 ${SPACING.compact}px`,
                      background: GENERAL.surfaceTint,
                      border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.strong}`,
                      borderRadius: RADII.pill,
                      ...TYPE.button,
                      fontFamily: isQuoteLayout ? "'IBM Plex Serif', serif" : TYPE.button.fontFamily,
                      fontSize: isQuoteLayout ? '1rem' : TYPE.button.fontSize,
                      fontVariantNumeric: usesTabularNumerals ? 'tabular-nums' : undefined,
                      color: isQuoteLayout
                        ? (theme.palette?.parchment ?? GENERAL.feedbackText)
                        : GENERAL.feedbackText,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: `background-color ${transition}, border-color ${transition}, color ${transition}, transform ${transition}`,
                    }}
                  >
                    {piece.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: COMPONENT_SIZE.hairline,
              height: COMPONENT_SIZE.hairline,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              whiteSpace: 'nowrap',
            }}
          >
            {announcement}
          </div>

          {!isCompleted && canEdit && (
            <div style={{ marginTop: SPACING.standard }}>
              <p style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted, margin: `0 0 ${SPACING.compact}px`, textAlign: 'left' }}>
                {placementHelp}
              </p>
              <button
                type="button"
                className={focusClass}
                onClick={checkAnswer}
                disabled={!allFilled}
                style={{
                  width: '100%',
                  height: BUTTONS.continue.height,
                  padding: `0 ${BUTTONS.continue.paddingX}px`,
                  background: allFilled ? theme.accent : GENERAL.surfaceTint,
                  border: `${COMPONENT_SIZE.hairline}px solid ${allFilled ? theme.accent : GENERAL.line.strong}`,
                  borderRadius: BUTTONS.continue.borderRadius,
                  fontFamily: BUTTONS.continue.fontFamily,
                  fontSize: BUTTONS.continue.fontSize,
                  fontWeight: BUTTONS.continue.fontWeight,
                  color: allFilled ? GENERAL.textOnAccent : GENERAL.cinematic.textSecondary,
                  cursor: allFilled ? 'pointer' : 'default',
                  opacity: 1,
                  boxShadow: allFilled
                    ? `0 0 ${SPACING.standard}px ${theme.glow}`
                    : `inset 0 0 0 ${COMPONENT_SIZE.hairline}px ${GENERAL.line.faint}`,
                  transition: `background-color ${BUTTONS.continue.transition}, border-color ${BUTTONS.continue.transition}, color ${BUTTONS.continue.transition}, box-shadow ${BUTTONS.continue.transition}, transform ${BUTTONS.continue.transition}`,
                }}
              >
                {allFilled ? 'Check answer' : incompleteLabel}
              </button>
            </div>
          )}

          {isReviewing && (
            <div
              role="status"
              className={resolveClass}
              style={{
                marginTop: SPACING.standard,
                borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${GENERAL.feedbackIncorrect}`,
                paddingLeft: SPACING.compact,
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
                  background: 'transparent',
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
            <div className={resolveClass} style={{ marginTop: SPACING.standard }}>
              <div style={{ borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${GENERAL.feedbackCorrect}`, paddingLeft: SPACING.compact }}>
                <div style={{ ...TYPE.titleMedium, color: GENERAL.feedbackCorrect, marginBottom: SPACING.micro }}>
                  {successHeading}
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
                  style={{ marginTop: SPACING.standard }}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
