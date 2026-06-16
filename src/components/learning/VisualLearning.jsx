import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
// CinematicShell used here because full-bleed background imagery and the global
// click-to-advance handler need full viewport coverage without content padding.
import CinematicShell from '../layout/CinematicShell.jsx'

const SLIDE_MS = 420

function injectStyles() {
  if (document.getElementById('vl-css')) return
  const s = document.createElement('style')
  s.id = 'vl-css'
  s.textContent = `
    @keyframes vl-in {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes vl-bg-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes vl-hint {
      0%, 100% { opacity: 0; transform: translateY(0); }
      40%, 60% { opacity: 0.5; transform: translateY(-4px); }
    }
    @keyframes vl-reveal-in {
      from { opacity: 0; transform: scale(0.97) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `
  document.head.appendChild(s)
}

export default function VisualLearning({ block, subject, onComplete }) {
  injectStyles()

  const scenes  = block?.scenes  || []
  const palette = SUBJECTS[subject] || SUBJECTS.History
  const accent  = palette.accent || '#C89B6D'

  const [idx,     setIdx]     = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [bgKey,   setBgKey]   = useState(0)
  const [hint,    setHint]    = useState(false)
  const locked = useRef(false)

  const scene  = scenes[idx] || {}
  const isLast = idx === scenes.length - 1

  // Show tap hint after a pause on each new scene
  useEffect(() => {
    setHint(false)
    const t = setTimeout(() => setHint(true), 1800)
    return () => clearTimeout(t)
  }, [idx])

  // Preload next scene's image
  useEffect(() => {
    const next = scenes[idx + 1]
    if (next?.image) {
      const img = new window.Image()
      img.src = next.image
    }
  }, [idx, scenes])

  function advance() {
    if (locked.current) return
    locked.current = true
    setTimeout(() => { locked.current = false }, SLIDE_MS)
    setHint(false)
    if (isLast) {
      onComplete?.()
    } else {
      setIdx(i => i + 1)
      setAnimKey(k => k + 1)
      setBgKey(k => k + 1)
    }
  }

  if (!scenes.length) return null

  const isFinalReveal = !!scene.finalReveal

  return (
    <CinematicShell style={{ background: '#08090D', zIndex: 100 }}>
      <div
        onClick={advance}
        style={{
          position: 'absolute', inset: 0,
          cursor: 'pointer',
          userSelect: 'none', WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
      {/* Background image — keyed so it fades between scenes */}
      {scene.image && (
        <div
          key={bgKey}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${scene.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: `vl-bg-in ${SLIDE_MS}ms ease both`,
          }}
        />
      )}

      {/* Cinematic gradient — heavy at bottom, breathes at top */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isFinalReveal
          ? 'rgba(8,9,13,0.72)'
          : 'linear-gradient(to bottom, rgba(8,9,13,0.12) 0%, rgba(8,9,13,0.22) 30%, rgba(8,9,13,0.72) 62%, rgba(8,9,13,0.96) 100%)',
      }} />

      {/* Scene content */}
      {isFinalReveal ? (
        // Final reveal — centred, large synthesis statement
        <div
          key={animKey}
          style={{
            position: 'relative', zIndex: 1,
            height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 36px',
            animation: `vl-reveal-in ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(28px, 7.5vw, 40px)',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {scene.headline}
          </div>

          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(17px, 4.5vw, 21px)',
            lineHeight: 1.55,
            color: accent,
            textAlign: 'center',
            maxWidth: 340,
          }}>
            {scene.body}
          </div>

          {/* Tap to continue hint */}
          {hint && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(44px + env(safe-area-inset-bottom, 0px))',
              left: 0, right: 0, textAlign: 'center',
              pointerEvents: 'none',
              animation: 'vl-hint 2.8s ease infinite',
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>
                tap to continue
              </span>
            </div>
          )}
        </div>
      ) : (
        // Regular scene — bottom-weighted like ConceptReveal
        <div
          key={animKey}
          style={{
            position: 'relative', zIndex: 1,
            height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 28px calc(88px + env(safe-area-inset-bottom, 0px))',
            animation: `vl-in ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(26px, 7vw, 36px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            marginBottom: 14,
            maxWidth: 380,
          }}>
            {scene.headline}
          </div>

          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(15px, 4vw, 17px)',
            lineHeight: 1.65,
            color: 'rgba(245,238,225,0.62)',
            maxWidth: 360,
          }}>
            {scene.body}
          </div>

          {/* Scene counter */}
          <div style={{
            display: 'flex', gap: 6,
            marginTop: 28,
          }}>
            {scenes.map((_, i) => (
              <div key={i} style={{
                height: 2, flex: 1,
                maxWidth: 28,
                background: i <= idx ? accent : 'rgba(255,255,255,0.18)',
                borderRadius: 2,
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>

          {/* Tap hint */}
          {hint && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(44px + env(safe-area-inset-bottom, 0px))',
              left: 0, right: 0, textAlign: 'center',
              pointerEvents: 'none',
              animation: 'vl-hint 2.8s ease infinite',
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>
                tap to continue
              </span>
            </div>
          )}
        </div>
      )}
      </div>
    </CinematicShell>
  )
}
