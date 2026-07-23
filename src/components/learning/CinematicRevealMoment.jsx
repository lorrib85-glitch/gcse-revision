import { useRef, useState, useEffect, useMemo } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'

const REVEAL_START_MS = 220
const PARAGRAPH_STAGGER_MS = 720
const CTA_DELAY_MS = 760
const TEXT_ANIMATION_MS = 620
const OVERLAY_FADE_MS = 420
const VIDEO_SAFETY_MS = 4000
const CINEMATIC_LABEL_COLOR = 'rgba(245,238,225,0.50)'
const CINEMATIC_HEADLINE_COLOR = 'rgba(245,238,225,0.97)'
const CINEMATIC_BODY_COLOR = 'rgba(245,238,225,0.78)'
const CINEMATIC_FINAL_LINE_COLOR = 'rgba(245,238,225,0.92)'

const BLACK_DEATH_OPENING_BODY = 'In June 1348, ships docked at Melcombe in Dorset.\n\nWithin weeks, people began to die.\n\nThe disease moved fast — through towns, villages, and monasteries.\n\nNo one knew what it was. No one knew how to stop it.'
const BLACK_DEATH_REFINED_BODY = 'Ships arrive at Melcombe, Dorset.\n\nIt looks like ordinary trade.\n\nThen people start dying.\n\nThe disease spreads fast — through ports, towns and villages.\n\nSoon, around a third of England is dead.\n\nThis is the Black Death.'

function resolveCinematicCopy({ label, headline, body }) {
  const isBlackDeathOpening = label === 'ENGLAND, 1348' && headline === 'Something is coming.' && body === BLACK_DEATH_OPENING_BODY
  if (!isBlackDeathOpening) return { headline, body }
  return { headline: 'June 1348.', body: BLACK_DEATH_REFINED_BODY }
}

