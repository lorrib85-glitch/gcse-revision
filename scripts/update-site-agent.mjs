#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { AGENT_SYSTEM_PROMPT, buildUserPrompt } from '../agents/update-site/prompt.mjs'
import {
  buildRepoBriefing,
  chooseInitialContextPaths,
  readContextFiles,
  validatePatchPaths,
} from '../agents/update-site/repo-context.mjs'

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'

function usage() {
  return `Usage:
  npm run agent:update-site -- --request "Add a new GCSE Chemistry acids topic" --apply --branch website-agent/acids-topic

Options:
  --request <text>          Natural-language website update request
  --request-file <path>     Read the request from a text file
  --apply                   Apply the generated patch, run validation, commit, push, and open a PR
  --branch <name>           Branch to create/use when applying changes
  --base <name>             Base branch for branch creation and PRs (default: main)
  --model <name>            Anthropic model (default: ${DEFAULT_MODEL})
  --max-iterations <n>      Context request loop limit (default: 4)
  --max-file-chars <n>      Max characters sent per context file (default: 70000)
  --allow-dirty             Allow running with existing uncommitted changes
  --no-build                Skip npm run build validation
  --no-commit               Apply only; do not commit, push, or open a PR
  --no-push                 Do not push the branch or open a PR
  --no-pr                   Do not open or update a pull request
  --help                    Show this help`
}

function parseArgs(argv) {
  const options = {
    apply: false,
    base: 'main',
    model: DEFAULT_MODEL,
    maxIterations: 4,
    maxFileChars: 70000,
    allowDirty: false,
    build: true,
    commit: true,
    push: true,
    pr: true,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = () => {
      index += 1
      if (index >= argv.length) throw new Error(`Missing value for ${arg}`)
      return argv[index]
    }

    switch (arg) {
      case '--request':
        options.request = next()
        break
      case '--request-file':
        options.requestFile = next()
        break
      case '--apply':
        options.apply = true
        break
      case '--branch':
        options.branch = sanitizeBranchName(next())
        break
      case '--base':
        options.base = next()
        break
      case '--model':
        options.model = next()
        break
      case '--max-iterations':
        options.maxIterations = Number.parseInt(next(), 10)
        break
      case '--max-file-chars':
        options.maxFileChars = Number.parseInt(next(), 10)
        break
      case '--allow-dirty':
        options.allowDirty = true
        break
      case '--no-build':
        options.build = false
        break
      case '--no-commit':
        options.commit = false
        break
      case '--no-push':
        options.push = false
        break
      case '--no-pr':
        options.pr = false
        break
      case '--help':
      case '-h':
        console.log(usage())
        process.exit(0)
        break
      default:
        throw new Error(`Unknown option: ${arg}`)
    }
  }

  if (options.requestFile) {
    options.request = readTextFile(options.requestFile)
  }

  if (!options.request || !options.request.trim()) {
    throw new Error('Provide a request with --request or --request-file.')
  }

  if (!Number.isFinite(options.maxIterations) || options.maxIterations < 1) {
    throw new Error('--max-iterations must be a positive number.')
  }

  if (!Number.isFinite(options.maxFileChars) || options.maxFileChars < 1000) {
    throw new Error('--max-file-chars must be at least 1000.')
  }

  if (options.apply && !options.branch) {
    options.branch = `website-agent/${new Date().toISOString().replace(/[:.]/g, '-').toLowerCase()}`
  }

  if (!options.apply) {
    options.commit = false
    options.push = false
    options.pr = false
  }

  if (!options.commit) {
    options.push = false
    options.pr = false
  }

  if (!options.push) {
    options.pr = false
  }

  return options
}

function readTextFile(filePath) {
  return readFileSync(path.resolve(process.cwd(), filePath), 'utf8')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const rootDir = process.cwd()

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required.')
  }

  if (options.apply && !options.allowDirty) {
    ensureCleanWorktree()
  }

  if (options.apply) {
    prepareBranch(options)
  }

  const response = await generatePatch(rootDir, options)

  if (response.status === 'refuse') {
    console.error(`Agent could not complete the request: ${response.reason}`)
    if (Array.isArray(response.nextSteps)) {
      for (const step of response.nextSteps) console.error(`- ${step}`)
    }
    process.exit(2)
  }

  validatePatchPaths(response.patch)
  console.log(`\nAgent summary: ${response.summary}`)

  if (!options.apply) {
    console.log('\nGenerated patch:\n')
    console.log(response.patch)
    console.log('\nRun again with --apply to apply, validate, commit, push, and open a PR.')
    return
  }

  applyPatch(response.patch)

  if (options.build) {
    run('npm', ['run', 'build'], { label: 'Validate build' })
  }

  const changed = run('git', ['status', '--porcelain'], { label: 'Check changed files' }).stdout.trim()
  if (!changed) {
    console.log('Patch applied cleanly but produced no repository changes.')
    return
  }

  if (options.commit) {
    run('git', ['add', '-A'], { label: 'Stage changes' })
    run('git', ['commit', '-m', response.commitMessage || response.summary || 'Update website content'], {
      label: 'Commit changes',
    })
  }

  if (options.push) {
    run('git', ['push', '-u', 'origin', options.branch], { label: 'Push branch' })
  }

  if (options.pr) {
    openPullRequest(options, response)
  }
}

