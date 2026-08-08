from pathlib import Path
import re
import shutil

ROOT = Path('.')


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, content):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one anchor, found {count}')
    return text.replace(old, new)


def remove_if_exists(path):
    path = Path(path)
    if path.exists():
        path.unlink()


# ── 1. Move chapter metadata to its canonical source ──────────────────────────
legacy_metadata = read('src/modules.js')
if 'export const MODULES = [' not in legacy_metadata:
    raise SystemExit('legacy chapter metadata export anchor missing')
chapters = legacy_metadata
chapters = replace_once(chapters, 'export const MODULES = [', 'export const CHAPTERS = [', 'chapter metadata export')
chapters = chapters.replace('MODULE_AVAILABILITY', 'CHAPTER_AVAILABILITY')
chapters = chapters.replace('getModuleAvailability', 'getChapterAvailability')
chapters = chapters.replace('isModuleAvailable', 'isChapterAvailable')
chapters = chapters.replace('// ─── Module metadata', '// ─── Chapter metadata', 1)
chapters = chapters.replace('// Lightweight metadata for all modules', '// Lightweight metadata for all chapters', 1)
chapters = chapters.replace('when a module is', 'when a chapter is')
chapters = chapters.replace('full module', 'full chapter')
chapters = chapters.replace('module (was screens.length)', 'chapter (was screens.length)')
chapters = chapters.replace('whether a module is real', 'whether a chapter is real')
chapters = chapters.replace('A module may set', 'A chapter may set')
chapters = chapters.replace('True only for modules a learner', 'True only for chapters a learner')
chapters = chapters.replace('gate module selection', 'gate chapter selection')
chapters = chapters.replace('empty module', 'empty chapter')
chapters = chapters.replace('module unreachable', 'chapter unreachable')
chapters = chapters.replace('module is', 'chapter is')
chapters = chapters.replace('module\'s', 'chapter\'s')
write('src/chapters.js', chapters)
remove_if_exists('src/modules.js')

# ── 2. Remove runtime/data compatibility facades and duplicate legacy tests ──
for path in [
    'src/components/layout/ModulePlayer.jsx',
    'src/app/moduleNavigation.js',
    'src/content/moduleContentRegistry.js',
    'src/data/tagModuleMap.js',
    'tests/unit/app/moduleNavigation.test.js',
    'tests/unit/modulePlayer/compatibility.test.js',
    'tests/unit/modulePlayer/lifecycle.test.js',
]:
    remove_if_exists(path)
module_player_tests = Path('tests/unit/modulePlayer')
if module_player_tests.exists() and not any(module_player_tests.iterdir()):
    module_player_tests.rmdir()

# ── 3. Rename the active chapter-authoring skill and one architecture test ───
old_skill = Path('.claude/skills/module-creation')
new_skill = Path('.claude/skills/chapter-creation')
if old_skill.exists():
    if new_skill.exists():
        shutil.rmtree(new_skill)
    old_skill.rename(new_skill)
old_contract = Path('tests/architecture/extracted-module-contract.test.js')
new_contract = Path('tests/architecture/extracted-chapter-contract.test.js')
if old_contract.exists():
    old_contract.rename(new_contract)

