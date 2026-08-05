// GENERATED FILE — DO NOT EDIT.
//
// Run `pnpm curriculum:projections:generate` after changing a record.
// `pnpm curriculum:projections:check` fails if this file has drifted from the
// records it is projected from.
//
// This is the runtime. src/data/modules.js, src/chapters.js and
// src/content/chapterContentRegistry.js re-export these files and nothing
// else; they remain the import path for every consumer.
//
// Checked against tests/fixtures/curriculum-runtime-v1.json — the frozen
// pre-cutover contract — by tests/architecture/curriculum-projection-parity
// .test.js. There is no hand-authored runtime left to compare with.
//
// Source: the authored records under src/curriculum-catalogue/, projected
// through scripts/generate-curriculum-projections.mjs.

export const CHAPTER_CONTENT_LOADERS = {
  "history-medicine-medieval-beliefs-causes": () => import("../../../content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js").then(m => m.default),
  "history-medicine-black-death": () => import("../../../content/history/medicine/episodes/episode-02-black-death.js").then(m => m.default),
  "history-medicine-renaissance-medicine": () => import("../../../content/history/medicine/episodes/episode-03-renaissance-medicine.js").then(m => m.default),
  "history-medicine-vesalius-beginning-doubt": () => import("../../../content/history/medicine/episodes/episode-03-vesalius-beginning-doubt.js").then(m => m.default),
  "history-medicine-harvey-pare-renaissance-method": () => import("../../../content/history/medicine/episodes/episode-04-harvey-pare-renaissance-method.js").then(m => m.default),
  "history-medicine-surgery-anaesthetics": () => import("../../../content/history/medicine/episodes/episode-04-surgery-anaesthetics.js").then(m => m.default),
  "history-medicine-great-plague-1665": () => import("../../../content/history/medicine/episodes/episode-05-great-plague-1665.js").then(m => m.default),
  "history-medicine-jenner-vaccination": () => import("../../../content/history/medicine/episodes/episode-06-jenner-vaccination.js").then(m => m.default),
  "history-medicine-germ-theory": () => import("../../../content/history/medicine/episodes/episode-07-germ-theory.js").then(m => m.default),
  "history-medicine-great-stink": () => import("../../../content/history/medicine/episodes/episode-08-great-stink.js").then(m => m.default),
  "history-medicine-surgery-revolution": () => import("../../../content/history/medicine/episodes/episode-09-surgery-revolution.js").then(m => m.default),
  "history-medicine-nightingale": () => import("../../../content/history/medicine/episodes/episode-10-nightingale.js").then(m => m.default),
  "history-medicine-accidental-miracle": () => import("../../../content/history/medicine/episodes/episode-11-accidental-miracle.js").then(m => m.default),
  "history-medicine-modern-medicine": () => import("../../../content/history/medicine/episodes/episode-12-when-medicine-became-magic.js").then(m => m.default),
  "history-medicine-cancer": () => import("../../../content/history/medicine/episodes/episode-13-can-we-beat-cancer.js").then(m => m.default),
  "history-medicine-western-front": () => import("../../../content/history/medicine/episodes/episode-14-western-front.js").then(m => m.default),
  "spain-new-world-1": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-1.js").then(m => m.default),
  "spain-new-world-2": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-2.js").then(m => m.default),
  "spain-new-world-3": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-3.js").then(m => m.default),
  "spain-new-world-4": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-4.js").then(m => m.default),
  "spain-new-world-5": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-5.js").then(m => m.default),
  "spain-new-world-6": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-6.js").then(m => m.default),
  "spain-new-world-7": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-7.js").then(m => m.default),
  "spain-new-world-8": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-8.js").then(m => m.default),
  "spain-new-world-9": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-9.js").then(m => m.default),
  "spain-new-world-10": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-10.js").then(m => m.default),
  "usa-segregation": () => import("../../../content/history/usa/episodes/usa-segregation.js").then(m => m.default),
  "usa-brown-v-board": () => import("../../../content/history/usa/episodes/usa-brown-v-board.js").then(m => m.default),
  "usa-rosa-parks": () => import("../../../content/history/usa/episodes/usa-rosa-parks.js").then(m => m.default),
  "usa-sit-ins": () => import("../../../content/history/usa/episodes/usa-sit-ins.js").then(m => m.default),
  "usa-i-have-a-dream": () => import("../../../content/history/usa/episodes/usa-i-have-a-dream.js").then(m => m.default),
  "usa-malcolm-x": () => import("../../../content/history/usa/episodes/usa-malcolm-x.js").then(m => m.default),
  "usa-how-much-changed": () => import("../../../content/history/usa/episodes/usa-how-much-changed.js").then(m => m.default),
  "usa-why-vietnam": () => import("../../../content/history/usa/episodes/usa-why-vietnam.js").then(m => m.default),
  "usa-americas-war": () => import("../../../content/history/usa/episodes/usa-americas-war.js").then(m => m.default),
  "usa-guerrilla-war": () => import("../../../content/history/usa/episodes/usa-guerrilla-war.js").then(m => m.default),
  "usa-war-comes-home": () => import("../../../content/history/usa/episodes/usa-war-comes-home.js").then(m => m.default),
  "usa-long-way-out": () => import("../../../content/history/usa/episodes/usa-long-way-out.js").then(m => m.default),
  "soc1": () => import("../../../content/sociology/families/episodes/soc1.js").then(m => m.default),
  "soc2": () => import("../../../content/sociology/families/episodes/soc2.js").then(m => m.default),
  "soc3": () => import("../../../content/sociology/families/episodes/soc3.js").then(m => m.default),
  "soc4": () => import("../../../content/sociology/families/episodes/soc4.js").then(m => m.default),
  "soc6": () => import("../../../content/sociology/families/episodes/soc6.js").then(m => m.default),
  "math1": () => import("../../../content/maths/foundations/episodes/math1.js").then(m => m.default),
  "math2": () => import("../../../content/maths/foundations/episodes/math2.js").then(m => m.default),
  "math3": () => import("../../../content/maths/foundations/episodes/math3.js").then(m => m.default),
  "math4": () => import("../../../content/maths/foundations/episodes/math4.js").then(m => m.default),
  "math5": () => import("../../../content/maths/foundations/episodes/math5.js").then(m => m.default),
  "math6": () => import("../../../content/maths/foundations/episodes/math6.js").then(m => m.default),
  "math7": () => import("../../../content/maths/foundations/episodes/math7.js").then(m => m.default),
  "math8": () => import("../../../content/maths/foundations/episodes/math8.js").then(m => m.default),
  "bio_building_blocks": () => import("../../../content/biology/cell-biology/episodes/bio_building_blocks.js").then(m => m.default),
  "sci_bio_w1": () => import("../../../content/biology/cell-biology/episodes/sci_bio_w1.js").then(m => m.default),
  "bio_building_life": () => import("../../../content/biology/organisation/episodes/bio_building_life.js").then(m => m.default),
  "bio_human_machine": () => import("../../../content/biology/organisation/episodes/bio_human_machine.js").then(m => m.default),
  "bio_disease_wars": () => import("../../../content/biology/infection-and-response/episodes/bio_disease_wars.js").then(m => m.default),
  "bio_control_systems": () => import("../../../content/biology/homeostasis/episodes/bio_control_systems.js").then(m => m.default),
  "bio_genetics_evolution": () => import("../../../content/biology/inheritance-variation-evolution/episodes/bio_genetics_evolution.js").then(m => m.default),
  "bio_ecosystems_group": () => import("../../../content/biology/ecology/episodes/bio_ecosystems_group.js").then(m => m.default),
  "english-macbeth-power-ambition": () => import("../../../content/english/macbeth/episodes/english-macbeth-power-ambition.js").then(m => m.default),
}

export async function loadChapterContent(chapterId) {
  const loader = CHAPTER_CONTENT_LOADERS[chapterId]
  return loader ? loader() : null
}
