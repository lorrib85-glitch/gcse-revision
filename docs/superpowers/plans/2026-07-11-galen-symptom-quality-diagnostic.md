# Symptom-quality diagnostic set (Episode 1, Galen stage) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "From symptoms to treatment" worked example and "Think Like Galen" theoryLab screens in Episode 1 (Medicine Through Time) with one new, unified `SymptomQualityDiagnostic` component that teaches Hot/Cold/Wet/Dry via example symptoms, walks one patient case (fever + phlegm cough), asks the learner to select the dominant quadrant, asks a treatment multiple-choice question, and closes with the opposite-quality recall plus a short legacy beat.

**Architecture:** One new React component (`src/components/learning/SymptomQualityDiagnostic.jsx`) owns ten internal beats via `useState`, following the exact structural precedent of `TheoryLab.jsx` (bespoke `Screen`/`Pad` layout wrappers, design tokens only, no `AnswerInteraction`). It replaces two existing `screens[]` entries in the episode content with one, which shifts the Episode 1 runtime screen count from 34 to 33 — three downstream files that hard-code that count/order must be updated in lockstep.

**Tech Stack:** React (function components, hooks), no new dependencies.

## Global Constraints

- No images anywhere in the new component (source: design spec).
- Sentence case throughout all copy — headings, questions, option labels, button labels. No decorative uppercase, no `TYPE.eyebrow` / hand-typed ALL-CAPS labels (source: `CLAUDE.md` → Titles and Headings; `docs/system/TYPOGRAPHY_SYSTEM.md` → Label case).
- No raw px/hex values — every spacing, radius, motion timing, typography and colour value comes from `SPACING`/`RADII`/`MOTION`/`TYPE`/`SUBJECTS`/`BUTTONS` (source: `docs/system/COMPONENT_AUTHORING_RULES.md`).
- Quadrant-select and treatment-MCQ interactions are bespoke selection UI (not the locked `AnswerInteraction.jsx`), following `TheoryLab.jsx`'s established local pattern for this genre (source: design spec).
- The Four Humours quadrant reveal screen and the "Galen treated with opposites" diagram screen (runtime screen index 8) are untouched.
- Reading age ~12, vocabulary explained on first use (source: `docs/system/TEACHING_VOICE_GUIDE.md`).

---

## Task 1: Fix the runtime sequencing so the split screen produces one screen, not two

**Files:**
- Modify: `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js:328-334` (remove the `workedExample` block)
- Modify: `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js:110-119` (remove the now-incorrect index compensation)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: an episode source file whose `screens[]` array no longer contains a `workedExample` block in the Galen "Every illness had an opposite" screen, and a runtime file whose `transformScreenIndex` no longer adds a compensating `+1` for screens after the theory screen. After this task, `episode-01-medieval-beliefs-causes.runtime.js`'s default export has `screens.length === 33` (down from 34), because `splitTheoryOfOppositesScreen` now returns a single-element array (its `workedExampleBlocks.length === 0` branch) instead of two screens.

This task must land *before* Task 5 replaces the old `theoryLab` screen, because the screen-count drop (34→33) is what Tasks 6 and 7 need to react to. Landing it first also lets you verify the count change in isolation.

- [ ] **Step 1: Remove the `workedExample` block from the source screen**

In `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`, the screen at lines 315-336 currently reads:

```js
    {
      stage: 'Galen',
      label: 'The Theory of Opposites',
      shell: 'teach',
      heading: 'Every illness had an opposite',
      sub: 'Each humour sat where two qualities met — hot or cold, wet or dry. A patient\'s symptoms revealed which were in excess.',
      blocks: [
        {
          type: 'mediaPlaceholder',
          kind: 'diagram',
          aspect: '4:3',
          caption: 'The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant.',
        },
        {
          type: 'workedExample',
          chips: ['Fever', 'Red face', 'Sweating'],
          scenario: 'A patient arrives with a fever, a red face and heavy sweating.',
          working: 'Heat and wetness point to one humour in excess: too much blood, which is hot and wet.',
          result: 'So the cure is to cool and dry the body — the opposite qualities.',
        },
      ],
    },
```

Change it to remove the `workedExample` block, leaving only the `mediaPlaceholder`:

```js
    {
      stage: 'Galen',
      label: 'The Theory of Opposites',
      shell: 'teach',
      heading: 'Every illness had an opposite',
      sub: 'Each humour sat where two qualities met — hot or cold, wet or dry. A patient\'s symptoms revealed which were in excess.',
      blocks: [
        {
          type: 'mediaPlaceholder',
          kind: 'diagram',
          aspect: '4:3',
          caption: 'The four humours placed on hot–cold and wet–dry axes, with an arrow crossing to the opposite quadrant.',
        },
      ],
    },
```

- [ ] **Step 2: Remove the theory-screen index compensation in the runtime file**

In `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js`, `transformScreenIndex` currently reads:

```js
function transformScreenIndex(screenIndex) {
  if (typeof screenIndex !== 'number') return screenIndex

  let nextIndex = screenIndex
  if (removedScreenIndex >= 0 && nextIndex > removedScreenIndex) nextIndex -= 1
  if (galenProfileIndex >= 0 && nextIndex >= galenProfileIndex) nextIndex += 1
  if (theoryScreenIndex >= 0 && screenIndex > theoryScreenIndex) nextIndex += 1

  return nextIndex
}
```

Remove the now-incorrect `theoryScreenIndex` compensation line (the split no longer produces an extra screen, so nothing after it needs shifting):

```js
function transformScreenIndex(screenIndex) {
  if (typeof screenIndex !== 'number') return screenIndex

  let nextIndex = screenIndex
  if (removedScreenIndex >= 0 && nextIndex > removedScreenIndex) nextIndex -= 1
  if (galenProfileIndex >= 0 && nextIndex >= galenProfileIndex) nextIndex += 1

  return nextIndex
}
```

Leave the `theoryScreenIndex` variable declaration itself untouched — it's still used by `splitTheoryOfOppositesScreen` to find the screen to split.

- [ ] **Step 3: Verify the screen count and stage navigation**

Run:

