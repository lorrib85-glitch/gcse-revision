#!/usr/bin/env node
// ─── Curriculum catalogue generator ────────────────────────────────────────
//
// Renders docs/curriculum/SPECIFICATION_CATALOGUE.md from the records in
// src/curriculum-catalogue/records/. Deterministic: same records in, same bytes
// out. No timestamps, no environment reads, no absolute paths.
//
//   pnpm curriculum:generate   write the document
//   pnpm curriculum:check      compare the committed document byte-for-byte
//
// The document is generated output. Edit a record, not the markdown.
//
// This generator produces BUILD-TIME DOCUMENTATION ONLY. It does not emit
// MODULES, CHAPTERS or content loaders — those are Stage 3 projections, and
// until then the runtime keeps its hand-authored files untouched.
//
// Verification provenance (source, URL, date checked) is documentation. It
// never enters a runtime projection.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { loadCatalogue } from '../src/curriculum-catalogue/index.js'
import { OVERALL_SCOPE, resolveWeighting, weightingScopes } from '../src/curriculum-catalogue/schema.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const OUTPUT_PATH = 'docs/curriculum/SPECIFICATION_CATALOGUE.md'

const SUBJECT_TITLES = {
  'mathematics': 'Mathematics',
  'biology': 'Biology',
  'chemistry': 'Chemistry',
  'physics': 'Physics',
  'history': 'History',
  'english-language': 'English Language',
  'english-literature': 'English Literature',
  'sociology': 'Sociology',
  'drama': 'Drama',
  'music': 'Music',
}

const ASSESSMENT_TYPE_LABELS = {
  'written-exam': 'Written exam',
  'nea-practical': 'NEA (practical)',
  'nea-endorsement': 'NEA (separately reported endorsement)',
}

const COVERAGE_LABELS = {
  none: 'None — requirement mapping belongs to the module/chapter phase',
  partial: '**Partial** — an explicitly incomplete set, not a complete one',
  complete: 'Complete',
}

const SCOPE_LABELS = {
  [OVERALL_SCOPE]: 'Weighting',
  foundation: 'Foundation',
  higher: 'Higher',
}

const escape = value => String(value).replace(/\|/g, '\\|')
const subjectTitle = id => SUBJECT_TITLES[id] ?? id
const minutes = value => (value == null ? '—' : `${value} min`)
const marks = value => (value == null ? '—' : String(value))
const scopeLabel = scope => SCOPE_LABELS[scope] ?? scope
const percentage = value => (value == null ? '—' : `${value}%`)

function renderHeader(lines, catalogue) {
  const { boards, specifications } = catalogue
  lines.push('# Specification catalogue')
  lines.push('')
  lines.push('> **GENERATED FILE — do not edit.**')
  lines.push('> Source: `src/curriculum-catalogue/records/`, rendered by')
  lines.push('> `scripts/generate-curriculum-catalogue.mjs`. Run `pnpm curriculum:generate`')
  lines.push('> after changing a record; `pnpm curriculum:check` fails if this file has drifted.')
  lines.push('')
  lines.push('Every fact below is authored in exactly one record and verified against the')
  lines.push("board's own published material. Verification provenance is build-time")
  lines.push('documentation and never reaches the learner runtime.')
  lines.push('')
  lines.push(`**${boards.length}** exam ${boards.length === 1 ? 'board' : 'boards'} · `
    + `**${specifications.length}** ${specifications.length === 1 ? 'specification' : 'specifications'}`)
  lines.push('')
}

function renderBoards(lines, boards) {
  lines.push('## Exam boards')
  lines.push('')
  if (boards.length === 0) {
    lines.push('_No board records yet._')
    lines.push('')
    return
  }
  lines.push('| Id | Official name | Short name | Verified |')
  lines.push('|---|---|---|---|')
  for (const board of [...boards].sort((a, b) => a.id.localeCompare(b.id))) {
    lines.push(
      `| \`${board.id}\` | ${escape(board.name)} | ${escape(board.shortName)} `
      + `| [${board.provenance.verifiedOn}](${board.provenance.sourceUrl}) |`,
    )
  }
  lines.push('')
}

