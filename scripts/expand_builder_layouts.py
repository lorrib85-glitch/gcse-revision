from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'{label} pattern not found')
    return text.replace(old, new, 1)


builder_path = Path('src/components/learning/BuilderBlock.jsx')
builder = builder_path.read_text()

builder = replace_once(
    builder,
    """function answerLabel(answer) {
  if (typeof answer === 'string') return answer
  return answer?.label ?? answer?.text ?? ''
}
""",
    """function answerLabel(answer) {
  if (typeof answer === 'string' || typeof answer === 'number') return String(answer)
  return answer?.label ?? answer?.text ?? ''
}
""",
    'numeric answer support',
)

builder = replace_once(
    builder,
    """function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index)
}
""",
    """function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index)
}

function templateSlotIndex(token) {
  const match = String(token).match(/^\\{\\{(\\d+)\\}\\}$/)
  return match ? Number(match[1]) : null
}
""",
    'template parser helper',
)

builder = replace_once(
    builder,
    """  const hasReactionGroups = arrowIndex >= 0 && arrowIndex < slotCount - 1
  const reactantIndexes = hasReactionGroups ? range(0, arrowIndex + 1) : []
  const productIndexes = hasReactionGroups ? range(arrowIndex + 1, slotCount) : []
  const groupLabels = block.groupLabels ?? ['Reactants', 'Products']
  const instruction = block.instruction ?? (
    hasReactionGroups
      ? `Place each substance under ${groupLabels[0]} or ${groupLabels[1]}.`
      : 'Tap a space, then choose the word or phrase that belongs there.'
  )
""",
    """  const hasReactionGroups = arrowIndex >= 0 && arrowIndex < slotCount - 1
  const requestedLayout = block.layout ?? block.variant
  const layout = requestedLayout ?? (hasReactionGroups ? 'reaction' : 'equation')
  const usesReactionLayout = layout === 'reaction'
  const isQuoteLayout = layout === 'quote' || layout === 'sentence'
  const isMathLayout = layout === 'equation' || layout === 'calculation'
  const usesTemplate = Boolean(block.template) && (isQuoteLayout || isMathLayout)
  const reactantIndexes = hasReactionGroups ? range(0, arrowIndex + 1) : []
  const productIndexes = hasReactionGroups ? range(arrowIndex + 1, slotCount) : []
  const groupLabels = block.groupLabels ?? ['Reactants', 'Products']
  const instruction = block.instruction ?? (
    isQuoteLayout
      ? 'Choose the missing words or phrases to restore the quotation.'
      : isMathLayout && usesTemplate
        ? 'Choose the missing value for each gap in the calculation.'
        : usesReactionLayout
          ? `Place each substance under ${groupLabels[0]} or ${groupLabels[1]}.`
          : 'Tap a space, then choose the word or phrase that belongs there.'
  )
""",
    'layout resolution',
)

builder = replace_once(
    builder,
    """  function slotGroupName(index) {
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
""",
    """  function slotGroupName(index) {
    if (isQuoteLayout) return 'Quotation'
    if (isMathLayout) return 'Calculation'
    if (!hasReactionGroups) return 'Equation'
    return index <= arrowIndex ? groupLabels[0] : groupLabels[1]
  }

  function getSlotAppearance(slotIndex) {
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

    return {
      piece,
      showCorrect,
      showIncorrect,
      selected,
      locked,
      borderColor,
      background: showCorrect ? GENERAL.surfaceTint : GENERAL.backgroundSunken,
      borderStyle: selected || piece ? 'solid' : 'dashed',
      color: piece ? GENERAL.feedbackText : GENERAL.slate,
    }
  }

  function renderSlot(slotIndex, { inline = false, quote = false, maths = false } = {}) {
    const appearance = getSlotAppearance(slotIndex)
    const { piece, showIncorrect, selected, locked, borderColor, background, borderStyle, color } = appearance

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
          width: inline ? 'auto' : '100%',
          minWidth: inline ? (maths ? 64 : 92) : 0,
          minHeight: inline ? COMPONENT_SIZE.touchTarget : BUTTONS.compact.height,
          padding: inline ? `${SPACING.micro}px ${SPACING.compact}px` : `${SPACING.micro}px`,
          background,
          border: `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${borderStyle} ${borderColor}`,
          borderRadius: RADII.small,
          display: inline ? 'inline-flex' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: inline ? 'middle' : undefined,
          margin: inline ? '3px 4px' : undefined,
          cursor: locked ? 'default' : 'pointer',
          boxShadow: selected ? `0 0 0 ${COMPONENT_SIZE.focusOffset}px ${theme.glowStrong}` : 'none',
          ...TYPE.titleMedium,
          fontFamily: quote ? "'IBM Plex Serif', serif" : TYPE.titleMedium.fontFamily,
          fontSize: quote ? '1.02em' : maths ? '1em' : TYPE.titleMedium.fontSize,
          fontVariantNumeric: maths ? 'tabular-nums' : undefined,
          color,
          transition: `background-color ${transition}, border-color ${transition}, box-shadow ${transition}, color ${transition}, transform ${transition}`,
        }}
      >
        <span key={piece?.id ?? 'empty'} className={piece ? pieceClass : undefined}>
          {piece?.label ?? '?'}
        </span>
      </button>
    )
  }
""",
    'adaptive slot renderer',
)

