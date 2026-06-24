import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'

function SourceLabel({ label, accent }) {
  return (
    <div style={{
      display: 'inline-block',
      ...TYPE.metadata,
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      marginBottom: 8,
    }}>
      {label}
    </div>
  )
}

function TextSource({ source, accent }) {
  return (
    <div style={{
      background: GENERAL.neutral[2],
      borderRadius: RADII.medium,
      padding: `${SPACING.compact}px`,
      borderLeft: `3px solid ${accent}`,
      marginBottom: SPACING.compact,
    }}>
      <SourceLabel label={source.label} accent={accent} />
      {source.attribution && (
        <div style={{
          ...TYPE.bodySmall, fontStyle: 'italic',
          color: GENERAL.slate, marginBottom: 10,
        }}>
          {source.attribution}
        </div>
      )}
      <div style={{
        ...TYPE.body, color: GENERAL.softWhite, lineHeight: 1.65,
        whiteSpace: 'pre-line',
      }}>
        {source.text}
      </div>
    </div>
  )
}

function ImageSource({ source, accent }) {
  return (
    <div style={{ marginBottom: SPACING.compact }}>
      <SourceLabel label={source.label} accent={accent} />
      <div style={{
        borderRadius: RADII.medium, overflow: 'hidden',
        border: `1px solid rgba(255,255,255,0.08)`,
        background: GENERAL.neutral[2],
      }}>
        <img
          src={source.src}
          alt={source.alt || source.label}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {source.caption && (
          <div style={{
            padding: '8px 12px',
            ...TYPE.bodySmall, color: GENERAL.slate, lineHeight: 1.4,
          }}>
            {source.caption}
          </div>
        )}
      </div>
    </div>
  )
}

function TableSource({ source, accent }) {
  return (
    <div style={{ marginBottom: SPACING.compact }}>
      <SourceLabel label={source.label} accent={accent} />
      {source.caption && (
        <div style={{
          ...TYPE.bodySmall, color: GENERAL.softWhite,
          fontWeight: 600, marginBottom: 8,
        }}>
          {source.caption}
        </div>
      )}
      <div style={{
        borderRadius: RADII.medium, overflow: 'hidden',
        border: `1px solid rgba(255,255,255,0.08)`,
        background: GENERAL.neutral[2],
        overflowX: 'auto',
      }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: "'Sora', sans-serif", fontSize: 13,
        }}>
          <thead>
            <tr style={{ background: GENERAL.neutral[3] }}>
              {source.headers.map((h, i) => (
                <th key={i} style={{
                  padding: '10px 12px', textAlign: i === 0 ? 'left' : 'center',
                  color: accent, fontWeight: 700, letterSpacing: '0.02em',
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {source.rows.map((row, ri) => (
              <tr key={ri} style={{
                background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
              }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '9px 12px', textAlign: ci === 0 ? 'left' : 'center',
                    color: ci === 0 ? GENERAL.softWhite : GENERAL.slate,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {source.attribution && (
          <div style={{
            padding: '6px 12px 10px',
            ...TYPE.bodySmall, color: GENERAL.slate, fontStyle: 'italic',
          }}>
            {source.attribution}
          </div>
        )}
        {source.note && (
          <div style={{
            padding: '4px 12px 10px',
            ...TYPE.bodySmall, color: GENERAL.slate, opacity: 0.7,
          }}>
            {source.note}
          </div>
        )}
      </div>
    </div>
  )
}

export function ExamPaperSource({ source, accent }) {
  if (source.type === 'image') return <ImageSource source={source} accent={accent} />
  if (source.type === 'table') return <TableSource source={source} accent={accent} />
  return <TextSource source={source} accent={accent} />
}
