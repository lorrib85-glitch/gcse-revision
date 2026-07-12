# Gold screen register

**Authority:** the calibration layer under `docs/system/PATTERN_GOVERNANCE.md`
and the per-component contracts in `docs/system/component-contracts/`.
Governance says which component serves which intent and the 9-field contract
format; the contracts hold each component's execution rules; **this register
names the one composed runtime screen every review and rebuild is measured
against.** Where they conflict, `PATTERN_GOVERNANCE.md` wins.

A contract can describe the bar in prose. A register entry points at a real
screen a reviewer has looked at, at 390px, in the composed render path — so
"is this as good as the gold example?" is a question with a concrete answer,
not a matter of taste.

## Hard rules for this register

1. **A runtime screen may only be named as gold after reviewing the composed
   390px render** in the real render path (the dev screen-jump, per
   `PATTERN_GOVERNANCE.md` → the mandatory render pass). Never name a gold
   example from source inspection alone.
2. **Do not lower the bar.** If no current screen clears the bar, the entry
   reads **"No verified composed gold example yet"** and creating/verifying
   one is explicit debt (see the coverage table). Naming the least-bad
   current screen as gold is a governance failure — it re-anchors the whole
   pipeline to mediocrity.
3. **Story ≠ screen.** A Storybook story proves the component renders in
   isolation. It is never sufficient evidence of gold on its own — a
   component can pass its own story and still compose into a heavy,
   mis-spaced screen. The gold is the *composed* screen; the story is a
   secondary reference.
4. Each render used to seat a gold is reproducible from its module id +
   screen index via the dev screen-jump
   (`?module=<id>&screen=<n>`, `import.meta.env.DEV`), so the next reviewer
   can re-render and re-check it.

## How the register is used

- **`content-review`** measures each amended screen against its component's
  gold entry here, in the before/after/gold render comparison
  (`PATTERN_GOVERNANCE.md` → strengthened visual verdicts).
- **`content-create`** points at the named gold example as the sixth link of
  its build chain (learning objective → primary intent → learner need →
  approved component → execution contract → **named gold example** → content
  structure → render acceptance criteria).
- A **below-bar counterexample** is recorded next to each gold so a reviewer
  can calibrate both ends of the scale, not just the top.

---

## Coverage table — the eight highest-use learning components

Calibration starts with the highest-use learning components. `✓` = present
and verified; `◑` = partial (see notes); `✗` = absent (explicit debt).

| Component | Execution contract | Complete 9-field format | Verified Storybook story | Verified composed runtime gold | Below-bar counterexample | Explicit machine + visual checks |
|---|---|---|---|---|---|---|
| `conceptReveal` | ✗ | ✗ | ✗ | ✓ Ep1 s27 | ✓ Ep3 s2 | ⚙ taxonomy + quality floor · 👁 register review questions |
| `visualLearning` | ✗ | ✗ | ✗ | ✓ Ep1 s11 | ✓ Ep3 s1 | ⚙ taxonomy + repetition limit · 👁 register review questions |
| `keyFigureReveal` | ✓ 3-part | ✗ | ✗ | ✓ Ep1 s7 | ✓ Ep3 s7 | contract failure modes · 👁 register review questions |
| `quickRecall` | ✓ 3-part | ✗ | ✗ | ✓ Ep1 s5 (question + feedback states) | ✓ Ep3 s3/s6/s13 | ⚙ weakness-tracker logging · 👁 register review questions |
| `matchingTask` | ✓ 3-part | ✗ | ✗ | ✓ Ep1 s17 | ✓ Ep3 s9 | contract failure modes · 👁 register review questions |
| `naturalSupernaturalSwipe` | ✗ | ✗ | ✗ | ✓ Ep1 s23 | ✓ Ep3 s12 | ⚙ taxonomy (classify) · 👁 register review questions |
| `examinerExplains` | ✗ | ✗ | ✗ | ✓ Ep1 s30 (opening + full payload) | ✓ Ep3 s14 | ⚙ exam-technique follow-through · 👁 register review questions |
| `faceExaminer` | ✗ | ✗ | ✗ | ✓ Ep1 s31 | ✓ Ep3 s15 | ⚙ exam-technique · 👁 register review questions |

