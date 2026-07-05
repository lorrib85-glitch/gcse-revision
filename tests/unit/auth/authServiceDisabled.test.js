import { describe, it, expect, vi } from 'vitest'

// No VITE_FIREBASE_* env stubs here — firebaseClient sees an unconfigured
// environment, so firebaseEnabled is false and sign-in must fail with the
// learner-friendly message, never a technical one in production.
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider() {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))

const { signInWithGoogle } = await import('../../../src/auth/authService.js')

describe('authService with Firebase unconfigured', () => {
  it('throws the learner-friendly wording, not a technical error', async () => {
    await expect(signInWithGoogle()).rejects.toThrow(
      /Google sign-in is not ready on this test version yet\./
    )
  })
})
