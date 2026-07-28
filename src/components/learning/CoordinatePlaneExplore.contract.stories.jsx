// Renderer contract tests — permanent, and deliberately not preset stories.
//
// These pin behaviour that ordinary presets may stop exercising as the preset
// set evolves: chiefly the two-range edge case, where a supplied value sits
// outside the range a learner can reach. A mutation check proved that matters —
// with only real presets in play, swapping the two clamp functions for each
// other left the entire suite green.
//
// The fixture below is passed through the documented compatible-preset-object
// escape hatch, so these tests need no preset to exist. Keep this file out of
// the learner-facing review manifest; it is engineering scaffolding.

import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'
// The transformation bounds sweep below drives every preset over its whole
// reachable state space, which no set of rendered stories can cover.
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  mergeCapabilities,
  resolvePresetFocus,
} from './coordinatePlane/presets/index.js'

export default {
  title: 'Learning/CoordinatePlaneExplore/Contract',
  component: CoordinatePlaneExplore,
  parameters: { layout: 'centered' },
}

// A minimal preset whose control accepts a wide model range but only lets a
// learner reach a narrow one — the exact shape that made static exam figures
// silently wrong before the two-range split.
const STEPPER_FIXTURE = {
  id: 'contractStepper',
  accessibilityLabel: 'Contract stepper fixture',
  keyFact: 'Fixture for verifying stepper behaviour.',
  instruction: 'Use the stepper.',
  interactive: true,
  supportsShowAllGuides: true,
  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -8, max: 8, step: 2 },
  yAxis: { min: -8, max: 8, step: 2 },
  grid: { xSubdivisions: 2, ySubdivisions: 2 },
  focusModes: [],
  defaultFocus: null,
  defaultActiveId: null,
  capabilities: {},
  initialValues: { k: 0 },
  controls: [{
    id: 'k',
    label: 'Test value',
    min: -8,
    max: 8,
    interactionMin: -2,
    interactionMax: 2,
    step: 1,
    valueText: values => `test value ${values.k}`,
    valueFromPointer: (_point, values) => values.k,
  }],
  steppers: [{ controlId: 'k', label: 'Test value' }],
  derive(values) {
    return {
      shapes: [],
      points: [{
        id: 'k',
        x: values.k,
        y: 0,
        text: `(${String(values.k).replace('-', '−')}, 0)`,
        shortText: 'K',
        role: 'object',
        tier: 'active',
        focusable: false,
      }],
      guides: [],
      handles: [],
      status: {
        heading: String(values.k).replace('-', '−'),
        calculation: [],
        explanation: 'Fixture.',
      },
    }
  },
  describe: values => `Fixture at ${values.k}.`,
}

// ─── Atomic diagonal drag ────────────────────────────────────────────────────
// Both coordinates must change, and onChange must fire with BOTH already
// applied. Two sequential single-control updates would emit a patch containing
// only the later one.
export const AtomicDiagonalDrag = {
  args: { preset: 'plotPoint', defaultValue: { x: 1, y: 1 }, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'x coordinate' })
    const svg = canvasElement.querySelector('svg')
    const box = svg.getBoundingClientRect()

    // The move must be dispatched ON the handle: onPointerMove is bound to the
    // handle <g>, and events do not propagate from an ancestor down to it. A
    // real browser routes captured moves back to the handle; userEvent sends
    // them wherever it is aimed, so aim them at the handle.
    await userEvent.pointer([
      { target: handle, keys: '[MouseLeft>]' },
      {
        target: handle,
        coords: { x: box.left + box.width * 0.78, y: box.top + box.height * 0.22 },
      },
      { target: handle, keys: '[/MouseLeft]' },
    ])

    expect(args.onChange).toHaveBeenCalled()

    // Every emitted value object must carry both coordinates, and at least one
    // must differ from the start in BOTH — proving one atomic update, not two.
    const calls = args.onChange.mock.calls.map(([values]) => values)
    for (const values of calls) {
      expect(Object.keys(values)).toEqual(expect.arrayContaining(['x', 'y']))
    }
    const moved = calls.some(values => values.x !== 1 && values.y !== 1)
    expect(moved, 'a diagonal drag must change x and y together').toBe(true)
  },
}

// ─── Stepper pointer and keyboard parity ─────────────────────────────────────
export const PointerKeyboardParity = {
  args: { preset: STEPPER_FIXTURE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })
    const increase = canvas.getByRole('button', { name: 'Increase Test value' })
    const decrease = canvas.getByRole('button', { name: 'Decrease Test value' })

    await expect(value).toHaveAttribute('aria-valuenow', '0')

    await userEvent.click(increase)
    await expect(value).toHaveAttribute('aria-valuenow', '1')
    const afterPointer = value.textContent

    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '0')

    value.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(value).toHaveAttribute('aria-valuenow', '1')

    // Identical result from either route.
    expect(value.textContent).toBe(afterPointer)

    await userEvent.keyboard('{ArrowLeft}')
    await expect(value).toHaveAttribute('aria-valuenow', '0')
  },
}

// ─── Home/End use the interaction range ──────────────────────────────────────
// The fixture accepts −8…8 but only lets a learner reach −2…2.
export const HomeEndUseInteractionRange = {
  args: { preset: STEPPER_FIXTURE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })

    value.focus()
    await userEvent.keyboard('{End}')
    await expect(value).toHaveAttribute('aria-valuenow', '2')

    await userEvent.keyboard('{Home}')
    await expect(value).toHaveAttribute('aria-valuenow', '-2')

    // ARIA advertises what is reachable, not what the model accepts.
    await expect(value).toHaveAttribute('aria-valuemin', '-2')
    await expect(value).toHaveAttribute('aria-valuemax', '2')

    // Repeated stepping cannot escape the interaction range either.
    await userEvent.keyboard('{ArrowRight>12/}')
    await expect(value).toHaveAttribute('aria-valuenow', '2')
  },
}

// ─── A supplied value outside the interaction range is untouched ─────────────
// This is the corruption the two-range contract exists to prevent.
export const SuppliedValueRendersUnchanged = {
  args: { preset: STEPPER_FIXTURE, interactive: false, defaultValue: { k: 6 } },
  play: async ({ canvasElement }) => {
    // Query by data attribute, not text: "6" also matches the axis tick
    // labelled 6, and getByText would resolve ambiguously.
    const heading = canvasElement.querySelector('[data-cp-status-heading]')

    // 6 is inside the model range (−8…8) but outside the interaction range
    // (−2…2). It must render as 6.
    expect(heading.textContent).toBe('6')
    expect(canvasElement.querySelector('[data-cp-point-label="k"]').textContent)
      .toBe('(6, 0)')
    expect(canvasElement.querySelector('desc').textContent).toContain('Fixture at 6')
  },
}

// The same value while interactive: still rendered as given, and the steppers
// operate from where it actually sits.
export const SuppliedValueStaysWhenInteractive = {
  args: { preset: STEPPER_FIXTURE, defaultValue: { k: 6 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })

    await expect(value).toHaveAttribute('aria-valuenow', '6')

    // ARIA stays valid: the advertised maximum stretches to admit the value
    // it is actually showing, rather than claiming a maximum of 2 while
    // reporting 6.
    await expect(value).toHaveAttribute('aria-valuemax', '6')
    await expect(value).toHaveAttribute('aria-valuemin', '-2')

    // Increase is unavailable — 6 is already above the configured maximum.
    await expect(canvas.getByRole('button', { name: 'Increase Test value' })).toBeDisabled()

    // Stepping down walks one unit at a time rather than jumping four.
    const decrease = canvas.getByRole('button', { name: 'Decrease Test value' })
    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '5')
    await expect(value).toHaveAttribute('aria-valuemax', '5')

    await userEvent.click(decrease)
    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '3')

    // On reaching the configured maximum the range contracts back to normal.
    // Increase stays unavailable here because 2 IS the maximum.
    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '2')
    await expect(value).toHaveAttribute('aria-valuemax', '2')
    await expect(canvas.getByRole('button', { name: 'Increase Test value' })).toBeDisabled()

    // One step below it, increase works again and cannot climb back past 2.
    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '1')
    const increase = canvas.getByRole('button', { name: 'Increase Test value' })
    await expect(increase).toBeEnabled()
    await userEvent.click(increase)
    await expect(value).toHaveAttribute('aria-valuenow', '2')
    await expect(increase).toBeDisabled()
  },
}

// A pointer drag is direct positioning, not a nudge, so it may land anywhere
// inside the configured range in one gesture.
export const DragPullsOutOfRangeValueStraightBack = {
  args: { preset: 'plotPoint', defaultValue: { x: 3, y: -2 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const xSlider = canvas.getByRole('slider', { name: 'x coordinate' })

    await expect(xSlider).toHaveAttribute('aria-valuenow', '3')
  },
}

// ─── 320px containment ───────────────────────────────────────────────────────
export const NarrowViewport = {
  args: { preset: STEPPER_FIXTURE },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.cp-explore')

    expect(diagram.getBoundingClientRect().width).toBeLessThanOrEqual(320.5)
    expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth)

    const row = canvasElement.querySelector('[data-cp-stepper-row]')
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)

    for (const button of canvasElement.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect()
      expect(rect.height, `${button.textContent} height`).toBeGreaterThanOrEqual(43.5)
      expect(rect.width, `${button.textContent} width`).toBeGreaterThanOrEqual(43.5)
    }
  },
}

// ─── Accessibility output ────────────────────────────────────────────────────
export const Accessibility = {
  args: { preset: STEPPER_FIXTURE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })
    const live = canvasElement.querySelector('[data-cp-status-announcement]')

    // Slider semantics complete.
    await expect(value).toHaveAttribute('aria-valuenow', '0')
    await expect(value).toHaveAttribute('aria-valuemin', '-2')
    await expect(value).toHaveAttribute('aria-valuemax', '2')
    await expect(value).toHaveAttribute('aria-valuetext', 'test value 0')
    expect(value.getAttribute('tabindex')).toBe('0')

    // A single polite live region, empty until something happens.
    expect(live).not.toBeNull()
    expect(live.getAttribute('aria-live')).toBe('polite')
    expect(live.textContent).toBe('')

    // One action produces one announcement, and value text tracks the value.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Test value' }))
    await expect(value).toHaveAttribute('aria-valuetext', 'test value 1')
    expect(live.textContent).toBe('1')
    expect(canvasElement.querySelectorAll('[data-cp-status-announcement]')).toHaveLength(1)

    // The figure is labelled and described for screen readers.
    const svg = canvasElement.querySelector('svg')
    expect(svg.getAttribute('role')).toBe('group')
    expect(svg.querySelector('title').textContent).toBe('Contract stepper fixture')
    expect(svg.querySelector('desc').textContent.length).toBeGreaterThan(0)
  },
}

// Static mode drops the live region but keeps the description.
export const StaticAccessibility = {
  args: { preset: 'plotPoint', interactive: false, defaultValue: { x: -4, y: 3 } },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvasElement.querySelector('svg desc').textContent).toContain('(−4, 3)')
    expect(within(canvasElement).queryByRole('slider')).toBeNull()
  },
}

