import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  signInWithGoogle as authSignIn,
  signOutGoogle,
  getStoredUser,
  storeUser,
  clearUser,
} from './authService.js'
import { syncProgressForUser, backupProgressForUser } from '../data/progressSync/progressSync.js'
import { claimGuestProgressForUser, finalizeGuestClaim, markGuestClaimFailed } from '../data/progressSync/accountScope.js'
import { setActiveScope, scopeForUser, GUEST_SCOPE } from '../lib/storage.js'

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
  // Set to a uid right when completeOnboarding/linkGoogleAccount locally
  // merges a claimed guest snapshot into that uid's namespace; cleared once
  // the *cloud* side of that same reconcile has actually succeeded. Until
  // then the guest snapshot is left untouched, so a failed reconcile never
  // loses it — see accountScope.js.
  const pendingGuestClaimUidRef = useRef(null)

  function onReconcileSettled(forUser, outcome) {
    if (pendingGuestClaimUidRef.current !== forUser?.uid) return
    if (outcome === 'ok') {
      finalizeGuestClaim(forUser)
      pendingGuestClaimUidRef.current = null
    } else {
      markGuestClaimFailed(forUser)
    }
  }

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
        onReconcileSettled(user, 'ok')
        if (cancelled) return
        setSyncStatus('ok')
        if (action === 'apply' || action === 'merge') setUser(getStoredUser())
      })
      .catch(() => {
        onReconcileSettled(user, 'error')
        if (!cancelled) setSyncStatus('error')
      })
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
          .then(() => { onReconcileSettled(user, 'ok'); setSyncStatus('ok') })
          .catch(() => { onReconcileSettled(user, 'error'); setSyncStatus('error') })
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
        .then(() => { onReconcileSettled(user, 'ok'); setSyncStatus('ok') })
        .catch(() => { onReconcileSettled(user, 'error'); setSyncStatus('error') })
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
    // A brand-new Google sign-in is exactly the "guest → account" transition
    // guest progress may be deliberately offered to — before switching the
    // active namespace over to this uid, fold in whatever's sitting in the
    // guest namespace (local-only; the sync effect below does the cloud side
    // and finalizes/fails the claim once that's actually settled).
    if (userData.provider === 'google') {
      const { claimed } = claimGuestProgressForUser(userData)
      if (claimed) pendingGuestClaimUidRef.current = userData.uid
    }
    storeUser(userData)
    setActiveScope(scopeForUser(userData))
    setUser(userData)
    setPending(false)
    setGoogleProfile(null)
  }

  // For a learner who already onboarded as a guest and later wants their
  // progress associated with a Google account — merges Google identity into
  // the existing profile without re-running onboarding, claims any guest
  // progress into the new uid's namespace, then kicks off the first sync
  // for that account.
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
      const { claimed } = claimGuestProgressForUser(updated)
      if (claimed) pendingGuestClaimUidRef.current = updated.uid
      storeUser(updated)
      setActiveScope(scopeForUser(updated))
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
          onReconcileSettled(user, 'ok')
        } catch (err) {
          onReconcileSettled(user, 'error')
          console.warn('signOut: final progress backup failed — progress remains saved on this device and will retry on next sign-in', err)
        }
        await signOutGoogle()
      }
      clearUser()
      // Every subsequent read/write (including any reconcile still in
      // flight from *this* user — it captured its own scope already, so it
      // stays pinned to that namespace) targets the guest namespace again,
      // not whichever account happens to sign in next.
      setActiveScope(GUEST_SCOPE)
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
