#!/usr/bin/env node
// ─── Authoring registry generator ──────────────────────────────────────────
//
// Projects the component catalogue's `authoring` blocks, plus the proven-live
// compatibility entries, into the lean runtime registry that
// `src/data/screenRegistry.js` re-exports.
//
// The projection carries only what the runtime reads. Governance prose,
// Decision blocks, contracts, evidence, removal conditions and reasons all stay
// in the catalogue and never reach the shipped bundle.
//
//   pnpm authoring:generate   write the file
//   pnpm authoring:check      fail if the committed file has drifted
//
// Deterministic by construction: no clock, no environment, no absolute paths.

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { loadCatalogue } from '../src/component-catalogue/loadCatalogue.js'
import { AUTHORING_COMPATIBILITY } from '../src/component-catalogue/migrations/authoringCompatibility.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

export const OUTPUT_PATH = 'src/data/generated/componentAuthoringRegistry.js'

// The runtime field order. `component` is derived: a private handler when the
// implementation lives inside the owning source, otherwise the record's name.
const FIELDS = [
  'authoringName', 'component', 'level', 'layout', 'status', 'replacement',
  'required', 'requiredAny', 'continuation', 'headerMode',
]

/** Every authoring entry the catalogue owns, tagged with its owning record. */
export function catalogueEntries(records) {
  const entries = []
  for (const record of records) {
    if (!record.authoring) continue
    for (const entry of record.authoring.entries) {
      entries.push({ entry, record })
    }
  }
  return entries
}

/**
 * Build the two runtime namespaces. Screen and block are kept separate on
 * purpose: `tieredquiz` is an active screen type *and* a legacy block type, and
 * a single merged map would silently drop one of them.
 */
export function projectRegistries(records) {
  const screens = {}
  const blocks = {}
  const claim = (level, type, value, owner) => {
    const target = level === 'screen' ? screens : blocks
    if (target[type]) {
      throw new Error(`duplicate ${level} type "${type}": ${target[type].__owner} and ${owner}`)
    }
    target[type] = { ...value, __owner: owner }
  }

  for (const { entry, record } of catalogueEntries(records)) {
    claim(entry.level, entry.type, {
      authoringName: entry.authoringName,
      component: entry.handler ?? record.name,
      level: entry.level,
      layout: entry.layout,
      status: entry.status,
      replacement: entry.replacement,
      required: entry.required,
      requiredAny: entry.requiredAny,
      continuation: entry.continuation,
      headerMode: entry.headerMode,
    }, record.id)
  }

  for (const entry of AUTHORING_COMPATIBILITY) {
    claim(entry.level, entry.type, {
      authoringName: entry.authoringName,
      component: entry.currentHandler,
      level: entry.level,
      layout: entry.layout,
      status: entry.status,
      replacement: entry.replacement,
      required: entry.required,
      requiredAny: entry.requiredAny,
      continuation: entry.continuation,
      headerMode: entry.headerMode,
    }, 'authoringCompatibility')
  }

  const strip = map => Object.fromEntries(
    Object.keys(map).sort().map(type => {
      const { __owner, ...rest } = map[type]
      return [type, rest]
    }),
  )
  return { screens: strip(screens), blocks: strip(blocks) }
}

const literal = value => JSON.stringify(value)
  .replace(/"([a-zA-Z][a-zA-Z0-9]*)":/g, '$1: ')
  .replace(/"/g, "'")
  .replace(/,/g, ', ')

function renderMap(name, map) {
  const lines = Object.entries(map).map(([type, definition]) => {
    const body = FIELDS.map(field => `${field}: ${literal(definition[field])}`).join(', ')
    const key = /^[a-zA-Z][a-zA-Z0-9]*$/.test(type) ? type : `'${type}'`
    return `  ${key}: Object.freeze({ ${body} }),`
  })
  return `export const ${name} = Object.freeze({\n${lines.join('\n')}\n})`
}

export function renderRegistry(records) {
  const { screens, blocks } = projectRegistries(records)

  return `// GENERATED FILE — DO NOT EDIT.
//
// Projected from the component catalogue's authoring blocks and the
// compatibility registry by scripts/generate-authoring-registry.mjs.
// Run \`pnpm authoring:generate\` after changing a record's authoring entry;
// \`pnpm authoring:check\` fails if this file has drifted.
//
// The catalogue is build-time governance data and is never imported by the
// runtime. This projection is the runtime's side of that boundary: it carries
// only the fields ChapterPlayer, ScreenRenderer and the chapter validator read.
//
// Screen and block are separate namespaces because a type name may legitimately
// mean different things at each level.

${renderMap('SCREEN_REGISTRY', screens)}

${renderMap('BLOCK_REGISTRY', blocks)}
`
}

async function main() {
  const records = await loadCatalogue()
  const generated = renderRegistry(records)
  const target = resolve(ROOT, OUTPUT_PATH)

  if (process.argv.includes('--check')) {
    const current = readFileSync(target, 'utf8')
    if (current !== generated) {
      console.error(
        `authoring:check — ${OUTPUT_PATH} has drifted from the catalogue.\n`
        + 'Run `pnpm authoring:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`authoring:check — ${OUTPUT_PATH} matches the catalogue.`)
    return
  }

  writeFileSync(target, generated)
  console.log(`authoring:generate — wrote ${OUTPUT_PATH}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
