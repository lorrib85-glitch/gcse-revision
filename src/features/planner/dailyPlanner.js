// ─── Adaptive Daily Revision Planner ─────────────────────────────────────────
// Pure, testable logic for building a prioritised daily revision plan.
//
// Data contracts
// ──────────────
// userProfile: {
//   selectedSubjects: string[],   // subset of ALL_SUBJECTS the learner studies
//   weekdayMinutes:   number,      // session budget Mon–Fri (default 60)
//   saturdayMinutes:  number,      // Saturday (Test Day) budget (default 90)
//   sundayMinutes:    number,      // Sunday (Reset Day) budget (default 60)
//   name:             string,
// }
//
// learningState: {
//   scores:           Array<{ date, subject, pct, earned, possible, source }>,
//   wrongAnswers:     Array<{ date, subject, topic, marks, source }>,
//   correctAnswers:   Array<{ date, subject, topic, source }>,
//   moduleStates:     { [moduleId]: { screen, completed, hookDone, wylDone, timestamp } },
//   rotationHistory:  { [dateStr]: { main: string, secondary: string|null } },
//   progress:         { streak, lastActivityDate, bestStreak },
//   weakPoints:       WeakPoint[],
// }
//
// DailyPlan: {
//   date:             string,                        // YYYY-MM-DD
//   mode:             'weekday' | 'saturday' | 'sunday',
//   mainSubject:      string,
//   secondarySubject: string | null,
//   totalMinutes:     number,
//   blocks:           PlanBlock[],
// }
//
// PlanBlock: {
//   type:           string,       // block type identifier
//   label:          string,       // human-readable label shown in UI
//   duration:       number,       // minutes allocated to this block
//   subject:        string,       // which subject this block addresses
//   reasonCodes:    string[],     // machine-readable reasons for selection
//   moduleId?:      string,       // resolved module for progress-type blocks
//   screenIndex?:   number,       // jump target for revisit/repair blocks
//   topic?:         string,       // weak point topic (weakRepair, examMove)
//   skillTag?:      string,       // skill tag for interleaving metadata
//   interleaveWith?: string[],    // related topics for examMove blocks
//   pulse?:         PulseMeta,    // only on pulse-type blocks
// }
//
// PulseMeta: {
//   duration: number,
//   label:    string,
//   mix:      { spacedRecall, weakPoints, recentlyLearned?, interleaving?, examStyle?, crossSubject?, olderContent? },
// }
//
// WeakPoint: {
//   weakPointId:       string,
//   subject:           string,
//   topic:             string,
//   skillTag:          string | null,
//   misconceptionTag:  string | null,
//   errorType:         string | null,
//   severity:          'low' | 'medium' | 'high',
//   firstSeenAt:       string,   // YYYY-MM-DD
//   lastSeenAt:        string,   // YYYY-MM-DD
//   timesFailed:       number,
//   timesCorrectAfter: number,
//   status:            WeakPointStatus,
//   nextReviewAt:      string | null,
// }

import { MODULES, isModuleAvailable } from '../../modules.js'
import { MODULE_GROUPS } from '../../progress.js'
import { getArray, getObject, setJson } from '../../lib/storage.js'

// ─── Constants ────────────────────────────────────────────────────────────────

export const ALL_SUBJECTS = ['History', 'Biology', 'Maths', 'Chemistry', 'Sociology']

const PLANNER_ROTATION_KEY = 'gcse_planner_rotation'
const PLANNER_PREFS_KEY    = 'gcse_planner_prefs'
const SCORES_KEY           = 'gcse_scores'
const WRONG_ANSWERS_KEY    = 'gcse_wrong_answers'
const CORRECT_ANSWERS_KEY  = 'gcse_correct_answers'
const PROGRESS_KEY         = 'gcse_progress'
const USER_KEY             = 'riseUser'
const WEAK_POINTS_KEY      = 'gcse_planner_weakpoints'

const ROTATION_PENALTY_YESTERDAY = -6  // was main subject yesterday
const ROTATION_PENALTY_2DAY      = -3  // was main subject 2 days ago
const ROTATION_WINDOW_DAYS       = 14  // days of rotation history to retain

const MASTERY_ERROR_RATE_MAX = 0.2
const MASTERY_MIN_ATTEMPTS   = 3

// Block durations — weekday must sum to 60, Saturday to 90, Sunday to 60
const WEEKDAY_DURATIONS  = { pulse: 8,  mainProgress: 27, weakRepair: 12, examMove: 13 }
const SATURDAY_DURATIONS = { pulse: 15, testPaper: 50, markAndReview: 15, targetedRepair: 10 }
const SUNDAY_DURATIONS   = { pulse: 15, carryOverOrProgress: 25, paperMistakeRepair: 10, lightExamPractice: 10 }

// ─── Pulse duration system ────────────────────────────────────────────────────

export const PULSE_DURATIONS = [5, 10, 15, 20, 30]

export const PULSE_LABELS = {
  5:  'Quick Pulse',
  10: 'Daily Pulse',
  15: 'Deep Pulse',
  20: 'Weekend Pulse',
  30: 'Power Pulse',
}

const WEEKDAY_PULSE_DEFAULT = 8   // matches Part 1 block structure — not in PULSE_DURATIONS
const WEEKEND_PULSE_DEFAULT = 15  // matches Saturday/Sunday block durations

// ─── Weak point statuses ──────────────────────────────────────────────────────

export const WEAK_POINT_STATUSES = ['new', 'repairing', 'retest_due', 'stabilising', 'resolved']

// ─── Incomplete work statuses ─────────────────────────────────────────────────

export const INCOMPLETE_STATUSES = [
  'resume_next', 'shrink_and_retry', 'convert_to_recall',
  'return_to_pool', 'drop_or_defer',
]

// ─── Carry-over caps ──────────────────────────────────────────────────────────

export const MAX_WEEKDAY_CARRYOVER_MINUTES = 15
export const MAX_SUNDAY_CARRYOVER_MINUTES  = 30

// ─── Interleaving families ────────────────────────────────────────────────────

export const MATHS_INTERLEAVE_FAMILIES = {
  algebra:  ['expanding', 'factorising', 'solving', 'rearranging'],
  number:   ['fractions', 'percentages', 'ratio', 'standardForm'],
  geometry: ['angles', 'area', 'volume', 'trigonometry'],
  data:     ['averages', 'graphs', 'probability'],
}