# ── 4. One explicit read-only adapter for old saved chapter references ────────
write('src/data/legacyChapterReferences.js', """// Read-only migration boundary for records written before the hierarchy migration.
// New code must write `chapterId` and `kind: 'chapter'`. Only this file may read
// the historical field/kind so existing learner confidence, quick-fire memory,
// planner tasks and examiner attempts remain usable.

export function canonicalizeChapterReference(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const chapterId = value.chapterId ?? value.moduleId ?? null
  const { moduleId: _legacyModuleId, ...rest } = value
  return chapterId == null ? rest : { ...rest, chapterId }
}

export function canonicalizeChapterReferences(values) {
  return Array.isArray(values) ? values.map(canonicalizeChapterReference) : []
}

export function canonicalizeChapterState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return state || {}
  const next = { ...state }
  if (Array.isArray(next.examinerAttempts)) {
    next.examinerAttempts = canonicalizeChapterReferences(next.examinerAttempts)
  }
  return next
}

export function canonicalizeQuickFireMemory(memory) {
  if (!memory || typeof memory !== 'object') return { subjects: {}, topics: {} }
  const topics = Object.fromEntries(
    Object.entries(memory.topics || {}).map(([key, bucket]) => [key, canonicalizeChapterReference(bucket)]),
  )
  return { ...memory, subjects: memory.subjects || {}, topics }
}

export function canonicalizeTaskSelection(selection) {
  const next = canonicalizeChapterReference(selection)
  if (!next || typeof next !== 'object') return next
  return next.kind === 'module' ? { ...next, kind: 'chapter' } : next
}

export function canonicalizeProgressSnapshot(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  const next = { ...data }
  if (Array.isArray(next.gcse_confidence)) {
    next.gcse_confidence = canonicalizeChapterReferences(next.gcse_confidence)
  }
  if (next.gcse_quickfire_memory_v1) {
    next.gcse_quickfire_memory_v1 = canonicalizeQuickFireMemory(next.gcse_quickfire_memory_v1)
  }
  for (const [key, value] of Object.entries(next)) {
    if (/^gcse_(?:chapter|module)_/.test(key)) next[key] = canonicalizeChapterState(value)
  }
  return next
}
""")

# ── 5. Canonical path/symbol sweep across active source, tests and guidance ───
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


GLOBAL_REPLACEMENTS = [
    ('moduleContentRegistry.js', 'chapterContentRegistry.js'),
    ('MODULE_CONTENT_LOADERS', 'CHAPTER_CONTENT_LOADERS'),
    ('tagModuleMap.js', 'tagChapterMap.js'),
    ('TAG_MODULE_MAP', 'TAG_CHAPTER_MAP'),
    ('findTaggedScreen', 'findTaggedChapterScreen'),
    ('ModulePlayer.jsx', 'ChapterPlayer.jsx'),
    ('ModulePlayer', 'ChapterPlayer'),
    ('moduleNavigation.js', 'chapterNavigation.js'),
    ('computeInitialModuleState', 'computeInitialChapterState'),
    ('prepareModuleScreenState', 'prepareChapterScreenState'),
    ('getModuleGate', 'getChapterGate'),
    ('getModuleState', 'getChapterState'),
    ('saveModuleState', 'saveChapterState'),
    ('getModulePct', 'getChapterPct'),
    ('getContinueModule', 'getContinueChapter'),
    ('getInProgressModule', 'getInProgressChapter'),
    ('activeModule', 'activeChapter'),
    ('openModulePlayer', 'openChapterPlayer'),
    ('loadModuleContent', 'loadChapterContent'),
    ('completeModule', 'completeChapter'),
    ('QUESTION_BANKS_BY_MODULE', 'QUESTION_BANKS_BY_TOPIC'),
    ('ALL_MODULE_QUICKFIRE_QUESTIONS', 'ALL_TOPIC_QUICKFIRE_QUESTIONS'),
    ('module-creation', 'chapter-creation'),
    ('Module creation', 'Chapter creation'),
    ('module creation', 'chapter creation'),
    ('module-building', 'chapter-building'),
    ('module builder', 'chapter builder'),
]

