# Visual Asset System

RISE's visual identity should feel like it belongs to one considered world, not a collection of one-off commissions. This document defines how visual assets — cinematic hero scenes, hotspot and comparison backgrounds, microscopy and macroscopic views, maps, timelines, diagrams, textures, silhouettes, overlays, and atmospheric backgrounds — are planned, organised and reused across modules.

This is not an asset catalogue, a prompt library, a style guide, a branding document, an AI image generation guide, or an implementation specification. It exists so imagery is planned deliberately before a module is built, not generated ad hoc as the build progresses.

The objective is not to maximise the number of images. It is to maximise educational value, emotional impact, consistency, reusability and production speed. Handled well, the visual library becomes a long-term strategic asset — a growing world every module draws from and adds to — rather than an ever-expanding pile of disconnected pictures.

---

## Core principles

- **Plan before you build.** Visual requirements for a module are identified up front, not discovered screen by screen during implementation.
- **Create libraries, not assets.** Every visual should be considered a long-term reusable building block. A commission that only ever serves one screen is a missed opportunity; the same commission, designed to belong to a recognisable world, can serve a dozen.
- **Search first, reuse first, extend first.** A new asset is the last option, not the first — checked against the existing library and Scene Packs before anything new is commissioned.
- **Coherence over variety.** A consistent visual language across modules reads as higher quality than a wider range of styles. Repeated use of a strong visual world is a feature, not a flaw.
- **Hero imagery deserves disproportionate effort.** The handful of images that carry a module's emotional weight earn the most care, iteration and review.
- **Functional imagery should be deliberately simple.** Diagrams, maps and explanatory visuals exist to be understood at a glance — clarity beats spectacle here.
- **Every image earns its place.** If it doesn't support learning, it shouldn't be there.

---

## The Image Manifest

Before a module is built, produce an Image Manifest: a short planning list of every visual requirement for that module, organised by category, before any image generation takes place.

For each requirement, the manifest should answer:

- What is this image for, and which screen or interaction needs it?
- Does an existing asset, or an existing Scene Pack, already satisfy this — fully, or with minor adaptation?
- If genuinely new, what category and quality tier does it belong to?

The manifest isn't a deliverable the learner ever sees. Its value is forcing the reuse-vs-new decision to happen once, deliberately, before production starts — instead of repeatedly and inconsistently during the build.

**Concrete format:** the manifest lives at `docs/content/<subject>/<series>/<NN>_visual-assets.md`, one row per reserved slot (Screen · Kind · Aspect · Category · Brief). Each row corresponds to a `MediaPlaceholder` in the built episode — the AI reserves the slot, the author supplies the asset. See `docs/system/component-contracts/media-placeholder.md` for the format and the reconciliation rule.

---

## Asset categories

**Hero** — Large emotional or cinematic moments that define a module's atmosphere and carry its Memorable Moment. High production value, small in quantity, and the place that disproportionate effort belongs.

**Supporting** — Environmental scenes, locations, objects, people and contextual imagery. Good quality, but chosen and built for broad reuse across topics and modules rather than a single appearance.

**Interactive** — Images built specifically for hotspot exploration, comparison, investigation or similar interaction-led moments. Composition must accommodate the interaction itself — clear regions, readable detail where learners will tap or compare.

**Functional** — Diagrams, maps, timelines, textures, silhouettes and other explanatory visuals. These prioritise clarity and legibility over spectacle.

---

## Scene Packs

Rather than commissioning isolated images, plan in terms of Scene Packs: a connected set of assets representing one world, setting or recurring environment, spanning multiple categories above.

A pack might combine a Hero establishing shot, several Supporting environment and character variations, an Interactive comparison or hotspot background, and Functional diagrams or overlays — all sharing the same setting, lighting and visual language.

Illustrative examples of the kind of pack worth building:

- Medieval Village Pack
- Black Death Pack
- Monastery Pack
- Roman Britain Pack
- Renaissance Workshop Pack
- Animal Cell Pack
- Plant Cell Pack

A pack is built once and drawn on by every module that touches that world or topic. A new chapter on a related theme should ask "which pack does this belong to?" before "what new image do I need?" Over time, the goal is a small number of rich, well-established packs rather than many thin, one-off sets.

---

## Metadata

Keep per-asset metadata lightweight — enough to find and reuse an asset later, not a database:

- **ID** — unique reference
- **Title** — short descriptive name
- **Subject / topic** — curriculum area it belongs to
- **Tags** — free-form keywords for searchability
- **Intended use** — category (Hero / Supporting / Interactive / Functional) and the kind of screen it was made for
- **Reusable contexts** — other subjects, topics or modules where it could plausibly be reused
- **Scene Pack** — which pack, if any, it belongs to
- **Quality tier** — see below

---

## Quality tiers

Tiers describe production priority, not artistic judgement:

- **Tier A** — High-impact cinematic assets: Hero imagery and Scene Pack centrepieces. Worth the most iteration.
- **Tier B** — High-quality reusable educational imagery: Supporting and Interactive assets built for repeated use.
- **Tier C** — Purely functional supporting assets: diagrams, textures, simple maps. Built for clarity and speed, not spectacle.

A module's manifest should be weighted toward B and C, with A reserved for the moments that genuinely carry the module's emotional or conceptual weight.

---

## Reuse philosophy

- **Search first.** Before describing a new asset, check whether the library or an existing Scene Pack already covers the need.
- **Extend first.** If nothing matches exactly, consider whether an existing asset can be adapted or recombined before commissioning something new.
- **Generate last.** New assets are commissioned only once reuse and extension are ruled out — and, where possible, designed to extend an existing Scene Pack rather than stand alone.
- **Consistency compounds.** Reusing a strong visual language makes every subsequent module feel more considered, not less original.
- **Repetition with new context is acceptable.** The same Black Death street scene can anchor a module on causes, one on treatments, and one on social impact — the educational framing changes even when the image doesn't.
- **Avoid near-duplicates.** Two images that differ only in prompt wording but serve the same purpose fragment the library without adding value.

---

## Learning-first philosophy

A visual asset earns its place by doing one or more of the following:

- creating curiosity before the content explains itself
- supporting understanding of a concept, process or relationship
- improving long-term recall
- carrying or reinforcing a Memorable Moment
- providing context that makes abstract content concrete
- enabling an interaction — hotspot, comparison, sort — that wouldn't work without it

An image that exists only to fill space, break up text, or decorate a screen does not meet this bar, however well it's made.

---

## Relationship to other documents

This document governs *how visual assets are planned and reused*. It does not duplicate:

- **`CLAUDE.md`** — overall project structure and component architecture
- **`BRAND.md`** — colour, typography, spacing and component reference
- **`docs/system/PRODUCT_UI_CONSTITUTION.md`** and **`GENERAL_APP_UI_CONSTITUTION.md`** — UI layout and design law
- **`docs/system/SUBJECT_THEME_SYSTEM.md`** — subject colour palettes
- **`docs/system/LEARNING_EXPERIENCE_PRINCIPLES.md`** — creative and educational philosophy for content decisions

Where those documents already answer a question, this one points to them rather than repeating them.

---

A module build should begin with an Image Manifest — what's needed, what already exists, what extends an existing Scene Pack, and what, if anything, is genuinely new.
