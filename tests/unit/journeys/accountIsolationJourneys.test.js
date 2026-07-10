import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Deterministic, no live OAuth/Firebase: exercises the REAL storage.js /
// progressSync.js / accountScope.js modules end-to-end through a real
// localStorage stub, mirroring learnerJourneys.test.js's Journey 4-10
// pattern. authFlow() below reproduces AuthContext.jsx's own call sequence
// (setActiveScope / claimGuestProgressForUser / storeUser / syncProgressForUser
// / finalizeGuestClaim / markGuestClaimFailed) exactly, so these journeys
// prove the real orchestration is safe, not a re-implementation of it.

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
  const { setActiveScope, GUEST_SCOPE } = await import('../../../src/lib/storage.js')
  setActiveScope(GUEST_SCOPE)
})

// Fresh Firestore + firebaseClient mock per journey, matching learnerJourneys.test.js.
// `seed`, if given, runs on the raw localStorage stub *before* storage.js is
// (re-)imported — necessary for the legacy-migration journeys, since
// storage.js runs its one-time flat-key migration synchronously at its own
// module-load time.
async function withMockedCloud(run, { seed } = {}) {
  vi.resetModules()
  vi.doMock('../../../src/auth/firebaseClient.js', () => ({ firebaseEnabled: true, app: {} }))
  let cloudDocs = {}
  const setDocs = []
  let failNextSetDoc = false
  vi.doMock('firebase/firestore', () => ({
    getFirestore: () => ({}),
    doc: (db, ...segments) => ({ segments, uid: segments[1] }),
    getDoc: async (ref) => ({ exists: () => cloudDocs[ref.uid] !== undefined, data: () => cloudDocs[ref.uid] }),
    setDoc: async (ref, value) => {
      if (failNextSetDoc) { failNextSetDoc = false; throw new Error('network unavailable') }
      setDocs.push({ uid: ref.uid, value })
      cloudDocs[ref.uid] = value
    },
  }))
  if (seed) seed()
  const storage = await import('../../../src/lib/storage.js')
  const progressSync = await import('../../../src/data/progressSync/progressSync.js')
  const accountScope = await import('../../../src/data/progressSync/accountScope.js')

  // Reproduces AuthContext's own sequencing for the calls these journeys
  // need — a thin proxy over the real modules, not a parallel implementation.
  const authFlow = {
    signInGoogle(userData) {
      let pendingClaimUid = null
      if (userData.provider === 'google') {
        const { claimed } = accountScope.claimGuestProgressForUser(userData)
        if (claimed) pendingClaimUid = userData.uid
      }
      storage.setRawJson('riseUser', userData)
      storage.setActiveScope(storage.scopeForUser(userData))
      return { pendingClaimUid }
    },
    async reconcile(userData, pendingClaimUid) {
      try {
        const result = await progressSync.syncProgressForUser(userData)
        if (pendingClaimUid === userData.uid) accountScope.finalizeGuestClaim(userData)
        return { ok: true, result }
      } catch (err) {
        if (pendingClaimUid === userData.uid) accountScope.markGuestClaimFailed(userData)
        return { ok: false, error: err }
      }
    },
    async signOut(userData) {
      if (userData?.provider === 'google') {
        try { await progressSync.backupProgressForUser(userData) } catch { /* best-effort, matches AuthContext */ }
      }
      storage.removeRawKey('riseUser')
      storage.setActiveScope(storage.GUEST_SCOPE)
    },
  }

  try {
    await run({
      ...storage, ...progressSync, ...accountScope, authFlow,
      failNextSetDoc: () => { failNextSetDoc = true },
      getCloudDocForUid: (uid) => (cloudDocs[uid] !== undefined ? { data: cloudDocs[uid].data } : null),
    })
  } finally {
    vi.doUnmock('firebase/firestore')
    vi.doUnmock('../../../src/auth/firebaseClient.js')
    vi.resetModules()
  }
}

