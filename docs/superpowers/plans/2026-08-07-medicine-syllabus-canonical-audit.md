# Medicine Syllabus Canonical Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify every Medicine canonical content/architecture pair against Pearson Edexcel GCSE History Issue 6 and amend the confirmed coverage, authority and factual gaps, with an explicit Hippocrates learning steer.

**Architecture:** Add one series-level audit index that maps every mandatory Issue 6 strand to its existing episode owners without becoming a competing content source. Make small amendments in the owning canonical files only: strengthen Episode 1's supporting Hippocrates contract, state Vesalius's effect on medical training, correct the Simpson/Snow attribution, quarantine Seacole as non-core enrichment, and complete Episode 14's Historic Environment ownership and current exam framing. This pass changes canonical documentation only; runtime screen changes remain a separately reviewed build step.

**Tech Stack:** Markdown canonical content and architecture documents; Pearson Edexcel GCSE History Issue 6; Pearson 2025 sample assessment materials; repository architecture tests and Vite build.

## Global Constraints

- Pearson Edexcel GCSE History Issue 6 is the mandatory syllabus authority for first assessment in summer 2026.
- The attached 2025 sample assessment materials govern the question-format examples in this audit.
- The attached Medicine knowledge organiser may supply supporting teaching detail but cannot override or expand what is labelled mandatory in Issue 6.
- Hippocrates is essential supporting knowledge for the required Four Humours/Galen continuity, but Issue 6 does not name him.
- Preserve one canonical concept vocabulary and one primary concept per assessed interaction; supporting concepts may provide context but must not receive the primary evidence event.
- Do not redesign or rebuild learner-facing screens in this documentation pass.
- Do not treat optional enrichment as evidence that a mandatory syllabus strand has been taught.

---

### Task 1: Persist the bidirectional syllabus coverage audit

**Files:**
- Create: `docs/content/history/Medicine/SYLLABUS_COVERAGE_AUDIT.md`
- Reference: `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md`
- Reference: `docs/content/history/Medicine/02_The_Day_Everything_Changed_Content.md`
- Reference: `docs/content/history/Medicine/03_The_Beginning_of_Doubt_Content.md`
- Reference: `docs/content/history/Medicine/04_The_Man_Who_Proved_Everyone_Wrong_Content.md`
- Reference: `docs/content/history/Medicine/05_Londons_Year_of_Terror_Content.md`
- Reference: `docs/content/history/Medicine/06_The_Boy_the_Cow_and_the_Cure_Content.md`
- Reference: `docs/content/history/Medicine/07_The_Invisible_Enemy_Content.md`
- Reference: `docs/content/history/Medicine/08_The_Great_Stink_Content.md`
- Reference: `docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever_Content.md`
- Reference: `docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Content.md`
- Reference: `docs/content/history/Medicine/11_The_Accidental_Miracle_Content.md`
- Reference: `docs/content/history/Medicine/12_When_Medicine_Became_Magic_Content.md`
- Reference: `docs/content/history/Medicine/13_Can_We_Beat_Cancer_Content.md`
- Reference: `docs/content/history/Medicine/14_Hell_in_the_Trenches_Content.md`

**Interfaces:**
- Consumes: Issue 6 mandatory bullets, the four attached Pearson PDFs, and all 14 canonical content/architecture pairs.
- Produces: a non-authoring verification index with authority rules, complete syllabus-to-owner mapping, a 14-episode file register and downstream build debt.

- [ ] **Step 1: Create the authority and status legend**

Write the audit date, exact source hierarchy and these meanings: `Verified`, `Amended`, `Supporting`, `Enrichment hold`, and `Downstream build check`. State explicitly that the audit index points to canonical owners and does not replace them.

- [ ] **Step 2: Add the complete Issue 6 ownership matrix**

Map the process-of-change requirements, all three strands for each of the four thematic periods, and both Historic Environment strands to the owning episode content and architecture files. Split cross-episode owners where the syllabus bullet spans more than one chapter.

- [ ] **Step 3: Add the 14-episode file-level register**

Record one row per content/architecture pair. Rows 1, 3, 9, 10 and 14 must name their amendments; all other rows must say `Verified` and name the syllabus ownership they satisfy.

- [ ] **Step 4: Record downstream boundaries**

State that this pass does not prove runtime parity. Require a later runtime check for Episode 1 objective/evidence attribution and Episode 14's expanded Historic Environment content, and record the pre-existing build-status drift as registry debt rather than silently resolving unrelated status files.

- [ ] **Step 5: Verify matrix completeness**

Run:

```bash
rg -n "Process of change|c1250.c1500|c1500.c1700|c1700.c1900|c1900.present|Historic Environment|Episode 14|Hippocrates" docs/content/history/Medicine/SYLLABUS_COVERAGE_AUDIT.md
```

