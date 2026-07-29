from pathlib import Path
import re

ROOT = Path('.')


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, content):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')


def delete(path):
    p = ROOT / path
    if not p.exists():
        raise RuntimeError(f'missing expected file: {path}')
    p.unlink()


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one anchor, found {count}')
    return text.replace(old, new, 1)


# 1. Move the canonical chapter metadata into src/chapters.js.
legacy = read('src/modules.js')
start = legacy.index('export const MODULES = [')
catalogue = legacy[start:]
catalogue = replace_once(catalogue, 'export const MODULES = [', 'export const CHAPTERS = [', 'chapter catalogue export')
catalogue = catalogue.replace('MODULE_AVAILABILITY', 'CHAPTER_AVAILABILITY')
catalogue = catalogue.replace('getModuleAvailability', 'getChapterAvailability')
catalogue = catalogue.replace('isModuleAvailable', 'isChapterAvailable')
catalogue = catalogue.replace('export function getChapterAvailability(mod) {', 'export function getChapterAvailability(chapter) {')
catalogue = catalogue.replace('export function isChapterAvailable(mod) {', 'export function isChapterAvailable(chapter) {')
catalogue = catalogue.replace('if (!mod)', 'if (!chapter)')
catalogue = catalogue.replace('mod.availability', 'chapter.availability')
catalogue = catalogue.replace('mod.screenCount', 'chapter.screenCount')
catalogue = catalogue.replace('getChapterAvailability(mod)', 'getChapterAvailability(chapter)')

comment_lines = []
for line in catalogue.splitlines():
    if line.lstrip().startswith('//'):
        line = re.sub(r'\bModules\b', 'Chapters', line)
        line = re.sub(r'\bModule\b', 'Chapter', line)
        line = re.sub(r'\bmodules\b', 'chapters', line)
        line = re.sub(r'\bmodule\b', 'chapter', line)
    comment_lines.append(line)
catalogue = '\n'.join(comment_lines) + '\n'

header = """// Canonical chapter metadata catalogue.\n//\n// Chapters are learner-facing journeys inside a parent module. This file owns\n// browsing metadata, availability, progress-card metadata and weak-spot tags.\n// Full chapter content is loaded lazily through chapterContentRegistry.js.\n//\n// screenCount — number of authored screens in the chapter\n// screenTags  — screen.tag values in order, used for targeted recovery routes\n// availability — optional override: available | comingSoon | hidden\n\n"""
write('src/chapters.js', header + catalogue)
delete('src/modules.js')

# 2. Remove runtime/navigation compatibility facades.
delete('src/components/layout/ModulePlayer.jsx')
delete('src/app/moduleNavigation.js')

# 3. Remove compatibility exports from progress and hierarchy contracts.
progress = read('src/progress.js')
progress = re.sub(
    r"// Temporary compatibility export\. Parent modules are now canonically owned by\n"
    r"// src/data/modules\.js; existing callers may continue importing MODULE_GROUPS\n"
    r"// until the final migration phase\.\n"
    r"export const MODULE_GROUPS = MODULES\n\n",
    '', progress, count=1,
)
progress = re.sub(
    r"// Temporary compatibility aliases\. They execute the canonical chapter-key\n"
    r"// implementation, so even untouched Phase 4 runtime callers now write only\n"
    r"// gcse_chapter_\* keys\.\n"
    r"export const getModuleState = getChapterState\n"
    r"export const saveModuleState = saveChapterState\n"
    r"export const getModulePct = getChapterPct\n\n",
    '', progress, count=1,
)
progress = re.sub(
    r"// Temporary compatibility aliases for existing runtime callers\.\n"
    r"export const getContinueModule = getContinueChapter\n"
    r"export const getInProgressModule = getInProgressChapter\n\n",
    '', progress, count=1,
)
progress = progress.replace(
    '// Keyed by the current legacy moduleId field, stored in a shared array.\n// Phase 3 migrates this terminology alongside chapter persistence.',
    '// Keyed by chapterId and stored in a shared array.',
)
progress = progress.replace(
    '// The canonical parent-module catalogue determines chapter order. Progress\n// percentage still uses its legacy function name until Phase 3.',
    '// The canonical parent-module catalogue determines chapter order.',
)
write('src/progress.js', progress)

hierarchy = read('src/data/contentHierarchy.js')
hierarchy = re.sub(
    r"// Temporary migration map\..*?\nexport const LEGACY_CONTENT_NAMES = Object\.freeze\(\{.*?\n\}\)\n\n",
    '', hierarchy, count=1, flags=re.S,
)
write('src/data/contentHierarchy.js', hierarchy)

