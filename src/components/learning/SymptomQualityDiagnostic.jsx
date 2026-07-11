import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import { CINEMATIC_LAB } from '../../constants/cinematicLabTheme.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ── SymptomQualityDiagnostic ────────────────────────────────────────────────
// Ten-beat cinematic diagnostic set: teaches Hot/Cold/Wet/Dry through example
// symptoms, walks one patient case, asks the learner to pick the dominant
// quadrant, asks a treatment multiple-choice question, then closes with the
// opposite-quality recall and a short legacy beat. No images — text and
// design-token surfaces only. See block shape in this file's header comment
// and docs/system/component-contracts/symptom-quality-diagnostic.md.

let _sqdStyled = false
function ensureStyles() {
  if (_sqdStyled) return
  _sqdStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes sqd-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes sqd-in-left {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes sqd-shake {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(5px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(3px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .sqd-motion { animation: none !important; }
    }
  `
  document.head.appendChild(el)
}

const ease = MOTION.easing.standard
function anim(name, duration = MOTION.duration.slow, delay = 0) {
  return `${name} ${duration} ${ease} ${delay}ms both`
}

// ── Shared layout primitives (follows TheoryLab.jsx's established pattern
//    for this genre of screen) ────────────────────────────────────────────

function Screen({ children }) {
  return (
    <div style={{ minHeight: '100dvh', background: CINEMATIC_LAB.background, position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

function Pad({ children }) {
  return (
    <div style={{
      maxWidth: CINEMATIC_LAB.screenMaxWidth,
      margin: '0 auto',
      padding: `${SPACING.cinematic}px ${SPACING.standard}px ${SPACING.section}px`,
    }}>
      {children}
    </div>
  )
}

function Label({ children, accent }) {
  return (
    <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.compact}px`, opacity: 0.85 }}>
      {children}
    </p>
  )
}

function ActionBtn({ label, onClick, accent, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: BUTTONS.continue.height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: disabled ? 'rgba(255,255,255,0.08)' : accent,
        border: 'none',
        borderRadius: BUTTONS.continue.borderRadius,
        color: disabled ? 'rgba(255,255,255,0.3)' : CINEMATIC_LAB.buttonTextOnAccent,
        fontFamily: BUTTONS.continue.fontFamily,
        fontSize: BUTTONS.continue.fontSize,
        fontWeight: BUTTONS.continue.fontWeight,
        cursor: disabled ? 'default' : 'pointer',
        transition: `transform ${BUTTONS.continue.transition}`,
      }}
    >
      {label}
    </button>
  )
}

// A single quality-teaching beat: the word, then its example symptoms fade
// in one at a time. Reused four times (hot, cold, wet, dry) — the one
// deliberately reusable sub-piece in this component.
function QualityBeat({ quality, symptoms, accent, onNext }) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= symptoms.length) return
    const delay = revealed === 0 ? 550 : 420
    const t = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed, symptoms.length])

  const label = quality.charAt(0).toUpperCase() + quality.slice(1)
  const allRevealed = revealed >= symptoms.length

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.displayHero,
          color: accent,
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in'),
        }}>
          {label}
        </p>

        <div style={{ marginBottom: SPACING.separation }}>
          {symptoms.slice(0, revealed).map((symptom) => (
            <div key={symptom} className="sqd-motion" style={{
              display: 'flex', alignItems: 'center', gap: SPACING.compact,
              marginBottom: SPACING.compact,
              animation: anim('sqd-in-left'),
            }}>
              <div style={{ width: CINEMATIC_LAB.dotSize, height: CINEMATIC_LAB.dotSize, borderRadius: '50%', background: accent, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ ...TYPE.bodyLarge, color: 'rgba(240,230,200,0.85)' }}>{symptom}</span>
            </div>
          ))}
        </div>

        {allRevealed && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
      </Pad>
    </Screen>
  )
}

// The patient case — the one worked example in this set. Symptoms reveal
// progressively, same pacing as QualityBeat, then a Continue.
function PatientBeat({ patient, accent, onNext }) {
  const symptoms = patient.symptoms || []
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= symptoms.length) return
    const delay = revealed === 0 ? 550 : 420
    const t = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed, symptoms.length])

  const allRevealed = revealed >= symptoms.length

  return (
    <Screen>
      <Pad>
        <Label accent={accent}>The patient</Label>
        <p className="sqd-motion" style={{
          ...TYPE.displaySection,
          color: CINEMATIC_LAB.creamText,
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in'),
        }}>
          {patient.title}
        </p>

        <div style={{ marginBottom: SPACING.separation }}>
          {symptoms.slice(0, revealed).map((symptom) => (
            <div key={symptom} className="sqd-motion" style={{
              display: 'flex', alignItems: 'center', gap: SPACING.compact,
              marginBottom: SPACING.compact,
              animation: anim('sqd-in-left'),
            }}>
              <div style={{ width: CINEMATIC_LAB.dotSize, height: CINEMATIC_LAB.dotSize, borderRadius: '50%', background: accent, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ ...TYPE.displayCard, color: CINEMATIC_LAB.creamText }}>{symptom}</span>
            </div>
          ))}
        </div>

        {allRevealed && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
      </Pad>
    </Screen>
  )
}

