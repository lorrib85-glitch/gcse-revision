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
import { HEADING_LAYOUT, TYPE } from '../../constants/typography.js'

// ─── TimelineChain v1 ───────────────────────────────────────────────────────
//
// Full-screen horizontal scroll-snap chain of causal reveal cards — a chapter's
// "big idea" sequence (e.g. how germ theory led to safer surgery). Each card
// keeps its event visible while expanding to reveal why it mattered and how it
// unlocked the next step in the chain.
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

// The full-screen card occupies 82% of the viewport so the active step is
// dominant while a deliberate sliver of the next card remains visible.
const CARD_W = 'clamp(260px, 82vw, 352px)'
const CARD_EDGE_INSET = 'calc(50vw - clamp(130px, 41vw, 176px))'
const CARD_H = 290

const EMBED_CARD_W = 200
const EMBED_CARD_H = 270
const EMBED_RAIL_H = 16
const RAIL_OVERHANG = SPACING.compact / 2

export default function TimelineChain({ block, subject = 'History', onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []

  const [revealed, setRevealed] = useState(() => new Set())
  const [scrolled, setScrolled] = useState(false)
  const rowRef = useRef(null)

  const allRevealed = steps.length > 0 && revealed.size === steps.length

  function toggleReveal(i) {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <CinematicShell style={{
      background: theme.background,
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    }}>

      {/* Title + intro */}
      <div style={{ padding: `0 ${SPACING.standard}px`, marginBottom: SPACING.standard, flexShrink: 0 }}>
        {block.title && (
          <h2 style={{
            ...TYPE.displayScreen,
            color: 'rgba(245,245,245,0.96)',
            maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
            margin: 0,
          }}>
            {block.title}
          </h2>
        )}
        {block.intro && (
          <p style={{
            ...TYPE.body,
            color: 'rgba(245,245,245,0.60)',
            margin: `${SPACING.standard}px 0 0`,
          }}>
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
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: CARD_EDGE_INSET,
          WebkitOverflowScrolling: 'touch',
          gap: SPACING.compact,
          padding: `0 ${CARD_EDGE_INSET}`,
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
            revealed={revealed.has(i)}
            previousRevealed={i > 0 && revealed.has(i - 1)}
            onReveal={() => toggleReveal(i)}
            accent={accent}
            rgb={rgb}
          />
        ))}
      </div>

      {/* Swipe hint */}
      {!scrolled && steps.length > 1 && (
        <div style={{
          textAlign: 'center', marginTop: SPACING.compact, flexShrink: 0,
          ...TYPE.eyebrow, textTransform: 'uppercase',
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
            width: revealed.has(i) ? 20 : 8, height: 8, borderRadius: RADII.pill,
            background: revealed.has(i) ? accent : 'rgba(255,255,255,0.16)',
            boxShadow: revealed.has(i) ? `0 0 8px rgba(${rgb},0.45)` : 'none',
            transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>

      {/* Continue */}
      <div style={{ marginTop: SPACING.standard, padding: `0 ${SPACING.standard}px`, flexShrink: 0 }}>
        {allRevealed ? (
          <ContinueCTA
            onClick={onContinue}
            accent={accent}
            style={{ animation: `tc-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}
          />
        ) : (
          <div style={{ ...TYPE.label, color: 'rgba(255,255,255,0.32)' }}>
            Reveal every step to continue
          </div>
        )}
      </div>
    </CinematicShell>
  )
}

function ChainCard({
  step,
  index,
  total,
  revealed,
  previousRevealed = false,
  onReveal,
  accent,
  rgb,
  cardW = CARD_W,
  cardH = CARD_H,
  railH = 20,
  scrollAlign = 'center',
}) {
  const isFirst = index === 0
  const isLast = index === total - 1
  const isAvailable = isFirst || previousRevealed
  const railTransition = `transform ${MOTION.duration.slow} ${MOTION.easing.standard}`

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      scrollSnapAlign: scrollAlign,
      scrollSnapStop: 'always',
    }}>

      {/* Connector rail — muted route beneath an animated completed path. */}
      <div style={{ position: 'relative', height: railH, width: cardW, flexShrink: 0 }}>
        {!isFirst && (
          <>
            <div style={{
              position: 'absolute', left: -RAIL_OVERHANG, right: '50%', top: '50%',
              height: 1, background: `rgba(${rgb},0.16)`,
            }} />
            <div style={{
              position: 'absolute', left: -RAIL_OVERHANG, right: '50%', top: '50%',
              height: 1, background: `rgba(${rgb},0.72)`,
              transform: previousRevealed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'right center',
              transition: railTransition,
            }} />
          </>
        )}
        {!isLast && (
          <>
            <div style={{
              position: 'absolute', left: '50%', right: -RAIL_OVERHANG, top: '50%',
              height: 1, background: `rgba(${rgb},0.16)`,
            }} />
            <div style={{
              position: 'absolute', left: '50%', right: -RAIL_OVERHANG, top: '50%',
              height: 1, background: `rgba(${rgb},0.72)`,
              transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: railTransition,
            }} />
          </>
        )}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: revealed ? accent : isAvailable ? `rgba(${rgb},0.72)` : `rgba(${rgb},0.24)`,
          border: `1px solid rgba(${rgb},${revealed ? 0.72 : 0.28})`,
          boxShadow: revealed ? `0 0 10px rgba(${rgb},0.28)` : 'none',
          transition: `background ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }} />
      </div>

      {/* In-card reveal keeps the event visible while opening its reasoning. */}
      <div
        onClick={onReveal}
        style={{
          width: cardW,
          minHeight: cardH,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{
          width: '100%',
          minHeight: cardH,
          boxSizing: 'border-box',
          borderRadius: RADII.large,
          background: revealed ? `rgba(${rgb},0.055)` : 'rgba(255,255,255,0.03)',
          border: revealed ? `1px solid rgba(${rgb},0.22)` : '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
          padding: SPACING.standard,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: `background ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
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
                ...TYPE.label, color: accent,
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
              ...TYPE.label, color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: SPACING.standard, flexShrink: 0,
            }}>
              {index + 1}
            </div>
          )}
          {step.icon && !step.image && (
            <div style={{
              fontSize: revealed ? 32 : 40,
              lineHeight: 1,
              marginBottom: revealed ? SPACING.micro : SPACING.compact,
              transition: `font-size ${MOTION.duration.standard} ${MOTION.easing.standard}, margin-bottom ${MOTION.duration.standard} ${MOTION.easing.standard}`,
            }}>
              {step.icon}
            </div>
          )}
          <div style={{
            ...TYPE.displayCard,
            color: 'rgba(255,255,255,0.94)',
            flex: revealed ? '0 0 auto' : 1,
            transition: `flex ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }}>
            {step.label}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateRows: revealed ? '1fr' : '0fr',
            opacity: revealed ? 1 : 0,
            marginTop: revealed ? SPACING.standard : 0,
            transition: `grid-template-rows ${MOTION.duration.slow} ${MOTION.easing.standard}, opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, margin-top ${MOTION.duration.slow} ${MOTION.easing.standard}`,
          }}>
            <div style={{ minHeight: 0, overflow: 'hidden' }}>
              <div style={{
                transform: revealed ? 'translateY(0)' : 'translateY(8px)',
                transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
              }}>
                <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: accent, marginBottom: SPACING.micro }}>
                  Why it mattered
                </div>
                <div style={{ ...TYPE.bodyStrong, color: 'rgba(255,255,255,0.82)' }}>
                  {step.detail}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            ...TYPE.eyebrow,
            textTransform: 'uppercase',
            color: `rgba(${rgb},0.55)`,
            marginTop: SPACING.standard,
          }}>
            {revealed ? 'Tap to close ↻' : 'Tap to reveal ↻'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TimelineChainBlock — embedded variant ─────────────────────────────────
//
// The same causal reveal chain, scaled down for use inline within a content
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

  const [revealed, setRevealed] = useState(() => new Set())

  function toggleReveal(i) {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      {block.intro && (
        <p style={{ ...TYPE.bodyStrong, color: 'rgba(255,255,255,0.52)', margin: '0 0 16px' }}>
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
            revealed={revealed.has(i)}
            previousRevealed={i > 0 && revealed.has(i - 1)}
            onReveal={() => toggleReveal(i)}
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
            width: revealed.has(i) ? 20 : 8, height: 8, borderRadius: RADII.pill,
            background: revealed.has(i) ? accent : 'rgba(255,255,255,0.16)',
            boxShadow: revealed.has(i) ? `0 0 8px rgba(${rgb},0.45)` : 'none',
            transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>

      {block.outro && (
        <p style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.56)', margin: `${SPACING.compact}px 0 0` }}>
          {block.outro}
        </p>
      )}
    </div>
  )
}
