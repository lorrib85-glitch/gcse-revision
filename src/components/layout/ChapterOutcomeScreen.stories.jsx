import { useEffect, useRef } from 'react'
import { expect, waitFor, within } from 'storybook/test'
import { SUBJECT_BACKDROP_POSITIONS } from '../../constants/subjectBackdrops.js'
import ChapterOutcomeScreen from './ChapterOutcomeScreen.jsx'

const standardOutcomes = [
  'Identify plant cell structures and explain their jobs',
  'Explain what the photosynthesis equation means',
  'Connect photosynthesis, respiration and food chains',
]

const reducedMotionMatchMedia = query => ({
  matches: query === '(prefers-reduced-motion: reduce)',
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})

function ReducedMotionDecorator(Story) {
  const originalMatchMedia = useRef(window.matchMedia)
  window.matchMedia = reducedMotionMatchMedia

  useEffect(() => () => {
    window.matchMedia = originalMatchMedia.current
  }, [])

  return <Story />
}

export default {
  title: 'Layout/ChapterOutcomeScreen',
  component: ChapterOutcomeScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    subject: 'Biology',
    chapterTitle: 'Plant Cells & Photosynthesis',
    outcomes: standardOutcomes,
    onBack: () => {},
    onContinue: () => {},
  },
}

export const BiologyOutcome = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(
      () => expect(canvas.getAllByRole('listitem')).toHaveLength(3),
      { timeout: 3000 },
    )
    await waitFor(
      () => expect(canvas.getByRole('button', { name: /start chapter/i })).toBeVisible(),
      { timeout: 3000 },
    )

    await expect(canvas.getByRole('heading', {
      level: 1,
      name: 'Plant Cells & Photosynthesis',
    })).toBeVisible()

    const backdrop = canvasElement.querySelector('[data-chapter-outcome-backdrop]')
    const scrim = canvasElement.querySelector('[data-chapter-outcome-scrim]')
    const markers = canvasElement.querySelectorAll('[data-chapter-outcome-marker]')
    const rows = canvasElement.querySelectorAll('[data-chapter-outcome-row]')

    await expect(backdrop).toHaveAttribute(
      'data-background-position',
      SUBJECT_BACKDROP_POSITIONS.Biology,
    )
    expect(backdrop.style.opacity).toBe('0.5')
    expect(scrim.getBoundingClientRect().width).toBeLessThan(window.innerWidth)
    expect(markers).toHaveLength(3)
    expect(rows).toHaveLength(3)
    markers.forEach(marker => {
      expect(marker.style.filter).toBe('')
      expect(marker.style.transform).toBe('')
      expect(marker.style.animation).toBe('')
    })
    rows.forEach(row => {
      expect(row.style.animation).toContain('cos-row')
      expect(row.style.animation).toContain('420ms')
    })
  },
}

export const ShortViewportWithLongContent = {
  args: {
    chapterTitle: 'How plant cells capture light energy and keep whole ecosystems alive',
    outcomes: [
      'Identify the structures found in plant cells and connect each structure to its precise job',
      'Explain how carbon dioxide and water become glucose and oxygen during photosynthesis',
      'Describe why chlorophyll is needed to transfer light energy into the reaction',
      'Connect photosynthesis to aerobic respiration and the movement of energy through food chains',
      'Use the word equation accurately in an unfamiliar exam question',
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'shortMobile',
      viewports: {
        shortMobile: {
          name: 'Short mobile 390 × 568',
          styles: { width: '390px', height: '568px' },
          type: 'mobile',
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(
      () => expect(canvas.getAllByRole('listitem')).toHaveLength(5),
      { timeout: 4000 },
    )
    await waitFor(
      () => expect(canvas.getByRole('button', { name: /start chapter/i })).toBeVisible(),
      { timeout: 4000 },
    )

    const scroller = canvasElement.querySelector('[data-chapter-outcome-scroll]')
    expect(scroller.clientHeight).toBeLessThanOrEqual(window.innerHeight)
    expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)

    scroller.scrollTop = scroller.scrollHeight
    await waitFor(() => expect(scroller.scrollTop).toBeGreaterThan(0))
    await expect(canvas.getByRole('button', { name: /start chapter/i })).toBeVisible()
  },
}

export const ReducedMotion = {
  decorators: [ReducedMotionDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const scroller = canvasElement.querySelector('[data-chapter-outcome-scroll]')
    const rows = canvasElement.querySelectorAll('[data-chapter-outcome-row]')
    const markers = canvasElement.querySelectorAll('[data-chapter-outcome-marker]')
    const cta = canvas.getByRole('button', { name: /start chapter/i })

    await expect(scroller).toHaveAttribute('data-reduced-motion', 'true')
    expect(rows).toHaveLength(3)
    expect(markers).toHaveLength(3)
    rows.forEach(row => expect(row.style.animation).toBe('none'))
    markers.forEach(marker => expect(marker.style.animation).toBe(''))
    expect(cta.style.animation).toBe('none')
  },
}
