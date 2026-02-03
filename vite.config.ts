/// <reference types="vitest/config" />
import { createHash } from 'node:crypto'
import { extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { globSync } from 'glob'
import preserveDirectives from 'rollup-preserve-directives'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    tsconfigPaths(),
    dts({
      tsconfigPath: fileURLToPath(
        new URL('tsconfig.lib.json', import.meta.url),
      ),
      exclude: [
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '__tests__/*.ts',
        '__tests__/*.tsx',
        '.storybook/*.ts',
        '.storybook/*.tsx',
      ],
    }),
    preserveDirectives(),
  ],
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: (className, filename) => {
        if (className === 'dark') {
          return className
        }
        const hash = createHash('sha256')
          .update(filename)
          .update(className)
          .digest('base64')
          .replace(/\//g, '')
          .replace(/\+/g, '')
          .substring(0, 5)
        return `${className}__${hash}`
      },
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(new URL('src/components/main.ts', import.meta.url)),
      formats: ['es'],
    },
    rolldownOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'classnames',
        'react-aria-components',
      ],
      input: Object.fromEntries(
        globSync(
          [
            'src/styles/styles.css',
            'src/assets/fonts/fonts.css',
            'src/**/*.{ts,tsx}',
          ],
          {
            ignore: [
              'src/**/*types*.ts',
              'src/**/*stories*.{ts,tsx}',
              'src/**/*test.{ts,tsx}',
              '__tests__/*.{ts,tsx}',
            ],
          },
        ).map((file) => [
          relative('src', file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './__tests__/setupVitest.ts',
    coverage: {
      provider: 'v8',
      exclude: [
        '*.scss',
        'src/components/main.ts',
        'src/components/**/*.stories.ts',
      ],
      clean: true,
    },
  },
})
