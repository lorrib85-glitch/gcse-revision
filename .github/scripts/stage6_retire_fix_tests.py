from pathlib import Path
import re

ROOT = Path('.')


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
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f'{path}: expected one pattern match, found {count}: {pattern!r}')
    path.write_text(updated)


# ─── End-state architecture suites ──────────────────────────────────────────

write('tests/architecture/chapter-authoring-boundary.test.js', r"""// A normal Chapter is authored entirely through governed data. Adding one must
// not require a bespoke runtime branch or a second hierarchy registry.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkIntegrity, loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import {
  BLOCK_REGISTRY,
  SCREEN_REGISTRY,
  validateChapterDefinition,
} from '../../src/data/screenRegistry.js'
import {
  BLOCK_RENDERER_TYPES,
  FULL_SCREEN_RENDERER_TYPES,
} from '../../src/components/layout/ScreenRenderer.jsx'

const ROOT = resolve(process.cwd())
const read = path => readFileSync(resolve(ROOT, path), 'utf8')
const NEW_CHAPTER_ID = 'architecture-fixture-representative-chapter'

const NEW_CHAPTER_CONTENT = {
  id: NEW_CHAPTER_ID,
  subject: 'History',
  screens: [
    {
      type: 'standard',
      title: 'What the fixture teaches',
      blocks: [
        { type: 'read', text: 'A registered block, composed rather than invented.' },
        { type: 'reveal', prompt: 'Which file owns component routing?', answer: 'ScreenRenderer.' },
      ],
    },
    {
      type: 'quickRecall',
      questions: [{ q: 'Does adding a Chapter require editing the runtime?', options: ['Yes', 'No'], correct: 1 }],
    },
  ],
}

const RUNTIME_FILES = [
  'src/components/layout/ChapterPlayer.jsx',
  'src/components/layout/ScreenRenderer.jsx',
  'src/app/LegacyApp.jsx',
  'src/app/chapterNavigation.js',
  'src/progress.js',
  'src/data/chapterProgress.js',
  'src/data/learnerCurriculum.js',
]

describe('Chapter authoring boundary', () => {
  it('validates representative content against the governed screen schema', () => {
    const result = validateChapterDefinition(NEW_CHAPTER_CONTENT)
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('composes only registered screen and block types', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      expect(SCREEN_REGISTRY).toHaveProperty(screen.type)
      for (const block of screen.blocks ?? []) expect(BLOCK_REGISTRY).toHaveProperty(block.type)
    }
  })

  it('routes every authored type through ScreenRenderer already', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      const definition = SCREEN_REGISTRY[screen.type]
      if (definition.layout === 'full') expect(FULL_SCREEN_RENDERER_TYPES).toContain(screen.type)
      for (const block of screen.blocks ?? []) expect(BLOCK_RENDERER_TYPES).toContain(block.type)
    }
  })

  it('satisfies canonical ownership when one Module receives one Chapter reference', async () => {
    const catalogue = await loadCatalogue()
    const template = catalogue.chapters.find(chapter => chapter.id === 'history-medicine-medieval-beliefs-causes')
    const parent = catalogue.modules.find(module => module.chapterRefs.some(ref => ref.chapterId === template.id))
    const newChapter = {
      ...template,
      id: NEW_CHAPTER_ID,
      title: 'A representative new Chapter',
      status: 'planned',
      contentPath: null,
    }
    const newModules = catalogue.modules.map(module => module.id === parent.id
      ? {
          ...module,
          chapterRefs: [
            ...module.chapterRefs,
            { chapterId: NEW_CHAPTER_ID, position: module.chapterRefs.length },
          ],
        }
      : module)
    expect(checkIntegrity({ ...catalogue, modules: newModules, chapters: [...catalogue.chapters, newChapter] }))
      .toEqual([])
  })

  it('needs no mention of its id in any runtime file', () => {
    for (const path of RUNTIME_FILES) expect(read(path), path).not.toContain(NEW_CHAPTER_ID)
  })

  it('keeps ScreenRenderer the only component-routing boundary', () => {
    const player = read('src/components/layout/ChapterPlayer.jsx')
    expect(player).toContain('ScreenRenderer')
    expect(player).not.toMatch(/screen\.type\s*===\s*['"]/)
    expect(player).not.toMatch(/SCREEN_REGISTRY\s*\[/)
  })
})
""")

