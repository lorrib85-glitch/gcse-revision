// ─── Curriculum catalogue — assembled, cross-checked ───────────────────────
//
// BUILD-TIME ONLY. `loadCatalogue.js` validates each record in isolation; this
// file validates the relationships BETWEEN records — the part a per-record
// validator structurally cannot see.
//
// Nothing in the learner runtime may import this. The runtime's side of the
// boundary is the generated projections, which arrive at Stage 3.

import { loadRecords } from './loadCatalogue.js'
import { referenceIsLive, SUBJECT_IDS } from './schema.js'

/**
 * Cross-record integrity. Returns every problem rather than throwing on the
 * first, so one run tells you everything that is wrong.
 */
export function checkIntegrity(catalogue) {
  const problems = []
  const { boards, subjects, specifications, pathways, modules, chapters } = catalogue

  const byId = records => new Map(records.map(record => [record.id, record]))
  const boardById = byId(boards)
  const subjectById = byId(subjects)
  const specificationById = byId(specifications)
  const moduleById = byId(modules)
  const chapterById = byId(chapters)

  // ── Ids are unique within each level ──────────────────────────────────────
  for (const [collection, records] of Object.entries(catalogue)) {
    const seen = new Set()
    for (const record of records) {
      if (seen.has(record.id)) problems.push(`${collection}: duplicate id "${record.id}"`)
      seen.add(record.id)
    }
  }

  // ── …and across the levels that share an id namespace ─────────────────────
  //
  // Boards, specifications, pathways and modules are all referenced by bare id
  // from other records, so one id must never mean two things (DESIGN.md §4.1
  // rule 5). Subjects and chapters are excluded deliberately: a subject id is a
  // fixed vocabulary and a chapter id is preserved verbatim from the runtime,
  // so neither can be renamed to resolve a clash that does not exist.
  const crossLevel = new Map()
  for (const collection of ['boards', 'specifications', 'pathways', 'modules']) {
    for (const record of catalogue[collection]) {
      const existing = crossLevel.get(record.id)
      if (existing) {
        problems.push(`id "${record.id}" is used by both ${existing} and ${collection}`)
      }
      crossLevel.set(record.id, collection)
    }
  }

  // ── Specification → board, subjects ───────────────────────────────────────
  for (const specification of specifications) {
    if (boards.length > 0 && !boardById.has(specification.boardId)) {
      problems.push(`specification "${specification.id}" references unknown board "${specification.boardId}"`)
    }
    for (const subjectId of specification.subjectIds) {
      if (!SUBJECT_IDS.includes(subjectId)) {
        problems.push(`specification "${specification.id}" references unknown subject "${subjectId}"`)
        continue
      }
      // Subject records arrive at Stage 2. Until then the canonical vocabulary
      // is the authority; once they exist, every reference must resolve to one.
      if (subjects.length > 0 && !subjectById.has(subjectId)) {
        problems.push(`specification "${specification.id}" references subject "${subjectId}", which has no record`)
      }
    }
  }

  // A subject must never carry the reverse edge. Coverage is not ownership: if
  // a subject listed its specifications, Combined Science would have to pick
  // one of Biology, Chemistry or Physics to belong to (D-2).
  for (const subject of subjects) {
    for (const key of ['specificationIds', 'specifications', 'pathwayIds', 'moduleIds']) {
      if (key in subject) {
        problems.push(`subject "${subject.id}" must not own "${key}" — coverage is not ownership (D-2)`)
      }
    }
  }

  // ── Persisted progress names resolve to one subject, or to none ───────────
  //
  // OD-1. A legacy alias is exclusive: if two subjects claimed `'English'`,
  // reading an old row would mean picking one at random, and fabricated
  // progress is worse than absent progress. An unattributed name is the
  // opposite claim — known legacy, deliberately resolving to nobody — so it
  // may be listed by several subjects but must never be an alias anywhere.
  const aliasOwner = new Map()
  for (const subject of subjects) {
    for (const name of subject.legacyProgressNames ?? []) {
      const existing = aliasOwner.get(name)
      if (existing) {
        problems.push(
          `legacy progress name "${name}" is claimed by both "${existing}" and "${subject.id}" — `
          + 'an alias that resolves to two subjects resolves to neither (OD-1)',
        )
      } else {
        aliasOwner.set(name, subject.id)
      }
    }
  }
  for (const subject of subjects) {
    for (const name of subject.unattributedProgressNames ?? []) {
      const owner = aliasOwner.get(name)
      if (owner) {
        problems.push(
          `progress name "${name}" is unattributed on "${subject.id}" but a legacy alias of "${owner}" — `
          + 'it cannot both resolve to a subject and to none (OD-1)',
        )
      }
    }
  }

  // ── Study pathway → specification, modules ────────────────────────────────
  for (const pathway of pathways) {
    const specification = specificationById.get(pathway.specificationId)
    if (!specification) {
      problems.push(`pathway "${pathway.id}" references unknown specification "${pathway.specificationId}"`)
    } else {
      if (pathway.tier !== null && !specification.tiers.includes(pathway.tier)) {
        problems.push(`pathway "${pathway.id}" is ${pathway.tier} but its specification does not offer that tier`)
      }
      if (pathway.tier === null && specification.tiers.length > 0) {
        problems.push(`pathway "${pathway.id}" has no tier but its specification is tiered`)
      }
      const groupIds = specification.selectionGroups.map(group => group.id)
      for (const groupId of Object.keys(pathway.selections)) {
        if (!groupIds.includes(groupId)) {
          problems.push(`pathway "${pathway.id}" selects for unknown selection group "${groupId}"`)
        }
      }
      for (const group of specification.selectionGroups) {
        if (group.required && !(group.id in pathway.selections)) {
          problems.push(`pathway "${pathway.id}" does not resolve required selection group "${group.id}"`)
        }
      }
    }

    for (const ref of pathway.moduleRefs) {
      const module = moduleById.get(ref.moduleId)
      if (!module) {
        problems.push(`pathway "${pathway.id}" references unknown module "${ref.moduleId}"`)
        continue
      }
      // A retired module must not be reachable from a live pathway, or the
      // retirement is a label the learner never feels.
      if (!referenceIsLive(pathway.status, module.status)) {
        problems.push(`pathway "${pathway.id}" (${pathway.status}) references retired module "${module.id}"`)
      }
      if (ref.selectionGroup && specification) {
        const groupIds = specification.selectionGroups.map(group => group.id)
        if (!groupIds.includes(ref.selectionGroup)) {
          problems.push(
            `pathway "${pathway.id}" module ref "${ref.moduleId}" names selection group `
            + `"${ref.selectionGroup}", which its specification does not define`,
          )
        }
      }
    }
  }

  // ── Module → subject, specifications, papers, requirements, chapters ──────
  for (const module of modules) {
    if (subjects.length > 0 && !subjectById.has(module.subjectId)) {
      problems.push(`module "${module.id}" references subject "${module.subjectId}", which has no record`)
    }

    for (const ref of module.specRefs) {
      const specification = specificationById.get(ref.specificationId)
      if (!specification) {
        problems.push(`module "${module.id}" references unknown specification "${ref.specificationId}"`)
        continue
      }
      const paperIds = specification.papers.map(paper => paper.id)
      for (const paperId of ref.paperIds) {
        if (!paperIds.includes(paperId)) {
          problems.push(`module "${module.id}" references paper "${paperId}", which is not in "${specification.id}"`)
        }
      }
      const requirementIds = specification.requirements.map(requirement => requirement.id)
      for (const requirementId of ref.requirementIds) {
        if (!requirementIds.includes(requirementId)) {
          problems.push(`module "${module.id}" references requirement "${requirementId}", which is not in "${specification.id}"`)
        }
      }
    }

    for (const ref of module.chapterRefs) {
      const chapter = chapterById.get(ref.chapterId)
      if (!chapter) {
        problems.push(`module "${module.id}" references unknown chapter "${ref.chapterId}"`)
        continue
      }
      if (!referenceIsLive(module.status, chapter.status)) {
        problems.push(`module "${module.id}" (${module.status}) references retired chapter "${chapter.id}"`)
      }
    }
  }

  // ── A chapter belongs to exactly one module ───────────────────────────────
  const owners = new Map()
  for (const module of modules) {
    for (const ref of module.chapterRefs) {
      const existing = owners.get(ref.chapterId)
      if (existing) {
        problems.push(`chapter "${ref.chapterId}" belongs to both "${existing}" and "${module.id}"`)
      } else {
        owners.set(ref.chapterId, module.id)
      }
    }
  }
  for (const chapter of chapters) {
    if (chapter.status === 'retired') continue
    if (!owners.has(chapter.id)) {
      problems.push(`chapter "${chapter.id}" is ${chapter.status} but belongs to no module`)
    }
  }

  // ── Chapter → requirements ────────────────────────────────────────────────
  const allRequirementIds = new Set(
    specifications.flatMap(specification => specification.requirements.map(requirement => requirement.id)),
  )
  for (const chapter of chapters) {
    for (const requirementId of chapter.requirementIds) {
      if (!allRequirementIds.has(requirementId)) {
        problems.push(`chapter "${chapter.id}" references unknown requirement "${requirementId}"`)
      }
    }
  }

  return problems
}

/** Load the catalogue and assert it is internally consistent. */
export async function loadCatalogue() {
  const catalogue = await loadRecords()
  const problems = checkIntegrity(catalogue)
  if (problems.length) {
    throw new Error(`curriculum catalogue integrity failed:\n  - ${problems.join('\n  - ')}`)
  }
  return catalogue
}

export { LAYOUT, RECORDS_DIR, listAllRecordFiles } from './loadCatalogue.js'
