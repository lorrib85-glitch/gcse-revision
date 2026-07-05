import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithGoogle as authSignIn,
  signOutGoogle,
  getStoredUser,
  storeUser,
  clearUser,
} from './authService.js'
import { syncProgressForUser, backupProgressForUser } from '../data/progressSync/progressSync.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(() => getStoredUser())
  // Step 1 (LoginScreen: Google / continue without Google) shows first for a
  // new visitor; pendingAuth flips true once a path is chosen, revealing
  // step 2 (OnboardingScreen: confirm/edit name).
  const [pendingAuth, setPending]   = useState(false)
  const [googleProfile, setGoogleProfile] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [authError, setAuthError]   = useState(null)
  // 'ok' | 'error' — backup health for the signed-in Google user.
  const [syncStatus, setSyncStatus] = useState('ok')

  // Reconcile local ↔ cloud once per app load for Google users. If the cloud
  // snapshot was applied, re-read the stored user so a restored profile
  // (e.g. custom name from another device) is reflected immediately.
  useEffect(() => {
    if (user?.provider !== 'google' || !user?.uid) return
    let cancelled = false
    syncProgressForUser(user)
      .then(({ action }) => {
        if (cancelled) return
        setSyncStatus('ok')
        if (action === 'apply') setUser(getStoredUser())
      })
      .catch(() => { if (!cancelled) setSyncStatus('error') })
    return () => { cancelled = true }
    // Run once per signed-in identity, not on every user object change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  // Best-effort backup whenever the app is backgrounded/closed on mobile.
  useEffect(() => {
    if (user?.provider !== 'google' || !user?.uid) return
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        backupProgressForUser(user)
          .then(() => setSyncStatus('ok'))
          .catch(() => setSyncStatus('error'))
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [user])

  async function signInWithGoogle() {
    setLoading(true)
    setAuthError(null)
    try {
      const profile = await authSignIn()
      setGoogleProfile(profile)
      setPending(true)
    } catch (err) {
      setAuthError(err?.message || 'Google sign-in failed — please try again.')
    } finally {
      setLoading(false)
    }
  }

  function continueAsGuest() {
    setGoogleProfile(null)
    setPending(true)
  }

  function completeOnboarding(name) {
    const userData = {
      loggedIn: true,
      name: name.trim(),
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      ...(googleProfile
        ? { provider: 'google', uid: googleProfile.uid, email: googleProfile.email, photoURL: googleProfile.photoURL || null }
        : { provider: 'guest' }),
    }
    storeUser(userData)
    setUser(userData)
    setPending(false)
    setGoogleProfile(null)
  }

  // For a learner who already onboarded as a guest and later wants their
  // progress associated with a Google account — merges Google identity into
  // the existing profile without re-running onboarding or touching progress
  // data, then kicks off the first sync for that account.
  async function linkGoogleAccount() {
    setLoading(true)
    setAuthError(null)
    try {
      const profile = await authSignIn()
      const updated = {
        ...user,
        provider: 'google',
        uid: profile.uid,
        email: profile.email,
        photoURL: profile.photoURL || null,
      }
      storeUser(updated)
      setUser(updated)
    } catch (err) {
      setAuthError(err?.message || 'Google sign-in failed — please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    if (user?.provider === 'google') {
      // Final best-effort backup, then end the Firebase session. Local
      // progress keys are deliberately left untouched.
      await backupProgressForUser(user).catch(() => {})
      await signOutGoogle()
    }
    clearUser()
    setUser(null)
    setPending(false)
    setGoogleProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, pendingAuth, loading, authError, googleProfile, syncStatus,
      signInWithGoogle, continueAsGuest, completeOnboarding, linkGoogleAccount, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
