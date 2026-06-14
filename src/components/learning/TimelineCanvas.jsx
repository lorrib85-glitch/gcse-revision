import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

gsap.registerPlugin(ScrollTrigger)

// ─── TimelineCanvas v1 ──────────────────────────────────────────────────────
//
// Full-screen GSAP ScrollTrigger "pin and pan" canvas — a deliberately
// different rhythm to TimelineChain. Vertical scroll on the screen drives a
// 1:1 horizontal pan across a wide canvas of cards connected by curved SVG
// paths and connector dots. Tapping a card's "+" reveals why that step
// mattered. A bouncing "Scroll to explore" hint fades as the user begins
// scrolling — both intentionally reproduce the spring/bounce feel of the
// reference interaction, re-skinned in dark cinematic / SUBJECTS tokens.
//
// This is a deliberate exception to the Motion Rules' "no bounce, no spring"
// guidance — used sparingly, as a one-off "jarring" interruption to vary the
// rhythm between chapter moments.
//
// Block shape:
// {
//   type: 'timelineCanvas',
//   title?: 'How the Black Death spread',
//   intro?: 'Scroll to explore the chain. Tap + on each card to reveal why it mattered.',
//   steps: [
//     { id, icon?: '🚢', image?: '/path.png', label: 'Ships carried rats',
//       detail: 'Trade ships from Asia carried black rats...', stats?: ['Step 1 of 4', 'Tap + for detail'] },
//     ...
//   ],
// }

