# Synthesized Context

Running notes extracted from all DOC-type classifications, keyed by topic with source attribution.

---

## TOPIC: Product Identity and Design Philosophy

source: /home/user/gcse-revision/docs/system/PRODUCT_UI_CONSTITUTION.md
source: /home/user/gcse-revision/docs/system/GENERAL_APP_UI_CONSTITUTION.md

This is a premium cinematic learning platform — not a school VLE, not a Duolingo clone, not a productivity app. The experience should feel like something a smart 15-year-old would choose to open, not something they are forced to use. Reference points: Apple TV, Spotify, Netflix. Not DuoLingo, Google Classroom, BBC Bitesize.

Design Priority Order: (1) Calm, legible, dark — (2) Premium and intentional — (3) Functional and clear — (4) Subtly engaging (micro-animations only).

What this product is NOT: not gamified reward system, not productivity dashboard, not cartoon edtech, not corporate learning portal. No mascots, no confetti, no pastel buttons, no "Amazing! You're a superstar!" copy.

Global Layout Law: max width 420px horizontally centred; side padding 24px (SPACING.standard); single scrollable vertical column; mobile-first portrait; always account for safe area insets.

Global Colour Tokens: bg-primary #08090D, bg-secondary #101218, bg-card #151720, bg-elevated #1B1E27; text-primary #F5F7FF, text-secondary #A89FC2, text-muted #5E5874; accent-teal #65E6C6, correct #4CAF7D, incorrect #E05A52, weak-zone #E0A84F.

Non-subject pages colour palette: teal #2A9D8F (progress, active states), darkTeal #264653 (surfaces, navigation), softWhite #F1FAEE (primary text), slate #A8B0B3 (secondary text), coral #E76F51 (streaks/highlights — rare accent only).

Teen-at-9pm Test: if a tired, distracted 15-year-old opened this at 9pm, would they know what to do next in three seconds? If not, reduce the screen.

Final Build Principle: would a smart 15-year-old voluntarily open this on their phone after school? If "maybe if they had to" — more work needed. Target: feels like it belongs in the App Store next to Spotify.

One-Screen Rule: one primary learning job, one dominant visual/idea/question/decision, one clear next action, one quiet local progress signal.

Cinematic Learning Screen Treatment: every screen should feel like a focused scene, not a dashboard. Cards feel like premium learning artefacts — dark charcoal surface, subtle subject-tinted border at low opacity, generous internal padding, one clear hierarchy, restrained accent use. Progressive disclosure — never show all explanation at once.

Subject accent use as signal, not decoration: use for selected state, active local progress, primary action, section label, meaningful emphasis, feedback state. Not for every border, every icon, every heading, every card, decorative glow.

Local progress (in-component): use SequenceProgress only. Dots or sash. No visible numbers, percentages, "2/5", "Step 3", or one-off implementations.

What Claude must never improvise: no new colour palettes, no new fonts, no playful/childish styling, no new layout patterns, no decorative gradients, no unsanctioned motion, no auto-invented component variants.

---

## TOPIC: Component Registry and Lock Status

source: /home/user/gcse-revision/docs/components/COMPONENT_REGISTRY.md
source: /home/user/gcse-revision/docs/components/LOCKED_COMPONENTS.md

The component registry is the single source of truth for all components in src/components/. Check it before building anything new.

LOCKED components (internals must not change without explicit sign-off):
- AnswerInteraction: universal answer UI (choice, connection, true/false). All answer logic. No changes to answer state logic, reveal timing, answer types, or API.
- BackButton: only back-navigation button. 40×40, rgba(255,255,255,0.05) fill, 1px border rgba(255,255,255,0.03), RADII.pill, left chevron, no label, opacity 0.6 on hover/press.
- CardContainer: atmospheric content surface wrapper. No changes to visual appearance, glow, or background image treatment.
- CinematicContinueCTA: only Cinematic Reveal CTA. "Continue →" text, fixed bottom, crm-fade/crm-pulse animation, always calls e.stopPropagation() before invoking handler.
- ContinueCTA: only Primary Progression CTA. 56px, RADII.large, solid accent fill, #0D0F14 text, "Continue" label. No inline "Continue" button implementations allowed anywhere.
- ExitButton: only exit-navigation button. 44×44, near-invisible "X" icon (opacity 0.22), opacity 0.6 + scale 0.90 on press.
- LearningProgressHeader: progress rail and jump sheet (display only). Only progress-bar implementation allowed for module screens.
- ModuleToolbar: back + exit navigation only. Delegates to BackButton and ExitButton. Both buttons migrated on 2026-06-12 and 2026-06-15 respectively.
- RetrievalFrame: cinematic wrapper for retrieval questions. Delegates to AnswerInteraction. No layout changes, no answer logic, no change to cinematic framing.
- SequenceProgress: local sequence progress (dots or sash). Never renders numbers, labels, counters, percentages, or "x of y". No one-off ProgressDots implementations anywhere.

