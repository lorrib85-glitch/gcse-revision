const KEY          = 'gcse_progress'
const SESSION_KEY  = 'gcse_session'

// ─── Read / write ─────────────────────────────────────────────────

function read(k) {
  try { return JSON.parse(localStorage.getItem(k) || '{}') } catch { return {} }
}
function write(k, d) {
  try { localStorage.setItem(k, JSON.stringify(d)) } catch {}
}

// ─── Completed-session progress ───────────────────────────────────

export function getProgress() {
  return { streak: 0, lastSessionDate: null, topicProgress: {}, history: [], ...read(KEY) }
}

export function saveSessionResult({ topicId, score, total }) {
  const data      = getProgress()
  const today     = todayStr()
  const yesterday = offsetDate(-1)

  // Streak
  if (data.lastSessionDate === yesterday) data.streak = (data.streak || 0) + 1
  else if (data.lastSessionDate !== today) data.streak = 1
  data.lastSessionDate = today
  if ((data.streak || 0) > (data.bestStreak || 0)) data.bestStreak = data.streak

  // Spaced repetition interval
  const prev        = data.topicProgress[topicId] || { completedSessions: 0 }
  const sessions    = (prev.completedSessions || 0) + 1
  const intervalDays = Math.min(3 * Math.pow(2, sessions - 1), 60)

  data.topicProgress[topicId] = {
    completedSessions: sessions,
    lastScore:         total > 0 ? score / total : 0,
    nextReviewDate:    offsetDate(intervalDays),
  }
  data.history = [{ date: today, topicId, score, total }, ...(data.history || [])].slice(0, 30)

  write(KEY, data)
  clearSessionDraft()   // session is done — clear the draft
  return data
}

// ─── In-progress session draft ────────────────────────────────────
// Saved as soon as the warm-up starts, updated after each phase.
// Cleared when the session completes or the user taps "exit".

export function saveSessionDraft({ topicId, phase, results }) {
  write(SESSION_KEY, { topicId, phase, results, savedAt: new Date().toISOString() })
}

export function getSessionDraft() {
  const d = read(SESSION_KEY)
  if (!d.topicId) return null
  // Discard drafts older than 24 hours
  if (d.savedAt) {
    const age = Date.now() - new Date(d.savedAt).getTime()
    if (age > 24 * 60 * 60 * 1000) { clearSessionDraft(); return null }
  }
  return d
}

export function clearSessionDraft() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
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
