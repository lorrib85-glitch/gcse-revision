// ─── Curriculum catalogue schema ───────────────────────────────────────────
//
// BUILD-TIME GOVERNANCE DATA. This directory is never imported by the learner
// runtime — `tests/architecture/curriculum-catalogue-integrity.test.js` proves
// it by sweeping the filesystem, not by consulting an allowlist.
//
// One curriculum fact is authored in exactly one record. Everything the runtime
// eventually needs is a deterministic projection of these records, never a
// second authored copy. See docs/decisions/0002-canonical-curriculum-architecture.md
// and .planning/phase-5-curriculum-architecture/DESIGN.md.
//
// The model is RELATIONAL, not a tree:
//   a Specification covers one or more Subjects   (Combined Science covers three)
//   a Study pathway realises exactly one Specification
//   a Module has exactly one primary Subject and is referenced by many pathways
//   a Chapter belongs to exactly one Module
// Ordering lives on the relationship records, never on the entities.
//
// This schema deliberately does NOT own, and must never learn about:
//   - component identity, screen/block authoring types, routing → component catalogue
//   - chapter lifecycle, gates, completion                       → ChapterPlayer
//   - concept identity                                           → src/data/learningGraph
//   - progress keys                                              → src/data/chapterProgress.js
//   - palettes and imagery values                                → src/constants/**

// ─── Closed vocabularies ────────────────────────────────────────────────────

/**
 * The canonical academic disciplines (DESIGN.md §3.1).
 *
 * A vocabulary entry is NOT a record. `drama` and `music` are listed because
 * they are canonical disciplines; OD-7 settled that neither gets a subject,
 * specification, pathway or module record until its first module is ready.
 * Listing an id here creates nothing.
 *
 * This is also the staged mechanism that lets Stage 1 author specifications
 * before Stage 2 authors subject records: `subjectIds` validates against this
 * vocabulary, so no placeholder subject record has to be invented to satisfy a
 * validator. Once subject records exist the loader additionally requires every
 * referenced id to resolve to one.
 */
export const SUBJECT_IDS = [
  'mathematics',
  'biology',
  'chemistry',
  'physics',
  'history',
  'english-language',
  'english-literature',
  'sociology',
  'drama',
  'music',
]

export const QUALIFICATIONS = ['gcse']

export const TIERS = ['foundation', 'higher']

// How a paper or component is assessed. `nea-endorsement` is separately
// reported and does not contribute to the qualification grade (AQA English
// Language Spoken Language); it is not a written paper wearing a disguise.
export const ASSESSMENT_TYPES = ['written-exam', 'nea-practical', 'nea-endorsement']

export const SUBJECT_STATUSES = ['active', 'planned']
export const SPECIFICATION_STATUSES = ['current', 'withdrawn']
export const PATHWAY_STATUSES = ['active', 'planned', 'retired']
export const MODULE_STATUSES = ['active', 'planned', 'retired']
export const CHAPTER_STATUSES = ['available', 'planned', 'retired']

// A pathway or module id may be referenced only by something at least as
// "live" as it is. See `referenceIsLive`.
export const RETIRED_STATUSES = ['retired']

// How completely a specification's requirement set has been authored. A record
// must say so honestly rather than letting an empty or partial list imply
// completeness (Stage 1 authors `none` for every specification).
export const REQUIREMENT_COVERAGE = ['none', 'partial', 'complete']

export const PATHWAY_SCOPES = ['catalogue', 'installation']

// Fields Phase 5A rejected for having no demonstrated requirement (D-13), plus
// the one OD-8 permanently forbids. Unknown keys are rejected anyway; these are
// named so the error says *why* rather than "unknown key".
export const REJECTED_FIELDS = {
  'assessmentObjective.weighting': 'a weighting must name the scope it describes — use weightings: { overall } or one entry per tier',
  'module.tier': 'tier is a study-pathway property, never a module property (D-13)',
  'chapterRef.required': 'deferred: no surface distinguishes required from optional chapters (D-13, OD-6)',
  'chapterRef.availabilityOverride': 'deferred: chapter.status covers every current case (D-13, OD-6)',
  'moduleRef.availabilityOverride': 'deferred: no demonstrated requirement (D-13, OD-6)',
  'subject.browsable': 'browser visibility is derived from configured pathways, never authored (OD-8)',
  'subject.specificationIds': 'a subject does not own specifications — Combined Science forbids it (D-2)',
  'subject.moduleIds': 'a subject does not list its modules (DESIGN.md §3.1)',
  'chapter.subject': 'a chapter reaches its subject through its module (DESIGN.md §3.5)',
  'chapter.screenCount': 'derived from the content file, never authored (D-10)',
  'chapter.screenTags': 'derived from the content file, never authored (D-10)',
  'chapter.series': 'replaced by module membership (DESIGN.md §3.5)',
  'chapter.number': 'replaced by position on the chapter reference (D-5)',
}

// A record must not name a component, a screen type or the component catalogue.
// The two domains share a pattern and no authority (D-1).
const COMPONENT_DOMAIN_KEYS = [
  'component', 'componentId', 'componentName',
  'screenType', 'blockType', 'authoringType', 'screenRegistry',
]

