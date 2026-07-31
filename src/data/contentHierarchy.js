import { getChapterAvailability, CHAPTER_AVAILABILITY } from '../chapters.js'

export const CONTENT_LEVELS = Object.freeze({
  SUBJECT: 'subject',
  MODULE: 'module',
  CHAPTER: 'chapter',
  SCREEN: 'screen',
  COMPONENT: 'component',
})

export const CONTENT_HIERARCHY = Object.freeze([
  CONTENT_LEVELS.SUBJECT,
  CONTENT_LEVELS.MODULE,
  CONTENT_LEVELS.CHAPTER,
  CONTENT_LEVELS.SCREEN,
  CONTENT_LEVELS.COMPONENT,
])

export function validateContentHierarchy({ chapters = [], modules = [] } = {}) {
  const errors = []
  const chapterById = new Map()
  const moduleIds = new Set()
  const chapterOwners = new Map()

  for (const chapter of chapters) {
    if (!chapter?.id) {
      errors.push('Chapter metadata contains an entry without an id')
      continue
    }

    if (chapterById.has(chapter.id)) {
      errors.push(`Duplicate chapter id "${chapter.id}"`)
      continue
    }

    chapterById.set(chapter.id, chapter)
  }

  for (const module of modules) {
    if (!module?.id) {
      errors.push('Module metadata contains an entry without an id')
      continue
    }

    if (moduleIds.has(module.id)) {
      errors.push(`Duplicate module id "${module.id}"`)
    }
    moduleIds.add(module.id)

    if (!Array.isArray(module.chapterIds) || module.chapterIds.length === 0) {
      errors.push(`Module "${module.id}" must contain at least one chapter id`)
      continue
    }

    const localIds = new Set()

    for (const chapterId of module.chapterIds) {
      if (localIds.has(chapterId)) {
        errors.push(`Module "${module.id}" contains chapter "${chapterId}" more than once`)
        continue
      }
      localIds.add(chapterId)

      const chapter = chapterById.get(chapterId)
      if (!chapter) {
        errors.push(`Module "${module.id}" references unknown chapter "${chapterId}"`)
        continue
      }

      const existingOwner = chapterOwners.get(chapterId)
      if (existingOwner && existingOwner !== module.id) {
        errors.push(
          `Chapter "${chapterId}" belongs to both "${existingOwner}" and "${module.id}"`,
        )
      } else {
        chapterOwners.set(chapterId, module.id)
      }

      if (module.subject && chapter.subject && module.subject !== chapter.subject) {
        errors.push(
          `Module "${module.id}" is ${module.subject} but chapter "${chapterId}" is ${chapter.subject}`,
        )
      }
    }
  }

  // Reverse direction: a chapter the learner can see must have exactly one
  // parent. Ownership is what gives a chapter its position in the journey —
  // completion hand-off, the planner and continue-chapter all resolve through
  // MODULES, so an orphan drops out of all three while still being browsable.
  // An explicitly hidden chapter (superseded or migration entry) is the only
  // permitted exemption; availability metadata already carries that meaning, so
  // no separate allowlist exists.
  for (const [chapterId, chapter] of chapterById) {
    const availability = getChapterAvailability(chapter)
    if (availability === CHAPTER_AVAILABILITY.HIDDEN) continue
    if (chapterOwners.has(chapterId)) continue
    errors.push(`Chapter "${chapterId}" is ${availability} but belongs to no module`)
  }

  return errors
}
