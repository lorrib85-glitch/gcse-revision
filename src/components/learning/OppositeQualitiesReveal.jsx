import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { CINEMATIC_LAB } from '../../constants/cinematicLabTheme.js'
import { deriveOppositeRevealState, getOppositeRevealDurations } from './oppositeQualitiesReveal.js'

let styled = false
function ensureStyles() {
  if (styled || typeof document === 'undefined') return
  styled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes oqr-card-in {
      from { opacity: 0; transform: translateY(var(--oqr-lift)); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes oqr-active-left {
      0% { opacity: 0; transform: translateX(0) scale(0.985); filter: blur(0); }
      24% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      72% { opacity: 1; transform: translateX(-42%) scale(1); filter: blur(1px); }
      100% { opacity: 0; transform: translateX(-46%) scale(0.985); filter: blur(2px); }
    }
    @keyframes oqr-active-right {
      0% { opacity: 0; transform: translateX(0) scale(0.985); filter: blur(0); }
      24% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      72% { opacity: 1; transform: translateX(42%) scale(1); filter: blur(1px); }
      100% { opacity: 0; transform: translateX(46%) scale(0.985); filter: blur(2px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .oqr-motion { animation: none !important; transition: none !important; }
      .oqr-active { display: none !important; }
    }
  `
  document.head.appendChild(el)
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ConceptColumn({ concept = {}, items, side, accent, rgb, ariaLabel }) {
  return (
    <section aria-label={ariaLabel || concept.label} style={{ minWidth: 0 }}>
      <div style={{ textAlign: side === 'right' ? 'right' : 'left', marginBottom: SPACING.compact }}>
        <div aria-hidden="true" style={{ ...TYPE.displayCard, color: accent, marginBottom: SPACING.micro }}>
          {concept.icon ? <span style={{ marginRight: side === 'right' ? 0 : SPACING.micro, marginLeft: side === 'right' ? SPACING.micro : 0 }}>{concept.icon}</span> : null}
          {concept.label}
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: SPACING.compact }}>
        {items.map(item => (
          <li key={item} className="oqr-motion" style={{ '--oqr-lift': `${SPACING.micro}px`, animation: `oqr-card-in ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.micro,
              minHeight: 'var(--touch-target-min, 44px)',
              padding: `${SPACING.micro}px ${SPACING.compact}px`,
              borderRadius: RADII.medium,
              border: `1px solid rgba(${rgb},0.28)`,
              background: `linear-gradient(135deg, rgba(${rgb},0.13), rgba(255,255,255,0.03))`,
              color: CINEMATIC_LAB.creamText,
              boxShadow: `0 0 ${SPACING.compact}px rgba(${rgb},0.08)`,
            }}>
              {concept.icon ? <span aria-hidden="true" style={{ opacity: 0.78 }}>{concept.icon}</span> : null}
              <span style={{ ...TYPE.bodyLarge }}>{item}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function OppositeQualitiesReveal({ block = {}, subject = 'History', reducedMotion: reducedMotionOverride }) {
  ensureStyles()
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = block.theme?.accent || theme.accent
  const rgb = block.theme?.accentRgb || theme.accentRgb || '245,183,0'
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion()
  const timings = useMemo(() => getOppositeRevealDurations(block.timings), [block.timings])
  const sequence = useMemo(() => deriveOppositeRevealState(block, { reducedMotion: true }).sequence, [block])
  const [settledCount, setSettledCount] = useState(reducedMotion ? sequence.length : 0)
  const [activeIndex, setActiveIndex] = useState(reducedMotion ? -1 : 0)

  useEffect(() => {
    if (reducedMotion) {
      setSettledCount(sequence.length)
      setActiveIndex(-1)
      return undefined
    }
    setSettledCount(0)
    setActiveIndex(0)
  }, [reducedMotion, sequence.length])

  useEffect(() => {
    if (reducedMotion || activeIndex < 0 || activeIndex >= sequence.length) return undefined
    const timer = setTimeout(() => {
      setSettledCount(count => Math.max(count, activeIndex + 1))
      setActiveIndex(index => index + 1)
    }, timings.nextDelay)
    return () => clearTimeout(timer)
  }, [activeIndex, reducedMotion, sequence.length, timings.nextDelay])

  const view = deriveOppositeRevealState(block, { settledCount, activeIndex, reducedMotion })
  const activeAnimation = view.active ? `oqr-active-${view.active.direction} ${timings.nextDelay}ms ${MOTION.easing.standard} both` : 'none'

  return (
    <div
      aria-label={block.accessibility?.label || block.title}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: RADII.panel,
        padding: SPACING.compact,
        background: block.backgroundImage
          ? `linear-gradient(rgba(9,7,10,0.72), rgba(9,7,10,0.88)), url(${block.backgroundImage}) center / cover`
          : `radial-gradient(circle at 50% 42%, rgba(${rgb},0.10), transparent 48%), ${CINEMATIC_LAB.background}`,
        border: `1px solid rgba(${rgb},0.24)`,
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(${rgb},0.10), transparent 34%, transparent 66%, rgba(255,255,255,0.035))`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: SPACING.compact, paddingTop: SPACING.separation, paddingBottom: SPACING.separation }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `linear-gradient(transparent, rgba(${rgb},0.56), transparent)`, transform: 'translateX(-50%)' }} />
        <ConceptColumn concept={block.leftConcept} items={view.leftItems} side="left" accent={accent} rgb={rgb} ariaLabel={block.accessibility?.leftLabel} />
        <ConceptColumn concept={block.rightConcept} items={view.rightItems} side="right" accent={accent} rgb={rgb} ariaLabel={block.accessibility?.rightLabel} />
        {view.active && (
          <div className="oqr-active oqr-motion" aria-hidden="true" style={{ position: 'absolute', left: '22%', right: '22%', top: '44%', animation: activeAnimation, pointerEvents: 'none' }}>
            <div style={{ textAlign: 'center', padding: `${SPACING.compact}px ${SPACING.standard}px`, borderRadius: RADII.medium, border: `1px solid rgba(${rgb},0.72)`, color: CINEMATIC_LAB.creamText, background: `linear-gradient(135deg, rgba(${rgb},0.18), rgba(9,7,10,0.92))`, boxShadow: `0 0 ${SPACING.separation}px rgba(${rgb},0.28)`, ...TYPE.displayCard }}>
              {view.active.item}
            </div>
          </div>
        )}
      </div>
      {block.closingCaption && (
        <p style={{ ...TYPE.bodyLarge, color: CINEMATIC_LAB.creamText, margin: 0, padding: SPACING.compact, borderRadius: RADII.large, border: `1px solid rgba(${rgb},0.22)`, background: 'rgba(0,0,0,0.34)' }}>
          {block.closingCaption}
        </p>
      )}
    </div>
  )
}
