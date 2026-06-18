import { useState } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

// ─── CinematicCarousel ──────────────────────────────────────────────────────
//
// Full-screen "deep dive" carousel: one large image at a time, with prev/next
// glass arrow buttons either side and a name + key-facts panel below that
// slides in to match the navigation direction. Designed for browsing a small
// related set of things in turn (e.g. the organelles inside a cell), each
// rendered in dark cinematic / SUBJECTS tokens. Continue unlocks once every
// item has been viewed at least once.
//
// Block shape:
// {
//   type: 'cinematicCarousel',
//   title?: 'Inside the cell',
//   intro?: 'Explore each part and what it does.',
//   items: [
//     { id, image: '/path.png', label: 'Nucleus',
//       facts: ['Contains DNA organised as chromosomes', 'Controls the cell\'s activities'] },
//     ...
//   ],
// }

let _ccvStyled = false
function ensureStyles() {
  if (_ccvStyled) return
  _ccvStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes ccv-slide-in-right {
      from { opacity: 0; transform: translateX(36px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ccv-slide-in-left {
      from { opacity: 0; transform: translateX(-36px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .ccv-nav-btn {
      transition: transform ${MOTION.duration.fast} ${MOTION.easing.standard},
                  background ${MOTION.duration.fast} ${MOTION.easing.standard};
    }
    .ccv-nav-btn:active { transform: translateY(-50%) scale(${MOTION.scale.press}); }
  `
  document.head.appendChild(el)
}

const ARROW_LEFT = 'm313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z'
const ARROW_RIGHT = 'M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z'

export default function CinematicCarousel({ block, subject = 'Biology', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const { accent, accentRgb: rgb } = theme
  const items = block.items || []

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [viewed, setViewed] = useState(() => new Set([0]))

  function go(delta) {
    setDirection(delta)
    setIndex(prev => {
      const next = (prev + delta + items.length) % items.length
      setViewed(v => {
        const nv = new Set(v)
        nv.add(next)
        return nv
      })
      return next
    })
  }

  const item = items[index]
  const allViewed = items.length > 0 && viewed.size === items.length
  const slideAnim = `${direction > 0 ? 'ccv-slide-in-right' : 'ccv-slide-in-left'} ${MOTION.duration.slow} ${MOTION.easing.standard} both`
  const F = { fontFamily: "'Sora', sans-serif" }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#08090D',
      display: 'flex', flexDirection: 'column',
      paddingTop: 'calc(96px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    }}>

      {/* Title + intro */}
      <div style={{ padding: `0 ${SPACING.standard}px`, marginBottom: SPACING.compact, flexShrink: 0 }}>
        {block.title && (
          <h2 style={{
            ...F, fontSize: 'clamp(24px, 7.5vw, 32px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: 'rgba(255,255,255,0.97)', margin: '0 0 8px',
          }}>
            {block.title}
          </h2>
        )}
        {block.intro && (
          <p style={{ ...F, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.52)', margin: 0 }}>
            {block.intro}
          </p>
        )}
      </div>

      {/* Stage */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, padding: `0 ${SPACING.standard}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {items.length > 1 && (
          <button className="ccv-nav-btn" onClick={() => go(-1)} aria-label="Previous" style={{
            position: 'absolute', left: SPACING.micro, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', zIndex: 2,
            border: `1px solid rgba(${rgb},0.3)`, background: `rgba(${rgb},0.14)`,
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, WebkitTapHighlightColor: 'transparent',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill={accent}>
              <path d={ARROW_LEFT} />
            </svg>
          </button>
        )}

        <div key={index} style={{
          width: '100%', height: '100%', maxWidth: 340,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: RADII.panel, overflow: 'hidden',
          border: `1px solid rgba(${rgb},0.18)`,
          background: 'rgba(255,255,255,0.03)',
          boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 48px rgba(${rgb},0.12)`,
          animation: slideAnim,
        }}>
          {item?.image && (
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>

        {items.length > 1 && (
          <button className="ccv-nav-btn" onClick={() => go(1)} aria-label="Next" style={{
            position: 'absolute', right: SPACING.micro, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', zIndex: 2,
            border: `1px solid rgba(${rgb},0.3)`, background: `rgba(${rgb},0.14)`,
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, WebkitTapHighlightColor: 'transparent',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill={accent}>
              <path d={ARROW_RIGHT} />
            </svg>
          </button>
        )}
      </div>

      {/* Info panel */}
      <div key={`info-${index}`} style={{
        flexShrink: 0, padding: `${SPACING.compact}px ${SPACING.standard}px 0`,
        animation: slideAnim,
      }}>
        <h3 style={{ ...F, fontSize: 22, fontWeight: 700, color: accent, margin: '0 0 10px' }}>
          {item?.label}
        </h3>
        <ul style={{ ...F, margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(item?.facts || []).map((fact, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)' }}>
              <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: accent, marginTop: 8 }} />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: SPACING.standard, flexShrink: 0 }}>
        <SequenceProgress
          total={items.length}
          current={index}
          viewed={Array.from(viewed)}
          accent={accent}
          accentRgb={rgb}
          ariaLabel="Carousel progress"
        />
      </div>

      {/* Continue */}
      <div style={{ textAlign: 'center', marginTop: SPACING.standard, padding: `0 ${SPACING.standard}px`, flexShrink: 0 }}>
        {allViewed ? (
          <button
            onClick={onContinue}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              ...F, fontWeight: 700, fontSize: 18, color: accent,
              animation: `ccv-slide-in-right ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}
          >
            Continue →
          </button>
        ) : (
          <div style={{ ...F, fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>
            Explore each part to continue
          </div>
        )}
      </div>
    </div>
  )
}
