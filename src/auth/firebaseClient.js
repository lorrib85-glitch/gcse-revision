// Firebase app/auth init — the only file that talks to the Firebase SDK
// directly. Config comes from VITE_FIREBASE_* env vars (see .env.example);
// none of these values are secret, but they're still kept out of source.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Missing config (e.g. a dev/CI environment with no Firebase project set up
// yet) must not crash the app — Google sign-in just becomes unavailable.
export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
)

export const app = firebaseEnabled ? initializeApp(firebaseConfig) : null
export const auth = firebaseEnabled ? getAuth(app) : null
export const googleProvider = firebaseEnabled ? new GoogleAuthProvider() : null
