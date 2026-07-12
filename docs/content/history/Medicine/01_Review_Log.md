# Episode 1 — review log

Episode: `history-medicine-medieval-beliefs-causes` ("Trust me, I'm
Following Jupiter"). Entries newest-first.

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