Modification protocol for locked components: document the change, document why, document risk to dependents, get explicit sign-off, test all dependents.

Component locations: src/components/core/ (primitive UI), src/components/learning/ (cinematic learning screens, interaction blocks), src/components/layout/ (shells, wrappers, structural composition), src/components/feedback/ (answer states, recovery, assessment). No .jsx files directly in src/.

---

## TOPIC: Component Authoring Rules

source: /home/user/gcse-revision/docs/system/COMPONENT_AUTHORING_RULES.md

Required system imports for all new components: SPACING, SUBJECTS, RADII, BUTTONS, MOTION, TYPE from shared constants. Never hardcode spacing (magic numbers), border radii, motion timing, typography values, or subject colours.

Component creation checklist: check COMPONENT_REGISTRY.md first; distinct justified learning beat; uses all token types; mobile-first portrait; one clear focal purpose; no dashboard density; emotionally coherent with product.

No redesign during refactor: token migration, import cleanup, spacing standardisation, theme centralisation, and architecture cleanup are allowed. Changing layouts, redesigning interactions, adding features, altering visual hierarchy, and changing pacing are not allowed.

Build verification after any architectural change: ./node_modules/.bin/vite build must pass with 0 errors; verify all imports resolve; verify no console errors.

Safe migration workflow: create shared system token → migrate one safe modern component → verify build → continue gradually. Never mass-migrate all components in one pass.

Anti-vibe-code rules: never overuse glow effects, over-round with pill radius, create glassmorphism panels, stack multiple chunky cards, add decorative icons constantly, use excessive gradients, overcrowd screens, create dashboard grids, or use hyperactive animations.

---

## TOPIC: System Index and Authority Order

source: /home/user/gcse-revision/docs/system/00_SYSTEM_INDEX.md

Order of authority for design and development decisions:
1. PRODUCT_UI_CONSTITUTION.md — supreme design law; all decisions trace back here
1b. GENERAL_APP_UI_CONSTITUTION.md — non-subject pages
1c. HISTORY_MODULE_ARCHITECTURE.md and SCIENCE_MODULE_BLUEPRINT.md — locked module structure for History and Science; load on demand
2. COMPONENT_AUTHORING_RULES.md — mandatory before touching any component file
3. Foundation Systems (all locked): SPACING_SYSTEM, SUBJECT_THEME_SYSTEM, BUTTON_RADII_SYSTEM, MOTION_SYSTEM, TYPOGRAPHY_SYSTEM, SCREEN_SHELL_SYSTEM
4. COMPONENT_REGISTRY.md — check before building anything new
5. docs/components/ — per-component specs

For how work is approached (pipeline selection, planning, review, verification): see DEVELOPMENT_WORKFLOW.md.

Pre-change checklist: (1) Philosophy — PRODUCT_UI_CONSTITUTION.md? (2) Rules — COMPONENT_AUTHORING_RULES.md? (3) Tokens — Foundation System doc? (4) Existing components — COMPONENT_REGISTRY.md? (5) Locked components — LOCKED_COMPONENTS.md?

When in doubt: go simpler, darker, calmer, and less decorated.

---

## TOPIC: Development Workflow — Operational Rules

source: /home/user/gcse-revision/docs/system/DEVELOPMENT_WORKFLOW.md
source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-12-development-workflow-design.md (rationale)

