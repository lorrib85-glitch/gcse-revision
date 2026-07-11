# Episode 2 — Review log

Newest entry first. See `docs/system/component-contracts/README.md` and
`docs/system/PATTERN_GOVERNANCE.md` for what each check means.

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