// ─── Primitives ─────────────────────────────────────────────────────────────

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
// Existing chapter ids are preserved verbatim (D-8) and several break kebab
// case: `soc1`, `math1`, `bio_building_blocks`, `sci_bio_w1`. A stable id may
// therefore carry underscores and digits — but never a path, a space or a case
// change, because those are the things that make an id stop being an id.
const STABLE_ID = /^[a-z0-9]+([-_][a-z0-9]+)*$/
// A year, or a year-month. Kept as a string so no Date object can enter a
// record and make it non-serialisable.
const YEAR_OR_MONTH = /^\d{4}(-\d{2})?$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

const isStringArray = value => Array.isArray(value) && value.every(isNonEmptyString)

const isNonNegativeInteger = value => Number.isInteger(value) && value >= 0

/** An id must never encode an implementation path (DESIGN.md §4.1 rule 4). */
function looksLikePath(value) {
  return typeof value === 'string'
    && (value.includes('/') || value.includes('\\') || value.includes('.js') || value.startsWith('.'))
}

function checkId(errors, label, value, { pattern = KEBAB } = {}) {
  if (!isNonEmptyString(value)) {
    errors.push(`${label} must be a non-empty string`)
    return
  }
  if (looksLikePath(value)) {
    errors.push(`${label} must not be an implementation path (got "${value}")`)
    return
  }
  if (!pattern.test(value)) {
    errors.push(`${label} must be a stable lowercase id (got "${value}")`)
  }
}

/**
 * Reject unknown keys, with a specific reason for the fields Phase 5A rejected.
 * Strictness is the point: a schema that silently accepts an extra field is a
 * schema that lets a second authority grow inside a record.
 */
function checkKeys(errors, typeName, value, allowed) {
  const allowedSet = new Set(allowed)
  for (const key of Object.keys(value)) {
    if (allowedSet.has(key)) continue
    const reason = REJECTED_FIELDS[`${typeName}.${key}`]
    errors.push(
      reason
        ? `${typeName}.${key} is a rejected field: ${reason}`
        : `${typeName}.${key} is not a known field`,
    )
  }
  for (const key of COMPONENT_DOMAIN_KEYS) {
    if (key in value) {
      errors.push(`${typeName}.${key} names the component domain, which the curriculum catalogue may never reference (D-1)`)
    }
  }
}

/**
 * Records are plain serialisable data (DESIGN.md §6.2). No functions, no
 * getters, no symbols, no Date objects, no class instances — because anything
 * that cannot survive JSON cannot survive being generated into a projection.
 */
export function checkSerialisable(errors, label, value, seen = new Set()) {
  const type = typeof value
  if (value === null || type === 'string' || type === 'boolean') return
  if (type === 'number') {
    if (!Number.isFinite(value)) errors.push(`${label} must be a finite number`)
    return
  }
  if (type === 'function') { errors.push(`${label} must not be a function`); return }
  if (type === 'symbol') { errors.push(`${label} must not be a symbol`); return }
  if (type === 'bigint') { errors.push(`${label} must not be a bigint`); return }
  if (type === 'undefined') { errors.push(`${label} must not be undefined — omit the key instead`); return }

  if (seen.has(value)) { errors.push(`${label} is circular`); return }
  seen.add(value)

  if (Array.isArray(value)) {
    value.forEach((item, i) => checkSerialisable(errors, `${label}[${i}]`, item, seen))
    return
  }
  if (!isPlainObject(value)) {
    errors.push(`${label} must be a plain object (got ${Object.prototype.toString.call(value)})`)
    return
  }
  for (const [key, item] of Object.entries(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor && typeof descriptor.get === 'function') {
      errors.push(`${label}.${key} must not be a getter`)
      continue
    }
    checkSerialisable(errors, `${label}.${key}`, item, seen)
  }
}

/**
 * Positions on a relationship list: non-negative integers, unique, and in
 * ascending array order so the authored file reads in the order it means.
 */
function checkPositions(errors, label, entries) {
  const seen = new Set()
  let previous = -1
  entries.forEach((entry, i) => {
    const position = entry?.position
    if (!isNonNegativeInteger(position)) {
      errors.push(`${label}[${i}].position must be a non-negative integer`)
      return
    }
    if (seen.has(position)) {
      errors.push(`${label}[${i}].position ${position} is used more than once`)
    }
    seen.add(position)
    if (position <= previous) {
      errors.push(`${label}[${i}].position ${position} must come after ${previous} — the list is its own order`)
    }
    previous = position
  })
}

// ─── Nested records ─────────────────────────────────────────────────────────

const PROVENANCE_KEYS = ['sourceName', 'sourceUrl', 'verifiedOn', 'note']

/**
 * Where a record's facts came from and when they were checked. Build-time only:
 * provenance never enters a runtime projection.
 */
