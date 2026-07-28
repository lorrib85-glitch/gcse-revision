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
      'history-medicine-accidental-miracle',
      'history-medicine-modern-medicine',
      'history-medicine-cancer',
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
    chapterIds: ['math1', 'math2'],
  },
  {
    id: 'bio_core',
    title: 'GCSE Biology',
    subject: 'Biology',
    chapterIds: [
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
]

export function getModuleById(moduleId) {
  return MODULES.find(module => module.id === moduleId) ?? null
}

export function getModuleForChapter(chapterId) {
  return MODULES.find(module => module.chapterIds.includes(chapterId)) ?? null
}
