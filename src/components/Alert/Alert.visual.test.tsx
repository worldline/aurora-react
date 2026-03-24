import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Alert.stories'

const {
  Default,
  Success,
  Warning,
  Error: ErrorVariant,
  Closable,
  WithoutTitle,
  LongContent,
  LongTitle,
} = composeStories(stories)

describe('Alert', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default (info) variant', async () => {
      await render(<Default />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('success variant', async () => {
      await render(<Success />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('warning variant', async () => {
      await render(<Warning />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('error variant', async () => {
      await render(<ErrorVariant />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('closable', async () => {
      await render(<Closable />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('without title', async () => {
      await render(<WithoutTitle />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('long content', async () => {
      await render(<LongContent />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('long title', async () => {
      await render(<LongTitle />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
