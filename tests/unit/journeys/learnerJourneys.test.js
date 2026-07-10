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

beforeEach(() => { installLocalStorage() })
afterEach(async () => {
  vi.restoreAllMocks()
  // storage.js's active scope is module-singleton state — reset it between
  // tests so a journey that switched to a uid namespace doesn't leak into
  // the next one.
  const { setActiveScope, GUEST_SCOPE } = await import('../../../src/lib/storage.js')
  setActiveScope(GUEST_SCOPE)
})

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

    const { setActiveScope, scopeForUser, GUEST_SCOPE } = await import('../../../src/lib/storage.js')
    const { claimGuestProgressForUser } = await import('../../../src/data/progressSync/accountScope.js')
    const { backupProgressForUser } = await import('../../../src/data/progressSync/progressSync.js')
    const { saveModuleState, recordScore } = await import('../../../src/progress.js')

    // Guest built up local progress before signing in (default active scope
    // is the guest namespace — no one has signed in yet).
    setActiveScope(GUEST_SCOPE)
    recordScore({ subject: 'History', earned: 7, possible: 10, source: 'test' })
    saveModuleState('history-medicine-black-death', { screen: 6 })

    const user = { loggedIn: true, provider: 'google', uid: 'uid-9', name: 'Sam' }
    // Linking deliberately offers the guest snapshot to this account — the
    // local-only merge accountScope.js performs, before AuthContext switches
    // the active scope over and runs the normal cloud reconcile.
    const { claimed } = claimGuestProgressForUser(user)
    expect(claimed).toBe(true)
    setActiveScope(scopeForUser(user))

    // They link a Google account — the just-linked user backs up.
    const result = await backupProgressForUser(user)
    expect(result.action).toBe('upload')
    // The guest's claimed progress was uploaded intact, not discarded.
    expect(setDocs.at(-1).data.gcse_scores[0]).toMatchObject({ subject: 'History' })
    expect(setDocs.at(-1).data['gcse_module_history-medicine-black-death']).toEqual({ screen: 6 })
    vi.doUnmock('firebase/firestore')
    vi.doUnmock('../../../src/auth/firebaseClient.js')
    vi.resetModules()
  })
})

// ─── Journeys 5–10 — sync safety task ────────────────────────────────────────
// Each journey resets modules and mocks the Firestore seam fresh, mirroring
// Journey 4's pattern, so progressSync.js re-binds to this test's mock rather
// than a copy cached by an earlier test.

async function withMockedCloud(run) {
  vi.resetModules()
  vi.doMock('../../../src/auth/firebaseClient.js', () => ({ firebaseEnabled: true, app: {} }))
  let cloudDoc = null
  const setDocs = []
  let failNextSetDoc = false
  vi.doMock('firebase/firestore', () => ({
    getFirestore: () => ({}),
    doc: (db, ...segments) => ({ segments }),
    getDoc: async () => ({ exists: () => cloudDoc !== null, data: () => cloudDoc }),
    setDoc: async (ref, value) => {
      if (failNextSetDoc) { failNextSetDoc = false; throw new Error('network unavailable') }
      setDocs.push(value)
      cloudDoc = value
    },
  }))
  const progressSync = await import('../../../src/data/progressSync/progressSync.js')
  try {
    await run({
      ...progressSync,
      getCloudDoc: () => cloudDoc,
      setCloudDoc: (v) => { cloudDoc = v },
      setDocs,
      failNextSetDoc: () => { failNextSetDoc = true },
    })
  } finally {
    vi.doUnmock('firebase/firestore')
    vi.doUnmock('../../../src/auth/firebaseClient.js')
    vi.resetModules()
  }
}

