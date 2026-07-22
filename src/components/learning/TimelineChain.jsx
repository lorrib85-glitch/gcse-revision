import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
// CinematicShell used here because the horizontal scroll-snap chain and connector rail must
// reach the full viewport width; InteractionShell's 16px inset would clip the rail and break
// the scroll-snap alignment. The reveal variant also owns the full viewport so its own scroll
// column sits beneath the floating LearningHeader like the other full-screen learning screens.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { ScreenTitle } from '../core/ScreenText.jsx'
import TimelineChainIcon from './TimelineChainIcons.jsx'
import {
  buildRevealModel,
  initialRevealCount,
  nextRevealCount,
  revealState,
  segmentsToString,
} from './timelineChainReveal.js'

// ─── TimelineChain v1 ───────────────────────────────────────────────────────
//
// Full-screen horizontal scroll-snap chain of causal reveal cards — a chapter's
// "big idea" sequence (e.g. how germ theory led to safer surgery). Each card
// keeps its event visible while expanding to reveal why it mattered and how it
// unlocked the next step in the chain.
//
// Block shape:
// {
//   type: 'timelineChain',
//   title: 'How the Black Death spread',
//   intro?: 'Tap each step to see why it mattered.',
//   steps: [
//     { id, icon?: 'microscope', image?, imageAlt?, label: 'Pasteur proves germ theory', detail: '...' },
//     ...
//   ],
// }

