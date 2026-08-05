# Subject-browser navigation configuration

This directory contains **build-time application navigation configuration**.
It is a sibling of `records/` and `compatibility/`, and neither of them.

- It is **not curriculum**. The six curriculum entity types remain Board,
  Subject, Specification, Study pathway, Module and Chapter.
- It is **not runtime compatibility data**. It outlives the Stage 6 deletion of
  `compatibility/runtime-v1.js`.
- It is **never imported by production source**. Only
  `scripts/generate-curriculum-navigation.mjs` reads it; production will read
  the generated projection after Stage 5B.

## What a Browser Entry owns

A Browser Entry owns one learner-facing destination: its order, label, browser
copy, hero image, configured pathways, represented canonical subjects, optional
sections/tabs and card presentation mode.

It may name canonical pathway and module IDs. It never owns the pathway → module
or module → chapter relationship; those are read from curriculum records.

The three card modes are:

- `chapter` — cards come from configured modules' ordered `chapterRefs`;
- `module` — one coming-soon card per configured module;
- `none` — no fake card; the entry carries a subject-level coming-soon state.

A top-level `moduleIds` list may reorder exactly the module set reached by the
configured pathways for a no-tab entry. It cannot add, omit or invent a module.
Sections perform the same navigation-order job for tabbed entries.

## Temporary parity overrides

`displayNumberOverrides` and `cardLabelOverrides` preserve visible facts that
cannot be derived without changing today's browser. Every override states what
it preserves and the decision that deletes it. An override that equals the
derived default fails generation: temporary tables must shrink rather than
becoming a second authority.

## Commands

```bash
pnpm curriculum:navigation:generate
pnpm curriculum:navigation:check
```

Stage 5A keeps `src/data/generated/curriculum/navigation.js` inert and imported
by nothing. Stage 5B is the separate learner-visible authority switch.
