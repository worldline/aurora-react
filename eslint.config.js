import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintReact from '@eslint-react/eslint-plugin'
import reactDom from 'eslint-plugin-react-dom'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores([
    'dist',
    '*.config.*js',
    'src/components/icons/*',
    '!src/components/icons/*stories*',
    'import-icon.ts',
  ]),
  {
    extends: [
      js.configs.recommended,
      eslintPluginPrettierRecommended,
      reactHooks.configs.flat.recommended,
      eslintReact.configs['recommended-typescript'],
      reactDom.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
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
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
        },
      ],
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
    linterOptions: {
      reportUnusedInlineConfigs: 'error',
      reportUnusedDisableDirectives: 'error',
    },
  },
])
