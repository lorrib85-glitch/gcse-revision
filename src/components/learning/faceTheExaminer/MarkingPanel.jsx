import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'

export default function MarkingPanel({ accent, examiner, guessedMark, setGuessedMark, selectedCriteria, setSelectedCriteria }) {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <section style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(180deg, rgba(245,238,225,0.05), rgba(8,9,13,0.18))', border: '1px solid rgba(245,238,225,0.08)' }}>
        <div style={{ ...TYPE.cardTitle, color: 'rgba(245,238,225,0.92)', marginBottom: 4 }}>What mark would you give?</div>
        <div style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>Make a quick judgement before the examiner reveals theirs.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.micro }}>
          {Array.from({ length: examiner.marks + 1 }, (_, i) => (
            <button key={i} onClick={() => setGuessedMark(i)} style={{ width: 42, height: 42, borderRadius: 999, border: `1.5px solid ${guessedMark === i ? accent : 'rgba(255,255,255,0.14)'}`, background: guessedMark === i ? `${accent}20` : 'rgba(255,255,255,0.035)', color: guessedMark === i ? accent : 'rgba(255,255,255,0.58)', fontFamily: TYPE.bodyText.fontFamily, fontWeight: guessedMark === i ? 800 : 500, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s ease' }}>{i}</button>
          ))}
        </div>
      </section>
      <section style={{ padding: 16, borderRadius: 20, background: 'rgba(0,0,0,0.14)', border: '1px solid rgba(245,238,225,0.075)' }}>
        <div style={{ ...TYPE.cardTitle, color: 'rgba(245,238,225,0.92)', marginBottom: 4 }}>What did you notice?</div>
        <div style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Tap the things an examiner would reward or question.</div>
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
