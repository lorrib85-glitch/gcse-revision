import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const read = path => {
  if (!existsSync(path)) throw new Error(`Missing file: ${path}`)
  return readFileSync(path, 'utf8')
}

const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

const assertOnce = (source, needle, label) => {
  const count = source.split(needle).length - 1
  if (count !== 1) throw new Error(`${label}: expected one anchor, found ${count}`)
}

const replaceOnce = (source, before, after, label) => {
  assertOnce(source, before, label)
  return source.replace(before, after)
}

const playerPath = 'src/components/layout/ChapterPlayer.jsx'
let player = read(playerPath)

const helperStart = player.indexOf('function ReadBlock')
const helperEnd = player.indexOf('// ─── HookScreen', helperStart)
if (helperStart < 0 || helperEnd < 0 || helperEnd <= helperStart) {
  throw new Error('ChapterPlayer helper extraction anchors changed')
}
let helperSegment = player.slice(helperStart, helperEnd)
player = player.slice(0, helperStart) + player.slice(helperEnd)

helperSegment = replaceOnce(
  helperSegment,
  'function Screen({ screen, subject, onScreenComplete })',
  'export function ScreenContentRenderer({ screen, subject, onScreenComplete })',
  'Screen content renderer rename',
)

const blockMapStart = helperSegment.indexOf('  const blocksMap = (screen.blocks || []).map')
const blockMapEnd = helperSegment.indexOf('\n\n  // Infographic screens', blockMapStart)
if (blockMapStart < 0 || blockMapEnd < 0) throw new Error('Inline block routing anchors changed')

const blockMapReplacement = `  const blocksMap = (screen.blocks || []).map((block, index) => (\n    <div key={index}>\n      {renderBlock({\n        block,\n        index,\n        subject,\n        onScreenComplete,\n        handleQuizComplete,\n      })}\n    </div>\n  ))`
helperSegment = helperSegment.slice(0, blockMapStart) + blockMapReplacement + helperSegment.slice(blockMapEnd)

const contentRendererAnchor = 'export function ScreenContentRenderer({ screen, subject, onScreenComplete })'
const contentRendererIndex = helperSegment.indexOf(contentRendererAnchor)
if (contentRendererIndex < 0) throw new Error('ScreenContentRenderer insertion anchor changed')