export const HISTORY_INTERLEAVE_THEMES = [
  'chronology', 'change_and_continuity', 'similarity_difference',
  'cause_consequence', 'exam_question_type',
]

export const HISTORY_MEDICINE_ERAS = ['medieval', 'renaissance', 'eighteenth_nineteenth_century', 'modern']

export const SCIENCE_SUBJECTS = ['Biology', 'Chemistry', 'Physics']

const SOCIOLOGY_SKILLS = ['key_terms', 'studies_and_theorists', 'evaluation', 'application']

// ─── Paper practice constants ─────────────────────────────────────────────────

export const PAPER_ACTIVITY_TYPES = ['fullPaper', 'paperSection', 'microPaper']

export const PAPER_PRACTICE_WEIGHTS = {
  maths:             95,
  combinedScience:   95,
  englishLanguage:   80,
  history:           80,
  sociology:         60,
  englishLiterature: 60,
  music:             35,
  drama:             30,
}

export const ERROR_TYPES = [
  'knowledgeGap', 'misreadQuestion', 'weakMethod', 'poorExamTechnique',
  'timing', 'calculationError', 'tooVague', 'noEvidence', 'didNotEvaluate',
]

const PAPER_RESULTS_KEY = 'gcse_planner_paper_results'

// ─── Date helpers ─────────────────────────────────────────────────────────────

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function offsetDateStr(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function offsetDateFromStr(ds, days) {
  const d = new Date(ds + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// Returns (dateStrB - dateStrA) in whole days. Positive = B is after A.
function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA + 'T00:00:00')
  const b = new Date(dateStrB + 'T00:00:00')
  return Math.floor((b - a) / 86400000)
}

// ─── Storage boundary ─────────────────────────────────────────────────────────

function loadRotationHistory() {
  return getObject(PLANNER_ROTATION_KEY)
}

// Explicit save — caller decides when to persist. buildDailyPlan does NOT
// call this automatically; pass options.persistRotation = true or call it
// directly after confirming the plan should take effect.
export function savePlannerRotation(plan) {
  const date    = new Date(plan.date + 'T00:00:00')
  const history = loadRotationHistory()
  history[plan.date] = { main: plan.mainSubject, secondary: plan.secondarySubject || null }

  const cutoff = offsetDateStr(date, -ROTATION_WINDOW_DAYS)
  const pruned = {}
  Object.entries(history).forEach(([d, v]) => {
    if (d >= cutoff) pruned[d] = v
  })
  setJson(PLANNER_ROTATION_KEY, pruned)
}

export function saveWeakPoints(weakPoints) {
  setJson(WEAK_POINTS_KEY, weakPoints)
}

export function savePaperResult(paperResult) {
  const existing = getArray(PAPER_RESULTS_KEY)
  setJson(PAPER_RESULTS_KEY, [...existing, paperResult])
}

// ─── loadLearningState ────────────────────────────────────────────────────────
// The only function in this module that reads from the persistence layer.
// All planner logic operates on the returned object so each function
// is independently testable with plain fixture data.

export function loadLearningState() {
  const scores          = getArray(SCORES_KEY)
  const wrongAnswers    = getArray(WRONG_ANSWERS_KEY)
  const correctAnswers  = getArray(CORRECT_ANSWERS_KEY)
  const progress        = getObject(PROGRESS_KEY)
  const rotationHistory = loadRotationHistory()
  const weakPoints      = getArray(WEAK_POINTS_KEY)
  const paperResults    = getArray(PAPER_RESULTS_KEY)

  const moduleStates = {}
  MODULES.forEach(m => {
    moduleStates[m.id] = getObject('gcse_module_' + m.id)
  })

  return { scores, wrongAnswers, correctAnswers, moduleStates, rotationHistory, progress, weakPoints, paperResults }
}

// ─── loadUserProfile ──────────────────────────────────────────────────────────

export function loadUserProfile() {
  const user  = getObject(USER_KEY)
  const prefs = getObject(PLANNER_PREFS_KEY)
  return {
    selectedSubjects: prefs.selectedSubjects || ALL_SUBJECTS,
    weekdayMinutes:   prefs.weekdayMinutes   ?? 60,
    saturdayMinutes:  prefs.saturdayMinutes  ?? 90,
    sundayMinutes:    prefs.sundayMinutes    ?? 60,
    name:             user.name              || '',
  }
}

// ─── getPlanningMode ──────────────────────────────────────────────────────────
// Saturday = Test Day, Sunday = Reset Day, Mon–Fri = weekday.

export function getPlanningMode(date, _userProfile) {
  const day = date.getDay()  // 0 = Sunday, 6 = Saturday
  if (day === 6) return 'saturday'
  if (day === 0) return 'sunday'
  return 'weekday'
}

// ─── Per-subject analysis helpers ─────────────────────────────────────────────

function subjectWeaknessScore(subject, learningState) {
  const wrong   = learningState.wrongAnswers.filter(w => w.subject === subject)
  const correct = learningState.correctAnswers.filter(c => c.subject === subject)

  const topics = {}
  wrong.forEach(w => {
    if (!topics[w.topic]) topics[w.topic] = { wrong: 0, correct: 0 }
    topics[w.topic].wrong++
  })
  correct.forEach(c => {
    if (!topics[c.topic]) topics[c.topic] = { wrong: 0, correct: 0 }
    topics[c.topic].correct++
  })

  let unmastered = 0
  Object.values(topics).forEach(({ wrong: w, correct: c }) => {
    const total     = w + c
    const errorRate = total > 0 ? w / total : 1
    const mastered  = errorRate < MASTERY_ERROR_RATE_MAX && total >= MASTERY_MIN_ATTEMPTS
    if (!mastered && w >= 1) unmastered++
  })

  return unmastered
}

function daysSinceStudied(subject, learningState, date) {
  const lastEntry = learningState.scores
    .filter(s => s.subject === subject)
    .sort((a, b) => b.date.localeCompare(a.date))[0]
  if (!lastEntry) return Infinity
  const diffMs = new Date(dateStr(date)) - new Date(lastEntry.date)
  return Math.floor(diffMs / 86400000)
}

function hasInProgressModule(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return false
  return group.chapterIds.some(id => {
    const state = learningState.moduleStates[id] || {}
    return state.screen > 0 && !state.completed
  })
}

function getInProgressModuleForSubject(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return null
  for (const id of group.chapterIds) {
    const state = learningState.moduleStates[id] || {}
    if (!(state.screen > 0 && !state.completed)) continue
    const mod = MODULES.find(m => m.id === id)
    // Never surface an unbuilt stub as a plan task, even if stale state exists.
    if (mod && isModuleAvailable(mod)) return mod
  }
  return null
}

function getNextNewModuleForSubject(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return null
  for (const id of group.chapterIds) {
    const state = learningState.moduleStates[id] || {}
    if (state.screen || state.completed) continue
    const mod = MODULES.find(m => m.id === id)
    // Skip coming-soon / hidden stubs so the planner never routes a learner
    // into an empty module.
    if (mod && isModuleAvailable(mod)) return mod
  }
  return null
}

// ─── calculateSubjectPriority ─────────────────────────────────────────────────
// Returns a numeric score. Higher = more urgent to study today.
//
//   weakness:       0–10   unmastered wrong-answer topics × 1.5 (capped)
//   recency:        0–6    days since last scored, graduated scale
//   in-progress:    +3     continuity bonus for mid-module work
//   never studied:  +4     exploration nudge for untouched subjects
//   rotation:       −3–−6  penalty if subject was main in last 2 days

export function calculateSubjectPriority(subject, learningState, date) {
  let score = 0

  score += Math.min(10, subjectWeaknessScore(subject, learningState) * 1.5)

  const days = daysSinceStudied(subject, learningState, date)
  if (days === Infinity) score += 4
  else if (days >= 7)    score += 6
  else if (days >= 5)    score += 4
  else if (days >= 3)    score += 3
  else if (days >= 2)    score += 2
  else if (days >= 1)    score += 1

  if (hasInProgressModule(subject, learningState)) score += 3

  const history    = learningState.rotationHistory || {}
  const yesterday  = offsetDateStr(date, -1)
  const twoDaysAgo = offsetDateStr(date, -2)

  if (history[yesterday]?.main === subject)       score += ROTATION_PENALTY_YESTERDAY
  else if (history[twoDaysAgo]?.main === subject) score += ROTATION_PENALTY_2DAY

  return score
}

// ─── selectMainSubject ────────────────────────────────────────────────────────

export function selectMainSubject(subjects, learningState, date) {
  if (!subjects || subjects.length === 0) return ALL_SUBJECTS[0]

  return subjects
    .map(s => ({ subject: s, priority: calculateSubjectPriority(s, learningState, date) }))
    .sort((a, b) => b.priority - a.priority)[0].subject
}

// ─── selectSecondarySubject ───────────────────────────────────────────────────

export function selectSecondarySubject(subjects, mainSubject, learningState, date) {
  const candidates = (subjects || []).filter(s => s !== mainSubject)
  if (candidates.length === 0) return null

  return candidates
    .map(s => ({ subject: s, priority: calculateSubjectPriority(s, learningState, date) }))
    .sort((a, b) => b.priority - a.priority)[0].subject
}

// ─── Pulse system ─────────────────────────────────────────────────────────────

export function normalisePulseDuration(duration, mode) {
  if (!duration || typeof duration !== 'number' || isNaN(duration)) {
    return mode === 'weekday' ? WEEKDAY_PULSE_DEFAULT : WEEKEND_PULSE_DEFAULT
  }
  // Clamp to nearest valid option in PULSE_DURATIONS
  return PULSE_DURATIONS.reduce((prev, curr) =>
    Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev
  )
}

export function getPulseLabel(duration) {
  if (PULSE_LABELS[duration]) return PULSE_LABELS[duration]
  const nearest = normalisePulseDuration(duration, 'weekday')
  return PULSE_LABELS[nearest] || 'Daily Pulse'
}

export function getPulseMix(mode, duration) {
  if (duration === 30) {
    return { spacedRecall: 0.25, weakPoints: 0.35, examStyle: 0.25, olderContent: 0.15 }
  }
  if (mode === 'weekday') {
    return { spacedRecall: 0.4, weakPoints: 0.3, recentlyLearned: 0.2, interleaving: 0.1 }
  }
  // saturday / sunday
  return { spacedRecall: 0.3, weakPoints: 0.3, examStyle: 0.2, crossSubject: 0.2 }
}

// ─── Weak point lifecycle ─────────────────────────────────────────────────────

export function calculateWeakPointSeverity(weakPoint) {
  const { timesFailed, timesCorrectAfter } = weakPoint
  const netFails = (timesFailed || 0) - (timesCorrectAfter || 0)
  if (netFails >= 5) return 'high'
  if (netFails >= 3) return 'medium'
  return 'low'
}

export function updateWeakPointFromResult(weakPoint, result) {
  const wp = { ...weakPoint }
  const date = result.answeredAt
    ? result.answeredAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  wp.lastSeenAt = date

  if (result.correct) {
    wp.timesCorrectAfter = (wp.timesCorrectAfter || 0) + 1

    // Status progression — cannot jump straight to resolved
    if (wp.status === 'new' || wp.status === 'repairing') {
      wp.status      = 'retest_due'
      wp.nextReviewAt = offsetDateFromStr(date, 2)
    } else if (wp.status === 'retest_due') {
      wp.status      = 'stabilising'
      wp.nextReviewAt = offsetDateFromStr(date, 3)
    } else if (wp.status === 'stabilising' && wp.timesCorrectAfter >= 3) {
      wp.status      = 'resolved'
      wp.nextReviewAt = null
    }
  } else {
    wp.timesFailed = (wp.timesFailed || 0) + 1
    // Regression if making progress
    if (wp.status === 'retest_due' || wp.status === 'stabilising') {
      wp.status = 'repairing'
    }
    // Reset correction counter
    wp.timesCorrectAfter = 0
  }

  wp.severity = calculateWeakPointSeverity(wp)
  return wp
}

export function createOrUpdateWeakPoint(learningState, result) {
  const weakPoints = [...(learningState.weakPoints || [])]
  const { subject, topic, skillTag, misconceptionTag, errorType, answeredAt, correct } = result
  const date = answeredAt ? answeredAt.slice(0, 10) : new Date().toISOString().slice(0, 10)

  const idx = weakPoints.findIndex(
    wp => wp.subject === subject && wp.topic === topic && (wp.skillTag || null) === (skillTag || null)
  )

  if (idx >= 0) {
    weakPoints[idx] = updateWeakPointFromResult(weakPoints[idx], result)
  } else if (!correct) {
    const newWP = {
      weakPointId:      `${subject}_${topic}_${date}_${Math.random().toString(36).slice(2, 7)}`,
      subject,
      topic,
      skillTag:         skillTag         || null,
      misconceptionTag: misconceptionTag || null,
      errorType:        errorType        || null,
      severity:         'low',
      firstSeenAt:      date,
      lastSeenAt:       date,
      timesFailed:      1,
      timesCorrectAfter: 0,
      status:           'new',
      nextReviewAt:     offsetDateFromStr(date, 1),
    }
    newWP.severity = calculateWeakPointSeverity(newWP)
    weakPoints.push(newWP)
  }

  return { ...learningState, weakPoints }
}

// ─── applyPulseResultToLearningState ─────────────────────────────────────────
// Pure function: takes prior state + one Pulse result, returns updated state.
// PulseResult shape: { questionId, subject, topic, skillTag, correct,
//                      attempts, hintsUsed, timeTaken, answeredAt }

export function applyPulseResultToLearningState(learningState, pulseResult) {
  const state = {
    ...learningState,
    weakPoints:    learningState.weakPoints    || [],
    wrongAnswers:  learningState.wrongAnswers  || [],
    correctAnswers: learningState.correctAnswers || [],
  }

  const date = pulseResult.answeredAt
    ? pulseResult.answeredAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  const entry = {
    date,
    subject:    pulseResult.subject,
    topic:      pulseResult.topic,
    questionId: pulseResult.questionId,
    source:     'pulse',
  }

  const updated = createOrUpdateWeakPoint(state, pulseResult)

  if (pulseResult.correct) {
    return { ...updated, correctAnswers: [entry, ...state.correctAnswers] }
  }
  return { ...updated, wrongAnswers: [entry, ...state.wrongAnswers] }
}

// ─── selectWeakPointRepair ────────────────────────────────────────────────────
// Returns the highest-priority weak point for the given subject, or null.

export function selectWeakPointRepair(subject, learningState, date) {
  const weakPoints = learningState.weakPoints || []
  const today = date ? dateStr(date) : dateStr(new Date())

  const candidates = weakPoints.filter(
    wp => wp.subject === subject && wp.status !== 'resolved'
  )
  if (!candidates.length) return null

  const scored = candidates.map(wp => {
    let score = 0
    if (wp.severity === 'high')   score += 10
    else if (wp.severity === 'medium') score += 6
    else score += 3

    if (wp.status === 'retest_due') {
      const daysOverdue = wp.nextReviewAt ? daysBetween(wp.nextReviewAt, today) : 0
      score += Math.max(0, daysOverdue) * 2
    } else if (wp.status === 'new')      score += 4
    else if (wp.status === 'repairing')  score += 5

    score += Math.min(5, wp.timesFailed || 0)
    return { ...wp, _score: score }
  })

  const best = scored.sort((a, b) => b._score - a._score)[0]
  // Remove internal scoring field before returning
  const { _score, ...wp } = best
  return wp
}

// ─── Interleaving ─────────────────────────────────────────────────────────────

function selectMathsInterleaving(weakPoints) {
  const mathsWeak = weakPoints.filter(wp => wp.subject === 'Maths' && wp.status !== 'resolved')

  let bestFamily = null
  let bestCount  = 0

  for (const [family, skills] of Object.entries(MATHS_INTERLEAVE_FAMILIES)) {
    const count = mathsWeak.filter(wp => skills.includes(wp.skillTag || '') || skills.includes(wp.topic || '')).length
    if (count > bestCount) {
      bestCount  = count
      bestFamily = family
    }
  }

  if (bestFamily) {
    const familySkills = MATHS_INTERLEAVE_FAMILIES[bestFamily]
    const weakSkill    = mathsWeak.find(wp =>
      familySkills.includes(wp.skillTag || '') || familySkills.includes(wp.topic || '')
    )
    const skillTag = weakSkill?.skillTag || weakSkill?.topic || null
    return {
      subject:       'Maths',
      topic:         bestFamily,
      skillTag,
      interleaveWith: familySkills.filter(s => s !== skillTag),
      reasonCodes:   ['INTERLEAVE_SKILL_FAMILY'],
    }
  }

  return {
    subject: 'Maths', topic: null, skillTag: null, interleaveWith: [], reasonCodes: ['INTERLEAVE_GENERAL'],
  }
}

function selectScienceInterleaving(mainSubject, learningState, availableSubjects) {
  const siblings = SCIENCE_SUBJECTS.filter(s => s !== mainSubject && availableSubjects.includes(s))
  if (!siblings.length) {
    return {
      subject: mainSubject, topic: null, skillTag: null, interleaveWith: [], reasonCodes: ['INTERLEAVE_GENERAL'],
    }
  }

  const weakPoints = learningState.weakPoints || []
  for (const sibling of siblings) {
    const siblingWeak = weakPoints.filter(
      wp => wp.subject === sibling && wp.status !== 'resolved' && wp.severity !== 'low'
    )
    if (siblingWeak.length) {
      const wp = siblingWeak[0]
      return {
        subject:       sibling,
        topic:         wp.topic,
        skillTag:      wp.skillTag,
        interleaveWith: [mainSubject],
        reasonCodes:   ['INTERLEAVE_CROSS_SUBJECT'],
      }
    }
  }

  return {
    subject: siblings[0], topic: null, skillTag: null, interleaveWith: [mainSubject], reasonCodes: ['INTERLEAVE_CROSS_SUBJECT'],
  }
}

function selectHistoryInterleaving(weakPoints) {
  const historyWeak = weakPoints.filter(wp => wp.subject === 'History' && wp.status !== 'resolved')
  const preferredThemes = ['change_and_continuity', 'chronology']

  for (const theme of preferredThemes) {
    const themeWeak = historyWeak.filter(
      wp => wp.skillTag === theme || (wp.topic || '').includes(theme)
    )
    if (themeWeak.length) {
      const wp = themeWeak[0]
      return {
        subject:       'History',
        topic:         wp.topic,
        skillTag:      theme,
        interleaveWith: HISTORY_MEDICINE_ERAS.filter(era => era !== wp.topic),
        reasonCodes:   ['INTERLEAVE_HISTORICAL_THEME'],
      }
    }
  }

  return {
    subject: 'History', topic: null, skillTag: HISTORY_INTERLEAVE_THEMES[0],
    interleaveWith: HISTORY_MEDICINE_ERAS, reasonCodes: ['INTERLEAVE_HISTORICAL_THEME'],
  }
}

function selectSociologyInterleaving(weakPoints) {
  const socWeak = weakPoints.filter(wp => wp.subject === 'Sociology' && wp.status !== 'resolved')
  if (socWeak.length) {
    const wp = socWeak[0]
    return {
      subject:       'Sociology',
      topic:         wp.topic,
      skillTag:      wp.skillTag || SOCIOLOGY_SKILLS[0],
      interleaveWith: [],
      reasonCodes:   ['INTERLEAVE_WEAK_TOPIC'],
    }
  }
  return {
    subject: 'Sociology', topic: null, skillTag: SOCIOLOGY_SKILLS[0], interleaveWith: [], reasonCodes: ['INTERLEAVE_SKILL_AREA'],
  }
}

// selectInterleavingActivity — purposeful, not random.
// subjects: list of subjects available to this learner (defaults to ALL_SUBJECTS).
// Checks for high-severity overdue weak points first (injection rule), then
// falls back to subject-specific interleaving families.

export function selectInterleavingActivity(mainSubject, learningState, date, subjects = ALL_SUBJECTS) {
  const weakPoints = learningState.weakPoints || []
  const today = date ? dateStr(date) : dateStr(new Date())

  // Injection: high-severity overdue weak point from any available subject
  const severeOverdue = weakPoints.filter(wp => {
    if (wp.status === 'resolved') return false
    if (wp.severity !== 'high') return false
    if (!subjects.includes(wp.subject)) return false
    const daysOverdue = wp.nextReviewAt ? daysBetween(wp.nextReviewAt, today) : 0
    return daysOverdue > 2
  })
  if (severeOverdue.length) {
    const wp = severeOverdue[0]
    return {
      subject:       wp.subject,
      topic:         wp.topic,
      skillTag:      wp.skillTag,
      interleaveWith: [mainSubject],
      reasonCodes:   ['INTERLEAVE_SEVERE_OVERDUE', 'WEAK_POINT_INJECTION'],
    }
  }

  if (mainSubject === 'Maths') return selectMathsInterleaving(weakPoints)
  if (SCIENCE_SUBJECTS.includes(mainSubject)) return selectScienceInterleaving(mainSubject, learningState, subjects)
  if (mainSubject === 'History')   return selectHistoryInterleaving(weakPoints)
  if (mainSubject === 'Sociology') return selectSociologyInterleaving(weakPoints)

  // Default: weak topic in main subject, or general
  const subjectWeak = weakPoints.filter(wp => wp.subject === mainSubject && wp.status !== 'resolved')
  if (subjectWeak.length) {
    const wp = subjectWeak[0]
    return {
      subject: mainSubject, topic: wp.topic, skillTag: wp.skillTag, interleaveWith: [], reasonCodes: ['INTERLEAVE_WEAK_TOPIC'],
    }
  }
  return {
    subject: mainSubject, topic: null, skillTag: null, interleaveWith: [], reasonCodes: ['INTERLEAVE_GENERAL'],
  }
}

// ─── buildWeekdayBlocks ───────────────────────────────────────────────────────
// Exactly four blocks: Start Strong → Main Mission → Fix One Thing → Exam Move
// Fixed durations: 8 + 27 + 12 + 13 = 60 minutes

export function buildWeekdayBlocks(mainSubject, secondarySubject, learningState, userProfile) {
  const pulseSubject = secondarySubject || mainSubject
  const pulseDuration = WEEKDAY_DURATIONS.pulse
  const subjects = userProfile?.selectedSubjects || ALL_SUBJECTS

  const mainMod = getInProgressModuleForSubject(mainSubject, learningState)
              || getNextNewModuleForSubject(mainSubject, learningState)

  const mainReasonCodes = mainMod
    ? ((learningState.moduleStates[mainMod.id]?.screen > 0)
        ? ['IN_PROGRESS_CONTINUITY']
        : ['NEXT_IN_SEQUENCE'])
    : ['SUBJECT_ROTATION']

  const weakPoint = selectWeakPointRepair(mainSubject, learningState, new Date())
  const interleave = selectInterleavingActivity(mainSubject, learningState, new Date(), subjects)

  return [
    {
      type:        'pulse',
      label:       'Start Strong',
      duration:    pulseDuration,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
      pulse: {
        duration: pulseDuration,
        label:    getPulseLabel(pulseDuration),
        mix:      getPulseMix('weekday', pulseDuration),
      },
    },
    {
      type:        'mainProgress',
      label:       'Main Mission',
      duration:    WEEKDAY_DURATIONS.mainProgress,
      subject:     mainSubject,
      reasonCodes: mainReasonCodes,
      ...(mainMod ? { moduleId: mainMod.id } : {}),
    },
    {
      type:        'weakRepair',
      label:       'Fix One Thing',
      duration:    WEEKDAY_DURATIONS.weakRepair,
      subject:     mainSubject,
      reasonCodes: ['WEAK_POINT_REPAIR'],
      ...(weakPoint ? { topic: weakPoint.topic } : {}),
      ...(weakPoint?.skillTag ? { skillTag: weakPoint.skillTag } : {}),
    },
    {
      type:        'examMove',
      label:       'Exam Move',
      duration:    WEEKDAY_DURATIONS.examMove,
      subject:     interleave.subject,
      reasonCodes: interleave.reasonCodes,
      ...(interleave.topic    ? { topic: interleave.topic }                      : {}),
      ...(interleave.skillTag ? { skillTag: interleave.skillTag }                : {}),
      ...(interleave.interleaveWith?.length ? { interleaveWith: interleave.interleaveWith } : {}),
    },
  ]
}

// ─── buildSaturdayBlocks ──────────────────────────────────────────────────────
// Saturday = Test Day. Exactly four blocks.
// Default durations: 15 + 50 + 15 + 10 = 90 minutes.
// Paper duration = saturdayMinutes - pulseDuration - 15 (review) - 10 (repair).
// If saturdayMinutes > 90, extra time goes to paper first, then review.

export function buildSaturdayBlocks(mainSubject, secondarySubject, learningState, userProfile) {
  const subjects        = userProfile?.selectedSubjects || ALL_SUBJECTS
  const saturdayMinutes = userProfile?.saturdayMinutes  ?? 90
  const pulseDuration   = userProfile?.saturdayPulseDuration ?? SATURDAY_DURATIONS.pulse
  const pulseSubject    = secondarySubject || mainSubject

  const MIN_REVIEW = 15
  const MIN_REPAIR = 10

  const testPaperDuration = Math.max(20, saturdayMinutes - pulseDuration - MIN_REVIEW - MIN_REPAIR)

  const paperSubject      = selectWeekendPaperSubject(learningState, { ...userProfile, selectedSubjects: subjects }, new Date())
  const paperActivityType = selectPaperActivity(paperSubject, learningState, testPaperDuration)
  const coverage          = getSubjectCoverage(paperSubject, learningState)
  const weakPoint         = selectWeakPointRepair(paperSubject, learningState, new Date())

  return [
    {
      type:        'pulse',
      label:       'Pulse Starter',
      duration:    pulseDuration,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
      pulse: {
        duration: pulseDuration,
        label:    getPulseLabel(pulseDuration),
        mix:      getPulseMix('saturday', pulseDuration),
      },
    },
    {
      type:             'testPaper',
      label:            'Paper Practice',
      duration:         testPaperDuration,
      subject:          paperSubject,
      paperActivityType,
      reasonCodes:      ['SATURDAY_TEST_DAY', 'PAPER_PRACTICE_DUE'],
      paper: {
        paperType: paperActivityType,
        coverage,
      },
    },
    {
      type:        'markAndReview',
      label:       'Mark & Decode',
      duration:    MIN_REVIEW,
      subject:     paperSubject,
      reasonCodes: ['EXAM_REVIEW'],
    },
    {
      type:        'targetedRepair',
      label:       'Fix One Thing',
      duration:    MIN_REPAIR,
      subject:     paperSubject,
      reasonCodes: ['WEAK_POINT_REPAIR'],
      ...(weakPoint           ? { topic: weakPoint.topic }         : {}),
      ...(weakPoint?.skillTag ? { skillTag: weakPoint.skillTag }   : {}),
      ...(weakPoint?.errorType ? { errorType: weakPoint.errorType } : {}),
    },
  ]
}

// ─── buildSundayBlocks ────────────────────────────────────────────────────────
// Sunday = Reset Day. Exactly four blocks.
// Durations: 15 + 25 + 10 + 10 = 60 minutes.
// paperMistakeRepair uses Saturday's recommended repair if available, then
// falls back to the highest-priority existing weak point.

export function buildSundayBlocks(mainSubject, secondarySubject, learningState, userProfile) {
  const pulseSubject  = secondarySubject || mainSubject
  const pulseDuration = SUNDAY_DURATIONS.pulse
  const selectedSubjects = userProfile?.selectedSubjects || ALL_SUBJECTS

  // Look for the most recent Saturday paper result
  const paperResults = learningState?.paperResults || []
  const recentPaperResult = paperResults
    .filter(pr => pr.completedAt)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0] || null

  // Resolve paperMistakeRepair target — prefer Saturday paper repair, fall back to weak point
  const satRepair = recentPaperResult
    ? selectHighestValuePaperRepair(
        (learningState?.weakPoints || []).filter(
          wp => wp.subject === recentPaperResult.subject && wp.status !== 'resolved'
        ),
        recentPaperResult
      )
    : null

  const mistakeRepair  = satRepair || selectWeakPointRepair(mainSubject, learningState || { weakPoints: [] }, new Date())
  const mistakeSubject = satRepair ? recentPaperResult.subject : mainSubject
  const repairSource   = satRepair ? 'saturdayPaper' : undefined

  // lightExamPractice subject: paper subject if available and still selected, else main
  const lightSubjectCandidate = recentPaperResult?.subject
  const lightPracticeSubject  = (lightSubjectCandidate && selectedSubjects.includes(lightSubjectCandidate))
    ? lightSubjectCandidate
    : mainSubject

  return [
    {
      type:        'pulse',
      label:       'Pulse',
      duration:    pulseDuration,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
      pulse: {
        duration: pulseDuration,
        label:    getPulseLabel(pulseDuration),
        mix:      getPulseMix('sunday', pulseDuration),
      },
    },
    {
      type:        'carryOverOrProgress',
      label:       'Catch-up',
      duration:    SUNDAY_DURATIONS.carryOverOrProgress,
      subject:     mainSubject,
      reasonCodes: ['CARRY_OVER'],
    },
    {
      type:        'paperMistakeRepair',
      label:       'Patch',
      duration:    SUNDAY_DURATIONS.paperMistakeRepair,
      subject:     mistakeSubject,
      reasonCodes: ['WEAK_POINT_REPAIR'],
      ...(mistakeRepair            ? { topic: mistakeRepair.topic }           : {}),
      ...(mistakeRepair?.skillTag  ? { skillTag: mistakeRepair.skillTag }     : {}),
      ...(mistakeRepair?.errorType ? { errorType: mistakeRepair.errorType }   : {}),
      ...(repairSource             ? { source: repairSource }                 : {}),
    },
    {
      type:         'lightExamPractice',
      label:        'Exam Move',
      duration:     SUNDAY_DURATIONS.lightExamPractice,
      subject:      lightPracticeSubject,
      practiceType: 'shortExamQuestion',
      reasonCodes:  ['INTERLEAVE_RELATED_TOPIC'],
    },
  ]
}

