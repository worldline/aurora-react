import { composeStories } from '@storybook/react'
import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import * as stories from './Stepper.stories'

const {
  CheckType,
  NumberType,
  IconType,
  IconTypeTitleOnly,
  AllStepsNotStarted,
  AllStepsCompleted,
  AllStepsCompletedMultiline,
} = composeStories(stories)

describe('Stepper', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('check type', async () => {
      await render(<CheckType />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('number type', async () => {
      await render(<NumberType />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('icon type', async () => {
      await render(<IconType />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('icon type title only', async () => {
      await render(<IconTypeTitleOnly />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('all steps not started', async () => {
      await render(<AllStepsNotStarted />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('all steps completed', async () => {
      await render(<AllStepsCompleted />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('all steps completed multiline', async () => {
      await render(<AllStepsCompletedMultiline />, theme)
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
