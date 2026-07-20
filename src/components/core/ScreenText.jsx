// Text primitives for use inside ContentShell.
// These are the intentional path — the shell's scoped CSS handles raw h1/h2/p as a safety net,
// but these primitives carry the full intended design (size, weight, spacing, max-width).
//
// Usage:
//   import { ScreenTitle, ScreenBody, ScreenCaption } from '../core/ScreenText.jsx'

import { HEADING_LAYOUT, TYPE } from '../../constants/typography.js'

const SCREEN_TITLE_TYPE_PROPS = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
]

function withoutScreenTitleTypeOverrides(style = {}) {
  const safeStyle = { ...style }
  for (const prop of SCREEN_TITLE_TYPE_PROPS) delete safeStyle[prop]
  return safeStyle
}

// Primary non-cinematic module heading. This is deliberately the same
// TYPE.displayScreen treatment owned by TeachScreenShell and calibrated from
// the TimelineCanvas 390px reference. The style prop may adjust layout or
// colour, but typography properties are ignored so callers cannot create a
// second screen-title system locally.
export function ScreenTitle({ children, style, className }) {
  return (
    <h2 className={className} style={{
      ...TYPE.displayScreen,
      color: 'rgba(255,255,255,0.96)',
      maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
      margin: '0 0 10px',
      ...withoutScreenTitleTypeOverrides(style),
    }}>
      {children}
    </h2>
  )
}

// Secondary heading. Sits below ScreenTitle or introduces a section.
export function ScreenSubtitle({ children, style }) {
  return (
    <h3 style={{
      ...TYPE.displayCard,
      color: 'rgba(255,255,255,0.80)',
      maxWidth: '24ch',
      margin: '0 0 10px',
      ...style,
    }}>
      {children}
    </h3>
  )
}

// Standard body copy. 34ch keeps lines readable at mobile scale.
export function ScreenBody({ children, style }) {
  return (
    <p style={{
      ...TYPE.body,
      color: 'rgba(255,255,255,0.78)',
      maxWidth: '34ch',
      margin: '0 0 14px',
      ...style,
    }}>
      {children}
    </p>
  )
}

// Supporting text — source attribution, exam tip, contextual note.
export function ScreenCaption({ children, style }) {
  return (
    <p style={{
      ...TYPE.caption,
      color: 'rgba(255,255,255,0.42)',
      maxWidth: '40ch',
      margin: '0 0 10px',
      ...style,
    }}>
      {children}
    </p>
  )
}

// Highlighted pull-out — key exam point, important caveat, examiner note.
// Pass accent (hex or rgba string) for the left-border colour.
export function ScreenCallout({ children, accent, style }) {
  return (
    <div style={{
      ...TYPE.body,
      fontWeight: 500,
      color: 'rgba(255,255,255,0.88)',
      maxWidth: '34ch',
      borderLeft: `3px solid ${accent ?? 'rgba(255,255,255,0.22)'}`,
      paddingLeft: 14,
      margin: '0 0 16px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// Bulleted list. Pass items as an array of strings or ReactNodes.
export function ScreenList({ items = [], style, itemStyle }) {
  return (
    <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: '0 0 14px',
      maxWidth: '34ch',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style,
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          ...TYPE.body,
          color: 'rgba(255,255,255,0.78)',
          paddingLeft: 18,
          position: 'relative',
          ...itemStyle,
        }}>
          <span style={{
            position: 'absolute',
            left: 0,
            color: 'rgba(255,255,255,0.30)',
            userSelect: 'none',
          }}>–</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
