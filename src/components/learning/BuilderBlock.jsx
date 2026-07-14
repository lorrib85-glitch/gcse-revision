import { useState } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'

// ─── BuilderBlock — equation/concept builder ──────────────────────────────────
// Tap-to-fill builder: learner places word pieces into ordered slots to
// construct an equation, then checks the answer. Distractor pieces are allowed.
// Content block (renders inline within a content screen's blocks array).
// Shape: { label?, slots:[…], operators?:[…], pieces:[…], answer:[…], hint, successText }
export default function BuilderBlock({ block }) {
  const [slots, setSlots] = useState(block.slots.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [available, setAvailable] = useState([...block.pieces])

  function place(slotIdx, piece) {
    const current = slots[slotIdx]
    const newSlots = [...slots]
    newSlots[slotIdx] = piece
    setSlots(newSlots)
    const newAvail = available.filter(p => p !== piece)
    if (current) newAvail.push(current)
    setAvailable(newAvail)
  }
  function remove(slotIdx) {
    const piece = slots[slotIdx]
    if (!piece) return
    const newSlots = [...slots]
    newSlots[slotIdx] = null
    setSlots(newSlots)
    setAvailable([...available, piece])
  }

  const isCorrect = slots.every((s, i) => s === block.answer[i])
  const allFilled = slots.every(s => s !== null)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1520, #0D1A28)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: SPACING.compact,
      }}>
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase', color: '#38D27A', marginBottom: 12,
        }}>🧪 {block.label || 'Build the equation'}</div>

        {/* Equation row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: 8, marginBottom: 16, justifyContent: 'center',
        }}>
          {slots.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                onClick={() => s && remove(i)}
                style={{
                  minWidth: 80, height: 44,
                  background: s
                    ? (submitted && !isCorrect ? 'rgba(255,93,115,.12)' : submitted && isCorrect ? 'rgba(77,255,136,.12)' : 'rgba(56,210,122,.1)')
                    : 'rgba(255,255,255,.03)',
                  border: `1.5px dashed ${s
                    ? (submitted && !isCorrect ? '#FF5D73' : submitted && isCorrect ? '#4DFF88' : '#38D27A')
                    : '#2A3552'}`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: s ? 'pointer' : 'default',
                  ...TYPE.titleMedium,
                  fontSize: '.85rem',
                  color: s ? '#F5F7FB' : '#4A5578',
                  transition: 'all .2s', padding: '0 8px',
                }}>
                {s || '?'}
              </div>
              {i < slots.length - 1 && (
                <span style={{ ...TYPE.eyebrow, color: '#38D27A', fontSize: '1rem' }}>
                  {block.operators?.[i] || '+'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Available pieces */}
        {!submitted && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
            {available.map(piece => (
              <button key={piece}
                onClick={() => {
                  const emptyIdx = slots.findIndex(s => s === null)
                  if (emptyIdx >= 0) place(emptyIdx, piece)
                }}
                style={{
                  background: 'rgba(56,210,122,.1)',
                  border: '1px solid rgba(56,210,122,.3)',
                  borderRadius: 10, padding: '8px 14px',
                  ...TYPE.titleMedium,
                  fontSize: '.85rem', color: '#6BFFB0',
                  cursor: 'pointer', transition: 'all .15s',
                }}>
                {piece}
              </button>
            ))}
          </div>
        )}

        {allFilled && !submitted && (
          <button onClick={() => setSubmitted(true)} style={{
            width: '100%',
            background: 'linear-gradient(135deg, #38D27A, #6BFFB0)',
            border: 'none', borderRadius: 12, padding: SPACING.micro,
            ...TYPE.button,
            color: '#000',
            cursor: 'pointer',
          }}>Check →</button>
        )}

        {submitted && (
          <div className="fade-up">
            {isCorrect ? (
              <div style={{
                background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.3)',
                borderRadius: 12, padding: '14px', textAlign: 'center',
              }}>
                <div style={{ ...TYPE.titleMedium, fontSize: '.82rem', color: '#4DFF88', marginBottom: 4 }}>✓ Correct!</div>
                <p style={{ ...TYPE.body, fontSize: '.85rem', color: '#C8D0E8', margin: 0 }}>{block.successText}</p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)',
                borderRadius: 12, padding: '14px',
              }}>
                <div style={{ ...TYPE.titleMedium, fontSize: '.82rem', color: '#FF5D73', marginBottom: 6 }}>Not quite — try again</div>
                <p style={{ ...TYPE.bodySmall, fontSize: '.83rem', color: '#C8D0E8', margin: '0 0 10px' }}>
                  Hint: {block.hint}
                </p>
                <button onClick={() => { setSubmitted(false); setSlots(block.slots.map(() => null)); setAvailable([...block.pieces]) }} style={{
                  background: 'rgba(255,93,115,.12)', border: '1px solid rgba(255,93,115,.3)',
                  borderRadius: 9, padding: '8px 16px',
                  ...TYPE.label, fontSize: '.82rem',
                  color: '#FF5D73', cursor: 'pointer',
                }}>Try again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
