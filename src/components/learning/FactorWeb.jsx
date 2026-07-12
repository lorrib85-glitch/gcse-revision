import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { ScreenTitle } from '../core/ScreenText.jsx'
import InteractionShell from '../layout/InteractionShell.jsx'

const DEFAULT_CENTRE_LABELS = {
  causes: 'Key factors',
  consequences: 'Key effects',
  change: 'What changed?',
  themes: 'Big picture',
  process: 'How it worked',
}

// Compute an elliptical radial position for each outer node. The web keeps
// six short labels comfortably readable at 390px while preserving a clear
// centre-to-factor relationship.
export function getFactorNodePosition(index, total) {
  const angle = (index * (360 / Math.max(total, 1)) - 90) * (Math.PI / 180)
  return {
    x: 50 + 39 * Math.cos(angle),
    y: 50 + 40 * Math.sin(angle),
  }
}

function exploredIndexes(factors, explored) {
  return factors
    .map((factor, index) => explored.has(factor.id) ? index : null)
    .filter(index => index !== null)
}

function FactorDetail({ factor, accent, rgb, prefersReduced }) {
  const instant = { duration: 0 }
  const transition = prefersReduced
    ? instant
    : { duration: 0.28, ease: 'easeOut' }

  return (
    <motion.section
      key={factor.id}
      aria-live="polite"
      initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
      transition={transition}
      style={{
        padding: SPACING.standard,
        borderRadius: RADII.large,
        background: 'rgba(255,255,255,0.035)',
        border: `1px solid rgba(${rgb},0.20)`,
      }}
    >
      <h2 style={{
        ...TYPE.displayCard,
        color: 'rgba(245,245,245,0.96)',
        margin: 0,
      }}>
        {factor.title}
      </h2>

      {factor.subtitle && (
        <p style={{
          ...TYPE.label,
          color: accent,
          margin: `${SPACING.micro}px 0 0`,
        }}>
          {factor.subtitle}
        </p>
      )}

      <div style={{
        marginTop: SPACING.compact,
        paddingTop: SPACING.compact,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
      }}>
        <div>
          <p style={{ ...TYPE.label, color: accent, margin: '0 0 5px' }}>
            What it means
          </p>
          <p style={{ ...TYPE.body, color: 'rgba(245,245,245,0.78)', margin: 0 }}>
            {factor.whatItMeans}
          </p>
        </div>

        <div>
          <p style={{ ...TYPE.label, color: accent, margin: '0 0 5px' }}>
            Why it mattered
          </p>
          <p style={{ ...TYPE.body, color: 'rgba(245,245,245,0.78)', margin: 0 }}>
            {factor.whyItMattered}
          </p>
        </div>

        {factor.linkedFactor && (
          <div style={{
            borderLeft: `2px solid rgba(${rgb},0.55)`,
            paddingLeft: SPACING.compact,
          }}>
            <p style={{ ...TYPE.label, color: `rgba(${rgb},0.82)`, margin: '0 0 5px' }}>
              Linked factor
            </p>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(245,245,245,0.62)', margin: 0 }}>
              {factor.linkedFactor}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  )
}

function FactorWebDiagram({
  block,
  factors,
  activeId,
  explored,
  onNodeTap,
  accent,
  rgb,
  bg,
  prefersReduced,
}) {
  const activeIndex = factors.findIndex(factor => factor.id === activeId)
  const viewed = exploredIndexes(factors, explored)
  const centreLabel = block.centreLabel || block.centerLabel || DEFAULT_CENTRE_LABELS[block.mode] || 'Key factors'

  function nodeTransition(index) {
    if (prefersReduced) return { duration: 0 }
    return { delay: 0.3 + index * 0.08, duration: 0.32, ease: 'easeOut' }
  }

  return (
    <>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        aspectRatio: '1 / 1.04',
        margin: '0 auto',
      }}>
        <svg
          viewBox="0 0 100 104"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          {factors.map((factor, index) => {
            const position = getFactorNodePosition(index, factors.length)
            const isExplored = explored.has(factor.id)
            return (
              <motion.path
                key={factor.id}
                d={`M 50 52 L ${position.x} ${position.y * 1.04}`}
                stroke={accent}
                strokeWidth="0.55"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: prefersReduced ? 1 : 0, strokeOpacity: 0.16 }}
                animate={{ pathLength: 1, strokeOpacity: isExplored ? 0.52 : 0.16 }}
                transition={prefersReduced
                  ? { duration: 0 }
                  : {
                      pathLength: { delay: 0.18 + index * 0.06, duration: 0.42, ease: 'easeOut' },
                      strokeOpacity: { duration: 0.2 },
                    }}
              />
            )
          })}
        </svg>

        <motion.div
          role="img"
          aria-label={`${centreLabel}. ${block.question}`}
          initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            // Use the independent CSS translate property rather than transform.
            // Framer Motion owns transform for scale, so transform: translate(...)
            // was being overwritten and shifting the centre down/right.
            translate: '-50% -50%',
            width: 94,
            height: 94,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: SPACING.micro,
            boxSizing: 'border-box',
            background: `rgba(${rgb},0.08)`,
            border: `1px solid rgba(${rgb},0.38)`,
            zIndex: 2,
          }}
        >
          <span style={{
            ...TYPE.titleMedium,
            color: `rgba(${rgb},0.92)`,
          }}>
            {centreLabel}
          </span>
        </motion.div>

        {factors.map((factor, index) => {
          const position = getFactorNodePosition(index, factors.length)
          const isActive = factor.id === activeId
          const isExplored = explored.has(factor.id)
          const nodeLabel = factor.shortTitle || factor.title

          return (
            <motion.button
              key={factor.id}
              type="button"
              onClick={() => onNodeTap(factor)}
              aria-label={`Explore ${factor.title}`}
              aria-pressed={isActive}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={nodeTransition(index)}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                // Keep centring independent from Framer Motion's transform-based
                // scale animation. This prevents right-side clipping.
                translate: '-50% -50%',
                width: 'clamp(86px, 24vw, 102px)',
                minHeight: 58,
                padding: `${SPACING.micro}px 8px`,
                borderRadius: RADII.medium,
                border: isActive
                  ? `1.5px solid ${accent}`
                  : isExplored
                    ? `1px solid rgba(${rgb},0.42)`
                    : '1px solid rgba(255,255,255,0.12)',
                background: isActive
                  ? `rgba(${rgb},0.14)`
                  : isExplored
                    ? `rgba(${rgb},0.07)`
                    : 'rgba(255,255,255,0.035)',
                color: isActive
                  ? accent
                  : isExplored
                    ? `rgba(${rgb},0.92)`
                    : 'rgba(245,245,245,0.76)',
                boxShadow: isActive ? `0 0 0 3px rgba(${rgb},0.12)` : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                zIndex: 3,
                WebkitTapHighlightColor: 'transparent',
                transition: [
                  `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                  `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                  `color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                  `box-shadow ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                ].join(', '),
              }}
            >
              <span style={{ ...TYPE.label, color: 'inherit' }}>
                {nodeLabel}
              </span>

              {isExplored && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: accent,
                    color: bg,
                    ...TYPE.caption,
                  }}
                >
                  ✓
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: SPACING.micro,
      }}>
        <SequenceProgress
          total={factors.length}
          current={activeIndex}
          viewed={viewed}
          accent={accent}
          accentRgb={rgb}
          compact
          ariaLabel="Factors explored"
        />
      </div>

      {explored.size === 0 && (
        <p style={{
          ...TYPE.label,
          color: `rgba(${rgb},0.68)`,
          textAlign: 'center',
          margin: `${SPACING.micro}px 0 0`,
        }}>
          Tap a factor to explore it
        </p>
      )}
    </>
  )
}

