import { useState } from 'react'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'

let _wsrStyled = false
function ensureStyles() {
  if (_wsrStyled) return
  _wsrStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes wsr-fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes wsr-shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `
  document.head.appendChild(el)
}

// ─── WeakSpotRecovery v1 — LOCKED COMPONENT ─────────────────────────────────
//
// Premium intervention screen shown when a learner struggles with a concept.
//
// Design philosophy:
// - Calm, cinematic, intelligent
// - Emotionally mature (not gamified)
// - Behavioural feedback (not self-report confidence)
// - Actionable recovery path
//
// Block data shape:
// {
//   type: 'weakSpotRecovery',
//   subject: 'History',
//   topicId: 'miasma-theory',
//   title: 'Miasma theory',
//   explanation: 'You mixed this up with germ theory.',
//   meta: '3 QUESTIONS • UNDER 90 SECONDS',
//   cta: 'Fix this weak spot',
//   skipText: 'Skip for now',
//   recoveryQuizId: 'history-miasma-recovery-1'
// }
//
// Props:
// - block: data object (see above)
// - subject: subject name for colour resolution
// - progress: { current: number, total: number } — for "12 / 12" header
// - onBack: callback when back button tapped
// - onFixWeakSpot: callback(recoveryQuizId) when CTA tapped
// - onSkip: callback when skip tapped

export default function WeakSpotRecovery({
  block,
  subject,
  progress,
  onBack,
  onFixWeakSpot,
  onSkip,
}) {
  ensureStyles()

  const accent    = SUBJECT_ACCENTS[subject] || '#B38B63'
  const rgb       = hexToRgb(accent)
  const [isPressed, setIsPressed] = useState(false)

  const F = { fontFamily: "'Sora', sans-serif" }
  const Serif = { fontFamily: "'Cormorant Garamond', serif" }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#080C14',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      animation: 'wsr-fade-in 360ms ease both',
    }}>

      {/* Background atmosphere — medieval alleyway silhouette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          backgroundImage: 'url(/headers/history-medicine-through-time.png)',
          backgroundSize: 'cover', backgroundPosition: 'left center',
          opacity: 0.11,
          filter: 'brightness(0.6)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content wrapper */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100%',
        padding: `calc(18px + env(safe-area-inset-top)) 24px 34px`,
        overflow: 'auto',
      }}>

        {/* Header row — back + progress */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          height: 44,
          marginBottom: 20,
        }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer', opacity: 0.92,
              color: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22,
            }}
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Progress text */}
          {progress && (
            <div style={{
              ...F, fontSize: 15, fontWeight: 500,
              color: 'rgba(255,255,255,0.80)',
            }}>
              {progress.current} / {progress.total}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{
          height: 4, borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
          marginBottom: SPACING.cinematic,
        }}>
          <div style={{
            height: '100%',
            background: accent,
            width: progress ? `${(progress.current / progress.total) * 100}%` : '0%',
            transition: 'width 600ms ease',
          }} />
        </div>

        {/* Main content area — slightly above center */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          minHeight: 'auto',
        }}>

          {/* Title: "Quick recovery?" */}
          <h1 style={{
            ...F,
            fontSize: 34, fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'rgba(245,245,245,0.96)',
            margin: 0, marginBottom: 88,
          }}>
            Quick recovery?
          </h1>

          {/* Weak spot content area — no visible card, just readability gradient */}
          <div style={{
            position: 'relative',
            maxWidth: '100%',
            paddingBottom: SPACING.separation,
          }}>
            {/* Ultra-subtle readability gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.18)',
              borderRadius: 24,
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Topic title — serif */}
              <h2 style={{
                ...Serif,
                fontSize: 38, fontWeight: 600, lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: 'rgba(245,245,245,0.96)',
                margin: 0, marginBottom: 28,
              }}>
                {block.title}
              </h2>

              {/* Explanation copy */}
              <p style={{
                ...F,
                fontSize: 18, fontWeight: 400, lineHeight: 1.5,
                color: 'rgba(245,245,245,0.68)',
                maxWidth: 310, margin: '0 auto', marginBottom: 42,
              }}>
                {block.explanation}
              </p>

              {/* Meta information */}
              <div style={{
                ...F,
                fontSize: 14, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: accent,
                opacity: 0.90,
              }}>
                {block.meta}
              </div>
            </div>
          </div>
        </div>

        {/* Button area */}
        <div style={{
          marginTop: SPACING.cinematic,
          display: 'flex', flexDirection: 'column', gap: 36,
          alignItems: 'center',
        }}>

          {/* Primary CTA button */}
          <button
            onClick={() => onFixWeakSpot?.(block.recoveryQuizId)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            style={{
              width: '100%', height: 74,
              borderRadius: 22, border: 'none',
              background: accent,
              padding: '0 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              boxShadow: `0 4px 16px rgba(${rgb},0.15)`,
              transform: isPressed ? 'scale(0.985)' : 'scale(1)',
              transition: 'transform 180ms ease, filter 180ms ease',
              filter: isPressed ? 'brightness(0.92)' : 'brightness(1)',
            }}
          >
            <span style={{
              ...F,
              fontSize: 20, fontWeight: 600,
              color: '#0D0F14',
            }}>
              {block.cta}
            </span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: '#0D0F14', flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* Secondary action */}
          <button
            onClick={onSkip}
            style={{
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              ...F,
              fontSize: 16, fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
              transition: 'opacity 200ms ease',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.65'}
            onMouseLeave={(e) => e.target.style.opacity = '0.45'}
          >
            {block.skipText}
          </button>

        </div>

      </div>
    </div>
  )
}
