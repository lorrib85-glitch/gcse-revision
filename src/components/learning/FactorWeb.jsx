import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { COMPONENT_TEXT_LIMITS } from '../../constants/contentLimits.js'
import { FACTOR_WEB_LAYOUT, FACTOR_WEB_VISUAL } from '../../constants/factorWeb.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { ScreenTitle } from '../core/ScreenText.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
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

export function splitFactorColumns(factors = []) {
  const midpoint = Math.ceil(factors.length / 2)
  return {
    left: factors.slice(0, midpoint).map((factor, index) => ({
      factor,
      originalIndex: index,
      side: 'left',
    })),
    right: factors.slice(midpoint).map((factor, index) => ({
      factor,
      originalIndex: midpoint + index,
      side: 'right',
    })),
  }
}

function rowsForCount(count) {
  return FACTOR_WEB_LAYOUT.rowsByCount[count] || FACTOR_WEB_LAYOUT.rowsByCount[3]
}

function focalRowsForCount(count) {
  return FACTOR_WEB_LAYOUT.focalRowsByCount[count] || FACTOR_WEB_LAYOUT.focalRowsByCount[3]
}

export function getFactorSlot(side, index, count) {
  const rows = rowsForCount(count)
  const focalRows = focalRowsForCount(count)
  return {
    side,
    x: FACTOR_WEB_LAYOUT.nodeX[side],
    y: rows[index],
    nodeAnchorX: FACTOR_WEB_LAYOUT.nodeAnchorX[side],
    focalAnchorX: FACTOR_WEB_LAYOUT.focalAnchorX[side],
    focalAnchorY: focalRows[index],
  }
}

export function getFactorConnectorPath(slot) {
  const direction = slot.side === 'left' ? 1 : -1
  const offset = FACTOR_WEB_LAYOUT.connectorControlOffset * direction
  return [
    `M ${slot.nodeAnchorX} ${slot.y}`,
    `C ${slot.nodeAnchorX + offset} ${slot.y}`,
    `${slot.focalAnchorX - offset} ${slot.focalAnchorY}`,
    `${slot.focalAnchorX} ${slot.focalAnchorY}`,
  ].join(' ')
}

function exploredIndexes(factors, explored) {
  return factors
    .map((factor, index) => explored.has(factor.id) ? index : null)
    .filter(index => index !== null)
}

function FocalPlaceholderGlyph({ accent }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <rect
        x="4.5"
        y="6.5"
        width="25"
        height="21"
        rx="3.5"
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        opacity="0.68"
      />
      <circle cx="12" cy="14" r="2.4" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.68" />
      <path
        d="M7 25 L14 18 L19 23 L23 19 L28 24"
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.68"
      />
    </svg>
  )
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
          <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
            What it means
          </p>
          <p style={{ ...TYPE.body, color: 'rgba(245,245,245,0.78)', margin: 0 }}>
            {factor.whatItMeans}
          </p>
        </div>

        <div>
          <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
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
            <p style={{ ...TYPE.label, color: `rgba(${rgb},0.82)`, margin: `0 0 ${SPACING.micro}px` }}>
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
  const centreImageAlt = block.centreImageAlt || block.centerImageAlt

  return (
    <motion.div
      initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.42, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: '50%',
        top: `${FACTOR_WEB_LAYOUT.focalCenterY}%`,
        translate: '-50% -50%',
        width: FACTOR_WEB_LAYOUT.focalColumnWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          translate: '-50% -20%',
          width: FACTOR_WEB_VISUAL.haloSize,
          height: FACTOR_WEB_VISUAL.haloSize,
          borderRadius: '50%',
          background: `rgba(${rgb},${FACTOR_WEB_VISUAL.haloOpacity})`,
          filter: `blur(${FACTOR_WEB_VISUAL.haloBlur}px)`,
          opacity: 0.74,
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          translate: '-50% -4%',
          width: FACTOR_WEB_LAYOUT.focalSize,
          height: FACTOR_WEB_LAYOUT.focalSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${rgb},${FACTOR_WEB_VISUAL.haloCoreOpacity}), transparent 68%)`,
          boxShadow: `0 0 30px rgba(${rgb},0.30)`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div
        role={centreImage ? undefined : 'img'}
        aria-label={centreImage ? undefined : `Image placeholder for ${centreLabel}`}
        style={{
          position: 'relative',
          width: FACTOR_WEB_LAYOUT.focalSize,
          height: FACTOR_WEB_LAYOUT.focalSize,
          flexShrink: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: centreImage ? 'rgba(8,8,8,0.94)' : `rgba(${rgb},0.055)`,
          border: `1.5px ${centreImage ? 'solid' : 'dashed'} rgba(${rgb},0.76)`,
          boxShadow: `0 0 0 5px rgba(${rgb},0.045), 0 0 26px rgba(${rgb},0.24), 0 16px 36px rgba(0,0,0,0.36)`,
        }}
      >
        {centreImage ? (
          <img
            src={centreImage}
            alt={centreImageAlt || centreLabel}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: block.centreImagePosition || block.centerImagePosition || 'center 22%',
              filter: 'saturate(0.82) contrast(1.05) brightness(0.84)',
            }}
          />
        ) : (
          <FocalPlaceholderGlyph accent={accent} />
        )}

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: FACTOR_WEB_LAYOUT.focalRingInset,
            borderRadius: '50%',
            border: `1px solid rgba(${rgb},0.20)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div style={{
        ...TYPE.titleMedium,
        color: accent,
        textAlign: 'center',
        marginTop: FACTOR_WEB_LAYOUT.focalLabelGap,
        maxWidth: FACTOR_WEB_LAYOUT.focalColumnWidth,
      }}>
        {centreLabel}
      </div>
    </motion.div>
  )
}