for path in list(active_files()):
    # The adapter is the sole intentional reader of historical vocabulary.
    if path == Path('src/data/legacyChapterReferences.js'):
        continue
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in GLOBAL_REPLACEMENTS:
        text = text.replace(old, new)

    # Root chapter catalogue imports only; preserve canonical parent modules.
    text = re.sub(
        r"(?P<prefix>(?:from\s+|import\()['\"])(?P<path>(?:\.\.?/)+)modules\.js(?P<suffix>['\"]\)?)",
        lambda m: m.group('prefix') + m.group('path') + 'chapters.js' + m.group('suffix'),
        text,
    )
    if 'chapters.js' in text:
        # Imports from the chapter catalogue used its former MODULES export.
        text = re.sub(r'import\s*\{\s*MODULES\s*,\s*isModuleAvailable\s*\}', 'import { CHAPTERS, isChapterAvailable }', text)
        text = re.sub(r'import\s*\{\s*MODULES\s*\}', 'import { CHAPTERS }', text)
        text = text.replace('const { MODULES } = await import(', 'const { CHAPTERS } = await import(')
        text = text.replace('isModuleAvailable', 'isChapterAvailable')

    # Outside the parent-module catalogue and hierarchy validator, moduleId was
    # the old name for a learner chapter id.
    if path not in {Path('src/data/modules.js'), Path('src/data/contentHierarchy.js')}:
        text = re.sub(r'\bmoduleIds\b', 'chapterIds', text)
        text = re.sub(r'\bmoduleId\b', 'chapterId', text)
        text = text.replace("kind: 'module'", "kind: 'chapter'")
        text = text.replace('kind === \'module\'', "kind === 'chapter'")

    if text != original:
        path.write_text(text, encoding='utf-8')

# Correct chapter-catalogue symbols in files whose import and use span lines.
for path in list(active_files()):
    if path == Path('src/data/legacyChapterReferences.js'):
        continue
    text = path.read_text(encoding='utf-8')
    if re.search(r"from\s+['\"][^'\"]*chapters\.js['\"]", text) or re.search(r"import\(['\"][^'\"]*chapters\.js['\"]\)", text):
        text = re.sub(r'\bMODULES\b', 'CHAPTERS', text)
    path.write_text(text, encoding='utf-8')

# ── 6. Source-specific semantic fixes ─────────────────────────────────────────
progress_path = Path('src/progress.js')
progress = progress_path.read_text(encoding='utf-8')
progress = progress.replace("import { MODULES } from './data/modules.js'\n", "import { MODULES } from './data/modules.js'\nimport { canonicalizeChapterReferences, canonicalizeChapterState } from './data/legacyChapterReferences.js'\n")
progress = re.sub(
    r"\n// Temporary compatibility export\.[\s\S]*?export const MODULE_GROUPS = MODULES\n",
    '\n',
    progress,
    count=1,
)
progress = progress.replace('export function getAllConfidenceRatings() {\n  return readArr(CONFIDENCE_KEY)\n}', 'export function getAllConfidenceRatings() {\n  return canonicalizeChapterReferences(readArr(CONFIDENCE_KEY))\n}')
progress = progress.replace('return { canonicalKey, found, state: state || {} }', 'return { canonicalKey, found, state: canonicalizeChapterState(state || {}) }')
progress = progress.replace('let nextState = state', 'let nextState = canonicalizeChapterState(state)')
progress = re.sub(
    r"\n// Temporary compatibility aliases\.[\s\S]*?export const getModulePct = getChapterPct\n",
    '\n',
    progress,
    count=1,
)
progress = re.sub(
    r"\n// Temporary compatibility aliases for existing runtime callers\.[\s\S]*?export const getInProgressModule = getInProgressChapter\n",
    '\n',
    progress,
    count=1,
)
progress = progress.replace('// Keyed by the current legacy chapterId field, stored in a shared array.\n// Phase 3 migrates this terminology alongside chapter persistence.\n', '// Confidence records are canonicalised to chapterId on read; older moduleId\n// records are accepted only by legacyChapterReferences.js.\n')
progress_path.write_text(progress, encoding='utf-8')

qf_memory_path = Path('src/features/quickfire/logic/quickFireMemory.js')
qf_memory = qf_memory_path.read_text(encoding='utf-8')
qf_memory = qf_memory.replace("import { qfQuestionId } from './questionId.js'\n", "import { qfQuestionId } from './questionId.js'\nimport { canonicalizeQuickFireMemory } from '../../../data/legacyChapterReferences.js'\n")
qf_memory = qf_memory.replace('return getJson(QUICK_FIRE_MEMORY_KEY, { subjects: {}, topics: {} })', 'return canonicalizeQuickFireMemory(getJson(QUICK_FIRE_MEMORY_KEY, { subjects: {}, topics: {} }))')
qf_memory_path.write_text(qf_memory, encoding='utf-8')

