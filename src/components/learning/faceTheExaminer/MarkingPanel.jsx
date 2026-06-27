import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'

export default function MarkingPanel({ accent, examiner, guessedMark, setGuessedMark, selectedCriteria, setSelectedCriteria }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ padding: 15, borderRadius: 18, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.055)' }}>
        <div style={{ ...TYPE.cardTitle, color: 'rgba(245,238,225,0.92)', marginBottom: 5 }}>Give it a mark</div>
        <div style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>Judge the answer before seeing the examiner report.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.micro }}>
          {Array.from({ length: examiner.marks + 1 }, (_, i) => (
            <button key={i} onClick={() => setGuessedMark(i)} style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${guessedMark === i ? accent : 'rgba(255,255,255,0.14)'}`, background: guessedMark === i ? `${accent}20` : 'rgba(255,255,255,0.04)', color: guessedMark === i ? accent : 'rgba(255,255,255,0.58)', fontFamily: TYPE.bodyText.fontFamily, fontWeight: guessedMark === i ? 800 : 500, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s ease' }}>{i}</button>
          ))}
        </div>
      </section>
      <section style={{ padding: 15, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.055)' }}>
        <div style={{ ...TYPE.cardTitle, color: 'rgba(245,238,225,0.92)', marginBottom: 5 }}>What did you notice?</div>
        <div style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Tap anything the answer does well or misses.</div>
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
