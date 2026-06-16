import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'

const SCOPED_CSS = `
  .cs-scroll h1,
  .cs-scroll h2 {
    font-family: 'Sora', sans-serif;
    font-size: clamp(22px, 6vw, 28px);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: rgba(255,255,255,0.96);
    max-width: 12ch;
    margin: 0 0 10px;
  }

  .cs-scroll h3 {
    font-family: 'Sora', sans-serif;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: rgba(255,255,255,0.80);
    max-width: 20ch;
    margin: 0 0 10px;
  }

  .cs-scroll p {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.55;
    color: rgba(255,255,255,0.78);
    max-width: 34ch;
    margin: 0 0 14px;
  }

  .cs-scroll ul {
    list-style: none;
    padding: 0;
    margin: 0 0 14px;
    max-width: 34ch;
  }

  .cs-scroll li {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    line-height: 1.55;
    color: rgba(255,255,255,0.78);
    padding-left: 18px;
    position: relative;
    margin-bottom: 6px;
  }

  .cs-scroll li:last-child {
    margin-bottom: 0;
  }

  .cs-scroll li::before {
    content: '–';
    position: absolute;
    left: 0;
    color: rgba(255,255,255,0.30);
  }
`

export default function ContentShell({
  subject,
  backgroundImage = null,
  backgroundOpacity = 0.13,
  backgroundPosition = 'center',
  // 'learning' clears the fixed LearningHeader (80px); 'none' applies safe-area only (headerless screens)
  header = 'learning',
  children,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      background: theme.background,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{SCOPED_CSS}</style>
      {backgroundImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition,
          opacity: backgroundOpacity,
        }} />
      )}
      <div
        className="cs-scroll"
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxWidth: 420,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          paddingTop: header === 'none'
            ? 'env(safe-area-inset-top, 0px)'
            : 'calc(80px + env(safe-area-inset-top, 0px))',
          paddingLeft: SPACING.compact,
          paddingRight: SPACING.compact,
          // 96px clears the fixed CTA bar (10px pad + 56px button + 10px pad + safe-area + buffer)
          paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </div>
    </div>
  )
}
