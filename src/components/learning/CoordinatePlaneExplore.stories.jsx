import { expect, userEvent, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'

// The coordinate is deliberately said twice — once beside the point, once as
// the status heading — and the quadrant sentence appears in both the status
// area and the SVG <desc>. Query those by their data attributes rather than by
// text, so the assertion names which one it means.
function pointLabel(canvasElement, pointId) {
  return canvasElement.querySelector(`[data-cp-point-label="${pointId}"]`)
}

function statusHeading(canvasElement) {
  return canvasElement.querySelector('[data-cp-status-heading]')
}

function statusExplanation(canvasElement) {
  return canvasElement.querySelector('[data-cp-status-explanation]')
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.cp-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/CoordinatePlaneExplore',
  component: CoordinatePlaneExplore,
  parameters: { layout: 'centered' },
}

export const PlotPoint = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'x coordinate' })

    await expect(pointLabel(canvasElement, 'p')).toHaveTextContent('(3, −2)')
    await expect(statusHeading(canvasElement)).toBeVisible()
    await expect(statusHeading(canvasElement)).toHaveTextContent('(3, −2)')
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/Quadrant IV/)

    handle.focus()
    await userEvent.keyboard('{ArrowLeft>5/}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-2')
    await expect(statusHeading(canvasElement)).toHaveTextContent('(−2, −2)')
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/Quadrant III/)

    await userEvent.keyboard('{Home}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-6')
  },
}

export const PlotPointStatic = {
  args: { interactive: false, defaultValue: { x: -4, y: 3 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(pointLabel(canvasElement, 'p')).toHaveTextContent('(−4, 3)')
    await expect(statusHeading(canvasElement)).toBeVisible()
    await expect(statusHeading(canvasElement)).toHaveTextContent('(−4, 3)')
    await expect(canvas.queryByRole('slider')).toBeNull()

    // Static mode drops aria-live but keeps a descriptive figure summary.
    const description = canvasElement.querySelector('desc')
    await expect(description.textContent).toContain('(−4, 3)')
    await expect(description.textContent).toContain('static illustration')
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()

    expectMobileContainment(canvasElement)
  },
}
