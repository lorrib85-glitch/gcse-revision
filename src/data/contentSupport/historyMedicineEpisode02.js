// Concept-support map for Medicine Episode 2 — "The day everything changed"
// (the Black Death, 1348).
//
// Same pattern as historyMedicineEpisode01.js: it connects question weaknesses
// to the teaching screens that support them, separately from the runtime
// episode file so the tagging model can be reviewed without touching lesson UI.
// All concept ids must be registered in
// src/data/learningGraph/concepts/historyMedicine.js.
//
// Episode 2 is a case study that *tests* the Episode 1 belief system, so the
// medieval-medicine concepts (miasma, Four Humours, God/sin, astrology,
// bloodletting) are interleaved throughout. Its distinctive teaching point —
// society changed but medicine did not — is tagged with
// history:medicine:factors-in-change alongside history:medicine:church-authority.
//
// The reverse index is derived with the shared deriveConceptSupport helper from
// Episode 1, so the derivation logic has a single source of truth.

import { deriveConceptSupport } from './historyMedicineEpisode01.js'

export const HISTORY_MEDICINE_EPISODE_02_SUPPORT = {
  id: 'history-medicine-black-death',
  title: 'The day everything changed',
  sourceFile: 'src/content/history/medicine/episodes/episode-02-black-death.js',
  status: 'draft-human-review',

  stageRanges: [
    {
      id: 'part-1',
      title: 'Prior knowledge recall',
      screenRange: [0, 0],
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:astrology',
        'history:medicine:bloodletting',
        'history:medicine:church-authority',
      ],
    },
    {
      id: 'part-2',
      title: 'The arrival',
      screenRange: [1, 7],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
      ],
    },
    {
      id: 'part-3',
      title: 'Explanations',
      screenRange: [8, 10],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
      ],
    },
    {
      id: 'part-4',
      title: 'Responses',
      screenRange: [11, 14],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:flagellants',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:bloodletting',
        'history:medicine:four-humours',
        'history:medicine:factors-in-change',
      ],
    },
    {
      id: 'part-5',
      title: 'Impact',
      screenRange: [15, 17],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
        'history:medicine:prayer',
      ],
    },
    {
      id: 'part-6',
      title: 'Exam prep',
      screenRange: [18, null],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:flagellants',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:bloodletting',
        'history:medicine:factors-in-change',
        'history:medicine:church-authority',
      ],
    },
  ],

  screens: [
    {
      screenIndex: 0,
      label: 'Prior knowledge recall',
      purpose: 'Prior-knowledge recall of Episode 1 medieval medicine (causes, theories, treatments, the Church) before the Black Death case study.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:four-humours',
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:astrology',
        'history:medicine:bloodletting',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 1,
      label: 'ENGLAND, 1348',
      purpose: 'Cinematic arrival — the Black Death reaches England through the port of Melcombe in 1348.',
      conceptTags: ['history:medicine:black-death'],
    },
    {
      screenIndex: 2,
      label: 'The dock at Melcombe',
      purpose: 'Explore the dock at Melcombe — trading ships, crew and rats — showing how the plague entered England via trade routes.',
      conceptTags: ['history:medicine:black-death'],
    },
    {
      screenIndex: 3,
      label: 'The chain, scroll by scroll',
      purpose: 'Pan the transmission timeline — trade ships, black rats, infected fleas and spread along trade routes — contrasted with medieval miasma/God explanations.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
      ],
    },
    {
      screenIndex: 4,
      label: 'Where did it come from?',
      purpose: 'Where the Black Death came from and how trade routes carried it across Asia and Europe to England.',
      conceptTags: ['history:medicine:black-death'],
    },
    {
      screenIndex: 5,
      label: 'What was really happening?',
      purpose: 'Contrasts what medieval people believed (God, bad air, astrology) with the real cause, carrier and spread mechanism of the plague.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 6,
      label: 'How the disease killed',
      purpose: 'Stage-by-stage progression of bubonic plague through the body, from flea bite to death.',
      conceptTags: ['history:medicine:black-death'],
    },
    {
      screenIndex: 7,
      label: 'Quick check',
      purpose: 'Retrieval check on the actual cause of the plague versus the medieval alternatives (miasma, God, astrology).',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 8,
      label: 'Why did medieval people get it wrong?',
      purpose: 'Explains why religion, miasma and astrology each seemed like reasonable explanations without microscopes or germ theory.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:miasma',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 9,
      label: 'Cause sort',
      purpose: 'Sort medieval beliefs (God, miasma, astrology) from the actual cause (bacteria carried by fleas on rats).',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 10,
      label: 'Multiple beliefs at once',
      purpose: 'A scenario walking through the cause and response of each medieval theory (God, miasma, astrology, Four Humours) side by side.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 11,
      label: 'Treatment logic',
      purpose: 'Retrieval check matching each medieval belief to the treatment it made seem logical.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 12,
      label: 'Belief → response',
      purpose: 'Match each plague belief (God, miasma, astrology, humours) to the response it produced.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 13,
      label: 'Why treatments failed',
      purpose: 'Explains why prayer, burning herbs and bloodletting all failed — none addressed the real cause.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:flagellants',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 14,
      label: 'Trap check',
      purpose: 'Misconception trap — the Black Death did not lead medieval people to discover the real cause of disease.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 15,
      label: 'Aftermath',
      purpose: 'Timeline of post-plague England — labour shortage, the Statute of Labourers, and the Peasants\' Revolt.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 16,
      label: 'Change and continuity',
      purpose: 'The Black Death changed society but not medical understanding — change without progress.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 17,
      label: 'What changed? What stayed the same?',
      purpose: 'Sort what changed versus what stayed the same after 1350 — society changed (wages, Church authority) while medicine (miasma, humours, treatments) did not.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
        'history:medicine:church-authority',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 18,
      label: 'Most common trap',
      purpose: 'The most common exam trap — claiming the plague led to medical discovery — and how to correct it.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 19,
      label: 'The story so far',
      purpose: 'Recap of the Black Death — arrival, the three beliefs and their treatments, and society changing while medicine did not.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:prayer',
        'history:medicine:flagellants',
        'history:medicine:bloodletting',
        'history:medicine:factors-in-change',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 20,
      label: 'How examiners think',
      purpose: 'Exam technique — identify then explain, use precise evidence, contrast belief with the real cause, and separate social change from medical change.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 21,
      label: 'Face the Examiner',
      purpose: '4-mark practice on how religious belief (God\'s punishment for sin) shaped responses such as prayer during the Black Death.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
      ],
    },
    {
      screenIndex: 22,
      label: 'Write for the examiner',
      purpose: 'Guided 4-mark answer describing two ways the Black Death spread through England.',
      conceptTags: ['history:medicine:black-death'],
    },
    {
      screenIndex: 23,
      label: 'Final chapter challenge',
      purpose: 'Final retrieval challenge across the chapter — dates, beliefs (miasma, God/sin, prayer), the real cause and social change.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:factors-in-change',
      ],
    },
  ],
}

export const HISTORY_MEDICINE_EPISODE_02_CONCEPT_SUPPORT = deriveConceptSupport(
  HISTORY_MEDICINE_EPISODE_02_SUPPORT,
)

export default HISTORY_MEDICINE_EPISODE_02_SUPPORT
