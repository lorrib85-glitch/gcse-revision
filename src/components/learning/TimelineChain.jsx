import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
// CinematicShell used here because the horizontal scroll-snap chain and connector rail must
// reach the full viewport width; InteractionShell's 16px inset would clip the rail and break
// the scroll-snap alignment.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'

// ─── TimelineChain v1 ───────────────────────────────────────────────────────
//
// Full-screen horizontal scroll-snap chain of flip cards — a chapter's "big
// idea" causal sequence (e.g. how the Black Death spread, step by step).
// Each card's front shows a short step label; tapping flips it to reveal why
// that step matters / how it links to the next one in the chain.
//
// Block shape:
// {
//   type: 'timelineChain',
//   title: 'How the Black Death spread',
//   intro?: 'Tap each step to see why it mattered.',
//   steps: [
//     { id, icon?: '🚢', label: 'Ships carried rats', detail: 'Trade ships from Asia carried black rats in their cargo holds...' },
//     ...
//   ],
// }

let _tcStyled = false
function ensureStyles() {
  if (_tcStyled) return
  _tcStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tc-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes tc-hint-pulse { 0%, 100% { opacity: 0.30; transform: translateX(0); } 50% { opacity: 0.65; transform: translateX(4px); } }
    .tc-row::-webkit-scrollbar { display: none; }
  `
  document.head.appendChild(el)
}

const CARD_W = 240
const CARD_H = 290

const EMBED_CARD_W = 200
const EMBED_CARD_H = 270
const EMBED_RAIL_H = 16

export default function TimelineChain({ block, subject = 'History', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []

  const [flipped, setFlipped] = useState(() => new Set())
  const [scrolled, setScrolled] = useState(false)
  const rowRef = useRef(null)

  const allFlipped = steps.length > 0 && flipped.size === steps.length

  function toggleFlip(i) {
    setFlipped(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const F = { fontFamily: TYPE.bodyText.fontFamily }

  return (
    <CinematicShell style={{
      background: '#08090D',
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    }}>

      {/* Title + intro */}
      <div style={{ padding: `0 ${SPACING.standard}px`, marginBottom: SPACING.standard, flexShrink: 0 }}>
        {block.title && (
          <h2 style={{
            ...F, fontSize: 'clamp(24px, 7.5vw, 32px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            color: 'rgba(255,255,255,0.97)', margin: '0 0 8px',
          }}>
            {block.title}
          </h2>
        )}
        {block.intro && (
          <p style={{ ...F, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.52)', margin: 0 }}>
            {block.intro}
          </p>
        )}
      </div>

      {/* Chain row */}
      <div
        ref={rowRef}
        className="tc-row"
        onScroll={() => { if (!scrolled) setScrolled(true) }}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: SPACING.compact,
          padding: `0 ${SPACING.standard}px`,
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        {steps.map((step, i) => (
          <ChainCard
            key={step.id || i}
            step={step}
            index={i}
            total={steps.length}
            flipped={flipped.has(i)}
            onFlip={() => toggleFlip(i)}
            accent={accent}
            rgb={rgb}
          />
        ))}
        {/* trailing spacer so the last card can reach center */}
        <div style={{ flexShrink: 0, width: 1 }} />
      </div>

      {/* Swipe hint */}
      {!scrolled && steps.length > 1 && (
        <div style={{
          textAlign: 'center', marginTop: SPACING.compact, flexShrink: 0,
          ...F, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.30)',
          animation: 'tc-hint-pulse 2.4s ease-in-out infinite',
        }}>
          Swipe to explore →
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: SPACING.compact, flexShrink: 0 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: flipped.has(i) ? 20 : 8, height: 8, borderRadius: RADII.pill,
            background: flipped.has(i) ? accent : 'rgba(255,255,255,0.16)',
            boxShadow: flipped.has(i) ? `0 0 8px rgba(${rgb},0.45)` : 'none',
            transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>

      {/* Continue */}
      <div style={{ marginTop: SPACING.standard, padding: `0 ${SPACING.standard}px`, flexShrink: 0 }}>
        {allFlipped ? (
          <ContinueCTA
            onClick={onContinue}
            accent={accent}
            style={{ animation: `tc-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}
          />
        ) : (
          <div style={{ ...F, fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>
            Flip every step to continue
          </div>
        )}
      </div>
    </CinematicShell>
  )
}

