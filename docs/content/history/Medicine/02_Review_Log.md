# Episode 2 — Review log

Newest entry first. See `docs/system/component-contracts/README.md` and
`docs/system/PATTERN_GOVERNANCE.md` for what each check means.

---

## 2026-07-12 — Gold audit (third wave) — two golds seated; one content defect found

- **Session scope:** the rank-1 recurring-pattern gold audit (Step 2b of
  the UX-quality-at-scale programme), not a full episode review. Three Ep2
  screens rendered at 390px in the composed render path (dev screen-jump +
  a scratchpad tap-through helper). Audit + register only — no content
  amended this session.
- **Canonical files available:** not consulted — audits execution against
  the pattern render bar, not coverage.

### Screen decisions (audited subset only)

| Screen | Decision | Outcome |
|---|---|---|
| s1 `cinematic` ("June 1348.") | Keep | Seated as the composed `cinematic` gold — verified fully-revealed end state. Content-true full-bleed image, refined copy building to a bold "This is the Black Death." payoff under an "ENGLAND · 1348" eyebrow, one headline, one Continue. |
| s6 `progressionTimeline` ("How the plague killed") | Keep | Seated as the composed `progressionTimeline` gold — verified rest + full chain. Genuine day values (the "DAY n" pill reads truthfully), specific case-file hero, stage-collapse keeps one focal, and the default exam-link is correct *for a disease-progression chain*. |
| s15 `progressionTimeline` ("What changed after so many died?") | **Refine (deferred)** | Recorded as the `progressionTimeline` below-bar counterexample **and** a genuine content defect — see below. Not amended. |

### s15 content defect (flagged, not fixed — audit-only session)

