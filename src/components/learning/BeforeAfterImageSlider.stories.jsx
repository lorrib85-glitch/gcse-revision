import BeforeAfterImageSlider from './BeforeAfterImageSlider.jsx'

export default {
  title: 'Learning/BeforeAfterImageSlider',
  component: BeforeAfterImageSlider,
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  args: {
    beforeSrc: '/headers/history-medicine-through-time.webp',
    afterSrc: '/headers/history-elizabethan.webp',
    beforeAlt: 'Before',
    afterAlt: 'After',
    beforeLabel: 'Before',
    afterLabel: 'After',
    heading: 'Drag to compare',
    subheading: 'A before-and-after visual comparison.',
    revealText: 'The slider lets learners compare two states of the same image directly.',
    accent: '#6A343D',
    initial: 50,
    onComplete: () => {},
  },
}
