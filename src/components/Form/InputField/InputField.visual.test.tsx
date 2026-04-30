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
  })
})
