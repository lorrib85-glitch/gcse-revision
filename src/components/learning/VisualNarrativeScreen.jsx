import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

export default function VisualNarrativeScreen({
  subject = 'History',
  beats   = [],
  onRevealStart,
  onContinue,
}) {
  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent

  const [beatIdx,        setBeatIdx]        = useState(0)
  const [factCount,      setFactCount]      = useState(0)
  const [showConclusion, setShowConclusion] = useState(false)
  const [showCTA,        setShowCTA]        = useState(false)
  const [locked,         setLocked]         = useState(false)
  const [hintVisible,    setHintVisible]    = useState(false)

  const beat      = beats[beatIdx] || {}
  const isFacts   = Array.isArray(beat.facts)
  const totalFacts = isFacts ? beat.facts.length : 0

  // Portrait: visible only on beat 0
  const portraitOpacity = beatIdx === 0 ? 1 : 0
  // Timeline: beats 1 & 2 share the same image; dimmed on beat 2
  const timelineOpacity =
    beatIdx === 0 ? 0 :
    beatIdx === 1 ? 1 :
    (beat.imageOpacity ?? 0.35)

  // Reset hint after each action
  useEffect(() => {
    setHintVisible(false)
    const t = setTimeout(() => setHintVisible(true), 1600)
    return () => clearTimeout(t)
  }, [beatIdx, factCount])

  // Lock tap for 250ms after each interaction
  function lockAndUnlock() {
    setLocked(true)
    setTimeout(() => setLocked(false), 250)
  }

  function handleTap() {
    if (locked) return

    const isLastBeat = beatIdx === beats.length - 1

    if (!isLastBeat) {
      lockAndUnlock()
      if (beatIdx === 0) onRevealStart?.()
      setBeatIdx(i => i + 1)
      return
    }

    if (isFacts) {
      if (factCount < totalFacts) {
        lockAndUnlock()
        const next = factCount + 1
        setFactCount(next)
        if (next === totalFacts) {
          // Conclusion appears automatically after final fact
          setTimeout(() => {
            setShowConclusion(true)
            setTimeout(() => setShowCTA(true), 700)
          }, 350)
        }
        return
      }
      if (showCTA) {
        onContinue?.()
      }
    }
  }

  const showHint = hintVisible && !showConclusion

  return (
    <>
      <style>{`
        @keyframes vnFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vnFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes vnHintPulse {
          0%, 100% { opacity: 0; transform: translateY(0); }
          35%, 65%  { opacity: 0.6; transform: translateY(-3px); }
        }
        .vn-cta:active { opacity: 0.55 !important; }
      `}</style>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: '#08090D',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
        onClick={handleTap}
      >
        {/* Portrait image — Beat 1 only */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${(beats[0] || {}).image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: portraitOpacity,
          transition: 'opacity 700ms ease',
          pointerEvents: 'none',
        }} />

        {/* Timeline image — Beats 2 & 3 (same image, different opacity) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: '42%',
          backgroundImage: `url(${(beats[1] || {}).image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          opacity: timelineOpacity,
          transition: 'opacity 700ms ease',
          pointerEvents: 'none',
        }} />

        {/* Dark gradient — text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.18) 32%, rgba(0,0,0,0.64) 56%, rgba(0,0,0,0.93) 74%, rgba(0,0,0,0.99) 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── Beat 1 & 2: label + headline + body at bottom ─────────── */}
        {!isFacts && (
          <div
            key={beatIdx}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '0 28px 96px',
              animation: 'vnFadeUp 500ms cubic-bezier(0.16,1,0.3,1) both',
              pointerEvents: 'none',
            }}
          >
            {beat.label && (
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: 14,
              }}>
                {beat.label}
              </div>
            )}

            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(26px, 8.5vw, 38px)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.97)',
              marginBottom: 16,
              maxWidth: 320,
            }}>
              {beat.headline}
            </div>

            {beat.body && (
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500, fontSize: 16,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.58)',
                maxWidth: 300,
                whiteSpace: 'pre-line',
              }}>
                {beat.body}
              </div>
            )}
          </div>
        )}

        {/* ── Beat 3: sequential facts + conclusion ─────────────────── */}
        {isFacts && (
          <div style={{
            position: 'absolute',
            top: '44%', left: 28, right: 28,
            paddingBottom: 120,
            pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {beat.facts.slice(0, factCount).map((fact, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500, fontSize: 18,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.86)',
                    animation: 'vnFadeUp 420ms cubic-bezier(0.16,1,0.3,1) both',
                  }}
                >
                  {fact}
                </div>
              ))}

              {showConclusion && (
                <div style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(18px, 5.5vw, 24px)',
                  lineHeight: 1.35,
                  color: accent,
                  marginTop: 6,
                  animation: 'vnFadeIn 600ms ease both',
                }}>
                  {beat.conclusion}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tap hint ─────────────────────────────────────────────── */}
        {showHint && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(38px + env(safe-area-inset-bottom, 0px))',
            left: 0, right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'vnHintPulse 3.2s ease infinite',
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.30)',
            }}>
              tap to continue
            </span>
          </div>
        )}

        {/* ── Continue CTA — beat 3, after conclusion only ──────────── */}
        {showCTA && (
          <button
            className="vn-cta"
            onClick={(e) => { e.stopPropagation(); onContinue?.() }}
            style={{
              position: 'absolute',
              bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
              left: 28,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22,
              color: accent,
              animation: 'vnFadeIn 420ms ease both',
              transition: 'opacity 140ms ease',
              zIndex: 1,
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </>
  )
}
