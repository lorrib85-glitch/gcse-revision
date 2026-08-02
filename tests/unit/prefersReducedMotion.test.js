import { describe, it, expect, afterEach } from 'vitest'
import {
  REDUCED_MOTION_QUERY,
  readPrefersReducedMotion,
  subscribeToReducedMotionPreference,
} from '../../src/hooks/usePrefersReducedMotion.js'

// The canonical hook's testable core. The React wrapper around these helpers is
// covered by the browser tests in src/hooks/usePrefersReducedMotion.stories.jsx.

const originalWindow = globalThis.window

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

// A controllable MediaQueryList double. `vintage` picks which subscription API
// the fake engine exposes: 'modern' (addEventListener), 'legacy' (addListener,
// as on Safari < 14) or 'none'.
function installMatchMedia({ matches = false, vintage = 'modern' } = {}) {
  const listeners = []
  const calls = []

  const query = {
    matches,
    media: null,
    emit(next) {
      query.matches = next
      listeners.slice().forEach(listener => listener({ matches: next }))
    },
    listenerCount: () => listeners.length,
    calls,
  }

  if (vintage === 'modern') {
    query.addEventListener = (type, listener) => {
      calls.push(['addEventListener', type])
      if (type === 'change') listeners.push(listener)
    }
    query.removeEventListener = (type, listener) => {
      calls.push(['removeEventListener', type])
      const index = listeners.indexOf(listener)
      if (index >= 0) listeners.splice(index, 1)
    }
  } else if (vintage === 'legacy') {
    query.addListener = listener => {
      calls.push(['addListener'])
      listeners.push(listener)
    }
    query.removeListener = listener => {
      calls.push(['removeListener'])
      const index = listeners.indexOf(listener)
      if (index >= 0) listeners.splice(index, 1)
    }
  }

  globalThis.window = {
    matchMedia: requested => {
      query.media = requested
      return query
    },
  }

  return query
}

describe('reduced-motion preference core', () => {
  it('uses the exact media query the CSS safety net uses', () => {
    expect(REDUCED_MOTION_QUERY).toBe('(prefers-reduced-motion: reduce)')
  })

  it('asks the browser for exactly that query', () => {
    const query = installMatchMedia()
    readPrefersReducedMotion()
    expect(query.media).toBe('(prefers-reduced-motion: reduce)')
  })

  it('reads a false preference correctly', () => {
    installMatchMedia({ matches: false })
    expect(readPrefersReducedMotion()).toBe(false)
  })

  it('reads a true preference correctly', () => {
    installMatchMedia({ matches: true })
    expect(readPrefersReducedMotion()).toBe(true)
  })

  it('returns false safely with no window at all', () => {
    delete globalThis.window
    expect(readPrefersReducedMotion()).toBe(false)
    expect(() => subscribeToReducedMotionPreference(() => {})()).not.toThrow()
  })

  it('returns false safely when matchMedia is unavailable', () => {
    globalThis.window = {}
    expect(readPrefersReducedMotion()).toBe(false)
    expect(() => subscribeToReducedMotionPreference(() => {})()).not.toThrow()
  })

  it('subscribes through addEventListener("change") when supported', () => {
    const query = installMatchMedia({ vintage: 'modern' })
    const seen = []

    const unsubscribe = subscribeToReducedMotionPreference(value => seen.push(value))
    expect(query.calls).toEqual([['addEventListener', 'change']])

    query.emit(true)
    query.emit(false)
    expect(seen).toEqual([true, false])

    unsubscribe()
    expect(query.calls).toContainEqual(['removeEventListener', 'change'])
    expect(query.listenerCount()).toBe(0)
  })

  it('falls back to the legacy addListener API and removes with removeListener', () => {
    const query = installMatchMedia({ vintage: 'legacy' })
    const seen = []

    const unsubscribe = subscribeToReducedMotionPreference(value => seen.push(value))
    expect(query.calls).toEqual([['addListener']])

    query.emit(true)
    expect(seen).toEqual([true])

    unsubscribe()
    expect(query.calls).toContainEqual(['removeListener'])
    expect(query.listenerCount()).toBe(0)
  })

  it('is a no-op when the engine exposes neither subscription API', () => {
    const query = installMatchMedia({ vintage: 'none' })
    const unsubscribe = subscribeToReducedMotionPreference(() => {})
    expect(query.listenerCount()).toBe(0)
    expect(() => unsubscribe()).not.toThrow()
  })

  it('does not accumulate listeners across repeated subscribe/unsubscribe cycles', () => {
    const query = installMatchMedia()

    for (let i = 0; i < 5; i += 1) {
      const unsubscribe = subscribeToReducedMotionPreference(() => {})
      expect(query.listenerCount()).toBe(1)
      unsubscribe()
      expect(query.listenerCount()).toBe(0)
    }
  })

  it('reports the change event value, not a stale closure', () => {
    const query = installMatchMedia({ matches: false })
    let latest = null

    const unsubscribe = subscribeToReducedMotionPreference(value => { latest = value })
    query.emit(true)
    expect(latest).toBe(true)
    expect(readPrefersReducedMotion()).toBe(true)

    unsubscribe()
  })
})
