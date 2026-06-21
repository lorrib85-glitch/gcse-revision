// ─── Adaptive Daily Revision Planner ─────────────────────────────────────────
// Pure, testable logic for building a prioritised daily revision plan.
//
// Data contracts
// ──────────────
// userProfile: {
//   selectedSubjects: string[],   // subset of ALL_SUBJECTS the learner studies
//   weekdayMinutes: number,        // session budget Mon-Fri (default 60)
//   weekendMinutes: number,        // session budget Sat-Sun (default 90)
//   name: string,
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
//   date:            string,          // YYYY-MM-DD
//   mode:            'weekday' | 'weekend',
//   mainSubject:     string,
//   secondarySubject: string | null,
//   totalMinutes:    number,
//   blocks:          PlanBlock[],
// }
//
// PlanBlock: {
//   kind:            'warmup' | 'continue' | 'new_module' | 'revisit' | 'practice' | 'paper',
//   subject:         string,
//   durationMinutes: number,
//   moduleId?:       string,
//   screenIndex?:    number,
//   topic?:          string,
//   reason:          string,
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

// Penalty applied to a subject that was the main subject N days ago
const ROTATION_PENALTY_TODAY    = -6  // was main yesterday
const ROTATION_PENALTY_2DAY     = -3  // was main 2 days ago
const ROTATION_WINDOW_DAYS      = 14  // how many days of rotation history to keep

// Mastery thresholds (mirrors unifiedWeaknessTracker logic)
const MASTERY_ERROR_RATE_MAX    = 0.2
const MASTERY_MIN_ATTEMPTS      = 3

// ─── Date helpers ─────────────────────────────────────────────────────────────

function dateStr(date) {
  return date.toISOString().slice(0, 10)
}

