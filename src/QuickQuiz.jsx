import { useState, useEffect, useRef, useCallback } from 'react'
import { QUICK_QUIZ_QUESTIONS } from './data/quickQuizData.js'

// ─── Weakness tracking ────────────────────────────────────────────────────────

const WK_KEY = 'gcse_quiz_weaknesses'

function getWeaknesses() {
  try { return JSON.parse(localStorage.getItem(WK_KEY) || '{}') } catch { return {} }
}

function recordAnswer(subject, topic, correct) {
  const w = getWeaknesses()
  const k = `${subject}/${topic}`
  if (!w[k]) w[k] = { c: 0, i: 0 }
  correct ? w[k].c++ : w[k].i++
  localStorage.setItem(WK_KEY, JSON.stringify(w))
}

export function getWeakAreas(top = 5) {
  const w = getWeaknesses()
  return Object.entries(w)
    .map(([key, v]) => {
      const total = v.c + v.i
      return { key, total, errorRate: total > 0 ? v.i / total : 0 }
    })
    .filter(x => x.total > 0)
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, top)
}

// ─── TTS ──────────────────────────────────────────────────────────────────────

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.88
  u.pitch = 1.0
  u.volume = 1.0
  window.speechSynthesis.speak(u)
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

// ─── Question selection ────────────────────────────────────────────────────────

const DIFF_ORDER = ['easy', 'medium', 'hard', 'exam']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function selectSessionQuestions(mode = 'random') {
  const weaknesses = getWeaknesses()
  const all = QUICK_QUIZ_QUESTIONS.map(q => {
    const k = `${q.subject}/${q.topic}`
    const w = weaknesses[k] || { c: 0, i: 0 }
    const total = w.c + w.i
    const errorRate = total > 0 ? w.i / total : 0.5
    return { ...q, _priority: errorRate }
  })

  let session

  if (mode === 'weak') {
    // Find the weakest topics (error rate > 0, sorted worst first)
    const topicScores = {}
    all.forEach(q => {
      const k = `${q.subject}/${q.topic}`
      if (!topicScores[k]) topicScores[k] = q._priority
    })
    const weakTopics = new Set(
      Object.entries(topicScores)
        .filter(([, r]) => r > 0.3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([k]) => k)
    )
    const weakQ  = shuffle(all.filter(q => weakTopics.has(`${q.subject}/${q.topic}`)))
    const otherQ = shuffle(all.filter(q => !weakTopics.has(`${q.subject}/${q.topic}`)))
    // Weak areas first, padded with general questions, across all difficulties
    session = [...weakQ, ...otherQ].slice(0, 26)
  } else {
    // Random: true shuffle, no weighting
    session = shuffle(all).slice(0, 26)
  }

  // Shuffle match/sequence/dragdrop items within each question
  return session.map(q => {
    if (q.type === 'matchpairs') {
      return { ...q, _shuffledRight: shuffle(q.pairs.map((_, i) => i)) }
    }
    if (q.type === 'sequence') {
      return { ...q, _shuffledItems: shuffle(q.items) }
    }
    if (q.type === 'dragdrop') {
      return { ...q, _shuffledItems: shuffle(q.items) }
    }
    if (q.type === 'mcq' || q.type === 'fillgap') {
      // Shuffle options but track correct
      const indexed = q.options.map((text, i) => ({ text, correct: i === q.correctIndex }))
      const sh = shuffle(indexed)
      return { ...q, options: sh.map(o => o.text), correctIndex: sh.findIndex(o => o.correct) }
    }
    return q
  })
}

// ─── Colours ──────────────────────────────────────────────────────────────────