function renderSummary(lines, specifications, boards) {
  const boardName = id => boards.find(board => board.id === id)?.shortName ?? id
  lines.push('## Specifications at a glance')
  lines.push('')
  if (specifications.length === 0) {
    lines.push('_No specification records yet._')
    lines.push('')
    return
  }
  lines.push('| Specification | Board | Code | Subjects covered | Tiers | Papers | Requirements |')
  lines.push('|---|---|---|---|---:|---:|---|')
  for (const spec of specifications) {
    const subjects = spec.subjectIds.map(subjectTitle).join(', ')
    const tiers = spec.tiers.length ? spec.tiers.join(' / ') : 'untiered'
    lines.push(
      `| ${escape(spec.title)} | ${escape(boardName(spec.boardId))} | \`${spec.code}\` `
      + `| ${escape(subjects)} | ${tiers} | ${spec.papers.length} | ${spec.requirementCoverage} |`,
    )
  }
  lines.push('')
}

function renderSpecification(lines, spec, boards) {
  const board = boards.find(candidate => candidate.id === spec.boardId)
  lines.push(`## ${spec.title}`)
  lines.push('')
  lines.push(`\`${spec.id}\``)
  lines.push('')
  lines.push('| | |')
  lines.push('|---|---|')
  lines.push(`| Board | ${escape(board?.name ?? spec.boardId)} |`)
  lines.push(`| Specification code | \`${spec.code}\` |`)
  lines.push(`| Qualification | ${spec.qualification.toUpperCase()} |`)
  lines.push(`| Subjects covered | ${escape(spec.subjectIds.map(subjectTitle).join(', '))} |`)
  lines.push(`| Tiers | ${spec.tiers.length ? spec.tiers.join(' / ') : 'untiered'} |`)
  lines.push(`| First teaching | ${spec.firstTeaching ?? '—'} |`)
  lines.push(`| First assessment | ${spec.firstAssessment ?? '—'} |`)
  lines.push(`| Status | ${spec.status}${spec.withdrawnFrom ? ` (from ${spec.withdrawnFrom})` : ''} |`)
  lines.push(`| Requirement coverage | ${COVERAGE_LABELS[spec.requirementCoverage]} |`)
  lines.push('')

  lines.push('### Papers and components')
  lines.push('')
  lines.push('| # | Paper | Code | Assesses | Assessment | Duration | Marks |')
  lines.push('|---:|---|---|---|---|---|---:|')
  for (const paper of spec.papers) {
    lines.push(
      `| ${paper.position + 1} | ${escape(paper.title)} | ${paper.code ? `\`${paper.code}\`` : '—'} `
      + `| ${subjectTitle(paper.subjectId)} | ${ASSESSMENT_TYPE_LABELS[paper.assessmentType]} `
      + `| ${minutes(paper.durationMinutes)} | ${marks(paper.totalMarks)} |`,
    )
  }
  lines.push('')
  const noted = spec.papers.filter(paper => paper.note)
  for (const paper of noted) {
    lines.push(`- **${escape(paper.title)}** — ${escape(paper.note)}`)
  }
  if (noted.length) lines.push('')

  if (spec.assessmentObjectives.length) {
    // A tiered qualification whose percentages differ by tier gets a column per
    // tier; printing one number would be wrong for one of the two. When the
    // tiers agree, one column says so without repeating itself.
    const scopes = weightingScopes(spec.tiers)
    const differsByTier = scopes.length > 1 && spec.assessmentObjectives.some(ao =>
      new Set(scopes.map(scope => resolveWeighting(ao.weightings, scope))).size > 1)
    const columns = differsByTier ? scopes : [OVERALL_SCOPE]

    lines.push('### Assessment objectives')
    lines.push('')
    lines.push(`| AO | Description | ${columns.map(scopeLabel).join(' | ')} |`)
    lines.push(`|---|---|${columns.map(() => '---:').join('|')}|`)
    for (const ao of spec.assessmentObjectives) {
      const cells = columns.map(scope => percentage(resolveWeighting(ao.weightings, scope)))
      lines.push(`| \`${ao.id}\` | ${escape(ao.title)} | ${cells.join(' | ')} |`)
    }
    lines.push('')
    // A 0% objective is kept, never dropped — it is examined, it just carries no
    // weighting toward the grade. Its note is what explains that.
    const explained = spec.assessmentObjectives.filter(ao => ao.note)
    for (const ao of explained) {
      lines.push(`- \`${ao.id}\` — ${escape(ao.note)}`)
    }
    if (explained.length) lines.push('')
  }

  if (spec.selectionGroups.length) {
    lines.push('### Selections a study pathway must resolve')
    lines.push('')
    lines.push('| Selection group | Assessed in | Required |')
    lines.push('|---|---|---|')
    for (const group of spec.selectionGroups) {
      const paper = spec.papers.find(candidate => candidate.id === group.paperId)
      lines.push(
        `| \`${group.id}\` — ${escape(group.title)} | ${escape(paper?.title ?? group.paperId)} `
        + `| ${group.required ? 'yes' : 'no'} |`,
      )
    }
    lines.push('')
    lines.push('_A specification defines what must be chosen; a study pathway records what was_')
    lines.push('_chosen. No option, text or route is selected here._')
    lines.push('')
  }

  lines.push('### Verified against')
  lines.push('')
  lines.push(`- ${escape(spec.provenance.sourceName)}`)
  lines.push(`- <${spec.provenance.sourceUrl}>`)
  lines.push(`- Checked ${spec.provenance.verifiedOn}`)
  if (spec.provenance.note) lines.push(`- ${escape(spec.provenance.note)}`)
  lines.push('')
}

