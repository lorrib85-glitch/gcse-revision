// Text primitives for use inside ContentShell.
// These are the intentional path — the shell's scoped CSS handles raw h1/h2/p as a safety net,
// but these primitives carry the full intended design (size, weight, spacing, max-width).
//
// Usage:
//   import { ScreenTitle, ScreenBody, ScreenCaption } from '../core/ScreenText.jsx'

import { TYPE } from '../../constants/typography.js'

// Primary heading. Tight max-width for dramatic weight.
export function ScreenTitle({ children, style }) {
  return (
    <h2 style={{
      ...TYPE.sectionHeading,
      color: 'rgba(255,255,255,0.96)',
      maxWidth: '18ch',
      margin: '0 0 10px',
      ...style,
    }}>
      {children}
    </h2>
  )
}

// Secondary heading. Sits below ScreenTitle or introduces a section.
export function ScreenSubtitle({ children, style }) {
  return (
    <h3 style={{
      ...TYPE.cardTitle,
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
      ...TYPE.bodyText,
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
      ...TYPE.captionText,
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
      ...TYPE.bodyText,
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
          ...TYPE.bodyText,
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