# 4. Finish planner vocabulary where the old names referred to chapters.
planner = read('src/features/planner/dailyPlanner.js')
for old, new in [
    ('hasInProgressModule', 'hasInProgressChapter'),
    ('getInProgressModuleForSubject', 'getInProgressChapterForSubject'),
    ('getNextNewModuleForSubject', 'getNextNewChapterForSubject'),
]:
    planner = planner.replace(old, new)
planner = planner.replace('moduleId?:      string,       // resolved module for progress-type blocks',
                          'chapterId?:     string,       // resolved chapter for progress-type blocks')
planner = re.sub(r'\bmoduleId\b', 'chapterId', planner)
planner = planner.replace('mid-module work', 'mid-chapter work')
planner = planner.replace('empty module', 'empty chapter')
planner = planner.replace('const mod = CHAPTERS.find(m => m.id === id)', 'const chapter = CHAPTERS.find(item => item.id === id)')
planner = planner.replace('if (mod && isChapterAvailable(mod)) return mod', 'if (chapter && isChapterAvailable(chapter)) return chapter')
write('src/features/planner/dailyPlanner.js', planner)

# Update planner tests and direct consumers of the planner payload.
for path in list((ROOT / 'tests').rglob('*.js')) + list((ROOT / 'tests').rglob('*.jsx')) + list((ROOT / 'src').rglob('*.js')) + list((ROOT / 'src').rglob('*.jsx')):
    rel = path.as_posix()
    if rel in {'src/features/planner/dailyPlanner.js'}:
        continue
    text = path.read_text(encoding='utf-8')
    if 'moduleId' in text and ('planner' in rel.lower() or 'todaysplan' in rel.lower() or 'PlanBlock' in text):
        text = re.sub(r'\bmoduleId\b', 'chapterId', text)
        path.write_text(text, encoding='utf-8')

# 5. Remove/rename compatibility tests.
delete('tests/unit/app/moduleNavigation.test.js')
delete('tests/unit/modulePlayer/compatibility.test.js')
old_lifecycle = read('tests/unit/modulePlayer/lifecycle.test.js')
for old, new in [
    ('../../../src/app/moduleNavigation.js', '../../../src/app/chapterNavigation.js'),
    ('computeInitialModuleState', 'computeInitialChapterState'),
    ('getModuleGate', 'getChapterGate'),
    ('ModulePlayer', 'ChapterPlayer'),
    ('moduleNavigation', 'chapterNavigation'),
    ('completeModule', 'completeChapter'),
    ('makeModule', 'makeChapter'),
    ('moduleId', 'chapterId'),
]:
    old_lifecycle = old_lifecycle.replace(old, new)
old_lifecycle = re.sub(r'\bmodule\b', 'chapter', old_lifecycle)
old_lifecycle = re.sub(r'\bModule\b', 'Chapter', old_lifecycle)
write('tests/unit/chapterPlayer/lifecycle-regression.test.js', old_lifecycle)
delete('tests/unit/modulePlayer/lifecycle.test.js')

content_test = read('tests/architecture/content-hierarchy.test.js')
content_test = content_test.replace("import { MODULES as LEGACY_CHAPTERS } from '../../src/modules.js'\n", '')
content_test = content_test.replace("import { MODULE_GROUPS as LEGACY_MODULES } from '../../src/progress.js'\n", '')
content_test = content_test.replace('  LEGACY_CONTENT_NAMES,\n', '')
content_test = re.sub(
    r"\n  it\('records the current legacy names.*?\n  \}\)\n\n  it\('keeps compatibility exports.*?\n  \}\)\n",
    '\n', content_test, count=1, flags=re.S,
)
write('tests/architecture/content-hierarchy.test.js', content_test)

