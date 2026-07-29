import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import CheckAnswerCTA from '../core/CheckAnswerCTA.jsx'
import { ScreenTitle } from '../core/ScreenText.jsx'
import InteractionShell from '../layout/InteractionShell.jsx'
import {
  Arrow,
  ChevronDown,
  ChoiceButton,
  Lightbulb,
  MathLine,
  PhaseActions,
  ReasoningPanel,
  SectionHeading,
  Target,
  WhyCallout,
  bodyStyle,
  choiceListStyle,
  opTag,
  reasoningToItems,
  stageHeaderStyle,
} from './calculationBreakdown/calculationBreakdownParts.jsx'
import CalculationVisualModel from './calculationBreakdown/CalculationVisualModel.jsx'
import { resolveCalculationPresentation } from './calculationBreakdown/calculationBreakdownValidation.js'

// ─── CalculationBreakdown ────────────────────────────────────────────────────
//
// A staged calculation walkthrough that lives inside the standard interaction
// frame. The module owns global navigation and progress; this component only
// owns the learning sequence inside the calculation itself.
//
// Content lives entirely in `block`, so the same mechanic supports equations,
// percentages, fractions, geometry and science calculations.
//
// `block.presentation.variant` optionally swaps the generic worked-step
// sequence for one of the algebra reasoning presentations in
// ./calculationBreakdown/ — they share this frame, its title treatment, its
// stage surface and its CTAs, and differ only in what happens inside the
// stage. Omitting `presentation` (or setting variant 'standard') keeps the
// generic flow exactly as it is, which is what every existing block does.

export default function CalculationBreakdown({
  block,
  subject = 'Maths',
  accent: accentOverride,
  // Test/story override for the reduced-motion preference, matching the
  // AngleExplore / AreaPerimeterExplore / CircuitDiagram convention. Left
  // undefined in production so the system preference governs.
  reducedMotion,
  onContinue,
}) {
  const {
    title = 'Calculation breakdown',
    goalPrompt = 'Work out the answer',
    problem = '',
    understand = {},
    steps = [],
    solution = {},
    backgroundImage = null,
    backgroundOpacity = 0.1,
  } = block || {}

  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const accent = accentOverride || theme.accent
  const accentRgb = theme.accentRgb || GENERAL.tealRgb

  // An invalid model is refused rather than approximated: the reasons are
  // logged in development and the generic walkthrough renders instead, so a
  // content mistake never draws a misleading diagram.
  const presentation = resolveCalculationPresentation(block)
  if (presentation.errors.length > 0 && import.meta.env?.DEV) {
    console.error(
      `[CalculationBreakdown] presentation "${presentation.attempted ?? 'unknown'}" was rejected and fell back to the standard walkthrough:\n- ${presentation.errors.join('\n- ')}`,
    )
  }
  const usesVisualModel = presentation.variant !== 'standard'

  return (
    <InteractionShell
      subject={subject}
      backgroundImage={backgroundImage}
      backgroundOpacity={backgroundOpacity}
    >
      <div style={styles.viewport}>
        <header style={styles.titleBlock}>
          <ScreenTitle>{title}</ScreenTitle>
          <p style={styles.screenIntro}>{goalPrompt}</p>
        </header>

        <div style={styles.scrollArea}>
          <section
            style={stageFrame(accentRgb)}
            // The visual models announce their own state changes precisely;
            // the generic flow keeps the coarse section-level live region.
            aria-live={usesVisualModel ? undefined : 'polite'}
          >
            {usesVisualModel ? (
              <CalculationVisualModel
                variant={presentation.variant}
                model={presentation.model}
                reasoning={presentation.reasoning}
                subject={subject}
                accent={accent}
                reducedMotion={reducedMotion}
                onContinue={onContinue}
              />
            ) : (
              <StandardSequence
                problem={problem}
                understand={understand}
                steps={steps}
                solution={solution}
                accent={accent}
                onContinue={onContinue}
              />
            )}
          </section>
        </div>
      </div>
    </InteractionShell>
  )
}

