import { describe, it, expect, vi, beforeEach } from 'vitest'

// In-memory store standing in for the storage.js persistence boundary.
let store = {}

// This suite exercises the merge/sync mechanics, not cross-account
// isolation (that's covered by tests/unit/storage/storage.test.js and the
// learner-journey tests against the real storage.js) — so the scoped
// primitives here all share one flat store, ignoring the scope argument.
vi.mock('../../../src/lib/storage.js', () => ({
  getJson: vi.fn((key, fallback) => (key in store ? store[key] : fallback)),
  setJson: vi.fn((key, value) => { store[key] = value }),
  removeKey: vi.fn((key) => { delete store[key] }),
  getArray: vi.fn((key) => (key in store ? store[key] : [])),
  getObject: vi.fn((key) => (key in store ? store[key] : {})),
  listKeys: vi.fn((prefix = '') => Object.keys(store).filter(k => k.startsWith(prefix))),
  getJsonForScope: vi.fn((_scope, key, fallback) => (key in store ? store[key] : fallback)),
  setJsonForScope: vi.fn((_scope, key, value) => { store[key] = value }),
  removeKeyForScope: vi.fn((_scope, key) => { delete store[key] }),
  listKeysForScope: vi.fn((_scope, prefix = '') => Object.keys(store).filter(k => k.startsWith(prefix))),
  getRawJson: vi.fn((key, fallback) => (key in store ? store[key] : fallback)),
  setRawJson: vi.fn((key, value) => { store[key] = value }),
  removeRawKey: vi.fn((key) => { delete store[key] }),
  scopeForUser: vi.fn((user) => (user?.provider === 'google' && user?.uid) ? `uid:${user.uid}` : 'guest'),
  GUEST_SCOPE: 'guest',
}))

vi.mock('../../../src/auth/firebaseClient.js', () => ({
  firebaseEnabled: true,
  app: {},
}))

// Mock Firestore SDK — captures the doc path segments and read/write payloads.
const firestoreCalls = { docPaths: [], setDocs: [] }
let cloudDoc = null

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn((db, ...segments) => {
    firestoreCalls.docPaths.push(segments)
    return { segments }
  }),
  getDoc: vi.fn(async () => ({
    exists: () => cloudDoc !== null,
    data: () => cloudDoc,
  })),
  setDoc: vi.fn(async (ref, value) => {
    firestoreCalls.setDocs.push({ ref, value })
    cloudDoc = value
  }),
}))

const {
  collectLocalProgressSnapshot,
  applyProgressSnapshot,
  decideSyncAction,
  syncProgressForUser,
  backupProgressForUser,
  STATIC_PROGRESS_KEYS,
  SYNC_META_KEY,
} = await import('../../../src/data/progressSync/progressSync.js')

const GOOGLE_USER = { loggedIn: true, provider: 'google', uid: 'uid-1', name: 'Sam' }
const GUEST_USER = { loggedIn: true, provider: 'guest', name: 'Sam' }

function seedMeaningfulLocal() {
  store['riseUser'] = { loggedIn: true, provider: 'google', uid: 'uid-1', name: 'Sam' }
  store['gcse_scores'] = [{ date: '2026-07-01', subject: 'History', pct: 72 }]
  store['gcse_module_history-1'] = { screen: 4 }
}

beforeEach(() => {
  store = {}
  cloudDoc = null
  firestoreCalls.docPaths.length = 0
  firestoreCalls.setDocs.length = 0
})

describe('collectLocalProgressSnapshot', () => {
  it('includes expected static keys, dynamic module keys, and version/updatedAt', () => {
    seedMeaningfulLocal()
    store['gcse_mastery_v1'] = { concepts: { a: 1 } }
    const snap = collectLocalProgressSnapshot()
    expect(snap.version).toBe(1)
    expect(snap.updatedAt).toBeTypeOf('number')
    expect(Object.keys(snap.data)).toEqual(
      expect.arrayContaining(['riseUser', 'gcse_scores', 'gcse_mastery_v1', 'gcse_module_history-1'])
    )
  })

  it('excludes streak celebration flags and its own sync meta', () => {
    seedMeaningfulLocal()
    store['streakCelebrationShown:2026-07-05'] = true
    store[SYNC_META_KEY] = { lastSyncedAt: 123 }
    const snap = collectLocalProgressSnapshot()
    expect(snap.data['streakCelebrationShown:2026-07-05']).toBeUndefined()
    expect(snap.data[SYNC_META_KEY]).toBeUndefined()
  })

  it('covers every progress key named in the spec', () => {
    for (const key of [
      'riseUser', 'gcse_scores', 'gcse_wrong_answers', 'gcse_correct_answers',
      'gcse_exam_techniques', 'gcse_coach_type_results', 'gcse_progress',
      'gcse_planner_rotation', 'gcse_planner_prefs', 'gcse_planner_weakpoints',
      'gcse_planner_paper_results', 'gcse_mastery_v1', 'gcse_quickfire_memory_v1',
      'gcse_qf_q_history', 'gcse_qf_prev_session', 'gcse_qf_best', 'gcse_todays_plan_revisit',
    ]) {
      expect(STATIC_PROGRESS_KEYS).toContain(key)
    }
  })
})

