import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ─── CalculationBreakdown ────────────────────────────────────────────────────
//
// Full-screen, multi-phase maths walkthrough: it breaks one calculation into
// simple stages and checks understanding as the learner moves through it.
//
//   understand  → the question, what's happening, a goal, a check
//   worked step → the examiner shows a transformation + why + a "check this step"
//   your-turn   → the learner applies the next step themselves (typed answer)
//   solution    → the full solution, why it works, and what's next
//
// Content lives entirely in the `block` prop so the mechanic is reusable across
// every Maths topic. Accent defaults to the interface teal (matching the
// reference design) and is overridable per subject.
//
// Labels are sentence case by design — the eyebrow pattern is prohibited
// (TYPOGRAPHY_SYSTEM.md, "Label case"). Equations render in Sora (the app's
// only body face) at a calm, larger size rather than a separate maths face.

export default function CalculationBreakdown({ block, accent = GENERAL.teal, onContinue }) {
  const {
    goalPrompt = 'Solve for x',
    problem = '',
    understand = {},
    steps = [],
    solution = {},
  } = block || {}

  // Phase list: understand → each step → solution.
  const phases = [
    { kind: 'understand' },
    ...steps.map((step, i) => ({ kind: 'step', step, stepIndex: i })),
    { kind: 'solution' },
  ]
  const total = phases.length

  const [phaseIdx, setPhaseIdx] = useState(0)
  const phase = phases[phaseIdx]

  const isFirst = phaseIdx === 0
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
      {/* Header: back · title · bookmark */}
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

// ─── Phase 1 — understand the question ───────────────────────────────────────
function UnderstandPhase({ goalPrompt, problem, understand, accent, onContinue }) {
  const { whatsHappening, goal, check } = understand
  const [answered, setAnswered] = useState(false)

  return (
    <>
      <Card>
        <FieldLabel>Question</FieldLabel>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.slate, marginBottom: SPACING.compact }}>
          {goalPrompt}:
        </div>
        <MathLine expr={problem} size={26} />
      </Card>

      {whatsHappening && (
        <Card>
          <FieldLabel>What's happening</FieldLabel>
          <p style={bodyStyle}>{whatsHappening}</p>
          {goal && (
            <div style={goalChip(accent)}>
              <Target accent={accent} />
              <span style={{ ...TYPE.bodySmall, color: GENERAL.softWhite, fontWeight: 600 }}>
                Goal: {goal}
              </span>
            </div>
          )}
        </Card>
      )}

      {check && (
        <Card>
          <FieldLabel>Check your understanding</FieldLabel>
          <p style={{ ...bodyStyle, marginBottom: SPACING.compact }}>{check.question}</p>
          <ChoiceList check={check} accent={accent} onResolved={() => setAnswered(true)} />
        </Card>
      )}

      <ContinueCTA
        onClick={onContinue}
        accent={accent}
        disabled={Boolean(check) && !answered}
        style={{ marginTop: SPACING.micro }}
      />
    </>
  )
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
  const [status, setStatus] = useState(null) // null | 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false)

  function check() {
    const norm = s => String(s ?? '').replace(/\s+/g, '').toLowerCase()
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
            onChange={e => { setValue(e.target.value); if (status) setStatus(null) }}
            onKeyDown={e => e.key === 'Enter' && check()}
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
          <button onClick={() => setShowHint(h => !h)} style={hintToggle(accent)}>
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
  // Prefer an explicit full-solution list; otherwise derive from the steps.
  const rows = solution?.rows
    ?? steps
      .filter(s => s.transform?.from && s.transform?.to)
      .map(s => ({ title: s.title, from: s.transform.from, to: s.transform.to }))

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
            {rows.map((row, i) => (
              <li key={i} style={{ display: 'flex', gap: SPACING.compact, marginBottom: i === rows.length - 1 ? 0 : SPACING.compact }}>
                <span style={stepNumber(accent)}>{i + 1}</span>
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

// Multiple-choice check. Reveals the correct answer once tapped; a wrong tap
// shows which option is wrong and keeps the correct one highlighted.
function ChoiceList({ check, accent, mono = false, onResolved }) {
  const { options = [], correct = 0 } = check
  const [picked, setPicked] = useState(null)
  const resolved = picked === correct

  function pick(i) {
    if (resolved) return
    setPicked(i)
    if (i === correct) onResolved?.()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
      {options.map((opt, i) => {
        const isCorrect = resolved && i === correct
        const isWrong = picked === i && i !== correct
        const border = isCorrect ? accent : isWrong ? GENERAL.feedbackIncorrect : GENERAL.line.strong
        const bg = isCorrect ? `${accent}1F` : isWrong ? `rgba(${GENERAL.feedbackIncorrectRgb},0.12)` : GENERAL.line.faint
        return (
          <button key={i} onClick={() => pick(i)} disabled={resolved} style={{ ...choiceRow, borderColor: border, background: bg, cursor: resolved ? 'default' : 'pointer' }}>
            <span style={choiceBadge(isCorrect || isWrong ? border : GENERAL.slate)}>
              {String.fromCharCode(65 + i)}
            </span>
            <span style={{
              ...(mono ? { ...TYPE.body, fontStyle: 'italic' } : TYPE.body),
              color: GENERAL.softWhite, flex: 1, textAlign: 'left', minWidth: 0,
            }}>
              {opt}
            </span>
            {isCorrect && <Check accent={accent} />}
          </button>
        )
      })}
    </div>
  )
}

// A worked transformation: top line, optional per-side operations, a downward
// step, then the resulting line — the visual grammar of "do the same to both
// sides" that the reference leans on.
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

// Equation line. Rendered in Sora (the app body face) at a calm larger size —
// mathematical notation, not decorative type.
function MathLine({ expr, size = 22, accent, align = 'center', muted = false }) {
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
      whiteSpace: 'nowrap',
    }}>
      {expr}
    </div>
  )
}

function Card({ children }) {
  return <div style={cardStyle}>{children}</div>
}

function FieldLabel({ children }) {
  return <div style={{ ...TYPE.label, color: GENERAL.slate, marginBottom: SPACING.micro }}>{children}</div>
}

function ProgressRail({ total, index, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `0 ${SPACING.standard}px ${SPACING.compact}px`, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < index
        const active = i === index
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: active ? 9 : 7,
              height: active ? 9 : 7,
              borderRadius: RADII.pill,
              background: done || active ? accent : GENERAL.line.strong,
              transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
            }} />
            {i < total - 1 && (
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
      width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: 'none', color: GENERAL.slate, cursor: 'pointer', padding: 0, flexShrink: 0,
    }}>
      {children}
    </button>
  )
}

