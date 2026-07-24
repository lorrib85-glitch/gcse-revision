import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import { boundaryX, bracketPath, dividerPositions } from './fractionRatio/fractionRatioGeometry.js'
import {
  clampPresetValues,
  controlHasStepper,
  presetSteps,
  resolveFractionRatioPreset,
  resolvePresetMethod,
  resolvePresetStep,
} from './fractionRatio/presets/index.js'
import { createFractionRatioVisualRoles } from './fractionRatio/fractionRatioVisualRoles.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The first handle breathes gently until the learner's first interaction, then
// stays still. Fills settle with the standard fast fade. Glow appears only on
// the focused handle.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes fr-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    .fr-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .fr-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .fr-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .fr-explore__handle-hint .fr-explore__handle-ring {
      animation: fr-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .fr-explore__handle:focus-visible {
      filter: drop-shadow(0 0 4px var(--fr-explore-glow));
    }

    .fr-explore__fill {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .fr-explore__option:focus-visible {
      outline: 2px solid var(--fr-explore-focus);
      outline-offset: 2px;
    }

    .fr-explore--reduced-motion .fr-explore__handle-hint .fr-explore__handle-ring,
    .fr-explore--reduced-motion .fr-explore__fill {
      animation: none;
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .fr-explore__handle-hint .fr-explore__handle-ring {
        animation: none;
      }

      .fr-explore__fill {
        transition: none;
      }
    }
  `
  document.head.appendChild(el)
}

const LABEL_TYPE = {
  eyebrow: TYPE.eyebrow,
  caption: TYPE.caption,
  label: TYPE.label,
  value: TYPE.titleMedium,
}

const GLYPH_SIZE = {
  small: { font: 15, gap: 11, rule: 15 },
  medium: { font: 19, gap: 14, rule: 19 },
  large: { font: 26, gap: 19, rule: 25 },
}

/**
 * Configuration-driven GCSE part-whole diagram — the fractions, ratio,
 * proportion and percentage sibling of AngleExplore and AreaPerimeterExplore.
 *
 * One visual grammar runs through every preset: the same whole, visibly divided
 * into equal parts, linked to its other representations, scaling both sides
 * together. That grammar is what lets a learner recognise 3/4, 3 : 1 and 75% as
 * one idea rather than three topics.
 *
 * The component owns diagram state and the drag / keyboard / step interaction.
 * Questions, predictions, exam tasks, marking and weakness tracking belong to
 * the page that composes the diagram.
 */
function FractionRatioExplore({
  preset = 'fractionBar',
  method,
  step,
  value,
  defaultValue,
  onChange,
  onMethodChange,
  onStepChange,
  interactive,
  disabled = false,
  subject = 'Maths',
  reducedMotion,
  label,
  showStatus = true,
}) {
  ensureStyles()

  const presetConfig = resolveFractionRatioPreset(preset)
  const canvas = presetConfig.canvas
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createFractionRatioVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const svgRef = useRef(null)
  const [draggingControl, setDraggingControl] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  // `method` and `step` seed the diagram rather than locking it: the operation
  // tabs and step buttons are visible controls, so they must actually move.
  // A genuinely fixed figure is `interactive={false}`, which hides both.
  const [internalMethod, setInternalMethod] = useState(() => resolvePresetMethod(presetConfig, method))
  const [internalStep, setInternalStep] = useState(step ?? null)

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled
  const isControlled = value != null && typeof value === 'object'

  const activeMethod = resolvePresetMethod(presetConfig, internalMethod)
  const steps = presetSteps(presetConfig, activeMethod)
  const activeStep = resolvePresetStep(presetConfig, activeMethod, internalStep)

  const [internalValues, setInternalValues] = useState(() => (
    clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues, { method: activeMethod })
  ))

  useEffect(() => {
    setInternalValues(clampPresetValues(
      presetConfig,
      defaultValue ?? presetConfig.initialValues,
      { method: resolvePresetMethod(presetConfig, method) },
    ))
    setHasInteracted(false)
    // `method` is read but deliberately not a dependency: switching operation
    // mid-session keeps the learner's numbers rather than resetting under them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetConfig, defaultValue])

  useEffect(() => {
    setInternalMethod(resolvePresetMethod(presetConfig, method))
    setInternalStep(null)
  }, [presetConfig, method])

  useEffect(() => {
    setInternalStep(step ?? null)
  }, [presetConfig, step])

  const currentValues = clampPresetValues(
    presetConfig,
    isControlled ? value : internalValues,
    { method: activeMethod },
  )

  const scene = presetConfig.derive(currentValues, {
    method: activeMethod,
    step: activeStep,
  })

  const controlsById = useMemo(() => (
    Object.fromEntries(presetConfig.controls.map(control => [control.id, control]))
  ), [presetConfig])

  const setControlValue = (controlId, next) => {
    const nextValues = clampPresetValues(
      presetConfig,
      { ...currentValues, [controlId]: next },
      { method: activeMethod },
    )
    if (nextValues[controlId] === currentValues[controlId]) return
    if (!isControlled) setInternalValues(nextValues)
    onChange?.(nextValues)
  }

  const selectMethod = (nextMethod) => {
    setInternalMethod(nextMethod)
    setInternalStep(null)
    onMethodChange?.(nextMethod)
  }

  const selectStep = (nextStep) => {
    setInternalStep(nextStep)
    onStepChange?.(nextStep)
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
    const control = controlsById[controlId]
    if (!control?.valueFromPointer) return
    const point = svgPointFromEvent(event)
    if (!point) return
    setControlValue(controlId, control.valueFromPointer(point, currentValues))
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

  const tone = (role, fallback) => (role && role !== 'none' ? roles[role] ?? role : fallback)
  const fill = role => tone(role, 'none')

  const stepperControls = canInteract
    ? presetConfig.controls.filter(control => controlHasStepper(control, activeMethod))
    : []

  const showMethods = canInteract && (presetConfig.methods?.length ?? 0) > 0
  const showSteps = canInteract && steps.length > 0
  const stepIndex = Math.max(steps.findIndex(entry => entry.id === activeStep), 0)

  const handles = canInteract ? (scene.handles ?? []) : []
  const showInteractionInstruction = canInteract && handles.length > 0 && !hasInteracted

  const optionButtonStyle = active => ({
    ...TYPE.button,
    minHeight: SPACING.separation - 6,
    padding: `${SPACING.micro - 2}px ${SPACING.compact - 4}px`,
    borderRadius: RADII.small,
    border: `1px solid ${active ? roles.interaction : roles.textMuted}`,
    color: active ? roles.interaction : roles.textSecondary,
    background: active ? roles.ghost : 'transparent',
    cursor: 'pointer',
    transition: reduceMotion
      ? 'none'
      : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      className={`fr-explore${reduceMotion ? ' fr-explore--reduced-motion' : ''}`}
      data-fr-preset={presetConfig.id}
      data-fr-method={activeMethod ?? undefined}
      data-fr-step={activeStep ?? undefined}
      data-fr-interactive={canInteract ? 'true' : 'false'}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        '--fr-explore-glow': roles.focusGlow,
        '--fr-explore-focus': roles.interaction,
      }}
    >
      {showMethods && (
        <div
          role="group"
          aria-label="Choose an operation"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro - 2,
            padding: `0 ${SPACING.compact}px ${SPACING.micro}px`,
          }}
        >
          {presetConfig.methods.map(option => (
            <button
              key={option.id}
              type="button"
              className="fr-explore__option"
              data-fr-method-option={option.id}
              aria-pressed={activeMethod === option.id}
              onClick={() => selectMethod(option.id)}
              style={optionButtonStyle(activeMethod === option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {showInteractionInstruction && (
        <div
          data-fr-interaction-instruction="true"
          style={{
            ...TYPE.bodySmall,
            color: roles.textSecondary,
            textAlign: 'center',
            padding: `0 ${SPACING.compact}px ${SPACING.micro - 4}px`,
          }}
        >
          {handles.length > 1 ? 'Drag either handle.' : 'Drag the handle.'}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-fr-canvas={`${canvas.width}x${canvas.height}`}
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
              ? 'Use the handles and buttons to change the diagram.'
              : 'This diagram is shown as a static illustration.',
          ].join(' ')}
        </desc>

        {/* Rungs sit behind everything — they are the relationship, not an edge. */}
        {(scene.rungs ?? []).map(rung => (
          <line
            key={rung.id}
            data-fr-rung={rung.id}
            data-fr-rung-active={rung.active ? 'true' : undefined}
            x1={rung.x}
            y1={rung.y1}
            x2={rung.x}
            y2={rung.y2}
            stroke={tone(rung.tone, roles.ghost)}
            strokeWidth={rung.active ? 2 : 1}
            strokeDasharray={rung.active ? undefined : '4 5'}
          />
        ))}

        {(scene.cells ?? []).map(cell => (
          <g key={cell.id} data-fr-cell={cell.id}>
            <rect
              className="fr-explore__fill"
              x={cell.x}
              y={cell.y}
              width={Math.max(cell.width, 0)}
              height={cell.height}
              fill={fill(cell.fillTone)}
              stroke={tone(cell.edgeTone, roles.divider)}
              strokeWidth={1}
              strokeDasharray={cell.dashed ? '5 4' : undefined}
            />
            {(cell.hatch ?? []).map((hatch, index) => (
              <line
                key={index}
                x1={hatch.x1}
                y1={hatch.y1}
                x2={hatch.x2}
                y2={hatch.y2}
                stroke={roles.shaded}
                strokeWidth={1}
                opacity={0.55}
              />
            ))}
          </g>
        ))}

        {(scene.sectors ?? []).map(sector => (
          <path
            key={sector.id}
            className="fr-explore__fill"
            data-fr-sector={sector.id}
            d={sector.path}
            fill={fill(sector.fillTone)}
            stroke={tone(sector.edgeTone, roles.divider)}
            strokeWidth={1.5}
          />
        ))}

        {(scene.bars ?? []).map(barElement => (
          <Bar key={barElement.id} bar={barElement} roles={roles} fill={fill} />
        ))}

        {(scene.counters ?? []).map(counter => (
          <circle
            key={counter.id}
            className="fr-explore__fill"
            data-fr-counter={counter.id}
            cx={counter.cx}
            cy={counter.cy}
            r={counter.r}
            fill={fill(counter.fillTone)}
            stroke={tone(counter.edgeTone, roles.wholeMuted)}
            strokeWidth={1.5}
          />
        ))}

        {(scene.lines ?? []).map(item => (
          <line
            key={item.id}
            data-fr-line={item.id}
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            stroke={tone(item.tone, roles.whole)}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={item.dashed ? '6 5' : undefined}
          />
        ))}

        {(scene.connectors ?? []).map(connector => (
          <path
            key={connector.id}
            data-fr-connector={connector.id}
            d={connector.path}
            fill="none"
            stroke={tone(connector.tone, roles.link)}
            strokeWidth={1.25}
            strokeDasharray={connector.dashed ? '4 5' : undefined}
            opacity={0.7}
          />
        ))}

        {(scene.brackets ?? []).map(item => (
          <Bracket key={item.id} bracket={item} roles={roles} tone={tone} />
        ))}

        {(scene.markers ?? []).map(marker => (
          <circle
            key={marker.id}
            data-fr-marker={marker.id}
            cx={marker.cx}
            cy={marker.cy}
            r={marker.r}
            fill={tone(marker.tone, roles.shaded)}
          />
        ))}

        <g aria-hidden="true">
          {(scene.labels ?? []).map(item => (
            <text
              key={item.id}
              data-fr-label={item.id}
              x={item.x}
              y={item.y}
              textAnchor={item.anchor === 'start' ? 'start' : item.anchor === 'end' ? 'end' : 'middle'}
              dominantBaseline="central"
              fill={tone(item.tone, roles.textSecondary)}
              style={{
                ...(LABEL_TYPE[item.size] ?? TYPE.label),
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.text}
            </text>
          ))}

          {(scene.fractions ?? []).map(item => (
            <FractionGlyph key={item.id} glyph={item} roles={roles} tone={tone} />
          ))}
        </g>

        {handles.map((handle, index) => {
          const control = controlsById[handle.controlId]
          if (!control) return null
          const hint = index === 0 && !hasInteracted && !reduceMotion

          return (
            <g
              key={handle.controlId}
              className={`fr-explore__handle${hint ? ' fr-explore__handle-hint' : ''}`}
              data-fr-handle={handle.controlId}
              data-dragging={draggingControl === handle.controlId || undefined}
              role="slider"
              tabIndex={0}
              aria-label={control.label}
              aria-valuemin={control.min}
              aria-valuemax={control.max}
              aria-valuenow={currentValues[handle.controlId]}
              aria-valuetext={control.valueText?.(currentValues)}
              aria-describedby={showStatus ? statusId : descriptionId}
              onPointerDown={handlePointerDown(handle.controlId)}
              onPointerMove={handlePointerMove(handle.controlId)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={handleKeyDown(handle.controlId)}
            >
              <circle data-fr-hit-target="true" cx={handle.x} cy={handle.y} r={22} fill="transparent" />
              <circle
                className="fr-explore__handle-ring"
                cx={handle.x}
                cy={handle.y}
                r={11}
                fill="none"
                stroke={roles.interaction}
                strokeWidth={1.5}
                opacity={0.55}
              />
              <circle cx={handle.x} cy={handle.y} r={6} fill={roles.interaction} />
            </g>
          )
        })}
      </svg>

      {stepperControls.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {stepperControls.map(control => (
            <Stepper
              key={control.id}
              control={control}
              value={currentValues[control.id]}
              roles={roles}
              reduceMotion={reduceMotion}
              onChange={(next) => {
                setHasInteracted(true)
                setControlValue(control.id, next)
              }}
            />
          ))}
        </div>
      )}

      {showSteps && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          <button
            type="button"
            className="fr-explore__option"
            data-fr-step-back="true"
            disabled={stepIndex === 0}
            onClick={() => selectStep(steps[Math.max(stepIndex - 1, 0)].id)}
            style={{ ...optionButtonStyle(false), opacity: stepIndex === 0 ? 0.4 : 1 }}
          >
            Back
          </button>

          <div
            data-fr-step-position="true"
            style={{ ...TYPE.caption, color: roles.textMuted, minWidth: 96, textAlign: 'center' }}
          >
            {`Step ${stepIndex + 1} of ${steps.length}`}
          </div>

          <button
            type="button"
            className="fr-explore__option"
            data-fr-step-next="true"
            disabled={stepIndex === steps.length - 1}
            onClick={() => selectStep(steps[Math.min(stepIndex + 1, steps.length - 1)].id)}
            style={{
              ...optionButtonStyle(stepIndex < steps.length - 1),
              opacity: stepIndex === steps.length - 1 ? 0.4 : 1,
            }}
          >
            {/* Naming the step ahead is the affordance; at the end there is no
                step ahead, and repeating the current one reads as a dead end. */}
            {stepIndex === steps.length - 1 ? 'Done' : steps[stepIndex + 1].label}
          </button>
        </div>
      )}

      {showStatus && (
        <div
          id={statusId}
          aria-live={canInteract ? 'polite' : undefined}
          aria-atomic="true"
          style={{
            minHeight: 122,
            padding: `${SPACING.compact}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            data-fr-status-heading="true"
            style={{
              ...TYPE.displayCard,
              color: roles.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {scene.status.heading}
          </div>

          <div style={{ minHeight: 44, marginTop: 4 }}>
            {(scene.status.calculation ?? []).map(line => (
              <div
                key={line}
                data-fr-status-calculation="true"
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
            data-fr-status-explanation="true"
            style={{ ...TYPE.caption, color: roles.textMuted, marginTop: 4 }}
          >
            {scene.status.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Scene primitives ────────────────────────────────────────────────────────

// A whole divided into equal parts. Coloured runs are drawn first as single
// blocks so a shaded amount reads as one continuous quantity, then the division
// lines are laid on top so the parts stay countable, then the outline last so
// the whole never looks broken by its own contents.
function Bar({ bar, roles, fill }) {
  const { x, y, width, height, parts } = bar

  return (
    <g data-fr-bar={bar.id}>
      {(bar.segments ?? []).map((segment, index) => {
        const from = boundaryX(bar, Math.max(segment.from, 0))
        const to = boundaryX(bar, Math.min(Math.max(segment.to, 0), parts))
        if (to <= from) return null

        return (
          <rect
            key={index}
            className="fr-explore__fill"
            data-fr-segment={`${bar.id}-${index}`}
            x={from}
            y={y}
            width={to - from}
            height={height}
            fill={fill(segment.fillTone)}
            stroke="none"
          />
        )
      })}

      {dividerPositions(x, width, parts).map(dividerX => (
        <line
          key={dividerX}
          x1={dividerX}
          y1={y}
          x2={dividerX}
          y2={y + height}
          stroke={roles.divider}
          strokeWidth={1}
        />
      ))}

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={roles.whole}
        strokeWidth={1.75}
      />
    </g>
  )
}

// Square brackets, horizontal or vertical, with their label clear of the tails.
function Bracket({ bracket: item, roles, tone }) {
  const stroke = tone(item.tone, roles.textMuted)

  if (item.vertical) {
    const depth = 6
    const path = [
      `M ${item.x + depth} ${item.y1}`,
      `L ${item.x} ${item.y1}`,
      `L ${item.x} ${item.y2}`,
      `L ${item.x + depth} ${item.y2}`,
    ].join(' ')

    return (
      <g data-fr-bracket={item.id}>
        <path d={path} fill="none" stroke={stroke} strokeWidth={1.25} />
        {item.text ? (
          <text
            x={item.x - 8}
            y={(item.y1 + item.y2) / 2}
            textAnchor="end"
            dominantBaseline="central"
            fill={stroke}
            style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
          >
            {item.text}
          </text>
        ) : null}
      </g>
    )
  }

  return (
    <g data-fr-bracket={item.id}>
      <path
        d={bracketPath(item.x1, item.x2, item.y, 6, item.below)}
        fill="none"
        stroke={stroke}
        strokeWidth={1.25}
      />
      {item.text ? (
        <text
          x={(item.x1 + item.x2) / 2}
          y={item.y + (item.below ? 20 : -14)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={stroke}
          style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
        >
          {item.text}
        </text>
      ) : null}
    </g>
  )
}

// A real stacked fraction with a rule line — never "3/4" as flat text. This is
// how the notation appears in every exam paper, so it is how the diagram writes
// it too.
function FractionGlyph({ glyph, roles, tone }) {
  const size = GLYPH_SIZE[glyph.size] ?? GLYPH_SIZE.medium
  const colour = tone(glyph.tone, roles.textPrimary)
  const half = size.rule / 2

  return (
    <g data-fr-fraction={glyph.id}>
      <text
        x={glyph.x}
        y={glyph.y - size.gap}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colour}
        style={{ ...TYPE.titleMedium, fontSize: size.font, fontVariantNumeric: 'tabular-nums' }}
      >
        {glyph.numerator}
      </text>
      <line
        x1={glyph.x - half}
        y1={glyph.y}
        x2={glyph.x + half}
        y2={glyph.y}
        stroke={colour}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <text
        x={glyph.x}
        y={glyph.y + size.gap}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colour}
        style={{ ...TYPE.titleMedium, fontSize: size.font, fontVariantNumeric: 'tabular-nums' }}
      >
        {glyph.denominator}
      </text>
    </g>
  )
}

// A discrete value that would be fiddly to drag on a phone. Buttons rather than
// a slider, because the value is a count and the learner should be able to land
// on an exact one.
function Stepper({ control, value, roles, reduceMotion, onChange }) {
  const atMin = value <= control.min
  const atMax = value >= control.max

  const buttonStyle = dimmed => ({
    ...TYPE.button,
    width: SPACING.separation - 6,
    height: SPACING.separation - 6,
    borderRadius: RADII.small,
    border: `1px solid ${roles.textMuted}`,
    background: 'transparent',
    color: dimmed ? roles.textMuted : roles.interaction,
    cursor: dimmed ? 'default' : 'pointer',
    opacity: dimmed ? 0.4 : 1,
    lineHeight: 1,
    transition: reduceMotion ? 'none' : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      data-fr-stepper={control.id}
      style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro - 2 }}
    >
      <button
        type="button"
        className="fr-explore__option"
        data-fr-stepper-decrease={control.id}
        aria-label={`Decrease ${control.label.toLowerCase()}`}
        disabled={atMin}
        onClick={() => onChange(value - control.step)}
        style={buttonStyle(atMin)}
      >
        −
      </button>

      <div style={{ textAlign: 'center', minWidth: 72 }}>
        <div style={{ ...TYPE.caption, color: roles.textMuted }}>{control.label}</div>
        <div
          data-fr-stepper-value={control.id}
          style={{ ...TYPE.titleMedium, color: roles.textPrimary, fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </div>
      </div>

      <button
        type="button"
        className="fr-explore__option"
        data-fr-stepper-increase={control.id}
        aria-label={`Increase ${control.label.toLowerCase()}`}
        disabled={atMax}
        onClick={() => onChange(value + control.step)}
        style={buttonStyle(atMax)}
      >
        +
      </button>
    </div>
  )
}

export default FractionRatioExplore