// ─── buildDailyPlan ───────────────────────────────────────────────────────────
// Main entry point. Pure by default — does NOT write to the persistence layer.
//
// To persist today's subject choices for rotation tracking, either:
//   buildDailyPlan(profile, state, date, { persistRotation: true })
//   or call savePlannerRotation(plan) explicitly after confirming the plan.

export function buildDailyPlan(userProfile, learningState, date = new Date(), options = {}) {
  const subjects = userProfile?.selectedSubjects?.length
    ? userProfile.selectedSubjects
    : ALL_SUBJECTS

  const mode             = getPlanningMode(date, userProfile)
  const mainSubject      = selectMainSubject(subjects, learningState, date)
  const secondarySubject = selectSecondarySubject(subjects, mainSubject, learningState, date)

  let blocks
  if (mode === 'saturday') {
    blocks = buildSaturdayBlocks(mainSubject, secondarySubject, learningState, userProfile)
  } else if (mode === 'sunday') {
    blocks = buildSundayBlocks(mainSubject, secondarySubject, learningState, userProfile)
  } else {
    blocks = buildWeekdayBlocks(mainSubject, secondarySubject, learningState, userProfile)
  }

  const totalMinutes = blocks.reduce((sum, b) => sum + b.duration, 0)

  const plan = { date: dateStr(date), mode, mainSubject, secondarySubject, totalMinutes, blocks }

  if (options.persistRotation) savePlannerRotation(plan)

  return plan
}