// ─── Every control a handle drives is keyboard reachable ─────────────────────
// One visual ring, one semantic slider per control. Without this a point
// handle exposes only its primary control and the y-coordinate cannot be
// moved by keyboard at all.
export const HandleExposesOneSliderPerControl = {
  args: { preset: 'plotPoint', defaultValue: { x: 3, y: -2 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const xSlider = canvas.getByRole('slider', { name: 'x coordinate' })
    const ySlider = canvas.getByRole('slider', { name: 'y coordinate' })

    await expect(xSlider).toHaveAttribute('aria-valuenow', '3')
    await expect(ySlider).toHaveAttribute('aria-valuenow', '-2')

    // Both sliders are tabbable, and share a single visual ring.
    expect(xSlider.getAttribute('tabindex')).toBe('0')
    expect(ySlider.getAttribute('tabindex')).toBe('0')
    expect(canvasElement.querySelectorAll('.cp-explore__handle-ring')).toHaveLength(1)
  },
}

export const ArrowUpMovesYOnly = {
  args: { preset: 'plotPoint', defaultValue: { x: 3, y: -2 }, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const xSlider = canvas.getByRole('slider', { name: 'x coordinate' })
    const ySlider = canvas.getByRole('slider', { name: 'y coordinate' })
    const live = canvasElement.querySelector('[data-cp-status-announcement]')

    ySlider.focus()
    await userEvent.keyboard('{ArrowUp}')

    // y moved, x did not.
    await expect(ySlider).toHaveAttribute('aria-valuenow', '-1')
    await expect(xSlider).toHaveAttribute('aria-valuenow', '3')

    // Exactly one change, carrying both coordinates, with x untouched.
    expect(args.onChange).toHaveBeenCalledTimes(1)
    expect(args.onChange.mock.calls[0][0]).toEqual({ x: 3, y: -1 })

    // Exactly one announcement.
    expect(live.textContent).toBe('(3, −1)')

    await userEvent.keyboard('{ArrowDown}')
    await expect(ySlider).toHaveAttribute('aria-valuenow', '-2')
    await expect(xSlider).toHaveAttribute('aria-valuenow', '3')
  },
}

export const ArrowRightMovesXOnly = {
  args: { preset: 'plotPoint', defaultValue: { x: 3, y: -2 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const xSlider = canvas.getByRole('slider', { name: 'x coordinate' })
    const ySlider = canvas.getByRole('slider', { name: 'y coordinate' })

    xSlider.focus()
    await userEvent.keyboard('{ArrowRight}')

    await expect(xSlider).toHaveAttribute('aria-valuenow', '4')
    await expect(ySlider).toHaveAttribute('aria-valuenow', '-2')
  },
}

// Home/End act on whichever slider holds focus, not on a single primary axis.
export const HomeEndActOnTheFocusedAxis = {
  args: { preset: 'plotPoint', defaultValue: { x: 3, y: -2 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const xSlider = canvas.getByRole('slider', { name: 'x coordinate' })
    const ySlider = canvas.getByRole('slider', { name: 'y coordinate' })

    ySlider.focus()
    await userEvent.keyboard('{End}')
    await expect(ySlider).toHaveAttribute('aria-valuenow', '6')
    await expect(xSlider).toHaveAttribute('aria-valuenow', '3')

    xSlider.focus()
    await userEvent.keyboard('{Home}')
    await expect(xSlider).toHaveAttribute('aria-valuenow', '-6')
    await expect(ySlider).toHaveAttribute('aria-valuenow', '6')
  },
}

// ─── Keyboard focus is visible on the stepper value ──────────────────────────
// An inline outline: none previously beat the stylesheet's focus rule, leaving
// the focused slider with no visible indicator at all.
export const StepperValueShowsKeyboardFocus = {
  args: { preset: STEPPER_FIXTURE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })

    // No inline suppression left on the element.
    expect(value.style.outline).toBe('')

    value.focus()
    expect(document.activeElement).toBe(value)

    const outline = getComputedStyle(value).outlineStyle
    const width = getComputedStyle(value).outlineWidth

    expect(outline).not.toBe('none')
    expect(parseFloat(width)).toBeGreaterThan(0)
  },
}

// The shared ring lights when either axis slider has focus.
export const HandleRingLightsOnFocusWithin = {
  args: { preset: 'plotPoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ring = canvasElement.querySelector('.cp-explore__handle-ring')
    const resting = getComputedStyle(ring).opacity

    // The attention hint is running at this point — that is exactly the state
    // in which the focus indicator was previously invisible, because animated
    // values outrank normal declarations in the cascade.
    expect(canvasElement.querySelector('.cp-explore__handle-hint')).not.toBeNull()

    const ySlider = canvas.getByRole('slider', { name: 'y coordinate' })
    ySlider.focus()

    // The selector must actually match — assert that directly rather than
    // inferring it from a computed value.
    expect(document.activeElement).toBe(ySlider)
    expect(ring.matches('.cp-explore__handle:focus-within .cp-explore__handle-ring')).toBe(true)

    const focused = getComputedStyle(ring).opacity
    expect(parseFloat(focused)).toBeGreaterThan(parseFloat(resting))
  },
}

// ─── Two handles on one plane ────────────────────────────────────────────────
//
// `midpoint` is the first preset with two draggable points, which is where the
// per-handle contracts stop being theoretical: each endpoint needs its own pair
// of semantic sliders, mapped to the right axis, updating atomically, and each
// must be able to take over the annotation from the other.

const MIDPOINT_START = { ax: -3, ay: 1, bx: 5, by: 5 }

// A drag on endpoint A must move ax and ay in ONE patch. Two sequential
// single-control updates would both close over the same render-time values, so
// the second would silently discard the first.
export const MidpointEndpointDragIsAtomic = {
  args: { preset: 'midpoint', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Point A x' })
    const svg = canvasElement.querySelector('svg')
    const box = svg.getBoundingClientRect()

    // Dispatched ON the handle: onPointerMove is bound to the handle, and
    // events do not propagate from an ancestor down to it.
    await userEvent.pointer([
      { target: handle, keys: '[MouseLeft>]' },
      {
        target: handle,
        coords: { x: box.left + box.width * 0.78, y: box.top + box.height * 0.22 },
      },
      { target: handle, keys: '[/MouseLeft]' },
    ])

    expect(args.onChange).toHaveBeenCalled()

    // Every emitted object carries the complete four-value state, and at least
    // one differs from the start in BOTH of A's coordinates.
    const calls = args.onChange.mock.calls.map(([values]) => values)
    for (const values of calls) {
      expect(Object.keys(values)).toEqual(
        expect.arrayContaining(['ax', 'ay', 'bx', 'by']),
      )
    }
    const moved = calls.some(values => (
      values.ax !== MIDPOINT_START.ax && values.ay !== MIDPOINT_START.ay
    ))
    expect(moved, 'a diagonal drag must change ax and ay together').toBe(true)
  },
}

// Each endpoint exposes an independent x and y slider, and neither endpoint's
// keys reach the other one.
export const MidpointEndpointsStepIndependently = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ax = canvas.getByRole('slider', { name: 'Point A x' })
    const ay = canvas.getByRole('slider', { name: 'Point A y' })
    const bx = canvas.getByRole('slider', { name: 'Point B x' })
    const by = canvas.getByRole('slider', { name: 'Point B y' })

    await expect(ax).toHaveAttribute('aria-valuenow', '-3')
    await expect(ay).toHaveAttribute('aria-valuenow', '1')
    await expect(bx).toHaveAttribute('aria-valuenow', '5')
    await expect(by).toHaveAttribute('aria-valuenow', '5')

    ax.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(ax).toHaveAttribute('aria-valuenow', '-2')
    await expect(ay).toHaveAttribute('aria-valuenow', '1')
    await expect(bx).toHaveAttribute('aria-valuenow', '5')
    await expect(by).toHaveAttribute('aria-valuenow', '5')

    ay.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(ay).toHaveAttribute('aria-valuenow', '2')
    await expect(ax).toHaveAttribute('aria-valuenow', '-2')

    bx.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(bx).toHaveAttribute('aria-valuenow', '6')
    await expect(by).toHaveAttribute('aria-valuenow', '5')
    await expect(ax).toHaveAttribute('aria-valuenow', '-2')

    by.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(by).toHaveAttribute('aria-valuenow', '6')
    await expect(bx).toHaveAttribute('aria-valuenow', '6')
    await expect(ay).toHaveAttribute('aria-valuenow', '2')
  },
}

// One visual ring per endpoint, two semantic sliders per endpoint. A shared
// ring is what keeps two focus targets reading as one object.
export const MidpointHasOneRingAndTwoSlidersPerEndpoint = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelectorAll('.cp-explore__handle-ring')).toHaveLength(2)
    expect(canvasElement.querySelectorAll('[data-cp-handle]')).toHaveLength(2)

    for (const name of ['Point A x', 'Point A y', 'Point B x', 'Point B y']) {
      const slider = canvas.getByRole('slider', { name })
      expect(slider.getAttribute('tabindex')).toBe('0')
    }

    // Four sliders and no more: a handle-driven point does not also render a
    // separate "Select …" button, so each endpoint costs exactly two tab stops.
    expect(canvas.getAllByRole('slider')).toHaveLength(4)
    expect(canvas.queryByRole('button', { name: /Select A/ })).toBeNull()
    expect(canvas.queryByRole('button', { name: /Select B/ })).toBeNull()

    // The midpoint has no handle, so it keeps its own activation button.
    expect(canvas.getByRole('button', { name: /Select M/ })).toBeInTheDocument()
  },
}

// The controlIds order is what maps a handle's controls onto the axes. Getting
// it backwards swaps x and y silently, so assert the mapping both ways.
export const MidpointHandleAxisMappingIsCorrect = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ax = canvas.getByRole('slider', { name: 'Point A x' })
    const ay = canvas.getByRole('slider', { name: 'Point A y' })

    // First controlId runs horizontally, second vertically.
    expect(ax.getAttribute('data-cp-handle-axis')).toBe('horizontal')
    expect(ay.getAttribute('data-cp-handle-axis')).toBe('vertical')

    ax.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(ax).toHaveAttribute('aria-valuenow', '-2')
    await expect(ay).toHaveAttribute('aria-valuenow', '1')

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    await expect(ax).toHaveAttribute('aria-valuenow', '-4')
    await expect(ay).toHaveAttribute('aria-valuenow', '1')

    ay.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(ay).toHaveAttribute('aria-valuenow', '2')
    await expect(ax).toHaveAttribute('aria-valuenow', '-4')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(ay).toHaveAttribute('aria-valuenow', '0')
    await expect(ax).toHaveAttribute('aria-valuenow', '-4')
  },
}

// One keyboard action, one onChange, carrying the whole state — not a patch of
// the single control that moved.
export const MidpointKeyboardEmitsOneCompleteChange = {
  args: { preset: 'midpoint', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const ay = canvas.getByRole('slider', { name: 'Point A y' })

    ay.focus()
    await userEvent.keyboard('{ArrowUp}')

    expect(args.onChange).toHaveBeenCalledTimes(1)
    expect(args.onChange.mock.calls[0][0]).toEqual({
      ...MIDPOINT_START,
      ay: MIDPOINT_START.ay + 1,
    })
  },
}

// Attention follows focus. Without onFocus on the slider targets, tabbing from
// endpoint A to endpoint B left the guides and the active annotation on A.
export const MidpointFocusMovesTheActiveAnnotation = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pointA = () => canvasElement.querySelector('[data-cp-point="a"]')
    const pointB = () => canvasElement.querySelector('[data-cp-point="b"]')
    const activeCount = () => canvasElement.querySelectorAll('[data-cp-tier="active"]').length

    // Exactly one active element, and it starts on A.
    expect(activeCount()).toBe(1)
    expect(pointA().getAttribute('data-cp-tier')).toBe('active')
    expect(pointB().getAttribute('data-cp-tier')).toBe('related')

    canvas.getByRole('slider', { name: 'Point B x' }).focus()

    // Still exactly one — the annotation moved rather than accumulating.
    await waitFor(() => {
      expect(pointB().getAttribute('data-cp-tier')).toBe('active')
    })
    expect(activeCount()).toBe(1)
    expect(pointA().getAttribute('data-cp-tier')).toBe('related')

    // And back again, from B's y slider to A's.
    canvas.getByRole('slider', { name: 'Point A y' }).focus()
    await waitFor(() => {
      expect(pointA().getAttribute('data-cp-tier')).toBe('active')
    })
    expect(activeCount()).toBe(1)
    expect(pointB().getAttribute('data-cp-tier')).toBe('related')
  },
}

// Presets author shape paths in model space; the renderer projects them. Left
// unprojected, "M −3 1 L 5 5" would draw a few pixels wide in the corner of the
// viewBox and be clipped away — wrong, but wrong invisibly.
export const ModelSpaceShapePathsAreProjected = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const segment = canvasElement.querySelector('[data-cp-shape="segment"]')
    const markOf = id => canvasElement.querySelector(`[data-cp-point="${id}"] circle`)

    // Not the model-space string the preset wrote.
    expect(segment.getAttribute('d')).not.toContain('M -3 1')

    // The drawn segment spans exactly the two endpoint marks.
    const box = segment.getBBox()
    const xs = ['a', 'b'].map(id => Number(markOf(id).getAttribute('cx')))
    const ys = ['a', 'b'].map(id => Number(markOf(id).getAttribute('cy')))

    expect(box.x).toBeCloseTo(Math.min(...xs), 1)
    expect(box.x + box.width).toBeCloseTo(Math.max(...xs), 1)
    expect(box.y).toBeCloseTo(Math.min(...ys), 1)
    expect(box.y + box.height).toBeCloseTo(Math.max(...ys), 1)
  },
}

// ─── straightLine: the first preset operated entirely through steppers ───────
//
// It declares no handles at all, so the stepper row is the ONLY way m and c can
// be reached. That makes it the sharpest test of the control-reachability rule:
// if the steppers stop rendering, the preset is not merely awkward, it is dead.
//
// It also declares m2 and c2 in initialValues WITHOUT declaring them as
// controls — they belong to the comparison line, which the caller configures.
// A control the preset never declared must surface no UI whatsoever.

const STRAIGHT_LINE_START = { m: 2, c: 1, m2: 1, c2: -3 }

const stepperIds = canvasElement => [...canvasElement.querySelectorAll('[data-cp-stepper]')]
  .map(node => node.getAttribute('data-cp-stepper'))

const calculationText = canvasElement =>
  [...canvasElement.querySelectorAll('[data-cp-status-calculation]')]
    .map(node => node.textContent)
    .join(' ')

const interceptMarkY = canvasElement => Number(
  canvasElement.querySelector('[data-cp-point="y-intercept"] circle').getAttribute('cy'),
)

// 1. Both defining numbers are reachable, and both steppers actually work.
export const StraightLineBothControlsAreReachable = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // No handles exist on this preset — assert that, so the story cannot pass
    // by accidentally driving a drag handle instead of a stepper.
    expect(canvasElement.querySelectorAll('[data-cp-handle]')).toHaveLength(0)

    expect(stepperIds(canvasElement)).toEqual(['m', 'c'])

    const gradient = canvas.getByRole('slider', { name: 'Gradient' })
    const intercept = canvas.getByRole('slider', { name: 'Y-intercept' })

    await expect(gradient).toHaveAttribute('aria-valuenow', '2')
    await expect(intercept).toHaveAttribute('aria-valuenow', '1')

    // Both −/+ pairs are present.
    for (const name of [
      'Increase Gradient', 'Decrease Gradient',
      'Increase Y-intercept', 'Decrease Y-intercept',
    ]) {
      await expect(canvas.getByRole('button', { name })).toBeVisible()
    }

    // And both pairs move their own value in both directions.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))
    await expect(gradient).toHaveAttribute('aria-valuenow', '3')
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Gradient' }))
    await expect(gradient).toHaveAttribute('aria-valuenow', '2')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Y-intercept' }))
    await expect(intercept).toHaveAttribute('aria-valuenow', '2')
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Y-intercept' }))
    await expect(intercept).toHaveAttribute('aria-valuenow', '1')

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('y = 2x + 1')
  },
}

// 2. Pointer and keyboard are the same control, not two parallel ones — for
//    BOTH controls, in BOTH directions.
export const StraightLinePointerKeyboardParity = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gradient = canvas.getByRole('slider', { name: 'Gradient' })
    const intercept = canvas.getByRole('slider', { name: 'Y-intercept' })
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    // Gradient: click + then read the whole rendered result.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))
    const gradientAfterPointer = {
      valueNow: gradient.getAttribute('aria-valuenow'),
      valueText: gradient.getAttribute('aria-valuetext'),
      display: gradient.textContent,
      heading: heading(),
    }

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Gradient' }))
    await expect(gradient).toHaveAttribute('aria-valuenow', '2')

    gradient.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect({
      valueNow: gradient.getAttribute('aria-valuenow'),
      valueText: gradient.getAttribute('aria-valuetext'),
      display: gradient.textContent,
      heading: heading(),
    }).toEqual(gradientAfterPointer)

    // Decrease parity: click − and ArrowLeft must also agree.
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Gradient' }))
    const gradientAfterMinusClick = heading()
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))
    gradient.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(heading()).toBe(gradientAfterMinusClick)
    await expect(gradient).toHaveAttribute('aria-valuenow', '2')

    // Y-intercept: the same two routes, again in both directions.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Y-intercept' }))
    const interceptAfterPointer = {
      valueNow: intercept.getAttribute('aria-valuenow'),
      valueText: intercept.getAttribute('aria-valuetext'),
      display: intercept.textContent,
      heading: heading(),
    }

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Y-intercept' }))
    await expect(intercept).toHaveAttribute('aria-valuenow', '1')

    intercept.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect({
      valueNow: intercept.getAttribute('aria-valuenow'),
      valueText: intercept.getAttribute('aria-valuetext'),
      display: intercept.textContent,
      heading: heading(),
    }).toEqual(interceptAfterPointer)

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Y-intercept' }))
    const interceptAfterMinusClick = heading()
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Y-intercept' }))
    intercept.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(heading()).toBe(interceptAfterMinusClick)
    await expect(intercept).toHaveAttribute('aria-valuenow', '1')
  },
}

