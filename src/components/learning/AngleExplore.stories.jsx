import { expect, userEvent, within } from 'storybook/test'
import AngleExplore from './AngleExplore.jsx'

function getSectorLabel(canvasElement, sectorId) {
  return canvasElement.querySelector(`[data-angle-sector-label="${sectorId}"]`)
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.angle-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/AngleExplore',
  component: AngleExplore,
  parameters: {
    layout: 'centered',
  },
}

export const AngleTypes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Angle size' })

    await expect(handle).toHaveAttribute('aria-valuenow', '65')
    await expect(canvas.getByText('Acute angle — 65°')).toBeVisible()
    expect(getSectorLabel(canvasElement, 'sector-main')?.textContent).toBe('65°')

    handle.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}')
    await expect(handle).toHaveAttribute('aria-valuenow', '90')
    await expect(canvas.getByText('Right angle — 90°')).toBeVisible()
    expect(canvasElement.querySelector('[data-angle-right-marker]')).not.toBeNull()

    await userEvent.keyboard('{End}')
    await expect(handle).toHaveAttribute('aria-valuenow', '360')
    await expect(canvas.getByText('Full turn — 360°')).toBeVisible()
    expect(getSectorLabel(canvasElement, 'sector-main')?.textContent).toBe('360°')
    const fullTurnFill = canvasElement.querySelector(
      '[data-angle-sector="sector-main"] .angle-explore__sector-fill',
    )
    expect(fullTurnFill).not.toBeNull()
    expect(fullTurnFill?.getAttribute('d').match(/\bA\b/g) ?? []).toHaveLength(2)

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    await expect(handle).toHaveAttribute('aria-valuenow', '350')
    await expect(canvas.getByText('Reflex angle — 350°')).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(handle).toHaveAttribute('aria-valuenow', '10')
    await expect(canvas.getByText('Acute angle — 10°')).toBeVisible()
  },
}

export const StraightLine = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Angle on the straight line' })

    await expect(canvas.getByText('110° + 70° = 180°')).toBeVisible()

    handle.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(canvas.getByText('105° + 75° = 180°')).toBeVisible()
    expect(getSectorLabel(canvasElement, 'sector-right')?.textContent).toBe('105°')
    expect(getSectorLabel(canvasElement, 'sector-left')?.textContent).toBe('75°')
  },
}

export const AroundPoint = {
  args: { preset: 'aroundPoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'First angle around the point' })

    await expect(canvas.getByText('130° + 110° + 120° = 360°')).toBeVisible()

    handle.focus()
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await expect(canvas.getByText('140° + 100° + 120° = 360°')).toBeVisible()
  },
}

export const VerticallyOpposite = {
  args: { preset: 'verticallyOpposite' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Angle between the crossing lines' })

    await expect(canvas.getByText('Vertically opposite angles are equal')).toBeVisible()
    expect(canvas.getAllByText('55°')).toHaveLength(2)
    expect(canvas.getAllByText('125°')).toHaveLength(2)

    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(canvas.getAllByText('60°')).toHaveLength(2)
    expect(canvas.getAllByText('120°')).toHaveLength(2)
  },
}

export const Triangle = {
  args: { preset: 'triangle' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Position of the top vertex' })

    await expect(handle).toHaveAttribute('aria-valuenow', '145')
    await expect(canvas.getByText('74° + 62° + 44° = 180°')).toBeVisible()
    await expect(canvas.getByText('Angles in a triangle add up to 180°.')).toBeVisible()
    expect(canvasElement.querySelector('[data-angle-shape="triangle-equal-left"]')).toBeNull()
    expect(canvasElement.querySelector('[data-angle-shape="triangle-equal-right"]')).toBeNull()

    handle.focus()
    await userEvent.keyboard(
      '{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}',
    )
    await expect(handle).toHaveAttribute('aria-valuenow', '180')
    await expect(canvas.getByText('76° + 52° + 52° = 180°')).toBeVisible()
    expect(canvasElement.querySelector('[data-angle-shape="triangle-equal-left"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-angle-shape="triangle-equal-right"]')).not.toBeNull()

    await userEvent.keyboard('{End}')
    await expect(handle).toHaveAttribute('aria-valuenow', '260')
    expect(canvasElement.textContent).toContain('= 180°')
  },
}

export const StaticDiagram = {
  args: {
    preset: 'angleTypes',
    value: 120,
    interactive: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const diagram = canvasElement.querySelector('.angle-explore')

    await expect(diagram).toHaveAttribute('data-angle-interactive', 'false')
    expect(canvas.queryAllByRole('slider')).toHaveLength(0)
    await expect(canvas.getByText('Obtuse angle — 120°')).toBeVisible()
  },
}

export const ReducedMotion = {
  args: { reducedMotion: true },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.angle-explore')

    await expect(diagram).toHaveClass('angle-explore--reduced-motion')
    await expect(diagram).toHaveAttribute('data-reduced-motion', 'true')
  },
}

export const MobileWidth = {
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
    const svg = canvasElement.querySelector('svg[data-angle-canvas="360x220"]')
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')

    const hitTarget = canvasElement.querySelector('[data-angle-hit-target="true"]')
    expect(hitTarget).not.toBeNull()
    const radius = Number(hitTarget.getAttribute('r'))
    expect(radius * 2).toBeGreaterThanOrEqual(44)
  },
}