// ─── The generic worked-step sequence ────────────────────────────────────────
function StandardSequence({ problem, understand, steps, solution, accent, onContinue }) {
  const phases = [
    { kind: 'understand' },
    ...steps.map((step, stepIndex) => ({ kind: 'step', step, stepIndex })),
    { kind: 'solution' },
  ]

  const [phaseIdx, setPhaseIdx] = useState(0)
  const phase = phases[phaseIdx]

  function advance() {
    if (phaseIdx < phases.length - 1) setPhaseIdx(current => current + 1)
    else onContinue?.()
  }

  function goBack() {
    if (phaseIdx > 0) setPhaseIdx(current => current - 1)
  }

  const phaseLabel = phase.kind === 'understand'
    ? 'Understand the question'
    : phase.kind === 'solution'
      ? 'Complete solution'
      : `Step ${phase.stepIndex + 1}`

  return (
    <>
      <div style={stageHeaderStyle}>
        <span style={{ ...TYPE.label, color: accent }}>{phaseLabel}</span>
      </div>

      {phase.kind === 'understand' && (
        <UnderstandPhase
          problem={problem}
          understand={understand}
          steps={steps}
          accent={accent}
          onContinue={advance}
        />
      )}

      {phase.kind === 'step' && (
        <StepPhase
          key={phase.stepIndex}
          step={phase.step}
          stepIndex={phase.stepIndex}
          accent={accent}
          onContinue={advance}
          onBack={goBack}
        />
      )}

      {phase.kind === 'solution' && (
        <SolutionPhase
          solution={solution}
          steps={steps}
          accent={accent}
          onContinue={advance}
          onBack={goBack}
        />
      )}
    </>
  )
}

// ─── Phase 1 — orient the learner ─────────────────────────────────────────────
function UnderstandPhase({ problem, understand, steps, accent, onContinue }) {
  const intro = understand.intro ?? understand.whatsHappening
  const goal = understand.goal
  const whyGoal = understand.whyGoal
    ?? (goal ? 'Reaching this goal gives us a result we can read and check.' : null)
  const decision = understand.decision
    ?? buildFirstMoveDecision(steps)
    ?? understand.check
  const [resolved, setResolved] = useState(false)

  return (
    <>
      <EquationHero expr={problem} accent={accent} />

      {(intro || goal || whyGoal) && (
        <div style={styles.section}>
          <SectionHeading>{understand.heading || 'What are we trying to do?'}</SectionHeading>
          {intro && <p style={bodyStyle}>{intro}</p>}

          {goal && (
            <div style={goalLine(accent)}>
              <Target accent={accent} />
              <div>
                <div style={{ ...TYPE.label, color: accent, marginBottom: 2 }}>
                  {understand.goalLabel || 'Goal'}
                </div>
                <p style={{ ...bodyStyle, color: GENERAL.cinematic.textPrimary }}>{goal}</p>
              </div>
            </div>
          )}

          {whyGoal && (
            <WhyCallout label="Why this matters" accent={accent}>
              {whyGoal}
            </WhyCallout>
          )}
        </div>
      )}

      {decision && (
        <div style={styles.sectionWithDivider}>
          <SectionHeading>{decision.label || 'Choose the first move'}</SectionHeading>
          <p style={{ ...bodyStyle, color: GENERAL.cinematic.textPrimary }}>
            {decision.question}
          </p>
          {decision.support && (
            <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>{decision.support}</p>
          )}
          <div style={{ marginTop: SPACING.compact }}>
            <OrientationChoiceList
              decision={decision}
              accent={accent}
              onResolved={() => setResolved(true)}
            />
          </div>
        </div>
      )}

      <PhaseActions
        onContinue={onContinue}
        accent={accent}
        disabled={Boolean(decision) && !resolved}
      />
    </>
  )
}

function buildFirstMoveDecision(steps) {
  const usableSteps = steps.filter(step => step?.title)
  if (usableSteps.length < 2) return null

  return {
    question: 'Which move should come first?',
    support: 'Choose the step that makes the later moves possible.',
    options: usableSteps.map((step, index) => ({
      label: step.title,
      feedback: index === 0
        ? step.whyStep || step.why || 'This is the first move that simplifies the calculation.'
        : 'That step may be useful later, but an earlier part of the calculation needs dealing with first.',
    })),
    correct: 0,
  }
}

