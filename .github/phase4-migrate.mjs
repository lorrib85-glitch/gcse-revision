import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

function read(path) {
  if (!existsSync(path)) throw new Error(`Missing file: ${path}`)
  return readFileSync(path, 'utf8')
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

function replaceExact(source, from, to, label, expected = 1) {
  const count = source.split(from).length - 1
  if (count !== expected) {
    throw new Error(`${label}: expected ${expected} exact matches, found ${count}\n${from.slice(0, 180)}`)
  }
  return source.split(from).join(to)
}

function replaceRegex(source, pattern, to, label, expected = 1) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
  const global = new RegExp(pattern.source, flags)
  const count = [...source.matchAll(global)].length
  if (count !== expected) {
    throw new Error(`${label}: expected ${expected} regex matches, found ${count}: ${pattern}`)
  }
  return source.replace(global, to)
}

function assertIncludes(source, value, label) {
  if (!source.includes(value)) throw new Error(`${label}: missing ${value}`)
}

function assertExcludes(source, value, label) {
  if (source.includes(value)) throw new Error(`${label}: must not contain ${value}`)
}

// ── Canonical chapter runtime ────────────────────────────────────────────────
const legacyPlayer = read('src/components/layout/ModulePlayer.jsx')
let chapterPlayer = legacyPlayer
chapterPlayer = chapterPlayer.replaceAll('../../app/moduleNavigation.js', '../../app/chapterNavigation.js')
chapterPlayer = chapterPlayer.replaceAll('computeInitialModuleState', 'computeInitialChapterState')
chapterPlayer = chapterPlayer.replaceAll('getModuleGate', 'getChapterGate')
chapterPlayer = chapterPlayer.replaceAll('completeModule', 'completeChapter')
chapterPlayer = chapterPlayer.replaceAll('moduleGate', 'chapterGate')
chapterPlayer = chapterPlayer.replaceAll('ModulePlayer', 'ChapterPlayer')
chapterPlayer = chapterPlayer.replace(/\bmodule\b/g, 'chapter')

assertIncludes(chapterPlayer, 'export default function ChapterPlayer({ chapter, onBack, onChapterComplete })', 'ChapterPlayer signature')
assertIncludes(chapterPlayer, "from '../../app/chapterNavigation.js'", 'ChapterPlayer navigation import')
assertIncludes(chapterPlayer, 'computeInitialChapterState(chapter, saved)', 'ChapterPlayer initial state')
assertIncludes(chapterPlayer, 'getChapterGate(chapter,', 'ChapterPlayer gate')
assertExcludes(chapterPlayer, 'function ModulePlayer', 'ChapterPlayer legacy implementation')
const embeddedChapterProps = (chapterPlayer.match(/\bchapter=\{chapter\}/g) || []).length
if (embeddedChapterProps !== 2) {
  throw new Error(`ChapterPlayer: expected 2 embedded chapter props, found ${embeddedChapterProps}`)
}
write('src/components/layout/ChapterPlayer.jsx', chapterPlayer)

write('src/components/layout/ModulePlayer.jsx', `// Legacy compatibility facade for the canonical chapter runtime.\n// New production code must import ChapterPlayer directly.\n\nimport ChapterPlayer from './ChapterPlayer.jsx'\n\nexport { ChapterPlayer }\n\nexport default function ModulePlayer({ module, chapter, ...props }) {\n  return <ChapterPlayer chapter={chapter || module} {...props} />\n}\n`)

// ── Canonical navigation helpers ─────────────────────────────────────────────
const legacyNavigation = read('src/app/moduleNavigation.js')
let chapterNavigation = legacyNavigation
chapterNavigation = chapterNavigation.replaceAll('computeInitialModuleState', 'computeInitialChapterState')
chapterNavigation = chapterNavigation.replaceAll('getModuleGate', 'getChapterGate')
chapterNavigation = chapterNavigation.replaceAll('prepareModuleScreenState', 'prepareChapterScreenState')
chapterNavigation = chapterNavigation.replaceAll('completeModule', 'completeChapter')
chapterNavigation = chapterNavigation.replaceAll('completedModule', 'completedChapter')
chapterNavigation = chapterNavigation.replaceAll('nextMod', 'nextChapter')
chapterNavigation = chapterNavigation.replace(/\bmod\b/g, 'chapter')
chapterNavigation = chapterNavigation.replace(/\bmodule\b/g, 'chapter')

