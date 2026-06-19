// Pure logic module — builds Home's "Today's plan" task carousel.
// See docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md

import { MODULES } from './modules.js'
import { getModuleState, getInProgressModule, todayStr } from './progress.js'
import { getBiggestWin, getWeakestSubject } from './unifiedWeaknessTracker.js'
import { findTaggedScreen } from './data/tagModuleMap.js'
import { MEDICINE_2023_PAPER } from './data/medicineExamPapers.js'

const REVISIT_MEMORY_KEY = 'gcse_todays_plan_revisit'
const PAPER_SUBJECTS = ['Maths', 'English', 'Sociology', 'Chemistry', 'History']

function readRevisitMemory() {
  try { return JSON.parse(localStorage.getItem(REVISIT_MEMORY_KEY) || 'null') } catch { return null }
}

function writeRevisitMemory(topic) {
  try { localStorage.setItem(REVISIT_MEMORY_KEY, JSON.stringify({ date: todayStr(), topic })) } catch {}
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
    onSelect: { kind: 'practice', subject },
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
      image: '/headers/history-medicine-through-time.png',
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
    onSelect: {
      kind: 'paper', subject, isTimedPaper: true,
      durationSeconds: 50 * 60,
      paperQuestions: null, title: `${subject} Practice Paper`,
    },
  }
}

// Builds the ordered "Today's plan" task list: warm-up, two dynamic slots
// sized toward ~60 minutes total, plus a weekend full-paper card on
// Saturday/Sunday.
export function buildTodaysPlan() {
  const plan = [buildWarmupCard()]
  let runningTotal = 2
  let slot2, slot3
  const practiceSlots = []

  const revisitWin = pickRevisitCandidate()

  if (revisitWin) {
    slot2 = buildRevisitCard(revisitWin)
    runningTotal += 5

    const continueMod = getInProgressModule()
    if (continueMod) {
      slot3 = buildContinueCard(continueMod)
      runningTotal += slot3.durationMinutes
    } else {
      const weakest = getWeakestSubject()
      practiceSlots.push({ which: 'slot3', subject: weakest?.subject || 'Random', weakInfo: weakest })
    }
  } else {
    const continueMod = getInProgressModule()
    if (continueMod) {
      slot2 = buildContinueCard(continueMod)
      runningTotal += slot2.durationMinutes

      const weakest = getWeakestSubject()
      practiceSlots.push({ which: 'slot3', subject: weakest?.subject || 'Random', weakInfo: weakest })
    } else {
      const weakest = getWeakestSubject()
      const subject2 = weakest?.subject || 'Random'
      practiceSlots.push({ which: 'slot2', subject: subject2, weakInfo: weakest })

      const weakest2 = getWeakestSubject(subject2)
      practiceSlots.push({ which: 'slot3', subject: weakest2?.subject || 'Random', weakInfo: weakest2 })
    }
  }

  if (practiceSlots.length) {
    const remainingBudget = Math.max(0, 60 - runningTotal)
    const perCard = remainingBudget / practiceSlots.length
    const questionCount = Math.min(15, Math.max(6, Math.round(perCard / 1.5)))
    const durationMinutes = Math.round(questionCount * 1.5)
    practiceSlots.forEach(({ which, subject, weakInfo }) => {
      const card = buildPracticeCard(subject, durationMinutes, weakInfo)
      if (which === 'slot2') slot2 = card
      else slot3 = card
    })
  }

  plan.push(slot2, slot3)

  if ([0, 6].includes(new Date().getDay())) {
    plan.push(buildWeekendPaperCard())
  }

  return plan
}