const SUBJECT_COLOUR = {
  History:   { color: '#F5B700', bg: 'rgba(245,183,0,.14)',   border: 'rgba(245,183,0,.3)'   },
  Biology:   { color: '#38D27A', bg: 'rgba(56,210,122,.14)',  border: 'rgba(56,210,122,.3)'  },
  Chemistry: { color: '#38D27A', bg: 'rgba(56,210,122,.14)',  border: 'rgba(56,210,122,.3)'  },
  Maths:     { color: '#3B82FF', bg: 'rgba(59,130,255,.14)',  border: 'rgba(59,130,255,.3)'  },
  English:   { color: '#9D5CFF', bg: 'rgba(157,92,255,.14)',  border: 'rgba(157,92,255,.3)'  },
  Sociology: { color: '#FF5C7A', bg: 'rgba(255,92,122,.14)',  border: 'rgba(255,92,122,.3)'  },
}

const DIFF_COLOUR = {
  easy:   '#4DFF88',
  medium: '#FFC857',
  hard:   '#FF8A1F',
  exam:   '#FF5D73',
}

// ─── Match Pairs ──────────────────────────────────────────────────────────────

function MatchPairs({ q, answered, onAnswer }) {
  const rightOrder = q._shuffledRight || q.pairs.map((_, i) => i)
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [matched, setMatched] = useState({})

  function tapLeft(i) {
    if (answered) return
    setSelectedLeft(prev => prev === i ? null : i)
  }

  function tapRight(ri) {
    if (answered || selectedLeft === null) return
    const newMatched = { ...matched }
    // Remove any existing match for this right slot or this left slot
    for (const k in newMatched) { if (newMatched[k] === ri) delete newMatched[k] }
    delete newMatched[selectedLeft]
    newMatched[selectedLeft] = ri
    setMatched(newMatched)
    setSelectedLeft(null)
    if (Object.keys(newMatched).length === q.pairs.length) {
      const correct = q.pairs.every((_, li) => newMatched[li] === li)
      onAnswer(correct)
    }
  }

  function unpair(li) {
    if (answered) return
    const m = { ...matched }
    delete m[li]
    setMatched(m)
    setSelectedLeft(li)
  }

  const matchedRights = Object.values(matched)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 2 }}>Match from</div>
          {q.pairs.map((pair, li) => {
            const isSelected = selectedLeft === li
            const isMatched = matched[li] !== undefined
            const show = answered
              ? (matched[li] === li ? 'correct' : 'wrong')
              : isSelected ? 'selected' : isMatched ? 'matched' : 'default'
            return (
              <button key={li}
                onClick={() => isMatched && !answered ? unpair(li) : tapLeft(li)}
                style={{
                  padding: '13px 11px', borderRadius: 11, textAlign: 'left',
                  minHeight: 58, fontSize: '.83rem', fontWeight: 600, lineHeight: 1.3,
                  border: `2px solid ${show === 'selected' ? '#9D5CFF' : show === 'matched' ? '#4DFF88' : show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : '#2A3552'}`,
                  background: show === 'selected' ? 'rgba(157,92,255,.12)' : show === 'matched' || show === 'correct' ? 'rgba(77,255,136,.08)' : show === 'wrong' ? 'rgba(255,93,115,.08)' : '#0F1828',
                  color: show === 'selected' ? '#C18CFF' : show === 'matched' || show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : '#E0E6F0',
                  cursor: answered ? 'default' : 'pointer',
                  transition: 'all .15s',
                }}>
                {pair.left}
                {isMatched && !answered && <span style={{ float: 'right', fontSize: '.7rem', opacity: 0.5 }}>✕</span>}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 2 }}>Match to</div>
          {rightOrder.map(ri => {
            const isMatchedToSomething = matchedRights.includes(ri)
            const matchedLeftIdx = parseInt(Object.entries(matched).find(([, r]) => r === ri)?.[0])
            const glow = selectedLeft !== null && !answered
            let show = 'default'
            if (answered) show = (matchedLeftIdx === ri) ? 'correct' : (isMatchedToSomething ? 'wrong' : 'default')
            else if (isMatchedToSomething) show = 'matched'
            else if (glow) show = 'highlight'
            return (
              <button key={ri} onClick={() => tapRight(ri)} style={{
                padding: '13px 11px', borderRadius: 11, textAlign: 'left',
                minHeight: 58, fontSize: '.83rem', fontWeight: 600, lineHeight: 1.3,
                border: `2px solid ${show === 'highlight' ? '#3B82FF55' : show === 'matched' || show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : '#2A3552'}`,
                background: show === 'highlight' ? 'rgba(59,130,255,.07)' : show === 'matched' || show === 'correct' ? 'rgba(77,255,136,.08)' : show === 'wrong' ? 'rgba(255,93,115,.08)' : '#0F1828',
                color: show === 'matched' || show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : '#E0E6F0',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all .15s',
              }}>
                {q.pairs[ri].right}
              </button>
            )
          })}
        </div>
      </div>
      {selectedLeft !== null && !answered && (
        <div style={{ marginTop: 10, padding: '9px 13px', background: 'rgba(59,130,255,.08)', border: '1px solid rgba(59,130,255,.2)', borderRadius: 9, fontSize: '.78rem', color: '#70B8FF' }}>
          "{q.pairs[selectedLeft].left}" selected — now tap a match on the right →
        </div>
      )}
      {Object.keys(matched).length < q.pairs.length && !answered && Object.keys(matched).length > 0 && (
        <div style={{ marginTop: 8, fontSize: '.75rem', color: '#5A6480', textAlign: 'center' }}>
          {q.pairs.length - Object.keys(matched).length} pair{q.pairs.length - Object.keys(matched).length !== 1 ? 's' : ''} remaining
        </div>
      )}
    </div>
  )
}

