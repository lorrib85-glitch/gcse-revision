// ─── History module content — full lesson data for History modules ───────────
// Loaded on demand (dynamic import) by App.jsx when a History module is opened.
// Metadata for browsing/cards lives in src/modules.js — keep that file's entries
// (id, subject, number, title, subtitle, era, icon, color, colorLight, headerImage,
// screenCount, screenTags) in sync if you add/remove a module here.
//
// Medicine episode content now lives in src/content/history/medicine/episodes; this file preserves the legacy HISTORY_MODULES compatibility export.
import episodeMedievalBeliefs from '../content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js'
import episodeBlackDeath from '../content/history/medicine/episodes/episode-02-black-death.js'
import episodeRenaissanceMedicine from '../content/history/medicine/episodes/episode-03-renaissance-medicine.js'
import episodeSurgeryAnaesthetics from '../content/history/medicine/episodes/episode-04-surgery-anaesthetics.js'
import episodeJenner from '../content/history/medicine/episodes/episode-06-jenner-vaccination.js'
import episodeGermTheory from '../content/history/medicine/episodes/episode-07-germ-theory.js'
import episodeGreatStink from '../content/history/medicine/episodes/episode-08-great-stink.js'
import episodeSurgeryRevolution from '../content/history/medicine/episodes/episode-09-surgery-revolution.js'
import episodeAccidentalMiracle from '../content/history/medicine/episodes/episode-11-accidental-miracle.js'
import episodeWhenMedicineBecameMagic from '../content/history/medicine/episodes/episode-12-when-medicine-became-magic.js'
import episodeCanWeBeatCancer from '../content/history/medicine/episodes/episode-13-can-we-beat-cancer.js'
import episodeWesternFront from '../content/history/medicine/episodes/episode-14-western-front.js'

export const HISTORY_MODULES = [
  episodeMedievalBeliefs,

  episodeBlackDeath,

  episodeRenaissanceMedicine,

  episodeSurgeryAnaesthetics,

  // ── Episode 5: London's year of terror (history-medicine-great-plague) ───────
  // Unbuilt — screenCount 0 in src/modules.js. No inline content. Build from scratch when ready.

  episodeJenner,

  episodeGermTheory,

  episodeGreatStink,

  episodeSurgeryRevolution,

  // ── Episode 10: The lady with the lamp (history-medicine-nightingale) ─────────
  // Unbuilt — screenCount 0 in src/modules.js. No inline content. Build from scratch when ready.

  episodeAccidentalMiracle,

  episodeWhenMedicineBecameMagic,

  episodeCanWeBeatCancer,


  episodeWesternFront,
]
