// ─── CalculationBreakdown — shared presentational parts ──────────────────────
//
// Extracted from CalculationBreakdown.jsx unchanged so the standard
// walkthrough and the algebra presentations share one set of primitives rather
// than growing two. Nothing here holds sequence state — these are pure display
// pieces the phases and scenes compose.

import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { MOTION } from '../../../constants/motion.js'
import ContinueCTA from '../../core/ContinueCTA.jsx'

export const bodyStyle = {
  ...TYPE.bodySmall,
  color: GENERAL.cinematic.textSecondary,
  margin: 0,
}

/**
 * A single mathematical line. `size` stays numeric because a worked step, a
 * hero equation and a summary row are deliberately three different weights of
 * the same voice; the font family is the canonical TYPE family rather than a
 * local literal.
 */
export function MathLine({ expr, size = 22, accent, align = 'center', muted = false, wrap = false }) {
  if (!expr) return null
  return (
    <div style={{
      fontFamily: TYPE.body.fontFamily,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.35,
      textAlign: align,
      color: muted ? GENERAL.cinematic.textMuted : accent || GENERAL.cinematic.textPrimary,
      whiteSpace: wrap ? 'normal' : 'nowrap',
      overflowWrap: wrap ? 'anywhere' : 'normal',
    }}>
      {expr}
    </div>
  )
}

export function SectionHeading({ children }) {
  return (
    <h3 style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, margin: `0 0 ${SPACING.micro}px` }}>
      {children}
    </h3>
  )
}

export function WhyCallout({ label, accent, children }) {
  return (
    <div style={whyCallout(accent)}>
      <Lightbulb accent={accent} />
      <div>
        <div style={{ ...TYPE.label, color: accent, marginBottom: 3 }}>{label}</div>
        <p style={bodyStyle}>{children}</p>
      </div>
    </div>
  )
}

export function ChoiceButton({
  label,
  index,
  isCorrect,
  isWrong,
  isSelected = false,
  accent,
  mono = false,
  disabled,
  onClick,
  statusLabel,
  ariaLabel,
}) {
  const border = isCorrect
    ? accent
    : isWrong
      ? GENERAL.feedbackIncorrect
      : isSelected
        ? accent
        : GENERAL.line.strong
  const background = isCorrect
    ? `${accent}18`
    : isWrong
      ? `rgba(${GENERAL.feedbackIncorrectRgb},0.1)`
      : isSelected
        ? GENERAL.line.faint
        : GENERAL.surfaceTint

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={onClick && !isCorrect && !isWrong ? isSelected : undefined}
      aria-label={ariaLabel}
      style={{
        ...choiceRow,
        borderColor: border,
        background,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <span style={choiceBadge(isCorrect || isWrong || isSelected ? border : GENERAL.cinematic.textMuted)}>
        {String.fromCharCode(65 + index)}
      </span>
      <span style={{
        ...(mono ? { ...TYPE.body, fontStyle: 'italic' } : TYPE.body),
        color: GENERAL.cinematic.textPrimary,
        flex: 1,
        textAlign: 'left',
        minWidth: 0,
      }}>
        {label}
      </span>
      {/* Shape and text carry the verdict as well as colour. */}
      {isCorrect && <Check accent={accent} />}
      {isWrong && <Cross accent={GENERAL.feedbackIncorrect} />}
      {statusLabel && (
        <span style={{ ...TYPE.caption, color: border, flexShrink: 0 }}>{statusLabel}</span>
      )}
    </button>
  )
}

export function PhaseActions({ onContinue, onBack, accent, label = 'Continue', disabled = false, backLabel = 'Review previous step' }) {
  return (
    <div style={actionsStyle}>
      <ContinueCTA
        onClick={onContinue}
        accent={accent}
        label={label}
        disabled={disabled}
      />
      {onBack && (
        <button type="button" onClick={onBack} style={previousButtonStyle}>
          {backLabel}
        </button>
      )}
    </div>
  )
}

// ─── The shared "why" contract ───────────────────────────────────────────────
//
// The five questions any algebra step should be able to answer. Authored
// content supplies whichever of them it can; the algebra presentations derive
// sensible defaults from their model. Order is fixed so the reasoning reads
// the same way everywhere, and it stays on screen after the procedural
// scaffolding has faded.
export const REASONING_LABELS = Object.freeze([
  ['structure', 'What the algebra means'],
  ['goal', 'What we are trying to achieve'],
  ['inverse', 'Which operation undoes it'],
  ['equality', 'Why both sides'],
  ['check', 'How to check it'],
])

export function reasoningToItems(reasoning) {
  if (!reasoning || typeof reasoning !== 'object') return []
  return REASONING_LABELS
    .filter(([key]) => typeof reasoning[key] === 'string' && reasoning[key].trim())
    .map(([key, label]) => ({ key, label, text: reasoning[key] }))
}

export function ReasoningPanel({ items, accent, title = 'Why this works', style }) {
  if (!items?.length) return null

  return (
    <section
      aria-label={title}
      style={{
        padding: `${SPACING.compact}px`,
        borderRadius: RADII.medium,
        border: `1px solid ${GENERAL.line.soft}`,
        borderLeft: `2px solid ${accent}`,
        background: GENERAL.surfaceTint,
        ...style,
      }}
    >
      <h3 style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>{title}</h3>
      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
        {items.map(item => (
          <div key={item.key}>
            <dt style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted }}>{item.label}</dt>
            <dd style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, margin: 0 }}>{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// ─── Inline icons ─────────────────────────────────────────────────────────────
export const ChevronDown = ({ accent }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
)

export const Arrow = ({ accent }) => (
  <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
)

export const Check = ({ accent }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
)

export const Cross = ({ accent }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)

export const Target = ({ accent }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
)

export const Lightbulb = ({ accent }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2a7 7 0 0 0-4-12z" /></svg>
)

// ─── Shared styles ───────────────────────────────────────────────────────────
export const stageHeaderStyle = {
  padding: `${SPACING.standard}px ${SPACING.standard}px 0`,
}

export const actionsStyle = {
  padding: `${SPACING.standard}px`,
  borderTop: `1px solid ${GENERAL.line.soft}`,
}

export const previousButtonStyle = {
  ...TYPE.bodySmall,
  display: 'block',
  width: '100%',
  marginTop: SPACING.compact,
  minHeight: COMPONENT_SIZE.touchTarget,
  padding: SPACING.micro,
  color: GENERAL.cinematic.textMuted,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
}

export const choiceListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.micro,
}

export const choiceRow = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.compact,
  width: '100%',
  minHeight: 54,
  border: '1px solid',
  borderRadius: RADII.medium,
  padding: `${SPACING.micro}px ${SPACING.compact}px`,
  transition: `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}, background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
}

export const choiceBadge = borderColor => ({
  ...TYPE.caption,
  fontWeight: 700,
  width: 24,
  height: 24,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: RADII.pill,
  border: `1px solid ${borderColor}`,
  color: borderColor,
})

export function whyCallout(accent) {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.compact,
    marginTop: SPACING.standard,
    paddingLeft: SPACING.compact,
    borderLeft: `2px solid ${accent}`,
  }
}

export function opTag(accent) {
  return {
    fontFamily: TYPE.body.fontFamily,
    fontSize: 16,
    fontWeight: 500,
    color: accent,
    minWidth: 42,
    textAlign: 'center',
  }
}
