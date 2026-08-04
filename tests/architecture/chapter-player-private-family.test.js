import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

// A4 Phase 8 — the ChapterPlayer live-rendering split.
//
// Two guards in one file:
//
//   1. `src/components/layout/chapterPlayer/` is a private family. Its files are
//      implementation details of ChapterPlayer's own runtime JSX — not authorable
//      chapter components, not screens, not reachable from content. They may be
//      imported by ChapterPlayer and nothing else, and must hold no lifecycle
//      state, persistence or chapter-shape knowledge of their own.
//
//   2. The overlay machinery deleted in the audit that opened this phase cannot
//      grow back into ChapterPlayer unnoticed. Both the module-level examiner
//      ladder and the weak-spot/recovery integration were unreachable from every
//      shipped chapter; restoring either is a product decision, not a refactor.

const root = resolve(process.cwd())
const read = rel => readFileSync(resolve(root, rel), 'utf8')

// Guards below are about live code, not the prose explaining why code is gone
// (which necessarily names the removed symbols).
const codeOf = rel => read(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

const PLAYER = 'src/components/layout/ChapterPlayer.jsx'
const FAMILY_DIR = 'src/components/layout/chapterPlayer'
const GATE_LAYER = `${FAMILY_DIR}/ChapterGateLayer.jsx`
const BOTTOM_NAV = `${FAMILY_DIR}/ChapterBottomNavigation.jsx`

function walk(dir) {
  return readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.(js|jsx)$/.test(entry.name) ? [path.replaceAll('\\', '/')] : []
  })
}

const familyFiles = walk(FAMILY_DIR)

// ─── 1. ChapterPlayer composes both extracted renderers ──────────────────────

describe('ChapterPlayer delegates its gate and bottom-nav rendering', () => {
  const player = codeOf(PLAYER)

  it('imports and renders ChapterGateLayer', () => {
    expect(player).toContain("import ChapterGateLayer from './chapterPlayer/ChapterGateLayer.jsx'")
    expect(player).toMatch(/<ChapterGateLayer\b/)
  })

  it('imports and renders ChapterBottomNavigation', () => {
    expect(player).toContain("import ChapterBottomNavigation from './chapterPlayer/ChapterBottomNavigation.jsx'")
    expect(player).toMatch(/<ChapterBottomNavigation\b/)
  })

  it('does not reabsorb the gate screens it delegated', () => {
    for (const reabsorbed of ['ChapterHookScreen', 'ChapterOutcomeScreen', 'QuickRecallScreen']) {
      expect(player, `${reabsorbed} belongs to ChapterGateLayer now`).not.toContain(reabsorbed)
    }
  })

  it('does not reabsorb the bottom-nav shell it delegated', () => {
    expect(player, 'the governed Continue CTA belongs to ChapterBottomNavigation now').not.toContain('ContinueCTA')
    expect(player, 'the fixed bottom shell belongs to ChapterBottomNavigation now').not.toContain('backdropFilter')
  })

  it('still owns the gate decision, lifecycle state and persistence', () => {
    expect(player).toContain('getChapterGate(chapter,')
    expect(player).toContain('computeInitialChapterState(chapter, saved)')
    expect(player).toContain('saveChapterState(chapter.id')
    expect(player).toContain('screenHasComponentOwnedContinuation')
  })

  it('keeps ScreenRenderer as the authored-screen router', () => {
    expect(player).toMatch(/<ScreenRenderer\b/)
    const renderer = codeOf('src/components/layout/ScreenRenderer.jsx')
    expect(renderer).toMatch(/cur\?\.type === 'faceExaminer'/)
    expect(renderer).toMatch(/cur\?\.type === 'examinerExplains'/)
  })
})

// ─── 2. The private family stays private ─────────────────────────────────────

