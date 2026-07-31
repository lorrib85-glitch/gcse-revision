// Canonical parent-module catalogue.
//
// A module is a curriculum unit containing an ordered sequence of chapter IDs.
// Learner-facing chapter metadata lives in src/chapters.js.

export const MODULES = [
  {
    id: 'hist_medicine',
    title: 'Medicine Through Time',
    subject: 'History',
    chapterIds: [
      'history-medicine-medieval-beliefs-causes',
      'history-medicine-black-death',
      'history-medicine-vesalius-beginning-doubt',
      'history-medicine-harvey-pare-renaissance-method',
      'history-medicine-great-plague-1665',
      'history-medicine-surgery-anaesthetics',
      'history-medicine-jenner-vaccination',
      'history-medicine-germ-theory',
      'history-medicine-great-stink',
      'history-medicine-surgery-revolution',
      'history-medicine-nightingale',
      'history-medicine-accidental-miracle',
      'history-medicine-modern-medicine',
      'history-medicine-cancer',
      // The British sector of the Western Front is the historic-environment
      // element of the Edexcel Medicine unit, not a separate topic.
      'history-medicine-western-front',
    ],
  },
  {
    id: 'soc_family',
    title: 'Sociology of the Family',
    subject: 'Sociology',
    chapterIds: ['soc1', 'soc2', 'soc3', 'soc4', 'soc6'],
  },
  {
    id: 'maths_core',
    title: 'GCSE Maths',
    subject: 'Maths',
    chapterIds: [
      'math1',
      'math2',
      'math3',
      'math4',
      'math5',
      'math6',
      'math7',
      'math8',
    ],
  },
  {
    id: 'bio_core',
    title: 'GCSE Biology',
    subject: 'Biology',
    chapterIds: [
      'bio_building_blocks',
      'sci_bio_w1',
      'bio_building_life',
      'bio_human_machine',
      'bio_disease_wars',
      'bio_control_systems',
      'bio_genetics_evolution',
      'bio_ecosystems_group',
    ],
  },
  // No Chemistry module yet: no Chemistry chapter has complete metadata and
  // content. Add the parent module alongside the first real Chemistry chapter.

  // Modules whose chapters are all still unbuilt stubs are kept at the end of
  // the catalogue on purpose. Array order drives the "next module" hand-off on
  // the completion screen, which has no stub guard — moving these up next to
  // hist_medicine would make finishing the Western Front offer a chapter that
  // cannot be opened.
  {
    id: 'eng_macbeth',
    title: 'Macbeth',
    subject: 'English',
    chapterIds: ['english-macbeth-power-ambition'],
  },
  {
    id: 'hist_spain_new_world',
    title: 'Spain and the New World, c1490–c1555',
    subject: 'History',
    chapterIds: [
      'spain-new-world-1',
      'spain-new-world-2',
      'spain-new-world-3',
      'spain-new-world-4',
      'spain-new-world-5',
      'spain-new-world-6',
      'spain-new-world-7',
      'spain-new-world-8',
      'spain-new-world-9',
      'spain-new-world-10',
    ],
  },
  {
    id: 'hist_usa',
    title: 'The USA, 1954–75: conflict at home and abroad',
    subject: 'History',
    chapterIds: [
      'usa-segregation',
      'usa-brown-v-board',
      'usa-rosa-parks',
      'usa-sit-ins',
      'usa-i-have-a-dream',
      'usa-malcolm-x',
      'usa-how-much-changed',
      'usa-why-vietnam',
      'usa-americas-war',
      'usa-guerrilla-war',
      'usa-war-comes-home',
      'usa-long-way-out',
    ],
  },
]

export function getModuleById(moduleId) {
  return MODULES.find(module => module.id === moduleId) ?? null
}

export function getModuleForChapter(chapterId) {
  return MODULES.find(module => module.chapterIds.includes(chapterId)) ?? null
}