write('tests/architecture/content-loading-boundary.test.js', r"""import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(js|jsx)$/.test(entry.name) ? [full] : []
  })
}

const allSrcFiles = walk(resolve(root, 'src'))
const generated = resolve(root, 'src/data/generated/curriculum/learnerCurriculum.js')
const boundary = resolve(root, 'src/data/learnerCurriculum.js')

describe('content-loading boundary', () => {
  it('keeps the loader registry generated once and exposed through one public boundary', () => {
    const declarers = allSrcFiles.filter(file =>
      /export\s+const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(readFileSync(file, 'utf8')),
    )
    expect(declarers).toEqual([generated])
    expect(readFileSync(boundary, 'utf8')).toContain('CHAPTER_CONTENT_LOADERS')
  })

  it('keeps shell files free of static episode imports', () => {
    for (const rel of ['src/App.jsx', 'src/app/LegacyApp.jsx']) {
      const source = readFileSync(resolve(root, rel), 'utf8')
      expect(source, rel).not.toMatch(/^import\s+.*from\s+['"][^'"]*content[^'"]*episodes/m)
    }
  })

  it('generates one async loader for each of the 59 Chapters with a content file', async () => {
    expect(Object.keys(CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect(loader, id).toBeTypeOf('function')
      const result = loader()
      expect(result, id).toBeInstanceOf(Promise)
      const content = await result
      expect(content.id, id).toBe(id)
      expect(CURRICULUM_CHAPTERS.some(chapter => chapter.id === id), id).toBe(true)
    }
  })

  it('keeps zero-screen source files empty and leaves six fileless planned Chapters without loaders', async () => {
    const missing = []
    for (const chapter of CURRICULUM_CHAPTERS) {
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      if (!loader) {
        missing.push(chapter.id)
        expect(chapter.status, chapter.id).toBe('planned')
        expect(chapter.screenCount, chapter.id).toBe(0)
        continue
      }
      const content = await loader()
      expect(content.screens.length, chapter.id).toBe(chapter.screenCount)
      if (chapter.screenCount === 0) expect(content.screens, chapter.id).toEqual([])
    }
    expect(missing.sort()).toEqual([
      'english-inspector-calls-consequences-resolution',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-social-message',
      'english-macbeth-appearance-reality',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
    ])
  })

  it('does not restore the retired subject-bundle loader pattern', () => {
    const offenders = allSrcFiles
      .filter(file => readFileSync(file, 'utf8').includes('SUBJECT_MODULE_LOADERS'))
      .map(file => file.replace(`${root}/`, ''))
    expect(offenders).toEqual([])
  })
})
""")

write('tests/architecture/module-availability.test.js', r"""import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CURRICULUM_MODULES,
  CHAPTER_CONTENT_LOADERS,
  isChapterAvailable,
} from '../../src/data/learnerCurriculum.js'
import { TAG_CHAPTER_MAP } from '../../src/data/tagChapterMap.js'

const chapterById = new Map(CURRICULUM_CHAPTERS.map(chapter => [chapter.id, chapter]))

describe('canonical Chapter availability', () => {
  it('is authored as status and requires real screens to become openable', () => {
    expect(isChapterAvailable({ status: 'available', screenCount: 5 })).toBe(true)
    expect(isChapterAvailable({ status: 'available', screenCount: 0 })).toBe(false)
    expect(isChapterAvailable({ status: 'planned', screenCount: 5 })).toBe(false)
    expect(isChapterAvailable(null)).toBe(false)
    for (const chapter of CURRICULUM_CHAPTERS) {
      expect(['available', 'planned']).toContain(chapter.status)
      expect(isChapterAvailable(chapter)).toBe(chapter.status === 'available' && chapter.screenCount > 0)
    }
  })

  it('gives every available Chapter loadable non-empty content', async () => {
    const available = CURRICULUM_CHAPTERS.filter(isChapterAvailable)
    expect(available).toHaveLength(30)
    for (const chapter of available) {
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      expect(loader, chapter.id).toBeTypeOf('function')
      expect((await loader()).screens.length, chapter.id).toBeGreaterThan(0)
    }
  })
})

describe('canonical Module and recovery discovery safety', () => {
  it('resolves every canonical Module Chapter reference', () => {
    for (const module of CURRICULUM_MODULES) {
      for (const ref of module.chapterRefs) {
        expect(chapterById.has(ref.chapterId), `${module.id} → ${ref.chapterId}`).toBe(true)
      }
    }
  })

  it('keeps every current weak-spot route on an available Chapter', () => {
    for (const [tag, target] of Object.entries(TAG_CHAPTER_MAP)) {
      if (target === null) continue
      expect(isChapterAvailable(chapterById.get(target)), `${tag} → ${target}`).toBe(true)
    }
  })
})
""")

