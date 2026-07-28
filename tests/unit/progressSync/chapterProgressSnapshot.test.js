import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GUEST_SCOPE,
  getJson,
  setActiveScope,
  setJson,
} from '../../../src/lib/storage.js'

vi.mock('../../../src/auth/firebaseClient.js', () => ({
  firebaseEnabled: false,
  app: {},
}))

const {
  applyProgressSnapshot,
  collectLocalProgressSnapshot,
} = await import('../../../src/data/progressSync/progressSync.js')

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: index => Object.keys(store)[index] ?? null,
    getItem: key => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: key => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
}

beforeEach(() => {
  installLocalStorage()
  setActiveScope(GUEST_SCOPE)
})

afterEach(() => setActiveScope(GUEST_SCOPE))

describe('progress snapshots use canonical chapter keys', () => {
  it('collects a legacy local key as canonical and migrates the local copy', () => {
    setJson('gcse_module_history-1', { screen: 4, hookDone: true })

    const snapshot = collectLocalProgressSnapshot(GUEST_SCOPE)

    expect(snapshot.data['gcse_chapter_history-1']).toEqual({ screen: 4, hookDone: true })
    expect(snapshot.data['gcse_module_history-1']).toBeUndefined()
    expect(getJson('gcse_chapter_history-1', null)).toEqual({ screen: 4, hookDone: true })
    expect(getJson('gcse_module_history-1', null)).toBeNull()
  })

  it('applies an old cloud key locally under the canonical name only', () => {
    applyProgressSnapshot({
      version: 1,
      updatedAt: 1,
      data: {
        'gcse_module_history-1': {
          screen: 7,
          completed: true,
          examinerAttempts: [{ id: 'q1' }],
        },
      },
    }, { scope: GUEST_SCOPE })

    expect(getJson('gcse_chapter_history-1', null)).toEqual({
      screen: 7,
      completed: true,
      examinerAttempts: [{ id: 'q1' }],
    })
    expect(getJson('gcse_module_history-1', null)).toBeNull()
  })
})
