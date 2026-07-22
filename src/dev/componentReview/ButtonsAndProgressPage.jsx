// ─── Component Review Lab — Buttons, components and progress reference page ───
//
// DEVELOPMENT-ONLY. One page rendering governed button styles, small reusable
// UI components and progression/progress indicators live, each labelled with
// its name. Companion to docs/system/BUTTON_RADII_SYSTEM.md — this shows the
// real components, the doc states the law. Nothing here is learner-facing.

import { useState } from 'react'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import CinematicContinueCTA from '../../components/core/CinematicContinueCTA.jsx'
import CheckAnswerCTA from '../../components/core/CheckAnswerCTA.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import ExitButton from '../../components/core/ExitButton.jsx'
import ModuleToolbar from '../../components/core/ModuleToolbar.jsx'
import LearningProgressHeader from '../../components/core/LearningProgressHeader.jsx'
import SequenceProgress from '../../components/core/SequenceProgress.jsx'
import ScoreNumberLine from '../../components/core/ScoreNumberLine.jsx'
import CircularTimer from '../../components/core/CircularTimer.jsx'
import CinematicDivider from '../../components/core/CinematicDivider.jsx'
import { BUTTONS } from '../../constants/buttons.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'

const mono = { fontFamily: "'Sora', sans-serif" }
const ACCENT = SUBJECT_ACCENTS.History
const ACCENT_RGB = hexToRgb(ACCENT)

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.teal, marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </section>
  )
}