function FactorConnector({ entry, slot, accent, rgb, isActive, isExplored, prefersReduced }) {
  const opacity = isActive
    ? FACTOR_WEB_VISUAL.connectorActiveOpacity
    : isExplored
      ? FACTOR_WEB_VISUAL.connectorExploredOpacity
      : FACTOR_WEB_VISUAL.connectorIdleOpacity

  const strokeWidth = isActive
    ? FACTOR_WEB_VISUAL.connectorActiveWidth
    : FACTOR_WEB_VISUAL.connectorIdleWidth

  const anchorRadius = isActive
    ? FACTOR_WEB_VISUAL.anchorActiveRadius
    : FACTOR_WEB_VISUAL.anchorIdleRadius

  const dotStyle = {
    filter: `drop-shadow(0 0 ${FACTOR_WEB_VISUAL.anchorGlowRadius}px rgba(${rgb},0.48))`,
  }

  return (
    <g key={`connector-${entry.factor.id}`}>
      <motion.path
        d={getFactorConnectorPath(slot)}
        stroke={accent}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: prefersReduced ? 1 : 0, strokeOpacity: 0.08 }}
        animate={{ pathLength: 1, strokeOpacity: opacity }}
        transition={prefersReduced
          ? { duration: 0 }
          : {
              pathLength: { delay: 0.16 + entry.originalIndex * 0.06, duration: 0.44, ease: 'easeOut' },
              strokeOpacity: { duration: 0.2 },
            }}
      />

      <motion.circle
        cx={slot.nodeAnchorX}
        cy={slot.y}
        r={anchorRadius}
        fill={accent}
        style={dotStyle}
        initial={{ opacity: prefersReduced ? opacity : 0 }}
        animate={{ opacity }}
        transition={prefersReduced ? { duration: 0 } : { delay: 0.30 + entry.originalIndex * 0.06, duration: 0.22 }}
      />
    </g>
  )
}

function FactorNode({ entry, slot, activeId, explored, onNodeTap, accent, rgb, prefersReduced }) {
  const factor = entry.factor
  const isActive = factor.id === activeId
  const isExplored = explored.has(factor.id)
  const nodeLabel = factor.shortTitle || factor.title

  return (
    <motion.button
      type="button"
      onClick={() => onNodeTap(factor)}
      aria-label={`${isExplored ? 'Review' : 'Explore'} ${factor.title}`}
      aria-pressed={isActive}
      initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced
        ? { duration: 0 }
        : { delay: 0.26 + entry.originalIndex * 0.07, duration: 0.32, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        translate: '-50% -50%',
        width: FACTOR_WEB_LAYOUT.nodeWidth,
        minHeight: FACTOR_WEB_LAYOUT.nodeMinHeight,
        padding: `${SPACING.micro}px ${SPACING.compact}px`,
        borderRadius: RADII.medium,
        border: isActive
          ? `1.5px solid rgba(${rgb},0.82)`
          : isExplored
            ? `1px solid rgba(${rgb},0.36)`
            : '1px solid rgba(255,255,255,0.11)',
        background: isActive
          ? `rgba(${rgb},0.11)`
          : 'rgba(15,14,12,0.84)',
        color: isActive
          ? accent
          : isExplored
            ? `rgba(${rgb},0.88)`
            : 'rgba(245,245,245,0.76)',
        boxShadow: isActive
          ? `0 0 0 3px rgba(${rgb},0.08), 0 10px 26px rgba(0,0,0,0.30)`
          : '0 8px 20px rgba(0,0,0,0.18)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 4,
        WebkitTapHighlightColor: 'transparent',
        transition: [
          `border-color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
          `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
          `color ${MOTION.duration.fast} ${MOTION.easing.standard}`,
          `box-shadow ${MOTION.duration.fast} ${MOTION.easing.standard}`,
        ].join(', '),
      }}
    >
      <span style={{ ...TYPE.bodySmall, color: 'inherit' }}>
        {nodeLabel}
      </span>

      {isExplored && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: SPACING.micro,
            top: SPACING.micro,
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
  const columns = splitFactorColumns(factors)
  const entries = [...columns.left, ...columns.right]

  const slots = new Map()
  columns.left.forEach((entry, index) => {
    slots.set(entry.factor.id, getFactorSlot('left', index, columns.left.length))
  })
  columns.right.forEach((entry, index) => {
    slots.set(entry.factor.id, getFactorSlot('right', index, columns.right.length))
  })

  return (
    <>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: FACTOR_WEB_LAYOUT.canvasMaxWidth,
        aspectRatio: FACTOR_WEB_LAYOUT.canvasAspectRatio,
        margin: '0 auto',
      }}>
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {entries.map(entry => {
            const factor = entry.factor
            const slot = slots.get(factor.id)
            return (
              <FactorConnector
                key={factor.id}
                entry={entry}
                slot={slot}
                accent={accent}
                rgb={rgb}
                isActive={factor.id === activeId}
                isExplored={explored.has(factor.id)}
                prefersReduced={prefersReduced}
              />
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

        {entries.map(entry => (
          <FactorNode
            key={entry.factor.id}
            entry={entry}
            slot={slots.get(entry.factor.id)}
            activeId={activeId}
            explored={explored}
            onNodeTap={onNodeTap}
            accent={accent}
            rgb={rgb}
            prefersReduced={prefersReduced}
          />
        ))}
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
                <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
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
// A mobile-first causation and judgement screen. Factors sit in two balanced
// columns around one historical focal image (or a governed image placeholder),
// then expand into teaching and a supported relative-importance judgement.
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

  const explorationHeading = getFactorWebTitle(block)
  const heading = isJudgement
    ? (block.judgementTitle || 'Which factor mattered most?')
    : explorationHeading

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
