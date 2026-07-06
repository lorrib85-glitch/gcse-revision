import TeachScreenShell from './TeachScreenShell'
import MediaPlaceholder from './MediaPlaceholder'
import KeyPoint from './KeyPoint'

export default {
  component: TeachScreenShell,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Gold example — the reworked Galen teach screen: heading → intro → reserved
// diagram slot → one key point (the rule takeaway). No eyebrow (the heading
// carries the point).
export const Gold = {
  name: 'Gold — Galen teach screen',
  args: {
    subject: 'History',
    heading: 'Every illness had an opposite',
    intro: 'Each humour sat where two qualities met. Symptoms told the physician which corner the patient was in — and the cure moved them to the opposite one.',
    children: (
      <MediaPlaceholder kind="diagram" aspect="4:3" subject="History"
        caption="The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant." />
    ),
    keyPoint: (
      <KeyPoint subject="History">
        The rule was simple: treat every illness with its <span style={{ color: '#D69B45' }}>opposite</span> quality.
      </KeyPoint>
    ),
  },
}

// Minimal — heading + intro only, no visual, no key point.
export const Minimal = {
  name: 'Minimal — heading + intro',
  args: {
    subject: 'Biology',
    heading: 'Diffusion moves particles down a gradient',
    intro: 'Particles spread from where they are crowded to where they are sparse, until the difference disappears.',
  },
}
