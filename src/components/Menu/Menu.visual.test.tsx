import { composeStories } from '@storybook/react'
import { act } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as menuStories from './Menu.stories'

// TODO: fix "act" warnings on render. Wrapping in act or faking timers doesn't help.
// Might be due to https://github.com/adobe/react-spectrum/issues/9925

const {
  ActionMenu,
  ActionMenuWithDescriptions,
  ActionMenuWithHeader,
  ActionMenuWithSections,
  ActionMenuWithHeaderAndSections,
  SelectionMenu,
  SelectionMenuWithSections,
  DisabledItems,
  LongText,
  InPopover,
  DynamicMenu,
} = composeStories(menuStories)

describe('Menu', () => {
  describe.each(themes)('%s mode', (theme) => {
    beforeEach(async () => {
      // Unhover to avoid hover styles
      const user = userEvent.setup()
      await user.unhover(document.body)
    })

    test('action menu', async () => {
      await render(<ActionMenu />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('action menu with hover', async () => {
      const user = userEvent.setup()
      await render(<ActionMenu />, theme)
      await user.hover(getWrapper().getByRole('menuitem', { name: 'Option 2' }))
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('action menu with descriptions', async () => {
      await render(<ActionMenuWithDescriptions />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('action menu with header', async () => {
      await render(<ActionMenuWithHeader />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('action menu with sections', async () => {
      await render(<ActionMenuWithSections />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('action menu with header and sections', async () => {
      await render(<ActionMenuWithHeaderAndSections />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('selection menu', async () => {
      await render(<SelectionMenu />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('selection menu with sections', async () => {
      await render(<SelectionMenuWithSections />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('dynamic menu', async () => {
      await render(<DynamicMenu />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('disabled items', async () => {
      await render(<DisabledItems />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('long text', async () => {
      await render(<LongText />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('in popover', async () => {
      await render(<InPopover />, theme)

      const button = page.getByRole('button', { name: 'Open menu' })
      await act(async () => {
        await button.click()
      })

      await expect(document.querySelector('body')).toMatchScreenshot()
    })
  })
})
