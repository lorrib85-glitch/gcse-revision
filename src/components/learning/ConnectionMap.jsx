import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'

function ensureFloatStyles() {
  if (document.getElementById('cm-float-css')) return
  const el = document.createElement('style')
  el.id = 'cm-float-css'
  el.textContent = `
    @keyframes cm-float {
      0%, 100% { translate: 0 0px; }
      50%       { translate: 0 -2px; }
    }
    .cm-node-float { animation: cm-float 4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .cm-node-float { animation: none !important; }
    }
  `
  document.head.appendChild(el)
}
ensureFloatStyles()

const MAP_WIDTH = 320
const MAP_HEIGHT = 360
const CENTRE_NODE_SIZE = 104
const OUTER_NODE_SIZE = 90

const POSITIONS = {
  5: [{ x: 50, y: 15 }, { x: 80, y: 34 }, { x: 68, y: 80 }, { x: 32, y: 80 }, { x: 20, y: 34 }],
  6: [{ x: 50, y: 15 }, { x: 82, y: 31 }, { x: 82, y: 69 }, { x: 50, y: 85 }, { x: 18, y: 69 }, { x: 18, y: 31 }],
  7: [{ x: 50, y: 14 }, { x: 77, y: 27 }, { x: 82, y: 54 }, { x: 65, y: 80 }, { x: 35, y: 80 }, { x: 18, y: 54 }, { x: 23, y: 27 }],
}

const DEFAULT_CAPTIONS = {
  supernatural: 'Sin or test',
  astrology: 'Stars affect health',
  humours: 'Disease = imbalance',
  miasma: 'Smell spreads sickness',
  galen: 'Ancient authority',
  experience: 'Practical remedies',
}

const DEFAULT_NODE_IMAGES = {
  supernatural: '/figures/history/medicine/medieval/icons/god-sin.png',
  astrology: '/figures/history/medicine/medieval/icons/astrology.png',
  humours: '/figures/history/medicine/medieval/icons/four-humours.png',
  galen: '/figures/history/medicine/medieval/galen-portrait.png',
  experience: '/figures/history/medicine/medieval/wise-woman.webp',
}

const DEFAULT_CENTRE_IMAGES = {
  History: '/figures/history/medicine/medieval/physician.webp',
}

function resolvePositions(count) {
  if (POSITIONS[count]) return POSITIONS[count]
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 360 / count - 90) * Math.PI / 180
    return { x: Math.round(50 + 31 * Math.cos(a)), y: Math.round(50 + 35 * Math.sin(a)) }
  })
}

function lineGeometry(pos) {
  const cx = 50, cy = 50
  const startPx = CENTRE_NODE_SIZE / 2
  const endPx = OUTER_NODE_SIZE / 2
  const dxPx = (pos.x - cx) / 100 * MAP_WIDTH
  const dyPx = (pos.y - cy) / 100 * MAP_HEIGHT
  const len = Math.sqrt(dxPx * dxPx + dyPx * dyPx) || 1
  const ux = dxPx / len
  const uy = dyPx / len
  const sx = cx + ux * startPx / MAP_WIDTH * 100
  const sy = cy + uy * startPx / MAP_HEIGHT * 100
  const ex = pos.x - ux * endPx / MAP_WIDTH * 100
  const ey = pos.y - uy * endPx / MAP_HEIGHT * 100
  return { sx, sy, ex, ey }
}

function linePath(pos, index = 0) {
  const { sx, sy, ex, ey } = lineGeometry(pos)
  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2
  const dx = ex - sx
  const dy = ey - sy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const bend = index % 2 === 0 ? 2.5 : -2.5
  const cx = mx + (-dy / len) * bend
  const cy = my + (dx / len) * bend
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

function RetrievalQ({ node, accent, rgb }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ marginTop: 2 }}>
      <p style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: `rgba(${rgb}, 0.72)`, margin: '0 0 6px' }}>Quick check</p>
      <p style={{ ...TYPE.bodySmall, color: 'rgba(237,224,200,0.72)', margin: '0 0 8px', lineHeight: 1.55 }}>{node.retrievalQuestion}</p>
      {revealed ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} style={{ ...TYPE.bodySmall, color: accent, margin: 0, fontWeight: 600, lineHeight: 1.55 }}>{node.retrievalAnswer}</motion.p>
      ) : (
        <button onClick={() => setRevealed(true)} style={{ background: `rgba(${rgb}, 0.10)`, border: `1px solid rgba(${rgb}, 0.28)`, borderRadius: RADII.small, padding: '6px 14px', color: `rgba(${rgb}, 0.9)`, cursor: 'pointer', fontFamily: TYPE.bodyText.fontFamily, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em', WebkitTapHighlightColor: 'transparent' }}>Reveal answer</button>
      )}
    </div>
  )
}

