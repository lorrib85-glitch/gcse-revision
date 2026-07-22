// Episode 3 — The beginning of doubt
// Vesalius and the Medical Renaissance. Clean runtime, rebuilt to the
// confirmed Stage-B content-create brief (12 runtime learning screens).
// Story spine: questioning authority → Vesalius tests Galen against real
// human bodies → human evidence exposes errors → printing spreads the
// evidence → knowledge and method change before treatment.

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
      hint: 'A famous medical book says one thing. The body on the table says another.',
      intro: 'For centuries, doctors trusted Galen. In Padua, Vesalius asked a hard question: what should a doctor trust — the book, or the body?',
      quotes: [
        { role: 'The old rule:', text: 'Trust Galen.' },
        { role: 'The new question:', text: 'Look at the body.' },
      ],
      bulletHeading: 'The tension:',
      items: [
        'Galen had mostly studied animal bodies',
        'universities still treated his books as truth',
        'human dissection let doctors check the old claims',
        'the book and the body did not always agree',
      ],
    },
    statement: 'A doctor can change medicine without finding a new cure.',
    isTrue: true,
    accentWords: ['change medicine', 'without finding a new cure'],
    explanation: 'Vesalius changed how doctors studied the body, even though treatment changed much more slowly.',
    wrongFeedback: 'Think again. You can change what doctors know without curing anything new.',
    correctFeedback: 'Exactly. Better knowledge came first. Better treatment came much later.',
    loadingText: 'Entering the anatomy theatre…',
    bigQuestion: 'When the book and the body disagree, which should a doctor trust?',
    revealHeader: 'The beginning of doubt',
    revealItems: [
      {
        emoji: '📖',
        label: 'Old authority still mattered',
        detail: 'Universities still trusted Galen above all.',
        color: '#D4950A',
        bg: 'rgba(212,149,10,.08)',
      },
      {
        emoji: '👁️',
        label: 'Observation gained power',
        detail: 'Vesalius tested old claims against real bodies.',
        color: '#C47828',
        bg: 'rgba(196,120,40,.08)',
      },
      {
        emoji: '🖨️',
        label: 'Printing spread the doubt',
        detail: 'Accurate drawings could travel far and wide.',
        color: '#B8873A',
        bg: 'rgba(184,135,58,.08)',
      },
    ],
    punchline: 'Renaissance medicine began by changing how doctors knew things — not by curing patients overnight.',
  },
  intro: {
    learningGoals: [
      'Explain why old medical authority became easier to question',
      'Compare how Galen and Vesalius studied the body',
      'Explain how printing spread Vesalius’s evidence',
      'Judge why knowledge changed faster than treatment',
    ],
  },
  outcomes: {
    intro: 'You will see how Vesalius began to challenge old medical authority.',
    bullets: [
      'Explain why old authority became easier to question',
      'Compare how Galen and Vesalius studied the body',
      'Explain how printing spread the new evidence',
      'Judge why knowledge changed faster than treatment',
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'Old certainties start to crack', description: 'Recall Galen and the old authority.', screenIndex: 0 },
    { id: 'part-2', title: 'Why questioning became possible', description: 'Renaissance conditions for change.', screenIndex: 1 },
    { id: 'part-3', title: 'Vesalius looks for himself', description: 'Human dissection and Galen’s errors.', screenIndex: 3 },
    { id: 'part-4', title: 'The evidence travels', description: 'Illustration, the 1543 book and printing.', screenIndex: 6 },
    { id: 'part-5', title: 'Knowledge changes before treatment', description: 'Change, continuity and misconceptions.', screenIndex: 8 },
    { id: 'part-6', title: 'Exam prep: why could Vesalius challenge Galen?', description: 'Examiner teaching and assessed answer.', screenIndex: 10 },
  ],
  screens: [
    // ── Screen 0 — Prior knowledge recall ───────────────────────────────
    {
      type: 'priorKnowledgeRecall',
      stage: 'Old certainties',
      label: 'What came before',
      chapterTitle: 'The old certainties Vesalius would test',
      recallPrompts: ['Galen', 'Four humours', 'Church', 'Treatments'],
      backgroundImage: '/headers/history-medicine-through-time.png',
      sourceContent: `For centuries, doctors trusted Galen. His books were taught in universities. The Church helped keep his ideas alive. The four humours explained illness as an imbalance in the body. Bloodletting and purging tried to bring the humours back into balance. These ideas lasted a very long time. But lasting a long time did not make them correct.`,
      concepts: [
        { tag: 'galen', label: 'Galen' },
        { tag: 'four-humours', label: 'Four humours' },
        { tag: 'church-role', label: 'Church authority' },
        { tag: 'bloodletting', label: 'Bloodletting and purging' },
      ],
    },

    // ── Screen 1 — Why questioning became possible (teach) ──────────────
    {
      type: 'conceptReveal',
      stage: 'Changing authority',
      label: 'Why questioning became possible',
      steps: [
        {
          mainText: 'The Renaissance was a “rebirth” of learning.',
          supportText: 'Old books were still respected. But people now wanted to test them, not just trust them.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
        {
          mainText: 'Humanism told people to use reason and study the world for themselves.',
          supportText: 'This made careful observation matter more. Blind trust in old books felt less safe.',
          backgroundImage: '/headers/history-medicine-through-time.png',
        },
        {
          mainText: 'The Reformation weakened the Church’s grip on learning.',
          supportText: 'That left more room to question old ideas. Religion did not vanish. Its control simply loosened.',
          backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        },
        {
          mainText: 'Universities now held dissection in public anatomy theatres.',
          supportText: 'Doctors and students could watch a real body. They could check old claims against what they saw.',
          backgroundImage: '/headers/history-medicine-renaissance.png',
        },
      ],
    },

    // ── Screen 2 — Conditions for change retrieval (assessed) ───────────
    {
      type: 'quickRecall',
      stage: 'Changing authority',
      label: 'Conditions check',
      questions: [
        {
          type: 'choice',
          question: 'Why did anatomy theatres matter?',
          options: [
            'Doctors could compare old claims with a real body',
            'They proved that germs cause disease',
            'They ended the four humours at once',
            'They made surgery painless',
          ],
          correct: 0,
          explanation: 'People could now check Galen against what they saw in a real body.',
        },
        {
          type: 'choice',
          question: 'How did humanism help new medical ideas?',
          options: [
            'It encouraged reason, questioning and direct study',
            'It banned all religion',
            'It proved Galen was right',
            'It stopped dissection',
          ],
          correct: 0,
          explanation: 'Humanism pushed people to study the world and test old claims.',
        },
        {
          type: 'choice',
          question: 'What is the most accurate effect of the Reformation?',
          options: [
            'It weakened Church control but did not end religion',
            'It ended religion across Europe',
            'It proved the four humours',
            'It created the printing press',
          ],
          correct: 0,
          explanation: 'Church power over learning weakened. Religion still stayed important.',
        },
      ],
    },

    // ── Screen 3 — Meet Vesalius (introduce figure) ─────────────────────
    {
      type: 'keyFigureReveal',
      stage: 'Vesalius',
      tag: 'vesalius',
      label: 'Vesalius',
      portrait: '/images/vesalius-1543.png',
      name: 'Andreas Vesalius',
      role: 'Renaissance anatomist',
      sections: [
        {
          title: 'Who was he?',
          icon: 'ancient-figure',
          lines: [
            'Vesalius was a doctor from Flanders.',
            'He worked in Renaissance Italy, including at Padua.',
          ],
        },
        {
          title: 'What did he do?',
          icon: 'knowledge',
          lines: [
            'He carried out human dissection himself.',
            'He compared old descriptions with real human bodies.',
          ],
        },
        {
          title: 'The book, 1543',
          icon: 'medicine',
          lines: [
            'In 1543 he published On the Fabric of the Human Body.',
            'It used detailed drawings to show the human body.',
          ],
        },
        {
          title: 'Why remember him?',
          icon: 'legacy',
          lines: [
            'He proved that even trusted authority could be corrected by evidence.',
            'His biggest early impact was on knowledge, not treatment.',
          ],
        },
      ],
    },

    // ── Screen 4 — Galen and Vesalius comparison (KEEP: people variant) ──
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

    // ── Screen 5 — Vesalius retrieval (assessed) ────────────────────────
    {
      type: 'quickRecall',
      stage: 'Vesalius',
      label: 'Vesalius retrieval',
      questions: [
        {
          type: 'choice',
          question: 'Why did Galen make some mistakes about human anatomy?',
          options: [
            'He relied mainly on animal dissection',
            'He never studied the body',
            'He copied Vesalius',
            'He used a microscope',
          ],
          correct: 0,
          explanation: 'Galen mostly used animal bodies, so some human details were wrong.',
        },
        {
          type: 'choice',
          question: 'Which statement matches one of Vesalius’s findings?',
          options: [
            'The human jaw is one bone',
            'The human jaw has two bones',
            'Men have fewer ribs than women',
            'The breastbone has seven parts',
          ],
          correct: 0,
          explanation: 'Vesalius showed the human jaw is a single bone, not two.',
        },
        {
          type: 'choice',
          question: 'What did Vesalius publish in 1543?',
          options: [
            'On the Fabric of the Human Body',
            'A theory of germs',
            'The four humours',
            'A cure for the plague',
          ],
          correct: 0,
          explanation: 'His 1543 book set out human anatomy with detailed drawings.',
        },
        {
          type: 'choice',
          question: 'What is the best judgement about Vesalius?',
          options: [
            'He changed knowledge and method more than treatment',
            'He cured most diseases',
            'He ended the four humours',
            'He discovered germs',
          ],
          correct: 0,
          explanation: 'Vesalius changed how doctors found knowledge. Treatment changed slowly.',
        },
      ],
    },

    // ── Screen 6 — How the evidence travelled (teach) ───────────────────
    {
      type: 'timelineChain',
      variant: 'reveal',
      stage: 'Printing',
      tag: 'printing-press',
      label: 'The evidence travels',
      title: 'The evidence travels',
      intro: "How Vesalius's challenge to Galen reached doctors across Europe, step by step.",
      steps: [
        { id: 'body', statement: 'The body', detail: 'Human dissection gave Vesalius direct evidence about the human body.' },
        { id: 'drawing', statement: 'The drawing', detail: 'Detailed drawings recorded exactly what he had seen.' },
        { id: 'book', statement: 'The book', detail: 'In 1543, one book brought the drawings and explanations together.' },
        { id: 'press', statement: 'The printing press', detail: 'Printing made many exact copies of the book and its images.' },
        { id: 'compare', statement: 'Doctors across Europe could now compare Galen with human evidence.' },
        { id: 'harder', statement: 'His challenge became far harder to ignore.' },
      ],
      takeaway: 'Dissection made the evidence.\nPrinting gave it reach.',
    },

    // ── Screen 7 — Why could Vesalius challenge Galen? (apply/judgement) ─
    {
      type: 'factorWeb',
      stage: 'Printing',
      label: 'Factor web',
      title: 'Why could Vesalius challenge Galen?',
      instruction: 'Explore each factor. Then decide which mattered most.',
      mode: 'causes',
      centreLabel: 'Vesalius',
      centreImage: '/images/vesalius-factorweb-portrait.webp',
      centreImageAlt: 'Portrait of the Renaissance anatomist Andreas Vesalius',
      factors: [
        {
          id: 'vesalius',
          title: 'Vesalius himself',
          subtitle: 'Skill and nerve',
          whatItMeans: 'Vesalius had the skill to dissect, compare and publish.',
          whyItMattered: 'New chances only mattered because one person used them.',
          linkedFactor: 'His skill and nerve turned those chances into a real challenge.',
        },
        {
          id: 'printing',
          title: 'Printing',
          subtitle: 'Wider reach',
          whatItMeans: 'Printing spread exact copies of the book and drawings.',
          whyItMattered: 'More doctors could study and test the evidence.',
          linkedFactor: 'Printing carried the challenge far beyond one city.',
        },
        {
          id: 'reformation',
          title: 'Reformation',
          subtitle: 'Weaker Church control',
          whatItMeans: 'The Reformation weakened Church control over learning.',
          whyItMattered: 'Old power felt less certain. Yet faith stayed strong.',
          linkedFactor: 'Looser control left more room to question Galen.',
        },
        {
          id: 'human-dissection',
          title: 'Human dissection',
          subtitle: 'Better evidence',
          whatItMeans: 'Human bodies gave better evidence than animal bodies.',
          whyItMattered: 'He could test Galen’s claims against a real human body.',
          linkedFactor: 'Dissection gave Vesalius the proof he needed.',
        },
        {
          id: 'anatomy-theatres',
          title: 'Anatomy theatres',
          subtitle: 'Watched in public',
          whatItMeans: 'Public dissection made watching part of study.',
          whyItMattered: 'More doctors could see the evidence for themselves.',
          linkedFactor: 'They helped make real evidence normal to watch.',
        },
        {
          id: 'humanism',
          title: 'Humanism',
          subtitle: 'Reason and study',
          whatItMeans: 'Humanism valued reason, questions and direct study.',
          whyItMattered: 'Learned people grew more willing to test old ideas.',
          linkedFactor: 'This mood made it easier to accept new ideas.',
        },
      ],
      judgementTitle: 'Which factor mattered most?',
      judgementInstruction: 'Choose one factor, then explain why it helped Vesalius challenge Galen.',
      judgementPrompt: 'Use precise evidence. Explain why your factor mattered and how it linked to another factor.',
      thinkingTip: 'Strong answers do not just list factors. They explain how each one helped. Then they judge which mattered most.',
    },

    // ── Screen 8 — What changed and what continued? (classify) ──────────
    {
      stage: 'Knowledge before cures',
      label: 'What changed and what continued?',
      kicker: 'Change and continuity',
      heading: 'Did this change, or did it continue?',
      sub: 'Sort each one into the right column.',
      blocks: [
        {
          type: 'colsort',
          columns: [
            { label: 'Changed', color: '#D4950A', bg: 'rgba(212,149,10,.07)' },
            { label: 'Continued', color: '#A89070', bg: 'rgba(168,144,112,.07)' },
          ],
          items: [
            { label: 'Human anatomy became more accurate', col: 0, explanation: 'Vesalius corrected Galen using real human bodies.' },
            { label: 'Observation could challenge ancient books', col: 0, explanation: 'Doctors could now trust what they saw.' },
            { label: 'Printed diagrams spread new evidence', col: 0, explanation: 'Printing carried accurate drawings across Europe.' },
            { label: 'Galen’s authority began to weaken', col: 0, explanation: 'His word was no longer the final answer.' },
            { label: 'The four humours still guided treatment', col: 1, explanation: 'Doctors still explained illness as imbalance.' },
            { label: 'Bloodletting and purging continued', col: 1, explanation: 'Everyday treatment barely changed.' },
            { label: 'Many doctors still taught Galen', col: 1, explanation: 'His ideas stayed in the classroom for years.' },
            { label: 'Better anatomy had not made new cures', col: 1, explanation: 'Knowing the body did not yet cure it.' },
          ],
          explanation: 'Vesalius changed knowledge and method. Everyday treatment changed much more slowly.',
        },
      ],
    },

    // ── Screen 9 — Misconception repair (exam-technique) ────────────────
    {
      stage: 'Knowledge before cures',
      label: 'Spot the trap',
      kicker: 'Common traps',
      heading: 'Four claims. Which are false?',
      sub: 'Each one sounds right. Look closely before you decide.',
      blocks: [
        {
          type: 'misconceptionCheck',
          id: 'vesalius-misconceptions',
          statements: [
            {
              statement: 'Vesalius immediately changed how patients were treated.',
              answer: false,
              reveal: 'He improved knowledge of the body. Bloodletting, purging and humoral treatments still continued.',
            },
            {
              statement: 'Vesalius proved that everything Galen taught was wrong.',
              answer: false,
              reveal: 'He corrected many anatomy errors. He still accepted some of Galen’s ideas, including the four humours.',
            },
            {
              statement: 'The Renaissance ended religious influence on medicine.',
              answer: false,
              reveal: 'Church control weakened. Religion stayed important in society and in medicine.',
            },
            {
              statement: 'Printing created Vesalius’s evidence.',
              answer: false,
              reveal: 'Human dissection produced the evidence. Printing only helped it spread.',
            },
          ],
        },
      ],
    },

    // ── Screen 10 — Examiner explains (exam-technique, passive) ──────────
    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'What the examiner wants',
      examinerExplains: {
        opening: 'This 12-mark question asks you to explain why Vesalius could challenge Galen.',
        tips: [
          {
            heading: 'Build a chain',
            body: 'Name a factor. Add precise evidence. Then explain how it made the challenge possible.',
          },
          {
            heading: 'Reason one: human dissection',
            body: 'Vesalius studied real human bodies, not just animals. He could compare Galen with the human body. He could show errors, such as the jaw being one bone.',
          },
          {
            heading: 'Reason two: printing',
            body: 'His 1543 book and drawings could be copied and shared widely. More doctors could compare Galen with his evidence. The errors became harder to ignore.',
          },
          {
            heading: 'Avoid the traps',
            body: 'Do not just list factors. Do not stop at a fact. Do not say treatment improved straight away.',
          },
        ],
        closing: 'Develop two reasons. Explain how each one helped.',
      },
    },

    // ── Screen 11 — Guided exam response (assessed exam-technique) ───────
    {
      type: 'guidedExamResponse',
      stage: 'Exam prep',
      label: 'Write it yourself',
      exam: {
        board: 'edexcel',
        subject: 'history',
        topic: 'renaissance-medicine',
        beatText: 'Now write it yourself. Two developed reasons.',
        question: 'Explain why Vesalius was able to challenge Galen’s ideas during the Renaissance. (12 marks)',
        marks: 12,
        sections: [
          {
            label: 'Reason 1',
            starter: 'One reason Vesalius could challenge Galen was...',
            placeholder: '...human dissection let him study real bodies. He could compare Galen’s claims with human anatomy, and show errors such as the jaw being one bone...',
          },
          {
            label: 'Reason 2',
            starter: 'A second reason was...',
            placeholder: '...printing. His 1543 book and drawings could be copied and shared widely. This meant more doctors could compare Galen with his evidence...',
          },
        ],
        markScheme: `Total: 12 marks (Edexcel "Explain why" — AO1 knowledge and AO2 explanation). Reward developed reasons, not a list of factors.

Valid reasons (any two developed fully):
- Human dissection — Vesalius studied real human bodies and could test Galen’s claims directly.
- Anatomy theatres — public dissection made observation a normal part of medical study.
- Humanism — reason and direct study made people more willing to question old authority.
- Reformation / weaker Church control — old authority felt less certain, creating space to challenge Galen.
- Vesalius’s individual skill and confidence — he had the ability to dissect, compare and publish.
- Printing — his 1543 book and drawings could be copied accurately and spread widely.

To reach the top level, an answer must:
- give a clear reason
- add precise supporting evidence (for example, the jaw being one bone, or the 1543 book)
- explain HOW that factor made the challenge possible
- develop two reasons in this way

Common problems to diagnose separately:
- a factor named but not explained
- evidence included but no causal link back to challenging Galen
- vague Renaissance knowledge with no precise detail
- confusing Vesalius with Harvey (circulation belongs to a later chapter)
- overclaiming that treatment improved straight away

Level 1 (1–4): simple statements, factors listed with little explanation.
Level 2 (5–8): some explanation, but at least one reason is undeveloped.
Level 3 (9–12): two developed reasons, each using precise evidence and explaining how it enabled the challenge.`,
      },
    },
  ],
}

export default episode