describe('applyProgressSnapshot', () => {
  it('writes snapshot keys without deleting unrelated existing keys', () => {
    store['gcse_scores'] = [{ pct: 10 }]
    store['some_unrelated_key'] = 'keep me'
    const applied = applyProgressSnapshot({
      version: 1, updatedAt: 1,
      data: { gcse_scores: [{ pct: 99 }], gcse_progress: { streak: 3 } },
    })
    expect(applied).toBe(2)
    expect(store['gcse_scores']).toEqual([{ pct: 99 }])
    expect(store['gcse_progress']).toEqual({ streak: 3 })
    expect(store['some_unrelated_key']).toBe('keep me')
  })

  it('refuses to overwrite riseUser with a different account uid', () => {
    store['riseUser'] = { uid: 'uid-1', name: 'Sam' }
    applyProgressSnapshot(
      { version: 1, updatedAt: 1, data: { riseUser: { uid: 'other-uid', name: 'Mallory' } } },
      { currentUid: 'uid-1' }
    )
    expect(store['riseUser']).toEqual({ uid: 'uid-1', name: 'Sam' })
  })
})

describe('decideSyncAction', () => {
  const meaningful = { version: 1, updatedAt: 100, data: { gcse_scores: [{ pct: 50 }] } }
  const empty = { version: 1, updatedAt: 200, data: { riseUser: { name: 'Sam' } } }

  it('uploads local when no cloud doc exists', () => {
    expect(decideSyncAction({ cloud: null, local: meaningful })).toBe('upload')
  })

  it('restores cloud when local is empty and cloud has progress', () => {
    expect(decideSyncAction({ cloud: meaningful, local: empty })).toBe('apply')
  })

  it('never overwrites meaningful cloud progress with an empty local snapshot', () => {
    expect(decideSyncAction({ cloud: meaningful, local: empty, lastSyncedAt: 999 })).toBe('apply')
  })

  it('never wipes meaningful local progress with an empty cloud snapshot', () => {
    expect(decideSyncAction({ cloud: empty, local: meaningful, lastSyncedAt: 0 })).toBe('upload')
  })

  it('merges — never a blanket "cloud wins" or "local wins" — when both sides hold genuinely different progress', () => {
    // Two different score entries, not a conflict on the same record: the
    // old timestamp-race logic would have picked one side and silently
    // discarded the other's real progress. lastSyncedAt no longer decides
    // this — the decision is content-based.
    const local = { version: 1, updatedAt: 500, data: { gcse_scores: [{ date: '2026-07-05', subject: 'History', pct: 1 }] } }
    const cloud = { version: 1, updatedAt: 400, data: { gcse_scores: [{ date: '2026-07-04', subject: 'Maths', pct: 2 }] } }
    expect(decideSyncAction({ cloud, local, lastSyncedAt: 300 })).toBe('merge')
    expect(decideSyncAction({ cloud, local, lastSyncedAt: 400 })).toBe('merge')
  })

  it('is a no-op once both sides already hold the identical merged content', () => {
    const same = { version: 1, updatedAt: 500, data: { gcse_scores: [{ date: '2026-07-05', subject: 'History', pct: 1 }] } }
    expect(decideSyncAction({ cloud: same, local: same })).toBe('none')
  })
})

describe('syncProgressForUser', () => {
  it('does nothing for guest users — Firestore is never touched', async () => {
    seedMeaningfulLocal()
    const result = await syncProgressForUser(GUEST_USER)
    expect(result).toEqual({ action: 'none', reason: 'not-google-user' })
    expect(firestoreCalls.docPaths).toHaveLength(0)
  })

  it('does nothing when logged out', async () => {
    const result = await syncProgressForUser(null)
    expect(result.action).toBe('none')
    expect(firestoreCalls.docPaths).toHaveLength(0)
  })

  it('uploads to the user-owned path users/{uid}/progress/main', async () => {
    seedMeaningfulLocal()
    const result = await syncProgressForUser(GOOGLE_USER)
    expect(result.action).toBe('upload')
    expect(firestoreCalls.docPaths.at(-1)).toEqual(['users', 'uid-1', 'progress', 'main'])
    expect(cloudDoc.version).toBe(1)
    expect(cloudDoc.data.gcse_scores).toEqual(store['gcse_scores'])
  })

  it('restores cloud progress locally when local is fresh/empty', async () => {
    cloudDoc = {
      version: 1, updatedAt: Date.now(),
      data: { gcse_scores: [{ pct: 88 }], 'gcse_module_history-1': { screen: 9 } },
    }
    const result = await syncProgressForUser(GOOGLE_USER)
    expect(result.action).toBe('apply')
    expect(store['gcse_scores']).toEqual([{ pct: 88 }])
  })

  it('merges divergent local and cloud progress — both sides survive, and the merge is idempotent on repeat', async () => {
    store['gcse_scores'] = [{ date: '2026-07-05', subject: 'History', pct: 60 }]
    store['gcse_module_local-only'] = { screen: 2 }
    cloudDoc = {
      version: 1, updatedAt: Date.now() - 1000,
      data: {
        gcse_scores: [{ date: '2026-07-01', subject: 'Maths', pct: 90 }],
        'gcse_module_cloud-only': { screen: 5 },
      },
    }
    const first = await syncProgressForUser(GOOGLE_USER)
    expect(first.action).toBe('merge')
    expect(store['gcse_scores']).toHaveLength(2)
    expect(store['gcse_module_local-only']).toEqual({ screen: 2 })
    expect(store['gcse_module_cloud-only']).toEqual({ screen: 5 })
    expect(cloudDoc.data['gcse_module_local-only']).toEqual({ screen: 2 })
    expect(cloudDoc.data.gcse_scores).toHaveLength(2)

    // Repeating the sync with nothing new to contribute writes nothing else
    // and does not duplicate the merged entries.
    const setDocCountBefore = firestoreCalls.setDocs.length
    const second = await syncProgressForUser(GOOGLE_USER)
    expect(second.action).toBe('none')
    expect(firestoreCalls.setDocs).toHaveLength(setDocCountBefore)
    expect(store['gcse_scores']).toHaveLength(2)
  })
})