# Replace the temporary allowlist test with a final anti-regression contract.
write('tests/architecture/legacy-content-imports.test.js', """import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'\nimport { resolve, relative } from 'node:path'\nimport { describe, expect, it } from 'vitest'\n\nconst ROOT = resolve(process.cwd())\nconst read = path => readFileSync(resolve(ROOT, path), 'utf8')\n\nfunction filesUnder(dir) {\n  const root = resolve(ROOT, dir)\n  const files = []\n  for (const name of readdirSync(root)) {\n    const full = resolve(root, name)\n    if (statSync(full).isDirectory()) files.push(...filesUnder(relative(ROOT, full)))\n    else files.push(relative(ROOT, full).replaceAll('\\\\', '/'))\n  }\n  return files\n}\n\ndescribe('Canonical hierarchy closure', () => {\n  it('removes the old chapter-as-module surfaces', () => {\n    for (const path of [\n      'src/modules.js',\n      'src/components/layout/ModulePlayer.jsx',\n      'src/app/moduleNavigation.js',\n    ]) expect(existsSync(resolve(ROOT, path)), path).toBe(false)\n  })\n\n  it('does not expose legacy chapter APIs from production source', () => {\n    const forbidden = [\n      'MODULE_GROUPS', 'getModuleState', 'saveModuleState', 'getModulePct',\n      'getContinueModule', 'getInProgressModule', 'LEGACY_CONTENT_NAMES',\n      'computeInitialModuleState', 'getModuleGate', 'prepareModuleScreenState',\n    ]\n    const source = filesUnder('src')\n      .filter(path => /\\.(js|jsx)$/.test(path))\n      .map(path => `${path}\\n${read(path)}`)\n      .join('\\n')\n    for (const token of forbidden) expect(source, token).not.toContain(token)\n  })\n\n  it('keeps canonical authoring surfaces free of deleted paths and commands', () => {\n    const active = [\n      'CLAUDE.md',\n      'docs/system/CONTENT_HIERARCHY.md',\n      'docs/system/DEVELOPMENT_WORKFLOW.md',\n      'docs/components/COMPONENT_REGISTRY.md',\n      '.claude/skills/chapter-creation/SKILL.md',\n      '.claude/skills/gcse-content-registry/SKILL.md',\n    ].filter(path => existsSync(resolve(ROOT, path)))\n    const text = active.map(path => `${path}\\n${read(path)}`).join('\\n')\n    for (const legacy of [\n      'src/modules.js', 'ModulePlayer', 'moduleNavigation', 'module-creation',\n      'moduleContentRegistry.js', 'MODULE_CONTENT_LOADERS', 'loadModuleContent',\n    ]) expect(text, legacy).not.toContain(legacy)\n  })\n})\n""")

# 6. Replace the stale scaffold skill with the canonical chapter workflow.
new_skill = """---\nname: chapter-creation\ndescription: >\n  Scaffold a new learner-facing GCSE chapter from the governed component directory.\n  Creates structure only; it does not invent teaching content.\nargument-hint: \"<chapter-id>\"\nallowed-tools:\n  - Read\n  - Write\n  - Edit\n  - Glob\n  - Grep\n  - Bash\n---\n\n# Chapter creation\n\nUse this workflow to add one learner-facing chapter inside an existing parent module.\nThe canonical hierarchy is `Subject → Module → Chapter → Screen → Component`.\n\n## Prerequisites\n\n1. The chapter metadata row exists in `src/chapters.js`.\n2. Its parent module in `src/data/modules.js` contains the chapter ID in `chapterIds`.\n3. The intended screen and block types exist in `src/data/screenRegistry.js`.\n4. Relevant component decisions are documented in `docs/components/COMPONENT_REGISTRY.md`.\n\nHalt if any prerequisite is missing. Do not create bespoke runtime routing.\n\n## Scaffold\n\nCreate the content file under `src/content/<subject>/<series>/episodes/` using the\nexisting series naming convention. Export one chapter object with metadata, hook,\noutcomes, recall, stage navigation and `screens: []`. Do not generate placeholder\ncopy or teaching content.\n\nAdd a dynamic loader to `CHAPTER_CONTENT_LOADERS` in\n`src/content/chapterContentRegistry.js`. Never add a static episode import to the\napp shell or `ChapterPlayer`.\n\n## Validation\n\nBefore completion:\n\n- run the chapter schema/architecture suite;\n- confirm every screen and nested block resolves through `screenRegistry.js`;\n- confirm `ChapterPlayer` and `ScreenRenderer` were not edited merely to support\n  the new chapter;\n- update `screenCount` and `screenTags` in `src/chapters.js` after content exists;\n- run the content-registry alignment check.\n\n## Completion message\n\nReport the chapter ID, parent module, content path, loader entry, schema result and\nany intentionally empty authoring sections.\n"""
write('.claude/skills/chapter-creation/SKILL.md', new_skill)
delete('.claude/skills/module-creation/SKILL.md')

