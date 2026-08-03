# Phase 3 — implementation plan

D1 and D2 are approved (see DECISIONS.md); execution authorised from
`57efba8`. Every commit leaves `pnpm verify`
green; each is independently revertable (`git revert`), which is the rollback
mechanism throughout — no commit depends on an unmerged sibling.

## 0. Files

**Add**
- `src/component-catalogue/pedagogyVocabulary.js` — the nine tags, authored
- `src/component-catalogue/migrations/nonAuthoringPedagogy.js` — sole entry `calculationBreakdown` (D1 approved)
- `scripts/generate-pedagogy-registry.mjs` — generator (`--check` mode like the others)
- `src/data/generated/componentPedagogyRegistry.js` — generated
- `tests/architecture/pedagogy-registry-integrity.test.js` — guard suite
- `scripts/verify-pedagogy-parity.mjs` — parity harness (reads
  `.planning/phase-3-pedagogical-taxonomy/baselines/*.json`; may live in the
  planning dir instead if we prefer scripts/ to stay runtime-relevant — decided
  at commit 4)

**Change**
- `src/component-catalogue/schema.js` — `pedagogy` validation on authoring
  entries (+ the D2 `standard` exemption rule)
- all catalogue records with `authoring` blocks — pedagogy injected (codemod
  from the live flat map, zero hand transcription; D2 values from the decision)
- `src/component-catalogue/migrations/authoringCompatibility.js` — pedagogy on
  the four entries (copied values)
- `src/data/componentFunctions.js` — becomes the thin API (DESIGN.md shape)
- `scripts/generate-component-catalogue.mjs` — render pedagogy in Authoring
  blocks + appendix column; rewrite the two stale authority lines (79, 93-95)
- `docs/components/COMPONENT_REGISTRY.md` — regenerated
- `package.json` — `pedagogy:generate` / `pedagogy:check`; `verify` gains
  `pedagogy:check` after `authoring:check`
- `CLAUDE.md`, `docs/system/00_SYSTEM_INDEX.md`,
  `.claude/skills/content-review/SKILL.md` — authority wording
- `tests/architecture/component-catalogue-integrity.test.js` — only if the
  no-import guard needs the new generated file named explicitly (expected: no,
  the sweep is derived)

**Delete** — nothing (no file removals in this phase)

**Never touched** (parity-critical): `src/data/contentQualityChecks.js`,
`tests/architecture/content-quality.test.js`,
`tests/fixtures/content-quality-known-debt.js`,
`src/dev/componentReview/**`, all chapter content, `screenRegistry.js`,
`componentAuthoringRegistry.js`.

## 1. Commit sequence (atomic)

1. **Vocabulary + schema** — add `pedagogyVocabulary.js`; extend
   `validateAuthoringEntry` with `pedagogy` (required, validated) **behind the
   presence of the key on any entry** — i.e. schema validates pedagogy *when
   present* in this commit, so the catalogue stays green before injection.
   Gates: `pnpm verify`.
2. **Inject pedagogy** — codemod writes `pedagogy` into every authoring entry
   (values read live from the current flat map; D2 values as decided;
   compatibility entries updated the same way; `nonAuthoringPedagogy.js`
   created per D1). Flip schema to *require* pedagogy in the same commit (the
   catalogue is now fully covered, so required-ness holds). Regenerate the
   component registry (pedagogy rendering lands here too, plus the two
   authority-prose corrections — the human doc must never contradict the
   architecture between commits). Gates: `pnpm verify`; spot-check rendered
   Authoring blocks.
3. **Generator + projection** — add `generate-pedagogy-registry.mjs`, generate
   `componentPedagogyRegistry.js`, wire `pedagogy:generate`/`pedagogy:check`
   into `package.json` + `verify`. `componentFunctions.js` untouched — the
   projection exists but has no consumer yet. This is NOT a mirror: the
   authored source of the values is already the catalogue (commit 2); the old
   flat map is now dead weight awaiting deletion, not a co-authority, and no
   drift test binds the two. Gates: `pnpm verify`; run the taxonomy-parity
   script informally against the projection.
4. **The flip** — rewrite `componentFunctions.js` to the thin API; run both
   parity layers (taxonomy vs `taxonomy-baseline.json` with D1 exceptions
   listed; quality output vs `quality-output-baseline.json`, byte-exact);
   update `CLAUDE.md` / `00_SYSTEM_INDEX.md` / content-review SKILL wording.
   Gates: `pnpm verify` with `content-quality.test.js` **diff-empty**; parity
   scripts green; text-scan test (`chapter-player-private-family`) green.
5. **Guard suite + mutation evidence** — add
   `pedagogy-registry-integrity.test.js`; run the full mutation sequence (§5);
   record results in the commit message. Gates: `pnpm verify`.
6. **Seal** — bundle check (§6), baseline re-verification, census/DECISIONS
   status update in `.planning/`, any generated-prose drift caught late.

