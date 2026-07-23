import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ─── CalculationBreakdown ────────────────────────────────────────────────────
//
// Full-screen, multi-phase maths walkthrough. Content lives entirely in the
// `block` prop so the mechanic can support equations, percentages, fractions,
// geometry and other calculations without knowing the topic itself.
//
// The opening phase has one job: help the learner understand what the question
// wants, why that goal matters and which useful decision comes first.

export default function CalculationBreakdown({ block, accent = GENERAL.teal, onContinue }) {
  const {
    goalPrompt = 'Work out the answer',
    problem = '',
    understand = {},
    steps = [],
    solution = {},
  } = block || {}

  const phases = [
    { kind: 'understand' },
    ...steps.map((step, i) => ({ kind: 'step', step, stepIndex: i })),
    { kind: 'solution' },
  ]
  const total = phases.length

  const [phaseIdx, setPhaseIdx] = useState(0)
  const phase = phases[phaseIdx]
  const stepCount = steps.length

  function advance() {
    if (phaseIdx < total - 1) setPhaseIdx(phaseIdx + 1)
    else onContinue?.()
  }

  function back() {
    if (phaseIdx > 0) setPhaseIdx(phaseIdx - 1)
    else onContinue?.()
  }

  const title =
    phase.kind === 'understand' ? 'Break it down'
    : phase.kind === 'solution' ? 'Solution'
    : `Step ${phase.stepIndex + 1} of ${stepCount}`

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <IconButton label="Go back" onClick={back}>
          <ChevronLeft />
        </IconButton>
        <div style={{ ...TYPE.titleMedium, color: GENERAL.softWhite, textAlign: 'center', flex: 1 }}>
          {title}
        </div>
        <IconButton label="Bookmark" onClick={() => {}}>
          <Bookmark />
        </IconButton>
      </div>

      <ProgressRail total={total} index={phaseIdx} accent={accent} />

      <div style={styles.body}>
        {phase.kind === 'understand' && (
          <UnderstandPhase
            goalPrompt={goalPrompt}
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
          />
        )}
        {phase.kind === 'solution' && (
          <SolutionPhase
            solution={solution}
            steps={steps}
            accent={accent}
            onContinue={advance}
          />
        )}
      </div>
    </div>
  )
}