canonical_merge_path = Path('src/data/progressSync/canonicalProgressMerge.js')
canonical_merge = canonical_merge_path.read_text(encoding='utf-8')
canonical_merge = canonical_merge.replace("} from '../chapterProgress.js'\n", "} from '../chapterProgress.js'\nimport { canonicalizeProgressSnapshot } from '../legacyChapterReferences.js'\n")
canonical_merge = canonical_merge.replace('for (const [key, value] of Object.entries(canonicalizeChapterProgressData(data))) {', 'for (const [key, value] of Object.entries(canonicalizeChapterProgressData(canonicalizeProgressSnapshot(data)))) {')
canonical_merge = canonical_merge.replace('  return merged\n}', '  return canonicalizeProgressSnapshot(merged)\n}', 1)
canonical_merge_path.write_text(canonical_merge, encoding='utf-8')

navigation_path = Path('src/app/chapterNavigation.js')
navigation = navigation_path.read_text(encoding='utf-8')
navigation = navigation.replace("import { CHAPTERS } from '../chapters.js'\n", "import { CHAPTERS } from '../chapters.js'\nimport { canonicalizeTaskSelection } from '../data/legacyChapterReferences.js'\n")
navigation = navigation.replace('  const sel = task?.onSelect', '  const sel = canonicalizeTaskSelection(task?.onSelect)')
navigation = navigation.replace("  if (sel.kind === 'chapter' || sel.kind === 'chapter') {\n    const chapterId = sel.chapterId || sel.chapterId", "  if (sel.kind === 'chapter') {\n    const chapterId = sel.chapterId")
navigation_path.write_text(navigation, encoding='utf-8')

# Remove the unused getQuestionsByModule compatibility function after the symbol sweep.
question_registry_path = Path('src/data/questionBanks/questionRegistry.js')
question_registry = question_registry_path.read_text(encoding='utf-8')
question_registry = re.sub(
    r"\nexport function getQuestionsByModule\(chapterId\) \{\n  return QUESTION_BANKS_BY_TOPIC\[chapterId\] \|\| \[\]\n\}\n",
    '\n',
    question_registry,
    count=1,
)
question_registry = question_registry.replace('from module banks', 'from topic banks')
question_registry_path.write_text(question_registry, encoding='utf-8')

# Planner names: these helpers select learner chapters within a parent module.
planner_path = Path('src/features/planner/dailyPlanner.js')
planner = planner_path.read_text(encoding='utf-8')
for old, new in [
    ('PARENT_MODULES', 'MODULES'),
    ('hasInProgressModule', 'hasInProgressChapter'),
    ('getInProgressModuleForSubject', 'getInProgressChapterForSubject'),
    ('getNextNewModuleForSubject', 'getNextNewChapterForSubject'),
    ('mainMod', 'mainChapter'),
]:
    planner = planner.replace(old, new)
planner = planner.replace('const mod = CHAPTERS.find(m => m.id === id)', 'const chapter = CHAPTERS.find(candidate => candidate.id === id)')
planner = planner.replace('if (mod && isChapterAvailable(mod)) return mod', 'if (chapter && isChapterAvailable(chapter)) return chapter')
planner = planner.replace('in-progress:    +3     continuity bonus for mid-module work', 'in-progress:    +3     continuity bonus for mid-chapter work')
planner = planner.replace('into an empty module.', 'into an empty chapter.')
planner_path.write_text(planner, encoding='utf-8')

subjects_path = Path('src/features/subjects/Subjects.jsx')
subjects = subjects_path.read_text(encoding='utf-8').replace('biggestWinModule', 'biggestWinChapter')
subjects_path.write_text(subjects, encoding='utf-8')

# Chapter completion metadata fallbacks are chapter records, not parent modules.
complete_path = Path('src/components/layout/ChapterCompleteScreen.jsx')
complete = complete_path.read_text(encoding='utf-8')
complete = complete.replace('matchedModule', 'matchedChapter').replace('matchedNextModule', 'matchedNextChapter')
complete_path.write_text(complete, encoding='utf-8')

