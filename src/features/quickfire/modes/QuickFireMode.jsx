import { useEffect, useState } from 'react'
import { SPACING } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { TYPE } from '../../../constants/typography.js'
import { GENERAL } from '../../../constants/generalTheme.js'
import { recordScore, getAllConfidenceRatings } from '../../../progress.js'
import { logWrongAnswer, logCorrectAnswer, getWeakTopics } from '../../../unifiedWeaknessTracker.js'
import { QUICK_QUIZ_QUESTIONS } from '../../../data/quickQuizData.js'
import { quickFireFromBank } from '../logic/convertBankQuestion.js'
import { qfQuestionId } from '../logic/questionId.js'
import { ALL_MODULE_QUICKFIRE_QUESTIONS } from '../../../data/questionBanks/questionRegistry.js'
import { recordQuestionResult } from '../logic/masteryRecorder.js'
import AnimatedNumber from '../../../components/core/AnimatedNumber.jsx'
import BackButton from '../../../components/core/BackButton.jsx'
import QuickFireQuestionScreen from '../components/QuickFireQuestionScreen.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────

export const QUICK_FIRE_SECONDS = 90

const QUICK_FIRE_BANK_TYPES = new Set(['mcq', 'truefalse', 'fillgap'])
const QUICK_FIRE_MEMORY_KEY = 'gcse_quickfire_memory_v1'
const QF_QUESTION_HISTORY_KEY = 'gcse_qf_q_history'
const QF_PREV_SESSION_KEY = 'gcse_qf_prev_session'
const QF_BEST_KEY = 'gcse_qf_best'

// ─── Question bank ────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// quickFireFromBank lives in ../logic/convertBankQuestion.js (pure, testable).

// TODO phase 2: Chemistry quickfire questions have no module bank yet — migrate when Chemistry is designed
const CHEMISTRY_QF_PENDING = [
  { q: 'What is the pH of a neutral solution?', options: ['7', '1', '14', '0'], correct: 0, subject: 'Chemistry', topic: 'Acids and Alkalis', moduleId: null, ms: 'Neutral solutions have pH 7.', hint: 'On the pH scale, this number sits exactly halfway between acidic and alkaline.' },
  { q: 'What particle has a negative charge?', options: ['Electron', 'Proton', 'Neutron', 'Nucleus'], correct: 0, subject: 'Chemistry', topic: 'Atomic Structure', moduleId: null, ms: 'Electrons have a negative charge.', hint: 'This subatomic particle orbits the nucleus and has a much smaller mass than a proton or neutron.' },
]

const QUICK_FIRE_QUESTIONS = [
  ...ALL_MODULE_QUICKFIRE_QUESTIONS,
  ...CHEMISTRY_QF_PENDING,
  ...QUICK_QUIZ_QUESTIONS.filter(q => QUICK_FIRE_BANK_TYPES.has(q.type)).map(quickFireFromBank),
]

// ─── Subject metadata ─────────────────────────────────────────────────────────

const QUICK_FIRE_SUBJECT_META = {
  History:      { icon: '🏛️', logo: '/headers/history-main.webp',   color: '#C89B6D', moduleId: 'history-medicine-medieval-beliefs-causes' },
  Maths:        { icon: '✖️', logo: '/headers/maths-main.webp',     color: '#2DD4BF', moduleId: null },
  Sociology:    { icon: '👥', logo: '/headers/sociology-main.webp', color: '#FF5C7A', moduleId: null },
  Chemistry:    { icon: '⚗️', logo: '/headers/chem-logo.webp',      color: '#9B59E8', moduleId: null },
  Biology:      { icon: '🌿', logo: '/headers/bio-main.webp',        color: '#4F8A5B', moduleId: 'sci_bio_w1' },
  English:      { icon: '📘', logo: '/headers/english-main.webp',   color: '#B66DFF', moduleId: null },
  Physics:      { icon: '⚡', logo: '/headers/physics-main.webp',   color: '#3B82F6', moduleId: null },
  'Quick Fire': { icon: '⚡', logo: null,                            color: GENERAL.teal, moduleId: null },
}

