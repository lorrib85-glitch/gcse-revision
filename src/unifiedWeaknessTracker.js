// ─── Unified Weakness Tracker ─────────────────────────────────────────────────
// Core personalization system: tracks every wrong answer across modules, exams, quizzes.
// Single source of truth for weakness identification and recovery recommendations.

const WRONG_ANSWERS_KEY = 'gcse_wrong_answers'
const CORRECT_ANSWERS_KEY = 'gcse_correct_answers'
const WEAK_THRESHOLD = 2  // Flag topic as weak after 2+ wrong answers

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadWrongAnswers() {
  try { return JSON.parse(localStorage.getItem(WRONG_ANSWERS_KEY) || '[]') } catch { return [] }
}
function saveWrongAnswers(data) {
  try { localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(data)) } catch {}
}

function loadCorrectAnswers() {
  try { return JSON.parse(localStorage.getItem(CORRECT_ANSWERS_KEY) || '[]') } catch { return [] }
}
function saveCorrectAnswers(data) {
  try { localStorage.setItem(CORRECT_ANSWERS_KEY, JSON.stringify(data)) } catch {}
}

// ─── Logging API ──────────────────────────────────────────────────────────────

/**
 * Log a wrong answer. Called when a student gets a question incorrect.
 *
 * @param {Object} metadata - { subject, topic, questionId, questionText, marks, source, questionType }
 *   source: 'module' | 'exam' | 'quiz'
 *   questionType: 'mcq' | 'written' | 'connection' | 'truefalse' | etc.
 *   marks: number of marks available on this question
 */
export function logWrongAnswer(metadata = {}) {
  const { subject, topic } = metadata
  if (!subject || !topic) return

  const log = loadWrongAnswers()
  const entry = {
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    subject,
    topic,
    questionId: metadata.questionId || `${topic}-${Date.now()}`,
    questionText: metadata.questionText || '',
    marks: metadata.marks || 1,
    source: metadata.source || 'unknown',
    questionType: metadata.questionType || 'unknown',
  }

  log.unshift(entry)
  // Keep last 500 wrong answers for detailed analysis
  saveWrongAnswers(log.slice(0, 500))
}

/**
 * Log a correct answer. Called when a student answers correctly.
 * Helps us track mastery and avoid repeatedly recommending solved topics.
 */
export function logCorrectAnswer(metadata = {}) {
  const { subject, topic } = metadata
  if (!subject || !topic) return

  const log = loadCorrectAnswers()
  const entry = {
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    subject,
    topic,
    questionId: metadata.questionId || `${topic}-${Date.now()}`,
    source: metadata.source || 'unknown',
  }

  log.unshift(entry)
  saveCorrectAnswers(log.slice(0, 500))
}

// ─── Weakness Analysis ────────────────────────────────────────────────────────

/**
 * Get all weak topics across the entire site.
 * Returns topics with >= threshold wrong answers, sorted by severity.
 */
export function getWeakTopics(threshold = WEAK_THRESHOLD) {
  const wrongAnswers = loadWrongAnswers()
  const correctAnswers = loadCorrectAnswers()

  // Count wrong answers per topic
  const topicCounts = {}
  wrongAnswers.forEach(entry => {
    const key = `${entry.subject}/${entry.topic}`
    topicCounts[key] = (topicCounts[key] || 0) + 1
  })

  // Count correct answers per topic (for mastery filtering)
  const correctCounts = {}
  correctAnswers.forEach(entry => {
    const key = `${entry.subject}/${entry.topic}`
    correctCounts[key] = (correctCounts[key] || 0) + 1
  })

  // Flag topics as weak, exclude those with high correct rate
  const weakTopics = Object.entries(topicCounts)
    .map(([key, wrongCount]) => {
      const [subject, topic] = key.split('/')
      const correctCount = correctCounts[key] || 0
      const totalAttempts = wrongCount + correctCount
      const errorRate = wrongCount / Math.max(1, totalAttempts)

      return {
        subject,
        topic,
        wrongCount,
        correctCount,
        totalAttempts,
        errorRate,
        mastered: errorRate < 0.2 && totalAttempts >= 3,
      }
    })
    .filter(t => !t.mastered && t.wrongCount >= threshold)
    .sort((a, b) => b.wrongCount - a.wrongCount)

  return weakTopics
}

/**
 * Get weak areas organized by subject.
 * Returns structure: { [subject]: [topics], ... }
 */
export function getWeakAreasBySubject() {
  const weakTopics = getWeakTopics()
  const bySubject = {}

  weakTopics.forEach(t => {
    if (!bySubject[t.subject]) bySubject[t.subject] = []
    bySubject[t.subject].push(t.topic)
  })

  return bySubject
}