`Ep1` = `history-medicine-medieval-beliefs-causes`; `Ep3` =
`history-medicine-renaissance-medicine` (the legacy shared Renaissance
runtime; its per-screen findings are in
`docs/content/history/Medicine/03_Review_Log.md`).

### Debt summary (read with the coverage table)

- **Complete 9-field contracts: 0 of 8.** Three carry a legacy 3-part
  contract (`keyFigureReveal`, `quickRecall`, `matchingTask`) — **upgrade
  debt**. Five have no contract at all (`conceptReveal`, `visualLearning`,
  `naturalSupernaturalSwipe`, `examinerExplains`, `faceExaminer`) —
  **write-contract debt**, taken on when content work next hits a quality
  problem on that component (per `component-contracts/README.md`).
- **Verified Storybook stories: 0 of 8** — **story debt** for all eight.
  (Stories exist for the pattern primitives `TeachScreenShell`, `KeyPoint`,
  `WorkedExample`, `MediaPlaceholder` and for `SymptomQualityDiagnostic`,
  `EvacuationChainRoute`, `ConnectionMap`, `MedievalDiagnosisScene`,
  `QuoteAnalyser` — none of the eight priority learning components.)
- **Verified composed gold: 8 of 8 fully verified.** The two former `◑`
  entries were cleared by the 2026-07-12 gold audit: `quickRecall`'s
  question and wrong-answer feedback states, and `examinerExplains`' full
  progressively-revealed payload, were rendered at 390px in the composed
  render path (seeded module state + reduced motion render straight to the
  governed states) and both clear their contract bars.

Each `✓` composed-gold entry below was seated from a 390px render taken in
the composed render path via the dev screen-jump.

---

## `conceptReveal`

- **Learning intent:** land one chapter-level concept or synthesis as a
  cinematic reveal the learner reads and continues from (teach, passive).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **27** ("core-takeaway"). Verified at 390px.
- **Why it is the current gold example:** one takeaway, stated as a dominant
  display heading ("Between 1250 and 1500, medical knowledge barely moved")
  with a single supporting paragraph that explains *why* the ideas felt
  logical at the time — not a second concept, an explanation of the one.
  Exactly one primary intent; the body is genuinely secondary to the
  heading; deep negative space, no competing boxes.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **2** ("A world about to change"), per the Ep3 review log — a
  `conceptReveal` that "carries several drivers in one reveal sequence".
- **Why the counterexample fails:** it breaks the one-primary-intent rule —
  multiple causal drivers stacked into one reveal means the learner leaves
  with no single takeaway; it should be split.
- **Visual hierarchy to preserve:** display heading dominant, high in the
  content area; one supporting paragraph, visibly secondary; dark cinematic
  ground; nothing competes with the heading.
- **Common misuse patterns:** more than one concept per reveal; a decorative
  reveal with no takeaway sentence; using a passive reveal where the beat
  needs an assessed interaction.
- **390px review questions:** Is there exactly one takeaway? Does the heading
  clearly dominate the paragraph? Would a tired learner grasp the point in
  three seconds? Is anything on screen competing with the takeaway?

## `visualLearning`

- **Learning intent:** set a scene or establish stakes/continuity through a
  full-bleed image sequence with a single headline per beat (hook/teach,
  reveal).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **11** ("England, 1250"). Verified at 390px.
- **Why it is the current gold example:** a specific, atmospheric medieval
  village image carries the scene; one headline ("England, 1250") and one
  supporting line establish 1,000 years of continuity without a text wall;
  scene dots show the sequence; text stays legible over the image.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **1** ("Echoes of medieval medicine"), per the Ep3 review log —
  "one repeated medieval monk image for all scenes, so the visual does not
  specifically express Renaissance doubt" (also readability 7.3). Compounded
  by the Episode 2 misuse: `visualLearning` used three times, over the
  two-per-chapter repetition cap.
- **Why the counterexample fails:** a reused, non-specific image breaks the
  image→meaning bond the component exists for; over-use dilutes the
  cinematic impact that justifies a passive scene at all.
