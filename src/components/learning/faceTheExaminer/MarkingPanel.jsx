import { TYPE } from '../../../constants/typography.js'
import ScoreNumberLine from '../../core/ScoreNumberLine.jsx'

export default function MarkingPanel({ accent, examiner, guessedMark, setGuessedMark, selectedCriteria, setSelectedCriteria }) {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <section style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(180deg, rgba(245,238,225,0.05), rgba(8,9,13,0.18))', border: '1px solid rgba(245,238,225,0.08)' }}>
        <div style={{ ...TYPE.displayCard, color: 'rgba(245,238,225,0.92)', marginBottom: 4 }}>What mark would you give?</div>
        <div style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Slide your judgement along the mark line before the examiner reveals theirs.</div>
        <ScoreNumberLine
          value={guessedMark}
          min={0}
          max={examiner.marks}
          accent={accent}
          label={`Predicted mark out of ${examiner.marks}`}
          onChange={setGuessedMark}
        />
      </section>
      <section style={{ padding: 16, borderRadius: 20, background: 'rgba(0,0,0,0.14)', border: '1px solid rgba(245,238,225,0.075)' }}>
        <div style={{ ...TYPE.displayCard, color: 'rgba(245,238,225,0.92)', marginBottom: 4 }}>What did you notice?</div>
        <div style={{ ...TYPE.bodySmall, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Tap the things an examiner would reward or question.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-4px' }}>
          {(examiner.criteriaOptions || []).map(opt => {
            const sel = selectedCriteria.includes(opt)
            return <button key={opt} className={`fte-chip${sel ? ' selected' : ''}`} onClick={() => setSelectedCriteria(prev => (sel ? prev.filter(x => x !== opt) : [...prev, opt]))}>{sel ? '✓ ' : ''}{opt}</button>
          })}
        </div>
      </section>
    </div>
  )
}
