import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { definePreview, type Decorator } from '@storybook/react-vite'
import { useEffect } from 'react'
import { MINIMAL_VIEWPORTS } from 'storybook/viewport'

import '../src/styles/variables.css'
import '../src/styles/style.css'
import '../src/styles/darkmode.css'
import '../src/styles/large.css'
import '../src/styles/small.css'

type Theme = 'light' | 'dark'

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
    },
    backgrounds: { disable: true },
    viewport: {
      options: MINIMAL_VIEWPORTS,
      disable: false,
    },
    initialGlobals: {
      // FIXME: initialGlobals setting does not work :/
      viewport: 'Small mobile',
      theme: 'dark',
    },
  },
})
export default SbPreview

const ThemeWrapper = ({
  theme,
  children,
}: {
  theme: Theme
  children: React.ReactNode
}) => {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Also add to body in case components check parent
    body.classList.remove('light', 'dark')
    body.classList.add(theme)

    // Apply theme colors using CSS variables
    body.style.backgroundColor = 'var(--au-background-base-default)'
    body.style.color = 'var(--au-content-neutral-base)'
  }, [theme])

  return children
}
