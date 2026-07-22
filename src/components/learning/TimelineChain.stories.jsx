import { expect, userEvent, within } from 'storybook/test'
import TimelineChain from './TimelineChain.jsx'

export default {
  title: 'Learning/TimelineChain',
  component: TimelineChain,
  parameters: { layout: 'fullscreen' },
}

export const GermTheory = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      type: 'timelineChain',
      title: 'From germ theory to safe surgery',
      intro: 'Tap each step to see why it led to the next.',
      steps: [
        { id: 'pasteur', icon: 'microscope', label: 'Pasteur proves germ theory',
          detail: 'Pasteur showed that microbes in the air caused decay and disease. For the first time there was a real cause to fight, not just bad air.' },
        { id: 'lister', icon: 'antiseptic', label: 'Lister applies it to surgery',
          detail: 'If germs caused infection, killing them should prevent it. Lister used carbolic acid to kill microbes on wounds and instruments.' },
        { id: 'antiseptic', icon: 'shield', label: 'Antiseptic surgery cuts infection',
          detail: 'Deaths from infection after operations fell sharply. This proved germs — not miasma — caused surgical infection.' },
        { id: 'aseptic', icon: 'sterile', label: 'Aseptic surgery develops',
          detail: 'Surgeons now kept germs out entirely: sterilised instruments, gowns and gloves. Prevention replaced treatment.' },
      ],
    },
  },
}

// Passive one-step-at-a-time reveal variant. Mixes an icon marker (step 1) with
// numbered markers (steps 2–3) and structured highlighted phrases. Subject-agnostic.
export const Reveal = {
  args: {
    subject: 'History',
    variant: 'reveal',
    onContinue: () => {},
    block: {
      type: 'timelineChain',
      variant: 'reveal',
      title: 'How the idea travelled',
      intro: 'Reveal each step in turn.',
      steps: [
        { id: 'bad-air', icon: 'microscope',
          statement: 'People believed disease spread through bad air.',
          detail: 'So cities burned herbs and rang bells to drive the miasma away.' },
        { id: 'sweeten',
          statement: [
            { text: 'They tried to ' },
            { text: 'sweeten the air', highlight: true },
            { text: ' — not kill the cause.' },
          ] },
        { id: 'microbes',
          statement: [
            { text: 'The real cause was ' },
            { text: 'microbes', highlight: true },
            { text: '.' },
          ],
          detail: 'Only germ theory, centuries later, explained what was really happening.' },
      ],
      takeaway: 'Wrong cause, wrong cure — until the evidence changed.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Reveal mode initially shows only the first step. (The statement also appears in
    // the visually-hidden aria-live region, so allow more than one match here.)
    await expect(canvas.getAllByText('People believed disease spread through bad air.').length).toBeGreaterThan(0)
    await expect(canvas.queryByText('sweeten the air')).not.toBeInTheDocument()

    // Each CTA press reveals exactly one additional step. Highlighted phrases sit in
    // their own <mark>, so an exact-text query targets the visible step, not the live region.
    await userEvent.click(canvas.getByRole('button', { name: 'Reveal next' }))
    await expect(canvas.getByText('sweeten the air')).toBeInTheDocument()
    await expect(canvas.queryByText('microbes')).not.toBeInTheDocument()

    // The final reveal shows the takeaway and replaces the reveal CTA with Continue.
    await userEvent.click(canvas.getByRole('button', { name: 'Reveal next' }))
    await expect(canvas.getByText('microbes')).toBeInTheDocument()
    await expect(canvas.getByText('Wrong cause, wrong cure — until the evidence changed.')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Reveal next' })).not.toBeInTheDocument()
  },
}
