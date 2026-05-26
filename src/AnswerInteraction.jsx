import { useState } from 'react'

function CheckIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── AnswerInteraction v1 — LOCKED COMPONENT ────────────────────────────────────
// Reusable answer submission and feedback component for all non-timed learning activities.
// Owns: input/options, submission, attempt count, checking state, hint display,
// answer reveal, correctness confirmation, silent WeakMemory trigger.
// Does not own: question title, module toolbar, progress header, navigation.
//
// State machine:
// idle → answering → checking → {correct → complete OR incorrect_hint → retrying →
// checking → incorrect_reveal → complete}
//
// Max 2 attempts. After attempt 1 incorrect: show hint. After attempt 2 incorrect:
// reveal answer, log to WeakMemory, enable continue.
export default function AnswerInteraction({
  mode = 'learning',
  questionId,
  questionType = 'mcq',
  options = [],
  correctAnswer,
  acceptedAnswers = [],
  markScheme = [],
  hint,
  explanation,
  subject,
  onSubmit,
  onCorrect,
  onIncorrect,
  onReveal,
  onWeakMemoryLog,
  allowRetry = true,
  maxAttempts = 2,
}) {
  const [state, setState] = useState('idle')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [attemptCount, setAttemptCount] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [hintShown, setHintShown] = useState(false)

  const isComplete = state === 'correct' || state === 'incorrect_reveal'
  const showHint = hintShown && (state === 'incorrect_hint' || state === 'retrying')

  async function checkAnswer() {
    setIsChecking(true)
    const currentAttempt = attemptCount + 1
    const answerText = questionType === 'mcq' ? selectedAnswer : userInput.trim()

    const isCorrect =
      questionType === 'mcq'
        ? selectedAnswer === correctAnswer
        : answerText.toLowerCase() === correctAnswer.toLowerCase() ||
          acceptedAnswers.some(a => a.toLowerCase() === answerText.toLowerCase())

    try {
      const result = await onSubmit?.({ answer: answerText, attempt: currentAttempt })
      setAttemptCount(currentAttempt)

      if (isCorrect || result?.correct) {
        setState('correct')
        onCorrect?.({ answer: answerText, attempt: currentAttempt })
      } else if (currentAttempt < maxAttempts) {
        setState('incorrect_hint')
        setHintShown(true)
        onIncorrect?.({ answer: answerText, attempt: currentAttempt })
      } else {
        setState('incorrect_reveal')
        onReveal?.({ answer: answerText, attempt: currentAttempt, correctAnswer })
        onWeakMemoryLog?.({
          questionId, subject, attemptCount: currentAttempt,
          hintShown, revealNeeded: true, answer: answerText, correctAnswer,
        })
      }
    } finally {
      setIsChecking(false)
    }
  }

  const accentRgb = subject ? '157,92,255' : '147,197,253'
  const accentColor = subject ? '#9D5CFF' : '#93C5FD'

  return (
    <div style={{ margin: '16px 0' }}>
      {/* ── Input/Options Area ── */}
      {questionType === 'mcq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0' }}>
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => setSelectedAnswer(option.value || option)}
              disabled={isComplete || isChecking}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                background: selectedAnswer === (option.value || option)
                  ? `rgba(${accentRgb},0.12)`
                  : 'rgba(255,255,255,0.04)',
                border: selectedAnswer === (option.value || option)
                  ? `1.5px solid ${accentColor}`
                  : '1px solid rgba(255,255,255,0.08)',
                color: '#F0ECFF',
                fontSize: 15,
                fontFamily: "'Outfit', sans-serif",
                cursor: isComplete ? 'default' : 'pointer',
                opacity: isComplete ? 0.7 : 1,
                transition: 'all 140ms ease',
                textAlign: 'left',
              }}>
              {option.label || option}
            </button>
          ))}
        </div>
      )}

      {(questionType === 'shortText' || questionType === 'longText') && (
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isComplete || isChecking}
          placeholder="Enter your answer..."
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F0ECFF',
            fontSize: 15,
            fontFamily: "'Outfit', sans-serif",
            minHeight: questionType === 'longText' ? 120 : 50,
            resize: 'vertical',
            opacity: isComplete ? 0.7 : 1,
          }}
        />
      )}

      {/* ── Submit Button ── */}
      <button
        onClick={checkAnswer}
        disabled={isComplete || isChecking || !selectedAnswer && !userInput.trim()}
        style={{
          width: '100%',
          padding: '12px 16px',
          marginTop: 12,
          borderRadius: 10,
          background: state === 'correct'
            ? 'rgba(34,197,94,0.2)'
            : isChecking ? accentColor : 'rgba(157,92,255,0.3)',
          border: `1px solid ${state === 'correct' ? 'rgba(34,197,94,0.4)' : 'rgba(157,92,255,0.3)'}`,
          color: state === 'correct' ? '#22C55E' : '#E0D5FF',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'Outfit', sans-serif",
          cursor: isComplete || isChecking ? 'default' : 'pointer',
          opacity: isComplete ? 0.6 : isChecking ? 0.8 : 1,
          transition: 'all 140ms ease',
        }}>
        {isChecking ? '⏳ Checking...' : state === 'correct' ? '✓ Correct' : state === 'incorrect_hint' || state === 'retrying' ? 'Try again' : 'Check answer'}
      </button>

      {/* ── Feedback Panel ── */}
      {state === 'correct' && (
        <div style={{
          marginTop: 14,
          padding: '14px 16px',
          borderRadius: 10,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <CheckIcon color="#22C55E" />
          <div>
            <div style={{
              color: '#22C55E',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
            }}>You're right.</div>
            {explanation && (
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13,
                marginTop: 6,
                fontFamily: "'Outfit', sans-serif",
              }}>
                {explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {showHint && (state === 'incorrect_hint' || state === 'retrying') && (
        <div style={{
          marginTop: 14,
          padding: '14px 16px',
          borderRadius: 10,
          background: 'rgba(217,119,6,0.08)',
          border: '1px solid rgba(217,119,6,0.2)',
        }}>
          <div style={{
            color: '#D97706',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 6,
          }}>Not quite. Hint:</div>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.5,
          }}>
            {Array.isArray(hint) ? hint[0] : hint}
          </div>
        </div>
      )}

      {state === 'incorrect_reveal' && (
        <div style={{
          marginTop: 14,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            background: 'rgba(59,130,255,0.08)',
            border: '1px solid rgba(59,130,255,0.2)',
            borderBottom: 'none',
          }}>
            <div style={{
              color: '#60A5FA',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 6,
            }}>Correct answer:</div>
            <div style={{
              color: '#F0ECFF',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}
            </div>
          </div>

          {explanation && (
            <div style={{
              padding: '14px 16px',
              background: 'rgba(59,130,255,0.04)',
              borderTop: '1px solid rgba(59,130,255,0.15)',
            }}>
              <div style={{
                color: '#60A5FA',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>Why:</div>
              <div style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.6,
              }}>
                {explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
