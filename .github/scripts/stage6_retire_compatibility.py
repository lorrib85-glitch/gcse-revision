from pathlib import Path
import json
import re


def replace_once(path, old, new):
    path = Path(path)
    text = path.read_text()
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one occurrence, found {count}: {old!r}')
    path.write_text(text.replace(old, new, 1))


def replace_pattern_once(path, pattern, replacement, flags=re.S):
    path = Path(path)
    text = path.read_text()
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f'{path}: expected one pattern match, found {count}: {pattern!r}')
    path.write_text(updated)


DELETE = [
    'src/curriculum-catalogue/compatibility/README.md',
    'src/curriculum-catalogue/compatibility/index.js',
    'src/curriculum-catalogue/compatibility/runtime-v1.js',
    'scripts/generate-curriculum-projections.mjs',
    'src/data/generated/curriculum/modules.js',
    'src/data/generated/curriculum/chapters.js',
    'src/data/generated/curriculum/chapterContentLoaders.js',
    'src/data/modules.js',
    'src/chapters.js',
    'src/content/chapterContentRegistry.js',
    'tests/fixtures/curriculum-runtime-v1.json',
    'tests/architecture/curriculum-compatibility.test.js',
    'tests/architecture/curriculum-projection-parity.test.js',
    'src/data/contentHierarchy.js',
    'tests/architecture/content-hierarchy.test.js',
    'docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md',
]
for item in DELETE:
    path = Path(item)
    if not path.exists():
        raise RuntimeError(f'expected retirement target missing: {item}')
    path.unlink()

package_path = Path('package.json')
package = json.loads(package_path.read_text())
for key in [
    'curriculum:projections:generate',
    'curriculum:projections:check',
    'curriculum:projections:report',
]:
    package['scripts'].pop(key, None)
package['scripts']['verify'] = package['scripts']['verify'].replace(
    'pnpm curriculum:projections:check && ',
    '',
)
package_path.write_text(json.dumps(package, indent=2) + '\n')

integrity = Path('tests/architecture/curriculum-catalogue-integrity.test.js')
replace_once(
    integrity,
    "import { loadCompatibility } from '../../src/curriculum-catalogue/compatibility/index.js'\n",
    "",
)
replace_once(
    integrity,
    """/**
 * The pre-cutover loader targets, chapter id → project-relative content path.
 *
 * Read from the frozen contract, not from `src/content/chapterContentRegistry.js`.
 * Since Stage 4 that file re-exports the generated projection, which is itself
 * built from these records — parsing it would compare the catalogue with
 * itself. `tests/fixtures/curriculum-runtime-v1.json` is the independent
 * capture of what the registry held before the cutover.
 */
const FROZEN_RUNTIME = JSON.parse(read('tests/fixtures/curriculum-runtime-v1.json'))
const frozenLoaderPaths = () =>
  Object.fromEntries(FROZEN_RUNTIME.loaders.map(loader => [loader.id, loader.contentPath]))

""",
    "",
)
replace_pattern_once(
    integrity,
    r"  it\('preserves all 59 non-hidden chapter ids and adds six semantic ones',[\s\S]*?\n  \}\)\n\n  it\('excludes the hidden Renaissance bundle while keeping its progress reachable',[\s\S]*?\n  \}\)\n\n  it\('binds every available chapter to the content file it already loads',[\s\S]*?\n  \}\)\n",
    """  it('projects all 65 canonical Chapter ids and keeps the six semantic English additions planned', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    expect(runtime.CURRICULUM_CHAPTERS.map(chapter => chapter.id))
      .toEqual(chapters.map(chapter => chapter.id))

    const added = [
      'english-inspector-calls-consequences-resolution',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-social-message',
      'english-macbeth-appearance-reality',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
    ]
    for (const id of added) expect(byId(chapters, id).status, id).toBe('planned')
    for (const chapter of chapters) {
      expect(chapter.id.startsWith('cs_'), `${chapter.id} is a placeholder id`).toBe(false)
    }
  })

  it('retires the hidden Renaissance bundle while keeping both historical progress ids reachable', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    const hiddenId = 'history-medicine-renaissance-medicine'
    const replacement = 'history-medicine-vesalius-beginning-doubt'
    expect(chapters.some(chapter => chapter.id === hiddenId)).toBe(false)
    expect(runtime.CURRICULUM_CHAPTERS.some(chapter => chapter.id === hiddenId)).toBe(false)
    expect(runtime.CHAPTER_CONTENT_LOADERS).not.toHaveProperty(hiddenId)
    const progress = await import('../../src/data/chapterProgress.js')
    expect(progress.canonicalChapterId('mod2')).toBe(replacement)
    expect(progress.canonicalChapterId(hiddenId)).toBe(replacement)
  })

  it('binds every authored contentPath to an existing file and generated loader', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    const loaderIds = new Set(Object.keys(runtime.CHAPTER_CONTENT_LOADERS))
    for (const chapter of chapters) {
      if (chapter.contentPath === null) {
        expect(loaderIds.has(chapter.id), `${chapter.id} unexpectedly has a loader`).toBe(false)
        continue
      }
      expect(existsSync(resolve(root, chapter.contentPath)), `${chapter.contentPath} missing`).toBe(true)
      expect(loaderIds.has(chapter.id), `${chapter.id} has no generated loader`).toBe(true)
    }
  })
""",
)

