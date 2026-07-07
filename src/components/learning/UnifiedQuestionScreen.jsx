import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { RADII } from '../../constants/radii.js'

function getOptionLabel(option) {
  if (typeof option === 'string') return option
  return option?.text ?? ''
}

export default function UnifiedQuestionScreen({
  question,
  type = 'choice',
  options = [],
  correct,
  hint,
  explanation,
  backgroundImage,
  subject = 'History',
  onAnswer,
  onComplete,
}) {
  const FEEDBACK_HOLD_MS = 1600
  const subjectData = SUBJECTS[subject] || SUBJECTS.History
  const accent = subjectData.accent
  const rgb = subjectData.accentRgb

  const [tapped, setTapped] = useState(null)
  const [status, setStatus] = useState(null)
  const [hintVisible, setHintVisible] = useState(false)
  const [retryTapped, setRetryTapped] = useState(null)
  const [retryStatus, setRetryStatus] = useState(null)
  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timersRef = useRef([])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => {
      cancelAnimationFrame(raf)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  const q = question || ''
  const correctIdx = typeof correct === 'number' ? correct : 0
  const isTrueFalse = type === 'truefalse'
  const questionType = isTrueFalse ? TYPE.displayScreen : TYPE.displayScreen
  const optionType = isTrueFalse ? TYPE.buttonLarge : TYPE.quizOption

  function advanceAfterHold() {
    const holdMs = FEEDBACK_HOLD_MS
    const outMs = parseInt(MOTION.duration.standard, 10)
    timersRef.current.push(setTimeout(() => {
      setLeaving(true)
      timersRef.current.push(setTimeout(() => {
        onComplete?.()
      }, outMs))
    }, holdMs))
  }

  function vibrate(ms) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms)
  }

  function selectOption(opt) {
    if (status === null) {
      const isCorrect = opt === options[correctIdx]
      setTapped(opt)
      setStatus(isCorrect ? 'correct' : 'incorrect')
      vibrate(isCorrect ? 10 : 20)
      onAnswer?.(isCorrect)

      if (isCorrect || isTrueFalse) {
        advanceAfterHold()
      } else {
        const hintMs = parseInt(MOTION.duration.fast, 10)
        timersRef.current.push(setTimeout(() => setHintVisible(true), hintMs))
      }
      return
    }

    if (status === 'incorrect' && hintVisible && retryStatus === null && opt !== tapped) {
      const isCorrect = opt === options[correctIdx]
      setRetryTapped(opt)
      setRetryStatus(isCorrect ? 'correct' : 'incorrect')
      if (isCorrect) setHintVisible(false)
      vibrate(isCorrect ? 10 : 20)
      advanceAfterHold()
    }
  }

  function mark(kind) {
    if (kind !== 'correct') {
      return (
        <span aria-hidden="true" style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          color: GENERAL.feedbackIncorrect, fontSize: '1.3rem', fontWeight: 800, lineHeight: 1,
          animation: `uqs-mark-in ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
        }}>
          ×
        </span>
      )
    }

    return (
      <span aria-hidden="true" style={{
        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
        width: 30, height: 30,
      }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `rgba(${rgb}, 0.4)`,
          animation: `uqs-ring-out ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }} />
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: `uqs-mark-pop ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#08090D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" style={{
              strokeDasharray: 24, strokeDashoffset: 24,
              animation: `uqs-check-draw ${MOTION.duration.standard} ${MOTION.easing.standard} ${MOTION.duration.instant} forwards`,
            }} />
          </svg>
        </span>
      </span>
    )
  }

  return (
    <div className="cinematic-screen">
      <style>{`
        @keyframes uqs-mark-in { from { opacity: 0; transform: translateY(-50%) scale(0.5); } to { opacity: 1; transform: translateY(-50%) scale(1); } }
        @keyframes uqs-hint-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes uqs-mark-pop { 0% { transform: scale(0.4); opacity: 0; } 65% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes uqs-ring-out { 0% { transform: scale(0.6); opacity: 0.45; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes uqs-check-draw { to { stroke-dashoffset: 0; } }
        @keyframes uqs-correct-glow {
          0%   { background: rgba(${rgb}, 0.2); box-shadow: 0 0 0 1px rgba(${rgb}, 0.26), 0 0 20px rgba(${rgb}, 0.22); }
          100% { background: rgba(${rgb}, 0.12); box-shadow: 0 0 0 1px rgba(${rgb}, 0.18), 0 0 14px rgba(${rgb}, 0.16); }
        }
      `}</style>

      {backgroundImage && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            zIndex: 0,
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,9,13,0.88)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        className="cinematic-shell"
        style={{
          paddingTop: isTrueFalse ? `calc(${SPACING.section}px + env(safe-area-inset-top, 0px))` : 110,
          paddingBottom: isTrueFalse ? `calc(${SPACING.section}px + env(safe-area-inset-bottom, 0px))` : undefined,
          paddingInline: isTrueFalse ? SPACING.standard : 32,
          position: 'relative',
          zIndex: 2,
          '--cinematic-accent': accent,
          justifyContent: isTrueFalse ? 'center' : 'flex-start',
          opacity: entered && !leaving ? 1 : 0,
          transform: leaving ? 'translateY(-8px)' : entered ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}
      >
        <div style={{
          width: '100%',
          marginInline: 'auto',
          transform: isTrueFalse ? `translateY(-${SPACING.standard}px)` : undefined,
        }}>
          <p style={{
            ...questionType,
            marginTop: 0,
            marginBottom: isTrueFalse ? SPACING.cinematic : 22,
            marginInline: 'auto',
            color: 'rgba(245,247,251,0.94)',
            maxWidth: isTrueFalse ? '92%' : '94%',
            overflowWrap: 'break-word',
            textAlign: isTrueFalse ? 'center' : 'left',
          }}>
            {q}
          </p>

          <div style={{
            display: isTrueFalse ? 'grid' : 'flex',
            gridTemplateColumns: isTrueFalse ? '1fr 1fr' : undefined,
            flexDirection: isTrueFalse ? undefined : 'column',
            gap: isTrueFalse ? SPACING.standard : 10,
            maxWidth: isTrueFalse ? '92%' : 'calc(100% - 32px)',
            marginTop: 0,
            marginInline: 'auto',
            width: '100%',
          }}>
          {options.map((opt, i) => {
            const isFirstTapped = tapped === opt
            const isRetryTapped = retryTapped === opt
            const isCorrectOpt = i === correctIdx
            const hasCorrectRetry = retryStatus === 'correct'
            const shouldGlow = (isFirstTapped && status === 'correct') || (isRetryTapped && hasCorrectRetry)
            let opacity = 1
            let background = 'rgba(21,23,32,0.9)'
            let border = '1px solid rgba(255,255,255,0.12)'
            let color = 'rgba(255,255,255,0.82)'
            let boxShadow = undefined
            let correctAnimation = undefined
            const answered = status !== null
            const retryDone = retryStatus !== null

            if (answered) {
              if (isFirstTapped && status === 'incorrect' && !hasCorrectRetry) {
                background = 'rgba(160,40,36,0.10)'
                border = `1px solid rgba(${GENERAL.feedbackIncorrectRgb},0.52)`
                color = 'rgba(255,255,255,0.92)'
                opacity = 1
              } else if (isCorrectOpt && (status === 'correct' || retryDone)) {
                background = `rgba(${rgb}, 0.13)`
                border = `1px solid rgba(${rgb}, 0.65)`
                color = 'rgba(255,255,255,0.94)'
              } else if (!isFirstTapped && !isRetryTapped) {
                color = 'rgba(255,255,255,0.68)'
                opacity = 0.86
                border = '1px solid rgba(255,255,255,0.09)'
              }
            }

            if (retryDone) {
              if (isRetryTapped && retryStatus === 'incorrect') {
                background = 'rgba(160,40,36,0.10)'
                border = `1px solid rgba(${GENERAL.feedbackIncorrectRgb},0.52)`
                color = 'rgba(255,255,255,0.92)'
                opacity = 1
              }
              if (isRetryTapped && retryStatus === 'correct') {
                background = `rgba(${rgb}, 0.13)`
                border = `1px solid rgba(${rgb}, 0.65)`
                color = 'rgba(255,255,255,0.94)'
                opacity = 1
              }
            }

            if (isRetryTapped && retryStatus === null) {
              border = `1px solid rgba(${rgb}, 0.45)`
              color = 'rgba(255,255,255,0.9)'
            }

            if (shouldGlow) {
              background = `rgba(${rgb}, 0.12)`
              border = `1px solid rgba(${rgb}, 0.62)`
              color = 'rgba(255,255,255,0.94)'
              boxShadow = `0 0 0 1px rgba(${rgb}, 0.18), 0 0 14px rgba(${rgb}, 0.16)`
              correctAnimation = `uqs-correct-glow 620ms cubic-bezier(0.22, 1, 0.36, 1) both`
            }

            const disabled = status === 'correct'
              ? true
              : status === 'incorrect'
                ? (retryStatus !== null || isFirstTapped || !hintVisible)
                : false

            return (
              <button
                key={i}
                onClick={() => selectOption(opt)}
                disabled={disabled}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: isTrueFalse ? SPACING.separation + SPACING.compact : undefined,
                  textAlign: isTrueFalse ? 'center' : 'left',
                  background,
                  border,
                  borderRadius: isTrueFalse ? RADII.pill : 14,
                  padding: isTrueFalse ? `${SPACING.compact}px ${SPACING.standard}px` : '14px 48px 14px 18px',
                  cursor: disabled ? 'default' : 'pointer',
                  ...optionType,
                  color,
                  opacity,
                  WebkitTapHighlightColor: 'transparent',
                  boxShadow,
                  animation: correctAnimation,
                  transition: `opacity ${MOTION.duration.instant} ${MOTION.easing.gentle}, background ${MOTION.duration.instant} ${MOTION.easing.gentle}, border-color ${MOTION.duration.instant} ${MOTION.easing.gentle}`,
                }}
              >
                {getOptionLabel(opt)}
                {status === 'incorrect' && isFirstTapped && !hasCorrectRetry && mark('incorrect')}
                {status === 'correct' && isFirstTapped && mark('correct')}
                {isRetryTapped && retryStatus === 'correct' && mark('correct')}
                {isRetryTapped && retryStatus === 'incorrect' && mark('incorrect')}
                {retryStatus === 'incorrect' && isCorrectOpt && !isRetryTapped && mark('correct')}
              </button>
            )
          })}
          </div>

          {hintVisible && status === 'incorrect' && (
          <div
            style={{
              marginTop: SPACING.compact,
              background: 'rgba(27,30,39,0.82)',
              borderRadius: 14,
              border: `1px solid rgba(${rgb},0.18)`,
              borderLeft: `2px solid rgba(${rgb},0.78)`,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              animation: `uqs-hint-in ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
            }}
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
              style={{ color: 'rgba(255,255,255,0.34)', flexShrink: 0, marginTop: 3 }}
            >
              <path d="M9 18h6M10 21h4M12 2a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.4h6c0-1.1.4-1.9 1-2.4A6.5 6.5 0 0 0 12 2z" />
            </svg>
            <div>
              <div
                style={{
                  ...TYPE.label,
                  color: accent,
                  marginBottom: 6,
                }}
              >
                Try again
              </div>
              <p
                style={{
                  ...TYPE.quizHint,
                  margin: 0,
                  color: GENERAL.feedbackText,
                }}
              >
                {hint || explanation || 'Try again — pick a different answer.'}
              </p>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
