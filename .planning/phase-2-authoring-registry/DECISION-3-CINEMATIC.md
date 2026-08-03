# Decision 3 — `visualNarrative`, `cinematicReveal`, `video`

Split into two independent questions as directed. **No implementation.**

Your correction of my premise was right, and the evidence changes the framing
more than expected: `cinematicReveal` and `video` are **not aliases of
`cinematic` at all**. They are not, and have never been, a route to
`CinematicRevealMoment`.

---

## Part 1 — where these three names actually come from

Before the registry existed, `src/app/chapterNavigation.js` carried a single
hardcoded predicate (introduced in `e4fae6e`, the ChapterPlayer runtime commit):

```js
// Header appears on all learning pages.
// It is hidden only for full-screen cinematic/video moments where overlay UI
// would reduce immersion.
export function isFullScreenVideoScreen(screen) {
  return screen?.type === 'cinematic'
      || screen?.type === 'cinematicReveal'
      || screen?.type === 'video'
}
```

`56192ff` ("Govern chapter screens through a single registry") replaced that
predicate with a derived one — `isCinematicHeaderScreen()`, reading
`headerMode: 'cinematic'` from the registry. To keep the boolean returning the
same three answers, `cinematicReveal` and `video` were given registry entries
carrying `headerMode: 'cinematic'`.

They needed a `component` string and a `layout`, and neither had a real
implementation, so both were filled in as `'ScreenContentRenderer'` /
`'content'`.

**These two entries exist to preserve one boolean.** They were never rendering
paths, never had a component, and never appeared in authored content.

---

## Part 2 — the pedagogical / data-shape comparison you asked for

| | `cinematic` | `cinematicReveal` | `video` |
|---|---|---|---|
| Component | `CinematicRevealMoment` | `ScreenContentRenderer` | `ScreenContentRenderer` |
| Layout | `full` | **`content`** | **`content`** |
| Required data | `videoSrc` **or** `fallbackImage` | **none declared** | **none declared** |
| Implied data shape | media + `year`, `label`, `headline`, `body`, `paragraphs` | a `blocks` array | a `blocks` array |
| Continuation | `component` (owns its own CTA) | `player` | `player` |
| `headerMode` | `cinematic` | `cinematic` | `cinematic` |
| Renderer branch | `ScreenRenderer.jsx:1186` | **none** | **none** |
| Authored uses | 1 | 0 | 0 |

**Answer to the question as posed: no — there is no pedagogical or data-shape
benefit in retaining them as separate active aliases, because they do not share
`cinematic`'s data shape and never rendered its component.** Their only declared
data shape is `blocks`, which is exactly what the `standard` type already
provides. The single distinguishing fact is `headerMode`, and that fact is
broken (Part 3).

`CinematicRevealMoment` already supports **both** media routes in one component
— `videoSrc` with `fallbackImage`, plus automatic fallback on `reduceMotion` or
video error (`CinematicRevealMoment.jsx:224–246`). The full-screen cinematic
image-or-video capability is genuinely complete under one authoring type. There
is no second capability sitting in the other two names waiting to be preserved.

---

## Part 3 — the latent bug, which settles it

`cinematicReveal` and `video` combine `headerMode: 'cinematic'` with
`layout: 'content'`. That combination cannot work:

1. `ChapterPlayer.jsx:174` — `headerVisible = … && (isFullScreenVideoScreen(cur) ? cinematicHeaderVisible : true)`
2. `ChapterPlayer.jsx:88` — `cinematicHeaderVisible` resets to `false` on every navigation
3. It is set `true` in exactly one place: `ScreenRenderer.jsx:1200`, the
   `onTextRevealStart` callback passed **only** by the `cinematic` branch
4. But `layout: 'content'` returns at `ScreenRenderer.jsx:793` — plain
   `ScreenContentRenderer`, which never fires that callback

⇒ A `cinematicReveal` or `video` screen renders as an ordinary content screen
with the learning header **permanently hidden** — no progress, no back, no exit
— with no way to restore it.

This is the same class of defect as `choiceReveal`'s double CTA: masked only by
zero authored usage. Retaining them as "active aliases" would mean promoting two
entries that misrender the moment anyone uses them.

---

## Part 4 — recommendation for `cinematicReveal` and `video`

**Your option A, confirmed — with one wording correction.**

Retire `cinematicReveal` and `video`. Keep `cinematic` active and full-screen;
keep `CinematicRevealMoment` and its image/video capability untouched.

The correction: I would not describe this as *consolidation into `cinematic`*,
because nothing merges — there is no behaviour in the retired names to absorb.
It is **removal of two placeholder entries that only ever encoded a header
boolean**. The full-screen cinematic moment already lives entirely in
`cinematic`, and this phase does not change it in any way.

