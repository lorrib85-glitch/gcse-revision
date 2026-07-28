import CinematicCarousel from './CinematicCarousel.jsx'

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

export const Organelles = {
  args: { block: ORGANELLES_BLOCK, subject: 'Biology', onContinue: () => {} },
}
