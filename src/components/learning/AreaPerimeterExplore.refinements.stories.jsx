import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'
import AreaPerimeterExplore from './AreaPerimeterExplore.jsx'

export default {
  title: 'Learning/AreaPerimeterExplore/Refinement checks',
  component: AreaPerimeterExplore,
  parameters: {
    layout: 'centered',
  },
}

export const InstructionAndComparisonCopy = {
  args: { preset: 'rectangle', focus: 'compare' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const instruction = canvasElement.querySelector('[data-ap-interaction-instruction="true"]')
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })
    const height = canvas.getByRole('slider', { name: 'Height of the rectangle' })

    await expect(instruction).toHaveTextContent('Drag either handle to change the rectangle.')
    await expect(canvas.getByText(
      'Perimeter measures the boundary. Area measures the space inside.',
    )).toBeVisible()

    width.focus()
    await userEvent.keyboard('{ArrowRight}')

    expect(canvasElement.querySelector('[data-ap-interaction-instruction="true"]')).toBeNull()
    await expect(canvas.getByText(
      'Width increased by 1 cm — area gained 4 cm² while perimeter gained 2 cm.',
    )).toBeVisible()

    height.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(canvas.getByText(
      'Height increased by 1 cm — area gained 7 cm² while perimeter gained 2 cm.',
    )).toBeVisible()
  },
}

export const PointerAnnouncementOnRelease = {
  args: { preset: 'rectangle', focus: 'compare' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })
    const svg = canvasElement.querySelector('svg[data-ap-canvas]')
    const live = canvasElement.querySelector('[data-ap-status-announcement="true"]')
    const svgRect = svg.getBoundingClientRect()

    const point = (modelX, modelY) => ({
      clientX: svgRect.left + (modelX / 360) * svgRect.width,
      clientY: svgRect.top + (modelY / 210) * svgRect.height,
    })

    fireEvent.pointerDown(width, {
      pointerId: 1,
      buttons: 1,
      ...point(178, 122),
    })
    await waitFor(() => expect(width).toHaveAttribute('data-dragging', 'true'))

    fireEvent.pointerMove(width, {
      pointerId: 1,
      buttons: 1,
      ...point(188, 122),
    })

    await waitFor(() => expect(width).toHaveAttribute('aria-valuenow', '7'))
    expect(live.textContent).toBe('')

    fireEvent.pointerUp(width, {
      pointerId: 1,
      buttons: 0,
      ...point(188, 122),
    })

    await expect(live).toHaveTextContent('Perimeter 22 cm — area 28 cm²')
  },
}

export const RenderedMobileHitTargets = {
  args: { preset: 'rectangle', focus: 'compare' },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const targets = [...canvasElement.querySelectorAll('[data-ap-hit-target="true"]')]
    expect(targets).toHaveLength(2)

    for (const target of targets) {
      const rect = target.getBoundingClientRect()
      expect(rect.width).toBeGreaterThanOrEqual(44)
      expect(rect.height).toBeGreaterThanOrEqual(44)
    }
  },
}
