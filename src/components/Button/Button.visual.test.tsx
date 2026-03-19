import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Button.stories'

const { Primary, Secondary, Link, Small, Medium, Large, Disabled } =
  composeStories(stories)

describe('Button', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('primary variant', async () => {
      await render(<Primary />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('secondary variant', async () => {
      await render(<Secondary />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('link variant', async () => {
      await render(<Link />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('small size', async () => {
      await render(<Small />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('medium size', async () => {
      await render(<Medium />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('large size', async () => {
      await render(<Large />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled state', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
