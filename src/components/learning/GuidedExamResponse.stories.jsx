import { expect, screen, waitFor } from 'storybook/test'
import GuidedExamResponse from './GuidedExamResponse.jsx'
import { guidedExamResponse as VESALIUS_EXAM } from '../../dev/componentReview/fixtures.base.js'
import {
  motionPreferenceDecorator,
  motionProbe,
} from '../../../tests/support/reducedMotionStoryHarness.jsx'

// GuidedExamResponse portals its full-screen overlay to document.body, so these
// play functions query `screen` rather than the story canvas.

const BEAT_REVEAL_DELAY = 140
const BEAT_NAME = new RegExp(VESALIUS_EXAM.beatText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

export default {
  title: 'Learning/GuidedExamResponse',
  component: GuidedExamResponse,
  parameters: { layout: 'fullscreen' },
  args: {
    exam: VESALIUS_EXAM,
    module: { id: 'renaissance-medicine' },
    onExit: () => {},
    onContinue: () => {},
  },
}

export const NormalMotionDarkBeat = {
  decorators: [motionPreferenceDecorator(false)],
  play: async () => {
    const beat = await screen.findByRole('button', { name: BEAT_NAME })

    // The cinematic path is unchanged: the beat starts hidden, the entrance
    // delay is scheduled, and it then fades in on a real opacity transition.
    expect(motionProbe.timeouts).toContain(BEAT_REVEAL_DELAY)
    expect(beat.style.opacity).toBe('0')
    expect(beat.style.transition).toContain('opacity')
    expect(beat.style.transition).not.toBe('none')

    await waitFor(() => expect(beat.style.opacity).toBe('1'))
    await waitFor(
      () => expect(window.getComputedStyle(beat).opacity).toBe('1'),
      { timeout: 3000 },
    )
  },
}

export const ReducedMotionDarkBeat = {
  decorators: [motionPreferenceDecorator(true)],
  play: async () => {
    const beat = await screen.findByRole('button', { name: BEAT_NAME })

    // The device already asked for reduced motion before mount, so the beat is
    // rendered in its final visible state and the entrance delay is never
    // scheduled at all.
    expect(motionProbe.timeouts).not.toContain(BEAT_REVEAL_DELAY)
    expect(beat.style.opacity).toBe('1')
    expect(beat.style.transition).toBe('none')
    await expect(beat).toBeVisible()
    await expect(beat).toHaveTextContent(VESALIUS_EXAM.beatText)

    // Nothing was painted hidden and then corrected — beatVisible was seeded
    // from the preference rather than from the animated start state.
    expect(motionProbe.opacityCorrections).toEqual([])
  },
}

export const ReducedMotionWritingPhase = {
  decorators: [motionPreferenceDecorator(true)],
  play: async ({ userEvent }) => {
    // The whole exam flow still works under reduced motion: beat → intro → write.
    await userEvent.click(await screen.findByRole('button', { name: BEAT_NAME }))
    await userEvent.click(await screen.findByRole('button', { name: /start my response/i }))

    const textareas = await screen.findAllByRole('textbox')
    expect(textareas).toHaveLength(VESALIUS_EXAM.sections.length)
    await expect(screen.getByRole('button', { name: /submit my response/i })).toBeVisible()

    // No entrance animation was requested anywhere in the writing phase.
    document.querySelectorAll('[style*="animation"]').forEach(node => {
      if (node.style.animation) expect(node.style.animation).toBe('none')
    })
  },
}