chapterNavigation = replaceRegex(
  chapterNavigation,
  /if \(sel\.kind === 'chapter'\) \{[\s\S]*?return \{ kind: 'chapter', chapter, screenIndex: sel\.screenIndex \}\n  \}/,
  `if (sel.kind === 'chapter' || sel.kind === 'module') {\n    const chapterId = sel.chapterId || sel.moduleId\n    const chapter = CHAPTERS.find(candidate => candidate.id === chapterId)\n    if (!chapter) return null\n    return { kind: 'chapter', chapter, screenIndex: sel.screenIndex }\n  }`,
  'resolveTaskDestination chapter route',
)
chapterNavigation = replaceExact(
  chapterNavigation,
  '    nextModule:        nextChapter,\n',
  '    nextChapter,\n    nextModule:        nextChapter, // temporary compatibility field\n',
  'chapter completion compatibility payload',
)

assertIncludes(chapterNavigation, 'export function computeInitialChapterState(chapter, saved)', 'chapter navigation initial state')
assertIncludes(chapterNavigation, 'export function getChapterGate(chapter,', 'chapter navigation gate')
assertIncludes(chapterNavigation, 'export function prepareChapterScreenState(screenIndex, existingState)', 'chapter navigation prepared state')
assertIncludes(chapterNavigation, "return { type: 'completeChapter' }", 'chapter finish action')
assertIncludes(chapterNavigation, "sel.kind === 'chapter' || sel.kind === 'module'", 'legacy task route compatibility')
write('src/app/chapterNavigation.js', chapterNavigation)

write('src/app/moduleNavigation.js', `// Legacy compatibility facade.\n// New production code must import from chapterNavigation.js.\n\nexport {\n  isFullScreenVideoScreen,\n  getStageNavigation,\n  getCurrentStageFromNavigation,\n  clampScreenIndex,\n  computeInitialChapterState,\n  computeInitialChapterState as computeInitialModuleState,\n  resolveFinishAction,\n  getChapterGate,\n  getChapterGate as getModuleGate,\n  buildChapterCompletePayload,\n  prepareChapterScreenState,\n  prepareChapterScreenState as prepareModuleScreenState,\n  resolveTaskDestination,\n} from './chapterNavigation.js'\n`)

// ── App shell ────────────────────────────────────────────────────────────────
let app = read('src/app/LegacyApp.jsx')
app = replaceExact(
  app,
  "import { MODULE_CONTENT_LOADERS } from '../content/moduleContentRegistry.js'\nimport { MODULES } from '../modules.js'",
  "import { CHAPTER_CONTENT_LOADERS } from '../content/chapterContentRegistry.js'\nimport { CHAPTERS } from '../chapters.js'",
  'LegacyApp canonical catalogue imports',
)
app = replaceExact(
  app,
  "import { buildChapterCompletePayload, prepareModuleScreenState, resolveTaskDestination } from './moduleNavigation.js'",
  "import { buildChapterCompletePayload, prepareChapterScreenState, resolveTaskDestination } from './chapterNavigation.js'",
  'LegacyApp canonical navigation import',
)
for (const [from, to] of [
  ['ModulePlayer', 'ChapterPlayer'],
  ['ModuleLoadingScreen', 'ChapterLoadingScreen'],
  ['MODULE_CONTENT_LOADERS', 'CHAPTER_CONTENT_LOADERS'],
  ['_contentCache', '_chapterContentCache'],
  ['loadModuleContent', 'loadChapterContent'],
  ['activeModule', 'activeChapter'],
  ['setActiveModule', 'setActiveChapter'],
  ['openModulePlayer', 'openChapterPlayer'],
  ['openModule', 'openChapter'],
  ['prepareModuleScreenState', 'prepareChapterScreenState'],
  ['completedModule', 'completedChapter'],
]) {
  app = app.replaceAll(from, to)
}
app = app.replace(/\bMODULES\b/g, 'CHAPTERS')
app = app.replace(/\bmod\b/g, 'chapter')
app = app.replace(/\bmodule\b/g, 'chapter')
app = app.replaceAll('d.nextModule', 'd.nextChapter')

app = replaceRegex(
  app,
  /const params = new URLSearchParams\(window\.location\.search\)[\s\S]*?openChapterPlayer\(chapter, Number\.isNaN\(screenIndex\) \? undefined : screenIndex\)/,
  `const params = new URLSearchParams(window.location.search)\n    const chapterId = params.get('chapter') || params.get('module')\n    const screenParam = params.get('screen')\n    if (!chapterId) return\n    const chapter = CHAPTERS.find(candidate => candidate.id === chapterId)\n    if (!chapter) return\n    const screenIndex = screenParam !== null ? Number(screenParam) : undefined\n    openChapterPlayer(chapter, Number.isNaN(screenIndex) ? undefined : screenIndex)`,
  'LegacyApp dev chapter route',
)

