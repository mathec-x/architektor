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
      'max-len': ['error', { code: 120 }],
      camelcase: 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single']
    }
  }
];