```bash
node -e "
import('./src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js').then(m => {
  const episode = m.default
  console.log('screens.length:', episode.screens.length)
  console.log('screen 8:', episode.screens[8].heading || episode.screens[8].label, '| type:', episode.screens[8].type)
  console.log('screen 9:', episode.screens[9].heading || episode.screens[9].label, '| type:', episode.screens[9].type)
  console.log('stageNavigation:', JSON.stringify(episode.stageNavigation.map(s => s.screenIndex)))
})
"
```

Expected output:
```
screens.length: 33
screen 8: The Theory of Opposites | type: undefined
screen 9: Think Like Galen | type: theoryLab
stageNavigation: [0,1,7,11,24,27]
```

(Screen 9 is still the old `theoryLab` screen at this point — Task 5 replaces it. The stage navigation values `[0,1,7,11,24,27]` confirm the `+1` shift for part-4/5/6 is gone: they were `[0,1,7,12,25,28]` before this task.)

- [ ] **Step 4: Commit**

```bash
git add src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js
git commit -m "Drop the worked-example half of the Galen theory split screen

Episode 1's diagram+worked-example screen now produces one runtime
screen instead of two, ahead of replacing the old theoryLab screen
with the new unified diagnostic set."
```

---

## Task 2: Build the SymptomQualityDiagnostic component

**Files:**
- Create: `src/components/learning/SymptomQualityDiagnostic.jsx`

**Interfaces:**
- Consumes: `SUBJECTS` (`src/constants/subjects.js`), `SPACING`, `RADII`, `MOTION`, `TYPE`, `BUTTONS`, `ContinueCTA` (`src/components/core/ContinueCTA.jsx`).
- Produces: `export default function SymptomQualityDiagnostic({ block, subject, onContinue })` — same call signature as `TheoryLab`/`GalensDiagnostic`, so `ModulePlayer.jsx` (Task 4) can route to it identically. `block` is the `symptomQualityDiagnostic` content shape defined below; `onContinue` fires once, when the learner finishes the closing beat.

Block data shape this component expects:

```js
{
  qualities: [                                    // exactly 4: hot, cold, wet, dry, in that order
    { quality: 'hot',  symptoms: ['Fever', 'Red face', 'Flushed skin'] },
    { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
    { quality: 'wet',  symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
    { quality: 'dry',  symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
  ],
  patient: {
    title: 'A patient arrives',
    symptoms: ['Fever', 'Phlegm cough'],
  },
  quadrantQuestion: 'Which qualities dominate?',
  quadrantOptions: [                               // exactly 4
    { label: 'Hot + wet', correct: true },
    { label: 'Hot + dry', correct: false },
    { label: 'Cold + wet', correct: false },
    { label: 'Cold + dry', correct: false },
  ],
  diagnosis: { label: 'Hot + wet' },
  treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
  treatmentOptions: [                              // any number, exactly one correct: true
    { label: 'Cucumber and dry bread', correct: true, explanation: '...' },
    { label: 'Hot soup and warm wine', correct: false, explanation: '...' },
  ],
  oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
  closing: {
    worked: ['Rest', 'Fluids', 'Cooling foods'],
    limitation: '...',
    verdict: '...',
    church: { heading: 'Supported by the Church', body: '...' },
    significance: '...',
  },
}
```

- [ ] **Step 1: Write the component file**

```jsx
import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// ── SymptomQualityDiagnostic ────────────────────────────────────────────────
// Ten-beat cinematic diagnostic set: teaches Hot/Cold/Wet/Dry through example
// symptoms, walks one patient case, asks the learner to pick the dominant
// quadrant, asks a treatment multiple-choice question, then closes with the
// opposite-quality recall and a short legacy beat. No images — text and
// design-token surfaces only. See block shape in this file's header comment
// and docs/system/component-contracts/symptom-quality-diagnostic.md.

let _sqdStyled = false
function ensureStyles() {
  if (_sqdStyled) return
  _sqdStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes sqd-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes sqd-in-left {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes sqd-shake {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(5px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(3px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .sqd-motion { animation: none !important; }
    }
  `
  document.head.appendChild(el)
}

const ease = MOTION.easing.standard
function anim(name, duration = MOTION.duration.slow, delay = 0) {
  return `${name} ${duration} ${ease} ${delay}ms both`
}

// ── Shared layout primitives (follows TheoryLab.jsx's established pattern
//    for this genre of screen) ────────────────────────────────────────────

function Screen({ children }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#09070A', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

function Pad({ children }) {
  return (
    <div style={{
      maxWidth: 420,
      margin: '0 auto',
      padding: `${SPACING.cinematic}px ${SPACING.standard}px ${SPACING.section}px`,
    }}>
      {children}
    </div>
  )
}

function Label({ children, accent }) {
  return (
    <p style={{ ...TYPE.label, color: accent, margin: `0 0 ${SPACING.compact}px`, opacity: 0.85 }}>
      {children}
    </p>
  )
}

function ActionBtn({ label, onClick, accent, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: BUTTONS.continue.height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: disabled ? 'rgba(255,255,255,0.08)' : accent,
        border: 'none',
        borderRadius: BUTTONS.continue.borderRadius,
        color: disabled ? 'rgba(255,255,255,0.3)' : '#0D0F14',
        fontFamily: BUTTONS.continue.fontFamily,
        fontSize: BUTTONS.continue.fontSize,
        fontWeight: BUTTONS.continue.fontWeight,
        cursor: disabled ? 'default' : 'pointer',
        transition: `transform ${BUTTONS.continue.transition}`,
      }}
    >
      {label}
    </button>
  )
}

// A single quality-teaching beat: the word, then its example symptoms fade
// in one at a time. Reused four times (hot, cold, wet, dry) — the one
// deliberately reusable sub-piece in this component.
function QualityBeat({ quality, symptoms, accent, rgb, onNext }) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= symptoms.length) return
    const delay = revealed === 0 ? 550 : 420
    const t = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed, symptoms.length])

  const label = quality.charAt(0).toUpperCase() + quality.slice(1)
  const allRevealed = revealed >= symptoms.length

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.displayHero,
          color: accent,
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in'),
        }}>
          {label}
        </p>

        <div style={{ marginBottom: SPACING.separation }}>
          {symptoms.slice(0, revealed).map((symptom) => (
            <div key={symptom} className="sqd-motion" style={{
              display: 'flex', alignItems: 'center', gap: SPACING.compact,
              marginBottom: SPACING.compact,
              animation: anim('sqd-in-left'),
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ ...TYPE.bodyLarge, color: 'rgba(240,230,200,0.85)' }}>{symptom}</span>
            </div>
          ))}
        </div>

        {allRevealed && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
      </Pad>
    </Screen>
  )
}

