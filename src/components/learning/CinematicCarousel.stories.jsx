import { expect, waitFor, within } from 'storybook/test'
import CinematicCarousel from './CinematicCarousel.jsx'
import { motionPreferenceDecorator } from '../../../tests/support/reducedMotionStoryHarness.jsx'

export default {
  title: 'Learning/CinematicCarousel',
  component: CinematicCarousel,
  parameters: { layout: 'fullscreen' },
}

const ORGANELLES_BLOCK = {
  type: 'cinematicCarousel',
  title: 'Inside the cell',
  intro: 'Four organelles. Four jobs.',
  items: [
    { id: 'nucleus', label: 'Nucleus', image: '/images/biology/cell-biology/animal-cell-clean.png', alt: 'Nucleus',
      facts: ['Controls the cell and contains DNA', 'GCSE: holds the genetic material as chromosomes'] },
    { id: 'mito', label: 'Mitochondria', image: '/images/biology/cell-biology/animal-cell-hotspot.png', alt: 'Mitochondria',
      facts: ['Site of aerobic respiration', 'GCSE: releases energy from glucose'] },
    { id: 'ribosomes', label: 'Ribosomes', image: '/images/biology/cell-biology/animal-cell-clean.png', alt: 'Ribosomes',
      facts: ['Where proteins are made', 'GCSE: site of protein synthesis'] },
    { id: 'membrane', label: 'Cell membrane', image: '/images/biology/cell-biology/animal-cell-bg.png', alt: 'Cell membrane',
      facts: ['Controls what enters and leaves', 'GCSE: partially permeable barrier'] },
  ],
}

const IMAGE_REVEAL_BLOCK = {
  type: 'cinematicCarousel',
  mode: 'imageReveal',
  title: 'The four humours',
  intro: 'Four fluids. One theory of health.',
  revealInterval: 400,
  items: [
    { id: 'blood', image: '/images/biology/cell-biology/animal-cell-clean.png', alt: 'Blood' },
    { id: 'phlegm', image: '/images/biology/cell-biology/animal-cell-hotspot.png', alt: 'Phlegm' },
  ],
}

export const Organelles = {
  args: { block: ORGANELLES_BLOCK, subject: 'Biology', onContinue: () => {} },
}

// No motion decorator: this story honours the real device preference. It is the
// only decorator-free documentation of imageReveal mode, and the surface used
// for browser-level reduced-motion verification.
export const ImageReveal = {
  args: { block: IMAGE_REVEAL_BLOCK, subject: 'History', onContinue: () => {} },
}

// The animated stage and the label/facts panel both carry the entrance
// animation. Chromium normalises the `animation` shorthand, so read the name.
function animationNames(canvasElement) {
  return Array.from(canvasElement.querySelectorAll('.ccv-motion')).map(node => node.style.animationName)
}

export const NormalMotionCarousel = {
  decorators: [motionPreferenceDecorator(false)],
  args: Organelles.args,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /next: mitochondria/i }))

    // The cinematic slide is still requested under normal motion — the new item
    // enters mid-animation, so it only becomes visible once the slide lands.
    const names = animationNames(canvasElement)
    expect(names.length).toBeGreaterThan(0)
    expect(names.every(name => name.startsWith('ccv-slide-in'))).toBe(true)

    await waitFor(
      () => expect(canvas.getByRole('heading', { name: 'Mitochondria' })).toBeVisible(),
      { timeout: 3000 },
    )
  },
}

export const ReducedMotionCarousel = {
  decorators: [motionPreferenceDecorator(true)],
  args: Organelles.args,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    // Item replacement, arrow navigation and viewed-state progression all still
    // work — only the slide animation is gone, from the very first render.
    expect(animationNames(canvasElement).every(value => value === 'none')).toBe(true)

    await userEvent.click(canvas.getByRole('button', { name: /next: mitochondria/i }))
    await expect(canvas.getByRole('heading', { name: 'Mitochondria' })).toBeVisible()
    expect(animationNames(canvasElement).every(value => value === 'none')).toBe(true)

    await userEvent.click(canvas.getByRole('button', { name: /previous: nucleus/i }))
    await expect(canvas.getByRole('heading', { name: 'Nucleus' })).toBeVisible()

    // Continue only appears once every item has been viewed.
    expect(canvas.queryByRole('button', { name: /continue/i })).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: /next: mitochondria/i }))
    await userEvent.click(canvas.getByRole('button', { name: /next: ribosomes/i }))
    await userEvent.click(canvas.getByRole('button', { name: /next: cell membrane/i }))

    const cta = await canvas.findByRole('button', { name: /continue/i })
    expect(cta.style.animationName).toBe('none')
  },
}

export const ReducedMotionImageReveal = {
  decorators: [motionPreferenceDecorator(true)],
  args: { block: IMAGE_REVEAL_BLOCK, subject: 'History', onContinue: () => {} },
  play: async ({ canvasElement }) => {
    // Image entrance animation is suppressed from the first frame.
    expect(animationNames(canvasElement).every(name => name === 'none')).toBe(true)

    // The timed sequence itself is unchanged — it still advances to the final
    // image and then exposes Continue, with no entrance animation on the CTA.
    const cta = await within(canvasElement).findByRole('button', { name: /continue/i }, { timeout: 5000 })
    await waitFor(() => expect(cta.style.animationName).toBe('none'))
    expect(animationNames(canvasElement).every(value => value === 'none')).toBe(true)
  },
}

export const NormalMotionImageReveal = {
  decorators: [motionPreferenceDecorator(false)],
  args: { block: IMAGE_REVEAL_BLOCK, subject: 'History', onContinue: () => {} },
  play: async ({ canvasElement }) => {
    const names = animationNames(canvasElement)
    expect(names.length).toBeGreaterThan(0)
    expect(names.every(name => name === 'image-reveal-in')).toBe(true)

    const cta = await within(canvasElement).findByRole('button', { name: /continue/i }, { timeout: 5000 })
    expect(cta.style.animationName).toBe('image-reveal-copy-in')
  },
}