let _tcStyled = false
function ensureStyles() {
  if (_tcStyled) return
  _tcStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tc-fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes tc-heading-enter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes tc-card-enter {
      from { opacity: 0; transform: translateY(14px) scale(0.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes tc-node-pulse {
      0% { box-shadow: 0 0 0 0 rgba(var(--tc-rgb), 0), 0 0 10px rgba(var(--tc-rgb), 0.20); }
      45% { box-shadow: 0 0 0 5px rgba(var(--tc-rgb), 0.12), 0 0 13px rgba(var(--tc-rgb), 0.28); }
      100% { box-shadow: 0 0 0 0 rgba(var(--tc-rgb), 0), 0 0 10px rgba(var(--tc-rgb), 0.20); }
    }
    @keyframes tc-hint-pulse {
      0%, 100% { opacity: 0.30; transform: translateX(0); }
      50% { opacity: 0.58; transform: translateX(4px); }
    }
    @keyframes tc-reveal-enter {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tc-reveal-scroll::-webkit-scrollbar { display: none; }
    .tc-row::-webkit-scrollbar { display: none; }
    .tc-card-trigger:focus-visible {
      outline: 2px solid var(--tc-accent) !important;
      outline-offset: 4px;
    }
    @media (prefers-reduced-motion: reduce) {
      .tc-motion,
      .tc-sequence-progress * {
        animation: none !important;
        transition: none !important;
      }
      .tc-row {
        scroll-behavior: auto !important;
      }
    }
  `
  document.head.appendChild(el)
}

// The full-screen card occupies 82% of the viewport so the active step is
// dominant while a deliberate sliver of the next card remains visible.
const CARD_W = 'clamp(260px, 82vw, 352px)'
const CARD_EDGE_INSET = 'calc(50vw - clamp(130px, 41vw, 176px))'
const CARD_H = 290

const EMBED_CARD_W = 200
const EMBED_CARD_H = 270
const EMBED_RAIL_H = 16
const RAIL_OVERHANG = SPACING.compact / 2

const SR_ONLY = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

function nearestCardIndex(row, cards) {
  if (!row || cards.length === 0) return 0

  const viewportCentre = row.scrollLeft + row.clientWidth / 2
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    if (!card) return
    const cardCentre = card.offsetLeft + card.offsetWidth / 2
    const distance = Math.abs(cardCentre - viewportCentre)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

function keyboardTarget(event, current, total) {
  if (total <= 0) return null
  if (event.key === 'ArrowRight') return Math.min(current + 1, total - 1)
  if (event.key === 'ArrowLeft') return Math.max(current - 1, 0)
  if (event.key === 'Home') return 0
  if (event.key === 'End') return total - 1
  return null
}

function moveToCard(row, card, prefersReduced, align = 'center') {
  if (!row || !card) return

  const trigger = card.querySelector('.tc-card-trigger')
  trigger?.focus({ preventScroll: true })

  const left = align === 'start'
    ? card.offsetLeft
    : card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2

  if (typeof row.scrollTo === 'function') {
    row.scrollTo({
      left: Math.max(0, left),
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
  } else {
    row.scrollLeft = Math.max(0, left)
  }
}

function DisclosureChevron({ open, prefersReduced }) {
  return (
    <svg
      aria-hidden="true"
      className="tc-motion"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        display: 'block',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: prefersReduced
          ? 'none'
          : `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
      }}
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Thin dispatcher — no hooks here, so each variant component owns its own hook
// order (rules-of-hooks). Existing interactive screens don't set `variant`
// (or `block.variant`), so they are untouched by the reveal branch.
export default function TimelineChain({ block, subject = 'History', onContinue, variant }) {
  ensureStyles()
  const resolvedVariant = variant ?? block?.variant ?? 'interactive'
  return resolvedVariant === 'reveal'
    ? <RevealChain block={block} subject={subject} onContinue={onContinue} />
    : <InteractiveChain block={block} subject={subject} onContinue={onContinue} />
}

function InteractiveChain({ block, subject = 'History', onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []
  const prefersReduced = useReducedMotion()
  const instructionsId = useId()

  const [openIndex, setOpenIndex] = useState(null)
  const [viewedIndices, setViewedIndices] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const rowRef = useRef(null)
  const cardRefs = useRef([])

  const allViewed = steps.length > 0 && viewedIndices.size >= steps.length

  function toggleOpen(index) {
    const willOpen = openIndex !== index
    setOpenIndex(willOpen ? index : null)

    if (willOpen) {
      setViewedIndices(previous => (
        previous.has(index) ? previous : new Set([...previous, index])
      ))
    }
  }

  function handleScroll() {
    if (!scrolled) setScrolled(true)
    const nextIndex = nearestCardIndex(rowRef.current, cardRefs.current)
    setCurrentIndex(current => current === nextIndex ? current : nextIndex)
  }

  function handleKeyDown(event) {
    const nextIndex = keyboardTarget(event, currentIndex, steps.length)
    if (nextIndex === null) return

    event.preventDefault()
    setScrolled(true)
    setCurrentIndex(nextIndex)
    moveToCard(rowRef.current, cardRefs.current[nextIndex], prefersReduced, 'center')
  }

  return (
    <CinematicShell style={{
      background: theme.background,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
    }}>
      {/* Title + intro */}
      <div
        className="tc-motion"
        style={{
          padding: `0 ${SPACING.standard}px`,
          marginBottom: SPACING.standard,
          flexShrink: 0,
          animation: prefersReduced
            ? 'none'
            : `tc-heading-enter ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}
      >
        {block.title && (
          <ScreenTitle style={{ margin: 0 }}>
            {block.title}
          </ScreenTitle>
        )}
        {block.intro && (
          <p style={{
            ...TYPE.body,
            color: 'rgba(245,245,245,0.60)',
            margin: `${SPACING.standard}px 0 0`,
          }}>
            {block.intro}
          </p>
        )}
      </div>

      <p id={instructionsId} style={SR_ONLY}>
        Swipe horizontally or use the left and right arrow keys to move between steps. Press Enter or Space to reveal why a step mattered.
      </p>

      {/* Chain row */}
      <div
        ref={rowRef}
        className="tc-row"
        role="region"
        aria-roledescription="timeline"
        aria-label={block.title ? `${block.title} sequence` : 'Causal sequence'}
        aria-describedby={instructionsId}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: CARD_EDGE_INSET,
          WebkitOverflowScrolling: 'touch',
          gap: SPACING.compact,
          padding: `0 ${CARD_EDGE_INSET}`,
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        {steps.map((step, index) => (
          <ChainCard
            key={step.id || index}
            cardRef={node => { cardRefs.current[index] = node }}
            step={step}
            index={index}
            total={steps.length}
            open={openIndex === index}
            viewed={viewedIndices.has(index)}
            previousViewed={index > 0 && viewedIndices.has(index - 1)}
            current={currentIndex === index}
            complete={allViewed}
            onToggle={() => toggleOpen(index)}
            onNavigateKey={handleKeyDown}
            accent={accent}
            rgb={rgb}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>

      {/* The card preview is the primary cue; this hint nudges twice, then rests until dismissed. */}
      {!scrolled && steps.length > 1 && (
        <div
          aria-hidden="true"
          className="tc-motion"
          style={{
            textAlign: 'center',
            marginTop: SPACING.compact,
            flexShrink: 0,
            ...TYPE.bodySmall,
            color: 'rgba(245,245,245,0.38)',
            animation: prefersReduced ? 'none' : 'tc-hint-pulse 1.4s ease-in-out 2 both',
          }}
        >
          Swipe to explore
        </div>
      )}

      {/* Governed local sequence progress and quiet completion guidance. */}
      <div style={{ marginTop: SPACING.compact, flexShrink: 0 }}>
        <div className="tc-sequence-progress" style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <SequenceProgress
            total={steps.length}
            current={currentIndex}
            viewed={[...viewedIndices]}
            accent={accent}
            accentRgb={rgb}
            variant="dots"
            ariaLabel="Timeline position and explored steps"
          />
        </div>

        <div style={{
          minHeight: '1.2em',
          marginTop: SPACING.micro,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div
            aria-live="polite"
            className="tc-motion"
            style={{
              ...TYPE.label,
              color: 'rgba(245,245,245,0.38)',
              textAlign: 'center',
              opacity: allViewed ? 0 : 1,
              visibility: allViewed ? 'hidden' : 'visible',
              transition: prefersReduced
                ? 'none'
                : `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, visibility 0s linear ${allViewed ? MOTION.duration.standard : '0ms'}`,
            }}
          >
            Explore each connection to continue
          </div>
        </div>
      </div>

      {/* The governed CTA enters an already-reserved slot, so the chain never shifts. */}
      <div style={{
        minHeight: BUTTONS.continue.height,
        marginTop: SPACING.compact,
        padding: `0 ${SPACING.standard}px`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        {allViewed && (
          <ContinueCTA
            onClick={onContinue}
            accent={accent}
            style={{
              animation: prefersReduced
                ? 'none'
                : `tc-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
              ...(prefersReduced ? { transition: 'none' } : {}),
            }}
          />
        )}
      </div>
    </CinematicShell>
  )
}

// ─── TimelineChain reveal variant ──────────────────────────────────────────
//
// A passive, one-step-at-a-time vertical reveal that absorbs the useful behaviour
// of the former VisualNarrativeScreen. Opt in with `variant: 'reveal'` (prop or on
// the block). Subject-accent themed, mobile-first, no history-specific styling.
//
// Block shape:
// {
//   type: 'timelineChain',
//   variant: 'reveal',
//   title?: 'How the idea travelled',
//   intro?: 'Reveal each step in turn.',
//   steps: [
//     { id?, icon?, label: string | [{ text, highlight? }], detail?: string | segments },
//     ...
//   ],
//   takeaway?: string | segments,   // final accent statement once all steps show
//   source?: 'Attribution note',    // optional caption shown with the takeaway
// }

// Renders structured rich text: highlighted phrases come from data segments, never
// hardcoded HTML. Highlight uses the subject accent so it stays theme-driven.
function RichText({ segments, accent }) {
  return segments.map((segment, index) => (
    segment.highlight
      ? (
        <mark
          key={index}
          style={{ background: 'transparent', color: accent, fontWeight: 700 }}
        >
          {segment.text}
        </mark>
      )
      : <span key={index}>{segment.text}</span>
  ))
}

function RevealMarker({ step, active, rgb, prefersReduced }) {
  const glow = active
    ? `0 0 0 4px rgba(${rgb},0.10), 0 0 16px rgba(${rgb},0.30)`
    : 'none'
  return (
    <div
      className="tc-motion"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid rgba(${rgb},${active ? 0.55 : 0.28})`,
        background: active ? `rgba(${rgb},0.14)` : `rgba(${rgb},0.06)`,
        color: `rgba(${rgb},${active ? 0.95 : 0.78})`,
        boxShadow: glow,
        ...TYPE.metadata,
        transition: prefersReduced
          ? 'none'
          : `background ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
      }}
    >
      {step.icon ? <TimelineChainIcon icon={step.icon} size={18} /> : step.marker}
    </div>
  )
}