// ─── Stats accumulators ───────────────────────────────────────────────────────

function emptyQuickFireStats() {
  return { answered: 0, correct: 0, subjects: {}, topics: {} }
}

function bumpQuickFireBucket(buckets, key, isCorrect, extra = {}) {
  const next = { ...buckets }
  const current = next[key] || { answered: 0, correct: 0, ...extra }
  next[key] = {
    ...current,
    ...extra,
    answered: (current.answered || 0) + 1,
    correct: (current.correct || 0) + (isCorrect ? 1 : 0),
  }
  return next
}

function addQuickFireAnswer(stats, question, isCorrect) {
  const subject = question.subject || 'Quick Fire'
  const topic = question.topic || subject
  const topicKey = subject + '::' + topic
  return {
    answered: stats.answered + 1,
    correct: stats.correct + (isCorrect ? 1 : 0),
    subjects: bumpQuickFireBucket(stats.subjects || {}, subject, isCorrect, { subject }),
    topics: bumpQuickFireBucket(stats.topics || {}, topicKey, isCorrect, {
      key: topicKey, subject, topic,
      moduleId: question.moduleId || null,
    }),
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function readQuickFireMemory() {
  try {
    return JSON.parse(localStorage.getItem(QUICK_FIRE_MEMORY_KEY) || '{"subjects":{},"topics":{}}')
  } catch {
    return { subjects: {}, topics: {} }
  }
}

function mergeQuickFireBuckets(memoryBuckets = {}, roundBuckets = {}) {
  const merged = { ...memoryBuckets }
  Object.entries(roundBuckets).forEach(([key, value]) => {
    const current = merged[key] || { ...value, answered: 0, correct: 0 }
    merged[key] = {
      ...current,
      ...value,
      answered: (current.answered || 0) + (value.answered || 0),
      correct: (current.correct || 0) + (value.correct || 0),
    }
  })
  return merged
}

function saveQuickFireMemory(roundStats) {
  const memory = readQuickFireMemory()
  const next = {
    subjects: mergeQuickFireBuckets(memory.subjects, roundStats.subjects),
    topics: mergeQuickFireBuckets(memory.topics, roundStats.topics),
    updatedAt: new Date().toISOString(),
  }
  try { localStorage.setItem(QUICK_FIRE_MEMORY_KEY, JSON.stringify(next)) } catch {}
  return next
}

function bucketAccuracy(bucket) {
  return bucket?.answered ? Math.round((bucket.correct / bucket.answered) * 100) : 0
}

function rankedQuickFireSubjects(memory, roundStats) {
  const subjects = mergeQuickFireBuckets(memory.subjects, roundStats.subjects)
  return Object.entries(subjects)
    .map(([subject, bucket]) => ({
      subject,
      icon: QUICK_FIRE_SUBJECT_META[subject]?.icon || '📚',
      color: QUICK_FIRE_SUBJECT_META[subject]?.color || '#9CA8C7',
      moduleId: QUICK_FIRE_SUBJECT_META[subject]?.moduleId || null,
      answered: bucket.answered || 0,
      correct: bucket.correct || 0,
      accuracy: bucketAccuracy(bucket),
    }))
    .filter(item => item.answered > 0)
    .sort((a, b) => b.answered - a.answered)
}

function confidencePriorityForModule(moduleId) {
  if (!moduleId) return 0
  const rating = getAllConfidenceRatings().find(item => item.moduleId === moduleId)
  if (!rating) return 0
  if (rating.confidence === 'confused') return 4
  if (rating.confidence === 'clicking') return 2
  return 0
}

function withShuffledQfOptions(q) {
  const indexed = q.options.map((text, i) => ({ text, isCorrect: i === q.correct }))
  const shuffled = shuffle(indexed)
  return { ...q, options: shuffled.map(o => o.text), correct: shuffled.findIndex(o => o.isCorrect) }
}

function prioritizedQuickFireQuestions() {
  const memory = readQuickFireMemory()
  const qHist = readQfQuestionHistory()
  const shuffled = [...QUICK_FIRE_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled
    .map(question => {
      const prevResult = qHist[qfQuestionId(question)]?.lastResult
      const subjectBucket = memory.subjects?.[question.subject]
      const topicBucket = memory.topics?.[question.subject + '::' + question.topic]
      const subjectWeakness = subjectBucket?.answered ? Math.max(0, 70 - bucketAccuracy(subjectBucket)) / 10 : 0
      const topicWeakness = topicBucket?.answered ? Math.max(0, 75 - bucketAccuracy(topicBucket)) / 8 : 0
      const confidenceBoost = confidencePriorityForModule(question.moduleId)
      const wrongBoost = prevResult === 'incorrect' ? 3.5 : 0
      const correctPenalty = prevResult === 'correct' ? -1.0 : 0
      return { question, score: subjectWeakness + topicWeakness + confidenceBoost + wrongBoost + correctPenalty }
    })
    .sort((a, b) => b.score - a.score)
    .map(item => withShuffledQfOptions(item.question))
}

function pickQuickFireRecommendation(memory, roundStats) {
  const topics = mergeQuickFireBuckets(memory.topics, roundStats.topics)
  const weakTopic = Object.values(topics)
    .filter(topic => (topic.answered || 0) > 0)
    .sort((a, b) => {
      const accuracyGap = bucketAccuracy(a) - bucketAccuracy(b)
      if (accuracyGap !== 0) return accuracyGap
      return (b.answered || 0) - (a.answered || 0)
    })[0]

  if (weakTopic) {
    return {
      subject: weakTopic.subject,
      topic: weakTopic.topic,
      moduleId: weakTopic.moduleId || QUICK_FIRE_SUBJECT_META[weakTopic.subject]?.moduleId || null,
      accuracy: bucketAccuracy(weakTopic),
      answered: weakTopic.answered || 0,
    }
  }

  return { subject: 'Biology', topic: 'Photosynthesis', moduleId: 'sci_bio_w1', accuracy: 0, answered: 0 }
}

// ─── Per-question history ─────────────────────────────────────────────────────

// qfQuestionId lives in ../logic/questionId.js (pure, testable).

function readQfQuestionHistory() {
  try { return JSON.parse(localStorage.getItem(QF_QUESTION_HISTORY_KEY) || '{}') } catch { return {} }
}

function updateQfQuestionHistory(q, isCorrect) {
  const id = qfQuestionId(q)
  if (!id) return
  const hist = readQfQuestionHistory()
  const prev = hist[id] || { attempts: 0, correct: 0, lastResult: null }
  hist[id] = { attempts: prev.attempts + 1, correct: prev.correct + (isCorrect ? 1 : 0), lastResult: isCorrect ? 'correct' : 'incorrect' }
  try { localStorage.setItem(QF_QUESTION_HISTORY_KEY, JSON.stringify(hist)) } catch {}
}

function wasQfPrevWrong(q) {
  return readQfQuestionHistory()[qfQuestionId(q)]?.lastResult === 'incorrect'
}

function readQfPrevSession() {
  try { return JSON.parse(localStorage.getItem(QF_PREV_SESSION_KEY) || 'null') } catch { return null }
}

function saveQfPrevSession(accuracy, answered) {
  try { localStorage.setItem(QF_PREV_SESSION_KEY, JSON.stringify({ accuracy, answered, date: new Date().toISOString() })) } catch {}
}

export function readQfBest() {
  try { return JSON.parse(localStorage.getItem(QF_BEST_KEY) || 'null') } catch { return null }
}

function saveQfBestIfBeaten(correct, answered) {
  const best = readQfBest()
  if (!best || correct > best.correct) {
    try { localStorage.setItem(QF_BEST_KEY, JSON.stringify({ correct, answered, date: new Date().toISOString() })) } catch {}
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

// Owns the full 90-second Quick Fire session: countdown → questions → summary.
// TestTab renders this component for the active session; the landing screen stays in TestTab.
// Props:
//   onExit — called when the user presses BackButton on the summary to return to the landing
export function QuickFireMode({ onExit }) {
  const [qIdx, setQIdx] = useState(0)
  const [quickFireTimeLeft, setQuickFireTimeLeft] = useState(QUICK_FIRE_SECONDS)
  const [quickFireActive, setQuickFireActive] = useState(false)
  const [quickFireFinished, setQuickFireFinished] = useState(false)
  const [quickFireStats, setQuickFireStats] = useState(() => emptyQuickFireStats())
  const [quickFireQuestionSet, setQuickFireQuestionSet] = useState(() => prioritizedQuickFireQuestions())
  const [quickFireSummary, setQuickFireSummary] = useState(null)
  const [quickFireCountdown, setQuickFireCountdown] = useState(3)
  const [qfConsecutiveWrong, setQfConsecutiveWrong] = useState(0)

  // 3-2-1-GO countdown
  useEffect(() => {
    if (quickFireCountdown === null) return undefined
    if (quickFireCountdown === 'GO') {
      const t = setTimeout(() => { setQuickFireCountdown(null); setQuickFireActive(true) }, 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setQuickFireCountdown(v => v === 1 ? 'GO' : v - 1), 900)
    return () => clearTimeout(t)
  }, [quickFireCountdown])

  // Timer tick
  useEffect(() => {
    if (!quickFireActive) return undefined
    const timer = setInterval(() => {
      setQuickFireTimeLeft(seconds => Math.max(0, seconds - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [quickFireActive])

  // Time-up handler
  useEffect(() => {
    if (!quickFireActive || quickFireTimeLeft > 0) return
    setQuickFireActive(false)
    setQuickFireFinished(true)
    finishRound('time')
  }, [quickFireActive, quickFireTimeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  function startSession() {
    setQIdx(0)
    setQuickFireTimeLeft(QUICK_FIRE_SECONDS)
    setQuickFireActive(false)
    setQuickFireFinished(true)
    setQuickFireStats(emptyQuickFireStats())
    setQuickFireQuestionSet(prioritizedQuickFireQuestions())
    setQuickFireSummary(null)
    setQuickFireCountdown(3)
    setQfConsecutiveWrong(0)
  }

  function finishRound(reason = 'exit') {
    setQuickFireActive(false)
    setQuickFireFinished(true)
    const memory = saveQuickFireMemory(quickFireStats)
    const accuracy = quickFireStats.answered ? Math.round((quickFireStats.correct / quickFireStats.answered) * 100) : 0
    const prevSession = readQfPrevSession()
    if (quickFireStats.answered > 0) {
      saveQfPrevSession(accuracy, quickFireStats.answered)
      saveQfBestIfBeaten(quickFireStats.correct, quickFireStats.answered)
    }
    setQuickFireSummary({
      reason,
      answered: quickFireStats.answered,
      correct: quickFireStats.correct,
      timeUsed: QUICK_FIRE_SECONDS - quickFireTimeLeft,
      timeLeft: quickFireTimeLeft,
      subjects: rankedQuickFireSubjects(memory, quickFireStats),
      recommendation: pickQuickFireRecommendation(memory, quickFireStats),
      prevAccuracy: (prevSession?.answered >= 3) ? prevSession.accuracy : null,
    })
  }

  function advanceQuestion(total) {
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1)
    } else {
      finishRound('complete')
    }
  }

  // ── Countdown screen ──────────────────────────────────────────────────────────
  if (quickFireCountdown !== null) {
    return (
      <div style={{ minHeight: '100vh', background: `radial-gradient(circle at 50% 25%, rgba(${GENERAL.tealRgb},0.10), transparent 45%), ${GENERAL.neutral[0]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GENERAL.softWhite }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", color: GENERAL.slate, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', fontSize: '.72rem', marginBottom: 24 }}>90 Second Quick Fire</div>
          <div key={quickFireCountdown} style={{ fontFamily: "'Sora', sans-serif", fontSize: quickFireCountdown === 'GO' ? '5rem' : '7.5rem', fontWeight: 900, color: quickFireCountdown === 'GO' ? GENERAL.teal : GENERAL.softWhite, textShadow: quickFireCountdown === 'GO' ? `0 0 32px rgba(${GENERAL.tealRgb},0.4)` : '0 0 32px rgba(255,255,255,0.2)', animation: 'examPop .8s ease both' }}>{quickFireCountdown}</div>
          <div style={{ color: GENERAL.slate, marginTop: 20, fontFamily: "'Sora', sans-serif", fontSize: '.88rem' }}>Answer as many as you can.</div>
          <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.7)} 50%{opacity:1;transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }'}</style>
        </div>
      </div>
    )
  }

  // ── Summary screen ────────────────────────────────────────────────────────────
  if (quickFireSummary) {
    const accuracy = quickFireSummary.answered > 0
      ? Math.round((quickFireSummary.correct / quickFireSummary.answered) * 100)
      : 0
    const feedbackLine = accuracy >= 90 ? 'Excellent recall.'
      : accuracy >= 75 ? 'Sharp recall.'
      : accuracy >= 50 ? 'Nearly there.'
      : 'Worth a quick rebuild.'
    const weakCount = getWeakTopics().length

    return (
      <div style={{
        minHeight: '100vh', background: GENERAL.neutral[0], color: GENERAL.softWhite,
        display: 'flex', flexDirection: 'column',
        padding: `0 ${SPACING.compact}px`,
      }}>
        <div style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)', marginBottom: 8 }}>
          <BackButton onClick={onExit} />
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: GENERAL.slate,
            marginBottom: 14,
          }}>
            Accuracy
          </div>

          <div style={{ ...TYPE.displaySection, fontSize: 88, lineHeight: 0.92, color: GENERAL.teal, marginBottom: 20 }}>
            <AnimatedNumber value={accuracy} />%
          </div>

          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 600,
            color: GENERAL.softWhite, marginBottom: 12,
          }}>
            {feedbackLine}
          </div>

          {weakCount > 0 && (
            <div style={{ ...TYPE.body, fontSize: 14, color: GENERAL.slate }}>
              {weakCount} weak spot{weakCount !== 1 ? 's' : ''} to practise
            </div>
          )}
        </div>

        <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
          <button
            onClick={startSession}
            style={{
              width: '100%', background: GENERAL.teal, color: GENERAL.neutral[0],
              border: 'none', borderRadius: RADII.large,
              padding: '18px 0',
              fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ── Question screen ───────────────────────────────────────────────────────────
  const qfQ = quickFireQuestionSet[qIdx] ? { type: 'mc', marks: 1, ...quickFireQuestionSet[qIdx] } : null
  return (
    <QuickFireQuestionScreen
      key={qIdx}
      q={qfQ}
      timeLeft={quickFireTimeLeft}
      totalSeconds={QUICK_FIRE_SECONDS}
      onExit={() => finishRound('exit')}
      onAnswer={(isCorrect) => {
        setQuickFireStats(stats => addQuickFireAnswer(stats, qfQ, isCorrect))
        updateQfQuestionHistory(qfQ, isCorrect)
        recordQuestionResult(qfQ, isCorrect)
        if (qfQ.type === 'truefalse') {
          const log = isCorrect ? logCorrectAnswer : logWrongAnswer
          log({ subject: qfQ.subject, topic: qfQ.topic, questionText: qfQ.q, source: 'quiz', questionType: 'truefalse' })
        }
        recordScore({ subject: 'Quick Fire', earned: isCorrect ? qfQ.marks : 0, possible: qfQ.marks, source: 'test' })
        if (isCorrect) {
          setQfConsecutiveWrong(0)
        } else {
          const newConsecutive = qfConsecutiveWrong + 1
          setQfConsecutiveWrong(newConsecutive)
          if (newConsecutive >= 3) {
            setQfConsecutiveWrong(0)
            const revisitCandidate = quickFireQuestionSet.slice(qIdx + 2).find(qItem => wasQfPrevWrong(qItem))
            if (revisitCandidate) {
              setQuickFireQuestionSet(prev => {
                const next = [...prev]
                next.splice(qIdx + 1, 0, { ...revisitCandidate, _retryPrevWrong: true })
                return next
              })
            }
          }
        }
      }}
      onAdvance={() => advanceQuestion(quickFireQuestionSet.length)}
    />
  )
}
