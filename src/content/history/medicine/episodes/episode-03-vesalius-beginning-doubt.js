// Episode 3 — The beginning of doubt
// Clean runtime split from the legacy bundled Renaissance module.

export const episode = {
  id: 'history-medicine-vesalius-beginning-doubt',
  subject: 'History',
  number: 3,
  title: 'The beginning of doubt',
  subtitle: 'Vesalius and the Medical Renaissance',
  era: 'c.1500–c.1600',
  icon: '🔬',
  color: '#D4950A',
  colorLight: 'rgba(212,149,10,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    scenario: {
      location: 'Padua, 1543',
      hint: "A medical book says one thing. The body on the table says another.",
      intro: 'For centuries, doctors trusted Galen. Vesalius asked a dangerous question: what if the book was wrong?',
      quotes: [
        { role: 'The old answer:', text: 'Trust Galen.' },
        { role: 'The new challenge:', text: 'Look at the body.' },
      ],
      bulletHeading: 'The problem:',
      items: [
        'Galen had mostly dissected animals',
        'universities still treated his books as authority',
        'human dissection made old mistakes visible',
        'printing helped new evidence travel',
      ],
    },
    statement: 'Vesalius immediately transformed how patients were treated.',
    isTrue: false,
    accentWords: ['immediately transformed', 'treated'],
    explanation: "Vesalius changed medical knowledge and method. Treatments such as bloodletting and purging still continued.",
    wrongFeedback: 'That is the trap: better knowledge did not mean instant cures.',
    correctFeedback: 'Exactly. Vesalius cracked authority, but treatment changed slowly.',
    loadingText: 'Opening the anatomy theatre…',
    bigQuestion: 'How did one anatomist begin to crack 1,300 years of certainty?',
    revealHeader: 'The beginning of doubt',
    revealItems: [
      {
        emoji: '📖',
        label: 'Old authority still mattered',
        detail: 'Galen remained the medical giant universities trusted.',
        color: '#D4950A',
        bg: 'rgba(212,149,10,.08)',
      },
      {
        emoji: '👁️',
        label: 'Observation became powerful',
        detail: 'Vesalius used human dissection to test claims against real bodies.',
        color: '#C47828',
        bg: 'rgba(196,120,40,.08)',
      },
      {
        emoji: '🖨️',
        label: 'Printing spread the challenge',
        detail: 'Accurate drawings could travel far beyond one anatomy theatre.',
        color: '#FF5D73',
        bg: 'rgba(255,93,115,.08)',
      },
    ],
    punchline: 'Renaissance medicine began by changing how doctors knew things, not by curing patients overnight.',
  },
  intro: {
    learningGoals: [
      'Explain why old medical authority began to weaken',
      'Describe how Vesalius challenged Galen through human dissection',
      'Explain why printing helped new anatomical knowledge spread',
      'Judge why knowledge changed faster than treatment',
    ],
  },
  outcomes: {
    intro: 'You will see how Vesalius began the Renaissance challenge to old medical authority.',
    bullets: [
      'Recall the medieval ideas Vesalius challenged',
      'Explain how human dissection exposed Galen’s errors',
      'Show why printing made the challenge harder to ignore',
      'Use the key judgement: knowledge changed before treatment',
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'Old certainties start to crack', description: 'Recall Galen and set up the challenge.', screenIndex: 0 },
    { id: 'part-2', title: 'A new way to question', description: 'Humanism, authority and anatomy theatres.', screenIndex: 2 },
    { id: 'part-3', title: 'Vesalius opens the body', description: 'Dissection, observation and Galen’s errors.', screenIndex: 4 },
    { id: 'part-4', title: 'Printing spreads doubt', description: 'How diagrams and books moved evidence.', screenIndex: 7 },
    { id: 'part-5', title: 'Knowledge before cures', description: 'Change, continuity and treatment limits.', screenIndex: 9 },
    { id: 'part-6', title: 'Exam prep: why ideas changed', description: 'Exam traps and judgement practice.', screenIndex: 10 },
  ],
  screens: [
    {
      type: 'priorKnowledgeRecall',
      chapterTitle: 'Medieval medicine: the authority Vesalius challenged',
      recallPrompts: ['Galen', 'Four humours', 'Church', 'Miasma', 'Treatments'],
      backgroundImage: '/headers/history-medicine-through-time.png',
      sourceContent: `Galen was treated as the great medical authority. Medieval universities taught his books, and the Church helped preserve his ideas. The Four Humours explained illness as imbalance in the body. Treatments such as bloodletting and purging aimed to restore balance. Miasma blamed bad air for disease. These ideas lasted because they fitted the knowledge, religion and technology of the time.`,
      concepts: [
        { tag: 'galen', label: 'Galen' },
        { tag: 'four-humours', label: 'Four humours' },
        { tag: 'church-role', label: 'Church authority' },
        { tag: 'miasma', label: 'Miasma' },
        { tag: 'bloodletting', label: 'Bloodletting and purging' },
      ],
    },
    {
      type: 'visualLearning',
      stage: 'Old authority',
      label: 'The book or the body?',
      scenes: [
        {
          image: '/headers/history-medicine-renaissance.png',
          imagePosition: 'center center',
          headline: 'For centuries,\nthe book won.',
          body: 'Doctors learned Galen’s words before they saw inside a human body.',
        },
        {
          image: '/images/vesalius-1543.png',
          imagePosition: 'center top',
          headline: 'Then Vesalius looked.',
          body: 'Human dissection let him compare Galen’s claims with real anatomy.',
        },
        {
          finalReveal: true,
          headline: 'The doubt began here.',
          body: 'If Galen could be wrong about anatomy, ancient authority could be tested.',
        },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Changing authority',
      label: 'Why questioning became possible',
      steps: [
        {
          mainText: 'Humanism encouraged educated people to ask questions and study the world directly.',
          supportText: 'This did not make everyone modern, but it made blind trust in old books less secure.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'The Reformation weakened the Church’s control over learning in parts of Europe.',
          supportText: 'That mattered because the Church had helped protect Galen’s authority for centuries.',
          backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        },
        {
          mainText: 'Anatomy theatres made observation public.',
          supportText: 'Students and doctors could watch dissection and see whether the old claims matched the body.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
      ],
    },
    {
      type: 'quickRecall',
      stage: 'Changing authority',
      label: 'Authority check',
      questions: [
        {
          type: 'choice',
          question: 'Which old doctor did Vesalius challenge?',
          options: ['Galen', 'Jenner', 'Pasteur', 'Koch'],
          correct: 0,
          explanation: 'Vesalius challenged Galen’s anatomy by comparing it with human bodies.',
        },
        {
          type: 'choice',
          question: 'Why did anatomy theatres matter?',
          options: ['They made direct observation of bodies visible', 'They proved germ theory', 'They cured plague', 'They ended bloodletting immediately'],
          correct: 0,
          explanation: 'Anatomy theatres helped doctors learn from observation, not only from old books.',
        },
      ],
    },
    {
      type: 'keyFigureReveal',
      stage: 'Vesalius',
      tag: 'vesalius',
      label: 'Vesalius',
      portrait: '/images/vesalius-1543.png',
      name: 'Andreas Vesalius',
      role: 'Anatomist',
      sections: [
        {
          title: 'Who was he?',
          icon: 'ancient-figure',
          lines: [
            'A Flemish physician and anatomist working in Renaissance Italy.',
            'Unlike Galen, Vesalius dissected human bodies himself rather than relying on ancient texts or animal dissection.',
          ],
        },
        {
          title: 'De Humani Corporis Fabrica (1543)',
          icon: 'knowledge',
          lines: [
            'A detailed illustrated anatomy textbook based on direct human dissection.',
            'Its drawings helped doctors see the human body more accurately.',
          ],
        },
        {
          title: 'What he found',
          icon: 'medicine',
          lines: [
            'Vesalius corrected over 300 errors in Galen’s work.',
            'Key corrections included the jaw, breastbone and heart septum.',
          ],
        },
        {
          title: 'Why it mattered',
          icon: 'legacy',
          lines: [
            'Vesalius proved direct observation was more reliable than trusting ancient authority.',
            'This became a foundation of Renaissance medical science.',
          ],
        },
      ],
    },
    {
      stage: 'Vesalius',
      label: 'Galen and Vesalius',
      blocks: [
        {
          type: 'theoryCompare',
          variant: 'people',
          title: 'Galen and Vesalius',
          heroImage: '/figures/history/medicine/renaissance/galen-vesalius-hero.webp',
          heroImageAlt: 'Galen in Roman dress before classical ruins and animal anatomy sketches, standing back to back with Vesalius in Renaissance dress beside an anatomical book and a human skeleton',
          leftPerson: {
            name: 'Galen',
            subtitle: 'Ancient Roman doctor',
            image: '/figures/history/medicine/medieval/galen-portrait.png',
            imageAlt: 'Portrait of the ancient Roman doctor Galen',
          },
          rightPerson: {
            name: 'Vesalius',
            subtitle: 'Renaissance anatomist',
            image: '/images/vesalius-1543.png',
            imageAlt: 'Portrait of the Renaissance anatomist Andreas Vesalius',
          },
          comparisons: [
            {
              id: 'evidence-source',
              prompt: 'What did they study?',
              left: 'Relied mainly on animal dissection',
              right: 'Dissected real human bodies himself',
              explanation: 'Human dissection was severely restricted in Galen’s time, so he used animal bodies and assumed some features were the same in humans. Vesalius had greater access to human bodies and could check those claims directly.',
            },
            {
              id: 'method',
              prompt: 'How did they build knowledge?',
              left: 'Used observation, existing theory and animal anatomy',
              right: 'Checked ancient claims against direct human evidence',
              explanation: 'Vesalius did not reject old knowledge simply because it was old. He tested it. When the evidence disagreed with Galen’s books, he trusted what he could observe.',
            },
            {
              id: 'conclusions',
              prompt: 'What did they conclude?',
              rows: [
                { label: 'Jaw',        left: 'The human jaw had two bones',            right: 'The human jaw was one bone' },
                { label: 'Ribs',       left: 'Men had fewer ribs than women',          right: 'Men and women had the same number of ribs' },
                { label: 'Breastbone', left: 'The human breastbone had seven parts',   right: 'The human breastbone had three main parts' },
              ],
              note: 'Vesalius identified around 300 errors in Galen’s anatomical writing.',
            },
            {
              id: 'impact',
              prompt: 'What was their impact?',
              left: 'His books shaped medical teaching for more than a thousand years',
              right: 'He showed that respected authority could be corrected by evidence',
              explanation: 'Vesalius improved knowledge of anatomy, but he did not immediately improve treatment. Doctors still used the Four Humours, bloodletting and purging.',
            },
          ],
          takeaway: 'Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence.',
        },
      ],
    },
    {
      type: 'matchingTask',
      stage: 'Vesalius',
      label: 'Galen or Vesalius?',
      subject: 'History',
      title: 'Match the claim to the evidence',
      instruction: 'Connect each idea to the reason it matters.',
      weakAreaCategory: 'Vesalius and Galen',
      backgroundImage: '/headers/history-medicine-germ-bridge.png',
      pairs: [
        { id: 'animal-dissection', term: 'Galen dissected animals', answer: 'This explains why some of his anatomy was wrong.', weakGroup: 'Galen' },
        { id: 'human-dissection', term: 'Vesalius dissected humans', answer: 'This gave him better evidence about the body.', weakGroup: 'Vesalius' },
        { id: 'printed-book', term: 'Illustrated anatomy book', answer: 'This helped accurate drawings spread to other doctors.', weakGroup: 'Printing' },
        { id: 'treatment-limit', term: 'Bloodletting continued', answer: 'This shows knowledge changed faster than treatment.', weakGroup: 'Continuity' },
      ],
    },
    {
      type: 'conceptReveal',
      stage: 'Printing',
      tag: 'printing-press',
      label: 'How doubt travelled',
      steps: [
        {
          mainText: 'The printing press meant Vesalius’s diagrams could be copied accurately.',
          supportText: 'A doctor did not have to stand in the same anatomy theatre to see the challenge to Galen.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
        {
          mainText: 'Printed books made medical arguments easier to compare.',
          supportText: 'Students could place Galen’s claims next to Vesalius’s drawings and ask which matched the body.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
        {
          mainText: 'Printing changed the speed of doubt.',
          supportText: 'The challenge to authority could travel across Europe faster than manuscript copying allowed.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
      ],
    },
    {
      type: 'naturalSupernaturalSwipe',
      stage: 'Judgement',
      label: 'Knowledge vs treatment',
      columns: [
        { label: 'Changed', color: '#D4950A', colorRgb: '212,149,10', bg: 'rgba(212,149,10,.07)' },
        { label: 'Continued', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
      ],
      items: [
        { label: 'Human anatomy improved', col: 0, explanation: 'Vesalius found Galen’s mistakes in human bodies.' },
        { label: 'Doctors trusted observation more', col: 0, explanation: 'The body could challenge old books.' },
        { label: 'Printed diagrams spread new ideas', col: 0, explanation: 'Printing made accurate anatomy easier to share.' },
        { label: 'Bloodletting and purging continued', col: 1, explanation: 'Most treatments still followed humoral ideas.' },
        { label: 'Galen still mattered', col: 1, explanation: 'Old authority faded slowly.' },
      ],
      explanation: 'Doctors learned more about the body before they found better cures.',
    },
    {
      type: 'quickRecall',
      stage: 'Judgement',
      label: 'Vesalius retrieval',
      questions: [
        {
          type: 'choice',
          question: 'What was Vesalius’s greatest contribution?',
          options: ['He used human dissection to correct anatomy', 'He discovered germs', 'He cured plague', 'He invented vaccination'],
          correct: 0,
          explanation: 'Vesalius showed Galen was wrong about parts of the body.',
        },
        {
          type: 'choice',
          question: 'Why did printing matter to Vesalius’s work?',
          options: ['It spread accurate diagrams and arguments', 'It ended the Four Humours instantly', 'It made surgery painless', 'It discovered capillaries'],
          correct: 0,
          explanation: 'Printing helped new diagrams reach more doctors.',
        },
        {
          type: 'choice',
          question: 'What is the best judgement about Vesalius?',
          options: ['He changed knowledge more than treatment', 'He ended medieval medicine completely', 'He proved germ theory', 'He stopped all bloodletting'],
          correct: 0,
          explanation: 'Vesalius changed anatomy, but old treatments carried on.',
        },
      ],
    },
    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'Examiner tactics',
      examinerExplains: {
        opening: 'Vesalius helps you show what changed and what did not.',
        tips: [
          {
            heading: 'Name the method',
            body: 'He cut open human bodies and checked Galen.',
          },
          {
            heading: 'Name printing',
            body: 'Printed pictures spread the new anatomy.',
          },
          {
            heading: 'Add the limit',
            body: 'Doctors still bled patients after Vesalius.',
          },
        ],
        closing: 'Explain both change and limits.',
      },
    },
  ],
}

export default episode