export default function ConnectionMap({ block, subject = 'History', onComplete }) {
  const { centreLabel, centreImage, title, subtitle, instruction, nodes = [] } = block
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
  const bg = theme.background
  const prefersReduced = useReducedMotion()
  const resolvedCentreImage = centreImage || DEFAULT_CENTRE_IMAGES[subject]

  const [activeId, setActiveId] = useState(null)
  const [explored, setExplored] = useState(new Set())

  const positions = resolvePositions(nodes.length)
  const allExplored = nodes.length > 0 && explored.size >= nodes.length
  const activeNode = nodes.find(n => n.id === activeId)
  const currentIndex = activeNode ? Math.max(0, nodes.findIndex(n => n.id === activeId)) : 0
  const viewedIndexes = nodes.map((node, index) => explored.has(node.id) ? index : null).filter(index => index !== null)

  function handleNodeTap(node) {
    setActiveId(node.id)
    setExplored(prev => new Set([...prev, node.id]))
  }

  const instant = { duration: 0 }
  const fade = prefersReduced ? instant : { duration: 0.26, ease: 'easeOut' }
  const reveal = prefersReduced ? instant : { duration: 0.32, ease: 'easeOut' }
  const centreT = () => prefersReduced ? instant : { delay: 0.15, duration: 0.45, ease: 'easeOut' }
  const lineT = (i) => prefersReduced ? instant : {
    pathLength: { delay: 0.36 + i * 0.13, duration: 0.48, ease: 'easeOut' },
    strokeOpacity: { duration: 0.25 },
    strokeWidth: { duration: 0.18 },
  }
  const nodeT = (i) => prefersReduced ? instant : { delay: 0.58 + i * 0.15, duration: 0.42, ease: [0.16, 1, 0.3, 1] }

  return (
    <div style={{ position: 'fixed', inset: 0, background: bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ position: 'relative', zIndex: 1, padding: `calc(80px + env(safe-area-inset-top, 0px)) 0 calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`, maxWidth: 440, margin: '0 auto' }}>
        <div style={{ padding: `0 ${SPACING.standard}px`, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {(title || subtitle) && (
            <div style={{ marginBottom: 12 }}>
              {title && <h1 style={{ ...TYPE.screenHeading, margin: '0 0 8px', color: '#F5F7FF' }}>{title}</h1>}
              {subtitle && <p style={{ ...TYPE.bodySmall, margin: 0, color: 'rgba(237,224,200,0.48)', lineHeight: 1.45 }}>{subtitle}</p>}
            </div>
          )}

          <div style={{ position: 'relative', width: '100%', maxWidth: MAP_WIDTH, height: MAP_HEIGHT, margin: '0 auto', flexShrink: 0 }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: -10, borderRadius: 32, background: `radial-gradient(circle at 50% 48%, rgba(${rgb},0.20) 0%, rgba(${rgb},0.075) 34%, transparent 68%)`, filter: 'blur(1px)', opacity: 0.95, zIndex: 0 }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 4, borderRadius: 28, background: `linear-gradient(135deg, rgba(${rgb},0.055) 0 1px, transparent 1px 22px)`, opacity: 0.22, zIndex: 0 }} />

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }} aria-hidden="true">
              {nodes.map((node, i) => {
                const pos = node.position || positions[i] || { x: 50, y: 50 }
                const isActive = activeId === node.id
                const isViewed = explored.has(node.id)
                const hasFocus = Boolean(activeId)
                const { sx, sy } = lineGeometry(pos)
                return (
                  <g key={node.id}>
                    <motion.path d={linePath(pos, i)} stroke={accent} fill="none" strokeLinecap="round" initial={{ pathLength: prefersReduced ? 1 : 0, strokeWidth: 1.05, strokeOpacity: 0 }} animate={{ pathLength: 1, strokeWidth: isActive ? 1.75 : 1.05, strokeOpacity: isActive ? 0.84 : isViewed ? 0.34 : hasFocus ? 0.15 : 0.24 }} transition={lineT(i)} style={{ filter: isActive ? `drop-shadow(0 0 3px rgba(${rgb}, 0.46))` : 'none' }} />
                    <motion.circle cx={sx} cy={sy} r={isActive ? 1.35 : 0.92} fill={accent} initial={{ opacity: prefersReduced ? 0.55 : 0 }} animate={{ opacity: isActive ? 0.95 : isViewed ? 0.52 : hasFocus ? 0.22 : 0.34 }} transition={lineT(i)} style={{ filter: isActive ? `drop-shadow(0 0 3px rgba(${rgb},0.62))` : 'none' }} />
                  </g>
                )
              })}
            </svg>

            <div style={{ position: 'absolute', left: '50%', top: '50%', width: CENTRE_NODE_SIZE, height: CENTRE_NODE_SIZE, transform: 'translate(-50%, -50%)', zIndex: 2 }}>
              <motion.div role="img" aria-label={centreLabel} style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle, rgba(${rgb},0.30) 0%, rgba(${rgb},0.12) 56%, rgba(20,13,5,0.96) 100%)`, border: `2px solid rgba(${rgb}, 0.62)`, boxShadow: `inset 0 0 24px rgba(${rgb},0.18), 0 0 22px rgba(${rgb},0.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, textAlign: 'center', overflow: 'hidden', position: 'relative' }} initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={centreT()}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 5, borderRadius: '50%', border: `1px solid rgba(${rgb},0.28)`, boxShadow: `inset 0 0 10px rgba(${rgb},0.12)` }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `1px solid rgba(${rgb},0.16)`, opacity: 0.85 }} />
                {resolvedCentreImage && <img src={resolvedCentreImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', objectFit: 'cover', opacity: 0.30, filter: 'grayscale(0.18) sepia(0.34) contrast(1.06)' }} />}
                <span style={{ fontFamily: TYPE.bodyText.fontFamily, color: accent, fontSize: 12, lineHeight: 1.15, fontWeight: 800, letterSpacing: '0.02em', maxWidth: 72, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', position: 'relative', zIndex: 1, textShadow: '0 1px 8px rgba(0,0,0,0.62)' }}>{centreLabel}</span>
              </motion.div>
            </div>

            {nodes.map((node, i) => {
              const pos = node.position || positions[i] || { x: 50, y: 50 }
              const isActive = activeId === node.id
              const isViewed = explored.has(node.id)
              const label = node.shortLabel || node.label
              const caption = node.caption || DEFAULT_CAPTIONS[node.id]
              const nodeImage = node.image || DEFAULT_NODE_IMAGES[node.id]
              const hasFocus = Boolean(activeId)
              const inactiveOpacity = hasFocus && !isActive ? (isViewed ? 0.68 : 0.52) : (isViewed ? 0.9 : 0.76)

              return (
                <div key={node.id} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 4 : 3 }}>
                  <div className={!isActive ? 'cm-node-float' : undefined} style={{ animationDelay: `${1.25 + i * 0.38}s` }}>
                    <motion.button onClick={() => handleNodeTap(node)} aria-label={node.label} aria-pressed={isActive} initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.45, y: prefersReduced ? 0 : 8 }} animate={{ opacity: 1, scale: isActive ? 1.045 : 1, y: 0 }} transition={nodeT(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '7px 8px', width: OUTER_NODE_SIZE, height: OUTER_NODE_SIZE, minWidth: 44, minHeight: 44, borderRadius: '50%', border: isActive ? `2px solid rgba(${rgb}, 0.9)` : isViewed ? `1.5px solid rgba(${rgb}, 0.46)` : `1.5px solid rgba(${rgb}, 0.30)`, background: isActive ? `radial-gradient(circle, rgba(${rgb},0.20) 0%, rgba(42,28,10,0.98) 58%)` : `radial-gradient(circle, rgba(${rgb},0.055) 0%, rgba(30,20,8,0.91) 62%)`, boxShadow: isActive ? `0 0 18px rgba(${rgb},0.28), inset 0 0 15px rgba(${rgb},0.08)` : 'inset 0 0 10px rgba(255,220,160,0.025)', opacity: isActive ? 1 : inactiveOpacity, cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', transition: [`border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`, `background ${MOTION.duration.fast} ${MOTION.easing.standard}`, `box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`, `opacity ${MOTION.duration.fast} ${MOTION.easing.standard}`].join(', '), position: 'relative' }} onFocus={e => { e.currentTarget.style.outline = `2px solid ${accent}`; e.currentTarget.style.outlineOffset = '3px' }} onBlur={e => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.outlineOffset = '0' }}>
                      {nodeImage && <img src={nodeImage} alt="" aria-hidden="true" style={{ width: 25, height: 25, objectFit: 'contain', opacity: isActive ? 0.9 : hasFocus ? 0.48 : 0.62, filter: 'sepia(0.3) saturate(0.85)', marginBottom: 1, borderRadius: node.id === 'galen' || node.id === 'experience' ? '50%' : 0 }} />}
                      <span style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 11.5, lineHeight: 1.12, fontWeight: 800, color: isActive ? accent : 'rgba(237,224,200,0.90)', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 68, letterSpacing: '0.01em', transition: `color ${MOTION.duration.fast}`, userSelect: 'none' }}>{label}</span>
                      {caption && <span style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 9.5, lineHeight: 1.14, fontWeight: 500, color: isActive ? 'rgba(237,224,200,0.74)' : 'rgba(237,224,200,0.50)', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 72 }}>{caption}</span>}
                      {isViewed && <span aria-hidden="true" style={{ position: 'absolute', top: 4, right: 4, width: 15, height: 15, borderRadius: '50%', background: `rgba(${rgb}, 0.88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: bg, fontWeight: 900, lineHeight: 1, zIndex: 5 }}>✓</span>}
                    </motion.button>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ margin: '10px auto 0', width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <p style={{ ...TYPE.bodySmall, color: `rgba(${rgb}, 0.76)`, margin: 0, lineHeight: 1.45, textAlign: 'center' }}>
              {instruction || 'Tap each concept to explore it.'}
            </p>
            <SequenceProgress total={nodes.length} current={currentIndex} viewed={viewedIndexes} accent={accent} accentRgb={rgb} compact ariaLabel="Connection map progress" />
          </div>

          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div key={activeId} initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: prefersReduced ? 0 : 6 }} transition={fade} style={{ marginTop: 16, background: 'rgba(20,13,5,0.97)', border: `1px solid rgba(${rgb}, 0.22)`, borderTop: `2px solid rgba(${rgb}, 0.45)`, borderRadius: RADII.large, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
                <p style={{ ...TYPE.cardTitle, margin: 0, color: '#EDE0C8', lineHeight: 1.22 }}>{activeNode.label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
                  <p style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 15, lineHeight: 1.65, fontWeight: 400, color: 'rgba(237,224,200,0.75)', margin: 0 }}>{activeNode.explanation}</p>
                  {activeNode.retrievalQuestion && <div style={{ background: `rgba(${rgb}, 0.07)`, border: `1px solid rgba(${rgb}, 0.18)`, borderRadius: RADII.small, padding: `${SPACING.micro}px ${SPACING.compact}px` }}><RetrievalQ node={activeNode} accent={accent} rgb={rgb} /></div>}
                  {activeNode.examLink && <div style={{ borderLeft: `2px solid rgba(${rgb}, 0.45)`, paddingLeft: SPACING.compact }}><p style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', margin: '0 0 4px', color: `rgba(${rgb}, 0.68)` }}>Exam link</p><p style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 13, lineHeight: 1.55, fontWeight: 500, color: 'rgba(237,224,200,0.68)', margin: 0, fontStyle: 'italic' }}>{activeNode.examLink}</p></div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {allExplored && <motion.div initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={reveal} style={{ marginTop: 16 }}><ContinueCTA onClick={onComplete} label="Continue" accent={accent} /></motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
