import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'

// ─── ProgressRecoveryCard ────────────────────────────────────────────────────
// Shown once, before the login screen, when earlier progress is found on this
// device that we can't confirm belongs to the current learner (quarantined
// legacy data — see accountScope.js). Deliberately reveals nothing about the
// previous learner: no name, scores, subjects or details, only that *some*
// earlier progress exists. The learner decides:
//   - "Use this progress" → adopt it into their own (guest) progress.
//   - "Start fresh"       → set it aside; nothing is deleted.
// Calm, subject-neutral, mobile-first. No technical wording ever reaches the
// learner (no "migration", "namespace", "storage" or "legacy").

export default function ProgressRecoveryCard({ onUse, onStartFresh, busy = false }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: GENERAL.backgroundApp,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 28px',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(101,230,198,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', gap: SPACING.compact,
        textAlign: 'center',
      }}>
        <h1 style={{ ...TYPE.displayHero, fontSize: 30, color: '#F4EFE6', margin: 0 }}>
          Progress found<br />on this device
        </h1>
        <p style={{ ...TYPE.body, fontSize: 15, color: GENERAL.slate, margin: 0, lineHeight: 1.55 }}>
          We found earlier progress, but couldn’t confirm who it belongs to.
        </p>

        <div style={{ height: SPACING.compact }} />

        <button
          onClick={onUse}
          disabled={busy}
          style={{
            width: '100%', height: 54,
            background: busy ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #3D7A5E 0%, #65E6C6 100%)',
            border: 'none', borderRadius: RADII.button, cursor: busy ? 'default' : 'pointer',
            ...TYPE.buttonLarge, fontSize: 16, color: GENERAL.textOnAccent,
            transition: 'opacity 150ms ease, transform 120ms ease',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'One moment…' : 'Use this progress'}
        </button>

        <button
          onClick={onStartFresh}
          disabled={busy}
          style={{
            background: 'none', border: 'none', cursor: busy ? 'default' : 'pointer',
            ...TYPE.body, fontSize: 14, color: '#7A7670',
            marginTop: SPACING.micro, padding: 8,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Start fresh
        </button>
      </div>
    </div>
  )
}