builder = replace_once(
    builder,
    """  function renderResolvedGroup(indexes, label) {
""",
    """  function renderTemplateContent(resolved = false) {
    return String(block.template ?? '')
      .split(/(\\{\\{\\d+\\}\\})/g)
      .filter(Boolean)
      .map((token, index) => {
        const slotIndex = templateSlotIndex(token)
        if (slotIndex === null) return <span key={`text-${index}`}>{token}</span>
        if (resolved) {
          return (
            <span key={`answer-${slotIndex}`} style={{ color: GENERAL.feedbackText, fontWeight: isQuoteLayout ? 600 : 650 }}>
              {answerLabel(block.answer?.[slotIndex])}
            </span>
          )
        }
        return (
          <span key={`slot-${slotIndex}`} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            {renderSlot(slotIndex, { inline: true, quote: isQuoteLayout, maths: isMathLayout })}
          </span>
        )
      })
  }

  function renderTemplateWorkspace(resolved = false) {
    const TemplateElement = isQuoteLayout ? 'blockquote' : 'div'
    const quotePaper = theme.palette?.parchment ?? theme.accentSecondary ?? GENERAL.feedbackText

    return (
      <TemplateElement
        style={{
          margin: 0,
          padding: isQuoteLayout ? `${SPACING.standard}px ${SPACING.compact}px` : SPACING.standard,
          background: isQuoteLayout ? theme.backgroundSecondary : 'transparent',
          borderLeft: isQuoteLayout ? `${COMPONENT_SIZE.accentRail}px solid ${theme.accent}` : undefined,
          borderRadius: isQuoteLayout ? RADII.small : 0,
          fontFamily: isQuoteLayout ? "'IBM Plex Serif', serif" : "'Sora', sans-serif",
          fontSize: isQuoteLayout ? 'clamp(19px, 5.3vw, 24px)' : 'clamp(22px, 7vw, 30px)',
          lineHeight: isQuoteLayout ? 1.65 : 1.35,
          fontWeight: isQuoteLayout ? 400 : 600,
          fontVariantNumeric: isMathLayout ? 'tabular-nums' : undefined,
          textAlign: isMathLayout ? 'center' : 'left',
          whiteSpace: 'pre-wrap',
          color: isQuoteLayout ? quotePaper : GENERAL.feedbackText,
        }}
      >
        {renderTemplateContent(resolved)}
      </TemplateElement>
    )
  }

  function renderResolvedGroup(indexes, label) {
""",
    'template workspace renderer',
)

