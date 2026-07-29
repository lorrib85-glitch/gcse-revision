// ─── Algebra Why Lab ─────────────────────────────────────────────────────────
//
// Four scenes for one simple equation, answering the questions a learner who
// can already "divide by 3" still cannot answer: what does 3x mean, what are
// we aiming at, what is currently being done to x, which operation undoes it,
// and why must it happen on both sides.
//
// Scene 1 assumes nothing — a coefficient is built from repeated addition
// before it is named.

import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'
import {
  describeInverseRelationship,
  formatEquation,
  formatNumber,
  formatOperation,
  formatTerm,
  splitIntoEqualGroups,
} from './calculationBreakdownMath.js'
import { MathLine, bodyStyle } from './calculationBreakdownParts.jsx'
import {
  CounterField,
  GroupZones,
  ModelPair,
  VariableGroups,
  figureFrame,
} from './calculationBreakdownFigures.jsx'
import { OperationChoice, OPERATION_CHOICE_INITIAL_STATE } from './calculationBreakdownControls.jsx'

export function buildAlgebraWhyScenes({ model, reasoning, roles, accent }) {
  const { variable, coefficient, total, solution } = model
  const term = formatTerm(coefficient, variable)
  const equation = formatEquation(term, formatNumber(total))
  const acting = { type: 'multiply', value: coefficient }
  const undo = formatOperation({ type: 'divide', value: coefficient })
  const split = splitIntoEqualGroups(total, coefficient)

  const why = {
    goal: reasoning?.goal ?? `Get one ${variable} on its own.`,
    structure: reasoning?.structure ?? `${term} means ${variable} is multiplied by ${coefficient} — ${coefficient} equal groups of ${variable}.`,
    inverse: reasoning?.inverse ?? describeInverseRelationship(acting),
    equality: reasoning?.equality ?? `${undo.bothSides} so the two sides stay equal.`,
    check: reasoning?.check ?? `Substitute ${variable} = ${formatNumber(solution)}: ${coefficient} × ${formatNumber(solution)} = ${formatNumber(total)}.`,
  }

  return [
    {
      id: 'read',
      label: 'Read the algebra',
      heading: `What does ${term} mean?`,
      intro: `${term} is not a new kind of number. It is ${variable}, written ${coefficient} times over.`,
      announce: `Scene 1 of 4. ${term} means ${coefficient} equal groups of ${variable}.`,
      summary: `${term} means ${coefficient} equal groups of ${variable}.`,
      reasoning: [{ key: 'structure', label: 'What the algebra means', text: why.structure }],
      render: () => (
        <div style={figureFrame}>
          <MathLine
            expr={`${term} = ${coefficient} × ${variable} = ${Array.from({ length: coefficient }, () => variable).join(' + ')}`}
            size={20}
            accent={roles.equationPrimary}
            wrap
          />
          <ModelPair
            roles={roles}
            leftLabel={`${coefficient} groups of ${variable}`}
            rightLabel={`${formatNumber(total)} units`}
            left={<VariableGroups variable={variable} count={coefficient} roles={roles} size="compact" />}
            right={<CounterField count={total} roles={roles} />}
          />
          <p style={{ ...bodyStyle, textAlign: 'center' }}>
            {`The ${coefficient} groups on the left are worth ${formatNumber(total)} altogether.`}
          </p>
        </div>
      ),
    },

    {
      id: 'goal',
      label: 'State the goal',
      heading: `Find the value of one ${variable}`,
      intro: `We know what ${coefficient} groups are worth. We want what one group is worth.`,
      announce: `Scene 2 of 4. Choose the operation that finds one group.`,
      summary: `Goal: find one ${variable}, by undoing the multiplication.`,
      requiresDecision: true,
      initialState: OPERATION_CHOICE_INITIAL_STATE,
      reasoning: [{ key: 'goal', label: 'What we are trying to achieve', text: why.goal }],
      render: ({ state, setState, resolved, resolve, announce }) => (
        <>
          <div style={figureFrame}>
            <MathLine expr={equation} size={26} accent={roles.equationAccent} />
            <p style={{ ...TYPE.bodySmall, color: roles.textSecondary, margin: 0, textAlign: 'center' }}>
              {`${variable} is being multiplied by ${coefficient}.`}
            </p>
          </div>
          <div style={{ marginTop: SPACING.standard }}>
            <OperationChoice
              question={`If ${coefficient} equal groups total ${formatNumber(total)}, how do we find one group?`}
              support="Look at what is being done to the variable, then choose the operation that undoes it."
              options={[
                {
                  id: 'subtract',
                  label: `Subtract ${coefficient} from both sides`,
                  correct: false,
                  feedback: `Subtracting ${coefficient} takes ${coefficient} away from the total. It does not undo three equal groups — ${variable} is multiplied by ${coefficient}, and subtraction only undoes addition.`,
                },
                {
                  id: 'divide',
                  label: `Divide both sides by ${coefficient}`,
                  correct: true,
                  feedback: `${describeInverseRelationship(acting)} Sharing ${formatNumber(total)} into ${coefficient} equal groups gives the value of one ${variable}.`,
                },
                {
                  id: 'multiply',
                  label: `Multiply both sides by ${coefficient}`,
                  correct: false,
                  feedback: `Multiplying again makes ${coefficient} × ${term} — even more groups of ${variable}. We need fewer groups, not more.`,
                },
              ]}
              state={state}
              setState={setState}
              resolved={resolved}
              onResolved={resolve}
              onAnnounce={announce}
              accent={accent}
            />
          </div>
        </>
      ),
    },

    {
      id: 'undo',
      label: 'Undo the multiplication',
      heading: undo.bothSides,
      intro: 'The same operation goes on each side, so the two sides stay worth the same.',
      announce: `Scene 3 of 4. Both sides divided by ${coefficient}. ${formatNumber(total)} shared into ${coefficient} equal groups gives ${formatNumber(solution)} in each.`,
      summary: `${formatNumber(total)} shared into ${coefficient} equal groups gives ${formatNumber(solution)}.`,
      reasoning: [
        { key: 'inverse', label: 'Which operation undoes it', text: why.inverse },
        { key: 'equality', label: 'Why both sides', text: why.equality },
      ],
      render: () => (
        <div style={figureFrame}>
          <MathLine
            expr={`${term} ÷ ${coefficient} = ${formatNumber(total)} ÷ ${coefficient}`}
            size={22}
            accent={roles.equationPrimary}
            wrap
          />
          <ModelPair
            roles={roles}
            leftLabel={`One ${variable}`}
            rightLabel={`${coefficient} equal groups`}
            left={<VariableGroups variable={variable} count={1} roles={roles} size="compact" />}
            right={(
              <div style={{ width: '100%', maxWidth: 190 }}>
                <GroupZones counts={split.groups} roles={roles} expected={split.perGroup} />
              </div>
            )}
          />
          <p style={{ ...bodyStyle, textAlign: 'center' }}>
            {`${formatNumber(total)} shared equally between ${coefficient} groups gives ${formatNumber(split.perGroup)} in each group.`}
          </p>
        </div>
      ),
    },

    {
      id: 'check',
      label: 'Reveal and check',
      heading: `${variable} = ${formatNumber(solution)}`,
      intro: 'One group is now on its own, so the equation reads its own answer.',
      announce: `Scene 4 of 4. ${variable} equals ${formatNumber(solution)}. Checking: ${coefficient} times ${formatNumber(solution)} equals ${formatNumber(total)}.`,
      continueLabel: 'Next challenge',
      reasoning: [{ key: 'check', label: 'How to check it', text: why.check }],
      render: () => (
        <div style={figureFrame}>
          <MathLine expr={`${variable} = ${formatNumber(solution)}`} size={32} accent={roles.equationAccent} />
          <ModelPair
            roles={roles}
            leftLabel={`One ${variable}`}
            rightLabel={`${formatNumber(solution)} units`}
            left={<VariableGroups variable={variable} count={1} roles={roles} size="compact" />}
            right={<CounterField count={solution} roles={roles} grouped />}
          />
          <div style={{ width: '100%', paddingTop: SPACING.compact, borderTop: `1px solid ${roles.line}` }}>
            <p style={{ ...TYPE.label, color: accent, margin: 0 }}>Check by substituting</p>
            <div style={{ marginTop: SPACING.micro }}>
              <MathLine
                expr={`${coefficient} × ${formatNumber(solution)} = ${formatNumber(total)}`}
                size={22}
                accent={roles.equationPrimary}
              />
            </div>
            <p style={{ ...bodyStyle, marginTop: SPACING.micro, textAlign: 'center' }}>
              {`Putting ${formatNumber(solution)} back in place of ${variable} gives the number the equation started with, so ${variable} = ${formatNumber(solution)} is correct.`}
            </p>
          </div>
        </div>
      ),
    },
  ]
}
