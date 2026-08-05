// ─── Curriculum catalogue loader ───────────────────────────────────────────
//
// Deterministic, build-time only. Reads every record under `records/`,
// validates it against `schema.js`, and returns the catalogue in a stable
// order. Never import this from the learner runtime — it touches the
// filesystem and exists to feed the generator and the architecture guard.
//
// LAYOUT is the one declared thing in this file. Where a record type lives is
// not derivable from the filesystem — "boards live in boards.js" is a decision,
// not an observation — so it is stated once, here, and matches DESIGN.md §6.1.
// The RECORDS THEMSELVES are always derived: every `.js` file in a declared
// directory is loaded, so adding a record is adding a file and nothing else.
// There is no list of records anywhere.

import { existsSync, readdirSync, statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { RECORD_TYPES } from './schema.js'

const HERE = dirname(fileURLToPath(import.meta.url))
export const RECORDS_DIR = resolve(HERE, 'records')

/**
 * Where each record type is authored, and in what shape.
 *
 * `grouped`  — one file exporting an array of records. For small sets that are
 *              read together and change almost never (boards, subjects).
 * `perFile`  — one file per record, filename === record id. For large records
 *              that change for their own reasons (specifications, pathways,
 *              modules).
 * `nested`   — records grouped by module inside a subject folder, each file
 *              exporting an array. Chapters only: they are the fastest-growing
 *              set, and adding one is almost always adding it to a module that
 *              already exists (DESIGN.md §6.1).
 */
export const LAYOUT = [
  { type: 'board', collection: 'boards', shape: 'grouped', path: 'boards.js' },
  { type: 'subject', collection: 'subjects', shape: 'grouped', path: 'subjects.js' },
  { type: 'specification', collection: 'specifications', shape: 'perFile', path: 'specifications' },
  { type: 'studyPathway', collection: 'pathways', shape: 'perFile', path: 'pathways' },
  { type: 'module', collection: 'modules', shape: 'perFile', path: 'modules' },
  { type: 'chapter', collection: 'chapters', shape: 'nested', path: 'chapters' },
  // Content the runtime still loads for an id that is not a chapter. One record
  // today, read together with nothing else, so a grouped file rather than a
  // directory of one.
  { type: 'legacyContentBinding', collection: 'legacyContentBindings', shape: 'grouped', path: 'legacyContentBindings.js' },
]

/** All `.js` files under `dir`, relative to it, sorted so load order never
 *  depends on the filesystem. */
function listJsFiles(dir, prefix = '') {
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir).sort()) {
    const full = resolve(dir, name)
    if (statSync(full).isDirectory()) {
      out.push(...listJsFiles(full, `${prefix}${name}/`))
      continue
    }
    if (name.endsWith('.js')) out.push(`${prefix}${name}`)
  }
  return out
}

async function importDefault(absolutePath, relativeLabel) {
  const loaded = await import(pathToFileURL(absolutePath).href)
  const exportNames = Object.keys(loaded)
  if (exportNames.length !== 1 || !('default' in loaded)) {
    throw new Error(
      `${relativeLabel}: a record file must have exactly one export, its default `
      + `(found: ${exportNames.join(', ') || 'nothing'})`,
    )
  }
  return loaded.default
}

function validateAll(type, records, label) {
  const validate = RECORD_TYPES[type]
  records.forEach((record, i) => {
    const problems = validate(record)
    if (problems.length) {
      const at = records.length > 1 ? `${label}[${i}]` : label
      throw new Error(`${at}: invalid ${type} record\n  - ${problems.join('\n  - ')}`)
    }
  })
}

async function loadGrouped(entry) {
  const absolute = resolve(RECORDS_DIR, entry.path)
  if (!existsSync(absolute)) return []
  const records = await importDefault(absolute, `records/${entry.path}`)
  if (!Array.isArray(records)) {
    throw new Error(`records/${entry.path}: must default-export an array of ${entry.type} records`)
  }
  validateAll(entry.type, records, `records/${entry.path}`)
  return records
}

async function loadPerFile(entry) {
  const dir = resolve(RECORDS_DIR, entry.path)
  const records = []
  for (const file of listJsFiles(dir)) {
    const label = `records/${entry.path}/${file}`
    const record = await importDefault(resolve(dir, file), label)
    validateAll(entry.type, [record], label)
    // The filename is the id, so a record cannot be found under a name that
    // disagrees with what it calls itself.
    if (`${record.id}.js` !== file) {
      throw new Error(`${label}: record id "${record.id}" must match its filename`)
    }
    records.push(record)
  }
  return records
}

async function loadNested(entry) {
  const dir = resolve(RECORDS_DIR, entry.path)
  const records = []
  for (const file of listJsFiles(dir)) {
    const label = `records/${entry.path}/${file}`
    if (!file.includes('/')) {
      throw new Error(`${label}: chapters are grouped by module inside a subject folder (<subject>/<module>.js)`)
    }
    const group = await importDefault(resolve(dir, file), label)
    if (!Array.isArray(group)) {
      throw new Error(`${label}: must default-export an array of ${entry.type} records`)
    }
    validateAll(entry.type, group, label)
    records.push(...group)
  }
  return records
}

const LOADERS = { grouped: loadGrouped, perFile: loadPerFile, nested: loadNested }

/**
 * Load and validate every record.
 *
 * Throws on the first structural problem, so a malformed catalogue fails loudly
 * rather than generating a subtly wrong document. Cross-record integrity —
 * references resolving, retired records staying unreachable — is `index.js`.
 */
export async function loadRecords() {
  const catalogue = {}
  for (const entry of LAYOUT) {
    catalogue[entry.collection] = await LOADERS[entry.shape](entry)
  }
  return catalogue
}

/** Every record file the catalogue would load, for the purity guard. */
export function listAllRecordFiles() {
  const files = []
  for (const entry of LAYOUT) {
    if (entry.shape === 'grouped') {
      if (existsSync(resolve(RECORDS_DIR, entry.path))) files.push(`records/${entry.path}`)
      continue
    }
    for (const file of listJsFiles(resolve(RECORDS_DIR, entry.path))) {
      files.push(`records/${entry.path}/${file}`)
    }
  }
  return files
}
