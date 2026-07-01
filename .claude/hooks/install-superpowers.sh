#!/bin/bash
# Best-effort install of the superpowers plugin for remote sessions.
# Non-fatal: network policy on some environments is scoped to this repo
# only, in which case the marketplace/plugin fetch is blocked and this
# script silently no-ops rather than breaking session startup.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if claude plugin list 2>/dev/null | grep -qi "superpowers"; then
  exit 0
fi

claude plugin install superpowers@claude-plugins-official >/dev/null 2>&1 && exit 0

claude plugin marketplace add obra/superpowers-marketplace >/dev/null 2>&1 || true
claude plugin install superpowers@superpowers-marketplace >/dev/null 2>&1 || true

exit 0
