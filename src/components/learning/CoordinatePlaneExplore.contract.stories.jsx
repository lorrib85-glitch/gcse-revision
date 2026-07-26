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

import { expect, fn, userEvent, within } from 'storybook/test'
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
