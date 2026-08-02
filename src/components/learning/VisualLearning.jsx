import { useState, useEffect, useRef, useMemo } from 'react'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
// CinematicShell used here because full-bleed background imagery and the global
// click-to-advance handler need full viewport coverage without content padding.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'

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
    @media (prefers-reduced-motion: reduce) {
      [data-visual-learning],
      [data-visual-learning] * {
        animation: none !important;
        transition: none !important;
      }
    }
  `
  document.head.appendChild(s)
}

function clampOverlayStrength(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 1
  return Math.min(1.35, Math.max(0.65, parsed))
}

function weightedAlpha(alpha, strength) {
  return Math.min(1, alpha * strength).toFixed(3)
}

function getSceneOverlay(scene, isFinalReveal) {
  if (scene.overlay) return scene.overlay

  const strength = clampOverlayStrength(scene.overlayStrength)

  if (isFinalReveal) {
    return `rgba(8,9,13,${weightedAlpha(0.68, strength)})`
  }

  // VisualLearning is image-led. Keep the upper image almost untouched and
  // concentrate contrast behind the bottom-weighted copy instead of applying
  // a heavy full-screen veil to every asset.
  return `linear-gradient(
    to bottom,
    rgba(8,9,13,${weightedAlpha(0.02, strength)}) 0%,
    rgba(8,9,13,${weightedAlpha(0.05, strength)}) 42%,
    rgba(8,9,13,${weightedAlpha(0.18, strength)}) 58%,
    rgba(8,9,13,${weightedAlpha(0.46, strength)}) 74%,
    rgba(8,9,13,${weightedAlpha(0.84, strength)}) 100%
  )`
}

export default function VisualLearning({ block, subject, onComplete }) {
  injectStyles()

  // Memoized so the `|| []` fallback doesn't create a new array identity on
  // every render, which would re-fire the preload effect below needlessly.
  const scenes = useMemo(() => block?.scenes || [], [block?.scenes])
  const palette = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb } = palette
  const reduceMotion = usePrefersReducedMotion()

  const [idx,     setIdx]     = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [bgKey,   setBgKey]   = useState(0)
  const [hint,    setHint]    = useState(false)
  const locked = useRef(false)

  const scene  = scenes[idx] || {}
  const isLast = idx === scenes.length - 1

  // Show tap hint after a pause on each new scene. Reduced-motion users do not
  // wait for an animation-led cue; the static instruction is available at once.
  useEffect(() => {
    setHint(reduceMotion)
    if (reduceMotion) return undefined

    const t = setTimeout(() => setHint(true), 1800)
    return () => clearTimeout(t)
  }, [idx, reduceMotion])

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
    setTimeout(() => { locked.current = false }, reduceMotion ? 0 : SLIDE_MS)
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
  const sceneOverlay = getSceneOverlay(scene, isFinalReveal)

  return (
    <CinematicShell
      data-visual-learning="true"
      style={{ background: GENERAL.backgroundApp, zIndex: 100 }}
    >
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
            backgroundSize: scene.imageSize || 'cover',
            backgroundPosition: scene.imagePosition || 'center',
            animation: reduceMotion ? 'none' : `vl-bg-in ${SLIDE_MS}ms ease both`,
          }}
        />
      )}

      {/* Image-first cinematic treatment. Contrast is concentrated behind copy. */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: sceneOverlay,
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
            animation: reduceMotion ? 'none' : `vl-reveal-in ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <div style={{
            ...TYPE.displaySection,
            fontSize: 'clamp(28px, 7.5vw, 40px)',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {scene.headline}
          </div>

          <div style={{
            ...TYPE.bodyStrong,
            fontSize: 'clamp(17px, 4.5vw, 21px)',
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
              animation: reduceMotion ? 'none' : 'vl-hint 2.8s ease infinite',
              opacity: reduceMotion ? 0.5 : undefined,
            }}>
              <span style={{
                ...TYPE.eyebrow,
                textTransform: 'uppercase',
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
            animation: reduceMotion ? 'none' : `vl-in ${SLIDE_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <div style={{
            ...TYPE.displaySection,
            fontSize: 'clamp(26px, 7vw, 36px)',
            color: '#FFFFFF',
            marginBottom: 14,
            maxWidth: 380,
            textShadow: '0 2px 26px rgba(0,0,0,0.58)',
          }}>
            {scene.headline}
          </div>

          <div style={{
            ...TYPE.bodyStrong,
            color: 'rgba(245,238,225,0.78)',
            maxWidth: 360,
            textShadow: '0 2px 22px rgba(0,0,0,0.62)',
          }}>
            {scene.body}
          </div>

          {/* Scene progress */}
          <div style={{ marginTop: 28 }}>
            <SequenceProgress
              total={scenes.length}
              current={idx}
              completed={idx}
              accent={accent}
              accentRgb={accentRgb}
              variant="sash"
              compact={true}
              ariaLabel="Scene progress"
            />
          </div>

          {/* Tap hint */}
          {hint && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(44px + env(safe-area-inset-bottom, 0px))',
              left: 0, right: 0, textAlign: 'center',
              pointerEvents: 'none',
              animation: reduceMotion ? 'none' : 'vl-hint 2.8s ease infinite',
              opacity: reduceMotion ? 0.5 : undefined,
            }}>
              <span style={{
                ...TYPE.eyebrow,
                textTransform: 'uppercase',
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
