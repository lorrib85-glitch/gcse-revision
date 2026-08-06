from pathlib import Path
import re


def write(path, content):
    Path(path).write_text(content)


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
    updated, count = re.subn(pattern, lambda _: replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f'{path}: expected one pattern match, found {count}: {pattern!r}')
    path.write_text(updated)


# ─── Medicine content registry: content contract, not legacy row parity ─────
write('tests/architecture/content-registry.test.js', r"""import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getLearningSequenceById,
} from '../../src/data/learnerCurriculum.js'
import { canonicalChapterId } from '../../src/data/chapterProgress.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'

const chapterById = new Map(CURRICULUM_CHAPTERS.map(chapter => [chapter.id, chapter]))
const expectedBuiltMedicineIds = [
  'history-medicine-medieval-beliefs-causes',
  'history-medicine-black-death',
  'history-medicine-vesalius-beginning-doubt',
  'history-medicine-harvey-pare-renaissance-method',
  'history-medicine-surgery-anaesthetics',
  'history-medicine-great-plague-1665',
  'history-medicine-jenner-vaccination',
  'history-medicine-germ-theory',
  'history-medicine-great-stink',
  'history-medicine-surgery-revolution',
  'history-medicine-accidental-miracle',
  'history-medicine-modern-medicine',
  'history-medicine-cancer',
  'history-medicine-western-front',
]

describe('Medicine content registry', () => {
  it('contains the built canonical Medicine Chapters in learner-sequence order', () => {
    expect(MEDICINE_EPISODES.map(episode => episode.id)).toEqual(expectedBuiltMedicineIds)
    const sequence = getLearningSequenceById('history-medicine')
    const builtFromSequence = sequence.chapterIds
      .filter(id => CHAPTER_CONTENT_LOADERS[id])
      .filter(id => chapterById.get(id)?.screenCount > 0)
    expect(MEDICINE_EPISODES.map(episode => episode.id)).toEqual(builtFromSequence)
  })

  it('resolves every episode to canonical metadata and the generated loader', async () => {
    for (const episode of MEDICINE_EPISODES) {
      const chapter = chapterById.get(episode.id)
      expect(chapter, episode.id).toBeDefined()
      expect(chapter.status, episode.id).toBe('available')
      expect(chapter.screenCount, episode.id).toBe(episode.screens.length)
      expect(chapter.screenTags, episode.id).toEqual(episode.screens.map(screen => screen.tag ?? null))
      expect(CHAPTER_CONTENT_LOADERS[episode.id], episode.id).toBeTypeOf('function')
      expect((await CHAPTER_CONTENT_LOADERS[episode.id]()).id, episode.id).toBe(episode.id)
      expect(chapter, episode.id).not.toHaveProperty('number')
    }
  })

  it('keeps content-file episode numbers local to the content series', () => {
    const numbers = MEDICINE_EPISODES.map(episode => episode.number)
    expect(numbers.every(Number.isInteger)).toBe(true)
    expect(numbers).toEqual([...numbers].sort((left, right) => left - right))
    // Two distinct Chapter journeys deliberately share the historical episode
    // number 4; canonical ordering is owned by Module chapterRefs, not this field.
    expect(numbers.filter(number => number === 4)).toHaveLength(2)
  })

  it('validates every stage-navigation entry against its own screens', () => {
    for (const episode of MEDICINE_EPISODES) {
      for (const stage of episode.stageNavigation ?? []) {
        expect(stage).toHaveProperty('id')
        expect(stage).toHaveProperty('title')
        expect(stage.screenIndex, `${episode.id}:${stage.id}`).toBeGreaterThanOrEqual(0)
        expect(stage.screenIndex, `${episode.id}:${stage.id}`).toBeLessThan(episode.screens.length)
      }
    }
  })

  it('keeps the superseded Renaissance bundle outside the registry', () => {
    const oldId = 'history-medicine-renaissance-medicine'
    expect(MEDICINE_EPISODES.some(episode => episode.id === oldId)).toBe(false)
    expect(chapterById.has(oldId)).toBe(false)
    expect(CHAPTER_CONTENT_LOADERS).not.toHaveProperty(oldId)
    expect(canonicalChapterId(oldId)).toBe('history-medicine-vesalius-beginning-doubt')
  })
})
""")

