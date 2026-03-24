import { describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { themes } from '@/__tests__/ThemeWrapper'
import { render } from '@/__tests__/visual/testUtils'

import { AddIcon, CheckIcon } from '../icons'

import { Button } from '.'

const testId = 'theme-wrapper'

describe('Button', () => {
  describe.each(themes)('%s mode', (theme) => {
    describe.each(['primary', 'secondary', 'link'] as const)(
      '%s',
      (variant) => {
        describe.each(['small', 'medium', 'large'] as const)('%s', (size) => {
          test('without icons', async () => {
            await render(
              <Button size={size} variant={variant}>
                {variant} {size} Button
              </Button>,
              theme,
            )

            await expect(page.getByTestId(testId)).toMatchScreenshot()
          })
        })
      },
    )
  })

  describe.each(['small', 'medium', 'large'] as const)('%s', (size) => {
    test('leading icon', async () => {
      await render(
        <Button size={size} variant="primary" leadingIcon={<CheckIcon />}>
          {size} Button
        </Button>,
        'dark',
      )
      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('trailing icon', async () => {
      await render(
        <Button size={size} variant="primary" trailingIcon={<CheckIcon />}>
          {size} Button
        </Button>,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('leading and trailing icon', async () => {
      await render(
        <Button
          size={size}
          variant="primary"
          leadingIcon={<CheckIcon />}
          trailingIcon={<CheckIcon />}
        >
          {size} Button
        </Button>,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })

    test('pending state', async () => {
      await render(
        <Button size={size} variant="primary" isPending>
          {size} Button
        </Button>,
        'dark',
      )

      await expect(page.getByTestId(testId)).toMatchScreenshot()
    })
  })

  describe.each(['primary', 'secondary', 'link'] as const)(
    'icon only %s',
    (variant) => {
      test('renders icon only button', async () => {
        await render(
          <Button variant={variant} aria-label="Add">
            <AddIcon aria-hidden />
          </Button>,
          'dark',
        )

        await expect(page.getByTestId(testId)).toMatchScreenshot()
      })
    },
  )
})
