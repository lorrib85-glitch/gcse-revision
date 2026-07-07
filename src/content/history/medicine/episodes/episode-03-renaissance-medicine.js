// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.
//
export const episode = {
  id: 'history-medicine-renaissance-medicine',
  subject: 'History',
  number: 3,
  title: 'The beginning of doubt',
  subtitle: 'Medical Renaissance',
  era: 'c.1500–c.1600',
  icon: '🔬',
  color: '#D4950A',
  colorLight: 'rgba(212,149,10,.12)',
  series: 'medicine-through-time',
  recallTags: [],   // not consumed by any app logic — do not add decorative tags
  examTags: [],     // not consumed by any app logic — do not add decorative tags
  assetKeys: [],
  hook: {
    scenario: {
      location: 'Italy, 1543',
      hint: 'A patient is dying. Two doctors can\'t agree on how to treat him.',
      intro: 'A patient is seriously ill. Two doctors disagree.',
      quotes: [
        { role: 'One doctor says:', text: '"Balance the Four Humours."' },
        { role: 'Another says:', text: '"We should dissect the body properly and study anatomy."' },
      ],
      bulletHeading: 'Meanwhile:',
      items: [
        'plague spreads through crowded streets',
        'people still carry flowers against bad air',
        "Galen's textbooks still control universities",
        'Medicine is beginning to change...',
      ],
    },
    statement: 'By the Renaissance, doctors had completely abandoned medieval medical ideas.',
    isTrue: false,
    accentWords: ['completely abandoned', 'medieval medical ideas'],
    explanation: "Renaissance thinkers like Vesalius corrected Galen's errors — but universities kept teaching the same old ideas for decades. Change was real, but it was slow.",
    wrongFeedback: "It feels like that — Vesalius was correcting Galen! But at universities, it was business as usual.",
    correctFeedback: "Exactly. Change happened at the edges. The core stayed medieval for much longer.",
    loadingText: 'The history is more complicated than it looks…',
    bigQuestion: 'So what actually changed — and what stayed the same?',
    revealHeader: 'Change was slow. Very slow.',
    revealItems: [
      {
        emoji: '🔬',
        label: 'Anatomy improved — but treatments didn\'t',
        detail: 'Vesalius corrected 300+ of Galen\'s errors (1543). Harvey proved blood circulates (1628). But doctors still bled patients and used purging. New knowledge, same old cures.',
        color: '#D4950A',
        bg: 'rgba(212,149,10,.08)',
      },
      {
        emoji: '📚',
        label: 'Galen still dominated universities',
        detail: "Medieval ideas weren't swept away overnight. Most physicians still swore by Galen. The printing press spread new ideas — but also spread old ones further.",
        color: '#C47828',
        bg: 'rgba(196,120,40,.08)',
      },
      {
        emoji: '💀',
        label: 'The Great Plague (1665) proved the limits',
        detail: "London lost 100,000 people in one outbreak. Despite all the Renaissance progress, nobody could explain or stop the plague. The tools weren't there yet.",
        color: '#FF5D73',
        bg: 'rgba(255,93,115,.08)',
      },
    ],
    punchline: 'Renaissance medicine changed knowledge, not treatment. This module explains why that gap mattered.',
  },
  intro: {
    learningGoals: [
      'Describe what changed in medicine during the Renaissance',
      'Explain the contributions of Vesalius, Harvey and Paré',
      'Explain why the Great Plague showed the limits of Renaissance medicine',
      'Assess how far the Renaissance was a turning point in the history of medicine',
    ],
  },
  outcomes: {
    intro: "You're about to see how Renaissance thinkers began to challenge old medical ideas that had lasted for centuries.",
    bullets: [
      "Explain what Vesalius discovered — and why the Church didn't like it",
      "Describe what Harvey discovered about blood circulation and why it mattered",
      'Understand why the Plague kept killing even as knowledge improved',
      'See the gap between knowing more and being able to treat better',
    ],
  },

  // TODO: split history-medicine-renaissance-medicine into separate Episode 3, 4 and 5 modules, each with its own stageNavigation.
  stageNavigation: [
    { id: 'part-1', title: 'Old Certainties Start to Crack', description: 'Intro hook, prior recall and roadmap.', screenIndex: 0 },
    { id: 'part-2', title: 'The Renaissance Mindset Shift', description: 'How medieval ideas began to loosen.', screenIndex: 1 },
    { id: 'part-3', title: 'Vesalius Opens the Body', description: 'Vesalius, dissection and challenging Galen.', screenIndex: 4 },
    { id: 'part-4', title: 'Printing Changes the Argument', description: 'Harvey, Paré and spreading new ideas.', screenIndex: 7 },
    { id: 'part-5', title: 'Doubt Without Revolution', description: 'Royal Society, Great Plague and continuity of old ideas.', screenIndex: 10 },
    { id: 'part-6', title: 'Exam Prep: Why Did Ideas Begin to Change?', description: 'Examiner traps, mark-scheme thinking and exam practice.', screenIndex: 14 },
  ],

  screens: [
    {
      type: 'priorKnowledgeRecall',
      chapterTitle: 'Medieval medicine: beliefs and causes of disease',
      recallPrompts: ['People', 'Theories', 'Causes', 'Treatments', 'Church'],
      backgroundImage: '/headers/history-medicine-through-time.png',
      sourceContent: `GCSE History: Medieval Medicine — Beliefs and Causes of Disease (c.1250–c.1500)

Key figures:
Hippocrates (ancient Greek doctor) argued illness had natural causes, not punishment from gods. He promoted observation of symptoms, recording of cases, and logical reasoning. His Four Humours theory said health depended on balance between four bodily fluids: blood, phlegm, yellow bile, and black bile. Imbalance caused disease.

Galen (Roman doctor, c.129–216 AD) built on Hippocrates. He treated gladiators, dissected animals, and wrote medical books copied and taught in universities for over 1,400 years. His Theory of Opposites: treat illness with its opposite quality — a hot, feverish illness with cold remedies; a cold, wet condition with warm, dry treatments. Galen made errors (blood made in liver; heart septum had holes), but the Church backed his authority so he was rarely questioned.

Causes of disease — four main theories:
1. Four Humours: disease caused by imbalance of blood, phlegm, yellow bile, or black bile.
2. God and sin: illness was God's punishment for sin, or a test of faith. Treatments: prayer, confession, repentance, pilgrimage, fasting, visiting holy relics.
3. Miasma: bad air from rotting matter, sewers, marshes caused disease. The smell itself was believed to carry illness.
4. Astrology: planets and zodiac signs influenced the body. Physicians used the Zodiac Man diagram and astrological calendars to time treatments. The Paris Medical Faculty blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in 1345.

Medical practitioners:
- Physician: university-trained, expensive, used Latin, diagnosed via uroscopy (examining urine colour using a jordan flask and urine charts) and astrological charts.
- Barber surgeon: practical tradesman, moderate cost, performed bloodletting (removing blood by cutting a vein or applying leeches), tooth-pulling, and minor surgery.
- Wise woman: no formal training, cheapest option, used herbal remedies and poultices. Most accessible to ordinary people in villages.
- Priest: offered spiritual treatment — prayer, blessing, repentance. Believed illness began with sin.

Treatments:
- Bloodletting: removing blood (by cutting or leeches) to restore humoral balance.
- Purging: inducing vomiting or diarrhoea to expel excess humours.
- Herbal remedies, diet change, rest: cooling foods (cucumber) for fever; dry foods for cold conditions.
- Prayer, pilgrimage, confession, fasting: for illness believed to be caused by God.

The Church's role:
The Church ran hospitals (St Bartholomew's, founded 1123) and copied ancient medical texts in monasteries. It preserved and promoted Galen's work because his ideas of bodily balance fitted Christian views of perfect divine design. The Church discouraged human dissection (belief in bodily resurrection) and made questioning Galen's authority difficult. This slowed medical progress significantly.

The Black Death (1348–49):
Arrived in England in 1348, killing roughly one-third of the population. Blamed on miasma, God's punishment, and planetary alignment. Actual cause: Yersinia pestis bacteria spread by fleas on rats — unknown for another 500 years. Medieval explanations were wrong but internally logical given available knowledge.

Why medieval ideas survived so long:
The Church preserved ancient texts and backed Galen's authority. Without microscopes or germ theory, no better explanation existed. Humoral logic was internally consistent — wrong premises, logical conclusions. Some treatments accidentally helped (rest, fluids, herbal remedies), making the flawed theory seem credible. Multiple explanations coexisted — people believed God, humours, miasma, and astrology simultaneously.`,
      concepts: [
        { tag: 'hippocrates',             label: 'Hippocrates' },
        { tag: 'four-humours',            label: 'Four humours' },
        { tag: 'galen',                   label: 'Galen' },
        { tag: 'theory-of-opposites',     label: 'Theory of Opposites' },
        { tag: 'miasma',                  label: 'Miasma theory' },
        { tag: 'god-punishment',          label: 'God and sin' },
        { tag: 'astrology',               label: 'Astrology and the zodiac man' },
        { tag: 'bloodletting',            label: 'Bloodletting' },
        { tag: 'uroscopy',                label: 'Uroscopy' },
        { tag: 'physician',               label: 'Physician' },
        { tag: 'barber-surgeon',          label: 'Barber surgeon' },
        { tag: 'wise-woman',              label: 'Wise woman' },
        { tag: 'church-role',             label: "Church's role in medicine" },
        { tag: 'black-death',             label: 'The Black Death (1348–49)' },
        { tag: 'supernatural-vs-natural', label: 'Supernatural vs natural causes' },
        { tag: 'herbal-remedies',         label: 'Herbal remedies and diet' },
        { tag: 'why-ideas-survived',      label: 'Why medieval ideas survived so long' },
      ],
    },
    // ── Section 2 — Learning Chunk 1: The Bridge ────────────────────────────

    {
      type: 'visualLearning',
      stage: 'The bridge',
      label: 'Echoes of medieval medicine',
      scenes: [
        {
          image: '/figures/history/medicine/medieval/vl-monks-books.webp',
          imagePosition: 'center top',
          headline: 'Medieval medicine\ndidn\'t disappear.',
          body: 'The Renaissance didn\'t end centuries of medical thinking overnight.',
        },
        {
          image: '/figures/history/medicine/medieval/vl-monks-books.webp',
          imagePosition: 'center 30%',
          headline: 'Language survived.',
          body: '"Melancholy", "phlegmatic", "sanguine", "bilious" — all come from the Four Humours. These words still carry their medieval meaning.',
        },
        {
          image: '/figures/history/medicine/medieval/vl-monks-books.webp',
          imagePosition: 'center 60%',
          headline: 'Remedies survived.',
          body: 'Many herbal treatments used in the medieval period are still in use today. Some have since been proven effective by modern research.',
        },
        {
          finalReveal: true,
          headline: 'But something was\nabout to change.',
          body: 'The idea that disease could be studied, observed, and understood was about to collide with a new way of thinking about the world.',
        },
      ],
    },

    {
      type: 'conceptReveal',
      stage: 'The bridge',
      label: 'A world about to change',
      steps: [
        {
          mainText: 'The Renaissance encouraged artists, thinkers, and scientists to question ancient authority.',
          supportText: 'For centuries, Galen\'s word had been law. Now people asked: what if he was wrong?',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'The printing press (1440s) meant new ideas could spread across Europe in months, not decades.',
          supportText: 'Previously, a single medical manuscript took months to copy by hand. Now a book could reach thousands.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'Renaissance medicine changed knowledge far more than it changed treatment.',
          supportText: 'Doctors were discovering new truths about the body — but patients were still being bled and purged.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
      ],
    },

    {
      type: 'quickRecall',
      stage: 'The bridge',
      label: 'Before we go further',
      questions: [
        {
          type: 'choice',
          question: 'What theory said illness was caused by an imbalance of four bodily fluids?',
          options: ['The Four Humours', 'Miasma theory', 'Astrology', 'Germ theory'],
          correct: 0,
          explanation: 'The Four Humours — blood, phlegm, yellow bile, black bile — underpinned medieval medicine and Galen\'s teaching.',
        },
        {
          type: 'choice',
          question: 'Which ancient authority\'s ideas were still taught in Renaissance universities?',
          options: ['Galen', 'Vesalius', 'Pasteur', 'Harvey'],
          correct: 0,
          explanation: 'Galen\'s texts continued to dominate university medicine well into the Renaissance — even as new evidence emerged.',
        },
        {
          type: 'choice',
          question: 'Why did the Church preserve and promote Galen\'s medical ideas?',
          options: [
            'His idea of bodily balance fitted their view of God\'s perfect design',
            'He was a Christian doctor who referenced the Bible',
            'The Church paid him to write medical textbooks',
            'He was the only doctor who could speak Latin',
          ],
          correct: 0,
          explanation: 'Galen\'s concept of a body in perfect balance reinforced Christian ideas about divine order. The Church gave his authority serious backing.',
        },
      ],
    },

    // ── Section 3 — Learning Chunk 2: Vesalius ──────────────────────────────

    {
      type: 'keyFigureReveal',
      stage: 'Vesalius',
      tag: 'vesalius',
      label: 'Vesalius',
      portrait: '/images/vesalius-1543.png',
      name: 'Andreas Vesalius',
      role: 'Flemish anatomist',
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
            'Published in the same year as Copernicus challenged the Earth-centred universe.',
            'A detailed illustrated anatomy textbook based on direct human dissection.',
          ],
        },
        {
          title: 'What he found',
          icon: 'medicine',
          lines: [
            'Vesalius corrected over 300 errors in Galen\'s work.',
            'Key corrections: the jaw is one bone (not two), the septum of the heart has no holes, the liver does not have five lobes.',
          ],
        },
        {
          title: 'Why it mattered',
          icon: 'legacy',
          lines: [
            'Vesalius proved that direct observation was more reliable than trusting ancient authority.',
            'This principle — look and test, rather than accept — became the foundation of modern science.',
          ],
        },
      ],
    },

    {
      stage: 'Vesalius',
      label: 'The anatomy revolution',
      kicker: 'Breaking with Galen',
      heading: 'What Vesalius actually found',
      sub: 'And why it mattered for 400 years of medicine.',
      blocks: [
        {
          type: 'explainReveal',
          intro: 'Vesalius didn\'t just correct Galen — he changed how doctors thought knowledge should work.',
          atmosphereImage: '/headers/history-medicine-germ-bridge.png',
          steps: [
            {
              id: 'galens-errors',
              statement: 'Galen made hundreds of errors because he mostly dissected',
              emphasis: 'animals, not humans.',
              detail: 'Galen dissected pigs, monkeys and goats. He assumed human anatomy was identical. It wasn\'t.',
            },
            {
              id: 'vesalius-dissects',
              statement: 'Vesalius dissected human bodies and found',
              emphasis: 'over 300 mistakes in Galen\'s work.',
              detail: 'Including the jaw (one bone, not two) and the heart septum (no holes, despite Galen\'s claim).',
            },
            {
              id: 'authority-challenged',
              statement: 'For the first time, an ancient authority\'s work was challenged',
              emphasis: 'with observable, repeatable evidence.',
              detail: 'This was not just a correction of facts — it was a new method: observe, don\'t just accept.',
            },
            {
              id: 'knowledge-not-treatment',
              statement: 'But anatomy improved faster than treatment.',
              emphasis: 'Doctors still bled patients. The Four Humours still explained illness.',
              detail: 'Better knowledge of the body did not immediately mean better cures. That gap would last another century.',
            },
          ],
          reflectionPrompt: 'Why did correcting Galen\'s anatomy not immediately change how doctors treated patients?',
        },
      ],
    },

    {
      type: 'quickRecall',
      stage: 'Vesalius',
      label: 'Vesalius check',
      questions: [
        {
          type: 'choice',
          question: 'What was the name of Vesalius\'s 1543 anatomy textbook?',
          options: [
            'De Humani Corporis Fabrica',
            'De Rerum Natura',
            'Exercitatio Anatomica',
            'Ars Medica',
          ],
          correct: 0,
          explanation: 'De Humani Corporis Fabrica (On the Fabric of the Human Body) was based on direct human dissection and corrected over 300 of Galen\'s errors.',
        },
        {
          type: 'choice',
          question: 'Why had Galen made so many anatomical errors?',
          options: [
            'He dissected animals rather than human bodies',
            'He was not actually a doctor',
            'The Church forced him to write incorrect facts',
            'He copied earlier, less accurate writers',
          ],
          correct: 0,
          explanation: 'Galen dissected pigs, monkeys and goats and assumed human anatomy was the same. It wasn\'t.',
        },
        {
          type: 'choice',
          question: 'Despite correcting Galen\'s anatomy, what did most Renaissance doctors still use to treat illness?',
          options: [
            'Bloodletting and the Four Humours',
            'Surgery and antiseptics',
            'Germ theory and vaccines',
            'Chemical remedies from Paracelsus',
          ],
          correct: 0,
          explanation: 'New anatomical knowledge didn\'t immediately change treatments. Bloodletting and humoural theory persisted for decades after Vesalius.',
        },
      ],
    },

    // ── Section 4 — Learning Chunk 3: Harvey & Paré ─────────────────────────

    {
      type: 'keyFigureReveal',
      stage: 'Harvey and Paré',
      label: 'William Harvey',
      portrait: '/headers/history-medicine-germ-bridge.png',
      name: 'William Harvey',
      role: 'Physician & Anatomist',
      sections: [
        {
          title: 'The problem with Galen',
          icon: 'ancient-figure',
          lines: [
            'Galen claimed the liver constantly produced new blood, which the body used up.',
            'This made bloodletting seem logical: too much blood in the system? Remove some.',
          ],
        },
        {
          title: "Harvey's calculation (1628)",
          icon: 'knowledge',
          lines: [
            'Harvey calculated the total volume of blood in the human body.',
            'The amount was far too large to be freshly produced each day — so it must circulate and be reused.',
          ],
        },
        {
          title: 'De Motu Cordis',
          icon: 'medicine',
          lines: [
            'Harvey published his findings in De Motu Cordis — "On the Motion of the Heart".',
            'He demonstrated that the heart acts as a pump, circulating blood continuously around the body.',
          ],
        },
        {
          title: 'The key limitation',
          icon: 'legacy',
          lines: [
            'Harvey could not explain what blood actually does — so treatments did not immediately change.',
            'Without knowing blood carries oxygen and removes waste, doctors had no reason to abandon bloodletting.',
          ],
        },
      ],
    },

    {
      type: 'conceptReveal',
      stage: 'Harvey and Paré',
      label: 'Ambroise Paré',
      steps: [
        {
          mainText: 'Ambroise Paré was a French military surgeon treating soldiers wounded in battle.',
          supportText: 'Gunshot wounds were treated by pouring boiling oil into them — believed to neutralise gunpowder poison.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'During one battle, Paré ran out of oil. He improvised with a soothing ointment made from egg yolk, rose oil and turpentine.',
          supportText: 'The next morning, patients treated with the ointment were in far less pain and recovering better.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
        {
          mainText: 'Paré also stopped cauterising blood vessels with hot irons — he tied them off instead.',
          supportText: 'He designed artificial limbs and wrote surgical guides. His work reduced the horror of military surgery significantly.',
          backgroundImage: '/headers/history-medicine-germ-bridge.png',
        },
      ],
    },

    {
      type: 'matchingTask',
      stage: 'Harvey and Paré',
      label: 'Who did what?',
      subject: 'History',
      title: 'Match the figure to their contribution',
      instruction: 'Connect each Renaissance figure to their key contribution.',
      weakAreaCategory: 'Renaissance medicine key figures',
      backgroundImage: '/headers/history-medicine-germ-bridge.png',
      pairs: [
        {
          id: 'vesalius-correction',
          term: 'Vesalius (1543)',
          answer: 'Corrected over 300 of Galen\'s anatomical errors using direct human dissection.',
          weakGroup: 'Key figures',
        },
        {
          id: 'harvey-circulation',
          term: 'Harvey (1628)',
          answer: 'Proved blood circulates continuously around the body, pumped by the heart.',
          weakGroup: 'Key figures',
        },
        {
          id: 'pare-ointment',
          term: 'Paré (1536)',
          answer: 'Abandoned boiling oil for wound treatment after discovering a soothing ointment worked better.',
          weakGroup: 'Key figures',
        },
        {
          id: 'printing-press',
          term: 'Printing press',
          answer: 'Allowed new medical ideas to spread rapidly across Europe.',
          weakGroup: 'Context',
        },
        {
          id: 'knowledge-not-treatment',
          term: 'Knowledge vs treatment',
          answer: 'Renaissance medicine improved understanding of the body faster than it improved everyday treatments.',
          weakGroup: 'Themes',
        },
      ],
    },

    // ── Section 5 — Learning Chunk 4: The Royal Society & Change vs Continuity

    {
      type: 'conceptReveal',
      stage: 'Change and continuity',
      label: 'The Royal Society',
      steps: [
        {
          mainText: 'The Royal Society was founded as a formal institution where experiments were shared, tested and debated.',
          supportText: 'Its motto: Nullius in Verba — "Take nobody\'s word for it." Evidence, not authority, was the new standard.',
          backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        },
        {
          mainText: 'For the first time, scientific discoveries could be published, challenged, and built upon by others.',
          supportText: 'This network directly connected Vesalius, Harvey and the later work of Jenner, Pasteur and Koch.',
          backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        },
        {
          mainText: 'The Royal Society represents a shift in how knowledge itself was validated.',
          supportText: 'Not "Galen said it" but "we tested it, published it, and others repeated it." This is the foundation of modern medicine.',
          backgroundImage: '/headers/history-medicine-medieval-scripture.png',
        },
      ],
    },

    {
      type: 'visualNarrative',
      stage: 'Change and continuity',
      label: 'The Great Plague, 1665',
      beats: [
        {
          image: '/headers/history-medicine-london-terror.png',
          imagePosition: 'center center',
          imageFilter: 'brightness(0.85) saturate(0.7)',
          label: 'LONDON, 1665',
          headline: 'Despite everything,\nthe plague returned.',
          body: 'A hundred thousand dead. Anatomical breakthroughs meant nothing.\nPeople still blamed bad air, sin, and the stars.',
        },
        {
          image: '/headers/history-medicine-london-terror.png',
          imagePosition: 'center 30%',
          imageOpacity: 0.55,
          facts: [
            'The Great Plague killed around 100,000 people in London in 1665.',
            'Despite Renaissance advances, people still blamed miasma, the Four Humours, and God\'s punishment.',
            'The government\'s response was more organised than in 1348 — quarantine, pest houses, bills of mortality.',
            'The mayor ordered cats and dogs killed, believing they spread plague. Fewer cats meant more rats, more fleas, more plague.',
          ],
          conclusion: 'Renaissance medicine changed knowledge more than treatment.\nThe gap between understanding and curing would take two more centuries to close.',
        },
      ],
    },

    {
      type: 'naturalSupernaturalSwipe',
      stage: 'Change and continuity',
      label: 'Change vs continuity',
      columns: [
        { label: 'CHANGED\nNew in the Renaissance', color: '#D4950A', colorRgb: '212,149,10', bg: 'rgba(212,149,10,.07)' },
        { label: 'CONTINUED\nStayed the same', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
      ],
      items: [
        { label: 'Understanding of human anatomy', col: 0, explanation: 'Changed — Vesalius corrected over 300 of Galen\'s anatomical errors through direct human dissection.' },
        { label: 'Bloodletting as a treatment', col: 1, explanation: 'Continued — even after Harvey proved blood circulates, bloodletting persisted well into the 19th century.' },
        { label: 'How new ideas were validated', col: 0, explanation: 'Changed — the Royal Society demanded observation and experiment. "Take nobody\'s word for it."' },
        { label: 'Blaming plague on miasma and sin', col: 1, explanation: 'Continued — even in 1665, the Great Plague was still blamed on bad air and God\'s punishment.' },
        { label: 'Using herbal remedies and purging', col: 1, explanation: 'Continued — these treatments based on the Four Humours carried on throughout the Renaissance and beyond.' },
        { label: 'Knowledge that blood circulates', col: 0, explanation: 'Changed — Harvey\'s 1628 discovery overturned Galen\'s claim that the liver made new blood constantly.' },
      ],
      explanation: 'The Renaissance changed how doctors understood the body — but not how they treated patients. New knowledge co-existed with old practice for generations.',
    },

    {
      type: 'quickRecall',
      stage: 'Change and continuity',
      label: 'Chapter retrieval',
      questions: [
        {
          type: 'choice',
          question: 'Why did Harvey\'s discovery of blood circulation not immediately change treatments?',
          options: [
            'He could not explain what blood actually does, so no reason to abandon bloodletting',
            'The Church banned his work',
            'His results could not be repeated by other scientists',
            'Bloodletting was still the most effective treatment available',
          ],
          correct: 0,
          explanation: 'Harvey proved blood circulates but couldn\'t explain its function. Without knowing blood carries oxygen, doctors had no reason to abandon humoural treatments.',
        },
        {
          type: 'choice',
          question: 'What does the Great Plague of 1665 tell us about Renaissance medicine?',
          options: [
            'New anatomical knowledge had not improved understanding of disease causes',
            'Renaissance doctors successfully treated plague with herbal remedies',
            'The Church had been completely overthrown as a medical authority by 1665',
            'Germ theory had been discovered but not yet applied',
          ],
          correct: 0,
          explanation: 'People still blamed miasma, humours and God. Renaissance anatomy improved knowledge of the body — not knowledge of what caused disease.',
        },
        {
          type: 'choice',
          question: 'What did the Royal Society\'s motto "Nullius in Verba" represent?',
          options: [
            'Rejection of ancient authority — evidence and experiment must replace tradition',
            'Support for the Church\'s control over medical knowledge',
            'A declaration that surgery required royal permission',
            'A warning that doctors should not trust patients',
          ],
          correct: 0,
          explanation: '"Take nobody\'s word for it" — the Royal Society created a culture where observation, experiment and publication replaced trusting Galen.',
        },
      ],
    },

    // ── Section 6 — Summary & Examiner ──────────────────────────────────────

    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'Examiner tactics',
      examinerExplains: {
        opening: "Renaissance medicine is exam gold — but students often lose marks by confusing change and continuity.",
        tips: [
          {
            heading: 'Know the difference: knowledge vs treatment',
            body: 'Vesalius and Harvey changed anatomy and understanding. But treatments — bloodletting, purging, herbal remedies — barely changed. The examiner wants this distinction.',
          },
          {
            heading: 'Name the figures, name the year',
            body: 'Vesalius 1543, Harvey 1628, Paré 1530s, Royal Society 1660, Great Plague 1665. These dates are signals of precision — use them.',
          },
          {
            heading: 'Explain why change was slow',
            body: 'Galen still dominated universities. The Church backed old ideas. Without germ theory, there was no alternative explanation for disease. Change happened at the edges, not overnight.',
          },
          {
            heading: 'Use the Great Plague as evidence of continuity',
            body: 'Despite the Renaissance, the 1665 plague showed people still blamed miasma and sin. This is the clearest evidence that new knowledge hadn\'t filtered into everyday treatment.',
          },
        ],
        closing: "Show the examiner you understand both the change and the limits of change.",
      },
    },

    {
      type: 'faceExaminer',
      stage: 'Exam prep',
      label: 'Face the Examiner',
      examiner: {
        type: '8-mark-explain',
        board: 'edexcel',
        subject: 'history',
        topic: 'renaissance-medicine',
        difficulty: 'standard',

        question: 'Explain two ways in which the work of Vesalius and Harvey changed medicine during the Renaissance. [8 marks]',
        marks: 8,
        mark: 5,
        summary: 'Both figures are mentioned and their discoveries stated. However, the answer needs to explain the significance and impact of each discovery more fully to reach Level 3.',

        markScheme: `Level 3 (6–8 marks): Detailed explanation of two ways with developed reasoning — must explain WHY each discovery was significant, not just what it was.
Level 2 (3–5 marks): Some explanation of change, but at least one point lacks development of significance or impact.
Level 1 (1–2 marks): Simple identification of discoveries with little explanation.
Award marks for any two of (each requiring explanation not just identification):
- Vesalius corrected anatomical errors — must explain WHY this mattered (proved direct observation beat ancient authority; challenged Galen's 1,400-year dominance)
- Harvey proved blood circulation — must link to what changed AND what didn't (knowledge improved but treatments persisted)
- Vesalius published De Fabrica — must explain impact (illustrated, spread via printing press, forced confrontation with Galen)
- Harvey used mathematical method — must explain significance (new approach: weighing, calculating, not just observing)
Do NOT award marks for naming discoveries without explaining their significance.`,

        sampleAnswer: `During the Renaissance, the work of Vesalius and Harvey changed medicine in important ways. Firstly, Vesalius corrected many of Galen's mistakes about human anatomy. He dissected human bodies himself and published his findings in De Humani Corporis Fabrica in 1543. He found over 300 errors in Galen's work, including facts about the jaw bone and the heart. This was important because it showed that ancient authorities could be wrong, and that doctors should rely on direct observation rather than just trusting old books. Secondly, Harvey proved in 1628 that blood circulates continuously around the body, pumped by the heart. This was different from Galen's idea that the liver constantly produced new blood. However, Harvey could not explain what blood actually did, so doctors continued to use old treatments like bloodletting.`,

        annotations: [
          {
            id: 'ann1',
            target: 'corrected many of Galen\'s mistakes about human anatomy.',
            occurrence: 1,
            type: 'weak',
            comment: 'Stated but needs development — which mistakes? Why did this matter?',
          },
          {
            id: 'ann2',
            target: 'He found over 300 errors in Galen\'s work, including facts about the jaw bone and the heart.',
            occurrence: 1,
            type: 'strong',
            comment: 'Specific — names the errors. Good knowledge.',
          },
          {
            id: 'ann3',
            target: 'it showed that ancient authorities could be wrong, and that doctors should rely on direct observation rather than just trusting old books.',
            occurrence: 1,
            type: 'strong',
            comment: 'Excellent — explains the significance, not just the fact.',
          },
          {
            id: 'ann4',
            target: 'Harvey could not explain what blood actually did, so doctors continued to use old treatments like bloodletting.',
            occurrence: 1,
            type: 'strong',
            comment: 'Very good — shows understanding of the limits of change.',
          },
        ],

        improvementPrompts: {
          ann1: {
            prompt: '+ Explain WHY correcting Galen\'s anatomy was significant',
            placeholder: 'e.g. Galen\'s work had been accepted for over 1,400 years without question. By proving him wrong, Vesalius established that evidence from direct observation was more reliable than ancient authority...',
          },
        },

        criteriaOptions: [
          'Accurate knowledge',
          'Two clear ways',
          'Specific evidence',
          'Explains the impact',
          'Developed explanation',
          'Too vague',
          'Repeats the point',
          'Missing the "why it mattered"',
        ],
      },
    },

  ]
}

export default episode
