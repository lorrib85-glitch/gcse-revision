import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { CINEMATIC_LAB } from '../../constants/cinematicLabTheme.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { useInlineNavigationOwner } from '../core/InlineNavigationContext.jsx'
import { deriveOppositeRevealState, getOppositeRevealDurations } from './oppositeQualitiesReveal.js'

let styled = false
function ensureStyles() {
  if (styled || typeof document === 'undefined') return
  styled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes oqr-item-settle {
      from { opacity: 0; transform: translateY(var(--oqr-lift)); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes oqr-active-left {
      0% { opacity: 0; transform: translateX(0) scale(0.98); }
      18% { opacity: 1; transform: translateX(0) scale(1); }
      40% { opacity: 1; transform: translateX(0) scale(1); }
      84% { opacity: 1; transform: translateX(-46%) scale(1); }
      100% { opacity: 0; transform: translateX(-49%) scale(0.98); }
    }
    @keyframes oqr-active-right {
      0% { opacity: 0; transform: translateX(0) scale(0.98); }
      18% { opacity: 1; transform: translateX(0) scale(1); }
      40% { opacity: 1; transform: translateX(0) scale(1); }
      84% { opacity: 1; transform: translateX(46%) scale(1); }
      100% { opacity: 0; transform: translateX(49%) scale(0.98); }
    }
    @keyframes oqr-caption-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
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
  const isRight = side === 'right'

  return (
    <section aria-label={ariaLabel || concept.label} style={{ minWidth: 0 }}>
      <div style={{ textAlign: isRight ? 'right' : 'left', marginBottom: SPACING.standard }}>
        <div aria-hidden="true" style={{ ...TYPE.displayCard, color: accent }}>
          {concept.icon ? (
            <span style={{
              marginRight: isRight ? 0 : SPACING.micro,
              marginLeft: isRight ? SPACING.micro : 0,
            }}>
              {concept.icon}
            </span>
          ) : null}
          {concept.label}
        </div>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: SPACING.micro,
      }}>
        {items.map(item => (
          <li
            key={item}
            className="oqr-motion"
            style={{
              '--oqr-lift': `${SPACING.micro}px`,
              animation: `oqr-item-settle ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: isRight ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: isRight ? 'flex-start' : 'flex-start',
              gap: SPACING.micro,
              padding: `${SPACING.micro}px 0`,
              borderBottom: `1px solid rgba(${rgb},0.20)`,
              color: CINEMATIC_LAB.creamText,
              textAlign: isRight ? 'right' : 'left',
            }}>
              {concept.icon ? (
                <span aria-hidden="true" style={{ opacity: 0.58, flexShrink: 0 }}>
                  {concept.icon}
                </span>
              ) : null}
              <span style={{ ...TYPE.bodyStrong }}>{item}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function OppositeQualitiesReveal({
  block = {},
  subject = 'History',
  reducedMotion: reducedMotionOverride,
  onComplete,
}) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = block.theme?.accent || theme.accent
  const rgb = block.theme?.accentRgb || theme.accentRgb || '245,183,0'
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion()
  const timings = useMemo(() => getOppositeRevealDurations(block.timings), [block.timings])
  const sequence = useMemo(
    () => deriveOppositeRevealState(block, { reducedMotion: true }).sequence,
    [block],
  )
  const [settledCount, setSettledCount] = useState(reducedMotion ? sequence.length : 0)
  const [activeIndex, setActiveIndex] = useState(reducedMotion ? -1 : 0)
  const continueModule = useInlineNavigationOwner(true)

  useEffect(() => {
    if (reducedMotion) {
      setSettledCount(sequence.length)
      setActiveIndex(-1)
      return undefined
    }

    setSettledCount(0)
    setActiveIndex(0)
    return undefined
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
  const activeAnimation = view.active
    ? `oqr-active-${view.active.direction} ${timings.nextDelay}ms ${MOTION.easing.standard} both`
    : 'none'
  const finishScreen = onComplete || continueModule

  return (
    <div>
      <div
        aria-label={block.accessibility?.label || block.title}
        style={{
          position: 'relative',
          minHeight: 430,
          overflow: 'hidden',
          borderRadius: RADII.panel,
          border: `1px solid rgba(${rgb},0.28)`,
          background: CINEMATIC_LAB.background,
          boxShadow: `0 ${SPACING.micro}px ${SPACING.separation}px rgba(0,0,0,0.28)`,
        }}
      >
        {block.backgroundImage && (
          <img
            src={block.backgroundImage}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: block.backgroundPosition || 'center',
              opacity: block.backgroundOpacity ?? 0.78,
              filter: 'saturate(0.92) contrast(1.04)',
            }}
          />
        )}

        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(180deg, rgba(7,6,8,0.18) 0%, rgba(7,6,8,0.34) 46%, rgba(7,6,8,0.78) 100%)',
            `radial-gradient(circle at 50% 44%, rgba(${rgb},0.04), rgba(7,6,8,0.30) 72%)`,
          ].join(', '),
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          minHeight: 430,
          display: 'flex',
          flexDirection: 'column',
          padding: `${SPACING.separation}px ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: SPACING.separation,
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: 1,
              background: `linear-gradient(transparent, rgba(${rgb},0.48), transparent)`,
              transform: 'translateX(-50%)',
            }} />

            <ConceptColumn
              concept={block.leftConcept}
              items={view.leftItems}
              side="left"
              accent={accent}
              rgb={rgb}
              ariaLabel={block.accessibility?.leftLabel}
            />
            <ConceptColumn
              concept={block.rightConcept}
              items={view.rightItems}
              side="right"
              accent={accent}
              rgb={rgb}
              ariaLabel={block.accessibility?.rightLabel}
            />
          </div>

          <div style={{ flex: 1, minHeight: SPACING.cinematic }} />

          {view.active && (
            <div
              key={view.active.id}
              className="oqr-active oqr-motion"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '22%',
                right: '22%',
                top: '44%',
                animation: activeAnimation,
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              <div style={{
                textAlign: 'center',
                padding: `${SPACING.compact}px ${SPACING.standard}px`,
                borderRadius: RADII.medium,
                border: `1px solid rgba(${rgb},0.68)`,
                color: CINEMATIC_LAB.creamText,
                background: `linear-gradient(135deg, rgba(${rgb},0.22), rgba(9,7,10,0.90))`,
                boxShadow: `0 0 ${SPACING.separation}px rgba(${rgb},0.26)`,
                ...TYPE.displayCard,
              }}>
                {view.active.item}
              </div>
            </div>
          )}

          {view.complete && block.closingCaption && (
            <p
              className="oqr-motion"
              style={{
                ...TYPE.bodyLarge,
                color: CINEMATIC_LAB.creamText,
                margin: 0,
                padding: SPACING.compact,
                borderRadius: RADII.large,
                border: `1px solid rgba(${rgb},0.24)`,
                background: 'rgba(0,0,0,0.48)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                animation: `oqr-caption-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
              }}
            >
              {block.closingCaption}
            </p>
          )}
        </div>
      </div>

      {view.complete && finishScreen && (
        <ContinueCTA
          onClick={finishScreen}
          accent={accent}
          style={{ marginTop: SPACING.standard }}
        />
      )}
    </div>
  )
}
