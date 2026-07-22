import { useEffect, useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { RADII } from '../../constants/radii.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import MediaPlaceholder from '../core/MediaPlaceholder.jsx'
import TeachScreenShell from '../core/TeachScreenShell.jsx'

const DEFAULT_REVEAL_PARTS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']

// The image-reveal animation is owned by MediaPlaceholder. This mirrors its
// configured sequence so progression appears only after the final image and any
// opposite-pair arrows have finished settling. Content can provide completionMs
// when a different infographic animation has its own known duration.
export function getInfographicCompletionDelay(media = {}) {
  const explicitDelay = media.completionMs ?? media.caption?.completionMs
  if (Number.isFinite(explicitDelay)) return Math.max(0, explicitDelay)
  if (media.kind !== 'imageReveal') return null

  const config = media.caption && typeof media.caption === 'object' ? media.caption : {}
  const parts = (config.parts || DEFAULT_REVEAL_PARTS)
    .filter(part => config.images?.[part])
  if (parts.length === 0) return null

  const interval = Number.isFinite(config.interval) ? Math.max(0, config.interval) : 1500
  const opposites = Array.isArray(config.opposites) ? config.opposites : []
  const finishSettle = opposites.length > 0
    ? 1800 + Math.max(0, opposites.length - 1) * 500
    : 900

  return parts.length * interval + finishSettle
}

function mediaFrameStyle(theme, aspect, objectFit = 'contain') {
  const [w, h] = String(aspect).split(':')
  return {
    width: '100%',
    aspectRatio: `${w || 16} / ${h || 9}`,
    display: 'block',
    objectFit,
    borderRadius: RADII.medium,
    border: `1px solid rgba(${theme.accentRgb}, 0.28)`,
    background: GENERAL.backgroundSunken,
  }
}

// ─── Infographic ─────────────────────────────────────────────────────────────
// Canonical screen for block type `infographic`: one teaching heading and one
// short framing line — both owned by the approved TeachScreenShell (Route A) —
// followed by one data-driven infographic media slot. The governed ContinueCTA
// is withheld until the reveal, loaded graphic or short clip has completed.
//
// Visual paths and media behaviour stay in content data. Supported media shapes:
//   imageReveal — MediaPlaceholder reveal config in media.caption
//   image/diagram + src — a supplied still graphic; complete once loaded
//   clip/video + src — a short supplied clip; complete on the ended event
//   placeholder — MediaPlaceholder remains visible and does not unlock progression
//
// Props:
//   subject       — palette key for the accent (default 'History')
//   eyebrow       — optional label, only if it adds information the heading lacks
//   heading       — required; the screen's single teaching heading (sentence case)
//   intro         — optional; one short framing line under the heading
//   media         — content-owned visual data; no topic asset lives here
//   onContinue    — optional progression callback; renders after media completion
//   continueLabel — optional CTA copy (default 'Continue')

export default function Infographic({
  subject = 'History',
  eyebrow,
  heading,
  intro,
  media = {},
  onContinue,
  continueLabel = 'Continue',
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const [mediaComplete, setMediaComplete] = useState(false)
  const resolvedMedia = {
    kind: 'diagram',
    aspect: '4:3',
    ...media,
  }

  useEffect(() => {
    setMediaComplete(false)

    const delay = getInfographicCompletionDelay(resolvedMedia)
    if (delay == null) return undefined

    const timer = window.setTimeout(() => setMediaComplete(true), delay)
    return () => window.clearTimeout(timer)
  }, [media])

  const isClip = resolvedMedia.kind === 'clip' || resolvedMedia.kind === 'video'
  const isSuppliedGraphic =
    (resolvedMedia.kind === 'image' || resolvedMedia.kind === 'diagram') &&
    Boolean(resolvedMedia.src)

  let mediaElement
  if (isClip && resolvedMedia.src) {
    mediaElement = (
      <video
        src={resolvedMedia.src}
        poster={resolvedMedia.poster}
        aria-label={resolvedMedia.alt || 'Infographic clip'}
        autoPlay={resolvedMedia.autoPlay !== false}
        muted={resolvedMedia.muted !== false}
        controls={resolvedMedia.controls === true}
        playsInline
        preload="metadata"
        onEnded={() => setMediaComplete(true)}
        style={mediaFrameStyle(theme, resolvedMedia.aspect, resolvedMedia.objectFit || 'contain')}
      />
    )
  } else if (isSuppliedGraphic) {
    mediaElement = (
      <img
        src={resolvedMedia.src}
        alt={resolvedMedia.alt || ''}
        onLoad={() => setMediaComplete(true)}
        style={mediaFrameStyle(theme, resolvedMedia.aspect, resolvedMedia.objectFit || 'contain')}
      />
    )
  } else {
    mediaElement = <MediaPlaceholder subject={subject} {...resolvedMedia} />
  }

  return (
    <TeachScreenShell subject={subject} eyebrow={eyebrow} heading={heading} intro={intro}>
      {mediaElement}

      <div aria-live="polite">
        {onContinue && mediaComplete && (
          <div className="tss-in" style={{ marginTop: SPACING.separation }}>
            <ContinueCTA
              onClick={onContinue}
              label={continueLabel}
              accent={theme.accent}
            />
          </div>
        )}
      </div>
    </TeachScreenShell>
  )
}