# Current architecture guidance: one canonical runtime, not a compatibility
# projection plus re-export boundaries.
claude = Path('CLAUDE.md')
text = claude.read_text()
text = re.sub(r"\| `src/chapters\.js` \|[^\n]*\n", '', text)
text = re.sub(r"\| `src/data/modules\.js` \|[^\n]*\n", '', text)
text = re.sub(r"\| `src/content/chapterContentRegistry\.js` \|[^\n]*\n", '', text)
text = text.replace(
    '| `src/data/learnerCurriculum.js` | **Canonical learner runtime boundary.** Progress, planning, ChapterPlayer, completion and content loading import this file. It re-exports the generated canonical Module, Chapter, Learning Sequence and loader query model. |',
    '| `src/data/learnerCurriculum.js` | **Canonical learner runtime boundary.** Progress, planning, navigation, ChapterPlayer, completion and content loading import this file. It is the only production boundary for generated canonical Modules, Chapters, Learning Sequences and loaders. The retired `src/chapters.js`, `src/data/modules.js` and `chapterContentRegistry.js` files must not return. |',
)
claude.write_text(text)

hierarchy = Path('docs/system/CONTENT_HIERARCHY.md')
text = hierarchy.read_text()
text = text.replace(
    '- `src/data/modules.js` — re-export boundary for `MODULES`; never authored in.\n- `src/chapters.js` — re-export boundary for `CHAPTERS`; never authored in.\n- `src/content/chapterContentRegistry.js` — re-export boundary for the generated loaders; never authored in.\n',
    '- `src/data/learnerCurriculum.js` — sole production boundary for canonical Modules, Chapters, Learning Sequences and loaders.\n',
)
text = text.replace(
    '- `src/data/contentHierarchy.js` — hierarchy levels and the relationship validator.\n',
    '',
)
hierarchy.write_text(text)

plan = Path('.planning/phase-5-curriculum-architecture/IMPLEMENTATION-PLAN.md')
replace_pattern_once(
    plan,
    r"## Stage 6 — migrate the remaining legacy consumers, then clean up[\s\S]*?\n---\n\n## What each stage costs if it goes wrong",
    """## Stage 6 — canonical learner runtime and compatibility retirement

Stage 6 is complete. It did **not** route progress and planning through the
browser projection. Instead it added an explicit Learning Sequence configuration
and generated canonical learner-runtime query model:

- canonical Modules continue to own Chapter membership;
- Study Pathways continue to own qualification structure;
- Browser Entries continue to own destination presentation;
- Learning Sequences own only app-level continuation, numbering scope and planner order;
- `src/data/learnerCurriculum.js` is the sole production boundary for canonical
  Modules, Chapters, sequences and content loaders.

All live consumers moved from compatibility-shaped `MODULES`, `CHAPTERS` and
`CHAPTER_CONTENT_LOADERS` onto that boundary. The hidden Renaissance bundle was
retired; both historical progress ids now resolve directly to
`history-medicine-vesalius-beginning-doubt`.

Deleted after the migration passed parity, full verification and mobile smoke:

- `src/curriculum-catalogue/compatibility/`;
- the three old generated runtime projections and their generator;
- `src/data/modules.js`, `src/chapters.js` and
  `src/content/chapterContentRegistry.js`;
- the frozen runtime-v1 fixture and compatibility/parity tests;
- the redundant runtime content-hierarchy validator.

Deliberately retained: `screenTags` and `tagChapterMap.js`. They still power
weakness routing and cannot retire until Chapter Topic T3 provides the
concept→Topic replacement.

---

## What each stage costs if it goes wrong""",
)

