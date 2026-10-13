import { composeStories } from '@storybook/react'
import { afterEach, describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Autocomplete.stories'

const {
  Small,
  Medium,
  Large,
  Required,
  WithTooltip,
  WithHelperText,
  WithErrorMessage,
  WithSelectedOption,
  Disabled,
  ReadOnly,
  WithFooterAction,
  Mobile,
} = composeStories(stories)

// The browser viewport is fixed to mobile-xs (360x640) for every visual test,
// which is under the component's own mobile breakpoint. Opening the popover
// combobox (as opposed to the bottom sheet) therefore requires a wider
// viewport, restored afterwards so later tests keep seeing the mobile layout.
const openOptionList = async () => {
  await page.viewport(1024, 768)
  await page.getByRole('combobox', { name: 'Address' }).click()
}

const openSheet = async () => {
  await page.getByRole('button', { name: /^Address/ }).click()
}

afterEach(async () => {
  await page.viewport(360, 640)
})

describe('Autocomplete', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('Small size', async () => {
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

    test('required', async () => {
      await render(<Required />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with tooltip', async () => {
      await render(<WithTooltip />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with helper text', async () => {
      await render(<WithHelperText />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error message', async () => {
      await render(<WithErrorMessage />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with selected option', async () => {
      await render(<WithSelectedOption />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('read only', async () => {
      await render(<ReadOnly />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('open option list', async () => {
      await render(<Small />, theme)
      await openOptionList()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('open option list with footer action', async () => {
      await render(<WithFooterAction />, theme)
      await openOptionList()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('mobile', async () => {
      await render(<Mobile />, theme)
      await openSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
