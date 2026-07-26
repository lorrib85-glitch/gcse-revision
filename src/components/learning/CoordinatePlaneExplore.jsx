import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import {
  axisAnchorValue,
  axisTickValues,
  createPlaneScale,
  gridLineValues,
  resolveAxisPlacement,
} from './coordinatePlane/coordinatePlaneGeometry.js'
import { createCoordinatePlaneVisualRoles } from './coordinatePlane/coordinatePlaneVisualRoles.js'
import { resolveCoordinatePlaneVisualRole } from './coordinatePlane/coordinatePlaneRoleResolver.js'
import { estimateChipBox, layoutPointLabels } from './coordinatePlane/pointLabelLayout.js'
import {
  clampInteractiveValue,
  clampPresetValues,
  interactionRange,
  mergeAxis,
  mergeCapabilities,
  resolveCoordinatePlanePreset,
  resolveEffectiveValues,
  resolveOptionValues,
  resolvePresetFocus,
  resolveShowGuides,
} from './coordinatePlane/presets/index.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The first handle breathes gently until the learner's first interaction, then
// stays still — one calm cue toward the draggable point, never a reward
// animation. Same pattern as AngleExplore and AreaPerimeterExplore.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes cp-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    .cp-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .cp-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .cp-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .cp-explore__handle-hint .cp-explore__handle-ring {
      animation: cp-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .cp-explore__handle-target {
      outline: none;
    }

    /* Two focus targets share one ring, so the ring lights when either has
       keyboard focus.

       The animation reset is load bearing. The attention hint runs until first
       interaction, and its keyframes set opacity — animated values sit in a
       higher cascade origin than normal declarations, so without cancelling
       the animation the focus indicator is silently overridden and a keyboard
       user tabbing to an untouched handle sees nothing at all. */
    .cp-explore__handle:focus-within .cp-explore__handle-ring {
      animation: none;
      stroke-width: 2.5;
      opacity: 1;
      filter: drop-shadow(0 0 4px var(--cp-explore-glow));
    }

    .cp-explore__point {
      outline: none;
    }

    .cp-explore__point:focus-visible {
      filter: drop-shadow(0 0 4px var(--cp-explore-glow));
    }

    .cp-explore__mark {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .cp-explore__option:focus-visible {
      outline: 2px solid var(--cp-explore-focus);
      outline-offset: 2px;
    }

    /* The stepper value is a focusable slider, so it needs its own visible
       focus ring. It previously carried an inline outline: none, which beat
       the rule above and left keyboard focus completely invisible. */
    .cp-explore__stepper-value:focus-visible {
      outline: 2px solid var(--cp-explore-focus);
      outline-offset: 3px;
      border-radius: ${RADII.small}px;
    }

    .cp-explore--reduced-motion .cp-explore__handle-hint .cp-explore__handle-ring,
    .cp-explore--reduced-motion .cp-explore__mark {
      animation: none;
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .cp-explore__handle-hint .cp-explore__handle-ring { animation: none; }
      .cp-explore__mark { transition: none; }
    }
  `
  document.head.appendChild(el)
}

// The widest preset uses a 360-unit viewBox, so a 24-unit radius stays above
// 44 CSS pixels when rendered at 320px wide.
const HANDLE_HIT_RADIUS = 24

/**
 * The interaction range widened to admit a value already sitting outside it.
 *
 * A static figure may legitimately supply a value the interaction range does
 * not cover — that is the whole point of the two-range contract. But once the
 * component is interactive, advertising `aria-valuenow="6"` alongside
 * `aria-valuemax="2"` is invalid ARIA, and stepping down would jump four units
 * in one press.
 *
 * So the reachable range temporarily stretches to include wherever the value
 * actually is, and contracts back as the learner walks it in: at 6 the maximum
 * is 6 and increase is disabled; decrease goes 6 → 5 → 4 → 3 → 2; on reaching
 * 2 the maximum returns to the configured interaction bound.
 *
 * `interactionRange()` in the registry stays the canonical configured range —
 * this is a transitional view of it, and never widens what a preset declared.
 */
function effectiveInteractionRange(control, currentValue) {
  const configured = interactionRange(control)
  if (typeof currentValue !== 'number') return configured

  return {
    min: Math.min(configured.min, currentValue),
    max: Math.max(configured.max, currentValue),
  }
}

const SCREEN_READER_ONLY_STYLE = Object.freeze({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

function axisTitleText(axis) {
  if (!axis.label) return null
  return axis.unit ? `${axis.label} (${axis.unit})` : axis.label
}

// Presets author shape paths in model space so the maths stays readable.
// Commands are single letters followed by coordinate pairs.
function projectModelPath(path, scale) {
  return path.replace(
    /([ML])\s+(-?[\d.]+)\s+(-?[\d.]+)/g,
    (_, command, x, y) => `${command} ${scale.toX(Number(x))} ${scale.toY(Number(y))}`,
  )
}

/**
 * Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling
 * of AngleExplore, AreaPerimeterExplore, FractionRatioExplore and
 * NumberLineExplore.
 *
 * One plane, points that carry their coordinates, and a rule made visible as
 * geometry. Nine presets cover position, straight-line graphs, intersection
 * and the four transformations.
 *
 * The component owns diagram interaction only. Questions, predictions,
 * marking, scores and weakness tracking belong to the page that composes it.
 */
function CoordinatePlaneExplore({
  preset = 'plotPoint',
  focus,
  comparisonRule,
  value,
  defaultValue,
  onChange,
  interactive,
  disabled = false,
  showGuides = 'active',
  difficultyCapabilities,
  xAxis,
  yAxis,
  grid,
  subject = 'Maths',
  reducedMotion,
  label,
  showStatus = true,
}) {
  ensureStyles()

  const presetConfig = useMemo(
    () => resolveCoordinatePlanePreset(preset),
    [preset],
  )
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createCoordinatePlaneVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const rawClipId = useId()
  const clipId = `cp-clip-${rawClipId.replace(/:/g, '')}`
  const svgRef = useRef(null)
  const pointerAnnouncementRef = useRef('')

  const [draggingControl, setDraggingControl] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [activeId, setActiveId] = useState(presetConfig.defaultActiveId ?? null)

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled
  const isControlled = value != null && typeof value === 'object'

  const [internalValues, setInternalValues] = useState(() =>
    clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues),
  )

  useEffect(() => {
    setInternalValues(clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues))
    setActiveId(presetConfig.defaultActiveId ?? null)
    setHasInteracted(false)
    setAnnouncement('')
    pointerAnnouncementRef.current = ''
  }, [presetConfig, defaultValue])

  const currentValues = clampPresetValues(
    presetConfig,
    isControlled ? value : internalValues,
  )

  const axes = useMemo(() => ({
    x: mergeAxis(presetConfig.xAxis, xAxis),
    y: mergeAxis(presetConfig.yAxis, yAxis),
  }), [presetConfig, xAxis, yAxis])

  const resolvedGrid = useMemo(
    () => ({ ...presetConfig.grid, ...(grid ?? {}) }),
    [presetConfig, grid],
  )

  const capabilities = useMemo(
    () => mergeCapabilities(presetConfig, difficultyCapabilities),
    [presetConfig, difficultyCapabilities],
  )

  /**
   * One effective state — capability-pinned numbers plus resolved option ids.
   *
   * Everything downstream reads this: the option groups, the steppers, the
   * scene, the status, the description, and crucially the base of the next
   * update. Deriving from an effective view while emitting the raw one lets
   * `onChange` describe a diagram that is not on screen — a stored `yEqualsX`
   * mirror survives in the payload long after the capability was removed and
   * the figure fell back to `vertical`.
   *
   * Declared before everything that consumes it.
   */
  const effectiveValues = useMemo(
    () => resolveEffectiveValues(presetConfig, currentValues, capabilities),
    [presetConfig, currentValues, capabilities],
  )

  // Groups may resolve from the state as well as from capabilities, so a group
  // that would do nothing can disappear — a rotation's direction at 180°.
  const resolvedOptions = useMemo(
    () => presetConfig.resolveOptions?.(capabilities, effectiveValues) ?? presetConfig.options ?? [],
    [presetConfig, capabilities, effectiveValues],
  )

  const optionValues = useMemo(
    () => resolveOptionValues(presetConfig, effectiveValues, capabilities),
    [presetConfig, effectiveValues, capabilities],
  )

  const effectiveShowGuides = resolveShowGuides(presetConfig, showGuides, {
    isDevelopment: import.meta.env.DEV,
  })
  const effectiveFocus = resolvePresetFocus(presetConfig, focus)

  const canvas = presetConfig.canvas
  const scale = useMemo(
    () => createPlaneScale({
      xAxis: axes.x,
      yAxis: axes.y,
      canvas,
      padding: presetConfig.padding,
    }),
    [axes, canvas, presetConfig.padding],
  )

  const deriveContext = {
    focus: effectiveFocus,
    comparisonRule,
    activeId,
    showGuides: effectiveShowGuides,
    capabilities,
    axes,
    grid: resolvedGrid,
    choices: optionValues,
  }
  const scene = presetConfig.derive(effectiveValues, deriveContext)

  const controlsById = useMemo(() => (
    Object.fromEntries((presetConfig.controls ?? []).map(control => [control.id, control]))
  ), [presetConfig])

  // ─── Interaction ───────────────────────────────────────────────────────────

  // The heading the NEXT state will show. Options live in `values` now, so the
  // choices have to be resolved from `nextValues` too — reusing the render-time
  // `optionValues` would announce the previous selection every time an option
  // button was tapped, always one tap behind.
  const nextStatusHeading = nextValues => presetConfig.derive(nextValues, {
    ...deriveContext,
    choices: resolveOptionValues(presetConfig, nextValues, capabilities),
  }).status.heading

  /**
   * Atomic multi-value update — one clamp, one state write, one onChange, one
   * announcement.
   *
   * This must never be split into per-control calls. Two sequential updates in
   * one event both spread the same render-time `currentValues`, so the second
   * discards the first: dragging a point diagonally would move y and silently
   * drop x.
   */
  const setControlValues = (patch, { announce = false, bounds = 'effective' } = {}) => {
    // Learner-driven changes are held to the interaction range; the model clamp
    // then runs as the outer guarantee. A supplied value already outside the
    // interaction range is left where it is until the learner moves it.
    // A drag is direct positioning — it lands inside the configured range, so
    // dragging a preserved out-of-range value pulls it straight back in. A step
    // is a relative nudge, so it walks through the effective range one unit at
    // a time rather than jumping.
    const bounded = {}
    for (const [controlId, next] of Object.entries(patch)) {
      const control = controlsById[controlId]
      if (!control) {
        bounded[controlId] = next
        continue
      }
      if (bounds === 'configured') {
        bounded[controlId] = clampInteractiveValue(control, next)
        continue
      }
      const reach = effectiveInteractionRange(control, currentValues[controlId])
      bounded[controlId] = Math.min(Math.max(next, reach.min), reach.max)
    }

    const nextValues = clampPresetValues(presetConfig, { ...effectiveValues, ...bounded })

    const changed = Object.keys(bounded)
      .some(controlId => nextValues[controlId] !== effectiveValues[controlId])
    if (!changed) return

    const heading = nextStatusHeading(nextValues)
    if (announce) {
      setAnnouncement(heading)
      pointerAnnouncementRef.current = ''
    } else {
      pointerAnnouncementRef.current = heading
    }

    if (!isControlled) setInternalValues(nextValues)
    onChange?.(nextValues)
  }

  const svgPointFromEvent = (event) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null

    const px = ((event.clientX - rect.left) / rect.width) * canvas.width
    const py = ((event.clientY - rect.top) / rect.height) * canvas.height
    return { px, py, modelX: scale.toModelX(px), modelY: scale.toModelY(py) }
  }

  const handlePointerDown = handle => (event) => {
    if (!canInteract) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerAnnouncementRef.current = ''
    setDraggingControl(handle.controlId)
    setHasInteracted(true)
    if (handle.pointId) setActiveId(handle.pointId)
  }

  // A handle may drive more than one control — dragging a point moves x and y
  // together. Every control the handle names is collected into ONE patch and
  // applied atomically; updating them one at a time loses all but the last.
  const handlePointerMove = handle => (event) => {
    if (draggingControl !== handle.controlId || !canInteract) return
    const point = svgPointFromEvent(event)
    if (!point) return

    const patch = {}
    for (const controlId of handle.controlIds ?? [handle.controlId]) {
      const control = controlsById[controlId]
      if (!control) continue
      patch[controlId] = control.valueFromPointer(point, currentValues)
    }
    setControlValues(patch, { bounds: 'configured' })
  }

  const handlePointerEnd = () => {
    setDraggingControl(null)
    if (pointerAnnouncementRef.current) {
      setAnnouncement(pointerAnnouncementRef.current)
      pointerAnnouncementRef.current = ''
    }
  }

  // One handle may drive several controls, and each needs its own semantic
  // slider — otherwise a keyboard user can reach only the primary one. A point
  // handle therefore exposes an x slider and a y slider over one visual ring:
  // Left/Right drives x, Up/Down drives y, and Home/End drive whichever slider
  // has focus. Pointer interaction on either target still drags both together.
  const AXIS_KEYS = {
    horizontal: { increase: 'ArrowRight', decrease: 'ArrowLeft' },
    vertical: { increase: 'ArrowUp', decrease: 'ArrowDown' },
  }

  const handleKeyDown = (handle, controlId, axis) => (event) => {
    if (!canInteract) return
    const control = controlsById[controlId]
    if (!control) return

    const keys = AXIS_KEYS[axis] ?? AXIS_KEYS.horizontal
    const current = currentValues[controlId]
    const reach = effectiveInteractionRange(control, current)
    let next = null

    if (event.key === keys.increase) next = current + control.step
    if (event.key === keys.decrease) next = current - control.step
    if (event.key === 'Home') next = reach.min
    if (event.key === 'End') next = reach.max
    if (next === null) return

    event.preventDefault()
    setHasInteracted(true)
    if (handle.pointId) setActiveId(handle.pointId)
    setControlValues({ [controlId]: next }, { announce: true })
  }

  // ─── Steppers ──────────────────────────────────────────────────────────────
  // Every declared control is reachable: by a drag handle, or by one of these.

  const stepControl = (controlId, direction) => {
    const control = controlsById[controlId]
    if (!control) return
    setHasInteracted(true)
    setControlValues(
      { [controlId]: currentValues[controlId] + direction * control.step },
      { announce: true },
    )
  }

  const handleStepperKeyDown = controlId => (event) => {
    const control = controlsById[controlId]
    if (!control) return
    const reach = effectiveInteractionRange(control, currentValues[controlId])
    let next = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = currentValues[controlId] + control.step
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = currentValues[controlId] - control.step
    if (event.key === 'Home') next = reach.min
    if (event.key === 'End') next = reach.max
    if (next === null) return

    event.preventDefault()
    setHasInteracted(true)
    setControlValues({ [controlId]: next }, { announce: true })
  }

  // A stepper that changes a number the current state ignores teaches the
  // learner that their input has no reliable effect, so presets resolve their
  // steppers per state rather than declaring one fixed list.
  const activeSteppers = useMemo(
    () => presetConfig.resolveSteppers?.(effectiveValues, capabilities)
      ?? presetConfig.steppers
      ?? [],
    [presetConfig, effectiveValues, capabilities],
  )

  // Grouped steppers share a row; ungrouped ones each get their own.
  const stepperRows = useMemo(() => {
    const rows = []
    for (const stepper of activeSteppers) {
      const key = stepper.group ?? stepper.controlId
      const existing = rows.find(row => row.key === key)
      if (existing) existing.items.push(stepper)
      else rows.push({ key, items: [stepper] })
    }
    return rows
  }, [activeSteppers])

  // ─── Projection and labels ─────────────────────────────────────────────────

  const resolveRole = role => resolveCoordinatePlaneVisualRole(roles, role, {
    isDevelopment: import.meta.env.DEV,
  })

  const xPlacement = resolveAxisPlacement(axes.x)
  const yPlacement = resolveAxisPlacement(axes.y)
  const xAnchor = axisAnchorValue(axes.x)
  const yAnchor = axisAnchorValue(axes.y)

  const xTicks = axisTickValues(axes.x)
  const yTicks = axisTickValues(axes.y)

  const projectedPoints = scene.points.map(point => ({
    ...point,
    px: scale.toX(point.x),
    py: scale.toY(point.y),
  }))

  // A point already driven by a handle activates itself through that handle's
  // sliders, so it must not also render a "Select …" button: two endpoints
  // would otherwise cost six tab stops instead of four. Points with no handle
  // keep their button — it is their only activation affordance.
  const handleDrivenPointIds = new Set(
    (scene.handles ?? []).map(handle => handle.pointId).filter(Boolean),
  )

  // Tick labels and axis titles are real obstacles. Reporting them is the
  // contract; tuning chip constants is not a substitute, because a constant
  // cannot know where a tick label happens to sit.
  const labelObstacles = useMemo(() => {
    const boxes = []

    for (const tick of xTicks) {
      if (tick === xAnchor) continue
      const { width, height } = estimateChipBox(String(tick))
      boxes.push({
        x: scale.toX(tick) - width / 2,
        y: scale.toY(yAnchor) + 16 - height / 2,
        width,
        height,
      })
    }

    for (const tick of yTicks) {
      if (tick === yAnchor) continue
      const { width, height } = estimateChipBox(String(tick))
      boxes.push({
        x: scale.toX(xAnchor) - 12 - width,
        y: scale.toY(tick) - height / 2,
        width,
        height,
      })
    }

    if (axisTitleText(axes.x)) {
      const { width, height } = estimateChipBox(axisTitleText(axes.x))
      boxes.push({
        x: scale.plot.x + scale.plot.width / 2 - width / 2,
        y: canvas.height - 6 - height,
        width,
        height,
      })
    }

    if (axisTitleText(axes.y)) {
      const { width, height } = estimateChipBox(axisTitleText(axes.y))
      // Rotated: the text runs vertically, so width and height swap.
      boxes.push({
        x: 12 - height / 2,
        y: scale.plot.y + scale.plot.height / 2 - width / 2,
        width: height,
        height: width,
      })
    }

    return boxes
  }, [xTicks, yTicks, xAnchor, yAnchor, scale, axes, canvas])

  const placedLabels = useMemo(() => layoutPointLabels(
    projectedPoints.map((point, index) => ({
      id: point.id,
      x: point.px,
      y: point.py,
      text: point.text,
      shortText: point.shortText,
      // Active first, then related, then context — so the point that matters
      // most keeps its full label when the plane gets crowded.
      priority: (point.tier === 'active' ? 0 : point.tier === 'related' ? 100 : 200) + index,
    })),
    { plot: scale.plot, obstacles: labelObstacles },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [scene.points, scale, labelObstacles])

  const labelById = useMemo(
    () => Object.fromEntries(placedLabels.map(item => [item.id, item])),
    [placedLabels],
  )

  const interactionInstruction = canInteract && !hasInteracted
    ? presetConfig.instruction ?? 'Drag the point to move it.'
    : null

  const description = [
    presetConfig.describe?.(effectiveValues, deriveContext) ?? presetConfig.keyFact,
    canInteract ? null : 'This diagram is shown as a static illustration.',
  ].filter(Boolean).join(' ')

  const optionButtonStyle = active => ({
    ...TYPE.button,
    minWidth: COMPONENT_SIZE.touchTarget,
    minHeight: COMPONENT_SIZE.touchTarget,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    borderRadius: RADII.small,
    border: `1px solid ${active ? roles.interaction : roles.textMuted}`,
    color: active ? roles.interaction : roles.textSecondary,
    background: active ? roles.objectFill : 'transparent',
    cursor: 'pointer',
    transition: reduceMotion
      ? 'none'
      : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      className={`cp-explore${reduceMotion ? ' cp-explore--reduced-motion' : ''}`}
      data-cp-preset={presetConfig.id}
      data-cp-focus={effectiveFocus ?? undefined}
      data-cp-interactive={canInteract ? 'true' : 'false'}
      data-cp-show-guides={effectiveShowGuides}
      data-cp-active={activeId ?? undefined}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        position: 'relative',
        '--cp-explore-glow': roles.focusGlow,
        '--cp-explore-focus': roles.interaction,
      }}
    >
      {canInteract && (
        <div
          data-cp-status-announcement="true"
          aria-live="polite"
          aria-atomic="true"
          style={SCREEN_READER_ONLY_STYLE}
        >
          {announcement}
        </div>
      )}

      {interactionInstruction && (
        <div
          data-cp-interaction-instruction="true"
          style={{
            ...TYPE.bodySmall,
            color: roles.textSecondary,
            textAlign: 'center',
            padding: `0 ${SPACING.compact}px ${SPACING.micro}px`,
          }}
        >
          {interactionInstruction}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-cp-canvas={`${canvas.width}x${canvas.height}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${canvas.width} / ${canvas.height}`,
          overflow: 'visible',
        }}
      >
        <title id={titleId}>{label ?? presetConfig.accessibilityLabel}</title>
        <desc id={descriptionId}>{description}</desc>

        {/* Clip path — the rendering safety net. Model-space clipping in the
            presets is the primary mechanism; this catches anything that slips
            past, so nothing is ever drawn outside the plot. */}
        <defs>
          <clipPath id={clipId}>
            <rect
              x={scale.plot.x}
              y={scale.plot.y}
              width={scale.plot.width}
              height={scale.plot.height}
            />
          </clipPath>
        </defs>

        {/* Grid — gridlines may be finer than the labelled ticks */}
        <g aria-hidden="true" data-cp-grid="true">
          {gridLineValues(axes.x, resolvedGrid.xSubdivisions).map(value => (
            <line
              key={`grid-x-${value}`}
              x1={scale.toX(value)}
              y1={scale.plot.y}
              x2={scale.toX(value)}
              y2={scale.plot.y + scale.plot.height}
              stroke={roles.gridLine}
              strokeWidth={1}
            />
          ))}
          {gridLineValues(axes.y, resolvedGrid.ySubdivisions).map(value => (
            <line
              key={`grid-y-${value}`}
              x1={scale.plot.x}
              y1={scale.toY(value)}
              x2={scale.plot.x + scale.plot.width}
              y2={scale.toY(value)}
              stroke={roles.gridLine}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Axes — each placed from its own range */}
        <g data-cp-axes="true">
          <line
            data-cp-axis="x"
            data-cp-axis-placement={xPlacement}
            x1={scale.plot.x}
            y1={scale.toY(yAnchor)}
            x2={scale.plot.x + scale.plot.width}
            y2={scale.toY(yAnchor)}
            stroke={roles.axis}
            strokeWidth={1.5}
          />
          <line
            data-cp-axis="y"
            data-cp-axis-placement={yPlacement}
            x1={scale.toX(xAnchor)}
            y1={scale.plot.y}
            x2={scale.toX(xAnchor)}
            y2={scale.plot.y + scale.plot.height}
            stroke={roles.axis}
            strokeWidth={1.5}
          />
        </g>

        {/* Tick labels */}
        <g aria-hidden="true" data-cp-ticks="true">
          {xTicks.filter(tick => tick !== xAnchor).map(tick => (
            <text
              key={`tick-x-${tick}`}
              x={scale.toX(tick)}
              y={scale.toY(yAnchor) + 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={roles.tickLabel}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {String(tick).replace('-', '−')}
            </text>
          ))}
          {yTicks.filter(tick => tick !== yAnchor).map(tick => (
            <text
              key={`tick-y-${tick}`}
              x={scale.toX(xAnchor) - 12}
              y={scale.toY(tick)}
              textAnchor="end"
              dominantBaseline="central"
              fill={roles.tickLabel}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {String(tick).replace('-', '−')}
            </text>
          ))}
        </g>

        {/* Axis titles, when the caller supplies them */}
        <g aria-hidden="true">
          {axisTitleText(axes.x) && (
            <text
              data-cp-axis-title="x"
              x={scale.plot.x + scale.plot.width / 2}
              y={canvas.height - 6}
              textAnchor="middle"
              fill={roles.axisTitle}
              style={TYPE.label}
            >
              {axisTitleText(axes.x)}
            </text>
          )}
          {axisTitleText(axes.y) && (
            <text
              data-cp-axis-title="y"
              transform={`translate(12 ${scale.plot.y + scale.plot.height / 2}) rotate(-90)`}
              textAnchor="middle"
              fill={roles.axisTitle}
              style={TYPE.label}
            >
              {axisTitleText(axes.y)}
            </text>
          )}
        </g>

        {/* Shapes and lines — clipped to the plot */}
        <g clipPath={`url(#${clipId})`}>
          {(scene.shapes ?? []).map(shape => (
            <path
              key={shape.id}
              className="cp-explore__mark"
              data-cp-shape={shape.id}
              d={shape.modelPath ? projectModelPath(shape.path, scale) : shape.path}
              fill={resolveRole(shape.fillRole) ?? 'none'}
              stroke={resolveRole(shape.strokeRole) ?? 'none'}
              strokeWidth={shape.strokeWidth ?? 2}
              strokeDasharray={shape.dashed ? '6 5' : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Guides — active element only (spec section 2), also clipped */}
        <g data-cp-guides="true" clipPath={`url(#${clipId})`}>
          {(scene.guides ?? []).map(guide => (
            <line
              key={guide.id}
              data-cp-guide={guide.id}
              x1={scale.toX(guide.from.x)}
              y1={scale.toY(guide.from.y)}
              x2={scale.toX(guide.to.x)}
              y2={scale.toY(guide.to.y)}
              stroke={resolveRole(guide.role) ?? roles.guideLine}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ))}
        </g>

        {/* Points and their labels */}
        {projectedPoints.map((point) => {
          const placed = labelById[point.id]
          const isPlottedPoint = point.tier !== 'context'

          return (
            <g key={point.id} data-cp-point={point.id} data-cp-tier={point.tier}>
              {isPlottedPoint && (
                <circle
                  className="cp-explore__mark"
                  cx={point.px}
                  cy={point.py}
                  r={point.tier === 'active' ? 6 : 4.5}
                  fill={resolveRole(point.role) ?? roles.object}
                />
              )}
              {placed && (
                <text
                  data-cp-point-label={point.id}
                  data-cp-label-degraded={placed.degraded ? 'true' : undefined}
                  x={placed.box.x + placed.box.width / 2}
                  y={placed.box.y + placed.box.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={point.tier === 'context' ? roles.textMuted : roles.textPrimary}
                  style={{
                    ...(point.tier === 'active' ? TYPE.label : TYPE.caption),
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {placed.text}
                </text>
              )}
              {canInteract && point.focusable && !handleDrivenPointIds.has(point.id) && (
                <circle
                  className="cp-explore__point"
                  data-cp-point-target={point.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${point.text}`}
                  cx={point.px}
                  cy={point.py}
                  r={HANDLE_HIT_RADIUS}
                  fill="transparent"
                  onFocus={() => setActiveId(point.id)}
                  onClick={() => {
                    setActiveId(point.id)
                    setHasInteracted(true)
                  }}
                />
              )}
            </g>
          )
        })}

        {/* Drag handles.
            One visual ring per handle, but one semantic slider per control it
            drives — otherwise a keyboard user can reach only the primary
            control and a point can never move vertically. The ring is drawn
            once and lit by :focus-within, so two focus targets still read as
            one object. Pointer interaction on either target drags both
            controls atomically. */}
        {canInteract && (scene.handles ?? []).map((handle, index) => {
          const controlIds = (handle.controlIds ?? [handle.controlId])
            .filter(controlId => controlsById[controlId])
          if (controlIds.length === 0) return null
          const hint = index === 0 && !hasInteracted && !reduceMotion

          return (
            <g
              key={handle.controlId}
              className={`cp-explore__handle${hint ? ' cp-explore__handle-hint' : ''}`}
              data-cp-handle={handle.controlId}
              data-dragging={draggingControl === handle.controlId || undefined}
            >
              <circle
                className="cp-explore__handle-ring"
                cx={scale.toX(handle.x)}
                cy={scale.toY(handle.y)}
                r={11}
                fill="none"
                stroke={roles.interaction}
                strokeWidth={1.5}
                opacity={0.55}
              />

              {controlIds.map((controlId, axisIndex) => {
                const control = controlsById[controlId]
                const reach = effectiveInteractionRange(control, currentValues[controlId])
                // First control runs horizontally, second vertically — the
                // order presets declare in controlIds.
                const axis = axisIndex === 0 ? 'horizontal' : 'vertical'

                return (
                  <circle
                    key={controlId}
                    className="cp-explore__handle-target"
                    data-cp-hit-target={controlId}
                    data-cp-handle-axis={axis}
                    role="slider"
                    tabIndex={0}
                    aria-label={control.label}
                    aria-valuemin={reach.min}
                    aria-valuemax={reach.max}
                    aria-valuenow={currentValues[controlId]}
                    aria-valuetext={control.valueText(currentValues)}
                    aria-describedby={showStatus ? statusId : descriptionId}
                    cx={scale.toX(handle.x)}
                    cy={scale.toY(handle.y)}
                    r={HANDLE_HIT_RADIUS}
                    fill="transparent"
                    // Tabbing between handles is a change of attention, so the
                    // annotation follows focus — otherwise moving from one
                    // endpoint to the next leaves the guides on the old point.
                    onFocus={() => { if (handle.pointId) setActiveId(handle.pointId) }}
                    onPointerDown={handlePointerDown(handle)}
                    onPointerMove={handlePointerMove(handle)}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    onKeyDown={handleKeyDown(handle, controlId, axis)}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>

      {/* Accumulated results — every value the learner has already worked out,
          kept subdued so the newest one still owns the status area. Presets
          that build something up over several steps supply scene.trail. */}
      {(scene.trail ?? []).length > 0 && (
        <div
          data-cp-trail="true"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {scene.trail.map(item => (
            <span
              key={item.id}
              data-cp-trail-item={item.id}
              style={{
                ...TYPE.caption,
                color: roles.textMuted,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* Numeric steppers — how a control without a drag handle is reached */}
      {canInteract && stepperRows.map(row => (
        <div
          key={row.key}
          data-cp-stepper-row={row.key}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.compact,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {row.items.map((stepper) => {
            const control = controlsById[stepper.controlId]
            if (!control) return null
            const current = currentValues[stepper.controlId]
            const reach = effectiveInteractionRange(control, current)
            const display = control.format ? control.format(current) : String(current).replace('-', '−')

            const nudgeStyle = {
              ...TYPE.button,
              minWidth: COMPONENT_SIZE.touchTarget,
              minHeight: COMPONENT_SIZE.touchTarget,
              borderRadius: RADII.small,
              border: `1px solid ${roles.textMuted}`,
              color: roles.textSecondary,
              background: 'transparent',
              cursor: 'pointer',
            }

            return (
              <div
                key={stepper.controlId}
                data-cp-stepper={stepper.controlId}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <span style={{ ...TYPE.label, color: roles.textSecondary }}>
                  {stepper.label ?? control.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                  <button
                    type="button"
                    className="cp-explore__option"
                    data-cp-stepper-decrement={stepper.controlId}
                    aria-label={`Decrease ${control.label}`}
                    disabled={current <= reach.min}
                    onClick={() => stepControl(stepper.controlId, -1)}
                    style={nudgeStyle}
                  >
                    −
                  </button>
                  <span
                    className="cp-explore__option cp-explore__stepper-value"
                    data-cp-stepper-value={stepper.controlId}
                    role="slider"
                    tabIndex={0}
                    aria-label={control.label}
                    aria-valuemin={reach.min}
                    aria-valuemax={reach.max}
                    aria-valuenow={current}
                    aria-valuetext={control.valueText(currentValues)}
                    onKeyDown={handleStepperKeyDown(stepper.controlId)}
                    style={{
                      ...TYPE.titleMedium,
                      color: roles.textPrimary,
                      minWidth: COMPONENT_SIZE.touchTarget,
                      textAlign: 'center',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {display}
                  </span>
                  <button
                    type="button"
                    className="cp-explore__option"
                    data-cp-stepper-increment={stepper.controlId}
                    aria-label={`Increase ${control.label}`}
                    disabled={current >= reach.max}
                    onClick={() => stepControl(stepper.controlId, 1)}
                    style={nudgeStyle}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Discrete choices — real buttons, never disguised sliders */}
      {canInteract && resolvedOptions.map(group => (
        <div
          key={group.id}
          role="group"
          aria-label={group.label}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {group.choices.map(choice => (
            <button
              key={choice.id}
              type="button"
              className="cp-explore__option"
              data-cp-option={`${group.id}:${choice.id}`}
              aria-pressed={optionValues[group.id] === choice.id}
              // The same atomic setter as everything else: one tap, one
              // complete onChange, one announcement.
              onClick={() => {
                setHasInteracted(true)
                setControlValues({ [group.id]: choice.id }, { announce: true })
              }}
              style={optionButtonStyle(optionValues[group.id] === choice.id)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ))}

      {showStatus && (
        <div
          id={statusId}
          style={{
            minHeight: COMPONENT_SIZE.areaPerimeterStatusReserve,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            data-cp-status-heading="true"
            style={{
              ...TYPE.displayCard,
              color: roles.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {scene.status.heading}
          </div>

          <div style={{ minHeight: COMPONENT_SIZE.touchTarget, marginTop: SPACING.micro }}>
            {/* Keyed by index, not by text. Calculation lines are legitimately
                identical in some states — coincident lines print the same
                equation twice — and keying by content collapses them into a
                React duplicate-key warning. */}
            {scene.status.calculation.map((line, index) => (
              <div
                key={`${index}-${line}`}
                data-cp-status-calculation="true"
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
            data-cp-status-explanation="true"
            style={{
              ...TYPE.bodySmall,
              color: roles.textSecondary,
              maxWidth: '34ch',
              margin: `${SPACING.micro}px auto 0`,
            }}
          >
            {scene.status.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoordinatePlaneExplore
