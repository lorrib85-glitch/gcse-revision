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
//   type:        string,       // block type identifier (see block type constants below)
//   label:       string,       // human-readable label shown in UI
//   duration:    number,       // minutes allocated to this block
//   subject:     string,       // which subject this block addresses
//   reasonCodes: string[],     // machine-readable reasons for this block's selection
//   moduleId?:   string,       // resolved module for progress-type blocks
//   screenIndex?: number,      // jump target for revisit/repair blocks
// }

import { MODULES } from '../../modules.js'
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

const ROTATION_PENALTY_YESTERDAY = -6  // was main subject yesterday
const ROTATION_PENALTY_2DAY      = -3  // was main subject 2 days ago
const ROTATION_WINDOW_DAYS       = 14  // days of rotation history to retain

const MASTERY_ERROR_RATE_MAX = 0.2
const MASTERY_MIN_ATTEMPTS   = 3

// Block durations — weekday must sum to 60, Saturday to 90, Sunday to 60
const WEEKDAY_DURATIONS = { pulse: 8, mainProgress: 27, weakRepair: 12, examMove: 13 }
const SATURDAY_DURATIONS = { pulse: 15, testPaper: 50, markAndReview: 15, targetedRepair: 10 }
const SUNDAY_DURATIONS = { pulse: 15, carryOverOrProgress: 25, paperMistakeRepair: 10, lightExamPractice: 10 }

// ─── Date helpers ─────────────────────────────────────────────────────────────

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function offsetDateStr(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
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

  const moduleStates = {}
  MODULES.forEach(m => {
    moduleStates[m.id] = getObject('gcse_module_' + m.id)
  })

  return { scores, wrongAnswers, correctAnswers, moduleStates, rotationHistory, progress }
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
  const moduleId = group.chapterIds.find(id => {
    const state = learningState.moduleStates[id] || {}
    return state.screen > 0 && !state.completed
  })
  return moduleId ? MODULES.find(m => m.id === moduleId) || null : null
}

function getNextNewModuleForSubject(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return null
  const moduleId = group.chapterIds.find(id => {
    const state = learningState.moduleStates[id] || {}
    return !state.screen && !state.completed
  })
  return moduleId ? MODULES.find(m => m.id === moduleId) || null : null
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

// ─── buildWeekdayBlocks ───────────────────────────────────────────────────────
// Exactly four blocks: Start Strong → Main Mission → Fix One Thing → Exam Move
// Fixed durations: 8 + 27 + 12 + 13 = 60 minutes

export function buildWeekdayBlocks(mainSubject, secondarySubject, learningState, _userProfile) {
  const pulseSubject = secondarySubject || mainSubject

  const mainMod = getInProgressModuleForSubject(mainSubject, learningState)
              || getNextNewModuleForSubject(mainSubject, learningState)

  const mainReasonCodes = mainMod
    ? ((learningState.moduleStates[mainMod.id]?.screen > 0)
        ? ['IN_PROGRESS_CONTINUITY']
        : ['NEXT_IN_SEQUENCE'])
    : ['SUBJECT_ROTATION']

  return [
    {
      type:        'pulse',
      label:       'Start Strong',
      duration:    WEEKDAY_DURATIONS.pulse,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
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
    },
    {
      type:        'examMove',
      label:       'Exam Move',
      duration:    WEEKDAY_DURATIONS.examMove,
      subject:     mainSubject,
      reasonCodes: ['INTERLEAVE_RELATED_TOPIC'],
    },
  ]
}

// ─── buildSaturdayBlocks ──────────────────────────────────────────────────────
// Saturday = Test Day. Exactly four blocks.
// Durations: 15 + 50 + 15 + 10 = 90 minutes
// Paper selection and mark-and-decode internals are deferred to Part 3.

export function buildSaturdayBlocks(mainSubject, secondarySubject, _learningState, _userProfile) {
  const pulseSubject = secondarySubject || mainSubject
  return [
    {
      type:        'pulse',
      label:       'Pulse Starter',
      duration:    SATURDAY_DURATIONS.pulse,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
    },
    {
      type:        'testPaper',
      label:       'Paper Practice',
      duration:    SATURDAY_DURATIONS.testPaper,
      subject:     mainSubject,
      reasonCodes: ['EXAM_PRACTICE'],
    },
    {
      type:        'markAndReview',
      label:       'Mark & Decode',
      duration:    SATURDAY_DURATIONS.markAndReview,
      subject:     mainSubject,
      reasonCodes: ['EXAM_REVIEW'],
    },
    {
      type:        'targetedRepair',
      label:       'Fix One Thing',
      duration:    SATURDAY_DURATIONS.targetedRepair,
      subject:     mainSubject,
      reasonCodes: ['WEAK_POINT_REPAIR'],
    },
  ]
}

// ─── buildSundayBlocks ────────────────────────────────────────────────────────
// Sunday = Reset Day. Exactly four blocks.
// Durations: 15 + 25 + 10 + 10 = 60 minutes
// Carry-over, paper-mistake repair, and light exam selection deferred to Part 3.

export function buildSundayBlocks(mainSubject, secondarySubject, _learningState, _userProfile) {
  const pulseSubject = secondarySubject || mainSubject
  return [
    {
      type:        'pulse',
      label:       'Pulse',
      duration:    SUNDAY_DURATIONS.pulse,
      subject:     pulseSubject,
      reasonCodes: ['SUBJECT_ROTATION'],
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
      subject:     mainSubject,
      reasonCodes: ['PAPER_MISTAKE_REPAIR'],
    },
    {
      type:        'lightExamPractice',
      label:       'Exam Move',
      duration:    SUNDAY_DURATIONS.lightExamPractice,
      subject:     mainSubject,
      reasonCodes: ['LIGHT_EXAM_PRACTICE'],
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
