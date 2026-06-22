// Medicine Through Time — series content registry.
//
// MEDICINE_EPISODES is the ordered list of all episodes in this series.
// src/modules/history.js re-exports this as HISTORY_MODULES for the app loader.
//
// To add a new episode:
//   1. Create src/content/history/medicine/episodes/episode-NN-<slug>.js
//   2. Import and append it to MEDICINE_EPISODES below (maintain number order)
//   3. Add a matching metadata entry in src/modules.js
//   4. Run: vitest run tests/architecture
//
// Episodes not yet migrated to their own file remain inline in src/modules/history.js.

import episode06 from './episodes/episode-06-jenner-vaccination.js'

// Ordered registry — add future episodes here as they are extracted.
export const MEDICINE_EPISODES = [
  episode06,
  // episode01–05, episode07–14 (add as extracted, in number order)
]
