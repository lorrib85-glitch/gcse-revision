#!/bin/bash
# Behavioural test for session-start-sync.sh — the guard on "reopening a
# session cannot discard local work". Each case builds a throwaway origin +
# clone in a temp dir, runs the hook against it, and asserts the outcome.
# Nothing here touches this repo. Run it directly:
#   bash .claude/hooks/session-start-sync.test.sh
set -uo pipefail

HOOK="$(cd "$(dirname "$0")" && pwd)/session-start-sync.sh"
ROOT=$(mktemp -d)
PASS=0; FAIL=0

check() { # check <label> <expected> <actual>
  if [ "$2" = "$3" ]; then echo "  PASS: $1"; PASS=$((PASS+1));
  else echo "  FAIL: $1 — expected [$2] got [$3]"; FAIL=$((FAIL+1)); fi
}

setup() { # setup <name>  -> echoes clone path; origin has 2 commits on main
  local n="$1"
  local o="$ROOT/$n.git" c="$ROOT/$n"
  git init --quiet --bare -b main "$o"
  git clone --quiet "$o" "$c" 2>/dev/null
  git -C "$c" config user.email t@t; git -C "$c" config user.name t
  echo one > "$c/f"; git -C "$c" add f; git -C "$c" commit --quiet -m one
  echo two >> "$c/f"; git -C "$c" commit --quiet -am two
  git -C "$c" push --quiet -u origin main 2>/dev/null
  echo "$c"
}

run_hook() { CLAUDE_CODE_REMOTE=true CLAUDE_PROJECT_DIR="$1" bash "$HOOK" 2>&1; }

echo "== 1. unpushed local commit on main (the destructive case) =="
C=$(setup one)
echo local >> "$C/f"; git -C "$C" commit --quiet -am "unpushed local work"
BEFORE=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "HEAD unchanged" "$BEFORE" "$(git -C "$C" rev-parse HEAD)"
check "commit still reachable" "unpushed local work" "$(git -C "$C" log -1 --format=%s)"
check "refused to sync" "yes" "$(echo "$OUT" | grep -q 'NOT syncing' && echo yes || echo no)"

echo "== 2. diverged: local unpushed AND remote moved on =="
C=$(setup two)
UP="$ROOT/two-up"; git clone --quiet "$ROOT/two.git" "$UP" 2>/dev/null
git -C "$UP" config user.email t@t; git -C "$UP" config user.name t
echo remote >> "$UP/f"; git -C "$UP" commit --quiet -am "remote work"; git -C "$UP" push --quiet 2>/dev/null
echo local >> "$C/f"; git -C "$C" commit --quiet -am "unpushed local work"
BEFORE=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "HEAD unchanged on divergence" "$BEFORE" "$(git -C "$C" rev-parse HEAD)"
check "reported divergence" "yes" "$(echo "$OUT" | grep -q 'diverged' && echo yes || echo no)"

echo "== 3. clean and behind: should fast-forward =="
C=$(setup three)
UP="$ROOT/three-up"; git clone --quiet "$ROOT/three.git" "$UP" 2>/dev/null
git -C "$UP" config user.email t@t; git -C "$UP" config user.name t
echo remote >> "$UP/f"; git -C "$UP" commit --quiet -am "remote work"; git -C "$UP" push --quiet 2>/dev/null
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "fast-forwarded to remote tip" "remote work" "$(git -C "$C" log -1 --format=%s)"

echo "== 4. up to date: no-op =="
C=$(setup four)
BEFORE=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "HEAD unchanged" "$BEFORE" "$(git -C "$C" rev-parse HEAD)"
check "reported up to date" "yes" "$(echo "$OUT" | grep -q 'up to date' && echo yes || echo no)"

echo "== 5. on a harness branch with unpushed commits (this session's shape) =="
C=$(setup five)
git -C "$C" checkout --quiet -b claude/feature
echo work >> "$C/f"; git -C "$C" commit --quiet -am "branch work"
BRANCH_TIP=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "switched to main" "main" "$(git -C "$C" rev-parse --abbrev-ref HEAD)"
check "branch commit preserved" "$BRANCH_TIP" "$(git -C "$C" rev-parse claude/feature)"
check "warned about stranded commit" "yes" "$(echo "$OUT" | grep -q 'not on origin/main' && echo yes || echo no)"

echo "== 6. dirty tree on another branch: stay put =="
C=$(setup six)
git -C "$C" checkout --quiet -b claude/feature
echo dirty >> "$C/f"
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "stayed on branch" "claude/feature" "$(git -C "$C" rev-parse --abbrev-ref HEAD)"
check "uncommitted change survives" "yes" "$(grep -q dirty "$C/f" && echo yes || echo no)"

echo "== 7. dirty tree on main while behind: no fast-forward =="
C=$(setup seven)
UP="$ROOT/seven-up"; git clone --quiet "$ROOT/seven.git" "$UP" 2>/dev/null
git -C "$UP" config user.email t@t; git -C "$UP" config user.name t
echo remote >> "$UP/f"; git -C "$UP" commit --quiet -am "remote work"; git -C "$UP" push --quiet 2>/dev/null
echo dirty >> "$C/f"
BEFORE=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "HEAD unchanged" "$BEFORE" "$(git -C "$C" rev-parse HEAD)"
check "uncommitted change survives" "yes" "$(grep -q dirty "$C/f" && echo yes || echo no)"

echo "== 8. local main branch missing =="
C=$(setup eight)
git -C "$C" checkout --quiet -b other
git -C "$C" branch --quiet -D main
OUT=$(run_hook "$C"); echo "  hook: $OUT"
check "main recreated and checked out" "main" "$(git -C "$C" rev-parse --abbrev-ref HEAD)"

echo "== 9. not a remote session: does nothing =="
C=$(setup nine)
git -C "$C" checkout --quiet -b other
OUT=$(CLAUDE_CODE_REMOTE=false CLAUDE_PROJECT_DIR="$C" bash "$HOOK" 2>&1)
check "no output" "" "$OUT"
check "branch untouched" "other" "$(git -C "$C" rev-parse --abbrev-ref HEAD)"

echo "== 10. unreachable remote: exits clean, changes nothing =="
C=$(setup ten)
git -C "$C" remote set-url origin "$ROOT/does-not-exist.git"
echo local >> "$C/f"; git -C "$C" commit --quiet -am "unpushed local work"
BEFORE=$(git -C "$C" rev-parse HEAD)
OUT=$(run_hook "$C"); RC=$?; echo "  hook: $OUT"
check "exit 0" "0" "$RC"
check "HEAD unchanged" "$BEFORE" "$(git -C "$C" rev-parse HEAD)"

echo
echo "RESULT: $PASS passed, $FAIL failed"
rm -rf "$ROOT"
[ "$FAIL" -eq 0 ]
