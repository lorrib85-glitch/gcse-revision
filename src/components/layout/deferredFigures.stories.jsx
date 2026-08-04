import { lazy } from 'react'
import { expect, waitFor, within } from 'storybook/test'

import { DeferredFigure, FigurePlaceholder } from './deferredFigures.jsx'

// The deferred figure boundary in the two states a learner could actually meet
// it in — a module still arriving, and a module that never arrives.
//
// Both are exception paths: the runtime preloads a chapter's figures the moment
// its definition resolves, so in normal use the figure is already in hand. That
// is exactly why these need a browser test rather than a walkthrough. The
// states are hard to reach by clicking, and a fallback nobody has looked at is
// how "it degrades gracefully" turns out to be false.

export default {
  title: 'Layout/DeferredFigure',
  parameters: { layout: 'centered' },
}

/** A figure whose module never resolves — the very-slow-connection case. */
const NeverResolves = lazy(() => new Promise(() => {}))

/** A figure whose module fails outright — offline, or a chunk 404 after deploy. */
const AlwaysFails = lazy(() => Promise.reject(new Error('chunk unavailable')))

export const Loading = {
  render: () => (
    <div style={{ width: 342 }}>
      <DeferredFigure><NeverResolves /></DeferredFigure>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = await canvas.findByRole('status')

    // The whole point of the frame: it holds the figure's place, so the
    // arriving diagram replaces a space instead of creating one.
    expect(frame).toHaveAccessibleName('Diagram loading')
    const box = frame.getBoundingClientRect()
    expect(box.height).toBeGreaterThan(120)
    expect(box.width).toBeLessThanOrEqual(342)

    // Inside the content column, never wider than it.
    expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth)

    // Calm, not alarming: a status, not an alert.
    expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const FailedToLoad = {
  render: () => (
    <div style={{ width: 342 }}>
      <DeferredFigure><AlwaysFails /></DeferredFigure>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A figure that fails must cost the learner that figure and nothing else:
    // the boundary catches the rejection, the frame stays, and the surrounding
    // screen is untouched. Without the boundary this rejection would take the
    // whole chapter tree down.
    await waitFor(async () => {
      const frame = await canvas.findByRole('status')
      expect(frame).toHaveAccessibleName('Diagram unavailable')
    })

    const frame = await canvas.findByRole('status')
    expect(frame.getBoundingClientRect().height).toBeGreaterThan(120)
    expect(canvas.queryByRole('alert')).toBeNull()
  },
}

/** The frame on its own, so its resting appearance can be reviewed at 390px. */
export const PlaceholderOnly = {
  render: () => (
    <div style={{ width: 342 }}>
      <FigurePlaceholder />
    </div>
  ),
}