Expected: matches for every period, both Historic Environment strands, all 14 episode rows and the Hippocrates authority note.

- [ ] **Step 6: Commit the audit index**

```bash
git add docs/content/history/Medicine/SYLLABUS_COVERAGE_AUDIT.md \
  docs/superpowers/plans/2026-08-07-medicine-syllabus-canonical-audit.md
git commit -m "docs: map medicine canon to edexcel issue 6"
```

---

### Task 2: Strengthen medieval and Renaissance learning ownership

**Files:**
- Modify: `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md:42-79, 145-190`
- Modify: `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Architecture.md:25-64, 101-150`
- Modify: `docs/content/history/Medicine/03_The_Beginning_of_Doubt_Content.md:18-35, 65-83, 101-139`
- Modify: `docs/content/history/Medicine/03_The_Beginning_of_Doubt_Architecture.md:67-103, 119-165`
- Modify: `docs/content/history/Medicine/01_Review_Log.md:1-8`

**Interfaces:**
- Consumes: canonical concept IDs `history:medicine:hippocrates`, `history:medicine:four-humours` and `history:medicine:galen`; Issue 6's Four Humours/Galen and Vesalius/medical-training bullets.
- Produces: explicit authority classification, typed Hippocrates objectives, minimum evidence and recovery steer, plus explicit ownership of Vesalius's impact on medical training.

- [ ] **Step 1: Add the Episode 1 authority note and minimum knowledge**

State that Issue 6 names Four Humours and Galen, while the organiser names Hippocrates. Require learners to know that Hippocrates promoted natural explanations, observation/recording and the Four Humours, and to distinguish his contribution from Galen's Theory of Opposites.

- [ ] **Step 2: Add the Episode 1 canonical learning contract**

Add objectives for `recall`, `understand` and `connect`, then minimum evidence: one Hippocrates-primary recall, one Hippocrates/Galen distinction or application, and later retrieval in Episode 3. State that name recognition, passive exposition and a Four-Humours-primary question with Hippocrates as context do not independently satisfy the contract.

- [ ] **Step 3: Align Episode 1 gap analysis and build steer**

Record that the current runtime already teaches Hippocrates and contains recall/misconception checks, but the canonical objective/evidence contract was missing. Direct the next runtime pass to preserve concise teaching, map evidence to the declared objective and route a misconception to the Hippocrates weak spot without adding biography for its own sake.

- [ ] **Step 4: Make Vesalius's effect on medical training explicit**

Add to Episode 3 that anatomy theatres, human dissection and accurate printed illustrations changed how students and doctors learned anatomy, while treatment remained largely traditional. Add the same requirement to the architecture and completion checklist.

- [ ] **Step 5: Add the review-log amendment entry**

At the top of `01_Review_Log.md`, record the source authority, diagnosis, canonical amendments, runtime boundary and acceptance criteria for the Hippocrates contract.

- [ ] **Step 6: Verify the ownership language**

Run:

```bash
rg -n "essential supporting knowledge|primary concept|minimum evidence|natural explanations|observation|Theory of Opposites|medical training" \
  docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_{Content,Architecture}.md \
  docs/content/history/Medicine/03_The_Beginning_of_Doubt_{Content,Architecture}.md \
  docs/content/history/Medicine/01_Review_Log.md
```

Expected: the Issue 6/supporting distinction, all three Hippocrates objectives/evidence rules, and explicit Vesalius medical-training ownership are present.

- [ ] **Step 7: Commit the learning ownership amendments**

```bash
git add docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md \
  docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Architecture.md \
  docs/content/history/Medicine/03_The_Beginning_of_Doubt_Content.md \
  docs/content/history/Medicine/03_The_Beginning_of_Doubt_Architecture.md \
  docs/content/history/Medicine/01_Review_Log.md
git commit -m "docs: clarify medicine learning ownership"
```

---

### Task 3: Correct authority, attribution and Historic Environment coverage

**Files:**
- Modify: `docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever_Content.md:97-112`
- Modify: `docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Content.md:47-145`
- Modify: `docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Architecture.md:12-55, 77-85`
- Modify: `docs/content/history/Medicine/14_Hell_in_the_Trenches_Content.md:3-19, 46-97, 102-170`
- Modify: `docs/content/history/Medicine/14_Hell_in_the_Trenches_Architecture.md:3-55, 71-82`

**Interfaces:**
- Consumes: Issue 6's Nightingale and Western Front bullets and the 2025 SAM Section A question format.
- Produces: correct Simpson/Snow attribution; a non-core hold on Seacole; complete Episode 14 place, infrastructure, treatment-chain, Arras and source-enquiry coverage; current Section A exam wording.

- [ ] **Step 1: Correct the Simpson/Snow attribution**

