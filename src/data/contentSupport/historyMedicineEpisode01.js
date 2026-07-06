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
      screenRange: [7, 10],
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
      screenRange: [11, 23],
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
      screenRange: [24, 26],
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      id: 'part-6',
      title: 'Exam Prep: Explain the Grip of Galen',
      screenRange: [27, null],
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
      label: 'The theory of opposites',
      purpose: 'Teaches the causal chain behind Galen\'s Theory of Opposites: each humour carries two qualities, an excess of a humour pushes those qualities too far, symptoms reveal which qualities are in excess, and treatment applies the opposite qualities.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
      ],
    },
    {
      screenIndex: 9,
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
      screenIndex: 10,
      label: 'Retrieval',
      purpose: 'Checks Theory of Opposites, the humour-quality mapping, religious explanations and why Galen stayed influential.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:four-humours',
        'history:medicine:god-punishment',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 11,
      label: 'England, 1250',
      purpose: 'Explains why old ideas survived: Church influence, book learning and limited dissection.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:dissection',
      ],
    },
    {
      screenIndex: 12,
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
      screenIndex: 13,
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
      screenIndex: 14,
      label: 'Diagnose Like It\'s 1340',
      purpose: 'Teaches astrology and the Zodiac Man as mainstream learned medical diagnosis.',
      conceptTags: [
        'history:medicine:astrology',
        'history:medicine:physicians',
        'history:medicine:bloodletting',
      ],
    },
    {
      screenIndex: 15,
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
      screenIndex: 16,
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
      screenIndex: 17,
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
      screenIndex: 18,
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
      screenIndex: 19,
      label: 'Staying Well in 1400',
      purpose: 'Teaches prevention through humours, miasma, clean water and uneven town provision.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:physicians',
      ],
    },
    {
      screenIndex: 20,
      label: 'Whose job was it to stay healthy?',
      purpose: 'Sorts medieval prevention between government/town action and individual responsibility.',
      conceptTags: [
        'history:medicine:miasma',
        'history:medicine:factors-in-change',
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 21,
      label: 'A Walk Through Medieval London',
      purpose: 'Teaches medieval hospitals, religious care, Lazar Houses and endowments.',
      conceptTags: [
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:prayer',
      ],
    },
    {
      screenIndex: 22,
      label: 'How John Bradmore saved a prince',
      purpose: 'Shows practical medieval surgery and wartime experience before germ theory.',
      conceptTags: [
        'history:medicine:barber-surgeons',
        'history:medicine:wound-infection',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 23,
      label: 'Words from a medieval medicine chest',
      purpose: 'Retrieval check for medieval practitioners, hospital terms and public health terms.',
      conceptTags: [
        'history:medicine:apothecaries',
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:physicians',
      ],
    },
    {
      screenIndex: 24,
      label: 'Supernatural vs Natural Causes',
      purpose: 'Sorts medieval causes and treatments into rational (Hippocrates/Galen — humours, miasma, bloodletting) versus supernatural (Church — prayer, pilgrimage, astrology).',
      conceptTags: [
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:bloodletting',
        'history:medicine:galen',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 25,
      label: 'Retrieval',
      purpose: 'Retrieval check on urine diagnosis, practitioners and herbal care, and religious treatment (shrines and pilgrimage).',
      conceptTags: [
        'history:medicine:physicians',
        'history:medicine:four-humours',
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
      ],
      missingConceptCandidates: [
        'history:medicine:uroscopy',
        'history:medicine:urine-chart',
      ],
    },
    {
      screenIndex: 26,
      label: 'Fill the Medieval Logic Gap',
      purpose: 'Retrieval of the Four Humours: an imbalance of the humours was believed to cause illness; balance meant health.',
      conceptTags: [
        'history:medicine:four-humours',
      ],
    },
    {
      screenIndex: 27,
      label: 'Exam prep: what the examiner rewards',
      purpose: 'Exam technique — use the exact terms, explain the medieval logic, link cause to treatment (Galen: imbalance → bloodletting) and address why the ideas persisted.',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:theory-of-opposites',
        'history:medicine:bloodletting',
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 28,
      label: 'Face the Examiner',
      purpose: '8-mark practice on how religion influenced medieval treatment — Church-run hospitals, illness as God\'s punishment for sin, prayer and pilgrimage.',
      conceptTags: [
        'history:medicine:god-punishment',
        'history:medicine:sin',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 29,
      label: 'Who Said What?',
      purpose: 'Retrieval linking Hippocrates (Four Humours) and Galen (Theory of Opposites) as the trusted ancient authorities of medieval medicine.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
        'history:medicine:church-authority',
      ],
    },
    {
      screenIndex: 30,
      label: 'Three statements. Look closely.',
      purpose: 'Misconception check: Hippocrates vs Galen (who owns which theory), hospitals as care-not-cure, and why bloodletting and purging appeared to work.',
      conceptTags: [
        'history:medicine:hippocrates',
        'history:medicine:galen',
        'history:medicine:four-humours',
        'history:medicine:theory-of-opposites',
        'history:medicine:medieval-hospitals',
        'history:medicine:religious-hospitals',
        'history:medicine:bloodletting',
        'history:medicine:purging',
      ],
    },
    {
      screenIndex: 31,
      label: 'So How Much Actually Changed?',
      purpose: 'Synthesis of why medieval ideas survived ~1,000 years — Church authority over Galen and banned dissection — while surgery advanced outside the universities (John Bradmore).',
      conceptTags: [
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:astrology',
        'history:medicine:galen',
        'history:medicine:church-authority',
        'history:medicine:dissection',
        'history:medicine:factors-in-change',
        'history:medicine:barber-surgeons',
        'history:medicine:wound-infection',
      ],
    },
    {
      screenIndex: 32,
      label: 'Write the big essay',
      purpose: '16-mark judgement on whether the Church was the main reason for little change, weighing Church control (Galen-only training, banned dissection) against other factors.',
      conceptTags: [
        'history:medicine:church-authority',
        'history:medicine:galen',
        'history:medicine:dissection',
        'history:medicine:factors-in-change',
      ],
    },
    {
      screenIndex: 33,
      label: 'The web of medieval belief',
      purpose: 'Consolidation map connecting all medieval explanations of illness — God and sin, astrology, the Four Humours, miasma and Galen\'s Church-backed authority.',
      conceptTags: [
        'history:medicine:god-punishment',
        'history:medicine:prayer',
        'history:medicine:pilgrimage',
        'history:medicine:astrology',
        'history:medicine:four-humours',
        'history:medicine:miasma',
        'history:medicine:galen',
        'history:medicine:church-authority',
      ],
    },
  ],
}

// ─── Derived reverse index: concept → the revision material that teaches it ───
//
// Purpose: when a learner gets a concept wrong, look the concept id up here and
// send them back to the exact screens (and part) of this module that teach it —
// "you slipped on Galen, revisit these screens." This is the metadata the
// weak-spot router needs to encourage revisiting revision material.
//
// Derived from the forward map above, so there is a single source of truth and
// the two can never drift; no concept ids are invented here.
//
// Shape: { [conceptId]: { concept, screens: number[], parts: string[] } }
//   screens — screen indices (from the per-screen map, 0–33 today) that teach
//             the concept, ascending. The first entry is the natural revisit
//             point (cf. findTaggedScreen in tagModuleMap.js, but concept-based
//             and multi-screen).
//   parts   — stageRange ids covering the concept (whole-module coverage,
//             including exam-prep parts 5–6, whose screens are also mapped
//             at screen level).
export function deriveConceptSupport(map) {
  const out = {}
  const bucket = (id) => (out[id] ??= { concept: id, screens: new Set(), parts: new Set() })
  for (const screen of map.screens) {
    for (const tag of screen.conceptTags) bucket(tag).screens.add(screen.screenIndex)
  }
  for (const range of map.stageRanges) {
    for (const tag of range.conceptTags) bucket(tag).parts.add(range.id)
  }
  const sorted = {}
  for (const id of Object.keys(out).sort()) {
    sorted[id] = {
      concept: id,
      screens: [...out[id].screens].sort((a, b) => a - b),
      parts: [...out[id].parts].sort(),
    }
  }
  return sorted
}

export const HISTORY_MEDICINE_EPISODE_01_CONCEPT_SUPPORT = deriveConceptSupport(
  HISTORY_MEDICINE_EPISODE_01_SUPPORT,
)

export default HISTORY_MEDICINE_EPISODE_01_SUPPORT
