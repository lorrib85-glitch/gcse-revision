import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'

export default function ColSortBlock({ block, subject = 'Biology' }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const items   = block.items   || []
  const columns = block.columns || []

  const [cursor,    setCursor]    = useState(0)
  const [feedback,  setFeedback]  = useState(null) // null | 'correct' | 'wrong'
  const [shakeCol,  setShakeCol]  = useState(null)
  const [sorted,    setSorted]    = useState(0)
  const [done,      setDone]      = useState(false)
  const [lastExpl,  setLastExpl]  = useState(null)

  const cur = items[cursor]

  function pick(colIdx) {
    if (feedback || done) return

    const correct = colIdx === cur.col

    if (!correct) {
      setShakeCol(colIdx)
      setFeedback('wrong')
      setTimeout(() => { setShakeCol(null); setFeedback(null) }, 500)
      return
    }

    setFeedback('correct')
    setLastExpl(cur.explanation || null)
    const nextSorted = sorted + 1

    setTimeout(() => {
      setFeedback(null)
      const next = cursor + 1
      if (next >= items.length) {
        setDone(true)
      } else {
        setCursor(next)
        setSorted(nextSorted)
      }
    }, 900)
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <style>{`
        @keyframes csb-correct { 0%,100%{transform:scale(1)} 40%{transform:scale(1.03)} }
        @keyframes csb-shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-5px)}
          40%{transform:translateX(5px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(3px)}
        }
        @keyframes csb-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Question label */}
      {block.question && (
        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 600, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.22em',
          color: `rgba(${rgb},0.72)`,
          marginBottom: 20,
        }}>
          {block.question}
        </div>
      )}

      {!done ? (
        <>
          {/* Progress */}
          <div style={{
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 500, fontSize: 12,
            color: 'rgba(255,255,255,0.30)',
            marginBottom: 14,
            letterSpacing: '0.05em',
          }}>
            {cursor + 1} / {items.length}
          </div>

          {/* Card */}
          <div style={{
            padding: '18px 20px',
            borderRadius: 12,
            border: feedback === 'correct'
              ? `1px solid ${accent}`
              : '1px solid rgba(255,255,255,0.10)',
            background: feedback === 'correct'
              ? `rgba(${rgb},0.08)`
              : 'rgba(255,255,255,0.03)',
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 600, fontSize: 17, lineHeight: 1.45,
            color: feedback === 'correct' ? accent : 'rgba(245,245,245,0.90)',
            transition: 'border-color 200ms ease, color 200ms ease, background 200ms ease',
            animation: feedback === 'correct' ? 'csb-correct 320ms ease' : 'none',
            marginBottom: 20,
          }}>
            {cur?.label}
          </div>

          {/* Correct feedback explanation */}
          {feedback === 'correct' && lastExpl && (
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 500, fontSize: 13, lineHeight: 1.55,
              color: `rgba(${rgb},0.82)`,
              marginBottom: 20,
              animation: 'csb-fade-up 260ms ease both',
            }}>
              {lastExpl}
            </div>
          )}

          {/* Column buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {columns.map((col, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={!!feedback}
                style={{
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: `1px solid ${col.color}44`,
                  background: col.bg || `rgba(${rgb},0.05)`,
                  cursor: feedback ? 'default' : 'pointer',
                  textAlign: 'left',
                  animation: shakeCol === i ? 'csb-shake 320ms ease' : 'none',
                  transition: 'opacity 150ms ease',
                  opacity: feedback === 'wrong' && shakeCol !== i ? 0.5 : 1,
                }}
              >
                {col.label.split('\n').map((line, li) => (
                  <div
                    key={li}
                    style={{
                      fontFamily: TYPE.bodyText.fontFamily,
                      fontWeight: li === 0 ? 700 : 500,
                      fontSize: li === 0 ? 14 : 12,
                      letterSpacing: li === 0 ? '0.08em' : '0.02em',
                      color: li === 0 ? col.color : `${col.color}99`,
                      textTransform: li === 0 ? 'uppercase' : 'none',
                      lineHeight: 1.3,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Completion state */
        <div style={{ animation: 'csb-fade-up 400ms ease both' }}>
          <div style={{
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 700, fontSize: 17,
            color: accent, lineHeight: 1.5,
            marginBottom: 20,
          }}>
            ✓ All sorted.
          </div>
          {block.explanation && (
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 500, fontSize: 15, lineHeight: 1.65,
              color: 'rgba(245,245,245,0.72)',
            }}>
              {block.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