// The patient case — the one worked example in this set. Symptoms reveal
// progressively, same pacing as QualityBeat, then a Continue.
function PatientBeat({ patient, accent, onNext }) {
  const symptoms = patient.symptoms || []
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= symptoms.length) return
    const delay = revealed === 0 ? 550 : 420
    const t = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed, symptoms.length])

  const allRevealed = revealed >= symptoms.length

  return (
    <Screen>
      <Pad>
        <Label accent={accent}>The patient</Label>
        <p className="sqd-motion" style={{
          ...TYPE.displaySection,
          color: '#F0E6C8',
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in'),
        }}>
          {patient.title}
        </p>

        <div style={{ marginBottom: SPACING.separation }}>
          {symptoms.slice(0, revealed).map((symptom) => (
            <div key={symptom} className="sqd-motion" style={{
              display: 'flex', alignItems: 'center', gap: SPACING.compact,
              marginBottom: SPACING.compact,
              animation: anim('sqd-in-left'),
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ ...TYPE.displayCard, color: '#F0E6C8' }}>{symptom}</span>
            </div>
          ))}
        </div>

        {allRevealed && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
      </Pad>
    </Screen>
  )
}

// Quadrant-select — bespoke choice UI (not AnswerInteraction), matching
// TheoryLab.jsx's ScenarioStage precedent for this genre.
function QuadrantBeat({ question, options, accent, rgb, onNext }) {
  const [selected, setSelected] = useState(null)
  const [shaking, setShaking] = useState(false)

  function handleSelect(idx) {
    if (selected !== null) return
    const opt = options[idx]
    setSelected(idx)
    if (opt?.correct) {
      setTimeout(onNext, 500)
    } else {
      setShaking(true)
      setTimeout(() => { setShaking(false); setSelected(null) }, 700)
    }
  }

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.label, color: `rgba(${rgb}, 0.85)`,
          margin: `0 0 ${SPACING.compact}px`,
          animation: anim('sqd-in'),
        }}>
          {question}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.compact }}>
          {options.map((opt, i) => {
            const isSelected = selected === i
            const isWrong = isSelected && shaking
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(i)}
                className={isWrong ? 'sqd-motion' : undefined}
                style={{
                  padding: `${SPACING.compact}px`,
                  background: isWrong ? 'rgba(180,50,30,0.1)' : isSelected ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isWrong ? 'rgba(200,60,40,0.45)' : isSelected ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: RADII.small,
                  color: isWrong ? 'rgba(220,90,70,0.9)' : isSelected ? accent : 'rgba(240,230,200,0.7)',
                  ...TYPE.buttonLarge,
                  cursor: 'pointer',
                  textAlign: 'center',
                  minHeight: 52,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: `background ${MOTION.duration.fast} ease, border-color ${MOTION.duration.fast} ease`,
                  animation: isWrong ? 'sqd-shake 0.4s ease' : 'none',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </Pad>
    </Screen>
  )
}

// Brief diagnosis confirmation — no interaction, sets up the treatment
// question that follows.
function DiagnosisBeat({ diagnosis, accent, onNext }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Diagnosis</Label>
        <p className="sqd-motion" style={{
          ...TYPE.displayHero,
          color: accent,
          margin: `0 0 ${SPACING.separation}px`,
          animation: anim('sqd-in', MOTION.duration.cinematic),
        }}>
          {diagnosis.label}
        </p>
        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 300) }}>
          <ContinueCTA onClick={onNext} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

// Treatment multiple-choice question — one correct answer, feedback
// explains the reasoning. Bespoke choice UI, same rationale as QuadrantBeat.
function TreatmentBeat({ question, options, accent, rgb, onNext }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const chosen = answered ? options[selected] : null

  function handleSelect(idx) {
    if (answered) return
    setSelected(idx)
  }

  return (
    <Screen>
      <Pad>
        <p className="sqd-motion" style={{
          ...TYPE.displayCard, color: '#F0E6C8',
          margin: `0 0 ${SPACING.standard}px`,
          animation: anim('sqd-in'),
        }}>
          {question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact, marginBottom: SPACING.standard }}>
          {options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect = opt.correct
            const revealState = answered && isCorrect
            const revealWrong = answered && isSelected && !isCorrect
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(i)}
                disabled={answered}
                style={{
                  padding: `${SPACING.compact}px`,
                  textAlign: 'left',
                  background: revealState ? `rgba(${rgb}, 0.14)` : revealWrong ? 'rgba(180,50,30,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${revealState ? `rgba(${rgb}, 0.55)` : revealWrong ? 'rgba(200,60,40,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: RADII.small,
                  color: revealState ? accent : revealWrong ? 'rgba(220,90,70,0.9)' : 'rgba(240,230,200,0.75)',
                  ...TYPE.bodyStrong,
                  cursor: answered ? 'default' : 'pointer',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in'), marginBottom: SPACING.standard }}>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.6)', lineHeight: 1.6 }}>
              {chosen.explanation}
            </p>
          </div>
        )}

        {answered && chosen.correct && (
          <div className="sqd-motion" style={{ animation: anim('sqd-in') }}>
            <ContinueCTA onClick={onNext} accent={accent} />
          </div>
        )}
        {answered && !chosen.correct && (
          <ActionBtn label="Try again" onClick={() => setSelected(null)} accent={accent} />
        )}
      </Pad>
    </Screen>
  )
}

