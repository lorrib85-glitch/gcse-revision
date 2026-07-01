#!/bin/bash
# Best-effort install of GSD Core for remote sessions.
# Non-fatal: if the npm registry is unreachable this silently no-ops
# rather than breaking session startup.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if [ -f "$HOME/.claude/gsd-core/VERSION" ]; then
  exit 0
fi

npx --yes @opengsd/gsd-core@latest >/dev/null 2>&1 || true

exit 0
