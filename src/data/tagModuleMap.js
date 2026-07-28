// Legacy compatibility facade.
//
// New code must use TAG_CHAPTER_MAP and findTaggedChapterScreen from
// ./tagChapterMap.js. These aliases remain until Phase 6.

export {
  TAG_CHAPTER_MAP,
  TAG_CHAPTER_MAP as TAG_MODULE_MAP,
  findTaggedChapterScreen,
  findTaggedChapterScreen as findTaggedScreen,
} from './tagChapterMap.js'
