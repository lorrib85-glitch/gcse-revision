// Pure logic module — builds Home's "Today's plan" task carousel.
// See docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md

import { MODULES } from './modules.js'
import { getModuleState, getInProgressModule, todayStr, getScores } from './progress.js'
import { getBiggestWin, getWeakestSubject } from './unifiedWeaknessTracker.js'
import { findTaggedScreen } from './data/tagModuleMap.js'
import { MEDICINE_2023_PAPER } from './data/medicineExamPapers.js'
import { getJson, setJson } from './lib/storage.js'

const REVISIT_MEMORY_KEY = 'gcse_todays_plan_revisit'
const PAPER_SUBJECTS = ['Maths', 'English', 'Sociology', 'Chemistry', 'History']

function readRevisitMemory() {
  return getJson(REVISIT_MEMORY_KEY, null)
}

function writeRevisitMemory(topic) {
  setJson(REVISIT_MEMORY_KEY, { date: todayStr(), topic })
}

// ISO 8601 week number — used for the weekend full-paper subject rotation.
function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

function buildWarmupCard() {
  return {
    type: 'warmup',
    kicker: 'Warm up',
    title: '90s warm up',
    reason: 'Mixed questions to start the day.',
    durationMinutes: 2,
    image: '/headers/pulse-90s-recall.png',
    onSelect: { kind: 'quickfire' },
  }
}

// The biggest-win weak topic for today's revisit slot, with soft
// repeat-avoidance — skip to the next candidate if the same topic was
// already shown as today's revisit yesterday.
function pickRevisitCandidate() {
  const win = getBiggestWin()
  if (!win) return null
  const stored = readRevisitMemory()
  if (stored && stored.topic === win.topic && stored.date !== todayStr()) {
    return getBiggestWin(win.topic)
  }
  return win
}

function buildRevisitCard(win) {
  const mod = MODULES.find(m => m.id === win.moduleId)
  const screenIndex = mod ? findTaggedScreen(mod, win.topic) : undefined
  writeRevisitMemory(win.topic)
  return {
    type: 'revisit',
    kicker: 'Revisit',
    title: win.label,
    reason: win.reasonText,
    durationMinutes: 5,
    image: mod?.headerImage || null,
    onSelect: { kind: 'module', moduleId: win.moduleId, screenIndex },
  }
}

function buildContinueCard(mod) {
  const state = getModuleState(mod.id)
  const remaining = Math.max(1, (mod.screenCount || 1) - (state.screen || 0))
  return {
    type: 'continue',
    kicker: 'Continue',
    title: mod.title,
    reason: `${remaining} screen${remaining === 1 ? '' : 's'} left in this module.`,
    durationMinutes: Math.round(remaining * 2.5),
    image: mod.headerImage || null,
    onSelect: { kind: 'module', moduleId: mod.id },
  }
}

function buildPracticeCard(subject, durationMinutes, weakInfo) {
  const isRandom = subject === 'Random'
  const title = isRandom ? 'Mixed practice' : `${subject} practice`
  let reason
  if (weakInfo && weakInfo.subject === subject && weakInfo.wrongCount) {
    reason = `${weakInfo.wrongCount} wrong answer${weakInfo.wrongCount === 1 ? '' : 's'} recently in ${subject}.`
  } else {
    reason = isRandom ? 'A mixed round across your subjects.' : `Sharpen up your ${subject} before it slips.`
  }
  return {
    type: 'practice',
    kicker: 'Practice',
    title,
    reason,
    durationMinutes,
    // title/origin flow through to Exam Mode (see resolveTaskDestination,
    // LegacyApp's examAutoStart, ExamMode's startExamRound) so a
    // Home-launched practice round keeps this card's own light framing
    // instead of Exam Mode's default "Exam Sprint" wording.
    onSelect: { kind: 'practice', subject, title, origin: 'home' },
  }
}

function buildWeekendPaperCard() {
  const subject = PAPER_SUBJECTS[isoWeekNumber(new Date()) % PAPER_SUBJECTS.length]

  if (subject === 'History') {
    const paperQuestions = MEDICINE_2023_PAPER.questions.map(q => ({
      id: q.id,
      q: q.q,
      marks: q.marks,
      type: q.type,
      ms: q.ms,
      commandWord: q.commandWord,
      topic: q.topic,
      subject: q.subject,
      extract: q.extract,
      sectionHeader: q.sectionHeader,
      sectionNote: q.sectionNote,
      sourcesBooklet: q.sourcesBooklet,
      sourceRefs: q.sourceRefs,
      isChoice: q.isChoice,
      choiceHeader: q.choiceHeader,
      spagNote: q.spagNote,
      note: q.note,
    }))
    return {
      type: 'paper',
      kicker: 'This weekend',
      title: `Full ${subject} paper`,
      reason: 'A timed past paper, marked like the real thing.',
      durationMinutes: MEDICINE_2023_PAPER.timeMins,
      image: '/headers/home-exam-paper.png',
      onSelect: {
        kind: 'paper', subject, isTimedPaper: true,
        durationSeconds: MEDICINE_2023_PAPER.timeMins * 60,
        paperQuestions, title: MEDICINE_2023_PAPER.title,
      },
    }
  }

  return {
    type: 'paper',
    kicker: 'This weekend',
    title: `Full ${subject} paper`,
    reason: 'A timed past paper, marked like the real thing.',
    durationMinutes: 50,
    image: '/headers/home-exam-paper.png',
    onSelect: {
      kind: 'paper', subject, isTimedPaper: true,
      durationSeconds: 50 * 60,
      paperQuestions: null, title: `${subject} Practice Paper`,
    },
  }
}

