import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './SpeechBubble.stories'

const {
  Question,
  SystemChat,
  UserChat,
  UserChatEditable,
  UserChatLocked,
  Attachment,
  Custom,
  Conversation,
} = composeStories(stories)

describe('SpeechBubble', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('question', async () => {
      await render(<Question />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('system chat', async () => {
      await render(<SystemChat />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('user chat', async () => {
      await render(<UserChat />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('user chat editable on focus', async () => {
      const user = userEvent.setup()
      await render(<UserChatEditable />, theme)

      await user.tab()
      await expect.element(page.getByRole('tooltip')).toBeVisible()
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('user chat locked on hover', async () => {
      const user = userEvent.setup()
      await render(<UserChatLocked />, theme)
      await user.hover(getWrapper())
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('attachment', async () => {
      await render(<Attachment />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('custom', async () => {
      await render(<Custom />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('conversation', async () => {
      await render(<Conversation />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
