import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import BackButton from '../core/BackButton.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell used here because multiple inner layers use position:fixed (background image,
// gradients, overlays) that must reach all four viewport edges; ContentShell's 16px padding
// and safe-area inner div would confine them to the content column.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

const IMAGES = {
  History:   '/historybacker.webp',
  Biology:   '/biologybacker.webp',
  Maths:     '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics:   '/physicsbacker.webp',
  English:   '/Englishbacker.webp',
  Music:     '/historybacker.webp',
}

function tokenize(text) {
  const parts = text.split(/(\s+)/)
  let wi = 0
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
    return { key: i, space: false, text: part, wordIdx: wi++ }
  })
}

function BackBtn({ onClick }) {
  return (
    <BackButton
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{ position: 'absolute', top: 22, left: 18, zIndex: 10 }}
    />
  )
}

export default function ExaminerExplainsScreen({
  subject          = 'History',
  examinerExplains = {},
  onBack,
  onContinue,
}) {
  const img   = IMAGES[subject] || IMAGES.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const opening = examinerExplains.opening || "Before you face the examiner, here's what they actually look for."
  const tips    = examinerExplains.tips    || []
  const closing = examinerExplains.closing || "You've got this."

  const [phase,          setPhase]          = useState('opening')
  const [revealedCount,  setRevealedCount]  = useState(0)
  const [showClosing,    setShowClosing]    = useState(false)
  const [showContinue,   setShowContinue]   = useState(false)
  const [hintVisible,    setHintVisible]    = useState(false)

  const tokens    = tokenize(opening)
  const wordCount = tokens.filter(t => !t.space).length
  const hintDelay = 260 + (wordCount - 1) * 65 + 420

  useEffect(() => {
    if (phase !== 'opening') return
    const t = setTimeout(() => setHintVisible(true), hintDelay)
    return () => clearTimeout(t)
  }, [phase, hintDelay])

  useEffect(() => {
    if (!showClosing) return
    const t = setTimeout(() => setShowContinue(true), 640)
    return () => clearTimeout(t)
  }, [showClosing])

  function handleTap() {
    if (phase === 'opening') {
      setPhase('tips')
      return
    }
    if (revealedCount < tips.length) {
      setRevealedCount(c => c + 1)
      return
    }
    if (!showClosing) {
      setShowClosing(true)
    }
  }

  const isTips = phase === 'tips'

  return (
    <>
      <style>{`
        @keyframes expl-word {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expl-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expl-hint {
          0%, 100% { opacity: 0; transform: translateY(0); }
          35%, 65%  { opacity: 0.5; transform: translateY(-3px); }
        }
      `}</style>

      <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 1000 }}>
      <div
        onClick={!showContinue ? handleTap : undefined}
        style={{
          position: 'absolute', inset: 0,
          cursor: showContinue ? 'default' : 'pointer',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.22,
          filter: 'grayscale(12%) brightness(0.60)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Left gradient */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.96) 0%, rgba(8,9,13,0.80) 40%, rgba(8,9,13,0.44) 70%, rgba(8,9,13,0.18) 100%)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Overall dark overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,13,0.24)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 240,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.98) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {/* Content shell */}
        <div style={{ position: 'relative', zIndex: 5, minHeight: '100dvh' }}>
          <BackBtn onClick={onBack} />

          {/* ── OPENING ─────────────────────────────────── */}
          {phase === 'opening' && (
            <div style={{ position: 'absolute', top: '34%', left: 28, right: 28 }}>
              <div style={{
                ...TYPE.displaySection,
                fontSize: 'clamp(26px, 8.5vw, 38px)',
                color: '#FFFFFF',
                maxWidth: 320,
              }}>
                {tokens.map(tok =>
                  tok.space ? tok.text : (
                    <span
                      key={tok.key}
                      style={{
                        display: 'inline-block',
                        animation: `expl-word 220ms ease ${260 + tok.wordIdx * 65}ms both`,
                      }}
                    >
                      {tok.text}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* ── TIPS ────────────────────────────────────── */}
          {isTips && (
            <div style={{
              position: 'absolute', top: '24%', left: 28, right: 28,
              maxHeight: 'calc(100dvh - 180px)',
              overflowY: 'auto',
              paddingBottom: showContinue ? 170 : 100,
              WebkitOverflowScrolling: 'touch',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {tips.slice(0, revealedCount).map((tip, i) => (
                  <div
                    key={i}
                    style={{ animation: 'expl-up 400ms cubic-bezier(0.16,1,0.3,1) both' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      marginBottom: 7,
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 10,
                        color: accent, opacity: 0.75,
                        paddingTop: 4, flexShrink: 0,
                      }}>✦</span>
                      <div style={{
                        ...TYPE.displayCard,
                        color: 'rgba(255,255,255,0.95)',
                      }}>
                        {tip.heading}
                      </div>
                    </div>
                    <div style={{
                      ...TYPE.bodyStrong,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.50)',
                      paddingLeft: 20,
                    }}>
                      {tip.body}
                    </div>
                  </div>
                ))}

                {/* Closing line */}
                {showClosing && (
                  <div style={{
                    ...TYPE.displaySection,
                    fontSize: 'clamp(22px, 7vw, 30px)',
                    color: accent,
                    marginTop: 4,
                    animation: 'expl-up 420ms cubic-bezier(0.16,1,0.3,1) both',
                  }}>
                    {closing}
                  </div>
                )}

                {/* Tap prompt — while tips remain */}
                {revealedCount < tips.length && (
                  <div style={{
                    position: 'fixed',
                    bottom: 'calc(38px + env(safe-area-inset-bottom, 0px))',
                    left: 0, right: 0, textAlign: 'center',
                    pointerEvents: 'none',
                    animation: 'expl-hint 3.2s ease 600ms infinite',
                  }}>
                    <span style={{
                      ...TYPE.eyebrow,
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.28)',
                    }}>
                      tap to continue
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tap hint — opening phase */}
          {phase === 'opening' && hintVisible && (
            <div style={{
              position: 'fixed',
              bottom: 'calc(38px + env(safe-area-inset-bottom, 0px))',
              left: 0, right: 0, textAlign: 'center',
              pointerEvents: 'none',
              animation: 'expl-hint 3.2s ease infinite',
            }}>
              <span style={{
                ...TYPE.eyebrow,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}>
                tap to continue
              </span>
            </div>
          )}
        </div>

        {/* Continue CTA */}
        {showContinue && (
          <CinematicContinueCTA
            onClick={onContinue}
            accent={accent}
            animation="expl-cont 500ms cubic-bezier(0.16,1,0.3,1) 120ms both"
            style={{ zIndex: 10 }}
          />
        )}
      </div>
      </CinematicShell>
    </>
  )
}