// ─── Phase 1 — orient the learner ─────────────────────────────────────────────
function UnderstandPhase({ goalPrompt, problem, understand, steps, accent, onContinue }) {
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
      <Card emphasis accent={accent}>
        <FieldLabel>{understand.questionLabel || 'Question'}</FieldLabel>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.slate, marginBottom: SPACING.compact }}>
          {goalPrompt}
        </div>
        <MathLine expr={problem} size={30} wrap />

        {(intro || goal || whyGoal) && (
          <div style={orientationDivider}>
            <FieldLabel>{understand.heading || 'What are we trying to do?'}</FieldLabel>
            {intro && <p style={bodyStyle}>{intro}</p>}

            {goal && (
              <div style={goalChip(accent)}>
                <Target accent={accent} />
                <span style={{ ...TYPE.bodySmall, color: GENERAL.softWhite, fontWeight: 600 }}>
                  {understand.goalLabel || 'Goal'}: {goal}
                </span>
              </div>
            )}

            {whyGoal && (
              <div style={whyGoalRow(accent)}>
                <Lightbulb accent={accent} />
                <div>
                  <div style={{ ...TYPE.label, color: accent, marginBottom: 2 }}>Why this matters</div>
                  <p style={bodyStyle}>{whyGoal}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {decision && (
        <Card>
          <FieldLabel>{decision.label || 'Choose the first move'}</FieldLabel>
          <p style={{ ...bodyStyle, color: GENERAL.softWhite, marginBottom: SPACING.micro }}>
            {decision.question}
          </p>
          {decision.support && (
            <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>{decision.support}</p>
          )}
          <OrientationChoiceList
            decision={decision}
            accent={accent}
            onResolved={() => setResolved(true)}
          />
        </Card>
      )}

      {(!decision || resolved) && (
        <ContinueCTA
          onClick={onContinue}
          accent={accent}
          style={{ marginTop: SPACING.micro }}
        />
      )}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
        {options.map((option, index) => {
          const label = typeof option === 'string' ? option : option.label
          const isCorrect = resolved && index === correct
          const isWrong = picked === index && index !== correct
          const border = isCorrect ? accent : isWrong ? GENERAL.feedbackIncorrect : GENERAL.line.strong
          const background = isCorrect
            ? `${accent}1F`
            : isWrong
              ? `rgba(${GENERAL.feedbackIncorrectRgb},0.12)`
              : GENERAL.line.faint

          return (
            <button
              key={`${label}-${index}`}
              onClick={() => pick(index)}
              disabled={resolved}
              style={{
                ...choiceRow,
                borderColor: border,
                background,
                cursor: resolved ? 'default' : 'pointer',
              }}
            >
              <span style={choiceBadge(isCorrect || isWrong ? border : GENERAL.slate)}>
                {String.fromCharCode(65 + index)}
              </span>
              <span style={{ ...TYPE.body, color: GENERAL.softWhite, flex: 1, textAlign: 'left', minWidth: 0 }}>
                {label}
              </span>
              {isCorrect && <Check accent={accent} />}
            </button>
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
function StepPhase({ step, stepIndex, accent, onContinue }) {
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
    cta = 'Continue',
  } = step

  const [checkDone, setCheckDone] = useState(false)
  const [solved, setSolved] = useState(false)

  const gateReady =
    mode === 'yourTurn' ? solved
    : check ? checkDone
    : true

  return (
    <>
      <Card>
        <FieldLabel>Step {stepIndex + 1}</FieldLabel>
        <h2 style={{ ...TYPE.displayCard, color: GENERAL.softWhite, margin: `0 0 ${SPACING.micro}px` }}>
          {title}
        </h2>
        {why && <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>{why}</p>}
        {transform && <WorkedTransform transform={transform} accent={accent} revealResult={mode !== 'yourTurn'} />}
      </Card>

      {whyStep && (
        <Card>
          <FieldLabel>Why this step</FieldLabel>
          <p style={bodyStyle}>{whyStep}</p>
        </Card>
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
        <Card>
          <FieldLabel>Check this step</FieldLabel>
          <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>{check.question}</p>
          <ChoiceList check={check} accent={accent} mono onResolved={() => setCheckDone(true)} />
        </Card>
      ) : null}

      {mode !== 'yourTurn' && (
        <ContinueCTA
          onClick={onContinue}
          accent={accent}
          label={cta}
          disabled={!gateReady}
          style={{ marginTop: SPACING.micro }}
        />
      )}
      {mode === 'yourTurn' && solved && (
        <ContinueCTA onClick={onContinue} accent={accent} label={cta} style={{ marginTop: SPACING.micro }} />
      )}
    </>
  )
}

function YourTurn({ answer, hint, resultExpr, accent, onSolved }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState(null)
  const [showHint, setShowHint] = useState(false)

  function check() {
    const norm = valueToNormalise => String(valueToNormalise ?? '').replace(/\s+/g, '').toLowerCase()
    if (norm(value) === norm(answer)) {
      setStatus('correct')
      onSolved?.()
    } else {
      setStatus('wrong')
    }
  }

  const solved = status === 'correct'

  return (
    <Card>
      <FieldLabel>Your turn</FieldLabel>
      <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>
        {solved && resultExpr ? 'Correct — here it is written out:' : 'What’s the result?'}
      </p>

      {solved && resultExpr ? (
        <MathLine expr={resultExpr} size={24} accent={accent} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
          <input
            value={value}
            onChange={event => { setValue(event.target.value); if (status) setStatus(null) }}
            onKeyDown={event => event.key === 'Enter' && check()}
            placeholder="x = ?"
            aria-label="Your answer"
            style={inputStyle(status, accent)}
          />
        </div>
      )}

      {status === 'wrong' && (
        <p style={{ ...TYPE.bodySmall, color: GENERAL.feedbackIncorrect, marginTop: SPACING.micro }}>
          Not quite — try again.
        </p>
      )}

      {!solved && (
        <ContinueCTA
          onClick={check}
          accent={accent}
          label="Check my answer"
          disabled={!value.trim()}
          style={{ marginTop: SPACING.compact }}
        />
      )}

      {hint && !solved && (
        <div style={{ marginTop: SPACING.compact }}>
          <button onClick={() => setShowHint(current => !current)} style={hintToggle(accent)}>
            <Lightbulb accent={accent} />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHint && (
            <p style={{ ...TYPE.bodySmall, color: GENERAL.slate, marginTop: SPACING.micro }}>{hint}</p>
          )}
        </div>
      )}
    </Card>
  )
}

// ─── Phase 3 — the solution ──────────────────────────────────────────────────
function SolutionPhase({ solution, steps, accent, onContinue }) {
  const { result, why, celebrateTitle = 'Well done!', celebrateSubtitle } = solution || {}
  const rows = solution?.rows
    ?? steps
      .filter(step => step.transform?.from && step.transform?.to)
      .map(step => ({ title: step.title, from: step.transform.from, to: step.transform.to }))

  return (
    <>
      <div style={{ textAlign: 'center', padding: `${SPACING.compact}px 0 ${SPACING.micro}px` }}>
        <div style={{ ...TYPE.displaySection, color: accent, marginBottom: 4 }}>{celebrateTitle}</div>
        {celebrateSubtitle && (
          <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{celebrateSubtitle}</div>
        )}
        {result && (
          <div style={resultBox(accent)}>
            <MathLine expr={result} size={30} accent={accent} />
          </div>
        )}
      </div>

      {rows?.length > 0 && (
        <Card>
          <FieldLabel>Full solution</FieldLabel>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {rows.map((row, index) => (
              <li
                key={`${row.title}-${index}`}
                style={{
                  display: 'flex',
                  gap: SPACING.compact,
                  marginBottom: index === rows.length - 1 ? 0 : SPACING.compact,
                }}
              >
                <span style={stepNumber(accent)}>{index + 1}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ ...TYPE.bodySmall, color: GENERAL.softWhite, fontWeight: 600, marginBottom: 4 }}>
                    {row.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, flexWrap: 'wrap' }}>
                    <MathLine expr={row.from} size={15} align="left" muted />
                    <Arrow accent={accent} />
                    <MathLine expr={row.to} size={15} align="left" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {why && (
        <Card>
          <FieldLabel>Why this works</FieldLabel>
          <p style={bodyStyle}>{why}</p>
        </Card>
      )}

      <ContinueCTA onClick={onContinue} accent={accent} label="Next challenge" style={{ marginTop: SPACING.micro }} />
    </>
  )
}

// ─── Shared pieces ───────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
      {options.map((option, index) => {
        const isCorrect = resolved && index === correct
        const isWrong = picked === index && index !== correct
        const border = isCorrect ? accent : isWrong ? GENERAL.feedbackIncorrect : GENERAL.line.strong
        const background = isCorrect
          ? `${accent}1F`
          : isWrong
            ? `rgba(${GENERAL.feedbackIncorrectRgb},0.12)`
            : GENERAL.line.faint

        return (
          <button
            key={`${option}-${index}`}
            onClick={() => pick(index)}
            disabled={resolved}
            style={{ ...choiceRow, borderColor: border, background, cursor: resolved ? 'default' : 'pointer' }}
          >
            <span style={choiceBadge(isCorrect || isWrong ? border : GENERAL.slate)}>
              {String.fromCharCode(65 + index)}
            </span>
            <span style={{
              ...(mono ? { ...TYPE.body, fontStyle: 'italic' } : TYPE.body),
              color: GENERAL.softWhite,
              flex: 1,
              textAlign: 'left',
              minWidth: 0,
            }}>
              {option}
            </span>
            {isCorrect && <Check accent={accent} />}
          </button>
        )
      })}
    </div>
  )
}

function WorkedTransform({ transform, accent, revealResult = true }) {
  const { from, leftOp, rightOp, to } = transform
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: `${SPACING.micro}px 0` }}>
      <MathLine expr={from} size={22} />
      {(leftOp || rightOp) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 220 }}>
          <span style={opTag(accent)}>{leftOp}</span>
          <span style={opTag(accent)}>{rightOp}</span>
        </div>
      )}
      {to && revealResult && (
        <>
          <ChevronDown accent={accent} />
          <MathLine expr={to} size={22} />
        </>
      )}
    </div>
  )
}