export function renderCatalogue(catalogue) {
  const lines = []
  const specifications = [...catalogue.specifications].sort((a, b) => a.id.localeCompare(b.id))

  renderHeader(lines, catalogue)
  renderBoards(lines, catalogue.boards)
  renderSummary(lines, specifications, catalogue.boards)

  for (const spec of specifications) {
    lines.push('---')
    lines.push('')
    renderSpecification(lines, spec, catalogue.boards)
  }

  lines.push('---')
  lines.push('')
  lines.push('## Not in this document')
  lines.push('')
  lines.push('- **Subjects, study pathways, modules and chapters** — `CURRICULUM_MAP.md`,')
  lines.push('  generated from the same records.')
  lines.push('- **Runtime `MODULES`, `CHAPTERS` and content loaders** — Stage 3 projections.')
  lines.push('  The runtime files remain hand-authored and untouched until then.')
  lines.push('- **Option, text and route selections** — a study pathway records those, not a')
  lines.push('  specification.')
  lines.push('')

  return `${lines.join('\n')}\n`
}

// ─── The curriculum map ────────────────────────────────────────────────────
//
// What a learner's route through the app actually is: subjects, the pathways
// that realise a specification, the modules those pathways reach, and the
// chapters inside them. Generated from the same records as the specification
// catalogue, and never hand-edited.

export const MAP_OUTPUT_PATH = 'docs/curriculum/CURRICULUM_MAP.md'

/**
 * Where each canonical chapter came from, for the ids that did not exist before
 * the migration.
 *
 * This is migration provenance, not a curriculum fact, so it is documentation
 * metadata rather than a record field — a record describes what a chapter *is*,
 * not what it used to be rendered as. It is not free-floating prose either:
 * `tests/architecture/curriculum-catalogue-integrity.test.js` asserts every
 * `from` is one of the retired browse-surface placeholder ids and every `to`
 * resolves to a planned chapter record, so the table cannot drift from what was
 * actually authored.
 */
export const PLACEHOLDER_MIGRATION = [
  ['cs_macbeth_2', 'english-macbeth-guilt-consequence'],
  ['cs_macbeth_3', 'english-macbeth-witches-fate'],
  ['cs_macbeth_4', 'english-macbeth-appearance-reality'],
  ['cs_inspector_1', 'english-inspector-calls-social-message'],
  ['cs_inspector_2', 'english-inspector-calls-responsibility-denial'],
  ['cs_inspector_3', 'english-inspector-calls-consequences-resolution'],
]