// ─── Sequence ─────────────────────────────────────────────────────────────────

function Sequence({ q, answered, onAnswer }) {
  const items = q._shuffledItems || [...q.items].sort(() => Math.random() - 0.5)
  const [order, setOrder] = useState([])

  function tap(idx) {
    if (answered) return
    if (order.includes(idx)) {
      setOrder(order.filter(i => i !== idx))
    } else {
      const newOrder = [...order, idx]
      setOrder(newOrder)
      if (newOrder.length === items.length) {
        const userSeq = newOrder.map(i => items[i])
        const correct = userSeq.every((t, pos) => t === q.correctOrder[pos])
        onAnswer(correct)
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, idx) => {
          const pos = order.indexOf(idx)
          const placed = pos !== -1
          let show = 'default'
          if (answered) {
            const correctPos = q.correctOrder.indexOf(item)
            show = (order[correctPos] !== undefined && items[order[correctPos]] === item) ? 'correct' : 'wrong'
          }
          return (
            <button key={idx} onClick={() => tap(idx)} style={{
              padding: '13px 15px', borderRadius: 12, textAlign: 'left',
              minHeight: 60, fontSize: '.88rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1.35,
              border: `2px solid ${show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : placed ? '#9D5CFF' : '#2A3552'}`,
              background: show === 'correct' ? 'rgba(77,255,136,.08)' : show === 'wrong' ? 'rgba(255,93,115,.08)' : placed ? 'rgba(157,92,255,.10)' : '#0F1828',
              color: show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : placed ? '#C18CFF' : '#E0E6F0',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all .15s',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: placed ? '#9D5CFF' : '#1A2338',
                color: placed ? '#fff' : '#5A6480',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.8rem', fontWeight: 800,
              }}>
                {placed ? pos + 1 : '—'}
              </span>
              {item}
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: '.75rem', color: '#5A6480' }}>
        Tap items in order (1st to last). Tap again to remove.
      </div>
    </div>
  )
}

// ─── Categorise (Drag/Drop) ───────────────────────────────────────────────────

const CAT_COLOURS = ['#4DFF88', '#FF5D73', '#3B82FF', '#FFC857']

function Categorise({ q, answered, onAnswer }) {
  const items = q._shuffledItems || shuffle(q.items)
  const [assignments, setAssignments] = useState(
    Object.fromEntries(items.map((_, i) => [i, null]))
  )

  function assign(itemIdx, catIdx) {
    if (answered) return
    const current = assignments[itemIdx]
    const updated = { ...assignments, [itemIdx]: current === catIdx ? null : catIdx }
    setAssignments(updated)
    if (Object.values(updated).every(v => v !== null)) {
      const correct = items.every((item, si) => {
        const origIdx = q.items.indexOf(item)
        return origIdx !== -1 && updated[si] === q.items[origIdx].category
      })
      onAnswer(correct)
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(q.categories.length, 2)}, 1fr)`, gap: 8, marginBottom: 14 }}>
        {q.categories.map((cat, ci) => (
          <div key={ci} style={{
            padding: '10px 12px', borderRadius: 10, textAlign: 'center',
            background: `${CAT_COLOURS[ci]}12`, border: `1.5px solid ${CAT_COLOURS[ci]}40`,
            fontSize: '.75rem', fontWeight: 700, color: CAT_COLOURS[ci],
          }}>
            <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', background: CAT_COLOURS[ci], color: '#000', fontSize: '.7rem', fontWeight: 900, lineHeight: '20px', marginRight: 6 }}>{ci + 1}</span>
            {cat}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, si) => {
          const assigned = assignments[si]
          const origIdx = q.items.indexOf(item)
          let show = 'default'
          if (answered && origIdx !== -1) show = assignments[si] === q.items[origIdx].category ? 'correct' : 'wrong'
          return (
            <div key={si} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <div style={{
                flex: 1, padding: '12px 14px', borderRadius: 10, fontSize: '.87rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', lineHeight: 1.35,
                background: show === 'correct' ? 'rgba(77,255,136,.08)' : show === 'wrong' ? 'rgba(255,93,115,.08)' : assigned !== null ? `${CAT_COLOURS[assigned]}10` : '#0F1828',
                border: `1.5px solid ${show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : assigned !== null ? CAT_COLOURS[assigned] + '50' : '#2A3552'}`,
                color: show === 'correct' ? '#4DFF88' : show === 'wrong' ? '#FF5D73' : '#E0E6F0',
              }}>
                {item.text}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {q.categories.map((_, ci) => (
                  <button key={ci} onClick={() => assign(si, ci)} style={{
                    flex: 1, minWidth: 40, borderRadius: 8,
                    background: assignments[si] === ci ? CAT_COLOURS[ci] : 'transparent',
                    border: `1.5px solid ${CAT_COLOURS[ci]}`,
                    color: assignments[si] === ci ? '#000' : CAT_COLOURS[ci],
                    fontSize: '.72rem', fontWeight: 800, cursor: answered ? 'default' : 'pointer',
                    transition: 'all .12s',
                    minHeight: 34,
                  }}>{ci + 1}</button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ score, total, streak, bestStreak, answeredQ, onClose }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const weaknesses = getWeaknesses()
  const weakAreas = Object.entries(weaknesses)
    .map(([key, v]) => {
      const t = v.c + v.i
      return { key, total: t, rate: t > 0 ? v.i / t : 0 }
    })
    .filter(x => x.total >= 2 && x.rate > 0.4)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3)

  const ringColor = pct >= 70 ? '#4DFF88' : pct >= 40 ? '#FFC857' : '#FF5D73'

  // Subject breakdown
  const bySubject = {}
  answeredQ.forEach(({ q, correct }) => {
    if (!bySubject[q.subject]) bySubject[q.subject] = { c: 0, i: 0 }
    correct ? bySubject[q.subject].c++ : bySubject[q.subject].i++
  })

  return (
    <div style={{ background: '#070B1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 100px', maxWidth: 520, margin: '0 auto', width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 130, height: 130, borderRadius: '50%',
            border: `5px solid ${ringColor}`,
            background: `${ringColor}08`,
            boxShadow: `0 0 32px ${ringColor}28`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: ringColor, lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: '.7rem', color: '#5A6480', fontWeight: 600, marginTop: 2 }}>{score}/{total}</span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#F5F7FB', marginBottom: 6 }}>
            {pct >= 80 ? 'Excellent work! 🔥' : pct >= 60 ? 'Good effort!' : pct >= 40 ? 'Keep going!' : 'Room to grow!'}
          </h2>
          <p style={{ color: '#9CA8C7', fontSize: '.9rem' }}>
            {score} correct out of {total} questions
          </p>
        </div>

        {/* Streak */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          {[
            { label: 'Best streak', value: bestStreak, icon: '🔥', color: '#FF8A1F' },
            { label: 'Questions done', value: total, icon: '✓', color: '#9D5CFF' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#10182B', border: '1px solid #1E2A40', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '.68rem', color: '#5A6480', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        {Object.keys(bySubject).length > 0 && (
          <div style={{ background: '#10182B', border: '1px solid #1E2A40', borderRadius: 16, padding: '16px', marginBottom: 18 }}>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 14 }}>Subject breakdown</div>
            {Object.entries(bySubject).map(([subject, v]) => {
              const sc = SUBJECT_COLOUR[subject] || SUBJECT_COLOUR.History
              const t = v.c + v.i
              const p = Math.round((v.c / t) * 100)
              return (
                <div key={subject} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '.82rem', fontWeight: 600, color: sc.color }}>{subject}</span>
                    <span style={{ fontSize: '.78rem', color: '#9CA8C7' }}>{v.c}/{t} ({p}%)</span>
                  </div>
                  <div style={{ height: 5, background: '#1A2338', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: p + '%', background: sc.color, borderRadius: 99, transition: 'width .5s ease', boxShadow: `0 0 6px ${sc.color}55` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <div style={{ background: 'rgba(255,93,115,.06)', border: '1px solid rgba(255,93,115,.2)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span>🎯</span>
              <span style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#FF5D73' }}>Focus areas</span>
            </div>
            {weakAreas.map(w => (
              <div key={w.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <span style={{ fontSize: '.82rem', color: '#E0E6F0' }}>{w.key.replace('/', ' — ')}</span>
                <span style={{ fontSize: '.75rem', color: '#FF5D73', fontWeight: 700 }}>{Math.round(w.rate * 100)}% wrong</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: '17px', borderRadius: 14,
          background: 'linear-gradient(135deg, #7C3AED, #9D5CFF)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: '1rem', letterSpacing: '.03em',
          boxShadow: '0 4px 20px rgba(124,58,237,.4)',
        }}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

// ─── Main QuickQuiz component ─────────────────────────────────────────────────

const TOTAL_SECONDS = 300

export default function QuickQuiz({ mode = 'random', onClose }) {
  const [questions]  = useState(() => selectSessionQuestions(mode))
  const [idx, setIdx]         = useState(0)
  const [answered, setAnswered]   = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [streak, setStreak]       = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [score, setScore]         = useState(0)
  const [timeLeft, setTimeLeft]   = useState(TOTAL_SECONDS)
  const [phase, setPhase]         = useState('playing') // playing | results
  const [answeredQ, setAnsweredQ] = useState([])
  const [ttsEnabled, setTtsEnabled] = useState(true)

  const timerRef = useRef(null)

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('results')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  // Auto-speak question on load / question change
  useEffect(() => {
    if (phase !== 'playing' || !ttsEnabled) return
    const q = questions[idx]
    if (!q) return
    const text = q.type === 'truefalse'
      ? `True or false. ${q.question}`
      : q.question
    speak(text)
  }, [idx, phase, ttsEnabled])

  // Cleanup TTS on unmount
  useEffect(() => () => stopSpeaking(), [])

  function handleAnswer(correct) {
    setAnswered(true)
    setIsCorrect(correct)
    const q = questions[idx]
    recordAnswer(q.subject, q.topic, correct)
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    setBestStreak(bs => Math.max(bs, newStreak))
    if (correct) setScore(s => s + 1)
    setAnsweredQ(prev => [...prev, { q, correct }])

    // Speak feedback
    if (ttsEnabled) {
      setTimeout(() => {
        speak(correct ? `Correct. ${q.explanation}` : `Not quite. ${q.explanation}`)
      }, 300)
    }
  }

  function nextQuestion() {
    stopSpeaking()
    const next = idx + 1
    if (next >= questions.length) {
      setPhase('results')
    } else {
      setIdx(next)
      setAnswered(false)
      setIsCorrect(null)
    }
  }

  if (phase === 'results') {
    return <ResultsScreen
      score={score}
      total={answeredQ.length}
      streak={streak}
      bestStreak={bestStreak}
      answeredQ={answeredQ}
      onClose={onClose}
    />
  }

  const q = questions[idx]
  if (!q) return <ResultsScreen score={score} total={answeredQ.length} streak={streak} bestStreak={bestStreak} answeredQ={answeredQ} onClose={onClose} />

  const sc = SUBJECT_COLOUR[q.subject] || SUBJECT_COLOUR.History
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timerPct = (timeLeft / TOTAL_SECONDS) * 100
  const timerColor = timeLeft > 120 ? '#9D5CFF' : timeLeft > 60 ? '#FFC857' : '#FF5D73'
  const totalQ = questions.length

  return (
    <div style={{ background: '#070B1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(7,11,26,.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E2A40',
        padding: '10px 16px 0',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          {/* Close */}
          <button onClick={() => { stopSpeaking(); onClose() }} style={{
            width: 36, height: 36, borderRadius: 99, border: '1px solid #2A3552',
            background: 'transparent', color: '#9CA8C7', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 400,
          }}>✕</button>

          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '.75rem', color: timerColor, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '.03em' }}>
              {timeLeft <= 60 && '⚠ '}{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
            </span>
          </div>

          {/* Streak + TTS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {streak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,138,31,.12)', border: '1px solid rgba(255,138,31,.28)', borderRadius: 99, padding: '4px 10px' }}>
                <span style={{ fontSize: '.75rem' }}>🔥</span>
                <span style={{ fontSize: '.78rem', fontWeight: 800, color: '#FF8A1F' }}>{streak}</span>
              </div>
            )}
            <button onClick={() => { setTtsEnabled(e => !e); if (ttsEnabled) stopSpeaking() }} style={{
              width: 32, height: 32, borderRadius: 99, border: `1px solid ${ttsEnabled ? 'rgba(157,92,255,.4)' : '#2A3552'}`,
              background: ttsEnabled ? 'rgba(157,92,255,.1)' : 'transparent',
              color: ttsEnabled ? '#C18CFF' : '#4A5578', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.9rem',
            }} title={ttsEnabled ? 'Mute voice' : 'Enable voice'}>
              {ttsEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{ height: 3, background: '#1A2338', overflow: 'hidden', marginBottom: 0 }}>
          <div style={{
            height: '100%', width: timerPct + '%',
            background: `linear-gradient(90deg, ${timerColor}, ${timerColor}cc)`,
            transition: 'width 1s linear, background .5s',
            boxShadow: `0 0 8px ${timerColor}55`,
          }} />
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 3, padding: '8px 0 6px', overflowX: 'auto' }}>
          {questions.slice(0, Math.min(totalQ, 26)).map((_, i) => {
            const done = answeredQ[i]
            return (
              <div key={i} style={{
                width: i === idx ? 20 : 7, height: 7, borderRadius: 99, flexShrink: 0,
                background: done ? (done.correct ? '#4DFF88' : '#FF5D73') : i === idx ? timerColor : '#1E2A40',
                transition: 'all .3s',
                boxShadow: i === idx ? `0 0 6px ${timerColor}` : 'none',
              }} />
            )
          })}
        </div>
      </div>

      {/* ── Question area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 100px', maxWidth: 560, margin: '0 auto', width: '100%' }}>

        {/* Subject + difficulty badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: sc.bg, border: `1px solid ${sc.border}`,
            borderRadius: 99, padding: '4px 12px',
            fontSize: '.68rem', fontWeight: 700, color: sc.color,
            letterSpacing: '.08em', textTransform: 'uppercase',
          }}>{q.subject}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: `${DIFF_COLOUR[q.difficulty]}14`,
            border: `1px solid ${DIFF_COLOUR[q.difficulty]}35`,
            borderRadius: 99, padding: '4px 12px',
            fontSize: '.68rem', fontWeight: 700, color: DIFF_COLOUR[q.difficulty],
            letterSpacing: '.08em', textTransform: 'uppercase',
          }}>{q.difficulty}</div>
          <div style={{ marginLeft: 'auto', fontSize: '.7rem', color: '#5A6480', fontWeight: 600 }}>
            {idx + 1} / {totalQ}
          </div>
        </div>

        {/* Question card */}
        <div style={{
          background: 'linear-gradient(145deg, #10182B, #0D1424)',
          border: `1px solid ${answered ? (isCorrect ? '#4DFF8840' : '#FF5D7340') : '#1E2A40'}`,
          borderRadius: 18, padding: '18px 18px 16px',
          marginBottom: 14,
          boxShadow: answered ? `0 0 20px ${isCorrect ? 'rgba(77,255,136,.08)' : 'rgba(255,93,115,.08)'}` : 'none',
          transition: 'border-color .3s, box-shadow .3s',
        }}>
          {/* Question type label */}
          <div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 10 }}>
            {q.type === 'mcq' ? 'Multiple choice' : q.type === 'truefalse' ? 'True or False' : q.type === 'fillgap' ? 'Fill the gap' : q.type === 'matchpairs' ? 'Match pairs' : q.type === 'sequence' ? 'Put in order' : 'Categorise'}
          </div>

          {/* Question text + TTS button */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 'clamp(1rem, 4vw, 1.15rem)',
              color: '#F5F7FB', lineHeight: 1.45, margin: 0, flex: 1,
            }}>{q.question}</p>
            <button onClick={() => speak(q.question)} style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: 99,
              border: '1px solid #2A3552', background: 'transparent',
              color: '#9CA8C7', cursor: 'pointer', fontSize: '.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Read aloud">🔊</button>
          </div>

          {/* ── Answer inputs ── */}

          {/* MCQ & Fill Gap */}
          {(q.type === 'mcq' || q.type === 'fillgap') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {q.options.map((opt, oi) => {
                let state = 'default'
                if (answered) {
                  if (oi === q.correctIndex) state = 'correct'
                  // wrong only shows on the option the user tapped — track via isCorrect + which option was last tapped
                }
                return (
                  <button key={oi}
                    disabled={answered}
                    onClick={() => {
                      const correct = oi === q.correctIndex
                      handleAnswer(correct)
                    }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '15px 18px', borderRadius: 12, minHeight: 56,
                      fontFamily: 'inherit', fontSize: '.92rem', fontWeight: 500, lineHeight: 1.4,
                      cursor: answered ? 'default' : 'pointer',
                      border: `2px solid ${answered && oi === q.correctIndex ? '#4DFF88' : '#2A3552'}`,
                      background: answered && oi === q.correctIndex ? 'rgba(77,255,136,.09)' : '#0F1828',
                      color: answered && oi === q.correctIndex ? '#4DFF88' : '#E0E6F0',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = '#3A4870'; e.currentTarget.style.background = '#1E2840' } }}
                    onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor = '#2A3552'; e.currentTarget.style.background = '#0F1828' } }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: answered && oi === q.correctIndex ? '#4DFF88' : '#1A2338',
                        color: answered && oi === q.correctIndex ? '#00140a' : '#5A6480',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '.72rem', fontWeight: 800,
                      }}>
                        {answered && oi === q.correctIndex ? '✓' : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* True / False */}
          {q.type === 'truefalse' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[true, false].map(val => {
                const isRight = answered && val === q.correct
                const isWrong = answered && val !== q.correct
                return (
                  <button key={String(val)}
                    disabled={answered}
                    onClick={() => handleAnswer(val === q.correct)}
                    style={{
                      padding: '20px 12px', borderRadius: 14, minHeight: 72,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800, fontSize: '1rem',
                      cursor: answered ? 'default' : 'pointer',
                      border: `2px solid ${isRight ? '#4DFF88' : '#2A3552'}`,
                      background: isRight ? 'rgba(77,255,136,.10)' : '#0F1828',
                      color: isRight ? '#4DFF88' : '#E0E6F0',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if (!answered) e.currentTarget.style.background = '#1E2840' }}
                    onMouseLeave={e => { if (!answered) e.currentTarget.style.background = '#0F1828' }}
                  >
                    {val ? '✓ True' : '✗ False'}
                  </button>
                )
              })}
            </div>
          )}

          {/* Match Pairs */}
          {q.type === 'matchpairs' && (
            <MatchPairs q={q} answered={answered} onAnswer={handleAnswer} />
          )}

          {/* Sequence */}
          {q.type === 'sequence' && (
            <Sequence q={q} answered={answered} onAnswer={handleAnswer} />
          )}

          {/* Categorise */}
          {q.type === 'dragdrop' && (
            <Categorise q={q} answered={answered} onAnswer={handleAnswer} />
          )}
        </div>

        {/* ── Feedback ── */}
        {answered && (
          <div className="fade-up" style={{
            borderRadius: 16, overflow: 'hidden',
            border: `1px solid ${isCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'}`,
            marginBottom: 14,
          }}>
            {/* Header */}
            <div style={{
              padding: '12px 18px',
              background: isCorrect ? 'rgba(77,255,136,.1)' : 'rgba(255,93,115,.1)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{isCorrect ? '✅' : '❌'}</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '.92rem',
                color: isCorrect ? '#4DFF88' : '#FF5D73',
              }}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </span>
              {streak > 1 && isCorrect && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,138,31,.15)', border: '1px solid rgba(255,138,31,.3)', borderRadius: 99, padding: '3px 10px' }}>
                  <span style={{ fontSize: '.75rem' }}>🔥</span>
                  <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#FF8A1F' }}>{streak} streak</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '14px 18px 16px', background: '#0C1220' }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 5 }}>Explanation</div>
                <p style={{ fontSize: '.88rem', color: '#C8D0E8', margin: 0, lineHeight: 1.55 }}>{q.explanation}</p>
              </div>

              <div style={{ marginBottom: !isCorrect && q.misconception ? 10 : 0 }}>
                <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5A6480', marginBottom: 5 }}>Why</div>
                <p style={{ fontSize: '.85rem', color: '#9CA8C7', margin: 0, lineHeight: 1.55 }}>{q.reasoning}</p>
              </div>

              {!isCorrect && q.misconception && (
                <div style={{ marginTop: 10, padding: '10px 13px', background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)', borderRadius: 10 }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FFC857', marginBottom: 5 }}>Common misconception</div>
                  <p style={{ fontSize: '.83rem', color: '#FFC857cc', margin: 0, lineHeight: 1.5 }}>{q.misconception}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Next button ── */}
        {answered && (
          <button className="fade-up" onClick={nextQuestion} style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: 'linear-gradient(135deg, #7C3AED, #9D5CFF)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '1rem', letterSpacing: '.03em',
            boxShadow: '0 4px 20px rgba(124,58,237,.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {idx + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