assertIncludes(app, "const ChapterPlayer = lazy(() => import('../components/layout/ChapterPlayer.jsx'))", 'LegacyApp canonical player import')
assertIncludes(app, 'const [activeChapter,        setActiveChapter]', 'LegacyApp active chapter state')
assertIncludes(app, 'function openChapterPlayer(chapter, screenIndex)', 'LegacyApp open chapter action')
assertIncludes(app, 'async function loadChapterContent(chapter)', 'LegacyApp chapter loader')
assertIncludes(app, "if (view === 'chapter' && activeChapter)", 'LegacyApp chapter view')
assertIncludes(app, '<ChapterPlayer chapter={activeChapter}', 'LegacyApp chapter player render')
assertExcludes(app, 'openModulePlayer', 'LegacyApp legacy open action')
assertExcludes(app, 'loadModuleContent', 'LegacyApp legacy loader')
assertExcludes(app, 'activeModule', 'LegacyApp legacy active state')
write('src/app/LegacyApp.jsx', app)

// ── Dependent prop boundaries ────────────────────────────────────────────────
let header = read('src/components/core/LearningHeader.jsx')
header = replaceExact(
  header,
  `export default function LearningHeader({\n  module,`,
  `export default function LearningHeader({\n  chapter,\n  module,`,
  'LearningHeader props',
)
header = replaceExact(
  header,
  `}) {\n  const subject = module?.subject || 'History'`,
  `}) {\n  const activeChapter = chapter || module\n  const subject = activeChapter?.subject || 'History'`,
  'LearningHeader active chapter',
)
header = header.replace('single-row module header', 'single-row chapter header')
header = header.replace("Stage rail shows the module's 6 navigation stages", "Stage rail shows the chapter's 6 navigation stages")
header = header.replace('Props: module,', 'Props: chapter (module remains a compatibility fallback),')
write('src/components/core/LearningHeader.jsx', header)

let examiner = read('src/components/learning/faceTheExaminer/FaceTheExaminerContainer.jsx')
examiner = replaceExact(
  examiner,
  'export default function FaceTheExaminerContainer({ module, examiner, onExit, onContinue }) {',
  'export default function FaceTheExaminerContainer({ chapter, module, examiner, onExit, onContinue }) {\n  const activeChapter = chapter || module || {}',
  'FaceTheExaminer props',
)
examiner = examiner.replaceAll('module.subject', 'activeChapter.subject')
examiner = examiner.replaceAll('module.faceTheExaminerTitle', 'activeChapter.faceTheExaminerTitle')
examiner = examiner.replaceAll('module.board', 'activeChapter.board')
examiner = examiner.replaceAll('module.examBoard', 'activeChapter.examBoard')
examiner = examiner.replace('module={module}', 'module={activeChapter}')
assertExcludes(examiner, 'SUBJECTS[module.subject]', 'FaceTheExaminer legacy runtime prop')
write('src/components/learning/faceTheExaminer/FaceTheExaminerContainer.jsx', examiner)

let guided = read('src/components/learning/GuidedExamResponse.jsx')
guided = replaceExact(
  guided,
  "// `embedded` — set by ModulePlayer when this screen runs inside a module,\n// where the floating LearningHeader capsule already owns back/exit and the\n// top strip. Standalone hosts keep this component's self-contained header.\nexport default function GuidedExamResponse({ module = {}, exam = {}, onExit, onContinue, theme, embedded = false }) {\n  const sections = Array.isArray(exam.sections) ? exam.sections : []\n  const rawSubject = exam.subject || module?.subject || ''",
  "// `embedded` — set by ChapterPlayer when this screen runs inside a chapter,\n// where the floating LearningHeader capsule already owns back/exit and the\n// top strip. Standalone hosts keep this component's self-contained header.\nexport default function GuidedExamResponse({ chapter, module = {}, exam = {}, onExit, onContinue, theme, embedded = false }) {\n  const activeChapter = chapter || module\n  const sections = Array.isArray(exam.sections) ? exam.sections : []\n  const rawSubject = exam.subject || activeChapter?.subject || ''",
  'GuidedExamResponse chapter prop',
)
write('src/components/learning/GuidedExamResponse.jsx', guided)