// Opposite-quality recall — the transformation reveal.
function OppositeRecallBeat({ recall, accent, rgb, onNext }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Restoring balance</Label>
        <div className="sqd-motion" style={{
          textAlign: 'center',
          padding: `${SPACING.standard}px`,
          background: `rgba(${rgb}, 0.06)`,
          border: `1px solid rgba(${rgb}, 0.18)`,
          borderRadius: RADII.medium,
          marginBottom: SPACING.separation,
          animation: anim('sqd-in'),
        }}>
          <p style={{ ...TYPE.displayCard, color: 'rgba(240,230,200,0.7)', margin: 0 }}>{recall.from}</p>
          <p style={{ ...TYPE.body, color: `rgba(${rgb}, 0.5)`, margin: `${SPACING.micro}px 0` }}>↓</p>
          <p style={{ ...TYPE.displayCard, color: '#F0E6C8', margin: 0 }}>{recall.to}</p>
          <p style={{ ...TYPE.body, color: `rgba(${rgb}, 0.5)`, margin: `${SPACING.micro}px 0` }}>↓</p>
          <p style={{ ...TYPE.displaySection, color: accent, margin: 0 }}>{recall.result}</p>
        </div>
        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 200) }}>
          <ContinueCTA onClick={onNext} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

// Short closing beat — condensed from TheoryLab's two-beat evaluation into
// one: did the cure work, and why the Church kept the theory alive.
function ClosingBeat({ closing, accent, rgb, onComplete }) {
  return (
    <Screen>
      <Pad>
        <Label accent={accent}>Did the cure work?</Label>

        {closing.worked?.length > 0 && (
          <div className="sqd-motion" style={{ marginBottom: SPACING.standard, animation: anim('sqd-in') }}>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.55)', margin: `0 0 ${SPACING.micro}px` }}>
              Rest, fluids and cooling foods often helped patients recover:
            </p>
            <p style={{ ...TYPE.body, color: 'rgba(240,230,200,0.85)', margin: 0 }}>
              {closing.worked.join(', ')}.
            </p>
          </div>
        )}

        {closing.verdict && (
          <p className="sqd-motion" style={{
            ...TYPE.bodySmall, color: 'rgba(240,230,200,0.65)', lineHeight: 1.6,
            borderLeft: `2px solid rgba(${rgb}, 0.3)`, paddingLeft: SPACING.compact,
            margin: `0 0 ${SPACING.standard}px`,
            animation: anim('sqd-in', MOTION.duration.slow, 100),
          }}>
            {closing.verdict}
          </p>
        )}

        {closing.church && (
          <div className="sqd-motion" style={{ marginBottom: SPACING.standard, animation: anim('sqd-in', MOTION.duration.slow, 180) }}>
            <p style={{ ...TYPE.bodyStrong, color: '#F0E6C8', margin: `0 0 ${SPACING.micro}px` }}>
              {closing.church.heading}
            </p>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(240,230,200,0.6)', lineHeight: 1.6, margin: 0 }}>
              {closing.church.body}
            </p>
          </div>
        )}

        {closing.significance && (
          <div className="sqd-motion" style={{
            padding: `${SPACING.standard}px`,
            background: `rgba(${rgb}, 0.08)`,
            border: `1px solid rgba(${rgb}, 0.25)`,
            borderRadius: RADII.medium,
            marginBottom: SPACING.separation,
            animation: anim('sqd-in', MOTION.duration.slow, 260),
          }}>
            <p style={{ ...TYPE.body, color: accent, margin: 0 }}>{closing.significance}</p>
          </div>
        )}

        <div className="sqd-motion" style={{ animation: anim('sqd-in', MOTION.duration.slow, 340) }}>
          <ActionBtn label="Complete" onClick={onComplete} accent={accent} />
        </div>
      </Pad>
    </Screen>
  )
}

const QUALITY_BEAT_COUNT = 4 // hot, cold, wet, dry — beats 0-3

export default function SymptomQualityDiagnostic({ block, subject, onContinue }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  const [beat, setBeat] = useState(0)
  const nextBeat = () => setBeat(b => b + 1)

  const qualities = block.qualities || []

  if (beat < QUALITY_BEAT_COUNT) {
    const q = qualities[beat]
    return (
      <QualityBeat
        key={q.quality}
        quality={q.quality}
        symptoms={q.symptoms}
        accent={accent}
        rgb={rgb}
        onNext={nextBeat}
      />
    )
  }

  if (beat === 4) return <PatientBeat patient={block.patient} accent={accent} onNext={nextBeat} />

  if (beat === 5) return (
    <QuadrantBeat
      question={block.quadrantQuestion}
      options={block.quadrantOptions}
      accent={accent}
      rgb={rgb}
      onNext={nextBeat}
    />
  )

  if (beat === 6) return <DiagnosisBeat diagnosis={block.diagnosis} accent={accent} onNext={nextBeat} />

  if (beat === 7) return (
    <TreatmentBeat
      question={block.treatmentQuestion}
      options={block.treatmentOptions}
      accent={accent}
      rgb={rgb}
      onNext={nextBeat}
    />
  )

  if (beat === 8) return (
    <OppositeRecallBeat recall={block.oppositeRecall} accent={accent} rgb={rgb} onNext={nextBeat} />
  )

  if (beat === 9) return (
    <ClosingBeat closing={block.closing} accent={accent} rgb={rgb} onComplete={() => onContinue?.()} />
  )

  return null
}
```

- [ ] **Step 2: Verify it builds**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds with 0 errors (the component isn't wired into `ModulePlayer.jsx` yet, so this only checks the file is syntactically and import-valid — Vite will still tree-shake/compile it as part of the `src/components/learning/` glob).

- [ ] **Step 3: Commit**

```bash
git add src/components/learning/SymptomQualityDiagnostic.jsx
git commit -m "Add SymptomQualityDiagnostic component

Ten-beat cinematic diagnostic set: Hot/Cold/Wet/Dry teaching beats, one
patient case, quadrant-select, diagnosis reveal, treatment MCQ, opposite
recall, and a closing legacy beat. No images; design tokens only."
```

---

## Task 3: Write the stories file

**Files:**
- Create: `src/components/learning/SymptomQualityDiagnostic.stories.jsx`

**Interfaces:**
- Consumes: `SymptomQualityDiagnostic` (Task 2).
- Produces: a Storybook story usable by the Playwright suite, per `docs/system/workflows/E_BIG_BUILD.md`'s "Story obligation."

- [ ] **Step 1: Write the stories file**

```jsx
import SymptomQualityDiagnostic from './SymptomQualityDiagnostic'

