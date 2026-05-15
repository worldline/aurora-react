import eslintReact from '@eslint-react/eslint-plugin'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import { configs as tseslint } from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    'dist',
    '.releaserc.cjs',
    'src/components/icons/*',
    '!src/components/icons/*stories*',
    'storybook-static',
    'terraform',
    '.vitest-attachments',
    '.vitest-reports',
    '__tests__/start-playwright-container.mjs',
  ]),
  {
    extends: [
      js.configs.recommended,
      eslintPluginPrettierRecommended,
      reactHooks.configs.flat.recommended,
      eslintReact.configs['recommended-typescript'],
      reactDom.configs.recommended,
      tseslint.strictTypeChecked,
      tseslint.stylisticTypeChecked,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@eslint-react/jsx-no-children-prop': 'error',
      '@eslint-react/no-forward-ref': 'error',
      '@eslint-react/no-leaked-conditional-rendering': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      eqeqeq: 'error',
      'no-console': 'error',
      'no-duplicate-imports': 'error',
      'no-restricted-syntax': ['error', 'FunctionDeclaration'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '[./]*main',
              message: 'Import { MyComponent } from ../MyComponent instead',
            },
          ],
        },
      ],
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/unsupported-syntax': 'error',
      'react-hooks/incompatible-library': 'error',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@eslint-react/jsx-no-children-prop': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedInlineConfigs: 'error',
      reportUnusedDisableDirectives: 'error',
    },
  },
])
