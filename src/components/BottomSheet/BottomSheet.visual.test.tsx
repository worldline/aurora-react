import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import * as bottomSheetStories from './BottomSheet.stories'

const {
  Small,
  Medium,
  Large,
  Content,
  WithoutActions,
  WithoutSecondaryAction,
  WithoutContentPadding,
} = composeStories(bottomSheetStories)

const openBottomSheet = async () => {
  const trigger = page.getByRole('button', { name: 'Open bottom sheet' })
  await trigger.click()
}

describe('BottomSheet', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('small', async () => {
      await render(<Small />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('medium', async () => {
      await render(<Medium />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('large', async () => {
      await render(<Large />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('content', async () => {
      await render(<Content />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without actions', async () => {
      await render(<WithoutActions />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without secondary action', async () => {
      await render(<WithoutSecondaryAction />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without content padding', async () => {
      await render(<WithoutContentPadding />, theme)
      await openBottomSheet()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
