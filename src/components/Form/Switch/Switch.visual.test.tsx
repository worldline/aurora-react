import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import { Switch } from '.'

const testId = 'theme-wrapper'

describe('Switch', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('default (off)', async () => {
      await render(<Switch aria-label="Switch feature" />, theme)

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('selected (on)', async () => {
      await render(
        <Switch aria-label="Switch feature" defaultSelected />,
        theme,
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('disabled off', async () => {
      await render(<Switch aria-label="Switch feature" isDisabled />, theme)

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('disabled on', async () => {
      await render(
        <Switch aria-label="Switch feature" isDisabled defaultSelected />,
        theme,
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('with label', async () => {
      await render(<Switch label="Enable feature" />, theme)

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('with label and description', async () => {
      await render(
        <Switch
          label="Enable feature"
          description="Turns on push notifications"
        />,
        theme,
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('disabled with label and description', async () => {
      await render(
        <Switch
          label="Enable feature"
          description="Turns on push notifications"
          isDisabled
        />,
        theme,
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })
  })
})