# Canonicalise explicit legacy paths and symbols in active authoring docs/skills.
active_paths = [
    'CLAUDE.md',
    'docs/system/DEVELOPMENT_WORKFLOW.md',
    'docs/system/00_SYSTEM_INDEX.md',
    'docs/components/COMPONENT_REGISTRY.md',
    '.claude/skills/gcse-content-registry/SKILL.md',
    '.claude/skills/content-create/SKILL.md',
    '.claude/skills/canonical-topic/SKILL.md',
]
explicit = [
    ('src/modules.js', 'src/chapters.js'),
    ('ModulePlayer.jsx', 'ChapterPlayer.jsx'),
    ('ModulePlayer', 'ChapterPlayer'),
    ('moduleNavigation.js', 'chapterNavigation.js'),
    ('moduleContentRegistry.js', 'chapterContentRegistry.js'),
    ('MODULE_CONTENT_LOADERS', 'CHAPTER_CONTENT_LOADERS'),
    ('loadModuleContent', 'loadChapterContent'),
    ('module-creation', 'chapter-creation'),
]
for path in active_paths:
    p = ROOT / path
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    for old, new in explicit:
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8')

# Replace the authoritative hierarchy document with the final state.
write('docs/system/CONTENT_HIERARCHY.md', """# Content hierarchy\n\n## Canonical model\n\n`Subject → Module → Chapter → Screen → Component`\n\n- **Subject** owns brand, specification and overall progress.\n- **Module** is a parent curriculum unit containing an ordered `chapterIds` list.\n- **Chapter** is one learner-facing journey with hook, outcomes, recall and screens.\n- **Screen** is one governed learning moment.\n- **Component** is the reusable presentation or interaction used by a screen.\n\n## Authoritative files\n\n- `src/data/modules.js` — parent module catalogue.\n- `src/chapters.js` — chapter metadata and availability.\n- `src/content/chapterContentRegistry.js` — lazy chapter-content loaders.\n- `src/data/screenRegistry.js` — approved screen/block schema and authoring contract.\n- `src/components/layout/ChapterPlayer.jsx` — chapter lifecycle and navigation.\n- `src/components/layout/ScreenRenderer.jsx` — the only component-routing boundary.\n- `src/progress.js` — canonical chapter progress APIs.\n\n## Chapter-building rule\n\nA normal chapter is assembled as data from registered screens and blocks. Adding a\nchapter must not require edits to `ChapterPlayer` or a new component-routing branch.\nAdd or amend a reusable component through the component-governance process first,\nthen register its authoring contract in `screenRegistry.js`.\n\n## Progress identity\n\nChapter progress is stored under `gcse_chapter_<chapterId>`. The persistence layer\nmay still read older `gcse_module_<chapterId>` keys solely to migrate existing user\ndata; no production code writes those keys. Parent modules do not own screen-level\nresume state.\n\n## Naming contract\n\nIn active code and authoring documentation:\n\n- `module` always means a parent curriculum unit;\n- `chapter` always means one learner-facing journey;\n- `screen` always means one routed learning moment;\n- `component` always means a reusable governed implementation.\n\nHistorical archive documents may preserve terminology that was accurate when they\nwere written. They are not authoring guidance.\n""")

# Refresh the runtime entry in the component registry if the old heading remains.
registry_path = ROOT / 'docs/components/COMPONENT_REGISTRY.md'
registry = registry_path.read_text(encoding='utf-8')
section = """### ChapterPlayer\n\n**File:** `src/components/layout/ChapterPlayer.jsx`  \n**Purpose:** Internal runtime for one learner-facing chapter. It owns opening gates, resume state, navigation, recovery/examiner diversions and chapter completion, then delegates component selection to `ScreenRenderer`.  \n**Authoring status:** Infrastructure only — never a selectable screen or component.\n\n**Use by implementation when:** launching a complete chapter object.\n\n**Do not:** add subject-specific teaching UI, component imports or new screen-routing branches here. Chapter authors compose registered screen definitions instead.\n\n**Choose instead:** `src/data/screenRegistry.js` for authoring contracts and `ScreenRenderer` for governed routing.\n\n**Rhythm role:** Chapter orchestration, not a learning beat.\n"""
if '### ModulePlayer' in registry:
    registry, n = re.subn(r'### ModulePlayer\n.*?(?=\n---\n)', section.rstrip(), registry, count=1, flags=re.S)
    if n != 1:
        raise RuntimeError('Could not replace ModulePlayer registry section')
elif '### ChapterPlayer' not in registry:
    registry += '\n\n---\n\n' + section
registry_path.write_text(registry, encoding='utf-8')

# Final source checks before tests.
for path in ['src/modules.js', 'src/components/layout/ModulePlayer.jsx', 'src/app/moduleNavigation.js']:
    if (ROOT / path).exists():
        raise RuntimeError(f'legacy file survived: {path}')
for token in ['MODULE_GROUPS', 'getModuleState', 'saveModuleState', 'getModulePct', 'getContinueModule', 'getInProgressModule']:
    if token in read('src/progress.js'):
        raise RuntimeError(f'legacy progress export survived: {token}')

print('Phase 6 migration applied')
