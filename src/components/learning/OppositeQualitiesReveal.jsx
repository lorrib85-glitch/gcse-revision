import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
    @keyframes oqr-item-settle-left {
      from { opacity: 0; transform: translateX(18px) scale(0.98); filter: blur(2px); }
      to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
    }
    @keyframes oqr-item-settle-right {
      from { opacity: 0; transform: translateX(-18px) scale(0.98); filter: blur(2px); }
      to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
    }
    @keyframes oqr-item-land {
      0% { text-shadow: none; }
      42% { text-shadow: var(--oqr-landing-shadow); }
      100% { text-shadow: none; }
    }
    @keyframes oqr-active-left {
      0% { opacity: 0; transform: translateX(0) scale(0.94); filter: blur(3px); }
      16% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      48% { opacity: 1; transform: translateX(0) scale(1); }
      88% { opacity: 1; transform: translateX(-39%) scale(0.96); }
      100% { opacity: 0; transform: translateX(-42%) scale(0.94); }
    }
    @keyframes oqr-active-right {
      0% { opacity: 0; transform: translateX(0) scale(0.94); filter: blur(3px); }
      16% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      48% { opacity: 1; transform: translateX(0) scale(1); }
      88% { opacity: 1; transform: translateX(39%) scale(0.96); }
      100% { opacity: 0; transform: translateX(42%) scale(0.94); }
    }
    @keyframes oqr-caption-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .oqr-zone {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 54%;
      opacity: 0.72;
      transform: scale(1);
      transition: opacity 280ms ease, transform 340ms ease, background 280ms ease;
      pointer-events: none;
    }
    .oqr-zone--left {
      left: 0;
      transform-origin: left center;
      background: var(--oqr-zone-idle);
    }
    .oqr-zone--right {
      right: 0;
      transform-origin: right center;
      background: var(--oqr-zone-idle);
    }
    .oqr-zone--centre {
      left: 29%;
      width: 42%;
      opacity: 1;
      background: var(--oqr-centre-zone);
      border-left: 1px solid var(--oqr-centre-line);
      border-right: 1px solid var(--oqr-centre-line);
    }
    .oqr-stage[data-active-side="left"] .oqr-zone--left,
    .oqr-stage[data-active-side="right"] .oqr-zone--right {
      opacity: 1;
      transform: scale(1.045);
      background: var(--oqr-zone-active);
    }
    .oqr-stage[data-active-side="left"] .oqr-zone--right,
    .oqr-stage[data-active-side="right"] .oqr-zone--left {
      opacity: 0.38;
      transform: scale(0.985);
    }
    .oqr-concept-column {
      position: relative;
      z-index: 2;
      transition: opacity 240ms ease, transform 280ms ease, filter 240ms ease;
    }
    .oqr-concept-label {
      display: inline-flex;
      align-items: center;
      gap: var(--oqr-label-gap);
      transition: transform 280ms ease, filter 280ms ease;
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="left"],
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="right"] {
      opacity: 1;
      transform: translateY(-2px) scale(1.018);
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="right"],
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="left"] {
      opacity: 0.56;
      transform: scale(0.985);
      filter: saturate(0.72);
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="left"] .oqr-concept-label,
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="right"] .oqr-concept-label {
      transform: scale(1.055);
      filter: drop-shadow(0 0 8px var(--oqr-destination-glow));
    }
    .oqr-settled-item--left {
      animation: oqr-item-settle-left var(--oqr-settle-duration) var(--oqr-easing) both;
    }
    .oqr-settled-item--right {
      animation: oqr-item-settle-right var(--oqr-settle-duration) var(--oqr-easing) both;
    }
    .oqr-settled-item--latest > span {
      animation: oqr-item-land 620ms ease-out both;
    }
    .oqr-active-word {
      transform-origin: center;
      will-change: transform, opacity, filter;
    }
    @media (prefers-reduced-motion: reduce) {
      .oqr-motion { animation: none !important; transition: none !important; }
      .oqr-active { display: none !important; }
      .oqr-zone,
      .oqr-concept-column,
      .oqr-concept-label { transition: none !important; }
    }
  `
  document.head.appendChild(el)
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function normaliseIcon(icon) {
  const aliases = {
    '☀': 'heat',
    '☀️': 'heat',
    '❄': 'cold',
    '❄️': 'cold',
    '💧': 'wet',
    '✦': 'dry',
  }
  return aliases[icon] || icon
}

function ConceptIcon({ icon }) {
  const key = normaliseIcon(icon)
  if (!key) return null

  if (key === 'heat') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
      </svg>
    )
  }

  if (key === 'cold') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round">
        <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M8.8 4.4L12 7.2l3.2-2.8M8.8 19.6L12 16.8l3.2 2.8M4.3 11.2l4.1-1.1-1-4.1M19.7 12.8l-4.1 1.1 1 4.1" />
      </svg>
    )
  }

  if (key === 'wet') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.8S6.2 9.2 6.2 14.1A5.8 5.8 0 0 0 17.8 14c0-4.8-5.8-11.2-5.8-11.2Z" />
        <path d="M9.1 15.1c.4 1.4 1.4 2.1 2.9 2.1" />
      </svg>
    )
  }

  if (key === 'dry') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17.5h18M5 13.5h14M8.5 17.5l2-4 2 4 2-4 2 4" />
        <path d="M7 6.5h10M9 3.5h6" />
      </svg>
    )
  }

  return <span aria-hidden="true">{icon}</span>
}

function ConceptColumn({
  concept = {},
  items,
  side,
  accent,
  accentRgb,
  textColor,
  labelShadow,
  itemShadow,
  latestItem,
  ariaLabel,
}) {
  const isRight = side === 'right'

  return (
    <section
      className="oqr-concept-column"
      aria-label={ariaLabel || concept.label}
      data-opposite-side={side}
      style={{
        minWidth: 0,
        textAlign: isRight ? 'right' : 'left',
        gridColumn: isRight ? 3 : 1,
        '--oqr-destination-glow': `rgba(${accentRgb},0.52)`,
      }}
    >
      <div style={{ marginBottom: SPACING.standard }}>
        <div
          className="oqr-concept-label"
          aria-hidden="true"
          style={{
            ...TYPE.displayCard,
            color: accent,
            textShadow: labelShadow,
            flexDirection: isRight ? 'row-reverse' : 'row',
            '--oqr-label-gap': `${SPACING.micro}px`,
          }}
        >
          <ConceptIcon icon={concept.icon} />
          <span>{concept.label}</span>
        </div>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: SPACING.compact,
      }}>
        {items.map(item => {
          const isLatest = item === latestItem
          return (
            <li
              key={item}
              className={`oqr-motion oqr-settled-item oqr-settled-item--${side}${isLatest ? ' oqr-settled-item--latest' : ''}`}
              style={{
                '--oqr-settle-duration': MOTION.duration.standard,
                '--oqr-easing': MOTION.easing.standard,
                '--oqr-landing-shadow': side === 'left'
                  ? 'var(--oqr-left-landing-shadow)'
                  : 'var(--oqr-right-landing-shadow)',
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
          )
        })}
      </ul>
    </section>
  )
}

function BackdropImage({ block, visuals, fullScreen = false }) {
  return (
    <div
      aria-hidden="true"
      data-opposite-reveal-screen-backdrop={fullScreen || undefined}
      data-opposite-reveal-backdrop={!fullScreen || undefined}
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
            opacity: block.backgroundOpacity ?? 0.88,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: fullScreen ? visuals.fullScreenOverlay : visuals.stageOverlay,
        }}
      />
    </div>
  )
}

function CinematicZones({ visuals }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <div
        className="oqr-zone oqr-zone--left"
        style={{
          '--oqr-zone-idle': visuals.leftZoneIdle,
          '--oqr-zone-active': visuals.leftZoneActive,
        }}
      />
      <div
        className="oqr-zone oqr-zone--centre"
        style={{
          '--oqr-centre-zone': visuals.centreZone,
          '--oqr-centre-line': visuals.centreLine,
        }}
      />
      <div
        className="oqr-zone oqr-zone--right"
        style={{
          '--oqr-zone-idle': visuals.rightZoneIdle,
          '--oqr-zone-active': visuals.rightZoneActive,
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

  const rootRef = useRef(null)
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
  const [screenBackdropHost, setScreenBackdropHost] = useState(null)
  const continueModule = useInlineNavigationOwner(true)

  useEffect(() => {
    if (block.backgroundMode !== 'screen') {
      setScreenBackdropHost(null)
      return undefined
    }

    const host = rootRef.current?.closest('.cs-shell') || null
    setScreenBackdropHost(host)
    return undefined
  }, [block.backgroundMode, block.backgroundImage])

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
  const activeSide = view.active?.side || 'none'
  const latestStep = settledCount > 0 ? sequence[settledCount - 1] : null
  const activeAnimation = view.active
    ? `oqr-active-${view.active.direction} ${timings.nextDelay}ms ${MOTION.easing.standard} both`
    : 'none'
  const activeTextShadow = view.active?.side === 'right'
    ? visuals.rightActiveTextShadow
    : visuals.leftActiveTextShadow
  const finishScreen = onComplete || continueModule
  const usesScreenBackdrop = Boolean(screenBackdropHost && block.backgroundMode === 'screen')

  return (
    <div
      ref={rootRef}
      data-opposite-reveal-intent="guided-contrast"
      data-opposite-visual-pair={visuals.pairId}
      data-opposite-background-mode={usesScreenBackdrop ? 'screen' : 'stage'}
      style={{
        '--oqr-left-landing-shadow': visuals.leftLandingShadow,
        '--oqr-right-landing-shadow': visuals.rightLandingShadow,
      }}
    >
      {usesScreenBackdrop && createPortal(
        <BackdropImage block={block} visuals={visuals} fullScreen />,
        screenBackdropHost,
      )}

      <div
        className="oqr-stage"
        data-opposite-reveal-stage="true"
        data-active-side={activeSide}
        aria-label={block.accessibility?.label || block.title}
        style={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          borderRadius: usesScreenBackdrop ? 0 : RADII.large,
          background: usesScreenBackdrop ? visuals.stageSurface : visuals.background,
          border: usesScreenBackdrop ? 'none' : `1px solid ${visuals.stageBorder}`,
        }}
      >
        {!usesScreenBackdrop && <BackdropImage block={block} visuals={visuals} />}
        {usesScreenBackdrop && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: visuals.stageOverlay,
              pointerEvents: 'none',
            }}
          />
        )}
        <CinematicZones visuals={visuals} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '52svh',
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${SPACING.compact}px ${SPACING.compact}px`,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(52px,0.42fr) minmax(0,1fr)',
            gap: SPACING.compact,
            paddingTop: SPACING.standard,
          }}>
            <ConceptColumn
              concept={block.leftConcept}
              items={view.leftItems}
              side="left"
              accent={visuals.leftAccent}
              accentRgb={visuals.leftRgb}
              textColor={visuals.settledText}
              labelShadow={visuals.labelShadow}
              itemShadow={visuals.settledTextShadow}
              latestItem={latestStep?.side === 'left' ? latestStep.item : null}
              ariaLabel={block.accessibility?.leftLabel}
            />
            <ConceptColumn
              concept={block.rightConcept}
              items={view.rightItems}
              side="right"
              accent={visuals.rightAccent}
              accentRgb={visuals.rightRgb}
              textColor={visuals.settledText}
              labelShadow={visuals.labelShadow}
              itemShadow={visuals.settledTextShadow}
              latestItem={latestStep?.side === 'right' ? latestStep.item : null}
              ariaLabel={block.accessibility?.rightLabel}
            />
          </div>

          <div style={{ flex: 1, minHeight: SPACING.cinematic }} />

          {view.active && (
            <div
              key={view.active.id}
              className="oqr-active oqr-motion oqr-active-word"
              data-opposite-active-word={view.active.item}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '9%',
                right: '9%',
                top: '43%',
                animation: activeAnimation,
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              <div style={{
                ...TYPE.displayScreen,
                color: visuals.foreground,
                textAlign: 'center',
                textShadow: activeTextShadow,
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
