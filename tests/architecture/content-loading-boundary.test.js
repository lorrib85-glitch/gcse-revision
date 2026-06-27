import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')

function walkSrc(dir, exts = ['.js', '.jsx']) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkSrc(full, exts))
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(full)
    }
  }
  return results
}

const srcDir = resolve(root, 'src')
const allSrcFiles = walkSrc(srcDir)

// ─── Rule 1 ──────────────────────────────────────────────────────────────────
// LegacyApp.jsx may import MODULE_CONTENT_LOADERS but must not define it.
// The canonical definition lives only in src/content/moduleContentRegistry.js.

describe('Content-loading boundary — Rule 1: LegacyApp must not define MODULE_CONTENT_LOADERS', () => {
  it('src/app/LegacyApp.jsx does not contain a MODULE_CONTENT_LOADERS definition', () => {
    const src = readFileSync(resolve(root, 'src/app/LegacyApp.jsx'), 'utf8')
    expect(/(?:export\s+)?const\s+MODULE_CONTENT_LOADERS\s*=/.test(src)).toBe(false)
  })
})

// ─── Rule 2 ──────────────────────────────────────────────────────────────────
// SUBJECT_MODULE_LOADERS was the old per-subject lazy-bundle pattern.
// It must not exist anywhere in the src tree.

describe('Content-loading boundary — Rule 2: SUBJECT_MODULE_LOADERS must not exist in src', () => {
  it('no file under src/ contains the string SUBJECT_MODULE_LOADERS', () => {
    const violators = allSrcFiles.filter(f =>
      readFileSync(f, 'utf8').includes('SUBJECT_MODULE_LOADERS')
    )
    expect(
      violators.map(f => f.replace(root + '/', '')),
      'SUBJECT_MODULE_LOADERS found — remove this legacy pattern'
    ).toHaveLength(0)
  })
})

// ─── Rule 3 ──────────────────────────────────────────────────────────────────
// src/content/moduleContentRegistry.js is the sole file that defines
// MODULE_CONTENT_LOADERS. No other file may own that constant.

describe('Content-loading boundary — Rule 3: moduleContentRegistry.js is the sole loader registry', () => {
  it('no file other than moduleContentRegistry.js defines MODULE_CONTENT_LOADERS', () => {
    const registryPath = resolve(root, 'src/content/moduleContentRegistry.js')
    const violators = allSrcFiles.filter(f => {
      if (f === registryPath) return false
      return /(?:export\s+)?const\s+MODULE_CONTENT_LOADERS\s*=/.test(readFileSync(f, 'utf8'))
    })
    expect(
      violators.map(f => f.replace(root + '/', '')),
      'MODULE_CONTENT_LOADERS defined outside moduleContentRegistry.js'
    ).toHaveLength(0)
  })
})

// ─── Rule 4 ──────────────────────────────────────────────────────────────────
// Every value in MODULE_CONTENT_LOADERS must be a function that returns a
// Promise (i.e. a dynamic import wrapper). Static content objects are forbidden.

describe('Content-loading boundary — Rule 4: registry values must be loader functions', () => {
  it('every entry in MODULE_CONTENT_LOADERS is a function', () => {
    for (const [id, loader] of Object.entries(MODULE_CONTENT_LOADERS)) {
      expect(
        typeof loader,
        `[${id}] registry value is not a function — wrap it: () => import(...).then(m => m.default)`
      ).toBe('function')
    }
  })

  it('calling a loader returns a Promise', async () => {
    const entries = Object.entries(MODULE_CONTENT_LOADERS)
    if (entries.length === 0) return
    const [id, loader] = entries[0]
    const result = loader()
    expect(
      result instanceof Promise,
      `[${id}] loader() did not return a Promise`
    ).toBe(true)
    await result
  })
})

// ─── Rule 5 ──────────────────────────────────────────────────────────────────
// App shell files (App.jsx, LegacyApp.jsx) must not statically import any
// episode content file. Static imports defeat lazy loading and bloat the
// initial bundle. All episode loading goes through MODULE_CONTENT_LOADERS.

describe('Content-loading boundary — Rule 5: no static episode imports in app shell files', () => {
  const shellFiles = [
    resolve(root, 'src/App.jsx'),
    resolve(root, 'src/app/LegacyApp.jsx'),
  ]

  for (const shellPath of shellFiles) {
    const rel = shellPath.replace(root + '/', '')
    it(`${rel} has no static import from a content/episodes path`, () => {
      const src = readFileSync(shellPath, 'utf8')
      const match = src.match(/^import\s+.*from\s+['"][^'"]*content[^'"]*episodes[^'"]*['"]/m)
      expect(
        match,
        `${rel} contains a static import from a content episodes path: ${match?.[0]}`
      ).toBeNull()
    })
  }
})

// ─── Rule 6 ──────────────────────────────────────────────────────────────────
// Stub modules (screenCount: 0 in src/modules.js) must export an empty
// screens array. This prevents runtime errors when ModulePlayer opens a stub.

describe('Content-loading boundary — Rule 6: stub content files export empty screens', () => {
  const stubs = MODULES.filter(m => m.screenCount === 0)

  it('stub metadata rows have screenCount: 0 and screenTags: []', () => {
    for (const meta of stubs) {
      expect(meta.screenCount, `[${meta.id}] stub screenCount should be 0`).toBe(0)
      expect(meta.screenTags, `[${meta.id}] stub screenTags should be []`).toEqual([])
    }
  })

  it('stub content files resolve to screens: []', async () => {
    for (const meta of stubs) {
      const loader = MODULE_CONTENT_LOADERS[meta.id]
      if (!loader) continue // missing registry entry caught by Rule 7
      const content = await loader()
      expect(
        content.screens,
        `[${meta.id}] stub content file must export screens: []`
      ).toEqual([])
    }
  })
})

// ─── Rule 7 ──────────────────────────────────────────────────────────────────
// Every module ID in src/modules.js must have a registry entry.
// If a module is intentionally excluded from loading, add an explicit
// comment in moduleContentRegistry.js explaining why.

describe('Content-loading boundary — Rule 7: every module ID has a registry entry', () => {
  const registryIds = new Set(Object.keys(MODULE_CONTENT_LOADERS))

  it('every ID in src/modules.js exists in MODULE_CONTENT_LOADERS', () => {
    const missing = MODULES.filter(m => !registryIds.has(m.id)).map(m => m.id)
    expect(
      missing,
      `Module IDs missing from moduleContentRegistry.js: ${missing.join(', ')}\nAdd each via /module-creation <id> or add an exclusion comment`
    ).toHaveLength(0)
  })
})