function offsetDateStr(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadRotationHistory() {
  return getObject(PLANNER_ROTATION_KEY)
}

function saveRotationEntry(date, main, secondary) {
  const today = dateStr(date)
  const history = loadRotationHistory()
  history[today] = { main, secondary: secondary || null }

  // Prune to rolling ROTATION_WINDOW_DAYS window
  const cutoff = offsetDateStr(date, -ROTATION_WINDOW_DAYS)
  const pruned = {}
  Object.entries(history).forEach(([d, v]) => {
    if (d >= cutoff) pruned[d] = v
  })
  setJson(PLANNER_ROTATION_KEY, pruned)
}

// ─── loadLearningState ────────────────────────────────────────────────────────
// Reads all relevant localStorage and assembles a normalised learningState.
// This is the only function that touches storage — all planner logic operates
// on the returned object, making each function independently testable.

export function loadLearningState() {
  const scores         = getArray(SCORES_KEY)
  const wrongAnswers   = getArray(WRONG_ANSWERS_KEY)
  const correctAnswers = getArray(CORRECT_ANSWERS_KEY)
  const progress       = getObject(PROGRESS_KEY)
  const rotationHistory = loadRotationHistory()

  // Build per-module states from localStorage keys
  const moduleStates = {}
  MODULES.forEach(m => {
    moduleStates[m.id] = getObject('gcse_module_' + m.id)
  })

  return { scores, wrongAnswers, correctAnswers, moduleStates, rotationHistory, progress }
}

// ─── loadUserProfile ──────────────────────────────────────────────────────────
// Reads the user's identity and planner preferences.
// Preferences default to all subjects + standard session budgets if not set.

export function loadUserProfile() {
  const user  = getObject(USER_KEY)
  const prefs = getObject(PLANNER_PREFS_KEY)
  return {
    selectedSubjects: prefs.selectedSubjects || ALL_SUBJECTS,
    weekdayMinutes:   prefs.weekdayMinutes   ?? 60,
    weekendMinutes:   prefs.weekendMinutes   ?? 90,
    name:             user.name              || '',
  }
}

// ─── getPlanningMode ──────────────────────────────────────────────────────────
// Returns 'weekend' on Saturday (6) and Sunday (0), otherwise 'weekday'.
// userProfile is accepted for future overrides (e.g. custom study days).

export function getPlanningMode(date, _userProfile) {
  return [0, 6].includes(date.getDay()) ? 'weekend' : 'weekday'
}

// ─── Per-subject analysis helpers ─────────────────────────────────────────────

// Count unmastered wrong answers for a subject.
// A topic is mastered if errorRate < MASTERY_ERROR_RATE_MAX AND attempts >= min.
function subjectWeaknessScore(subject, learningState) {
  const wrong   = learningState.wrongAnswers.filter(w => w.subject === subject)
  const correct = learningState.correctAnswers.filter(c => c.subject === subject)

  // Build per-topic attempt counts
  const topics = {}
  wrong.forEach(w => {
    if (!topics[w.topic]) topics[w.topic] = { wrong: 0, correct: 0 }
    topics[w.topic].wrong++
  })
  correct.forEach(c => {
    if (!topics[c.topic]) topics[c.topic] = { wrong: 0, correct: 0 }
    topics[c.topic].correct++
  })

  // Count topics that are still weak (not yet mastered)
  let unmasteredCount = 0
  Object.values(topics).forEach(({ wrong: w, correct: c }) => {
    const total = w + c
    const errorRate = total > 0 ? w / total : 1
    const mastered = errorRate < MASTERY_ERROR_RATE_MAX && total >= MASTERY_MIN_ATTEMPTS
    if (!mastered && w >= 1) unmasteredCount++
  })

  return unmasteredCount
}

// Days since the learner last scored anything in a subject. Returns Infinity
// if never studied.
function daysSinceStudied(subject, learningState, date) {
  const today = dateStr(date)
  const lastEntry = learningState.scores
    .filter(s => s.subject === subject)
    .sort((a, b) => b.date.localeCompare(a.date))[0]
  if (!lastEntry) return Infinity
  const diffMs = new Date(today) - new Date(lastEntry.date)
  return Math.floor(diffMs / 86400000)
}

// Whether a subject has any in-progress (started but not complete) module.
function hasInProgressModule(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return false
  return group.chapterIds.some(id => {
    const state = learningState.moduleStates[id] || {}
    return state.screen > 0 && !state.completed
  })
}

// First in-progress module metadata for a subject (using MODULE_GROUPS order).
function getInProgressModuleForSubject(subject, learningState) {
  const group = MODULE_GROUPS.find(g => g.subject === subject)
  if (!group) return null
  const moduleId = group.chapterIds.find(id => {
    const state = learningState.moduleStates[id] || {}
    return state.screen > 0 && !state.completed
  })
  return moduleId ? MODULES.find(m => m.id === moduleId) || null : null
}

// First unstarted module metadata for a subject (using MODULE_GROUPS order).
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
// Returns a numeric priority score for a subject. Higher = more urgent.
// Used to rank subjects for main/secondary slot selection.
//
// Scoring breakdown:
//   weakness:       0–10   unmastered weak topics × 1.5 (capped)
//   recency:        0–6    days since last studied (graduated scale)
//   in-progress:    +3     has an in-progress module (continuity bonus)
//   never studied:  +4     no scores ever recorded (encourage exploration)
//   rotation:       -3–-6  was main subject recently (rotation penalty)

export function calculateSubjectPriority(subject, learningState, date) {
  let score = 0

  // Weakness score (capped at 10)
  const weakCount = subjectWeaknessScore(subject, learningState)
  score += Math.min(10, weakCount * 1.5)

  // Recency score
  const days = daysSinceStudied(subject, learningState, date)
  if (days === Infinity) {
    score += 4  // never studied
  } else if (days >= 7) {
    score += 6
  } else if (days >= 5) {
    score += 4
  } else if (days >= 3) {
    score += 3
  } else if (days >= 2) {
    score += 2
  } else if (days >= 1) {
    score += 1
  }
  // days === 0: studied today, no bonus

  // In-progress continuity bonus
  if (hasInProgressModule(subject, learningState)) {
    score += 3
  }

  // Rotation penalty — penalise recent main-subject repeats
  const today = dateStr(date)
  const yesterday = offsetDateStr(date, -1)
  const twoDaysAgo = offsetDateStr(date, -2)
  const history = learningState.rotationHistory || {}

  if (history[yesterday]?.main === subject) {
    score += ROTATION_PENALTY_TODAY
  } else if (history[twoDaysAgo]?.main === subject) {
    score += ROTATION_PENALTY_2DAY
  }

  return score
}

// ─── selectMainSubject ────────────────────────────────────────────────────────
// Picks the highest-priority subject from the learner's selected subjects.

export function selectMainSubject(subjects, learningState, date) {
  if (!subjects || subjects.length === 0) return ALL_SUBJECTS[0]

  const ranked = subjects
    .map(s => ({ subject: s, priority: calculateSubjectPriority(s, learningState, date) }))
    .sort((a, b) => b.priority - a.priority)

  return ranked[0].subject
}

// ─── selectSecondarySubject ───────────────────────────────────────────────────
// Picks the highest-priority subject that is not the main subject.
// Returns null if only one subject is available.

export function selectSecondarySubject(subjects, mainSubject, learningState, date) {
  const candidates = (subjects || []).filter(s => s !== mainSubject)
  if (candidates.length === 0) return null

  const ranked = candidates
    .map(s => ({ subject: s, priority: calculateSubjectPriority(s, learningState, date) }))
    .sort((a, b) => b.priority - a.priority)

  return ranked[0].subject
}

// ─── Block builders ───────────────────────────────────────────────────────────

function warmupBlock() {
  return {
    kind: 'warmup',
    subject: 'mixed',
    durationMinutes: 2,
    reason: 'Mixed questions to activate recall before the main session.',
  }
}

function continueBlock(mod, learningState) {
  const state = learningState.moduleStates[mod.id] || {}
  const remaining = Math.max(1, (mod.screenCount || 1) - (state.screen || 0))
  return {
    kind: 'continue',
    subject: mod.subject,
    durationMinutes: Math.min(25, Math.round(remaining * 2.5)),
    moduleId: mod.id,
    reason: `${remaining} screen${remaining === 1 ? '' : 's'} left in "${mod.title}".`,
  }
}

function newModuleBlock(mod) {
  return {
    kind: 'new_module',
    subject: mod.subject,
    durationMinutes: Math.min(25, Math.round((mod.screenCount || 10) * 2.5)),
    moduleId: mod.id,
    reason: `Start "${mod.title}" — next in your ${mod.subject} sequence.`,
  }
}

function practiceBlock(subject, durationMinutes, reason) {
  return {
    kind: 'practice',
    subject,
    durationMinutes,
    reason: reason || `Practice questions to reinforce ${subject}.`,
  }
}

// ─── buildWeekdayBlocks ───────────────────────────────────────────────────────
// Builds an ordered array of plan blocks for a weekday session.
//
// Block ordering:
//   1. Warmup (2 min) — always
//   2. Main subject: continue in-progress module OR start next new module
//   3. Secondary subject: continue in-progress module OR practice questions
//   4. (Overflow) Extra practice for main subject if budget still remains
//
// Total target: userProfile.weekdayMinutes (default 60)

export function buildWeekdayBlocks(mainSubject, secondarySubject, learningState, userProfile) {
  const budget = (userProfile?.weekdayMinutes ?? 60)
  const blocks = []
  let spent = 0

  // 1. Warmup — always first
  const warmup = warmupBlock()
  blocks.push(warmup)
  spent += warmup.durationMinutes

  // 2. Main subject block
  const mainInProgress = getInProgressModuleForSubject(mainSubject, learningState)
  if (mainInProgress) {
    const block = continueBlock(mainInProgress, learningState)
    blocks.push(block)
    spent += block.durationMinutes
  } else {
    const nextNew = getNextNewModuleForSubject(mainSubject, learningState)
    if (nextNew) {
      const block = newModuleBlock(nextNew)
      blocks.push(block)
      spent += block.durationMinutes
    } else {
      // All modules complete — practice slot
      const mins = Math.min(25, Math.max(10, budget - spent - 15))
      const block = practiceBlock(mainSubject, mins)
      blocks.push(block)
      spent += block.durationMinutes
    }
  }

  // 3. Secondary subject block (if one was selected)
  if (secondarySubject && spent < budget) {
    const secondaryInProgress = getInProgressModuleForSubject(secondarySubject, learningState)
    if (secondaryInProgress) {
      const remaining = budget - spent
      const block = continueBlock(secondaryInProgress, learningState)
      block.durationMinutes = Math.min(block.durationMinutes, remaining)
      if (block.durationMinutes >= 5) {
        blocks.push(block)
        spent += block.durationMinutes
      }
    } else {
      const remaining = budget - spent
      const mins = Math.min(20, Math.max(8, remaining))
      if (mins >= 5) {
        blocks.push(practiceBlock(secondarySubject, mins))
        spent += mins
      }
    }
  }

  // 4. Overflow — extra main subject practice if budget allows
  const overflow = budget - spent
  if (overflow >= 8) {
    blocks.push(practiceBlock(mainSubject, overflow, `Extra ${mainSubject} practice to round out the session.`))
  }

  return blocks
}

// ─── buildWeekendBlocks ───────────────────────────────────────────────────────
// Weekend: longer session with an extra practice slot.
// Paper block is intentionally omitted here — caller adds it from todaysPlan.js
// or ExamPractice, since that logic lives closer to the paper data.

export function buildWeekendBlocks(mainSubject, secondarySubject, learningState, userProfile) {
  const budget = (userProfile?.weekendMinutes ?? 90)
  const blocks = []
  let spent = 0

  // 1. Warmup
  const warmup = warmupBlock()
  blocks.push(warmup)
  spent += warmup.durationMinutes

  // 2. Main subject module block
  const mainInProgress = getInProgressModuleForSubject(mainSubject, learningState)
  if (mainInProgress) {
    const block = continueBlock(mainInProgress, learningState)
    blocks.push(block)
    spent += block.durationMinutes
  } else {
    const nextNew = getNextNewModuleForSubject(mainSubject, learningState)
    if (nextNew) {
      const block = newModuleBlock(nextNew)
      blocks.push(block)
      spent += block.durationMinutes
    }
  }

  // 3. Main subject practice (additional depth on weekends)
  if (spent < budget) {
    const mins = Math.min(20, Math.max(10, Math.floor((budget - spent) * 0.4)))
    blocks.push(practiceBlock(mainSubject, mins, `Deeper ${mainSubject} practice — weekend session.`))
    spent += mins
  }

  // 4. Secondary subject
  if (secondarySubject && spent < budget) {
    const secondaryInProgress = getInProgressModuleForSubject(secondarySubject, learningState)
    if (secondaryInProgress) {
      const remaining = budget - spent
      const block = continueBlock(secondaryInProgress, learningState)
      block.durationMinutes = Math.min(block.durationMinutes, remaining)
      if (block.durationMinutes >= 5) {
        blocks.push(block)
        spent += block.durationMinutes
      }
    } else {
      const remaining = budget - spent
      const mins = Math.min(25, Math.max(10, remaining))
      if (mins >= 5) {
        blocks.push(practiceBlock(secondarySubject, mins))
        spent += mins
      }
    }
  }

  return blocks
}

// ─── buildDailyPlan ───────────────────────────────────────────────────────────
// Main entry point. Orchestrates mode detection, subject selection, and block
// generation, then persists today's subject choices to the rotation history.
//
// Parameters:
//   userProfile:   from loadUserProfile() or a test fixture
//   learningState: from loadLearningState() or a test fixture
//   date:          Date object for the plan date (defaults to today)
//
// Returns a DailyPlan object.

export function buildDailyPlan(userProfile, learningState, date = new Date()) {
  const subjects = userProfile?.selectedSubjects?.length
    ? userProfile.selectedSubjects
    : ALL_SUBJECTS

  const mode            = getPlanningMode(date, userProfile)
  const mainSubject     = selectMainSubject(subjects, learningState, date)
  const secondarySubject = selectSecondarySubject(subjects, mainSubject, learningState, date)

  const blocks = mode === 'weekend'
    ? buildWeekendBlocks(mainSubject, secondarySubject, learningState, userProfile)
    : buildWeekdayBlocks(mainSubject, secondarySubject, learningState, userProfile)

  const totalMinutes = blocks.reduce((sum, b) => sum + b.durationMinutes, 0)

  // Persist today's subject choices so future plans can apply rotation penalty
  saveRotationEntry(date, mainSubject, secondarySubject)

  return {
    date: dateStr(date),
    mode,
    mainSubject,
    secondarySubject,
    totalMinutes,
    blocks,
  }
}