The aftermath timeline reuses the disease-progression component for a
multi-decade social/economic chain (Black Death 1348–49 → labour shortage →
Statute of Labourers 1351 → Peasants' Revolt 1381). Two defects follow from
the domain mismatch, both confirmed in the 390px render:

1. **Wrong exam-link.** s15 supplies no `finalInsight`, so
   `SymptomProgression` falls back to its hardcoded plague-symptom/germ-theory
   default ("Plague symptoms mattered because medieval doctors could observe
   the disease…"). Rendered under a timeline about wages and rebellion, this
   contradicts the screen's own content. This is a content-correctness bug,
   not a styling softness.
2. **"DAY" pill mislabels years.** The pill eyebrow is hardcoded to "DAY", so
   the year stages render "DAY 1351" / "DAY 1381".

**Fix direction (for a future confirmed brief):** author an aftermath-specific
`finalInsight` for s15, and give `SymptomProgression` a non-"DAY" pill-label
option (or move s15 to a component built for era/year chains). No amendment
made — this session is audit + register only. Also logged in
`docs/system/GOLD_SCREEN_REGISTER.md` (third-wave section + debt list).

- Full strengthened verdicts in `GOLD_SCREEN_REGISTER.md` → "Third wave —
  2026-07-12 rank-1 recurring patterns".

---

## 2026-07-11 — Amend: coverage gaps, sentence case, readability

**Scope:** the three real, non-deferred findings from the audit below,
per explicit user instruction — the `visualLearning` repetition-limit
violation was left as-is on purpose.

**What was amended (3 commits, one per unit):**
- `2365150` — taught both canonical-coverage gaps: added a closing stage
  to the "How the plague killed" `progressionTimeline` naming the three
  forms of plague (bubonic/pneumonic/septicaemic), and a new scene on the
  "Why treatments failed" `visualLearning` screen covering quarantine's
  enforcement failure (rich people ignoring orders, no police force, the
  Church running normally). No new screens; no component repetition added.
- `e8dd8ec` — sentence-cased all 6 `stageNavigation` titles. Also fixed a
  detector false positive along the way: "Melcombe Regis, June 1348" was
  flagging across a comma boundary (place name, then date) as if it were
  one title-case run; added a clause-boundary check to
  `contentQualityChecks.js` plus "Melcombe Regis" to `PROPER_NOUNS`. This
  fix is general — it affects every episode's sentence-case check, not
  just this one — and caused no regressions elsewhere (verified against
  the full architecture suite).
- `c3cca47` — simplified prose on the 4 screens over the readability
  ceiling (3, 7, 8, 11): shorter sentences, a couple of easier word
  swaps (e.g. "pomanders" → "flowers"), no facts cut. Grades moved from
  7.2–8.0 down to 5.3–6.9.

**What was NOT amended (deferred, per instruction):**
- The `visualLearning` repetition-limit violation (used 3×, cap is 2) —
  left in place. Still true, still logged below.
- The `interactiveImage` cross-cutting taxonomy question — not this
  episode's fix, unchanged.

**Verification for all 3 commits:** `vitest run tests/architecture` green
throughout (659 tests, no regressions), `vite build` clean, and each
edited screen screenshotted via the dev-only jump and inspected at 390px
before commit — including clicking through to the actual new stage/scene
content (not just the screen's default first state).

**After-amend re-score** (`node scripts/check-content-quality.mjs
history-medicine-black-death`): **zero** guardrail/readability violations,
**zero** sentence-case violations (down from 4 readability + 11
sentence-case findings). Episode 2 removed from both
`GRANDFATHERED_EPISODES` and `SENTENCE_CASE_GRANDFATHERED_EPISODES` in
`tests/architecture/content-quality.test.js` — it now passes the CI floor
on its own merits, not by exemption.

Six-dimension rubric ratings from the audit below are unchanged by this
amend (the amendments closed gaps and fixed prose; they didn't newly
discover a story/teaching/retrieval/exam-prep/engagement problem).

---

## 2026-07-11 — Full episode audit (audit-only)

**Scope:** full episode (24 screens, all 6 stages).
**Canonical files available:** yes — `02_The_Day_Everything_Changed_Content.md`
and `..._Architecture.md` both present, but **no Story spine section**
(predates the 2026-07 framework) → **degraded mode**: the formal
spine-based story check and the strict two-way canonical-coverage diff were
skipped. A looser cross-check against the canonical file's "Specification
requirements" and "Content reference pack" was still possible and is
reported below — it surfaced two real gaps, so it is not a pure "unassessed"
skip.
**Render pass:** 8 screens screenshotted at 390px via the dev-only jump
(screens 1, 2, 6, 8, 11, 16, 21, 22 — one from most stages plus every
readability-flagged screen). Screen 21 (`examinerExplains`) was captured
mid word-reveal animation — a timing artefact of the screenshot, not a
defect.

### Per-screen audit (spot-checked, not exhaustive)

Screens 1, 2, 6, 8, 11, 16 each state a single primary intent cleanly (e.g.
screen 16 `conceptReveal`: land "change ≠ progress"; screen 2
`interactiveImage`: orient the learner at the dock before exploring). No
overloaded screens found in the sample. Each checked screen's component
matches its learning objective — no misuse spotted.

### Six-dimension rubric

**1. Story — strong.** No formal spine, but a clear, consistent arc is
present and matches the canonical file's stated core takeaway almost
exactly: arrival (screens 1–7) → why the wrong explanations felt logical
(8–10) → why every resulting treatment failed (11–14) → change vs.
continuity in the aftermath (15–17) → exam application (18–23). The
canonical "core takeaway" (medieval medicine was tested and failed
completely, and *that* is the real story) is stated almost verbatim at
screen 16 ("Change ≠ progress").

**2. Teaching — strong.** Cause → mechanism → consequence is taught before
anything tests it at every stage (e.g. screen 6 `progressionTimeline`
teaches the biological chain before screen 7's quiz; screen 8 teaches *why*
each explanation felt logical before screen 9's sort task).

**3. Retrieval — strong.** Four `quickRecall` screens plus two
`misconceptionCheck` traps, spaced across the episode. Episode 1 concepts
(Four Humours, miasma, astrology, Church, three practitioner types) are
explicitly interleaved via the opening `priorKnowledgeRecall`.

**4. Interactions — adequate, two findings:**
- **Screen count violation (locked rule):** `HISTORY_MODULE_ARCHITECTURE.md`
  → Component Repetition Limit caps any feature component at 2 uses per
  chapter, with `QuickRecallScreen`/`PriorKnowledgeRecall` explicitly
  exempted. `visualLearning` is used **3 times** (screens 8, 13, 19) —
  `visualLearning` is not on the exemption list. This is a locked-doc
  violation, not a style preference.
- **Cross-cutting taxonomy finding (not specific to this episode):**
  `interactiveImage` (screen 2, `InteractiveHotspotImage.jsx`) is a
  tap-to-explore hotspot screen with no correct/incorrect answer — per
  `ModulePlayer.jsx:2048-2069` it only tracks `onEnterExplore`/`onContinue`,
  never a scored answer. `src/data/componentFunctions.js` currently
  classifies it `interaction: 'assessed'`. That looks like a
  misclassification — it behaves like `reveal` (same class as the very
  similar `collectionExplorer`, correctly classified `reveal`). This
  affects every episode using `interactiveImage`, not just this one, so it
  is reported here but not fixed as part of this episode's amend — it's a
  shared-taxonomy decision.

**5. Exam preparation — strong.** Dedicated stage 6 (screens 18–23) with a
real annotated mark scheme (`faceExaminer`) and a second full mark scheme
(`guidedExamResponse`). The `guidedExamResponse` question ("Describe two
ways the Black Death spread") matches the canonical file's suggested exam
angle closely, down to the named port (Melcombe) and the flea→rat→human
chain the mark scheme rewards.

**6. Emotional engagement — strong.** The render pass confirms the
architecture doc's own build recommendation ("keep gore low and dread
high") was followed: screens 1, 2 and 16 are atmospheric, tense, and
image-led without graphic content.

### Technical passes

- **Hardcoded values:** not applicable at the content-data layer — this
  episode's screens carry no inline styling; token compliance is owned by
  the shared rendering components, not per-episode data.
- **Image quality:** all referenced images resolve under
  `/figures/history/medicine/black-death/`; `.png` throughout (acceptable
  per `CLAUDE.md` — `.webp` is only *preferred* for new assets).
- **UX design:** consistent with the episode's subject accent (`#8C3A2A`)
  across every screenshotted screen; hierarchy and spacing read clean at
  390px in every sampled screen.
- **Canonical coverage (informal, degraded mode) — two real gaps found:**
  1. The canonical spec requires teaching the **three forms of plague**
     (bubonic, pneumonic, septicaemic) — the built episode only ever
     teaches bubonic plague (screens 6, 7). Pneumonic and septicaemic are
     never mentioned.
  2. The canonical file names **government quarantine failure** as a
     specific case study (laws existed, poorly enforced — rich people
     ignored them, the Church ran normally) and calls out its forward
     connection to Episode 8's effective public-health action. The built
     episode mentions "quarantine" exactly once, as a wrong-answer
     multiple-choice distractor (screen 11) — the actual quarantine
     content is never taught.
  - Nothing in the episode is unsourced from the canonical file.
- **Readability + sentence case** (`node scripts/check-content-quality.mjs
  history-medicine-black-death`):
  - Guardrails: 4 screens over the readability ceiling — screen 3 (7.2),
    screen 7 (8.0), screen 8 (7.8), screen 11 (7.5). All borderline (≤8.0),
    driven by longer explanatory sentences in `timelineCanvas` detail text
    and `quickRecall` explanations.
  - Sentence case: 11 violations, entirely in `stageNavigation` titles
    ("The Ship That Changed England", "How Medieval Minds Explained It",
    "Treatments in a World Without Germs", "Exam Prep: Crisis, Continuity
    and Change") and one hotspot title ("Melcombe Regis, June 1348" — this
    one is a proper noun/place-and-date and is arguably a false positive,
    not a real violation).
  - This episode is on both grandfather allowlists in
    `tests/architecture/content-quality.test.js`; every violation above is
    real and independent of that list.

### Summary — deferred vs. real

- **Deferred (cross-cutting, not this episode's fix):** `interactiveImage`
  taxonomy classification.
- **Real findings for this episode, not yet amended:** the `visualLearning`
  repetition-limit violation, the two canonical-coverage gaps (three plague
  forms; quarantine enforcement failure), the 4 readability-ceiling
  screens, and 10 real sentence-case violations (stage titles).
- **What was amended:** nothing — audit-only, per the invocation.
- **After-amend re-score:** n/a.
