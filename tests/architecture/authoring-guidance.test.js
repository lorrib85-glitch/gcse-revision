// ─── Active authoring guidance matches the post-cutover authority ───────────
//
// Stage 4 made `src/data/modules.js`, `src/chapters.js` and
// `src/content/chapterContentRegistry.js` generated re-export boundaries. Any
// instruction that still sends an author into one of them to ADD a chapter, ADD
// a loader or MAINTAIN `screenCount` / `screenTags` now describes work that the
// next `pnpm curriculum:projections:generate` silently destroys — and that
// `pnpm verify` then fails on, with no clue why.
//
// The distinction this file defends is WRITE vs READ. Reading those three files
// is correct and unchanged: they are still the public import path for every
// consumer, every test and every skill that wants to know what the runtime
// holds. Only the instruction to author in them is wrong.
//
// So the sweep is anchored to imperative, write-shaped phrasing near a boundary
// file, not to the file names themselves. A doc may name them freely.

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, posix } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = rel => readFileSync(resolve(root, rel), 'utf8')

/** The three generated re-export boundaries. */
const BOUNDARY_FILES = [
  'src/data/modules.js',
  'src/chapters.js',
  'src/content/chapterContentRegistry.js',
]

/**
 * Guidance a human or an agent is expected to act on TODAY.
 *
 * `.planning/**` is deliberately excluded: it is the migration's historical
 * record, and rewriting a superseded plan to match the present would destroy
 * the evidence of why the present looks like this. A plan is not guidance.
 */
const GUIDANCE_ROOTS = ['CLAUDE.md', 'docs/system', 'docs/components', '.claude/skills', 'src/component-catalogue/records']

function listGuidance() {
  const out = []
  const walk = rel => {
    const absolute = resolve(root, rel)
    if (!existsSync(absolute)) return
    if (!statSync(absolute).isDirectory()) { out.push(rel); return }
    for (const name of readdirSync(absolute)) walk(posix.join(rel, name))
  }
  for (const entry of GUIDANCE_ROOTS) walk(entry)
  return out.filter(file => /\.(md|js)$/.test(file))
}

const GUIDANCE_FILES = listGuidance()

/** Sentences, so an imperative verb is only matched against its own clause. */
const sentences = source => source.split(/(?<=[.;:!?])\s+|\n/)

const WRITE_VERB = /\b(add|adding|append|register|registering|create|write|writing|insert|edit|editing|update|updating|maintain|keep|set)\b/i
const BOUNDARY_MENTION = /src\/chapters\.js|src\/data\/modules\.js|chapterContentRegistry\.js|CHAPTER_CONTENT_LOADERS/i
// Phrasing that marks the sentence as describing the NEW rule rather than
// instructing the old one. A prohibition names the file on purpose.
const PROHIBITION = /never|not authored|no longer|generated|re-export|boundary|derived|instead of|rather than|do not|don't|stop|forbidden|overwrites|fails/i

