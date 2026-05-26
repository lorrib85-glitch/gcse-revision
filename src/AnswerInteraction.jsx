import { useState } from 'react'
import { recordScore } from './progress.js'

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
// EXEMPT: True/False questions (use existing ChapterHookScreen design).
//
// Supports: MCQ, short/long free text, fill-in-the-blanks, connection questions.
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
  block,
  onAnswered,
  subject,
  mode = 'learning',
}) {
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [locked, setLocked] = useState(false)

  function choose(i) {
    if (locked) return
    const correct = block.options[i].correct
    setSelected(i)
    setAttempts(a => a + 1)

    if (correct) {
      setLocked(true)
      if (subject) recordScore({ subject, earned: 1, possible: 1, source: 'module' })
      if (onAnswered) setTimeout(() => onAnswered(), 700)
    } else {
      setShakeIdx(i)
      setShowHint(true)
      if (attempts >= 1) {
        setLocked(true)
        if (subject) recordScore({ subject, earned: 0, possible: 1, source: 'module' })
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
          background: 'rgba(255,200,87,.06)',
          border: '1px solid rgba(255,200,87,.25)',
          borderRadius: 12, padding: '12px 14px', marginTop: 10,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.63rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#FFC857', marginBottom: 6,
          }}>💡 Hint — think about this</div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.87rem', color: '#C8D0E8', margin: '0 0 10px', lineHeight: 1.55,
          }}>{block.hint || block.explanation}</p>
          <button onClick={retry} style={{
            background: 'rgba(255,200,87,.1)',
            border: '1px solid rgba(255,200,87,.3)',
            borderRadius: 9, padding: '8px 16px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.82rem', color: '#FFC857',
            cursor: 'pointer',
          }}>Try again →</button>
        </div>
      )}

      {/* Full feedback after correct or locked */}
      {showFull && (
        <div className={`feedback ${wasCorrect ? 'correct' : 'wrong'} fade-up`} style={{ marginTop: 10 }}>
          <p style={{ margin: 0, fontSize: '.9rem', fontFamily: "'Inter', sans-serif" }}>
            <strong>{wasCorrect ? '✓ Correct! ' : '✗ Nope — the answer was: '}</strong>
            {wasCorrect ? block.explanation : (
              <>
                <strong style={{ color: '#4DFF88' }}>
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