function validateProvenance(errors, label, provenance) {
  if (!isPlainObject(provenance)) {
    errors.push(`${label} must be an object`)
    return
  }
  checkKeys(errors, 'provenance', provenance, PROVENANCE_KEYS)
  if (!isNonEmptyString(provenance.sourceName)) {
    errors.push(`${label}.sourceName must name the official document or page`)
  }
  if (!isNonEmptyString(provenance.sourceUrl) || !/^https:\/\//.test(provenance.sourceUrl)) {
    errors.push(`${label}.sourceUrl must be an https URL`)
  }
  if (!ISO_DATE.test(provenance.verifiedOn ?? '')) {
    errors.push(`${label}.verifiedOn must be an ISO date (YYYY-MM-DD)`)
  }
  if ('note' in provenance && !isNonEmptyString(provenance.note)) {
    errors.push(`${label}.note must be a non-empty string when present`)
  }
}

const PAPER_KEYS = [
  'id', 'code', 'title', 'position', 'subjectId', 'assessmentType',
  'durationMinutes', 'totalMarks', 'tier', 'selectionGroupIds', 'note',
]

function validatePaper(errors, label, paper, { specificationId, subjectIds, tiers }) {
  if (!isPlainObject(paper)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'paper', paper, PAPER_KEYS)

  checkId(errors, `${label}.id`, paper.id)
  if (isNonEmptyString(paper.id) && specificationId && !paper.id.startsWith(`${specificationId}-`)) {
    errors.push(`${label}.id must be scoped to its specification ("${specificationId}-…")`)
  }
  if (!isNonEmptyString(paper.title)) errors.push(`${label}.title must be a non-empty string`)
  if ('code' in paper && !isNonEmptyString(paper.code)) {
    errors.push(`${label}.code must be a non-empty string when present`)
  }
  if (!ASSESSMENT_TYPES.includes(paper.assessmentType)) {
    errors.push(`${label}.assessmentType must be one of ${ASSESSMENT_TYPES.join(' | ')}`)
  }

  // A paper names the discipline it assesses. This is what lets one Combined
  // Science specification carry six papers across three subjects (D-2).
  if (!SUBJECT_IDS.includes(paper.subjectId)) {
    errors.push(`${label}.subjectId must be a canonical subject id`)
  } else if (subjectIds && !subjectIds.includes(paper.subjectId)) {
    errors.push(
      `${label}.subjectId "${paper.subjectId}" is not covered by its specification `
      + `(${subjectIds.join(', ')})`,
    )
  }

  if ('durationMinutes' in paper && !(Number.isInteger(paper.durationMinutes) && paper.durationMinutes > 0)) {
    errors.push(`${label}.durationMinutes must be a positive integer when present`)
  }
  if ('totalMarks' in paper && !(Number.isInteger(paper.totalMarks) && paper.totalMarks > 0)) {
    errors.push(`${label}.totalMarks must be a positive integer when present`)
  }
  if ('tier' in paper && paper.tier !== null && !TIERS.includes(paper.tier)) {
    errors.push(`${label}.tier must be null or one of ${TIERS.join(' | ')}`)
  }
  if ('tier' in paper && TIERS.includes(paper.tier) && tiers && !tiers.includes(paper.tier)) {
    errors.push(`${label}.tier "${paper.tier}" is not offered by its specification`)
  }
  if ('selectionGroupIds' in paper && !isStringArray(paper.selectionGroupIds)) {
    errors.push(`${label}.selectionGroupIds must be an array of ids`)
  }
  if ('note' in paper && !isNonEmptyString(paper.note)) {
    errors.push(`${label}.note must be a non-empty string when present`)
  }
}

const AO_KEYS = ['id', 'title', 'weightings', 'note']

/**
 * The scope of a weighting that applies to the whole qualification.
 *
 * A tiered specification may still use it — AQA Biology weights AO1/AO2/AO3 at
 * 40/40/20 in both tiers, and writing that number twice would be one fact with
 * two homes. It is only forbidden alongside per-tier scopes, because a record
 * that states both is a record that does not know which one is true.
 */
export const OVERALL_SCOPE = 'overall'

/**
 * The scopes a specification's weightings must resolve for: every tier it
 * declares, or `overall` alone when it is untiered.
 */
export function weightingScopes(tiers) {
  return Array.isArray(tiers) && tiers.length > 0 ? [...tiers] : [OVERALL_SCOPE]
}

/**
 * One objective's weighting at one scope, or `null` if the record does not
 * state it. Never defaults to a number: an invented percentage is the failure
 * this whole shape exists to prevent.
 */
export function resolveWeighting(weightings, scope) {
  if (!isPlainObject(weightings)) return null
  if (scope in weightings) return weightings[scope]
  if (OVERALL_SCOPE in weightings) return weightings[OVERALL_SCOPE]
  return null
}

/**
 * A weighting set is scoped, exhaustive and exclusive.
 *
 * `weighting: number` could not describe two real qualifications: AQA
 * Mathematics weights its objectives differently by tier (50/25/25 Foundation,
 * 40/30/30 Higher), and AQA English Language has three objectives — AO7–AO9,
 * examined through the Spoken Language endorsement — that are valid and worth
 * 0% of the grade. So a weighting states WHICH scope it describes, a record
 * must state every scope its specification declares and no others, and 0 is a
 * legitimate percentage while a missing one is not.
 */
