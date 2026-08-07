#!/usr/bin/env node
// ─── Component Lab registry generator ──────────────────────────────────────
//
// Projects the component catalogue's authoring entries — joined to their
// owning record and to measured content usage — into the facts the Component
// Lab displays.
//
// **The projection unit is the authoring entry, not the catalogue record.**
// One row per non-legacy entry, keyed `screen:<type>` / `block:<type>`, which
// is what an author actually picks. A record with `authoring: null` produces
// no row, so infrastructure is excluded structurally rather than by a list,
// and a record owning several entries contributes one row each.
//
// `status` decides whether a row is a *selection*:
//   • active  — exactly one Lab adapter, enforced in both directions;
//   • derived — no adapter; the runtime presenting an existing choice at
//               another level, shown beneath the entry named by `derivedFrom`;
//   • legacy  — no row at all.
//
// Serialisable facts only: no JSX, no functions, no React. The Lab shell reads
// names, contracts, pedagogy, guidance, lifecycle and usage from here, so the
// handwritten adapter layer never restates a fact the catalogue owns.
//
//   pnpm lab:generate   write the file
//   pnpm lab:check      fail if the committed file has drifted
//
// Deterministic by construction: no clock, no environment, no absolute paths.
// Content usage is drift-checked like every other generated fact (D1) — a
// content change that moves a screen or block must regenerate this file.

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { loadCatalogue } from '../src/component-catalogue/loadCatalogue.js'
import { catalogueEntries } from './generate-authoring-registry.mjs'
import { scanContentTypeUsage, usageByAuthoringKey } from './scan-content-type-usage.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

export const OUTPUT_PATH = 'src/data/generated/componentLabRegistry.js'

const NO_USAGE = Object.freeze({ occurrences: 0, files: 0 })

export const authoringKeyOf = entry => `${entry.level}:${entry.type}`

/**
 * Build one row per non-legacy authoring entry.
 *
 * `usage` is passed in rather than scanned here so the projection stays a pure
 * function of its inputs — which is what lets the drift check, the
 * determinism test and the usage-divergence mutation all exercise it directly.
 */
