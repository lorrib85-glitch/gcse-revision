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
      screenRange: [1, 6],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
      ],
    },
    {
      id: 'part-3',
      title: 'Medieval explanations',
      screenRange: [7, 10],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:flagellants',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
        'history:medicine:purging',
      ],
    },
    {
      id: 'part-4',
      title: 'Treatments and prevention',
      screenRange: [11, 12],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:flagellants',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:bloodletting',
        'history:medicine:four-humours',
        'history:medicine:physicians',
      ],
    },
    {
      id: 'part-5',
      title: 'Life during the plague',
      screenRange: [13, 14],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      id: 'part-6',
      title: 'The aftermath',
      screenRange: [15, 18],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
      ],
    },
    {
      id: 'part-7',
      title: 'Exam prep',
      screenRange: [19, null],
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:flagellants',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:bloodletting',
        'history:medicine:four-humours',
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
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 2,
      label: 'The dock at Melcombe',
      purpose: 'Explore the dock at Melcombe — trading ships, crew and rats — showing how the plague entered England via trade routes.',
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 3,
      label: 'How it spread',
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
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 5,
      label: 'The scale of the disaster',
      purpose: 'The scale of death — plague pits, and the bubonic, pneumonic and septicaemic forms with their symptoms.',
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 6,
      label: 'How the plague killed',
      purpose: 'Stage-by-stage progression of bubonic plague through the body, from flea bite to death.',
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 7,
      label: 'What would you believe?',
      purpose: 'Choose what you would believe caused the plague — God\'s punishment, miasma, astrology — reconstructing the medieval logic and its responses.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:flagellants',
        'history:medicine:miasma',
        'history:medicine:astrology',
      ],
    },
    {
      screenIndex: 8,
      label: 'Beliefs and responses',
      purpose: 'Match each plague explanation (God, miasma, astrology, humours) to its treatment.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:flagellants',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
        'history:medicine:purging',
      ],
    },
    {
      screenIndex: 9,
      label: 'The actual cause',
      purpose: 'Contrasts medieval beliefs with the actual cause — rats, fleas and Yersinia pestis (not identified until 1894).',
      conceptTags: [
        'history:medicine:black-death',
      ],
    },
    {
      screenIndex: 10,
      label: 'Causes and beliefs check',
      purpose: 'Retrieval check on plague causes and beliefs — the astrological explanation, the real cause, and miasma/posies.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:astrology',
        'history:medicine:miasma',
      ],
    },
    {
      screenIndex: 11,
      label: 'Plague treatments',
      purpose: 'Explore medieval plague treatments — flagellation, posies/herbs (miasma) and bloodletting (Four Humours), administered by physicians.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:flagellants',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:bloodletting',
        'history:medicine:four-humours',
        'history:medicine:physicians',
      ],
    },
    {
      screenIndex: 12,
      label: 'Treatment to belief',
      purpose: 'Match each plague treatment to the belief that drove it (God\'s punishment, miasma, Four Humours).',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:flagellants',
        'history:medicine:god-punishment',
        'history:medicine:miasma',
        'history:medicine:bloodletting',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 13,
      label: 'A village in 1349',
      purpose: 'Narrative of a village in 1349 — the human and social disruption of the epidemic.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 14,
      label: 'Rich and poor',
      purpose: 'Rich versus poor — unequal death, abandoned villages and heavy losses among the clergy.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 15,
      label: 'What changed after the plague',
      purpose: 'What changed after the plague — labour shortage, higher wages and weakened Church authority.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 16,
      label: 'Why the Black Death changed England',
      purpose: 'The causal chain of change: population fall → labour shortage → challenge to feudalism; failed prayer → weakened Church credibility.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 17,
      label: 'Changed or stayed the same?',
      purpose: 'Sort what changed versus what stayed the same after 1350 — society changed (wages, Church authority) while medicine (miasma, humours, treatments) did not.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:factors-in-change',
        'history:medicine:church-authority',
        'history:medicine:miasma',
        'history:medicine:god-punishment',
        'history:medicine:four-humours',
        'history:medicine:bloodletting',
        'history:medicine:prayer',
      ],
    },
    {
      screenIndex: 18,
      label: 'Aftermath check',
      purpose: 'Retrieval check on the aftermath — wages, Church authority and the continuity of medical theory.',
      conceptTags: [
        'history:medicine:black-death',
        'history:medicine:church-authority',
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
      conceptTags: [
        'history:medicine:black-death',
      ],
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