// 3. One action, one complete payload. A stepper touches one control, but the
//    emitted object must still carry the whole value state — including m2 and
//    c2, which no control declares and which a partial patch would drop.
export const StraightLineStepperEmitsOneCompleteChange = {
  args: { preset: 'straightLine', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))

    expect(args.onChange).toHaveBeenCalledTimes(1)

    const payload = args.onChange.mock.calls[0][0]
    expect(Object.keys(payload).sort()).toEqual(['c', 'c2', 'm', 'm2'])
    expect(payload).toEqual({ ...STRAIGHT_LINE_START, m: 3 })
  },
}

// 4. m and c are independent: changing the gradient rotates the line about its
//    y-intercept, and leaves the intercept exactly where it was.
export const StraightLineGradientDoesNotMoveTheIntercept = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const line = () => canvasElement.querySelector('[data-cp-shape="line-1"]').getAttribute('d')

    const interceptBefore = interceptMarkY(canvasElement)
    const lineBefore = line()

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))

    // The intercept point has not moved a pixel.
    expect(interceptMarkY(canvasElement)).toBe(interceptBefore)
    await expect(canvas.getByRole('slider', { name: 'Y-intercept' }))
      .toHaveAttribute('aria-valuenow', '1')

    // The line itself is a different line.
    expect(line()).not.toBe(lineBefore)
    expect(calculationText(canvasElement)).toContain('rise ÷ run = 3 ÷ 1 = 3')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('y = 3x + 1')
  },
}

// 5. The mirror image: changing c slides the line up, and the gradient is
//    untouched.
export const StraightLineInterceptDoesNotChangeTheGradient = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const interceptBefore = interceptMarkY(canvasElement)
    expect(calculationText(canvasElement)).toContain('rise ÷ run = 2 ÷ 1 = 2')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Y-intercept' }))

    // Up the y-axis is a smaller SVG y, so the mark genuinely moved upward.
    expect(interceptMarkY(canvasElement)).toBeLessThan(interceptBefore)

    // The gradient is unchanged, in the control and in the stated maths.
    await expect(canvas.getByRole('slider', { name: 'Gradient' }))
      .toHaveAttribute('aria-valuenow', '2')
    expect(calculationText(canvasElement)).toContain('rise ÷ run = 2 ÷ 1 = 2')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('y = 2x + 2')
  },
}

// 6. m2 and c2 are real values that change the picture, and are NOT declared
//    controls. An undeclared control must surface no UI at all — no stepper, no
//    slider, no buttons — or the learner would be handed a control the preset
//    never agreed to expose.
export const StraightLineHidesUndeclaredComparisonControls = {
  args: {
    preset: 'straightLine',
    focus: 'compare',
    comparisonRule: 'free',
    defaultValue: { m: 2, c: 1, m2: -1, c2: -3 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The comparison line is genuinely on screen, driven by m2 and c2.
    expect(canvasElement.querySelector('[data-cp-shape="line-2"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toContain('y = −x')

    // Exactly two steppers, for exactly the two declared controls.
    expect(stepperIds(canvasElement)).toEqual(['m', 'c'])

    // No slider, and no button, belongs to the comparison line.
    expect(canvas.getAllByRole('slider')).toHaveLength(2)
    expect(canvas.getAllByRole('button')).toHaveLength(4)

    for (const undeclared of ['m2', 'c2']) {
      expect(canvasElement.querySelector(`[data-cp-stepper="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-value="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-increment="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-decrement="${undeclared}"]`)).toBeNull()
    }
  },
}

// 7. A horizontal line's perpendicular is vertical, and a vertical line cannot
//    be written as y = mx + c. Drawing a second horizontal line here would
//    teach the exact opposite of the fact on display, so the preset refuses and
//    says why.
export const StraightLineRefusesImpossiblePerpendicular = {
  args: {
    preset: 'straightLine',
    focus: 'compare',
    comparisonRule: 'perpendicular',
    difficultyCapabilities: { perpendicularGradients: true },
    defaultValue: { m: 0, c: 2, m2: 1, c2: 0 },
  },
  play: async ({ canvasElement }) => {
    // No second line at all — not a faked one, not a hidden one.
    expect(canvasElement.querySelector('[data-cp-shape="line-2"]')).toBeNull()
    expect(canvasElement.querySelector('[data-cp-point="y-intercept-2"]')).toBeNull()

    // The first line is still drawn; the refusal is about the partner only.
    expect(canvasElement.querySelector('[data-cp-shape="line-1"]')).not.toBeNull()

    const explanation = canvasElement.querySelector('[data-cp-status-explanation]').textContent
    expect(explanation).toContain('vertical')
    expect(explanation).toContain('cannot be written as y = mx + c')

    // The screen-reader description tells the same story — no fabricated
    // second equation, and no formatting wreckage from one.
    const description = canvasElement.querySelector('svg desc').textContent
    expect(description).toContain('vertical')
    expect(description).not.toContain('undefined')
    expect(description).not.toContain('NaN')
  },
}

// 8. y = 5x reaches y = ±25 across an x-axis of ±5 on a y-axis of ±5. The line
//    is clipped in model space at BOTH y bounds, so what is measured from the
//    scene is what the learner sees.
export const StraightLineSteepLineIsClippedAtBothYBounds = {
  args: {
    preset: 'straightLine',
    interactive: false,
    defaultValue: { m: 5, c: 0 },
  },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('[data-cp-shape="line-1"]')
    const clip = canvasElement.querySelector('clipPath rect')

    const plotTop = Number(clip.getAttribute('y'))
    const plotBottom = plotTop + Number(clip.getAttribute('height'))
    const box = line.getBBox()

    // Inside the plot at both ends...
    expect(box.y).toBeGreaterThanOrEqual(plotTop - 0.5)
    expect(box.y + box.height).toBeLessThanOrEqual(plotBottom + 0.5)

    // ...and reaching both of them, which is what makes this a clip rather than
    // a line that happened to be short.
    expect(box.y).toBeCloseTo(plotTop, 0)
    expect(box.y + box.height).toBeCloseTo(plotBottom, 0)

    // The clip happened in model space, not merely by the SVG clip path: the
    // path's own coordinates already stop at the boundary.
    const ys = line.getAttribute('d').match(/-?[\d.]+/g).map(Number)
      .filter((_, index) => index % 2 === 1)
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(plotTop - 0.5)
      expect(y).toBeLessThanOrEqual(plotBottom + 0.5)
    }
  },
}

// 9. The narrowest supported width. Two steppers share one row, so this is
//    where a stepper row would overflow if it were going to.
export const StraightLineNarrowViewport = {
  args: { preset: 'straightLine' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.cp-explore')

    expect(diagram.getBoundingClientRect().width).toBeLessThanOrEqual(320.5)
    expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth)

    const rows = canvasElement.querySelectorAll('[data-cp-stepper-row]')
    expect(rows).toHaveLength(1)
    for (const row of rows) {
      expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }

    // Four stepper buttons, every one a real touch target at 320px.
    const buttons = canvasElement.querySelectorAll('button')
    expect(buttons).toHaveLength(4)
    for (const button of buttons) {
      const rect = button.getBoundingClientRect()
      const name = button.getAttribute('aria-label')
      expect(rect.height, `${name} height`).toBeGreaterThanOrEqual(43.5)
      expect(rect.width, `${name} width`).toBeGreaterThanOrEqual(43.5)
    }
  },
}

// 10. Static mode is a diagram, not a disabled toy: the graph and the
//     explanation stay, every control disappears, and the live region — which
//     announces changes that can no longer happen — goes with them.
export const StraightLineStaticHasNoControls = {
  args: {
    preset: 'straightLine',
    interactive: false,
    defaultValue: { m: 2, c: 1 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The teaching figure is fully rendered.
    expect(canvasElement.querySelector('[data-cp-shape="line-1"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-point="y-intercept"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('y = 2x + 1')
    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent.length)
      .toBeGreaterThan(0)
    expect(calculationText(canvasElement)).toContain('rise ÷ run = 2 ÷ 1 = 2')

    // Nothing to operate, and nothing announcing.
    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cp-stepper-row]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryByRole('slider')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)

    // And the description says so.
    expect(canvasElement.querySelector('svg desc').textContent)
      .toContain('static illustration')
  },
}

// ─── tableOfValues: the staged line, and the trail that makes it worth ───────
//     stepping through
//
// The three line states are the lesson, not a styling choice: one point draws
// nothing, two points draw a PROVISIONAL dashed line, and the third coordinate
// confirms the rule so the line goes solid. A preset that drew a line from the
// first point would teach that any point implies a line; one that never
// dashed would teach that two points are as good as three.
//
// It is also the first preset whose declared control is a pure index — `step`
// is the only control, while m and c are configuration carried in
// initialValues. An undeclared value must surface no learner UI at all.

const TABLE_START = { m: 2, c: 1, step: 0 }
const TABLE_LAST_ROW = 5

const lineNode = canvasElement => canvasElement.querySelector('[data-cp-shape="line"]')

const plottedPointCount = canvasElement =>
  canvasElement.querySelectorAll('[data-cp-point^="plotted-"]').length

const trailTexts = canvasElement =>
  [...canvasElement.querySelectorAll('[data-cp-trail-item]')].map(node => node.textContent)

// 1. One point: no line at all.
export const TableOfValuesOnePointDrawsNoLine = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    expect(plottedPointCount(canvasElement)).toBe(1)
    expect(lineNode(canvasElement)).toBeNull()

    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toContain('One point is not enough')
  },
}

// 2. Two points: a line appears, and it is dashed — provisional, not proven.
export const TableOfValuesTwoPointsDrawADashedLine = {
  args: { preset: 'tableOfValues', defaultValue: { ...TABLE_START, step: 1 } },
  play: async ({ canvasElement }) => {
    const line = lineNode(canvasElement)

    expect(plottedPointCount(canvasElement)).toBe(2)
    expect(line).not.toBeNull()
    expect(line.getAttribute('stroke-dasharray')).toBe('6 5')

    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toContain('Two points define a straight line')
  },
}

// 3. Three points: the third coordinate confirms the rule, so the line is
//    solid. The dash attribute must be absent, not merely a different dash.
export const TableOfValuesThreePointsDrawASolidLine = {
  args: { preset: 'tableOfValues', defaultValue: { ...TABLE_START, step: 2 } },
  play: async ({ canvasElement }) => {
    const line = lineNode(canvasElement)

    expect(plottedPointCount(canvasElement)).toBe(3)
    expect(line).not.toBeNull()
    expect(line.getAttribute('stroke-dasharray')).toBeNull()

    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toContain('confirms')
  },
}

// 4. The whole sequence, walked through the real stepper button to the last
//    row: dashed at exactly two points and solid at every step after it. A
//    threshold that drifted by one would show up here rather than in a single
//    sampled step.
export const TableOfValuesLineStaysSolidToTheLastRow = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Table row' })
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    expect(lineNode(canvasElement)).toBeNull()

    await userEvent.click(next)
    await expect(value).toHaveAttribute('aria-valuenow', '1')
    expect(lineNode(canvasElement).getAttribute('stroke-dasharray')).toBe('6 5')

    for (let row = 2; row <= TABLE_LAST_ROW; row += 1) {
      await userEvent.click(next)
      await expect(value).toHaveAttribute('aria-valuenow', String(row))
      expect(plottedPointCount(canvasElement), `row ${row} point count`).toBe(row + 1)
      expect(
        lineNode(canvasElement).getAttribute('stroke-dasharray'),
        `row ${row} must be solid`,
      ).toBeNull()
    }

    // The last row is genuinely the last one.
    await expect(next).toBeDisabled()
  },
}

// 5. Pointer and keyboard are one control, not two parallel ones — in both
//    directions, and identical in everything the learner can perceive.
export const TableOfValuesPointerKeyboardParity = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Table row' })
    const increase = canvas.getByRole('button', { name: 'Increase Table row' })
    const decrease = canvas.getByRole('button', { name: 'Decrease Table row' })

    const rendered = () => ({
      valueNow: value.getAttribute('aria-valuenow'),
      valueText: value.getAttribute('aria-valuetext'),
      display: value.textContent,
      heading: canvasElement.querySelector('[data-cp-status-heading]').textContent,
      calculation: calculationText(canvasElement),
      trail: trailTexts(canvasElement),
      dash: lineNode(canvasElement)?.getAttribute('stroke-dasharray') ?? null,
    })

    // Increase: click + then read the whole rendered result.
    await userEvent.click(increase)
    const afterPlusClick = rendered()
    expect(afterPlusClick.valueNow).toBe('1')

    await userEvent.click(decrease)
    await expect(value).toHaveAttribute('aria-valuenow', '0')

    value.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(rendered()).toEqual(afterPlusClick)

    // Decrease: click − and ArrowLeft must also agree.
    await userEvent.click(increase)
    await expect(value).toHaveAttribute('aria-valuenow', '2')
    await userEvent.click(decrease)
    const afterMinusClick = rendered()
    expect(afterMinusClick.valueNow).toBe('1')

    await userEvent.click(increase)
    await expect(value).toHaveAttribute('aria-valuenow', '2')
    value.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(rendered()).toEqual(afterMinusClick)
  },
}

// 6. One action, one onChange, carrying the complete value state — including
//    m and c, which no control declares and which a partial patch would drop.
export const TableOfValuesStepperEmitsOneCompleteChange = {
  args: { preset: 'tableOfValues', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Table row' }))

    expect(args.onChange).toHaveBeenCalledTimes(1)

    const payload = args.onChange.mock.calls[0][0]
    expect(Object.keys(payload).sort()).toEqual(['c', 'm', 'step'])
    expect(payload).toEqual({ ...TABLE_START, step: 1 })
  },
}

