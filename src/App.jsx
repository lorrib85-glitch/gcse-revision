import { lazy, Suspense } from 'react'
import LegacyApp from './app/LegacyApp.jsx'
import SaveFailureHost from './app/SaveFailureHost.jsx'

// Component Review Lab (?componentReview=true) — a personal inspection tool for
// the app owner, reachable in every build (including production) via the query
// flag or the "Component review lab" card in the History browser. It is lazily
// loaded as its own chunk, so learners who never hit the flag never download it,
// and it still isolates itself to a throwaway storage scope so interacting with
// previews cannot touch real learner data. See
// docs/superpowers/specs/2026-07-13-component-review-lab-design.md.
const ComponentReviewLab = lazy(() => import('./dev/componentReview/ComponentReviewLab.jsx'))

// System reference (?systemReference=true) — the sibling owner surface holding
// runtime-placed screens and design-system patterns: real, previewable, and
// deliberately not chapter authoring choices, so they are not in the Lab. It is
// its own lazy chunk on its own flag; adding it changes nothing about how the
// Lab above is reached.
const SystemReference = lazy(() => import('./dev/systemReference/SystemReference.jsx'))

function ownerFlag(name) {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(name) === 'true'
}

export default function App() {
  // When an owner flag is present, render that surface INSTEAD of the learner
  // app so it bypasses auth, onboarding, tabs and bottom-nav entirely and is
  // never a child of the learner tree.
  if (ownerFlag('componentReview')) {
    return (
      <Suspense fallback={null}>
        <ComponentReviewLab />
      </Suspense>
    )
  }

  if (ownerFlag('systemReference')) {
    return (
      <Suspense fallback={null}>
        <SystemReference />
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