function OrientationChoiceList({ decision, accent, onResolved }) {
  const { options = [], correct = 0 } = decision
  const [picked, setPicked] = useState(null)
  const resolved = picked === correct
  const pickedOption = picked === null ? null : options[picked]
  const pickedFeedback = getOptionFeedback(decision, pickedOption, picked === correct)

  function pick(index) {
    if (resolved) return
    setPicked(index)
    if (index === correct) onResolved?.()
  }

  return (
    <>
      <div style={choiceListStyle}>
        {options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label
          const isCorrect = resolved && index === correct
          const isWrong = picked === index && index !== correct

          return (
            <ChoiceButton
              key={`${label}-${index}`}
              label={label}
              index={index}
              isCorrect={isCorrect}
              isWrong={isWrong}
              accent={accent}
              disabled={resolved}
              onClick={() => pick(index)}
            />
          )
        })}
      </div>

      {picked !== null && (
        <div style={decisionFeedback(picked === correct, accent)} aria-live="polite">
          <div style={{ ...TYPE.label, color: picked === correct ? accent : GENERAL.feedbackIncorrect }}>
            {picked === correct ? 'Why this helps' : 'Not yet'}
          </div>
          <p style={{ ...bodyStyle, color: GENERAL.feedbackText, marginTop: SPACING.micro }}>
            {pickedFeedback}
          </p>
        </div>
      )}
    </>
  )
}

function getOptionFeedback(decision, option, isCorrect) {
  if (option && typeof option === 'object' && option.feedback) return option.feedback
  if (isCorrect) return decision.correctFeedback || 'That gives us a useful first step.'
  return decision.incorrectFeedback || 'That is not the most useful first move yet. Try another option.'
}

// ─── Phase 2 — worked / your-turn step ───────────────────────────────────────
function StepPhase({ step, stepIndex, accent, onContinue, onBack }) {
  const {
    title,
    why,
    transform,
    whyStep,
    check,
    mode = 'worked',
    answer,
    hint,
    resultExpr,
    reasoning,
    cta = 'Continue',
  } = step

  const [checkDone, setCheckDone] = useState(false)
  const [solved, setSolved] = useState(false)

  const gateReady = mode === 'yourTurn'
    ? solved
    : check
      ? checkDone
      : true

  const reasoningItems = reasoningToItems(reasoning)

  return (
    <>
      <div style={styles.stepLead}>
        <h2 style={styles.stepTitle}>{title}</h2>
        {why && <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>{why}</p>}
      </div>

      {transform && (
        <EquationTransform
          transform={transform}
          accent={accent}
          revealResult={mode !== 'yourTurn'}
        />
      )}

      {whyStep && (
        <div style={styles.sectionWithDivider}>
          <WhyCallout label="Why this step" accent={accent}>
            {whyStep}
          </WhyCallout>
        </div>
      )}

      {reasoningItems.length > 0 && (
        <div style={styles.sectionWithDivider}>
          <ReasoningPanel items={reasoningItems} accent={accent} />
        </div>
      )}

      {mode === 'yourTurn' ? (
        <YourTurn
          answer={answer}
          hint={hint}
          resultExpr={resultExpr}
          accent={accent}
          onSolved={() => setSolved(true)}
        />
      ) : check ? (
        <div style={styles.sectionWithDivider}>
          <SectionHeading>Check this step</SectionHeading>
          <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>{check.question}</p>
          <ChoiceList check={check} accent={accent} mono onResolved={() => setCheckDone(true)} />
        </div>
      ) : null}

      <PhaseActions
        onContinue={onContinue}
        onBack={onBack}
        accent={accent}
        label={cta}
        disabled={!gateReady}
      />
    </>
  )
}