describe('backupProgressForUser', () => {
  it('restores a meaningful cloud backup onto an empty local device instead of refusing (never claims backup succeeded while leaving the device with nothing)', async () => {
    cloudDoc = { version: 1, updatedAt: 100, data: { gcse_scores: [{ pct: 70 }] } }
    const result = await backupProgressForUser(GOOGLE_USER)
    expect(result.action).toBe('apply')
    expect(store['gcse_scores']).toEqual([{ pct: 70 }])
    expect(cloudDoc.data.gcse_scores).toEqual([{ pct: 70 }])
  })

  it('uploads meaningful local state for Google users', async () => {
    seedMeaningfulLocal()
    const result = await backupProgressForUser(GOOGLE_USER)
    expect(result.action).toBe('upload')
    expect(cloudDoc.data['gcse_module_history-1']).toBeDefined()
  })

  it('merges rather than clobbers when another device already pushed cloud-only progress since this device last synced', async () => {
    seedMeaningfulLocal()
    cloudDoc = {
      version: 1, updatedAt: Date.now(),
      data: { 'gcse_module_from-other-device': { screen: 7, completed: true } },
    }
    const result = await backupProgressForUser(GOOGLE_USER)
    expect(result.action).toBe('merge')
    // This device's own progress was uploaded...
    expect(cloudDoc.data['gcse_module_history-1']).toBeDefined()
    // ...and the other device's cloud-only progress was not clobbered.
    expect(cloudDoc.data['gcse_module_from-other-device']).toEqual({ screen: 7, completed: true })
    expect(store['gcse_module_from-other-device']).toEqual({ screen: 7, completed: true })
  })

  it('does nothing for guests', async () => {
    seedMeaningfulLocal()
    const result = await backupProgressForUser(GUEST_USER)
    expect(result.action).toBe('none')
    expect(cloudDoc).toBeNull()
  })
})

describe('size budget — honest oversize handling', () => {
  it('blocks the cloud write (never a false "backed up") when a snapshot stays over budget after compaction', async () => {
    seedMeaningfulLocal()
    // Core state (a module) that compaction must never trim — keeps the
    // snapshot over the hard budget no matter what.
    store['gcse_module_huge'] = { screen: 1, note: 'x'.repeat(1_000_000) }

    const res = await syncProgressForUser(GOOGLE_USER)
    expect(res.action).toBe('blocked')
    expect(res.reason).toBe('over-budget')
    expect(firestoreCalls.setDocs).toHaveLength(0) // nothing was uploaded
    expect(cloudDoc).toBeNull()
    // Local progress is untouched and still there.
    expect(store['gcse_module_huge'].screen).toBe(1)
  })

  it('compacts an oversized-but-trimmable snapshot and uploads within budget', async () => {
    seedMeaningfulLocal()
    // ~9k QuickFire events push the snapshot over budget, but compaction folds
    // them into the merge-safe baseline, so the upload proceeds.
    store['gcse_qf_answer_log'] = Array.from({ length: 9000 }, (_, i) => ({
      id: `A-${i + 1}`, dev: 'A', seq: i + 1, subject: 'Maths', topicKey: 'Maths::Algebra', correct: i % 2 === 0, at: 1000 + i,
    }))
    store['gcse_quickfire_memory_v1'] = {
      subjects: { Maths: { subject: 'Maths', answered: 9000, correct: 4500, seedAnswered: 0, seedCorrect: 0 } },
      topics: {},
    }

    const res = await syncProgressForUser(GOOGLE_USER)
    expect(res.action).not.toBe('blocked')
    expect(firestoreCalls.setDocs.length).toBeGreaterThan(0)
    const uploaded = firestoreCalls.setDocs.at(-1).value
    expect(uploaded.data.gcse_qf_answer_log.length).toBeLessThanOrEqual(1500)
    expect(uploaded.data.gcse_qf_baseline_v1).toBeTruthy()
  })
})
