// ─── Quick Fire round queue selection ────────────────────────────────────────
//
// Pure selection logic for the 90s Quick Fire round, extracted from
// QuickFireMode.jsx so it is unit-testable. QuickFireMode reads the stored
// round memory and per-question history and passes plain data in; nothing
// here touches storage or the DOM.
//
// The queue is built in four steps:
//   1. Dedupe by qfQuestionId — a question id appears at most once per round.
//   2. Seeded Fisher–Yates shuffle keyed on the local date, so the same
//      user/day always produces the same starting queue (the daily warm-up
//      framing on Home is truthful), while a new day reshuffles.
//   3. Score every question with the weakness signals (subject accuracy,
//      topic accuracy, module confidence, last-result boost/penalty). A
//      question answered correctly within RECENT_CORRECT_WINDOW_MS takes the
//      stronger RECENT_CORRECT_PENALTY instead of CORRECT_PENALTY, so a
//      second round the same day doesn't re-serve this morning's wins.
//   4. Stable sort by score descending — the seeded shuffle breaks ties.

import { qfQuestionId } from './questionId.js'

export const RECENT_CORRECT_WINDOW_MS = 24 * 60 * 60 * 1000
const RECENT_CORRECT_PENALTY = -3.0
const CORRECT_PENALTY = -1.0
const WRONG_BOOST = 3.5

// Local-timezone date key ("2026-07-05") — the daily shuffle seed.
export function localDateKey(d = new Date()) {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

// FNV-1a 32-bit string hash → seed for the PRNG.
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 — tiny deterministic PRNG, good enough for shuffling a quiz.
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(arr, seedStr) {
  const rng = mulberry32(hashString(seedStr))
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dedupeById(questions) {
  const seen = new Set()
  return questions.filter(q => {
    const id = qfQuestionId(q)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function bucketAccuracy(bucket) {
  return bucket?.answered ? Math.round((bucket.correct / bucket.answered) * 100) : 0
}

function confidencePriority(confidenceRatings, moduleId) {
  if (!moduleId) return 0
  const rating = confidenceRatings.find(item => item.moduleId === moduleId)
  if (!rating) return 0
  if (rating.confidence === 'confused') return 4
  if (rating.confidence === 'clicking') return 2
  return 0
}

export function scoreQuestion(question, { memory, questionHistory, confidenceRatings, now }) {
  const hist = questionHistory[qfQuestionId(question)]
  const subjectBucket = memory.subjects?.[question.subject]
  const topicBucket = memory.topics?.[question.subject + '::' + question.topic]
  const subjectWeakness = subjectBucket?.answered ? Math.max(0, 70 - bucketAccuracy(subjectBucket)) / 10 : 0
  const topicWeakness = topicBucket?.answered ? Math.max(0, 75 - bucketAccuracy(topicBucket)) / 8 : 0
  const confidenceBoost = confidencePriority(confidenceRatings, question.moduleId)
  const wrongBoost = hist?.lastResult === 'incorrect' ? WRONG_BOOST : 0
  const recentlyCorrect = hist?.lastAt != null && now - hist.lastAt < RECENT_CORRECT_WINDOW_MS
  const correctPenalty = hist?.lastResult === 'correct'
    ? (recentlyCorrect ? RECENT_CORRECT_PENALTY : CORRECT_PENALTY)
    : 0
  return subjectWeakness + topicWeakness + confidenceBoost + wrongBoost + correctPenalty
}

export function selectQuickFireQueue({
  questions,
  memory = { subjects: {}, topics: {} },
  questionHistory = {},
  confidenceRatings = [],
  dateKey = localDateKey(),
  now = Date.now(),
}) {
  const context = { memory, questionHistory, confidenceRatings, now }
  return seededShuffle(dedupeById(questions), dateKey)
    .map(question => ({ question, score: scoreQuestion(question, context) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.question)
}
