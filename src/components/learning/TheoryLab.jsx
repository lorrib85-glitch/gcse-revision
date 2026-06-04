import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

// ── Block data shape ──────────────────────────────────────────────────────────
//
// {
//   type: 'theoryLab',
//   title: 'Think Like Galen',
//   theory: {
//     heading: 'Theory of Opposites',
//     explanation: 'Galen believed illness...',
//     grid: [{ left: 'HOT', right: 'COLD' }, { left: 'WET', right: 'DRY' }]
//   },
//   scenario: {
//     title: 'A Patient Arrives',
//     image: '/figures/history/medicine/medieval/physician.png',
//     symptoms: ['FEVER', 'RED FACE', 'SWEATING'],
//     question: 'Which qualities dominate?',
//     options: [{ label: 'HOT + WET', correct: true }, ...]
//   },
//   outcome: {
//     diagnosis: 'HOT + WET',
//     lines: ['Too much heat.', 'Too much moisture.']
//   },
//   prescription: {
//     question: 'What would Galen prescribe?',
//     options: [{ label: 'Cucumber', correct: true }, ...],
//     reveal: 'Galen treats illness with opposite qualities.'
//   },
//   evaluation: {
//     transformation: { from: 'HOT + WET', to: 'COLD + DRY', result: 'BALANCE' },
//     worked: ['Rest', 'Fluids', 'Cooling foods'],
//     limitation: 'Disease is not caused by Four Humours.',
//     verdict: 'Some treatments accidentally helped patients recover...',
//     church: {
//       image: '/figures/history/medicine/medieval/priest.png',
//       heading: 'Supported by the Church',
//       body: 'Christians believed God created a perfect and balanced body.'
//     },
//     significance: 'This helped Galen\'s ideas remain influential for over 1,000 years.'
//   }
// }

let _tlStyled = false
function ensureStyles() {
  if (_tlStyled) return
  _tlStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tl-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes tl-in-left {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes tl-seal {
      from { opacity: 0; transform: rotate(-10deg) scale(0.85); }
      to   { opacity: 1; transform: rotate(0deg) scale(1); }
    }
    @keyframes tl-balance {
      from { opacity: 0; transform: scale(0.9) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes tl-arrow-drop {
      0%, 100% { transform: translateY(0); opacity: 0.45; }
      50%      { transform: translateY(5px); opacity: 0.9; }
    }
    @keyframes tl-shake {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(5px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(3px); }
    }
  `
  document.head.appendChild(el)
}

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
function anim(name, ms = 320, delay = 0) {
  return `${name} ${ms}ms ${ease} ${delay}ms both`
}

// ── Shared layout primitives ───────────────────────────────────────────────────

function Screen({ children, bgImage, bgOpacity = 0.1, style: extra }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#09070A',
      position: 'relative',
      overflowX: 'hidden',
      ...extra,
    }}>
      {bgImage && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: bgOpacity,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function Pad({ children, top = 80 }) {
  return (
    <div style={{
      maxWidth: 420,
      margin: '0 auto',
      padding: `${top}px ${SPACING.standard}px ${SPACING.section}px`,
    }}>
      {children}
    </div>
  )
}

function Kicker({ children, accent }) {
  return (
    <p style={{
      ...TYPE.metadata,
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      margin: `0 0 ${SPACING.compact}px`,
      opacity: 0.85,
    }}>
      {children}
    </p>
  )
}

function ActionBtn({ label, onClick, accent, rgb, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: `${SPACING.compact}px ${SPACING.standard}px`,
        background: disabled ? 'rgba(255,255,255,0.04)' : `rgba(${rgb}, 0.12)`,
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : `rgba(${rgb}, 0.36)`}`,
        borderRadius: RADII.medium,
        color: disabled ? 'rgba(255,255,255,0.28)' : accent,
        ...TYPE.bodySmall,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: disabled ? 'default' : 'pointer',
        transition: `opacity ${MOTION.fast}ms ease`,
      }}
    >
      {label}
    </button>
  )
}

// ── Stage 0: Theory ────────────────────────────────────────────────────────────