# The Medicine index is an optional content-review convenience, not a loader
# registry or authoring authority.
index_path = Path('src/content/history/medicine/index.js')
replace_pattern_once(
    index_path,
    r"// Medicine Through Time — series content registry\.[\s\S]*?//\s+6\. Run: vitest run tests/architecture\n",
    """// Medicine Through Time — content-review index.
//
// Production loads Chapters independently through the generated canonical
// learner runtime. This ordered list exists only for cross-Chapter content
// review and architecture tests; it is not an authoring or loader registry.
//
// Add a Chapter through the canonical catalogue flow in CLAUDE.md, then include
// its content module here only when a cross-series review needs it.
""",
)

# ─── Final runtime boundary tests ───────────────────────────────────────────
integrity = Path('tests/architecture/curriculum-catalogue-integrity.test.js')
replace_pattern_once(
    integrity,
    r"  it\('keeps the three runtime files as re-exports that never reach the catalogue',[\s\S]*?\n  \}\)\n",
    """  it('keeps one public learner-runtime boundary and no retired runtime files', () => {
    const reachesCatalogue = /(?:from\\s*|import\\s*\\(?\\s*)['\"][^'\"]*curriculum-catalogue\//
    const boundary = read('src/data/learnerCurriculum.js')
    expect(boundary).toMatch(/^export\\s*\\{[^}]*\\}\\s*from\\s*'\\.\\/generated\\/curriculum\\/learnerCurriculum\\.js'/m)
    expect(boundary).not.toMatch(reachesCatalogue)
    for (const retired of [
      'src/data/modules.js',
      'src/chapters.js',
      'src/content/chapterContentRegistry.js',
    ]) expect(existsSync(resolve(root, retired)), retired).toBe(false)
  })
""",
)
replace_pattern_once(
    integrity,
    r"  it\('leaves the runtime catalogue exactly as it was',[\s\S]*?\n  \}\)\n",
    """  it('projects the authored catalogue into the canonical learner runtime', async () => {
    const catalogue = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    expect(runtime.CURRICULUM_CHAPTERS.map(chapter => chapter.id))
      .toEqual(catalogue.chapters.map(chapter => chapter.id))
    expect(runtime.CURRICULUM_MODULES.map(module => module.id))
      .toEqual(catalogue.modules.filter(module => module.status !== 'retired').map(module => module.id))
    expect(runtime.CURRICULUM_CHAPTERS).toHaveLength(65)
    expect(runtime.CURRICULUM_MODULES).toHaveLength(36)
    expect(Object.keys(runtime.CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
  })
""",
)

# The hidden Renaissance row previously inflated History's subject-tile average.
# Stage 6 deliberately removes that non-Chapter input; every other denominator is
# unchanged and navigation still owns no progress state.
nav_test = Path('tests/architecture/curriculum-navigation.test.js')
replace_once(
    nav_test,
    """      expect(CHAPTERS.filter(chapter => chapter.subject === entry.label)).toHaveLength(expected.progressDenominator)
      expect(entry).not.toHaveProperty('progress')
""",
    """      const canonicalDenominator = expected.progressDenominator - (entry.label === 'History' ? 1 : 0)
      expect(CHAPTERS.filter(chapter => chapter.subject === entry.label)).toHaveLength(canonicalDenominator)
      expect(entry).not.toHaveProperty('progress')
""",
)

# Empty directories are not Git objects. Assert the retired files, not the
# transient directory left in an Actions worktree after unlinking them.
runtime_test = Path('tests/architecture/learner-curriculum-runtime.test.js')
replace_once(
    runtime_test,
    """      'src/curriculum-catalogue/compatibility',
      'src/data/modules.js',
""",
    """      'src/curriculum-catalogue/compatibility/index.js',
      'src/curriculum-catalogue/compatibility/runtime-v1.js',
      'src/data/modules.js',
""",
)

