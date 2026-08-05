// Gate 10 of the content hierarchy migration — the permanent anti-regression
// contract for the canonical vocabulary.
//
//   Subject → Module → Chapter → Screen → Component
//
//   module   = a parent curriculum unit (src/data/modules.js)
//   chapter  = one learner-facing journey (src/chapters.js)
//
// This test inspects semantic paths and exact identifiers. It deliberately
// does NOT ban the word "module": genuine parent-module code is legitimate and
// must keep reading naturally.
//
// Documented exceptions, and only these:
//
//   1. Historical storage-key migration — existing installs may still hold
//      gcse_module_<chapterId> data. Those keys are read, folded forward and
//      deleted; they are never created or updated. Confined to the files in
//      HISTORICAL_STORAGE_FILES.
//   2. Archived historical documents — docs/archive/, docs/superpowers/,
//      docs/content/**/Review_Log, .planning/. Rewriting them would rewrite the
//      historical record. They are not scanned, and must not be linked as the
//      current source of truth.
//   3. Genuine parent-module concepts — MODULES, getModuleById, module.chapterIds
//      and the parent-module walk in chapterNavigation.js.
//
// Exception 1 also covers one non-progress read: QuickFireMode reads a
// pre-rename `moduleId` off a persisted QuickFire topic bucket so a returning
// learner keeps their weak-topic link. It is read forward, never written.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(process.cwd())
const read = path => readFileSync(resolve(ROOT, path), 'utf8')

function filesUnder(dir, extensions) {
  const root = resolve(ROOT, dir)
  if (!existsSync(root)) return []
  const files = []
  for (const name of readdirSync(root)) {
    const full = resolve(root, name)
    if (statSync(full).isDirectory()) {
      files.push(...filesUnder(relative(ROOT, full), extensions))
    } else {
      const path = relative(ROOT, full).replaceAll('\\', '/')
      if (extensions.some(ext => path.endsWith(ext))) files.push(path)
    }
  }
  return files
}

const PRODUCTION_FILES = filesUnder('src', ['.js', '.jsx'])
const TEST_FILES = filesUnder('tests', ['.js', '.jsx'])
const TOOLING_FILES = [
  ...filesUnder('scripts', ['.mjs', '.js']),
  ...filesUnder('.claude/skills', ['.md']),
]

// Exception 1 — historical storage-key migration only.
const HISTORICAL_STORAGE_FILES = new Set([
  'src/data/chapterProgress.js',
  'src/lib/storage.js',
  'src/progress.js',
  'src/data/progressSync/progressSync.js',
  'src/data/progressSync/progressMerge.js',
  'src/data/progressSync/canonicalProgressMerge.js',
])

// Exception 3 — genuine parent-module surfaces.
const PARENT_MODULE_FILES = new Set([
  'src/data/modules.js',
  'src/data/contentHierarchy.js',
  'src/app/chapterNavigation.js',
])

// Anti-regression suites necessarily quote the identifiers they ban.
const BAN_LIST_TESTS = new Set([
  'tests/architecture/canonical-vocabulary.test.js',
  'tests/architecture/chapter-runtime-contract.test.js',
])

// Exception 4 — the curriculum catalogue's relationship records.
//
// `{ moduleId, position }` on a study pathway is the canonical parent-module
// relationship (ADR-0002 Decision 5). The rule below is about ROUTING payloads:
// a learner is routed to a chapter, never to a module, and that stays true —
// the catalogue routes nobody. It is build-time governance data with no runtime
// consumer, and its module records are parent-module surfaces in exactly the
// sense Exception 3 already recognises.
//
// A prefix rather than a file list, so Stage 2's module and pathway records are
// covered the day they land instead of the day someone remembers to add them.
const CURRICULUM_CATALOGUE_PREFIXES = [
  'src/curriculum-catalogue/',
  'tests/architecture/curriculum-catalogue-integrity.test.js',
]

function offenders(files, pattern, { allow = new Set(), allowPrefixes = [] } = {}) {
  return files
    .filter(path => !allow.has(path))
    .filter(path => !allowPrefixes.some(prefix => path.startsWith(prefix)))
    .filter(path => pattern.test(read(path)))
}