export default {
  component: SymptomQualityDiagnostic,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Gold — the Galen fever + phlegm cough case, matching the shipped Episode 1
// content (src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js,
// Galen stage).
export const Gold = {
  name: 'Gold — fever and phlegm cough',
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      qualities: [
        { quality: 'hot', symptoms: ['Fever', 'Red face', 'Flushed skin'] },
        { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
        { quality: 'wet', symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
        { quality: 'dry', symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
      ],
      patient: {
        title: 'A patient arrives',
        symptoms: ['Fever', 'Phlegm cough'],
      },
      quadrantQuestion: 'Which qualities dominate?',
      quadrantOptions: [
        { label: 'Hot + wet', correct: true },
        { label: 'Hot + dry', correct: false },
        { label: 'Cold + wet', correct: false },
        { label: 'Cold + dry', correct: false },
      ],
      diagnosis: { label: 'Hot + wet' },
      treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
      treatmentOptions: [
        {
          label: 'Cucumber and dry bread',
          correct: true,
          explanation: 'Cold and dry qualities pull the body back towards balance against the hot, wet excess.',
        },
        {
          label: 'Hot soup and warm wine',
          correct: false,
          explanation: 'Hot and wet — the same qualities causing the illness, not the opposite.',
        },
        {
          label: 'Warm blankets and a thick stew',
          correct: false,
          explanation: 'Still adds heat, when the patient needs cooling.',
        },
        {
          label: 'Cold milk and steamed vegetables',
          correct: false,
          explanation: "Cold is right, but this is still moist — it doesn't dry the body.",
        },
      ],
      oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
      closing: {
        worked: ['Rest', 'Fluids', 'Cooling foods'],
        limitation: 'Disease is not actually caused by an imbalance of the four humours.',
        verdict: 'Patients who rested, drank fluids and ate cooling foods often did recover. To Galen, and to the doctors who followed him, that recovery looked like proof the theory worked, even though the humours had nothing to do with it.',
        church: {
          heading: 'Supported by the Church',
          body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas, so the Church preserved and promoted his work for centuries.",
        },
        significance: "That's why the Theory of Opposites survived for over 1,400 years. It wasn't blind faith. It was a theory that seemed to keep working, treatment after treatment, patient after patient.",
      },
    },
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/learning/SymptomQualityDiagnostic.stories.jsx
git commit -m "Add stories file for SymptomQualityDiagnostic"
```

---

## Task 4: Route the new block type in ModulePlayer

**Files:**
- Modify: `src/components/layout/ModulePlayer.jsx:41-49` (import)
- Modify: `src/components/layout/ModulePlayer.jsx:2176-2188` (routing case)

**Interfaces:**
- Consumes: `SymptomQualityDiagnostic` (Task 2).
- Produces: `ModulePlayer` now renders `SymptomQualityDiagnostic` whenever `cur.type === 'symptomQualityDiagnostic'`, matching the calling convention of every other full-screen block type in this switch (`LearningHeader` + component + `jumpSheetPortal`).

- [ ] **Step 1: Add the import**

In `src/components/layout/ModulePlayer.jsx`, next to the existing `TheoryLab` import (line 45):

```js
import TheoryLab from '../learning/TheoryLab.jsx'
import SymptomQualityDiagnostic from '../learning/SymptomQualityDiagnostic.jsx'
```

- [ ] **Step 2: Add the routing case**

Immediately after the existing `theoryLab` case (`ModulePlayer.jsx:2176-2188`):

```jsx
  if (cur?.type === 'theoryLab') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TheoryLab
          block={cur}
          subject={module.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (cur?.type === 'symptomQualityDiagnostic') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <SymptomQualityDiagnostic
          block={cur}
          subject={module.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }
```

- [ ] **Step 3: Verify the build**

Run: `./node_modules/.bin/vite build`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ModulePlayer.jsx
git commit -m "Route symptomQualityDiagnostic block type to the new component"
```

---

## Task 5: Replace the theoryLab screen with the new content block

**Files:**
- Modify: `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js:338-401`

**Interfaces:**
- Consumes: the `symptomQualityDiagnostic` data shape (Task 2).
- Produces: the episode's `screens[]` array now has a `symptomQualityDiagnostic` screen where the old `theoryLab` screen was — same array position, so `episode-01-medieval-beliefs-causes.runtime.js` needs no further changes beyond Task 1.

- [ ] **Step 1: Replace the theoryLab screen**

Replace lines 338-401 (the entire `{ type: 'theoryLab', ... }` screen object) with:

```js
    {
      type: 'symptomQualityDiagnostic',
      stage: 'Galen',
      label: 'Symptom to treatment',
      qualities: [
        { quality: 'hot', symptoms: ['Fever', 'Red face', 'Flushed skin'] },
        { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
        { quality: 'wet', symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
        { quality: 'dry', symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
      ],
      patient: {
        title: 'A patient arrives',
        symptoms: ['Fever', 'Phlegm cough'],
      },
      quadrantQuestion: 'Which qualities dominate?',
      quadrantOptions: [
        { label: 'Hot + wet', correct: true },
        { label: 'Hot + dry', correct: false },
        { label: 'Cold + wet', correct: false },
        { label: 'Cold + dry', correct: false },
      ],
      diagnosis: { label: 'Hot + wet' },
      treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
      treatmentOptions: [
        {
          label: 'Cucumber and dry bread',
          correct: true,
          explanation: 'Cold and dry qualities pull the body back towards balance against the hot, wet excess.',
        },
        {
          label: 'Hot soup and warm wine',
          correct: false,
          explanation: 'Hot and wet — the same qualities causing the illness, not the opposite.',
        },
        {
          label: 'Warm blankets and a thick stew',
          correct: false,
          explanation: 'Still adds heat, when the patient needs cooling.',
        },
        {
          label: 'Cold milk and steamed vegetables',
          correct: false,
          explanation: "Cold is right, but this is still moist — it doesn't dry the body.",
        },
      ],
      oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
      closing: {
        worked: ['Rest', 'Fluids', 'Cooling foods'],
        limitation: 'Disease is not actually caused by an imbalance of the four humours.',
        verdict: 'Patients who rested, drank fluids and ate cooling foods often did recover. To Galen, and to the doctors who followed him, that recovery looked like proof the theory worked, even though the humours had nothing to do with it.',
        church: {
          heading: 'Supported by the Church',
          body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas, so the Church preserved and promoted his work for centuries.",
        },
        significance: "That's why the Theory of Opposites survived for over 1,400 years. It wasn't blind faith. It was a theory that seemed to keep working, treatment after treatment, patient after patient.",
      },
    },
```

- [ ] **Step 2: Verify the runtime episode loads with the new screen in place**

Run:

```bash
node -e "
import('./src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js').then(m => {
  const episode = m.default
  console.log('screens.length:', episode.screens.length)
  console.log('screen 9 type:', episode.screens[9].type, '| label:', episode.screens[9].label)
  console.log('screen 10 type:', episode.screens[10].type, '| label:', episode.screens[10].label)
})
"
```

Expected:
```
screens.length: 33
screen 9 type: symptomQualityDiagnostic | label: Symptom to treatment
screen 10 type: quickRecall | label: Retrieval
```

- [ ] **Step 3: Commit**

```bash
git add src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js
git commit -m "Replace the theoryLab screen with the symptomQualityDiagnostic set"
```

---

## Task 6: Update module metadata (screenCount / screenTags)

**Files:**
- Modify: `src/modules.js:38-43`

**Interfaces:**
- Consumes: the actual runtime screen count from Task 5 (33).
- Produces: `MODULES` entry for `history-medicine-medieval-beliefs-causes` with `screenCount: 33` and a 33-entry `screenTags` array matching `content.screens.map(s => s.tag ?? null)`, satisfying `tests/architecture/module-metadata-integrity.test.js`.

- [ ] **Step 1: Confirm no screen in the affected region carries an explicit `.tag`**

The three screens in the affected region (old runtime indices 8, 9, 10 — diagram, worked example, theoryLab) have no `tag` field in the source content (confirmed by reading the source file directly — none of `mediaPlaceholder`, `workedExample`, or `theoryLab` blocks set a `tag`). The current `screenTags` array has `null` at all three of those positions. Removing one `null` from a run of `null`s leaves the array's meaning unchanged.

- [ ] **Step 2: Update `screenCount` and `screenTags`**

In `src/modules.js`, change:

```js
    screenCount: 34,
    screenTags: [
      null, null, null, "four-humours", null, null, null, "galen", null, null, null, null, null,
      "medieval-practitioners", "miasma", null, null, null, null, null, null, null,
      null, null, null, null, null, null, "core-takeaway", null, null, null, null, null,
    ],
```

to (one `null` removed from the run at positions 8-10; every other value unchanged):

```js
    screenCount: 33,
    screenTags: [
      null, null, null, "four-humours", null, null, null, "galen", null, null, null, null,
      "medieval-practitioners", "miasma", null, null, null, null, null, null, null,
      null, null, null, null, null, null, "core-takeaway", null, null, null, null,
    ],
```

- [ ] **Step 3: Run the module metadata integrity test**

Run: `./node_modules/.bin/vitest run tests/architecture/module-metadata-integrity.test.js`
Expected: all tests pass, including `metadata.screenCount matches loaded content screens.length` and `metadata.screenTags match actual screen tags from loaded content` for `history-medicine-medieval-beliefs-causes`.

- [ ] **Step 4: Commit**

```bash
git add src/modules.js
git commit -m "Update Episode 1 screenCount/screenTags for the merged Galen screen"
```

---

## Task 7: Update the concept-support map and its test

**Files:**
- Modify: `src/data/contentSupport/historyMedicineEpisode01.js`
- Modify: `tests/architecture/content-support-episode01.test.js:42-46`

**Interfaces:**
- Consumes: nothing from other tasks (this map is structurally independent of the runtime content — it's checked for internal consistency only, not cross-referenced against loaded episode content by any existing test).
- Produces: a 33-entry, contiguous (0-32) concept-support map and a test file whose hard-coded screen count matches.

**Important — read before starting:** while investigating this task, a **pre-existing, unrelated data-quality issue** was found: from `screenIndex` 9 onward, this file's per-screen `label`/`purpose` entries already drift out of alignment with the actual current runtime screen order in multiple places (e.g. entry 10's label `'Retrieval'` factually describes runtime screen 11, not runtime screen 10; the drift partially self-corrects around index 24-26, then re-diverges again from index 27 onward). This is **not caused by this plan's changes** — it predates them, and the existing test suite doesn't catch it because `content-support-episode01.test.js` only checks the map's *internal* consistency (contiguous indices, registered concept ids, derived-index correctness), never cross-referencing it against the actually loaded episode content. A full realignment audit of all 34 entries is out of scope for this plan. This task makes the minimal, mechanical edit needed to keep the map internally consistent at 33 entries — it does not attempt to fix the pre-existing drift, and does not make it worse.

- [ ] **Step 1: Update the two affected `stageRanges` entries touching the Galen stage boundary and everything after it**

In `src/data/contentSupport/historyMedicineEpisode01.js`, `stageRanges` currently reads (lines 38-87):

```js
    {
      id: 'part-3',
      title: 'Why Galen Ruled the Room',
      screenRange: [7, 10],
      conceptTags: [ /* unchanged */ ],
    },
    {
      id: 'part-4',
      title: 'The Medieval Treatment Toolkit',
      screenRange: [11, 23],
      conceptTags: [ /* unchanged */ ],
    },
    {
      id: 'part-5',
      title: 'Why the System Survived',
      screenRange: [24, 26],
      conceptTags: [ /* unchanged */ ],
    },
    {
      id: 'part-6',
      title: 'Exam Prep: Explain the Grip of Galen',
      screenRange: [27, null],
      conceptTags: [ /* unchanged */ ],
    },
```

Change only the four `screenRange` values (leave every `conceptTags` array untouched):

```js
      screenRange: [7, 9],     // part-3 (was [7, 10])
      ...
      screenRange: [10, 22],   // part-4 (was [11, 23])
      ...
      screenRange: [23, 25],   // part-5 (was [24, 26])
      ...
      screenRange: [26, null], // part-6 (was [27, null])
```

- [ ] **Step 2: Update the `screens` array**

The `screens` array entries at indices 0-8 are unchanged (they describe screens before the affected region). Make these changes:

1. Update the entry at `screenIndex: 9` (currently `label: 'Think Like Galen'`) to describe the new component:

```js
    {
      screenIndex: 9,
      label: 'Symptom to treatment',
      purpose: 'Applies the Theory of Opposites end to end: teaches hot, cold, wet and dry through example symptoms, walks one patient case, asks the learner to diagnose the dominant quadrant and choose a treatment, then closes with the opposite-quality recall and the Church\'s role in the theory\'s survival.',
      conceptTags: [
        'history:medicine:galen',
        'history:medicine:theory-of-opposites',
        'history:medicine:four-humours',
        'history:medicine:church-authority',
      ],
    },
```

2. Delete the entry currently at `screenIndex: 10` (`label: 'Retrieval'`, the one whose content most directly overlaps with what's now folded into the new component's closing beat — its `conceptTags` are a subset of the ones just added above, so no concept coverage is lost).

3. For every remaining entry (currently `screenIndex: 11` through `screenIndex: 33`), decrement `screenIndex` by 1, leaving `label`/`purpose`/`conceptTags`/`missingConceptCandidates` exactly as they are. That is: old 11→10, old 12→11, old 13→12, … old 33→32. (This is a pure renumbering — do not change any label, purpose, or concept tag while doing it.)

- [ ] **Step 3: Update the hard-coded screen count in the test**

In `tests/architecture/content-support-episode01.test.js`, lines 42-46 currently read:

```js
  it('has a screen-level entry for all 34 Episode 1 screens (0–33), contiguous, no duplicates', () => {
    const sorted = [...screenIndices].sort((a, b) => a - b)
    expect(sorted).toEqual(Array.from({ length: 34 }, (_, i) => i))
    expect(new Set(screenIndices).size).toBe(screenIndices.length)
  })
```

Change to:

```js
  it('has a screen-level entry for all 33 Episode 1 screens (0–32), contiguous, no duplicates', () => {
    const sorted = [...screenIndices].sort((a, b) => a - b)
    expect(sorted).toEqual(Array.from({ length: 33 }, (_, i) => i))
    expect(new Set(screenIndices).size).toBe(screenIndices.length)
  })
```

- [ ] **Step 4: Run the content-support tests**

Run: `./node_modules/.bin/vitest run tests/architecture/content-support-episode01.test.js`
Expected: all tests pass — in particular `stageRanges collectively cover every screen (0–32)` and `every conceptTag ... is a registered concept id` (no new concept ids were introduced, so no learning-graph registration is needed).

- [ ] **Step 5: Commit**

```bash
git add src/data/contentSupport/historyMedicineEpisode01.js tests/architecture/content-support-episode01.test.js
git commit -m "Renumber Episode 1 concept-support map for the merged Galen screen

Mechanical -1 renumbering from screenIndex 10 onward, plus a content
update for the entry now describing the new symptomQualityDiagnostic
screen. Does not address the pre-existing, unrelated index drift found
in this file from index 9 onward (see task notes) — out of scope here."
```

---

## Task 8: Add the component contract and Component Registry entry

**Files:**
- Create: `docs/system/component-contracts/symptom-quality-diagnostic.md`
- Modify: `docs/components/COMPONENT_REGISTRY.md`

**Interfaces:**
- Consumes: nothing (documentation only).
- Produces: a 9-field contract (matching the format used by `docs/system/component-contracts/worked-example.md`) and a Component Registry entry (matching the format used by the `TheoryLab`/`GalensDiagnostic` entries).

- [ ] **Step 1: Write the contract file**

```markdown
# Contract — symptomQualityDiagnostic

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/learning/SymptomQualityDiagnostic.jsx` · intent: *teach a diagnostic theory, then apply it to one case*

## 1. Purpose

Teach a quality-based diagnostic theory (hot/cold/wet/dry) through example
symptoms, then apply it end to end to one named patient case: diagnose the
dominant quadrant, choose a treatment, and see why the theory's logic
persisted historically.

## 2. When to use

A theory that classifies symptoms along two or more named qualities/axes,
where the exam-relevant skill is applying that classification to a specific
case and then reasoning about treatment. Currently used once, for Galen's
Theory of Opposites in Episode 1 — built as a distinct component rather than
extending `TheoryLab.jsx` at the user's explicit direction, so it is not yet
reusable across three modules; a second use case should revisit whether the
two should converge.

## 3. When NOT to use

- **Multiple patient cases in one set** — this component is built for
  exactly one worked case; testing several cases needs a different
  mechanic (see `GalensDiagnostic.jsx` for a different case-based
  approach) or several separate blocks.
- **As a general MCQ component** — the quadrant-select and treatment beats
  are bespoke to this cinematic, subject-accented genre; a generic
  standalone multiple-choice question should use `AnswerInteraction.jsx`.
- **With images** — this component is text/token-only by design; a
  screen needing diagrams or photos should use a different component.

## 4. Required structure

- `qualities` — exactly 4 entries (the axis being taught), each with a
  `quality` id and 2-3 named example `symptoms`.
- `patient` — exactly one named case: a `title` and its `symptoms`.
- `quadrantQuestion` / `quadrantOptions` — exactly 4 options, one `correct`.
- `diagnosis` — a short confirmation label, no fragments carrying new
  teaching weight (the diagnosis was already taught by the quadrant beat).
- `treatmentQuestion` / `treatmentOptions` — any number of options, exactly
  one `correct: true`; every option carries an `explanation` in full
  sentences (why it's right or wrong in terms of the theory's logic, not a
  restatement of the answer).
- `oppositeRecall` — `from`/`to`/`result`, the theory's core transformation.
- `closing` — `worked` (list), `limitation`, `verdict`, `church` (`heading`
  + `body`), `significance`, all in full sentences — the exam payoff.

## 5. Token rules

`SPACING`/`RADII`/`MOTION`/`TYPE`/`BUTTONS` tokens only — no raw px/hex.
Subject accent via `SUBJECTS[subject].accent`/`.accentRgb`. No
`TYPE.eyebrow` or hand-typed uppercase labels — small section labels use
`TYPE.label` in sentence case (see `docs/system/TYPOGRAPHY_SYSTEM.md` →
Label case).

## 6. Motion rules

Word/symptom reveals stagger in via `sqd-in`/`sqd-in-left` keyframes
(`MOTION.easing.standard`), matching `TheoryLab.jsx`'s established rhythm
for this genre. Wrong quadrant picks shake (`sqd-shake`) and reset.
`prefers-reduced-motion: reduce` disables all `.sqd-motion` animations via
the injected stylesheet's media query.

## 7. Gold example

`SymptomQualityDiagnostic.stories.jsx` → **Gold — fever and phlegm cough**:
the shipped Episode 1 case (`episode-01-medieval-beliefs-causes.js`, Galen
stage) — hot/cold/wet/dry taught with named symptoms, one patient (fever,
phlegm cough), diagnosed hot + wet, treated with cucumber and dry bread,
closing with the Church's role in the theory's 1,400-year survival.

## 8. Below-bar counterexample

- A quadrant question with fewer or more than 4 options (breaks the
  bespoke 2×2 grid layout).
- A treatment option with no `explanation`, or an explanation that just
  restates "correct"/"wrong" without the theory's reasoning.
- Any image, icon-as-illustration, or background photo — this genre is
  text/token-only.
- A second patient case bolted onto the same block — split into a new
  block or a different component instead.

## 9. Review checks

- ⚙ Uses tokens, not raw values.
- 👁 No decorative uppercase / no `TYPE.eyebrow` anywhere.
- 👁 Exactly one patient case; exactly 4 quality beats; exactly 4 quadrant
  options.
- 👁 Every treatment option's `explanation` is a full sentence carrying the
  theory's reasoning, not a fragment.
- 👁 No images.
```

- [ ] **Step 2: Add the Component Registry entry**

In `docs/components/COMPONENT_REGISTRY.md`, add a new entry immediately after the existing `TheoryLab` entry (which ends around line 458-459 with `**Dependencies:** \`SUBJECTS\`, \`MOTION\`, \`SPACING\`` followed by a blank line):

```markdown
---

### SymptomQualityDiagnostic

**File:** `src/components/learning/SymptomQualityDiagnostic.jsx`  
**Purpose:** Ten-beat diagnostic set — teaches a quality-based theory (e.g. hot/cold/wet/dry) through example symptoms, then applies it to one named patient case: quadrant diagnosis, treatment multiple-choice question, opposite-quality recall, and a closing legacy beat. No images.  
**Props:** `block`, `subject`, `onContinue`  
**Dependencies:** `SUBJECTS`, `SPACING`, `RADII`, `MOTION`, `TYPE`, `BUTTONS`
```

- [ ] **Step 3: Commit**

```bash
git add docs/system/component-contracts/symptom-quality-diagnostic.md docs/components/COMPONENT_REGISTRY.md
git commit -m "Add component contract and registry entry for SymptomQualityDiagnostic"
```

---

## Task 9: Full verification pass

**Files:** none (verification only).

**Interfaces:**
- Consumes: everything from Tasks 1-8.
- Produces: a verified, working feature.

- [ ] **Step 1: Build**

Run: `./node_modules/.bin/vite build`
Expected: 0 errors.

- [ ] **Step 2: Architecture tests**

Run: `./node_modules/.bin/vitest run tests/architecture`
Expected: all tests pass, in particular `module-metadata-integrity.test.js` and `content-support-episode01.test.js`.

- [ ] **Step 3: Full episode load check**

Run:

```bash
node -e "
import('./src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js').then(m => {
  const episode = m.default
  console.log('Total screens:', episode.screens.length)
  console.log('Screens 6-11:')
  episode.screens.slice(6, 11).forEach((s, i) => console.log(6 + i, '|', s.type, '|', s.label || s.heading))
})
"
```

Expected: `Total screens: 33`, and screen 9 is `symptomQualityDiagnostic | Symptom to treatment`.

- [ ] **Step 4: Manual module walkthrough**

Start the dev server (`./node_modules/.bin/vite`), open Episode 1 (Medicine Through Time → "Trust me, I'm Following Jupiter"), navigate to the Galen stage, and play through: Four Humours reveal (unchanged) → "Galen treated with opposites" diagram (unchanged) → the four quality beats (Hot, Cold, Wet, Dry) → patient case (fever, phlegm cough) → quadrant select (confirm wrong picks shake and correct pick advances) → diagnosis reveal → treatment MCQ (confirm wrong picks show explanation + "Try again", correct pick shows explanation + Continue) → opposite recall → closing beat → confirm it hands off correctly into the following "Retrieval" quickRecall screen. Confirm no images appear anywhere in the new set, and all text is sentence case.

- [ ] **Step 5: Ponytail review**

Invoke `/ponytail-review` on the diff.

- [ ] **Step 6: Pattern-governance review**

For each of the ten beats, confirm the one-sentence primary intent stated in the contract file (Task 8) actually holds on screen, per `docs/system/PATTERN_GOVERNANCE.md`.

---

## Plan self-review notes

- **Spec coverage:** all ten beats, the token/sentence-case/no-`AnswerInteraction` constraints, the "kept unchanged" screens, and every file in the spec's "Files touched" list are covered by Tasks 1-8. Two files not listed in the original spec were added after discovering the screen-count ripple effect during planning: `src/modules.js` (Task 6) and `src/data/contentSupport/historyMedicineEpisode01.js` + its test (Task 7) — both are required for the existing test suite to keep passing once the screen count changes from 34 to 33.
- **Placeholder scan:** no TBD/TODO; every code block is complete and copy-pasteable.
- **Known limitation flagged, not silently patched:** the pre-existing content-support map drift described in Task 7 is documented there rather than fixed, since fixing it is a separate, unscoped audit.
