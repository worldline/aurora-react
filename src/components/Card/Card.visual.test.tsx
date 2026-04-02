import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Card.stories'

const { CardWithContent } = composeStories(stories)

describe('Card', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('with content', async () => {
      await render(<CardWithContent />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
