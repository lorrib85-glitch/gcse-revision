// Concept-support map for Medicine Episode 1.
//
// This is the first pass at connecting question weaknesses to the teaching
// screens that support them. It is intentionally separate from the runtime
// episode file so the tagging model can be reviewed without changing lesson UI
// behaviour. All concept ids must be registered in
// src/data/learningGraph/concepts/historyMedicine.js.

export const HISTORY_MEDICINE_EPISODE_01_SUPPORT = {
  id: 'history-medicine-medieval-beliefs-causes',
  title: 'Trust me, I\'m Following Jupiter',
  sourceFile: 'src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js',
  status: 'draft-human-review',

  stageRanges: [
    {
      id: 'part-1',
      title: 'Strange Ideas, Serious Medicine',
      screenRange: [0, 0],
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:galen',
        'history:medicine:church-authority',
      ],
    },
    {
      id: 'part-2',
      title: 'What Made People Sick?',
      screenRange: [1, 6],
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:god-punishment',
      ],
    },
    {
      id: 'part-3',
      title: 'Why Galen Ruled the Room',
      screenRange: [7, 9],
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
        'history:medicine:church-authority',
      ],
    },
    {
      id: 'part-4',
      title: 'The Medieval Treatment Toolkit',
      screenRange: [10, 22],
      conceptTags: [
        'history:medicine:physicians',
        'history:medicine:barber-surgeons',
        'history:medicine:apothecaries',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:bloodletting',
        'history:medicine:purging',
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
      ],
    },
    {
      id: 'part-5',
      title: 'Why the System Survived',
      screenRange: [23, 25],
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      id: 'part-6',
      title: 'Exam Prep: Explain the Grip of Galen',
      screenRange: [26, null],
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
  ],

  screens: [
    {
      screenIndex: 0,
      label: 'Ancient Authorities',
      purpose: 'Introduces Hippocrates, Galen and Church copying/teaching as the authority structure behind medieval medicine.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:galen',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 1,
      label: 'The Germ Problem',
      purpose: 'Frames why medieval people needed non-germ explanations for disease.',
      conceptTags: [
        'history:medicine:miasma',
        'history:medicine:four-humours',
        'history:medicine:god-punishment',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 2,
      label: 'The search for answers',
      purpose: 'Introduces Hippocrates as the starting point for natural explanations of illness.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 3,
      label: 'Hippocrates',
      purpose: 'Teaches Hippocrates, natural causes, observation and the Four Humours.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 4,
      label: 'The Four Humours',
      purpose: 'Teaches the core humoural theory: balance equals health and imbalance equals illness.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:hippocrates',
      ],
    },
    {
      screenIndex: 5,
      label: 'Explore the Humours',
      purpose: 'Applies the four humour model to symptoms and treatment logic.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 6,
      label: 'Hippocrates — quick check',
      purpose: 'Retrieval check for natural causes and humoural imbalance.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 7,
      label: 'Galen',
      purpose: 'Teaches Galen, animal dissection, Four Humours, Theory of Opposites and lasting authority.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
        'history:medicine:dissection',
      ],
    },
    {
      screenIndex: 8,
      label: 'Think Like Galen',
      purpose: 'Applies Galen\'s Theory of Opposites to diagnosis and treatment decisions.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:four-humours',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 9,
      label: 'Retrieval',
      purpose: 'Checks Theory of Opposites, religious explanations and why Galen stayed influential.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:god-punishment',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 10,
      label: 'England, 1250',
      purpose: 'Explains why old ideas survived: Church influence, book learning and limited dissection.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:dissection',
      ],
    },
    {
      screenIndex: 11,
      label: 'Choose Your Healer',
      purpose: 'Compares physicians, barber surgeons, apothecaries, home care and priests.',
      conceptTags: [
        'history:medicine:physicians',
        'history:medicine:barber-surgeons',
        'history:medicine:apothecaries',
        'history:medicine:prayer',
        'history:medicine:sin',
        'history:medicine:god-punishment',
      ],
    },
    {
      screenIndex: 12,
      label: 'Miasma — The Poisoned Air Theory',
      purpose: 'Teaches miasma and contrasts bad-air explanations with later germ theory.',
      conceptTags: [
        'history:medicine:miasma',
        'history:medicine:germ-theory',
        'history:medicine:john-snow',
        'history:medicine:cholera',
      ],
    },
    {
      screenIndex: 13,
      label: 'Diagnose Like It\'s 1340',
      purpose: 'Teaches astrology and the Zodiac Man as mainstream learned medical diagnosis.',
      conceptTags: [
        'history:medicine:astrology',
        'history:medicine:physicians',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 14,
      label: 'Causes of illness',
      purpose: 'Bridge screen connecting medieval explanations to treatments.',
      conceptTags: [
        'history:medicine:god-punishment',
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 15,
      label: 'The colour of your illness',
      purpose: 'Teaches uroscopy as a humoural diagnostic method.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:physicians',
      ],
      missingConceptCandidates: [
        'history:medicine:uroscopy',
        'history:medicine:urine-chart',
      ],
    },
    {
      screenIndex: 16,
      label: 'What caused illness?',
      purpose: 'Contrasts God and sin, Four Humours and astrology, with associated treatments.',
      conceptTags: [
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
        'history:medicine:purging',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 17,
      label: 'Knowledge check',
      purpose: 'Retrieval check for key medieval medicine terms.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
        'history:medicine:physicians',
        'history:medicine:astrology',
      ],
      missingConceptCandidates: [
        'history:medicine:uroscopy',
        'history:medicine:urine-chart',
      ],
    },
    {
      screenIndex: 18,
      label: 'Staying Well in 1400',
      purpose: 'Teaches prevention through humours, miasma, clean water and uneven town provision.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:physicians',
      ],
    },
    {
      screenIndex: 19,
      label: 'Whose job was it to stay healthy?',
      purpose: 'Sorts medieval prevention between government/town action and individual responsibility.',
      conceptTags: [
        'history:medicine:miasma',
        'history:medicine:factors-in-change',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 20,
      label: 'A Walk Through Medieval London',
      purpose: 'Teaches medieval hospitals, religious care, Lazar Houses and endowments.',
      conceptTags: [
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:prayer',
      ],
    },
    {
      screenIndex: 21,
      label: 'How John Bradmore saved a prince',
      purpose: 'Shows practical medieval surgery and wartime experience before germ theory.',
      conceptTags: [
        'history:medicine:barber-surgeons',
        'history:medicine:wound-infection',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 22,
      label: 'Words from a medieval medicine chest',
      purpose: 'Retrieval check for medieval practitioners, hospital terms and public health terms.',
      conceptTags: [
        'history:medicine:apothecaries',
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:physicians',
      ],
    },
  ],
}

export default HISTORY_MEDICINE_EPISODE_01_SUPPORT
