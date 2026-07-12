# Episode 1 — review log

Episode: `history-medicine-medieval-beliefs-causes` ("Trust me, I'm
Following Jupiter"). Entries newest-first.

---

## 2026-07-12 — Gold audit (third wave) — two golds seated from Ep1

- **Session scope:** the rank-1 recurring-pattern gold audit (Step 2b of
  the UX-quality-at-scale programme), not a full episode review. Two Ep1
  screens were rendered at 390px in the composed render path (dev
  screen-jump + a scratchpad tap-through helper) and seated as the
  register golds for their patterns.
- **Canonical files available:** not consulted — this audits execution
  against the pattern render bar, not coverage.

### Screen decisions (audited subset only)

| Screen | Decision | Outcome |
|---|---|---|
| s12 `guidedChoiceCarousel` ("Choose your healer") | Keep | Seated as the composed `guidedChoiceCarousel` gold — verified rest + flipped-card info + full reveal. Image-rich options, emoji stat-runs normalised to chips, one dominant question + CTA, reveal builds to an amber punchline. |
| s18 `collectionExplorer` ("Staying well in 1400") | Keep | Seated as the composed `collectionExplorer` gold — verified rest + open hotspot sheet + synthesis. 4 items × exactly 5 reveals match the component's hardcoded phase labels; scene-anchored hotspots; synthesis lands a connective exam takeaway. |

- **Below-bar counterexamples (other modules):** `bio_building_blocks` s1
  (imageless carousel cards) for `guidedChoiceCarousel`;
  `history-medicine-western-front` s2 (3-reveal items mislabelled by the
  5-beat phase labels + gridded hotspots) for `collectionExplorer`.
- **Shared softness noted, not bar-affecting:** the low-contrast cinematic
  "Continue →" on the carousel reveal; the "Collection complete" synthesis
  eyebrow tucking under the module header capsule.
- Full strengthened verdicts in `docs/system/GOLD_SCREEN_REGISTER.md` →
  "Third wave — 2026-07-12 rank-1 recurring patterns".

---

## 2026-07-12 — Stages B + C — s32 amendment brief implemented and approved

- **Session scope:** the s32 Refine brief from the Stage-A entry below,
  confirmed by the user this session.
- **Stage B (build).** Root cause confirmed via systematic debugging before
  any change: `GuidedExamResponse` portals a full-screen overlay with its
  own header band because its `GuidedAnswerCoach` host (Exam Mode) has no
  module chrome — but in-module, `ModulePlayer` keeps the floating
  `LearningHeader` capsule (z-index 1001) mounted above the portal
  (z-index 1000), so two headers occupied the same strip. Fix: an
  `embedded` prop passed by ModulePlayer suppresses the band and pads
  content below the capsule (ExaminerExplainsScreen's clearance idiom);
  the coach context is unchanged by default. Uppercase: the entry label's
  inline `textTransform` removed (authored string already sentence case),
  and the same transform removed from the writing-scaffold lane labels —
  in scope per the brief's acceptance criterion ("no uppercase outside
  approved compact-scanning exceptions"); all four modules author
  sentence-case lane labels. Approved chips kept: source labels, marks
  badge, "examiner's mark", "Section by section".
- **Stage C (approve, independent re-render).** All four uses re-rendered
  at 390px post-fix: Ep1 s32 (entry + question + writing), Ep2 s23,
  Vesalius s11, `bio_building_blocks` s11. One header everywhere; question
  dominant; sentence-case labels; CTA visible; subject theming intact
  (History amber / Biology green). Trade-off check: none found — the
  removed band's information survives (marks inline in the question,
  back/exit via the capsule). Marking/result states not re-rendered (need
  a live marking response) — recorded as remaining capture debt in the
  register, not silently skipped. **Approved**; gold seated in
  `GOLD_SCREEN_REGISTER.md`.
- **Verification:** vite build ✓; architecture tests 724/724 ✓; lint 0
  errors.

---

## 2026-07-12 — Stage A (diagnose) — gold-audit scope only

- **Session scope:** cross-module gold audit (not a full episode review).
  Ep1 screens rendered at 390px in the composed render path via the
  contact-sheet tool (`scripts/contact-sheet.mjs`) + tap-through states:
  s0 (beats 1–2), s4 (intro/explore/hotspot sheet), s5 (question +
  feedback), s8, s30 (full payload), s32 (entry + question state).
- **Canonical files available:** not consulted — gold seating audits
  execution against component contracts, not coverage. Coverage and spine
  unassessed in this entry.
- **Ratings:** not applicable — six-dimension scoring was out of scope for
  this entry; only render-pass execution findings are recorded.

### Screen decisions (audited subset only)

| Screen | Decision | Outcome |
|---|---|---|
| s0 `visualNarrative` | Keep | Seated as composed gold (beats 1–2) |
| s4 `interactiveImage` | Keep | Seated as composed gold (all 3 states) |
| s5 `quickRecall` | Keep | Register ◑ → ✓ (question + feedback states) |
| s8 `content` (`shell: 'teach'`) | Keep | Seated as the composed `TeachScreenShell` gold |
| s30 `examinerExplains` | Keep | Register ◑ → ✓ (full payload). Minor, not bar-affecting: "Tap to continue" affordance is very low-contrast |
| s32 `guidedExamResponse` | **Refine** | Gold refused — brief below |

### Amendment brief — s32 (deferred; not confirmed for implementation)

- **Module ID:** `history-medicine-medieval-beliefs-causes`
- **Screen index:** 32
- **Current component:** `guidedExamResponse`
- **Decision:** Refine
- **Canonical learning objective:** attempt the chapter's 16-mark
  "how far do you agree" question (Church as the main reason for lack of
  change c1250–c1500) with scaffolded support.
- **One primary screen intent:** the learner writes their own answer to the
  chapter's biggest exam question.
- **Learner need:** transfer from guided exam thinking (s30–31) to
  independent writing.
- **Approved replacement component:** unchanged (`guidedExamResponse`).
- **Component contract:** none yet (write-contract debt).
- **Named gold example:** No verified composed gold example yet
  (`GOLD_SCREEN_REGISTER.md` → debt rank 1).
- **Required content/evidence:** unchanged — question, marks, section
  scaffold, mark-by-mark reveal.
- **Required learner action:** unchanged (exam-technique, assessed).
- **Intended learning payoff:** unchanged; the refine is purely execution.
- **Must NOT appear:** (1) the exam-frame metadata band colliding with /
  rendering through the module progress header at 390px; (2)
  sentence-length decorative uppercase ("YOUR TURN — NO SAMPLE ANSWER THIS
  TIME" → sentence case, or a short approved chip).
- **390px acceptance criteria:** no overlap between exam-frame header and
  progress capsule at any scroll position; no uppercase outside approved
  compact-scanning exceptions; question remains dominant; CTA visible
  without scrolling.
- **Retained elements:** everything else — question typography, entry
  beat, scaffold flow.
- **Known risks:** the header collision may originate in the shared exam
  frame (`ExamQuestionFrame`/module header composition), in which case the
  fix touches all 4 `guidedExamResponse` uses (Ep1 s32, Ep2 s23,
  Vesalius s11, `bio_building_blocks` s11) — verify all four after fixing.

### Technical passes

Out of scope for this entry except the render pass (run, findings above).

### Implemented / approved

Nothing implemented — Stage A only. Register updates committed separately
(`docs/system/GOLD_SCREEN_REGISTER.md`, second-wave section).