Three named pipelines: Minor Edit, Standard Change Pipeline, Big Build Pipeline.

Session continuity rule: context compaction and "resume directly" instructions do not skip any pipeline step. Name the pipeline before starting any work.

Reuse before create (non-negotiable): search COMPONENT_REGISTRY.md and docs/system/ for existing solutions before creating anything new.

Debugging discipline: form a hypothesis, gather evidence, confirm root cause before changing code. No speculative fixes.

Decision capture rule: whenever implementation introduces a new reusable component, architectural pattern, design rule, workflow rule, or educational pattern — explicitly decide if it is part of the permanent system. If yes, update canonical docs. If no, treat as local implementation detail only.

Branching policy: all work commits directly to main, pushed immediately. No feature branches or PRs unless explicitly requested. GSD git.branching_strategy: "none".

CI pipeline (.github/workflows/ci.yml): two jobs on every push/PR to main. `verify` runs `pnpm install --frozen-lockfile`, then `pnpm lint`, `pnpm test:architecture`, `pnpm test:unit`, `pnpm test:storybook` (Playwright/Chromium), and `pnpm build` — mirrors the local `pnpm verify` command. `firestore-rules` runs `pnpm test:rules` against the Firestore emulator (no live Firebase, no production credentials). Run `pnpm verify` locally before pushing.

Context Loading Policy: load CLAUDE.md, DEVELOPMENT_WORKFLOW.md, directly relevant canonical docs, and files being modified. Do not read large documentation trees unless required by the pipeline.

---

## TOPIC: Learning Experience Philosophy

source: /home/user/gcse-revision/docs/system/LEARNING_EXPERIENCE_PRINCIPLES.md

RISE should not feel like studying. It should feel like becoming fascinated by something.

Core principles (in priority order when choosing between technically correct options):
- Curiosity over explanation: open with question or tension before the answer
- Respect over entertainment: assume curiosity and intelligence; never patronise or use gimmicks
- Discovery over exposition: let learner arrive at the idea themselves where possible
- Stories over abstractions: person, decision, consequence — how people remember things
- Memorable moments over information density: every chapter should contain at least one genuine "I didn't know that"
- Investigation over instruction: predict, compare, sort, diagnose rather than be told
- Decisions over descriptions: "what would you do?" engages differently than describing what was done
- Understanding over memorisation: build toward the why, not just the what
- Confidence over completion: design for feeling capable, not just reaching the end
- Clarity over simplification: strip friction, not intellectual depth
- Genuine interaction over decorative interaction: every tap should change what the learner knows or believes
- One unforgettable insight over ten forgettable facts: protect the moment that will stick
- Emotional significance over visual spectacle: stakes and consequence do more for memory than polish
- Quality of attention over quantity of content: slow down when in doubt

When faced with two technically correct designs, choose the one a learner is most likely to remember a year later.

---

## TOPIC: Teaching Voice and Content Authoring

source: /home/user/gcse-revision/docs/system/TEACHING_VOICE_GUIDE.md

Every word costs attention. Every sentence must earn its place. Write to communicate, never to impress.

Reading level: approximately age 11-13. Short sentences and paragraphs. One idea at a time. Explain difficult vocabulary immediately. Never simplify by becoming inaccurate.

Emotional tone: warm, curious, intelligent, calmly confident. Never patronising, cheesy, over-excited, or marketing-copy-like.

Historical accuracy: never portray historical people as stupid. Explain why beliefs made sense at the time. Focus on available evidence, not hindsight.

Curiosity: create questions before answers. Reward curiosity quickly. Every chapter should contain at least one unforgettable insight.

Avoid AI-style writing: no unnecessary em dashes, no "It's not X, it's Y" rhetoric, no "This serves as a powerful reminder", no "This highlights the importance of", no "It's worth noting that", no "Interestingly", no "As we can see", no "Let's dive in", no "Imagine you're", no fake significance, no floral language, no motivational filler.

AI smell check before shipping content: remove filler, flourish, inflated vocabulary, and sentences that exist only to sound impressive. Ask: would an outstanding human teacher naturally say this?

Ultimate objective: don't tell students what to think. Give them enough understanding that they can't help thinking it.

