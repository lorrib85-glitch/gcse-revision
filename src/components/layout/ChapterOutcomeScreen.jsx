import { useState, useEffect } from 'react'

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

const PALETTES = {
  History:   { accent: '#D4A84B', rgb: '212,168,75'  },
  Biology:   { accent: '#38D27A', rgb: '56,210,122'  },
  Maths:     { accent: '#2BBE9A', rgb: '43,190,154'  },
  Sociology: { accent: '#C9B07C', rgb: '201,176,124' },
  Chemistry: { accent: '#5CC8FF', rgb: '92,200,255'  },
  Physics:   { accent: '#5DA9E9', rgb: '93,169,233'  },
  English:   { accent: '#9E3D52', rgb: '158,61,82'   },
  Music:     { accent: '#C778DD', rgb: '199,120,221' },
}

function BackBtn({ onClick }) {
  return (
    <button
      className="cos-back"
      onClick={onClick}
      aria-label="Go back"
      style={{
        position: 'absolute', top: 22, left: 18, zIndex: 10,
        width: 46, height: 46, borderRadius: 999,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 140ms ease',
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.78)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  )
}

export default function ChapterOutcomeScreen({
  subject      = 'History',
  chapterNum   = 1,
  chapterTitle = '',
  introText    = '',
  outcomes     = [],
  onBack,
  onContinue,
}) {
  const img     = IMAGES[subject]   || IMAGES.History
  const palette = PALETTES[subject] || PALETTES.History
  const { accent, rgb } = palette

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
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-cta {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cos-back:active { background: rgba(255,255,255,0.10) !important; }
        .cos-cta:active  { transform: scale(0.985) !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D' }}>

        {/* Background image — atmospheric texture */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          filter: 'blur(0.5px) brightness(0.55) grayscale(8%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Global dark overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,13,0.42)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Left-side darkening — keeps text readable */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.96) 0%, rgba(8,9,13,0.86) 34%, rgba(8,9,13,0.58) 64%, rgba(8,9,13,0.18) 100%)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Bottom fade — lifts the CTA out of the image */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 240,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.98) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {/* Back button */}
        <div style={{ position: 'relative', zIndex: 6 }}>
          <BackBtn onClick={onBack} />
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 5,
          paddingTop: 120, paddingLeft: 28, paddingRight: 28,
          paddingBottom: 160,
          overflowY: 'auto', maxHeight: '100dvh',
        }}>
          <div style={{ maxWidth: 320 }}>

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

            {/* Chapter title — hero text */}
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800, fontSize: 42,
              lineHeight: '44px', letterSpacing: '-0.04em',
              color: '#FFFFFF',
              marginBottom: 18,
              animation: 'cos-up 520ms ease 80ms both',
            }}>
              {chapterTitle}
            </div>

            {/* Intro text */}
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500, fontSize: 18,
              lineHeight: '29px',
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 300,
              marginBottom: 52,
              animation: 'cos-up 520ms ease 160ms both',
            }}>
              {introText}
            </div>

            {/* Outcome rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {outcomes.map((outcome, i) => i < visibleCount ? (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  animation: 'cos-row 420ms ease both',
                }}>
                  {/* Vertical accent bar */}
                  <div style={{
                    width: 4, height: 22,
                    borderRadius: 999, flexShrink: 0, marginTop: 5,
                    background: accent,
                    boxShadow: `0 0 14px rgba(${rgb},0.34)`,
                  }} />
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500, fontSize: 20,
                    lineHeight: '31px',
                    color: '#FFFFFF',
                    maxWidth: 280,
                  }}>
                    {outcome}
                  </div>
                </div>
              ) : null)}
            </div>

          </div>
        </div>

        {/* CTA — fixed at bottom, appears after final outcome */}
        {showCTA && (
          <button
            className="cos-cta"
            onClick={onContinue}
            style={{
              position: 'fixed', bottom: 56, left: 28, right: 28, zIndex: 10,
              height: 58, borderRadius: 18,
              background: `rgba(${rgb},0.14)`,
              border: `1px solid rgba(${rgb},0.24)`,
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 24px',
              cursor: 'pointer',
              boxShadow: `0 0 28px rgba(${rgb},0.12)`,
              transition: 'transform 120ms ease',
              animation: 'cos-cta 320ms ease both',
            }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 20,
              color: '#FFFFFF',
            }}>Start chapter</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.88)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}

      </div>
    </>
  )
}
