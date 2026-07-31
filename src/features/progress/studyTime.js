// ─── Study time ─────────────────────────────────────────────────────────────
//
// The "time invested" figure on the Progress tab.
//
// This is real elapsed time, not an estimate. Seconds are added in small ticks
// by useStudyClock while a learning surface is actually open and visible, and
// are keyed by local calendar date. Nothing is ever back-filled: study done
// before this shipped counts as zero, because we genuinely don't know it.
//
// Shape in storage: { 'YYYY-MM-DD': seconds } — a flat map, so a cross-device
// merge can take the larger value per day (see progressMerge.js). One entry per
// calendar day means the record is self-bounding; it needs no pruning.

import { getObject, saveCritical } from '../../lib/storage.js'
import { todayStr } from '../../progress.js'

export const STUDY_TIME_KEY = 'gcse_study_time_v1'

// Sanity bound on one call. Study time is learner-facing, so a nonsense value
// is dropped rather than silently inflating the total.
const MAX_TICK_SECONDS = 300

export function readStudyTime() {
  const byDate = getObject(STUDY_TIME_KEY)
  const dates = Object.keys(byDate)
  return {
    totalSeconds: dates.reduce((sum, date) => sum + secondsOf(byDate[date]), 0),
    daysStudied: dates.filter(date => secondsOf(byDate[date]) > 0).length,
  }
}

export function addStudySeconds(seconds) {
  const delta = Math.round(Number(seconds))
  if (!Number.isFinite(delta) || delta <= 0 || delta > MAX_TICK_SECONDS) return

  const today = todayStr()
  const byDate = getObject(STUDY_TIME_KEY)
  byDate[today] = secondsOf(byDate[today]) + delta

  saveCritical(STUDY_TIME_KEY, byDate)
}

// '0m' | '47m' | '4h 7m' — deliberately coarse. The learner is looking at
// effort accumulated, not at a stopwatch.
export function formatStudyTime(seconds) {
  const total = Math.max(0, Math.floor(secondsOf(seconds) / 60))
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function secondsOf(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}
