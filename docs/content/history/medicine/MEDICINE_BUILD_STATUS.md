# Medicine Through Time — Episode Build Status

Source of truth for each episode's build and registry state.
Update this file whenever an episode is built, extracted, or expanded.

**Authorities:**
- `src/modules.js` — episode sequence, id, number, screenCount
- `src/content/history/medicine/episodes/` — extracted episode files
- `src/content/history/medicine/index.js` — MEDICINE_EPISODES series array
- `src/modules/history.js` — inline built episodes (not yet extracted)

**Build status definitions:**
- `built` — screenCount > 1, full content exists
- `stub` — screenCount 1, placeholder content only; needs expansion
- `unbuilt` — screenCount 0, no content exists anywhere

**Registry status definitions:**
- `extracted` — episode file exists in `episodes/`, imported in `index.js`
- `inline` — full content lives in `src/modules/history.js`; not yet extracted
- `not built` — no content in history.js or episodes/

---

| # | Title | ID | Build status | Registry status | Notes / next action |
|---|-------|----|--------------|-----------------|---------------------|
| 1 | Trust me, I'm following Jupiter | `history-medicine-medieval-beliefs-causes` | built (32 screens) | extracted | ✓ Complete |
| 2 | The day everything changed | `history-medicine-black-death` | built (27 screens) | extracted | ✓ Complete |
| 3 | The beginning of doubt | `mod2` | built (16 screens) | inline | ID needs migration to slug pattern before extraction |
| 4 | The man who proved everyone wrong | `mod3` | built (11 screens) | inline | ID needs migration to slug pattern before extraction |
| 5 | London's year of terror | `history-medicine-great-plague` | **unbuilt** | not built | screenCount 0; build from scratch |
| 6 | The boy, the cow and the cure | `history-medicine-jenner-vaccination` | **stub** (1 screen) | extracted | 1-screen placeholder; needs full expansion |
| 7 | The invisible enemy | `history-medicine-germ-theory` | built (10 screens) | extracted | ✓ Complete |
| 8 | The great stink | `mod5` | built (7 screens) | inline | ID needs migration to slug pattern before extraction |
| 9 | The day surgery changed forever | `mod6` | built (10 screens) | inline | ID needs migration to slug pattern before extraction |
| 10 | The lady with the lamp | `history-medicine-nightingale` | **unbuilt** | not built | screenCount 0; build from scratch |
| 11 | The accidental miracle | `mod7` | built (11 screens) | inline | ID needs migration to slug pattern before extraction |
| 12 | When medicine became magic | `mod8` | built (9 screens) | inline | ID needs migration to slug pattern before extraction |
| 13 | Can we beat cancer? | `mod9` | built (11 screens) | inline | ID needs migration to slug pattern before extraction |
| 14 | Hell in the trenches | `history-medicine-western-front` | built (19 screens) | extracted | ✓ Complete |

---

## Summary

| State | Count | Episodes |
|-------|-------|---------|
| Extracted (registry complete) | 5 | 1, 2, 7, 14, 6 (stub) |
| Built, inline (awaiting extraction) | 7 | 3, 4, 8, 9, 11, 12, 13 |
| Unbuilt | 2 | 5, 10 |

## Notes on legacy IDs

Episodes 3, 4, 8, 9, 11, 12, 13 use short legacy IDs (`mod2`, `mod3`, `mod5`–`mod9`).
Before extracting these, their IDs should be migrated to the canonical slug pattern
(`history-medicine-<slug>`) in `src/modules.js`. This is a Workflow C task and requires
updating `screenTags` references in `src/data/tagModuleMap.js` if any exist.
