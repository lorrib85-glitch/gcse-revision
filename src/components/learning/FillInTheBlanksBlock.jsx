import { useEffect, useRef, useState } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import CheckAnswerCTA from '../core/CheckAnswerCTA.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  INLINE_SUBJECT_BACKDROP,
  SUBJECT_BACKDROPS,
  SUBJECT_BACKDROP_POSITIONS,
} from '../../constants/subjectBackdrops.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import {
  checkFillBlankAnswer,
  resolveFillBlankMatchMode,
} from './fillInTheBlanksMatching.js'

function getInputWidth(answer = '') {
  const contentWidth = String(answer ?? '').length * SPACING.micro + SPACING.separation
  return Math.min(
    COMPONENT_SIZE.typedAnswerMaxWidth,
    Math.max(COMPONENT_SIZE.typedAnswerMinWidth, contentWidth),
  )
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
    setValues(current => current.map((item, index) => (
      index === currentIndex ? nextValue : item
    )))
    if (status === 'incorrect') setStatus('answering')
  }

  function handleCheck() {
    if (!canCheck) return

    if (checkFillBlankAnswer(value, sentence)) {
      setStatus('correct')
      return
    }

    setAttempts(current => current.map((count, index) => (
      index === currentIndex ? count + 1 : count
    )))
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
  const matchMode = resolveFillBlankMatchMode(sentence)
  const inputMode = sentence.inputMode || (matchMode === 'numeric' ? 'decimal' : 'text')

  const backgroundImage = block.backgroundImage === false
    ? null
    : block.backgroundImage || SUBJECT_BACKDROPS[subject] || null
  const backgroundPosition = block.backgroundPosition
    || SUBJECT_BACKDROP_POSITIONS[subject]
    || 'center'
  const backgroundOpacity = block.backgroundOpacity ?? INLINE_SUBJECT_BACKDROP.opacity
  const backgroundFilter = block.backgroundFilter ?? INLINE_SUBJECT_BACKDROP.filter

  const inputBorder = status === 'correct'
    ? GENERAL.feedbackCorrect
    : status === 'incorrect'
      ? GENERAL.feedbackIncorrect
      : `rgba(${rgb},0.48)`

  return (
    <section
      aria-label={block.ariaLabel || 'Fill in the blanks'}
      style={{
        minHeight: COMPONENT_SIZE.typedRecallMinHeight,
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
          box-shadow: 0 0 0 ${COMPONENT_SIZE.accentRail}px rgba(${rgb},0.16), 0 0 ${SPACING.standard}px ${subjectData.glow};
        }
        @keyframes fitb-question-in {
          from { opacity: 0; transform: translateY(${SPACING.micro}px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fitb-feedback-in {
          from { opacity: 0; transform: translateY(${SPACING.micro}px); }
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
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: `${SPACING.standard}px 0 ${SPACING.compact}px`,
          borderTop: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
          borderBottom: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.faint}`,
          background: `radial-gradient(circle, ${subjectData.glowStrong}, ${subjectData.background})`,
          animation: `fitb-question-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
        }}
      >
        {backgroundImage && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition,
              opacity: backgroundOpacity,
              filter: backgroundFilter,
              pointerEvents: 'none',
            }}
          />
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            ...TYPE.examPromptHero,
            margin: 0,
            color: GENERAL.feedbackText,
            textWrap: 'pretty',
          }}>
            {sentence.before && <span>{sentence.before}{' '}</span>}
            <input
              ref={inputRef}
              className="fitb-input"
              aria-label={sentence.ariaLabel || `Answer for question ${currentIndex + 1}`}
              value={value}
              disabled={status === 'correct'}
              onChange={event => handleChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={sentence.placeholder || block.placeholder || 'Your answer'}
              inputMode={inputMode}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              style={{
                display: 'inline-block',
                width: getInputWidth(sentence.answer),
                maxWidth: '100%',
                minHeight: COMPONENT_SIZE.typedAnswerHeight,
                margin: `${SPACING.micro}px 0`,
                padding: `${SPACING.micro}px ${SPACING.compact}px`,
                verticalAlign: 'middle',
                boxSizing: 'border-box',
                background: GENERAL.backgroundSunken,
                border: `${COMPONENT_SIZE.focusRing}px solid ${inputBorder}`,
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
            style={{
              minHeight: COMPONENT_SIZE.answerFeedbackReserve,
              marginTop: SPACING.compact,
            }}
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
                    width: SPACING.standard,
                    height: SPACING.standard,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RADII.pill,
                    background: status === 'correct'
                      ? `rgba(${GENERAL.feedbackCorrectRgb},0.14)`
                      : `rgba(${GENERAL.feedbackIncorrectRgb},0.14)`,
                    color: status === 'correct'
                      ? GENERAL.feedbackCorrect
                      : GENERAL.feedbackIncorrect,
                    fontWeight: TYPE.label.fontWeight,
                  }}
                >
                  {status === 'correct' ? '✓' : '×'}
                </span>
                <span>{status === 'correct' ? correctFeedback : incorrectFeedback}</span>
              </div>
            )}
          </div>
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