function validateWeightings(errors, label, weightings, { tiers }) {
  if (!isPlainObject(weightings)) {
    errors.push(`${label} must be an object of scope → percentage`)
    return
  }
  const scopes = Object.keys(weightings)
  if (scopes.length === 0) {
    errors.push(`${label} must state at least one scope`)
    return
  }

  const perTier = scopes.filter(scope => scope !== OVERALL_SCOPE)
  if (scopes.includes(OVERALL_SCOPE) && perTier.length > 0) {
    errors.push(
      `${label} must not mix "overall" with per-tier scopes — a weighting is `
      + 'stated once, at one scope',
    )
  }

  // Unknown, un-offered and missing scopes are one fault in three shapes: the
  // set does not match the scopes the specification actually declares. A
  // half-stated set is the dangerous one — it still reads as complete.
  if (tiers) {
    const allowed = [OVERALL_SCOPE, ...tiers]
    for (const scope of perTier) {
      if (!allowed.includes(scope)) {
        errors.push(`${label}.${scope}: "${scope}" is not a scope this specification offers `
          + `(${allowed.join(', ')})`)
      }
    }
    if (perTier.length > 0) {
      for (const tier of tiers) {
        if (!scopes.includes(tier)) errors.push(`${label} does not state a weighting for "${tier}"`)
      }
    }
  }

  for (const [scope, value] of Object.entries(weightings)) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
      errors.push(`${label}.${scope} must be a percentage from 0 to 100`)
    }
  }
}

function validateAssessmentObjective(errors, label, ao, { tiers }) {
  if (!isPlainObject(ao)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'assessmentObjective', ao, AO_KEYS)
  checkId(errors, `${label}.id`, ao.id)
  if (!isNonEmptyString(ao.title)) errors.push(`${label}.title must be a non-empty string`)
  validateWeightings(errors, `${label}.weightings`, ao.weightings, { tiers })
  if ('note' in ao && !isNonEmptyString(ao.note)) {
    errors.push(`${label}.note must be a non-empty string when present`)
  }
}

const SELECTION_GROUP_KEYS = ['id', 'title', 'paperId', 'required', 'note']

function validateSelectionGroup(errors, label, group, { paperIds }) {
  if (!isPlainObject(group)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'selectionGroup', group, SELECTION_GROUP_KEYS)
  checkId(errors, `${label}.id`, group.id)
  if (!isNonEmptyString(group.title)) errors.push(`${label}.title must be a non-empty string`)
  if (typeof group.required !== 'boolean') errors.push(`${label}.required must be a boolean`)
  if (!isNonEmptyString(group.paperId)) {
    errors.push(`${label}.paperId must name the paper the choice is assessed in`)
  } else if (paperIds && !paperIds.includes(group.paperId)) {
    errors.push(`${label}.paperId "${group.paperId}" is not a paper of this specification`)
  }
  if ('note' in group && !isNonEmptyString(group.note)) {
    errors.push(`${label}.note must be a non-empty string when present`)
  }
}

const REQUIREMENT_KEYS = ['id', 'code', 'statement', 'paperIds', 'tier', 'conceptIds']

/**
 * A specification requirement is mandated coverage, not a teachable knowledge
 * atom — which is why it is its own entity and not a concept (D-7). `conceptIds`
 * is the join to the learning graph; the catalogue stores the ids as strings and
 * never imports the graph, so no runtime dependency is created.
 */
function validateRequirement(errors, label, requirement, { specificationId, paperIds, tiers }) {
  if (!isPlainObject(requirement)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'requirement', requirement, REQUIREMENT_KEYS)

  checkId(errors, `${label}.id`, requirement.id, { pattern: STABLE_ID })
  if (isNonEmptyString(requirement.id) && specificationId && !requirement.id.startsWith(`${specificationId}-`)) {
    errors.push(`${label}.id must be scoped to its specification ("${specificationId}-…")`)
  }
  if (!isNonEmptyString(requirement.code)) errors.push(`${label}.code must be the official reference`)
  if (!isNonEmptyString(requirement.statement)) {
    errors.push(`${label}.statement must be a concise paraphrase of the requirement`)
  }
  if (!isStringArray(requirement.paperIds) || requirement.paperIds.length === 0) {
    errors.push(`${label}.paperIds must name at least one paper`)
  } else if (paperIds) {
    for (const paperId of requirement.paperIds) {
      if (!paperIds.includes(paperId)) {
        errors.push(`${label}.paperIds contains "${paperId}", which is not a paper of this specification`)
      }
    }
  }
  if ('tier' in requirement && requirement.tier !== null && !TIERS.includes(requirement.tier)) {
    errors.push(`${label}.tier must be null or one of ${TIERS.join(' | ')}`)
  }
  if (TIERS.includes(requirement.tier) && tiers && !tiers.includes(requirement.tier)) {
    errors.push(`${label}.tier "${requirement.tier}" is not offered by its specification`)
  }
  if ('conceptIds' in requirement && !isStringArray(requirement.conceptIds)) {
    errors.push(`${label}.conceptIds must be an array of learning-graph concept ids`)
  }
}

