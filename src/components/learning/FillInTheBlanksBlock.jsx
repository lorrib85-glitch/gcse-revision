import { useState } from 'react'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

// Map SUBJECTS theme to FillInTheBlanksBlock's expected structure
function getTheme(subject) {
  const subj = SUBJECTS[subject] || SUBJECTS.Biology
  return {
    glow: subj.accentSecondary,
    glowRgb: hexToRgb(subj.accentSecondary),
    pageBg: subj.background,
    cardBg: subj.backgroundSecondary,
  }
}

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
  const theme = getTheme(subject)
  const sentences = block.sentences || []

  const [values, setValues] = useState(() =>
    Object.fromEntries(sentences.map((_, i) => [i, '']))
  )
  const [results, setResults] = useState(() => sentences.map(() => null))
  const [attempts, setAttempts] = useState(() => sentences.map(() => 0))
  const [shakeKey, setShakeKey] = useState({})

  const correctCount = results.filter(r => r?.correct === true).length
  const allCorrect = correctCount === sentences.length && sentences.length > 0

  function handleCheck() {
    const newResults = sentences.map((s, i) => {
      if (results[i]?.correct) return results[i]
      return { correct: checkAnswer(values[i], s) }
    })
    const newAttempts = attempts.map((a, i) =>
      results[i]?.correct ? a : a + 1
    )

    const wrongIdxs = newResults
      .map((r, i) => (!r.correct && !results[i]?.correct ? i : -1))
      .filter(i => i !== -1)

    if (wrongIdxs.length > 0) {
      const nextShake = {}
      wrongIdxs.forEach(i => { nextShake[i] = (shakeKey[i] || 0) + 1 })
      setShakeKey(prev => ({ ...prev, ...nextShake }))
    }

    setResults(newResults)
    setAttempts(newAttempts)
  }

  function handleTryAgain(i) {
    setValues(v => ({ ...v, [i]: '' }))
    setResults(r => { const n = [...r]; n[i] = null; return n })
  }

  function handleContinue() {
    const fn = block.onContinue || onContinue
    if (fn) fn()
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <style>{`
        @keyframes fitb-pulse-orb {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.22); }
        }
        @keyframes fitb-shake {
          0%, 100% { transform: translateX(0); }
          18%      { transform: translateX(-5px); }
          36%      { transform: translateX(5px); }
          54%      { transform: translateX(-3px); }
          72%      { transform: translateX(3px); }
        }
        @keyframes fitb-fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fitb-input { outline: none; }
        .fitb-input::placeholder { color: rgba(234,247,240,0.26); }
        .fitb-input:focus:not([disabled]) { border-color: rgba(${theme.glowRgb},0.38) !important; }
        .fitb-try-again:hover { opacity: 1 !important; }
      `}</style>

      <h3 style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: '20px', fontWeight: 700,
        letterSpacing: '-0.02em', color: '#EAF7F0',
        margin: '0 0 8px',
      }}>
        Check your understanding
      </h3>

      <p style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: '14px', lineHeight: 1.6,
        color: 'rgba(234,247,240,0.58)',
        margin: '0 0 16px',
      }}>
        Fill in the blanks to complete each statement.
        You don't need exact spelling — close answers count.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: theme.glow,
          boxShadow: `0 0 8px rgba(${theme.glowRgb},0.65)`,
          flexShrink: 0,
          animation: 'fitb-pulse-orb 2.6s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '13px',
          color: 'rgba(234,247,240,0.44)',
        }}>
          Small spelling mistakes are okay. Close enough is good enough.
        </span>
      </div>

      <div style={{
        background: theme.cardBg,
        border: `1px solid rgba(${theme.glowRgb},${allCorrect ? '0.22' : '0.10'})`,
        borderRadius: RADII.large,
        overflow: 'hidden',
        boxShadow: allCorrect
          ? `0 0 0 1px rgba(${theme.glowRgb},0.10), 0 0 52px rgba(${theme.glowRgb},0.09), 0 2px 20px rgba(0,0,0,0.32)`
          : '0 2px 20px rgba(0,0,0,0.26)',
        transition: 'box-shadow 500ms ease, border-color 500ms ease',
      }}>
        {sentences.map((s, i) => {
          const res = results[i]
          const isCorrect = res?.correct === true
          const isWrong = res?.correct === false
          const attemptCount = attempts[i]
          const hintIdx = Math.min(Math.max(attemptCount - 1, 0), (s.hints?.length ?? 1) - 1)
          const hint = s.hints?.[hintIdx]

          return (
            <div
              key={i}
              style={{
                padding: '20px',
                borderBottom: i < sentences.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  key={`badge-${i}-${isCorrect}`}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    flexShrink: 0, marginTop: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isCorrect ? theme.glow : `rgba(${theme.glowRgb},0.10)`,
                    border: isCorrect ? 'none' : `1px solid rgba(${theme.glowRgb},0.22)`,
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '11px', fontWeight: 700,
                    color: isCorrect ? theme.pageBg : theme.glow,
                    transition: 'all 300ms ease',
                  }}
                >
                  {isCorrect ? '✓' : i + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    key={`row-${i}-shake-${shakeKey[i] || 0}`}
                    style={{
                      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                      gap: '6px 8px',
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '15px', lineHeight: 1.65, color: '#EAF7F0',
                      animation: shakeKey[i] ? 'fitb-shake 0.42s ease' : 'none',
                    }}
                  >
                    {s.before && <span>{s.before}</span>}
                    <input
                      className="fitb-input"
                      aria-label={`Blank ${i + 1} of ${sentences.length}`}
                      value={values[i]}
                      disabled={isCorrect}
                      onChange={e => {
                        if (!isCorrect) setValues(v => ({ ...v, [i]: e.target.value }))
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !allCorrect) handleCheck()
                      }}
                      placeholder="your answer"
                      style={{
                        background: isCorrect
                          ? `rgba(${theme.glowRgb},0.07)`
                          : isWrong
                            ? 'rgba(255,175,40,0.04)'
                            : 'rgba(0,0,0,0.30)',
                        border: `1.5px solid ${
                          isCorrect
                            ? theme.glow
                            : isWrong
                              ? 'rgba(255,175,40,0.42)'
                              : `rgba(${theme.glowRgb},0.16)`
                        }`,
                        borderRadius: '11px',
                        height: '44px',
                        padding: '0 14px',
                        fontSize: '15px', fontWeight: 500,
                        fontFamily: "'Sora', sans-serif",
                        color: isCorrect ? theme.glow : '#EAF7F0',
                        minWidth: '110px', maxWidth: '210px',
                        boxShadow: isCorrect
                          ? `0 0 0 1px rgba(${theme.glowRgb},0.16), 0 0 16px rgba(${theme.glowRgb},0.13), 0 0 36px rgba(${theme.glowRgb},0.06)`
                          : isWrong
                            ? '0 0 0 1px rgba(255,175,40,0.12), 0 0 14px rgba(255,175,40,0.08)'
                            : 'none',
                        transition: 'border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}',
                        cursor: isCorrect ? 'default' : 'text',
                      }}
                    />
                    {s.after && <span>{s.after}</span>}
                  </div>

                  {isCorrect && (
                    <div style={{
                      marginTop: '7px',
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '13px',
                      color: theme.glow,
                      opacity: 0.88,
                      animation: 'fitb-fade-in 300ms ease forwards',
                    }}>
                      ✓ You wrote: {values[i]}
                    </div>
                  )}

                  {isWrong && (
                    <div style={{
                      marginTop: '10px',
                      padding: '11px 14px',
                      background: 'rgba(255,175,40,0.05)',
                      border: '1px solid rgba(255,175,40,0.11)',
                      borderRadius: '13px',
                      animation: 'fitb-fade-in 260ms ease forwards',
                    }}>
                      <p style={{
                        margin: '0 0 8px',
                        fontFamily: "'Sora', sans-serif",
                        fontSize: '13px', lineHeight: 1.55,
                        color: 'rgba(255,205,90,0.82)',
                      }}>
                        {hint || 'Check the wording carefully.'}
                      </p>
                      <button
                        className="fitb-try-again"
                        onClick={() => handleTryAgain(i)}
                        style={{
                          background: 'none', border: 'none', padding: 0,
                          fontFamily: "'Sora', sans-serif",
                          fontSize: '13px', fontWeight: 600,
                          color: 'rgba(255,175,40,0.65)',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px',
                          opacity: 0.85,
                          transition: 'opacity 150ms ease',
                        }}
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '11px',
        fontFamily: "'Sora', sans-serif",
        fontSize: '13px',
        color: 'rgba(234,247,240,0.36)',
      }}>
        {correctCount} / {sentences.length} completed
      </div>

      {allCorrect && block.correctMsg && (
        <div style={{
          marginTop: '14px',
          padding: '13px 16px',
          background: `rgba(${theme.glowRgb},0.06)`,
          border: `1px solid rgba(${theme.glowRgb},0.12)`,
          borderRadius: '15px',
          fontFamily: "'Sora', sans-serif",
          fontSize: '14px', lineHeight: 1.6,
          color: 'rgba(234,247,240,0.75)',
          animation: 'fitb-fade-in 400ms ease forwards',
        }}>
          {block.correctMsg}
        </div>
      )}

      <button
        onClick={allCorrect ? handleContinue : handleCheck}
        style={{
          marginTop: '14px',
          width: '100%', height: '52px',
          borderRadius: '15px',
          background: allCorrect
            ? `linear-gradient(135deg, ${theme.glow}, rgba(${theme.glowRgb},0.72))`
            : `rgba(${theme.glowRgb},0.11)`,
          border: allCorrect ? 'none' : `1px solid rgba(${theme.glowRgb},0.18)`,
          cursor: 'pointer',
          fontFamily: "'Sora', sans-serif",
          fontSize: '16px', fontWeight: 700,
          color: allCorrect ? theme.pageBg : theme.glow,
          letterSpacing: '-0.01em',
          boxShadow: allCorrect ? `0 0 28px rgba(${theme.glowRgb},0.20)` : 'none',
          transition: 'all 350ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {allCorrect ? 'Continue →' : 'Check Answers'}
      </button>
    </div>
  )
}