adr = Path('docs/decisions/0002-canonical-curriculum-architecture.md')
with adr.open('a') as handle:
    handle.write("""

## Stage 6 closure

Stage 6 retired the runtime-v1 compatibility projection after introducing the
canonical learner-runtime model. A build-time Learning Sequence configuration
owns application continuation and planner order across canonical Modules; it is
not a seventh curriculum entity. Production now reaches canonical Modules,
Chapters, derived screen metadata and content loaders through
`src/data/learnerCurriculum.js` only. Browser navigation remains a separate
presentation projection. Historical Renaissance progress ids map directly to
the canonical Vesalius Chapter; no hidden Chapter or loader remains.
""")

# Guard against a second compatibility layer or the retired public files being
# reintroduced. This replaces the old byte-parity tests with the end-state rule.
runtime_test = Path('tests/architecture/learner-curriculum-runtime.test.js')
text = runtime_test.read_text()
text = text.replace(
    """import {
  MODULES as LEGACY_MODULES,
} from '../../src/data/modules.js'
import {
  CHAPTERS as LEGACY_CHAPTERS,
  isChapterAvailable as isLegacyChapterAvailable,
} from '../../src/chapters.js'
""",
    "",
)
replace_pattern_once(
    runtime_test,
    r"  it\('preserves the live available-Chapter set and current continuation order',[\s\S]*?\n  \}\)\n\n  it\('derives every available Chapter",
    """  it('projects exactly 30 available Chapters in Learning Sequence order', () => {
    const available = CURRICULUM_CHAPTERS.filter(isChapterAvailable)
    expect(available).toHaveLength(30)
    expect(getOrderedAvailableChapters().map(chapter => chapter.id)).toEqual(
      LEARNING_SEQUENCES
        .flatMap(sequence => sequence.chapterIds)
        .map(getCurriculumChapterById)
        .filter(isChapterAvailable)
        .map(chapter => chapter.id),
    )
  })

  it('derives every available Chapter""",
)
insert = """
  it('keeps retired compatibility files and public boundaries absent', () => {
    const retired = [
      'src/curriculum-catalogue/compatibility',
      'src/data/modules.js',
      'src/chapters.js',
      'src/content/chapterContentRegistry.js',
      'scripts/generate-curriculum-projections.mjs',
      'tests/fixtures/curriculum-runtime-v1.json',
    ]
    for (const path of retired) {
      expect(() => readFileSync(resolve(ROOT, path), 'utf8'), `${path} returned`).toThrow()
    }
  })
"""
text = runtime_test.read_text()
marker = "\n  it('moves every live consumer onto the public learner-curriculum boundary', () => {"
if marker not in text:
    raise RuntimeError('learner runtime insertion marker missing')
runtime_test.write_text(text.replace(marker, insert + marker, 1))

# The old Stage 4/5 authoring guard expected the three retired boundaries. Make
# active guidance enforce the new generator instead.
authoring_guard = Path('tests/architecture/chapter-authoring-boundary.test.js')
text = authoring_guard.read_text()
text = text.replace('src/chapters.js', 'src/data/learnerCurriculum.js')
text = text.replace('src/data/modules.js', 'src/curriculum-catalogue/runtime/learningSequences.js')
text = text.replace('src/content/chapterContentRegistry.js', 'scripts/generate-learner-curriculum.mjs')
authoring_guard.write_text(text)
