import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

const MODE_LABELS = {
  causes:       'Causes — factor web',
  consequences: 'Consequences — factor web',
  change:       'Change — factor web',
  themes:       'Themes — factor web',
  process:      'Process — factor web',
}

// Compute (x, y) as % of container for node i in a set of total nodes.
// Angle 0 = top, stepping clockwise.
function getNodePos(i, total) {
  const angle = (i * (360 / total) - 90) * (Math.PI / 180)
  return {
    x: 50 + 37 * Math.cos(angle),
    y: 50 + 37 * Math.sin(angle),
  }
}

// ── FactorWeb ──────────────────────────────────────────────────────────────────
// Reusable causation-web screen. Students explore factor nodes around a central
// question, then make and justify a judgement about which mattered most.
//
// Props
//   block     — screen config from modules/<subject>.js
//   subject   — 'History' | 'Biology' | … — drives the colour palette
//   onContinue — called when the learner completes the judgement and taps Continue
export default function FactorWeb({ block, subject = 'History', onContinue }) {
  const theme       = SUBJECTS[subject] || SUBJECTS.History
  const accent      = theme.accent
  const rgb         = theme.accentRgb
  const bg          = theme.background || SUBJECTS.History.background
  const prefersReduced = useReducedMotion()

  const factors = block.factors || []

  const [activeId,        setActiveId]        = useState(null)
  const [explored,        setExplored]        = useState(new Set())
  const [phase,           setPhase]           = useState('web')   // 'web' | 'judgement'
  const [selected,        setSelected]        = useState(null)
  const [showWritePrompt, setShowWritePrompt] = useState(false)

  const allExplored  = explored.size >= factors.length
  const activeFactor = factors.find(f => f.id === activeId)

  function handleNodeTap(factor) {
    setActiveId(factor.id)
    setExplored(prev => new Set([...prev, factor.id]))
  }

  function handleChipSelect(id) {
    setSelected(id)
    setShowWritePrompt(true)
  }

  // Transition helpers — all become instant when reduced motion is preferred
  const instant = { duration: 0 }
  const fade    = prefersReduced ? instant : { duration: 0.28, ease: 'easeOut' }
  const reveal  = prefersReduced ? instant : { duration: 0.35, ease: 'easeOut' }

  function nodeT(i) {
    return prefersReduced ? instant : { delay: 0.6 + i * 0.18, duration: 0.4, ease: 'easeOut' }
  }
  function lineT(i) {
    if (prefersReduced) return instant
    return {
      pathLength:    { delay: 0.4 + i * 0.12, duration: 0.55, ease: 'easeOut' },
      strokeOpacity: { duration: 0.3 },
    }
  }
  function centreT() {
    return prefersReduced ? instant : { delay: 0.2, duration: 0.5, ease: 'easeOut' }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg,
      overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ padding: '88px 0 96px', maxWidth: 440, margin: '0 auto' }}>
        <div style={{ padding: `0 ${SPACING.standard}px`, display: 'flex', flexDirection: 'column', gap: SPACING.standard }}>

          {/* Eyebrow */}
          <p className="cinematic-eyebrow" style={{ margin: 0 }}>
            {block.kicker || MODE_LABELS[block.mode] || 'Factor web'}
          </p>

          {/* ── Radial web ───────────────────────────────────────────────── */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 340,
            aspectRatio: '1',
            margin: '0 auto',
          }}>

            {/* SVG layer: connecting lines from centre to each factor node */}
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', overflow: 'visible',
              }}
              aria-hidden="true"
            >
              {factors.map((f, i) => {
                const pos = getNodePos(i, factors.length)
                const isExplored = explored.has(f.id)
                return (
                  <motion.path
                    key={f.id}
                    d={`M 50 50 L ${pos.x} ${pos.y}`}
                    stroke={accent}
                    strokeWidth="0.7"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: prefersReduced ? 1 : 0, strokeOpacity: 0.22 }}
                    animate={{ pathLength: 1, strokeOpacity: isExplored ? 0.55 : 0.22 }}
                    transition={lineT(i)}
                  />
                )
              })}
            </svg>

            {/* Centre question node */}
            <motion.div
              role="img"
              aria-label={block.question}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 86, height: 86,
                borderRadius: '50%',
                background: `rgba(${rgb}, 0.09)`,
                border: `1.5px solid rgba(${rgb}, 0.45)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 9, textAlign: 'center', zIndex: 2,
              }}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={centreT()}
            >
              <span style={{
                fontFamily: "'Sora', sans-serif",
                color: `rgba(${rgb}, 0.9)`,
                fontSize: 8.5, lineHeight: 1.35, fontWeight: 700,
                letterSpacing: '0.03em', textTransform: 'uppercase',
                display: '-webkit-box',
                WebkitLineClamp: 6, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {block.question}
              </span>
            </motion.div>

            {/* Factor nodes */}
            {factors.map((f, i) => {
              const pos       = getNodePos(i, factors.length)
              const isActive  = activeId === f.id
              const isExplored = explored.has(f.id)

              return (
                <motion.button
                  key={f.id}
                  onClick={() => handleNodeTap(f)}
                  aria-label={f.title}
                  aria-pressed={isActive}
                  initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={nodeT(i)}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 62, height: 62,
                    minWidth: 44, minHeight: 44,
                    borderRadius: '50%',
                    border: isActive
                      ? `2px solid ${accent}`
                      : isExplored
                        ? `1.5px solid rgba(${rgb}, 0.45)`
                        : '1.5px solid rgba(255,255,255,0.12)',
                    background: isActive
                      ? `rgba(${rgb}, 0.14)`
                      : isExplored
                        ? `rgba(${rgb}, 0.06)`
                        : 'rgba(255,255,255,0.04)',
                    boxShadow: isActive
                      ? `0 0 0 3px rgba(${rgb},0.18), 0 0 22px rgba(${rgb},0.26)`
                      : 'none',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 2, padding: 5, zIndex: 3,
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    transition: [
                      `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                      `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                      `box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                    ].join(', '),
                  }}
                  onFocus={e => {
                    e.currentTarget.style.outline = `2px solid ${accent}`
                    e.currentTarget.style.outlineOffset = '3px'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.outline = 'none'
                    e.currentTarget.style.outlineOffset = '0'
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden="true">{f.icon}</span>
                  <span style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 8, lineHeight: 1.25, fontWeight: 700,
                    color: isActive ? accent : isExplored ? `rgba(${rgb}, 0.95)` : 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxWidth: 52, letterSpacing: '0.01em',
                    transition: `color ${MOTION.duration.fast}`,
                  }}>
                    {f.title}
                  </span>
                  {/* Explored indicator */}
                  {isExplored && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        width: 14, height: 14, borderRadius: '50%',
                        background: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, color: bg, fontWeight: 900, lineHeight: 1,
                      }}
                    >✓</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Progress counter */}
          <p style={{
            ...TYPE.bodySmall,
            fontSize: 12,
            color: 'rgba(255,255,255,0.28)',
            textAlign: 'center', margin: `-${SPACING.micro}px 0 0`,
          }}>
            {explored.size} / {factors.length} factors explored
          </p>

          {/* First-tap hint */}
          {explored.size === 0 && (
            <p style={{
              ...TYPE.body,
              fontSize: 13,
              color: `rgba(${rgb}, 0.5)`,
              textAlign: 'center', margin: 0,
            }}>
              Tap a factor to explore it
            </p>
          )}

          {/* ── Info panel ───────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeFactor && (
              <motion.div
                key={activeId}
                className="cinematic-card"
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                transition={fade}
                style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
                    {activeFactor.icon}
                  </span>
                  <div>
                    <p style={{
                      ...TYPE.displayCard,
                      margin: 0, fontSize: 16, lineHeight: 1.3, color: '#fff',
                    }}>
                      {activeFactor.title}
                    </p>
                    <p className="cinematic-eyebrow" style={{ margin: '3px 0 0' }}>
                      {activeFactor.subtitle}
                    </p>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  paddingTop: SPACING.micro,
                  display: 'flex', flexDirection: 'column', gap: SPACING.micro,
                }}>
                  {/* What it means */}
                  <div>
                    <p style={{
                      ...TYPE.metadata,
                      margin: '0 0 4px', color: accent,
                      fontSize: 11, letterSpacing: '0.1em',
                    }}>
                      WHAT IT MEANS
                    </p>
                    <p className="cinematic-body" style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>
                      {activeFactor.whatItMeans}
                    </p>
                  </div>

                  {/* Why it mattered */}
                  <div>
                    <p style={{
                      ...TYPE.metadata,
                      margin: '0 0 4px', color: accent,
                      fontSize: 11, letterSpacing: '0.1em',
                    }}>
                      WHY IT MATTERED
                    </p>
                    <p className="cinematic-body" style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>
                      {activeFactor.whyItMattered}
                    </p>
                  </div>

                  {/* Linked factor */}
                  <div style={{
                    background: `rgba(${rgb}, 0.07)`,
                    borderRadius: RADII.small,
                    padding: `${SPACING.micro}px ${SPACING.compact}px`,
                  }}>
                    <p style={{
                      ...TYPE.metadata,
                      margin: '0 0 3px', color: `rgba(${rgb}, 0.75)`,
                      fontSize: 10, letterSpacing: '0.1em',
                    }}>
                      LINKED FACTOR
                    </p>
                    <p className="cinematic-muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.55 }}>
                      {activeFactor.linkedFactor}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Judgement CTA (once all factors explored) ─────────────── */}
          <AnimatePresence>
            {allExplored && phase === 'web' && (
              <motion.div
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reveal}
              >
                <ContinueCTA
                  onClick={() => setPhase('judgement')}
                  label="Make your judgement →"
                  accent={accent}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Judgement card ───────────────────────────────────────────── */}
          <AnimatePresence>
            {phase === 'judgement' && (
              <motion.div
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reveal}
                style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard }}
              >
                {/* Factor selection card */}
                <div className="cinematic-card" style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
                  <div>
                    <p className="cinematic-eyebrow" style={{ margin: '0 0 8px', color: accent }}>
                      Make your judgement
                    </p>
                    <p style={{
                      ...TYPE.displayCard,
                      margin: 0, fontSize: 17, lineHeight: 1.45, color: '#fff',
                    }}>
                      {block.taskPrompt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {factors.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleChipSelect(f.id)}
                        aria-pressed={selected === f.id}
                        style={{
                          textAlign: 'left',
                          padding: `${SPACING.micro}px ${SPACING.compact}px`,
                          borderRadius: RADII.medium,
                          border: selected === f.id
                            ? `1.5px solid ${accent}`
                            : '1.5px solid rgba(255,255,255,0.1)',
                          background: selected === f.id
                            ? `rgba(${rgb}, 0.12)`
                            : 'rgba(255,255,255,0.03)',
                          color: selected === f.id ? accent : 'rgba(255,255,255,0.75)',
                          cursor: 'pointer',
                          fontFamily: "'Sora', sans-serif",
                          fontSize: 13,
                          fontWeight: selected === f.id ? 700 : 500,
                          display: 'flex', alignItems: 'center', gap: 8,
                          minHeight: 44, width: '100%',
                          outline: 'none',
                          transition: `all ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        }}
                        onFocus={e => { e.currentTarget.style.outline = `2px solid ${accent}`; e.currentTarget.style.outlineOffset = '2px' }}
                        onBlur={e => { e.currentTarget.style.outline = 'none' }}
                      >
                        <span aria-hidden="true">{f.icon}</span>
                        <span style={{ flex: 1 }}>{f.title}</span>
                        {selected === f.id && (
                          <span aria-hidden="true" style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Written response prompt (revealed on selection) */}
                <AnimatePresence>
                  {showWritePrompt && (
                    <motion.div
                      className="cinematic-card"
                      initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={fade}
                      style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}
                    >
                      <p className="cinematic-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                        Explain why this factor mattered most. Use one piece of evidence and explain how it linked to another factor.
                      </p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: SPACING.micro }}>
                        <p style={{
                          ...TYPE.metadata,
                          margin: '0 0 4px', fontSize: 10,
                          color: `rgba(${rgb}, 0.7)`, letterSpacing: '0.1em',
                        }}>
                          THINKING TIP
                        </p>
                        <p className="cinematic-muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                          {block.thinkingTip}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Continue — only once a factor has been selected */}
                {selected && (
                  <ContinueCTA
                    onClick={onContinue}
                    label="Continue"
                    accent={accent}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
