#!/usr/bin/env node
// ─── Component registry generator ──────────────────────────────────────────
//
// Renders docs/components/COMPONENT_REGISTRY.md from the records in
// src/component-catalogue/records/. Deterministic: same records in, same bytes
// out. No timestamps, no environment-dependent content.
//
//   pnpm catalogue:generate   write the document
//   pnpm catalogue:check      compare the committed document byte-for-byte
//
// The document is generated output. Edit a record, not the markdown.

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { loadCatalogue } from '../src/component-catalogue/loadCatalogue.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const OUTPUT_PATH = 'docs/components/COMPONENT_REGISTRY.md'

const SECTION_TITLES = {
  core: '`src/components/core/`',
  learning: '`src/components/learning/`',
  feedback: '`src/components/feedback/`',
  layout: '`src/components/layout/`',
  feature: 'Governed components outside `src/components/`',
  support: 'Support',
}

const SECTION_BLURBS = {
  core: 'Foundation components used by many others. They handle atomic UI concerns.',
  learning: 'Screen-level learning interaction components. Each is a distinct learning beat.',
  feedback: 'Question feedback and exam practice components.',
  layout: 'Chapter-level orchestration, chapter framing screens and structural shells.',
  feature: 'A component outside `src/components/**` is catalogued only when current governance already treats it as a governed standalone component. Ordinary feature screens are not catalogued.',
  support: 'Support components.',
}

const KIND_LABELS = {
  reusable: 'author-selectable component',
  runtime: 'runtime infrastructure',
  support: 'support primitive',
  feature: 'app-level feature component',
  'component-family': 'component family',
}

const HEADER = `# Component Registry

<!--
  GENERATED FILE — DO NOT EDIT.

  Every fact below is authored in src/component-catalogue/records/ and rendered
  by scripts/generate-component-catalogue.mjs. Edit the record, then run
  \`pnpm catalogue:generate\`. \`pnpm catalogue:check\` fails if this file and the
  records disagree.
-->

> **Generated file — do not edit.** Change a record in
> \`src/component-catalogue/records/\`, then run \`pnpm catalogue:generate\`.

**Scope:** every current standalone component under \`src/components/**\`, plus
any component outside that tree which current governance already treats as a
governed standalone component. Private family internals are owned by their
public record rather than listed separately.

---

## What an entry here does and does not mean

An entry means one thing: **the component exists and is documented.** This is a
catalogue, not an approval list and not a learner-reachability list.

| Question | Answered by |
|---|---|
| Does this component exist, and what is it? | this file, generated from \`src/component-catalogue/records/\` |
| May a chapter author use it in a \`screens\` array? | \`src/data/screenRegistry.js\` |
| Which pedagogical function does it serve? | \`src/data/componentFunctions.js\` |
| May its internals change without asking? | the **Contract** on each entry below |

**Phase boundary.** Runtime authoring types and pedagogical projections are
deliberately *not* duplicated here. Screen types, block types and function tags
stay in \`screenRegistry.js\` and \`componentFunctions.js\` until a later migration
phase moves them into the catalogue. Absence of a screen type is not an error.

Catalogue membership is not based on learner reachability. Component Lab or
Storybook-only components, components still under review, and
superseded-but-retained components are all catalogued. "Not routed yet" is a
status, not a defect — do not route, retire or delete a component merely
because learners cannot currently reach it.

---

## There are no locked components

A rule can be constitutional; a whole component file cannot. Every record
carries a **contract** instead:

- **criticality** — \`standard\` or \`critical\`.
- **invariants** — precise behavioural or product rules, each with honest
  evidence (an automated test, a story, or a stated review check).
- **exclusivity** — where a component is the sole implementation of an
  app-wide pattern, and what competing implementations are prohibited.
- **requires a product decision** — the *changes* that need sign-off.

Internal implementation changes that preserve a component's documented
contract are ordinary development work. Sign-off is needed only when a change
affects a documented invariant, an exclusivity rule, the public API, a learner
flow, or product identity.

---

## How to use this registry

Before building anything new, check here. If a component already covers your
use case, use it. If it doesn't quite fit, adapt it. Only build new components
for genuinely distinct learning beats.

**Decision block.** Author-selectable components carry a \`Decision\` entry — the
fast path for choosing between near-neighbour components while planning a
screen. Five fields: use when, do not use when, choose instead, content shape,
rhythm role. Where a Decision would require a product-level pedagogical
judgement that current source, stories and contracts do not settle, it is
marked *pending* rather than invented. Runtime shells, support primitives and
infrastructure carry none by design: an author never chooses between them and a
learning component.
`

function bullet(label, value) {
  return `**${label}:** ${value}`
}

function renderList(items) {
  return items.map(item => `- ${item}`).join('\n')
}

function renderEvidence(evidence) {
  return evidence.map(item => `\`${item.kind}\` — ${item.reference}`).join('; ')
}

