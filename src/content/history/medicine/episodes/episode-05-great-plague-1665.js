// Episode 5 — London's year of terror
// Clean runtime split from the legacy bundled Renaissance module.

export const episode = {
  id: 'history-medicine-great-plague-1665',
  subject: 'History',
  number: 5,
  title: "London's year of terror",
  subtitle: 'The Great Plague of London, 1665',
  era: 'c.1665',
  icon: '💀',
  color: '#9A4820',
  colorLight: 'rgba(154,72,32,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    statement: 'By 1665, Renaissance medicine could explain and stop plague.',
    isTrue: false,
    accentWords: ['explain and stop', 'plague'],
    explanation: 'The response was more organised than in 1348, but people still misunderstood what caused plague.',
    bigQuestion: 'Had medicine really improved when plague returned to London?',
    punchline: 'The Great Plague shows organised public action without modern medical understanding.',
  },
  intro: {
    learningGoals: [
      'Describe the Great Plague of 1665',
      'Explain continuity in causes and treatments',
      'Explain how public-health responses became more organised',
      'Compare the Great Plague with the Black Death',
    ],
  },
  outcomes: {
    intro: 'You will compare the Black Death with the Great Plague to judge change and continuity.',
    bullets: [
      'Recall medieval plague explanations',
      'Understand what happened in London in 1665',
      'Explain why responses were more organised but still not modern',
      'Practise comparison language for exam answers',
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'Plague returns to the capital', description: 'Recall the Black Death and set up 1665.', screenIndex: 0 },
    { id: 'part-2', title: 'London under infection', description: 'Scale, fear and Bills of Mortality.', screenIndex: 2 },
    { id: 'part-3', title: 'Old explanations, new city', description: 'Miasma, sin and astrology continued.', screenIndex: 4 },
    { id: 'part-4', title: 'Shut the door and mark the house', description: 'Public-health measures and their limits.', screenIndex: 6 },
    { id: 'part-5', title: 'More organised, still not modern', description: 'Change and continuity judgement.', screenIndex: 8 },
    { id: 'part-6', title: 'Exam prep: compare two plagues', description: 'Similarity and difference practice.', screenIndex: 10 },
  ],
  screens: [
    {
      type: 'priorKnowledgeRecall',
      chapterTitle: 'The Black Death and Renaissance medicine',
      recallPrompts: ['Black Death', 'Miasma', 'God and sin', 'Renaissance change'],
      backgroundImage: '/headers/history-medicine-black-death.png',
      sourceContent: 'In 1348 people explained plague through miasma, God’s punishment and astrology. Treatments and prevention included prayer, cleaning bad smells, carrying herbs and avoiding infected places. Renaissance medicine improved anatomy and some methods, but it had not discovered germ theory.',
      concepts: [
        { tag: 'black-death', label: 'Black Death' },
        { tag: 'miasma', label: 'Miasma' },
        { tag: 'god-punishment', label: 'God and sin' },
        { tag: 'renaissance-change', label: 'Renaissance change' },
      ],
    },
    {
      type: 'visualNarrative',
      stage: 'Return of plague',
      tag: 'great-plague',
      label: 'The Great Plague, 1665',
      beats: [
        {
          image: '/headers/history-medicine-london-terror.png',
          imagePosition: 'center center',
          imageFilter: 'brightness(0.85) saturate(0.7)',
          label: 'London, 1665',
          headline: 'Despite everything,\nthe plague returned.',
          body: 'More than 300 years after the Black Death, London faced plague again.',
        },
        {
          image: '/headers/history-medicine-london-terror.png',
          imagePosition: 'center 30%',
          imageOpacity: 0.55,
          facts: [
            'The Great Plague killed around 100,000 people in London.',
            'People still blamed bad air, sin and the stars.',
            'The response was more organised than in 1348.',
            'Medicine still could not explain the real cause.',
          ],
          conclusion: 'The key comparison is simple: better organisation, weak medical understanding.',
        },
      ],
    },
    {
      type: 'quickRecall',
      stage: 'Return of plague',
      label: 'Before 1665',
      questions: [
        {
          type: 'choice',
          question: 'Which explanation for plague continued from medieval times?',
          options: ['Miasma', 'Germ theory', 'DNA', 'Antibiotics'],
          correct: 0,
          explanation: 'Many people still blamed miasma, or bad air, in 1665.',
        },
        {
          type: 'choice',
          question: 'What had Renaissance medicine improved most before 1665?',
          options: ['Knowledge of the body', 'Cures for plague', 'Vaccination', 'Antibiotics'],
          correct: 0,
          explanation: 'Vesalius and Harvey taught more about the body. They did not cure plague.',
        },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'London under infection',
      label: 'How London watched death rise',
      steps: [
        {
          mainText: 'Death bills counted deaths each week.',
          supportText: 'They made the scale of plague visible and helped officials track the crisis.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
        {
          mainText: 'Crowded streets helped disease spread quickly.',
          supportText: 'People did not know about bacteria or fleas, so they could not target the real cause.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
        {
          mainText: 'Fear made old explanations feel convincing.',
          supportText: 'Bad smells, sin and astrology still seemed logical without germ theory.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
      ],
    },
    {
      type: 'matchingTask',
      stage: 'Explanations',
      tag: 'plague-explanations',
      label: 'Old explanations',
      subject: 'History',
      title: 'Match the belief to the response',
      instruction: 'Connect each explanation to what people did because of it.',
      weakAreaCategory: 'Great Plague explanations',
      backgroundImage: '/headers/history-medicine-london-terror.png',
      pairs: [
        { id: 'miasma', term: 'Miasma', answer: 'Clean streets, light fires or carry herbs to fight bad air.', weakGroup: 'Causes' },
        { id: 'god', term: 'God’s punishment', answer: 'Pray, repent or ask for mercy.', weakGroup: 'Causes' },
        { id: 'astrology', term: 'Planet alignment', answer: 'Blame the stars for making plague more likely.', weakGroup: 'Causes' },
        { id: 'no-germ-theory', term: 'No germ theory', answer: 'People could not target bacteria, fleas or rats accurately.', weakGroup: 'Limits' },
      ],
    },
    {
      type: 'quickRecall',
      stage: 'Explanations',
      label: 'Causes check',
      questions: [
        {
          type: 'choice',
          question: 'Why were 1665 explanations still limited?',
          options: ['People did not know germ theory', 'Doctors had antibiotics', 'Bills of Mortality cured disease', 'Vesalius discovered plague bacteria'],
          correct: 0,
          explanation: 'People did not know germ theory. They blamed bad air, God and stars.',
        },
        {
          type: 'choice',
          question: 'Which phrase best describes medical understanding in 1665?',
          options: ['Still wrong about plague causes', 'Fully modern', 'Based on vaccination', 'Based on antibiotics'],
          correct: 0,
          explanation: 'The response was more organised, but causes were still misunderstood.',
        },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Public response',
      label: 'Shut the door',
      steps: [
        {
          mainText: 'Infected houses were shut up and marked.',
          supportText: 'Watchmen guarded doors so people inside could not leave and spread disease.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
        {
          mainText: 'Searchers inspected bodies and officials recorded deaths.',
          supportText: 'This was more organised than medieval responses, even though it could be harsh and inaccurate.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
        {
          mainText: 'People cleaned streets, lit fires and killed cats and dogs.',
          supportText: 'Some actions aimed at bad air. Killing animals was a mistake because rats and fleas spread plague.',
          backgroundImage: '/headers/history-medicine-london-terror.png',
        },
      ],
    },
    {
      type: 'matchingTask',
      stage: 'Public response',
      label: 'City orders',
      subject: 'History',
      title: 'Which response shows organisation?',
      instruction: 'Match each public-health action to what it was meant to do.',
      weakAreaCategory: 'Great Plague public health',
      backgroundImage: '/headers/history-medicine-london-terror.png',
      pairs: [
        { id: 'shut-houses', term: 'Shut up houses', answer: 'Stop infected households mixing with others.', weakGroup: 'Government' },
        { id: 'watchmen', term: 'Watchmen', answer: 'Guard doors and enforce quarantine.', weakGroup: 'Government' },
        { id: 'searchers', term: 'Searchers', answer: 'Inspect the dead and report plague deaths.', weakGroup: 'Government' },
        { id: 'street-cleaning', term: 'Street cleaning and fires', answer: 'Try to remove or purify bad air.', weakGroup: 'Miasma' },
      ],
    },
    {
      type: 'naturalSupernaturalSwipe',
      stage: 'Judgement',
      tag: 'plague-comparison',
      label: '1348 vs 1665',
      columns: [
        { label: 'Changed by 1665', color: '#9A4820', colorRgb: '154,72,32', bg: 'rgba(154,72,32,.07)' },
        { label: 'Still similar', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
      ],
      items: [
        { label: 'Death bills counted deaths', col: 0, explanation: 'Officials tracked the crisis better.' },
        { label: 'Watchmen guarded houses', col: 0, explanation: 'Government acted in a more organised way.' },
        { label: 'People blamed miasma', col: 1, explanation: 'Bad air was still a major explanation.' },
        { label: 'People prayed', col: 1, explanation: 'Religious ideas continued.' },
        { label: 'No germ theory', col: 1, explanation: 'The real cause was still unknown.' },
      ],
      explanation: 'The Great Plague shows better public action, but not modern medicine.',
    },
    {
      type: 'quickRecall',
      stage: 'Judgement',
      label: 'Great Plague retrieval',
      questions: [
        {
          type: 'choice',
          question: 'What changed most between 1348 and 1665?',
          options: ['Government organisation', 'Knowledge of bacteria', 'Use of antibiotics', 'Vaccination against plague'],
          correct: 0,
          explanation: 'Government acted in a more organised way in 1665.',
        },
        {
          type: 'choice',
          question: 'What stayed similar?',
          options: ['Belief in miasma and religious causes', 'Use of germ theory', 'Modern hospitals', 'Antibiotic treatment'],
          correct: 0,
          explanation: 'People still blamed bad air and God’s punishment.',
        },
        {
          type: 'choice',
          question: 'What is the best judgement about 1665?',
          options: ['More organised, still not medically modern', 'Fully modern medicine', 'No change at all', 'Germ theory in action'],
          correct: 0,
          explanation: 'In 1665, public action improved before people knew the real cause.',
        },
      ],
    },
    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'Compare two plagues',
      examinerExplains: {
        opening: 'Great Plague answers compare two outbreaks.',
        tips: [
          {
            heading: 'Say what was similar',
            body: 'People in both years blamed bad air and God.',
          },
          {
            heading: 'Say what changed',
            body: 'In 1665, officials used watchmen and death records.',
          },
          {
            heading: 'Keep the judgement clear',
            body: 'Public action improved. Medical ideas stayed weak.',
          },
        ],
        closing: 'Compare beliefs and actions.',
      },
    },
  ],
}

export default episode
