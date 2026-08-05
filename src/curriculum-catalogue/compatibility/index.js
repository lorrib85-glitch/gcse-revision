// ─── Runtime compatibility projection — loader and contract ────────────────
//
// BUILD-TIME ONLY, and temporary. `runtime-v1.js` holds the data; this file
// states what it is allowed to be, when each part of it dies, and proves both.
//
// The compatibility layer is NOT a curriculum entity type. `RECORD_TYPES` and
// `CURRICULUM_ENTITY_TYPES` in `../schema.js` list six, and none of them lives
// here. That separation is the whole point: a fact in `records/` is curriculum
// and outlives the migration; a fact in `compatibility/` is scaffolding for the
// pre-cutover runtime interface and is deleted with it.

import { checkSerialisable } from '../schema.js'

import runtimeV1 from './runtime-v1.js'

export const COMPATIBILITY_VERSION = 'runtime-v1'

/**
 * The stage that deletes each compatibility field.
 *
 * Rule: no compatibility field may exist without a death date. A field with no
 * entry here fails validation, so "temporary" cannot decay into "permanent" by
 * omission.
 *
 * ── Every field dies at Stage 6, and the reason is sequencing ───────────────
 *
 * An earlier draft dated most of these Stage 5, on the grounds that the Stage 5
 * canonical navigation projection supersedes them. Superseding is not the same
 * as retiring. Stage 5 migrates ONE consumer — the subject browser — while
 * `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` keep their
 * compatibility shape for `progress.js`, `chapterNavigation.js`,
 * `dailyPlanner.js`, `todaysPlan.js`, `Progress.jsx`, `LegacyApp.jsx`,
 * `ChapterCompleteScreen.jsx`, `ChapterPlayer.jsx` and `contentHierarchy.js`.
 * Deleting a field at Stage 5 would change the shape of an export those nine
 * still consume — with only the browser migrated, that is an unguarded runtime
 * change dressed up as cleanup.
 *
 * So the corrected sequence is:
 *
 *   Stage 4 — the compatibility projection becomes load-bearing: the three
 *             runtime files re-export the generated output.
 *   Stage 5 — canonical navigation is ADDED. The compatibility projection
 *             stays intact for every legacy runtime export.
 *   Stage 6 — every remaining legacy runtime consumer is migrated or removed,
 *             and only then is each compatibility field deleted.
 *
 * `FINAL_CONSUMERS` below records, per field, which consumers survive the
 * Stage 5 browser migration — that is what sets the stage, not the browser.
 */
export const DELETION_STAGES = {
  legacyModules: 6,
  hiddenChapter: 6,
  chapterFields: 6,
  'chapterFields.number': 6,
  'chapterFields.series': 6,
  'chapterFields.color': 6,
  'chapterFields.colorLight': 6,
  'chapterFields.facetTags': 6,
  chapterOrder: 6,
  loaderSectionAnchors: 6,
  excludedChapterIds: 6,
}

/** The three runtime exports the compatibility projection feeds. */
export const RUNTIME_BOUNDARY_FILES = [
  'src/data/modules.js',
  'src/chapters.js',
  'src/content/chapterContentRegistry.js',
]

/** Consumers the Stage 5 browser migration removes. Naming a field's only reader here is not enough to retire it. */
export const STAGE_5_CONSUMERS = [
  'src/features/subjects/Subjects.jsx',
]

/**
 * Why each field cannot die at Stage 5 — the consumers that outlive it.
 *
 * `stage5Consumers` is what the Stage 5 navigation projection takes over.
 * `survivingConsumers` is what still reads the fact, or still receives the row
 * shape carrying it, after that migration. A field is retired when
 * `survivingConsumers` is empty, and no earlier — which is Stage 6 for all of
 * them today.
 *
 * A `survivingConsumers` entry may be one of the `RUNTIME_BOUNDARY_FILES`
 * itself. That is not a placeholder: two fields (`series`, `colorLight`) have
 * no reader left once the browser migrates, but are still emitted into the
 * `CHAPTERS` rows that the nine legacy consumers receive. Removing a key from a
 * load-bearing legacy export is a change to that export, and it waits for the
 * export to go.
 */
