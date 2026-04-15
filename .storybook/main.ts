import { withoutVitePlugins } from '@storybook/builder-vite'
import { defineMain } from '@storybook/react-vite/node'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineMain({
  framework: '@storybook/react-vite',
  stories: [
    './Introduction.stories.tsx',
    './GetStarted.stories.tsx',
    {
      directory: '../src/components',
      files: '**/*.stories.tsx',
    },
  ],
  staticDirs: ['../src/assets/storybook'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
  ],
  async viteFinal(config) {
    return {
      ...config,
      plugins: [
        ...(await withoutVitePlugins(config.plugins, [
          'vite:dts',
          'vite:lib-inject-css',
        ])),
        tsconfigPaths(),
      ],
    }
  },
})
