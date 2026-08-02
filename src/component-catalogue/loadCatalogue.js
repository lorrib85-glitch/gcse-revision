// ─── Component catalogue loader ────────────────────────────────────────────
//
// Deterministic, build-time only. Reads every record file under `records/`,
// validates it, and returns the catalogue sorted by `order`.
//
// Never import this from the learner runtime — it touches the filesystem and
// exists to feed the generator and the architecture guard.

import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { sourceIdentity, validateRecord } from './schema.js'

const HERE = dirname(fileURLToPath(import.meta.url))
export const RECORDS_DIR = resolve(HERE, 'records')

/** Record filenames, sorted so loading order never depends on the filesystem. */
export function listRecordFiles() {
  return readdirSync(RECORDS_DIR)
    .filter(name => name.endsWith('.js'))
    .sort()
}

/**
 * Load every record. Throws on the first structural problem, so a malformed
 * catalogue fails loudly rather than generating a subtly wrong document.
 */
export async function loadCatalogue() {
  const records = []

  for (const file of listRecordFiles()) {
    const moduleUrl = pathToFileURL(resolve(RECORDS_DIR, file)).href
    const loaded = await import(moduleUrl)

    const exportNames = Object.keys(loaded)
    if (exportNames.length !== 1 || !('default' in loaded)) {
      throw new Error(
        `${file}: a record file must have exactly one export, its default record `
        + `(found: ${exportNames.join(', ') || 'nothing'})`,
      )
    }

    const record = loaded.default
    const problems = validateRecord(record)
    if (problems.length) {
      throw new Error(`${file}: invalid catalogue record\n  - ${problems.join('\n  - ')}`)
    }
    if (`${record.id}.js` !== file) {
      throw new Error(`${file}: record id "${record.id}" must match its filename`)
    }

    records.push(record)
  }

  assertUnique(records, record => record.id, 'id')
  assertUnique(records, record => record.name, 'name')
  assertUnique(records, sourceIdentity, 'source')
  assertUnique(records, record => record.order, 'order')

  return records.sort((a, b) => a.order - b.order)
}

function assertUnique(records, key, label) {
  const seen = new Map()
  for (const record of records) {
    const value = key(record)
    if (seen.has(value)) {
      throw new Error(`duplicate ${label} "${value}": ${seen.get(value)} and ${record.id}`)
    }
    seen.set(value, record.id)
  }
}

/** Every internal path claimed by a record, with its owner. */
export function internalOwnership(records) {
  const owned = []
  for (const record of records) {
    for (const entry of record.ownership.internalDirectories) {
      owned.push({ ...entry, kind: 'directory', owner: record })
    }
    for (const entry of record.ownership.internalFiles) {
      owned.push({ ...entry, kind: 'file', owner: record })
    }
  }
  return owned
}
