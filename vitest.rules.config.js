import { defineConfig } from 'vitest/config'

// Standalone config for the Firestore security-rules suite. Kept separate from
// vitest.config.js (which wires in Storybook/browser projects) so the rules
// tests run in a plain node environment against the Firestore emulator. Run
// via `pnpm test:rules`, which wraps this in `firebase emulators:exec` so the
// emulator is up and FIRESTORE_EMULATOR_HOST is set. These tests never touch
// live Firebase.
export default defineConfig({
  test: {
    include: ['tests/rules/**/*.test.js'],
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 40000,
    fileParallelism: false,
  },
})
