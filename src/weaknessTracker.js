// ─── Weakness Tracker ──────────────────────────────────────────────────────────
// Tracks wrong answers by topicTag in localStorage.
// Flags topics where 2+ questions have been answered incorrectly.

const STORAGE_KEY = 'gcse_weakness_log'
const FLAG_THRESHOLD = 2

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function save(log) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)) } catch {}
}

// Call when a student gets a question wrong.
export function logWrongAnswer(topicTags = []) {
  if (!topicTags.length) return
  const log = load()
  topicTags.forEach(tag => { log[tag] = (log[tag] || 0) + 1 })
  save(log)
}

// Returns all topics at or above the flag threshold, sorted by count desc.
export function getWeakTopics(threshold = FLAG_THRESHOLD) {
  const log = load()
  return Object.entries(log)
    .filter(([, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))
}

// Returns the wrong-answer count for a specific tag.
export function getTagCount(tag) {
  return load()[tag] || 0
}

// True if any of the given tags has reached the threshold.
export function isWeakArea(topicTags = [], threshold = FLAG_THRESHOLD) {
  const log = load()
  return topicTags.some(tag => (log[tag] || 0) >= threshold)
}

export function clearWeaknessLog() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}