# ─── Learning Graph reads canonical conceptIds and derived screenTags ───────
graph = Path('tests/architecture/learning-graph.test.js')
replace_once(
    graph,
    "import { CHAPTERS } from '../../src/chapters.js'",
    "import { CURRICULUM_CHAPTERS as CHAPTERS } from '../../src/data/learnerCurriculum.js'",
)
replace_pattern_once(
    graph,
    r"  it\('resolves a real medicine question through module \+ topic \+ question layers',[\s\S]*?\n  \}\)\n",
    """  it('resolves a real medicine question through canonical course, topic and question layers', () => {
    const chapter = CHAPTERS.find(record => record.id === 'history-medicine-medieval-beliefs-causes')
    const question = ALL_MEDICINE_QUESTIONS.find(record => record.id === 'med-th1-003')
    const courseLayer = [`subject:${chapter.subjectId}`, 'course:medicine', 'period:medieval']
    const effective = resolveEffectiveTags(courseLayer, MEDICINE_TOPICS[question.topicId].tags, question.tags)
    expect(effective).toContain('subject:history')
    expect(effective).toContain('course:medicine')
    expect(effective).toContain('period:medieval')
    expect(effective).toContain('history:medicine:black-death')
    expect(effective.filter(tag => tag === 'period:medieval')).toHaveLength(1)
  })
""",
)
replace_pattern_once(
    graph,
    r"  it\('every module tag is a registered concept or known facet',[\s\S]*?\n  \}\)\n\n  it\('all Medicine modules carry subject/course tags',[\s\S]*?\n  \}\)\n",
    """  it('every canonical Chapter concept id is registered', () => {
    for (const chapter of CHAPTERS) {
      for (const conceptId of chapter.conceptIds) {
        expect(isConceptId(conceptId), `${chapter.id}: ${conceptId}`).toBe(true)
      }
    }
  })

  it('keeps every Medicine Chapter in the History discipline and course sequence', () => {
    const medicineIds = new Set([
      'history-edexcel-medicine-britain',
      'history-edexcel-western-front',
    ])
    const medicine = CHAPTERS.filter(chapter => medicineIds.has(chapter.moduleId))
    expect(medicine.length).toBeGreaterThan(0)
    for (const chapter of medicine) {
      expect(chapter.subjectId, chapter.id).toBe('history')
      expect(chapter.sequenceId, chapter.id).toBe('history-medicine')
    }
  })
""",
)
replace_once(
    graph,
    """    CHAPTERS.filter(m => m.series === 'medicine')
      .flatMap(m => m.screenTags ?? [])
""",
    """    CHAPTERS.filter(chapter => chapter.sequenceId === 'history-medicine')
      .flatMap(chapter => chapter.screenTags ?? [])
""",
)

# Keep comments/current docs on the canonical bridge.
medicine_graph = Path('src/data/learningGraph/concepts/historyMedicine.js')
text = medicine_graph.read_text()
text = text.replace(
    '// effective = module.tags + MEDICINE_TOPICS[q.topicId].tags + q.tags',
    '// effective = canonical course facets + MEDICINE_TOPICS[q.topicId].tags + q.tags',
)
text = text.replace(
    '// Bridge from legacy single-word screen tags (`src/chapters.js` screenTags, consumed',
    '// Bridge from legacy single-word screen tags (derived into learnerCurriculum.js and consumed',
)
medicine_graph.write_text(text)

# ─── Active authoring guidance ──────────────────────────────────────────────
hierarchy = Path('docs/system/CONTENT_HIERARCHY.md')
text = hierarchy.read_text()
text = re.sub(
    r"> \*\*Since the Stage 4 cutover, `src/data/modules\.js`, `src/chapters\.js` and\n> `src/content/chapterContentRegistry\.js` are generated re-export boundaries\.\*\*[^\n]*\n(?:>[^\n]*\n)*",
    "> **Since Stage 6, production uses one canonical learner-runtime boundary:**\n> `src/data/learnerCurriculum.js`. The three former compatibility boundaries are retired.\n",
    text,
)
hierarchy.write_text(text)

catalogue_doc = Path('docs/system/CURRICULUM_CATALOGUE.md')
text = catalogue_doc.read_text()
text = text.replace('pnpm curriculum:projections:generate   # write src/data/generated/curriculum/**', 'pnpm curriculum:runtime:generate       # write the canonical learner runtime')
text = text.replace('pnpm curriculum:projections:check      # fail on drift, or on any runtime parity break', 'pnpm curriculum:runtime:check          # fail when the learner runtime drifts')
text = text.replace('pnpm curriculum:projections:report     # write the screenTags review artefact\n', '')
text = text.replace('`curriculum:check` and `curriculum:projections:check` both run inside', '`curriculum:check` and `curriculum:runtime:check` both run inside')
catalogue_doc.write_text(text)

