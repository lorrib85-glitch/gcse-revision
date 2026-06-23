import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ─── Idle float styles — injected once, keyed by id to avoid duplicates ──────
function ensureFloatStyles() {
  if (document.getElementById('cm-float-css')) return
  const el = document.createElement('style')
  el.id = 'cm-float-css'
  el.textContent = `
    @keyframes cm-float {
      0%, 100% { translate: 0 0px; }
      50%       { translate: 0 -3px; }
    }
    .cm-node-float {
      animation: cm-float 4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .cm-node-float { animation: none !important; }
    }
  `
  document.head.appendChild(el)
}
ensureFloatStyles()

// ─── Default radial positions for N nodes (0–100 viewBox / % space) ──────────
// Coordinates map directly to `left` / `top` percentages on the positioned nodes.
const POSITIONS = {
  5: [
    { x: 50, y: 14 },
    { x: 83, y: 37 },
    { x: 71, y: 79 },
    { x: 29, y: 79 },
    { x: 17, y: 37 },
  ],
  6: [
    { x: 50, y: 13 },
    { x: 80, y: 31 },
    { x: 80, y: 69 },
    { x: 50, y: 87 },
    { x: 20, y: 69 },
    { x: 20, y: 31 },
  ],
  7: [
    { x: 50, y: 13 },
    { x: 77, y: 27 },
    { x: 84, y: 58 },
    { x: 65, y: 82 },
    { x: 35, y: 82 },
    { x: 16, y: 58 },
    { x: 23, y: 27 },
  ],
}

function resolvePositions(count) {
  if (POSITIONS[count]) return POSITIONS[count]
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 360 / count - 90) * Math.PI / 180
    return { x: Math.round(50 + 35 * Math.cos(a)), y: Math.round(50 + 35 * Math.sin(a)) }
  })
}

// ─── Retrieval question — togglable answer reveal ────────────────────────────
function RetrievalQ({ node, accent, rgb }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ marginTop: SPACING.micro }}>
      <p style={{
        ...TYPE.metadataText,
        color: `rgba(${rgb}, 0.75)`,
        margin: '0 0 6px',
        letterSpacing: '0.08em',
      }}>
        QUICK CHECK
      </p>
      <p style={{
        ...TYPE.bodySmall,
        color: 'rgba(245,238,225,0.72)',
        margin: '0 0 8px',
      }}>
        {node.retrievalQuestion}
      </p>
      {revealed ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ ...TYPE.bodySmall, color: accent, margin: 0, fontWeight: 600 }}
        >
          {node.retrievalAnswer}
        </motion.p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          style={{
            background: `rgba(${rgb}, 0.12)`,
            border: `1px solid rgba(${rgb}, 0.28)`,
            borderRadius: RADII.small,
            padding: '6px 14px',
            color: `rgba(${rgb}, 0.9)`,
            cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.07em',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Reveal answer
        </button>
      )}
    </div>
  )
}

