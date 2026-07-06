import TeachScreenShell from './TeachScreenShell'
import MediaPlaceholder from './MediaPlaceholder'

export default {
  component: TeachScreenShell,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// A stand-in for the KeyPoint component (built in P3). The shell renders
// whatever node it is given in the keyPoint slot, last, with a gradual reveal.
function KeyPointStandIn() {
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '18px', borderRadius: 16,
      background: 'rgba(214,155,69,0.08)',
      border: '1px solid rgba(214,155,69,0.28)',
    }}>
      <div style={{ fontSize: 20, lineHeight: 1, marginTop: 1 }}>🩸</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15.5, lineHeight: 1.5, color: '#F0E6C8', fontWeight: 500 }}>
        Fever, a red face and sweating? Too much <span style={{ color: '#E8604A' }}>blood</span> — hot and wet. Galen's cure: cool and dry the body.
      </div>
    </div>
  )
}

// Gold example — the reworked Galen teach screen: heading → intro → reserved
// diagram slot → one key point. No eyebrow (the heading carries the point).
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
    keyPoint: <KeyPointStandIn />,
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
