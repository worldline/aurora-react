import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import { Checkbox } from '.'

describe('Checkbox', () => {
  describe.each(themes)('%s mode', (theme) => {
    describe.each(['small', 'medium'] as const)('%s', (size) => {
      test('default (unchecked)', async () => {
        await render(
          <Checkbox size={size} aria-label="Default checkbox" />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('checked', async () => {
        await render(
          <Checkbox
            size={size}
            defaultSelected
            aria-label="Checked checkbox"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('indeterminate', async () => {
        await render(
          <Checkbox
            size={size}
            isIndeterminate
            aria-label="Indeterminate checkbox"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('disabled', async () => {
        await render(
          <Checkbox size={size} isDisabled aria-label="Disabled checkbox" />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('disabled checked', async () => {
        await render(
          <Checkbox
            size={size}
            isDisabled
            defaultSelected
            aria-label="Disabled checked checkbox"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('disabled indeterminate', async () => {
        await render(
          <Checkbox
            size={size}
            isDisabled
            isIndeterminate
            aria-label="Disabled indeterminate checkbox"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('with title', async () => {
        await render(
          <Checkbox size={size} title="Accept terms and conditions" />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('with title and helper text', async () => {
        await render(
          <Checkbox
            size={size}
            title="Enable notifications"
            helperText="Receive updates about your account activity"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('error state', async () => {
        await render(
          <Checkbox
            size={size}
            title="Accept terms"
            helperText="Read the full terms and conditions"
            error="You must accept the terms to continue"
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })

      test('error state checked', async () => {
        await render(
          <Checkbox
            size={size}
            title="Invalid selection"
            helperText="This option is restricted"
            error="This option cannot be selected"
            defaultSelected
          />,
          theme,
        )

        await expect(getWrapper()).toMatchScreenshot()
      })
    })
  })
})