describe('Journey 5 — guest links a Google account that already has cloud progress', () => {
  it('merges instead of letting either side silently replace the other, and survives a reload', async () => {
    await withMockedCloud(async ({ syncProgressForUser, getCloudDoc, setCloudDoc }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState } = await import('../../../src/progress.js')
      const { recordScore } = await import('../../../src/progress.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-guest-link', name: 'Sam' }
      // This account's own namespace is already active by the time it has
      // local progress to sync (AuthContext switches scope on sign-in).
      setActiveScope(scopeForUser(user))

      // Learner did real work as a guest before ever signing in.
      saveModuleState('history-medicine-black-death', { screen: 6, hookDone: true })
      recordScore({ subject: 'History', earned: 8, possible: 10, source: 'module' })

      // This Google account already has cloud progress from a previous
      // session (e.g. signed in on a browser that later got cleared).
      const cloudSnapshot = {
        version: 1,
        updatedAt: Date.now() - 50000,
        data: {
          gcse_scores: [{ date: '2026-06-20', subject: 'Maths', earned: 4, possible: 10, pct: 40, source: 'quiz' }],
          'gcse_module_history-medicine-renaissance-medicine': { screen: 3 },
        },
      }
      setCloudDoc(cloudSnapshot)

      const result = await syncProgressForUser(user)
      expect(result.action).toBe('merge')

      // "Reload": re-read from the real storage boundary, not from memory.
      const { getModuleState, getScores } = await import('../../../src/progress.js')
      expect(getModuleState('history-medicine-black-death').screen).toBe(6)
      expect(getModuleState('history-medicine-renaissance-medicine').screen).toBe(3)
      const subjects = getScores().map(s => s.subject).sort()
      expect(subjects).toEqual(['History', 'Maths'])

      // Neither side was silently dropped from the cloud copy either.
      expect(getCloudDoc().data.gcse_scores).toHaveLength(2)
      expect(getCloudDoc().data['gcse_module_history-medicine-black-death']).toEqual({ screen: 6, hookDone: true })
    })
  })
})

describe('Journey 6 — an existing account signs in on another, older device', () => {
  it('does not undo completed learning from the newer cloud state', async () => {
    await withMockedCloud(async ({ syncProgressForUser, setCloudDoc }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState, getModuleState } = await import('../../../src/progress.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-device-b', name: 'Sam' }
      setActiveScope(scopeForUser(user))

      // This device's local copy is stale — the module isn't finished here yet.
      saveModuleState('history-medicine-germ-theory', { screen: 3, completed: false })

      // The cloud already reflects the module being finished on another device.
      setCloudDoc({
        version: 1,
        updatedAt: Date.now(),
        data: { 'gcse_module_history-medicine-germ-theory': { screen: 20, completed: true, timestamp: Date.now() } },
      })

      const result = await syncProgressForUser(user)
      expect(result.action).toBe('apply')

      const resumed = getModuleState('history-medicine-germ-theory')
      expect(resumed.completed).toBe(true)
      expect(resumed.screen).toBe(20)
    })
  })
})

describe('Journey 7 — local and cloud each hold unique progress', () => {
  it('both valid sets survive, and repeating the sync does not duplicate anything', async () => {
    await withMockedCloud(async ({ syncProgressForUser, getCloudDoc, setCloudDoc, setDocs }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState } = await import('../../../src/progress.js')
      const { logWrongAnswer } = await import('../../../src/unifiedWeaknessTracker.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-both-unique', name: 'Sam' }
      setActiveScope(scopeForUser(user))

      saveModuleState('bio_building_life', { screen: 5 })
      logWrongAnswer({ subject: 'Biology', topic: 'osmosis', questionId: 'local-q1', marks: 1, source: 'module' })

      setCloudDoc({
        version: 1,
        updatedAt: Date.now() - 10000,
        data: {
          'gcse_module_math1': { screen: 2 },
          gcse_wrong_answers: [{ timestamp: 1, date: '2026-06-01', subject: 'Maths', topic: 'fractions', conceptTag: null, questionId: 'cloud-q1', questionText: '', marks: 1, source: 'quiz', questionType: 'mcq' }],
        },
      })

      const first = await syncProgressForUser(user)
      expect(first.action).toBe('merge')

      const { getModuleState } = await import('../../../src/progress.js')
      const { getWeakTopics } = await import('../../../src/unifiedWeaknessTracker.js')
      expect(getModuleState('bio_building_life').screen).toBe(5)
      expect(getModuleState('math1').screen).toBe(2)
      // Both wrong-answer entries are present (evidence from both subjects).
      const topicsSeen = new Set(getWeakTopics(1).map(t => t.topic))
      expect(topicsSeen.has('osmosis')).toBe(true)
      expect(topicsSeen.has('fractions')).toBe(true)

      const setDocCountAfterFirst = setDocs.length
      const cloudDataAfterFirst = getCloudDoc().data.gcse_wrong_answers.length

      const second = await syncProgressForUser(user)
      expect(second.action).toBe('none')
      expect(setDocs.length).toBe(setDocCountAfterFirst)
      expect(getCloudDoc().data.gcse_wrong_answers).toHaveLength(cloudDataAfterFirst)
    })
  })
})

