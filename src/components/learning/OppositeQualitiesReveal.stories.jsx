import OppositeQualitiesReveal from './OppositeQualitiesReveal.jsx'

export default {
  title: 'Learning/OppositeQualitiesReveal',
  component: OppositeQualitiesReveal,
}

const HOT_COLD_BLOCK = {
  type: 'oppositeQualitiesReveal',
  title: 'Hot or cold?',
  copy: 'Doctors used symptoms to decide which quality was strongest.',
  leftConcept: { label: 'Hot', icon: '☀', items: ['Fever', 'Red face', 'Flushed skin'] },
  rightConcept: { label: 'Cold', icon: '❄', items: ['Pale skin', 'Chills', 'Shivering'] },
  sequence: [
    { item: 'Fever', side: 'left' },
    { item: 'Chills', side: 'right' },
    { item: 'Red face', side: 'left' },
    { item: 'Pale skin', side: 'right' },
    { item: 'Flushed skin', side: 'left' },
    { item: 'Shivering', side: 'right' },
  ],
  closingCaption: 'Doctors looked at symptoms to judge whether an illness seemed hot or cold.',
}

export const HotCold = {
  args: { block: HOT_COLD_BLOCK, subject: 'History' },
}

export const ReducedMotion = {
  args: { block: HOT_COLD_BLOCK, subject: 'History', reducedMotion: true },
}