// ─── Inline icons (SVG, currentColor / accent) ───────────────────────────────
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
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    background: GENERAL.backgroundApp,
    color: GENERAL.softWhite,
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: SPACING.micro,
    padding: `max(${SPACING.compact}px, env(safe-area-inset-top)) ${SPACING.compact}px ${SPACING.compact}px`,
  },
  body: {
    flex: 1, overflowY: 'auto',
    padding: `0 ${SPACING.compact}px calc(${SPACING.separation}px + env(safe-area-inset-bottom))`,
    display: 'flex', flexDirection: 'column', gap: SPACING.compact,
  },
}

const cardStyle = {
  background: GENERAL.backgroundSurface,
  border: `1px solid ${GENERAL.line.soft}`,
  borderRadius: RADII.medium,
  padding: SPACING.compact,
}

const bodyStyle = { ...TYPE.bodySmall, color: GENERAL.slate, margin: 0 }

const choiceRow = {
  display: 'flex', alignItems: 'center', gap: SPACING.micro,
  border: '1px solid', borderRadius: RADII.small,
  padding: `${SPACING.micro + 2}px ${SPACING.compact}px`,
  transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
}

const choiceBadge = borderColor => ({
  ...TYPE.caption, fontWeight: 700,
  width: 22, height: 22, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: RADII.pill,
  border: `1px solid ${borderColor}`,
  color: borderColor,
})

function goalChip(accent) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: SPACING.micro,
    marginTop: SPACING.compact,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    borderRadius: RADII.small,
    background: `${accent}14`,
    border: `1px solid ${accent}40`,
  }
}

function opTag(accent) {
  return {
    fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 500,
    color: accent, minWidth: 40, textAlign: 'center',
  }
}

function inputStyle(status, accent) {
  const border =
    status === 'correct' ? accent
    : status === 'wrong' ? GENERAL.feedbackIncorrect
    : GENERAL.line.strong
  return {
    ...TYPE.body, color: GENERAL.softWhite, fontWeight: 600,
    width: '100%', height: 52,
    padding: `0 ${SPACING.compact}px`,
    borderRadius: RADII.small,
    border: `1.5px solid ${border}`,
    background: GENERAL.backgroundSunken,
    outline: 'none',
  }
}

function hintToggle(accent) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    ...TYPE.bodySmall, fontWeight: 600, color: accent,
    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
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
    ...TYPE.caption, fontWeight: 700,
    width: 22, height: 22, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: RADII.pill,
    border: `1px solid ${accent}`,
    color: accent,
  }
}