# Remove the completed legacy-name map from the hierarchy contract.
hierarchy_path = Path('src/data/contentHierarchy.js')
hierarchy = hierarchy_path.read_text(encoding='utf-8')
hierarchy = re.sub(
    r"\n// Temporary migration map\.[\s\S]*?\n\}\)\n",
    '\n',
    hierarchy,
    count=1,
)
hierarchy_path.write_text(hierarchy, encoding='utf-8')

# Content hierarchy tests now assert canonical ownership only.
hierarchy_test = Path('tests/architecture/content-hierarchy.test.js')
text = hierarchy_test.read_text(encoding='utf-8')
text = re.sub(r"import \{ MODULES as LEGACY_CHAPTERS \}[^\n]*\n", '', text)
text = re.sub(r"import \{ MODULE_GROUPS as LEGACY_MODULES \}[^\n]*\n", '', text)
text = text.replace('  LEGACY_CONTENT_NAMES,\n', '')
text = re.sub(
    r"\n  it\('records the current legacy names[\s\S]*?\n  \}\)\n\n  it\('keeps compatibility exports[\s\S]*?\n  \}\)\n",
    '\n  it(\'uses canonical catalogue ownership without compatibility aliases\', () => {\n    expect(Array.isArray(CHAPTERS)).toBe(true)\n    expect(Array.isArray(MODULES)).toBe(true)\n  })\n',
    text,
    count=1,
)
hierarchy_test.write_text(text, encoding='utf-8')

# Runtime architecture contract: facades must now be absent.
runtime_test = Path('tests/architecture/chapter-runtime-contract.test.js')
runtime = runtime_test.read_text(encoding='utf-8')
runtime = re.sub(
    r"it\('ChapterPlayer owns the runtime and ChapterPlayer remains a thin facade'[\s\S]*?\n  \}\)\n",
    "it('ChapterPlayer is the only chapter runtime surface', () => {\n    expect(existsSync(resolve(root, 'src/components/layout/ModulePlayer.jsx'))).toBe(false)\n    expect(existsSync(resolve(root, 'src/app/moduleNavigation.js'))).toBe(false)\n  })\n",
    runtime,
    count=1,
)
# Ensure existsSync is imported.
runtime = runtime.replace("import { readFileSync, readdirSync } from 'node:fs'", "import { existsSync, readFileSync, readdirSync } from 'node:fs'")
runtime = runtime.replace(".filter(source => source.path !== 'src/components/layout/ChapterPlayer.jsx')", ".filter(source => source.path !== 'src/components/layout/ChapterPlayer.jsx')")
runtime_test.write_text(runtime, encoding='utf-8')

# Replace old shrink-only test with a final zero-tolerance vocabulary contract.
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

const files = [
  ...activeRoots.flatMap(path => walk(resolve(root, path))),
  ...activeFiles.map(path => resolve(root, path)).filter(existsSync),
].map(path => ({ path: relative(root, path).replaceAll('\\\\', '/'), content: readFileSync(path, 'utf8') }))

const allowedLegacyReader = 'src/data/legacyChapterReferences.js'

function offenders(pattern, allow = []) {
  const allowed = new Set(allow)
  return files.filter(file => !allowed.has(file.path) && pattern.test(file.content)).map(file => file.path).sort()
}

