import { composeStories } from '@storybook/react-vite'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Filter.stories'

const {
  Default,
  SingleSelection,
  WithLeadingIcons,
  Removable,
  RemovableWithIcons,
  RemovableWithSelection,
  WithDisabledItems,
  PreSelected,
  Controlled,
} = composeStories(stories)

describe('FilterGroup', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default', async () => {
      await render(<Default />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('single selection', async () => {
      await render(<SingleSelection />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with leading icons', async () => {
      await render(<WithLeadingIcons />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('removable', async () => {
      await render(<Removable />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('removable with icons', async () => {
      await render(<RemovableWithIcons />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('removable with selection', async () => {
      await render(<RemovableWithSelection />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('with disabled items', async () => {
      await render(<WithDisabledItems />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('pre selected', async () => {
      await render(<PreSelected />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('controlled', async () => {
      await render(<Controlled />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
