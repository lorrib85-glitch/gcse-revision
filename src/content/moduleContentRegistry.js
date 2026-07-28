// Legacy compatibility facade.
//
// New code must import CHAPTER_CONTENT_LOADERS or loadChapterContent from
// ./chapterContentRegistry.js. This file remains until Phase 6 so existing
// runtime imports continue to work unchanged.

export {
  CHAPTER_CONTENT_LOADERS,
  CHAPTER_CONTENT_LOADERS as MODULE_CONTENT_LOADERS,
  loadChapterContent,
} from './chapterContentRegistry.js'