function TheoryStage({ block, accent, rgb, onNext }) {
  const theory = block.theory || {}
  const grid = theory.grid || []

  return (
    <Screen bgImage="/headers/history-medicine-through-time.png" bgOpacity={0.08}>
      <Pad>

        <div style={{ animation: anim('tl-in', 340, 0) }}>
          <Kicker accent={accent}>{block.title || 'Think Like Galen'}</Kicker>
          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: '#F0E6C8',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: `0 0 ${SPACING.separation}px`,
          }}>
            {theory.heading}
          </h1>
        </div>

        {grid.length > 0 && (
          <div style={{
            margin: `0 0 ${SPACING.separation}px`,
            animation: anim('tl-in', 360, 80),
          }}>
            {grid.map((row, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: i < grid.length - 1 ? SPACING.standard : 0,
              }}>
                <span style={{
                  flex: 1,
                  textAlign: 'right',
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#F0E6C8',
                  letterSpacing: '-0.01em',
                  paddingRight: SPACING.compact,
                }}>
                  {row.left}
                </span>
                <span style={{
                  ...TYPE.body,
                  color: `rgba(${rgb}, 0.45)`,
                  fontWeight: 600,
                  width: 28,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  ↔
                </span>
                <span style={{
                  flex: 1,
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#F0E6C8',
                  letterSpacing: '-0.01em',
                  paddingLeft: SPACING.compact,
                }}>
                  {row.right}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{
          borderLeft: `2px solid rgba(${rgb}, 0.3)`,
          paddingLeft: SPACING.compact,
          marginBottom: SPACING.separation,
          animation: anim('tl-in', 360, 160),
        }}>
          {(theory.explanation || '').split('\n\n').map((para, i) => (
            <p key={i} style={{
              ...TYPE.body,
              color: 'rgba(240,230,200,0.72)',
              margin: i > 0 ? `${SPACING.compact}px 0 0` : 0,
              lineHeight: 1.6,
            }}>
              {para}
            </p>
          ))}
        </div>

        <div style={{ animation: anim('tl-in', 360, 220) }}>
          <ActionBtn label="Continue →" onClick={onNext} accent={accent} rgb={rgb} />
        </div>

      </Pad>
    </Screen>
  )
}

// ── Stage 1: Scenario ──────────────────────────────────────────────────────────

function ScenarioStage({ block, accent, rgb, onNext }) {
  const scenario = block.scenario || {}
  const symptoms = scenario.symptoms || []
  const options = scenario.options || []

  const [revealed, setRevealed] = useState(0)
  const [questionVisible, setQuestionVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (revealed >= symptoms.length) {
      const t = setTimeout(() => setQuestionVisible(true), 600)
      return () => clearTimeout(t)
    }
    const delay = revealed === 0 ? 500 : 750
    const t = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed, symptoms.length])

  function handleSelect(idx) {
    if (!questionVisible || selected !== null) return
    const opt = options[idx]
    setSelected(idx)
    if (opt?.correct) {
      setTimeout(onNext, 500)
    } else {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setSelected(null)
      }, 700)
    }
  }

  return (
    <Screen bgImage={scenario.image} bgOpacity={0.35}>
      <Pad>

        <div style={{ animation: anim('tl-in', 320, 0) }}>
          <Kicker accent={accent}>The Patient</Kicker>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#F0E6C8',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            margin: `0 0 ${SPACING.separation}px`,
          }}>
            {scenario.title || 'A Patient Arrives'}
          </h2>
        </div>

        <div style={{ marginBottom: SPACING.separation }}>
          {symptoms.slice(0, revealed).map((symptom, i) => (
            <div
              key={symptom}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.compact,
                marginBottom: SPACING.compact,
                animation: anim('tl-in-left', 380, 0),
              }}
            >
              <div style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: accent,
                flexShrink: 0,
                opacity: 0.7,
              }} />
              <span style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: '#F0E6C8',
                letterSpacing: '0.03em',
              }}>
                {symptom}
              </span>
            </div>
          ))}
        </div>

        {questionVisible && (
          <div style={{ animation: anim('tl-in', 340, 0) }}>
            <p style={{
              ...TYPE.metadata,
              color: `rgba(${rgb}, 0.8)`,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: SPACING.compact,
            }}>
              {scenario.question}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: SPACING.compact,
            }}>
              {options.map((opt, i) => {
                const isSelected = selected === i
                const isWrong = isSelected && shaking
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(i)}
                    style={{
                      padding: `${SPACING.compact}px`,
                      background: isWrong
                        ? 'rgba(180,50,30,0.1)'
                        : isSelected
                          ? `rgba(${rgb}, 0.15)`
                          : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${
                        isWrong
                          ? 'rgba(200,60,40,0.45)'
                          : isSelected
                            ? `rgba(${rgb}, 0.5)`
                            : 'rgba(255,255,255,0.1)'
                      }`,
                      borderRadius: RADII.small,
                      color: isWrong
                        ? 'rgba(220,90,70,0.9)'
                        : isSelected
                          ? accent
                          : 'rgba(240,230,200,0.65)',
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      minHeight: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `background ${MOTION.fast}ms ease, border-color ${MOTION.fast}ms ease`,
                      animation: isWrong ? `tl-shake 0.4s ease` : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </Pad>
    </Screen>
  )
}

// ── Stage 2: Outcome ───────────────────────────────────────────────────────────

function OutcomeStage({ block, accent, rgb, onNext }) {
  const outcome = block.outcome || {}

  return (
    <Screen bgImage="/headers/history-medicine-through-time.png" bgOpacity={0.06}>
      <Pad>

        <div style={{ animation: anim('tl-in', 320, 0) }}>
          <Kicker accent={accent}>Diagnosis</Kicker>
        </div>

        {/* Physician seal */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: SPACING.standard,
          animation: anim('tl-seal', 480, 120),
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: `2px solid rgba(${rgb}, 0.5)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: `0 0 20px rgba(${rgb}, 0.18), inset 0 0 20px rgba(${rgb}, 0.06)`,
          }}>
            <div style={{
              position: 'absolute',
              inset: 5,
              borderRadius: '50%',
              border: `1px solid rgba(${rgb}, 0.25)`,
            }} />
            <span style={{ fontSize: 26, opacity: 0.85 }}>⚕</span>
          </div>
        </div>

        {/* Diagnosis */}
        <div style={{
          textAlign: 'center',
          marginBottom: SPACING.standard,
          animation: anim('tl-in', 400, 240),
        }}>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 38,
            fontWeight: 700,
            color: accent,
            letterSpacing: '-0.01em',
            lineHeight: 1.0,
            margin: 0,
          }}>
            {outcome.diagnosis}
          </p>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: SPACING.separation,
          animation: anim('tl-in', 380, 340),
        }}>
          {(outcome.lines || []).map((line, i) => (
            <p key={i} style={{
              ...TYPE.body,
              color: 'rgba(240,230,200,0.65)',
              margin: i > 0 ? `${SPACING.micro}px 0 0` : 0,
            }}>
              {line}
            </p>
          ))}
        </div>

        <div style={{ animation: anim('tl-in', 360, 420) }}>
          <ActionBtn label="Continue →" onClick={onNext} accent={accent} rgb={rgb} />
        </div>

      </Pad>
    </Screen>
  )
}

