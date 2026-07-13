import { useCallback, useMemo, useRef, useState } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { InlineNavigationContext } from '../core/InlineNavigationContext.jsx'

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

  /* The normal module CTA is the shell's immediate sibling. Hide it only while
     a child has explicitly claimed inline navigation, so one Continue action is
     visible and it stays at the end of the learning content. */
  .cs-shell.cs-inline-navigation + div {
    display: none !important;
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
  const shellRef = useRef(null)
  const [inlineNavigationOwners, setInlineNavigationOwners] = useState(0)

  const claim = useCallback(() => {
    let released = false
    setInlineNavigationOwners(count => count + 1)

    return () => {
      if (released) return
      released = true
      setInlineNavigationOwners(count => Math.max(0, count - 1))
    }
  }, [])

  // The module action remains owned by ModulePlayer. Inline components invoke
  // the existing governed CTA rather than duplicating navigation logic.
  const continueModule = useCallback(() => {
    const moduleNavigation = shellRef.current?.nextElementSibling
    const continueButton = moduleNavigation?.querySelector('button')
    continueButton?.click()
  }, [])

  const inlineNavigation = useMemo(
    () => ({ claim, continueModule }),
    [claim, continueModule],
  )

  const ownsInlineNavigation = inlineNavigationOwners > 0

  return (
    <InlineNavigationContext.Provider value={inlineNavigation}>
      <div
        ref={shellRef}
        className={`cs-shell${ownsInlineNavigation ? ' cs-inline-navigation' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: theme.background,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            paddingBottom: ownsInlineNavigation
              ? `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`
              : 'calc(96px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>
      </div>
    </InlineNavigationContext.Provider>
  )
}
