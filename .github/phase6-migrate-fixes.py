from pathlib import Path
import re


def write(path, content):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


ACTIVE_ROOTS = [
    Path('src'), Path('tests'), Path('docs/system'), Path('docs/components'),
    Path('docs/workflows'), Path('docs/canonical'), Path('docs/content'),
    Path('.claude/skills'),
]
ACTIVE_FILES = [Path('CLAUDE.md'), Path('COMPONENTS.md')]
EXTENSIONS = {'.js', '.jsx', '.mjs', '.md', '.sh', '.json'}
SKIP_PARTS = {'archive', 'superpowers', 'node_modules', 'dist', 'coverage'}


def active_files():
    seen = set()
    for root in ACTIVE_ROOTS:
        if not root.exists():
            continue
        for path in root.rglob('*'):
            if not path.is_file() or path.suffix not in EXTENSIONS:
                continue
            if any(part in SKIP_PARTS for part in path.parts):
                continue
            if path in seen:
                continue
            seen.add(path)
            yield path
    for path in ACTIVE_FILES:
        if path.exists() and path not in seen:
            yield path


# Root chapter metadata paths can contain an intermediate src/ segment. Replace
# only the former root catalogue, never canonical src/data/modules.js.
for path in list(active_files()):
    if path == Path('src/data/legacyChapterReferences.js'):
        continue
    text = path.read_text(encoding='utf-8')
    text = text.replace('src/modules.js', 'src/chapters.js')
    text = re.sub(
        r"(?P<quote>['\"])(?P<rel>(?:\.\.?/)+)(?P<src>src/)?modules\.js(?P=quote)",
        lambda m: m.group('quote') + m.group('rel') + (m.group('src') or '') + 'chapters.js' + m.group('quote'),
        text,
    )
    text = re.sub(
        r"import\s*\{\s*MODULES\s*\}\s*from\s*(['\"][^'\"]*chapters\.js['\"])",
        r'import { CHAPTERS } from \1',
        text,
    )
    text = text.replace('const { MODULES } = await import(', 'const { CHAPTERS } = await import(')
    # Undo the first pass's accidental replacement in legitimate parent-module imports.
    text = re.sub(
        r"import\s*\{\s*CHAPTERS\s*\}\s*from\s*(['\"][^'\"]*data/modules\.js['\"])",
        r'import { MODULES } from \1',
        text,
    )
    path.write_text(text, encoding='utf-8')

# Remove self-aliases produced when old compatibility exports were renamed before
# their removal regex ran.
progress_path = Path('src/progress.js')
progress = progress_path.read_text(encoding='utf-8')
progress = re.sub(
    r"\nexport const (getChapterState|saveChapterState|getChapterPct|getContinueChapter|getInProgressChapter) = \1\n",
    '\n',
    progress,
)
progress = re.sub(r"\nexport const MODULES = MODULES\n", '\n', progress)
progress_path.write_text(progress, encoding='utf-8')

# Canonical hierarchy architecture test: no compatibility imports remain.
write('tests/architecture/content-hierarchy.test.js', """import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import {
  CONTENT_HIERARCHY,
  CONTENT_LEVELS,
  validateContentHierarchy,
} from '../../src/data/contentHierarchy.js'

describe('Canonical content hierarchy', () => {
  it('locks the product hierarchy in one order', () => {
    expect(CONTENT_HIERARCHY).toEqual([
      CONTENT_LEVELS.SUBJECT,
      CONTENT_LEVELS.MODULE,
      CONTENT_LEVELS.CHAPTER,
      CONTENT_LEVELS.SCREEN,
      CONTENT_LEVELS.COMPONENT,
    ])
  })

  it('uses canonical catalogue ownership without compatibility aliases', () => {
    expect(Array.isArray(CHAPTERS)).toBe(true)
    expect(Array.isArray(MODULES)).toBe(true)
  })
})

describe('Current content relationships', () => {
  it('satisfies the canonical module-to-chapter relationship contract', () => {
    expect(validateContentHierarchy({ chapters: CHAPTERS, modules: MODULES })).toEqual([])
  })

  it('reports broken parent-child relationships with actionable messages', () => {
    const errors = validateContentHierarchy({
      chapters: [
        { id: 'shared', subject: 'History' },
        { id: 'shared', subject: 'History' },
      ],
      modules: [
        { id: 'history-module', subject: 'History', chapterIds: ['shared', 'shared', 'missing'] },
        { id: 'science-module', subject: 'Science', chapterIds: ['shared'] },
      ],
    })
    expect(errors).toContain('Duplicate chapter id "shared"')
    expect(errors).toContain('Module "history-module" contains chapter "shared" more than once')
    expect(errors).toContain('Module "history-module" references unknown chapter "missing"')
    expect(errors).toContain('Chapter "shared" belongs to both "history-module" and "science-module"')
    expect(errors).toContain('Module "science-module" is Science but chapter "shared" is History')
  })
})
""")