// ─── classifyIncompleteWork ───────────────────────────────────────────────────
// Determines what to do with an activity that was not completed.
// activity: { type, progressPercent, timeSpent, subject, incomplete, assessmentLinked }

export function classifyIncompleteWork(activity) {
  const { type, progressPercent = 0, timeSpent = 0, subject, incomplete, assessmentLinked } = activity

  if (type === 'mainProgress' || type === 'moduleProgress') {
    if (progressPercent >= 35) return 'resume_next'
    return 'shrink_and_retry'
  }

  if (type === 'retrieval' || type === 'pulse') {
    return 'return_to_pool'
  }

  if (type === 'weakRepair' && incomplete) {
    return 'convert_to_recall'
  }

  if (type === 'testPaper') {
    if (progressPercent >= 50) return 'resume_next'
    return 'drop_or_defer'
  }

  if (type === 'examPractice' || type === 'examMove') {
    if (progressPercent >= 50) return 'resume_next'
    return 'drop_or_defer'
  }

  if (subject === 'music' || subject === 'drama') {
    return assessmentLinked ? 'resume_next' : 'return_to_pool'
  }

  return 'return_to_pool'
}

// ─── handleMissedDay ─────────────────────────────────────────────────────────
// Folds a missed day into carry-over budget. Does not duplicate or guilt-pile.
// Returns: { carryOver: PlanBlock[], returnToPool: PlanBlock[], foldedMessage: string }