learning_doc = Path('docs/system/LEARNING_GRAPH.md')
text = learning_doc.read_text()
text = text.replace('| Module | `tags` on the 14 Medicine chapter entries in `src/chapters.js` |', '| Chapter | canonical `conceptIds` on Chapter records, projected through `learnerCurriculum.js` |')
text = text.replace('| Screen (legacy) | `screenTags` in `src/chapters.js` stay as-is; `MEDICINE_SCREEN_TAG_CONCEPTS` bridges them to concept ids without a migration |', '| Screen (legacy) | content `tag` values are derived into `learnerCurriculum.js`; `MEDICINE_SCREEN_TAG_CONCEPTS` bridges them to concept ids until Chapter Topics replace the route |')
learning_doc.write_text(text)

workflow_doc = Path('docs/system/workflows/README.md')
text = workflow_doc.read_text().replace(
    '`src/curriculum-catalogue/records/**` — chapter or module records (then `pnpm curriculum:projections:generate`)',
    '`src/curriculum-catalogue/records/**` — Chapter or Module records (then `pnpm curriculum:runtime:generate`)',
)
workflow_doc.write_text(text)

# Skill guidance: update active instructions rather than exempting them.
canonical_topic = Path('.claude/skills/canonical-topic/SKILL.md')
text = canonical_topic.read_text()
text = text.replace('current src/chapters.js state', 'current canonical Chapter records')
text = text.replace('The matching entry/entries in `src/chapters.js`', 'The matching canonical Chapter record(s) in `src/curriculum-catalogue/records/chapters/`')
text = text.replace('Check `src/chapters.js` for any chapter whose `title`', 'Check canonical Chapter records for any Chapter whose `title`')
text = text.replace('no `src/chapters.js` title match', 'no canonical Chapter title match')
text = text.replace('`src/chapters.js` has a title match', 'a canonical Chapter record has a title match')
text = text.replace('Spine column or `src/chapters.js` match', 'Spine column or canonical Chapter match')
text = text.replace('### 2d. Current src/chapters.js entry/entries', '### 2d. Current canonical Chapter record(s)')
text = text.replace('read the matching metadata row in `src/chapters.js`, then resolve the chapter\'s\nloader in `src/content/chapterContentRegistry.js`', 'read the matching canonical Chapter record, then resolve the Chapter\'s\nloader through `src/data/learnerCurriculum.js`')
canonical_topic.write_text(text)

chapter_creation = Path('.claude/skills/chapter-creation/SKILL.md')
text = chapter_creation.read_text()
text = text.replace('`pnpm curriculum:projections:generate`', '`pnpm curriculum:runtime:generate`')
text = text.replace('`src/content/chapterContentRegistry.js` is a', '`src/data/learnerCurriculum.js` is the generated-runtime')
chapter_creation.write_text(text)

content_create = Path('.claude/skills/content-create/SKILL.md')
text = content_create.read_text().replace(
    'all GENERATED — run `pnpm curriculum:projections:generate` instead of',
    'all GENERATED — run `pnpm curriculum:runtime:generate` instead of',
)
content_create.write_text(text)

registry_skill = Path('.claude/skills/gcse-content-registry/SKILL.md')
text = registry_skill.read_text()
text = re.sub(
    r"\| `src/data/generated/curriculum/\*\*` \|[^\n]*\|",
    '| `src/data/generated/curriculum/learnerCurriculum.js` | Generated canonical Modules, Chapters, Learning Sequences and loaders; read only through `src/data/learnerCurriculum.js` |',
    text,
)
text = text.replace('`pnpm curriculum:projections:generate`', '`pnpm curriculum:runtime:generate`')
text = text.replace("import { CHAPTERS } from '../../src/chapters.js'", "import { CURRICULUM_CHAPTERS } from '../../src/data/learnerCurriculum.js'")
text = text.replace("import { MODULES } from '../../src/data/modules.js'", "import { CURRICULUM_MODULES } from '../../src/data/learnerCurriculum.js'")
text = text.replace("import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'", "import { CHAPTER_CONTENT_LOADERS } from '../../src/data/learnerCurriculum.js'")
registry_skill.write_text(text)
