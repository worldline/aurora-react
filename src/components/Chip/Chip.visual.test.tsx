import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import { CheckIcon } from '../icons'

import { Chip } from '.'

const testId = 'theme-wrapper'

describe('Chip', () => {
  describe.each(themes)('%s mode', (theme) => {
    describe.each([
      'neutral',
      'brand',
      'info',
      'success',
      'warning',
      'error',
    ] as const)('%s', (type) => {
      describe.each(['small', 'large'] as const)('%s', (size) => {
        test('no icons', async () => {
          await render(<Chip label="label" size={size} type={type} />, theme)

          await expect(page.getByTestId(testId)).toMatchScreenshot()
        })
      })
    })
  })

  describe.each(['small', 'large'] as const)('%s', (size) => {
    test('with leading icon', async () => {
      await render(
        <Chip
          label="label"
          size={size}
          type="neutral"
          leadingIcon={<CheckIcon />}
        />,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })
    test('with trailing icon', async () => {
      await render(
        <Chip
          label="label"
          size={size}
          type="neutral"
          trailingIcon={<CheckIcon />}
        />,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })
    test('with leading and trailing icon', async () => {
      await render(
        <Chip
          label="label"
          size={size}
          type="neutral"
          leadingIcon={<CheckIcon />}
          trailingIcon={<CheckIcon />}
        />,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })
  })
})
