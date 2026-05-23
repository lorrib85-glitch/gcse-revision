// Auth service layer — all real auth changes happen only in this file.
// To switch to Firebase: replace signInWithGoogle() body only.
//
// Firebase drop-in (when ready):
//   import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
//   const auth = getAuth()
//   export async function signInWithGoogle() {
//     return signInWithPopup(auth, new GoogleAuthProvider())
//   }

export async function signInWithGoogle() {
  // Placeholder — simulates a successful Google OAuth response (~700ms)
  await new Promise(r => setTimeout(r, 700))
  return { uid: 'mock_' + Date.now() }
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('riseUser') || 'null') } catch { return null }
}

export function storeUser(data) {
  localStorage.setItem('riseUser', JSON.stringify(data))
}

export function clearUser() {
  localStorage.removeItem('riseUser')
}