const governedBlockRouting = `function UnsupportedBlock({ type, definition }) {\n  if (!import.meta.env.DEV) return null\n  return (\n    <div role="alert" style={{\n      margin: '14px 0', padding: 16, borderRadius: 12,\n      border: '1px solid rgba(255,141,161,.45)',\n      background: 'rgba(255,141,161,.08)', color: '#FFD6DE',\n      ...TYPE.bodySmall, lineHeight: 1.55,\n    }}>\n      <strong>Unsupported block: {type || '<missing>'}</strong>\n      <div style={{ marginTop: 6 }}>\n        {definition\n          ? \\`The registry points to \\${definition.component}, but ScreenRenderer has no implementation.\\`\n          : 'Register this block in src/data/screenRegistry.js before using it in chapter content.'}\n      </div>\n    </div>\n  )\n}\n\nfunction LegacyUnroutedBlock({ type, definition }) {\n  if (!import.meta.env.DEV) return null\n  return (\n    <div role="status" style={{\n      margin: '14px 0', padding: 16, borderRadius: 12,\n      border: '1px solid rgba(214,155,69,.38)',\n      background: 'rgba(214,155,69,.08)', color: '#F0D6AD',\n      ...TYPE.bodySmall, lineHeight: 1.55,\n    }}>\n      <strong>Legacy block: {type}</strong>\n      <div style={{ marginTop: 6 }}>\n        This extracted content was never routed by ChapterPlayer. New content must use\n        {' '}<code>{definition.replacement}</code>.\n      </div>\n    </div>\n  )\n}\n\nconst BLOCK_RENDERERS = Object.freeze({\n  read: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={24}><ReadBlock block={block} /></CardContainer>,\n  keypoint: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={24}><KeypointBlock block={block} /></CardContainer>,\n  funfact: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={20}><FunFactBlock block={block} /></CardContainer>,\n  examtip: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={24}><ExamTipBlock block={block} /></CardContainer>,\n  timeline: ({ block }) => <TimelineBlock block={block} />,\n  reveal: ({ block }) => <RevealBlock block={block} />,\n  quiz: ({ block, subject, index, handleQuizComplete }) => <AnswerInteraction block={{ ...block, explanation: undefined }} subject={subject} onComplete={() => handleQuizComplete(index)} />,\n  flashcards: ({ block }) => <FlashcardsBlock block={block} />,\n  hotspot: ({ block }) => <HotspotBlock block={block} />,\n  misconception: ({ block }) => <MisconceptionBlock block={block} />,\n  acronymMemorise: ({ block }) => <AcronymMemorise block={block} />,\n  memoryHook: ({ block, subject }) => <MemoryHook block={block} subject={subject} />,\n  builder: ({ block, subject, onScreenComplete }) => <BuilderBlock block={block} subject={subject} onComplete={onScreenComplete} />,\n  scenario: ({ block }) => <ScenarioBlock block={block} />,\n  boss: ({ block, subject, onScreenComplete }) => <ExamQuestionFrame block={block} subject={subject} mode="practice" onSkip={onScreenComplete} />,\n  explainReveal: ({ block, subject, onScreenComplete }) => <ExplainReveal block={block} subject={subject} onComplete={onScreenComplete} />,\n  mediaPlaceholder: ({ block, subject, index }) => <div style={{ marginTop: index > 0 ? 28 : 0 }}><MediaPlaceholder subject={subject} kind={block.kind} aspect={block.aspect} caption={block.caption} /></div>,\n  fillblanks: ({ block, subject }) => <FillInTheBlanksBlock block={block} subject={subject} />,\n  theoryCompare: ({ block, subject }) => <TheoryCompare block={block} subject={subject} />,\n  oppositeQualitiesReveal: ({ block, subject }) => <OppositeQualitiesReveal block={block} subject={subject} />,\n  graphView: ({ block, subject }) => <GraphView block={block} subject={subject} />,\n  timelineChain: ({ block, subject }) => <TimelineChainBlock block={block} subject={subject} />,\n  colsort: ({ block, subject }) => <ColSortBlock block={block} subject={subject} />,\n  spotTheError: ({ block, subject, onScreenComplete }) => <SpotTheError block={block} subject={subject} onContinue={onScreenComplete} />,\n  misconceptionCheck: ({ block, subject, onScreenComplete }) => <MisconceptionCheck block={block} subject={subject} onContinue={onScreenComplete} />,\n})\n\nexport const BLOCK_RENDERER_TYPES = Object.freeze(Object.keys(BLOCK_RENDERERS))\n\nfunction renderBlock({ block, ...context }) {\n  const type = block?.type\n  const definition = getBlockDefinition(type)\n  if (!definition) return <UnsupportedBlock type={type} definition={null} />\n  if (definition.status === 'legacy') return <LegacyUnroutedBlock type={type} definition={definition} />\n  const render = BLOCK_RENDERERS[type]\n  if (!render) return <UnsupportedBlock type={type} definition={definition} />\n  return render({ block, ...context })\n}\n\n`
helperSegment = helperSegment.slice(0, contentRendererIndex) + governedBlockRouting + helperSegment.slice(contentRendererIndex)

const routeStart = player.indexOf('  // ── Choice-reveal interstitial')
const routeEndMarker = '\n  return (\n    <>\n      <LearningHeader {...H} visible={headerVisible} />'
const routeEnd = player.indexOf(routeEndMarker, routeStart)
if (routeStart < 0 || routeEnd < 0 || routeEnd <= routeStart) {
  throw new Error('Full-screen routing extraction anchors changed')
}
const fullScreenRoutes = player.slice(routeStart, routeEnd)

