import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export default function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== 'undefined'
      && !!window.matchMedia?.(REDUCED_MOTION_QUERY).matches
  )

  useEffect(() => {
    const query = window.matchMedia?.(REDUCED_MOTION_QUERY)
    if (!query) return undefined

    const updatePreference = event => setReduceMotion(event.matches)
    setReduceMotion(query.matches)
    query.addEventListener?.('change', updatePreference)

    return () => query.removeEventListener?.('change', updatePreference)
  }, [])

  return reduceMotion
}