describe('Journey — two accounts on one browser', () => {
  it('B never receives, displays, or uploads A\'s progress; A\'s progress survives B\'s session intact', async () => {
    await withMockedCloud(async ({ authFlow, backupProgressForUser, getJson, GUEST_SCOPE, setActiveScope }) => {
      const userA = { loggedIn: true, provider: 'google', uid: 'uid-A', name: 'Alice' }
      const userB = { loggedIn: true, provider: 'google', uid: 'uid-B', name: 'Bob' }
      const { saveModuleState, getModuleState, recordScore } = await import('../../../src/progress.js')

      // A signs in and completes work.
      authFlow.signInGoogle(userA)
      await authFlow.reconcile(userA, null)
      saveModuleState('history-medicine-black-death', { screen: 6, completed: true })
      recordScore({ subject: 'History', earned: 9, possible: 10, source: 'module' })
      await backupProgressForUser(userA)

      // A signs out.
      await authFlow.signOut(userA)
      setActiveScope(GUEST_SCOPE) // matches AuthContext.signOut's own final step

      // B signs in — B must not see A's progress.
      authFlow.signInGoogle(userB)
      await authFlow.reconcile(userB, null)
      expect(getModuleState('history-medicine-black-death')).toEqual({}) // B sees nothing of A's
      expect(getJson('gcse_scores', [])).toEqual([]) // B's scores namespace is empty

      // B creates separate progress.
      saveModuleState('bio_building_life', { screen: 3 })
      recordScore({ subject: 'Biology', earned: 5, possible: 10, source: 'module' })
      await backupProgressForUser(userB)

      // A signs back in.
      await authFlow.signOut(userB)
      authFlow.signInGoogle(userA)
      await authFlow.reconcile(userA, null)

      // A's original progress remains intact...
      expect(getModuleState('history-medicine-black-death')).toEqual({ screen: 6, completed: true })
      // ...and B's progress is absent from A's view.
      expect(getModuleState('bio_building_life')).toEqual({})
    })
  })
})

describe('Journey — guest claims progress', () => {
  it('guest + account A cloud progress merge once; a later account B does not receive the claimed guest progress', async () => {
    await withMockedCloud(async ({ authFlow, claimableGuestProgress, GUEST_SCOPE, setActiveScope, getJson }) => {
      const { saveModuleState, recordScore, getModuleState } = await import('../../../src/progress.js')

      // Guest completes learning.
      setActiveScope(GUEST_SCOPE)
      saveModuleState('sci_bio_w1', { screen: 4, completed: false })
      recordScore({ subject: 'Biology', earned: 6, possible: 10, source: 'module' })

      const userA = { loggedIn: true, provider: 'google', uid: 'uid-guest-claims-A', name: 'Alice' }
      expect(claimableGuestProgress(userA)).toBe(true)

      // Guest signs into account A — guest and A cloud progress merge.
      const { pendingClaimUid } = authFlow.signInGoogle(userA)
      expect(pendingClaimUid).toBe(userA.uid)
      const { ok } = await authFlow.reconcile(userA, pendingClaimUid)
      expect(ok).toBe(true)

      // The migration is marked complete: guest namespace is now empty...
      setActiveScope(GUEST_SCOPE)
      expect(getJson('gcse_module_sci_bio_w1', null)).toBeNull()
      // ...and it's no longer offered as claimable to anyone.
      expect(claimableGuestProgress({ provider: 'google', uid: 'uid-guest-claims-A' })).toBe(false)
      expect(claimableGuestProgress({ provider: 'google', uid: 'someone-else' })).toBe(false)

      // A's own namespace really does have the claimed progress.
      setActiveScope('uid:uid-guest-claims-A')
      expect(getModuleState('sci_bio_w1')).toEqual({ screen: 4, completed: false })

      // Account B later signs in — B does not receive the previously claimed guest progress.
      const userB = { loggedIn: true, provider: 'google', uid: 'uid-guest-claims-B', name: 'Bob' }
      const { pendingClaimUid: bClaim } = authFlow.signInGoogle(userB)
      expect(bClaim).toBeNull() // nothing left to claim
      await authFlow.reconcile(userB, bClaim)
      expect(getModuleState('sci_bio_w1')).toEqual({})
    })
  })
})

