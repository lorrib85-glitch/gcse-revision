import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { CHAPTERS } from '../../src/chapters.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')

function walkSrc(dir, exts = ['.js', '.jsx']) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkSrc(full, exts))
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

const srcDir = resolve(root, 'src')
const allSrcFiles = walkSrc(srcDir)

describe('Content-loading boundary — app shell ownership', () => {
  it('LegacyApp does not define either loader registry name', () => {
    const src = readFileSync(resolve(root, 'src/app/LegacyApp.jsx'), 'utf8')
    expect(/(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(src)).toBe(false)
    expect(/(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(src)).toBe(false)
  })
})

describe('Content-loading boundary — retired subject-bundle pattern', () => {
  it('SUBJECT_MODULE_LOADERS does not exist under src', () => {
    const violators = allSrcFiles.filter(file =>
      readFileSync(file, 'utf8').includes('SUBJECT_MODULE_LOADERS')
    )
    expect(
      violators.map(file => file.replace(root + '/', '')),
      'SUBJECT_MODULE_LOADERS found — remove this legacy pattern',
    ).toHaveLength(0)
  })
})

describe('Content-loading boundary — one canonical registry owner', () => {
  it('chapterContentRegistry.js is the sole CHAPTER_CONTENT_LOADERS definition', () => {
    const registryPath = resolve(root, 'src/content/chapterContentRegistry.js')
    // The Stage 3 projection declares the same symbol by design and is imported
    // by nothing — Stage 4 is what makes the registry re-export it. Until then
    // it is a generated candidate, not a competing owner; the parity gate in
    // tests/architecture/curriculum-projection-parity.test.js proves no
    // production file reaches it.
    const generatedProjection = resolve(root, 'src/data/generated/curriculum')
    const violators = allSrcFiles.filter(file => {
      if (file === registryPath) return false
      if (file.startsWith(`${generatedProjection}/`)) return false
      return /(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(readFileSync(file, 'utf8'))
    })
    expect(
      violators.map(file => file.replace(root + '/', '')),
      'CHAPTER_CONTENT_LOADERS defined outside chapterContentRegistry.js',
    ).toHaveLength(0)
  })
})

describe('Content-loading boundary — registry values', () => {
  it('every entry is a loader function', () => {
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect(
        typeof loader,
        `[${id}] registry value is not a function — wrap it: () => import(...).then(m => m.default)`,
      ).toBe('function')
    }
  })

  it('calling a loader returns a Promise', async () => {
    const entries = Object.entries(CHAPTER_CONTENT_LOADERS)
    if (entries.length === 0) return
    const [id, loader] = entries[0]
    const result = loader()
    expect(result instanceof Promise, `[${id}] loader() did not return a Promise`).toBe(true)
    await result
  })
})

describe('Content-loading boundary — no static episode imports in app shells', () => {
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
        `${rel} contains a static import from a content episodes path: ${match?.[0]}`,
      ).toBeNull()
    })
  }
})

describe('Content-loading boundary — stub chapter content', () => {
  const stubs = CHAPTERS.filter(chapter => chapter.screenCount === 0)

  it('stub metadata rows have screenCount: 0 and screenTags: []', () => {
    for (const meta of stubs) {
      expect(meta.screenCount, `[${meta.id}] stub screenCount should be 0`).toBe(0)
      expect(meta.screenTags, `[${meta.id}] stub screenTags should be []`).toEqual([])
    }
  })

  it('stub content files resolve to screens: []', async () => {
    for (const meta of stubs) {
      const loader = CHAPTER_CONTENT_LOADERS[meta.id]
      if (!loader) continue
      const content = await loader()
      expect(
        content.screens,
        `[${meta.id}] stub content file must export screens: []`,
      ).toEqual([])
    }
  })
})

describe('Content-loading boundary — catalogue completeness', () => {
  const registryIds = new Set(Object.keys(CHAPTER_CONTENT_LOADERS))

  it('every chapter ID has a registry entry', () => {
    const missing = CHAPTERS
      .filter(chapter => !registryIds.has(chapter.id))
      .map(chapter => chapter.id)
    expect(
      missing,
      `Chapter IDs missing from chapterContentRegistry.js: ${missing.join(', ')}`,
    ).toHaveLength(0)
  })
})
