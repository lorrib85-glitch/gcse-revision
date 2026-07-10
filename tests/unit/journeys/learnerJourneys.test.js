import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Core learner-journey integration tests. Rather than drive the full app in a
// browser (splash timer + Firebase + onboarding make that brittle), these
// exercise the REAL logic modules end-to-end through a REAL localStorage stub,
// which is where learner trust actually lives: does progress persist, does a
// wrong answer route to the right teaching screen, does completion update the
// surfaces that read it. The four journeys map to the task's Journey 1–4.

// A faithful in-memory localStorage (survives within a test; a fresh module
// read after seeding stands in for "reload").
function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

let store
beforeEach(() => { store = installLocalStorage() })
afterEach(() => { vi.restoreAllMocks() })

// ─── Journey 1 — Progress survives refresh ───────────────────────────────────

describe('Journey 1 — progress survives a refresh', () => {
  it('module resume state written before a refresh is read back at the right screen', async () => {
    const { prepareModuleScreenState } = await import('../../../src/app/moduleNavigation.js')
    const { getModuleState, saveModuleState, getModulePct } = await import('../../../src/progress.js')
    const { MODULES } = await import('../../../src/modules.js')

    const mod = MODULES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')
    // Learner reaches screen 10 of a real module.
    saveModuleState(mod.id, prepareModuleScreenState(10, getModuleState(mod.id)))

    // "Refresh": nothing clears the store, so a fresh read still resumes at 10.
    const resumed = getModuleState(mod.id)
    expect(resumed.screen).toBe(10)
    expect(resumed.hookDone).toBe(true)
    expect(getModulePct(mod)).toBe(Math.round((10 / mod.screenCount) * 100))
  })

  it('a failed write does not report success, so the app can tell progress was lost', async () => {
    const { saveModuleState } = await import('../../../src/progress.js')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    globalThis.localStorage.setItem = () => { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e }
    expect(saveModuleState('history-medicine-black-death', { screen: 3 })).toBe(false)
  })
})

// ─── Journey 2 — Weakness repair ─────────────────────────────────────────────

describe('Journey 2 — a wrong answer routes to the intended teaching screen', () => {
  it('logs a weakness, resolves it to a real module + exact screen, and updates evidence on retry', async () => {
    const { logWrongAnswer, logCorrectAnswer, getWeakTopics, getBiggestWin } =
      await import('../../../src/unifiedWeaknessTracker.js')
    const { TAG_MODULE_MAP, findTaggedScreen } = await import('../../../src/data/tagModuleMap.js')
    const { MODULES } = await import('../../../src/modules.js')

    // Two wrong answers on a recoverable concept crosses the weak threshold.
    for (let i = 0; i < 2; i++) {
      logWrongAnswer({ subject: 'History', topic: 'germ-theory', questionId: `q${i}`, marks: 1, source: 'quiz' })
    }

    const weak = getWeakTopics()
    expect(weak.some(t => t.topic === 'germ-theory')).toBe(true)

    // Recovery route: the biggest win points at a real, available module.
    const win = getBiggestWin()
    expect(win.topic).toBe('germ-theory')
    const targetId = TAG_MODULE_MAP['germ-theory']
    expect(win.moduleId).toBe(targetId)

    const mod = MODULES.find(m => m.id === targetId)
    expect(mod).toBeTruthy()
    const screenIndex = findTaggedScreen(mod, 'germ-theory')
    expect(screenIndex).toBeTypeOf('number')
    expect(screenIndex).toBeLessThan(mod.screenCount)

    // Successful retry is recorded and lifts the error rate.
    const before = getWeakTopics().find(t => t.topic === 'germ-theory').errorRate
    for (let i = 0; i < 4; i++) {
      logCorrectAnswer({ subject: 'History', topic: 'germ-theory', questionId: `qc${i}`, source: 'quiz' })
    }
    const afterEntry = getWeakTopics().find(t => t.topic === 'germ-theory')
    // Either it dropped out of the weak list (mastered) or its error rate fell.
    if (afterEntry) expect(afterEntry.errorRate).toBeLessThan(before)
    else expect(afterEntry).toBeUndefined()
  })

  it('records mastery evidence for a concept through the real evidence engine', async () => {
    const { createEmptyMasteryState } = await import('../../../src/data/masteryEngine/masteryModel.js')
    const { recordCorrect, recordIncorrect } = await import('../../../src/data/masteryEngine/evidence.js')
    const { getObjectiveEvidence } = await import('../../../src/data/masteryEngine/insights.js')

    let state = createEmptyMasteryState()
    state = recordIncorrect(state, 'history:medicine:germ-theory', { stage: 'recall', source: 'quiz' })
    state = recordCorrect(state, 'history:medicine:germ-theory', { stage: 'recall', source: 'quiz' })
    const concept = state.concepts['history:medicine:germ-theory']
    expect(concept.attempts).toBe(2)
    expect(concept.correct).toBe(1)
    // Stage-scoped read reflects both events at the 'recall' stage.
    expect(getObjectiveEvidence(state, 'history:medicine:germ-theory', 'recall').count).toBe(2)
  })
})

