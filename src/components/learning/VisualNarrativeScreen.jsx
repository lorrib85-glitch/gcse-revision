import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell used here because this screen renders full-bleed absolute-positioned portrait
// and timeline image layers that must reach all four edges; ContentShell's 16px horizontal
// padding and opaque background would clip the atmospheric imagery and break the layout.
import CinematicShell from '../layout/CinematicShell.jsx'

export default function VisualNarrativeScreen({
  subject = 'History',
  beats   = [],
  onRevealStart,
  onContinue,
}) {
  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [beatIdx,        setBeatIdx]        = useState(0)
  const [factCount,      setFactCount]      = useState(0)
  const [showConclusion, setShowConclusion] = useState(false)
  const [showCTA,        setShowCTA]        = useState(false)
  const [locked,         setLocked]         = useState(false)
  const [hintVisible,    setHintVisible]    = useState(false)

  const beat      = beats[beatIdx] || {}
  const isFacts   = Array.isArray(beat.facts)
  const totalFacts = isFacts ? beat.facts.length : 0

  const isLastBeat = beatIdx === beats.length - 1

  // Portrait: visible only on beat 0
  const portraitOpacity = beatIdx === 0 ? 1 : 0
  // Timeline: full opacity once it appears (beat 1 onward)
  const timelineOpacity =
    beatIdx === 0 ? 0 :
    isLastBeat ? (beat.imageOpacity ?? 1) :
    1

  // Reset hint after each action
  useEffect(() => {
    setHintVisible(false)
    const t = setTimeout(() => setHintVisible(true), 300)
    return () => clearTimeout(t)
  }, [beatIdx, factCount])

  // Lock tap for 250ms after each interaction
  function lockAndUnlock() {
    setLocked(true)
    setTimeout(() => setLocked(false), 250)
  }

  function handleTap() {
    if (locked) return

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
  const showCinematicContinue = showHint && !isFacts

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
        @keyframes vnEnglandPulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.90; transform: translate(-50%, -50%) scale(1.35); }
        }
        .vn-cta:active { opacity: 0.55 !important; }
      `}</style>

      <CinematicShell style={{ background: '#08090D', zIndex: 100 }}>
      <div
        style={{
          position: 'absolute', inset: 0,
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
          backgroundPosition: (beats[0] || {}).imagePosition || 'center top',
          opacity: portraitOpacity,
          transition: 'opacity 700ms ease',
          filter: (beats[0] || {}).imageFilter || 'brightness(2.5)',
          pointerEvents: 'none',
        }} />

        {/* Timeline image — Beats 2 & 3 (same image, different opacity) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: '42%',
          backgroundImage: `url(${(beats[1] || {}).image})`,
          backgroundSize: 'cover',
          backgroundPosition: (beats[1] || {}).imagePosition || 'center 25%',
          opacity: timelineOpacity,
          transition: 'opacity 700ms ease',
          filter: (beats[1] || {}).imageFilter || 'brightness(1.12) saturate(1.04)',
          pointerEvents: 'none',
        }} />

        {/* Medieval England glow — appears when the full chain is revealed */}
        {showConclusion && (
          <div style={{
            position: 'absolute',
            top: '21%', left: '73%',
            width: 52, height: 52,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${rgb},0.55) 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 2,
            animation: 'vnEnglandPulse 2.8s ease-in-out infinite',
          }} />
        )}

        {/* Dark gradient — keeps text readable without crushing the image into black */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.46) 57%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.94) 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── Beat 1 & 2: cinematic headline + body at bottom ─────────── */}
        {!isFacts && (
          <div
            key={beatIdx}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '0 28px calc(126px + env(safe-area-inset-bottom, 0px))',
              animation: 'vnFadeUp 500ms cubic-bezier(0.16,1,0.3,1) both',
              pointerEvents: 'none',
            }}
          >
            {beat.showLabel === true && beat.label && (
              <div style={{
                ...TYPE.eyebrow,
                color: 'rgba(255,255,255,0.50)',
                marginBottom: 10,
              }}>
                {beat.label}
              </div>
            )}

            <div style={{
              ...TYPE.displaySection,
              fontSize: 'clamp(36px, 10.8vw, 52px)',
              color: 'rgba(255,255,255,0.98)',
              marginBottom: 16,
              maxWidth: 352,
            }}>
              {beat.headline}
            </div>

            {beat.body && (
              <div style={{
                ...TYPE.bodyStrong,
                color: 'rgba(255,255,255,0.74)',
                maxWidth: '31ch',
                whiteSpace: 'pre-line',
              }}>
                {beat.body}
              </div>
            )}
          </div>
        )}

        {/* ── Beat 3: sequential facts, then conclusion replaces them ── */}
        {isFacts && (
          <div style={{
            position: 'absolute',
            top: '52%', left: 28, right: 28,
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
            pointerEvents: 'none',
          }}>
            {!showConclusion ? (
              // Facts phase
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {factCount === 0 && (
                  <div style={{
                    ...TYPE.eyebrow,
                    color: 'rgba(255,255,255,0.30)',
                    marginBottom: 12,
                  }}>
                    Tap to reveal
                  </div>
                )}
                {beat.facts.slice(0, factCount).map((fact, i) => (
                  <div
                    key={i}
                    style={{
                      ...TYPE.bodyStrong,
                      color: 'rgba(255,255,255,0.84)',
                      animation: 'vnFadeUp 420ms cubic-bezier(0.16,1,0.3,1) both',
                    }}
                  >
                    {fact}
                  </div>
                ))}
              </div>
            ) : (
              // Conclusion phase — replaces the facts
              <>
                <div style={{
                  ...TYPE.displaySection,
                  color: accent,
                  whiteSpace: 'pre-line',
                  animation: 'vnFadeIn 700ms ease both',
                }}>
                  {beat.conclusion}
                </div>

                {showCTA && (
                  <div style={{ marginTop: 32, pointerEvents: 'auto' }}>
                    <ContinueCTA
                      onClick={(e) => { e.stopPropagation(); onContinue?.() }}
                      accent={accent}
                      style={{ animation: 'vnFadeIn 420ms ease both' }}
                    />
                    {beat.source && (
                      <div style={{
                        marginTop: 20,
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 10, lineHeight: 1.5,
                        color: 'rgba(255,255,255,0.22)',
                        animation: 'vnFadeIn 600ms ease 200ms both',
                        maxWidth: 280,
                      }}>
                        <span style={{ fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 9 }}>
                          Source{' '}
                        </span>
                        {beat.source}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Next action ───────────────────────────────────────────── */}
        {showCinematicContinue && (
          <CinematicContinueCTA
            onClick={handleTap}
            accent={accent}
            animation="crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite"
          />
        )}

      </div>
      </CinematicShell>
    </>
  )
}
