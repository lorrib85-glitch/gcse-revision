import { expect, userEvent, within } from 'storybook/test'
import AreaPerimeterExplore from './AreaPerimeterExplore.jsx'

export default {
  title: 'Learning/AreaPerimeterExplore/Guidance',
  component: AreaPerimeterExplore,
  parameters: { layout: 'centered' },
}

export const SquareUnitMeaning = {
  args: { preset: 'rectangle', focus: 'area' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })

    expect(canvasElement.querySelector('[data-ap-shape="rectangle-unit-square"]')).not.toBeNull()
    await expect(canvas.getByText('1 cm²')).toBeVisible()
    expect(canvasElement.querySelector('desc')?.textContent)
      .toContain('One highlighted grid square represents 1 square centimetre.')

    width.focus()
    await userEvent.keyboard('{ArrowRight}')

    expect(canvasElement.querySelector('[data-ap-shape="rectangle-unit-square"]')).toBeNull()
    expect(canvas.queryByText('1 cm²')).toBeNull()
  },
}

export const CompositeMethodInstruction = {
  args: { preset: 'compositeShape', focus: 'area' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('Choose a method to split the shape into rectangles.'),
    ).toBeVisible()
    expect(canvasElement.querySelector('desc')?.textContent)
      .toContain('Choose a method to split the shape into rectangles.')

    await userEvent.click(canvas.getByRole('button', { name: 'Horizontal split' }))
    expect(canvas.queryByText('Choose a method to split the shape into rectangles.')).toBeNull()
  },
}

export const StaticDiagramInstruction = {
  args: {
    preset: 'trapeziumArea',
    value: { top: 4, bottom: 8, height: 5 },
    interactive: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvasElement.querySelector('desc')?.textContent)
      .toContain('Study the labelled diagram.')
    expect(canvas.queryByText('Study the labelled diagram.')).toBeNull()
    expect(canvas.queryAllByRole('slider')).toHaveLength(0)
  },
}
