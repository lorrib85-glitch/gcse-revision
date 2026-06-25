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

// ─── Node positions (% of container) ─────────────────────────────────────────
// Layout uses a true radial system around the centre node at (50%, 50%).
const POSITIONS = {
  5: [
    { x: 50, y: 16 },
    { x: 78, y: 35 },
    { x: 67, y: 78 },
    { x: 33, y: 78 },
    { x: 22, y: 35 },
  ],
  6: [
    { x: 50, y: 16 },  // top
    { x: 79, y: 31 },  // upper right
    { x: 79, y: 69 },  // lower right
    { x: 50, y: 84 },  // bottom
    { x: 21, y: 69 },  // lower left
    { x: 21, y: 31 },  // upper left
  ],
  7: [
    { x: 50, y: 14 },
    { x: 75, y: 27 },
    { x: 80, y: 54 },
    { x: 64, y: 78 },
    { x: 36, y: 78 },
    { x: 20, y: 54 },
    { x: 25, y: 27 },
  ],
}

function resolvePositions(count) {
  if (POSITIONS[count]) return POSITIONS[count]
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 360 / count - 90) * Math.PI / 180
    return { x: Math.round(50 + 29 * Math.cos(a)), y: Math.round(50 + 34 * Math.sin(a)) }
  })
}

// ─── Line path — pixel-aware offset for non-square 320×360 container ─────────
// Lines start at the centre node edge and end at the outer node edge.
// W/H = design reference dimensions; startPx/endPx = circle radii in pixels.
function linePath(pos) {
  const W = 320, H = 360   // design reference: maxWidth × fixed height
  const cx = 50, cy = 50   // centre node position in %
  const startPx = 48        // centre radius (96px / 2)
  const endPx   = 39        // outer node radius (78px / 2)

  const dx_px = (pos.x - cx) / 100 * W
  const dy_px = (pos.y - cy) / 100 * H
  const len   = Math.sqrt(dx_px * dx_px + dy_px * dy_px) || 1
  const ux = dx_px / len
  const uy = dy_px / len

  const sx = cx + ux * startPx / W * 100
  const sy = cy + uy * startPx / H * 100
  const ex = pos.x - ux * endPx / W * 100
  const ey = pos.y - uy * endPx / H * 100

  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} L ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

