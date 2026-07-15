import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
      from { opacity: 0; transform: translateX(16px) scale(0.985); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes oqr-item-settle-right {
      from { opacity: 0; transform: translateX(-16px) scale(0.985); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes oqr-item-land {
      0% { text-shadow: none; }
      42% { text-shadow: var(--oqr-landing-shadow); }
      100% { text-shadow: none; }
    }
    @keyframes oqr-active-left {
      0% { opacity: 0; transform: translateX(0) scale(0.96); }
      16% { opacity: 1; transform: translateX(0) scale(1); }
      52% { opacity: 1; transform: translateX(0) scale(1); }
      90% { opacity: 1; transform: translateX(-39%) scale(0.97); }
      100% { opacity: 0; transform: translateX(-42%) scale(0.95); }
    }
    @keyframes oqr-active-right {
      0% { opacity: 0; transform: translateX(0) scale(0.96); }
      16% { opacity: 1; transform: translateX(0) scale(1); }
      52% { opacity: 1; transform: translateX(0) scale(1); }
      90% { opacity: 1; transform: translateX(39%) scale(0.97); }
      100% { opacity: 0; transform: translateX(42%) scale(0.95); }
    }
    @keyframes oqr-caption-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .oqr-concept-column {
      position: relative;
      z-index: 2;
      transition: opacity 360ms ease, transform 420ms ease, filter 360ms ease;
    }
    .oqr-concept-label {
      display: inline-flex;
      align-items: center;
      transition: transform 420ms ease, filter 420ms ease;
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="left"],
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="right"] {
      opacity: 1;
      transform: translateY(-2px) scale(1.018);
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="right"],
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="left"] {
      opacity: 0.58;
      transform: scale(0.99);
      filter: saturate(0.76);
    }
    .oqr-stage[data-active-side="left"] .oqr-concept-column[data-opposite-side="left"] .oqr-concept-label,
    .oqr-stage[data-active-side="right"] .oqr-concept-column[data-opposite-side="right"] .oqr-concept-label {
      transform: scale(1.045);
      filter: drop-shadow(0 0 8px var(--oqr-destination-glow));
    }
    .oqr-list li::before {
      display: none !important;
      content: none !important;
    }
    .oqr-settled-item--left {
      animation: oqr-item-settle-left var(--oqr-settle-duration) var(--oqr-easing) both;
    }
    .oqr-settled-item--right {
      animation: oqr-item-settle-right var(--oqr-settle-duration) var(--oqr-easing) both;
    }
    .oqr-settled-item--latest > span {
      animation: oqr-item-land 760ms ease-out both;
    }
    .oqr-active-word {
      transform-origin: center;
      will-change: transform, opacity;
    }
    .oqr-divider {
      position: absolute;
      z-index: 1;
      top: var(--oqr-divider-start);
      bottom: 0;
      left: 50%;
      width: 1px;
      transform: translateX(-50%);
      background: var(--oqr-divider-line);
      pointer-events: none;
    }
    .oqr-divider::after {
      content: '';
      position: absolute;
      top: 42%;
      left: 50%;
      width: 8px;
      height: 8px;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 1px solid var(--oqr-divider-diamond);
      background: var(--oqr-divider-diamond-fill);
    }
    .oqr-accelerate-control:focus-visible {
      outline: 2px solid var(--oqr-focus);
      outline-offset: -4px;
    }
    @media (prefers-reduced-motion: reduce) {
      .oqr-motion { animation: none !important; transition: none !important; }
      .oqr-active { display: none !important; }
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

function ConceptColumn({
  concept = {},
  items,
  side,
  accent,
  destinationGlow,
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
        '--oqr-destination-glow': destinationGlow,
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
          }}
        >
          <span>{concept.label}</span>
        </div>
      </div>

      <ul className="oqr-list" style={{
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
      <div
        data-opposite-embedded-divider-mask="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 24,
          transform: 'translateX(-50%)',
          background: visuals.dividerErase,
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
  const [hasStarted, setHasStarted] = useState(reducedMotion)
  const [documentVisible, setDocumentVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState !== 'hidden',
  )
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
      setHasStarted(true)
      return undefined
    }

    setSettledCount(0)
    setActiveIndex(0)
    setHasStarted(false)
    return undefined
  }, [reducedMotion, sequence.length])

  useEffect(() => {
    if (reducedMotion || hasStarted) return undefined
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasStarted(true)
      return undefined
    }

    const observer = new IntersectionObserver(entries => {
      const entry = entries[0]
      if (entry?.isIntersecting && entry.intersectionRatio >= 0.2) {
        setHasStarted(true)
        observer.disconnect()
      }
    }, { threshold: [0.2] })

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasStarted, reducedMotion])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const handleVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const advanceCurrent = useCallback(() => {
    if (reducedMotion || activeIndex < 0 || activeIndex >= sequence.length) return
    setSettledCount(count => Math.max(count, activeIndex + 1))
    setActiveIndex(index => Math.min(index + 1, sequence.length))
  }, [activeIndex, reducedMotion, sequence.length])

  useEffect(() => {
    if (!hasStarted || !documentVisible || reducedMotion || activeIndex < 0 || activeIndex >= sequence.length) {
      return undefined
    }

    const timer = setTimeout(advanceCurrent, timings.nextDelay)
    return () => clearTimeout(timer)
  }, [activeIndex, advanceCurrent, documentVisible, hasStarted, reducedMotion, sequence.length, timings.nextDelay])

  const view = deriveOppositeRevealState(block, { settledCount, activeIndex, reducedMotion })
  const activeSide = view.active?.side || 'none'
  const latestStep = settledCount > 0 ? sequence[settledCount - 1] : null
  const activeAnimation = view.active && hasStarted
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
      data-opposite-reveal-started={hasStarted || undefined}
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
        data-complete={view.complete || undefined}
        aria-label={block.accessibility?.label || block.title}
        style={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          borderRadius: usesScreenBackdrop ? 0 : RADII.large,
          background: usesScreenBackdrop ? visuals.stageSurface : visuals.background,
          border: usesScreenBackdrop ? 'none' : `1px solid ${visuals.stageBorder}`,
          '--oqr-divider-start': `${SPACING.standard + 42}px`,
          '--oqr-divider-line': visuals.dividerLine,
          '--oqr-divider-diamond': visuals.dividerDiamond,
          '--oqr-divider-diamond-fill': visuals.dividerDiamondFill,
        }}
      >
        {!usesScreenBackdrop && <BackdropImage block={block} visuals={visuals} />}
        <div className="oqr-divider" aria-hidden="true" data-opposite-divider="true" />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: view.complete ? 'auto' : '52svh',
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${SPACING.compact}px ${SPACING.compact}px`,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: view.complete
              ? 'minmax(0,1fr) minmax(32px,0.24fr) minmax(0,1fr)'
              : 'minmax(0,1fr) minmax(52px,0.42fr) minmax(0,1fr)',
            gap: SPACING.compact,
            paddingTop: SPACING.standard,
          }}>
            <ConceptColumn
              concept={block.leftConcept}
              items={view.leftItems}
              side="left"
              accent={visuals.leftAccent}
              destinationGlow={visuals.leftDestinationGlow}
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
              destinationGlow={visuals.rightDestinationGlow}
              textColor={visuals.settledText}
              labelShadow={visuals.labelShadow}
              itemShadow={visuals.settledTextShadow}
              latestItem={latestStep?.side === 'right' ? latestStep.item : null}
              ariaLabel={block.accessibility?.rightLabel}
            />
          </div>

          {!view.complete && <div style={{ flex: 1, minHeight: SPACING.cinematic }} />}

          {view.active && hasStarted && (
            <>
              <button
                type="button"
                className="oqr-accelerate-control"
                data-opposite-accelerate-control="true"
                onClick={advanceCurrent}
                aria-label={`Place ${view.active.item} with ${view.active.conceptLabel} now`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 3,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  '--oqr-focus': visuals.sharedAccent,
                }}
              />
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
            </>
          )}

          {view.complete && block.closingCaption && (
            <p
              className="oqr-motion"
              style={{
                ...TYPE.bodyLarge,
                color: visuals.foreground,
                textAlign: 'center',
                textShadow: visuals.captionShadow,
                margin: `${SPACING.standard}px 0 0`,
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
