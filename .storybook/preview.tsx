import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { definePreview, type Decorator } from '@storybook/react-vite'
import { MINIMAL_VIEWPORTS } from 'storybook/viewport'

import '../src/styles/styles.css'
import '../src/assets/fonts/fonts.css'
import { ThemeWrapper, type Theme } from '@/__tests__/ThemeWrapper'

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as Theme

  return (
    <ThemeWrapper theme={theme}>
      <Story />
    </ThemeWrapper>
  )
}

const SbPreview = definePreview({
  decorators: [withTheme],
  addons: [addonA11y(), addonDocs()],
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      options: { xpath: true },
      test: 'error',
    },
    backgrounds: { disable: true },
    viewport: {
      options: MINIMAL_VIEWPORTS,
      disable: false,
    },
    initialGlobals: {
      // FIXME: initialGlobals setting does not work :/
      viewport: 'Small mobile',
    },
  },
})
export type { Theme }
export default SbPreview