write('tests/architecture/module-metadata-integrity.test.js', r"""import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

const loaderIds = new Set(Object.keys(CHAPTER_CONTENT_LOADERS))
const built = CURRICULUM_CHAPTERS.filter(chapter => chapter.screenCount > 0)
const zeroScreen = CURRICULUM_CHAPTERS.filter(chapter => chapter.screenCount === 0)

describe('generated Chapter metadata integrity', () => {
  it('derives an empty screenTags array for every zero-screen Chapter', () => {
    for (const chapter of zeroScreen) expect(chapter.screenTags, chapter.id).toEqual([])
  })

  it('gives every built Chapter a loader and matching derived metadata', async () => {
    for (const chapter of built) {
      expect(loaderIds.has(chapter.id), chapter.id).toBe(true)
      const content = await CHAPTER_CONTENT_LOADERS[chapter.id]()
      expect(chapter.screenCount, chapter.id).toBe(content.screens.length)
      expect(chapter.screenTags, chapter.id).toEqual(content.screens.map(screen => screen.tag ?? null))
    }
  })

  it('keeps every loader attached to canonical Chapter metadata', () => {
    const chapterIds = new Set(CURRICULUM_CHAPTERS.map(chapter => chapter.id))
    for (const id of loaderIds) expect(chapterIds.has(id), id).toBe(true)
  })

  it('does not manufacture loaders for the six planned Chapters with no source file', () => {
    const withoutLoader = CURRICULUM_CHAPTERS.filter(chapter => !loaderIds.has(chapter.id))
    expect(withoutLoader).toHaveLength(6)
    for (const chapter of withoutLoader) {
      expect(chapter.status, chapter.id).toBe('planned')
      expect(chapter.screenCount, chapter.id).toBe(0)
    }
  })
})
""")

write('tests/architecture/placeholder-chapter-safety.test.js', r"""import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CURRICULUM_CHAPTERS } from '../../src/data/learnerCurriculum.js'

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

describe('planned Chapter safety', () => {
  it('keeps governed unbuilt Chapters canonical and explicitly planned', () => {
    const planned = CURRICULUM_CHAPTERS.filter(chapter => chapter.status === 'planned')
    expect(planned).toHaveLength(35)
    expect(planned.every(chapter => chapter.screenCount === 0)).toBe(true)
    expect(CURRICULUM_CHAPTERS.some(chapter => chapter.id.startsWith('cs_'))).toBe(false)
  })

  it('guards ChapterPlayer opening before changing view', () => {
    const src = read('src/app/LegacyApp.jsx')
    const fnStart = src.indexOf('function openChapterPlayer(')
    const fnBody = src.slice(fnStart, fnStart + 800)
    const guard = /if\s*\(!\s*chapter\??\.\s*screenCount\s*\)\s*return/
    expect(fnBody).toMatch(guard)
    expect(fnBody.search(guard)).toBeLessThan(fnBody.indexOf("setView('chapter')"))
  })

  it('maps generated navigation openability onto browser coming-soon state', () => {
    const adapter = read('src/features/subjects/subjectNavigationAdapter.js')
    const subjects = read('src/features/subjects/Subjects.jsx')
    expect(adapter).toContain('comingSoon: !card.openable')
    expect(adapter).toContain('openable: card.openable')
    expect(subjects).toMatch(/if\s*\(!item\.openable\)[\s\S]*status:\s*'coming_soon'/)
  })
})
""")

