import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'

const IMAGES = {
  History:   '/historybacker.png',
  Biology:   '/biologybacker.png',
  Maths:     '/mathsbacker.png',
  Sociology: '/sociologybacker.png',
  Chemistry: '/chemsistrybacker.png',
  Physics:   '/physicsbacker.png',
  English:   '/Englishbacker.png',
  Music:     '/historybacker.png',
}

function BackBtn({ onClick }) {
  return (
    <button
      className="cos-back"
      onClick={onClick}
      aria-label="Go back"
      style={{
        position: 'absolute', top: 22, left: 18, zIndex: 10,
        width: 46, height: 46, borderRadius: RADII.pill,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 140ms ease',
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.58)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
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

  useEffect(() => {
    const timers = outcomes.map((_, i) =>
      setTimeout(() => setVisibleCount(v => Math.max(v, i + 1)), 420 + i * 90)
    )
    const ctaTimer = setTimeout(() => setShowCTA(true), 420 + outcomes.length * 90 + 200)
    return () => { timers.forEach(clearTimeout); clearTimeout(ctaTimer) }
  }, [outcomes.length])

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
        .cos-back:active { background: rgba(255,255,255,0.08) !important; }
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
              Things you're about to discover
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
                    <ItemIcon icon={icon} accent={accent} />
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
