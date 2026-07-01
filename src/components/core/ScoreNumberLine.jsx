import { TYPE } from '../../constants/typography.js'

export default function ScoreNumberLine({
  value,
  max = 8,
  min = 0,
  onChange,
  accent = '#D9A441',
  label = 'Score',
  disabled = false,
}) {
  const scores = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const selected = typeof value === 'number' ? value : null
  const selectedIndex = selected === null ? -1 : scores.indexOf(selected)
  const percent = selectedIndex < 0 || scores.length <= 1 ? 0 : (selectedIndex / (scores.length - 1)) * 100

  return (
    <div role="group" aria-label={label} style={{ width: '100%' }}>
      <div style={{
        position: 'relative',
        padding: '18px 6px 8px',
      }}>
        <div style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 31,
          height: 2,
          borderRadius: 999,
          background: 'rgba(245,238,225,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          left: 14,
          top: 31,
          width: `calc((100% - 28px) * ${percent / 100})`,
          height: 2,
          borderRadius: 999,
          background: selected === null ? 'transparent' : accent,
          boxShadow: selected === null ? 'none' : `0 0 16px ${accent}55`,
          transition: 'width 180ms ease',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${scores.length}, minmax(0, 1fr))`,
          gap: 0,
          position: 'relative',
          zIndex: 1,
        }}>
          {scores.map(score => {
            const isSelected = score === selected
            const isPast = selected !== null && score < selected
            return (
              <button
                key={score}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${score} out of ${max}`}
                onClick={() => onChange?.(score)}
                style={{
                  minWidth: 0,
                  minHeight: 42,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 8,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span style={{
                  width: isSelected ? 28 : 16,
                  height: isSelected ? 28 : 16,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  background: isSelected ? accent : isPast ? `${accent}55` : 'rgba(245,238,225,0.10)',
                  border: isSelected ? `1px solid ${accent}` : `1px solid ${isPast ? `${accent}55` : 'rgba(245,238,225,0.16)'}`,
                  boxShadow: isSelected ? `0 0 20px ${accent}44` : 'none',
                  color: isSelected ? '#090A0E' : isPast ? 'rgba(245,238,225,0.84)' : 'rgba(245,238,225,0.58)',
                  transition: 'all 160ms ease',
                }}>
                  {isSelected && (
                    <span style={{ ...TYPE.bodySmall, fontWeight: 900, fontSize: 13, lineHeight: 1 }}>
                      {score}
                    </span>
                  )}
                </span>
                {!isSelected && (
                  <span style={{
                    ...TYPE.bodySmall,
                    fontSize: 12,
                    fontWeight: 700,
                    color: isPast ? `rgba(245,238,225,0.56)` : 'rgba(245,238,225,0.34)',
                  }}>
                    {score}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