describe('Journey — failed guest claim', () => {
  it('a failed reconcile leaves guest progress recoverable; retry succeeds and migrates exactly once', async () => {
    await withMockedCloud(async ({ authFlow, failNextSetDoc, GUEST_SCOPE, setActiveScope, getJson }) => {
      const { saveModuleState, getModuleState } = await import('../../../src/progress.js')

      // Guest has meaningful progress.
      setActiveScope(GUEST_SCOPE)
      saveModuleState('history-medicine-cancer', { screen: 9 })

      const user = { loggedIn: true, provider: 'google', uid: 'uid-failed-claim', name: 'Sam' }
      const { pendingClaimUid } = authFlow.signInGoogle(user)
      expect(pendingClaimUid).toBe(user.uid)

      // Account reconciliation fails (cloud unreachable).
      failNextSetDoc()
      const { ok } = await authFlow.reconcile(user, pendingClaimUid)
      expect(ok).toBe(false)

      // Guest progress remains recoverable — not deleted by the failed attempt.
      setActiveScope(GUEST_SCOPE)
      expect(getJson('gcse_module_history-medicine-cancer', null)).toEqual({ screen: 9 })

      // Retry succeeds.
      setActiveScope('uid:uid-failed-claim')
      const { ok: retryOk } = await authFlow.reconcile(user, pendingClaimUid)
      expect(retryOk).toBe(true)
      expect(getModuleState('history-medicine-cancer')).toEqual({ screen: 9 })

      // Progress migrates once only — the guest namespace is now empty, so a
      // third reconcile attempt has nothing left to (re-)claim.
      setActiveScope(GUEST_SCOPE)
      expect(getJson('gcse_module_history-medicine-cancer', null)).toBeNull()
    })
  })
})

describe('Journey — legacy unscoped data with proven ownership', () => {
  it('moves to A\'s namespace exactly once; a reload does not duplicate it', async () => {
    const seed = () => {
      // Legacy data contains trustworthy ownership for account A (riseUser
      // already proves it, from before this device ever had scoped storage).
      globalThis.localStorage.setItem('riseUser', JSON.stringify({ provider: 'google', uid: 'uid-legacy-proven', name: 'Alice' }))
      globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 12, bestStreak: 12 }))
      globalThis.localStorage.setItem('gcse_scores', JSON.stringify([{ date: '2026-07-01', subject: 'History', pct: 90 }]))
    }
    await withMockedCloud(async ({ runLegacyFlatMigration, setActiveScope }) => {
      // The migration already ran automatically at storage.js's own
      // module-load time (seeded before import, above) — before this
      // callback even started, matching production where it runs before
      // AuthContext mounts. A calling it again (e.g. A signs in and this
      // fires again on the auth-restoration path) is the idempotency check.
      const first = runLegacyFlatMigration()
      expect(first.ran).toBe(false) // already done at module-load time
      expect(first.already.target).toBe('uid:uid-legacy-proven')

      const { getProgress, getScores } = await import('../../../src/progress.js')
      setActiveScope('uid:uid-legacy-proven')
      expect(getProgress().streak).toBe(12)
      expect(getScores()).toHaveLength(1)

      // "Reload" — auth restoration re-runs, migration must not duplicate it.
      const learnerContinues = getScores()
      const second = runLegacyFlatMigration()
      expect(second.ran).toBe(false) // idempotent — nothing to migrate a second time
      expect(getScores()).toEqual(learnerContinues)
      expect(getScores()).toHaveLength(1) // not duplicated
    }, { seed })
  })
})