## 2. Generation / check commands

```
pnpm catalogue:generate   # human registry (pedagogy rendering from commit 2)
pnpm catalogue:check
pnpm authoring:generate   # unchanged by this phase
pnpm authoring:check
pnpm pedagogy:generate    # new, from commit 3
pnpm pedagogy:check
```

`verify` order: `catalogue:check && authoring:check && pedagogy:check &&
test:architecture && lint && test:unit && test:storybook && build`.

## 3. Test sequence per commit

`pnpm verify` end-to-end (all six gates). Additionally at commit 4: the two
parity scripts, plus `git diff --stat` proof that
`tests/architecture/content-quality.test.js` is untouched.

## 4. Parity checklist (commit 4 exit criteria)

- [ ] `FUNCTION_TAGS` identical, in order
- [ ] every retained type: `functions` identical in order, `interaction` identical
- [ ] `getTypeInfo`/`isPassive`/`isAssessed` outputs identical for every
      retained type; unknown-type behaviour identical (null / false / false)
- [ ] removed keys = exactly the D1-approved list, asserted, no others
- [ ] quality-output-baseline byte-identical for all 60 chapters
- [ ] `content-quality.test.js` passes unmodified
- [ ] collision assertion active: colliding namespace facts deep-equal or the
      generator fails

## 5. Mutation sequence (guard-by-guard)

Method as in Phase 2: apply mutation, run the suite, confirm the *named*
assertion fails (not a neighbour), revert, confirm green. In-memory mutations
(schema guards) need no revert step.

| # | Guard | Mutation | Expected failing assertion | Cleanup |
|---|---|---|---|---|
| 1 | active screen pedagogy | delete `pedagogy` from one screen entry in a copy of the loaded records (in-memory) | schema/guard names the record + entry | none |
| 2 | active block pedagogy | same on a block entry | same | none |
| 3 | derived pedagogy | remove pedagogy from the `misconceptionCheck` derived entry (in-memory) | guard 3 | none |
| 4 | compatibility pedagogy | delete `pedagogy` from one `AUTHORING_COMPATIBILITY` entry (temp edit) | guard 4 + schema | git checkout |
| 5 | no unregistered projection keys | add a fake key to the generated file (temp edit) | guard 5 + `pedagogy:check` (both, independently) | regenerate |
| 6 | namespace separation / divergence | change one side of the `tieredquiz` pair's interaction (temp record edit) | generator divergence assertion (build of projection fails) | git checkout |
| 7 | vocabulary membership | add `'made-up-tag'` to one entry's functions (temp) | guard 7 + schema | git checkout |
| 8 | interaction validity | set `interaction: 'active'` (temp) | guard 8 + schema | git checkout |
| 9 | orphan pedagogy | add pedagogy to a record with `authoring: null` (temp) | schema + guard 9 | git checkout |
| 10 | renderer-owned ownership | move `read`'s entry off the ScreenRenderer record onto another record (temp) | guard 10 (owner mismatch) | git checkout |
| 11 | componentFunctions authors nothing | paste one `{ functions: [...], interaction: ... }` literal into `componentFunctions.js` (temp) | guard 11 | git checkout |
| 12 | projection purity | add an `import` line to the generated file (temp) | guard 12 + `pedagogy:check` | regenerate |
| 13/14 | schema requiredness | in-memory `validateRecord` on mutated real record / compat entry | exact error-string assertions | none |
| 15 | human-registry rendering | delete one rendered Pedagogy line from `COMPONENT_REGISTRY.md` (temp) | guard 15 occurrence count + `catalogue:check` (both, independently) | regenerate |

## 6. Build and bundle checks (seal)

- `pnpm build` before/after flip; assert `componentPedagogyRegistry` content
  appears in the Lab chunk (`ComponentReviewLab-*.js`) or a chunk it loads —
  and does **not** appear in `dist/assets/index-*.js` (learner entry)
- record entry-chunk size before/after (tolerance: no growth beyond noise)
- `pnpm verify` full, final state

## 7. Seal criteria

1. All parity checklist items hold (§4)
2. Guard suite green with all 15 mutations proven (§5)
3. Bundle checks pass (§6)
4. No stale generated prose: registry doc, CLAUDE.md, 00_SYSTEM_INDEX and the
   content-review skill all describe the post-flip authority (the Phase 2
   lesson, applied during the phase rather than after it)
5. `.planning/phase-3-pedagogical-taxonomy/` updated: census marked executed,
   decisions marked resolved, deferred items (D3, D4) restated as open debt

## 8. Explicit exclusions (unchanged from the brief)

No Phase 4 work; no Lab manifest/UI change; no Lab access/location change; no
`contentQualityChecks.js` edit; no classification corrections (D3/D4 deferred);
no content edits; no threshold changes; no A8; no LOCKED-label cleanup; no
Storybook config; no fonts/A13/weak-spot/TopicPracticeMode; no unrelated
cleanup.