function YourTurn({ answer, hint, resultExpr, accent, onSolved }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState(null)
  const [showHint, setShowHint] = useState(false)

  function check() {
    const normalise = input => String(input ?? '').replace(/\s+/g, '').toLowerCase()
    if (normalise(value) === normalise(answer)) {
      setStatus('correct')
      onSolved?.()
    } else {
      setStatus('wrong')
    }
  }

  const solved = status === 'correct'

  return (
    <div style={styles.sectionWithDivider}>
      <SectionHeading>Your turn</SectionHeading>
      <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>
        {solved && resultExpr ? 'Correct — here it is written out:' : 'What’s the result?'}
      </p>

      {solved && resultExpr ? (
        <div style={{ padding: `${SPACING.micro}px 0` }}>
          <MathLine expr={resultExpr} size={26} accent={accent} />
        </div>
      ) : (
        <input
          value={value}
          onChange={event => {
            setValue(event.target.value)
            if (status) setStatus(null)
          }}
          onKeyDown={event => event.key === 'Enter' && check()}
          placeholder="Type your answer"
          aria-label="Your answer"
          style={inputStyle(status, accent)}
        />
      )}

      {status === 'wrong' && (
        <p style={{ ...TYPE.bodySmall, color: GENERAL.feedbackIncorrect, margin: `${SPACING.micro}px 0 0` }}>
          Not quite — try again.
        </p>
      )}

      {!solved && (
        <CheckAnswerCTA
          onClick={check}
          accent={accent}
          label="Check my answer"
          disabled={!value.trim()}
          style={{ marginTop: SPACING.compact }}
        />
      )}

      {hint && !solved && (
        <div style={{ marginTop: SPACING.compact }}>
          <button type="button" onClick={() => setShowHint(current => !current)} style={hintToggle(accent)}>
            <Lightbulb accent={accent} />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHint && (
            <p style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, margin: `${SPACING.micro}px 0 0` }}>
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Phase 3 — the solution ──────────────────────────────────────────────────
function SolutionPhase({ solution, steps, accent, onContinue, onBack }) {
  const { result, why, celebrateTitle = 'Solved', celebrateSubtitle } = solution || {}
  const rows = solution?.rows
    ?? steps
      .filter(step => step.transform?.from && step.transform?.to)
      .map(step => ({ title: step.title, from: step.transform.from, to: step.transform.to }))

  return (
    <>
      <div style={styles.solutionHero}>
        <div style={{ ...TYPE.displaySection, color: GENERAL.cinematic.textPrimary }}>
          {celebrateTitle}
        </div>
        {celebrateSubtitle && (
          <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>{celebrateSubtitle}</p>
        )}
        {result && (
          <div style={resultLine(accent)}>
            <MathLine expr={result} size={32} accent={accent} />
          </div>
        )}
      </div>

      {rows?.length > 0 && (
        <div style={styles.sectionWithDivider}>
          <SectionHeading>Full solution</SectionHeading>
          <ol style={styles.solutionList}>
            {rows.map((row, index) => (
              <li key={`${row.title}-${index}`} style={styles.solutionRow}>
                <span style={stepNumber(accent)}>{index + 1}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textPrimary, fontWeight: 600 }}>
                    {row.title}
                  </div>
                  <div style={styles.solutionMathRow}>
                    <MathLine expr={row.from} size={15} align="left" muted />
                    <Arrow accent={accent} />
                    <MathLine expr={row.to} size={15} align="left" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {why && (
        <div style={styles.sectionWithDivider}>
          <WhyCallout label="Why this works" accent={accent}>{why}</WhyCallout>
        </div>
      )}

      <PhaseActions
        onContinue={onContinue}
        onBack={onBack}
        accent={accent}
        label="Next challenge"
      />
    </>
  )
}

// ─── Shared pieces ───────────────────────────────────────────────────────────
function EquationHero({ expr, accent }) {
  if (!expr) return null
  return (
    <div style={styles.equationHero}>
      <span style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted }}>Question</span>
      <div style={{ marginTop: SPACING.compact }}>
        <MathLine expr={expr} size={31} accent={accent} wrap />
      </div>
    </div>
  )
}

function EquationTransform({ transform, accent, revealResult = true }) {
  const { from, leftOp, rightOp, to } = transform
  return (
    <div style={styles.transformStage}>
      <MathLine expr={from} size={24} />
      {(leftOp || rightOp) && (
        <div style={styles.operationRow}>
          <span style={opTag(accent)}>{leftOp}</span>
          <span style={opTag(accent)}>{rightOp}</span>
        </div>
      )}
      {to && revealResult && (
        <>
          <ChevronDown accent={accent} />
          <MathLine expr={to} size={25} accent={accent} />
        </>
      )}
    </div>
  )
}

function ChoiceList({ check, accent, mono = false, onResolved }) {
  const { options = [], correct = 0 } = check
  const [picked, setPicked] = useState(null)
  const resolved = picked === correct

  function pick(index) {
    if (resolved) return
    setPicked(index)
    if (index === correct) onResolved?.()
  }

  return (
    <div style={choiceListStyle}>
      {options.map((option, index) => (
        <ChoiceButton
          key={`${option}-${index}`}
          label={option}
          index={index}
          isCorrect={resolved && index === correct}
          isWrong={picked === index && index !== correct}
          accent={accent}
          mono={mono}
          disabled={resolved}
          onClick={() => pick(index)}
        />
      ))}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  viewport: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  titleBlock: {
    flexShrink: 0,
    padding: `${SPACING.micro}px 0 ${SPACING.standard}px`,
  },
  screenIntro: {
    ...TYPE.body,
    color: GENERAL.cinematic.textSecondary,
    margin: 0,
    maxWidth: '34ch',
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingBottom: `calc(${SPACING.cinematic}px + env(safe-area-inset-bottom, 0px))`,
  },
  equationHero: {
    padding: `${SPACING.separation}px ${SPACING.standard}px ${SPACING.cinematic}px`,
    textAlign: 'center',
  },
  section: {
    padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
  },
  sectionWithDivider: {
    padding: `${SPACING.standard}px`,
    borderTop: `1px solid ${GENERAL.line.soft}`,
  },
  stepLead: {
    padding: `${SPACING.compact}px ${SPACING.standard}px ${SPACING.standard}px`,
  },
  stepTitle: {
    ...TYPE.displaySection,
    color: GENERAL.cinematic.textPrimary,
    margin: 0,
  },
  transformStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.micro,
    padding: `${SPACING.separation}px ${SPACING.standard}px ${SPACING.cinematic}px`,
  },
  operationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 230,
  },
  solutionHero: {
    padding: `${SPACING.compact}px ${SPACING.standard}px ${SPACING.cinematic}px`,
    textAlign: 'center',
  },
  solutionList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.standard,
  },
  solutionRow: {
    display: 'flex',
    gap: SPACING.compact,
    alignItems: 'flex-start',
  },
  solutionMathRow: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.micro,
    flexWrap: 'wrap',
    marginTop: SPACING.micro,
  },
}

function stageFrame(accentRgb) {
  return {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: RADII.large,
    border: `1px solid ${GENERAL.line.medium}`,
    background: `radial-gradient(circle at 50% 0%, rgba(${accentRgb},0.075), transparent 34%), linear-gradient(180deg, ${GENERAL.backgroundSurface} 0%, ${GENERAL.backgroundSunken} 100%)`,
    boxShadow: `inset 0 1px 0 ${GENERAL.line.soft}, ${GENERAL.shadow.raised}`,
  }
}

function goalLine(accent) {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.compact,
    marginTop: SPACING.standard,
    paddingTop: SPACING.standard,
    borderTop: `1px solid ${GENERAL.line.soft}`,
    color: accent,
  }
}