function MathLine({ expr, size = 22, accent, align = 'center', muted = false, wrap = false }) {
  if (!expr) return null
  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      fontSize: size,
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.3,
      textAlign: align,
      color: muted ? GENERAL.slate : accent || GENERAL.softWhite,
      whiteSpace: wrap ? 'normal' : 'nowrap',
      overflowWrap: wrap ? 'anywhere' : 'normal',
    }}>
      {expr}
    </div>
  )
}

function Card({ children, emphasis = false, accent }) {
  return (
    <div style={{
      ...cardStyle,
      ...(emphasis && accent ? { borderColor: `${accent}40` } : {}),
    }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }) {
  return <div style={{ ...TYPE.label, color: GENERAL.slate, marginBottom: SPACING.micro }}>{children}</div>
}

function ProgressRail({ total, index, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `0 ${SPACING.standard}px ${SPACING.compact}px`, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, railIndex) => {
        const done = railIndex < index
        const active = railIndex === index
        return (
          <div key={railIndex} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: active ? 9 : 7,
              height: active ? 9 : 7,
              borderRadius: RADII.pill,
              background: done || active ? accent : GENERAL.line.strong,
              transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
            }} />
            {railIndex < total - 1 && (
              <span style={{ width: 14, height: 2, borderRadius: RADII.pill, background: done ? accent : GENERAL.line.soft }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function IconButton({ children, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: 34,
      height: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      color: GENERAL.slate,
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
    }}>
      {children}
    </button>
  )
}

// ─── Inline icons ─────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
)
const Bookmark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
)
const ChevronDown = ({ accent }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
)
const Arrow = ({ accent }) => (
  <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
)
const Check = ({ accent }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)
const Target = ({ accent }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
)
const Lightbulb = ({ accent }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2a7 7 0 0 0-4-12z" /></svg>
)

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  screen: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: GENERAL.backgroundApp,
    color: GENERAL.softWhite,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.micro,
    padding: `max(${SPACING.compact}px, env(safe-area-inset-top)) ${SPACING.compact}px ${SPACING.compact}px`,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: `0 ${SPACING.compact}px calc(${SPACING.separation}px + env(safe-area-inset-bottom))`,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.compact,
  },
}

