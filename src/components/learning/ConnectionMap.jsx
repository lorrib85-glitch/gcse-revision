import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'

const MAP_WIDTH = 326
const MAP_HEIGHT = 438
const CENTRE_NODE_SIZE = 106
const OUTER_NODE_SIZE = 86
const PANEL_DELAY_MS = 220

const POSITIONS = {
  5: [{ x: 50, y: 12 }, { x: 83, y: 33 }, { x: 70, y: 84 }, { x: 30, y: 84 }, { x: 17, y: 33 }],
  6: [{ x: 50, y: 12 }, { x: 84, y: 30 }, { x: 84, y: 70 }, { x: 50, y: 88 }, { x: 16, y: 70 }, { x: 16, y: 30 }],
  7: [{ x: 50, y: 11 }, { x: 78, y: 25 }, { x: 86, y: 53 }, { x: 66, y: 84 }, { x: 34, y: 84 }, { x: 14, y: 53 }, { x: 22, y: 25 }],
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
    const angle = (i * 360 / count - 90) * Math.PI / 180
    return { x: Math.round(50 + 34 * Math.cos(angle)), y: Math.round(50 + 38 * Math.sin(angle)) }
  })
}

function lineGeometry(pos) {
  const cx = 50
  const cy = 50
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
  const bend = index % 2 === 0 ? 1.6 : -1.6
  const cx = mx + (-dy / len) * bend
  const cy = my + (dx / len) * bend
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

function RetrievalQ({ node, accent, rgb }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={{ marginTop: 2 }}>
      <p style={{ ...TYPE.metadata, fontSize: 10, color: `rgba(${rgb}, 0.72)`, margin: '0 0 6px' }}>Quick check</p>
      <p style={{ ...TYPE.bodySmall, color: 'rgba(237,224,200,0.72)', margin: '0 0 8px', lineHeight: 1.55 }}>{node.retrievalQuestion}</p>
      {revealed ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} style={{ ...TYPE.bodySmall, color: accent, margin: 0, fontWeight: 600, lineHeight: 1.55 }}>{node.retrievalAnswer}</motion.p>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          style={{ height: BUTTONS.compact.height, background: `rgba(${rgb}, 0.10)`, border: `1px solid rgba(${rgb}, 0.28)`, borderRadius: BUTTONS.compact.borderRadius, padding: `0 ${BUTTONS.compact.paddingX}px`, color: `rgba(${rgb}, 0.9)`, cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontSize: BUTTONS.compact.fontSize, fontWeight: BUTTONS.compact.fontWeight, letterSpacing: '0.03em', transition: BUTTONS.compact.transition, WebkitTapHighlightColor: 'transparent' }}
        >Reveal answer</button>
      )}
    </div>
  )
}

