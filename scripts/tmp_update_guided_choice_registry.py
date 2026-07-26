from pathlib import Path

path = Path('docs/components/COMPONENT_REGISTRY.md')
text = path.read_text()

old_guided = '''### GuidedChoiceCarousel

**File:** `src/components/learning/GuidedChoiceCarousel.jsx`
**Purpose:** Horizontally scrollable single-choice carousel with atmospheric visual option cards. Used for healer/role selection scenes. The chosen option is passed to `onContinue` so downstream screens can personalise content.
**Props:** `subject`, `headline`, `question`, `helperText`, `promptVisual`, `options`, `onBack`, `onContinue(nextScreenId, selectedOption)`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`
'''

new_guided = '''### GuidedChoiceCarousel

**File:** `src/components/learning/GuidedChoiceCarousel.jsx`
**What it is:** An unscored, full-screen choice experience where the learner browses a small set of visually distinct roles, perspectives or approaches, opens each card for more detail and then chooses one. The selected option is passed forward so later content can noticeably adapt its perspective, example, wording or route.
**Best used for:** Creating meaningful ownership before a scenario or personalised sequence when several defensible choices can lead to genuinely different subsequent content.
**Props:** `subject`, `headline`, `question`, `helperText`, `options`, `onBack`, `onContinue`
**Option shape:** `{ title, image?, frontItems?, backItems?, revealLines? }`
**Interaction class:** `reveal` — the choice is exploratory and unscored; no option is treated as right or wrong.
**Dependencies:** `InteractionShell`, `SequenceProgress`, `ContinueCTA`, `CinematicContinueCTA`, `SUBJECTS`, `GENERAL`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `usePrefersReducedMotion`

- **Decision**
  - **Use when:** the learner should adopt one of several plausible roles, perspectives, cases or routes and that choice will create a meaningful change in what follows. Choose it when browsing the alternatives first helps the learner understand their differences and the selected option gives the next teaching or scenario a clearer personal point of view.
  - **Do not use when:** one option is objectively correct, every option leads to effectively identical content, the choice changes only a name in the heading or the learner needs to compare all options simultaneously. Do not use it merely to make a passive screen feel interactive, and do not hide long paragraphs on the backs of cards.
  - **Choose instead:** use `CinematicCarousel` when the learner should explore every item without selecting one. Use `TheoryCompare` when two options need direct parallel comparison. Use `InteractiveHotspotImage` when the information belongs to locations within one shared image. Use `QuickRecallScreen` when there is a correct answer. Use a normal teaching screen when the downstream content will not genuinely change.
  - **Content shape:** usually three to five clearly distinct and defensible options. Each needs a concise title, one purposeful image and a small set of comparable facts or reveal details. Every option should offer a credible reason for selection; avoid one obviously superior “correct” card surrounded by weak or joke alternatives. The subsequent screen must make the consequence of the choice visible.
  - **Rhythm role:** opening, exploration.

**Governance rule:** do not offer fake agency. A selection must alter the subsequent perspective, example, wording or route in a way the learner can notice. If every option produces the same experience, use a reveal or comparison component instead.
'''

old_scene = '''### MedievalDiagnosisScene

**File:** `src/components/learning/MedievalDiagnosisScene.jsx`
**Purpose:** Cinematic 9:16 SVG hero scene — "Medieval diagnosis chamber". Thomas sits at a candlelit table while the four medieval explanations of illness (God & sin, four humours, miasma, astrology) fade in around him one at a time, each with its treatment symbol, then settle into tappable zones and a calm idle loop (candle flicker, rotating star chart, drifting miasma). Sits above the belief selection in `CentreImageReveal`; zones drive the same selection as the cards. Reduced motion renders the static end state.
**Props:** `theories`, `completedIds`, `onSelectZone`, `playIntro`, `prefersReducedMotion`, `style`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `TYPE`
**Do not use when:** The screen is not the medieval Medicine cause → treatment context — the scene content is Chapter 1 specific.
'''

new_scene = '''> **`MedievalDiagnosisScene` is internal implementation only.**
> `src/components/learning/MedievalDiagnosisScene.jsx` is a Medicine-specific SVG child used inside the existing medieval diagnosis flow. It introduces Thomas and the four explanation zones, then mirrors the parent component's belief-selection state. It is not a standalone learning beat, content type or authoring choice.
>
> - Implementation may use it only as the scene owned by its current parent flow.
> - Do not register it independently, place it directly in module content or adapt it into a generic scene framework.
> - Content authors must choose the parent learning component that performs the required teaching job; they must never select `MedievalDiagnosisScene` directly.
'''

if old_guided not in text:
    raise SystemExit('GuidedChoiceCarousel block not found')
if old_scene not in text:
    raise SystemExit('MedievalDiagnosisScene block not found')

text = text.replace(old_guided, new_guided, 1)
text = text.replace(old_scene, new_scene, 1)
path.write_text(text)
