// ─── Unified Weakness Tracker ─────────────────────────────────────────────────
// Core personalization system: tracks every wrong answer across modules, exams, quizzes.
// Single source of truth for weakness identification and recovery recommendations.

import { TAG_MODULE_MAP } from './data/tagModuleMap.js'

const WRONG_ANSWERS_KEY = 'gcse_wrong_answers'
const CORRECT_ANSWERS_KEY = 'gcse_correct_answers'
const EXAM_TECHNIQUE_KEY = 'gcse_exam_techniques'
const COACH_TYPE_RESULTS_KEY = 'gcse_coach_type_results'
const WEAK_THRESHOLD = 2  // Flag topic as weak after 2+ wrong answers
const TECHNIQUE_PATTERN_THRESHOLD = 2  // Flag a technique pattern as recurring after 2+ occurrences
const COACH_TYPE_WEAK_THRESHOLD = 0.6  // Suggest a question type when scoring below 60%

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

function loadExamTechniques() {
  try { return JSON.parse(localStorage.getItem(EXAM_TECHNIQUE_KEY) || '[]') } catch { return [] }
}
function saveExamTechniques(data) {
  try { localStorage.setItem(EXAM_TECHNIQUE_KEY, JSON.stringify(data)) } catch {}
}

function loadCoachTypeResults() {
  try { return JSON.parse(localStorage.getItem(COACH_TYPE_RESULTS_KEY) || '[]') } catch { return [] }
}
function saveCoachTypeResults(data) {
  try { localStorage.setItem(COACH_TYPE_RESULTS_KEY, JSON.stringify(data)) } catch {}
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

  const lastWrongDate = topicWrongs[0]?.date || null
  const lastCorrectDate = topicCorrects[0]?.date || null
  const lastAttemptDate = [lastWrongDate, lastCorrectDate].filter(Boolean).sort().pop() || null
  const daysSinceLastAttempt = lastAttemptDate
    ? Math.max(0, Math.floor((Date.now() - new Date(lastAttemptDate).getTime()) / 86400000))
    : null

  // Last 6 attempts on this topic (correct + wrong combined), most recent first
  const recentSix = [
    ...topicWrongs.map(a => ({ timestamp: a.timestamp, correct: false })),
    ...topicCorrects.map(a => ({ timestamp: a.timestamp, correct: true })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)
  const recentIncorrectCount = recentSix.filter(a => !a.correct).length

  // Marks lost across the most recent wrong answers on this topic
  const marksAtStake = topicWrongs.slice(0, 10).reduce((sum, a) => sum + (a.marks || 0), 0)

  return {
    subject,
    topic,
    wrongCount: topicWrongs.length,
    correctCount: topicCorrects.length,
    totalAttempts: topicWrongs.length + topicCorrects.length,
    errorRate: topicWrongs.length / Math.max(1, topicWrongs.length + topicCorrects.length),
    lastWrongDate,
    lastCorrectDate,
    lastAttemptDate,
    daysSinceLastAttempt,
    recentSix,
    recentIncorrectCount,
    marksAtStake,
    bySource: {
      module: topicWrongs.filter(a => a.source === 'module').length,
      exam: topicWrongs.filter(a => a.source === 'exam').length,
      quiz: topicWrongs.filter(a => a.source === 'quiz').length,
    },
  }
}

/**
 * Humanise a topic slug into a sentence-case label, e.g. "black-death" -> "Black death".
 */
function humanizeTopic(topic) {
  const words = topic.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * Build the personalised "Biggest win" reason line for a topic, varying by
 * whichever evidence is most relevant: a recent run of wrong answers, time
 * since last revision, near-mastery, marks at stake, or overall average.
 */
function buildBiggestWinReason(stats) {
  const { recentSix, recentIncorrectCount, daysSinceLastAttempt, errorRate, totalAttempts, marksAtStake } = stats

  if (recentSix.length >= 4 && recentIncorrectCount >= Math.ceil(recentSix.length / 2)) {
    return `${recentIncorrectCount} of your last ${recentSix.length} answers were incorrect.`
  }
  if (daysSinceLastAttempt !== null && daysSinceLastAttempt >= 21) {
    const weeks = Math.round(daysSinceLastAttempt / 7)
    return `Last attempted ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago.`
  }
  if (daysSinceLastAttempt !== null && daysSinceLastAttempt >= 10) {
    return `You haven't revised this for ${daysSinceLastAttempt} days.`
  }
  if (errorRate >= 0.2 && errorRate < 0.4 && totalAttempts >= 3) {
    return `You're one step away from mastering this topic.`
  }
  if (marksAtStake > 0) {
    return `Estimated gain: +${marksAtStake} mark${marksAtStake === 1 ? '' : 's'}.`
  }
  return `Average score: ${Math.round((1 - errorRate) * 100)}%.`
}

/**
 * Pick the single highest-priority weak topic for the "Biggest win" card,
 * with a reason line tailored to the evidence available for that topic.
 * Returns null if no topic currently qualifies (don't fabricate one).
 */
export function getBiggestWin() {
  const wrongAnswers = loadWrongAnswers()
  if (!wrongAnswers.length) return null

  // Primary: topics that have already crossed the standard weak-topic bar.
  let pool = getWeakTopics().filter(t => TAG_MODULE_MAP[t.topic])

  // Fallback: nothing has crossed that bar yet — point to the most recently
  // missed topic with a real module mapping, so a learner who has only just
  // started still gets an evidence-based pointer.
  if (!pool.length) {
    const seen = new Set()
    pool = wrongAnswers
      .filter(a => {
        const key = `${a.subject}/${a.topic}`
        if (!TAG_MODULE_MAP[a.topic] || seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map(a => getTopicStatistics(a.subject, a.topic))
  }

  const candidates = pool
    .map(t => {
      const lastWrong = wrongAnswers.find(a => a.subject === t.subject && a.topic === t.topic)
      return { ...t, lastFailedAt: lastWrong?.timestamp || 0 }
    })
    .sort((a, b) => b.errorRate - a.errorRate || b.lastFailedAt - a.lastFailedAt)

  const top = candidates[0]
  if (!top) return null

  const stats = getTopicStatistics(top.subject, top.topic)

  return {
    subject: top.subject,
    topic: top.topic,
    label: humanizeTopic(top.topic),
    reasonText: buildBiggestWinReason(stats),
    moduleId: TAG_MODULE_MAP[top.topic],
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

// ─── Exam Technique Tracking ──────────────────────────────────────────────────
// Separate from topic/content weaknesses: tracks meta-level patterns about HOW a
// student approaches written exam questions (e.g. "names a method but never
// explains how it works"), independent of whether the underlying knowledge is right.

/**
 * Log an exam-technique pattern. Called when AI marking detects a recurring
 * approach issue in a student's written answer (e.g. missing examples, vague language).
 *
 * @param {Object} metadata - { subject, type, evidence, suggestion, questionId, source }
 *   type: a fixed taxonomy key, e.g. 'missingExample' | 'noNamedMechanism' |
 *         'onlyOneIdeaDeveloped' | 'vagueLanguage' | 'repeatsQuestion' | 'noSpecificDetail'
 *   evidence: short quote/description of where the pattern showed up
 *   suggestion: concrete next-time action tied to this pattern
 *   source: 'module' | 'exam' | 'quiz'
 */
export function logExamTechnique(metadata = {}) {
  const { subject, type } = metadata
  if (!subject || !type) return

  const log = loadExamTechniques()
  const entry = {
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    subject,
    type,
    evidence: metadata.evidence || '',
    suggestion: metadata.suggestion || '',
    questionId: metadata.questionId || `${type}-${Date.now()}`,
    source: metadata.source || 'unknown',
  }

  log.unshift(entry)
  // Keep last 500 technique observations for pattern analysis
  saveExamTechniques(log.slice(0, 500))
}

/**
 * Aggregate logged technique observations into recurring patterns.
 * Returns entries with count >= threshold, sorted by frequency (most persistent first).
 */
export function getExamTechniquePatterns(threshold = TECHNIQUE_PATTERN_THRESHOLD) {
  const log = loadExamTechniques()
  const byType = {}

  log.forEach(entry => {
    if (!byType[entry.type]) {
      byType[entry.type] = { type: entry.type, count: 0, subjects: new Set(), recentEvidence: [] }
    }
    const bucket = byType[entry.type]
    bucket.count += 1
    bucket.subjects.add(entry.subject)
    if (bucket.recentEvidence.length < 3 && entry.evidence) bucket.recentEvidence.push(entry.evidence)
  })

  return Object.values(byType)
    .map(bucket => ({
      type: bucket.type,
      count: bucket.count,
      subjects: Array.from(bucket.subjects),
      recentEvidence: bucket.recentEvidence,
    }))
    .filter(p => p.count >= threshold)
    .sort((a, b) => b.count - a.count)
}

/**
 * Get the single most persistent exam-technique pattern (mirrors getWeakestSubject).
 */
export function getTopExamTechniquePattern() {
  const patterns = getExamTechniquePatterns()
  return patterns[0] || null
}

// ─── Guided answer coach — question-type performance ──────────────────────────

/**
 * Log the result of one GuidedAnswerCoach attempt (stage 5, 6 or 7).
 *
 * @param {Object} metadata - { typeId, subject, marksAwarded, marksAvailable }
 *   typeId: GUIDED_COACH_TYPES id, e.g. 'explain-why'
 */
export function logCoachTypeResult(metadata = {}) {
  const { typeId, subject, marksAwarded, marksAvailable } = metadata
  if (!typeId || !subject || marksAvailable == null) return

  const log = loadCoachTypeResults()
  const entry = {
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    typeId,
    subject,
    marksAwarded: marksAwarded || 0,
    marksAvailable,
  }

  log.unshift(entry)
  saveCoachTypeResults(log.slice(0, 500))
}

/**
 * Aggregate logged coach results by question type for a subject.
 * Returns types scoring below threshold, weakest first.
 */
export function getWeakQuestionTypes(subject, threshold = COACH_TYPE_WEAK_THRESHOLD) {
  const log = loadCoachTypeResults().filter(e => e.subject === subject)

  const byType = {}
  log.forEach(entry => {
    if (!byType[entry.typeId]) {
      byType[entry.typeId] = { typeId: entry.typeId, subject, attempts: 0, totalAwarded: 0, totalAvailable: 0 }
    }
    const bucket = byType[entry.typeId]
    bucket.attempts += 1
    bucket.totalAwarded += entry.marksAwarded
    bucket.totalAvailable += entry.marksAvailable
  })

  return Object.values(byType)
    .map(b => ({ ...b, pct: b.totalAvailable ? b.totalAwarded / b.totalAvailable : 0 }))
    .filter(t => t.pct < threshold)
    .sort((a, b) => a.pct - b.pct)
}

/**
 * Convenience wrapper: the single weakest question type for a subject, or
 * null if there's no data yet (cold start) or nothing below threshold.
 */
export function getSuggestedQuestionType(subject) {
  const weak = getWeakQuestionTypes(subject)
  return weak[0] ? weak[0].typeId : null
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
