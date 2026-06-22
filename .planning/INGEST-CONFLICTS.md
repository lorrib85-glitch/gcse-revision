# Conflict Detection Report

Ingest date: 2026-06-22
Mode: new (first-time bootstrap)
Documents processed: 24 (3 ADR, 9 SPEC, 12 DOC)
Precedence applied: ADR > SPEC > DOC

---

## BLOCKERS (0)

No blockers found.

No LOCKED-vs-LOCKED ADR contradictions detected. No UNKNOWN-confidence-low documents. No reference graph cycles detected (max traversal depth 50 not approached; cross-refs are informational provenance links, not dependency cycles).

---

## WARNINGS (1)

[WARNING] Competing font family assertions — Cormorant Garamond vs IBM Plex Serif
  Found: docs/system/TYPOGRAPHY_SYSTEM.md (SPEC) declares two fonts: Sora and Cormorant Garamond. Cormorant Garamond is assigned to TYPE.cinematic and all editorial/emotional moments.
  Found: docs/system/PRODUCT_UI_CONSTITUTION.md (DOC) repeats the same two-font rule: Sora and Cormorant Garamond.
  Found: CLAUDE.md (system prompt, supreme project authority) states in the Fonts section: "IBM Plex Serif — Google Fonts — secondary UI text (used in some learning components)" and explicitly notes it "replaces Cormorant Garamond references in older docs."
  Impact: TYPOGRAPHY_SYSTEM.md and PRODUCT_UI_CONSTITUTION.md name a font (Cormorant Garamond) that CLAUDE.md declares replaced. The TYPE.cinematic token's font family is therefore undefined in the canonical SPEC. Any component consuming TYPE.cinematic, or any new screen using a serif for editorial moments, cannot resolve which font to use without risking a divergence from CLAUDE.md.
  Current state: src/constants/typography.js may already reference IBM Plex Serif (the runtime codebase has likely been updated), but the SPEC and DOC sources ingested here still say Cormorant Garamond. This is a documentation drift conflict, not necessarily a code conflict.
  → Resolve by updating TYPOGRAPHY_SYSTEM.md and PRODUCT_UI_CONSTITUTION.md to replace all Cormorant Garamond references with IBM Plex Serif, and confirming that TYPE.cinematic in src/constants/typography.js already uses IBM Plex Serif. Until resolved, treat CLAUDE.md as the operative authority (IBM Plex Serif) for new work, since it is the supreme project document.

---

## INFO (4)

[INFO] Auto-resolved: Standard Module Spine superseded by History Architecture and Science Blueprint
  Note: docs/04 Learning Architecture/Standard_Module_Spine.md (ADR, medium confidence, not locked, status: Superseded) defines a 15-role sequential module spine that conflicts with both docs/system/HISTORY_MODULE_ARCHITECTURE.md (SPEC) and docs/system/SCIENCE_MODULE_BLUEPRINT.md (DOC) on module structure and section ordering.
  Resolution: The ADR document itself explicitly declares it is "Superseded — retained for historical reference only" and names CLAUDE.md as the current authority. This is a documented self-supersession, not a silent contradiction. The SPEC (HISTORY_MODULE_ARCHITECTURE.md) and DOC (SCIENCE_MODULE_BLUEPRINT.md) represent the current state. Synthesized intel reflects the current architecture, not the superseded spine.
  Synthesized intel in: constraints.md CON-02 (History) and CON-08 (Science); decisions.md DEC-03 (superseded ADR, historical note only).

[INFO] Auto-resolved: Module Blueprint Library superseded by History Architecture and Science Blueprint
  Note: docs/04 Learning Architecture/Module-Blueprint-Library.md (DOC, status: Superseded) defines a universal opening sequence (ChapterHookScreen → ChapterOutcomeScreen → QuickRecallScreen) that differs from the History Architecture's Section 1 mandatory order (CinematicRevealMoment/ChapterHookScreen → PriorKnowledgeRecall → WhatYouWillLearn).
  Resolution: The DOC itself explicitly declares it is "Superseded — retained for historical reference only" and names CLAUDE.md as the current authority. No live conflict exists. Synthesized intel reflects only the current architecture docs.
  Synthesized intel in: constraints.md CON-02; context.md TOPIC: Module Blueprint Library (SUPERSEDED).

[INFO] Auto-resolved: ADR > SPEC on BackButton touch target size
  Note: docs/superpowers/specs/2026-06-12-back-button-component-design.md (ADR, status: Implemented) specifies a 40×40 touch target for BackButton, explicitly revised down from 44×44 on 2026-06-12 per direct user request.
  Found: docs/system/BUTTON_RADII_SYSTEM.md (SPEC) asserts "All interactive elements must have a minimum tap target of 44×44px" as a general rule.
  Resolution: ADR takes precedence over SPEC. The ADR post-dates the SPEC's general rule and records an explicit, intentional user-directed revision. BackButton is the only element where 40×40 is authorised; all other interactive elements remain bound by BUTTON_RADII_SYSTEM.md's 44×44px minimum.
  Synthesized intel: decisions.md DEC-02 notes the conflict; constraints.md CON-01 flags the override.

[INFO] Auto-resolved: Development workflow ADR and DEVELOPMENT_WORKFLOW.md DOC are consistent
  Note: docs/superpowers/specs/2026-06-12-development-workflow-design.md (ADR, LOCKED) and docs/system/DEVELOPMENT_WORKFLOW.md (DOC) cover the same scope (pipeline rules, branching policy, completion checklist). No contradiction exists — the DOC is the operational implementation of the ADR decision, as explicitly stated in DEVELOPMENT_WORKFLOW.md: "This document is the operational counterpart to docs/superpowers/specs/2026-06-12-development-workflow-design.md."
  No resolution needed. Both recorded in synthesized intel.
  Synthesized intel: decisions.md DEC-01 (ADR, LOCKED); context.md TOPIC: Development Workflow — Operational Rules (DOC).
