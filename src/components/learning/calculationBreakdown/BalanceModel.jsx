// ─── Balance & Solve ─────────────────────────────────────────────────────────
//
// Why the same operation must go on both sides. The balance is a conceptual
// model, not a physics toy: it stays level through every valid transformation,
// and the only time it tilts is inside an optional aside that shows what
// changing one side alone would do.
//
// The one-sided option is offered as a choice and refused as an answer — the
// learner meets the misconception, is told why it fails, and chooses again.

import { TYPE } from '../../../constants/typography.js'
import { SPACING } from '../../../constants/spacing.js'
import { MOTION } from '../../../constants/motion.js'
import {
  describeInverseRelationship,
  formatNumber,
  formatOperation,
  operationSymbol,
} from './calculationBreakdownMath.js'
import { MathLine, bodyStyle } from './calculationBreakdownParts.jsx'
import { figureFrame, visuallyHidden } from './calculationBreakdownFigures.jsx'
import { OperationChoice, OPERATION_CHOICE_INITIAL_STATE, SecondaryRevealButton } from './calculationBreakdownControls.jsx'

// Geometry of the figure, in viewBox units. The SVG scales with its container
// and the pan labels are positioned as a percentage of the same box, so the
// equation text stays canonical typography rather than raw SVG type.
const BOX = Object.freeze({ width: 280, height: 150 })
const PIVOT = Object.freeze({ x: 140, y: 40 })
const BEAM_HALF = 92
const HANGER = 22
const PAN = Object.freeze({ topWidth: 78, bottomWidth: 58, height: 30 })
const TILT_DEGREES = 7

