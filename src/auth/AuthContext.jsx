import { createContext, useContext, useEffect, useRef, useState } from 'react'
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
  // 'ok' | 'syncing' | 'error' — backup health for the signed-in Google user.
  // A returning Google user starts 'syncing' (not 'ok') so the status never
  // flashes "backed up" before the first reconcile has actually run.
  const [syncStatus, setSyncStatus] = useState(() => (
    getStoredUser()?.provider === 'google' ? 'syncing' : 'ok'
  ))
  // Guards against a double sign-out (e.g. a fast double-tap) triggering two
  // concurrent flush-then-clear sequences.
  const signingOutRef = useRef(false)

  // Reconcile local ↔ cloud once per app load for Google users. If the merge
  // pulled in anything from the cloud side, re-read the stored user so a
  // restored profile (e.g. custom name from another device) is reflected
  // immediately.
  useEffect(() => {
    if (user?.provider !== 'google' || !user?.uid) return
    let cancelled = false
    setSyncStatus('syncing')
    syncProgressForUser(user)
      .then(({ action }) => {
        if (cancelled) return
        setSyncStatus('ok')
        if (action === 'apply' || action === 'merge') setUser(getStoredUser())
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
        setSyncStatus('syncing')
        backupProgressForUser(user)
          .then(() => setSyncStatus('ok'))
          .catch(() => setSyncStatus('error'))
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [user])

  // Bounded automatic retry: when connectivity returns after a failed
  // backup, try once more. Event-driven (not a polling loop or timer chain),
  // so it can never stack up repeated attempts.
  useEffect(() => {
    if (user?.provider !== 'google' || !user?.uid || syncStatus !== 'error') return
    const onOnline = () => {
      setSyncStatus('syncing')
      backupProgressForUser(user)
        .then(() => setSyncStatus('ok'))
        .catch(() => setSyncStatus('error'))
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [user, syncStatus])

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
    // A double-tap or a second signOut() call while the first is still
    // flushing must not run the flush-then-clear sequence twice.
    if (signingOutRef.current) return
    signingOutRef.current = true
    try {
      if (user?.provider === 'google') {
        // Final flush before ending the session — the same safe merge as
        // every other sync point, so it can never clobber another device's
        // cloud-only progress. Local progress keys are deliberately left
        // untouched by sign-out itself: if the flush fails, nothing is lost
        // (it's still sitting in local storage) and the next sign-in
        // reconciles it automatically, so this is non-blocking by design
        // rather than a silently-swallowed failure.
        try {
          await backupProgressForUser(user)
        } catch (err) {
          console.warn('signOut: final progress backup failed — progress remains saved on this device and will retry on next sign-in', err)
        }
        await signOutGoogle()
      }
      clearUser()
      setUser(null)
      setPending(false)
      setGoogleProfile(null)
      setSyncStatus('ok')
    } finally {
      signingOutRef.current = false
    }
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