write('tests/architecture/learner-curriculum-runtime.test.js', r"""import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import { loadLearningSequences, validateLearningSequences } from '../../src/curriculum-catalogue/runtime/index.js'
import { assertInputPurity, buildLearnerCurriculum } from '../../scripts/generate-learner-curriculum.mjs'
import {
  LEARNING_SEQUENCES,
  CURRICULUM_MODULES,
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getCurriculumChapterById,
  getLearningSequenceForChapter,
  getOrderedAvailableChapters,
  isChapterAvailable,
} from '../../src/data/learnerCurriculum.js'
import { canonicalChapterId, chapterProgressSourceKeys } from '../../src/data/chapterProgress.js'

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const productionFiles = [
  'src/progress.js',
  'src/app/chapterNavigation.js',
  'src/features/planner/dailyPlanner.js',
  'src/todaysPlan.js',
  'src/features/progress/Progress.jsx',
  'src/app/LegacyApp.jsx',
  'src/components/layout/ChapterPlayer.jsx',
  'src/components/layout/ChapterCompleteScreen.jsx',
  'src/features/subjects/subjectNavigationAdapter.js',
]

describe('canonical learner runtime', () => {
  it('validates seven semantic Learning Sequences', async () => {
    const catalogue = await loadCatalogue()
    const sequences = loadLearningSequences(catalogue)
    expect(validateLearningSequences(sequences, catalogue)).toEqual([])
    expect(sequences.map(sequence => sequence.id)).toEqual([
      'history-medicine', 'sociology-family', 'maths-number', 'biology-core',
      'english-macbeth', 'history-spain-new-world', 'history-usa-conflict',
    ])
  })

  it('projects 36 Modules and all 65 canonical Chapters without compatibility fields', () => {
    expect(CURRICULUM_MODULES).toHaveLength(36)
    expect(CURRICULUM_CHAPTERS).toHaveLength(65)
    expect(LEARNING_SEQUENCES).toHaveLength(7)
    for (const chapter of CURRICULUM_CHAPTERS) {
      for (const field of ['number', 'series', 'color', 'colorLight', 'tags', 'availability']) {
        expect(chapter, `${chapter.id}.${field}`).not.toHaveProperty(field)
      }
      expect(chapter).toHaveProperty('moduleId')
      expect(chapter).toHaveProperty('status')
      expect(chapter).toHaveProperty('screenCount')
      expect(chapter).toHaveProperty('screenTags')
    }
  })

  it('projects exactly 30 available Chapters in Learning Sequence order', () => {
    expect(CURRICULUM_CHAPTERS.filter(isChapterAvailable)).toHaveLength(30)
    expect(getOrderedAvailableChapters().map(chapter => chapter.id)).toEqual(
      LEARNING_SEQUENCES
        .flatMap(sequence => sequence.chapterIds)
        .map(getCurriculumChapterById)
        .filter(isChapterAvailable)
        .map(chapter => chapter.id),
    )
  })

  it('resolves every available Chapter through exactly one Learning Sequence', () => {
    for (const chapter of CURRICULUM_CHAPTERS.filter(isChapterAvailable)) {
      const sequence = getLearningSequenceForChapter(chapter.id)
      expect(sequence, chapter.id).not.toBeNull()
      expect(sequence.chapterIds.filter(id => id === chapter.id)).toHaveLength(1)
    }
  })

  it('generates 59 canonical loaders and no hidden Renaissance loader', async () => {
    expect(Object.keys(CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
    expect(CHAPTER_CONTENT_LOADERS).not.toHaveProperty('history-medicine-renaissance-medicine')
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect((await loader()).id, id).toBe(id)
    }
  })

  it('maps both historical Renaissance ids directly onto the canonical replacement', () => {
    const replacement = 'history-medicine-vesalius-beginning-doubt'
    expect(canonicalChapterId('mod2')).toBe(replacement)
    expect(canonicalChapterId('history-medicine-renaissance-medicine')).toBe(replacement)
    const sources = chapterProgressSourceKeys(replacement)
    expect(sources).toContain('gcse_chapter_history-medicine-renaissance-medicine')
    expect(sources).toContain('gcse_module_mod2')
  })

  it('keeps the generator independent of compatibility and browser output', async () => {
    expect(assertInputPurity()).toEqual([])
    const catalogue = await loadCatalogue()
    const built = await buildLearnerCurriculum(catalogue, loadLearningSequences(catalogue))
    expect(built.chapters).toEqual(CURRICULUM_CHAPTERS)
    expect(built.modules).toEqual(CURRICULUM_MODULES)
    expect(built.sequences).toEqual(LEARNING_SEQUENCES)
  })

  it('keeps retired compatibility paths absent', () => {
    for (const path of [
      'src/curriculum-catalogue/compatibility',
      'src/data/modules.js',
      'src/chapters.js',
      'src/content/chapterContentRegistry.js',
      'scripts/generate-curriculum-projections.mjs',
      'tests/fixtures/curriculum-runtime-v1.json',
    ]) expect(existsSync(resolve(ROOT, path)), path).toBe(false)
  })

  it('moves every live consumer onto the public learner boundary', () => {
    for (const path of productionFiles) {
      const source = readFileSync(resolve(ROOT, path), 'utf8')
      expect(source, path).toContain('learnerCurriculum.js')
      expect(source, path).not.toMatch(/generated\/curriculum\/learnerCurriculum\.js/)
      expect(source, path).not.toMatch(/(?:chapters|data\/modules|chapterContentRegistry)\.js['"]/) 
    }
  })
})
""")

