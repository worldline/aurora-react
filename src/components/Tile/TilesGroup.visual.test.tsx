import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './TilesGroup.stories'

const { ActionItems, Selected, Disabled, MultiSelect, VerticalOrientation } =
  composeStories(stories)

describe('TilesGroup', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('action items', async () => {
      await render(<ActionItems />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('selected', async () => {
      await render(<Selected />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('multi select', async () => {
      await render(<MultiSelect />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('vertical orientation', async () => {
      await render(<VerticalOrientation />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
