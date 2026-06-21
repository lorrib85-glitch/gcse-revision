import { useRef, useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'

const REVEAL_START_MS = 180
const PARAGRAPH_STAGGER_MS = 360
const CTA_DELAY_MS = 620
const TEXT_ANIMATION_MS = 560
const OVERLAY_FADE_MS = 420
const VIDEO_SAFETY_MS = 4000

// Splits paragraph text and wraps highlight phrases in accent-coloured spans
function renderHighlighted(text, highlights, accent) {
  if (!highlights?.length) return [text]
  let parts = [{ kind: 'text', content: text }]
  highlights.forEach(phrase => {
    parts = parts.flatMap(part => {
      if (part.kind === 'span') return [part]
      const idx = part.content.indexOf(phrase)
      if (idx === -1) return [part]
      const result = []
      if (idx > 0) result.push({ kind: 'text', content: part.content.slice(0, idx) })
      result.push({ kind: 'span', content: phrase })
      if (idx + phrase.length < part.content.length)
        result.push({ kind: 'text', content: part.content.slice(idx + phrase.length) })
      return result
    })
  })
  return parts.map((part, i) =>
    part.kind === 'span'
      ? <span key={i} style={{ color: accent, fontWeight: 800 }}>{part.content}</span>
      : part.content
  )
}

export default function CinematicRevealMoment({
  subject      = 'history',
  videoSrc,
  fallbackImage,
  year,
  label,
  headline,
  body,
  paragraphs   = [],
  onBack,
  onContinue,
  onTextRevealStart,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, background: bg } = theme

  const videoRef = useRef(null)
  const timers   = useRef([])

  const [videoEnded,  setVideoEnded]  = useState(false)
  const [videoError,  setVideoError]  = useState(false)
  const [yearVisible, setYearVisible] = useState(false)
  const [paraVisible, setParaVisible] = useState(() => new Array(paragraphs.length).fill(false))
  const [btnVisible,  setBtnVisible]  = useState(false)

  // Keep paragraph visibility in sync if the module content changes while mounted.
  useEffect(() => {
    setParaVisible(new Array(paragraphs.length).fill(false))
    setYearVisible(false)
    setBtnVisible(false)
    setVideoEnded(false)
  }, [paragraphs.length, videoSrc, fallbackImage])

  // Clear all pending timers on unmount
  useEffect(() => () => clearTimers(), [])

  // Safety net: if video stalls, start the learning reveal quickly rather than making
  // the screen feel broken. Still-image reveals wait for the user's tap.
  useEffect(() => {
    if (!videoSrc) return undefined
    const t = setTimeout(() => startReveal(), VIDEO_SAFETY_MS)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function schedule(fn, delay) {
    const timer = setTimeout(fn, delay)
    timers.current.push(timer)
  }

  function revealAllText() {
    clearTimers()
    setVideoEnded(true)
    setYearVisible(true)
    setParaVisible(new Array(paragraphs.length).fill(true))
    setBtnVisible(true)
    onTextRevealStart?.()
  }

  function startReveal() {
    if (videoEnded) return
    clearTimers()
    setVideoEnded(true)

    schedule(() => {
      setYearVisible(true)
      onTextRevealStart?.()
    }, REVEAL_START_MS)

    paragraphs.forEach((_, i) => {
      schedule(() => {
        setParaVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, REVEAL_START_MS + PARAGRAPH_STAGGER_MS * (i + 1))
    })

    const lastTextDelay = paragraphs.length > 0
      ? REVEAL_START_MS + PARAGRAPH_STAGGER_MS * paragraphs.length
      : REVEAL_START_MS

    schedule(() => setBtnVisible(true), lastTextDelay + CTA_DELAY_MS)
  }

  function handleTap() {
    if (!videoEnded) {
      // Tap skips/ends the video and starts the reveal.
      if (videoRef.current) videoRef.current.pause()
      startReveal()
      return
    }

    if (!btnVisible) {
      // Second tap during the reveal should finish the copy immediately, not do nothing.
      revealAllText()
      return
    }

    onContinue?.()
  }

  function handleVideoEnd() { startReveal() }
  function handleVideoError() { setVideoError(true); startReveal() }

  return (
    <>
      <style>{`
        @keyframes crm-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={handleTap}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: bg, overflow: 'hidden',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >

        {/* Video */}
        {!videoError && videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
            onEnded={handleVideoEnd}
            onError={handleVideoError}
          />
        )}

        {/* Fallback still image */}
        {(videoError || !videoSrc) && fallbackImage && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${fallbackImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
        )}

        {/* Base cinematic gradient — always present */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.25) 38%, rgba(0,0,0,0.74) 72%, rgba(0,0,0,0.93) 100%)',
        }} />

        {/* Left-side darkening for text legibility */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.10) 55%, transparent 100%)',
        }} />

        {/* Vignette around all edges */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.58) 100%)',
        }} />

        {/* Deepening overlay that transitions in on reveal */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.38)',
          opacity: videoEnded ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_MS}ms ease`,
        }} />

        {/* Text content — anchored to lower portion of screen */}
        <div style={{
          position: 'absolute',
          left: 32, right: 32, bottom: 104,
          maxWidth: 'calc(100vw - 64px)',
        }}>

          {/* Label */}
          {yearVisible && label && (
            <div style={{
              ...TYPE.overlayEyebrow,
              color: 'rgba(255,255,255,0.50)',
              marginBottom: 10,
              textShadow: '0 1px 16px rgba(0,0,0,0.5)',
              animation: `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {label}
            </div>
          )}

          {/* Headline */}
          {yearVisible && headline && (
            <div style={{
              ...TYPE.overlayTitle,
              color: 'rgba(255,255,255,0.97)',
              marginBottom: 14,
              maxWidth: 320,
              textShadow: '0 2px 24px rgba(0,0,0,0.55)',
              animation: `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {headline}
            </div>
          )}

          {/* Body */}
          {yearVisible && body && (
            <div style={{
              ...TYPE.overlayBody,
              whiteSpace: 'pre-line',
              color: 'rgba(255,255,255,0.64)',
              maxWidth: '34ch',
              textShadow: '0 1px 16px rgba(0,0,0,0.5)',
              animation: `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {body}
            </div>
          )}

          {/* Year — displayed when no label/headline/body, or alongside */}
          {yearVisible && !label && (
            <div style={{
              ...TYPE.impactTitle,
              color: accent,
              marginBottom: 24,
              textShadow: '0 2px 28px rgba(0,0,0,0.55)',
              animation: `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {year}
            </div>
          )}

          {/* Paragraphs */}
          {paragraphs.map((para, i) => paraVisible[i] && (
            <p key={i} style={{
              ...TYPE.overlayTitle,
              color: 'rgba(245,238,225,0.95)',
              margin: 0,
              marginBottom: i < paragraphs.length - 1 ? 22 : 0,
              textShadow: '0 1px 20px rgba(0,0,0,0.5)',
              animation: `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {renderHighlighted(para.text, para.highlights, accent)}
            </p>
          ))}
        </div>

        {/* Continue prompt — quiet text invite, appears after all copy is visible */}
        {btnVisible && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            style={{ position: 'absolute' }}
          />
        )}

      </div>
    </>
  )
}