const rendererImports = `import { useState } from 'react'\nimport { SUBJECTS } from '../../constants/subjects.js'\nimport { GENERAL } from '../../constants/generalTheme.js'\nimport { SPACING } from '../../constants/spacing.js'\nimport { getBlockDefinition, getScreenType, resolveScreenDefinition } from '../../data/screenRegistry.js'\nimport ExamQuestionFrame from '../feedback/ExamQuestionFrame.jsx'\nimport ExplainReveal from '../learning/ExplainReveal.jsx'\nimport MediaPlaceholder from '../core/MediaPlaceholder.jsx'\nimport TeachScreenShell from '../core/TeachScreenShell.jsx'\nimport Infographic from '../learning/Infographic.jsx'\nimport QuickRecallScreen from '../learning/QuickRecallScreen.jsx'\nimport TieredQuizScreen from '../learning/TieredQuizScreen.jsx'\nimport CinematicRevealMoment from '../learning/CinematicRevealMoment.jsx'\nimport ConceptReveal from '../learning/ConceptReveal.jsx'\nimport LearningHeader from '../core/LearningHeader.jsx'\nimport ContinueCTA from '../core/ContinueCTA.jsx'\nimport FaceTheExaminer from '../learning/FaceTheExaminer.jsx'\nimport GuidedExamResponse from '../learning/GuidedExamResponse.jsx'\nimport InteractiveHotspotImage from '../learning/InteractiveHotspotImage.jsx'\nimport FillInTheBlanksBlock from '../learning/FillInTheBlanksBlock.jsx'\nimport AcronymMemorise from '../learning/AcronymMemorise.jsx'\nimport FlashcardsBlock from '../learning/FlashcardsBlock.jsx'\nimport MemoryHook from '../learning/MemoryHook.jsx'\nimport BuilderBlock from '../learning/BuilderBlock.jsx'\nimport AnswerInteraction from '../core/AnswerInteraction.jsx'\nimport CardContainer from '../core/CardContainer.jsx'\nimport GuidedChoiceCarousel from '../learning/GuidedChoiceCarousel.jsx'\nimport TimelineChain, { TimelineChainBlock } from '../learning/TimelineChain.jsx'\nimport { visualNarrativeToRevealChain } from '../../data/visualNarrativeCompat.js'\nimport TimelineCanvas from '../learning/TimelineCanvas.jsx'\nimport CinematicCarousel from '../learning/CinematicCarousel.jsx'\nimport TheoryCompare from '../learning/TheoryCompare.jsx'\nimport GraphView from '../learning/GraphView.jsx'\nimport ColSortBlock from '../learning/ColSortBlock.jsx'\nimport SpotTheError from '../learning/SpotTheError.jsx'\nimport MisconceptionCheck from '../learning/MisconceptionCheck.jsx'\nimport ExaminerExplainsScreen from '../learning/ExaminerExplainsScreen.jsx'\nimport SwipeSort from '../learning/SwipeSort.jsx'\nimport OppositeQualitiesReveal from '../learning/OppositeQualitiesReveal.jsx'\nimport VisualLearning from '../learning/VisualLearning.jsx'\nimport KeyFigureReveal from '../learning/KeyFigureReveal.jsx'\nimport CentreImageReveal from '../learning/CentreImageReveal.jsx'\nimport MatchingTask from '../learning/MatchingTask.jsx'\nimport OrderedRouteTask from '../learning/OrderedRouteTask.jsx'\nimport PriorKnowledgeRecall from '../learning/PriorKnowledgeRecall.jsx'\nimport BeforeAfterImageSlider from '../learning/BeforeAfterImageSlider.jsx'\nimport FactorWeb from '../learning/FactorWeb.jsx'\nimport QuoteAnalyser from '../learning/QuoteAnalyser.jsx'\nimport { ScreenTitle, ScreenBody } from '../core/ScreenText.jsx'\nimport { TYPE } from '../../constants/typography.js'\n\n`

const fullScreenTypes = [
  'choiceReveal',
  'quickRecall',
  'tieredquiz',
  'faceExaminer',
  'guidedExamResponse',
  'naturalSupernaturalSwipe',
  'orderedRouteTask',
  'matchingTask',
  'visualLearning',
  'keyFigureReveal',
  'guidedChoiceCarousel',
  'interactiveImage',
  'centreImageReveal',
  'visualNarrative',
  'timelineChain',
  'timelineCanvas',
  'cinematicCarousel',
  'oppositeQualitiesReveal',
  'examinerExplains',
  'priorKnowledgeRecall',
  'conceptReveal',
  'beforeAfterSlider',
  'cinematic',
  'factorWeb',
  'quoteAnalyser',
]