const PRESENTATION_KEYS = ['heroImage', 'shortDescription']

function validatePresentation(errors, label, presentation) {
  if (!isPlainObject(presentation)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'presentation', presentation, PRESENTATION_KEYS)
  if (presentation.heroImage !== null && !isNonEmptyString(presentation.heroImage)) {
    errors.push(`${label}.heroImage must be a public asset path or null`)
  }
  if (isNonEmptyString(presentation.heroImage) && !presentation.heroImage.startsWith('/images/')) {
    errors.push(`${label}.heroImage must be a /images/… public asset path`)
  }
  if (!isNonEmptyString(presentation.shortDescription)) {
    errors.push(`${label}.shortDescription must be a non-empty string`)
  }
}

// ─── Relationship records ───────────────────────────────────────────────────
//
// Ordering lives here, not on the entities (D-5). These are the shapes that
// carry `position`, and they are deliberately thin: a field without a
// demonstrated requirement is a field nobody maintains (D-13).

const MODULE_REF_KEYS = ['moduleId', 'position', 'required', 'selectionGroup']

export function validateModuleRef(errors, label, ref) {
  if (!isPlainObject(ref)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'moduleRef', ref, MODULE_REF_KEYS)
  checkId(errors, `${label}.moduleId`, ref.moduleId)
  if (!isNonNegativeInteger(ref.position)) {
    errors.push(`${label}.position must be a non-negative integer`)
  }
  if (typeof ref.required !== 'boolean') errors.push(`${label}.required must be a boolean`)
  if ('selectionGroup' in ref && ref.selectionGroup !== null) {
    checkId(errors, `${label}.selectionGroup`, ref.selectionGroup)
  }
}

const CHAPTER_REF_KEYS = ['chapterId', 'position']

export function validateChapterRef(errors, label, ref) {
  if (!isPlainObject(ref)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'chapterRef', ref, CHAPTER_REF_KEYS)
  // Chapter ids are preserved verbatim and never normalised (D-8).
  checkId(errors, `${label}.chapterId`, ref.chapterId, { pattern: STABLE_ID })
  if (!isNonNegativeInteger(ref.position)) {
    errors.push(`${label}.position must be a non-negative integer`)
  }
}

const SPEC_REF_KEYS = ['specificationId', 'paperIds', 'requirementIds']

/** How one module maps into one specification. A list, so a module can be
 *  shared by Combined and Triple Science without being defined twice. */
export function validateSpecRef(errors, label, ref) {
  if (!isPlainObject(ref)) { errors.push(`${label} must be an object`); return }
  checkKeys(errors, 'specRef', ref, SPEC_REF_KEYS)
  checkId(errors, `${label}.specificationId`, ref.specificationId)
  if (!isStringArray(ref.paperIds) || ref.paperIds.length === 0) {
    errors.push(`${label}.paperIds must name at least one paper`)
  }
  if (!isStringArray(ref.requirementIds) && !(Array.isArray(ref.requirementIds) && ref.requirementIds.length === 0)) {
    errors.push(`${label}.requirementIds must be an array of requirement ids (possibly empty)`)
  }
}

// ─── Entity records ─────────────────────────────────────────────────────────

const BOARD_KEYS = ['id', 'name', 'shortName', 'provenance']

export function validateBoard(record) {
  const errors = []
  if (!isPlainObject(record)) return ['board record must be an object']
  checkKeys(errors, 'board', record, BOARD_KEYS)
  checkId(errors, 'board.id', record.id)
  if (!isNonEmptyString(record.name)) errors.push('board.name must be the official organisation name')
  if (!isNonEmptyString(record.shortName)) errors.push('board.shortName must be a non-empty string')
  validateProvenance(errors, 'board.provenance', record.provenance)
  checkSerialisable(errors, 'board', record)
  return errors
}

const SUBJECT_KEYS = ['id', 'title', 'shortTitle', 'themeKey', 'status', 'legacyProgressNames']

export function validateSubject(record) {
  const errors = []
  if (!isPlainObject(record)) return ['subject record must be an object']
  checkKeys(errors, 'subject', record, SUBJECT_KEYS)
  checkId(errors, 'subject.id', record.id)
  if (!SUBJECT_IDS.includes(record.id)) {
    errors.push(`subject.id "${record.id}" is not a canonical discipline`)
  }
  if (!isNonEmptyString(record.title)) errors.push('subject.title must be a non-empty string')
  if (!isNonEmptyString(record.shortTitle)) errors.push('subject.shortTitle must be a non-empty string')
  // The theme is a presentation reference, not the subject's identity (D-3).
  if (!isNonEmptyString(record.themeKey)) errors.push('subject.themeKey must reference a SUBJECTS palette key')
  if (!SUBJECT_STATUSES.includes(record.status)) {
    errors.push(`subject.status must be one of ${SUBJECT_STATUSES.join(' | ')}`)
  }
  // How the read layer recognises rows persisted under an older display string
  // without rewriting any of them (OD-1).
  if (!isStringArray(record.legacyProgressNames) && record.legacyProgressNames?.length !== 0) {
    errors.push('subject.legacyProgressNames must be an array of persisted display strings (possibly empty)')
  }
  checkSerialisable(errors, 'subject', record)
  return errors
}

