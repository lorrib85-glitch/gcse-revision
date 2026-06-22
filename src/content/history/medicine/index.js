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

import episode03 from './episodes/episode-03-jenner-vaccination.js'

// Ordered registry — add future episodes here as they are extracted.
export const MEDICINE_EPISODES = [
  episode03,
  // episode04, episode05, ... (add as extracted)
]
