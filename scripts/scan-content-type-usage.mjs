#!/usr/bin/env node
// ─── Content type usage scanner ────────────────────────────────────────────
//
// Measures how often each registered authoring type is actually used by
// chapter content, at the level it is used at.
//
// It does NOT grep. Every content module under `src/content/**` is imported
// and its `screens` array walked structurally, so:
//
//   • a screen's type is `screen.type` — or `standard` when omitted, which is
//     what the runtime resolves and therefore what an author has chosen;
//   • a block's type is `block.type`, read from `screen.blocks[]` only;
//   • nested question shapes inside a block (`choice`, `truefalse`,
//     `connection`) are never reached, because they are not authoring types
//     and do not live in a `blocks` array.
//
// A regex over `type:` cannot make any of those distinctions. It also missed
// three real uses outright — `spotTheError`, `builder` and `acronymMemorise` —
// because content is authored in two quoting styles. Loading the modules makes
// the quoting style irrelevant.
//
//   node scripts/scan-content-type-usage.mjs          print the scan as JSON
//
// Deterministic by construction: files are globbed and sorted, keys are
// sorted, and nothing reads the clock, the environment or an absolute path.

import { dirname, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import { globSync } from 'glob'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

export const CONTENT_ROOT = 'src/content'

/** The registry is the loader map, not chapter content — never scanned. */
const NOT_CONTENT = new Set([`${CONTENT_ROOT}/chapterContentRegistry.js`])

/**
 * Every chapter content module, in a stable order. Files are discovered from
 * the filesystem rather than the loader map so an authored chapter that is not
 * yet registered still counts — usage is a fact about the content tree.
 */
export function contentModulePaths() {
  return globSync(`${CONTENT_ROOT}/**/*.js`, { cwd: ROOT, posix: true })
    .filter(path => !NOT_CONTENT.has(path))
    .sort()
}

/** Load every content module that exports a chapter shape, in path order. */
export async function loadContentModules() {
  const chapters = []
  for (const path of contentModulePaths()) {
    const loaded = await import(pathToFileURL(resolve(ROOT, path)).href)
    const chapter = loaded.default
    // Barrel and index modules export no `screens`; they carry no authored
    // types and are skipped rather than treated as empty chapters.
    if (!Array.isArray(chapter?.screens)) continue
    chapters.push({ path, chapter })
  }
  return chapters
}

const bump = (map, key, path) => {
  const entry = map[key] ?? (map[key] = { occurrences: 0, files: new Set() })
  entry.occurrences += 1
  entry.files.add(path)
}

const settle = map => Object.fromEntries(
  Object.keys(map).sort().map(key => [key, {
    occurrences: map[key].occurrences,
    files: map[key].files.size,
  }]),
)

/**
 * Walk loaded chapters into level-aware usage counts.
 *
 * Exported separately from the loading so the scan can be exercised against
 * fixture chapters in a test without touching the filesystem.
 */
export function countTypeUsage(chapters) {
  const screens = {}
  const blocks = {}

  for (const { path, chapter } of chapters) {
    for (const screen of chapter.screens) {
      if (typeof screen !== 'object' || screen === null || Array.isArray(screen)) continue
      // An omitted type is not an absence of choice: the runtime resolves it
      // to `standard`, so that is the type the author has authored.
      bump(screens, screen.type || 'standard', path)
      if (!Array.isArray(screen.blocks)) continue
      for (const block of screen.blocks) {
        if (typeof block !== 'object' || block === null || Array.isArray(block)) continue
        if (typeof block.type !== 'string' || block.type === '') continue
        bump(blocks, block.type, path)
      }
    }
  }

  return { screens: settle(screens), blocks: settle(blocks) }
}

/** Usage keyed by the same `level:type` key the Lab projection uses. */
export function usageByAuthoringKey(usage) {
  const out = {}
  for (const [type, value] of Object.entries(usage.screens)) out[`screen:${type}`] = value
  for (const [type, value] of Object.entries(usage.blocks)) out[`block:${type}`] = value
  return Object.fromEntries(Object.keys(out).sort().map(key => [key, out[key]]))
}

export async function scanContentTypeUsage() {
  const chapters = await loadContentModules()
  const usage = countTypeUsage(chapters)
  return { contentModulesScanned: chapters.length, ...usage }
}

async function main() {
  const scan = await scanContentTypeUsage()
  console.log(JSON.stringify(scan, null, 2))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
