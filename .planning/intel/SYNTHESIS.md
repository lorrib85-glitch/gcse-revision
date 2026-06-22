# Synthesis Summary

Entry point for downstream consumers (gsd-roadmapper and equivalent tools).

Generated: 2026-06-22
Mode: new (first-time bootstrap)
Precedence applied: ADR > SPEC > DOC

---

## Document Counts by Type

Total: 24 documents

ADR: 3
  - docs/superpowers/specs/2026-06-12-development-workflow-design.md (LOCKED, high confidence)
  - docs/superpowers/specs/2026-06-12-back-button-component-design.md (not locked per classifier, high confidence)
  - docs/04 Learning Architecture/Standard_Module_Spine.md (SUPERSEDED, medium confidence)

SPEC: 9
  - docs/system/BUTTON_RADII_SYSTEM.md
  - docs/system/HISTORY_MODULE_ARCHITECTURE.md
  - docs/system/MOTION_SYSTEM.md
  - docs/system/SCREEN_SHELL_SYSTEM.md
  - docs/system/SPACING_SYSTEM.md
  - docs/system/SUBJECT_THEME_SYSTEM.md
  - docs/system/TYPOGRAPHY_SYSTEM.md
  - docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md
  - docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md

DOC: 12
  - docs/system/PRODUCT_UI_CONSTITUTION.md
  - docs/components/COMPONENT_REGISTRY.md
  - docs/components/LOCKED_COMPONENTS.md
  - docs/system/00_SYSTEM_INDEX.md
  - docs/system/COMPONENT_AUTHORING_RULES.md
  - docs/system/DEVELOPMENT_WORKFLOW.md
  - docs/system/GENERAL_APP_UI_CONSTITUTION.md
  - docs/system/LEARNING_EXPERIENCE_PRINCIPLES.md
  - docs/system/SCIENCE_MODULE_BLUEPRINT.md
  - docs/system/TEACHING_VOICE_GUIDE.md
  - docs/system/VISUAL_ASSET_SYSTEM.md
  - docs/04 Learning Architecture/Module-Blueprint-Library.md

---

## Decisions Locked

Count: 1

- DEC-01 (LOCKED): Development workflow — two named pipelines (main-only)
  source: docs/superpowers/specs/2026-06-12-development-workflow-design.md
  Full entry in: /home/user/gcse-revision/.planning/intel/decisions.md

---

## Decisions Not Locked (Active)

Count: 1

- DEC-02: BackButton — single locked constitutional component for all back-navigation
  source: docs/superpowers/specs/2026-06-12-back-button-component-design.md
  Full entry in: /home/user/gcse-revision/.planning/intel/decisions.md

---

## Decisions Superseded

Count: 1

- DEC-03: Standard Module Spine (SUPERSEDED)
  source: docs/04 Learning Architecture/Standard_Module_Spine.md
  Historical reference only — not binding.

---

## Requirements Extracted

Count: 2 (from SPEC sources; no PRD-type documents were ingested)

- REQ-home-todays-plan: Home screen "Today's plan" task carousel — status: not yet implemented
  source: docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md
- REQ-canonical-topic-skill: Canonical topic generator skill — status: design/skill to be built
  source: docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md

Full entries in: /home/user/gcse-revision/.planning/intel/requirements.md

---

## Constraints Extracted

Count: 10

- CON-01: Button and Radius Token Contract (api-contract)
- CON-02: History Module Architecture (protocol, LOCKED structure)
- CON-03: Motion Token Contract (api-contract)
- CON-04: Spacing Token Contract (api-contract)
- CON-05: Subject Theme Token Contract (api-contract)
- CON-06: Typography Token Contract (api-contract) — SEE WARNING in conflicts report
- CON-07: Screen Shell Layout Contract (api-contract)
- CON-08: Science Module Blueprint (protocol, LOCKED structure)
- CON-09: Canonical Topic Skill Design Contract (schema)
- CON-10: Home Redesign Visual and Navigation Contract (api-contract)

Type breakdown: api-contract (7), protocol (2), schema (1)

Full entries in: /home/user/gcse-revision/.planning/intel/constraints.md

---

## Context Topics Extracted

Count: 8

- Product Identity and Design Philosophy
- Component Registry and Lock Status
- Component Authoring Rules
- System Index and Authority Order
- Development Workflow — Operational Rules
- Learning Experience Philosophy
- Teaching Voice and Content Authoring
- Science Module Blueprint (LOCKED) — educational context
- Visual Asset Planning
- Module Blueprint Library (SUPERSEDED)

Full entries in: /home/user/gcse-revision/.planning/intel/context.md

---

## Cycle Detection

No cycles detected in the cross-reference graph. All cross-refs are informational/provenance links. Max traversal depth 50 not approached.

---

## Conflicts Summary

0 blockers
1 competing variant / warning (font family — Cormorant Garamond vs IBM Plex Serif)
4 auto-resolved (INFO)

Full report: /home/user/gcse-revision/.planning/INGEST-CONFLICTS.md

---

## Status

STATUS: AWAITING USER — one WARNING requires resolution before downstream routing is fully clean.

The WARNING (font family conflict) does not block planning or roadmapping but will affect any work involving TYPE.cinematic or editorial serif moments. The operative authority is CLAUDE.md (IBM Plex Serif) until TYPOGRAPHY_SYSTEM.md and PRODUCT_UI_CONSTITUTION.md are updated.

---

## Intel Files

/home/user/gcse-revision/.planning/intel/decisions.md — 3 decisions (1 LOCKED, 1 active, 1 superseded)
/home/user/gcse-revision/.planning/intel/requirements.md — 2 requirements (from SPEC sources)
/home/user/gcse-revision/.planning/intel/constraints.md — 10 constraints (7 api-contract, 2 protocol, 1 schema)
/home/user/gcse-revision/.planning/intel/context.md — 10 context topics
/home/user/gcse-revision/.planning/intel/SYNTHESIS.md — this file
/home/user/gcse-revision/.planning/INGEST-CONFLICTS.md — conflicts report (0 blockers, 1 warning, 4 info)