// ─── Journey 3 — Chapter completion ──────────────────────────────────────────

describe('Journey 3 — completing a chapter updates the surfaces that read it', () => {
  it('records the score/activity and hands off to the next chapter', async () => {
    const { recordScore, getScores, getProgress, getModuleState, saveModuleState } =
      await import('../../../src/progress.js')
    const { buildChapterCompletePayload } = await import('../../../src/app/moduleNavigation.js')
    const { MODULES } = await import('../../../src/modules.js')

    const mod = MODULES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')

    // Finish the module: mark complete + record a scored result.
    saveModuleState(mod.id, { ...getModuleState(mod.id), screen: mod.screenCount, completed: true })
    recordScore({ subject: 'History', earned: 8, possible: 10, source: 'module' })

    // Progress surfaces reflect it.
    expect(getModuleState(mod.id).completed).toBe(true)
    const scores = getScores()
    expect(scores[0]).toMatchObject({ subject: 'History', source: 'module' })
    expect(getProgress().streak).toBeGreaterThanOrEqual(1)

    // Completion routes forward to the next real chapter.
    const payload = buildChapterCompletePayload(mod)
    expect(payload.completedChapter).toBe(mod.title)
    expect(payload.nextModule).toBeTruthy()
    expect(payload.nextModule.id).toBe('history-medicine-black-death')
  })

  it('a completed warm-up round is reflected in the Today\'s-plan done check', async () => {
    const { recordScore } = await import('../../../src/progress.js')
    const { isTaskDoneToday } = await import('../../../src/todaysPlan.js')

    recordScore({ subject: 'Quick Fire', earned: 9, possible: 10, source: 'test' })
    expect(isTaskDoneToday({ type: 'warmup' })).toBe(true)
    expect(isTaskDoneToday({ type: 'warmup', onSelect: {} })).toBe(true)
  })
})

// ─── Journey 4 — Cloud restore seam ──────────────────────────────────────────
// Deterministic, no live OAuth: exercises the reconciliation decision layer
// directly (the browser sync flow would be brittle).

describe('Journey 4 — cloud restore seam', () => {
  it('richer cloud state restores onto an empty client', async () => {
    const { decideSyncAction } = await import('../../../src/data/progressSync/progressSync.js')
    const cloud = { updatedAt: 200, data: { gcse_scores: [{ pct: 70 }], 'gcse_module_x': { screen: 5 } } }
    const local = { updatedAt: 100, data: {} }
    expect(decideSyncAction({ cloud, local, lastSyncedAt: 0 })).toBe('apply')
  })

  it('richer local state is never overwritten by an empty cloud snapshot', async () => {
    const { decideSyncAction } = await import('../../../src/data/progressSync/progressSync.js')
    const cloud = { updatedAt: 500, data: {} }
    const local = { updatedAt: 100, data: { gcse_scores: [{ pct: 88 }] } }
    expect(decideSyncAction({ cloud, local, lastSyncedAt: 0 })).toBe('upload')
  })

  it('guest progress survives account linking — local is backed up, not wiped', async () => {
    // Reset the module graph so progressSync re-binds to the mocked Firebase
    // seam below rather than a copy cached by the earlier decideSyncAction tests.
    vi.resetModules()
    vi.doMock('../../../src/auth/firebaseClient.js', () => ({ firebaseEnabled: true, app: {} }))
    let cloudDoc = null
    const setDocs = []
    vi.doMock('firebase/firestore', () => ({
      getFirestore: () => ({}),
      doc: (db, ...segments) => ({ segments }),
      getDoc: async () => ({ exists: () => cloudDoc !== null, data: () => cloudDoc }),
      setDoc: async (ref, value) => { setDocs.push(value); cloudDoc = value },
    }))

    // Guest built up local progress before signing in.
    store['gcse_scores'] = JSON.stringify([{ date: '2026-07-01', subject: 'History', pct: 72 }])
    store['gcse_module_history-medicine-black-death'] = JSON.stringify({ screen: 6 })

    const { backupProgressForUser } = await import('../../../src/data/progressSync/progressSync.js')

    // They link a Google account — the just-linked user backs up.
    const result = await backupProgressForUser({ loggedIn: true, provider: 'google', uid: 'uid-9', name: 'Sam' })
    expect(result.action).toBe('upload')
    // The guest's local progress was uploaded intact, not discarded.
    expect(setDocs.at(-1).data['gcse_scores']).toEqual([{ date: '2026-07-01', subject: 'History', pct: 72 }])
    expect(setDocs.at(-1).data['gcse_module_history-medicine-black-death']).toEqual({ screen: 6 })
    // Local store is untouched by the backup.
    expect(JSON.parse(store['gcse_scores'])).toHaveLength(1)
    vi.doUnmock('firebase/firestore')
    vi.doUnmock('../../../src/auth/firebaseClient.js')
    vi.resetModules()
  })
})
