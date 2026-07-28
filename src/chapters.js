// Canonical chapter metadata surface.
//
// Phase 2 keeps the large metadata table in its legacy source file so the
// hierarchy migration stays behaviour-preserving. New code must import the
// chapter vocabulary from this file; src/modules.js remains a compatibility
// source until the final legacy-removal phase.

import {
  MODULES as LEGACY_CHAPTERS,
  MODULE_AVAILABILITY as LEGACY_CHAPTER_AVAILABILITY,
  getModuleAvailability as getLegacyChapterAvailability,
  isModuleAvailable as isLegacyChapterAvailable,
} from './modules.js'

export const CHAPTERS = LEGACY_CHAPTERS
export const CHAPTER_AVAILABILITY = LEGACY_CHAPTER_AVAILABILITY
export const getChapterAvailability = getLegacyChapterAvailability
export const isChapterAvailable = isLegacyChapterAvailable
