// ─── Inverse Operation Studio ────────────────────────────────────────────────
//
// A multi-step equation read as a sequence of actions done to the variable,
// then undone in reverse order. The reverse path is never authored — it is
// derived from the forward operations, so content cannot state a forward and a
// reverse chain that disagree.
//
// The language is "undo in reverse order" before it is anything more formal:
// the last action performed is the first one undone.

import { GENERAL } from '../../../constants/generalTheme.js'
import { TYPE } from '../../../constants/typography.js'
import { SPACING } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { MOTION } from '../../../constants/motion.js'
import {
  describeInverseRelationship,
  formatNumber,
  formatOperation,
  inverseOperation,
  operationSymbol,
  replayForwardCheck,
  runOperations,
} from './calculationBreakdownMath.js'
import { MathLine, bodyStyle } from './calculationBreakdownParts.jsx'
import { figureFrame, visuallyHidden } from './calculationBreakdownFigures.jsx'
import { OperationChoice, OPERATION_CHOICE_INITIAL_STATE } from './calculationBreakdownControls.jsx'

const FAMILY = Object.freeze({
  add: 'addition',
  subtract: 'subtraction',
  multiply: 'multiplication',
  divide: 'division',
})

export function buildInverseMachineScenes({ model, reasoning, roles, accent }) {
  const { variable, operations, result, solution, undoStages } = model
  const forward = runOperations(solution, operations)
  const lastOperation = operations[operations.length - 1]
  const check = replayForwardCheck(solution, operations, result)

  const why = {
    goal: reasoning?.goal ?? `Get ${variable} on its own by undoing every action done to it.`,
    structure: reasoning?.structure ?? `${variable} was ${operations.map(op => formatOperation(op).past).join(', then ')} — that chain of actions produced ${formatNumber(result)}.`,
    inverse: reasoning?.inverse ?? describeInverseRelationship(lastOperation),
    equality: reasoning?.equality ?? 'Each undo is applied to both sides, so the equation stays equal while the actions come off.',
    check: reasoning?.check ?? `Replay the machine from ${variable} = ${formatNumber(solution)}: it lands back on ${formatNumber(result)}.`,
  }

  const scenes = [
    {
      id: 'read-forward',
      label: 'Read the machine',
      heading: 'What happened to ' + variable,
      intro: `Follow the actions from left to right. ${variable} goes in, ${formatNumber(result)} comes out.`,
      announce: `Scene 1. The forward machine: ${variable}, ${operations.map(op => formatOperation(op).past).join(', then ')}, giving ${formatNumber(result)}.`,
      summary: `Forward: ${variable} ${operations.map(op => operationSymbol(op)).join(' then ')} gives ${formatNumber(result)}.`,
      reasoning: [{ key: 'structure', label: 'What the algebra means', text: why.structure }],
      render: () => (
        <div style={figureFrame}>
          <MachineTrack
            roles={roles}
            direction="forward"
            startLabel={variable}
            startCaption="Start"
            nodes={operations.map(operation => ({
              symbol: operationSymbol(operation),
              caption: formatOperation(operation).instruction,
            }))}
            endLabel={formatNumber(result)}
            endCaption="Result"
          />
          <p style={{ ...bodyStyle, textAlign: 'center' }}>
            Solving works the machine backwards — but the actions have to come off in the opposite order to the one they went on.
          </p>
        </div>
      ),
    },
  ]

  // With one operation there is nothing to order, so the "which happened last"
  // question would be a question with only one honest answer.
  if (operations.length > 1) {
    scenes.push({
      id: 'identify-last',
      label: 'Find the last action',
      heading: 'Which action happened last?',
      intro: 'The last action to go on is the first one to come off.',
      announce: 'Scene 2. Identify the action that happened last.',
      summary: `${formatOperation(lastOperation).instruction} happened last, so it comes off first.`,
      requiresDecision: true,
      initialState: OPERATION_CHOICE_INITIAL_STATE,
      reasoning: [{ key: 'goal', label: 'What we are trying to achieve', text: why.goal }],
      render: ({ state, setState, resolved, resolve, announce }) => (
        <>
          <div style={figureFrame}>
            <MachineTrack
              roles={roles}
              direction="forward"
              startLabel={variable}
              startCaption="Start"
              nodes={operations.map(operation => ({
                symbol: operationSymbol(operation),
                caption: formatOperation(operation).instruction,
              }))}
              endLabel={formatNumber(result)}
              endCaption="Result"
            />
          </div>
          <div style={{ marginTop: SPACING.standard }}>
            <OperationChoice
              question={`Reading left to right, which action was done to ${variable} last?`}
              options={operations.map((operation, index) => ({
                id: `op-${index}`,
                label: formatOperation(operation).instruction,
                correct: index === operations.length - 1,
                feedback: index === operations.length - 1
                  ? `Yes — it sits at the end of the chain, so it is the outermost action and the first one we undo.`
                  : `That happened earlier in the chain. Anything after it was done on top, so it has to come off first.`,
              }))}
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
    })
  }

  // One scene per undo, working from the outermost operation inwards.
  undoStages.forEach((stage, index) => {
    const undoing = stage.undoes
    const inverse = stage.operation
    const revealedStages = undoStages.slice(0, index)

    scenes.push({
      id: `undo-${index}`,
      label: `Undo step ${index + 1}`,
      heading: `Undo ${formatOperation(undoing).symbol}`,
      intro: `${formatOperation(undoing).instruction} was done to ${variable}.`,
      announce: `Undo step ${index + 1}. Choose the inverse of ${formatOperation(undoing).plain}.`,
      summary: `${formatOperation(inverse).bothSides}: ${formatNumber(stage.from)} becomes ${formatNumber(stage.to)}.`,
      requiresDecision: true,
      initialState: OPERATION_CHOICE_INITIAL_STATE,
      reasoning: index === 0
        ? [
          { key: 'inverse', label: 'Which operation undoes it', text: why.inverse },
          { key: 'equality', label: 'Why both sides', text: why.equality },
        ]
        : [],
      render: ({ state, setState, resolved, resolve, announce }) => (
        <>
          <div style={figureFrame}>
            <MachineTrack
              roles={roles}
              direction="reverse"
              startLabel={formatNumber(result)}
              startCaption="Start"
              nodes={undoStages.slice(0, index + 1).map((item, itemIndex) => ({
                symbol: operationSymbol(item.operation),
                caption: formatOperation(item.operation).instruction,
                value: itemIndex < revealedStages.length || resolved ? formatNumber(item.to) : null,
                active: itemIndex === index,
                pending: itemIndex === index && !resolved,
              }))}
              endLabel={resolved && index === undoStages.length - 1 ? formatNumber(solution) : null}
              endCaption={resolved && index === undoStages.length - 1 ? variable : null}
            />
            {resolved && (
              <MathLine
                expr={`${formatNumber(stage.from)} ${operationSymbol(inverse)} = ${formatNumber(stage.to)}`}
                size={22}
                accent={roles.equationAccent}
              />
            )}
          </div>
          <div style={{ marginTop: SPACING.standard }}>
            <OperationChoice
              question={`Which operation undoes ${formatOperation(undoing).symbol}?`}
              options={buildUndoOptions(undoing, stage, variable)}
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
    })
  })

  scenes.push({
    id: 'replay-check',
    label: 'Check the answer',
    heading: `${variable} = ${formatNumber(solution)}`,
    intro: 'Run the original machine forwards from that value. If it lands on the result, the answer is right.',
    announce: `${variable} equals ${formatNumber(solution)}. Replaying forwards gives ${formatNumber(check.result)}.`,
    continueLabel: 'Next challenge',
    reasoning: [{ key: 'check', label: 'How to check it', text: why.check }],
    render: () => (
      <div style={figureFrame}>
        <MachineTrack
          roles={roles}
          direction="forward"
          startLabel={formatNumber(solution)}
          startCaption={variable}
          nodes={forward.stages.map(stage => ({
            symbol: operationSymbol(stage.operation),
            caption: formatOperation(stage.operation).instruction,
            value: formatNumber(stage.to),
          }))}
          endLabel={formatNumber(check.result)}
          endCaption={check.matches ? 'Matches the result' : 'Does not match'}
        />
        <MathLine
          expr={`${variable} = ${formatNumber(solution)}`}
          size={30}
          accent={roles.equationAccent}
        />
        <p style={{ ...bodyStyle, textAlign: 'center' }}>
          {`Substituting ${formatNumber(solution)} back into the original chain returns ${formatNumber(check.result)} — the number the equation started with.`}
        </p>
      </div>
    ),
  })

  return scenes
}

/**
 * Two distractors, each a real misunderstanding: repeating the same action
 * instead of reversing it, and reaching for the wrong inverse pair.
 */
function buildUndoOptions(operation, stage, variable) {
  const correct = inverseOperation(operation)
  const wrongFamily = operation.type === 'add' || operation.type === 'subtract'
    ? { type: 'divide', value: operation.value }
    : { type: 'subtract', value: operation.value }
  const wrongFamilyInverseOf = FAMILY[inverseOperation({ ...wrongFamily, value: 1 }).type]

  return shuffleStable([
    {
      id: 'correct',
      label: formatOperation(correct).bothSides,
      correct: true,
      feedback: `Yes. ${formatNumber(stage.from)} ${operationSymbol(correct)} = ${formatNumber(stage.to)}.`,
    },
    {
      id: 'repeat',
      label: formatOperation(operation).bothSides,
      correct: false,
      feedback: `That repeats the action instead of reversing it, so the value moves further away from ${variable} rather than back towards it.`,
    },
    {
      id: 'wrong-family',
      label: formatOperation(wrongFamily).bothSides,
      correct: false,
      feedback: `${capitalise(FAMILY[wrongFamily.type])} undoes ${wrongFamilyInverseOf}, not ${FAMILY[operation.type]}.`,
    },
  ])
}

// A fixed rotation rather than randomness: the correct answer must not always
// sit first, but a component that reorders itself between renders is unusable.
function shuffleStable(options) {
  return [options[1], options[0], options[2]]
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * The machine itself: value nodes and operation nodes on one track. The active
 * operation is named "Now" and carries aria-current as well as its accent, so
 * the current step is never signalled by colour alone.
 */
function MachineTrack({ roles, direction, startLabel, startCaption, nodes, endLabel, endCaption }) {
  const arrow = direction === 'forward' ? '→' : '←'

  return (
    <div
      data-cb-machine={direction}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 4,
        width: '100%',
      }}
    >
      <ValueNode label={startLabel} caption={startCaption} roles={roles} />
      {/* Each arrow travels with the node it points at, so a track that has to
          wrap never leaves an arrow pointing at nothing. */}
      {nodes.map((node, index) => (
        <div key={index} style={trackGroup}>
          <TrackArrow arrow={arrow} roles={roles} />
          <OperationNode node={node} roles={roles} />
          {node.value != null && (
            <>
              <TrackArrow arrow={arrow} roles={roles} />
              <ValueNode label={node.value} caption={null} roles={roles} />
            </>
          )}
        </div>
      ))}
      {endLabel != null && (
        <div style={trackGroup}>
          <TrackArrow arrow={arrow} roles={roles} />
          <ValueNode label={endLabel} caption={endCaption} roles={roles} emphasis />
        </div>
      )}
    </div>
  )
}

function TrackArrow({ arrow, roles }) {
  return (
    <span aria-hidden="true" style={{
      ...TYPE.bodySmall,
      color: roles.constructionLine,
      // Aligned to the middle of the 44px node box, not to the column as a
      // whole — otherwise the captions drag the arrow below the track.
      alignSelf: 'flex-start',
      marginTop: 12,
    }}>
      {arrow}
    </span>
  )
}

function ValueNode({ label, caption, roles, emphasis = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
      <span style={{
        ...nodeBox,
        border: `1px solid ${emphasis ? roles.equationAccent : roles.lineStrong}`,
        background: emphasis ? roles.operationActiveSoft : roles.surface,
        color: roles.equationPrimary,
      }}>
        {label}
      </span>
      {caption && (
        <span style={{ ...TYPE.caption, color: roles.textMuted, textAlign: 'center', maxWidth: 52 }}>
          {caption}
        </span>
      )}
    </div>
  )
}

function OperationNode({ node, roles }) {
  const active = Boolean(node.active)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
      <span
        aria-current={active ? 'step' : undefined}
        style={{
          ...nodeBox,
          border: `1px solid ${active ? roles.operationActive : roles.lineStrong}`,
          background: active ? roles.operationActiveSoft : roles.operationMutedSoft,
          color: active ? roles.operationActive : roles.operationMuted,
          boxShadow: active ? `0 0 0 3px ${roles.focusGlow}` : 'none',
          transition: `box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}
      >
        {node.symbol}
      </span>
      {/* The action is named in words under every node, so the machine can be
          read without decoding symbols. "Now" is a word as well as a colour. */}
      <span style={{ ...TYPE.caption, color: roles.textMuted, textAlign: 'center', maxWidth: 52 }}>
        {node.caption}
      </span>
      {active && (
        <span style={{ ...TYPE.caption, fontWeight: 700, color: roles.operationActive }}>Now</span>
      )}
      <span style={visuallyHidden}>{active ? 'Current step' : ''}</span>
    </div>
  )
}

const trackGroup = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 4,
}

const nodeBox = {
  fontFamily: TYPE.body.fontFamily,
  fontSize: 17,
  fontWeight: 600,
  minWidth: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${SPACING.micro}px`,
  borderRadius: RADII.small,
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  background: GENERAL.surfaceTint,
}
