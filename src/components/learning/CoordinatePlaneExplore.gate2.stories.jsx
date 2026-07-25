// Gate 2 evidence — the renderer contract, independent of any preset task.
//
// plotPoint is drag-only, so the stepper path is exercised through the
// documented compatible-preset-object escape hatch rather than waiting for
// straightLine. That keeps Gate 2 free of preset work, which is the point of
// the gate.

import { expect, fn, userEvent, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'

export default {
  title: 'Learning/CoordinatePlaneExplore/Gate2',
  component: CoordinatePlaneExplore,
  parameters: { layout: 'centered' },
}

// A minimal preset whose control accepts a wide model range but only lets a
// learner reach a narrow one — the exact shape that made static exam figures
// silently wrong before the two-range split.
const STEPPER_FIXTURE = {
  id: 'gate2Stepper',
  accessibilityLabel: 'Gate 2 stepper fixture',
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

// ─── Check 1: atomic diagonal drag ───────────────────────────────────────────
// Both coordinates must change, and onChange must fire with BOTH already
// applied. Two sequential single-control updates would emit a patch containing
// only the later one.
export const Check1AtomicDiagonalDrag = {
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

// ─── Check 2: stepper pointer and keyboard parity ────────────────────────────
export const Check2PointerKeyboardParity = {
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

// ─── Check 3: Home/End use the interaction range ─────────────────────────────
// The fixture accepts −8…8 but only lets a learner reach −2…2.
export const Check3HomeEndUseInteractionRange = {
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

// ─── Check 4: a supplied value outside the interaction range is untouched ────
// This is the corruption the two-range contract exists to prevent.
export const Check4SuppliedValueRendersUnchanged = {
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
export const Check4bSuppliedValueStaysWhenInteractive = {
  args: { preset: STEPPER_FIXTURE, defaultValue: { k: 6 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByRole('slider', { name: 'Test value' })

    await expect(value).toHaveAttribute('aria-valuenow', '6')

    // Moving it pulls it into the reachable range rather than snapping it home.
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Test value' }))
    await expect(value).toHaveAttribute('aria-valuenow', '2')
  },
}

// ─── Check 5: 320px containment ──────────────────────────────────────────────
export const Check5NarrowViewport = {
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

// ─── Check 6: accessibility output ───────────────────────────────────────────
export const Check6Accessibility = {
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
    expect(svg.querySelector('title').textContent).toBe('Gate 2 stepper fixture')
    expect(svg.querySelector('desc').textContent.length).toBeGreaterThan(0)
  },
}

// Static mode drops the live region but keeps the description.
export const Check6bStaticAccessibility = {
  args: { preset: 'plotPoint', interactive: false, defaultValue: { x: -4, y: 3 } },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()
    expect(canvasElement.querySelector('svg desc').textContent).toContain('(−4, 3)')
    expect(within(canvasElement).queryByRole('slider')).toBeNull()
  },
}
