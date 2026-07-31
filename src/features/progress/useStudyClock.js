// ─── Study clock ────────────────────────────────────────────────────────────
//
// Accumulates real study time for the Progress tab. Deliberately conservative:
// it only counts a tick when all three are true — a learning surface is open,
// the tab is visible, and the learner has interacted recently. A phone left
// face-up on a chapter screen stops counting after a couple of minutes rather
// than banking an hour the learner never actually studied.

import { useEffect } from 'react'
import { addStudySeconds } from './studyTime.js'

const TICK_SECONDS = 30
// Two silent ticks in a row and we assume they've walked away. Reading a
// screen without tapping is real studying, so this can't be too tight.
const IDLE_LIMIT_MS = 3 * 60 * 1000

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll']

export function useStudyClock(active) {
  useEffect(() => {
    if (!active) return

    let lastInteraction = Date.now()
    const noteInteraction = () => { lastInteraction = Date.now() }
    INTERACTION_EVENTS.forEach(event =>
      window.addEventListener(event, noteInteraction, { passive: true }))

    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastInteraction > IDLE_LIMIT_MS) return
      addStudySeconds(TICK_SECONDS)
    }, TICK_SECONDS * 1000)

    return () => {
      clearInterval(id)
      INTERACTION_EVENTS.forEach(event =>
        window.removeEventListener(event, noteInteraction))
    }
  }, [active])
}