const cardStyle = {
  background: GENERAL.backgroundSurface,
  border: `1px solid ${GENERAL.line.soft}`,
  borderRadius: RADII.medium,
  padding: SPACING.compact,
}

const bodyStyle = { ...TYPE.bodySmall, color: GENERAL.slate, margin: 0 }

const orientationDivider = {
  marginTop: SPACING.standard,
  paddingTop: SPACING.compact,
  borderTop: `1px solid ${GENERAL.line.soft}`,
}

const choiceRow = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.micro,
  border: '1px solid',
  borderRadius: RADII.small,
  padding: `${SPACING.micro + 2}px ${SPACING.compact}px`,
  transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
}

const choiceBadge = borderColor => ({
  ...TYPE.caption,
  fontWeight: 700,
  width: 22,
  height: 22,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: RADII.pill,
  border: `1px solid ${borderColor}`,
  color: borderColor,
})

function goalChip(accent) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.micro,
    marginTop: SPACING.compact,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    borderRadius: RADII.small,
    background: `${accent}14`,
    border: `1px solid ${accent}40`,
  }
}

function whyGoalRow(accent) {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.micro,
    marginTop: SPACING.compact,
    paddingTop: SPACING.compact,
    borderTop: `1px solid ${accent}24`,
  }
}

function decisionFeedback(isCorrect, accent) {
  return {
    marginTop: SPACING.compact,
    padding: SPACING.compact,
    borderRadius: RADII.small,
    border: `1px solid ${isCorrect ? `${accent}40` : GENERAL.feedbackIncorrect}`,
    background: isCorrect ? `${accent}10` : `rgba(${GENERAL.feedbackIncorrectRgb},0.08)`,
  }
}

function opTag(accent) {
  return {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16,
    fontWeight: 500,
    color: accent,
    minWidth: 40,
    textAlign: 'center',
  }
}

function inputStyle(status, accent) {
  const border =
    status === 'correct' ? accent
    : status === 'wrong' ? GENERAL.feedbackIncorrect
    : GENERAL.line.strong
  return {
    ...TYPE.body,
    color: GENERAL.softWhite,
    fontWeight: 600,
    width: '100%',
    height: 52,
    padding: `0 ${SPACING.compact}px`,
    borderRadius: RADII.small,
    border: `1.5px solid ${border}`,
    background: GENERAL.backgroundSunken,
    outline: 'none',
  }
}

function hintToggle(accent) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    ...TYPE.bodySmall,
    fontWeight: 600,
    color: accent,
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  }
}

function resultBox(accent) {
  return {
    display: 'inline-block',
    margin: `${SPACING.compact}px auto 0`,
    padding: `${SPACING.compact}px ${SPACING.separation}px`,
    borderRadius: RADII.medium,
    background: `${accent}14`,
    border: `1px solid ${accent}40`,
  }
}

function stepNumber(accent) {
  return {
    ...TYPE.caption,
    fontWeight: 700,
    width: 22,
    height: 22,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.pill,
    border: `1px solid ${accent}`,
    color: accent,
  }
}
