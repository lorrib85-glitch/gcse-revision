import { expect, userEvent, within } from 'storybook/test'
import TimelineCanvas from './TimelineCanvas.jsx'

const blackDeathJourney = {
  type: 'timelineCanvas',
  title: 'How the plague travelled',
  intro: 'Follow the plague’s journey from central Asia to England.',
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
}

export default {
  title: 'Learning/TimelineCanvas',
  component: TimelineCanvas,
  parameters: { layout: 'fullscreen' },
}

export const BlackDeathJourney = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: blackDeathJourney,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const firstGroup = canvasElement.querySelector('[data-timeline-card-group="0"]')
    const reveal = canvas.getByRole('button', {
      name: 'Reveal why It began in central Asia mattered',
    })

    await expect(firstGroup).toHaveAttribute('data-focused', 'true')
    await expect(reveal).toHaveAttribute('data-control-position', 'card-top-left')
    await expect(reveal).toHaveAttribute('data-control-symbol', 'reveal')
    expect(Number.parseFloat(firstGroup?.style.getPropertyValue('--tcv-focus-scale') || '0')).toBeCloseTo(1, 2)

    await userEvent.click(reveal)

    const close = canvas.getByRole('button', {
      name: 'Close explanation for It began in central Asia',
    })
    const detail = canvas.getByRole('region', { name: 'Why it mattered' })

    await expect(close).toHaveAttribute('data-control-position', 'card-top-left')
    await expect(close).toHaveAttribute('data-control-symbol', 'close')
    await expect(close).toHaveAttribute('aria-expanded', 'true')
    await expect(detail).toHaveAttribute('data-timeline-detail-sheet', 'anchored')
    await expect(detail).toBeVisible()
    await expect(canvas.getByText(/spread west along trade routes/)).toBeVisible()

    await userEvent.click(close)
    await expect(canvas.queryByRole('region', { name: 'Why it mattered' })).not.toBeInTheDocument()
  },
}

export const MissingImageFallback = {
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      ...blackDeathJourney,
      steps: [
        {
          ...blackDeathJourney.steps[0],
          image: undefined,
        },
        ...blackDeathJourney.steps.slice(1),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-timeline-image-fallback="true"]')).not.toBeNull()
  },
}