// 7. `step` is the ONLY learner control. m and c are configuration: they change
//    the picture, but the preset never agreed to expose them, so no stepper,
//    slider or button may exist for either.
export const TableOfValuesExposesOnlyTheRowControl = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(stepperIds(canvasElement)).toEqual(['step'])

    // Exactly one slider and one −/+ pair, all belonging to the row control.
    const sliders = canvas.getAllByRole('slider')
    expect(sliders).toHaveLength(1)
    expect(sliders[0].getAttribute('aria-label')).toBe('Table row')
    expect(canvas.getAllByRole('button')).toHaveLength(2)

    // No handle either — the stepper is the only way in.
    expect(canvasElement.querySelectorAll('[data-cp-handle]')).toHaveLength(0)

    for (const undeclared of ['m', 'c']) {
      expect(canvasElement.querySelector(`[data-cp-stepper="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-value="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-increment="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-decrement="${undeclared}"]`)).toBeNull()
    }
    // Named exhaustively rather than by a loose pattern: the only two buttons
    // on screen both belong to the row control.
    expect(canvas.getAllByRole('button').map(button => button.getAttribute('aria-label')))
      .toEqual(['Decrease Table row', 'Increase Table row'])

    for (const name of ['Gradient', 'Y-intercept', 'm', 'c']) {
      expect(canvas.queryByRole('slider', { name })).toBeNull()
      expect(canvas.queryByRole('button', { name: `Increase ${name}` })).toBeNull()
      expect(canvas.queryByRole('button', { name: `Decrease ${name}` })).toBeNull()
    }
  },
}

// 8. Earlier results persist. Without the trail this preset is ordinary point
//    plotting with extra arithmetic, so the accumulation is the feature.
export const TableOfValuesAccumulatesATrail = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    expect(trailTexts(canvasElement)).toEqual(['(−2, −3)'])

    await userEvent.click(next)
    expect(trailTexts(canvasElement)).toEqual(['(−2, −3)', '(−1, −1)'])

    await userEvent.click(next)
    await userEvent.click(next)
    expect(trailTexts(canvasElement)).toEqual([
      '(−2, −3)', '(−1, −1)', '(0, 1)', '(1, 3)',
    ])

    // Stepping back does not rewrite history it has not reached yet — the
    // trail shows exactly the rows worked out, no more and no fewer.
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Table row' }))
    expect(trailTexts(canvasElement)).toEqual(['(−2, −3)', '(−1, −1)', '(0, 1)'])
  },
}

// 9. Attention sits on the newest coordinate only. Every earlier point stays
//    visible but subdued, which is what lets the newest one still read as the
//    thing that just happened.
export const TableOfValuesMarksOnlyTheNewestPointActive = {
  args: { preset: 'tableOfValues', defaultValue: { ...TABLE_START, step: 2 } },
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelectorAll('[data-cp-tier="active"]')

    expect(plottedPointCount(canvasElement)).toBe(3)
    expect(active).toHaveLength(1)
    expect(active[0].getAttribute('data-cp-point')).toBe('plotted-2')
    expect(canvasElement.querySelector('[data-cp-point-label="plotted-2"]').textContent)
      .toBe('(0, 1)')

    for (const id of ['plotted-0', 'plotted-1']) {
      expect(
        canvasElement.querySelector(`[data-cp-point="${id}"]`).getAttribute('data-cp-tier'),
        `${id} tier`,
      ).toBe('related')
    }
  },
}

// 10a. The substitution line is the arithmetic a learner is copying, so every
//      sign and bracket in it is load bearing. Bracketing only the negative x
//      values silently concatenates the two numbers everywhere else — m = 2 at
//      x = 1 would render "y = 21 + 1 = 3", which is a different sum, not a
//      cosmetic slip. Every row is checked.
export const TableOfValuesSubstitutionSigns = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    const expected = [
      'x = −2 → y = 2(−2) + 1 = −3',
      'x = −1 → y = 2(−1) + 1 = −1',
      'x = 0 → y = 2(0) + 1 = 1',
      'x = 1 → y = 2(1) + 1 = 3',
      'x = 2 → y = 2(2) + 1 = 5',
      'x = 3 → y = 2(3) + 1 = 7',
    ]

    for (const [row, text] of expected.entries()) {
      if (row > 0) await userEvent.click(next)
      expect(calculationText(canvasElement), `row ${row}`).toBe(text)
      // Every minus is a real minus sign (U+2212), never an ASCII hyphen.
      expect(calculationText(canvasElement), `row ${row} hyphen`).not.toContain('-')
    }
  },
}

// 10b. Negative coefficients: a negative gradient multiplying a negative x, and
//      a negative intercept subtracted rather than added.
export const TableOfValuesNegativeCoefficients = {
  args: { preset: 'tableOfValues', defaultValue: { m: -3, c: -4, step: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    // −3 × −2 = 6, then − 4 = 2. The negative x is bracketed so the two
    // adjacent signs cannot be misread as one.
    expect(calculationText(canvasElement)).toBe('x = −2 → y = −3(−2) − 4 = 2')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(−2, 2)')

    await userEvent.click(next)
    expect(calculationText(canvasElement)).toBe('x = −1 → y = −3(−1) − 4 = −1')
    expect(calculationText(canvasElement)).not.toContain('-')
    expect(trailTexts(canvasElement)).toEqual(['(−2, 2)', '(−1, −1)'])

    await userEvent.click(next)
    expect(calculationText(canvasElement)).toBe('x = 0 → y = −3(0) − 4 = −4')
  },
}

// 11. The row index is an index into a real table: it cannot run off either
//     end, by arrow keys or by Home/End.
export const TableOfValuesRowRangeIsRespected = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Table row' })
    const increase = canvas.getByRole('button', { name: 'Increase Table row' })
    const decrease = canvas.getByRole('button', { name: 'Decrease Table row' })

    await expect(value).toHaveAttribute('aria-valuemin', '0')
    await expect(value).toHaveAttribute('aria-valuemax', String(TABLE_LAST_ROW))
    await expect(decrease).toBeDisabled()

    value.focus()
    await userEvent.keyboard('{End}')
    await expect(value).toHaveAttribute('aria-valuenow', String(TABLE_LAST_ROW))
    await expect(value).toHaveAttribute('aria-valuetext', 'row 6 of 6')
    await expect(increase).toBeDisabled()

    // Repeated presses past the end change nothing.
    await userEvent.keyboard('{ArrowRight>4/}')
    await expect(value).toHaveAttribute('aria-valuenow', String(TABLE_LAST_ROW))
    expect(trailTexts(canvasElement)).toHaveLength(TABLE_LAST_ROW + 1)

    await userEvent.keyboard('{Home}')
    await expect(value).toHaveAttribute('aria-valuenow', '0')
    await expect(value).toHaveAttribute('aria-valuetext', 'row 1 of 6')

    await userEvent.keyboard('{ArrowLeft>4/}')
    await expect(value).toHaveAttribute('aria-valuenow', '0')
    expect(trailTexts(canvasElement)).toHaveLength(1)
    await expect(decrease).toBeDisabled()
  },
}

// 12. The narrowest supported width, at the fullest state: six coordinate chips
//     plus a stepper row. This is where the trail would overflow if it were
//     going to.
export const TableOfValuesNarrowViewport = {
  args: { preset: 'tableOfValues', defaultValue: { ...TABLE_START, step: TABLE_LAST_ROW } },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.cp-explore')

    expect(diagram.getBoundingClientRect().width).toBeLessThanOrEqual(320.5)
    expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth)

    const trail = canvasElement.querySelector('[data-cp-trail]')
    expect(trailTexts(canvasElement)).toHaveLength(TABLE_LAST_ROW + 1)
    expect(trail.scrollWidth).toBeLessThanOrEqual(trail.clientWidth)

    const rows = canvasElement.querySelectorAll('[data-cp-stepper-row]')
    expect(rows).toHaveLength(1)
    for (const row of rows) {
      expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }

    const buttons = canvasElement.querySelectorAll('button')
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      const rect = button.getBoundingClientRect()
      const name = button.getAttribute('aria-label')
      expect(rect.height, `${name} height`).toBeGreaterThanOrEqual(43.5)
      expect(rect.width, `${name} width`).toBeGreaterThanOrEqual(43.5)
    }
  },
}

// 13. Static mode is a finished diagram, not a disabled toy: the accumulated
//     state it was given is fully rendered, every control disappears, and the
//     live region — which announces changes that can no longer happen — goes
//     with them.
export const TableOfValuesStaticShowsTheAccumulatedState = {
  args: {
    preset: 'tableOfValues',
    interactive: false,
    defaultValue: { ...TABLE_START, step: 3 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The selected state, in full.
    expect(plottedPointCount(canvasElement)).toBe(4)
    expect(lineNode(canvasElement)).not.toBeNull()
    expect(lineNode(canvasElement).getAttribute('stroke-dasharray')).toBeNull()
    expect(trailTexts(canvasElement)).toEqual([
      '(−2, −3)', '(−1, −1)', '(0, 1)', '(1, 3)',
    ])
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(1, 3)')
    expect(calculationText(canvasElement)).toBe('x = 1 → y = 2(1) + 1 = 3')

    // Nothing to operate, and nothing announcing.
    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cp-stepper-row]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryByRole('slider')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)

    // And the description says so.
    const description = canvasElement.querySelector('svg desc').textContent
    expect(description).toContain('(−2, −3), (−1, −1), (0, 1), (1, 3)')
    expect(description).toContain('static illustration')
  },
}

// ─── intersection: the crossing point that has to earn the word "solution" ───
//
// A highlighted crossing point is a picture. What makes it a SOLUTION is that
// the coordinate satisfies both equations, so the substitution back into each
// line is the contract here — heading, both checks, and the sentence naming the
// pair. Getting a sign or a bracket wrong in those checks produces arithmetic
// that is simply false, which is why negatives and half-integers are pinned
// exactly rather than by substring.
//
// It is also the second stepper-only preset, and the first with two lines: c1
// and c2 are the only declared controls, while m1 and m2 are configuration
// carried in initialValues and must surface no learner UI at all.

const INTERSECTION_START = { m1: 1, c1: 3, m2: -1, c2: 7 }

const calculationLines = canvasElement =>
  [...canvasElement.querySelectorAll('[data-cp-status-calculation]')]
    .map(node => node.textContent)

const lineD = (canvasElement, id) =>
  canvasElement.querySelector(`[data-cp-shape="${id}"]`)?.getAttribute('d') ?? null

const plotRect = (canvasElement) => {
  const clip = canvasElement.querySelector('clipPath rect')
  const x = Number(clip.getAttribute('x'))
  const y = Number(clip.getAttribute('y'))
  return {
    left: x,
    top: y,
    right: x + Number(clip.getAttribute('width')),
    bottom: y + Number(clip.getAttribute('height')),
  }
}

// [x, y, x, y, …] from a projected two-point path.
const pathCoords = (canvasElement, id) =>
  lineD(canvasElement, id).match(/-?[\d.]+/g).map(Number)

// 1. Both intercepts are reachable, and both steppers actually work.
export const IntersectionBothInterceptsAreReachable = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // No handles on this preset — the story cannot pass by accidentally
    // driving a drag handle instead of a stepper.
    expect(canvasElement.querySelectorAll('[data-cp-handle]')).toHaveLength(0)
    expect(stepperIds(canvasElement)).toEqual(['c1', 'c2'])

    const first = canvas.getByRole('slider', { name: 'First line y-intercept' })
    const second = canvas.getByRole('slider', { name: 'Second line y-intercept' })

    await expect(first).toHaveAttribute('aria-valuenow', '3')
    await expect(second).toHaveAttribute('aria-valuenow', '7')

    for (const name of [
      'Increase First line y-intercept', 'Decrease First line y-intercept',
      'Increase Second line y-intercept', 'Decrease Second line y-intercept',
    ]) {
      await expect(canvas.getByRole('button', { name })).toBeVisible()
    }

    // Each pair moves its own value in both directions, and the meeting point
    // follows: c1 = 4 with c2 = 7 meets at (1.5, 5.5).
    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    await expect(first).toHaveAttribute('aria-valuenow', '4')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(1.5, 5.5)')

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease First line y-intercept' }))
    await expect(first).toHaveAttribute('aria-valuenow', '3')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Second line y-intercept' }))
    await expect(second).toHaveAttribute('aria-valuenow', '8')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(2.5, 5.5)')

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Second line y-intercept' }))
    await expect(second).toHaveAttribute('aria-valuenow', '7')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(2, 5)')
  },
}

// 2. c1 and c2 are the ONLY controls. m1 and m2 change the picture but the
//    preset never agreed to expose them, so no stepper, slider or button may
//    exist for either.
export const IntersectionExposesOnlyTheTwoIntercepts = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(stepperIds(canvasElement)).toEqual(['c1', 'c2'])

    // Two sliders and two −/+ pairs, all belonging to the two intercepts.
    const sliders = canvas.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
    expect(sliders.map(slider => slider.getAttribute('aria-label')))
      .toEqual(['First line y-intercept', 'Second line y-intercept'])

    // Named exhaustively rather than by a loose pattern — a RegExp name would
    // match "Increase …" and "Decrease …" alike.
    expect(canvas.getAllByRole('button').map(button => button.getAttribute('aria-label')))
      .toEqual([
        'Decrease First line y-intercept', 'Increase First line y-intercept',
        'Decrease Second line y-intercept', 'Increase Second line y-intercept',
      ])

    for (const undeclared of ['m1', 'm2']) {
      expect(canvasElement.querySelector(`[data-cp-stepper="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-value="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-increment="${undeclared}"]`)).toBeNull()
      expect(canvasElement.querySelector(`[data-cp-stepper-decrement="${undeclared}"]`)).toBeNull()
    }

    for (const name of ['Gradient', 'First line gradient', 'Second line gradient', 'm1', 'm2']) {
      expect(canvas.queryByRole('slider', { name })).toBeNull()
      expect(canvas.queryByRole('button', { name: `Increase ${name}` })).toBeNull()
      expect(canvas.queryByRole('button', { name: `Decrease ${name}` })).toBeNull()
    }
  },
}

