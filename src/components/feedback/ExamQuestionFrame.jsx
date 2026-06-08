import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

// ─── Keyframe styles injected once ───────────────────────────────────────────
let _stylesInjected = false
function ensureStyles() {
  if (_stylesInjected) return
  _stylesInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes eqf-fade {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes eqf-score {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
    .eqf-textarea::placeholder {
      color: rgba(245,245,245,0.28);
    }
  `
  document.head.appendChild(style)
}

// ─── ExamQuestionFrame ────────────────────────────────────────────────────────
export default function ExamQuestionFrame({ block, subject, mode = 'practice', questionNum, onComplete, onSkip }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const accentRgb = theme.accentRgb

  // Normalise block data
  const questionText = block.questionText || block.question || ''
  const marks = block.marks || 4
  const markPoints = Array.isArray(block.markPoints) && block.markPoints.length > 0
    ? block.markPoints
    : (block.ms ? [block.ms] : [])
  const markScheme = markPoints.length > 0 ? markPoints.join('\n') : (block.ms || '')
  const commandWord = block.commandWord || null
  const topic = block.topic || null
  const paper = block.paper || 'GCSE QUESTION'
  const source = block.source || null
  const sourceInstruction = block.sourceInstruction || null

  const [answer, setAnswer] = useState('')
  const [focused, setFocused] = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  async function handleCheck() {
    if (!answer.trim()) {
      setError('Please write an answer before checking.')
      return
    }
    setError(null)
    setGrading(true)
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          answer,
          marks,
          markScheme,
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const marksAwarded = data.marksAwarded ?? 0
      setFeedback({
        marksAwarded,
        summary: data.summary || '',
        missed: data.missed || [],
        examinerTip: data.examinerTip || null,
      })
      // Log weakness tracking
      if (subject && topic) {
        if (marksAwarded === marks) {
          logCorrectAnswer({
            subject,
            topic,
            questionId: block.id || `exam-${Date.now()}`,
            questionText,
            source: 'exam',
            questionType: 'written'
          })
        } else if (marksAwarded < marks) {
          logWrongAnswer({
            subject,
            topic,
            questionId: block.id || `exam-${Date.now()}`,
            questionText,
            marks,
            source: 'exam',
            questionType: 'written'
          })
        }
      }
      if (onComplete) {
        onComplete({
          marksAwarded,
          marks,
          answer,
          questionText,
          markScheme,
          summary: data.summary || '',
          achieved: data.achieved || [],
          missed: data.missed || [],
          examinerTip: data.examinerTip || null,
        })
      }
    } catch (e) {
      setError('Could not reach the grading server. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  function handleRetry() {
    setAnswer('')
    setFeedback(null)
    setError(null)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const canSubmit = answer.trim().length > 0 && !grading

  return (
    <div style={{
      background: '#0D0F14',
      fontFamily: "'Sora', sans-serif",
      padding: '28px 24px 32px',
      borderRadius: 24,
    }}>
      {/* 1. Exam label */}
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: accent,
        marginTop: 12,
        marginBottom: 18,
      }}>
        {paper}
      </div>

      {/* 2. Question header row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.1,
          color: 'rgba(245,245,245,0.96)',
        }}>
          {questionNum != null ? `Question ${questionNum}` : ''}
        </div>
        <div style={{
          height: 32,
          padding: '0 14px',
          borderRadius: RADII.pill,
          background: `rgba(${accentRgb},0.14)`,
          border: `1px solid rgba(${accentRgb},0.22)`,
          color: accent,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          {marks} MARKS
        </div>
      </div>

      {/* 3. Command word + topic row */}
      {(commandWord || topic) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.micro,
          fontSize: 14,
          marginBottom: 28,
        }}>
          {commandWord && (
            <span style={{ color: accent, fontWeight: 600 }}>{commandWord}</span>
          )}
          {commandWord && topic && (
            <span style={{ color: 'rgba(245,245,245,0.28)' }}>·</span>
          )}
          {topic && (
            <span style={{ color: 'rgba(245,245,245,0.58)' }}>{topic}</span>
          )}
        </div>
      )}

      {/* 4. Question text */}
      <div style={{
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.45,
        color: 'rgba(245,245,245,0.96)',
        maxWidth: '92%',
        margin: '0 0 32px',
      }}>
        {questionText}
      </div>

      {/* 5. Source panel */}
      {source && (
        <div style={{
          padding: SPACING.standard,
          borderRadius: RADII.large,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 28,
        }}>
          {/* Background image layer (non-teaching) */}
          {source.image && !source.isTeachingImage && (
            <>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${source.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
                opacity: 0.18,
                filter: 'blur(2px)',
                zIndex: 0,
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(13,15,20,0.98) 40%, rgba(0,0,0,0.58) 100%)',
                zIndex: 1,
              }} />
            </>
          )}

          {/* Content (zIndex 2) */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Teaching image — foreground */}
            {source.image && source.isTeachingImage && (
              <img
                src={source.image}
                alt=""
                style={{ width: '100%', borderRadius: 12, marginBottom: SPACING.compact }}
              />
            )}

            {/* Source label */}
            {source.label && (
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: accent,
                marginBottom: SPACING.micro,
              }}>
                {source.label}
              </div>
            )}

            {/* Attribution */}
            {source.attribution && (
              <div style={{
                fontSize: 13,
                fontStyle: 'italic',
                color: 'rgba(245,245,245,0.48)',
                marginBottom: SPACING.compact,
              }}>
                {source.attribution}
              </div>
            )}

            {/* Source text */}
            {source.text && (
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 36,
                  lineHeight: '28px',
                  color: accent,
                  opacity: 0.8,
                  flexShrink: 0,
                  marginTop: -2,
                }}>❝</span>
                <span style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'rgba(245,245,245,0.82)',
                }}>
                  {source.text}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Source instruction */}
      {sourceInstruction && (
        <div style={{
          fontSize: 14,
          fontStyle: 'italic',
          color: 'rgba(245,245,245,0.48)',
          margin: '0 0 28px',
        }}>
          {sourceInstruction}
        </div>
      )}

      {/* 7–9. Answer section (before feedback) */}
      {!feedback && (
        <>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.48)',
            marginBottom: 12,
          }}>
            YOUR ANSWER
          </div>

          <div style={{
            borderRadius: RADII.large,
            background: focused ? 'rgba(255,255,255,0.038)' : 'rgba(255,255,255,0.028)',
            border: focused
              ? `1px solid rgba(${accentRgb},0.22)`
              : '1px solid rgba(255,255,255,0.045)',
            boxShadow: focused ? `0 0 22px rgba(${accentRgb},0.12)` : 'none',
            transition: '220ms ease',
            padding: 22,
            position: 'relative',
            marginBottom: SPACING.micro,
          }}>
            <textarea
              ref={textareaRef}
              className="eqf-textarea"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Write your answer here…"
              style={{
                minHeight: 220,
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                resize: 'none',
                fontFamily: "'Sora', sans-serif",
                fontSize: 18,
                lineHeight: 1.7,
                color: 'rgba(245,245,245,0.92)',
                boxSizing: 'border-box',
                display: 'block',
              }}
            />
            <div style={{
              fontSize: 12,
              color: 'rgba(245,245,245,0.28)',
              textAlign: 'right',
              padding: '0 0 4px',
            }}>
              {answer.length > 0 ? answer.split(/\s+/).filter(Boolean).length : 0} words · 0 / {marks} marks
            </div>
          </div>

          {/* 8. Error text */}
          {error && (
            <div style={{
              fontSize: 13,
              color: '#FF8C8C',
              marginBottom: SPACING.compact,
            }}>
              {error}
            </div>
          )}

          {/* 9. Check answer button */}
          <button
            onClick={handleCheck}
            disabled={!canSubmit}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 18,
              padding: '0 24px',
              background: canSubmit ? accent : 'rgba(255,255,255,0.06)',
              color: canSubmit ? '#0D0F14' : 'rgba(245,245,245,0.28)',
              boxShadow: canSubmit ? `0 8px 22px rgba(${accentRgb},0.22)` : 'none',
              border: 'none',
              fontSize: 16,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'default',
              marginTop: SPACING.standard,
              transition: '220ms ease',
            }}
          >
            {grading ? 'Marking…' : 'Check answer →'}
          </button>

          {/* 9b. Skip button (practice mode only) */}
          {mode === 'practice' && onSkip && (
            <button
              onClick={onSkip}
              disabled={grading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: RADII.medium,
                padding: '0 24px',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(245,245,245,0.48)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 15,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500,
                cursor: grading ? 'default' : 'pointer',
                marginTop: 12,
                transition: '220ms ease',
                opacity: grading ? 0.5 : 1,
              }}
            >
              Skip this question
            </button>
          )}

          {/* 10. Exam mode footer */}
          {mode === 'exam' && (
            <div style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgba(245,245,245,0.28)',
              marginTop: SPACING.compact,
            }}>
              ⊘ No tips or help in exam mode
            </div>
          )}
        </>
      )}

      {/* Post-answer feedback */}
      {feedback && (
        <div>
          {/* 1. Score */}
          <div style={{
            marginTop: 40,
            marginBottom: 12,
            animation: 'eqf-score 480ms ease both',
          }}>
            <span style={{
              fontSize: 42,
              fontWeight: 700,
              color: 'rgba(245,245,245,0.96)',
            }}>
              {feedback.marksAwarded}
            </span>
            <span style={{
              fontSize: 24,
              color: 'rgba(245,245,245,0.28)',
            }}>
              /{marks}
            </span>
          </div>

          {/* 2. Examiner commentary */}
          {feedback.summary && (
            <div style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: 'rgba(245,245,245,0.74)',
              maxWidth: '94%',
              margin: '0 0 28px',
              animation: 'eqf-fade 480ms ease 120ms both',
            }}>
              {feedback.summary}
            </div>
          )}

          {/* 3. Missing points */}
          {feedback.missed && feedback.missed.length > 0 && (
            <div style={{ animation: 'eqf-fade 480ms ease 240ms both', marginBottom: 28 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.42)',
                marginBottom: 12,
              }}>
                POINTS TO ADD
              </div>
              {feedback.missed.map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: i < feedback.missed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    minWidth: 20,
                    borderRadius: '50%',
                    background: 'rgba(255,140,140,0.12)',
                    border: '1px solid rgba(255,140,140,0.22)',
                    color: '#FF8C8C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    +
                  </div>
                  <span style={{ fontSize: 15, color: 'rgba(245,245,245,0.68)', lineHeight: 1.5 }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 4. Mark scheme */}
          {markPoints.length > 0 && (
            <div style={{ animation: 'eqf-fade 480ms ease 360ms both', marginBottom: 28 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.42)',
                marginBottom: 12,
              }}>
                MARK SCHEME
              </div>
              {markPoints.map((point, i) => (
                <button
                  key={i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 0',
                    minHeight: 52,
                    borderBottom: i < markPoints.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: 'none',
                    border: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    minWidth: 20,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: 'rgba(245,245,245,0.42)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(245,245,245,0.68)', lineHeight: 1.55 }}>
                    {point}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* 5. Examiner tip */}
          {feedback.examinerTip && (
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.04)',
              padding: `${SPACING.compact}px 0`,
              animation: 'eqf-fade 480ms ease 480ms both',
              marginBottom: 28,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.42)',
                marginBottom: SPACING.micro,
              }}>
                EXAMINER'S NOTE
              </div>
              <div style={{
                fontSize: 15,
                color: 'rgba(245,245,245,0.58)',
                lineHeight: 1.6,
              }}>
                {feedback.examinerTip}
              </div>
            </div>
          )}

          {/* 6. Action row */}
          <div style={{
            display: 'flex',
            gap: 12,
            animation: 'eqf-fade 480ms ease 560ms both',
          }}>
            <button
              onClick={handleRetry}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(245,245,245,0.68)',
                fontSize: 15,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ↩ Try again
            </button>
            {onComplete && (
              <button
                onClick={() => onComplete({ marksAwarded: feedback.marksAwarded, marks })}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  background: accent,
                  border: 'none',
                  color: '#0D0F14',
                  fontSize: 15,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
