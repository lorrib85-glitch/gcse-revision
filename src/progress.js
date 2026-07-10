import { MODULES, isModuleAvailable } from './modules.js'
import { getJson, getObject, getArray, setJson, saveCritical, removeKey } from './lib/storage.js'

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

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
export function offsetDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
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
// - completes a module screen past the hook/intro
// - submits a test question answer
// - finishes a module
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
// Call after any graded question or module section completion.
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
      const olderAvg  = avg(older)
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
// Keyed by moduleId, stored in a shared array.
// Shape: [{ moduleId, subject, title, confidence, timestamp }, ...]

export function getAllConfidenceRatings() {
  return readArr(CONFIDENCE_KEY)
}

// ─── Per-module screen progress ────────────────────────────────────

export function getModuleState(moduleId) {
  return getObject('gcse_module_' + moduleId)
}

// Persist a module's resume state. Critical — screen progress/completion is
// shown to the learner as saved, so a failed write returns false AND surfaces
// the governed save-failure notice via saveCritical.
export function saveModuleState(moduleId, state) {
  return saveCritical('gcse_module_' + moduleId, state)
}

// Percent of a module's screens completed (100 if marked complete).
export function getModulePct(mod) {
  if (!mod || !mod.screenCount) return 0
  const s = getModuleState(mod.id)
  if (s.completed) return 100
  const screen = s.screen || 0
  return Math.min(100, Math.round((screen / mod.screenCount) * 100))
}

// Parent modules — each contains an ordered list of chapter IDs, in app-wide
// priority order. "Chapter" = one entry in MODULES; "Module" = this parent
// grouping. Used by handleChapterComplete (next-chapter routing) and by
// getContinueModule (Subjects tab "Keep going" hero, Home's "Today's plan").
export const MODULE_GROUPS = [
  {
    id: 'hist_medicine',
    title: 'Medicine Through Time',
    subject: 'History',
    chapterIds: ['history-medicine-medieval-beliefs-causes','history-medicine-black-death','history-medicine-renaissance-medicine','history-medicine-surgery-anaesthetics','history-medicine-jenner-vaccination','history-medicine-germ-theory','history-medicine-great-stink','history-medicine-surgery-revolution','history-medicine-accidental-miracle','history-medicine-modern-medicine','history-medicine-cancer'],
  },
  {
    id: 'soc_family',
    title: 'Sociology of the Family',
    subject: 'Sociology',
    chapterIds: ['soc1','soc2','soc3','soc4','soc6'],
  },
  {
    id: 'maths_core',
    title: 'GCSE Maths',
    subject: 'Maths',
    chapterIds: ['math1','math2'],
  },
  {
    id: 'bio_core',
    title: 'GCSE Biology',
    subject: 'Biology',
    chapterIds: ['sci_bio_w1','bio_building_life','bio_human_machine','bio_disease_wars','bio_control_systems','bio_genetics_evolution','bio_ecosystems_group'],
  },
  // No Chemistry group: no Chemistry module has metadata or content yet, so a
  // chem_core group would only hold dangling ids. Add it back alongside the
  // first real Chemistry module (metadata + loader).
]

// The module the "Keep going" hero should resume — the highest-priority
// in-progress module, or if nothing is in progress, the highest-priority
// module the learner hasn't started yet.
export function getContinueModule() {
  // Only ever hand back a module a learner can actually open — an unbuilt
  // stub in a MODULE_GROUP must never become the "Keep going" hero.
  const ordered = MODULE_GROUPS
    .flatMap(g => g.chapterIds)
    .map(id => MODULES.find(m => m.id === id))
    .filter(m => m && isModuleAvailable(m))

  const inProgress = ordered.find(m => { const p = getModulePct(m); return p > 0 && p < 100 })
  if (inProgress) return inProgress

  const unvisited = ordered.find(m => getModulePct(m) === 0)
  if (unvisited) return unvisited

  return ordered[0] || MODULES.find(isModuleAvailable) || MODULES[0]
}

// Like getContinueModule, but returns null unless that module is actually
// in progress (used by Home's "Today's plan" — a not-yet-started module
// isn't a "continue" task).
export function getInProgressModule() {
  const mod = getContinueModule()
  const pct = getModulePct(mod)
  return (pct > 0 && pct < 100) ? mod : null
}

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

// ─── Legacy module ID migration shim ───────────────────────────────
// One-shot storage migration: copies progress from old gcse_module_<legacy>
// keys to new gcse_module_<canonical> keys. Safe to run on every page load:
// - Only copies if old key has data AND new key has no data (no overwrite).
// - Always removes old key once processed (idempotent: second run is a no-op).
// - gcse_confidence is read-only in the current codebase; no migration needed.
const _LEGACY_MODULE_ID_MAP = {
  mod2: 'history-medicine-renaissance-medicine',
  mod3: 'history-medicine-surgery-anaesthetics',
  mod6: 'history-medicine-surgery-revolution',
  mod7: 'history-medicine-accidental-miracle',
  mod8: 'history-medicine-modern-medicine',
  mod9: 'history-medicine-cancer',
}
;(function _migrateLegacyModuleIds() {
  for (const [oldId, newId] of Object.entries(_LEGACY_MODULE_ID_MAP)) {
    const oldKey = 'gcse_module_' + oldId
    const newKey = 'gcse_module_' + newId
    const oldVal = getJson(oldKey, null)
    if (oldVal === null) continue
    if (getJson(newKey, null) === null) setJson(newKey, oldVal)
    removeKey(oldKey)
  }
})()