# This test combines the chapter catalogue with legitimate parent modules, so
# preserve the two distinct names explicitly.
write('tests/architecture/module-availability.test.js', """import { describe, it, expect } from 'vitest'
import {
  CHAPTERS,
  isChapterAvailable,
  getChapterAvailability,
  CHAPTER_AVAILABILITY,
} from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'
import { TAG_CHAPTER_MAP } from '../../src/data/tagChapterMap.js'

const chapterById = new Map(CHAPTERS.map(chapter => [chapter.id, chapter]))

describe('Chapter availability — derivation', () => {
  it('derives availability from screenCount when not explicitly set', () => {
    expect(getChapterAvailability({ screenCount: 5 })).toBe(CHAPTER_AVAILABILITY.AVAILABLE)
    expect(getChapterAvailability({ screenCount: 0 })).toBe(CHAPTER_AVAILABILITY.COMING_SOON)
    expect(getChapterAvailability(null)).toBe(CHAPTER_AVAILABILITY.HIDDEN)
  })

  it('an explicit availability field overrides the screenCount derivation', () => {
    expect(getChapterAvailability({ screenCount: 5, availability: 'hidden' })).toBe('hidden')
    expect(getChapterAvailability({ screenCount: 0, availability: 'available' })).toBe('available')
  })

  it('every available chapter has real, loadable content', async () => {
    for (const chapter of CHAPTERS.filter(isChapterAvailable)) {
      expect(chapter.screenCount, `${chapter.id} available but screenCount 0`).toBeGreaterThan(0)
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      expect(loader, `${chapter.id} available but has no content loader`).toBeTypeOf('function')
      const content = await loader()
      expect(content.screens.length, `${chapter.id} available but loads no screens`).toBeGreaterThan(0)
    }
  })

  it('every explicitly non-available metadata value is a known governance state', () => {
    for (const chapter of CHAPTERS) {
      if (!chapter.availability) continue
      expect(Object.values(CHAPTER_AVAILABILITY)).toContain(chapter.availability)
    }
  })
})

describe('Module and chapter discovery safety', () => {
  it('every chapter a module can select is real metadata, never a dangling id', () => {
    for (const module of MODULES) {
      for (const chapterId of module.chapterIds) {
        expect(chapterById.has(chapterId), `Module "${module.id}" references unknown chapter "${chapterId}"`).toBe(true)
      }
    }
  })

  it('weak-spot recovery never targets a non-available chapter', () => {
    for (const [tag, target] of Object.entries(TAG_CHAPTER_MAP)) {
      if (target === null) continue
      const chapter = chapterById.get(target)
      expect(isChapterAvailable(chapter), `tag "${tag}" recovery-routes to "${target}", which is not available`).toBe(true)
    }
  })
})
""")

