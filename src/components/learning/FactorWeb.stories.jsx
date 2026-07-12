import FactorWeb from './FactorWeb.jsx'

export default {
  component: FactorWeb,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const VESALIUS_FACTORS = {
  type: 'factorWeb',
  mode: 'causes',
  question: 'Why could Vesalius challenge Galen?',
  instruction: 'Explore each factor. Then decide which mattered most.',
  centreLabel: 'Challenge Galen',
  factors: [
    {
      id: 'vesalius',
      title: 'Vesalius himself',
      subtitle: 'Skill and confidence',
      whatItMeans: 'Vesalius had the skill to dissect, compare and publish.',
      whyItMattered: 'New opportunities only mattered because one person used them.',
      linkedFactor: 'His skill turned new opportunities into a direct challenge to Galen.',
    },
    {
      id: 'human-dissection',
      title: 'Human dissection',
      subtitle: 'Better evidence',
      whatItMeans: 'Human bodies gave Vesalius more accurate evidence than animal bodies.',
      whyItMattered: 'He could test Galen’s claims against real human anatomy.',
      linkedFactor: 'Dissection gave Vesalius the evidence he needed to expose errors.',
    },
    {
      id: 'anatomy-theatres',
      title: 'Anatomy theatres',
      subtitle: 'Evidence in public',
      whatItMeans: 'Public dissections made direct observation part of medical learning.',
      whyItMattered: 'More doctors and students could see the evidence for themselves.',
      linkedFactor: 'They helped make direct observation a normal part of medical study.',
    },
    {
      id: 'humanism',
      title: 'Humanism',
      subtitle: 'Reason and study',
      whatItMeans: 'Humanism encouraged reason, questioning and direct study.',
      whyItMattered: 'Educated people became more willing to test old authority.',
      linkedFactor: 'This made Vesalius’s evidence easier for others to consider seriously.',
    },
    {
      id: 'reformation',
      title: 'Reformation',
      subtitle: 'Weaker control',
      whatItMeans: 'The Reformation weakened some Church control over learning.',
      whyItMattered: 'Established authority became less secure, although religion remained influential.',
      linkedFactor: 'Weaker control created more room to question established medical teaching.',
    },
    {
      id: 'printing',
      title: 'Printing',
      subtitle: 'Wider reach',
      whatItMeans: 'Printing spread consistent copies of Vesalius’s book and drawings.',
      whyItMattered: 'More doctors could examine and debate the evidence.',
      linkedFactor: 'Printing carried the challenge far beyond one anatomy theatre.',
    },
  ],
  taskPrompt: 'Which factor mattered most?',
  judgementInstruction: 'Choose one factor, then explain why it helped Vesalius challenge Galen.',
  judgementPrompt: 'Use precise evidence. Explain why your factor mattered and how it linked to another factor.',
  thinkingTip: 'A strong judgement explains why one factor was more important than the others. It does not just list them.',
}

export const GoldVesaliusCausation = {
  args: {
    block: VESALIUS_FACTORS,
    subject: 'History',
    onContinue: () => {},
  },
}

export const LongFactorLabels = {
  args: {
    block: {
      ...VESALIUS_FACTORS,
      question: 'Why did ideas about the causes of disease change?',
      centreLabel: 'Ideas change',
      factors: [
        { ...VESALIUS_FACTORS.factors[0], title: 'Pasteur’s germ theory', shortTitle: 'Pasteur' },
        { ...VESALIUS_FACTORS.factors[1], title: 'Koch’s scientific research', shortTitle: 'Koch' },
        { ...VESALIUS_FACTORS.factors[2], title: 'Better microscopes', shortTitle: 'Microscopes' },
        { ...VESALIUS_FACTORS.factors[3], title: 'Scientific method' },
        { ...VESALIUS_FACTORS.factors[4], title: 'Communication of ideas', shortTitle: 'Communication' },
        { ...VESALIUS_FACTORS.factors[5], title: 'Problems with old ideas', shortTitle: 'Old ideas' },
      ],
    },
    subject: 'History',
    onContinue: () => {},
  },
}