describe('Journey 8 — offline learning', () => {
  it('local saves succeed while the cloud write fails, the learner keeps working, and a later retry backs up without duplicating', async () => {
    await withMockedCloud(async ({ backupProgressForUser, failNextSetDoc, getCloudDoc }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState, getModuleState } = await import('../../../src/progress.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-offline', name: 'Sam' }
      setActiveScope(scopeForUser(user))

      // Learner works while offline — local persistence never depends on the network.
      const savedOk = saveModuleState('sci_bio_w1', { screen: 4 })
      expect(savedOk).toBe(true)
      expect(getModuleState('sci_bio_w1').screen).toBe(4)

      // The backup attempt fails (simulated network failure) — the caller
      // (AuthContext) must see this rejection, not a false success.
      failNextSetDoc()
      await expect(backupProgressForUser(user)).rejects.toThrow()
      expect(getCloudDoc()).toBeNull()

      // Learner keeps working locally regardless.
      saveModuleState('sci_bio_w1', { screen: 7 })

      // Connectivity returns — retry succeeds and reaches the cloud exactly once.
      const retry = await backupProgressForUser(user)
      expect(retry.action).toBe('upload')
      expect(getCloudDoc().data['gcse_module_sci_bio_w1']).toEqual({ screen: 7 })

      // A second retry with nothing new to contribute performs no further write.
      const repeat = await backupProgressForUser(user)
      expect(repeat.action).toBe('none')
    })
  })
})

describe('Journey 9 — sign-out with pending progress', () => {
  it('a failed final flush does not discard local work and does not falsely report success', async () => {
    await withMockedCloud(async ({ backupProgressForUser, syncProgressForUser, failNextSetDoc, getCloudDoc }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState, getModuleState } = await import('../../../src/progress.js')
      const { recordScore, getScores } = await import('../../../src/progress.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-signout', name: 'Sam' }
      setActiveScope(scopeForUser(user))

      saveModuleState('history-medicine-cancer', { screen: 9, completed: true })
      recordScore({ subject: 'History', earned: 9, possible: 10, source: 'module' })

      // This mirrors AuthContext.signOut(): flush before clearing the
      // session. The flush fails (cloud unreachable at the moment of sign-out).
      failNextSetDoc()
      await expect(backupProgressForUser(user)).rejects.toThrow()

      // Sign-out itself never clears progress keys (only the session key) —
      // work already done this session is exactly as it was, not discarded.
      expect(getModuleState('history-medicine-cancer')).toEqual({ screen: 9, completed: true })
      expect(getScores()[0]).toMatchObject({ subject: 'History', earned: 9 })

      // Next sign-in (or an app-load reconcile) retries and succeeds, with
      // no duplication of the work done before sign-out.
      const retry = await syncProgressForUser(user)
      expect(retry.action).toBe('upload')
      expect(getCloudDoc().data.gcse_scores).toHaveLength(1)
    })
  })
})

describe('Journey 10 — auth restoration on reload', () => {
  it('existing local progress is never reset to empty while the cloud merge resolves', async () => {
    await withMockedCloud(async ({ syncProgressForUser, setCloudDoc }) => {
      const { setActiveScope, scopeForUser } = await import('../../../src/lib/storage.js')
      const { saveModuleState, getModuleState } = await import('../../../src/progress.js')

      const user = { loggedIn: true, provider: 'google', uid: 'uid-restore', name: 'Sam' }
      // Auth restoration on reload derives the scope synchronously from
      // riseUser before anything else runs — this mirrors that.
      setActiveScope(scopeForUser(user))

      // A returning, already-authenticated learner reloads: their local
      // progress is already sitting in storage before any sync runs.
      saveModuleState('history-medicine-jenner-vaccination', { screen: 15, completed: true })
      const beforeSync = getModuleState('history-medicine-jenner-vaccination')
      expect(beforeSync.completed).toBe(true)

      // Cloud restores the session with additional, different progress from
      // another device.
      setCloudDoc({
        version: 1,
        updatedAt: Date.now(),
        data: { 'gcse_module_history-medicine-great-stink': { screen: 8, completed: true } },
      })

      const result = await syncProgressForUser(user)

      // The already-completed local module was never transiently reset —
      // it reads the same before and after the merge resolves.
      expect(getModuleState('history-medicine-jenner-vaccination')).toEqual(beforeSync)
      // The merged state (not a wholesale cloud overwrite) is what's live.
      expect(getModuleState('history-medicine-great-stink').completed).toBe(true)
      expect(result.action).toBe('merge')
    })
  })
})
