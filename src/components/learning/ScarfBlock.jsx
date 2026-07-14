import { useState } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'

// ─── ScarfBlock — SCARF memory acronym ────────────────────────────────────────
// Tap-to-reveal mnemonic block: each acronym letter expands to show its meaning.
// Content block (renders inline within a content screen's blocks array).
// Shape: { label?, items: [{ letter, word, detail }] }
export default function ScarfBlock({ block }) {
  const [open, setOpen] = useState(null)
  const items = block.items || []
  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0E1A0E, #0A1508)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: SPACING.compact,
        boxShadow: '0 0 24px rgba(56,210,122,.05)',
      }}>
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase', color: '#38D27A', marginBottom: 12,
        }}>🧣 {block.label || 'SCARF — uses of glucose'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: open === i ? 'rgba(56,210,122,.08)' : 'rgba(255,255,255,.02)',
                border: `1px solid ${open === i ? 'rgba(56,210,122,.3)' : '#2A3552'}`,
                borderRadius: 12, padding: '12px 14px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all .2s',
              }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(56,210,122,.12)',
                border: '1px solid rgba(56,210,122,.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...TYPE.eyebrow,
                fontSize: '1.2rem', color: '#38D27A',
              }}>{item.letter}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  ...TYPE.titleMedium,
                  fontSize: '.9rem', color: '#F5F7FB',
                }}>{item.word}</div>
                {open === i && (
                  <div className="fade-up" style={{
                    ...TYPE.bodySmall,
                    fontSize: '.82rem', color: '#9CA8C7',
                    marginTop: 4,
                  }}>{item.detail}</div>
                )}
              </div>
              <span style={{ color: open === i ? '#38D27A' : '#2A3552', fontSize: '1rem' }}>
                {open === i ? '▲' : '▼'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
