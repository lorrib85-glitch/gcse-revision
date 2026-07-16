import { expect, userEvent, waitFor, within } from 'storybook/test'
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
    const scroller = canvasElement.querySelector('.tcv-scroller')
    const anchors = [0, 1, 2].map(index => (
      canvasElement.querySelector(`[data-timeline-card-anchor="${index}"]`)
    ))
    const groups = [0, 1, 2].map(index => (
      canvasElement.querySelector(`[data-timeline-card-group="${index}"]`)
    ))
    const basePaths = canvasElement.querySelectorAll('[data-connector-layer="base"]')
    const activePaths = canvasElement.querySelectorAll('[data-connector-layer="active"]')
    const reveal = canvas.getByRole('button', {
      name: 'Reveal why It began in central Asia mattered',
    })
    const scaleOf = group => Number.parseFloat(group.style.getPropertyValue('--tcv-focus-scale') || '0')
    const visibleCentre = () => {
      const rect = scroller.getBoundingClientRect()
      return rect.left + rect.width / 2
    }
    const anchorCentre = anchor => {
      const rect = anchor.getBoundingClientRect()
      return rect.left + rect.width / 2
    }
    const centreScrollLeft = anchor => (
      Number.parseFloat(anchor.style.left) - scroller.clientWidth / 2
    )

    // The first card begins centred, so it must be at maximum scale on mount.
    await waitFor(() => expect(scaleOf(groups[0])).toBeCloseTo(1.08, 2))
    expect(anchorCentre(anchors[0])).toBeCloseTo(visibleCentre(), 0)
    await expect(groups[0]).toHaveAttribute('data-focused', 'true')
    await expect(groups[0]).toHaveAttribute('data-route-arrival', 'joined')
    await expect(reveal).toHaveAttribute('data-control-position', 'card-top-left')
    await expect(reveal).toHaveAttribute('data-control-symbol', 'reveal')

    // The top-left + lives inside the scaled group, so it grows with its card,
    // while the snap anchor itself never carries a scale.
    expect(reveal.closest('[data-timeline-card-group]')).toBe(groups[0])
    expect(anchors[0].style.transform).toBe('translate(-50%, -50%)')

    // No opacity-based de-emphasis: the connector stays behind opaque cards.
    expect(groups[0].style.getPropertyValue('--tcv-focus-opacity')).toBe('')
    expect(window.getComputedStyle(groups[1]).opacity).toBe('1')

    expect(basePaths).toHaveLength(3)
    expect(activePaths).toHaveLength(3)

    // Bring the second anchor to the viewport centre and let snapping settle:
    // it must reach maximum scale while its neighbours stay smaller.
    // ('instant' rather than 'auto' — 'auto' defers to the scroller's CSS
    // scroll-behavior: smooth, and the settle must be measured, not mid-flight.)
    scroller.scrollTo({ left: centreScrollLeft(anchors[1]), behavior: 'instant' })
    await waitFor(() => {
      expect(scroller.scrollLeft).toBeCloseTo(centreScrollLeft(anchors[1]), 0)
      expect(scaleOf(groups[1])).toBeCloseTo(1.08, 2)
    })
    expect(anchorCentre(anchors[1])).toBeCloseTo(visibleCentre(), 0)
    await expect(groups[1]).toHaveAttribute('data-focused', 'true')
    expect(scaleOf(groups[0])).toBeLessThan(scaleOf(groups[1]))
    expect(scaleOf(groups[2])).toBeLessThan(scaleOf(groups[1]))

    // Equal offsets either side of centre give equal, sub-maximum scale.
    // Instant programmatic scrolls re-snap under mandatory snapping, so snap is
    // paused for this measurement only — the focus curve itself is under test.
    const snapType = scroller.style.scrollSnapType
    scroller.style.scrollSnapType = 'none'
    const offset = Math.round(scroller.clientWidth / 4)
    let leftScale = 0
    scroller.scrollLeft = centreScrollLeft(anchors[1]) - offset
    await waitFor(() => {
      leftScale = scaleOf(groups[1])
      expect(leftScale).toBeLessThan(1.0)
      expect(leftScale).toBeGreaterThan(0.72)
    })
    let rightScale = 0
    scroller.scrollLeft = centreScrollLeft(anchors[1]) + offset
    await waitFor(() => {
      rightScale = scaleOf(groups[1])
      expect(rightScale).toBeLessThan(1.0)
      expect(rightScale).toBeGreaterThan(0.72)
    })
    expect(leftScale).toBeCloseTo(rightScale, 2)
    scroller.style.scrollSnapType = snapType

    // Return to the first card for the reveal interaction below.
    scroller.scrollTo({ left: 0, behavior: 'instant' })
    await waitFor(() => {
      expect(scroller.scrollLeft).toBe(0)
      expect(scaleOf(groups[0])).toBeCloseTo(1.08, 2)
    })

    await userEvent.click(reveal)

    const close = canvas.getByRole('button', {
      name: 'Close explanation for It began in central Asia',
    })
    const detail = canvas.getByRole('region', { name: 'Why it mattered' })

    await expect(close).toHaveAttribute('data-control-position', 'card-top-left')
    await expect(close).toHaveAttribute('data-control-symbol', 'close')
    await expect(close).toHaveAttribute('aria-expanded', 'true')
    await expect(detail).toHaveAttribute('data-timeline-detail-sheet', 'anchored')
    // The sheet fades up over MOTION.duration.slow — wait out the entrance.
    await waitFor(() => expect(detail).toBeVisible())
    await waitFor(() => expect(canvas.getByText(/spread west along trade routes/)).toBeVisible())

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
