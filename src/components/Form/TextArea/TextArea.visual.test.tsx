import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './TextArea.stories'

const {
  Small,
  Medium,
  WithValue,
  Required,
  WithTooltip,
  WithHelperText,
  WithCharacterCount,
  WithHelperTextAndCharacterCount,
  ReadOnly,
  Disabled,
  WithError,
  WithErrorMessage,
  WithErrorAndCharacterCount,
} = composeStories(stories)

describe('TextArea', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('small size', async () => {
      await render(<Small />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('medium size', async () => {
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

    test('with tooltip', async () => {
      await render(<WithTooltip />, theme)
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
