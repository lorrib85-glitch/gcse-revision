# Episode 3: The Beginning of Doubt — Review log

## 2026-07-11 — full episode content-review

- **Session scope:** Full episode / runtime module `history-medicine-renaissance-medicine`.
- **Canonical files available:** Yes — content and architecture files exist, but the runtime module is explicitly bundled with Episodes 4 and 5, so Episode 3 canonical coverage is only partially assessable against the shared runtime module.
- **Amend status:** Audit and log only. No content amendments made; fixes require user confirmation.
- **Render-pass status:** Attempted but blocked by the environment: `node scripts/screenshot.mjs "/?module=history-medicine-renaissance-medicine&screen=0" /tmp/ep3-review/screen-0.png` failed because the Playwright Chromium executable was missing, and `npx playwright install chromium` failed with HTTP 403 from the Playwright CDN. All 👁 checks below are therefore source/contracts review only and must be re-run visually before accepting amendments.

### Per-screen primary intent, objective match and contract results

| Screen | Runtime type / label | One primary intent | Objective match | Contract / governance result |
|---|---|---|---|---|
| 0 | `priorKnowledgeRecall` / Medieval medicine recall | Reactivate medieval causes, treatments, Galen and Church authority so Renaissance change has a baseline. | Yes — Section 1 requires prior recall for non-opening chapters. | Adequate. Strong source pack, but very broad recall set risks cognitive load before the episode's Vesalius focus. |
| 1 | `visualLearning` / Echoes of medieval medicine | Establish continuity: medieval ideas survived into the Renaissance. | Yes — supports the change-versus-continuity objective. | Below bar. Uses one repeated medieval monk image for all scenes, so the visual does not specifically express Renaissance doubt; readability grade 7.3 exceeds the live threshold. |
| 2 | `conceptReveal` / A world about to change | Teach the Renaissance conditions that made challenge to authority possible. | Yes — maps to the Renaissance mindset shift. | Adequate. Clear cause → mechanism → consequence, but it carries several drivers in one reveal sequence and needs visual confirmation for pacing. |
| 3 | `quickRecall` / Before we go further | Retrieve Four Humours, Galen and Church authority before Vesalius. | Yes — retrieves prior knowledge needed for the next section. | Below bar. Quick-recall contract alignment is mostly sound, but readability grade 9.1 fails the live content-quality check. |
| 4 | `keyFigureReveal` / Vesalius | Introduce Vesalius as the figure who made observation challenge Galen. | Yes — exactly matches the Vesalius/anatomy objective. | Strong. Four sections, significance-led, one idea per section, and the takeaway is clear. |
| 5 | block screen / What Vesalius actually found | Explain why Vesalius's anatomical corrections changed method more than treatment. | Yes — the strongest Episode 3 teaching screen. | Adequate. The intent is coherent, but the screen uses generic block composition rather than a governed teach shell; render pass is required to check hierarchy and avoid stacked reveal heaviness. |
| 6 | `quickRecall` / Vesalius check | Retrieve Vesalius's book, method and treatment limitation. | Yes — directly retrieves screens 4–5. | Below bar. Questions align, but readability grade 8.3 fails the live check. |
| 7 | `keyFigureReveal` / William Harvey | Introduce Harvey's circulation discovery and why treatment still did not change. | No for Episode 3-only scope — Harvey is Episode 4 canonical content bundled into this runtime module. | Below bar for Episode 3 review. Good component execution, wrong episode boundary. |
| 8 | `conceptReveal` / Ambroise Paré | Teach Paré's evidence-led improvements in surgery. | Partial — Paré appears in Episode 3 content reference pack, but the Episode 3 architecture centres the section on printing/communication rather than Paré. | Adequate within the shared module, but scope-blurring for Episode 3. |
| 9 | `matchingTask` / Who did what? | Check that learners can connect Renaissance figures/factors to contributions. | Partial — it assesses Vesalius plus Harvey, Paré, printing press and knowledge/treatment judgement. | Adequate. Five unordered pairs suit matching, but several pairs are surface-obvious and it tests Episode 4 material inside the Episode 3 review. |
| 10 | `conceptReveal` / The Royal Society | Teach institutional validation: evidence, publication and repeatability. | Partial — Royal Society is in Episode 3 content pack, but the architecture places this section under printing communication. | Adequate. Strong thematic link to evidence, but the Royal Society material is compressed and not retrieved until screen 13. |
| 11 | `visualNarrative` / The Great Plague, 1665 | Use plague as the high-stakes proof that new knowledge had not become cures. | No for Episode 3-only scope — Great Plague is Episode 5 canonical content bundled into this runtime module. | Below bar for Episode 3 review. Dramatic and memorable, but wrong episode boundary. |
| 12 | `naturalSupernaturalSwipe` / Change vs continuity | Classify Renaissance change and continuity. | Yes as a summary skill, though it includes Harvey and plague items from other episodes. | Below bar. Useful interaction, but column labels are all-caps and the live checker reports readability just above threshold; mixed-episode content weakens objective focus. |
| 13 | `quickRecall` / Chapter retrieval | Retrieve Harvey, plague and Royal Society continuity lessons. | Partial/No for Episode 3-only scope — two of three questions centre Episode 4/5 material. | Below bar. QuickRecall tracking should work through the component, but readability grade 8.7 fails and retrieval is poorly scoped to Episode 3. |
| 14 | `examinerExplains` / Examiner tactics | Teach examiner traps about knowledge versus treatment and slow change. | Yes for the broad Renaissance shared module; partial for Episode 3 alone. | Below bar. Exam focus is valuable, but readability grade 7.5 fails and the stage title also fails sentence-case checks. |
| 15 | `faceExaminer` / Face the Examiner | Practise an Edexcel 8-mark explanation on Vesalius and Harvey. | Partial — useful Edexcel practice, but Harvey belongs to Episode 4 if Episode 3 is split cleanly. | Adequate. Marking feedback is specific; however, the assessment prompt reinforces the bundled Episode 3/4 boundary. |

