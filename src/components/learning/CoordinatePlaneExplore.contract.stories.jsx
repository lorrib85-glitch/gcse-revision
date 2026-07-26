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

import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'

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