write('tests/architecture/authoring-guidance.test.js', r"""import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')
const GUIDANCE_ROOTS = ['CLAUDE.md', 'docs/system', 'docs/components', '.claude/skills', 'src/component-catalogue/records']

function listGuidance() {
  const out = []
  const walk = rel => {
    const absolute = resolve(root, rel)
    if (!existsSync(absolute)) return
    if (!statSync(absolute).isDirectory()) { out.push(rel); return }
    for (const name of readdirSync(absolute)) walk(posix.join(rel, name))
  }
  for (const entry of GUIDANCE_ROOTS) walk(entry)
  return out.filter(file => /\.(md|js)$/.test(file))
}

const guidance = listGuidance()
const retired = /src\/chapters\.js|src\/data\/modules\.js|chapterContentRegistry\.js|curriculum:projections:/

describe('active Chapter authoring guidance', () => {
  it('does not instruct authors to use retired runtime boundaries or commands', () => {
    const offenders = []
    for (const file of guidance) {
      const source = read(file)
      for (const line of source.split('\n')) {
        if (!retired.test(line)) continue
        if (/retired|must not return|do not reintroduce|historical|deleted/.test(line)) continue
        offenders.push(`${file}: ${line.trim()}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('states the canonical eight-step authoring flow', () => {
    const claude = read('CLAUDE.md')
    expect(claude).toContain('src/data/learnerCurriculum.js')
    const flow = claude.slice(claude.indexOf('#### Adding or changing a chapter'))
    const steps = [
      /1\..*Chapter record/s,
      /2\..*exactly one.*Module/s,
      /3\..*content file/s,
      /4\..*contentPath/s,
      /5\..*concepts/s,
      /6\..*curriculum:runtime:generate/s,
      /7\..*lab:generate/s,
      /8\..*pnpm verify/s,
    ]
    let cursor = 0
    for (const [index, pattern] of steps.entries()) {
      const offset = flow.slice(cursor).search(pattern)
      expect(offset, `authoring step ${index + 1}`).toBeGreaterThanOrEqual(0)
      cursor += offset + 1
    }
  })

  it('states the generated consequences precisely', () => {
    const claude = read('CLAUDE.md')
    for (const claim of [
      /screenCount.*screenTags.*derived/is,
      /Loader entries are generated/i,
      /canonical Modules.*Chapters.*generated/is,
      /never edits `ChapterPlayer`, `ScreenRenderer`/i,
      /planned Chapter.*zero-screen content file/is,
      /Topic metadata.*inside Chapter content/is,
      /status.*authored/is,
    ]) expect(claude, String(claim)).toMatch(claim)
  })

  it('keeps the ChapterPlayer catalogue rule aligned', async () => {
    const record = (await import('../../src/component-catalogue/records/chapter-player.js')).default
    const rule = record.documentation.governanceRules.find(entry => entry.startsWith('Chapter-building rule:'))
    expect(rule).toMatch(/canonical Chapter record/)
    expect(rule).toMatch(/exactly one canonical Module record/)
    expect(rule).toMatch(/learnerCurriculum\.js/)
    expect(rule).toMatch(/screenCount, screenTags and the loader entry are derived/)
    expect(rule).not.toMatch(/src\/chapters\.js|src\/data\/modules\.js|chapterContentRegistry/)
  })
})
""")

