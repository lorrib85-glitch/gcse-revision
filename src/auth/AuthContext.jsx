import { createContext, useContext, useState } from 'react'
import { signInWithGoogle as authSignIn, getStoredUser, storeUser, clearUser } from './authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(() => getStoredUser())
  // Skip the Google sign-in wall — go straight to name entry when no stored user
  const [pendingAuth, setPending] = useState(() => !getStoredUser())
  const [loading, setLoading]     = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    try {
      await authSignIn()
      setPending(true)
    } finally {
      setLoading(false)
    }
  }

  function completeOnboarding(name) {
    const userData = {
      loggedIn: true,
      name: name.trim(),
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    }
    storeUser(userData)
    setUser(userData)
    setPending(false)
  }

  function signOut() {
    clearUser()
    setUser(null)
    setPending(false)
  }

  return (
    <AuthContext.Provider value={{ user, pendingAuth, loading, signInWithGoogle, completeOnboarding, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
