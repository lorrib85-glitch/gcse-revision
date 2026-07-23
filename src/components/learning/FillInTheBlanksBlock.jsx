import { useEffect, useRef, useState } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import CheckAnswerCTA from '../core/CheckAnswerCTA.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }

  return dp[m][n]
}

function normalise(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')
}

function checkAnswer(input, sentence) {
  const raw = normalise(input)
  if (!raw) return false

  const targets = [sentence.answer, ...(sentence.acceptedAnswers || [])]
    .filter(Boolean)
    .map(normalise)

  return targets.some(target => {
    if (raw === target) return true
    const maxDistance = target.length <= 4 ? 0 : target.length <= 7 ? 1 : 2
    return levenshtein(raw, target) <= maxDistance
  })
}

function getInputWidth(answer = '') {
  return Math.min(292, Math.max(148, answer.length * 10 + 48))
}

export default function FillInTheBlanksBlock({ block, subject = 'Biology', onContinue }) {
  const subjectData = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subjectData.accent
  const rgb = subjectData.accentRgb
  const sentences = block.sentences || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [values, setValues] = useState(() => sentences.map(() => ''))
  const [status, setStatus] = useState('answering')
  const [attempts, setAttempts] = useState(() => sentences.map(() => 0))
  const inputRef = useRef(null)

  const sentence = sentences[currentIndex]
  const value = values[currentIndex] || ''
  const isLast = currentIndex === sentences.length - 1
  const canCheck = value.trim().length > 0

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [currentIndex])

  if (!sentence) return null

  function handleChange(nextValue) {
    setValues(current => current.map((item, index) => index === currentIndex ? nextValue : item))
    if (status === 'incorrect') setStatus('answering')
  }

  function handleCheck() {
    if (!canCheck) return

    if (checkAnswer(value, sentence)) {
      setStatus('correct')
      return
    }

    setAttempts(current => current.map((count, index) => index === currentIndex ? count + 1 : count))
    setStatus('incorrect')
  }

  function handleAdvance() {
    if (!isLast) {
      setCurrentIndex(index => index + 1)
      setStatus('answering')
      return
    }

    const next = block.onContinue || onContinue
    next?.()
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter') return
    event.preventDefault()

    if (status === 'correct') handleAdvance()
    else handleCheck()
  }

  const hintIndex = Math.max(0, (attempts[currentIndex] || 1) - 1)
  const hint = sentence.hints?.[Math.min(hintIndex, sentence.hints.length - 1)]
  const incorrectFeedback = hint || block.wrongMsg || 'Not quite — use the rest of the sentence to help you.'
  const correctFeedback = sentence.feedback || (isLast && block.correctMsg) || 'That’s right.'

  const inputBorder = status === 'correct'
    ? GENERAL.feedbackCorrect
    : status === 'incorrect'
      ? GENERAL.feedbackIncorrect
      : `rgba(${rgb},0.48)`

  return (
    <section
      aria-label="Fill in the blanks"
      style={{
        minHeight: 360,
        marginTop: SPACING.compact,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        .fitb-input { outline: none; }
        .fitb-input::placeholder {
          color: ${GENERAL.cinematic.textSubtle};
          font-style: normal;
        }
        .fitb-input:focus-visible {
          box-shadow: 0 0 0 3px rgba(${rgb},0.16), 0 0 22px rgba(${rgb},0.10);
        }
        @keyframes fitb-question-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fitb-feedback-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <SequenceProgress
        total={sentences.length}
        current={currentIndex}
        completed={currentIndex}
        accent={accent}
        accentRgb={rgb}
        variant="sash"
        stretch
        compact
        ariaLabel={`Fill in the blanks question ${currentIndex + 1} of ${sentences.length}`}
        style={{ width: '100%', marginBottom: SPACING.standard }}
      />

      <div
        key={currentIndex}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `${SPACING.standard}px 0 ${SPACING.compact}px`,
          borderTop: `1px solid ${GENERAL.line.faint}`,
          borderBottom: `1px solid ${GENERAL.line.faint}`,
          background: `radial-gradient(circle at 50% 42%, rgba(${rgb},0.07), transparent 68%)`,
          animation: `fitb-question-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
        }}
      >
        <p style={{
          ...TYPE.displaySection,
          margin: 0,
          color: GENERAL.feedbackText,
          lineHeight: 1.5,
          textWrap: 'pretty',
        }}>
          {sentence.before && <span>{sentence.before}{' '}</span>}
          <input
            ref={inputRef}
            className="fitb-input"
            aria-label={`Answer for question ${currentIndex + 1}`}
            value={value}
            disabled={status === 'correct'}
            onChange={event => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer"
            autoComplete="off"
            spellCheck={false}
            style={{
              display: 'inline-block',
              width: getInputWidth(sentence.answer),
              maxWidth: '100%',
              minHeight: 52,
              margin: '6px 4px',
              padding: '10px 14px',
              verticalAlign: 'middle',
              boxSizing: 'border-box',
              background: GENERAL.backgroundSunken,
              border: `1.5px solid ${inputBorder}`,
              borderRadius: RADII.small,
              ...TYPE.bodyStrong,
              color: status === 'correct' ? GENERAL.feedbackCorrect : GENERAL.feedbackText,
              caretColor: accent,
              transition: `border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}, color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
            }}
          />
          {sentence.after && <span>{' '}{sentence.after}</span>}
        </p>

        <div
          aria-live="polite"
          style={{ minHeight: 58, marginTop: SPACING.compact }}
        >
          {status !== 'answering' && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: SPACING.micro,
              ...TYPE.bodySmall,
              color: status === 'correct' ? GENERAL.feedbackCorrect : GENERAL.feedbackText,
              animation: `fitb-feedback-in ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
            }}>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: RADII.pill,
                  background: status === 'correct'
                    ? 'rgba(76,175,125,0.14)'
                    : `rgba(${GENERAL.feedbackIncorrectRgb},0.14)`,
                  color: status === 'correct' ? GENERAL.feedbackCorrect : GENERAL.feedbackIncorrect,
                  fontWeight: 700,
                }}
              >
                {status === 'correct' ? '✓' : '×'}
              </span>
              <span style={{ paddingTop: 2 }}>{status === 'correct' ? correctFeedback : incorrectFeedback}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: SPACING.standard }}>
        {status === 'correct' ? (
          <ContinueCTA
            onClick={handleAdvance}
            label={isLast ? 'Continue' : 'Next question'}
            accent={accent}
            textColor={GENERAL.textOnAccent}
          />
        ) : (
          <CheckAnswerCTA
            onClick={handleCheck}
            label={status === 'incorrect' ? 'Check again' : 'Check answer'}
            accent={accent}
            disabled={!canCheck}
          />
        )}
      </div>
    </section>
  )
}
