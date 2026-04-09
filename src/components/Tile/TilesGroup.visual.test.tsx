import { composeStories } from '@storybook/react'
import { beforeAll, describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './TilesGroup.stories'

const { ActionItems, Selected, Disabled, MultiSelect, VerticalOrientation } =
  composeStories(stories)

describe('TilesGroup', () => {
  describe.each(themes)('%s mode', (theme) => {
    describe('horizontal layout', () => {
      beforeAll(async () => {
        await page.viewport(460, 900)
      })

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
    })

    describe('vertical layout', () => {
      beforeAll(async () => {
        await page.viewport(320, 900)
      })

      test('vertical orientation', async () => {
        await render(<VerticalOrientation />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })
    })
  })
})
