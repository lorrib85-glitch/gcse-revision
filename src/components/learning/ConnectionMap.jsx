import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ─── Idle float styles — 2px max, no rotation ────────────────────────────────
function ensureFloatStyles() {
  if (document.getElementById('cm-float-css')) return
  const el = document.createElement('style')
  el.id = 'cm-float-css'
  el.textContent = `
    @keyframes cm-float {
      0%, 100% { translate: 0 0px; }
      50%       { translate: 0 -2px; }
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

// ─── Node positions — tightened inward, safe 28px+ from edges ────────────────
// Coordinates map to left/top percentage in the positioned container.
// 6-node layout matches exact prompt specification for mobile safety.
const POSITIONS = {
  5: [
    { x: 50, y: 10 },
    { x: 78, y: 34 },
    { x: 67, y: 72 },
    { x: 33, y: 72 },
    { x: 22, y: 34 },
  ],
  6: [
    { x: 50, y: 6  },
    { x: 76, y: 24 },
    { x: 72, y: 58 },
    { x: 50, y: 76 },
    { x: 24, y: 58 },
    { x: 24, y: 24 },
  ],
  7: [
    { x: 50, y: 8  },
    { x: 74, y: 23 },
    { x: 78, y: 54 },
    { x: 62, y: 78 },
    { x: 38, y: 78 },
    { x: 22, y: 54 },
    { x: 26, y: 23 },
  ],
}

function resolvePositions(count) {
  if (POSITIONS[count]) return POSITIONS[count]
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 360 / count - 90) * Math.PI / 180
    return { x: Math.round(50 + 32 * Math.cos(a)), y: Math.round(50 + 32 * Math.sin(a)) }
  })
}

// ─── Retrieval question — togglable answer reveal ────────────────────────────
function RetrievalQ({ node, accent, rgb }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ marginTop: 2 }}>
      <p style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.10em',
        color: `rgba(${rgb}, 0.72)`,
        margin: '0 0 6px',
        textTransform: 'uppercase',
      }}>
        Quick check
      </p>
      <p style={{
        ...TYPE.bodySmall,
        color: 'rgba(237,224,200,0.72)',
        margin: '0 0 8px',
        lineHeight: 1.55,
      }}>
        {node.retrievalQuestion}
      </p>
      {revealed ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            ...TYPE.bodySmall,
            color: accent,
            margin: 0,
            fontWeight: 600,
            lineHeight: 1.55,
          }}
        >
          {node.retrievalAnswer}
        </motion.p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          style={{
            background: `rgba(${rgb}, 0.10)`,
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
// nodes. Each node reveals a History-branded explanation panel with optional
// retrieval question and exam question link. Continue unlocks when all nodes
// have been visited.
//
// Block shape:
//   { centreLabel, title?, subtitle?, instruction?,
//     nodes: [{ id, label, shortLabel?, position?, explanation,
//               retrievalQuestion?, retrievalAnswer?, examLink? }] }
//
// Uses motion/react for SVG path-length reveal, node entry, and panel transitions.
// Idle float is a pure CSS animation composing independently of Framer Motion.
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

  // ── Transition helpers ──────────────────────────────────────────────────────
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

  // ── Line offset helpers: start past centre circle, end before outer node ───
  // Keeps lines clearly directional and prevents visual overlap with circles.
  function linePath(pos) {
    const dx = pos.x - 50
    const dy = pos.y - 50
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    // 14 SVG units from centre ≈ just past the centre circle edge
    const sx = 50 + (dx / len) * 14
    const sy = 50 + (dy / len) * 14
    // 8 SVG units before outer node centre ≈ node edge
    const ex = pos.x - (dx / len) * 8
    const ey = pos.y - (dy / len) * 8
    return `M ${sx.toFixed(2)} ${sy.toFixed(2)} L ${ex.toFixed(2)} ${ey.toFixed(2)}`
  }

  return (
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
          display: 'flex', flexDirection: 'column', gap: SPACING.compact,
        }}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          {(title || subtitle) && (
            <div style={{ marginBottom: 4 }}>
              {title && (
                <h2 style={{ ...TYPE.sectionHeading, margin: '0 0 2px', color: '#F5F7FF' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={{
                  ...TYPE.bodySmall,
                  margin: 0,
                  color: 'rgba(237,224,200,0.48)',
                  lineHeight: 1.45,
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* ── Radial map ──────────────────────────────────────────────────── */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            height: 370,
            margin: '0 auto',
            flexShrink: 0,
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
                const pos      = node.position || positions[i] || { x: 50, y: 50 }
                const isActive = activeId === node.id
                const isViewed = explored.has(node.id)
                return (
                  <motion.path
                    key={node.id}
                    d={linePath(pos)}
                    stroke={accent}
                    fill="none"
                    strokeLinecap="round"
                    initial={{
                      pathLength:    prefersReduced ? 1 : 0,
                      strokeWidth:   1.5,
                      strokeOpacity: isViewed ? 0.4 : 0.22,
                    }}
                    animate={{
                      pathLength:    1,
                      strokeWidth:   isActive ? 2 : 1.5,
                      strokeOpacity: isActive ? 0.92 : isViewed ? 0.42 : 0.26,
                    }}
                    transition={lineT(i)}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 3px rgba(${rgb}, 0.52))`
                        : 'none',
                    }}
                  />
                )
              })}
            </svg>

            {/* Centre node — dominant, dark bronze radial, warm gold label */}
            <motion.div
              role="img"
              aria-label={centreLabel}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 100, height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${rgb},0.22) 0%, rgba(${rgb},0.08) 60%, transparent 100%)`,
                border: `1.5px solid rgba(${rgb}, 0.38)`,
                boxShadow: `inset 0 0 20px rgba(${rgb},0.12), 0 0 10px rgba(${rgb},0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 10, textAlign: 'center', zIndex: 2,
              }}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={centreT()}
            >
              <span style={{
                fontFamily: "'Sora', sans-serif",
                color: accent,
                fontSize: 10,
                lineHeight: 1.3,
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

            {/* Outer nodes — dark umber plaques, bronze border, parchment text */}
            {nodes.map((node, i) => {
              const pos      = node.position || positions[i] || { x: 50, y: 50 }
              const isActive = activeId === node.id
              const isViewed = explored.has(node.id)
              const label    = node.shortLabel || node.label

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                  }}
                >
                  {/* Idle float — CSS translate, independent of Framer Motion transform */}
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
                      animate={{
                        opacity: 1,
                        scale: isActive ? 1.04 : 1,
                      }}
                      transition={nodeT(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6,
                        width: 68,
                        height: 68,
                        minWidth: 44,
                        minHeight: 44,
                        borderRadius: '50%',
                        border: isActive
                          ? `2px solid rgba(${rgb}, 0.9)`
                          : isViewed
                            ? `1.5px solid rgba(${rgb}, 0.45)`
                            : `1.5px solid rgba(${rgb}, 0.22)`,
                        background: isActive
                          ? `rgba(42,28,10,0.96)`
                          : `rgba(30,20,8,0.85)`,
                        boxShadow: isActive
                          ? `0 0 16px rgba(${rgb},0.28)`
                          : 'none',
                        opacity: isActive ? 1 : isViewed ? 0.88 : 0.72,
                        cursor: 'pointer',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        transition: [
                          `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                          `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                          `box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                          `opacity ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                        ].join(', '),
                        position: 'relative',
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
                        fontSize: 9.5,
                        lineHeight: 1.3,
                        fontWeight: 700,
                        color: isActive
                          ? accent
                          : 'rgba(237,224,200,0.88)',
                        textAlign: 'center',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        maxWidth: 54,
                        letterSpacing: '0.03em',
                        transition: `color ${MOTION.duration.fast}`,
                        userSelect: 'none',
                      }}>
                        {label}
                      </span>
                      {/* Viewed tick — small bronze badge only */}
                      {isViewed && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: 2, right: 2,
                            width: 14, height: 14,
                            borderRadius: '50%',
                            background: `rgba(${rgb}, 0.88)`,
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
            color: 'rgba(237,224,200,0.22)',
            textAlign: 'center',
            margin: 0,
          }}>
            {explored.size} / {nodes.length} explored
          </p>

          {/* ── First-tap hint ──────────────────────────────────────────────── */}
          {explored.size === 0 && (
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 13,
              color: `rgba(${rgb}, 0.44)`,
              textAlign: 'center',
              margin: 0,
            }}>
              {instruction || 'Tap a concept to explore it'}
            </p>
          )}

          {/* ── Info panel — History-branded ────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeId}
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
                transition={fade}
                style={{
                  background: 'rgba(20,13,5,0.97)',
                  border: `1px solid rgba(${rgb}, 0.22)`,
                  borderRadius: RADII.large,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING.compact,
                  // Top accent rule — bronze top border highlight
                  borderTop: `2px solid rgba(${rgb}, 0.45)`,
                }}
              >
                {/* Node title */}
                <p style={{
                  ...TYPE.cardTitle,
                  margin: 0,
                  color: '#EDE0C8',
                  lineHeight: 1.22,
                }}>
                  {activeNode.label}
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING.compact,
                }}>
                  {/* Explanation — parchment body, 15px */}
                  <p style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.65,
                    fontWeight: 400,
                    color: 'rgba(237,224,200,0.75)',
                    margin: 0,
                  }}>
                    {activeNode.explanation}
                  </p>

                  {/* Retrieval question */}
                  {activeNode.retrievalQuestion && (
                    <div style={{
                      background: `rgba(${rgb}, 0.07)`,
                      border: `1px solid rgba(${rgb}, 0.18)`,
                      borderRadius: RADII.small,
                      padding: `${SPACING.micro}px ${SPACING.compact}px`,
                    }}>
                      <RetrievalQ node={activeNode} accent={accent} rgb={rgb} />
                    </div>
                  )}

                  {/* Exam link */}
                  {activeNode.examLink && (
                    <div style={{
                      borderLeft: `2px solid rgba(${rgb}, 0.45)`,
                      paddingLeft: SPACING.compact,
                    }}>
                      <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                        color: `rgba(${rgb}, 0.68)`,
                      }}>
                        Exam link
                      </p>
                      <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.55,
                        fontWeight: 500,
                        color: 'rgba(237,224,200,0.68)',
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
              color: 'rgba(237,224,200,0.14)',
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
