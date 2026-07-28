import { CHAPTERS, isChapterAvailable } from './chapters.js'
import { MODULES } from './data/modules.js'
import { getJson, getObject, getArray, setJson, saveCritical, removeKey } from './lib/storage.js'
import {
  chapterProgressKey,
  chapterProgressSourceKeys,
  mergeChapterState,
} from './data/chapterProgress.js'

// Temporary compatibility export. Parent modules are now canonically owned by
// src/data/modules.js; existing callers may continue importing MODULE_GROUPS
// until the final migration phase.
export const MODULE_GROUPS = MODULES

const KEY          = 'gcse_progress'
const SCORES_KEY   = 'gcse_scores'
const CONFIDENCE_KEY = 'gcse_confidence'

// ─── Read / write ─────────────────────────────────────────────────

const read    = getObject
const readArr = getArray
// Progress, streaks and scores are shown to the learner as done, so they
// persist through saveCritical — a failed write surfaces the governed
// save-failure notice instead of silently appearing saved.
const write   = saveCritical

// ─── Date helpers ─────────────────────────────────────────────────

// Local calendar date, never toISOString() — that's UTC, which during BST
// stamps 00:00–00:59 activity onto the previous day and breaks the streak.
function localDateStr(d) {
  const m   = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function todayStr() {
  return localDateStr(new Date())
}
export function offsetDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return localDateStr(d)
}

// ─── Core progress store ───────────────────────────────────────────

export function getProgress() {
  return {
    streak: 0,
    lastActivityDate: null,
    lastSessionDate: null,   // kept for backward compat
    topicProgress: {},
    history: [],
    bestStreak: 0,
    ...read(KEY)
  }
}

// ─── Activity & streak ─────────────────────────────────────────────
// Call this any time the user does something meaningful:
// - completes a chapter screen past the hook/intro
// - submits a test question answer
// - finishes a chapter
// It updates the streak regardless of which feature they used.

export function recordActivity() {
  const data      = getProgress()
  const today     = todayStr()
  const yesterday = offsetDate(-1)

  if (data.lastActivityDate === today) {
    // Already recorded today — no streak change needed, just persist
    return data
  }

  if (data.lastActivityDate === yesterday) {
    data.streak = (data.streak || 0) + 1
  } else {
    // Gap of more than one day — reset to 1
    data.streak = 1
  }

  data.lastActivityDate = today
  data.lastSessionDate  = today   // keep in sync for any legacy reads
  if ((data.streak || 0) > (data.bestStreak || 0)) data.bestStreak = data.streak

  write(KEY, data)
  return data
}

// ─── Score recording ───────────────────────────────────────────────
// Call after any graded question or chapter section completion.
// subject: e.g. 'Biology', 'History', 'Maths'
// earned:  marks/points awarded
// possible: total marks/points available

export function recordScore({ subject, earned, possible, source }) {
  if (!subject || possible === undefined || possible <= 0) return
  recordActivity()  // every scored answer also counts as activity

  const pct     = Math.round((earned / possible) * 100)
  const today   = todayStr()
  const entry   = { date: today, subject, earned, possible, pct, source: source || 'unknown' }

  const scores  = readArr(SCORES_KEY)
  scores.unshift(entry)
  // Keep last 200 entries — enough for meaningful improvement calculations
  write(SCORES_KEY, scores.slice(0, 200))
}

// ─── Improvement calculation ───────────────────────────────────────
// Returns subjects with improvement % compared to their older average.
// "This week" = last 7 days vs the 7 days before that.

export function getImprovements() {
  const scores  = readArr(SCORES_KEY)
  const today   = new Date(todayStr())

  function daysAgo(n) {
    const d = new Date(today)
    d.setDate(d.getDate() - n)
    return d.toISOString().slice(0, 10)
  }

  const recentCutoff = daysAgo(7)
  const olderCutoff  = daysAgo(14)

  // Group by subject
  const subjects = {}
  scores.forEach(s => {
    if (!subjects[s.subject]) subjects[s.subject] = { recent: [], older: [] }
    if (s.date >= recentCutoff) {
      subjects[s.subject].recent.push(s.pct)
    } else if (s.date >= olderCutoff) {
      subjects[s.subject].older.push(s.pct)
    }
  })

  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null

  return Object.entries(subjects)
    .map(([subject, { recent, older }]) => {
      const recentAvg = avg(recent)
      const olderAvg = avg(older)
      if (recentAvg === null || recent.length < 2) return null
      const improvement = olderAvg !== null ? recentAvg - olderAvg : null
      return { subject, recentAvg, olderAvg, improvement, attempts: recent.length }
    })
    .filter(Boolean)
    .filter(s => s.improvement !== null)
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, 3)
}

// Raw score log — exposed so same-day derived state (e.g. Home's "done
// today" plan-card check) can read it without a new storage key.
export function getScores() {
  return readArr(SCORES_KEY)
}

// ─── Confidence ratings ───────────────────────────────────────────
// Keyed by the current legacy moduleId field, stored in a shared array.
// Phase 3 migrates this terminology alongside chapter persistence.