/** The one existing chapter id that deliberately gets no canonical record. */
export const EXCLUDED_CHAPTER = {
  id: 'history-medicine-renaissance-medicine',
  reason: 'The superseded Renaissance bundle: hidden from every learner surface and succeeded '
    + 'by `history-medicine-vesalius-beginning-doubt`. Its id stays reachable through '
    + '`LEGACY_CHAPTER_ID_MAP` in `src/data/chapterProgress.js`, which already folds `mod2` '
    + 'progress forward onto it. A `retired` chapter record would put it back in the catalogue '
    + 'as a chapter, which is exactly what it is not.',
}

const STATUS_MARK = { available: '●', active: '●', planned: '○', retired: '×' }

function renderSubjects(lines, subjects) {
  lines.push('## Subjects')
  lines.push('')
  lines.push('A subject is a stable academic discipline. It owns no specification, no module and')
  lines.push('no chapter — coverage runs the other way. `themeKey` **references**')
  lines.push('`src/constants/subjects.js`; the palette is not the identity, which is why two')
  lines.push('subjects can share one theme.')
  lines.push('')
  lines.push('| Subject | Title | Theme key | Status | Resolves persisted | Unattributed |')
  lines.push('|---|---|---|---|---|---|')
  for (const subject of subjects) {
    const owned = subject.legacyProgressNames.length
      ? subject.legacyProgressNames.map(name => `\`${name}\``).join(', ')
      : '—'
    const unattributed = subject.unattributedProgressNames.length
      ? subject.unattributedProgressNames.map(name => `\`${name}\``).join(', ')
      : '—'
    lines.push(
      `| \`${subject.id}\` | ${escape(subject.title)} | \`${subject.themeKey}\` `
      + `| ${subject.status} | ${owned} | ${unattributed} |`,
    )
  }
  lines.push('')
  const unattributed = [...new Set(subjects.flatMap(subject => subject.unattributedProgressNames))]
  if (unattributed.length) {
    lines.push(`**Unattributed progress names** — ${unattributed.map(name => `\`${name}\``).join(', ')}. `
      + 'Persisted before the subjects were separated, so no rule can recover which one a row')
    lines.push('meant. Listed by every candidate subject precisely so all of them decline it: the')
    lines.push('rows stay stored, stay readable and count toward no subject average. Guessing would')
    lines.push('fabricate learner data, and fabricated progress is worse than absent progress.')
    lines.push('')
  }
}

function renderPathways(lines, catalogue) {
  const { pathways, specifications } = catalogue
  const specById = new Map(specifications.map(spec => [spec.id, spec]))
  lines.push('## Study pathways')
  lines.push('')
  lines.push('A pathway is the exact route a learner follows: one specification, one tier, and the')
  lines.push('choices a school made. Tier lives here and nowhere else — moving Foundation → Higher')
  lines.push('changes the pathway, and every chapter already finished keeps its progress.')
  lines.push('')
  lines.push('| Pathway | Specification | Tier | Modules | Status |')
  lines.push('|---|---|---|---:|---|')
  for (const pathway of pathways) {
    const spec = specById.get(pathway.specificationId)
    lines.push(
      `| \`${pathway.id}\` | ${escape(spec?.title ?? pathway.specificationId)} `
      + `| ${pathway.tier ?? 'untiered'} | ${pathway.moduleRefs.length} `
      + `| ${STATUS_MARK[pathway.status]} ${pathway.status} |`,
    )
  }
  lines.push('')

  const choosing = pathways.filter(pathway => Object.keys(pathway.selections).length > 0)
  if (choosing.length) {
    lines.push('### Selections')
    lines.push('')
    lines.push('The specification states what must be chosen; the pathway states what was chosen.')
    lines.push('`—` is a **stated absence**: the group is required and nothing has been chosen for')
    lines.push('it. An omitted row would be a forgotten question instead.')
    lines.push('')
    lines.push('| Pathway | Selection group | Chosen |')
    lines.push('|---|---|---|')
    for (const pathway of choosing) {
      for (const [group, choice] of Object.entries(pathway.selections)) {
        lines.push(`| \`${pathway.shortTitle}\` | \`${group}\` | ${choice ? `\`${choice}\`` : '—'} |`)
      }
    }
    lines.push('')
  }
}

/** Modules reached by more than one pathway, or mapped into more than one
 *  specification. Both are the point: a module is referenced, never copied. */
function renderReuse(lines, catalogue) {
  const { modules, pathways, specifications } = catalogue
  const specTitle = id => specifications.find(spec => spec.id === id)?.title ?? id
  const usedBy = new Map()
  for (const pathway of pathways) {
    for (const ref of pathway.moduleRefs) {
      if (!usedBy.has(ref.moduleId)) usedBy.set(ref.moduleId, [])
      usedBy.get(ref.moduleId).push(pathway.shortTitle)
    }
  }
  const reused = modules.filter(module =>
    (usedBy.get(module.id)?.length ?? 0) > 1 || module.specRefs.length > 1)
  lines.push('## Module reuse')
  lines.push('')
  lines.push('A module is defined once and **referenced**. Two pathways using it is never a reason')
  lines.push('to define it twice, and a module mapped into two specifications is how Combined')
  lines.push('Science and Triple Science share the same Biology teaching without either owning it.')
  lines.push('')
  if (reused.length === 0) {
    lines.push('_No module is currently shared._')
    lines.push('')
    return
  }
  lines.push('| Module | Referenced by | Mapped into |')
  lines.push('|---|---|---|')
  for (const module of reused) {
    lines.push(
      `| \`${module.id}\` | ${escape((usedBy.get(module.id) ?? []).join(', ') || '—')} `
      + `| ${escape(module.specRefs.map(ref => specTitle(ref.specificationId)).join(' · '))} |`,
    )
  }
  lines.push('')
}

