import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'

function getOptionLabel(option) {
  if (typeof option === 'string') return option
  return option?.text ?? ''
}

export default function UnifiedQuestionScreen({
  question,           // string: the question text (normalized from 'q' or 'question' field)
  type = 'choice',    // 'choice' | 'truefalse'
  options = [],       // string[] for choices or ['True', 'False'] for truefalse
  correct,            // number: index of correct option
  hint,               // string: displayed after first wrong attempt
  explanation,        // string: shown after correct or final wrong

  backgroundImage,    // string: URL for background (optional)
  subject = 'History',// string: subject name for accent colour
  qIndex = 0,         // number: current question index (for progress)
  qTotal = 1,         // number: total questions in sequence

  onAnswer,           // (isCorrect: bool) => void: called after submission
  onComplete,         // () => void: called when moving to next question

  showTimer = false,  // bool: if true, render circular timer
  timeLeft,           // number: seconds remaining (if showTimer true)
  totalSeconds = 90,  // number: total seconds (for timer scaling)
}) {
  const FEEDBACK_HOLD_MS = 1200

  const subjectData = SUBJECTS[subject] || SUBJECTS.History
  const accent = subjectData.accent
  const rgb = subjectData.accentRgb

  // State management
  const [tapped, setTapped] = useState(null)
  const [status, setStatus] = useState(null)         // null | 'correct' | 'incorrect'
  const [hintVisible, setHintVisible] = useState(false)
  const [retryTapped, setRetryTapped] = useState(null)
  const [retryStatus, setRetryStatus] = useState(null)
  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const timersRef = useRef([])

  // Enter animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => {
      cancelAnimationFrame(raf)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  // Normalize question and correct fields
  const q = question || ''
  const correctIdx = typeof correct === 'number' ? correct : 0

  function advanceAfterHold() {
    const holdMs = FEEDBACK_HOLD_MS
    const outMs = parseInt(MOTION.duration.standard, 10)   // 280ms
    timersRef.current.push(setTimeout(() => {
      setLeaving(true)
      timersRef.current.push(setTimeout(() => {
        onComplete?.()
      }, outMs))
    }, holdMs))
  }

  function selectOption(opt) {
    if (status === null) {
      const isCorrect = opt === options[correctIdx]
      setTapped(opt)
      setStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      onAnswer?.(isCorrect)

      if (isCorrect || type === 'truefalse') {
        // True/false is binary — a wrong tap already reveals the answer, so
        // skip the hint and retry step and move straight on.
        advanceAfterHold()
      } else {
        const hintMs = parseInt(MOTION.duration.fast, 10) // 180ms
        timersRef.current.push(setTimeout(() => setHintVisible(true), hintMs))
      }
      return
    }

    // One retry after the hint: picking a different answer marks it immediately
    if (status === 'incorrect' && hintVisible && retryStatus === null && opt !== tapped) {
      const isCorrect = opt === options[correctIdx]
      setRetryTapped(opt)
      setRetryStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      advanceAfterHold()
    }
  }

  function mark(kind) {
    if (kind !== 'correct') {
      return (
        <span aria-hidden="true" style={{
          position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
          color: '#E05A52', fontSize: '1.15rem', fontWeight: 700,
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
        @keyframes uqs-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes uqs-fade-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
      `}</style>

      {/* Background image (if provided) */}
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

      {/* Dark overlay — dims bg image and anchors content legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,9,13,0.88)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content shell — sits above overlay, handles padding */}
      <div
        className="cinematic-shell"
        style={{
          paddingTop: 116,
          position: 'relative',
          zIndex: 2,
          '--cinematic-accent': accent,
          opacity: entered && !leaving ? 1 : 0,
          transform: leaving ? 'translateY(-8px)' : entered ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}
      >

        {/* Question — dominant focus, editorial serif */}
        <p style={{
          fontFamily: "'IBM Plex Serif', serif",
          fontSize: '2.25rem',
          lineHeight: 1.12,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          margin: '0 0 28px',
          color: '#F5F7FF',
          width: '100%',
          maxWidth: '100%',
          overflowWrap: 'break-word',
        }}>
          {q}
        </p>

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((opt, i) => {
            const isFirstTapped = tapped === opt
            const isRetryTapped = retryTapped === opt
            const isCorrectOpt = i === correctIdx

            // Base: neutral cinematic card surface — no subject warmth baked in
            let opacity = 1
            let background = 'rgba(21,23,32,0.9)'
            let border = '1px solid rgba(255,255,255,0.08)'

            if (status === 'incorrect' && isFirstTapped) opacity = 0.58
            if (status === 'correct' && isFirstTapped) {
              background = `rgba(${rgb}, 0.10)`
              border = `1px solid ${accent}`
            }
            if (isRetryTapped && retryStatus === null) {
              border = `1px solid rgba(${rgb}, 0.5)`
            }
            if (isRetryTapped && retryStatus === 'correct') {
              background = `rgba(${rgb}, 0.10)`
              border = `1px solid ${accent}`
            }
            if (isRetryTapped && retryStatus === 'incorrect') opacity = 0.58
            if (retryStatus === 'incorrect' && isCorrectOpt) {
              background = `rgba(${rgb}, 0.10)`
              border = `1px solid ${accent}`
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
                  textAlign: 'left',
                  background,
                  border,
                  borderRadius: 14,
                  padding: '14px 48px 14px 18px',
                  cursor: disabled ? 'default' : 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 500,
                  fontSize: '1rem',
                  lineHeight: 1.45,
                  color: '#F5F7FF',
                  opacity,
                  WebkitTapHighlightColor: 'transparent',
                  transition: `opacity ${MOTION.duration.instant} ${MOTION.easing.gentle}, background ${MOTION.duration.instant} ${MOTION.easing.gentle}, border-color ${MOTION.duration.instant} ${MOTION.easing.gentle}`,
                }}
              >
                {getOptionLabel(opt)}
                {status === 'incorrect' && isFirstTapped && mark('incorrect')}
                {status === 'correct' && isFirstTapped && mark('correct')}
                {isRetryTapped && retryStatus === 'correct' && mark('correct')}
                {isRetryTapped && retryStatus === 'incorrect' && mark('incorrect')}
                {retryStatus === 'incorrect' && isCorrectOpt && !isRetryTapped && mark('correct')}
              </button>
            )
          })}
        </div>

        {/* Hint box — appears after first wrong attempt */}
        {hintVisible && status === 'incorrect' && (
          <div
            style={{
              marginTop: 16,
              background: 'rgba(27,30,39,0.92)',
              borderRadius: 14,
              borderLeft: `3px solid ${accent}`,
              padding: '12px 16px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              animation: `uqs-hint-in ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
            }}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
              style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginTop: 3 }}
            >
              <path d="M9 18h6M10 21h4M12 2a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.4h6c0-1.1.4-1.9 1-2.4A6.5 6.5 0 0 0 12 2z" />
            </svg>
            <div>
              <div
                className="cinematic-eyebrow"
                style={{ color: accent, marginBottom: 6 }}
              >
                Hint
              </div>
              <p
                className="cinematic-body"
                style={{ margin: 0, color: '#F5F7FF' }}
              >
                {hint || explanation || 'Try again — pick a different answer.'}
              </p>
              <p
                className="cinematic-muted"
                style={{ margin: '6px 0 0', color: accent, fontStyle: 'italic' }}
              >
                Pick another answer — it'll mark straight away.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
