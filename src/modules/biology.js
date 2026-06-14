// ─── Biology module content — full lesson data for Biology modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a Biology module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.

export const BIOLOGY_MODULES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // BIOLOGY — Chapter 1: Building blocks
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'bio_building_blocks',
    subject: 'Biology',
    number: 1,
    title: 'Building blocks',
    subtitle: 'What every living thing is built from',
    icon: '🧬',
    color: '#4FA36C',
    colorLight: 'rgba(79,163,108,.15)',

    outcomes: {
      intro: 'All living things are made of cells. This chapter reveals the hidden world inside them.',
      bullets: [
        { text: 'Describe the structures inside animal and plant cells', icon: 'drop' },
        { text: 'Explain what each organelle actually does in precise GCSE language', icon: 'star' },
        { text: 'Spot the most common exam trap about plant cells before it costs you marks', icon: 'question' },
        { text: 'Compare animal and plant cells with the precision a top answer needs', icon: 'prayer' },
      ],
    },

    screens: [
      // ═══ PART 1 — THE MYSTERY ═══════════════════════════════════════════════

      // ── SCREEN 1: Cinematic reveal ──────────────────────────────────────────
      {
        type: 'cinematic',
        stage: 'The mystery',
        label: 'BIOLOGY · CHAPTER 1',
        videoSrc: '/videos/building-blocks-intro.mp4',
        fallbackImage: '/figures/biology/building-blocks/plant-cell-bg.png',
        paragraphs: [
          { text: 'A leaf.' },
          { text: 'Blood.' },
          { text: 'Human skin.' },
          { text: 'Tree bark.' },
          { text: 'Completely different.' },
          { text: 'Yet every one of them is built from the same thing.', highlights: ['the same thing'] },
          { text: 'What is it?' },
        ],
      },

      // ── SCREEN 2: Prediction carousel ───────────────────────────────────────
      {
        type: 'guidedChoiceCarousel',
        stage: 'Your prediction',
        label: 'Before we look closer',
        headline: 'A leaf. Blood. Skin. Bark.\nAll built from the same thing.',
        question: 'What do all living things have in common?',
        helperText: 'Swipe through the options and choose what you think it is.',
        options: [
          {
            title: 'Blood',
            subtitle: 'Carries everything a body needs',
            buttonText: 'Choose Blood',
            revealLines: [
              'Blood looks like one thing — but it isn\'t.',
              'Zoom in far enough, and it turns out to be made of something much smaller.',
              'Let\'s investigate.',
            ],
          },
          {
            title: 'Cells',
            subtitle: 'The basic unit of every living thing',
            buttonText: 'Choose Cells',
            revealLines: [
              'You\'re onto it.',
              'A leaf, a drop of blood, a patch of skin, a strip of bark — all built from the same tiny units.',
              'Let\'s investigate.',
            ],
          },
          {
            title: 'Organs',
            subtitle: 'Hearts, lungs, leaves, roots',
            buttonText: 'Choose Organs',
            revealLines: [
              'Organs are themselves built from something smaller.',
              'Before there can be an organ, there has to be a basic building block.',
              'Let\'s investigate.',
            ],
          },
          {
            title: 'Chlorophyll',
            subtitle: 'The green pigment in plants',
            buttonText: 'Choose Chlorophyll',
            revealLines: [
              'Chlorophyll only exists inside plants — but blood and skin are alive too.',
              'Whatever the answer is, it has to work for every living thing, not just plants.',
              'Let\'s investigate.',
            ],
          },
        ],
      },

      // ── SCREEN 3: Mission ───────────────────────────────────────────────────
      {
        label: 'Mission',
        kicker: 'Chapter 1',
        heading: 'BUILDING LIFE',
        sub: 'The hidden structures inside every living thing.',
        blocks: [
          {
            type: 'read',
            text: '• Describe what every plant and animal cell has in common — and name the structures that set them apart.<br><br>• Explain what each part of a cell actually does, in the precise language an examiner is looking for.<br><br>• Spot one of the most common GCSE traps about plant cells, before it costs you a mark.<br><br>• Compare animal and plant cells with the precision a top answer needs.',
          },
        ],
      },

      // ═══ PART 2 — INVESTIGATE THE EVIDENCE ══════════════════════════════════

      // ── SCREEN 4: Plant cell hotspot explorer ───────────────────────────────
      {
        type: 'interactiveImage',
        label: '🔬 Plant Cell Explorer',
        title: 'Inside a\nPlant Cell',
        introText: 'Plant cells contain specialised structures called organelles. Each one has a specific job that keeps the cell alive.',
        image: '/figures/plant-cell.webp',
        imageAlt: 'Illustration of a plant cell showing major organelles',
        ctaLabel: 'Explore cell',
        hotspots: [
          {
            id: 'cell_wall', x: 50, y: 6,
            shortLabel: 'Cell Wall', title: 'Cell Wall', icon: '🧱',
            description: 'Made of cellulose, the cell wall gives the plant cell a rigid, fixed shape. Animal cells do not have one. It provides structural support and prevents the cell from bursting.',
            extraFact: 'Without a cell wall, plant stems would collapse. This is why plants wilt when they lose water — the vacuole shrinks and the wall loses its rigid support.',
          },
          {
            id: 'cell_membrane', x: 50, y: 14,
            shortLabel: 'Cell Membrane', title: 'Cell Membrane', icon: '🚪',
            description: 'A thin, flexible layer that controls what enters and leaves the cell. Found in all cells — plant and animal. It is selectively permeable, meaning it lets some substances through but not others.',
            extraFact: 'Glucose produced in the chloroplasts must pass through the cell membrane to reach other cells in the plant.',
          },
          {
            id: 'cytoplasm', x: 44, y: 44,
            shortLabel: 'Cytoplasm', title: 'Cytoplasm', icon: '🌊',
            description: 'A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell\'s chemical reactions take place here.',
            extraFact: 'Anaerobic respiration — the backup energy process that does not need oxygen — takes place entirely in the cytoplasm.',
          },
          {
            id: 'nucleus', x: 68, y: 28,
            shortLabel: 'Nucleus', title: 'Nucleus', icon: '🧬',
            description: 'The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing.',
            extraFact: 'The nucleus directs the production of enzymes needed for photosynthesis. Without it, the chloroplasts could not function properly.',
          },
          {
            id: 'chloroplast', x: 20, y: 68,
            shortLabel: 'Chloroplast', title: 'Chloroplast', icon: '☀️',
            description: 'Contains chlorophyll, a green pigment that absorbs light energy. Plant cells use this energy to carry out photosynthesis and produce glucose. Only found in cells exposed to light.',
            extraFact: 'Photosynthesis allows plants to make their own food using sunlight, water and CO₂ — releasing oxygen as a by-product.',
          },
          {
            id: 'vacuole', x: 30, y: 52,
            shortLabel: 'Permanent Vacuole', title: 'Large Permanent Vacuole', icon: '💧',
            description: 'A large, water-filled sac that keeps the cell firm (turgid). If the vacuole shrinks due to lack of water, the cell becomes flaccid and the plant wilts.',
            extraFact: 'The pressure of the full vacuole pushing against the cell wall creates turgor pressure, which gives plants their upright structure.',
          },
          {
            id: 'mitochondria', x: 22, y: 20,
            shortLabel: 'Mitochondria', title: 'Mitochondria', icon: '⚡',
            description: 'The site of aerobic respiration. Mitochondria release energy from glucose so the cell can do work — growing, moving, dividing, making proteins.',
            extraFact: 'Even though plant cells make glucose in chloroplasts, they still need mitochondria to convert that glucose into usable energy (ATP).',
          },
          {
            id: 'ribosomes', x: 55, y: 46,
            shortLabel: 'Ribosomes', title: 'Ribosomes', icon: '🔬',
            description: 'The site of protein synthesis. Ribosomes read instructions from DNA and assemble amino acids into proteins. Only visible under an electron microscope.',
            extraFact: 'All enzymes are proteins built by ribosomes. Every chemical reaction in the cell ultimately depends on them.',
          },
        ],
      },

      // ═══ PART 3 — DISCOVER THE SCIENCE ══════════════════════════════════════

      // ── SCREEN 5: Animal cell hotspot explorer ──────────────────────────────
      {
        type: 'interactiveImage',
        label: '🔬 Animal Cell Explorer',
        title: 'Inside an\nAnimal Cell',
        introText: 'Animal cells share most of their structures with plant cells. Explore this one closely — and notice what\'s familiar, and what\'s missing.',
        image: '/figures/biology/building-blocks/animal-cell-clean.png',
        imageAlt: 'Illustration of an animal cell showing its main organelles',
        ctaLabel: 'Explore cell',
        hotspots: [
          {
            id: 'nucleus', x: 44, y: 33,
            shortLabel: 'Nucleus', title: 'Nucleus', icon: '🧬',
            description: 'The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing. Exactly the same role as in a plant cell.',
            extraFact: 'The nucleus is one of five structures every animal and plant cell shares — a fact GCSE examiners expect you to know cold.',
          },
          {
            id: 'cytoplasm', x: 68, y: 29,
            shortLabel: 'Cytoplasm', title: 'Cytoplasm', icon: '🌊',
            description: 'A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell\'s chemical reactions happen here — in animal cells just as much as in plant cells.',
            extraFact: 'During hard exercise, your muscle cells run short of oxygen and start anaerobic respiration — right here, in the cytoplasm.',
          },
          {
            id: 'cell_membrane', x: 27, y: 72,
            shortLabel: 'Cell Membrane', title: 'Cell Membrane', icon: '🚪',
            description: 'A thin, flexible layer that controls what enters and leaves the cell. Selectively permeable — it lets some substances through and keeps others out. Identical job to the membrane in a plant cell.',
            extraFact: 'Notice there\'s no thick wall surrounding this membrane. That missing structure is one of the clearest differences between an animal cell and a plant cell.',
          },
          {
            id: 'mitochondria', x: 74, y: 66,
            shortLabel: 'Mitochondria', title: 'Mitochondria', icon: '⚡',
            description: 'The site of aerobic respiration. Mitochondria release energy from glucose so the cell can do work — contracting muscle, sending nerve signals, repairing damaged tissue.',
            extraFact: 'Cells that work hardest — muscle cells, liver cells, sperm cells — pack in unusually large numbers of mitochondria, because they need the most energy.',
          },
          {
            id: 'ribosomes', x: 52, y: 64,
            shortLabel: 'Ribosomes', title: 'Ribosomes', icon: '🔬',
            description: 'The site of protein synthesis. Ribosomes read instructions copied from DNA and assemble amino acids into proteins — far too small to see without an electron microscope.',
            extraFact: 'Every enzyme in your body is a protein built by a ribosome. Without them, not one chemical reaction inside a cell could happen.',
          },
        ],
      },

      // ── SCREEN 6: Animal vs plant comparison ────────────────────────────────
      {
        label: 'Comparing the two',
        kicker: 'Discover',
        heading: 'Animal cell vs plant cell',
        sub: 'Same blueprint underneath. Different extras on top.',
        blocks: [
          {
            type: 'theoryCompare',
            title: 'What\'s shared — and what isn\'t',
            oldLabel: 'ANIMAL CELL',
            oldTitle: 'Animal cell',
            oldPoints: [
              'Nucleus — controls the activities of the cell',
              'Cytoplasm — site of most chemical reactions',
              'Cell membrane — controls movement of substances in and out',
              'Mitochondria — site of aerobic respiration',
              'Ribosomes — site of protein synthesis',
              'No structures beyond these are required for this GCSE comparison',
            ],
            newLabel: 'PLANT CELL',
            newTitle: 'Plant cell',
            newPoints: [
              'Has every structure an animal cell has — nucleus, cytoplasm, membrane, mitochondria, ribosomes',
              'PLUS a cell wall — made of cellulose, gives the cell a rigid, fixed shape',
              'PLUS chloroplasts — absorb light energy to carry out photosynthesis',
              'PLUS a permanent vacuole — stores cell sap and keeps the cell firm',
            ],
            takeaway: 'Every plant cell is built on the same five-structure blueprint as an animal cell — with three extra tools bolted on for jobs only plants do: staying rigid, capturing light, and storing water.',
          },
        ],
      },

      // ═══ PART 4 — CHECK PRECISION ════════════════════════════════════════════

      // ── SCREEN 7: Misconception check ───────────────────────────────────────
      {
        label: 'Check precision',
        kicker: 'Common traps',
        heading: 'Three statements. Look closely.',
        sub: 'Each one sounds true. Decide before you read on.',
        blocks: [
          {
            type: 'misconceptionCheck',
            statements: [
              {
                statement: 'All plant cells contain chloroplasts.',
                answer: false,
                reveal: 'Only cells exposed to light — like the cells in a leaf — contain chloroplasts. A root hair cell lives underground in total darkness. It has no use for chloroplasts, so it simply doesn\'t have any.',
                examTrap: 'Examiners love this one. If a question describes a root hair cell, a cell from a potato tuber, or anything underground, never write "it has chloroplasts because it\'s a plant cell." A cell only contains the organelles its job requires.',
              },
              {
                statement: 'Both animal cells and plant cells contain mitochondria.',
                answer: true,
                reveal: 'True. Every cell that needs energy needs mitochondria — and that means almost every cell in both animals and plants. Mitochondria release energy from glucose through aerobic respiration, whichever kingdom the cell belongs to.',
                examTrap: 'Don\'t fall into thinking "mitochondria are for animals, chloroplasts are for plants." A plant cell makes glucose in its chloroplasts — but it still needs mitochondria to release the energy stored inside that glucose.',
              },
              {
                statement: 'All cells are roughly the same size.',
                answer: false,
                reveal: 'Cells vary enormously. A human egg cell is around 0.1 mm — just visible to the naked eye — while a single nerve cell can stretch over a metre, from your spine to your toes. Size depends entirely on the job a cell does.',
                examTrap: 'If a question gives you a measurement in micrometres (µm), don\'t assume it must describe a "typical" cell. Specialised cells are often unusually large or small for a reason — and the examiner wants you to explain why.',
              },
            ],
          },
        ],
      },

      // ═══ PART 5 — APPLY TO A REAL GCSE-STYLE TASK ═══════════════════════════

      // ── SCREEN 8: Matching task ─────────────────────────────────────────────
      {
        type: 'matchingTask',
        stage: 'Apply it',
        label: 'Structure → function',
        subject: 'Biology',
        title: 'Match each structure to its job',
        instruction: 'Match each cell structure to the function an examiner would expect you to name.',
        pairs: [
          { id: 'nucleus',      term: 'Nucleus',             answer: 'Controls the activities of the cell — contains genetic material', weakGroup: 'Cell structures' },
          { id: 'membrane',     term: 'Cell membrane',       answer: 'Controls the movement of substances into and out of the cell',     weakGroup: 'Cell structures' },
          { id: 'cytoplasm',    term: 'Cytoplasm',           answer: 'Site of most of the cell\'s chemical reactions',                    weakGroup: 'Cell structures' },
          { id: 'mitochondria', term: 'Mitochondria',        answer: 'Site of aerobic respiration — releases energy from glucose',       weakGroup: 'Cell structures' },
          { id: 'ribosome',     term: 'Ribosome',            answer: 'Site of protein synthesis',                                        weakGroup: 'Cell structures' },
          { id: 'cell_wall',    term: 'Cell wall',           answer: 'Made of cellulose — supports the cell and keeps its shape rigid',  weakGroup: 'Cell structures' },
          { id: 'chloroplast',  term: 'Chloroplast',         answer: 'Absorbs light energy to carry out photosynthesis',                 weakGroup: 'Cell structures' },
          { id: 'vacuole',      term: 'Permanent vacuole',   answer: 'Contains cell sap — keeps the cell firm and full of water',        weakGroup: 'Cell structures' },
        ],
      },

      // ── SCREEN 9: Fill in the blanks ────────────────────────────────────────
      {
        label: 'Apply it',
        kicker: 'Precise vocabulary',
        heading: 'Fill in the gaps',
        sub: 'Use the exact GCSE term — examiners mark on precision, not approximation.',
        blocks: [
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The', after: 'controls what enters and leaves the cell.',
                answer: 'cell membrane', acceptedAnswers: ['cell membrane', 'membrane'],
                feedback: 'Correct — the cell membrane is selectively permeable, controlling exactly what passes through.',
                hints: ['It surrounds every cell, plant or animal...', 'Two words — the second one is "membrane"...'],
              },
              {
                before: 'The', after: 'is the site of aerobic respiration, releasing energy from glucose.',
                answer: 'mitochondria', acceptedAnswers: ['mitochondria', 'mitochondrion'],
                feedback: 'Correct — and notice the word "release". Mitochondria release energy that\'s already stored in glucose; they don\'t make it from nothing.',
                hints: ['Found in both plant and animal cells...', 'Sometimes nicknamed the cell\'s "powerhouse"...'],
              },
              {
                before: 'A plant cell\'s', after: 'is made of cellulose and gives the cell a rigid, fixed shape.',
                answer: 'cell wall', acceptedAnswers: ['cell wall'],
                feedback: 'Correct — and remember, animal cells do not have one.',
                hints: ['Animal cells don\'t have this structure...', 'Two words — the second is "wall"...'],
              },
              {
                before: 'Chloroplasts contain', after: ', a green pigment that absorbs light energy for photosynthesis.',
                answer: 'chlorophyll', acceptedAnswers: ['chlorophyll'],
                feedback: 'Correct — chlorophyll is the pigment; the chloroplast is the structure that contains it. Examiners notice when students mix the two up.',
                hints: ['Gives leaves their green colour...', 'Starts with "chloro-", just like "chloroplast"...'],
              },
              {
                before: 'A plant cell\'s permanent vacuole is filled with', after: ', which keeps the cell firm and stops the plant from wilting.',
                answer: 'cell sap', acceptedAnswers: ['cell sap', 'sap'],
                feedback: 'Correct — a full vacuole pushes outward against the cell wall, creating turgor pressure that keeps the whole plant upright.',
                hints: ['A watery solution stored inside the vacuole...', 'Two words — the first is "cell"...'],
              },
            ],
          },
        ],
      },

      // ── SCREEN 10: Spot the error ───────────────────────────────────────────
      {
        label: 'Apply it',
        kicker: 'Detective work',
        heading: '',
        sub: '',
        blocks: [
          {
            type: 'spotTheError',
            prompt: 'A student wrote this in an exam answer. Something in it is wrong.',
            statement: 'All plant cells contain chloroplasts so they can photosynthesise all the time.',
            errorTarget: 'All plant cells contain chloroplasts',
            whatWasWrong: 'The student claimed that every plant cell contains chloroplasts. That\'s only true for cells exposed to light, such as those in a leaf. Root hair cells, for example, live underground in total darkness — they have no chloroplasts, because they have no use for them.',
            examinerNote: 'This is one of the most common traps in GCSE Biology. Examiners deliberately use unfamiliar examples — root hair cells, potato tuber cells, cells from a stem — to check whether a student has actually understood the idea, or just memorised "plant cells have chloroplasts."',
            correctVersion: 'Plant cells that are exposed to light, such as those in a leaf, contain chloroplasts so they can photosynthesise.',
            commonTrap: 'Whenever a question describes a plant cell that doesn\'t see light — underground, inside a stem, inside a seed — resist the urge to write "it has chloroplasts because it\'s a plant cell." A cell only contains the organelles its specific job requires.',
            keyTerms: ['chloroplast', 'photosynthesis', 'light'],
          },
        ],
      },

      // ═══ PART 6 — FACE THE EXAMINER + DEBRIEF ═══════════════════════════════

      // ── SCREEN 11: Guided exam response ─────────────────────────────────────
      {
        type: 'guidedExamResponse',
        stage: 'Exam practice',
        label: 'Write for the examiner',
        exam: {
          board: 'aqa',
          subject: 'biology',
          topic: 'cell-structure',
          question: 'Explain two differences between plant cells and animal cells. (4 marks)',
          marks: 4,
          sections: [
            { label: 'Difference 1', starter: 'Plant cells have a...', placeholder: 'e.g. ...cell wall, which animal cells do not have. This is used to...' },
            { label: 'Difference 2', starter: 'Plant cells also have...', placeholder: 'e.g. ...chloroplasts, which animal cells do not have. These are used to...' },
          ],
          markScheme: `Total: 4 marks — up to 2 marks for each difference (1 mark for naming the structure correctly, 1 mark for explaining what it does).
Difference A — Cell wall: plant cells have a cell wall, made of cellulose, that animal cells lack; it supports the cell and keeps its shape rigid.
Difference B — Chloroplasts: plant cells contain chloroplasts that animal cells lack; chloroplasts absorb light energy so the cell can carry out photosynthesis.
A third valid difference — the permanent vacuole, which stores cell sap and keeps the cell turgid — can also be credited.
No mark is given for naming a structure without explaining its function: "plant cells have a cell wall" alone earns 1 mark; adding "...which gives the cell a rigid, fixed shape" earns the second.`,
        },
      },

      // ── SCREEN 12: Face the examiner ─────────────────────────────────────────
      {
        type: 'faceExaminer',
        stage: 'Exam practice',
        label: 'Face the examiner',
        examiner: {
          type: '4-mark-explain',
          board: 'aqa',
          subject: 'biology',
          topic: 'cell-structure',
          difficulty: 'standard',
          question: 'Explain two differences between plant cells and animal cells. (4 marks)',
          marks: 4,
          mark: 2,
          summary: 'Both structures are correctly named — but neither difference is actually explained. That caps this answer at 2 marks out of 4.',
          markScheme: `Level 2 (3-4 marks): Two structures named AND their functions explained.
Level 1 (1-2 marks): Structures named but not explained, or only one full difference given.
0 marks: No relevant structures identified.`,
          sampleAnswer: 'Plant cells have chloroplasts. Plant cells have cell walls.',
          annotations: [
            {
              id: 'ann1',
              target: 'Plant cells have chloroplasts.',
              occurrence: 1,
              type: 'weak',
              comment: 'A correct structure, named clearly — that\'s 1 mark. But the examiner needs to know what a chloroplast actually does. Naming it isn\'t the same as explaining it.',
            },
            {
              id: 'ann2',
              target: 'Plant cells have cell walls.',
              occurrence: 1,
              type: 'weak',
              comment: 'The same problem, twice. A second structure named, a second mark earned — but still no explanation. This sentence repeats the exact mistake of the first.',
            },
          ],
          improvementPrompts: {
            ann1: {
              prompt: '+ Add what a chloroplast actually does',
              placeholder: 'e.g. ...which absorb light energy so the cell can carry out photosynthesis.',
            },
            ann2: {
              prompt: '+ Add what a cell wall actually does',
              placeholder: 'e.g. ...which is made of cellulose and gives the cell a rigid, fixed shape.',
            },
          },
          criteriaOptions: [
            'Names two structures',
            'Explains the chloroplast\'s function',
            'Explains the cell wall\'s function',
            'Uses precise GCSE vocabulary',
            'States the structure is absent in animal cells',
            'Repeats the same mistake twice',
            'Names without explaining',
            'Too vague to award the second mark',
          ],
        },
      },

      // ── SCREEN 13: Quick recall ──────────────────────────────────────────────
      {
        type: 'quickRecall',
        stage: 'Lock it in',
        label: 'What stuck?',
        questions: [
          {
            type: 'choice',
            question: 'Which structure controls what enters and leaves a cell?',
            options: ['Nucleus', 'Cell membrane', 'Cytoplasm', 'Ribosome'],
            correct: 1,
            explanation: 'The cell membrane is selectively permeable — it controls exactly which substances pass in and out.',
          },
          {
            type: 'truefalse',
            question: 'A root hair cell contains chloroplasts.',
            isTrue: false,
            explanation: 'Root hair cells live underground in darkness. Chloroplasts would be useless to them — only cells exposed to light contain chloroplasts.',
          },
          {
            type: 'choice',
            question: 'What is the function of mitochondria?',
            options: ['They make energy from sunlight', 'They release energy from glucose through respiration', 'They control the cell\'s activities', 'They store water to keep the cell firm'],
            correct: 1,
            explanation: '"Release energy", not "make energy" — mitochondria release energy that is already stored inside glucose.',
          },
          {
            type: 'connection',
            question: 'A plant cell has three structures an animal cell doesn\'t. Which set is correct?',
            options: [
              { text: 'Nucleus, cytoplasm and ribosomes', icon: 'leaf' },
              { text: 'Cell wall, chloroplasts and a permanent vacuole', icon: 'gear' },
              { text: 'Mitochondria, membrane and cell wall', icon: 'atom' },
            ],
            correct: 1,
            hint: 'Think about the three "extras" bolted onto the shared five-structure blueprint...',
          },
          {
            type: 'choice',
            question: 'A muscle cell needs to release energy quickly and constantly. Which structure would you expect to find in unusually large numbers?',
            options: ['Ribosomes', 'Chloroplasts', 'Mitochondria', 'Vacuoles'],
            correct: 2,
            explanation: 'Cells with high energy demands — like muscle, liver and sperm cells — pack in extra mitochondria to keep up with the demand for respiration.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SCIENCE — Biology Week 1: Plant Cells & Photosynthesis
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sci_bio_w1',
    subject: 'Biology',
    number: 2,
    title: 'Plant Cells & Photosynthesis',
    subtitle: 'Tiny factories, big chemistry',
    icon: '🌿',
    color: '#38D27A',
    colorLight: 'rgba(56,210,122,.15)',

    // ── Universal Hook ──────────────────────────────────────────────────────
    hook: {
      statement: 'The plant ate the soil.',
      isTrue: false,
      accentWords: ['ate the soil'],
      explanation: "Van Helmont's willow tree gained 74kg over 5 years. The soil lost just 57g. The mass had to come from somewhere else entirely — this chapter explains what.",
      storyLines: [
        'Belgium, 1648. A scientist plants a tiny willow tree.',
        'He weighs everything — the tree, the soil, the pot.',
        'Five years later, the tree has gained 74 kg.',
        'The soil? Lost less than 60 grams.',
      ],
      wrongFeedback: "That's actually what most people think. But the numbers don't add up...",
      correctFeedback: "Right. So where on earth did 74 kg of tree come from?",
      bigQuestion: 'So where did 74 kg of tree come from?',
      revealItems: [
        {
          emoji: '💨',
          label: 'Carbon dioxide',
          detail: 'Absorbed from the air through tiny pores in leaves. This is the main building block.',
          color: '#38D27A',
          bg: 'rgba(56,210,122,.08)',
        },
        {
          emoji: '💧',
          label: 'Water',
          detail: 'Pulled up from the soil through the roots. Used in the chemical reaction.',
          color: '#34D5FF',
          bg: 'rgba(52,213,255,.08)',
        },
        {
          emoji: '☀️',
          label: 'Light energy',
          detail: "Absorbed by chlorophyll in the leaves. Powers the whole reaction. Without it — nothing.",
          color: '#FFC857',
          bg: 'rgba(255,200,87,.08)',
        },
      ],
      punchline: "Plants build themselves from thin air. Literally. This week you find out exactly how.",
    },

    // ── Universal Intro ─────────────────────────────────────────────────────
    intro: {
      retrieval: {
        question: 'Before we start — what do you think photosynthesis actually produces?',
        options: [
          'Oxygen and water',
          'Glucose and oxygen',
          'Carbon dioxide and glucose',
          'Energy and starch',
        ],
        correctIndex: 1,
        explanation: 'Photosynthesis produces glucose (stored chemical energy) and oxygen (released as a by-product). The glucose is what the plant uses to grow, respire and build everything else.',
      },
      learningGoals: [
        'Name every organelle in a plant cell and explain its job',
        'Write the photosynthesis equation correctly using exam language',
        'Describe five different things plants do with glucose (SCARF)',
        'Spot and correct the wording mistakes that lose marks in the exam',
        'Explain why plants build mass from air, not soil',
      ],
    },

    outcomes: {
      intro: "You're about to understand exactly how plants turn light into food — and why this matters for all life on Earth.",
      bullets: [
        'Describe the key parts of a plant cell and what each one does',
        'Explain the photosynthesis equation and what it actually means',
        'See why chlorophyll is the molecule that makes life possible',
        'Connect photosynthesis to respiration and energy flow in ecosystems',
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Animal cells have a cell wall as well as a cell membrane.', isTrue: false },
        { type: 'choice', question: 'In photosynthesis, plants absorb...', options: ['Oxygen and glucose from the air', 'Carbon dioxide and water using light energy', 'Nitrogen and minerals from the soil'], correct: 1 },
        { type: 'connection', question: 'Chloroplasts are found in plant cells because...', options: [
          { text: 'They make the plant appear green for camouflage', icon: 'leaf' },
          { text: 'They capture light energy to make glucose', icon: 'atom' },
          { text: 'They control what enters and exits the cell', icon: 'gear' },
        ], correct: 1 },
      ],
    },
    screens: [
      // ── SCREEN 0: Plant Cell Interactive Image ─────────────────────────────
      {
        type: 'interactiveImage',
        label: '🔬 Plant Cell Explorer',
        title: 'Inside a\nPlant Cell',
        introText: 'Plant cells contain specialised structures called organelles. Each one has a specific job that keeps the cell alive.',
        image: '/figures/plant-cell.webp',
        imageAlt: 'Illustration of a plant cell showing major organelles',
        ctaLabel: 'Explore cell',
        hotspots: [
          {
            id: 'cell_wall', x: 50, y: 6,
            shortLabel: 'Cell Wall', title: 'Cell Wall', icon: '🧱',
            description: 'Made of cellulose, the cell wall gives the plant cell a rigid, fixed shape. Animal cells do not have one. It provides structural support and prevents the cell from bursting.',
            extraFact: 'Without a cell wall, plant stems would collapse. This is why plants wilt when they lose water — the vacuole shrinks and the wall loses its rigid support.',
          },
          {
            id: 'cell_membrane', x: 50, y: 14,
            shortLabel: 'Cell Membrane', title: 'Cell Membrane', icon: '🚪',
            description: 'A thin, flexible layer that controls what enters and leaves the cell. Found in all cells — plant and animal. It is selectively permeable, meaning it lets some substances through but not others.',
            extraFact: 'Glucose produced in the chloroplasts must pass through the cell membrane to reach other cells in the plant.',
          },
          {
            id: 'cytoplasm', x: 44, y: 44,
            shortLabel: 'Cytoplasm', title: 'Cytoplasm', icon: '🌊',
            description: 'A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell\'s chemical reactions take place here.',
            extraFact: 'Anaerobic respiration — the backup energy process that does not need oxygen — takes place entirely in the cytoplasm.',
          },
          {
            id: 'nucleus', x: 68, y: 28,
            shortLabel: 'Nucleus', title: 'Nucleus', icon: '🧬',
            description: 'The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing.',
            extraFact: 'The nucleus directs the production of enzymes needed for photosynthesis. Without it, the chloroplasts could not function properly.',
          },
          {
            id: 'chloroplast', x: 20, y: 68,
            shortLabel: 'Chloroplast', title: 'Chloroplast', icon: '☀️',
            description: 'Contains chlorophyll, a green pigment that absorbs light energy. Plant cells use this energy to carry out photosynthesis and produce glucose. Only found in cells exposed to light.',
            extraFact: 'Photosynthesis allows plants to make their own food using sunlight, water and CO₂ — releasing oxygen as a by-product.',
          },
          {
            id: 'vacuole', x: 30, y: 52,
            shortLabel: 'Permanent Vacuole', title: 'Large Permanent Vacuole', icon: '💧',
            description: 'A large, water-filled sac that keeps the cell firm (turgid). If the vacuole shrinks due to lack of water, the cell becomes flaccid and the plant wilts.',
            extraFact: 'The pressure of the full vacuole pushing against the cell wall creates turgor pressure, which gives plants their upright structure.',
          },
          {
            id: 'mitochondria', x: 22, y: 20,
            shortLabel: 'Mitochondria', title: 'Mitochondria', icon: '⚡',
            description: 'The site of aerobic respiration. Mitochondria release energy from glucose so the cell can do work — growing, moving, dividing, making proteins.',
            extraFact: 'Even though plant cells make glucose in chloroplasts, they still need mitochondria to convert that glucose into usable energy (ATP).',
          },
          {
            id: 'ribosomes', x: 55, y: 46,
            shortLabel: 'Ribosomes', title: 'Ribosomes', icon: '🔬',
            description: 'The site of protein synthesis. Ribosomes read instructions from DNA and assemble amino acids into proteins. Only visible under an electron microscope.',
            extraFact: 'All enzymes are proteins built by ribosomes. Every chemical reaction in the cell ultimately depends on them.',
          },
        ],
      },

      // ── SCREEN 2: Quick Recall ──────────────────────────────────────────────
      {
        label: 'Quick Check',
        kicker: 'Retrieval',
        heading: 'What Did You Just Learn?',
        sub: 'No notes. No hints. Just you and what stuck.',
        blocks: [
          {
            type: 'quiz',
            question: 'Which organelle absorbs light energy for photosynthesis?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Chloroplast', correct: true },
              { text: 'Vacuole', correct: false },
            ],
            explanation: 'Chloroplasts contain chlorophyll, which absorbs light energy. They\'re only in plant cells — and only in cells that are green (like leaf cells, not root cells).',
          },
          {
            type: 'quiz',
            question: 'Which organelle releases energy from glucose?',
            options: [
              { text: 'Chloroplast', correct: false },
              { text: 'Mitochondria', correct: true },
              { text: 'Ribosomes', correct: false },
              { text: 'Cell wall', correct: false },
            ],
            explanation: 'Mitochondria are the site of aerobic respiration. They release energy from glucose so the cell can do work — moving, growing, making proteins.',
          },
          {
            type: 'quiz',
            question: 'What gives a plant cell its rigid, fixed shape?',
            options: [
              { text: 'Cell membrane', correct: false },
              { text: 'Vacuole', correct: false },
              { text: 'Cytoplasm', correct: false },
              { text: 'Cell wall', correct: true },
            ],
            explanation: 'The cell wall is made of cellulose and gives the plant cell a strong, fixed shape. The cell membrane is present too but is flexible, not rigid.',
          },
          {
            type: 'quiz',
            question: 'A plant cell is wilting. Which organelle has likely shrunk?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Large vacuole', correct: true },
              { text: 'Ribosomes', correct: false },
            ],
            explanation: 'The large vacuole is filled with cell sap and keeps the cell turgid (firm). When a plant loses water, the vacuole shrinks, the cell loses pressure and the plant wilts.',
          },
        ]
      },

      // ── SCREEN 3: Misconceptions ────────────────────────────────────────────
      {
        label: 'Mistake Lab',
        kicker: 'Common Mistakes',
        heading: 'Sounds Right. Loses Marks.',
        sub: 'These are the phrases examiners see every year — and penalise every year.',
        blocks: [
          {
            type: 'misconception',
            label: 'Tap to see why each one fails',
            mistakes: [
              {
                wrong: 'Plants get food from the soil.',
                right: 'Plants make glucose by photosynthesis.',
                reason: 'Soil provides minerals (like nitrates), not food. Plants manufacture their own glucose using light energy — they are autotrophs.',
              },
              {
                wrong: 'Chloroplasts make sunlight.',
                right: 'Chloroplasts absorb light energy.',
                reason: '"Make" sunlight is physically impossible. The correct word is "absorb" — chlorophyll inside the chloroplast captures light energy from the sun.',
              },
              {
                wrong: 'Plants create energy during photosynthesis.',
                right: 'Plants transfer light energy into chemical energy (glucose).',
                reason: 'Energy cannot be created or destroyed — it is transferred. Examiners specifically penalise "create" and "make" energy. Always say "transfer" or "store".',
              },
              {
                wrong: 'Only leaves have chloroplasts.',
                right: 'Only green parts of the plant contain chloroplasts.',
                reason: 'Any green part of a plant (stems, unripe fruit, green petals) has chloroplasts. Non-green parts (roots, white flowers) do not — they can\'t photosynthesise.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 4: Photosynthesis Equation Builder ───────────────────────────
      {
        label: 'The Equation',
        kicker: 'Photosynthesis',
        heading: 'Build The Recipe',
        sub: 'Photosynthesis is just cooking — light is the heat, glucose is the meal.',
        blocks: [
          {
            type: 'read',
            label: '📖 The Big Idea',
            text: 'Photosynthesis converts <strong>light energy</strong> into <strong>chemical energy</strong> stored in glucose. The plant takes two raw materials (carbon dioxide and water) and uses light to combine them into glucose and oxygen.',
          },
          {
            type: 'builder',
            label: 'Build the photosynthesis equation',
            slots: [null, null, null, null],
            operators: ['+', '→', '+'],
            pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
            answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
            hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
            successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
          },
          {
            type: 'keypoint',
            text: 'The word equation: <strong>carbon dioxide + water → glucose + oxygen</strong>. Light energy is needed. Chlorophyll absorbs it. This happens in the chloroplasts.',
          },
          {
            type: 'examtip',
            label: '🗡️ Exam Trap',
            tip: 'Students often say water is produced in photosynthesis. It is NOT. Water is a <strong>reactant</strong> (goes in). Oxygen is the gas that comes out.',
            phrases: ['carbon dioxide + water → glucose + oxygen', 'light energy required', 'in the chloroplasts'],
          },
        ]
      },

      // ── SCREEN 5: Glucose Uses (SCARF) ─────────────────────────────────────
      {
        label: 'Glucose Uses',
        kicker: 'What Plants Do With Glucose',
        heading: 'SCARF: Five Things Plants Do With Glucose',
        sub: 'Students think glucose just gives energy. It does five different things.',
        blocks: [
          {
            type: 'funfact',
            label: '🤯 Actually Interesting',
            text: 'Wood is made from glucose. The tree trunk, every branch, every leaf — almost all of it built from sugar that the tree made from thin air using sunlight. You\'re basically looking at crystallised light.',
          },
          {
            type: 'scarf',
            label: 'SCARF — tap each letter to reveal',
            items: [
              { letter: 'S', word: 'Starch', detail: 'Glucose is converted to starch for storage. Starch is insoluble so it doesn\'t affect osmosis. Stored in chloroplasts and other parts of the plant.' },
              { letter: 'C', word: 'Cellulose', detail: 'Used to make cellulose for cell walls. This gives the plant structural support. Wood is mostly cellulose.' },
              { letter: 'A', word: 'Amino acids', detail: 'Combined with nitrates from the soil to make amino acids, which are then used to build proteins. No nitrates = no proteins = stunted growth.' },
              { letter: 'R', word: 'Respiration', detail: 'Used in aerobic respiration to release energy for growth, reproduction, active transport and other cell processes.' },
              { letter: 'F', word: 'Fats and oils', detail: 'Some glucose is converted into lipids (fats and oils) for storage — especially in seeds. Seeds are often very high in fats.' },
            ],
          },
          {
            type: 'reveal',
            label: '⚡ Exam Recall Check',
            prompt: 'Without looking up — what does SCARF stand for in terms of glucose uses?',
            answer: 'S = Starch (storage). C = Cellulose (cell walls). A = Amino acids (proteins). R = Respiration (energy). F = Fats and oils (seed storage).',
          },
        ]
      },

      // ── SCREEN 6: Glucose Decision Game ────────────────────────────────────
      {
        label: 'Decision Game',
        kicker: 'Apply Your Knowledge',
        heading: 'Where Should The Glucose Go?',
        sub: 'Six scenarios. One right answer each time. No hints.',
        blocks: [
          {
            type: 'scenario',
            label: 'Glucose Decision',
            completionText: 'You can now link glucose uses to plant needs — a favourite AQA exam style question.',
            scenarios: [
              {
                situation: 'The plant needs stronger cell walls to support a new branch.',
                options: ['Starch', 'Cellulose', 'Respiration', 'Fats'],
                correctIndex: 1,
                explanation: 'Cellulose is used to build cell walls. It gives structural strength.',
              },
              {
                situation: 'The plant needs to store energy underground for winter.',
                options: ['Amino acids', 'Cellulose', 'Starch', 'Respiration'],
                correctIndex: 2,
                explanation: 'Starch is insoluble and used for long-term storage — in potatoes, for example.',
              },
              {
                situation: 'The plant is growing rapidly and needs to make new proteins.',
                options: ['Amino acids', 'Starch', 'Fats', 'Cellulose'],
                correctIndex: 0,
                explanation: 'Glucose combines with nitrates to form amino acids, which are linked together to make proteins.',
              },
              {
                situation: 'The plant needs energy for active transport of minerals.',
                options: ['Cellulose', 'Starch', 'Respiration', 'Fats'],
                correctIndex: 2,
                explanation: 'Respiration releases energy from glucose. Active transport needs this energy to move minerals against the concentration gradient.',
              },
              {
                situation: 'A seed needs to store lots of energy in a compact, dense form.',
                options: ['Starch', 'Fats and oils', 'Amino acids', 'Cellulose'],
                correctIndex: 1,
                explanation: 'Fats contain more energy per gram than starch. Seeds (like sunflower seeds) store fats for the germinating seedling to use.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 7: Exam Assassin ─────────────────────────────────────────────
      {
        label: 'Exam Assassin',
        kicker: 'Exam Technique',
        heading: 'How To Actually Score Marks',
        sub: 'These aren\'t tips. These are the specific phrases that win and lose marks.',
        blocks: [
          {
            type: 'examtip',
            label: '🗡️ Tip 1 — Absorb, Not Collect',
            tip: 'Say <strong>"absorbs light energy"</strong> — not "collects sunlight" or "uses light". Examiners want the word ABSORB.',
            phrases: ['absorbs light energy', 'chlorophyll', 'chloroplast'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 2 — Glucose, Not Food',
            tip: 'Photosynthesis produces <strong>glucose</strong>. Never "food" or "sugar" — use the specific term.',
            phrases: ['glucose', 'not food', 'not sugar'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 3 — Transfer, Not Create',
            tip: 'Light energy is <strong>transferred</strong> into chemical energy. Never say plants "make", "create" or "produce" energy. Energy is conserved, not created.',
            phrases: ['energy is transferred', 'light energy → chemical energy', 'stored in glucose'],
          },
          {
            type: 'quiz',
            question: 'Which answer would score the mark?',
            options: [
              { text: 'Chloroplasts collect sunlight to make food for the plant.', correct: false },
              { text: 'Chloroplasts absorb light energy to produce glucose by photosynthesis.', correct: true },
              { text: 'Chloroplasts create energy from sunlight.', correct: false },
              { text: 'Chloroplasts make sugar using the sun.', correct: false },
            ],
            explanation: 'Option B uses the correct command words: "absorb", "light energy", "glucose", "photosynthesis". Every other option uses vague or incorrect language.',
          },
        ]
      },

      // ── SCREEN 8: Boss Battle ───────────────────────────────────────────────
      {
        label: 'Boss Battle',
        kicker: 'Challenge',
        heading: '⚔️ Boss Battle: Apply Everything',
        sub: 'Three questions. Free text. Marked by AI. No skipping.',
        blocks: [
          {
            type: 'read',
            label: '🔥 Real answers only.',
            text: 'Write your answer in the box — then submit it. The AI examiner will mark it against the actual mark scheme, tell you what you got right, what you missed, and show you a model answer. <strong>You have to try before you can see the model answer.</strong>',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Warm Up',
            question: 'A student says: "Plants get food from the soil." Explain why this is incorrect and give a better explanation.',
            markPoints: `- Plants do NOT get food/energy from the soil
- Plants make glucose through photosynthesis
- Photosynthesis uses carbon dioxide, water and light energy
- The soil only provides minerals/nitrates (not food/energy)
- Plants are producers/autotrophs — they make their own food`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Challenge',
            question: 'A plant has damaged chloroplasts. Explain why this would affect the plant\'s growth, even if it has plenty of water and carbon dioxide.',
            markPoints: `- Damaged chloroplasts cannot absorb light energy properly
- Less/no photosynthesis can occur
- Less glucose is produced
- Less glucose means less energy available for growth (via respiration)
- Less glucose means fewer building materials: less cellulose for cell walls, fewer amino acids for proteins
- Plant grows more slowly or stops growing`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Boss Mode',
            question: 'A gardener removes all the leaves from a healthy plant. Predict and explain what will happen to the plant over the following two weeks.',
            markPoints: `- Leaves contain chloroplasts — removing them stops photosynthesis
- No photosynthesis means no glucose being produced
- Plant cannot respire efficiently — less energy available
- Growth stops — no glucose for cellulose or protein synthesis
- Plant uses up stored starch reserves
- Plant weakens and may wilt or die
- Cannot replace damaged or dead cells
- Cannot produce new leaves without stored energy`,
          },
        ]
      },

      // ── SCREEN 9: Fast Recap ────────────────────────────────────────────────
      {
        label: 'Fast Recap',
        kicker: 'Final Retrieval',
        heading: 'Lock It In',
        sub: 'Tap every card. This is the stuff that will come up in Paper 1.',
        blocks: [
          {
            type: 'flashcards',
            cards: [
              { front: 'Chloroplast', back: 'Contains chlorophyll. Absorbs light energy for photosynthesis. Only in plant and algae cells.' },
              { front: 'Nucleus', back: 'Controls cell activities. Contains DNA (genetic instructions).' },
              { front: 'Mitochondria', back: 'Site of aerobic respiration. Releases energy from glucose.' },
              { front: 'Cell wall', back: 'Made of cellulose. Gives plant cells strength and a fixed shape.' },
              { front: 'Large vacuole', back: 'Filled with cell sap. Keeps cell turgid (firm). Not in animal cells.' },
              { front: 'Photosynthesis equation', back: 'carbon dioxide + water → glucose + oxygen. Light energy required. In chloroplasts.' },
              { front: 'SCARF', back: 'Starch · Cellulose · Amino acids · Respiration · Fats and oils. Five uses of glucose.' },
              { front: 'Ribosomes', back: 'Where proteins are made. Present in all cells. Too small for a light microscope.' },
              { front: 'Three things plant cells have that animal cells lack', back: 'Cell wall · Chloroplasts · Large permanent vacuole.' },
              { front: 'Energy in photosynthesis', back: 'Light energy is TRANSFERRED into chemical energy stored in glucose. Never "created".' },
            ]
          },
          {
            type: 'keypoint',
            text: '✅ <strong>You can now:</strong> name all plant cell organelles and their jobs, write the photosynthesis equation correctly, describe five uses of glucose using SCARF, and use the exact phrases that score marks in the exam.',
          },
        ]
      },
    ]
  },

  // ─── Biology — Placeholder topic group modules ───────────────────────────────

  {
    id: 'bio_building_life', subject: 'Biology', number: 2,
    title: 'Building Life', subtitle: 'Cells, Microscopes & Division',
    icon: '🔬', color: '#65E6C6', colorLight: 'rgba(101,230,198,.15)',
    hook: {
      statement: 'Every cell in your body contains the same DNA.',
      isTrue: true,
      accentWords: ['every cell', 'same DNA'],
      explanation: "Every cell — brain to big toe — carries identical DNA. What differs is which genes are switched on or off.",
    },
    outcomes: {
      intro: 'Every living thing starts with a cell. Understanding how cells are built is the foundation for all of the biology that follows.',
      bullets: [
        { text: 'Identify the key organelles in plant and animal cells', icon: 'drop' },
        { text: 'Explain how microscopes changed our understanding of life', icon: 'star' },
        { text: 'Describe the stages of cell division and why it matters', icon: 'prayer' },
        { text: 'See how substances move in and out of cells', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Plant cells have both a cell membrane and a cell wall.', isTrue: true },
        { type: 'choice', question: 'Mitosis produces cells that are...', options: ['Genetically different from the parent cell', 'Genetically identical to the parent cell', 'Half the chromosome count of the parent'], correct: 1 },
        { type: 'connection', question: 'Cell membranes matter because...', options: [
          { text: 'They make the cell rigid and give it shape', icon: 'gear' },
          { text: 'They control precisely what enters and leaves the cell', icon: 'arrow' },
          { text: 'They produce energy for the cell to use', icon: 'atom' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 1',
        heading: 'Building Life',
        content: [
          { type: 'keypoint', text: 'All living things are made of <strong>cells</strong> — the basic unit of life. Understanding how cells are built, how we see them, and how they divide is the foundation of all biology.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Cells: The Tiny Factories</strong> — structure, organelles and their functions.<br><strong>Microscopes & Magnification</strong> — how scientists see cells and calculate scale.<br><strong>Cell Division & Stem Cells</strong> — mitosis, meiosis and the ethics of stem cell research.<br><strong>Moving Stuff In & Out</strong> — diffusion, osmosis and active transport.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_human_machine', subject: 'Biology', number: 3,
    title: 'The Human Machine', subtitle: 'Organs, Digestion & Circulation',
    icon: '🫀', color: '#E87B5F', colorLight: 'rgba(232,123,95,.15)',
    hook: {
      statement: 'Your heart beats around 100,000 times a day.',
      isTrue: true,
      accentWords: ['100,000 times a day'],
      explanation: "At 70 beats per minute, your heart beats roughly 100,800 times every day — about 3 billion times in a lifetime.",
    },
    outcomes: {
      intro: 'Your body is a machine of extraordinary complexity. This chapter shows how its major systems actually work.',
      bullets: [
        { text: 'Explain how cells organise into tissues, organs and systems', icon: 'drop' },
        { text: 'Describe the process of digestion from mouth to absorption', icon: 'star' },
        { text: 'See how the heart and blood vessels deliver oxygen to every cell', icon: 'prayer' },
        { text: 'Understand how plants transport water and nutrients through their structures', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Enzymes are permanently destroyed when they catalyse a reaction.', isTrue: false },
        { type: 'choice', question: 'The heart pumps blood to...', options: ['Only the lungs for oxygenation', 'Both the lungs and the entire body simultaneously', 'Only the brain and major organs'], correct: 1 },
        { type: 'connection', question: 'The digestive system breaks down food so that...', options: [
          { text: 'It can be stored safely as body fat', icon: 'leaf' },
          { text: 'Nutrients can cross into the bloodstream and reach cells', icon: 'heart' },
          { text: 'The body can produce more digestive enzymes', icon: 'flask' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 2',
        heading: 'The Human Machine',
        content: [
          { type: 'keypoint', text: 'Cells don\'t work alone — they group into <strong>tissues, organs and organ systems</strong> to power everything your body does.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Cells → Tissues → Organs</strong> — levels of organisation.<br><strong>Digestion & Enzymes</strong> — gut biology, catalysts and absorption.<br><strong>Blood, Heart & Circulation</strong> — the body\'s delivery system.<br><strong>Plant Transport Systems</strong> — xylem, phloem and stomata.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_disease_wars', subject: 'Biology', number: 4,
    title: 'Disease Wars', subtitle: 'Pathogens, Immunity & Treatment',
    icon: '🦠', color: '#E84F6B', colorLight: 'rgba(232,79,107,.15)',
    hook: {
      statement: 'Antibiotics can kill a virus.',
      isTrue: false,
      accentWords: ['Antibiotics', 'kill a virus'],
      explanation: "Antibiotics only work on bacteria. Viruses live inside your own cells — which makes them much harder to target.",
    },
    outcomes: {
      intro: 'Your body is under constant attack. This chapter shows how pathogens invade — and how your immune system fights back.',
      bullets: [
        { text: 'Identify the types of pathogen and how each causes disease', icon: 'drop' },
        { text: 'Explain how the immune system recognises and destroys invaders', icon: 'star' },
        { text: 'Describe how vaccines and antibiotics work — and where they fail', icon: 'prayer' },
        { text: 'See why lifestyle factors drive non-communicable diseases', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Bacteria and viruses are the same category of pathogen.', isTrue: false },
        { type: 'choice', question: 'Vaccines protect us by...', options: ['Directly killing pathogens in the body', 'Training the immune system to recognise threats', 'Replacing cells damaged by infection'], correct: 1 },
        { type: 'connection', question: 'Antibiotic resistance is a growing crisis because...', options: [
          { text: 'Antibiotics are becoming too expensive to produce', icon: 'flask' },
          { text: 'Bacteria evolve to survive antibiotic treatment over time', icon: 'germ' },
          { text: 'Antibiotics cause severe allergic reactions in most people', icon: 'warning' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 3',
        heading: 'Disease Wars',
        content: [
          { type: 'keypoint', text: 'Your body is under constant attack from <strong>pathogens</strong> — bacteria, viruses, fungi and protists. Understanding how disease spreads and how we fight it is critical for the exam.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Pathogens & Disease</strong> — types of pathogen and how disease spreads.<br><strong>The Immune System</strong> — phagocytes, lymphocytes and antibodies.<br><strong>Treating Disease & Antibiotics</strong> — drugs, vaccines and clinical trials.<br><strong>Non-Communicable Diseases</strong> — cancer, cardiovascular disease and lifestyle factors.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_control_systems', subject: 'Biology', number: 5,
    title: 'Control Systems', subtitle: 'Nerves, Hormones & Reproduction',
    icon: '🧠', color: '#9B8BE8', colorLight: 'rgba(155,139,232,.15)',
    hook: {
      statement: 'Your nervous system sends signals faster than a Formula 1 car.',
      isTrue: true,
      accentWords: ['faster than a Formula 1 car'],
      explanation: "Nerve impulses travel at up to 120 m/s — over 430 km/h. The fastest F1 car tops out around 370 km/h.",
    },
    outcomes: {
      intro: 'Your body coordinates millions of signals every second. This chapter shows the two systems doing that work.',
      bullets: [
        { text: 'Explain how electrical nerve impulses carry information rapidly', icon: 'drop' },
        { text: 'Describe how hormones regulate blood glucose, growth and reproduction', icon: 'star' },
        { text: 'See how reflex arcs protect you before your brain even registers danger', icon: 'prayer' },
        { text: 'Understand how the menstrual cycle is hormonally controlled', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Hormones travel through the nervous system to reach target organs.', isTrue: false },
        { type: 'choice', question: 'Reflex arcs bypass the brain because...', options: ['The brain is damaged in stressful situations', 'Faster responses to danger happen without conscious thought', 'The spinal cord is more reliable than the brain'], correct: 1 },
        { type: 'connection', question: 'Insulin is important because...', options: [
          { text: 'It fights bacterial infections in the bloodstream', icon: 'germ' },
          { text: 'It regulates blood glucose to keep cells working properly', icon: 'heart' },
          { text: 'It accelerates nerve signal transmission speed', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 5',
        heading: 'Control Systems',
        content: [
          { type: 'keypoint', text: 'Your body uses two communication systems — the <strong>nervous system</strong> (electrical, fast) and the <strong>endocrine system</strong> (chemical, slower) — to coordinate everything.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>The Nervous System</strong> — neurons, synapses, reflex arcs and the brain.<br><strong>Hormones & Blood Glucose</strong> — insulin, glucagon, diabetes and the menstrual cycle.<br><strong>Reproduction & Fertility</strong> — sexual vs asexual reproduction, IVF and FSH.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_genetics_evolution', subject: 'Biology', number: 6,
    title: 'Genetics & Evolution', subtitle: 'DNA, Inheritance & Natural Selection',
    icon: '🧬', color: '#7EC8E3', colorLight: 'rgba(126,200,227,.15)',
    hook: {
      statement: 'Humans share 50% of their DNA with a banana.',
      isTrue: true,
      accentWords: ['50%', 'DNA with a banana'],
      explanation: "Around half of human DNA is shared with bananas — because both species share the basic cellular machinery for copying DNA and producing energy.",
    },
    outcomes: {
      intro: 'DNA is the instruction manual for life. This chapter shows how it gets read, inherited — and sometimes rewritten.',
      bullets: [
        { text: 'Explain how DNA encodes the instructions for building proteins', icon: 'drop' },
        { text: 'Use Punnett squares to predict the probability of inherited traits', icon: 'star' },
        { text: 'Describe how natural selection drives evolution over generations', icon: 'prayer' },
        { text: 'Evaluate the science and ethics of genetic engineering', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Every cell in your body contains a full copy of your DNA.', isTrue: true },
        { type: 'choice', question: 'Natural selection favours individuals who are...', options: ['The largest members of the species', 'Best adapted to survive and reproduce in their environment', 'The slowest to reproduce'], correct: 1 },
        { type: 'connection', question: 'DNA mutations can drive evolution because...', options: [
          { text: 'Mutations always make the organism stronger immediately', icon: 'dna' },
          { text: 'Some mutations provide survival advantages in a changing environment', icon: 'leaf' },
          { text: 'They affect every member of the species simultaneously', icon: 'people' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 6',
        heading: 'Genetics & Evolution',
        content: [
          { type: 'keypoint', text: '<strong>DNA</strong> carries the instructions for building every living thing. Understanding how traits are inherited — and how species change over time — is some of the most fascinating science at GCSE.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>DNA & The Genome</strong> — structure, genes, alleles and protein synthesis.<br><strong>Inheritance & Genetic Crosses</strong> — Punnett squares, probability and genetic disorders.<br><strong>Evolution & Natural Selection</strong> — Darwin, evidence and speciation.<br><strong>Genetic Engineering</strong> — CRISPR, GM crops and the ethics of gene editing.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },

  {
    id: 'bio_ecosystems_group', subject: 'Biology', number: 7,
    title: 'Ecosystems', subtitle: 'Food Chains, Biodiversity & Conservation',
    icon: '🌿', color: '#68C18A', colorLight: 'rgba(104,193,138,.15)',
    hook: {
      statement: 'Removing a single species from an ecosystem rarely matters.',
      isTrue: false,
      accentWords: ['single species', 'rarely matters'],
      explanation: "Remove a keystone species — like wolves from Yellowstone — and the whole ecosystem can collapse through a chain reaction called a trophic cascade.",
    },
    outcomes: {
      intro: 'Nothing in nature exists in isolation. This chapter shows how species depend on each other — and what happens when that balance breaks.',
      bullets: [
        { text: 'Describe how energy flows through food chains and food webs', icon: 'drop' },
        { text: 'Explain how species adapt to survive in specific environments', icon: 'star' },
        { text: 'See why biodiversity matters — and what threatens it', icon: 'prayer' },
        { text: 'Evaluate the real impact of human activity on ecosystems', icon: 'question' },
      ],
    },

    recall: {
      questions: [
        { type: 'truefalse', question: 'Producers are animals that hunt and eat other animals.', isTrue: false },
        { type: 'choice', question: 'Biodiversity matters because...', options: ['It makes ecosystems more visually impressive', 'More species makes ecosystems more stable and resilient', 'It prevents any species from dominating another'], correct: 1 },
        { type: 'connection', question: 'Removing a keystone species causes ecosystem collapse because...', options: [
          { text: 'It leaves more food for remaining animals to fight over', icon: 'warning' },
          { text: 'Other species depend on it in ways that cascade through the whole web', icon: 'leaf' },
          { text: 'It only affects the predators that fed on it directly', icon: 'arrow' },
        ], correct: 1 },
      ],
    },
    screens: [
      {
        id: 's1', label: 'Overview', kicker: 'Topic Group 7',
        heading: 'Ecosystems',
        content: [
          { type: 'keypoint', text: 'Every organism exists within an <strong>ecosystem</strong> — a web of interdependent relationships. This topic group covers how energy flows, how species adapt, and what happens when humans interfere.' },
          { type: 'read', label: 'Modules in this group', text: '<strong>Ecosystems & Food Chains</strong> — producers, consumers, energy transfer and pyramids.<br><strong>Adaptations & Biodiversity</strong> — how species are shaped by their environment.<br><strong>Human Impact & Conservation</strong> — deforestation, pollution, rewilding and the IUCN.' },
          { type: 'keypoint', text: '🚧 Individual module content is being built. This topic group launches soon.' },
        ],
      },
    ],
  },
]
