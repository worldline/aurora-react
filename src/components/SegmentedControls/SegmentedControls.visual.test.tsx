import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as segmentedControlsStories from './SegmentedControls.stories'

const { Default, NoSelection, WithIcons, Vertical } = composeStories(
  segmentedControlsStories,
)

describe('SegmentedControls', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default', async () => {
      await render(<Default />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('default with hover', async () => {
      await render(<Default />, theme)
      const spanElement = getWrapper()
        .getByText('Option 2', { exact: true })
        .element()
      const labelElement = spanElement.parentElement
      if (labelElement === null) {
        throw new Error('Option 2 label not found')
      }
      await page.elementLocator(labelElement).hover()
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('no selection', async () => {
      await render(<NoSelection />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with icons', async () => {
      await render(<WithIcons />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('vertical', async () => {
      await render(<Vertical />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
