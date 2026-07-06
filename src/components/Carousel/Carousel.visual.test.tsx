import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Carousel.stories'

const { Default, WithDefaultIndex, WithGridRows } = composeStories(stories)

describe('Carousel', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('first slide — prev disabled', async () => {
      await render(<Default />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('slide at index 2', async () => {
      await render(<WithDefaultIndex />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('grid rows layout', async () => {
      await render(<WithGridRows />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
