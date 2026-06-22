// ─── History module content — full lesson data for History modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a History module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.
//
// Episodes being migrated to src/content/history/medicine/episodes/ are imported
// below. Episodes not yet migrated remain inline in this file.
import episodeMedievalBeliefs from '../content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js'
import episodeBlackDeath from '../content/history/medicine/episodes/episode-02-black-death.js'
import episodeJenner from '../content/history/medicine/episodes/episode-06-jenner-vaccination.js'
import episodeGermTheory from '../content/history/medicine/episodes/episode-07-germ-theory.js'
import episodeWesternFront from '../content/history/medicine/episodes/episode-14-western-front.js'

export const HISTORY_MODULES = [
  episodeMedievalBeliefs,

  episodeBlackDeath,

  {
    id: 'mod2',
    subject: 'History',
    number: 3,
    title: 'Renaissance & the Plague',
    subtitle: 'Challenge & Continuity',
    era: 'c1500–c1700',
    icon: '🔬',
    color: '#D4950A',
    colorLight: 'rgba(212,149,10,.12)',
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
      intro: "You're about to see how Renaissance artists and scientists started dismantling a thousand years of medical dogma.",
      bullets: [
        "Explain what Vesalius discovered — and why the Church didn't like it",
        "Describe how Harvey's blood circulation theory changed everything",
        'Understand why the Plague kept killing even as knowledge improved',
        'See the gap between knowing more and being able to treat better',
      ],
    },

    // TODO: split mod2 into separate Episode 3, 4 and 5 modules, each with its own stageNavigation.
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
            body: 'The Renaissance didn\'t erase a thousand years of thinking overnight.',
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
            eyebrow: 'c.1400–1600',
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
            eyebrow: 'The key tension',
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
        role: 'Anatomist & Medical Revolutionary',
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
              'A groundbreaking illustrated anatomy textbook based on direct human dissection.',
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
        type: 'conceptReveal',
        stage: 'Harvey and Paré',
        label: 'William Harvey',
        steps: [
          {
            eyebrow: '1628',
            mainText: 'Galen had claimed the liver constantly produced new blood — and the body used it up.',
            supportText: 'This explained why bloodletting seemed logical: too much blood? Remove some.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            mainText: 'Harvey proved that blood circulates continuously around the body, pumped by the heart.',
            supportText: 'He calculated the volume of blood in the body was too large to be made fresh each day — so it must be reused.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
          {
            eyebrow: 'The key limitation',
            mainText: 'Harvey could not explain what blood actually does — so treatments didn\'t immediately change.',
            supportText: 'Without knowing blood carries oxygen and removes waste, doctors had no reason to stop bloodletting.',
            backgroundImage: '/headers/history-medicine-germ-bridge.png',
          },
        ],
      },

      {
        type: 'conceptReveal',
        stage: 'Harvey and Paré',
        label: 'Ambroise Paré',
        steps: [
          {
            eyebrow: 'France, 1536',
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
            eyebrow: 'The legacy',
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
            eyebrow: '1660',
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
            eyebrow: 'Exam point',
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
            image: '/images/great-plague-1665.png',
            imagePosition: 'center center',
            imageFilter: 'brightness(0.85) saturate(0.7)',
            label: 'LONDON, 1665',
            headline: 'Despite everything,\nthe plague returned.',
            body: 'A hundred thousand dead. Anatomical breakthroughs meant nothing.\nPeople still blamed bad air, sin, and the stars.',
          },
          {
            image: '/images/great-plague-1665.png',
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
  },

  {
    id: 'mod3',
    subject: 'History',
    number: 4,
    title: 'Surgery & anatomy',
    subtitle: 'Hold him down and hope',
    era: 'c1700–c1900',
    icon: '🩺',
    color: '#C47828',
    colorLight: 'rgba(196,120,40,.12)',
    hook: {
      scenario: {
        location: 'London, 1840',
        hint: 'A surgeon is about to operate. He hasn\'t washed his hands once today.',
      },
      statement: 'Before the 1840s, surgeons washed their hands and wore clean coats to prevent infection.',
      isTrue: false,
      accentWords: ['washed their hands', 'clean coats'],
      explanation: "Blood-stained coats were worn with pride — proof of experience. Nobody had discovered germ theory yet. Dirty hands killed more patients than the knife.",
      wrongFeedback: 'Actually, blood-stained coats were a badge of honour — experience, not hygiene.',
      correctFeedback: 'Right. Germs weren\'t even discovered yet. Nobody knew dirty hands were dangerous.',
      loadingText: 'The real operating theatre was horrifying…',
      bigQuestion: 'So what actually made surgery so deadly?',
      revealHeader: 'Three killers: pain, infection, blood loss.',
      revealItems: [
        { emoji: '😱', label: 'Pain — patients were fully conscious', detail: 'No anaesthetic meant patients screamed through every cut. Surgeons were judged on speed — Robert Liston could amputate a leg in 40 seconds.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
        { emoji: '🦠', label: 'Infection — nobody knew why wounds went bad', detail: 'Blood-stained coats, unwashed hands, unsterilised instruments. Surgeons carried bacteria from patient to patient without knowing it. Most patients died of post-op infection.', color: '#D4950A', bg: 'rgba(212,149,10,.08)' },
        { emoji: '🩸', label: 'Blood loss — no transfusions existed', detail: 'Major operations killed through blood loss alone. There were no blood groups, no transfusion techniques, no way to replace what was lost on the table.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
      ],
      punchline: 'Surgery improved because three separate problems were solved — pain, infection, bleeding — each by a different person.',
    },
    intro: {
      learningGoals: [
        'Explain why surgery before the 1840s was so dangerous',
        'Describe how anaesthetics changed surgery — and why they also created new problems',
        'Explain Lister\'s use of antiseptics and why surgeons resisted it at first',
        'Assess the relative importance of Simpson, Lister and Nightingale',
      ],
    },
    outcomes: {
      intro: 'Surgery before anaesthetics was essentially a horror show. This chapter explains how it became something close to medicine.',
      bullets: [
        'Describe what surgery was actually like before 1846',
        'Explain how anaesthetics changed the game — and created new problems',
        "See why Lister's carbolic acid was revolutionary and controversial at the same time",
        'Connect pain, infection and blood loss to surgical survival rates',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Before 1846, surgeons operated on fully conscious patients.', isTrue: true },
        { type: 'choice', question: 'Simpson discovered that chloroform could...', options: ['Kill bacteria during surgery', 'Make patients unconscious for operations', 'Speed up the healing of wounds'], correct: 1 },
        { type: 'connection', question: 'Lister used carbolic acid to...', options: [
          { text: 'Speed up the operating process', icon: 'gear' },
          { text: 'Kill the bacteria causing post-op infections', icon: 'germ' },
          { text: 'Numb patients before operations', icon: 'heart' },
        ], correct: 1 },
      ],
    },
    // TODO: mod3 lacks blood loss and dedicated exam prep screens; indices 9–10 are approximate.
    stageNavigation: [
      { id: 'part-1', title: 'The Three Enemies of Surgery', description: 'Pain, infection and blood loss before the 1840s.', screenIndex: 0 },
      { id: 'part-2', title: 'Pain: The Patient\'s Nightmare', description: 'Anaesthetics from Davy to Simpson.', screenIndex: 1 },
      { id: 'part-3', title: 'Infection: The Invisible Killer', description: 'Lister, antiseptics and aseptic surgery.', screenIndex: 8 },
      { id: 'part-4', title: 'Blood Loss and Better Technique', description: 'Aseptic surgery and improving surgical outcomes.', screenIndex: 9 },
      { id: 'part-5', title: 'From Last Resort to Real Treatment', description: 'How surgery became safer and more routine.', screenIndex: 9 },
      { id: 'part-6', title: 'Exam Prep: Why Surgery Improved', description: 'Exam practice and final application.', screenIndex: 10 },
    ],
    screens: [
      {
        label: 'The Problem',
        kicker: 'Core Problem',
        heading: 'Why was surgery terrifying?',
        sub: 'Before modern surgery, the method was basically: "hold him down and hope."',
        blocks: [
          { type: 'read', label: '❌ Before improvements', text: 'No anaesthetic. No antiseptics. No blood transfusions. Infection was common. Surgeons were judged partly on speed — <strong>Robert Liston</strong> could amputate a leg in under 40 seconds in the 1840s.' },
          { type: 'read', label: '✅ After improvements', text: 'Anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and transfusions reduced blood loss. Surgery became slower, cleaner and more precise.' },
          { type: 'funfact', label: '🤢 Gross Fact', text: 'Some surgeons wore blood-stained coats as a badge of experience. Basically: "Look how filthy I am, trust me with your open wound."' },
          { type: 'keypoint', text: 'Doctors slowly solved three huge problems: <strong>pain</strong>, <strong>infection</strong> and <strong>bleeding</strong>.' },
        ]
      },
      {
        tag: 'anaesthetics',
        label: 'Pain',
        kicker: 'Problem 1 · Pain',
        heading: 'Anaesthetics: finally, less screaming',
        sub: 'Anaesthetics reduced pain so surgeons could operate more carefully and attempt longer, more complex procedures.',
        blocks: [
          { type: 'examtip', label: '🗡️ Exam Trap', text: '<strong>Anaesthetics did not fix surgery by themselves.</strong> They reduced pain, but longer operations could increase infection risk if surgeons still had dirty hands, tools and theatres.' },
          { type: 'quiz', question: 'Which detail best explains why chloroform became safer?', options: [
            { text: "John Snow's inhaler helped control how much chloroform patients received", correct: true },
            { text: 'People stopped caring about dosage', correct: false },
            { text: 'Ether was flammable', correct: false },
            { text: 'Robert Liston operated faster', correct: false },
          ], explanation: "Snow's inhaler is a strong technology factor: safer dosage increased trust." },
        ]
      },
      {
        label: 'Davy',
        kicker: '1799',
        heading: 'Humphry Davy: laughing gas',
        sub: 'The first hint that pain in surgery could one day be solved.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>Humphry Davy</strong> discovered that inhaling <strong>nitrous oxide</strong> (laughing gas) reduced the sensation of pain. He even suggested it could be used during surgery. But surgeons ignored him — partly because it made people giggle, and partly because no one believed patients needed to be unconscious.' },
          { type: 'funfact', label: '😂 Why It Was Ignored', text: 'Nitrous oxide was seen as a party trick. It was used at "laughing gas shows" for entertainment. Serious surgeons didn\'t want to be associated with circus antics — so a potential breakthrough sat unused for 47 years.' },
        ]
      },
      {
        label: 'Morton',
        kicker: '1846',
        heading: 'William Morton: ether',
        sub: 'The first successful public demonstration of surgical anaesthesia.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>William Morton</strong>, an American dentist, publicly demonstrated that <strong>ether</strong> could render a patient unconscious during surgery in 1846. The news spread to Britain rapidly. For the first time, surgeons could operate without a patient screaming — but ether was flammable and caused nausea.' },
          { type: 'keypoint', text: 'Morton\'s demonstration was the turning point that made pain-free surgery a reality. But ether had serious limitations — the search for something better began immediately.' },
        ]
      },
      {
        label: 'Simpson',
        kicker: '1847',
        heading: 'James Simpson: chloroform',
        sub: 'Better than ether — and discovered over a dinner party.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>James Simpson</strong>, a Scottish obstetrician, was searching for something better than ether. In 1847, he and two colleagues inhaled various chemicals at a dinner party. They woke up under the table having discovered <strong>chloroform</strong> — more powerful, faster acting, and less flammable than ether. It allowed much longer operations.' },
          { type: 'funfact', label: '🍽️ The Dinner Party Method', text: 'Simpson\'s approach to drug discovery: invite friends over, try inhaling random chemicals, see who passes out. Pioneering science or a Victorian dare? Both, probably.' },
        ]
      },
      {
        label: 'Greener',
        kicker: '1848',
        heading: 'Hannah Greener: a warning',
        sub: 'The new wonder drug had a dangerous side.',
        blocks: [
          { type: 'read', label: '⚠️ What Happened', text: '<strong>Hannah Greener</strong>, aged 15, died from an overdose of chloroform in 1848 — one year after its discovery. She had been given too much. Her death showed that anaesthetics were not automatically safe. The problem was dosage: there was no precise way to control how much a patient received.' },
          { type: 'examtip', label: '🗡️ Exam Insight', text: 'Hannah Greener\'s death is useful evidence that <strong>new medical advances create new problems</strong>. Examiners love this nuance — progress isn\'t simply positive.' },
        ]
      },
      {
        label: 'Snow',
        kicker: '1850s',
        heading: 'John Snow: safer dosage',
        sub: 'The man who solved cholera also made chloroform much safer.',
        blocks: [
          { type: 'read', label: '🔬 The Improvement', text: '<strong>John Snow</strong> — best known for tracing the 1854 cholera outbreak to a water pump — developed an <strong>inhaler</strong> that allowed surgeons to control exactly how much chloroform a patient received. Controlled dosage dramatically reduced the risk of overdose and death. Chloroform became far more trusted as a result.' },
          { type: 'keypoint', text: 'Snow\'s inhaler is a classic example of <strong>technology improving a previous advance</strong>. The discovery (chloroform) only became safe when the method of administering it was controlled.' },
        ]
      },
      {
        label: 'Victoria',
        kicker: '1853',
        heading: 'Queen Victoria: royal seal of approval',
        sub: 'When the Queen used it in childbirth, public resistance collapsed.',
        blocks: [
          { type: 'read', label: '👑 The Endorsement', text: '<strong>Queen Victoria</strong> used chloroform during the birth of her eighth child in 1853 — and praised it publicly. Until this point, many religious figures argued that pain in childbirth was God\'s will and should not be numbed. The Queen\'s endorsement silenced most opposition overnight. Chloroform use spread rapidly.' },
          { type: 'examtip', label: '🗡️ Exam Factor', text: 'Victoria\'s endorsement is evidence of <strong>government/authority as a factor</strong> in medical change. Not a scientific discovery — but it removed the social and religious barrier to adoption.' },
        ]
      },
      {
        tag: 'antiseptic-surgery',
        label: 'Infection',
        kicker: 'Problem 2 · Infection',
        heading: 'Antiseptics: the acid Febreze era',
        sub: 'Anaesthetics helped pain, but created a new problem: longer operations meant more chance for infection.',
        blocks: [
          { type: 'read', label: '🦠 Pasteur → Lister', text: '<strong>Louis Pasteur\'s germ theory</strong> showed microorganisms caused decay and disease. <strong>Joseph Lister</strong> applied that idea to surgery in the 1860s by using <strong>carbolic acid</strong> to clean wounds, instruments, bandages and operating theatres.' },
          { type: 'funfact', label: '🤢 Horrible Histories Moment', text: 'Victorian surgeons after discovering carbolic acid: "What if we sprayed absolutely EVERYTHING with acid?" Patients. Bandages. Tables. Probably nearby pigeons.' },
          { type: 'keypoint', text: '<strong>Lister mattered because he used germ theory practically.</strong> He did not just know germs existed — he changed surgical methods to reduce infection.' },
          { type: 'quiz', question: "Why did Lister's methods matter?", options: [
            { text: 'He used carbolic acid to reduce infection using ideas from germ theory', correct: true },
            { text: 'He discovered ether', correct: false },
            { text: 'He invented blood groups', correct: false },
            { text: 'He proved pain was useful', correct: false },
          ], explanation: 'Pasteur gave the scientific idea; Lister turned it into surgical practice.' },
        ]
      },
      {
        label: 'Aseptic',
        kicker: 'Infection Gets Smarter',
        heading: 'Aseptic surgery: stop germs getting in',
        sub: 'Antiseptics killed germs afterwards. Aseptic surgery aimed to stop germs entering in the first place.',
        blocks: [
          { type: 'read', label: '🧴 Antiseptic vs Aseptic', text: '<strong>Antiseptic</strong>: kill germs after they appear. Lister\'s carbolic acid was antiseptic — useful but still messy. <strong>Aseptic</strong>: prevent germs entering in the first place. Surgeons began sterilising instruments, wearing gloves and masks, and using clean operating theatres.' },
          { type: 'examtip', label: '🗡️ Exam Sentence', text: 'Surgery became safer when science and technology worked together: anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and blood groups made transfusions safer.' },
          { type: 'quiz', question: 'Which answer best explains how surgery became safer?', options: [
            { text: 'Pain, infection and blood loss were solved gradually through anaesthetics, antiseptics/aseptic methods and safer transfusions', correct: true },
            { text: 'Anaesthetics fixed every problem immediately', correct: false },
            { text: 'Surgery became safer because doctors stopped doing operations', correct: false },
            { text: 'Galen discovered blood groups', correct: false },
          ], explanation: 'Strong GCSE answer: surgery improved because several problems were solved in stages, not because of one magic discovery.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Anaesthetic', back: 'A substance that removes pain during surgery.' },
            { front: 'James Simpson', back: 'Discovered chloroform as a general anaesthetic (1847).' },
            { front: 'Hannah Greener', back: 'Died from chloroform overdose in 1848 — showed dosage danger.' },
            { front: 'Antiseptic', back: 'Kills germs that are already present. Lister used carbolic acid from 1867.' },
            { front: 'Aseptic', back: 'Prevents germs getting in. Sterilised instruments, gloves, clean theatres.' },
            { front: 'Joseph Lister', back: 'Applied germ theory to surgery using carbolic acid to fight infection.' },
            { front: 'Three surgery problems', back: 'Pain, infection, and bleeding — each solved separately.' },
          ]}
        ]
      },
    ]
  },

  episodeJenner,

  episodeGermTheory,

  {
    id: 'mod5',
    subject: 'History',
    number: 7,
    title: 'The Great Stink',
    subtitle: 'Cities, sewers & slow progress',
    era: 'c1800–c1900',
    icon: '🏭',
    color: '#9A5A18',
    colorLight: 'rgba(154,90,24,.12)',
    hook: {
      scenario: {
        location: 'London, 1854',
        hint: 'People are drawing water from a pump on Broad Street. Several neighbours have died this week.',
      },
      statement: 'Victorian Londoners knew that drinking from the Thames could spread cholera.',
      isTrue: false,
      accentWords: ['Thames', 'cholera'],
      explanation: "Most people blamed miasma — the smell of the river. It took one doctor, John Snow, to map deaths door-by-door in 1854 and prove the water itself was the killer.",
      wrongFeedback: 'Most people still blamed miasma — bad air from the river. The water itself seemed fine.',
      correctFeedback: 'Right — even as people died, most blamed smell, not water. It took one doctor to prove otherwise.',
      loadingText: 'Tracing the outbreak…',
      bigQuestion: 'So how did anyone figure out the water was the problem?',
      revealHeader: 'John Snow mapped every death.',
      revealItems: [
        { emoji: '🗺️', label: 'Snow\'s map changed medicine', detail: 'Dr John Snow plotted every cholera death on a street map of Soho. They clustered around one water pump on Broad Street. He removed the handle — the outbreak stopped. Data beat dogma.', color: '#9A5A18', bg: 'rgba(154,90,24,.08)' },
        { emoji: '🏙️', label: 'Cities were death traps', detail: 'Industrial towns packed thousands into slums with no sewage, shared privies and water drawn from rivers full of waste. Life expectancy in Manchester in 1840 was 28 years for labourers.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
        { emoji: '🚧', label: 'Government had to act — but didn\'t want to', detail: 'Laissez-faire politics meant the government resisted spending on sewers. It took the Great Stink of 1858 — when Parliament itself smelled the Thames — to force Bazalgette\'s sewer system through.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
      ],
      punchline: 'Public health improved not because government wanted to act — but because the smell reached Parliament.',
    },
    intro: {
      learningGoals: [
        'Explain why public health was so poor in industrial towns',
        'Describe Chadwick\'s 1842 report and why the government was slow to act',
        'Explain John Snow\'s role in proving cholera was waterborne',
        'Describe the 1875 Public Health Act and why it was a genuine turning point',
      ],
    },
    outcomes: {
      intro: "Knowing what causes disease is useless if society won't act on it. This chapter shows why change is always slower than science.",
      bullets: [
        'Explain why 19th-century cities were genuine death traps',
        'Describe the cholera outbreaks and what they finally revealed',
        'See why governments were so reluctant to improve public health',
        "Link Snow's map and the Broad Street pump to the birth of epidemiology",
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'John Snow proved cholera spread through water in 1854.', isTrue: true },
        { type: 'choice', question: 'Why did governments resist improving public health?', options: ['Scientists disagreed about the causes', 'It was costly and meant government interference', 'People refused to use sewers'], correct: 1 },
        { type: 'connection', question: 'The Great Stink of 1858 mattered because...', options: [
          { text: 'It killed enough MPs to force a vote', icon: 'warning' },
          { text: 'It forced Parliament to fund Bazalgette\'s sewer system', icon: 'people' },
          { text: 'It proved miasma theory was correct after all', icon: 'leaf' },
        ], correct: 1 },
      ],
    },
    stageNavigation: [
      { id: 'part-1', title: 'A City That Could Not Breathe', description: 'Industrial towns, overcrowding and the public health crisis.', screenIndex: 0 },
      { id: 'part-2', title: 'Cholera, Crowding and Filth', description: 'Cholera outbreaks and why cities were death traps.', screenIndex: 1 },
      { id: 'part-3', title: 'Miasma Meets Evidence', description: 'Chadwick\'s report and John Snow\'s map.', screenIndex: 2 },
      { id: 'part-4', title: 'The Government Finally Moves', description: 'From laissez-faire to the 1875 Public Health Act.', screenIndex: 4 },
      { id: 'part-5', title: 'Prevention Becomes Public', description: 'The Great Stink, Bazalgette\'s sewers and lasting change.', screenIndex: 5 },
      { id: 'part-6', title: 'Exam Prep: Why Public Health Changed', description: 'Exam practice and final application.', screenIndex: 6 },
    ],
    screens: [
      {
        label: 'Cities Explode',
        kicker: 'Cause of the Problem',
        heading: 'Industrialisation: cities exploded',
        sub: 'From 1750, people moved from rural areas into towns and cities. The cities were not ready. Not even slightly.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'Urban populations grew hugely, but public health systems did not grow with them. More people meant more waste, more overcrowding and faster disease spread. <strong>London</strong> grew from 1.09m to 5.57m between 1801 and 1901. Manchester, Birmingham and Glasgow saw similar explosions.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', phrases: ['rapid urbanisation'], tip: 'Industrialisation caused towns to grow faster than housing, water supplies and sewage systems could cope.' },
          { type: 'read', label: '☠️ Six Ways Cities Killed You', text: '<strong>Cramped housing</strong> spread disease. <strong>Shared toilets</strong> and poor drainage built up waste near homes. <strong>Cesspits</strong> leaked into drinking water. <strong>Street pumps</strong> supplied contaminated water. <strong>Coal smoke</strong> damaged lungs. All of these worked together to spread disease rapidly.' },
          { type: 'quiz', question: 'Why did industrialisation cause a public health crisis?', options: [
            { text: 'Cities grew faster than housing, sanitation and water systems could cope', correct: true },
            { text: 'People chose to be unhealthy', correct: false },
            { text: 'Germ theory caused the problem', correct: false },
            { text: 'The government banned clean water', correct: false },
          ], explanation: 'Rapid urbanisation overwhelmed public health systems, causing disease to spread through overcrowding, poor sanitation and contaminated water.' },
        ]
      },
      {
        label: 'Cholera',
        kicker: 'Disease',
        heading: 'Cholera: the killer nobody understood',
        sub: 'Cholera spread fast and killed through severe dehydration. People still blamed bad air.',
        blocks: [
          { type: 'read', label: '☠️ Cholera', text: 'Cholera first arrived in England in <strong>1831</strong>. It caused vomiting, diarrhoea, dehydration and often death. Major epidemics happened in <strong>1831, 1848, 1854 and 1866</strong>. Even during outbreaks, many people still believed <strong>miasma</strong> caused disease — which slowed acceptance of the waterborne explanation.' },
          { type: 'quiz', question: 'How was cholera actually spread?', options: [
            { text: 'Through contaminated food or water', correct: true },
            { text: 'By bad smells only', correct: false },
            { text: 'By too much coal smoke', correct: false },
            { text: 'By four humours becoming unbalanced', correct: false },
          ], explanation: 'Cholera was waterborne. The continuing belief in miasma slowed understanding of this — a key continuity point.' },
        ]
      },
      {
        label: 'Chadwick',
        kicker: 'Key Person 1',
        heading: 'Edwin Chadwick: "Please clean literally anything"',
        sub: 'Chadwick investigated living conditions and used evidence to push for public health reform.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Edwin Chadwick</strong> was a lawyer and social reformer. In <strong>1842</strong> he published the <em>Report on the Sanitary Conditions of the Labouring Population of Great Britain</em>. It showed that poor sanitation and poverty were linked to low life expectancy. Manchester labourers lived to 15–19; rural professionals lived to around 52.' },
          { type: 'keypoint', text: 'Chadwick still believed in <strong>miasma</strong> — his reasoning was partly wrong. But the reforms he wanted (clean water, drainage, sewers) would still save lives. <strong>Correct outcome from partly incorrect reasoning.</strong>' },
          { type: 'quiz', question: "Why is Chadwick's work a good exam example?", options: [
            { text: 'He used evidence to push for reforms that would save lives, even though his miasma reasoning was wrong', correct: true },
            { text: 'He proved germ theory first', correct: false },
            { text: 'He built the London sewer system', correct: false },
            { text: 'He invented the cholera vaccine', correct: false },
          ], explanation: 'Chadwick helped public health without understanding germ theory. Correct outcome from partly incorrect reasoning is a classic exam nuance.' },
        ]
      },
      {
        tag: 'john-snow',
        label: 'John Snow',
        kicker: 'Key Person 2',
        heading: 'John Snow: the Soho water mystery',
        sub: 'Snow worked like a detective. He mapped deaths, followed the evidence and challenged miasma.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'During the <strong>1854 cholera outbreak</strong> in Soho, London, <strong>John Snow</strong> plotted cholera deaths on a map. He found they clustered around the <strong>Broad Street pump</strong>. He believed sewage from a nearby cesspit had contaminated the water. He had the pump handle removed, helping stop the outbreak.' },
          { type: 'funfact', label: '🍺 The Beer Drinkers Lived', text: 'Workers at a nearby brewery did not get cholera because they drank beer instead of water from the pump. History revision officially sponsored by weird but useful details.' },
          { type: 'keypoint', text: 'Snow proved cholera was <strong>waterborne</strong>, but could not yet explain germs scientifically. Many people continued to believe miasma until Pasteur\'s germ theory gave stronger evidence later.' },
          { type: 'quiz', question: "How did John Snow help stop the 1854 cholera outbreak?", options: [
            { text: 'He mapped deaths and had the Broad Street pump handle removed', correct: true },
            { text: 'He invented the cholera vaccine', correct: false },
            { text: 'He proved miasma caused cholera', correct: false },
            { text: 'He built the London sewers', correct: false },
          ], explanation: 'Snow\'s detective work showed the cluster around the pump. Removing the handle stopped people drinking contaminated water.' },
        ]
      },
      {
        tag: 'public-health',
        label: 'Government Acts',
        kicker: 'Government Action',
        heading: 'Public health acts: 1848 and 1875',
        sub: 'From optional and underfunded to compulsory. Progress was slow.',
        blocks: [
          { type: 'read', label: '📖 1848 Public Health Act', text: 'Created a <strong>Central Board of Health</strong>. Local authorities <em>could</em> set up local boards of health — but they were usually not compulsory. Areas with a mortality rate above 23 per 1,000 had to set one up. Funding was weak. Many councils did nothing.' },
          { type: 'read', label: '📖 1875 Public Health Act', text: 'Much stronger. Local authorities <strong>had to</strong>: provide clean water, build sewerage systems, and appoint medical officers to oversee public health. This showed a clear move away from laissez-faire attitudes.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', text: '<strong>Laissez-faire</strong> means limited government interference. Many Victorians opposed public health laws because they disliked taxes, central control and being told what to do. The Times in 1852: "We prefer to take our chance with cholera than be bullied into health."' },
          { type: 'quiz', question: 'What was the key difference between the 1848 and 1875 Acts?', options: [
            { text: '1875 made local authorities take stronger compulsory action', correct: true },
            { text: '1848 was compulsory and 1875 was optional', correct: false },
            { text: '1875 banned microscopes', correct: false },
            { text: '1848 discovered cholera bacteria', correct: false },
          ], explanation: '1848 was important but weak and largely optional. 1875 was compulsory — a clear shift away from laissez-faire.' },
        ]
      },
      {
        label: 'Great Stink & Sewers',
        kicker: 'Turning Point',
        heading: 'The Great Stink & Bazalgette\'s sewers',
        sub: 'In 1858, the Thames smelled so bad that Parliament shut down. Reform suddenly became urgent.',
        blocks: [
          { type: 'funfact', label: '🤢 1858', text: 'The river smelled so bad Parliament shut down. Poor people had suffered from filthy conditions for years. But once politicians personally had to smell the Thames, reform suddenly became urgent. Peak human behaviour.' },
          { type: 'read', label: '📖 Joseph Bazalgette', text: '<strong>Joseph Bazalgette</strong> designed London\'s new sewerage system after the Great Stink. Designed in <strong>1858</strong>, completed in <strong>1875</strong>. It removed sewage from the city and helped end major cholera outbreaks in London. Bazalgette was not a doctor — this shows public health improved through <strong>engineering and infrastructure</strong>.' },
          { type: 'keypoint', text: 'Public health improved through multiple factors: <strong>science, engineering, government action and evidence</strong> all mattered.' },
          { type: 'quiz', question: 'Why was the Great Stink a turning point?', options: [
            { text: 'When Parliament was directly affected by the smell, they finally acted on sewer reform', correct: true },
            { text: 'It proved miasma was correct', correct: false },
            { text: 'It killed half of London', correct: false },
            { text: 'It was caused by germ theory', correct: false },
          ], explanation: 'Poor people had suffered for years. The Great Stink shows how reform accelerated when elites were directly affected.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Rapid urbanisation', back: 'Cities grew faster than housing, water and sanitation could cope.' },
            { front: 'Edwin Chadwick', back: '1842 report linked poor sanitation to low life expectancy. Still believed in miasma.' },
            { front: 'Laissez-faire', back: 'Limited government interference. Many Victorians opposed public health laws.' },
            { front: '1848 Public Health Act', back: 'Created boards of health, but mostly optional and underfunded.' },
            { front: 'John Snow', back: 'Mapped 1854 Broad Street cholera deaths. Proved waterborne spread. Removed pump handle.' },
            { front: '1875 Public Health Act', back: 'Compulsory clean water, sewers and medical officers. Move away from laissez-faire.' },
            { front: 'Joseph Bazalgette', back: 'Designed London\'s sewer system after the Great Stink. Engineering saved lives.' },
            { front: 'Great Stink 1858', back: 'Parliament smelled the Thames. Led to sewer reform. Shows elites accelerate reform.' },
          ]}
        ]
      },
    ]
  },

  // ── History Module 6: The Surgery Revolution ─────────────────────────────────
  {
    id: 'mod6',
    subject: 'History',
    number: 8,
    title: 'The surgery revolution',
    subtitle: 'Pain, infection & survival (1840–1900)',
    era: 'c1840–c1900',
    icon: '🔪',
    color: '#7A4515',
    colorLight: 'rgba(122,69,21,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'THE SURGEON WIPES HIS BLADE ON HIS APRON.',
        sub: 'The apron hasn\'t been washed in weeks. The crowd leans in. The patient is awake.',
        cta: 'STEP INTO THE THEATRE',
      },
      scenario: {
        location: 'A London operating theatre, 1840',
        hint: 'A surgeon is about to amputate a leg. He is wearing a blood-stained coat — a mark of experience. Spectators watch from tiered seats above. There is no anaesthetic. No antiseptic. Just speed, a saw, and luck.',
      },
      statement: 'Victorian surgeons often wore blood-covered coats with pride.',
      accentWords: ['blood-covered coats', 'pride'],
      explanation: "A filthy coat meant experience — the more blood, the more operations. Nobody knew this was also spreading infection. That changed with Lister and carbolic acid.",
      isTrue: true,
      wrongFeedback: 'It sounds shocking — but it\'s true. A filthy coat showed experience. The real danger wasn\'t the surgery. It was what came after.',
      correctFeedback: 'Correct. Many surgeons believed a dirty coat proved experience and toughness. The biggest killer wasn\'t the operation — it was infection afterwards.',
      loadingText: 'Examining the body of evidence…',
      bigQuestion: 'If surgery was this dangerous — why did anything ever improve?',
      revealHeader: 'Three revolutions changed surgery forever.',
      revealItems: [
        {
          emoji: '😴',
          label: 'Anaesthetics ended the screaming',
          detail: 'Before 1846, patients were awake for every cut. Speed was the only mercy. Ether and chloroform changed that — surgery became something patients could survive consciously.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🦠',
          label: 'Antiseptics ended the dying',
          detail: 'Anaesthetics saved pain but not lives. Patients still died of infection — gangrene, sepsis — after operations. Lister\'s carbolic acid spray, inspired by Pasteur, cut death rates dramatically.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '⚡',
          label: 'Technology accelerated everything',
          detail: 'X-rays (1895), blood transfusions and sterile operating theatres turned surgery from a desperate last resort into a precise science. The transformation took just 60 years.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Modern surgery was hard-won. Three revolutions. Sixty years. Millions of lives.',
    },
    intro: {
      learningGoals: [
        'Explain why speed mattered in pre-anaesthetic surgery',
        'Describe the impact of anaesthetics on surgery (1846 onwards)',
        'Explain why infection — not pain — was the main killer',
        'Describe Lister\'s use of carbolic acid and its significance',
        'Distinguish antiseptic surgery from aseptic surgery',
        'Explain how X-rays and blood transfusions advanced medicine',
      ],
    },
    outcomes: {
      intro: 'Between 1840 and 1900, surgery transformed from butchery into medicine. This is exactly how it happened.',
      bullets: [
        'Explain why pain, infection and blood loss each limited surgery differently',
        "Describe Simpson's discovery — and why surgeons resisted it",
        "See why Lister's antiseptic approach eventually saved millions of lives",
        'Connect these three breakthroughs to the drop in operating-theatre deaths',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Joseph Lister was the first surgeon to use anaesthetics.', isTrue: false },
        { type: 'choice', question: 'Antiseptic surgery works by...', options: ['Numbing the patient during operations', 'Killing bacteria to prevent post-op infection', 'Stopping blood loss during surgery'], correct: 1 },
        { type: 'connection', question: 'Surgery survival rates improved most when...', options: [
          { text: 'Surgeons learned to work faster', icon: 'gear' },
          { text: 'Pain, infection and blood loss were each solved', icon: 'lightbulb' },
          { text: 'Hospitals were built larger and better lit', icon: 'house' },
        ], correct: 1 },
      ],
    },
    stageNavigation: [
      { id: 'part-1', title: 'The Three Enemies of Surgery', description: 'Pain, infection and blood loss before the 1840s.', screenIndex: 0 },
      { id: 'part-2', title: 'Pain: The Patient\'s Nightmare', description: 'Anaesthetics from Davy to Simpson.', screenIndex: 1 },
      { id: 'part-3', title: 'Infection: The Invisible Killer', description: 'Lister, carbolic acid and antiseptic surgery.', screenIndex: 2 },
      { id: 'part-4', title: 'Blood Loss and Better Technique', description: 'X-rays, blood transfusions and aseptic surgery.', screenIndex: 5 },
      { id: 'part-5', title: 'From Last Resort to Real Treatment', description: 'Source skills and the surgical transformation.', screenIndex: 6 },
      { id: 'part-6', title: 'Exam Prep: Why Surgery Improved', description: 'Exam practice and final application.', screenIndex: 7 },
    ],
    screens: [

      // Screen 1 — Speed Surgery
      {
        label: 'Speed Surgery',
        kicker: 'Before 1846',
        heading: 'The faster the surgeon, the better.',
        sub: 'Before anaesthetics, speed was the only mercy. This is what surgery looked like.',
        blocks: [
          {
            type: 'read',
            label: '🔪 Robert Liston: The Fastest Knife in the West End',
            text: 'Robert Liston was celebrated as Britain\'s greatest surgeon in the 1840s. He could amputate a leg in under 30 seconds. Spectators packed the viewing gallery above the operating theatre. Patients were held down by assistants. There was no anaesthetic. The louder you screamed, the longer it felt. Speed was mercy — it reduced the duration of agony.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'One of Liston\'s operations reportedly killed three people: the patient (from infection), his assistant (whose fingers Liston accidentally amputated in the rush), and a spectator who fainted and died of shock. The operation was technically a success. It had a 300% mortality rate.',
          },
          {
            type: 'quiz',
            question: 'Which problem made speed the most important skill in surgery before 1846?',
            options: [
              { text: 'Lack of gloves and protective equipment', correct: false },
              { text: 'Lack of anaesthetics — patients were fully conscious', correct: true },
              { text: 'Lack of microscopes to see inside the body', correct: false },
              { text: 'Lack of hospitals with enough space', correct: false },
            ],
            explanation: 'Without anaesthetics, patients were awake through every cut. The faster the operation, the less time they spent in agony. Speed was a surgical skill — not a risk.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Without anaesthetics, speed reduced suffering." — This is the phrase that explains pre-1846 surgery in AQA answers. Not: "surgeons were skilled." Use this.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Precise contextual explanation scores more than dramatic description. Don\'t write "surgery was horrible." Write: "Without anaesthetics, patients were conscious throughout — so speed was critical to reduce the duration of pain."',
          },
        ],
      },

      // Screen 2 — Anaesthetics
      {
        label: 'Anaesthetics',
        kicker: '1846 onwards',
        heading: 'Patients could finally sleep through surgery.',
        sub: 'Ether and chloroform transformed what surgery could attempt. But they didn\'t solve everything.',
        blocks: [
          {
            type: 'read',
            label: '😴 The Transformation',
            text: '<strong>1846: Ether</strong> — an American dentist, William Morton, used ether as the first surgical anaesthetic. The news reached Britain within months.<br/><br/><strong>1847: Chloroform</strong> — James Simpson, a Scottish obstetrician, discovered chloroform was faster and more reliable than ether. He used it in childbirth.<br/><br/><strong>1853: Royal approval</strong> — Queen Victoria used chloroform during the birth of Prince Leopold. This removed religious objections and made anaesthetics socially acceptable.',
          },
          {
            type: 'keypoint',
            text: '⚡ <strong>The paradox of anaesthetics:</strong> Making surgery painless made it MORE dangerous in the short term. Surgeons could now attempt longer, more ambitious operations — but infection still killed. More surgery = more deaths from infection. The death rate initially <em>rose</em> after anaesthetics were introduced.',
          },
          {
            type: 'quiz',
            question: 'Which statement about the impact of anaesthetics is MOST accurate for an AQA answer?',
            options: [
              { text: 'Anaesthetics solved most surgical deaths', correct: false },
              { text: 'Anaesthetics made surgery painless but infection remained the main killer', correct: true },
              { text: 'Anaesthetics stopped surgical bleeding', correct: false },
              { text: 'Anaesthetics prevented post-operative gangrene', correct: false },
            ],
            explanation: 'Anaesthetics solved pain — not infection. Death rates from surgery didn\'t fall significantly until Lister tackled infection with antiseptics. This nuance is what AQA high-mark answers include.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Improved pain control allowed surgeons to attempt more complex operations — but infection rates initially rose as a result." This nuance separates A-grade from B-grade answers.',
          },
        ],
      },

      // Screen 3 — Infection: The Real Killer
      {
        label: 'The Real Killer',
        kicker: 'Infection',
        heading: 'Patients survived surgery… then died afterwards.',
        sub: 'Pain wasn\'t the main killer. Infection was. And nobody knew why — yet.',
        blocks: [
          {
            type: 'read',
            label: '🦠 What Was Killing Patients?',
            text: 'In the 1840s–1860s, nearly half of patients who underwent major surgery died — not from the operation itself, but from infection in the days that followed. <strong>Gangrene</strong> (tissue death from bacterial infection), <strong>sepsis</strong> (blood poisoning) and <strong>pyaemia</strong> (pus in the blood) were the killers.<br/><br/>Surgeons had no idea why. They didn\'t wash hands between patients. They reused instruments without sterilising them. Some proudly wore the same apron all day — the more blood, the more experienced you appeared.',
          },
          {
            type: 'quiz',
            question: 'A patient survives an amputation but develops a fever and dies three days later. What is the MOST likely cause?',
            options: [
              { text: 'Pain — the operation was too stressful', correct: false },
              { text: 'Blood loss — they lost too much during surgery', correct: false },
              { text: 'Infection — bacteria entered the wound', correct: true },
              { text: 'Broken bones — from being restrained during surgery', correct: false },
            ],
            explanation: 'Infection was the primary cause of post-operative death throughout this period. Bacteria entered wounds through dirty instruments, unwashed hands and contaminated dressings. The patient surviving surgery was only half the battle.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'In some hospitals in the 1850s, a surgeon might operate on ten patients in a morning — using the same unwashed instruments throughout. The ward floors were caked in blood. Instruments were cleaned with sawdust at best. Surgeons sometimes operated with dried pus on their tools from the previous patient. The word "hospitalism" was coined to describe the epidemic of infection contracted in hospitals themselves.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Infection — not pain — was the main killer after surgery." Gangrene, sepsis and pyaemia killed more patients than the operations themselves. This is the central point of this entire module.',
          },
        ],
      },

      // Screen 4 — Lister vs Infection
      {
        label: 'Lister',
        kicker: '1867',
        heading: 'Joseph Lister changes surgery forever.',
        headerImage: '/images/lister-1865.png',
        sub: 'Lister applied Pasteur\'s germ theory directly to surgery. The results were dramatic.',
        blocks: [
          {
            type: 'read',
            label: '🧴 What Lister Did',
            text: '<strong>Joseph Lister</strong> read Pasteur\'s germ theory and made the connection: if microorganisms cause decay and disease, they must be causing post-operative infection too.<br/><br/>From 1865, Lister began spraying wounds with <strong>carbolic acid</strong> during and after surgery. He also soaked dressings, instruments and his own hands in carbolic solution.<br/><br/>The results were immediate. His ward\'s post-operative death rate fell from around 45% to below 15%. He published his findings in <em>The Lancet</em> in 1867.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Lister used',
                after: 'acid to kill germs during and after surgery.',
                answer: 'carbolic',
                hints: ['A chemical spray used to kill bacteria.', 'It begins with "c" — it\'s the acid derived from coal tar.'],
              },
              {
                before: 'Pasteur\'s',
                after: 'theory inspired Lister to apply germ-killing methods to surgery.',
                answer: 'germ',
                hints: ['What did Pasteur identify as the cause of disease?', 'Starts with "g" — microorganisms that cause disease.'],
              },
              {
                before: 'Lister\'s use of carbolic acid is called',
                after: 'surgery — killing germs that are already present.',
                answer: 'antiseptic',
                hints: ['Anti = against. Septic = relating to infection.', 'This type of surgery kills germs after they enter — starts with "a."'],
              },
            ],
            correctMsg: 'Good. Lister → carbolic acid → antiseptic surgery → link to Pasteur. This chain is worth marks.',
            wrongMsg: 'Think about what Lister used and why. Go back to the read section.',
          },
          {
            type: 'quiz',
            question: 'Why was Lister\'s work revolutionary for surgery?',
            options: [
              { text: 'He discovered that germs cause disease', correct: false },
              { text: 'He directly applied germ theory to surgery, dramatically reducing infection deaths', correct: true },
              { text: 'He invented anaesthetics for surgical procedures', correct: false },
              { text: 'He created X-rays to see inside patients\' bodies', correct: false },
            ],
            explanation: 'Lister didn\'t discover germ theory — Pasteur did. But Lister made the crucial leap: applying germ theory to surgery. This is the distinction AQA rewards. The link Pasteur → Lister is essential in high-mark answers.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'High-mark answers LINK individuals together. Don\'t just write "Lister used carbolic acid." Write: "Lister applied Pasteur\'s germ theory to surgery — recognising that the microorganisms Pasteur identified must be causing post-operative infection." That chain scores the top marks.',
          },
        ],
      },

      // Screen 5 — Aseptic Surgery
      {
        label: 'Aseptic Surgery',
        kicker: 'Prevention',
        heading: 'Stop germs entering. Don\'t just kill them after.',
        sub: 'Antiseptic surgery treated infection. Aseptic surgery prevented it. The difference saved millions.',
        blocks: [
          {
            type: 'read',
            label: '🏥 From Antiseptic to Aseptic',
            text: '<strong>Antiseptic surgery</strong> (Lister, 1867): kill germs that have already entered the wound. Use carbolic spray. Better than nothing — but carbolic acid was harsh on skin and tissue.<br/><br/><strong>Aseptic surgery</strong> (1880s–1900s): prevent germs entering in the first place. <strong>Steam sterilisation</strong> of all instruments. <strong>Rubber gloves</strong> (William Halsted, 1890). Surgical <strong>masks</strong> and <strong>gowns</strong>. Scrubbing hands and arms before surgery. Purpose-built, clean <strong>operating theatres</strong> with tiled walls that could be washed down.<br/><br/>The shift from antiseptic to aseptic represents surgery becoming genuinely modern.',
          },
          {
            type: 'quiz',
            question: 'Which improvement PREVENTED germs entering surgery rather than killing them once inside?',
            options: [
              { text: 'Carbolic acid spray — applied to open wounds during surgery', correct: false },
              { text: 'Chloroform — administered to unconscious patients before cutting', correct: false },
              { text: 'Rubber gloves — preventing skin bacteria from the surgeon\'s hands entering wounds', correct: true },
              { text: 'Ether — used to reduce pain during the operation', correct: false },
            ],
            explanation: 'Rubber gloves prevent contamination from entering — that is the definition of aseptic. Carbolic acid kills germs already present — that is antiseptic. Chloroform and ether are anaesthetics, not infection controls.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Antiseptic kills germs already in the wound. Aseptic prevents germs entering the wound in the first place." If you can explain this distinction with an example of each, you are scoring maximum marks on this topic.',
          },
          {
            type: 'colsort',
            question: 'Antiseptic or aseptic technique?',
            columns: [
              { label: 'ANTISEPTIC\nKills germs after entry', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'ASEPTIC\nPrevents germs entering', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Carbolic acid spray on an open wound', col: 0, explanation: 'Antiseptic — carbolic acid kills microorganisms already in contact with the wound. Lister\'s method.' },
              { label: 'Steam-sterilising surgical instruments before use', col: 1, explanation: 'Aseptic — sterilising before surgery prevents any bacteria being introduced via instruments.' },
              { label: 'Soaking bandages in carbolic solution', col: 0, explanation: 'Antiseptic — treating dressings with carbolic acid kills bacteria on contact with the wound.' },
              { label: 'Surgeon wearing rubber gloves', col: 1, explanation: 'Aseptic — gloves create a barrier that prevents the surgeon\'s skin bacteria entering the patient\'s wound.' },
              { label: 'Tiled, washable operating theatre walls', col: 1, explanation: 'Aseptic — a clean, sterilisable environment reduces the bacteria present before surgery even begins.' },
              { label: 'Washing wound with antiseptic solution after cutting', col: 0, explanation: 'Antiseptic — treating the wound after opening it kills bacteria that have already entered.' },
            ],
            explanation: 'Antiseptic = reactive (kill what\'s there). Aseptic = preventative (stop it getting in). Modern surgery relies on both.',
          },
        ],
      },

      // Screen 6 — Technology: X-Rays & Blood Transfusions
      {
        label: 'X-Rays & Blood',
        kicker: 'Technology',
        heading: 'Doctors could finally see inside the body.',
        sub: 'Two breakthroughs that changed what medicine could diagnose and treat.',
        blocks: [
          {
            type: 'read',
            label: '⚡ X-Rays (1895)',
            text: 'Wilhelm Röntgen discovered X-rays in 1895. Within a year, they were being used in hospitals across Europe. For the first time, surgeons could locate <strong>bullets, fractures and internal injuries</strong> without opening the body first. Operations became more precise — surgeons knew exactly what they were dealing with before the first cut.',
          },
          {
            type: 'read',
            label: '🩸 Blood Transfusions',
            text: 'Blood transfusions had been attempted since the 17th century but were unreliable and often fatal. The discovery of <strong>blood groups</strong> (ABO system, Karl Landsteiner, 1901) made safe transfusion possible. Surgeons could now replace blood lost during major operations — extending the range of surgery that patients could survive.',
          },
          {
            type: 'quiz',
            question: 'Which development MOST helped surgeons locate internal injuries without opening the body first?',
            options: [
              { text: 'Antiseptic carbolic spray — killed bacteria inside wounds', correct: false },
              { text: 'Blood transfusions — replaced blood lost during surgery', correct: false },
              { text: 'X-rays — revealed fractures, bullets and internal structures', correct: true },
              { text: 'Chloroform anaesthesia — kept patients unconscious longer', correct: false },
            ],
            explanation: 'X-rays allowed diagnosis without cutting — surgeons could see exactly what they needed to treat before operating. This made surgery more targeted, safer and more successful.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Technology Accelerated Progress:</strong><br/><br/>⚡ <strong>X-rays (1895)</strong> — internal diagnosis without surgery<br/>🩸 <strong>Blood groups (1901)</strong> — safe transfusions<br/>🏥 <strong>Purpose-built theatres</strong> — sterile environments<br/>🔬 <strong>Better microscopes</strong> — identifying specific pathogens<br/><br/>Each breakthrough built on the others. Progress was cumulative, not sudden.',
          },
        ],
      },

      // Screen 7 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source REALLY suggest?',
        sub: 'AQA sources require inference — not description. Build the skill here.',
        blocks: [
          {
            type: 'read',
            label: '🔍 How to Analyse a Historical Source',
            text: 'AQA sources are not just there to be summarised. You must <strong>infer</strong> — what does the source suggest about conditions, attitudes or developments? Always link to your own knowledge to explain <strong>why</strong> the source shows what it shows.<br/><br/>A source showing a surgeon in a blood-stained coat doesn\'t just show you "it was dirty." It suggests that infection was not yet understood as a danger — otherwise, surgeons would have taken precautions.',
          },
          {
            type: 'quiz',
            question: 'A source shows a Victorian operating theatre: crowded spectators, a surgeon in a stained apron, no protective equipment, an unconscious patient. Which student gives the best historical inference?',
            options: [
              { text: 'Student A: "The source shows Lister invented surgery."', correct: false },
              { text: 'Student B: "The unconscious patient suggests anaesthetics were in use, but the absence of gloves or clean clothing indicates the germ theory of infection had not yet been applied to surgery."', correct: true },
              { text: 'Student C: "The surgeon looks experienced because his coat is dirty."', correct: false },
              { text: 'Student D: "The source tells us surgery was happening in a hospital."', correct: false },
            ],
            explanation: 'Student B uses the source as evidence — inferring from what IS and IS NOT present. The unconscious patient = anaesthetics used. No gloves/protective equipment = pre-Lister, pre-antiseptic era. This is how AQA top marks are earned.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Never just describe what you can see. Always infer what it SUGGESTS — and explain WHY using your own knowledge. "The source suggests X because Y — this is supported by the fact that Z." That three-part structure scores maximum inference marks.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula:</strong><br/>"The source suggests [X] because [detail from source]. This is significant because [your own knowledge about the period]. However, the source cannot tell us [limitation]."',
          },
        ],
      },

      // Screen 8 — Timeline Challenge
      {
        label: 'Timeline Challenge',
        kicker: 'Interactive',
        heading: 'WHO DID WHAT?',
        sub: 'Match the person to their breakthrough.',
        blocks: [
          {
            type: 'timelinedrag',
            topicLabel: 'Medicine Through Time',
            heading: 'WHO DID WHAT?',
            sub: 'Drag each person to the achievement they are most famous for.',
            examTip: {
              title: 'EXAM ASSASSIN',
              body: 'Learn the individual + what changed.',
            },
            people: [
              { id: 'vesalius', name: 'ANDREAS VESALIUS', color: '#8B6914' },
              { id: 'harvey',   name: 'WILLIAM HARVEY',   color: '#6B4C9A' },
              { id: 'jenner',   name: 'EDWARD JENNER',    color: '#2D6A4F' },
              { id: 'simpson',  name: 'JAMES YOUNG SIMPSON', color: '#A63D2F' },
              { id: 'lister',   name: 'JOSEPH LISTER',    color: '#1A4A6B' },
            ],
            items: [
              {
                id: 'vesalius', date: '1543', icon: '📖',
                achievement: 'Wrote detailed anatomy books based on human dissection.',
                keyword: 'ANATOMY',
                answer: 'vesalius',
                reveal: 'Doctors began trusting direct observation instead of blindly following Galen.',
                hint: "Not them. 1543, anatomy books, proved Galen wrong. Think printing press + a man with a scalpel. 💀",
              },
              {
                id: 'harvey', date: '1628', icon: '🫀',
                achievement: 'Discovered the circulation of the blood.',
                keyword: 'CIRCULATION',
                answer: 'harvey',
                reveal: 'Understanding circulation transformed anatomy — but treatments took longer to catch up.',
                hint: "Wrong person. This slot is heart, pump, blood going round and round. 1628. Not anatomy books. 👀",
              },
              {
                id: 'jenner', date: '1796', icon: '💉',
                achievement: 'Developed the smallpox vaccine to prevent disease.',
                keyword: 'VACCINATION',
                answer: 'jenner',
                reveal: 'Vaccination became one of the biggest breakthroughs in medical history.',
                hint: "Nope. Milkmaids got cowpox, didn't get smallpox — someone noticed. Vaccines. Prevention. Not surgery. 💉",
              },
              {
                id: 'simpson', date: '1847', icon: '☠️',
                achievement: 'Pioneered the use of anaesthesia in surgery.',
                keyword: 'ANAESTHESIA',
                answer: 'simpson',
                reveal: 'Surgery became less terrifying because patients could be unconscious.',
                hint: "Not that one. This slot ended the screaming — patients out cold. Chloroform, 1847. Don't mix it up with the infection guy. 😴",
              },
              {
                id: 'lister', date: '1867', icon: '🧴',
                achievement: 'Introduced antiseptic surgery to prevent infection.',
                keyword: 'ANTISEPTIC SURGERY',
                answer: 'lister',
                reveal: 'Antiseptics massively reduced deadly post-surgery infections.',
                hint: "Wrong end. Carbolic acid. Sprayed it on wounds, on instruments, on surgeons. Last breakthrough on the timeline. 🧴",
              },
            ],
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: Could This Patient Survive?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Scenario',
            text: '1845: A patient needs a leg amputation. The theatre is unsterilised. The instruments were last used this morning. There is no anaesthetic. No antiseptic. No X-ray. Explain how surgery would change between 1845 and 1900 — and what those changes meant for this kind of patient.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain why surgery before 1846 was so dangerous. Give at least TWO reasons.',
            markPoints: `- No anaesthetics: patients were conscious, causing severe pain and shock — surgeons had to operate as fast as possible
- No antiseptics or understanding of infection: dirty instruments, unwashed hands and contaminated dressings caused post-operative infection
- Infection (gangrene, sepsis, pyaemia) killed a high proportion of surgical patients
- No sterilisation of equipment — the same instruments used on multiple patients spread bacteria
- Speed was prioritised over precision — rushed surgery increased complications
- Award 1 mark per developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Change and Causation',
            question: 'Explain how Lister\'s work transformed surgery between 1865 and 1900. Why does his connection to Pasteur matter for AQA marks?',
            markPoints: `- Lister applied Pasteur's germ theory to surgery: recognised microorganisms caused post-operative infection
- Introduced carbolic acid spray to wounds, instruments and dressings (antiseptic surgery) from 1865
- Published in The Lancet 1867 — spread the technique through the medical profession
- Post-operative death rate fell dramatically: from ~45% to below 15% on his ward
- Led eventually to aseptic surgery: sterilised instruments, rubber gloves, clean theatres, surgical gowns
- Link to Pasteur: Lister did not discover germ theory — he APPLIED it. The examiner rewards the chain: Pasteur → Lister → antiseptic surgery → aseptic surgery
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Anaesthetics were the most important development in surgery between 1840 and 1900." How far do you agree? Explain your answer.',
            markPoints: `- Agreement — anaesthetics were significant:
  - Ended conscious suffering during operations (ether 1846, chloroform 1847)
  - Allowed surgeons to attempt more complex, longer procedures
  - Removed a major barrier to surgical progress — patient movement and shock
  - Queen Victoria's use (1853) gave anaesthetics social respectability
- Disagreement — antiseptics/aseptics were more important:
  - Anaesthetics did NOT reduce death rates — infection still killed ~45% post-operatively
  - Death rates only fell when Lister introduced carbolic acid (1867)
  - Aseptic techniques completed the transformation — preventing germs rather than just killing them
  - Without tackling infection, surgery remained extremely dangerous despite being painless
- X-rays and blood transfusions: honourable mention — extended the range and safety of surgery but built on the antiseptic/aseptic foundations
- Strong conclusion: anaesthetics were a NECESSARY but INSUFFICIENT development. The most important shift was from dirty to clean surgery — Lister's antiseptics and the subsequent aseptic revolution. Anaesthetics enabled longer operations; antiseptics made them survivable.
- Award marks for: AO1 knowledge of both sides, AO2 using specific evidence, AO3 sustained argument with justified conclusion`,
          },
        ],
      },

      // Screen 9 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. No notes.',
        sub: 'Six questions. Everything from this module. Answer before you check.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Retrieval practice — testing yourself without looking back — is the fastest way to build long-term memory. Do this seriously and these facts will still be there on exam day.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'Why did speed matter so much in surgery before 1846?',
                    options: [
                      'Because patients were conscious and every second in pain — speed was the only mercy',
                      'Because hospitals had to clear operating theatres quickly for more patients',
                      'Because blood loss was faster in longer operations',
                      'Because anaesthetic gases were only available for short periods',
                    ],
                    correct: 0,
                    feedback: 'No anaesthetics meant every second of surgery was agony. Speed reduced the duration of conscious suffering — it was literally merciful to be fast.',
                    hint: 'What did patients not have in 1845 that they had in 1847?',
                  },
                  {
                    q: 'What did Lister use to combat infection after surgery?',
                    options: [
                      'Carbolic acid spray applied to wounds and instruments',
                      'Ether gas pumped into the operating theatre',
                      'Boiling water to clean all instruments before use',
                      'Chloroform soaked into surgical dressings',
                    ],
                    correct: 0,
                    feedback: 'Lister used carbolic acid (phenol) — sprayed on wounds, soaked into dressings, and applied to instruments. This was antiseptic surgery.',
                    hint: 'Think: what acid begins with "c" and was derived from coal tar?',
                  },
                  {
                    q: 'What is the difference between antiseptic and aseptic surgery?',
                    options: [
                      'Antiseptic kills germs in the wound; aseptic prevents germs entering in the first place',
                      'Antiseptic prevents all germs; aseptic uses chemicals to reduce infection',
                      'Antiseptic is a type of anaesthetic; aseptic is a sterilisation technique',
                      'Antiseptic is the modern approach; aseptic was the Victorian approach',
                    ],
                    correct: 0,
                    feedback: 'Antiseptic = kill germs already present (Lister\'s carbolic acid). Aseptic = prevent germs entering (sterilised instruments, rubber gloves, sterile theatres). Know this cold.',
                    hint: 'Think about what each word means. Anti-septic = against infection. A-septic = without infection.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'Why did death rates from surgery not fall immediately after anaesthetics were introduced in 1846?',
                    options: [
                      'Because infection still killed patients after operations — anaesthetics only addressed pain',
                      'Because anaesthetics were not widely used until the 1880s',
                      'Because patients were still conscious during surgery in many hospitals',
                      'Because blood transfusions were not yet available to replace blood loss',
                    ],
                    correct: 0,
                    feedback: 'Anaesthetics solved pain — not infection. Post-operative death rates from gangrene, sepsis and pyaemia remained high until Lister\'s antiseptic methods reduced them from the late 1860s onward.',
                    hint: 'What was the main cause of death after operations — not during them?',
                  },
                  {
                    q: 'A surgeon in 1855 wears a dirty apron, reuses unsterilised instruments and never washes his hands. Which development would MOST reduce his patients\' death rate?',
                    options: [
                      'Adopting Lister\'s carbolic acid spray and antiseptic technique',
                      'Learning to operate more quickly',
                      'Using ether before each operation',
                      'Moving to a larger hospital with more assistants',
                    ],
                    correct: 0,
                    feedback: 'Lister\'s antiseptic technique would directly address the cause of most post-operative deaths — infection from contaminated instruments, hands and dressings. Speed and anaesthetics don\'t tackle infection.',
                    hint: 'Which development in this module specifically targeted infection from dirty equipment?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Explain why linking Pasteur and Lister is important in a high-mark AQA answer about surgery.',
                    options: [
                      'Because Lister did not discover germ theory himself — he applied Pasteur\'s discovery to surgery. The chain shows how scientific understanding transferred into medical practice.',
                      'Because Pasteur and Lister were colleagues who worked together in the same laboratory.',
                      'Because Pasteur invented antiseptics and Lister was the first surgeon to use them in operations.',
                      'Because both men proved that germs cause disease independently of each other.',
                    ],
                    correct: 0,
                    feedback: 'The Pasteur → Lister link demonstrates that Lister\'s achievement was APPLICATION, not discovery. AQA rewards answers that show how scientific knowledge (germ theory) led to medical change (antiseptic surgery). That\'s cause and consequence — the core of historical thinking.',
                    hint: 'Who discovered germ theory? Who applied it to surgery? What was the relationship between those two events?',
                  },
                  {
                    q: 'Evaluate which was more important: the introduction of anaesthetics OR the introduction of antiseptics. Identify the strongest argument.',
                    options: [
                      'Antiseptics were more important because anaesthetics reduced pain but did not reduce death rates — only tackling infection made surgery survivable.',
                      'Anaesthetics were more important because without them, surgery could not be attempted at all.',
                      'Both were equally important — neither alone was sufficient to make surgery safe.',
                      'X-rays were the most important because they allowed diagnosis without cutting.',
                    ],
                    correct: 0,
                    feedback: 'This is the strongest argument for AQA evaluation: anaesthetics were NECESSARY but INSUFFICIENT. Death rates only fell when infection was addressed. Antiseptics (and later aseptics) were what made surgery survivable — not merely less painful. Option C is also defensible, but option A is the sharpest evaluation.',
                    hint: 'Which development actually reduced the death rate from surgery? Which only reduced pain?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You survived Victorian surgery.</strong> Statistically impressive.<br/><br/>You now understand one of the biggest turning points in medical history: why surgery was terrifying before 1840, how anaesthetics changed what was possible, why infection was the real killer, how Lister transformed surgery, the antiseptic/aseptic distinction, and how X-rays accelerated the revolution.<br/><br/>That\'s the Surgery Revolution done.',
          },
        ],
      },
    ],
  },

  // ── History Module 7: The War Against Infection ──────────────────────────────
  {
    id: 'mod7',
    subject: 'History',
    number: 9,
    title: 'The accidental miracle',
    subtitle: 'Magic bullets, penicillin & the antibiotic revolution',
    era: 'c1890–c1945',
    icon: '💊',
    color: '#7A4515',
    colorLight: 'rgba(122,69,21,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A SCIENTIST RETURNS FROM HOLIDAY. THERE IS MOULD ON HIS PETRI DISH.',
        sub: 'Most scientists would throw it away. This one paused. And changed medicine forever.',
        cta: 'INVESTIGATE THE DISH',
      },
      scenario: {
        location: 'St Mary\'s Hospital, London, 1928',
        hint: 'Alexander Fleming has returned from a summer holiday to find one of his bacterial cultures contaminated with mould. Bacteria near the mould are dying. It looks like a ruined experiment.',
      },
      statement: 'Alexander Fleming intentionally set out to invent penicillin.',
      accentWords: ['intentionally'],
      explanation: "Fleming returned from holiday to find mould on a contaminated dish. The bacteria near it were dying. He almost threw it away. The discovery was entirely accidental.",
      isTrue: false,
      wrongFeedback: 'Fleming\'s discovery was accidental — he noticed something unusual in a contaminated dish he was about to throw away. But the harder question is what happened AFTER the accident.',
      correctFeedback: 'Correct. Penicillin was discovered by accident. But turning it into a working medicine required years of research, teamwork and wartime funding. Luck was just the beginning.',
      loadingText: 'Culturing the evidence…',
      bigQuestion: 'If the discovery was accidental — who actually saved millions of lives?',
      revealHeader: 'Discovery was just the beginning.',
      revealItems: [
        {
          emoji: '🧫',
          label: 'Fleming noticed mould killing bacteria',
          detail: 'In 1928, a contaminated petri dish showed mould (Penicillium notatum) producing something that killed the surrounding bacteria. Fleming named the substance penicillin — but couldn\'t purify or stabilise it.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🔬',
          label: 'Florey and Chain turned it into medicine',
          detail: 'In 1940, Howard Florey and Ernst Chain at Oxford purified penicillin, tested it on mice, then humans. Their work transformed Fleming\'s observation into a usable drug.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '⚔️',
          label: 'WWII forced mass production',
          detail: 'Without the wartime urgency of WWII, mass production would have taken decades longer. American factories produced millions of doses. By D-Day, penicillin was saving lives on the battlefield.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Accident + observation + teamwork + war = the antibiotic revolution. All four mattered.',
    },
    intro: {
      learningGoals: [
        'Explain why bacterial infection was so deadly before antibiotics',
        'Describe Ehrlich\'s magic bullet concept and Salvarsan 606',
        'Explain Fleming\'s accidental discovery of penicillin',
        'Explain why development by Florey and Chain mattered more than discovery',
        'Describe how WWII accelerated mass production of penicillin',
        'Evaluate the relative importance of individuals, teamwork, science and war',
      ],
    },
    outcomes: {
      intro: 'From magic bullets to penicillin, the 20th century declared war on infection — and started winning.',
      bullets: [
        "Explain what Ehrlich meant by a 'magic bullet' and why it mattered",
        'Describe how Fleming accidentally discovered penicillin',
        'See how Florey and Chain turned a lab curiosity into a life-saving drug',
        'Understand why antibiotic resistance is the next crisis',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Fleming set out deliberately to discover penicillin.', isTrue: false },
        { type: 'choice', question: 'Ehrlich called Salvarsan a \'magic bullet\' because...', options: ['It worked immediately with no side effects', 'It targeted syphilis specifically without harming the patient', 'It was his 606th experimental compound'], correct: 1 },
        { type: 'connection', question: 'Penicillin saved lives in WWII because...', options: [
          { text: 'It was cheap enough for every soldier', icon: 'arrow' },
          { text: 'Florey and Chain produced it at mass scale for troops', icon: 'flask' },
          { text: 'It cured all infections including viral ones', icon: 'germ' },
        ], correct: 1 },
      ],
    },
    stageNavigation: [
      { id: 'part-1', title: 'The Mould That Shouldn\'t Matter', description: 'The infection problem and early magic bullet attempts.', screenIndex: 0 },
      { id: 'part-2', title: 'Before Antibiotics: Infection Wins', description: 'Ehrlich\'s magic bullets and the search for a cure.', screenIndex: 1 },
      { id: 'part-3', title: 'Fleming Notices the Accident', description: 'The mould, the petri dish and the accidental discovery.', screenIndex: 2 },
      { id: 'part-4', title: 'Florey, Chain and Mass Production', description: 'Oxford team, WWII catalyst and industrial production.', screenIndex: 4 },
      { id: 'part-5', title: 'A New Age of Treatment', description: 'The antibiotic revolution and the NHS.', screenIndex: 6 },
      { id: 'part-6', title: 'Exam Prep: Accident or Team Effort?', description: 'Exam practice and final application.', screenIndex: 8 },
    ],
    screens: [

      // Screen 1 — Why Infection Was Still Terrifying
      {
        label: 'Infection Kills',
        kicker: 'Before 1900',
        heading: 'A tiny cut could kill you.',
        sub: 'Even after Lister\'s antiseptics, bacterial infection inside the body remained almost untreatable.',
        blocks: [
          {
            type: 'read',
            label: '🦠 The Problem Nobody Had Solved',
            text: 'By the late 1800s, surgeons had learned to prevent infection entering wounds. But once bacteria were <em>inside</em> the body — in the bloodstream, lungs or organs — there was almost nothing medicine could do. <strong>Tuberculosis, pneumonia, sepsis, syphilis</strong> and infected wounds killed millions every year. Doctors could name the bacteria. They could not stop them.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'Before antibiotics, a scratch from a rose thorn could be fatal if bacteria entered the bloodstream. Sepsis — blood poisoning — killed within days. Soldiers in WWI were more likely to die of infected wounds than from direct battle injuries. Even childbirth remained life-threatening from puerperal fever (bacterial infection after delivery).',
          },
          {
            type: 'quiz',
            question: 'By 1900, germ theory had proven what caused bacterial diseases. Why were so many people still dying from infection?',
            options: [
              { text: 'Surgery had completely solved infection problems', correct: false },
              { text: 'Effective treatments to kill bacteria inside the body did not yet exist', correct: true },
              { text: 'Most infections had become easy to treat with existing medicines', correct: false },
              { text: 'Germ theory had been rejected by most doctors', correct: false },
            ],
            explanation: 'Germ theory explained CAUSE — it did not provide CURE. Doctors knew what bacteria were doing but had no way to stop them once inside the body. This is the key distinction: discovery of cause ≠ effective treatment.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Discovery of causes ≠ effective treatment." This distinction — knowing what causes disease vs being able to treat it — is one of the most important analytical points in GCSE History of Medicine.',
          },
        ],
      },

      // Screen 2 — Ehrlich & Magic Bullets
      {
        tag: 'magic-bullet',
        label: 'Magic Bullets',
        kicker: '1909',
        heading: 'Could medicine target bacteria directly?',
        sub: 'Paul Ehrlich had an idea that changed how scientists thought about treatment forever.',
        blocks: [
          {
            type: 'read',
            label: '🎯 The Magic Bullet Concept',
            text: '<strong>Paul Ehrlich</strong> (1854–1915) was a German scientist who had a revolutionary idea: what if you could find a chemical that would seek out and destroy specific bacteria — without harming the patient? He called this concept a <strong>"magic bullet."</strong><br/><br/>Ehrlich\'s team systematically tested hundreds of chemical compounds. On the 606th attempt, they found one that worked against syphilis. He named it <strong>Salvarsan 606</strong> (later improved as Neosalvarsan 914). It was the first modern targeted treatment for a bacterial disease.',
          },
          {
            type: 'quiz',
            question: 'Why was Salvarsan called a "magic bullet"?',
            options: [
              { text: 'It worked instantly against all bacteria', correct: false },
              { text: 'It targeted syphilis bacteria specifically without killing the patient', correct: true },
              { text: 'It cured every known bacterial disease', correct: false },
              { text: 'It replaced the need for surgery in all cases', correct: false },
            ],
            explanation: 'Magic bullet = targeted treatment. Salvarsan worked specifically against the syphilis bacterium (Treponema pallidum) without destroying healthy tissue. The targeting concept — not just killing everything — was the breakthrough.',
          },
          {
            type: 'keypoint',
            text: '⚡ <strong>Ehrlich\'s significance:</strong> He proved that targeted chemical treatments were possible. Before Salvarsan, doctors had no effective treatment for syphilis. Ehrlich\'s method — systematic, scientific testing — became the model for pharmaceutical drug development.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If a question asks about early 20th-century treatment breakthroughs — Ehrlich and Salvarsan 606 is your answer. Don\'t just say "magic bullet" — say: "Ehrlich\'s Salvarsan 606 (1909) was the first targeted chemical treatment, specifically attacking syphilis bacteria." Specificity scores marks.',
          },
        ],
      },

      // Screen 3 — Fleming's Accident
      {
        tag: 'penicillin',
        label: 'Fleming\'s Discovery',
        kicker: '1928',
        heading: 'The mould nobody cleaned up.',
        headerImage: '/images/fleming-1928.png',
        sub: 'The most important contaminated experiment in history.',
        blocks: [
          {
            type: 'read',
            label: '🧫 What Fleming Found',
            text: 'In September 1928, <strong>Alexander Fleming</strong> returned to his laboratory at St Mary\'s Hospital after a summer holiday. He noticed something unusual on one of his bacterial culture plates: a mould had contaminated it — and the bacteria surrounding the mould were dead.<br/><br/>The mould was <em>Penicillium notatum</em>. It was producing a substance that killed bacteria. Fleming named it <strong>penicillin</strong>.',
          },
          {
            type: 'quiz',
            question: 'Which combination of factors MOST explains how Fleming made his discovery?',
            options: [
              { text: 'Luck and observation — he noticed something unexpected and investigated it', correct: true },
              { text: 'Government funding and laboratory equipment', correct: false },
              { text: 'Surgical skill and medical training', correct: false },
              { text: 'Religious faith and patient care', correct: false },
            ],
            explanation: 'The contamination was accidental — luck. But recognising it as significant and investigating rather than discarding the dish — that was scientific observation. Both mattered. AQA loves asking about the combination.',
          },
          {
            type: 'funfact',
            label: '☠️ Very Bad Time To Be Alive',
            text: 'Fleming was actually studying influenza bacteria when the accident occurred. He had left a window open over the summer, allowing the mould spores to drift in. The laboratory conditions that allowed the discovery were considered sloppy and unprofessional. History\'s biggest breakthrough came from a messy lab and a holiday.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Luck alone did NOT create modern medicine." Fleming couldn\'t purify penicillin, couldn\'t make it stable, and couldn\'t produce enough to use clinically. His paper was largely ignored for over a decade. The discovery was just the first step.',
          },
        ],
      },

      // Screen 4 — Why Fleming Couldn't Finish the Job
      {
        label: 'Fleming\'s Limit',
        kicker: 'The Gap',
        heading: 'Discovery ≠ usable medicine.',
        sub: 'Fleming knew penicillin killed bacteria. He couldn\'t turn that into a treatment. Here\'s why.',
        blocks: [
          {
            type: 'read',
            label: '🔬 What Stopped Fleming',
            text: 'Fleming published his findings in 1929 but faced serious problems:<br/><br/>🧪 <strong>Instability</strong> — penicillin degraded rapidly and couldn\'t be kept stable enough for clinical use.<br/>🏭 <strong>Purification</strong> — extracting pure penicillin from the mould was extremely difficult with 1920s technology.<br/>💰 <strong>Funding</strong> — nobody invested significantly in developing it.<br/>⏳ <strong>Technology</strong> — the chemical techniques needed to work with penicillin didn\'t yet exist.<br/><br/>Fleming moved on. His 1929 paper was largely ignored for eleven years.',
          },
          {
            type: 'quiz',
            question: 'Why didn\'t penicillin become a usable medicine immediately after Fleming\'s discovery in 1928?',
            options: [
              { text: 'Fleming deliberately kept the discovery secret', correct: false },
              { text: 'It was extremely difficult to purify, stabilise and mass produce with existing technology', correct: true },
              { text: 'The government banned all antibiotic research', correct: false },
              { text: 'Germ theory was disproved shortly after the discovery', correct: false },
            ],
            explanation: 'Development is not the same as discovery. Fleming found the substance. Turning it into a stable, purifiable, mass-producible medicine required technology and expertise that didn\'t exist in 1928.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Key Phrase:</strong> "Development often matters more than discovery." This is a recurring theme in History of Medicine. Fleming gets the fame — but Florey and Chain did the harder work.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If a question asks "Why did it take so long for penicillin to become a medicine?" — your answer should mention: purification difficulties, unstable mould extract, no mass production technology, and lack of funding. Not: "Fleming forgot about it."',
          },
        ],
      },

      // Screen 5 — Florey & Chain
      {
        label: 'Florey & Chain',
        kicker: '1940–1941',
        heading: 'The team that actually saved millions.',
        headerImage: '/images/florey-chain-1941.png',
        sub: 'In Oxford, two scientists picked up where Fleming left off — and changed everything.',
        blocks: [
          {
            type: 'read',
            label: '🔬 The Oxford Team',
            text: 'In 1939, <strong>Howard Florey</strong> (Australian) and <strong>Ernst Chain</strong> (German refugee) at Oxford University began systematically working on penicillin.<br/><br/><strong>1940:</strong> They purified penicillin and tested it on eight mice infected with deadly streptococcus bacteria. The treated mice survived. The untreated ones died.<br/><br/><strong>1941:</strong> First human trial — a policeman with fatal sepsis. Penicillin began working. Then supplies ran out. He died. But the principle was proven.<br/><br/>They published their results and lobbied urgently for mass production.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why Florey and Chain matter more than Fleming for the development of penicillin?',
            options: [
              { text: 'They discovered that mould could kill bacteria', correct: false },
              { text: 'They purified penicillin, proved it worked clinically, and drove mass production', correct: true },
              { text: 'They invented antibiotics independently of Fleming', correct: false },
              { text: 'They were the first to use penicillin on patients in WWI', correct: false },
            ],
            explanation: 'Florey and Chain converted Fleming\'s 1928 observation into a usable, proven, clinically tested medicine. The mice experiment, the human trial, the purification — all Florey and Chain. Their work was arguably the more difficult and more important contribution.',
          },
          {
            type: 'funfact',
            label: '💡 A Wartime Workaround',
            text: 'During WWII, with penicillin desperately scarce, the Oxford team collected patients\' urine after treatment to extract and reuse the penicillin that passed through their bodies. Every molecule counted. Fleming, Florey and Chain all received the Nobel Prize in 1945.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Modern medicine usually depends on teams — not lone geniuses." Fleming made the observation. Florey and Chain did the development. American factories did the production. No single person created the antibiotic revolution.',
          },
        ],
      },

      // Screen 6 — WWII & Mass Production
      {
        tag: 'wwi-medicine',
        label: 'WWII & Production',
        kicker: '1941–1945',
        heading: 'War speeds everything up.',
        sub: 'Without WWII, widespread penicillin treatment would have taken decades longer.',
        blocks: [
          {
            type: 'read',
            label: '⚔️ The Wartime Catalyst',
            text: 'After the Oxford team proved penicillin worked, the challenge was scale. Britain was at war and lacked manufacturing capacity. Florey flew to America in 1941 to seek help.<br/><br/>American pharmaceutical companies — with government funding and wartime urgency — threw enormous resources at the problem. New fermentation techniques were developed. Deep-tank fermentation increased yields dramatically. By 1944, American factories were producing over 100 billion units of penicillin per month.<br/><br/>By D-Day (June 1944), Allied forces had enough penicillin to treat every infected wound on the battlefield.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST accelerated penicillin production from laboratory curiosity to mass-scale medicine?',
            options: [
              { text: 'The work of medieval monasteries preserving old texts', correct: false },
              { text: 'The individual genius of Alexander Fleming', correct: false },
              { text: 'World War II — creating urgent military demand and US government investment', correct: true },
              { text: 'The introduction of astrology-based medicine', correct: false },
            ],
            explanation: 'WWII created the demand, the funding and the urgency that transformed penicillin from a laboratory substance into a mass-produced medicine. Without the war, production would have been much slower. War accelerates medical progress — this is a key AQA theme.',
          },
          {
            type: 'colsort',
            question: 'Who was responsible for which stage of the penicillin story?',
            columns: [
              { label: 'DISCOVERY\n1928', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'DEVELOPMENT\n1940–41', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'MASS PRODUCTION\n1941–44', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
            ],
            items: [
              { label: 'Alexander Fleming notices mould killing bacteria', col: 0, explanation: 'Fleming made the accidental observation in 1928 — the discovery phase.' },
              { label: 'Florey and Chain purify penicillin and test on mice', col: 1, explanation: 'Oxford team 1940 — the development phase, turning observation into proven medicine.' },
              { label: 'American pharmaceutical companies scale up factories', col: 2, explanation: 'US industry with wartime government funding — mass production phase, 1941–44.' },
              { label: 'First human trial proves penicillin works clinically', col: 1, explanation: 'Florey and Chain\'s 1941 human trial — part of the development phase.' },
              { label: 'WWII creates urgent military demand for antibiotics', col: 2, explanation: 'The war created the scale of demand that forced mass production to be achieved quickly.' },
              { label: 'Fleming publishes paper describing the mould\'s effect', col: 0, explanation: 'Fleming\'s 1929 publication — completing the discovery phase, though largely ignored at the time.' },
            ],
            explanation: 'Three distinct phases. Three different groups. No single person or stage created modern antibiotics — all three were essential.',
          },
        ],
      },

      // Screen 7 — Antibiotics Change the World
      {
        label: 'The Revolution',
        kicker: 'Impact',
        heading: 'For the first time, infection could be beaten.',
        sub: 'The scale of change is difficult to overstate. Medicine was transformed in a decade.',
        blocks: [
          {
            type: 'read',
            label: '💊 Before and After Antibiotics',
            text: '<strong>Before antibiotics:</strong><br/>Pneumonia killed ~30% of those infected. TB was a death sentence for millions. Syphilis caused madness and death. An infected wound after surgery was often fatal. Childbirth carried serious infection risk.<br/><br/><strong>After antibiotics:</strong><br/>Bacterial pneumonia became treatable. TB mortality collapsed. Syphilis was curable. Post-surgical infection could be managed. Maternal mortality from infection fell dramatically. Life expectancy across the developed world rose sharply from the late 1940s onward.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why antibiotics mattered so much for medicine?',
            options: [
              { text: 'They dramatically reduced death rates from bacterial infections that had previously been untreatable', correct: true },
              { text: 'They replaced surgery in all medical procedures', correct: false },
              { text: 'They eliminated all disease from human populations', correct: false },
              { text: 'They ended the need for hospitals and medical staff', correct: false },
            ],
            explanation: 'Antibiotics solved the problem that had defeated medicine for centuries: killing bacteria inside the body without killing the patient. Death rates from treatable infections collapsed. This is what "revolutionary" means — not just improvement, but a fundamental change in what medicine could achieve.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Significance in one sentence:</strong> "Antibiotics were the first effective treatment for bacterial disease inside the body — transforming medicine from powerless in the face of infection to capable of defeating it." Use this construction in your exam answers.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Focus on impact and significance, not just description." Don\'t write: "Penicillin was important because it helped people." Write: "Penicillin reduced death rates from bacterial infection dramatically, transforming conditions like pneumonia and sepsis from death sentences into treatable illnesses — representing the single biggest leap in medicine\'s ability to treat disease."',
          },
        ],
      },

      // Screen 8 — The NHS
      {
        label: 'The NHS',
        kicker: '1948',
        heading: 'Free healthcare for everyone.',
        headerImage: '/images/nhs-1948.png',
        sub: 'The National Health Service opened on 5 July 1948. It was built on the same belief as penicillin: that medicine should reach everyone.',
        blocks: [
          {
            type: 'read',
            label: '🏥 What Was the NHS?',
            text: 'The National Health Service was created by Aneurin Bevan under the Labour government in 1948. For the first time in British history, healthcare was <strong>free at the point of use</strong> — paid for through taxation, available to everyone regardless of income.<br/><br/>Before the NHS: if you couldn\'t afford a doctor, you didn\'t see one. Medicines cost money. Surgery could bankrupt a family. The war had demonstrated what organised, state-funded medicine could achieve. The NHS was built on that lesson.',
          },
          {
            type: 'quiz',
            question: 'Why was the creation of the NHS in 1948 significant for medicine in Britain?',
            options: [
              { text: 'It made healthcare free and universally accessible for the first time, removing cost as a barrier to treatment', correct: true },
              { text: 'It gave doctors the power to prescribe penicillin without government approval', correct: false },
              { text: 'It replaced all existing hospitals with new purpose-built NHS buildings', correct: false },
              { text: 'It ended the need for private medical insurance in Britain permanently', correct: false },
            ],
            explanation: 'The NHS removed cost as a barrier to healthcare. Before 1948, many working-class people avoided doctors because they couldn\'t afford fees. Universal free access meant medical breakthroughs like penicillin could reach everyone, not just those who could pay.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>The NHS as a turning point:</strong> Medical breakthroughs like penicillin only save lives if people can <em>access</em> them. The NHS solved the access problem. It is why the antibiotic revolution benefited the whole population, not just the wealthy.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'If asked about factors in improving public health in the 20th century — always include the NHS (1948). It connects every medical breakthrough to universal access. Link it: "Penicillin was discovered in 1928 and mass-produced by the 1940s — but the NHS (1948) ensured everyone could access it, not just those who could afford private treatment."',
          },
        ],
      },

      // Screen 9 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source suggest about penicillin?',
        sub: 'Inference — not description. Build the skill here.',
        blocks: [
          {
            type: 'read',
            label: '🔍 The Source Analysis Challenge',
            text: 'AQA sources on penicillin often show: wartime hospital wards, soldiers recovering, factory production lines, or newspaper headlines about the "wonder drug." The skill is to move beyond what you can <em>see</em> and explain what the source <em>suggests</em> — using your own knowledge to explain <em>why</em>.',
          },
          {
            type: 'quiz',
            question: 'A source shows a wartime military hospital: rows of soldiers in beds, nurses administering injections, clearly recovering. Which student gives the strongest historical inference?',
            options: [
              { text: 'Student A: "Penicillin was important and helped soldiers."', correct: false },
              { text: 'Student B: "The organised administration of treatment suggests penicillin was being systematically used by 1944 — the volume of patients implies mass production had been achieved."', correct: true },
              { text: 'Student C: "There are lots of soldiers in hospital which shows WWII was dangerous."', correct: false },
              { text: 'Student D: "The nurses are giving injections which shows medicine was good."', correct: false },
            ],
            explanation: 'Student B uses the source as evidence — inferring from specific details (organised, systematic, high volume) and linking to own knowledge (mass production, wartime context). Students A, C and D describe without inferring. This is the difference between 1 mark and 4 marks.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula:</strong> "The source suggests [X] because [specific detail]. This is supported by the fact that [own knowledge]. However, the source cannot tell us [limitation]." Three parts. Every time.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Precise explanation beats vague praise." Student B scored higher not because they knew more — but because they explained MORE precisely. "Dramatically reduced deaths from bacterial infection" beats "was important." Precision wins marks.',
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: Why Did Penicillin Succeed?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Challenge',
            text: 'Explain why penicillin became a successful treatment by the 1940s. Your answers should connect Fleming, Florey and Chain, teamwork, technology, WWII and mass production. Write — then submit.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain what Alexander Fleming discovered in 1928 and why it was not immediately useful as a medicine.',
            markPoints: `- Fleming discovered penicillin accidentally — a mould (Penicillium notatum) was killing surrounding bacteria on a contaminated culture plate
- He named the substance penicillin and published findings in 1929
- It was NOT immediately useful because: it couldn't be purified with available technology; it was chemically unstable; there was no way to produce enough for clinical use; funding was not provided
- Discovery ≠ usable medicine — the development stage was still required
- Award 1 mark per valid developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Analysis',
            question: 'Explain why Florey and Chain\'s contribution to penicillin was arguably more important than Fleming\'s discovery.',
            markPoints: `- Florey and Chain purified penicillin using advanced chemical techniques (1940)
- They tested it systematically — first on mice, then on a human patient (1941)
- They proved it worked clinically — the first human trial demonstrated dramatic recovery
- They published results and actively lobbied for mass production and government/military funding
- Fleming could not solve purification, stability or production problems
- Without Florey and Chain, Fleming's observation would have remained a laboratory curiosity
- They drove the transition from discovery to usable medicine
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"WWII was the most important reason penicillin became a successful treatment by the 1940s." How far do you agree? Explain your answer.',
            markPoints: `- Agreement — WWII was crucial:
  - Created urgent military demand — infected wounds were killing soldiers faster than bullets
  - American government provided enormous funding for pharmaceutical companies
  - New fermentation techniques developed under wartime pressure
  - By D-Day 1944: 100 billion units produced per month — enough for battlefield treatment
  - Without wartime urgency, mass production would have taken decades longer
- Disagreement — other factors equally or more important:
  - Fleming's 1928 observation was the essential starting point — without it, nothing else follows
  - Florey and Chain's 1940 purification and clinical trials were required BEFORE mass production was possible
  - Ehrlich's earlier work on magic bullets showed targeted chemical treatment was achievable — inspired the field
  - Science and technology (new fermentation, chemical engineering) were prerequisites for production
- Balanced conclusion: WWII was the accelerant — it provided the funding and urgency to scale production rapidly. But without Fleming's discovery and Florey/Chain's development, there was nothing to produce. All three stages were necessary. WWII was arguably the most important in turning medicine into mass treatment — but discovery and development came first.
- Award marks for: AO1 knowledge across multiple factors, AO2 specific evidence and examples, AO3 sustained evaluation with justified conclusion`,
          },
        ],
      },

      // Screen 10 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. No notes.',
        sub: 'Six questions. Everything from this module. Answer before you check.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why Retrieval Works',
            text: 'Testing yourself without looking back builds long-term memory faster than rereading. These questions mix topics from across the whole module — exactly how AQA papers work.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'What did Paul Ehrlich call his concept of a chemical that targets specific bacteria?',
                    options: [
                      'A magic bullet',
                      'A penicillin compound',
                      'A germ antidote',
                      'A carbolic agent',
                    ],
                    correct: 0,
                    feedback: 'Magic bullet — a chemical that could target and destroy specific bacteria without harming the patient. Ehrlich\'s Salvarsan 606 (1909) was the first working example, treating syphilis.',
                    hint: 'Ehrlich wanted something that would "shoot" only the bacteria — like a targeted...',
                  },
                  {
                    q: 'How did Fleming discover penicillin?',
                    options: [
                      'Accidentally — he noticed mould killing bacteria on a contaminated culture plate',
                      'Deliberately — he designed an experiment to test whether mould could fight infection',
                      'Through a government-funded systematic research programme',
                      'By applying Ehrlich\'s magic bullet concept to mould cultures',
                    ],
                    correct: 0,
                    feedback: 'Fleming returned from holiday to find a contaminated dish where mould (Penicillium notatum) had killed surrounding bacteria. The discovery was accidental — the significance was noticed through careful observation.',
                    hint: 'He came back from holiday and found something he hadn\'t planned for...',
                  },
                  {
                    q: 'Which two scientists developed penicillin into a usable medicine?',
                    options: [
                      'Florey and Chain',
                      'Fleming and Ehrlich',
                      'Pasteur and Lister',
                      'Darwin and Koch',
                    ],
                    correct: 0,
                    feedback: 'Howard Florey and Ernst Chain at Oxford University purified penicillin, tested it on mice (1940), then humans (1941), and drove mass production. They shared the Nobel Prize with Fleming in 1945.',
                    hint: 'Oxford University, 1940 — two names, one Australian, one German refugee...',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A student writes: "Fleming discovered penicillin so he saved millions of lives." What is wrong with this answer?',
                    options: [
                      'It ignores the development work of Florey and Chain and the mass production driven by WWII — discovery alone didn\'t save lives',
                      'Fleming didn\'t actually discover penicillin — Florey did',
                      'Penicillin hasn\'t actually saved millions of lives',
                      'The answer is correct and nothing is wrong with it',
                    ],
                    correct: 0,
                    feedback: 'Fleming observed penicillin — but couldn\'t purify, stabilise or produce it. Florey and Chain developed it into medicine. WWII produced it at scale. All three stages were necessary. Attributing everything to one person misses the key analytical point.',
                    hint: 'What happened AFTER Fleming\'s discovery that actually got penicillin to patients?',
                  },
                  {
                    q: 'Why is the phrase "discovery of causes ≠ effective treatment" important in the history of infection?',
                    options: [
                      'Germ theory (1860s) identified bacteria as the cause of disease — but doctors couldn\'t kill bacteria inside the body until antibiotics in the 1940s',
                      'Medieval doctors knew what caused disease but chose not to treat it',
                      'Fleming discovered the cause of infection and immediately created a treatment',
                      'Ehrlich proved germ theory was wrong by discovering magic bullets',
                    ],
                    correct: 0,
                    feedback: 'This is one of the biggest analytical points in the module: 80 years passed between Pasteur identifying bacteria (1860s) and penicillin being mass-produced (1940s). Knowledge of cause did not mean ability to treat. That gap explains why so many people still died from infection in the late 19th and early 20th centuries.',
                    hint: 'When was germ theory established? When were antibiotics mass-produced? What happened in between?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Evaluate: which was more important for the development of penicillin — Fleming\'s discovery or Florey and Chain\'s development?',
                    options: [
                      'Florey and Chain were arguably more important: their purification, clinical trials and production drive converted a lab curiosity into medicine that saved lives. Without development, discovery was worthless.',
                      'Fleming was more important because without the initial discovery there would have been nothing to develop.',
                      'Both were equally important — you cannot evaluate which mattered more.',
                      'WWII was the most important factor because it provided the funding.',
                    ],
                    correct: 0,
                    feedback: 'This is the strongest evaluative answer. Option A acknowledges Fleming\'s necessity but argues development was harder and more consequential — and explains WHY. Option B is true but doesn\'t evaluate. Option C dodges evaluation. Option D is valid for a different question but doesn\'t address this one.',
                    hint: 'Which stage actually got penicillin into patients\' bodies? Which stage just identified the substance?',
                  },
                  {
                    q: '"War is a major factor in medical progress." Using penicillin as evidence, what is the strongest way to support this claim?',
                    options: [
                      'WWII created urgency and US government investment that scaled penicillin production from grams to tons within three years — something peacetime science could not have achieved in under a decade',
                      'War means more patients are injured, so doctors get more practice',
                      'Wars cause governments to care more about medicine generally',
                      'WWII meant more scientists were working in laboratories',
                    ],
                    correct: 0,
                    feedback: 'The strongest support for "war accelerates progress" is SPECIFIC: describe the scale of production change (grams → tons), the mechanism (US government investment + urgency), and the timeframe (three years). General statements about governments caring or doctors practicing don\'t demonstrate the specific mechanism.',
                    hint: 'Be specific: what exactly did WWII do to penicillin production? How quickly? What scale?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You survived the age before antibiotics.</strong> That was genuinely difficult.<br/><br/>You now understand one of the greatest medical breakthroughs in history: why infection was still killing people despite germ theory, how Ehrlich\'s magic bullets opened the door, how Fleming made his accidental observation, why Florey and Chain did the harder work, and how WWII turned laboratory science into mass medicine.<br/><br/>That\'s the War Against Infection done.',
          },
        ],
      },
    ],
  },

  // ── History Module 8: Inside Modern Medicine ──────────────────────────────────
  {
    id: 'mod8',
    subject: 'History',
    number: 10,
    title: 'Inside modern medicine',
    subtitle: 'Scans, transplants, DNA & the future',
    era: 'c1945–present',
    icon: '🧬',
    color: '#1A5276',
    colorLight: 'rgba(26,82,118,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A SURGEON STUDIES A 3D SCAN. THE PATIENT IS NOT YET IN THE ROOM.',
        sub: 'Robotic arms hold the instruments. The incision will be 1cm. The patient goes home tomorrow.',
        cta: 'ENTER MODERN MEDICINE',
      },
      scenario: {
        location: 'A modern operating theatre, 2024',
        hint: 'A surgeon studies a full 3D body scan before making a single cut. Robotic surgical tools move with sub-millimetre precision. The patient\'s DNA has already flagged a genetic risk factor. To a doctor in 1900, this would feel like science fiction.',
      },
      statement: 'Modern medicine mainly improved because doctors became more intelligent.',
      isTrue: false,
      accentWords: ['more intelligent'],
      explanation: "Intelligence had almost nothing to do with it. Government investment, the NHS, technology, genetics and teamwork transformed what medicine could do — not cleverness.",
      wrongFeedback: 'Individual brilliance mattered — but it was technology, teamwork, government funding and communication that transformed medicine. No single person or factor did it alone.',
      correctFeedback: 'Correct. Modern medicine improved because of technology, scientific discoveries, government funding, computers, communication and teamwork — not simply because doctors became smarter.',
      loadingText: 'Scanning the evidence…',
      bigQuestion: 'If it wasn\'t intelligence alone — what actually transformed medicine?',
      revealHeader: 'Technology and teamwork transformed medicine.',
      revealItems: [
        {
          emoji: '🧬',
          label: 'DNA and genetics',
          detail: 'Understanding the genetic code of life allowed medicine to predict disease risk, develop targeted treatments and begin personalising medicine to the individual patient.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🖥️',
          label: 'Medical scanning technology',
          detail: 'X-rays, CT scans, MRI and ultrasound allowed doctors to see inside the body without cutting it open. Diagnosis became faster, safer and more accurate than ever before.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
        {
          emoji: '🤖',
          label: 'Precision surgery and robotics',
          detail: 'Keyhole and robotic surgery reduced incision size, recovery time and risk. Operations that once required weeks of recovery now take hours. Surgery became a science of precision, not just survival.',
          color: '#9A5A18',
          bg: 'rgba(154,90,24,.08)',
        },
      ],
      punchline: 'Modern medicine became powerful through science, technology, government support and teamwork — not individual genius alone.',
    },
    intro: {
      learningGoals: [
        'Explain how scanning technology transformed diagnosis',
        'Describe transplant surgery and why early attempts failed',
        'Explain the significance of keyhole and robotic surgery',
        'Explain the discovery of DNA and its significance for medicine',
        'Identify the ethical debates created by modern medical technology',
        'Evaluate which factors most transformed medicine after 1945',
      ],
    },
    outcomes: {
      intro: 'Scans, transplants, genetic sequencing — the 20th century changed what medicine could even imagine doing.',
      bullets: [
        'Describe how diagnostic technology changed the way doctors see inside the body',
        'Explain what finally made organ transplants possible',
        'See how DNA changed our understanding of disease and treatment',
        'Discuss the ethical questions that modern medicine has created',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'The first successful organ transplant was a heart transplant.', isTrue: false },
        { type: 'choice', question: 'DNA\'s double helix was discovered by...', options: ['Einstein and Oppenheimer', 'Watson, Crick, Franklin and Wilkins', 'Koch and Pasteur'], correct: 1 },
        { type: 'connection', question: 'Modern medicine\'s biggest challenges are...', options: [
          { text: 'Lack of scientific knowledge and technology', icon: 'atom' },
          { text: 'Cost, access and difficult ethical decisions', icon: 'people' },
          { text: 'Too many competing treatments available', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    // TODO: mod8 focuses on technology rather than NHS access; Part 4 index is approximate.
    stageNavigation: [
      { id: 'part-1', title: 'Medicine Starts Looking Inside', description: 'Medical scanning and new diagnostic tools.', screenIndex: 0 },
      { id: 'part-2', title: 'Diagnosis Gets Powerful', description: 'Transplants and high-tech treatment breakthroughs.', screenIndex: 1 },
      { id: 'part-3', title: 'Treatment Becomes High-Tech', description: 'Precision surgery, DNA and genetic medicine.', screenIndex: 2 },
      { id: 'part-4', title: 'The NHS Changes Access', description: 'Medical ethics and society\'s new challenges.', screenIndex: 3 },
      { id: 'part-5', title: 'Progress With New Problems', description: 'Ethics, limits and unintended consequences of modern medicine.', screenIndex: 4 },
      { id: 'part-6', title: 'Exam Prep: Modern Medicine\'s Big Leap', description: 'Exam practice and final application.', screenIndex: 6 },
    ],
    screens: [

      // Screen 1 — Seeing Inside the Body
      {
        label: 'Medical Scanning',
        kicker: 'Diagnosis',
        heading: 'Doctors could finally see inside the body.',
        sub: 'For most of history, doctors guessed what was happening internally. Scanning technology changed everything.',
        blocks: [
          {
            type: 'read',
            label: '🔬 From Guesswork to Precision',
            text: 'Before modern scans, diagnosing internal problems meant:<br/>• Guessing based on symptoms<br/>• Exploratory surgery (opening the body to look)<br/>• Physical examination alone<br/><br/>Modern imaging changed diagnosis completely:<br/><br/>⚡ <strong>X-rays (1895)</strong> — revealed bone fractures and dense structures<br/>🔬 <strong>CT scans</strong> — detailed cross-section "slices" through the body; detect tumours, bleeds<br/>🧲 <strong>MRI scans</strong> — detailed soft tissue imaging; no radiation; sees muscles, brain, organs<br/>🌊 <strong>Ultrasound</strong> — uses sound waves; safe for monitoring unborn babies and soft tissue',
          },
          {
            type: 'quiz',
            question: 'Which development MOST improved doctors\' ability to diagnose internal problems safely?',
            options: [
              { text: 'Bloodletting — removing blood to rebalance the humours', correct: false },
              { text: 'MRI and CT scanning — revealing internal structures without surgery', correct: true },
              { text: 'Astrology — reading planetary alignments to predict illness', correct: false },
              { text: 'The Four Humours — balancing blood, phlegm and bile', correct: false },
            ],
            explanation: 'MRI and CT scanning transformed diagnosis by making the invisible visible — safely, without cutting the body open. Doctors could now detect tumours, bleeds and fractures that would previously have required exploratory surgery or remained undiagnosed.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin:</strong> "Technology often improved diagnosis BEFORE treatment." Scans allowed doctors to find and understand conditions precisely — making subsequent treatment far more targeted and effective. Don\'t just say scans "helped doctors." Say: "Scanning technology transformed diagnosis by revealing internal conditions without surgical intervention, enabling earlier and more accurate treatment."',
          },
          {
            type: 'funfact',
            label: '🧬 MRI: An Accidental Revolution',
            text: 'MRI (Magnetic Resonance Imaging) was developed from nuclear physics research in the 1970s. Raymond Damadian built the first human MRI scanner in 1977. It took 5 hours to produce a single chest scan. Modern MRI machines produce high-resolution full-body images in minutes. The principle — using magnetic fields to detect hydrogen atoms in body tissue — came from physics, not medicine. This is a classic example of technology from one field transforming another.',
          },
        ],
      },

      // Screen 2 — Transplant Surgery
      {
        label: 'Transplants',
        kicker: 'Surgery',
        heading: 'Doctors could replace failing body parts.',
        sub: 'The idea was simple. The biology was not.',
        blocks: [
          {
            type: 'read',
            label: '🏥 From Impossible to Routine',
            text: 'The first heart transplant was performed by <strong>Christiaan Barnard</strong> in South Africa in 1967. The patient survived 18 days. Early attempts at organ transplantation faced one problem above all others: <strong>rejection</strong> — the immune system attacking the transplanted organ as foreign tissue.<br/><br/>The breakthrough came from <strong>immunosuppressant drugs</strong> (particularly cyclosporine, developed in the 1970s–80s), which suppressed the immune response enough for transplanted organs to survive. Today, heart, kidney, liver, lung and even face transplants are performed routinely.',
          },
          {
            type: 'quiz',
            question: 'Why did many early organ transplants fail?',
            options: [
              { text: 'Surgeons had no anaesthetics available during transplant operations', correct: false },
              { text: 'The patient\'s immune system attacked and rejected the transplanted organ', correct: true },
              { text: 'Transplant surgery was made illegal in most countries before 1970', correct: false },
              { text: 'Surgeons lacked the equipment needed to perform basic transplant procedures', correct: false },
            ],
            explanation: 'The immune system is designed to destroy foreign tissue — which includes transplanted organs. Early transplants often failed because the body treated the new organ as an infection. Immunosuppressant drugs solved this by reducing the immune response enough for the organ to establish itself.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>The Transplant Chain:</strong> Surgery alone wasn\'t enough. Transplants required: surgical skill + anaesthetics + blood transfusions + immunosuppressant drugs + organ donor networks + refrigeration technology for organ transport. Modern medicine works in systems, not single solutions.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Strong GCSE answers explain WHY developments succeeded." Don\'t just write "transplants worked because of better surgery." Write: "Organ transplant success rates improved dramatically after the development of cyclosporine (immunosuppressant drugs) in the 1970s, which prevented the immune system from rejecting the transplanted organ."',
          },
        ],
      },

      // Screen 3 — Keyhole & Robotic Surgery
      {
        label: 'Precision Surgery',
        kicker: 'Surgery',
        heading: 'Smaller cuts. Faster recovery. Better outcomes.',
        sub: 'Modern surgery stopped being about survival and started being about precision.',
        blocks: [
          {
            type: 'read',
            label: '🔪 The Revolution in Surgical Technique',
            text: '<strong>Traditional open surgery:</strong> large incisions, significant blood loss, weeks of recovery, high infection risk, visible scarring.<br/><br/><strong>Keyhole surgery (laparoscopy):</strong> tiny incisions (1–3cm), a camera (laparoscope) and miniaturised instruments inserted through small holes. The surgeon watches on a screen. Recovery time falls from weeks to days.<br/><br/><strong>Robotic surgery (da Vinci system, 1999):</strong> the surgeon controls robotic arms with sub-millimetre precision from a console. Robotic arms don\'t shake. They can access areas of the body human hands cannot reach. Used in prostate surgery, heart procedures, complex abdominal operations.',
          },
          {
            type: 'colsort',
            question: 'Traditional open surgery or modern keyhole/robotic surgery?',
            columns: [
              { label: 'TRADITIONAL SURGERY\nOpen, larger, slower recovery', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'MODERN SURGERY\nPrecise, minimal, faster recovery', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Large abdominal incision to access organs', col: 0, explanation: 'Open surgery requires large cuts — useful when the surgeon needs to see and work directly, but causes greater trauma and longer recovery.' },
              { label: 'Camera inserted through a 1cm incision', col: 1, explanation: 'Laparoscopy — keyhole surgery uses a tiny camera (laparoscope) so the surgeon can see without opening the body fully.' },
              { label: 'Weeks of recovery in hospital after procedure', col: 0, explanation: 'Traditional open surgery often requires extended hospital stays and lengthy recovery as large wounds heal.' },
              { label: 'Patient discharged within 24 hours of procedure', col: 1, explanation: 'Keyhole surgery\'s minimal tissue damage means most patients can go home the same day or the next morning.' },
              { label: 'Robotic arms controlled by surgeon from a console', col: 1, explanation: 'The da Vinci system allows sub-millimetre precision — robotic arms don\'t tremble and can access regions human hands cannot.' },
              { label: 'Significant scarring visible after recovery', col: 0, explanation: 'Larger incisions leave larger scars. This is cosmetically and physically more demanding on the patient.' },
            ],
            explanation: 'Keyhole and robotic surgery changed the goal of surgery from "survive the operation" to "recover quickly and return to normal life." Precision became as important as survival.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains the significance of keyhole surgery?',
            options: [
              { text: 'It completely removed all surgical risk from modern procedures', correct: false },
              { text: 'It dramatically reduced recovery time and tissue damage, improving patient outcomes', correct: true },
              { text: 'It replaced all traditional surgeons with robotic systems', correct: false },
              { text: 'It eliminated infection as a risk in post-operative care', correct: false },
            ],
            explanation: 'Keyhole surgery\'s significance is reduced trauma, faster recovery and better outcomes — not the elimination of risk. It reflects a shift in the goal of surgery: from survival to precision and quality of life.',
          },
        ],
      },

      // Screen 4 — DNA Discovery
      {
        label: 'DNA',
        kicker: '1953',
        heading: 'The code inside every cell.',
        sub: 'Watson, Crick and Franklin unlocked the instruction manual for life itself.',
        headerImage: '/images/watson-crick-1953.png',
        blocks: [
          {
            type: 'read',
            label: '🧬 What DNA Is and Why It Matters',
            text: 'In 1953, <strong>James Watson</strong> and <strong>Francis Crick</strong> published their model of the DNA double helix structure — based critically on X-ray crystallography data produced by <strong>Rosalind Franklin</strong> (whose contribution was not acknowledged at the time).<br/><br/>DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for all living organisms. It explains:<br/>• How physical traits are inherited from parents<br/>• Why some diseases run in families<br/>• Why individuals respond differently to medicines<br/>• How cancer develops at a cellular level',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The structure of DNA was described as a',
                after: 'helix.',
                answer: 'double',
                hints: ['It has two strands twisted together — a double...', 'Two spiralling strands. Double...'],
              },
              {
                before: 'Watson and Crick published their DNA model in',
                after: '.',
                answer: '1953',
                hints: ['Mid-20th century, after WWII.', 'Two years before the NHS had its 7th birthday.'],
              },
              {
                before: 'Understanding DNA helped explain how diseases can be',
                after: 'through families.',
                answer: 'inherited',
                hints: ['Passed from parent to child — like traits and conditions.', 'Think: family history of cancer, heart disease...'],
              },
            ],
            correctMsg: 'Good. DNA → double helix → 1953 → inherited disease. That chain scores marks.',
            wrongMsg: 'Look back at the DNA content and try again with the exact term.',
          },
          {
            type: 'quiz',
            question: 'Why was the discovery of DNA\'s structure important for medicine?',
            options: [
              { text: 'It explained inheritance and opened the way for understanding genetic disease and personalised treatment', correct: true },
              { text: 'It immediately cured every genetic disease known at the time', correct: false },
              { text: 'It replaced surgery as the primary form of medical treatment', correct: false },
              { text: 'It proved that infections were caused by DNA rather than bacteria', correct: false },
            ],
            explanation: 'DNA\'s significance is long-term: understanding the genetic code of life opened up genetic medicine, gene therapy, personalised treatment and understanding of inherited disease risk. It did not immediately cure anything — but it transformed the trajectory of medicine.',
          },
          {
            type: 'keypoint',
            text: '⚔️ <strong>Exam Assassin — Rosalind Franklin:</strong> Franklin\'s X-ray crystallography images of DNA (particularly "Photo 51") were essential to Watson and Crick\'s model. She died in 1958 and could not receive the Nobel Prize (awarded 1962 — only to living recipients). AQA may ask about her contribution and the ethical issues around attribution in scientific discovery.',
          },
        ],
      },

      // Screen 5 — Ethics & Modern Medicine
      {
        label: 'Medical Ethics',
        kicker: 'Debate',
        heading: 'Just because medicine CAN — should it?',
        sub: 'Modern technology creates possibilities that didn\'t exist before. Some of them are deeply uncomfortable.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ New Power, New Questions',
            text: 'As medicine gained the ability to manipulate genes, grow embryonic stem cells, clone animals and use AI for diagnosis, society faced questions that had never existed before:<br/><br/>Should we select embryos based on genetic profiles? Who owns your DNA data? Should we extend human lifespan indefinitely? Can an AI algorithm replace a doctor\'s judgement? Who decides which patients get organ transplants?<br/><br/>These are not hypothetical questions — they are decisions being made right now.',
          },
          {
            type: 'colsort',
            question: 'Sort each consideration into: potential benefit or ethical concern.',
            columns: [
              { label: 'POTENTIAL BENEFIT\nWhat it could achieve', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'ETHICAL CONCERN\nWhat worries people', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
            ],
            items: [
              { label: 'Genetic testing could predict and prevent inherited disease', col: 0, explanation: 'Identifying genetic risk allows earlier intervention, monitoring and lifestyle changes that could prevent serious illness developing.' },
              { label: 'Genetic data could be used by insurers to deny coverage', col: 1, explanation: 'If insurance companies access your DNA profile, they might refuse coverage or charge higher premiums based on genetic risk — creating discrimination.' },
              { label: 'Stem cell research could repair damaged organs and tissue', col: 0, explanation: 'Embryonic stem cells can develop into any cell type — potentially regenerating damaged heart muscle, spinal cord or brain tissue.' },
              { label: 'Embryo research destroys potential human life', col: 1, explanation: 'Embryonic stem cell research requires destroying human embryos at an early stage — raising serious religious and ethical objections.' },
              { label: 'AI diagnosis could detect cancer earlier than human doctors', col: 0, explanation: 'AI systems trained on millions of scans can detect patterns and anomalies that human eyes miss, enabling earlier treatment when cancer is most curable.' },
              { label: 'AI errors could harm patients if misdiagnosis goes unchecked', col: 1, explanation: 'If AI systems make systematic errors and doctors defer to them without critical review, patients could be seriously harmed without adequate redress.' },
            ],
            explanation: 'Modern medicine creates genuine ethical dilemmas — not obvious villains and heroes. Every benefit listed here has a corresponding risk. AQA asks you to acknowledge BOTH sides.',
          },
          {
            type: 'quiz',
            question: 'Which statement BEST explains why modern medicine creates ethical debate?',
            options: [
              { text: 'Medicine became less effective in the 20th century, causing public distrust', correct: false },
              { text: 'New technology creates genuinely difficult decisions about how its power should be used', correct: true },
              { text: 'Doctors stopped following ethical guidelines after the NHS was created', correct: false },
              { text: 'Modern surgery is too dangerous to be ethically acceptable', correct: false },
            ],
            explanation: 'The ethical debates arise precisely BECAUSE medicine became more powerful — not less. Greater capability means greater responsibility. Decisions about genetic engineering, cloning and AI diagnosis require society to agree on values and limits that didn\'t previously need to exist.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Top judgement answers explain BOTH advantages and concerns." If asked "Is genetic engineering beneficial?" — a one-sided answer loses marks. Structure it: "Genetic engineering offers [specific benefit] because [explanation]. However, it also raises concerns about [specific concern] because [explanation]. On balance, [your justified judgement]."',
          },
        ],
      },

      // Screen 6 — What Changed Medicine Most?
      {
        label: 'What Changed Most?',
        kicker: 'Synoptic',
        heading: 'What actually transformed modern medicine?',
        sub: 'No single factor did it. Build the connections.',
        blocks: [
          {
            type: 'read',
            label: '🔗 Linked Factors — Not Single Causes',
            text: 'AQA rewards students who explain <em>how factors connect</em> — not just who lists them. Modern medicine advanced because multiple factors worked together simultaneously:<br/><br/>🔬 <strong>Science</strong> gave medicine understanding (DNA, germ theory, immunology)<br/>⚡ <strong>Technology</strong> gave medicine tools (MRI, robotic surgery, genetic sequencing)<br/>🏛 <strong>Government</strong> gave medicine scale (NHS, research funding, regulation)<br/>⚔️ <strong>War</strong> accelerated medicine (penicillin production, blood transfusions, surgery)<br/>🤝 <strong>Teams</strong> replaced lone geniuses (Fleming + Florey + Chain + factories)',
          },
          {
            type: 'colsort',
            question: 'Match each development to its primary driving factor.',
            columns: [
              { label: 'TECHNOLOGY', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'SCIENCE', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'GOVERNMENT / TEAMWORK', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
            ],
            items: [
              { label: 'MRI and CT scanning transforms diagnosis', col: 0, explanation: 'Medical scanning is fundamentally a technology achievement — applying physics and computing to produce images of internal body structures.' },
              { label: 'DNA structure unlocks understanding of inheritance', col: 1, explanation: 'The discovery of DNA\'s double helix is a scientific breakthrough — advancing fundamental biological knowledge rather than developing a tool or institution.' },
              { label: 'NHS provides universal access to all medical advances', col: 2, explanation: 'The NHS is a government institution — it didn\'t create medical breakthroughs, but it ensured the whole population could access them.' },
              { label: 'Robotic surgery enables sub-millimetre precision', col: 0, explanation: 'Robotic surgery systems are technology — engineering that extends human physical capability beyond what unaided hands can achieve.' },
              { label: 'Florey and Chain\'s team develops penicillin clinically', col: 2, explanation: 'The Oxford team exemplifies teamwork — multiple specialists working together, sharing knowledge across disciplines to solve a development problem.' },
              { label: 'Immunosuppressant drugs enable organ transplants', col: 1, explanation: 'Cyclosporine and similar drugs emerged from immunological science — understanding how the immune system works allowed scientists to modulate it safely.' },
            ],
            explanation: 'No single factor explains modern medicine. Technology, science and government/teamwork worked in parallel — each amplifying the others. AQA rewards answers that explain these links.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST accelerated modern medicine after 1945?',
            options: [
              { text: 'Medieval monasteries preserving ancient medical texts', correct: false },
              { text: 'Science and technology increasingly working together with government support', correct: true },
              { text: 'Bloodletting and traditional humoral treatments', correct: false },
              { text: 'Astrology providing medical guidance to practitioners', correct: false },
            ],
            explanation: 'Modern medicine accelerated because science and technology became mutually reinforcing — scientific discoveries created demand for new technologies, which enabled further scientific discoveries. Government funding (particularly through the NHS and research councils) gave this combination scale. No single factor alone explains the pace of change.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Synoptic Key Phrase:</strong> "Modern medicine improved because technology and science increasingly worked together, supported by government funding and teamwork — not because of any single discovery or individual." Use this construction when questions ask you to evaluate factors across the whole medicine course.',
          },
        ],
      },

      // Screen 7 — Source Detective
      {
        label: 'Source Detective',
        kicker: 'Exam Skill',
        heading: 'What does this source suggest about modern medicine?',
        sub: 'Final source analysis practice. Precision matters more than length.',
        blocks: [
          {
            type: 'read',
            label: '🔍 Reading Modern Sources',
            text: 'AQA sources on modern medicine often show: hospital environments, medical technology in use, patients recovering, research teams at work, or medical statistics. The skill is always the same — infer from specific details, link to your own knowledge, acknowledge limitations.',
          },
          {
            type: 'quiz',
            question: 'A source shows a modern hospital operating theatre: robotic surgical arms, screens displaying 3D body scans, a team of six specialists in sterile gowns. Which answer is STRONGER?',
            options: [
              { text: 'Student A: "Modern hospitals use a lot of technology."', correct: false },
              { text: 'Student B: "The presence of robotic surgical arms and 3D scan displays suggests that by the 21st century, surgery had become reliant on technology for both diagnosis and precision — a dramatic change from the 19th century when surgeons operated without any imaging guidance."', correct: true },
              { text: 'Student C: "The source tells us surgery is safer now than before."', correct: false },
              { text: 'Student D: "There are many doctors in the picture which shows medicine is teamwork."', correct: false },
            ],
            explanation: 'Student B uses specific details (robotic arms, 3D scan displays), links to own knowledge (comparison to 19th century surgery), and makes a precise inference about the period. Students A, C and D describe without inferring, or make observations without historical context.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Source Analysis Formula (Final Version):</strong><br/>"The source suggests [X] because [specific detail from source]. This is consistent with [own knowledge about the period]. The source is useful for understanding [specific aspect] but limited because [what it cannot tell us]."<br/><br/>Every source answer. Every time.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: '"Precise explanation beats vague description." Count the specific terms in your source answer. If you have fewer than three specific historical terms, add more. "Technology improved medicine" scores 1 mark. "MRI scanning enabled earlier diagnosis of tumours without surgical intervention, transforming cancer treatment outcomes" scores 4.',
          },
        ],
      },

      // Screen 8 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Challenge',
        heading: '⚔️ Final Boss: How Modern Is Modern Medicine?',
        sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
        blocks: [
          {
            type: 'read',
            label: '🔥 The Challenge',
            text: 'Explain why medicine changed more rapidly after 1945 than in any earlier period. Your answers should connect: technology, scans, antibiotics, DNA, government funding and teamwork. Write — then submit.',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'Explain how scanning technology transformed medical diagnosis. Give at least TWO examples of different scan types and what each revealed.',
            markPoints: `- X-rays (from 1895 onwards): revealed bones, fractures, bullets and dense structures without surgery
- CT scans: produced detailed cross-section images; able to detect tumours, internal bleeding, structural damage
- MRI scans: detailed soft tissue imaging using magnetic fields; no radiation; revealed brain conditions, muscle damage, organ problems
- Ultrasound: safe, uses sound waves; used for monitoring pregnancies and soft tissue without radiation risk
- Overall significance: diagnosis became faster, safer and more accurate; doctors could identify problems without exploratory surgery
- Award 1 mark per developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Analysis',
            question: 'Explain why the discovery of DNA\'s structure in 1953 was significant for the long-term development of medicine.',
            markPoints: `- Watson and Crick published DNA double helix model in 1953 (with critical contribution from Rosalind Franklin's X-ray data)
- Explained the mechanism of inheritance — how genetic information passes from parent to child
- Opened understanding of genetic diseases: conditions like cystic fibrosis, Huntington's disease, BRCA cancer risk
- Foundation for genetic testing, gene therapy and personalised medicine
- Led to the Human Genome Project (completed 2003) — mapping every human gene
- Long-term significance: medicine became capable of understanding and potentially treating disease at its source (genetic level) rather than just managing symptoms
- Award 1 mark per developed point (up to 6 marks)`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Technology was the most important factor in transforming medicine after 1945." How far do you agree? Refer to at least TWO other factors in your answer.',
            markPoints: `- Agreement — technology was crucial:
  - Medical scanning (X-ray, CT, MRI, ultrasound) transformed diagnosis without surgery
  - Keyhole and robotic surgery reduced damage and recovery times dramatically
  - Computers and AI accelerated drug discovery, genetic analysis and diagnostic accuracy
  - DNA sequencing technology enabled the Human Genome Project and personalised medicine
- Science as an alternative factor:
  - DNA discovery (1953) was fundamentally a scientific breakthrough, not just technology
  - Understanding immunology enabled organ transplants (immunosuppressants)
  - Germ theory → antibiotics → modern pharmaceuticals: science created the foundations technology built on
- Government and teamwork as alternative factors:
  - NHS (1948) ensured medical advances reached the whole population, not just the wealthy
  - Government research funding (medical research councils, university funding) created the environment for breakthroughs
  - International scientific collaboration (Human Genome Project: 20 countries, 13 years) shows teamwork as essential
- Balanced conclusion: Technology was the most visible driver — and arguably the most distinctive feature of post-1945 medicine. But technology without science to inform it and government funding to support it would not have transformed medicine at the same pace. All three factors were necessary; technology was the accelerant but not the sole cause.
- Award marks for: AO1 knowledge of technology and other factors, AO2 specific examples and evidence, AO3 sustained evaluation with justified conclusion`,
          },
        ],
      },

      // Screen 9 — Retrieval + Reflection
      {
        label: 'Retrieval',
        kicker: 'Final Retrieval',
        heading: 'Lock it in. 700 years of medical history.',
        sub: 'Mixed questions across the whole module. No notes.',
        blocks: [
          {
            type: 'read',
            label: '🔁 The Final Test',
            text: 'This is retrieval without headings — exactly how AQA papers feel. The questions cover the whole module. Don\'t look back. Just try.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Core Facts', emoji: '🟢',
                questions: [
                  {
                    q: 'What does MRI stand for, and what does it allow doctors to see?',
                    options: [
                      'Magnetic Resonance Imaging — detailed soft tissue images without radiation or surgery',
                      'Medical Radiographic Investigation — X-ray images of bones and fractures',
                      'Microscopic Robotic Insertion — robotic surgery through tiny incisions',
                      'Medical Research Imaging — genetic data visualised as a body map',
                    ],
                    correct: 0,
                    feedback: 'MRI = Magnetic Resonance Imaging. Uses magnetic fields (not radiation) to produce detailed images of soft tissue — muscles, brain, organs. A major advance over X-rays for non-bone diagnosis.',
                    hint: 'Magnetic. Resonance. Imaging. What does magnetic resonance detect?',
                  },
                  {
                    q: 'Why did many early organ transplants fail despite successful surgery?',
                    options: [
                      'The immune system rejected the transplanted organ as foreign tissue',
                      'Surgeons lacked the anaesthetics needed for long transplant operations',
                      'Transplant surgery was performed before blood transfusions were available',
                      'Hospitals did not have the refrigeration needed to store donor organs',
                    ],
                    correct: 0,
                    feedback: 'Rejection: the immune system attacked transplanted organs. Immunosuppressant drugs (especially cyclosporine from the 1970s) solved this by suppressing the immune response — allowing the organ to survive.',
                    hint: 'The immune system\'s job is to destroy foreign substances in the body. A transplanted organ is...',
                  },
                  {
                    q: 'Who published the structure of DNA in 1953?',
                    options: [
                      'Watson and Crick (with critical data from Rosalind Franklin)',
                      'Fleming and Florey',
                      'Lister and Pasteur',
                      'Darwin and Mendel',
                    ],
                    correct: 0,
                    feedback: 'Watson and Crick published the double helix model in 1953, based critically on Rosalind Franklin\'s X-ray crystallography images. All three contributed — but Franklin\'s role was not publicly acknowledged at the time.',
                    hint: 'Two men published it. One woman\'s data made it possible. 1953.',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A student writes: "Modern medicine improved because of better technology." What is missing from this answer?',
                    options: [
                      'Reference to other factors: science, government funding, teamwork — and specific examples linking them',
                      'A description of how technology works in medical settings',
                      'An argument that technology was actually unimportant',
                      'A date for when technology became available in hospitals',
                    ],
                    correct: 0,
                    feedback: 'AQA rewards linked-factor explanations. Technology mattered — but so did science (DNA, immunology), government (NHS, research funding) and teamwork (international collaboration). A complete answer names multiple factors and explains how they connected.',
                    hint: 'What does AQA reward that this answer lacks? Think: linked factors...',
                  },
                  {
                    q: 'Why is keyhole surgery more significant than traditional surgery in terms of patient outcomes?',
                    options: [
                      'It shifts the goal from survival to quality of life — patients recover faster, with less damage and can return to normal sooner',
                      'It completely eliminates all risk from surgical procedures',
                      'It allows surgery to be performed without anaesthetics or sterile conditions',
                      'It replaces the need for pre-operative diagnosis and imaging',
                    ],
                    correct: 0,
                    feedback: 'Keyhole surgery\'s significance is the shift in ambition: from "will the patient survive?" to "how quickly will the patient recover and return to normal?" Reduced incision size, less blood loss, shorter recovery — these improve outcomes beyond just survival.',
                    hint: 'The goal of surgery changed. It used to be about survival. Now it\'s about...',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: '"Medical ethics debates prove that modern medicine has gone too far." Evaluate this claim.',
                    options: [
                      'The claim overstates the case: ethical debates show medicine is powerful, not reckless. Debates about genetic engineering and AI diagnosis reflect serious attempts to use new capabilities responsibly — not evidence of excess.',
                      'The claim is correct: modern medicine has created too many ethical problems to be justified.',
                      'The claim is wrong because medical ethics does not exist as a real discipline.',
                      'The claim cannot be evaluated because ethics is purely subjective.',
                    ],
                    correct: 0,
                    feedback: 'The strongest evaluation reframes the claim: ethical debates are a SIGN of responsible engagement with powerful technology, not proof that medicine has "gone too far." This uses evaluation to challenge the framing of the question itself — the highest-order historical thinking skill.',
                    hint: 'Does the existence of ethical debate prove excess? Or does it prove something else?',
                  },
                  {
                    q: 'A question asks: "How significant was the NHS for medical progress in the 20th century?" What makes an answer score top marks?',
                    options: [
                      'It evaluates the NHS in relation to other factors, using specific examples to explain HOW the NHS amplified other medical advances rather than just describing what it did',
                      'It lists every medical advance made after 1948 and attributes them to the NHS',
                      'It argues the NHS was the single most important factor and dismisses other explanations',
                      'It describes the NHS\'s structure and funding arrangements in detail',
                    ],
                    correct: 0,
                    feedback: 'Top marks come from evaluation: the NHS didn\'t create penicillin or DNA research — but it ensured these advances reached everyone, not just those who could pay. "The NHS amplified existing medical advances by making them universally accessible" is a much stronger claim than "the NHS was very important." Specific, linked, evaluated.',
                    hint: 'What did the NHS DO with medical advances that already existed? How did it amplify their impact?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>You reached modern medicine.</strong><br/><br/>You just travelled through 700 years of medical history — from medieval herbalists blaming bad air, through Vesalius challenging Galen, Lister\'s carbolic spray, Fleming\'s contaminated dish, to robotic surgery and genetic sequencing.<br/><br/>Medicine became powerful through science, technology, government support and teamwork. No single person, discovery or era did it alone.<br/><br/>That\'s the history of medicine done.',
          },
        ],
      },
    ],
  },

  // ── History Module 9: Who Gets Healthcare? ────────────────────────────────────
  {
    id: 'mod9',
    subject: 'History',
    number: 11,
    title: 'Who gets healthcare?',
    subtitle: 'The NHS, prevention & modern public health',
    era: 'AQA GCSE',
    icon: '🏥',
    color: '#C47828',
    colorLight: 'rgba(196,120,40,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'A WOMAN WALKS INTO A HOSPITAL. SHE HAS NO MONEY.',
        sub: 'In 1947, she would be turned away. In 1948, the door is open. What changed?',
        cta: 'FIND OUT',
      },
      scenario: {
        location: 'Britain, 5 July 1948',
        hint: 'For the first time in British history, every person — rich or poor — can see a doctor, dentist, or specialist without paying. Queues stretch around hospitals. People are crying.',
      },
      statement: '"Before the NHS, Britain had world-class hospitals available to everyone."',
      isTrue: false,
      accentWords: ['available to everyone'],
      explanation: "Before 1948, healthcare was fee-based. The poor often went untreated or died from conditions that money could have fixed. The NHS changed everything.",
      wrongFeedback: 'Before 1948, healthcare was not universal. Hospital treatment could cost money. The poor often went without. The NHS changed this permanently.',
      correctFeedback: 'Correct. Before 1948, healthcare depended heavily on your ability to pay. The NHS, launched in 1948, was the first system to make healthcare free at the point of use for everyone.',
      loadingText: 'Checking the records…',
      bigQuestion: 'If healthcare wasn\'t free — what happened to people who couldn\'t afford it?',
      revealHeader: 'The NHS changed who could get care.',
      revealItems: [
        {
          emoji: '🏛️',
          label: 'Government intervention',
          detail: 'The state stepped in because the market had failed. Before 1948, if you couldn\'t afford treatment, you went without. Government funding broke the link between wealth and healthcare access.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '🏥',
          label: 'NHS creation',
          detail: 'On 5 July 1948, Aneurin Bevan launched the National Health Service. Free at the point of use. Funded by taxation. 480,000 staff on day one. Within a year: 187 million prescriptions, 8 million dental treatments.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '💉',
          label: 'Prevention over cure',
          detail: 'Modern public health shifted from treating disease to preventing it. Vaccination programmes, anti-smoking campaigns and lifestyle regulation all became government responsibilities — because prevention is cheaper than cure.',
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
      ],
      punchline: 'Healthcare became a right, not a privilege. The NHS was just the beginning.',
    },
    intro: {
      learningGoals: [
        'Explain why the NHS was needed and what came before it',
        'Describe what "free at the point of use" means and why it mattered',
        'Explain Aneurin Bevan\'s role in creating the NHS',
        'Describe how vaccination and prevention became central to public health',
        'Explain why lifestyle diseases became a major challenge after 1950',
        'Evaluate the government\'s continuing role in shaping modern healthcare',
      ],
    },
    outcomes: {
      intro: "Medicine only matters if people can access it. This chapter asks who actually gets healthcare — and who doesn't.",
      bullets: [
        'Explain why the NHS was created and what made it genuinely radical',
        'Describe how prevention became part of modern medicine',
        'See the tension between individual freedom and public health policy',
        'Evaluate how far medicine has actually improved ordinary lives',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'The NHS was created in 1948 and is free at point of use.', isTrue: true },
        { type: 'choice', question: 'Beveridge\'s 1942 report proposed...', options: ['Privatising all hospitals and surgeries', 'A welfare state supporting people from cradle to grave', 'Making patients pay for prescriptions'], correct: 1 },
        { type: 'connection', question: 'Prevention matters in modern medicine because...', options: [
          { text: 'Treating illness costs far more than preventing it', icon: 'heart' },
          { text: 'Doctors prefer not to perform surgery', icon: 'gear' },
          { text: 'Hospitals are too full to treat anyone', icon: 'house' },
        ], correct: 0 },
      ],
    },
    // TODO: mod9 covers NHS and lifestyle diseases broadly; cancer-specific titles are approximate.
    stageNavigation: [
      { id: 'part-1', title: 'The Disease Modern Medicine Still Fights', description: 'NHS origins and the health gap before 1948.', screenIndex: 0 },
      { id: 'part-2', title: 'What Makes Lung Cancer Different?', description: 'Vaccination, prevention and lifestyle links to disease.', screenIndex: 3 },
      { id: 'part-3', title: 'Finding Cancer Earlier', description: 'Screening, smoking and the evidence base.', screenIndex: 4 },
      { id: 'part-4', title: 'Treating the Hard Cases', description: 'Lifestyle diseases and modern treatment limits.', screenIndex: 5 },
      { id: 'part-5', title: 'Prevention, Choice and Society', description: 'Government intervention and individual responsibility.', screenIndex: 6 },
      { id: 'part-6', title: 'Exam Prep: Lifestyle Disease and Modern Limits', description: 'Exam practice and final application.', screenIndex: 8 },
    ],
    screens: [

      // Screen 1 — Before the NHS
      {
        label: 'Before the NHS',
        kicker: 'Pre-1948 Britain',
        heading: 'Healthcare depended on what you could afford.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Before 1948, accessing healthcare in Britain was not straightforward. Voluntary and charity hospitals provided some free care, but many required fees or proof of need. The <strong>Poor Law Amendment Act (1834)</strong> had created workhouse infirmaries for the destitute — grim, stigmatised places. <strong>Lloyd George\'s National Insurance Act (1911)</strong> extended basic medical cover to some working men, but not their families, and not the unemployed. If you were too poor to pay and too "comfortable" to qualify for charity, you might simply go without. Illness could mean financial ruin for a working family. A serious condition — appendicitis, childbirth complications, tuberculosis — could bankrupt parents and orphan children.',
          },
          {
            type: 'quiz',
            question: 'Which statement best explains why the NHS was revolutionary?',
            options: [
              { text: 'It ended all disease in Britain', correct: false },
              { text: 'Healthcare became universal — everyone could access it regardless of income', correct: true },
              { text: 'Surgery disappeared because doctors stopped charging', correct: false },
              { text: 'The government banned private medicine entirely', correct: false },
            ],
            explanation: 'The NHS was revolutionary because it removed cost as a barrier to healthcare. For the first time, illness did not mean financial catastrophe — treatment was available to everyone.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Three things about pre-NHS healthcare:</strong><br/>1. <strong>Expensive</strong> — doctors, medicines and hospital stays all cost money most people did not have.<br/>2. <strong>Inconsistent</strong> — quality and availability varied enormously by area and income.<br/>3. <strong>Charity-dependent</strong> — the poor relied on voluntary hospitals that were underfunded and stigmatised.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Always explain WHY change was needed — not just that it happened. Don\'t write: "The NHS was created in 1948." Write: "The NHS was created in 1948 because millions of people could not afford healthcare — illness often meant financial ruin for working-class families, and the existing patchwork of charity and insurance left huge gaps in coverage."',
          },
        ],
      },

      // Screen 2 — Birth of the NHS (1948)
      {
        label: 'Birth of the NHS',
        kicker: '5 July 1948',
        heading: 'A new idea changes Britain.',
        headerImage: '/images/nhs-1948.png',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'On <strong>5 July 1948</strong>, Aneurin Bevan — Minister of Health under the Labour government of Clement Attlee — launched the National Health Service. The founding principle was simple but radical: healthcare should be <strong>free at the point of use</strong>, available to everyone, funded by National Insurance contributions and general taxation.<br/><br/>The scale was extraordinary. On day one, <strong>480,000 staff</strong> were employed. The hospitals — previously a patchwork of charity, municipal and private institutions — were nationalised overnight. Within the first year: <strong>187 million prescriptions</strong> had been issued and <strong>8 million dental treatments</strong> provided, many to people who had never seen a dentist in their lives.',
          },
          {
            type: 'keypoint',
            text: '🏥 <strong>Four founding principles of the NHS:</strong><br/>1. <strong>Free at the point of use</strong> — no charge when you need treatment.<br/>2. <strong>Funded by taxation</strong> — paid for collectively through National Insurance.<br/>3. <strong>Aneurin Bevan</strong> — the Minister of Health who drove it through parliament.<br/>4. <strong>Universal coverage</strong> — every person in Britain, regardless of wealth or status.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST explains why the NHS was created in 1948?',
            options: [
              { text: 'Britain wanted to close hospitals and reduce costs', correct: false },
              { text: 'The government believed healthcare should be universal — a right, not a privilege', correct: true },
              { text: 'Germ theory had proven that doctors were no longer needed', correct: false },
              { text: 'Doctors voluntarily stopped charging patients for their services', correct: false },
            ],
            explanation: 'The NHS was built on the principle that healthcare is a right. The wartime experience of organised, state-funded medicine had shown what government action could achieve — and political will existed to make it permanent.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Always explain WHY governments introduced reforms — not just that they did. For the NHS: (1) pre-existing inequity, (2) wartime lesson about state-organised medicine, (3) political will of the 1945 Labour landslide, (4) Beveridge Report (1942) recommending a welfare state. These are the CAUSES — not just the date.',
          },
        ],
      },

      // Screen 3 — Resistance & Reality
      {
        label: 'Resistance & Reality',
        kicker: 'The Fight to Create It',
        heading: 'Doctors didn\'t want it. Bevan pushed it through anyway.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Creating the NHS was not straightforward. The <strong>British Medical Association (BMA)</strong> — the professional organisation representing doctors — mounted fierce opposition. Doctors feared losing their professional independence, becoming "state servants" and seeing their incomes fall under a nationalised system. The BMA held ballots and campaigned against the proposals.<br/><br/>Bevan\'s response was pragmatic. He later said he had <strong>"stuffed their mouths with gold"</strong> — he offered doctors merit awards (bonus payments for excellence), allowed them to keep private patients in NHS hospitals (pay beds), and preserved their clinical independence. The opposition was overcome. On <strong>5 July 1948</strong>, queues stretched around hospitals as people registered with GPs for the first time. Dentists were overwhelmed. The demand for glasses cleaned out opticians\' stocks.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A doctor in 1946 says: "I didn\'t spend years training to become a state servant answering to government bureaucrats."',
                question: 'Which group opposed the NHS and why?',
                options: [
                  'Patients opposed it because they preferred paying for treatment',
                  'The BMA opposed it, fearing loss of professional independence and income',
                  'The government opposed its own creation because of cost',
                  'Nurses opposed it because they wanted to work in private hospitals',
                ],
                correct: 1,
                feedback: 'The British Medical Association (BMA) led opposition to the NHS, primarily fearing that doctors would lose income and professional independence by becoming state employees. The public was broadly supportive — most people wanted free healthcare.',
                followUp: {
                  q: 'How did Bevan overcome opposition from the BMA?',
                  answer: 'Bevan offered merit awards (bonus payments) for excellence, allowed private pay beds in NHS hospitals, and preserved clinical independence. He "stuffed their mouths with gold" — giving doctors financial incentives to join. By 1948, enough doctors had signed up for the service to launch.',
                },
              },
            ],
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The NHS was launched by',
                after: 'Bevan, the Minister of Health, on 5 July 1948.',
                answer: 'Aneurin',
                hints: ['His first name. Welsh politician and passionate advocate for working people.', 'Begins with "A" — first name of the Minister of Health who created the NHS.'],
              },
              {
                before: 'The',
                after: '(BMA) opposed the NHS, fearing loss of income and professional independence.',
                answer: 'British Medical Association',
                hints: ['The professional organisation representing doctors in Britain.', 'Three words: British _______ Association.'],
              },
              {
                before: 'The NHS was founded on the principle that healthcare should be free at the',
                after: 'of use, available to everyone regardless of income.',
                answer: 'point',
                hints: ['Free at the _____ of use — the moment you need it, it costs nothing.', 'A short word meaning the moment or place something happens.'],
              },
            ],
            correctMsg: 'Correct. Bevan, BMA opposition, free at the point of use — these three elements are the core of any NHS creation question.',
            wrongMsg: 'Review the reading section — these are the core facts about the creation of the NHS.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Exam trap — don\'t say "everyone opposed the NHS" or "no one opposed it." The BMA did; the public largely supported it. The distinction matters: opposition came from the medical profession (fearing income loss), not from patients (who wanted free care). Being precise about WHO opposed it and WHY earns the marks.',
          },
        ],
      },

      // Screen 4 — Vaccination & Prevention
      {
        label: 'Vaccination & Prevention',
        kicker: 'Prevention Over Cure',
        heading: 'Stop the disease before it starts.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'After 1948, vaccination programmes expanded dramatically as the NHS provided the infrastructure for mass public health campaigns. Key milestones:<br/><br/>💉 <strong>Polio vaccine (Salk, 1955)</strong> — a massive public campaign immunised children across Britain. Polio cases collapsed.<br/>💉 <strong>MMR vaccine (1988)</strong> — combined measles, mumps and rubella into one injection. Childhood disease rates fell sharply.<br/>🌍 <strong>Smallpox eradicated globally (1980)</strong> — the result of a worldwide WHO vaccination campaign, the only human disease ever eradicated.<br/><br/>Government mass vaccination campaigns represent the state acting as a public health actor — coordinating, funding and delivering prevention at a scale no individual or charity could achieve. The principle: <strong>prevention is cheaper than cure</strong>.',
          },
          {
            type: 'keypoint',
            text: '💉 <strong>Three things about vaccination programmes after 1948:</strong><br/>1. <strong>Reduced infectious disease</strong> — polio, measles, smallpox all declined dramatically.<br/>2. <strong>Government-funded</strong> — only the state could organise and pay for mass vaccination.<br/>3. <strong>Prevention paradigm shift</strong> — focus moved from treating sick patients to stopping people getting sick in the first place.',
          },
          {
            type: 'colsort',
            question: 'Treatment or Prevention?',
            columns: [
              { label: 'TREATMENT\nAfter disease strikes', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'PREVENTION\nBefore disease strikes', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'Antibiotics for a bacterial infection', col: 0, explanation: 'Antibiotics treat an existing infection — this is treatment, not prevention.' },
              { label: 'Surgery to remove an infected appendix', col: 0, explanation: 'Surgery responds to a medical emergency — this is treatment.' },
              { label: 'Chemotherapy for cancer', col: 0, explanation: 'Chemotherapy treats existing cancer — this is treatment.' },
              { label: 'National childhood vaccination programme', col: 1, explanation: 'Vaccination prevents disease before it occurs — the definition of prevention.' },
              { label: 'Government anti-smoking campaign', col: 1, explanation: 'Anti-smoking campaigns aim to prevent lung disease before it develops.' },
              { label: 'Adding fluoride to water to prevent tooth decay', col: 1, explanation: 'Fluoride in water prevents dental decay — a public health prevention measure.' },
            ],
            explanation: 'The distinction between treatment and prevention is a key AQA theme. Modern public health increasingly emphasises prevention — stopping disease before it requires expensive treatment.',
          },
          {
            type: 'quiz',
            question: 'Which statement best explains why vaccination programmes were important?',
            options: [
              { text: 'They eliminated all disease from Britain', correct: false },
              { text: 'They reduced the spread of infectious disease across whole populations', correct: true },
              { text: 'They replaced the need for all doctors and hospitals', correct: false },
              { text: 'They ended all surgical procedures by the 1960s', correct: false },
            ],
            explanation: 'Vaccination works at the population level — herd immunity means that when enough people are vaccinated, even the unvaccinated are protected. This is why government-funded mass campaigns were so powerful.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Prevention became increasingly important after 1900 — this is a key continuity/change theme in AQA Medicine in Britain. Show you understand the shift: "Before 1900, medicine focused on treating disease. After 1900 — and especially after 1948 — prevention through vaccination and public health campaigns became central." That\'s a change argument worth marks.',
          },
        ],
      },

      // Screen 5 — Lung cancer comparison slider
      {
        type: 'beforeAfterSlider',
        stage: 'Modern Medicine',
        label: 'Smoking & Lung Cancer',
        heading: 'What does smoking do to your lungs?',
        beforeSrc: '/figures/history/medicine/modern/lungs-healthy.png',
        afterSrc: '/figures/history/medicine/modern/lungs-cancer.png',
        beforeLabel: 'Healthy lungs',
        afterLabel: 'Damaged lungs',
        initial: 50,
      },

      // Screen 6 — Lifestyle Diseases
      {
        label: 'Lifestyle Diseases',
        kicker: 'Modern Health Challenges',
        heading: 'The biggest threats changed.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'By the mid-20th century, infectious diseases like cholera and tuberculosis were declining — thanks to antibiotics, vaccination and better living conditions. New killers emerged in their place:<br/><br/>❤️ <strong>Heart disease</strong> — linked to diet, lack of exercise and smoking.<br/>🚬 <strong>Lung cancer</strong> — the <strong>1962 Royal College of Physicians report</strong> formally linked smoking to cancer, triggering major government action.<br/>🍬 <strong>Obesity and diabetes</strong> — rising from processed food, sedentary lifestyles.<br/><br/>Government responses came in waves:<br/>📌 <strong>1983</strong> — seat belt law (reducing road death and injury).<br/>📌 <strong>2007</strong> — smoking ban in enclosed public spaces.<br/>📌 <strong>2018</strong> — sugar tax (Soft Drinks Industry Levy) to reduce childhood obesity.<br/><br/>These are <strong>lifestyle diseases</strong> — caused by behaviour and environment, not just bacteria — requiring a different kind of government response.',
          },
          {
            type: 'keypoint',
            text: '❤️ <strong>Four points on lifestyle disease era:</strong><br/>1. <strong>New threats after 1950</strong> — heart disease, lung cancer, obesity replaced infectious killers.<br/>2. <strong>Smoking-cancer link</strong> — 1962 RCP report was the turning point.<br/>3. <strong>Government regulation</strong> — seat belts, smoking bans, sugar taxes show the state controlling behaviour.<br/>4. <strong>Prevention still central</strong> — campaigns aimed at changing behaviour before disease develops.',
          },
          {
            type: 'quiz',
            question: 'Why did lifestyle diseases become a bigger focus after 1950?',
            options: [
              { text: 'Infectious diseases became less dominant as antibiotics and vaccines reduced their impact', correct: true },
              { text: 'Surgery disappeared so new problems had to be found', correct: false },
              { text: 'Germ theory was proven wrong in the 1950s', correct: false },
              { text: 'All hospitals closed after 1948', correct: false },
            ],
            explanation: 'As antibiotics and vaccines controlled infectious diseases, the remaining major killers were those linked to behaviour and environment. The epidemiological transition — from infectious to chronic disease — is a key change in modern medicine.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'A government health campaign in 2007 bans smoking in all enclosed public spaces in England, citing evidence that secondhand smoke causes cancer and heart disease.',
                question: 'Which factor best explains this government decision?',
                options: [
                  'Germ theory — bacteria were found in cigarette smoke',
                  'Government intervention in lifestyle disease — using legislation to protect public health',
                  'Vaccination — the smoking ban was a form of immunisation',
                  'The Welfare State — the ban was about saving money on housing',
                ],
                correct: 1,
                feedback: 'The smoking ban is a clear example of government intervention in lifestyle disease. Armed with scientific evidence (the link between smoking, secondhand smoke and cancer/heart disease), the government used legislation to change behaviour and protect public health.',
                followUp: {
                  q: 'What role did evidence play in the government\'s decision to ban smoking?',
                  answer: 'Scientific evidence — from the 1962 RCP report onwards — established the causal link between smoking and cancer/heart disease. Government action followed evidence: once the link was proven beyond doubt, legislative pressure grew. This is the same model as Snow\'s cholera map and the 1875 Public Health Act — evidence drives government action.',
                },
              },
            ],
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Change over time questions reward comparison between periods. "Before 1900, the main threats were infectious diseases like cholera and TB. After 1950, the main threats became lifestyle diseases like heart disease and lung cancer — requiring a different kind of government response: not sewers and vaccines, but seat belt laws and smoking bans." That comparative structure scores highly.',
          },
        ],
      },

      // Screen 7 — Government Never Stopped
      {
        label: 'Government Never Stopped',
        kicker: 'Continuing Intervention',
        heading: 'The state didn\'t create the NHS and walk away.',
        blocks: [
          {
            type: 'read',
            label: '📖 Core Knowledge',
            text: 'Creating the NHS in 1948 was not the end of government involvement in healthcare — it was the beginning of a permanent, expanding role. Modern governments continue shaping public health across multiple fronts:<br/><br/>🔍 <strong>NHS cancer screening programmes</strong> — breast, cervical and bowel cancer caught early when treatment is most effective.<br/>🧠 <strong>Mental health campaigns</strong> — reducing stigma, expanding NHS mental health provision.<br/>🏃 <strong>Childhood obesity strategy</strong> — school food standards, advertising restrictions, sugar tax.<br/>💉 <strong>COVID-19 vaccination rollout (2020–21)</strong> — the fastest mass vaccination campaign in history: over 15 million doses in the first two months.<br/><br/>Government remains the dominant factor in healthcare access, funding, research and prevention — not because markets cannot provide care, but because universal access requires public funding.',
          },
          {
            type: 'colsort',
            question: 'Government action or individual choice?',
            columns: [
              { label: 'GOVERNMENT ACTION\nState-organised public health', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
              { label: 'INDIVIDUAL CHOICE\nPersonal decisions about health', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
            ],
            items: [
              { label: 'NHS cancer screening programme for over-50s', col: 0, explanation: 'A government-organised screening programme — the state proactively checks citizens\' health.' },
              { label: 'National childhood vaccination programme', col: 0, explanation: 'Government-funded and organised — vaccination programmes only work at scale through state action.' },
              { label: 'Smoking ban in enclosed public spaces (2007)', col: 0, explanation: 'Legislation passed by government — restricting individual behaviour to protect public health.' },
              { label: 'Personal decision about daily diet', col: 1, explanation: 'What individuals choose to eat is primarily an individual choice, though government campaigns aim to influence it.' },
              { label: 'Paying for a private gym membership', col: 1, explanation: 'Private gym membership is an individual lifestyle choice — not government-organised.' },
              { label: 'Choosing whether to smoke', col: 1, explanation: 'The decision to smoke remains an individual choice, though the government restricts where smoking is permitted.' },
            ],
            explanation: 'Modern public health involves both government action and individual responsibility. AQA questions often ask you to evaluate the relative importance of these — government action tends to be the dominant factor in large-scale improvements.',
          },
          {
            type: 'quiz',
            question: 'Which factor MOST influenced modern public health improvements in Britain after 1948?',
            options: [
              { text: 'Medieval monastic healing traditions', correct: false },
              { text: 'Government intervention — funding, legislation and public health campaigns', correct: true },
              { text: 'Astrological medicine and herbal remedies', correct: false },
              { text: 'Bloodletting and the four humours', correct: false },
            ],
            explanation: 'Government intervention — through the NHS, vaccination programmes, legislation (smoking bans, seat belt laws) and public health campaigns — was the dominant factor in improving British public health after 1948.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'Government action is a major recurring factor in medical progress — from Bazalgette\'s sewers (1858) to the NHS (1948) to COVID vaccines (2020). If an exam question asks about factors driving improvement, government action should always appear in your answer — with specific examples. Vague references to "the government" score nothing; "the 2007 smoking ban reduced deaths from secondhand smoke exposure" scores marks.',
          },
        ],
      },

      // Screen 8 — Factor Web
      {
        label: 'Factor Web',
        kicker: 'Synoptic Thinking',
        heading: 'Everything connects. What matters most?',
        sub: 'Modern medicine didn\'t improve through one thing. It improved through everything at once.',
        blocks: [
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions',
                emoji: '🟢',
                questions: [
                  {
                    q: 'When was the NHS launched?',
                    options: [
                      '5 July 1948',
                      '11 November 1918',
                      '4 August 1914',
                      '1 January 1900',
                    ],
                    correct: 0,
                    feedback: '5 July 1948 — the date the National Health Service launched in Britain under Aneurin Bevan.',
                    hint: 'Post-WWII Britain. Summer of 1948. A Labour government minister named Bevan.',
                  },
                  {
                    q: 'What does "free at the point of use" mean?',
                    options: [
                      'Healthcare is free in certain hospitals only',
                      'You pay nothing when you need treatment — costs are covered by taxation',
                      'Doctors work for free as volunteers',
                      'Only emergency treatment is free',
                    ],
                    correct: 1,
                    feedback: '"Free at the point of use" means that when you need treatment, you pay nothing. The cost is met collectively through taxation and National Insurance — not at the moment you walk through the door.',
                    hint: 'The "point" is when you actually need treatment. What do you pay at that moment?',
                  },
                  {
                    q: 'Which of these is an example of a lifestyle disease?',
                    options: [
                      'Cholera — spread through contaminated water',
                      'Lung cancer — linked to smoking behaviour',
                      'Smallpox — spread through contact with infected people',
                      'Bubonic plague — spread by rat fleas',
                    ],
                    correct: 1,
                    feedback: 'Lung cancer (linked to smoking) is a lifestyle disease — caused primarily by behaviour, not bacteria or viruses. Cholera, smallpox and plague are infectious diseases caused by pathogens.',
                    hint: 'Lifestyle diseases are caused by behaviour and environment — not by microorganisms.',
                  },
                ],
              },
              {
                label: 'Apply It',
                emoji: '🟡',
                questions: [
                  {
                    q: 'Which factor was MOST important in creating the NHS?',
                    options: [
                      'Scientific discovery of DNA',
                      'Government political will and belief that healthcare should be universal',
                      'Accidental discovery of penicillin',
                      'Medieval traditions of monastic medicine',
                    ],
                    correct: 1,
                    feedback: 'The NHS required political will — a government that believed healthcare should be a universal right. The 1945 Labour election victory gave Bevan the mandate to create it. Scientific discovery and individual brilliance were not the main factors here.',
                    hint: 'The NHS was a political decision, not a scientific one. What did the government believe?',
                  },
                  {
                    q: 'What made mass vaccination effective as a public health tool?',
                    options: [
                      'Vaccines were invented by medieval monks',
                      'Government funding and organisation enabled vaccination at a scale that achieved herd immunity',
                      'Individual doctors independently vaccinated their own patients',
                      'Vaccination replaced surgery for all conditions',
                    ],
                    correct: 1,
                    feedback: 'Mass vaccination works through scale — herd immunity requires a high percentage of the population to be vaccinated. Only government-organised, government-funded campaigns could achieve this. Individual effort could not.',
                    hint: 'Why does vaccination need to happen at MASS scale? What does "herd immunity" require?',
                  },
                  {
                    q: 'Which of these is an example of PREVENTION rather than TREATMENT?',
                    options: [
                      'Prescribing antibiotics for pneumonia',
                      'Offering childhood MMR vaccinations through the NHS',
                      'Performing surgery to remove a tumour',
                      'Prescribing insulin for a diabetic patient',
                    ],
                    correct: 1,
                    feedback: 'MMR vaccination prevents measles, mumps and rubella before they develop. Antibiotics, surgery and insulin all treat conditions that already exist. Prevention stops disease; treatment responds to it.',
                    hint: 'Prevention happens BEFORE the disease. Treatment happens AFTER.',
                  },
                ],
              },
              {
                label: 'Exam Ready',
                emoji: '🔴',
                questions: [
                  {
                    q: 'Which factor was MOST important in improving public health in Britain after 1900?',
                    options: [
                      'Government intervention — NHS, vaccination programmes, legislation — reached the whole population at once',
                      'Individual scientists whose discoveries led to cures',
                      'War — which accelerated medical research in all areas',
                      'Technology — scanning and robotic surgery improved outcomes',
                    ],
                    correct: 0,
                    feedback: 'While scientists, war and technology all mattered, government intervention had the broadest reach. The NHS made every medical breakthrough accessible to all — not just those who could pay. Vaccination programmes protected whole populations. Legislation changed mass behaviour. Government action is the factor that connected everything else to the public.',
                    hint: 'Which factor reached EVERYONE in Britain — not just those who could afford it or those in a particular field?',
                  },
                  {
                    q: 'Which statement best explains the modern challenge of lifestyle diseases?',
                    options: [
                      'Lifestyle diseases are caused by bacteria that appeared after 1950',
                      'As infectious diseases were controlled, chronic diseases linked to behaviour became the leading cause of death — requiring regulation and prevention rather than cures',
                      'Lifestyle diseases only affect wealthy people who can afford to overeat',
                      'Lifestyle diseases replaced all other disease after the invention of the NHS',
                    ],
                    correct: 1,
                    feedback: 'The epidemiological transition — from infectious to chronic disease — is the key analytical point. As antibiotics and vaccines controlled cholera, TB and smallpox, heart disease, cancer and obesity rose. These require behaviour change and regulation, not just medical treatment.',
                    hint: 'What changed AFTER infectious diseases were controlled? What filled the gap?',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Screen 9 — Exam Master
      {
        label: 'Exam Master',
        kicker: 'Exam Skills',
        heading: 'How to answer NHS and modern health questions.',
        blocks: [
          {
            type: 'keypoint',
            text: '📝 <strong>AQA command words for this topic:</strong><br/>• <strong>Explain</strong> — give reasons, not just facts. Use "because" and "therefore."<br/>• <strong>Describe</strong> — give specific detail: dates, names, statistics.<br/>• <strong>How far do you agree</strong> — argue BOTH sides, reach a conclusion.<br/>• <strong>Why was X significant</strong> — say what changed, who benefited, why it mattered long-term.',
          },
          {
            type: 'examtip',
            label: '⚔️ Exam Assassin',
            tip: 'For "explain why" questions about the NHS: say WHAT it did + WHY that mattered + WHO benefited. Not just "the NHS was free." Instead: "The NHS made healthcare free at the point of use (WHAT), removing cost as a barrier to treatment (WHY), meaning working-class families could access doctors, dentists and specialists they previously could not afford (WHO)." Three parts. Every time.',
          },
          {
            type: 'examscored',
            question: 'Explain why the creation of the NHS in 1948 was significant. [4 marks]',
            markScheme: [
              'Award 1 mark for each valid developed point (up to 4 marks)',
              'Healthcare became free at the point of use — removing cost as a barrier to treatment',
              'The NHS was universal — covering all people in Britain regardless of income or employment status',
              'The NHS made medical breakthroughs (e.g. penicillin, vaccines) accessible to everyone, not just those who could pay',
              'The NHS transformed what illness meant for working-class families — no longer financial ruin, just illness',
              'The NHS employed 480,000 staff on day one, creating the infrastructure for mass public health',
              'Within a year, 187 million prescriptions and 8 million dental treatments showed the scale of unmet need it addressed',
            ],
            modelAnswer: 'The creation of the NHS in 1948 was significant because it made healthcare free at the point of use for the first time in British history. Before 1948, the poor often could not afford doctors, dentists or hospital treatment — illness could mean financial ruin for working-class families. The NHS removed this barrier: treatment was now a right, not a privilege. This was significant because it meant medical advances like antibiotics and vaccines reached everyone, not just those who could pay. On day one, 480,000 staff were employed, and within a year 187 million prescriptions had been issued — showing the enormous scale of need that had previously gone unmet.',
            isWarm: true,
          },
        ],
      },

      // Screen 9 — Final Boss
      {
        label: 'Final Boss',
        kicker: 'Boss Mode',
        heading: 'Three tiers. One chance to show everything.',
        blocks: [
          {
            type: 'boss',
            tier: '🟢',
            label: 'Round 1 — Core Knowledge',
            question: 'What was the NHS and when was it created? Name the person most responsible for its creation and explain one reason it was significant.',
            markPoints: `- The NHS (National Health Service) was created on 5 July 1948
- Aneurin Bevan was Minister of Health and the individual most responsible for driving it through parliament
- Significance: it made healthcare free at the point of use — the first time in British history that all people could access treatment regardless of income
- Significance (alternative): the scale was extraordinary — 480,000 staff on day one; 187 million prescriptions in the first year — showing enormous unmet need was now being addressed
- Award 1 mark per valid developed point (up to 4 marks)`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Round 2 — Explain & Analyse',
            question: 'Explain how the government\'s role in healthcare changed between 1900 and 2000. Use at least two examples.',
            markPoints: `- 1900: limited government role — National Insurance Act 1911 (Lloyd George) covered some working men but not families; charity and voluntary hospitals filled gaps; no universal provision
- 1948: transformative intervention — NHS created universal, free healthcare; all hospitals nationalised; 480,000 staff; funded through taxation
- Post-1948: government expanded into prevention — mass vaccination programmes (polio 1955, MMR 1988); public health campaigns
- Late 20th century: lifestyle disease regulation — 1983 seat belt law; 2007 smoking ban; 2018 sugar tax
- Pattern of change: from minimal, means-tested support → universal treatment → active prevention and behaviour regulation
- Award 1 mark per valid developed point with example; 2 marks for each well-explained change with specific detail`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Round 3 — Boss Mode',
            question: '"Government action was the most important factor in improving healthcare in Britain after 1900." How far do you agree? Use evidence from across the period.',
            markPoints: `- AGREEMENT — government action was decisive:
  - NHS (1948): made healthcare universal and free — removed cost as barrier, reached the whole population
  - Mass vaccination campaigns: only government could fund and organise at the scale required for herd immunity (polio 1955, MMR 1988, COVID 2020-21)
  - Lifestyle legislation: smoking ban (2007), seat belt law (1983), sugar tax (2018) — changed mass behaviour through law
  - Government as funder: NHS enabled access to ALL medical breakthroughs — without it, antibiotics, scans, transplants reached only the wealthy
- COUNTERARGUMENT — other factors also important:
  - Science and technology: DNA discovery, scanning technology, antibiotics — government did not discover these; individual scientists and teams did
  - Individual geniuses: Fleming, Florey, Chain, Watson and Crick — government action without their discoveries would have had nothing to distribute
  - Chance: Fleming's accidental discovery — no government planned this
  - War: WWII accelerated penicillin production — an external factor, not government planning
- CONCLUSION: Government action was crucial as the mechanism that distributed and applied other improvements — but it relied on science, technology and individuals to have something worth distributing. The strongest argument for government primacy: without the NHS, advances in medicine reached only those who could pay. Government action made improvement universal. Award marks for: sustained argument, specific evidence for and against, justified conclusion`,
          },
        ],
      },

      // Screen 10 — Retrieval
      {
        label: 'Retrieval',
        kicker: 'Retrieval',
        heading: 'Lock it in. No hints.',
        blocks: [
          {
            type: 'flashcards',
            cards: [
              { front: 'NHS creation date', back: '5 July 1948 — launched by Aneurin Bevan under the Labour government of Clement Attlee.' },
              { front: 'Aneurin Bevan', back: 'Minister of Health 1945–51. Drove the NHS through parliament against BMA opposition. Said he "stuffed their mouths with gold."' },
              { front: 'Free at the point of use', back: 'The founding NHS principle: when you need treatment, you pay nothing. Funded by National Insurance and taxation.' },
              { front: 'BMA opposition to the NHS', back: 'The British Medical Association (doctors\' professional body) opposed the NHS — fearing loss of income and independence. Bevan overcame this with merit awards and private pay beds.' },
              { front: 'Salk polio vaccine', back: '1955 — Jonas Salk\'s vaccine against polio. Government-funded mass campaign in Britain. Polio cases collapsed within years.' },
              { front: 'Lifestyle disease examples', back: 'Heart disease, lung cancer (linked to smoking), obesity, type 2 diabetes — caused by behaviour and environment, not bacteria.' },
              { front: 'Smoking ban year', back: '2007 — smoking banned in all enclosed public spaces in England. Evidence-driven: 1962 RCP report had linked smoking to cancer.' },
              { front: 'Prevention vs treatment', back: 'Prevention stops disease before it occurs (vaccination, campaigns). Treatment responds after disease develops (antibiotics, surgery). Prevention is generally cheaper.' },
              { front: 'Government as a factor in medicine', back: 'Government action is the thread connecting all medical progress to the public: sewers, NHS, vaccination, legislation. Without state funding and organisation, advances reach only the wealthy.' },
              { front: 'COVID-19 vaccination rollout', back: '2020–21. The fastest mass vaccination programme in history — over 15 million doses in the first two months. A modern example of government as the key public health actor.' },
            ],
          },
          {
            type: 'quiz',
            question: 'Which factor was MOST important in improving healthcare access for the whole British population after 1900?',
            options: [
              { text: 'Individual scientific genius — Fleming, Florey, Chain and others', correct: false },
              { text: 'Government intervention — creating the NHS, funding vaccination and passing health legislation', correct: true },
              { text: 'Charitable donations to voluntary hospitals', correct: false },
              { text: 'Technological invention of X-rays and scanning', correct: false },
            ],
            explanation: 'Scientific genius, technology and charity all contributed — but government intervention was the mechanism that made improvements universal. The NHS reached everyone; penicillin without the NHS reached only those who could pay. Government action turned discoveries into universal benefits.',
          },
        ],
      },

    ],
  },


  episodeWesternFront,
]
