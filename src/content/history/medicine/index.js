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

import episode01 from './episodes/episode-01-medieval-beliefs-causes.js'
import episode02 from './episodes/episode-02-black-death.js'
import episode03 from './episodes/episode-03-renaissance-medicine.js'
import episode04 from './episodes/episode-04-surgery-anaesthetics.js'
import episode06 from './episodes/episode-06-jenner-vaccination.js'
import episode07 from './episodes/episode-07-germ-theory.js'
import episode08 from './episodes/episode-08-great-stink.js'
import episode09 from './episodes/episode-09-surgery-revolution.js'
import episode11 from './episodes/episode-11-accidental-miracle.js'
import episode14 from './episodes/episode-14-western-front.js'

// Ordered registry — add future episodes here as they are extracted.
export const MEDICINE_EPISODES = [
  episode01,
  episode02,
  episode03,
  episode04,
  // episode05: history-medicine-great-plague — unbuilt (screenCount 0), add when built
  episode06,
  episode07,
  episode08,
  episode09,
  // episode10: history-medicine-nightingale — unbuilt (screenCount 0), add when built
  episode11,
  // episode12–13: legacy IDs (mod8, mod9) — migrate ID before extraction
  episode14,
]
