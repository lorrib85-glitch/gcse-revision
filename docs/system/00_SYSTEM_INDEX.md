# System Index

**Version:** v1 — Locked Foundation  
**Scope:** All design and development decisions in this codebase

> **Process note:** This index governs *what* gets built and how it must
> look. For *how work is approached* — pipeline selection, planning, review
> and verification steps — see `docs/system/DEVELOPMENT_WORKFLOW.md`.

---

## Order of Authority

Consult documents in this order before making any UI change.

---

### 1. Product UI Constitution

`docs/system/PRODUCT_UI_CONSTITUTION.md`

The product's supreme design law. Defines product identity, global colour tokens, layout constraints, typography rules, and the final build standard. **All decisions trace back here.** If it contradicts anything else, the Constitution wins.

---

### 1b. General App UI Constitution (Non-Subject Pages)

`docs/system/GENERAL_APP_UI_CONSTITUTION.md`

Governs Home, the Subjects/Modules browser, Progress, Exam landing/navigation, onboarding, and the bottom navigation shell — every screen that is not in-module subject content. Sets the tone for these pages: editorial, restrained, composition over containers, typography-led CTAs, and intelligent personalisation copy. In-module subject content remains governed by the Product UI Constitution and the Subject Theme System.

---

### 1c. Subject Module Architecture (History & Science)

`docs/system/HISTORY_MODULE_ARCHITECTURE.md`
`docs/system/SCIENCE_MODULE_BLUEPRINT.md`

Locked chapter/module structure rules for History and Science (Biology, Chemistry, Physics) content. Loaded on demand — see "Subject Module Architecture" in `CLAUDE.md` for when each applies. Do not build or edit subject module content without reading the relevant file first.

---

### 2. Component Authoring Rules

`docs/system/COMPONENT_AUTHORING_RULES.md`

Mandatory rules for creating, editing, and migrating any component. Required imports, forbidden patterns, no-redesign-during-refactor rule, and locked component protocols. Must be read before touching any component file.

---

### 3. Foundation Systems

Locked constant layers. Every component must import tokens from these files. No local duplication is permitted.

| System | Doc | Source file |
|--------|-----|-------------|
| Spacing | `docs/system/SPACING_SYSTEM.md` | `src/constants/spacing.js` |
| Subject Themes | `docs/system/SUBJECT_THEME_SYSTEM.md` | `src/constants/subjects.js` |
| Buttons & Radii | `docs/system/BUTTON_RADII_SYSTEM.md` | `src/constants/buttons.js` + `src/constants/radii.js` |
| Motion | `docs/system/MOTION_SYSTEM.md` | `src/constants/motion.js` |
| Typography | `docs/system/TYPOGRAPHY_SYSTEM.md` | `src/constants/typography.js` |
| Screen Shells | `docs/system/SCREEN_SHELL_SYSTEM.md` | `src/components/layout/ScreenShell.jsx` + `LearningScreenShell.jsx` |

---

### 4. Component Registry

`docs/components/COMPONENT_REGISTRY.md`

Complete registry of all components: location, purpose, props, lock status, and dependencies. Check here before building anything new.

---

### 5. Individual Component Specs

`docs/components/`

Per-component documentation. Added as components are created or significantly updated.

---

## Archive

`docs/archive/` is searchable history. It contains retired workflow docs,
superseded architecture specs, and one-off fix summaries. The archive is
**not authoritative** — it must never override `docs/system/`, `CLAUDE.md`,
or `docs/components/`. When an archived file conflicts with an active system
doc, the active doc wins. Do not treat archive content as current guidance.

---

## Pre-Change Checklist

Before making any UI change, confirm:

1. **Philosophy** — does this respect the product identity in `PRODUCT_UI_CONSTITUTION.md`?
2. **Rules** — does this follow all authoring rules in `COMPONENT_AUTHORING_RULES.md`?
3. **Tokens** — am I using tokens from the relevant Foundation System doc?
4. **Existing components** — does something in `COMPONENT_REGISTRY.md` already cover this?
5. **Locked components** — if touching a locked component, see `LOCKED_COMPONENTS.md` first.

**When in doubt: go simpler, darker, calmer, and less decorated.**
