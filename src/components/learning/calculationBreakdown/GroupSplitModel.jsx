// ─── Group Split Explorer ────────────────────────────────────────────────────
//
// A coefficient made concrete: the learner shares the total into equal groups
// one counter at a time and watches "divide by 3" become something they have
// actually done.
//
// Counters are conserved by construction — the only state is how many have
// been dealt, and loose plus grouped always equals the total, so no counter
// can be lost or duplicated by a mis-tap.
//
// Dealing is never drag-only: every counter is a real button, and one action
// deals the whole set for anyone who would rather not tap eighteen times.

import { TYPE } from '../../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { MOTION } from '../../../constants/motion.js'
import { GENERAL } from '../../../constants/generalTheme.js'
import {
  countersByGroup,
  dealCounterToGroup,
  describeInverseRelationship,
  formatEquation,
  formatNumber,
  formatOperation,
  formatTerm,
  splitIntoEqualGroups,
} from './calculationBreakdownMath.js'
import { MathLine, bodyStyle } from './calculationBreakdownParts.jsx'
import {
  Counter,
  CounterField,
  GroupZones,
  ModelPair,
  VariableGroups,
  figureFrame,
  visuallyHidden,
} from './calculationBreakdownFigures.jsx'

export function buildGroupSplitScenes({ model, reasoning, roles, accent }) {
  const { variable, groupCount, total, solution } = model
  const term = formatTerm(groupCount, variable)
  const equation = formatEquation(term, formatNumber(total))
  const split = splitIntoEqualGroups(total, groupCount)
  const undo = formatOperation({ type: 'divide', value: groupCount })

  const why = {
    goal: reasoning?.goal ?? `Find what one ${variable} is worth.`,
    structure: reasoning?.structure ?? `${term} means ${groupCount} equal groups of ${variable}, and those groups are worth ${formatNumber(total)} altogether.`,
    inverse: reasoning?.inverse ?? describeInverseRelationship({ type: 'multiply', value: groupCount }),
    equality: reasoning?.equality ?? `${undo.bothSides} — the ${groupCount} groups become one group, and ${formatNumber(total)} becomes ${formatNumber(solution)}.`,
    check: reasoning?.check ?? `Substitute ${variable} = ${formatNumber(solution)}: ${groupCount} × ${formatNumber(solution)} = ${formatNumber(total)}.`,
  }

  return [
    {
      id: 'read',
      label: 'Read the equation',
      heading: `${equation}`,
      intro: `${groupCount} equal groups of ${variable} are worth ${formatNumber(total)} between them.`,
      announce: `Scene 1 of 3. ${groupCount} equal groups of ${variable} are worth ${formatNumber(total)} altogether.`,
      summary: `${term} means ${groupCount} equal groups worth ${formatNumber(total)} in total.`,
      reasoning: [{ key: 'structure', label: 'What the algebra means', text: why.structure }],
      render: () => (
        <div style={figureFrame}>
          <ModelPair
            roles={roles}
            leftLabel={`${groupCount} groups of ${variable}`}
            rightLabel={`${formatNumber(total)} counters`}
            left={<VariableGroups variable={variable} count={groupCount} roles={roles} size="compact" />}
            right={<CounterField count={total} roles={roles} />}
          />
          <p style={{ ...bodyStyle, textAlign: 'center' }}>
            {`Every group holds the same amount. Finding one group means sharing the ${formatNumber(total)} counters equally between them.`}
          </p>
        </div>
      ),
    },

    {
      id: 'share',
      label: 'Share them out',
      heading: `Share ${formatNumber(total)} into ${groupCount} equal groups`,
      intro: 'Tap a counter to deal it into the next group, or deal them all at once.',
      announce: `Scene 2 of 3. Share ${formatNumber(total)} counters into ${groupCount} equal groups.`,
      summary: `${formatNumber(total)} shared equally between ${groupCount} groups gives ${formatNumber(solution)} in each.`,
      requiresDecision: true,
      initialState: { dealt: 0 },
      reasoning: [{ key: 'goal', label: 'What we are trying to achieve', text: why.goal }],
      render: ({ state, setState, resolved, resolve, announce, prefersReducedMotion }) => (
        <SharingBoard
          equation={equation}
          groupCount={groupCount}
          total={total}
          perGroup={split.perGroup}
          dealt={state.dealt ?? 0}
          onDeal={next => {
            setState({ dealt: next })
            if (next === total) {
              announce(`All ${formatNumber(total)} counters shared. Each group holds ${formatNumber(split.perGroup)}.`)
              resolve()
            } else {
              const group = dealCounterToGroup(next - 1, groupCount) + 1
              announce(`Counter dealt to group ${group}. ${formatNumber(total - next)} left to share.`)
            }
          }}
          resolved={resolved}
          roles={roles}
          accent={accent}
          prefersReducedMotion={prefersReducedMotion}
        />
      ),
    },

    {
      id: 'reveal',
      label: 'Reveal and check',
      heading: `${variable} = ${formatNumber(solution)}`,
      intro: `Every group holds the same ${formatNumber(solution)} counters, and one group is one ${variable}.`,
      announce: `Scene 3 of 3. ${variable} equals ${formatNumber(solution)}. Checking: ${groupCount} times ${formatNumber(solution)} equals ${formatNumber(total)}.`,
      continueLabel: 'Next challenge',
      reasoning: [
        { key: 'inverse', label: 'Which operation undoes it', text: why.inverse },
        { key: 'equality', label: 'Why both sides', text: why.equality },
        { key: 'check', label: 'How to check it', text: why.check },
      ],
      render: () => (
        <div style={figureFrame}>
          <MathLine
            expr={`${term} ÷ ${groupCount} = ${formatNumber(total)} ÷ ${groupCount}`}
            size={20}
            accent={roles.equationMuted}
            wrap
          />
          <ModelPair
            roles={roles}
            leftLabel={`One ${variable}`}
            rightLabel={`${formatNumber(solution)} counters`}
            left={<VariableGroups variable={variable} count={1} roles={roles} size="compact" />}
            right={<CounterField count={solution} roles={roles} grouped />}
          />
          <MathLine expr={`${variable} = ${formatNumber(solution)}`} size={30} accent={roles.equationAccent} />
          <div style={{ width: '100%', paddingTop: SPACING.compact, borderTop: `1px solid ${roles.line}` }}>
            <p style={{ ...TYPE.label, color: accent, margin: 0 }}>Check by substituting</p>
            <div style={{ marginTop: SPACING.micro }}>
              <MathLine
                expr={`${groupCount} × ${formatNumber(solution)} = ${formatNumber(total)}`}
                size={22}
                accent={roles.equationPrimary}
              />
            </div>
          </div>
        </div>
      ),
    },
  ]
}