### Six-dimension rubric

#### Story — below bar

- screen 7 — Harvey begins a new episode arc inside the section called `Printing Changes the Argument` — fixing it means either splitting the runtime module or renaming/rescoping this stage so the story explicitly becomes a shared Renaissance survey.
- screen 11 — Great Plague is a powerful story beat but belongs to Episode 5, not Episode 3 — fixing it means moving it to its own module or marking this module as a shared Episodes 3–5 unit rather than reviewing it as Episode 3.
- screens 7–13 — the Vesalius doubt arc becomes crowded by Harvey, Paré, Royal Society and plague — fixing it means making Episode 3 end on Vesalius/printing/knowledge-not-treatment, with Harvey and plague handled elsewhere.

#### Teaching — adequate

- screen 5 — strongest teaching sequence: Galen's animal dissections → Vesalius's human evidence → authority challenged → treatment still unchanged.
- screen 2 — good mechanism for Renaissance change, but compresses authority, printing and treatment limits into one sequence — fixing it means making the printing mechanism more visible and specific.
- screen 10 — Royal Society is well framed as evidence over authority, but its formation, publication network and royal charter are not developed enough for full Episode 3 canonical coverage.

#### Retrieval — below bar

- screen 13 — chapter retrieval over-tests Harvey and plague for an Episode 3 review — fixing it means retrieving Vesalius, printing press, declining Church authority, anatomy theatres, and knowledge-versus-treatment judgement.
- screen 9 — matching task retrieves figures, but several answers are direct contribution statements that are easy to pair by recognition rather than reasoning — fixing it means using less word-overlap and more consequence-based prompts.
- screens 3 and 6 — aligned recall, but both fail readability thresholds and should be rewritten before acceptance.

#### Interactions — adequate

- screen 4 — `keyFigureReveal` is a good fit for introducing Vesalius and respects the practical four-section ceiling.
- screen 9 — `matchingTask` is the right interaction class for unordered figure/contribution classification, but it is less diagnostic than it could be.
- screen 12 — classification is the right interaction shape for change versus continuity, but all-caps column labels violate current sentence-case/design governance and the mixed Episode 3/4/5 content blurs the objective.

#### Exam preparation — adequate

- screen 14 — clear examiner trap: distinguish knowledge from treatment, and explain slow change.
- screen 15 — the annotated answer rewards significance, not just named facts, which fits Edexcel explanation demands.
- screens 14–15 — the exam practice is currently for a shared Renaissance module, not a clean Episode 3 Vesalius module; fixing it means using an Episode 3-specific prompt such as why Vesalius could challenge Galen or how far Vesalius changed medicine.

#### Emotional engagement — adequate

- screen 1 — continuity hook has a useful "medieval medicine did not disappear" tension, but repeated imagery weakens novelty.
- screen 5 — the "Galen was wrong because he dissected animals" reveal gives a memorable exam-room contrast.
- screen 11 — plague has strong stakes, but it steals narrative energy from Episode 3's beginning-of-doubt story and belongs in Episode 5.

### Technical passes

#### Hardcoded values — below bar

- The episode data still contains raw colour values (`color`, `colorLight`, hook reveal item colours/backgrounds, and `naturalSupernaturalSwipe` column colours). Some may be legacy component API requirements, but they should be checked against token governance before amendment.

