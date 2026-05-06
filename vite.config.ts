/// <reference types="vitest/config" />
import { createHash } from 'node:crypto'
import path, { extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { globSync } from 'glob'
import preserveDirectives from 'rollup-preserve-directives'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
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
    outputFile: {
      html: './.vitest-reports/index.html',
    },
    coverage: {
      provider: 'v8',
      exclude: [
        '*.scss',
        'src/components/main.ts',
        'src/components/**/*.stories.ts',
      ],
      clean: true,
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
          exclude: ['./src/**/*.visual.test.tsx'],
        },
      },
      {
        extends: true,
        test: {
          name: 'visual',
          // TODO: Disable visual regression tests until the Git LFS issue is resolved
          include: [],
          globalSetup: './__tests__/visual/globalSetup.ts',
          setupFiles: ['./__tests__/visual/setupVitest.ts'],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            viewport: {
              // mobile-xs (smallest breakpoint)
              width: 360,
              height: 640,
            },
            expect: {
              toMatchScreenshot: {
                comparatorOptions: {
                  threshold: 0.025,
                  allowedMismatchedPixels: 3,
                },
                screenshotOptions: {
                  animations: 'disabled',
                },
                resolveScreenshotPath: ({
                  testName,
                  browserName,
                  ext,
                  testFileDirectory,
                  testFileName,
                }) =>
                  `${testFileDirectory}/__screenshots__/${testFileName}/${testName}-${browserName}${ext}`,
              },
            },
            provider: playwright({
              connectOptions: {
                wsEndpoint: process.env.CI
                  ? 'ws://aurora-react-playwright:3000'
                  : 'ws://0.0.0.0:3100',
                exposeNetwork: '<loopback>',
              },
            }),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(
              typeof __dirname !== 'undefined'
                ? __dirname
                : path.dirname(fileURLToPath(import.meta.url)),
              '.storybook',
            ),
            tags: {
              exclude: ['notest'],
            },
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  resolve: {
    tsconfigPaths: true,
  },
})