describe('the chapterPlayer family is a ChapterPlayer-only internal', () => {
  it('contains exactly the two extracted renderers', () => {
    expect(familyFiles.sort()).toEqual([BOTTOM_NAV, GATE_LAYER].sort())
  })

  it('is imported only by ChapterPlayer', () => {
    const importers = walk('src')
      .filter(path => !familyFiles.includes(path))
      .filter(path => /['"][^'"]*chapterPlayer\/(?:ChapterGateLayer|ChapterBottomNavigation)\.jsx['"]/.test(read(path)))
    expect(importers).toEqual([PLAYER])
  })

  it('is not authorable — absent from the screen registry, component functions and the Component Lab', () => {
    for (const surface of [
      'src/data/screenRegistry.js',
      'src/data/componentFunctions.js',
      'src/dev/componentReview/labAdapters.jsx',
      'src/dev/componentReview/labScreenRendererAdapters.jsx',
      'src/data/generated/componentLabRegistry.js',
    ]) {
      const source = read(surface)
      expect(source, `${surface} must not offer ChapterGateLayer to authors`).not.toContain('ChapterGateLayer')
      expect(source, `${surface} must not offer ChapterBottomNavigation to authors`).not.toContain('ChapterBottomNavigation')
    }
  })

  it('holds no lifecycle state, persistence or storage of its own', () => {
    for (const path of familyFiles) {
      const source = codeOf(path)
      expect(source, `${path} must not manage state`).not.toMatch(/\buseState\s*\(|\buseEffect\s*\(|\buseReducer\s*\(/)
      expect(source, `${path} must not touch persistence`).not.toMatch(/saveChapterState|getChapterState|localStorage|lib\/storage/)
      expect(source, `${path} must not create context`).not.toMatch(/createContext|useContext/)
    }
  })

  it('never re-derives the gate decision or inspects screens', () => {
    const gate = codeOf(GATE_LAYER)
    expect(gate).not.toContain('getChapterGate')
    const nav = codeOf(BOTTOM_NAV)
    expect(nav, 'the bottom shell must not inspect the chapter').not.toContain('chapter')
    expect(nav).not.toContain('screenHasComponentOwnedContinuation')
  })

  it('the gate layer renders the three existing opener components', () => {
    const gate = codeOf(GATE_LAYER)
    for (const component of ['ChapterHookScreen', 'ChapterOutcomeScreen', 'QuickRecallScreen', 'LearningHeader']) {
      expect(gate).toContain(component)
    }
  })

  it('the gate layer keeps hook → outcomes → recall order', () => {
    const gate = codeOf(GATE_LAYER)
    const order = ['hook', 'outcomes', 'recall'].map(type => gate.indexOf(`gateType === '${type}'`))
    expect(order.every(index => index >= 0), 'all three gate branches must exist').toBe(true)
    expect(order).toEqual([...order].sort((a, b) => a - b))
  })

  it('the bottom shell uses the governed ContinueCTA rather than an inline button', () => {
    const nav = codeOf(BOTTOM_NAV)
    expect(nav).toContain("import ContinueCTA from '../../core/ContinueCTA.jsx'")
    expect(nav).toMatch(/<ContinueCTA\b/)
    expect(nav, 'no bespoke <button> may replace the governed CTA').not.toMatch(/<button\b/)
    expect(nav, 'the hidden state must still reserve the CTA height').toContain('BUTTONS.continue.height')
  })
})

// ─── 3. Deleted overlay machinery cannot grow back ───────────────────────────

describe('deleted ChapterPlayer overlay machinery stays deleted', () => {
  const player = codeOf(PLAYER)

  it('handleFinish completes the chapter directly — no ladder, no branch', () => {
    expect(player).toMatch(/function handleFinish\(\) \{\s*completeChapter\(\)\s*scrollToTop\(\)\s*\}/)
  })

  it('no module-level examiner / examinerExplains overlay state returns', () => {
    for (const dead of ['showExaminer', 'showExaminerExplains', 'chapter.examiner', 'resolveFinishAction', 'findScreenIndexByType']) {
      expect(player, `${dead} was removed as unreachable — restoring it is a product decision`).not.toContain(dead)
    }
  })

  it('no weak-spot / recovery-quiz integration returns', () => {
    for (const dead of ['showWeakSpotRecovery', 'detectedWeakSpot', 'recoveryQuizId', 'detectWeakSpot', 'WeakSpotRecovery', 'RecoveryQuizPlayer']) {
      expect(player, `${dead} was removed as unreachable — restoring it is a product decision`).not.toContain(dead)
    }
  })

  it('chapterNavigation.js exports no finish-ladder helper', () => {
    expect(codeOf('src/app/chapterNavigation.js')).not.toContain('export function resolveFinishAction')
  })

  it('the standalone components the dormant integration used are retained, not retired', () => {
    for (const retained of [
      'src/components/learning/WeakSpotRecovery.jsx',
      'src/components/learning/RecoveryQuizPlayer.jsx',
      'src/components/learning/FaceTheExaminer.jsx',
      'src/components/learning/ExaminerExplainsScreen.jsx',
    ]) {
      expect(() => read(retained), `${retained} must not be deleted by an overlay removal`).not.toThrow()
    }
  })
})

// ─── 4. The deletion's factual basis, re-checked against shipped content ─────

describe('no shipped chapter uses module-level examiner metadata', () => {
  // The basis for removing both overlays. Chapter content is the `chapter` prop
  // ChapterPlayer receives (LegacyApp hands it the content module's default
  // export, falling back to the chapters.js row), so both are checked.
  //
  // Only files whose source mentions "examiner" are imported: a top-level
  // examiner key and an authored examinerExplains screen both require that
  // substring, and importing all ~80 content modules measurably slows the suite.
  const examinerContentFiles = walk('src/content').filter(path => read(path).includes('examiner'))

  async function loadChapters(paths) {
    const chapters = []
    for (const path of paths) {
      const chapter = (await import(resolve(root, path))).default
      if (chapter && typeof chapter === 'object' && Array.isArray(chapter.screens)) chapters.push({ path, chapter })
    }
    return chapters
  }

  it('no content module defines a top-level chapter.examiner or chapter.examinerExplains', async () => {
    const offenders = (await loadChapters(examinerContentFiles))
      .map(({ path, chapter }) => ({ path, hits: ['examiner', 'examinerExplains'].filter(key => key in chapter) }))
      .filter(({ hits }) => hits.length)
      .map(({ path, hits }) => `${path}: ${hits.join(', ')}`)
    expect(offenders, 'a chapter now authors module-level examiner metadata — stop and decide whether to restore the overlay or migrate it to a screen').toEqual([])
  })

  it('no chapters.js row defines a top-level examiner or examinerExplains', async () => {
    const { CHAPTERS } = await import('../../src/chapters.js')
    const offenders = CHAPTERS
      .filter(chapter => 'examiner' in chapter || 'examinerExplains' in chapter)
      .map(chapter => chapter.id)
    expect(offenders).toEqual([])
  })

  it('the authored screen types that replaced them are still registered', async () => {
    const { SCREEN_REGISTRY } = await import('../../src/data/screenRegistry.js')
    expect(SCREEN_REGISTRY.faceExaminer).toBeDefined()
    expect(SCREEN_REGISTRY.examinerExplains).toBeDefined()
  })

  it('shipped content still authors examinerExplains screens, so the screen route is live', async () => {
    const authored = (await loadChapters(examinerContentFiles))
      .flatMap(({ chapter }) => chapter.screens.filter(screen => screen?.type === 'examinerExplains'))
    expect(authored.length).toBeGreaterThan(0)
  })
})
