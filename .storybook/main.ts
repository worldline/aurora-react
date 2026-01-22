import { withoutVitePlugins } from '@storybook/builder-vite'
import { defineMain } from '@storybook/react-vite/node'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineMain({
  framework: '@storybook/react-vite',
  stories: [
    './Welcome.stories.tsx',
    {
      directory: '../src/components',
      files: '**/*.stories.tsx',
    },
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
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
