import { useEffect, useState } from 'react'

// The single app-owned reactive source of the learner's reduced-motion
// preference. The operating system / browser setting is authoritative — this is
// never persisted, overridden or mirrored into app state.
//
// Components must not re-implement this. See
// tests/architecture/reduced-motion-boundary.test.js and
// docs/system/MOTION_SYSTEM.md.
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function getMediaQueryList() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  return window.matchMedia(REDUCED_MOTION_QUERY)
}

// Synchronous one-shot read. Safe without a browser and without matchMedia.
export function readPrefersReducedMotion() {
  return !!getMediaQueryList()?.matches
}

// Subscribes to preference changes and returns an unsubscribe function that
// always uses the matching removal method. Modern engines get
// addEventListener('change'); Safari < 14 and other legacy engines only expose
// the deprecated addListener/removeListener pair.
export function subscribeToReducedMotionPreference(onChange) {
  const query = getMediaQueryList()
  if (!query) return () => {}

  const listener = event => onChange(!!event.matches)

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }

  if (typeof query.addListener === 'function') {
    query.addListener(listener)
    return () => query.removeListener(listener)
  }

  return () => {}
}

export default function usePrefersReducedMotion() {
  // Lazy initialiser, so the first client render already knows the preference.
  const [reduceMotion, setReduceMotion] = useState(readPrefersReducedMotion)

  useEffect(() => {
    // Re-sync in case the preference changed between render and subscription.
    setReduceMotion(readPrefersReducedMotion())
    return subscribeToReducedMotionPreference(setReduceMotion)
  }, [])

  return reduceMotion
}
