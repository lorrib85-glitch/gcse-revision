import { expect, waitFor, within } from 'storybook/test'
import QuoteAnalyser from './QuoteAnalyser'
import {
  motionPreferenceDecorator,
  motionProbe,
} from '../../../tests/support/reducedMotionStoryHarness.jsx'

// Reveal timings the read step schedules under normal motion.
const WORD_CADENCE = 125
const ATTRIBUTION_DELAY = 420
const CTA_DELAY = 1050

export default {
  component: QuoteAnalyser,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const MACBETH_BLOCK = {
  type: 'quoteAnalyser',
  workTitle: 'Macbeth',
  speaker: 'Macbeth',
  sceneLabel: 'Act 1, Scene 4',
  quote: '"Stars, hide your fires; let not light see my black and deep desires."',
  location: 'Act 1, Scene 4 — Macbeth',
  backgroundImage: '/images/english/macbeth/macbeth-generic-banner.svg',
  context: {
    beats: [
      'King Duncan names Malcolm as the next heir to the throne.',
      'Macbeth realises Malcolm now stands between him and the crown.',
    ],
    transition: 'Macbeth turns his thoughts towards the stars…',
  },
  interpretationPrompt: 'What do you think this quote reveals?',
  interpretationInstruction: 'Use your own words. A rough idea is enough.',
  interpretationPlaceholder: 'Write your interpretation...',
  interpretationStarterHeading: 'Need a way in?',
  interpretationStarters: [
    'I think Macbeth is feeling…',
    'I think this because the word “…” suggests…',
    'Macbeth wants to hide…',
    'This reveals that Macbeth is…',
  ],
  wordAnalysisNextStep: 'essay',
  wordAnalysisCompleteLabel: 'Use it in an essay',
  wordAnalysis: {
    fires: {
      technique: 'Light imagery',
      meaning: 'Light suggests truth, judgement and divine order. Macbeth wants that light hidden because he knows his ambition should not be seen.',
      sentence: 'Shakespeare uses “fires” to show Macbeth trying to conceal ambition from moral and divine judgement.',
    },
    black: {
      technique: 'Colour imagery',
      meaning: '“Black” suggests moral darkness. Macbeth already recognises that what he wants is corrupt.',
      sentence: 'The colour imagery of “black” presents Macbeth’s ambition as morally corrupt and deliberately hidden.',
    },
    deep: {
      technique: 'Depth imagery',
      meaning: '“Deep” makes the ambition feel buried and rooted inside Macbeth rather than like a passing thought.',
      sentence: 'Shakespeare’s use of “deep” implies Macbeth’s ambition is hidden but already established in his mind.',
    },
    desires: {
      technique: 'Noun choice',
      meaning: '“Desires” shows that Macbeth actively wants power. His ambition exists before Lady Macbeth begins influencing him.',
      sentence: 'The noun “desires” reveals that Macbeth’s ambition is internal and self-driven.',
    },
  },
  meaningSections: [
    { label: 'What it means', body: 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong.' },
    { label: 'Why it matters', body: 'Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal a desire that already belongs to him.' },
    { label: 'Method and effect', body: 'Shakespeare contrasts light and darkness to show the conflict between judgement and hidden ambition.' },
  ],
  essayExample: 'Shakespeare uses light and dark imagery in “Stars, hide your fires” to show that Macbeth recognises his ambition is morally corrupt and wants to conceal it from judgement.',
}

const QUOTE_WORD_COUNT = MACBETH_BLOCK.quote.split(' ').filter(Boolean).length

export const MacbethQuote = {
  args: {
    block: MACBETH_BLOCK,
    subject: 'English',
    onContinue: () => console.log('continue'),
  },
}

// Every word of the quote is rendered at all times; the reveal is an opacity
// cascade, so "visible" means opacity 1 rather than present in the DOM.
function quoteWordOpacities(canvasElement) {
  const quote = canvasElement.querySelector('blockquote')
  return Array.from(quote.querySelectorAll('span, button'))
    .filter(node => node.textContent.trim().length > 0)
    .map(node => node.style.opacity)
}

export const NormalMotionRead = {
  decorators: [motionPreferenceDecorator(false)],
  args: MacbethQuote.args,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /^continue$/i }))

    // The staged reveal still runs: word cadence, then attribution, then CTA.
    await waitFor(() => expect(motionProbe.intervals).toContain(WORD_CADENCE))
    await waitFor(() => {
      expect(quoteWordOpacities(canvasElement).every(opacity => opacity === '1')).toBe(true)
    }, { timeout: 5000 })
    await waitFor(() => expect(motionProbe.timeouts).toContain(ATTRIBUTION_DELAY))
    await waitFor(() => expect(motionProbe.timeouts).toContain(CTA_DELAY))
  },
}

export const ReducedMotionRead = {
  decorators: [motionPreferenceDecorator(true)],
  args: MacbethQuote.args,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /^continue$/i }))

    // The complete quote, its attribution and the CTA are all present without
    // advancing a single timer.
    const opacities = quoteWordOpacities(canvasElement)
    expect(opacities).toHaveLength(QUOTE_WORD_COUNT)
    expect(opacities.every(opacity => opacity === '1')).toBe(true)

    // Attribution block and CTA wrapper are both revealed (aria-hidden="false")
    // and fully opaque on the very first frame of the read step.
    const revealed = Array.from(canvasElement.querySelectorAll('[aria-hidden="false"]'))
    expect(revealed.length).toBeGreaterThanOrEqual(2)
    revealed.forEach(node => expect(node.style.opacity).toBe('1'))

    const cta = canvas.getByRole('button', { name: /what do you think it means/i })
    await expect(cta).toBeVisible()

    expect(motionProbe.intervals).not.toContain(WORD_CADENCE)
    expect(motionProbe.timeouts).not.toContain(ATTRIBUTION_DELAY)
    expect(motionProbe.timeouts).not.toContain(CTA_DELAY)

    // Nothing was painted hidden and then corrected — the attribution and CTA
    // states were seeded from the preference, not from the animated start.
    expect(motionProbe.opacityCorrections).toEqual([])
  },
}

export const ReducedMotionInterpretStep = {
  decorators: [motionPreferenceDecorator(true)],
  args: MacbethQuote.args,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    // The reading order and step sequence are unchanged under reduced motion.
    await userEvent.click(await canvas.findByRole('button', { name: /^continue$/i }))
    await userEvent.click(await canvas.findByRole('button', { name: /what do you think it means/i }))

    // The CSS safety net is a real @media rule, which this JS-level harness
    // does not emulate — the entrance animation still plays here, so wait for
    // it. Real reduced-motion rendering is covered by the browser run in
    // Workstream 10 of the Phase 12 verification.
    const input = await canvas.findByRole('textbox')
    await waitFor(() => expect(input).toBeVisible(), { timeout: 3000 })
    await expect(canvas.getByText(MACBETH_BLOCK.interpretationPrompt)).toBeVisible()
  },
}