const SPECIFICATION_KEYS = [
  'id', 'boardId', 'qualification', 'code', 'title', 'subjectIds', 'tiers',
  'papers', 'assessmentObjectives', 'selectionGroups', 'requirements',
  'requirementCoverage', 'status', 'firstTeaching', 'firstAssessment',
  'withdrawnFrom', 'provenance',
]

export function validateSpecification(record) {
  const errors = []
  if (!isPlainObject(record)) return ['specification record must be an object']
  checkKeys(errors, 'specification', record, SPECIFICATION_KEYS)

  checkId(errors, 'specification.id', record.id)
  checkId(errors, 'specification.boardId', record.boardId)
  if (!QUALIFICATIONS.includes(record.qualification)) {
    errors.push(`specification.qualification must be one of ${QUALIFICATIONS.join(' | ')}`)
  }
  if (!isNonEmptyString(record.code)) errors.push('specification.code must be the official code')
  if (!isNonEmptyString(record.title)) errors.push('specification.title must be the official title')

  // Coverage, not ownership: a list on every specification, so Combined Science
  // needs no special case and no subject has to claim it (D-2).
  if (!isStringArray(record.subjectIds) || record.subjectIds.length === 0) {
    errors.push('specification.subjectIds must name at least one subject')
  } else {
    const seen = new Set()
    for (const subjectId of record.subjectIds) {
      if (!SUBJECT_IDS.includes(subjectId)) {
        errors.push(`specification.subjectIds contains "${subjectId}", which is not a canonical subject id`)
      }
      if (seen.has(subjectId)) {
        errors.push(`specification.subjectIds contains "${subjectId}" more than once`)
      }
      seen.add(subjectId)
    }
  }

  if (!Array.isArray(record.tiers)) {
    errors.push('specification.tiers must be an array (empty for an untiered qualification)')
  } else {
    for (const tier of record.tiers) {
      if (!TIERS.includes(tier)) {
        errors.push(`specification.tiers contains "${tier}", which is not one of ${TIERS.join(' | ')}`)
      }
    }
    if (new Set(record.tiers).size !== record.tiers.length) {
      errors.push('specification.tiers must not repeat a tier')
    }
  }

  const subjectIds = isStringArray(record.subjectIds) ? record.subjectIds : null
  const tiers = Array.isArray(record.tiers) ? record.tiers : null

  if (!Array.isArray(record.papers) || record.papers.length === 0) {
    errors.push('specification.papers must contain at least one paper or component')
  } else {
    record.papers.forEach((paper, i) => validatePaper(
      errors, `specification.papers[${i}]`, paper,
      { specificationId: record.id, subjectIds, tiers },
    ))
    checkPositions(errors, 'specification.papers', record.papers)
    assertUniqueField(errors, 'specification.papers', record.papers, 'id')
  }

  const paperIds = Array.isArray(record.papers)
    ? record.papers.map(paper => paper?.id).filter(isNonEmptyString)
    : []

  if (!Array.isArray(record.assessmentObjectives)) {
    errors.push('specification.assessmentObjectives must be an array')
  } else {
    record.assessmentObjectives.forEach((ao, i) =>
      validateAssessmentObjective(errors, `specification.assessmentObjectives[${i}]`, ao, { tiers }))
    assertUniqueField(errors, 'specification.assessmentObjectives', record.assessmentObjectives, 'id')
    // Weightings are a stated invariant: if they are authored at all they must
    // describe a whole qualification. Half a weighting set is worse than none,
    // because it looks complete.
    //
    // Checked once per scope, not once per qualification: a Higher set that
    // totals 95 would otherwise be averaged away by a correct Foundation set.
    // The tolerance is float noise only — 100 means 100.
    if (record.assessmentObjectives.length > 0) {
      for (const scope of weightingScopes(tiers)) {
        const total = record.assessmentObjectives.reduce(
          (sum, ao) => sum + (resolveWeighting(ao?.weightings, scope) ?? 0), 0)
        if (!Number.isFinite(total) || Math.abs(total - 100) > 1e-9) {
          errors.push(
            `specification.assessmentObjectives weightings must total 100% for ${scope} (got ${total})`,
          )
        }
      }
    }
  }

  if (!Array.isArray(record.selectionGroups)) {
    errors.push('specification.selectionGroups must be an array (empty when nothing is chosen)')
  } else {
    record.selectionGroups.forEach((group, i) =>
      validateSelectionGroup(errors, `specification.selectionGroups[${i}]`, group, { paperIds }))
    assertUniqueField(errors, 'specification.selectionGroups', record.selectionGroups, 'id')
  }

  if (!Array.isArray(record.requirements)) {
    errors.push('specification.requirements must be an array (empty until authored)')
  } else {
    record.requirements.forEach((requirement, i) => validateRequirement(
      errors, `specification.requirements[${i}]`, requirement,
      { specificationId: record.id, paperIds, tiers },
    ))
    assertUniqueField(errors, 'specification.requirements', record.requirements, 'id')
  }

  // The record must say how complete its requirement set is, and the claim must
  // match what is actually there. A partial set that implies completeness is
  // the specific dishonesty this field exists to prevent.
  if (!REQUIREMENT_COVERAGE.includes(record.requirementCoverage)) {
    errors.push(`specification.requirementCoverage must be one of ${REQUIREMENT_COVERAGE.join(' | ')}`)
  } else if (Array.isArray(record.requirements)) {
    const authored = record.requirements.length
    if (record.requirementCoverage === 'none' && authored > 0) {
      errors.push(`specification.requirementCoverage is "none" but ${authored} requirements are authored`)
    }
    if (record.requirementCoverage !== 'none' && authored === 0) {
      errors.push(`specification.requirementCoverage is "${record.requirementCoverage}" but no requirements are authored`)
    }
  }

  if (!SPECIFICATION_STATUSES.includes(record.status)) {
    errors.push(`specification.status must be one of ${SPECIFICATION_STATUSES.join(' | ')}`)
  }
  for (const key of ['firstTeaching', 'firstAssessment']) {
    if (record[key] !== null && !YEAR_OR_MONTH.test(record[key] ?? '')) {
      errors.push(`specification.${key} must be a year, a year-month, or null`)
    }
  }
  if (record.withdrawnFrom !== null && !YEAR_OR_MONTH.test(record.withdrawnFrom ?? '')) {
    errors.push('specification.withdrawnFrom must be a year, a year-month, or null')
  }
  // Status and withdrawal metadata must agree. A "current" specification with a
  // withdrawal date is a record that contradicts itself.
  if (record.status === 'current' && record.withdrawnFrom !== null) {
    errors.push('specification.status is "current" but withdrawnFrom is set')
  }
  if (record.status === 'withdrawn' && record.withdrawnFrom === null) {
    errors.push('specification.status is "withdrawn" but withdrawnFrom is null')
  }

  validateProvenance(errors, 'specification.provenance', record.provenance)
  checkSerialisable(errors, 'specification', record)
  return errors
}