// ── Canonical tests ──────────────────────────────────────────────────────────
let navigationTest = read('tests/unit/app/moduleNavigation.test.js')
navigationTest = navigationTest.replaceAll('moduleNavigation.js', 'chapterNavigation.js')
navigationTest = navigationTest.replaceAll('computeInitialModuleState', 'computeInitialChapterState')
navigationTest = navigationTest.replaceAll('getModuleGate', 'getChapterGate')
navigationTest = navigationTest.replaceAll('prepareModuleScreenState', 'prepareChapterScreenState')
navigationTest = navigationTest.replaceAll('makeModule', 'makeChapter')
navigationTest = navigationTest.replaceAll('ModulePlayer', 'ChapterPlayer')
navigationTest = navigationTest.replaceAll('moduleId', 'chapterId')
navigationTest = navigationTest.replace(/\bmodule\b/g, 'chapter')
write('tests/unit/app/chapterNavigation.test.js', navigationTest)

let lifecycleTest = read('tests/unit/modulePlayer/lifecycle.test.js')
lifecycleTest = lifecycleTest.replaceAll('moduleNavigation.js', 'chapterNavigation.js')
lifecycleTest = lifecycleTest.replaceAll('computeInitialModuleState', 'computeInitialChapterState')
lifecycleTest = lifecycleTest.replaceAll('getModuleGate', 'getChapterGate')
lifecycleTest = lifecycleTest.replaceAll('prepareModuleScreenState', 'prepareChapterScreenState')
lifecycleTest = lifecycleTest.replaceAll('makeModule', 'makeChapter')
lifecycleTest = lifecycleTest.replaceAll('ModulePlayer', 'ChapterPlayer')
lifecycleTest = lifecycleTest.replaceAll('modulePlayer', 'chapterPlayer')
lifecycleTest = lifecycleTest.replace(/\bmodule\b/g, 'chapter')
write('tests/unit/chapterPlayer/lifecycle.test.js', lifecycleTest)

write('tests/unit/modulePlayer/compatibility.test.js', `import { describe, expect, it } from 'vitest'\nimport { readFileSync } from 'node:fs'\nimport { resolve } from 'node:path'\n\nconst root = resolve(process.cwd())\nconst read = path => readFileSync(resolve(root, path), 'utf8')\n\ndescribe('legacy runtime compatibility', () => {\n  it('ModulePlayer is a thin prop-mapping facade over ChapterPlayer', () => {\n    const source = read('src/components/layout/ModulePlayer.jsx')\n    expect(source).toContain("import ChapterPlayer from './ChapterPlayer.jsx'")\n    expect(source).toContain('chapter={chapter || module}')\n    expect(source).not.toContain('useState')\n    expect(source.split('\\n').length).toBeLessThan(20)\n  })\n\n  it('moduleNavigation re-exports the canonical helpers under legacy names', () => {\n    const source = read('src/app/moduleNavigation.js')\n    expect(source).toContain('computeInitialChapterState as computeInitialModuleState')\n    expect(source).toContain('getChapterGate as getModuleGate')\n    expect(source).toContain('prepareChapterScreenState as prepareModuleScreenState')\n    expect(source).not.toContain('function computeInitialModuleState')\n  })\n})\n`)

let journeys = read('tests/unit/journeys/learnerJourneys.test.js')
journeys = journeys.replaceAll("../../../src/app/moduleNavigation.js", "../../../src/app/chapterNavigation.js")
journeys = journeys.replaceAll('prepareModuleScreenState', 'prepareChapterScreenState')
journeys = journeys.replaceAll("const { MODULES } = await import('../../../src/modules.js')", "const { CHAPTERS } = await import('../../../src/chapters.js')")
journeys = journeys.replaceAll('MODULES.find', 'CHAPTERS.find')
journeys = journeys.replace(/\bmod\b/g, 'chapter')
write('tests/unit/journeys/learnerJourneys.test.js', journeys)

// ── Architecture guardrails ──────────────────────────────────────────────────
for (const path of [
  'tests/architecture/background-token-governance.test.js',
  'tests/architecture/foreground-token-governance.test.js',
  'tests/architecture/typography-governance.test.js',
]) {
  const source = read(path).replaceAll('src/components/layout/ModulePlayer.jsx', 'src/components/layout/ChapterPlayer.jsx')
  write(path, source)
}

let placeholder = read('tests/architecture/placeholder-module-safety.test.js')
placeholder = placeholder.replaceAll('openModulePlayer', 'openChapterPlayer')
placeholder = placeholder.replaceAll("setView('module')", "setView('chapter')")
placeholder = placeholder.replace(/\bmodule\b/g, 'chapter')
placeholder = placeholder.replaceAll('modules with', 'chapters with')
placeholder = placeholder.replaceAll('src/modules.js', 'src/chapters.js')
write('tests/architecture/placeholder-module-safety.test.js', placeholder)

