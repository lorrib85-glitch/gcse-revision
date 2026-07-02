import { useState, useEffect } from 'react'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
import recoveryQuizzes from '../../data/recoveryQuizzes.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import BackButton from '../core/BackButton.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

function ChoiceQuestion({ q, onSelect, subject }) {
  const block = {
    question: q.question,
    options: q.options.map((text, i) => ({
      text,
      correct: i === q.correct,
    })),
    explanation: q.explanation,
    hint: q.hint,
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        ...TYPE.displaySection,
        fontSize: 34,
        color: '#FFFFFF',
        marginBottom: 40,
      }}>
        {q.question}
      </div>

      <AnswerInteraction
        block={block}
        subject={subject}
        onComplete={({ correct }) => onSelect(correct)}
      />
    </div>
  )
}

// ─── RecoveryQuizPlayer v1 — LOCKED COMPONENT ──────────────────────────────
//
// Lightweight surgical intervention quiz player.
// Plays recovery quizzes to repair weak spot misconceptions.
//
// Features:
// - Rapid question flow (3-4 focused questions)
// - Immediate feedback per question
// - Clean completion state
// - Fast visual design (matches QuickRecallScreen)
// - Returns to module completion on finish
//
// Props:
// - recoveryQuizId: ID from recoveryQuizzes
// - onComplete: callback when quiz finished
// - onBack: callback for back/escape

export default function RecoveryQuizPlayer({
  recoveryQuizId,
  onComplete,
  onBack,
}) {
  const quiz = recoveryQuizzes[recoveryQuizId]

  const [qIdx, setQIdx] = useState(0)
  const [doneCnt, setDoneCnt] = useState(0)
  const [phase, setPhase] = useState('in')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase('active'), 360)
    return () => clearTimeout(t)
  }, [animKey])

  if (!quiz) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#080C1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#E0E6F0',
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, margin: 0 }}>Quiz not found.</p>
          <BackButton onClick={onBack} style={{ marginTop: SPACING.compact }} />
        </div>
      </div>
    )
  }

  const theme = SUBJECTS[quiz.subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const questions = quiz.questions || []
  const total = questions.length

  function advance() {
    const nextIdx = qIdx + 1
    if (nextIdx >= total) {
      setTimeout(() => setPhase('done'), 0)
    } else {
      setPhase('out')
      setTimeout(() => {
        setQIdx(nextIdx)
        setAnimKey(k => k + 1)
        setPhase('in')
      }, 360)
    }
  }

  function handleSelect(wasCorrect) {
    if (wasCorrect) setDoneCnt(d => d + 1)
    advance()
  }

  const cur = questions[qIdx]

  const slideStyle = {
    in:     { animation: 'rrqp-in 360ms ease both' },
    active: { animation: 'none', opacity: 1 },
    out:    { animation: 'rrqp-out 360ms ease both' },
    done:   { animation: 'none', opacity: 0, pointerEvents: 'none' },
  }[phase] || {}

  return (
    <>
      <style>{`
        @keyframes rrqp-in  { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes rrqp-out { from { opacity: 1; transform: translateX(0); }   to { opacity: 0; transform: translateX(-28px); } }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: GENERAL.backgroundApp,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header — back + progress */}
        <div style={{
          padding: '18px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 10,
          position: 'relative',
        }}>
          <BackButton onClick={onBack} />
          <SequenceProgress
            total={total}
            current={qIdx}
            completed={qIdx}
            accent={accent}
            accentRgb={rgb}
            ariaLabel="Recovery progress"
          />
        </div>

        {/* Question area */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          padding: '120px 28px 200px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {phase !== 'done' && cur && (
            <div key={animKey} style={{ maxWidth: 360, width: '100%', ...slideStyle }}>
              {cur.type === 'choice' && (
                <ChoiceQuestion q={cur} onSelect={handleSelect} subject={quiz.subject} />
              )}
            </div>
          )}

          {/* Completion state */}
          {phase === 'done' && (
            <div style={{
              textAlign: 'center',
              animation: 'rrqp-in 420ms ease both',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px',
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36,
              }}>
                ✓
              </div>

              <h2 style={{
                ...TYPE.displaySection,
                fontSize: 28,
                color: '#F5F7FB',
                margin: '0 0 8px',
              }}>
                Weak spot fixed
              </h2>

              <p style={{
                ...TYPE.body,
                fontSize: 15,
                color: 'rgba(255,255,255,0.6)',
                margin: '0 0 28px',
              }}>
                You got {doneCnt}/{total} correct.
              </p>

              <button
                onClick={onComplete}
                style={{
                  background: accent,
                  border: 'none', borderRadius: 12,
                  padding: '12px 24px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 16, fontWeight: 600,
                  color: '#000', cursor: 'pointer',
                  boxShadow: `0 4px 12px rgba(${rgb},0.20)`,
                }}
              >
                Back to module ›
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