const rendererShell = `\nexport const FULL_SCREEN_RENDERER_TYPES = Object.freeze(${JSON.stringify(fullScreenTypes, null, 2)})\n\nexport function ChapterSchemaError({ chapter, errors, onBack }) {\n  return (\n    <div role="alert" style={{\n      minHeight: '100dvh', background: GENERAL.backgroundApp, color: '#F5F7FB',\n      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,\n    }}>\n      <div style={{ width: '100%', maxWidth: 560 }}>\n        <div style={{ ...TYPE.eyebrow, color: '#FF8DA1', marginBottom: 12 }}>Chapter schema error</div>\n        <h1 style={{ ...TYPE.displaySection, margin: '0 0 12px' }}>This chapter cannot start safely.</h1>\n        <p style={{ ...TYPE.body, color: 'rgba(245,247,251,.72)', lineHeight: 1.6 }}>\n          {chapter?.title || chapter?.id || 'Unknown chapter'} contains screen data that is not registered or is missing required fields.\n        </p>\n        <pre style={{\n          whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, borderRadius: 12,\n          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',\n          color: '#FFD6DE', ...TYPE.bodySmall, lineHeight: 1.5,\n        }}>{errors.map(error => \\`\\${error.code}: \\${error.message}\\`).join('\\n')}</pre>\n        {onBack && <button type="button" onClick={onBack} style={{ marginTop: 16, padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Go back</button>}\n      </div>\n    </div>\n  )\n}\n\nfunction UnsupportedScreen({ screen, chapter, definition }) {\n  const type = getScreenType(screen)\n  if (!import.meta.env.DEV) return null\n  return (\n    <ChapterSchemaError\n      chapter={chapter}\n      errors={[{\n        code: definition ? 'MISSING_SCREEN_RENDERER' : 'UNREGISTERED_SCREEN_TYPE',\n        message: definition\n          ? \\`Screen type "\\${type}" is registered to \\${definition.component}, but ScreenRenderer has no route.\\`\n          : \\`Screen type "\\${type}" is not registered in src/data/screenRegistry.js.\\`,\n      }]}\n    />\n  )\n}\n\nexport default function ScreenRenderer({\n  screen: cur,\n  chapter,\n  subject = chapter?.subject,\n  onScreenComplete,\n  isLast,\n  handleFinish,\n  go,\n  screenIndex: screen,\n  setScreen,\n  setAnimKey,\n  scrollToTop,\n  headerProps: H,\n  jumpSheetPortal,\n  subjectColor,\n  headerOnBack,\n  ihmExploreScreen,\n  setIhmExploreScreen,\n  selectedHealer,\n  setSelectedHealer,\n  cinematicHeaderVisible,\n  setCinematicHeaderVisible,\n}) {\n  const definition = resolveScreenDefinition(cur)\n  if (!definition) return <UnsupportedScreen screen={cur} chapter={chapter} definition={null} />\n  if (definition.layout !== 'full') {\n    return <ScreenContentRenderer screen={cur} subject={subject} onScreenComplete={onScreenComplete} />\n  }\n\n  const authoredType = getScreenType(cur)\n  if (definition.status !== 'derived' && !FULL_SCREEN_RENDERER_TYPES.includes(authoredType)) {\n    return <UnsupportedScreen screen={cur} chapter={chapter} definition={definition} />\n  }\n${fullScreenRoutes}\n\n  return <UnsupportedScreen screen={cur} chapter={chapter} definition={definition} />\n}\n`

write('src/components/layout/ScreenRenderer.jsx', rendererImports + helperSegment + rendererShell)

