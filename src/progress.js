const KEY = 'gcse_progress'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function write(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {}
}

export function getProgress() {
  return { streak: 0, lastSessionDate: null, topicProgress: {}, history: [], ...read() }
}

export function saveSessionResult({ topicId, score, total }) {
  const data = getProgress()
  const today = todayStr()
  const yesterday = offsetDate(-1)

  if (data.lastSessionDate === yesterday) data.streak = (data.streak || 0) + 1
  else if (data.lastSessionDate !== today) data.streak = 1
  data.lastSessionDate = today

  const prev = data.topicProgress[topicId] || { completedSessions: 0 }
  const sessions = (prev.completedSessions || 0) + 1
  const intervalDays = Math.min(3 * Math.pow(2, sessions - 1), 60)

  data.topicProgress[topicId] = {
    completedSessions: sessions,
    lastScore: total > 0 ? score / total : 0,
    nextReviewDate: offsetDate(intervalDays),
  }
  data.history = [{ date: today, topicId, score, total }, ...(data.history || [])].slice(0, 30)
  write(data)
  return data
}

export function getNextTopicId(topicIds) {
  const { topicProgress } = getProgress()
  const today = todayStr()
  const overdue = topicIds.find(id => topicProgress[id]?.nextReviewDate <= today)
  if (overdue) return overdue
  const unseen = topicIds.find(id => !topicProgress[id])
  return unseen || topicIds[0]
}

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
