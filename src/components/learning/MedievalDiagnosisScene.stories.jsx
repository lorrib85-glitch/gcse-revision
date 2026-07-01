import MedievalDiagnosisScene from './MedievalDiagnosisScene'

export default {
  component: MedievalDiagnosisScene,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const THEORIES = [
  { id: 'god-sin' },
  { id: 'four-humours' },
  { id: 'miasma' },
  { id: 'astrology' },
]

export const Intro = {
  name: 'Intro sequence',
  args: {
    theories: THEORIES,
    completedIds: [],
    playIntro: true,
    onSelectZone: () => {},
  },
}

export const IdleWithProgress = {
  name: 'Idle, two beliefs explored',
  args: {
    theories: THEORIES,
    completedIds: ['god-sin', 'four-humours'],
    playIntro: false,
    onSelectZone: () => {},
  },
}

export const ReducedMotion = {
  name: 'Reduced motion (static fallback)',
  args: {
    theories: THEORIES,
    completedIds: [],
    playIntro: true,
    prefersReducedMotion: true,
    onSelectZone: () => {},
  },
}