function RevealStep({ step, isActive, isFirst, showConnector, accent, rgb, prefersReduced, stepRef }) {
  return (
    <li
      ref={stepRef}
      className="tc-motion"
      style={{
        display: 'flex',
        gap: SPACING.compact,
        listStyle: 'none',
        // Only the newest step animates in; earlier steps are already settled.
        animation: (isActive && !isFirst && !prefersReduced)
          ? `tc-reveal-enter ${MOTION.duration.slow} ${MOTION.easing.standard} both`
          : 'none',
      }}
    >
      {/* Marker column + subtle vertical connector to the next revealed step. */}
      <div style={{
        position: 'relative',
        width: 34,
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        {showConnector && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 34,
              bottom: -SPACING.standard,
              left: '50%',
              width: 1,
              transform: 'translateX(-50%)',
              background: `rgba(${rgb},0.18)`,
            }}
          />
        )}
        <RevealMarker step={step} active={isActive} rgb={rgb} prefersReduced={prefersReduced} />
      </div>

      {/* Text column: the statement carries the strongest hierarchy; detail is quieter. */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
        <div style={{
          ...TYPE.displayCard,
          color: isActive ? 'rgba(245,245,245,0.96)' : 'rgba(245,245,245,0.66)',
          whiteSpace: 'pre-line',
          transition: prefersReduced ? 'none' : `color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}>
          <RichText segments={step.statement} accent={accent} />
        </div>
        {step.detail.length > 0 && (
          <div style={{
            ...TYPE.body,
            color: isActive ? 'rgba(245,245,245,0.80)' : 'rgba(245,245,245,0.52)',
            marginTop: SPACING.micro,
            whiteSpace: 'pre-line',
            transition: prefersReduced ? 'none' : `color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }}>
            <RichText segments={step.detail} accent={accent} />
          </div>
        )}
      </div>
    </li>
  )
}