function JudgementPhase({ block, factors, selected, onSelect, onContinue, accent, rgb, prefersReduced }) {
  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.35, ease: 'easeOut' }

  return (
    <motion.div
      initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard }}
    >
      <div role="group" aria-label="Choose the most important factor" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.micro,
      }}>
        {factors.map(factor => {
          const isSelected = selected === factor.id
          return (
            <button
              key={factor.id}
              type="button"
              onClick={() => onSelect(factor.id)}
              aria-pressed={isSelected}
              style={{
                minHeight: 52,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.micro,
                textAlign: 'left',
                padding: `${SPACING.micro}px ${SPACING.compact}px`,
                borderRadius: RADII.medium,
                border: isSelected
                  ? `1.5px solid ${accent}`
                  : '1px solid rgba(255,255,255,0.10)',
                background: isSelected
                  ? `rgba(${rgb},0.12)`
                  : 'rgba(255,255,255,0.03)',
                color: isSelected ? accent : 'rgba(245,245,245,0.78)',
                cursor: 'pointer',
                ...TYPE.button,
              }}
            >
              <span style={{ flex: 1 }}>
                {factor.title}
              </span>
              {isSelected && <span aria-hidden="true">✓</span>}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.section
            initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
            style={{
              padding: SPACING.standard,
              borderRadius: RADII.large,
              background: 'rgba(255,255,255,0.035)',
              border: `1px solid rgba(${rgb},0.20)`,
            }}
          >
            <h2 style={{ ...TYPE.displayCard, color: 'rgba(245,245,245,0.96)', margin: 0 }}>
              Explain your judgement
            </h2>
            <p style={{
              ...TYPE.body,
              color: 'rgba(245,245,245,0.74)',
              margin: `${SPACING.micro}px 0 0`,
            }}>
              {block.judgementPrompt || 'Use one piece of evidence. Explain why your factor mattered and how it linked to another factor.'}
            </p>

            {block.thinkingTip && (
              <div style={{
                marginTop: SPACING.compact,
                paddingTop: SPACING.compact,
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ ...TYPE.label, color: accent, margin: '0 0 5px' }}>
                  Thinking tip
                </p>
                <p style={{ ...TYPE.bodySmall, color: 'rgba(245,245,245,0.62)', margin: 0 }}>
                  {block.thinkingTip}
                </p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {selected && (
        <ContinueCTA
          onClick={onContinue}
          accent={accent}
        />
      )}
    </motion.div>
  )
}

// ── FactorWeb ────────────────────────────────────────────────────────────────
// A mobile-first causation and judgement screen. Learners explore short factor
// nodes around a concise centre concept, read the fuller teaching beneath,
// then choose and justify the factor they consider most important.
export default function FactorWeb({ block, subject = 'History', onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
  const bg = theme.background || SUBJECTS.History.background
  const prefersReduced = useReducedMotion()
  const scrollRef = useRef(null)

  const factors = block.factors || []
  const [activeId, setActiveId] = useState(null)
  const [explored, setExplored] = useState(new Set())
  const [phase, setPhase] = useState('web')
  const [selected, setSelected] = useState(null)

  const allExplored = factors.length > 0 && explored.size >= factors.length
  const activeFactor = factors.find(factor => factor.id === activeId)
  const isJudgement = phase === 'judgement'

  // Route-B interaction screens own their internal scroller. Always enter a
  // FactorWeb phase at its heading rather than inheriting a stale scroll offset
  // from the previous screen or the exploration phase.
  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    if (typeof node.scrollTo === 'function') node.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    else {
      node.scrollTop = 0
      node.scrollLeft = 0
    }
  }, [phase])

  function handleNodeTap(factor) {
    setActiveId(factor.id)
    setExplored(previous => new Set([...previous, factor.id]))
  }

  const heading = isJudgement
    ? (block.taskPrompt || 'Which factor mattered most?')
    : block.question

  const intro = isJudgement
    ? (block.judgementInstruction || 'Choose one factor, then explain your judgement.')
    : (block.instruction || 'Explore each factor. Then decide which mattered most.')

  return (
    <InteractionShell subject={subject}>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehaviorX: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `${SPACING.compact}px 0 96px`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard }}>
          <header>
            {(isJudgement || block.kicker) && (
              <p style={{
                ...TYPE.label,
                color: accent,
                margin: `0 0 ${SPACING.micro}px`,
              }}>
                {isJudgement ? 'Make your judgement' : block.kicker}
              </p>
            )}

            <ScreenTitle style={{ margin: 0 }}>
              {heading}
            </ScreenTitle>

            {intro && (
              <p style={{
                ...TYPE.body,
                color: 'rgba(245,245,245,0.60)',
                margin: `${SPACING.compact}px 0 0`,
                maxWidth: '36ch',
              }}>
                {intro}
              </p>
            )}
          </header>

          <AnimatePresence mode="wait">
            {!isJudgement ? (
              <motion.div
                key="web"
                initial={{ opacity: prefersReduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.24 }}
                style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard }}
              >
                <FactorWebDiagram
                  block={block}
                  factors={factors}
                  activeId={activeId}
                  explored={explored}
                  onNodeTap={handleNodeTap}
                  accent={accent}
                  rgb={rgb}
                  bg={bg}
                  prefersReduced={prefersReduced}
                />

                <AnimatePresence mode="wait">
                  {activeFactor && (
                    <FactorDetail
                      factor={activeFactor}
                      accent={accent}
                      rgb={rgb}
                      prefersReduced={prefersReduced}
                    />
                  )}
                </AnimatePresence>

                {allExplored && (
                  <motion.div
                    initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                  >
                    <ContinueCTA
                      onClick={() => setPhase('judgement')}
                      label="Make your judgement"
                      accent={accent}
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <JudgementPhase
                key="judgement"
                block={block}
                factors={factors}
                selected={selected}
                onSelect={setSelected}
                onContinue={onContinue}
                accent={accent}
                rgb={rgb}
                prefersReduced={prefersReduced}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </InteractionShell>
  )
}
