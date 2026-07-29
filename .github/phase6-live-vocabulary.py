from pathlib import Path
import re

ROOT = Path('.')


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, text):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding='utf-8')


def delete(path):
    p = ROOT / path
    if p.exists():
        p.unlink()


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one occurrence, found {count}')
    return text.replace(old, new, 1)


# ---------------------------------------------------------------------------
# 1. Remove the final code compatibility facades and fallbacks.
# ---------------------------------------------------------------------------

delete('src/data/tagModuleMap.js')

# ModuleToolbar never represented a parent module. Rename it to the generic
# navigation role it actually performs.
old_toolbar = ROOT / 'src/components/core/ModuleToolbar.jsx'
if old_toolbar.exists():
    toolbar = old_toolbar.read_text(encoding='utf-8')
    toolbar = toolbar.replace('ModuleToolbar v2', 'LearningToolbar')
    toolbar = toolbar.replace('function ModuleToolbar', 'function LearningToolbar')
    write('src/components/core/LearningToolbar.jsx', toolbar)
    old_toolbar.unlink()

# Migrate references to the renamed toolbar and final recovery-routing surface.
for path in list((ROOT / 'src').rglob('*.js')) + list((ROOT / 'src').rglob('*.jsx')) + list((ROOT / 'tests').rglob('*.js')) + list((ROOT / 'tests').rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    original = text
    text = text.replace('ModuleToolbar.jsx', 'LearningToolbar.jsx')
    text = text.replace('ModuleToolbar', 'LearningToolbar')
    text = text.replace('tagModuleMap.js', 'tagChapterMap.js')
    text = text.replace('TAG_MODULE_MAP', 'TAG_CHAPTER_MAP')
    text = text.replace('findTaggedScreen', 'findTaggedChapterScreen')
    if text != original:
        path.write_text(text, encoding='utf-8')

# LearningHeader accepts one canonical chapter prop only.
header_path = ROOT / 'src/components/core/LearningHeader.jsx'
header = header_path.read_text(encoding='utf-8')
header = header.replace(
    '// Props: chapter (module remains a compatibility fallback), currentStage, stageNavigation, currentScreen, onStageJump,',
    '// Props: chapter, currentStage, stageNavigation, currentScreen, onStageJump,',
)
header = header.replace('  chapter,\n  module,\n', '  chapter,\n')
header = header.replace('  const activeChapter = chapter || module\n', '  const activeChapter = chapter\n')
header_path.write_text(header, encoding='utf-8')

# ---------------------------------------------------------------------------
# 2. Close recovery, Today’s Plan and navigation payload terminology.
# ---------------------------------------------------------------------------

tracker_path = ROOT / 'src/unifiedWeaknessTracker.js'
tracker = tracker_path.read_text(encoding='utf-8')
tracker = tracker.replace("import { TAG_CHAPTER_MAP } from './data/tagChapterMap.js'", "import { TAG_CHAPTER_MAP } from './data/tagChapterMap.js'")
tracker = tracker.replace('across modules, exams, quizzes', 'across chapters, exams and quizzes')
tracker = tracker.replace("source: 'module' | 'exam' | 'quiz'", "source: 'chapter' | 'exam' | 'quiz'")
tracker = tracker.replace('a TAG_CHAPTER_MAP key', 'a TAG_CHAPTER_MAP key')
tracker = tracker.replace('    moduleId: TAG_CHAPTER_MAP[top.routeTag],', '    chapterId: TAG_CHAPTER_MAP[top.routeTag],')
tracker = tracker.replace('    // findTaggedChapterScreen — the human `topic` is not a screen tag.', '    // findTaggedChapterScreen — the human `topic` is not a screen tag.')
tracker = tracker.replace(
    "      module: topicWrongs.filter(a => a.source === 'module').length,",
    "      chapter: topicWrongs.filter(a => a.source === 'chapter' || a.source === 'module').length,",
)
tracker_path.write_text(tracker, encoding='utf-8')

plan_path = ROOT / 'src/todaysPlan.js'
plan = plan_path.read_text(encoding='utf-8')
plan = plan.replace("onSelect: { kind: 'module', chapterId:", "onSelect: { kind: 'chapter', chapterId:")
plan = plan.replace(
    '  // `chapterId` remains in the task payload until the runtime migration phase.\n',
    '',
)
plan = plan.replace('cards have no date-stamped signal in module state', 'cards have no date-stamped signal in chapter state')
plan_path.write_text(plan, encoding='utf-8')

nav_path = ROOT / 'src/app/chapterNavigation.js'
nav = nav_path.read_text(encoding='utf-8')
nav = nav.replace('    nextModule:        nextChapter, // temporary compatibility field\n', '')
nav = nav.replace("  if (sel.kind === 'chapter' || sel.kind === 'module') {", "  if (sel.kind === 'chapter') {")
nav = nav.replace('    const chapterId = sel.chapterId || sel.moduleId', '    const chapterId = sel.chapterId')
nav_path.write_text(nav, encoding='utf-8')

# The completion component searches chapter metadata, not modules.
complete_path = ROOT / 'src/components/layout/ChapterCompleteScreen.jsx'
complete = complete_path.read_text(encoding='utf-8')
complete = complete.replace('matchedNextModule', 'matchedNextChapter')
complete = complete.replace('matchedModule', 'matchedChapter')
complete = complete.replace('CHAPTERS.find(module =>', 'CHAPTERS.find(chapter =>')
complete = complete.replace('module.title ===', 'chapter.title ===')
complete = complete.replace('module.subject ===', 'chapter.subject ===')
complete_path.write_text(complete, encoding='utf-8')

# ---------------------------------------------------------------------------
# 3. Make the Subjects browser and app-shell API chapter-specific.
# ---------------------------------------------------------------------------

subjects_path = ROOT / 'src/features/subjects/Subjects.jsx'
subjects = subjects_path.read_text(encoding='utf-8')
for old, new in [
    ('MODULE_HEADER_IMAGES', 'CHAPTER_HEADER_IMAGES'),
    ('getSubjectModuleList', 'getSubjectChapterList'),
    ('onOpenModule', 'onOpenChapter'),
    ('ModulesTab', 'SubjectsTab'),
    ('continueModule', 'continueChapter'),
    ('biggestWinModule', 'biggestWinChapter'),
    ('rawMods', 'rawChapters'),
    ('realMod', 'realChapter'),
]:
    subjects = subjects.replace(old, new)
subjects = subjects.replace('biggestWinRaw.moduleId', 'biggestWinRaw.chapterId')
subjects = subjects.replace('    mod: biggestWinChapter,', '    chapter: biggestWinChapter,')
subjects = subjects.replace('biggestWin.mod', 'biggestWin.chapter')
subjects = subjects.replace('${items.length} episodes · Edexcel History', '${items.length} chapters · Edexcel History')
subjects = subjects.replace('Module journey indicator', 'Chapter journey indicator')
subjects = subjects.replace('MODULE JOURNEY', 'CHAPTER JOURNEY')
subjects = subjects.replace('route through\n            ChapterPlayer', 'route through\n            ChapterPlayer')
subjects = subjects.replace('finishing one module', 'finishing one chapter')
subjects = subjects.replace('Completed and future', 'Completed and future chapters')
subjects = subjects.replace('the next module to tackle', 'the next chapter to tackle')
subjects = subjects.replace("const real = CHAPTERS.filter(m => m.subject === subjectName)", "const real = CHAPTERS.filter(chapter => chapter.subject === subjectName)")
subjects = subjects.replace("CHAPTERS.find(m => m.id === 'english-macbeth-power-ambition')", "CHAPTERS.find(chapter => chapter.id === 'english-macbeth-power-ambition')")
subjects = subjects.replace('const allItems = rawChapters.map((mod, i) => {', 'const allItems = rawChapters.map((chapter, i) => {')
subjects = subjects.replace('if (mod.comingSoon) return { ...mod,', 'if (chapter.comingSoon) return { ...chapter,')
subjects = subjects.replace('getChapterAvailability(mod)', 'getChapterAvailability(chapter)')
subjects = subjects.replace('return { ...mod, number: i + 1, status:', 'return { ...chapter, number: i + 1, status:')
subjects = subjects.replace('safeGetChapterState(mod.id)', 'safeGetChapterState(chapter.id)')
subjects = subjects.replace('mod.screenCount', 'chapter.screenCount')
subjects = subjects.replace('return { ...mod, number: mod.number || i + 1, status, pct }', 'return { ...chapter, number: chapter.number || i + 1, status, pct }')
subjects = subjects.replace('CHAPTERS.find(m => m.id === item.id)', 'CHAPTERS.find(chapter => chapter.id === item.id)')
subjects = subjects.replace('CHAPTERS.find(m => m.id === biggestWinRaw.chapterId)', 'CHAPTERS.find(chapter => chapter.id === biggestWinRaw.chapterId)')
subjects = subjects.replace('CHAPTERS.filter(m => m.subject === name)', 'CHAPTERS.filter(chapter => chapter.subject === name)')
subjects = subjects.replace('mods.length ? Math.round(mods.reduce((sum, m) => sum + chapterPct(m), 0) / mods.length)', 'chapters.length ? Math.round(chapters.reduce((sum, chapter) => sum + chapterPct(chapter), 0) / chapters.length)')
subjects = subjects.replace('const mods = CHAPTERS.filter(chapter => chapter.subject === name)', 'const chapters = CHAPTERS.filter(chapter => chapter.subject === name)')
subjects_path.write_text(subjects, encoding='utf-8')

app_path = ROOT / 'src/app/LegacyApp.jsx'
app = app_path.read_text(encoding='utf-8')
app = app.replace("import ModulesTab from '../features/subjects/Subjects.jsx'", "import SubjectsTab from '../features/subjects/Subjects.jsx'")
app = app.replace('<ModulesTab', '<SubjectsTab')
app = app.replace('onOpenModule', 'onOpenChapter')
app_path.write_text(app, encoding='utf-8')

# ---------------------------------------------------------------------------
# 4. Migrate tests to final payloads and public names.
# ---------------------------------------------------------------------------

for path in list((ROOT / 'tests').rglob('*.js')) + list((ROOT / 'tests').rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    original = text
    text = text.replace("kind: 'module'", "kind: 'chapter'")
    text = text.replace("kind: \"module\"", "kind: \"chapter\"")
    text = text.replace('onOpenModule', 'onOpenChapter')
    text = text.replace('ModulesTab', 'SubjectsTab')
    text = text.replace('getSubjectModuleList', 'getSubjectChapterList')
    text = text.replace('nextModule:', 'nextChapterCompatibilityRemoved:') if False else text

    if any(part in path.as_posix().lower() for part in ['weakness', 'todaysplan', 'learnerjourney', 'subject']):
        text = re.sub(r'\bmoduleId\b', 'chapterId', text)

    # Existing stored telemetry may still contain source='module'; keep only tests
    # explicitly describing migration/history. New write fixtures use chapter.
    if 'legacy' not in path.name.lower() and 'migration' not in path.name.lower():
        text = text.replace("source: 'module'", "source: 'chapter'")

    if text != original:
        path.write_text(text, encoding='utf-8')

# Direct contract fixes that should not be hidden behind broad replacement.
chapter_nav_test = ROOT / 'tests/unit/app/chapterNavigation.test.js'
if chapter_nav_test.exists():
    text = chapter_nav_test.read_text(encoding='utf-8')
    text = text.replace('tests/unit/modulePlayer/lifecycle.test.js', 'tests/unit/chapterPlayer/lifecycle-regression.test.js')
    text = text.replace('what getModuleState returns', 'what getChapterState returns')
    chapter_nav_test.write_text(text, encoding='utf-8')

# ---------------------------------------------------------------------------
# 5. Rewrite active authoring guidance to the final architecture.
# ---------------------------------------------------------------------------

write('.claude/skills/gcse-content-registry/SKILL.md', """---
name: gcse-content-registry
description: >
  Keep learner-facing chapters aligned across parent modules, chapter metadata,
  content files, lazy loaders and the governed screen registry.
argument-hint: "[chapter id or description]"
---

# GCSE chapter registry hygiene

Use this workflow when adding, extracting or changing a learner-facing chapter.
The canonical hierarchy is `Subject → Module → Chapter → Screen → Component`.

## Status block

```text
CHAPTER REGISTRY CHECK
──────────────────────
Chapter:           <id>
Parent module:     <module id>  included ✓/✗  order ✓/✗
src/chapters.js:   id ✓/✗  number ✓/✗  screenCount ✓/✗  screenTags ✓/✗
Content file:      screens non-empty ✓/✗  stageNavigation bounds ✓/✗
Loader registry:   CHAPTER_CONTENT_LOADERS[id] ✓/✗
Screen registry:   all screen/block types registered ✓/✗
Action required:   <none / list>
```

## Authorities

| File | Owns |
|---|---|
| `src/data/modules.js` | Parent modules and ordered `chapterIds` |
| `src/chapters.js` | Chapter browsing metadata, availability, `screenCount`, `screenTags` |
| `src/content/<subject>/<series>/episodes/<file>.js` | Hook, outcomes, recall, screens and stage navigation |
| `src/content/chapterContentRegistry.js` | `CHAPTER_CONTENT_LOADERS` and lazy content loading |
| `src/data/screenRegistry.js` | Approved screen/block types and required data |

Some content filenames still use `episode-*` for historical reasons. That filename
convention does not change the product model: each file exports one chapter.

## Rules

- `chapter.id` must exactly match the metadata ID and loader key.
- The parent module must include the chapter ID exactly once.
- `screenCount` must equal `screens.length`.
- `screenTags` must equal `screens.map(screen => screen.tag ?? null)`.
- Every screen and nested block type must resolve through `screenRegistry.js`.
- New chapter content must not require edits to `ChapterPlayer` or new routing
  branches in `ScreenRenderer`.
- Do not add chapter content to old subject-wide bundles.

## Workflow

1. Read `src/data/modules.js` and confirm the parent module.
2. Read the chapter row in `src/chapters.js`.
3. Create or update the chapter content file under `src/content/`.
4. Add or update its dynamic loader in `src/content/chapterContentRegistry.js`.
5. Validate the authored screen/block types against `src/data/screenRegistry.js`.
6. Update `screenCount`, `screenTags` and any affected `stageNavigation` indices.
7. Run the architecture suite and production build.

## Test pattern

```javascript
import { CHAPTERS } from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'

const chapter = CHAPTERS.find(item => item.id === '<chapter-id>')
const parentModule = MODULES.find(item => item.chapterIds.includes(chapter.id))

expect(chapter).toBeDefined()
expect(parentModule).toBeDefined()
expect(CHAPTER_CONTENT_LOADERS[chapter.id]).toBeTypeOf('function')
```
""")

# Content-create is the build workflow for chapters, not parent modules.
content_create_path = ROOT / '.claude/skills/content-create/SKILL.md'
content_create = content_create_path.read_text(encoding='utf-8')
content_create = content_create.replace('Use for building new module content', 'Use for building new chapter content')
content_create = content_create.replace('argument-hint: "<module id>', 'argument-hint: "<chapter id>')
content_create = content_create.replace('For a genuinely new module', 'For a genuinely new chapter')
content_create = content_create.replace('Runs in Lane E (new module)', 'Runs in Lane E (new chapter)')
content_create = content_create.replace('for a new module', 'for a new chapter')
content_create = content_create.replace('per-module content file', 'per-chapter content file')
content_create = content_create.replace('/?module=<id>&screen=<n>', '/?chapter=<id>&screen=<n>')
content_create = content_create.replace('The module opens, progresses and completes', 'The chapter opens, progresses and completes')
content_create = content_create.replace('Never add a new module to', 'Never add a new chapter to')
content_create_path.write_text(content_create, encoding='utf-8')

# Canonical-topic reads metadata from chapters.js and content from the loader target.
canonical_path = ROOT / '.claude/skills/canonical-topic/SKILL.md'
canonical = canonical_path.read_text(encoding='utf-8')
canonical = canonical.replace('for any module whose `title`', 'for any chapter whose `title`')
canonical = canonical.replace('module ids joined by `+`', 'chapter ids joined by `+`')
canonical = canonical.replace('names one id', 'names one chapter id')
canonical = canonical.replace('one or more module ids', 'one or more chapter ids')
canonical = canonical.replace("grep\n`src/chapters.js` for `id: '<module-id>'` and read that module object's\n`title`, `subtitle`, plus `hook`, `outcomes`, `recall`, and `screens`\n(each screen's `id`/`tag` plus a one-line summary of its type and content).",
"read the matching metadata row in `src/chapters.js`, then resolve the chapter's\nloader in `src/content/chapterContentRegistry.js` and read the returned content\nfile for `hook`, `outcomes`, `recall`, `screens` and `stageNavigation`. Metadata\nand authored chapter content deliberately have separate owners.")
canonical = canonical.replace("use the (first, if multiple) module's `era` field", "use the (first, if multiple) chapter's `era` field")
canonical_path.write_text(canonical, encoding='utf-8')

# Replace the stale loading section in CLAUDE.md with the final hierarchy.
claude_path = ROOT / 'CLAUDE.md'
claude = claude_path.read_text(encoding='utf-8')
loading_section = """## Bundle Size / Lazy Loading

`ChapterPlayer` and the learning components reached through `ScreenRenderer` are
loaded with `React.lazy()` only when a learner opens a chapter. Home, Subjects,
Progress and Quiz do not pay for the chapter runtime on first load.

### Chapter content loading

The canonical ownership chain is:

- `src/data/modules.js` — parent curriculum modules and ordered `chapterIds`;
- `src/chapters.js` — lightweight chapter metadata and availability;
- `src/content/chapterContentRegistry.js` — `CHAPTER_CONTENT_LOADERS` and
  `loadChapterContent`;
- `src/content/<subject>/<series>/episodes/<file>.js` — one chapter's full hook,
  outcomes, recall, stage navigation and screens.

All subjects use per-chapter lazy loaders. Adding a chapter means running
`/chapter-creation <chapter-id>`, adding its content file and loader, placing the
ID in one parent module, and keeping `screenCount` / `screenTags` aligned. Do not
add new content to subject-wide bundles and do not edit `ChapterPlayer` merely to
make a chapter render; use registered screen definitions.

"""
claude, count = re.subn(
    r"## Bundle Size / Lazy Loading\n.*?(?=### Exam Mode question banks are lazy-loaded via context)",
    loading_section,
    claude,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError(f'CLAUDE loading section: expected one match, found {count}')
claude = re.sub(
    r"\nWhen adding a new module: add its full content to the matching `src/modules/<subject>\.js`.*?reads `mod\.screenTags`\.\n",
    '\n',
    claude,
    count=1,
    flags=re.S,
)
claude = claude.replace('- `ModulesTab` — subjects/modules browser', '- `SubjectsTab` — subject browser; each subject presents its ordered chapter journey')
claude = claude.replace('- `SubjectSection` — renders a subject heading + its module cards\n- `ModuleCard` — individual module card with progress, accent colour, icon\n', '')
claude = claude.replace('handles in-module lesson flow', 'handles one chapter learning journey')
claude = claude.replace('| `src/chapters.js` | `MODULES` array', '| `src/chapters.js` | `CHAPTERS` array')
claude = claude.replace('the canonical per-module pattern', 'the canonical per-chapter pattern')
claude = claude.replace('loaded individually via `CHAPTER_CONTENT_LOADERS` in `LegacyApp.jsx`', 'loaded individually through `src/content/chapterContentRegistry.js`')
claude_path.write_text(claude, encoding='utf-8')

# Finalise concise system descriptions.
index_path = ROOT / 'docs/system/00_SYSTEM_INDEX.md'
index = index_path.read_text(encoding='utf-8')
index = index.replace(
    'and the migration away from the current inverted `MODULES` / `MODULE_GROUPS` / `ChapterPlayer` terminology.',
    'and the final canonical ownership boundaries for modules, chapters, screens and components.',
)
index_path.write_text(index, encoding='utf-8')

workflow_path = ROOT / 'docs/system/DEVELOPMENT_WORKFLOW.md'
workflow = workflow_path.read_text(encoding='utf-8')
workflow = workflow.replace(
    'and has not yet happened to `ChapterPlayer.jsx`\n(2400+ lines, flagged as a fragile area in `.planning/codebase/CONCERNS.md`).',
    'and was later applied to `ChapterPlayer.jsx`, whose screen routing now lives\nin the governed `ScreenRenderer.jsx` boundary.',
)
workflow_path.write_text(workflow, encoding='utf-8')

# Registry references to the renamed generic toolbar.
registry_path = ROOT / 'docs/components/COMPONENT_REGISTRY.md'
registry = registry_path.read_text(encoding='utf-8')
registry = registry.replace('ModuleToolbar.jsx', 'LearningToolbar.jsx')
registry = registry.replace('ModuleToolbar', 'LearningToolbar')
registry_path.write_text(registry, encoding='utf-8')

# ---------------------------------------------------------------------------
# 6. Strengthen the final anti-regression gate.
# ---------------------------------------------------------------------------

contract_path = ROOT / 'tests/architecture/legacy-content-imports.test.js'
contract = contract_path.read_text(encoding='utf-8')
contract = contract.replace(
    "      'src/app/moduleNavigation.js',\n",
    "      'src/app/moduleNavigation.js',\n      'src/data/tagModuleMap.js',\n      'src/components/core/ModuleToolbar.jsx',\n",
)
contract = contract.replace(
    "      'computeInitialModuleState', 'getModuleGate', 'prepareModuleScreenState',\n",
    "      'computeInitialModuleState', 'getModuleGate', 'prepareModuleScreenState',\n      'TAG_MODULE_MAP', 'findTaggedScreen', 'onOpenModule', 'ModulesTab',\n      'getSubjectModuleList',\n",
)
extra_test = """
  it('contains no chapter-navigation compatibility payloads', () => {
    const source = filesUnder('src')
      .filter(path => /\.(js|jsx)$/.test(path))
      .map(path => `${path}\n${read(path)}`)
      .join('\n')
    for (const legacy of ["kind: 'module'", 'nextModule:        nextChapter', 'sel.moduleId']) {
      expect(source, legacy).not.toContain(legacy)
    }
  })

"""
anchor = "  it('keeps canonical authoring surfaces free of deleted paths and commands', () => {\n"
if extra_test not in contract:
    if anchor not in contract:
        raise RuntimeError('anti-regression authoring anchor missing')
    contract = contract.replace(anchor, extra_test + anchor, 1)
contract = contract.replace(
    "      'moduleContentRegistry.js', 'MODULE_CONTENT_LOADERS', 'loadModuleContent',\n",
    "      'moduleContentRegistry.js', 'MODULE_CONTENT_LOADERS', 'loadModuleContent',\n      \"import { MODULES } from '../../src/chapters.js'\", 'Loader entry:     CHAPTER_CONTENT_LOADERS[id] exists in LegacyApp.jsx',\n      '/?module=<id>&screen=<n>',\n",
)
contract_path.write_text(contract, encoding='utf-8')

# ---------------------------------------------------------------------------
# 7. Fail fast on the exact compatibility surfaces this pass removes.
# ---------------------------------------------------------------------------

for path in [
    'src/data/tagModuleMap.js',
    'src/components/core/ModuleToolbar.jsx',
]:
    if (ROOT / path).exists():
        raise RuntimeError(f'legacy file survived: {path}')

source_text = '\n'.join(
    path.read_text(encoding='utf-8')
    for path in list((ROOT / 'src').rglob('*.js')) + list((ROOT / 'src').rglob('*.jsx'))
)
for token in [
    'TAG_MODULE_MAP', 'findTaggedScreen', "kind: 'module'",
    'nextModule:        nextChapter', 'onOpenModule', 'ModulesTab',
    'getSubjectModuleList', 'module remains a compatibility fallback',
]:
    if token in source_text:
        raise RuntimeError(f'legacy live vocabulary survived: {token}')

print('Final live Phase 6 vocabulary migration applied')
