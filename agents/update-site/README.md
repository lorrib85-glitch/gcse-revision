# Website Update Agent

This repository includes a maintainer-facing agent that can turn a natural-language website update request into a reviewable GitHub pull request.

It is designed for content and small code updates to this React/Vite study website. It does not run inside the student-facing app and it never exposes GitHub credentials to browser code.

## What it can update

The agent is allowed to work in these areas:

- `src/content.js` for History Medicine home-session content
- `src/modules.js` for interactive module screens
- `src/data/*Topics.js` for Maths, English, Chemistry, and Sociology question banks
- `src/App.jsx` when the requested update needs app-level or inline test data changes
- `public/figures/` and `src/figures.js` for existing Biology figure references
- `api/grade.js` for exam-marking behavior
- `.github/workflows/`, `agents/update-site/`, and `scripts/` for agent infrastructure

It validates generated patches with `git apply --check` and, by default, runs:

```bash
npm run build
```

## Local usage

Set the Anthropic API key:

```bash
export ANTHROPIC_API_KEY=...
```

Preview a proposed patch without applying it:

```bash
npm run agent:update-site -- --request "Add a short GCSE Chemistry topic on acids and alkalis"
```

Apply the patch, validate the build, commit, push, and create/update a PR:

```bash
npm run agent:update-site -- \
  --request "Add a short GCSE Chemistry topic on acids and alkalis" \
  --apply \
  --branch website-agent/acids-and-alkalis
```

Useful flags:

- `--request-file request.txt` reads the update request from a file.
- `--no-pr` applies, validates, commits, and pushes without opening a PR.
- `--no-push --no-pr` keeps the generated commit local.
- `--allow-dirty` lets the agent run with existing uncommitted changes.

## GitHub Actions usage

The `Website Update Agent` workflow can be started manually from the GitHub Actions tab.

Required repository secret:

- `ANTHROPIC_API_KEY`

The workflow uses GitHub's built-in `GITHUB_TOKEN` to push a branch and open a pull request. The PR should be reviewed before merging.

## Safety model

- The model returns structured JSON only.
- Generated changes must be a git-compatible unified diff.
- Changed paths are checked against an allowlist before the patch is applied.
- The browser app never receives repository write credentials.
- Pull requests are created for human review instead of auto-merging.
