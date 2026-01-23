import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

const theme = create({
  base: 'dark',
  brandTitle: 'Aurora Design System',
  brandImage: '../src/assets/storybook/logo.svg',
  brandTarget: '_self',
})

addons.setConfig({
  theme,
})