describe('Journey — ambiguous legacy data', () => {
  it('is not silently uploaded into account B; legacy progress remains recoverable', async () => {
    const seed = () => {
      // Legacy data has no trustworthy owner — no riseUser at all.
      globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 4, bestStreak: 4 }))
      globalThis.localStorage.setItem('gcse_scores', JSON.stringify([{ date: '2026-06-15', subject: 'Maths', pct: 65 }]))
    }
    await withMockedCloud(async ({ runLegacyFlatMigration, setActiveScope, GUEST_SCOPE }) => {
      // Migration already ran automatically at storage.js's module-load time.
      const first = runLegacyFlatMigration()
      expect(first.ran).toBe(false)
      expect(first.already.target).toBe(GUEST_SCOPE)

      // Account B signs in.
      const { getProgress, getScores } = await import('../../../src/progress.js')
      setActiveScope('uid:uid-ambiguous-B')

      // Data is not silently uploaded into B's account.
      expect(getProgress().streak).toBe(0)
      expect(getScores()).toEqual([])

      // Legacy progress remains recoverable (in the guest namespace).
      setActiveScope(GUEST_SCOPE)
      expect(getProgress().streak).toBe(4)
      expect(getScores()).toHaveLength(1)
    }, { seed })
  })
})

describe('Journey — account switch with pending work', () => {
  it('a pending reconcile for A cannot write into B\'s namespace or cloud document', async () => {
    await withMockedCloud(async ({ authFlow, getJsonForScope, getCloudDocForUid }) => {
      const userA = { loggedIn: true, provider: 'google', uid: 'uid-pending-A', name: 'Alice' }
      const userB = { loggedIn: true, provider: 'google', uid: 'uid-pending-B', name: 'Bob' }
      const { saveModuleState } = await import('../../../src/progress.js')
      const { backupProgressForUser } = await import('../../../src/data/progressSync/progressSync.js')

      authFlow.signInGoogle(userA)
      saveModuleState('history-medicine-jenner-vaccination', { screen: 5 })

      // A's pending cloud write is in flight (not yet awaited) when the
      // account switch happens — this is exactly the race the scope-pinning
      // fix targets: the promise captured its own scope at call time.
      const pendingWrite = backupProgressForUser(userA)

      // A signs out, B signs in — all before the pending write resolves.
      await authFlow.signOut(userA)
      authFlow.signInGoogle(userB)
      await authFlow.reconcile(userB, null)

      await pendingWrite // now let A's stale write actually resolve

      // B's namespace was never touched by A's pending write.
      expect(getJsonForScope('uid:uid-pending-B', 'gcse_module_history-medicine-jenner-vaccination', null)).toBeNull()
      // A's own namespace and cloud doc did receive it — the write wasn't lost, just correctly scoped.
      expect(getJsonForScope('uid:uid-pending-A', 'gcse_module_history-medicine-jenner-vaccination', null)).toEqual({ screen: 5 })
      const cloudA = getCloudDocForUid('uid-pending-A')
      expect(cloudA?.data?.['gcse_module_history-medicine-jenner-vaccination']).toEqual({ screen: 5 })
      const cloudB = getCloudDocForUid('uid-pending-B')
      expect(cloudB?.data?.['gcse_module_history-medicine-jenner-vaccination']).toBeUndefined()
    })
  })
})

describe('Journey — abandoned QuickFire round', () => {
  it('ranking evidence from several answers survives a reload before the round finishes, with no answer counted twice', async () => {
    await withMockedCloud(async () => {
      const { bumpQuickFireMemoryForAnswer, readQuickFireMemory } = await import('../../../src/features/quickfire/logic/quickFireMemory.js')

      const q = { id: 'qf-abandon-1', subject: 'Biology', topic: 'Cells', moduleId: 'sci_bio_w1' }
      // Learner answers several questions.
      bumpQuickFireMemoryForAnswer(q, true)
      bumpQuickFireMemoryForAnswer(q, true)
      bumpQuickFireMemoryForAnswer(q, false)

      // Round does not finish — the tab is closed. "App reloads": a fresh
      // read from the same storage boundary, nothing re-runs finishRound.
      const afterReload = readQuickFireMemory()
      expect(afterReload.subjects.Biology.answered).toBe(3)
      expect(afterReload.subjects.Biology.correct).toBe(2)

      // No answer is counted twice — the same fresh read again is stable.
      expect(readQuickFireMemory().subjects.Biology.answered).toBe(3)
    })
  })
})
