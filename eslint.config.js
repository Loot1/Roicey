import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `.react-router` holds the route types React Router generates on each build.
  globalIgnores(['dist', '.react-router']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Route modules export their component alongside the framework's own
      // conventional exports; that is the documented shape, not a mistake.
      'react-refresh/only-export-components': [
        'warn',
        { allowExportNames: ['meta', 'links', 'headers', 'loader', 'action', 'handle', 'shouldRevalidate'] },
      ],
    },
  },
])