export const FINAL_CONSUMERS = {
  legacyModules: {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: [
      'src/progress.js',
      'src/app/chapterNavigation.js',
      'src/features/planner/dailyPlanner.js',
      'src/components/layout/ChapterPlayer.jsx',
    ],
    reason: 'The seven legacy MODULES rows are read by progress totals, next-chapter resolution, '
      + 'the daily planner and the chapter player. Stage 5 migrates none of them.',
  },
  chapterOrder: {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: [
      'src/progress.js',
      'src/app/chapterNavigation.js',
      'src/app/LegacyApp.jsx',
      'src/features/planner/dailyPlanner.js',
      'src/todaysPlan.js',
      'src/features/progress/Progress.jsx',
      'src/components/layout/ChapterCompleteScreen.jsx',
      'src/data/contentHierarchy.js',
    ],
    reason: 'chapterOrder decides which rows CHAPTERS contains and in what order. Eight consumers '
      + 'beyond the browser iterate that array for progress, planning and navigation.',
  },
  loaderSectionAnchors: {
    stage5Consumers: [],
    survivingConsumers: ['src/app/LegacyApp.jsx', 'src/components/layout/ChapterPlayer.jsx'],
    reason: 'Loader key order is never read by the browser. It is the CHAPTER_CONTENT_LOADERS '
      + 'shape the app shell and the chapter player load chapters through.',
  },
  chapterFields: {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: ['src/chapters.js'],
    reason: 'The container. It dies when its last sub-field does, and every sub-field is Stage 6.',
  },
  'chapterFields.number': {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: ['src/components/layout/ChapterPlayer.jsx'],
    reason: 'ChapterPlayer falls back to chapter.number when a chapter is opened outside a module '
      + 'group, so the browser is not its last reader.',
  },
  'chapterFields.series': {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: ['src/chapters.js'],
    reason: 'The browser IS its only reader, and it migrates at Stage 5 — but series is still a key '
      + 'on 39 CHAPTERS rows that eight other consumers receive, so the key waits for CHAPTERS.',
  },
  'chapterFields.color': {
    stage5Consumers: [],
    survivingConsumers: ['src/components/layout/ChapterPlayer.jsx', 'src/app/chapterNavigation.js'],
    reason: 'The subject browser did not read chapter.color. It remains the per-chapter accent the player themes with and the completion '
      + 'screen falls back to. Neither migrates at Stage 5.',
  },
  'chapterFields.colorLight': {
    stage5Consumers: [],
    survivingConsumers: ['src/chapters.js'],
    reason: 'No production reader today — it is carried on 59 CHAPTERS rows and nothing destructures '
      + 'it. Still a key on a load-bearing legacy export, so it goes when that export does.',
  },
  'chapterFields.facetTags': {
    stage5Consumers: [],
    survivingConsumers: ['src/chapters.js'],
    reason: 'The facet prefix of CHAPTERS[].tags. Its planned successor is a concept query replacing '
      + 'the hand-maintained TAG_CHAPTER_MAP, which is Stage 6 work.',
  },
  hiddenChapter: {
    stage5Consumers: [],
    survivingConsumers: ['src/data/chapterProgress.js', 'src/content/chapterContentRegistry.js'],
    reason: 'The Renaissance id is a live progress destination through LEGACY_CHAPTER_ID_MAP and '
      + 'still needs a loader. It cannot go until that map does.',
  },
  excludedChapterIds: {
    stage5Consumers: ['src/features/subjects/Subjects.jsx'],
    survivingConsumers: ['src/progress.js', 'src/todaysPlan.js', 'src/features/planner/dailyPlanner.js'],
    reason: 'Dropping the exclusion adds six chapters to CHAPTERS and to eng_macbeth. That moves '
      + 'progress percentages and daily plans, not just which cards the browser draws.',
  },
}

/** Fields a canonical chapter record owns. Compatibility must never restate one. */
export const CANONICAL_CHAPTER_FIELDS = [
  'id', 'title', 'subtitle', 'era', 'icon', 'headerImage',
  'status', 'contentPath', 'conceptIds', 'requirementIds', 'estimatedMinutes',
]

