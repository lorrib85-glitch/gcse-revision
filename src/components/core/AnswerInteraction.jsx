import { useState } from 'react'
import { recordScore } from '../../progress.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'

// ── AnswerInteraction v1 — LOCKED COMPONENT ────────────────────────────────────
// Reusable answer submission and feedback component for all non-timed learning activities.
// EXEMPT: True/False questions (use existing ChapterHookScreen design).
//
// Supports: MCQ, short/long free text, fill-in-the-blanks, connection questions.
// Owns: input/options, submission, attempt count, checking state, hint display,
// answer reveal, correctness confirmation, silent WeakMemory trigger.
// Does not own: question title, module toolbar, progress header, navigation.
//
// CRITICAL: Parent must track completion via onComplete callback to enable progression.
// Component is complete when: answered correctly OR after 2nd incorrect attempt.
//
// State machine:
// idle → answering → checking → {correct → complete OR incorrect_hint → retrying →
// checking → incorrect_reveal → complete}
//
// Max 2 attempts. After attempt 1 incorrect: show hint. After attempt 2 incorrect:
// reveal answer, log to WeakMemory, trigger onComplete callback.
export default function AnswerInteraction({
  block,
  onAnswered,
  onComplete,
  subject,
  mode = 'learning',
}) {
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [locked, setLocked] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  function choose(i) {
    if (locked) return
    const correct = block.options[i].correct
    setSelected(i)
    const nextAttempt = attempts + 1
    setAttempts(nextAttempt)

    if (correct) {
      setLocked(true)
      setIsComplete(true)
      if (subject) recordScore({ subject, earned: 1, possible: 1, source: 'module' })
      if (onAnswered) setTimeout(() => onAnswered(), 700)
      if (onComplete) setTimeout(() => onComplete({ correct: true, attempts: nextAttempt }), 700)
    } else {
      setShakeIdx(i)
      setShowHint(true)
      if (nextAttempt >= 2) {
        // After 2nd attempt, lock and mark complete
        setLocked(true)
        setIsComplete(true)
        if (subject) recordScore({ subject, earned: 0, possible: 1, source: 'module' })
        if (onComplete) setTimeout(() => onComplete({ correct: false, attempts: nextAttempt }), 600)
      }
      setTimeout(() => setShakeIdx(null), 500)
    }
  }

  function retry() {
    setSelected(null)
    setShakeIdx(null)
  }

  const answered = selected !== null
  const wasCorrect = answered && block.options[selected]?.correct
  const wasWrong = answered && !wasCorrect
  const showFull = wasCorrect || locked

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Options */}
      <div className="grid-stack">
        {block.options.map((opt, i) => {
          let cls = 'opt'
          if (answered || locked) {
            if (opt.correct && (showFull || wasCorrect)) cls += ' correct'
            else if (i === selected && wasWrong) cls += ' wrong'
          }
          return (
            <button key={i} className={`${cls}${shakeIdx === i ? ' shake' : ''}`}
              onClick={() => choose(i)}
              disabled={locked || wasCorrect}>
              <span style={{ marginRight: 8, opacity: .45 }}>{String.fromCharCode(65 + i)}.</span>
              {opt.text}
            </button>
          )
        })}
      </div>

      {/* Hint after first wrong attempt */}
      {showHint && !locked && wasWrong && (
        <div className="fade-up" style={{
          background: `rgba(${GENERAL.feedbackHintRgb},.07)`,
          border: `1px solid rgba(${GENERAL.feedbackHintRgb},.28)`,
          borderRadius: 12, padding: '12px 14px', marginTop: 10,
        }}>
          <div style={{
            ...TYPE.metadata,
            color: GENERAL.feedbackHint,
            marginBottom: 6,
          }}>Hint — think about this</div>
          <p style={{
            ...TYPE.bodySmall,
            color: GENERAL.feedbackText, margin: '0 0 10px', lineHeight: 1.55,
          }}>{block.hint || block.explanation}</p>
          <button onClick={retry} style={{
            ...TYPE.button,
            background: `rgba(${GENERAL.feedbackHintRgb},.12)`,
            border: `1px solid rgba(${GENERAL.feedbackHintRgb},.30)`,
            borderRadius: 9, padding: `${SPACING.micro}px ${SPACING.compact}px`,
            color: GENERAL.feedbackHint,
            cursor: 'pointer',
          }}>Try again →</button>
        </div>
      )}

      {/* Full feedback after correct or locked */}
      {showFull && (
        <div className={`feedback ${wasCorrect ? 'correct' : 'wrong'} fade-up`} style={{ marginTop: 10 }}>
          <p style={{ ...TYPE.bodySmall, margin: 0 }}>
            <strong>{wasCorrect ? 'Correct — ' : 'Not quite — the answer was: '}</strong>
            {wasCorrect ? block.explanation : (
              <>
                <strong style={{ color: GENERAL.feedbackCorrect }}>
                  {block.options.find(o => o.correct)?.text}
                </strong>
                {block.explanation ? <><br />{block.explanation}</> : null}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
