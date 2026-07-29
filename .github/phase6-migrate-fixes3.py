from pathlib import Path
import re


def write(path, content):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


# These architecture files iterate the canonical chapter catalogue. Earlier
# passes changed the source name but left a few local `mod` references behind.
for file_name in [
    'tests/architecture/content-quality.test.js',
    'tests/architecture/content-semantic-token-governance.test.js',
    'tests/architecture/learning-graph.test.js',
]:
    path = Path(file_name)
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'\bmod\b', 'chapter', text)
    text = text.replace('builtModules', 'builtChapters')
    text = text.replace('module tag', 'chapter tag').replace('module tags', 'chapter tags')
    text = text.replace('Medicine modules', 'Medicine chapters')
    path.write_text(text, encoding='utf-8')

# The loader boundary now has one canonical owner and no compatibility registry.
write('tests/architecture/content-loading-boundary.test.js', """import { describe, it, expect } from 'vitest'
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
    if (entry.isDirectory()) results.push(...walkSrc(full, exts))
    else if (exts.some(ext => entry.name.endsWith(ext))) results.push(full)
  }
  return results
}

const srcDir = resolve(root, 'src')
const allSrcFiles = walkSrc(srcDir)

describe('Content-loading boundary — app shell ownership', () => {
  it('LegacyApp does not define the chapter loader registry', () => {
    const src = readFileSync(resolve(root, 'src/app/LegacyApp.jsx'), 'utf8')
    expect(/(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(src)).toBe(false)
  })
})

describe('Content-loading boundary — retired subject-bundle pattern', () => {
  it('SUBJECT_MODULE_LOADERS does not exist under src', () => {
    const violators = allSrcFiles.filter(file => readFileSync(file, 'utf8').includes('SUBJECT_MODULE_LOADERS'))
    expect(violators.map(file => file.replace(root + '/', '')), 'SUBJECT_MODULE_LOADERS found — remove this legacy pattern').toHaveLength(0)
  })
})

describe('Content-loading boundary — one canonical registry owner', () => {
  it('chapterContentRegistry.js is the sole CHAPTER_CONTENT_LOADERS definition', () => {
    const registryPath = resolve(root, 'src/content/chapterContentRegistry.js')
    const violators = allSrcFiles.filter(file => {
      if (file === registryPath) return false
      return /(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(readFileSync(file, 'utf8'))
    })
    expect(violators.map(file => file.replace(root + '/', '')), 'CHAPTER_CONTENT_LOADERS defined outside chapterContentRegistry.js').toHaveLength(0)
  })

  it('the retired compatibility registry is absent', () => {
    expect(allSrcFiles.filter(file => /MODULE_CONTENT_LOADERS/.test(readFileSync(file, 'utf8')))).toHaveLength(0)
    expect(() => readFileSync(resolve(root, 'src/content/moduleContentRegistry.js'), 'utf8')).toThrow()
  })
})

describe('Content-loading boundary — registry values', () => {
  it('every entry is a loader function', () => {
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect(typeof loader, `[${id}] registry value is not a function — wrap it: () => import(...).then(m => m.default)`).toBe('function')
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
  for (const shellPath of [resolve(root, 'src/App.jsx'), resolve(root, 'src/app/LegacyApp.jsx')]) {
    const rel = shellPath.replace(root + '/', '')
    it(`${rel} has no static import from a content/episodes path`, () => {
      const src = readFileSync(shellPath, 'utf8')
      const match = src.match(/^import\s+.*from\s+['\"][^'\"]*content[^'\"]*episodes[^'\"]*['\"]/m)
      expect(match, `${rel} contains a static import from a content episodes path: ${match?.[0]}`).toBeNull()
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
      expect(content.screens, `[${meta.id}] stub content file must export screens: []`).toEqual([])
    }
  })
})

describe('Content-loading boundary — catalogue completeness', () => {
  const registryIds = new Set(Object.keys(CHAPTER_CONTENT_LOADERS))
  it('every chapter ID has a registry entry', () => {
    const missing = CHAPTERS.filter(chapter => !registryIds.has(chapter.id)).map(chapter => chapter.id)
    expect(missing, `Chapter IDs missing from chapterContentRegistry.js: ${missing.join(', ')}`).toHaveLength(0)
  })
})
""")

# Placeholder safety now verifies the canonical metadata source directly.
write('tests/architecture/placeholder-chapter-safety.test.js', """import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { CHAPTERS } from '../../src/chapters.js'

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

describe('Placeholder chapter safety', () => {
  it('the canonical chapter catalogue retains governed unbuilt chapters', () => {
    expect(CHAPTERS.some(chapter => chapter.screenCount === 0)).toBe(true)
    const source = read('src/chapters.js')
    expect(source).toContain('export const CHAPTERS = [')
    expect(source).toMatch(/screenCount:\s*0/)
  })

  it('openChapterPlayer guards against chapters without screens before opening the overlay', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    const guardPattern = /if\s*\(!\s*chapter\??\.\s*screenCount\s*\)\s*return/
    expect(fnBody).toMatch(guardPattern)
    const guardPos = fnBody.search(guardPattern)
    const setViewPos = fnBody.indexOf("setView('chapter')")
    expect(guardPos).toBeGreaterThanOrEqual(0)
    expect(setViewPos).toBeGreaterThanOrEqual(0)
    expect(guardPos).toBeLessThan(setViewPos)
  })

  it('Subjects uses canonical chapter availability and maps non-available chapters to coming_soon', () => {
    const src = read('src/features/subjects/Subjects.jsx')
    expect(src).toMatch(/getChapterAvailability\((mod|chapter)\)/)
    expect(src).toMatch(/CHAPTER_AVAILABILITY\.AVAILABLE.*coming_soon|coming_soon[\s\S]*CHAPTER_AVAILABILITY\.AVAILABLE/)
  })

  it('the guard is a falsy screenCount check, so built chapters pass through', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 400)
    expect(fnBody).toMatch(/if\s*\(!\s*chapter\??\.\s*screenCount/)
  })
})
""")
Path('tests/architecture/placeholder-module-safety.test.js').unlink(missing_ok=True)

print('Phase 6 remaining architecture contracts corrected')