const CHAPTER_FIELD_KEYS = ['number', 'series', 'color', 'colorLight', 'facetTags']
const LEGACY_MODULE_KEYS = ['id', 'title', 'canonicalModuleIds']
const HIDDEN_KEYS = ['insertAfter', 'contentPath', 'supersededBy', 'reason', 'row']

// A concept id is `subject:course:concept`. A facet tag is `facet:value`. The
// concept portion of `tags` is canonical, so a concept-shaped string appearing
// in `facetTags` would be exactly the duplication rule 4 forbids.
const CONCEPT_SHAPED = /^[a-z-]+:[a-z-]+:/

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

/**
 * Shape and self-consistency of the compatibility data, with no catalogue.
 * Returns every problem rather than throwing on the first.
 */
export function validateCompatibility(compatibility) {
  const problems = []
  if (!isPlainObject(compatibility)) return ['compatibility must be an object']

  // ── Every field names the stage that deletes it ─────────────────────────
  for (const key of Object.keys(compatibility)) {
    if (!(key in DELETION_STAGES)) {
      problems.push(`compatibility field "${key}" does not name the stage that deletes it (add it to DELETION_STAGES)`)
    }
  }

  const { legacyModules, hiddenChapter, chapterFields, chapterOrder, loaderSectionAnchors, excludedChapterIds } = compatibility

  // ── Legacy modules ──────────────────────────────────────────────────────
  if (!Array.isArray(legacyModules) || legacyModules.length === 0) {
    problems.push('compatibility.legacyModules must be a non-empty array')
  } else {
    const seen = new Set()
    const claimed = new Map()
    for (const legacy of legacyModules) {
      if (!isPlainObject(legacy)) { problems.push('compatibility.legacyModules entry must be an object'); continue }
      for (const key of Object.keys(legacy)) {
        if (!LEGACY_MODULE_KEYS.includes(key)) problems.push(`legacyModule "${legacy.id}" has unknown key "${key}"`)
      }
      if (!isNonEmptyString(legacy.id)) problems.push('legacyModule.id must be a non-empty string')
      if (seen.has(legacy.id)) problems.push(`legacyModule "${legacy.id}" is declared twice`)
      seen.add(legacy.id)
      if (legacy.title !== null && !isNonEmptyString(legacy.title)) {
        problems.push(`legacyModule "${legacy.id}".title must be a non-empty string, or null to derive it`)
      }
      if (!Array.isArray(legacy.canonicalModuleIds) || legacy.canonicalModuleIds.length === 0) {
        problems.push(`legacyModule "${legacy.id}" must aggregate at least one canonical module`)
        continue
      }
      if (legacy.title === null && legacy.canonicalModuleIds.length > 1) {
        problems.push(`legacyModule "${legacy.id}" aggregates ${legacy.canonicalModuleIds.length} modules, so its title cannot be derived`)
      }
      for (const moduleId of legacy.canonicalModuleIds) {
        const owner = claimed.get(moduleId)
        if (owner) problems.push(`canonical module "${moduleId}" is aggregated by both "${owner}" and "${legacy.id}"`)
        claimed.set(moduleId, legacy.id)
      }
    }
  }

  // ── The hidden chapter ──────────────────────────────────────────────────
  if (!isPlainObject(hiddenChapter)) {
    problems.push('compatibility.hiddenChapter must be an object')
  } else {
    for (const key of Object.keys(hiddenChapter)) {
      if (!HIDDEN_KEYS.includes(key)) problems.push(`hiddenChapter has unknown key "${key}"`)
    }
    if (!isNonEmptyString(hiddenChapter.contentPath) || !hiddenChapter.contentPath.startsWith('src/content/')) {
      problems.push('hiddenChapter.contentPath must be a src/content/… path — a binding with no path binds nothing')
    }
    if (!isNonEmptyString(hiddenChapter.reason)) {
      problems.push('hiddenChapter.reason must say why this id is not a chapter')
    }
    if (!isPlainObject(hiddenChapter.row)) {
      problems.push('hiddenChapter.row must be the full runtime row — nothing canonical exists to derive it from')
    } else {
      // The two derived fields must NOT be stated: they come off the content
      // file for this row exactly as they do for the other 59.
      for (const derived of ['screenCount', 'screenTags']) {
        if (derived in hiddenChapter.row) {
          problems.push(`hiddenChapter.row must not state "${derived}" — it is derived from contentPath`)
        }
      }
      if (hiddenChapter.row.availability !== 'hidden') {
        problems.push('hiddenChapter.row.availability must be "hidden" — a visible row would be a learner-visible change')
      }
    }
  }

  // ── Chapter order ───────────────────────────────────────────────────────
  if (!Array.isArray(chapterOrder) || chapterOrder.length === 0) {
    problems.push('compatibility.chapterOrder must be a non-empty array')
  } else if (new Set(chapterOrder).size !== chapterOrder.length) {
    problems.push('compatibility.chapterOrder contains a duplicate id')
  }

  // ── Legacy-only chapter fields ──────────────────────────────────────────
  if (!isPlainObject(chapterFields)) {
    problems.push('compatibility.chapterFields must be an object keyed by chapter id')
  } else {
    for (const [chapterId, fields] of Object.entries(chapterFields)) {
      if (!isPlainObject(fields)) { problems.push(`chapterFields["${chapterId}"] must be an object`); continue }
      for (const key of Object.keys(fields)) {
        if (CANONICAL_CHAPTER_FIELDS.includes(key)) {
          problems.push(`chapterFields["${chapterId}"] restates canonical field "${key}"`)
        } else if (!CHAPTER_FIELD_KEYS.includes(key)) {
          problems.push(`chapterFields["${chapterId}"] has unknown key "${key}"`)
        }
      }
      if (!Number.isInteger(fields.number)) {
        problems.push(`chapterFields["${chapterId}"].number must be an integer`)
      }
      if ('series' in fields && !isNonEmptyString(fields.series)) {
        problems.push(`chapterFields["${chapterId}"].series must be a non-empty string when present`)
      }
      for (const key of ['color', 'colorLight']) {
        if (!isNonEmptyString(fields[key])) problems.push(`chapterFields["${chapterId}"].${key} must be a non-empty string`)
      }
      for (const tag of fields.facetTags ?? []) {
        if (CONCEPT_SHAPED.test(tag)) {
          problems.push(`chapterFields["${chapterId}"].facetTags contains concept id "${tag}" — concepts are canonical`)
        }
      }
    }
  }

  // ── Loader section anchors partition the chapter order ──────────────────
  if (!Array.isArray(loaderSectionAnchors) || loaderSectionAnchors.length === 0) {
    problems.push('compatibility.loaderSectionAnchors must be a non-empty array')
  } else if (Array.isArray(chapterOrder)) {
    const positions = loaderSectionAnchors.map(id => chapterOrder.indexOf(id))
    if (positions.some(index => index < 0)) {
      problems.push('compatibility.loaderSectionAnchors names an id that is not in chapterOrder')
    } else if (!positions.includes(0)) {
      problems.push('compatibility.loaderSectionAnchors must include the first id of chapterOrder')
    } else if (new Set(positions).size !== positions.length) {
      problems.push('compatibility.loaderSectionAnchors names the same section twice')
    }
  }

  // ── Exclusions ──────────────────────────────────────────────────────────
  if (!Array.isArray(excludedChapterIds)) {
    problems.push('compatibility.excludedChapterIds must be an array')
  } else if (Array.isArray(chapterOrder)) {
    for (const id of excludedChapterIds) {
      if (chapterOrder.includes(id)) problems.push(`chapter "${id}" is both excluded and in chapterOrder`)
    }
  }

  checkSerialisable(problems, 'compatibility', compatibility)
  return problems
}

