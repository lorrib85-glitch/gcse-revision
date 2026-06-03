// ─── Content Index ─────────────────────────────────────────────────────────────
// Maps topicTag → section metadata for the Targeted Brush-Up system.
// Keys match topicTags used on quiz/exam blocks throughout modules.js.

export const CONTENT_INDEX = {

  // ── History: Medieval Medicine (mod1) ──────────────────────────────────────
  'four-humours': {
    sectionId: 'four-humours',
    title: 'The Four Humours',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Causes',
    keywords: ['four humours', 'blood', 'phlegm', 'yellow bile', 'black bile', 'imbalance', 'Hippocrates', 'Galen'],
    summary: 'Medieval doctors believed illness was caused by an imbalance in four bodily humours.',
    keyReminders: [
      'Four humours: blood, phlegm, yellow bile, black bile',
      'Illness = imbalance → treatments aimed to rebalance (bloodletting, purging, diet)',
      'Based on Hippocrates and Galen — trusted because the Church supported ancient texts',
    ],
    rescueQuestion: {
      q: 'According to the four humours theory, what caused illness?',
      options: ['Bacteria entering the body', 'An imbalance in bodily fluids', 'Bad air from rotting matter', 'Punishment from God'],
      correct: 1,
      explanation: 'The four humours theory said illness resulted from an imbalance in the four bodily fluids. Treatments aimed to restore balance.',
    },
  },

  'miasma': {
    sectionId: 'miasma',
    title: 'Miasma Theory',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Causes',
    keywords: ['miasma', 'bad air', 'smell', 'plague', 'disease', 'rational'],
    summary: 'Miasma theory said disease was caused by bad air from rotting matter. It seemed rational but was wrong.',
    keyReminders: [
      'Miasma = bad air from rotting matter, sewage or corpses',
      'Classed as a rational explanation — based on observation, not religion',
      'Wrong cause, but led to useful actions: cleaning streets, better sanitation',
    ],
    rescueQuestion: {
      q: 'Was miasma theory classified as rational or supernatural?',
      options: ['Supernatural — based on God\'s will', 'Rational — based on observation and logic', 'Scientific — proved by experiment', 'Neither — it was rejected immediately'],
      correct: 1,
      explanation: 'Miasma was a rational theory because it was based on observation (disease appeared where things smelled bad). It was wrong — but it was logical, not religious.',
    },
  },

  'medieval-causes': {
    sectionId: 'medieval-causes',
    title: 'Causes of Illness in Medieval Times',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Causes',
    keywords: ['medieval', 'causes', 'four humours', 'miasma', 'God', 'astrology', 'supernatural', 'rational'],
    summary: 'Medieval people blamed illness on four things: four humours, miasma, God\'s punishment, and astrology.',
    keyReminders: [
      'Rational causes: four humours (imbalance), miasma (bad air)',
      'Supernatural causes: God\'s punishment (sin), astrology (planets)',
      'No germ theory — bacteria and viruses were completely unknown',
    ],
    rescueQuestion: {
      q: 'Which of these was a SUPERNATURAL explanation for illness in medieval times?',
      options: ['An imbalance in the four humours', 'Bad air (miasma)', 'God\'s punishment for sin', 'Blocked blood vessels'],
      correct: 2,
      explanation: 'God\'s punishment is supernatural — it relies on religion and belief rather than observation or logic.',
    },
  },

  'god-church': {
    sectionId: 'god-church',
    title: 'God, the Church and Medieval Medicine',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Galen & Church',
    keywords: ['Church', 'God', 'religion', 'Galen', 'continuity', 'universities', 'ancient texts'],
    summary: 'The Church preserved ancient medical texts and taught that God controlled health. This slowed change.',
    keyReminders: [
      'The Church ran hospitals and medical schools — it shaped what doctors were taught',
      'Galen\'s ideas were preserved and taught because the Church approved of them',
      'Teaching only approved texts meant new ideas were suppressed for centuries',
    ],
    rescueQuestion: {
      q: 'Why did the Church slow down medical progress in medieval Europe?',
      options: [
        'It banned all surgery', 'It only allowed treatments based on astrology',
        'It preserved and enforced the teaching of ancient texts like Galen\'s', 'It funded only religious treatments',
      ],
      correct: 2,
      explanation: 'The Church controlled universities and promoted ancient authorities like Galen. This made it hard for new ideas to be accepted or taught.',
    },
  },

  'black-death': {
    sectionId: 'black-death',
    title: 'The Black Death 1348',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Black Death',
    keywords: ['Black Death', 'plague', '1348', 'bubonic', 'pandemic', 'fleas', 'rats', 'Yersinia pestis'],
    summary: 'The Black Death killed ~40% of Europe. Medieval people couldn\'t stop it because they didn\'t know the real cause.',
    keyReminders: [
      'Real cause: Yersinia pestis bacteria, spread by fleas on black rats',
      'Medieval explanations: miasma, God\'s punishment, planetary alignment',
      'Treatments failed — flagellants, beak doctors, prayer — because the cause was unknown',
    ],
    rescueQuestion: {
      q: 'What was the ACTUAL cause of the Black Death?',
      options: ['Bad air from rotting matter', 'God\'s punishment', 'Bacteria spread by fleas on rats', 'An imbalance in the four humours'],
      correct: 2,
      explanation: 'Yersinia pestis bacteria, carried by fleas on black rats, caused the plague. Medieval people had no idea — germ theory was 500+ years away.',
    },
  },

  'medieval-treatments': {
    sectionId: 'medieval-treatments',
    title: 'Medieval Treatments',
    subject: 'History',
    moduleId: 'mod1',
    screenLabel: 'Treatments',
    keywords: ['bloodletting', 'purging', 'herbal remedies', 'prayer', 'pilgrimage', 'barber surgeon', 'cauterisation'],
    summary: 'Medieval treatments were based on wrong theories — but they were logical given the beliefs of the time.',
    keyReminders: [
      'Humour imbalance → bloodletting, purging, fasting (to rebalance)',
      'God\'s punishment → prayer, confession, pilgrimage',
      'Herbal remedies were common and sometimes genuinely soothing',
    ],
    rescueQuestion: {
      q: 'Why did medieval doctors use bloodletting as a treatment?',
      options: [
        'To kill bacteria in the blood', 'To rebalance the four humours',
        'To prevent infection spreading', 'Because it was ordered by the Church',
      ],
      correct: 1,
      explanation: 'Bloodletting aimed to remove excess blood and restore humour balance. It was logical given the four humours theory — even though the theory was wrong.',
    },
  },

  // ── History: Renaissance (mod2) ────────────────────────────────────────────
  'renaissance-change': {
    sectionId: 'renaissance-change',
    title: 'Renaissance Medical Change',
    subject: 'History',
    moduleId: 'mod2',
    screenLabel: 'Renaissance',
    keywords: ['Renaissance', 'Vesalius', 'Harvey', 'printing press', 'dissection', 'observation', 'change'],
    summary: 'The Renaissance saw new challenges to Galen. Vesalius proved Galen wrong on anatomy. Harvey proved blood circulates.',
    keyReminders: [
      'Vesalius (1543): dissected human bodies and proved Galen\'s anatomy contained errors',
      'Harvey (1628): proved blood circulates — overturned Galen\'s idea that the liver makes new blood',
      'The printing press spread new ideas faster — but most treatments still didn\'t change',
    ],
    rescueQuestion: {
      q: 'What did Vesalius contribute to medical knowledge?',
      options: [
        'He discovered that blood circulates around the body',
        'He proved Galen\'s anatomy contained errors through human dissection',
        'He developed the first anaesthetic',
        'He identified the bacteria causing tuberculosis',
      ],
      correct: 1,
      explanation: 'Vesalius dissected human bodies and published De Fabrica (1543), showing Galen had made over 200 errors in anatomy.',
    },
  },

  'great-plague': {
    sectionId: 'great-plague',
    title: 'The Great Plague 1665',
    subject: 'History',
    moduleId: 'mod2',
    screenLabel: 'Great Plague',
    keywords: ['Great Plague', '1665', 'London', 'miasma', 'government response', 'continuity'],
    summary: 'Despite Renaissance advances, people still blamed miasma and God for the 1665 plague. Government response improved but medicine had not.',
    keyReminders: [
      'The Great Plague (1665) killed ~100,000 in London',
      'Government response was more organised than 1348 — but still based on wrong theories',
      'Miasma and God\'s punishment were still the main explanations',
    ],
    rescueQuestion: {
      q: 'How did the 1665 response to plague differ from the 1348 response?',
      options: [
        'People knew the real cause in 1665', 'Germ theory had been accepted by 1665',
        'Government response was more organised, but explanations were still wrong',
        'Antibiotics were used for the first time',
      ],
      correct: 2,
      explanation: 'By 1665, government response improved (quarantine, pest houses), but people still believed in miasma and God\'s punishment — germ theory was still 200 years away.',
    },
  },

  // ── History: Anaesthetics (mod3 and mod6) ──────────────────────────────────
  'anaesthetics': {
    sectionId: 'anaesthetics',
    title: 'Development of Anaesthetics',
    subject: 'History',
    moduleId: 'mod6',
    screenLabel: 'Anaesthetics',
    keywords: ['anaesthetic', 'Simpson', 'Morton', 'chloroform', 'ether', 'pain', 'surgery', 'nitrous oxide'],
    summary: 'Anaesthetics reduced pain during surgery but initially caused new problems. Simpson\'s chloroform was key.',
    keyReminders: [
      'Morton (1846): first public use of ether as anaesthetic in surgery',
      'Simpson (1847): discovered chloroform — faster, stronger, less flammable',
      'Early problem: dosage — Hannah Greener died in 1848 from chloroform overdose',
    ],
    rescueQuestion: {
      q: 'What problem did early anaesthetics NOT solve?',
      options: ['Pain during surgery', 'Patient unconsciousness', 'Post-operative infection', 'Speed of surgeon'],
      correct: 2,
      explanation: 'Anaesthetics eliminated pain but did not address infection. Longer operations (now possible without patient distress) could actually increase infection risk.',
    },
  },

  'antiseptics': {
    sectionId: 'antiseptics',
    title: 'Antiseptics and Lister',
    subject: 'History',
    moduleId: 'mod6',
    screenLabel: 'Lister',
    keywords: ['Lister', 'antiseptic', 'carbolic acid', 'Pasteur', 'germ theory', 'infection', '1865'],
    summary: 'Lister applied Pasteur\'s germ theory to surgery in the 1860s, using carbolic acid to kill germs.',
    keyReminders: [
      'Lister (1865): used carbolic acid spray on wounds, instruments and dressings',
      'Death rates from post-op infection fell dramatically',
      'Antiseptic (kill germs) led to aseptic (prevent germs entering) surgery',
    ],
    rescueQuestion: {
      q: 'How did Pasteur\'s work influence Lister\'s approach to surgery?',
      options: [
        'Pasteur taught Lister to use chloroform',
        'Pasteur\'s germ theory showed microbes caused disease — Lister applied this to prevent infection in surgery',
        'Pasteur recommended carbolic acid directly',
        'Pasteur proved that surgery was safe without sterilisation',
      ],
      correct: 1,
      explanation: 'Lister read Pasteur\'s germ theory and reasoned: if microbes cause decay, killing them with carbolic acid before and during surgery should prevent post-operative infection.',
    },
  },

  // ── History: Germ Theory (mod4) ────────────────────────────────────────────
  'germ-theory': {
    sectionId: 'germ-theory',
    title: 'Germ Theory — Pasteur and Koch',
    subject: 'History',
    moduleId: 'mod4',
    screenLabel: 'Pasteur',
    keywords: ['germ theory', 'Pasteur', 'Koch', 'bacteria', 'microbes', 'swan-neck flask', '1861'],
    summary: 'Pasteur proved microbes cause decay and disease. Koch identified specific bacteria behind TB, cholera and anthrax.',
    keyReminders: [
      'Pasteur (1861): swan-neck flask experiment proved microbes cause decay, not spontaneous generation',
      'Koch: identified bacteria causing anthrax (1876), TB (1882) and cholera (1883)',
      'Germ theory replaced miasma as the dominant explanation for disease',
    ],
    rescueQuestion: {
      q: 'What did Pasteur\'s swan-neck flask experiment prove?',
      options: [
        'That bacteria could be killed with heat', 'That microbes came from outside the body',
        'That microbes caused disease, not spontaneous generation',
        'That carbolic acid could sterilise equipment',
      ],
      correct: 2,
      explanation: 'The flask showed microbes came from the air (outside) rather than appearing spontaneously from the liquid. This disproved spontaneous generation and supported germ theory.',
    },
  },

  // ── History: Public Health (mod5) ──────────────────────────────────────────
  'public-health': {
    sectionId: 'public-health',
    title: '19th Century Public Health',
    subject: 'History',
    moduleId: 'mod5',
    screenLabel: 'Cities Explode',
    keywords: ['public health', 'cholera', 'Chadwick', 'Snow', 'sewers', 'Bazalgette', 'Great Stink', 'laissez-faire'],
    summary: 'Industrial towns were disease hotspots. Government had to be forced to act on sewers and clean water.',
    keyReminders: [
      'Chadwick (1842): report linked poverty, filth and disease — demanded government action',
      'John Snow (1854): mapped cholera deaths to a water pump — proved waterborne transmission',
      'Great Stink (1858): Parliament smelled the Thames → Bazalgette built London\'s sewers',
    ],
    rescueQuestion: {
      q: 'How did John Snow prove cholera spread through water?',
      options: [
        'He grew the cholera bacteria in a laboratory',
        'He mapped deaths to a specific water pump on Broad Street',
        'He proved miasma caused cholera through an experiment',
        'He discovered the cholera bacterium under a microscope',
      ],
      correct: 1,
      explanation: 'Snow\'s map of cholera deaths clustered around the Broad Street pump — removing the handle stopped the outbreak. He proved waterborne transmission without knowing what the pathogen was.',
    },
  },

  // ── History: Penicillin (mod7) ─────────────────────────────────────────────
  'penicillin': {
    sectionId: 'penicillin',
    title: 'Discovery of Penicillin',
    subject: 'History',
    moduleId: 'mod7',
    screenLabel: 'Fleming\'s Discovery',
    keywords: ['penicillin', 'Fleming', 'Florey', 'Chain', 'antibiotics', '1928', 'mould', 'staphylococcus'],
    summary: 'Fleming discovered penicillin by accident in 1928. Florey and Chain turned it into a usable drug.',
    keyReminders: [
      'Fleming (1928): noticed mould killing bacteria on a contaminated petri dish',
      'Fleming couldn\'t isolate or mass-produce it — penicillin sat unused for 12 years',
      'Florey and Chain (1940): purified and tested penicillin, WWII drove mass production',
    ],
    rescueQuestion: {
      q: 'Why didn\'t Fleming develop penicillin into a usable drug after discovering it?',
      options: [
        'He wasn\'t interested in its medical potential',
        'He couldn\'t purify or produce it in large enough quantities',
        'The government refused to fund his research',
        'Penicillin didn\'t work on human bacteria',
      ],
      correct: 1,
      explanation: 'Fleming recognised its potential but lacked the biochemical skills and funding to purify and mass-produce it. Florey and Chain solved this problem a decade later.',
    },
  },

  'nhs': {
    sectionId: 'nhs',
    title: 'The National Health Service (NHS)',
    subject: 'History',
    moduleId: 'mod7',
    screenLabel: 'The NHS',
    keywords: ['NHS', '1948', 'Bevan', 'Beveridge', 'welfare state', 'free healthcare', 'government'],
    summary: 'The NHS (1948) gave everyone free healthcare at the point of need — a turning point in public health.',
    keyReminders: [
      'NHS founded 1948 by Aneurin Bevan, based on the Beveridge Report (1942)',
      'Free at the point of use — funded by taxation',
      'Transformed healthcare access: previously, the poor often couldn\'t afford treatment',
    ],
    rescueQuestion: {
      q: 'What was revolutionary about the NHS when it was founded in 1948?',
      options: [
        'It was the first hospital system in the world',
        'It made all drugs free worldwide',
        'It provided free healthcare to everyone at the point of need, funded by taxation',
        'It replaced all private medicine immediately',
      ],
      correct: 2,
      explanation: 'Before the NHS, most people paid for healthcare — or went without. The NHS made treatment available to everyone regardless of income.',
    },
  },

  // ── Sociology: Core Concepts (soc1) ────────────────────────────────────────
  'socialisation': {
    sectionId: 'socialisation',
    title: 'Socialisation',
    subject: 'Sociology',
    moduleId: 'soc1',
    screenLabel: 'Socialisation',
    keywords: ['socialisation', 'primary', 'secondary', 'norms', 'values', 'agencies', 'family', 'school'],
    summary: 'Socialisation is the process of learning society\'s norms and values. Primary is through family; secondary through school, peers, media.',
    keyReminders: [
      'Primary socialisation: family, early childhood — first and most fundamental',
      'Secondary socialisation: school, peers, media, religion — later in life',
      'Both teach norms, values and expected behaviour',
    ],
    rescueQuestion: {
      q: 'Which is the correct definition of primary socialisation?',
      options: [
        'Learning norms through school and education',
        'The most important type of socialisation',
        'The process of learning society\'s norms and values through the family in early childhood',
        'Learning behaviour through peer groups',
      ],
      correct: 2,
      explanation: 'Primary socialisation refers specifically to early childhood learning through the family — it\'s called "primary" because it\'s the first and most foundational stage.',
    },
  },

  'norms-values': {
    sectionId: 'norms-values',
    title: 'Norms and Values',
    subject: 'Sociology',
    moduleId: 'soc1',
    screenLabel: 'Norms & Values',
    keywords: ['norms', 'values', 'behaviour', 'beliefs', 'expected', 'sanctions', 'social control'],
    summary: 'Norms = expected behaviour. Values = shared beliefs about what is right. Students often confuse these.',
    keyReminders: [
      'Norms = rules for expected behaviour (how to act)',
      'Values = shared beliefs about what matters (what to believe)',
      'Sanctions enforce norms: positive (reward) or negative (punishment)',
    ],
    rescueQuestion: {
      q: '"Queuing in a shop" — is this a norm or a value?',
      options: ['A value — people believe it is morally important', 'A norm — it is an expected behaviour', 'Both equally', 'Neither'],
      correct: 1,
      explanation: 'Queuing is a norm — it is an expected behaviour. Values are deeper beliefs like honesty or fairness. Norms are the behavioural rules that flow from values.',
    },
  },

  // ── Sociology: Perspectives (soc2) ─────────────────────────────────────────
  'marxism': {
    sectionId: 'marxism',
    title: 'Marxism',
    subject: 'Sociology',
    moduleId: 'soc2',
    screenLabel: 'Karl Marx',
    keywords: ['Marx', 'Marxism', 'capitalism', 'bourgeoisie', 'proletariat', 'class conflict', 'exploitation', 'false consciousness'],
    summary: 'Marxists argue society is based on class conflict. The ruling class exploits workers and uses institutions to maintain power.',
    keyReminders: [
      'Bourgeoisie (ruling class) own the means of production; proletariat (workers) sell their labour',
      'Institutions (family, school, media) reproduce class inequality and false consciousness',
      'Key claim: society serves the interests of the rich, not everyone equally',
    ],
    rescueQuestion: {
      q: 'What does Marx mean by "false consciousness"?',
      options: [
        'Workers being physically unaware of their environment',
        'Workers believing the system is fair when it actually exploits them',
        'The ruling class pretending to work',
        'Sociologists misunderstanding capitalism',
      ],
      correct: 1,
      explanation: 'False consciousness is when workers accept the capitalist system as normal or fair — not realising it is designed to exploit them for the benefit of the ruling class.',
    },
  },

  'functionalism': {
    sectionId: 'functionalism',
    title: 'Functionalism',
    subject: 'Sociology',
    moduleId: 'soc2',
    screenLabel: 'Émile Durkheim',
    keywords: ['Durkheim', 'Parsons', 'functionalism', 'consensus', 'social solidarity', 'institutions', 'stability'],
    summary: 'Functionalists see society as a stable system where all institutions work together for the common good.',
    keyReminders: [
      'Society is like an organism — each institution has a function that maintains the whole',
      'Durkheim: social solidarity (cohesion) holds society together; anomie is its breakdown',
      'Parsons: schools, family and media socialise people into shared norms and values',
    ],
    rescueQuestion: {
      q: 'Which metaphor do Functionalists use to describe society?',
      options: ['A battlefield', 'A living organism with interdependent parts', 'A prison', 'A marketplace'],
      correct: 1,
      explanation: 'Functionalists compare society to a biological organism — each institution (family, education, religion) plays a specific function that keeps the whole society healthy.',
    },
  },

  // ── Sociology: Feminism (soc3) ─────────────────────────────────────────────
  'feminism': {
    sectionId: 'feminism',
    title: 'Feminist Perspectives',
    subject: 'Sociology',
    moduleId: 'soc3',
    screenLabel: 'What Is Feminism?',
    keywords: ['feminism', 'patriarchy', 'gender inequality', 'Oakley', 'domestic labour', 'emotional labour', 'life chances'],
    summary: 'Feminists argue society is patriarchal — structured to benefit men at the expense of women.',
    keyReminders: [
      'Patriarchy: a system where men hold more power and privilege than women',
      'Oakley: women perform most domestic and emotional labour — unpaid and unrecognised',
      'Feminists challenge gender role expectations as socially constructed, not natural',
    ],
    rescueQuestion: {
      q: 'What do feminists mean by "patriarchy"?',
      options: [
        'A society ruled by fathers',
        'A social system where men hold structural power and privilege over women',
        'A political party in favour of traditional values',
        'The legal system in most countries',
      ],
      correct: 1,
      explanation: 'Patriarchy describes a social system — not just individual sexism — where institutions, laws and cultural norms systematically advantage men over women.',
    },
  },

  // ── Sociology: Family (soc4) ───────────────────────────────────────────────
  'family-types': {
    sectionId: 'family-types',
    title: 'Family Types',
    subject: 'Sociology',
    moduleId: 'soc4',
    screenLabel: 'Family Types',
    keywords: ['nuclear', 'extended', 'reconstituted', 'lone-parent', 'beanpole', 'boomerang', 'family types'],
    summary: 'Sociologists recognise many family types. The nuclear family is no longer the majority in the UK.',
    keyReminders: [
      'Nuclear: two parents + dependent children only',
      'Beanpole: many generations alive, few siblings — caused by longer life, falling birth rates',
      'Reconstituted (blended/step): adults with children from previous relationships',
    ],
    rescueQuestion: {
      q: 'Which family type is described as "long and thin"?',
      options: ['Nuclear family', 'Extended family', 'Beanpole family', 'Reconstituted family'],
      correct: 2,
      explanation: 'The beanpole family has many generations alive simultaneously but few siblings at each level — long (many generations) and thin (few siblings). Caused by longer lifespans and lower birth rates.',
    },
  },

  'domestic-labour': {
    sectionId: 'domestic-labour',
    title: 'Domestic and Emotional Labour',
    subject: 'Sociology',
    moduleId: 'soc4',
    screenLabel: 'Feminism',
    keywords: ['domestic labour', 'emotional labour', 'Oakley', 'dual burden', 'housework', 'childcare', 'inequality'],
    summary: 'Ann Oakley found women perform most domestic and emotional labour — even when working full-time.',
    keyReminders: [
      'Domestic labour: physical tasks — cooking, cleaning, childcare',
      'Emotional labour: invisible work — managing relationships, organising, worrying',
      'Dual burden: women in paid work still do most unpaid domestic work at home',
    ],
    rescueQuestion: {
      q: 'What did Ann Oakley\'s 1974 research find?',
      options: [
        'That men and women share domestic labour equally',
        'That women perform most domestic labour even when working full-time',
        'That domestic labour is no longer an issue in modern families',
        'That the state should pay for domestic work',
      ],
      correct: 1,
      explanation: 'Oakley\'s research found that even when women worked full-time, they still did most housework and childcare — the "dual burden" of paid and unpaid work.',
    },
  },
}

// ─── Keyword fallback matching ─────────────────────────────────────────────────
// If a block has no topicTags, match against question text using keyword index.
export function findSectionByKeywords(questionText = '') {
  const q = questionText.toLowerCase()
  let best = null
  let bestScore = 0
  for (const [tag, entry] of Object.entries(CONTENT_INDEX)) {
    const score = entry.keywords.filter(kw => q.includes(kw.toLowerCase())).length
    if (score > bestScore) { bestScore = score; best = { tag, entry } }
  }
  return bestScore >= 1 ? best : null
}