// 3. Pointer and keyboard are one control, not two parallel ones — for BOTH
//    lines, in BOTH directions, identical in everything the learner perceives.
export const IntersectionPointerKeyboardParity = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('slider', { name: 'First line y-intercept' })
    const second = canvas.getByRole('slider', { name: 'Second line y-intercept' })

    const rendered = slider => ({
      valueNow: slider.getAttribute('aria-valuenow'),
      valueText: slider.getAttribute('aria-valuetext'),
      display: slider.textContent,
      heading: canvasElement.querySelector('[data-cp-status-heading]').textContent,
      calculation: calculationLines(canvasElement),
    })

    // First line, increase.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    const firstAfterPlusClick = rendered(first)
    expect(firstAfterPlusClick.valueNow).toBe('4')

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease First line y-intercept' }))
    await expect(first).toHaveAttribute('aria-valuenow', '3')

    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(rendered(first)).toEqual(firstAfterPlusClick)

    // First line, decrease.
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease First line y-intercept' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease First line y-intercept' }))
    const firstAfterMinusClick = rendered(first)
    expect(firstAfterMinusClick.valueNow).toBe('2')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    first.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(rendered(first)).toEqual(firstAfterMinusClick)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    await expect(first).toHaveAttribute('aria-valuenow', '3')

    // Second line, increase.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Second line y-intercept' }))
    const secondAfterPlusClick = rendered(second)
    expect(secondAfterPlusClick.valueNow).toBe('8')

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Second line y-intercept' }))
    await expect(second).toHaveAttribute('aria-valuenow', '7')

    second.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(rendered(second)).toEqual(secondAfterPlusClick)

    // Second line, decrease.
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Second line y-intercept' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Second line y-intercept' }))
    const secondAfterMinusClick = rendered(second)
    expect(secondAfterMinusClick.valueNow).toBe('6')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Second line y-intercept' }))
    second.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(rendered(second)).toEqual(secondAfterMinusClick)
  },
}

// 4. One action, one onChange, carrying the complete value state — including
//    m1 and m2, which no control declares and which a partial patch would drop.
export const IntersectionStepperEmitsOneCompleteChange = {
  args: { preset: 'intersection', onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))

    expect(args.onChange).toHaveBeenCalledTimes(1)

    const payload = args.onChange.mock.calls[0][0]
    expect(Object.keys(payload).sort()).toEqual(['c1', 'c2', 'm1', 'm2'])
    expect(payload).toEqual({ ...INTERSECTION_START, c1: 4 })
  },
}

// 5. The two intercepts are independent: each moves its own line and leaves the
//    other exactly where it was, pixel for pixel.
export const IntersectionEachInterceptMovesOnlyItsOwnLine = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const lineABefore = lineD(canvasElement, 'line-a')
    const lineBBefore = lineD(canvasElement, 'line-b')
    expect(lineABefore).not.toBeNull()
    expect(lineBBefore).not.toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    expect(lineD(canvasElement, 'line-a')).not.toBe(lineABefore)
    expect(lineD(canvasElement, 'line-b')).toBe(lineBBefore)

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease First line y-intercept' }))
    expect(lineD(canvasElement, 'line-a')).toBe(lineABefore)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Second line y-intercept' }))
    expect(lineD(canvasElement, 'line-b')).not.toBe(lineBBefore)
    expect(lineD(canvasElement, 'line-a')).toBe(lineABefore)
  },
}

// 6. The default meeting point, labelled and substituted back into BOTH
//    equations. The substitution is what earns the word "solution"; without it
//    this is a highlighted crossing and nothing more.
export const IntersectionSubstitutesIntoBothEquations = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    // Queried by data attribute — "(2, 5)" also renders as the point label and
    // again inside <desc>, so getByText would resolve ambiguously.
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(2, 5)')
    expect(canvasElement.querySelector('[data-cp-point-label="solution"]').textContent)
      .toBe('(2, 5)')

    expect(calculationLines(canvasElement)).toEqual([
      'y = x + 3  →  5 = 2 + 3 ✓',
      'y = −x + 7  →  5 = −2 + 7 ✓',
    ])

    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toBe('x = 2 and y = 5 is the only pair that satisfies both equations.')
  },
}

// 7a. A negative solution, then a negative half-integer one. Both checks are
//     pinned exactly: "−0.5 = 0.5 − 1" is true arithmetic, and every plausible
//     sign slip ("−0.5 = −0.5 − 1", "−0.5 = 0.5 + −1") is false arithmetic that
//     a learner would copy down.
export const IntersectionNegativeSolutionSubstitutions = {
  args: { preset: 'intersection', defaultValue: { m1: 1, c1: -1, m2: -1, c2: -1 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(0, −1)')
    expect(calculationLines(canvasElement)).toEqual([
      'y = x − 1  →  −1 = 0 − 1 ✓',
      'y = −x − 1  →  −1 = 0 − 1 ✓',
    ])
    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toBe('x = 0 and y = −1 is the only pair that satisfies both equations.')

    // c1 = 0 and c2 = −1 differ in parity, so the solution lands on a half
    // integer — and c = 0 drops the constant term from the first equation
    // entirely, which is the other thing a hand-rolled formatter gets wrong.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(−0.5, −0.5)')
    expect(calculationLines(canvasElement)).toEqual([
      'y = x  →  −0.5 = −0.5 ✓',
      'y = −x − 1  →  −0.5 = 0.5 − 1 ✓',
    ])
    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toBe('x = −0.5 and y = −0.5 is the only pair that satisfies both equations.')

    // Every minus is a real minus sign (U+2212), never an ASCII hyphen.
    expect(calculationLines(canvasElement).join(' ')).not.toContain('-')
  },
}

// 7b. The same at the far corner of the reachable set, where the solution is a
//     negative half integer in x and a positive half integer in y — so one
//     check subtracts a negative x and the other adds its negation.
export const IntersectionFractionalSolutionSubstitutions = {
  args: { preset: 'intersection', defaultValue: { m1: 1, c1: 6, m2: -1, c2: -1 } },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('(−3.5, 2.5)')

    // −3.5 + 6 = 2.5, and −(−3.5) − 1 = 2.5. Both are true as written.
    expect(calculationLines(canvasElement)).toEqual([
      'y = x + 6  →  2.5 = −3.5 + 6 ✓',
      'y = −x − 1  →  2.5 = 3.5 − 1 ✓',
    ])
    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toBe('x = −3.5 and y = 2.5 is the only pair that satisfies both equations.')
    expect(calculationLines(canvasElement).join(' ')).not.toContain('-')

    // The point label carries the same coordinate as the heading.
    expect(canvasElement.querySelector('[data-cp-point-label="solution"]').textContent)
      .toBe('(−3.5, 2.5)')
  },
}

// 8. Parallel lines: no solution, and nothing on the plane pretending otherwise
//    — no solution point, no label, no guides.
export const IntersectionParallelLinesHaveNoSolution = {
  args: { preset: 'intersection', defaultValue: { m1: 2, c1: 1, m2: 2, c2: 5 } },
  play: async ({ canvasElement }) => {
    // Both lines are genuinely drawn; it is the meeting point that is absent.
    expect(canvasElement.querySelector('[data-cp-shape="line-a"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-shape="line-b"]')).not.toBeNull()

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('No solution')
    expect(canvasElement.querySelector('[data-cp-status-explanation]').textContent)
      .toContain('never meet')

    // Nothing fabricated: no point, no label, no guides.
    expect(canvasElement.querySelector('[data-cp-point="solution"]')).toBeNull()
    expect(canvasElement.querySelector('[data-cp-point-label="solution"]')).toBeNull()
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cp-tier="active"]')).toHaveLength(0)
  },
}

// 9. Coincident lines are NOT "no solution". Same gradient and same intercept
//    is one line, and every point on it satisfies both equations — so the
//    status says infinitely many, and still fabricates no single point.
export const IntersectionCoincidentLinesHaveInfinitelyManySolutions = {
  args: { preset: 'intersection', defaultValue: { m1: 2, c1: 1, m2: 2, c2: 1 } },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Infinitely many solutions')

    const explanation = canvasElement.querySelector('[data-cp-status-explanation]').textContent
    expect(explanation).toContain('same line')
    expect(explanation).not.toContain('never meet')

    // No single point is invented for a case that has no single answer.
    expect(canvasElement.querySelector('[data-cp-point="solution"]')).toBeNull()
    expect(canvasElement.querySelector('[data-cp-point-label="solution"]')).toBeNull()
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(0)

    // Both equations are still listed, and they are the same equation — which
    // is precisely the point being made. (This is the one state in which a
    // preset legitimately emits two identical calculation lines; the renderer
    // keys that list by its text, so React logs a duplicate-key warning here.
    // Both lines do render, and fixing the key belongs to the renderer, not to
    // this preset.)
    expect(calculationLines(canvasElement)).toEqual(['y = 2x + 1', 'y = 2x + 1'])

    // The two lines coincide exactly, which is the fact on display.
    expect(lineD(canvasElement, 'line-a')).toBe(lineD(canvasElement, 'line-b'))

    // Three distinct outcomes, three distinct headings — the parallel wording
    // must not leak into this one.
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .not.toBe('No solution')
  },
}

// 10. The visible-bounds guarantee, seen rather than enumerated: the unit test
//     walks all 88 reachable intercept pairs, and this drives the four corners
//     of that set through the real controls and checks the mark is on the plot.
export const IntersectionSolutionStaysInsideThePlot = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('slider', { name: 'First line y-intercept' })
    const second = canvas.getByRole('slider', { name: 'Second line y-intercept' })

    const expectSolutionInsidePlot = (where) => {
      const plot = plotRect(canvasElement)
      const mark = canvasElement.querySelector('[data-cp-point="solution"] circle')
      expect(mark, `${where}: solution mark`).not.toBeNull()

      const cx = Number(mark.getAttribute('cx'))
      const cy = Number(mark.getAttribute('cy'))
      expect(cx, `${where} cx`).toBeGreaterThanOrEqual(plot.left)
      expect(cx, `${where} cx`).toBeLessThanOrEqual(plot.right)
      expect(cy, `${where} cy`).toBeGreaterThanOrEqual(plot.top)
      expect(cy, `${where} cy`).toBeLessThanOrEqual(plot.bottom)
    }

    // The default.
    expectSolutionInsidePlot('c1 = 3, c2 = 7')

    // Home/End clamp to the interaction range, so this reaches the true
    // extremes of what a learner can drive.
    first.focus()
    await userEvent.keyboard('{End}')
    await expect(first).toHaveAttribute('aria-valuenow', '6')
    second.focus()
    await userEvent.keyboard('{End}')
    await expect(second).toHaveAttribute('aria-valuenow', '9')
    expectSolutionInsidePlot('c1 = 6, c2 = 9')

    await userEvent.keyboard('{Home}')
    await expect(second).toHaveAttribute('aria-valuenow', '-1')
    expectSolutionInsidePlot('c1 = 6, c2 = −1')

    first.focus()
    await userEvent.keyboard('{Home}')
    await expect(first).toHaveAttribute('aria-valuenow', '-1')
    expectSolutionInsidePlot('c1 = −1, c2 = −1')

    second.focus()
    await userEvent.keyboard('{End}')
    await expect(second).toHaveAttribute('aria-valuenow', '9')
    expectSolutionInsidePlot('c1 = −1, c2 = 9')
  },
}

// 11. Both lines are clipped in MODEL space, not merely hidden by the SVG clip
//     path. y = x + 3 reaches y = 10 at the right edge of an axis that stops at
//     9, and y = −x + 7 reaches y = 11 at the left edge — so each line's own
//     coordinates must already stop at the boundary.
export const IntersectionBothLinesAreClippedInModelSpace = {
  args: { preset: 'intersection', interactive: false },
  play: async ({ canvasElement }) => {
    const plot = plotRect(canvasElement)

    for (const id of ['line-a', 'line-b']) {
      const node = canvasElement.querySelector(`[data-cp-shape="${id}"]`)
      expect(node, `${id} exists`).not.toBeNull()

      // Projected, not the model-space string the preset authored.
      expect(node.getAttribute('d'), `${id} projected`).not.toContain('M -')

      const coords = pathCoords(canvasElement, id)
      const xs = coords.filter((_, index) => index % 2 === 0)
      const ys = coords.filter((_, index) => index % 2 === 1)

      for (const x of xs) {
        expect(x, `${id} x inside plot`).toBeGreaterThanOrEqual(plot.left - 0.5)
        expect(x, `${id} x inside plot`).toBeLessThanOrEqual(plot.right + 0.5)
      }
      for (const y of ys) {
        expect(y, `${id} y inside plot`).toBeGreaterThanOrEqual(plot.top - 0.5)
        expect(y, `${id} y inside plot`).toBeLessThanOrEqual(plot.bottom + 0.5)
      }

      // Each line runs off the top of the plot unclipped, so each must stop
      // exactly at the top edge — which is what makes this a clip rather than a
      // line that happened to be short.
      expect(Math.min(...ys), `${id} reaches the top edge`).toBeCloseTo(plot.top, 0)

      // And the rendered box agrees with the path coordinates.
      const box = node.getBBox()
      expect(box.y, `${id} bbox top`).toBeGreaterThanOrEqual(plot.top - 0.5)
      expect(box.y + box.height, `${id} bbox bottom`).toBeLessThanOrEqual(plot.bottom + 0.5)
    }
  },
}

// 12. One solution, one active annotation. The two lines and the guides are
//     context around it, not competing focal points.
export const IntersectionSolutionIsTheOnlyActiveAnnotation = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelectorAll('[data-cp-tier="active"]')

    expect(active).toHaveLength(1)
    expect(active[0].getAttribute('data-cp-point')).toBe('solution')

    // Guides belong to the active point and to nothing else.
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(2)
  },
}

// 13. The narrowest supported width. Two steppers share one row, so this is
//     where that row would overflow if it were going to.
export const IntersectionNarrowViewport = {
  args: { preset: 'intersection' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.cp-explore')

    expect(diagram.getBoundingClientRect().width).toBeLessThanOrEqual(320.5)
    expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth)

    const rows = canvasElement.querySelectorAll('[data-cp-stepper-row]')
    expect(rows).toHaveLength(1)
    for (const row of rows) {
      expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    }

    const buttons = canvasElement.querySelectorAll('button')
    expect(buttons).toHaveLength(4)
    for (const button of buttons) {
      const rect = button.getBoundingClientRect()
      const name = button.getAttribute('aria-label')
      expect(rect.height, `${name} height`).toBeGreaterThanOrEqual(43.5)
      expect(rect.width, `${name} width`).toBeGreaterThanOrEqual(43.5)
    }
  },
}

// 14a. Static mode, one solution: a finished diagram, with no controls and no
//      live region, and a description that names both equations and the point.
export const IntersectionStaticOneSolution = {
  args: { preset: 'intersection', interactive: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('[data-cp-shape="line-a"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-shape="line-b"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent).toBe('(2, 5)')
    expect(calculationLines(canvasElement)).toEqual([
      'y = x + 3  →  5 = 2 + 3 ✓',
      'y = −x + 7  →  5 = −2 + 7 ✓',
    ])

    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cp-stepper-row]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryByRole('slider')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)

    const description = canvasElement.querySelector('svg desc').textContent
    expect(description).toBe(
      'The graphs of y = x + 3 and y = −x + 7, meeting at (2, 5).'
      + ' This diagram is shown as a static illustration.',
    )
  },
}

