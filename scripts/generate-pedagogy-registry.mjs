#!/usr/bin/env node
// ─── Pedagogy registry generator ────────────────────────────────────────────
//
// Projects pedagogical classification from its three authored surfaces —
// catalogue authoring entries, the compatibility registry and the
// non-authoring registry — into the lean runtime projection that
// `src/data/componentFunctions.js` re-exports.
//
// The projection carries only the fields the taxonomy consumers read:
// functions and interaction, per type, in two level namespaces plus the flat
// compatibility view. Reasons, removal conditions, exemption prose and all
// other governance stay in the catalogue.
//
//   pnpm pedagogy:generate   write the file
//   pnpm pedagogy:check      fail if the committed file has drifted
//
// Deterministic by construction: no clock, no environment, no absolute paths.

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { loadCatalogue } from '../src/component-catalogue/loadCatalogue.js'
import { FUNCTION_TAGS } from '../src/component-catalogue/pedagogyVocabulary.js'
import { AUTHORING_COMPATIBILITY } from '../src/component-catalogue/migrations/authoringCompatibility.js'
import { NON_AUTHORING_PEDAGOGY } from '../src/component-catalogue/migrations/nonAuthoringPedagogy.js'
import { catalogueEntries } from './generate-authoring-registry.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

export const OUTPUT_PATH = 'src/data/generated/componentPedagogyRegistry.js'

const fact = pedagogy => ({
  functions: [...pedagogy.functions],
  interaction: pedagogy.interaction,
})

/**
 * Build the level namespaces and the flat compatibility view.
 *
 * Exempt (container-derived) entries are omitted from every map, so the flat
 * helpers keep answering null/false for them exactly as before the flip.
 *
 * The flat view exists only while it is truthful: a type present at both
 * levels must carry deep-equal facts, and generation FAILS on the first
 * divergence. That day, the flat view's consumers move to the level-aware
 * helpers — a deliberate migration, never a silent precedence pick.
 *
 * `nonAuthoring` is injectable so the collision guard can be exercised
 * directly. Generation always uses the real registry; only the guard's own
 * test passes a different one.
 */
export function projectPedagogy(records, nonAuthoring = NON_AUTHORING_PEDAGOGY) {
  const screens = {}
  const blocks = {}

  for (const { entry } of catalogueEntries(records)) {
    if (entry.pedagogyExemption) continue
    const target = entry.level === 'screen' ? screens : blocks
    target[entry.type] = fact(entry.pedagogy)
  }
  for (const entry of AUTHORING_COMPATIBILITY) {
    const target = entry.level === 'screen' ? screens : blocks
    target[entry.type] = fact(entry.pedagogy)
  }

  const flat = {}
  for (const [type, value] of [...Object.entries(blocks), ...Object.entries(screens)]) {
    if (flat[type] && JSON.stringify(flat[type]) !== JSON.stringify(value)) {
      throw new Error(
        `pedagogy divergence for "${type}": the screen and block facts differ, so the flat `
        + 'compatibility view can no longer represent it. Migrate getTypeInfo() consumers to '
        + 'getScreenTypeInfo()/getBlockTypeInfo() before allowing this divergence.',
      )
    }
    flat[type] = value
  }
  for (const entry of nonAuthoring) {
    if (flat[entry.type]) throw new Error(`non-authoring type "${entry.type}" collides with an authoring entry`)
    flat[entry.type] = fact(entry.pedagogy)
  }

  const sort = map => Object.fromEntries(Object.keys(map).sort().map(k => [k, map[k]]))
  return { screens: sort(screens), blocks: sort(blocks), flat: sort(flat) }
}

const literal = value => JSON.stringify(value)
  .replace(/"([a-zA-Z][a-zA-Z0-9-]*)":/g, "'$1': ")
  .replace(/'functions':/g, 'functions:')
  .replace(/'interaction':/g, 'interaction:')
  .replace(/"/g, "'")
  .replace(/,/g, ', ')

function renderMap(name, map) {
  const lines = Object.entries(map).map(([type, value]) =>
    `  ${type}: Object.freeze({ functions: ${literal(value.functions)}, interaction: '${value.interaction}' }),`)
  return `export const ${name} = Object.freeze({\n${lines.join('\n')}\n})`
}

export function renderPedagogyRegistry(records) {
  const { screens, blocks, flat } = projectPedagogy(records)

  return `// GENERATED FILE — DO NOT EDIT.
//
// Projected from the component catalogue's authoring-entry pedagogy blocks,
// the compatibility registry and the non-authoring registry by
// scripts/generate-pedagogy-registry.mjs. Run \`pnpm pedagogy:generate\` after
// changing a pedagogy fact; \`pnpm pedagogy:check\` fails if this file has
// drifted.
//
// Screen and block are separate namespaces. SCREEN_TYPE_FUNCTIONS is the flat
// compatibility view consumed by the legacy getTypeInfo() API: it exists only
// while every type name means the same thing at both levels — the generator
// fails on the first divergence.

export const FUNCTION_TAGS = Object.freeze(${literal([...FUNCTION_TAGS])})

${renderMap('SCREEN_TYPE_PEDAGOGY', screens)}

${renderMap('BLOCK_TYPE_PEDAGOGY', blocks)}

${renderMap('SCREEN_TYPE_FUNCTIONS', flat)}
`
}

async function main() {
  const records = await loadCatalogue()
  const generated = renderPedagogyRegistry(records)
  const target = resolve(ROOT, OUTPUT_PATH)

  if (process.argv.includes('--check')) {
    const current = readFileSync(target, 'utf8')
    if (current !== generated) {
      console.error(
        `pedagogy:check — ${OUTPUT_PATH} has drifted from the catalogue.\n`
        + 'Run `pnpm pedagogy:generate` and commit the result.',
      )
      process.exit(1)
    }
    console.log(`pedagogy:check — ${OUTPUT_PATH} matches the catalogue.`)
    return
  }

  writeFileSync(target, generated)
  console.log(`pedagogy:generate — wrote ${OUTPUT_PATH}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
