import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './InputField.stories'

const {
  Small,
  Medium,
  WithValue,
  WithoutLabel,
  ReadOnly,
  Disabled,
  WithError,
  WithErrorMessage,
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

    test('with value', async () => {
      await render(<WithValue />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('without label', async () => {
      await render(<WithoutLabel />, theme)
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
  })
})
