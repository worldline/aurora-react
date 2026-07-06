import sbPreview, { type Theme } from './preview'

const defaultTheme = sbPreview.composed.globalTypes?.theme.defaultValue as
  Theme | undefined
if (!defaultTheme) {
  throw new Error(
    'Default theme is not defined in Storybook preview configuration',
  )
}
document.documentElement.classList.add(defaultTheme)
