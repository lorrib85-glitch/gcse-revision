import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import MediaPlaceholder from '../core/MediaPlaceholder.jsx'
import TeachScreenShell from '../core/TeachScreenShell.jsx'

// ─── Infographic ─────────────────────────────────────────────────────────────
// Canonical screen for block type `infographic`: one teaching heading and one
// short framing line — both owned by the approved TeachScreenShell (Route A) —
// followed by one governed infographic media slot and the standard progression
// CTA when an onContinue handler is supplied.
//
// It owns no heading typography or screen rhythm of its own; it fixes the
// standard "title + intro + infographic + continue" composition into one named
// screen so authoring `type: 'infographic'` has a single clear target instead of
// an ad-hoc TeachScreenShell + MediaPlaceholder pairing per chapter.
//
// The complete media object passes straight through to MediaPlaceholder. Image
// paths, reveal configuration, captions and alt text therefore live in content
// data rather than this component, allowing each topic to supply its own visual.
// See MediaPlaceholder for the full media contract.
//
// Props:
//   subject       — palette key for the accent (default 'History')
//   eyebrow       — optional label, only if it adds information the heading lacks
//   heading       — required; the screen's single teaching heading (sentence case)
//   intro         — optional; one short framing line under the heading
//   media         — MediaPlaceholder props; content owns all visual data
//   onContinue    — optional progression callback; renders the locked ContinueCTA
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
  const resolvedMedia = {
    kind: 'diagram',
    aspect: '4:3',
    ...media,
  }

  return (
    <TeachScreenShell subject={subject} eyebrow={eyebrow} heading={heading} intro={intro}>
      <MediaPlaceholder subject={subject} {...resolvedMedia} />

      {onContinue && (
        <ContinueCTA
          onClick={onContinue}
          label={continueLabel}
          accent={theme.accent}
          style={{ marginTop: SPACING.separation }}
        />
      )}
    </TeachScreenShell>
  )
}