let _tcvStyled = false
function ensureStyles() {
  if (_tcvStyled) return
  _tcvStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tcv-bounce {
      0%, 100% { transform: translate(-50%, 0); }
      50% { transform: translate(-50%, -15px); }
    }
    @keyframes tcv-fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tcv-scroller::-webkit-scrollbar { display: none; }
    .tcv-plus-btn {
      --s: 1;
      transform: translate(-50%, -50%) scale(var(--s));
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  background 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  color 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .tcv-plus-btn:active, .tcv-plus-btn.is-open { --s: 1.15; }
    .tcv-card {
      --ty: -50%;
      --s: 1;
      transform: translate(-50%, var(--ty)) scale(var(--s));
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .tcv-card:active { --ty: -54%; --s: 1.015; }
  `
  document.head.appendChild(el)
}

const CARD_W = 230
const CARD_VIDEO_H = 170
const CARD_STATS_H = 60
const CARD_H = CARD_VIDEO_H + CARD_STATS_H
const STEP_GAP = 380
const CANVAS_PAD = 170
const CANVAS_H = 480

export default function TimelineCanvas({ block, subject = 'History', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []

  const [openIndex, setOpenIndex] = useState(null)
  const [opened, setOpened] = useState(() => new Set())

  const scrollerRef = useRef(null)
  const spacerRef = useRef(null)
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const hintRef = useRef(null)

  const centers = steps.map((_, i) => ({
    x: CANVAS_PAD + i * STEP_GAP,
    y: CANVAS_H / 2 + (i % 2 === 0 ? -85 : 85),
  }))
  const canvasW = CANVAS_PAD + Math.max(steps.length - 1, 0) * STEP_GAP + CANVAS_PAD

  const paths = centers.slice(0, -1).map((c, i) => {
    const n = centers[i + 1]
    const midX = (c.x + n.x) / 2
    return `M ${c.x} ${c.y} C ${midX} ${c.y}, ${midX} ${n.y}, ${n.x} ${n.y}`
  })
  const dots = centers.slice(0, -1).map((c, i) => {
    const n = centers[i + 1]
    return { x: (c.x + n.x) / 2, y: (c.y + n.y) / 2 }
  })

  // Pin the canvas in place while vertical scroll scrubs it horizontally —
  // 1px of scroll maps to 1px of pan, matching the reference behaviour.
  // Re-runs when the detail panel opens/closes, since that resizes the
  // scroller (flex sibling) and the sticky/spacer heights must follow.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    const spacer = spacerRef.current
    const canvas = canvasRef.current
    if (!scroller || !spacer || !canvas || steps.length === 0) return

    const viewportW = scroller.clientWidth
    const viewportH = scroller.clientHeight
    const scrollMax = Math.max(canvasW - viewportW + 80, 0)
    spacer.style.height = `${viewportH + scrollMax}px`
    if (stickyRef.current) stickyRef.current.style.height = `${viewportH}px`

    const panTween = gsap.to(canvas, {
      x: -scrollMax,
      ease: 'none',
      scrollTrigger: {
        trigger: spacer,
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    let hintTween
    if (hintRef.current) {
      hintTween = gsap.to(hintRef.current, {
        opacity: 0, y: 20, ease: 'none',
        scrollTrigger: {
          trigger: spacer,
          scroller,
          start: 'top top',
          end: '+=120',
          scrub: true,
        },
      })
    }

    ScrollTrigger.refresh()

    return () => {
      panTween.scrollTrigger?.kill()
      panTween.kill()
      if (hintTween) {
        hintTween.scrollTrigger?.kill()
        hintTween.kill()
      }
    }
  }, [steps.length, canvasW, openIndex !== null])

  function togglePlus(i) {
    setOpenIndex(prev => (prev === i ? null : i))
    setOpened(prev => {
      const next = new Set(prev)
      next.add(i)
      return next
    })
  }

  const allOpened = steps.length > 0 && opened.size === steps.length
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

      {/* Pin-and-pan canvas */}
      <div ref={scrollerRef} className="tcv-scroller" style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
        <div ref={spacerRef} style={{ position: 'relative' }}>
          <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
            <div ref={canvasRef} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: canvasW, height: CANVAS_H }}>

              <svg width={canvasW} height={CANVAS_H} viewBox={`0 0 ${canvasW} ${CANVAS_H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {paths.map((d, i) => (
                  <path key={i} d={d} stroke={`rgba(${rgb},0.32)`} strokeWidth={3} fill="none" strokeLinecap="round" />
                ))}
              </svg>

              {dots.map((d, i) => (
                <div key={i} style={{
                  position: 'absolute', left: d.x, top: d.y, transform: 'translate(-50%,-50%)',
                  width: 20, height: 20, borderRadius: '50%',
                  background: accent, border: '6px solid #08090D',
                  boxShadow: `0 0 14px rgba(${rgb},0.55)`,
                  zIndex: 2,
                }} />
              ))}

              {steps.map((step, i) => {
                const c = centers[i]
                const isOpen = openIndex === i
                return (
                  <div key={step.id || i}>
                    {/* Card */}
                    <div className="tcv-card" style={{
                      position: 'absolute', left: c.x, top: c.y,
                      width: CARD_W, height: CARD_H,
                      borderRadius: RADII.large,
                      border: `1px solid rgba(${rgb},0.18)`,
                      background: 'rgba(255,255,255,0.03)',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                      overflow: 'hidden', zIndex: 3,
                    }}>
                      {/* media */}
                      <div style={{ position: 'relative', height: CARD_VIDEO_H, width: '100%', overflow: 'hidden', background: '#000' }}>
                        {step.image && (
                          <img src={step.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `linear-gradient(180deg, rgba(${rgb},0.16) 0%, rgba(8,9,13,0) 45%, rgba(8,9,13,0.85) 100%)`,
                        }} />
                        {/* header badges */}
                        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{
                            ...F, padding: '5px 12px', borderRadius: RADII.pill, fontSize: 12, fontWeight: 700,
                            color: '#08090D', background: accent,
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 3px 8px rgba(0,0,0,0.35)',
                          }}>
                            STEP {i + 1}
                          </div>
                          {step.icon && (
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)',
                              border: '1px solid rgba(255,255,255,0.25)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                            }}>
                              {step.icon}
                            </div>
                          )}
                        </div>
                        {/* title */}
                        <div style={{
                          position: 'absolute', bottom: 12, left: 0, width: '100%', textAlign: 'center',
                          ...F, color: 'rgba(255,255,255,0.96)', fontWeight: 700, fontSize: 16,
                          textShadow: '0 3px 10px rgba(0,0,0,0.6)', padding: '0 12px', boxSizing: 'border-box',
                        }}>
                          {step.label}
                        </div>
                      </div>
                      {/* stats footer */}
                      <div style={{
                        height: CARD_STATS_H, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',
                        ...F, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.46)',
                        background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {(step.stats || [`Step ${i + 1} of ${steps.length}`, 'Tap + for detail']).map((s, si) => (
                          <span key={si}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Plus button */}
                    <button
                      className={`tcv-plus-btn${isOpen ? ' is-open' : ''}`}
                      onClick={() => togglePlus(i)}
                      style={{
                        position: 'absolute',
                        left: c.x + CARD_W / 2 - 8, top: c.y + CARD_H / 2 - 8,
                        width: 44, height: 44, borderRadius: '50%',
                        border: `2px solid rgba(${rgb},0.5)`,
                        background: isOpen ? accent : `rgba(${rgb},0.14)`,
                        color: isOpen ? '#08090D' : accent,
                        fontSize: 22, fontWeight: 700, lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                        cursor: 'pointer', zIndex: 4, padding: 0,
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {isOpen ? '×' : '+'}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Scroll hint */}
            {steps.length > 1 && openIndex === null && (
              <div ref={hintRef} style={{
                position: 'absolute', bottom: 16, left: '50%',
                ...F, fontWeight: 700, fontSize: 13, color: accent,
                background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: RADII.pill,
                padding: '10px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                pointerEvents: 'none', animation: 'tcv-bounce 2s infinite ease-in-out',
                transform: 'translateX(-50%)',
              }}>
                Scroll to explore →
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail reveal panel */}
      {openIndex !== null && (
        <div style={{
          flexShrink: 0, margin: `${SPACING.compact}px ${SPACING.standard}px 0`,
          padding: SPACING.standard, borderRadius: RADII.large,
          background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.22)`,
          animation: `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.micro }}>
            <div style={{ ...F, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent }}>
              Why it mattered
            </div>
            <button onClick={() => setOpenIndex(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ ...F, fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.82)' }}>
            {steps[openIndex]?.detail}
          </div>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: SPACING.compact, flexShrink: 0 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: opened.has(i) ? 20 : 8, height: 8, borderRadius: RADII.pill,
            background: opened.has(i) ? accent : 'rgba(255,255,255,0.16)',
            boxShadow: opened.has(i) ? `0 0 8px rgba(${rgb},0.45)` : 'none',
            transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>

      {/* Continue */}
      <div style={{ textAlign: 'center', marginTop: SPACING.standard, padding: `0 ${SPACING.standard}px`, flexShrink: 0 }}>
        {allOpened ? (
          <button
            onClick={onContinue}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              ...F, fontWeight: 700, fontSize: 18, color: accent,
              animation: `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}
          >
            Continue →
          </button>
        ) : (
          <div style={{ ...F, fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>
            Tap + on each step to continue
          </div>
        )}
      </div>
    </div>
  )
}