// Quadrant-select — bespoke choice UI (not AnswerInteraction), matching
// TheoryLab.jsx's ScenarioStage precedent for this genre.
function QuadrantBeat({ question, options, accent, rgb, onNext }) {
  const [selected, setSelected] = useState(null)
  const [shaking, setShaking] = useState(false)

  function handleSelect(idx) {
    if (selected !== null) return
    const opt = options[idx]
    setSelected(idx)
    if (opt?.correct) {
      setTimeout(onNext, 500)
    } else {
      setShaking(true)
      setTimeout(() => { setShaking(false); setSelected(null) }, 700)
    }
  }

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.label, color: `rgba(${rgb}, 0.85)`,
          margin: `0 0 ${SPACING.compact}px`,
          animation: anim('sqd-in'),
        }}>
          {question}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.compact }}>
          {options.map((opt, i) => {
            const isSelected = selected === i
            const isWrong = isSelected && shaking
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(i)}
                className={isWrong ? 'sqd-motion' : undefined}
                style={{
                  padding: `${SPACING.compact}px`,
                  background: isWrong ? CINEMATIC_LAB.wrongBg : isSelected ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isWrong ? CINEMATIC_LAB.wrongBorder : isSelected ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: RADII.small,
                  color: isWrong ? CINEMATIC_LAB.wrongText : isSelected ? accent : 'rgba(240,230,200,0.7)',
                  ...TYPE.buttonLarge,
                  cursor: 'pointer',
                  textAlign: 'center',
                  minHeight: CINEMATIC_LAB.optionMinHeight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: `background ${MOTION.duration.fast} ease, border-color ${MOTION.duration.fast} ease`,
                  animation: isWrong ? `sqd-shake ${MOTION.duration.slow} ${ease}` : 'none',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </Pad>
    </Screen>
  )
}

// Brief diagnosis confirmation — no interaction, sets up the treatment
// question that follows.
function DiagnosisBeat({ diagnosis, accent, onNext }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Diagnosis</Label>
        <p className="sqd-motion" style={{
          ...TYPE.displayHero,
          color: accent,
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in', MOTION.duration.cinematic),
        }}>
          {diagnosis.label}
        </p>
        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 300) }}>
          <ContinueCTA onClick={onNext} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

// Treatment multiple-choice question — one correct answer, feedback
// explains the reasoning. Bespoke choice UI, same rationale as QuadrantBeat.
function TreatmentBeat({ question, options, accent, rgb, onNext }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const chosen = answered ? options[selected] : null

  function handleSelect(idx) {
    if (answered) return
    setSelected(idx)
  }

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.displayCard, color: CINEMATIC_LAB.creamText,
          margin: `0 0 ${SPACING.standard}px`,
          animation: anim('sqd-in'),
        }}>
          {question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact, marginBottom: SPACING.standard }}>
          {options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect = opt.correct
            const revealState = answered && isCorrect
            const revealWrong = answered && isSelected && !isCorrect
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(i)}
                disabled={answered}
                style={{
                  padding: `${SPACING.compact}px`,
                  textAlign: 'left',
                  background: revealState ? `rgba(${rgb}, 0.14)` : revealWrong ? CINEMATIC_LAB.wrongBg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${revealState ? `rgba(${rgb}, 0.55)` : revealWrong ? CINEMATIC_LAB.wrongBorder : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: RADII.small,
                  color: revealState ? accent : revealWrong ? CINEMATIC_LAB.wrongText : 'rgba(240,230,200,0.75)',
                  ...TYPE.bodyStrong,
                  cursor: answered ? 'default' : 'pointer',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in'), marginBottom: SPACING.standard }}>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.6)', lineHeight: 1.6 }}>
              {chosen.explanation}
            </p>
          </div>
        )}

        {answered && chosen.correct && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
        {answered && !chosen.correct && (
          <ActionBtn label="Try again" onClick={() => setSelected(null)} accent={accent} />
        )}
      </Pad>
    </Screen>
  )
}

// Opposite-quality recall — the transformation reveal.
function OppositeRecallBeat({ recall, accent, rgb, onNext }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Restoring balance</Label>
        <div className="sqd-motion" style={{
          textAlign: 'center',
          padding: `${SPACING.standard}px`,
          background: `rgba(${rgb}, 0.06)`,
          border: `1px solid rgba(${rgb}, 0.18)`,
          borderRadius: RADII.medium,
          marginBottom: SPACING.separation,
          animation: anim('sqd-in'),
        }}>
          <p style={{ ...TYPE.displayCard, color: 'rgba(240,230,200,0.7)', margin: 0 }}>{recall.from}</p>
          <p style={{ ...TYPE.body, color: `rgba(${rgb}, 0.5)`, margin: `${SPACING.micro}px 0` }}>↓</p>
          <p style={{ ...TYPE.displayCard, color: CINEMATIC_LAB.creamText, margin: 0 }}>{recall.to}</p>
          <p style={{ ...TYPE.body, color: `rgba(${rgb}, 0.5)`, margin: `${SPACING.micro}px 0` }}>↓</p>
          <p style={{ ...TYPE.displaySection, color: accent, margin: 0 }}>{recall.result}</p>
        </div>
        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 200) }}>
          <ContinueCTA onClick={onNext} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

