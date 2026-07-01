#!/bin/bash
# PostToolUse (Write) hook: nudge on brand-new src/components files to
# confirm the Component Registry was checked before this gets committed,
# so "reuse before create" is a checkable moment, not just aspirational text.
set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')
[ -n "$FILE" ] || exit 0

REL=$(realpath --relative-to="$CLAUDE_PROJECT_DIR" "$FILE" 2>/dev/null) || exit 0
case "$REL" in
  src/components/*.jsx|src/components/*.js) ;;
  *) exit 0 ;;
esac

git rev-parse --git-dir > /dev/null 2>&1 || exit 0

STATUS=$(git status --porcelain -- "$REL" 2>/dev/null)
case "$STATUS" in
  "??"*)
    jq -n --arg msg "New component file: $REL — confirm docs/components/COMPONENT_REGISTRY.md was checked for an existing match, and that a .stories.jsx file exists alongside it, before this gets committed." '{systemMessage: $msg}'
    ;;
esac
