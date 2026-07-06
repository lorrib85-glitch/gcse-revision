import HumoralCompass from './HumoralCompass'

export default {
  component: HumoralCompass,
  tags: ['ai-generated'],
  parameters: {
    layout: 'centered',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Galen's Theory of Opposites as a 2×2 quality field. The arrow shows the cure
// crossing to the opposite quadrant; `highlight` picks which humour it starts from.
export const Default = {
  name: 'Blood → opposite (cold + dry)',
  args: { subject: 'History', highlight: 'blood' },
}

export const FromYellowBile = {
  name: 'Yellow bile → opposite (cold + wet)',
  args: { subject: 'History', highlight: 'yellowBile' },
}

export const FromPhlegm = {
  name: 'Phlegm → opposite (hot + dry)',
  args: { subject: 'History', highlight: 'phlegm' },
}
