import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'
import {
  motionPreferenceDecorator,
  motionProbe,
} from '../../tests/support/reducedMotionStoryHarness.jsx'

// Browser coverage for the React side of the canonical hook. The pure
// reader/subscriber helpers are covered in tests/unit/prefersReducedMotion.test.js.

// The value the hook returned on every render, so a test can assert what the
// very first client render saw — not just where it settled.
let renderLog = []

function ResetRenderLog(Story) {
  renderLog = []
  return <Story />
}

function Harness() {
  const reduceMotion = usePrefersReducedMotion()
  const [, forceRender] = useState(0)

  renderLog.push(reduceMotion)

  return (
    <div style={{ padding: 16, fontFamily: 'Sora, sans-serif', color: '#fff' }}>
      <output data-testid="value">{String(reduceMotion)}</output>
      <button type="button" data-testid="rerender" onClick={() => forceRender(n => n + 1)}>
        Rerender
      </button>
    </div>
  )
}

export default {
  title: 'Hooks/usePrefersReducedMotion',
  component: Harness,
  parameters: { layout: 'fullscreen' },
}

// ResetRenderLog sits last so it is the outermost decorator and renders first.
const pinned = (reduced, vintage) => [motionPreferenceDecorator(reduced, vintage), ResetRenderLog]

export const AlreadyReducedAtFirstRender = {
  decorators: pinned(true),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The contract: the preference is known before the first paint, so the very
    // first render already returned true — no false-first-frame.
    expect(renderLog[0]).toBe(true)
    expect(renderLog.every(Boolean)).toBe(true)
    await expect(canvas.getByTestId('value')).toHaveTextContent('true')
    expect(motionProbe.listenerCount()).toBe(1)
  },
}

export const NormalMotionAtFirstRender = {
  decorators: pinned(false),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(renderLog[0]).toBe(false)
    await expect(canvas.getByTestId('value')).toHaveTextContent('false')
    expect(motionProbe.listenerCount()).toBe(1)
  },
}

export const RespondsToPreferenceChange = {
  decorators: pinned(false),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('value')).toHaveTextContent('false')

    motionProbe.emit(true)
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('true'))

    motionProbe.emit(false)
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('false'))
  },
}

export const LegacyListenerEngine = {
  decorators: pinned(true, 'legacy'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Safari < 14 and friends only expose addListener/removeListener.
    expect(renderLog[0]).toBe(true)
    expect(motionProbe.listenerCount()).toBe(1)

    motionProbe.emit(false)
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('false'))
  },
}

export const NoListenerAccumulationAcrossRerenders = {
  decorators: pinned(false),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rerender = canvas.getByTestId('rerender')
    const rendersBefore = renderLog.length

    await userEvent.click(rerender)
    await userEvent.click(rerender)
    await userEvent.click(rerender)

    await waitFor(() => expect(renderLog.length).toBeGreaterThan(rendersBefore + 2))
    expect(motionProbe.listenerCount()).toBe(1)
  },
}
