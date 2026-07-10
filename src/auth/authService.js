// Auth service layer — all real auth changes happen only in this file.
// Real Google sign-in via Firebase Auth; falls back to a clear error
// (never a silent no-op) when Firebase isn't configured for this environment.

import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider, firebaseEnabled } from './firebaseClient.js'
import { getJson, setJson, removeKey } from '../lib/storage.js'

export async function signInWithGoogle() {
  if (!firebaseEnabled) {
    // Learner-friendly in production; the technical cause is dev-only.
    throw new Error(import.meta.env.DEV
      ? 'Google sign-in is not ready on this test version yet. (Missing Firebase configuration.)'
      : 'Google sign-in is not ready on this test version yet.')
  }
  const result = await signInWithPopup(auth, googleProvider)
  const { uid, email, displayName, photoURL } = result.user
  return { uid, email, displayName, photoURL }
}

export async function signOutGoogle() {
  if (!firebaseEnabled) return
  try { await firebaseSignOut(auth) } catch { /* best-effort — local state clears regardless */ }
}

export function getStoredUser() {
  return getJson('riseUser', null)
}

export function storeUser(data) {
  setJson('riseUser', data)
}

export function clearUser() {
  removeKey('riseUser')
}