describe('active authoring guidance does not send authors into the generated boundaries', () => {
  it('finds guidance to sweep at all', () => {
    expect(GUIDANCE_FILES.length).toBeGreaterThan(20)
    expect(GUIDANCE_FILES).toContain('CLAUDE.md')
    expect(GUIDANCE_FILES).toContain('src/component-catalogue/records/chapter-player.js')
  })

  it('never instructs an author to write into a boundary file', () => {
    const offenders = []
    for (const file of GUIDANCE_FILES) {
      if (file === 'tests/architecture/authoring-guidance.test.js') continue
      for (const sentence of sentences(read(file))) {
        if (!BOUNDARY_MENTION.test(sentence)) continue
        if (!WRITE_VERB.test(sentence)) continue
        if (PROHIBITION.test(sentence)) continue
        offenders.push(`${file}: ${sentence.trim().slice(0, 150)}`)
      }
    }
    expect(offenders, 'guidance still describes a generated boundary as an authoring location').toEqual([])
  })

  it('never instructs an author to maintain screenCount or screenTags by hand', () => {
    const offenders = []
    const DERIVED = /\b(screenCount|screenTags)\b/
    for (const file of GUIDANCE_FILES) {
      if (file === 'tests/architecture/authoring-guidance.test.js') continue
      for (const sentence of sentences(read(file))) {
        if (!DERIVED.test(sentence)) continue
        if (!/\b(update|updating|maintain|keep|align|aligned|set|author|authoring|edit)\b/i.test(sentence)) continue
        if (PROHIBITION.test(sentence)) continue
        offenders.push(`${file}: ${sentence.trim().slice(0, 150)}`)
      }
    }
    expect(offenders, 'guidance still treats a derived field as authored').toEqual([])
  })

  it('the sweep would fire — it catches the exact instructions this commit removed', () => {
    // Regression guard on the guard. These are verbatim from the pre-commit
    // guidance; if the matcher stops catching them it has stopped working.
    const wouldOffend = sentence =>
      BOUNDARY_MENTION.test(sentence) && WRITE_VERB.test(sentence) && !PROHIBITION.test(sentence)
    expect(wouldOffend('Add a dynamic loader to CHAPTER_CONTENT_LOADERS in src/content/chapterContentRegistry.js.')).toBe(true)
    expect(wouldOffend('The chapter metadata row exists in src/chapters.js — add it if missing.')).toBe(true)
    expect(wouldOffend('a normal chapter is buildable by adding chapter metadata to src/chapters.js')).toBe(true)
    // …and does not fire on the sentences that replaced them.
    expect(wouldOffend('src/chapters.js is a generated re-export boundary and is never authored in.')).toBe(false)
    expect(wouldOffend('Loader entries are generated from the record contentPath.')).toBe(false)
    // …nor on plain reading.
    expect(wouldOffend("import { CHAPTERS } from '../../src/chapters.js'")).toBe(false)
  })
})

describe('CLAUDE.md states the canonical chapter-authoring flow', () => {
  const claude = read('CLAUDE.md')

  it('names the catalogue as the authority and the three files as boundaries', () => {
    expect(claude).toMatch(/generated\s+re-export\s+boundaries/)
    for (const file of BOUNDARY_FILES) {
      expect(claude, `${file} is not named as a boundary`).toContain(file)
    }
  })

  it('gives the eight authoring steps in order', () => {
    const flow = claude.slice(claude.indexOf('#### Adding or changing a chapter'))
    const steps = [
      /1\..*chapter record/s,
      /2\..*exactly one.*module/s,
      /3\..*content file/s,
      /4\..*contentPath/s,
      /5\..*concepts/s,
      /6\..*curriculum:projections:generate/s,
      /7\..*lab:generate/s,
      /8\..*pnpm verify/s,
    ]
    let cursor = 0
    for (const [index, step] of steps.entries()) {
      const match = flow.slice(cursor).search(step)
      expect(match, `authoring step ${index + 1} is missing or out of order`).toBeGreaterThanOrEqual(0)
      cursor += match + 1
    }
  })

  it('states each consequence the generated authority creates', () => {
    for (const claim of [
      /screenCount.*screenTags.*derived/is,
      /Loader entries are generated/i,
      /MODULES.*CHAPTERS.*are generated/is,
      /never edits `ChapterPlayer`, `ScreenRenderer`/i,
      /zero-screen content file/i,
      /Topic metadata.*lives inside chapter content/is,
    ]) {
      expect(claude, `CLAUDE.md does not state: ${claim}`).toMatch(claim)
    }
  })
})

describe('the ChapterPlayer record states the post-cutover chapter-building rule', () => {
  it('routes authors to the catalogue, not to the boundaries', async () => {
    const record = (await import('../../src/component-catalogue/records/chapter-player.js')).default
    const rule = record.documentation.governanceRules.find(entry => entry.startsWith('Chapter-building rule:'))
    expect(rule, 'the chapter-building rule is gone').toBeTruthy()
    expect(rule).toMatch(/canonical chapter record/)
    expect(rule).toMatch(/exactly one canonical module record/)
    expect(rule).toMatch(/generated re-export boundaries and are never authored in/)
    expect(rule).toMatch(/screenCount, screenTags and the loader entry are derived/)
    // The old rule's instruction must be gone, not merely reworded around.
    expect(rule).not.toMatch(/adding chapter metadata to src\/chapters\.js/)
    expect(rule).not.toMatch(/adding its content loader to/)
  })

  it('is reflected in the generated Component Registry', () => {
    const registry = read('docs/components/COMPONENT_REGISTRY.md')
    expect(registry).toMatch(/canonical chapter record/)
    expect(registry).not.toMatch(/adding chapter metadata to src\/chapters\.js/)
  })
})