/**
 * Cross-checks against the canonical catalogue: the part that proves this file
 * is projection INPUT rather than a competing authority.
 */
export function checkCompatibility(catalogue, compatibility) {
  const problems = []
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const subjectById = new Map(catalogue.subjects.map(record => [record.id, record]))
  const chapterById = new Map(catalogue.chapters.map(record => [record.id, record]))

  // ── Legacy modules aggregate real canonical modules ─────────────────────
  for (const legacy of compatibility.legacyModules) {
    const aggregated = []
    for (const moduleId of legacy.canonicalModuleIds) {
      const module = moduleById.get(moduleId)
      if (!module) {
        problems.push(`legacyModule "${legacy.id}" aggregates unknown canonical module "${moduleId}"`)
        continue
      }
      aggregated.push(module)
    }
    if (aggregated.length !== legacy.canonicalModuleIds.length) continue

    // Subject is DERIVED, so the aggregated modules have to agree on one.
    const subjectIds = [...new Set(aggregated.map(module => module.subjectId))]
    if (subjectIds.length !== 1) {
      problems.push(`legacyModule "${legacy.id}" aggregates modules from ${subjectIds.length} subjects — its subject is not derivable`)
    } else if (!subjectById.has(subjectIds[0])) {
      problems.push(`legacyModule "${legacy.id}" resolves to subject "${subjectIds[0]}", which has no record`)
    }

    // A declared title must not repeat a derivable one.
    if (legacy.title !== null && aggregated.length === 1 && aggregated[0].title === legacy.title) {
      problems.push(
        `legacyModule "${legacy.id}" declares the title its single canonical module already states — `
        + 'set it to null and derive it',
      )
    }
  }

  // ── The hidden chapter is genuinely not a chapter ───────────────────────
  const hidden = compatibility.hiddenChapter
  if (chapterById.has(hidden.row?.id)) {
    problems.push(
      `hiddenChapter "${hidden.row.id}" also has a chapter record — `
      + 'compatibility describes ids the curriculum does NOT own',
    )
  }
  for (const chapter of catalogue.chapters) {
    if (chapter.contentPath === hidden.contentPath) {
      problems.push(`content path "${hidden.contentPath}" is bound by both chapter "${chapter.id}" and the hidden row`)
    }
  }
  if (hidden.supersededBy !== null && !chapterById.has(hidden.supersededBy)) {
    problems.push(`hiddenChapter is superseded by "${hidden.supersededBy}", which has no chapter record`)
  }
  if (!compatibility.chapterOrder.includes(hidden.insertAfter)) {
    problems.push(`hiddenChapter.insertAfter "${hidden.insertAfter}" is not in chapterOrder`)
  }

  // ── Every projected id resolves; every canonical chapter is accounted for ─
  const hiddenId = hidden.row?.id
  for (const id of compatibility.chapterOrder) {
    if (id === hiddenId) continue
    if (!chapterById.has(id)) problems.push(`chapterOrder names "${id}", which has no chapter record`)
  }
  for (const id of compatibility.excludedChapterIds) {
    if (!chapterById.has(id)) problems.push(`excludedChapterIds names "${id}", which has no chapter record`)
  }

  // The completeness gate. Every canonical chapter is either projected or
  // explicitly excluded — never silently dropped.
  const projected = new Set(compatibility.chapterOrder)
  const excluded = new Set(compatibility.excludedChapterIds)
  for (const chapter of catalogue.chapters) {
    if (chapter.status === 'retired') continue
    if (projected.has(chapter.id) || excluded.has(chapter.id)) continue
    problems.push(
      `canonical chapter "${chapter.id}" is neither projected nor explicitly excluded — `
      + 'Stage 3 must account for every chapter',
    )
  }

  // ── Legacy-only fields cover exactly the projected non-hidden rows ───────
  for (const id of compatibility.chapterOrder) {
    if (id === hiddenId) continue
    if (!(id in compatibility.chapterFields)) problems.push(`chapterFields has no entry for projected chapter "${id}"`)
  }
  for (const id of Object.keys(compatibility.chapterFields)) {
    if (!projected.has(id)) problems.push(`chapterFields has an entry for "${id}", which is not projected`)
    if (id === hiddenId) problems.push('chapterFields must not carry the hidden row — hiddenChapter.row states it in full')
  }

  return problems
}

/** Load the compatibility projection and assert it is valid on its own terms. */
export function loadCompatibility() {
  const problems = validateCompatibility(runtimeV1)
  if (problems.length) {
    throw new Error(`runtime compatibility projection is invalid:\n  - ${problems.join('\n  - ')}`)
  }
  return runtimeV1
}