let legacyImports = read('tests/architecture/legacy-content-imports.test.js')
legacyImports = legacyImports.replace("        'src/app/LegacyApp.jsx',\n", '')
legacyImports = legacyImports.replace("      ['src/app/LegacyApp.jsx'],\n", '      [],\n')
write('tests/architecture/legacy-content-imports.test.js', legacyImports)

write('tests/architecture/chapter-runtime-contract.test.js', `import { describe, expect, it } from 'vitest'\nimport { readFileSync, readdirSync } from 'node:fs'\nimport { join, relative, resolve } from 'node:path'\n\nconst root = resolve(process.cwd())\nconst srcRoot = resolve(root, 'src')\nconst read = path => readFileSync(resolve(root, path), 'utf8')\n\nfunction walk(dir) {\n  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {\n    const path = join(dir, entry.name)\n    if (entry.isDirectory()) return walk(path)\n    return /\\.(js|jsx|mjs)$/.test(entry.name) ? [path] : []\n  })\n}\n\nconst sources = walk(srcRoot).map(path => ({\n  path: relative(root, path).replaceAll('\\\\', '/'),\n  content: readFileSync(path, 'utf8'),\n}))\n\ndescribe('canonical chapter runtime', () => {\n  it('ChapterPlayer owns the runtime and ModulePlayer remains a thin facade', () => {\n    const canonical = read('src/components/layout/ChapterPlayer.jsx')\n    const legacy = read('src/components/layout/ModulePlayer.jsx')\n    expect(canonical).toContain('export default function ChapterPlayer({ chapter, onBack, onChapterComplete })')\n    expect(canonical).toContain('computeInitialChapterState(chapter, saved)')\n    expect(canonical).toContain('getChapterGate(chapter,')\n    expect(legacy).toContain("import ChapterPlayer from './ChapterPlayer.jsx'")\n    expect(legacy).not.toContain('useState')\n  })\n\n  it('production source does not import the legacy player or navigation implementation', () => {\n    const playerViolators = sources\n      .filter(source => source.path !== 'src/components/layout/ModulePlayer.jsx')\n      .filter(source => /from\\s+['\"][^'\"]*ModulePlayer\\.jsx['\"]|import\\(['\"][^'\"]*ModulePlayer\\.jsx['\"]\\)/.test(source.content))\n      .map(source => source.path)\n    const navigationViolators = sources\n      .filter(source => source.path !== 'src/app/moduleNavigation.js')\n      .filter(source => /from\\s+['\"][^'\"]*moduleNavigation\\.js['\"]/.test(source.content))\n      .map(source => source.path)\n    expect(playerViolators).toEqual([])\n    expect(navigationViolators).toEqual([])\n  })\n\n  it('LegacyApp uses chapter state, actions, loader and overlay names', () => {\n    const source = read('src/app/LegacyApp.jsx')\n    expect(source).toContain('activeChapter')\n    expect(source).toContain('openChapterPlayer')\n    expect(source).toContain('loadChapterContent')\n    expect(source).toContain("view === 'chapter'")\n    expect(source).not.toContain('activeModule')\n    expect(source).not.toContain('openModulePlayer')\n    expect(source).not.toContain('loadModuleContent')\n  })\n})\n`)

// ── Documentation ────────────────────────────────────────────────────────────
let hierarchy = read('docs/system/CONTENT_HIERARCHY.md')
hierarchy = hierarchy.replace(
  '| `ModulePlayer` | Runtime for one learner-facing chapter | `ChapterPlayer` |',
  '| `ModulePlayer` | Compatibility export for the former chapter runtime | `ChapterPlayer` |',
)
hierarchy = hierarchy.replace(
  '| `loadModuleContent` | Loads one chapter\'s full content | `loadChapterContent` |',
  '| `loadModuleContent` | Removed app-shell action name | `loadChapterContent` |',
)
hierarchy = hierarchy.replace(
  '`ChapterPlayer` owns chapter navigation and state. `ScreenRenderer` maps registered screen types to governed components. Components remain focused on their own learning interaction.',
  '`ChapterPlayer` now owns chapter navigation and state. `ModulePlayer` and `moduleNavigation.js` remain temporary compatibility facades only. `ScreenRenderer` is the Phase 5 target for mapping registered screen types to governed components. Components remain focused on their own learning interaction.',
)
write('docs/system/CONTENT_HIERARCHY.md', hierarchy)

console.log('Phase 4 migration edits applied')