function renderContract(contract) {
  const lines = []
  lines.push(`**Contract:** ${contract.criticality}`)

  if (contract.criticality === 'standard') {
    lines.push('')
    lines.push('No invariants or exclusivity rules are recorded. Internal changes that keep the documented behaviour are ordinary development work.')
    return lines.join('\n')
  }

  lines.push('')
  lines.push(`**Why change is costly:** ${contract.rationale}`)
  lines.push('')
  lines.push('**Invariants:**')
  lines.push('')
  for (const invariant of contract.invariants) {
    lines.push(`- \`${invariant.id}\` — ${invariant.statement}`)
    lines.push(`  - Evidence: ${renderEvidence(invariant.evidence)}`)
  }

  if (contract.exclusivity) {
    const { pattern, prohibitedAlternatives, evidence } = contract.exclusivity
    lines.push('')
    lines.push(`**Exclusivity — \`${pattern}\`:** this is the sole implementation of the pattern.`)
    lines.push('')
    lines.push('Prohibited alternatives:')
    lines.push('')
    lines.push(renderList(prohibitedAlternatives))
    lines.push('')
    lines.push(`Evidence: ${renderEvidence(evidence)}`)
  }

  lines.push('')
  lines.push('**Requires a product decision:**')
  lines.push('')
  lines.push(renderList(contract.requiresProductDecision))
  return lines.join('\n')
}

function renderDecision(decision) {
  if (!decision) return null
  const lines = ['**Decision**', '']

  if (decision.status !== 'complete') {
    lines.push(`- *${decision.status === 'pending' ? 'Pending' : 'Not applicable'}* — ${decision.note}`)
    return lines.join('\n')
  }

  lines.push(`- **Use when:** ${decision.useWhen}`)
  lines.push(`- **Do not use when:** ${decision.doNotUseWhen}`)
  lines.push(`- **Choose instead:** ${decision.chooseInstead}`)
  lines.push(`- **Content shape:** ${decision.contentShape}`)
  lines.push(`- **Rhythm role:** ${decision.rhythmRole.join(', ')}.`)
  return lines.join('\n')
}

function renderOwnership(ownership) {
  const entries = [
    ...ownership.internalDirectories.map(entry => ({ ...entry, label: 'directory' })),
    ...ownership.internalFiles.map(entry => ({ ...entry, label: 'file' })),
  ]
  if (entries.length === 0) return null

  const lines = ['**Owns these private internals:**', '']
  for (const entry of entries) {
    lines.push(`- \`${entry.path}\` (${entry.label}) — ${entry.reason}`)
  }
  return lines.join('\n')
}

function renderRecord(record) {
  const { documentation: doc } = record
  const blocks = []

  blocks.push(`### ${record.name}`)

  const identity = [
    bullet('File', `\`${record.source}\``),
    record.exportName ? bullet('Export', `\`${record.exportName}\` (named export)`) : null,
    record.outOfRootReason
      ? bullet('Why it is catalogued outside `src/components/`', record.outOfRootReason)
      : null,
    bullet('Kind', `${KIND_LABELS[record.kind]} (\`${record.kind}\`)`),
    bullet('Lifecycle', record.lifecycleReason
      ? `\`${record.lifecycle}\` — ${record.lifecycleReason}`
      : `\`${record.lifecycle}\``),
  ].filter(Boolean)
  blocks.push(identity.join('  \n'))

  blocks.push(bullet('Purpose', record.purpose))

  if (doc.bestUsedFor) blocks.push(bullet('Best used for', doc.bestUsedFor))
  if (doc.props.length) blocks.push(bullet('Props', doc.props.map(p => `\`${p}\``).join(', ')))
  if (doc.dataShape) blocks.push(bullet('Data shape', `\`${doc.dataShape}\``))
  if (doc.dependencies.length) blocks.push(bullet('Dependencies', doc.dependencies.map(d => `\`${d}\``).join(', ')))
  if (doc.usedBy.length) blocks.push(bullet('Used by', doc.usedBy.join('; ')))
  if (doc.usageBoundary) blocks.push(bullet('Usage boundary', doc.usageBoundary))
  if (doc.contractDoc) blocks.push(bullet('Contract doc', `\`${doc.contractDoc}\``))
  if (doc.story) blocks.push(bullet('Story', `\`${doc.story}\``))

  const ownership = renderOwnership(record.ownership)
  if (ownership) blocks.push(ownership)

  if (doc.governanceRules.length) {
    blocks.push(['**Governance rules:**', '', renderList(doc.governanceRules)].join('\n'))
  }
  if (doc.notes.length) {
    blocks.push(['**Notes:**', '', renderList(doc.notes)].join('\n'))
  }

  const decision = renderDecision(record.decision)
  if (decision) blocks.push(decision)

  blocks.push(renderContract(record.contract))

  return blocks.join('\n\n')
}

export function renderCatalogue(records) {
  const parts = [HEADER]

  let currentSection = null
  for (const record of records) {
    if (record.section !== currentSection) {
      currentSection = record.section
      parts.push([
        '---',
        '',
        `## ${SECTION_TITLES[currentSection]}`,
        '',
        SECTION_BLURBS[currentSection],
      ].join('\n'))
    }
    parts.push(['---', '', renderRecord(record)].join('\n'))
  }

  return `${parts.join('\n\n')}\n`
}

export async function generate() {
  const records = await loadCatalogue()
  return renderCatalogue(records)
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
      console.error(`catalogue:check — ${OUTPUT_PATH} is missing. Run \`pnpm catalogue:generate\`.`)
      process.exit(1)
    }
    if (committed !== generated) {
      console.error(
        `catalogue:check — ${OUTPUT_PATH} is out of date with `
        + 'src/component-catalogue/records/. Run `pnpm catalogue:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`catalogue:check — ${OUTPUT_PATH} matches the catalogue.`)
  } else {
    writeFileSync(target, generated)
    console.log(`catalogue:generate — wrote ${OUTPUT_PATH}`)
  }
}
