// ─── Streak celebration — storage + derivation logic ──────────────────────
// Kept separate from StreakCelebrationOverlay.jsx so the show/hide rules and
// weekly-completion math can be unit tested without rendering anything.

import { getJson, setJson } from '../../lib/storage.js'

export const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function storageKeyFor(date) {
  return `streakCelebrationShown:${toDateKey(date)}`
}

// Monday = 0 ... Sunday = 6
export function getTodayIndex(today = new Date()) {
  return (today.getDay() + 6) % 7
}

// Has the celebration already been shown today?
export function shouldShowStreakCelebration(streakCount, today = new Date()) {
  if (!streakCount || streakCount <= 0) return false
  return getJson(storageKeyFor(today), false) !== true
}

export function markStreakCelebrationShown(today = new Date()) {
  setJson(storageKeyFor(today), true)
}

// 7-length boolean array (Mon..Sun) marking which days of the current week
// fall inside the active streak, assuming the streak is unbroken up to and
// including today.
export function getCompletedWeekDays(streakCount, today = new Date()) {
  const days = new Array(7).fill(false)
  if (!streakCount || streakCount <= 0) return days
  const todayIndex = getTodayIndex(today)
  for (let i = 0; i <= todayIndex; i++) {
    if (todayIndex - i < streakCount) days[i] = true
  }
  return days
}
