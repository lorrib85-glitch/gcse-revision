import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuthUser = { uid: 'abc123', email: 'test@example.com', displayName: 'Test User', photoURL: null }

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider() {}),
  signInWithPopup: vi.fn(async () => ({ user: mockAuthUser })),
  signOut: vi.fn(async () => {}),
}))

vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key')
vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com')
vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
vi.stubEnv('VITE_FIREBASE_APP_ID', 'test-app')

function installLocalStorageStub() {
  const store = {}
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

// Imported after the env stubs and mocks above so firebaseClient.js sees a
// configured, mocked Firebase on first evaluation.
const { signInWithGoogle, getStoredUser, storeUser, clearUser } = await import('../../../src/auth/authService.js')

describe('authService', () => {
  beforeEach(() => {
    installLocalStorageStub()
  })

  it('signInWithGoogle returns a plain profile from the Firebase popup result', async () => {
    const profile = await signInWithGoogle()
    expect(profile).toEqual(mockAuthUser)
  })

  it('storeUser/getStoredUser/clearUser only ever touch the riseUser key — existing progress keys survive sign-in/out', () => {
    globalThis.localStorage.setItem('gcse_scores', '[1,2,3]')
    globalThis.localStorage.setItem('gcse_mastery_v1', '{"foo":"bar"}')

    storeUser({ loggedIn: true, name: 'Sam', provider: 'google' })
    expect(getStoredUser()).toEqual({ loggedIn: true, name: 'Sam', provider: 'google' })

    clearUser()
    expect(getStoredUser()).toBeNull()

    expect(globalThis.localStorage.getItem('gcse_scores')).toBe('[1,2,3]')
    expect(globalThis.localStorage.getItem('gcse_mastery_v1')).toBe('{"foo":"bar"}')
  })
})