Change James Simpson's key-person entry so Simpson discovers/popularises chloroform and John Snow administers it to Queen Victoria in 1853. Preserve Queen Victoria's role in increasing acceptance.

- [ ] **Step 2: Reclassify Mary Seacole**

Move Seacole out of `Specification requirements` into an explicit `Optional enrichment — source hold` section. State that she is not named in Issue 6 or the attached organiser, cannot satisfy the Nightingale/hospital-care requirement, and must not become a core objective or assessment until separately source-approved. Mirror that boundary in Episode 10 architecture.

- [ ] **Step 3: Update Episode 14 identity and exam format**

Align the canonical build-status line with the existing 19-screen runtime while retaining a downstream parity warning. Replace the old combined "describe two features" wording with two separate 2-mark Question 1 feature prompts, retain Q2(a)/Q2(b), and remove the Historic Environment Q3 significance claim.

- [ ] **Step 4: Add the missing Western Front required content**

Add Ypres salient, Somme, Arras and Cambrai; terrain plus transport/communications problems; horse and motor ambulances and field ambulance in the evacuation chain; the underground hospital at Arras; wound/infection techniques; and the early-twentieth-century asepsis, x-ray and blood-storage context.

- [ ] **Step 5: Complete the source-enquiry contract**

Distinguish national sources from local sources using the Issue 6 examples. Require strengths/weaknesses for a specific enquiry, framing an enquiry question and selecting a source that can answer it. Connect this explicitly to the four fields in Q2(b).

- [ ] **Step 6: Mirror Episode 14 coverage in architecture**

Add the four places and infrastructure in Section 2, Arras and the full transport/treatment chain in Section 3, infection techniques and historic context in Section 4, and national/local source selection plus the current Q1/Q2 formats in Section 6 and build recommendations.

- [ ] **Step 7: Verify the corrections against source phrases**

Run:

```bash
rg -n "John Snow|Optional enrichment|not named in Issue 6|Ypres|Somme|Arras|Cambrai|horse and motor ambulances|field ambulance|underground hospital|national sources|local sources|Selection of appropriate sources|Q1\(a\)|Q1\(b\)" \
  docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever_Content.md \
  docs/content/history/Medicine/10_The_Lady_with_the_Lamp_{Content,Architecture}.md \
  docs/content/history/Medicine/14_Hell_in_the_Trenches_{Content,Architecture}.md
```

Expected: every corrected attribution, authority boundary, named place, transport/treatment item and enquiry skill is present; no Episode 14 Historic Environment Q3 remains.

- [ ] **Step 8: Commit the targeted corrections**

```bash
git add docs/content/history/Medicine/09_The_Day_Surgery_Changed_Forever_Content.md \
  docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Content.md \
  docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Architecture.md \
  docs/content/history/Medicine/14_Hell_in_the_Trenches_Content.md \
  docs/content/history/Medicine/14_Hell_in_the_Trenches_Architecture.md
git commit -m "docs: close medicine syllabus gaps"
```

---

### Task 4: Review and verify the complete documentation change

**Files:**
- Review: `docs/content/history/Medicine/SYLLABUS_COVERAGE_AUDIT.md`
- Review: all modified Medicine canonical files from Tasks 2 and 3
- Review: `docs/superpowers/plans/2026-08-07-medicine-syllabus-canonical-audit.md`

**Interfaces:**
- Consumes: the full branch diff and the plan requirements.
- Produces: a lean, source-aligned change with fresh verification evidence ready for a pull request.

- [ ] **Step 1: Run the bidirectional requirement review**

Re-read the Issue 6 Medicine extract line by line and point every mandatory bullet to a row in `SYLLABUS_COVERAGE_AUDIT.md`. Then scan every non-required named individual in the changed files and confirm it is labelled supporting or enrichment rather than mandatory.

- [ ] **Step 2: Run correctness and over-engineering reviews**

Inspect `git diff --check` and `git diff --stat`, then perform a normal correctness review and the `ponytail-review` pass. Remove duplication if the audit index repeats teaching content instead of only mapping ownership.

- [ ] **Step 3: Run repository verification**

Run:

```bash
git diff --check
pnpm vitest run tests/architecture
pnpm vite build
```

Expected: no whitespace errors, all architecture tests pass, and Vite exits 0. A composed 390px render is not applicable because this pass changes Markdown only and does not alter runtime screens.

- [ ] **Step 4: Verify branch scope**

Run:

```bash
git status --short
git diff main...HEAD --stat
git log --oneline main..HEAD
```

Expected: only the plan, audit index and named Medicine canonical files are changed; three intentional documentation commits are present.

- [ ] **Step 5: Publish through the repository delivery workflow**

Push `codex/medicine-canonical-syllabus-audit` and open a pull request targeting `main`. The pull request summary must separate canonical fixes from deferred runtime parity checks and include the verification commands and results.
