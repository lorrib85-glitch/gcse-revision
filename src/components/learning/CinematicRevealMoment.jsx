import { useRef, useState, useEffect } from 'react'

// Subject palettes — extend when adding new subjects
const PALETTES = {
  history: {
    accent: '#C89B6D',
    bg:     '#241815',
  },
  biology: {
    accent: '#38D27A',
    bg:     '#081A10',
  },
  chemistry: {
    accent: '#5CC8FF',
    bg:     '#071522',
  },
  physics: {
    accent: '#5DA9E9',
    bg:     '#070E1C',
  },
  maths: {
    accent: '#2BBE9A',
    bg:     '#071512',
  },
  english: {
    accent: '#9E3D52',
    bg:     '#150810',
  },
  sociology: {
    accent: '#C9B07C',
    bg:     '#181410',
  },
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
  paragraphs   = [],
  onBack,
  onContinue,
  onTextRevealStart,
}) {
  const key   = (subject || 'history').toLowerCase()
  const pal   = PALETTES[key] || PALETTES.history
  const { accent, bg } = pal

  const videoRef = useRef(null)
  const timers   = useRef([])

  const [videoEnded,  setVideoEnded]  = useState(false)
  const [videoError,  setVideoError]  = useState(false)
  const [yearVisible, setYearVisible] = useState(false)
  const [paraVisible, setParaVisible] = useState(() => new Array(paragraphs.length).fill(false))
  const [btnVisible,  setBtnVisible]  = useState(false)

  // Clear all pending timers on unmount
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function schedule(fn, delay) {
    timers.current.push(setTimeout(fn, delay))
  }

  function startReveal() {
    if (videoEnded) return
    setVideoEnded(true)

    // Year: 300ms after still, duration 900ms
    // Also signal parent that text has started revealing (so header can fade in)
    schedule(() => { setYearVisible(true); onTextRevealStart?.() }, 300)

    // Each para: 900ms after the previous one STARTS
    // Para 0 starts at 300+900=1200ms
    // Para 1 starts at 1200+900=2100ms, etc.
    paragraphs.forEach((_, i) => {
      schedule(() => {
        setParaVisible(prev => {
          const next = [...prev]; next[i] = true; return next
        })
      }, 300 + 900 * (i + 1))
    })

    // Button: last para start + last para duration (1300ms) + 600ms delay
    const lastParaStart = 300 + 900 * paragraphs.length
    schedule(() => setBtnVisible(true), lastParaStart + 1300 + 600)
  }

  function handleVideoEnd() { startReveal() }
  function handleVideoError() { setVideoError(true); startReveal() }

  // Para animation duration: last para gets 1300ms, others 1100ms
  function paraDuration(i) { return i === paragraphs.length - 1 ? 1300 : 1100 }

  return (
    <>
      <style>{`
        @keyframes crm-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes crm-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes crm-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: bg, overflow: 'hidden',
      }}>

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

        {/* Deepening overlay that transitions in on video end */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.38)',
          opacity: videoEnded ? 1 : 0,
          transition: 'opacity 900ms ease',
        }} />

        {/* Text content — anchored to lower portion of screen */}
        <div style={{
          position: 'absolute',
          left: 32, right: 32, bottom: 104,
          maxWidth: 'calc(100vw - 64px)',
        }}>

          {/* Year */}
          {yearVisible && (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900, fontSize: 62,
              lineHeight: 0.95, letterSpacing: '-0.04em',
              color: accent,
              marginBottom: 26,
              textShadow: '0 2px 28px rgba(0,0,0,0.55)',
              animation: 'crm-up 900ms cubic-bezier(.16,1,.3,1) both',
            }}>
              {year}
            </div>
          )}

          {/* Paragraphs */}
          {paragraphs.map((para, i) => paraVisible[i] && (
            <p key={i} style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 24,
              lineHeight: 1.2, letterSpacing: '-0.025em',
              color: 'rgba(245,238,225,0.95)',
              margin: 0,
              marginBottom: i < paragraphs.length - 1 ? 28 : 0,
              textShadow: '0 1px 20px rgba(0,0,0,0.5)',
              animation: `crm-up ${paraDuration(i)}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              {renderHighlighted(para.text, para.highlights, accent)}
            </p>
          ))}
        </div>

        {/* Continue prompt — quiet text invite, appears after all copy is visible */}
        {btnVisible && (
          <button
            onClick={onContinue}
            style={{
              position: 'absolute',
              left: 32, right: 32,
              bottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
              background: 'none', border: 'none', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              animation: 'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite',
            }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 13,
              letterSpacing: '0.34em', textTransform: 'uppercase',
              color: accent,
              textShadow: '0 1px 16px rgba(0,0,0,0.6)',
            }}>Continue&nbsp;&nbsp;→</span>
          </button>
        )}

      </div>
    </>
  )
}
