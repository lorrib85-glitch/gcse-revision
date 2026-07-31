#!/bin/bash
# SessionStart hook: get the session onto an up-to-date `main` WITHOUT ever
# discarding local work.
#
# Replaces `git fetch origin main && git checkout -B main origin/main`, which
# force-moved the local `main` ref onto the remote and silently orphaned any
# commit that had not been pushed yet — reopening a session could destroy work.
#
# Rule: only use git commands that refuse rather than destroy — plain
# `checkout`, `branch --track`, `merge --ff-only`. Never `-B`, never `-f`,
# never `reset --hard`. When anything is at risk, report and stop.
set -uo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

say() { echo "session-start-sync: $*"; }

git fetch origin main --quiet 2>/dev/null || {
  say "fetch of origin/main failed — repo left exactly as it was"
  exit 0
}

CURRENT=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)
DIRTY=""
git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null || DIRTY=1

# Switch onto main only when nothing can be lost by doing so. If there is no
# local main, plain checkout creates it tracking origin/main.
if [ "$CURRENT" != "main" ]; then
  if [ -n "$DIRTY" ]; then
    say "on '$CURRENT' with uncommitted changes — staying put. Inspect and commit before moving to main."
    exit 0
  fi
  if git checkout main >/dev/null 2>&1; then
    say "switched from '$CURRENT' to main"
    STRANDED=$(git rev-list --count "origin/main..$CURRENT" 2>/dev/null || echo 0)
    [ "$STRANDED" -gt 0 ] && say "note: '$CURRENT' still holds $STRANDED commit(s) not on origin/main — nothing was deleted"
  else
    say "could not switch to main from '$CURRENT' — left as is"
    exit 0
  fi
fi

AHEAD=$(git rev-list --count origin/main..main 2>/dev/null || echo 0)
BEHIND=$(git rev-list --count main..origin/main 2>/dev/null || echo 0)

if [ "$AHEAD" -gt 0 ]; then
  say "local main is $AHEAD commit(s) ahead of origin/main — NOT syncing. Push or inspect before continuing."
  [ "$BEHIND" -gt 0 ] && say "main has diverged ($BEHIND commit(s) behind too) — resolve manually; this hook will not rewrite history."
  exit 0
fi

# --ff-only refuses if it would overwrite modified files, so a dirty tree needs
# no extra guard here: git either carries the changes across or declines.
if [ "$BEHIND" -eq 0 ]; then
  say "main is up to date with origin/main"
elif git merge --ff-only origin/main --quiet 2>/dev/null; then
  say "fast-forwarded main to origin/main ($BEHIND commit(s))"
else
  say "fast-forward to origin/main refused — resolve manually"
fi

exit 0
