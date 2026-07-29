// ─── CalculationBreakdown — shared algebra figures ───────────────────────────
//
// Lightweight CSS/SVG figures, sized to stay readable and contained at 320px.
// No photorealism, no decorative depth: a counter is a small square with a
// visible outline, an x group is a labelled container, and the only motion is
// a short settle when a counter joins a group.
//
// Grouped and ungrouped counters differ in fill, outline AND grouping label —
// colour is never the only carrier of state.

import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { MOTION } from '../../../constants/motion.js'
import { formatTerm } from './calculationBreakdownMath.js'

const COUNTER_SIZE = 16
const COUNTER_SIZE_SMALL = 12

/** N labelled containers standing for N lots of the variable. */
export function VariableGroups({
  variable,
  count,
  roles,
  braceLabel,
  highlightIndex = null,
  size = 'standard',
}) {
  const boxSize = size === 'compact' ? 40 : 48

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.micro }}>
      <div
        style={{ display: 'flex', gap: SPACING.micro, flexWrap: 'wrap', justifyContent: 'center' }}
        data-cb-variable-groups={count}
      >
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            data-cb-variable-group={index}
            aria-hidden="true"
            style={{
              width: boxSize,
              height: boxSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RADII.small,
              border: `1px solid ${highlightIndex === index ? roles.operationActive : roles.groupContainer}`,
              background: highlightIndex === index ? roles.operationActiveSoft : roles.groupContainerSoft,
              fontFamily: TYPE.body.fontFamily,
              fontSize: 19,
              fontWeight: 500,
              fontStyle: 'italic',
              color: roles.textPrimary,
            }}
          >
            {variable}
          </div>
        ))}
      </div>
      {braceLabel && (
        <div style={{ ...TYPE.caption, color: roles.textMuted, textAlign: 'center' }}>{braceLabel}</div>
      )}
      <span style={visuallyHidden}>
        {`${count} equal ${count === 1 ? 'group' : 'groups'} of ${variable}, written ${formatTerm(count, variable)}`}
      </span>
    </div>
  )
}

/**
 * A field of counters. `grouped` counters read as belonging to a share — they
 * are filled and solid-outlined where loose counters are tinted and dashed.
 */
export function CounterField({
  count,
  roles,
  grouped = false,
  small = false,
  label,
  // Four across keeps the field narrow enough to sit beside an x-group model
  // at 390px instead of pushing it onto its own row.
  maxPerRow = 4,
}) {
  const size = small ? COUNTER_SIZE_SMALL : COUNTER_SIZE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.micro }}>
      <div
        data-cb-counter-field={count}
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(maxPerRow, Math.max(count, 1))}, ${size}px)`,
          gap: small ? 4 : 6,
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: count }, (_, index) => (
          <Counter key={index} size={size} roles={roles} grouped={grouped} />
        ))}
      </div>
      {label && <div style={{ ...TYPE.caption, color: roles.textMuted }}>{label}</div>}
      <span style={visuallyHidden}>{`${count} ${grouped ? 'shared' : 'loose'} ${count === 1 ? 'counter' : 'counters'}`}</span>
    </div>
  )
}

export function Counter({ size = COUNTER_SIZE, roles, grouped = false, style }) {
  return (
    <span
      data-cb-counter={grouped ? 'grouped' : 'loose'}
      style={{
        width: size,
        height: size,
        display: 'block',
        borderRadius: 4,
        border: grouped
          ? `1px solid ${roles.counterGrouped}`
          : `1px dashed ${roles.counter}`,
        background: grouped ? roles.counterGroupedSoft : roles.counterSoft,
        transition: `background ${MOTION.duration.fast} ${MOTION.easing.standard}, border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
        ...style,
      }}
    />
  )
}

/** The `=` between two sides of a model, with the sides named for screen readers. */
export function EqualsMark({ roles }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: TYPE.body.fontFamily,
        fontSize: 22,
        fontWeight: 500,
        color: roles.equationMuted,
        flexShrink: 0,
      }}
    >
      =
    </span>
  )
}

/**
 * Left model | = | right model.
 *
 * Deliberately switches to a stacked layout on the narrowest screens rather
 * than letting flex-wrap decide: a partial wrap strands the `=` at the end of
 * the first row, where it reads as punctuation instead of a relationship.
 * Stacked, the equals sits centred between the two models and still says the
 * same thing.
 */
export function ModelPair({ left, right, roles, leftLabel = 'Left side', rightLabel = 'Right side' }) {
  return (
    <div className="cb-model-pair-scope">
      {/* A container query, not a media query: the pair has to respond to the
          space it is actually given (a 320px screen, a narrower preview frame),
          not to the viewport. Where @container is unsupported the stacked
          default applies, which is the safe layout at any width. */}
      <style>{`
        .cb-model-pair-scope { container-type: inline-size; width: 100%; }
        .cb-model-pair {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: ${SPACING.compact}px;
          width: 100%;
        }
        @container (min-width: 250px) {
          .cb-model-pair { flex-direction: row; }
        }
      `}</style>
      <div className="cb-model-pair">
        <figure style={pairSideStyle}>
          {left}
          <figcaption style={{ ...TYPE.caption, color: roles.textMuted }}>{leftLabel}</figcaption>
        </figure>
        <EqualsMark roles={roles} />
        <figure style={pairSideStyle}>
          {right}
          <figcaption style={{ ...TYPE.caption, color: roles.textMuted }}>{rightLabel}</figcaption>
        </figure>
      </div>
    </div>
  )
}

/** Group zones for a share-into-equal-groups model. */
export function GroupZones({ counts, roles, variable, expected = null }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${counts.length}, minmax(0, 1fr))`,
        gap: SPACING.micro,
        width: '100%',
      }}
      data-cb-group-zones={counts.length}
    >
      {counts.map((count, index) => {
        const complete = expected !== null && count === expected
        return (
          <div
            key={index}
            data-cb-group-zone={index}
            data-cb-group-count={count}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              minHeight: 92,
              padding: `${SPACING.micro}px 4px`,
              borderRadius: RADII.small,
              border: `1px ${complete ? 'solid' : 'dashed'} ${complete ? roles.counterGrouped : roles.lineStrong}`,
              background: complete ? roles.counterGroupedSoft : roles.surface,
            }}
          >
            <span style={{ ...TYPE.caption, color: roles.textMuted }}>
              {variable ? `${variable} ${index + 1}` : `Group ${index + 1}`}
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 12px)',
              gap: 4,
              justifyContent: 'center',
            }} aria-hidden="true">
              {Array.from({ length: count }, (_, counterIndex) => (
                <Counter key={counterIndex} size={COUNTER_SIZE_SMALL} roles={roles} grouped />
              ))}
            </div>
            <span style={{ ...TYPE.caption, fontWeight: 700, color: complete ? roles.counterGrouped : roles.textSecondary }}>
              {count}
            </span>
            <span style={visuallyHidden}>
              {`Group ${index + 1} holds ${count} ${count === 1 ? 'counter' : 'counters'}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export const figureFrame = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: SPACING.compact,
  width: '100%',
  padding: `${SPACING.standard}px ${SPACING.compact}px`,
  borderRadius: RADII.medium,
  border: `1px solid ${GENERAL.line.soft}`,
  background: GENERAL.backgroundSunken,
  boxSizing: 'border-box',
}

const pairSideStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: SPACING.micro,
  margin: 0,
  minWidth: 0,
}

export const TOUCH_TARGET = COMPONENT_SIZE.touchTarget