function renderModulesAndChapters(lines, catalogue) {
  const { modules, chapters, subjects, pathways } = catalogue
  const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]))
  const orderedFor = subjectId => {
    // Modules in the order the pathways reach them, so the document reads in
    // journey order rather than in whatever order the filesystem produced.
    const seen = []
    for (const pathway of pathways) {
      for (const ref of pathway.moduleRefs) {
        const module = modules.find(candidate => candidate.id === ref.moduleId)
        if (module?.subjectId === subjectId && !seen.includes(module)) seen.push(module)
      }
    }
    for (const module of modules) {
      if (module.subjectId === subjectId && !seen.includes(module)) seen.push(module)
    }
    return seen
  }

  lines.push('## Modules and chapters')
  lines.push('')
  lines.push('Ordering lives on the **relationship**, never on the entity: a chapter\'s position is')
  lines.push('a property of the module reference that includes it. `●` available · `○` planned.')
  lines.push('')
  for (const subject of subjects) {
    const owned = orderedFor(subject.id)
    if (owned.length === 0) continue
    lines.push(`### ${escape(subject.title)}`)
    lines.push('')
    for (const module of owned) {
      const built = module.chapterRefs.filter(ref =>
        chapterById.get(ref.chapterId)?.status === 'available').length
      lines.push(`#### ${STATUS_MARK[module.status]} ${escape(module.title)}`)
      lines.push('')
      lines.push(`\`${module.id}\` · ${module.status} · ${module.chapterRefs.length} `
        + `${module.chapterRefs.length === 1 ? 'chapter' : 'chapters'}`
        + (module.chapterRefs.length ? ` (${built} available)` : ''))
      lines.push('')
      lines.push(escape(module.presentation.shortDescription))
      lines.push('')
      if (module.chapterRefs.length === 0) {
        lines.push('_Planned. No chapters are invented to fill it._')
        lines.push('')
        continue
      }
      lines.push('| # | Chapter | Id | Status | Content |')
      lines.push('|---:|---|---|---|---|')
      for (const ref of module.chapterRefs) {
        const chapter = chapterById.get(ref.chapterId)
        const content = chapter.contentPath ? `\`${chapter.contentPath}\`` : '—'
        lines.push(
          `| ${ref.position + 1} | ${escape(chapter.title)} | \`${chapter.id}\` `
          + `| ${STATUS_MARK[chapter.status]} ${chapter.status} | ${content} |`,
        )
      }
      lines.push('')
    }
  }
}

