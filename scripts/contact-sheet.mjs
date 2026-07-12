#!/usr/bin/env node
// Chapter contact sheet — renders every screen of a module in the real render
// path at 390px and writes numbered PNGs plus an index.html grid, so a whole
// chapter's hierarchy, density and rhythm can be reviewed in one scroll.
// Design: docs/superpowers/specs/2026-07-12-chapter-contact-sheet-design.md
//
// Usage:
//   node scripts/contact-sheet.mjs <module-id> [--full]
//
//   --full     full-page (scrolling) captures instead of the 390x844 fold view
//   APP_URL    optional running DEV server to use; otherwise this script
//              starts `vite --port 5199` itself and stops it afterwards.
//              Must be a dev server — the ?module=<id>&screen=<n> jump seam
//              in LegacyApp.jsx is import.meta.env.DEV only.
//
// Output: contact-sheets/<module-id>/ (gitignored), overwritten per run.

import { chromium } from 'playwright'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { MODULES } from '../src/modules.js'

const PRE_INSTALLED_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FALLBACK_PORT = 5199
// LegacyApp shows its splash for 1400ms on every mount; wait it out plus a
// settle margin for lazy module content and reduced-motion resting states.
const SETTLE_MS = 2400

const args = process.argv.slice(2)
const fullPage = args.includes('--full')
const moduleId = args.find(a => !a.startsWith('--'))

const mod = MODULES.find(m => m.id === moduleId)
if (!mod || !mod.screenCount) {
  const available = MODULES.filter(m => m.screenCount > 0).map(m => `  ${m.id} (${m.screenCount} screens)`)
  console.error(mod ? `Module "${moduleId}" has no screens.` : `Unknown module id: ${moduleId ?? '(none given)'}`)
  console.error(`\nAvailable modules:\n${available.join('\n')}`)
  process.exit(2)
}

const outDir = path.join(REPO_ROOT, 'contact-sheets', mod.id)
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

// ── Dev server: reuse APP_URL when it responds, otherwise start vite ─────────

async function isUp(url) {
  try { await fetch(url); return true } catch { return false }
}

let viteProc = null
let baseUrl = process.env.APP_URL || `http://localhost:${FALLBACK_PORT}`

if (!(await isUp(baseUrl))) {
  if (process.env.APP_URL) {
    console.error(`APP_URL ${baseUrl} is not responding.`)
    process.exit(2)
  }
  console.log(`Starting vite on :${FALLBACK_PORT} …`)
  viteProc = spawn('./node_modules/.bin/vite', ['--port', String(FALLBACK_PORT), '--strictPort'], {
    cwd: REPO_ROOT,
    stdio: 'ignore',
  })
  const deadline = Date.now() + 30_000
  while (!(await isUp(baseUrl))) {
    if (Date.now() > deadline || viteProc.exitCode !== null) {
      console.error('vite did not become ready within 30s.')
      viteProc?.kill()
      process.exit(2)
    }
    await new Promise(r => setTimeout(r, 300))
  }
}

const stopVite = () => { try { viteProc?.kill() } catch { /* already gone */ } }
process.on('exit', stopVite)

// ── Browser ──────────────────────────────────────────────────────────────────

const launchOptions = {}
if (existsSync(PRE_INSTALLED_CHROMIUM)) launchOptions.executablePath = PRE_INSTALLED_CHROMIUM

const browser = await chromium.launch(launchOptions)
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
})

// Pass the auth gate before app boot: riseUser is a deliberately unscoped raw
// key (src/lib/storage.js RAW_KEYS); shape per AuthContext.completeOnboarding.
await context.addInitScript(() => {
  localStorage.setItem('riseUser', JSON.stringify({
    loggedIn: true,
    name: 'Review',
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
    provider: 'guest',
  }))
})

const page = await context.newPage()
const frameErrors = []
page.on('pageerror', err => frameErrors.push({ frame: currentFrame, message: err.message }))

let currentFrame = ''

async function capture(route, fileName) {
  currentFrame = fileName
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(SETTLE_MS)
  await page.screenshot({ path: path.join(outDir, fileName), fullPage })
  console.log(`  ${fileName}`)
}

// ── Frames: hook first (clean state), then screens 0…N-1 ────────────────────

console.log(`\n${mod.id} — "${mod.title}" — ${mod.screenCount} screens\n`)

const frames = []

await capture(`/?module=${encodeURIComponent(mod.id)}`, 'frame-000-hook.png')
frames.push({ file: 'frame-000-hook.png', label: 'hook' })

// The jump seam only marks hook/wyl/intro done for screen > 0, so seed the
// module state ourselves before asking for screen 0 (guest scope, see
// src/lib/storage.js physicalKey).
await page.evaluate((id) => {
  localStorage.setItem(`guest::gcse_module_${id}`, JSON.stringify({
    screen: 0, hookDone: true, wylDone: true, introDone: true,
  }))
}, mod.id)

for (let i = 0; i < mod.screenCount; i++) {
  const tag = mod.screenTags?.[i] || null
  const file = `frame-${String(i + 1).padStart(3, '0')}-s${String(i).padStart(2, '0')}${tag ? `-${tag}` : ''}.png`
  await capture(`/?module=${encodeURIComponent(mod.id)}&screen=${i}`, file)
  frames.push({ file, label: `screen ${i}${tag ? ` — ${tag}` : ''}` })
}

await browser.close()
stopVite()

// ── Contact sheet ────────────────────────────────────────────────────────────

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const sheet = `<!doctype html>
<meta charset="utf-8">
<title>${esc(mod.title)} — contact sheet</title>
<style>
  body { background: #08090D; color: #E8EAF0; font: 14px/1.5 system-ui, sans-serif; margin: 24px; }
  h1 { font-size: 18px; font-weight: 600; }
  p.meta { color: #8A8FA3; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 24px; }
  figure { margin: 0; }
  img { width: 100%; border: 1px solid #262A38; border-radius: 8px; display: block; }
  figcaption { color: #8A8FA3; font-size: 12px; margin-top: 6px; }
</style>
<h1>${esc(mod.title)}</h1>
<p class="meta">${esc(mod.id)} · ${mod.screenCount} screens + hook · ${fullPage ? 'full-page' : '390×844 fold'} · generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</p>
<div class="grid">
${frames.map(f => `  <figure><a href="${f.file}"><img src="${f.file}" loading="lazy" alt="${esc(f.label)}"></a><figcaption>${esc(f.label)}</figcaption></figure>`).join('\n')}
</div>
`
writeFileSync(path.join(outDir, 'index.html'), sheet)

console.log(`\nContact sheet: ${path.relative(REPO_ROOT, path.join(outDir, 'index.html'))}`)

if (frameErrors.length) {
  console.error(`\n${frameErrors.length} uncaught exception(s):`)
  for (const e of frameErrors) console.error(` - [${e.frame}] ${e.message}`)
}
process.exit(frameErrors.length ? 1 : 0)
