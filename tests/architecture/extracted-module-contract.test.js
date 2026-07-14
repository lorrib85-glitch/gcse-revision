/**
 * Contract tests for extracted episode modules.
 *
 * Scope: three directories that were repaired from legacy block types:
 *   src/content/sociology/families/episodes/
 *   src/content/maths/foundations/episodes/
 *   src/content/biology/cell-biology/episodes/
 *
 * These tests enforce the conventions applied during the repair effort and
 * guard against regressions when content is edited in future.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'

// ─── Module scope ─────────────────────────────────────────────────────────────

const TARGET_IDS = [
  // sociology/families/episodes/
  'soc1', 'soc2', 'soc3', 'soc4', 'soc6',
  // maths/foundations/episodes/
  'math1', 'math2',
  // biology/cell-biology/episodes/
  'bio_building_blocks', 'sci_bio_w1',
]

// ─── Reference sets ───────────────────────────────────────────────────────────

/**
 * Block types that were present in legacy content and must not appear in
 * repaired modules.  Ordered by the conversion they require.
 */
const LEGACY_BLOCK_TYPES = new Set([
  'flipcards',        // → flashcards (remove color/icon from cards)
  'appliedscenario',  // → scenario (rename scenario→situation, explanation→correctMsg)
  'bidmas',           // → quiz + examtip
  'tfcheckpoint',     // → misconceptionCheck
  'simulator',        // → scenario blocks
  'fracbar',          // → read + quiz
  'fractionsplitter', // → quiz blocks
  'fractionlab',      // → fillblanks
  'examscored',       // → quiz blocks
])

/**
 * Block types registered in the blocks renderer (ModulePlayer.jsx lines 879-900).
 * tieredquiz is included because it is used inside blocks by convention across
 * the whole codebase, even though its full-screen path fires at the screen level.
 */
const SUPPORTED_BLOCK_TYPES = new Set([
  'read', 'keypoint', 'funfact', 'examtip', 'timeline', 'reveal',
  'quiz', 'flashcards', 'hotspot', 'misconception', 'acronymMemorise', 'builder',
  'scenario', 'boss', 'explainReveal', 'fillblanks', 'theoryCompare',
  'graphView', 'timelineChain', 'colsort', 'spotTheError', 'misconceptionCheck',
  'tieredquiz',
])

/** Matches a string that starts with a visible emoji character. */
const EMOJI_PREFIX_RE = /^\p{Extended_Pictographic}/u

// ─── Load once ────────────────────────────────────────────────────────────────

