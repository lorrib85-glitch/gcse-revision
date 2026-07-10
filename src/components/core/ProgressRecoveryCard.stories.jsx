import ProgressRecoveryCard from './ProgressRecoveryCard.jsx'

export default {
  component: ProgressRecoveryCard,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Shown once before login when earlier, unattributable progress is found on
// the device. Reveals nothing about the previous learner.
export const Default = {
  args: {
    busy: false,
    onUse: () => {},
    onStartFresh: () => {},
  },
}

// Mid-adopt: the primary action reflects the in-flight recovery.
export const Busy = {
  args: {
    busy: true,
    onUse: () => {},
    onStartFresh: () => {},
  },
}
