#!/bin/bash
# Stop hook: lint + build + bundle-budget gate, plus a reminder to update
# .planning/STATE.md when commits landed this session without it.
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

GATE_OK=1
./node_modules/.bin/eslint . --quiet > /tmp/eslint-check.log 2>&1 || GATE_OK=0

if [ "$GATE_OK" = "1" ]; then
  ./node_modules/.bin/vite build > /tmp/vite-build-check.log 2>&1 || GATE_OK=0
fi

if [ "$GATE_OK" = "1" ]; then
  awk 'BEGIN{ok=1}
    /\/index-[^\/]+\.js/ {if ($2+0 > 600) {print "BUDGET: main bundle " $2 "kB > 600kB limit"; ok=0}}
    /\/ModulePlayer-[^\/]+\.js/ {if ($2+0 > 550) {print "BUDGET: ModulePlayer " $2 "kB > 550kB limit"; ok=0}}
    /\/history-[^\/]+\.js/ {if ($2+0 > 450) {print "BUDGET: history " $2 "kB > 450kB limit"; ok=0}}
    END{exit !ok}' /tmp/vite-build-check.log > /tmp/budget-check.log 2>&1 || GATE_OK=0
fi

if [ "$GATE_OK" = "1" ]; then
  GATE_MSG="Lint ✓  Build ✓  Budget ✓"
else
  GATE_MSG="⚠ GATE FAILED — check /tmp/eslint-check.log, /tmp/vite-build-check.log, or /tmp/budget-check.log"
fi

# STATE.md staleness nudge: any commits since STATE.md was last touched
# that changed something other than STATE.md itself?
STATE_MSG=""
if git rev-parse --git-dir > /dev/null 2>&1; then
  LAST_STATE_COMMIT=$(git log -1 --format=%H -- .planning/STATE.md 2>/dev/null)
  HEAD_COMMIT=$(git rev-parse HEAD 2>/dev/null)
  if [ -n "$HEAD_COMMIT" ] && [ "$LAST_STATE_COMMIT" != "$HEAD_COMMIT" ]; then
    if [ -n "$LAST_STATE_COMMIT" ]; then
      OTHER_CHANGES=$(git diff --name-only "$LAST_STATE_COMMIT" "$HEAD_COMMIT" 2>/dev/null | grep -v '^\.planning/STATE\.md$' | head -1)
    else
      OTHER_CHANGES="true"
    fi
    if [ -n "$OTHER_CHANGES" ]; then
      STATE_MSG="  |  .planning/STATE.md wasn't updated for recent commits — update it (what changed, current phase/position, decisions made) and keep it under 200 lines before ending the session."
    fi
  fi
fi

jq -n --arg msg "${GATE_MSG}${STATE_MSG}" '{systemMessage: $msg}'
