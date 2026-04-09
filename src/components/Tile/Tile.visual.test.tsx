import { composeStories } from '@storybook/react'
import { beforeAll, describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Tile.stories'

const {
  HorizontalDefault,
  HorizontalHover,
  HorizontalSelected,
  HorizontalFocused,
  HorizontalDisabled,
  VerticalDefault,
  VerticalHover,
  VerticalSelected,
  VerticalFocused,
  VerticalDisabled,
} = composeStories(stories)

describe('Tile', () => {
  describe.each(themes)('%s mode', (theme) => {
    describe('horizontal layout', () => {
      beforeAll(async () => {
        await page.viewport(460, 900)
      })

      test('horizontal default', async () => {
        await render(<HorizontalDefault />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('horizontal hover', async () => {
        await render(<HorizontalHover />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('horizontal selected', async () => {
        await render(<HorizontalSelected />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('horizontal focused', async () => {
        await render(<HorizontalFocused />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('horizontal disabled', async () => {
        await render(<HorizontalDisabled />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })
    })

    describe('vertical layout', () => {
      beforeAll(async () => {
        await page.viewport(320, 900)
      })

      test('vertical default', async () => {
        await render(<VerticalDefault />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('vertical hover', async () => {
        await render(<VerticalHover />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('vertical selected', async () => {
        await render(<VerticalSelected />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('vertical focused', async () => {
        await render(<VerticalFocused />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })

      test('vertical disabled', async () => {
        await render(<VerticalDisabled />, theme)
        await expect(getWrapper()).toMatchScreenshot()
      })
    })
  })
})
