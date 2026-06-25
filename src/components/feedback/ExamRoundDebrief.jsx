import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'
import { TYPE } from '../../constants/typography.js'

// Examiner-voice end-of-round debrief. Synthesises across every answer in the
// round (not question by question) to surface one genuinely recurring pattern,
// quote real moments from the student's own answers in the FaceTheExaminer
// voice, and log that pattern as a weakness so it resurfaces in WeakSpotRecovery.
export default function ExamRoundDebrief({ subject, results }) {
  const palette = SUBJECTS[subject] || SUBJECTS.Physics || { accent: '#5DA9E9', accentRgb: '93,169,233' }
  const accent = palette.accent
  const accentRgb = palette.accentRgb || '93,169,233'

  const [loading, setLoading] = useState(true)
  const [debrief, setDebrief] = useState(null)
  const [error, setError] = useState(null)
  const loggedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const res = await fetch('/api/examRoundDebrief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results }),
        })
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        if (cancelled) return
        setDebrief(data)

        // Log a genuinely-evidenced cross-cutting pattern as its own weakness —
        // distinct from the per-question logging ExamQuestionFrame already does —
        // so recurring issues surface in WeakSpotRecovery just like any other.
        if (data.pattern && data.pattern.trim() && !loggedRef.current) {
          loggedRef.current = true
          const wrong = results.filter(r => (r.marksAwarded ?? 0) < (r.marks ?? 1) && r.subject && r.topic)
          if (wrong.length > 0) {
            const counts = {}
            wrong.forEach(r => {
              const key = `${r.subject}|||${r.topic}`
              counts[key] = (counts[key] || 0) + 1
            })
            const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
            const [patternSubject, patternTopic] = topKey.split('|||')
            logWrongAnswer({
              subject: patternSubject,
              topic: patternTopic,
              questionId: `round-pattern-${Date.now()}`,
              questionText: data.pattern,
              marks: 1,
              source: 'examRoundDebrief',
              questionType: 'pattern',
            })
          }
        }
      } catch (e) {
        if (!cancelled) setError('Could not load the debrief — check your connection and try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [results])

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: RADII.large,
        padding: SPACING.standard,
        marginTop: SPACING.compact,
        textAlign: 'left',
      }}>
        <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '.85rem', color: '#6B7A9A' }}>
          Your examiner is looking back over the round…
        </div>
      </div>
    )
  }

  if (error || !debrief) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: RADII.large,
        padding: SPACING.standard,
        marginTop: SPACING.compact,
        textAlign: 'left',
      }}>
        <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '.85rem', color: '#6B7A9A' }}>
          {error || 'No debrief available for this round.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: `linear-gradient(180deg, rgba(${accentRgb},0.07), rgba(255,255,255,0.02))`,
      border: `1px solid rgba(${accentRgb},0.22)`,
      borderRadius: RADII.large,
      padding: SPACING.standard,
      marginTop: SPACING.compact,
      textAlign: 'left',
    }}>
      <div style={{
        fontFamily: TYPE.bodyText.fontFamily,
        fontWeight: 700,
        fontSize: '.7rem',
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: 10,
      }}>
        From the examiner
      </div>

      <p style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '1rem', lineHeight: 1.6, color: '#F5F7FB', margin: '0 0 16px' }}>
        {debrief.headline}
      </p>

      {debrief.pattern && debrief.pattern.trim() && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: RADII.medium,
          padding: SPACING.compact,
          marginBottom: 14,
        }}>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#9CA8C7', marginBottom: 6 }}>
            What kept costing you marks
          </div>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '.92rem', lineHeight: 1.6, color: 'rgba(245,247,251,0.88)' }}>
            {debrief.pattern}
          </div>
        </div>
      )}

      {Array.isArray(debrief.moments) && debrief.moments.map((m, i) => (
        <div key={i} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `2px solid rgba(${accentRgb},0.4)` }}>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontStyle: 'italic', fontSize: '.88rem', lineHeight: 1.55, color: 'rgba(245,247,251,0.7)', marginBottom: 4 }}>
            "{m.quote}"
          </div>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '.85rem', lineHeight: 1.55, color: 'rgba(245,247,251,0.92)' }}>
            {m.examinerNote}
          </div>
        </div>
      ))}

      {debrief.nextStep && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: accent, marginBottom: 6 }}>
            Next, try this
          </div>
          <div style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: '.9rem', lineHeight: 1.6, color: 'rgba(245,247,251,0.88)' }}>
            {debrief.nextStep}
          </div>
        </div>
      )}
    </div>
  )
}