export function projectLabRegistry(records, usage) {
  const rows = []

  for (const { entry, record } of catalogueEntries(records)) {
    if (entry.status === 'legacy') continue
    const key = authoringKeyOf(entry)
    const entryGuidance = record.documentation.authoringGuidance?.[key] ?? null

    rows.push([key, {
      key,
      level: entry.level,
      type: entry.type,
      status: entry.status,
      derivedFrom: entry.derivedFrom ?? null,

      authoringName: entry.authoringName,
      layout: entry.layout,
      continuation: entry.continuation,
      headerMode: entry.headerMode,
      required: entry.required,
      requiredAny: entry.requiredAny,

      // A private handler is named honestly; a null handler means the owning
      // record's own component implements the type.
      handler: entry.handler,
      owningRecordId: record.id,
      componentName: record.name,
      source: record.source,

      pedagogy: entry.pedagogy
        ? { functions: [...entry.pedagogy.functions], interaction: entry.pedagogy.interaction }
        : null,
      pedagogyExemption: entry.pedagogyExemption?.kind ?? null,

      lifecycle: record.lifecycle,
      criticality: record.contract.criticality,
      // Most reusable records own one authoring choice, so record-level
      // guidance remains the default. Multi-entry runtime records may provide
      // guidance keyed by the exact authoring entry so one private handler's
      // decision rules never leak onto its siblings.
      decisionStatus: entryGuidance?.status ?? record.decision?.status ?? null,
      bestUsedFor: entryGuidance?.bestUsedFor ?? record.documentation.bestUsedFor,
      useWhen: entryGuidance?.useWhen ?? record.decision?.useWhen ?? null,
      doNotUseWhen: entryGuidance?.doNotUseWhen ?? record.decision?.doNotUseWhen ?? null,
      chooseInstead: entryGuidance?.chooseInstead ?? record.decision?.chooseInstead ?? null,
      contentShape: entryGuidance?.contentShape ?? record.decision?.contentShape ?? null,

      contentUsage: usage[key] ?? NO_USAGE,
    }])
  }

  const seen = new Set()
  for (const [key] of rows) {
    if (seen.has(key)) throw new Error(`duplicate Lab projection key "${key}"`)
    seen.add(key)
  }

  // A derived route that names nothing, names itself, or names a key that is
  // not an active entry would let the Lab publish a route no author writes.
  for (const [key, row] of rows) {
    if (row.status !== 'derived') continue
    const source = rows.find(([candidate]) => candidate === row.derivedFrom)
    if (!source) throw new Error(`derived entry "${key}" names unknown source "${row.derivedFrom}"`)
    if (source[1].status !== 'active') {
      throw new Error(`derived entry "${key}" must derive from an active entry, not "${source[1].status}"`)
    }
  }

  return Object.fromEntries(rows.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}

// Plain JSON. The other generators prettify their literals into single
// quotes, which is safe for their short enum values but not here: these rows
// carry Decision prose full of apostrophes and quotation marks, and a
// search-and-replace over quote characters would corrupt it. Valid JS that is
// provably identical to the source data beats prettier bytes in a file nobody
// hand-edits.
const literal = value => JSON.stringify(value)

const FIELDS = [
  'key', 'level', 'type', 'status', 'derivedFrom',
  'authoringName', 'layout', 'continuation', 'headerMode', 'required', 'requiredAny',
  'handler', 'owningRecordId', 'componentName', 'source',
  'pedagogy', 'pedagogyExemption',
  'lifecycle', 'criticality', 'decisionStatus',
  'bestUsedFor', 'useWhen', 'doNotUseWhen', 'chooseInstead', 'contentShape',
  'contentUsage',
]

function renderRow(row) {
  const body = FIELDS.map(field => `    ${field}: ${literal(row[field] ?? null)},`).join('\n')
  return `  '${row.key}': Object.freeze({\n${body}\n  }),`
}

export function renderLabRegistry(records, usage) {
  const projection = projectLabRegistry(records, usage)
  const rows = Object.values(projection).map(renderRow).join('\n')

  return `// GENERATED FILE — DO NOT EDIT.
//
// Projected from the component catalogue's authoring entries, their owning
// records and the measured content-type scan by
// scripts/generate-lab-registry.mjs. Run \`pnpm lab:generate\` after changing a
// record's authoring entry OR after any content change that adds, removes or
// moves a screen or block; \`pnpm lab:check\` fails if this file has drifted.
//
// One row per non-legacy authoring entry, keyed by the level-aware key an
// author writes. This is what the Component Lab lists: every \`active\` row is
// one selection, and every selection resolves back to one \`active\` row.
// A \`derived\` row is the runtime presenting an existing choice at another
// level — it is shown beneath the entry named by \`derivedFrom\` and is never
// independently selectable.
//
// The catalogue is build-time governance data and is never imported by the
// runtime. This projection is the Lab's side of that boundary: serialisable
// values only, no JSX, no functions, no React.

export const COMPONENT_LAB_REGISTRY = Object.freeze({
${rows}
})

/** Every row, in stable key order. */
export const LAB_REGISTRY_ROWS = Object.freeze(Object.values(COMPONENT_LAB_REGISTRY))

/** The selectable population: one entry per authoring choice an author makes. */
export const ACTIVE_LAB_KEYS = Object.freeze(
  LAB_REGISTRY_ROWS.filter(row => row.status === 'active').map(row => row.key),
)

/** Derived routes, keyed by the active entry each one presents. */
export const DERIVED_LAB_ROUTES = Object.freeze(
  LAB_REGISTRY_ROWS.filter(row => row.status === 'derived'),
)
`
}

async function main() {
  const records = await loadCatalogue()
  const usage = usageByAuthoringKey(await scanContentTypeUsage())
  const generated = renderLabRegistry(records, usage)
  const target = resolve(ROOT, OUTPUT_PATH)

  if (process.argv.includes('--check')) {
    const current = readFileSync(target, 'utf8')
    if (current !== generated) {
      console.error(
        `lab:check — ${OUTPUT_PATH} has drifted from the catalogue or from src/content/**.\n`
        + 'Run `pnpm lab:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`lab:check — ${OUTPUT_PATH} matches the catalogue and the content scan.`)
    return
  }

  writeFileSync(target, generated)
  console.log(`lab:generate — wrote ${OUTPUT_PATH}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
