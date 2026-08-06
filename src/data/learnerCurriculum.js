// Canonical learner-curriculum runtime boundary.
//
// Production code imports this file, never the generated implementation and
// never build-time catalogue configuration.

export {
  LEARNING_SEQUENCES,
  CURRICULUM_MODULES,
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getCurriculumModuleById,
  getCurriculumChapterById,
  getLearningSequenceById,
  getLearningSequenceForChapter,
  getPrimaryLearningSequenceForSubject,
  isChapterAvailable,
  getOrderedAvailableChapters,
} from './generated/curriculum/learnerCurriculum.js'