export default function ConnectionMap({ block, subject = 'History', onComplete }) {
  const { centreLabel, centreImage, title, subtitle, instruction, nodes = [] } = block
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const bg = theme.background
  const prefersReduced = useReducedMotion()
  const resolvedCentreImage = centreImage || DEFAULT_CENTRE_IMAGES[subject]
  const panelTimerRef = useRef(null)
  const mapAccent = theme.accent
  const mapSecondary = theme.accentSecondary || theme.palette?.tealAccent || theme.accent
  const mapRgb = theme.accentRgb || hexToRgb(mapAccent)
  const readRgb = hexToRgb(mapSecondary)
  const warmInk = 'rgba(237,224,200,0.90)'

  const [activeId, setActiveId] = useState(null)
  const [panelId, setPanelId] = useState(null)
  const [explored, setExplored] = useState(new Set())

  const positions = resolvePositions(nodes.length)
  const allExplored = nodes.length > 0 && explored.size >= nodes.length
  const activeNode = nodes.find(n => n.id === activeId)
  const panelNode = nodes.find(n => n.id === panelId)
  const panelNodeImage = panelNode?.image || DEFAULT_NODE_IMAGES[panelNode?.id]
  const currentIndex = activeNode ? Math.max(0, nodes.findIndex(n => n.id === activeId)) : 0
  const viewedIndexes = nodes.map((node, index) => explored.has(node.id) ? index : null).filter(index => index !== null)
  const shouldScroll = Boolean(panelNode || allExplored)

  function handleNodeTap(node) {
    if (panelTimerRef.current) window.clearTimeout(panelTimerRef.current)
    setActiveId(node.id)
    setPanelId(null)
    setExplored(prev => new Set([...prev, node.id]))

    if (prefersReduced) {
      setPanelId(node.id)
      return
    }

    panelTimerRef.current = window.setTimeout(() => setPanelId(node.id), PANEL_DELAY_MS)
  }

  function handleClosePanel() {
    if (panelTimerRef.current) window.clearTimeout(panelTimerRef.current)
    setPanelId(null)
  }

  const instant = { duration: 0 }
  const fade = prefersReduced ? instant : { duration: 0.26, ease: 'easeOut' }
  const reveal = prefersReduced ? instant : { duration: 0.32, ease: 'easeOut' }
  const centreT = () => prefersReduced ? instant : { delay: 0.15, duration: 0.45, ease: 'easeOut' }
  const lineT = i => prefersReduced ? instant : {
    pathLength: { delay: 0.36 + i * 0.13, duration: 0.48, ease: 'easeOut' },
    strokeOpacity: { duration: 0.25 },
    strokeWidth: { duration: 0.18 },
  }
  const nodeIntroT = i => prefersReduced ? instant : { delay: 0.58 + i * 0.15, duration: 0.42, ease: [0.16, 1, 0.3, 1] }
  const tapT = prefersReduced ? instant : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }

  return (
    <div style={{ position: 'fixed', inset: 0, height: '100dvh', minHeight: '100dvh', background: bg, overflowX: 'hidden', overflowY: shouldScroll ? 'auto' : 'hidden', WebkitOverflowScrolling: shouldScroll ? 'touch' : 'auto' }}>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: `radial-gradient(circle at 50% 36%, rgba(${mapRgb},0.10) 0%, rgba(${mapRgb},0.035) 27%, transparent 56%), radial-gradient(circle at 50% 78%, rgba(0,0,0,0.26) 0%, transparent 42%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, height: shouldScroll ? 'auto' : '100%', minHeight: '100%', boxSizing: 'border-box', padding: `calc(78px + env(safe-area-inset-top, 0px)) 0 calc(${shouldScroll ? SPACING.standard : 8}px + env(safe-area-inset-bottom, 0px))`, maxWidth: 440, margin: '0 auto' }}>
        <div style={{ height: shouldScroll ? 'auto' : '100%', padding: `0 ${SPACING.standard}px`, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {(title || subtitle) && (
            <div style={{ marginBottom: panelNode ? 18 : 14 }}>
              {title && <h1 style={{ ...TYPE.displayScreen, margin: '0 0 8px', color: '#F5F2EA' }}>{title}</h1>}
              {subtitle && <p style={{ ...TYPE.bodySmall, margin: 0, color: 'rgba(237,224,200,0.52)', lineHeight: 1.45 }}>{subtitle}</p>}
            </div>
          )}

          <AnimatePresence mode="wait">
            {panelNode ? (
              <motion.div key="learn-state" initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: prefersReduced ? 0 : 8 }} transition={fade} style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto', minHeight: 456, borderRadius: 34, padding: 8, background: `radial-gradient(circle at 50% 100%, rgba(${mapRgb},0.12) 0%, transparent 32%), rgba(2,2,1,0.38)`, boxShadow: '0 26px 60px rgba(0,0,0,0.48)' }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 34, background: `radial-gradient(circle at 50% 44%, rgba(${mapRgb},0.10) 0%, transparent 46%)`, opacity: 0.9 }} />
                <div style={{ position: 'relative', minHeight: 440, borderRadius: 28, background: 'linear-gradient(180deg, rgba(23,16,8,0.985) 0%, rgba(12,9,5,0.978) 100%)', border: `1px solid rgba(${mapRgb}, 0.34)`, borderTop: `1.5px solid rgba(${mapRgb}, 0.62)`, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: `0 18px 42px rgba(0,0,0,0.34), 0 0 24px rgba(${mapRgb},0.08), inset 0 1px 0 rgba(${mapRgb},0.10)` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 12, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {panelNodeImage && <img src={panelNodeImage} alt="" aria-hidden="true" style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: panelNode.id === 'galen' || panelNode.id === 'experience' ? '50%' : 9, opacity: 0.72, border: `1px solid rgba(${mapRgb},0.26)`, filter: 'sepia(0.24) saturate(0.8)', flexShrink: 0 }} />}
                      <p style={{ ...TYPE.displayCard, margin: 0, color: '#EDE0C8', lineHeight: 1.18 }}>{panelNode.label}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ ...TYPE.body, fontSize: 14.5, color: 'rgba(237,224,200,0.78)', margin: 0 }}>{panelNode.explanation}</p>
                    {panelNode.retrievalQuestion && <div style={{ background: `rgba(${mapRgb}, 0.055)`, border: `1px solid rgba(${mapRgb}, 0.16)`, borderRadius: RADII.small, padding: `10px ${SPACING.compact}px` }}><RetrievalQ node={panelNode} accent={mapAccent} rgb={mapRgb} /></div>}
                    {panelNode.examLink && <div style={{ borderLeft: `2px solid rgba(${mapRgb}, 0.40)`, paddingLeft: SPACING.compact }}><p style={{ ...TYPE.metadata, fontSize: 10, margin: '0 0 4px', color: `rgba(${mapRgb}, 0.64)` }}>Exam link</p><p style={{ ...TYPE.bodySmall, fontSize: 12.5, color: 'rgba(237,224,200,0.68)', margin: 0, fontStyle: 'italic' }}>{panelNode.examLink}</p></div>}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 4 }}>
                    <SequenceProgress total={nodes.length} current={currentIndex} viewed={viewedIndexes} accent={mapAccent} accentRgb={mapRgb} compact ariaLabel="Connection map progress" />
                    <button type="button" onClick={handleClosePanel} style={{ alignSelf: 'stretch', height: BUTTONS.secondary.height, border: `1px solid rgba(${mapRgb},0.32)`, borderRadius: BUTTONS.secondary.borderRadius, background: `linear-gradient(180deg, rgba(${mapRgb},0.15), rgba(${mapRgb},0.075))`, color: '#EDE0C8', fontFamily: "'Sora', sans-serif", fontSize: BUTTONS.secondary.fontSize, fontWeight: BUTTONS.secondary.fontWeight, letterSpacing: '-0.01em', padding: `0 ${BUTTONS.secondary.paddingX}px`, cursor: 'pointer', transition: BUTTONS.secondary.transition, WebkitTapHighlightColor: 'transparent' }}>Close</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="web-state" initial={{ opacity: prefersReduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} style={{ flex: shouldScroll ? '0 0 auto' : '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: shouldScroll ? 'flex-start' : 'space-between' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: MAP_WIDTH, height: 'clamp(378px, 54dvh, 438px)', margin: '0 auto', flexShrink: 1 }}>
                  <motion.div aria-hidden="true" initial={false} animate={{ opacity: allExplored ? 1 : 0 }} transition={prefersReduced ? instant : { duration: 0.55, ease: 'easeOut' }} style={{ position: 'absolute', inset: -18, borderRadius: 42, background: `radial-gradient(circle at 50% 50%, rgba(${readRgb},0.18) 0%, rgba(${readRgb},0.08) 34%, transparent 67%)`, filter: 'blur(1px)', zIndex: 0, pointerEvents: 'none' }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: -4, borderRadius: 36, background: `radial-gradient(circle at 50% 50%, rgba(${mapRgb},0.13) 0%, rgba(${mapRgb},0.045) 32%, transparent 64%)`, filter: 'blur(0.5px)', opacity: 0.82, zIndex: 0 }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 8, borderRadius: 30, background: `linear-gradient(135deg, rgba(${mapRgb},0.04) 0 1px, transparent 1px 24px)`, opacity: 0.18, zIndex: 0 }} />

                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 1 }} aria-hidden="true">
                    {nodes.map((node, i) => {
                      const pos = node.position || positions[i] || { x: 50, y: 50 }
                      const isActive = activeId === node.id
                      const isViewed = explored.has(node.id)
                      const hasFocus = Boolean(activeId)
                      const { sx, sy } = lineGeometry(pos)
                      const jointOpacity = isActive ? 0.96 : isViewed ? 0.58 : hasFocus ? 0.18 : 0.30

                      return (
                        <g key={node.id}>
                          <motion.path d={linePath(pos, i)} stroke={isViewed && !isActive ? mapSecondary : mapAccent} fill="none" strokeLinecap="round" initial={{ pathLength: prefersReduced ? 1 : 0, strokeWidth: 0.8, strokeOpacity: 0 }} animate={{ pathLength: 1, strokeWidth: isActive ? 1.25 : isViewed ? 0.92 : 0.82, strokeOpacity: isActive ? 0.68 : isViewed ? 0.42 : hasFocus ? 0.10 : 0.18 }} transition={lineT(i)} style={{ filter: isActive ? `drop-shadow(0 0 2px rgba(${mapRgb}, 0.46))` : isViewed ? `drop-shadow(0 0 2.5px rgba(${readRgb},0.24))` : 'none' }} />
                          <motion.circle cx={sx} cy={sy} r={isActive ? 1.28 : isViewed ? 0.96 : 0.76} fill={isViewed && !isActive ? mapSecondary : mapAccent} initial={{ opacity: prefersReduced ? 0.55 : 0 }} animate={{ opacity: jointOpacity }} transition={lineT(i)} style={{ filter: isActive ? `drop-shadow(0 0 4px rgba(${mapRgb},0.68))` : isViewed ? `drop-shadow(0 0 4px rgba(${readRgb},0.38))` : `drop-shadow(0 0 1.5px rgba(${mapRgb},0.22))` }} />
                        </g>
                      )
                    })}
                  </svg>

                  <div style={{ position: 'absolute', left: '50%', top: '50%', width: CENTRE_NODE_SIZE, height: CENTRE_NODE_SIZE, transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                    <motion.div role="img" aria-label={centreLabel} style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle, rgba(${mapRgb},0.16) 0%, rgba(38,27,13,0.90) 52%, rgba(12,9,5,0.98) 100%)`, border: `1.5px solid rgba(${mapRgb}, 0.72)`, boxShadow: allExplored ? `inset 0 0 18px rgba(${mapRgb},0.12), 0 0 16px rgba(${readRgb},0.26), 0 0 3px rgba(${readRgb},0.84)` : `inset 0 0 18px rgba(${mapRgb},0.12), 0 0 13px rgba(${mapRgb},0.22), 0 0 2px rgba(${mapRgb},0.80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, textAlign: 'center', overflow: 'hidden', position: 'relative' }} initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={centreT()}>
                      <span aria-hidden="true" style={{ position: 'absolute', inset: 5, borderRadius: '50%', border: `1px solid rgba(${mapRgb},0.24)`, boxShadow: `inset 0 0 9px rgba(${mapRgb},0.10)` }} />
                      <span aria-hidden="true" style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: `1px solid rgba(${allExplored ? readRgb : mapRgb},${allExplored ? 0.20 : 0.10})`, opacity: allExplored ? 1 : 0.7 }} />
                      {resolvedCentreImage && <img src={resolvedCentreImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', objectFit: 'cover', opacity: 0.20, filter: 'grayscale(0.28) sepia(0.30) contrast(0.92)' }} />}
                      <span style={{ fontFamily: "'Manrope', sans-serif", color: warmInk, fontSize: 12, lineHeight: 1.13, fontWeight: 750, letterSpacing: '-0.02em', maxWidth: 72, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', position: 'relative', zIndex: 1, textShadow: '0 1px 8px rgba(0,0,0,0.72)' }}>{centreLabel}</span>
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
                    const inactiveOpacity = hasFocus && !isActive ? (isViewed ? 0.76 : 0.42) : (isViewed ? 0.96 : 0.72)
                    const nodeRgb = isViewed && !isActive ? readRgb : mapRgb
                    const nodeAccent = isViewed && !isActive ? mapSecondary : mapAccent

                    return (
                      <div key={node.id} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 4 : 3 }}>
                        <motion.button type="button" onClick={() => handleNodeTap(node)} aria-label={node.label} aria-pressed={isActive} initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.45, y: prefersReduced ? 0 : 8 }} animate={{ opacity: 1, scale: isActive && !panelNode ? [1, 1.045, 1] : isActive ? 1.025 : 1, y: isActive && !panelNode ? [0, -2, 0] : 0 }} transition={isActive && !panelNode ? tapT : nodeIntroT(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '7px 8px', width: OUTER_NODE_SIZE, height: OUTER_NODE_SIZE, minWidth: 44, minHeight: 44, borderRadius: '50%', border: isActive ? `1.75px solid rgba(${mapRgb}, 0.90)` : isViewed ? `1.45px solid rgba(${readRgb}, 0.72)` : `1.25px solid rgba(${mapRgb}, 0.28)`, background: isActive ? `radial-gradient(circle, rgba(${mapRgb},0.12) 0%, rgba(35,25,12,0.96) 58%, rgba(12,9,5,0.98) 100%)` : isViewed ? `radial-gradient(circle, rgba(${readRgb},0.105) 0%, rgba(24,18,9,0.92) 64%, rgba(10,8,5,0.96) 100%)` : `radial-gradient(circle, rgba(${mapRgb},0.040) 0%, rgba(24,18,9,0.90) 64%, rgba(10,8,5,0.96) 100%)`, boxShadow: isActive ? `0 0 11px rgba(${mapRgb},0.22), 0 0 2px rgba(${mapRgb},0.78), inset 0 0 12px rgba(${mapRgb},0.055)` : isViewed ? `0 0 9px rgba(${readRgb},0.18), 0 0 2px rgba(${readRgb},0.46), inset 0 0 10px rgba(${readRgb},0.045)` : 'inset 0 0 8px rgba(255,220,160,0.015)', opacity: isActive ? 1 : inactiveOpacity, cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', transition: [`border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`, `background ${MOTION.duration.fast} ${MOTION.easing.standard}`, `box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`, `opacity ${MOTION.duration.fast} ${MOTION.easing.standard}`].join(', '), position: 'relative' }} onFocus={e => { e.currentTarget.style.outline = `2px solid ${mapAccent}`; e.currentTarget.style.outlineOffset = '3px' }} onBlur={e => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.outlineOffset = '0' }}>
                          <span aria-hidden="true" style={{ position: 'absolute', inset: 5, borderRadius: '50%', border: `1px solid rgba(${nodeRgb},${isActive ? 0.18 : isViewed ? 0.22 : 0.10})`, opacity: isActive ? 1 : 0.84 }} />
                          {nodeImage && <img src={nodeImage} alt="" aria-hidden="true" style={{ width: 21, height: 21, objectFit: 'contain', opacity: isActive ? 0.70 : hasFocus ? (isViewed ? 0.50 : 0.32) : (isViewed ? 0.60 : 0.44), filter: 'grayscale(0.12) sepia(0.38) saturate(0.72) contrast(0.92)', marginBottom: 1, borderRadius: node.id === 'galen' || node.id === 'experience' ? '50%' : 0 }} />}
                          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11.2, lineHeight: 1.1, fontWeight: 750, color: isActive ? mapAccent : isViewed ? nodeAccent : warmInk, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 66, letterSpacing: '-0.015em', transition: `color ${MOTION.duration.fast}`, userSelect: 'none', position: 'relative', zIndex: 1 }}>{label}</span>
                          {caption && <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 9.1, lineHeight: 1.14, fontWeight: 500, color: isActive ? 'rgba(237,224,200,0.68)' : isViewed ? 'rgba(237,224,200,0.60)' : 'rgba(237,224,200,0.46)', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 70, position: 'relative', zIndex: 1 }}>{caption}</span>}
                        </motion.button>
                      </div>
                    )
                  })}
                </div>

                <div style={{ margin: '2px auto 0', width: '100%', maxWidth: 306, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <p style={{ ...TYPE.bodySmall, color: `rgba(${mapRgb}, 0.58)`, margin: 0, lineHeight: 1.45, textAlign: 'center' }}>{instruction || 'Tap each concept to explore it.'}</p>
                  <SequenceProgress total={nodes.length} current={currentIndex} viewed={viewedIndexes} accent={mapAccent} accentRgb={mapRgb} compact ariaLabel="Connection map progress" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {allExplored && !panelNode && <motion.div initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={reveal} style={{ marginTop: 16 }}><ContinueCTA onClick={onComplete} label="Continue" accent={mapAccent} /></motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
