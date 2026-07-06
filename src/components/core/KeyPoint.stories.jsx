import KeyPoint from './KeyPoint'

export default {
  component: KeyPoint,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Gold — the takeaway RULE of the Galen teach screen (summarises the rule;
// it does not walk a case — that is WorkedExample).
export const Gold = {
  name: 'Gold — the rule takeaway',
  args: {
    subject: 'History',
    children: (
      <>The rule was simple: treat every illness with its <span style={{ color: '#D69B45' }}>opposite</span> quality.</>
    ),
  },
}

export const WithIcon = {
  name: 'With optional icon',
  args: {
    subject: 'Biology',
    icon: '🧬',
    children: (
      <>A gene is a section of DNA that codes for one <span style={{ color: '#5FB979' }}>protein</span>.</>
    ),
  },
}
