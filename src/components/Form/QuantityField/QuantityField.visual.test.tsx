import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './QuantityField.stories'

const {
  Filled,
  WithLabel,
  Required,
  WithHelperText,
  Focused,
  ReadOnly,
  Disabled,
  Error,
  Minimum,
  Maximum,
  FourDigitMaximum,
  NegativeFourDigitMinimum,
} = composeStories(stories)

describe('QuantityField', () => {
  describe.each(themes)('%s mode', (theme) => {
    test.each([
      ['filled', Filled],
      ['with-label', WithLabel],
      ['required', Required],
      ['with-helper-text', WithHelperText],
      ['focused', Focused],
      ['read-only', ReadOnly],
      ['disabled', Disabled],
      ['error', Error],
      ['minimum', Minimum],
      ['maximum', Maximum],
      ['four-digit-maximum', FourDigitMaximum],
      ['negative-four-digit-minimum', NegativeFourDigitMinimum],
    ])('%s', async (_name, Story) => {
      await render(<Story />, theme)

      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