// 14b. Static mode, no solution: the description says parallel and never meet,
//      and names no meeting point.
export const IntersectionStaticNoSolution = {
  args: {
    preset: 'intersection',
    interactive: false,
    defaultValue: { m1: 2, c1: 1, m2: 2, c2: 5 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('No solution')
    expect(canvasElement.querySelector('[data-cp-point="solution"]')).toBeNull()

    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryByRole('slider')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)

    const description = canvasElement.querySelector('svg desc').textContent
    expect(description).toBe(
      'The graphs of y = 2x + 1 and y = 2x + 5, which are parallel and never meet.'
      + ' This diagram is shown as a static illustration.',
    )
    expect(description).not.toContain('meeting at')
  },
}

// 14c. Static mode, infinitely many solutions: the description says one line
//      drawn twice, rather than reporting a second, different equation.
export const IntersectionStaticInfiniteSolutions = {
  args: {
    preset: 'intersection',
    interactive: false,
    defaultValue: { m1: 2, c1: 1, m2: 2, c2: 1 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Infinitely many solutions')
    expect(canvasElement.querySelector('[data-cp-point="solution"]')).toBeNull()

    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryByRole('slider')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)

    const description = canvasElement.querySelector('svg desc').textContent
    expect(description).toBe(
      'The graph of y = 2x + 1, drawn twice — both equations describe the same line.'
      + ' This diagram is shown as a static illustration.',
    )
    expect(description).not.toContain('never meet')
    expect(description).not.toContain('meeting at')
  },
}

// ─── The transformation family: translate, reflect, rotate, enlarge ──────────
//
// Option state (mirror, angle, direction, scale factor) lives in `values`, not
// in renderer state. Everything below exists because that move is only worth
// making if it holds all the way to the DOM: a static figure must be able to
// select any option, one tap must produce one complete change and one
// announcement, a removed capability must never leave the scene pointing at an
// option the learner cannot see, and a control that does nothing in the current
// state must be absent rather than present-and-inert.

const TRANSFORM_ALL_SCALES = { fractionalScaleFactor: true, negativeScaleFactor: true }

const polygonPoints = (canvasElement, id) => {
  const numbers = pathCoords(canvasElement, id)
  const points = []
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push({ x: numbers[index], y: numbers[index + 1] })
  }
  return points
}

const markOf = (canvasElement, id) => {
  // The mark is the first circle in the point group; the second, when present,
  // is its transparent selection target at the same centre.
  const circle = canvasElement.querySelector(`[data-cp-point="${id}"] circle`)
  return { x: Number(circle.getAttribute('cx')), y: Number(circle.getAttribute('cy')) }
}

const guideEnds = (canvasElement, id) => {
  const line = canvasElement.querySelector(`[data-cp-guide="${id}"]`)
  return {
    from: { x: Number(line.getAttribute('x1')), y: Number(line.getAttribute('y1')) },
    to: { x: Number(line.getAttribute('x2')), y: Number(line.getAttribute('y2')) },
  }
}

const sideLengths = points => points.map((point, index) => {
  const next = points[(index + 1) % points.length]
  return Math.hypot(next.x - point.x, next.y - point.y)
})

// Signed, so a mirrored image is not mistaken for a congruent one.
const signedArea = points => points.reduce((total, point, index) => {
  const next = points[(index + 1) % points.length]
  return total + (point.x * next.y - next.x * point.y)
}, 0) / 2

const distance = (from, to) => Math.hypot(to.x - from.x, to.y - from.y)

const expectSamePoint = (actual, expected, message) => {
  expect(actual.x, `${message} x`).toBeCloseTo(expected.x, 1)
  expect(actual.y, `${message} y`).toBeCloseTo(expected.y, 1)
}

const optionButton = (canvasElement, id) =>
  canvasElement.querySelector(`[data-cp-option="${id}"]`)

const activeTierIds = canvasElement =>
  [...canvasElement.querySelectorAll('[data-cp-tier="active"]')]
    .map(node => node.getAttribute('data-cp-point'))

// 1a. A static figure selects a mirror line that is not the default. With
//     option state held privately by the renderer this figure could not be
//     authored at all.
export const TransformStaticReflectionInYEqualsX = {
  args: {
    preset: 'reflect',
    interactive: false,
    defaultValue: { mirrorValue: 2, mirror: 'yEqualsX' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Reflection in y = x')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (3, −1)')
    expect(canvasElement.querySelector('[data-cp-shape="mirror-line"]')).not.toBeNull()

    expect(canvasElement.querySelector('svg desc').textContent).toBe(
      'A triangle ABC and its image A′B′C′ after a reflection in y = x.'
      + ' This diagram is shown as a static illustration.',
    )

    // A diagram, not a disabled toy.
    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cp-option]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvas.queryAllByRole('button')).toHaveLength(0)
  },
}

// 1b. A static 180° anticlockwise rotation.
export const TransformStaticRotation180Anticlockwise = {
  args: {
    preset: 'rotate',
    interactive: false,
    defaultValue: { cx: 0, cy: 0, angle: '180', direction: 'anticlockwise' },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Rotation 180° about (0, 0)')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (1, −3)')
    expect(canvasElement.querySelector('svg desc').textContent)
      .toContain('a rotation of 180° about the centre (0, 0)')
  },
}

// 1b′. A half turn lands in the same place whichever way it is turned, so the
//      direction option is proved on a quarter turn: 90° anticlockwise is a
//      different figure from the default 90° clockwise.
export const TransformStaticRotation90Anticlockwise = {
  args: {
    preset: 'rotate',
    interactive: false,
    defaultValue: { cx: 0, cy: 0, angle: '90', direction: 'anticlockwise' },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Rotation 90° anticlockwise about (0, 0)')
    // Clockwise would be (3, 1) — the stored direction is genuinely read.
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (−3, −1)')
  },
}

// 1c. A static enlargement by −1: a negative factor, only offered when the
//     capability is on, and selected entirely from defaultValue.
export const TransformStaticEnlargementByMinusOne = {
  args: {
    preset: 'enlarge',
    interactive: false,
    difficultyCapabilities: { negativeScaleFactor: true },
    defaultValue: { cx: 0, cy: 0, scaleFactor: '-1' },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Enlargement scale factor −1, centre (0, 0)')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 2) → A′ (1, −2)')
    expect(canvasElement.querySelector('svg desc').textContent)
      .toContain('scale factor −1 about the centre (0, 0)')
  },
}

// 2. One option tap: one complete onChange, and one live announcement carrying
//    the state the tap produced — not the state before it.
export const TransformOptionTapEmitsOneCompleteChange = {
  args: {
    preset: 'rotate',
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: 1, cy: 0, angle: '90', direction: 'clockwise' },
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const live = canvasElement.querySelector('[data-cp-status-announcement]')
    const announcements = []
    const observer = new MutationObserver(() => {
      const text = live.textContent.trim()
      if (text && announcements[announcements.length - 1] !== text) announcements.push(text)
    })
    observer.observe(live, { childList: true, characterData: true, subtree: true })

    await userEvent.click(optionButton(canvasElement, 'angle:180'))
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
        .toBe('Rotation 180° about (1, 0)')
    })
    observer.disconnect()

    // Exactly one change, carrying the COMPLETE transformation state.
    expect(args.onChange).toHaveBeenCalledTimes(1)
    expect(args.onChange.mock.calls[0][0])
      .toEqual({ cx: 1, cy: 0, angle: '180', direction: 'clockwise' })

    // Exactly one announcement, and it describes the new state.
    expect(announcements).toEqual(['Rotation 180° about (1, 0)'])

    expect(optionButton(canvasElement, 'angle:180')).toHaveAttribute('aria-pressed', 'true')
    expect(optionButton(canvasElement, 'angle:90')).toHaveAttribute('aria-pressed', 'false')

    // Tapping the option already in force changes nothing at all.
    await userEvent.click(optionButton(canvasElement, 'angle:180'))
    expect(args.onChange).toHaveBeenCalledTimes(1)
  },
}

// 3. A capability that removes the stored option falls back to a valid one —
//    and the scene, the heading and the buttons all agree about which.
export const TransformCapabilityRemovalFallsBackToAValidOption = {
  args: {
    preset: 'reflect',
    difficultyCapabilities: { diagonalMirrorLines: false },
    defaultValue: { mirrorValue: 2, mirror: 'yEqualsX' },
  },
  play: async ({ canvasElement }) => {
    // The stored option is not offered...
    expect(optionButton(canvasElement, 'mirror:yEqualsX')).toBeNull()
    expect(optionButton(canvasElement, 'mirror:yEqualsNegativeX')).toBeNull()

    // ...so the first still-offered choice is in force, everywhere at once.
    expect(optionButton(canvasElement, 'mirror:vertical'))
      .toHaveAttribute('aria-pressed', 'true')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Reflection in x = 2')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (5, 3)')

    // And the mirror position stepper is back, because a vertical mirror has a
    // position to set.
    expect(stepperIds(canvasElement)).toEqual(['mirrorValue'])
  },
}

// 4a. The mirror position stepper disappears for y = x and y = −x rather than
//     sitting there changing a number the diagram ignores.
export const TransformMirrorPositionStepperOnlyWhenItActs = {
  args: { preset: 'reflect', defaultValue: { mirrorValue: 2, mirror: 'vertical' } },
  play: async ({ canvasElement }) => {
    expect(stepperIds(canvasElement)).toEqual(['mirrorValue'])

    await userEvent.click(optionButton(canvasElement, 'mirror:yEqualsX'))
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
        .toBe('Reflection in y = x')
    })

    // Absent, not disabled-and-visible: no stepper, no row, no orphan buttons.
    expect(stepperIds(canvasElement)).toEqual([])
    expect(canvasElement.querySelectorAll('[data-cp-stepper-row]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-stepper-decrement="mirrorValue"]')).toBeNull()
    expect(canvasElement.querySelector('[data-cp-stepper-increment="mirrorValue"]')).toBeNull()

    await userEvent.click(optionButton(canvasElement, 'mirror:yEqualsNegativeX'))
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
        .toBe('Reflection in y = −x')
    })
    expect(stepperIds(canvasElement)).toEqual([])

    // A horizontal mirror has a position again, so the stepper comes back.
    await userEvent.click(optionButton(canvasElement, 'mirror:horizontal'))
    await waitFor(() => {
      expect(stepperIds(canvasElement)).toEqual(['mirrorValue'])
    })
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Reflection in y = 2')
  },
}

// 4b. A centre that cannot leave the origin has nothing to step.
export const TransformCentreSteppersHiddenAtTheOrigin = {
  args: { preset: 'rotate', difficultyCapabilities: { nonOriginCentre: false } },
  play: async ({ canvasElement }) => {
    expect(stepperIds(canvasElement)).toEqual([])
    expect(canvasElement.querySelectorAll('[data-cp-stepper-row]')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-cp-stepper-value="cx"]')).toBeNull()

    // The option buttons are still there — the preset is operable, just not
    // through a centre that cannot move.
    expect(optionButton(canvasElement, 'angle:180')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-point="centre"]')).not.toBeNull()
  },
}

// 4c. And they appear, in declaration order, when it can.
export const TransformCentreSteppersAppearWhenTheCentreCanMove = {
  args: { preset: 'enlarge', difficultyCapabilities: { nonOriginCentre: true } },
  play: async ({ canvasElement }) => {
    expect(stepperIds(canvasElement)).toEqual(['cx', 'cy'])

    await userEvent.click(canvasElement.querySelector('[data-cp-stepper-increment="cx"]'))
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
        .toBe('Enlargement scale factor 2, centre (1, 0)')
    })
  },
}

// 5. `b` and `image-b` are two views of one pair, so both must resolve the same
//    coordinate pair. Looking up the raw active id would silently fall back to
//    A for every image vertex.
export const TransformImageVertexResolvesItsOwnPair = {
  args: { preset: 'translate', defaultValue: { dx: 3, dy: 2 } },
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="b"]'))
    await waitFor(() => {
      expect(calculationLines(canvasElement)[0]).toBe('B (−3, 0) → B′ (0, 2)')
    })
    const fromObject = calculationLines(canvasElement)[0]

    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="image-b"]'))
    await waitFor(() => {
      expect(activeTierIds(canvasElement)).toEqual(['image-b'])
    })

    // The same pair, not A's.
    expect(calculationLines(canvasElement)[0]).toBe(fromObject)
    expect(calculationLines(canvasElement)[0]).not.toContain('A')
  },
}

// 6a. Translation by a positive vector: same size, same orientation, and every
//     vertex moved by the same offset.
export const TransformTranslationPositiveVector = {
  args: { preset: 'translate', defaultValue: { dx: 3, dy: 2 } },
  play: async ({ canvasElement }) => {
    const object = polygonPoints(canvasElement, 'object')
    const image = polygonPoints(canvasElement, 'image')

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Translation by (3, 2)')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (2, 5)')

    sideLengths(image).forEach((side, index) => {
      expect(side).toBeCloseTo(sideLengths(object)[index], 1)
    })
    expect(signedArea(image)).toBeCloseTo(signedArea(object), 1)

    const offsets = image.map((point, index) => ({
      x: point.x - object[index].x,
      y: point.y - object[index].y,
    }))
    for (const offset of offsets) expectSamePoint(offset, offsets[0], 'offset')
    expect(offsets[0].x).toBeGreaterThan(0)
    expect(offsets[0].y).toBeLessThan(0) // up the plane is down the screen
  },
}

// 6b. And by a negative vector.
export const TransformTranslationNegativeVector = {
  args: { preset: 'translate', defaultValue: { dx: -4, dy: -3 } },
  play: async ({ canvasElement }) => {
    const object = polygonPoints(canvasElement, 'object')
    const image = polygonPoints(canvasElement, 'image')

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Translation by (−4, −3)')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (−5, 0)')
    expect(calculationLines(canvasElement)[1])
      .toBe('x: −1 − 4 = −5    y: 3 − 3 = 0')

    sideLengths(image).forEach((side, index) => {
      expect(side).toBeCloseTo(sideLengths(object)[index], 1)
    })
    expect(signedArea(image)).toBeCloseTo(signedArea(object), 1)

    const offsets = image.map((point, index) => ({
      x: point.x - object[index].x,
      y: point.y - object[index].y,
    }))
    for (const offset of offsets) expectSamePoint(offset, offsets[0], 'offset')
    expect(offsets[0].x).toBeLessThan(0)
    expect(offsets[0].y).toBeGreaterThan(0)
  },
}

