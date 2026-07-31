// Subject-browser catalogue — what a learner sees, in what order.
//
// Real chapter ownership and order are canonical in src/data/modules.js: a
// subject's chapters are its modules' `chapterIds`, flattened in module order
// and resolved against src/chapters.js. The flat CHAPTERS array is authoring
// order, not journey order, so it is never filtered by subject here.
//
// The `cs_*` cards below are browse-surface presentation only — placeholders
// for series that have no built chapters yet. They deliberately live outside
// CHAPTERS and MODULES: they have no content, no loader and no progress, and
// must never be openable.

import { CHAPTERS } from '../../chapters.js'
import { MODULES } from '../../data/modules.js'

const comingSoon = (cards) => cards.map(card => ({ ...card, comingSoon: true }))

const MACBETH_PLACEHOLDERS = comingSoon([
  { id: 'cs_macbeth_2', title: 'Out, damned spot',                 subtitle: 'Guilt and consequence', series: 'macbeth', number: 2 },
  { id: 'cs_macbeth_3', title: 'Double, double, toil and trouble', subtitle: 'The witches and fate',  series: 'macbeth', number: 3 },
  { id: 'cs_macbeth_4', title: 'Fair is foul, foul is fair',       subtitle: 'Appearance vs reality', series: 'macbeth', number: 4 },
])

const INSPECTOR_PLACEHOLDERS = comingSoon([
  { id: 'cs_inspector_1', title: 'We are members of one body', subtitle: "Priestley's social message",  series: 'inspector', number: 1 },
  { id: 'cs_inspector_2', title: 'I accept no blame',          subtitle: 'Responsibility and denial',   series: 'inspector', number: 2 },
  { id: 'cs_inspector_3', title: 'Fire, blood and anguish',    subtitle: 'Consequences and resolution', series: 'inspector', number: 3 },
])

const PHYSICS_PLACEHOLDERS = comingSoon([
  { id: 'cs_forces', title: 'Forces & Motion',     subtitle: 'AQA Physics · Topic 5 & 6' },
  { id: 'cs_energy', title: 'Energy',              subtitle: 'AQA Physics · Topic 1' },
  { id: 'cs_waves',  title: 'Waves & Electricity', subtitle: 'AQA Physics · Topic 6 & 2' },
  { id: 'cs_space',  title: 'Space',               subtitle: 'AQA Physics · Topic 8' },
  { id: 'cs_matter', title: 'Matter & Particles',  subtitle: 'AQA Physics · Topic 3 & 4' },
])

// A subject's real chapters, in canonical module order. Chapter ids referenced
// by a module but missing from CHAPTERS are dropped here; the hierarchy
// validation in tests/architecture/content-hierarchy.test.js is what stops that
// happening in the first place.
function getModuleChapters(subjectName) {
  return MODULES
    .filter(module => module.subject === subjectName)
    .flatMap(module => module.chapterIds)
    .map(chapterId => CHAPTERS.find(chapter => chapter.id === chapterId))
    .filter(Boolean)
}

export function getSubjectChapterList(subjectName) {
  const real = getModuleChapters(subjectName)
  switch (subjectName) {
    case 'English':
      return [...real, ...MACBETH_PLACEHOLDERS, ...INSPECTOR_PLACEHOLDERS]
    case 'Physics':
      return [...real, ...PHYSICS_PLACEHOLDERS]
    default:
      if (real.length > 0) return real
      return comingSoon([{ id: `cs_${subjectName.toLowerCase()}`, title: 'Content coming soon', subtitle: subjectName }])
  }
}
