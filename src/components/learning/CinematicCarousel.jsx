import { useEffect, useState } from 'react'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import InteractionShell from '../layout/InteractionShell.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

// ─── CinematicCarousel / ImageReveal ─────────────────────────────────────────
//
// Two closely related cinematic image patterns share this component:
//
// 1. Default carousel — learner-controlled browsing with arrows, labels and facts.
// 2. `mode: 'imageReveal'` — an automatic, slow image sequence for a deliberate
//    visual reveal. It has no carousel chrome, advances one image at a time, and
//    only exposes Continue after the final image has had time to land.
//
// Both modes use InteractionShell because they are bounded, subject-aware
// interaction sequences that keep the standard learning header and safe areas.
// Primary screen titles consume TYPE.displayScreen without local size overrides;
// item labels consume TYPE.displaySection so hierarchy stays governed globally.
//
// Image reveal block shape:
// {
//   type: 'cinematicCarousel',
//   mode: 'imageReveal',
//   title?: 'The four humours',
//   intro?: 'Four fluids. One theory of health.',
//   revealInterval?: 1800,
//   items: [{ id, image, alt }]
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
    @keyframes image-reveal-in {
      from { opacity: 0; transform: scale(.94); filter: blur(3px); }
      to   { opacity: 1; transform: scale(1); filter: blur(0); }
    }
    @keyframes image-reveal-copy-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
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

function ImageReveal({ block, subject, onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const items = block.items || []
  const interval = block.revealInterval || 1800
  const [index, setIndex] = useState(0)
  const [complete, setComplete] = useState(items.length <= 1)

  useEffect(() => {
    setIndex(0)
    setComplete(items.length <= 1)
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1 || index >= items.length - 1) {
      if (items.length > 1 && index >= items.length - 1) {
        const doneTimer = window.setTimeout(() => setComplete(true), interval)
        return () => window.clearTimeout(doneTimer)
      }
      return undefined
    }

    const timer = window.setTimeout(() => setIndex(current => current + 1), interval)
    return () => window.clearTimeout(timer)
  }, [index, interval, items.length])

  const item = items[index]

  return (
    <InteractionShell subject={subject}>
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: `0 ${SPACING.micro}px`,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {block.title && (
            <h2 style={{
              ...TYPE.displayScreen,
              color: 'rgba(255,255,255,0.97)',
              margin: '0 0 8px',
            }}>
              {block.title}
            </h2>
          )}
          {block.intro && (
            <p style={{
              ...TYPE.bodyStrong,
              color: 'rgba(255,255,255,0.56)',
              margin: 0,
            }}>
              {block.intro}
            </p>
          )}
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${SPACING.standard}px 0`,
        }}>
          <div key={item?.id || index} style={{
            width: 'min(88vw, 430px)',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: `image-reveal-in 900ms ${MOTION.easing.standard} both`,
          }}>
            {item?.image && (
              <img
                src={item.image}
                alt={item.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}
          </div>
        </div>

        <div style={{ flexShrink: 0, padding: `0 ${SPACING.micro}px` }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SequenceProgress
              total={items.length}
              current={index}
              viewed={Array.from({ length: index + 1 }, (_, itemIndex) => itemIndex)}
              accent={accent}
              accentRgb={rgb}
              ariaLabel="Image reveal progress"
            />
          </div>
          <div style={{ minHeight: SPACING.section }} />
        </div>

        {complete && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            animation={`image-reveal-copy-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`}
          />
        )}
      </div>
    </InteractionShell>
  )
}

function DefaultCarousel({ block, subject, onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
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

  return (
    <InteractionShell subject={subject}>
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: `0 ${SPACING.micro}px`, marginBottom: SPACING.compact, flexShrink: 0 }}>
          {block.title && (
            <h2 style={{
              ...TYPE.displayScreen,
              color: 'rgba(255,255,255,0.97)',
              margin: '0 0 8px',
            }}>
              {block.title}
            </h2>
          )}
          {block.intro && (
            <p style={{ ...TYPE.bodyStrong, color: 'rgba(255,255,255,0.52)', margin: 0 }}>
              {block.intro}
            </p>
          )}
        </div>

        <div style={{ flex: 1, position: 'relative', minHeight: 0, padding: `0 ${SPACING.micro}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        <div key={`info-${index}`} style={{
          flexShrink: 0, padding: `${SPACING.compact}px ${SPACING.micro}px 0`,
          animation: slideAnim,
        }}>
          <h3 style={{ ...TYPE.displaySection, color: accent, margin: '0 0 10px' }}>
            {item?.label}
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(item?.facts || []).map((fact, i) => (
              <li key={i} style={{ ...TYPE.bodyStrong, display: 'flex', gap: 10, color: 'rgba(255,255,255,0.82)' }}>
                <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: accent, marginTop: 8 }} />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

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

        <div style={{
          minHeight: SPACING.section,
          padding: `0 ${SPACING.micro}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {!allViewed && (
            <div style={{ ...TYPE.label, color: 'rgba(255,255,255,0.32)' }}>
              Explore each part to continue
            </div>
          )}
        </div>

        {allViewed && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            animation={`ccv-slide-in-right ${MOTION.duration.slow} ${MOTION.easing.standard} both`}
          />
        )}
      </div>
    </InteractionShell>
  )
}

export default function CinematicCarousel({ block, subject = 'Biology', onContinue }) {
  ensureStyles()

  if (block.mode === 'imageReveal') {
    return <ImageReveal block={block} subject={subject} onContinue={onContinue} />
  }

  return <DefaultCarousel block={block} subject={subject} onContinue={onContinue} />
}
