import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tcb-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(el)
}

export default function TheoryCompareBlock({ block, subject = 'Biology' }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const [newVisible,      setNewVisible]      = useState(false)
  const [takeawayVisible, setTakeawayVisible] = useState(false)

  useEffect(() => { ensureStyles() }, [])

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Optional block title */}
      {block.title && (
        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 600, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.16em',
          color: `rgba(${rgb},0.72)`,
          marginBottom: 20,
        }}>
          {block.title}
        </div>
      )}

      {/* Old section */}
      <div style={{ marginBottom: newVisible ? 0 : 28 }}>
        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 600, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.38)',
          marginBottom: 10,
        }}>
          {block.oldLabel}
        </div>
        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 800, fontSize: 26,
          lineHeight: 1.22, letterSpacing: '-0.02em',
          color: 'rgba(245,245,245,0.58)',
          marginBottom: 14,
        }}>
          {block.oldTitle}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(block.oldPoints || []).map((pt, i) => (
            <li key={i} style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 500, fontSize: 16, lineHeight: 1.55,
              color: 'rgba(245,245,245,0.52)',
              paddingLeft: 0,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.22)', marginRight: 8 }}>—</span>{pt}
            </li>
          ))}
        </ul>
      </div>

      {/* Continue button — shown while new section is hidden */}
      {!newVisible && (
        <button
          onClick={() => setNewVisible(true)}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer',
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 600, fontSize: 14,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.42)',
            marginTop: 4,
          }}
        >
          Continue ↓
        </button>
      )}

      {/* Divider + new section */}
      {newVisible && (
        <>
          <div style={{
            height: 1,
            background: `rgba(${rgb},0.15)`,
            margin: '24px 0',
            animation: 'tcb-fade-up 400ms ease both',
          }} />
          <div
            style={{ animation: 'tcb-fade-up 400ms ease both' }}
            onAnimationEnd={() => setTakeawayVisible(true)}
          >
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 600, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              color: `rgba(${rgb},0.82)`,
              marginBottom: 10,
            }}>
              {block.newLabel}
            </div>
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 800, fontSize: 26,
              lineHeight: 1.22, letterSpacing: '-0.02em',
              color: accent,
              marginBottom: 14,
            }}>
              {block.newTitle}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(block.newPoints || []).map((pt, i) => (
                <li key={i} style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontWeight: 500, fontSize: 16, lineHeight: 1.55,
                  color: 'rgba(245,245,245,0.75)',
                }}>
                  <span style={{ color: `rgba(${rgb},0.55)`, marginRight: 8 }}>—</span>{pt}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Takeaway */}
      {takeawayVisible && block.takeaway && (
        <div style={{
          marginTop: 28,
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 700, fontSize: 17, lineHeight: 1.55,
          color: accent,
          animation: 'tcb-fade-up 400ms ease both',
        }}>
          {block.takeaway}
        </div>
      )}
    </div>
  )
}
