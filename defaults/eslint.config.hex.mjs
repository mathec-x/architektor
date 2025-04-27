import { defineConfig } from 'eslint/config';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/*', 'dist/*'],
    rules: {
      camelcase: 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single']
    }
  },
  {
    files: ['**/*.ts'],
    ignores: ['__tests__/*', '__mocks__/*', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'max-len': ['error', { code: 120, ignoreComments: true, ignoreTrailingComments: true }],
      'max-lines': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    plugins: {
      boundaries,
    },
    rules: {
      'boundaries/external': [1, {
        default: 'disallow',
        message: 'External dependencies cannot be imported directly into the system core.' +
          ' Create a specific adapter for the dependency and import it into the main system module.' +
          ' e.g: import { MyAdapter } from @/adapters/my-adapter;',
        rules: [
          {
            from: ['application', 'core'],
            allow: ['@/*']
          }
        ],
      }],
    },
    settings: {
      'boundaries/elements': [
        { type: 'application', pattern: 'src/application/**' },
        { type: 'core', pattern: 'src/core/**' }
      ]
    }
  }
]);