describe('canonical content vocabulary', () => {
  it('removes completed compatibility files and authoring paths', () => {
    for (const path of [
      'src/modules.js',
      'src/components/layout/ModulePlayer.jsx',
      'src/app/moduleNavigation.js',
      'src/content/moduleContentRegistry.js',
      'src/data/tagModuleMap.js',
      '.claude/skills/module-creation',
    ]) expect(existsSync(resolve(root, path)), path).toBe(false)
    expect(existsSync(resolve(root, '.claude/skills/chapter-creation/SKILL.md'))).toBe(true)
  })

  it('blocks legacy runtime, registry and progress APIs from active surfaces', () => {
    const pattern = /\bModulePlayer\b|\bmoduleNavigation\b|\bMODULE_CONTENT_LOADERS\b|\bTAG_MODULE_MAP\b|\bMODULE_GROUPS\b|\bgetModuleState\b|\bsaveModuleState\b|\bgetModulePct\b|\bgetContinueModule\b|\bgetInProgressModule\b/
    expect(offenders(pattern)).toEqual([])
  })

  it('allows historical chapter reference fields only in the read-only migration adapter', () => {
    expect(offenders(/\bmoduleId\b|kind:\s*['\"]module['\"]/, [allowedLegacyReader])).toEqual([])
  })

  it('keeps canonical chapter source, loader and recovery map as the only authoring surfaces', () => {
    expect(offenders(/(?:^|[/])modules\.js|moduleContentRegistry\.js|tagModuleMap\.js/)).toEqual([])
    const registry = readFileSync(resolve(root, 'docs/components/COMPONENT_REGISTRY.md'), 'utf8')
    expect(registry).toContain('ChapterPlayer')
    expect(registry).toContain('ScreenRenderer')
  })
})
""")
remove_if_exists('tests/architecture/legacy-content-imports.test.js')

write('tests/unit/data/legacyChapterReferences.test.js', """import { describe, expect, it } from 'vitest'
import {
  canonicalizeChapterReference,
  canonicalizeChapterState,
  canonicalizeProgressSnapshot,
  canonicalizeTaskSelection,
} from '../../../src/data/legacyChapterReferences.js'

describe('legacy chapter reference migration', () => {
  it('moves the historical id field to chapterId without keeping the alias', () => {
    expect(canonicalizeChapterReference({ moduleId: 'chapter-a', confidence: 'confused' }))
      .toEqual({ chapterId: 'chapter-a', confidence: 'confused' })
  })

  it('normalises historical planner selections to the chapter route', () => {
    expect(canonicalizeTaskSelection({ kind: 'module', moduleId: 'chapter-a', screenIndex: 3 }))
      .toEqual({ kind: 'chapter', chapterId: 'chapter-a', screenIndex: 3 })
  })

  it('normalises examiner attempts and synced confidence/quick-fire records', () => {
    expect(canonicalizeChapterState({ examinerAttempts: [{ moduleId: 'chapter-a', finalMark: 4 }] }))
      .toEqual({ examinerAttempts: [{ chapterId: 'chapter-a', finalMark: 4 }] })
    expect(canonicalizeProgressSnapshot({
      gcse_confidence: [{ moduleId: 'chapter-a', confidence: 'clicking' }],
      gcse_quickfire_memory_v1: { subjects: {}, topics: { 'History::Galen': { moduleId: 'chapter-a', answered: 2 } } },
    })).toEqual({
      gcse_confidence: [{ chapterId: 'chapter-a', confidence: 'clicking' }],
      gcse_quickfire_memory_v1: { subjects: {}, topics: { 'History::Galen': { chapterId: 'chapter-a', answered: 2 } } },
    })
  })
})
""")

# ── 7. Final active-surface assertions before tests run ───────────────────────
required = [
    Path('src/chapters.js'),
    Path('src/components/layout/ChapterPlayer.jsx'),
    Path('src/components/layout/ScreenRenderer.jsx'),
    Path('src/content/chapterContentRegistry.js'),
    Path('src/data/tagChapterMap.js'),
    Path('.claude/skills/chapter-creation/SKILL.md'),
]
for path in required:
    if not path.exists():
        raise SystemExit(f'missing canonical Phase 6 surface: {path}')

for path in [
    Path('src/modules.js'), Path('src/components/layout/ModulePlayer.jsx'),
    Path('src/app/moduleNavigation.js'), Path('src/content/moduleContentRegistry.js'),
    Path('src/data/tagModuleMap.js'), Path('.claude/skills/module-creation'),
]:
    if path.exists():
        raise SystemExit(f'legacy Phase 6 surface still exists: {path}')

print('Phase 6 migration applied')
