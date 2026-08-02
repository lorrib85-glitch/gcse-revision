import { useEffect, useRef } from 'react'

// Shared Storybook fixture for reduced-motion behaviour.
//
// It does three things a plain "does it look static" assertion cannot:
//
//  1. Pins the device preference *before the component mounts*, via
//     window.matchMedia — the same channel production uses. Every query other
//     than the reduced-motion one passes through untouched, so Storybook's own
//     viewport and theme handling is unaffected.
//  2. Records the delay of every timer the story schedules, so a test can prove
//     a staged reveal was never scheduled — not merely that it finished fast.
//  3. Records any element painted at opacity 0 and corrected afterwards — the
//     exact signature of a false first frame.
//
// Everything is restored when the story unmounts.

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const motionProbe = {
  timeouts: [],
  intervals: [],
  // Under reduced motion this must stay empty: state that drives an entrance
  // has to be seeded from the preference, not seeded hidden and fixed up later.
  opacityCorrections: [],
  emit: () => {},
  listenerCount: () => 0,
}

function readOpacity(styleText) {
  const match = /(?:^|[;\s])opacity:\s*([^;]+)/.exec(styleText || '')
  return match ? match[1].trim() : null
}

function install(prefersReduced, vintage) {
  const listeners = new Set()
  const state = { matches: prefersReduced }

  const originalMatchMedia = window.matchMedia
  const originalSetTimeout = window.setTimeout
  const originalSetInterval = window.setInterval

  const mediaQueryList = {
    get matches() { return state.matches },
    media: REDUCED_MOTION_QUERY,
    onchange: null,
    dispatchEvent: () => false,
  }

  // 'legacy' exposes only addListener/removeListener, as on Safari < 14.
  if (vintage === 'legacy') {
    mediaQueryList.addListener = listener => listeners.add(listener)
    mediaQueryList.removeListener = listener => listeners.delete(listener)
  } else {
    mediaQueryList.addEventListener = (type, listener) => {
      if (type === 'change') listeners.add(listener)
    }
    mediaQueryList.removeEventListener = (type, listener) => {
      if (type === 'change') listeners.delete(listener)
    }
  }

  motionProbe.timeouts = []
  motionProbe.intervals = []
  motionProbe.opacityCorrections = []
  motionProbe.emit = next => {
    state.matches = next
    Array.from(listeners).forEach(listener => listener({ matches: next }))
  }
  motionProbe.listenerCount = () => listeners.size

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      const before = readOpacity(record.oldValue)
      const after = record.target.style?.opacity
      if (before === '0' && after && after !== '0') {
        motionProbe.opacityCorrections.push({
          tag: record.target.tagName,
          text: (record.target.textContent || '').trim().slice(0, 40),
          before,
          after,
        })
      }
    })
  })
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['style'],
  })

  window.matchMedia = query => (
    query === REDUCED_MOTION_QUERY
      ? mediaQueryList
      : originalMatchMedia.call(window, query)
  )
  window.setTimeout = (handler, delay, ...rest) => {
    motionProbe.timeouts.push(delay)
    return originalSetTimeout.call(window, handler, delay, ...rest)
  }
  window.setInterval = (handler, delay, ...rest) => {
    motionProbe.intervals.push(delay)
    return originalSetInterval.call(window, handler, delay, ...rest)
  }

  return () => {
    observer.disconnect()
    window.matchMedia = originalMatchMedia
    window.setTimeout = originalSetTimeout
    window.setInterval = originalSetInterval
  }
}

// Usage: decorators: [motionPreferenceDecorator(true)]
export function motionPreferenceDecorator(prefersReduced, vintage = 'modern') {
  return function MotionPreferenceDecorator(Story) {
    const restoreRef = useRef(null)

    // Installed during render so the preference is already in place for the
    // story component's own first render.
    if (restoreRef.current === null) restoreRef.current = install(prefersReduced, vintage)

    useEffect(() => () => {
      restoreRef.current?.()
      restoreRef.current = null
    }, [])

    return <Story />
  }
}