function decisionFeedback(isCorrect, accent) {
  return {
    marginTop: SPACING.compact,
    padding: `${SPACING.compact}px 0 0 ${SPACING.compact}px`,
    borderTop: `1px solid ${GENERAL.line.soft}`,
    borderLeft: `2px solid ${isCorrect ? accent : GENERAL.feedbackIncorrect}`,
  }
}

function inputStyle(status, accent) {
  const border = status === 'correct'
    ? accent
    : status === 'wrong'
      ? GENERAL.feedbackIncorrect
      : GENERAL.line.strong

  return {
    ...TYPE.body,
    color: GENERAL.cinematic.textPrimary,
    fontWeight: 600,
    width: '100%',
    height: 54,
    padding: `0 ${SPACING.compact}px`,
    borderRadius: RADII.medium,
    border: `1.5px solid ${border}`,
    background: GENERAL.backgroundSunken,
    outline: 'none',
    boxSizing: 'border-box',
  }
}

function hintToggle(accent) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.micro,
    ...TYPE.bodySmall,
    fontWeight: 600,
    color: accent,
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  }
}

function resultLine(accent) {
  return {
    marginTop: SPACING.standard,
    paddingTop: SPACING.standard,
    borderTop: `1px solid ${accent}40`,
  }
}

function stepNumber(accent) {
  return {
    ...TYPE.caption,
    fontWeight: 700,
    width: 24,
    height: 24,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.pill,
    border: `1px solid ${accent}`,
    color: accent,
  }
}
