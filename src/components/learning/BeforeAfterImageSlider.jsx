import { useState, useRef, useCallback, useEffect } from 'react'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

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
  const [pct, setPct]             = useState(() => Math.min(100, Math.max(0, initial)))
  const containerRef               = useRef(null)
  const rafRef                     = useRef(null)
  const pendingPctRef              = useRef(pct)
  const [entered, setEntered]     = useState(false)
  const [showPulse, setShowPulse] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Single gentle handle pulse 500ms after entry — teaches the interaction without text
  useEffect(() => {
    if (!entered) return
    const t = setTimeout(() => setShowPulse(true), 500)
    return () => clearTimeout(t)
  }, [entered])

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: '#08090D',
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(8px)',
      transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
    }}>

      <style>{`
        @keyframes bas-hint {
          0%   { box-shadow: 0 0 0 0px  rgba(255,255,255,0.50), 0 4px 16px rgba(0,0,0,0.55); }
          55%  { box-shadow: 0 0 0 14px rgba(255,255,255,0.00), 0 4px 16px rgba(0,0,0,0.55); }
          100% { box-shadow: 0 0 0 3px  rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.55); }
        }
      `}</style>

      {/* ── Heading — question is the hero ── */}
      {heading && (
        <div style={{ padding: '80px 24px 12px', flexShrink: 0 }}>
          <p style={{
            ...TYPE.cinematic,
            fontSize: 'clamp(1.75rem, 9.5vw, 2.375rem)',
            color: '#F5F7FF',
            margin: 0,
          }}>
            {heading}
          </p>
        </div>
      )}

      {/* ── Slider frame ── */}
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          ref={containerRef}
          role="slider"
          aria-label={`${beforeLabel} vs ${afterLabel} comparison`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
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
            borderRadius: RADII.medium,
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            cursor: 'ew-resize',
            outline: 'none',
            boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
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
            background: 'rgba(255,255,255,0.80)',
            pointerEvents: 'none',
          }} />

          {/* Handle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: accent ?? 'rgba(245,238,225,0.60)',
            boxShadow: `0 0 0 3px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.55)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            animation: showPulse
              ? `bas-hint ${MOTION.duration.slow} ${MOTION.easing.gentle} 1 both`
              : 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 6l-4 4 4 4" stroke="#08090D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6l4 4-4 4" stroke="#08090D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Labels — quiet museum captions */}
          {beforeLabel && (
            <div style={{
              position: 'absolute',
              top: 12, left: 12,
              padding: '3px 8px',
              background: 'rgba(8,9,13,0.28)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: 'rgba(245,238,225,0.58)',
              pointerEvents: 'none',
              opacity: pct < 15 ? 0 : 1,
              transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
            }}>
              {beforeLabel}
            </div>
          )}
          {afterLabel && (
            <div style={{
              position: 'absolute',
              top: 12, right: 12,
              padding: '3px 8px',
              background: 'rgba(8,9,13,0.28)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: 'rgba(245,238,225,0.58)',
              pointerEvents: 'none',
              opacity: pct > 85 ? 0 : 1,
              transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
            }}>
              {afterLabel}
            </div>
          )}

          {/* Micro-copy — revealed when the after side dominates */}
          {revealText && (
            <div style={{
              position: 'absolute',
              bottom: 14,
              left: 12,
              right: 12,
              textAlign: 'center',
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 12,
              lineHeight: 1.55,
              color: 'rgba(245,238,225,0.82)',
              textShadow: '0 1px 6px rgba(0,0,0,0.72)',
              opacity: pct > 75 ? 1 : 0,
              transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
              pointerEvents: 'none',
            }}>
              {revealText}
            </div>
          )}
        </div>
      </div>

      {/* ── Continue ── */}
      <div style={{ padding: '20px 24px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))', flexShrink: 0 }}>
        <ContinueCTA
          onClick={onComplete}
          accent={accent}
        />
      </div>

    </div>
  )
}
