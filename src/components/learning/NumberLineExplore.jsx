import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import {
  axisArrowPath,
  axisTicks,
  axisValueFromX,
  axisX,
  clamp,
  jumpArrowPath,
  jumpPath,
  snapValue,
} from './numberLine/numberLineGeometry.js'
import {
  clampPresetValues,
  resolveNumberLinePreset,
  resolvePresetOptions,
} from './numberLine/numberLinePresets.js'
import { createNumberLineVisualRoles } from './numberLine/numberLineVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The first handle breathes gently until the learner's first interaction, then
// stays still — one calm cue toward the draggable point, never a reward
// animation. A movement arc draws itself in once, in the direction of travel,
// so direction is something you watch rather than read.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes nl-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    @keyframes nl-explore-jump-draw {
      from { stroke-dashoffset: 1; }
      to { stroke-dashoffset: 0; }
    }

    .nl-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .nl-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .nl-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .nl-explore__handle-hint .nl-explore__handle-ring {
      animation: nl-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .nl-explore__handle:focus-visible {
      filter: drop-shadow(0 0 4px var(--nl-explore-glow));
    }

    .nl-explore__jump-reveal {
      stroke-dasharray: 1;
      stroke-dashoffset: 0;
      animation: nl-explore-jump-draw ${MOTION.duration.cinematic} ${MOTION.easing.gentle};
    }

    .nl-explore__band,
    .nl-explore__marker {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .nl-explore__option:focus-visible {
      outline: 2px solid var(--nl-explore-focus);
      outline-offset: 2px;
    }

    .nl-explore--reduced-motion .nl-explore__handle-hint .nl-explore__handle-ring,
    .nl-explore--reduced-motion .nl-explore__jump-reveal,
    .nl-explore--reduced-motion .nl-explore__band,
    .nl-explore--reduced-motion .nl-explore__marker {
      animation: none;
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .nl-explore__handle-hint .nl-explore__handle-ring {
        animation: none;
      }

      .nl-explore__jump-reveal {
        animation: none;
      }

      .nl-explore__band,
      .nl-explore__marker {
        transition: none;
      }
    }
  `
  document.head.appendChild(el)
}

// ─── Layout ──────────────────────────────────────────────────────────────────
// Chips sit above the line on one of two tiers so neighbouring values never
// collide; ticks and notes sit below it. All measured from the axis baseline,
// so a preset only has to choose where its line sits on the canvas.
const CHIP_HEIGHT = 24
const CHIP_TIERS = [42, 72, 102]
const TICK_LABEL_OFFSET = 26
const NOTE_TIERS = [48, 68]
const BAND_HEIGHT = 12
// Jump labels sit on their own line, clear of the top chip tier, so a short
// hop and a long one label at the same height instead of one of them landing
// in the middle of a chip.
const JUMP_LABEL_FLOOR = CHIP_TIERS[0] + 22

// SVG text cannot be measured before paint, so chip widths are estimated from
// character count at the label type size. Slightly generous by design — a chip
// a few pixels wide of its text reads as deliberate; a clipped one does not.
function chipWidth(text) {
  return Math.max(34, text.length * 8 + 18)
}

function layoutChips(chips, axis, canvasWidth) {
  const lastRight = []

  return [...chips]
    .map(chip => ({ ...chip, rawX: axisX(axis, chip.value), width: chipWidth(chip.text) }))
    .sort((a, b) => a.rawX - b.rawX)
    .map((chip) => {
      const half = chip.width / 2
      const x = clamp(chip.rawX, half + 2, canvasWidth - half - 2)
      let tier = 0
      while (
        tier < CHIP_TIERS.length - 1
        && lastRight[tier] != null
        && x - half < lastRight[tier] + 6
      ) {
        tier += 1
      }
      lastRight[tier] = x + half
      return { ...chip, x, tier, y: axis.y - CHIP_TIERS[tier] }
    })
}

/**
 * Configuration-driven GCSE number line — the shared visual foundation for
 * number topics, and a sibling of AngleExplore and AreaPerimeterExplore.
 * The line, its intervals, movement arcs and endpoints render as inline SVG;
 * learner-controlled values drive a live status line.
 *
 * The component owns the diagram and its interaction only. Questions,
 * predictions, marking, scoring and weakness tracking belong to the page that
 * composes it.
 *
 * `preset` may be a registered preset name (`orderNumbers`, `negativeMovement`,
 * `roundingIntervals`, `inequalityRange`, `boundsInterval`, `multiplyPattern`,
 * `estimateRange`) or a compatible preset object. `interactive={false}` turns
 * any preset into a static teaching or exam diagram at fixed values.
 */
function NumberLineExplore({
  preset = 'orderNumbers',
  value,
  defaultValue,
  options: optionOverrides,
  onChange,
  interactive,
  disabled = false,
  subject = 'Maths',
  reducedMotion,
  label,
  showStatus = true,
}) {
  ensureStyles()

  const presetConfig = resolveNumberLinePreset(preset)
  const canvas = presetConfig.canvas
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createNumberLineVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const maskPrefix = useId().replace(/:/g, '')
  const svgRef = useRef(null)
  const [draggingControl, setDraggingControl] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Compared by content, not identity, so an inline `options={{ ... }}` prop
  // does not reset the learner's choices on every parent render.
  const optionsKey = JSON.stringify(optionOverrides ?? null)
  const [optionState, setOptionState] = useState(() =>
    resolvePresetOptions(presetConfig, optionOverrides),
  )
  const context = useMemo(() => ({ options: optionState }), [optionState])
  const controls = useMemo(() => presetConfig.controls(context), [presetConfig, context])
  const controlsById = useMemo(
    () => Object.fromEntries(controls.map(control => [control.id, control])),
    [controls],
  )

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled
  const isControlled = value != null && typeof value === 'object'

  const [internalValues, setInternalValues] = useState(() =>
    clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues(context), context),
  )

  useEffect(() => {
    setOptionState(resolvePresetOptions(presetConfig, optionOverrides))
    setHasInteracted(false)
    // optionOverrides is deliberately tracked by content (optionsKey) rather
    // than identity — an inline object prop would otherwise reset the learner's
    // choices on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetConfig, optionsKey])

  // Option changes rescale the axis and the control ranges with it, so the
  // values restart from the new preset defaults rather than being squeezed into
  // a range they were never chosen for.
  useEffect(() => {
    setInternalValues(clampPresetValues(
      presetConfig,
      defaultValue ?? presetConfig.initialValues(context),
      context,
    ))
  }, [presetConfig, defaultValue, context])

  const currentValues = clampPresetValues(
    presetConfig,
    isControlled ? value : internalValues,
    context,
  )
  const scene = presetConfig.derive(currentValues, context)
  const axis = scene.axis
  const ticks = useMemo(() => axisTicks(axis), [axis])
  const chips = useMemo(
    () => layoutChips(scene.chips ?? [], axis, canvas.width),
    [scene.chips, axis, canvas.width],
  )

  const setControlValue = (controlId, next) => {
    const nextValues = clampPresetValues(
      presetConfig,
      { ...currentValues, [controlId]: next },
      context,
    )
    if (nextValues[controlId] === currentValues[controlId]) return
    if (!isControlled) setInternalValues(nextValues)
    onChange?.(nextValues)
  }

  const selectOption = (optionId, choiceId) => {
    setHasInteracted(true)
    setOptionState(previous => ({ ...previous, [optionId]: choiceId }))
  }

  const svgPointFromEvent = (event) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return { x: ((event.clientX - rect.left) / rect.width) * canvas.width }
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

    const control = controlsById[controlId]
    const onAxis = axisValueFromX(axis, point.x)
    const raw = control.valueFromAxis
      ? control.valueFromAxis(onAxis, currentValues)
      : onAxis
    setControlValue(controlId, snapValue(raw, control.step, control.snapTargets))
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

  // `filled` includes an endpoint, `open` excludes it, and `line` marks a fixed
  // reference another marker may legitimately sit on top of.
  const renderMarker = (marker, x) => {
    const shared = {
      className: 'nl-explore__marker',
      'data-nl-marker': marker.id,
      'data-nl-marker-style': marker.style,
    }

    if (marker.style === 'line') {
      return (
        <rect
          {...shared}
          x={x - 1.25}
          y={axis.y - 12}
          width={2.5}
          height={24}
          rx={1.25}
          fill={resolveRole(marker.role)}
        />
      )
    }

    const open = marker.style === 'open'
    return (
      <circle
        {...shared}
        cx={x}
        cy={axis.y}
        r={open ? 6.5 : 6}
        fill={open ? roles.openFill : resolveRole(marker.role)}
        stroke={open ? resolveRole(marker.role) : 'none'}
        strokeWidth={open ? 2.5 : 0}
      />
    )
  }
  const showOptions = canInteract && (presetConfig.options?.length ?? 0) > 0
  const draggableMarkers = (scene.markers ?? []).filter(marker => marker.controlId)
  const showInstruction = canInteract && !hasInteracted && draggableMarkers.length > 0

  const optionButtonStyle = active => ({
    ...TYPE.button,
    minHeight: SPACING.separation - 6,
    padding: `${SPACING.micro - 2}px ${SPACING.compact - 2}px`,
    borderRadius: RADII.small,
    border: `1px solid ${active ? roles.interaction : roles.structureSubtle}`,
    color: active ? roles.interaction : roles.textSecondary,
    background: active ? roles.interactionSoft : 'transparent',
    cursor: 'pointer',
    transition: reduceMotion
      ? 'none'
      : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      className={`nl-explore${reduceMotion ? ' nl-explore--reduced-motion' : ''}`}
      data-nl-preset={presetConfig.id}
      data-nl-interactive={canInteract ? 'true' : 'false'}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        '--nl-explore-glow': roles.focusGlow,
        '--nl-explore-focus': roles.interaction,
      }}
    >
      {scene.caption && (
        <div
          data-nl-caption="true"
          style={{
            ...TYPE.label,
            color: roles.textSecondary,
            textAlign: 'center',
            paddingBottom: SPACING.micro,
          }}
        >
          {scene.caption}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-nl-canvas={`${canvas.width}x${canvas.height}`}
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
              ? 'Drag the marked point along the line to change the numbers.'
              : 'This diagram is shown as a static illustration.',
          ].join(' ')}
        </desc>

        {/* Shaded intervals sit behind the line so ticks stay readable through them. */}
        {(scene.bands ?? []).map((band) => {
          const edge = resolveRole(`${band.role}Edge`) ?? resolveRole(band.role)
          // A band that runs to infinity reaches the end of the line and takes
          // the line's own arrowhead with it, rather than growing a second one
          // alongside it.
          const tipX = band.arrowTo > 0 ? axis.right + 10 : axis.left - 10
          const fromX = axisX(axis, band.from)
          const toX = band.arrowTo ? tipX : axisX(axis, band.to)
          const left = Math.min(fromX, toX)
          const width = Math.abs(toX - fromX)
          return (
            <rect
              key={band.id}
              className="nl-explore__band"
              data-nl-band={band.id}
              x={left}
              y={axis.y - BAND_HEIGHT / 2}
              width={width}
              height={BAND_HEIGHT}
              rx={BAND_HEIGHT / 2}
              fill={resolveRole(band.role)}
              stroke={edge}
              strokeWidth={1}
              strokeOpacity={0.45}
            />
          )
        })}

        {/* The line itself, arrowed at both ends — numbers continue in both directions. */}
        <line
          data-nl-axis="true"
          x1={axis.left - 10}
          y1={axis.y}
          x2={axis.right + 10}
          y2={axis.y}
          stroke={roles.structure}
          strokeWidth={1.5}
        />
        <path d={axisArrowPath(axis.right + 10, axis.y, 1)} fill={roles.structure} />
        <path d={axisArrowPath(axis.left - 10, axis.y, -1)} fill={roles.structure} />

        {/* Drawn over the line's own arrowhead, in the band's colour, so a
            range running to infinity ends in one arrow rather than two. */}
        {(scene.bands ?? []).filter(band => band.arrowTo).map(band => (
          <path
            key={`${band.id}-arrow`}
            data-nl-band-arrow={band.id}
            d={axisArrowPath(
              band.arrowTo > 0 ? axis.right + 10 : axis.left - 10,
              axis.y,
              band.arrowTo,
            )}
            fill={resolveRole(`${band.role}Edge`) ?? resolveRole(band.role)}
          />
        ))}

        <g aria-hidden="true">
          {ticks.map(tick => (
            <line
              key={`tick-${tick.value}`}
              data-nl-tick={tick.major ? 'major' : 'minor'}
              x1={tick.x}
              y1={axis.y - (tick.major ? 7 : 4)}
              x2={tick.x}
              y2={axis.y + (tick.major ? 7 : 4)}
              stroke={tick.major ? roles.structure : roles.structureSubtle}
              strokeWidth={tick.major ? 1.5 : 1}
            />
          ))}
          {ticks.filter(tick => tick.label != null).map(tick => (
            <text
              key={`tick-label-${tick.value}`}
              data-nl-tick-label={tick.value}
              x={tick.x}
              y={axis.y + TICK_LABEL_OFFSET}
              textAnchor="middle"
              dominantBaseline="central"
              fill={roles.structureMuted}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {tick.label}
            </text>
          ))}
        </g>

        {/* Movement arcs. The mask reveals the arc along its own direction of
            travel, so the jump is watched rather than simply found. */}
        {(scene.jumps ?? []).map((jump) => {
          const fromX = axisX(axis, jump.from)
          const toX = axisX(axis, jump.to)
          const arc = jumpPath(fromX, toX, axis.y)
          const maskId = `${maskPrefix}-${jump.id}`
          return (
            <g key={`${jump.id}-${jump.from}-${jump.to}`} data-nl-jump={jump.id}>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <path
                  className={reduceMotion ? undefined : 'nl-explore__jump-reveal'}
                  d={arc.d}
                  pathLength="1"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={arc.height * 2 + 24}
                  strokeLinecap="round"
                />
              </mask>
              <g mask={`url(#${maskId})`}>
                <path
                  d={arc.d}
                  fill="none"
                  stroke={resolveRole(jump.role)}
                  strokeWidth={2}
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                />
                <path
                  data-nl-jump-arrow={jump.id}
                  d={jumpArrowPath(fromX, toX, axis.y, arc.height)}
                  fill={resolveRole(jump.role)}
                />
              </g>
              {jump.text && (
                <text
                  data-nl-jump-label={jump.id}
                  x={arc.apex.x}
                  y={axis.y - Math.max(arc.height + 12, JUMP_LABEL_FLOOR)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={roles.jumpLabel}
                  style={{ ...TYPE.label, fontVariantNumeric: 'tabular-nums' }}
                >
                  {jump.text}
                </text>
              )}
            </g>
          )
        })}

        {/* Guide lines tie each chip to the exact point it names. */}
        <g aria-hidden="true">
          {chips.map(chip => (
            <line
              key={`guide-${chip.id}`}
              data-nl-guide={chip.id}
              x1={chip.x}
              y1={chip.y + CHIP_HEIGHT / 2}
              x2={axisX(axis, chip.value)}
              y2={axis.y}
              stroke={resolveRole(chip.role)}
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.5}
            />
          ))}
        </g>

        {/* Static markers. Draggable ones are rendered last, above everything. */}
        {(scene.markers ?? []).filter(marker => !marker.controlId).map(marker => (
          <g key={marker.id}>{renderMarker(marker, axisX(axis, marker.value))}</g>
        ))}

        <g aria-hidden="true">
          {chips.map(chip => (
            <g key={chip.id} data-nl-chip={chip.id}>
              <rect
                x={chip.x - chip.width / 2}
                y={chip.y - CHIP_HEIGHT / 2}
                width={chip.width}
                height={CHIP_HEIGHT}
                rx={RADII.small}
                fill={roles.surface}
                stroke={resolveRole(chip.role)}
                strokeWidth={1}
              />
              <text
                data-nl-chip-label={chip.id}
                x={chip.x}
                y={chip.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={resolveRole(`${chip.role}Label`) ?? resolveRole(chip.role)}
                style={{ ...TYPE.label, fontVariantNumeric: 'tabular-nums' }}
              >
                {chip.text}
              </text>
            </g>
          ))}

          {(scene.notes ?? []).map(note => (
            <text
              key={note.id}
              data-nl-note={note.id}
              x={clamp(axisX(axis, note.value), 30, canvas.width - 30)}
              y={axis.y + (NOTE_TIERS[note.tier ?? 0] ?? NOTE_TIERS[0])}
              textAnchor="middle"
              dominantBaseline="central"
              fill={resolveRole(note.role) ?? roles.textMuted}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {note.text}
            </text>
          ))}
        </g>

        {canInteract && draggableMarkers.map((marker, index) => {
          const control = controlsById[marker.controlId]
          if (!control) return null
          const hint = index === 0 && !hasInteracted && !reduceMotion
          const x = axisX(axis, marker.value)

          return (
            <g
              key={marker.id}
              className={`nl-explore__handle${hint ? ' nl-explore__handle-hint' : ''}`}
              data-nl-handle={marker.id}
              data-dragging={draggingControl === marker.controlId || undefined}
              role="slider"
              tabIndex={0}
              aria-label={control.label}
              aria-valuemin={control.min}
              aria-valuemax={control.max}
              aria-valuenow={currentValues[marker.controlId]}
              aria-valuetext={control.valueText(currentValues)}
              aria-describedby={showStatus ? statusId : descriptionId}
              onPointerDown={handlePointerDown(marker.controlId)}
              onPointerMove={handlePointerMove(marker.controlId)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={handleKeyDown(marker.controlId)}
            >
              <circle data-nl-hit-target="true" cx={x} cy={axis.y} r={24} fill="transparent" />
              <circle
                className="nl-explore__handle-ring"
                cx={x}
                cy={axis.y}
                r={12}
                fill="none"
                stroke={roles.interaction}
                strokeWidth={1.5}
                opacity={0.55}
              />
              {renderMarker(marker, x)}
            </g>
          )
        })}
      </svg>

      {showInstruction && (
        <div
          data-nl-instruction="true"
          style={{
            ...TYPE.bodySmall,
            color: roles.textSecondary,
            textAlign: 'center',
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {draggableMarkers.length > 1
            ? 'Drag either point along the line.'
            : 'Drag the point along the line.'}
        </div>
      )}

      {showOptions && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.compact}px ${SPACING.compact}px 0`,
          }}
        >
          {presetConfig.options.map(option => (
            <div
              key={option.id}
              role="group"
              aria-label={option.label}
              data-nl-option-group={option.id}
              style={{ display: 'flex', gap: SPACING.micro - 2 }}
            >
              {option.choices.map((choice) => {
                const active = optionState[option.id] === choice.id
                return (
                  <button
                    key={choice.id}
                    type="button"
                    className="nl-explore__option"
                    data-nl-option={`${option.id}:${choice.id}`}
                    aria-pressed={active}
                    onClick={() => selectOption(option.id, choice.id)}
                    style={optionButtonStyle(active)}
                  >
                    {choice.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {showStatus && (
        <div
          id={statusId}
          aria-live={canInteract ? 'polite' : undefined}
          aria-atomic="true"
          style={{
            minHeight: 62,
            padding: `${SPACING.compact}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              ...TYPE.displayCard,
              color: resolveRole(scene.status.headingRole) ?? roles.textPrimary,
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

export default NumberLineExplore
