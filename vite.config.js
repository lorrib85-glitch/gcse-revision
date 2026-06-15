import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: './',
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
  // Runs Storybook stories as Vitest browser tests — see
  // https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
  test: {
    projects: [
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
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
