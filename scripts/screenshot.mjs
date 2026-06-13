#!/usr/bin/env node
// UI verification helper for cloud sessions.
//
// Usage:
//   ./node_modules/.bin/vite --port 5173 &
//   node scripts/screenshot.mjs [path] [output.png]
//
// Examples:
//   node scripts/screenshot.mjs /                /tmp/home.png
//   node scripts/screenshot.mjs "?tab=progress"  /tmp/progress.png
//
// Why executablePath: this environment ships a pre-installed Chromium at
// PRE_INSTALLED_CHROMIUM (revision 1194) under PLAYWRIGHT_BROWSERS_PATH, but
// the project's `playwright` version expects a newer revision and
// `npx playwright install` cannot reach cdn.playwright.dev (blocked by the
// network policy). Passing executablePath skips Playwright's revision check
// and drives the pre-installed browser directly — fine for visual/manual
// verification. If a future environment already has the matching revision,
// this falls back to Playwright's default resolution.
//
// Known sandbox noise: requests to fonts.googleapis.com fail with
// net::ERR_CERT_AUTHORITY_INVALID because the sandbox's TLS-intercepting
// proxy isn't trusted by this Chromium build. The app falls back to system
// fonts — this is not an app bug. Only uncaught JS exceptions (pageerror)
// fail this script; failed external resource loads are reported but don't
// affect the exit code.

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const PRE_INSTALLED_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE_URL = process.env.APP_URL || 'http://localhost:5173';

const [, , routeArg = '/', outputArg = '/tmp/screenshot.png'] = process.argv;
const url = /^https?:\/\//.test(routeArg) ? routeArg : `${BASE_URL}${routeArg}`;

const launchOptions = {};
if (existsSync(PRE_INSTALLED_CHROMIUM)) {
  launchOptions.executablePath = PRE_INSTALLED_CHROMIUM;
}

const browser = await chromium.launch(launchOptions);
// Mobile-first app — verify at phone width by default.
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const consoleErrors = [];
const pageErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: outputArg });

console.log(`Saved screenshot to ${outputArg}`);
if (consoleErrors.length) {
  console.error(`\n${consoleErrors.length} console error(s) (informational):`);
  for (const e of consoleErrors) console.error(' -', e);
}
if (pageErrors.length) {
  console.error(`\n${pageErrors.length} uncaught exception(s):`);
  for (const e of pageErrors) console.error(' -', e);
}

await browser.close();
process.exit(pageErrors.length ? 1 : 0);
