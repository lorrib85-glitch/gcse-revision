// Episode 4 — The man who proved everyone wrong
// Clean runtime split from the legacy bundled Renaissance module.

export const episode = {
  id: 'history-medicine-harvey-pare-renaissance-method',
  subject: 'History',
  number: 4,
  title: 'The man who proved everyone wrong',
  subtitle: 'Harvey, Paré and Renaissance method',
  era: 'c.1537–c.1628',
  icon: '🫀',
  color: '#C47828',
  colorLight: 'rgba(196,120,40,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    statement: 'Harvey’s discovery immediately ended bloodletting.',
    isTrue: false,
    accentWords: ['immediately ended', 'bloodletting'],
    explanation: 'Harvey proved blood circulates, but doctors still did not understand what blood did. Old treatments continued.',
    bigQuestion: 'How did Renaissance doctors use evidence to challenge dangerous old ideas?',
    punchline: 'Harvey changed understanding of the body. Paré shows the same evidence-led method at work in surgery.',
  },
  intro: {
    learningGoals: [
      'Explain Galen’s old model of blood',
      'Describe how Harvey proved circulation',
      'Explain how Paré used observation to improve surgery',
      'Judge why Renaissance discoveries had limited immediate impact',
    ],
  },
  outcomes: {
    intro: 'You will see how Harvey and Paré challenged old ideas with evidence.',
    bullets: [
      'Understand the old Galenic blood model',
      'Trace Harvey’s evidence chain',
      'Use Paré as supporting evidence of Renaissance method',
      'Explain why treatment changed slowly',
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'A body full of questions', description: 'Recall Vesalius and set up Galen’s blood model.', screenIndex: 0 },
    { id: 'part-2', title: 'The old blood story', description: 'What Galen taught about blood.', screenIndex: 1 },
    { id: 'part-3', title: 'Harvey follows the evidence', description: 'Circulation, valves and calculation.', screenIndex: 3 },
    { id: 'part-4', title: 'Paré tests tradition', description: 'Observation and surgery.', screenIndex: 6 },
    { id: 'part-5', title: 'Discovery before treatment', description: 'Significance and limits.', screenIndex: 8 },
    { id: 'part-6', title: 'Exam prep: proving Galen wrong', description: 'Exam traps and evidence chains.', screenIndex: 10 },
  ],
  screens: [
    {
      type: 'priorKnowledgeRecall',
      chapterTitle: 'Vesalius and Galen',
      recallPrompts: ['Galen', 'Vesalius', 'Observation', 'Authority'],
      backgroundImage: '/headers/history-medicine-renaissance.png',
      sourceContent: 'Vesalius had shown that Galen could be wrong about anatomy. He used human dissection and observation to challenge old authority. Harvey continued that Renaissance method by testing Galen’s ideas about blood.',
      concepts: [
        { tag: 'galen', label: 'Galen' },
        { tag: 'vesalius', label: 'Vesalius' },
        { tag: 'observation', label: 'Observation' },
        { tag: 'authority', label: 'Ancient authority' },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Old blood story',
      label: 'Galen’s blood story',
      steps: [
        {
          mainText: 'Galen taught that the liver made new blood, which the body then used up.',
          supportText: 'If blood was constantly made and used, bloodletting seemed logical.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'He also believed blood crossed through invisible pores in the heart septum.',
          supportText: 'This fitted his system, but it was not based on accurate human evidence.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'Harvey tested the model instead of just repeating it.',
          supportText: 'That is why this episode is about evidence, not just a famous name.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
      ],
    },
    {
      type: 'quickRecall',
      stage: 'Old blood story',
      label: 'Old model check',
      questions: [
        {
          type: 'choice',
          question: 'What did Galen think happened to blood?',
          options: ['The liver made it and the body used it up', 'It carried germs', 'It was pumped in a closed circuit', 'It was made in the lungs'],
          correct: 0,
          explanation: 'Galen believed blood was made in the liver and used up by the body.',
        },
        {
          type: 'choice',
          question: 'Why did this help justify bloodletting?',
          options: ['Removing blood seemed harmless if new blood was always made', 'It killed bacteria', 'It repaired valves', 'It stopped plague fleas'],
          correct: 0,
          explanation: 'If the body made new blood all the time, removing some seemed sensible.',
        },
      ],
    },
    {
      type: 'keyFigureReveal',
      stage: 'Harvey',
      tag: 'harvey',
      label: 'William Harvey',
      portrait: '/headers/history-medicine-germ-bridge.png',
      name: 'William Harvey',
      role: 'Physician and anatomist',
      sections: [
        {
          title: 'The problem with Galen',
          icon: 'ancient-figure',
          lines: [
            'Galen claimed the liver constantly produced new blood, which the body used up.',
            'This made bloodletting seem logical.',
          ],
        },
        {
          title: 'Harvey’s calculation',
          icon: 'knowledge',
          lines: [
            'Harvey calculated the amount of blood moving through the body.',
            'The volume was far too large to be freshly produced each day.',
          ],
        },
        {
          title: 'De Motu Cordis',
          icon: 'medicine',
          lines: [
            'In 1628 Harvey published his work on the motion of the heart and blood.',
            'He showed the heart acts as a pump and blood circulates continuously.',
          ],
        },
        {
          title: 'The key limitation',
          icon: 'legacy',
          lines: [
            'Harvey could not explain what blood actually does.',
            'Doctors therefore had no immediate reason to abandon old treatments.',
          ],
        },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Harvey',
      label: 'The evidence chain',
      steps: [
        {
          mainText: 'The heart worked like a pump.',
          supportText: 'Harvey watched, dissected and tested rather than accepting the old model.',
          backgroundImage: '/headers/history-medicine-man-proved-wrong.png',
        },
        {
          mainText: 'Valves showed blood flowed one way.',
          supportText: 'One-way valves made more sense if blood circulated around the body.',
          backgroundImage: '/headers/history-medicine-man-proved-wrong.png',
        },
        {
          mainText: 'The amount of blood made Galen’s model impossible.',
          supportText: 'Too much blood moved through the body for the liver to keep making it from scratch.',
          backgroundImage: '/headers/history-medicine-man-proved-wrong.png',
        },
      ],
    },
    {
      type: 'matchingTask',
      stage: 'Harvey',
      label: 'Evidence to conclusion',
      subject: 'History',
      title: 'Match Harvey’s evidence',
      instruction: 'Connect each piece of evidence to the conclusion it supported.',
      weakAreaCategory: 'Harvey circulation evidence',
      backgroundImage: '/headers/history-medicine-man-proved-wrong.png',
      pairs: [
        { id: 'heart-pump', term: 'Heart contracts strongly', answer: 'The heart pushes blood like a pump.', weakGroup: 'Harvey' },
        { id: 'vein-valves', term: 'Valves point one way', answer: 'Blood flows in one direction.', weakGroup: 'Harvey' },
        { id: 'blood-volume', term: 'Too much blood moves each hour', answer: 'The liver cannot be making it all from new.', weakGroup: 'Harvey' },
        { id: 'circulation', term: 'Blood returns to the heart', answer: 'Blood circulates around the body.', weakGroup: 'Harvey' },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Paré',
      tag: 'pare',
      label: 'Paré tests tradition',
      steps: [
        {
          mainText: 'Ambroise Paré treated soldiers with gunshot wounds.',
          supportText: 'The traditional treatment was boiling oil, because surgeons believed gunpowder poisoned the wound.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
        {
          mainText: 'When Paré ran out of oil, he used a soothing mixture instead.',
          supportText: 'The next morning those patients were in less pain and recovering better.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
        {
          mainText: 'Paré also tied blood vessels with ligatures instead of burning them shut.',
          supportText: 'He did not make surgery modern, but he showed observation could improve practice.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
      ],
    },
    {
      type: 'matchingTask',
      stage: 'Paré',
      label: 'Two methods, one pattern',
      subject: 'History',
      title: 'Harvey and Paré: what links them?',
      instruction: 'Match each person to the evidence-led method they used.',
      weakAreaCategory: 'Renaissance method',
      backgroundImage: '/headers/history-medicine-renaissance.png',
      pairs: [
        { id: 'harvey-calculation', term: 'Harvey calculated blood volume', answer: 'He used measurement to test Galen’s model.', weakGroup: 'Harvey' },
        { id: 'harvey-valves', term: 'Harvey studied valves', answer: 'He used anatomy to show one-way blood flow.', weakGroup: 'Harvey' },
        { id: 'pare-ointment', term: 'Paré compared wound outcomes', answer: 'He used observation to reject boiling oil.', weakGroup: 'Paré' },
        { id: 'pare-ligatures', term: 'Paré used ligatures', answer: 'He improved surgery but did not end infection.', weakGroup: 'Paré' },
      ],
    },
    {
      type: 'naturalSupernaturalSwipe',
      stage: 'Limits',
      label: 'Breakthrough or limit?',
      columns: [
        { label: 'Breakthrough', color: '#C47828', colorRgb: '196,120,40', bg: 'rgba(196,120,40,.07)' },
        { label: 'Limit', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
      ],
      items: [
        { label: 'Harvey proved blood circulates', col: 0, explanation: 'This overturned Galen’s model of blood movement.' },
        { label: 'Paré rejected boiling oil', col: 0, explanation: 'He used observed outcomes to improve wound treatment.' },
        { label: 'Doctors still used bloodletting', col: 1, explanation: 'Harvey did not immediately change everyday treatments.' },
        { label: 'Infection still killed surgery patients', col: 1, explanation: 'Paré improved surgery, but germ theory did not yet exist.' },
        { label: 'Evidence challenged authority', col: 0, explanation: 'Both men show the Renaissance method at work.' },
      ],
      explanation: 'Harvey and Paré show progress, but not total change.',
    },
    {
      type: 'quickRecall',
      stage: 'Limits',
      label: 'Harvey and Paré retrieval',
      questions: [
        {
          type: 'choice',
          question: 'What did Harvey prove?',
          options: ['Blood circulates around the body', 'Germs cause disease', 'Vaccination prevents smallpox', 'Plague is spread by fleas'],
          correct: 0,
          explanation: 'Harvey proved blood circulates continuously, pumped by the heart.',
        },
        {
          type: 'choice',
          question: 'How does Paré support the Renaissance method story?',
          options: ['He used observed outcomes to challenge tradition', 'He discovered capillaries', 'He founded the NHS', 'He proved miasma was false'],
          correct: 0,
          explanation: 'Paré compared patient outcomes and rejected harmful traditional treatment.',
        },
        {
          type: 'choice',
          question: 'Why did bloodletting continue after Harvey?',
          options: ['He could not explain what blood does', 'The Church burned every copy', 'He proved Galen correct', 'Doctors already knew germ theory'],
          correct: 0,
          explanation: 'Harvey showed blood goes round the body, but doctors did not know its job.',
        },
      ],
    },
    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'Examiner tactics',
      examinerExplains: {
        opening: 'Harvey and Paré show progress and limits.',
        tips: [
          {
            heading: 'Make Harvey the main evidence',
            body: 'Use pump, valves and maths to explain Harvey.',
          },
          {
            heading: 'Use Paré as supporting evidence',
            body: 'Paré observed patients. He used ointment, not boiling oil. He tied vessels, not burned them.',
          },
          {
            heading: 'Always add the limit',
            body: 'Harvey and Paré made progress. Old treatments and infection continued.',
          },
        ],
        closing: 'Best answers show progress and limits.',
      },
    },
  ],
}

export default episode