export function handleMissedDay(missedPlan) {
  const cap = missedPlan.mode === 'sunday' ? MAX_SUNDAY_CARRYOVER_MINUTES : MAX_WEEKDAY_CARRYOVER_MINUTES
  const carryOver   = []
  const returnToPool = []
  let totalCarryMinutes = 0

  for (const block of missedPlan.blocks) {
    const classification = classifyIncompleteWork({
      type:             block.type,
      progressPercent:  0,
      timeSpent:        0,
      subject:          block.subject,
      incomplete:       true,
      assessmentLinked: false,
    })

    if (classification === 'return_to_pool' || classification === 'drop_or_defer') {
      returnToPool.push(block)
      continue
    }

    // Convert_to_recall shrinks the block to a short retry
    const carryDuration = classification === 'convert_to_recall'
      ? Math.min(block.duration, 8)
      : block.duration

    if (totalCarryMinutes + carryDuration <= cap) {
      carryOver.push({
        ...block,
        carryForwardAs: classification,
        duration:       carryDuration,
        originalDate:   missedPlan.date,
      })
      totalCarryMinutes += carryDuration
    } else {
      returnToPool.push(block)
    }
  }

  return {
    carryOver,
    returnToPool,
    foldedMessage: "Yesterday's work has been folded into today. No need to catch up everything.",
  }
}