describe('Extracted module content contracts', () => {
  const loaded = [] // { id, meta, content }[]

  beforeAll(async () => {
    for (const id of TARGET_IDS) {
      const loader = MODULE_CONTENT_LOADERS[id]
      if (!loader) throw new Error(`No loader registered for module "${id}" in moduleContentRegistry.js`)
      const content = await loader()
      const meta = MODULES.find(m => m.id === id)
      if (!meta) throw new Error(`No metadata row for "${id}" in src/modules.js`)
      loaded.push({ id, meta, content })
    }
  })

  // ─── Rule 1: screenCount ─────────────────────────────────────────────────────

  it('Rule 1 — metadata.screenCount matches content screens.length', () => {
    for (const { id, meta, content } of loaded) {
      expect(
        content.screens.length,
        `[${id}] src/modules.js screenCount=${meta.screenCount} but content has ${content.screens.length} screens`,
      ).toBe(meta.screenCount)
    }
  })

  // ─── Rule 2: stub contract ───────────────────────────────────────────────────

  it('Rule 2 — modules with screenCount 0 export screens: []', () => {
    for (const { id, meta, content } of loaded) {
      if (meta.screenCount === 0) {
        expect(
          content.screens,
          `[${id}] screenCount is 0 but screens array is not empty`,
        ).toEqual([])
      }
    }
  })

  // ─── Rule 3: stageNavigation ─────────────────────────────────────────────────

  it('Rule 3 — stageNavigation entries reference valid screenIndex values', () => {
    for (const { id, content } of loaded) {
      const nav = content.stageNavigation ?? []
      const total = content.screens.length

      expect(
        nav.length,
        `[${id}] stageNavigation is empty — populate it with 6 entries`,
      ).toBeGreaterThan(0)

      for (const entry of nav) {
        const si = entry.screenIndex
        expect(
          typeof si === 'number' && Number.isInteger(si) && si >= 0 && si < total,
          `[${id}] stageNavigation entry "${entry.id ?? '?'}" has invalid screenIndex ${si} (valid: 0–${total - 1})`,
        ).toBe(true)
      }
    }
  })

  // ─── Rule 4: no legacy block types ───────────────────────────────────────────

  it('Rule 4 — no legacy block types remain in any screen', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          expect(
            LEGACY_BLOCK_TYPES.has(block.type),
            `[${id}] screen[${si}] block[${bi}] uses legacy type "${block.type}" — convert to a registered block type`,
          ).toBe(false)
        })
      })
    }
  })

  // ─── Rule 5: tieredquiz must use .tiers ──────────────────────────────────────

  it('Rule 5 — tieredquiz blocks use .tiers not .rounds', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          if (block.type !== 'tieredquiz') return
          expect(
            Object.prototype.hasOwnProperty.call(block, 'rounds'),
            `[${id}] screen[${si}] block[${bi}] tieredquiz has .rounds — rename to .tiers`,
          ).toBe(false)
          expect(
            Array.isArray(block.tiers),
            `[${id}] screen[${si}] block[${bi}] tieredquiz is missing .tiers array`,
          ).toBe(true)
        })
      })
    }
  })

  // ─── Rule 6: boss must not use .rounds ───────────────────────────────────────

  it('Rule 6 — boss blocks do not use .rounds (split into individual boss blocks)', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          if (block.type !== 'boss') return
          expect(
            Object.prototype.hasOwnProperty.call(block, 'rounds'),
            `[${id}] screen[${si}] block[${bi}] boss block has .rounds — split each round into a separate boss block`,
          ).toBe(false)
        })
      })
    }
  })

  // ─── Rule 7: no emoji prefixes in block labels ────────────────────────────────

  it('Rule 7 — no emoji prefix in read block labels', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          if (block.type !== 'read' || !block.label) return
          expect(
            EMOJI_PREFIX_RE.test(block.label),
            `[${id}] screen[${si}] block[${bi}] read.label starts with emoji: "${block.label}" — remove the emoji prefix`,
          ).toBe(false)
        })
      })
    }
  })

  // ─── Rule 8a: flashcard cards must not carry color/bg/icon ───────────────────

  it('Rule 8a — flashcard cards have no hardcoded color, bg, or icon', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          if (block.type !== 'flashcards') return
          ;(block.cards ?? []).forEach((card, ci) => {
            expect(
              card.color,
              `[${id}] screen[${si}] block[${bi}] flashcard[${ci}] has hardcoded color — remove it`,
            ).toBeUndefined()
            expect(
              card.bg,
              `[${id}] screen[${si}] block[${bi}] flashcard[${ci}] has hardcoded bg — remove it`,
            ).toBeUndefined()
            expect(
              card.icon,
              `[${id}] screen[${si}] block[${bi}] flashcard[${ci}] has hardcoded icon — remove it`,
            ).toBeUndefined()
          })
        })
      })
    }
  })

  // ─── Rule 8b: hook.revealItems must not carry color/bg ───────────────────────

  it('Rule 8b — hook.revealItems have no hardcoded color or bg', () => {
    for (const { id, content } of loaded) {
      ;(content.hook?.revealItems ?? []).forEach((item, i) => {
        expect(
          item.color,
          `[${id}] hook.revealItems[${i}] has hardcoded color — remove it`,
        ).toBeUndefined()
        expect(
          item.bg,
          `[${id}] hook.revealItems[${i}] has hardcoded bg — remove it`,
        ).toBeUndefined()
      })
    }
  })

  // ─── Rule 9: every block type is supported by the renderer ───────────────────

  it('Rule 9 — all block types are recognised by the blocks renderer', () => {
    for (const { id, content } of loaded) {
      content.screens.forEach((screen, si) => {
        ;(screen.blocks ?? []).forEach((block, bi) => {
          expect(
            SUPPORTED_BLOCK_TYPES.has(block.type),
            `[${id}] screen[${si}] block[${bi}] type "${block.type}" is not in the supported block set — add a renderer or convert to a supported type`,
          ).toBe(true)
        })
      })
    }
  })
})