const PATHWAY_KEYS = [
  'id', 'specificationId', 'title', 'shortTitle', 'tier',
  'selections', 'moduleRefs', 'status', 'scope',
]

export function validateStudyPathway(record) {
  const errors = []
  if (!isPlainObject(record)) return ['study pathway record must be an object']
  checkKeys(errors, 'studyPathway', record, PATHWAY_KEYS)

  checkId(errors, 'studyPathway.id', record.id)
  // Exactly one specification. A pathway that realised two would be two
  // pathways wearing one id.
  checkId(errors, 'studyPathway.specificationId', record.specificationId)
  if (!isNonEmptyString(record.title)) errors.push('studyPathway.title must be a non-empty string')
  if (!isNonEmptyString(record.shortTitle)) errors.push('studyPathway.shortTitle must be a non-empty string')
  if (record.tier !== null && !TIERS.includes(record.tier)) {
    errors.push(`studyPathway.tier must be null or one of ${TIERS.join(' | ')}`)
  }
  if (!isPlainObject(record.selections)) {
    errors.push('studyPathway.selections must be an object (empty when nothing is chosen)')
  } else {
    for (const [group, choice] of Object.entries(record.selections)) {
      checkId(errors, `studyPathway.selections["${group}"] key`, group)
      if (choice !== null && !isNonEmptyString(choice)) {
        errors.push(`studyPathway.selections["${group}"] must be a chosen id or null for unchosen`)
      }
    }
  }
  if (!Array.isArray(record.moduleRefs)) {
    errors.push('studyPathway.moduleRefs must be an array')
  } else {
    record.moduleRefs.forEach((ref, i) => validateModuleRef(errors, `studyPathway.moduleRefs[${i}]`, ref))
    checkPositions(errors, 'studyPathway.moduleRefs', record.moduleRefs)
    assertUniqueField(errors, 'studyPathway.moduleRefs', record.moduleRefs, 'moduleId')
  }
  if (!PATHWAY_STATUSES.includes(record.status)) {
    errors.push(`studyPathway.status must be one of ${PATHWAY_STATUSES.join(' | ')}`)
  }
  if (!PATHWAY_SCOPES.includes(record.scope)) {
    errors.push(`studyPathway.scope must be one of ${PATHWAY_SCOPES.join(' | ')}`)
  }
  checkSerialisable(errors, 'studyPathway', record)
  return errors
}

const MODULE_KEYS = [
  'id', 'title', 'shortTitle', 'subjectId', 'specRefs',
  'chapterRefs', 'status', 'presentation',
]