---

## TOPIC: Science Module Blueprint (LOCKED)

source: /home/user/gcse-revision/docs/system/SCIENCE_MODULE_BLUEPRINT.md

Note: classified as DOC but content is a locked protocol spec; substantive constraints extracted to constraints.md under CON-08. This entry records the broader educational context.

Science should be visual, practical, real-world, exam-aware, precise with vocabulary, and built around systems not isolated facts. Student should repeatedly experience: Situation → Prediction → Investigation → Explanation → Application → Exam response.

Subject playbooks (tone, examples, imagery — do not replace the blueprint):
- Biology: feel alive, microscopic and system-based. Hooks: illness, exercise, plants growing, cells, survival. Common exam traps: all plant cells have chloroplasts; confusing respiration and breathing; mitochondria make energy; confusing diffusion/osmosis/active transport; vague organelle functions; not using data.
- Chemistry: feel like hidden transformations. Hooks: rusting, burning, batteries, explosions, cooking, metals reacting. Common exam traps: confusing atoms and ions, forgetting charges, vague observations, not balancing equations, not linking reactivity to electron loss/gain.
- Physics: feel like solving how the universe behaves. Hooks: phones charging, rollercoasters, cars braking, electricity, space, radiation. Common exam traps: not showing working, wrong units, confusing mass and weight, thinking current is used up, confusing energy stores and transfers, describing graphs without values.

AQA Combined Science rewards: accurate recall, application to unfamiliar examples, diagrams and visual interpretation, practical method knowledge, graph/table interpretation, calculations with working, precise scientific vocabulary.

---

## TOPIC: Visual Asset Planning

source: /home/user/gcse-revision/docs/system/VISUAL_ASSET_SYSTEM.md

Visual assets for RISE must feel like they belong to one considered world. This document governs how assets are planned and reused — it is not a catalogue, prompt library, or style guide.

Image Manifest: before any module is built, produce a manifest listing every visual requirement, organised by category. For each: what is it for, does an existing asset satisfy it, and if genuinely new, what category and quality tier.

Asset categories: Hero (large emotional/cinematic moments, high production value, small quantity), Supporting (environmental scenes, broad reuse), Interactive (hotspot/comparison/investigation images — composition must accommodate the interaction), Functional (diagrams, maps, timelines, textures — clarity over spectacle).

Scene Packs: commission connected sets of assets representing one world/setting rather than isolated images. E.g. Medieval Village Pack, Black Death Pack, Animal Cell Pack, Plant Cell Pack. A pack serves every module touching that world. New chapters should ask "which pack does this belong to?" before "what new image do I need?"

Quality tiers: Tier A (high-impact cinematic — Hero and Scene Pack centrepieces, worth most iteration), Tier B (high-quality reusable educational — Supporting and Interactive, built for repeated use), Tier C (purely functional — diagrams, textures, simple maps; built for clarity and speed).

Reuse philosophy: search first → extend first → generate last. New assets designed to extend an existing Scene Pack where possible. Repetition with new context is acceptable. Avoid near-duplicates.

Learning-first philosophy: an image earns its place by creating curiosity, supporting understanding, improving long-term recall, carrying a Memorable Moment, providing concrete context, or enabling an interaction. An image that only fills space or decorates a screen does not meet this bar.

---

## TOPIC: Module Blueprint Library (SUPERSEDED)

source: /home/user/gcse-revision/docs/04 Learning Architecture/Module-Blueprint-Library.md

Explicitly superseded. Retained for historical reference only. CLAUDE.md (History Module Architecture and Science Module Blueprint) is the current authority for module structure.

Do not use this document for new module builds. Where it conflicts with HISTORY_MODULE_ARCHITECTURE.md or SCIENCE_MODULE_BLUEPRINT.md, the latter documents win.

Opening sequence defined here (ChapterHookScreen → ChapterOutcomeScreen → QuickRecallScreen) differs from History architecture's Section 1 (CinematicRevealMoment/ChapterHookScreen → PriorKnowledgeRecall → WhatYouWillLearn). The Blueprint is superseded — History Architecture wins. See INGEST-CONFLICTS.md [INFO] for auto-resolution note.
