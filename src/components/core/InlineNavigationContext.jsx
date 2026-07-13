import { createContext, useContext, useEffect } from 'react'

// Lets a learning component own the only visible Continue CTA while it runs a
// progressive reveal inside ContentShell. ContentShell provides the bridge to
// the module-level navigation action; components never reach into the DOM.
export const InlineNavigationContext = createContext(null)

export function useInlineNavigationOwner(active = true) {
  const api = useContext(InlineNavigationContext)

  useEffect(() => {
    if (!active || !api) return undefined
    return api.claim()
  }, [active, api])

  return api?.continueModule || null
}