# ─── Generic imports in content- and routing-focused architecture tests ─────

def map_named_imports(path, old_source, new_source, mapping):
    text = path.read_text()
    pattern = re.compile(r"import\s*\{([\s\S]*?)\}\s*from\s*['\"]" + re.escape(old_source) + r"['\"]")

    def convert(match):
        names = [name.strip() for name in match.group(1).split(',') if name.strip()]
        converted = []
        for name in names:
            if name not in mapping:
                raise RuntimeError(f'{path}: unsupported import {name} from {old_source}')
            converted.append(mapping[name])
        return 'import {\n  ' + ',\n  '.join(converted) + f",\n}} from '{new_source}'"

    updated, count = pattern.subn(convert, text)
    if count:
        path.write_text(updated)


for path in Path('tests').rglob('*.js'):
    map_named_imports(path, '../../src/chapters.js', '../../src/data/learnerCurriculum.js', {
        'CHAPTERS': 'CURRICULUM_CHAPTERS as CHAPTERS',
        'isChapterAvailable': 'isChapterAvailable',
    })
    map_named_imports(path, '../../src/content/chapterContentRegistry.js', '../../src/data/learnerCurriculum.js', {
        'CHAPTER_CONTENT_LOADERS': 'CHAPTER_CONTENT_LOADERS',
    })
    map_named_imports(path, '../../src/data/modules.js', '../../src/data/learnerCurriculum.js', {
        'MODULES': 'CURRICULUM_MODULES as MODULES',
        'getModuleById': 'getCurriculumModuleById as getModuleById',
    })

# Dynamic imports and factual wording in the ChapterPlayer private-family guard.
private_family = Path('tests/architecture/chapter-player-private-family.test.js')
text = private_family.read_text()
text = text.replace("const { CHAPTERS } = await import('../../src/chapters.js')", "const { CURRICULUM_CHAPTERS: CHAPTERS } = await import('../../src/data/learnerCurriculum.js')")
text = text.replace('falling back to the chapters.js row', 'falling back to canonical learner-runtime metadata')
text = text.replace("it('no chapters.js row defines a top-level examiner or examinerExplains'", "it('no canonical Chapter row defines a top-level examiner or examinerExplains'")
private_family.write_text(text)

# Extracted content test messages should name the generated metadata, not retired files.
extracted = Path('tests/architecture/extracted-chapter-contract.test.js')
text = extracted.read_text()
text = text.replace('in chapterContentRegistry.js', 'in learnerCurriculum.js')
text = text.replace('in src/chapters.js', 'in learnerCurriculum.js')
text = text.replace('src/chapters.js screenCount=', 'generated screenCount=')
extracted.write_text(text)

