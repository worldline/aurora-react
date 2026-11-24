import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './DateRangePicker.stories'

const {
  Small,
  Medium,
  WithValue,
  Required,
  WithOptionalLabel,
  ReadOnly,
  Disabled,
  WithTooltip,
  WithErrorMessage,
  WithErrorAndValue,
  WithoutLabel,
  Composite,
  CompositeWithoutDateField,
  CompositeWithoutActions,
  CompositeWithoutPresets,
} = composeStories(stories)

const openCompositeSheet = async () => {
  const trigger = page.getByRole('button', { name: 'Select date range' })
  await trigger.click()
}

describe('DateRangePicker', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('small', async () => {
      await render(<Small />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('medium', async () => {
      await render(<Medium />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with value', async () => {
      await render(<WithValue />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('required', async () => {
      await render(<Required />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with optional label', async () => {
      await render(<WithOptionalLabel />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('read only', async () => {
      await render(<ReadOnly />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with tooltip', async () => {
      await render(<WithTooltip />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error message', async () => {
      await render(<WithErrorMessage />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error and value', async () => {
      await render(<WithErrorAndValue />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('without label', async () => {
      await render(<WithoutLabel />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('composite', async () => {
      await render(<Composite />, theme)
      await openCompositeSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('composite without date field', async () => {
      await render(<CompositeWithoutDateField />, theme)
      await openCompositeSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('composite without actions', async () => {
      await render(<CompositeWithoutActions />, theme)
      await openCompositeSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('composite without presets', async () => {
      await render(<CompositeWithoutPresets />, theme)
      await openCompositeSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
