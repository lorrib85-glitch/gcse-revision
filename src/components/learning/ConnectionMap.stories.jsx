import ConnectionMap from './ConnectionMap'

export default {
  component: ConnectionMap,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const HISTORY_BLOCK = {
  type: 'connectionMap',
  title: 'The web of medieval belief',
  subtitle: 'How did medieval people explain illness?',
  instruction: 'Tap each belief to explore how it shaped medieval medicine',
  centreLabel: 'Why people got ill',
  nodes: [
    {
      id: 'supernatural',
      label: "God's punishment",
      shortLabel: "God's will",
      explanation: "Many medieval people believed illness was God's punishment for sin. This made prayer, confession and pilgrimage logical treatments — addressing the spiritual cause.",
      retrievalQuestion: 'Why did medieval people think prayer could cure illness?',
      retrievalAnswer: "If illness was God's punishment for sin, prayer and confession addressed the spiritual cause of the disease.",
      examLink: 'Explain why supernatural beliefs limited medical progress in medieval England.',
    },
    {
      id: 'astrology',
      label: 'Stars and planets',
      shortLabel: 'Astrology',
      explanation: 'Astrologers believed celestial movements controlled health. Doctors consulted zodiac charts to time treatments. The Black Death of 1348 was blamed on a conjunction of Saturn, Jupiter and Mars.',
      retrievalQuestion: 'How did astrology influence medical treatment?',
      retrievalAnswer: 'Doctors consulted zodiac charts to decide when to perform bloodletting and other treatments, believing the stars controlled bodily humours.',
    },
    {
      id: 'humours',
      label: 'Four humours',
      shortLabel: 'Humours',
      explanation: "Galen's theory of four humours (blood, phlegm, yellow bile, black bile) dominated medieval medicine. Illness meant the humours were imbalanced. Treatment restored balance through bloodletting, purging or diet.",
      retrievalQuestion: 'Name the four humours.',
      retrievalAnswer: 'Blood, phlegm, yellow bile (choler) and black bile (melancholy).',
      examLink: 'Describe one treatment based on the theory of the four humours.',
    },
    {
      id: 'miasma',
      label: 'Bad air (miasma)',
      shortLabel: 'Bad air',
      explanation: 'Miasma theory held that foul-smelling air caused disease. This led to burning sweet-smelling herbs and aromatics to purify the air — logical within their understanding, even if wrong.',
      retrievalQuestion: 'What did people do to protect themselves from miasma?',
      retrievalAnswer: 'They carried posies of herbs, burned aromatics, and avoided bad smells — thinking sweet air would counteract disease.',
    },
    {
      id: 'galen',
      label: "Galen's authority",
      shortLabel: 'Galen',
      explanation: "The Church endorsed Galen's 2nd-century writings as truth. Medieval doctors who questioned Galen risked punishment. His authority meant medical knowledge was preserved but not tested or updated for 1,000 years.",
      retrievalQuestion: "Why did the Church's support for Galen slow medical progress?",
      retrievalAnswer: "It meant Galen's theories could not be questioned or tested — doctors who challenged his ideas risked punishment from the Church.",
    },
    {
      id: 'experience',
      label: 'Practical experience',
      shortLabel: 'Folk cures',
      explanation: 'Alongside theories, people used practical herbal remedies passed down through generations. Wise women and apothecaries used plants such as willow bark (a natural painkiller) and garlic. This empirical knowledge sometimes worked.',
      retrievalQuestion: 'Why did herbal remedies sometimes work even without germ theory?',
      retrievalAnswer: 'Some plants contain active chemical compounds — willow bark contains salicin, a natural painkiller similar to aspirin.',
    },
  ],
}

export const HistoryDefault = {
  name: 'Medieval causes of disease — History',
  args: { block: HISTORY_BLOCK, subject: 'History', onComplete: () => {} },
}

export const BiologyDefault = {
  name: 'Enzyme factors — Biology',
  args: {
    block: {
      ...HISTORY_BLOCK,
      title: 'Factors affecting enzyme activity',
      subtitle: 'What conditions change how fast enzymes work?',
      instruction: 'Tap each factor to explore how it affects enzymes',
      centreLabel: 'Enzyme rate',
      nodes: HISTORY_BLOCK.nodes.slice(0, 5).map((n, i) => ({
        ...n,
        id: `bio-${i}`,
        label: ['Temperature', 'pH', 'Substrate conc.', 'Enzyme conc.', 'Inhibitors'][i],
        shortLabel: ['Temp', 'pH', 'Substrate', 'Enzyme', 'Inhibitors'][i],
        explanation: 'Example explanation for a Biology enzyme factor.',
      })),
    },
    subject: 'Biology',
    onComplete: () => {},
  },
}
