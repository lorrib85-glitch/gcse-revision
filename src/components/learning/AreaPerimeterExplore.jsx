import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import {
  clampPresetValues,
  resolveAreaPerimeterPreset,
  resolvePresetFocus,
} from './areaPerimeter/areaPerimeterPresets.js'
import { createAreaPerimeterVisualRoles } from './areaPerimeter/areaPerimeterVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The first handle breathes gently until the learner's first interaction, then
// stays still — one calm cue toward the draggable dimensions, never a reward
// animation. Fills settle with the standard fast fade. Glow appears only on
// the focused handle.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes ap-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    .ap-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .ap-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .ap-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .ap-explore__handle-hint .ap-explore__handle-ring {
      animation: ap-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .ap-explore__handle:focus-visible {
      filter: drop-shadow(0 0 4px var(--ap-explore-glow));
    }

    .ap-explore__fill {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .ap-explore__option:focus-visible {
      outline: 2px solid var(--ap-explore-focus);
      outline-offset: 2px;
    }

    .ap-explore--reduced-motion .ap-explore__handle-hint .ap-explore__handle-ring {
      animation: none;
    }

    .ap-explore--reduced-motion .ap-explore__fill {
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .ap-explore__handle-hint .ap-explore__handle-ring {
        animation: none;
      }

      .ap-explore__fill {
        transition: none;
      }
    }
  `
  document.head.appendChild(el)
}

/**
 * Configuration-driven GCSE area and perimeter diagram — the mensuration
 * sibling of AngleExplore. Shapes render as inline SVG in model space (whole
 * centimetres mapped to pixels, never the reverse); learner-controlled
 * dimensions drive live perimeter traces, square-unit grids, decomposition
 * visuals and a stable result → calculation → explanation status area.
 *
 * The component owns the diagram, its handles, discrete decomposition choices
 * and triggered "why the formula works" reveals. Prediction questions,
 * marking, hints, scores and weakness tracking belong to the page that
 * composes it.
 *
 * `preset` may be a registered preset name (`rectangle`,
 * `fixedPerimeterRectangle`, `triangleArea`, `parallelogramArea`,
 * `trapeziumArea`, `compositeShape`) or a compatible preset object. `focus`
 * chooses between `perimeter`, `area` and `compare` where the preset supports
 * more than one. `interactive={false}` turns any preset into a static
 * teaching or exam diagram.
 */
function AreaPerimeterExplore({
  preset = 'rectangle',
  focus,
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

  const presetConfig = resolveAreaPerimeterPreset(preset)
  const canvas = presetConfig.canvas
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createAreaPerimeterVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const svgRef = useRef(null)
  const [draggingControl, setDraggingControl] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [method, setMethod] = useState(presetConfig.methods?.[0]?.id ?? null)
  const [revealed, setRevealed] = useState(false)

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled

  const isControlled = value != null && typeof value === 'object'
  const [internalValues, setInternalValues] = useState(() =>
    clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues),
  )

  useEffect(() => {
    setInternalValues(clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues))
    setMethod(presetConfig.methods?.[0]?.id ?? null)
    setRevealed(false)
    setHasInteracted(false)
  }, [presetConfig, defaultValue])

  const currentValues = clampPresetValues(presetConfig, isControlled ? value : internalValues)
  const effectiveFocus = resolvePresetFocus(presetConfig, focus)
  const scene = presetConfig.derive(currentValues, {
    focus: effectiveFocus,
    method,
    revealed,
  })

  const controlsById = useMemo(() => (
    Object.fromEntries(presetConfig.controls.map(control => [control.id, control]))
  ), [presetConfig])

  const setControlValue = (controlId, next) => {
    const nextValues = clampPresetValues(presetConfig, { ...currentValues, [controlId]: next })
    if (nextValues[controlId] === currentValues[controlId]) return
    if (!isControlled) setInternalValues(nextValues)
    onChange?.(nextValues)
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

  const handlePointerDown = controlId => (event) => {
    if (!canInteract) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingControl(controlId)
    setHasInteracted(true)
  }

  const handlePointerMove = controlId => (event) => {
    if (draggingControl !== controlId || !canInteract) return
    const point = svgPointFromEvent(event)
    if (!point) return
    setControlValue(controlId, controlsById[controlId].valueFromPointer(point, currentValues))
  }

  const handlePointerEnd = () => setDraggingControl(null)

  const handleKeyDown = controlId => (event) => {
    if (!canInteract) return
    const control = controlsById[controlId]
    const current = currentValues[controlId]
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + control.step
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - control.step
    if (event.key === 'Home') next = control.min
    if (event.key === 'End') next = control.max
    if (next === null) return
    event.preventDefault()
    setHasInteracted(true)
    setControlValue(controlId, next)
  }

  const resolveRole = role => (role ? roles[role] ?? role : undefined)
  const showMethods = canInteract
    && (presetConfig.methods?.length ?? 0) > 0
    && (presetConfig.methodsFocus == null || presetConfig.methodsFocus === effectiveFocus)
  const showReveal = canInteract && presetConfig.reveal != null

  const optionButtonStyle = active => ({
    ...TYPE.button,
    minHeight: SPACING.separation + 2,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    borderRadius: RADII.small,
    border: `1px solid ${active ? roles.interaction : roles.textMuted}`,
    color: active ? roles.interaction : roles.textSecondary,
    background: active ? roles.areaFill : 'transparent',
    cursor: 'pointer',
    transition: reduceMotion
      ? 'none'
      : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      className={`ap-explore${reduceMotion ? ' ap-explore--reduced-motion' : ''}`}
      data-ap-preset={presetConfig.id}
      data-ap-focus={effectiveFocus}
      data-ap-interactive={canInteract ? 'true' : 'false'}
      data-ap-method={method ?? undefined}
      data-ap-revealed={revealed ? 'true' : undefined}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        '--ap-explore-glow': roles.focusGlow,
        '--ap-explore-focus': roles.interaction,
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-ap-canvas={`${canvas.width}x${canvas.height}`}
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
              ? 'Use the handles to change the dimensions of the shape.'
              : 'This diagram is shown as a static illustration.',
          ].join(' ')}
        </desc>

        {scene.shapes.map(shape => (
          <path
            key={shape.id}
            className="ap-explore__fill"
            data-ap-shape={shape.id}
            d={shape.path}
            fill={resolveRole(shape.fillRole) ?? 'none'}
            stroke={resolveRole(shape.strokeRole) ?? 'none'}
            strokeWidth={shape.strokeWidth ?? 2}
            strokeDasharray={shape.dashed ? '6 5' : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        <g aria-hidden="true">
          {scene.labels.map(item => (
            <text
              key={item.id}
              data-ap-label={item.id}
              data-ap-deduced={item.role === 'deducedLabel' ? 'true' : undefined}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={resolveRole(item.role) ?? roles.dimensionLabel}
              style={{
                ...(item.size === 'value' ? TYPE.titleMedium : TYPE.label),
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.text}
            </text>
          ))}
        </g>

        {canInteract && scene.handles.map((handle, index) => {
          const control = controlsById[handle.controlId]
          if (!control) return null
          const hint = index === 0 && !hasInteracted && !reduceMotion
          return (
            <g
              key={handle.controlId}
              className={`ap-explore__handle${hint ? ' ap-explore__handle-hint' : ''}`}
              data-dragging={draggingControl === handle.controlId || undefined}
              role="slider"
              tabIndex={0}
              aria-label={control.label}
              aria-valuemin={control.min}
              aria-valuemax={control.max}
              aria-valuenow={currentValues[handle.controlId]}
              aria-valuetext={control.valueText(currentValues)}
              aria-describedby={showStatus ? statusId : descriptionId}
              onPointerDown={handlePointerDown(handle.controlId)}
              onPointerMove={handlePointerMove(handle.controlId)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={handleKeyDown(handle.controlId)}
            >
              <circle
                data-ap-hit-target="true"
                cx={handle.x}
                cy={handle.y}
                r={22}
                fill="transparent"
              />
              <circle
                className="ap-explore__handle-ring"
                cx={handle.x}
                cy={handle.y}
                r={11}
                fill="none"
                stroke={roles.interaction}
                strokeWidth={1.5}
                opacity={0.55}
              />
              <circle
                cx={handle.x}
                cy={handle.y}
                r={6}
                fill={roles.interaction}
              />
            </g>
          )
        })}
      </svg>

      {(showMethods || showReveal) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {showMethods && (
            <div
              role="group"
              aria-label="Choose a method"
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.micro }}
            >
              {presetConfig.methods.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className="ap-explore__option"
                  data-ap-method-option={option.id}
                  aria-pressed={method === option.id}
                  onClick={() => setMethod(option.id)}
                  style={optionButtonStyle(method === option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          {showReveal && (
            <button
              type="button"
              className="ap-explore__option"
              data-ap-reveal-toggle="true"
              aria-pressed={revealed}
              onClick={() => setRevealed(current => !current)}
              style={optionButtonStyle(revealed)}
            >
              {revealed ? presetConfig.reveal.hideLabel : presetConfig.reveal.showLabel}
            </button>
          )}
        </div>
      )}

      {showStatus && (
        <div
          id={statusId}
          aria-live={canInteract ? 'polite' : undefined}
          aria-atomic="true"
          style={{
            minHeight: 118,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            data-ap-status-heading="true"
            style={{
              ...TYPE.displayCard,
              color: roles.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {scene.status.heading}
          </div>
          <div style={{ minHeight: 44, marginTop: 4 }}>
            {scene.status.calculation.map(line => (
              <div
                key={line}
                data-ap-status-calculation="true"
                style={{
                  ...TYPE.bodySmall,
                  color: roles.textSecondary,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div
            data-ap-status-explanation="true"
            style={{
              ...TYPE.caption,
              color: roles.textMuted,
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

export default AreaPerimeterExplore
