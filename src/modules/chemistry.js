// ─── Chemistry module content — full lesson data for Chemistry modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a Chemistry module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.

export const CHEMISTRY_MODULES = [
  // ─── Chemistry — Placeholder topic group modules ──────────────────────────────

  {
    id: 'chem_matter_atoms', subject: 'Chemistry', number: 1,
    title: 'Matter & Atoms', subtitle: 'Elements, Bonding & Giant Structures',
    icon: '⚛️', color: '#9B59E8', colorLight: 'rgba(155,89,232,.15)',
    hook: {
      statement: 'An atom is mostly empty space.',
      isTrue: true,
      accentWords: ['mostly empty space'],
      explanation: "If an atom's nucleus were the size of a pea, the electrons would orbit 500 metres away. Everything in between is empty.",
    },
    outcomes: {
      intro: 'Everything you can touch, see or breathe is made of atoms. This chapter shows what that actually means.',
      bullets: [
        'Describe the structure of an atom and what each particle does',
        'Explain the patterns in the Periodic Table and why they exist',
        'See how ionic, covalent and metallic bonding work differently',
        'Describe the properties of giant structures like diamond, graphite and metals',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Atoms of the same element always have the same number of protons.', isTrue: true },
        { type: 'choice', question: 'In ionic bonding, electrons are...', options: ['Shared equally between atoms', 'Transferred completely from one atom to another', 'Released into the surrounding atmosphere'], correct: 1 },
        { type: 'connection', question: 'Diamond and graphite behave so differently because...', options: [
          { text: 'They contain different numbers of protons in their nuclei', icon: 'atom' },
          { text: 'Their carbon atoms are arranged in completely different structures', icon: 'gear' },
          { text: 'Diamond contains more carbon atoms per cubic centimetre', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 1',
        heading: 'Matter & Atoms',
        content: [
          { type: 'keypoint', text: 'Everything is made of <strong>atoms</strong>. Understanding atomic structure, how atoms bond, and the patterns in the Periodic Table is the foundation of all chemistry.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Atoms & Elements</strong> — protons, neutrons, electrons and atomic number.<br><strong>The Periodic Table</strong> — groups, periods, trends and key element groups.<br><strong>Bonding Basics</strong> — ionic, covalent and metallic bonding.<br><strong>Giant Structures & Materials</strong> — diamond, graphite, metals and polymers.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_reactions', subject: 'Chemistry', number: 2,
    title: 'Chemical Reactions', subtitle: 'Equations, Acids & Electrolysis',
    icon: '🧪', color: '#C459E8', colorLight: 'rgba(196,89,232,.15)',
    hook: {
      statement: 'You can neutralise an acid by adding more acid.',
      isTrue: false,
      accentWords: ['neutralise', 'adding more acid'],
      explanation: "You neutralise an acid with an alkali. Adding more acid makes it more acidic. Neutralisation needs opposite pH — acid meets base.",
    },
    outcomes: {
      intro: 'Chemistry is really just atoms rearranging themselves. This chapter shows you how to track — and predict — those rearrangements.',
      bullets: [
        'Write and balance chemical equations from scratch',
        'Explain what happens during acid-base reactions',
        'Describe how electrolysis splits compounds using electricity',
        'Understand energy changes in exothermic and endothermic reactions',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'A balanced equation has more atoms on the right than the left.', isTrue: false },
        { type: 'choice', question: 'Neutralisation reactions always produce...', options: ['Only water as a product', 'A salt and water together', 'Carbon dioxide and water'], correct: 1 },
        { type: 'connection', question: 'Electrolysis is used industrially to...', options: [
          { text: 'Speed up reactions that would otherwise be too slow', icon: 'arrow' },
          { text: 'Extract and purify metals like aluminium from their ores', icon: 'atom' },
          { text: 'Create entirely new chemical elements in the lab', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 2',
        heading: 'Chemical Reactions',
        content: [
          { type: 'keypoint', text: 'Chemical reactions rearrange atoms. Learning to write balanced equations, understand acid-base chemistry, and explain electrolysis are core exam skills.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Reactions & Equations</strong> — balancing equations, types of reaction, state symbols.<br><strong>Acids, Alkalis & Salts</strong> — pH, neutralisation, making salts and titration.<br><strong>Electrolysis</strong> — electrodes, half-equations and industrial uses.<br><strong>Energy Changes</strong> — exothermic, endothermic, bond energies and Hess\'s law.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_rates_organic', subject: 'Chemistry', number: 3,
    title: 'Rates & Organic Chemistry', subtitle: 'Rates, Equilibria, Hydrocarbons & Fuels',
    icon: '🛢️', color: '#8B59E8', colorLight: 'rgba(139,89,232,.15)',
    hook: {
      statement: 'Crude oil took millions of years to form.',
      isTrue: true,
      accentWords: ['millions of years'],
      explanation: "Crude oil formed from marine organisms buried 300–400 million years ago. We're burning in decades what took geological ages to create.",
    },
    outcomes: {
      intro: 'Crude oil built the modern world. This chapter shows where it came from, what it contains, and what happens when it burns.',
      bullets: [
        'Explain how temperature, concentration and catalysts affect reaction rate',
        'Describe what reversible reactions and equilibrium mean in practice',
        'See how fractional distillation separates crude oil into useful fractions',
        'Understand cracking — and why alkenes are more useful than alkanes',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Increasing temperature always slows down a chemical reaction.', isTrue: false },
        { type: 'choice', question: 'Fractional distillation separates crude oil based on...', options: ['The colour of different hydrocarbon fractions', 'The boiling points of different hydrocarbons', 'The size of molecules only'], correct: 1 },
        { type: 'connection', question: 'Cracking long-chain hydrocarbons is commercially valuable because...', options: [
          { text: 'It produces more crude oil from existing reserves', icon: 'warning' },
          { text: 'It creates shorter, more useful molecules like petrol and ethene', icon: 'flask' },
          { text: 'It removes toxic impurities from petroleum products', icon: 'leaf' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 3',
        heading: 'Rates & Organic Chemistry',
        content: [
          { type: 'keypoint', text: '<strong>Crude oil</strong> is the basis of most fuels and plastics. Understanding how reactions speed up, reach equilibrium, and how organic compounds are separated is crucial for the exam.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Rates of Reaction</strong> — concentration, temperature, surface area and catalysts.<br><strong>Reversible Reactions</strong> — equilibrium, Le Chatelier\'s principle and the Haber process.<br><strong>Hydrocarbons & Crude Oil</strong> — alkanes, alkenes, fractional distillation.<br><strong>Cracking & Fuels</strong> — thermal cracking, catalytic cracking and combustion.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'chem_earth', subject: 'Chemistry', number: 4,
    title: 'Earth Chemistry', subtitle: 'Atmosphere, Climate & Resources',
    icon: '🌍', color: '#5980E8', colorLight: 'rgba(89,128,232,.15)',
    hook: {
      statement: "Earth's atmosphere has always been 21% oxygen.",
      isTrue: false,
      accentWords: ['always been 21% oxygen'],
      explanation: "The early atmosphere was mostly carbon dioxide and nitrogen — no oxygen at all. Cyanobacteria slowly built it up over billions of years through photosynthesis.",
    },
    outcomes: {
      intro: 'The atmosphere we breathe is a chemical achievement 4 billion years in the making. This chapter shows how fragile that achievement is.',
      bullets: [
        "Describe how Earth's atmosphere evolved from volcanic gases",
        'Explain the greenhouse effect and how human activity intensifies it',
        'See how life cycle assessment measures environmental impact',
        "Evaluate approaches to using Earth's resources more sustainably",
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Earth\'s early atmosphere contained almost no free oxygen.', isTrue: true },
        { type: 'choice', question: 'The greenhouse effect causes warming because...', options: ['It destroys the ozone layer allowing UV in', 'Greenhouse gases trap heat that would otherwise escape into space', 'The sun\'s radiation has been steadily increasing'], correct: 1 },
        { type: 'connection', question: 'Life cycle assessment matters because...', options: [
          { text: 'Companies are legally required to display it on products', icon: 'warning' },
          { text: 'It measures environmental impact across a product\'s entire life', icon: 'leaf' },
          { text: 'It calculates the exact financial cost of manufacturing', icon: 'gear' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Group 4',
        heading: 'Earth Chemistry',
        content: [
          { type: 'keypoint', text: 'The chemistry of our planet keeps life possible — but human activity is changing it. This group covers how the atmosphere evolved, why climate is changing, and how we can use resources more sustainably.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Earth\'s Atmosphere</strong> — evolution of the atmosphere, gases and their proportions.<br><strong>Climate Change</strong> — greenhouse gases, global warming and impacts.<br><strong>Using Resources</strong> — life cycle assessment, sustainable development and potable water.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },
]
