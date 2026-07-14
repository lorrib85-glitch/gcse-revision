import TimelineCanvas from './TimelineCanvas.jsx'

export default {
  title: 'Learning/TimelineCanvas',
  component: TimelineCanvas,
  parameters: { layout: 'fullscreen' },
}

export const BlackDeathSpread = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      type: 'timelineCanvas',
      title: 'How the Black Death spread',
      intro: 'Swipe to explore the chain. Tap + on each card to reveal why it mattered.',
      steps: [
        { id: 'trade', label: 'Trade ships carried rats', detail: 'Ships from Asia carried black rats in their cargo holds along busy trade routes.', stats: ['Trade routes'] },
        { id: 'fleas', label: 'Fleas lived on the rats', detail: 'Fleas feeding on infected rats picked up the plague bacteria.', stats: ['Yersinia pestis'] },
        { id: 'bites', label: 'Fleas bit humans', detail: 'When rats died, fleas jumped to humans and bit them, passing on the infection.', stats: ['Flea bites'] },
        { id: 'spread', label: 'Disease spread town to town', detail: 'People fleeing outbreaks carried the disease with them, spreading it across Europe.', stats: ['1348 England'] },
      ],
    },
  },
}