export function validateModule(record) {
  const errors = []
  if (!isPlainObject(record)) return ['module record must be an object']
  checkKeys(errors, 'module', record, MODULE_KEYS)

  checkId(errors, 'module.id', record.id)
  if (!isNonEmptyString(record.title)) errors.push('module.title must be a non-empty string')
  if (!isNonEmptyString(record.shortTitle)) errors.push('module.shortTitle must be a non-empty string')

  // Exactly one primary discipline, even when the pathway that references it
  // spans three (Combined Science).
  if (!SUBJECT_IDS.includes(record.subjectId)) {
    errors.push('module.subjectId must be exactly one canonical subject id')
  }

  if (!Array.isArray(record.specRefs) || record.specRefs.length === 0) {
    errors.push('module.specRefs must map the module into at least one specification')
  } else {
    record.specRefs.forEach((ref, i) => validateSpecRef(errors, `module.specRefs[${i}]`, ref))
    assertUniqueField(errors, 'module.specRefs', record.specRefs, 'specificationId')
  }

  if (!Array.isArray(record.chapterRefs)) {
    errors.push('module.chapterRefs must be an array (empty for a planned module)')
  } else {
    record.chapterRefs.forEach((ref, i) => validateChapterRef(errors, `module.chapterRefs[${i}]`, ref))
    checkPositions(errors, 'module.chapterRefs', record.chapterRefs)
    assertUniqueField(errors, 'module.chapterRefs', record.chapterRefs, 'chapterId')
  }

  if (!MODULE_STATUSES.includes(record.status)) {
    errors.push(`module.status must be one of ${MODULE_STATUSES.join(' | ')}`)
  }
  validatePresentation(errors, 'module.presentation', record.presentation)
  checkSerialisable(errors, 'module', record)
  return errors
}

const CHAPTER_KEYS = [
  'id', 'title', 'subtitle', 'era', 'icon', 'headerImage',
  'status', 'contentPath', 'conceptIds', 'requirementIds', 'estimatedMinutes',
]

export function validateChapter(record) {
  const errors = []
  if (!isPlainObject(record)) return ['chapter record must be an object']
  checkKeys(errors, 'chapter', record, CHAPTER_KEYS)

  // Preserved verbatim from src/chapters.js, never normalised (D-8): several
  // live ids carry underscores and digits and each one backs a progress key.
  checkId(errors, 'chapter.id', record.id, { pattern: STABLE_ID })
  if (!isNonEmptyString(record.title)) errors.push('chapter.title must be a non-empty string')
  if ('subtitle' in record && record.subtitle !== null && !isNonEmptyString(record.subtitle)) {
    errors.push('chapter.subtitle must be a non-empty string or null')
  }
  if ('era' in record && record.era !== null && !isNonEmptyString(record.era)) {
    errors.push('chapter.era must be a non-empty string or null')
  }
  if (!CHAPTER_STATUSES.includes(record.status)) {
    errors.push(`chapter.status must be one of ${CHAPTER_STATUSES.join(' | ')}`)
  }
  // The one place a path is legitimate: it is the content SOURCE, not identity.
  if (record.contentPath !== null) {
    if (!isNonEmptyString(record.contentPath) || !record.contentPath.startsWith('src/content/')) {
      errors.push('chapter.contentPath must be a src/content/… path or null when planned')
    }
  } else if (record.status === 'available') {
    errors.push('chapter.status is "available" but contentPath is null')
  }
  if (record.headerImage !== null && !isNonEmptyString(record.headerImage)) {
    errors.push('chapter.headerImage must be a public asset path or null')
  }
  if (!isStringArray(record.conceptIds) && record.conceptIds?.length !== 0) {
    errors.push('chapter.conceptIds must be an array of learning-graph concept ids')
  }
  if (!isStringArray(record.requirementIds) && record.requirementIds?.length !== 0) {
    errors.push('chapter.requirementIds must be an array of requirement ids')
  }
  if (record.estimatedMinutes !== null
    && !(Number.isInteger(record.estimatedMinutes) && record.estimatedMinutes > 0)) {
    errors.push('chapter.estimatedMinutes must be a positive integer or null')
  }
  checkSerialisable(errors, 'chapter', record)
  return errors
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function assertUniqueField(errors, label, entries, field) {
  const seen = new Set()
  entries.forEach((entry, i) => {
    const value = entry?.[field]
    if (!isNonEmptyString(value)) return
    if (seen.has(value)) errors.push(`${label}[${i}].${field} "${value}" is used more than once`)
    seen.add(value)
  })
}

/**
 * May a record with `referrerStatus` reference one with `targetStatus`?
 *
 * A retired record must never be reachable from a live one. Without this a
 * retirement is silent: the record says "retired" and the learner still gets it.
 */
export function referenceIsLive(referrerStatus, targetStatus) {
  if (!RETIRED_STATUSES.includes(targetStatus)) return true
  return RETIRED_STATUSES.includes(referrerStatus)
}

/** Every entity type the catalogue validates, with its validator. */
export const RECORD_TYPES = {
  board: validateBoard,
  subject: validateSubject,
  specification: validateSpecification,
  studyPathway: validateStudyPathway,
  module: validateModule,
  chapter: validateChapter,
}
