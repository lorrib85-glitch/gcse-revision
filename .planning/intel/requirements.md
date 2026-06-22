# Synthesized Requirements

Extracted from all PRD-type classifications. No PRD-type documents were present in this ingest set.

This file is intentionally minimal for this bootstrap ingest. Requirements will be populated when PRD-type documents are ingested in future runs.

---

## REQ-home-todays-plan — Home screen "Today's plan" task carousel

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md
type: SPEC (not PRD) — extracted here for requirement traceability
status: Specification — not yet implemented (as of 2026-06-14)
scope: Home screen, TaskCarousel, TaskCard, buildTodaysPlan, src/todaysPlan.js

### Description

Replace the Home screen's "Jump back in" / "Close the gap" reactive suggestions with a structured daily task carousel driven by a new `buildTodaysPlan()` pure function.

### Acceptance criteria

- Home displays a horizontal scroll-snap carousel of 3 task cards on weekdays, 4 on weekends.
- Slot 1 is always a Quick Fire warm-up (90-second sprint, routes to setTab('quickfire')).
- Slots 2-3 are dynamic, priority-ordered: weak-spot revisit > continue module > exam practice.
- Slot 4 (weekends only) is a full-paper card, subject rotated by ISO week number mod subjects with exam content.
- Cards show: kicker (uppercase label), title (specific — never generic), reason (personalised one-liner), duration tag.
- Repeat avoidance: last shown revisit topic stored in localStorage (gcse_todays_plan_revisit); skip to next candidate if same topic shown yesterday.
- Weekly trend line ("this week" stat) displayed under greeting, reusing getWeeklyTrend() extracted from PulseTab into src/progress.js.
- "Jump back in" and "Close the gap" sections removed entirely.
- StreakChip retained top-right, unchanged.
- Card visual: near-invisible border, RADII tokens, teal accent for revisit/continue/practice/paper, coral for warm-up only, optional faint imagery at ~0.06-0.10 opacity.
- examAutoStart prop added to TestTab for practice/paper cards to trigger startExamRound() once TestDataProvider data has loaded.

### Scope of changes

- src/App.jsx — rewrite Home (lines 841-1098); add examAutoStart prop to TestTab; wire new tap targets.
- New file: src/todaysPlan.js — buildTodaysPlan().
- src/progress.js — add getWeeklyTrend().
- Documentation update after Phase 2: CLAUDE.md Home description; COMPONENT_REGISTRY.md if reusable carousel pattern emerges.

### Out of scope / deferred

- Cross-subject weak-spot tag mappings (TAG_MODULE_MAP stays History-only for now).
- Bottom nav relabeling.
- New weak→mastered tracking.

---

## REQ-canonical-topic-skill — Canonical topic generator skill

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md
type: SPEC (not PRD) — extracted here for requirement traceability
status: Design — skill to be built
scope: .claude/skills/canonical-topic/SKILL.md, docs/content/history/, History modules

### Description

A project-level Claude skill (`/canonical-topic <argument>`) that synthesizes per-chapter canonical topic files from session-provided source material, the history series map, the locked architecture doc, and the current src/modules.js entry. Primary consumer of every output file is a future LLM session doing the actual build/audit.

### Acceptance criteria

- Invocation: `/canonical-topic <episode-name>` for a single episode, `/canonical-topic <series-name>` for all episodes in a series.
- Output path: `docs/content/<subject>/<Series>/<NN>_<Title>.md` — permanent, committed.
- Output contains six sections: Identity, Specification requirements, Architecture checklist (tailored), Current state and gap analysis, Content reference pack, Build recommendations.
- Content philosophy: completeness over brevity, structure over prose, MISSING/UNCERTAIN/CONFLICT markers rather than silent inference.
- Rollout: pilot on Episode 1 (Medicine Through Time) first, review and refine before series-mode run.
- History-only initially; other subjects require equivalent series map + architecture doc before the skill can run against them.
- Existing output files are overwritten on re-run.
- Source material is transient — not stored in the repo as a separate artefact.