function Item({ name, note, children }) {
  return (
    <div style={{ marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${GENERAL.line.soft}` }}>
      <div style={{ ...mono, fontSize: 14, fontWeight: 700, color: GENERAL.softWhite, marginBottom: 2 }}>{name}</div>
      {note && <div style={{ ...mono, fontSize: 11.5, lineHeight: 1.45, color: GENERAL.slate, marginBottom: 12 }}>{note}</div>}
      {children}
    </div>
  )
}

// Sample buttons for the raw BUTTONS token tiers (primary / secondary / compact
// / text), built exactly as the usage examples in BUTTON_RADII_SYSTEM.md.
function TierButton({ tier, label }) {
  const t = BUTTONS[tier]
  return (
    <button style={{
      ...mono,
      width: '100%',
      height: t.height,
      padding: `0 ${t.paddingX}px`,
      borderRadius: t.borderRadius,
      border: 'none',
      fontSize: t.fontSize,
      fontWeight: t.fontWeight,
      background: ACCENT,
      color: '#0D0F14',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  )
}

export default function ButtonsAndProgressPage() {
  const [score, setScore] = useState(5)

  return (
    <div style={{ maxWidth: 390, margin: '0 auto' }}>
      <Section title="Buttons — governed components">
        <Item name="ContinueCTA" note="LOCKED. The only Primary Progression CTA. 56px, RADII.large, accent fill, label exactly “Continue”.">
          <ContinueCTA onClick={() => {}} accent={ACCENT} />
          <ContinueCTA onClick={() => {}} accent={ACCENT} disabled style={{ marginTop: 10 }} />
        </Item>

        <Item name="CinematicContinueCTA" note="LOCKED. The only Cinematic Reveal CTA — plain text “Continue →”, normally fixed to the bottom of a full-screen moment (shown in flow here).">
          <div style={{ padding: '18px 0', background: '#000', borderRadius: RADII.small }}>
            <CinematicContinueCTA onClick={() => {}} accent={ACCENT} style={{ position: 'static' }} />
          </div>
        </Item>

        <Item name="CheckAnswerCTA" note="Governed check/submit action for assessed screens — secondary token (56px, RADII.medium) so it never competes with Continue.">
          <CheckAnswerCTA onClick={() => {}} accent={ACCENT} />
          <CheckAnswerCTA onClick={() => {}} accent={ACCENT} disabled style={{ marginTop: 10 }} />
        </Item>

        <Item name="BackButton" note="LOCKED. The only back-navigation button — 40×40 pill, left chevron.">
          <BackButton onClick={() => {}} />
        </Item>

        <Item name="ExitButton" note="LOCKED. The only exit-navigation button — 44×44, near-invisible ✕ with press feedback.">
          <ExitButton onClick={() => {}} />
        </Item>

        <Item name="ModuleToolbar" note="LOCKED. Back + exit navigation layer, delegating to BackButton and ExitButton.">
          <ModuleToolbar onBack={() => {}} onExit={() => {}} />
        </Item>
      </Section>

      <Section title="Buttons — token tiers & patterns">
        <Item name="BUTTONS.primary" note="74px, RADII.large (22px) — the dominant CTA for a screen.">
          <TierButton tier="primary" label="Primary button" />
        </Item>

        <Item name="BUTTONS.secondary" note="56px, RADII.medium (16px) — supporting action, second-level CTA.">
          <TierButton tier="secondary" label="Secondary button" />
        </Item>

        <Item name="BUTTONS.compact" note="44px, RADII.small (10px) — minimum tap target, contextual actions.">
          <TierButton tier="compact" label="Compact button" />
        </Item>

        <Item name="BUTTONS.text" note="No height or background — inline skip/secondary text action at 0.46 opacity.">
          <button style={{
            ...mono, background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontSize: BUTTONS.text.fontSize, fontWeight: BUTTONS.text.fontWeight,
            opacity: BUTTONS.text.opacity, color: GENERAL.softWhite,
          }}>
            Skip for now
          </button>
        </Item>

        <Item name="cinematic-primary-action" note="CSS class in globals.css — full-width cinematic primary CTA, accent via --cinematic-accent, RADII.large (never pill).">
          <button className="cinematic-primary-action" style={{ '--cinematic-accent': ACCENT }}>
            Continue
          </button>
        </Item>

        <Item name="NavArrow" note="Local pattern in Pulse.jsx / ExamMode.jsx — “open this item” destination arrow. Not a progression CTA.">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GENERAL.teal} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Item>
      </Section>

      <Section title="Reusable decorative components">
        <Item name="CinematicDivider" note="Line–diamond–line separator for a calm editorial beat between cinematic content sections. Lines use governed neutral tokens; the centre motif inherits the subject accent.">
          <div style={{ display: 'grid', gap: 22, justifyItems: 'center', padding: '22px 16px', background: GENERAL.backgroundSunken, borderRadius: RADII.small }}>
            <CinematicDivider size="compact" accent={ACCENT} accentRgb={ACCENT_RGB} />
            <CinematicDivider accent={ACCENT} accentRgb={ACCENT_RGB} />
            <CinematicDivider size="wide" accent={ACCENT} accentRgb={ACCENT_RGB} />
          </div>
        </Item>
      </Section>

      <Section title="Progress & progression indicators">
        <Item name="LearningProgressHeader" note="LOCKED. Module stage rail — six tappable dots (done / current / future), tooltip on tap.">
          <LearningProgressHeader
            currentScreen={5}
            stageNavigation={[
              { id: 's1', title: 'Intro', description: '', screenIndex: 0 },
              { id: 's2', title: 'Learn 1', description: '', screenIndex: 2 },
              { id: 's3', title: 'Learn 2', description: '', screenIndex: 4 },
              { id: 's4', title: 'Learn 3', description: '', screenIndex: 6 },
              { id: 's5', title: 'Review', description: '', screenIndex: 8 },
              { id: 's6', title: 'Exam prep', description: '', screenIndex: 10 },
            ]}
            accent={ACCENT}
            accentRgb={ACCENT_RGB}
          />
        </Item>

        <Item name="SequenceProgress (dots)" note="Local sequence progress for carousels, swipe cards and mini-steps. Never renders numbers or labels.">
          <SequenceProgress total={6} current={2} completed={2} accent={ACCENT} accentRgb={ACCENT_RGB} />
        </Item>

        <Item name="SequenceProgress (sash)" note="Segment-bar variant of the same component — stretch mode fills the row.">
          <SequenceProgress total={6} current={2} completed={2} variant="sash" stretch accent={ACCENT} accentRgb={ACCENT_RGB} />
        </Item>

        <Item name="ScoreNumberLine" note="Tappable mark-out-of-N number line used in self-marking flows.">
          <ScoreNumberLine value={score} max={8} onChange={setScore} accent={ACCENT} />
        </Item>

        <Item name="CircularTimer" note="SVG countdown ring used in timed quiz modes.">
          <CircularTimer seconds={32} totalSeconds={90} />
        </Item>

        <Item name="Pill progress bar" note="The generic RADII.pill track/fill bar pattern used on cards and question screens (progress bars are always pill).">
          <div style={{ height: 6, borderRadius: RADII.pill, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: '55%', height: '100%', borderRadius: RADII.pill, background: ACCENT }} />
          </div>
        </Item>
      </Section>
    </div>
  )
}
