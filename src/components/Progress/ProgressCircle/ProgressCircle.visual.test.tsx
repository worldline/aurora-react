import { describe, expect, test } from 'vitest'

import { themes } from '@/__tests__/ThemeWrapper'
import { getWrapper, render } from '@/__tests__/visual/testUtils'

import { ProgressCircle } from '.'

describe('ProgressCircle', () => {
  describe.each(themes)('%s mode', (theme) => {
    test('partial progress (4/5)', async () => {
      await render(
        <ProgressCircle value={4} maxValue={5} aria-label="Upload progress" />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('partial progress (1/3)', async () => {
      await render(
        <ProgressCircle
          value={1}
          minValue={0}
          maxValue={3}
          aria-label="Upload progress"
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('empty (0/5)', async () => {
      await render(
        <ProgressCircle
          value={0}
          minValue={0}
          maxValue={5}
          aria-label="Progress"
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })

    test('complete (5/5)', async () => {
      await render(
        <ProgressCircle
          value={5}
          maxValue={5}
          aria-label="Progress complete"
        />,
        theme,
      )
      await expect(getWrapper()).toMatchScreenshot()
    })
  })
})
