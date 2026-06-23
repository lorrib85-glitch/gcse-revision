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
import episodeRenaissanceMedicine from '../content/history/medicine/episodes/episode-03-renaissance-medicine.js'
import episodeSurgeryAnaesthetics from '../content/history/medicine/episodes/episode-04-surgery-anaesthetics.js'
import episodeJenner from '../content/history/medicine/episodes/episode-06-jenner-vaccination.js'
import episodeGermTheory from '../content/history/medicine/episodes/episode-07-germ-theory.js'
import episodeGreatStink from '../content/history/medicine/episodes/episode-08-great-stink.js'
import episodeSurgeryRevolution from '../content/history/medicine/episodes/episode-09-surgery-revolution.js'
import episodeAccidentalMiracle from '../content/history/medicine/episodes/episode-11-accidental-miracle.js'
import episodeWhenMedicineBecameMagic from '../content/history/medicine/episodes/episode-12-when-medicine-became-magic.js'
import episodeWesternFront from '../content/history/medicine/episodes/episode-14-western-front.js'

export const HISTORY_MODULES = [
  episodeMedievalBeliefs,

  episodeBlackDeath,

  episodeRenaissanceMedicine,

  episodeSurgeryAnaesthetics,

  // ── Episode 5: London's year of terror (history-medicine-great-plague) ───────
  // Unbuilt — screenCount 0 in src/modules.js. No inline content. Build from scratch when ready.

  episodeJenner,

  episodeGermTheory,

  episodeGreatStink,

  episodeSurgeryRevolution,

  // ── Episode 10: The lady with the lamp (history-medicine-nightingale) ─────────
  // Unbuilt — screenCount 0 in src/modules.js. No inline content. Build from scratch when ready.

  episodeAccidentalMiracle,

  episodeWhenMedicineBecameMagic,

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