- **Visual hierarchy to preserve:** relevant full-bleed image dominant;
  headline anchored low; one supporting line; scene progress dots; a scrim
  keeping text legible.
- **Common misuse patterns:** reused/generic imagery not specific to the
  scene; more than two uses per chapter (repetition limit); text walls over
  the image; using it where retrieval is due.
- **390px review questions:** Does the image specifically depict *this*
  scene? Is there exactly one headline? Is the text legible over the image?
  Is this the second use or fewer in the chapter?

## `keyFigureReveal`

- **Learning intent:** introduce a key person as the answer to the unit's
  dramatic question — portrait hero, significance, one idea per section
  (introduce-figure, reveal).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **7** ("Galen"). Verified at 390px; this is the same screen its
  3-part contract (`component-contracts/key-figure-reveal.md`) already names.
- **Why it is the current gold example:** portrait hero (~60vh) with the name
  and role ("Galen · Roman doctor and writer") overlaid at the bottom; the
  first knowledge section carries exactly one idea with a stake
  ("Gladiators & dissection" — how he got hands-on anatomy); swipe-to-discover
  across four sections, the practical ceiling; a memorable story detail (the
  squealing pig, in later sections). Matches the contract bar precisely.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **7** ("William Harvey"), per the Ep3 review log — "good component
  execution, wrong episode boundary" (Harvey is Episode 4 canonical content).
- **Why the counterexample fails:** a well-built figure reveal on the wrong
  learning objective still fails — the objective-match check
  (`PATTERN_GOVERNANCE.md`) sits above execution quality. The register's
  other classic failure is CV-recitation (born/died/wrote lists with no
  stake).
- **Visual hierarchy to preserve:** portrait hero dominant; name + role
  legible over the portrait's lower third; significance statement; at most
  four one-idea sections behind the swipe; a single Continue.
- **Common misuse patterns:** more than four sections; CV-recitation;
  stakeless significance ("one of the most influential doctors"); the right
  component on the wrong episode's objective.
- **390px review questions:** Does the portrait dominate? Are name and role
  legible over it? Does the first section carry one idea *with a stake*? Are
  there four sections or fewer? Does this figure serve *this* episode's
  objective?

## `quickRecall`

