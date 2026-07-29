// ─── Balance & Solve ─────────────────────────────────────────────────────────
//
// Why the same operation must go on both sides. The balance is a conceptual
// model, not a physics toy: it stays level through every valid transformation,
// and tilts only when a move has actually broken the equality.
//
// The one-sided move is offered as a real choice and refused as an answer. It
// breaks the balance the moment it is committed — visibly, before any text
// explains it — so the learner discovers the rule rather than being told it in
// advance. Nothing in the scene copy or the question hints that keeping the
// balance true is the goal; that is the thing being discovered.

import { TYPE } from '../../../constants/typography.js'
import { SPACING } from '../../../constants/spacing.js'
import { MOTION } from '../../../constants/motion.js'
import {
  describeInverseRelationship,
  formatOperation,
  operationSymbol,
} from './calculationBreakdownMath.js'
import { MathLine, bodyStyle } from './calculationBreakdownParts.jsx'
import { figureFrame, visuallyHidden } from './calculationBreakdownFigures.jsx'
import { OperationChoice, OPERATION_CHOICE_INITIAL_STATE } from './calculationBreakdownControls.jsx'

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
      // States the starting fact only. Neither this line nor the question
      // mentions keeping the balance true — the learner has to discover that
      // by trying a one-sided move and watching it break.
      intro: `The balance is level: ${state.left} is worth exactly what ${state.right} is worth.`,
      announce: `The balance is level. Choose a move.`,
      summary: `${wording.bothSides} keeps the balance level.`,
      requiresDecision: true,
      initialState: OPERATION_CHOICE_INITIAL_STATE,
      reasoning: index === 0
        ? [{ key: 'goal', label: 'What we are trying to achieve', text: why.goal }]
        : [],
      render: ({ state: choiceState, setState, resolved, resolve, announce, prefersReducedMotion }) => {
        // A one-sided move breaks the balance the moment it is committed —
        // not two scenes later behind an optional button. This is the whole
        // point of the variant, and the learner who reaches for it is exactly
        // the one who needs to see it happen.
        const broken = choiceState.checked
          && choiceState.picked === 'one-side'
          && !resolved

        return (
          <>
            <div style={figureFrame}>
              {broken && (
                <MathLine
                  expr={`${state.left} ${operationSymbol(operation)} = ${state.right}`}
                  size={20}
                  accent={roles.balanceInvalid}
                  wrap
                />
              )}
              <BalanceFigure
                left={broken ? state.resultLeft : state.left}
                right={state.right}
                roles={roles}
                status={broken ? 'invalid' : 'valid'}
                changedSide={broken ? 'left' : null}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
            <div style={{ marginTop: SPACING.standard }}>
              <OperationChoice
                question={`Choose the move that will find one ${state.resultLeft}.`}
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
        )
      },
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
      // The optional "what if we changed only one side?" aside used to live
      // here. It has been removed, not lost: the break now happens on the
      // choose scene at the moment the learner proposes it, which is both
      // earlier and unconditional. Keeping the aside as well would teach the
      // same thing twice.
      render: ({ prefersReducedMotion }) => (
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
      // Describes what the learner is looking at, now that the balance has
      // actually tipped — the general rule lives in the reasoning rail.
      feedback: `Look at the balance: the left is now ${state.resultLeft} while the right is still ${state.right}. The two sides are no longer equal, so the equation is no longer true.`,
    },
    {
      id: 'both-sides',
      label: wording.bothSides,
      correct: true,
      feedback: `Yes. Both pans change together, so the balance stays level and ${state.resultLeft} = ${state.resultRight} is still true.`,
    },
    {
      id: 'wrong-family',
      label: formatOperation(wrongFamily).bothSides,
      correct: false,
      feedback: `The balance stays level — both sides were treated the same — but it does not undo ${wording.plain}, so ${state.resultLeft} is no closer to being on its own.`,
    },
  ]
}