# Runtime test should assert canonical files directly, not rename its former
# negative assertions into checks against the new names.
write('tests/architecture/chapter-runtime-contract.test.js', """import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.cwd())
const srcRoot = resolve(root, 'src')
const read = path => readFileSync(resolve(root, path), 'utf8')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [path] : []
  })
}

const sources = walk(srcRoot).map(path => ({
  path: relative(root, path).replaceAll('\\\\', '/'),
  content: readFileSync(path, 'utf8'),
}))

describe('canonical chapter runtime', () => {
  it('ChapterPlayer is the only chapter runtime surface', () => {
    const canonical = read('src/components/layout/ChapterPlayer.jsx')
    expect(canonical).toContain('export default function ChapterPlayer(props)')
    expect(canonical).toContain('function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete })')
    expect(canonical).toContain('computeInitialChapterState(chapter, saved)')
    expect(canonical).toContain('getChapterGate(chapter,')
    expect(existsSync(resolve(root, 'src/components/layout/ModulePlayer.jsx'))).toBe(false)
    expect(existsSync(resolve(root, 'src/app/moduleNavigation.js'))).toBe(false)
  })

  it('production source imports only the canonical player and navigation implementation', () => {
    const playerViolators = sources.filter(source => /ModulePlayer\.jsx/.test(source.content)).map(source => source.path)
    const navigationViolators = sources.filter(source => /moduleNavigation\.js/.test(source.content)).map(source => source.path)
    expect(playerViolators).toEqual([])
    expect(navigationViolators).toEqual([])
  })

  it('LegacyApp uses chapter state, actions, loader and overlay names', () => {
    const source = read('src/app/LegacyApp.jsx')
    expect(source).toContain('activeChapter')
    expect(source).toContain('openChapterPlayer')
    expect(source).toContain('loadChapterContent')
    expect(source).toContain("view === 'chapter'")
  })
})
""")

# The anti-regression contract must not count its own forbidden-pattern literals
# or the migration adapter's focused unit fixture.
write('tests/architecture/canonical-content-vocabulary.test.js', """import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.cwd())
const activeRoots = [
  'src', 'tests', 'docs/system', 'docs/components', 'docs/workflows',
  'docs/canonical', 'docs/content', '.claude/skills',
]
const activeFiles = ['CLAUDE.md', 'COMPONENTS.md']
const skipped = new Set(['archive', 'superpowers', 'node_modules', 'dist', 'coverage'])

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return skipped.has(entry.name) ? [] : walk(path)
    return /\.(js|jsx|mjs|md|sh|json)$/.test(entry.name) ? [path] : []
  })
}

const self = 'tests/architecture/canonical-content-vocabulary.test.js'
const fixtures = new Set([self, 'tests/unit/data/legacyChapterReferences.test.js'])
const files = [
  ...activeRoots.flatMap(path => walk(resolve(root, path))),
  ...activeFiles.map(path => resolve(root, path)).filter(existsSync),
].map(path => ({ path: relative(root, path).replaceAll('\\\\', '/'), content: readFileSync(path, 'utf8') }))
  .filter(file => file.path !== self)

function offenders(pattern, allow = []) {
  const allowed = new Set(allow)
  return files.filter(file => !allowed.has(file.path) && pattern.test(file.content)).map(file => file.path).sort()
}

describe('canonical content vocabulary', () => {
  it('removes completed compatibility files and authoring paths', () => {
    for (const path of [
      'src/modules.js', 'src/components/layout/ModulePlayer.jsx', 'src/app/moduleNavigation.js',
      'src/content/moduleContentRegistry.js', 'src/data/tagModuleMap.js', '.claude/skills/module-creation',
    ]) expect(existsSync(resolve(root, path)), path).toBe(false)
    expect(existsSync(resolve(root, '.claude/skills/chapter-creation/SKILL.md'))).toBe(true)
  })

  it('blocks legacy runtime, registry and progress APIs from active surfaces', () => {
    const pattern = /\bModulePlayer\b|\bmoduleNavigation\b|\bMODULE_CONTENT_LOADERS\b|\bTAG_MODULE_MAP\b|\bMODULE_GROUPS\b|\bgetModuleState\b|\bsaveModuleState\b|\bgetModulePct\b|\bgetContinueModule\b|\bgetInProgressModule\b/
    expect(offenders(pattern)).toEqual([])
  })

  it('allows historical chapter reference fields only in the read-only migration adapter and its test', () => {
    expect(offenders(/\bmoduleId\b|kind:\s*['\"]module['\"]/, ['src/data/legacyChapterReferences.js', ...fixtures])).toEqual([])
  })

  it('keeps canonical chapter source, loader and recovery map as the only authoring surfaces', () => {
    expect(offenders(/\bsrc\/modules\.js\b|moduleContentRegistry\.js|tagModuleMap\.js/)).toEqual([])
    const registry = readFileSync(resolve(root, 'docs/components/COMPONENT_REGISTRY.md'), 'utf8')
    expect(registry).toContain('ChapterPlayer')
    expect(registry).toContain('ScreenRenderer')
  })
})
""")

print('Phase 6 migration corrections applied')