/**
 * Get detailed statistics for a specific topic.
 */
export function getTopicStatistics(subject, topic) {
  const wrongAnswers = loadWrongAnswers()
  const correctAnswers = loadCorrectAnswers()
  const topicWrongs = wrongAnswers.filter(a => a.subject === subject && a.topic === topic)
  const topicCorrects = correctAnswers.filter(a => a.subject === subject && a.topic === topic)

  return {
    subject,
    topic,
    wrongCount: topicWrongs.length,
    correctCount: topicCorrects.length,
    totalAttempts: topicWrongs.length + topicCorrects.length,
    errorRate: topicWrongs.length / Math.max(1, topicWrongs.length + topicCorrects.length),
    lastWrongDate: topicWrongs[0]?.date || null,
    lastCorrectDate: topicCorrects[0]?.date || null,
    bySource: {
      module: topicWrongs.filter(a => a.source === 'module').length,
      exam: topicWrongs.filter(a => a.source === 'exam').length,
      quiz: topicWrongs.filter(a => a.source === 'quiz').length,
    },
  }
}

/**
 * Get recovery quiz recommendations.
 * Returns weak topics sorted by priority (recent failures first, highest error rate).
 */
export function getRecoveryRecommendations(limit = 5) {
  const weakTopics = getWeakTopics()

  // Prioritize by:
  // 1. Recency (recent failures matter more)
  // 2. Frequency (more wrong answers = more urgent)
  // 3. Error rate (consistent failures matter more than sporadic)
  return weakTopics
    .map(t => {
      const wrongAnswers = loadWrongAnswers()
      const recentWrongs = wrongAnswers.filter(a => a.subject === t.subject && a.topic === t.topic)
      const lastFailDaysAgo = recentWrongs[0] ? Math.max(0,
        Math.floor((Date.now() - recentWrongs[0].timestamp) / 86400000)
      ) : 999

      // Recency boost: topics failed in last 3 days are urgent
      const recencyScore = lastFailDaysAgo <= 3 ? 10 : (lastFailDaysAgo <= 7 ? 5 : 1)

      return {
        ...t,
        priority: (t.wrongCount * recencyScore) + t.errorRate,
        lastFailedDaysAgo: lastFailDaysAgo,
      }
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}

/**
 * Check if a topic is currently considered weak.
 */
export function isWeakArea(subject, topic, threshold = WEAK_THRESHOLD) {
  const weakTopics = getWeakTopics(threshold)
  return weakTopics.some(t => t.subject === subject && t.topic === topic)
}

/**
 * Get the weakest subject by total wrong answers.
 */
export function getWeakestSubject() {
  const wrongAnswers = loadWrongAnswers()
  const subjectCounts = {}

  wrongAnswers.forEach(a => {
    subjectCounts[a.subject] = (subjectCounts[a.subject] || 0) + 1
  })

  if (!Object.keys(subjectCounts).length) return null

  const [subject, count] = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1])[0]

  return { subject, wrongCount: count }
}

/**
 * Get summary statistics across the entire site.
 */
export function getWeaknessSummary() {
  const wrongAnswers = loadWrongAnswers()
  const correctAnswers = loadCorrectAnswers()
  const weakTopics = getWeakTopics()

  return {
    totalWrongAnswers: wrongAnswers.length,
    totalCorrectAnswers: correctAnswers.length,
    totalAttempts: wrongAnswers.length + correctAnswers.length,
    overallErrorRate: wrongAnswers.length / Math.max(1, wrongAnswers.length + correctAnswers.length),
    weakTopicsCount: weakTopics.length,
    weakTopics: weakTopics.slice(0, 10),
    lastActivityDate: wrongAnswers[0]?.date || null,
  }
}

/**
 * Clear all weakness tracking data (for testing or user reset).
 */
export function clearWeaknessLog() {
  try {
    localStorage.removeItem(WRONG_ANSWERS_KEY)
    localStorage.removeItem(CORRECT_ANSWERS_KEY)
  } catch {}
}

// ─── Legacy compatibility ─────────────────────────────────────────────────────
// Maintain API compatibility with old weaknessTracker.js

export function logWrongAnswerLegacy(topicTags = []) {
  topicTags.forEach(tag => {
    logWrongAnswer({ subject: 'Unknown', topic: tag })
  })
}

export function getWeakTopicsLegacy(threshold = WEAK_THRESHOLD) {
  const weak = getWeakTopics(threshold)
  return weak.map(t => ({ tag: `${t.subject}/${t.topic}`, count: t.wrongCount }))
}
