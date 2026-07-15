import { useState, useRef, useCallback, useEffect } from 'react'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// The learner must push the divider past both of these before the takeaway
// and Continue are earned — seeing both sides is the learning, not optional.
const EXPLORE_LEFT = 25
const EXPLORE_RIGHT = 75

export default function BeforeAfterImageSlider({
  beforeSrc,
  afterSrc,
  beforeAlt   = '',
  afterAlt    = '',
  beforeLabel = 'Before',
  afterLabel  = 'After',
  heading,
  accent      = null,
  revealText  = null,
  initial     = 50,
  onComplete,
}) {
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  const [pct, setPct]             = useState(() => Math.min(100, Math.max(0, initial)))
  const containerRef               = useRef(null)
  const rafRef                     = useRef(null)
  const pendingPctRef              = useRef(pct)
  const [entered, setEntered]     = useState(reduceMotion)
  const [showPulse, setShowPulse] = useState(false)
  const [seenBefore, setSeenBefore] = useState(false)
  const [seenAfter, setSeenAfter]   = useState(false)
  const explored = seenBefore && seenAfter

  const accentColor = accent ?? GENERAL.softWhite

  useEffect(() => {
    if (reduceMotion) return
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  // Single gentle handle pulse 500ms after entry — teaches the interaction without text
  useEffect(() => {
    if (!entered || reduceMotion) return
    const t = setTimeout(() => setShowPulse(true), 500)
    return () => clearTimeout(t)
  }, [entered, reduceMotion])

  // Exploration tracking — crossing each threshold once is enough
  useEffect(() => {
    if (pct > EXPLORE_RIGHT) setSeenBefore(true)
    if (pct < EXPLORE_LEFT)  setSeenAfter(true)
  }, [pct])

  // Apply queued pct via rAF — keeps DOM writes in the animation frame
  const flush = useCallback(() => {
    setPct(pendingPctRef.current)
    rafRef.current = null
  }, [])

  const schedulePct = useCallback((next) => {
    pendingPctRef.current = Math.min(100, Math.max(0, next))
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(flush)
    }
  }, [flush])

  // ── Pointer events — use pointer capture so we don't need global listeners ──
  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const rect = el.getBoundingClientRect()
    schedulePct(((e.clientX - rect.left) / rect.width) * 100)
  }, [schedulePct])

  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current?.hasPointerCapture(e.pointerId)) return
    const rect = containerRef.current.getBoundingClientRect()
    schedulePct(((e.clientX - rect.left) / rect.width) * 100)
  }, [schedulePct])

  const handlePointerUp = useCallback((e) => {
    containerRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  // ── Keyboard support ──
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); schedulePct(pct - 5) }
    if (e.key === 'ArrowRight') { e.preventDefault(); schedulePct(pct + 5) }
    if (e.key === 'Home')       { e.preventDefault(); schedulePct(0) }
    if (e.key === 'End')        { e.preventDefault(); schedulePct(100) }
  }, [pct, schedulePct])

  // Cancel any pending rAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`

  const labelChip = {
    position: 'absolute',
    top: SPACING.compact,
    padding: `${SPACING.micro / 2}px ${SPACING.micro}px`,
    background: GENERAL.scrim,
    borderRadius: RADII.pill,
    border: `1px solid ${GENERAL.line.soft}`,
    ...TYPE.caption,
    color: GENERAL.feedbackText,
    pointerEvents: 'none',
    transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: GENERAL.backgroundApp,
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(8px)',
      transition: reduceMotion
        ? 'none'
        : `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
    }}>

      <style>{`
        @keyframes bas-hint {
          0%   { box-shadow: 0 0 0 0px  ${GENERAL.ring.pulse}, ${GENERAL.shadow.raised}; }
          55%  { box-shadow: 0 0 0 14px rgba(255,255,255,0), ${GENERAL.shadow.raised}; }
          100% { box-shadow: 0 0 0 3px  ${GENERAL.ring.rest}, ${GENERAL.shadow.raised}; }
        }
        .bas-slider:focus-visible {
          outline: 2px solid ${accentColor};
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .bas-handle { animation: none !important; }
        }
      `}</style>

      {/* ── Heading — question is the hero ── */}
      {heading && (
        <div style={{
          padding: `calc(${SPACING.cinematic}px + ${SPACING.micro}px) ${SPACING.standard}px ${SPACING.compact}px`,
          flexShrink: 0,
        }}>
          <p style={{
            ...TYPE.displayScreen,
            color: GENERAL.feedbackText,
            margin: 0,
          }}>
            {heading}
          </p>
        </div>
      )}

      {/* ── Slider frame — height-capped so heading, image and CTA share one viewport ── */}
      <div style={{
        flex: '1 1 auto',
        minHeight: 0,
        padding: `0 ${SPACING.compact}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div
          ref={containerRef}
          className="bas-slider"
          role="slider"
          aria-label={`${beforeLabel} vs ${afterLabel} comparison`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(100 - pct)}% ${afterLabel} visible`}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            maxHeight: '100%',
            borderRadius: RADII.medium,
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            cursor: 'ew-resize',
            boxShadow: GENERAL.shadow.overlay,
          }}
        >
          {/* Before image — base layer */}
          <img
            src={beforeSrc}
            alt={beforeAlt}
            draggable={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
            }}
          />

          {/* After image — clipped top layer */}
          <img
            src={afterSrc}
            alt={afterAlt}
            draggable={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              clipPath,
              pointerEvents: 'none',
              willChange: 'clip-path',
            }}
          />

          {/* Divider line */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${pct}%`,
            width: 2,
            transform: 'translateX(-50%)',
            background: GENERAL.feedbackText,
            pointerEvents: 'none',
          }} />

          {/* Handle */}
          <div
            className="bas-handle"
            style={{
              position: 'absolute',
              top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: 48,
              height: 48,
              borderRadius: RADII.pill,
              background: accentColor,
              boxShadow: `0 0 0 3px ${GENERAL.ring.rest}, ${GENERAL.shadow.raised}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              animation: showPulse
                ? `bas-hint ${MOTION.duration.slow} ${MOTION.easing.gentle} 1 both`
                : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 6l-4 4 4 4" stroke={GENERAL.textOnAccent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6l4 4-4 4" stroke={GENERAL.textOnAccent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Labels — meaningful information, not decorative metadata */}
          {beforeLabel && (
            <div style={{
              ...labelChip,
              left: SPACING.compact,
              opacity: pct < 15 ? 0 : 1,
            }}>
              {beforeLabel}
            </div>
          )}
          {afterLabel && (
            <div style={{
              ...labelChip,
              right: SPACING.compact,
              opacity: pct > 85 ? 0 : 1,
            }}>
              {afterLabel}
            </div>
          )}
        </div>
      </div>

      {/* ── Takeaway — space reserved from the start; stays once earned ── */}
      {revealText && (
        <div style={{
          flexShrink: 0,
          padding: `${SPACING.compact}px ${SPACING.standard}px 0`,
        }}>
          <p style={{
            ...TYPE.bodySmall,
            color: GENERAL.feedbackText,
            textAlign: 'center',
            margin: 0,
            opacity: explored ? 1 : 0,
            visibility: explored ? 'visible' : 'hidden',
            transition: reduceMotion ? 'none' : `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
          }}>
            {revealText}
          </p>
        </div>
      )}

      {/* ── Continue — earned by exploring both sides ── */}
      <div style={{
        flexShrink: 0,
        padding: `${SPACING.compact}px ${SPACING.standard}px`,
        paddingBottom: `calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
      }}>
        <ContinueCTA
          onClick={onComplete}
          accent={accent}
          disabled={!explored}
          style={{
            opacity: explored ? 1 : 0,
            visibility: explored ? 'visible' : 'hidden',
            transition: reduceMotion
              ? `transform ${BUTTONS.continue.transition}`
              : `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}, transform ${BUTTONS.continue.transition}`,
          }}
        />
      </div>

    </div>
  )
}