function RevealChain({ block, subject = 'History', onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const prefersReduced = useReducedMotion()

  const model = useMemo(() => buildRevealModel(block), [block])
  const total = model.steps.length
  const hasTakeaway = model.takeaway.length > 0

  const [visibleCount, setVisibleCount] = useState(() => initialRevealCount(total))
  const state = revealState({ total, visibleCount, hasTakeaway })
  const latestStepRef = useRef(null)

  function handleReveal() {
    setVisibleCount(current => nextRevealCount(current, total))
  }

  // Scroll a newly revealed step into view only when it isn't already fully visible,
  // so short content never jumps. The first step (mount) is never scrolled.
  useEffect(() => {
    if (visibleCount <= 1) return
    const node = latestStepRef.current
    if (!node || typeof node.getBoundingClientRect !== 'function') return
    const rect = node.getBoundingClientRect()
    const belowFold = rect.bottom > (window.innerHeight || 0) - 96
    const aboveFold = rect.top < 72
    if (belowFold || aboveFold) {
      node.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' })
    }
  }, [visibleCount, prefersReduced])

  const visibleSteps = model.steps.slice(0, state.visibleCount)
  const liveMessage = visibleSteps.length > 0
    ? segmentsToString(visibleSteps[visibleSteps.length - 1].statement)
    : ''

  return (
    <CinematicShell style={{ background: theme.background, zIndex: 100 }}>
      <div
        className="tc-reveal-scroll"
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: `calc(84px + env(safe-area-inset-top, 0px)) ${SPACING.standard}px calc(${SPACING.cinematic}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          {model.title && (
            <ScreenTitle style={{ margin: 0 }}>{model.title}</ScreenTitle>
          )}
          {model.intro && (
            <p style={{
              ...TYPE.body,
              color: 'rgba(245,245,245,0.60)',
              margin: `${model.title ? SPACING.compact : 0}px 0 0`,
              maxWidth: '34ch',
            }}>
              {model.intro}
            </p>
          )}

          <ol style={{
            listStyle: 'none',
            padding: 0,
            margin: `${SPACING.separation}px 0 0`,
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.standard,
          }}>
            {visibleSteps.map((step, index) => (
              <RevealStep
                key={step.id}
                step={step}
                isFirst={index === 0}
                isActive={index === visibleSteps.length - 1}
                showConnector={index < visibleSteps.length - 1 || (!state.atEnd)}
                accent={accent}
                rgb={rgb}
                prefersReduced={prefersReduced}
                stepRef={index === visibleSteps.length - 1 ? latestStepRef : undefined}
              />
            ))}
          </ol>

          {state.showTakeaway && (
            <div style={{
              marginTop: SPACING.separation,
              paddingLeft: `calc(34px + ${SPACING.compact}px)`,
              animation: prefersReduced ? 'none' : `tc-reveal-enter ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}>
              <div style={{
                ...TYPE.displaySection,
                color: accent,
                whiteSpace: 'pre-line',
              }}>
                <RichText segments={model.takeaway} accent={accent} />
              </div>
              {model.source && (
                <p style={{
                  ...TYPE.caption,
                  color: 'rgba(245,245,245,0.42)',
                  margin: `${SPACING.compact}px 0 0`,
                  maxWidth: '40ch',
                }}>
                  <span style={{ ...TYPE.metadata, marginRight: SPACING.micro }}>Source</span>
                  {model.source}
                </p>
              )}
            </div>
          )}

          {/* The CTA sits directly beneath the latest content rather than pinned to the
              bottom of the viewport, so short reveals never leave a dead area below.
              An empty step list resolves to Continue in revealState (never a soft-lock). */}
          <div style={{ marginTop: SPACING.separation, paddingLeft: `calc(34px + ${SPACING.compact}px)` }}>
            <ContinueCTA
              onClick={state.cta === 'continue' ? onContinue : handleReveal}
              label={state.cta === 'continue' ? 'Continue' : 'Reveal next'}
              accent={accent}
            />
          </div>
        </div>

        <div style={SR_ONLY} aria-live="polite" aria-atomic="true">{liveMessage}</div>
      </div>
    </CinematicShell>
  )
}