function resolveCinematicLabel(label) {
  return label === 'ENGLAND, 1348' ? 'ENGLAND · 1348' : label
}

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
  const { headline: resolvedHeadline, body: resolvedBody } = resolveCinematicCopy({ label, headline, body })
  const resolvedLabel = resolveCinematicLabel(label)

  const bodyLines = useMemo(
    () => String(resolvedBody || '')
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean),
    [resolvedBody]
  )

  const videoRef = useRef(null)
  const timers   = useRef([])

  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined'
      && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  const [videoEnded,      setVideoEnded]      = useState(false)
  const [videoError,      setVideoError]      = useState(false)
  const [yearVisible,     setYearVisible]     = useState(false)
  const [bodyLineVisible, setBodyLineVisible] = useState(() => new Array(bodyLines.length).fill(false))
  const [paraVisible,     setParaVisible]     = useState(() => new Array(paragraphs.length).fill(false))
  const [btnVisible,      setBtnVisible]      = useState(false)

  // Keep paragraph visibility in sync if the module content changes while mounted.
  useEffect(() => {
    setBodyLineVisible(new Array(bodyLines.length).fill(false))
    setParaVisible(new Array(paragraphs.length).fill(false))
    setYearVisible(false)
    setBtnVisible(false)
    setVideoEnded(false)
  }, [bodyLines.length, paragraphs.length, videoSrc, fallbackImage])

  // Clear all pending timers on unmount
  useEffect(() => () => clearTimers(), [])

  // Safety net: if video stalls, start the learning reveal quickly rather than making
  // the screen feel broken. Reduced-motion and still-image reveals wait for the user's tap.
  useEffect(() => {
    if (!videoSrc || reduceMotion) return undefined
    const t = setTimeout(() => startReveal(), VIDEO_SAFETY_MS)
    return () => clearTimeout(t)
  }, [videoSrc, reduceMotion]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setBodyLineVisible(new Array(bodyLines.length).fill(true))
    setParaVisible(new Array(paragraphs.length).fill(true))
    setBtnVisible(true)
    onTextRevealStart?.()
  }

  function startReveal() {
    if (videoEnded) return

    if (reduceMotion) {
      revealAllText()
      return
    }

    clearTimers()
    setVideoEnded(true)

    schedule(() => {
      setYearVisible(true)
      onTextRevealStart?.()
    }, REVEAL_START_MS)

    bodyLines.forEach((_, i) => {
      schedule(() => {
        setBodyLineVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, REVEAL_START_MS + PARAGRAPH_STAGGER_MS * (i + 1))
    })

    paragraphs.forEach((_, i) => {
      const revealIndex = bodyLines.length + i + 1
      schedule(() => {
        setParaVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, REVEAL_START_MS + PARAGRAPH_STAGGER_MS * revealIndex)
    })

    const totalRevealItems = bodyLines.length + paragraphs.length
    const lastTextDelay = totalRevealItems > 0
      ? REVEAL_START_MS + PARAGRAPH_STAGGER_MS * totalRevealItems
      : REVEAL_START_MS

    schedule(() => setBtnVisible(true), lastTextDelay + CTA_DELAY_MS)
  }

  function handleTap() {
    if (!videoEnded) {
      // Tap skips/ends the video or still image and starts the reveal.
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

  const textAnimation = reduceMotion
    ? 'none'
    : `crm-up ${TEXT_ANIMATION_MS}ms cubic-bezier(.16,1,.3,1) both`

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

        {/* Video is omitted entirely for reduced-motion users. */}
        {!reduceMotion && !videoError && videoSrc && (
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
        {(reduceMotion || videoError || !videoSrc) && fallbackImage && (
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
          transition: reduceMotion ? 'none' : `opacity ${OVERLAY_FADE_MS}ms ease`,
        }} />

        {/* Text content — anchored to lower portion of screen */}
        <div style={{
          position: 'absolute',
          left: 32, right: 32, bottom: 104,
          maxWidth: 'calc(100vw - 64px)',
        }}>

          {/* Label */}
          {yearVisible && resolvedLabel && (
            <div style={{
              ...TYPE.eyebrow,
              color: CINEMATIC_LABEL_COLOR,
              marginBottom: 10,
              textShadow: '0 1px 16px rgba(0,0,0,0.5)',
              animation: textAnimation,
            }}>
              {resolvedLabel}
            </div>
          )}

          {/* Headline */}
          {yearVisible && resolvedHeadline && (
            <div style={{
              ...TYPE.displaySection,
              color: CINEMATIC_HEADLINE_COLOR,
              marginBottom: 14,
              maxWidth: 320,
              textShadow: '0 2px 24px rgba(0,0,0,0.55)',
              animation: textAnimation,
            }}>
              {resolvedHeadline}
            </div>
          )}

          {/* Body — revealed one line at a time */}
          {yearVisible && bodyLines.length > 0 && (
            <div style={{
              ...TYPE.bodyStrong,
              color: CINEMATIC_BODY_COLOR,
              maxWidth: '34ch',
              textShadow: '0 1px 16px rgba(0,0,0,0.5)',
            }}>
              {bodyLines.map((line, i) => {
                if (!bodyLineVisible[i]) return null
                const isFinalLine = i === bodyLines.length - 1
                return (
                  <p key={`${line}-${i}`} style={{
                    margin: 0,
                    marginBottom: i < bodyLines.length - 1 ? 20 : 0,
                    color: isFinalLine ? CINEMATIC_FINAL_LINE_COLOR : CINEMATIC_BODY_COLOR,
                    fontWeight: isFinalLine ? 600 : undefined,
                    animation: textAnimation,
                  }}>
                    {line}
                  </p>
                )
              })}
            </div>
          )}

          {/* Year — displayed when no label/headline/body, or alongside */}
          {yearVisible && !resolvedLabel && (
            <div style={{
              ...TYPE.displayHero,
              color: accent,
              marginBottom: 24,
              textShadow: '0 2px 28px rgba(0,0,0,0.55)',
              animation: textAnimation,
            }}>
              {year}
            </div>
          )}

          {/* Paragraphs */}
          {paragraphs.map((para, i) => paraVisible[i] && (
            <p key={i} style={{
              ...TYPE.displaySection,
              color: 'rgba(245,238,225,0.95)',
              margin: 0,
              marginBottom: i < paragraphs.length - 1 ? 22 : 0,
              textShadow: '0 1px 20px rgba(0,0,0,0.5)',
              animation: textAnimation,
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
