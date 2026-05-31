import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function normalise(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')
}

function checkAnswer(input, sentence) {
  const raw = normalise(input)
  if (!raw) return false
  const targets = [sentence.answer, ...(sentence.acceptedAnswers || [])].map(normalise)
  return targets.some(t => {
    if (raw === t) return true
    const maxDist = t.length <= 4 ? 0 : t.length <= 7 ? 1 : 2
    return levenshtein(raw, t) <= maxDist
  })
}

export default function FillInTheBlanksBlock({ block, subject = 'Biology', onContinue }) {
  const subj    = SUBJECTS[subject] || SUBJECTS.Biology
  const accent  = subj.accent
  const rgb     = subj.accentRgb

  const sentences = block.sentences || []

  const [values, setValues]   = useState(() => Object.fromEntries(sentences.map((_, i) => [i, ''])))
  const [results, setResults] = useState(() => sentences.map(() => null))
  const [checked, setChecked] = useState(false)
  const [focusIdx, setFocusIdx] = useState(null)

  const allCorrect = sentences.length > 0 && results.every(r => r?.correct === true)
  const anyFilled  = Object.values(values).some(v => v.trim().length > 0)

  function evaluate(currentValues) {
    return sentences.map((s, i) => ({ correct: checkAnswer(currentValues[i], s) }))
  }

  function handleCheck() {
    setResults(evaluate(values))
    setChecked(true)
  }

  function handleChange(i, val) {
    const next = { ...values, [i]: val }
    setValues(next)
    if (checked) setResults(evaluate(next))
  }

  function handleContinue() {
    const fn = block.onContinue || onContinue
    if (fn) fn()
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <style>{`
        .fitb-input { outline: none; }
        .fitb-input::placeholder { color: rgba(234,247,240,0.28); font-style: italic; }
        @keyframes fitb-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ✦ Close answers count note */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: `rgba(${rgb},0.07)`,
        borderRadius: 6, padding: '3px 11px',
        marginBottom: 20,
      }}>
        <span style={{ fontSize: '.72rem', color: accent }}>✦</span>
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '.72rem', fontWeight: 500,
          color: accent, opacity: 0.72,
          letterSpacing: '.02em',
        }}>Close answers count</span>
      </div>

      {/* Questions */}
      {sentences.map((s, i) => {
        const res       = results[i]
        const isCorrect = res?.correct === true
        const isWrong   = checked && res?.correct === false
        const isFocused = focusIdx === i

        const borderColor = isCorrect
          ? `rgba(${rgb},0.70)`
          : isWrong
            ? `rgba(${rgb},0.35)`
            : isFocused
              ? `rgba(${rgb},0.55)`
              : `rgba(${rgb},0.22)`

        return (
          <div key={i}>
            <div style={{ height: 1, background: `rgba(${rgb},0.12)`, margin: '18px 0' }} />

            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '15px', lineHeight: 1.75, color: '#EAF7F0',
            }}>
              {s.before && (
                <p style={{ margin: '0 0 10px' }}>{s.before}</p>
              )}

              <input
                className="fitb-input"
                aria-label={`Blank ${i + 1} of ${sentences.length}`}
                value={values[i]}
                disabled={isCorrect}
                onChange={e => handleChange(i, e.target.value)}
                onFocus={() => setFocusIdx(i)}
                onBlur={() => setFocusIdx(null)}
                onKeyDown={e => { if (e.key === 'Enter' && !allCorrect) handleCheck() }}
                placeholder="Type answer..."
                style={{
                  display: 'block',
                  width: 'min(320px, 75%)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1.5px solid ${borderColor}`,
                  padding: '3px 8px 6px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '15px', fontWeight: 500,
                  color: isCorrect ? accent : '#EAF7F0',
                  transition: 'border-color .2s, color .2s',
                  cursor: isCorrect ? 'default' : 'text',
                }}
              />

              {s.after && (
                <p style={{ margin: '10px 0 0' }}>{s.after}</p>
              )}
            </div>

            {/* Correct feedback */}
            {isCorrect && (
              <div style={{
                marginTop: 8,
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px', lineHeight: 1.55,
                color: accent, opacity: 0.88,
                animation: 'fitb-fade-in 300ms ease forwards',
              }}>
                ✓ {s.feedback || `Correct.`}
              </div>
            )}

            {/* Wrong nudge — no boxes, no hints, just a quiet prompt */}
            {isWrong && (
              <div style={{
                marginTop: 8,
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px', lineHeight: 1.55,
                color: `rgba(234,247,240,0.42)`,
              }}>
                Not quite — adjust your answer and check again.
              </div>
            )}
          </div>
        )
      })}

      <div style={{ height: 1, background: `rgba(${rgb},0.12)`, margin: '18px 0 24px' }} />

      {/* CTA */}
      <button
        onClick={allCorrect ? handleContinue : handleCheck}
        disabled={!anyFilled}
        style={{
          width: '100%',
          height: 64,
          borderRadius: '15px',
          background: allCorrect
            ? `linear-gradient(135deg, ${accent}, rgba(${rgb},0.72))`
            : `rgba(${rgb},0.10)`,
          border: allCorrect ? 'none' : `1px solid rgba(${rgb},0.18)`,
          cursor: anyFilled ? 'pointer' : 'default',
          opacity: anyFilled ? 1 : 0.45,
          fontFamily: "'Sora', sans-serif",
          fontSize: '16px', fontWeight: 700,
          color: allCorrect ? '#0A0804' : accent,
          letterSpacing: '-0.01em',
          boxShadow: allCorrect ? `0 4px 28px rgba(${rgb},0.22)` : 'none',
          transition: 'all 350ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {allCorrect ? 'Continue →' : checked ? 'Check Again' : 'Check Answers'}
      </button>
    </div>
  )
}