// ─── ConnectionMap ────────────────────────────────────────────────────────────
//
// Reusable radial concept map: a centre label connected to 5–7 learner-tappable
// nodes. Each node reveals an explanation panel with optional retrieval question
// and exam question link. Continue unlocks when all nodes have been visited.
//
// Block shape:
//   { centreLabel, title?, subtitle?, instruction?,
//     nodes: [{ id, label, shortLabel?, position?, explanation,
//               retrievalQuestion?, retrievalAnswer?, examLink? }] }
//
// Uses motion/react for SVG path-length reveal, node entry, and panel transitions.
// Idle float is a pure CSS animation that composes independently of Framer Motion.
export default function ConnectionMap({ block, subject = 'History', onComplete }) {
  const { centreLabel, title, subtitle, instruction, nodes = [] } = block
  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb    = theme.accentRgb
  const bg     = theme.background
  const prefersReduced = useReducedMotion()

  const [activeId, setActiveId] = useState(null)
  const [explored, setExplored] = useState(new Set())

  const positions   = resolvePositions(nodes.length)
  const allExplored = nodes.length > 0 && explored.size >= nodes.length
  const activeNode  = nodes.find(n => n.id === activeId)

  function handleNodeTap(node) {
    setActiveId(node.id)
    setExplored(prev => new Set([...prev, node.id]))
  }

  // ── Transition helpers ────────────────────────────────────────────────────
  const instant = { duration: 0 }
  const fade    = prefersReduced ? instant : { duration: 0.26, ease: 'easeOut' }
  const reveal  = prefersReduced ? instant : { duration: 0.32, ease: 'easeOut' }

  function centreT() {
    return prefersReduced ? instant : { delay: 0.15, duration: 0.45, ease: 'easeOut' }
  }
  function lineT(i) {
    if (prefersReduced) return instant
    return {
      pathLength:    { delay: 0.3 + i * 0.09, duration: 0.5, ease: 'easeOut' },
      strokeOpacity: { duration: 0.25 },
      strokeWidth:   { duration: 0.18 },
    }
  }
  function nodeT(i) {
    return prefersReduced ? instant : { delay: 0.52 + i * 0.09, duration: 0.34, ease: 'easeOut' }
  }

  return (
    // CinematicShell not used here because the content may overflow on short
    // viewports — overflowY:auto lets it scroll while still feeling cinematic.
    <div style={{
      position: 'fixed', inset: 0, background: bg,
      overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding: `calc(80px + env(safe-area-inset-top, 0px)) 0 calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
        maxWidth: 440, margin: '0 auto',
      }}>
        <div style={{
          padding: `0 ${SPACING.standard}px`,
          display: 'flex', flexDirection: 'column', gap: SPACING.standard,
        }}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          {(title || subtitle) && (
            <div>
              {title && (
                <h2 style={{ ...TYPE.sectionHeading, margin: '0 0 4px', color: '#fff' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={{ ...TYPE.bodyText, margin: 0, color: 'rgba(245,238,225,0.56)' }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* ── Radial map ──────────────────────────────────────────────────── */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 340,
            aspectRatio: '1',
            margin: '0 auto',
          }}>
            {/* SVG connection lines — drawn via Framer Motion pathLength */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', overflow: 'visible',
              }}
              aria-hidden="true"
            >
              {nodes.map((node, i) => {
                const pos = node.position || positions[i] || { x: 50, y: 50 }
                const isActive   = activeId === node.id
                const isExplored = explored.has(node.id)
                return (
                  <motion.path
                    key={node.id}
                    d={`M 50 50 L ${pos.x} ${pos.y}`}
                    stroke={accent}
                    fill="none"
                    strokeLinecap="round"
                    initial={{
                      pathLength: prefersReduced ? 1 : 0,
                      strokeWidth: 0.5,
                      strokeOpacity: isExplored ? 0.5 : 0.2,
                    }}
                    animate={{
                      pathLength: 1,
                      strokeWidth: isActive ? 0.9 : 0.5,
                      strokeOpacity: isActive ? 0.95 : isExplored ? 0.5 : 0.2,
                    }}
                    transition={lineT(i)}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 2.5px rgba(${rgb}, 0.55))`
                        : 'none',
                    }}
                  />
                )
              })}
            </svg>

            {/* Centre node */}
            <motion.div
              role="img"
              aria-label={centreLabel}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 84, height: 84,
                borderRadius: '50%',
                background: `rgba(${rgb}, 0.09)`,
                border: `1.5px solid rgba(${rgb}, 0.48)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 8, textAlign: 'center', zIndex: 2,
              }}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={centreT()}
            >
              <span style={{
                fontFamily: "'Sora', sans-serif",
                color: `rgba(${rgb}, 0.92)`,
                fontSize: 8.5,
                lineHeight: 1.35,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {centreLabel}
              </span>
            </motion.div>

            {/* Outer nodes */}
            {nodes.map((node, i) => {
              const pos = node.position || positions[i] || { x: 50, y: 50 }
              const isActive   = activeId === node.id
              const isExplored = explored.has(node.id)
              const label      = node.shortLabel || node.label

              return (
                // Positioning layer — plain div so translate positioning is
                // independent of Framer Motion's transform management
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                  }}
                >
                  {/* Idle float — CSS translate, composites separately from transform */}
                  <div
                    className={!isActive ? 'cm-node-float' : undefined}
                    style={{ animationDelay: `${0.9 + i * 0.38}s` }}
                  >
                    {/* Entry reveal via Framer Motion */}
                    <motion.button
                      onClick={() => handleNodeTap(node)}
                      aria-label={node.label}
                      aria-pressed={isActive}
                      initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.65 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={nodeT(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        padding: 5,
                        width: 64,
                        height: 64,
                        minWidth: 44,
                        minHeight: 44,
                        borderRadius: '50%',
                        border: isActive
                          ? `2px solid ${accent}`
                          : isExplored
                            ? `1.5px solid rgba(${rgb}, 0.48)`
                            : '1.5px solid rgba(255,255,255,0.11)',
                        background: isActive
                          ? `rgba(${rgb}, 0.15)`
                          : isExplored
                            ? `rgba(${rgb}, 0.07)`
                            : 'rgba(255,255,255,0.035)',
                        boxShadow: isActive
                          ? `0 0 0 3px rgba(${rgb},0.18), 0 0 22px rgba(${rgb},0.26)`
                          : 'none',
                        cursor: 'pointer',
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
                      <span style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 7.5,
                        lineHeight: 1.3,
                        fontWeight: 700,
                        color: isActive
                          ? accent
                          : isExplored
                            ? `rgba(${rgb}, 0.92)`
                            : 'rgba(255,255,255,0.72)',
                        textAlign: 'center',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        maxWidth: 54,
                        letterSpacing: '0.02em',
                        transition: `color ${MOTION.duration.fast}`,
                        userSelect: 'none',
                      }}>
                        {label}
                      </span>
                      {isExplored && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: 1, right: 1,
                            width: 14, height: 14,
                            borderRadius: '50%',
                            background: accent,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 7.5, color: bg, fontWeight: 900, lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </motion.button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Progress counter ────────────────────────────────────────────── */}
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.26)',
            textAlign: 'center',
            margin: `-${SPACING.micro}px 0 0`,
          }}>
            {explored.size} / {nodes.length} explored
          </p>

          {/* ── First-tap hint ──────────────────────────────────────────────── */}
          {explored.size === 0 && (
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 13,
              color: `rgba(${rgb}, 0.46)`,
              textAlign: 'center',
              margin: 0,
            }}>
              {instruction || 'Tap a concept to explore it'}
            </p>
          )}

          {/* ── Info panel ──────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeId}
                className="cinematic-card"
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
                transition={fade}
                style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}
              >
                {/* Node title */}
                <p style={{ ...TYPE.cardTitle, margin: 0, color: '#fff', lineHeight: 1.25 }}>
                  {activeNode.label}
                </p>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  paddingTop: SPACING.micro,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING.compact,
                }}>
                  {/* Explanation */}
                  <p className="cinematic-body" style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>
                    {activeNode.explanation}
                  </p>

                  {/* Retrieval question */}
                  {activeNode.retrievalQuestion && (
                    <div style={{
                      background: `rgba(${rgb}, 0.07)`,
                      borderRadius: RADII.small,
                      padding: `${SPACING.micro}px ${SPACING.compact}px`,
                    }}>
                      <RetrievalQ node={activeNode} accent={accent} rgb={rgb} />
                    </div>
                  )}

                  {/* Exam question link */}
                  {activeNode.examLink && (
                    <div style={{
                      borderLeft: `2px solid rgba(${rgb}, 0.42)`,
                      paddingLeft: SPACING.compact,
                    }}>
                      <p style={{
                        ...TYPE.metadataText,
                        margin: '0 0 4px',
                        color: `rgba(${rgb}, 0.7)`,
                        fontSize: 10,
                        letterSpacing: '0.1em',
                      }}>
                        EXAM LINK
                      </p>
                      <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 12,
                        lineHeight: 1.55,
                        fontWeight: 500,
                        color: 'rgba(245,238,225,0.7)',
                        margin: 0,
                        fontStyle: 'italic',
                      }}>
                        {activeNode.examLink}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Continue CTA — unlocks when all nodes visited ───────────────── */}
          <AnimatePresence>
            {allExplored && (
              <motion.div
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reveal}
              >
                <ContinueCTA onClick={onComplete} label="Continue" accent={accent} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress nudge */}
          {!allExplored && nodes.length > 0 && (
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 11,
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.16)',
              textAlign: 'center',
              margin: `0 0 ${SPACING.standard}px`,
            }}>
              EXPLORE ALL {nodes.length} CONCEPTS TO CONTINUE
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
