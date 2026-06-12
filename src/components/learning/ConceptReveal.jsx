import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

const STEP_MS = 380

export default function ConceptReveal({ subject: subjectProp, steps = [], onContinue, onRevealStart }) {
  const theme  = SUBJECTS[subjectProp] || SUBJECTS.History
  const accent = theme.accent
  const palBg  = theme.background

  const [stepIdx,       setStepIdx]       = useState(0)
  const [animKey,       setAnimKey]       = useState(0)
  const [hintOn,        setHintOn]        = useState(false)
  const [revealStarted, setRevealStarted] = useState(false)

  const touchRef = useRef({ x: null, y: null })

  const step   = steps[stepIdx] || {}
  const isLast = stepIdx === steps.length - 1

  const bg = step.backgroundImage
    ? `url(${step.backgroundImage})`
    : `linear-gradient(160deg, ${palBg} 0%, #080C1A 100%)`

  useEffect(() => {
    setHintOn(false)
    const t = setTimeout(() => setHintOn(true), 1500)
    return () => clearTimeout(t)
  }, [stepIdx])

  function advance() {
    if (!revealStarted) {
      setRevealStarted(true)
      onRevealStart?.()
    }
    setHintOn(false)
    if (isLast) {
      onContinue?.()
    } else {
      setStepIdx(i => i + 1)
      setAnimKey(k => k + 1)
    }
  }

  function retreat() {
    if (stepIdx > 0) {
      setStepIdx(i => i - 1)
      setAnimKey(k => k + 1)
    }
  }

  function onTouchStart(e) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e) {
    const { x, y } = touchRef.current
    if (x === null) return
    const dx = e.changedTouches[0].clientX - x
    const dy = e.changedTouches[0].clientY - y
    touchRef.current = { x: null, y: null }
    if (Math.abs(dx) < Math.abs(dy) * 1.4 || Math.abs(dx) < 44) return
    dx < 0 ? advance() : retreat()
  }

  function onClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    ;(e.clientX - rect.left) / rect.width < 0.2 ? retreat() : advance()
  }

  return (
    <>
      <style>{`
        @keyframes crSlideIn {
          from { opacity:0; transform:translateY(22px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes crHintPulse {
          0%,100% { opacity:0; transform:translateY(0) }
          35%,65% { opacity:.5; transform:translateY(-3px) }
        }
      `}</style>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: bg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Atmosphere breathes at top, grounds the text at base */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.18) 35%, rgba(0,0,0,.68) 65%, rgba(0,0,0,.94) 100%)',
        }} />

        {/* Content — bottom-weighted so atmosphere fills the top */}
        <div
          key={animKey}
          style={{
            position: 'relative', zIndex: 1,
            padding: '0 32px 108px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: `crSlideIn ${STEP_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          {step.eyebrow && (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '.68rem',
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: accent + '88',
              marginBottom: 12,
              lineHeight: 1.3,
            }}>
              {step.eyebrow}
            </div>
          )}

          <MainReveal text={step.mainText} emphasis={step.emphasis} accent={accent} />

          {step.supportText && (
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(.88rem, 3.4vw, 1rem)',
              fontWeight: 500,
              lineHeight: 1.6,
              color: 'rgba(245,238,225,.52)',
              margin: '16px 0 0',
              maxWidth: '88%',
            }}>
              {step.supportText}
            </p>
          )}

          {step.microPoints?.length > 0 && (
            <ul style={{
              listStyle: 'none', padding: 0,
              margin: '12px 0 0',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {step.microPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    display: 'block',
                    width: 3, height: 3, borderRadius: '50%',
                    background: accent + '66',
                    marginTop: '0.6em', flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '.8rem',
                    color: 'rgba(245,238,225,.42)',
                    lineHeight: 1.5,
                  }}>{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Step dots — quiet orientation only */}
        {steps.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 28, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 7,
            zIndex: 2, pointerEvents: 'none',
          }}>
            {steps.map((_, i) => (
              <span key={i} style={{
                display: 'block',
                width: 5, height: 5,
                borderRadius: '50%',
                background: i <= stepIdx ? accent : 'rgba(255,255,255,.2)',
                opacity: i === stepIdx ? 1 : i < stepIdx ? 0.45 : 0.22,
                transition: 'background .3s, opacity .3s',
              }} />
            ))}
          </div>
        )}

        {/* Gesture hint */}
        {hintOn && (
          <div style={{
            position: 'absolute', bottom: 46, left: 0, right: 0,
            zIndex: 2, textAlign: 'center', pointerEvents: 'none',
            animation: 'crHintPulse 3.2s ease infinite',
          }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '.62rem', fontWeight: 600,
              letterSpacing: '.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.38)',
            }}>
              {isLast ? 'tap to finish' : 'tap to continue'}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

function MainReveal({ text, emphasis, accent }) {
  if (!text) return null

  const base = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 900,
    fontSize: 'clamp(3rem, 12vw, 5.2rem)',
    lineHeight: 1.0,
    letterSpacing: '-.04em',
    color: 'rgba(245,238,225,0.97)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textShadow: '0 2px 32px rgba(0,0,0,.6)',
  }

  if (!emphasis) return <div style={base}>{text}</div>

  const phrases = Array.isArray(emphasis) ? emphasis : [emphasis]
  let segs = [text]

  for (const phrase of phrases) {
    const out = []
    for (const seg of segs) {
      if (typeof seg !== 'string') { out.push(seg); continue }
      const idx = seg.toLowerCase().indexOf(phrase.toLowerCase())
      if (idx === -1) { out.push(seg); continue }
      if (idx > 0) out.push(seg.slice(0, idx))
      out.push({ em: true, val: seg.slice(idx, idx + phrase.length) })
      if (idx + phrase.length < seg.length) out.push(seg.slice(idx + phrase.length))
    }
    segs = out
  }

  return (
    <div style={base}>
      {segs.map((s, i) =>
        typeof s === 'string' ? (
          <span key={i}>{s}</span>
        ) : (
          <span key={i} style={{
            color: accent,
            textShadow: `0 0 40px ${accent}44`,
          }}>{s.val}</span>
        )
      )}
    </div>
  )
}