function ChainCard({ step, index, total, flipped, onFlip, accent, rgb, cardW = CARD_W, cardH = CARD_H, railH = 20, scrollAlign = 'center' }) {
  const F = { fontFamily: TYPE.bodyText.fontFamily }
  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, scrollSnapAlign: scrollAlign }}>

      {/* Connector rail */}
      <div style={{ position: 'relative', height: railH, width: cardW, flexShrink: 0 }}>
        {!isFirst && (
          <div style={{ position: 'absolute', left: 0, right: '50%', top: '50%', height: 1, background: `rgba(${rgb},0.30)` }} />
        )}
        {!isLast && (
          <div style={{ position: 'absolute', left: '50%', right: 0, top: '50%', height: 1, background: `rgba(${rgb},0.30)` }} />
        )}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: flipped ? accent : `rgba(${rgb},0.35)`,
          boxShadow: flipped ? `0 0 10px rgba(${rgb},0.5)` : 'none',
          transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }} />
      </div>

      {/* Flip card */}
      <div
        onClick={onFlip}
        style={{ width: cardW, height: cardH, perspective: 1200, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d',
          transition: `transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: RADII.large,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
            padding: SPACING.standard,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {step.image && (
              <div style={{
                position: 'relative',
                margin: `-${SPACING.standard}px -${SPACING.standard}px ${SPACING.compact}px`,
                height: Math.round(cardH * 0.42),
                borderRadius: `${RADII.large}px ${RADII.large}px 0 0`,
                overflow: 'hidden', flexShrink: 0,
              }}>
                <img src={step.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', top: SPACING.micro, left: SPACING.micro,
                  width: 30, height: 30, borderRadius: '50%',
                  border: `1px solid rgba(${rgb},0.32)`,
                  background: 'rgba(8,9,13,0.55)', backdropFilter: 'blur(6px)',
                  color: accent, fontSize: 13, fontWeight: 700, ...F,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {index + 1}
                </div>
              </div>
            )}
            {!step.image && (
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: `1px solid rgba(${rgb},0.32)`,
                background: `rgba(${rgb},0.10)`,
                color: accent, fontSize: 15, fontWeight: 700, ...F,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: SPACING.standard, flexShrink: 0,
              }}>
                {index + 1}
              </div>
            )}
            {step.icon && !step.image && (
              <div style={{ fontSize: 40, marginBottom: SPACING.compact }}>{step.icon}</div>
            )}
            <div style={{ ...F, fontSize: 19, fontWeight: 600, lineHeight: 1.35, color: 'rgba(255,255,255,0.94)', flex: 1 }}>
              {step.label}
            </div>
            <div style={{ ...F, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: `rgba(${rgb},0.55)` }}>
              Tap to reveal ↻
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: RADII.large,
            background: `rgba(${rgb},0.07)`,
            border: `1px solid rgba(${rgb},0.22)`,
            boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
            padding: SPACING.standard,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ ...F, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, marginBottom: SPACING.micro }}>
              Why it mattered
            </div>
            <div style={{ ...F, fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.82)', overflowY: 'auto' }}>
              {step.detail}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── TimelineChainBlock — embedded variant ─────────────────────────────────
//
// The same flip-card chain, scaled down for use inline within a content
// screen's `blocks` array (block.type === 'timelineChain', rendered inside
// `Screen` in ModulePlayer.jsx). No fixed positioning and no completion
// gating — the screen's own Continue/Next controls progression.
//
// Block shape:
// {
//   type: 'timelineChain',
//   intro?: 'Tap each step to see why it mattered.',
//   steps: [ { id, icon?, image?, label, detail }, ... ],
//   outro?: 'This is the transmission chain: ship → rat → flea → person...',
// }

export function TimelineChainBlock({ block, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []

  const [flipped, setFlipped] = useState(() => new Set())

  function toggleFlip(i) {
    setFlipped(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const F = { fontFamily: TYPE.bodyText.fontFamily }

  return (
    <div style={F}>
      {block.intro && (
        <p style={{ ...F, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.52)', margin: '0 0 16px' }}>
          {block.intro}
        </p>
      )}

      <div
        className="tc-row"
        style={{
          display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch', gap: SPACING.compact, paddingBottom: 4,
        }}
      >
        {steps.map((step, i) => (
          <ChainCard
            key={step.id || i}
            step={step}
            index={i}
            total={steps.length}
            flipped={flipped.has(i)}
            onFlip={() => toggleFlip(i)}
            accent={accent}
            rgb={rgb}
            cardW={EMBED_CARD_W}
            cardH={EMBED_CARD_H}
            railH={EMBED_RAIL_H}
            scrollAlign="start"
          />
        ))}
        <div style={{ flexShrink: 0, width: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: SPACING.compact }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: flipped.has(i) ? 20 : 8, height: 8, borderRadius: RADII.pill,
            background: flipped.has(i) ? accent : 'rgba(255,255,255,0.16)',
            boxShadow: flipped.has(i) ? `0 0 8px rgba(${rgb},0.45)` : 'none',
            transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>

      {block.outro && (
        <p style={{ ...F, fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.56)', margin: `${SPACING.compact}px 0 0` }}>
          {block.outro}
        </p>
      )}
    </div>
  )
}
