const KEY          = 'gcse_progress'
const SESSION_KEY  = 'gcse_session'
const SCORES_KEY   = 'gcse_scores'
const CONFIDENCE_KEY = 'gcse_confidence'

// ─── Read / write ─────────────────────────────────────────────────

function read(k) {
  try { return JSON.parse(localStorage.getItem(k) || '{}') } catch { return {} }
}
function readArr(k) {
  try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] }
}
function write(k, d) {
  try { localStorage.setItem(k, JSON.stringify(d)) } catch {}
}

// ─── Date helpers ─────────────────────────────────────────────────

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
export function offsetDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
export function daysUntil(iso) {
  if (!iso) return 0
  return Math.max(0, Math.round((new Date(iso) - new Date(todayStr())) / 86400000))
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

// ─── Completed-session progress (legacy + module completion) ──────

export function saveSessionResult({ topicId, score, total }) {
  const data      = getProgress()
  const today     = todayStr()

  // Delegate streak update to recordActivity
  recordActivity()

  // Spaced repetition interval
  const prev         = data.topicProgress[topicId] || { completedSessions: 0 }
  const sessions     = (prev.completedSessions || 0) + 1
  const intervalDays = Math.min(3 * Math.pow(2, sessions - 1), 60)

  data.topicProgress[topicId] = {
    completedSessions: sessions,
    lastScore:         total > 0 ? score / total : 0,
    nextReviewDate:    offsetDate(intervalDays),
  }
  data.history = [{ date: today, topicId, score, total }, ...(data.history || [])].slice(0, 30)

  write(KEY, data)
  clearSessionDraft()
  return getProgress()  // return fresh copy after recordActivity may have written too
}

// ─── In-progress session draft ────────────────────────────────────

export function saveSessionDraft({ topicId, phase, results }) {
  write(SESSION_KEY, { topicId, phase, results, savedAt: new Date().toISOString() })
}

export function getSessionDraft() {
  const d = read(SESSION_KEY)
  if (!d.topicId) return null
  if (d.savedAt) {
    const age = Date.now() - new Date(d.savedAt).getTime()
    if (age > 24 * 60 * 60 * 1000) { clearSessionDraft(); return null }
  }
  return d
}

export function clearSessionDraft() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

// ─── Confidence ratings ───────────────────────────────────────────
// Keyed by moduleId, stored in a shared array.
// Shape: [{ moduleId, subject, title, confidence, timestamp }, ...]

export function getAllConfidenceRatings() {
  return readArr(CONFIDENCE_KEY)
}

// ─── Topic routing ────────────────────────────────────────────────

export function getNextTopicId(topicIds) {
  const { topicProgress } = getProgress()
  const today = todayStr()
  const overdue = topicIds.find(id => topicProgress[id]?.nextReviewDate <= today)
  if (overdue) return overdue
  const unseen = topicIds.find(id => !topicProgress[id])
  return unseen || topicIds[0]
}