function ChainCard({
  step,
  index,
  total,
  open,
  viewed,
  previousViewed = false,
  current,
  complete = false,
  onToggle,
  onNavigateKey,
  accent,
  rgb,
  prefersReduced,
  cardRef,
  cardW = CARD_W,
  cardH = CARD_H,
  railH = 20,
  scrollAlign = 'center',
}) {
  const isFirst = index === 0
  const isLast = index === total - 1
  const isAvailable = isFirst || previousViewed
  const isCompletionNode = complete && isLast
  const completedRailColor = `rgba(${rgb},${complete ? 0.82 : 0.72})`
  const nodeSize = isCompletionNode ? 12 : 10
  const railTransition = prefersReduced
    ? 'none'
    : `transform ${MOTION.duration.slow} ${MOTION.easing.standard}`
  const visualSize = open ? 44 : 56
  const iconSize = open ? 22 : 28
  const detailId = useId()
  const cardActionLabel = open
    ? `Hide explanation for step ${index + 1} of ${total}: ${step.label}`
    : `Reveal why this mattered — step ${index + 1} of ${total}: ${step.label}`
  const entryDelay = `${Math.min(120 + index * 55, 320)}ms`

  return (
    <div
      ref={cardRef}
      className="tc-motion"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        scrollSnapAlign: scrollAlign,
        scrollSnapStop: 'always',
        animation: prefersReduced
          ? 'none'
          : `tc-card-enter ${MOTION.duration.slow} ${MOTION.easing.standard} ${entryDelay} both`,
      }}
    >
      {/* Connector rail — completed sections stay complete after a card is closed. */}
      <div style={{ position: 'relative', height: railH, width: cardW, flexShrink: 0 }}>
        {!isFirst && (
          <>
            <div style={{
              position: 'absolute',
              left: -RAIL_OVERHANG,
              right: '50%',
              top: '50%',
              height: 1,
              background: `rgba(${rgb},0.16)`,
            }} />
            <div className="tc-motion" style={{
              position: 'absolute',
              left: -RAIL_OVERHANG,
              right: '50%',
              top: '50%',
              height: 1,
              background: completedRailColor,
              transform: previousViewed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'right center',
              transition: railTransition,
            }} />
          </>
        )}
        {!isLast && (
          <>
            <div style={{
              position: 'absolute',
              left: '50%',
              right: -RAIL_OVERHANG,
              top: '50%',
              height: 1,
              background: `rgba(${rgb},0.16)`,
            }} />
            <div className="tc-motion" style={{
              position: 'absolute',
              left: '50%',
              right: -RAIL_OVERHANG,
              top: '50%',
              height: 1,
              background: completedRailColor,
              transform: viewed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: railTransition,
            }} />
          </>
        )}
        <div
          className="tc-motion"
          style={{
            '--tc-rgb': rgb,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            width: nodeSize,
            height: nodeSize,
            borderRadius: '50%',
            background: viewed ? accent : isAvailable ? `rgba(${rgb},0.72)` : `rgba(${rgb},0.24)`,
            border: `1px solid rgba(${rgb},${isCompletionNode ? 0.92 : viewed ? 0.72 : 0.28})`,
            boxShadow: isCompletionNode
              ? `0 0 0 4px rgba(${rgb},0.08), 0 0 12px rgba(${rgb},0.26)`
              : viewed
                ? `0 0 10px rgba(${rgb},0.20)`
                : isAvailable
                  ? `0 0 0 4px rgba(${rgb},0.07)`
                  : 'none',
            animation: viewed && !prefersReduced && !complete
              ? `tc-node-pulse ${MOTION.duration.slow} ${MOTION.easing.standard} 1`
              : 'none',
            transition: prefersReduced
              ? 'none'
              : `width ${MOTION.duration.standard} ${MOTION.easing.standard}, height ${MOTION.duration.standard} ${MOTION.easing.standard}, background ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }}
        />
      </div>

      {/* Native button semantics preserve the reveal interaction without custom key handling. */}
      <button
        type="button"
        className="tc-card-trigger tc-motion"
        aria-current={current ? 'step' : undefined}
        aria-expanded={open}
        aria-controls={detailId}
        aria-label={cardActionLabel}
        aria-keyshortcuts="Enter Space"
        onClick={onToggle}
        onKeyDown={onNavigateKey}
        style={{
          '--tc-accent': accent,
          width: cardW,
          minHeight: cardH,
          display: 'block',
          padding: 0,
          border: 0,
          background: 'none',
          color: 'inherit',
          font: 'inherit',
          textAlign: 'left',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          opacity: current ? 1 : 0.86,
          transform: current ? 'translateY(0) scale(1)' : 'translateY(2px) scale(0.985)',
          transformOrigin: 'center top',
          transition: prefersReduced
            ? 'none'
            : `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}
      >
        <div className="tc-motion" style={{
          width: '100%',
          minHeight: cardH,
          boxSizing: 'border-box',
          borderRadius: RADII.large,
          background: open ? `rgba(${rgb},0.055)` : 'rgba(255,255,255,0.03)',
          border: open ? `1px solid rgba(${rgb},0.22)` : '1px solid rgba(255,255,255,0.06)',
          boxShadow: current
            ? '0 24px 56px rgba(0,0,0,0.48)'
            : '0 16px 36px rgba(0,0,0,0.34)',
          padding: SPACING.standard,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: prefersReduced
            ? 'none'
            : `background ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }}>
          {step.image && (
            <div style={{
              position: 'relative',
              margin: `-${SPACING.standard}px -${SPACING.standard}px ${SPACING.compact}px`,
              height: Math.round(cardH * 0.42),
              borderRadius: `${RADII.large}px ${RADII.large}px 0 0`,
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img
                src={step.image}
                alt={step.imageAlt || step.alt || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                top: SPACING.micro,
                left: SPACING.micro,
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: `1px solid rgba(${rgb},0.24)`,
                background: 'rgba(8,9,13,0.58)',
                backdropFilter: 'blur(6px)',
                ...TYPE.metadata,
                color: `rgba(${rgb},0.88)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {index + 1}
              </div>
            </div>
          )}

          {!step.image && (
            <>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: `1px solid rgba(${rgb},0.24)`,
                background: `rgba(${rgb},0.06)`,
                ...TYPE.metadata,
                color: `rgba(${rgb},0.88)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACING.compact,
                flexShrink: 0,
              }}>
                {index + 1}
              </div>

              <div className="tc-motion" style={{
                width: visualSize,
                height: visualSize,
                borderRadius: RADII.medium,
                border: `1px solid rgba(${rgb},0.16)`,
                background: `rgba(${rgb},0.07)`,
                color: `rgba(${rgb},0.92)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: open ? SPACING.compact : SPACING.standard,
                flexShrink: 0,
                transition: prefersReduced
                  ? 'none'
                  : `width ${MOTION.duration.standard} ${MOTION.easing.standard}, height ${MOTION.duration.standard} ${MOTION.easing.standard}, margin-bottom ${MOTION.duration.standard} ${MOTION.easing.standard}`,
              }}>
                <TimelineChainIcon icon={step.icon} size={iconSize} />
              </div>
            </>
          )}

          <div className="tc-motion" style={{
            ...TYPE.displayCard,
            color: 'rgba(245,245,245,0.94)',
            flex: open ? '0 0 auto' : 1,
            transition: prefersReduced
              ? 'none'
              : `flex ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }}>
            {step.label}
          </div>

          <div
            id={detailId}
            aria-hidden={!open}
            aria-live="polite"
            className="tc-motion"
            style={{
              display: 'grid',
              gridTemplateRows: open ? '1fr' : '0fr',
              opacity: open ? 1 : 0,
              marginTop: open ? SPACING.standard : 0,
              transition: prefersReduced
                ? 'none'
                : `grid-template-rows ${MOTION.duration.slow} ${MOTION.easing.standard}, opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, margin-top ${MOTION.duration.slow} ${MOTION.easing.standard}`,
            }}
          >
            <div style={{ minHeight: 0, overflow: 'hidden' }}>
              <div className="tc-motion" style={{
                transform: open ? 'translateY(0)' : 'translateY(8px)',
                transition: prefersReduced
                  ? 'none'
                  : `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
              }}>
                <div style={{
                  ...TYPE.label,
                  color: accent,
                  marginBottom: SPACING.micro,
                }}>
                  Why it mattered
                </div>
                <div style={{ ...TYPE.body, color: 'rgba(245,245,245,0.78)' }}>
                  {step.detail}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            ...TYPE.label,
            color: `rgba(${rgb},0.68)`,
            marginTop: SPACING.standard,
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.micro,
          }}>
            <span>{open ? 'Hide explanation' : 'Reveal why it mattered'}</span>
            <DisclosureChevron open={open} prefersReduced={prefersReduced} />
          </div>
        </div>
      </button>
    </div>
  )
}

