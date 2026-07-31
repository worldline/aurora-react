import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
  framework: '@storybook/react-vite',
  stories: [
    './Introduction.stories.tsx',
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
})
