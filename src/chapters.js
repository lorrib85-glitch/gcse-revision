// Canonical chapter metadata catalogue — the public boundary.
//
// Chapters are learner-facing journeys inside a parent module. This file owns
// browsing metadata, availability, progress-card metadata and weak-spot tags.
// Full chapter content is loaded lazily through chapterContentRegistry.js.
//
// screenCount — number of authored screens in the chapter
// screenTags  — screen.tag values in order, used for targeted recovery routes
// availability — optional override: available | comingSoon | hidden
//
// The rows are no longer authored here. They are projected from the canonical
// records in src/curriculum-catalogue/ — with screenCount and screenTags
// derived from each chapter's content file — and rendered into
// src/data/generated/curriculum/chapters.js, which this file re-exports
// unchanged. Edit a chapter record, run `pnpm curriculum:projections:generate`.
//
// This file stays the import path for every consumer. Nothing but the three
// boundary files may import src/data/generated/curriculum/**.

export {
  CHAPTERS,
  CHAPTER_AVAILABILITY,
  getChapterAvailability,
  isChapterAvailable,
} from './data/generated/curriculum/chapters.js'
