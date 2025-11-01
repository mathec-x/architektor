import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignorePatterns: ['node_modules/', 'dist/'],
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
      'max-lines': ['warn', { max: 75, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  }
];