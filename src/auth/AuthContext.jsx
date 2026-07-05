import { createContext, useContext, useState } from 'react'
import {
  signInWithGoogle as authSignIn,
  signOutGoogle,
  getStoredUser,
  storeUser,
  clearUser,
} from './authService.js'

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
  // the existing profile without re-running onboarding or touching progress data.
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
    if (user?.provider === 'google') await signOutGoogle()
    clearUser()
    setUser(null)
    setPending(false)
    setGoogleProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, pendingAuth, loading, authError, googleProfile,
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