player = player.slice(0, routeStart) + `  const routeDefinition = resolveScreenDefinition(cur)\n  if (!routeDefinition || routeDefinition.layout === 'full') {\n    return (\n      <ScreenRenderer\n        screen={cur}\n        chapter={chapter}\n        isLast={isLast}\n        handleFinish={handleFinish}\n        go={go}\n        screenIndex={screen}\n        setScreen={setScreen}\n        setAnimKey={setAnimKey}\n        scrollToTop={scrollToTop}\n        headerProps={H}\n        jumpSheetPortal={jumpSheetPortal}\n        subjectColor={subjectColor}\n        headerOnBack={headerOnBack}\n        ihmExploreScreen={ihmExploreScreen}\n        setIhmExploreScreen={setIhmExploreScreen}\n        selectedHealer={selectedHealer}\n        setSelectedHealer={setSelectedHealer}\n        cinematicHeaderVisible={cinematicHeaderVisible}\n        setCinematicHeaderVisible={setCinematicHeaderVisible}\n        onScreenComplete={isLast ? handleFinish : () => go(1)}\n      />\n    )\n  }\n` + player.slice(routeEnd)

const oldImportEnd = player.indexOf('// ── Stage navigation helpers')
if (oldImportEnd < 0) throw new Error('ChapterPlayer import header anchor changed')
const playerImports = `import { useState, useEffect } from 'react'\nimport { createPortal } from 'react-dom'\nimport { hexToRgb, SUBJECTS } from '../../constants/subjects.js'\nimport { GENERAL } from '../../constants/generalTheme.js'\nimport { BUTTONS } from '../../constants/buttons.js'\nimport { recordActivity, getChapterState, saveChapterState } from '../../progress.js'\nimport { MODULES } from '../../data/modules.js'\nimport { isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation, computeInitialChapterState, clampScreenIndex, resolveFinishAction, getChapterGate } from '../../app/chapterNavigation.js'\nimport { findScreenIndexByType, resolveScreenDefinition, screenHasComponentOwnedContinuation, validateChapterDefinition } from '../../data/screenRegistry.js'\nimport ChapterHookScreen from './ChapterHookScreen.jsx'\nimport QuickRecallScreen from '../learning/QuickRecallScreen.jsx'\nimport LearningHeader from '../core/LearningHeader.jsx'\nimport ContinueCTA from '../core/ContinueCTA.jsx'\nimport FaceTheExaminer from '../learning/FaceTheExaminer.jsx'\nimport RetrievalFrame from '../feedback/RetrievalFrame.jsx'\nimport WeakSpotRecovery from '../learning/WeakSpotRecovery.jsx'\nimport RecoveryQuizPlayer from '../learning/RecoveryQuizPlayer.jsx'\nimport ChapterOutcomeScreen from './ChapterOutcomeScreen.jsx'\nimport ExaminerExplainsScreen from '../learning/ExaminerExplainsScreen.jsx'\nimport ContentShell from './ContentShell.jsx'\nimport ScreenRenderer, { ChapterSchemaError } from './ScreenRenderer.jsx'\nimport { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'\n\n`
player = playerImports + player.slice(oldImportEnd)

player = replaceOnce(
  player,
  'export default function ChapterPlayer({ chapter, onBack, onChapterComplete }) {',
  `export default function ChapterPlayer(props) {\n  const validation = validateChapterDefinition(props.chapter)\n  if (!validation.valid) {\n    return <ChapterSchemaError chapter={props.chapter} errors={validation.errors} onBack={props.onBack} />\n  }\n  return <ValidatedChapterPlayer {...props} />\n}\n\nfunction ValidatedChapterPlayer({ chapter, onBack, onChapterComplete }) {`,
  'ChapterPlayer schema boundary',
)

player = replaceOnce(
  player,
  "    if ((chapter.screens[screen]?.blocks || []).some(b => b.type === 'spotTheError' || b.type === 'misconceptionCheck' || b.type === 'builder')) return null // these gate their own continue button",
  '    if (screenHasComponentOwnedContinuation(chapter.screens[screen])) return null // governed component owns continuation',
  'Continuation ownership registry',
)

player = replaceOnce(
  player,
  "          const faceExamIdx = chapter.screens.findIndex(s => s.type === 'faceExaminer')",
  "          const faceExamIdx = findScreenIndexByType(chapter.screens, 'faceExaminer')",
  'Face examiner registry lookup',
)

