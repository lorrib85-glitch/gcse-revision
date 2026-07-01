import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'

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
  const [pressed, setPressed] = useState(false)

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
    <div style={{ marginTop: SPACING.compact }}>
      <style>{`
        .fitb-input { outline: none; }
        .fitb-input::placeholder { color: rgba(234,247,240,0.28); font-style: italic; }
        @keyframes fitb-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fitb-card-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: `rgba(${rgb},0.06)`,
        border: `1px solid rgba(${rgb},0.18)`,
        borderRadius: RADII.pill,
        padding: '4px 12px',
        marginBottom: SPACING.compact,
      }}>
        <span style={{
          ...TYPE.eyebrow,
          fontSize: '12px',
          color: accent,
          textTransform: 'uppercase',
        }}>Close answers count</span>
        <span style={{ fontSize: '10px', color: accent, opacity: 0.6 }}>✦</span>
      </div>

      {/* Questions */}
      {sentences.map((s, i) => {
        const res       = results[i]
        const isCorrect = res?.correct === true
        const isWrong   = checked && res?.correct === false
        const isFocused = focusIdx === i

        const borderOpacity = isCorrect ? '0.50' : isFocused ? '0.34' : '0.16'
        const borderColor = isCorrect
          ? `rgba(${rgb},0.72)`
          : isWrong
            ? `rgba(${rgb},0.38)`
            : isFocused
              ? `rgba(${rgb},0.55)`
              : `rgba(${rgb},0.22)`

        const cardShadow = isCorrect
          ? `inset 0 1px 0 rgba(${rgb},0.24), 0 0 28px rgba(${rgb},0.10), 0 4px 20px rgba(0,0,0,0.32)`
          : isFocused
            ? `inset 0 1px 0 rgba(${rgb},0.18), 0 4px 20px rgba(0,0,0,0.32)`
            : `inset 0 1px 0 rgba(${rgb},0.10), 0 4px 20px rgba(0,0,0,0.28)`

        return (
          <div
            key={i}
            style={{
              background: `linear-gradient(160deg, rgba(${rgb},0.07) 0%, rgba(0,0,0,0.22) 100%)`,
              border: `1px solid rgba(${rgb},${borderOpacity})`,
              boxShadow: cardShadow,
              borderRadius: RADII.medium,
              padding: `${SPACING.compact}px ${SPACING.compact}px 14px`,
              marginBottom: SPACING.compact,
              transition: `border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
              animation: `fitb-card-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
              animationDelay: `${i * 90}ms`,
            }}
          >
            {/* Step counter */}
            <span style={{
              ...TYPE.metadata,
              textTransform: 'uppercase',
              color: `rgba(${rgb},0.48)`,
              marginBottom: SPACING.micro,
              display: 'block',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <div style={{ ...TYPE.bodySmall, color: '#EAF7F0' }}>
              {s.before && (
                <p style={{ margin: `0 0 ${SPACING.micro}px` }}>{s.before}</p>
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
                  width: '100%',
                  background: 'rgba(0,0,0,0.28)',
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: RADII.small,
                  padding: '11px 14px',
                  ...TYPE.bodySmall,
                  fontWeight: 500,
                  color: isCorrect ? accent : '#EAF7F0',
                  textShadow: isCorrect ? `0 0 20px ${accent}55` : 'none',
                  boxShadow: isFocused && !isCorrect ? `0 0 0 3px rgba(${rgb},0.12)` : 'none',
                  transition: `border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}, color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                  cursor: isCorrect ? 'default' : 'text',
                  boxSizing: 'border-box',
                }}
              />

              {s.after && (
                <p style={{ margin: `${SPACING.micro}px 0 0` }}>{s.after}</p>
              )}
            </div>

            {/* Correct feedback */}
            {isCorrect && (
              <div style={{
                marginTop: SPACING.micro,
                ...TYPE.metadata,
                fontWeight: 600,
                color: accent,
                textShadow: `0 0 14px ${accent}44`,
                animation: 'fitb-fade-in 300ms ease forwards',
              }}>
                ✓ {s.feedback || 'Correct.'}
              </div>
            )}

            {/* Wrong nudge */}
            {isWrong && (
              <div style={{
                marginTop: SPACING.micro,
                ...TYPE.metadata,
                borderLeft: `2px solid rgba(${rgb},0.30)`,
                paddingLeft: SPACING.micro,
                color: 'rgba(245,238,225,0.45)',
              }}>
                Not quite — adjust your answer and check again.
              </div>
            )}
          </div>
        )
      })}

      {/* CTA */}
      <button
        onClick={allCorrect ? handleContinue : handleCheck}
        disabled={!anyFilled}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          width: '100%',
          height: BUTTONS.primary.height,
          borderRadius: BUTTONS.primary.borderRadius,
          background: allCorrect
            ? `linear-gradient(135deg, ${accent}, rgba(${rgb},0.72))`
            : `rgba(${rgb},0.10)`,
          border: allCorrect ? 'none' : `1px solid rgba(${rgb},0.18)`,
          cursor: anyFilled ? 'pointer' : 'default',
          opacity: anyFilled ? 1 : 0.45,
          fontFamily: "'Sora', sans-serif",
          fontSize: BUTTONS.primary.fontSize,
          fontWeight: BUTTONS.primary.fontWeight,
          color: allCorrect ? '#0A0804' : accent,
          letterSpacing: '-0.02em',
          boxShadow: allCorrect ? `0 4px 28px rgba(${rgb},0.28)` : 'none',
          transition: `all ${BUTTONS.primary.transition}`,
          transform: pressed && anyFilled ? `scale(${MOTION.scale.press})` : 'scale(1)',
        }}
      >
        {allCorrect ? 'Continue →' : checked ? 'Try again' : 'Check answers'}
      </button>
    </div>
  )
}
