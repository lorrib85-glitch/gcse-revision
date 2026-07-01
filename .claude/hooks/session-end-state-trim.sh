#!/bin/bash
# SessionEnd hook: mechanical safety net only. Trims .planning/STATE.md if
# it ever exceeds 200 lines, so it can't silently balloon. The actual
# content update is Claude's job (nudged by the Stop hook) — this just
# stops an oversized file from lingering if that didn't happen.
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

STATE_FILE=".planning/STATE.md"
MAX_LINES=200

[ -f "$STATE_FILE" ] || exit 0

LINE_COUNT=$(wc -l < "$STATE_FILE" | tr -d ' ')
if [ "$LINE_COUNT" -le "$MAX_LINES" ]; then
  exit 0
fi

CUT_LINE=$(grep -n '^## Accumulated Context' "$STATE_FILE" | head -1 | cut -d: -f1)
if [ -z "$CUT_LINE" ]; then
  jq -n --arg msg "⚠ .planning/STATE.md is $LINE_COUNT lines (over the 200-line cap) but has no '## Accumulated Context' heading to trim from — needs a manual trim." '{systemMessage: $msg}'
  exit 0
fi

SESSION_LINE=$(grep -n '^## Session Continuity' "$STATE_FILE" | head -1 | cut -d: -f1)

TMP=$(mktemp)
head -n $((CUT_LINE - 1)) "$STATE_FILE" > "$TMP"
{
  echo ""
  echo "_[Accumulated Context trimmed by session-end hook — was $LINE_COUNT lines, over the 200-line cap. Full history in git log.]_"
} >> "$TMP"
if [ -n "$SESSION_LINE" ]; then
  echo "" >> "$TMP"
  sed -n "${SESSION_LINE},\$p" "$STATE_FILE" >> "$TMP"
fi
mv "$TMP" "$STATE_FILE"

NEW_LINE_COUNT=$(wc -l < "$STATE_FILE" | tr -d ' ')
jq -n --arg msg "⚠ .planning/STATE.md exceeded 200 lines ($LINE_COUNT) — trimmed Accumulated Context, now $NEW_LINE_COUNT lines. Review the trim next session." '{systemMessage: $msg}'