async function generatePatch(rootDir, options) {
  const repoBriefing = buildRepoBriefing(rootDir)
  const requestedPaths = new Set(chooseInitialContextPaths(options.request, rootDir))
  const messages = []

  for (let iteration = 1; iteration <= options.maxIterations; iteration += 1) {
    const contextFiles = readContextFiles(rootDir, Array.from(requestedPaths), options.maxFileChars)
    const prompt = buildUserPrompt({
      request: options.request,
      repoBriefing,
      contextFiles,
      iteration,
    })

    messages.push({ role: 'user', content: prompt })
    const assistantResponse = await callAnthropic({
      model: options.model,
      system: AGENT_SYSTEM_PROMPT,
      messages,
    })
    messages.push({ role: 'assistant', content: JSON.stringify(assistantResponse) })

    if (assistantResponse.status === 'needs_context') {
      if (!Array.isArray(assistantResponse.paths) || assistantResponse.paths.length === 0) {
        throw new Error('Agent requested more context but did not provide paths.')
      }
      for (const repoPath of assistantResponse.paths) requestedPaths.add(repoPath)
      continue
    }

    if (assistantResponse.status === 'patch' || assistantResponse.status === 'refuse') {
      return assistantResponse
    }

    throw new Error(`Unexpected agent status: ${assistantResponse.status}`)
  }

  throw new Error(`Agent did not produce a patch within ${options.maxIterations} iterations.`)
}

async function callAnthropic({ model, system, messages }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 12000,
      system,
      messages,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const text = (data.content || [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim()

  return parseJsonObject(text)
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      throw new Error(`Agent response was not JSON: ${text}`)
    }
    return JSON.parse(text.slice(start, end + 1))
  }
}

function applyPatch(patch) {
  const tmp = mkdtempSync(path.join(tmpdir(), 'website-update-agent-'))
  const patchPath = path.join(tmp, 'update.patch')

  try {
    writeFileSync(patchPath, patch)
    run('git', ['apply', '--check', patchPath], { label: 'Check generated patch' })
    run('git', ['apply', patchPath], { label: 'Apply generated patch' })
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

function ensureCleanWorktree() {
  const status = run('git', ['status', '--porcelain'], { label: 'Check clean worktree' }).stdout.trim()
  if (status) {
    throw new Error('Working tree has uncommitted changes. Commit/stash them or pass --allow-dirty.')
  }
}

function prepareBranch(options) {
  run('git', ['fetch', 'origin', options.base], { label: `Fetch ${options.base}` })
  run('git', ['checkout', '-B', options.branch, `origin/${options.base}`], {
    label: `Create branch ${options.branch}`,
  })
}

function openPullRequest(options, response) {
  const title = response.commitMessage || response.summary || 'Update website content'
  const body = [
    '## Summary',
    response.summary || 'Updated website content with the website update agent.',
    '',
    '## Validation',
    ...(Array.isArray(response.validation) && response.validation.length
      ? response.validation.map((item) => `- ${item}`)
      : ['- npm run build']),
    '',
    'Generated by the website update agent.',
  ].join('\n')

  const existing = run('gh', ['pr', 'view', options.branch, '--json', 'url', '-q', '.url'], {
    allowFailure: true,
    label: 'Find existing PR',
  })

  if (existing.status === 0 && existing.stdout.trim()) {
    run('gh', ['pr', 'edit', existing.stdout.trim(), '--title', title, '--body', body], {
      label: 'Update pull request',
    })
    console.log(`Updated PR: ${existing.stdout.trim()}`)
    return
  }

  const created = run('gh', [
    'pr',
    'create',
    '--base',
    options.base,
    '--head',
    options.branch,
    '--title',
    title,
    '--body',
    body,
  ], {
    label: 'Create pull request',
  })

  console.log(created.stdout.trim())
}

function run(command, args, { allowFailure = false, label = command } = {}) {
  console.log(`\n> ${label}`)
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  if (result.status !== 0 && !allowFailure) {
    throw new Error(`${label} failed with exit code ${result.status}`)
  }

  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  }
}

function sanitizeBranchName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '')
}

main().catch((error) => {
  console.error(`\nWebsite update agent failed: ${error.message}`)
  process.exit(1)
})