function renderMigration(lines, catalogue) {
  const chapterById = new Map(catalogue.chapters.map(chapter => [chapter.id, chapter]))
  lines.push('## Legacy and placeholder treatment')
  lines.push('')
  lines.push('### Placeholder cards that became chapters')
  lines.push('')
  lines.push('These were coming-soon cards synthesised by the browser: a real authored title and')
  lines.push('subtitle, but no chapter record, no loader and no progress. They are now planned')
  lines.push('chapter records with stable semantic ids. **No progress alias is created**, because')
  lines.push('a `cs_*` card was never openable and therefore never a progress identity — an alias')
  lines.push('would imply learner data that cannot exist.')
  lines.push('')
  lines.push('| Retired card | Canonical chapter | Title |')
  lines.push('|---|---|---|')
  for (const [from, to] of PLACEHOLDER_MIGRATION) {
    lines.push(`| \`${from}\` | \`${to}\` | ${escape(chapterById.get(to)?.title ?? '—')} |`)
  }
  lines.push('')
  lines.push('### An existing chapter id that gets no record')
  lines.push('')
  lines.push(`\`${EXCLUDED_CHAPTER.id}\` — ${escape(EXCLUDED_CHAPTER.reason)}`)
  lines.push('')
  lines.push('Preserved is not the same as given a record. Every other current chapter id is')
  lines.push('carried verbatim, including the ones that break the naming rules (`soc1`, `math1`,')
  lines.push('`bio_building_blocks`, `sci_bio_w1`, `spain-new-world-1`), because each backs a live')
  lines.push('`gcse_chapter_<id>` progress key. A tidier id is not worth a learner\'s progress.')
  lines.push('')
}

export function renderCurriculumMap(catalogue) {
  const { subjects, pathways, modules, chapters } = catalogue
  const available = chapters.filter(chapter => chapter.status === 'available').length
  const lines = []

  lines.push('# Curriculum map')
  lines.push('')
  lines.push('> **GENERATED FILE — do not edit.**')
  lines.push('> Source: `src/curriculum-catalogue/records/`, rendered by')
  lines.push('> `scripts/generate-curriculum-catalogue.mjs`. Run `pnpm curriculum:generate`')
  lines.push('> after changing a record; `pnpm curriculum:check` fails if this file has drifted.')
  lines.push('')
  lines.push('Boards, specifications, papers and assessment objectives live in')
  lines.push('`SPECIFICATION_CATALOGUE.md`, generated from the same records.')
  lines.push('')
  lines.push(`**${subjects.length}** subjects · **${pathways.length}** study pathways · `
    + `**${modules.length}** modules · **${chapters.length}** chapters `
    + `(**${available}** available, **${chapters.length - available}** planned)`)
  lines.push('')
  lines.push('**No runtime projection exists yet.** This document and the specification catalogue')
  lines.push('are build-time documentation. `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS`')
  lines.push('remain hand-authored and untouched.')
  lines.push('')

  renderSubjects(lines, subjects)
  renderPathways(lines, catalogue)
  renderReuse(lines, catalogue)
  renderModulesAndChapters(lines, catalogue)
  renderMigration(lines, catalogue)

  return `${lines.join('\n')}\n`
}

/** Every document this generator owns, keyed by the path it writes. */
export async function generate() {
  const catalogue = await loadCatalogue()
  return {
    [OUTPUT_PATH]: renderCatalogue(catalogue),
    [MAP_OUTPUT_PATH]: renderCurriculumMap(catalogue),
  }
}

const isDirectRun = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  const documents = await generate()
  const checking = process.argv.includes('--check')

  for (const [path, generated] of Object.entries(documents)) {
    const target = resolve(ROOT, path)
    if (!checking) {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, generated)
      console.log(`curriculum:generate — wrote ${path}`)
      continue
    }
    let committed = null
    try {
      committed = readFileSync(target, 'utf8')
    } catch {
      console.error(`curriculum:check — ${path} is missing. Run \`pnpm curriculum:generate\`.`)
      process.exit(1)
    }
    if (committed !== generated) {
      console.error(
        `curriculum:check — ${path} is out of date with `
        + 'src/curriculum-catalogue/records/. Run `pnpm curriculum:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`curriculum:check — ${path} matches the catalogue.`)
  }
}