// ─── Retrieval question — togglable answer reveal ────────────────────────────
function RetrievalQ({ node, accent, rgb }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ marginTop: 2 }}>
      <p style={{
        fontFamily: TYPE.bodyText.fontFamily,
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
            fontFamily: TYPE.bodyText.fontFamily,
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

  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg,
      overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding: `calc(80px + env(safe-area-inset-top, 0px)) 0 calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
        maxWidth: 440, margin: '0 auto',
      }}>
        {/* Flex column — gap:0; each child controls its own spacing */}
        <div style={{
          padding: `0 ${SPACING.standard}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          {(title || subtitle) && (
            <div style={{ marginBottom: 12 }}>
              {title && (
                <h1 style={{ ...TYPE.screenHeading, margin: '0 0 8px', color: '#F5F7FF' }}>
                  {title}
                </h1>
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

          {/* ── Radial map — 360px fixed height, maxWidth 320px ─────────────── */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            height: 360,
            margin: '0 auto',
            flexShrink: 0,
          }}>
            {/* SVG connection lines — z-index 1, behind all nodes */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', overflow: 'visible',
                zIndex: 1,
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
                      strokeOpacity: isViewed ? 0.38 : 0.28,
                    }}
                    animate={{
                      pathLength:    1,
                      strokeWidth:   isActive ? 2 : 1.5,
                      strokeOpacity: isActive ? 0.85 : isViewed ? 0.40 : 0.28,
                    }}
                    transition={lineT(i)}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 2px rgba(${rgb}, 0.40))`
                        : 'none',
                    }}
                  />
                )
              })}
            </svg>

            {/* Centre node — true visual and mathematical centre */}
            <motion.div
              role="img"
              aria-label={centreLabel}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${rgb},0.22) 0%, rgba(${rgb},0.08) 60%, transparent 100%)`,
                border: `1.5px solid rgba(${rgb}, 0.38)`,
                boxShadow: `inset 0 0 20px rgba(${rgb},0.12), 0 0 10px rgba(${rgb},0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 10, textAlign: 'center',
                zIndex: 2,
              }}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={centreT()}
            >
              <span style={{
                fontFamily: TYPE.bodyText.fontFamily,
                color: accent,
                fontSize: 12,
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                maxWidth: 68,
                textAlign: 'center',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {centreLabel}
              </span>
            </motion.div>

            {/* Outer nodes — z-index 3 inactive, 4 active */}
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
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isActive ? 4 : 3,
                  }}
                >
                  {/* Idle float — CSS translate, independent of Framer Motion transform */}
                  <div
                    className={!isActive ? 'cm-node-float' : undefined}
                    style={{ animationDelay: `${0.9 + i * 0.38}s` }}
                  >
                    <motion.button
                      onClick={() => handleNodeTap(node)}
                      aria-label={node.label}
                      aria-pressed={isActive}
                      initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.65 }}
                      animate={{
                        opacity: 1,
                        scale: isActive ? 1.03 : 1,
                      }}
                      transition={nodeT(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6,
                        width: 78,
                        height: 78,
                        minWidth: 44,
                        minHeight: 44,
                        borderRadius: '50%',
                        border: isActive
                          ? `2px solid rgba(${rgb}, 0.9)`
                          : isViewed
                            ? `1.5px solid rgba(${rgb}, 0.50)`
                            : `1.5px solid rgba(${rgb}, 0.35)`,
                        background: isActive
                          ? `rgba(42,28,10,0.96)`
                          : `rgba(30,20,8,0.88)`,
                        // Single contained glow on active — no double ring
                        boxShadow: isActive
                          ? `0 0 12px rgba(${rgb},0.22)`
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
                        fontFamily: TYPE.bodyText.fontFamily,
                        fontSize: 11,
                        lineHeight: 1.25,
                        fontWeight: 700,
                        color: isActive
                          ? accent
                          : 'rgba(237,224,200,0.88)',
                        textAlign: 'center',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        maxWidth: 58,
                        letterSpacing: '0.02em',
                        transition: `color ${MOTION.duration.fast}`,
                        userSelect: 'none',
                      }}>
                        {label}
                      </span>
                      {/* Viewed tick — small bronze badge, z-index 5 */}
                      {isViewed && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: 3, right: 3,
                            width: 15, height: 15,
                            borderRadius: '50%',
                            background: `rgba(${rgb}, 0.88)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: bg, fontWeight: 900, lineHeight: 1,
                            zIndex: 5,
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

          {/* ── Progress counter — 12px below map ──────────────────────────── */}
          <p style={{
            fontFamily: TYPE.bodyText.fontFamily,
            fontSize: 12,
            letterSpacing: '0.04em',
            color: 'rgba(237,224,200,0.55)',
            textAlign: 'center',
            margin: '12px 0 0',
          }}>
            {explored.size} / {nodes.length} explored
          </p>

          {/* ── First-tap hint — 12px below counter ────────────────────────── */}
          {explored.size === 0 && (
            <p style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 15,
              color: `rgba(${rgb}, 0.75)`,
              textAlign: 'center',
              margin: '12px 0 0',
            }}>
              {instruction || 'Tap a concept to explore it'}
            </p>
          )}

          {/* ── Info panel — History-branded ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeId}
                initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
                transition={fade}
                style={{
                  marginTop: 16,
                  background: 'rgba(20,13,5,0.97)',
                  border: `1px solid rgba(${rgb}, 0.22)`,
                  borderTop: `2px solid rgba(${rgb}, 0.45)`,
                  borderRadius: RADII.large,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: SPACING.compact,
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
                  {/* Explanation */}
                  <p style={{
                    fontFamily: TYPE.bodyText.fontFamily,
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
                        fontFamily: TYPE.bodyText.fontFamily,
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
                        fontFamily: TYPE.bodyText.fontFamily,
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
                style={{ marginTop: 16 }}
              >
                <ContinueCTA onClick={onComplete} label="Continue" accent={accent} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress nudge — subtle, 18px below last element */}
          {!allExplored && nodes.length > 0 && (
            <p style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 11,
              letterSpacing: '0.05em',
              color: 'rgba(237,224,200,0.35)',
              textAlign: 'center',
              margin: '18px 0 8px',
            }}>
              EXPLORE ALL {nodes.length} CONCEPTS TO CONTINUE
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
