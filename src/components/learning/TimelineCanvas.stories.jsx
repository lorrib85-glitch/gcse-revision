import TimelineCanvas from './TimelineCanvas.jsx'

export default {
  title: 'Learning/TimelineCanvas',
  component: TimelineCanvas,
  parameters: { layout: 'fullscreen' },
}

export const BlackDeathJourney = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      type: 'timelineCanvas',
      title: 'How the plague travelled',
      intro: 'Swipe to follow the plague’s journey from central Asia to England. Tap + to reveal why each stage mattered.',
      steps: [
        {
          id: 'central-asia',
          image: '/figures/history/medicine/black-death/trade-routes-map.png',
          label: 'It began in central Asia',
          detail: 'The Black Death began in central Asia, probably in the late 1330s. It spread west along trade routes that also carried spices, silk and grain.',
          stats: ['c.1338', 'Central Asia'],
        },
        {
          id: 'ship',
          image: '/figures/history/medicine/black-death/plague-dock.png',
          label: 'Trade ships carried it to England',
          detail: 'By 1347, the plague had devastated cities around the Mediterranean. Ships from infected ports sailed north with infected animals aboard. The Black Death reached England at Melcombe in June 1348.',
          stats: ['June 1348', 'Melcombe, Dorset'],
        },
        {
          id: 'spread-inland',
          image: '/figures/history/medicine/black-death/medieval-town.png',
          label: 'From the ports it followed the trade roads',
          detail: 'The plague moved inland along the same roads used for trade. It reached Bristol and London within months. Towns, monasteries and villages on these routes suffered most.',
          stats: ['Late 1348', 'Bristol and London'],
        },
        {
          id: 'england',
          image: '/figures/history/medicine/black-death/trade-routes-map.png',
          label: 'By 1350 it had reached Scotland',
          detail: 'From Melcombe, the plague swept across England and into Scotland. Historians estimate it killed one-third to one-half of England’s population by 1350 — the worst disaster in English history.',
          stats: ['By 1350', '~30–50% mortality'],
        },
      ],
    },
  },
}
