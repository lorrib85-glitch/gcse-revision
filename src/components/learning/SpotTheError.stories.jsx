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
      statement: 'Photosynthesis takes place in the mitochondria of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
      errorTarget: 'mitochondria',
      whatWasWrong: 'Photosynthesis happens in the chloroplasts, not the mitochondria. Mitochondria are the site of respiration.',
      correctVersion: 'Photosynthesis takes place in the chloroplasts of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
      explanationCriteria: { anyOf: ['chloroplast', 'chloroplasts'], supportingAnyOf: ['mitochondria', 'respiration'] },
      explanationHint: 'Your explanation needs to identify the chloroplast as the site of photosynthesis.',
      correctionAnswer: 'chloroplasts',
      correctionAlternatives: ['chloroplast'],
      missHeading: 'Not quite — compare the two organelles.',
      commonTrap: 'Students often confuse the sites of photosynthesis and respiration.',
      examinerNote: 'Naming the correct organelle is worth an easy mark — do not throw it away.',
    },
  },
}

// Legacy `keyTerms` + `correctVersion` block — proves phase one remains backwards
// compatible and phase two can derive the missing replacement phrase.
export const LegacyContract = {
  args: {
    subject: 'Biology',
    onContinue: () => {},
    block: {
      id: 'spot-bacteria',
      statement: 'Bacterial cells have a nucleus that contains their DNA.',
      errorTarget: 'have a nucleus that contains their DNA',
      whatWasWrong: 'Bacterial cells are prokaryotic — their genetic material is a single DNA loop free in the cytoplasm, not enclosed in a nucleus.',
      correctVersion: 'Bacterial cells do not have a nucleus; their genetic material is a single DNA loop in the cytoplasm.',
      keyTerms: ['prokaryotic', 'nucleus', 'DNA loop', 'plasmids'],
      commonTrap: 'The absence of a nucleus is the defining feature of a bacterial cell.',
      examinerNote: 'Distinguish eukaryotic cells (with a nucleus) from prokaryotic cells (bacteria, without one).',
    },
  },
}
