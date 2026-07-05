// ─── Subject Backdrop Images ─────────────────────────────────────────────────
//
// Full-screen atmospheric backer image for each subject, served from /public.
// Single source of truth — never redefine this map locally in a component.
//
// Still carrying local copies pending migration: TieredQuizScreen,
// ChapterOutcomeScreen, faceTheExaminer/utils.js, QuickRecallScreen.
//
// The chemistry filename spelling matches the real asset on disk.

export const SUBJECT_BACKDROPS = {
  History:   '/historybacker.webp',
  Biology:   '/biologybacker.webp',
  Maths:     '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics:   '/physicsbacker.webp',
  English:   '/Englishbacker.webp',
  Music:     '/historybacker.webp', // no Music backer asset yet
}
