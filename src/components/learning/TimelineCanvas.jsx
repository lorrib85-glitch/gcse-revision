import { useEffect, useId, useMemo, useState, useRef, useLayoutEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
// CinematicShell is used because the horizontal spatial journey must reach the full
// viewport width; an inset shell would clip the connector rail and card centring.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import {
  getNearestTimelineIndex,
  getTimelineCanvasGeometry,
  getTimelineCardFocus,
  getTimelineDetailLayout,
  getTimelineScrollLeft,
} from './timelineCanvasGeometry.js'
import { getTimelineCanvasTheme } from './timelineCanvasTheme.js'

// ─── TimelineCanvas ───────────────────────────────────────────────────────────
//
// Full-screen spatial journey / process explorer — deliberately different from
// TimelineChain. Horizontal movement is part of the meaning: the learner pans
// through connected places or stages, then reveals why each point mattered.
// Use TimelineChain instead when the content is simply a compact causal sequence.

const HEADER_CLEARANCE = SPACING.cinematic + SPACING.micro
const OPEN_DELAY_MS = Number.parseInt(MOTION.duration.standard, 10)

let _tcvStyled = false
function ensureStyles() {
  if (_tcvStyled) return
  _tcvStyled = true
  const element = document.createElement('style')
  element.textContent = `
    @keyframes tcv-fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes tcv-plus-glow {
      0%, 100% { box-shadow: var(--tcv-control-shadow), 0 0 0 0 transparent; }
      50% { box-shadow: var(--tcv-control-shadow), 0 0 13px 3px var(--tcv-control-glow); }
    }
    @keyframes tcv-hint-slide {
      0%, 100% { opacity: 0.34; transform: translateX(-50%); }
      50% { opacity: 0.72; transform: translateX(calc(-50% + 8px)); }
    }
    .tcv-scroller::-webkit-scrollbar { display: none; }
    .tcv-card-group {
      transform: translate(-50%, -50%) scale(var(--tcv-focus-scale, 1));
      filter: brightness(var(--tcv-focus-brightness, 1));
      transition:
        top ${MOTION.duration.standard} ${MOTION.easing.standard},
        transform ${MOTION.duration.instant} linear,
        filter ${MOTION.duration.instant} linear;
      will-change: transform, filter;
    }
    .tcv-card {
      transition:
        border-color ${MOTION.duration.fast} ${MOTION.easing.standard},
        box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard};
    }
    .tcv-connector-active {
      filter: var(--tcv-connector-glow);
    }
    .tcv-plus-btn {
      transform: translate(-35%, -35%) scale(var(--tcv-control-scale, 1));
      transition:
        transform ${MOTION.duration.fast} ${MOTION.easing.standard},
        background ${MOTION.duration.fast} ${MOTION.easing.standard},
        color ${MOTION.duration.fast} ${MOTION.easing.standard};
    }
    .tcv-plus-btn:active { --tcv-control-scale: ${MOTION.scale.press}; }
    .tcv-plus-btn.tcv-glow { animation: tcv-plus-glow 2.2s infinite ease-in-out; }
    .tcv-plus-btn:focus-visible {
      outline: 2px solid var(--tcv-accent);
      outline-offset: 4px;
    }
    .tcv-connector-dot {
      transition:
        opacity ${MOTION.duration.fast} ${MOTION.easing.standard},
        top ${MOTION.duration.standard} ${MOTION.easing.standard},
        transform ${MOTION.duration.fast} ${MOTION.easing.standard};
      will-change: transform, opacity;
    }
    .tcv-swipe-hint {
      animation: tcv-hint-slide 1.2s ${MOTION.easing.standard} 2;
    }
    @media (prefers-reduced-motion: reduce) {
      .tcv-motion,
      .tcv-card-group,
      .tcv-card,
      .tcv-plus-btn,
      .tcv-connector-dot,
      .tcv-sequence-progress * {
        animation: none !important;
        transition: none !important;
      }
      .tcv-scroller { scroll-behavior: auto !important; }
    }
  `
  document.head.appendChild(element)
}

function TimelineImageFallback({ accent }) {
  return (
    <div
      data-timeline-image-fallback="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg aria-hidden="true" width="86" height="54" viewBox="0 0 86 54" fill="none">
        <path
          d="M7 42C20 42 20 12 37 12s15 30 31 30h11"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.58"
        />
        <circle cx="7" cy="42" r="4" fill={accent} opacity="0.72" />
        <circle cx="37" cy="12" r="4" fill={accent} opacity="0.72" />
        <circle cx="79" cy="42" r="4" fill={accent} opacity="0.72" />
      </svg>
    </div>
  )
}