#### Image quality — below bar

- Existing image paths are mostly real `.webp`/header assets, and `/images/vesalius-1543.png` was confirmed present under `public/images/`; however, visual quality and composition still need the blocked render pass.
- Several screens reuse generic bridge/header images rather than visuals specific to Renaissance anatomy, printing, Vesalius or the Royal Society.
- No `MediaPlaceholder` entries are present, so no visual-assets manifest reconciliation was needed for placeholders.

#### UX design — below bar pending render

- Mandatory screenshots could not be captured in this environment, so all 👁 checks remain unverified.
- Source review flags likely composition risks: screen 5 is a generic block screen for a teaching intent, screen 12 uses all-caps column labels, and several passive/reveal-heavy screens need 390px hierarchy checks.

#### Canonical coverage — below bar

- Covered well: Vesalius's human dissection, Galen errors, evidence over authority, limited treatment impact, Harvey as continuation, Paré as surgery example, Royal Society, plague continuity.
- Under-covered for Episode 3: anatomy theatres, humanism, Reformation/Henry VIII and declining Church authority, secular thinking, fugitive sheets, Royal Society publishing in English / royal charter, Thomas Sydenham, Leeuwenhoek/Fracastoro, hospitals/treatments/prevention details that the content pack lists.
- Over-scoped for Episode 3 runtime review: Harvey/circulation and the 1665 Great Plague dominate substantial screen time despite having separate Episode 4 and 5 canonical files.
- Decision: the current runtime module should be treated as a shared Episodes 3–5 Renaissance module until it is split; as a clean Episode 3 module it is below bar for boundary discipline.

#### Readability + sentence case — below bar

`node scripts/check-content-quality.mjs history-medicine-renaissance-medicine` reported:

- screen 1 readability grade 7.3 > 7
- screen 3 readability grade 9.1 > 7
- screen 6 readability grade 8.3 > 7
- screen 12 readability grade 7.0 > 7
- screen 13 readability grade 8.7 > 7
- screen 14 readability grade 7.5 > 7
- sentence-case issues in stage titles: `Old Certainties Start to Crack`, `The Renaissance Mindset Shift`, `Doubt Without Revolution`, and `Exam Prep: Why Did Ideas Begin to Change?`

### Accepted as-is

- Vesalius introduction on screen 4.
- Core Vesalius mechanism on screen 5, pending visual composition review.
- Examiner emphasis on knowledge-versus-treatment as the central judgement.

### Deferred / requires user confirmation before amendment

1. Decide whether to review/fix the current runtime module as a shared Episodes 3–5 Renaissance module or split Episode 3 cleanly from Harvey and Great Plague.
2. Rewrite readability failures on screens 1, 3, 6, 12, 13 and 14.
3. Fix sentence-case stage titles.
4. Re-scope retrieval and exam practice to Episode 3 if the clean split is chosen.
5. Re-run mandatory 390px screenshots once Playwright Chromium is available.

### After-amend re-score

Not applicable — no amendments made in this pass.

## 2026-07-11 — clean runtime split implemented

- **Session scope:** Implemented the accepted clean runtime separation as new Episode 3, Episode 4 and Episode 5 module runtimes while keeping the legacy bundled runtime available but hidden.
- **Progress audit outcome:** In-repository audit found module progress is keyed by module ID in `src/progress.js`, with an old `mod2` migration pointing to the legacy bundled ID, but no evidence in the repository of meaningful existing production learner data requiring screen-index migration. Screen-index migration was therefore not implemented.
- **Runtime outcome:**
  - Episode 3 now exists as `history-medicine-vesalius-beginning-doubt`, focused on Vesalius, changing authority, anatomy theatres, printing and the knowledge-before-cures judgement.
  - Episode 4 now exists as `history-medicine-harvey-pare-renaissance-method`, with Harvey dominant and Paré explicit as supporting Renaissance method/surgery evidence.
  - Episode 5 now exists as `history-medicine-great-plague-1665`, focused on the 1665 Great Plague, continuity of explanations and more organised public-health response.
- **Legacy outcome:** `history-medicine-renaissance-medicine` remains loadable as a hidden legacy bundle for compatibility while learner-facing navigation uses the clean module IDs.
- **Preserved material:** The Vesalius key-figure introduction and the anatomy discovery sequence were preserved in the new Episode 3 runtime, with only focus/readability adjustments.
- **Post-Episode-5 synthesis checkpoint:** Implemented as a review requirement rather than a new learner-facing module: the three clean runtimes collectively preserve Vesalius, Harvey, Paré, printing, Royal Society/light synthesis hooks, treatment continuity and Great Plague evidence for broad Renaissance progress-versus-continuity judgements.
