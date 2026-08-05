// Chapter content registry — the public boundary.
//
// Maps each chapter ID to its own content file. Each loader is a dynamic import
// so only the requested chapter is downloaded.
//
// The entries are no longer authored here. They are projected from the
// canonical chapter records' contentPath in src/curriculum-catalogue/ and
// rendered into src/data/generated/curriculum/chapterContentLoaders.js, which
// this file re-exports unchanged. Add a chapter record with a contentPath, run
// `pnpm curriculum:projections:generate`.
//
// This file stays the import path for every consumer. Nothing but the three
// boundary files may import src/data/generated/curriculum/**.

export {
  CHAPTER_CONTENT_LOADERS,
  loadChapterContent,
} from '../data/generated/curriculum/chapterContentLoaders.js'
