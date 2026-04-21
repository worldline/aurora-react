import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import * as modalStories from './Modal.stories'

const {
  CenterAligned,
  LeftAligned,
  RightAligned,
  WithoutActions,
  WithoutCloseButton,
  WithoutSecondaryAction,
  WithoutSecondaryActionLeft,
  LeftActionsAlignment,
  RightActionsAlignment,
} = composeStories(modalStories)

const openModal = async () => {
  const trigger = page.getByRole('button', { name: 'Open Modal' })
  await trigger.click()
}

describe('Modal', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('center aligned', async () => {
      await render(<CenterAligned />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('left aligned', async () => {
      await render(<LeftAligned />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('right aligned', async () => {
      await render(<RightAligned />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without actions', async () => {
      await render(<WithoutActions />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without close button', async () => {
      await render(<WithoutCloseButton />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without secondary action', async () => {
      await render(<WithoutSecondaryAction />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })

    test('without secondary action left', async () => {
      await render(<WithoutSecondaryActionLeft />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
    test('align actions left', async () => {
      await render(<LeftActionsAlignment />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
    test('align action right', async () => {
      await render(<RightActionsAlignment />, theme)
      await openModal()
      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
