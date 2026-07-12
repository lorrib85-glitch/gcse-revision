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
| `quickRecall` | ✓ 3-part | ✗ | ✗ | ◑ cover state only | ✓ Ep3 s3/s6/s13 | ⚙ weakness-tracker logging · 👁 register review questions |
| `matchingTask` | ✓ 3-part | ✗ | ✗ | ✓ Ep1 s17 | ✓ Ep3 s9 | contract failure modes · 👁 register review questions |
| `naturalSupernaturalSwipe` | ✗ | ✗ | ✗ | ✓ Ep1 s23 | ✓ Ep3 s12 | ⚙ taxonomy (classify) · 👁 register review questions |
| `examinerExplains` | ✗ | ✗ | ✗ | ◑ opening reveal only | ✓ Ep3 s14 | ⚙ exam-technique follow-through · 👁 register review questions |
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
- **Verified composed gold: 6 of 8 fully verified** (`conceptReveal`,
  `visualLearning`, `keyFigureReveal`, `matchingTask`,
  `naturalSupernaturalSwipe`, `faceExaminer`). **2 partial**
  (`quickRecall` — cover/transition state captured, not the question state;
  `examinerExplains` — opening word-reveal captured, not the full teaching
  payload). Capturing the missing states is **render-verification debt**.

Each `✓` composed-gold entry below was seated from a 390px render taken in
the composed render path via the dev screen-jump. The two `◑` entries record
exactly which state was and was not seen.

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
  "Hippocrates — quick check" (the bar named in
  `component-contracts/quick-recall.md`). **◑ Render note:** the 390px pass
  in this session captured a `quickRecall` **cover/transition state** only
  (screen 6, "His name was Galen") — the assessed **question state**, which
  is what the contract's copy standards actually govern, was not captured.
  **The question-state 390px render is render-verification debt** (it sits
  behind a tap the screen-jump lands before). The gold is provisionally
  seated on the contract's source-level bar; it is not fully composed-render
  verified. Do not treat it as fully `✓` until the question state is seen.
- **Why it is the current gold example (source-level):** every question
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
  *(Requires the question-state render — currently debt.)*

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
  screen **30**. **◑ Render note:** the 390px pass captured the **opening
  word-reveal state only** ("Here's what examiners actually reward") — the
  full examiner-teaching payload reveals progressively and was not captured
  (the Episode 2 review log hit the same word-reveal timing artefact on its
  `examinerExplains` screen). **The full-content 390px render is
  render-verification debt.** Do not treat this as fully `✓` until the
  revealed teaching is seen.
- **Why it is the current gold example (opening-state only):** the examiner
  framing lands cleanly and sets up the exam-technique beat; full
  verification pending.
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
  followed by an assessed exam-technique screen? *(The full revealed-content
  render is debt.)*

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
