// Canonical parent-module catalogue — the public boundary.
//
// A module is a curriculum unit containing an ordered sequence of chapter IDs.
// Learner-facing chapter metadata lives in src/chapters.js.
//
// The rows are no longer authored here. They are projected from the canonical
// records in src/curriculum-catalogue/ and rendered into
// src/data/generated/curriculum/modules.js, which this file re-exports
// unchanged. Edit a module record, run `pnpm curriculum:projections:generate`.
//
// This file stays the import path for every consumer. Nothing but the three
// boundary files may import src/data/generated/curriculum/**.

export {
  MODULES,
  getModuleById,
  getModuleForChapter,
} from './generated/curriculum/modules.js'
