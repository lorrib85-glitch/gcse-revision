/**
 * Journey: Medicine Through Time — Module 1 "Trust me, I'm Following Jupiter"
 * Hook → WYL → screens 0-6 (visualNarrative, conceptReveal ×2, interactiveImage,
 *                            unknown, galensDiagnostic, quickRecall)
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';

const BASE = process.env.BASE || 'http://localhost:5174/';
const OUT  = '/tmp/chapter1';
mkdirSync(OUT, { recursive: true });

const log    = [];
const errors = [];
let   shot   = 1;

const snap = async (page, label) => {
  const file = `${OUT}/${String(shot++).padStart(2,'0')}-${label}.png`;
  await page.screenshot({ path: file });
  log.push(`  📸 [${label}]`);
  return file;
};
const say = msg => { log.push(msg); console.log(msg); };

// Wait up to `maxMs` for a button matching `re` to appear, then click it.
// Returns true on success.
const waitAndTap = async (page, re, maxMs = 20000, label = '') => {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const loc = page.locator('button').filter({ hasText: re }).first();
    if (await loc.count() && await loc.isVisible()) {
      await loc.click({ timeout: 4000 });
      say(`  ✓ tapped "${label || re}" after ${Date.now() - start}ms`);
      return true;
    }
    await page.waitForTimeout(400);
  }
  say(`  ⚠ timed out waiting for "${label || re}" (${maxMs}ms)`);
  return false;
};

// Advance a screen by tapping content area until "Continue →" appears, then clicking it.
// Also handles "Start chapter →" (WYL) and generic next/done buttons.
const ADVANCE_RE = /^(Continue|Start chapter|Next|Done|Got it)/i;

const advanceScreen = async (page, label, maxTaps = 15) => {
  for (let i = 0; i < maxTaps; i++) {
    const cont = page.locator('button').filter({ hasText: ADVANCE_RE }).first();
    if (await cont.count() && await cont.isVisible()) {
      const txt = await cont.innerText().catch(() => '?');
      // force:true bypasses ConceptReveal/InteractiveHotspotImage fixed overlays
      await cont.click({ timeout: 3000, force: true });
      say(`    [${label}] tap ${i}: clicked "${txt.trim()}"`);
      await page.waitForTimeout(600);
      return true;
    }
    // Tap right-centre of screen — ConceptReveal intercepts this as advance()
    await page.locator('body').click({ position: { x: 260, y: 430 }, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(550);
  }
  say(`    [${label}] gave up after ${maxTaps} taps`);
  return false;
};

// ─── Browser ──────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
await ctx.addInitScript(() => {
  localStorage.setItem('riseUser', JSON.stringify({
    loggedIn: true, name: 'Journey Bot', onboardingComplete: true,
    createdAt: new Date().toISOString(),
  }));
  // Clear saved module state so we always start from screen 0
  Object.keys(localStorage)
    .filter(k => k.startsWith('moduleState_') || k === 'gcse_quickfire_memory_v1')
    .forEach(k => localStorage.removeItem(k));
});

const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));

// ─── 1. Navigate to the module ───────────────────────────────────────────────
say('── 1. Navigate ──');
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

await page.locator('text="Subjects"').last().click();
await page.waitForTimeout(700);

await page.locator('button').filter({ hasText: /Medicine Through Time/i }).first().click({ timeout: 4000 });
await page.waitForTimeout(900);
await snap(page, '01-subject-browser');

await page.locator('button').filter({ hasText: /Following Jupiter/i }).first().click({ timeout: 4000 });
await page.waitForTimeout(1500);
await snap(page, '02-module-open');

// ─── 2. Chapter Hook ─────────────────────────────────────────────────────────
// Buttons appear after a word-count delay, so we wait for them
say('\n── 2. Chapter Hook (True/False) ──');
await waitAndTap(page, /^TRUE$/i, 8000, 'TRUE');
await page.waitForTimeout(400);
await snap(page, '03-hook-answered');

// Beats auto-advance (~14 s total for 5 beats). Wait up to 25 s for "Continue →"
say('  waiting for all hook beats to auto-advance...');
await snap(page, '04-hook-beat1');
await page.waitForTimeout(5000);
await snap(page, '05-hook-beat-mid');
const hookDone = await waitAndTap(page, /^Continue →/i, 18000, 'Continue → (hook)');
await page.waitForTimeout(600);
await snap(page, '06-hook-done');

// ─── 3. WYL screen ───────────────────────────────────────────────────────────
say('\n── 3. WYL (What You\'ll Learn) ──');
await page.waitForTimeout(500);
await snap(page, '07-wyl');
const wylDone = await waitAndTap(page, /Start chapter/i, 6000, 'Start chapter →');
await page.waitForTimeout(800);
await snap(page, '08-wyl-done');

// ─── 4. Screen 0 — visualNarrative ───────────────────────────────────────────
say('\n── 4. Screen 0: visualNarrative ──');
await page.waitForTimeout(600);
await snap(page, '09-s0-start');
// visualNarrative: tap through image beats, then Continue
await advanceScreen(page, 'visualNarrative', 18);
await page.waitForTimeout(700);
await snap(page, '10-s0-done');

// ─── 5. Screen 1 — conceptReveal "The Germ Problem" ─────────────────────────
say('\n── 5. Screen 1: conceptReveal ──');
await page.waitForTimeout(600);
await snap(page, '11-s1-start');
await advanceScreen(page, 'conceptReveal-1', 18);
await page.waitForTimeout(700);
await snap(page, '12-s1-done');

// ─── 6. Screen 2 — conceptReveal "The Problem" ───────────────────────────────
say('\n── 6. Screen 2: conceptReveal ──');
await page.waitForTimeout(600);
await snap(page, '13-s2-start');
await advanceScreen(page, 'conceptReveal-2', 18);
await page.waitForTimeout(700);
await snap(page, '14-s2-done');

// ─── 7. Screen 3 — interactiveImage "Four Humours" ───────────────────────────
say('\n── 7. Screen 3: interactiveImage ──');
await page.waitForTimeout(600);
await snap(page, '15-s3-intro');

// Phase 1: tap the CTA to enter explore mode
await waitAndTap(page, /Explore|Explore the body/i, 6000, 'Explore CTA');
await page.waitForTimeout(1200);
await snap(page, '16-s3-hotspots');

// Phase 2: tap each hotspot DOT by aria-label (the text label divs have pointerEvents:none)
// LearningHeader is fixed at top:10px, height≈44px → occupies y≈10–54.
// Deselect by clicking y≈70 (below header, above image at y=80, inside IHI tap-outside overlay).
// Use force:true on the hotspot click so the tap-outside overlay (zIndex:25) doesn't block it.
for (const label of ['Blood', 'Phlegm', 'Yellow Bile', 'Black Bile']) {
  const dot = page.locator(`button[aria-label="Explore ${label}"]`);
  if (await dot.count()) {
    await dot.first().click({ timeout: 3000, force: true });
    await page.waitForTimeout(700);
    say(`  tapped hotspot dot: ${label}`);
    // Deselect: y=70 is below the LearningHeader (ends ~y=54) but inside the IHI overlay
    await page.locator('body').click({ position: { x: 195, y: 70 }, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(500);
  } else {
    say(`  ⚠ hotspot dot not found: ${label}`);
  }
}
await snap(page, '17-s3-explored');

// Phase 3: Continue → becomes opacity:1/pointerEvents:auto when allDone && !selected.
// advanceScreen already uses force:true so it can reach the button even through sibling divs.
say('  waiting for IHI Continue →...');
await advanceScreen(page, 'interactiveImage-done', 10);
await page.waitForTimeout(700);
await snap(page, '18-s3-done');

// ─── 8. Screen 4 — unknown ───────────────────────────────────────────────────
say('\n── 8. Screen 4: unknown ──');
await page.waitForTimeout(600);
await snap(page, '19-s4-start');
await advanceScreen(page, 'screen4', 15);
await page.waitForTimeout(700);
await snap(page, '20-s4-done');

// ─── 9. Screen 5 — galensDiagnostic ─────────────────────────────────────────
say('\n── 9. Screen 5: galensDiagnostic ──');
await page.waitForTimeout(600);
await snap(page, '21-s5-start');

// Select at least one symptom (anything that's not Analyse/Continue)
{
  const galensOpt = page.locator('button').filter({ hasText: /.{3,}/ })
    .filter({ hasNotText: /Analyse/i })
    .filter({ hasNotText: ADVANCE_RE })
    .first();
  if (await galensOpt.count()) {
    const t = await galensOpt.innerText();
    say(`  selecting symptom: "${t.trim().slice(0,40)}"`);
    await galensOpt.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
}

// Submit — GalensDiagnostic uses "Analyse symptoms →" not Continue
const analysed = await waitAndTap(page, /Analyse/i, 4000, 'Analyse symptoms →');
if (!analysed) say('  ⚠ Analyse button not found');
// Beats 1 (pills, ≈900ms) + 2 (spin, 2800ms) auto-advance — wait for them both
await page.waitForTimeout(4200);
// Now in beat 3 (diagnosis reveal). Click Continue → for beats 3, 4, and 5.
// Beat 5's Continue calls onContinue → advances to screen 6 (quickRecall).
for (let b = 3; b <= 5; b++) {
  await advanceScreen(page, `gd-beat${b}`, 6);
  await page.waitForTimeout(700);
}
await snap(page, '22-s5-done');

// ─── 10. Screen 6 — quickRecall ──────────────────────────────────────────────
say('\n── 10. Screen 6: quickRecall ──');
await page.waitForTimeout(600);
await snap(page, '23-s6-start');

// QuickRecallScreen shows TRUE/FALSE or multiple-choice questions one at a time.
// Answer each question (TRUE first; fall back to first choice option), then Continue → appears.
for (let qi = 0; qi < 10; qi++) {
  const contBtn = page.locator('button').filter({ hasText: ADVANCE_RE }).first();
  if (await contBtn.count() && await contBtn.isVisible()) break;

  await page.waitForTimeout(900); // btnsReady delay (640ms+ based on word count)

  // True/false question?
  const trueBtn = page.locator('button').filter({ hasText: /^TRUE$/i }).first();
  if (await trueBtn.count() && await trueBtn.isVisible()) {
    await trueBtn.click({ timeout: 3000 }).catch(() => {});
    say(`  answered q${qi + 1}: TRUE`);
    await page.waitForTimeout(950);
    continue;
  }

  // Multiple-choice question: click the first option (not Continue/Back/TRUE/FALSE)
  const choiceBtn = page.locator('button').filter({ hasText: /.{5,}/ })
    .filter({ hasNotText: ADVANCE_RE })
    .filter({ hasNotText: /^(TRUE|FALSE)$/i })
    .first();
  if (await choiceBtn.count()) {
    const t = await choiceBtn.innerText();
    say(`  answered q${qi + 1}: "${t.trim().slice(0, 40)}"`);
    await choiceBtn.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(950);
  }
}
await snap(page, '24-s6-answered');
// Continue → now visible (all questions done) — advanceScreen clicks it
await advanceScreen(page, 'quickRecall', 8);
await page.waitForTimeout(700);
await snap(page, '25-s6-done');

// Final snapshot
await snap(page, '26-end');

// ─── Summary ─────────────────────────────────────────────────────────────────
say('\n=== COMPLETE ===');
console.log(log.join('\n'));
console.log(`\n=== JS ERRORS (${errors.length}) ===`);
console.log(errors.slice(0, 20).join('\n') || '(none)');

await browser.close();
