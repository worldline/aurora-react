import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config'

import { baseConfig } from './vite.config'

const playwrightBrowserConfig = () => ({
  connectTimeout: 30000, // container is already up; 30s is enough
  provider: playwright({
    connectOptions: {
      wsEndpoint: process.env.PLAYWRIGHT_WS_ENDPOINT ?? 'ws://0.0.0.0:3100',
      exposeNetwork: '<loopback>',
    },
  }),
  instances: [{ browser: 'chromium' as const }],
})

// Typed explicitly: `mergeConfig` returns `Record<string, any>`, so without it
// the object literal below loses contextual typing.
const testConfig: ViteUserConfig = {
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
        'src/components/icons/**',
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
          include: ['./src/**/*.visual.test.tsx'],
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
                  root,
                  testName,
                  browserName,
                  ext,
                  testFileDirectory,
                  testFileName,
                }) =>
                  path.join(
                    root,
                    testFileDirectory,
                    '__screenshots__',
                    testFileName,
                    `${testName}-${browserName}${ext}`,
                  ),
              },
            },
            ...playwrightBrowserConfig(),
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
            ...playwrightBrowserConfig(),
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
}

export default defineConfig(mergeConfig(baseConfig, testConfig))
