// ─── Subject Backdrop Images ─────────────────────────────────────────────────
//
// Full-screen atmospheric backer image for each subject, served from /public.
// Single source of truth — never redefine this map locally in a component.
//
// Still carrying local copies pending migration: TieredQuizScreen,
// faceTheExaminer/utils.js, QuickRecallScreen.
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
  Drama:     null, // subject-token atmosphere is used until a dedicated asset exists
  Music:     null, // subject-token atmosphere is used until a dedicated asset exists
}

// Mobile-first focal positions for full-screen subject backdrops. These preserve
// the most useful visual detail on the open side of a left-aligned text layout.
// Components may use these positions, but must not duplicate a local subject map.
export const SUBJECT_BACKDROP_POSITIONS = {
  History:   '64% center',
  Biology:   '72% center',
  Maths:     '68% center',
  Sociology: '62% center',
  Chemistry: '70% center',
  Physics:   '66% center',
  English:   '62% center',
  Drama:     'center',
  Music:     'center',
}

// Shared treatment for restrained backdrops inside an inline learning block.
// The image supports subject identity without becoming a second focal point.
export const INLINE_SUBJECT_BACKDROP = {
  opacity: 0.18,
  filter: 'saturate(0.78) brightness(0.62)',
}
