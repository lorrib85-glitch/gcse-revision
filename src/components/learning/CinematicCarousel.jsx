import { useEffect, useRef, useState } from 'react'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import InteractionShell from '../layout/InteractionShell.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { HEADING_LAYOUT, TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

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
// Primary screen titles and intros consume the same governed tokens and text
// treatment as TeachScreenShell; item labels consume TYPE.displayCard so they
// remain clearly subordinate to the screen title.
// The default image stage keeps the source image uncropped while using a muted,
// blurred copy behind it to avoid heavy empty bars around portrait assets.
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
      color: rgba(255,255,255,0.64);
      transition: transform ${MOTION.duration.fast} ${MOTION.easing.standard},
                  color ${MOTION.duration.fast} ${MOTION.easing.standard};
    }
    .ccv-nav-glyph {
      transition: background ${MOTION.duration.fast} ${MOTION.easing.standard},
                  border-color ${MOTION.duration.fast} ${MOTION.easing.standard};
    }
    .ccv-nav-btn:hover,
    .ccv-nav-btn:focus-visible {
      color: var(--ccv-accent);
      outline: none;
    }
    .ccv-nav-btn:hover .ccv-nav-glyph,
    .ccv-nav-btn:focus-visible .ccv-nav-glyph {
      background: rgba(var(--ccv-rgb),0.12) !important;
      border-color: rgba(var(--ccv-rgb),0.28) !important;
    }
    .ccv-nav-btn:active {
      transform: translateY(-50%) scale(${MOTION.scale.press});
    }
    .ccv-nav-btn:active .ccv-nav-glyph {
      background: rgba(var(--ccv-rgb),0.18) !important;
    }
    @media (prefers-reduced-motion: reduce) {
      .ccv-motion,
      .ccv-nav-btn,
      .ccv-nav-glyph {
        animation: none !important;
        transition: none !important;
      }
    }
  `
  document.head.appendChild(el)
}

const ARROW_LEFT = 'm313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z'
const ARROW_RIGHT = 'M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z'

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => (
    typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = event => setPrefersReducedMotion(event.matches)

    setPrefersReducedMotion(mediaQuery.matches)
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updatePreference)
    else mediaQuery.addListener(updatePreference)

    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updatePreference)
      else mediaQuery.removeListener(updatePreference)
    }
  }, [])

  return prefersReducedMotion
}

function ImageReveal({ block, subject, onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const items = block.items || []
  const interval = block.revealInterval || 1800
  const prefersReducedMotion = usePrefersReducedMotion()
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
              color: 'rgba(245,245,245,0.96)',
              maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
              margin: '0 auto',
            }}>
              {block.title}
            </h2>
          )}
          {block.intro && (
            <p style={{
              ...TYPE.body,
              color: 'rgba(245,245,245,0.60)',
              margin: `${SPACING.standard}px 0 0`,
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
          <div
            className="ccv-motion"
            key={item?.id || index}
            style={{
              width: 'min(88vw, 430px)',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: prefersReducedMotion
                ? 'none'
                : `image-reveal-in 900ms ${MOTION.easing.standard} both`,
            }}
          >
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
            animation={prefersReducedMotion
              ? 'none'
              : `image-reveal-copy-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`}
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
  const prefersReducedMotion = usePrefersReducedMotion()
  const swipeStart = useRef(null)

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

  function handleTouchStart(event) {
    if (items.length <= 1) return
    const touch = event.touches[0]
    swipeStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  function handleTouchEnd(event) {
    if (!swipeStart.current) return

    const touch = event.changedTouches[0]
    const start = swipeStart.current
    swipeStart.current = null
    if (!touch) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const isHorizontalSwipe = Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

    if (isHorizontalSwipe) go(deltaX < 0 ? 1 : -1)
  }

  const item = items[index]
  const previousItem = items[(index - 1 + items.length) % items.length]
  const nextItem = items[(index + 1) % items.length]
  const allViewed = items.length > 0 && viewed.size === items.length
  const slideAnim = prefersReducedMotion
    ? 'none'
    : `${direction > 0 ? 'ccv-slide-in-right' : 'ccv-slide-in-left'} ${MOTION.duration.slow} ${MOTION.easing.standard} both`

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
              color: 'rgba(245,245,245,0.96)',
              maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
              margin: 0,
            }}>
              {block.title}
            </h2>
          )}
          {block.intro && (
            <p style={{
              ...TYPE.body,
              color: 'rgba(245,245,245,0.60)',
              margin: `${SPACING.standard}px 0 0`,
            }}>
              {block.intro}
            </p>
          )}
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            flex: 1,
            position: 'relative',
            minHeight: 0,
            padding: `0 ${SPACING.micro}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'pan-y',
          }}
        >
          {items.length > 1 && (
            <button
              className="ccv-nav-btn"
              onClick={() => go(-1)}
              aria-label={`Previous: ${previousItem?.label || previousItem?.alt || 'item'}`}
              style={{
                '--ccv-accent': accent,
                '--ccv-rgb': rgb,
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: RADII.pill,
                zIndex: 2,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span
                className="ccv-nav-glyph"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: RADII.pill,
                  border: `1px solid ${GENERAL.line.soft}`,
                  background: GENERAL.surfaceTint,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d={ARROW_LEFT} />
                </svg>
              </span>
            </button>
          )}

          <div
            className="ccv-motion"
            key={index}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: 340,
              position: 'relative',
              isolation: 'isolate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RADII.panel,
              overflow: 'hidden',
              border: `1px solid ${GENERAL.line.faint}`,
              background: 'rgba(0,0,0,0.16)',
              animation: slideAnim,
            }}
          >
            {item?.image && (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: -24,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(22px) saturate(0.82)',
                    opacity: 0.30,
                    transform: 'scale(1.08)',
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.42)',
                  }}
                />
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </>
            )}
          </div>

          {items.length > 1 && (
            <button
              className="ccv-nav-btn"
              onClick={() => go(1)}
              aria-label={`Next: ${nextItem?.label || nextItem?.alt || 'item'}`}
              style={{
                '--ccv-accent': accent,
                '--ccv-rgb': rgb,
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: RADII.pill,
                zIndex: 2,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span
                className="ccv-nav-glyph"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: RADII.pill,
                  border: `1px solid ${GENERAL.line.soft}`,
                  background: GENERAL.surfaceTint,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d={ARROW_RIGHT} />
                </svg>
              </span>
            </button>
          )}
        </div>

        <div
          className="ccv-motion"
          key={`info-${index}`}
          style={{
            flexShrink: 0,
            padding: `${SPACING.compact}px ${SPACING.micro}px 0`,
            animation: slideAnim,
          }}
        >
          <h3 style={{
            ...TYPE.displayCard,
            color: accent,
            margin: `0 0 ${SPACING.micro}px`,
          }}>
            {item?.label}
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.micro,
          }}>
            {(item?.facts || []).map((fact, i) => (
              <p key={i} style={{
                ...(i === 0 ? TYPE.bodyStrong : TYPE.bodySmall),
                color: i === 0
                  ? 'rgba(245,245,245,0.86)'
                  : 'rgba(245,245,245,0.58)',
                margin: 0,
              }}>
                {fact}
              </p>
            ))}
          </div>
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
            animation={prefersReducedMotion
              ? 'none'
              : `ccv-slide-in-right ${MOTION.duration.slow} ${MOTION.easing.standard} both`}
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