// ─── Paper practice helpers ───────────────────────────────────────────────────

function paperPracticeWeight(subject) {
  const key = {
    Maths: 'maths', Biology: 'combinedScience', Chemistry: 'combinedScience',
    Physics: 'combinedScience', History: 'history', Sociology: 'sociology',
    'English Language': 'englishLanguage', 'English Literature': 'englishLiterature',
    Music: 'music', Drama: 'drama',
  }[subject] ?? subject.toLowerCase()
  return PAPER_PRACTICE_WEIGHTS[key] ?? 50
}

// Returns true if the subject has at least some covered content suitable for paper practice.
function subjectHasPaperPractice(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (group) {
    const hasStarted = group.chapterIds.some(id => {
      const state = learningState.moduleStates[id] || {}
      return state.screen > 0 || state.completed
    })
    if (hasStarted) return true
  }
  return (learningState.correctAnswers || []).some(c => c.subject === subject)
}

// Estimates % of subject content covered based on module progress or answer history.
function getSubjectCoverage(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)

  if (group && group.chapterIds.length) {
    const total = group.chapterIds.length
    const done  = group.chapterIds.filter(id => {
      const state = learningState.moduleStates[id] || {}
      return state.completed || (state.screen && state.screen > 0)
    }).length
    return Math.round((done / total) * 100)
  }

  // No MODULE_GROUP — estimate from correct answer volume
  const correct = (learningState.correctAnswers || []).filter(c => c.subject === subject).length
  if (correct >= 30) return 80
  if (correct >= 20) return 60
  if (correct >= 10) return 40
  return 20
}

