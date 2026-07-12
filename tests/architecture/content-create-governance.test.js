import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const contentCreate = read('.claude/skills/content-create/SKILL.md')
const contentReview = read('.claude/skills/content-review/SKILL.md')
const patternGovernance = read('docs/system/PATTERN_GOVERNANCE.md')

describe('content-create governance integration', () => {
  it('owns Stage B of the three-stage pipeline and never conflates implemented with approved', () => {
    expect(contentCreate).toContain('The three-stage pipeline (this skill owns Stage B)')
    expect(contentCreate).toMatch(/Stage A — `content-review` \(diagnose\)/)
    expect(contentCreate).toMatch(/Stage B — `content-create` \(implement\)/)
    expect(contentCreate).toMatch(/Stage C — `content-review` \(approve\)/)
    // The core invariant: building is not approving.
    expect(contentCreate).toMatch(/Output is \*implemented\*, not\s+\*approved\*/)
    expect(contentCreate).toContain('Never treat "implemented" as "approved"')
  })

  it('requires the full build chain to be resolved before any component is chosen', () => {
    expect(contentCreate).toContain('The build chain — mandatory before component selection')
    for (const link of [
      'Learning objective',
      'One primary screen intent',
      'Learner misunderstanding or learning need',
      'Approved component + composition route',
      'Component execution contract',
      'Named gold example',
      'Content structure',
      'Render acceptance criteria',
    ]) {
      expect(contentCreate).toContain(link)
    }
    expect(contentCreate).toMatch(/before touching a component/)
  })

  it('enforces the halt conditions that stop a bad build before it starts', () => {
    expect(contentCreate).toContain('Halt conditions (stop, surface to the user, do not build)')
    expect(contentCreate).toMatch(/primary intent cannot be stated in one sentence/)
    expect(contentCreate).toContain('has no registered contract')
    expect(contentCreate).toContain('reuse-before-create')
    expect(contentCreate).toMatch(/Required canonical knowledge is missing/)
    expect(contentCreate).toMatch(/own full-screen composition without a contract/)
  })

  it('never blurs teaching, retrieval, application and exam technique, and never tests before teaching', () => {
    expect(contentCreate).toMatch(/must not be tested \(retrieval, application or exam technique\)[\s\S]*before the screen that teaches it/)
    expect(contentCreate).toContain('A concept is never tested before the screen that teaches it.')
  })

  it('reserves every visual with MediaPlaceholder and never generates imagery', () => {
    expect(contentCreate).toMatch(/Reserve every visual with `MediaPlaceholder`/)
    expect(contentCreate).toContain('Never generate imagery; reserve it with `MediaPlaceholder` + manifest.')
  })

  it('commits per screen and never adds a module to a grandfather allowlist', () => {
    expect(contentCreate).toMatch(/Commit per screen \/ story unit \/ stage\*\*, never one mega-commit/)
    expect(contentCreate).toContain('Never freely invent a screen')
    expect(contentCreate).toContain('GRANDFATHERED_EPISODES')
    expect(contentCreate).toContain('SENTENCE_CASE_GRANDFATHERED_EPISODES')
  })

  it('builds to the same bar Stage C judges by, not a looser builder-only standard', () => {
    expect(contentCreate).toContain('Build to the same bar Stage C judges by')
    expect(contentCreate).toContain('Mechanical visual-quality checklist')
    expect(contentCreate).toContain('Visual-review authority hierarchy')
    // The shared bar must actually exist on the reviewer side and in governance.
    expect(contentReview).toContain('Mechanical visual-quality checklist')
    expect(patternGovernance).toContain('Visual-review authority hierarchy')
  })

  it('stays consistent with content-review: each skill names the other and its stage role', () => {
    // content-review asserts content-create exists as the build-side companion.
    expect(contentReview).toMatch(/companion build-side skill and \*\*exists\*\*/)
    // content-create defers diagnosis and approval to content-review.
    expect(contentCreate).toContain('It is **not** a diagnosis tool.')
    expect(contentCreate).toContain('It is **not** an approval tool.')
    expect(contentCreate).toContain('It does **not** expand scope.')
  })
})