function SharingBoard({
  equation,
  groupCount,
  total,
  perGroup,
  dealt,
  onDeal,
  resolved,
  roles,
  accent,
  prefersReducedMotion,
}) {
  const loose = total - dealt
  const groups = countersByGroup(dealt, groupCount)
  const nextIndex = dealCounterToGroup(dealt, groupCount)
  const nextGroup = nextIndex + 1

  return (
    <div style={figureFrame}>
      {/* The algebra stays on screen while the sharing happens. Without it the
          learner is moving counters around with nothing to connect the action
          back to the equation it stands for. */}
      <MathLine expr={equation} size={24} accent={roles.equationAccent} />

      <div style={{ width: '100%' }}>
        <div style={{ ...TYPE.caption, color: roles.textMuted, marginBottom: SPACING.micro }}>
          {loose > 0 ? `${loose} still to share` : 'All counters shared'}
        </div>

        {loose > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${COMPONENT_SIZE.touchTarget}px, 1fr))`,
              gap: 4,
              width: '100%',
            }}
          >
            {Array.from({ length: loose }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onDeal(dealt + 1)}
                aria-label={`Deal a counter into group ${nextGroup}. ${loose} counters left to share.`}
                style={{
                  minWidth: COMPONENT_SIZE.touchTarget,
                  minHeight: COMPONENT_SIZE.touchTarget,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: RADII.small,
                  cursor: 'pointer',
                  transition: prefersReducedMotion
                    ? undefined
                    : `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                }}
              >
                <Counter roles={roles} />
              </button>
            ))}
          </div>
        ) : (
          <p style={{ ...bodyStyle, margin: 0 }}>
            {`Nothing is left over — all ${formatNumber(total)} counters are now inside the ${groupCount} groups.`}
          </p>
        )}
      </div>

      {loose > 0 && (
        <button
          type="button"
          onClick={() => onDeal(total)}
          style={{
            ...TYPE.bodySmall,
            fontWeight: 600,
            width: '100%',
            minHeight: COMPONENT_SIZE.touchTarget,
            borderRadius: RADII.medium,
            border: `1px solid ${GENERAL.line.strong}`,
            background: 'transparent',
            color: accent,
            cursor: 'pointer',
          }}
        >
          {`Split into ${groupCount} equal groups`}
        </button>
      )}

      {/* Labelled "Group 1…3", not "x 1…3": these zones hold counters being
          shared out, and only become worth one x once they are equal. */}
      <GroupZones
        counts={groups}
        roles={roles}
        expected={resolved ? perGroup : null}
        nextIndex={loose > 0 ? nextIndex : null}
      />

      <p style={{ ...bodyStyle, textAlign: 'center', margin: 0 }}>
        {resolved
          ? `${formatNumber(total)} shared equally between ${groupCount} groups gives ${formatNumber(perGroup)} in each group.`
          : `Deal one at a time and each group grows evenly — that is what sharing equally looks like.`}
      </p>

      <span style={visuallyHidden} data-cb-counter-total={total}>
        {`${loose} loose counters and ${dealt} shared counters — ${total} in total.`}
      </span>
    </div>
  )
}