player = replaceOnce(
  player,
  '<Screen screen={cur} subject={chapter.subject} onScreenComplete={isLast ? handleFinish : () => go(1)} />',
  '<ScreenRenderer screen={cur} chapter={chapter} subject={chapter.subject} onScreenComplete={isLast ? handleFinish : () => go(1)} />',
  'Generic screen renderer call',
)

player = player.replaceAll('computeInitialChapterState (moduleNavigation.js)', 'computeInitialChapterState (chapterNavigation.js)')
player = player.replaceAll('getChapterGate (moduleNavigation.js)', 'getChapterGate (chapterNavigation.js)')
write(playerPath, player)

const navigationPath = 'src/app/chapterNavigation.js'
let navigation = read(navigationPath)
if (!navigation.includes("from '../data/screenRegistry.js'")) {
  navigation = navigation.replace(
    "import { SUBJECTS } from '../constants/subjects.js'\n",
    "import { SUBJECTS } from '../constants/subjects.js'\nimport { isCinematicHeaderScreen } from '../data/screenRegistry.js'\n",
  )
}
navigation = navigation.replace(
  /export function isFullScreenVideoScreen\(screen\) \{[\s\S]*?\n\}/,
  `export function isFullScreenVideoScreen(screen) {\n  return isCinematicHeaderScreen(screen)\n}`,
)
write(navigationPath, navigation)

const runtimeContractPath = 'tests/architecture/chapter-runtime-contract.test.js'
let runtimeContract = read(runtimeContractPath)
runtimeContract = runtimeContract.replace(
  "expect(canonical).toContain('export default function ChapterPlayer({ chapter, onBack, onChapterComplete })')",
  "expect(canonical).toContain('export default function ChapterPlayer(props)')\n    expect(canonical).toContain('function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete })')",
)
write(runtimeContractPath, runtimeContract)

for (const path of [
  'tests/architecture/background-token-governance.test.js',
  'tests/architecture/foreground-token-governance.test.js',
  'tests/architecture/typography-governance.test.js',
]) {
  let source = read(path)
  const anchor = "    'src/components/layout/ChapterPlayer.jsx',"
  if (source.includes(anchor) && !source.includes("ScreenRenderer.jsx")) {
    source = source.replace(anchor, `${anchor}\n    'src/components/layout/ScreenRenderer.jsx',`)
  }
  write(path, source)
}

