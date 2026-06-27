import { TYPE, SCREEN_TEXT_LAYOUT } from '../../constants/typography.js'

const toneStyles = {
  default: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(245,238,225,0.9)',
  },
  quiet: {
    background: 'transparent',
    border: '1px solid transparent',
    color: 'rgba(245,238,225,0.86)',
  },
  card: {
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(255,255,255,0.055)',
    color: 'rgba(245,238,225,0.9)',
  },
}

export default function ScreenTextBlock({
  title,
  children,
  accent,
  tone = 'default',
  inset = true,
  framed = false,
  style = {},
  titleStyle = {},
  bodyStyle = {},
}) {
  const toneStyle = toneStyles[tone] || toneStyles.default
  const padX = inset ? SCREEN_TEXT_LAYOUT.mobileInset : 0
  const padY = SCREEN_TEXT_LAYOUT.blockGap

  return (
    <section
      style={{
        padding: `${padY}px ${padX}px`,
        background: framed ? toneStyle.background : 'transparent',
        border: framed ? toneStyle.border : 'none',
        borderRadius: framed ? 18 : 0,
        ...style,
      }}
    >
      {title && (
        <h2
          style={{
            ...TYPE.cardTitle,
            color: accent || toneStyle.color,
            margin: '0 0 10px',
            ...titleStyle,
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          ...TYPE.examQuestionText,
          color: toneStyle.color,
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </section>
  )
}
