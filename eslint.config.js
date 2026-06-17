import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import noHardcodedTokens from './eslint-rules/no-hardcoded-design-tokens.js'

export default [
  { ignores: ['dist/**', 'storybook-static/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        jsxPragma: null,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'custom-rules': {
        rules: {
          'no-hardcoded-design-tokens': noHardcodedTokens,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Empty `catch {}` blocks are an intentional pattern here (silent
      // localStorage read/write failures) — only flag other empty blocks.
      'no-empty': ['error', { allowEmptyCatch: true }],

      // Props aren't typed with PropTypes in this codebase.
      'react/prop-types': 'off',

      // Plain apostrophes/quotes in JSX copy are fine — this app's content is
      // natural-language educational text, not HTML needing entity-escaping.
      'react/no-unescaped-entities': 'off',

      // This app's primary interaction is full-screen `onClick` divs (tap-to-continue
      // cinematic screens), not buttons — don't flag that established pattern.
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',

      // ─── GCSE App Custom Rules ─────────────────────────────────────────
      // Enforce design token usage for consistency across headings, buttons, spacing
      'custom-rules/no-hardcoded-design-tokens': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['src/App.jsx'],
    rules: {
      // App.jsx intentionally hosts many top-level components/helpers — see CLAUDE.md
      'react-refresh/only-export-components': 'off',
    },
  },
]