// ── Stage 3: Prescription ──────────────────────────────────────────────────────

function PrescriptionStage({ block, accent, rgb, onNext }) {
  const rx = block.prescription || {}
  const options = rx.options || []

  const [selected, setSelected] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [showTransform, setShowTransform] = useState(false)

  const ev = block.evaluation?.transformation || {}
  const hasImages = options.some(o => o.image)

  function toggleOption(idx) {
    if (confirmed) return
    setSelected(s => s.includes(idx) ? s.filter(i => i !== idx) : [...s, idx])
  }

  function confirm() {
    if (selected.length === 0) return
    setConfirmed(true)
    setTimeout(() => setShowTransform(true), 700)
  }

  return (
    <Screen bgImage="/headers/history-medicine-through-time.png" bgOpacity={0.07}>
      <Pad top={72}>

        <div style={{ animation: anim('tl-in', 320, 0) }}>
          <Kicker accent={accent}>Prescribe Treatment</Kicker>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#F0E6C8',
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            margin: `0 0 ${SPACING.standard}px`,
          }}>
            {rx.question}
          </h2>
          {!confirmed && (
            <p style={{
              ...TYPE.metadata,
              color: 'rgba(240,230,200,0.4)',
              margin: `0 0 ${SPACING.standard}px`,
              fontStyle: 'italic',
            }}>
              Select all that apply
            </p>
          )}
        </div>

        {/* Image card grid */}
        {hasImages ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: SPACING.standard,
            animation: anim('tl-in', 360, 80),
          }}>
            {options.map((opt, i) => {
              const isSelected = selected.includes(i)
              const isCorrect = opt.correct
              const highlight = confirmed && isCorrect
              const struck = confirmed && !isCorrect && isSelected
              const fadedOut = confirmed && !isCorrect && !isSelected

              return (
                <button
                  key={opt.label}
                  onClick={() => toggleOption(i)}
                  style={{
                    padding: 0,
                    background: struck
                      ? 'rgba(160,40,20,0.12)'
                      : highlight
                        ? `rgba(${rgb}, 0.08)`
                        : isSelected
                          ? `rgba(${rgb}, 0.06)`
                          : 'rgba(245,237,215,0.06)',
                    border: `2px solid ${
                      struck
                        ? 'rgba(200,60,40,0.45)'
                        : highlight
                          ? `rgba(${rgb}, 0.7)`
                          : isSelected
                            ? `rgba(${rgb}, 0.45)`
                            : 'rgba(240,225,195,0.12)'
                    }`,
                    borderRadius: RADII.medium,
                    cursor: confirmed ? 'default' : 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: `all ${MOTION.fast}ms ease`,
                    opacity: fadedOut ? 0.28 : 1,
                    boxShadow: highlight
                      ? `0 0 14px rgba(${rgb}, 0.3)`
                      : isSelected && !confirmed
                        ? `0 0 10px rgba(${rgb}, 0.18)`
                        : 'none',
                  }}
                >
                  {/* Image area — cream tile so white bg blends */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: struck
                      ? 'rgba(60,20,10,0.6)'
                      : 'rgba(245,237,215,0.92)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={opt.image}
                      alt={opt.label}
                      style={{
                        width: '82%',
                        height: '82%',
                        objectFit: 'contain',
                        mixBlendMode: 'multiply',
                        display: 'block',
                        opacity: struck ? 0.35 : 1,
                        transition: `opacity ${MOTION.fast}ms ease`,
                      }}
                    />
                    {/* Tick or cross overlay */}
                    {(highlight || struck) && (
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        right: 6,
                        fontSize: 14,
                        fontWeight: 700,
                        color: highlight ? accent : 'rgba(220,70,50,0.9)',
                        lineHeight: 1,
                      }}>
                        {highlight ? '✓' : '✕'}
                      </div>
                    )}
                    {/* Selection ring glow (not confirmed) */}
                    {isSelected && !confirmed && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `rgba(${rgb}, 0.12)`,
                        pointerEvents: 'none',
                      }} />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{
                    padding: '6px 4px',
                    textAlign: 'center',
                    width: '100%',
                  }}>
                    <span style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: struck
                        ? 'rgba(200,80,60,0.7)'
                        : highlight
                          ? accent
                          : isSelected
                            ? 'rgba(240,230,200,0.9)'
                            : 'rgba(240,230,200,0.55)',
                      textDecoration: struck ? 'line-through' : 'none',
                      transition: `color ${MOTION.fast}ms ease`,
                    }}>
                      {opt.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Text-only fallback */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: SPACING.compact,
            marginBottom: SPACING.standard,
            animation: anim('tl-in', 360, 80),
          }}>
            {options.map((opt, i) => {
              const isSelected = selected.includes(i)
              const isCorrect = opt.correct
              const highlight = confirmed && isCorrect
              const struck = confirmed && !isCorrect && isSelected
              return (
                <button
                  key={opt.label}
                  onClick={() => toggleOption(i)}
                  style={{
                    padding: `${SPACING.compact}px`,
                    background: highlight ? `rgba(${rgb}, 0.18)` : isSelected && !confirmed ? `rgba(${rgb}, 0.1)` : struck ? 'rgba(180,50,30,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${highlight ? `rgba(${rgb}, 0.55)` : isSelected && !confirmed ? `rgba(${rgb}, 0.35)` : struck ? 'rgba(200,60,40,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: RADII.small,
                    color: highlight ? accent : isSelected && !confirmed ? 'rgba(240,230,200,0.9)' : struck ? 'rgba(200,90,70,0.6)' : 'rgba(240,230,200,0.6)',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: confirmed ? 'default' : 'pointer',
                    textAlign: 'center',
                    minHeight: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: `all ${MOTION.fast}ms ease`,
                    textDecoration: struck ? 'line-through' : 'none',
                    opacity: confirmed && !isCorrect && !isSelected ? 0.35 : 1,
                  }}
                >
                  {confirmed && isCorrect && <span>✓</span>}
                  {struck && <span>✕</span>}
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {!confirmed && (
          <div style={{ animation: anim('tl-in', 320, 160) }}>
            <ActionBtn
              label="Confirm →"
              onClick={confirm}
              accent={accent}
              rgb={rgb}
              disabled={selected.length === 0}
            />
          </div>
        )}

        {showTransform && (
          <div style={{
            marginTop: SPACING.standard,
            animation: anim('tl-in', 400, 0),
          }}>
            {rx.reveal && (
              <p style={{
                ...TYPE.bodySmall,
                color: 'rgba(240,230,200,0.65)',
                margin: `0 0 ${SPACING.standard}px`,
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
                {rx.reveal}
              </p>
            )}

            <div style={{
              textAlign: 'center',
              padding: `${SPACING.standard}px`,
              background: `rgba(${rgb}, 0.06)`,
              border: `1px solid rgba(${rgb}, 0.18)`,
              borderRadius: RADII.medium,
              marginBottom: SPACING.separation,
            }}>
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: accent,
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                {ev.from}
              </p>
              <p style={{
                ...TYPE.body,
                color: `rgba(${rgb}, 0.5)`,
                margin: `${SPACING.micro}px 0`,
                animation: `tl-arrow-drop 2s ease-in-out infinite`,
              }}>
                ↓
              </p>
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#F0E6C8',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                {ev.to}
              </p>
            </div>

            <ActionBtn label="Continue →" onClick={onNext} accent={accent} rgb={rgb} />
          </div>
        )}

      </Pad>
    </Screen>
  )
}

// ── Stage 4: Evaluation ────────────────────────────────────────────────────────

function EvaluationStage({ block, accent, rgb, onComplete }) {
  const ev = block.evaluation || {}
  const transform = ev.transformation || {}
  const church = ev.church || {}
  const worked = ev.worked || []

  const [showBalance, setShowBalance] = useState(false)
  const [showEval, setShowEval] = useState(false)
  const [showChurch, setShowChurch] = useState(false)
  const [showSignificance, setShowSignificance] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowBalance(true), 400)
    const t2 = setTimeout(() => setShowEval(true), 1000)
    const t3 = setTimeout(() => setShowChurch(true), 1600)
    const t4 = setTimeout(() => setShowSignificance(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <Screen bgImage="/headers/history-medicine-through-time.png" bgOpacity={0.07}>
      <Pad>

        <div style={{ animation: anim('tl-in', 320, 0) }}>
          <Kicker accent={accent}>Galen's Verdict</Kicker>
        </div>

        {/* Transformation chain */}
        <div style={{
          textAlign: 'center',
          marginBottom: SPACING.separation,
        }}>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: accent,
            margin: 0,
            letterSpacing: '-0.01em',
            animation: anim('tl-in', 380, 60),
          }}>
            {transform.from}
          </p>
          <p style={{
            ...TYPE.body,
            color: `rgba(${rgb}, 0.45)`,
            margin: `${SPACING.micro}px 0`,
            animation: `tl-arrow-drop 2.2s ease-in-out infinite`,
          }}>
            ↓
          </p>
          <p style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: '#F0E6C8',
            margin: 0,
            letterSpacing: '-0.01em',
            animation: anim('tl-in', 380, 140),
          }}>
            {transform.to}
          </p>

          {showBalance && (
            <>
              <p style={{
                ...TYPE.body,
                color: `rgba(${rgb}, 0.45)`,
                margin: `${SPACING.micro}px 0`,
                animation: `tl-arrow-drop 2.2s ease-in-out infinite`,
              }}>
                ↓
              </p>
              <p style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 30,
                fontWeight: 700,
                color: accent,
                margin: 0,
                letterSpacing: '-0.01em',
                animation: anim('tl-balance', 500, 0),
              }}>
                {transform.result}
              </p>
            </>
          )}
        </div>

        {/* Evaluation columns */}
        {showEval && (
          <div style={{ animation: anim('tl-in', 380, 0) }}>
            <p style={{
              ...TYPE.metadata,
              color: `rgba(${rgb}, 0.7)`,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: SPACING.compact,
            }}>
              Would this actually help?
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: SPACING.compact,
              marginBottom: SPACING.separation,
            }}>
              {/* Sometimes worked */}
              <div style={{
                padding: SPACING.compact,
                background: `rgba(${rgb}, 0.06)`,
                border: `1px solid rgba(${rgb}, 0.2)`,
                borderRadius: RADII.small,
              }}>
                <p style={{
                  ...TYPE.metadata,
                  color: accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: `0 0 ${SPACING.micro}px`,
                }}>
                  ✓ Sometimes helped
                </p>
                {worked.map((item, i) => (
                  <p key={i} style={{
                    ...TYPE.metadata,
                    color: 'rgba(240,230,200,0.6)',
                    margin: `${SPACING.micro}px 0 0`,
                    fontWeight: 400,
                  }}>
                    {item}
                  </p>
                ))}
              </div>

              {/* Wrong explanation */}
              <div style={{
                padding: SPACING.compact,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: RADII.small,
              }}>
                <p style={{
                  ...TYPE.metadata,
                  color: 'rgba(240,230,200,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: `0 0 ${SPACING.micro}px`,
                }}>
                  ✕ Wrong explanation
                </p>
                <p style={{
                  ...TYPE.metadata,
                  color: 'rgba(240,230,200,0.45)',
                  margin: 0,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}>
                  {ev.limitation}
                </p>
              </div>
            </div>

            {/* Historian's verdict */}
            <div style={{
              borderLeft: `2px solid rgba(${rgb}, 0.35)`,
              paddingLeft: SPACING.compact,
              marginBottom: SPACING.separation,
            }}>
              <p style={{
                ...TYPE.bodySmall,
                color: 'rgba(240,230,200,0.7)',
                margin: 0,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}>
                {ev.verdict}
              </p>
            </div>
          </div>
        )}

        {/* Church section */}
        {showChurch && church.image && (
          <div style={{ animation: anim('tl-in', 420, 0), marginBottom: SPACING.separation }}>
            <div style={{
              position: 'relative',
              borderRadius: RADII.medium,
              overflow: 'hidden',
              marginBottom: SPACING.standard,
              height: 180,
            }}>
              <img
                src={church.image}
                alt=""
                aria-hidden
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(9,7,10,0.85) 0%, rgba(9,7,10,0.2) 50%, transparent 100%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: SPACING.compact,
                left: SPACING.compact,
                right: SPACING.compact,
              }}>
                <p style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#F0E6C8',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  {church.heading}
                </p>
              </div>
            </div>

            <p style={{
              ...TYPE.bodySmall,
              color: 'rgba(240,230,200,0.65)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              {church.body}
            </p>
          </div>
        )}

        {/* Significance */}
        {showSignificance && (
          <div style={{ animation: anim('tl-in', 400, 0) }}>
            <div style={{
              padding: `${SPACING.standard}px`,
              background: `rgba(${rgb}, 0.08)`,
              border: `1px solid rgba(${rgb}, 0.25)`,
              borderRadius: RADII.medium,
              textAlign: 'center',
              marginBottom: SPACING.separation,
            }}>
              <p style={{
                ...TYPE.body,
                color: accent,
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 500,
              }}>
                {ev.significance}
              </p>
            </div>

            <ActionBtn label="Complete" onClick={onComplete} accent={accent} rgb={rgb} />
          </div>
        )}

      </Pad>
    </Screen>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function TheoryLab({ block, subject, onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  const [stage, setStage] = useState(0)

  function nextStage() { setStage(s => s + 1) }

  const shared = { block, accent, rgb }

  return (
    <>
      {stage === 0 && <TheoryStage    {...shared} onNext={nextStage} />}
      {stage === 1 && <ScenarioStage  {...shared} onNext={nextStage} />}
      {stage === 2 && <OutcomeStage   {...shared} onNext={nextStage} />}
      {stage === 3 && <PrescriptionStage {...shared} onNext={nextStage} />}
      {stage === 4 && <EvaluationStage {...shared} onComplete={() => onContinue?.()} />}
    </>
  )
}