Nothing to redirect: `cinematicReveal` and `type: 'video'` appear in **no**
authoring guidance, content template, skill, gold register entry or content
architecture doc. The only non-source references anywhere are the registry
entry, the `FULL_SCREEN_RENDERER_TYPES`-adjacent metadata, and three unit-test
assertions.

**If the underlying want is real, it is a different feature.** "Cinematic
framing on a screen that then shows content blocks" is a coherent product idea
and is *not* what these entries deliver. If you want it, it should be designed
as a new authoring type with a real composition, not preserved by keeping two
broken names alive.

**Live consumers to update (test-only, no content):**
`tests/unit/app/chapterNavigation.test.js:146,150` assert
`isFullScreenVideoScreen({ type: 'cinematicReveal' })` and `{ type: 'video' }`
are `true`. Those two assertions get replaced by a guard proving the retired
types are unregistered and unroutable. Line 142 (`type: 'cinematic'` → `true`)
stays exactly as it is.

---

## Part 5 — `visualNarrative`, taken separately

This one is **not as clean as I implied, and I do not think it should be
bundled with the other two either.** New evidence:

**Zero authored uses is confirmed**, and the reason is that the migration
already happened: `GOLD_SCREEN_REGISTER.md:370` records the Medicine Episode 3
screen 6 as "`timelineChain` reveal variant — 6 (migrated from
`visualNarrative`)", render-verified 2026-07-22.
(`docs/content/history/Medicine/03_The_Beginning_of_Doubt_Architecture.md:14`
still lists `visualNarrative` at screen 6 — that doc is stale and postdated by
the gold register.)

**But the `visualNarrative` screen type is the sole runtime entry point into
`visualNarrativeCompat.js`.** `ScreenRenderer.jsx:29` imports
`visualNarrativeToRevealChain`, and the only call site is the `visualNarrative`
branch at line 1052. So:

- You asked to remove the type *without touching `visualNarrativeCompat.js`*.
  That is literally possible — the file need not be edited — but its only
  production consumer disappears, leaving it reachable only from
  `tests/unit/timelineChainReveal.test.js`.
- **CLAUDE.md and the `TimelineChain` catalogue record both state that legacy
  `type: 'visualNarrative'` lesson data "is supported only through
  `src/data/visualNarrativeCompat.js`".** Removing the screen type removes that
  support. That is a constitutional claim in two governed surfaces, so it is
  your call, not mine, and it is a different question from the two placeholder
  entries above.

Three coherent positions:

| | What it means | Cost |
|---|---|---|
| **(i) Keep `visualNarrative` as a compatibility entry** | It moves into `authoringCompatibility.js` with `currentHandler: visualNarrativeToRevealChain` and a `removalCondition`. Honours the CLAUDE.md support claim. | It has zero live references, so the staleness guard (§5.5) would fail it on day one — the guard needs an explicit, reasoned exemption for a *data-shape* compatibility entry as opposed to an *authored-type* one |
| **(ii) Retire the type and the mapper together** | Delete the branch, the import, the mapper and its unit test; amend the CLAUDE.md and `TimelineChain` record wording to say the migration is complete rather than that the data shape is still supported | Honest and smallest, but changes a constitutional statement, and does touch `visualNarrativeCompat.js` — outside what you authorised |
| **(iii) Defer `visualNarrative` entirely to a later phase** | Leave the entry exactly as it is — legacy, routed, capped at 0 by `allowedLegacyMaximums`. Phase 2 projects it unchanged | Costs nothing, keeps Phase 2 to placeholder removal only, and keeps a genuine constitutional question out of a mechanical authority flip |

**My recommendation is (iii).** The `visualNarrative` entry is not a stale
metadata defect like the other two — it is a *working, routed compatibility
path* that a governed document says should exist. Phase 2's job is to move
authority, not to settle whether a documented compatibility guarantee should be
withdrawn. It projects cleanly as-is, and the existing cap already prevents
growth.

If you would rather settle it now, **(ii)** is the honest version and **(i)**
is the version that keeps the guarantee, but (i) needs the staleness guard to
carve out a reasoned exemption — which weakens the guard slightly for one entry.

---

## Summary of what I am asking for

| | Question | Recommendation |
|---|---|---|
| **3a** | `cinematicReveal` + `video` | **Retire both** (your option A, confirmed — but as removal of placeholders, not consolidation of behaviour) |
| **3b** | `visualNarrative` | **Defer to a later phase (iii)** — project unchanged in Phase 2 |

Decisions 1 and 2 are settled and recorded; implementation still waits on 3a
and 3b.