# Replace obsolete content-binding parity with canonical record ↔ loader checks.
integrity = Path('tests/architecture/curriculum-catalogue-integrity.test.js')
replace_pattern_once(
    integrity,
    r"describe\('chapter content bindings', \(\) => \{[\s\S]*?\n\}\)\n\n// ─── Science paper mappings",
    r"""describe('canonical Chapter content bindings', () => {
  it('generates one loader for every canonical Chapter with a contentPath', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    const loaderIds = new Set(Object.keys(runtime.CHAPTER_CONTENT_LOADERS))
    expect(loaderIds.size).toBe(59)
    for (const chapter of chapters) {
      expect(loaderIds.has(chapter.id), chapter.id).toBe(chapter.contentPath !== null)
      if (chapter.contentPath !== null) expect(existsSync(resolve(root, chapter.contentPath)), chapter.id).toBe(true)
    }
  })

  it('keeps status and content binding independent', async () => {
    const { chapters } = await loadCatalogue()
    const planned = chapters.filter(chapter => chapter.status === 'planned')
    expect(planned.filter(chapter => chapter.contentPath !== null)).toHaveLength(29)
    expect(planned.filter(chapter => chapter.contentPath === null)).toHaveLength(6)
    const bound = { ...planned.find(chapter => chapter.contentPath !== null) }
    expect(validateChapter(bound)).toEqual([])
    expect(validateChapter({ ...bound, status: 'available', contentPath: null }).join(' '))
      .toMatch(/is "available" but contentPath is null/)
  })

  it('never promotes a planned Chapter merely because a source file exists', async () => {
    const { chapters } = await loadCatalogue()
    const runtime = await import('../../src/data/learnerCurriculum.js')
    for (const chapter of chapters.filter(record => record.status === 'planned' && record.contentPath !== null)) {
      const projected = runtime.getCurriculumChapterById(chapter.id)
      expect(projected.status, chapter.id).toBe('planned')
      expect(runtime.isChapterAvailable(projected), chapter.id).toBe(false)
    }
  })

  it('binds every content path to exactly one canonical owner', async () => {
    const { chapters } = await loadCatalogue()
    const all = chapters.filter(chapter => chapter.contentPath !== null).map(chapter => chapter.contentPath)
    expect(new Set(all).size).toBe(all.length)
    const problems = checkIntegrity({
      boards: [], subjects: [], specifications: [], pathways: [], modules: [],
      chapters: [
        { id: 'a', status: 'planned', contentPath: 'src/content/x.js', requirementIds: [], conceptIds: [] },
        { id: 'b', status: 'planned', contentPath: 'src/content/x.js', requirementIds: [], conceptIds: [] },
      ],
    })
    expect(problems.join(' ')).toMatch(/is bound by both "a" and "b"/)
  })
})

// ─── Science paper mappings""",
)
text = integrity.read_text()
text = text.replace('scripts/generate-curriculum-projections.mjs writes the runtime\n    // projections under src/data/generated/curriculum/.', 'scripts/generate-learner-curriculum.mjs writes the learner runtime\n    // under src/data/generated/curriculum/.')
text = text.replace("expect(rendered).toContain('history-medicine-renaissance-medicine')", "expect(rendered).toContain('history-medicine-renaissance-medicine` → `history-medicine-vesalius-beginning-doubt')")
integrity.write_text(text)

# Canonical vocabulary now protects one generated learner boundary, not three
# compatibility-shaped public files.
vocabulary = Path('tests/architecture/canonical-vocabulary.test.js')
text = vocabulary.read_text()
text = text.replace('  module   = a parent curriculum unit (src/data/modules.js)\n//   chapter  = one learner-facing journey (src/chapters.js)', '  module   = a canonical curriculum unit\n//   chapter  = one learner-facing journey')
text = text.replace("  'src/data/modules.js',\n  'src/data/contentHierarchy.js',\n  'src/app/chapterNavigation.js',", "  'src/data/learnerCurriculum.js',\n  'src/app/chapterNavigation.js',")
vocabulary.write_text(text)
replace_pattern_once(
    vocabulary,
    r"  it\('owns chapter metadata only in src/chapters\.js',[\s\S]*?\n  \}\)\n\n  it\('imports nothing from the deleted root chapter catalogue'",
    r"""  it('owns production Chapter metadata through one canonical learner boundary', () => {
    const boundary = read('src/data/learnerCurriculum.js')
    expect(boundary).toContain("from './generated/curriculum/learnerCurriculum.js'")
    expect(boundary).toContain('CURRICULUM_CHAPTERS')
    expect(boundary).toContain('CURRICULUM_MODULES')
    expect(boundary).toContain('CHAPTER_CONTENT_LOADERS')

    const generatedImport = /(?:from\s*|import\s*\(\s*)['"][^'"]*generated\/curriculum\/learnerCurriculum\.js['"]/
    const importers = PRODUCTION_FILES.filter(path => generatedImport.test(read(path)))
    expect(importers).toEqual(['src/data/learnerCurriculum.js'])
    for (const retired of ['src/chapters.js', 'src/data/modules.js', 'src/content/chapterContentRegistry.js']) {
      expect(existsSync(resolve(ROOT, retired)), retired).toBe(false)
    }
  })

  it('imports nothing from the deleted root chapter catalogue'""",
)

