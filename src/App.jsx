import { lazy, Suspense } from 'react'
import LegacyApp from './app/LegacyApp.jsx'
import SaveFailureHost from './app/SaveFailureHost.jsx'

// Development-only Component Review Lab (?componentReview=true). Referenced only
// through this DEV-guarded lazy binding: in a production build import.meta.env.DEV
// is statically false, so the ternary folds to null, the dynamic import() inside
// the dead branch is never reached, and the lab chunk is not emitted — production
// learners can never reach it. See docs/superpowers/specs/2026-07-13-component-review-lab-design.md.
const ComponentReviewLab = import.meta.env.DEV
  ? lazy(() => import('./dev/componentReview/ComponentReviewLab.jsx'))
  : null

function useComponentReviewFlag() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('componentReview') === 'true'
}

export default function App() {
  // When the dev flag is present, render the lab INSTEAD of the learner app so
  // it bypasses auth, onboarding, tabs and bottom-nav entirely and is never a
  // child of the learner tree.
  if (useComponentReviewFlag() && ComponentReviewLab) {
    return (
      <Suspense fallback={null}>
        <ComponentReviewLab />
      </Suspense>
    )
  }

  return (
    <>
      <LegacyApp />
      {/* App-wide governed notice for failed critical saves. Renders nothing
          until a save fails, so it is safe to keep mounted at the root. */}
      <SaveFailureHost />
    </>
  )
}
