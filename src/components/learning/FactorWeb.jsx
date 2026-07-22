import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { COMPONENT_TEXT_LIMITS } from '../../constants/contentLimits.js'
import {
  FACTOR_WEB_LAYOUT,
  FACTOR_WEB_MOTION,
  FACTOR_WEB_VISUAL,
} from '../../constants/factorWeb.js'
import { GENERAL } from '../../constants/generalTheme.js'
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

const subjectRgba = (rgb, opacity) => `rgba(${rgb},${opacity})`

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

export function getFocalAnchorX(side, focalAnchorY) {
  const verticalOffset = focalAnchorY - FACTOR_WEB_LAYOUT.focalCenterY
  const connectorRadius = Math.max(
    FACTOR_WEB_LAYOUT.focalRadius - FACTOR_WEB_LAYOUT.connectorUnderlap,
    0,
  )
  const horizontalOffset = Math.sqrt(
    Math.max(connectorRadius ** 2 - verticalOffset ** 2, 0),
  )

  return FACTOR_WEB_LAYOUT.focalCenterX + (side === 'left' ? -horizontalOffset : horizontalOffset)
}

export function getFactorSlot(side, index, count) {
  const rows = rowsForCount(count)
  const focalRows = focalRowsForCount(count)
  return {
    side,
    x: FACTOR_WEB_LAYOUT.nodeX[side],
    y: rows[index],
    nodeAnchorX: FACTOR_WEB_LAYOUT.nodeAnchorX[side],
    focalAnchorX: getFocalAnchorX(side, focalRows[index]),
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
    : {
        duration: FACTOR_WEB_MOTION.duration.standard,
        ease: FACTOR_WEB_MOTION.ease,
      }

  return (
    <motion.section
      key={factor.id}
      aria-live="polite"
      initial={{
        opacity: prefersReduced ? 1 : 0,
        y: prefersReduced ? 0 : FACTOR_WEB_MOTION.detailEnterY,
      }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: prefersReduced ? 0 : FACTOR_WEB_MOTION.detailExitY,
      }}
      transition={transition}
      style={{
        padding: SPACING.standard,
        borderRadius: RADII.large,
        background: GENERAL.surfaceTint,
        border: `${FACTOR_WEB_VISUAL.borderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.detailBorderOpacity)}`,
      }}
    >
      <h2 style={{
        ...TYPE.displayCard,
        color: GENERAL.cinematic.textPrimary,
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
        borderTop: `${FACTOR_WEB_VISUAL.borderWidth}px solid ${GENERAL.line.soft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
      }}>
        <div>
          <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
            What it means
          </p>
          <p style={{ ...TYPE.body, color: GENERAL.cinematic.textSecondary, margin: 0 }}>
            {factor.whatItMeans}
          </p>
        </div>

        <div>
          <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
            Why it mattered
          </p>
          <p style={{ ...TYPE.body, color: GENERAL.cinematic.textSecondary, margin: 0 }}>
            {factor.whyItMattered}
          </p>
        </div>

        {factor.linkedFactor && (
          <div style={{
            borderLeft: `${FACTOR_WEB_VISUAL.linkedBorderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.linkedBorderOpacity)}`,
            paddingLeft: SPACING.compact,
          }}>
            <p style={{
              ...TYPE.label,
              color: subjectRgba(rgb, FACTOR_WEB_VISUAL.linkedLabelOpacity),
              margin: `0 0 ${SPACING.micro}px`,
            }}>
              Linked factor
            </p>
            <p style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, margin: 0 }}>
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
  const centreImagePosition = block.centreImagePosition
    || block.centerImagePosition
    || FACTOR_WEB_VISUAL.focalImagePosition

  return (
    <motion.div
      initial={{
        opacity: prefersReduced ? 1 : 0,
        scale: prefersReduced ? 1 : FACTOR_WEB_MOTION.centreInitialScale,
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced
        ? { duration: 0 }
        : {
            duration: FACTOR_WEB_MOTION.duration.slow,
            ease: FACTOR_WEB_MOTION.ease,
          }}
      style={{
        position: 'absolute',
        left: `${FACTOR_WEB_LAYOUT.focalCenterX}%`,
        top: `${FACTOR_WEB_LAYOUT.focalCenterY}%`,
        translate: '-50% -50%',
        width: `${FACTOR_WEB_LAYOUT.focalDiameter}%`,
        aspectRatio: '1',
        zIndex: 3,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
          width: `${FACTOR_WEB_VISUAL.haloScale * 100}%`,
          aspectRatio: '1',
          borderRadius: '50%',
          background: subjectRgba(rgb, FACTOR_WEB_VISUAL.haloOpacity),
          filter: `blur(${FACTOR_WEB_VISUAL.haloBlur}px)`,
          opacity: FACTOR_WEB_VISUAL.haloLayerOpacity,
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${subjectRgba(rgb, FACTOR_WEB_VISUAL.haloCoreOpacity)}, transparent ${FACTOR_WEB_VISUAL.haloCoreStop}%)`,
          boxShadow: `0 0 ${FACTOR_WEB_VISUAL.focalGlowBlur}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.focalGlowOpacity)}`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div
        role={centreImage ? undefined : 'img'}
        aria-label={centreImage ? undefined : `Image placeholder for ${centreLabel}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: centreImage
            ? GENERAL.backgroundApp
            : subjectRgba(rgb, FACTOR_WEB_VISUAL.focalPlaceholderFillOpacity),
          border: `${FACTOR_WEB_VISUAL.activeBorderWidth}px ${centreImage ? 'solid' : 'dashed'} ${subjectRgba(rgb, FACTOR_WEB_VISUAL.focalBorderOpacity)}`,
          boxShadow: [
            `0 0 0 ${FACTOR_WEB_VISUAL.focalOuterRingWidth}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.focalOuterRingOpacity)}`,
            `0 0 ${FACTOR_WEB_VISUAL.focalGlowBlur}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.focalGlowOpacity)}`,
            GENERAL.shadow.overlay,
          ].join(', '),
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
              objectPosition: centreImagePosition,
              filter: FACTOR_WEB_VISUAL.focalImageFilter,
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
            border: `${FACTOR_WEB_VISUAL.borderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.focalRingOpacity)}`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <div style={{
        ...TYPE.titleMedium,
        position: 'absolute',
        top: `calc(100% + ${FACTOR_WEB_LAYOUT.focalLabelGap}px)`,
        left: '50%',
        translate: '-50% 0',
        width: FACTOR_WEB_LAYOUT.focalColumnWidth,
        color: accent,
        textAlign: 'center',
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
    filter: `drop-shadow(0 0 ${FACTOR_WEB_VISUAL.anchorGlowRadius}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.anchorGlowOpacity)})`,
  }

  return (
    <g key={`connector-${entry.factor.id}`}>
      <motion.path
        d={getFactorConnectorPath(slot)}
        stroke={accent}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{
          pathLength: prefersReduced ? 1 : 0,
          strokeOpacity: FACTOR_WEB_VISUAL.connectorInitialOpacity,
        }}
        animate={{ pathLength: 1, strokeOpacity: opacity }}
        transition={prefersReduced
          ? { duration: 0 }
          : {
              pathLength: {
                delay: FACTOR_WEB_MOTION.connectorDelay
                  + entry.originalIndex * FACTOR_WEB_MOTION.connectorStagger,
                duration: FACTOR_WEB_MOTION.duration.slow,
                ease: FACTOR_WEB_MOTION.ease,
              },
              strokeOpacity: { duration: FACTOR_WEB_MOTION.duration.fast },
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
        transition={prefersReduced
          ? { duration: 0 }
          : {
              delay: FACTOR_WEB_MOTION.anchorDelay
                + entry.originalIndex * FACTOR_WEB_MOTION.connectorStagger,
              duration: FACTOR_WEB_MOTION.duration.fast,
            }}
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
      initial={{
        opacity: prefersReduced ? 1 : 0,
        scale: prefersReduced ? 1 : FACTOR_WEB_MOTION.nodeInitialScale,
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={prefersReduced
        ? { duration: 0 }
        : {
            delay: FACTOR_WEB_MOTION.nodeDelay
              + entry.originalIndex * FACTOR_WEB_MOTION.nodeStagger,
            duration: FACTOR_WEB_MOTION.duration.standard,
            ease: FACTOR_WEB_MOTION.ease,
          }}
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
          ? `${FACTOR_WEB_VISUAL.activeBorderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.nodeActiveBorderOpacity)}`
          : isExplored
            ? `${FACTOR_WEB_VISUAL.borderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.nodeExploredBorderOpacity)}`
            : `${FACTOR_WEB_VISUAL.borderWidth}px solid ${GENERAL.line.medium}`,
        background: isActive
          ? subjectRgba(rgb, FACTOR_WEB_VISUAL.nodeActiveFillOpacity)
          : GENERAL.backgroundSunken,
        color: isActive
          ? accent
          : isExplored
            ? subjectRgba(rgb, FACTOR_WEB_VISUAL.nodeExploredTextOpacity)
            : GENERAL.cinematic.textSecondary,
        boxShadow: isActive
          ? `0 0 0 ${FACTOR_WEB_VISUAL.nodeActiveRingWidth}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.nodeActiveRingOpacity)}, ${GENERAL.shadow.raised}`
          : GENERAL.shadow.raised,
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
            width: FACTOR_WEB_LAYOUT.exploredIndicatorSize,
            height: FACTOR_WEB_LAYOUT.exploredIndicatorSize,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 ${FACTOR_WEB_VISUAL.exploredIndicatorGlowRadius}px ${subjectRgba(rgb, FACTOR_WEB_VISUAL.exploredIndicatorGlowOpacity)}`,
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
  const centreLabel = block.centreLabel
    || block.centerLabel
    || DEFAULT_CENTRE_LABELS[block.mode]
    || 'Key factors'
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
          viewBox={FACTOR_WEB_LAYOUT.canvasViewBox}
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
          color: subjectRgba(rgb, FACTOR_WEB_VISUAL.linkedLabelOpacity),
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
    : {
        duration: FACTOR_WEB_MOTION.duration.standard,
        ease: FACTOR_WEB_MOTION.ease,
      }

  return (
    <motion.div
      initial={{
        opacity: prefersReduced ? 1 : 0,
        y: prefersReduced ? 0 : FACTOR_WEB_MOTION.judgementEnterY,
      }}
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
                minHeight: FACTOR_WEB_LAYOUT.judgementOptionMinHeight,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.micro,
                textAlign: 'left',
                padding: `${SPACING.micro}px ${SPACING.compact}px`,
                borderRadius: RADII.medium,
                border: isSelected
                  ? `${FACTOR_WEB_VISUAL.activeBorderWidth}px solid ${accent}`
                  : `${FACTOR_WEB_VISUAL.borderWidth}px solid ${GENERAL.line.medium}`,
                background: isSelected
                  ? subjectRgba(rgb, FACTOR_WEB_VISUAL.judgementSelectedFillOpacity)
                  : GENERAL.surfaceTint,
                color: isSelected ? accent : GENERAL.cinematic.textSecondary,
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
            initial={{
              opacity: prefersReduced ? 1 : 0,
              y: prefersReduced ? 0 : FACTOR_WEB_MOTION.revealEnterY,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
            style={{
              padding: SPACING.standard,
              borderRadius: RADII.large,
              background: GENERAL.surfaceTint,
              border: `${FACTOR_WEB_VISUAL.borderWidth}px solid ${subjectRgba(rgb, FACTOR_WEB_VISUAL.detailBorderOpacity)}`,
            }}
          >
            <h2 style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, margin: 0 }}>
              Explain your judgement
            </h2>
            <p style={{
              ...TYPE.body,
              color: GENERAL.cinematic.textSecondary,
              margin: `${SPACING.micro}px 0 0`,
            }}>
              {block.judgementPrompt || 'Use one piece of evidence. Explain why your factor mattered and how it linked to another factor.'}
            </p>

            {block.thinkingTip && (
              <div style={{
                marginTop: SPACING.compact,
                paddingTop: SPACING.compact,
                borderTop: `${FACTOR_WEB_VISUAL.borderWidth}px solid ${GENERAL.line.soft}`,
              }}>
                <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.micro}px` }}>
                  Thinking tip
                </p>
                <p style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, margin: 0 }}>
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

// ── FactorWeb v1 — LOCKED COMPONENT ──────────────────────────────────────────
// A mobile-first causation and judgement screen. Factors sit in two balanced
// columns around one focal image (or a governed image placeholder), then expand
// into teaching and a supported relative-importance judgement.
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
          padding: `${SPACING.compact}px 0 ${FACTOR_WEB_LAYOUT.scrollBottomClearance}px`,
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
                color: GENERAL.cinematic.textMuted,
                margin: `${SPACING.compact}px 0 0`,
                maxWidth: FACTOR_WEB_LAYOUT.introMaxWidth,
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
                transition={prefersReduced
                  ? { duration: 0 }
                  : { duration: FACTOR_WEB_MOTION.duration.standard }}
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
                    initial={{
                      opacity: prefersReduced ? 1 : 0,
                      y: prefersReduced ? 0 : FACTOR_WEB_MOTION.revealEnterY,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReduced
                      ? { duration: 0 }
                      : {
                          duration: FACTOR_WEB_MOTION.duration.standard,
                          ease: FACTOR_WEB_MOTION.ease,
                        }}
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