# Current authoring guide and component record.
claude = Path('CLAUDE.md')
replace_pattern_once(
    claude,
    r"### Chapter content loading\n[\s\S]*?\n### Exam Mode question banks are lazy-loaded via context",
    r"""### Chapter content loading

The curriculum catalogue is the authored authority. Production reads one
canonical runtime boundary: `src/data/learnerCurriculum.js`. That boundary
re-exports generated canonical Modules, Chapters, Learning Sequences and content
loaders from `src/data/generated/curriculum/learnerCurriculum.js`; never import
the generated file directly.

The ownership chain is:

- `src/curriculum-catalogue/records/chapters/` — Chapter identity, learner copy,
  authored `status`, `contentPath`, concepts and requirements;
- `src/curriculum-catalogue/records/modules/` — canonical Chapter membership and
  order through `chapterRefs[].position`;
- `src/curriculum-catalogue/runtime/learningSequences.js` — app-level
  continuation, numbering scope and planner order across canonical Modules;
- `src/content/<subject>/<series>/episodes/` — hooks, outcomes, recall, stage
  navigation and screens;
- `scripts/generate-learner-curriculum.mjs` — derives screen metadata and loaders
  and writes the sole learner-runtime projection.

Browser destination presentation is separate and remains generated through the
navigation projection. Learning Sequences are application configuration, not a
seventh curriculum entity.

#### Adding or changing a chapter

1. Add or update the canonical **Chapter record**.
2. Add the Chapter reference to **exactly one** canonical **Module**, with its
   `position`.
3. Create or update the **Chapter content file**.
4. Set the record's **`contentPath`** to that file.
5. Register any new **concepts** separately in `src/data/learningGraph/`.
6. Run `pnpm curriculum:runtime:generate` and, when browser presentation changes,
   `pnpm curriculum:navigation:generate`.
7. Run `pnpm lab:generate` when screens or blocks are added, removed or moved.
8. Run `pnpm verify`.

Consequences:

- **`status` is authored.** A Chapter is openable only when its status is
  `available` and its derived `screenCount` is greater than zero.
- **`screenCount` and `screenTags` are derived** from the content file.
- **Loader entries are generated** from `contentPath`; never register one by hand
  or add a static episode import.
- **Canonical Modules and Chapters are generated** into the learner runtime.
- **Normal Chapter creation never edits `ChapterPlayer`, `ScreenRenderer`, app
  navigation or progress persistence.**
- **A planned Chapter may have a zero-screen content file** without becoming
  available.
- **Topic metadata, once implemented, lives inside Chapter content**, never in a
  curriculum record.
- Every non-retired canonical Chapter belongs to exactly one canonical Module.
  There is no hidden runtime Chapter exemption.

The retired `src/chapters.js`, `src/data/modules.js` and
`src/content/chapterContentRegistry.js` boundaries must not return.

### Exam Mode question banks are lazy-loaded via context""",
)
text = claude.read_text()
text = re.sub(r"\| `src/content/chapterContentRegistry\.js` \|[^\n]*\n", '', text)
claude.write_text(text)

record = Path('src/component-catalogue/records/chapter-player.js')
text = record.read_text()
text = text.replace("'MODULES',", "'LEARNING_SEQUENCES via learnerCurriculum.js',")
text = re.sub(
    r"'Chapter-building rule: [^']*'",
    "'Chapter-building rule: author a canonical Chapter record, reference it from exactly one canonical Module record, create its content file, set contentPath, use registered screens and blocks, then run the curriculum generators. Production reaches the result only through src/data/learnerCurriculum.js; screenCount, screenTags and the loader entry are derived. Adding a normal Chapter must not require editing ChapterPlayer, ScreenRenderer, app navigation or progress persistence. Enforced by tests/architecture/chapter-authoring-boundary.test.js and tests/architecture/authoring-guidance.test.js.'",
    text,
    count=1,
)
record.write_text(text)
