import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import {
  arcPath,
  normaliseAngle,
  rightAngleMarkerPath,
  sectorPath,
  snapAngle,
  toRadians,
} from './angle/angleGeometry.js'
import { clampPresetValue, resolveAnglePreset } from './angle/anglePresets.js'
import { createAngleVisualRoles } from './angle/angleVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The handle breathes gently until the learner's first interaction, then stays
// still — one calm cue toward the single draggable element, never a reward
// animation. Colour changes settle with the standard fast fade.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes angle-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    .angle-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .angle-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .angle-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .angle-explore__handle-hint .angle-explore__handle-ring {
      animation: angle-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .angle-explore__handle:focus-visible {
      filter: drop-shadow(0 0 4px var(--angle-explore-glow));
    }

    .angle-explore__sector-fill,
    .angle-explore__sector-edge {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .angle-explore--reduced-motion .angle-explore__handle-hint .angle-explore__handle-ring {
      animation: none;
    }

    .angle-explore--reduced-motion .angle-explore__sector-fill,
    .angle-explore--reduced-motion .angle-explore__sector-edge {
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .angle-explore__handle-hint .angle-explore__handle-ring {
        animation: none;
      }

      .angle-explore__sector-fill,
      .angle-explore__sector-edge {
        transition: none;
      }
    }
  `
  document.head.appendChild(el)
}

// Arrowhead drawn inline (rather than an SVG marker) so each ray's arrow
// inherits that ray's tone without per-instance marker definitions.
function arrowheadPath(x2, y2, angleDeg) {
  const rad = toRadians(angleDeg)
  const dirX = Math.cos(rad)
  const dirY = -Math.sin(rad)
  const tipX = x2 + dirX * 10
  const tipY = y2 + dirY * 10
  const perpX = -dirY * 4.5
  const perpY = dirX * 4.5
  return `M ${tipX} ${tipY} L ${x2 + perpX} ${y2 + perpY} L ${x2 - perpX} ${y2 - perpY} Z`
}

/**
 * Configuration-driven GCSE angle diagram — the Maths sibling of
 * CircuitDiagram. Shapes and angles render as SVG; one value (a draggable ray,
 * or a triangle's apex) is learner-controlled, and every sector value, label
 * and the angle-fact status line respond live.
 *
 * The component owns diagram state and the drag/keyboard interaction only.
 * Questions, predictions, exam tasks and marking belong to the page that
 * composes the diagram.
 *
 * `preset` may be a registered preset name (`angleTypes`, `straightLine`,
 * `aroundPoint`, `verticallyOpposite`, `triangle`) or a compatible preset
 * object. `interactive={false}` turns any preset into a static teaching or
 * exam diagram at a fixed `value`.
 */
function AngleExplore({
  preset = 'angleTypes',
  value,
  defaultValue,
  onChange,
  interactive,
  disabled = false,
  subject = 'Maths',
  reducedMotion,
  label,
  showStatus = true,
}) {
  ensureStyles()

  const presetConfig = resolveAnglePreset(preset)
  const canvas = presetConfig.canvas
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createAngleVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled

  const isControlled = typeof value === 'number'
  const [internalValue, setInternalValue] = useState(() =>
    clampPresetValue(presetConfig, defaultValue ?? presetConfig.initialValue),
  )

  useEffect(() => {
    setInternalValue(clampPresetValue(presetConfig, defaultValue ?? presetConfig.initialValue))
    setHasInteracted(false)
  }, [presetConfig, defaultValue])

  const current = clampPresetValue(presetConfig, isControlled ? value : internalValue)
  const scene = presetConfig.derive(current)

  const setValue = (next) => {
    const clamped = clampPresetValue(presetConfig, next)
    if (clamped === current) return
    if (!isControlled) setInternalValue(clamped)
    onChange?.(clamped)
  }

  const svgPointFromEvent = (event) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const handlePointerDown = (event) => {
    if (!canInteract) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setHasInteracted(true)
  }

  const handlePointerMove = (event) => {
    if (!dragging || !canInteract) return
    const point = svgPointFromEvent(event)
    if (!point) return
    setValue(snapAngle(presetConfig.valueFromPointer(point), presetConfig.snapTargets))
  }

  const handlePointerEnd = () => setDragging(false)

  const handleKeyDown = (event) => {
    if (!canInteract) return
    const step = presetConfig.step
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + step
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - step
    if (event.key === 'Home') next = presetConfig.min
    if (event.key === 'End') next = presetConfig.max
    if (next === null) return
    event.preventDefault()
    setHasInteracted(true)
    setValue(next)
  }

  const resolveTone = tone => roles[tone] ?? tone ?? roles.structure
  // Sector labels take their sector's edge colour so equal angles read as
  // colour — except sector C, whose tertiary tone is too dark for text.
  const sectorLabelFill = tone => (tone === 'C' ? roles.textPrimary : roles[`sector${tone}`])

  const interactionHint = canInteract && !hasInteracted && !reduceMotion

  return (
    <div
      className={`angle-explore${reduceMotion ? ' angle-explore--reduced-motion' : ''}`}
      data-angle-preset={presetConfig.id}
      data-angle-interactive={canInteract ? 'true' : 'false'}
      data-angle-value={current}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        '--angle-explore-glow': roles.focusGlow,
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-angle-canvas={`${canvas.width}x${canvas.height}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${canvas.width} / ${canvas.height}`,
          overflow: 'visible',
        }}
      >
        <title id={titleId}>{label ?? presetConfig.accessibilityLabel}</title>
        <desc id={descriptionId}>
          {[
            presetConfig.keyFact,
            canInteract
              ? 'Use the angle handle to change the diagram.'
              : 'This diagram is shown as a static illustration.',
          ].join(' ')}
        </desc>

        {(scene.shapes ?? []).map(shape => (
          <path
            key={shape.id}
            data-angle-shape={shape.id}
            d={shape.path}
            fill={shape.fillTone ? resolveTone(shape.fillTone) : 'none'}
            stroke={resolveTone(shape.strokeTone)}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}

        {scene.sectors.map((sector) => {
          const sweep = normaliseAngle(sector.end - sector.start)
          const isRightAngle = sweep === 90
          return (
            <g key={sector.id} data-angle-sector={sector.id} data-angle-sweep={sweep}>
              <path
                className="angle-explore__sector-fill"
                d={sectorPath(sector.cx, sector.cy, sector.start, sector.end, sector.radius)}
                fill={roles[`sector${sector.tone}Soft`]}
              />
              {isRightAngle ? (
                <path
                  data-angle-right-marker="true"
                  d={rightAngleMarkerPath(sector.cx, sector.cy, sector.start, sector.radius * 0.55)}
                  fill="none"
                  stroke={roles[`sector${sector.tone}`]}
                  strokeWidth={2}
                  strokeLinejoin="miter"
                />
              ) : (
                <path
                  className="angle-explore__sector-edge"
                  d={arcPath(sector.cx, sector.cy, sector.start, sector.end, sector.radius)}
                  fill="none"
                  stroke={roles[`sector${sector.tone}`]}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}
            </g>
          )
        })}

        {scene.rays.map(ray => (
          <g key={ray.id} data-angle-ray={ray.id}>
            <line
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke={resolveTone(ray.tone)}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {ray.arrow && (
              <path
                d={arrowheadPath(
                  ray.x2,
                  ray.y2,
                  (Math.atan2(ray.y1 - ray.y2, ray.x2 - ray.x1) * 180) / Math.PI,
                )}
                fill={resolveTone(ray.tone)}
              />
            )}
          </g>
        ))}

        <g fontFamily="Sora, sans-serif" aria-hidden="true">
          {scene.sectors.map(sector => (
            <text
              key={`${sector.id}-label`}
              data-angle-sector-label={sector.id}
              x={sector.label.x}
              y={sector.label.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={15}
              fontWeight={700}
              fill={sectorLabelFill(sector.tone)}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {sector.label.text}
            </text>
          ))}
          {(scene.points ?? []).map(point => (
            <text
              key={point.id}
              data-angle-point={point.id}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontStyle="italic"
              fill={roles.textSecondary}
            >
              {point.text}
            </text>
          ))}
        </g>

        {scene.handle && canInteract && (
          <g
            className={`angle-explore__handle${interactionHint ? ' angle-explore__handle-hint' : ''}`}
            data-dragging={dragging || undefined}
            role="slider"
            tabIndex={0}
            aria-label={presetConfig.handleLabel}
            aria-valuemin={presetConfig.min}
            aria-valuemax={presetConfig.max}
            aria-valuenow={current}
            aria-valuetext={presetConfig.valueText(current)}
            aria-describedby={showStatus ? statusId : descriptionId}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
          >
            <circle
              data-angle-hit-target="true"
              cx={scene.handle.x}
              cy={scene.handle.y}
              r={26}
              fill="transparent"
            />
            <circle
              className="angle-explore__handle-ring"
              cx={scene.handle.x}
              cy={scene.handle.y}
              r={12}
              fill="none"
              stroke={roles.interaction}
              strokeWidth={1.5}
              opacity={0.55}
            />
            <circle
              cx={scene.handle.x}
              cy={scene.handle.y}
              r={7}
              fill={roles.interaction}
            />
          </g>
        )}
      </svg>

      {showStatus && (
        <div
          id={statusId}
          aria-live={canInteract ? 'polite' : undefined}
          aria-atomic="true"
          style={{
            minHeight: 62,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              ...TYPE.displayCard,
              color: scene.status.headingTone
                ? resolveTone(scene.status.headingTone)
                : roles.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {scene.status.heading}
          </div>
          <div
            style={{
              ...TYPE.bodySmall,
              color: roles.textSecondary,
              marginTop: 4,
            }}
          >
            {scene.status.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

export default AngleExplore