export function buildBalanceScenes({ model, reasoning, roles, accent }) {
  const { states } = model
  const first = states[0]
  const last = states[states.length - 1]

  const why = {
    goal: reasoning?.goal ?? `Get ${last.resultLeft} on its own while the two sides stay equal.`,
    structure: reasoning?.structure ?? `${first.left} = ${first.right} says the two sides are worth exactly the same.`,
    inverse: reasoning?.inverse ?? describeInverseRelationship(first.operation),
    equality: reasoning?.equality ?? `${formatOperation(first.operation).bothSides} — the same action on each side keeps them worth the same, so the equation stays true.`,
    check: reasoning?.check ?? `${last.resultLeft} = ${last.resultRight} still balances, so the value is correct.`,
  }

  const scenes = [
    {
      id: 'read',
      label: 'Read the balance',
      heading: `${first.left} = ${first.right}`,
      intro: 'An equals sign is a promise: whatever is on the left is worth exactly what is on the right.',
      announce: `Scene 1. The balance is level: ${first.left} is worth the same as ${first.right}.`,
      summary: `${first.left} = ${first.right} — both sides are equal.`,
      reasoning: [{ key: 'structure', label: 'What the algebra means', text: why.structure }],
      render: () => (
        <div style={figureFrame}>
          <BalanceFigure left={first.left} right={first.right} roles={roles} status="valid" />
          <p style={{ ...bodyStyle, textAlign: 'center' }}>
            Balanced. Anything done from here has to keep it that way.
          </p>
        </div>
      ),
    },
  ]

  states.forEach((state, index) => {
    const operation = state.operation
    const wording = formatOperation(operation)

    scenes.push({
      id: `choose-${index}`,
      label: states.length > 1 ? `Choose move ${index + 1}` : 'Choose the operation',
      heading: 'What keeps it balanced?',
      intro: `Look at what is being done to the left side, then choose the move that undoes it without breaking the balance.`,
      announce: `Choose the operation that keeps ${state.left} equals ${state.right} true.`,
      summary: `${wording.bothSides} keeps the balance level.`,
      requiresDecision: true,
      initialState: OPERATION_CHOICE_INITIAL_STATE,
      reasoning: index === 0
        ? [{ key: 'goal', label: 'What we are trying to achieve', text: why.goal }]
        : [],
      render: ({ state: choiceState, setState, resolved, resolve, announce }) => (
        <>
          <div style={figureFrame}>
            <BalanceFigure left={state.left} right={state.right} roles={roles} status="valid" />
          </div>
          <div style={{ marginTop: SPACING.standard }}>
            <OperationChoice
              question={`Which move keeps ${state.left} = ${state.right} true?`}
              support="The same action on both sides is the only move that leaves the equation saying the same thing."
              options={buildBalanceOptions(state)}
              state={choiceState}
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

    scenes.push({
      id: `apply-${index}`,
      label: states.length > 1 ? `Apply move ${index + 1}` : 'Apply it to both sides',
      heading: wording.bothSides,
      intro: 'The same operation goes on each side at the same time, so neither side gains on the other.',
      announce: `${wording.bothSides}. ${state.left} ${operationSymbol(operation)} equals ${state.right} ${operationSymbol(operation)}. The balance stays level.`,
      summary: `${state.left} ${operationSymbol(operation)} = ${state.right} ${operationSymbol(operation)} — still level.`,
      reasoning: index === 0
        ? [
          { key: 'inverse', label: 'Which operation undoes it', text: why.inverse },
          { key: 'equality', label: 'Why both sides', text: why.equality },
        ]
        : [],
      render: ({ state: sceneState, setState, prefersReducedMotion }) => (
        <>
          <div style={figureFrame}>
            <MathLine
              expr={`${state.left} ${operationSymbol(operation)} = ${state.right} ${operationSymbol(operation)}`}
              size={20}
              accent={roles.equationPrimary}
              wrap
            />
            <BalanceFigure
              left={state.resultLeft}
              right={state.resultRight}
              roles={roles}
              status="valid"
              prefersReducedMotion={prefersReducedMotion}
            />
            <p style={{ ...bodyStyle, textAlign: 'center' }}>
              Same action, same both sides. The balance stays level, so the equation is still true.
            </p>
          </div>

          <div style={{ marginTop: SPACING.compact }}>
            <SecondaryRevealButton
              label={sceneState.showMisconception ? 'Hide the one-sided version' : 'What if we changed only one side?'}
              expanded={Boolean(sceneState.showMisconception)}
              onClick={() => setState(current => ({ ...current, showMisconception: !current.showMisconception }))}
              accent={accent}
            />
            {sceneState.showMisconception && (
              <div style={{ marginTop: SPACING.compact }}>
                <div style={figureFrame}>
                  <BalanceFigure
                    left={state.resultLeft}
                    right={state.right}
                    roles={roles}
                    status="invalid"
                    prefersReducedMotion={prefersReducedMotion}
                  />
                  <p style={{ ...bodyStyle, textAlign: 'center' }}>
                    {state.misconception
                      ?? `${wording.oneSide} makes the left worth less than the right. The equation is no longer equal, so anything worked out from here would be wrong.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ),
    })
  })

  scenes.push({
    id: 'reveal',
    label: 'Reveal and check',
    heading: `${last.resultLeft} = ${last.resultRight}`,
    intro: 'One side now holds the variable on its own, and the balance never stopped being level.',
    announce: `${last.resultLeft} equals ${last.resultRight}. The balance stayed level throughout.`,
    continueLabel: 'Next challenge',
    reasoning: [{ key: 'check', label: 'How to check it', text: why.check }],
    render: () => (
      <div style={figureFrame}>
        <BalanceFigure left={last.resultLeft} right={last.resultRight} roles={roles} status="valid" />
        <MathLine
          expr={`${last.resultLeft} = ${last.resultRight}`}
          size={30}
          accent={roles.equationAccent}
        />
        <p style={{ ...bodyStyle, textAlign: 'center' }}>
          Every step did the same thing to both sides, so the two sides were equal at the start and equal at the end.
        </p>
      </div>
    ),
  })

  return scenes
}

/**
 * Three moves: the valid one, the same operation applied to one side only, and
 * an operation from the wrong inverse family. The one-sided option exists so
 * the learner can meet the misconception and be told exactly why it fails —
 * it can never complete the step.
 */
function buildBalanceOptions(state) {
  const operation = state.operation
  const wording = formatOperation(operation)
  const wrongFamily = operation.type === 'add' || operation.type === 'subtract'
    ? { type: 'divide', value: operation.value }
    : { type: 'subtract', value: operation.value }

  return [
    {
      id: 'one-side',
      label: wording.oneSide,
      correct: false,
      feedback: `That changes what the left side is worth without changing the right. The two sides stop being equal, so the equation is no longer true and the step cannot be completed this way.`,
    },
    {
      id: 'both-sides',
      label: wording.bothSides,
      correct: true,
      feedback: `${describeInverseRelationship(operation)} Doing it to both sides at once keeps them worth the same, so ${state.resultLeft} = ${state.resultRight} is still true.`,
    },
    {
      id: 'wrong-family',
      label: formatOperation(wrongFamily).bothSides,
      correct: false,
      feedback: `That is fair — both sides are treated the same — but it does not undo ${wording.plain}, so the variable is no closer to being on its own.`,
    },
  ]
}

/**
 * Structure in SVG, values in canonical HTML type. The beam tilts only for the
 * deliberate `invalid` aside, by a small fixed angle: this is a diagram of an
 * idea, not a swinging scale.
 */
function BalanceFigure({ left, right, roles, status = 'valid', prefersReducedMotion = false }) {
  const invalid = status === 'invalid'
  const angle = invalid ? TILT_DEGREES : 0
  const radians = (angle * Math.PI) / 180

  const leftEnd = {
    x: PIVOT.x - BEAM_HALF * Math.cos(radians),
    y: PIVOT.y - BEAM_HALF * Math.sin(radians),
  }
  const rightEnd = {
    x: PIVOT.x + BEAM_HALF * Math.cos(radians),
    y: PIVOT.y + BEAM_HALF * Math.sin(radians),
  }

  const beamColour = invalid ? roles.balanceInvalid : roles.balanceBeam
  const panColour = invalid ? roles.balanceInvalid : roles.balanceValid
  const panFill = invalid ? roles.balanceInvalidSoft : roles.balanceValidSoft

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 280 }} data-cb-balance={status}>
      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        width="100%"
        height="auto"
        style={{
          display: 'block',
          transition: prefersReducedMotion ? undefined : `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}
        role="img"
        aria-label={`Balance showing ${left} on the left and ${right} on the right. ${invalid ? 'The balance is tipped: the two sides are no longer equal.' : 'The balance is level: the two sides are equal.'}`}
      >
        {/* Fulcrum */}
        <path
          d={`M ${PIVOT.x} ${PIVOT.y} L ${PIVOT.x - 12} ${BOX.height - 34} L ${PIVOT.x + 12} ${BOX.height - 34} Z`}
          fill="none"
          stroke={roles.balanceStructure}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <line
          x1={PIVOT.x - 36} y1={BOX.height - 34} x2={PIVOT.x + 36} y2={BOX.height - 34}
          stroke={roles.balanceStructure} strokeWidth="1.5" strokeLinecap="round"
        />

        {/* Beam */}
        <line
          x1={leftEnd.x} y1={leftEnd.y} x2={rightEnd.x} y2={rightEnd.y}
          stroke={beamColour} strokeWidth="2" strokeLinecap="round"
        />
        <circle cx={PIVOT.x} cy={PIVOT.y} r="3.5" fill={beamColour} />

        {/* Pans hang vertically from each beam end */}
        <Pan end={leftEnd} stroke={panColour} fill={panFill} />
        <Pan end={rightEnd} stroke={panColour} fill={panFill} />
      </svg>

      <PanLabel end={leftEnd} text={left} roles={roles} />
      <PanLabel end={rightEnd} text={right} roles={roles} />

      <span style={visuallyHidden}>
        {invalid
          ? `Left side ${left}, right side ${right}. The sides are no longer equal.`
          : `Left side ${left}, right side ${right}. The sides are equal.`}
      </span>
    </div>
  )
}

function Pan({ end, stroke, fill }) {
  const top = end.y + HANGER
  const halfTop = PAN.topWidth / 2
  const halfBottom = PAN.bottomWidth / 2

  return (
    <g>
      <line x1={end.x} y1={end.y} x2={end.x} y2={top} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      <path
        d={`M ${end.x - halfTop} ${top} L ${end.x + halfTop} ${top} L ${end.x + halfBottom} ${top + PAN.height} L ${end.x - halfBottom} ${top + PAN.height} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </g>
  )
}

function PanLabel({ end, text, roles }) {
  const centreY = end.y + HANGER + PAN.height / 2

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${(end.x / BOX.width) * 100}%`,
        top: `${(centreY / BOX.height) * 100}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        maxWidth: `${(PAN.topWidth / BOX.width) * 100}%`,
      }}
    >
      <div style={{
        fontFamily: TYPE.body.fontFamily,
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.1,
        textAlign: 'center',
        color: roles.equationPrimary,
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
    </div>
  )
}