// Same-day completion check for a Today's-plan card — derived entirely from
// the existing score log (src/progress.js) so a completed task can show a
// "done today" state without any new storage key. Only warm-up and
// practice/paper cards route through a scored round (Quick Fire / Exam
// Mode), so those are the only types currently trackable; continue/revisit
// cards have no date-stamped signal in module state and are left alone.
// Practice and paper rounds are matched separately (ExamMode tags paper-round
// scores with source 'exam-paper', practice rounds with 'exam') so a Random
// practice round that happens to draw a question in today's weekend-paper
// subject can't falsely mark that paper card done, and vice versa.
export function isTaskDoneToday(task) {
  const today = todayStr()
  const scores = getScores()

  if (task.type === 'warmup') {
    return scores.some(s => s.date === today && s.subject === 'Quick Fire')
  }
  if (task.type === 'practice' || task.type === 'paper') {
    const subject = task.onSelect?.subject
    const source = task.type === 'paper' ? 'exam-paper' : 'exam'
    return scores.some(s => s.date === today && s.source === source && (subject === 'Random' || s.subject === subject))
  }
  return false
}

// The next incomplete plan item — drives the Home hero banner. Tolerates
// both the live task shape (doneToday) and any future planner-engine shape
// (completed / status), per the dynamic-planner Home spec.
export function getNextPlannerItem(plan) {
  return plan.find(t => !(t.doneToday || t.completed || t.status === 'done')) ?? null
}

// Subject for a plan task: practice/paper cards carry it on onSelect;
// module-backed cards (revisit/continue) resolve it via MODULES metadata;
// the mixed warm-up has none. 'Random' practice reads as 'Mixed' in the UI.
export function getTaskSubject(task) {
  const selectSubject = task?.onSelect?.subject
  if (selectSubject) return selectSubject === 'Random' ? 'Mixed' : selectSubject
  const moduleId = task?.onSelect?.moduleId
  if (moduleId) return MODULES.find(m => m.id === moduleId)?.subject ?? null
  return null
}

// Builds the ordered "Today's plan" task list: warm-up, two dynamic slots
// sized toward ~60 minutes total, plus a weekend full-paper card on
// Saturday/Sunday.
export function buildTodaysPlan() {
  const plan = [buildWarmupCard()]
  let slot2, slot3

  // adaptiveExamQuestions() always builds a fixed 10-question round — 15
  // minutes is an honest estimate for any practice card, not a
  // budget-derived guess the actual session ignores.
  const PRACTICE_MINUTES = 15

  const revisitWin = pickRevisitCandidate()

  if (revisitWin) {
    slot2 = buildRevisitCard(revisitWin)

    const continueMod = getInProgressModule()
    if (continueMod) {
      slot3 = buildContinueCard(continueMod)
    } else {
      const weakest = getWeakestSubject()
      slot3 = buildPracticeCard(weakest?.subject || 'Random', PRACTICE_MINUTES, weakest)
    }
  } else {
    const continueMod = getInProgressModule()
    if (continueMod) {
      slot2 = buildContinueCard(continueMod)

      const weakest = getWeakestSubject()
      slot3 = buildPracticeCard(weakest?.subject || 'Random', PRACTICE_MINUTES, weakest)
    } else {
      const weakest = getWeakestSubject()
      if (!weakest) {
        // Brand-new learner — no weak-topic data yet to pick a distinct
        // slot 3 subject from. Land on a specific compulsory subject instead
        // of a second identical "Mixed practice" card (the redesign spec
        // requires slots 2 and 3 not to land on the same subject/type).
        slot2 = buildPracticeCard('Random', PRACTICE_MINUTES, null)
        slot3 = buildPracticeCard('Maths', PRACTICE_MINUTES, null)
        slot3.reason = 'A first look at GCSE Maths questions.'
      } else {
        slot2 = buildPracticeCard(weakest.subject, PRACTICE_MINUTES, weakest)

        const weakest2 = getWeakestSubject(weakest.subject)
        slot3 = buildPracticeCard(weakest2?.subject || 'Random', PRACTICE_MINUTES, weakest2)
      }
    }
  }

  plan.push(slot2, slot3)

  if ([0, 6].includes(new Date().getDay())) {
    plan.push(buildWeekendPaperCard())
  }

  plan.forEach(task => { task.doneToday = isTaskDoneToday(task) })

  return plan
}