builder = replace_once(
    builder,
    """  function renderResolvedEquation() {
    const spokenEquation = (block.answer ?? [])
      .map((answer, index) => `${answerLabel(answer)}${index < slotCount - 1 ? ` ${operators[index] || '+'} ` : ''}`)
      .join('')

    return (
""",
    """  function renderResolvedEquation() {
    const spokenEquation = usesTemplate
      ? String(block.template).replace(/\\{\\{(\\d+)\\}\\}/g, (_, index) => answerLabel(block.answer?.[Number(index)]))
      : (block.answer ?? [])
        .map((answer, index) => `${answerLabel(answer)}${index < slotCount - 1 ? ` ${operators[index] || '+'} ` : ''}`)
        .join('')

    if (usesTemplate) {
      return (
        <div
          className={resolveClass}
          role="status"
          aria-label={`Completed ${isQuoteLayout ? 'quotation' : 'calculation'}: ${spokenEquation}`}
          style={{
            background: GENERAL.backgroundSunken,
            border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
            borderRadius: RADII.medium,
            padding: SPACING.compact,
          }}
        >
          {renderTemplateWorkspace(true)}
        </div>
      )
    }

    return (
""",
    'resolved template output',
)

builder = replace_once(
    builder,
    """        {hasReactionGroups ? (
""",
    """        {usesReactionLayout ? (
""",
    'resolved reaction switch',
)

builder = replace_once(
    builder,
    """  const placementHelp = allFilled
    ? 'Everything is placed. Check your answer when ready.'
    : selectedSlot === null
      ? 'Choose a space, then choose a word.'
      : `Space ${selectedSlot + 1} is selected. Choose a word from the bank.`

  const atmosphereBackground = contextImage
""",
    """  const placementHelp = allFilled
    ? 'Everything is placed. Check your answer when ready.'
    : selectedSlot === null
      ? 'Choose a space, then choose an option.'
      : `Space ${selectedSlot + 1} is selected. Choose an option from the bank.`
  const completedInstruction = block.completedInstruction ?? (
    isQuoteLayout
      ? 'You restored the quotation.'
      : isMathLayout
        ? 'You completed the calculation.'
        : 'You built the full relationship.'
  )
  const successHeading = block.successHeading ?? (
    isQuoteLayout ? 'Quotation restored' : isMathLayout ? 'Calculation complete' : 'Equation complete'
  )
  const bankLabel = block.bankLabel ?? (isQuoteLayout ? 'Word choices' : isMathLayout ? 'Number choices' : 'Word bank')
  const incompleteLabel = block.incompleteLabel ?? (isQuoteLayout ? 'Complete all gaps' : 'Complete all spaces')

  const atmosphereBackground = contextImage
""",
    'adaptive labels',
)

builder = replace_once(
    builder,
    """          {isCompleted ? 'You built the full relationship.' : instruction}
""",
    """          {isCompleted ? completedInstruction : instruction}
""",
    'completed instruction',
)

builder = replace_once(
    builder,
    """                  Equation complete
""",
    """                  {successHeading}
""",
    'success heading',
)

builder = replace_once(
    builder,
    """                {hasReactionGroups ? (
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
""",
    """                {usesTemplate ? renderTemplateWorkspace() : usesReactionLayout ? (
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
""",
    'interactive layout switch',
)

builder = replace_once(
    builder,
    """                  aria-label="Word bank"
""",
    """                  aria-label={bankLabel}
""",
    'adaptive bank label',
)

builder = replace_once(
    builder,
    """                        background: GENERAL.surfaceTint,
                        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
                        borderRadius: RADII.small,
                        ...TYPE.button,
                        color: GENERAL.feedbackText,
""",
    """                        background: isQuoteLayout ? theme.backgroundSecondary : GENERAL.surfaceTint,
                        border: `${COMPONENT_SIZE.hairline}px solid ${isQuoteLayout ? theme.glowStrong : GENERAL.line.soft}`,
                        borderRadius: RADII.small,
                        ...TYPE.button,
                        fontFamily: isQuoteLayout ? "'IBM Plex Serif', serif" : TYPE.button.fontFamily,
                        fontSize: isQuoteLayout ? '1rem' : TYPE.button.fontSize,
                        fontVariantNumeric: isMathLayout ? 'tabular-nums' : undefined,
                        color: isQuoteLayout ? (theme.palette?.parchment ?? GENERAL.feedbackText) : GENERAL.feedbackText,
""",
    'subject-specific bank styling',
)

builder = replace_once(
    builder,
    """                      {allFilled ? 'Check answer' : 'Complete all spaces'}
""",
    """                      {allFilled ? 'Check answer' : incompleteLabel}
""",
    'adaptive incomplete label',
)

