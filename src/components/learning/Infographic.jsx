import MediaPlaceholder from '../core/MediaPlaceholder.jsx'
import TeachScreenShell from '../core/TeachScreenShell.jsx'

// ─── Infographic ─────────────────────────────────────────────────────────────
// Canonical screen for block type `infographic`: one teaching heading and one
// short framing line — both owned by the approved TeachScreenShell (Route A) —
// followed by a single governed infographic media slot (MediaPlaceholder).
//
// It owns no heading typography or screen rhythm of its own; it fixes the
// standard "title + intro + infographic" composition into one named screen so
// authoring `type: 'infographic'` has a single clear target instead of an
// ad-hoc TeachScreenShell + MediaPlaceholder pairing per chapter.
//
// The media slot passes straight through to MediaPlaceholder, so the infographic
// can be a reserved diagram the author supplies later (kind: 'diagram') or a
// progressive quadrant reveal with opposite-pair arrows (kind: 'imageReveal',
// whose config travels in `media.caption`). See MediaPlaceholder for the full
// media contract.
//
// Props:
//   subject — palette key for the accent (default 'History')
//   eyebrow — optional label, only if it adds information the heading lacks
//   heading — required; the screen's single teaching heading (sentence case)
//   intro   — optional; one short framing line under the heading
//   media   — MediaPlaceholder props: { kind, aspect, caption }

export default function Infographic({ subject = 'History', eyebrow, heading, intro, media = {} }) {
  const { kind = 'diagram', aspect = '4:3', caption } = media
  return (
    <TeachScreenShell subject={subject} eyebrow={eyebrow} heading={heading} intro={intro}>
      <MediaPlaceholder subject={subject} kind={kind} aspect={aspect} caption={caption} />
    </TeachScreenShell>
  )
}