write('tests/architecture/screen-registry.test.js', `import { describe, expect, it } from 'vitest'\nimport { readFileSync } from 'node:fs'\nimport { resolve } from 'node:path'\nimport { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'\nimport {\n  BLOCK_REGISTRY,\n  SCREEN_REGISTRY,\n  validateChapterDefinition,\n} from '../../src/data/screenRegistry.js'\nimport {\n  BLOCK_RENDERER_TYPES,\n  FULL_SCREEN_RENDERER_TYPES,\n} from '../../src/components/layout/ScreenRenderer.jsx'\n\nconst root = resolve(process.cwd())\nconst read = path => readFileSync(resolve(root, path), 'utf8')\n\nasync function loadAllChapters() {\n  return Promise.all(Object.entries(CHAPTER_CONTENT_LOADERS).map(async ([id, load]) => [id, await load()]))\n}\n\ndescribe('governed screen registry', () => {\n  it('every registry entry links authoring, component and contract metadata', () => {\n    for (const [type, definition] of [...Object.entries(SCREEN_REGISTRY), ...Object.entries(BLOCK_REGISTRY)]) {\n      expect(definition.authoringName, type).toBeTruthy()\n      expect(definition.component, type).toBeTruthy()\n      expect(definition.contract, type).toContain('COMPONENT_REGISTRY.md')\n    }\n  })\n\n  it('every active block contract has a ScreenRenderer implementation', () => {\n    const activeTypes = Object.entries(BLOCK_REGISTRY)\n      .filter(([, definition]) => definition.status === 'active')\n      .map(([type]) => type)\n      .sort()\n    expect([...BLOCK_RENDERER_TYPES].sort()).toEqual(activeTypes)\n  })\n\n  it('every authored full-screen route has a ScreenRenderer implementation', () => {\n    const fullTypes = Object.entries(SCREEN_REGISTRY)\n      .filter(([, definition]) => definition.layout === 'full' && definition.status !== 'derived')\n      .map(([type]) => type)\n      .sort()\n    expect([...FULL_SCREEN_RENDERER_TYPES].sort()).toEqual(fullTypes)\n  })\n\n  it('all registered chapter content passes schema validation', async () => {\n    const chapters = await loadAllChapters()\n    const failures = []\n    const legacyCounts = {}\n    for (const [id, chapter] of chapters) {\n      const result = validateChapterDefinition(chapter)\n      for (const error of result.errors) failures.push(\\`${id}: ${error.message}\\`)\n      for (const warning of result.warnings) {\n        if (warning.code !== 'LEGACY_BLOCK_TYPE' && warning.code !== 'LEGACY_SCREEN_TYPE') continue\n        const match = warning.message.match(/legacy (?:block|screen) type "([^"]+)"/)\n        const type = match?.[1] || '<unknown>'\n        legacyCounts[type] = (legacyCounts[type] || 0) + 1\n      }\n    }\n    expect(failures).toEqual([])\n    const allowedLegacyMaximums = { appliedscenario: 2, examscored: 1, tieredquiz: 9, timelinedrag: 1, visualNarrative: 0 }\n    for (const [type, count] of Object.entries(legacyCounts)) {\n      expect(Object.hasOwn(allowedLegacyMaximums, type), \\`Unexpected legacy type ${type}\\`).toBe(true)\n      expect(count, \\`Legacy type ${type} grew\\`).toBeLessThanOrEqual(allowedLegacyMaximums[type])\n    }\n  })\n\n  it('ChapterPlayer contains lifecycle only, not component routing', () => {\n    const player = read('src/components/layout/ChapterPlayer.jsx')\n    expect(player).toContain("import ScreenRenderer, { ChapterSchemaError } from './ScreenRenderer.jsx'")\n    expect(player).toContain('resolveScreenDefinition(cur)')\n    expect(player).not.toMatch(/cur\\?\\.type\\s*===/)\n    expect(player).not.toMatch(/block\\.type\\s*===/)\n    expect(player).not.toContain('function ScreenContentRenderer')\n    expect(player).not.toContain('function ReadBlock')\n  })\n})\n`)

write('tests/unit/data/screenRegistry.test.js', `import { describe, expect, it } from 'vitest'\nimport {\n  findScreenIndexByType,\n  resolveScreenDefinition,\n  screenHasComponentOwnedContinuation,\n  validateChapterDefinition,\n} from '../../../src/data/screenRegistry.js'\n\ndescribe('screenRegistry', () => {\n  it('rejects an unregistered screen type with a precise location', () => {\n    const result = validateChapterDefinition({ id: 'demo', screens: [{ type: 'madeUpScreen' }] })\n    expect(result.valid).toBe(false)\n    expect(result.errors[0]).toMatchObject({ code: 'UNREGISTERED_SCREEN_TYPE', location: 'chapter:demo:screen:0' })\n  })\n\n  it('rejects an unregistered nested block type', () => {\n    const result = validateChapterDefinition({ id: 'demo', screens: [{ blocks: [{ type: 'madeUpBlock' }] }] })\n    expect(result.errors.some(error => error.code === 'UNREGISTERED_BLOCK_TYPE')).toBe(true)\n  })\n\n  it('validates required component data before runtime', () => {\n    const result = validateChapterDefinition({ id: 'demo', screens: [{ type: 'quickRecall', questions: [] }] })\n    expect(result.errors.some(error => error.code === 'REQUIRED_FIELD')).toBe(true)\n  })\n\n  it('promotes a nested misconception check to its governed full-screen route', () => {\n    const definition = resolveScreenDefinition({ blocks: [{ type: 'misconceptionCheck' }] })\n    expect(definition.component).toBe('MisconceptionCheck')\n    expect(definition.layout).toBe('full')\n    expect(definition.status).toBe('derived')\n  })\n\n  it('derives continuation ownership from registry metadata', () => {\n    expect(screenHasComponentOwnedContinuation({ blocks: [{ type: 'builder' }] })).toBe(true)\n    expect(screenHasComponentOwnedContinuation({ blocks: [{ type: 'read', text: 'Hello' }] })).toBe(false)\n  })\n\n  it('keeps screen lookup independent from ChapterPlayer routing', () => {\n    expect(findScreenIndexByType([{ type: 'conceptReveal' }, { type: 'faceExaminer' }], 'faceExaminer')).toBe(1)\n  })\n\n  it('reports grandfathered types as warnings rather than pretending they are active', () => {\n    const result = validateChapterDefinition({\n      id: 'demo',\n      screens: [{ blocks: [{ type: 'timelinedrag', people: [{}], items: [{}] }] }],\n    })\n    expect(result.valid).toBe(true)\n    expect(result.warnings[0]).toMatchObject({ code: 'LEGACY_BLOCK_TYPE' })\n  })\n})\n`)

