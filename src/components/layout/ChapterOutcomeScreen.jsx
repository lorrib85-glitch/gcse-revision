import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import BackButton from '../core/BackButton.jsx'

const IMAGES = {
  History:   '/historybacker.webp',
  Biology:   '/biologybacker.png',
  Maths:     '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics:   '/physicsbacker.webp',
  English:   '/Englishbacker.webp',
  Music:     '/historybacker.webp',
}

function BackBtn({ onClick }) {
  return (
    <BackButton
      onClick={onClick}
      style={{ position: 'absolute', top: 22, left: 18, zIndex: 10 }}
    />
  )
}

function ItemIcon({ icon, accent }) {
  if (icon === 'drop') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={accent} style={{ flexShrink: 0, marginTop: 4 }}>
      <path d="M12 2C9 7 4 12 4 16a8 8 0 0016 0C20 12 15 7 12 2z"/>
    </svg>
  )
  if (icon === 'star') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={accent} style={{ flexShrink: 0, marginTop: 4 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
  if (icon === 'prayer') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="2.2" strokeLinecap="round"
      style={{ flexShrink: 0, marginTop: 4 }}>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="6" y1="8" x2="18" y2="8"/>
    </svg>
  )
  if (icon === 'question') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: 4 }}>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill={accent} stroke="none"/>
    </svg>
  )
  return (
    <div style={{
      width: 5, height: 5, borderRadius: '50%', background: accent,
      flexShrink: 0, marginTop: 8,
    }} />
  )
}

export default function ChapterOutcomeScreen({
  subject      = 'History',
  chapterNum   = 1,
  chapterTitle = '',
  introText,         // kept for compat — not rendered
  outcomes     = [],
  onBack,
  onContinue,
}) {
  const img   = IMAGES[subject] || IMAGES.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [visibleCount, setVisibleCount] = useState(0)
  const [showCTA,      setShowCTA]      = useState(false)
  const [glowIdx,      setGlowIdx]      = useState(-1)

  // Stagger items ~400ms apart so each one lands as a distinct discovery
  useEffect(() => {
    const timers = outcomes.map((_, i) =>
      setTimeout(() => setVisibleCount(v => Math.max(v, i + 1)), 480 + i * 400)
    )
    const ctaTimer = setTimeout(() => setShowCTA(true), 480 + outcomes.length * 400 + 420)
    return () => { timers.forEach(clearTimeout); clearTimeout(ctaTimer) }
  }, [outcomes.length])

  // Pulse the icon of each item as it arrives, then settle
  useEffect(() => {
    if (visibleCount === 0) return
    const idx = visibleCount - 1
    setGlowIdx(idx)
    const t = setTimeout(() => setGlowIdx(-1), 680)
    return () => clearTimeout(t)
  }, [visibleCount])

  return (
    <>
      <style>{`
        @keyframes cos-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-row {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-cta {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cos-cta:active  { opacity: 0.6 !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D' }}>

        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center right',
          opacity: 0.27, filter: 'grayscale(10%) brightness(0.65)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Left-side dark gradient */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 220,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Content layer */}
        <div style={{ position: 'relative', zIndex: 5, minHeight: '100dvh' }}>
          <BackBtn onClick={onBack} />

          <div style={{ position: 'absolute', top: 100, left: 28, right: 28, maxWidth: 320 }}>

            {/* Chapter label */}
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.28em',
              color: accent, opacity: 0.92,
              marginBottom: 14,
              animation: 'cos-up 520ms ease 40ms both',
            }}>
              Chapter {chapterNum}
            </div>

            {/* Chapter title */}
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800, fontSize: 40,
              lineHeight: '44px', letterSpacing: '-0.04em',
              color: '#FFFFFF',
              marginBottom: 32,
              animation: 'cos-up 520ms ease 80ms both',
            }}>
              {chapterTitle}
            </div>

            {/* Discovery label */}
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.30em',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: 24,
              animation: 'cos-up 520ms ease 160ms both',
            }}>
              What you're about to uncover
            </div>

            {/* Discovery items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {outcomes.map((item, i) => {
                const text = typeof item === 'string' ? item       : item.text
                const icon = typeof item === 'string' ? null       : item.icon
                return i < visibleCount ? (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    animation: 'cos-row 380ms ease both',
                  }}>
                    <div style={{
                      flexShrink: 0,
                      filter: glowIdx === i
                        ? `drop-shadow(0 0 5px rgba(${rgb},0.95)) drop-shadow(0 0 14px rgba(${rgb},0.50))`
                        : 'none',
                      transform: glowIdx === i ? 'scale(1.20)' : 'scale(1)',
                      transition: `filter 500ms ${MOTION.easing.gentle}, transform 380ms ${MOTION.easing.gentle}`,
                    }}>
                      <ItemIcon icon={icon} accent={accent} />
                    </div>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500, fontSize: 18,
                      lineHeight: '26px',
                      color: 'rgba(255,255,255,0.86)',
                    }}>
                      {text}
                    </div>
                  </div>
                ) : null
              })}
            </div>

          </div>
        </div>

        {/* CTA — reduced weight, text-only style */}
        {showCTA && (
          <button
            className="cos-cta"
            onClick={onContinue}
            style={{
              position: 'fixed',
              bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
              left: 28,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              zIndex: 10,
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22,
              color: accent,
              animation: 'cos-cta 400ms ease 100ms both',
              transition: 'opacity 140ms ease',
            }}
          >
            Start chapter →
          </button>
        )}

      </div>
    </>
  )
}