builder_path.write_text(builder)


fixtures_path = Path('src/dev/componentReview/fixtures.js')
fixtures = fixtures_path.read_text()
fixtures = replace_once(
    fixtures,
    """export const builderBlock = {
  label: 'Build the photosynthesis equation',
  slots: [null, null, null, null],
  operators: ['+', '→', '+'],
  pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
  answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
  hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
  successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
}
""",
    """export const builderBlock = {
  layout: 'reaction',
  label: 'Build the photosynthesis equation',
  slots: [null, null, null, null],
  operators: ['+', '→', '+'],
  pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
  answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
  hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
  successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
}

export const builderMaths = {
  layout: 'equation',
  label: 'Complete the calculation',
  instruction: 'Choose the missing value.',
  template: '36 ÷ {{0}} = 6',
  slots: [null],
  pieces: [4, 6, 8, 12],
  answer: [6],
  hint: 'Use the inverse: which number multiplied by 6 gives 36?',
  successText: '36 ÷ 6 = 6, because 6 × 6 = 36.',
}

export const builderQuote = {
  layout: 'quote',
  label: 'Rebuild the quotation',
  instruction: 'Choose the missing words to restore Macbeth’s line.',
  template: '“Is this a {{0}} which I see before me,\\nThe {{1}} toward my hand?”',
  slots: [null, null],
  pieces: ['dagger', 'handle', 'crown', 'blood'],
  answer: ['dagger', 'handle'],
  hint: 'Picture the object Macbeth thinks he can see and the part pointing towards him.',
  successText: 'The completed quotation is ready to use as evidence about Macbeth’s disturbed state of mind.',
}
""",
    'adaptive BuilderBlock fixtures',
)
fixtures_path.write_text(fixtures)


manifest_path = Path('src/dev/componentReview/reviewManifest.jsx')
manifest = manifest_path.read_text()
manifest = replace_once(
    manifest,
    """  {
    id: 'builder-block', name: 'BuilderBlock', group: 'group2',
    status: 'one-off', subject: 'Biology', renderMode: 'inline',
    function: 'Tap-to-fill equation builder: place word pieces into ordered slots to construct an equation, then check — with distractor pieces and a hint on a wrong answer.',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: builder. Extracted from an inline definition in ModulePlayer into a standalone component.',
    alternative: 'FillInTheBlanksBlock (inline gaps); ColSortBlock.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
    fixture: FIX.builderBlock,
  },
""",
    """  {
    id: 'builder-block', name: 'BuilderBlock — reaction', group: 'library',
    status: 'comparison', subject: 'Biology', renderMode: 'inline',
    function: 'Reusable select-and-place builder with a reaction layout for grouped inputs and outputs.',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: builder. The same engine now supports calculations and quotations through data-driven layouts.',
    alternative: 'FillInTheBlanksBlock (inline typed gaps); ColSortBlock.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
    fixture: FIX.builderBlock,
  },
  {
    id: 'builder-block-maths', name: 'BuilderBlock — Maths', group: 'library',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Missing-value calculation builder with fixed mathematical notation, compact number pieces and tabular numerals.',
    usage: 'Reusable BuilderBlock layout: equation. Demonstrates the same repair-first interaction without forcing Maths into the science reaction structure.',
    alternative: 'FillInTheBlanksBlock for typed answers; WorkedExample for explained methods.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Maths" onComplete={onDone} />,
    fixture: FIX.builderMaths,
  },
  {
    id: 'builder-block-quote', name: 'BuilderBlock — quote', group: 'library',
    status: 'comparison', subject: 'English', renderMode: 'inline',
    function: 'Quotation reconstruction layout with preserved line breaks, inline gaps and literary serif treatment.',
    usage: 'Reusable BuilderBlock layout: quote. Designed for short, high-value quotation recall rather than long paragraph completion.',
    alternative: 'FillInTheBlanksBlock for ordinary prose; QuoteAnalyser for deeper analysis after recall.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="English" onComplete={onDone} />,
    fixture: FIX.builderQuote,
  },
""",
    'adaptive BuilderBlock review entries',
)
manifest_path.write_text(manifest)
