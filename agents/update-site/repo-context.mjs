import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const SKIP_DIRS = new Set(['.git', 'dist', 'node_modules'])

const ALLOWED_ROOT_FILES = new Set([
  'index.html',
  'package.json',
  'vite.config.js',
])

const ALLOWED_PREFIXES = [
  '.github/workflows/',
  'agents/update-site/',
  'api/',
  'public/figures/',
  'scripts/',
  'src/',
]

const TEXT_FILE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.yml',
  '.yaml',
])

export function toRepoPath(rootDir, filePath) {
  const absolute = path.resolve(rootDir, filePath)
  const relative = path.relative(rootDir, absolute).replaceAll(path.sep, '/')
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository root: ${filePath}`)
  }
  return relative
}

export function isAllowedPath(repoPath) {
  if (!repoPath || repoPath.includes('\0')) return false
  if (repoPath.startsWith('/') || repoPath.includes('..')) return false
  return ALLOWED_ROOT_FILES.has(repoPath) || ALLOWED_PREFIXES.some((prefix) => repoPath.startsWith(prefix))
}

export function assertAllowedPath(repoPath) {
  if (!isAllowedPath(repoPath)) {
    throw new Error(`Path is outside the update agent allowlist: ${repoPath}`)
  }
}

export function walkRepository(rootDir) {
  const results = []

  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue

      const absolute = path.join(dir, entry.name)
      const repoPath = toRepoPath(rootDir, absolute)

      if (entry.isDirectory()) {
        visit(absolute)
        continue
      }

      const stats = statSync(absolute)
      results.push({
        path: repoPath,
        size: stats.size,
        allowed: isAllowedPath(repoPath),
      })
    }
  }

  visit(rootDir)
  return results.sort((a, b) => a.path.localeCompare(b.path))
}

export function buildRepoBriefing(rootDir) {
  const files = walkRepository(rootDir)
  const allowedFiles = files.filter((file) => file.allowed)

  const manifest = allowedFiles
    .map((file) => `- ${file.path} (${file.size} bytes)`)
    .join('\n')

  return `Allowed paths:
- ${Array.from(ALLOWED_ROOT_FILES).join('\n- ')}
- ${ALLOWED_PREFIXES.join('\n- ')}

Known editable files:
${manifest}

Content map:
- src/content.js: History Medicine home-session topic data.
- src/modules.js: Interactive History module screens and block schema.
- src/data/*Topics.js: Maths, English, Chemistry, and Sociology topic/question banks.
- src/App.jsx: Main app shell plus some inline test question data. Prefer smaller data files where possible.
- public/figures/ and src/figures.js: Biology figure assets and their keys.
- api/grade.js: Claude-powered exam marking API, not the place for GitHub automation.`
}

export function chooseInitialContextPaths(request, rootDir) {
  const lower = request.toLowerCase()
  const paths = new Set(['package.json', 'vite.config.js', 'src/modules.js', 'src/content.js'])

  const keywordMap = [
    { keywords: ['math', 'maths', 'algebra', 'geometry'], path: 'src/data/mathsTopics.js' },
    { keywords: ['english', 'language', 'poetry', 'quote'], path: 'src/data/englishTopics.js' },
    { keywords: ['chem', 'chemistry', 'molecule', 'atom'], path: 'src/data/chemistryTopics.js' },
    { keywords: ['sociology', 'family', 'education', 'crime'], path: 'src/data/sociologyTopics.js' },
    { keywords: ['image', 'figure', 'diagram', 'biology'], path: 'src/figures.js' },
    { keywords: ['style', 'css', 'colour', 'color', 'layout'], path: 'src/styles.css' },
    { keywords: ['grade', 'marking', 'examiner', 'feedback'], path: 'api/grade.js' },
    { keywords: ['test', 'paper', 'question', 'biology', 'history'], path: 'src/App.jsx' },
  ]

  for (const item of keywordMap) {
    if (item.keywords.some((keyword) => lower.includes(keyword))) {
      paths.add(item.path)
    }
  }

  return Array.from(paths).filter((repoPath) => {
    try {
      assertAllowedPath(repoPath)
      statSync(path.join(rootDir, repoPath))
      return true
    } catch {
      return false
    }
  })
}

export function readContextFile(rootDir, repoPath, maxChars) {
  const normalized = toRepoPath(rootDir, repoPath)
  assertAllowedPath(normalized)

  const absolute = path.join(rootDir, normalized)
  const stats = statSync(absolute)
  if (!stats.isFile()) {
    throw new Error(`Context path is not a file: ${normalized}`)
  }

  const extension = path.extname(normalized)
  if (!TEXT_FILE_EXTENSIONS.has(extension)) {
    throw new Error(`Context path is not a supported text file: ${normalized}`)
  }

  const full = readFileSync(absolute, 'utf8')
  if (full.length <= maxChars) {
    return { path: normalized, size: stats.size, content: full, truncated: false }
  }

  const headLength = Math.floor(maxChars * 0.65)
  const tailLength = maxChars - headLength
  const content = `${full.slice(0, headLength)}

[... ${full.length - maxChars} characters omitted from the middle of ${normalized} ...]

${full.slice(full.length - tailLength)}`

  return { path: normalized, size: stats.size, content, truncated: true }
}

export function readContextFiles(rootDir, repoPaths, maxChars) {
  const seen = new Set()
  const files = []

  for (const repoPath of repoPaths) {
    const normalized = toRepoPath(rootDir, repoPath)
    if (seen.has(normalized)) continue
    seen.add(normalized)
    files.push(readContextFile(rootDir, normalized, maxChars))
  }

  return files
}

export function validatePatchPaths(patch) {
  const changed = new Set()
  const pathPattern = /^diff --git a\/(.+?) b\/(.+)$/gm
  let match

  while ((match = pathPattern.exec(patch)) !== null) {
    changed.add(match[1])
    changed.add(match[2])
  }

  if (changed.size === 0) {
    throw new Error('Patch did not contain any diff --git file headers.')
  }

  for (const repoPath of changed) {
    if (repoPath === '/dev/null') continue
    assertAllowedPath(repoPath)
  }

  return Array.from(changed).filter((repoPath) => repoPath !== '/dev/null')
}
