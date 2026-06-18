import { defineConfig, mergeConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync } from 'fs'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// Some cloud sandboxes ship a pre-installed Chromium revision that's older
// than what this Playwright version expects, and can't reach
// cdn.playwright.dev to fetch the matching one (see scripts/screenshot.mjs
// for the same workaround). Use it only if present; otherwise fall back to
// Playwright's normal browser resolution.
const PRE_INSTALLED_HEADLESS_SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
const playwrightLaunchOptions = existsSync(PRE_INSTALLED_HEADLESS_SHELL)
  ? { executablePath: PRE_INSTALLED_HEADLESS_SHELL }
  : {}

// Runs Storybook stories as Vitest browser tests — see
// https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
//
// Kept separate from vite.config.js: vitest statically imports
// 'vite/module-runner', which the pinned vite@5 doesn't export. Loading that
// import only when running vitest (not `vite build`) keeps the production
// build working regardless of how the package manager resolves vitest's vite
// peer dependency.
export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [
      {
        extends: false,
        test: {
          name: 'architecture',
          include: ['tests/architecture/**/*.test.js'],
          environment: 'node',
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: resolve(__dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: playwrightLaunchOptions }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}))