- **Learning intent:** retrieve what the immediately preceding beats taught,
  logging every answer to the weakness tracker (retrieve, assessed).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **5** ("What did Hippocrates believe caused illness?" — the
  Hippocrates quick check named in `component-contracts/quick-recall.md`).
  Verified at 390px (2026-07-12 gold audit): **question state** — one
  dominant display-type question, four equally-weighted plausible options
  (three period-plausible supernatural distractors against the taught
  natural-causes fact, no joke option), generous negative space, nothing
  competing; **wrong-answer feedback state** — the wrong option marks red
  with a ✗ while the "Try again" hint re-teaches by pointing at the
  reasoning ("Think about what made Hippocrates different from many people
  of his time"), never giving the answer away.
- **Why it is the current gold example:** every question
  retrieves exactly what the preceding beats taught; distractors are
  plausible period misconceptions, never joke options; hints point at the
  reasoning, not the answer.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screens **3, 6 and 13**, per the Ep3 review log — readability 9.1 / 8.3 /
  8.7 over the ceiling, and screen 13 "over-tests Harvey and plague" from
  other episodes.
- **Why the counterexample fails:** it retrieves untaught or other-episode
  facts (guessing, not recall) and fails the readability floor — two of the
  contract's three named failure modes.
- **Visual hierarchy to preserve:** question dominant; options equally
  weighted and plausible; hint secondary; wrong-answer feedback re-teaches
  the *why*.
- **Common misuse patterns:** testing untaught facts; giveaway distractors;
  feedback that restates the answer instead of explaining it; any retrieval
  path that bypasses `unifiedWeaknessTracker.js`.
- **390px review questions:** Is the question legible and single? Are all
  options plausible (no joke option)? Does wrong-answer feedback re-teach?

## `matchingTask`

- **Learning intent:** retrieve by connecting taught terms to their meanings,
  where matching requires understanding not word-overlap (classify,
  assessed).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **17** ("Knowledge check"). Verified at 390px; the same screen its
  3-part contract (`component-contracts/matching-task.md`) names.
- **Why it is the current gold example:** two clean columns (term / meaning);
  every pair requires understanding to match — "Galen → His ideas dominated
  medicine for over 1,000 years and were taught in medieval universities"
  shares no word with the term; seven pairs auto-split into rounds of ≤6
  (round 1 of 2 visible); cards stay single-line and readable at 390px.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **9** ("Who did what?"), per the Ep3 review log — "several pairs are
  surface-obvious" and it tests Episode 4 material.
- **Why the counterexample fails:** word-overlap pairs let the learner match
  on text, not understanding; testing other-episode content breaks the
  retrieval scope. Both are named contract failure modes.
- **Visual hierarchy to preserve:** two columns, term left / meaning right;
  at most six cards per round; round progress dots; connector legibility;
  cards that do not wrap to multiple lines.
- **Common misuse patterns:** guessable word-overlap pairs; an *ordered*
  process (use `evacuationChainRoute`); overlong wrapping card text; more
  than six pairs written as if the split won't happen.
- **390px review questions:** Do the pairs require understanding, not
  word-matching? Are there six cards or fewer on screen? Do cards avoid
  multi-line wrap? Was every term taught earlier in the episode?

## `naturalSupernaturalSwipe`

- **Learning intent:** classify each item into one of two named categories
  by swiping, resolving a binary the episode has taught (classify,
  assessed).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **23**. Verified at 390px (intro/setup state).
- **Why it is the current gold example:** a single classification intent,
  framed as a clean binary — "One disease. Two explanations." with two
  labelled columns ("Supernatural: God, religion or magic" / "Rational:
  Observation, nature or logic") and one "Start sorting" CTA; the split
  cinematic ground reinforces the two-category choice.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **12** ("Change vs continuity"), per the Ep3 review log —
  "column labels are all-caps [design failure]", the "mixed Episode 3/4/5
  content blurs the objective", and readability sits just over the ceiling.
- **Why the counterexample fails:** mixed-scope items dilute the binary the
  learner is meant to master, and decorative uppercase beyond the two
  scanning labels breaks the design rules.
- **Visual hierarchy to preserve:** a binary split ground; two category
  labels each with a short definition; one CTA; in the sort state, one
  legible item card at a time.
- **Common misuse patterns:** more than two categories (it is a two-way
  swipe); mixed-scope items; items whose category is genuinely contested;
  decorative uppercase beyond the two column labels.
- **390px review questions:** Are exactly two categories offered, each with a
  clear definition? Is every item unambiguously one side? Is the CTA
  visible? *(A sort-state render is recommended alongside the setup state.)*

## `examinerExplains`

- **Learning intent:** teach, in the examiner's voice, what a question type
  actually rewards, immediately before an assessed exam-technique screen
  (exam-technique, passive).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **30**. Verified at 390px (2026-07-12 gold audit): the opening
  word-reveal ("Here's what examiners actually reward") **and the full
  tap-through payload** — "What the examiner rewards" with three
  progressively revealed points ("Use the exact terms", "Explain the logic,
  not just the fact", "Link cause to treatment").
- **Why it is the current gold example:** the payload is mark-scheme
  specific, not generic advice — it names the exact terms that earn marks
  (four humours, miasma, Theory of Opposites, bloodletting) and models the
  full causal chain (illness = imbalance → treatment restores balance →
  bloodletting follows logically). Hierarchy stays clean across every
  reveal stage: one amber section heading, bold point titles, body copy
  visibly subordinate, one container with no box-in-a-box. It hands off
  directly to the assessed `faceExaminer` at screen 31 (the ⚙
  follow-through floor). One noted softness, not bar-affecting: the
  "Tap to continue" affordance is very low-contrast at 390px.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **14** ("Examiner tactics"), per the Ep3 review log — readability
  7.5 over the ceiling, the stage title fails sentence case, and the
  objective is only partial for the episode.
- **Why the counterexample fails:** readability creep in mark-scheme prose,
  plus the risk of examiner teaching that is not followed by an assessed
  exam-technique component (the ⚙ floor requires the follow-through).
- **Visual hierarchy to preserve:** examiner framing headline; progressive
  reveal of what is rewarded; a clear hand-off to an assessed exam-technique
  screen.
- **Common misuse patterns:** examiner teaching with no assessed
  exam-technique component after it (⚙ floor violation); readability creep in
  mark-scheme prose; a word-reveal slow enough to frustrate.
- **390px review questions:** Does the examiner framing land quickly? Is it
  followed by an assessed exam-technique screen? Is every revealed point
  mark-scheme specific rather than generic advice?

## `faceExaminer`

- **Learning intent:** present one exam question with its marks and prompt an
  attempt, then reveal a mark-scheme-annotated model answer (exam-technique,
  assessed).
- **Strongest Storybook story:** none — story debt.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **31**. Verified at 390px.
- **Why it is the current gold example:** the exam question dominates
  ("Explain two ways in which religion influenced medical treatment in
  medieval England"); the marks are weighted as an accent ("8 marks"); a
  "Read the question first" label sets the technique; one visible CTA
  ("Show the model answer →") drives the reveal. Clean single-job composition
  at 390px.
- **Below-bar counterexample:** `history-medicine-renaissance-medicine`
  screen **15** ("Face the Examiner"), per the Ep3 review log — the prompt
  "reinforces the bundled Episode 3/4 boundary", assessing Harvey, an
  out-of-scope figure.
- **Why the counterexample fails:** an exam question on out-of-scope content
  trains the wrong retrieval; the generic version of this failure is a
  question with no mark-scheme reveal or no criteria to self-assess against.
- **Visual hierarchy to preserve:** exam question dominant; marks as an
  accent; "read the question first" instruction; model-answer CTA visible
  without scrolling.
- **Common misuse patterns:** out-of-scope question; missing mark scheme;
  question type not matched to the exam board; CTA below the fold.
- **390px review questions:** Is the question dominant and legible? Are the
  marks shown? Is the model-answer CTA visible without scrolling? Is the
  question in scope and in the board's question-type shape?

---

## Second wave — 2026-07-12 gold audit (contact-sheet sweep)

A structural sweep of all 31 built modules (~370 screens) ranked every
screen type by usage. Five further patterns were seated from composed 390px
renders (contact-sheet tool + tap-through states); one was **refused** with
named findings; the rest are explicit debt, ranked below.

| Pattern | Uses | Composed runtime gold | Notes |
|---|---|---|---|
| composed teach screen (`TeachScreenShell`) | 1 of 273 `content` screens | ✓ Ep1 s8 | see adoption debt below |
| `priorKnowledgeRecall` | 6 | ✓ Ep2 s0 | |
| `interactiveImage` | 7 | ✓ Ep1 s4 | intro + explore + hotspot sheet verified |
| `factorWeb` | 2 | ✓ `history-medicine-vesalius-beginning-doubt` s7 | initial + explored-detail verified |
| `visualNarrative` | 6 | ✓ Ep1 s0 | beats 1–2 verified; later beats unseen |
| `guidedExamResponse` | 4 | ✓ Ep1 s32 | refused 2026-07-12 AM, fixed + seated same day — see entry |

### Composed teach screen — `TeachScreenShell` route

- **Learning intent:** teach one concept through the governed Route A
  composition — shell-owned heading, rhythm and slot order.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **8** ("Galen treated with opposites"). Verified at 390px.
- **Why it is the current gold example:** one dominant `TYPE.displayScreen`
  heading; one supporting paragraph that carries the full causal chain
  (dominant humour → illness → opposite qualities restore balance) and stays
  visibly subordinate; one evidence image (the four-humours quadrant with a
  staged "Building the theory…" reveal) directly under the teaching it
  supports; one full-width Continue. No box-in-a-box, one container level,
  generous breathing room.
- **Below-bar counterexample:** none render-reviewed yet for this route —
  the class failure it guards against is the generic-shell teach screen
  (ad-hoc `ScreenTitle` + hand-spaced blocks), which is what the other 272
  `content` screens use. Recording a specific reviewed counterexample is
  open debt.
- **390px review questions:** Is the heading the shell's token, unmodified?
  Is exactly one concept taught? Does the image sit inside the teaching
  flow rather than decorating it? Is the paragraph under ~5 lines?

### `priorKnowledgeRecall`

- **Learning intent:** open a chapter by free-recalling the previous
  chapter's content, scored and logged to the weakness tracker
  (retrieve, assessed).
- **Strongest composed runtime use:** `history-medicine-black-death`
  screen **0** ("What can you remember?"). Verified at 390px.
- **Why it is the current gold example:** one dominant question heading; one
  framing line naming the exact recall scope ("the previous chapter:
  medieval medicine"); a light "Write about" scaffold (people · theories ·
  causes · treatments) that prompts categories without giving content; one
  large input surface; a visible timer as a quiet secondary element; one
  primary CTA ("Check my recall"). Nothing competes with the recall act.
- **Below-bar counterexample:** none render-reviewed yet — record one when
  another episode's opener is next reviewed.
- **390px review questions:** Is the recall scope named precisely? Do the
  hints prompt categories, not answers? Is the input surface dominant below
  the heading? Is the CTA visible without scrolling?

### `interactiveImage`

- **Learning intent:** explore a labelled visual through tappable hotspots,
  two-phase intro → explore (teach, exploratory).
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **4** ("Tap the Four Humours"). Verified at 390px across all three
  states: intro (headline + framing copy + "Explore the body" CTA over the
  full-bleed anatomical chart), explore (four visible hotspot rings on the
  four humour symbols), and hotspot sheet ("Blood" — a parchment sheet with
  three labelled sections: Meaning / Believed effect / Treatment logic).
- **Why it is the current gold example:** the image is specific to the
  content (each humour symbol is where its hotspot sits, so tapping *is*
  the learning act); the sheet teaches in three short labelled strokes and
  ends on treatment logic — the exam-relevant chain; hierarchy stays clean
  in every state.
- **Below-bar counterexample:** none render-reviewed yet.
- **390px review questions:** Are all hotspots visibly discoverable? Does
  each sheet teach (meaning → effect → logic), not just label? Is the image
  content-specific rather than decorative?

### `factorWeb`

- **Learning intent:** explore several factors around one causal question,
  then make a supported judgement about relative importance
  (teach-comparison, apply). Contract:
  `component-contracts/factor-web.md`.
- **Strongest composed runtime use:**
  `history-medicine-vesalius-beginning-doubt` screen **7** ("Why could
  Vesalius challenge Galen?"). Verified at 390px: initial web (question
  dominant, one framing line, six readable factor nodes, short centre
  label, `SequenceProgress` dots, "Tap a factor to explore it" affordance)
  and explored state (tapped node marked with a restrained amber ✓, detail
  panel below with What-it-means teaching at body size).
- **Why it is the current gold example:** matches its contract's render
  checks on the pixels — no emoji, no uppercase labels, no clipping, no
  node collisions, the full question never inside the centre node, detail
  teaching readable without tiny text.
- **Below-bar counterexample:** the pre-rework implementation documented in
  the contract's field 8 (question crammed into an 86px circle, 8px labels,
  emoji identity, uppercase labels, x/y counter).
- **390px review questions:** run the contract's field 9 render checks.

### `visualNarrative`

- **Learning intent:** open or pivot a chapter through beat-based narrative
  (portraits, timelines, facts, conclusion beats), one idea per beat.
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **0**. Verified at 390px for beats 1–2: beat 1 — full-bleed dual
  portrait with one dominant headline ("Two dead Greeks ran medieval
  medicine.") and one supporting line; beat 2 — a timeline visualisation
  (Hippocrates → Galen → medieval England, 400 BC → 1300 AD) whose
  uppercase node labels are genuine diagram labelling (approved exception).
  Later beats not yet captured — remaining-state debt, noted, not
  bar-blocking for the seen beats.
- **Why it is the current gold example:** each beat lands exactly one idea
  with a strong visual carrier; the 1,000-year continuity claim is *shown*
  (timeline) rather than asserted.
- **Below-bar counterexample:** none render-reviewed yet.
- **390px review questions:** One idea per beat? Is text legible over
  imagery? Are uppercase labels genuinely diagram notation? Does the beat
  sequence build to the chapter's dramatic question?

### `guidedExamResponse`

- **Learning intent:** the learner writes their own answer to the
  chapter's exam question, scaffolded section by section, then receives a
  marked verdict (exam-technique, assessed).
- **Strongest composed runtime use:** `history-medicine-medieval-beliefs-causes`
  screen **32**. Verified at 390px across entry beat, question state and
  writing state, in all four host modules (Ep1 s32, Ep2 s23, Vesalius s11,
  `bio_building_blocks` s11 — subject theming intact in each). The
  marking/result states need a live marking response and are **not yet
  composed-render verified** — remaining capture debt, noted.
- **History:** first audit (2026-07-12 AM) **refused** this gold on two
  findings: the component's own header band rendered through the module
  progress capsule at 390px (two headers — the component must be
  self-chromed for its `GuidedAnswerCoach` host, but in-module the
  `LearningHeader` already owns the top strip), and the entry label was
  sentence-length decorative uppercase. Fixed same day: ModulePlayer now
  passes `embedded`, which suppresses the band and clears the capsule
  (`ExaminerExplainsScreen`'s clearance idiom); the entry label and the
  writing-scaffold lane labels render in their authored sentence case.
- **Why it is the current gold example:** the exam question is the one
  dominant element (serif display, marks inline); the sentence-case accent
  line sets the stakes without competing; the writing scaffold gives each
  answer section one lane with a sentence-case label and a sentence
  starter; one CTA per state, visible without scrolling.
- **Below-bar counterexample:** the pre-fix composed render (screenshotted
  in the 2026-07-12 audit): two colliding headers and uppercase labels —
  kept as the named example of why in-module screen-owning components must
  not draw their own top chrome.
- **390px review questions:** Is exactly one header present (the module
  capsule)? Is the question dominant? Are all labels sentence case outside
  the approved chips (source labels, marks badge)? Is the CTA visible
  without scrolling in every state?

---

## Gold-coverage debt — ranked (2026-07-12)

Ranked by expected appearance rate in future chapters; each entry is
"No verified composed gold example yet" until seated per the procedure
below.

1. **`guidedChoiceCarousel`** (3 uses), **`cinematic`** (2),
   **`progressionTimeline`** (2), **`collectionExplorer`** (2) — recurring
   patterns with no reviewed composed render.
2. **Single-use specialists** — `symptomQualityDiagnostic`,
   `medicalTheoryPrescription`, `connectionMap`, `timelineCanvas`,
   `beforeAfterSlider`, `evacuationChainRoute`, `quoteAnalyser`. Seat
   opportunistically when their episodes are next reviewed; do not block
   production on them.
3. **Remaining-state captures** — `visualNarrative` beats 3+,
   `naturalSupernaturalSwipe` sort state, `guidedExamResponse`
   marking/result states (noted in their entries).

*(2026-07-12 PM: `guidedExamResponse`, formerly rank 1, was fixed and
seated — see its entry above.)*

**The structural headline sits outside the register's normal scope but is
the audit's biggest finding: 272 of 273 `content` screens do not use the
`TeachScreenShell` route.** The governed teach composition has exactly one
live instance (the Ep1 s8 gold above). Every future chapter build and
review should treat generic-shell teach screens as the class failure the
route exists to prevent; migrating legacy teach screens follows the
legacy-screens rule in `PATTERN_GOVERNANCE.md` (migrate when touched, no
mass migration).

---

## Adding or moving a gold example

1. Render the candidate screen at 390px in the composed render path (dev
   screen-jump). Looking at source is not enough.
2. Compare it against the current gold and its below-bar counterexample and
   answer the strengthened visual verdict questions in
   `PATTERN_GOVERNANCE.md` in writing — what is objectively better, what is
   worse.
3. Only if it clearly meets or exceeds the bar, update the entry (and note
   the old gold as a prior reference if useful). If nothing clears the bar,
   leave "No verified composed gold example yet" and log the debt — never
   promote the least-bad screen.
4. When a component's 9-field contract is written or upgraded, its `## 7.
   Gold example` field and this register must name the same screen.