export function getAllConfidenceRatings() {
  return readArr(CONFIDENCE_KEY)
}

// ─── Per-chapter screen progress ───────────────────────────────────
// Canonical state lives under gcse_chapter_<id>. Reads fold any older
// gcse_module_<id> or legacy-id copies forward without losing monotonic state.

function readChapterSources(chapterId) {
  const canonicalKey = chapterProgressKey(chapterId)
  const found = []
  let state = null

  for (const key of chapterProgressSourceKeys(chapterId)) {
    const value = getJson(key, undefined)
    if (value === undefined) continue
    found.push(key)
    // The canonical copy is read first and remains primary for unknown fields.
    state = mergeChapterState(state, value)
  }

  return { canonicalKey, found, state: state || {} }
}

function removeMigratedChapterSources(canonicalKey, sourceKeys) {
  for (const key of sourceKeys) {
    if (key !== canonicalKey) removeKey(key)
  }
}

export function getChapterState(chapterId) {
  const { canonicalKey, found, state } = readChapterSources(chapterId)
  const needsMigration = found.some(key => key !== canonicalKey)

  if (needsMigration) {
    const migrated = setJson(canonicalKey, state)
    if (migrated) removeMigratedChapterSources(canonicalKey, found)
  }

  return state
}

export function saveChapterState(chapterId, state) {
  const { canonicalKey, found } = readChapterSources(chapterId)
  // Do not merge the existing canonical copy into a normal save: reviewing a
  // completed chapter may deliberately move its resume screen backwards while
  // retaining completed: true. Only fold still-unmigrated fallback copies in.
  const fallbackKeys = found.filter(key => key !== canonicalKey)
  let nextState = state
  for (const key of fallbackKeys) {
    nextState = mergeChapterState(nextState, getJson(key, undefined))
  }

  const saved = saveCritical(canonicalKey, nextState)
  if (saved) removeMigratedChapterSources(canonicalKey, fallbackKeys)
  return saved
}

export function getChapterPct(chapter) {
  if (!chapter || !chapter.screenCount) return 0
  const state = getChapterState(chapter.id)
  if (state.completed) return 100
  const screen = state.screen || 0
  return Math.min(100, Math.round((screen / chapter.screenCount) * 100))
}

// Temporary compatibility aliases. They execute the canonical chapter-key
// implementation, so even untouched Phase 4 runtime callers now write only
// gcse_chapter_* keys.
export const getModuleState = getChapterState
export const saveModuleState = saveChapterState
export const getModulePct = getChapterPct

// ─── Chapter discovery ─────────────────────────────────────────────
// The canonical parent-module catalogue determines chapter order. Progress
// percentage still uses its legacy function name until Phase 3.

export function getContinueChapter() {
  const ordered = MODULES
    .flatMap(module => module.chapterIds)
    .map(id => CHAPTERS.find(chapter => chapter.id === id))
    .filter(chapter => chapter && isChapterAvailable(chapter))

  const inProgress = ordered.find(chapter => {
    const pct = getChapterPct(chapter)
    return pct > 0 && pct < 100
  })
  if (inProgress) return inProgress

  const unvisited = ordered.find(chapter => getChapterPct(chapter) === 0)
  if (unvisited) return unvisited

  return ordered[0] || CHAPTERS.find(isChapterAvailable) || CHAPTERS[0]
}

export function getInProgressChapter() {
  const chapter = getContinueChapter()
  const pct = getChapterPct(chapter)
  return (pct > 0 && pct < 100) ? chapter : null
}

// Temporary compatibility aliases for existing runtime callers.
export const getContinueModule = getContinueChapter
export const getInProgressModule = getInProgressChapter

// ─── Weekly recall trend ────────────────────────────────────────────
// Shared by PulseTab and Home's "this week" line.

export function getWeeklyTrend() {
  const scores = readArr(SCORES_KEY)
  const cutoff = days => { const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString().slice(0, 10) }
  const week = scores.filter(s => s.date > cutoff(7))
  const prevWeek = scores.filter(s => s.date > cutoff(14) && s.date <= cutoff(7))
  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b.pct, 0) / arr.length) : null
  const byDay = {}
  week.forEach(s => { (byDay[s.date] = byDay[s.date] || []).push(s.pct) })
  const points = Object.keys(byDay).sort()
    .map(d => Math.round(byDay[d].reduce((a, b) => a + b, 0) / byDay[d].length))
  const thisAvg = avg(week)
  const prevAvg = avg(prevWeek)
  let trendNote = 'Play one round to start tracking your memory.'
  if (thisAvg != null && prevAvg != null) {
    const delta = thisAvg - prevAvg
    trendNote = delta === 0 ? 'Holding steady on last week.'
      : delta > 0 ? "You're remembering more than last week."
      : 'Slightly down on last week. One round can fix that.'
  } else if (thisAvg != null) {
    trendNote = 'Your average score this week.'
  }
  return { thisAvg, prevAvg, points, trendNote }
}

