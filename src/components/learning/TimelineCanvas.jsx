import { useEffect, useId, useState, useRef, useLayoutEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
// CinematicShell used here because the horizontal spatial journey must reach the full
// viewport width with no horizontal padding; InteractionShell's inset would clip the
// connector rail and prevent the first and final journey cards centring correctly.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import {
  getNearestTimelineIndex,
  getTimelineCanvasGeometry,
  getTimelineDetailLayout,
  getTimelineScrollLeft,
} from './timelineCanvasGeometry.js'

// ─── TimelineCanvas ───────────────────────────────────────────────────────────
//
// Full-screen spatial journey / process explorer — deliberately different from
// TimelineChain. Horizontal movement is part of the meaning: the learner pans
// through connected places or stages, then reveals why each point mattered.
// Use TimelineChain instead when the content is simply a compact causal sequence.
//
// Block shape:
// {
//   type: 'timelineCanvas',
//   title?: 'How the plague travelled',
//   intro?: 'Swipe to follow the journey. Tap + to reveal why each stage mattered.',
//   steps: [
//     { id, image?: '/path.png', label: 'It began in central Asia',
//       detail: 'The plague spread west along trade routes...', stats?: ['c.1338', 'Central Asia'] },
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
    @keyframes tcv-plus-glow {
      0%, 100% { box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 0 0 rgba(var(--glow-rgb), 0.5); }
      50%      { box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 14px 3px rgba(var(--glow-rgb), 0.5); }
    }
    .tcv-scroller::-webkit-scrollbar { display: none; }
    .tcv-plus-btn {
      --s: 1;
      transform: translate(-50%, -50%) scale(var(--s));
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  left 0.3s ease,
                  top 0.3s ease,
                  background 0.3s ease,
                  color 0.3s ease;
    }
    .tcv-plus-btn:active { --s: 1.08; }
    .tcv-plus-btn.tcv-glow { animation: tcv-plus-glow 2.2s infinite ease-in-out; }
    .tcv-card {
      --ty: -50%;
      --s: 1;
      transform: translate(-50%, var(--ty)) scale(var(--s));
      transition: transform 0.4s ease, top 0.35s ease, box-shadow 0.4s ease, border-color 0.3s ease;
    }
    .tcv-card:active { --ty: -54%; --s: 1.015; }
    .tcv-connector-dot {
      transition: opacity 0.3s ease, top 0.35s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  `
  document.head.appendChild(el)
}

export default function TimelineCanvas({ block, subject = 'History', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []
  const detailIdBase = useId()

  const [openIndex, setOpenIndex] = useState(null)
  const [opened, setOpened] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasPanned, setHasPanned] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 390, height: 480 })

  const canvasRegionRef = useRef(null)
  const scrollerRef = useRef(null)
  const pathRefs = useRef([])
  const dotRefs = useRef([])
  const hasPannedRef = useRef(false)
  const openTimerRef = useRef(null)

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
  }, [])

  useLayoutEffect(() => {
    const region = canvasRegionRef.current
    if (!region) return undefined

    const measure = () => {
      const width = region.clientWidth
      const height = region.clientHeight
      if (!width || !height) return
      setCanvasSize(current => (
        current.width === width && current.height === height
          ? current
          : { width, height }
      ))
    }

    measure()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(region)
      return () => observer.disconnect()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    return undefined
  }, [])

  const geometry = getTimelineCanvasGeometry({
    width: canvasSize.width,
    height: canvasSize.height,
    stepCount: steps.length,
  })
  const detailLayout = getTimelineDetailLayout({ geometry, openIndex })
  const {
    canvasWidth: canvasW,
    canvasHeight: canvasH,
    cardWidth,
    cardHeight,
    mediaHeight,
    statsHeight,
    stepGap,
  } = geometry
  const displayCenters = detailLayout.centers

  const segments = displayCenters.slice(0, -1).map((center, i) => {
    const nextCenter = displayCenters[i + 1]
    const midX = (center.x + nextCenter.x) / 2
    return {
      d: `M ${center.x} ${center.y} C ${midX} ${center.y}, ${midX} ${nextCenter.y}, ${nextCenter.x} ${nextCenter.y}`,
      dot: { x: (center.x + nextCenter.x) / 2, y: (center.y + nextCenter.y) / 2 },
      from: center.x,
      to: nextCenter.x,
    }
  })

  // Draw each connector line in as the viewport moves across it. The same scroll
  // position also determines the governed current progress marker.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || segments.length === 0) return undefined

    const lengths = pathRefs.current.map(path => path?.getTotalLength?.() || 0)
    pathRefs.current.forEach((path, i) => {
      if (path) path.style.strokeDasharray = `${lengths[i]}`
    })

    function update() {
      const focusX = scroller.scrollLeft + scroller.clientWidth / 2
      const nearestIndex = getNearestTimelineIndex({ centers: geometry.centers, focusX })
      setCurrentIndex(previous => (previous === nearestIndex ? previous : nearestIndex))

      segments.forEach((segment, i) => {
        const progress = Math.max(0, Math.min(1, (focusX - segment.from) / (segment.to - segment.from)))
        const path = pathRefs.current[i]
        if (path) path.style.strokeDashoffset = `${lengths[i] * (1 - progress)}`
        const dot = dotRefs.current[i]
        if (dot) {
          const lit = progress > 0.5
          dot.style.opacity = lit ? '1' : '0'
          dot.style.transform = `translate(-50%,-50%) scale(${lit ? 1 : 0.4})`
        }
      })

      if (!hasPannedRef.current && scroller.scrollLeft > 4) {
        hasPannedRef.current = true
        setHasPanned(true)
      }
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [steps.length, canvasW, canvasH, stepGap, detailLayout.verticalOffset])

  function centreCard(index, behavior = 'smooth') {
    const scroller = scrollerRef.current
    const center = geometry.centers[index]
    if (!scroller || !center) return true

    const targetLeft = getTimelineScrollLeft({
      centerX: center.x,
      viewportWidth: scroller.clientWidth,
      canvasWidth: canvasW,
    })
    const alreadyCentred = Math.abs(scroller.scrollLeft - targetLeft) < 4

    if (typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ left: targetLeft, behavior })
    } else {
      scroller.scrollLeft = targetLeft
    }
    setCurrentIndex(index)
    return alreadyCentred
  }

  function toggleDetail(index) {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)

    if (openIndex === index) {
      setOpenIndex(null)
      return
    }

    setOpenIndex(null)
    setOpened(previous => {
      const next = new Set(previous)
      next.add(index)
      return next
    })

    const alreadyCentred = centreCard(index)
    if (alreadyCentred) {
      setOpenIndex(index)
      return
    }

    openTimerRef.current = window.setTimeout(() => {
      setOpenIndex(index)
      openTimerRef.current = null
    }, 320)
  }

  const allOpened = steps.length > 0 && opened.size === steps.length

  return (
    <CinematicShell style={{
      background: GENERAL.backgroundApp,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    }}>
      <div
        data-timeline-canvas-intent="spatial-journey"
        style={{
          padding: `0 ${SPACING.standard}px`,
          marginBottom: SPACING.micro,
          flexShrink: 0,
        }}
      >
        {block.title && (
          <h2 style={{
            ...TYPE.displaySection,
            fontSize: 'clamp(24px, 7.5vw, 32px)',
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

      <div
        ref={canvasRegionRef}
        data-timeline-canvas-region="true"
        style={{ flex: 1, position: 'relative', minHeight: 0 }}
      >
        <div
          ref={scrollerRef}
          className="tcv-scroller"
          aria-label="Timeline journey"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0, width: canvasW, height: canvasH }}>
            <svg
              width={canvasW}
              height={canvasH}
              viewBox={`0 0 ${canvasW} ${canvasH}`}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              {segments.map((segment, i) => (
                <path
                  key={i}
                  ref={element => { pathRefs.current[i] = element }}
                  d={segment.d}
                  stroke={`rgba(${rgb},0.32)`}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  style={{ strokeDasharray: 600, strokeDashoffset: 600 }}
                />
              ))}
            </svg>

            {segments.map((segment, i) => (
              <div
                key={i}
                ref={element => { dotRefs.current[i] = element }}
                className="tcv-connector-dot"
                style={{
                  position: 'absolute',
                  left: segment.dot.x,
                  top: segment.dot.y,
                  transform: 'translate(-50%,-50%) scale(0.4)',
                  opacity: 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: accent,
                  border: '6px solid #08090D',
                  boxShadow: `0 0 14px rgba(${rgb},0.55)`,
                  zIndex: 2,
                }}
              />
            ))}

            {steps.map((step, index) => {
              const center = displayCenters[index]
              const isOpen = openIndex === index
              const stats = step.stats || ['Tap for detail']
              const detailId = `${detailIdBase}-detail-${index}`
              const detailHeadingId = `${detailId}-heading`
              const controlLeft = isOpen
                ? center.x + cardWidth / 2 - 22
                : center.x + cardWidth / 2 - 8
              const controlTop = isOpen
                ? center.y - cardHeight / 2 + 22
                : center.y + cardHeight / 2 - 8

              return (
                <div key={step.id || index}>
                  <div
                    className="tcv-card"
                    data-selected={isOpen ? 'true' : 'false'}
                    style={{
                      position: 'absolute',
                      left: center.x,
                      top: center.y,
                      width: cardWidth,
                      height: cardHeight,
                      borderRadius: RADII.large,
                      border: `1px solid ${isOpen ? `rgba(${rgb},0.58)` : `rgba(${rgb},0.18)`}`,
                      background: 'rgba(255,255,255,0.03)',
                      boxShadow: isOpen
                        ? `0 22px 54px rgba(0,0,0,0.62), 0 0 22px rgba(${rgb},0.12)`
                        : '0 20px 48px rgba(0,0,0,0.5)',
                      overflow: 'hidden',
                      zIndex: isOpen ? 6 : 3,
                      scrollSnapAlign: 'center',
                      scrollSnapStop: 'always',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: mediaHeight,
                      width: '100%',
                      overflow: 'hidden',
                      background: '#000',
                    }}>
                      {step.image && (
                        <img
                          src={step.image}
                          alt=""
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(180deg, rgba(${rgb},0.16) 0%, rgba(8,9,13,0) 45%, rgba(8,9,13,0.85) 100%)`,
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 0,
                        width: '100%',
                        textAlign: 'center',
                        ...TYPE.titleLarge,
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.96)',
                        textShadow: '0 3px 10px rgba(0,0,0,0.6)',
                        padding: '0 12px',
                        boxSizing: 'border-box',
                      }}>
                        {step.label}
                      </div>
                    </div>

                    <div style={{
                      height: statsHeight,
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      ...TYPE.metadata,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.46)',
                      background: 'rgba(255,255,255,0.02)',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {stats.map((stat, statIndex) => (
                        <span key={statIndex}>{stat}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`tcv-plus-btn${!opened.has(index) ? ' tcv-glow' : ''}`}
                    data-control-position={isOpen ? 'card-top-right' : 'card-bottom-right'}
                    aria-label={isOpen
                      ? `Close explanation for ${step.label}`
                      : `Reveal why ${step.label} mattered`}
                    aria-expanded={isOpen}
                    aria-controls={detailId}
                    onClick={() => toggleDetail(index)}
                    style={{
                      position: 'absolute',
                      left: controlLeft,
                      top: controlTop,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: `2px solid rgba(${rgb},0.5)`,
                      background: isOpen ? accent : `rgba(${rgb},0.14)`,
                      color: isOpen ? GENERAL.textOnAccent : accent,
                      ...TYPE.button,
                      fontSize: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                      zIndex: isOpen ? 7 : 4,
                      padding: 0,
                      WebkitTapHighlightColor: 'transparent',
                      '--glow-rgb': rgb,
                    }}
                  >
                    {isOpen ? '×' : '+'}
                  </button>

                  {isOpen && (
                    <div
                      id={detailId}
                      role="region"
                      aria-labelledby={detailHeadingId}
                      data-timeline-detail-sheet="anchored"
                      style={{
                        position: 'absolute',
                        left: SPACING.standard,
                        right: SPACING.standard,
                        bottom: 0,
                        height: detailLayout.sheetHeight,
                        boxSizing: 'border-box',
                        padding: SPACING.standard,
                        borderRadius: `${RADII.large}px ${RADII.large}px 0 0`,
                        background: `rgba(${rgb},0.09)`,
                        border: `1px solid rgba(${rgb},0.26)`,
                        borderBottom: 'none',
                        boxShadow: '0 -18px 42px rgba(0,0,0,0.46)',
                        animation: `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                        zIndex: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        id={detailHeadingId}
                        style={{
                          ...TYPE.eyebrow,
                          textTransform: 'uppercase',
                          color: accent,
                          marginBottom: SPACING.micro,
                        }}
                      >
                        Why it mattered
                      </div>
                      <div style={{
                        ...TYPE.bodyStrong,
                        color: 'rgba(255,255,255,0.82)',
                        overflowY: 'auto',
                        maxHeight: `calc(100% - ${SPACING.standard + SPACING.micro}px)`,
                        paddingRight: 4,
                      }}>
                        {step.detail}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {steps.length > 1 && openIndex === null && !hasPanned && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            ...TYPE.label,
            color: accent,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            animation: 'tcv-bounce 2s infinite ease-in-out',
            zIndex: 9,
          }}>
            Swipe to explore →
          </div>
        )}
      </div>

      {steps.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: SPACING.compact,
          flexShrink: 0,
        }}>
          <SequenceProgress
            total={steps.length}
            current={currentIndex}
            viewed={Array.from(opened)}
            accent={accent}
            accentRgb={rgb}
            compact
            ariaLabel="Timeline progress"
          />
        </div>
      )}

      <div style={{
        marginTop: SPACING.standard,
        padding: `0 ${SPACING.standard}px`,
        flexShrink: 0,
      }}>
        {allOpened ? (
          <ContinueCTA
            onClick={onContinue}
            accent={accent}
            style={{ animation: `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}
          />
        ) : (
          <div style={{ ...TYPE.label, color: 'rgba(255,255,255,0.32)' }}>
            Tap each + to continue
          </div>
        )}
      </div>
    </CinematicShell>
  )
}
