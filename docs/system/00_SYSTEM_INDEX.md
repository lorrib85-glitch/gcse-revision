# System Index

**Version:** v1 — Locked Foundation  
**Scope:** All design and development decisions in this codebase

---

## Order of Authority

Consult documents in this order before making any UI change.

---

### 1. Product UI Constitution

`docs/system/PRODUCT_UI_CONSTITUTION.md`

The product's supreme design law. Defines product identity, global colour tokens, layout constraints, typography rules, and the final build standard. **All decisions trace back here.** If it contradicts anything else, the Constitution wins.

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

## Pre-Change Checklist

Before making any UI change, confirm:

1. **Philosophy** — does this respect the product identity in `PRODUCT_UI_CONSTITUTION.md`?
2. **Rules** — does this follow all authoring rules in `COMPONENT_AUTHORING_RULES.md`?
3. **Tokens** — am I using tokens from the relevant Foundation System doc?
4. **Existing components** — does something in `COMPONENT_REGISTRY.md` already cover this?
5. **Locked components** — if touching a locked component, see `LOCKED_COMPONENTS.md` first.

**When in doubt: go simpler, darker, calmer, and less decorated.**
