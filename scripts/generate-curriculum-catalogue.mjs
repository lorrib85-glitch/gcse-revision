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
  lines.push('## Not in this catalogue')
  lines.push('')
  lines.push('- **Subjects, study pathways, modules and chapters** — Stage 2.')
  lines.push('- **Runtime `MODULES`, `CHAPTERS` and content loaders** — Stage 3 projections.')
  lines.push('  The runtime files remain hand-authored and untouched until then.')
  lines.push('- **Option, text and route selections** — a study pathway records those, not a')
  lines.push('  specification.')
  lines.push('')

  return `${lines.join('\n')}\n`
}

export async function generate() {
  return renderCatalogue(await loadCatalogue())
}

const isDirectRun = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  const target = resolve(ROOT, OUTPUT_PATH)
  const generated = await generate()

  if (process.argv.includes('--check')) {
    let committed = null
    try {
      committed = readFileSync(target, 'utf8')
    } catch {
      console.error(`curriculum:check — ${OUTPUT_PATH} is missing. Run \`pnpm curriculum:generate\`.`)
      process.exit(1)
    }
    if (committed !== generated) {
      console.error(
        `curriculum:check — ${OUTPUT_PATH} is out of date with `
        + 'src/curriculum-catalogue/records/. Run `pnpm curriculum:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`curriculum:check — ${OUTPUT_PATH} matches the catalogue.`)
  } else {
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, generated)
    console.log(`curriculum:generate — wrote ${OUTPUT_PATH}`)
  }
}
