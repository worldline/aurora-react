import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './InputField.stories'

const {
  Small,
  Medium,
  Large,
  WithValue,
  WithoutLabel,
  Required,
  WithLeadingIcon,
  WithTrailingIcon,
  WithLeadingAndTrailing,
  WithHelperText,
  WithCharacterCount,
  WithHelperTextAndCharacterCount,
  ReadOnly,
  Disabled,
  WithError,
  WithErrorMessage,
  WithErrorAndCharacterCount,
  Currency,
  CurrencyRequired,
  CurrencyWithHelperText,
  CurrencyWithTrailingIcon,
  CurrencyWithError,
  CurrencyDisabled,
  CurrencyReadOnly,
  CurrencyMedium,
  CurrencyLarge,
} = composeStories(stories)

describe('InputField', () => {
  describe.each(themes)('%s mode', (theme) => {
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

    test('with value', async () => {
      await render(<WithValue />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('without label', async () => {
      await render(<WithoutLabel />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('required', async () => {
      await render(<Required />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with leading icon', async () => {
      await render(<WithLeadingIcon />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with trailing icon', async () => {
      await render(<WithTrailingIcon />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with leading and trailing', async () => {
      await render(<WithLeadingAndTrailing />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with helper text', async () => {
      await render(<WithHelperText />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with character count', async () => {
      await render(<WithCharacterCount />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with helper text and character count', async () => {
      await render(<WithHelperTextAndCharacterCount />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('read-only', async () => {
      await render(<ReadOnly />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled', async () => {
      await render(<Disabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error', async () => {
      await render(<WithError />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error message', async () => {
      await render(<WithErrorMessage />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with error and character count', async () => {
      await render(<WithErrorAndCharacterCount />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency', async () => {
      await render(<Currency />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency required', async () => {
      await render(<CurrencyRequired />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency with helper text', async () => {
      await render(<CurrencyWithHelperText />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency with trailing icon', async () => {
      await render(<CurrencyWithTrailingIcon />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency with error', async () => {
      await render(<CurrencyWithError />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency disabled', async () => {
      await render(<CurrencyDisabled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency read-only', async () => {
      await render(<CurrencyReadOnly />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency medium', async () => {
      await render(<CurrencyMedium />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('currency large', async () => {
      await render(<CurrencyLarge />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