// 6c. The zero vector is a translation too: the image sits on the object, and
//     no zero-length guide is drawn where the vector would have been.
export const TransformTranslationZeroVector = {
  args: { preset: 'translate', defaultValue: { dx: 0, dy: 0 } },
  play: async ({ canvasElement }) => {
    const object = polygonPoints(canvasElement, 'object')
    const image = polygonPoints(canvasElement, 'image')

    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Translation by (0, 0)')
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (−1, 3)')

    image.forEach((point, index) => expectSamePoint(point, object[index], 'vertex'))
    expect(signedArea(image)).toBeCloseTo(signedArea(object), 1)
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(0)
  },
}

// 7. Every mirror line, driven the way a learner drives it.
export const TransformReflectionInEveryMirrorLine = {
  args: { preset: 'reflect', defaultValue: { mirrorValue: 2, mirror: 'vertical' } },
  play: async ({ canvasElement }) => {
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    const cases = [
      ['mirror:vertical', 'Reflection in x = 2', 'A (−1, 3) → A′ (5, 3)'],
      ['mirror:horizontal', 'Reflection in y = 2', 'A (−1, 3) → A′ (−1, 1)'],
      ['mirror:yEqualsX', 'Reflection in y = x', 'A (−1, 3) → A′ (3, −1)'],
      ['mirror:yEqualsNegativeX', 'Reflection in y = −x', 'A (−1, 3) → A′ (−3, 1)'],
    ]

    for (const [option, expectedHeading, expectedPair] of cases) {
      await userEvent.click(optionButton(canvasElement, option))
      await waitFor(() => { expect(heading()).toBe(expectedHeading) })

      expect(calculationLines(canvasElement)[0], expectedHeading).toBe(expectedPair)
      // The mirror is always drawn, and always inside the plot.
      const mirror = canvasElement.querySelector('[data-cp-shape="mirror-line"]')
      expect(mirror, expectedHeading).not.toBeNull()

      const plot = plotRect(canvasElement)
      const coordinates = polygonPoints(canvasElement, 'mirror-line')
      for (const point of coordinates) {
        expect(point.x).toBeGreaterThanOrEqual(plot.left - 0.5)
        expect(point.x).toBeLessThanOrEqual(plot.right + 0.5)
        expect(point.y).toBeGreaterThanOrEqual(plot.top - 0.5)
        expect(point.y).toBeLessThanOrEqual(plot.bottom + 0.5)
      }
    }
  },
}

// 8. Every angle, both directions, and a centre that is not the origin.
export const TransformRotationCoversEveryAngleAndDirection = {
  args: {
    preset: 'rotate',
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: 0, cy: 0, angle: '90', direction: 'clockwise' },
  },
  play: async ({ canvasElement }) => {
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    const turn = async (angle, direction) => {
      await userEvent.click(optionButton(canvasElement, `angle:${angle}`))
      await userEvent.click(optionButton(canvasElement, `direction:${direction}`))
    }

    const cases = [
      ['90', 'clockwise', 'Rotation 90° clockwise about (0, 0)', 'A (−1, 3) → A′ (3, 1)'],
      ['90', 'anticlockwise', 'Rotation 90° anticlockwise about (0, 0)', 'A (−1, 3) → A′ (−3, −1)'],
      ['180', 'clockwise', 'Rotation 180° about (0, 0)', 'A (−1, 3) → A′ (1, −3)'],
      ['180', 'anticlockwise', 'Rotation 180° about (0, 0)', 'A (−1, 3) → A′ (1, −3)'],
      ['270', 'clockwise', 'Rotation 270° clockwise about (0, 0)', 'A (−1, 3) → A′ (−3, −1)'],
      ['270', 'anticlockwise', 'Rotation 270° anticlockwise about (0, 0)', 'A (−1, 3) → A′ (3, 1)'],
    ]

    for (const [angle, direction, expectedHeading, expectedPair] of cases) {
      await turn(angle, direction)
      await waitFor(() => { expect(heading()).toBe(expectedHeading) })
      expect(calculationLines(canvasElement)[0], expectedHeading).toBe(expectedPair)
    }

    // Now move the centre off the origin and turn again.
    await userEvent.click(canvasElement.querySelector('[data-cp-stepper-increment="cx"]'))
    await userEvent.click(canvasElement.querySelector('[data-cp-stepper-decrement="cy"]'))
    await waitFor(() => {
      expect(heading()).toBe('Rotation 270° anticlockwise about (1, −1)')
    })
    expect(calculationLines(canvasElement)[0]).toBe('A (−1, 3) → A′ (5, 1)')
  },
}

// 9. Every offered scale factor, including the quarter.
export const TransformEnlargementCoversEveryScaleFactor = {
  args: {
    preset: 'enlarge',
    difficultyCapabilities: TRANSFORM_ALL_SCALES,
    defaultValue: { cx: 0, cy: 0, scaleFactor: '2' },
  },
  play: async ({ canvasElement }) => {
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    const cases = [
      ['0.25', 'Enlargement scale factor ¼, centre (0, 0)', 'A (−1, 2) → A′ (−0.25, 0.5)'],
      ['0.5', 'Enlargement scale factor ½, centre (0, 0)', 'A (−1, 2) → A′ (−0.5, 1)'],
      ['2', 'Enlargement scale factor 2, centre (0, 0)', 'A (−1, 2) → A′ (−2, 4)'],
      ['3', 'Enlargement scale factor 3, centre (0, 0)', 'A (−1, 2) → A′ (−3, 6)'],
      ['-1', 'Enlargement scale factor −1, centre (0, 0)', 'A (−1, 2) → A′ (1, −2)'],
      ['-2', 'Enlargement scale factor −2, centre (0, 0)', 'A (−1, 2) → A′ (2, −4)'],
    ]

    for (const [factor, expectedHeading, expectedPair] of cases) {
      await userEvent.click(optionButton(canvasElement, `scaleFactor:${factor}`))
      await waitFor(() => { expect(heading()).toBe(expectedHeading) })
      expect(calculationLines(canvasElement)[0], expectedHeading).toBe(expectedPair)
    }
  },
}

// 10a. A rotation without a named centre is not a described rotation — the same
//      answer would lose the mark in an exam.
export const TransformRotationDescriptionNamesTheCentre = {
  args: {
    preset: 'rotate',
    interactive: false,
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: 1, cy: -1, angle: '90', direction: 'clockwise' },
  },
  play: async ({ canvasElement }) => {
    const description = canvasElement.querySelector('svg desc').textContent

    expect(description).toContain('centre (1, −1)')
    expect(description).toContain('90° clockwise')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Rotation 90° clockwise about (1, −1)')
  },
}

// 10b. Likewise an enlargement.
export const TransformEnlargementDescriptionNamesTheCentre = {
  args: {
    preset: 'enlarge',
    interactive: false,
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: 1, cy: 1, scaleFactor: '2' },
  },
  play: async ({ canvasElement }) => {
    const description = canvasElement.querySelector('svg desc').textContent

    expect(description).toContain('centre (1, 1)')
    expect(description).toContain('scale factor 2')
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toBe('Enlargement scale factor 2, centre (1, 1)')
  },
}

// 11a. Rotation guides are two radii about the centre, never an A → A′ chord: a
//      chord implies the point travelled in a straight line, which is the
//      opposite of what a rotation does. Equal radii are the fact worth seeing.
export const TransformRotationGuidesRunFromTheCentre = {
  args: {
    preset: 'rotate',
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: 1, cy: 1, angle: '90', direction: 'clockwise' },
  },
  play: async ({ canvasElement }) => {
    const checkRadii = () => {
      const centre = markOf(canvasElement, 'centre')
      const object = markOf(canvasElement, 'a')
      const image = markOf(canvasElement, 'image-a')

      const guides = canvasElement.querySelectorAll('[data-cp-guide]')
      expect(guides).toHaveLength(2)

      const toObject = guideEnds(canvasElement, 'guide-centre-object')
      const toImage = guideEnds(canvasElement, 'guide-centre-image')

      expectSamePoint(toObject.from, centre, 'object guide start')
      expectSamePoint(toImage.from, centre, 'image guide start')
      expectSamePoint(toObject.to, object, 'object guide end')
      expectSamePoint(toImage.to, image, 'image guide end')

      // Equal radii, and no chord anywhere.
      expect(distance(centre, object)).toBeCloseTo(distance(centre, image), 1)
      for (const guide of guides) {
        const ends = guideEnds(canvasElement, guide.getAttribute('data-cp-guide'))
        const isChord = distance(ends.from, object) < 1 && distance(ends.to, image) < 1
        expect(isChord, 'a rotation must not draw a vertex-to-image chord').toBe(false)
      }
    }

    checkRadii()

    // Exactly one active vertex; the centre is rule geometry, never the active
    // annotation.
    expect(activeTierIds(canvasElement)).toEqual(['a'])
    expect(canvasElement.querySelector('[data-cp-point="centre"]')
      .getAttribute('data-cp-tier')).toBe('related')

    for (const angle of ['180', '270']) {
      await userEvent.click(optionButton(canvasElement, `angle:${angle}`))
      await waitFor(() => {
        expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
          .toContain(`${angle}°`)
      })
      checkRadii()
    }

    // Including from an image vertex, where the radii swap ends but still start
    // at the centre.
    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="image-c"]'))
    await waitFor(() => {
      expect(activeTierIds(canvasElement)).toEqual(['image-c'])
    })
    const centre = markOf(canvasElement, 'centre')
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(2)
    expectSamePoint(guideEnds(canvasElement, 'guide-centre-object').from, centre, 'start')
    expectSamePoint(guideEnds(canvasElement, 'guide-centre-image').from, centre, 'start')
  },
}

// 11b. The enlargement ray points at whichever end is further from the centre,
//      because a ray that always ran centre → image would stop showing the
//      relationship the moment the factor shrank or reversed.
export const TransformEnlargementRayFollowsTheScaleFactor = {
  args: {
    preset: 'enlarge',
    difficultyCapabilities: TRANSFORM_ALL_SCALES,
    defaultValue: { cx: 0, cy: 0, scaleFactor: '3' },
  },
  play: async ({ canvasElement }) => {
    const rayEnds = () => {
      const [x1, y1, x2, y2] = pathCoords(canvasElement, 'ray-a')
      return { from: { x: x1, y: y1 }, to: { x: x2, y: y2 } }
    }
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    // Growing: centre out to the image, which is the far end.
    let ray = rayEnds()
    expectSamePoint(ray.from, markOf(canvasElement, 'centre'), 'grow ray start')
    expectSamePoint(ray.to, markOf(canvasElement, 'image-a'), 'grow ray end')

    // Shrinking: centre out to the original, which is now the far end.
    await userEvent.click(optionButton(canvasElement, 'scaleFactor:0.25'))
    await waitFor(() => { expect(heading()).toContain('¼') })
    ray = rayEnds()
    expectSamePoint(ray.from, markOf(canvasElement, 'centre'), 'shrink ray start')
    expectSamePoint(ray.to, markOf(canvasElement, 'a'), 'shrink ray end')

    await userEvent.click(optionButton(canvasElement, 'scaleFactor:0.5'))
    await waitFor(() => { expect(heading()).toContain('½') })
    expectSamePoint(rayEnds().to, markOf(canvasElement, 'a'), 'half ray end')

    // Negative: original through the centre to the image — the crossing at the
    // centre is the whole point.
    await userEvent.click(optionButton(canvasElement, 'scaleFactor:-2'))
    await waitFor(() => { expect(heading()).toContain('−2') })
    ray = rayEnds()
    const centre = markOf(canvasElement, 'centre')
    expectSamePoint(ray.from, markOf(canvasElement, 'a'), 'flip ray start')
    expectSamePoint(ray.to, markOf(canvasElement, 'image-a'), 'flip ray end')

    // The centre lies on the ray, between its ends.
    expect(distance(ray.from, centre) + distance(centre, ray.to))
      .toBeCloseTo(distance(ray.from, ray.to), 1)

    // The ray follows the active pair rather than being stuck on A.
    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="b"]'))
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-cp-shape="ray-b"]')).not.toBeNull()
    })
    expect(canvasElement.querySelector('[data-cp-shape="ray-a"]')).toBeNull()
  },
}

