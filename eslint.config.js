const eslintPluginPrettier = require('eslint-plugin-prettier');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'packages/*/dist/',
      'packages/*/build/',
    ],
  },
  // Allow root and tooling config files (vite.config.ts, *.config.ts) to be parsed
  // without requiring them to be listed in a package tsconfig include.
  {
    files: ['**/vite.config.ts', '**/*.config.ts', '**/scripts/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: undefined,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    // Only lint TypeScript source files inside package source directories. Tooling
    // files (vite.config.ts, scripts, etc.) live outside these globs and will be
    // handled by separate overrides.
    files: ['packages/api/**/*.{ts,tsx}', 'packages/frontend/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Point to each package tsconfig so the parser can map files correctly.
        // Explicit files work more reliably than a glob in some ESLint+TS setups.
        project: ['./packages/api/tsconfig.json', './packages/frontend/tsconfig.app.json'],
        sourceType: 'module',
      },
      ecmaVersion: 2021,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: Object.assign({}, tseslint.configs.recommended.rules, {
      'prettier/prettier': 'error',
    }),
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