export default function TimelineCanvas({ block, subject = 'History', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const visual = useMemo(
    () => getTimelineCanvasTheme({ accent, accentRgb: rgb }),
    [accent, rgb],
  )
  const prefersReducedMotion = Boolean(useReducedMotion())
  const steps = block.steps || []
  const detailIdBase = useId()

  const [openIndex, setOpenIndex] = useState(null)
  const [opened, setOpened] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasPanned, setHasPanned] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 390, height: 480 })

  const canvasRegionRef = useRef(null)
  const scrollerRef = useRef(null)
  const cardGroupRefs = useRef([])
  const cardRefs = useRef([])
  const pathRefs = useRef([])
  const dotRefs = useRef([])
  const hasPannedRef = useRef(false)
  const lastNearestRef = useRef(0)
  const openTimerRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
    if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current)
  }, [])

  useEffect(() => {
    setShowSwipeHint(true)
    if (steps.length <= 1) return undefined

    const timeout = window.setTimeout(
      () => setShowSwipeHint(false),
      prefersReducedMotion ? 1800 : 3800,
    )
    return () => window.clearTimeout(timeout)
  }, [steps.length, prefersReducedMotion])

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

    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
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

  const segments = displayCenters.slice(0, -1).map((center, index) => {
    const nextCenter = displayCenters[index + 1]
    const midX = (center.x + nextCenter.x) / 2
    return {
      d: `M ${center.x} ${center.y} C ${midX} ${center.y}, ${midX} ${nextCenter.y}, ${nextCenter.x} ${nextCenter.y}`,
      dot: { x: (center.x + nextCenter.x) / 2, y: (center.y + nextCenter.y) / 2 },
      from: center.x,
      to: nextCenter.x,
    }
  })

  // The active route and card growth use the same focus point. As the glowing
  // connector reaches a waypoint, that opaque card grows to full size and clarity.
  // DOM styles are updated in one animation frame rather than re-rendering per pixel.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const lengths = pathRefs.current.map(path => path?.getTotalLength?.() || 0)
    pathRefs.current.forEach((path, index) => {
      if (!path) return
      path.style.strokeDasharray = prefersReducedMotion ? 'none' : `${lengths[index]}`
      if (prefersReducedMotion) path.style.strokeDashoffset = '0'
    })

    function update() {
      animationFrameRef.current = null
      const focusX = scroller.scrollLeft + scroller.clientWidth / 2
      const nearestIndex = getNearestTimelineIndex({ centers: geometry.centers, focusX })

      if (lastNearestRef.current !== nearestIndex) {
        lastNearestRef.current = nearestIndex
        setCurrentIndex(nearestIndex)
        if (openIndex !== null && nearestIndex !== openIndex) setOpenIndex(null)
      }

      geometry.centers.forEach((center, index) => {
        const focusState = getTimelineCardFocus({
          centerX: center.x,
          focusX,
          stepGap,
          reducedMotion: prefersReducedMotion,
        })
        const group = cardGroupRefs.current[index]
        const card = cardRefs.current[index]
        if (group) {
          group.style.setProperty('--tcv-focus-scale', focusState.scale.toFixed(3))
          group.style.setProperty('--tcv-focus-brightness', focusState.brightness.toFixed(3))
          group.style.zIndex = openIndex === index ? '7' : `${3 + Math.round(focusState.focus * 2)}`
          group.dataset.focused = focusState.focus > 0.92 ? 'true' : 'false'
          group.dataset.routeArrival = focusState.routeArrival > 0.92
            ? 'joined'
            : focusState.routeArrival > 0.18
              ? 'approaching'
              : 'waiting'
        }
        if (card) {
          card.style.borderColor = openIndex === index
            ? visual.cardBorderSelected
            : focusState.focus > 0.72
              ? visual.cardBorderFocused
              : visual.cardBorder
          card.style.boxShadow = openIndex === index
            ? visual.cardShadowSelected
            : focusState.focus > 0.72
              ? visual.cardShadowFocused
              : visual.cardShadow
        }
      })

      segments.forEach((segment, index) => {
        const progress = prefersReducedMotion
          ? 1
          : Math.max(0, Math.min(1, (focusX - segment.from) / (segment.to - segment.from)))
        const path = pathRefs.current[index]
        if (path && !prefersReducedMotion) {
          path.style.strokeDashoffset = `${lengths[index] * (1 - progress)}`
        }
        const dot = dotRefs.current[index]
        if (dot) {
          const dotFocus = getTimelineCardFocus({
            centerX: segment.dot.x,
            focusX,
            stepGap,
            reducedMotion: prefersReducedMotion,
          })
          const visible = prefersReducedMotion || progress > 0.5
          dot.style.opacity = visible ? `${0.72 + dotFocus.focus * 0.28}` : '0'
          dot.style.transform = `translate(-50%,-50%) scale(${visible ? 0.82 + dotFocus.focus * 0.28 : 0.4})`
        }
      })

      if (!hasPannedRef.current && scroller.scrollLeft > 4) {
        hasPannedRef.current = true
        setHasPanned(true)
        setShowSwipeHint(false)
      }
    }

    function scheduleUpdate() {
      if (animationFrameRef.current) return
      animationFrameRef.current = window.requestAnimationFrame(update)
    }

    scheduleUpdate()
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', scheduleUpdate)
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current)
    }
  }, [
    steps.length,
    canvasW,
    canvasH,
    stepGap,
    detailLayout.verticalOffset,
    openIndex,
    prefersReducedMotion,
    visual.cardBorder,
    visual.cardBorderFocused,
    visual.cardBorderSelected,
    visual.cardShadow,
    visual.cardShadowFocused,
    visual.cardShadowSelected,
  ])

  function centreCard(index, behavior = prefersReducedMotion ? 'auto' : 'smooth') {
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
    lastNearestRef.current = index
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
    if (alreadyCentred || prefersReducedMotion) {
      setOpenIndex(index)
      return
    }

    openTimerRef.current = window.setTimeout(() => {
      setOpenIndex(index)
      openTimerRef.current = null
    }, OPEN_DELAY_MS)
  }

  const allOpened = steps.length > 0 && opened.size === steps.length
  const openStep = openIndex === null ? null : steps[openIndex]
  const openDetailId = openIndex === null ? null : `${detailIdBase}-detail-${openIndex}`
  const openDetailHeadingId = openDetailId ? `${openDetailId}-heading` : null

  return (
    <CinematicShell
      className={prefersReducedMotion ? 'tcv-reduced-motion' : undefined}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      style={{
        background: visual.canvasBackground,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: `calc(${HEADER_CLEARANCE}px + env(safe-area-inset-top, 0px))`,
        paddingBottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
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
            color: visual.titleText,
            margin: '0 0 8px',
          }}>
            {block.title}
          </h2>
        )}
        {block.intro && (
          <p style={{ ...TYPE.bodyStrong, color: visual.introText, margin: 0 }}>
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
            scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0, width: canvasW, height: canvasH }}>
            <svg
              width={canvasW}
              height={canvasH}
              viewBox={`0 0 ${canvasW} ${canvasH}`}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              {segments.map((segment, index) => (
                <path
                  key={`base-${index}`}
                  data-connector-layer="base"
                  d={segment.d}
                  stroke={visual.connectorInactive}
                  strokeWidth={visual.connectorBaseWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
              {segments.map((segment, index) => (
                <path
                  key={`active-${index}`}
                  ref={element => { pathRefs.current[index] = element }}
                  className="tcv-connector-active"
                  data-connector-layer="active"
                  d={segment.d}
                  stroke={visual.connectorActive}
                  strokeWidth={visual.connectorActiveWidth}
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 600,
                    strokeDashoffset: prefersReducedMotion ? 0 : 600,
                    '--tcv-connector-glow': visual.connectorGlow,
                  }}
                />
              ))}
            </svg>

            {segments.map((segment, index) => (
              <div
                key={index}
                ref={element => { dotRefs.current[index] = element }}
                className="tcv-connector-dot tcv-motion"
                style={{
                  position: 'absolute',
                  left: segment.dot.x,
                  top: segment.dot.y,
                  transform: 'translate(-50%,-50%) scale(0.4)',
                  opacity: prefersReducedMotion ? 1 : 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: visual.nodeActive,
                  border: `6px solid ${visual.nodeRing}`,
                  boxShadow: visual.nodeShadow,
                  zIndex: 1,
                }}
              />
            ))}

            {steps.map((step, index) => {
              const center = displayCenters[index]
              const isOpen = openIndex === index
              const stats = step.stats || ['Tap for detail']
              const detailId = `${detailIdBase}-detail-${index}`

              return (
                <div
                  key={step.id || index}
                  ref={element => { cardGroupRefs.current[index] = element }}
                  className="tcv-card-group tcv-motion"
                  data-timeline-card-group={index}
                  data-selected={isOpen ? 'true' : 'false'}
                  data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
                  data-route-arrival={prefersReducedMotion || index === currentIndex ? 'joined' : 'waiting'}
                  style={{
                    position: 'absolute',
                    left: center.x,
                    top: center.y,
                    width: cardWidth,
                    height: cardHeight,
                    '--tcv-focus-scale': prefersReducedMotion || index === currentIndex ? 1 : 0.66,
                    '--tcv-focus-brightness': prefersReducedMotion || index === currentIndex ? 1 : 0.58,
                    zIndex: isOpen ? 7 : index === currentIndex ? 5 : 3,
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                  }}
                >
                  <div
                    ref={element => { cardRefs.current[index] = element }}
                    className="tcv-card"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: RADII.large,
                      border: `1px solid ${isOpen ? visual.cardBorderSelected : visual.cardBorder}`,
                      background: visual.cardSurface,
                      boxShadow: isOpen ? visual.cardShadowSelected : visual.cardShadow,
                      overflow: 'hidden',
                      isolation: 'isolate',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: mediaHeight,
                      width: '100%',
                      overflow: 'hidden',
                      background: step.image ? visual.mediaBackground : visual.mediaFallback,
                    }}>
                      {step.image ? (
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
                      ) : (
                        <TimelineImageFallback accent={accent} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: visual.mediaScrim }} />
                      <div style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 0,
                        width: '100%',
                        textAlign: 'center',
                        ...TYPE.titleLarge,
                        fontSize: 16,
                        color: visual.mediaTitle,
                        textShadow: visual.mediaTitleShadow,
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
                      color: visual.metadataText,
                      background: visual.metadataSurface,
                      borderTop: `1px solid ${visual.metadataDivider}`,
                    }}>
                      {stats.map((stat, statIndex) => (
                        <span key={statIndex}>{stat}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`tcv-plus-btn tcv-motion${!opened.has(index) && !prefersReducedMotion ? ' tcv-glow' : ''}`}
                    data-control-position="card-top-left"
                    data-control-symbol={isOpen ? 'close' : 'reveal'}
                    aria-label={isOpen
                      ? `Close explanation for ${step.label}`
                      : `Reveal why ${step.label} mattered`}
                    aria-expanded={isOpen}
                    aria-controls={detailId}
                    onClick={() => toggleDetail(index)}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: `2px solid ${visual.controlBorder}`,
                      background: isOpen ? visual.controlActive : visual.controlRest,
                      color: isOpen ? visual.controlTextActive : visual.controlText,
                      ...TYPE.button,
                      fontSize: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: visual.controlShadow,
                      cursor: 'pointer',
                      zIndex: 8,
                      padding: 0,
                      WebkitTapHighlightColor: 'transparent',
                      '--tcv-accent': accent,
                      '--tcv-control-shadow': visual.controlShadow,
                      '--tcv-control-glow': visual.controlGlow,
                    }}
                  >
                    {isOpen ? '×' : '+'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {openStep && openDetailId && openDetailHeadingId && (
          <div
            id={openDetailId}
            role="region"
            aria-labelledby={openDetailHeadingId}
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
              background: visual.detailSurface,
              border: `1px solid ${visual.detailBorder}`,
              borderBottom: 'none',
              boxShadow: visual.detailShadow,
              animation: prefersReducedMotion
                ? 'none'
                : `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
              zIndex: 8,
              overflow: 'hidden',
            }}
          >
            <div
              id={openDetailHeadingId}
              style={{
                ...TYPE.eyebrow,
                textTransform: 'uppercase',
                color: visual.detailEyebrow,
                marginBottom: SPACING.micro,
              }}
            >
              Why it mattered
            </div>
            <div style={{
              ...TYPE.bodyStrong,
              color: visual.settledText,
              overflowY: 'auto',
              maxHeight: `calc(100% - ${SPACING.standard + SPACING.micro}px)`,
              paddingRight: SPACING.micro / 2,
            }}>
              {openStep.detail}
            </div>
          </div>
        )}

        {steps.length > 1 && openIndex === null && !hasPanned && showSwipeHint && (
          <div
            className={`tcv-swipe-hint${prefersReducedMotion ? '' : ' tcv-motion'}`}
            style={{
              position: 'absolute',
              top: SPACING.micro,
              left: '50%',
              transform: 'translateX(-50%)',
              ...TYPE.label,
              color: visual.swipeHint,
              textShadow: visual.swipeHintShadow,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          >
            Swipe →
          </div>
        )}
      </div>

      {steps.length > 0 && (
        <div className="tcv-sequence-progress" style={{
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
            style={{
              animation: prefersReducedMotion
                ? 'none'
                : `tcv-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}
          />
        ) : (
          <div style={{ ...TYPE.label, color: visual.quietText }}>
            Explore each point to continue
          </div>
        )}
      </div>
    </CinematicShell>
  )
}