describe('canonical vocabulary — deleted hierarchy surfaces', () => {
  it('has no legacy hierarchy source or facade file on disk', () => {
    for (const path of [
      'src/modules.js',
      'src/components/layout/ModulePlayer.jsx',
      'src/app/moduleNavigation.js',
      'src/data/tagModuleMap.js',
      'src/components/core/ModuleToolbar.jsx',
    ]) {
      expect(existsSync(resolve(ROOT, path)), path).toBe(false)
    }
  })

  it('owns chapter metadata only in src/chapters.js', () => {
    const chapters = read('src/chapters.js')
    for (const exported of [
      'CHAPTERS', 'CHAPTER_AVAILABILITY', 'getChapterAvailability', 'isChapterAvailable',
    ]) {
      expect(chapters, exported).toMatch(new RegExp(`export (?:const|function) ${exported}\\b`))
    }
    // No other production file may re-export the chapter catalogue.
    //
    // The Stage 3 projection under src/data/generated/curriculum/ is exempt: it
    // declares the same symbols by design, and is not a second owner because
    // nothing imports it. That last part is the load-bearing half, so it is
    // asserted here rather than taken on trust.
    const GENERATED_PROJECTION = 'src/data/generated/curriculum/'
    const reExporters = PRODUCTION_FILES
      .filter(path => path !== 'src/chapters.js')
      .filter(path => !path.startsWith(GENERATED_PROJECTION))
      .filter(path => /export\s+const\s+CHAPTERS\b/.test(read(path)))
    expect(reExporters).toEqual([])

    const reaches = /(?:from\s*|import\s*\(?\s*)['"][^'"]*generated\/curriculum\//
    const importers = PRODUCTION_FILES
      .filter(path => !path.startsWith(GENERATED_PROJECTION))
      .filter(path => reaches.test(read(path)))
    expect(importers, 'the Stage 3 projection is wired in — that is Stage 4').toEqual([])
  })

  it('imports nothing from the deleted root chapter catalogue', () => {
    const pattern = /(?:from|import\()\s*['"][^'"]*(?:^|\/)modules\.js['"]/m
    const importsRootModules = path => {
      const source = read(path)
      return /(?:from|import\()\s*['"]((?:\.\.?\/)+)modules\.js['"]/.test(source)
    }
    expect(PRODUCTION_FILES.filter(importsRootModules)).toEqual([])
    expect(TEST_FILES.filter(importsRootModules)).toEqual([])
    expect(pattern).toBeInstanceOf(RegExp)
  })

  it('references neither ModulePlayer nor moduleNavigation anywhere live', () => {
    for (const identifier of ['ModulePlayer', 'moduleNavigation']) {
      const pattern = new RegExp(`\\b${identifier}\\b`)
      expect(offenders(PRODUCTION_FILES, pattern), identifier).toEqual([])
      expect(offenders(TEST_FILES, pattern, { allow: BAN_LIST_TESTS }), identifier).toEqual([])
      expect(offenders(TOOLING_FILES, pattern), identifier).toEqual([])
    }
  })
})

describe('canonical vocabulary — progress and hierarchy APIs', () => {
  // Exact identifiers, not a "module" substring sweep.
  const FORBIDDEN_IDENTIFIERS = [
    'MODULE_GROUPS',
    'getModuleState',
    'saveModuleState',
    'getModulePct',
    'getContinueModule',
    'getInProgressModule',
    'computeInitialModuleState',
    'getModuleGate',
    'prepareModuleScreenState',
    'completeModule',
    'openModulePlayer',
    'loadModuleContent',
    'MODULE_CONTENT_LOADERS',
    'LEGACY_CONTENT_NAMES',
    'hasInProgressModule',
    'getInProgressModuleForSubject',
    'getNextNewModuleForSubject',
    'TAG_MODULE_MAP',
    'findTaggedScreen',
    'onOpenModule',
    'ModulesTab',
    'getSubjectModuleList',
  ]

  it('exposes no legacy chapter API alias from production source', () => {
    for (const identifier of FORBIDDEN_IDENTIFIERS) {
      const pattern = new RegExp(`\\b${identifier}\\b`)
      expect(offenders(PRODUCTION_FILES, pattern), identifier).toEqual([])
    }
  })

  it('leaves no legacy chapter API alias in tests or developer tooling', () => {
    for (const identifier of FORBIDDEN_IDENTIFIERS) {
      const pattern = new RegExp(`\\b${identifier}\\b`)
      expect(offenders(TEST_FILES, pattern, { allow: BAN_LIST_TESTS }), identifier).toEqual([])
      expect(offenders(TOOLING_FILES, pattern), identifier).toEqual([])
    }
  })

  it('keeps the canonical chapter progress API present', () => {
    const progress = read('src/progress.js')
    for (const canonical of [
      'getChapterState', 'saveChapterState', 'getChapterPct',
      'getContinueChapter', 'getInProgressChapter',
    ]) {
      expect(progress, canonical).toContain(`export function ${canonical}`)
    }
  })
})

describe('canonical vocabulary — payload and route semantics', () => {
  it('names no payload field moduleId — a routed journey is a chapter', () => {
    // The property-assignment form only. `moduleIdx`, `moduleIds` and a
    // getModuleById(moduleId) parameter are genuine parent-module code.
    const pattern = /\bmoduleId\s*:/
    const allowPrefixes = CURRICULUM_CATALOGUE_PREFIXES
    expect(offenders(PRODUCTION_FILES, pattern, { allow: PARENT_MODULE_FILES, allowPrefixes })).toEqual([])
    expect(offenders(TEST_FILES, pattern, { allow: BAN_LIST_TESTS, allowPrefixes })).toEqual([])
  })

  it('still bans moduleId: everywhere the exceptions do not reach', () => {
    // The exception is narrow by construction: it names the curriculum
    // catalogue and nothing else, so the routing rule keeps its force.
    const pattern = /\bmoduleId\s*:/
    const unguarded = PRODUCTION_FILES
      .filter(path => !CURRICULUM_CATALOGUE_PREFIXES.some(prefix => path.startsWith(prefix)))
      .filter(path => !PARENT_MODULE_FILES.has(path))
    expect(unguarded.length).toBeGreaterThan(50)
    expect(offenders(unguarded, pattern)).toEqual([])
  })

  it('offers ?chapter= as the only direct developer route', () => {
    const legacyRoute = /\?module=/
    expect(offenders(PRODUCTION_FILES, legacyRoute)).toEqual([])
    expect(offenders(TOOLING_FILES, legacyRoute)).toEqual([])
    expect(read('src/app/LegacyApp.jsx')).toContain("params.get('chapter')")
    expect(read('src/app/LegacyApp.jsx')).not.toContain("params.get('module')")
  })
})

describe('canonical vocabulary — active authoring surfaces', () => {
  // Current, authoritative instructions must name canonical surfaces. Archived
  // plans and historical decision records are exception 2 and are not scanned.
  const AUTHORING_SURFACES = [
    'CLAUDE.md',
    'docs/system/CONTENT_HIERARCHY.md',
    'docs/system/00_SYSTEM_INDEX.md',
    'docs/system/SCREEN_REGISTRY.md',
    'docs/system/DEVELOPMENT_WORKFLOW.md',
    'docs/components/COMPONENT_REGISTRY.md',
    '.claude/skills/chapter-creation/SKILL.md',
    '.claude/skills/gcse-content-registry/SKILL.md',
    '.claude/skills/content-create/SKILL.md',
  ].filter(path => existsSync(resolve(ROOT, path)))

  it('names no deleted path or command', () => {
    for (const path of AUTHORING_SURFACES) {
      const text = read(path)
      for (const legacy of [
        'src/modules.js', 'ModulePlayer', 'moduleNavigation', 'module-creation',
        'moduleContentRegistry.js', 'MODULE_CONTENT_LOADERS', 'loadModuleContent',
        '?module=',
      ]) {
        expect(text, `${path}: ${legacy}`).not.toContain(legacy)
      }
    }
  })

  it('points chapter authors at the canonical surfaces', () => {
    const text = AUTHORING_SURFACES.map(read).join('\n')
    for (const canonical of [
      'src/chapters.js',
      'src/data/modules.js',
      'CHAPTER_CONTENT_LOADERS',
      'screenRegistry.js',
      'ScreenRenderer',
      'ChapterPlayer',
    ]) {
      expect(text, canonical).toContain(canonical)
    }
  })
})

describe('canonical vocabulary — runtime routing boundary', () => {
  it('keeps component routing out of ChapterPlayer', () => {
    const player = read('src/components/layout/ChapterPlayer.jsx')
    expect(player).toContain('ScreenRenderer')
    // New screen types are registered in screenRegistry.js and routed in
    // ScreenRenderer.jsx — never branched on inside the lifecycle runtime.
    expect(player).not.toMatch(/screen\.type\s*===\s*['"]/)
    expect(player).not.toMatch(/SCREEN_REGISTRY\s*\[/)
    expect(player).not.toMatch(/BLOCK_REGISTRY\s*\[/)
  })
})

describe('canonical vocabulary — historical storage exception', () => {
  it('confines gcse_module_ handling to the documented migration files', () => {
    const pattern = /gcse_module_/
    expect(offenders(PRODUCTION_FILES, pattern, { allow: HISTORICAL_STORAGE_FILES })).toEqual([])
  })

  it('never creates or updates a historical chapter progress key', () => {
    const progress = read('src/progress.js')
    // Both writes target the canonical key; historical copies are only removed.
    expect(progress).toContain('const saved = saveCritical(canonicalKey, nextState)')
    expect(progress).toContain('const migrated = setJson(canonicalKey, state)')
    expect(progress).not.toMatch(/set(?:Json|RawJson)\(\s*legacy/i)
    expect(read('src/data/chapterProgress.js')).toContain("export const CHAPTER_PROGRESS_KEY_PREFIX = 'gcse_chapter_'")
  })
})