/**
 * Structure in SVG, values in canonical HTML type.
 *
 * The beam tilts only when a move has actually broken the equality, by a small
 * fixed angle: this is a diagram of an idea, not a swinging scale. The tilt is
 * a rotation of the beam group with each pan counter-rotated so it still hangs
 * upright, which lets the change animate as one restrained movement. Under
 * reduced motion the same tilted state renders with no transition at all.
 */
function BalanceFigure({
  left,
  right,
  roles,
  status = 'valid',
  changedSide = null,
  prefersReducedMotion = false,
}) {
  const invalid = status === 'invalid'
  const angle = invalid ? TILT_DEGREES : 0

  // Rest geometry: the tilt is applied as a transform, so these never move.
  const leftEnd = { x: PIVOT.x - BEAM_HALF, y: PIVOT.y }
  const rightEnd = { x: PIVOT.x + BEAM_HALF, y: PIVOT.y }

  const beamColour = invalid ? roles.balanceInvalid : roles.balanceBeam
  const panColour = invalid ? roles.balanceInvalid : roles.balanceValid
  const panFill = invalid ? roles.balanceInvalidSoft : roles.balanceValidSoft
  const transition = prefersReducedMotion
    ? undefined
    : `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`

  // Where each pan ends up once the beam has rotated — the HTML labels ride
  // along with it.
  const radians = (angle * Math.PI) / 180
  const rotated = end => ({
    x: PIVOT.x + (end.x - PIVOT.x) * Math.cos(radians),
    y: PIVOT.y + (end.x - PIVOT.x) * Math.sin(radians),
  })

  return (
    <div
      style={{ position: 'relative', width: '100%', maxWidth: 280 }}
      data-cb-balance={status}
      data-cb-balance-changed-side={changedSide ?? undefined}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
    >
      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        width="100%"
        height="auto"
        style={{ display: 'block' }}
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

        <g
          data-cb-balance-beam={invalid ? 'tipped' : 'level'}
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
            transition,
          }}
        >
          <line
            x1={leftEnd.x} y1={leftEnd.y} x2={rightEnd.x} y2={rightEnd.y}
            stroke={beamColour} strokeWidth="2" strokeLinecap="round"
            style={{ transition: prefersReducedMotion ? undefined : `stroke ${MOTION.duration.standard} ${MOTION.easing.standard}` }}
          />
          <circle cx={PIVOT.x} cy={PIVOT.y} r="3.5" fill={beamColour} />

          {/* Counter-rotated so each pan keeps hanging upright as the beam tips */}
          <Pan end={leftEnd} stroke={panColour} fill={panFill} angle={angle} transition={transition} />
          <Pan end={rightEnd} stroke={panColour} fill={panFill} angle={angle} transition={transition} />
        </g>
      </svg>

      <PanLabel end={rotated(leftEnd)} text={left} roles={roles} transition={transition} />
      <PanLabel end={rotated(rightEnd)} text={right} roles={roles} transition={transition} />

      {changedSide && (
        <div
          style={{
            ...TYPE.caption,
            fontWeight: 700,
            color: roles.balanceInvalid,
            textAlign: 'center',
            marginTop: SPACING.micro,
          }}
        >
          {`Only the ${changedSide} side changed`}
        </div>
      )}

      <span style={visuallyHidden}>
        {invalid
          ? `Left side ${left}, right side ${right}. The sides are no longer equal.`
          : `Left side ${left}, right side ${right}. The sides are equal.`}
      </span>
    </div>
  )
}

function Pan({ end, stroke, fill, angle = 0, transition }) {
  const top = end.y + HANGER
  const halfTop = PAN.topWidth / 2
  const halfBottom = PAN.bottomWidth / 2

  return (
    <g
      style={{
        transform: `rotate(${-angle}deg)`,
        transformOrigin: `${end.x}px ${end.y}px`,
        transition,
      }}
    >
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

function PanLabel({ end, text, roles, transition }) {
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
        transition: transition ? `top ${MOTION.duration.standard} ${MOTION.easing.standard}` : undefined,
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
