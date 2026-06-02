import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';

const BASE = process.env.BASE || 'http://localhost:5174/';
const OUT  = '/tmp/journeys';
mkdirSync(OUT, { recursive: true });

const log    = [];
const errors = [];
let   shot   = 1;

const snap = async (page, name) => {
  const file = `${OUT}/${String(shot++).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: file, fullPage: false });
  log.push(`  📸 ${file}`);
  return file;
};

const say = msg => { log.push(msg); console.log(msg); };

const clickTab = async (page, label) => {
  // BottomNav renders text labels — match exactly
  const loc = page.locator(`nav >> text="${label}"`).first();
  if (!await loc.count()) {
    // fallback: any element with that exact text
    const fb = page.locator(`text="${label}"`).last();
    if (!await fb.count()) { say(`  ⚠ Tab "${label}" not found`); return false; }
    await fb.click({ timeout: 4000 });
  } else {
    await loc.click({ timeout: 4000 });
  }
  await page.waitForTimeout(900);
  return true;
};

// ─── Browser setup ───────────────────────────────────────────────────────────
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

// Pre-seed auth so we land in the app, not the onboarding screen
await ctx.addInitScript(() => {
  localStorage.setItem('riseUser', JSON.stringify({
    loggedIn: true,
    name: 'Journey Bot',
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
  }));
});

const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

// ─── 1. Home ─────────────────────────────────────────────────────────────────
say('\n── 1. Home tab ──');
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await snap(page, 'home');

// ─── 2. Subjects tab ─────────────────────────────────────────────────────────
say('\n── 2. Subjects tab ──');
await clickTab(page, 'Subjects');
await snap(page, 'subjects');

// Tap a subject card (History is first real one)
say('  → tapping History subject card');
const historyCard = page.locator('text=/History/i').first();
if (await historyCard.count()) {
  await historyCard.click({ timeout: 4000 });
  await page.waitForTimeout(1000);
  await snap(page, 'subjects-history');

  // Open the first available module inside History
  say('  → opening first module in History');
  const moduleBtn = page.locator('button, [role="button"]').filter({ hasText: /Jupiter|Plague|Surgery|Medicine/i }).first();
  if (await moduleBtn.count()) {
    await moduleBtn.click({ timeout: 4000 });
    await page.waitForTimeout(1500);
    await snap(page, 'module-player');

    // Let a chapter screen load and screenshot
    await page.waitForTimeout(1000);
    await snap(page, 'module-chapter');

    // Try pressing a CTA button to advance
    const cta = page.locator('button').filter({ hasText: /continue|start|begin|next|got it|ready/i }).first();
    if (await cta.count()) {
      say('  → advancing past intro CTA');
      await cta.click({ timeout: 3000 });
      await page.waitForTimeout(1200);
      await snap(page, 'module-first-screen');
    }

    // Navigate back out
    const backBtn = page.locator('[aria-label*="back" i], [aria-label*="exit" i], button:has-text("←"), button:has-text("Back")').first();
    if (await backBtn.count()) {
      await backBtn.click({ timeout: 3000 });
      await page.waitForTimeout(800);
    } else {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.waitForTimeout(900);
    }
  } else {
    say('  ⚠ No module button found inside History');
  }
} else {
  say('  ⚠ History card not found');
}

// ─── 3. Pulse tab ────────────────────────────────────────────────────────────
say('\n── 3. Pulse tab ──');
await clickTab(page, 'Pulse');
await snap(page, 'pulse');

// Trigger 90s quickfire from Pulse
say('  → starting 90s Quick Fire');
const quickFireBtn = page.locator('button, [role="button"]').filter({ hasText: /90s|quick.?fire|start/i }).first();
if (await quickFireBtn.count()) {
  await quickFireBtn.click({ timeout: 4000 });
  await page.waitForTimeout(1500);
  await snap(page, 'quickfire-start');

  // Answer first question if a choice appears
  const choice = page.locator('button').filter({ hasText: /.{3,}/ }).nth(1);
  if (await choice.count()) {
    await choice.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);
    await snap(page, 'quickfire-question');
  }

  // Exit back
  const exitBtn = page.locator('[aria-label*="exit" i], button:has-text("Exit"), button:has-text("✕")').first();
  if (await exitBtn.count()) {
    await exitBtn.click({ timeout: 3000 });
    await page.waitForTimeout(700);
  } else {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
  }
} else {
  say('  ⚠ Quick Fire button not found on Pulse tab');
}

// ─── 4. Exams tab ────────────────────────────────────────────────────────────
say('\n── 4. Exams tab ──');
await clickTab(page, 'Exams');
await snap(page, 'exams');

// Try Random Quick Fire on Exams tab
say('  → tapping Random Quick Fire Go button');
const examGoBtn = page.locator('text=/Go/i').first();
if (await examGoBtn.count()) {
  await examGoBtn.click({ timeout: 4000 });
  await page.waitForTimeout(1500);
  await snap(page, 'exams-quickfire');

  const exitBtn2 = page.locator('[aria-label*="exit" i], button:has-text("Exit")').first();
  if (await exitBtn2.count()) {
    await exitBtn2.click({ timeout: 3000 });
    await page.waitForTimeout(700);
  } else {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
  }
}

// Try tapping a subject on Exams tab (e.g. Sociology)
say('  → selecting Sociology on Exams tab');
await clickTab(page, 'Exams');
const socBtn = page.locator('text=/Sociology/i').first();
if (await socBtn.count()) {
  await socBtn.click({ timeout: 4000 });
  await page.waitForTimeout(1200);
  await snap(page, 'exams-sociology');
}

// ─── 5. Home tab — resume card & weak zone ───────────────────────────────────
say('\n── 5. Home — resume + weak zone ──');
await clickTab(page, 'Home');
await page.waitForTimeout(600);
await snap(page, 'home-2');

const focusLink = page.locator('text=/focus topics|weak/i').first();
if (await focusLink.count()) {
  say('  → tapping focus/weak zone link');
  await focusLink.click({ timeout: 3000 });
  await page.waitForTimeout(1000);
  await snap(page, 'home-weak-zone');
}

// ─── Summary ─────────────────────────────────────────────────────────────────
say('\n=== JOURNEY COMPLETE ===');
console.log(log.join('\n'));
console.log(`\n=== JS ERRORS (${errors.length}) ===`);
console.log(errors.slice(0, 30).join('\n') || '(none)');

await browser.close();
