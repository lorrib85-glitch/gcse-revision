import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { COMPONENT_TEXT_LIMITS } from '../../constants/contentLimits.js'
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

export const FACTOR_WEB_TITLE_MAX_LENGTH = COMPONENT_TEXT_LIMITS.factorWeb.title

export function getFactorWebTitle(block = {}) {
  return block.title || block.kicker || block.question || ''
}

// Compute an elliptical radial position for each outer node. The web keeps
// six short labels comfortably readable at 390px while preserving a clear
// centre-to-factor relationship.
export function getFactorNodePosition(index, total) {
  const angle = (index * (360 / Math.max(total, 1)) - 90) * (Math.PI / 180)
  return {
    x: 50 + 39 * Math.cos(angle),
    y: 50 + 39 * Math.sin(angle),
  }
}

export function getFactorConnector(position) {
  const centre = { x: 50, y: 52 }
  const target = { x: position.x, y: position.y * 1.04 }
  const dx = target.x - centre.x
  const dy = target.y - centre.y
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
  const ux = dx / distance
  const uy = dy / distance

  return {
    start: {
      x: centre.x + ux * 15,
      y: centre.y + uy * 15,
    },
    end: {
      x: target.x - ux * 8,
      y: target.y - uy * 8,
    },
  }
}

function exploredIndexes(factors, explored) {
  return factors
    .map((factor, index) => explored.has(factor.id) ? index : null)
    .filter(index => index !== null)
}

function FactorDetail({ factor, accent, rgb, prefersReduced }) {
  const transition = prefersReduced
    ? { duration: 0 }
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

function CentreFocal({ block, centreLabel, accent, rgb, prefersReduced }) {
  const centreImage = block.centreImage || block.centerImage
  const centreImageAlt = block.centreImageAlt || block.centerImageAlt || centreLabel

  return (
    <motion.div
      initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.42, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        translate: '-50% -50%',
        width: 126,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <div
        role={centreImage ? undefined : 'img'}
        aria-label={centreImage ? undefined : `${centreLabel}. Central idea in the factor web.`}
        style={{
          position: 'relative',
          width: 106,
          height: 106,
          flexShrink: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: centreImage ? 0 : SPACING.micro,
          boxSizing: 'border-box',
          background: centreImage ? 'rgba(8,8,8,0.92)' : `rgba(${rgb},0.07)`,
          border: `1.5px solid rgba(${rgb},0.72)`,
          boxShadow: `0 0 0 6px rgba(${rgb},0.035), 0 14px 34px rgba(0,0,0,0.34)`,
        }}
      >
        {centreImage ? (
          <img
            src={centreImage}
            alt={centreImageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: block.centreImagePosition || block.centerImagePosition || 'center 22%',
              filter: 'saturate(0.82) contrast(1.05) brightness(0.82)',
            }}
          />
        ) : (
          <span style={{
            ...TYPE.titleMedium,
            color: `rgba(${rgb},0.94)`,
          }}>
            {centreLabel}
          </span>
        )}

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            border: `1px solid rgba(${rgb},0.16)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {centreImage && (
        <div style={{
          ...TYPE.titleMedium,
          color: accent,
          textAlign: 'center',
          marginTop: 7,
          maxWidth: 126,
        }}>
          {centreLabel}
        </div>
      )}
    </motion.div>
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
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            width: '72%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${rgb},0.07) 0%, rgba(${rgb},0.025) 38%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

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
          <circle cx="50" cy="52" r="23" fill="none" stroke={accent} strokeWidth="0.28" opacity="0.10" />
          <circle cx="50" cy="52" r="34" fill="none" stroke={accent} strokeWidth="0.22" opacity="0.06" />

          {factors.map((factor, index) => {
            const position = getFactorNodePosition(index, factors.length)
            const connector = getFactorConnector(position)
            const isActive = factor.id === activeId
            const isExplored = explored.has(factor.id)
            const opacity = isActive ? 0.82 : isExplored ? 0.56 : 0.24

            return (
              <g key={factor.id}>
                <motion.path
                  d={`M ${connector.start.x} ${connector.start.y} L ${connector.end.x} ${connector.end.y}`}
                  stroke={accent}
                  strokeWidth={isActive ? '0.72' : '0.48'}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: prefersReduced ? 1 : 0, strokeOpacity: 0.12 }}
                  animate={{ pathLength: 1, strokeOpacity: opacity }}
                  transition={prefersReduced
                    ? { duration: 0 }
                    : {
                        pathLength: { delay: 0.18 + index * 0.06, duration: 0.42, ease: 'easeOut' },
                        strokeOpacity: { duration: 0.2 },
                      }}
                />
                <motion.circle
                  cx={connector.end.x}
                  cy={connector.end.y}
                  r={isActive ? 1.45 : 1.05}
                  fill={accent}
                  initial={{ opacity: prefersReduced ? opacity : 0, scale: prefersReduced ? 1 : 0.7 }}
                  animate={{ opacity, scale: 1 }}
                  transition={prefersReduced ? { duration: 0 } : { delay: 0.34 + index * 0.06, duration: 0.22 }}
                />
              </g>
            )
          })}
        </svg>

        <CentreFocal
          block={block}
          centreLabel={centreLabel}
          accent={accent}
          rgb={rgb}
          prefersReduced={prefersReduced}
        />

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
              aria-label={`${isExplored ? 'Review' : 'Explore'} ${factor.title}`}
              aria-pressed={isActive}
              initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={nodeTransition(index)}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                translate: '-50% -50%',
                width: 'clamp(84px, 23vw, 98px)',
                minHeight: 54,
                padding: `${SPACING.micro}px 8px`,
                borderRadius: RADII.medium,
                border: isActive
                  ? `1.5px solid rgba(${rgb},0.82)`
                  : isExplored
                    ? `1px solid rgba(${rgb},0.38)`
                    : '1px solid rgba(255,255,255,0.11)',
                background: isActive
                  ? `rgba(${rgb},0.12)`
                  : 'rgba(15,14,12,0.82)',
                color: isActive
                  ? accent
                  : isExplored
                    ? `rgba(${rgb},0.90)`
                    : 'rgba(245,245,245,0.76)',
                boxShadow: isActive
                  ? `0 0 0 3px rgba(${rgb},0.09), 0 10px 28px rgba(0,0,0,0.30)`
                  : '0 8px 22px rgba(0,0,0,0.20)',
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
                    right: 7,
                    top: 7,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 0 8px rgba(${rgb},0.42)`,
                  }}
                />
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
// nodes around a central historical focal point, read the fuller teaching
// beneath, then choose and justify the factor they consider most important.
export default function FactorWeb({ block, subject = 'History', onContinue }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
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
  // FactorWeb phase at its heading rather than inheriting a stale scroll offset.
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

  // Legacy `kicker` values are promoted to the main heading rather than
  // rendered as a separate eyebrow. New content should use `title`.
  const explorationHeading = getFactorWebTitle(block)
  const heading = isJudgement
    ? (block.judgementTitle || 'Which factor mattered most?')
    : explorationHeading

  // A short paragraph is allowed when context is useful. Long legacy
  // taskPrompt copy is treated as supporting text, never as a screen title.
  const intro = isJudgement
    ? (block.judgementInstruction || block.taskPrompt || 'Choose one factor, then explain your judgement.')
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