// 12. Nothing the family can draw escapes the ±8 grid — checked over the whole
//     reachable state space, not the handful of states a story renders.
//
//     Model ranges, not interaction ranges: static and controlled content may
//     supply anything the model accepts, so that is what must stay visible.
export const TransformFigureStaysInsideTheAxes = {
  args: {
    preset: 'rotate',
    difficultyCapabilities: { nonOriginCentre: true },
    defaultValue: { cx: -2, cy: 2, angle: '270', direction: 'anticlockwise' },
  },
  play: async ({ canvasElement }) => {
    // 1. The rendered figure, in pixels, inside the plot rectangle.
    const plot = plotRect(canvasElement)
    for (const circle of canvasElement.querySelectorAll('[data-cp-point] circle')) {
      const x = Number(circle.getAttribute('cx'))
      const y = Number(circle.getAttribute('cy'))
      expect(x).toBeGreaterThanOrEqual(plot.left - 0.5)
      expect(x).toBeLessThanOrEqual(plot.right + 0.5)
      expect(y).toBeGreaterThanOrEqual(plot.top - 0.5)
      expect(y).toBeLessThanOrEqual(plot.bottom + 0.5)
    }

    // 2. The exhaustive model-space sweep: every combination of every control
    //    boundary against every combination of every offered option, for each
    //    of the four presets, with every vertex in turn as the active one.
    const capabilitySets = [
      {},
      { diagonalMirrorLines: true, nonOriginCentre: true },
      { fractionalScaleFactor: true, negativeScaleFactor: true },
      {
        diagonalMirrorLines: true,
        nonOriginCentre: true,
        fractionalScaleFactor: true,
        negativeScaleFactor: true,
      },
    ]

    const controlValueSets = (preset) => {
      const base = clampPresetValues(preset, preset.initialValues)
      let sets = [base]
      for (const control of preset.controls ?? []) {
        const corners = [control.min, control.max, base[control.id]]
        sets = sets.flatMap(values => corners.map(corner => ({
          ...values,
          [control.id]: corner,
        })))
      }
      return sets.map(values => clampPresetValues(preset, values))
    }

    const optionValueSets = (preset, capabilities) => {
      let sets = [{}]
      for (const group of preset.resolveOptions(capabilities)) {
        sets = sets.flatMap(choices => group.choices.map(choice => ({
          ...choices,
          [group.id]: choice.id,
        })))
      }
      return sets
    }

    const coordinatesOf = (path) => {
      const numbers = path.match(/-?[\d.]+/g)?.map(Number) ?? []
      const points = []
      for (let index = 0; index + 1 < numbers.length; index += 2) {
        points.push({ x: numbers[index], y: numbers[index + 1] })
      }
      return points
    }

    // Violations are collected and asserted once at the end. Thousands of
    // states times a dozen assertions each is over a hundred thousand `expect`
    // calls, which takes minutes in a browser — the sweep would have to be
    // thinned to stay under the timeout, and thinning it is exactly what makes
    // this contract stop catching anything.
    const violations = []
    let states = 0

    for (const id of ['translate', 'reflect', 'rotate', 'enlarge']) {
      const preset = COORDINATE_PLANE_PRESETS[id]
      const axes = { x: preset.xAxis, y: preset.yAxis }
      expect(axes.x, `${id} x axis`).toMatchObject({ min: -8, max: 8, step: 2 })
      expect(axes.y, `${id} y axis`).toMatchObject({ min: -8, max: 8, step: 2 })

      for (const capabilitySet of capabilitySets) {
        const capabilities = mergeCapabilities(preset, capabilitySet)
        for (const values of controlValueSets(preset)) {
          for (const choices of optionValueSets(preset, capabilities)) {
            for (const activeId of ['a', 'b', 'c', 'image-a', 'image-b', 'image-c']) {
              states += 1
              const scene = preset.derive(values, {
                focus: resolvePresetFocus(preset, undefined),
                activeId,
                showGuides: 'active',
                capabilities,
                choices,
                axes,
                grid: preset.grid,
              })

              const label = `${id} ${JSON.stringify(values)} ${JSON.stringify(choices)} active=${activeId}`
              const inside = (point, what) => {
                if (point.x < axes.x.min || point.x > axes.x.max
                  || point.y < axes.y.min || point.y > axes.y.max) {
                  violations.push(`${label} ${what} at (${point.x}, ${point.y})`)
                }
              }

              for (const point of scene.points) inside(point, `point ${point.id}`)
              for (const shape of scene.shapes.filter(item => item.modelPath)) {
                for (const point of coordinatesOf(shape.path)) inside(point, `shape ${shape.id}`)
              }
              for (const guide of scene.guides ?? []) {
                inside(guide.from, `guide ${guide.id} from`)
                inside(guide.to, `guide ${guide.id} to`)
              }

              // 13, over the same exhaustive set: exactly one active vertex,
              // whichever end of the pair is selected.
              const active = scene.points.filter(point => point.tier === 'active')
              if (active.length !== 1 || active[0].id !== activeId) {
                violations.push(`${label} active tier is [${active.map(point => point.id)}]`)
              }
            }
          }
        }
      }
    }

    expect(violations).toEqual([])
    // The sweep is real, not an empty loop that passes by doing nothing.
    expect(states).toBeGreaterThan(2000)
  },
}

// 13. One active vertex at a time, including when the selected vertex is an
//     image vertex — the case where a raw active-id lookup silently annotates A
//     instead and leaves the selected point unmarked.
export const TransformExactlyOneActiveVertex = {
  args: { preset: 'translate', defaultValue: { dx: 3, dy: 2 } },
  play: async ({ canvasElement }) => {
    expect(activeTierIds(canvasElement)).toEqual(['a'])

    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="image-c"]'))
    await waitFor(() => {
      expect(activeTierIds(canvasElement)).toEqual(['image-c'])
    })

    // The guide follows the selection rather than staying on A.
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(1)
    const guide = guideEnds(canvasElement, 'guide-vector')
    expectSamePoint(guide.from, markOf(canvasElement, 'c'), 'guide start')
    expectSamePoint(guide.to, markOf(canvasElement, 'image-c'), 'guide end')
    expect(calculationLines(canvasElement)[0]).toBe('C (0, −2) → C′ (3, 0)')

    await userEvent.click(canvasElement.querySelector('[data-cp-point-target="a"]'))
    await waitFor(() => {
      expect(activeTierIds(canvasElement)).toEqual(['a'])
    })
  },
}

// 14. The narrowest supported width, for all four presets: no horizontal
//     scroll anywhere, and every control still a real touch target.
const narrowViewportPlay = expectedButtonCount => async ({ canvasElement }) => {
  const diagram = canvasElement.querySelector('.cp-explore')

  expect(diagram.getBoundingClientRect().width).toBeLessThanOrEqual(320.5)
  expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth)

  const rows = [
    ...canvasElement.querySelectorAll('[data-cp-stepper-row]'),
    ...canvasElement.querySelectorAll('div[role="group"]'),
  ]
  for (const row of rows) {
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }

  const buttons = canvasElement.querySelectorAll('button')
  expect(buttons).toHaveLength(expectedButtonCount)
  for (const button of buttons) {
    const rect = button.getBoundingClientRect()
    const name = button.getAttribute('aria-label') ?? button.textContent
    expect(rect.height, `${name} height`).toBeGreaterThanOrEqual(43.5)
    expect(rect.width, `${name} width`).toBeGreaterThanOrEqual(43.5)
  }
}

export const TransformTranslateNarrowViewport = {
  args: { preset: 'translate' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  // Two steppers, four nudge buttons, no options.
  play: narrowViewportPlay(4),
}

export const TransformReflectNarrowViewport = {
  args: { preset: 'reflect' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  // One stepper plus four mirror lines.
  play: narrowViewportPlay(6),
}

export const TransformRotateNarrowViewport = {
  args: { preset: 'rotate', difficultyCapabilities: { nonOriginCentre: true } },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  // Two centre steppers, three angles, two directions.
  play: narrowViewportPlay(9),
}

export const TransformEnlargeNarrowViewport = {
  args: {
    preset: 'enlarge',
    difficultyCapabilities: { ...TRANSFORM_ALL_SCALES, nonOriginCentre: true },
  },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  // Two centre steppers and six scale factors.
  play: narrowViewportPlay(10),
}

// ─── Capabilities constrain, they do not merely hide ─────────────────────────
// A capability that only removes controls suppresses the evidence while the
// diagram carries on using the supplied value.
export const TransformPinnedCentreIsGenuinelyPinned = {
  args: {
    preset: 'rotate',
    interactive: false,
    defaultValue: { cx: 2, cy: 2, angle: '90', direction: 'clockwise' },
    difficultyCapabilities: { nonOriginCentre: false },
  },
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector('[data-cp-status-heading]').textContent
    const centre = canvasElement.querySelector('[data-cp-point="centre"]')

    // Supplied (2, 2), but the tier pins the lesson to the origin.
    expect(heading).toContain('(0, 0)')
    expect(heading).not.toContain('(2, 2)')
    expect(centre).not.toBeNull()

    // The description agrees with the figure, not with the supplied value.
    expect(canvasElement.querySelector('desc').textContent).toContain('(0, 0)')
  },
}

export const TransformEnlargementCentreIsGenuinelyPinned = {
  args: {
    preset: 'enlarge',
    interactive: false,
    defaultValue: { cx: 1, cy: 1, scaleFactor: '2' },
    difficultyCapabilities: { nonOriginCentre: false },
  },
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector('[data-cp-status-heading]').textContent
    expect(heading).toContain('(0, 0)')
    expect(heading).not.toContain('(1, 1)')
  },
}

// Removing the capability from a live non-origin state must move the figure,
// not just strip its controls.
function CapabilityToggleHarness(args) {
  const [pinned, setPinned] = useState(false)

  return (
    <div>
      <button type="button" data-testid="pin" onClick={() => setPinned(true)}>
        Pin to origin
      </button>
      <CoordinatePlaneExplore
        {...args}
        difficultyCapabilities={{ nonOriginCentre: !pinned }}
      />
    </div>
  )
}

export const TransformRemovingTheCapabilityMovesTheFigure = {
  render: args => <CapabilityToggleHarness {...args} />,
  args: {
    preset: 'rotate',
    defaultValue: { cx: 2, cy: 2, angle: '90', direction: 'clockwise' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = () => canvasElement.querySelector('[data-cp-status-heading]').textContent

    expect(heading()).toContain('(2, 2)')
    expect(canvasElement.querySelector('[data-cp-stepper="cx"]')).not.toBeNull()

    await userEvent.click(canvas.getByTestId('pin'))

    await waitFor(() => expect(heading()).toContain('(0, 0)'))
    expect(canvasElement.querySelector('[data-cp-stepper="cx"]')).toBeNull()
  },
}

// ─── The emitted payload describes the diagram on screen ─────────────────────
export const TransformOnChangeCarriesTheEffectiveCentre = {
  args: {
    preset: 'rotate',
    defaultValue: { cx: 2, cy: 2, angle: '90', direction: 'clockwise' },
    difficultyCapabilities: { nonOriginCentre: false },
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // No centre steppers exist, so drive the change through an option.
    await userEvent.click(canvas.getByRole('button', { name: '180°' }))

    expect(args.onChange).toHaveBeenCalledTimes(1)
    // The payload must carry the pinned centre, not the supplied one.
    expect(args.onChange.mock.calls[0][0]).toMatchObject({ cx: 0, cy: 0, angle: '180' })
  },
}

// A fallback option must be normalised into the payload too: the diagram shows
// `vertical`, so the next onChange must say `vertical`.
export const TransformOnChangeNormalisesAFallbackOption = {
  args: {
    preset: 'reflect',
    defaultValue: { mirrorValue: 1, mirror: 'yEqualsX' },
    difficultyCapabilities: { diagonalMirrorLines: false },
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // The stored diagonal is unavailable, so the figure falls back.
    expect(canvasElement.querySelector('[data-cp-status-heading]').textContent)
      .toContain('x = 1')

    // Operating a NUMERIC control must not resurrect the stale option.
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Mirror position' }))

    expect(args.onChange).toHaveBeenCalledTimes(1)
    const payload = args.onChange.mock.calls[0][0]
    expect(payload.mirrorValue).toBe(2)
    expect(payload.mirror).toBe('vertical')
  },
}

// ─── No control that cannot change anything ──────────────────────────────────
export const TransformDirectionHiddenAtHalfTurn = {
  args: { preset: 'rotate' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // At 90° both groups are offered.
    expect(canvas.queryByRole('button', { name: 'Clockwise' })).not.toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: '180°' }))

    // A half-turn reaches the same image either way, so direction disappears
    // rather than becoming a control that changes nothing.
    await waitFor(() => {
      expect(canvas.queryByRole('button', { name: 'Clockwise' })).toBeNull()
    })
    expect(canvas.queryByRole('button', { name: 'Anticlockwise' })).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: '270°' }))
    await waitFor(() => {
      expect(canvas.queryByRole('button', { name: 'Clockwise' })).not.toBeNull()
    })
  },
}

// ─── The instruction never promises a control that is not there ──────────────
export const TransformInstructionsMatchTheControlsOnScreen = {
  args: { preset: 'reflect', defaultValue: { mirrorValue: 0, mirror: 'yEqualsX' } },
  play: async ({ canvasElement }) => {
    const instruction = canvasElement
      .querySelector('[data-cp-interaction-instruction]')?.textContent ?? ''

    // y = x has no position to set, so no stepper is rendered — the copy must
    // not tell the learner to move one.
    expect(canvasElement.querySelector('[data-cp-stepper="mirrorValue"]')).toBeNull()
    expect(instruction).not.toMatch(/stepper/i)
    expect(instruction).not.toMatch(/move it/i)
  },
}

export const TransformCentreInstructionsMatchTheControls = {
  args: { preset: 'rotate', difficultyCapabilities: { nonOriginCentre: false } },
  play: async ({ canvasElement }) => {
    const instruction = canvasElement
      .querySelector('[data-cp-interaction-instruction]')?.textContent ?? ''

    expect(canvasElement.querySelector('[data-cp-stepper="cx"]')).toBeNull()
    expect(instruction).not.toMatch(/move the centre/i)
  },
}

// ─── The status area does not resize as the learner works ────────────────────
//
// Its sub-blocks each reserve their own worst case, because the content
// genuinely changes shape: a heading wraps to two lines at 90° and 270° but
// not at 180°, the working runs to three lines for a negative scale factor,
// and the explanation drops from three lines to two between table rows.
// Reserving only the total let the component's height move by up to 22px while
// a learner stepped through options.
function statusHeightProbe(preset, extraArgs = {}) {
  return {
    args: { preset, ...extraArgs },
    play: async ({ canvasElement }) => {
      const statusArea = () =>
        canvasElement.querySelector('[data-cp-status-heading]').parentElement
      const heights = new Set([statusArea().getBoundingClientRect().height.toFixed(1)])

      for (const option of canvasElement.querySelectorAll('[data-cp-option]')) {
        await userEvent.click(option)
        heights.add(statusArea().getBoundingClientRect().height.toFixed(1))
      }

      for (const value of canvasElement.querySelectorAll('[data-cp-stepper-value]')) {
        value.focus()
        await userEvent.keyboard('{End}')
        heights.add(statusArea().getBoundingClientRect().height.toFixed(1))
        await userEvent.keyboard('{Home}')
        heights.add(statusArea().getBoundingClientRect().height.toFixed(1))
      }

      expect(
        [...heights],
        `${preset} status area resized while working: ${[...heights].join(' , ')}`,
      ).toHaveLength(1)
    },
  }
}

export const StatusHeightStablePlotPoint = statusHeightProbe('plotPoint')
export const StatusHeightStableTableOfValues = statusHeightProbe('tableOfValues')
export const StatusHeightStableReflect = statusHeightProbe('reflect', {
  difficultyCapabilities: { diagonalMirrorLines: true },
})
export const StatusHeightStableRotate = statusHeightProbe('rotate', {
  difficultyCapabilities: { nonOriginCentre: true },
})
export const StatusHeightStableEnlarge = statusHeightProbe('enlarge', {
  difficultyCapabilities: {
    nonOriginCentre: true,
    fractionalScaleFactor: true,
    negativeScaleFactor: true,
  },
})