// ─── Paper subject selection scoring helpers ──────────────────────────────────

function weaknessBoost(subject, learningState) {
  const count = (learningState.weakPoints || []).filter(
    wp => wp.subject === subject && wp.status !== 'resolved'
  ).length
  return Math.min(20, count * 4)
}

function daysSinceLastPaperBoost(subject, learningState, date) {
  const results = (learningState.paperResults || [])
    .filter(pr => pr.subject === subject && pr.completedAt)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))

  if (!results.length) return 15

  const days = daysBetween(results[0].completedAt.slice(0, 10), dateStr(date))
  if (days >= 14) return 15
  if (days >= 7)  return 10
  if (days >= 3)  return 5
  return 0
}

function coverageReadinessBoost(subject, learningState) {
  const coverage = getSubjectCoverage(subject, learningState)
  if (coverage >= 60) return 10
  if (coverage >= 35) return 5
  return 0
}

function recentPaperPenalty(subject, learningState, date) {
  const results = (learningState.paperResults || [])
    .filter(pr => pr.subject === subject && pr.completedAt)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))

  if (!results.length) return 0

  const days = daysBetween(results[0].completedAt.slice(0, 10), dateStr(date))
  return days < 7 ? 20 : 0
}

// ─── isTopicEligibleForPaperPractice ─────────────────────────────────────────
// A topic must have been taught before appearing in paper practice.
// diagnosticMode = true allows untaught topics (for diagnostic papers only).

export function isTopicEligibleForPaperPractice(topic, options = {}) {
  if (!topic || !topic.status) return false
  if (options.diagnosticMode) return true
  return ['learned', 'reviewed', 'weak', 'mastered'].includes(topic.status)
}

// ─── selectPaperActivity ─────────────────────────────────────────────────────
// Chooses the format of the Saturday paper practice block.

export function selectPaperActivity(subject, learningState, availableMinutes, options = {}) {
  if (options.diagnosticMode) return 'microPaper'

  const coverage = getSubjectCoverage(subject, learningState)

  if (availableMinutes >= 90 && coverage > 70) return 'fullPaper'
  if (coverage > 35) return 'paperSection'
  return 'microPaper'
}

