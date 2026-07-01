#!/bin/bash
# PostToolUse (Edit|Write) hook: nudge when a component/feature file grows
# past a line threshold. Scoped to src/components/** and src/features/**
# only — content files (src/content, src/modules, src/data) are expected
# to be large since they hold one module's/subject's full curriculum
# content, not code, so they're deliberately excluded.
#
# Only fires when the file is BOTH over the threshold AND bigger than it
# was at HEAD, so it doesn't nag on every touch to an already-oversized
# file (e.g. ModulePlayer.jsx) unless this edit made it grow further.
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

THRESHOLD=1200

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')
[ -n "$FILE" ] || exit 0

REL=$(realpath --relative-to="$CLAUDE_PROJECT_DIR" "$FILE" 2>/dev/null) || exit 0
case "$REL" in
  src/components/*.jsx|src/components/*.js|src/features/*.jsx|src/features/*.js) ;;
  *) exit 0 ;;
esac

[ -f "$FILE" ] || exit 0

CURRENT_LINES=$(wc -l < "$FILE" | tr -d ' ')
[ "$CURRENT_LINES" -gt "$THRESHOLD" ] || exit 0

HEAD_LINES=$(git show "HEAD:$REL" 2>/dev/null | wc -l | tr -d ' ')
HEAD_LINES=${HEAD_LINES:-0}

if [ "$CURRENT_LINES" -gt "$HEAD_LINES" ]; then
  jq -n --arg msg "⚠ $REL is now $CURRENT_LINES lines and just grew — consider whether it should be decomposed before it becomes the next ModulePlayer.jsx (2400+ lines, flagged as a fragile area in .planning/codebase/CONCERNS.md)." '{systemMessage: $msg}'
fi
