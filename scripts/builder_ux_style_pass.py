from pathlib import Path

path = Path('src/components/learning/BuilderBlock.jsx')
text = path.read_text()


def replace_once(old, new, label):
    global text
    if old not in text:
        raise SystemExit(f'{label} pattern not found')
    text = text.replace(old, new, 1)


replace_once(
    """    const borderColor = showCorrect
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
""",
    """    const borderColor = showCorrect
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
""",
    'slot state styling',
)

replace_once(
    """          border: `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${piece ? 'solid' : 'dashed'} ${borderColor}`,
          borderRadius: RADII.small,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: locked ? 'default' : 'pointer',
          ...TYPE.titleMedium,
          color: piece ? GENERAL.feedbackText : GENERAL.neutral[300],
          transition: `background-color ${transition}, border-color ${transition}, color ${transition}, transform ${transition}`,
""",
    """          border: `${selected ? COMPONENT_SIZE.focusRing : COMPONENT_SIZE.hairline}px ${borderStyle} ${borderColor}`,
          borderRadius: RADII.small,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: locked ? 'default' : 'pointer',
          boxShadow: selected ? `0 0 0 ${COMPONENT_SIZE.focusOffset}px ${theme.glowStrong}` : 'none',
          ...TYPE.titleMedium,
          color: slotTextColor,
          transition: `background-color ${transition}, border-color ${transition}, box-shadow ${transition}, color ${transition}, transform ${transition}`,
""",
    'slot control styling',
)

replace_once(
    """  const atmosphereBackground = contextImage
    ? `linear-gradient(180deg, rgba(${theme.accentRgb},0.06) 0%, ${GENERAL.backgroundSurface} 100%), url(${contextImage}) center / cover`
    : `radial-gradient(circle at 12% 0%, rgba(${theme.accentRgb},0.14), transparent 48%), radial-gradient(circle at 88% 8%, rgba(${theme.accentRgb},0.07), transparent 42%)`
""",
    """  const atmosphereBackground = contextImage
    ? `linear-gradient(180deg, ${theme.overlay} 0%, ${GENERAL.backgroundSurface} 100%), url(${contextImage}) center / cover`
    : `radial-gradient(circle at 18% -8%, ${theme.glow} 0%, transparent 58%), linear-gradient(180deg, ${theme.backgroundSecondary} 0%, transparent 100%)`
""",
    'atmosphere styling',
)

replace_once(
    """          border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
          borderRadius: RADII.large,
""",
    """          border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
          borderRadius: RADII.large,
""",
    'outer border',
)

replace_once(
    """            height: 168,
            zIndex: 0,
            pointerEvents: 'none',
            background: atmosphereBackground,
            opacity: contextImage ? 0.34 : 1,
            filter: contextImage ? 'saturate(.7) contrast(.9)' : 'none',
""",
    """            height: SPACING.cinematic * 2,
            zIndex: 0,
            pointerEvents: 'none',
            background: atmosphereBackground,
            opacity: contextImage ? 0.34 : 1,
            filter: contextImage ? 'saturate(.8) contrast(.95)' : 'none',
""",
    'atmosphere layer',
)

replace_once(
    """          <header style={{ marginBottom: SPACING.standard }}>
""",
    """          <header style={{ marginBottom: SPACING.compact }}>
""",
    'header spacing',
)

replace_once(
    """              <div style={{ marginBottom: SPACING.standard }}>
                {hasReactionGroups ? (
                  <div style={{ display: 'grid', gap: SPACING.compact }}>
                    {renderGroup(reactantIndexes, groupLabels[0])}
                    <div
                      aria-label="becomes"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.micro }}
                    >
                      <span aria-hidden="true" style={{ ...TYPE.titleLarge, color: theme.accent }}>→</span>
                      <span style={{ ...TYPE.caption, color: GENERAL.slate }}>becomes</span>
                    </div>
                    {renderGroup(productIndexes, groupLabels[1])}
                  </div>
                ) : renderLinearEquation()}
              </div>
""",
    """              <div
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
""",
    'equation stage',
)

replace_once(
    """                        minHeight: BUTTONS.compact.height,
                        padding: `0 ${BUTTONS.compact.paddingX}px`,
                        background: GENERAL.backgroundSunken,
                        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.medium}`,
                        borderRadius: RADII.small,
""",
    """                        minHeight: COMPONENT_SIZE.touchTarget,
                        padding: `0 ${SPACING.compact}px`,
                        background: GENERAL.surfaceTint,
                        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
                        borderRadius: RADII.small,
""",
    'word bank styling',
)

replace_once(
    """              <div
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
""",
    """              <div
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
""",
    'action area styling',
)

path.write_text(text)
