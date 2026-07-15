import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { RADII } from '../../constants/radii.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { useInlineNavigationOwner } from '../core/InlineNavigationContext.jsx'
import { deriveOppositeRevealState, getOppositeRevealDurations } from './oppositeQualitiesReveal.js'
import { resolveOppositeRevealVisuals } from './oppositeQualitiesRevealTheme.js'

let styled = false
function ensureStyles() {
  if (styled || typeof document === 'undefined') return
  styled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes oqr-item-settle {
      from { opacity: 0; transform: translateY(var(--oqr-lift)); filter: blur(2px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes oqr-active-left {
      0% { opacity: 0; transform: translateX(0) scale(0.96); }
      18% { opacity: 1; transform: translateX(0) scale(1); }
      46% { opacity: 1; transform: translateX(0) scale(1); }
      88% { opacity: 1; transform: translateX(-34%) scale(1); }
      100% { opacity: 0; transform: translateX(-36%) scale(0.98); }
    }
    @keyframes oqr-active-right {
      0% { opacity: 0; transform: translateX(0) scale(0.96); }
      18% { opacity: 1; transform: translateX(0) scale(1); }
      46% { opacity: 1; transform: translateX(0) scale(1); }
      88% { opacity: 1; transform: translateX(34%) scale(1); }
      100% { opacity: 0; transform: translateX(36%) scale(0.98); }
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

function ConceptColumn({
  concept = {},
  items,
  side,
  accent,
  textColor,
  labelShadow,
  itemShadow,
  ariaLabel,
}) {
  const isRight = side === 'right'

  return (
    <section
      aria-label={ariaLabel || concept.label}
      data-opposite-side={side}
      style={{ minWidth: 0, textAlign: isRight ? 'right' : 'left' }}
    >
      <div style={{ marginBottom: SPACING.standard }}>
        <div
          aria-hidden="true"
          style={{
            ...TYPE.displayCard,
            color: accent,
            textShadow: labelShadow,
          }}
        >
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
        gap: SPACING.compact,
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
            <span style={{
              ...TYPE.bodyStrong,
              display: 'block',
              color: textColor,
              textShadow: itemShadow,
            }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CinematicStageBackground({ block, visuals }) {
  return (
    <div
      aria-hidden="true"
      data-opposite-reveal-backdrop="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: visuals.background,
        pointerEvents: 'none',
      }}
    >
      {block.backgroundImage && (
        <img
          src={block.backgroundImage}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: block.backgroundPosition || 'center',
            opacity: block.backgroundOpacity ?? 0.82,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: visuals.backdropOverlay,
        }}
      />
    </div>
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
  const visuals = resolveOppositeRevealVisuals(block, theme)
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
    <div
      data-opposite-reveal-intent="guided-contrast"
      data-opposite-visual-pair={visuals.pairId}
    >
      <div
        data-opposite-reveal-stage="true"
        aria-label={block.accessibility?.label || block.title}
        style={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          borderRadius: RADII.large,
          background: visuals.background,
          border: `1px solid ${visuals.stageBorder}`,
        }}
      >
        <CinematicStageBackground block={block} visuals={visuals} />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '48svh',
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${SPACING.compact}px ${SPACING.compact}px`,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: SPACING.separation,
            paddingTop: SPACING.standard,
          }}>
            <ConceptColumn
              concept={block.leftConcept}
              items={view.leftItems}
              side="left"
              accent={visuals.leftAccent}
              textColor={visuals.settledText}
              labelShadow={visuals.labelShadow}
              itemShadow={visuals.settledTextShadow}
              ariaLabel={block.accessibility?.leftLabel}
            />
            <ConceptColumn
              concept={block.rightConcept}
              items={view.rightItems}
              side="right"
              accent={visuals.rightAccent}
              textColor={visuals.settledText}
              labelShadow={visuals.labelShadow}
              itemShadow={visuals.settledTextShadow}
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
                left: '14%',
                right: '14%',
                top: '46%',
                animation: activeAnimation,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <div style={{
                ...TYPE.displayCard,
                color: visuals.foreground,
                textAlign: 'center',
                textShadow: visuals.activeTextShadow,
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
                color: visuals.foreground,
                textAlign: 'center',
                textShadow: visuals.captionShadow,
                margin: 0,
                padding: `${SPACING.compact}px 0 0`,
                borderTop: `1px solid ${visuals.captionDivider}`,
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
          accent={visuals.sharedAccent}
          style={{ marginTop: SPACING.standard }}
        />
      )}
    </div>
  )
}
