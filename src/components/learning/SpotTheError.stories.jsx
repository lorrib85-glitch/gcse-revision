import SpotTheError from './SpotTheError.jsx'

export default {
  title: 'Learning/SpotTheError',
  component: SpotTheError,
  parameters: { layout: 'fullscreen' },
}

export const Photosynthesis = {
  args: {
    subject: 'Biology',
    onContinue: () => {},
    block: {
      id: 'spot-photosynthesis',
      prompt: 'Find the error in this exam answer.',
      statement: 'Photosynthesis takes place in the mitochondria of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
      errorTarget: 'mitochondria',
      whatWasWrong: 'Photosynthesis happens in the chloroplasts, not the mitochondria. Mitochondria are the site of respiration.',
      correctVersion: 'Photosynthesis takes place in the chloroplasts of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
      keyTerms: ['chloroplast', 'mitochondria', 'respiration'],
      commonTrap: 'Students often confuse the sites of photosynthesis and respiration.',
      examinerNote: 'Naming the correct organelle is worth an easy mark — do not throw it away.',
    },
  },
}
