# Medicine Through Time — Episode Build Status

Source of truth for each episode's build and registry state.
Update this file whenever an episode is built, extracted, or expanded.

**Authorities:**
- `src/modules.js` — episode sequence, id, number, screenCount
- `src/content/history/medicine/episodes/` — episode content files
- `src/content/history/medicine/index.js` — MEDICINE_EPISODES series array
- `src/app/LegacyApp.jsx` — MODULE_CONTENT_LOADERS (one entry per built episode)

**Build status definitions:**
- `built` — screenCount > 1, full content exists
- `stub` — screenCount 1, placeholder content only; needs expansion
- `unbuilt` — screenCount 0, no content exists anywhere

**Registry status definitions:**
- `extracted` — episode file exists in `episodes/`, imported in `index.js`, loader entry in `MODULE_CONTENT_LOADERS`
- `not built` — no content in episodes/

---

| # | Title | ID | Build status | Registry status | Notes / next action |
|---|-------|----|--------------|-----------------|---------------------|
| 1 | Trust me, I'm following Jupiter | `history-medicine-medieval-beliefs-causes` | built (32 screens) | extracted | ✓ Complete |
| 2 | The day everything changed | `history-medicine-black-death` | built (27 screens) | extracted | ✓ Complete |
| 3 | The beginning of doubt | `history-medicine-renaissance-medicine` | built (16 screens) | extracted | ✓ Complete — formerly `mod2`; ID migrated June 2026 |
| 4 | Surgery & anatomy | `history-medicine-surgery-anaesthetics` | built (11 screens) | extracted | ✓ Complete — formerly `mod3`; ID migrated June 2026; metadata corrected |
| 5 | London's year of terror | `history-medicine-great-plague` | **unbuilt** | not built | screenCount 0; build from scratch |
| 6 | The boy, the cow and the cure | `history-medicine-jenner-vaccination` | **stub** (1 screen) | extracted | 1-screen placeholder; needs full expansion |
| 7 | The invisible enemy | `history-medicine-germ-theory` | built (10 screens) | extracted | ✓ Complete |
| 8 | The great stink | `history-medicine-great-stink` | built (7 screens) | extracted | ✓ Complete |
| 9 | The day surgery changed forever | `history-medicine-surgery-revolution` | built (10 screens) | extracted | ✓ Complete — formerly `mod6`; ID migrated June 2026 |
| 10 | The lady with the lamp | `history-medicine-nightingale` | **unbuilt** | not built | screenCount 0; build from scratch |
| 11 | The accidental miracle | `history-medicine-accidental-miracle` | built (11 screens) | extracted | ✓ Complete — formerly `mod7`; ID migrated June 2026 |
| 12 | When medicine became magic | `history-medicine-modern-medicine` | built (9 screens) | extracted | ✓ Complete — formerly `mod8`; ID migrated June 2026; metadata normalised |
| 13 | Can we beat cancer? | `history-medicine-cancer` | built (11 screens) | extracted | ✓ Complete — formerly `mod9`; ID migrated June 2026; metadata normalised |
| 14 | Hell in the trenches | `history-medicine-western-front` | built (19 screens) | extracted | ✓ Complete |

---

## Summary

| State | Count | Episodes |
|-------|-------|---------|
| Extracted (registry complete) | 12 | 1, 2, 3, 4, 6 (stub), 7, 8, 9, 11, 12, 13, 14 |
| Built, inline (awaiting extraction) | 0 | — |
| Unbuilt | 2 | 5, 10 |

## ID migration note

Episodes 3, 4, 9, 11, 12, and 13 previously used short legacy IDs (`mod2`, `mod3`, `mod6`–`mod9`). These were migrated to canonical `history-medicine-<slug>` IDs in June 2026 as part of `refactor: migrate Medicine legacy module IDs`. A one-shot storage migration shim in `src/progress.js` copies old `gcse_module_<legacy>` keys to canonical keys on first load. No legacy IDs remain in runtime source. Episode 4's `src/modules.js` metadata was corrected during extraction from a stale Harvey draft to match the surgery/anaesthetics content. Episodes 12 and 13 had metadata drift corrected (number, title, subtitle) during extraction.