// Short closing beat — condensed from TheoryLab's two-beat evaluation into
// one: did the cure work, and why the Church kept the theory alive.
function ClosingBeat({ closing, accent, rgb, onComplete }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Did the cure work?</Label>

        {(closing.worked?.length > 0 || closing.limitation) && (
          <div className="sqd-motion" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.compact,
            marginBottom: SPACING.standard,
            animation: anim('sqd-in'),
          }}>
            {closing.worked?.length > 0 && (
              <div style={{
                padding: SPACING.compact,
                background: `rgba(${rgb}, 0.06)`,
                border: `1px solid rgba(${rgb}, 0.2)`,
                borderRadius: RADII.small,
              }}>
                <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
                  Sometimes helped
                </p>
                <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.7)', margin: 0, lineHeight: 1.5 }}>
                  {closing.worked.join(', ')}
                </p>
              </div>
            )}
            {closing.limitation && (
              <div style={{
                padding: SPACING.compact,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: RADII.small,
              }}>
                <p style={{ ...TYPE.label, color: 'rgba(240,230,200,0.5)', margin: `0 0 ${SPACING.micro}px` }}>
                  Wrong explanation
                </p>
                <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.55)', margin: 0, lineHeight: 1.5 }}>
                  {closing.limitation}
                </p>
              </div>
            )}
          </div>
        )}

        {closing.verdict && (
          <p className="sqd-motion" style={{
            ...TYPE.bodySmall, color: 'rgba(240,230,200,0.65)', lineHeight: 1.6,
            borderLeft: `2px solid rgba(${rgb}, 0.3)`, paddingLeft: SPACING.compact,
            margin: `0 0 ${SPACING.standard}px`,
            animation: anim('sqd-in', MOTION.duration.slow, 100),
          }}>
            {closing.verdict}
          </p>
        )}

        {closing.church && (
          <div className="sqd-motion" style={{ marginBottom: SPACING.standard, animation: anim('sqd-in', MOTION.duration.slow, 180) }}>
            <p style={{ ...TYPE.bodyStrong, color: CINEMATIC_LAB.creamText, margin: `0 0 ${SPACING.micro}px` }}>
              {closing.church.heading}
            </p>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.6)', lineHeight: 1.6, margin: 0 }}>
              {closing.church.body}
            </p>
          </div>
        )}

        {closing.significance && (
          <div className="sqd-motion" style={{
            padding: `${SPACING.standard}px`,
            background: `rgba(${rgb}, 0.08)`,
            border: `1px solid rgba(${rgb}, 0.25)`,
            borderRadius: RADII.medium,
            marginBottom: SPACING.separation,
            animation: anim('sqd-in', MOTION.duration.slow, 260),
          }}>
            <p style={{ ...TYPE.body, color: accent, margin: 0 }}>{closing.significance}</p>
          </div>
        )}

        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 340) }}>
          <ActionBtn label="Complete" onClick={onComplete} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

const QUALITY_BEAT_COUNT = 4 // hot, cold, wet, dry — beats 0-3

export default function SymptomQualityDiagnostic({ block, subject, onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  const [beat, setBeat] = useState(0)
  const nextBeat = () => setBeat(b => b + 1)

  const qualities = block.qualities || []

  if (beat < QUALITY_BEAT_COUNT) {
    const q = qualities[beat]
    return (
      <QualityBeat
        key={q.quality}
        quality={q.quality}
        symptoms={q.symptoms}
        accent={accent}
        onNext={nextBeat}
      />
    )
  }

  if (beat === 4) return <PatientBeat patient={block.patient} accent={accent} onNext={nextBeat} />

  if (beat === 5) return (
    <QuadrantBeat
      question={block.quadrantQuestion}
      options={block.quadrantOptions}
      accent={accent}
      rgb={rgb}
      onNext={nextBeat}
    />
  )

  if (beat === 6) return <DiagnosisBeat diagnosis={block.diagnosis} accent={accent} onNext={nextBeat} />

  if (beat === 7) return (
    <TreatmentBeat
      question={block.treatmentQuestion}
      options={block.treatmentOptions}
      accent={accent}
      rgb={rgb}
      onNext={nextBeat}
    />
  )

  if (beat === 8) return (
    <OppositeRecallBeat recall={block.oppositeRecall} accent={accent} rgb={rgb} onNext={nextBeat} />
  )

  if (beat === 9) return (
    <ClosingBeat closing={block.closing} accent={accent} rgb={rgb} onComplete={() => onContinue?.()} />
  )

  return null
}