// ─── TimelineChainBlock — embedded variant ─────────────────────────────────
//
// The same causal reveal chain, scaled down for use inline within a content
// screen's `blocks` array (block.type === 'timelineChain', rendered inside
// `Screen` in ModulePlayer.jsx). No fixed positioning and no completion
// gating — the screen's own Continue/Next controls progression.
//
// Block shape:
// {
//   type: 'timelineChain',
//   intro?: 'Tap each step to see why it mattered.',
//   steps: [ { id, icon?, image?, imageAlt?, label, detail }, ... ],
//   outro?: 'This is the transmission chain: ship → rat → flea → person...',
// }

export function TimelineChainBlock({ block, subject = 'History' }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme
  const steps = block.steps || []
  const prefersReduced = useReducedMotion()
  const instructionsId = useId()

  const [openIndex, setOpenIndex] = useState(null)
  const [viewedIndices, setViewedIndices] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const rowRef = useRef(null)
  const cardRefs = useRef([])
  const allViewed = steps.length > 0 && viewedIndices.size >= steps.length

  function toggleOpen(index) {
    const willOpen = openIndex !== index
    setOpenIndex(willOpen ? index : null)

    if (willOpen) {
      setViewedIndices(previous => (
        previous.has(index) ? previous : new Set([...previous, index])
      ))
    }
  }

  function handleScroll() {
    const nextIndex = nearestCardIndex(rowRef.current, cardRefs.current)
    setCurrentIndex(current => current === nextIndex ? current : nextIndex)
  }

  function handleKeyDown(event) {
    const nextIndex = keyboardTarget(event, currentIndex, steps.length)
    if (nextIndex === null) return

    event.preventDefault()
    setCurrentIndex(nextIndex)
    moveToCard(rowRef.current, cardRefs.current[nextIndex], prefersReduced, 'start')
  }

  return (
    <div>
      {block.intro && (
        <p style={{ ...TYPE.bodyStrong, color: 'rgba(255,255,255,0.52)', margin: '0 0 16px' }}>
          {block.intro}
        </p>
      )}

      <p id={instructionsId} style={SR_ONLY}>
        Swipe horizontally or use the left and right arrow keys to move between steps. Press Enter or Space to reveal why a step mattered.
      </p>

      <div
        ref={rowRef}
        className="tc-row"
        role="region"
        aria-roledescription="timeline"
        aria-label="Causal sequence"
        aria-describedby={instructionsId}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
          gap: SPACING.compact,
          paddingBottom: 4,
        }}
      >
        {steps.map((step, index) => (
          <ChainCard
            key={step.id || index}
            cardRef={node => { cardRefs.current[index] = node }}
            step={step}
            index={index}
            total={steps.length}
            open={openIndex === index}
            viewed={viewedIndices.has(index)}
            previousViewed={index > 0 && viewedIndices.has(index - 1)}
            current={currentIndex === index}
            complete={allViewed}
            onToggle={() => toggleOpen(index)}
            onNavigateKey={handleKeyDown}
            accent={accent}
            rgb={rgb}
            prefersReduced={prefersReduced}
            cardW={EMBED_CARD_W}
            cardH={EMBED_CARD_H}
            railH={EMBED_RAIL_H}
            scrollAlign="start"
          />
        ))}
        <div style={{ flexShrink: 0, width: 1 }} />
      </div>

      <div className="tc-sequence-progress" style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: SPACING.compact,
      }}>
        <SequenceProgress
          total={steps.length}
          current={currentIndex}
          viewed={[...viewedIndices]}
          accent={accent}
          accentRgb={rgb}
          variant="dots"
          ariaLabel="Timeline position and explored steps"
        />
      </div>

      {block.outro && (
        <p style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.56)', margin: `${SPACING.compact}px 0 0` }}>
          {block.outro}
        </p>
      )}
    </div>
  )
}