write('docs/system/SCREEN_REGISTRY.md', `# Governed screen registry\n\n**Runtime sources:**\n\n- \\`src/data/screenRegistry.js\\` — authoring names, component links, layout, required data and legacy status.\n- \\`src/components/layout/ScreenRenderer.jsx\\` — the single component-routing boundary.\n- \\`tests/architecture/screen-registry.test.js\\` — validates every loaded chapter and prevents routing from returning to \\`ChapterPlayer\\`.\n\n## Authoring contract\n\nA chapter author composes \\`screens\` from existing registered screen and block definitions. Authors do not import React components and do not edit \\`ChapterPlayer\\`.\n\nBefore a type may appear in chapter content it must have:\n\n1. a canonical authoring name;\n2. a component implementation;\n3. a link to the component registry contract;\n4. a declared layout (content or full-screen);\n5. required-data validation;\n6. continuation ownership where the component gates its own progress.\n\n## Runtime boundary\n\n\\`ChapterPlayer\\` owns chapter lifecycle, persistence, universal opener gates, navigation and completion. It asks the registry how the current screen behaves and delegates component selection to \\`ScreenRenderer\\`.\n\nUnsupported or malformed screens render a precise development error naming the chapter, screen and missing registry contract. Production content is protected by the architecture validation that loads every registered chapter in CI.\n\n## Legacy authored types\n\nThe extracted content currently contains four nested types that the old inline renderer never implemented: \\`appliedscenario\\`, \\`examscored\\`, \\`tieredquiz\\` and \\`timelinedrag\\`. They are explicitly registered as legacy so they cannot remain invisible debt.\n\nNew content must use their declared replacements. CI permits only the current shrink-only baseline; adding another legacy use fails the architecture contract. Phase 5 does not redesign or reinterpret those interactions.\n`)

const hierarchyPath = 'docs/system/CONTENT_HIERARCHY.md'
let hierarchy = read(hierarchyPath)
hierarchy = hierarchy.replace(
  '`ChapterPlayer` owns chapter navigation and state. `ScreenRenderer` maps registered screen types to governed components. Components remain focused on their own learning interaction.',
  '`ChapterPlayer` owns chapter navigation and state. `ScreenRenderer` is the only component-routing boundary, and `src/data/screenRegistry.js` defines every authorable screen/block type, component contract and required data. Components remain focused on their own learning interaction.',
)
write(hierarchyPath, hierarchy)

const indexPath = 'docs/system/00_SYSTEM_INDEX.md'
let index = read(indexPath)
const indexAnchor = `### 1d. Subject Module Architecture (History & Science)\n`
if (!index.includes('### 1c.1. Governed Screen Registry')) {
  index = index.replace(indexAnchor, `### 1c.1. Governed Screen Registry\n\n\\`docs/system/SCREEN_REGISTRY.md\\`\n\nThe canonical chapter authoring and runtime-routing contract. Defines the registered screen/block catalogue, required data validation, ScreenRenderer boundary, development failure behaviour and legacy-type shrink-only rules. Read before adding a screen type or changing ChapterPlayer component routing.\n\n---\n\n${indexAnchor}`)
}
write(indexPath, index)

console.log('Phase 5 migration files generated successfully.')