// ─── selectWeekendPaperSubject ────────────────────────────────────────────────
// Scores each eligible selected subject and picks the best paper target.

export function selectWeekendPaperSubject(learningState, userProfile, date) {
  const subjects   = userProfile.selectedSubjects || ALL_SUBJECTS
  const candidates = subjects.filter(s => subjectHasPaperPractice(s, learningState))

  if (!candidates.length) return subjects[0] || ALL_SUBJECTS[0]

  return candidates
    .map(subject => ({
      subject,
      score:
        paperPracticeWeight(subject)
        + weaknessBoost(subject, learningState)
        + daysSinceLastPaperBoost(subject, learningState, date)
        + coverageReadinessBoost(subject, learningState)
        - recentPaperPenalty(subject, learningState, date),
    }))
    .sort((a, b) => b.score - a.score)[0].subject
}

// ─── calculatePaperMistakeSeverity ───────────────────────────────────────────
// Derives severity from marks lost and error type.
// High: large portion of marks lost, or technique error with ≥40% loss.

export function calculatePaperMistakeSeverity(questionResult) {
  const lostMarks = questionResult.marksAvailable - questionResult.marksScored
  const lostRatio = lostMarks / Math.max(questionResult.marksAvailable, 1)

  const TECHNIQUE_ERRORS = ['poorExamTechnique', 'timing', 'noEvidence', 'didNotEvaluate', 'tooVague']

  if (lostRatio >= 0.8) return 'high'
  if (lostRatio >= 0.4 && TECHNIQUE_ERRORS.includes(questionResult.errorType)) return 'high'
  if (lostRatio >= 0.4) return 'medium'
  return 'low'
}

// ─── selectHighestValuePaperRepair ────────────────────────────────────────────
// Picks the highest-priority weak point to repair after a paper, weighting by
// severity and marks lost on the matching question if available.

export function selectHighestValuePaperRepair(weakPoints, paperResult) {
  if (!weakPoints || !weakPoints.length) return null

  const { questionResults = [] } = paperResult || {}

  const scored = weakPoints.map(wp => {
    let score = 0
    if (wp.severity === 'high')        score += 10
    else if (wp.severity === 'medium') score += 6
    else                               score += 3

    const related = questionResults.find(
      q => q.topic === wp.topic || q.skillTag === wp.skillTag
    )
    if (related) score += (related.marksAvailable - related.marksScored)

    return { ...wp, _score: score }
  })

  const best = scored.sort((a, b) => b._score - a._score)[0]
  const { _score, ...wp } = best
  return wp
}

// ─── buildPaperReviewSummary ──────────────────────────────────────────────────
// After marking, identifies the top mistake pattern, highest-value repair,
// and one quick win. Keeps review focused — not a list of every failure.

export function buildPaperReviewSummary(paperResult, weakPoints) {
  const { questionResults = [] } = paperResult
  const incorrect = questionResults.filter(q => q.marksScored < q.marksAvailable)

  const errorCounts = {}
  incorrect.forEach(q => {
    if (q.errorType) errorCounts[q.errorType] = (errorCounts[q.errorType] || 0) + 1
  })

  const topEntry = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]
  const topMistakePattern = topEntry ? topEntry[0] : 'knowledgeGap'

  const subjectWeak = weakPoints.filter(
    wp => wp.subject === paperResult.subject && wp.status !== 'resolved'
  )
  const highestValueRepair = selectHighestValuePaperRepair(subjectWeak, paperResult)

  const quickWinQ = incorrect
    .filter(q => (q.marksAvailable - q.marksScored) <= 2 && q.errorType === 'weakMethod')
    .sort((a, b) => (b.marksAvailable - b.marksScored) - (a.marksAvailable - a.marksScored))[0]

  const quickWin = quickWinQ
    ? { topic: quickWinQ.topic, skillTag: quickWinQ.skillTag, errorType: 'weakMethod' }
    : (subjectWeak.find(wp => wp.severity === 'low') || null)

  return { topMistakePattern, highestValueRepair, quickWin }
}

// ─── calculateSubjectBoostsFromPaper ─────────────────────────────────────────
// Returns a { [subject]: number } map of next-week priority boosts proportional
// to marks lost.

export function calculateSubjectBoostsFromPaper(paperResult) {
  const { subject, marksAvailable = 0, marksScored = 0 } = paperResult
  const lostRatio = marksAvailable > 0 ? (marksAvailable - marksScored) / marksAvailable : 0
  return { [subject]: Math.round(lostRatio * 15) }
}

// ─── processPaperResults ─────────────────────────────────────────────────────
// Pure: takes a completed paperResult and the current learningState.
// Returns updated weakPoints and metadata — does NOT write to storage.

export function processPaperResults(paperResult, learningState) {
  const { questionResults = [] } = paperResult
  let state = { ...learningState, weakPoints: learningState.weakPoints || [] }

  for (const q of questionResults) {
    state = createOrUpdateWeakPoint(state, {
      subject:   paperResult.subject,
      topic:     q.topic,
      skillTag:  q.skillTag || null,
      errorType: q.errorType || null,
      correct:   q.marksScored >= q.marksAvailable,
      answeredAt: paperResult.completedAt,
    })
  }

  const subjectWeakPoints = state.weakPoints.filter(
    wp => wp.subject === paperResult.subject && wp.status !== 'resolved'
  )

  const nextWeekBoosts     = calculateSubjectBoostsFromPaper(paperResult)
  const recommendedRepair  = selectHighestValuePaperRepair(subjectWeakPoints, paperResult)
  const reviewSummary      = buildPaperReviewSummary(paperResult, state.weakPoints)

  return { weakPoints: state.weakPoints, nextWeekBoosts, recommendedRepair, reviewSummary }
}

// ─── applyPaperResultToLearningState ─────────────────────────────────────────
// Pure: integrates a paper result into learningState.
// Caller is responsible for persisting the returned state.

export function applyPaperResultToLearningState(learningState, paperResult) {
  const state     = { ...learningState, weakPoints: learningState.weakPoints || [] }
  const processed = processPaperResults(paperResult, state)

  return {
    ...state,
    weakPoints:    processed.weakPoints,
    paperResults:  [...(learningState.paperResults || []), paperResult],
    subjectBoosts: {
      ...(learningState.subjectBoosts || {}),
      ...processed.nextWeekBoosts,
    },
  }
}
